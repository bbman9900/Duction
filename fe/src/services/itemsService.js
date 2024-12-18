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
    // const response = await api.get("items/auction", {
    //   params: acutionItemsRequest,
    // });
    // return response.data;
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        communityId: i,
        image: "/src/assets/test_image.png",
        favorited: i % 2 == 0,
        name: "아 갑자기 스타벅스 마시고 싶어졌어!",
        priceInfo: { price: i * 10000, type: "" },
        additionalInfo: { bids: i, days: i },
        overlayText: i % 2 == 0 ? "판매 완료" : ""
      });
    }
    return data;

  } catch (error) {
    console.error("Error fetching:", error);
    throw error;
  }
}

// 상품 등록 API 호출
export async function createItem(dto) {
  console.log(dto);
  return true;
  // try {
  //   const response = await api.post("/api/items", dto); // 서버에 POST 요청
  //   return response.data; // 성공적으로 응답 데이터를 반환
  // } catch (error) {
  //   console.error("상품 등록에 실패했습니다:", error);
  //   throw error; // 에러를 호출한 쪽으로 전달
  // }
}

// 통합 검색 페이지 - 출품 상품 검색 결과
export async function getItemSearchResults(searchText) {
  try {
    // const response = await api.get(`/items/result/list/${searchText}`);
    // return response.data;
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        communityId: i,
        image: "/src/assets/test_image.png",
        favorited: i%2 == 0,
        name: "아 갑자기 스타벅스 마시고 싶어졌어!",
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

// 입찰 이력 페이지
export async function getBiddingHistory(biddingHistoryRequest) {
  try {
    // const response = await api.get("/items/biddinghistory, biddingHistoryRequest");
    // return response.data;
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        info: {
          communityId: 1,
          image: "/src/assets/test_image.png",
          favorited: true,
          name: "1 검색어 상품",
          biddingCount: "1111",
          rareTier: "레어"
        },
        histories: [
          {
            date: "4444년 44월 323일",
            price: "10000비드"
          },
          {
            date: "1111년 22월 333일",
            price: "120000비드"
          }
        ]
      });
    }
    return data;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error; 
  }
}

// 출품 이력 페이지
export async function getBiddedHistory(biddedHistoryRequest) {
  try {
    // const response = await axios.get(http://localhost:8080/api/items/biddedhistory, biddedHistoryRequest);
    // return response.data;
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        communityId: i,
        image: "/src/assets/test_image.png",
        favorited: i%2 == 0,
        name: `${biddedHistoryRequest.sortType} ${biddedHistoryRequest.date.year} 상품`,
        priceInfo: {price: i*10000, type: ""},
        additionalInfo: "출품 일시: 오늘인지 어제인지 생각 안남",
        overlayText: false
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

// 입찰 이력, 출품 이력 횟수 불러오기 
export async function getHistoriesCount() {
  try {
    // const response = await api.get(`/api/histories/count/${user_id}`);
    // return response.data;
    const data = {
      bidded: {
        all: 100,
        bidding: 10,
        bidded: 20,
        biddedCancel: 70,
      }, 
      bidding: {
        all: 200,
        bidding: 20,
        bidded: 30,
        biddedFail: 150,
      }
    }
    return data;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error; 
  }
}