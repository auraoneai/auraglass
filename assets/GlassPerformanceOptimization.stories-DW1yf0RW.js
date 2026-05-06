import{i as F,k as T,r as d,p as H,l as $,j as s,m as w,c as v,g as p,e as W,R as Y}from"./iframe-rcK9Xf1b.js";import"./preload-helper-PPVm8Dsz.js";function J(){!F.current&&T();const[e]=d.useState(H.current);return e}const K={some:0,all:1};function Q(e,l,{root:t,margin:a,amount:r="some"}={}){const n=$(e),i=new WeakMap,c=x=>{x.forEach(g=>{const u=i.get(g.target);if(g.isIntersecting!==!!u)if(g.isIntersecting){const h=l(g);typeof h=="function"?i.set(g.target,h):m.unobserve(g.target)}else typeof u=="function"&&(u(g),i.delete(g.target))})},m=new IntersectionObserver(c,{root:t,rootMargin:a,threshold:typeof r=="number"?r:K[r]});return n.forEach(x=>m.observe(x)),()=>m.disconnect()}function U(e,{root:l,margin:t,amount:a,once:r=!1}={}){const[n,i]=d.useState(!1);return d.useEffect(()=>{if(!e.current||r&&n)return;const c=()=>(i(!0),r?void 0:()=>i(!1)),m={root:l&&l.current||void 0,margin:t,amount:a};return Q(e.current,c,m)},[l,e,t,r,a]),n}const V=d.createContext(null);function y({children:e,adaptivePerformance:l=!0}){const[t,a]=d.useState("balanced"),[r,n]=d.useState(),[i,c]=d.useState(0),[m,x]=d.useState(!0),[g,u]=d.useState(!0),h=J()||!1;d.useEffect(()=>{typeof navigator<"u"&&"getBattery"in navigator&&navigator.getBattery().then(o=>{const f=()=>{n(Math.round(o.level*100))};return f(),o.addEventListener("levelchange",f),o.addEventListener("chargingchange",f),()=>{o.removeEventListener("levelchange",f),o.removeEventListener("chargingchange",f)}})},[]),d.useEffect(()=>{let o=0,f=performance.now();const A=()=>{o++;const z=performance.now();if(z-f>=1e3){const O=Math.round(o*1e3/(z-f)),D=Math.max(0,Math.min(100,100-O/60*100));c(D),o=0,f=z}requestAnimationFrame(A)},I=requestAnimationFrame(A);return()=>cancelAnimationFrame(I)},[]),d.useEffect(()=>{if(!l)return;let o=t;r!==void 0&&r<20?o="battery-saver":r!==void 0&&r>80&&i<30?o="high":o="balanced",i>70?(o="battery-saver",x(!1)):i<30&&x(!0),o!==t&&a(o)},[r,i,l,t]);const _={performanceMode:t,gpuAcceleration:m,reducedMotion:h,lazyLoading:g,setPerformanceMode:a,batteryLevel:r,cpuLoad:i};return s.jsx(V.Provider,{value:_,children:e})}function b(){const e=d.useContext(V);if(!e)throw new Error("useGlassPerformance must be used within a GlassPerformanceProvider");return e}function N({children:e,className:l="",enableGPU:t=!0,virtualizeContent:a=!1,deferRender:r=!1,renderDistance:n=100,style:i={}}){const{performanceMode:c,gpuAcceleration:m}=b(),[x,g]=d.useState(!r),u=d.useRef(null),h=U(u,{margin:`${n}px`,once:!1});d.useEffect(()=>{r&&g(h)},[h,r]);const _=d.useMemo(()=>p({intent:"neutral",elevation:"level2"}),[c,t,m,i]);return!x&&r?s.jsx("div",{ref:u,className:v("glass-surface-placeholder glass-border-dashed",l),style:{minHeight:"100px",background:"transparent",border:"1px dashed color-mix(in srgb, var(--glass-black) 10%, transparent)"}}):s.jsx("div",{ref:u,className:v("glass-surface-primary glass-blur-backdrop",l),style:{..._},children:a?s.jsx(X,{children:e}):e})}function R({children:e,placeholder:l,threshold:t=.1,rootMargin:a="50px",className:r="",onLoad:n}){const[i,c]=d.useState(!1),m=d.useRef(null),x=U(m,{amount:t,margin:a,once:!0});d.useEffect(()=>{if(x&&!i){const u=setTimeout(()=>{c(!0),n?.()},100);return()=>clearTimeout(u)}},[x,i,n]);const g=s.jsx("div",{className:v("glass-surface-placeholder glass-animate-pulse"),style:{background:'/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite",borderRadius:"12px",minHeight:"100px"}});return s.jsx("div",{ref:m,className:r,children:s.jsx(W,{mode:"wait",children:i?s.jsx(w.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:.4},children:e},"content"):s.jsx(w.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},children:l||g},"placeholder")})})}function B({children:e,className:l="",staticAlternative:t,respectUserPreference:a=!0}){const{reducedMotion:r}=b(),n=a&&r;if(n&&t)return s.jsx("div",{className:v("glass-surface-primary glass-reduced-motion",l),children:t});const i=n?{animate:void 0,transition:{duration:0},whileHover:void 0,whileTap:void 0}:{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.3,type:"spring"},whileHover:{scale:1.02,y:-2},whileTap:{scale:.98}};return s.jsx(w.div,{className:v("glass-surface-primary glass-reduced-motion",l),style:p({intent:"neutral",elevation:"level2"}),...i,children:e})}function j({children:e,className:l="",energyThresholds:t={high:50,medium:25,low:10}}){const{batteryLevel:a,performanceMode:r}=b(),n=()=>{const i=a||100;return i>t.high&&r!=="battery-saver"?p({intent:"neutral",elevation:"level2"}):i>t.medium?p({intent:"neutral",elevation:"level2"}):p({intent:"neutral",elevation:"level2"})};return s.jsxs(w.div,{className:v("glass-surface-adaptive glass-border-radius-lg",l),style:{borderRadius:"12px",transition:"all 0.3s ease-in-out",...n()},layout:!0,children:[e,!1]})}function P({children:e,tiers:l={basic:{background:'/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',border:"1px solid var(--glass-border-default)",borderRadius:"8px"},enhanced:p({intent:"neutral",elevation:"level2"}),premium:p({intent:"neutral",elevation:"level2"})},className:t="",autoDetect:a=!0}){const{performanceMode:r,gpuAcceleration:n,cpuLoad:i}=b(),c=()=>a?r==="battery-saver"||i>70||!n?l.basic:r==="high"&&i<30?l.premium:l.enhanced:l.enhanced;return s.jsx(w.div,{className:v("glass-surface-progressive",t),style:c(),layout:!0,transition:{duration:.3},children:e})}function X({children:e}){const[l,t]=d.useState({start:0,end:10}),a=d.useRef(null);d.useEffect(()=>{const i=a.current;if(!i)return;const c=()=>{const m=i.clientHeight,x=i.scrollTop,g=100,u=Math.floor(x/g),h=Math.ceil((x+m)/g);t({start:Math.max(0,u-2),end:h+2})};return i.addEventListener("scroll",c),()=>i.removeEventListener("scroll",c)},[]);const r=Y.Children.toArray(e),n=r.slice(l.start,l.end);return s.jsxs("div",{ref:a,className:v("glass-virtualized-content glass-h-400 glass-overflow-y-auto"),children:[s.jsx("div",{style:{height:l.start*100}})," ",n,s.jsx("div",{style:{height:(r.length-l.end)*100}})," "]})}function C({className:e=""}){const{performanceMode:l,batteryLevel:t,cpuLoad:a,gpuAcceleration:r}=b();return s.jsxs(w.div,{className:v("glass-performance-monitor glass-fixed glass-top-10 glass-right-10 glass-z-max",e),style:p({intent:"neutral",elevation:"level2"}),initial:{opacity:0,x:50},animate:{opacity:1,x:0},children:[s.jsxs("div",{children:["Mode: ",l]}),t!==void 0&&s.jsxs("div",{children:["Battery: ",t,"%"]}),s.jsxs("div",{children:["CPU: ",a.toFixed(1),"%"]}),s.jsxs("div",{children:["GPU: ",r?"ON":"OFF"]})]})}function Z(){const{performanceMode:e,batteryLevel:l,cpuLoad:t,lazyLoading:a}=b(),r=[{label:"Mode",value:e.replace("-"," ")},{label:"Battery",value:l!==void 0?`${l}%`:"—"},{label:"CPU Load",value:`${t.toFixed(0)}%`},{label:"Lazy Loading",value:a?"enabled":"disabled"}];return s.jsxs("div",{className:"glass-surface-primary glass-radius-2xl glass-p-6 glass-space-y-4 glass-border glass-border-white/10",children:[s.jsxs("div",{children:[s.jsx("p",{className:"glass-text-xs glass-text-tertiary glass-uppercase glass-tracking-wide",children:"Performance profile"}),s.jsx("h2",{className:"glass-text-2xl glass-text-primary glass-font-semibold",children:"Adaptive glass effects"})]}),s.jsx("div",{className:"glass-grid glass-grid-cols-2 glass-gap-3",children:r.map(n=>s.jsxs("div",{className:"glass-surface-subtle glass-radius-xl glass-p-4",children:[s.jsx("p",{className:"glass-text-xs glass-text-tertiary glass-mb-1",children:n.label}),s.jsx("p",{className:"glass-text-lg glass-text-primary glass-font-semibold",children:n.value})]},n.label))}),s.jsx("p",{className:"glass-text-xs glass-text-secondary",children:"The engine continuously balances fidelity with resource usage."})]})}const ss=()=>s.jsxs("div",{className:"glass-grid md:glass-grid-cols-2 glass-gap-4",children:[s.jsxs(N,{className:"glass-p-4 glass-radius-xl",children:[s.jsx("h3",{className:"glass-text-lg glass-text-primary glass-font-semibold",children:"Efficient rendering"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Defers heavy effects when out of view."})]}),s.jsxs(j,{className:"glass-p-4 glass-radius-xl",children:[s.jsx("h3",{className:"glass-text-lg glass-text-primary glass-font-semibold",children:"Battery-aware styling"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Automatically dials visuals up or down."})]}),s.jsxs(R,{className:"glass-p-4 glass-radius-xl",children:[s.jsx("h3",{className:"glass-text-lg glass-text-primary glass-font-semibold",children:"Lazy loading"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Streams content just in time."})]}),s.jsxs(B,{className:"glass-p-4 glass-radius-xl",children:[s.jsx("h3",{className:"glass-text-lg glass-text-primary glass-font-semibold",children:"Motion aware"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Respects prefers-reduced-motion automatically."})]})]}),k=({adaptivePerformance:e=!0,className:l,children:t,showMonitor:a=!1,...r})=>s.jsx(y,{adaptivePerformance:e,children:s.jsxs("div",{className:v("glass-performance-optimization glass-space-y-6",l),...r,children:[t??s.jsxs(s.Fragment,{children:[s.jsx(Z,{}),s.jsx(ss,{})]}),a&&s.jsx(C,{})]})});try{y.displayName="GlassPerformanceProvider",y.__docgenInfo={description:"",displayName:"GlassPerformanceProvider",props:{adaptivePerformance:{defaultValue:{value:"true"},description:"",name:"adaptivePerformance",required:!1,type:{name:"boolean | undefined"}}}}}catch{}try{N.displayName="EfficientGlassRendering",N.__docgenInfo={description:"",displayName:"EfficientGlassRendering",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},enableGPU:{defaultValue:{value:"true"},description:"",name:"enableGPU",required:!1,type:{name:"boolean | undefined"}},virtualizeContent:{defaultValue:{value:"false"},description:"",name:"virtualizeContent",required:!1,type:{name:"boolean | undefined"}},deferRender:{defaultValue:{value:"false"},description:"",name:"deferRender",required:!1,type:{name:"boolean | undefined"}},renderDistance:{defaultValue:{value:"100"},description:"",name:"renderDistance",required:!1,type:{name:"number | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}}}}}catch{}try{R.displayName="LazyGlassLoading",R.__docgenInfo={description:"",displayName:"LazyGlassLoading",props:{placeholder:{defaultValue:null,description:"",name:"placeholder",required:!1,type:{name:"ReactNode"}},threshold:{defaultValue:{value:"0.1"},description:"",name:"threshold",required:!1,type:{name:"number | undefined"}},rootMargin:{defaultValue:{value:"50px"},description:"",name:"rootMargin",required:!1,type:{name:"string | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},onLoad:{defaultValue:null,description:"",name:"onLoad",required:!1,type:{name:"(() => void) | undefined"}}}}}catch{}try{B.displayName="ReducedMotionGlass",B.__docgenInfo={description:"",displayName:"ReducedMotionGlass",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},staticAlternative:{defaultValue:null,description:"",name:"staticAlternative",required:!1,type:{name:"ReactNode"}},respectUserPreference:{defaultValue:{value:"true"},description:"",name:"respectUserPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}try{j.displayName="BatteryAwareGlass",j.__docgenInfo={description:"",displayName:"BatteryAwareGlass",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},energyThresholds:{defaultValue:{value:"{ high: 50, medium: 25, low: 10 }"},description:"",name:"energyThresholds",required:!1,type:{name:"{ high: number; medium: number; low: number; } | undefined"}}}}}catch{}try{P.displayName="ProgressiveGlassEnhancement",P.__docgenInfo={description:"",displayName:"ProgressiveGlassEnhancement",props:{tiers:{defaultValue:{value:`{
    basic: {
      background:
        '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
      border: "1px solid var(--glass-border-default)",
      borderRadius: "8px",
    },
    enhanced: createGlassStyle({ intent: "neutral", elevation: "level2" }),
    premium: createGlassStyle({ intent: "neutral", elevation: "level2" }),
  }`},description:"",name:"tiers",required:!1,type:{name:"{ basic: CSSProperties; enhanced: CSSProperties; premium: CSSProperties; } | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},autoDetect:{defaultValue:{value:"true"},description:"",name:"autoDetect",required:!1,type:{name:"boolean | undefined"}}}}}catch{}try{C.displayName="GlassPerformanceMonitor",C.__docgenInfo={description:"",displayName:"GlassPerformanceMonitor",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{k.displayName="GlassPerformanceOptimization",k.__docgenInfo={description:"",displayName:"GlassPerformanceOptimization",props:{adaptivePerformance:{defaultValue:{value:"true"},description:"",name:"adaptivePerformance",required:!1,type:{name:"boolean | undefined"}},showMonitor:{defaultValue:{value:"false"},description:"",name:"showMonitor",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const ls={title:"Advanced/GlassPerformanceOptimization",component:y,parameters:{docs:{description:{component:"Comprehensive performance optimization system for glassmorphism components with battery monitoring, CPU load tracking, and adaptive quality tiers."}},layout:"fullscreen"},tags:["autodocs"]},q=()=>{const{performanceMode:e,batteryLevel:l,cpuLoad:t,gpuAcceleration:a}=b(),[r,n]=d.useState(30);return d.useEffect(()=>{const i=setInterval(()=>{n(c=>{const m=(Math.random()-.5)*10;return Math.max(0,Math.min(100,c+m))})},2e3);return()=>clearInterval(i)},[]),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-4 glass-gap-6",children:[s.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:"Performance Mode"}),s.jsx("div",{className:`px-3 py-1 rounded-full text-sm font-medium ${e==="high"?"bg-green-500/20 text-green-400":e==="balanced"?"bg-blue-500/20 text-blue-400":"bg-yellow-500/20 text-yellow-400"}`,children:e})]}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{className:"glass-flex glass-justify-between glass-text-primary/80",children:[s.jsx("span",{children:"Current Mode"}),s.jsx("span",{className:"glass-font-medium glass-capitalize",children:e})]}),s.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:s.jsx("div",{className:`h-2 rounded-full transition-all duration-500 ${e==="high"?"bg-green-400":e==="balanced"?"bg-blue-400":"bg-yellow-400"}`,style:{width:e==="high"?"100%":e==="balanced"?"60%":"30%"}})})]})]}),s.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:"Battery Level"}),s.jsx("div",{className:"glass-text-2xl",children:"🔋"})]}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{className:"glass-flex glass-justify-between glass-text-primary/80",children:[s.jsx("span",{children:"Charge"}),s.jsxs("span",{className:"glass-font-medium",children:[l||85,"%"]})]}),s.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:s.jsx("div",{className:`h-2 rounded-full transition-all duration-500 ${(l||85)>50?"bg-green-400":(l||85)>20?"bg-yellow-400":"bg-red-400"}`,style:{width:`${l||85}%`}})})]})]}),s.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:"CPU Load"}),s.jsx("div",{className:"glass-text-2xl",children:"⚡"})]}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{className:"glass-flex glass-justify-between glass-text-primary/80",children:[s.jsx("span",{children:"Usage"}),s.jsxs("span",{className:"glass-font-medium",children:[t.toFixed(1),"%"]})]}),s.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:s.jsx("div",{className:`h-2 rounded-full transition-all duration-500 ${t<30?"bg-green-400":t<70?"bg-yellow-400":"bg-red-400"}`,style:{width:`${t}%`}})})]})]}),s.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:"GPU Acceleration"}),s.jsx("div",{className:"glass-text-2xl",children:a?"🚀":"🐌"})]}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{className:"glass-flex glass-justify-between glass-text-primary/80",children:[s.jsx("span",{children:"Status"}),s.jsx("span",{className:`font-medium ${a?"text-green-400":"text-yellow-400"}`,children:a?"Enabled":"Disabled"})]}),s.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:s.jsx("div",{className:`h-2 rounded-full transition-all duration-500 ${a?"bg-green-400":"bg-yellow-400"}`,style:{width:a?"100%":"50%"}})})]})]})]})},G={args:{},render:()=>s.jsx(y,{adaptivePerformance:!0,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[s.jsxs("div",{className:"glass-text-center mb-12",children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-primary glass-mb-4",children:"⚡ Glass Performance Optimization"}),s.jsx("p",{className:"glass-text-xl glass-text-primary/80",children:"Real-time performance monitoring and adaptive quality optimization"})]}),s.jsx(q,{}),s.jsxs("div",{className:"mt-12 glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8",children:[s.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Performance Modes"}),s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{className:"glass-p-4 glass-surface-green/10 glass-radius-lg glass-border glass-border-green/20",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"High Performance"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Full GPU acceleration, maximum effects, best user experience"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-blue/10 glass-radius-lg glass-border glass-border-blue/20",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Balanced"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Moderate effects, good performance balance"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-yellow/10 glass-radius-lg glass-border glass-border-yellow/20",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Battery Saver"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Minimal effects, maximum battery life"})]})]})]}),s.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Adaptive Features"}),s.jsxs("div",{className:"glass-space-y-3 glass-text-primary/80",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"Real-time battery monitoring"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"CPU load estimation"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"GPU capability detection"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"Lazy loading system"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"Progressive enhancement"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"Reduced motion support"})]})]})]})]})]})})})},M={args:{},render:()=>s.jsx(y,{adaptivePerformance:!0,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[s.jsxs("div",{className:"glass-text-center mb-12",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"🚀 Efficient Glass Rendering"}),s.jsx("p",{className:"glass-text-xl glass-text-primary/80",children:"GPU-accelerated glass effects with performance optimization"})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-6 mb-12",children:[s.jsx(N,{enableGPU:!0,children:s.jsxs("div",{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"GPU Accelerated"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Hardware-accelerated glass effects for smooth 60fps performance"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/60 glass-text-xs",children:[s.jsx("div",{children:"• WebGL shaders"}),s.jsx("div",{children:"• Hardware acceleration"}),s.jsx("div",{children:"• 60fps animations"}),s.jsx("div",{children:"• Optimized blur effects"})]})]})}),s.jsx(N,{virtualizeContent:!0,children:s.jsxs("div",{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"Virtualized Content"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Efficient rendering for large datasets and complex content"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/60 glass-text-xs",children:[s.jsx("div",{children:"• Lazy loading"}),s.jsx("div",{children:"• Viewport culling"}),s.jsx("div",{children:"• Memory optimization"}),s.jsx("div",{children:"• Smooth scrolling"})]})]})}),s.jsx(N,{deferRender:!0,children:s.jsxs("div",{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"Deferred Rendering"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Renders only when visible in viewport for optimal performance"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/60 glass-text-xs",children:[s.jsx("div",{children:"• Intersection observer"}),s.jsx("div",{children:"• On-demand rendering"}),s.jsx("div",{children:"• Reduced initial load"}),s.jsx("div",{children:"• Progressive enhancement"})]})]})})]}),s.jsx(C,{})]})})})},L={args:{},render:()=>{const[e,l]=d.useState([]),t=a=>{l(r=>[...r,a])};return s.jsx(y,{adaptivePerformance:!0,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[s.jsxs("div",{className:"glass-text-center mb-12",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"⏳ Lazy Loading System"}),s.jsx("p",{className:"glass-text-xl glass-text-primary/80",children:"Progressive loading of glass effects based on viewport visibility"})]}),s.jsxs("div",{className:"mb-8 glass-p-6 glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Loading Status"}),s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-2",children:["Card 1","Card 2","Card 3","Card 4","Card 5","Card 6"].map(a=>s.jsxs("div",{className:`px-3 py-2 rounded-lg text-sm font-medium ${e.includes(a)?"bg-green-500/20 text-green-400":"bg-white/10 text-white/60"}`,children:[e.includes(a)?"✅":"⏳"," ",a]},a))})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-8",children:[1,2,3,4,5,6].map(a=>s.jsx(R,{placeholder:s.jsx("div",{className:"glass-h-48 glass-surface-subtle/5 glass-radius-2xl glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-primary/60",children:["Loading Card ",a,"..."]})}),threshold:.1,rootMargin:"50px",onLoad:()=>t(`Card ${a}`),children:s.jsxs("div",{className:"glass-p-6 glass-h-48",children:[s.jsxs("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:["Lazy Loaded Card ",a]}),s.jsxs("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:["This card was loaded when it came into view. Loaded: ",e.includes(`Card ${a}`)?"Yes":"No"]}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/60 glass-text-xs",children:[s.jsx("div",{children:"• Progressive enhancement"}),s.jsx("div",{children:"• Viewport-based loading"}),s.jsx("div",{children:"• Performance optimized"}),s.jsx("div",{children:"• Smooth transitions"})]})]})},a))}),s.jsxs("div",{className:"mt-12 glass-p-6 glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Lazy Loading Benefits"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-4 glass-gap-6",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"⚡"}),s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Faster Initial Load"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Only load visible content"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"📱"}),s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Better Mobile Performance"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Reduced data usage"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"🔋"}),s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Battery Efficient"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Conserve device battery"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"🌊"}),s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Smooth Experience"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Progressive enhancement"})]})]})]})]})})})}},S={args:{},render:()=>s.jsx(y,{adaptivePerformance:!0,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[s.jsxs("div",{className:"glass-text-center mb-12",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"🔋 Battery-Aware Glass Effects"}),s.jsx("p",{className:"glass-text-xl glass-text-primary/80",children:"Intelligent power management with adaptive quality based on battery level"})]}),s.jsx(q,{}),s.jsxs("div",{className:"mt-12 glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-8",children:[s.jsx(j,{energyThresholds:{high:80,medium:50,low:20},children:s.jsxs("div",{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"High Battery Mode"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Full glass effects with maximum visual quality when battery is above 80%"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/60 glass-text-xs",children:[s.jsx("div",{children:"• Heavy blur effects"}),s.jsx("div",{children:"• Complex animations"}),s.jsx("div",{children:"• Maximum transparency"}),s.jsx("div",{children:"• Full GPU acceleration"})]})]})}),s.jsx(j,{energyThresholds:{high:80,medium:50,low:20},children:s.jsxs("div",{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"Medium Battery Mode"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Balanced effects for optimal performance when battery is 50-80%"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/60 glass-text-xs",children:[s.jsx("div",{children:"• Moderate blur"}),s.jsx("div",{children:"• Essential animations"}),s.jsx("div",{children:"• Balanced transparency"}),s.jsx("div",{children:"• Adaptive GPU usage"})]})]})}),s.jsx(j,{energyThresholds:{high:80,medium:50,low:20},children:s.jsxs("div",{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"Low Battery Mode"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Minimal effects to preserve battery when below 20%"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/60 glass-text-xs",children:[s.jsx("div",{children:"• Reduced blur"}),s.jsx("div",{children:"• Disabled animations"}),s.jsx("div",{children:"• Minimal transparency"}),s.jsx("div",{children:"• CPU-only rendering"})]})]})})]}),s.jsxs("div",{className:"mt-12 glass-p-6 glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center",children:"Battery Optimization Features"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-3",children:"Smart Adaptation"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/80",children:[s.jsx("div",{children:"• Real-time battery monitoring"}),s.jsx("div",{children:"• Automatic quality adjustment"}),s.jsx("div",{children:"• Performance mode switching"}),s.jsx("div",{children:"• User preference respect"})]})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-3",children:"Power Efficiency"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/80",children:[s.jsx("div",{children:"• Reduced GPU usage on low battery"}),s.jsx("div",{children:"• Minimal background processing"}),s.jsx("div",{children:"• Optimized animation timing"}),s.jsx("div",{children:"• Smart resource allocation"})]})]})]})]})]})})})},E={args:{},render:()=>s.jsx(y,{adaptivePerformance:!0,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[s.jsxs("div",{className:"glass-text-center mb-12",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"📈 Progressive Glass Enhancement"}),s.jsx("p",{className:"glass-text-xl glass-text-primary/80",children:"Tiered glass experiences based on device capabilities and performance"})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-8 mb-12",children:[s.jsx(P,{tiers:{basic:{background:'/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',border:"1px solid rgba(var(--glass-color-black) / var(--glass-opacity-10))",borderRadius:"8px"},enhanced:p({intent:"neutral",elevation:"level2"}),premium:p({intent:"neutral",elevation:"level2"})},autoDetect:!0,children:s.jsxs("div",{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"Auto-Detect Mode"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Automatically selects the best tier based on device performance and capabilities"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/60 glass-text-xs",children:[s.jsx("div",{children:"• Performance monitoring"}),s.jsx("div",{children:"• Capability detection"}),s.jsx("div",{children:"• Adaptive rendering"}),s.jsx("div",{children:"• Graceful degradation"})]})]})}),s.jsx(P,{tiers:{basic:{background:'/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',border:"1px solid rgba(var(--glass-color-black) / var(--glass-opacity-10))",borderRadius:"8px"},enhanced:p({intent:"neutral",elevation:"level2"}),premium:p({intent:"neutral",elevation:"level2"})},autoDetect:!1,children:s.jsxs("div",{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"Enhanced Mode"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Balanced glass effects for most modern devices and use cases"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/60 glass-text-xs",children:[s.jsx("div",{children:"• Medium blur effects"}),s.jsx("div",{children:"• Standard animations"}),s.jsx("div",{children:"• Balanced transparency"}),s.jsx("div",{children:"• Good performance"})]})]})}),s.jsx(P,{tiers:{basic:{background:'/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',border:"1px solid rgba(var(--glass-color-black) / var(--glass-opacity-10))",borderRadius:"8px"},enhanced:p({intent:"neutral",elevation:"level2"}),premium:p({intent:"neutral",elevation:"level2"})},autoDetect:!1,children:s.jsxs("div",{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"Basic Mode"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Essential glass effects for low-performance devices and battery saver mode"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/60 glass-text-xs",children:[s.jsx("div",{children:"• Minimal blur"}),s.jsx("div",{children:"• Reduced animations"}),s.jsx("div",{children:"• High contrast"}),s.jsx("div",{children:"• Maximum compatibility"})]})]})})]}),s.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center",children:"Progressive Enhancement Benefits"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-4 glass-gap-6",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"🌍"}),s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Universal Support"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Works on all devices"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"⚡"}),s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Performance Optimized"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Adapts to capabilities"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"🔋"}),s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Battery Aware"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Preserves device battery"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"📱"}),s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Mobile First"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Optimized for mobile"})]})]})]})]})})})};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <GlassPerformanceProvider adaptivePerformance={true}>
      <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
        <div className="max-w-6xl glass-mx-auto">
          <div className="glass-text-center mb-12">
            <h1 className="glass-text-4xl glass-font-bold glass-text-primary glass-mb-4">
              ⚡ Glass Performance Optimization
            </h1>
            <p className="glass-text-xl glass-text-primary/80">
              Real-time performance monitoring and adaptive quality optimization
            </p>
          </div>

          <PerformanceDashboardComponent />

          <div className="mt-12 glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8">
            <div className="glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard">
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Performance Modes</h3>
              <div className="glass-space-y-4">
                <div className="glass-p-4 glass-surface-green/10 glass-radius-lg glass-border glass-border-green/20">
                  <h4 className="glass-font-medium glass-text-primary glass-mb-2">High Performance</h4>
                  <p className="glass-text-primary/70 glass-text-sm">Full GPU acceleration, maximum effects, best user experience</p>
                </div>

                <div className="glass-p-4 glass-surface-blue/10 glass-radius-lg glass-border glass-border-blue/20">
                  <h4 className="glass-font-medium glass-text-primary glass-mb-2">Balanced</h4>
                  <p className="glass-text-primary/70 glass-text-sm">Moderate effects, good performance balance</p>
                </div>

                <div className="glass-p-4 glass-surface-yellow/10 glass-radius-lg glass-border glass-border-yellow/20">
                  <h4 className="glass-font-medium glass-text-primary glass-mb-2">Battery Saver</h4>
                  <p className="glass-text-primary/70 glass-text-sm">Minimal effects, maximum battery life</p>
                </div>
              </div>
            </div>

            <div className="glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard">
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Adaptive Features</h3>
              <div className="glass-space-y-3 glass-text-primary/80">
                <div className="glass-flex glass-items-center glass-gap-3">
                  <div className="glass-w-2 glass-h-2 glass-radius-full glass-surface-green" />
                  <span>Real-time battery monitoring</span>
                </div>
                <div className="glass-flex glass-items-center glass-gap-3">
                  <div className="glass-w-2 glass-h-2 glass-radius-full glass-surface-green" />
                  <span>CPU load estimation</span>
                </div>
                <div className="glass-flex glass-items-center glass-gap-3">
                  <div className="glass-w-2 glass-h-2 glass-radius-full glass-surface-green" />
                  <span>GPU capability detection</span>
                </div>
                <div className="glass-flex glass-items-center glass-gap-3">
                  <div className="glass-w-2 glass-h-2 glass-radius-full glass-surface-green" />
                  <span>Lazy loading system</span>
                </div>
                <div className="glass-flex glass-items-center glass-gap-3">
                  <div className="glass-w-2 glass-h-2 glass-radius-full glass-surface-green" />
                  <span>Progressive enhancement</span>
                </div>
                <div className="glass-flex glass-items-center glass-gap-3">
                  <div className="glass-w-2 glass-h-2 glass-radius-full glass-surface-green" />
                  <span>Reduced motion support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassPerformanceProvider>
}`,...G.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <GlassPerformanceProvider adaptivePerformance={true}>
      <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
        <div className="max-w-6xl glass-mx-auto">
          <div className="glass-text-center mb-12">
            <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
              🚀 Efficient Glass Rendering
            </h1>
            <p className="glass-text-xl glass-text-primary/80">
              GPU-accelerated glass effects with performance optimization
            </p>
          </div>

          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-6 mb-12">
            <EfficientGlassRendering enableGPU={true}>
              <div className="glass-p-6">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">GPU Accelerated</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Hardware-accelerated glass effects for smooth 60fps performance
                </p>
                <div className="glass-space-y-2 glass-text-primary/60 glass-text-xs">
                  <div>• WebGL shaders</div>
                  <div>• Hardware acceleration</div>
                  <div>• 60fps animations</div>
                  <div>• Optimized blur effects</div>
                </div>
              </div>
            </EfficientGlassRendering>

            <EfficientGlassRendering virtualizeContent={true}>
              <div className="glass-p-6">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Virtualized Content</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Efficient rendering for large datasets and complex content
                </p>
                <div className="glass-space-y-2 glass-text-primary/60 glass-text-xs">
                  <div>• Lazy loading</div>
                  <div>• Viewport culling</div>
                  <div>• Memory optimization</div>
                  <div>• Smooth scrolling</div>
                </div>
              </div>
            </EfficientGlassRendering>

            <EfficientGlassRendering deferRender={true}>
              <div className="glass-p-6">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Deferred Rendering</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Renders only when visible in viewport for optimal performance
                </p>
                <div className="glass-space-y-2 glass-text-primary/60 glass-text-xs">
                  <div>• Intersection observer</div>
                  <div>• On-demand rendering</div>
                  <div>• Reduced initial load</div>
                  <div>• Progressive enhancement</div>
                </div>
              </div>
            </EfficientGlassRendering>
          </div>

          <GlassPerformanceMonitor />
        </div>
      </div>
    </GlassPerformanceProvider>
}`,...M.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const [loadedComponents, setLoadedComponents] = useState<string[]>([]);
    const handleLoad = (component: string) => {
      setLoadedComponents(prev => [...prev, component]);
    };
    return <GlassPerformanceProvider adaptivePerformance={true}>
        <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
          <div className="max-w-6xl glass-mx-auto">
            <div className="glass-text-center mb-12">
              <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
                ⏳ Lazy Loading System
              </h1>
              <p className="glass-text-xl glass-text-primary/80">
                Progressive loading of glass effects based on viewport visibility
              </p>
            </div>

            <div className="mb-8 glass-p-6 glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-contrast-guard">
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Loading Status</h3>
              <div className="glass-flex glass-flex-wrap glass-gap-2">
                {['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5', 'Card 6'].map(card => <div key={card} className={\`px-3 py-2 rounded-lg text-sm font-medium \${loadedComponents.includes(card) ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/60'}\`}>
                    {loadedComponents.includes(card) ? '✅' : '⏳'} {card}
                  </div>)}
              </div>
            </div>

            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-8">
              {[1, 2, 3, 4, 5, 6].map(index => <LazyGlassLoading key={index} placeholder={<div className="glass-h-48 glass-surface-subtle/5 glass-radius-2xl glass-flex glass-items-center glass-justify-center">
                      <div className="glass-text-primary/60">Loading Card {index}...</div>
                    </div>} threshold={0.1} rootMargin="50px" onLoad={() => handleLoad(\`Card \${index}\`)}>
                  <div className="glass-p-6 glass-h-48">
                    <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Lazy Loaded Card {index}</h3>
                    <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                      This card was loaded when it came into view. Loaded: {loadedComponents.includes(\`Card \${index}\`) ? 'Yes' : 'No'}
                    </p>
                    <div className="glass-space-y-2 glass-text-primary/60 glass-text-xs">
                      <div>• Progressive enhancement</div>
                      <div>• Viewport-based loading</div>
                      <div>• Performance optimized</div>
                      <div>• Smooth transitions</div>
                    </div>
                  </div>
                </LazyGlassLoading>)}
            </div>

            <div className="mt-12 glass-p-6 glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-contrast-guard">
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Lazy Loading Benefits</h3>
              <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-4 glass-gap-6">
                <div className="glass-text-center">
                  <div className="glass-text-3xl glass-mb-3">⚡</div>
                  <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Faster Initial Load</h4>
                  <p className="glass-text-primary/70 glass-text-sm">Only load visible content</p>
                </div>
                <div className="glass-text-center">
                  <div className="glass-text-3xl glass-mb-3">📱</div>
                  <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Better Mobile Performance</h4>
                  <p className="glass-text-primary/70 glass-text-sm">Reduced data usage</p>
                </div>
                <div className="glass-text-center">
                  <div className="glass-text-3xl glass-mb-3">🔋</div>
                  <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Battery Efficient</h4>
                  <p className="glass-text-primary/70 glass-text-sm">Conserve device battery</p>
                </div>
                <div className="glass-text-center">
                  <div className="glass-text-3xl glass-mb-3">🌊</div>
                  <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Smooth Experience</h4>
                  <p className="glass-text-primary/70 glass-text-sm">Progressive enhancement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassPerformanceProvider>;
  }
}`,...L.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <GlassPerformanceProvider adaptivePerformance={true}>
      <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
        <div className="max-w-6xl glass-mx-auto">
          <div className="glass-text-center mb-12">
            <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
              🔋 Battery-Aware Glass Effects
            </h1>
            <p className="glass-text-xl glass-text-primary/80">
              Intelligent power management with adaptive quality based on battery level
            </p>
          </div>

          <PerformanceDashboardComponent />

          <div className="mt-12 glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-8">
            <BatteryAwareGlass energyThresholds={{
            high: 80,
            medium: 50,
            low: 20
          }}>
              <div className="glass-p-6">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">High Battery Mode</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Full glass effects with maximum visual quality when battery is above 80%
                </p>
                <div className="glass-space-y-2 glass-text-primary/60 glass-text-xs">
                  <div>• Heavy blur effects</div>
                  <div>• Complex animations</div>
                  <div>• Maximum transparency</div>
                  <div>• Full GPU acceleration</div>
                </div>
              </div>
            </BatteryAwareGlass>

            <BatteryAwareGlass energyThresholds={{
            high: 80,
            medium: 50,
            low: 20
          }}>
              <div className="glass-p-6">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Medium Battery Mode</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Balanced effects for optimal performance when battery is 50-80%
                </p>
                <div className="glass-space-y-2 glass-text-primary/60 glass-text-xs">
                  <div>• Moderate blur</div>
                  <div>• Essential animations</div>
                  <div>• Balanced transparency</div>
                  <div>• Adaptive GPU usage</div>
                </div>
              </div>
            </BatteryAwareGlass>

            <BatteryAwareGlass energyThresholds={{
            high: 80,
            medium: 50,
            low: 20
          }}>
              <div className="glass-p-6">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Low Battery Mode</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Minimal effects to preserve battery when below 20%
                </p>
                <div className="glass-space-y-2 glass-text-primary/60 glass-text-xs">
                  <div>• Reduced blur</div>
                  <div>• Disabled animations</div>
                  <div>• Minimal transparency</div>
                  <div>• CPU-only rendering</div>
                </div>
              </div>
            </BatteryAwareGlass>
          </div>

          <div className="mt-12 glass-p-6 glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center">Battery Optimization Features</h3>
            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8">
              <div>
                <h4 className="glass-font-medium glass-text-primary glass-mb-3">Smart Adaptation</h4>
                <div className="glass-space-y-2 glass-text-primary/80">
                  <div>• Real-time battery monitoring</div>
                  <div>• Automatic quality adjustment</div>
                  <div>• Performance mode switching</div>
                  <div>• User preference respect</div>
                </div>
              </div>
              <div>
                <h4 className="glass-font-medium glass-text-primary glass-mb-3">Power Efficiency</h4>
                <div className="glass-space-y-2 glass-text-primary/80">
                  <div>• Reduced GPU usage on low battery</div>
                  <div>• Minimal background processing</div>
                  <div>• Optimized animation timing</div>
                  <div>• Smart resource allocation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassPerformanceProvider>
}`,...S.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <GlassPerformanceProvider adaptivePerformance={true}>
      <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
        <div className="max-w-6xl glass-mx-auto">
          <div className="glass-text-center mb-12">
            <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
              📈 Progressive Glass Enhancement
            </h1>
            <p className="glass-text-xl glass-text-primary/80">
              Tiered glass experiences based on device capabilities and performance
            </p>
          </div>

          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-8 mb-12">
            <ProgressiveGlassEnhancement tiers={{
            basic: {
              background: '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
              border: '1px solid rgba(var(--glass-color-black) / var(--glass-opacity-10))',
              borderRadius: '8px'
            },
            enhanced: createGlassStyle({
              intent: "neutral",
              elevation: "level2"
            }),
            premium: createGlassStyle({
              intent: "neutral",
              elevation: "level2"
            })
          }} autoDetect={true}>
              <div className="glass-p-6">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Auto-Detect Mode</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Automatically selects the best tier based on device performance and capabilities
                </p>
                <div className="glass-space-y-2 glass-text-primary/60 glass-text-xs">
                  <div>• Performance monitoring</div>
                  <div>• Capability detection</div>
                  <div>• Adaptive rendering</div>
                  <div>• Graceful degradation</div>
                </div>
              </div>
            </ProgressiveGlassEnhancement>

            <ProgressiveGlassEnhancement tiers={{
            basic: {
              background: '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
              border: '1px solid rgba(var(--glass-color-black) / var(--glass-opacity-10))',
              borderRadius: '8px'
            },
            enhanced: createGlassStyle({
              intent: "neutral",
              elevation: "level2"
            }),
            premium: createGlassStyle({
              intent: "neutral",
              elevation: "level2"
            })
          }} autoDetect={false}>
              <div className="glass-p-6">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Enhanced Mode</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Balanced glass effects for most modern devices and use cases
                </p>
                <div className="glass-space-y-2 glass-text-primary/60 glass-text-xs">
                  <div>• Medium blur effects</div>
                  <div>• Standard animations</div>
                  <div>• Balanced transparency</div>
                  <div>• Good performance</div>
                </div>
              </div>
            </ProgressiveGlassEnhancement>

            <ProgressiveGlassEnhancement tiers={{
            basic: {
              background: '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
              border: '1px solid rgba(var(--glass-color-black) / var(--glass-opacity-10))',
              borderRadius: '8px'
            },
            enhanced: createGlassStyle({
              intent: "neutral",
              elevation: "level2"
            }),
            premium: createGlassStyle({
              intent: "neutral",
              elevation: "level2"
            })
          }} autoDetect={false}>
              <div className="glass-p-6">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Basic Mode</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Essential glass effects for low-performance devices and battery saver mode
                </p>
                <div className="glass-space-y-2 glass-text-primary/60 glass-text-xs">
                  <div>• Minimal blur</div>
                  <div>• Reduced animations</div>
                  <div>• High contrast</div>
                  <div>• Maximum compatibility</div>
                </div>
              </div>
            </ProgressiveGlassEnhancement>
          </div>

          <div className="glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center">Progressive Enhancement Benefits</h3>
            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-4 glass-gap-6">
              <div className="glass-text-center">
                <div className="glass-text-3xl glass-mb-3">🌍</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Universal Support</h4>
                <p className="glass-text-primary/70 glass-text-sm">Works on all devices</p>
              </div>
              <div className="glass-text-center">
                <div className="glass-text-3xl glass-mb-3">⚡</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Performance Optimized</h4>
                <p className="glass-text-primary/70 glass-text-sm">Adapts to capabilities</p>
              </div>
              <div className="glass-text-center">
                <div className="glass-text-3xl glass-mb-3">🔋</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Battery Aware</h4>
                <p className="glass-text-primary/70 glass-text-sm">Preserves device battery</p>
              </div>
              <div className="glass-text-center">
                <div className="glass-text-3xl glass-mb-3">📱</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Mobile First</h4>
                <p className="glass-text-primary/70 glass-text-sm">Optimized for mobile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassPerformanceProvider>
}`,...E.parameters?.docs?.source}}};const rs=["PerformanceDashboard","EfficientRendering","LazyLoading","BatteryOptimization","ProgressiveEnhancement"];export{S as BatteryOptimization,M as EfficientRendering,L as LazyLoading,G as PerformanceDashboard,E as ProgressiveEnhancement,rs as __namedExportsOrder,ls as default};
