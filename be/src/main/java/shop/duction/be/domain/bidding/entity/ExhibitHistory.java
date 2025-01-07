package shop.duction.be.domain.bidding.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import shop.duction.be.domain.bidding.enums.ExhibitStatus;
import shop.duction.be.domain.bidpoint.entity.BidHistory;
import shop.duction.be.domain.item.entity.Item;
import shop.duction.be.domain.item.entity.UserItemKey;
import shop.duction.be.domain.user.entity.User;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class ExhibitHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer exhibitId;

    @Column(nullable = false)
    private LocalDateTime registTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExhibitStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // 외래키 매핑
    private User user;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "item_id", nullable = false) // 외래키 매핑
    private Item item;

    @OneToOne(mappedBy = "exhibitHistory", cascade = CascadeType.ALL, orphanRemoval = true)
    private BidHistory bidHistory;
}