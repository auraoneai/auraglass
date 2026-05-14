import{j as s,r as w}from"./iframe-D2N3vCdj.js";import{G as e}from"./GlassButton-DADGQ5u1.js";import{u as G}from"./useGlassParallax-BEVTvFYx.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-Y3bF4vfX.js";import"./LiquidGlassLayerProvider-DuyeeDou.js";import"./a11y-NWIw7uLP.js";import"./GlassPredictiveEngine-DsRdSIEV.js";import"./GlassAchievementSystem-CRVBaZaX.js";import"./OptimizedGlassCore-Cfx2wP22.js";import"./deviceCapabilities-BiFtu_BJ.js";import"./GlassBiometricAdaptation-G6oWNKvq.js";import"./MotionPreferenceContext-CrXN3CiK.js";import"./GlassEyeTracking-BLN3AOs1.js";import"./GlassSpatialAudio-P8l215F-.js";import"./MotionFramer-BTHpoTOv.js";import"./utilsCore-ChCm-RwF.js";const U={title:"Controls/Buttons/Glass Button",component:e,parameters:{layout:"centered",docs:{description:{component:"A sophisticated glass morphism button component with multiple variants and interactive effects."}}},argTypes:{variant:{control:{type:"select"},options:["primary","secondary","aurora","ghost","outline","link","destructive","success","warning"],description:"Button variant that determines color and style"},size:{control:{type:"select"},options:["xs","sm","md","lg","xl"],description:"Button size"},glassVariant:{control:{type:"select"},options:["frosted","dynamic","clear","tinted","luminous"],description:"Glass morphism variant"},intensity:{control:{type:"select"},options:["subtle","medium","strong","intense","ultra","extreme"],description:"Glass intensity level"},elevation:{control:{type:"select"},options:["none","low","medium","high","ultra"],description:"Glass elevation level"},loading:{control:"boolean",description:"Show loading spinner"},disabled:{control:"boolean",description:"Disable button interaction"}},args:{variant:"primary",size:"md",glassVariant:"frosted",intensity:"medium",elevation:"level2",loading:!1,disabled:!1}},l={args:{children:"Click Me"}},t={render:a=>s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:["primary","secondary","aurora","ghost","outline","link","destructive","success","warning"].map(r=>s.jsx(e,{...a,variant:r,children:r},r))}),args:{children:null}},i={args:{variant:"aurora",size:"xl",intensity:"ultra",elevation:"level4",children:"Start building"},parameters:{docs:{description:{story:"Marketing CTA variant with package-owned aurora gradient, tokenized glow, focus, loading, and disabled semantics."}}}},n={render:a=>s.jsx("div",{className:"glass-flex glass-flex-wrap glass-items-center glass-gap-4",children:["xs","sm","md","lg","xl"].map(r=>s.jsxs(e,{...a,size:r,children:["Size ",r.toUpperCase()]},r))}),args:{children:null}},o={render:a=>s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:["frosted","dynamic","clear","tinted","luminous"].map(r=>s.jsx(e,{...a,glassVariant:r,children:r},r))}),args:{children:null}},c={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsxs(e,{...a,children:[s.jsx("svg",{className:"glass-w-4 glass-h-4 glass-mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 6v6m0 0v6m0-6h6m-6 0H6"})}),"Add Item"]}),s.jsxs(e,{...a,variant:"secondary",children:[s.jsxs("svg",{className:"glass-w-4 glass-h-4 glass-mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:[s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]}),"View Details"]}),s.jsxs(e,{...a,variant:"destructive",children:[s.jsx("svg",{className:"glass-w-4 glass-h-4 glass-mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})}),"Delete"]})]}),args:{children:null}},g={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx(e,{...a,loading:!0,children:"Loading..."}),s.jsx(e,{...a,loading:!0,variant:"secondary",children:"Processing"}),s.jsx(e,{...a,loading:!0,variant:"ghost",size:"sm",children:"Saving"})]}),args:{children:null}},d={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx(e,{...a,disabled:!0,children:"Disabled"}),s.jsx(e,{...a,disabled:!0,variant:"secondary",children:"Can't Click"}),s.jsx(e,{...a,disabled:!0,variant:"destructive",children:"Inactive"})]}),args:{children:null}},m={render:a=>s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-6 glass-inset-lg",children:["primary","secondary","success","warning","destructive"].map(r=>{const b=()=>{const B=w.useRef(null);return G(B,{strength:10}),s.jsx(e,{ref:B,...a,variant:r,className:"glass-overlay-specular glass-parallax",children:r})};return s.jsx(b,{},r)})}),args:{children:null}},u={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx(e,{...a,iconOnly:!0,children:s.jsx("svg",{className:"glass-w-4 glass-h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 6v6m0 0v6m0-6h6m-6 0H6"})})}),s.jsx(e,{...a,iconOnly:!0,variant:"secondary",children:s.jsx("svg",{className:"glass-w-4 glass-h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"})})}),s.jsx(e,{...a,iconOnly:!0,variant:"destructive",size:"sm",children:s.jsx("svg",{className:"glass-w-4 glass-h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),args:{children:null}},p={args:{variant:"primary",size:"lg",glassVariant:"luminous",intensity:"ultra",elevation:"level4",children:s.jsxs("div",{className:"glass-flex glass-items-center",children:[s.jsx("svg",{className:"glass-w-5 glass-h-5 glass-mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 10V3L4 14h7v7l9-11h-7z"})}),"Premium Action"]})}},v={args:{variant:"primary",size:"xl",glassVariant:"dynamic",intensity:"extreme",elevation:"level4",className:"glass-px-8 glass-py-4 glass-text-lg glass-font-semibold",children:"Get Started Today"}},x={render:a=>s.jsx("div",{className:"glass-stack glass-stack-lg",children:s.jsxs("div",{className:"glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Predictive Button"}),s.jsx("p",{className:"glass-text-xs glass-text-primary-secondary glass-mb-4",children:"Anticipates user actions and preloads responses"}),s.jsx(e,{...a,children:"Predictive Action"})]})}),args:{variant:"primary",size:"md"}},h={render:a=>s.jsx("div",{className:"glass-stack glass-stack-lg",children:s.jsxs("div",{className:"glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Eye Tracking Enabled"}),s.jsx("p",{className:"glass-text-xs glass-text-primary-secondary glass-mb-4",children:"Responds to user gaze with visual feedback"}),s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx(e,{...a,children:"Look at me"}),s.jsx(e,{...a,variant:"secondary",children:"Focus here"})]})]})}),args:{size:"md"}},y={render:a=>s.jsx("div",{className:"glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5 glass-contrast-guard",style:{width:"min(640px, calc(100vw - 64px))"},children:s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsxs("div",{children:[s.jsx("h3",{className:"glass-text-base glass-font-semibold glass-text-primary glass-mb-1",children:"Biometric adaptive actions"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Stable Storybook sample showing larger hit targets and calmer copy for stress-aware action states."})]}),s.jsx("div",{className:"glass-grid glass-grid-cols-1 sm:glass-grid-cols-3 glass-gap-3",children:[["Input cadence","Slower"],["Target size","Large"],["Motion","Reduced"]].map(([r,b])=>s.jsxs("div",{className:"glass-radius-lg glass-border glass-border-subtle glass-surface-overlay glass-p-3",children:[s.jsx("div",{className:"glass-text-xs glass-text-secondary",children:r}),s.jsx("div",{className:"glass-text-sm glass-font-semibold glass-text-primary",children:b})]},r))}),s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-3",children:[s.jsx(e,{...a,size:"lg",biometricResponsive:!1,children:"Confirm review"}),s.jsx(e,{...a,size:"lg",variant:"destructive",biometricResponsive:!1,children:"Escalate carefully"})]})]})}),args:{size:"lg"}},f={render:a=>s.jsx("div",{className:"glass-stack glass-stack-lg",children:s.jsxs("div",{className:"glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Spatial Audio Feedback"}),s.jsx("p",{className:"glass-text-xs glass-text-primary-secondary glass-mb-4",children:"Provides positional audio cues for interactions"}),s.jsxs("div",{className:"glass-grid glass-grid-cols-3 glass-gap-4",children:[s.jsx(e,{...a,size:"sm",children:"Left"}),s.jsx(e,{...a,size:"sm",children:"Center"}),s.jsx(e,{...a,size:"sm",children:"Right"})]})]})}),args:{variant:"outline"}},k={render:a=>s.jsx("div",{className:"glass-stack glass-stack-lg",children:s.jsxs("div",{className:"glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Achievement System"}),s.jsx("p",{className:"glass-text-xs glass-text-primary-secondary glass-mb-4",children:"Tracks user interactions for gamification"}),s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx(e,{...a,children:"First Action"}),s.jsx(e,{...a,variant:"success",children:"Complete Form"}),s.jsx(e,{...a,variant:"warning",children:"Advanced Feature"})]})]})}),args:{size:"md"}},N={render:a=>s.jsxs("div",{className:"glass-stack glass-stack-lg",children:[s.jsxs("div",{className:"glass-text-center glass-gap-2",children:[s.jsx("h2",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:"Consciousness-Enhanced Button"}),s.jsx("p",{className:"glass-text-sm glass-text-primary-secondary",children:"All consciousness features enabled"})]}),s.jsx("div",{className:"glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-6 glass-contrast-guard",children:s.jsx(e,{...a,size:"lg",glassVariant:"luminous",intensity:"ultra",children:s.jsxs("div",{className:"glass-flex glass-items-center",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-success glass-radius-full animate-pulse glass-mr-2 glass-contrast-guard"}),"Consciousness Enabled"]})})}),s.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4 glass-text-sm",children:[s.jsxs("div",{className:"glass-surface-overlay glass-radius-lg glass-p-3 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Active Features"}),s.jsxs("ul",{className:"glass-text-primary-secondary glass-gap-1",children:[s.jsx("li",{children:"• Predictive action preloading"}),s.jsx("li",{children:"• Eye tracking & gaze response"}),s.jsx("li",{children:"• Biometric stress adaptation"}),s.jsx("li",{children:"• Spatial audio positioning"}),s.jsx("li",{children:"• Achievement tracking"})]})]}),s.jsxs("div",{className:"glass-surface-overlay glass-radius-lg glass-p-3 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"User Experience"}),s.jsxs("ul",{className:"glass-text-primary-secondary glass-gap-1",children:[s.jsx("li",{children:"• Anticipatory interactions"}),s.jsx("li",{children:"• Attention-aware feedback"}),s.jsx("li",{children:"• Stress-responsive UI"}),s.jsx("li",{children:"• Immersive audio cues"}),s.jsx("li",{children:"• Gamified engagement"})]})]})]})]}),args:{variant:"primary"},parameters:{layout:"padded"}},j={render:a=>s.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-6",children:[s.jsxs("div",{className:"glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-4",children:"Standard Button"}),s.jsx(e,{...a,children:"Traditional Interaction"}),s.jsx("p",{className:"glass-text-xs glass-text-primary-secondary glass-mt-2",children:"Basic click interactions"})]}),s.jsxs("div",{className:"glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-4",children:"Consciousness Enhanced"}),s.jsx(e,{...a,children:s.jsxs("div",{className:"glass-flex glass-items-center",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-primary glass-radius-full animate-pulse glass-mr-2 glass-contrast-guard"}),"Enhanced Interaction"]})}),s.jsx("p",{className:"glass-text-xs glass-text-primary-secondary glass-mt-2",children:"Intelligent, adaptive, immersive"})]})]}),args:{variant:"primary",size:"md"}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Click Me'
  }
}`,...l.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      {(['primary', 'secondary', 'aurora', 'ghost', 'outline', 'link', 'destructive', 'success', 'warning'] as GlassButtonVariantType[]).map(variant => <GlassButton key={variant} {...args} variant={variant}>
          {variant}
        </GlassButton>)}
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'aurora',
    size: 'xl',
    intensity: 'ultra',
    elevation: 'level4',
    children: 'Start building'
  },
  parameters: {
    docs: {
      description: {
        story: 'Marketing CTA variant with package-owned aurora gradient, tokenized glow, focus, loading, and disabled semantics.'
      }
    }
  }
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-items-center glass-gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => <GlassButton key={size} {...args} size={size}>
          Size {size.toUpperCase()}
        </GlassButton>)}
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      {(['frosted', 'dynamic', 'clear', 'tinted', 'luminous'] as const).map(glassVariant => <GlassButton key={glassVariant} {...args} glassVariant={glassVariant}>
          {glassVariant}
        </GlassButton>)}
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'xl',
    glassVariant: 'dynamic',
    intensity: 'extreme',
    elevation: 'level4',
    className: 'glass-px-8 glass-py-4 glass-text-lg glass-font-semibold',
    children: 'Get Started Today'
  }
}`,...v.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
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
}`,...x.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
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
}`,...h.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5 glass-contrast-guard" style={{
    width: "min(640px, calc(100vw - 64px))"
  }}>
      <div className="glass-flex glass-flex-col glass-gap-4">
        <div>
          <h3 className="glass-text-base glass-font-semibold glass-text-primary glass-mb-1">
            Biometric adaptive actions
          </h3>
          <p className="glass-text-sm glass-text-secondary">
            Stable Storybook sample showing larger hit targets and calmer copy
            for stress-aware action states.
          </p>
        </div>
        <div className="glass-grid glass-grid-cols-1 sm:glass-grid-cols-3 glass-gap-3">
          {[["Input cadence", "Slower"], ["Target size", "Large"], ["Motion", "Reduced"]].map(([label, value]) => <div key={label} className="glass-radius-lg glass-border glass-border-subtle glass-surface-overlay glass-p-3">
              <div className="glass-text-xs glass-text-secondary">{label}</div>
              <div className="glass-text-sm glass-font-semibold glass-text-primary">
                {value}
              </div>
            </div>)}
        </div>
        <div className="glass-flex glass-flex-wrap glass-gap-3">
          <GlassButton {...args} size="lg" biometricResponsive={false}>
            Confirm review
          </GlassButton>
          <GlassButton {...args} size="lg" variant="destructive" biometricResponsive={false}>
            Escalate carefully
          </GlassButton>
        </div>
      </div>
    </div>,
  args: {
    size: 'lg'
  }
}`,...y.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Spatial Audio Feedback</h3>
        <p className="glass-text-xs glass-text-primary-secondary glass-mb-4">Provides positional audio cues for interactions</p>
        <div className="glass-grid glass-grid-cols-3 glass-gap-4">
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
}`,...f.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-stack glass-stack-lg">
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
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
}`,...k.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-stack glass-stack-lg">
      <div className="glass-text-center glass-gap-2">
        <h2 className="glass-text-xl glass-font-semibold glass-text-primary">Consciousness-Enhanced Button</h2>
        <p className="glass-text-sm glass-text-primary-secondary">All consciousness features enabled</p>
      </div>

      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-6 glass-contrast-guard">
        <GlassButton {...args} size="lg" glassVariant="luminous" intensity="ultra">
          <div className="glass-flex glass-items-center">
            <div className="glass-w-2 glass-h-2 glass-surface-success glass-radius-full animate-pulse glass-mr-2 glass-contrast-guard"></div>
            Consciousness Enabled
          </div>
        </GlassButton>
      </div>

      <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4 glass-text-sm">
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
}`,...N.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-6">
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-4">Standard Button</h3>
        <GlassButton {...args}>
          Traditional Interaction
        </GlassButton>
        <p className="glass-text-xs glass-text-primary-secondary glass-mt-2">Basic click interactions</p>
      </div>
      <div className="glass-surface-overlay glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
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
}`,...j.parameters?.docs?.source}}};const _=["Default","Variants","Aurora","Sizes","GlassVariants","WithIcons","LoadingStates","DisabledStates","SpecularParallax","IconOnly","Showcase","CallToAction","WithPredictiveFeatures","WithEyeTracking","BiometricAdaptive","WithSpatialAudio","AchievementTracking","ConsciousnessShowcase","ConsciousnessComparison"];export{k as AchievementTracking,i as Aurora,y as BiometricAdaptive,v as CallToAction,j as ConsciousnessComparison,N as ConsciousnessShowcase,l as Default,d as DisabledStates,o as GlassVariants,u as IconOnly,g as LoadingStates,p as Showcase,n as Sizes,m as SpecularParallax,t as Variants,h as WithEyeTracking,c as WithIcons,x as WithPredictiveFeatures,f as WithSpatialAudio,_ as __namedExportsOrder,U as default};
