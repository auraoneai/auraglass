import{j as e,r as u}from"./iframe-BEVTBSqr.js";import{G as a}from"./GlassInput-BRZrLbJO.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-D5p4jx7m.js";import"./LiquidGlassLayerProvider-h5jHUths.js";import"./GlassButton-bg50TCz0.js";import"./index-CU8u3l8Y.js";import"./GlassPredictiveEngine-y5xM3Rm5.js";import"./GlassAchievementSystem-DvDrrRIP.js";import"./OptimizedGlassCore-BMFMzxVt.js";import"./GlassBiometricAdaptation-BLAoJQ8Y.js";import"./MotionPreferenceContext-FWf-G1hj.js";import"./GlassEyeTracking-DQtZEr81.js";import"./GlassSpatialAudio-D9F1e_tt.js";import"./MotionFramer-xTbOeNdo.js";import"./utilsCore-DpNKUJXO.js";const b={title:"Components/Input/GlassInput",component:a,parameters:{layout:"centered",docs:{description:{component:"A glassmorphism input component with advanced styling and validation."}}},argTypes:{className:{control:"text",description:"className prop"},disabled:{control:"boolean",description:"disabled prop"},placeholder:{control:"text",description:"placeholder prop"},size:{control:{type:"select"},options:["sm","md","lg"],description:"size prop"},variant:{control:{type:"select"},options:["default","filled","outlined","minimal"],description:"variant prop"},state:{control:{type:"select"},options:["default","error","warning","success"],description:"state prop"}},args:{className:"",disabled:!1,placeholder:"Enter text...",size:"md",variant:"default",state:"default"}},r={args:{placeholder:"Enter your text here..."}},l={render:s=>e.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4 max-w-md",children:[e.jsx(a,{...s,variant:"default",placeholder:"Default variant"}),e.jsx(a,{...s,variant:"filled",placeholder:"Filled variant"}),e.jsx(a,{...s,variant:"outlined",placeholder:"Outlined variant"}),e.jsx(a,{...s,variant:"minimal",placeholder:"Minimal variant"})]})},t={render:s=>e.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4 max-w-md",children:[e.jsx(a,{...s,state:"default",placeholder:"Default state"}),e.jsx(a,{...s,state:"success",placeholder:"Success state"}),e.jsx(a,{...s,state:"warning",placeholder:"Warning state"}),e.jsx(a,{...s,state:"error",placeholder:"Error state"})]})},o={render:s=>e.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4 max-w-md",children:[e.jsx(a,{...s,size:"sm",placeholder:"Small size"}),e.jsx(a,{...s,size:"md",placeholder:"Medium size"}),e.jsx(a,{...s,size:"lg",placeholder:"Large size"})]})},n={render:s=>e.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4 max-w-md",children:[e.jsx(a,{...s,leftIcon:"🔍",placeholder:"With left icon"}),e.jsx(a,{...s,rightIcon:"✨",placeholder:"With right icon"}),e.jsx(a,{...s,leftIcon:"👤",rightIcon:"✓",placeholder:"With both icons"})]})},i={render:s=>{const d=()=>{const[c,p]=u.useState("Hello");return e.jsxs("div",{className:"max-w-md glass-space-y-3",children:[e.jsx(a,{...s,value:c,onChange:m=>p(m.target.value),placeholder:s.placeholder??"Controlled input"}),e.jsxs("div",{className:"glass-text-sm glass-text-secondary",children:["Current value: ",e.jsx("code",{children:JSON.stringify(c)})]})]})};return e.jsx(d,{})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter your text here...'
  }
}`,...r.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassInput {...args} variant="default" placeholder="Default variant" />
      <GlassInput {...args} variant="filled" placeholder="Filled variant" />
      <GlassInput {...args} variant="outlined" placeholder="Outlined variant" />
      <GlassInput {...args} variant="minimal" placeholder="Minimal variant" />
    </div>
}`,...l.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassInput {...args} state="default" placeholder="Default state" />
      <GlassInput {...args} state="success" placeholder="Success state" />
      <GlassInput {...args} state="warning" placeholder="Warning state" />
      <GlassInput {...args} state="error" placeholder="Error state" />
    </div>
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassInput {...args} size="sm" placeholder="Small size" />
      <GlassInput {...args} size="md" placeholder="Medium size" />
      <GlassInput {...args} size="lg" placeholder="Large size" />
    </div>
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassInput {...args} leftIcon="🔍" placeholder="With left icon" />
      <GlassInput {...args} rightIcon="✨" placeholder="With right icon" />
      <GlassInput {...args} leftIcon="👤" rightIcon="✓" placeholder="With both icons" />
    </div>
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => {
    const ControlledInput = () => {
      const [value, setValue] = useState('Hello');
      return <div className="max-w-md glass-space-y-3">
          <GlassInput {...args} value={value} onChange={e => setValue((e.target as HTMLInputElement).value)} placeholder={args.placeholder ?? 'Controlled input'} />
          <div className="glass-text-sm glass-text-secondary">
            Current value: <code>{JSON.stringify(value)}</code>
          </div>
        </div>;
    };
    return <ControlledInput />;
  }
}`,...i.parameters?.docs?.source}}};const D=["Default","Variants","States","Sizes","WithIcons","Controlled"];export{i as Controlled,r as Default,o as Sizes,t as States,l as Variants,n as WithIcons,D as __namedExportsOrder,b as default};
