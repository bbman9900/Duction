import PreTextLabel from './Labels/PreTextLabel';
import PreCaptionLabel from './Labels/PreCaptionLabel';

export default function RadioButtonGroup ({ selectedValue, onChange }) {
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
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
          />
          <label htmlFor={option.value}>
            <div className="radio-label"><PreTextLabel text={option.label} /></div>
            <div className="radio-description"><PreCaptionLabel text={option.description} /></div>
          </label>
        </div>
      ))}
    </div>
  );
};