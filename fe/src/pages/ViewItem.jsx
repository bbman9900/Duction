import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useModal } from '../hooks/useModal'
import { getItemDetails, postItemRareScore, putBiddingGiveup, putReport, postImmediateBidding } from '../services/itemService';
import HorizontalRule from '../components/HorizontalRule';
import GodoTitleLabel from '../components/Labels/GodoTitleLabel';
import PreTitleLabel from '../components/Labels/PreTitleLabel';
import PreSubTitleLabel from '../components/Labels/PreSubTitleLabel';
import PriceSummary from '../components/PriceSummary';
import StarRating from '../components/Button/StarRating';
import SubmitBidModalContent from '../components/Modal/SubmitBidModalContent'
import CustomModal from '../components/Modal/CustomModal'
import PreTextLabel from '../components/Labels/PreTextLabel';
import IconPlusLabel from '../components/Labels/IconPlusLabel'
import RectangleButton from '../components/Button/RectangleButton';

import "../styles/pages/ViewItem.css"

const ViewItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const itemId = location.state.itemId;
  const [data, setData] = useState('');
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 현재 보여지는 이미지 인덱스
  const [remainingTime, setRemainingTime] = useState(""); // 남은 시간
  const [isBlinking, setIsBlinking] = useState(false); // 깜빡임 상태 관리
  const [rareScore, setRareScore] = useState(null); // 레어 점수 (별점)
  const [isReported, setIsReported] = useState(false); // 레어 점수 (별점)
  const { isModalOpen, modalContent, openModal, closeModal } = useModal();

  async function fetchItemDetails() {
    try {
      const response = await getItemDetails(itemId);
      setData(response);
    } catch (error) {
      alert("아이템 정보를 불러오는 데 실패했습니다");
    }
  }

  useEffect(() => {
    if (!itemId) {
      console.error("itemId가 전달되지 않았습니다.");
      return;
    }

    fetchItemDetails();
  }, []);

  // 남은 시간에 따라 업데이트
  useEffect(() => {
    let interval; // 업데이트를 관리하는 변수

    const updateRemainingTime = () => {
      const now = new Date(); // 현재 시간
      const auctionEnd = new Date(data.endTime); // 경매 종료 시간
      const diff = auctionEnd - now; // 남은 시간 (밀리초)

      if (diff <= 0) {
        // 경매 종료 시 처리
        clearTimeout(interval);
        setRemainingTime("경매 종료");
        setIsBlinking(false); // 깜빡임 비활성화
        return;
      }

      // 남은 시간 상태 업데이트
      setRemainingTime(calculateRemainingTime(diff));

      // 깜빡임 활성화 여부 설정 (5분 이내일 때 활성화)
      setIsBlinking(diff <= 5 * 60 * 1000);

      // 동적 업데이트 주기 설정
      clearTimeout(interval); // 기존 동작 제거

      if (diff > 24 * 60 * 60 * 1000) {
        // 24시간 이상 남음: 자정에 업데이트
        const nextMidnight = new Date(now);
        nextMidnight.setDate(now.getDate() + 1);
        nextMidnight.setHours(0, 0, 0, 0);
        const timeToMidnight = nextMidnight - now;
        interval = setTimeout(updateRemainingTime, timeToMidnight);
      } else if (diff > 5 * 60 * 1000) {
        // 5분 ~ 24시간 남음: 분 단위가 바뀔 때 업데이트
        const nowMilliseconds = now.getTime();
        const nextMinuteMilliseconds = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes() + 1,
          0,
          0
        ).getTime();
        const timeToNextMinute = nextMinuteMilliseconds - nowMilliseconds;
        interval = setTimeout(updateRemainingTime, timeToNextMinute);
      } else {
        // 5분 이하: 초 단위 업데이트
        const nowMilliseconds = now.getTime();
        const nextSecondMilliseconds = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes(),
          now.getSeconds() + 1,
          0
        ).getTime();
        const timeToNextSecond = nextSecondMilliseconds - nowMilliseconds;
        interval = setTimeout(updateRemainingTime, timeToNextSecond);
      }
    };

    updateRemainingTime();

    return () => clearTimeout(interval);
  }, [data.endTime]);


  // 왼쪽 화살표 클릭 시 이전 이미지로 이동
  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? data.images.length - 1 : prevIndex - 1
    );
  };

  // 오른쪽 화살표 클릭 시 다음 이미지로 이동
  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === data.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const onBid = () => {
    const probs = {
      itemId: data.itemId,
      itemName: data.itemName,
      startingPrice: data.startPrice,
      nowPrice: data.nowPrice,
      immediatePrice: data.immediatePrice,
    };

    openModal(<SubmitBidModalContent probs={probs} onClose={closeModal} />);
  };

  const onImmediateBid = async () => {
    const userConfirmed = window.confirm(`${data.immediatePrice}비드로 즉시 낙찰 하겠습니까?`);

    try {
      const response = await postImmediateBidding(data.itemId);
    } catch (error) {
      alert("입찰 포기하는 데 실패했습니다.");
    }
  };

  // 남은 시간을 계산하는 함수
  const calculateRemainingTime = () => {
    const now = new Date(); // 현재 시간
    const auctionEnd = new Date(data.endTime); // 경매 종료 시간
    const diff = auctionEnd - now; // 시간 차이 (밀리초)

    if (diff <= 0) {
      return "경매 종료";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) {
      // 24시간 이상: "n일" 표시
      return `${days}일`;
    } else if (diff <= 5 * 60 * 1000) {
      // 1시간 이내: "n분 n초" 표시
      return `${minutes}분 ${seconds}초`;
    }
    // 24시간 이내: 시간과 분만 표시
    return `${hours}시간 ${minutes}분`;
  };

  const handleRareScoreChange = async (value) => {
    const dto = {
      rareScore: value,
    }; // 별점 포함된 dto 생성

    try {
      setRareScore(value);
      const response = await postItemRareScore(data.itemId, dto);
      alert(`${value}점의 레어 등급 평가가 제출되었습니다.`);
    } catch (error) {
      alert("레어 등급 평가를 제출하는 데 실패했습니다.");
    }
  };

  const onReport = async () => {
    if (!isReported) {
      await putReport(data.itemId);
      setIsReported(true);
    } else {
      alert("이미 신고하신 상품입니다.");
    }
  };

  const onGiveup = async () => {
    const userConfirmed = window.confirm("정말 입찰을 포기하겠습니까?");

    try {
      const response = await putBiddingGiveup(data.itemId);
    } catch (error) {
      alert("입찰 포기하는 데 실패했습니다.");
    }
  };

  if (!data) {
    return <p>로딩 중...</p>; // 데이터를 가져오기 전 로딩 상태 표시
  }

  return (
    <div className="view-myinfo-container">
      <CustomModal isOpen={isModalOpen} onClose={closeModal} content={modalContent} />

      {/* 화면 왼쪽 최상단에 communityName 표시 */}
      <div className="community-header">
        <GodoTitleLabel text={data.communityName || "커뮤니티 이름 없음"} />
      </div>

      <div className="main-content">
        <div className="slider-container">
          {/* 이미지 슬라이더 */}
          <div className="image-slider">
            <button className="arrow left-arrow" onClick={handlePrevClick}>
              {/* 왼쪽 화살표 */}
              <img src="/src/assets/left_arrow.png" alt="left_arrow" />
            </button>
            <div className="image-wrapper">
              {/* 메인 이미지 */}
              <img
                src={data.images[currentImageIndex]}
                alt={`상품 이미지 ${currentImageIndex + 1}`}
                className="item-image"
              />
            </div>
            <button className="arrow right-arrow" onClick={handleNextClick}>
              {/* 오른쪽 화살표 */}
              <img src="/src/assets/right_arrow.png" alt="right_arrow" />
            </button>

            {/* 썸네일 리스트 */}
            <div className="thumbnail-container">
              {data.images.map((url, index) => {
                // 5장의 썸네일만 보여주는 슬라이딩 로직
                const visibleIndex =
                  Math.max(0, currentImageIndex - 2) + index < data.images.length
                    ? Math.max(0, currentImageIndex - 2) + index
                    : null;

                return (
                  visibleIndex !== null && (
                    <img
                      key={index}
                      src={data.images[visibleIndex]}
                      alt={`썸네일 이미지 ${visibleIndex + 1}`}
                      className={`thumbnail ${visibleIndex === currentImageIndex ? "active" : ""
                        }`}
                      onClick={() => setCurrentImageIndex(visibleIndex)}
                    />
                  )
                );
              })}
            </div>
          </div>

          {/* 버튼 추가 */}
          <div className="slider-buttons">
            <IconPlusLabel icon="/src/assets/report.png" text={"신고하기"} onImageClick={onReport} onTextClick={onReport} />
            <IconPlusLabel icon="/src/assets/give_up.png" text={"입찰포기"} onImageClick={onGiveup} onTextClick={onGiveup} />
            <IconPlusLabel icon="/src/assets/duck.png" text={"관심등록"} onImageClick={onGiveup} onTextClick={onGiveup} />
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="item-info">
          <PreTitleLabel text={data.itemName} />
          <PriceSummary startingBid={data.startPrice} nowPrice={data.nowPrice} immediateBid={data.immediatePrice} />

          {/* 버튼 영역 */}
          <div className="price-button-container">
            <RectangleButton text={"입찰"} onClick={onBid} />
            <RectangleButton text={"즉시 낙찰"} onClick={onImmediateBid} />
          </div>

          {/* 상품 상세 정보 */}
          <div className="item-details">
            <div className="item-info-detail-row">
              <PreTextLabel text={"남은 시간"} />
              <span className={`remaining-time-value ${isBlinking ? "blinking" : ""}`} key={remainingTime} // key 속성을 이용한 재렌더링 트리거
              > {remainingTime}</span>
            </div>
            <div className="item-info-detail-row">
              <PreTextLabel text={"조회수"} />
              <PreTextLabel text={`${data.totalView.toLocaleString()}회`} />
            </div>
            <div className="item-info-detail-row">
              <PreTextLabel text={"입찰 건수"} />
              <PreTextLabel text={`${data.totalBidding.toLocaleString()}건`} />
            </div>
            <div className="item-info-detail-row">
              <PreTextLabel text={"상태"} />
              <PreTextLabel text={data.itemCondition} />
            </div>
            <div className="item-info-detail-row">
              <PreTextLabel text={"레어 등급"} />
              <PreTextLabel text={data.rareTier} style={{ fontFamily: "HakgyoansimByeolbichhaneulTTF-B" }} />
            </div>
            <div className="item-info-detail-row">
              <PreTextLabel text={"레어 등급 평가"} />
              <div className="rating-wrapper">
                <StarRating rating={rareScore} onChange={handleRareScoreChange} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <HorizontalRule type={"hr1"} />

      {/* 상세 설명, 출품자 정보 */}
      <div className="info-grid">

        {/* 왼쪽: 상세 설명 */}
        <div className="item-description">
          <PreTitleLabel text={"상세 설명"} />
          <HorizontalRule type={"hr2"} />
          <p>{data.description}</p>
        </div>

        {/* 구분선 */}
        <div className="vertical-separator"></div>

        {/* 오른쪽: 출품자 정보 */}
        <div className="item-description">
          <PreTitleLabel text={"출품자 정보"} />
          <HorizontalRule type={"hr2"} />
          <div className="detail-row">
            <PreTextLabel text={"출품자"} />
            <PreSubTitleLabel text={data.exhibitorNickName} style={{ fontWeight: "bold" }} />
          </div>
          <div className="detail-row">
            <PreTextLabel text={"평점"} />
            <PreSubTitleLabel text={`${data.exhibitorRate} 점`} style={{ fontWeight: "bold" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewItem;