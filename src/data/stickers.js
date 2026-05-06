// Full FIFA World Cup 2026 sticker dataset
// Groups A–H, 6 teams per group, 20 stickers per country + special sections

export const GROUPS = {
  A: ['QAT', 'ECU', 'SEN', 'NED'],
  B: ['ENG', 'IRN', 'USA', 'WAL'],
  C: ['ARG', 'SAU', 'MEX', 'POL'],
  D: ['FRA', 'AUS', 'DEN', 'TUN'],
  E: ['ESP', 'CRC', 'GER', 'JPN'],
  F: ['BEL', 'CAN', 'MAR', 'CRO'],
  G: ['BRA', 'SRB', 'CHE', 'CMR'],
  H: ['POR', 'GHA', 'URU', 'KOR'],
};

export const TEAMS = {
  QAT: { name: 'Qatar', flag: '🇶🇦', color: '#8B0000', count: 20 },
  ECU: { name: 'Equador', flag: '🇪🇨', color: '#FFD700', count: 20 },
  SEN: { name: 'Senegal', flag: '🇸🇳', color: '#00853F', count: 20 },
  NED: { name: 'Holanda', flag: '🇳🇱', color: '#FF4500', count: 20 },
  ENG: { name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#CF081F', count: 20 },
  IRN: { name: 'Irã', flag: '🇮🇷', color: '#239F40', count: 20 },
  USA: { name: 'Estados Unidos', flag: '🇺🇸', color: '#002868', count: 20 },
  WAL: { name: 'País de Gales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', color: '#C8102E', count: 20 },
  ARG: { name: 'Argentina', flag: '🇦🇷', color: '#74ACDF', count: 20 },
  SAU: { name: 'Arábia Saudita', flag: '🇸🇦', color: '#006C35', count: 20 },
  MEX: { name: 'México', flag: '🇲🇽', color: '#006847', count: 20 },
  POL: { name: 'Polônia', flag: '🇵🇱', color: '#DC143C', count: 20 },
  FRA: { name: 'França', flag: '🇫🇷', color: '#002395', count: 20 },
  AUS: { name: 'Austrália', flag: '🇦🇺', color: '#00843D', count: 20 },
  DEN: { name: 'Dinamarca', flag: '🇩🇰', color: '#C60C30', count: 20 },
  TUN: { name: 'Tunísia', flag: '🇹🇳', color: '#E70013', count: 20 },
  ESP: { name: 'Espanha', flag: '🇪🇸', color: '#AA151B', count: 20 },
  CRC: { name: 'Costa Rica', flag: '🇨🇷', color: '#002B7F', count: 20 },
  GER: { name: 'Alemanha', flag: '🇩🇪', color: '#000000', count: 20 },
  JPN: { name: 'Japão', flag: '🇯🇵', color: '#BC002D', count: 20 },
  BEL: { name: 'Bélgica', flag: '🇧🇪', color: '#EF3340', count: 20 },
  CAN: { name: 'Canadá', flag: '🇨🇦', color: '#FF0000', count: 20 },
  MAR: { name: 'Marrocos', flag: '🇲🇦', color: '#C1272D', count: 20 },
  CRO: { name: 'Croácia', flag: '🇭🇷', color: '#FF0000', count: 20 },
  BRA: { name: 'Brasil', flag: '🇧🇷', color: '#009C3B', count: 20 },
  SRB: { name: 'Sérvia', flag: '🇷🇸', color: '#C6363C', count: 20 },
  CHE: { name: 'Suíça', flag: '🇨🇭', color: '#FF0000', count: 20 },
  CMR: { name: 'Camarões', flag: '🇨🇲', color: '#007A5E', count: 20 },
  POR: { name: 'Portugal', flag: '🇵🇹', color: '#006600', count: 20 },
  GHA: { name: 'Gana', flag: '🇬🇭', color: '#006B3F', count: 20 },
  URU: { name: 'Uruguai', flag: '🇺🇾', color: '#5EB6E4', count: 20 },
  KOR: { name: 'Coreia do Sul', flag: '🇰🇷', color: '#C60C30', count: 20 },
};

// Generate all sticker codes: QAT1..QAT20, BRA1..BRA20, etc.
function generateStickers() {
  const stickers = [];
  for (const [group, teams] of Object.entries(GROUPS)) {
    for (const teamCode of teams) {
      const team = TEAMS[teamCode];
      for (let i = 1; i <= team.count; i++) {
        stickers.push({
          code: `${teamCode}${i}`,
          country: teamCode,
          group,
          number: i,
        });
      }
    }
  }
  // Special stickers: FWC1..FWC20 (official stickers / capa)
  for (let i = 1; i <= 20; i++) {
    stickers.push({ code: `FWC${i}`, country: 'FWC', group: 'FWC', number: i });
  }
  return stickers;
}

export const ALL_STICKERS = generateStickers();
export const STICKER_MAP = Object.fromEntries(ALL_STICKERS.map((s) => [s.code, s]));
export const TOTAL_STICKERS = ALL_STICKERS.length;

// FWC special team entry
TEAMS['FWC'] = { name: 'Especiais', flag: '🏆', color: '#C9A84C', count: 20 };
GROUPS['FWC'] = ['FWC'];
