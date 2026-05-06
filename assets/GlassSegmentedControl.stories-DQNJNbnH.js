import{r as N,h as z,b as G,j as e,c as v}from"./iframe-BEVTBSqr.js";import{G as O}from"./GlassButton-bg50TCz0.js";import{L as q}from"./LiquidGlassSegmentedControl-Byi4CqAy.js";import{O as D}from"./OptimizedGlassCore-BMFMzxVt.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CU8u3l8Y.js";import"./LiquidGlassMaterial-D5p4jx7m.js";import"./LiquidGlassLayerProvider-h5jHUths.js";import"./GlassPredictiveEngine-y5xM3Rm5.js";import"./GlassAchievementSystem-DvDrrRIP.js";import"./GlassBiometricAdaptation-BLAoJQ8Y.js";import"./MotionPreferenceContext-FWf-G1hj.js";import"./GlassEyeTracking-DQtZEr81.js";import"./GlassSpatialAudio-D9F1e_tt.js";import"./MotionFramer-xTbOeNdo.js";import"./utilsCore-DpNKUJXO.js";const l=N.forwardRef(({items:a=[],value:r="",onChange:c=()=>{},size:u="md",condensed:p=!1,material:h="glass",respectMotionPreference:y=!0,"aria-label":m="Segmented control","data-testid":g,className:b},f)=>{const x=z("segmented-control"),S=G(),C=y&&S;if(h==="liquid")return e.jsx(q,{ref:f,segments:a,value:r,onValueChange:c,className:b,"aria-label":m,"data-testid":g});const j={sm:"h-8 glass-text-xs",md:"h-9 glass-text-sm",lg:"h-10 glass-text-base"};return e.jsx("nav",{"aria-label":m,"data-testid":g,className:b,children:e.jsx(D,{ref:f,elevation:"level1",animation:C?"none":"gentle",role:"group","aria-label":m,id:x,className:v("inline-flex items-center glass-radius-xl glass-p-1 glass-gap-1 overflow-visible"),children:a.map(s=>e.jsxs(O,{variant:s.id===r?"primary":"secondary",size:u,disabled:s.disabled,className:v("glass-radius-md overflow-visible whitespace-nowrap leading-normal",j[u],p&&"glass-px-2"),onClick:M=>!s.disabled&&c(s.id),"aria-pressed":s.id===r,children:[s.icon&&e.jsx("span",{className:"glass-mr-2 glass-inline-glass-flex",children:s.icon}),!p&&s.label]},s.id))})})});l.displayName="GlassSegmentedControl";try{l.displayName="GlassSegmentedControl",l.__docgenInfo={description:"",displayName:"GlassSegmentedControl",props:{items:{defaultValue:{value:"[]"},description:"",name:"items",required:!1,type:{name:"SegmentedItem[] | undefined"}},value:{defaultValue:{value:""},description:"",name:"value",required:!1,type:{name:"string | undefined"}},onChange:{defaultValue:{value:"() => {}"},description:"",name:"onChange",required:!1,type:{name:"((id: string) => void) | undefined"}},size:{defaultValue:{value:"md"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},condensed:{defaultValue:{value:"false"},description:"",name:"condensed",required:!1,type:{name:"boolean | undefined"}},material:{defaultValue:{value:"glass"},description:"",name:"material",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"liquid"'},{value:'"glass"'}]}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to respect motion preferences for animations",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},"aria-label":{defaultValue:{value:"Segmented control"},description:"Accessible label for the segmented control",name:"aria-label",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"Test ID for testing",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const K={title:"Components/Navigation/GlassSegmentedControl",component:l,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasssegmentedcontrol component."}}},argTypes:{items:{control:"object",description:"Array of segmented control items"},value:{control:"text",description:"Currently selected item ID"},size:{control:{type:"select",options:["sm","md","lg"]},description:"Size variant"},condensed:{control:"boolean",description:"Whether to use condensed layout"}},args:{items:[{id:"option1",label:"Option 1"},{id:"option2",label:"Option 2"},{id:"option3",label:"Option 3"}],value:"option1",size:"md",condensed:!1}},n={args:{items:[{id:"daily",label:"Daily"},{id:"weekly",label:"Weekly"},{id:"monthly",label:"Monthly"}],value:"daily"}},i={render:a=>e.jsxs("div",{className:"glass-gap-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-2",children:"Small"}),e.jsx(l,{...a,size:"sm"})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-2",children:"Medium"}),e.jsx(l,{...a,size:"md"})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-2",children:"Large"}),e.jsx(l,{...a,size:"lg"})]})]}),args:{items:[{id:"small",label:"Small"},{id:"medium",label:"Medium"},{id:"large",label:"Large"}],value:"medium"}},t={args:{items:[{id:"list",label:"List",icon:"📋"},{id:"grid",label:"Grid",icon:"📊"},{id:"card",label:"Card",icon:"🃏"}],value:"list"}},d={args:{items:[{id:"option1",label:"Option 1"},{id:"option2",label:"Option 2"},{id:"option3",label:"Option 3"},{id:"option4",label:"Option 4"}],value:"option1",condensed:!0}},o={args:{items:[{id:"enabled1",label:"Enabled"},{id:"disabled",label:"Disabled",disabled:!0},{id:"enabled2",label:"Enabled"}],value:"enabled1"}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'daily',
      label: 'Daily'
    }, {
      id: 'weekly',
      label: 'Weekly'
    }, {
      id: 'monthly',
      label: 'Monthly'
    }],
    value: 'daily'
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-gap-4">
      <div>
        <h3 className="glass-text-sm glass-font-semibold glass-mb-2">Small</h3>
        <GlassSegmentedControl {...args} size="sm" />
      </div>
      <div>
        <h3 className="glass-text-sm glass-font-semibold glass-mb-2">Medium</h3>
        <GlassSegmentedControl {...args} size="md" />
      </div>
      <div>
        <h3 className="glass-text-sm glass-font-semibold glass-mb-2">Large</h3>
        <GlassSegmentedControl {...args} size="lg" />
      </div>
    </div>,
  args: {
    items: [{
      id: 'small',
      label: 'Small'
    }, {
      id: 'medium',
      label: 'Medium'
    }, {
      id: 'large',
      label: 'Large'
    }],
    value: 'medium'
  }
}`,...i.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'list',
      label: 'List',
      icon: '📋'
    }, {
      id: 'grid',
      label: 'Grid',
      icon: '📊'
    }, {
      id: 'card',
      label: 'Card',
      icon: '🃏'
    }],
    value: 'list'
  }
}`,...t.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'option1',
      label: 'Option 1'
    }, {
      id: 'option2',
      label: 'Option 2'
    }, {
      id: 'option3',
      label: 'Option 3'
    }, {
      id: 'option4',
      label: 'Option 4'
    }],
    value: 'option1',
    condensed: true
  }
}`,...d.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'enabled1',
      label: 'Enabled'
    }, {
      id: 'disabled',
      label: 'Disabled',
      disabled: true
    }, {
      id: 'enabled2',
      label: 'Enabled'
    }],
    value: 'enabled1'
  }
}`,...o.parameters?.docs?.source}}};const Q=["Default","DifferentSizes","WithIcons","Condensed","WithDisabledItems"];export{d as Condensed,n as Default,i as DifferentSizes,o as WithDisabledItems,t as WithIcons,Q as __namedExportsOrder,K as default};
