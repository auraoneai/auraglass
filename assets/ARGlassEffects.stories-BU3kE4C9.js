const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./ARGlassEffects.r3f-Df8nDaP6.js","./iframe-GrkikuRp.js","./preload-helper-PPVm8Dsz.js","./iframe-DBRTERfG.css","./react-three-fiber.esm-J2Z7VG0w.js","./index-CWG1rEj-.js","./components-DWrkUpM8.js"])))=>i.map(i=>d[i]);
import{r as f,j as e,c as y}from"./iframe-GrkikuRp.js";import{_ as N}from"./preload-helper-PPVm8Dsz.js";import{a as _}from"./reactVersion-CiD4NePi.js";let h=null;function l(s){const[t,x]=f.useState(h);if(f.useEffect(()=>{let r=!1;if(_())return t||N(()=>import("./ARGlassEffects.r3f-Df8nDaP6.js"),__vite__mapDeps([0,1,2,3,4,5,6]),import.meta.url).then(n=>{if(r)return;const a=n.ARGlassEffects||n.default;h=a,x(()=>a)}).catch(()=>{}),()=>{r=!0}},[t]),!t){const{className:r,children:n,content:a,mode:v}=s,b=a?.data?.length?a.data:[.8,.6,.9];return e.jsxs("div",{className:y("ar-glass-effects glass-foundation-complete glass-relative glass-flex glass-min-h-[480px] glass-items-center glass-justify-center glass-overflow-hidden glass-rounded-2xl glass-border glass-border-white/20 glass-bg-slate-950 glass-p-6 glass-text-white",r),children:[e.jsx("div",{className:"glass-absolute glass-inset-0 glass-bg-[radial-gradient(circle_at_25%_20%,rgba(56,189,248,0.35),transparent_34%),linear-gradient(135deg,rgba(30,41,59,0.95),rgba(14,116,144,0.72))]"}),e.jsxs("section",{className:"glass-relative glass-z-10 glass-w-full glass-max-w-3xl glass-rounded-2xl glass-border glass-border-white/25 glass-bg-white/12 glass-p-6 glass-shadow-2xl glass-backdrop-blur-xl",children:[e.jsx("p",{className:"glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-cyan-100",children:"AR preview fallback"}),e.jsx("h2",{className:"glass-mt-2 glass-text-3xl glass-font-semibold glass-text-white",children:a?.title||"AR Glass Experience"}),e.jsx("p",{className:"glass-mt-3 glass-max-w-2xl glass-text-sm glass-leading-6 glass-text-cyan-50/85",children:a?.text||"Preview mode is showing a non-3D fallback while optional React Three Fiber support is unavailable."}),e.jsx("div",{className:"glass-mt-6 glass-grid glass-gap-3 sm:glass-grid-cols-3",children:b.slice(0,3).map((w,p)=>e.jsxs("div",{className:"glass-rounded-xl glass-border glass-border-white/20 glass-bg-white/8 glass-p-4",children:[e.jsxs("span",{className:"glass-text-xs glass-text-cyan-100/75",children:["Signal ",p+1]}),e.jsx("div",{className:"glass-mt-3 glass-h-2 glass-rounded-full glass-bg-white/15",children:e.jsx("span",{className:"glass-block glass-h-full glass-rounded-full glass-bg-cyan-300",style:{width:`${Math.max(12,Math.round(w*100))}%`}})})]},p))}),e.jsxs("div",{className:"glass-mt-5 glass-inline-flex glass-rounded-full glass-border glass-border-white/20 glass-bg-white/8 glass-px-3 glass-py-1 glass-text-xs glass-text-cyan-50",children:["Mode: ",v||"preview"]})]}),n]})}return e.jsx(t,{...s})}try{l.displayName="ARGlassEffects",l.__docgenInfo={description:"",displayName:"ARGlassEffects",props:{mode:{defaultValue:null,description:"",name:"mode",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"preview"'},{value:'"ar"'},{value:'"demo"'}]}},content:{defaultValue:null,description:"",name:"content",required:!1,type:{name:"{ title?: string | undefined; text?: string | undefined; data?: number[] | undefined; media?: string | undefined; } | undefined"}},onInteraction:{defaultValue:null,description:"",name:"onInteraction",required:!1,type:{name:"((type: string, data?: any) => void) | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},enablePhysics:{defaultValue:null,description:"",name:"enablePhysics",required:!1,type:{name:"boolean | undefined"}},enableHandTracking:{defaultValue:null,description:"",name:"enableHandTracking",required:!1,type:{name:"boolean | undefined"}},enableVoiceControl:{defaultValue:null,description:"",name:"enableVoiceControl",required:!1,type:{name:"boolean | undefined"}},adaptiveScaling:{defaultValue:null,description:"",name:"adaptiveScaling",required:!1,type:{name:"boolean | undefined"}},showControls:{defaultValue:null,description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showInfo:{defaultValue:null,description:"",name:"showInfo",required:!1,type:{name:"boolean | undefined"}}}}}catch{}try{createParticleField.displayName="createParticleField",createParticleField.__docgenInfo={description:"",displayName:"createParticleField",props:{}}}catch{}try{createSpatialUI.displayName="createSpatialUI",createSpatialUI.__docgenInfo={description:"",displayName:"createSpatialUI",props:{}}}catch{}try{createHolographicGlass.displayName="createHolographicGlass",createHolographicGlass.__docgenInfo={description:"",displayName:"createHolographicGlass",props:{}}}catch{}try{createDataVisualization.displayName="createDataVisualization",createDataVisualization.__docgenInfo={description:"",displayName:"createDataVisualization",props:{}}}catch{}try{createDistanceBasedOpacity.displayName="createDistanceBasedOpacity",createDistanceBasedOpacity.__docgenInfo={description:"",displayName:"createDistanceBasedOpacity",props:{}}}catch{}const I={title:"Effects + Advanced/ARGlass Effects",component:l,parameters:{layout:"fullscreen",docs:{description:{component:"WebXR-powered augmented reality glass effects with hand tracking, spatial interactions, and immersive 3D experiences."}}},argTypes:{mode:{control:{type:"select",options:["ar","preview","demo"]},description:"AR display mode"},enablePhysics:{control:"boolean",description:"Enable physics simulation"},enableHandTracking:{control:"boolean",description:"Enable hand tracking"},enableVoiceControl:{control:"boolean",description:"Enable voice control"},adaptiveScaling:{control:"boolean",description:"Enable adaptive scaling"},showControls:{control:"boolean",description:"Show AR controls"},showInfo:{control:"boolean",description:"Show capability info"}}},i={args:{mode:"preview",enablePhysics:!1,enableHandTracking:!1,enableVoiceControl:!1,adaptiveScaling:!0,showControls:!0,showInfo:!0,content:{title:"AR Glass Experience",text:"Experience augmented reality with glassmorphism effects",data:[.8,.6,.9,.4,.7,.5]}}},o={args:{mode:"ar",enablePhysics:!0,enableHandTracking:!0,enableVoiceControl:!0,adaptiveScaling:!0,showControls:!0,showInfo:!1,content:{title:"Immersive AR Experience",text:"Full AR experience with physics and hand tracking",data:[.9,.7,.8,.6,.9,.5,.8,.7]}}},c={args:{mode:"preview",enablePhysics:!1,enableHandTracking:!1,enableVoiceControl:!1,adaptiveScaling:!0,showControls:!0,showInfo:!0,content:{title:"AR Data Visualization",text:"Interactive 3D data visualization in AR space",data:[.2,.8,.5,.9,.3,.7,.6,.4,.8,.5]}}},d={args:{mode:"demo",enablePhysics:!0,enableHandTracking:!1,enableVoiceControl:!1,adaptiveScaling:!0,showControls:!0,showInfo:!0,content:{title:"Interactive AR Demo",text:"Explore AR capabilities with interactive elements",media:"demo-video-url"}},render:s=>e.jsxs("div",{className:"glass-relative",children:[e.jsx(l,{...s}),e.jsxs("div",{className:"glass-absolute top-4 left-4 glass-surface-dark/80 glass-text-primary glass-p-4 glass-radius-lg max-w-xs glass-contrast-guard",children:[e.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"AR Demo Instructions"}),e.jsxs("ul",{className:"glass-text-sm space-y-1",children:[e.jsx("li",{children:"• Use mouse to orbit camera"}),e.jsx("li",{children:"• Scroll to zoom in/out"}),e.jsx("li",{children:"• Click on AR elements to interact"}),e.jsx("li",{children:"• Try voice commands if enabled"})]})]})]})},g={args:{mode:"preview",enablePhysics:!0,enableHandTracking:!0,enableVoiceControl:!1,adaptiveScaling:!0,showControls:!0,showInfo:!0,content:{title:"Hand Tracking AR",text:"Experience hand-tracked interactions in AR space",data:[.6,.8,.4,.9,.5,.7]}},render:s=>e.jsxs("div",{className:"glass-relative",children:[e.jsx(l,{...s}),e.jsxs("div",{className:"glass-absolute bottom-4 right-4 glass-surface-dark/80 glass-text-primary glass-p-4 glass-radius-lg glass-contrast-guard",children:[e.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"Hand Tracking"}),e.jsxs("div",{className:"glass-text-sm space-y-1",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-contrast-guard"}),e.jsx("span",{children:"Left Hand: Active"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-contrast-guard"}),e.jsx("span",{children:"Right Hand: Active"})]})]})]})]})},u={args:{mode:"preview",enablePhysics:!1,enableHandTracking:!1,enableVoiceControl:!1,adaptiveScaling:!1,showControls:!1,showInfo:!1,content:{title:"Minimal AR",text:"Clean, minimal AR experience"}}},m={args:{mode:"ar",enablePhysics:!0,enableHandTracking:!0,enableVoiceControl:!0,adaptiveScaling:!0,showControls:!0,showInfo:!0,content:{title:"Full AR Experience",text:"Complete AR experience with all features enabled",data:[.8,.6,.9,.7,.5,.8,.6,.9,.4,.7,.8,.5]}},render:s=>e.jsxs("div",{className:"glass-relative",children:[e.jsx(l,{...s}),e.jsxs("div",{className:"glass-absolute top-4 right-4 glass-surface-dark/80 glass-text-primary glass-p-4 glass-radius-lg max-w-sm glass-contrast-guard",children:[e.jsx("h3",{className:"glass-font-semibold glass-mb-3",children:"Active Features"}),e.jsxs("div",{className:"glass-grid glass-glass-grid-cols-2 glass-gap-2 glass-text-sm",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-blue glass-radius-full glass-contrast-guard"}),e.jsx("span",{children:"Physics"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-contrast-guard"}),e.jsx("span",{children:"Hand Tracking"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-primary glass-radius-full glass-contrast-guard"}),e.jsx("span",{children:"Voice Control"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-yellow glass-radius-full glass-contrast-guard"}),e.jsx("span",{children:"Adaptive UI"})]})]})]})]})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'preview',
    enablePhysics: false,
    enableHandTracking: false,
    enableVoiceControl: false,
    adaptiveScaling: true,
    showControls: true,
    showInfo: true,
    content: {
      title: 'AR Glass Experience',
      text: 'Experience augmented reality with glassmorphism effects',
      data: [0.8, 0.6, 0.9, 0.4, 0.7, 0.5]
    }
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'ar',
    enablePhysics: true,
    enableHandTracking: true,
    enableVoiceControl: true,
    adaptiveScaling: true,
    showControls: true,
    showInfo: false,
    content: {
      title: 'Immersive AR Experience',
      text: 'Full AR experience with physics and hand tracking',
      data: [0.9, 0.7, 0.8, 0.6, 0.9, 0.5, 0.8, 0.7]
    }
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'preview',
    enablePhysics: false,
    enableHandTracking: false,
    enableVoiceControl: false,
    adaptiveScaling: true,
    showControls: true,
    showInfo: true,
    content: {
      title: 'AR Data Visualization',
      text: 'Interactive 3D data visualization in AR space',
      data: [0.2, 0.8, 0.5, 0.9, 0.3, 0.7, 0.6, 0.4, 0.8, 0.5]
    }
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'demo',
    enablePhysics: true,
    enableHandTracking: false,
    enableVoiceControl: false,
    adaptiveScaling: true,
    showControls: true,
    showInfo: true,
    content: {
      title: 'Interactive AR Demo',
      text: 'Explore AR capabilities with interactive elements',
      media: 'demo-video-url'
    }
  },
  render: args => <div className="glass-relative">
      <ARGlassEffects {...args} />

      {/* Demo instructions overlay */}
      <div className="glass-absolute top-4 left-4 glass-surface-dark/80 glass-text-primary glass-p-4 glass-radius-lg max-w-xs glass-contrast-guard">
        <h3 className="glass-font-semibold glass-mb-2">AR Demo Instructions</h3>
        <ul className="glass-text-sm space-y-1">
          <li>• Use mouse to orbit camera</li>
          <li>• Scroll to zoom in/out</li>
          <li>• Click on AR elements to interact</li>
          <li>• Try voice commands if enabled</li>
        </ul>
      </div>
    </div>
}`,...d.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'preview',
    enablePhysics: true,
    enableHandTracking: true,
    enableVoiceControl: false,
    adaptiveScaling: true,
    showControls: true,
    showInfo: true,
    content: {
      title: 'Hand Tracking AR',
      text: 'Experience hand-tracked interactions in AR space',
      data: [0.6, 0.8, 0.4, 0.9, 0.5, 0.7]
    }
  },
  render: args => <div className="glass-relative">
      <ARGlassEffects {...args} />

      {/* Hand tracking info */}
      <div className="glass-absolute bottom-4 right-4 glass-surface-dark/80 glass-text-primary glass-p-4 glass-radius-lg glass-contrast-guard">
        <h3 className="glass-font-semibold glass-mb-2">Hand Tracking</h3>
        <div className="glass-text-sm space-y-1">
          <div className="glass-flex glass-items-center glass-gap-2">
            <div className="glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-contrast-guard"></div>
            <span>Left Hand: Active</span>
          </div>
          <div className="glass-flex glass-items-center glass-gap-2">
            <div className="glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-contrast-guard"></div>
            <span>Right Hand: Active</span>
          </div>
        </div>
      </div>
    </div>
}`,...g.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'preview',
    enablePhysics: false,
    enableHandTracking: false,
    enableVoiceControl: false,
    adaptiveScaling: false,
    showControls: false,
    showInfo: false,
    content: {
      title: 'Minimal AR',
      text: 'Clean, minimal AR experience'
    }
  }
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'ar',
    enablePhysics: true,
    enableHandTracking: true,
    enableVoiceControl: true,
    adaptiveScaling: true,
    showControls: true,
    showInfo: true,
    content: {
      title: 'Full AR Experience',
      text: 'Complete AR experience with all features enabled',
      data: [0.8, 0.6, 0.9, 0.7, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.8, 0.5]
    }
  },
  render: args => <div className="glass-relative">
      <ARGlassEffects {...args} />

      {/* Feature showcase */}
      <div className="glass-absolute top-4 right-4 glass-surface-dark/80 glass-text-primary glass-p-4 glass-radius-lg max-w-sm glass-contrast-guard">
        <h3 className="glass-font-semibold glass-mb-3">Active Features</h3>
        <div className="glass-grid glass-glass-grid-cols-2 glass-gap-2 glass-text-sm">
          <div className="glass-flex glass-items-center glass-gap-2">
            <div className="glass-w-2 glass-h-2 glass-surface-blue glass-radius-full glass-contrast-guard"></div>
            <span>Physics</span>
          </div>
          <div className="glass-flex glass-items-center glass-gap-2">
            <div className="glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-contrast-guard"></div>
            <span>Hand Tracking</span>
          </div>
          <div className="glass-flex glass-items-center glass-gap-2">
            <div className="glass-w-2 glass-h-2 glass-surface-primary glass-radius-full glass-contrast-guard"></div>
            <span>Voice Control</span>
          </div>
          <div className="glass-flex glass-items-center glass-gap-2">
            <div className="glass-w-2 glass-h-2 glass-surface-yellow glass-radius-full glass-contrast-guard"></div>
            <span>Adaptive UI</span>
          </div>
        </div>
      </div>
    </div>
}`,...m.parameters?.docs?.source}}};const k=["Default","ImmersiveAR","DataVisualization","InteractiveDemo","HandTracking","MinimalAR","FullFeatured"];export{c as DataVisualization,i as Default,m as FullFeatured,g as HandTracking,o as ImmersiveAR,d as InteractiveDemo,u as MinimalAR,k as __namedExportsOrder,I as default};
