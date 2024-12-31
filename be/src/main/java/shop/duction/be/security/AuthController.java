package shop.duction.be.security;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.duction.be.domain.user.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j
public class AuthController {

  private final KakaoOAuthService kakaoOAuthService;

  @GetMapping("/kakao/url")
  @Tag(name = "카카오 로그인 페이지 URL")
  public ResponseEntity<Map<String, String>> getKakaoAuthUrl() {
    return kakaoOAuthService.getKakaoAuthUrl();
  }

  @GetMapping("/kakao/callback")
  @Tag(name = "로그인 및 회원가입")
  public ResponseEntity<Void> handleKakaoCallback(@RequestParam String code) {

    return kakaoOAuthService.authenticateWithKakao(code);
  }

  @PostMapping("/refresh")
  @Tag(name = "Refresh Token을 이용한 Access Token 재발행")
  public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> tokenRequest) {
    String refreshToken = tokenRequest.get("refresh_token");
    Map<String, String> tokens = kakaoOAuthService.refreshAccessToken(refreshToken);

    return ResponseEntity.ok(tokens);
  }
}
