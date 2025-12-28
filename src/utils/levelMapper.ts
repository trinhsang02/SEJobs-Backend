// src/utils/levelMapper.ts

/* =========================================================
 * TOPCV EXPERIENCE LEVELS (nguồn ngoài)
 * ======================================================= */
export const TOPCV_EXPS = [
  { id: 1, name: "Chưa có kinh nghiệm" },
  { id: 2, name: "Dưới 1 năm" },
  { id: 3, name: "1 năm" },
  { id: 4, name: "2 năm" },
  { id: 5, name: "3 năm" },
  { id: 6, name: "4 năm" },
  { id: 7, name: "5 năm" },
  { id: 8, name: "Trên 5 năm" },
] as const;

export type TopCVExpId = (typeof TOPCV_EXPS)[number]["id"];

/* =========================================================
 * YOUR INTERNAL LEVELS
 * ======================================================= */
export const MY_LEVELS = [
  { id: 1, name: "Intern" },
  { id: 2, name: "Junior" },
  { id: 3, name: "Mid-level" },
  { id: 4, name: "Senior" },
  { id: 5, name: "Lead" },
  { id: 6, name: "Manager" },
  { id: 7, name: "Director" },
  { id: 8, name: "VP" },
  { id: 9, name: "C-Level" },
  { id: 10, name: "Fresher" },
] as const;

export type MyLevel = (typeof MY_LEVELS)[number];

/* =========================================================
 * EXPERIENCE CONSTANTS
 * ======================================================= */
const EXP = {
  NO_EXP: 1, // Chưa có kinh nghiệm
  UNDER_1Y: 2, // Dưới 1 năm
  ONE_YEAR: 3, // 1 năm
  TWO_YEARS: 4, // 2 năm
  THREE_YEARS: 5, // 3 năm
  FOUR_YEARS: 6, // 4 năm
  FIVE_YEARS: 7, // 5 năm
  OVER_5Y: 8, // Trên 5 năm
} as const;

/* =========================================================
 * CORE MAPPING: MY_LEVEL_ID → TOPCV_EXP_ID[]
 * Một level của bạn có thể map sang nhiều experience levels của TopCV
 * ======================================================= */
export const MY_LEVEL_TO_TOPCV: Record<number, readonly TopCVExpId[]> = {
  // Intern: Chưa có kinh nghiệm, Dưới 1 năm
  1: [EXP.NO_EXP, EXP.UNDER_1Y],

  // Fresher: Chưa có kinh nghiệm, Dưới 1 năm, 1 năm
  10: [EXP.NO_EXP, EXP.UNDER_1Y, EXP.ONE_YEAR],

  // Junior: Dưới 1 năm, 1 năm, 2 năm
  2: [EXP.UNDER_1Y, EXP.ONE_YEAR, EXP.TWO_YEARS],

  // Mid-level: 2 năm, 3 năm, 4 năm
  3: [EXP.TWO_YEARS, EXP.THREE_YEARS, EXP.FOUR_YEARS],

  // Senior: 3 năm, 4 năm, 5 năm, Trên 5 năm
  4: [EXP.THREE_YEARS, EXP.FOUR_YEARS, EXP.FIVE_YEARS, EXP.OVER_5Y],

  // Lead: 4 năm, 5 năm, Trên 5 năm
  5: [EXP.FOUR_YEARS, EXP.FIVE_YEARS, EXP.OVER_5Y],

  // Manager: 5 năm, Trên 5 năm
  6: [EXP.FIVE_YEARS, EXP.OVER_5Y],

  // Director: Trên 5 năm
  7: [EXP.OVER_5Y],

  // VP: Trên 5 năm
  8: [EXP.OVER_5Y],

  // C-Level: Trên 5 năm
  9: [EXP.OVER_5Y],
};

/* =========================================================
 * REVERSE MAPPING: TOPCV_EXP_ID → MY_LEVEL_ID[]
 * Một experience level của TopCV có thể map về nhiều levels của bạn
 * ======================================================= */
