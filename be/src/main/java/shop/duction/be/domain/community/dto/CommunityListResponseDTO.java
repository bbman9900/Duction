package shop.duction.be.domain.community.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommunityListResponseDTO {
    private Integer communityId;
    private String name;
    private boolean isFavorite;
}


