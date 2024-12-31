package shop.duction.be.security;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class KakaoUser {
  private Long id;
  private KakaoAccount kakao_account;

  @Getter
  public class KakaoAccount {
    private String email;
    private Profile profile;
    private String phone_number;

    @Getter
    public class Profile {
      private String nickname;
      private String profile_image_url;
  }
}
}
