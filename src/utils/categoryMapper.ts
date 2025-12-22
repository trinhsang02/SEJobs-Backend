// src/utils/categoryMapper.ts

/* =========================================================
 * TOPCV CATEGORIES (nguồn ngoài – ít & coarse-grained)
 * ======================================================= */
export const TOPCV_CATEGORIES = [
  { id: 10004, name: "Báo chí / Truyền hình" },
  { id: 10009, name: "Công nghệ cao" },
  { id: 10025, name: "IT Phần cứng / Mạng" },
  { id: 10026, name: "IT phần mềm" },
  { id: 10029, name: "Marketing / Truyền thông / Quảng cáo" },
  { id: 10037, name: "Quản lý chất lượng (QA/QC)" },
  { id: 10039, name: "Thiết kế đồ họa" },
  { id: 10131, name: "Công nghệ thông tin" },
] as const;

export type TopCVCategoryId = (typeof TOPCV_CATEGORIES)[number]["id"];

/* =========================================================
 * YOUR INTERNAL CATEGORIES (fine-grained)
 * ======================================================= */
export const MY_CATEGORIES = [
  { id: 1, name: "Software Engineering" },
  { id: 2, name: "Data Science" },
  { id: 3, name: "Product Management" },
  { id: 4, name: "Design" },
  { id: 5, name: "Marketing" },
  { id: 6, name: "Sales" },
  { id: 7, name: "Human Resources" },
  { id: 8, name: "Customer Support" },
  { id: 9, name: "Finance" },
  { id: 10, name: "Operations" },
  { id: 11, name: "Mobile Development" },
  { id: 12, name: "Web Development" },
  { id: 13, name: "Backend Development" },
  { id: 14, name: "Frontend Development" },
  { id: 15, name: "DevOps" },
  { id: 16, name: "Cloud Computing" },
  { id: 17, name: "Artificial Intelligence" },
  { id: 18, name: "Machine Learning" },
  { id: 19, name: "Cyber Security" },
  { id: 20, name: "Blockchain" },
  { id: 21, name: "Game Development" },
  { id: 22, name: "Embedded Systems" },
  { id: 23, name: "Quality Assurance" },
  { id: 24, name: "Business Analysis" },
  { id: 25, name: "Project Management" },
  { id: 26, name: "UI/UX Design" },
  { id: 27, name: "Content & SEO" },
  { id: 28, name: "Digital Marketing" },
  { id: 29, name: "E-commerce" },
  { id: 30, name: "Logistics & Supply Chain" },
] as const;

export type MyCategory = (typeof MY_CATEGORIES)[number];

/* =========================================================
 * DOMAIN → TOPCV CATEGORY
 * (ý nghĩa nghề nghiệp, không dựa vào text)
 * ======================================================= */
const TOPCV = {
  IT_SOFTWARE: 10026,
  IT_GENERAL: 10131,
  IT_HARDWARE: 10025,
  HIGH_TECH: 10009,
  MARKETING: 10029,
  DESIGN: 10039,
  QA: 10037,
} as const;

/* =========================================================
 * CORE MAPPING
 * MY_CATEGORY_ID → TOPCV_CATEGORY_ID[]
 * ======================================================= */
export const MY_CATEGORY_TO_TOPCV: Record<number, readonly TopCVCategoryId[]> = {
  // ---- IT / SOFTWARE ----
  1: [TOPCV.IT_SOFTWARE, TOPCV.IT_GENERAL], // Software Engineering
  11: [TOPCV.IT_SOFTWARE],
  12: [TOPCV.IT_SOFTWARE],
  13: [TOPCV.IT_SOFTWARE],
  14: [TOPCV.IT_SOFTWARE],
  15: [TOPCV.IT_SOFTWARE, TOPCV.IT_GENERAL], // DevOps
  16: [TOPCV.IT_SOFTWARE, TOPCV.IT_GENERAL], // Cloud
  20: [TOPCV.IT_SOFTWARE], // Blockchain
  21: [TOPCV.IT_SOFTWARE], // Game
  19: [TOPCV.IT_SOFTWARE, TOPCV.IT_HARDWARE], // Cyber Security
  22: [TOPCV.IT_HARDWARE], // Embedded

  // ---- AI / DATA ----
  2: [TOPCV.HIGH_TECH],
  17: [TOPCV.HIGH_TECH],
  18: [TOPCV.HIGH_TECH],

  // ---- QA ----
  23: [TOPCV.QA],

  // ---- DESIGN ----
  4: [TOPCV.DESIGN],
  26: [TOPCV.DESIGN],

  // ---- MARKETING ----
  5: [TOPCV.MARKETING],
  27: [TOPCV.MARKETING],
  28: [TOPCV.MARKETING],
  29: [TOPCV.MARKETING],

  // ---- BUSINESS / NON-TECH (TopCV không có chuẩn) ----
  3: [TOPCV.IT_GENERAL], // Product
  24: [TOPCV.IT_GENERAL],
  25: [TOPCV.IT_GENERAL],
  6: [TOPCV.IT_GENERAL],
  7: [TOPCV.IT_GENERAL],
  8: [TOPCV.IT_GENERAL],
  9: [TOPCV.IT_GENERAL],
  10: [TOPCV.IT_GENERAL],
  30: [TOPCV.IT_GENERAL],
};

/* =========================================================
 * PUBLIC HELPERS
 * ======================================================= */

/**
 * Map MY category → TopCV categories (ưu tiên primary)
 */
export function mapMyCategoryToTopCV(myCategoryId: number) {
  const topcvIds = MY_CATEGORY_TO_TOPCV[myCategoryId] ?? [TOPCV.IT_GENERAL];

  return topcvIds.map((id) => {
    const cat = TOPCV_CATEGORIES.find((c) => c.id === id);
    return cat ?? { id, name: "Unknown" };
  });
}

/**
 * Get primary TopCV category (dùng khi TopCV chỉ cho 1 category)
 */
export function getPrimaryTopCVCategory(myCategoryId: number) {
  return mapMyCategoryToTopCV(myCategoryId)[0];
}
