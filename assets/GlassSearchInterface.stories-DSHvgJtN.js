import{G as o}from"./GlassSearchInterface-CHuSUOvs.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-BvzymGjt.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BVHfBqfh.js";import"./index-JwCOk9wq.js";import"./LiquidGlassMaterial-JI_jzYet.js";import"./LiquidGlassLayerProvider-CJtka88e.js";import"./a11y-DPdpkR3m.js";import"./GlassPredictiveEngine-Dz7LnWwV.js";import"./GlassAchievementSystem-CKBD-Gym.js";import"./OptimizedGlassCore-B02J0fwe.js";import"./deviceCapabilities-B7YDzcww.js";import"./GlassBiometricAdaptation-D9YF3poe.js";import"./MotionPreferenceContext-DOLWeM-v.js";import"./GlassEyeTracking-D9jSxkg9.js";import"./GlassSpatialAudio-DHSENIRo.js";import"./MotionFramer-C3KXdYVW.js";import"./utilsCore-CvMw9IQa.js";import"./GlassInput-BlBLQvFV.js";import"./FocusTrap-DqLy_MM6.js";import"./GlassBadge-CPq0Smf-.js";import"./index-ByImX2pa.js";const F={title:"Effects + Advanced/Glass Search Interface",component:o,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasssearchinterface component."}}},argTypes:{placeholder:{control:"text",description:"Search placeholder text"},value:{control:"text",description:"Search input value"},loading:{control:"boolean",description:"Loading state"},emptyMessage:{control:"text",description:"Empty state message"}},args:{placeholder:"Search for anything...",value:"",loading:!1,emptyMessage:"No results found"}},t={args:{onChange:e(),onSearch:e()}},n={args:{results:[{id:"1",title:"Getting Started Guide",description:"Learn the basics of our platform",category:"Documentation"},{id:"2",title:"API Reference",description:"Complete API documentation",category:"Documentation"},{id:"3",title:"User Settings",description:"Manage your account preferences",category:"Settings"}],onChange:e(),onSearch:e()}},a={args:{filters:{type:[{id:"docs",label:"Documentation",value:"docs",count:25},{id:"api",label:"API",value:"api",count:12},{id:"settings",label:"Settings",value:"settings",count:8}],status:[{id:"active",label:"Active",value:"active",count:30},{id:"draft",label:"Draft",value:"draft",count:15}]},onChange:e(),onSearch:e(),onFiltersChange:e()}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
