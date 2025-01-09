package shop.duction.be.utils.aws;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class CloudFrontUrlGenerator {

  @Value("${AWS_CLOUDFRONT_DOMAIN_NAME}")
  private String cloudFrontDomain;

  public String generateCloudFrontUrl(String objectKey) {
    // CloudFront URL 생성
    String url = cloudFrontDomain + objectKey;

    // 로깅
    log.info("Generated CloudFront URL: {}", url);

    return url;
  }
}

