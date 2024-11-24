/**
 * Maximum number of guests allowed in the input
 */
export const MAX_GUESTS_INPUT_VALUE = 10;

/**
 * Messages related to user registration.
 */
export const REGISTRATION_MESSAGES = {
  SUCCESS: 'Tạo tài khoản thành công. Đang chuyển hướng đến trang đăng nhập...',
};

/**
 * Messages related to user login.
 */
export const LOGIN_MESSAGES = {
  FAILED: 'Hãy kiểm tra lại email hoặc mật khẩu.',
};

/**
 * Represents the default tax details for hotel booking.
 */
export const DEFAULT_TAX_DETAILS =
  'Giá đã bao gồm thuế VAT và phí dịch vụ.';

/**
 * Sorting filter labels
 */
export const SORTING_FILTER_LABELS = Object.freeze({
  PRICE_LOW_TO_HIGH: 'Giá: Thấp đến Cao',
  PRICE_HIGH_TO_LOW: 'Giá: Cao đến Thấp',
  RATING_LOW_TO_HIGH: 'Đánh giá: Thấp đến Cao',
  RATING_HIGH_TO_LOW: 'Đánh giá: Cao đến Thấp',
});
