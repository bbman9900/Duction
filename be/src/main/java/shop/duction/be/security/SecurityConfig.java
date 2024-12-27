package shop.duction.be.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import shop.duction.be.domain.user.entity.User;
import shop.duction.be.domain.user.repository.UserRepository;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtProvider jwtProvider;
  private final UserRepository userRepository;

  // SecurityFilterChain 설정
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable()) // CSRF 비활성화
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(new AntPathRequestMatcher("/api/auth/**")).permitAll() // 인증 없이 /api/auth/**로 접근 가능
                    .anyRequest().authenticated() // 그 외 요청은 인증 필요
            )
            .oauth2Login(oauth2 -> oauth2
                    .successHandler(oAuth2SuccessHandler()) // OAuth2 성공 핸들러 설정
            )
            .addFilterBefore(new JwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  // AuthenticationSuccessHandler 설정
  @Bean
  public AuthenticationSuccessHandler oAuth2SuccessHandler() {
    return (request, response, authentication) -> {
      // Authentication 객체에서 사용자 정보 추출
      String email = authentication.getName(); // 인증된 사용자의 이메일 (Authentication에서 가져옴)
      // User 엔티티 조회
      User user = userRepository.findByEmail(email)
              .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

      // JWT 생성
      String accessToken = jwtProvider.generateAccessToken(user);
      String refreshToken = jwtProvider.generateRefreshToken(user);

      // JWT를 클라이언트에 반환 (JSON 형식)
      response.setContentType("application/json");
      response.setCharacterEncoding("UTF-8");
      String jsonResponse = String.format("{\"access_token\": \"%s\", \"refresh_token\": \"%s\"}", accessToken, refreshToken);
      response.getWriter().write(jsonResponse);
    };
  }

  // AuthenticationManager 빈 등록
  @Bean
  public AuthenticationManager authenticationManager(
          AuthenticationConfiguration authenticationConfiguration) throws Exception {
    return authenticationConfiguration.getAuthenticationManager();
  }

  // PasswordEncoder 빈 등록 (BCrypt 사용)
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}

