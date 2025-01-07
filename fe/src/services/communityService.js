import api from './api.js'

// 홈 페이지 - 인기 커뮤니티
export async function getPopularCommunities() {
  try {
    const response = await api.get("communities/popular");
    return response.data;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error; 
  }
}

// 커뮤니티 목록 가져오기
export async function getCommunities() {
  try {
    const response = await api.get("communities");
    return response.data;
  } catch (error) {
    console.error("Error fetching community list:", error);
    throw error;
  }
}

// 통합 검색 페이지 - 커뮤니티 검색 결과
export async function getCommunitySearchResults(searchText) {
  try {
    // const response = await api.get(`communities/result/list/${searchText}`);
    // return response.data;
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        title: `${i} ${searchText}`,
        isFavorited: i % 2 == 0 ? true : false,
      });
    }
    return data;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error; 
  }
}

// 커뮤니티 관심 등록
export async function postFavoriteCommunity(communityId) {
  try {
    await api.post(`communities/favorites/add/${communityId}`)
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

// 커뮤니티 관심 해제
export async function deleteFavoriteCommunity(communityId) {
  try {
    await api.delete(`communities/favorites/delete/${communityId}`)
  } catch {
    console.log("error", error);
    throw error;
  }
}
