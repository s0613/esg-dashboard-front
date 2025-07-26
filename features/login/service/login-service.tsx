import { api } from "@/lib/utils";

// 로그인 요청 함수
export async function login(email: string, password: string) {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
}
