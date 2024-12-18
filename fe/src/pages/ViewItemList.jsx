import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getCommunityInfo } from '../services/communityService'
import { getItemsByCommunityId } from '../services/itemsService'
import GodoTitelLabe from '../components/Labels/GodoTitleLabel'
import ItemCard from '../components/ItemCard/ItemCard'
import RoundButton from '../components/Button/RoundButton'
import RectangleButton from '../components/Button/RectangleButton'
import SearchTextField from '../components/SearchTextField'

import '@styles/pages/ViewItemList.css'

// DT-01-02 출품 상품 목록 보기
export default function ViewItemList() {
  const sortOptions = [
    { value: "latest", title: "최신순" },
    { value: "price_desc", title: "고가순" },
    { value: "price_asc", title: "저가순" },
  ];

  const [communityInfo, setCommunityInfo] = useState('');
  const [auctionItems, setAuctionItems] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [sortOption, setSortOption] = useState(sortOptions[0].value);
  const [searchText, setSearchText] = useState('');

  const [message, setMessage] = useState('');
  const [disply, setDisplay] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const communityId = location.state.communityId;

  const fetchCommunityInfo = async () => {
    try {
      const data = await getCommunityInfo(communityId);
      setCommunityInfo(data);
    } catch (error) {
      console.error("Faild", error);
    }
  }

  const fetchAuctionItems = async () => {
    const acutionItemsRequest = {
      currentPage,
      communityId,
      sortOption,
      searchText
    };

    try {
      const data = await getItemsByCommunityId(acutionItemsRequest);
      setAuctionItems(data);
      setTotalPageCount(data.totalPageCount);
    } catch (error) {
      console.error("Faild", error);
    }
  }

  const displayWinningBidMessage = () => {
    const eventSource = new EventSource("URL");
    eventSource.onmessage = (event) => {
      setMessage(event.data);
      setDisplay(true);
      setTimeout(() => setDisplay(false), 10000);
    };

    eventSource.error = (error) => {
      console.log("SSE error", error);
      eventSource.close();
    }

    return () => {
      eventSource.close();
    };    
  }

  const handlePageClick = (e) => {
    setCurrentPage(e.target.value);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    setCurrentPage(0);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(0);
  }

  const handleRegistItemButton = () => {
    navigate('/registItem')
  }

  useEffect(() => {
    fetchCommunityInfo();
    displayWinningBidMessage();
  }, [])

  useEffect(() => {
    fetchAuctionItems();
  }, [currentPage, sortOption, searchText])

  return (
    <>
      <div className='auctionItems_title'>
        <GodoTitelLabe text={communityInfo.name} />
      </div>
      
      <div className={`message_container ${disply ? "disply" : ""}`}>
        <div className='message_text'>"으아아아 으아아아 으아아아 낙찰찰 차라라라라라랄"</div>
      </div>

      <div className='autionItems_sortOption_container'>
        <div className='autionItems_sortOption'>
          <RoundButton options={sortOptions} onChange={handleSortChange} />
        </div>
        <div className='autionItems_registItemButton'>
          <RectangleButton text={"출품 상품 등록하기"} onClick={handleRegistItemButton}/>
        </div>
      </div>

      <div className='auctionItems_cardItems_container'>
        {auctionItems && auctionItems.map((item, index) => (
          <div className='auctionItems_cardItems_item' key={index}>
            <ItemCard key={index} data={item} />
          </div>
        ))}
      </div>

      <div className='auctionItems_pagination'>
        <p>페이지 네이션 부분 어떤 라이브러리를 사용할지 선택</p>
        <button onClick={handlePageClick} value={100}>페이지네이션</button>
      </div>

      <div className='auctionItems_searchTextField'>
        <SearchTextField placeholder={"검색어를 입력하지 않았으면.."} onSearch={handleSearch} />
      </div>
    </>
  )
}