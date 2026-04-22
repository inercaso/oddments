// seed.js — sample curiosities & collections for the prototype.
// Images are SVG placeholders generated inline so it works fully offline.

window.SEED = (function () {
  // Inline SVG image factory: dual radial gradients + blurred glyph + grain overlay.
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
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  const moods = ["nostalgic", "cozy", "dreamy", "melancholic", "chaotic", "mysterious", "tender"];
  const categories = ["objects", "memories", "quotes", "music", "places", "internet", "photos"];

  const curiosities = [
    {
      id: "c1",
      title: "Train ticket from Iași",
      description: "Folded twice, stamped 03:42 — a slow August night through the Carpathians. The conductor wore a watch on the wrong wrist.",
      mood: "nostalgic",
      category: "memories",
      tags: ["travel", "paper", "summer", "romania"],
      collection: "col1",
      favorite: true,
      added: "2025-08-14",
      image: img(
        ["#e8c890", "#c08850", "#6a4020"],
        `<rect x='80' y='130' width='240' height='140' rx='8' fill='#fff8e8' opacity='0.92'/>
         <circle cx='288' cy='188' r='40' fill='none' stroke='#c08850' stroke-width='3.5' opacity='0.8'/>
         <circle cx='288' cy='188' r='28' fill='none' stroke='#c08850' stroke-width='1.5' opacity='0.5'/>
         <line x1='105' y1='168' x2='238' y2='168' stroke='#6a4020' stroke-width='2' opacity='0.55'/>
         <line x1='105' y1='188' x2='228' y2='188' stroke='#6a4020' stroke-width='2' opacity='0.55'/>
         <line x1='105' y1='208' x2='210' y2='208' stroke='#6a4020' stroke-width='2' opacity='0.45'/>`
      ),
    },
    {
      id: "c2",
      title: "Frog-shaped mug",
      description: "Found in a Lisbon thrift shop. One small chip on the rim, eyes mildly judgmental. Holds exactly the right amount of green tea.",
      mood: "cozy",
      category: "objects",
      tags: ["ceramics", "thrift", "green", "morning"],
      collection: "col2",
      favorite: true,
      added: "2025-09-02",
      image: img(
        ["#d8d4f0", "#8c4ba0", "#3a2468"],
        `<rect x='118' y='188' width='164' height='148' rx='16' fill='#a896d8' opacity='0.85'/>
         <path d='M282 226 Q316 226 316 268 Q316 308 282 308' stroke='#c2b0e8' fill='none' stroke-width='14' stroke-linecap='round'/>
         <circle cx='168' cy='155' r='30' fill='#c8b8ea'/>
         <circle cx='232' cy='155' r='30' fill='#c8b8ea'/>
         <circle cx='168' cy='155' r='12' fill='#2e1c58'/>
         <circle cx='232' cy='155' r='12' fill='#2e1c58'/>
         <circle cx='172' cy='151' r='4' fill='#fff' opacity='0.7'/>`
      ),
    },
    {
      id: "c3",
      title: "Cloud that looked like a whale",
      description: "October 6th, 17:48, walking home. By the time I got my phone out it had become a less specific creature.",
      mood: "dreamy",
      category: "photos",
      tags: ["sky", "evening", "fleeting"],
      collection: "col3",
      favorite: false,
      added: "2025-10-06",
      image: img(
        ["#dce8f8", "#8898c8", "#3a4870"],
        `<ellipse cx='200' cy='215' rx='148' ry='62' fill='#fff' opacity='0.92'/>
         <ellipse cx='148' cy='188' rx='80' ry='58' fill='#fff' opacity='0.88'/>
         <ellipse cx='285' cy='198' rx='62' ry='42' fill='#fff' opacity='0.82'/>
         <ellipse cx='110' cy='268' rx='48' ry='28' fill='#dce8f8' opacity='0.55'/>
         <ellipse cx='320' cy='280' rx='35' ry='22' fill='#dce8f8' opacity='0.4'/>`
      ),
    },
    {
      id: "c4",
      title: '"...the river was a long, lying tongue."',
      description: "From a paperback I found on a bench in Krakow. Couldn't place the author. Wrote it down before someone else picked the book up.",
      mood: "melancholic",
      category: "quotes",
      tags: ["books", "writing", "found"],
      collection: "col4",
      favorite: true,
      added: "2025-07-22",
      image: img(
        ["#ede0c4", "#c0a870", "#6a5030"],
        `<rect x='68' y='98' width='122' height='204' rx='5' fill='#f8f0e0' opacity='0.96'/>
         <rect x='210' y='98' width='122' height='204' rx='5' fill='#f5edd8' opacity='0.96'/>
         <rect x='184' y='98' width='32' height='204' fill='#d8c8a0' opacity='0.65'/>
         <line x1='86' y1='148' x2='176' y2='148' stroke='#8a7058' stroke-width='1.5' opacity='0.5'/>
         <line x1='86' y1='168' x2='176' y2='168' stroke='#8a7058' stroke-width='1.5' opacity='0.5'/>
         <line x1='86' y1='188' x2='162' y2='188' stroke='#8a7058' stroke-width='1.5' opacity='0.45'/>
         <line x1='86' y1='208' x2='170' y2='208' stroke='#8a7058' stroke-width='1.5' opacity='0.4'/>
         <line x1='228' y1='148' x2='316' y2='148' stroke='#8a7058' stroke-width='1.5' opacity='0.5'/>
         <line x1='228' y1='168' x2='316' y2='168' stroke='#8a7058' stroke-width='1.5' opacity='0.5'/>
         <line x1='228' y1='188' x2='300' y2='188' stroke='#8a7058' stroke-width='1.5' opacity='0.45'/>`
      ),
    },
    {
      id: "c5",
      title: "geocities.com/lemonshrine",
      description: "A site about lemons that hasn't been updated since 2003. Midi music, glittering gifs, a guestbook with 14 entries.",
      mood: "chaotic",
      category: "internet",
      tags: ["web1.0", "weird", "archive"],
      collection: "col5",
      favorite: false,
      added: "2025-04-19",
      image: img(
        ["#f0eaf8", "#b87ad0", "#443268"],
        `<ellipse cx='200' cy='218' rx='98' ry='85' fill='#e8e050' opacity='0.82'/>
         <ellipse cx='200' cy='205' rx='68' ry='55' fill='#f8f060' opacity='0.65'/>
         <path d='M200 122 L204 136 L220 136 L208 145 L212 160 L200 151 L188 160 L192 145 L180 136 L196 136 Z' fill='#b87ad0' opacity='0.9'/>
         <circle cx='132' cy='118' r='10' fill='#b87ad0' opacity='0.8'/>
         <circle cx='275' cy='108' r='7' fill='#e0c040' opacity='0.9'/>
         <circle cx='308' cy='178' r='9' fill='#b87ad0' opacity='0.7'/>
         <circle cx='78' cy='290' r='6' fill='#e0c040' opacity='0.8'/>`
      ),
    },
    {
      id: "c6",
      title: "Tiny shell, Brittany coast",
      description: "Picked up on a foggy morning. Held to my ear it makes no sound. I keep it on the windowsill above the sink.",
      mood: "tender",
      category: "objects",
      tags: ["beach", "white", "small"],
      collection: "col2",
      favorite: false,
      added: "2025-09-19",
      image: img(
        ["#f8f0e4", "#d4b490", "#8a6848"],
        `<path d='M200 115 C265 115 308 162 308 215 C308 278 255 318 200 318 C145 318 92 278 92 215 C92 162 135 128 178 128 C222 128 255 162 255 205 C255 248 225 268 200 268 C175 268 155 250 155 228 C155 208 170 196 185 196' stroke='#c8a878' stroke-width='9' fill='none' stroke-linecap='round'/>
         <circle cx='200' cy='200' r='16' fill='#ead8b8' opacity='0.85'/>`
      ),
    },
    {
      id: "c7",
      title: "Brass key, no known lock",
      description: "Came in a box of old letters from my grandfather's attic. Tied with twine to a paper tag that just says 'study?'.",
      mood: "mysterious",
      category: "objects",
      tags: ["heirloom", "metal", "puzzle"],
      collection: "col1",
      favorite: true,
      added: "2025-06-03",
      image: img(
        ["#e8c870", "#a87830", "#4a2810"],
        `<circle cx='152' cy='200' r='66' fill='none' stroke='#d4a848' stroke-width='15'/>
         <circle cx='152' cy='200' r='30' fill='none' stroke='#d4a848' stroke-width='8'/>
         <rect x='208' y='190' width='132' height='18' rx='5' fill='#d4a848'/>
         <rect x='288' y='208' width='18' height='30' rx='3' fill='#d4a848'/>
         <rect x='318' y='208' width='14' height='22' rx='3' fill='#d4a848'/>`
      ),
    },
    {
      id: "c8",
      title: "Vinyl: Ravel — Pavane",
      description: "Bought for €2 at a Sunday market. The sleeve has water damage shaped like a continent. The record itself plays clean.",
      mood: "nostalgic",
      category: "music",
      tags: ["vinyl", "classical", "paris"],
      collection: "col4",
      favorite: false,
      added: "2025-03-11",
      image: img(
        ["#4a3068", "#2a1848", "#100818"],
        `<circle cx='200' cy='200' r='168' fill='#0c0820'/>
         <circle cx='200' cy='200' r='140' fill='none' stroke='#3a2860' stroke-width='1.5'/>
         <circle cx='200' cy='200' r='110' fill='none' stroke='#3a2860' stroke-width='1.5'/>
         <circle cx='200' cy='200' r='80' fill='none' stroke='#3a2860' stroke-width='1.5'/>
         <circle cx='200' cy='200' r='50' fill='none' stroke='#3a2860' stroke-width='1.5'/>
         <circle cx='200' cy='200' r='44' fill='#8c4ba0'/>
         <circle cx='200' cy='200' r='24' fill='#b87ad0'/>
         <circle cx='200' cy='200' r='8' fill='#0c0820'/>`
      ),
    },
    {
      id: "c9",
      title: "Pressed clover, four-leaf",
      description: "Found in 2019, kept in a copy of Calvino. Still flat. Still green-ish. Still, somehow, lucky.",
      mood: "tender",
      category: "objects",
      tags: ["botany", "luck", "green"],
      collection: "col6",
      favorite: true,
      added: "2025-05-08",
      image: img(
        ["#e4f0d8", "#98b870", "#486038"],
        `<g transform='translate(200,192)'>
          <ellipse cx='-30' cy='0' rx='44' ry='28' fill='#78a050' transform='rotate(-45)' opacity='0.88'/>
          <ellipse cx='30' cy='0' rx='44' ry='28' fill='#78a050' transform='rotate(45)' opacity='0.88'/>
          <ellipse cx='0' cy='-30' rx='28' ry='44' fill='#78a050' opacity='0.88'/>
          <ellipse cx='0' cy='30' rx='28' ry='44' fill='#78a050' opacity='0.88'/>
          <circle cx='0' cy='0' r='10' fill='#b8d898'/>
        </g>
        <line x1='200' y1='258' x2='200' y2='340' stroke='#588040' stroke-width='4' stroke-linecap='round' opacity='0.7'/>`
      ),
    },
    {
      id: "c10",
      title: "Snowy bus stop, 06:12",
      description: "No buses for another forty minutes. The benches were full anyway. Someone had drawn a heart in the frost on the timetable.",
      mood: "melancholic",
      category: "photos",
      tags: ["winter", "city", "morning"],
      collection: "col3",
      favorite: false,
      added: "2025-01-24",
      image: img(
        ["#e8eef8", "#8898c0", "#303860"],
        `<rect x='98' y='158' width='204' height='12' rx='4' fill='#c8d4e8' opacity='0.92'/>
         <rect x='98' y='170' width='10' height='160' fill='#8898c0' opacity='0.72'/>
         <rect x='292' y='170' width='10' height='160' fill='#8898c0' opacity='0.72'/>
         <rect x='98' y='170' width='204' height='82' fill='#d8e4f2' opacity='0.48'/>
         <circle cx='136' cy='262' r='5' fill='#fff' opacity='0.88'/>
         <circle cx='178' cy='285' r='4' fill='#fff' opacity='0.78'/>
         <circle cx='225' cy='254' r='6' fill='#fff' opacity='0.92'/>
         <circle cx='268' cy='292' r='4' fill='#fff' opacity='0.72'/>
         <circle cx='155' cy='318' r='5' fill='#fff' opacity='0.82'/>
         <circle cx='248' cy='312' r='3' fill='#fff' opacity='0.65'/>`
      ),
    },
    {
      id: "c11",
      title: "Postcard, Évora 1972",
      description: "Found tucked into a secondhand book. Addressed to a 'Dear M.' — the message half-illegible, the stamp still cancelled crisp.",
      mono: "memory",
      mood: "nostalgic",
      category: "memories",
      tags: ["paper", "portugal", "letters"],
      collection: "col1",
      favorite: false,
      added: "2025-02-14",
      image: img(
        ["#f0d8a8", "#c08858", "#5a3820"],
        `<rect x='48' y='88' width='304' height='224' rx='6' fill='#f8f0d8' opacity='0.96'/>
         <line x1='220' y1='88' x2='220' y2='312' stroke='#c08858' stroke-width='1' opacity='0.38'/>
         <rect x='246' y='106' width='74' height='92' rx='5' fill='#b87038' opacity='0.6'/>
         <rect x='252' y='112' width='62' height='80' rx='3' fill='#d09050' opacity='0.5'/>
         <line x1='66' y1='252' x2='202' y2='252' stroke='#8a6040' stroke-width='1.5' opacity='0.48'/>
         <line x1='66' y1='270' x2='192' y2='270' stroke='#8a6040' stroke-width='1.5' opacity='0.48'/>
         <line x1='66' y1='288' x2='178' y2='288' stroke='#8a6040' stroke-width='1.5' opacity='0.38'/>`
      ),
    },
    {
      id: "c12",
      title: "Lavender field, Valensole",
      description: "Smelled like every soap my grandmother ever owned. The bees were the size of grapes and uninterested in tourists.",
      mood: "dreamy",
      category: "places",
      tags: ["france", "summer", "purple"],
      collection: "col6",
      favorite: true,
      added: "2025-07-04",
      image: img(
        ["#dcd0f0", "#9868c0", "#3a2060"],
        `<rect y='258' width='400' height='142' fill='#6a4890' opacity='0.58'/>
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
         <ellipse cx='356' cy='199' rx='11' ry='28' fill='#c890e0' opacity='0.92'/>`
      ),
    },
    {
      id: "c13",
      title: '"All cats are good cats."',
      description: "Overheard in a bookshop café in Ghent. The woman who said it was very serious. I have thought about it weekly since.",
      mood: "cozy",
      category: "quotes",
      tags: ["overheard", "café", "wisdom"],
      collection: "col4",
      favorite: false,
      added: "2025-10-12",
      image: img(
        ["#f0e4d4", "#c8a080", "#6a5040"],
        `<ellipse cx='200' cy='252' rx='102' ry='88' fill='#b89070' opacity='0.8'/>
         <ellipse cx='200' cy='200' rx='68' ry='62' fill='#c8a080' opacity='0.82'/>
         <polygon points='142,170 158,112 178,168' fill='#c0987a' opacity='0.9'/>
         <polygon points='222,168 242,110 262,170' fill='#c0987a' opacity='0.9'/>
         <circle cx='182' cy='198' r='9' fill='#3a2818'/>
         <circle cx='218' cy='198' r='9' fill='#3a2818'/>
         <circle cx='185' cy='195' r='3' fill='#fff' opacity='0.7'/>
         <circle cx='221' cy='195' r='3' fill='#fff' opacity='0.7'/>`
      ),
    },
    {
      id: "c14",
      title: "Forgotten arcade, Brighton",
      description: "Half the machines worked. The carpet pattern looked back at you. Ate a 30p chip and won 4 tickets, redeemed for a sticker.",
      mood: "chaotic",
      category: "places",
      tags: ["seaside", "neon", "weird"],
      collection: "col5",
      favorite: false,
      added: "2025-08-30",
      image: img(
        ["#c2b8e8", "#8c4ba0", "#200c40"],
        `<rect x='48' y='78' width='82' height='270' rx='9' fill='#4a2870'/>
         <rect x='58' y='96' width='62' height='82' rx='5' fill='#b87ad0' opacity='0.92'/>
         <rect x='58' y='195' width='28' height='18' rx='9' fill='#e0a8f0' opacity='0.8'/>
         <rect x='158' y='96' width='84' height='270' rx='9' fill='#3a2060'/>
         <rect x='168' y='116' width='64' height='82' rx='5' fill='#9868c0' opacity='0.92'/>
         <rect x='168' y='215' width='30' height='18' rx='9' fill='#c890e0' opacity='0.8'/>
         <rect x='272' y='86' width='82' height='270' rx='9' fill='#4a2870'/>
         <rect x='282' y='106' width='62' height='82' rx='5' fill='#c890e0' opacity='0.92'/>
         <rect x='282' y='205' width='28' height='18' rx='9' fill='#e0a8f0' opacity='0.8'/>`
      ),
    },
    {
      id: "c15",
      title: "Sourdough crumb, perfect",
      description: "First good loaf out of a bad oven. Photographed before slicing. Eaten with butter. The starter is named Hilda.",
      mood: "cozy",
      category: "photos",
      tags: ["bread", "kitchen", "achievement"],
      collection: "col6",
      favorite: false,
      added: "2025-09-28",
      image: img(
        ["#f0d8a8", "#c89060", "#6a4020"],
        `<ellipse cx='200' cy='215' rx='158' ry='112' fill='#d8a870' opacity='0.9'/>
         <ellipse cx='200' cy='188' rx='142' ry='72' fill='#c88a58' opacity='0.68'/>
         <path d='M100 188 Q200 142 300 188' stroke='#a06030' stroke-width='4.5' fill='none' stroke-linecap='round'/>
         <circle cx='148' cy='228' r='24' fill='#8a5030' opacity='0.68'/>
         <circle cx='232' cy='238' r='19' fill='#8a5030' opacity='0.65'/>
         <circle cx='188' cy='268' r='15' fill='#8a5030' opacity='0.58'/>
         <circle cx='268' cy='268' r='12' fill='#8a5030' opacity='0.5'/>`
      ),
    },
    {
      id: "c16",
      title: "Midnight email from a stranger",
      description: "Subject: 'wrong address but'. Two paragraphs about their dog Pepper. Replied, very briefly. Never heard back.",
      mood: "mysterious",
      category: "internet",
      tags: ["email", "stranger", "kindness"],
      collection: "col5",
      favorite: false,
      added: "2025-11-02",
      image: img(
        ["#5040a0", "#281870", "#0e0828"],
        `<rect x='68' y='128' width='264' height='184' rx='12' fill='#3828a0' opacity='0.82'/>
         <polygon points='68,128 200,248 332,128' fill='#5848c0' opacity='0.92'/>
         <line x1='68' y1='312' x2='178' y2='225' stroke='#8878e0' stroke-width='2' opacity='0.55'/>
         <line x1='332' y1='312' x2='222' y2='225' stroke='#8878e0' stroke-width='2' opacity='0.55'/>
         <circle cx='312' cy='145' r='5' fill='#a898f0' opacity='0.75'/>
         <circle cx='82' cy='295' r='3' fill='#a898f0' opacity='0.5'/>
         <circle cx='345' cy='288' r='4' fill='#8878e0' opacity='0.42'/>
         <circle cx='58' cy='175' r='3' fill='#a898f0' opacity='0.35'/>`
      ),
    },
  ];

  const collections = [
    { id: "col1", name: "Things from elsewhere", count: 0, color: "#3C3F4A", emoji: "✦", note: "Travelled, carried, found in pockets.", pinned: true },
    { id: "col2", name: "Companions on the shelf", count: 0, color: "#B9AABF", emoji: "❀", note: "Small objects that have stayed.", pinned: true },
    { id: "col3", name: "Things that feel like rain", count: 0, color: "#A8B5C1", emoji: "❅", note: "Fog blue, porcelain mist, the in-between weather.", pinned: false },
    { id: "col4", name: "Borrowed sentences", count: 0, color: "#6B5A78", emoji: "❝", note: "Words from books and overheard rooms.", pinned: true },
    { id: "col5", name: "Internet relics", count: 0, color: "#8C8F91", emoji: "◌", note: "Pages, signals, ghosts of the early web.", pinned: false },
    { id: "col6", name: "Quietly violet", count: 0, color: "#C8B8C8", emoji: "✿", note: "Things hushed in lavender and dusk.", pinned: false },
  ];

  // attach counts
  collections.forEach(c => {
    c.count = curiosities.filter(x => x.collection === c.id).length;
  });

  return { curiosities, collections, moods, categories };
})();
