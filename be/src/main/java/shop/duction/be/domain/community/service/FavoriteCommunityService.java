package shop.duction.be.domain.community.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.duction.be.domain.community.entity.Community;
import shop.duction.be.domain.community.entity.FavoriteCommunity;
import shop.duction.be.domain.community.entity.FavoriteCommunityId;
import shop.duction.be.domain.community.repository.CommunityRepository;
import shop.duction.be.domain.community.repository.FavoriteCommunityRepository;
import shop.duction.be.domain.user.entity.User;
import shop.duction.be.domain.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class FavoriteCommunityService {
  private final FavoriteCommunityRepository favoriteCommunityRepository;
  private final UserRepository userRepository;
  private final CommunityRepository communityRepository;

  public void addFavoriteCommunity(Integer communityId, Integer userId) {
    User user = userRepository.findById(userId).orElseThrow(() ->
            new IllegalArgumentException("사용자를 찾을 수 없습니다"));

    Community community = communityRepository.findById(communityId).orElseThrow(() ->
            new IllegalArgumentException("카테고리를 찾을 수 없습니다"));

    FavoriteCommunityId favoriteCommunityId = new FavoriteCommunityId(communityId, userId);
    FavoriteCommunity favoriteCommunity = new FavoriteCommunity();
    favoriteCommunity.setFavoriteCommunityId(favoriteCommunityId);
    favoriteCommunity.setRegistDate(LocalDateTime.now());
    favoriteCommunity.setUser(user);
    favoriteCommunity.setCommunity(community);

    favoriteCommunityRepository.save(favoriteCommunity);
  }

  public void deleteFavoriteCommunity(int communityId, int userId) {
    FavoriteCommunityId favoriteCommunityId = new FavoriteCommunityId(userId, communityId);
    favoriteCommunityRepository.deleteById(favoriteCommunityId);
  }
}
