package shop.duction.be.security;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import shop.duction.be.domain.user.entity.User;
import shop.duction.be.domain.user.enums.IsActive;
import shop.duction.be.domain.user.enums.Role;
import shop.duction.be.domain.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class KakaoOAuthService {
  private final UserRepository userRepository;
  private final JwtProvider jwtProvider;

  @Value("${KAKAO_TOKEN_URI}") // .env에서 카카오 토큰 URL 가져오기
  private String kakaoTokenUrl;

  @Value("${KAKAO_USER_INFO_URI}") // .env에서 카카오 사용자 정보 URL 가져오기
  private String kakaoUserInfoUrl;

  @Value("${KAKAO_TEST_CLIENT_ID}") // .env에서 클라이언트 ID 가져오기
  private String clientId;

  @Value("${KAKAO_REDIRECT_URI}") // .env에서 리다이렉트 URI 가져오기
  private String redirectUri;

  private String FRONT_HOME = "http://localhost:5173/";

  public ResponseEntity<Map<String, String>> getKakaoAuthUrl() {
    String kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize?client_id=" + clientId +
            "&redirect_uri=" + redirectUri +
            "&response_type=code";

    // 헤더 설정
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON); // JSON 형식으로 응답

    return ResponseEntity.ok()
            .headers(headers)
            .body(Map.of("url", kakaoAuthUrl));
  }

  // 카카오 인증코드를 이용한 JWT 발급
  public ResponseEntity<Void> authenticateWithKakao(String authorizationCode) {
    // 1. 카카오 액세스 토큰 요청
    String kakaoAccessToken = getAccessToken(authorizationCode);

    // 2. 카카오 사용자 정보 요청
    KakaoUser kakaoUser = getUserInfo(kakaoAccessToken);

    // 3. 사용자 정보 기반으로 자체 User 엔티티 확인 또는 저장
    User user = userRepository.findByEmail(kakaoUser.getKakao_account().getEmail())
            .orElseGet(() -> saveUserFromKakao(kakaoUser));

    // 4. JWT 생성
    String accessToken = jwtProvider.generateAccessToken(user);
    String refreshToken = jwtProvider.generateRefreshToken(user);

    // 5. Access Token 쿠키 생성
    ResponseCookie accessTokenCookie = ResponseCookie.from("access_token", accessToken)
            .httpOnly(true) // JavaScript를 통해 접근 불가
            .secure(false) // HTTPS에서만 전송 (true로 설정 시 프로덕션 환경에서 사용)
            .sameSite("Strict") // CSRF 보호
            .path("/") // 루트 경로부터 모든 서브 경로에서 쿠키 사용 가능
            .domain("localhost") // localhost에서 유효
            .maxAge(24 * 60 * 60) // 쿠키 유효 시간 (1일)
            .build();

    // 6. Refresh Token 쿠키 생성
    ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", refreshToken)
            .httpOnly(true) // JavaScript를 통해 접근 불가
            .secure(false) // HTTPS에서만 전송 (true로 설정 시 프로덕션 환경에서 사용)
            .sameSite("Strict") // CSRF 보호
            .path("/") // 루트 경로부터 모든 서브 경로에서 쿠키 사용 가능
            .domain("localhost") // localhost에서 유효
            .maxAge(7 * 24 * 60 * 60) // 쿠키 유효 시간 (7일)
            .build();

    return ResponseEntity.status(302) // HTTP 상태 코드 302: Found (리다이렉션)
            .header(HttpHeaders.LOCATION, FRONT_HOME) // 리다이렉트 URL
            .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString()) // Access Token 쿠키
            .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString()) // Refresh Token 쿠키
            .build();
  }

  // 카카오 토큰 요청
  public String getAccessToken(String authorizationCode) {
    RestTemplate restTemplate = new RestTemplate();

    // 카카오 토큰 요청을 위한 HTTP 헤더와 본문 설정
    HttpHeaders headers = new HttpHeaders();
    headers.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8"); // Content-Type 설정

    String body = String.format(
            "grant_type=authorization_code&client_id=%s&redirect_uri=%s&code=%s",
            clientId, redirectUri, authorizationCode
    );

    HttpEntity<String> request = new HttpEntity<>(body, headers);

    // 카카오 서버로부터 액세스 토큰 요청
    ResponseEntity<Map> response = restTemplate.postForEntity(kakaoTokenUrl, request, Map.class);
    if (response.getStatusCode() == HttpStatus.OK) {
      return (String) response.getBody().get("access_token");
    }
    throw new RuntimeException("카카오 액세스 토큰을 가져올 수 없습니다.");
  }

  // 카카오 사용자 정보 요청
  public KakaoUser getUserInfo(String kakaoAccessToken) {
    RestTemplate restTemplate = new RestTemplate();

    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(kakaoAccessToken);
    headers.setContentType(MediaType.APPLICATION_JSON);

    HttpEntity<String> request = new HttpEntity<>(headers);

    ResponseEntity<KakaoUser> response = restTemplate.exchange(
            kakaoUserInfoUrl, HttpMethod.GET, request, KakaoUser.class
    );

    if (response.getStatusCode() == HttpStatus.OK) {
      log.info(response.getBody().toString());
      return response.getBody();
    }
    throw new RuntimeException("카카오 사용자 정보를 가져올 수 없습니다.");
  }

  // 카카오 사용자 정보를 기반으로 자체 User 엔티티 생성 및 저장.
  public User saveUserFromKakao(KakaoUser kakaoUser) {
    return userRepository.save(User.builder()
            .email(kakaoUser.getKakao_account().getEmail())
            .nickname(kakaoUser.getKakao_account().getProfile().getNickname())
            .profileImage(kakaoUser.getKakao_account().getProfile().getProfile_image_url())
            .phone(kakaoUser.getKakao_account().getPhone_number())
            .heldBid(0)
            .usableBid(0)
            .rate(50f)
            .penaltyCount(0)
            .registTime(LocalDateTime.now())
            .isActive(IsActive.ACTIVE)
            .role(Role.USER)
            .build());
  }

  // Refresh Token을 이용한 JWT Access Token 재발행
  public Map<String, String> refreshAccessToken(String refreshToken) {
    // 1. Refresh Token 검증
    if (jwtProvider.validateToken(refreshToken)) {
      String email = jwtProvider.getEmailFromToken(refreshToken); // Refresh Token에서 이메일 추출
      User user = userRepository.findByEmail(email)
              .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

      // 2. 새로운 Access Token 발급
      String newAccessToken = jwtProvider.generateAccessToken(user);

      // 3. 새로운 Access Token 반환
      return Map.of("access_token", newAccessToken);
    }

    throw new RuntimeException("Invalid Refresh Token");
  }
}