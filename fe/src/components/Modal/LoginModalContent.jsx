import { requestLogin } from '../../services/uesrService'
import PreTextLabel from '../Labels/PreTextLabel'
import PreCaptionLabel from '../Labels/PreCaptionLabel'

import '@styles/components/modal/LoginModalContent.css'

export default function LoginModalContent({ onClose }) {

  const handleLogin = async () => {
    try {
      const loginUrl = await requestLogin();
      window.location.href = loginUrl;
    } catch (error) {
      console.error("로그인 과정 중 오류 발생:", error);
      alert("로그인 과정에서 문제가 발생했습니다");
    }
    onClose();
  };

  return (
    <div className='loginModal_container'>
      <div className='loginModal_container_top'>
        <img src="/assets/ducktion_logo.png" />
        <PreTextLabel text={"로그인이 필요한 서비스입니다."} />
      </div>
      <div className='loginModal_container_bottom'>
        <PreCaptionLabel text={"간편 로그인/회원가입"} style={{ color: '#bebebe' }} />
        <img src='/assets/kakaoLoginButton.png' onClick={handleLogin} />
      </div>
    </div>
  );
}