import api from "./api";

// 사용자 정보 불러오기
export async function getUserInfo() {
  try {
    const response = await api.get("user/info");
    return response.data;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error;
  }
}

// 출품자 평가하기
export async function postRatingUser(ratingRequest) {
  try {
    const response = await api.post("user/rating", ratingRequest);
    alert(response.data);
  } catch (error) {
    console.error("Error fetching:", error);
    alert(error.response.data);
  }
}

// 내 정보 수정하기
export async function editMyInfo(editUserInfo) {
  try {
    const response = await api.post("user/info/edit", editUserInfo);
    return response.data;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error;
  }
}

// 회원 탈퇴하기
export async function deleteUser() {
  try {
    const response = await api.get("user/info/delete");
    return response.data;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error;
  }
};

// 프로필 사진 변경하기
export async function putUserProfileImage(imageUrl) {
  try {
    const response = await api.put(`user/info/image`,  {
      profileImage: imageUrl
    });
    return response;
    // console.log(`putUserProfileImage imageFile : ${imageFile}`);
    // return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_8Rj-vULPVGhf-eQyiY5sG2dMcHFQzD6RrQ&s";
  } catch (error) {
    console.error("Error fetching:", error);
    throw error;
  }
}

// 프로필 사진 삭제하기
export async function deleteUserProfileImage() {
  try {
    const response = await api.delete(`user/info/image`);
    return response;
    // console.log(`deleteUserProfileImage userId : ${userId}`);
    // return '';
  } catch (error) {
    console.error("Error fetching:", error);
    throw error;
  }
}

// 로그인
export async function getKakaoLoginUrl() {
  try {
    const response = await api.get(`auth/kakao/url`);
    return response.data.url;
  } catch (error) {
    console.error("Failed to fetch Kakao Auth URL", error);
    throw error;
  }
}