import{j as s}from"./iframe-Cqi-9gHA.js";import{a as p}from"./GlassPredictiveEngine-DWJWfFvG.js";import{G as e,C as u,a as l}from"./GlassContainer-ldWNZwhH.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-D0WtSJtx.js";import"./LiquidGlassLayerProvider-BPcOSNPa.js";import"./GlassAchievementSystem-a9__MuEd.js";import"./a11y-DBBBNlGj.js";import"./OptimizedGlassCore-CWgizUMZ.js";import"./deviceCapabilities-DlsmEFaF.js";import"./GlassBiometricAdaptation-CK7SW6sR.js";import"./MotionPreferenceContext-Da-updIo.js";import"./GlassEyeTracking-PHKeMwz0.js";import"./GlassSpatialAudio-CItqE0YP.js";const G={title:"Surfaces/App Shells + Layout/Glass Container",component:e,parameters:{layout:"centered",docs:{description:{component:"A responsive container with glassmorphism styling and consciousness interface integration for intelligent, adaptive user experiences."}}},argTypes:{size:{control:"select",options:["xs","sm","md","lg","xl","2xl","full"],description:"Container size"},padding:{control:"select",options:["none","xs","sm","md","lg","xl","2xl"],description:"Container padding"},variant:{control:"select",options:["default","fluid","breakout"],description:"Container variant"},glass:{control:"boolean",description:"Enable glassmorphism background"},elevation:{control:"select",options:[0,1,2,3,4,"float","modal"],description:"Glass elevation level"},radius:{control:"select",options:["none","sm","md","lg","xl","2xl","full"],description:"Border radius"},predictive:{control:"boolean",description:"Enable predictive UI features"},preloadContent:{control:"boolean",description:"Enable content preloading"},eyeTracking:{control:"boolean",description:"Enable eye tracking integration"},gazeResponsive:{control:"boolean",description:"Enable gaze-responsive features"},adaptive:{control:"boolean",description:"Enable biometric adaptation"},biometricResponsive:{control:"boolean",description:"Enable biometric responsive features"},spatialAudio:{control:"boolean",description:"Enable spatial audio"},audioFeedback:{control:"boolean",description:"Enable audio feedback"},trackAchievements:{control:"boolean",description:"Enable achievement tracking"},usageContext:{control:"select",options:["main","sidebar","modal","card","list","form"],description:"Container usage context"}},args:{size:"lg",padding:"md",variant:"default",glass:!0,elevation:2,radius:"xl",centered:!0},decorators:[a=>s.jsx(p,{onPrediction:m=>console.log("Prediction:",m),onInsight:m=>console.log("Insight:",m),children:s.jsx("div",{className:"glass-min-glass-h-screen glass-p-8",style:{background:"radial-gradient(circle at 18% 12%, rgba(255,255,255,0.98), rgba(244,246,248,0.96) 38%, rgba(226,229,233,0.98) 100%)"},children:s.jsx(a,{})})})]},t={args:{children:s.jsxs("div",{className:"glass-p-8",style:{color:"rgba(15, 23, 42, 0.94)"},children:[s.jsx("div",{className:"glass-text-xs glass-font-bold glass-mb-3",style:{color:"rgba(71, 85, 105, 0.9)",letterSpacing:"0.08em",textTransform:"uppercase"},children:"Adaptive workspace"}),s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-mb-3",children:"Focused container"}),s.jsx("p",{className:"glass-mb-5",style:{color:"rgba(51, 65, 85, 0.88)",lineHeight:1.55},children:"A calm, responsive surface for content that needs structure without visual weight."}),s.jsx("div",{className:"glass-w-full glass-h-32 glass-radius-lg glass-flex glass-items-center glass-justify-center",style:{background:"rgba(255, 255, 255, 0.14)",border:"1px solid rgba(255, 255, 255, 0.34)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.42), inset 0 0 16px rgba(255,255,255,0.12)"},children:s.jsx("span",{style:{color:"rgba(51, 65, 85, 0.82)"},children:"Neutral content region"})})]})}},n={args:{glass:!0,elevation:"float",radius:"lg",children:s.jsxs("div",{className:"glass-p-8 glass-text-primary",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-mb-4",children:"Glass Container"}),s.jsx("p",{className:"glass-text-primary/80 glass-mb-4",children:"A glass container with glassmorphism background and elevated appearance."}),s.jsx("div",{className:"glass-w-full glass-h-32 glass-surface-subtle/5 glass-radius-lg glass-flex glass-items-center glass-justify-center glass-border glass-border-white/10",children:s.jsx("span",{className:"glass-text-primary/60",children:"Glassmorphic Content"})})]})}},r={args:{glass:!0,elevation:2,radius:"lg",predictive:!0,preloadContent:!0,trackAchievements:!0,usageContext:"main",achievementId:"predictive_container_demo",children:s.jsxs("div",{className:"glass-p-8 glass-text-primary",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-mb-4",children:"🧠 Predictive Container"}),s.jsx("p",{className:"glass-text-primary/80 glass-mb-4",children:"This container learns from your interactions and predicts your needs. Click and interact to see predictions in the browser console."}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-2 glass-gap-4",children:[s.jsx("button",{className:"glass-p-4 glass-surface-blue/20 glass-radius-lg glass-border glass-border-blue/30 hover:glass-surface-blue/30 transition-colors",children:"Frequently Used Action"}),s.jsx("button",{className:"glass-p-4 glass-surface-green/20 glass-radius-lg glass-border glass-border-green/30 hover:glass-surface-green/30 transition-colors",children:"Secondary Action"})]})]})}},i={args:{glass:!0,elevation:2,radius:"lg",adaptive:!0,biometricResponsive:!0,trackAchievements:!0,usageContext:"form",children:s.jsxs("div",{className:"glass-p-8 glass-text-primary",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-mb-4",children:"🔄 Adaptive Container"}),s.jsx("p",{className:"glass-text-primary/80 glass-mb-4",children:"This container adapts its size and padding based on device capabilities and user stress levels. It will automatically optimize for mobile devices and adjust for accessibility needs."}),s.jsxs("div",{className:"glass-gap-4",children:[s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/5 glass-radius-lg",children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-mb-2",children:"Adaptive Form Field"}),s.jsx("input",{type:"text",className:"glass-w-full glass-p-3 glass-surface-subtle/10 glass-radius-md glass-border glass-border-white/20 glass-text-primary placeholder:glass-text-primary/50 glass-touch-target glass-contrast-guard",placeholder:"Touch targets adjust based on stress level"})]}),s.jsx("div",{className:"glass-text-sm glass-text-primary/60",children:"💡 Container size and padding adapt automatically based on biometric data"})]})]})}},o={args:{glass:!0,elevation:3,radius:"xl",eyeTracking:!0,gazeResponsive:!0,spatialAudio:!0,audioFeedback:!0,usageContext:"card",children:s.jsxs("div",{className:"glass-p-8 glass-text-primary",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-mb-4",children:"👁️ Eye Tracking Container"}),s.jsx("p",{className:"glass-text-primary/80 glass-mb-4",children:"This container responds to your gaze with visual and audio feedback. Look at this container to see the glow effect and hear spatial audio."}),s.jsx("div",{className:"glass-w-full h-40 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center glass-border glass-border-purple-400/30",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"👁️"}),s.jsx("span",{className:"glass-text-primary/60",children:"Gaze-responsive content"})]})}),s.jsx("div",{className:"glass-text-sm glass-text-primary/60 glass-mt-4",children:"💡 Container glows and plays audio when you look at it"})]})}},c={name:"Consciousness Presets",render:()=>s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 lg:glass-glass-grid-cols-2 glass-gap-8 max-w-6xl",children:[s.jsx(e,{glass:!0,elevation:2,radius:"lg",...l.minimal,usageContext:"card",children:s.jsxs("div",{className:"glass-p-6 glass-text-primary",children:[s.jsx("h3",{className:"glass-text-lg glass-font-bold glass-mb-2",children:"📊 Minimal Preset"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm glass-mb-4",children:"Basic predictive features and achievement tracking for performance-sensitive contexts."}),s.jsx("div",{className:"glass-text-xs glass-text-primary/60",children:"Features: Predictive UI, Achievement Tracking"})]})}),s.jsx(e,{glass:!0,elevation:2,radius:"lg",...l.balanced,usageContext:"main",children:s.jsxs("div",{className:"glass-p-6 glass-text-primary",children:[s.jsx("h3",{className:"glass-text-lg glass-font-bold glass-mb-2",children:"⚖️ Balanced Preset"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm glass-mb-4",children:"Balanced consciousness features for general use with good performance."}),s.jsx("div",{className:"glass-text-xs glass-text-primary/60",children:"Features: Predictive UI, Biometric Adaptation, Achievement Tracking"})]})}),s.jsx(e,{glass:!0,elevation:3,radius:"lg",...l.immersive,usageContext:"modal",children:s.jsxs("div",{className:"glass-p-6 glass-text-primary",children:[s.jsx("h3",{className:"glass-text-lg glass-font-bold glass-mb-2",children:"🌟 Immersive Preset"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm glass-mb-4",children:"Full consciousness features for immersive, interactive experiences."}),s.jsx("div",{className:"glass-text-xs glass-text-primary/60",children:"Features: All consciousness features enabled"})]})}),s.jsx(e,{glass:!0,elevation:2,radius:"lg",...l.accessible,usageContext:"form",children:s.jsxs("div",{className:"glass-p-6 glass-text-primary",children:[s.jsx("h3",{className:"glass-text-lg glass-font-bold glass-mb-2",children:"♿ Accessible Preset"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm glass-mb-4",children:"Accessibility-focused consciousness features with spatial audio and biometric adaptation."}),s.jsx("div",{className:"glass-text-xs glass-text-primary/60",children:"Features: Biometric Adaptation, Spatial Audio, Achievement Tracking"})]})})]})},g={name:"Conscious Container (All Features)",render:()=>s.jsx(u,{glass:!0,elevation:"modal",radius:"xl",usageContext:"main",className:"max-w-4xl",children:s.jsxs("div",{className:"glass-p-12 glass-text-primary",children:[s.jsxs("div",{className:"glass-text-center mb-8",children:[s.jsx("h2",{className:"glass-text-3xl glass-font-bold glass-mb-4",children:"🧠✨ Conscious Glass Container"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-lg mb-6",children:"Experience the full power of consciousness interface integration"})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8",children:[s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/5 glass-radius-lg glass-border glass-border-white/10",children:[s.jsx("h4",{className:"glass-font-bold glass-mb-2",children:"🔮 Predictive Features"}),s.jsxs("ul",{className:"glass-text-sm glass-text-primary/80 glass-gap-1",children:[s.jsx("li",{children:"• Learns interaction patterns"}),s.jsx("li",{children:"• Preloads content intelligently"}),s.jsx("li",{children:"• Predicts user needs"})]})]}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/5 glass-radius-lg glass-border glass-border-white/10",children:[s.jsx("h4",{className:"glass-font-bold glass-mb-2",children:"👁️ Eye Tracking"}),s.jsxs("ul",{className:"glass-text-sm glass-text-primary/80 glass-gap-1",children:[s.jsx("li",{children:"• Gaze-responsive interface"}),s.jsx("li",{children:"• Attention-based interactions"}),s.jsx("li",{children:"• Visual feedback on focus"})]})]}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/5 glass-radius-lg glass-border glass-border-white/10",children:[s.jsx("h4",{className:"glass-font-bold glass-mb-2",children:"🔄 Biometric Adaptation"}),s.jsxs("ul",{className:"glass-text-sm glass-text-primary/80 glass-gap-1",children:[s.jsx("li",{children:"• Device capability detection"}),s.jsx("li",{children:"• Stress-level adaptation"}),s.jsx("li",{children:"• Accessibility optimization"})]})]}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/5 glass-radius-lg glass-border glass-border-white/10",children:[s.jsx("h4",{className:"glass-font-bold glass-mb-2",children:"🎵 Spatial Audio"}),s.jsxs("ul",{className:"glass-text-sm glass-text-primary/80 glass-gap-1",children:[s.jsx("li",{children:"• Positional sound feedback"}),s.jsx("li",{children:"• Audio interaction cues"}),s.jsx("li",{children:"• Accessibility enhancement"})]})]})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("button",{className:"glass-px-8 glass-py-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-font-semibold hover:glass-gradient-primary hover:glass-gradient-primary transition-all transform hover:scale-105",children:"Experience Consciousness Features"}),s.jsx("p",{className:"glass-text-xs glass-text-primary/60 glass-mt-4",children:"Interact with this container to experience all consciousness features working together"})]})]})})},d={name:"Size Variants",render:()=>s.jsx("div",{className:"space-y-6",children:["xs","sm","md","lg","xl","2xl"].map(a=>s.jsx(e,{size:a,glass:!0,elevation:1,radius:"md",padding:"md",children:s.jsxs("div",{className:"glass-text-primary glass-text-center glass-py-4",children:[s.jsxs("h4",{className:"glass-font-bold glass-text-lg",children:["Size: ",a.toUpperCase()]}),s.jsxs("p",{className:"glass-text-primary/70 glass-text-sm",children:["Container with ",a," sizing"]})]})},a))})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div className="glass-p-8" style={{
      color: "rgba(15, 23, 42, 0.94)"
    }}>
        <div className="glass-text-xs glass-font-bold glass-mb-3" style={{
        color: "rgba(71, 85, 105, 0.9)",
        letterSpacing: "0.08em",
        textTransform: "uppercase"
      }}>
          Adaptive workspace
        </div>
        <h2 className="glass-text-2xl glass-font-bold glass-mb-3">
          Focused container
        </h2>
        <p className="glass-mb-5" style={{
        color: "rgba(51, 65, 85, 0.88)",
        lineHeight: 1.55
      }}>
          A calm, responsive surface for content that needs structure without
          visual weight.
        </p>
        <div className="glass-w-full glass-h-32 glass-radius-lg glass-flex glass-items-center glass-justify-center" style={{
        background: "rgba(255, 255, 255, 0.14)",
        border: "1px solid rgba(255, 255, 255, 0.34)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.42), inset 0 0 16px rgba(255,255,255,0.12)"
      }}>
          <span style={{
          color: "rgba(51, 65, 85, 0.82)"
        }}>
            Neutral content region
          </span>
        </div>
      </div>
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    glass: true,
    elevation: "float",
    radius: "lg",
    children: <div className="glass-p-8 glass-text-primary">
        <h2 className="glass-text-2xl glass-font-bold glass-mb-4">
          Glass Container
        </h2>
        <p className="glass-text-primary/80 glass-mb-4">
          A glass container with glassmorphism background and elevated
          appearance.
        </p>
        <div className="glass-w-full glass-h-32 glass-surface-subtle/5 glass-radius-lg glass-flex glass-items-center glass-justify-center glass-border glass-border-white/10">
          <span className="glass-text-primary/60">Glassmorphic Content</span>
        </div>
      </div>
  }
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    glass: true,
    elevation: 2,
    radius: "lg",
    predictive: true,
    preloadContent: true,
    trackAchievements: true,
    usageContext: "main",
    achievementId: "predictive_container_demo",
    children: <div className="glass-p-8 glass-text-primary">
        <h2 className="glass-text-2xl glass-font-bold glass-mb-4">
          🧠 Predictive Container
        </h2>
        <p className="glass-text-primary/80 glass-mb-4">
          This container learns from your interactions and predicts your needs.
          Click and interact to see predictions in the browser console.
        </p>
        <div className="glass-grid glass-glass-grid-cols-2 glass-gap-4">
          <button className="glass-p-4 glass-surface-blue/20 glass-radius-lg glass-border glass-border-blue/30 hover:glass-surface-blue/30 transition-colors">
            Frequently Used Action
          </button>
          <button className="glass-p-4 glass-surface-green/20 glass-radius-lg glass-border glass-border-green/30 hover:glass-surface-green/30 transition-colors">
            Secondary Action
          </button>
        </div>
      </div>
  }
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    glass: true,
    elevation: 2,
    radius: "lg",
    adaptive: true,
    biometricResponsive: true,
    trackAchievements: true,
    usageContext: "form",
    children: <div className="glass-p-8 glass-text-primary">
        <h2 className="glass-text-2xl glass-font-bold glass-mb-4">
          🔄 Adaptive Container
        </h2>
        <p className="glass-text-primary/80 glass-mb-4">
          This container adapts its size and padding based on device
          capabilities and user stress levels. It will automatically optimize
          for mobile devices and adjust for accessibility needs.
        </p>
        <div className="glass-gap-4">
          <div className="glass-p-4 glass-surface-subtle/5 glass-radius-lg">
            <label className="glass-block glass-text-sm glass-font-medium glass-mb-2">
              Adaptive Form Field
            </label>
            <input type="text" className="glass-w-full glass-p-3 glass-surface-subtle/10 glass-radius-md glass-border glass-border-white/20 glass-text-primary placeholder:glass-text-primary/50 glass-touch-target glass-contrast-guard" placeholder="Touch targets adjust based on stress level" />
          </div>
          <div className="glass-text-sm glass-text-primary/60">
            💡 Container size and padding adapt automatically based on biometric
            data
          </div>
        </div>
      </div>
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    glass: true,
    elevation: 3,
    radius: "xl",
    eyeTracking: true,
    gazeResponsive: true,
    spatialAudio: true,
    audioFeedback: true,
    usageContext: "card",
    children: <div className="glass-p-8 glass-text-primary">
        <h2 className="glass-text-2xl glass-font-bold glass-mb-4">
          👁️ Eye Tracking Container
        </h2>
        <p className="glass-text-primary/80 glass-mb-4">
          This container responds to your gaze with visual and audio feedback.
          Look at this container to see the glow effect and hear spatial audio.
        </p>
        <div className="glass-w-full h-40 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center glass-border glass-border-purple-400/30">
          <div className="glass-text-center">
            <div className="glass-text-2xl glass-mb-2">👁️</div>
            <span className="glass-text-primary/60">
              Gaze-responsive content
            </span>
          </div>
        </div>
        <div className="glass-text-sm glass-text-primary/60 glass-mt-4">
          💡 Container glows and plays audio when you look at it
        </div>
      </div>
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Consciousness Presets",
  render: () => <div className="glass-grid glass-glass-grid-cols-1 lg:glass-glass-grid-cols-2 glass-gap-8 max-w-6xl">
      {/* Minimal Preset */}
      <GlassContainer glass={true} elevation={2} radius="lg" {...ConsciousnessPresets.minimal} usageContext="card">
        <div className="glass-p-6 glass-text-primary">
          <h3 className="glass-text-lg glass-font-bold glass-mb-2">
            📊 Minimal Preset
          </h3>
          <p className="glass-text-primary/80 glass-text-sm glass-mb-4">
            Basic predictive features and achievement tracking for
            performance-sensitive contexts.
          </p>
          <div className="glass-text-xs glass-text-primary/60">
            Features: Predictive UI, Achievement Tracking
          </div>
        </div>
      </GlassContainer>

      {/* Balanced Preset */}
      <GlassContainer glass={true} elevation={2} radius="lg" {...ConsciousnessPresets.balanced} usageContext="main">
        <div className="glass-p-6 glass-text-primary">
          <h3 className="glass-text-lg glass-font-bold glass-mb-2">
            ⚖️ Balanced Preset
          </h3>
          <p className="glass-text-primary/80 glass-text-sm glass-mb-4">
            Balanced consciousness features for general use with good
            performance.
          </p>
          <div className="glass-text-xs glass-text-primary/60">
            Features: Predictive UI, Biometric Adaptation, Achievement Tracking
          </div>
        </div>
      </GlassContainer>

      {/* Immersive Preset */}
      <GlassContainer glass={true} elevation={3} radius="lg" {...ConsciousnessPresets.immersive} usageContext="modal">
        <div className="glass-p-6 glass-text-primary">
          <h3 className="glass-text-lg glass-font-bold glass-mb-2">
            🌟 Immersive Preset
          </h3>
          <p className="glass-text-primary/80 glass-text-sm glass-mb-4">
            Full consciousness features for immersive, interactive experiences.
          </p>
          <div className="glass-text-xs glass-text-primary/60">
            Features: All consciousness features enabled
          </div>
        </div>
      </GlassContainer>

      {/* Accessible Preset */}
      <GlassContainer glass={true} elevation={2} radius="lg" {...ConsciousnessPresets.accessible} usageContext="form">
        <div className="glass-p-6 glass-text-primary">
          <h3 className="glass-text-lg glass-font-bold glass-mb-2">
            ♿ Accessible Preset
          </h3>
          <p className="glass-text-primary/80 glass-text-sm glass-mb-4">
            Accessibility-focused consciousness features with spatial audio and
            biometric adaptation.
          </p>
          <div className="glass-text-xs glass-text-primary/60">
            Features: Biometric Adaptation, Spatial Audio, Achievement Tracking
          </div>
        </div>
      </GlassContainer>
    </div>
}`,...c.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Conscious Container (All Features)",
  render: () => <ConsciousGlassContainer glass={true} elevation="modal" radius="xl" usageContext="main" className="max-w-4xl">
      <div className="glass-p-12 glass-text-primary">
        <div className="glass-text-center mb-8">
          <h2 className="glass-text-3xl glass-font-bold glass-mb-4">
            🧠✨ Conscious Glass Container
          </h2>
          <p className="glass-text-primary/80 glass-text-lg mb-6">
            Experience the full power of consciousness interface integration
          </p>
        </div>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8">
          <div className="glass-p-6 glass-surface-subtle/5 glass-radius-lg glass-border glass-border-white/10">
            <h4 className="glass-font-bold glass-mb-2">
              🔮 Predictive Features
            </h4>
            <ul className="glass-text-sm glass-text-primary/80 glass-gap-1">
              <li>• Learns interaction patterns</li>
              <li>• Preloads content intelligently</li>
              <li>• Predicts user needs</li>
            </ul>
          </div>

          <div className="glass-p-6 glass-surface-subtle/5 glass-radius-lg glass-border glass-border-white/10">
            <h4 className="glass-font-bold glass-mb-2">👁️ Eye Tracking</h4>
            <ul className="glass-text-sm glass-text-primary/80 glass-gap-1">
              <li>• Gaze-responsive interface</li>
              <li>• Attention-based interactions</li>
              <li>• Visual feedback on focus</li>
            </ul>
          </div>

          <div className="glass-p-6 glass-surface-subtle/5 glass-radius-lg glass-border glass-border-white/10">
            <h4 className="glass-font-bold glass-mb-2">
              🔄 Biometric Adaptation
            </h4>
            <ul className="glass-text-sm glass-text-primary/80 glass-gap-1">
              <li>• Device capability detection</li>
              <li>• Stress-level adaptation</li>
              <li>• Accessibility optimization</li>
            </ul>
          </div>

          <div className="glass-p-6 glass-surface-subtle/5 glass-radius-lg glass-border glass-border-white/10">
            <h4 className="glass-font-bold glass-mb-2">🎵 Spatial Audio</h4>
            <ul className="glass-text-sm glass-text-primary/80 glass-gap-1">
              <li>• Positional sound feedback</li>
              <li>• Audio interaction cues</li>
              <li>• Accessibility enhancement</li>
            </ul>
          </div>
        </div>

        <div className="glass-text-center">
          <button className="glass-px-8 glass-py-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-font-semibold hover:glass-gradient-primary hover:glass-gradient-primary transition-all transform hover:scale-105">
            Experience Consciousness Features
          </button>
          <p className="glass-text-xs glass-text-primary/60 glass-mt-4">
            Interact with this container to experience all consciousness
            features working together
          </p>
        </div>
      </div>
    </ConsciousGlassContainer>
}`,...g.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Size Variants",
  render: () => <div className="space-y-6">
      {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map(size => <GlassContainer key={size} size={size} glass={true} elevation={1} radius="md" padding="md">
          <div className="glass-text-primary glass-text-center glass-py-4">
            <h4 className="glass-font-bold glass-text-lg">
              Size: {size.toUpperCase()}
            </h4>
            <p className="glass-text-primary/70 glass-text-sm">
              Container with {size} sizing
            </p>
          </div>
        </GlassContainer>)}
    </div>
}`,...d.parameters?.docs?.source}}};const S=["Default","WithGlass","PredictiveContainer","BiometricAdaptive","EyeTrackingResponsive","ConsciousPresets","ConsciousContainer","SizeVariants"];export{i as BiometricAdaptive,g as ConsciousContainer,c as ConsciousPresets,t as Default,o as EyeTrackingResponsive,r as PredictiveContainer,d as SizeVariants,n as WithGlass,S as __namedExportsOrder,G as default};
