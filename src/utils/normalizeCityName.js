function normalizeCityName(name) {
  return (
    name
      .toLowerCase()
      .trim()
      // Bỏ "thành phố", "tỉnh", khoảng trắng thừa
      .replace(/^(thành phố|tỉnh)\s+/gi, "")
      // Chuẩn hóa dấu (nếu cần, nhưng JS Unicode xử lý khá tốt)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  ); // bỏ dấu (optional)
}
