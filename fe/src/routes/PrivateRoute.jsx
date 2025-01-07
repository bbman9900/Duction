import { Navigate, Outlet } from 'react-router-dom';
import { checkLogin } from '../utils/CheckLogin';

const PrivateRoute = () => {
  const jwt = checkLogin();

  if (!jwt) {
    alert('로그인 후 이용 가능합니다.');
    return <Navigate to="/" />;
  }

  return <Outlet />;  // 인증된 사용자만 하위 경로를 렌더링
};

export default PrivateRoute;
