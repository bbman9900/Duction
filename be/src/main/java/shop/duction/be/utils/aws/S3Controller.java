package shop.duction.be.utils.aws;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Duration;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
@RestController
@RequestMapping("/api/s3")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "S3")
public class S3Controller {
  private final S3Presigner presigner;
  @Value("${AWS_S3_BUCKET_NAME}")
  private String bucketName;
  @Value("${AWS_S3_BUCKET_DOMAIN}")
  private String bucketDomain;

  private final CloudFrontUrlGenerator cloudFrontUrlGenerator;
  // imageExtension 은 이미지의 확장자
  @PostMapping("/presigned-url")
  public PresignedURLResponseDTO generatePresignedUrl(@RequestBody PresignedURLRequestDTO dto) {
    String imageExtension = dto.imageExtension();
    String keyName = UUID.randomUUID().toString().replace("-", "") + "." + imageExtension;
    log.info("키 네임" + keyName);

    // S3 객체 요청 생성
    PutObjectRequest objectRequest = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(keyName)
            .build();
    // Pre-Signed URL 생성
    PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
            .putObjectRequest(objectRequest)
            .signatureDuration(Duration.ofMinutes(15)) // 15분 동안 유효
            .build();
    PresignedPutObjectRequest presignedRequest = presigner.presignPutObject(presignRequest);
    String myURL = presignedRequest.url().toString();
//    myURL = myURL.replace(bucketDomain, "");
//    String publicURL = bucketDomain + "/" + keyName;
    String publicURL = cloudFrontUrlGenerator.generateCloudFrontUrl(keyName);
    log.info("Presigned URL to upload file to: {}", myURL);
    log.info("Http method: {}", presignedRequest.httpRequest().method());
    return PresignedURLResponseDTO.builder()
            .uploadUrl(myURL)
            .publicUrl(publicURL)
            .build();
  }
}
