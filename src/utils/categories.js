export function getStickerCategory(code) {
  if (!code) return 'normal';
  if (/^COC\d+$/.test(code)) return 'coc';
  if (code.startsWith('FWC')) {
    const n = code === 'FWC00' ? 0 : parseInt(code.slice(3));
    return !isNaN(n) && n >= 9 ? 'fwc-historica' : 'fwc-inicial';
  }
  const m = code.match(/^[A-Z]{2,3}(\d+)$/);
  if (m) {
    const n = parseInt(m[1]);
    if (n === 1) return 'dourada';
    if (n === 13) return 'especial13';
  }
  return 'normal';
}

export const CATEGORY_INFO = {
  coc:             { label: '🥤 Coca-Cola',      color: '#F40000' },
  'fwc-historica': { label: '🏆 FWC Histórica',  color: '#C9A84C' },
  'fwc-inicial':   { label: '🏆 FWC Inicial',    color: '#FFD700' },
  dourada:         { label: '⭐ Dourada (#1)',    color: '#FFD700' },
  especial13:      { label: '✨ Especial (#13)',  color: '#9B59B6' },
  normal:          { label: '⚽ Normal',          color: '#009C3B' },
};
