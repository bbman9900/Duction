package shop.duction.be.domain.bidpoint.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.duction.be.domain.bidpoint.dto.BidPointHistoriesRequestDto;
import shop.duction.be.domain.bidpoint.dto.BidPointHistoriesResponseDto;
import shop.duction.be.domain.bidpoint.dto.UserBidPointResponse;
import shop.duction.be.domain.bidpoint.enums.BidPointType;
import shop.duction.be.domain.bidpoint.service.BidPointService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/bidpoint")
@Tag(name = "비드 이력")
public class BidPointController {
  private final BidPointService bidPointService;

  @GetMapping("/user")
  public UserBidPointResponse getUserBidPoint(@RequestAttribute("userId") Integer userId) {
    return bidPointService.getUserBidPoint(userId);
  }

  @PostMapping("/histories")
  public List<BidPointHistoriesResponseDto> getBidPointHistories(
          @RequestAttribute("userId") Integer userId,
          @RequestBody BidPointHistoriesRequestDto request) {
    return bidPointService.getBidPointHistories(request, userId);
  }

  @PostMapping("/charge/{bidPoint}")
  public ResponseEntity<String> addChargeBidPoint(
          @RequestAttribute("userId") Integer userId,
          @PathVariable("bidPoint") Integer bidPoint) {
    return handleBidPointUpdate(bidPoint, BidPointType.CHARGE, userId);
  }

  @PostMapping("/withdrwal/{bidPoint}")
  public ResponseEntity<String> addWithdrawBidPoint(
          @RequestAttribute("userId") Integer userId,
          @PathVariable("bidPoint") Integer bidPoint) {
    return handleBidPointUpdate(bidPoint, BidPointType.WITHDRAWAL, userId);
  }

  private ResponseEntity<String> handleBidPointUpdate(Integer bidPoint, BidPointType type, Integer userId) {
    try {
      bidPointService.updateBidPoint(bidPoint, userId, type);
      return ResponseEntity.ok(type == BidPointType.CHARGE ? "충전 성공" : "현금화 성공");
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했어요. 다시 시도해 주세요");
    }
  }
}
