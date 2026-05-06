import{r as o,h as es,b as as,j as s,m as P,C as k,c as q,d as ls}from"./iframe-DpweptvF.js";import{u as B}from"./use-motion-value-RfypvHDE.js";import{u as F}from"./use-spring-Diq-VcWK.js";import{u as ts}from"./use-scroll-w_zkMk6l.js";import{u as m}from"./use-transform-Bm7YliQ_.js";import{O as rs}from"./OptimizedGlassCore-UOg4NIOz.js";import"./preload-helper-PPVm8Dsz.js";const w=o.forwardRef(({layers:r,className:a,mouseIntensity:c=.5,scrollIntensity:M=.3,perspective:L=1200,autoRotate:N=!1,rotateSpeed:I=.5,interactive:b=!0,debug:D=!1,"aria-label":S,respectMotionPreference:ns=!0},T)=>{const u=o.useRef(null),[j,C]=o.useState(!1),Y=es("parallax-layers"),l=as(),d=B(0),g=B(0),R={damping:25,stiffness:150},V=F(d,R),A=F(g,R),{scrollYProgress:E}=ts({target:u,offset:["start end","end start"]}),[G,W]=o.useState(0);o.useEffect(()=>{if(!N)return;const e=setInterval(()=>{W(t=>t+I)},16);return()=>clearInterval(e)},[N,I]);const $=o.useCallback(e=>{if(!b||!u.current)return;const t=u.current.getBoundingClientRect(),n=(e.clientX-t.left)/t.width-.5,i=(e.clientY-t.top)/t.height-.5;d.set(n),g.set(i)},[b,d,g]),H=o.useCallback(()=>{d.set(0),g.set(0),C(!1)},[d,g]),O=o.useCallback(()=>{C(!0)},[]),X=[...r].sort((e,t)=>t.depth-e.depth);return s.jsxs("div",{ref:T||u,id:Y,className:q("relative overflow-hidden","transform-gpu will-change-transform",a),style:{perspective:l?"none":`${L}px`,transformStyle:l?"flat":"preserve-3d"},onMouseMove:l?void 0:$,onMouseEnter:l?void 0:O,onMouseLeave:l?void 0:H,role:"presentation","aria-label":S||"Parallax layers with interactive effects","aria-hidden":!S,children:[X.map((e,t)=>{const n=e.depth/10,i=1-n,z=m(V,[-.5,.5],[-50*i*c,50*i*c]);m(A,[-.5,.5],[-30*i*c,30*i*c]);const U=m(E,[0,1],[100*n*M,-100*n*M]),J=m(A,[-.5,.5],[15*i*c,-15*i*c]),K=m(V,[-.5,.5],[-15*i*c,15*i*c]),p=Math.round(n*4),Q=p===0?"none":p===1?"subtle":p===2?"medium":p===3?"strong":"intense",Z=(_=>{switch(_){case"sm":return"subtle";case"md":return"medium";case"lg":return"strong";case"xl":return"intense";default:return _}})(e.blur)||Q,ss={x:l?0:z,y:l?0:U,rotateX:l?0:J,rotateY:l?0:N?G:K,z:l?0:e.depth*50,scale:e.scale||1-n*.1,opacity:e.opacity||1-n*.2,transformStyle:l?"flat":"preserve-3d"};return s.jsx(P.div,{initial:{opacity:0,scale:l?1:.9},animate:{opacity:e.opacity||1-n*.2,scale:e.scale||1-n*.1},transition:{duration:l?0:ls.DURATION.slower/1e3,delay:l?0:t*.1},style:{...ss},children:s.jsxs(rs,{intent:"neutral",elevation:j?"level3":"level1",intensity:"medium",glassBlur:Z,depth:Math.min(e.depth,5),className:q("absolute inset-0","transition-all",{transitionDuration:"var(--glass-motion-duration-normal)"},e.className),children:[s.jsx(k,{children:e.content}),D&&s.jsx(k,{children:s.jsxs("div",{className:"glass-absolute glass-top-2 glass-left-2 glass-surface-dark/20 glass-backdrop-blur-sm glass-p-2 glass-radius-sm glass-text-xs glass-text-primary-glass-opacity-90",children:["Layer ",t+1," | Depth: ",e.depth]})})]})},`layer-${t}`)}),b&&!l&&s.jsx(P.div,{className:"glass-absolute glass-bottom-4 glass-right-4 glass-text-primary-glass-opacity-60 glass-text-xs glass-surface-dark/20 glass-backdrop-blur-sm glass-p-2 glass-radius-md",initial:{opacity:0},animate:{opacity:j?1:.5},role:"status","aria-live":"polite",children:s.jsx(k,{children:j?"Move mouse to parallax":"Hover to interact"})})]})});try{w.displayName="GlassParallaxLayers",w.__docgenInfo={description:"",displayName:"GlassParallaxLayers",props:{layers:{defaultValue:null,description:"",name:"layers",required:!0,type:{name:"ParallaxLayer[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},mouseIntensity:{defaultValue:{value:"0.5"},description:"",name:"mouseIntensity",required:!1,type:{name:"number | undefined"}},scrollIntensity:{defaultValue:{value:"0.3"},description:"",name:"scrollIntensity",required:!1,type:{name:"number | undefined"}},perspective:{defaultValue:{value:"1200"},description:"",name:"perspective",required:!1,type:{name:"number | undefined"}},autoRotate:{defaultValue:{value:"false"},description:"",name:"autoRotate",required:!1,type:{name:"boolean | undefined"}},rotateSpeed:{defaultValue:{value:"0.5"},description:"",name:"rotateSpeed",required:!1,type:{name:"number | undefined"}},interactive:{defaultValue:{value:"true"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},debug:{defaultValue:{value:"false"},description:"",name:"debug",required:!1,type:{name:"boolean | undefined"}},"aria-label":{defaultValue:null,description:"Accessible label for the parallax container",name:"aria-label",required:!1,type:{name:"string | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Reduced motion preference",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const fs={title:"Advanced/GlassParallaxLayers",component:w,parameters:{layout:"fullscreen"}},f={args:{layers:[{depth:0,blur:"none",content:s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full",children:s.jsx("h1",{className:"glass-text-6xl glass-font-bold",children:"Foreground"})})},{depth:3,blur:"sm",content:s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full",children:s.jsx("h2",{className:"glass-text-4xl glass-font-semibold glass-text-secondary",children:"Midground"})})},{depth:6,blur:"md",content:s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full",children:s.jsx("div",{className:"glass-grid glass-glass-grid-cols-3 glass-gap-4",children:[1,2,3,4,5,6].map(r=>s.jsx("div",{className:"glass-w-32 glass-h-32 glass-surface-primary glass-radius-lg"},r))})})},{depth:10,blur:"lg",content:s.jsx("div",{className:"glass-absolute glass-inset-0 glass-gradient-primary glass-gradient-primary via-sky-100 glass-gradient-primary dark:glass-gradient-primary dark:via-slate-700 dark:glass-gradient-primary"})}],className:"h-screen",mouseIntensity:.8,scrollIntensity:.5}},h={args:{layers:[{depth:0,blur:"none",scale:1.05,content:s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full glass-p-8",children:s.jsxs("div",{className:"glass-card glass-p-6 max-w-md",children:[s.jsx("h3",{className:"glass-text-2xl glass-font-bold glass-mb-2",children:"Premium Feature"}),s.jsx("p",{className:"glass-text-secondary",children:"This card floats above the others"})]})})},{depth:5,blur:"sm",scale:1,content:s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full glass-p-8",children:s.jsxs("div",{className:"glass-card glass-p-6 max-w-md translate-x-12 translate-y-12",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-mb-2",children:"Standard Feature"}),s.jsx("p",{className:"glass-text-secondary",children:"Middle layer with subtle blur"})]})})},{depth:10,blur:"md",scale:.95,content:s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full glass-p-8",children:s.jsxs("div",{className:"glass-card glass-p-6 max-w-md translate-x-24 translate-y-24",children:[s.jsx("h3",{className:"glass-text-lg glass-mb-2",children:"Background Feature"}),s.jsx("p",{className:"glass-text-secondary opacity-75",children:"Deepest layer with most blur"})]})})}],className:"h-96",mouseIntensity:1,perspective:1500}},x={args:{layers:Array.from({length:6},(r,a)=>({depth:a*2,blur:a===0?"none":a<3?"sm":"md",content:s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full",children:s.jsx("div",{className:"glass-w-64 glass-h-64 glass-surface-primary glass-radius-xl",style:{transform:`rotate(${a*60}deg)`,opacity:1-a*.15}})})})),className:"h-screen",autoRotate:!0,rotateSpeed:.2,interactive:!1}},y={args:{layers:[{depth:0,blur:"none",content:s.jsxs("div",{className:"glass-p-8",children:[s.jsx("h3",{className:"glass-text-xl glass-font-bold glass-mb-4",children:"Real-time Analytics"}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-4 glass-gap-4",children:[85,62,91,45].map((r,a)=>s.jsxs("div",{className:"glass-text-center",children:[s.jsxs("div",{className:"glass-text-3xl glass-font-bold",children:[r,"%"]}),s.jsxs("div",{className:"glass-text-sm glass-text-secondary",children:["Metric ",a+1]})]},a))})]})},{depth:4,blur:"sm",content:s.jsx("div",{className:"glass-absolute glass-inset-0 glass-p-8 pt-24",children:s.jsx("div",{className:"glass-h-full glass-flex glass-items-end justify-around",children:[65,45,80,35,60,75,40].map((r,a)=>s.jsx("div",{className:"glass-surface-info glass-w-12",style:{height:`${r}%`}},a))})})},{depth:8,blur:"md",content:s.jsx("div",{className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center glass-opacity-30",children:s.jsxs("svg",{viewBox:"0 0 400 400",className:"glass-w-full glass-h-full max-w-lg",children:[s.jsx("circle",{cx:"200",cy:"200",r:"180",fill:"none",stroke:"currentColor",strokeWidth:"2"}),s.jsx("circle",{cx:"200",cy:"200",r:"140",fill:"none",stroke:"currentColor",strokeWidth:"1"}),s.jsx("circle",{cx:"200",cy:"200",r:"100",fill:"none",stroke:"currentColor",strokeWidth:"1"})]})})}],className:"h-96",mouseIntensity:.6,scrollIntensity:.3}},v={args:{layers:Array.from({length:5},(r,a)=>({depth:a*2.5,content:s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full",children:s.jsxs("div",{className:"glass-surface-primary glass-p-4 glass-radius-lg",children:["Layer ",a+1]})})})),className:"h-96",debug:!0,mouseIntensity:1,scrollIntensity:.5}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    layers: [{
      depth: 0,
      blur: 'none',
      content: <div className="glass-flex glass-items-center glass-justify-center glass-h-full">
            <h1 className="glass-text-6xl glass-font-bold">Foreground</h1>
          </div>
    }, {
      depth: 3,
      blur: 'sm',
      content: <div className="glass-flex glass-items-center glass-justify-center glass-h-full">
            <h2 className="glass-text-4xl glass-font-semibold glass-text-secondary">Midground</h2>
          </div>
    }, {
      depth: 6,
      blur: 'md',
      content: <div className="glass-flex glass-items-center glass-justify-center glass-h-full">
            <div className="glass-grid glass-glass-grid-cols-3 glass-gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="glass-w-32 glass-h-32 glass-surface-primary glass-radius-lg" />)}
            </div>
          </div>
    }, {
      depth: 10,
      blur: 'lg',
      content: <div className="glass-absolute glass-inset-0 glass-gradient-primary glass-gradient-primary via-sky-100 glass-gradient-primary dark:glass-gradient-primary dark:via-slate-700 dark:glass-gradient-primary" />
    }],
    className: "h-screen",
    mouseIntensity: 0.8,
    scrollIntensity: 0.5
  }
}`,...f.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    layers: [{
      depth: 0,
      blur: 'none',
      scale: 1.05,
      content: <div className="glass-flex glass-items-center glass-justify-center glass-h-full glass-p-8">
            <div className="glass-card glass-p-6 max-w-md">
              <h3 className="glass-text-2xl glass-font-bold glass-mb-2">Premium Feature</h3>
              <p className="glass-text-secondary">This card floats above the others</p>
            </div>
          </div>
    }, {
      depth: 5,
      blur: 'sm',
      scale: 1,
      content: <div className="glass-flex glass-items-center glass-justify-center glass-h-full glass-p-8">
            <div className="glass-card glass-p-6 max-w-md translate-x-12 translate-y-12">
              <h3 className="glass-text-xl glass-font-semibold glass-mb-2">Standard Feature</h3>
              <p className="glass-text-secondary">Middle layer with subtle blur</p>
            </div>
          </div>
    }, {
      depth: 10,
      blur: 'md',
      scale: 0.95,
      content: <div className="glass-flex glass-items-center glass-justify-center glass-h-full glass-p-8">
            <div className="glass-card glass-p-6 max-w-md translate-x-24 translate-y-24">
              <h3 className="glass-text-lg glass-mb-2">Background Feature</h3>
              <p className="glass-text-secondary opacity-75">Deepest layer with most blur</p>
            </div>
          </div>
    }],
    className: "h-96",
    mouseIntensity: 1,
    perspective: 1500
  }
}`,...h.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    layers: Array.from({
      length: 6
    }, (_, i) => ({
      depth: i * 2,
      blur: i === 0 ? 'none' : i < 3 ? 'sm' : 'md',
      content: <div className="glass-flex glass-items-center glass-justify-center glass-h-full">
          <div className="glass-w-64 glass-h-64 glass-surface-primary glass-radius-xl" style={{
          transform: \`rotate(\${i * 60}deg)\`,
          opacity: 1 - i * 0.15
        }} />
        </div>
    })),
    className: "h-screen",
    autoRotate: true,
    rotateSpeed: 0.2,
    interactive: false
  }
}`,...x.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    layers: [{
      depth: 0,
      blur: 'none',
      content: <div className="glass-p-8">
            <h3 className="glass-text-xl glass-font-bold glass-mb-4">Real-time Analytics</h3>
            <div className="glass-grid glass-glass-grid-cols-4 glass-gap-4">
              {[85, 62, 91, 45].map((value, i) => <div key={i} className="glass-text-center">
                  <div className="glass-text-3xl glass-font-bold">{value}%</div>
                  <div className="glass-text-sm glass-text-secondary">Metric {i + 1}</div>
                </div>)}
            </div>
          </div>
    }, {
      depth: 4,
      blur: 'sm',
      content: <div className="glass-absolute glass-inset-0 glass-p-8 pt-24">
            <div className="glass-h-full glass-flex glass-items-end justify-around">
              {[65, 45, 80, 35, 60, 75, 40].map((height, i) => <div key={i} className="glass-surface-info glass-w-12" style={{
            height: \`\${height}%\`
          }} />)}
            </div>
          </div>
    }, {
      depth: 8,
      blur: 'md',
      content: <div className="glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center glass-opacity-30">
            <svg viewBox="0 0 400 400" className="glass-w-full glass-h-full max-w-lg">
              <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
    }],
    className: "h-96",
    mouseIntensity: 0.6,
    scrollIntensity: 0.3
  }
}`,...y.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    layers: Array.from({
      length: 5
    }, (_, i) => ({
      depth: i * 2.5,
      content: <div className="glass-flex glass-items-center glass-justify-center glass-h-full">
          <div className="glass-surface-primary glass-p-4 glass-radius-lg">
            Layer {i + 1}
          </div>
        </div>
    })),
    className: "h-96",
    debug: true,
    mouseIntensity: 1,
    scrollIntensity: 0.5
  }
}`,...v.parameters?.docs?.source}}};const hs=["HeroSection","CardStack","AutoRotating","DataVisualization","InteractiveDebug"];export{x as AutoRotating,h as CardStack,y as DataVisualization,f as HeroSection,v as InteractiveDebug,hs as __namedExportsOrder,fs as default};
