package shop.duction.be.domain.bidding.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import shop.duction.be.domain.bidding.enums.BiddedStatus;
import shop.duction.be.domain.item.entity.Item;
import shop.duction.be.domain.user.entity.User;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class BiddedHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long biddedId;

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false)
    private LocalDateTime biddedTime;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private BiddedStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @OneToOne
    @JoinColumn(name = "bid_id", nullable = false)
    private BiddingHistory biddingHistory;
}