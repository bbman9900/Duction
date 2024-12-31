//package shop.duction.be.security;
//
//import java.util.Collection;
//import java.util.List;
//import java.util.Map;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.oauth2.core.user.OAuth2User;
//import shop.duction.be.domain.user.entity.User;
//
//@AllArgsConstructor
//public class CustomOAuth2User implements OAuth2User {
//  private final User user;
//  private final Map<String, Object> attributeMap;
//  private final String accessToken; // 추가된 JWT Access Token
//  private final String refreshToken; // 추가된 JWT Refresh Token
//
//  public User getUser() {
//    return this.user;
//  }
//
//  public String getAccessToken() {
//    return this.accessToken;
//  }
//
//  public String getRefreshToken() {
//    return this.refreshToken;
//  }
//
//  @Override
//  public Map<String, Object> getAttributes() {
//    return this.attributeMap;
//  }
//
//  @Override
//  public Collection<? extends GrantedAuthority> getAuthorities() {
//    return List.of(new SimpleGrantedAuthority("ROLE_" + this.user.getRole().name()));
//  }
//
//  @Override
//  public String getName() {
//    return this.user.getNickname();
//  }
//}
