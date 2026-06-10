import{G as o}from"./GlassSearchInterface-CgYXda38.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-DuFCckax.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DDzmL2zF.js";import"./LiquidGlassMaterial-Cfs6Tlc8.js";import"./LiquidGlassLayerProvider-5FQsJWNj.js";import"./a11y-BVXyQ8aU.js";import"./GlassPredictiveEngine-Ci4rC9p_.js";import"./GlassAchievementSystem-BEHFsrBx.js";import"./OptimizedGlassCore-Dfu3jw2K.js";import"./deviceCapabilities-8v_R2xci.js";import"./GlassBiometricAdaptation-Bp-PMjOH.js";import"./MotionPreferenceContext-BLXtcDKN.js";import"./GlassEyeTracking-dCkUfXF5.js";import"./GlassSpatialAudio-oo5EQ7tC.js";import"./MotionFramer-1yHy_OeU.js";import"./utilsCore-D4-BhdPx.js";import"./GlassInput-D64At9Ik.js";import"./FocusTrap-DF3urQpi.js";import"./GlassBadge-Csrrfua_.js";import"./index-ByImX2pa.js";const P={title:"Effects + Advanced/Glass Search Interface",component:o,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasssearchinterface component."}}},argTypes:{placeholder:{control:"text",description:"Search placeholder text"},value:{control:"text",description:"Search input value"},loading:{control:"boolean",description:"Loading state"},emptyMessage:{control:"text",description:"Empty state message"}},args:{placeholder:"Search for anything...",value:"",loading:!1,emptyMessage:"No results found"}},t={args:{onChange:e(),onSearch:e()}},n={args:{results:[{id:"1",title:"Getting Started Guide",description:"Learn the basics of our platform",category:"Documentation"},{id:"2",title:"API Reference",description:"Complete API documentation",category:"Documentation"},{id:"3",title:"User Settings",description:"Manage your account preferences",category:"Settings"}],onChange:e(),onSearch:e()}},a={args:{filters:{type:[{id:"docs",label:"Documentation",value:"docs",count:25},{id:"api",label:"API",value:"api",count:12},{id:"settings",label:"Settings",value:"settings",count:8}],status:[{id:"active",label:"Active",value:"active",count:30},{id:"draft",label:"Draft",value:"draft",count:15}]},onChange:e(),onSearch:e(),onFiltersChange:e()}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};const F=["Default","WithResults","WithFilters"];export{t as Default,a as WithFilters,n as WithResults,F as __namedExportsOrder,P as default};
