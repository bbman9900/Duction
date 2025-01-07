import { useEffect, useMemo, useState } from "react";
import { getCommunities } from "../services/communityService";
import GodoTitleLabel from "../components/Labels/GodoTitleLabel";
import PreTextLabel from "../components/Labels/PreTextLabel";
import HorizontalRule from "../components/HorizontalRule";
import AllCommunityList from "../components/CommunityList/AllCommunityList"
import CharCommunityList from "../components/CommunityList/CharCommunityList"

import "@styles/pages/ViewCommunityList.css";
import RectangleButton from "../components/Button/RectangleButton";
import { useNavigate } from "react-router-dom";

export default function ViewCommunityList() {
  const hangle = ['전체', 'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const alphabet = ['전체', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  const [communities, setCommunities] = useState([])
  const [selectedTab, setSelectedTab] = useState('가나다순'); 
  const [selectedChar, setSelectedChar] = useState('전체'); 

  const titleItems = selectedTab === '가나다순' ? hangle : alphabet;

  const navigate = useNavigate()

  const navigateToRequestAddCommunity = () => {
    navigate("/requestAddCommunity")
  }

  const fetchCommunities = async () => {
    const data = await getCommunities();
    setCommunities(data)
  }
  const groupedCommunities = useMemo(() => {
    if (!communities || Object.keys(communities).length === 0) {
      return {};
    }

    if (selectedTab === 'MY') {
      const filtered = Object.entries(communities).reduce((newMap, [key, value]) => {
        const favoriteOnly = value.filter((community) => community.favorite);
        if (favoriteOnly.length > 0) {
          newMap[key] = favoriteOnly;
        }
        return newMap;
      }, {});

      return filtered;
    }

    const keys = Object.keys(communities).filter((key) =>
      selectedTab === '가나다순' ? /^[ㄱ-ㅎ|가-힣]/.test(key) : /^[A-Z]/i.test(key)
    );

    return keys.reduce((newMap, key) => {
      newMap[key] = communities[key];
      return newMap;
    }, {});
  }, [communities, selectedTab]);

  const filteredCommunities = useMemo(() => {
    if (!communities || Object.keys(communities).length === 0) {
      return [];
    }

    if (selectedChar === "전체") {
      const keys = Object.keys(communities).filter((key) => 
        selectedTab === '가나다순' ? /^[ㄱ-ㅎ|가-힣]/.test(key) : /^[A-Z]/i.test(key))
      return keys.flatMap((key) => communities[key]);
    }

    return communities[selectedChar.toLowerCase()] || [];

  }, [selectedChar, selectedTab, communities]);

  useEffect(() => {
    fetchCommunities()
  }, [])

  return (
    <>
      <div className="communityList_title">
        <div 
          className={`communityList_title_items ${selectedTab === '가나다순' ? 'selected' : ''}`} 
          onClick={() => {
            setSelectedTab('가나다순');
            setSelectedChar('전체'); 
          }}
        >
          <GodoTitleLabel text="가나다순" />
        </div>
        <div 
          className={`communityList_title_items ${selectedTab === '알파벳순' ? 'selected' : ''}`} 
          onClick={() => {
            setSelectedTab('알파벳순');
            setSelectedChar('전체'); 
          }}
        >
          <GodoTitleLabel text="알파벳순" />
        </div>
        <div 
          className={`communityList_title_items ${selectedTab === 'MY' ? 'selected' : ''}`} 
          onClick={() => {
            setSelectedTab('MY');
            setSelectedChar('전체'); 
          }}
        >
          <img src="/src/assets/duck_selected.png" width={20} height={20} alt="My Icon" />
          <GodoTitleLabel text="MY" />
        </div>
      </div>

      {selectedTab !== 'MY' && (
        <div className="communityList_subTitle">
          {titleItems.map((char, index) => (
            <div 
              key={index} 
              className={`communityList_subTitle_item ${selectedChar === char ? 'selected' : ''}`}
              onClick={() => setSelectedChar(char)}
            >
              <PreTextLabel text={char} />
            </div>
          ))}
          <RectangleButton text="커뮤니티 개설 요청" onClick={navigateToRequestAddCommunity}/>
        </div>
      )}

      <HorizontalRule type="hr2" />

      {selectedChar === "전체" || selectedTab === "MY" ? (
        <AllCommunityList communities={groupedCommunities} />
      ) : (
        <CharCommunityList communities={filteredCommunities} />
      )}
    </>
  );
}
