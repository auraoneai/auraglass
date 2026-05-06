import{G as a}from"./GlassThemeSwitcher-DDP51czg.js";import{f as r}from"./index-CLSxArU-.js";import"./iframe-BEVTBSqr.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DiIsfFHC.js";import"./MotionFramer-xTbOeNdo.js";import"./utilsCore-DpNKUJXO.js";import"./GlassCard-CsfKKOo6.js";import"./LiquidGlassMaterial-D5p4jx7m.js";import"./LiquidGlassLayerProvider-h5jHUths.js";import"./OptimizedGlassCore-BMFMzxVt.js";import"./palette-DPD46qmZ.js";import"./createLucideIcon-rSP2W7k9.js";import"./GlassButton-bg50TCz0.js";import"./index-CU8u3l8Y.js";import"./GlassPredictiveEngine-y5xM3Rm5.js";import"./GlassAchievementSystem-DvDrrRIP.js";import"./GlassBiometricAdaptation-BLAoJQ8Y.js";import"./MotionPreferenceContext-FWf-G1hj.js";import"./GlassEyeTracking-DQtZEr81.js";import"./GlassSpatialAudio-D9F1e_tt.js";import"./settings-TzJA7Mfk.js";import"./sun-BDkO6HYq.js";import"./moon-CswuMT55.js";import"./monitor-CSvTIMnE.js";import"./check-Bn5Y4WHs.js";import"./eye-Cb4zJhsc.js";import"./save-BCD1TJjS.js";import"./index-ByImX2pa.js";const F={title:"Components/Interactive/GlassThemeSwitcher",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassthemeswitcher component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"},currentTheme:{control:"text",description:"Current theme ID"},enableSystemTheme:{control:"boolean",description:"Enable system theme detection"},showPreview:{control:"boolean",description:"Show theme preview"},compact:{control:"boolean",description:"Compact mode"}},args:{className:"",currentTheme:"light",enableSystemTheme:!0,showPreview:!0,compact:!1}},e={args:{themes:[{id:"ocean",name:"Ocean Blue",preview:{primary:"#0066cc",secondary:"#00a3cc",background:"#f0f8ff",text:"#003366"},colors:{primary:"#0066cc",secondary:"#00a3cc",accent:"#00ffcc"}},{id:"sunset",name:"Sunset Orange",preview:{primary:"#ff6b35",secondary:"#f7931e",background:"#fff5f0",text:"#8b4513"},colors:{primary:"#ff6b35",secondary:"#f7931e",accent:"#ffb627"}},{id:"forest",name:"Forest Green",preview:{primary:"#2d5a27",secondary:"#4a7c59",background:"#f0f8f0",text:"#1a3a1a"},colors:{primary:"#2d5a27",secondary:"#4a7c59",accent:"#7fb069"}}],onThemeChange:r()}},n={args:{compact:!0,themes:[{id:"minimal",name:"Minimal",preview:{primary:"#2c3e50",secondary:"#34495e",background:"var(--glass-white)",text:"#2c3e50"},colors:{primary:"#2c3e50",secondary:"#34495e",accent:"#ecf0f1"}},{id:"vibrant",name:"Vibrant",preview:{primary:"#e91e63",secondary:"#9c27b0",background:"#f3e5f5",text:"#4a148c"},colors:{primary:"#e91e63",secondary:"#9c27b0",accent:"#ff9800"}}],onThemeChange:r()}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    themes: [{
      id: 'ocean',
      name: 'Ocean Blue',
      preview: {
        primary: '#0066cc',
        secondary: '#00a3cc',
        background: '#f0f8ff',
        text: '#003366'
      },
      colors: {
        primary: '#0066cc',
        secondary: '#00a3cc',
        accent: '#00ffcc'
      }
    }, {
      id: 'sunset',
      name: 'Sunset Orange',
      preview: {
        primary: '#ff6b35',
        secondary: '#f7931e',
        background: '#fff5f0',
        text: '#8b4513'
      },
      colors: {
        primary: '#ff6b35',
        secondary: '#f7931e',
        accent: '#ffb627'
      }
    }, {
      id: 'forest',
      name: 'Forest Green',
      preview: {
        primary: '#2d5a27',
        secondary: '#4a7c59',
        background: '#f0f8f0',
        text: '#1a3a1a'
      },
      colors: {
        primary: '#2d5a27',
        secondary: '#4a7c59',
        accent: '#7fb069'
      }
    }],
    onThemeChange: fn()
  }
}`,...e.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    compact: true,
    themes: [{
      id: 'minimal',
      name: 'Minimal',
      preview: {
        primary: '#2c3e50',
        secondary: '#34495e',
        background: 'var(--glass-white)',
        text: '#2c3e50'
      },
      colors: {
        primary: '#2c3e50',
        secondary: '#34495e',
        accent: '#ecf0f1'
      }
    }, {
      id: 'vibrant',
      name: 'Vibrant',
      preview: {
        primary: '#e91e63',
        secondary: '#9c27b0',
        background: '#f3e5f5',
        text: '#4a148c'
      },
      colors: {
        primary: '#e91e63',
        secondary: '#9c27b0',
        accent: '#ff9800'
      }
    }],
    onThemeChange: fn()
  }
}`,...n.parameters?.docs?.source}}};const I=["Default","CompactMode"];export{n as CompactMode,e as Default,I as __namedExportsOrder,F as default};
