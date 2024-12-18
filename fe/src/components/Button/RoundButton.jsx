import { useState } from 'react'

import '@styles/components/Buttons.css'

export default function RoundButton({ options, onChange }) {
  const [selected, setSelected] = useState(options[0].value);

  const handleChange = (value) => {
    setSelected(value);
    if (onChange) onChange(value);
  };

  return (
    <div>
      {options.map((option) => (
        <button
          key={option.value}
          className={`buttonBase roundButton ${selected === option.value ? 'selected' : ''}`}
          onClick={() => handleChange(option.value)}
        >
          {option.title}
        </button>
      ))}
    </div>
  )
}
