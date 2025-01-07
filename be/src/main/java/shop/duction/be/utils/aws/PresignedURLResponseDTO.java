package shop.duction.be.utils.aws;

import lombok.Builder;
@Builder
public record PresignedURLResponseDTO(
        String uploadUrl,
        String publicUrl,
        String key
) {}
