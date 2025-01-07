import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { validateImageFile } from '../utils/ImageFileValidators';
import { putUserProfileImage, deleteUserProfileImage, editMyInfo, deleteUser } from '../services/uesrService';
import RectangleButton from '../components/Button/RectangleButton';
import HorizontalRule from '../components/HorizontalRule';
import GodoTitleLabel from '../components/Labels/GodoTitleLabel';
import PreTitleLabel from '../components/Labels/PreTitleLabel';
import PreSubTitleLabel from '../components/Labels/PreSubTitleLabel';
import defaultProfileImage from '../assets/test_image.png';
import ProfileImage from '../components/ProfileImage';

import '../styles/pages/ViewMyInfo.css';

const ViewMyInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = location.state?.userInfo || {
    userId: '',
    nickname: '',
    profileImage: '',
    phoneNumber: '',
    address: ''
  };

  const [nickname, setNickname] = useState(userInfo.nickname);
  const [profileImage, setProfileImage] = useState(userInfo.profileImage);
  const [phone, setPhone] = useState(userInfo.phone);
  const [address, setAddress] = useState(userInfo.address);
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef(null);

  const maxFileSize = 2 * 1024 * 1024; // 2MB

  // 컴포넌트가 마운트될 때 userInfo.profileImage 값 확인 및 초기화
  useEffect(() => {
    console.log(userInfo.userId);
    if (!userInfo.profileImage) {
      setProfileImage(defaultProfileImage);
    }
  }, []);


  // 버튼 클릭 이벤트 함수
  // '사진 변경' 클릭 시 새로운 이미지를 설정
  const handleChangeImage = async (event) => {
    try {
      if (userInfo.userId === '' || userInfo.userId < 1) {
        console.log('userId가 없습니다.');
        alert("userId가 없습니다.");
        return;
      }

      const file = event.target.files[0]; 
      if (!file) {
        console.log('파일이 선택되지 않았습니다.');
        return;
      }

      // 이미지 파일 필터링 (유효성 검사)
      const validImages = validateImageFile(file, maxFileSize); // 유틸리티 함수 호출

      // 유효한 이미지 파일의 URL 생성 및 상태 업데이트
      // 추후 S3에 업로드 된 이미지 
      // const newImageUrl = validImages.map((file) => URL.createObjectURL(file));
      const newImageUrl = await s3Upload(file);

      console.log( newImageUrl[0] );

      const response = await putUserProfileImage(newImageUrl[0]);

      setProfileImage(response);
    } catch (error) {
      console.error("프로필 사진 변경에 실패했습니다:", error);
      alert("프로필 사진 변경 중 문제가 발생했습니다.");
    }
  };

  // '사진 삭제' 클릭 시 기본 이미지로 초기화
  const handleDeleteImage = async () => {
    const confirmDelete = confirm('프로필 사진을 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        await deleteUserProfileImage();
        setProfileImage(defaultProfileImage); // 기본 이미지로 설정
      } catch (error) {
        console.error("프로필 사진 삭제에 실패했습니다:", error);
        alert("프로필 사진 삭제 중 문제가 발생했습니다.");
      }
    }
  };

  // 내 정보 수정
  const handleSave = async () => {
    if (!nickname || !phone || !address) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    if (phone.length !== 11) {
      alert('전화번호는 11자리여야 합니다.');
      return;
    }

    const confirmSave = confirm("저장하시겠습니까?");
    if (!confirmSave) {
      return;
    }

    try {
      const editUserInfo = {
        nickname: nickname,
        phone: phone,
        address: address
      };

      const response = await editMyInfo(editUserInfo);
      alert(response);
      setIsEditing(false);
    } catch (error) {
      console.error("error", error);
      alert('내 정보 수정 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 회원 탈퇴
  const handleLeaveAccount = async () => {
    const confirmLeave = confirm('회원 탈퇴하시겠습니까?');

    if (confirmLeave) {
      try {
        const message = await deleteUser(); 
        alert(message);
        navigate('/'); 
      } catch (error) {
        console.error('회원 탈퇴에 실패했습니다:', error);
        alert('회원 탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 사용 함수
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const opneImageFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 파일 선택 창 열기
    }
  };

  const validatePhone = (e) => {
    const inputValue = e.target.value;

    // 입력값에서 숫자만 남기기
    const digitsOnly = inputValue.replace(/[^\d]/g, '');

    // 최대 11자리 숫자만 허용
    if (digitsOnly.length > 11) return;

    setPhone(digitsOnly);
  };

  return (
    <div className="view-myinfo-container">
      <GodoTitleLabel text="마이페이지" />
      <div className='view-myinfo-title'>
        <PreTitleLabel text="내 정보" />
        <HorizontalRule type="hr1" />
      </div>

      {/* 프로필 사진 */}
      <div className="profile-section">
        <PreSubTitleLabel text="프로필 사진" />
        <div className="profile-image-container">
          <ProfileImage imageUrl={profileImage} />
          <div className="profile-buttons-container">
            <RectangleButton text={"사진 변경"} onClick={opneImageFileInput} />
            <RectangleButton text={"사진 삭제"} onClick={handleDeleteImage} />
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleChangeImage}
          style={{ display: 'none' }}
        />
      </div>

      <HorizontalRule type="hr2" />

      {/* 닉네임 */}
      <div className="nickname-wrapper">
        <PreSubTitleLabel text="닉네임" />
        <div className={`textField_container ${isEditing ? '' : 'disabled'}`}>
          {isEditing ? (
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={"searchTextField_input"}
            />
          ) : (
            <span>{nickname}</span>
          )}
        </div>
      </div>

      <HorizontalRule type="hr2" />

      {/* 휴대폰 번호 */}
      <div className="phone-wrapper">
        <PreSubTitleLabel text="휴대폰 번호" />
        <div className={`textField_container ${isEditing ? '' : 'disabled'}`}>
          {isEditing ? (
            <input
              type="text" // 여전히 type="text"를 사용 (number는 음수나 소수 입력 가능성을 배제하기 위해)
              value={phone}
              onChange={validatePhone}
              placeholder="전화번호를 입력해주세요.(- 제외) ex) 01012345678"
              className="searchTextField_input"
              inputMode="numeric" // 모바일 기기에서 숫자 키패드 표시
              pattern="\d*" // 숫자만 입력 가능하도록 설정 (HTML 속성 레벨)
            />
          ) : (
            <span>{phone}</span>
          )}
        </div>
      </div>

      <HorizontalRule type="hr2" />

      {/* 주소 */}
      <div className="address-wrapper">
        <PreSubTitleLabel text="주소" />
        <div className={`textField_container ${isEditing ? '' : 'disabled'}`}>
          {isEditing ? (
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="searchTextField_input"
            />
          ) : (
            <span>{address}</span>
          )}
        </div>
      </div>

      <HorizontalRule type="hr2" />

      {/* 회원 탈퇴 */}
      <div className="leave-account-container">
        <span className="leave-account-text" onClick={handleLeaveAccount}>
          회원 탈퇴
        </span>
        <RectangleButton text={isEditing ? "저장" : "변경"} onClick={isEditing ? handleSave : toggleEdit} />
      </div>
    </div>
  );
};

export default ViewMyInfo; 