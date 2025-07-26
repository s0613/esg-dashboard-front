"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side with illustration */}
      <div
        className="relative hidden lg:flex flex-col items-center justify-center p-8 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/esg-background.png')" }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-md mx-auto text-center space-y-6 text-white">
          <h2 className="text-3xl lg:text-4xl font-bold">Welcome to the Future</h2>
          <p className="text-lg opacity-90">Experience seamless connectivity</p>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-6">Totaro ESG system</h1>
            <h2 className="text-xl text-gray-600">Welcome to Totaro ESG system</h2>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-500" htmlFor="email">
                Users name or Email
              </label>
              <Input id="email" defaultValue="David Brooks" className="w-full p-2 border rounded" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-500" htmlFor="password">
                Password
              </label>
              <Input id="password" type="password" defaultValue="password" className="w-full p-2 border rounded" />
              <div className="text-right">
                <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">
                  Forget password?
                </Link>
              </div>
            </div>

            <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white">Sign in</Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <Button variant="outline" className="w-full border-gray-300">
              <Image src="/placeholder.svg" alt="Google" width={20} height={20} className="mr-2" />
              Sign in with Google
            </Button>

            <p className="text-center text-sm text-gray-500">
              New Lovebirds?{" "}
              <Link href="#" className="text-gray-600 hover:text-gray-800">
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
