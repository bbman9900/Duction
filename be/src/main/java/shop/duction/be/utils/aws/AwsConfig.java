package shop.duction.be.utils.aws;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
@Configuration
public class AwsConfig {
  @Bean
  public S3Presigner s3Presigner(
          @Value("${AWS_ACCESS_KEY_ID}") String accessKeyId,
          @Value("${AWS_SECRET_ACCESS_KEY}") String secretAccessKey,
          @Value("${AWS_S3_REGION}") String region
  ) {
    AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
    return S3Presigner.builder()
            .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
            .region(Region.of(region))
            .build();
  }

  @Bean
  public S3Client s3Client(
          @Value("${AWS_ACCESS_KEY_ID}") String accessKeyId,
          @Value("${AWS_SECRET_ACCESS_KEY}") String secretAccessKey,
          @Value("${AWS_S3_REGION}") String region
  ) {
    AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
    return S3Client.builder()
            .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
            .region(Region.of(region))
            .build();
  }
}
