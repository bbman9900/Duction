package shop.duction.be.domain.community.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.duction.be.domain.community.dto.CommunityListResponseDTO;
import shop.duction.be.domain.community.dto.PopularCommunitiesResponseDto;
import shop.duction.be.domain.community.entity.Community;
import shop.duction.be.domain.community.entity.FavoriteCommunity;
import shop.duction.be.domain.community.repository.CommunityRepository;
import shop.duction.be.domain.community.repository.FavoriteCommunityRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CommunityService {

  private final CommunityRepository communityRepository;
  private final FavoriteCommunityRepository favoriteCommunityRepository;

  public Map<String, List<CommunityListResponseDTO>>  getCommunities(Integer userId) {
    List<Community> communities = communityRepository.findAllByOrderByFirstWordAsc();
    List<Integer> ids = favoriteCommunityRepository.findIdsByUserId(userId);
    return communities.stream()
            .collect(Collectors.groupingBy(
                    Community::getFirstWord,
                    Collectors.mapping(community ->
                            new CommunityListResponseDTO(
                                    community.getCommunityId(),
                                    community.getName(),
                                    ids.contains(community.getCommunityId())
                            ), Collectors.toList()
                    )));
  }

  public List<PopularCommunitiesResponseDto> getPopularCommunitiesByViews(Integer userId) {
    List<PopularCommunitiesResponseDto> top10Communities = communityRepository.findPopularCommunitiesByViews()
            .stream()
            .limit(10)
            .toList();

    if (userId != null) {
      List<Integer> communityIds = top10Communities.stream()
              .map(PopularCommunitiesResponseDto::getCommunityId)
              .toList();

      List<Integer> ids = favoriteCommunityRepository.findFavoriteCommunitiesByUserAndCommunityIds(userId, communityIds);

      return top10Communities.stream()
              .peek(community -> {
                boolean isFavorite = ids.contains(community.getCommunityId());
                community.setFavorite(isFavorite);
              })
              .toList();
    }

    return top10Communities;
  }
}