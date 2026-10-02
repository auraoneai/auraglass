import{r,a as I,j as e,c as N}from"./iframe-DFMMcocb.js";import{u as A}from"./a11y-Q0mX7KvA.js";import{O as T}from"./OptimizedGlassCore-1D6AE-uZ.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-iDxBLJQX.js";const _=(n,i,m)=>{const[c,O]=r.useState(60),[j,M]=r.useState(1),u=r.useRef(0),p=r.useRef(performance.now());return r.useEffect(()=>{let t;const y=()=>{const s=performance.now();if(u.current++,s-p.current>=i){const f=u.current*1e3/(s-p.current);O(f),M(f/n),u.current=0,p.current=s}t=requestAnimationFrame(y)};return t=requestAnimationFrame(y),()=>{t&&cancelAnimationFrame(t)}},[n,i]),{currentFps:c,performanceScore:j}},d=r.forwardRef(({children:n,initialOptimizationLevel:i="none",autoOptimize:m=!0,performanceThreshold:c=.8,glassIntensity:O=.6,className:j,style:M,targetFps:u=60,checkInterval:p=1e3,showIndicator:t=!1,preferReducedMotion:y,preserveBlur:s=!0,onOptimizationChange:f,maxOptimizationLevel:S="heavy","aria-label":C="Optimized glass container",role:q="region",...w},R)=>{const[a,V]=r.useState(i),k=I(),v=y??k,F=A(),{currentFps:G,performanceScore:o}=_(u,p);r.useEffect(()=>{if(!m)return;const l=["none","light","moderate","heavy"].indexOf(S);let g=a;if(o<c){const h=["none","light","moderate","heavy"].indexOf(a);h<l&&(g=["none","light","moderate","heavy"][h+1])}else if(o>c+.1){const h=["none","light","moderate","heavy"].indexOf(a);h>0&&(g=["none","light","moderate","heavy"][h-1])}g!==a&&(V(g),f?.(g))},[m,o,c,a,S,f]);const x=(()=>{const l=v?"subtle":"medium";switch(a){case"none":return{intensity:"ultra",performanceMode:"ultra",animation:v?"none":"float",depth:4};case"light":return{intensity:"strong",performanceMode:"high",animation:v?"none":"gentle",depth:3};case"moderate":return{intensity:l,performanceMode:"medium",animation:"none",depth:2};case"heavy":return{intensity:"subtle",performanceMode:"low",animation:"none",depth:1};default:return{intensity:l,performanceMode:"medium",animation:v?"none":"gentle",depth:2}}})(),L=()=>{if(!t)return null;const l=()=>o>=.9?"text-green-400":o>=.7?"text-yellow-400":"text-red-400";return e.jsxs("div",{className:"glass-absolute glass-top-2 glass-right-2 glass-z-50 glass-surface-dark/50 glass-text-primary glass-p-2 glass-radius-md glass-text-xs glass-font-mono",children:[e.jsxs("div",{children:["FPS:"," ",e.jsx("span",{className:l(),children:Math.round(G)})]}),e.jsxs("div",{children:["Level:"," ",e.jsx("span",{className:"glass-text-primary",children:a})]}),e.jsxs("div",{children:["Score:"," ",e.jsxs("span",{className:l(),children:[(o*100).toFixed(0),"%"]})]})]})};return e.jsxs(T,{ref:R,id:F,intent:"neutral",elevation:"level2",intensity:x.intensity,depth:x.depth,tint:"neutral",border:"subtle",animation:x.animation,performanceMode:x.performanceMode,role:q,"aria-label":C,"aria-live":t?"polite":void 0,"aria-atomic":t?"true":void 0,className:N("relative",{"glass-backdrop-blur-xl":a==="none"&&s,"glass-backdrop-blur-lg":a==="light"&&s,"glass-backdrop-blur-md":a==="moderate"&&s,"glass-backdrop-blur-sm":a==="heavy"&&s},j),style:{"--glass-opacity":O*(a==="heavy"?.5:1),...M||{}},...w,children:[e.jsx(L,{}),n]})});d.displayName="OptimizedGlassContainer";try{d.displayName="OptimizedGlassContainer",d.__docgenInfo={description:`OptimizedGlassContainer Component
A container that automatically adjusts glass effects based on performance`,displayName:"OptimizedGlassContainer",props:{initialOptimizationLevel:{defaultValue:{value:"none"},description:"",name:"initialOptimizationLevel",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"light"'},{value:'"moderate"'},{value:'"heavy"'}]}},autoOptimize:{defaultValue:{value:"true"},description:"",name:"autoOptimize",required:!1,type:{name:"boolean | undefined"}},performanceThreshold:{defaultValue:{value:"0.8"},description:"",name:"performanceThreshold",required:!1,type:{name:"number | undefined"}},glassIntensity:{defaultValue:{value:"0.6"},description:"",name:"glassIntensity",required:!1,type:{name:"number | undefined"}},targetFps:{defaultValue:{value:"60"},description:"",name:"targetFps",required:!1,type:{name:"number | undefined"}},checkInterval:{defaultValue:{value:"1000"},description:"",name:"checkInterval",required:!1,type:{name:"number | undefined"}},showIndicator:{defaultValue:{value:"false"},description:"",name:"showIndicator",required:!1,type:{name:"boolean | undefined"}},preferReducedMotion:{defaultValue:null,description:"",name:"preferReducedMotion",required:!1,type:{name:"boolean | undefined"}},preserveBlur:{defaultValue:{value:"true"},description:"",name:"preserveBlur",required:!1,type:{name:"boolean | undefined"}},onOptimizationChange:{defaultValue:null,description:"",name:"onOptimizationChange",required:!1,type:{name:"((level: string) => void) | undefined"}},maxOptimizationLevel:{defaultValue:{value:"heavy"},description:"",name:"maxOptimizationLevel",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"light"'},{value:'"moderate"'},{value:'"heavy"'}]}},"aria-label":{defaultValue:{value:"Optimized glass container"},description:"Accessibility label for screen readers",name:"aria-label",required:!1,type:{name:"string | undefined"}},role:{defaultValue:{value:"region"},description:"Accessibility role for semantic meaning",name:"role",required:!1,type:{name:"string | undefined"}}}}}catch{}const K={title:"Surfaces/App Shells + Layout/Optimized Glass Container",component:d,parameters:{layout:"centered",docs:{description:{component:"A glass morphism optimizedglasscontainer component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},b={render:n=>e.jsx(d,{...n,autoOptimize:!1,initialOptimizationLevel:"light",className:N("glass-w-full glass-max-w-xl glass-radius-3xl glass-p-6",n.className),children:e.jsxs("div",{style:{display:"grid",gap:16,color:"#172033",minWidth:0},children:[e.jsxs("div",{children:[e.jsx("p",{style:{margin:0,color:"#526071",fontSize:12,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase"},children:"Adaptive rendering"}),e.jsx("h2",{style:{margin:"5px 0 4px",fontSize:24,lineHeight:1.15},children:"Optimized liquid glass"}),e.jsx("p",{style:{margin:0,color:"#526071",lineHeight:1.5},children:"Material depth responds to available performance while content and layout remain stable."})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 130px), 1fr))",gap:10},children:[["Target","60 FPS"],["Material","Light frost"],["Motion","Reduced-safe"]].map(([i,m])=>e.jsxs("div",{style:{padding:14,borderRadius:16,border:"1px solid rgba(80,102,130,.16)",background:"rgba(255,255,255,.22)"},children:[e.jsx("small",{style:{display:"block",color:"#526071"},children:i}),e.jsx("strong",{style:{display:"block",marginTop:4},children:m})]},i))})]})}),args:{className:""}},z={render:n=>e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:e.jsx(d,{...n,children:"Default"})}),args:{}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <OptimizedGlassContainer {...args} autoOptimize={false} initialOptimizationLevel="light" className={cn("glass-w-full glass-max-w-xl glass-radius-3xl glass-p-6", args.className)}>
      <div style={{
      display: 'grid',
      gap: 16,
      color: '#172033',
      minWidth: 0
    }}>
        <div>
          <p style={{
          margin: 0,
          color: '#526071',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '.06em',
          textTransform: 'uppercase'
        }}>Adaptive rendering</p>
          <h2 style={{
          margin: '5px 0 4px',
          fontSize: 24,
          lineHeight: 1.15
        }}>Optimized liquid glass</h2>
          <p style={{
          margin: 0,
          color: '#526071',
          lineHeight: 1.5
        }}>Material depth responds to available performance while content and layout remain stable.</p>
        </div>
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))',
        gap: 10
      }}>
          {[["Target", "60 FPS"], ["Material", "Light frost"], ["Motion", "Reduced-safe"]].map(([label, value]) => <div key={label} style={{
          padding: 14,
          borderRadius: 16,
          border: '1px solid rgba(80,102,130,.16)',
          background: 'rgba(255,255,255,.22)'
        }}>
              <small style={{
            display: 'block',
            color: '#526071'
          }}>{label}</small>
              <strong style={{
            display: 'block',
            marginTop: 4
          }}>{value}</strong>
            </div>)}
        </div>
      </div>
    </OptimizedGlassContainer>,
  args: {
    className: ''
  }
}`,...b.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <OptimizedGlassContainer {...args}>
        Default
      </OptimizedGlassContainer>
    </div>,
  args: {}
}`,...z.parameters?.docs?.source}}};const Q=["Default","Variants"];export{b as Default,z as Variants,Q as __namedExportsOrder,K as default};
