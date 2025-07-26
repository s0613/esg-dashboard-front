import React from "react"
import { Button } from "@/components/ui/button"
import { Upload, ChevronDown, Info } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isValidESGPdf } from "./file-valid";

interface ToolbarProps {
  selectedItems: number[]
  filesLength: number
  onSelectAll: () => void
  onShowUploadModal: () => void
  sortBy: "date" | "name" | "size"
  setSortBy: (v: "date" | "name" | "size") => void
  sortOrder: "asc" | "desc"
  setSortOrder: (v: "asc" | "desc") => void
  showSortByDropdown: boolean
  setShowSortByDropdown: (v: boolean) => void
  showSortOrderDropdown: boolean
  setShowSortOrderDropdown: (v: boolean) => void
}

const getSortByText = (sortBy: "date" | "name" | "size") => {
  switch (sortBy) {
    case "name": return "이름"
    case "size": return "크기"
    case "date": return "올린 날짜"
    default: return "올린 날짜"
  }
}

const getSortOrderText = (sortOrder: "asc" | "desc") => {
  return sortOrder === "asc" ? "오름차순" : "최신순"
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedItems,
  filesLength,
  onSelectAll,
  onShowUploadModal,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  showSortByDropdown,
  setShowSortByDropdown,
  showSortOrderDropdown,
  setShowSortOrderDropdown,
}) => {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Checkbox */}
            <input 
              type="checkbox" 
              checked={selectedItems.length === filesLength && filesLength > 0}
              onChange={onSelectAll}
              className="w-4 h-4 text-blue-600 rounded"
            />
            {/* File Upload Button */}
            <div className="relative inline-block">
              {/* input[type="file"] 제거 */}
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium rounded-lg shadow-sm border border-blue-600 cursor-pointer relative z-0"
                onClick={onShowUploadModal}
              >
                <Upload className="w-4 h-4 mr-2" />
                <span className="font-medium">파일 업로드</span>
              </Button>
            </div>
          </div>
          {/* Sort and View Options */}
          <div className="flex items-center space-x-4">
            {/* Sort By Dropdown */}
            <DropdownMenu open={showSortByDropdown} onOpenChange={setShowSortByDropdown}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
                  <span className="text-sm text-gray-600">{getSortByText(sortBy)}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => { setSortBy("date"); setShowSortByDropdown(false); }}>
                  올린 날짜
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSortBy("name"); setShowSortByDropdown(false); }}>
                  이름
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSortBy("size"); setShowSortByDropdown(false); }}>
                  크기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Sort Order Dropdown */}
            <DropdownMenu open={showSortOrderDropdown} onOpenChange={setShowSortOrderDropdown}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
                  <span className="text-sm text-gray-600">{getSortOrderText(sortOrder)}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => { setSortOrder("desc"); setShowSortOrderDropdown(false); }}>
                  최신순
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSortOrder("asc"); setShowSortOrderDropdown(false); }}>
                  오름차순
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded">
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Toolbar
