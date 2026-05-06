import{G as o}from"./GlassSearchInterface-1N66bVNX.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-rcK9Xf1b.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-B7wlFxfc.js";import"./index-SHVQWzfF.js";import"./LiquidGlassMaterial-B5rEZqMl.js";import"./LiquidGlassLayerProvider-BIHgxTaw.js";import"./GlassPredictiveEngine-CVTNJ8qr.js";import"./GlassAchievementSystem-DYlVdNF6.js";import"./OptimizedGlassCore-BtDfN8Ts.js";import"./GlassBiometricAdaptation-BGrhrjU2.js";import"./MotionPreferenceContext-mQDtMATf.js";import"./GlassEyeTracking-Bnvi94mr.js";import"./GlassSpatialAudio-6tN9NdIH.js";import"./MotionFramer-D0-HiDbD.js";import"./utilsCore-jun4nkmH.js";import"./GlassInput-DCwwIH2O.js";import"./FocusTrap-DMlyr3O_.js";import"./GlassBadge-Cvpm4dp-.js";import"./index-ByImX2pa.js";const x={title:"Components/Interactive/GlassSearchInterface",component:o,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasssearchinterface component."}}},argTypes:{placeholder:{control:"text",description:"Search placeholder text"},value:{control:"text",description:"Search input value"},loading:{control:"boolean",description:"Loading state"},emptyMessage:{control:"text",description:"Empty state message"}},args:{placeholder:"Search for anything...",value:"",loading:!1,emptyMessage:"No results found"}},t={args:{onChange:e(),onSearch:e()}},n={args:{results:[{id:"1",title:"Getting Started Guide",description:"Learn the basics of our platform",category:"Documentation"},{id:"2",title:"API Reference",description:"Complete API documentation",category:"Documentation"},{id:"3",title:"User Settings",description:"Manage your account preferences",category:"Settings"}],onChange:e(),onSearch:e()}},a={args:{filters:{type:[{id:"docs",label:"Documentation",value:"docs",count:25},{id:"api",label:"API",value:"api",count:12},{id:"settings",label:"Settings",value:"settings",count:8}],status:[{id:"active",label:"Active",value:"active",count:30},{id:"draft",label:"Draft",value:"draft",count:15}]},onChange:e(),onSearch:e(),onFiltersChange:e()}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};const P=["Default","WithResults","WithFilters"];export{t as Default,a as WithFilters,n as WithResults,P as __namedExportsOrder,x as default};
