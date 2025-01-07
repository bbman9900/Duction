//package shop.duction.be.utils;
//
//import com.amazonaws.services.s3.AmazonS3;
//import com.amazonaws.services.s3.model.ObjectMetadata;
//import com.amazonaws.services.s3.model.PutObjectRequest;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//import java.util.UUID;
//import java.io.IOException;
//
//@Service
//public class S3UploaderService {
//
//  private final AmazonS3 amazonS3;
//
//  @Value("${AWS_S3_BUCKET_NAME}")
//  private String bucketName;
//
//  public S3UploaderService(AmazonS3 amazonS3) {
//    this.amazonS3 = amazonS3;
//  }
//
//  public String uploadImageFile(MultipartFile file, String folder) throws IOException {
//    String fileName = folder + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
//
//    ObjectMetadata metadata = new ObjectMetadata();
//    metadata.setContentLength(file.getSize());
//    metadata.setContentType(file.getContentType());
//
//    amazonS3.putObject(new PutObjectRequest(bucketName, fileName, file.getInputStream(), metadata));
//
//    return amazonS3.getUrl(bucketName, fileName).toString();
//  }
//}
