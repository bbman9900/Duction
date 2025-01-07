import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getClosingSoonItems, getMastersCollectorsRare } from '../services/itemService'
import { getPopularCommunities } from '../services/communityService'
import CommunityList from '../components/CommunityList/CommunityList'
import CardItemsList from '../components/ItemCard/ItemCardList'

import '@styles/pages/Home.css'

export default function Home() {
  const [communities, setCommunities] = useState([]);
  const [closingSoonItems, setClosingSoonItems] = useState([]);
  const [mastersItems, setMastersItems] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchPopularCommunitie = async () => {
    try {
      const data = await getPopularCommunities();
      setCommunities(data);
    } catch (error) {
      console.error("Failed", error);
    }
  };

  const fetchClosingSoonItems = async () => {
    try {
      const data = await getClosingSoonItems();
      setClosingSoonItems(data);
    } catch (error) {
      console.error("Faild", error);
    }
  }

  const fetchMastersItems = async () => {
    try {
      const data = await getMastersCollectorsRare();
      setMastersItems(data);
    } catch (error) {
      console.error("Faild", error);
    }
  }

  useEffect(() => {
    fetchPopularCommunitie();
    fetchClosingSoonItems();    
    fetchMastersItems();
  }, [])

  useEffect(() => {
    console.log("asdfasgasdg")
    const params = new URLSearchParams(location.search);
    const jwt = params.get('jwt');
    const error = params.get('error');
  
    if (jwt) {
      localStorage.setItem('jwt', jwt)
      alert("로그인 성공")
    } else if (error) {
      alert(error);  
    }
  
  }, [location.search]);

  return (
    <>
      <div class='home_main_image'>
        <div class='home_main_text_overlay'>
          <div class='home_main_text'>수집가를 위한 경매 커뮤니티</div>
          <div class='home_main_text2'>덕션 (폰트 바꿔야?)</div>
        </div>
        <img src='/src/assets/home_main.png' alt='home image' />
      </div>

      <div className='home_popularCommunitie'>
        <CommunityList title={"인기 커뮤니티"} communityList={communities} />
      </div>

      <div className='home_cardItems'>
        <CardItemsList title={"마감 임박 상품"} itemList={closingSoonItems} />
      </div>

      <div className='home_cardItems'>
        <CardItemsList title={"마스터즈컬렉션즈레어 상품"} itemList={mastersItems} />  
      </div>
    </>
  )
}