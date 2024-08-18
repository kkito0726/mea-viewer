package com.mea_viewer_backend.figure_management.service;

import com.mea_viewer_backend.figure_management.configuration.MinioProperties;
import com.mea_viewer_backend.figure_management.model.MinioEntity;
import com.mea_viewer_backend.figure_management.model.form.FormDto;
import io.minio.BucketExistsArgs;
import io.minio.ListObjectsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.Result;
import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidResponseException;
import io.minio.errors.MinioException;
import io.minio.errors.ServerException;
import io.minio.errors.XmlParserException;
import io.minio.messages.Bucket;
import io.minio.messages.Item;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.StreamSupport;
import javax.imageio.ImageIO;
import org.springframework.stereotype.Service;

@Service
public class MinioService {

  private static final String BUCKET_NAME = "plot-figure";
  private final MinioClient minioClient;
  private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm-ss");

  public MinioService(MinioProperties minioProperties) {
    this.minioClient = MinioClient.builder()
        .endpoint(minioProperties.getEndpoint())
        .credentials(minioProperties.getAccessKey(), minioProperties.getSecretKey())
        .build();
  }


  public String saveImage(BufferedImage bufferedImage, FormDto formDto)
      throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
    ensureBucketExists(BUCKET_NAME);

    // BufferedImageをByteArrayOutputStreamに書き出し
    ByteArrayOutputStream os = new ByteArrayOutputStream();
    ImageIO.write(bufferedImage, "png", os);
    byte[] byteArray = os.toByteArray();

    String now = LocalDateTime.now().format(formatter);
    String objName = String.format(
        "images/%s/%d_%s_%s_%s.png",
        formDto.figType.getCode(),
        formDto.ch,
        formDto.fileName,
        formDto.figType.getCode(),
        now
    );

    InputStream inputStream = new ByteArrayInputStream(byteArray);
    minioClient.putObject(
        PutObjectArgs.builder()
            .bucket(BUCKET_NAME)
            .object(objName)
            .stream(inputStream, byteArray.length, -1)
            .contentType("image/png")
            .build()
    );

    // 画像のURLを返す
    return String.format("http://localhost:9000/%s/%s", BUCKET_NAME, objName);
  }

  public void listBuckets() {
    try {
      // 接続をテストするために、バケット一覧を取得してみる
      Iterable<String> buckets = minioClient.listBuckets().stream().map(Bucket::name).toList();
      for (String bucket : buckets) {
        System.out.println(bucket);
      }
    } catch (MinioException | InvalidKeyException | IOException | NoSuchAlgorithmException e) {
      System.out.println("Error occurred: " + e);
    }
  }

  public void deleteFile(String url) throws MalformedURLException {
    MinioEntity minioEntity = extractBucketAndObject(url);

    try {
      minioClient.removeObject(
          RemoveObjectArgs.builder()
              .bucket(minioEntity.getBucketName())
              .object(minioEntity.getObjectName())
              .build()
      );
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void deleteObjectsInDirectory(String directory) {
    try {
      Iterable<Result<Item>> objects = minioClient.listObjects(
          ListObjectsArgs.builder()
              .bucket(BUCKET_NAME)
              .prefix(directory)
              .recursive(true)
              .build()
      );

      List<String> objectNames = StreamSupport.stream(objects.spliterator(), false)
          .map(result -> {
            try {
              return result.get().objectName();
            } catch (Exception e) {
              e.printStackTrace();
              return null;
            }
          })
          .toList();

      for (String objectName : objectNames) {
        minioClient.removeObject(
            RemoveObjectArgs.builder()
                .bucket(BUCKET_NAME)
                .object(objectName)
                .build()
        );
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private void ensureBucketExists(String bucketName) {
    try {
      boolean found = minioClient.bucketExists(
          BucketExistsArgs.builder().bucket(bucketName).build()
      );
      if (!found) {
        minioClient.makeBucket(
            MakeBucketArgs.builder().bucket(bucketName).build()
        );
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private MinioEntity extractBucketAndObject(String url) throws MalformedURLException {
    java.net.URL parsedUrl = new URL(url);
    String[] parts = parsedUrl.getPath().split("/", 3);
    if (parts.length < 3) {
      throw new IllegalArgumentException(
          "Invalid URL format. Bucket name and object name are missing.");
    }
    return MinioEntity.builder()
        .bucketName(parts[1])
        .objectName(parts[2])
        .build();
  }

}
