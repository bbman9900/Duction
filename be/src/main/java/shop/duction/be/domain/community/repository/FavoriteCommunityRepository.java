package shop.duction.be.domain.community.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import shop.duction.be.domain.community.entity.FavoriteCommunity;
import shop.duction.be.domain.community.entity.FavoriteCommunityId;
import shop.duction.be.domain.user.entity.User;

import java.util.List;

@Repository
public interface FavoriteCommunityRepository extends JpaRepository<FavoriteCommunity, FavoriteCommunityId> {
  @Query("""
            SELECT fc.favoriteCommunityId.communityId
            FROM FavoriteCommunity fc
            WHERE fc.favoriteCommunityId.userId = :userId AND fc.favoriteCommunityId.communityId IN :communityIds
         """)
  List<Integer> findFavoriteCommunitiesByUserAndCommunityIds(@Param("userId") Integer userId, @Param("communityIds") List<Integer> communityIds);
  @Query("""
            SELECT fc.favoriteCommunityId.communityId
            FROM FavoriteCommunity fc
            WHERE fc.favoriteCommunityId.userId = :userId
         """)
  List<Integer> findIdsByUserId(@Param("userId") Integer userId);
}
