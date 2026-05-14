import{G as o}from"./GlassCommandPalette-Cf8htQ97.js";import"./iframe-D2N3vCdj.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DADGQ5u1.js";import"./LiquidGlassMaterial-Y3bF4vfX.js";import"./LiquidGlassLayerProvider-DuyeeDou.js";import"./a11y-NWIw7uLP.js";import"./GlassPredictiveEngine-DsRdSIEV.js";import"./GlassAchievementSystem-CRVBaZaX.js";import"./OptimizedGlassCore-Cfx2wP22.js";import"./deviceCapabilities-BiFtu_BJ.js";import"./GlassBiometricAdaptation-G6oWNKvq.js";import"./MotionPreferenceContext-CrXN3CiK.js";import"./GlassEyeTracking-BLN3AOs1.js";import"./GlassSpatialAudio-P8l215F-.js";import"./MotionFramer-BTHpoTOv.js";import"./utilsCore-ChCm-RwF.js";import"./GlassBadge-CkwdaCec.js";import"./GlassInput-C0qnkS_Y.js";const y={title:"Effects + Advanced/Glass Command Palette",component:o,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasscommandpalette component."}}},argTypes:{open:{control:"boolean",description:"Whether the palette is open"},placeholder:{control:"text",description:"Search placeholder text"}},args:{open:!0,placeholder:"Search commands..."}},e={args:{items:[{id:"1",label:"New File",description:"Create a new file",action:()=>console.log("New File"),category:"File",shortcut:"Ctrl+N"},{id:"2",label:"Open File",description:"Open an existing file",action:()=>console.log("Open File"),category:"File",shortcut:"Ctrl+O"},{id:"3",label:"Save",description:"Save current file",action:()=>console.log("Save"),category:"File",shortcut:"Ctrl+S"},{id:"4",label:"Search",description:"Search in files",action:()=>console.log("Search"),category:"Navigation",shortcut:"Ctrl+F"},{id:"5",label:"Settings",description:"Open settings",action:()=>console.log("Settings"),category:"Application",shortcut:"Ctrl+,"}]}},t={args:{groups:[{id:"file",label:"File Operations",items:[{id:"new",label:"New File",description:"Create a new file",action:()=>console.log("New File"),shortcut:"Ctrl+N"},{id:"open",label:"Open File",description:"Open an existing file",action:()=>console.log("Open File"),shortcut:"Ctrl+O"}]},{id:"edit",label:"Edit",items:[{id:"copy",label:"Copy",description:"Copy selection",action:()=>console.log("Copy"),shortcut:"Ctrl+C"},{id:"paste",label:"Paste",description:"Paste from clipboard",action:()=>console.log("Paste"),shortcut:"Ctrl+V"}]}]}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
