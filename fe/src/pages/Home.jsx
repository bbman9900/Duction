import { useEffect, useState } from 'react'
import { getClosingSoonItems, getMastersCollectorsRare } from '../services/itemsService'
import { getPopularCommunities } from '../services/communityService'
import IconPlusLabel from '../components/Labels/IconPlusLabel'
import GodoTitleLabel from '../components/Labels/GodoTitleLabel'
import '@styles/pages/Home.css'
import ItemCard from '../components/ItemCard/ItemCard'

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [closingSoonItems, setClosingSoonItems] = useState([]);
  const [mastersItems, setMastersItems] = useState([]);

  const fetchPopularCategories = async () => {
    try {
      const data = await getPopularCommunities();
      setCategories(data);
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
    fetchPopularCategories();
    fetchClosingSoonItems();    
    fetchMastersItems();
  }, [])

  return (
    <>
      <div className='home_main_image'>
        <img src='/src/assets/test_image2.jpg' alt='home image' />
      </div>

      <div className='home_popularCategories'>
        <GodoTitleLabel text={"인기 카테고리"} />
        <div className='home_popularCategories_container'>
          {categories && categories.map((item) => (
            <div className='home_popularCategories_item'>
              <IconPlusLabel text={item.title} icon={item.isFavorited ? "/src/assets/duck_selected.png" : "/src/assets/duck.png"} />
            </div>
          ))}
        </div>
      </div>

      <div className='home_cardItems'>
        <GodoTitleLabel text={"마감 임박 상품"} />
        <div className='home_cardItems_container'>
          {closingSoonItems && closingSoonItems.map((item) => (
            <div className='home_cardItems_item'>
              <ItemCard data={item} />
            </div>
          ))}
        </div>
      </div>

      <div className='home_cardItems'>
        <GodoTitleLabel text={"마스터즈컬렉션즈레어 상품"} />
        <div className='home_cardItems_container'>
          {mastersItems && mastersItems.map((item) => (
            <div className='home_cardItems_item'>
              <ItemCard data={item} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}