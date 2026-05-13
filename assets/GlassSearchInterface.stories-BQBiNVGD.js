import{G as o}from"./GlassSearchInterface-DTVLqfAy.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-6PHIdj5K.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DQN3cJ3X.js";import"./index-DaOI25_I.js";import"./LiquidGlassMaterial-2G5x3DpB.js";import"./LiquidGlassLayerProvider-BbZqwf9k.js";import"./a11y-BJ6VmGCi.js";import"./GlassPredictiveEngine-5-bjlLQ0.js";import"./GlassAchievementSystem-BjatmrXi.js";import"./OptimizedGlassCore-BMNTpg_C.js";import"./deviceCapabilities-EYD5uplS.js";import"./GlassBiometricAdaptation-D3RF1TY1.js";import"./MotionPreferenceContext-DHrzYxkV.js";import"./GlassEyeTracking-vqguxJe3.js";import"./GlassSpatialAudio-CT9R70tG.js";import"./MotionFramer-eYH5J7Z1.js";import"./utilsCore-AmY2pZqb.js";import"./GlassInput-CVHyflpN.js";import"./FocusTrap-Cs5pNjY6.js";import"./GlassBadge-D43JU8G4.js";import"./index-ByImX2pa.js";const F={title:"Effects + Advanced/Glass Search Interface",component:o,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasssearchinterface component."}}},argTypes:{placeholder:{control:"text",description:"Search placeholder text"},value:{control:"text",description:"Search input value"},loading:{control:"boolean",description:"Loading state"},emptyMessage:{control:"text",description:"Empty state message"}},args:{placeholder:"Search for anything...",value:"",loading:!1,emptyMessage:"No results found"}},t={args:{onChange:e(),onSearch:e()}},n={args:{results:[{id:"1",title:"Getting Started Guide",description:"Learn the basics of our platform",category:"Documentation"},{id:"2",title:"API Reference",description:"Complete API documentation",category:"Documentation"},{id:"3",title:"User Settings",description:"Manage your account preferences",category:"Settings"}],onChange:e(),onSearch:e()}},a={args:{filters:{type:[{id:"docs",label:"Documentation",value:"docs",count:25},{id:"api",label:"API",value:"api",count:12},{id:"settings",label:"Settings",value:"settings",count:8}],status:[{id:"active",label:"Active",value:"active",count:30},{id:"draft",label:"Draft",value:"draft",count:15}]},onChange:e(),onSearch:e(),onFiltersChange:e()}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    onChange: fn(),
    onSearch: fn()
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    results: [{
      id: '1',
      title: 'Getting Started Guide',
      description: 'Learn the basics of our platform',
      category: 'Documentation'
    }, {
      id: '2',
      title: 'API Reference',
      description: 'Complete API documentation',
      category: 'Documentation'
    }, {
      id: '3',
      title: 'User Settings',
      description: 'Manage your account preferences',
      category: 'Settings'
    }],
    onChange: fn(),
    onSearch: fn()
  }
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    filters: {
      type: [{
        id: 'docs',
        label: 'Documentation',
        value: 'docs',
        count: 25
      }, {
        id: 'api',
        label: 'API',
        value: 'api',
        count: 12
      }, {
        id: 'settings',
        label: 'Settings',
        value: 'settings',
        count: 8
      }],
      status: [{
        id: 'active',
        label: 'Active',
        value: 'active',
        count: 30
      }, {
        id: 'draft',
        label: 'Draft',
        value: 'draft',
        count: 15
      }]
    },
    onChange: fn(),
    onSearch: fn(),
    onFiltersChange: fn()
  }
}`,...a.parameters?.docs?.source}}};const M=["Default","WithResults","WithFilters"];export{t as Default,a as WithFilters,n as WithResults,M as __namedExportsOrder,F as default};
