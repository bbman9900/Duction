import api from "../services/api";

const s3Upload = async (files) => {
  try {
    const uploadedUrls = []; // 업로드된 이미지 URL을 저장할 배열

    // 단일 파일인 경우에도 배열로 변환
    const fileArray = Array.isArray(files) ? files : [files];

    for (const file of fileArray) {
      // 1. 백엔드에서 Pre-Signed URL 요청
      const response = await api.post(`s3/presigned-url`, {
        imageExtension: file.name.split(".").pop()
      });

      if (!response || !response.data) {
        throw new Error("Pre-Signed URL 요청 실패");
      }

      const { uploadUrl, publicUrl } = response.data; // 백엔드 응답에서 URL 추출

      console.log("Pre-Signed URL:", uploadUrl);
      console.log("Public URL:", publicUrl);
      console.log("업로드할 파일:", file.type);

      // 2. Pre-Signed URL을 사용해 S3에 파일 업로드
      const s3Response = await fetch(uploadUrl, {
        method: "PUT",
        body: file, // Content-Type 헤더는 자동 설정
      });

      if (!s3Response.ok) {
        throw new Error(`S3 업로드 실패: ${s3Response.statusText}`);
      }

      console.log("S3 업로드 성공:", publicUrl);
      uploadedUrls.push(publicUrl); // 업로드된 이미지의 URL 저장
    }

    console.log("uploadedUrls:", uploadedUrls);
    return uploadedUrls; // 업로드된 이미지 URL 배열 반환
  } catch (error) {
    console.error("업로드 과정 중 오류 발생:", error);
    alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
  }
};

export default s3Upload;