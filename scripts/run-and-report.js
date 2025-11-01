const { spawnSync } = require('child_process');
const path = require('path');

function run(command, args) {
  console.log(`> ${command} ${args.join(' ')}`);
  const res = spawnSync(command, args, { stdio: 'inherit', shell: false });
  return res;
}

// Cross-platform npx resolution
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

// Capture all command-line arguments passed to the script
// e.g., from npm run test:api → ["--tags", "@API"]
const extraArgs = process.argv.slice(2);

// Combine base args with tag-based filters
const cucumberArgs = ['cucumber-js', '--config', 'cucumber.json', ...extraArgs];

// Run cucumber tests
console.log('\n Starting Cucumber tests...\n');
const cucumber = run(npx, cucumberArgs);

// Determine exit code for CI and local detection
const exitCode = cucumber.status !== 0 ? cucumber.status : 0;

// Always generate report, even on failure
try {
  console.log('Generating HTML report...\n');
  const reportScriptPath = path.join(__dirname, '../utils/generateReport.ts');
  const report = run(npx, ['ts-node', reportScriptPath]);

  if (report.status === 0) {
    console.log('\n HTML report generated successfully.\n');
  } else {
    console.error('\n Report generation failed.\n');
  }
} catch (err) {
  console.error('Report generation error:', err);
}

// Exit with Cucumber’s code so CI tools detect failures properly
process.exit(exitCode);
