package shop.duction.be.domain.item.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.*;
import shop.duction.be.domain.admin.entity.ItemDeleteRequest;
import shop.duction.be.domain.bidding.entity.BiddedHistory;
import shop.duction.be.domain.bidding.entity.BiddingHistory;
import shop.duction.be.domain.bidding.entity.ExhibitHistory;
import shop.duction.be.domain.community.entity.Community;
import shop.duction.be.domain.item.enums.RareTier;
import shop.duction.be.domain.item.enums.AuctionStatus;
import shop.duction.be.domain.item.enums.ItemCondition;
import shop.duction.be.domain.ship.entity.BidderShip;
import shop.duction.be.domain.ship.entity.ExhibitorShip;
import shop.duction.be.domain.user.entity.User;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer itemId;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false)
    private Integer startPrice;

    private Integer nowPrice;

    private Integer immediatePrice;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ItemCondition itemCondition;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AuctionStatus auctionStatus;

    @Column(nullable = false)
    private Float rareScore;

    @Enumerated(EnumType.STRING)
    private RareTier rareTier;

    @Column(nullable = false)
    private Boolean isModified = false;

    @Column(nullable = false)
    private Boolean isChecked = false;

    @Column(nullable = false)
    private Integer reportedCount = 0;

    @Column(nullable = false)
    private LocalDateTime registTime;

    private LocalDateTime endBidTime;

    @Column(nullable = false)
    private Integer totalView = 0;

    @Column(nullable = false)
    private Integer totalBidding = 0;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemImage> itemImages = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private ItemDeleteRequest itemDeleteRequest;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserLog> userLogs;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RareRating> rareRatings;

    @OneToOne(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private ExhibitHistory exhibitHistory;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BiddingHistory> biddingHistories;

    @OneToOne(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private BiddedHistory biddedHistory;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FavoriteItem> favoriteItems;

    @OneToOne(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private ExhibitorShip exhibitorShip;

    @OneToOne(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private BidderShip bidderShip;

    public void addItemImage(ItemImage itemImage) {
        this.itemImages.add(itemImage);
        itemImage.setItem(this);
    }

    public void removeItemImage(ItemImage itemImage) {
        itemImages.remove(itemImage);
        itemImage.setItem(null);
    }
}

