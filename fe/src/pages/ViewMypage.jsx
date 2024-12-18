import { useNavigate } from "react-router-dom";
import { getFavoriteItems } from "../services/itemsService";
import { useEffect, useState } from "react";
import GodoTitleLabel from "../components/Labels/GodoTitleLabel"
import RectangleButton from "../components/Button/RectangleButton"
import GodoSubTitleLabel from "../components/Labels/GodoSubTitleLabel"
import PreTitleLabel from "../components/Labels/PreTitleLabel"
import IconPlusLabelColumn from "../components/Labels/IconPlusLabelColumn"
import CardItemsList from '../components/ItemCard/ItemCardList'

import '@styles/pages/ViewMypage.css'
import ProfileImage from "../components/ProfileImage";
import Historybox from "../components/Historybox";

export default function ViewMypage() {
  const biddedSortOptions = [
    { value: "all", title: "전체", count: 0 },
    { value: "bidding", title: "입찰중", count: 0 },
    { value: "bidded", title: "낙찰", count: 0 },
    { value: "biddedCancel", title: "유찰", count: 0 },
  ];

  const biddingSortOptions = [
    { value: "all", title: "전체", count: 0 },
    { value: "bidding", title: "입찰중", count: 0 },
    { value: "bidded", title: "낙찰", count: 0 },
    { value: "biddedFail", title: "패찰", count: 0 },
  ];

  const [favoriteItemList, setFavoriteItemList] = useState([]);

  const navigate = useNavigate();

  // 데이터 불러오는 함수
  const fetchUserInfo = async () => {
    try {
      const data = await getFavoriteItems();
      setFavoriteItemList(data.slice(0, 10));
    } catch (error) {
      console.error("Faild", error);
    }
  }

// 화면 이동 함수
const handleBiddedItem = () => {
  navigate('/viewBiddedHistoryList', { state: { sortType: biddedSortOptions[1].value } })
}

const handleBiddingItem = () => {
  navigate('/viewBiddingHistoryList', { state: { sortType: biddingSortOptions[1].value } })
}

const handleFavoriteItem = () => {
  navigate('/viewFavoriteItemList', { state: { items: data } })
}

useEffect(() => {
  fetchUserInfo();
}, [])

return (
  <>
    <GodoTitleLabel text={"마이페이지"} />

    <div className='profile_container'>
      <div className='profile_info_section'>
        <div className='profile_image'>
          <ProfileImage imageUrl={"/src/assets/duck.png"} />
        </div>
        <div className='profile_info'>
          <GodoSubTitleLabel text={"닉네임"} />
          <GodoSubTitleLabel text={"이메일"} />
        </div>
      </div>
      <RectangleButton text='프로필 관리' />
    </div>

    <div className='rate_container'>
      <div className='rate_items'>
        <div className='rate_item'>
          <IconPlusLabelColumn icon={"src/assets/rate.png"} text={"내 점수"} />
          <PreTitleLabel text={"58점"} />
        </div>
        <hr />
        <div className='rate_item'>
          <IconPlusLabelColumn icon={"src/assets/heldBid.png"} text={"보유 비드"} />
          <PreTitleLabel text={"58점"} />
        </div>
        <hr />
        <div className='rate_item'>
          <IconPlusLabelColumn icon={"src/assets/usableBiid.png"} text={"사용 가능 비드"} />
          <PreTitleLabel text={"58점"} />
        </div>
      </div>
    </div>

    <div className='biddingItem_container'>
      <div className='biddingItem_container_title'>
        <GodoTitleLabel text={"입찰 이력"} />
      </div>
      <Historybox items={biddingSortOptions} />
    </div>

    <div className='biddedItem_container'>
      <div className='biddedItem_container_title'>
        <GodoTitleLabel text={"출품 이력"} />
      </div>
      <Historybox items={biddedSortOptions} />
    </div>

    <div className='favoriteItem_container'>
      <div className='favoriteItem_container_title'>
        <GodoTitleLabel text={"관심 상품"} />
      </div>
      <CardItemsList itemList={favoriteItemList} />
    </div>
  </>
)
}