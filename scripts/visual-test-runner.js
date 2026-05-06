#!/usr/bin/env node

/**
 * Visual Test Runner Script
 * 
 * Orchestrates visual regression testing with proper setup,
 * cleanup, and reporting for the glassmorphism design system.
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

class VisualTestRunner {
  constructor(options = {}) {
    this.options = {
      browser: options.browser || 'chromium',
      headless: options.headless !== false,
      updateBaselines: options.updateBaselines || false,
      grep: options.grep || '',
      storybookPort: options.storybookPort || 6006,
      buildStorybook: options.buildStorybook !== false,
      parallel: options.parallel !== false,
      retries: options.retries || 2,
      ...options
    };
    
    this.storybookProcess = null;
    this.testResults = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      differences: []
    };
  }

  async run() {
    console.log('🎨 Starting Visual Regression Testing for AuraGlass Design System');
    console.log(`📊 Configuration: ${JSON.stringify(this.options, null, 2)}\n`);

    try {
      await this.setupEnvironment();
      await this.startStorybook();
      await this.waitForStorybook();
      await this.runTests();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Visual testing failed:', error.message);
      process.exit(1);
    } finally {
      await this.cleanup();
    }
  }

  async setupEnvironment() {
    console.log('🔧 Setting up test environment...');
    
    // Create necessary directories
    const dirs = [
      'test-results',
      'playwright-report',
      'visual-baselines'
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      }
    });

    // Check for required dependencies
    const requiredCommands = ['npx', 'playwright'];
    for (const cmd of requiredCommands) {
      try {
        await this.execCommand(`which ${cmd}`);
      } catch (error) {
        throw new Error(`Required command not found: ${cmd}`);
      }
    }

    console.log('✅ Environment setup complete\n');
  }

  async startStorybook() {
    if (!this.options.buildStorybook) {
      console.log('⏭️ Skipping Storybook build (assuming already running)\n');
      return;
    }

    console.log('📚 Building and starting Storybook...');
    
    try {
      // Build Storybook
      console.log('🏗️ Building Storybook...');
      await this.execCommand('npm run build-storybook');
      console.log('✅ Storybook built successfully');

      // Start Storybook server
      console.log(`🚀 Starting Storybook server on port ${this.options.storybookPort}...`);
      
      const command = process.env.NODE_ENV === 'production' 
        ? `npx http-server storybook-static -p ${this.options.storybookPort} -s`
        : `npm run storybook -- --port ${this.options.storybookPort} --ci`;
      
      this.storybookProcess = spawn('sh', ['-c', command], {
        stdio: ['pipe', 'pipe', 'pipe'],
        detached: false
      });

      this.storybookProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Local:') || output.includes('ready')) {
          console.log('✅ Storybook server started');
        }
      });

      this.storybookProcess.stderr.on('data', (data) => {
        console.log('Storybook:', data.toString());
      });

    } catch (error) {
      throw new Error(`Failed to start Storybook: ${error.message}`);
    }
  }

  async waitForStorybook() {
    console.log(`⏳ Waiting for Storybook to be ready at http://localhost:${this.options.storybookPort}...`);
    
    const maxAttempts = 30;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        await this.execCommand(`curl -f http://localhost:${this.options.storybookPort} > /dev/null 2>&1`);
        console.log('✅ Storybook is ready\n');
        return;
      } catch (error) {
        attempts++;
        await this.sleep(2000);
      }
    }
    
    throw new Error('Storybook failed to start within timeout period');
  }

  async runTests() {
    console.log('🧪 Running visual regression tests...');
    
    const playwrightConfig = 'playwright.config.ts';
    const baseCommand = `npx playwright test --config=${playwrightConfig}`;
    
    let command = baseCommand;
    
    // Add browser selection
    if (this.options.browser) {
      command += ` --project=${this.options.browser}`;
    }
    
    // Add grep pattern
    if (this.options.grep) {
      command += ` --grep="${this.options.grep}"`;
    }
    
    // Add update baselines flag
    if (this.options.updateBaselines) {
      command += ' --update-snapshots';
      console.log('📸 Updating visual baselines...');
    }
    
    // Add retry configuration
    if (this.options.retries > 0) {
      command += ` --retries=${this.options.retries}`;
    }
    
    // Add parallel/serial execution
    if (!this.options.parallel) {
      command += ' --workers=1';
    }
    
    // Add headless mode
    if (this.options.headless) {
      command += ' --headed=false';
    }
    
    console.log(`🏃‍♂️ Executing: ${command}\n`);
    
    try {
      const output = await this.execCommand(command, { stdio: 'inherit' });
      console.log('\n✅ Visual tests completed successfully');
      await this.parseTestResults();
    } catch (error) {
      console.log('\n⚠️ Some visual tests failed or found differences');
      await this.parseTestResults();
      
      if (!this.options.updateBaselines && this.testResults.failed > 0) {
        throw new Error(`Visual regression detected: ${this.testResults.failed} tests failed`);
      }
    }
  }

  async parseTestResults() {
    console.log('📊 Parsing test results...');
    
    try {
      const resultsPath = path.join('test-results', 'results.json');
      
      if (fs.existsSync(resultsPath)) {
        const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        
        this.testResults = {
          total: results.stats?.total || 0,
          passed: results.stats?.expected || 0,
          failed: results.stats?.unexpected || 0,
          skipped: results.stats?.skipped || 0,
          differences: []
        };
        
        // Find visual differences
        const diffFiles = this.findDiffFiles();
        this.testResults.differences = diffFiles;
        
        console.log(`📈 Test Results Summary:`);
        console.log(`   Total: ${this.testResults.total}`);
        console.log(`   Passed: ${this.testResults.passed}`);
        console.log(`   Failed: ${this.testResults.failed}`);
        console.log(`   Skipped: ${this.testResults.skipped}`);
        console.log(`   Visual Differences: ${this.testResults.differences.length}`);
        
      } else {
        console.log('⚠️ No test results file found');
      }
    } catch (error) {
      console.log('⚠️ Failed to parse test results:', error.message);
    }
  }

  findDiffFiles() {
    const diffFiles = [];
    const testResultsDir = 'test-results';
    
    if (!fs.existsSync(testResultsDir)) {
      return diffFiles;
    }
    
    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (file.endsWith('-diff.png')) {
          diffFiles.push(filePath);
        }
      });
    };
    
    walkDir(testResultsDir);
    return diffFiles;
  }

  async generateReport() {
    console.log('📋 Generating visual test report...');
    
    const reportData = {
      timestamp: new Date().toISOString(),
      environment: {
        os: os.platform(),
        node: process.version,
        browser: this.options.browser,
        headless: this.options.headless
      },
      configuration: this.options,
      results: this.testResults,
      summary: this.generateSummary()
    };
    
    // Write JSON report
    const reportPath = path.join('test-results', 'visual-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    
    // Write human-readable report
    const markdownReport = this.generateMarkdownReport(reportData);
    const markdownPath = path.join('test-results', 'visual-test-report.md');
    fs.writeFileSync(markdownPath, markdownReport);
    
    console.log(`✅ Reports generated:`);
    console.log(`   JSON: ${reportPath}`);
    console.log(`   Markdown: ${markdownPath}`);
    console.log(`   HTML: playwright-report/index.html`);
  }

  generateSummary() {
    const { total, passed, failed, differences } = this.testResults;
    
    if (failed > 0 || differences.length > 0) {
      return `❌ FAILED: ${failed}/${total} tests failed, ${differences.length} visual differences`;
    } else if (total === passed) {
      return `✅ PASSED: All ${total} visual tests passed`;
    } else {
      return `⚠️ MIXED: ${passed}/${total} tests passed`;
    }
  }

  generateMarkdownReport(data) {
    return `# Visual Regression Test Report

## Summary
${data.summary}

**Generated:** ${data.timestamp}

## Results
- **Total Tests:** ${data.results.total}
- **Passed:** ${data.results.passed}
- **Failed:** ${data.results.failed}
- **Skipped:** ${data.results.skipped}
- **Visual Differences:** ${data.results.differences.length}

## Environment
- **OS:** ${data.environment.os}
- **Node:** ${data.environment.node}
- **Browser:** ${data.environment.browser}
- **Headless:** ${data.environment.headless}

## Configuration
\`\`\`json
${JSON.stringify(data.configuration, null, 2)}
\`\`\`

## Visual Differences
${data.results.differences.length > 0 ? 
  data.results.differences.map(diff => `- \`${diff}\``).join('\n') : 
  'No visual differences detected.'
}

## Next Steps
${data.results.differences.length > 0 ? `
⚠️ **Visual differences detected!**

1. Review the diff images in the test results
2. If changes are intentional, update baselines: \`npm run test:visual:update\`
3. If changes are unintentional, fix the components and re-test
` : `
✅ **All tests passed!**

The visual regression tests confirm that all components are rendering consistently with the established baselines.
`}

---
*Report generated by AuraGlass Visual Test Runner*`;
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up...');
    
    if (this.storybookProcess) {
      console.log('🛑 Stopping Storybook server...');
      this.storybookProcess.kill('SIGTERM');
      
      // Wait for process to exit gracefully
      await this.sleep(2000);
      
      if (!this.storybookProcess.killed) {
        this.storybookProcess.kill('SIGKILL');
      }
      
      console.log('✅ Storybook server stopped');
    }
    
    console.log('✅ Cleanup complete');
  }

  async execCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      exec(command, options, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--browser') {
      options.browser = args[++i];
    } else if (arg === '--update-baselines') {
      options.updateBaselines = true;
    } else if (arg === '--headed') {
      options.headless = false;
    } else if (arg === '--grep') {
      options.grep = args[++i];
    } else if (arg === '--no-build') {
      options.buildStorybook = false;
    } else if (arg === '--port') {
      options.storybookPort = parseInt(args[++i]);
    } else if (arg === '--serial') {
      options.parallel = false;
    } else if (arg === '--retries') {
      options.retries = parseInt(args[++i]);
    }
  }
  
  const runner = new VisualTestRunner(options);
  runner.run().catch(error => {
    console.error('❌ Visual test runner failed:', error);
    process.exit(1);
  });
}

module.exports = VisualTestRunner;