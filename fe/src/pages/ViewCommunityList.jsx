import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoundButton from '../components/Button/RoundButton';
import GodoTitleLabel from '../components/Labels/GodoTitleLabel';
import PreSubTitleLabel from '../components/Labels/PreSubTitleLabel';
import { fetchCommunityList } from '../services/api';

function ViewCommunityList() {
  const [abc, setAbc] = useState("가나다순");
  const [nowAlpha, setNowAlpha] = useState("가나다 전체");
  const navigate = useNavigate();
  const [koreanCommunities, setKoreanCommunities] = useState([[{ name: '가로 시작하는 커뮤니티' }], []]);
  const [englishCommunities, setEnglishCommunities] = useState([[{ name: '가로 시작하는 커뮤니티' }], []]);
  const firstWord = [
    'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];


  function abcOnClick(value) {
    setAbc(value);
    if (value === "가나다순") setNowAlpha("가나다 전체");
    else if (value === "알파벳순") setNowAlpha("알파벳 전체");
    else setNowAlpha("My");
    console.log(value);
  }

  function alphaOnClick(value) {
    setNowAlpha(value);
    console.log(nowAlpha);
  }

  function handleRoundButtonClick() {
    // "커뮤니티 개설 요청" 버튼 클릭 시 페이지 이동
    navigate('/community-request'); // 이동할 경로
  }

  const renderButtons = () => {
    if (abc === "알파벳순") {
      return (
        // 알파벳순일 경우
        <div>
          <button onClick={() => alphaOnClick("알파벳 전체")}>전체</button>
          <button onClick={() => alphaOnClick(14)}>A</button>
          <button onClick={() => alphaOnClick(15)}>B</button>
          <button onClick={() => alphaOnClick(16)}>C</button>
          <button onClick={() => alphaOnClick(17)}>D</button>
          <button onClick={() => alphaOnClick(18)}>E</button>
          <button onClick={() => alphaOnClick(19)}>F</button>
          <button onClick={() => alphaOnClick(20)}>G</button>
          <button onClick={() => alphaOnClick(21)}>H</button>
          <button onClick={() => alphaOnClick(22)}>I</button>
          <button onClick={() => alphaOnClick(23)}>J</button>
          <button onClick={() => alphaOnClick(24)}>K</button>
          <button onClick={() => alphaOnClick(25)}>L</button>
          <button onClick={() => alphaOnClick(26)}>M</button>
          <button onClick={() => alphaOnClick(27)}>N</button>
          <button onClick={() => alphaOnClick(28)}>O</button>
          <button onClick={() => alphaOnClick(29)}>P</button>
          <button onClick={() => alphaOnClick(30)}>Q</button>
          <button onClick={() => alphaOnClick(31)}>R</button>
          <button onClick={() => alphaOnClick(32)}>S</button>
          <button onClick={() => alphaOnClick(33)}>T</button>
          <button onClick={() => alphaOnClick(34)}>U</button>
          <button onClick={() => alphaOnClick(35)}>V</button>
          <button onClick={() => alphaOnClick(36)}>W</button>
          <button onClick={() => alphaOnClick(37)}>X</button>
          <button onClick={() => alphaOnClick(38)}>Y</button>
          <button onClick={() => alphaOnClick(39)}>Z</button>
        </div>
      );
    } else if (abc === "가나다순") {
      return (
        <div>
          <button onClick={() => alphaOnClick("가나다 전체")}>전체</button>
          <button onClick={() => alphaOnClick(0)}>ㄱ</button>
          <button onClick={() => alphaOnClick(1)}>ㄴ</button>
          <button onClick={() => alphaOnClick(2)}>ㄷ</button>
          <button onClick={() => alphaOnClick(3)}>ㄹ</button>
          <button onClick={() => alphaOnClick(4)}>ㅁ</button>
          <button onClick={() => alphaOnClick(5)}>ㅂ</button>
          <button onClick={() => alphaOnClick(6)}>ㅅ</button>
          <button onClick={() => alphaOnClick(7)}>ㅇ</button>
          <button onClick={() => alphaOnClick(8)}>ㅈ</button>
          <button onClick={() => alphaOnClick(9)}>ㅊ</button>
          <button onClick={() => alphaOnClick(10)}>ㅋ</button>
          <button onClick={() => alphaOnClick(11)}>ㅌ</button>
          <button onClick={() => alphaOnClick(12)}>ㅍ</button>
          <button onClick={() => alphaOnClick(13)}>ㅎ</button>
        </div>
      );
    }
    else {
      return (
        <div>
          추후 마이 커뮤니티로 변경
        </div>
      );
    }
  };

  const alphabetCommunity = (value) => {
    let filteredCommunities = [];
    let word = firstWord[value];
    if (value === "가나다 전체") {
      filteredCommunities = koreanCommunities;
      word = "한글 전체";
    }
    else if (value === "알파벳 전체") {
      filteredCommunities = englishCommunities;
      word = "알파벳 전체";
    }
    else if (value < 14) filteredCommunities = koreanCommunities[value];
    else if (value >= 14) filteredCommunities = englishCommunities[value - 14];
    else {
      // My
      // 커뮤니티 전체 목록에서 관심 표시로 필터링
      // filteredCommunities = (koreanCommunities + englishCommunities).filter(
      //   community => community.first_word === value
      // );
    }

    for (let i=0; i<filteredCommunities.length; i++) {

    }

    return (
      <div>
        <hr className='divider' />
        <GodoTitleLabel text={word} />
        {filteredCommunities.length > 0 ? (
          filteredCommunities.map((community, index) => (
            <div key={index}>
              <img alt="communityImage" />
              <PreSubTitleLabel text={community.name} />
            </div>
          ))
        ) : (
          <p>표시할 커뮤니티가 존재하지 않습니다.</p>
        )}
      </div>
    );
  };

  useEffect(() => {
    console.log("컴포넌트 마운트");
    const ga = []; const na = []; const da = []; const ra = []; const ma = []; const ba = []; const sa = []; const a = []; const ja = []; const cha = []; const ka = []; const ta = []; const pa = []; const ha = [];
    const aWords = []; const bWords = []; const cWords = []; const dWords = []; const eWords = []; const fWords = []; const gWords = []; const hWords = []; const iWords = []; const jWords = []; const kWords = []; const lWords = []; const mWords = []; const nWords = []; const oWords = []; const pWords = []; const qWords = []; const rWords = []; const sWords = []; const tWords = []; const uWords = []; const vWords = []; const wWords = []; const xWords = []; const yWords = []; const zWords = [];

    const fetchData = async () => {
      try {
        // api 전체 커뮤니티 목록 호출
        const data = await fetchCommunityList();
        console.log(data);

        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          const firstChar = item.first_word[0]; // 첫 번째 문자를 가져옴
          console.log(firstChar);

          switch (firstChar) {
            // 한글 초성
            case "ㄱ":
              ga.push(item);
              break;
            case "ㄴ":
              na.push(item);
              break;
            case "ㄷ":
              da.push(item);
              break;
            case "ㄹ":
              ra.push(item);
              break;
            case "ㅁ":
              ma.push(item);
              break;
            case "ㅂ":
              ba.push(item);
              break;
            case "ㅅ":
              sa.push(item);
              break;
            case "ㅇ":
              a.push(item);
              break;
            case "ㅈ":
              ja.push(item);
              break;
            case "ㅊ":
              cha.push(item);
              break;
            case "ㅋ":
              ka.push(item);
              break;
            case "ㅌ":
              ta.push(item);
              break;
            case "ㅍ":
              pa.push(item);
              break;
            case "ㅎ":
              ha.push(item);
              break;

            // 알파벳
            case "A":
              aWords.push(item);
              break;
            case "B":
              bWords.push(item);
              break;
            case "C":
              cWords.push(item);
              break;
            case "D":
              dWords.push(item);
              break;
            case "E":
              eWords.push(item);
              break;
            case "F":
              fWords.push(item);
              break;
            case "G":
              gWords.push(item);
              break;
            case "H":
              hWords.push(item);
              break;
            case "I":
              iWords.push(item);
              break;
            case "J":
              jWords.push(item);
              break;
            case "K":
              kWords.push(item);
              break;
            case "L":
              lWords.push(item);
              break;
            case "M":
              mWords.push(item);
              break;
            case "N":
              nWords.push(item);
              break;
            case "O":
              oWords.push(item);
              break;
            case "P":
              pWords.push(item);
              break;
            case "Q":
              qWords.push(item);
              break;
            case "R":
              rWords.push(item);
              break;
            case "S":
              sWords.push(item);
              break;
            case "T":
              tWords.push(item);
              break;
            case "U":
              uWords.push(item);
              break;
            case "V":
              vWords.push(item);
              break;
            case "W":
              wWords.push(item);
              break;
            case "X":
              xWords.push(item);
              break;
            case "Y":
              yWords.push(item);
              break;
            case "Z":
              zWords.push(item);
              break;
            default:
              break;
          }
        }

        const korean = [ga, na, da, ra, ma, ba, sa, a, ja, cha, ka, ta, pa, ha];
        const english = [aWords, bWords, cWords, dWords, eWords, fWords, gWords, hWords, iWords, jWords, kWords, lWords, mWords, nWords, oWords, pWords, qWords, rWords, sWords, tWords, uWords, vWords, wWords, xWords, yWords, zWords];

        setKoreanCommunities(korean);
        setEnglishCommunities(english);

      } catch (error) {
        console.error("데이터를 가져오는 동안 오류가 발생했습니다.", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("업데이트 koreanCommunities:", koreanCommunities);
  }, [koreanCommunities]);

  useEffect(() => {
    console.log("업데이트 englishCommunities:", englishCommunities);
  }, [englishCommunities]);


  return (
    <>
      {/* 가나다순, 알파벳순, MY */}
      <div>
        <button className="ganada" onClick={() => abcOnClick("가나다순")}>가나다순</button>
        <button className="abc" onClick={() => abcOnClick("알파벳순")}>알파벳순</button>
        <button className="my" onClick={() => abcOnClick("My")}>
          {/* <image></image> */}
          MY
        </button>
      </div>
      {/* 전체 ㄱ,ㄴ,ㄷ ... 커뮤니티 개설 요청 */}
      <div>
        {renderButtons()}
        <RoundButton onClick={handleRoundButtonClick} options={[{value: "", title: "커뮤니티 개설 요청"}]} />
      </div>
      <div>
        {alphabetCommunity(nowAlpha)}
      </div>
    </>
  );
}

export default ViewCommunityList;