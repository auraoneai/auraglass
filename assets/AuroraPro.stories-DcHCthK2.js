const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./AuroraPro.r3f-DNScFL7Q.js","./iframe-rcK9Xf1b.js","./preload-helper-PPVm8Dsz.js","./iframe-BBVYlW5A.css","./react-three-fiber.esm-Bcnp3KGL.js","./index-CWG1rEj-.js","./flame-BenzDI_t.js","./createLucideIcon-DsZsNNjc.js","./pause-Civ1SoSN.js","./play-C8uBHClB.js","./wind-qnZZ5rE3.js","./sparkles-BaODZIyV.js","./star-DnYlt2Dy.js","./palette-BxBmahQl.js","./zap-BgWND6ac.js"])))=>i.map(i=>d[i]);
import{r as p,j as s,c as b}from"./iframe-rcK9Xf1b.js";import{_ as f}from"./preload-helper-PPVm8Dsz.js";import{a as N}from"./reactVersion-BevNPupg.js";let h=null;function e(a){const[l,v]=p.useState(h);if(p.useEffect(()=>{let r=!1;if(N())return l||f(()=>import("./AuroraPro.r3f-DNScFL7Q.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]),import.meta.url).then(t=>{if(r)return;const i=t.AuroraPro||t.default;h=i,v(()=>i)}).catch(()=>{}),()=>{r=!0}},[l]),!l){const{className:r,children:t,...i}=a;return s.jsx("div",{className:b("aurora-pro glass-relative glass-overflow-hidden",r),...i,children:t})}return s.jsx(l,{...a})}try{e.displayName="AuroraPro",e.__docgenInfo={description:"",displayName:"AuroraPro",props:{intensity:{defaultValue:null,description:"",name:"intensity",required:!1,type:{name:"number | undefined"}},speed:{defaultValue:null,description:"",name:"speed",required:!1,type:{name:"number | undefined"}},colorPalette:{defaultValue:null,description:"",name:"colorPalette",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"custom"'},{value:'"forest"'},{value:'"ocean"'},{value:'"sunset"'},{value:'"cosmic"'},{value:'"arctic"'}]}},customColors:{defaultValue:null,description:"",name:"customColors",required:!1,type:{name:"[string, string, string] | undefined"}},particleCount:{defaultValue:null,description:"",name:"particleCount",required:!1,type:{name:"number | undefined"}},showParticles:{defaultValue:null,description:"",name:"showParticles",required:!1,type:{name:"boolean | undefined"}},showWaves:{defaultValue:null,description:"",name:"showWaves",required:!1,type:{name:"boolean | undefined"}},showCurtain:{defaultValue:null,description:"",name:"showCurtain",required:!1,type:{name:"boolean | undefined"}},animationMode:{defaultValue:null,description:"",name:"animationMode",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"pulse"'},{value:'"mixed"'},{value:'"flow"'},{value:'"shift"'}]}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},showControls:{defaultValue:null,description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},autoAnimate:{defaultValue:null,description:"",name:"autoAnimate",required:!1,type:{name:"boolean | undefined"}},onAnimationChange:{defaultValue:null,description:"",name:"onAnimationChange",required:!1,type:{name:"((mode: string) => void) | undefined"}}}}}catch{}const C={title:"Effects/AuroraPro",component:e,parameters:{layout:"fullscreen",docs:{description:{component:"Spectacular aurora borealis effects with dynamic color palettes, particle systems, and immersive atmospheric lighting."}}},argTypes:{intensity:{control:{type:"number",min:.1,max:2,step:.1},description:"Overall intensity of aurora effects"},speed:{control:{type:"number",min:.1,max:2,step:.1},description:"Animation speed multiplier"},colorPalette:{control:{type:"select",options:["arctic","forest","sunset","ocean","cosmic","custom"]},description:"Color palette for aurora effects"},particleCount:{control:{type:"number",min:10,max:100,step:10},description:"Number of aurora particles"},showParticles:{control:"boolean",description:"Show particle effects"},showWaves:{control:"boolean",description:"Show aurora wave effects"},showCurtain:{control:"boolean",description:"Show aurora curtain effects"},animationMode:{control:{type:"select",options:["flow","pulse","shift","mixed"]},description:"Animation mode for aurora effects"},showControls:{control:"boolean",description:"Show aurora controls"}}},g={args:{intensity:1,speed:1,colorPalette:"arctic",particleCount:50,showParticles:!0,showWaves:!0,showCurtain:!1,animationMode:"flow",showControls:!0},render:a=>s.jsx("div",{className:"glass-relative",children:s.jsx(e,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-blue-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsxs("div",{className:"glass-text-center glass-text-primary max-w-2xl",children:[s.jsx("div",{className:"glass-text-6xl mb-6",children:"🌌"}),s.jsx("h1",{className:"glass-text-4xl glass-font-bold mb-6",children:"Arctic Aurora"}),s.jsx("p",{className:"glass-text-xl text-blue-200 mb-8",children:"Experience the mesmerizing beauty of the northern lights with ethereal blue and green aurora waves dancing across the night sky. This arctic display captures the magic of polar light shows."}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-4 glass-text-sm",children:[s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"❄️"}),s.jsx("div",{className:"glass-font-semibold",children:"Arctic Colors"}),s.jsx("div",{className:"glass-text-secondary",children:"Cool blue & green palette"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"🌊"}),s.jsx("div",{className:"glass-font-semibold",children:"Flowing Waves"}),s.jsx("div",{className:"glass-text-secondary",children:"Smooth, organic movement"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"✨"}),s.jsx("div",{className:"glass-font-semibold",children:"Particle Effects"}),s.jsx("div",{className:"glass-text-secondary",children:"Scattered light particles"})]})]})]})})})})},d={args:{intensity:1.2,speed:.8,colorPalette:"forest",particleCount:40,showParticles:!0,showWaves:!0,showCurtain:!0,animationMode:"pulse",showControls:!0},render:a=>s.jsx("div",{className:"glass-relative",children:s.jsx(e,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-emerald-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsxs("div",{className:"glass-text-center glass-text-primary max-w-2xl",children:[s.jsx("div",{className:"glass-text-6xl mb-6",children:"🌲"}),s.jsx("h1",{className:"glass-text-4xl glass-font-bold mb-6",children:"Forest Aurora"}),s.jsx("p",{className:"glass-text-xl text-green-200 mb-8",children:"Immerse yourself in nature's light show with deep forest greens and earthy aurora effects. Experience the tranquility of woodland aurora displays with pulsing light patterns."}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-4 glass-text-sm",children:[s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"🌿"}),s.jsx("div",{className:"glass-font-semibold",children:"Forest Greens"}),s.jsx("div",{className:"glass-text-secondary",children:"Deep emerald & jade tones"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"💚"}),s.jsx("div",{className:"glass-font-semibold",children:"Pulsing Rhythm"}),s.jsx("div",{className:"glass-text-secondary",children:"Organic breathing effect"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"🌳"}),s.jsx("div",{className:"glass-font-semibold",children:"Curtain Effect"}),s.jsx("div",{className:"glass-text-secondary",children:"Layered aurora curtains"})]})]})]})})})})},c={args:{intensity:1.5,speed:1.2,colorPalette:"sunset",particleCount:60,showParticles:!0,showWaves:!0,showCurtain:!1,animationMode:"shift",showControls:!0},render:a=>s.jsx("div",{className:"glass-relative",children:s.jsx(e,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-pink-600 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsxs("div",{className:"glass-text-center glass-text-primary max-w-2xl",children:[s.jsx("div",{className:"glass-text-6xl mb-6",children:"🌅"}),s.jsx("h1",{className:"glass-text-4xl glass-font-bold mb-6",children:"Sunset Aurora"}),s.jsx("p",{className:"glass-text-xl text-orange-200 mb-8",children:"Witness the spectacular fusion of sunset colors with aurora effects. Experience shifting color palettes that dance like fire in the evening sky."}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-4 glass-text-sm",children:[s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"🔥"}),s.jsx("div",{className:"glass-font-semibold",children:"Fiery Colors"}),s.jsx("div",{className:"glass-text-secondary",children:"Orange, pink & purple hues"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"🌈"}),s.jsx("div",{className:"glass-font-semibold",children:"Color Shifting"}),s.jsx("div",{className:"glass-text-secondary",children:"Dynamic color transitions"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"⭐"}),s.jsx("div",{className:"glass-font-semibold",children:"Intense Display"}),s.jsx("div",{className:"glass-text-secondary",children:"High-intensity effects"})]})]})]})})})})},o={args:{intensity:.8,speed:.6,colorPalette:"ocean",particleCount:35,showParticles:!0,showWaves:!0,showCurtain:!0,animationMode:"mixed",showControls:!0},render:a=>s.jsx("div",{className:"glass-relative",children:s.jsx(e,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-cyan-800 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsxs("div",{className:"glass-text-center glass-text-primary max-w-2xl",children:[s.jsx("div",{className:"glass-text-6xl mb-6",children:"🌊"}),s.jsx("h1",{className:"glass-text-4xl glass-font-bold mb-6",children:"Ocean Aurora"}),s.jsx("p",{className:"glass-text-xl text-cyan-200 mb-8",children:"Dive into the depths of oceanic aurora with calming blue and teal colors. Experience the gentle ebb and flow of underwater light patterns."}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-4 glass-text-sm",children:[s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"🏄‍♂️"}),s.jsx("div",{className:"glass-font-semibold",children:"Ocean Blues"}),s.jsx("div",{className:"glass-text-secondary",children:"Deep sea & coastal colors"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"🌊"}),s.jsx("div",{className:"glass-font-semibold",children:"Wave Motion"}),s.jsx("div",{className:"glass-text-secondary",children:"Fluid, flowing animations"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"🐚"}),s.jsx("div",{className:"glass-font-semibold",children:"Serene Effect"}),s.jsx("div",{className:"glass-text-secondary",children:"Calming, peaceful display"})]})]})]})})})})},n={args:{intensity:1.3,speed:1,colorPalette:"cosmic",particleCount:70,showParticles:!0,showWaves:!0,showCurtain:!0,animationMode:"mixed",showControls:!0},render:a=>s.jsx("div",{className:"glass-relative",children:s.jsx(e,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-indigo-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsxs("div",{className:"glass-text-center glass-text-primary max-w-2xl",children:[s.jsx("div",{className:"glass-text-6xl mb-6",children:"🌌"}),s.jsx("h1",{className:"glass-text-4xl glass-font-bold mb-6",children:"Cosmic Aurora"}),s.jsx("p",{className:"glass-text-xl text-purple-200 mb-8",children:"Journey through the cosmos with deep purple and violet aurora effects. Experience the mystery and wonder of universal light displays."}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-4 glass-text-sm",children:[s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"🪐"}),s.jsx("div",{className:"glass-font-semibold",children:"Cosmic Colors"}),s.jsx("div",{className:"glass-text-secondary",children:"Deep space color palette"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"🌟"}),s.jsx("div",{className:"glass-font-semibold",children:"Mixed Effects"}),s.jsx("div",{className:"glass-text-secondary",children:"Combined animation modes"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"✨"}),s.jsx("div",{className:"glass-font-semibold",children:"Stellar Display"}),s.jsx("div",{className:"glass-text-secondary",children:"High particle density"})]})]})]})})})})},m={args:{intensity:.6,speed:.4,colorPalette:"arctic",particleCount:20,showParticles:!0,showWaves:!0,showCurtain:!1,animationMode:"flow",showControls:!1},render:a=>s.jsx("div",{className:"glass-relative",children:s.jsx(e,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-surface-subtle glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsxs("div",{className:"glass-text-center max-w-2xl",children:[s.jsx("div",{className:"glass-text-4xl mb-6",children:"🌟"}),s.jsx("h1",{className:"glass-text-2xl glass-font-bold glass-text-secondary mb-6",children:"Minimal Aurora"}),s.jsx("p",{className:"glass-text-secondary",children:"A subtle aurora display perfect for clean, minimal designs. Gentle effects that enhance without overwhelming the content."})]})})})})},u={args:{intensity:1,speed:1,colorPalette:"cosmic",particleCount:50,showParticles:!0,showWaves:!0,showCurtain:!0,animationMode:"mixed",showControls:!0},render:a=>s.jsx("div",{className:"glass-relative",children:s.jsx(e,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-p-8",children:s.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-primary glass-text-center mb-12",children:"Aurora Pro Showcase"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8 mb-8",children:[s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"🌌 Dynamic Effects"}),s.jsxs("ul",{className:"glass-text-primary/80 glass-space-y-2 glass-text-sm",children:[s.jsx("li",{children:"• Flowing aurora waves with organic movement"}),s.jsx("li",{children:"• Pulsing intensity for breathing effects"}),s.jsx("li",{children:"• Color shifting through cosmic palettes"}),s.jsx("li",{children:"• Mixed animations combining all modes"})]})]}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"✨ Visual Features"}),s.jsxs("ul",{className:"glass-text-primary/80 glass-space-y-2 glass-text-sm",children:[s.jsx("li",{children:"• Multiple aurora wave layers"}),s.jsx("li",{children:"• Particle systems with realistic physics"}),s.jsx("li",{children:"• Curtain effects for depth"}),s.jsx("li",{children:"• Atmospheric lighting and fog"})]})]})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-4 glass-gap-6",children:[s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-text-center glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-2",children:"🎨"}),s.jsx("div",{className:"glass-text-primary glass-font-semibold",children:"Color Palettes"}),s.jsx("div",{className:"glass-text-primary/60 glass-text-sm",children:"6+ themes"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-text-center glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-2",children:"🎭"}),s.jsx("div",{className:"glass-text-primary glass-font-semibold",children:"Animation Modes"}),s.jsx("div",{className:"glass-text-primary/60 glass-text-sm",children:"4 styles"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-text-center glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-2",children:"⚡"}),s.jsx("div",{className:"glass-text-primary glass-font-semibold",children:"Performance"}),s.jsx("div",{className:"glass-text-primary/60 glass-text-sm",children:"60fps"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-text-center glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-2",children:"🎛️"}),s.jsx("div",{className:"glass-text-primary glass-font-semibold",children:"Controls"}),s.jsx("div",{className:"glass-text-primary/60 glass-text-sm",children:"Interactive"})]})]})]})})})})},x={args:{intensity:1.2,speed:1,colorPalette:"custom",customColors:["#ff6b6b","#4ecdc4","#45b7d1"],particleCount:45,showParticles:!0,showWaves:!0,showCurtain:!1,animationMode:"shift",showControls:!0},render:a=>s.jsx("div",{className:"glass-relative",children:s.jsx(e,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-slate-800 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsxs("div",{className:"glass-text-center glass-text-primary max-w-2xl",children:[s.jsx("div",{className:"glass-text-6xl mb-6",children:"🎨"}),s.jsx("h1",{className:"glass-text-4xl glass-font-bold mb-6",children:"Custom Aurora"}),s.jsx("p",{className:"glass-text-xl text-gray-300 mb-8",children:"Create your own aurora experience with custom color palettes. Mix and match colors to create unique atmospheric effects."}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary glass-mb-4",children:"Custom Colors"}),s.jsxs("div",{className:"glass-flex glass-justify-center glass-gap-4 glass-mb-4",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-6 glass-h-6 glass-radius-full glass-surface-red"}),s.jsx("span",{className:"glass-text-primary/80 glass-text-sm",children:"Coral Red"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-6 glass-h-6 glass-radius-full bg-teal-400"}),s.jsx("span",{className:"glass-text-primary/80 glass-text-sm",children:"Teal"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-6 glass-h-6 glass-radius-full glass-surface-blue"}),s.jsx("span",{className:"glass-text-primary/80 glass-text-sm",children:"Sky Blue"})]})]}),s.jsx("p",{className:"glass-text-primary/60 glass-text-sm",children:"Customize the aurora colors to match your brand or create unique visual experiences"})]})]})})})})};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    intensity: 1.0,
    speed: 1.0,
    colorPalette: 'arctic',
    particleCount: 50,
    showParticles: true,
    showWaves: true,
    showCurtain: false,
    animationMode: 'flow',
    showControls: true
  },
  render: args => <div className="glass-relative">
      <AuroraPro {...args}>
        <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-blue-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
          <div className="glass-text-center glass-text-primary max-w-2xl">
            <div className="glass-text-6xl mb-6">🌌</div>
            <h1 className="glass-text-4xl glass-font-bold mb-6">Arctic Aurora</h1>
            <p className="glass-text-xl text-blue-200 mb-8">
              Experience the mesmerizing beauty of the northern lights with ethereal blue and green aurora waves
              dancing across the night sky. This arctic display captures the magic of polar light shows.
            </p>
            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-4 glass-text-sm">
              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard">
                <div className="glass-text-2xl glass-mb-2">❄️</div>
                <div className="glass-font-semibold">Arctic Colors</div>
                <div className="glass-text-secondary">Cool blue & green palette</div>
              </div>
              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard">
                <div className="glass-text-2xl glass-mb-2">🌊</div>
                <div className="glass-font-semibold">Flowing Waves</div>
                <div className="glass-text-secondary">Smooth, organic movement</div>
              </div>
              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard">
                <div className="glass-text-2xl glass-mb-2">✨</div>
                <div className="glass-font-semibold">Particle Effects</div>
                <div className="glass-text-secondary">Scattered light particles</div>
              </div>
            </div>
          </div>
        </div>
      </AuroraPro>
    </div>
}`,...g.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    intensity: 1.2,
    speed: 0.8,
    colorPalette: 'forest',
    particleCount: 40,
    showParticles: true,
    showWaves: true,
    showCurtain: true,
    animationMode: 'pulse',
    showControls: true
  },
  render: args => <div className="glass-relative">
      <AuroraPro {...args}>
        <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-emerald-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
          <div className="glass-text-center glass-text-primary max-w-2xl">
            <div className="glass-text-6xl mb-6">🌲</div>
            <h1 className="glass-text-4xl glass-font-bold mb-6">Forest Aurora</h1>
            <p className="glass-text-xl text-green-200 mb-8">
              Immerse yourself in nature's light show with deep forest greens and earthy aurora effects.
              Experience the tranquility of woodland aurora displays with pulsing light patterns.
            </p>
            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-4 glass-text-sm">
              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard">
                <div className="glass-text-2xl glass-mb-2">🌿</div>
                <div className="glass-font-semibold">Forest Greens</div>
                <div className="glass-text-secondary">Deep emerald & jade tones</div>
              </div>
              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard">
                <div className="glass-text-2xl glass-mb-2">💚</div>
                <div className="glass-font-semibold">Pulsing Rhythm</div>
                <div className="glass-text-secondary">Organic breathing effect</div>
              </div>
              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard">
                <div className="glass-text-2xl glass-mb-2">🌳</div>
                <div className="glass-font-semibold">Curtain Effect</div>
                <div className="glass-text-secondary">Layered aurora curtains</div>
              </div>
            </div>
          </div>
        </div>
      </AuroraPro>
    </div>
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    intensity: 1.5,
    speed: 1.2,
    colorPalette: 'sunset',
    particleCount: 60,
    showParticles: true,
    showWaves: true,
    showCurtain: false,
    animationMode: 'shift',
    showControls: true
  },
  render: args => <div className="glass-relative">
      <AuroraPro {...args}>
        <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-pink-600 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
          <div className="glass-text-center glass-text-primary max-w-2xl">
            <div className="glass-text-6xl mb-6">🌅</div>
            <h1 className="glass-text-4xl glass-font-bold mb-6">Sunset Aurora</h1>
            <p className="glass-text-xl text-orange-200 mb-8">
              Witness the spectacular fusion of sunset colors with aurora effects.
              Experience shifting color palettes that dance like fire in the evening sky.
            </p>
            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-4 glass-text-sm">
              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard">
                <div className="glass-text-2xl glass-mb-2">🔥</div>
                <div className="glass-font-semibold">Fiery Colors</div>
                <div className="glass-text-secondary">Orange, pink & purple hues</div>
              </div>
              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard">
                <div className="glass-text-2xl glass-mb-2">🌈</div>
                <div className="glass-font-semibold">Color Shifting</div>
                <div className="glass-text-secondary">Dynamic color transitions</div>
              </div>
              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard">
                <div className="glass-text-2xl glass-mb-2">⭐</div>
                <div className="glass-font-semibold">Intense Display</div>
                <div className="glass-text-secondary">High-intensity effects</div>
              </div>
            </div>
          </div>
        </div>
      </AuroraPro>
    </div>
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    intensity: 0.8,
    speed: 0.6,
    colorPalette: 'ocean',
    particleCount: 35,
    showParticles: true,
    showWaves: true,
    showCurtain: true,
    animationMode: 'mixed',
    showControls: true
  },
  render: args => <div className="glass-relative">
      <AuroraPro {...args}>
        <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-cyan-800 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
          <div className="glass-text-center glass-text-primary max-w-2xl">
            <div className="glass-text-6xl mb-6">🌊</div>
            <h1 className="glass-text-4xl glass-font-bold mb-6">Ocean Aurora</h1>
            <p className="glass-text-xl text-cyan-200 mb-8">
              Dive into the depths of oceanic aurora with calming blue and teal colors.
              Experience the gentle ebb and flow of underwater light patterns.
            </p>
            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-4 glass-text-sm">
              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard">
                <div className="glass-text-2xl glass-mb-2">🏄‍♂️</div>
                <div className="glass-font-semibold">Ocean Blues</div>
                <div className="glass-text-secondary">Deep sea & coastal colors</div>
              </div>
              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard">
                <div className="glass-text-2xl glass-mb-2">🌊</div>
                <div className="glass-font-semibold">Wave Motion</div>
                <div className="glass-text-secondary">Fluid, flowing animations</div>
              </div>
              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard">
                <div className="glass-text-2xl glass-mb-2">🐚</div>
                <div className="glass-font-semibold">Serene Effect</div>
                <div className="glass-text-secondary">Calming, peaceful display</div>
              </div>
            </div>
          </div>
        </div>
      </AuroraPro>
    </div>
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    intensity: 1.3,
    speed: 1.0,
    colorPalette: 'cosmic',
    particleCount: 70,
    showParticles: true,
    showWaves: true,
    showCurtain: true,
    animationMode: 'mixed',
    showControls: true
  },
  render: args => <div className="glass-relative">
      <AuroraPro {...args}>
        <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-indigo-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
          <div className="glass-text-center glass-text-primary max-w-2xl">
            <div className="glass-text-6xl mb-6">🌌</div>
            <h1 className="glass-text-4xl glass-font-bold mb-6">Cosmic Aurora</h1>
            <p className="glass-text-xl text-purple-200 mb-8">
              Journey through the cosmos with deep purple and violet aurora effects.
              Experience the mystery and wonder of universal light displays.
            </p>
            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-4 glass-text-sm">
              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard">
                <div className="glass-text-2xl glass-mb-2">🪐</div>
                <div className="glass-font-semibold">Cosmic Colors</div>
                <div className="glass-text-secondary">Deep space color palette</div>
              </div>
              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard">
                <div className="glass-text-2xl glass-mb-2">🌟</div>
                <div className="glass-font-semibold">Mixed Effects</div>
                <div className="glass-text-secondary">Combined animation modes</div>
              </div>
              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-contrast-guard">
                <div className="glass-text-2xl glass-mb-2">✨</div>
                <div className="glass-font-semibold">Stellar Display</div>
                <div className="glass-text-secondary">High particle density</div>
              </div>
            </div>
          </div>
        </div>
      </AuroraPro>
    </div>
}`,...n.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    intensity: 0.6,
    speed: 0.4,
    colorPalette: 'arctic',
    particleCount: 20,
    showParticles: true,
    showWaves: true,
    showCurtain: false,
    animationMode: 'flow',
    showControls: false
  },
  render: args => <div className="glass-relative">
      <AuroraPro {...args}>
        <div className="glass-min-glass-h-screen glass-surface-subtle glass-flex glass-items-center glass-justify-center glass-p-8">
          <div className="glass-text-center max-w-2xl">
            <div className="glass-text-4xl mb-6">🌟</div>
            <h1 className="glass-text-2xl glass-font-bold glass-text-secondary mb-6">Minimal Aurora</h1>
            <p className="glass-text-secondary">
              A subtle aurora display perfect for clean, minimal designs.
              Gentle effects that enhance without overwhelming the content.
            </p>
          </div>
        </div>
      </AuroraPro>
    </div>
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    intensity: 1.0,
    speed: 1.0,
    colorPalette: 'cosmic',
    particleCount: 50,
    showParticles: true,
    showWaves: true,
    showCurtain: true,
    animationMode: 'mixed',
    showControls: true
  },
  render: args => <div className="glass-relative">
      <AuroraPro {...args}>
        <div className="glass-min-glass-h-screen glass-p-8">
          <div className="max-w-6xl glass-mx-auto">
            <h1 className="glass-text-4xl glass-font-bold glass-text-primary glass-text-center mb-12">
              Aurora Pro Showcase
            </h1>

            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8 mb-8">
              <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">🌌 Dynamic Effects</h3>
                <ul className="glass-text-primary/80 glass-space-y-2 glass-text-sm">
                  <li>• Flowing aurora waves with organic movement</li>
                  <li>• Pulsing intensity for breathing effects</li>
                  <li>• Color shifting through cosmic palettes</li>
                  <li>• Mixed animations combining all modes</li>
                </ul>
              </div>

              <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">✨ Visual Features</h3>
                <ul className="glass-text-primary/80 glass-space-y-2 glass-text-sm">
                  <li>• Multiple aurora wave layers</li>
                  <li>• Particle systems with realistic physics</li>
                  <li>• Curtain effects for depth</li>
                  <li>• Atmospheric lighting and fog</li>
                </ul>
              </div>
            </div>

            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-4 glass-gap-6">
              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-text-center glass-contrast-guard">
                <div className="glass-text-3xl glass-mb-2">🎨</div>
                <div className="glass-text-primary glass-font-semibold">Color Palettes</div>
                <div className="glass-text-primary/60 glass-text-sm">6+ themes</div>
              </div>

              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-text-center glass-contrast-guard">
                <div className="glass-text-3xl glass-mb-2">🎭</div>
                <div className="glass-text-primary glass-font-semibold">Animation Modes</div>
                <div className="glass-text-primary/60 glass-text-sm">4 styles</div>
              </div>

              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-text-center glass-contrast-guard">
                <div className="glass-text-3xl glass-mb-2">⚡</div>
                <div className="glass-text-primary glass-font-semibold">Performance</div>
                <div className="glass-text-primary/60 glass-text-sm">60fps</div>
              </div>

              <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-lg glass-border glass-border-white/20 glass-text-center glass-contrast-guard">
                <div className="glass-text-3xl glass-mb-2">🎛️</div>
                <div className="glass-text-primary glass-font-semibold">Controls</div>
                <div className="glass-text-primary/60 glass-text-sm">Interactive</div>
              </div>
            </div>
          </div>
        </div>
      </AuroraPro>
    </div>
}`,...u.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    intensity: 1.2,
    speed: 1.0,
    colorPalette: 'custom',
    customColors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    particleCount: 45,
    showParticles: true,
    showWaves: true,
    showCurtain: false,
    animationMode: 'shift',
    showControls: true
  },
  render: args => <div className="glass-relative">
      <AuroraPro {...args}>
        <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-slate-800 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
          <div className="glass-text-center glass-text-primary max-w-2xl">
            <div className="glass-text-6xl mb-6">🎨</div>
            <h1 className="glass-text-4xl glass-font-bold mb-6">Custom Aurora</h1>
            <p className="glass-text-xl text-gray-300 mb-8">
              Create your own aurora experience with custom color palettes.
              Mix and match colors to create unique atmospheric effects.
            </p>
            <div className="glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard">
              <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-4">Custom Colors</h3>
              <div className="glass-flex glass-justify-center glass-gap-4 glass-mb-4">
                <div className="glass-flex glass-items-center glass-gap-2">
                  <div className="glass-w-6 glass-h-6 glass-radius-full glass-surface-red"></div>
                  <span className="glass-text-primary/80 glass-text-sm">Coral Red</span>
                </div>
                <div className="glass-flex glass-items-center glass-gap-2">
                  <div className="glass-w-6 glass-h-6 glass-radius-full bg-teal-400"></div>
                  <span className="glass-text-primary/80 glass-text-sm">Teal</span>
                </div>
                <div className="glass-flex glass-items-center glass-gap-2">
                  <div className="glass-w-6 glass-h-6 glass-radius-full glass-surface-blue"></div>
                  <span className="glass-text-primary/80 glass-text-sm">Sky Blue</span>
                </div>
              </div>
              <p className="glass-text-primary/60 glass-text-sm">
                Customize the aurora colors to match your brand or create unique visual experiences
              </p>
            </div>
          </div>
        </div>
      </AuroraPro>
    </div>
}`,...x.parameters?.docs?.source}}};const P=["ArcticAurora","ForestAurora","SunsetAurora","OceanAurora","CosmicAurora","MinimalAurora","AuroraShowcase","CustomAurora"];export{g as ArcticAurora,u as AuroraShowcase,n as CosmicAurora,x as CustomAurora,d as ForestAurora,m as MinimalAurora,o as OceanAurora,c as SunsetAurora,P as __namedExportsOrder,C as default};
