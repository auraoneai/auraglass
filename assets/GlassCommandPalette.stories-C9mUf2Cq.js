import{G as o}from"./GlassCommandPalette-BCfcpw9I.js";import"./iframe-BjV92FSR.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-Ckai86nv.js";import"./LiquidGlassMaterial-Bj4PBC7I.js";import"./LiquidGlassLayerProvider-Cq7ycL3s.js";import"./a11y-kNhoBw9e.js";import"./GlassPredictiveEngine-DZFJo3D3.js";import"./GlassAchievementSystem-Dus2-krE.js";import"./OptimizedGlassCore-Bqu41MF1.js";import"./deviceCapabilities-ClwxliFj.js";import"./GlassBiometricAdaptation-Eovjk73q.js";import"./MotionPreferenceContext-BG4aCwj4.js";import"./GlassEyeTracking-D4ifIfW6.js";import"./GlassSpatialAudio-DKz9F0lE.js";import"./MotionFramer-BZnRhQt9.js";import"./utilsCore-Azu7rNdH.js";import"./GlassBadge-Ck7m31Fh.js";import"./GlassInput-C810WblG.js";const y={title:"Effects + Advanced/Glass Command Palette",component:o,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasscommandpalette component."}}},argTypes:{open:{control:"boolean",description:"Whether the palette is open"},placeholder:{control:"text",description:"Search placeholder text"}},args:{open:!0,placeholder:"Search commands..."}},e={args:{items:[{id:"1",label:"New File",description:"Create a new file",action:()=>console.log("New File"),category:"File",shortcut:"Ctrl+N"},{id:"2",label:"Open File",description:"Open an existing file",action:()=>console.log("Open File"),category:"File",shortcut:"Ctrl+O"},{id:"3",label:"Save",description:"Save current file",action:()=>console.log("Save"),category:"File",shortcut:"Ctrl+S"},{id:"4",label:"Search",description:"Search in files",action:()=>console.log("Search"),category:"Navigation",shortcut:"Ctrl+F"},{id:"5",label:"Settings",description:"Open settings",action:()=>console.log("Settings"),category:"Application",shortcut:"Ctrl+,"}]}},t={args:{groups:[{id:"file",label:"File Operations",items:[{id:"new",label:"New File",description:"Create a new file",action:()=>console.log("New File"),shortcut:"Ctrl+N"},{id:"open",label:"Open File",description:"Open an existing file",action:()=>console.log("Open File"),shortcut:"Ctrl+O"}]},{id:"edit",label:"Edit",items:[{id:"copy",label:"Copy",description:"Copy selection",action:()=>console.log("Copy"),shortcut:"Ctrl+C"},{id:"paste",label:"Paste",description:"Paste from clipboard",action:()=>console.log("Paste"),shortcut:"Ctrl+V"}]}]}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: '1',
      label: 'New File',
      description: 'Create a new file',
      action: () => console.log('New File'),
      category: 'File',
      shortcut: 'Ctrl+N'
    }, {
      id: '2',
      label: 'Open File',
      description: 'Open an existing file',
      action: () => console.log('Open File'),
      category: 'File',
      shortcut: 'Ctrl+O'
    }, {
      id: '3',
      label: 'Save',
      description: 'Save current file',
      action: () => console.log('Save'),
      category: 'File',
      shortcut: 'Ctrl+S'
    }, {
      id: '4',
      label: 'Search',
      description: 'Search in files',
      action: () => console.log('Search'),
      category: 'Navigation',
      shortcut: 'Ctrl+F'
    }, {
      id: '5',
      label: 'Settings',
      description: 'Open settings',
      action: () => console.log('Settings'),
      category: 'Application',
      shortcut: 'Ctrl+,'
    }]
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    groups: [{
      id: 'file',
      label: 'File Operations',
      items: [{
        id: 'new',
        label: 'New File',
        description: 'Create a new file',
        action: () => console.log('New File'),
        shortcut: 'Ctrl+N'
      }, {
        id: 'open',
        label: 'Open File',
        description: 'Open an existing file',
        action: () => console.log('Open File'),
        shortcut: 'Ctrl+O'
      }]
    }, {
      id: 'edit',
      label: 'Edit',
      items: [{
        id: 'copy',
        label: 'Copy',
        description: 'Copy selection',
        action: () => console.log('Copy'),
        shortcut: 'Ctrl+C'
      }, {
        id: 'paste',
        label: 'Paste',
        description: 'Paste from clipboard',
        action: () => console.log('Paste'),
        shortcut: 'Ctrl+V'
      }]
    }]
  }
}`,...t.parameters?.docs?.source}}};const w=["Default","WithGroups"];export{e as Default,t as WithGroups,w as __namedExportsOrder,y as default};
