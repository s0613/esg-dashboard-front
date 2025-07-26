"use client";

// pdfjs-dist의 TextItem 타입 정의
export type TextItem = {
  str: string;
};

// ESG 보고서 키워드
const ESG_KEYWORDS = [
  "ESG",
  "자가진단보고서",
  "http://esg.kosmes.or.kr"
];

export async function isValidESGPdf(file: File): Promise<boolean> {
  // 1. 파일 확장자 및 MIME 검사
  if (
    !file.name.toLowerCase().endsWith(".pdf") ||
    file.type !== "application/pdf"
  ) {
    return false;
  }

  try {
    // pdfjs-dist를 동적으로 import (브라우저에서만 실행)
    const pdfjs = await import("pdfjs-dist");
    const { getDocument, GlobalWorkerOptions } = pdfjs;
    GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

    // 2. PDF 로드
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;

    // 3. 앞쪽 최대 3페이지의 텍스트 추출
    const maxPages = Math.min(pdf.numPages, 3);
    let textContent = "";

    for (let pageNo = 1; pageNo <= maxPages; pageNo++) {
      const page = await pdf.getPage(pageNo);
      const { items } = await page.getTextContent();
      textContent += (items as TextItem[]).map((i) => i.str).join(" ");
    }

    // 4. 키워드 포함 여부
    return ESG_KEYWORDS.some((kw) =>
      textContent.toLowerCase().includes(kw.toLowerCase()),
    );
  } catch (e) {
    // 파싱 실패
    console.error(e);
    return false;
  }
}
