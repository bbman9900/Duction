export const checkLogin = () => {
  // 토큰 확인 등
  const jwt = localStorage.getItem('jwt');
  return jwt;
};
