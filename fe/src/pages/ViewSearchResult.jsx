import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCommunitySearchResults } from '../services/communityService'
import { getItemSearchResults } from '../services/itemService'
import GodoTitleLabel from '../components/Labels/GodoTitleLabel'
import CommunityList from '../components/CommunityList/CommunityList'
import CardItemsList from '../components/ItemCard/ItemCardList'
import RoundButton from '../components/Button/RoundButton'

import '@styles/pages/ViewSearchResult.css'

export default function ViewSearchResult() {
  const options = [
    { value: "community", title: "커뮤니티" },
    { value: "item", title: "출품 상품" }
  ];

  const [communities, setCommunities] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(options[0].value); 

  const location = useLocation();
  const searchText = location.state.searchText;

  const fetchCommunitySearchResults = async () => {
    const data = await getCommunitySearchResults(searchText);
    setCommunities(data);
  }

  const fetchItemSearchResults = async () => {
    const data = await getItemSearchResults(searchText);
    setItems(data);
  }

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  }

  useEffect(() => {
    fetchCommunitySearchResults();
    fetchItemSearchResults();
  }, [searchText])

  return (
    <div className='viewSearchResult'>
      <div className='viewSearchResult_title'>
        <GodoTitleLabel text={"검색 결과"} />
      </div>

      <div className='autionItems_sortOption_container'>
        <div className='autionItems_sortOption'>
          <RoundButton options={options} onChange={handleOptionChange} />
        </div>
      </div>

      {selectedOption === options[0].value && (
        <div className="viewSearchResult_community_container">
          <CommunityList title={"커뮤니티"} communityList={communities} />
        </div>
      )}

      {selectedOption === options[1].value && (
        <div className="viewSearchResult_item_container">
          <CardItemsList title={"출품 상품"} itemList={items} />
        </div>
      )}
    </div>
  )
}