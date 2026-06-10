import{G as o}from"./GlassCommandPalette-DiReTxi2.js";import"./iframe-DuFCckax.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DDzmL2zF.js";import"./LiquidGlassMaterial-Cfs6Tlc8.js";import"./LiquidGlassLayerProvider-5FQsJWNj.js";import"./a11y-BVXyQ8aU.js";import"./GlassPredictiveEngine-Ci4rC9p_.js";import"./GlassAchievementSystem-BEHFsrBx.js";import"./OptimizedGlassCore-Dfu3jw2K.js";import"./deviceCapabilities-8v_R2xci.js";import"./GlassBiometricAdaptation-Bp-PMjOH.js";import"./MotionPreferenceContext-BLXtcDKN.js";import"./GlassEyeTracking-dCkUfXF5.js";import"./GlassSpatialAudio-oo5EQ7tC.js";import"./MotionFramer-1yHy_OeU.js";import"./utilsCore-D4-BhdPx.js";import"./GlassBadge-Csrrfua_.js";import"./GlassInput-D64At9Ik.js";const y={title:"Effects + Advanced/Glass Command Palette",component:o,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasscommandpalette component."}}},argTypes:{open:{control:"boolean",description:"Whether the palette is open"},placeholder:{control:"text",description:"Search placeholder text"}},args:{open:!0,placeholder:"Search commands..."}},e={args:{items:[{id:"1",label:"New File",description:"Create a new file",action:()=>console.log("New File"),category:"File",shortcut:"Ctrl+N"},{id:"2",label:"Open File",description:"Open an existing file",action:()=>console.log("Open File"),category:"File",shortcut:"Ctrl+O"},{id:"3",label:"Save",description:"Save current file",action:()=>console.log("Save"),category:"File",shortcut:"Ctrl+S"},{id:"4",label:"Search",description:"Search in files",action:()=>console.log("Search"),category:"Navigation",shortcut:"Ctrl+F"},{id:"5",label:"Settings",description:"Open settings",action:()=>console.log("Settings"),category:"Application",shortcut:"Ctrl+,"}]}},t={args:{groups:[{id:"file",label:"File Operations",items:[{id:"new",label:"New File",description:"Create a new file",action:()=>console.log("New File"),shortcut:"Ctrl+N"},{id:"open",label:"Open File",description:"Open an existing file",action:()=>console.log("Open File"),shortcut:"Ctrl+O"}]},{id:"edit",label:"Edit",items:[{id:"copy",label:"Copy",description:"Copy selection",action:()=>console.log("Copy"),shortcut:"Ctrl+C"},{id:"paste",label:"Paste",description:"Paste from clipboard",action:()=>console.log("Paste"),shortcut:"Ctrl+V"}]}]}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
