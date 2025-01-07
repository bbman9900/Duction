package shop.duction.be.domain.ship.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.duction.be.domain.ship.dto.ShipRequestDto;
import shop.duction.be.domain.ship.dto.ShipInfoResponseDto;
import shop.duction.be.domain.ship.service.ShipService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/ship")
@RequiredArgsConstructor
public class ShipController {
  private final ShipService shipService;

  @GetMapping("/biddership/{itemId}")
  public ShipInfoResponseDto getBiddershipInvoice(@PathVariable Integer itemId) {
    return shipService.getBiddershipInvoice(itemId);
  }

  @GetMapping("/shipping/deadline/{itemId}")
  public String getShippingDeadline(@RequestAttribute("userId") Integer userId, @PathVariable Integer itemId) {
    return shipService.getShippingDeadline(itemId, userId);
  }

  @PostMapping("/exhibitorship")
  public ResponseEntity<String> postExhibitorShipInvoice(
          @RequestAttribute("userId") Integer userId,
          @RequestBody ShipRequestDto exhibitorShipInfoRequestDto) {
    return shipService.postExhibitorShipInvoice(exhibitorShipInfoRequestDto, userId);
  }
}