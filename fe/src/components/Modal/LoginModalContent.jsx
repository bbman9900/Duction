import { useState, useEffect } from "react";
import { getKakaoLoginUrl } from "../../services/uesrService";
import IconPlusLabel from '../Labels/IconPlusLabel'
import PreTextLabel from '../Labels/PreTextLabel'
import PreCaptionLabel from '../Labels/PreCaptionLabel'

import '@styles/components/modal/LoginModalContent.css'

export default function LoginModalContent({ onClose }) {
  const [kakaoAuthUrl, setKakaoAuthUrl] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const url = await getKakaoLoginUrl();
        setKakaoAuthUrl(url);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    })();
  }, []);

  const handleLogin = () => {
    if (kakaoAuthUrl) {
      window.location.href = kakaoAuthUrl; // 카카오 인증 서버로 리다이렉트
    }
    onClose();
  }

  return (
    <div className='loginModal_container'>
      <div className='loginModal_container_top'>
        <img src="/src/assets/ducktion_logo.png" />
        <PreTextLabel text={"로그인이 필요한 서비스입니다."} />
      </div>
      <div className='loginModal_container_bottom'>
        <PreCaptionLabel text={"간편 로그인/회원가입"} style={{color: '#bebebe'}} />
        <img src='/src/assets/kakaoLoginButton.png' onClick={handleLogin}/>
      </div>
    </div>
  );
}
