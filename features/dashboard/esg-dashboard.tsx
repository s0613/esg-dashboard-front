"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, FileText, Calendar, LogOut, User, ChevronDown, Folder, MoreVertical, Search, Grid, List, Info, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navbar from "@/components/navbar"
import UserFix from "@/features/login/userfix"
import { uploadFile, getAllFiles, deleteFile, toggleIsUsed } from "@/features/dashboard/service/file-service"
import Toolbar from "@/features/dashboard/toolbar"

interface ESGDashboardProps {
  onLogout: () => void
}

export default function ESGDashboard({ onLogout }: ESGDashboardProps) {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showUserFixModal, setShowUserFixModal] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showSortByDropdown, setShowSortByDropdown] = useState(false)
  const [showSortOrderDropdown, setShowSortOrderDropdown] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<any[]>([])

  // 파일 목록 불러오기
  useEffect(() => {
    fetchFiles()
  }, [])

  // 한국 시간 변환 및 포맷 함수 추가
  function formatKoreanDate(dateString: string) {
    const date = new Date(dateString)
    // 한국 시간으로 변환
    const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000)
    // YYYY-MM-DD HH:mm 형식
    return koreaDate.toISOString().replace('T', ' ').substring(0, 16)
  }

  const fetchFiles = async () => {
    try {
      const data = await getAllFiles()
      setFiles(data)
    } catch (e) {
      
    }
  }

  // 파일 업로드
  const handleUpload = async () => {
    if (!uploadedFile) return
    setLoading(true)
    try {
      await uploadFile(uploadedFile)
      setUploadedFile(null)
      setShowUploadModal(false)
      fetchFiles() // 업로드 후 목록 갱신
      alert("업로드 완료!")
    } catch (e) {
      alert("업로드 실패")
    } finally {
      setLoading(false)
    }
  }

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectedItems.length === files.length) {
      setSelectedItems([])
    } else {
      setSelectedItems([...files.map(f => f.id)])
    }
  }

  // 개별 선택/해제
  const handleItemSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  // 정렬된 파일 목록 생성
  const getSortedFiles = () => {
    const sortedFiles = [...files].sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.originalName.localeCompare(b.originalName)
          break
        case "size":
          // size 필드가 없으므로 0 반환
          comparison = 0
          break
        case "date":
        default:
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })
    return sortedFiles
  }

  // isUsed 기준으로 파일 분리
  const getUsedAndOtherFiles = () => {
    const sorted = getSortedFiles();
    const used = sorted.filter(f => f.isUsed)
    const others = sorted.filter(f => !f.isUsed)
    return { used, others }
  }

  // 정렬 옵션 텍스트
  const getSortByText = () => {
    switch (sortBy) {
      case "name": return "이름"
      case "size": return "크기"
      case "date": return "올린 날짜"
      default: return "올린 날짜"
    }
  }

  const getSortOrderText = () => {
    return sortOrder === "asc" ? "오름차순" : "최신순"
  }

  // Upload Modal Component
  const UploadModal = () =>
    showUploadModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">파일 업로드</h2>
          <p className="text-gray-600 mb-4">파일을 선택하여 업로드하세요.</p>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label className="cursor-pointer bg-white border px-4 py-2 rounded text-sm font-medium shadow-sm hover:bg-gray-50">
                파일 선택
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={async e => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      const valid = await import("./file-valid").then(m => m.isValidESGPdf(file));
                      if (!valid) {
                        alert("ESG 보고서 형식의 PDF 파일만 업로드할 수 있습니다.");
                        e.target.value = "";
                        setUploadedFile(null);
                        return;
                      }
                      setUploadedFile(file);
                    }
                  }}
                />
              </label>
              {uploadedFile && (
                <span className="ml-2 text-sm text-gray-700">{uploadedFile.name}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowUploadModal(false)} variant="outline" className="flex-1">
                취소
              </Button>
              <Button
                onClick={handleUpload}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!uploadedFile || loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : null}
                업로드
              </Button>
            </div>
          </div>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-white">
      <Navbar onLogout={onLogout} onProfileClick={() => setShowUserFixModal(true)} />

      {/* Action Bar */}
      <Toolbar
        selectedItems={selectedItems}
        filesLength={files.length}
        onSelectAll={handleSelectAll}
        onShowUploadModal={() => setShowUploadModal(true)}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        showSortByDropdown={showSortByDropdown}
        setShowSortByDropdown={setShowSortByDropdown}
        showSortOrderDropdown={showSortOrderDropdown}
        setShowSortOrderDropdown={setShowSortOrderDropdown}
      />
      {/* Files and Folders */}
      <div className="container mx-auto px-6 py-8 mt-8">
        {/* 리스트 뷰만 남김 */}
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96">
            <p className="text-lg text-gray-500 mb-4">아직 업로드된 파일이 없습니다.</p>
          </div>
        ) : (
          (() => {
            const { used, others } = getUsedAndOtherFiles();
            return (
              <>
                {/* isUsed true 파일 박스 */}
                {used.length > 0 && (
                  <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-bold text-blue-700 mb-2">시각화된 파일</h4>
                    <div className="space-y-2">
                      {used.map((file) => (
                        <div key={file.id} className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={selectedItems.includes(file.id)}
                            onChange={(e) => {
                              e.stopPropagation()
                              handleItemSelect(file.id)
                            }}
                            className="w-4 h-4 text-blue-600 rounded mr-4"
                          />
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4 relative">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <div className="absolute bottom-1 left-1 w-2 h-2 bg-blue-600 rounded-sm"></div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">{file.originalName}</h3>
                            {/* <p className="text-xs text-gray-500">{file.path}</p> */}
                          </div>
                          <div className="text-right mr-4">
                            <p className="text-xs text-gray-400">{formatKoreanDate(file.uploadedAt)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm(`${file.originalName} 파일을 삭제하시겠습니까?`)) {
                                  try {
                                    await deleteFile(file.id);
                                    fetchFiles();
                                    alert("삭제 완료!");
                                  } catch {
                                    alert("삭제 실패");
                                  }
                                }
                              }}
                            >
                              <Trash className="w-4 h-4 text-red-500" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-2 py-1"
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  await toggleIsUsed(file.id);
                                  fetchFiles();
                                  alert(`${file.originalName} 파일의 사용 여부가 변경되었습니다.`);
                                } catch {
                                  alert("파일 사용 여부 변경 실패");
                                }
                              }}
                            >
                              시각화 하기
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* 나머지 파일 */}
                <div className="space-y-2">
                  {others.map((file) => (
                    <div key={file.id} className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.includes(file.id)}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleItemSelect(file.id)
                        }}
                        className="w-4 h-4 text-blue-600 rounded mr-4"
                      />
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4 relative">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <div className="absolute bottom-1 left-1 w-2 h-2 bg-blue-600 rounded-sm"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{file.originalName}</h3>
                        {/* <p className="text-xs text-gray-500">{file.path}</p> */}
                      </div>
                      <div className="text-right mr-4">
                        <p className="text-xs text-gray-400">{formatKoreanDate(file.uploadedAt)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (window.confirm(`${file.originalName} 파일을 삭제하시겠습니까?`)) {
                              try {
                                await deleteFile(file.id);
                                fetchFiles();
                                alert("삭제 완료!");
                              } catch {
                                alert("삭제 실패");
                              }
                            }
                          }}
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-2 py-1"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await toggleIsUsed(file.id);
                              fetchFiles();
                              alert(`${file.originalName} 파일의 사용 여부가 변경되었습니다.`);
                            } catch {
                              alert("파일 사용 여부 변경 실패");
                            }
                          }}
                        >
                          시각화 하기
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          })()
        )}
      </div>
      <UploadModal />
      <UserFix isOpen={showUserFixModal} onClose={() => setShowUserFixModal(false)} />
    </div>
  )
}
