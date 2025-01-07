package shop.duction.be.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import shop.duction.be.utils.JwtUtils;

@Component
public class NullableJwtInterceptor implements HandlerInterceptor {

  private final JwtUtils jwtUtils;

  public NullableJwtInterceptor(JwtUtils jwtUtils) {
    this.jwtUtils = jwtUtils;
  }

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
      response.setStatus(HttpServletResponse.SC_OK); // OPTIONS 요청 허용
      return false; // 이후 로직 처리 중단
    }

    String authorizationHeader = request.getHeader("Authorization");

    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
      try {
        // JWT 검증 및 userId 추출
        String token = authorizationHeader.replace("Bearer ", "");
        Integer userId = jwtUtils.extractUserId(token);

        request.setAttribute("userId", userId);
      } catch (Exception e) {
        request.setAttribute("userId", null);
      }
    } else {
      request.setAttribute("userId", null);
    }

    return true;
  }
}