export const TOPCV_TO_MY_LEVEL: Record<TopCVExpId, readonly number[]> = {
  1: [1, 10], // Chưa có kinh nghiệm → Intern, Fresher
  2: [1, 10, 2], // Dưới 1 năm → Intern, Fresher, Junior
  3: [10, 2], // 1 năm → Fresher, Junior
  4: [2, 3], // 2 năm → Junior, Mid-level
  5: [3, 4], // 3 năm → Mid-level, Senior
  6: [3, 4, 5], // 4 năm → Mid-level, Senior, Lead
  7: [4, 5, 6], // 5 năm → Senior, Lead, Manager
  8: [4, 5, 6, 7, 8, 9], // Trên 5 năm → Senior+
};

/* =========================================================
 * PUBLIC HELPERS
 * ======================================================= */

/**
 * Map MY level → TopCV experience IDs
 * @param myLevelId - ID của level trong hệ thống của bạn
 * @returns Array of TopCV experience objects
 */
export function mapMyLevelToTopCV(myLevelId: number) {
  const topcvExpIds = MY_LEVEL_TO_TOPCV[myLevelId] ?? [EXP.NO_EXP];

  return topcvExpIds.map((id) => {
    const exp = TOPCV_EXPS.find((e) => e.id === id);
    return exp ?? { id, name: "Unknown" };
  });
}

/**
 * Map TopCV experience → MY levels
 * @param topcvExpId - ID của experience trong TopCV
 * @returns Array of your level objects
 */
export function mapTopCVToMyLevel(topcvExpId: TopCVExpId) {
  const myLevelIds = TOPCV_TO_MY_LEVEL[topcvExpId] ?? [1];

  return myLevelIds.map((id) => {
    const level = MY_LEVELS.find((l) => l.id === id);
    return level ?? { id, name: "Unknown" };
  });
}

/**
 * Get primary TopCV experience (first match)
 * Dùng khi TopCV chỉ cho phép 1 experience level
 */
export function getPrimaryTopCVExp(myLevelId: number) {
  return mapMyLevelToTopCV(myLevelId)[0];
}

/**
 * Get primary MY level (first match)
 * Dùng khi chỉ cần 1 level từ TopCV experience
 */
export function getPrimaryMyLevel(topcvExpId: TopCVExpId) {
  return mapTopCVToMyLevel(topcvExpId)[0];
}

/**
 * Get all TopCV experience IDs for multiple MY levels
 * Useful for search/filter: convert MY level IDs → TopCV exp IDs
 */
export function getTopCVExpIds(myLevelIds: number[]): TopCVExpId[] {
  const expIds = new Set<TopCVExpId>();

  myLevelIds.forEach((levelId) => {
    const exps = MY_LEVEL_TO_TOPCV[levelId] ?? [];
    exps.forEach((expId) => expIds.add(expId));
  });

  return Array.from(expIds);
}

/**
 * Get all MY level IDs for multiple TopCV experiences
 * Useful for search/filter: convert TopCV exp IDs → MY level IDs
 */
export function getMyLevelIds(topcvExpIds: TopCVExpId[]): number[] {
  const levelIds = new Set<number>();

  topcvExpIds.forEach((expId) => {
    const levels = TOPCV_TO_MY_LEVEL[expId] ?? [];
    levels.forEach((levelId) => levelIds.add(levelId));
  });

  return Array.from(levelIds);
}

/* =========================================================
 * USAGE EXAMPLES
 * ======================================================= */

/*
// Convert MY level → TopCV for API calls
const myLevelId = 4; // Senior
const topcvExps = mapMyLevelToTopCV(myLevelId);
// → [{ id: 5, name: "3 năm" }, { id: 6, name: "4 năm" }, ...]

// Convert TopCV exp → MY levels for displaying
const topcvExpId = 8; // Trên 5 năm
const myLevels = mapTopCVToMyLevel(topcvExpId);
// → [{ id: 4, name: "Senior" }, { id: 5, name: "Lead" }, ...]

// Convert filter from FE
// User selects: level_ids=4 (Senior)
// Call TopCV API with: exp_ids=5,6,7,8
const expIds = getTopCVExpIds([4]);
// → [5, 6, 7, 8]

// Convert TopCV results to MY levels
// TopCV returns jobs with exp_id=8
// Map to MY levels: 4,5,6,7,8,9
const levelIds = getMyLevelIds([8]);
// → [4, 5, 6, 7, 8, 9]
*/
