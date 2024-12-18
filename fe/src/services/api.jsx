// import axios from 'axios'

// 홈 페이지 - 인기 카테고리
export async function getPopularCategories() {
  try {
    // const response = await axios.get("http://localhost:8080/api/communities/popularity");
    // return response.data;
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        title: "디즈니랜드 마븖히어로즈 스파이더맨",
        isFavorited: i % 2 == 0 ? true : false,
      });
    }
    return data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
}

// 커뮤니티 목록 가져오기
export async function fetchCommunityList() {
  try {
    // const response = await axios.get("http://localhost:8080/api/communities/list");
    // return response.data;
    const data = [];
    data.push({
      name: "가방 커뮤니티",
      first_word: "ㄱ"
    });
    data.push({
      name: "나방",
      first_word: "ㄴ"
    });
    data.push({
      name: "하방",
      first_word: "ㅎ"
    });
    data.push({
      name: "apple",
      first_word: "A"
    });
    data.push({
      name: "ZionT",
      first_word: "Z"
    });
    return data;
  } catch (error) {
    console.error("Error fetching community list:", error);
    throw error;
  }
}
