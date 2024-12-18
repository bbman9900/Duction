import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import RectangleButton from '../components/Button/RectangleButton';
import '../styles/pages/ViewMyInfo.css';
import HorizontalRule from '../components/hr/HorizontalRule';
import GodoTitleLabel from '../components/Labels/GodoTitleLabel';
import PreTitleLabel from '../components/Labels/PreTitleLabel';
import PreSubTitleLabel from '../components/Labels/PreSubTitleLabel';

const ViewMyInfo = () => {
  const location = useLocation();
  const { nickname, phoneNumber, address } = location.state || {};

  const [nicknameNew, setNicknameNew] = useState(nickname);
  const [phoneNumberNew, setPhoneNumberNew] = useState(phoneNumber.replace(/-/g, '')); // 하이픈 제거
  const [addressNew, setAddressNew] = useState(address);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    if (!nicknameNew || !phoneNumberNew || !addressNew) {
      window.alert('모든 필드를 채워주세요.'); // window.alert로 변경
      return;
    }

    if (phoneNumberNew.length !== 11) { // 하이픈 없이 11자리 확인
      window.alert('전화번호는 11자리여야 합니다.'); // window.alert로 변경
      return;
    }

    // 저장하기 전에 하이픈 추가
    const formattedPhoneNumber = `${phoneNumberNew.slice(0, 3)}-${phoneNumberNew.slice(3, 7)}-${phoneNumberNew.slice(7)}`;
    setPhoneNumberNew(formattedPhoneNumber); // 전화번호 상태 업데이트

    const confirmSave = window.confirm("저장하시겠습니까?");
    if (!confirmSave) {
      return;
    }

    setIsEditing(false);
    window.alert('저장되었습니다!'); // window.alert로 변경
  };

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    const digitsOnly = inputValue.replace(/[^\d]/g, ''); // 숫자만 남기기

    // 최대 11자리 숫자만 허용
    if (digitsOnly.length > 11) return;

    setPhoneNumberNew(digitsOnly); // 상태 업데이트
  };

  return (
    <div className="view-myinfo-container">
      <GodoTitleLabel text="마이페이지" />
      <div>
        <PreTitleLabel text="내 정보" />
        <HorizontalRule type="hr1" />
      </div>
      <div>
        <PreSubTitleLabel text="프로필 사진" />
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#ccc' }} />
        <button>사진 변경</button>
        <button>사진 삭제</button>
      </div>
      <HorizontalRule type="hr2" />

      <div className="nickname-wrapper">
        <PreSubTitleLabel text="닉네임" />
        <div className="TextField_container">
          {isEditing ? (
            <input
              type="text"
              value={nicknameNew}
              onChange={(e) => setNicknameNew(e.target.value)}
              className="searchTextField_input"
            />
          ) : (
            <span>{nicknameNew}</span>
          )}
        </div>
      </div>
      <HorizontalRule type="hr2" />

      <div className="phone-wrapper">
        <PreSubTitleLabel text="휴대폰 번호" />
        <div className="TextField_container">
          {isEditing ? (
            <input
              type="text"
              value={phoneNumberNew}
              onChange={handlePhoneChange}
              placeholder="숫자만 입력해주세요. (01012345678)"
              className="searchTextField_input"
            />
          ) : (
            <span>{phoneNumberNew.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</span> // 하이픈 추가하여 표시
          )}
        </div>
      </div>
      <HorizontalRule type="hr2" />

      <div className="address-wrapper">
        <PreSubTitleLabel text="주소" />
        <div className="TextField_container">
          {isEditing ? (
            <input
              type="text"
              value={addressNew}
              onChange={(e) => setAddressNew(e.target.value)}
              className="searchTextField_input"
            />
          ) : (
            <span>{addressNew}</span>
          )}
        </div>
      </div>
      <HorizontalRule type="hr2" />

      <div>
        <RectangleButton text={isEditing ? "저장" : "변경"} onClick={isEditing ? handleSave : handleEditToggle} />
      </div>
    </div>
  );
};

export default ViewMyInfo; 
