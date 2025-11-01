import path from 'path';
import fs from 'fs';

const reporter = require('multiple-cucumber-html-reporter');

const reportsRoot = path.resolve(process.cwd(), 'reports');
const jsonDir = path.join(reportsRoot, 'json');
const htmlBase = path.join(reportsRoot, 'html');
const latestDir = path.join(htmlBase, 'latest');

// Helper: returns timestamp like 20251101_224512
function getTimestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export function generateReport() {
  const jsonReportFile = path.join(jsonDir, 'cucumber_report.json');
  if (!fs.existsSync(jsonReportFile)) {
    console.warn('⚠️ generateReport: cucumber JSON not found at', jsonReportFile);
    return;
  }

  // Create timestamped folder
  const timestamp = getTimestamp();
  const htmlDir = path.join(htmlBase, timestamp);
  fs.mkdirSync(htmlDir, { recursive: true });

  // Generate the report
  reporter.generate({
    jsonDir,
    reportPath: htmlDir,
    openReportInBrowser: false,
    displayDuration: true,
    pageTitle: 'Automation Test Report',
    reportName: `BDD Test Report - ${timestamp}`,
    customData: {
      title: 'Run Info',
      data: [
        { label: 'Project', value: 'Playwright BDD UI Automation' },
        { label: 'Environment', value: process.env.TEST_ENV ?? 'local' },
        { label: 'Executed By', value: process.env.USER ?? 'unknown' },
        { label: 'Report Generated', value: new Date().toISOString() }
      ]
    },
    metadata: {
      browser: {
        name: 'chromium',
        version: 'latest'
      },
      device: 'Local machine',
      platform: {
        name: process.platform,
        version: process.version
      }
    }
  });

  // Maintain a 'latest' folder for quick access
  try {
    if (fs.existsSync(latestDir)) {
      fs.rmSync(latestDir, { recursive: true, force: true });
    }
    fs.cpSync(htmlDir, latestDir, { recursive: true });
    console.log(`"latest" report updated at: ${path.join(latestDir, 'index.html')}`);
  } catch (err) {
    console.error('Failed to update latest report folder:', err);
  }

  console.log(`REPORT: HTML generated at: ${path.join(htmlDir, 'index.html')}`);
}

// Allow execution via CLI
if (require.main === module) {
  generateReport();
}
