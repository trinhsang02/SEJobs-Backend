// src/utils/cityMapper.ts

function normalizeCityName(name: string): string {
  if (typeof name !== "string") return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/^(thành phố|tỉnh)\s*/gi, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

// === DỮ LIỆU TỪ TOPCV ===
const TOPCV_CITIES = [
  { id: 1, name: "Hà Nội" },
  { id: 2, name: "Hồ Chí Minh" },
  { id: 3, name: "Bình Dương" },
  { id: 4, name: "Bắc Ninh" },
  { id: 5, name: "Đồng Nai" },
  { id: 6, name: "Hưng Yên" },
  { id: 7, name: "Hải Dương" },
  { id: 8, name: "Đà Nẵng" },
  { id: 9, name: "Hải Phòng" },
  { id: 10, name: "An Giang" },
  { id: 11, name: "Bà Rịa-Vũng Tàu" },
  { id: 12, name: "Bắc Giang" },
  { id: 13, name: "Bắc Kạn" },
  { id: 14, name: "Bạc Liêu" },
  { id: 15, name: "Bến Tre" },
  { id: 16, name: "Bình Định" },
  { id: 17, name: "Bình Phước" },
  { id: 18, name: "Bình Thuận" },
  { id: 19, name: "Cà Mau" },
  { id: 20, name: "Cần Thơ" },
  { id: 21, name: "Cao Bằng" },
  { id: 22, name: "Cửu Long" },
  { id: 23, name: "Đắk Lắk" },
  { id: 24, name: "Đắc Nông" },
  { id: 25, name: "Điện Biên" },
  { id: 26, name: "Đồng Tháp" },
  { id: 27, name: "Gia Lai" },
  { id: 28, name: "Hà Giang" },
  { id: 29, name: "Hà Nam" },
  { id: 30, name: "Hà Tĩnh" },
  { id: 31, name: "Hậu Giang" },
  { id: 32, name: "Hòa Bình" },
  { id: 33, name: "Khánh Hòa" },
  { id: 34, name: "Kiên Giang" },
  { id: 35, name: "Kon Tum" },
  { id: 36, name: "Lai Châu" },
  { id: 37, name: "Lâm Đồng" },
  { id: 38, name: "Lạng Sơn" },
  { id: 39, name: "Lào Cai" },
  { id: 40, name: "Long An" },
  { id: 41, name: "Miền Bắc" },
  { id: 42, name: "Miền Nam" },
  { id: 43, name: "Miền Trung" },
  { id: 44, name: "Nam Định" },
  { id: 45, name: "Nghệ An" },
  { id: 46, name: "Ninh Bình" },
  { id: 47, name: "Ninh Thuận" },
  { id: 48, name: "Phú Thọ" },
  { id: 49, name: "Phú Yên" },
  { id: 50, name: "Quảng Bình" },
  { id: 51, name: "Quảng Nam" },
  { id: 52, name: "Quảng Ngãi" },
  { id: 53, name: "Quảng Ninh" },
  { id: 54, name: "Quảng Trị" },
  { id: 55, name: "Sóc Trăng" },
  { id: 56, name: "Sơn La" },
  { id: 57, name: "Tây Ninh" },
  { id: 58, name: "Thái Bình" },
  { id: 59, name: "Thái Nguyên" },
  { id: 60, name: "Thanh Hóa" },
  { id: 61, name: "Thừa Thiên Huế" },
  { id: 62, name: "Tiền Giang" },
  { id: 63, name: "Toàn Quốc" },
  { id: 64, name: "Trà Vinh" },
  { id: 65, name: "Tuyên Quang" },
  { id: 66, name: "Vĩnh Long" },
  { id: 67, name: "Vĩnh Phúc" },
  { id: 68, name: "Yên Bái" },
  { id: 100, name: "Nước Ngoài" },
] as const;

// === DỮ LIỆU CỦA BẠN ===
const MY_PROVINCES = [
  { id: 1, name: "Thành phố Hà Nội" },
  { id: 4, name: "Cao Bằng" },
  { id: 8, name: "Tuyên Quang" },
  { id: 11, name: "Điện Biên" },
  { id: 12, name: "Lai Châu" },
  { id: 14, name: "Sơn La" },
  { id: 15, name: "Lào Cai" },
  { id: 19, name: "Thái Nguyên" },
  { id: 20, name: "Lạng Sơn" },
  { id: 22, name: "Quảng Ninh" },
  { id: 24, name: "Bắc Ninh" },
  { id: 25, name: "Phú Thọ" },
  { id: 31, name: "Thành phố Hải Phòng" },
  { id: 33, name: "Hưng Yên" },
  { id: 37, name: "Ninh Bình" },
  { id: 38, name: "Thanh Hóa" },
  { id: 40, name: "Nghệ An" },
  { id: 42, name: "Hà Tĩnh" },
  { id: 44, name: "Quảng Trị" },
  { id: 46, name: "Thành phố Huế" },
  { id: 48, name: "Thành phố Đà Nẵng" },
  { id: 51, name: "Quảng Ngãi" },
  { id: 52, name: "Gia Lai" },
  { id: 56, name: "Khánh Hòa" },
  { id: 66, name: "Đắk Lắk" },
  { id: 68, name: "Lâm Đồng" },
  { id: 75, name: "Đồng Nai" },
  { id: 79, name: "Thành phố Hồ Chí Minh" },
  { id: 80, name: "Tây Ninh" },
  { id: 82, name: "Đồng Tháp" },
  { id: 86, name: "Vĩnh Long" },
  { id: 91, name: "An Giang" },
  { id: 92, name: "Thành phố Cần Thơ" },
  { id: 96, name: "Cà Mau" },
] as const;

// === BUILD MAPS ===
const topCVMap = new Map<string, { id: number; name: string }>();
for (const city of TOPCV_CITIES) {
  topCVMap.set(normalizeCityName(city.name), city);
}

const myProvinceMap = new Map<string, { id: number; name: string }>();
for (const prov of MY_PROVINCES) {
  myProvinceMap.set(normalizeCityName(prov.name), prov);
}

// 🔄 Map: TopCV city_id → your province_id
export const TOPCV_ID_TO_MY_PROVINCE_ID: Record<number, number> = {};
for (const [normName, topCity] of topCVMap) {
  const myProv = myProvinceMap.get(normName);
  if (myProv) {
    TOPCV_ID_TO_MY_PROVINCE_ID[topCity.id] = myProv.id;
  }
}

// 🔄 Hàm map: your province → TopCV city
export function mapMyProvinceToTopCV(province: { name: string }): { id: number; name: string } | null {
  const norm = normalizeCityName(province.name);
  return topCVMap.get(norm) || null;
}
