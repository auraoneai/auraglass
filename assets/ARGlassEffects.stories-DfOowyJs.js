const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./ARGlassEffects.r3f-CvbEe2M4.js","./iframe-Ddb4tVEK.js","./preload-helper-PPVm8Dsz.js","./iframe-BBVYlW5A.css","./react-three-fiber.esm-D-N1KqjX.js","./index-CWG1rEj-.js","./circle-alert-D5sufKzJ.js","./createLucideIcon-ArTIMtiF.js","./loader-circle-DIfTLknK.js","./eye-BJadP0gy.js","./info-D44Yz7kS.js"])))=>i.map(i=>d[i]);
import{r as p,j as e,c as v}from"./iframe-Ddb4tVEK.js";import{_ as x}from"./preload-helper-PPVm8Dsz.js";import{a as b}from"./reactVersion-D1IQBcHR.js";let f=null;function s(a){const[l,h]=p.useState(f);if(p.useEffect(()=>{let t=!1;if(b())return l||x(()=>import("./ARGlassEffects.r3f-CvbEe2M4.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]),import.meta.url).then(r=>{if(t)return;const m=r.ARGlassEffects||r.default;f=m,h(()=>m)}).catch(()=>{}),()=>{t=!0}},[l]),!l){const{className:t,children:r}=a;return e.jsx("div",{className:v("ar-glass-effects glass-foundation-complete relative",t),children:r})}return e.jsx(l,{...a})}try{s.displayName="ARGlassEffects",s.__docgenInfo={description:"",displayName:"ARGlassEffects",props:{mode:{defaultValue:null,description:"",name:"mode",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"ar"'},{value:'"preview"'},{value:'"demo"'}]}},content:{defaultValue:null,description:"",name:"content",required:!1,type:{name:"{ title?: string | undefined; text?: string | undefined; data?: number[] | undefined; media?: string | undefined; } | undefined"}},onInteraction:{defaultValue:null,description:"",name:"onInteraction",required:!1,type:{name:"((type: string, data?: any) => void) | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},enablePhysics:{defaultValue:null,description:"",name:"enablePhysics",required:!1,type:{name:"boolean | undefined"}},enableHandTracking:{defaultValue:null,description:"",name:"enableHandTracking",required:!1,type:{name:"boolean | undefined"}},enableVoiceControl:{defaultValue:null,description:"",name:"enableVoiceControl",required:!1,type:{name:"boolean | undefined"}},adaptiveScaling:{defaultValue:null,description:"",name:"adaptiveScaling",required:!1,type:{name:"boolean | undefined"}},showControls:{defaultValue:null,description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showInfo:{defaultValue:null,description:"",name:"showInfo",required:!1,type:{name:"boolean | undefined"}}}}}catch{}try{createParticleField.displayName="createParticleField",createParticleField.__docgenInfo={description:"",displayName:"createParticleField",props:{}}}catch{}try{createSpatialUI.displayName="createSpatialUI",createSpatialUI.__docgenInfo={description:"",displayName:"createSpatialUI",props:{}}}catch{}try{createHolographicGlass.displayName="createHolographicGlass",createHolographicGlass.__docgenInfo={description:"",displayName:"createHolographicGlass",props:{}}}catch{}try{createDataVisualization.displayName="createDataVisualization",createDataVisualization.__docgenInfo={description:"",displayName:"createDataVisualization",props:{}}}catch{}try{createDistanceBasedOpacity.displayName="createDistanceBasedOpacity",createDistanceBasedOpacity.__docgenInfo={description:"",displayName:"createDistanceBasedOpacity",props:{}}}catch{}const _={title:"AR/ARGlassEffects",component:s,parameters:{layout:"fullscreen",docs:{description:{component:"WebXR-powered augmented reality glass effects with hand tracking, spatial interactions, and immersive 3D experiences."}}},argTypes:{mode:{control:{type:"select",options:["ar","preview","demo"]},description:"AR display mode"},enablePhysics:{control:"boolean",description:"Enable physics simulation"},enableHandTracking:{control:"boolean",description:"Enable hand tracking"},enableVoiceControl:{control:"boolean",description:"Enable voice control"},adaptiveScaling:{control:"boolean",description:"Enable adaptive scaling"},showControls:{control:"boolean",description:"Show AR controls"},showInfo:{control:"boolean",description:"Show capability info"}}},n={args:{mode:"preview",enablePhysics:!1,enableHandTracking:!1,enableVoiceControl:!1,adaptiveScaling:!0,showControls:!0,showInfo:!0,content:{title:"AR Glass Experience",text:"Experience augmented reality with glassmorphism effects",data:[.8,.6,.9,.4,.7,.5]}}},i={args:{mode:"ar",enablePhysics:!0,enableHandTracking:!0,enableVoiceControl:!0,adaptiveScaling:!0,showControls:!0,showInfo:!1,content:{title:"Immersive AR Experience",text:"Full AR experience with physics and hand tracking",data:[.9,.7,.8,.6,.9,.5,.8,.7]}}},o={args:{mode:"preview",enablePhysics:!1,enableHandTracking:!1,enableVoiceControl:!1,adaptiveScaling:!0,showControls:!0,showInfo:!0,content:{title:"AR Data Visualization",text:"Interactive 3D data visualization in AR space",data:[.2,.8,.5,.9,.3,.7,.6,.4,.8,.5]}}},c={args:{mode:"demo",enablePhysics:!0,enableHandTracking:!1,enableVoiceControl:!1,adaptiveScaling:!0,showControls:!0,showInfo:!0,content:{title:"Interactive AR Demo",text:"Explore AR capabilities with interactive elements",media:"demo-video-url"}},render:a=>e.jsxs("div",{className:"glass-relative",children:[e.jsx(s,{...a}),e.jsxs("div",{className:"glass-absolute top-4 left-4 glass-surface-dark/80 glass-text-primary glass-p-4 glass-radius-lg max-w-xs glass-contrast-guard",children:[e.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"AR Demo Instructions"}),e.jsxs("ul",{className:"glass-text-sm space-y-1",children:[e.jsx("li",{children:"• Use mouse to orbit camera"}),e.jsx("li",{children:"• Scroll to zoom in/out"}),e.jsx("li",{children:"• Click on AR elements to interact"}),e.jsx("li",{children:"• Try voice commands if enabled"})]})]})]})},d={args:{mode:"preview",enablePhysics:!0,enableHandTracking:!0,enableVoiceControl:!1,adaptiveScaling:!0,showControls:!0,showInfo:!0,content:{title:"Hand Tracking AR",text:"Experience hand-tracked interactions in AR space",data:[.6,.8,.4,.9,.5,.7]}},render:a=>e.jsxs("div",{className:"glass-relative",children:[e.jsx(s,{...a}),e.jsxs("div",{className:"glass-absolute bottom-4 right-4 glass-surface-dark/80 glass-text-primary glass-p-4 glass-radius-lg glass-contrast-guard",children:[e.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"Hand Tracking"}),e.jsxs("div",{className:"glass-text-sm space-y-1",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-contrast-guard"}),e.jsx("span",{children:"Left Hand: Active"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-contrast-guard"}),e.jsx("span",{children:"Right Hand: Active"})]})]})]})]})},g={args:{mode:"preview",enablePhysics:!1,enableHandTracking:!1,enableVoiceControl:!1,adaptiveScaling:!1,showControls:!1,showInfo:!1,content:{title:"Minimal AR",text:"Clean, minimal AR experience"}}},u={args:{mode:"ar",enablePhysics:!0,enableHandTracking:!0,enableVoiceControl:!0,adaptiveScaling:!0,showControls:!0,showInfo:!0,content:{title:"Full AR Experience",text:"Complete AR experience with all features enabled",data:[.8,.6,.9,.7,.5,.8,.6,.9,.4,.7,.8,.5]}},render:a=>e.jsxs("div",{className:"glass-relative",children:[e.jsx(s,{...a}),e.jsxs("div",{className:"glass-absolute top-4 right-4 glass-surface-dark/80 glass-text-primary glass-p-4 glass-radius-lg max-w-sm glass-contrast-guard",children:[e.jsx("h3",{className:"glass-font-semibold glass-mb-3",children:"Active Features"}),e.jsxs("div",{className:"glass-grid glass-glass-grid-cols-2 glass-gap-2 glass-text-sm",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-blue glass-radius-full glass-contrast-guard"}),e.jsx("span",{children:"Physics"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-contrast-guard"}),e.jsx("span",{children:"Hand Tracking"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-primary glass-radius-full glass-contrast-guard"}),e.jsx("span",{children:"Voice Control"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-yellow glass-radius-full glass-contrast-guard"}),e.jsx("span",{children:"Adaptive UI"})]})]})]})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};const A=["Default","ImmersiveAR","DataVisualization","InteractiveDemo","HandTracking","MinimalAR","FullFeatured"];export{o as DataVisualization,n as Default,u as FullFeatured,d as HandTracking,i as ImmersiveAR,c as InteractiveDemo,g as MinimalAR,A as __namedExportsOrder,_ as default};
