#!/usr/bin/env node

/**
 * AuraGlass Production Build Script
 * 
 * This script handles the complete production build process including:
 * - TypeScript compilation
 * - Bundle optimization
 * - Asset processing
 * - Performance analysis
 * - Quality validation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BUILD_CONFIG = {
  outputDir: 'dist',
  sourceDir: 'src',
  assetsDir: 'assets',
  docsDir: 'docs',
  
  // Build targets
  targets: ['es2015', 'es2018', 'es2020'],
  
  // Bundle formats
  formats: ['esm', 'cjs', 'umd'],
  
  // Optimization settings
  minify: true,
  sourceMaps: true,
  treeshaking: true,
  
  // Quality gates
  maxBundleSize: 500 * 1024, // 500KB
  minTestCoverage: 80,
  maxTypeErrors: 0,
};

class ProductionBuilder {
  constructor() {
    this.startTime = Date.now();
    this.errors = [];
    this.warnings = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async build() {
    try {
      this.log('🚀 Starting AuraGlass production build...');
      
      // 1. Clean previous build
      await this.cleanBuild();
      
      // 2. Validate source code
      await this.validateSource();
      
      // 3. Run TypeScript compilation
      await this.compileTypeScript();
      
      // 4. Bundle for different formats
      await this.createBundles();
      
      // 5. Optimize assets
      await this.optimizeAssets();
      
      // 6. Generate documentation
      await this.generateDocs();
      
      // 7. Validate build output
      await this.validateBuild();
      
      // 8. Generate build report
      await this.generateReport();
      
      const duration = Date.now() - this.startTime;
      this.log(`🎉 Production build completed in ${duration}ms`);
      
    } catch (error) {
      this.log(`Build failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  async cleanBuild() {
    this.log('🧹 Cleaning previous build...');
    
    if (fs.existsSync(BUILD_CONFIG.outputDir)) {
      fs.rmSync(BUILD_CONFIG.outputDir, { recursive: true, force: true });
    }
    
    fs.mkdirSync(BUILD_CONFIG.outputDir, { recursive: true });
  }

  async validateSource() {
    this.log('🔍 Validating source code...');
    
    // Check TypeScript errors
    try {
      execSync('npm run typecheck', { stdio: 'pipe' });
      this.log('✅ TypeScript validation passed');
    } catch (error) {
      const output = error.stdout?.toString() || error.stderr?.toString() || '';
      const errorCount = (output.match(/error TS\d+:/g) || []).length;
      
      if (errorCount > BUILD_CONFIG.maxTypeErrors) {
        throw new Error(`TypeScript validation failed: ${errorCount} errors found`);
      } else {
        this.log(`⚠️ TypeScript validation passed with ${errorCount} minor errors`, 'warning');
      }
    }
    
    // Check linting
    try {
      execSync('npm run lint:check', { stdio: 'pipe' });
      this.log('✅ Linting validation passed');
    } catch (error) {
      this.log('⚠️ Linting issues found - continuing build', 'warning');
    }
  }

  async compileTypeScript() {
    this.log('🔨 Compiling TypeScript...');
    
    try {
      execSync('npx tsc --project tsconfig.build.json', { stdio: 'inherit' });
      this.log('✅ TypeScript compilation completed');
    } catch (error) {
      throw new Error('TypeScript compilation failed');
    }
  }

  async createBundles() {
    this.log('📦 Creating production bundles...');
    
    for (const format of BUILD_CONFIG.formats) {
      try {
        execSync(`npx rollup -c --format ${format}`, { stdio: 'pipe' });
        this.log(`✅ ${format.toUpperCase()} bundle created`);
      } catch (error) {
        this.log(`❌ Failed to create ${format} bundle`, 'error');
        this.errors.push(`Bundle creation failed for ${format}`);
      }
    }
  }

  async optimizeAssets() {
    this.log('⚡ Optimizing assets...');
    
    // Minify CSS (dependency-free: strip comments + collapse whitespace).
    const cssFiles = this.findFiles(BUILD_CONFIG.outputDir, '.css');
    for (const cssFile of cssFiles) {
      try {
        const original = fs.readFileSync(cssFile, 'utf8');
        const minified = original
          // Remove block comments.
          .replace(/\/\*[\s\S]*?\*\//g, '')
          // Collapse all runs of whitespace to a single space.
          .replace(/\s+/g, ' ')
          // Drop whitespace around structural tokens.
          .replace(/\s*([{}:;,>~+])\s*/g, '$1')
          // Remove the final semicolon before a closing brace.
          .replace(/;}/g, '}')
          .trim();
        fs.writeFileSync(cssFile, minified, 'utf8');
        const saved = original.length - minified.length;
        this.log(
          `✅ Minified ${path.basename(cssFile)} (-${saved} bytes)`
        );
      } catch (error) {
        this.log(`❌ Failed to optimize ${cssFile}`, 'error');
        this.errors.push(`CSS minification failed for ${cssFile}`);
      }
    }
    
    // Optimize images. Raster optimization (png/jpg) requires native tooling
    // (e.g. imagemin/sharp) that is intentionally not a dependency of this
    // dependency-free legacy script; those files are left untouched. SVGs are
    // optimized in-process by stripping comments and redundant whitespace.
    const imageFiles = this.findFiles(BUILD_CONFIG.outputDir, ['.png', '.jpg', '.svg']);
    for (const imageFile of imageFiles) {
      try {
        if (imageFile.endsWith('.svg')) {
          const original = fs.readFileSync(imageFile, 'utf8');
          const minified = original
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/>\s+</g, '><')
            .replace(/\s{2,}/g, ' ')
            .trim();
          fs.writeFileSync(imageFile, minified, 'utf8');
          this.log(`✅ Optimized ${path.basename(imageFile)}`);
        } else {
          // Raster image: passthrough (requires external optimizer).
          this.log(`↪️  Skipped raster ${path.basename(imageFile)} (no native optimizer)`);
        }
      } catch (error) {
        this.log(`❌ Failed to optimize ${imageFile}`, 'error');
      }
    }
  }

  async generateDocs() {
    this.log('📚 Generating documentation...');
    
    try {
      // Generate API documentation
      execSync('npx typedoc', { stdio: 'pipe' });
      this.log('✅ API documentation generated');
    } catch (error) {
      this.log('⚠️ Documentation generation failed', 'warning');
    }
  }

  async validateBuild() {
    this.log('🔍 Validating build output...');
    
    // Check bundle sizes
    const bundleFiles = this.findFiles(BUILD_CONFIG.outputDir, '.js');
    for (const bundleFile of bundleFiles) {
      const stats = fs.statSync(bundleFile);
      if (stats.size > BUILD_CONFIG.maxBundleSize) {
        this.log(`⚠️ Bundle ${path.basename(bundleFile)} exceeds size limit: ${stats.size} bytes`, 'warning');
        this.warnings.push(`Large bundle: ${bundleFile}`);
      } else {
        this.log(`✅ Bundle ${path.basename(bundleFile)}: ${stats.size} bytes`);
      }
    }
    
    // Validate exports: require the built CJS bundle and confirm it exposes a
    // non-empty set of named exports.
    try {
      const mainBundle = path.join(BUILD_CONFIG.outputDir, 'index.js');
      if (fs.existsSync(mainBundle)) {
        const exported = require(path.resolve(mainBundle));
        const exportNames = Object.keys(exported || {});
        if (exportNames.length === 0) {
          this.log('❌ Bundle has no exports', 'error');
          this.errors.push('Export validation failed: bundle exports nothing');
        } else {
          this.log(`✅ Bundle exports validated (${exportNames.length} exports)`);
        }
      }
    } catch (error) {
      this.log(`❌ Export validation failed: ${error.message}`, 'error');
      this.errors.push('Export validation failed');
    }
  }

  async generateReport() {
    this.log('📊 Generating build report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime,
      config: BUILD_CONFIG,
      errors: this.errors,
      warnings: this.warnings,
      bundles: this.getBundleInfo(),
      success: this.errors.length === 0,
    };
    
    const reportPath = path.join(BUILD_CONFIG.outputDir, 'build-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`📋 Build report saved to ${reportPath}`);
    
    if (this.errors.length > 0) {
      this.log(`❌ Build completed with ${this.errors.length} errors`, 'error');
    } else if (this.warnings.length > 0) {
      this.log(`⚠️ Build completed with ${this.warnings.length} warnings`, 'warning');
    } else {
      this.log('🎉 Build completed successfully!');
    }
  }

  findFiles(dir, extensions) {
    const files = [];
    const exts = Array.isArray(extensions) ? extensions : [extensions];
    
    function search(currentDir) {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          search(fullPath);
        } else if (exts.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    }
    
    if (fs.existsSync(dir)) {
      search(dir);
    }
    
    return files;
  }

  getBundleInfo() {
    const bundles = {};
    const bundleFiles = this.findFiles(BUILD_CONFIG.outputDir, '.js');
    
    for (const bundleFile of bundleFiles) {
      const stats = fs.statSync(bundleFile);
      const name = path.basename(bundleFile);
      
      bundles[name] = {
        path: bundleFile,
        size: stats.size,
        gzipSize: this.estimateGzipSize(bundleFile),
      };
    }
    
    return bundles;
  }

  estimateGzipSize(filePath) {
    // Rough gzip size estimation (actual gzip would be more accurate)
    const content = fs.readFileSync(filePath, 'utf8');
    return Math.round(content.length * 0.3); // Rough estimate
  }
}

// Run build if this script is executed directly
if (require.main === module) {
  const builder = new ProductionBuilder();
  builder.build().catch(error => {
    console.error('Build failed:', error);
    process.exit(1);
  });
}

module.exports = ProductionBuilder;
