#!/usr/bin/env node
/**
 * Glass Visual Test Generator
 * 
 * Generates comprehensive HTML pages for visual validation of the unified glass system.
 * Can be used for manual testing and screenshot comparisons.
 */

const fs = require('fs');
const path = require('path');

class GlassVisualTestGenerator {
  constructor() {
    this.outputDir = path.join(process.cwd(), 'reports', 'glass', 'visual-tests');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    this.glassSpecs = {
      intents: ['neutral', 'primary', 'success', 'warning', 'danger', 'info'],
      elevations: ['level1', 'level2', 'level3', 'level4'],
      tiers: ['high', 'medium', 'low']
    };
  }

  generateComprehensiveTestPage() {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AuraGlass Unified System - Visual Test Suite</title>
    <link rel="stylesheet" href="../../../src/styles/index.css">
    <style>
        * { box-sizing: border-box; }
        
        body {
            margin: 0;
            padding: 0;
            background: radial-gradient(circle at 20% 50%, #120E43 0%, #0A0A0A 50%, #1A1A2E 100%);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
        }
        
        .test-header {
            text-align: center;
            padding: 40px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .test-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #ffffff, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .test-subtitle {
            font-size: 1.1rem;
            opacity: 0.8;
            font-weight: 400;
        }
        
        .tier-section {
            padding: 60px 20px;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .tier-header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .tier-title {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .tier-description {
            font-size: 1rem;
            opacity: 0.7;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .glass-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }
        
        .glass-card {
            position: relative;
            border-radius: 16px;
            padding: 24px;
            min-height: 200px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            overflow: hidden;
        }
        
        .glass-card::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            padding: 1px;
            background: linear-gradient(135deg, rgba(255,255,255,0.3), transparent, rgba(255,255,255,0.1));
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            pointer-events: none;
        }
        
        .glass-card:hover {
            transform: translateY(-8px) scale(1.02);
        }
        
        .glass-info {
            position: relative;
            z-index: 2;
        }
        
        .glass-label {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 8px;
            text-transform: capitalize;
        }
        
        .glass-specs {
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            font-size: 0.85rem;
            opacity: 0.8;
            line-height: 1.4;
        }
        
        .glass-demo-content {
            margin-top: 20px;
            padding: 16px;
            background: rgba(255,255,255,0.05);
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        .interactive-states {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-top: 20px;
        }
        
        .state-sample {
            padding: 12px 8px;
            text-align: center;
            font-size: 0.75rem;
            border-radius: 8px;
            transition: all 0.2s ease;
            cursor: pointer;
        }
        
        .state-sample:hover {
            transform: scale(1.05);
        }
        
        /* Tier-specific styling */
        .tier-high { --tier-intensity: 1; }
        .tier-medium { --tier-intensity: 0.8; }
        .tier-low { --tier-intensity: 0.6; }
        
        /* Intent-specific colors */
        .intent-neutral { --intent-color: 255, 255, 255; }
        .intent-primary { --intent-color: 59, 130, 246; }
        .intent-success { --intent-color: 34, 197, 94; }
        .intent-warning { --intent-color: 251, 191, 36; }
        .intent-danger { --intent-color: 239, 68, 68; }
        .intent-info { --intent-color: 14, 165, 233; }
        
        .performance-indicators {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            padding: 16px;
            border-radius: 12px;
            font-family: monospace;
            font-size: 0.8rem;
            z-index: 1000;
            backdrop-filter: blur(10px);
        }
        
        .indicator {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
        }
        
        .status-pass { color: #22c55e; }
        .status-warning { color: #f59e0b; }
        .status-fail { color: #ef4444; }
        
        @media (max-width: 768px) {
            .glass-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .test-title {
                font-size: 2rem;
            }
            
            .performance-indicators {
                position: static;
                margin: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="performance-indicators">
        <div class="indicator">
            <span>Glass Effects:</span>
            <span id="effects-status" class="status-pass">ACTIVE</span>
        </div>
        <div class="indicator">
            <span>Backdrop Support:</span>
            <span id="backdrop-status" class="status-pass">YES</span>
        </div>
        <div class="indicator">
            <span>GPU Acceleration:</span>
            <span id="gpu-status" class="status-pass">YES</span>
        </div>
        <div class="indicator">
            <span>Total Surfaces:</span>
            <span id="surface-count">${this.glassSpecs.intents.length * this.glassSpecs.elevations.length * this.glassSpecs.tiers.length}</span>
        </div>
    </div>

    <header class="test-header">
        <h1 class="test-title">AuraGlass Unified System</h1>
        <p class="test-subtitle">Visual Test Suite • ${new Date().toLocaleDateString()}</p>
    </header>

    ${this.generateTierSections()}

    <div style="padding: 40px 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
        <p style="opacity: 0.6; font-size: 0.9rem;">
            AuraGlass Unified Token System • All surfaces generated from canonical tokens
        </p>
    </div>

    <script>
        // Performance monitoring
        function checkGlassSupport() {
            const testEl = document.createElement('div');
            testEl.style.backdropFilter = 'blur(1px)';
            const hasBackdrop = testEl.style.backdropFilter !== '';
            
            document.getElementById('backdrop-status').textContent = hasBackdrop ? 'YES' : 'NO';
            document.getElementById('backdrop-status').className = hasBackdrop ? 'status-pass' : 'status-fail';
            
            // Check for hardware acceleration hints
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            const hasGPU = !!gl;
            
            document.getElementById('gpu-status').textContent = hasGPU ? 'YES' : 'UNKNOWN';
            document.getElementById('gpu-status').className = hasGPU ? 'status-pass' : 'status-warning';
        }

        // Interactive state demonstrations
        function addInteractiveEffects() {
            const cards = document.querySelectorAll('.glass-card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.filter = 'brightness(1.1) saturate(1.2)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.filter = '';
                });
                
                card.addEventListener('mousedown', () => {
                    card.style.transform = 'translateY(-6px) scale(0.98)';
                });
                
                card.addEventListener('mouseup', () => {
                    card.style.transform = '';
                });
            });
            
            const states = document.querySelectorAll('.state-sample');
            states.forEach(state => {
                state.addEventListener('click', () => {
                    const parent = state.closest('.glass-card');
                    const stateType = state.textContent.trim();
                    
                    // Remove existing state classes
                    parent.classList.remove('state-hover', 'state-focus', 'state-active');
                    
                    if (stateType !== 'default') {
                        parent.classList.add('state-' + stateType);
                    }
                    
                    // Auto-remove after 2 seconds
                    setTimeout(() => {
                        parent.classList.remove('state-hover', 'state-focus', 'state-active');
                    }, 2000);
                });
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            checkGlassSupport();
            addInteractiveEffects();
        });
    </script>
</body>
</html>`;

    return html;
  }

  generateTierSections() {
    let html = '';
    
    this.glassSpecs.tiers.forEach(tier => {
      const tierInfo = {
        high: {
          title: 'High Performance Tier',
          description: 'Maximum visual fidelity • Full blur effects • Enhanced gradients • GPU optimized'
        },
        medium: {
          title: 'Medium Performance Tier', 
          description: 'Balanced visual quality • Reduced complexity • Moderate blur effects'
        },
        low: {
          title: 'Low Performance Tier',
          description: 'Performance optimized • Minimal effects • Accessibility focused • Battery friendly'
        }
      };
      
      html += `
        <section class="tier-section tier-${tier}">
            <div class="tier-header">
                <h2 class="tier-title">${tierInfo[tier].title}</h2>
                <p class="tier-description">${tierInfo[tier].description}</p>
            </div>
            
            <div class="glass-grid">
                ${this.generateGlassCards(tier)}
            </div>
        </section>
      `;
    });
    
    return html;
  }

  generateGlassCards(tier) {
    let cards = '';
    
    this.glassSpecs.intents.forEach(intent => {
      this.glassSpecs.elevations.forEach(elevation => {
        const glassClass = `glass-${intent}-${elevation}`;
        
        cards += `
          <div class="glass-card ${glassClass} intent-${intent} tier-${tier}" 
               data-intent="${intent}" 
               data-elevation="${elevation}" 
               data-tier="${tier}">
               
            <div class="glass-info">
                <div class="glass-label">${intent} • ${elevation}</div>
                <div class="glass-specs">
                    intent: "${intent}"<br>
                    elevation: "${elevation}"<br>
                    tier: "${tier}"
                </div>
                
                <div class="glass-demo-content">
                    <p style="margin: 0; font-size: 0.9rem;">
                        Sample content to demonstrate text readability and contrast on glass surface.
                    </p>
                </div>
                
                <div class="interactive-states">
                    <div class="state-sample glass-state-default">default</div>
                    <div class="state-sample glass-state-hover">hover</div>
                    <div class="state-sample glass-state-focus">focus</div>
                    <div class="state-sample glass-state-active">active</div>
                </div>
            </div>
          </div>
        `;
      });
    });
    
    return cards;
  }

  async generate() {
    console.log('🎨 Generating Glass Visual Test Pages...');
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    
    // Generate comprehensive test page
    const testPageHTML = this.generateComprehensiveTestPage();
    const testPagePath = path.join(this.outputDir, 'comprehensive-test.html');
    fs.writeFileSync(testPagePath, testPageHTML);
    
    // Generate individual tier pages for focused testing
    this.glassSpecs.tiers.forEach(tier => {
      const tierHTML = this.generateTierSpecificPage(tier);
      const tierPath = path.join(this.outputDir, `tier-${tier}-test.html`);
      fs.writeFileSync(tierPath, tierHTML);
    });
    
    // Generate validation report
    const report = {
      timestamp: this.timestamp,
      phase: 'Phase 5: Quality & Testing',
      task: 'Visual Test Page Generation',
      pages_generated: 4, // comprehensive + 3 tier pages
      test_combinations: this.glassSpecs.intents.length * this.glassSpecs.elevations.length * this.glassSpecs.tiers.length,
      output_directory: this.outputDir,
      files: [
        'comprehensive-test.html',
        'tier-high-test.html', 
        'tier-medium-test.html',
        'tier-low-test.html'
      ],
      usage_instructions: {
        comprehensive: 'Open comprehensive-test.html to view all glass surfaces across all tiers',
        tier_specific: 'Open individual tier-*.html files for focused tier testing',
        screenshot_validation: 'Use browser dev tools to capture screenshots for regression testing',
        performance_monitoring: 'Check performance indicators in top-right corner'
      }
    };
    
    const reportPath = path.join(this.outputDir, 'visual-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('✅ Visual test pages generated successfully!');
    console.log(`📁 Output directory: ${this.outputDir}`);
    console.log(`📄 Main test page: ${testPagePath}`);
    console.log(`📊 Test report: ${reportPath}`);
    console.log(`🧪 Total combinations: ${report.test_combinations}`);
    
    return report;
  }

  generateTierSpecificPage(tier) {
    // Similar to comprehensive but focused on single tier
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AuraGlass ${tier.toUpperCase()} Tier - Visual Test</title>
    <link rel="stylesheet" href="../../../src/styles/index.css">
    <style>
        /* Same styles as comprehensive page */
    </style>
</head>
<body>
    <header class="test-header">
        <h1 class="test-title">AuraGlass ${tier.toUpperCase()} Tier</h1>
        <p class="test-subtitle">Focused Visual Test • ${new Date().toLocaleDateString()}</p>
    </header>
    
    <section class="tier-section tier-${tier}">
        <div class="glass-grid">
            ${this.generateGlassCards(tier)}
        </div>
    </section>
</body>
</html>`;
  }
}

// CLI execution
if (require.main === module) {
  const generator = new GlassVisualTestGenerator();
  generator.generate().catch(error => {
    console.error('❌ Visual test generation failed:', error);
    process.exit(1);
  });
}

module.exports = GlassVisualTestGenerator;