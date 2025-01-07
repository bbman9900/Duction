package shop.duction.be.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class NonNullableJwtInterceptor implements HandlerInterceptor {

  private final JwtUtils jwtUtils;

  public NonNullableJwtInterceptor(JwtUtils jwtUtils) {
    this.jwtUtils = jwtUtils;
  }

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
      response.setStatus(HttpServletResponse.SC_OK); // OPTIONS 요청 허용
      return false; // 이후 로직 처리 중단
    }

    String authorizationHeader = request.getHeader("Authorization");

    if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.getWriter().write("Missing or invalid Authorization header");
      return false;
    }

    try {
      String token = authorizationHeader.replace("Bearer ", "");
      Integer userId = jwtUtils.extractUserId(token);

      request.setAttribute("userId", userId);
      return true;
    } catch (Exception e) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.getWriter().write("Invalid JWT token");
      return false;
    }
  }
}
