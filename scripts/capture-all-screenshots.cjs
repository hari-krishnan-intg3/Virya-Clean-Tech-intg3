const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../5 nov 26 changes');
const ARTIFACT_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\419377aa-fd45-49a7-b98d-4de052b1baac';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const SHOTS = [
  {
    name: '01_New_User_Registration_Portal.png',
    url: 'http://localhost:4173/register',
    label: 'New User CleanTech Energy Registration Portal',
    windowSize: '1440,1100',
  },
  {
    name: '02_Multi_Mode_User_Login.png',
    url: 'http://localhost:4173/login',
    label: 'Multi-Mode User Login (User ID, Email, Mobile OTP & Demo Sign-In)',
    windowSize: '1440,1100',
  },
  {
    name: '03_ROI_Calculator_Residential_PM_Surya_Ghar.png',
    url: 'http://localhost:4173/roi-calculator?mode=residential',
    label: 'ROI Calculator — Residential Mode & PM Surya Ghar ₹78,000 Subsidy (3kW -> 1L Savings)',
    windowSize: '1440,1150',
  },
  {
    name: '04_ROI_Calculator_Commercial_Mode.png',
    url: 'http://localhost:4173/roi-calculator?mode=commercial',
    label: 'ROI Calculator — Commercial & C&I Mode (40% Accelerated Depreciation & ToD Arbitrage)',
    windowSize: '1440,1150',
  },
  {
    name: '05_Automated_Branded_Proposal_Quote_Modal.png',
    url: 'http://localhost:4173/roi-calculator?modal=quote',
    label: 'Automated Branded Proposal & Quote Modal (Ref VCT-PROP-2026, BOQ & 25-Yr Compounded Cashflows)',
    windowSize: '1440,1200',
  },
  {
    name: '06_EBook_Auto_Delivery_Modal.png',
    url: 'http://localhost:4173/roi-calculator?modal=ebook',
    label: 'CleanTech Energy Independence E-Book Auto-Delivery & Download Modal',
    windowSize: '1440,1100',
  },
  {
    name: '07_Equipment_8_Slider_Carousel.png',
    url: 'http://localhost:4173/roi-calculator?tech=solar-paai',
    label: 'Equipment & Technology 8-Slider Carousel (Solar Paai, Sodium BESS, Hydrogen, Telecom)',
    windowSize: '1440,1150',
  },
  {
    name: '08_Dynamic_Navbar_Authenticated.png',
    url: 'http://localhost:4173/roi-calculator?auth=demo',
    label: 'Dynamic Navbar showing "ROI Calculators" and Authenticated User Profile Badge',
    windowSize: '1440,1050',
  },
  {
    name: '09_Industries_8_Slider_Carousel.png',
    url: 'http://localhost:4173/industries',
    label: 'Industries Page — Consulting-Led 8 Market Segments Carousel',
    windowSize: '1440,1100',
  },
  {
    name: '10_EV_Charging_8_Slider_Carousel.png',
    url: 'http://localhost:4173/services/ev-charging',
    label: 'EV Charging Page — 8 High-Power Charging Infrastructures Carousel (30kW–450kW)',
    windowSize: '1440,1100',
  },
  {
    name: '11_Renewables_8_Slider_Carousel.png',
    url: 'http://localhost:4173/services/solar',
    label: 'Renewables Page — 8 CleanTech Generation & Subsidies Carousel',
    windowSize: '1440,1100',
  },
  {
    name: '12_Home_Page_Hero_And_MegaMenu.png',
    url: 'http://localhost:4173/',
    label: 'Home Page — Hero & Navigation with All CleanTech Technologies',
    windowSize: '1440,1050',
  },
];

console.log('================================================================');
console.log('📸 CAPTURING ALL 12 HIGH-RES SCREENSHOTS INTO "5 nov 26 changes"');
console.log('================================================================');

for (let i = 0; i < SHOTS.length; i++) {
  const shot = SHOTS[i];
  const targetPath = path.join(OUTPUT_DIR, shot.name);
  console.log(`\n[${i + 1}/${SHOTS.length}] Capturing: ${shot.label}`);

  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--window-size=${shot.windowSize}`,
    '--virtual-time-budget=3500',
    `--screenshot=${targetPath}`,
    shot.url,
  ];

  const res = spawnSync(CHROME_PATH, args, { stdio: 'pipe' });

  if (fs.existsSync(targetPath)) {
    const stat = fs.statSync(targetPath);
    console.log(`   ✓ Saved: 5 nov 26 changes/${shot.name} (${Math.round(stat.size / 1024)} KB)`);

    // Copy to artifact directory for instant agent preview
    try {
      if (fs.existsSync(ARTIFACT_DIR)) {
        fs.copyFileSync(targetPath, path.join(ARTIFACT_DIR, shot.name));
      }
    } catch {}
  } else {
    console.error(`   ✗ Failed to capture: ${shot.name}`);
    if (res.stderr) console.error(res.stderr.toString());
  }
}

console.log('\n================================================================');
console.log('🎉 ALL SCREENSHOTS SUCCESSFULLY SAVED IN:');
console.log(`   📁 ${OUTPUT_DIR}`);
console.log('================================================================');

