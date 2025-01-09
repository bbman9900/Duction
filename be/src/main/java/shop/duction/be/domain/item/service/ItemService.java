package shop.duction.be.domain.item.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import shop.duction.be.domain.community.entity.Community;
import shop.duction.be.domain.community.repository.CommunityRepository;
import shop.duction.be.domain.bidding.entity.BiddedHistory;
import shop.duction.be.domain.bidding.entity.BiddingHistory;
import shop.duction.be.domain.bidding.entity.ExhibitHistory;
import shop.duction.be.domain.bidding.enums.BiddedStatus;
import shop.duction.be.domain.bidding.enums.BiddingStatus;
import shop.duction.be.domain.bidding.enums.ExhibitStatus;
import shop.duction.be.domain.bidding.repository.BiddingHistoryRepository;
import shop.duction.be.domain.bidding.repository.ExhibitHistoryRepository;
import shop.duction.be.domain.bidpoint.entity.BidHistory;
import shop.duction.be.domain.bidpoint.enums.BidPointType;
import shop.duction.be.domain.bidpoint.repository.BidHistoryRepository;
import shop.duction.be.domain.item.dto.*;
import shop.duction.be.domain.item.entity.Item;
import shop.duction.be.domain.item.entity.ItemImage;
import shop.duction.be.domain.item.entity.RareRating;
import shop.duction.be.domain.item.entity.UserItemKey;
import shop.duction.be.domain.item.enums.AuctionStatus;
import shop.duction.be.domain.item.enums.ItemCondition;
import shop.duction.be.domain.item.repository.ItemImageRepository;
import shop.duction.be.domain.item.repository.ItemRepository;
import shop.duction.be.domain.item.repository.RareRatingRepository;
import shop.duction.be.domain.user.entity.User;
import shop.duction.be.domain.user.repository.UserRepository;
import shop.duction.be.exception.ItemNotFoundException;
import shop.duction.be.domain.item.enums.RareTier;
import shop.duction.be.domain.item.repository.FavoriteItemRepository;
import shop.duction.be.utils.*;
import shop.duction.be.utils.aws.CloudFrontUrlGenerator;
import shop.duction.be.utils.aws.S3Controller;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ItemService {
  private final ItemRepository itemRepository;
  private final FavoriteItemRepository favoriteItemRepository;
  private final CommunityRepository communityRepository;
  private final ItemImageRepository itemImageRepository;
  private final UserRepository userRepository;
  private final RareRatingRepository rareRatingRepository;
  private final BiddingHistoryRepository biddingHistoryRepository;
  private final ExhibitHistoryRepository exhibitHistoryRepository;
  private final BidHistoryRepository bidHisotryRepository;
  private final CloudFrontUrlGenerator cloudFrontUrlGenerator;
  private final S3Controller s3Controller;

  public ViewItemEditResponseDTO readItemEdit(int itemId) {
    Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new ItemNotFoundException("Item with ID " + itemId + " not found"));

    List<ItemImage> itemImages = item.getItemImages();
    List<String> imageUrls = new ArrayList<>();
    if (item.getItemImages() != null && !item.getItemImages().isEmpty()) {
      for (ItemImage image : itemImages) {
        imageUrls.add(image.getUrl());
      }
    }

    ViewItemEditResponseDTO dto = new ViewItemEditResponseDTO(
            item.getName(),
            imageUrls,
            item.getDescription(),
            item.getItemCondition(),
            item.getRareScore(),
            item.getStartPrice(),
            item.getEndTime(),
            item.getImmediatePrice()
    );

    return dto;
  }

  public String updateItem(int itemId, EditItemRequestDTO dto) {
    Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new ItemNotFoundException("Item with ID " + itemId + " not found"));

    item.setName(dto.itemName());
    item.setDescription(dto.description());
    item.setItemCondition(dto.itemCondition());
    item.setRareScore(dto.rareScore());
    item.setStartPrice(dto.startPrice());
    item.setEndBidTime(dto.endTime());
    item.setImmediatePrice(dto.immediatePrice());

    // 삭제 요청 처리
    if (dto.removeImageUrls() != null && !dto.removeImageUrls().isEmpty()) {
      // 기존 ItemImage 리스트에서 삭제할 URL 제거
      try {
        for (String removeUrl : dto.removeImageUrls()) {
          s3Controller.deleteFile(removeUrl);
          itemImageRepository.deleteByUrl(removeUrl);
        }
      } catch (Exception e) {
        log.info("이미지 삭제 에러");
      }
    }

    // 추가 요청 처리
    if (dto.addImageUrls() != null && !dto.addImageUrls().isEmpty()) {
      for (String imageUrl : dto.addImageUrls()) {
        // 새 URL을 가진 ItemImage 객체 생성 및 추가
        ItemImage newImage = ItemImage.builder()
                .url(imageUrl)
                .item(item)
                .build();
        ItemImage saved = itemImageRepository.save(newImage);
        item.addItemImage(saved);
      }
    }
    itemRepository.save(item);

    return "Item with ID " + itemId + " has been updated successfully!";
  }
  
  public List<ItemCardResponseDto> getClosingSoonItems(Integer userId) {
    Pageable pageable = PageRequest.of(0, 5);
    List<String > status = List.of("BIDDING_BEFORE", "BIDDING_UNDER");
    List<Item> top5Items = itemRepository.findClosingSoonItemsByViews(pageable, status);

    List<Integer> favoiteItemIds = userId != null
            ? getFavoriteItemIds(userId, top5Items)
            : List.of();

    return top5Items.stream()
            .map(item -> changeToItemCardResponseDto(item, favoiteItemIds.contains(item.getItemId()))
            ).toList();
  }

  public List<ItemCardResponseDto> getMastersCollectorsRare(Integer userId) {
    Pageable pageable = PageRequest.of(0, 10);
    List<Item> top10Items = itemRepository.findMasterRareItemsByPrice(pageable, RareTier.MASTER_COLLECTORS_RARE);

    List<Integer> favoiteItemIds = userId != null
            ? getFavoriteItemIds(userId, top10Items)
            : List.of();

    return top10Items.stream()
            .map(item -> changeToItemCardResponseDto(item,favoiteItemIds.contains(item.getItemId())))
            .toList();
  }

  public ItemCardResponseDto changeToItemCardResponseDto(Item item, boolean isFavorite) {
    return new ItemCardResponseDto(
            item.getItemId(),
            item.getCommunity().getCommunityId(),
            item.getCommunity().getName(),
            item.getName(),
            item.getItemImages().get(0).getUrl(),
            calculatePriceInfo(item),
            null,
            item.getAuctionStatus().getAuctionStatusMessage(),
            isFavorite);
  }

  public ItemCardResponseDto.PriceInfo calculatePriceInfo(Item item) {
    if (item.getImmediatePrice() != null) {
      return new ItemCardResponseDto.PriceInfo(item.getImmediatePrice(), "즉시 낙찰가");
    } else if (item.getNowPrice() != null) {
      return new ItemCardResponseDto.PriceInfo(item.getNowPrice(), "현재 입찰가");
    } else {
      return new ItemCardResponseDto.PriceInfo(item.getStartPrice(), "시작가");
    }
  }

  public List<Integer> getFavoriteItemIds(Integer userId, List<Item> items) {
    List<Integer> ids = items.stream().map(Item::getItemId).toList();
    return favoriteItemRepository.findeFavoriteItemsByUserAndItemIds(userId, ids);
  }

  public Integer createItem(int userId, RegistItemRequestDTO dto) {
    Community community = communityRepository.findById(dto.communityId()).get();
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new ItemNotFoundException("User with ID " + userId + " not found"));

    // 레어 등급 판정
    RareTier rareTier = RareTierCheckUtils.rareCheck(dto.rareScore());

    ItemCondition itemCondition = ItemCondition.fromString(dto.itemCondition());

    LocalDateTime now = LocalDateTime.now();

    // 출품 상품 등록
    Item item = Item.builder()
            .name(dto.name())
            .startPrice(dto.startingBid())
            .immediatePrice(dto.immediateBid()) // null 가능
            .endTime(dto.endTime())
            .description(dto.description())
            .auctionStatus(AuctionStatus.BIDDING_NOT)
            .itemCondition(itemCondition)
            .rareScore(dto.rareScore())
            .rareTier(rareTier)
            .isModified(false)
            .isChecked(false)
            .reportedCount(0)
            .registTime(now)
            .endBidTime(null)
            .totalView(0)
            .totalBidding(0)
            .community(community)
            .user(user)
            .build();

    Item savedItem = itemRepository.save(item);

    // 상품 사진 추가
    List<ItemImage> itemImages = new ArrayList<>();
    if (dto.itemImages() != null && !dto.itemImages().isEmpty()) {
      for (String imageUrl : dto.itemImages()) {
        // 새 URL을 가진 ItemImage 객체 생성 및 저장
        ItemImage newImage = ItemImage.builder()
                .url(imageUrl)
                .item(savedItem)
                .build();
        itemImages.add(newImage);

        itemImageRepository.save(newImage);
      }
    }

    savedItem.setItemImages(itemImages);
    Item savedItem2 = itemRepository.save(savedItem);



    // 최초 레어 등급 평가
    UserItemKey userItemKey = new UserItemKey(user.getUserId(), savedItem2.getItemId());

    RareRating rareRating = RareRating.builder()
            .id(userItemKey)
            .user(user)
            .item(savedItem2)
            .rareScore(dto.rareScore())
            .build();
    rareRatingRepository.save(rareRating);

    // 출품 이력 등록
    ExhibitHistory exhibitHistory = ExhibitHistory.builder()
            .registTime(now)
            .status(ExhibitStatus.BIDDING_NOT)
            .user(user)
            .item(savedItem2)
            .build();
    exhibitHistoryRepository.save(exhibitHistory);

    return savedItem2.getItemId();
  }


  public ViewItemDetailsResponseDTO readItemDetails(int itemId) {
    Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new ItemNotFoundException("Item with ID " + itemId + " not found"));

    List<ItemImage> itemImages = item.getItemImages();
    List<String> imageUrls = new ArrayList<>();
    if (item.getItemImages() != null && !item.getItemImages().isEmpty()) {
      for (ItemImage image : itemImages) {
        cloudFrontUrlGenerator.generateCloudFrontUrl(image.getUrl());
        imageUrls.add(image.getUrl());
      }
    }

    ViewItemDetailsResponseDTO dto = ViewItemDetailsResponseDTO.builder()
            .communityId(item.getCommunity().getCommunityId())
            .communityName(item.getCommunity().getName())
            .itemId(item.getItemId())
            .itemName(item.getName())
            .images(imageUrls)
            .description(item.getDescription())
            .itemCondition(ItemConditionConverter.convert(item.getItemCondition()))
            .rareTier(RareTierConverter.convert(item.getRareTier()))
            .startPrice(item.getStartPrice())
            .endTime(item.getEndTime())
            .nowPrice(item.getNowPrice())
            .totalView(item.getTotalView())
            .totalBidding(item.getTotalBidding())
            .exhibitorNickName(item.getUser().getNickname())
            .exhibitorRate(item.getUser().getRate())
            .immediatePrice(item.getImmediatePrice())
            .build();

    return dto;
  }

  public String createOrUpdateRareRating(int itemId, int userId, ItemRareScoreRequestDTO dto) {
    Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new ItemNotFoundException("Item with ID " + itemId + " not found"));
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new ItemNotFoundException("User with ID " + userId + " not found"));

    UserItemKey userItemKey = new UserItemKey(itemId, userId);

    Optional<RareRating> rareRating = rareRatingRepository.findById(userItemKey);
    RareRating newRating;
    float newAverageRareScore;


    if (rareRating.isPresent()) {
      // rareRating 값이 존재하는 경우: Update
      RareRating existingRating = rareRating.get();
      Float previousRareScore = existingRating.getRareScore();
      existingRating.setRareScore(dto.rareScore());
      rareRatingRepository.save(existingRating);

      // 평균 rareScore, rareTier 업데이트 (추후 간소화)
      int rareScoreCount = rareRatingRepository.countById_ItemId(itemId);
      Float previousAverageRareScore = item.getRareScore();
      newAverageRareScore = (rareScoreCount * previousAverageRareScore - previousRareScore + dto.rareScore()) / rareScoreCount;
    } else {
      // rareRating 값이 없는 경우: Create
      newRating = RareRating.builder()
              .id(userItemKey)
              .user(user)
              .item(item)
              .rareScore(dto.rareScore())
              .build();
      rareRatingRepository.save(newRating);

      // 평균 rareScore, rareTier 업데이트
      newAverageRareScore = (item.getRareScore() + dto.rareScore()) / 2;
    }

    RareTier newRareTier = RareTierCheck.rareCheck(newAverageRareScore);
    item.setRareScore(newAverageRareScore);
    item.setRareTier(newRareTier);
    itemRepository.save(item);

    return rareRating.isPresent() ? "Rare rating updated successfully." : "Rare rating created successfully.";
  }

  public String report(int itemId, int userId) {
    Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new ItemNotFoundException("Item with ID " + itemId + " not found"));
    userRepository.findById(userId)
            .orElseThrow(() -> new ItemNotFoundException("User with ID " + userId + " not found"));

    item.setReportedCount(item.getReportedCount() + 1);

    return "Report updated successfully";
  }

  public HistoriesCountResponseDto getHistoriesCount(Integer userId) {
    HistoriesCountResponseDto responseDto = new HistoriesCountResponseDto();

    HistoriesCountResponseDto.ExhibitDetails exhibitHistoriesCounts = itemRepository.findExhibitHistoriesCounts();
    responseDto.setExhibit(exhibitHistoriesCounts);

    HistoriesCountResponseDto.BiddingDetails biddingHistoriesCounts = itemRepository.findBiddingHistoriesCounts();
    responseDto.setBidding(biddingHistoriesCounts);

    return responseDto;
  }

  public ArrayList<BiddingHistoriesResponseDto> getBiddingHistory(HistoriesRequestDto request, Integer userId) {
    LocalDateTime startDay = DateTimeUtils.getStartOfMonth(request.getYear(), request.getMonth());
    LocalDateTime endDay = DateTimeUtils.getEndOfMonth(request.getYear(), request.getMonth());

    List<String> types = switch (request.getSortType()) {
      case "all" -> Arrays.stream(BiddingStatus.values()).map(Enum::name).toList();
      case "bidding" -> List.of(BiddingStatus.BIDDING.toString());
      case "bidded" -> List.of(BiddingStatus.BIDDED.toString());
      case "biddedFail" -> List.of(BiddingStatus.BID_FAIL.toString(), BiddingStatus.BIDDING_GIVE_UP.toString());
      default -> throw new IllegalStateException("Unexpected value: " + request.getSortType());
    };

    List<BiddingHistory> biddingHistories = biddingHistoryRepository.findBidHistoriesByTypesAndDate(userId, startDay, endDay, types);

    Map<Integer, BiddingHistoriesResponseDto> mapData = new LinkedHashMap<>();

    for (BiddingHistory history : biddingHistories) {
      Integer itemId = history.getItem().getItemId();

      mapData.computeIfAbsent(itemId, id -> {
        BiddingHistoriesResponseDto dto = new BiddingHistoriesResponseDto();
        dto.setInfo(new BiddingHistoriesResponseDto.Info(
                history.getItem().getCommunity().getCommunityId(),
                history.getItem().getItemId(),
                history.getItem().getName(),
                history.getItem().getItemImages().isEmpty() ? null : history.getItem().getItemImages().get(0).getUrl(),
                history.getItem().getTotalBidding(),
                history.getItem().getRareTier().name(),
                history.getItem().getUser().getUserId(),
                getFavoriteItemIds(userId, List.of(history.getItem())).contains(history.getItem().getItemId())
        ));
        dto.setHistories(new ArrayList<>());
        return dto;
      });

      mapData.get(itemId).getHistories().add(new BiddingHistoriesResponseDto.History(
              DateTimeUtils.dateTimeFormatter.format(history.getBidTime()),
              String.valueOf(history.getPrice())
      ));
    }

    return new ArrayList<>(mapData.values());
  }

  public List<ItemCardResponseDto> getExhibitHistory(HistoriesRequestDto request, Integer userId) {
    LocalDateTime startDay = DateTimeUtils.getStartOfMonth(request.getYear(), request.getMonth());
    LocalDateTime endDay = DateTimeUtils.getEndOfMonth(request.getYear(), request.getMonth());

    List<String> types = switch (request.getSortType()) {
      case "all" -> Arrays.stream(ExhibitStatus.values()).map(Enum::name).toList();
      case "biddingUnder" -> List.of(ExhibitStatus.BIDDING_UNDER.toString());
      case "bidded" -> List.of(ExhibitStatus.BIDDED.toString());
      case "biddedNot" -> List.of(ExhibitStatus.BIDDING_NOT.toString());
      case "biddedCancel" -> List.of(ExhibitStatus.BIDDED_CANCEL.toString());
      default -> throw new IllegalStateException("Unexpected value: " + request.getSortType());
    };

    List<ExhibitHistory> exhibitHistories = exhibitHistoryRepository.findExhibitHistoryByUserAndStatus(userId, startDay, endDay, types);

    return exhibitHistories.stream()
            .map(history ->
                    ItemCardResponseDto.fromItem(
                            history.getItem(),
                            getFavoriteItemIds(userId, List.of(history.getItem())).contains(history.getItem().getItemId())))
            .toList();
  }

  public Page<ItemCardResponseDto> getItemsByCommunityId(AuctionItemsRequestDto request, Integer userId) {
    int page = Math.max(request.getCurrentPage() - 1, 0);
    Pageable pageable = PageRequest.of(page, 20);
    Page<Item> items = itemRepository.findItems(request.getCommunityId(),  request.getSearchText(), pageable);
    List<ItemCardResponseDto> itemDtos = new ArrayList<>(items.stream()
            .map(item -> ItemCardResponseDto.fromItem(item, getFavoriteItemIds(userId, List.of(item)).contains(item.getItemId())))
            .toList());

    if ("price_asc".equals(request.getSortOption())) {
      itemDtos.sort(Comparator.<ItemCardResponseDto, Integer>comparing(dto -> {
        if (dto.getPriceInfo() != null) return dto.getPriceInfo().getPrice();
        return Integer.MAX_VALUE;
      }));
    } else if ("price_desc".equals(request.getSortOption())) {
      itemDtos.sort(Comparator.<ItemCardResponseDto, Integer>comparing(dto -> {
        if (dto.getPriceInfo() != null) return dto.getPriceInfo().getPrice();
        return Integer.MIN_VALUE;
      }).reversed());
    }

    return new PageImpl<>(itemDtos, pageable, items.getTotalElements());
  }

  // 낙찰 취소
  public void cancelBidded(Item item) {
    // 출품자 비드 변동 사항 없음

    // 낙찰자 사용 가능 비드 + 낙찰 비드
    User bidder = item.getBiddedHistory().getUser();
    Integer price = item.getBiddedHistory().getPrice();
    bidder.setUsableBid(bidder.getUsableBid() + price);

    // 아이템 낙찰 취소 업데이트
    item.setAuctionStatus(AuctionStatus.BIDDED_CANCEL);

    // 낙찰 이력 낙찰 취소 업데이트
    BiddedHistory biddedHistory = item.getBiddedHistory();
    biddedHistory.setStatus(BiddedStatus.BIDDED_CANCEL);
    itemRepository.save(item);

    // 출품자가 배송했을 경우 처리 -> 미정
  }

  // 비드 돌려주기
  public void refundBidPoints(Item item) {
    List<BiddingHistory> biddingHistories = biddingHistoryRepository.findByItem_ItemId(item.getItemId());

    biddingHistories.forEach(history -> {
      int price = history.getPrice();
      User user = history.getUser();

      // 사용자 비드 업데이트
      user.setUsableBid(user.getUsableBid() + price);

      // 비드 히스토리 생성 및 저장
      BidHistory bidHistory = new BidHistory();
      bidHistory.setBidAmount(price);
      bidHistory.setType(BidPointType.CANCELLATION_BID);
      bidHistory.setTransactionTime(LocalDateTime.now());
      bidHistory.setUser(user);

      ExhibitHistory exhibitHistory = item.getExhibitHistory();
      if (exhibitHistory != null) {
        bidHistory.setExhibitHistory(exhibitHistory);
      }

      bidHisotryRepository.save(bidHistory);
    });
  }
}
