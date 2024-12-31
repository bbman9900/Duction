package shop.duction.be.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

import shop.duction.be.domain.admin.entity.CommunityCreateRequest;
import shop.duction.be.domain.admin.entity.ItemDeleteRequest;
import shop.duction.be.domain.bidding.entity.BiddedHistory;
import shop.duction.be.domain.bidding.entity.BiddingHistory;
import shop.duction.be.domain.bidding.entity.ExhibitHistory;
import shop.duction.be.domain.bidpoint.entity.BidHistory;
import shop.duction.be.domain.community.entity.FavoriteCommunity;
import shop.duction.be.domain.item.entity.FavoriteItem;
import shop.duction.be.domain.item.entity.Item;
import shop.duction.be.domain.item.entity.RareRating;
import shop.duction.be.domain.item.entity.UserLog;
import shop.duction.be.domain.ship.entity.BidderShip;
import shop.duction.be.domain.ship.entity.ExhibitorShip;
import shop.duction.be.domain.user.enums.IsActive;
import shop.duction.be.domain.user.enums.Role;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId; // 사용자 ID

    @Column(unique = true, nullable = false, length = 40)
    private String email; // 이메일

    @Column(unique = true, nullable = false, length = 20)
    private String nickname; // 닉네임

    @Column(columnDefinition = "TEXT")
    private String profileImage; // 프로필 사진


    @Column(nullable = false, length = 20)
    private String phone; // 휴대폰 번호

    @Column(columnDefinition = "TEXT")
    private String address; // 주소

    @Column(nullable = false)
    private Integer heldBid = 0; // 보유 비드

    @Column(nullable = false)
    private Integer usableBid = 0; // 사용 가능 비드

    @Column(nullable = false)
    private Float rate = 50f;

    @Column(nullable = false)
    private Integer penaltyCount = 0; // 패널티 횟수

    @Column(columnDefinition = "TEXT")
    private String refreshToken; // 리프레시 토큰

    @Column(nullable = false)
    private LocalDateTime registTime; // 가입 일시

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IsActive isActive = IsActive.ACTIVE; // 상태 (ACTIVE, INACTIVE, SUSPENDED)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER; // 역할 (USER, ADMIN)

    // 관계 매핑
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BidHistory> bidHistories;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExhibitHistory> exhibitHistories;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BiddingHistory> biddingHistories;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BiddedHistory> biddedHistories;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FavoriteItem> favoriteItems;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExhibitorShip> exhibitorShips;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BidderShip> bidderShips;

    // 출품자로서의 관계
    @OneToMany(mappedBy = "exhibitor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExhibitorRating> exhibitorRatings;

    // 평가자로서의 관계
    @OneToMany(mappedBy = "evaluator", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExhibitorRating> evaluatorRatings;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FavoriteCommunity> favoriteCommunities;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CommunityCreateRequest> communityCreateRequests;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemDeleteRequest> itemDeleteRequests;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserLog> userLogs;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RareRating> rareRatings;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> items;
}


