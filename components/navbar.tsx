"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut, User } from "lucide-react"
import Image from "next/image"

interface NavbarProps {
  onLogout?: () => void
  onProfileClick?: () => void
}

export default function Navbar({ onLogout, onProfileClick }: NavbarProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-screen-lg mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image src="/Totaro_logo.svg" alt="Totaro Logo" width={36} height={36} />
          <h1 className="text-xl font-bold text-gray-900">Totaro ESG System</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* MY Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <User className="w-4 h-4" />
                MY
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onProfileClick}>
                <User className="w-4 h-4 mr-2" />
                비밀번호 변경
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
