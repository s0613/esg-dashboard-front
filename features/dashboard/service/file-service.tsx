import { api } from "@/lib/utils";

// 파일 업로드 (FormData 사용)
export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  // FileRequest는 file만 있으므로 바로 file만 전송
  const response = await api.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

// 사용 파일 조회 (내가 사용중인 파일만)
export async function getUsedFiles() {
  const response = await api.get("/files/used");
  return response.data;
}

// 파일 사용여부 토글
export async function toggleIsUsed(id: number) {
  const response = await api.patch(`/files/${id}/toggle-used`);
  return response.data;
}


// 파일 삭제
export async function deleteFile(id: number) {
  const response = await api.delete(`/files/${id}`)
  return response.data
}

// 사용자 파일 전체 조회
export async function getAllFiles() {
  const response = await api.get("/files");
  return response.data;
}
