const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 스크린샷을 저장할 디렉토리
const screenshotsDir = path.join(__dirname, 'screenshots');

// 디렉토리가 없으면 생성
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// 스크린샷을 찍을 페이지 목록
const pages = [
  { name: 'index', file: 'index.html', waitTime: 2000 },
  { name: 'plan', file: 'plan.html', waitTime: 2000 },
  { name: 'schedule', file: 'schedule.html', waitTime: 3000 }, // 지도 로딩 대기
  { name: 'my-trips', file: 'my-trips.html', waitTime: 2000 },
  { name: 'calendar', file: 'calendar.html', waitTime: 2000 }
];

async function takeScreenshot(pageName, filePath, waitTime = 2000) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // 뷰포트 설정 (데스크톱 크기)
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2 // 고해상도
    });

    // 파일 경로를 file:// 프로토콜로 변환
    const fileUrl = `file://${path.resolve(filePath)}`;
    console.log(`Loading: ${fileUrl}`);
    
    await page.goto(fileUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // 추가 대기 시간 (애니메이션, 지도 로딩 등)
    await page.waitForTimeout(waitTime);

    // 전체 페이지 스크린샷
    const screenshotPath = path.join(screenshotsDir, `${pageName}-full.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      type: 'png'
    });
    console.log(`✓ Saved: ${screenshotPath}`);

    // 뷰포트 크기 스크린샷 (첫 화면만)
    const viewportPath = path.join(screenshotsDir, `${pageName}-viewport.png`);
    await page.screenshot({
      path: viewportPath,
      fullPage: false,
      type: 'png'
    });
    console.log(`✓ Saved: ${viewportPath}`);

    // 모바일 뷰포트도 생성
    await page.setViewport({
      width: 375,
      height: 667,
      deviceScaleFactor: 2
    });
    await page.waitForTimeout(1000);
    
    const mobilePath = path.join(screenshotsDir, `${pageName}-mobile.png`);
    await page.screenshot({
      path: mobilePath,
      fullPage: true,
      type: 'png'
    });
    console.log(`✓ Saved: ${mobilePath}`);

  } catch (error) {
    console.error(`Error capturing ${pageName}:`, error.message);
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('🚀 Starting screenshot capture...\n');

  for (const page of pages) {
    const filePath = path.join(__dirname, page.file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${page.file}, skipping...`);
      continue;
    }

    console.log(`\n📸 Capturing ${page.name}...`);
    await takeScreenshot(page.name, filePath, page.waitTime);
  }

  console.log('\n✨ All screenshots completed!');
  console.log(`📁 Screenshots saved in: ${screenshotsDir}`);
}

main().catch(console.error);



