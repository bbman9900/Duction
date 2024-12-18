// import axios from 'axios'

// 홈 페이지 - 마감 임박 상품
export async function getClosingSoonItems() {
  try {
    // const response = await axios.get("http://localhost:8080/api/items/closingsoon");
    // return response.data;
    const data = [];
    for (let i = 0; i < 5; i++) {
      data.push({
        communityId: i,
        image: "/src/assets/test_image.png",
        favorited: i%2 == 0,
        name: "으아아아악!!!!!! 리액트 고수 어디 없나!!!!!!",
        priceInfo: {price: i*10000, type: ""},
        additionalInfo: null,
        overlayText: false
      });
    }
    return data;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error; 
  }
}

// 홈 페이지 - 마스터즈컬렉션즈레어 상품
export async function getMastersCollectorsRare() {
  try {
    // const response = await axios.get("http://localhost:8080/api/items/masterscollectorsrare");
    // return response.data;
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        communityId: i,
        image: "/src/assets/test_image.png",
        favorited: i%2 == 0,
        name: "이거슨 마스터 컬렉션즈 레어 상품이다 이놈들아",
        priceInfo: {price: i*10000, type: ""},
        additionalInfo: null,
        overlayText: false
      });
    }
    return data;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error; 
  }
}

// 출품 상품 목록
export async function getItemsByCommunityId(acutionItemsRequest) {
  try {
    // const response = await axios.get("http://localhost:8080/api/items/auction", acutionItemsRequest);
    // return response.data;
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        communityId: i,
        image: "/src/assets/test_image.png",
        favorited: i%2 == 0,
        name: "아 갑자기 스타벅스 마시고 싶어졌어!",
        priceInfo: {price: i*10000, type: ""},
        additionalInfo: {bids: i, days: i},
        overlayText: i%2 == 0 ? "판매 완료" : ""
      });
    }
    return data;

  } catch (error) {
    console.error("Error fetching:", error);
    throw error; 
  }
}

// 관심 상품 페이지
export async function getFavoriteItems() {
  try {
    // const response = await axios.get(`http://localhost:8080/api/items/favorite/${user_id}`);
    // return response.data;
    const data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        communityId: i,
        image: "/src/assets/test_image.png",
        favorited: true,
        name: `관심이 있어!!`,
        priceInfo: {price: i*10000, type: ""},
        additionalInfo: null,
        overlayText: false
      });
    }
    return data;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error; 
  }
}