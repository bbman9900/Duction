package shop.duction.be.domain.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.duction.be.domain.admin.dto.*;
import shop.duction.be.domain.admin.entity.CommunityCreateRequest;
import shop.duction.be.domain.admin.entity.ItemDeleteRequest;
import shop.duction.be.domain.admin.repository.CommunityCreateRequestRepository;
import shop.duction.be.domain.admin.repository.ItemDeleteRequestRepository;
import shop.duction.be.domain.bidpoint.entity.BidHistory;
import shop.duction.be.domain.bidpoint.enums.BidPointType;
import shop.duction.be.domain.bidpoint.repository.BidHistoryRepository;
import shop.duction.be.domain.community.entity.Community;
import shop.duction.be.domain.community.repository.CommunityRepository;
import shop.duction.be.domain.item.entity.Item;
import shop.duction.be.domain.item.enums.AuctionStatus;
import shop.duction.be.domain.item.repository.ItemRepository;
import shop.duction.be.domain.item.service.ItemService;
import shop.duction.be.domain.ship.dto.ShipRequestDto;
import shop.duction.be.domain.ship.entity.BidderShip;
import shop.duction.be.domain.ship.entity.ExhibitorShip;
import shop.duction.be.domain.ship.enums.DeliveryId;
import shop.duction.be.domain.ship.repository.BidderShipRepository;
import shop.duction.be.domain.user.entity.User;
import shop.duction.be.domain.user.enums.IsActive;
import shop.duction.be.domain.user.repository.UserRepository;
import shop.duction.be.exception.ItemNotFoundException;
import shop.duction.be.utils.DateTimeUtils;
import shop.duction.be.utils.InitialExtractor;
import shop.duction.be.utils.email.EmailMessageInfo;
import shop.duction.be.utils.email.SendEamilMessage;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {
  private final CommunityCreateRequestRepository communityCreateRequestRepository;
  private final ItemDeleteRequestRepository itemDeleteRequestRepository;
  private final ItemRepository itemRepository;
  private final CommunityRepository communityRepository;
  private final UserRepository userRepository;
  private final BidderShipRepository bidderShipRepository;
  private final BidHistoryRepository bidHistoryRepository;

  private final ItemService itemService;

  private final SendEamilMessage sendEamilMessage;

  public ResponseEntity<String> postCreateCommunity(CreateCommunityRequestDto request, Integer userId) {
    User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자가 없습니다"));

    CommunityCreateRequest communityCreateRequest = new CommunityCreateRequest();
    communityCreateRequest.setName(request.getName());
    communityCreateRequest.setRequestReason(request.getRequestReason());
    communityCreateRequest.setUser(user);
    communityCreateRequest.setRequestTime(LocalDateTime.now());
    CommunityCreateRequest save = communityCreateRequestRepository.save(communityCreateRequest);
    return save !=null ? ResponseEntity.ok("커뮤니티 개설 요청 완료") : ResponseEntity.badRequest().build();
  }

  public List<CreateCommunityResponseDto> getCreateCommunityData() {
    List<CommunityCreateRequest> all = communityCreateRequestRepository.findAll();

    return all.stream().map(request -> {
      return new CreateCommunityResponseDto(
              request.getUser().getNickname(),
              request.getUser().getEmail(),
              request.getRequestId(),
              request.getName(),
              request.getRequestReason(),
              DateTimeUtils.yearDateTimeFormatter.format(request.getRequestTime()));
    }).toList();
  }

  public ResponseEntity<String> createCommunity(String communityName, Integer requestId) {
    Community community = new Community();
    community.setName(communityName);
    community.setFirstWord(InitialExtractor.getFirstChar(communityName));
    community.setRegistTime(LocalDateTime.now());
    Community save = communityRepository.save(community);
    communityCreateRequestRepository.deleteById(requestId);
    return save != null ? ResponseEntity.ok("커뮤니티 개설 완료") : ResponseEntity.notFound().build();
  }

  public ResponseEntity<String> postRejectCommunity(RejectInfoRequestDto request) {
    communityCreateRequestRepository.deleteById(request.getRequestId());
    String rejectSubject = SendEamilMessage.createRejectSubject(request.getTitle());
    String rejectBody = SendEamilMessage.createRejectBody(request.getTitle(), request.getRejectReason());
    EmailMessageInfo eamilMessageInfo = new EmailMessageInfo(request.getEmail(), rejectSubject, rejectBody);
    sendEamilMessage.sendMail(eamilMessageInfo);
    return ResponseEntity.ok("커뮤니티 요청 반려 완료");
  }

  // 삭제 요청 관련
  public ResponseEntity<String> postDeleteItemData(DeleteItemRequestDto request, Integer userId) {
    User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자가 없습니다"));
    Item item = itemRepository.findById(request.getItemId())
            .orElseThrow(() -> new ItemNotFoundException("Item with ID " + request.getItemId() + " not found"));

    ItemDeleteRequest itemDeleteRequest = new ItemDeleteRequest();
    itemDeleteRequest.setTitle(request.getTitle());
    itemDeleteRequest.setRequestReason(request.getRequestReason());
    itemDeleteRequest.setUser(user);
    itemDeleteRequest.setRequestTime(LocalDateTime.now());
    itemDeleteRequest.setItem(item);
    ItemDeleteRequest save = itemDeleteRequestRepository.save(itemDeleteRequest);
    return save !=null ? ResponseEntity.ok("출품 상품 삭제 요청 완료") : ResponseEntity.badRequest().build();
  }

  public List<DeleteItemResponseDto> getDeleteItemData() {
    List<ItemDeleteRequest> all = itemDeleteRequestRepository.findAll();
    return all.stream().map(request -> {
      return new DeleteItemResponseDto(
              request.getItem().getItemId(),
              request.getItem().getName(),
              request.getRequestId(),
              request.getUser().getNickname(),
              request.getUser().getEmail(),
              "타이틀은 엔티티에 제목 추가한 후에 넣기로",
              request.getRequestReason(),
              DateTimeUtils.yearDateTimeFormatter.format(request.getRequestTime()));
    }).toList();
  }

  public ResponseEntity<String> deleteItemData(Integer itemId, Integer requestId) {
    itemRepository.deleteById(itemId);
    return ResponseEntity.ok("삭제 완료");
  }

  public ResponseEntity<String> postRejectDeleteItem(RejectInfoRequestDto request) {
    itemDeleteRequestRepository.deleteById(request.getRequestId());
    String rejectSubject = SendEamilMessage.createRejectSubject(request.getTitle());
    String rejectBody = SendEamilMessage.createRejectBodyForDeleteItem(request.getTitle(), request.getRejectReason());
    EmailMessageInfo eamilMessageInfo = new EmailMessageInfo(request.getEmail(), rejectSubject, rejectBody);
    sendEamilMessage.sendMail(eamilMessageInfo);
    return ResponseEntity.ok("삭제 요청 반려 완료");
  }

  // 신고 관련
  public List<ReportInfoResponseDto> getReportData() {
    return itemRepository.findAllReportInfos();
  }

  public ResponseEntity<String> submitReport(Integer itemId, String rejectReason) {
    Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new ItemNotFoundException("Item with ID " + itemId + " not found"));

    String itemName = item.getName();
    String email = item.getUser().getEmail();

    switch (item.getAuctionStatus()) {
      case BIDDING_BEFORE:
        break;

      case BIDDING_NOT:
        // 입찰 전, 낙찰 실패 -> 삭제
        itemRepository.deleteById(itemId);
        break;

      case BIDDED:
        // 낙찰된 상품 -> 낙찰 취소
        itemService.cancelBidded(item);
        item.setReportedCount(0);
        itemRepository.save(item);
        break;

      case BIDDING_UNDER:
        // 입찰 중 -> 입찰 비드 반환 후 삭제
        itemService.refundBidPoints(item);
        itemRepository.deleteById(itemId);
        break;

      default:
        // 경매 완료 -> 삭제 불가
        return ResponseEntity.ok("상품 삭제 불가합니다. 반려해 주세요.");
    }

    String cancelSubject = SendEamilMessage.createCancelSubject(itemName);
    String submitReportBody = SendEamilMessage.createSubmitReportBody(itemName, rejectReason);
    EmailMessageInfo emailMessageInfo = new EmailMessageInfo(email, cancelSubject, submitReportBody);
    sendEamilMessage.sendMail(emailMessageInfo);

    return ResponseEntity.ok("신고 상품 취소 완료");
  }

  public ResponseEntity<String> cancelReport(Integer itemId) {
    Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new ItemNotFoundException("Item with ID " + itemId + " not found"));
    item.setReportedCount(0);
    itemRepository.save(item);
    return ResponseEntity.ok("신고 상품 반려 완료");
  }

  // 검수 관련
  public List<ValidateItemInfoResponseDto> getValidateItemData() {
    List<Item> items = itemRepository.findCheckedItems();
    return items.stream().map(item -> {
      return new ValidateItemInfoResponseDto(
              item.getItemId(),
              item.getName(),
              DateTimeUtils.yearDateTimeFormatter.format(item.getEndBidTime()));
    }).toList();
  }

  public ResponseEntity<String> validateItemOk(ShipRequestDto request, Integer userId) {
    // 경매 완료로 상태 변환 & 검수 완료 변환
    Item item = itemRepository.findById(request.getItemId())
            .orElseThrow(() -> new ItemNotFoundException("Item with ID " + request.getItemId() + " not found"));
    item.setAuctionStatus(AuctionStatus.AUCTION_COMPLETE);
    item.setIsChecked(true);

    Integer price = item.getBiddedHistory().getPrice();

    // 출품자 보유 비드 + 낙찰 비드
    User exhibitor = item.getUser();
    exhibitor.setHeldBid(exhibitor.getHeldBid() + price);
    BidHistory exhibitorBidHistory = BidHistory.create(
            price, BidPointType.EARNING_BID, exhibitor, item.getBiddedHistory(), item.getExhibitHistory()
    );
    bidHistoryRepository.save(exhibitorBidHistory);

    // 낙찰자 보유 비드 - 낙찰 비드
    User bidder = item.getBiddedHistory().getUser();
    bidder.setHeldBid(bidder.getHeldBid() - price); // 낙찰자는 사용 가능 비드 감소
    BidHistory bidderBidHistory = BidHistory.create(
            price, BidPointType.BIDDED, bidder, item.getBiddedHistory(), item.getExhibitHistory()
    );
    bidHistoryRepository.save(bidderBidHistory);

    // 배송 번호 저장
    BidderShip bidderShip = new BidderShip();
    DeliveryId deliveryId = DeliveryId.valueOf(request.getDeliveryId());
    bidderShip.setDeliveryId(deliveryId);
    bidderShip.setPostNumber(request.getPostNumber());
    bidderShip.setUser(bidder);
    bidderShip.setItem(item);
    bidderShipRepository.save(bidderShip);

    return ResponseEntity.ok("배송 번호 입력 완료");
  }

  public ResponseEntity<String> validateItemReject(Integer itemId) {
    Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new ItemNotFoundException("Item with ID " + itemId + " not found"));
    // 낙찰 취소
    itemService.cancelBidded(item);

    // 출품자 평가 0점으로 업데이트
    User exhibitor = item.getUser();
    exhibitor.setRate(0.0F);
    exhibitor.setPenaltyCount(exhibitor.getPenaltyCount() + 1);

    // 패널티 3번 확인 후 영구 이용 정지
    Integer penaltyCount = exhibitor.getPenaltyCount();
    if (penaltyCount >= 3) {
      exhibitor.setIsActive(IsActive.SUSPENDED);
    }

    userRepository.save(exhibitor);

    item.setIsChecked(true);
    itemRepository.save(item);

    return ResponseEntity.ok("상품 검수 반려 완료");
  }
}
