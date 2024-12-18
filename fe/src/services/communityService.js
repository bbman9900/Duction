// import axios from 'axios'

// - 커뮤니티 정보 불러오기
export async function getCommunityInfo(communityId) {
  try {
    // const response = await axios.get(`http://localhost:8080/api/communities/${communityId}`);
    // return response.data;
    const id = Number(communityId); // 백엔드 연결할 때는 딱히 필요 없을 것 같음 
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        name: `Community ${i}`,
      });
    }
    return data[id];
  } catch (error) {
    console.error("Error fetching:", error);
    throw error; 
  }
}

// 홈 페이지 - 인기 커뮤니티
export async function getPopularCommunities() {
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
    console.error("Error fetching:", error);
    throw error; 
  }
}
