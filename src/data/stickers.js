// Copa do Mundo FIFA 2026 - Estrutura completa do álbum Panini
// 12 grupos (A-L), 48 seleções, 20 figurinhas por seleção + Página Inicial

// --------------------------------------------------------------------------
// Estrutura principal do álbum
// --------------------------------------------------------------------------
export const albumStructure = [
  {
    section: 'Página Inicial',
    type: 'initial',
    stickers: [
      { code: 'FWC', name: 'FIFA World Cup', flag: '🏆', numbers: [1] },
      { code: 'MEX', name: 'México',          flag: '🇲🇽', numbers: [1] },
      { code: 'KOR', name: 'Coreia do Sul',   flag: '🇰🇷', numbers: [1] },
      { code: 'RSA', name: 'África do Sul',   flag: '🇿🇦', numbers: [1] },
      { code: 'COC', name: 'Copa Especial',   flag: '🥇', numbers: [1] },
      { code: 'JPN', name: 'Japão',           flag: '🇯🇵', numbers: [1] },
      { code: 'CAN', name: 'Canadá',          flag: '🇨🇦', numbers: [1] },
      { code: 'ECU', name: 'Equador',         flag: '🇪🇨', numbers: [1] },
      { code: 'QAT', name: 'Catar',           flag: '🇶🇦', numbers: [1] },
    ],
  },

  // ---- GRUPO A ----
  {
    group: 'Grupo A', groupCode: 'A',
    color: '#e53935',
    countries: [
      { name: 'México',           code: 'MEX', flag: '🇲🇽', stickers: 20 },
      { name: 'África do Sul',    code: 'RSA', flag: '🇿🇦', stickers: 20 },
      { name: 'Coreia do Sul',    code: 'KOR', flag: '🇰🇷', stickers: 20 },
      { name: 'Rep. Checa',       code: 'CZE', flag: '🇨🇿', stickers: 20 },
    ],
  },

  // ---- GRUPO B ----
  {
    group: 'Grupo B', groupCode: 'B',
    color: '#1e88e5',
    countries: [
      { name: 'Canadá',           code: 'CAN', flag: '🇨🇦', stickers: 20 },
      { name: 'Bósnia e Herz.',   code: 'BIH', flag: '🇧🇦', stickers: 20 },
      { name: 'Catar',            code: 'QAT', flag: '🇶🇦', stickers: 20 },
      { name: 'Suíça',            code: 'SUI', flag: '🇨🇭', stickers: 20 },
    ],
  },

  // ---- GRUPO C ----
  {
    group: 'Grupo C', groupCode: 'C',
    color: '#00897b',
    countries: [
      { name: 'Brasil',           code: 'BRA', flag: '🇧🇷', stickers: 20 },
      { name: 'Marrocos',         code: 'MAR', flag: '🇲🇦', stickers: 20 },
      { name: 'Haiti',            code: 'HAI', flag: '🇭🇹', stickers: 20 },
      { name: 'Escócia',          code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stickers: 20 },
    ],
  },

  // ---- GRUPO D ----
  {
    group: 'Grupo D', groupCode: 'D',
    color: '#7b1fa2',
    countries: [
      { name: 'Estados Unidos',   code: 'USA', flag: '🇺🇸', stickers: 20 },
      { name: 'Paraguai',         code: 'PAR', flag: '🇵🇾', stickers: 20 },
      { name: 'Austrália',        code: 'AUS', flag: '🇦🇺', stickers: 20 },
      { name: 'Turquia',          code: 'TUR', flag: '🇹🇷', stickers: 20 },
    ],
  },

  // ---- GRUPO E ----
  {
    group: 'Grupo E', groupCode: 'E',
    color: '#f57c00',
    countries: [
      { name: 'Alemanha',         code: 'GER', flag: '🇩🇪', stickers: 20 },
      { name: 'Curaçao',          code: 'CUW', flag: '🇨🇼', stickers: 20 },
      { name: 'Costa do Marfim',  code: 'CIV', flag: '🇨🇮', stickers: 20 },
      { name: 'Equador',          code: 'ECU', flag: '🇪🇨', stickers: 20 },
    ],
  },

  // ---- GRUPO F ----
  {
    group: 'Grupo F', groupCode: 'F',
    color: '#5e35b1',
    countries: [
      { name: 'Países Baixos',    code: 'NED', flag: '🇳🇱', stickers: 20 },
      { name: 'Japão',            code: 'JPN', flag: '🇯🇵', stickers: 20 },
      { name: 'Suécia',           code: 'SWE', flag: '🇸🇪', stickers: 20 },
      { name: 'Tunísia',          code: 'TUN', flag: '🇹🇳', stickers: 20 },
    ],
  },

  // ---- GRUPO G ----
  {
    group: 'Grupo G', groupCode: 'G',
    color: '#c0392b',
    countries: [
      { name: 'Bélgica',          code: 'BEL', flag: '🇧🇪', stickers: 20 },
      { name: 'Egito',            code: 'EGY', flag: '🇪🇬', stickers: 20 },
      { name: 'Irã',              code: 'IRN', flag: '🇮🇷', stickers: 20 },
      { name: 'Nova Zelândia',    code: 'NZL', flag: '🇳🇿', stickers: 20 },
    ],
  },

  // ---- GRUPO H ----
  {
    group: 'Grupo H', groupCode: 'H',
    color: '#2e7d32',
    countries: [
      { name: 'Espanha',          code: 'ESP', flag: '🇪🇸', stickers: 20 },
      { name: 'Cabo Verde',       code: 'CPV', flag: '🇨🇻', stickers: 20 },
      { name: 'Arábia Saudita',   code: 'KSA', flag: '🇸🇦', stickers: 20 },
      { name: 'Uruguai',          code: 'URU', flag: '🇺🇾', stickers: 20 },
    ],
  },

  // ---- GRUPO I ----
  {
    group: 'Grupo I', groupCode: 'I',
    color: '#00838f',
    countries: [
      { name: 'França',           code: 'FRA', flag: '🇫🇷', stickers: 20 },
      { name: 'Senegal',          code: 'SEN', flag: '🇸🇳', stickers: 20 },
      { name: 'Iraque',           code: 'IRQ', flag: '🇮🇶', stickers: 20 },
      { name: 'Noruega',          code: 'NOR', flag: '🇳🇴', stickers: 20 },
    ],
  },

  // ---- GRUPO J ----
  {
    group: 'Grupo J', groupCode: 'J',
    color: '#558b2f',
    countries: [
      { name: 'Argentina',        code: 'ARG', flag: '🇦🇷', stickers: 20 },
      { name: 'Argélia',          code: 'ALG', flag: '🇩🇿', stickers: 20 },
      { name: 'Áustria',          code: 'AUT', flag: '🇦🇹', stickers: 20 },
      { name: 'Jordânia',         code: 'JOR', flag: '🇯🇴', stickers: 20 },
    ],
  },

  // ---- GRUPO K ----
  {
    group: 'Grupo K', groupCode: 'K',
    color: '#4527a0',
    countries: [
      { name: 'Portugal',         code: 'POR', flag: '🇵🇹', stickers: 20 },
      { name: 'Congo DR',         code: 'COD', flag: '🇨🇩', stickers: 20 },
      { name: 'Uzbequistão',      code: 'UZB', flag: '🇺🇿', stickers: 20 },
      { name: 'Colômbia',         code: 'COL', flag: '🇨🇴', stickers: 20 },
    ],
  },

  // ---- GRUPO L ----
  {
    group: 'Grupo L', groupCode: 'L',
    color: '#00695c',
    countries: [
      { name: 'Inglaterra',       code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stickers: 20 },
      { name: 'Croácia',          code: 'CRO', flag: '🇭🇷', stickers: 20 },
      { name: 'Gana',             code: 'GHA', flag: '🇬🇭', stickers: 20 },
      { name: 'Panamá',           code: 'PAN', flag: '🇵🇦', stickers: 20 },
    ],
  },
];

