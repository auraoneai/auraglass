import{G as o}from"./GlassSearchInterface-BNKg3ScE.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-LB2Lfhgp.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BB_LiVtS.js";import"./index-DCQcgPGK.js";import"./LiquidGlassMaterial-O4aHTI2D.js";import"./LiquidGlassLayerProvider-DEWz-jJN.js";import"./a11y-DBdyTOMI.js";import"./GlassPredictiveEngine-nHzYrt40.js";import"./GlassAchievementSystem-C7yLUSqC.js";import"./OptimizedGlassCore-Bt3saaFo.js";import"./deviceCapabilities-DKKFd1VE.js";import"./GlassBiometricAdaptation-CUjpLWNp.js";import"./MotionPreferenceContext-CGVERj_F.js";import"./GlassEyeTracking-d4dXQVzJ.js";import"./GlassSpatialAudio-Cjoio7Yg.js";import"./MotionFramer-CR_bXaKW.js";import"./utilsCore-iKIe4RkQ.js";import"./GlassInput-DEM96GjC.js";import"./FocusTrap-DbeTyZk9.js";import"./GlassBadge-ByIXsep2.js";import"./index-ByImX2pa.js";const F={title:"Effects + Advanced/Glass Search Interface",component:o,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasssearchinterface component."}}},argTypes:{placeholder:{control:"text",description:"Search placeholder text"},value:{control:"text",description:"Search input value"},loading:{control:"boolean",description:"Loading state"},emptyMessage:{control:"text",description:"Empty state message"}},args:{placeholder:"Search for anything...",value:"",loading:!1,emptyMessage:"No results found"}},t={args:{onChange:e(),onSearch:e()}},n={args:{results:[{id:"1",title:"Getting Started Guide",description:"Learn the basics of our platform",category:"Documentation"},{id:"2",title:"API Reference",description:"Complete API documentation",category:"Documentation"},{id:"3",title:"User Settings",description:"Manage your account preferences",category:"Settings"}],onChange:e(),onSearch:e()}},a={args:{filters:{type:[{id:"docs",label:"Documentation",value:"docs",count:25},{id:"api",label:"API",value:"api",count:12},{id:"settings",label:"Settings",value:"settings",count:8}],status:[{id:"active",label:"Active",value:"active",count:30},{id:"draft",label:"Draft",value:"draft",count:15}]},onChange:e(),onSearch:e(),onFiltersChange:e()}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
