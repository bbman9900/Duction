import { useState } from 'react'
import '@styles/components/TextField.css'

export default function SearchTextField({ placeholder, onSearch }) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    if (searchText.trim()) onSearch(searchText.trim());
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className={`searchTextField_container ${isFocused ? 'focused' : ''}`}>
      <input
        className={'searchTextField_input'}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={handleEnterKey}
      />
      <button onClick={handleSearch} className='searchTextField_button'>
        <img src='/assets/search.png'/>
      </button>
    </div>
  )
}
