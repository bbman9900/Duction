import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { validateImageFile } from "../utils/ImageFileValidators";
import { postItem } from '../services/itemService';
import GodoTitleLabel from '../components/Labels/GodoTitleLabel';
import PreTitleLabel from '../components/Labels/PreTitleLabel';
import PreSubTitleLabel from '../components/Labels/PreSubTitleLabel';
import StarRating from '../components/Button/StarRating';
import NumericInput from '../components/NumericInput';
import RectangleButton from '../components/Button/RectangleButton';
import Calendar from '../components/Calendar';
import HorizontalRule from '../components/HorizontalRule';
import PreCaptionLabel from '../components/Labels/PreCaptionLabel';
import RadioButtonGroup from "../components/RadioButtonGroup"

import '../styles/pages/RegistItem.css';

function RegistItem() {

  const navigate = useNavigate();
  const location = useLocation();
  const communityId = location.state?.communityId;

  const [images, setImages] = useState([]); // 이미지 URL 상태
  const [imageFiles, setImageFiles] = useState([]); // 이미지 파일 상태
  const [itemName, setItemName] = useState(""); // 상품 이름 상태
  const [description, setDescription] = useState(""); // 상세 설명 상태
  const [itemCondition, setItemCondition] = useState(""); // 상품 상태
  const [rareScore, setRareScore] = useState(null); // 레어 점수 (별점)
  const [startingBid, setStartingBid] = useState(""); // 시작가
  const [auctionEndDate, setAuctionEndDate] = useState(null); // 경매 종료일
  const [immediateBid, setImmediateBid] = useState(""); // 즉시 낙찰가

  const fileInputRef = useRef(null);
  const maxFileSize = 2 * 1024 * 1024; // 2MB
  const maxFileCount = 9; // 최대 파일 개수

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 이미지 URL 업로드 관리
  const handleFileChange = (event) => {
    const files = event.target.files;

    // 이미지 파일 필터링 (유효성 검사)
    const validImages = Array.from(files).filter((file) =>
      validateImageFile(file, maxFileSize)
    );

    // 총 이미지 개수가 9개를 초과하면 업로드 제한
    if (images.length + validImages.length > maxFileCount) {
      alert("이미지는 최대 9장만 첨부할 수 있습니다.");
      return;
    }

    // 유효한 이미지 파일의 URL 생성 및 상태 업데이트
    const newImages = validImages.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...newImages]);

    // 서버로 보낼 파일 객체 관리
    setImageFiles((prevValidImages) => [...prevValidImages, ...validImages]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => {
      const imageToRevoke = prevImages[index];
      URL.revokeObjectURL(imageToRevoke)
      return prevImages.filter((_, i) => i !== index)
    })

    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)); 
  };

  const handleCancleClick = () => {
    window.history.back();
  }

  const handleSubmitClick = async () => {
    // 필수 값 체크
    if (
      imageFiles.length === 0 || // 이미지가 선택되지 않음
      !itemName.trim() || // 상품 이름이 비어있음
      !description.trim() || // 상세 설명이 비어있음
      !itemCondition.trim() || // 상품 상태가 비어있음
      rareScore === null || // 레어 점수가 설정되지 않음
      !startingBid || // 시작가가 비어있음
      !auctionEndDate // 경매 종료일이 선택되지 않음
    ) {
      alert("필수 값을 입력해주세요.");
      return;
    }

    // 즉시 낙찰가가 시작가보다 낮은 경우 경고 표시
    if (immediateBid && Number(immediateBid) < Number(startingBid)) {
      alert("즉시 낙찰가는 시작가보다 낮게 입력할 수 없습니다.");
      return;
    }

    const formattedDate = new Date(auctionEndDate).toISOString();
    const formData = new FormData();

    formData.append("name", itemName); 
    formData.append("description", description);
    formData.append("itemCondition", itemCondition);
    formData.append("rareScore", rareScore);
    formData.append("startingBid", startingBid);
    formData.append("endTime", formattedDate);
    formData.append("immediateBid", immediateBid || null);
    formData.append("communityId", communityId);

    imageFiles.forEach((file) => {
      formData.append("itemImages", file);
    });

    try {
      const response = await postItem(formData);
      navigate("/viewItem", { state: { itemId: response } });
    } catch (error) {
      alert("상품 등록 중 문제가 발생했습니다.");
    }
  }

  return (
    <div className="regist-item-container">
      <GodoTitleLabel text={"출품 상품 등록"} />

      <div className='regist_item_title'>
        <PreTitleLabel text={"상품 정보"} />
      </div>

      <HorizontalRule type="hr1" />

      {/* 상품 이름 */}
      <div className="inline_container">
        <PreSubTitleLabel text={"상품 이름"} />
        <div className='postForm_title'>
          <input
            type="text"
            placeholder="출품 상품 이름을 입력해주세요 (150자)"
            maxLength="150"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="searchTextField_input"
          />
        </div>
      </div>

      <HorizontalRule type="hr2" />

      {/* 사진 */}
      <div className="inline_container">
        <PreSubTitleLabel text={"사진 (최대 9장)"} />

        <div className="image-container">
          {/* 첫 번째 줄: 등록 버튼과 최대 3개의 이미지 */}
          <div className="image-row">
            {/* 이미지 등록 버튼 */}
            <div className="image-upload-wrapper" onClick={handleImageClick}>
              <div className="upload-icon">
                <img src="/src/assets/camera.png" alt="카메라 아이콘" />
                <div>이미지 등록</div>
              </div>
            </div>

            {/* 첫 번째 줄 이미지 */}
            {images.slice(0, 4).map((image, index) => (
              <div key={index} className="image-wrapper">
                <img
                  src={image}
                  alt={`첨부된 이미지 ${index + 1}`}
                  className="preview-image"
                />
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => handleRemoveImage(index)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* 두 번째 줄: 최대 5개의 이미지 */}
          <div className="image-row">
            {images.slice(4).map((image, index) => (
              <div key={index} className="image-wrapper">
                <img
                  src={image}
                  alt={`첨부된 이미지 ${index + 5}`}
                  className="preview-image"
                />
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => handleRemoveImage(index + 4)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          style={{ display: 'none' }}
        />
      </div>

      <HorizontalRule type="hr2" />

      {/* 상세 설명 */}
      <div className="inline_container">
        <PreSubTitleLabel text={"상세 설명"} />
        <div className='inline_container_textarea postForm_textarea'>
          <textarea
            placeholder='출품 상품의 상세 설명을 입력해주세요'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <HorizontalRule type="hr2" />

      {/* 상품 상태 */}
      <div className="inline_container">
        <PreSubTitleLabel text={"상품 상태"} />
        <div className='inline_content'>
          <RadioButtonGroup
            selectedValue={itemCondition}
            onChange={(value) => setItemCondition(value)}
          />        
        </div>
      </div>

      <HorizontalRule type="hr2" />

      {/* 레어 점수 평가 */}
      <div className="inline_container">
        <PreSubTitleLabel text={"레어 점수 평가"} />
        <div className='inline_content'>
          <div className="star-rating-wrapper">
            <StarRating rating={rareScore} onChange={(rating) => setRareScore(rating)} />
            <span>{rareScore || 0} 점</span>
          </div>
        </div>
      </div>

      <div className='regist_item_title'>
        <PreTitleLabel text={"경매 정보"} />
      </div>

      <HorizontalRule type="hr1" />

      {/* 시작가 */}
      <div className="inline_container">
        <PreSubTitleLabel text={"시작가"} />
        <div className='postForm_title'>
          <NumericInput
            value={startingBid}
            onChange={(value) => setStartingBid(value)}
            placeholder="시작가를 입력해주세요."
          />
        </div>
      </div>

      <HorizontalRule type="hr2" />

      {/* 경매 종료일 */}
      <div className="inline_container">
        <PreSubTitleLabel text={"경매 종료일"} />
        <div className='inline_content'>
          <Calendar
            selected={auctionEndDate}
            onChange={(date) => setAuctionEndDate(date)}
            placeholderText='경매 종료일을 선택해주세요' />
        </div>
      </div>

      <div className='regist_item_title'>
        <PreTitleLabel text={"추가 정보"} />
        <PreCaptionLabel text={"선택 사항"} style={{ color: "#bebebe" }} />
      </div>

      <HorizontalRule type="hr1" />

      <div className="inline_container">
        <PreSubTitleLabel text={"즉시 낙찰가"} />
        <div className='postForm_title'>
          <NumericInput
            value={immediateBid}
            onChange={(value) => setImmediateBid(value)}
            placeholder="즉시 낙찰가를 입력해주세요" />
        </div>
      </div>

      <HorizontalRule type="hr2" />

      {/* 버튼 */}
      <div className="bidPointModalContent_buttons">
        <RectangleButton text={"취소"} onClick={handleCancleClick} />
        <RectangleButton text={"확인"} onClick={handleSubmitClick} />
      </div>
    </div >
  );
}

export default RegistItem;