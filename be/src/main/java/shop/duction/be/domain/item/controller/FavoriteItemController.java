package shop.duction.be.domain.item.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import shop.duction.be.domain.item.dto.ItemCardResponseDto;
import shop.duction.be.domain.item.service.FavoriteItemService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/items/favorites")
@Tag(name = "관심 출품 상품")
public class FavoriteItemController {
  private final FavoriteItemService favoriteItemService;

  @PostMapping("/add/{itemId}")
  public void addFavoriteItem(
          @RequestAttribute("userId") Integer userId,
          @PathVariable int itemId) {
    favoriteItemService.addFavoriteItem(itemId, userId);
  }

  @DeleteMapping("/delete/{itemId}")
  public void deleteFavoriteItem(
          @RequestAttribute("userId") Integer userId,
          @PathVariable int itemId) {
    favoriteItemService.deleteFavoriteItem(itemId, userId);
  }

  @GetMapping("/histories")
  public List<ItemCardResponseDto> getFavoriteItems(@RequestAttribute("userId") Integer userId) {
    return favoriteItemService.getFavoriteItems(userId);
  }
}
