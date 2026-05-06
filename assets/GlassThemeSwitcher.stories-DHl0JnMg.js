import{G as a}from"./GlassThemeSwitcher-BtZb4OdD.js";import{f as r}from"./index-CLSxArU-.js";import"./iframe-mbNquNNc.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CCEq0ryW.js";import"./MotionFramer-BekP4wEp.js";import"./utilsCore-CTDrFk4s.js";import"./GlassCard-DFlQ_ghw.js";import"./LiquidGlassMaterial-D9GzyZBz.js";import"./LiquidGlassLayerProvider-DsdConQJ.js";import"./OptimizedGlassCore-CPvpl-y1.js";import"./palette-BWK5HtW2.js";import"./createLucideIcon-CpanR7Fq.js";import"./GlassButton-Dj39LQ52.js";import"./index-vu3jGQGZ.js";import"./GlassPredictiveEngine-D3b8OhcD.js";import"./GlassAchievementSystem-BuLAT0VQ.js";import"./GlassBiometricAdaptation-Cvck8KpT.js";import"./MotionPreferenceContext-BfJvNZar.js";import"./GlassEyeTracking-jVjspFjL.js";import"./GlassSpatialAudio-CRCXq6J3.js";import"./settings-Cz8atK13.js";import"./sun-MycWCa8p.js";import"./moon-Cj_AaFvd.js";import"./monitor-D1pCTb9R.js";import"./check-C_-ChHE1.js";import"./eye-AFzV83dv.js";import"./save-Dmcpz-8i.js";import"./index-ByImX2pa.js";const F={title:"Components/Interactive/GlassThemeSwitcher",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassthemeswitcher component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"},currentTheme:{control:"text",description:"Current theme ID"},enableSystemTheme:{control:"boolean",description:"Enable system theme detection"},showPreview:{control:"boolean",description:"Show theme preview"},compact:{control:"boolean",description:"Compact mode"}},args:{className:"",currentTheme:"light",enableSystemTheme:!0,showPreview:!0,compact:!1}},e={args:{themes:[{id:"ocean",name:"Ocean Blue",preview:{primary:"#0066cc",secondary:"#00a3cc",background:"#f0f8ff",text:"#003366"},colors:{primary:"#0066cc",secondary:"#00a3cc",accent:"#00ffcc"}},{id:"sunset",name:"Sunset Orange",preview:{primary:"#ff6b35",secondary:"#f7931e",background:"#fff5f0",text:"#8b4513"},colors:{primary:"#ff6b35",secondary:"#f7931e",accent:"#ffb627"}},{id:"forest",name:"Forest Green",preview:{primary:"#2d5a27",secondary:"#4a7c59",background:"#f0f8f0",text:"#1a3a1a"},colors:{primary:"#2d5a27",secondary:"#4a7c59",accent:"#7fb069"}}],onThemeChange:r()}},n={args:{compact:!0,themes:[{id:"minimal",name:"Minimal",preview:{primary:"#2c3e50",secondary:"#34495e",background:"var(--glass-white)",text:"#2c3e50"},colors:{primary:"#2c3e50",secondary:"#34495e",accent:"#ecf0f1"}},{id:"vibrant",name:"Vibrant",preview:{primary:"#e91e63",secondary:"#9c27b0",background:"#f3e5f5",text:"#4a148c"},colors:{primary:"#e91e63",secondary:"#9c27b0",accent:"#ff9800"}}],onThemeChange:r()}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
