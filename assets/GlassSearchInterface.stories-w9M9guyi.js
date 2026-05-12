import{G as o}from"./GlassSearchInterface-CyqpvgZE.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-D5XNSE8t.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BOFlydal.js";import"./index-C5YfwLuS.js";import"./LiquidGlassMaterial-PIWApLWo.js";import"./LiquidGlassLayerProvider-Cctd_86z.js";import"./a11y-BFAoh2ff.js";import"./GlassPredictiveEngine-z1M3s8P_.js";import"./GlassAchievementSystem-DddBzQgy.js";import"./OptimizedGlassCore-CXfAtOX-.js";import"./deviceCapabilities-QhTB8XNW.js";import"./GlassBiometricAdaptation-CNbD9aRM.js";import"./MotionPreferenceContext-BsYtSTuz.js";import"./GlassEyeTracking-XfaAeBCk.js";import"./GlassSpatialAudio-dtj1_O9L.js";import"./MotionFramer-BJ26b83I.js";import"./utilsCore-BoSRIG9I.js";import"./GlassInput-CQRhgWVw.js";import"./FocusTrap-BmacVBPG.js";import"./GlassBadge-DxRjjPhy.js";import"./index-ByImX2pa.js";const F={title:"Effects + Advanced/Glass Search Interface",component:o,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasssearchinterface component."}}},argTypes:{placeholder:{control:"text",description:"Search placeholder text"},value:{control:"text",description:"Search input value"},loading:{control:"boolean",description:"Loading state"},emptyMessage:{control:"text",description:"Empty state message"}},args:{placeholder:"Search for anything...",value:"",loading:!1,emptyMessage:"No results found"}},t={args:{onChange:e(),onSearch:e()}},n={args:{results:[{id:"1",title:"Getting Started Guide",description:"Learn the basics of our platform",category:"Documentation"},{id:"2",title:"API Reference",description:"Complete API documentation",category:"Documentation"},{id:"3",title:"User Settings",description:"Manage your account preferences",category:"Settings"}],onChange:e(),onSearch:e()}},a={args:{filters:{type:[{id:"docs",label:"Documentation",value:"docs",count:25},{id:"api",label:"API",value:"api",count:12},{id:"settings",label:"Settings",value:"settings",count:8}],status:[{id:"active",label:"Active",value:"active",count:30},{id:"draft",label:"Draft",value:"draft",count:15}]},onChange:e(),onSearch:e(),onFiltersChange:e()}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
