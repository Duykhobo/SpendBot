export function parseShorthandNumber(input: string): number {
  // Chuẩn hóa chuỗi: xóa khoảng trắng, chuyển chữ thường
  let normalized = input.toLowerCase().replace(/\s+/g, '');
  
  let multiplier = 1;
  
  // Xác định đơn vị và thay thế
  if (normalized.includes('k')) {
    multiplier = 1000;
    normalized = normalized.replace('k', '');
  } else if (normalized.includes('m') || normalized.includes('củ') || normalized.includes('cu') || normalized.includes('tr')) {
    multiplier = 1000000;
    // Xóa các từ khóa triệu/m/củ
    normalized = normalized.replace(/m|củ|cu|tr/g, '');
  } else if (normalized.includes('lít') || normalized.includes('lit')) {
    multiplier = 100000;
    normalized = normalized.replace(/lít|lit/g, '');
  }

  // Ép kiểu sang số
  const parsedValue = parseFloat(normalized);
  
  if (isNaN(parsedValue)) {
    return NaN;
  }
  
  return parsedValue * multiplier;
}
