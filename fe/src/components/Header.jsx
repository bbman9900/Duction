import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../hooks/useModal'
import IconPlusLabel from './Labels/IconPlusLabel'
import SearchTextField from './SearchTextField'
import CustomModal from './Modal/CustomModal'
import LoginModalContent from './Modal/LoginModalContent'

import '@styles/components/HeaderFooter.css'
import { checkLogin } from '../utils/CheckLogin'

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isModalOpen, modalContent, openModal, closeModal } = useModal();

  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/')
  }

  const navigateToMyPage = () => {
    navigate('/viewMypage')
  };

  const navigateToCommunityList = () => {
    navigate('/viewCommunityList')
  }

  const openLoginModal = () => {
    openModal(<LoginModalContent onClose={closeModal} />);
  };

  const hendleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
  }

  const handleSearch = (searchText) => {
    navigate('/viewSearchResult', { state: {searchText: searchText} })
  }
 
  const options = [
    {
      icon: "/src/assets/community.png",
      text: "커뮤니티", 
      onClick: navigateToCommunityList,
    }, 
    {
      icon: "/src/assets/mypage.png",
      text: "마이페이지",
      onClick: navigateToMyPage,
    },
    {
      icon: isLoggedIn
        ? "/src/assets/logout.png" 
        : "/src/assets/login.png", 
      text: isLoggedIn ? "로그아웃" : "로그인", 
      onClick: isLoggedIn ? hendleLogout : openLoginModal,
    },
  ];

  useEffect(() => {
    const result = checkLogin();
    setIsLoggedIn(result);
  }, [isLoggedIn]);

  return(
    <div className='header_container'>
      <CustomModal isOpen={isModalOpen} onClose={closeModal} content={modalContent} />
      <div className='loginModal_container_top'>
        <img src="/src/assets/ducktion_logo.png" onClick={navigateToHome}/>
      </div>
      <div className='header_container_searchField'>
        <SearchTextField placeholder={'커뮤니티 이름, 상품 이름을 입력해 주세요'} onSearch={(searchText) => handleSearch(searchText)} />
      </div>
      <div className='header_container_options'>
        {options.map((item, index) => (
          <IconPlusLabel key={index} icon={item.icon} text={item.text} onImageClick={item.onClick} onTextClick={item.onClick}/>
        ))}
      </div>
    </div>
  )
}