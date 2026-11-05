const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const OUTPUT_DIR = path.resolve(__dirname, '../5 nov 26 changes');
const ARTIFACT_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\419377aa-fd45-49a7-b98d-4de052b1baac';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9224;

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Simple CDP Client using native Node WebSocket
class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.id && this.callbacks.has(data.id)) {
          const cb = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) cb.reject(new Error(data.error.message));
          else cb.resolve(data.result);
        }
      };
    });
  }

  async send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = this.id++;
      this.callbacks.set(msgId, { resolve, reject });
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  close() {
    try {
      this.ws.close();
    } catch {}
  }
}

async function getWsUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${DEBUG_PORT}/json/list`, (r) => {
          let data = '';
          r.on('data', (c) => (data += c));
          r.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
      });
      if (res && res.length > 0 && res[0].webSocketDebuggerUrl) {
        return res[0].webSocketDebuggerUrl;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error('Chrome remote debugging did not respond');
}

async function captureScreenshot(client, filename, delayMs = 1200) {
  await new Promise((r) => setTimeout(r, delayMs));
  const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
  const buffer = Buffer.from(data, 'base64');
  
  const targetPath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(targetPath, buffer);
  console.log(`✓ Saved: ${targetPath} (${Math.round(buffer.length / 1024)} KB)`);

  // Also copy to artifact directory if available
  try {
    if (fs.existsSync(ARTIFACT_DIR)) {
      fs.writeFileSync(path.join(ARTIFACT_DIR, filename), buffer);
    }
  } catch {}
}

async function main() {
  console.log('================================================================');
  console.log('📸 STARTING HIGH-RES LOCAL SCREENSHOT CAPTURE (5 NOV 26 CHANGES)');
  console.log('================================================================');

  const userDataDir = path.resolve(__dirname, '../.tmp_chrome_profile');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,1050',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${userDataDir}`,
    'http://localhost:4173',
  ]);

  try {
    const wsUrl = await getWsUrl();
    const client = new CDPClient(wsUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('Runtime.enable');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1050,
      deviceScaleFactor: 1.5,
      mobile: false,
    });

    // 1. Register Page
    console.log('\n[1/11] Capturing Register Page (/register)...');
    await client.send('Page.navigate', { url: 'http://localhost:4173/register' });
    await captureScreenshot(client, '01_New_Year_Registration_Portal.png', 1800);

    // 2. Login Page
    console.log('\n[2/11] Capturing Login Page (/login)...');
    await client.send('Page.navigate', { url: 'http://localhost:4173/login' });
    await captureScreenshot(client, '02_Multi_Mode_User_Login.png', 1800);

    // 3. ROI Calculator (Residential Mode with PM Surya Ghar)
    console.log('\n[3/11] Capturing ROI Calculator — Residential Mode & PM Surya Ghar (/roi-calculator)...');
    await client.send('Page.navigate', { url: 'http://localhost:4173/roi-calculator' });
    await captureScreenshot(client, '03_ROI_Calculator_Residential_PM_Surya_Ghar.png', 2000);

    // 4. ROI Calculator (Commercial Mode)
    console.log('\n[4/11] Capturing ROI Calculator — Commercial & C&I Mode...');
    await client.send('Runtime.evaluate', {
      expression: `
        const btns = Array.from(document.querySelectorAll('button'));
        const commBtn = btns.find(b => b.textContent.includes('Commercial & Industrial Mode') || b.textContent.includes('Commercial / C&I'));
        if (commBtn) commBtn.click();
      `,
    });
    await captureScreenshot(client, '04_ROI_Calculator_Commercial_Mode.png', 1200);

    // 5. Automated Proposal & Quote Modal
    console.log('\n[5/11] Capturing Automated Branded Proposal & Quote Modal...');
    await client.send('Runtime.evaluate', {
      expression: `
        const btns = Array.from(document.querySelectorAll('button'));
        const quoteBtn = btns.find(b => b.textContent.includes('Generate Official PDF Quote') || b.textContent.includes('Generate Official Quote'));
        if (quoteBtn) quoteBtn.click();
      `,
    });
    await captureScreenshot(client, '05_Automated_Branded_Proposal_Quote_Modal.png', 1500);

    // Close proposal modal
    await client.send('Runtime.evaluate', {
      expression: `
        const closeBtn = document.querySelector('button[aria-label="Close quote modal"]');
        if (closeBtn) closeBtn.click();
      `,
    });

    // 6. E-Book Auto-Delivery Modal
    console.log('\n[6/11] Capturing CleanTech E-Book Auto-Delivery Modal...');
    await client.send('Runtime.evaluate', {
      expression: `
        const btns = Array.from(document.querySelectorAll('button'));
        const ebookBtn = btns.find(b => b.textContent.includes('Download 2026 E-Book'));
        if (ebookBtn) ebookBtn.click();
      `,
    });
    await captureScreenshot(client, '06_EBook_Auto_Delivery_Modal.png', 1500);

    // Close ebook modal
    await client.send('Runtime.evaluate', {
      expression: `
        const closeBtn = document.querySelector('button[aria-label="Close modal"]');
        if (closeBtn) closeBtn.click();
      `,
    });

    // 7. Equipment 8-Slider Carousel on ROI Calculator Page
    console.log('\n[7/11] Capturing Equipment 8-Slider Carousel (Solar Paai, Sodium BESS, Hydrogen, Telecom)...');
    await client.send('Runtime.evaluate', {
      expression: `
        const slider = document.querySelector('.swiper');
        if (slider) slider.scrollIntoView({ behavior: 'instant', block: 'center' });
      `,
    });
    await captureScreenshot(client, '07_Equipment_8_Slider_Carousel.png', 1500);

    // 8. Sign in and capture Dynamic Navigation showing "ROI Calculators"
    console.log('\n[8/11] Simulating User Login to capture Dynamic Navbar item "ROI Calculators"...');
    await client.send('Page.navigate', { url: 'http://localhost:4173/login' });
    await new Promise((r) => setTimeout(r, 1000));
    await client.send('Runtime.evaluate', {
      expression: `
        const btns = Array.from(document.querySelectorAll('button'));
        const demoBtn = btns.find(b => b.textContent.includes('Residential User'));
        if (demoBtn) demoBtn.click();
      `,
    });
    await captureScreenshot(client, '08_Dynamic_Navbar_Authenticated.png', 1800);

    // 9. Industries 8-Slider Carousel
    console.log('\n[9/11] Capturing Industries 8-Slide Carousel (/industries)...');
    await client.send('Page.navigate', { url: 'http://localhost:4173/industries' });
    await new Promise((r) => setTimeout(r, 1200));
    await client.send('Runtime.evaluate', {
      expression: `
        const section = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('8 Market Segments Carousel'));
        if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
      `,
    });
    await captureScreenshot(client, '09_Industries_8_Slider_Carousel.png', 1500);

    // 10. EV Charging 8-Slider Carousel
    console.log('\n[10/11] Capturing EV Charging 8-Slide Carousel (/services/ev-charging)...');
    await client.send('Page.navigate', { url: 'http://localhost:4173/services/ev-charging' });
    await new Promise((r) => setTimeout(r, 1200));
    await client.send('Runtime.evaluate', {
      expression: `
        const section = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('8 EV Charging Infrastructures'));
        if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
      `,
    });
    await captureScreenshot(client, '10_EV_Charging_8_Slider_Carousel.png', 1500);

    // 11. Renewables 8-Slider Carousel
    console.log('\n[11/11] Capturing Renewables & CleanTech 8-Slide Carousel (/services/solar)...');
    await client.send('Page.navigate', { url: 'http://localhost:4173/services/solar' });
    await new Promise((r) => setTimeout(r, 1200));
    await client.send('Runtime.evaluate', {
      expression: `
        const section = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('8 Solar, Wind, Paai, Hydrogen & Subsidies'));
        if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
      `,
    });
    await captureScreenshot(client, '11_Renewables_8_Slider_Carousel.png', 1500);

    client.close();
    console.log('\n================================================================');
    console.log('🎉 ALL SCREENSHOTS SUCCESSFULLY CAPTURED IN "5 nov 26 changes"!');
    console.log('================================================================');
  } finally {
    chromeProcess.kill();
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {}
  }
}

main().catch((err) => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});

