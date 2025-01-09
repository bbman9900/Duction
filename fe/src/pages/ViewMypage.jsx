import { useNavigate } from "react-router-dom";
import { getFavoriteItems } from "../services/itemService";
import { useEffect, useState } from "react";
import { getUserInfo } from "../services/uesrService";
import { getHistoriesCount } from "../services/itemService";
import GodoTitleLabel from "../components/Labels/GodoTitleLabel"
import RectangleButton from "../components/Button/RectangleButton"
import GodoSubTitleLabel from "../components/Labels/GodoSubTitleLabel"
import PreSubTitleLabel from "../components/Labels/PreSubTitleLabel"
import IconPlusLabelColumn from "../components/Labels/IconPlusLabelColumn"
import CardItemsList from '../components/ItemCard/ItemCardList'
import ProfileImage from "../components/ProfileImage";
import Historybox from "../components/Historybox";
import PreCaptionLabel from "../components/Labels/PreCaptionLabel"

import '@styles/pages/ViewMypage.css'
import PreTextLabel from "../components/Labels/PreTextLabel";

export default function ViewMypage() {
  const [exhibitSortOptions, setExhibitSortOptions] = useState([
    { value: "all", title: "전체", count: 0 },
    { value: "biddingUnder", title: "입찰중", count: 0 },
    { value: "bidded", title: "낙찰", count: 0 },
    { value: "biddedNot", title: "유찰", count: 0 },
    { value: "biddedCancel", title: "낙찰 취소", count: 0 },
  ]);

  const [biddingSortOptions, setBiddingSortOptions] = useState([
    { value: "all", title: "전체", count: 0 },
    { value: "bidding", title: "입찰중", count: 0 },
    { value: "bidded", title: "낙찰", count: 0 },
    { value: "biddedFail", title: "패찰", count: 0 },
  ]);

  const [userInfo, setUserInfo] = useState({});
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [tenFavoriteItems, setTenFavoriteItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);

  const navigate = useNavigate();

  // 데이터 불러오는 함수
  const fetchUserInfo = async () => {
    try {
      const userInfo = await getUserInfo();
      setUserInfo(userInfo);

      const count = await getHistoriesCount();
      setExhibitSortOptions((prevOptions) =>
        prevOptions.map((option) => ({
          ...option,
          count: count.exhibit[option.value] ?? 0,
        }))
      );
      setBiddingSortOptions((prevOptions) =>
        prevOptions.map((option) => ({
          ...option,
          count: count.bidding[option.value] ?? 0,
        }))
      );

      const items = await getFavoriteItems();
      setFavoriteItems(items);
      setTenFavoriteItems(items.slice(0, 10));

    } catch (error) {
      console.error("Faild", error);
    }
  }

  // 화면 이동 함수
  const navigateViewUserInfo = () => {
    navigate('/viewMyInfo', { state: { userInfo: userInfo } })
  }

  const navigateBidPointHistoryList = () => {
    navigate('/viewBidPointHistoryList')
  }

  const navigateBiddedHistoryList = (option) => {
    navigate('/viewExhibitHistoryList', { state: { sortType: option } })
  }

  const navigateBiddingHistoryList = (option) => {
    navigate('/viewBiddingHistoryList', { state: { sortType: option } })
  }

  const navigateFavoriteItems = () => {
    navigate('/viewFavoriteItemList', { state: { items: favoriteItems } })
  }

  const navigateAdminPage = () => {
    navigate('/viewAdminPage')
  }

  useEffect(() => {
    fetchUserInfo();
  }, [])

  return (
    <>
      <GodoTitleLabel text={"마이페이지"} />

      {/* 운영자 페이지 이동*/}
      {isAdmin ? <RectangleButton text="운영자" onClick={navigateAdminPage} /> : <></>}

      {/* 사용자 정보 */}
      <div className='profile_container'>
        <div className='profile_info_section'>
          <div className='profile_image'>
            <ProfileImage imageUrl={userInfo.profileImage} />
          </div>
          <div className='profile_info'>
            <GodoSubTitleLabel text={userInfo.nickname} />
            <GodoSubTitleLabel text={userInfo.email} />
          </div>
        </div>
        <RectangleButton text='프로필 관리' onClick={navigateViewUserInfo} />
      </div>

      {/* 내 점수, 비드 정보 */}
      <div className='rate_container'>
        <div className='rate_items'>
          <div className='rate_item'>
            <IconPlusLabelColumn icon={"assets/rate.png"} text={"내 점수"} />
            <PreSubTitleLabel text={`${userInfo.rate} 점`} />
          </div>
          <hr />
          <div className='rate_item' onClick={navigateBidPointHistoryList}>
            <IconPlusLabelColumn icon={"assets/heldBid.png"} text={"보유 비드"} />
            <PreSubTitleLabel text={`${userInfo.heldBid} 비드`} />
          </div>
          <hr />
          <div className='rate_item' onClick={navigateBidPointHistoryList}>
            <IconPlusLabelColumn icon={"assets/usableBiid.png"} text={"사용 가능 비드"} />
            <PreSubTitleLabel text={`${userInfo.usableBid} 비드`} />
          </div>
        </div>
      </div>

      {/* 입찰 이력 */}
      <div className='biddingItem_container'>
        <div className='biddingItem_container_title'>
          <GodoTitleLabel text={"입찰 이력"} />
        </div>
        <Historybox items={biddingSortOptions} onClick={navigateBiddingHistoryList} />
      </div>

      {/* 출품 이력 */}
      <div className='biddedItem_container'>
        <div className='biddedItem_container_title'>
          <GodoTitleLabel text={"출품 이력"} />
        </div>
        <Historybox items={exhibitSortOptions} onClick={navigateBiddedHistoryList} />
      </div>

      {/* 관심 상품 */}
      <div className='favoriteItem_container'>
        <div className='favoriteItem_container_title'>
          <GodoTitleLabel text={"관심 상품"} />
          <button onClick={navigateFavoriteItems}><PreCaptionLabel text={"더보기"} /></button>
        </div>
        {tenFavoriteItems
          ? <CardItemsList itemList={tenFavoriteItems} />
          : <PreTextLabel text={"관심 상품을 등록해 주세요"} />}
      </div>
    </>
  )
}