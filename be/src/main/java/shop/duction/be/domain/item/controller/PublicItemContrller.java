package shop.duction.be.domain.item.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.duction.be.domain.item.dto.AuctionItemsRequestDto;
import shop.duction.be.domain.item.dto.ItemCardResponseDto;
import shop.duction.be.domain.item.dto.ViewItemDetailsResponseDTO;
import shop.duction.be.domain.item.service.ItemService;
import shop.duction.be.exception.ItemNotFoundException;
import shop.duction.be.utils.HttpStatusConstants;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@Tag(name = "userId가 꼭 필요하진 않음")
public class PublicItemContrller {
  private final ItemService itemService;

  @PostMapping("/auction")
  @Operation(summary = "출품 상품 목록 불러오기")
  public Page<ItemCardResponseDto> getItemsByCommunityId(
          @RequestAttribute("userId") Integer userId,
          @RequestBody AuctionItemsRequestDto auctionItemsRequestDto) {
    return itemService.getItemsByCommunityId(auctionItemsRequestDto, userId);
  }

  @GetMapping("/detail/{itemId}")
  @Operation(summary = "출품 상품 상세 보기")
  public ResponseEntity<?> getItemDetails(@PathVariable("itemId") Integer itemId) {
    try {
      ViewItemDetailsResponseDTO dto = itemService.readItemDetails(itemId);
      return ResponseEntity.status(HttpStatusConstants.OK).body(dto); // 200 OK 사용
    } catch (ItemNotFoundException e) {
      return ResponseEntity.status(HttpStatusConstants.NOT_FOUND).body("Item not found"); // 404 NOT FOUND
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatusConstants.BAD_REQUEST).body("Invalid input"); // 400 BAD REQUEST
    }
  }

  @GetMapping("/closingsoon")
  @Operation(summary = "마감 임박 상품 보기")
  public List<ItemCardResponseDto> getClosingSoonItems(@RequestAttribute("userId") Integer userId) {
    return itemService.getClosingSoonItems(userId);
  }

  @GetMapping("/mastersrare")
  @Operation(summary = "마스터 컬렉터즈 레어 상품 보기")
  public List<ItemCardResponseDto> getMastersCollectorsRare(@RequestAttribute("userId") Integer userId) {
    return itemService.getMastersCollectorsRare(userId);
  }
}
