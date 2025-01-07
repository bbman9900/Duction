package shop.duction.be.domain.item.enums;


public enum AuctionStatus {
    BIDDING_BEFORE, // 입찰 전
    BIDDING_UNDER,  // 입찰중
    BIDDED, // 낙찰
    BIDDING_NOT,    // 유찰
    AUCTION_COMPLETE,   // 경매 종료
    BIDDED_CANCEL;   // 낙찰 취소

    public String getAuctionStatusMessage() {
        return switch (this) {
            case BIDDING_BEFORE, BIDDING_UNDER -> "";
            case AUCTION_COMPLETE, BIDDED -> "낙찰 완료";
            case BIDDING_NOT -> "유찰";
            case BIDDED_CANCEL -> "낙찰 취소";
        };
    }
}