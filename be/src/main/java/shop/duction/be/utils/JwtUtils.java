package shop.duction.be.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtils {

  private final SecretKey secretKey;

  public JwtUtils(JwtConfig jwtConfig) {
    this.secretKey = jwtConfig.getSecretKey();
  }

  // JWT 생성
  public String generateToken(Integer userId, String access_token) {
    return Jwts.builder()
            .claim("access_token", access_token)
            .claim("userId", userId)
            .issuedAt(new Date()) // 발급 시간
            .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 만료 시간 1시간
            .signWith(secretKey)
            .compact();
  }

  public Integer extractUserId(String token) {
    Claims claims = Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getBody();
    return claims.get("userId", Integer.class);
  }

}
