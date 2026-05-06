import{G as o}from"./GlassSearchInterface-l16ZVUpR.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-OZreUAtx.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-6w9EY7YA.js";import"./index-BXuO5XkR.js";import"./LiquidGlassMaterial-6ZsmKJqk.js";import"./LiquidGlassLayerProvider-D9koVs6n.js";import"./GlassPredictiveEngine-Hj8SU_hc.js";import"./GlassAchievementSystem-CfusDed6.js";import"./OptimizedGlassCore-DAQZMOh8.js";import"./GlassBiometricAdaptation-DaD9o7IG.js";import"./MotionPreferenceContext-DTxERmBA.js";import"./GlassEyeTracking-DEo0jGT7.js";import"./GlassSpatialAudio-C984SGkY.js";import"./MotionFramer-BTsVQK94.js";import"./utilsCore-B384u8by.js";import"./GlassInput-4r6uqes7.js";import"./FocusTrap-B9obc6S4.js";import"./GlassBadge-DHG-EAfM.js";import"./index-ByImX2pa.js";const x={title:"Components/Interactive/GlassSearchInterface",component:o,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasssearchinterface component."}}},argTypes:{placeholder:{control:"text",description:"Search placeholder text"},value:{control:"text",description:"Search input value"},loading:{control:"boolean",description:"Loading state"},emptyMessage:{control:"text",description:"Empty state message"}},args:{placeholder:"Search for anything...",value:"",loading:!1,emptyMessage:"No results found"}},t={args:{onChange:e(),onSearch:e()}},n={args:{results:[{id:"1",title:"Getting Started Guide",description:"Learn the basics of our platform",category:"Documentation"},{id:"2",title:"API Reference",description:"Complete API documentation",category:"Documentation"},{id:"3",title:"User Settings",description:"Manage your account preferences",category:"Settings"}],onChange:e(),onSearch:e()}},a={args:{filters:{type:[{id:"docs",label:"Documentation",value:"docs",count:25},{id:"api",label:"API",value:"api",count:12},{id:"settings",label:"Settings",value:"settings",count:8}],status:[{id:"active",label:"Active",value:"active",count:30},{id:"draft",label:"Draft",value:"draft",count:15}]},onChange:e(),onSearch:e(),onFiltersChange:e()}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
