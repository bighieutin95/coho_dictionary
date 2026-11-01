export function normalizeKohoText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu thanh chuẩn Unicode
    .replace(/[đ]/g, 'd')
    .replace(/[ơ|ờ|ớ|ở|ỡ|ợ]/g, 'o')
    .replace(/[ư|ừ|ứ|ử|ữ|ự]/g, 'u')
    .replace(/[\s\-_]+/g, ' ')
    .trim();
}
