import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { postFavoriteCommunity, deleteFavoriteCommunity } from '../../services/communityService'
import { checkLogin } from '../../utils/CheckLogin'
import GodoTitleLabel from '../../components/Labels/GodoTitleLabel'
import IconPlusLabel from '../../components/Labels/IconPlusLabel'
import '@styles/components/CommunityList.css'

export default function CommunityList({ title, communityList }) {
  const [currentCommunityList, setCurrentCommunityList] = useState([]);

  const navigate = useNavigate();

  const navigateToItemList = (communityId, communityName) => {
    navigate('/viewItemList', {state: {communityId: communityId, communityName: communityName}});
  };

  const handleCheckLogin = (communityId, isFavorite) => {
    const isLoggedIn = checkLogin();

    if (isLoggedIn) {
      handleFavoriteCommunity(communityId, isFavorite)
    } else {
      alert("로그인해  주세요")
    }
  };

  const handleFavoriteCommunity = async(communityId, isFavorite) => {
    try { 
      if (isFavorite) {
        await deleteFavoriteCommunity(communityId);
      } else {
        await postFavoriteCommunity(communityId);
      }

      setCurrentCommunityList((prev) => 
        prev.map((community) =>
          community.communityId === communityId ? {...community, favorite: !isFavorite} : community
        )
      );
    } catch (error) {
      alert("관심 등록 중 오류가 발생했어요 다시 시도해 주세요")
    }
  }

  useEffect(() => {
    setCurrentCommunityList(communityList)
  }, [communityList])

  return (
    <div className='communityList_container'>
      <GodoTitleLabel text={title} />
      <div className='communityList'>
        {currentCommunityList &&
          currentCommunityList.map((item, index) => (
            <div key={index} className='communityList_item'>
              <IconPlusLabel
                text={item.name}
                icon={
                  item.favorite
                    ? '/src/assets/duck_selected.png'
                    : '/src/assets/duck.png'
                }
                onImageClick={() => handleCheckLogin(item.communityId, item.favorite)}
                onTextClick={() => navigateToItemList(item.communityId, item.name)}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
}
