import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// JWT 쿠키를 자동으로 첨부하는 fetch 래퍼 함수
export async function apiFetch(input: RequestInfo, init?: RequestInit) {
  return fetch(input, {
    ...init,
    credentials: "include", // 쿠키 자동 첨부
    headers: {
      ...(init?.headers || {}),
      "Content-Type": "application/json",
    },
  });
}

// JWT 쿠키를 자동으로 첨부하는 axios 인스턴스
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  withCredentials: true, // 쿠키 자동 첨부
  headers: {
    "Content-Type": "application/json",
  },
});
