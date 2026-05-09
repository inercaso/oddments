const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'oddments.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS collections (
    id     TEXT PRIMARY KEY,
    name   TEXT NOT NULL,
    color  TEXT NOT NULL DEFAULT '#a8842c',
    emoji  TEXT NOT NULL DEFAULT '✦',
    note   TEXT NOT NULL DEFAULT '',
    pinned INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS curiosities (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    image       TEXT NOT NULL DEFAULT '',
    mood        TEXT NOT NULL DEFAULT 'cozy',
    category    TEXT NOT NULL DEFAULT 'objects',
    tags        TEXT NOT NULL DEFAULT '[]',
    collection  TEXT REFERENCES collections(id),
    favorite    INTEGER NOT NULL DEFAULT 0,
    added       TEXT NOT NULL
  );
`);

// SVG image factory — ported from seed.js, identical output.
function img(palette, glyph) {
  const [c1, c2, c3] = palette;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' preserveAspectRatio='xMidYMid slice'>
      <defs>
        <radialGradient id='g1' cx='30%' cy='28%' r='75%'>
          <stop offset='0%' stop-color='${c1}'/>
          <stop offset='58%' stop-color='${c2}'/>
          <stop offset='100%' stop-color='${c3}'/>
        </radialGradient>
        <radialGradient id='g2' cx='78%' cy='76%' r='52%'>
          <stop offset='0%' stop-color='${c1}' stop-opacity='0.45'/>
          <stop offset='100%' stop-color='${c3}' stop-opacity='0'/>
        </radialGradient>
        <filter id='blur'><feGaussianBlur stdDeviation='15'/></filter>
        <filter id='grain'>
          <feTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='3' stitchTiles='stitch'/>
          <feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.12 0'/>
          <feComposite in2='SourceGraphic' operator='in'/>
        </filter>
      </defs>
      <rect width='400' height='400' fill='url(#g1)'/>
      <rect width='400' height='400' fill='url(#g2)'/>
      <g filter='url(#blur)' opacity='0.65'>
        ${glyph}
      </g>
      <rect width='400' height='400' filter='url(#grain)' opacity='0.42'/>
    </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function parseCuriosity(row) {
  return {
    ...row,
    tags: JSON.parse(row.tags || '[]'),
    favorite: row.favorite === 1,
    collection: row.collection || null,
  };
}

function parseCollection(row, count = 0) {
  return { ...row, pinned: row.pinned === 1, count };
}

function getCollectionCount(id) {
  return db.prepare('SELECT COUNT(*) as n FROM curiosities WHERE collection = ?').get(id).n;
}

// ─────────────────────────────────────────────────────────────────────────────
// Seed data
// ─────────────────────────────────────────────────────────────────────────────

const seedCollections = [
  { id: 'col1', name: 'Things from elsewhere',     color: '#3C3F4A', emoji: '✦', note: 'Travelled, carried, found in pockets.',              pinned: 1 },
  { id: 'col2', name: 'Companions on the shelf',   color: '#B9AABF', emoji: '❀', note: 'Small objects that have stayed.',                    pinned: 1 },
  { id: 'col3', name: 'Things that feel like rain', color: '#A8B5C1', emoji: '❅', note: 'Fog blue, porcelain mist, the in-between weather.', pinned: 0 },
  { id: 'col4', name: 'Borrowed sentences',        color: '#6B5A78', emoji: '❝', note: 'Words from books and overheard rooms.',              pinned: 1 },
  { id: 'col5', name: 'Internet relics',           color: '#8C8F91', emoji: '◌', note: 'Pages, signals, ghosts of the early web.',           pinned: 0 },
  { id: 'col6', name: 'Quietly violet',            color: '#C8B8C8', emoji: '✿', note: 'Things hushed in lavender and dusk.',                pinned: 0 },
];

const seedCuriosities = [
  {
    id: 'c1', title: 'Train ticket from Iași', mood: 'nostalgic', category: 'memories',
    description: 'Folded twice, stamped 03:42 — a slow August night through the Carpathians. The conductor wore a watch on the wrong wrist.',
    tags: ['travel','paper','summer','romania'], collection: 'col1', favorite: 1, added: '2025-08-14',
    palette: ['#e8c890', '#c08850', '#6a4020'],
    glyph: `<rect x='80' y='130' width='240' height='140' rx='8' fill='#fff8e8' opacity='0.92'/>
         <circle cx='288' cy='188' r='40' fill='none' stroke='#c08850' stroke-width='3.5' opacity='0.8'/>
         <circle cx='288' cy='188' r='28' fill='none' stroke='#c08850' stroke-width='1.5' opacity='0.5'/>
         <line x1='105' y1='168' x2='238' y2='168' stroke='#6a4020' stroke-width='2' opacity='0.55'/>
         <line x1='105' y1='188' x2='228' y2='188' stroke='#6a4020' stroke-width='2' opacity='0.55'/>
         <line x1='105' y1='208' x2='210' y2='208' stroke='#6a4020' stroke-width='2' opacity='0.45'/>`,
  },
  {
    id: 'c2', title: 'Frog-shaped mug', mood: 'cozy', category: 'objects',
    description: 'Found in a Lisbon thrift shop. One small chip on the rim, eyes mildly judgmental. Holds exactly the right amount of green tea.',
    tags: ['ceramics','thrift','green','morning'], collection: 'col2', favorite: 1, added: '2025-09-02',
    palette: ['#d8d4f0', '#8c4ba0', '#3a2468'],
    glyph: `<rect x='118' y='188' width='164' height='148' rx='16' fill='#a896d8' opacity='0.85'/>
         <path d='M282 226 Q316 226 316 268 Q316 308 282 308' stroke='#c2b0e8' fill='none' stroke-width='14' stroke-linecap='round'/>
         <circle cx='168' cy='155' r='30' fill='#c8b8ea'/>
         <circle cx='232' cy='155' r='30' fill='#c8b8ea'/>
         <circle cx='168' cy='155' r='12' fill='#2e1c58'/>
         <circle cx='232' cy='155' r='12' fill='#2e1c58'/>
         <circle cx='172' cy='151' r='4' fill='#fff' opacity='0.7'/>`,
  },
  {
    id: 'c3', title: 'Cloud that looked like a whale', mood: 'dreamy', category: 'photos',
    description: 'October 6th, 17:48, walking home. By the time I got my phone out it had become a less specific creature.',
    tags: ['sky','evening','fleeting'], collection: 'col3', favorite: 0, added: '2025-10-06',
    palette: ['#dce8f8', '#8898c8', '#3a4870'],
    glyph: `<ellipse cx='200' cy='215' rx='148' ry='62' fill='#fff' opacity='0.92'/>
         <ellipse cx='148' cy='188' rx='80' ry='58' fill='#fff' opacity='0.88'/>
         <ellipse cx='285' cy='198' rx='62' ry='42' fill='#fff' opacity='0.82'/>
         <ellipse cx='110' cy='268' rx='48' ry='28' fill='#dce8f8' opacity='0.55'/>
         <ellipse cx='320' cy='280' rx='35' ry='22' fill='#dce8f8' opacity='0.4'/>`,
  },
  {
    id: 'c4', title: '"...the river was a long, lying tongue."', mood: 'melancholic', category: 'quotes',
    description: "From a paperback I found on a bench in Krakow. Couldn't place the author. Wrote it down before someone else picked the book up.",
    tags: ['books','writing','found'], collection: 'col4', favorite: 1, added: '2025-07-22',
    palette: ['#ede0c4', '#c0a870', '#6a5030'],
    glyph: `<rect x='68' y='98' width='122' height='204' rx='5' fill='#f8f0e0' opacity='0.96'/>
         <rect x='210' y='98' width='122' height='204' rx='5' fill='#f5edd8' opacity='0.96'/>
         <rect x='184' y='98' width='32' height='204' fill='#d8c8a0' opacity='0.65'/>
         <line x1='86' y1='148' x2='176' y2='148' stroke='#8a7058' stroke-width='1.5' opacity='0.5'/>
         <line x1='86' y1='168' x2='176' y2='168' stroke='#8a7058' stroke-width='1.5' opacity='0.5'/>
         <line x1='86' y1='188' x2='162' y2='188' stroke='#8a7058' stroke-width='1.5' opacity='0.45'/>
         <line x1='86' y1='208' x2='170' y2='208' stroke='#8a7058' stroke-width='1.5' opacity='0.4'/>
         <line x1='228' y1='148' x2='316' y2='148' stroke='#8a7058' stroke-width='1.5' opacity='0.5'/>
         <line x1='228' y1='168' x2='316' y2='168' stroke='#8a7058' stroke-width='1.5' opacity='0.5'/>
         <line x1='228' y1='188' x2='300' y2='188' stroke='#8a7058' stroke-width='1.5' opacity='0.45'/>`,
  },
  {
    id: 'c5', title: 'geocities.com/lemonshrine', mood: 'chaotic', category: 'internet',
    description: "A site about lemons that hasn't been updated since 2003. Midi music, glittering gifs, a guestbook with 11 entries.",
    tags: ['web1.0','weird','archive'], collection: 'col5', favorite: 0, added: '2025-04-19',
    palette: ['#f0eaf8', '#b87ad0', '#443268'],
    glyph: `<ellipse cx='200' cy='218' rx='98' ry='85' fill='#e8e050' opacity='0.82'/>
         <ellipse cx='200' cy='205' rx='68' ry='55' fill='#f8f060' opacity='0.65'/>
         <path d='M200 122 L204 136 L220 136 L208 145 L212 160 L200 151 L188 160 L192 145 L180 136 L196 136 Z' fill='#b87ad0' opacity='0.9'/>
         <circle cx='132' cy='118' r='10' fill='#b87ad0' opacity='0.8'/>
         <circle cx='275' cy='108' r='7' fill='#e0c040' opacity='0.9'/>
         <circle cx='308' cy='178' r='9' fill='#b87ad0' opacity='0.7'/>
         <circle cx='78' cy='290' r='6' fill='#e0c040' opacity='0.8'/>`,
  },
  {
    id: 'c6', title: 'Tiny shell, Brittany coast', mood: 'tender', category: 'objects',
    description: 'Picked up on a foggy morning. Held to my ear it makes no sound. I keep it on the windowsill above the sink.',
    tags: ['beach','white','small'], collection: 'col2', favorite: 0, added: '2025-09-19',
    palette: ['#f8f0e4', '#d4b490', '#8a6848'],
    glyph: `<path d='M200 115 C265 115 308 162 308 215 C308 278 255 318 200 318 C145 318 92 278 92 215 C92 162 135 128 178 128 C222 128 255 162 255 205 C255 248 225 268 200 268 C175 268 155 250 155 228 C155 208 170 196 185 196' stroke='#c8a878' stroke-width='9' fill='none' stroke-linecap='round'/>
         <circle cx='200' cy='200' r='16' fill='#ead8b8' opacity='0.85'/>`,
  },
  {
    id: 'c7', title: 'Brass key, no known lock', mood: 'mysterious', category: 'objects',
    description: "Came in a box of old letters from my grandfather's attic. Tied with twine to a paper tag that just says 'study?'.",
    tags: ['heirloom','metal','puzzle'], collection: 'col1', favorite: 1, added: '2025-06-03',
    palette: ['#e8c870', '#a87830', '#4a2810'],
    glyph: `<circle cx='152' cy='200' r='66' fill='none' stroke='#d4a848' stroke-width='15'/>
         <circle cx='152' cy='200' r='30' fill='none' stroke='#d4a848' stroke-width='8'/>
         <rect x='208' y='190' width='132' height='18' rx='5' fill='#d4a848'/>
         <rect x='288' y='208' width='18' height='30' rx='3' fill='#d4a848'/>
         <rect x='318' y='208' width='14' height='22' rx='3' fill='#d4a848'/>`,
  },
  {
    id: 'c8', title: 'Vinyl: Ravel — Pavane', mood: 'nostalgic', category: 'music',
    description: 'Bought for €2 at a Sunday market. The sleeve has water damage shaped like a continent. The record itself plays clean.',
    tags: ['vinyl','classical','paris'], collection: 'col4', favorite: 0, added: '2025-03-11',
    palette: ['#4a3068', '#2a1848', '#100818'],
    glyph: `<circle cx='200' cy='200' r='168' fill='#0c0820'/>
         <circle cx='200' cy='200' r='140' fill='none' stroke='#3a2860' stroke-width='1.5'/>
         <circle cx='200' cy='200' r='110' fill='none' stroke='#3a2860' stroke-width='1.5'/>
         <circle cx='200' cy='200' r='80' fill='none' stroke='#3a2860' stroke-width='1.5'/>
         <circle cx='200' cy='200' r='50' fill='none' stroke='#3a2860' stroke-width='1.5'/>
         <circle cx='200' cy='200' r='44' fill='#8c4ba0'/>
         <circle cx='200' cy='200' r='24' fill='#b87ad0'/>
         <circle cx='200' cy='200' r='8' fill='#0c0820'/>`,
  },
  {
    id: 'c9', title: 'Pressed clover, four-leaf', mood: 'tender', category: 'objects',
    description: 'Found in 2019, kept in a copy of Calvino. Still flat. Still green-ish. Still, somehow, lucky.',
    tags: ['botany','luck','green'], collection: 'col6', favorite: 1, added: '2025-05-08',
    palette: ['#e4f0d8', '#98b870', '#486038'],
    glyph: `<g transform='translate(200,192)'>
          <ellipse cx='-30' cy='0' rx='44' ry='28' fill='#78a050' transform='rotate(-45)' opacity='0.88'/>
          <ellipse cx='30' cy='0' rx='44' ry='28' fill='#78a050' transform='rotate(45)' opacity='0.88'/>
          <ellipse cx='0' cy='-30' rx='28' ry='44' fill='#78a050' opacity='0.88'/>
          <ellipse cx='0' cy='30' rx='28' ry='44' fill='#78a050' opacity='0.88'/>
          <circle cx='0' cy='0' r='10' fill='#b8d898'/>
        </g>
        <line x1='200' y1='258' x2='200' y2='340' stroke='#588040' stroke-width='4' stroke-linecap='round' opacity='0.7'/>`,
  },
  {
    id: 'c10', title: 'Snowy bus stop, 06:12', mood: 'melancholic', category: 'photos',
    description: 'No buses for another forty minutes. The benches were full anyway. Someone had drawn a heart in the frost on the timetable.',
    tags: ['winter','city','morning'], collection: 'col3', favorite: 0, added: '2025-01-24',
    palette: ['#e8eef8', '#8898c0', '#303860'],
    glyph: `<rect x='98' y='158' width='204' height='12' rx='4' fill='#c8d4e8' opacity='0.92'/>
         <rect x='98' y='170' width='10' height='160' fill='#8898c0' opacity='0.72'/>
         <rect x='292' y='170' width='10' height='160' fill='#8898c0' opacity='0.72'/>
         <rect x='98' y='170' width='204' height='82' fill='#d8e4f2' opacity='0.48'/>
         <circle cx='136' cy='262' r='5' fill='#fff' opacity='0.88'/>
         <circle cx='178' cy='285' r='4' fill='#fff' opacity='0.78'/>
         <circle cx='225' cy='254' r='6' fill='#fff' opacity='0.92'/>
         <circle cx='268' cy='292' r='4' fill='#fff' opacity='0.72'/>
         <circle cx='155' cy='318' r='5' fill='#fff' opacity='0.82'/>
         <circle cx='248' cy='312' r='3' fill='#fff' opacity='0.65'/>`,
  },
  {
    id: 'c11', title: 'Postcard, Évora 1972', mood: 'nostalgic', category: 'memories',
    description: "Found tucked into a secondhand book. Addressed to a 'Dear M.' — the message half-illegible, the stamp still cancelled crisp.",
    tags: ['paper','portugal','letters'], collection: 'col1', favorite: 0, added: '2025-02-14',
    palette: ['#f0d8a8', '#c08858', '#5a3820'],
    glyph: `<rect x='48' y='88' width='304' height='224' rx='6' fill='#f8f0d8' opacity='0.96'/>
         <line x1='220' y1='88' x2='220' y2='312' stroke='#c08858' stroke-width='1' opacity='0.38'/>
         <rect x='246' y='106' width='74' height='92' rx='5' fill='#b87038' opacity='0.6'/>
         <rect x='252' y='112' width='62' height='80' rx='3' fill='#d09050' opacity='0.5'/>
         <line x1='66' y1='252' x2='202' y2='252' stroke='#8a6040' stroke-width='1.5' opacity='0.48'/>
         <line x1='66' y1='270' x2='192' y2='270' stroke='#8a6040' stroke-width='1.5' opacity='0.48'/>
         <line x1='66' y1='288' x2='178' y2='288' stroke='#8a6040' stroke-width='1.5' opacity='0.38'/>`,
  },
  {
    id: 'c12', title: 'Lavender field, Valensole', mood: 'dreamy', category: 'places',
    description: 'Smelled like every soap my grandmother ever owned. The bees were the size of grapes and uninterested in tourists.',
    tags: ['france','summer','purple'], collection: 'col6', favorite: 1, added: '2025-07-04',
    palette: ['#dcd0f0', '#9868c0', '#3a2060'],
    glyph: `<rect y='258' width='400' height='142' fill='#6a4890' opacity='0.58'/>
         <rect y='290' width='400' height='110' fill='#4a3068' opacity='0.38'/>
         <circle cx='200' cy='118' r='52' fill='#f8c870' opacity='0.48'/>
         <g stroke-linecap='round'>
           <line x1='55' y1='390' x2='55' y2='222' stroke='#7a5898' stroke-width='3.5'/>
           <line x1='98' y1='390' x2='98' y2='200' stroke='#7a5898' stroke-width='3.5'/>
           <line x1='141' y1='390' x2='141' y2='228' stroke='#7a5898' stroke-width='3.5'/>
           <line x1='184' y1='390' x2='184' y2='210' stroke='#7a5898' stroke-width='3.5'/>
           <line x1='227' y1='390' x2='227' y2='224' stroke='#7a5898' stroke-width='3.5'/>
           <line x1='270' y1='390' x2='270' y2='215' stroke='#7a5898' stroke-width='3.5'/>
           <line x1='313' y1='390' x2='313' y2='232' stroke='#7a5898' stroke-width='3.5'/>
           <line x1='356' y1='390' x2='356' y2='205' stroke='#7a5898' stroke-width='3.5'/>
         </g>
         <ellipse cx='55' cy='216' rx='11' ry='28' fill='#b87ad0' opacity='0.92'/>
         <ellipse cx='98' cy='194' rx='11' ry='28' fill='#c890e0' opacity='0.92'/>
         <ellipse cx='141' cy='222' rx='11' ry='28' fill='#b87ad0' opacity='0.92'/>
         <ellipse cx='184' cy='204' rx='11' ry='28' fill='#c890e0' opacity='0.92'/>
         <ellipse cx='227' cy='218' rx='11' ry='28' fill='#b87ad0' opacity='0.92'/>
         <ellipse cx='270' cy='209' rx='11' ry='28' fill='#c890e0' opacity='0.92'/>
         <ellipse cx='313' cy='226' rx='11' ry='28' fill='#b87ad0' opacity='0.92'/>
         <ellipse cx='356' cy='199' rx='11' ry='28' fill='#c890e0' opacity='0.92'/>`,
  },
  {
    id: 'c13', title: '"All cats are good cats."', mood: 'cozy', category: 'quotes',
    description: 'Overheard in a bookshop café in Ghent. The woman who said it was very serious. I have thought about it weekly since.',
    tags: ['overheard','café','wisdom'], collection: 'col4', favorite: 0, added: '2025-10-12',
    palette: ['#f0e4d4', '#c8a080', '#6a5040'],
    glyph: `<ellipse cx='200' cy='252' rx='102' ry='88' fill='#b89070' opacity='0.8'/>
         <ellipse cx='200' cy='200' rx='68' ry='62' fill='#c8a080' opacity='0.82'/>
         <polygon points='142,170 158,112 178,168' fill='#c0987a' opacity='0.9'/>
         <polygon points='222,168 242,110 262,170' fill='#c0987a' opacity='0.9'/>
         <circle cx='182' cy='198' r='9' fill='#3a2818'/>
         <circle cx='218' cy='198' r='9' fill='#3a2818'/>
         <circle cx='185' cy='195' r='3' fill='#fff' opacity='0.7'/>
         <circle cx='221' cy='195' r='3' fill='#fff' opacity='0.7'/>`,
  },
  {
    id: 'c14', title: 'Forgotten arcade, Brighton', mood: 'chaotic', category: 'places',
    description: 'Half the machines worked. The carpet pattern looked back at you. Ate a 30p chip and won 4 tickets, redeemed for a sticker.',
    tags: ['seaside','neon','weird'], collection: 'col5', favorite: 0, added: '2025-08-30',
    palette: ['#c2b8e8', '#8c4ba0', '#200c40'],
    glyph: `<rect x='48' y='78' width='82' height='270' rx='9' fill='#4a2870'/>
         <rect x='58' y='96' width='62' height='82' rx='5' fill='#b87ad0' opacity='0.92'/>
         <rect x='58' y='195' width='28' height='18' rx='9' fill='#e0a8f0' opacity='0.8'/>
         <rect x='158' y='96' width='84' height='270' rx='9' fill='#3a2060'/>
         <rect x='168' y='116' width='64' height='82' rx='5' fill='#9868c0' opacity='0.92'/>
         <rect x='168' y='215' width='30' height='18' rx='9' fill='#c890e0' opacity='0.8'/>
         <rect x='272' y='86' width='82' height='270' rx='9' fill='#4a2870'/>
         <rect x='282' y='106' width='62' height='82' rx='5' fill='#c890e0' opacity='0.92'/>
         <rect x='282' y='205' width='28' height='18' rx='9' fill='#e0a8f0' opacity='0.8'/>`,
  },
  {
    id: 'c15', title: 'Sourdough crumb, perfect', mood: 'cozy', category: 'photos',
    description: 'First good loaf out of a bad oven. Photographed before slicing. Eaten with butter. The starter is named Hilda.',
    tags: ['bread','kitchen','achievement'], collection: 'col6', favorite: 0, added: '2025-09-28',
    palette: ['#f0d8a8', '#c89060', '#6a4020'],
    glyph: `<ellipse cx='200' cy='215' rx='158' ry='112' fill='#d8a870' opacity='0.9'/>
         <ellipse cx='200' cy='188' rx='142' ry='72' fill='#c88a58' opacity='0.68'/>
         <path d='M100 188 Q200 142 300 188' stroke='#a06030' stroke-width='4.5' fill='none' stroke-linecap='round'/>
         <circle cx='148' cy='228' r='24' fill='#8a5030' opacity='0.68'/>
         <circle cx='232' cy='238' r='19' fill='#8a5030' opacity='0.65'/>
         <circle cx='188' cy='268' r='15' fill='#8a5030' opacity='0.58'/>
         <circle cx='268' cy='268' r='12' fill='#8a5030' opacity='0.5'/>`,
  },
  {
    id: 'c16', title: 'Midnight email from a stranger', mood: 'mysterious', category: 'internet',
    description: "Subject: 'wrong address but'. Two paragraphs about their dog Pepper. Replied, very briefly. Never heard back.",
    tags: ['email','stranger','kindness'], collection: 'col5', favorite: 0, added: '2025-11-02',
    palette: ['#5040a0', '#281870', '#0e0828'],
    glyph: `<rect x='68' y='128' width='264' height='184' rx='12' fill='#3828a0' opacity='0.82'/>
         <polygon points='68,128 200,248 332,128' fill='#5848c0' opacity='0.92'/>
         <line x1='68' y1='312' x2='178' y2='225' stroke='#8878e0' stroke-width='2' opacity='0.55'/>
         <line x1='332' y1='312' x2='222' y2='225' stroke='#8878e0' stroke-width='2' opacity='0.55'/>
         <circle cx='312' cy='145' r='5' fill='#a898f0' opacity='0.75'/>
         <circle cx='82' cy='295' r='3' fill='#a898f0' opacity='0.5'/>
         <circle cx='345' cy='288' r='4' fill='#8878e0' opacity='0.42'/>
         <circle cx='58' cy='175' r='3' fill='#a898f0' opacity='0.35'/>`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// First-run seed
// ─────────────────────────────────────────────────────────────────────────────

const isEmpty = db.prepare('SELECT COUNT(*) as n FROM curiosities').get().n === 0;
if (isEmpty) {
  const insertCol = db.prepare(
    'INSERT OR IGNORE INTO collections (id, name, color, emoji, note, pinned) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const insertCur = db.prepare(
    'INSERT OR IGNORE INTO curiosities (id, title, description, image, mood, category, tags, collection, favorite, added) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  const seed = db.transaction(() => {
    for (const c of seedCollections) {
      insertCol.run(c.id, c.name, c.color, c.emoji, c.note, c.pinned);
    }
    for (const c of seedCuriosities) {
      insertCur.run(c.id, c.title, c.description, img(c.palette, c.glyph), c.mood, c.category, JSON.stringify(c.tags), c.collection, c.favorite, c.added);
    }
  });
  seed();
  console.log('Database seeded with 6 collections and 16 curiosities (with images).');
}

// ─────────────────────────────────────────────────────────────────────────────
// One-time backfill: any seed curiosity (id matches) with an empty image gets
// the generated data URI. Safe to run on every startup — no-op when already filled.
// ─────────────────────────────────────────────────────────────────────────────

const emptyImageRows = db.prepare("SELECT id FROM curiosities WHERE image = ''").all();
if (emptyImageRows.length > 0) {
  const upd = db.prepare('UPDATE curiosities SET image = ? WHERE id = ?');
  let filled = 0;
  const fill = db.transaction(() => {
    for (const row of emptyImageRows) {
      const seedEntry = seedCuriosities.find(s => s.id === row.id);
      if (seedEntry) {
        upd.run(img(seedEntry.palette, seedEntry.glyph), row.id);
        filled++;
      }
    }
  });
  fill();
  if (filled > 0) console.log(`Backfilled ${filled} seed image(s) into existing rows.`);
}

module.exports = { db, parseCuriosity, parseCollection, getCollectionCount };
