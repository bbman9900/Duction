package shop.duction.be.domain.community.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import shop.duction.be.domain.community.dto.CommunityListResponseDTO;
import shop.duction.be.domain.community.dto.PopularCommunitiesResponseDto;
import shop.duction.be.domain.community.service.CommunityService;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/communities")
@Tag(name = "커뮤니티")
public class CommunityController {

  private final CommunityService communityService;

  @GetMapping
  public Map<String, List<CommunityListResponseDTO>> getCommunities(@RequestAttribute("userId") Integer userId) {
    return communityService.getCommunities(userId);
  }

  @GetMapping("/popular")
  public List<PopularCommunitiesResponseDto> getPopularCommunities(@RequestAttribute("userId") Integer userId) {
    return communityService.getPopularCommunitiesByViews(userId);
  }
}
