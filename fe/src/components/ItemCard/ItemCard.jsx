import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteFavoriteItem, postFavoriteItem } from '../../services/itemService'
import { checkLogin } from '../../utils/CheckLogin'
import GodoTextLabel from '../Labels/GodoTextLabel'
import PreTextLabel from '../Labels/PreTextLabel'
import PreCaptionLabel from '../Labels/PreCaptionLabel'

import '@styles/components/ItemCard.css'

function ItemCard({ data }) {
  const { itemId, image, favorite, name, priceInfo, additionalInfo, overlayText } = data
  const [isFavorited, setIsFavorited] = useState(favorite);
  const navigate = useNavigate();

  const handleCheckLogin = () => {
    const isLoggedIn = checkLogin();

    if (isLoggedIn) {
      toggleBadge()
    } else {
      alert("로그인해  주세요")
    }
  };

  const toggleBadge = async() => {
    try {
      if (isFavorited) {
        await deleteFavoriteItem(itemId);
      } else {
        await postFavoriteItem(itemId);
      }

      setIsFavorited(!isFavorited)
    } catch (error) {
      alert("관심 등록 중 오류가 발생했어요 다시 시도해 주세요")
    }
  };

  const cardOnClick = () => {
    navigate(`/viewItem/${itemId}`);
  };

  return (
    <div className='itemCard' onClick={cardOnClick}>

      {/* 상단: 이미지와 뱃지 */}
      <div className='itemCard_imageContainer'>
        <img src={image} alt='ItemImage' className='itemCard_imageContainer_image' />
        <button className='itemCard_imageContainer_badge' onClick={(e) => {
          // 카드 클릭 이벤트와 구분
          e.stopPropagation();
          handleCheckLogin();
        }}>
          <img
            src={isFavorited ? '/assets/duck_selected.png' : '/assets/duck.png'}
            alt='Badge'
            className='itemCard_imageContainer_badgeImage'
          />
        </button>
      </div>

      {/* 하단: 아이템 정보 */}
      <div className='itemCard_infoContainer'>
        <div className='itemCard_infoContainer_name'>
          <GodoTextLabel text={name} />
        </div>
        {priceInfo && <div className='itemCard_infoContainer_price'>
          <PreTextLabel text={priceInfo.price} />
          <PreCaptionLabel text={priceInfo.type} />
        </div>}
        {additionalInfo && <div className='itemCard_infoContainer_additional_info'>
          {typeof additionalInfo === "string" ? (
            <PreTextLabel text={`출품 일시 ${additionalInfo}`} />
          ) : (
            <>
              <PreTextLabel text={`입찰 ${additionalInfo.bids} 건`} />
              <PreTextLabel text={`종료 ${additionalInfo.days}`} />
            </>
          )}
        </div>}
      </div>

      {/* 오버레이 */}
      {overlayText && (
        <div className='overlay'>
          <div className='overlay_circle'>
            <PreTextLabel text={overlayText} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemCard;