// --------------------------------------------------------------------------
// Build STICKER_MAP and ALL_STICKERS (compatibility with CollectionContext)
// --------------------------------------------------------------------------
export const STICKER_MAP = {};
export const ALL_STICKERS = [];

albumStructure.forEach((section) => {
  if (section.type === 'initial') {
    section.stickers.forEach((s) => {
      s.numbers.forEach((n) => {
        const key = `${s.code}${n}`;
        const entry = { code: key, country: s.code, countryName: s.name, group: 'INICIAL', number: n, flag: s.flag };
        STICKER_MAP[key] = entry;
        ALL_STICKERS.push(entry);
      });
    });
  } else {
    section.countries.forEach((c) => {
      for (let i = 1; i <= c.stickers; i++) {
        const key = `${c.code}${i}`;
        const entry = { code: key, country: c.code, countryName: c.name, group: section.groupCode, number: i, flag: c.flag };
        STICKER_MAP[key] = entry;
        ALL_STICKERS.push(entry);
      }
    });
  }
});

export const TOTAL_STICKERS = ALL_STICKERS.length;

// --------------------------------------------------------------------------
// GROUPS / TEAMS — mantidos para compatibilidade com Dashboard e Context
// --------------------------------------------------------------------------
export const GROUPS = {};
export const TEAMS = {};

albumStructure.forEach((section) => {
  if (section.type === 'initial') return;
  const { groupCode, countries } = section;
  GROUPS[groupCode] = countries.map((c) => c.code);
  countries.forEach((c) => {
    if (!TEAMS[c.code]) {
      TEAMS[c.code] = { name: c.name, flag: c.flag, color: section.color || '#009C3B', count: c.stickers };
    }
  });
});

// FWC special entry for compatibility
TEAMS['FWC'] = { name: 'Especiais', flag: '🏆', color: '#C9A84C', count: 1 };
