package shop.duction.be.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import shop.duction.be.utils.NonNullableJwtInterceptor;
import shop.duction.be.utils.NullableJwtInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  private final NonNullableJwtInterceptor nonNullableJwtInterceptor;
  private final NullableJwtInterceptor nullableJwtInterceptor;

  @Autowired
  public WebConfig(NonNullableJwtInterceptor nonNullableJwtInterceptor, NullableJwtInterceptor nullableJwtInterceptor) {
    this.nonNullableJwtInterceptor = nonNullableJwtInterceptor;
    this.nullableJwtInterceptor = nullableJwtInterceptor;
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
//            .allowedOrigins("https://ducktion.shop", "https://www.ducktion.shop")
            .allowedOrigins("http://localhost:5173", "https://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .exposedHeaders("Authorization")
            .allowCredentials(true);
  }

  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(nullableJwtInterceptor)
            .addPathPatterns("/api/communities/popular",
                            "/api/communities",
                            "/**/closingsoon",
                            "/**/mastersrare",
                            "/**/detail",
                            "/**/auction") // userId가 null이어도 되는 경로
            .excludePathPatterns("/api/login/oauth/**");

    registry.addInterceptor(nonNullableJwtInterceptor)
            .addPathPatterns(
                    "/api/admin/**",
                    "/api/items/bdding/**",
                    "/api/bidpoint/**",
                    "/api/communities/favorites/**",
                    "/api/items/favorites/**",
                    "/api/items/**",
                    "/api/ship/**",
                    "/api/user/**"
                    ) // userId가 반드시 필요한 경로
            .excludePathPatterns("/api/login/oauth/**");;
  }
}
