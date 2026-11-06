/**
 * Tailwind 設定（build 時用；網站本身唔會執行呢個檔）
 *
 * 色票：見 README「配色系統」同 UI_REVIEW_2026-11-06.md §5。
 * 全站只有深藍底 + 品牌金 + 3 個語意色（emerald／sky／red）＋ slate；
 * 舊 code 仲有 violet / indigo / blue / teal / purple / pink / rose / orange 嘅 class，
 * 喺呢度一次過對應到語意色，所以 /50 透明度版本同 hover 版本都會一齊收斂。
 */
const swRamp = (c50, c100, c200, c300, c400, c500, c600, c700, c800, c900, c950) => ({
  50: c50, 100: c100, 200: c200, 300: c300, 400: c400, 500: c500,
  600: c600, 700: c700, 800: c800, 900: c900, 950: c950
});

const SW_INFO = swRamp('#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#082f49');
const SW_DANGER = swRamp('#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337', '#4c0519');
const SW_GOLD = swRamp('#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03');

module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        violet: SW_INFO,
        purple: SW_INFO,
        indigo: SW_INFO,
        blue: SW_INFO,
        teal: SW_INFO,
        pink: SW_DANGER,
        rose: SW_DANGER,
        orange: SW_GOLD
      }
    }
  }
};
