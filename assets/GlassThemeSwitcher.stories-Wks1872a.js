import{G as a}from"./GlassThemeSwitcher-Di_X-xqn.js";import{f as r}from"./index-CLSxArU-.js";import"./iframe-Ddb4tVEK.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CIGS6Uos.js";import"./MotionFramer-BQlEmU1w.js";import"./utilsCore-DCiYDi1n.js";import"./GlassCard-DSQMh49w.js";import"./LiquidGlassMaterial-CJVSwNtK.js";import"./LiquidGlassLayerProvider-NQCydaKh.js";import"./OptimizedGlassCore-ac4MFqVE.js";import"./palette-DOxa6mA4.js";import"./createLucideIcon-ArTIMtiF.js";import"./GlassButton-CJ332-qo.js";import"./index-DAiHXfhF.js";import"./GlassPredictiveEngine-C8g_o_9w.js";import"./GlassAchievementSystem-DHCvT44W.js";import"./GlassBiometricAdaptation-BVXLOW49.js";import"./MotionPreferenceContext-BplUqfQw.js";import"./GlassEyeTracking-C03ckNec.js";import"./GlassSpatialAudio-6GnWgsuk.js";import"./settings-bzoe8n5M.js";import"./sun-qOtA4oqt.js";import"./moon-DdJLZ53T.js";import"./monitor-7lBzBARG.js";import"./check-DIswTf9g.js";import"./eye-BJadP0gy.js";import"./save-B10af9ol.js";import"./index-ByImX2pa.js";const F={title:"Components/Interactive/GlassThemeSwitcher",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassthemeswitcher component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"},currentTheme:{control:"text",description:"Current theme ID"},enableSystemTheme:{control:"boolean",description:"Enable system theme detection"},showPreview:{control:"boolean",description:"Show theme preview"},compact:{control:"boolean",description:"Compact mode"}},args:{className:"",currentTheme:"light",enableSystemTheme:!0,showPreview:!0,compact:!1}},e={args:{themes:[{id:"ocean",name:"Ocean Blue",preview:{primary:"#0066cc",secondary:"#00a3cc",background:"#f0f8ff",text:"#003366"},colors:{primary:"#0066cc",secondary:"#00a3cc",accent:"#00ffcc"}},{id:"sunset",name:"Sunset Orange",preview:{primary:"#ff6b35",secondary:"#f7931e",background:"#fff5f0",text:"#8b4513"},colors:{primary:"#ff6b35",secondary:"#f7931e",accent:"#ffb627"}},{id:"forest",name:"Forest Green",preview:{primary:"#2d5a27",secondary:"#4a7c59",background:"#f0f8f0",text:"#1a3a1a"},colors:{primary:"#2d5a27",secondary:"#4a7c59",accent:"#7fb069"}}],onThemeChange:r()}},n={args:{compact:!0,themes:[{id:"minimal",name:"Minimal",preview:{primary:"#2c3e50",secondary:"#34495e",background:"var(--glass-white)",text:"#2c3e50"},colors:{primary:"#2c3e50",secondary:"#34495e",accent:"#ecf0f1"}},{id:"vibrant",name:"Vibrant",preview:{primary:"#e91e63",secondary:"#9c27b0",background:"#f3e5f5",text:"#4a148c"},colors:{primary:"#e91e63",secondary:"#9c27b0",accent:"#ff9800"}}],onThemeChange:r()}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
