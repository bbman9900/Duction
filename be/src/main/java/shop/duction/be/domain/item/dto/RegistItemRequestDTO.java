package shop.duction.be.domain.item.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public record RegistItemRequestDTO (
  String name,
  String description,
  String itemCondition,
  Float rareScore,
  Integer startingBid,
  LocalDateTime endTime,
  Integer immediateBid,
  Integer communityId,
  List<String> itemImages
) {

}
