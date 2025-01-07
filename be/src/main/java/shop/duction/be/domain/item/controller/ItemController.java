package shop.duction.be.domain.item.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import shop.duction.be.domain.item.dto.*;
import shop.duction.be.domain.item.service.ItemService;
import shop.duction.be.exception.ItemNotFoundException;
import shop.duction.be.utils.HttpStatusConstants;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@Tag(name = "출품 상품")
public class ItemController {
  private final ItemService itemService;

  @GetMapping("/editing/{itemId}")
  @Operation(summary = "수정할 상품 정보 보기")
  public ResponseEntity<?> getItemEdit(@PathVariable int itemId) {
    try {
      ViewItemEditResponseDTO dto = itemService.readItemEdit(itemId);
      return ResponseEntity.status(HttpStatusConstants.OK).body(dto); // 200 OK 사용
    } catch (ItemNotFoundException e) {
      return ResponseEntity.status(HttpStatusConstants.NOT_FOUND).body("Item not found"); // 404 NOT FOUND
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatusConstants.BAD_REQUEST).body("Invalid input"); // 400 BAD REQUEST
    }
  }

  @PutMapping("/editing/{itemId}")
  @Operation(summary = "상품 수정하기")
  public ResponseEntity<String> putItemEdit(@PathVariable int itemId, @RequestBody EditItemRequestDTO dto) {
    try {
      String result = itemService.updateItem(itemId, dto);
      return ResponseEntity.status(HttpStatusConstants.OK).body(result); // 200 OK 사용
    } catch (ItemNotFoundException e) {
      return ResponseEntity.status(HttpStatusConstants.NOT_FOUND).body("Item not found"); // 404 NOT FOUND
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatusConstants.BAD_REQUEST).body("Invalid input"); // 400 BAD REQUEST
    }
  }

  @PostMapping()
  @Operation(summary = "상품 등록하기")
  public ResponseEntity<?> postItem(@RequestBody RegistItemRequestDTO dto) {
    try {
      int userId = 1;
      Integer result = itemService.createItem(userId, dto);
      return ResponseEntity.status(HttpStatusConstants.OK).body(result); // 200 OK 사용
    } catch (ItemNotFoundException e) {
      return ResponseEntity.status(HttpStatusConstants.NOT_FOUND)
              .body("Item not found"); // 404 NOT FOUND
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatusConstants.BAD_REQUEST)
              .body("Invalid input"); // 400 BAD REQUEST
    }
  }

//  @PostMapping("/regist")
//  @Operation(summary = "상품 등록하기")
//  public ResponseEntity<?> postItem(
//          @RequestAttribute("userId") Integer userId,
//          @RequestParam("itemImages") List<MultipartFile> itemImages,
//          @RequestParam("name") String name,
//          @RequestParam("description") String description,
//          @RequestParam("itemCondition") String itemCondition,
//          @RequestParam("rareScore") Float rareScore,
//          @RequestParam("startingBid") Integer startingBid,
//          @RequestParam("endTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
//          @RequestParam("immediateBid") Integer immediateBid,
//          @RequestParam("communityId") Integer communityId) {
//    try {
//      RegistItemRequestDTO dto = new RegistItemRequestDTO(
//              name, description, itemCondition, rareScore, startingBid, endTime, immediateBid, communityId
//      );
//      List<String> fileUrls = new ArrayList<>();
//
//      for (MultipartFile file : itemImages) {
//        String fileUrl = s3UploaderService.uploadImageFile(file, "items");
//        fileUrls.add(fileUrl);
//      }
//
//      Integer result = itemService.createItem(userId, dto, fileUrls);
//      return ResponseEntity.status(HttpStatusConstants.OK).body(result); // 200 OK 사용
//    } catch (ItemNotFoundException e) {
//      return ResponseEntity.status(HttpStatusConstants.NOT_FOUND)
//              .body("Item not found"); // 404 NOT FOUND
//    } catch (IllegalArgumentException e) {
//      return ResponseEntity.status(HttpStatusConstants.BAD_REQUEST)
//              .body("Invalid input"); // 400 BAD REQUEST
//    } catch (IOException e) {
//      throw new RuntimeException(e);
//    }
//  }

  @PostMapping("/{itemId}/rare_score")
  @Operation(summary = "출품 상품 레어 점수 평가")
  public ResponseEntity<?> postItemRareScore(
          @RequestAttribute("userId") Integer userId,
          @PathVariable int itemId, @RequestBody ItemRareScoreRequestDTO dto) {
    try {
      String result = itemService.createOrUpdateRareRating(itemId, userId, dto);
      return ResponseEntity.status(HttpStatusConstants.OK).body(result); // 200 OK 사용
    } catch (ItemNotFoundException e) {
      return ResponseEntity.status(HttpStatusConstants.NOT_FOUND).body("Item not found"); // 404 NOT FOUND
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatusConstants.BAD_REQUEST).body("Invalid input"); // 400 BAD REQUEST
    }
  };

  @PutMapping("/{itemId}/report")
  @Operation(summary = "신고하기")
  public ResponseEntity<?> putReport(@RequestAttribute("userId") Integer userId, @PathVariable int itemId) {
    try {
      String result = itemService.report(itemId, userId);
      return ResponseEntity.status(HttpStatusConstants.OK).body(result); // 200 OK 사용
    } catch (ItemNotFoundException e) {
      return ResponseEntity.status(HttpStatusConstants.NOT_FOUND).body("Item not found"); // 404 NOT FOUND
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatusConstants.BAD_REQUEST).body("Invalid input"); // 400 BAD REQUEST
    }
  };

  @GetMapping("/histories/count")
  @Operation(summary = "이력 횟수 불러오기")
  public HistoriesCountResponseDto getHistoriesCount(@RequestAttribute("userId") Integer userId) {
    return itemService.getHistoriesCount(userId);
  }

  @PostMapping("/histories/bidding")
  @Operation(summary = "입찰 이력 불러오기")
  public ArrayList<BiddingHistoriesResponseDto> getBiddingHistory(
          @RequestAttribute("userId") Integer userId,
          @RequestBody HistoriesRequestDto historiesRequestDto) {
    return itemService.getBiddingHistory(historiesRequestDto, userId);
  }

  @PostMapping("/histories/exhibit")
  @Operation(summary = "출품 이력 불러오기")
  public List<ItemCardResponseDto> getExhibitHistory(
          @RequestAttribute("userId") Integer userId,
          @RequestBody HistoriesRequestDto historiesRequestDto) {
    return itemService.getExhibitHistory(historiesRequestDto, userId);
  }
}
