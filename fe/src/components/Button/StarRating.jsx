import React, { useState } from "react";
import "../../styles/components/StarRating.css";

const StarRating = ({ rating, onChange }) => {
  const [hoveredValue, setHoveredValue] = useState(null); // 마우스 오버 시 임시 점수

  const handleMouseMove = (event, index) => {
    event.stopPropagation(); // 이벤트 전파 방지
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;

    const value =
      index === 4 && x >= width - 10
        ? 5 // 마지막 별은 이미지 영역을 넘어도 Full Star
        : index + (x >= width / 2 ? 0.5 : 0);
    setHoveredValue(value);
  };

  const handleClick = () => {
    const selectedRating = hoveredValue !== null ? hoveredValue : 0; // 0도 정상적으로 선택 가능
    if (onChange) {
      onChange(selectedRating); // 부모 컴포넌트로 선택한 점수를 전달
    }
  };

  const handleMouseLeave = () => {
    setHoveredValue(null);
  };

  const renderStar = (index) => {
    const currentRating = hoveredValue !== null ? hoveredValue : rating;

    const isFullStar = currentRating >= index + 1;
    const isHalfStar = !isFullStar && currentRating >= index + 0.5;

    if (isFullStar) {
      return (
        <img
          src="/assets/full_star.png"
          alt="Full Star"
          className="star"
          key={index}
          onMouseMove={(event) => handleMouseMove(event, index)}
          onClick={handleClick}
        />
      );
    } else if (isHalfStar) {
      return (
        <img
          src="/assets/half_star.png"
          alt="Half Star"
          className="star"
          key={index}
          onMouseMove={(event) => handleMouseMove(event, index)}
          onClick={handleClick}
        />
      );
    } else {
      return (
        <img
          src="/assets/empty_star.png"
          alt="Empty Star"
          className="star"
          key={index}
          onMouseMove={(event) => handleMouseMove(event, index)}
          onClick={handleClick}
        />
      );
    }
  };

  return (
    <div className="star-rating-wrapper">
      <div className="star-rating" onMouseLeave={handleMouseLeave}>
        {[...Array(5)].map((_, index) => renderStar(index))}
      </div>
    </div>
  );
};

export default StarRating;
