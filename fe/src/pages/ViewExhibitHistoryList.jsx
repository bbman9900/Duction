import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getExhibitHistory } from '../services/itemService'
import { useModal } from '../hooks/useModal'
import GodoTitleLabel from '../components/Labels/GodoTitleLabel'
import PreSubTitleLabel from '../components/Labels/PreSubTitleLabel'
import RoundButton from '../components/Button/RoundButton'
import DateNavigator from '../components/DateNavigator'
import ItemCard from '../components/ItemCard/ItemCard'
import RectangleButton from '../components/Button/RectangleButton'
import InputInvoiceModalContent from '../components/Modal/InputInvoiceModalContent'
import CustomModal from '../components/Modal/CustomModal'

import '@styles/pages/ViewBiddedHistory.css'

export default function ViewExhibitHistoryList() {
  const sortOptions = [
    { value: "all", title: "전체", count: 0 },
    { value: "biddingUnder", title: "입찰중", count: 0 },
    { value: "bidded", title: "낙찰", count: 0 },
    { value: "biddedNot", title: "유찰", count: 0 },
    { value: "biddedCancel", title: "낙찰 취소", count: 0 },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const sortType = location.state.sortType;

  const { isModalOpen, modalContent, openModal, closeModal } = useModal();
  const [selectedSortOption, setSelectedSortOption] = useState(sortType);
  const [biddedHistory, setBiddedHistory] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedDate, setSelectedDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const fetchBiddedHisory = async () => {
    const biddedHistoryRequest = {
      sortType: selectedSortOption,
      year: selectedDate.year,
      month: selectedDate.month
    }

    try {
      const data = await getExhibitHistory(biddedHistoryRequest);
      setBiddedHistory(data);
    } catch (error) {
      console.error("Failed", error);
    }
  };

  const handleSortChange = (value) => {
    setSelectedSortOption(value);
  }

  const handleDateChange = (year, month) => {
    setSelectedDate({ year, month });
  };

  const navigateToDeletePage = (item) => {
    navigate("/requestDeleteItem", { state: { item: item } })
  }

  const navigateToModifyPage = (itemId) => {
    navigate(`/editItem/${itemId}`);
    // navigate("/editItem", { state: { item: item } })
  }

  const openInvoiceModal = (itemId) => {
    openModal(<InputInvoiceModalContent itemId={itemId} onClose={closeModal} role={"USER"}/>);
  };

  useEffect(() => {
    fetchBiddedHisory();
  }, [selectedSortOption, selectedDate])

  return (
    <>
      <CustomModal isOpen={isModalOpen} onClose={closeModal} content={modalContent} />

      <div className='biddedHistoryList_title'>
        <GodoTitleLabel text={"출품 이력"} />
      </div>

      <div className='biddedHistoryList_sortOption_container'>
        <div className='biddedHistoryList_sortOption'>
          <RoundButton options={sortOptions} onChange={handleSortChange} selectedOption={selectedSortOption} />
        </div>
      </div>

      <div className='biddedHistoryList_date'>
        <DateNavigator onDateChange={handleDateChange} />
      </div>

      <div className='biddedHistoryList_cardItems'>
        {biddedHistory.length === 0 ? (
          <div className='biddedHistoryList_no_data' style={{ margin: "auto" }}>
            <PreSubTitleLabel text="이력이 없습니다" style={{ color: '#bebebe', textAlign: 'center', paddingTop: "20px" }} />
          </div>
        ) : (
          biddedHistory.map((item, index) => (
            <div className='biddedHistoryList_cardItems_item' key={index}>
              <ItemCard key={index} data={item} />
              <div className='biddedHistoryList_cardItems_bottons'>
                <RectangleButton text={"수정"} onClick={() => navigateToModifyPage(item.itemId)} />
                <RectangleButton text={"삭제"} onClick={() => navigateToDeletePage(item)} />
              </div>
              {selectedSortOption === 'bidded' 
                ? ( <div className='biddedHistoryList_cardItems_botton'>
                    <RectangleButton text={"배송 번호 입력"} onClick={() => openInvoiceModal(item.itemId)} />
                  </div>)
                : ( <></> ) 
              }
            </div>
          ))
        )}
      </div>
    </>
  )
}