import '../styles/pages/RegistItem.css';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GodoTitleLabel from '../components/Labels/GodoTitleLabel';
import PreTitleLabel from '../components/Labels/PreTitleLabel';
import PreSubTitleLabel from '../components/Labels/PreSubTitleLabel';
import StarRating from '../components/Button/StarRating';
import NumericInput from '../components/NumericInput';
import RectangleButton from '../components/Button/RectangleButton';
import Calendar from '../components/Calendar';
import { validateImageFile } from "../utils/ImageFileValidators";
import { putItemEdit, getItemEdit } from '../services/itemService';
import HorizontalRule from '../components/HorizontalRule';
import PreCaptionLabel from '../components/Labels/PreCaptionLabel';
import s3Upload from '../utils/S3Uploader';

function EditItem() {
  const navigate = useNavigate();
  const { itemId } = useParams();

  const [images, setImages] = useState([]); // 기존 이미지 S3 URL들의 상태
  const [newImageFiles, setNewImageFiles] = useState([]); // 추가된 새 이미지 파일들의 파일 상태
  const [removeImages, setRemoveImages] = useState([]); // 삭제할 기존 이미지 S3 URL 상태
  const [itemName, setItemName] = useState(""); // 상품 이름 상태
  const [description, setDescription] = useState(""); // 상세 설명 상태
  const [itemCondition, setItemCondition] = useState(""); // 상품 상태
  const [rareScore, setRareScore] = useState(0); // 레어 점수 (별점)
  const [startingBid, setStartingBid] = useState(""); // 시작가
  const [auctionEndDate, setAuctionEndDate] = useState(null); // 경매 종료일
  const [immediateBid, setImmediateBid] = useState(""); // 즉시 낙찰가

  const fileInputRef = useRef(null);

  const maxFileSize = 2 * 1024 * 1024; // 2MB
  const maxFileCount = 9; // 최대 파일 개수

  useEffect(() => {
    console.log("컴포넌트 마운트");

    const fetchData = async () => {
      try {
        // api 수정할 상품 정보 호출
        const data = await getItemEdit(itemId);
        console.log(data);

        // 상품 데이터를 상태에 업데이트
        setItemName(data.itemName || "");
        setDescription(data.description || "");
        setItemCondition(data.itemCondition || "");
        setRareScore(data.rareScore || 0);
        setStartingBid(data.startPrice || "");
        setAuctionEndDate(data.endTime || null);
        setImmediateBid(data.immediatePrice || "");

        // 이미지 배열 업데이트
        if (data.imageUrls && Array.isArray(data.imageUrls)) {
          setImages(data.imageUrls); // 초기 이미지 URL 설정
        }

      } catch (error) {
        console.error("데이터를 가져오는 동안 오류가 발생했습니다.", error);
      }
    };

    fetchData();
  }, []);

  // 상품 상태 변경 관리
  const handleConditionChange = (event) => {
    setItemCondition(event.target.value);
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 파일 선택 창 열기
    }
  };

  // 이미지 URL 업로드 관리
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    // 이미지 파일 필터링 (유효성 검사)
    const validImages = files.filter((file) =>
      validateImageFile(file, maxFileSize) // 유틸리티 함수 호출
    );

    // 총 이미지 개수가 9개를 초과하면 업로드 제한
    if (images.length + validImages.length > maxFileCount) {
      alert(`이미지는 최대 ${maxFileCount}장만 첨부할 수 있습니다.`);
      return;
    }

    // 유효한 이미지 파일의 URL 생성 및 상태 업데이트
    const newImages = validImages.map((file) => URL.createObjectURL(file));

    // 상태 업데이트
    setImages((prevNewImages) => [...prevNewImages, ...newImages]);
    setNewImageFiles((prevNewImageFiles) => [...prevNewImageFiles, ...validImages]);
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = images[index];

    if (index < images.length - newImageFiles.length) {
      // 기존 이미지인 경우
      setRemoveImages((prevRemoveImages) => [...prevRemoveImages, imageToRemove]);
    } else {
      // 새로 추가된 이미지인 경우
      const newIndex = index - (images.length - newImageFiles.length);
      setNewImageFiles((prevNewImageFiles) =>
        prevNewImageFiles.filter((_, i) => i !== newIndex)
      );
    }

    // 공통: 이미지 UI에서 제거
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleCancleClick = () => {
    window.history.back();
  }

  const handleSubmitClick = async () => {
    try {
      console.log("필수 값 : ", images, itemName, description, itemCondition, rareScore, startingBid, auctionEndDate);

      // 필수 값 체크
      if (
        images.length === 0 || // 이미지가 선택되지 않음
        !itemName.trim() || // 상품 이름이 비어있음
        !description.trim() || // 상세 설명이 비어있음
        !itemCondition.trim() || // 상품 상태가 비어있음
        rareScore === null || // 레어 점수가 설정되지 않음
        !startingBid || // 시작가가 비어있음
        !auctionEndDate // 경매 종료일이 선택되지 않음
      ) {
        alert("필수 값을 입력해주세요.");
        return; // 조건을 만족하지 않으면 함수 종료
      }

      // 즉시 낙찰가가 시작가보다 낮은 경우 경고 표시
      if (immediateBid && Number(immediateBid) < Number(startingBid)) {
        alert("즉시 낙찰가는 시작가보다 낮게 입력할 수 없습니다.");
        return;``
      }

      

      // 1. 새 이미지 파일 업로드
      // S3에 이미지 업로드 후 URL 반환
      const addImageUrls = await s3Upload(newImageFiles);

      // 2. 기존 이미지 삭제 요청
      if (removeImages.length > 0) {
        // await Promise.all(removeImages.map((url) => deleteImage(url))); // 서버 요청 병렬 처리
        // 서버에서 할 일
        // 1. S3 에서 사진 업로드 삭제
        // 2. 사진 url로  DB에서 삭제
        console.log("삭제된 이미지:", removeImages);
      }

      // 서버 업로드 API 로직 추가 필요
      // 3. 새 이미지의 S3 URL을  추가

      // DTO 생성
      const dto = {
        itemName,
        addImageUrls,
        removeImageUrls: removeImages,
        description,
        itemCondition,
        rareScore,
        startPrice: startingBid,
        endTime: auctionEndDate,
        immediatePrice: immediateBid,
      };
      // API POST 요청
      const response = await putItemEdit(itemId, dto);
      console.log("성공적으로 등록되었습니다:", response.data);

      // 성공적으로 등록 후 페이지 이동
      navigate(`/viewItem/${itemId}`);
    } catch (error) {
      console.error("상품 등록에 실패했습니다:", error);
      alert("상품 등록 중 문제가 발생했습니다.");
    }
  }

  // 상품 상태 라디오 버튼 화면
  const RadioButtonGroup = () => {
    const radioOptions = [
      { value: "NEW", label: "새 상품 (미사용)", description: "사용하지 않음 새 상품" },
      { value: "NO_USE", label: "사용감 없음", description: "사용은 했지만 눈에 띄는 흔적 없음" },
      { value: "LESS_USE", label: "사용감 적음", description: "눈에 띄는 흔적 있음" },
      { value: "MANY_USE", label: "사용감 많음", description: "눈에 띄는 흔적 많음" },
      { value: "BROKEN", label: "고장/파손 상품", description: "기능 손상으로 인해 수리/수선 필요" },
    ];

    return (
      <div className="radio-button-group">
        {radioOptions.map((option) => (
          <div className="radio-item" key={option.value}>
            <input
              type="radio"
              id={option.value}
              name="itemCondition"
              value={option.value}
              checked={itemCondition === option.value} // 현재 상태와 비교
              onChange={handleConditionChange} // 상태 변경 핸들러 사용
            />
            <label htmlFor={option.value}>
              <span className="radio-label">{option.label}</span>
              <span className="radio-description">{option.description}</span>
            </label>
          </div>
        ))}
      </div>
    );
  };


  return (
    <div className="regist-item-container">
      <GodoTitleLabel text={"출품 상품 수정"} />

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
                <img src="/assets/camera.png" alt="카메라 아이콘" />
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

      {/* 상품 상태 */}
      <div className="inline_container">
        <PreSubTitleLabel text={"상품 상태"} />
        <div className='inline_content'>
          <RadioButtonGroup />
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

export default EditItem;