import{j as s,r as B}from"./iframe-DpweptvF.js";import{G as e}from"./GlassButton-CoJjSHnE.js";import{u as w}from"./useGlassParallax-Cj8w64Gu.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DErlfuJO.js";import"./LiquidGlassMaterial-nIJf4szv.js";import"./LiquidGlassLayerProvider-DwkmVtLC.js";import"./GlassPredictiveEngine-CJz8dse6.js";import"./GlassAchievementSystem-DQQoVp6r.js";import"./OptimizedGlassCore-UOg4NIOz.js";import"./GlassBiometricAdaptation-CJofGeVw.js";import"./MotionPreferenceContext-5A7bWbbY.js";import"./GlassEyeTracking-BvBuetm1.js";import"./GlassSpatialAudio-Csw4ezvx.js";import"./MotionFramer-BmJovKMH.js";import"./utilsCore-Diw1ReC2.js";const R={title:"Components/Button/GlassButton",component:e,parameters:{layout:"centered",docs:{description:{component:"A sophisticated glass morphism button component with multiple variants and interactive effects."}}},argTypes:{variant:{control:{type:"select"},options:["primary","secondary","ghost","outline","link","destructive","success","warning"],description:"Button variant that determines color and style"},size:{control:{type:"select"},options:["xs","sm","md","lg","xl"],description:"Button size"},glassVariant:{control:{type:"select"},options:["frosted","dynamic","clear","tinted","luminous"],description:"Glass morphism variant"},intensity:{control:{type:"select"},options:["subtle","medium","strong","intense","ultra","extreme"],description:"Glass intensity level"},elevation:{control:{type:"select"},options:["none","low","medium","high","ultra"],description:"Glass elevation level"},loading:{control:"boolean",description:"Show loading spinner"},disabled:{control:"boolean",description:"Disable button interaction"}},args:{variant:"primary",size:"md",glassVariant:"frosted",intensity:"medium",elevation:"level2",loading:!1,disabled:!1}},r={args:{children:"Click Me"}},t={render:a=>s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:["primary","secondary","ghost","outline","link","destructive","success","warning"].map(l=>s.jsx(e,{...a,variant:l,children:l},l))}),args:{children:null}},i={render:a=>s.jsx("div",{className:"glass-flex glass-flex-wrap glass-items-center glass-gap-4",children:["xs","sm","md","lg","xl"].map(l=>s.jsxs(e,{...a,size:l,children:["Size ",l.toUpperCase()]},l))}),args:{children:null}},n={render:a=>s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:["frosted","dynamic","clear","tinted","luminous"].map(l=>s.jsx(e,{...a,glassVariant:l,children:l},l))}),args:{children:null}},o={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsxs(e,{...a,children:[s.jsx("svg",{className:"glass-w-4 glass-h-4 glass-mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 6v6m0 0v6m0-6h6m-6 0H6"})}),"Add Item"]}),s.jsxs(e,{...a,variant:"secondary",children:[s.jsxs("svg",{className:"glass-w-4 glass-h-4 glass-mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:[s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]}),"View Details"]}),s.jsxs(e,{...a,variant:"destructive",children:[s.jsx("svg",{className:"glass-w-4 glass-h-4 glass-mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})}),"Delete"]})]}),args:{children:null}},g={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx(e,{...a,loading:!0,children:"Loading..."}),s.jsx(e,{...a,loading:!0,variant:"secondary",children:"Processing"}),s.jsx(e,{...a,loading:!0,variant:"ghost",size:"sm",children:"Saving"})]}),args:{children:null}},c={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx(e,{...a,disabled:!0,children:"Disabled"}),s.jsx(e,{...a,disabled:!0,variant:"secondary",children:"Can't Click"}),s.jsx(e,{...a,disabled:!0,variant:"destructive",children:"Inactive"})]}),args:{children:null}},d={render:a=>s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-6 glass-inset-lg",children:["primary","secondary","success","warning","destructive"].map(l=>{const b=()=>{const N=B.useRef(null);return w(N,{strength:10}),s.jsx(e,{ref:N,...a,variant:l,className:"glass-overlay-specular glass-parallax",children:l})};return s.jsx(b,{},l)})}),args:{children:null}},m={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx(e,{...a,iconOnly:!0,children:s.jsx("svg",{className:"glass-w-4 glass-h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 6v6m0 0v6m0-6h6m-6 0H6"})})}),s.jsx(e,{...a,iconOnly:!0,variant:"secondary",children:s.jsx("svg",{className:"glass-w-4 glass-h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"})})}),s.jsx(e,{...a,iconOnly:!0,variant:"destructive",size:"sm",children:s.jsx("svg",{className:"glass-w-4 glass-h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),args:{children:null}},u={args:{variant:"primary",size:"lg",glassVariant:"luminous",intensity:"ultra",elevation:"level4",children:s.jsxs("div",{className:"glass-flex glass-items-center",children:[s.jsx("svg",{className:"glass-w-5 glass-h-5 glass-mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 10V3L4 14h7v7l9-11h-7z"})}),"Premium Action"]})}},p={args:{variant:"primary",size:"xl",glassVariant:"dynamic",intensity:"extreme",elevation:"level4",className:"px-8 py-4 text-lg font-semibold",children:"Get Started Today"}},v={render:a=>s.jsx("div",{className:"glass-stack glass-stack-lg",children:s.jsxs("div",{className:"glass-surface-overlay glass-glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Predictive Button"}),s.jsx("p",{className:"glass-text-xs glass-text-primary-secondary glass-mb-4",children:"Anticipates user actions and preloads responses"}),s.jsx(e,{...a,children:"Predictive Action"})]})}),args:{variant:"primary",size:"md"}},x={render:a=>s.jsx("div",{className:"glass-stack glass-stack-lg",children:s.jsxs("div",{className:"glass-surface-overlay glass-glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Eye Tracking Enabled"}),s.jsx("p",{className:"glass-text-xs glass-text-primary-secondary glass-mb-4",children:"Responds to user gaze with visual feedback"}),s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx(e,{...a,children:"Look at me"}),s.jsx(e,{...a,variant:"secondary",children:"Focus here"})]})]})}),args:{size:"md"}},h={render:a=>s.jsx("div",{className:"glass-stack glass-stack-lg",children:s.jsxs("div",{className:"glass-surface-overlay glass-glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Biometric Adaptive"}),s.jsx("p",{className:"glass-text-xs glass-text-primary-secondary glass-mb-4",children:"Adjusts interaction patterns based on stress levels"}),s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx(e,{...a,children:"Adaptive Submit"}),s.jsx(e,{...a,variant:"destructive",children:"Delete (Stress-Aware)"})]})]})}),args:{size:"md"}},y={render:a=>s.jsx("div",{className:"glass-stack glass-stack-lg",children:s.jsxs("div",{className:"glass-surface-overlay glass-glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Spatial Audio Feedback"}),s.jsx("p",{className:"glass-text-xs glass-text-primary-secondary glass-mb-4",children:"Provides positional audio cues for interactions"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-3 glass-gap-4",children:[s.jsx(e,{...a,size:"sm",children:"Left"}),s.jsx(e,{...a,size:"sm",children:"Center"}),s.jsx(e,{...a,size:"sm",children:"Right"})]})]})}),args:{variant:"outline"}},f={render:a=>s.jsx("div",{className:"glass-stack glass-stack-lg",children:s.jsxs("div",{className:"glass-surface-overlay glass-glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Achievement System"}),s.jsx("p",{className:"glass-text-xs glass-text-primary-secondary glass-mb-4",children:"Tracks user interactions for gamification"}),s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx(e,{...a,children:"First Action"}),s.jsx(e,{...a,variant:"success",children:"Complete Form"}),s.jsx(e,{...a,variant:"warning",children:"Advanced Feature"})]})]})}),args:{size:"md"}},j={render:a=>s.jsxs("div",{className:"space-y-8",children:[s.jsxs("div",{className:"glass-text-center glass-gap-2",children:[s.jsx("h2",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:"Consciousness-Enhanced Button"}),s.jsx("p",{className:"glass-text-sm glass-text-primary-secondary",children:"All consciousness features enabled"})]}),s.jsx("div",{className:"glass-surface-overlay glass-glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-p-6 glass-contrast-guard",children:s.jsx(e,{...a,size:"lg",glassVariant:"luminous",intensity:"ultra",children:s.jsxs("div",{className:"glass-flex glass-items-center",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-success glass-radius-full animate-pulse glass-mr-2 glass-contrast-guard"}),"Consciousness Enabled"]})})}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-4 glass-text-sm",children:[s.jsxs("div",{className:"glass-surface-overlay glass-radius-lg glass-p-3 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Active Features"}),s.jsxs("ul",{className:"glass-text-primary-secondary glass-gap-1",children:[s.jsx("li",{children:"• Predictive action preloading"}),s.jsx("li",{children:"• Eye tracking & gaze response"}),s.jsx("li",{children:"• Biometric stress adaptation"}),s.jsx("li",{children:"• Spatial audio positioning"}),s.jsx("li",{children:"• Achievement tracking"})]})]}),s.jsxs("div",{className:"glass-surface-overlay glass-radius-lg glass-p-3 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"User Experience"}),s.jsxs("ul",{className:"glass-text-primary-secondary glass-gap-1",children:[s.jsx("li",{children:"• Anticipatory interactions"}),s.jsx("li",{children:"• Attention-aware feedback"}),s.jsx("li",{children:"• Stress-responsive UI"}),s.jsx("li",{children:"• Immersive audio cues"}),s.jsx("li",{children:"• Gamified engagement"})]})]})]})]}),args:{variant:"primary"},parameters:{layout:"padded"}},k={render:a=>s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6",children:[s.jsxs("div",{className:"glass-surface-overlay glass-glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-4",children:"Standard Button"}),s.jsx(e,{...a,children:"Traditional Interaction"}),s.jsx("p",{className:"glass-text-xs glass-text-primary-secondary glass-mt-2",children:"Basic click interactions"})]}),s.jsxs("div",{className:"glass-surface-overlay glass-glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-4",children:"Consciousness Enhanced"}),s.jsx(e,{...a,children:s.jsxs("div",{className:"glass-flex glass-items-center",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-primary glass-radius-full animate-pulse glass-mr-2 glass-contrast-guard"}),"Enhanced Interaction"]})}),s.jsx("p",{className:"glass-text-xs glass-text-primary-secondary glass-mt-2",children:"Intelligent, adaptive, immersive"})]})]}),args:{variant:"primary",size:"md"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Click Me'
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      {(['primary', 'secondary', 'ghost', 'outline', 'link', 'destructive', 'success', 'warning'] as GlassButtonVariantType[]).map(variant => <GlassButton key={variant} {...args} variant={variant}>
          {variant}
        </GlassButton>)}
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-items-center glass-gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => <GlassButton key={size} {...args} size={size}>
          Size {size.toUpperCase()}
        </GlassButton>)}
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      {(['frosted', 'dynamic', 'clear', 'tinted', 'luminous'] as const).map(glassVariant => <GlassButton key={glassVariant} {...args} glassVariant={glassVariant}>
          {glassVariant}
        </GlassButton>)}
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassButton {...args}>
        <svg className="glass-w-4 glass-h-4 glass-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Item
      </GlassButton>
      <GlassButton {...args} variant="secondary">
        <svg className="glass-w-4 glass-h-4 glass-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View Details
      </GlassButton>
      <GlassButton {...args} variant="destructive">
        <svg className="glass-w-4 glass-h-4 glass-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </GlassButton>
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...o.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassButton {...args} loading>
        Loading...
      </GlassButton>
      <GlassButton {...args} loading variant="secondary">
        Processing
      </GlassButton>
      <GlassButton {...args} loading variant="ghost" size="sm">
        Saving
      </GlassButton>
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...g.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassButton {...args} disabled>
        Disabled
      </GlassButton>
      <GlassButton {...args} disabled variant="secondary">
        Can't Click
      </GlassButton>
      <GlassButton {...args} disabled variant="destructive">
        Inactive
      </GlassButton>
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-6 glass-inset-lg">
      {(['primary', 'secondary', 'success', 'warning', 'destructive'] as GlassButtonVariantType[]).map(variant => {
      const Demo: React.FC = () => {
        const ref = useRef<HTMLButtonElement>(null);
        useGlassParallax(ref, {
          strength: 10
        });
        return <GlassButton ref={ref} {...args} variant={variant} className="glass-overlay-specular glass-parallax">
              {variant}
            </GlassButton>;
      };
      return <Demo key={variant} />;
    })}
    </div>,
  args: {
    children: null
  }
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassButton {...args} iconOnly>
        <svg className="glass-w-4 glass-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </GlassButton>
      <GlassButton {...args} iconOnly variant="secondary">
        <svg className="glass-w-4 glass-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </GlassButton>
      <GlassButton {...args} iconOnly variant="destructive" size="sm">
        <svg className="glass-w-4 glass-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </GlassButton>
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'lg',
    glassVariant: 'luminous',
    intensity: 'ultra',
    elevation: 'level4',
    children: <div className="glass-flex glass-items-center">
        <svg className="glass-w-5 glass-h-5 glass-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Premium Action
      </div>
  }
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'xl',
    glassVariant: 'dynamic',
    intensity: 'extreme',
    elevation: 'level4',
    className: 'px-8 py-4 text-lg font-semibold',
    children: 'Get Started Today'
  }
}`,...p.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Predictive Button</h3>
        <p className="glass-text-xs glass-text-primary-secondary glass-mb-4">Anticipates user actions and preloads responses</p>
        <GlassButton {...args}>
          Predictive Action
        </GlassButton>
      </div>
    </div>,
  args: {
    variant: 'primary',
    size: 'md'
  }
}`,...v.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Eye Tracking Enabled</h3>
        <p className="glass-text-xs glass-text-primary-secondary glass-mb-4">Responds to user gaze with visual feedback</p>
        <div className="glass-flex glass-flex-wrap glass-gap-4">
          <GlassButton {...args}>
            Look at me
          </GlassButton>
          <GlassButton {...args} variant="secondary">
            Focus here
          </GlassButton>
        </div>
      </div>
    </div>,
  args: {
    size: 'md'
  }
}`,...x.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Biometric Adaptive</h3>
        <p className="glass-text-xs glass-text-primary-secondary glass-mb-4">Adjusts interaction patterns based on stress levels</p>
        <div className="glass-flex glass-flex-wrap glass-gap-4">
          <GlassButton {...args}>
            Adaptive Submit
          </GlassButton>
          <GlassButton {...args} variant="destructive">
            Delete (Stress-Aware)
          </GlassButton>
        </div>
      </div>
    </div>,
  args: {
    size: 'md'
  }
}`,...h.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Spatial Audio Feedback</h3>
        <p className="glass-text-xs glass-text-primary-secondary glass-mb-4">Provides positional audio cues for interactions</p>
        <div className="glass-grid glass-glass-grid-cols-3 glass-gap-4">
          <GlassButton {...args} size="sm">
            Left
          </GlassButton>
          <GlassButton {...args} size="sm">
            Center
          </GlassButton>
          <GlassButton {...args} size="sm">
            Right
          </GlassButton>
        </div>
      </div>
    </div>,
  args: {
    variant: 'outline'
  }
}`,...y.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Achievement System</h3>
        <p className="glass-text-xs glass-text-primary-secondary glass-mb-4">Tracks user interactions for gamification</p>
        <div className="glass-flex glass-flex-wrap glass-gap-4">
          <GlassButton {...args}>
            First Action
          </GlassButton>
          <GlassButton {...args} variant="success">
            Complete Form
          </GlassButton>
          <GlassButton {...args} variant="warning">
            Advanced Feature
          </GlassButton>
        </div>
      </div>
    </div>,
  args: {
    size: 'md'
  }
}`,...f.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: args => <div className="space-y-8">
      <div className="glass-text-center glass-gap-2">
        <h2 className="glass-text-xl glass-font-semibold glass-text-primary">Consciousness-Enhanced Button</h2>
        <p className="glass-text-sm glass-text-primary-secondary">All consciousness features enabled</p>
      </div>
      
      <div className="glass-surface-overlay glass-glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-p-6 glass-contrast-guard">
        <GlassButton {...args} size="lg" glassVariant="luminous" intensity="ultra">
          <div className="glass-flex glass-items-center">
            <div className="glass-w-2 glass-h-2 glass-surface-success glass-radius-full animate-pulse glass-mr-2 glass-contrast-guard"></div>
            Consciousness Enabled
          </div>
        </GlassButton>
      </div>
      
      <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-4 glass-text-sm">
        <div className="glass-surface-overlay glass-radius-lg glass-p-3 glass-contrast-guard">
          <h4 className="glass-font-medium glass-text-primary glass-mb-2">Active Features</h4>
          <ul className="glass-text-primary-secondary glass-gap-1">
            <li>• Predictive action preloading</li>
            <li>• Eye tracking & gaze response</li>
            <li>• Biometric stress adaptation</li>
            <li>• Spatial audio positioning</li>
            <li>• Achievement tracking</li>
          </ul>
        </div>
        <div className="glass-surface-overlay glass-radius-lg glass-p-3 glass-contrast-guard">
          <h4 className="glass-font-medium glass-text-primary glass-mb-2">User Experience</h4>
          <ul className="glass-text-primary-secondary glass-gap-1">
            <li>• Anticipatory interactions</li>
            <li>• Attention-aware feedback</li>
            <li>• Stress-responsive UI</li>
            <li>• Immersive audio cues</li>
            <li>• Gamified engagement</li>
          </ul>
        </div>
      </div>
    </div>,
  args: {
    variant: 'primary'
  },
  parameters: {
    layout: 'padded'
  }
}`,...j.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6">
      <div className="glass-surface-overlay glass-glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-4">Standard Button</h3>
        <GlassButton {...args}>
          Traditional Interaction
        </GlassButton>
        <p className="glass-text-xs glass-text-primary-secondary glass-mt-2">Basic click interactions</p>
      </div>
      <div className="glass-surface-overlay glass-glass-glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-4">Consciousness Enhanced</h3>
        <GlassButton {...args}>
          <div className="glass-flex glass-items-center">
            <div className="glass-w-2 glass-h-2 glass-surface-primary glass-radius-full animate-pulse glass-mr-2 glass-contrast-guard"></div>
            Enhanced Interaction
          </div>
        </GlassButton>
        <p className="glass-text-xs glass-text-primary-secondary glass-mt-2">Intelligent, adaptive, immersive</p>
      </div>
    </div>,
  args: {
    variant: 'primary',
    size: 'md'
  }
}`,...k.parameters?.docs?.source}}};const H=["Default","Variants","Sizes","GlassVariants","WithIcons","LoadingStates","DisabledStates","SpecularParallax","IconOnly","Showcase","CallToAction","WithPredictiveFeatures","WithEyeTracking","BiometricAdaptive","WithSpatialAudio","AchievementTracking","ConsciousnessShowcase","ConsciousnessComparison"];export{f as AchievementTracking,h as BiometricAdaptive,p as CallToAction,k as ConsciousnessComparison,j as ConsciousnessShowcase,r as Default,c as DisabledStates,n as GlassVariants,m as IconOnly,g as LoadingStates,u as Showcase,i as Sizes,d as SpecularParallax,t as Variants,x as WithEyeTracking,o as WithIcons,v as WithPredictiveFeatures,y as WithSpatialAudio,H as __namedExportsOrder,R as default};
