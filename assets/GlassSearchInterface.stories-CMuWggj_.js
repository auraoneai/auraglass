import{G as o}from"./GlassSearchInterface-CA0WPFWW.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-BEVTBSqr.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-bg50TCz0.js";import"./index-CU8u3l8Y.js";import"./LiquidGlassMaterial-D5p4jx7m.js";import"./LiquidGlassLayerProvider-h5jHUths.js";import"./GlassPredictiveEngine-y5xM3Rm5.js";import"./GlassAchievementSystem-DvDrrRIP.js";import"./OptimizedGlassCore-BMFMzxVt.js";import"./GlassBiometricAdaptation-BLAoJQ8Y.js";import"./MotionPreferenceContext-FWf-G1hj.js";import"./GlassEyeTracking-DQtZEr81.js";import"./GlassSpatialAudio-D9F1e_tt.js";import"./MotionFramer-xTbOeNdo.js";import"./utilsCore-DpNKUJXO.js";import"./GlassInput-BRZrLbJO.js";import"./FocusTrap-B8af0l5Q.js";import"./GlassBadge-BRWEelFA.js";import"./index-ByImX2pa.js";const x={title:"Components/Interactive/GlassSearchInterface",component:o,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasssearchinterface component."}}},argTypes:{placeholder:{control:"text",description:"Search placeholder text"},value:{control:"text",description:"Search input value"},loading:{control:"boolean",description:"Loading state"},emptyMessage:{control:"text",description:"Empty state message"}},args:{placeholder:"Search for anything...",value:"",loading:!1,emptyMessage:"No results found"}},t={args:{onChange:e(),onSearch:e()}},n={args:{results:[{id:"1",title:"Getting Started Guide",description:"Learn the basics of our platform",category:"Documentation"},{id:"2",title:"API Reference",description:"Complete API documentation",category:"Documentation"},{id:"3",title:"User Settings",description:"Manage your account preferences",category:"Settings"}],onChange:e(),onSearch:e()}},a={args:{filters:{type:[{id:"docs",label:"Documentation",value:"docs",count:25},{id:"api",label:"API",value:"api",count:12},{id:"settings",label:"Settings",value:"settings",count:8}],status:[{id:"active",label:"Active",value:"active",count:30},{id:"draft",label:"Draft",value:"draft",count:15}]},onChange:e(),onSearch:e(),onFiltersChange:e()}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
