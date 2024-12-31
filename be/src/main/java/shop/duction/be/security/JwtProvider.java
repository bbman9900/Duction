package shop.duction.be.security;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import shop.duction.be.domain.user.entity.User;

@Component
public class JwtProvider {

//  @Value("${jwt.secret}") // application.yml에서 비밀 키 주입
  private final Key key;
//  @Value("${jwt.access-token-validity}")
  private final long accessTokenValidity; // Access Token 유효기간 (밀리초)
//  @Value("${jwt.refresh-token-validity}")
  private final long refreshTokenValidity; // Refresh Token 유효기간 (밀리초)

  public JwtProvider(@Value("${jwt.secret}") String secretKey,
          @Value("${jwt.access-token-validity}") long accessTokenValidity,
          @Value("${jwt.refresh-token-validity}") long refreshTokenValidity) {
    byte[] keyBytes = Base64.getDecoder().decode(secretKey);
    this.key = Keys.hmacShaKeyFor(keyBytes);
    this.accessTokenValidity = accessTokenValidity;
    this.refreshTokenValidity = refreshTokenValidity;
  }

  // 1. Access Token 생성
  public String generateAccessToken(User user) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + accessTokenValidity);

    return Jwts.builder()
            .setSubject(user.getEmail()) // 사용자 이메일
            .claim("userId", user.getUserId()) // 사용자 ID
            .claim("role", user.getRole()) // 사용자 Role
            .setIssuedAt(now) // 발행 시간
            .setExpiration(expiryDate) // 만료 시간
            .signWith(key, SignatureAlgorithm.HS256) // 서명
            .compact();
  }

  // 2. Refresh Token 생성
  public String generateRefreshToken(User user) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + refreshTokenValidity);

    return Jwts.builder()
            .setSubject(user.getEmail()) // 사용자 ID
            .setIssuedAt(now) // 발행 시간
            .setExpiration(expiryDate) // 만료 시간
            .signWith(key, SignatureAlgorithm.HS256) // 서명
            .compact();
  }

  // 3. 토큰에서 인증 정보 추출 (Access Token 전용)
  public Authentication getAuthentication(String token) {
    Claims claims = Jwts.parser()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();

    String authorities = claims.get("auth").toString();

    Collection<? extends GrantedAuthority> grantedAuthorities =
            Arrays.stream(authorities.split(","))
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

    return new UsernamePasswordAuthenticationToken(claims.getSubject(), null, grantedAuthorities);
  }

  // 4. 토큰 유효성 검사 (Access/Refresh 공통)
  public boolean validateToken(String token) {
    try {
      Jwts.parser().setSigningKey(key).build().parseClaimsJws(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false; // 토큰이 유효하지 않음
    }
  }

  // 5. 토큰에서 사용자 이메일 추출 (Access/Refresh 공통)
  public String getEmailFromToken(String token) {
    Claims claims = Jwts.parser()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getPayload();

    return claims.getSubject();
  }
}