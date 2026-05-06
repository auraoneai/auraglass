#!/usr/bin/env node

/**
 * TEST SPECIFIC COMPONENTS
 * 
 * Tests only the components that were mentioned as crashing:
 * - TreeItem (context error)
 * - GlassAccordion (undefined.map)
 * - Any other components the user reports
 */

const { execSync } = require('child_process');

console.log('🧪 TESTING SPECIFIC COMPONENTS THAT WERE CRASHING');
console.log('================================================\n');

const problematicComponents = [
  'TreeItem',
  'GlassAccordion', 
  'GlassBarChart',
  'GlassLineChart', 
  'GlassPieChart',
  'GlassAreaChart'
];

let allPassed = true;

problematicComponents.forEach(component => {
  try {
    console.log(`🔍 Testing ${component}...`);
    
    // Try to build just this component's story
    execSync(`npm run build-storybook -- --only-story-files="**/${component}.stories.*" --quiet`, { 
      stdio: 'pipe',
      timeout: 30000 
    });
    
    console.log(`✅ ${component} - BUILD SUCCESSFUL`);
    
  } catch (error) {
    console.log(`❌ ${component} - BUILD FAILED`);
    const output = error.stdout?.toString() || error.message;
    if (output.includes('TreeItem must be used within a TreeView')) {
      console.log('   Error: Context provider missing');
    } else if (output.includes('Cannot read properties of undefined')) {
      console.log('   Error: Undefined data access');
    } else {
      console.log(`   Error: ${output.split('\n')[0]}`);
    }
    allPassed = false;
  }
  
  console.log('');
});

console.log(`📊 RESULTS`);
console.log(`=========`);

if (allPassed) {
  console.log('🎉 ALL TESTED COMPONENTS PASSED!');
  console.log('Your specific crash issues should be resolved.');
} else {
  console.log('❌ Some components still have issues');
  console.log('More fixes needed for complete success.');
}
