import { useState, useEffect } from "react";
import PreTitleLabel from '../components/Labels/PreTitleLabel'

import '@styles/components/DateNavigator.css'

export default function DateNavigator( {onDateChange} ) {
  const [currentDate, setCurrentDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  const handlePreMonth = () => {
    setCurrentDate((preDate) => {
      const newMonth = preDate.month - 1
      return newMonth < 1 ? { year: preDate.year - 1, month: 12 } : { ...preDate, month: newMonth }
    })
  }

  const handleNextMonth = () => {
    setCurrentDate((preDate) => {
      const newMonth = preDate.month + 1
      return newMonth > 12 ? { year: preDate.year + 1, month: 1 } : { ...preDate, month: newMonth }
    })
  }

  useEffect(() => {
    if (onDateChange) {
      onDateChange(currentDate.year, currentDate.month);
    }
  }, [currentDate]);

  return (
    <div>
      <div className='dateNavigator_container'>
        <button onClick={handlePreMonth}>
          <img src='/assets/preMonth.png' />
        </button>
        <PreTitleLabel text={`${currentDate.year}년 ${currentDate.month}월`} />        
        <button onClick={handleNextMonth}>
        <img src='/assets/nextMonth.png' />
        </button>
      </div>
    </div>
  )
}