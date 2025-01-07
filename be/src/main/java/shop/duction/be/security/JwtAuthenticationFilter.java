//package shop.duction.be.security;
//
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.Cookie;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//
//public class JwtAuthenticationFilter extends OncePerRequestFilter {
//
//  private final JwtProvider jwtProvider;
//
//  public JwtAuthenticationFilter(JwtProvider jwtProvider) {
//    this.jwtProvider = jwtProvider;
//  }
//
//  @Override
//  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
//          throws java.io.IOException, ServletException {
//
//
//    String token = resolveToken(request);
////    String token = null;
////    Long userId = null;
////    Cookie[] cookies = request.getCookies();
////    for (Cookie cookie : cookies) {
////      if (cookie.getName().equals("access_token")) {
////        token = cookie.getAttribute("access_token");
////      } else if ()
////    }
//
//    if (token != null && jwtProvider.validateToken(token)) {
//      Authentication authentication = jwtProvider.getAuthentication(token);
//      SecurityContextHolder.getContext().setAuthentication(authentication);
//    }
//
//    filterChain.doFilter(request, response);
//  }
//
//  private String resolveToken(HttpServletRequest request) {
//    String bearerToken = request.getHeader("Authorization");
//    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
//      return bearerToken.substring(7);
//    }
//    return null;
//  }
//}
//
