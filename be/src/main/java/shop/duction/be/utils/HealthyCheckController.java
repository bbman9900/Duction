package shop.duction.be.utils;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthyCheckController {

  @GetMapping
  public ResponseEntity<String> getResource() {
    return ResponseEntity.ok("Hello, React!");
  }
}
