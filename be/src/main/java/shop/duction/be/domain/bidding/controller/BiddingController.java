package shop.duction.be.domain.bidding.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.duction.be.domain.bidding.dto.BidRequestDTO;
import shop.duction.be.domain.bidding.service.BiddingService;
import shop.duction.be.domain.item.service.ItemService;
import shop.duction.be.exception.ItemNotFoundException;
import shop.duction.be.utils.HttpStatusConstants;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/items/bdding")
@RequiredArgsConstructor
@Tag(name = "경매")
public class BiddingController {
  private final BiddingService biddingService;

  @PostMapping("/{itemId}/bidding")
  @Operation(summary = "입찰하기")
  public ResponseEntity<?> postBidding(
          @RequestAttribute("userId") Integer userId,
          @PathVariable int itemId,
          @RequestBody BidRequestDTO dto) {
    try {
      String result = biddingService.bidding(itemId, userId, dto);
      return ResponseEntity.status(HttpStatusConstants.OK).body(result); // 200 OK 사용
    } catch (ItemNotFoundException e) {
      return ResponseEntity.status(HttpStatusConstants.NOT_FOUND).body("Item not found"); // 404 NOT FOUND
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatusConstants.BAD_REQUEST).body("Invalid input"); // 400 BAD REQUEST
    }
  };

  @PutMapping("/{itemId}/giveup")
  @Operation(summary = "입찰 포기")
  public ResponseEntity<?> putBiddingGiveup(@RequestAttribute("userId") Integer userId, @PathVariable int itemId) {
    try {
      String result = biddingService.biddingGiveup(itemId, userId);
      return ResponseEntity.status(HttpStatusConstants.OK).body(result); // 200 OK 사용
    } catch (ItemNotFoundException e) {
      return ResponseEntity.status(HttpStatusConstants.NOT_FOUND).body("Item not found"); // 404 NOT FOUND
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatusConstants.BAD_REQUEST).body("Invalid Request: You cannot cancel the bid if it is the highest bid."); // 400 BAD REQUEST
    }
  };

  @PostMapping("/{itemId}/immediatebidding")
  @Operation(summary = "즉시 낙찰")
  public ResponseEntity<?> postImmediateBidding(@RequestAttribute("userId") Integer userId, @PathVariable int itemId) {
    try {
      String result = biddingService.immediateBidding(itemId, userId);
      return ResponseEntity.status(HttpStatusConstants.OK).body(result); // 200 OK 사용
    } catch (ItemNotFoundException e) {
      return ResponseEntity.status(HttpStatusConstants.NOT_FOUND).body("Item not found"); // 404 NOT FOUND
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatusConstants.BAD_REQUEST).body("Invalid input"); // 400 BAD REQUEST
    }
  };
}
