#!/usr/bin/env node
/**
 * AuraGlass Visual Regression Screenshot System
 * 
 * Captures screenshots of all glass surface combinations to detect visual regressions
 * when the unified token system changes.
 * 
 * Part of Phase 5: Quality & Testing
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class GlassVisualRegression {
  constructor() {
    this.baseDir = path.join(process.cwd(), 'reports', 'glass', 'visual-regression');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.screenshotDir = path.join(this.baseDir, this.timestamp);
    
    this.glassSpecs = {
      intents: ['neutral', 'primary', 'success', 'warning', 'danger', 'info'],
      elevations: ['level1', 'level2', 'level3', 'level4'],
      tiers: ['high', 'medium', 'low'],
      states: ['default', 'hover', 'focus', 'active']
    };
  }

  async initialize() {
    console.log('🎬 Initializing Glass Visual Regression System...');
    
    // Ensure directories exist
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
    
    // Create baseline directory if it doesn't exist
    const baselineDir = path.join(this.baseDir, 'baseline');
    if (!fs.existsSync(baselineDir)) {
      fs.mkdirSync(baselineDir, { recursive: true });
    }
  }

  // Generate HTML test page with all glass combinations
  generateTestPage() {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AuraGlass Visual Regression Test</title>
    <link rel="stylesheet" href="../src/styles/index.css">
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
            font-family: system-ui, -apple-system, sans-serif;
            color: white;
            min-height: 100vh;
        }
        
        .glass-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .glass-sample {
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            min-height: 120px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            transition: all 0.3s ease;
        }
        
        .glass-sample:hover {
            transform: translateY(-5px);
        }
        
        .glass-label {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
            opacity: 0.9;
        }
        
        .glass-details {
            font-size: 12px;
            opacity: 0.7;
            font-family: monospace;
        }
        
        .tier-section {
            margin: 40px 0;
        }
        
        .tier-title {
            font-size: 24px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        
        .state-variations {
            margin-top: 20px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }
        
        .state-sample {
            padding: 10px;
            font-size: 10px;
            text-align: center;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 style="text-align: center; margin-bottom: 50px;">
            AuraGlass Visual Regression Test Suite
        </h1>
        
        ${this.generateGlassSamples()}
    </div>

    <script>
        // Import createGlassStyle and apply it to elements
        function applyGlassStyles() {
            // This would normally import from the unified system
            // For testing, we'll use CSS classes that map to our generated CSS
            console.log('Glass visual regression test page loaded');
        }
        
        document.addEventListener('DOMContentLoaded', applyGlassStyles);
    </script>
</body>
</html>`;

    const testPagePath = path.join(this.screenshotDir, 'test-page.html');
    fs.writeFileSync(testPagePath, html);
    return testPagePath;
  }

  generateGlassSamples() {
    let html = '';
    
    this.glassSpecs.tiers.forEach(tier => {
      html += `
        <div class="tier-section">
            <h2 class="tier-title">Performance Tier: ${tier.toUpperCase()}</h2>
            <div class="glass-grid">
      `;
      
      this.glassSpecs.intents.forEach(intent => {
        this.glassSpecs.elevations.forEach(elevation => {
          const glassClass = `glass-${intent}-${elevation}`;
          const tierClass = `glass-tier-${tier}`;
          
          html += `
            <div class="glass-sample ${glassClass} ${tierClass}" 
                 data-intent="${intent}" 
                 data-elevation="${elevation}" 
                 data-tier="${tier}">
                <div class="glass-label">${intent} • ${elevation}</div>
                <div class="glass-details">tier: ${tier}</div>
                
                <div class="state-variations">
                    <div class="state-sample glass-state-default">default</div>
                    <div class="state-sample glass-state-hover">hover</div>
                    <div class="state-sample glass-state-focus">focus</div>
                    <div class="state-sample glass-state-active">active</div>
                </div>
            </div>
          `;
        });
      });
      
      html += '</div></div>';
    });
    
    return html;
  }

  // Capture screenshots using Puppeteer or Playwright
  async captureScreenshots() {
    console.log('📸 Capturing glass surface screenshots...');
    
    const testPagePath = this.generateTestPage();
    console.log(`📄 Generated test page: ${testPagePath}`);
    
    try {
      // Try to use Playwright if available, fallback to Puppeteer
      await this.captureWithPlaywright(testPagePath);
    } catch (error) {
      console.log('Playwright not available, trying Puppeteer...');
      try {
        await this.captureWithPuppeteer(testPagePath);
      } catch (error2) {
        console.warn('Neither Playwright nor Puppeteer available. Installing Puppeteer...');
        await this.installAndUsePuppeteer(testPagePath);
      }
    }
  }

  async captureWithPlaywright(testPagePath) {
    const playwright = require('playwright');
    
    const browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set viewport for consistent screenshots
    await page.setViewportSize({ width: 1200, height: 800 });
    
    await page.goto(`file://${testPagePath}`);
    await page.waitForLoadState('networkidle');
    
    // Capture full page
    const fullPagePath = path.join(this.screenshotDir, 'full-page.png');
    await page.screenshot({ 
      path: fullPagePath, 
      fullPage: true,
      animations: 'disabled'
    });
    
    // Capture individual tier sections
    const tiers = ['high', 'medium', 'low'];
    for (const tier of tiers) {
      const tierSection = await page.locator(`.tier-section`).nth(tiers.indexOf(tier));
      const tierPath = path.join(this.screenshotDir, `tier-${tier}.png`);
      await tierSection.screenshot({ path: tierPath });
    }
    
    await browser.close();
    console.log('✅ Screenshots captured with Playwright');
  }

  async captureWithPuppeteer(testPagePath) {
    const puppeteer = require('puppeteer');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(`file://${testPagePath}`, { waitUntil: 'networkidle0' });
    
    // Capture full page
    const fullPagePath = path.join(this.screenshotDir, 'full-page.png');
    await page.screenshot({ 
      path: fullPagePath, 
      fullPage: true
    });
    
    // Capture individual tier sections  
    const tierSelectors = ['.tier-section:nth-child(1)', '.tier-section:nth-child(2)', '.tier-section:nth-child(3)'];
    const tierNames = ['high', 'medium', 'low'];
    
    for (let i = 0; i < tierSelectors.length; i++) {
      const element = await page.$(tierSelectors[i]);
      if (element) {
        const tierPath = path.join(this.screenshotDir, `tier-${tierNames[i]}.png`);
        await element.screenshot({ path: tierPath });
      }
    }
    
    await browser.close();
    console.log('✅ Screenshots captured with Puppeteer');
  }

  async installAndUsePuppeteer(testPagePath) {
    console.log('📦 Installing Puppeteer...');
    await execAsync('npm install puppeteer --no-save');
    await this.captureWithPuppeteer(testPagePath);
  }

  // Compare with baseline screenshots
  async compareWithBaseline() {
    console.log('🔍 Comparing with baseline screenshots...');
    
    const baselineDir = path.join(this.baseDir, 'baseline');
    const currentFiles = fs.readdirSync(this.screenshotDir).filter(f => f.endsWith('.png'));
    
    const results = [];
    
    for (const filename of currentFiles) {
      const currentPath = path.join(this.screenshotDir, filename);
      const baselinePath = path.join(baselineDir, filename);
      
      if (!fs.existsSync(baselinePath)) {
        console.log(`📋 No baseline found for ${filename}, creating baseline...`);
        fs.copyFileSync(currentPath, baselinePath);
        results.push({
          file: filename,
          status: 'baseline_created',
          message: 'New baseline screenshot created'
        });
      } else {
        // Simple file size comparison (could be enhanced with pixel-by-pixel comparison)
        const currentStats = fs.statSync(currentPath);
        const baselineStats = fs.statSync(baselinePath);
        
        const sizeDifference = Math.abs(currentStats.size - baselineStats.size);
        const sizeChangePercent = (sizeDifference / baselineStats.size) * 100;
        
        if (sizeChangePercent > 5) { // 5% threshold
          results.push({
            file: filename,
            status: 'changed',
            message: `Significant visual change detected (${sizeChangePercent.toFixed(1)}% size difference)`,
            sizeDifference,
            sizeChangePercent
          });
        } else {
          results.push({
            file: filename,
            status: 'unchanged',
            message: 'No significant visual changes detected'
          });
        }
      }
    }
    
    return results;
  }

  // Generate comparison report
  generateReport(comparisonResults) {
    const report = {
      timestamp: this.timestamp,
      phase: 'Phase 5: Quality & Testing',
      task: 'Visual Regression Screenshot System',
      screenshots: {
        captured: comparisonResults.length,
        baseline_created: comparisonResults.filter(r => r.status === 'baseline_created').length,
        unchanged: comparisonResults.filter(r => r.status === 'unchanged').length,
        changed: comparisonResults.filter(r => r.status === 'changed').length
      },
      details: comparisonResults,
      glassSpecs: this.glassSpecs,
      screenshotDirectory: this.screenshotDir
    };
    
    const reportPath = path.join(this.screenshotDir, 'visual-regression-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📊 Visual regression report generated:');
    console.log(`   📁 Screenshots: ${this.screenshotDir}`);
    console.log(`   📄 Report: ${reportPath}`);
    console.log(`   📸 Captured: ${report.screenshots.captured} screenshots`);
    console.log(`   📋 New baselines: ${report.screenshots.baseline_created}`);
    console.log(`   ✅ Unchanged: ${report.screenshots.unchanged}`);
    console.log(`   ⚠️  Changed: ${report.screenshots.changed}`);
    
    return report;
  }

  async run() {
    try {
      await this.initialize();
      await this.captureScreenshots();
      const comparisonResults = await this.compareWithBaseline();
      const report = this.generateReport(comparisonResults);
      
      console.log('✅ Visual regression system completed successfully!');
      
      // Return exit code based on results
      const hasChanges = comparisonResults.some(r => r.status === 'changed');
      if (hasChanges) {
        console.log('⚠️  Visual changes detected - review required');
        return 1;
      }
      
      return 0;
      
    } catch (error) {
      console.error('❌ Visual regression system failed:', error);
      return 1;
    }
  }
}

// CLI execution
if (require.main === module) {
  const visualRegression = new GlassVisualRegression();
  visualRegression.run().then(exitCode => {
    process.exit(exitCode);
  }).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = GlassVisualRegression;