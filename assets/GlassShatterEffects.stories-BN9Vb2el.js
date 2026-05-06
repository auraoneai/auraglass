const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./GlassShatterEffects.r3f-DbEYQzfz.js","./iframe-BEVTBSqr.js","./preload-helper-PPVm8Dsz.js","./iframe-BBVYlW5A.css","./react-three-fiber.esm-CitJ6r9s.js","./index-CWG1rEj-.js","./random-B9-1h0DP.js","./rotate-ccw-DRGTLnTc.js","./createLucideIcon-rSP2W7k9.js","./zap-tcglx1hf.js","./triangle-C18o7fer.js"])))=>i.map(i=>d[i]);
import{r as x,j as s,c as h}from"./iframe-BEVTBSqr.js";import{_ as y}from"./preload-helper-PPVm8Dsz.js";import{a as v}from"./reactVersion-BXyFAdM1.js";let p=null;function e(a){const[l,f]=x.useState(p);if(x.useEffect(()=>{let r=!1;if(v())return l||y(()=>import("./GlassShatterEffects.r3f-DbEYQzfz.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]),import.meta.url).then(t=>{if(r)return;const i=t.GlassShatterEffectsR3F||t.default;p=i,f(()=>i)}).catch(()=>{}),()=>{r=!0}},[l]),!l){const{className:r,children:t,trigger:i="click",...b}=a;return s.jsx("div",{className:h("glass-shatter-effects glass-relative glass-overflow-hidden",r),style:{position:"relative",cursor:i==="click"?"pointer":"default"},...b,children:s.jsx("div",{className:h("content glass-transition-opacity glass-duration-300","glass-opacity-100"),children:t})})}return s.jsx(l,{...a})}try{e.displayName="GlassShatterEffects",e.__docgenInfo={description:"",displayName:"GlassShatterEffects",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},trigger:{defaultValue:null,description:"",name:"trigger",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"auto"'},{value:'"manual"'},{value:'"hover"'},{value:'"click"'}]}},duration:{defaultValue:null,description:"",name:"duration",required:!1,type:{name:"number | undefined"}},intensity:{defaultValue:null,description:"",name:"intensity",required:!1,type:{name:"number | undefined"}},shardCount:{defaultValue:null,description:"",name:"shardCount",required:!1,type:{name:"number | undefined"}},autoReform:{defaultValue:null,description:"",name:"autoReform",required:!1,type:{name:"boolean | undefined"}},reformDelay:{defaultValue:null,description:"",name:"reformDelay",required:!1,type:{name:"number | undefined"}},onShatter:{defaultValue:null,description:"",name:"onShatter",required:!1,type:{name:"(() => void) | undefined"}},onReform:{defaultValue:null,description:"",name:"onReform",required:!1,type:{name:"(() => void) | undefined"}},disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean | undefined"}},showControls:{defaultValue:null,description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},seed:{defaultValue:null,description:"",name:"seed",required:!1,type:{name:"string | number | undefined"}}}}}catch{}const S={title:"Effects/GlassShatterEffects",component:e,parameters:{layout:"fullscreen",docs:{description:{component:"Dynamic glass shatter effects with physics-based animations and interactive shattering experiences."}}},argTypes:{trigger:{control:{type:"select",options:["click","hover","manual","auto"]},description:"How the shatter effect is triggered"},duration:{control:{type:"number",min:.5,max:5,step:.1},description:"Duration of the shatter animation"},intensity:{control:{type:"number",min:.1,max:2,step:.1},description:"Intensity of the shatter effect"},shardCount:{control:{type:"number",min:5,max:50,step:5},description:"Number of glass shards"},autoReform:{control:"boolean",description:"Automatically reform after shattering"},reformDelay:{control:{type:"number",min:1e3,max:1e4,step:500},description:"Delay before auto-reform"},showControls:{control:"boolean",description:"Show shatter controls"}}},g={args:{trigger:"click",duration:2,intensity:1,shardCount:12,autoReform:!0,reformDelay:3e3,showControls:!0},render:a=>s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsx(e,{...a,children:s.jsxs("div",{className:"glass-p-8 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 max-w-md glass-contrast-guard",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Glass Shatter Effect"}),s.jsx("p",{className:"glass-text-primary/80 mb-6",children:"Click anywhere on this card to trigger the glass shatter effect. Watch as the glass breaks apart with realistic physics!"}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-2",children:"💎"}),s.jsx("p",{className:"glass-text-sm glass-text-primary/60",children:"Click to shatter"})]})]})})})},c={args:{trigger:"click",duration:3,intensity:1.5,shardCount:24,autoReform:!0,reformDelay:5e3,showControls:!0},render:a=>s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-orange-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsx(e,{...a,children:s.jsxs("div",{className:"glass-p-8 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 max-w-md glass-contrast-guard",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Dramatic Shatter"}),s.jsx("p",{className:"glass-text-primary/80 mb-6",children:"Experience a more intense shatter effect with more shards and slower animation. Perfect for dramatic reveals!"}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-2",children:"🔥"}),s.jsx("p",{className:"glass-text-sm glass-text-primary/60",children:"Click for dramatic effect"})]})]})})})},n={args:{trigger:"hover",duration:1.5,intensity:.8,shardCount:16,autoReform:!0,reformDelay:2e3,showControls:!0},render:a=>s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-teal-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsx(e,{...a,children:s.jsxs("div",{className:"glass-p-8 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 max-w-md glass-contrast-guard",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Hover Shatter"}),s.jsx("p",{className:"glass-text-primary/80 mb-6",children:"Move your mouse over this card to trigger the shatter effect. It will automatically reform after a short delay."}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-2",children:"🎯"}),s.jsx("p",{className:"glass-text-sm glass-text-primary/60",children:"Hover to shatter"})]})]})})})},d={args:{trigger:"auto",duration:2.5,intensity:1.2,shardCount:20,autoReform:!0,reformDelay:4e3,showControls:!0},render:a=>s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-pink-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsx(e,{...a,children:s.jsxs("div",{className:"glass-p-8 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 max-w-md glass-contrast-guard",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Auto Shatter"}),s.jsx("p",{className:"glass-text-primary/80 mb-6",children:"This card will automatically shatter every few seconds, demonstrating the continuous animation capability."}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-2",children:"⚡"}),s.jsx("p",{className:"glass-text-sm glass-text-primary/60",children:"Watch the auto-shatter"})]})]})})})},m={args:{trigger:"click",duration:1,intensity:.5,shardCount:8,autoReform:!0,reformDelay:1500,showControls:!1},render:a=>s.jsx("div",{className:"glass-min-glass-h-screen glass-surface-subtle glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsx(e,{...a,children:s.jsxs("div",{className:"glass-p-8 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle glass-shadow-lg max-w-md",children:[s.jsx("h2",{className:"glass-text-xl glass-font-bold glass-text-secondary glass-mb-4",children:"Minimal Shatter"}),s.jsx("p",{className:"glass-text-secondary mb-6",children:"A subtle shatter effect with fewer shards and faster animation. Perfect for clean, minimal designs."}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-2",children:"💎"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Click for subtle effect"})]})]})})})},o={args:{trigger:"click",duration:2,intensity:1,shardCount:15,autoReform:!1,showControls:!0},render:a=>s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-slate-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsx(e,{...a,children:s.jsxs("div",{className:"glass-p-8 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 max-w-md glass-contrast-guard",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Permanent Shatter"}),s.jsx("p",{className:"glass-text-primary/80 mb-6",children:"This card will shatter but won't automatically reform. Use the controls to manually reform it."}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-2",children:"💥"}),s.jsx("p",{className:"glass-text-sm glass-text-primary/60",children:"Click to shatter permanently"})]})]})})})},u={args:{trigger:"click",duration:2,intensity:1,shardCount:12,autoReform:!0,reformDelay:3e3,showControls:!1},render:a=>s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-primary glass-text-center mb-12",children:"Interactive Shatter Gallery"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-8",children:[s.jsx(e,{...a,children:s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"🎨"}),s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Creative"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm",children:"Unleash your creativity with glass shatter effects"})]})}),s.jsx(e,{...a,children:s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"🚀"}),s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Dynamic"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm",children:"Experience dynamic visual effects and animations"})]})}),s.jsx(e,{...a,children:s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"💎"}),s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Elegant"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm",children:"Beautiful glass effects with elegant animations"})]})}),s.jsx(e,{...a,children:s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"⚡"}),s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Powerful"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm",children:"Powerful visual effects that capture attention"})]})}),s.jsx(e,{...a,children:s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"🎭"}),s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Interactive"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm",children:"Interactive experiences with user engagement"})]})}),s.jsx(e,{...a,children:s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"✨"}),s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Magical"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm",children:"Magical effects that create memorable experiences"})]})})]})]})})};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    trigger: 'click',
    duration: 2,
    intensity: 1,
    shardCount: 12,
    autoReform: true,
    reformDelay: 3000,
    showControls: true
  },
  render: args => <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
      <GlassShatterEffects {...args}>
        <div className="glass-p-8 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 max-w-md glass-contrast-guard">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">Glass Shatter Effect</h2>
          <p className="glass-text-primary/80 mb-6">
            Click anywhere on this card to trigger the glass shatter effect.
            Watch as the glass breaks apart with realistic physics!
          </p>
          <div className="glass-text-center">
            <div className="glass-text-4xl glass-mb-2">💎</div>
            <p className="glass-text-sm glass-text-primary/60">Click to shatter</p>
          </div>
        </div>
      </GlassShatterEffects>
    </div>
}`,...g.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    trigger: 'click',
    duration: 3,
    intensity: 1.5,
    shardCount: 24,
    autoReform: true,
    reformDelay: 5000,
    showControls: true
  },
  render: args => <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-orange-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
      <GlassShatterEffects {...args}>
        <div className="glass-p-8 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 max-w-md glass-contrast-guard">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">Dramatic Shatter</h2>
          <p className="glass-text-primary/80 mb-6">
            Experience a more intense shatter effect with more shards and slower animation.
            Perfect for dramatic reveals!
          </p>
          <div className="glass-text-center">
            <div className="glass-text-4xl glass-mb-2">🔥</div>
            <p className="glass-text-sm glass-text-primary/60">Click for dramatic effect</p>
          </div>
        </div>
      </GlassShatterEffects>
    </div>
}`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    trigger: 'hover',
    duration: 1.5,
    intensity: 0.8,
    shardCount: 16,
    autoReform: true,
    reformDelay: 2000,
    showControls: true
  },
  render: args => <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-teal-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
      <GlassShatterEffects {...args}>
        <div className="glass-p-8 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 max-w-md glass-contrast-guard">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">Hover Shatter</h2>
          <p className="glass-text-primary/80 mb-6">
            Move your mouse over this card to trigger the shatter effect.
            It will automatically reform after a short delay.
          </p>
          <div className="glass-text-center">
            <div className="glass-text-4xl glass-mb-2">🎯</div>
            <p className="glass-text-sm glass-text-primary/60">Hover to shatter</p>
          </div>
        </div>
      </GlassShatterEffects>
    </div>
}`,...n.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    trigger: 'auto',
    duration: 2.5,
    intensity: 1.2,
    shardCount: 20,
    autoReform: true,
    reformDelay: 4000,
    showControls: true
  },
  render: args => <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-pink-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
      <GlassShatterEffects {...args}>
        <div className="glass-p-8 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 max-w-md glass-contrast-guard">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">Auto Shatter</h2>
          <p className="glass-text-primary/80 mb-6">
            This card will automatically shatter every few seconds,
            demonstrating the continuous animation capability.
          </p>
          <div className="glass-text-center">
            <div className="glass-text-4xl glass-mb-2">⚡</div>
            <p className="glass-text-sm glass-text-primary/60">Watch the auto-shatter</p>
          </div>
        </div>
      </GlassShatterEffects>
    </div>
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    trigger: 'click',
    duration: 1,
    intensity: 0.5,
    shardCount: 8,
    autoReform: true,
    reformDelay: 1500,
    showControls: false
  },
  render: args => <div className="glass-min-glass-h-screen glass-surface-subtle glass-flex glass-items-center glass-justify-center glass-p-8">
      <GlassShatterEffects {...args}>
        <div className="glass-p-8 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle glass-shadow-lg max-w-md">
          <h2 className="glass-text-xl glass-font-bold glass-text-secondary glass-mb-4">Minimal Shatter</h2>
          <p className="glass-text-secondary mb-6">
            A subtle shatter effect with fewer shards and faster animation.
            Perfect for clean, minimal designs.
          </p>
          <div className="glass-text-center">
            <div className="glass-text-3xl glass-mb-2">💎</div>
            <p className="glass-text-sm glass-text-secondary">Click for subtle effect</p>
          </div>
        </div>
      </GlassShatterEffects>
    </div>
}`,...m.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    trigger: 'click',
    duration: 2,
    intensity: 1,
    shardCount: 15,
    autoReform: false,
    showControls: true
  },
  render: args => <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-slate-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
      <GlassShatterEffects {...args}>
        <div className="glass-p-8 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 max-w-md glass-contrast-guard">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">Permanent Shatter</h2>
          <p className="glass-text-primary/80 mb-6">
            This card will shatter but won't automatically reform.
            Use the controls to manually reform it.
          </p>
          <div className="glass-text-center">
            <div className="glass-text-4xl glass-mb-2">💥</div>
            <p className="glass-text-sm glass-text-primary/60">Click to shatter permanently</p>
          </div>
        </div>
      </GlassShatterEffects>
    </div>
}`,...o.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    trigger: 'click',
    duration: 2,
    intensity: 1,
    shardCount: 12,
    autoReform: true,
    reformDelay: 3000,
    showControls: false
  },
  render: args => <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
      <div className="max-w-6xl glass-mx-auto">
        <h1 className="glass-text-4xl glass-font-bold glass-text-primary glass-text-center mb-12">
          Interactive Shatter Gallery
        </h1>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-8">
          <GlassShatterEffects {...args}>
            <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-4">🎨</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Creative</h3>
              <p className="glass-text-primary/80 glass-text-sm">
                Unleash your creativity with glass shatter effects
              </p>
            </div>
          </GlassShatterEffects>

          <GlassShatterEffects {...args}>
            <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-4">🚀</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Dynamic</h3>
              <p className="glass-text-primary/80 glass-text-sm">
                Experience dynamic visual effects and animations
              </p>
            </div>
          </GlassShatterEffects>

          <GlassShatterEffects {...args}>
            <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-4">💎</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Elegant</h3>
              <p className="glass-text-primary/80 glass-text-sm">
                Beautiful glass effects with elegant animations
              </p>
            </div>
          </GlassShatterEffects>

          <GlassShatterEffects {...args}>
            <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-4">⚡</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Powerful</h3>
              <p className="glass-text-primary/80 glass-text-sm">
                Powerful visual effects that capture attention
              </p>
            </div>
          </GlassShatterEffects>

          <GlassShatterEffects {...args}>
            <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-4">🎭</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Interactive</h3>
              <p className="glass-text-primary/80 glass-text-sm">
                Interactive experiences with user engagement
              </p>
            </div>
          </GlassShatterEffects>

          <GlassShatterEffects {...args}>
            <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-4">✨</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Magical</h3>
              <p className="glass-text-primary/80 glass-text-sm">
                Magical effects that create memorable experiences
              </p>
            </div>
          </GlassShatterEffects>
        </div>
      </div>
    </div>
}`,...u.parameters?.docs?.source}}};const k=["Default","Dramatic","HoverTrigger","AutoShatter","Minimal","NoReform","InteractiveGallery"];export{d as AutoShatter,g as Default,c as Dramatic,n as HoverTrigger,u as InteractiveGallery,m as Minimal,o as NoReform,k as __namedExportsOrder,S as default};
