
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { login } from "@/features/login/service/login-service"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await login(username, password)
      // 로그인 성공 시 대시보드로 이동
      router.push("/dashboard")
    } catch (err: any) {
      // 에러 메시지 처리 (서버에서 내려주는 메시지 사용 가능)
      setError(err?.response?.data?.message || "로그인에 실패했습니다.")
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Visual Panel */}
      <div
        className="relative hidden lg:flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/esg-background.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center text-white p-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Welcome to the Future</h2>
          <p className="text-lg opacity-90">Experience seamless connectivity</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Totaro Esg system</h1>
            <h2 className="text-xl text-gray-600">Welcome to Totaro Esg system</h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="username"
                type="text"
                placeholder="이메일을 입력하세요"
                className="w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-right">
                <Link href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  Forget password?
                </Link>
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

            {/* Sign In Button */}
            <Button
              type="submit"
              variant="ghost"
              className="w-full bg-black hover:bg-gray-900 text-white font-bold py-2.5 rounded shadow"
            >
              로그인
            </Button>

            {/* Create Account Link */}
            <p className="text-center text-sm text-gray-600">
              로그인이 안되시나요?{" "}
              <Link href="#" className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
                문의하기
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
