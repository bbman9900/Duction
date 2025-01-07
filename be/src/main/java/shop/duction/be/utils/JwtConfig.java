package shop.duction.be.utils;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;

@Configuration
public class JwtConfig {

  private final SecretKey secretKey;

  public JwtConfig(@Value("${spring.jwt.secret-key}") String secretKeyString) {
    this.secretKey = Keys.hmacShaKeyFor(secretKeyString.getBytes());
  }

  public SecretKey getSecretKey() {
    return secretKey;
  }
}

