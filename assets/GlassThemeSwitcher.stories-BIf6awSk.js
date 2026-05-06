import{G as a}from"./GlassThemeSwitcher-BRQTlKlo.js";import{f as r}from"./index-CLSxArU-.js";import"./iframe-C2Py7iTP.js";import"./preload-helper-PPVm8Dsz.js";import"./index-NWP6snvF.js";import"./MotionFramer-Bqa_dH4n.js";import"./utilsCore-DHlzAtb4.js";import"./GlassCard-CxFK8dmK.js";import"./LiquidGlassMaterial-CmfeHEzl.js";import"./LiquidGlassLayerProvider-DpzmTZb0.js";import"./OptimizedGlassCore-xEcyrF8U.js";import"./palette-DPowd3Gz.js";import"./createLucideIcon-DYSTPsPi.js";import"./GlassButton-DyQ1uYYO.js";import"./index-BO6jdYrs.js";import"./GlassPredictiveEngine-ZsWyIufl.js";import"./GlassAchievementSystem-DjbL6xVt.js";import"./GlassBiometricAdaptation-A7cjmcue.js";import"./MotionPreferenceContext-DOVeBjOR.js";import"./GlassEyeTracking-CyJl1QCH.js";import"./GlassSpatialAudio-BXD-nyUP.js";import"./settings-CsBUE_pl.js";import"./sun-BkOSNnMp.js";import"./moon-BkEn5Jgt.js";import"./monitor-M-odo9GL.js";import"./check-Ck9kkIKS.js";import"./eye-CdA3CSad.js";import"./save-Dlt9m4T6.js";import"./index-ByImX2pa.js";const F={title:"Components/Interactive/GlassThemeSwitcher",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassthemeswitcher component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"},currentTheme:{control:"text",description:"Current theme ID"},enableSystemTheme:{control:"boolean",description:"Enable system theme detection"},showPreview:{control:"boolean",description:"Show theme preview"},compact:{control:"boolean",description:"Compact mode"}},args:{className:"",currentTheme:"light",enableSystemTheme:!0,showPreview:!0,compact:!1}},e={args:{themes:[{id:"ocean",name:"Ocean Blue",preview:{primary:"#0066cc",secondary:"#00a3cc",background:"#f0f8ff",text:"#003366"},colors:{primary:"#0066cc",secondary:"#00a3cc",accent:"#00ffcc"}},{id:"sunset",name:"Sunset Orange",preview:{primary:"#ff6b35",secondary:"#f7931e",background:"#fff5f0",text:"#8b4513"},colors:{primary:"#ff6b35",secondary:"#f7931e",accent:"#ffb627"}},{id:"forest",name:"Forest Green",preview:{primary:"#2d5a27",secondary:"#4a7c59",background:"#f0f8f0",text:"#1a3a1a"},colors:{primary:"#2d5a27",secondary:"#4a7c59",accent:"#7fb069"}}],onThemeChange:r()}},n={args:{compact:!0,themes:[{id:"minimal",name:"Minimal",preview:{primary:"#2c3e50",secondary:"#34495e",background:"var(--glass-white)",text:"#2c3e50"},colors:{primary:"#2c3e50",secondary:"#34495e",accent:"#ecf0f1"}},{id:"vibrant",name:"Vibrant",preview:{primary:"#e91e63",secondary:"#9c27b0",background:"#f3e5f5",text:"#4a148c"},colors:{primary:"#e91e63",secondary:"#9c27b0",accent:"#ff9800"}}],onThemeChange:r()}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
