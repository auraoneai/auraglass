import{r as l,d as w,j as s,c as d}from"./iframe-CdDNbo2v.js";import{u as Q}from"./a11y-B__vCKol.js";import{u as X}from"./MotionPreferenceContext-mBLTPWGH.js";import{u as Y}from"./soundDesign-B69qWDJX.js";import{O as Z}from"./OptimizedGlassCore-B1nsxF3j.js";import{M as f}from"./MotionFramer-BwSk7qC9.js";import{CertificationCase as ee}from"./GlassMissingInventoryCertification.stories-BxcTdsoS.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-CLkD7xxk.js";import"./utilsCore-DlqMbNDW.js";const ne=[{name:"Happy",color:"hsl(var(--glass-color-warning))",intensity:.8,description:"Feeling joyful and content"},{name:"Calm",color:"hsl(var(--glass-color-info))",intensity:.6,description:"Peaceful and relaxed"},{name:"Energetic",color:"hsl(var(--glass-color-danger))",intensity:.9,description:"Full of energy and excitement"},{name:"Focused",color:"var(--glass-color-secondary)",intensity:.7,description:"Concentrated and determined"},{name:"Stressed",color:"hsl(var(--glass-color-danger))",intensity:.8,description:"Feeling overwhelmed or tense"},{name:"Creative",color:"var(--glass-color-secondary)",intensity:.75,description:"In a creative and imaginative state"},{name:"Melancholic",color:"hsl(var(--glass-color-primary))",intensity:.5,description:"Reflective and somewhat sad"},{name:"Excited",color:"#32CD32",intensity:.85,description:"Thrilled and anticipatory"},{name:"Anxious",color:"#FF6347",intensity:.7,description:"Worried or apprehensive"},{name:"Peaceful",color:"#98FB98",intensity:.4,description:"Completely at ease and serene"}],g=l.forwardRef(({mood:M,moodStates:t=ne,size:F="md",interactive:c=!0,animated:j=!0,transitionDuration:I=w.DURATION.slower,showLabels:_=!0,showDescription:T=!1,onMoodChange:N,autoTransition:p,autoDemo:h=!1,biometricIntegration:y=!1,ambientResponse:x=!1,thickness:D="medium",glowIntensity:A="medium",pulse:$=!1,respectMotionPreference:E=!0,className:O,...G},P)=>{const{prefersReducedMotion:U}=X(),r=E?!U:!0,{play:v}=Y(),W=Q("glass-mood-ring"),[e,z]=l.useState(M||t[0]),[R,k]=l.useState(!1),[u,S]=l.useState(h),B={sm:{ring:"w-16 h-16",center:"w-8 h-8",text:"glass-text-xs",description:"glass-text-xs",glow:"shadow-lg"},md:{ring:"w-24 h-24",center:"w-12 h-12",text:"glass-text-sm",description:"glass-text-sm",glow:"shadow-xl"},lg:{ring:"w-32 h-32",center:"w-16 h-16",text:"glass-text-base",description:"glass-text-base",glow:"shadow-2xl"},xl:{ring:"w-40 h-40",center:"w-20 h-20",text:"glass-text-lg",description:"glass-text-lg",glow:"shadow-2xl"}},H={thin:"border-2",medium:"border-4",thick:"border-8"},L={none:"",subtle:"shadow-sm",medium:"shadow-lg shadow-current/30",strong:"shadow-2xl shadow-current/50"},b=B[F];l.useEffect(()=>{const n=p??(h?900:void 0);if(!n||!u&&!h||!r)return;const a=setInterval(()=>{const i=(t.findIndex(J=>J.name===e.name)+1)%t.length;m(t[i])},n);return()=>clearInterval(a)},[p,h,u,e,t,r]),l.useEffect(()=>{if(!y)return;const n=setInterval(()=>{const a=t[Math.floor(Math.random()*t.length)];Math.random()>.8&&m(a)},1e4);return()=>clearInterval(n)},[y,t]),l.useEffect(()=>{if(!x)return;const n=setInterval(()=>{const a=new Date().getHours();let o=e;a>=6&&a<12?o=t.find(i=>i.name==="Energetic")||e:a>=12&&a<18?o=t.find(i=>i.name==="Focused")||e:a>=18&&a<22?o=t.find(i=>i.name==="Calm")||e:o=t.find(i=>i.name==="Peaceful")||e,o!==e&&m(o)},6e4);return()=>clearInterval(n)},[x,e,t]);const m=l.useCallback(n=>{n.name!==e.name&&(k(!0),setTimeout(()=>{z(n),k(!1),N?.(n),v("mood_change")},j?I/2:0))},[e,j,I,N,v]),q=l.useCallback(()=>{if(!c)return;const a=(t.findIndex(o=>o.name===e.name)+1)%t.length;m(t[a])},[c,t,e,m]),K=l.useCallback(()=>{S(!u),v("toggle")},[u,v]);return s.jsx(Z,{ref:P,id:W,elevation:"level2",intensity:"medium",depth:2,tint:"neutral",border:"subtle",className:d("glass-mood-ring relative inline-flex flex-col items-center justify-center glass-p-6 glass-radius-lg","glass-backdrop-blur-md border border-border/20",O),...G,children:s.jsxs(f,{preset:r?"fadeIn":"none",className:"glass-flex glass-flex-col glass-items-center glass-gap-4",children:[s.jsxs("div",{className:"glass-relative",children:[s.jsxs(f,{as:"div",preset:r?"scaleIn":"none",className:d("relative glass-radius-full border-solid transition-all duration-1000",b.ring,H[D],L[A],c&&"cursor-pointer glass-hover-scale-105",$&&r&&"animate-pulse",R&&"opacity-50"),style:{borderColor:e.color,boxShadow:A!=="none"?`0 0 20px ${e.color}40`:void 0},onClick:q,role:c?"button":"status","aria-label":`Current mood: ${e.name} - ${e.description}`,tabIndex:c?0:-1,onKeyDown:n=>{(n.key==="Enter"||n.key===" ")&&c&&(n.preventDefault(),q())},children:[s.jsx("div",{className:d("absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2","glass-radius-full flex items-center justify-center transition-all",`duration-[${w.DURATION.slower}ms]`,b.center,r&&"animate-pulse"),style:{backgroundColor:`${e.color}${Math.round(e.intensity*255).toString(16)}`,boxShadow:`inset 0 0 10px ${e.color}80`},children:e.icon&&s.jsx("div",{className:"glass-text-primary-glass-opacity-90",children:e.icon})}),Array.from({length:3},(n,a)=>s.jsx("div",{className:d("absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2","glass-radius-full border transition-all",`duration-[${w.DURATION.slower}ms]`,r&&"animate-pulse"),style:{width:`${60+a*20}%`,height:`${60+a*20}%`,borderColor:`${e.color}${Math.round((e.intensity-a*.2)*255).toString(16)}`,animationDelay:`${a*200}ms`,opacity:Math.max(0,e.intensity-a*.3)}},a))]}),R&&s.jsx("div",{className:d("absolute inset-0 glass-radius-full bg-gradient-radial from-white/20 to-transparent","animate-spin")})]}),s.jsxs("div",{className:"glass-text-center glass-gap-2",children:[_&&s.jsx(f,{preset:r?"slideUp":"none",className:d("font-semibold transition-colors duration-500",b.text),style:{color:e.color},children:e.name}),T&&s.jsx(f,{preset:r?"slideUp":"none",delay:100,className:d("glass-text-secondary max-w-xs text-center",b.description),children:e.description})]}),c&&t.length>1&&s.jsx(f,{preset:r?"slideUp":"none",delay:200,className:"glass-flex glass-flex-wrap glass-gap-1 glass-justify-center glass-max-w-xs",children:t.map((n,a)=>s.jsx("button",{onClick:()=>m(n),className:d("w-6 h-6 glass-radius-full border-2 transition-all duration-200","hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2",e.name===n.name&&"ring-2 ring-white","focus:ring-white/50"),style:{backgroundColor:n.color,borderColor:e.name===n.name?"white":n.color},title:n.name,"aria-label":`Select ${n.name} mood`},n.name))}),(p||y||x)&&s.jsxs(f,{preset:r?"slideUp":"none",delay:w.DURATION.normal,className:"glass-flex glass-gap-2 glass-items-center glass-text-xs glass-text-secondary",children:[p&&s.jsxs("button",{onClick:K,className:d("glass-px-2 glass-py-1 glass-radius-md border transition-colors",u?"bg-primary/20 border-primary/40 text-primary":"border-border/40 hover:border-border"),children:["Auto ",u?"On":"Off"]}),y&&s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),s.jsx("span",{children:"Bio"})]}),x&&s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-blue glass-radius-full glass-animate-pulse"}),s.jsx("span",{children:"Ambient"})]})]})]})})});g.displayName="GlassMoodRing";try{g.displayName="GlassMoodRing",g.__docgenInfo={description:"",displayName:"GlassMoodRing",props:{mood:{defaultValue:null,description:"Current mood state",name:"mood",required:!1,type:{name:"MoodState | undefined"}},moodStates:{defaultValue:{value:`[
  {
    name: "Happy",
    color: "hsl(var(--glass-color-warning))",
    intensity: 0.8,
    description: "Feeling joyful and content",
  },
  {
    name: "Calm",
    color: "hsl(var(--glass-color-info))",
    intensity: 0.6,
    description: "Peaceful and relaxed",
  },
  {
    name: "Energetic",
    color: "hsl(var(--glass-color-danger))",
    intensity: 0.9,
    description: "Full of energy and excitement",
  },
  {
    name: "Focused",
    color: "var(--glass-color-secondary)",
    intensity: 0.7,
    description: "Concentrated and determined",
  },
  {
    name: "Stressed",
    color: "hsl(var(--glass-color-danger))",
    intensity: 0.8,
    description: "Feeling overwhelmed or tense",
  },
  {
    name: "Creative",
    color: "var(--glass-color-secondary)",
    intensity: 0.75,
    description: "In a creative and imaginative state",
  },
  {
    name: "Melancholic",
    color: "hsl(var(--glass-color-primary))",
    intensity: 0.5,
    description: "Reflective and somewhat sad",
  },
  {
    name: "Excited",
    color: "#32CD32",
    intensity: 0.85,
    description: "Thrilled and anticipatory",
  },
  {
    name: "Anxious",
    color: "#FF6347",
    intensity: 0.7,
    description: "Worried or apprehensive",
  },
  {
    name: "Peaceful",
    color: "#98FB98",
    intensity: 0.4,
    description: "Completely at ease and serene",
  },
]`},description:"Available mood states",name:"moodStates",required:!1,type:{name:"MoodState[] | undefined"}},size:{defaultValue:{value:"md"},description:"Size of the mood ring",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"xl"'}]}},interactive:{defaultValue:{value:"true"},description:"Whether the ring is interactive",name:"interactive",required:!1,type:{name:"boolean | undefined"}},animated:{defaultValue:{value:"true"},description:"Whether to show mood transitions",name:"animated",required:!1,type:{name:"boolean | undefined"}},transitionDuration:{defaultValue:{value:"700"},description:"Transition duration in milliseconds",name:"transitionDuration",required:!1,type:{name:"number | undefined"}},showLabels:{defaultValue:{value:"true"},description:"Whether to show mood labels",name:"showLabels",required:!1,type:{name:"boolean | undefined"}},showDescription:{defaultValue:{value:"false"},description:"Whether to show mood description",name:"showDescription",required:!1,type:{name:"boolean | undefined"}},onMoodChange:{defaultValue:null,description:"Custom mood change handler",name:"onMoodChange",required:!1,type:{name:"((mood: MoodState) => void) | undefined"}},autoTransition:{defaultValue:null,description:"Auto-transition interval in milliseconds",name:"autoTransition",required:!1,type:{name:"number | undefined"}},autoDemo:{defaultValue:{value:"false"},description:"Run a package-owned cycling demo for documentation/catalog previews.",name:"autoDemo",required:!1,type:{name:"boolean | undefined"}},biometricIntegration:{defaultValue:{value:"false"},description:"Whether to enable biometric integration",name:"biometricIntegration",required:!1,type:{name:"boolean | undefined"}},ambientResponse:{defaultValue:{value:"false"},description:"Ambient response to environmental factors",name:"ambientResponse",required:!1,type:{name:"boolean | undefined"}},thickness:{defaultValue:{value:"medium"},description:"Ring thickness",name:"thickness",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"thick"'},{value:'"thin"'}]}},glowIntensity:{defaultValue:{value:"medium"},description:"Glow effect intensity",name:"glowIntensity",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"strong"'},{value:'"none"'},{value:'"medium"'},{value:'"subtle"'}]}},pulse:{defaultValue:{value:"false"},description:"Pulse animation",name:"pulse",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Respect user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const se=Object.freeze(Object.defineProperty({__proto__:null,GlassMoodRing:g,default:g},Symbol.toStringTag,{value:"Module"})),V="GlassMoodRing",ae=se[V],ge={title:"Reference/Legacy Components/Glass Mood Ring",component:ae,parameters:{layout:"centered",docs:{description:{component:"Component-owned Storybook coverage for GlassMoodRing. This story renders the certified AuraGlass sample used by the full visual certification suite."}}}},C={render:()=>s.jsx(ee,{name:V})};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <CertificationCase name={componentName} />
}`,...C.parameters?.docs?.source}}};const pe=["Default"];export{C as Default,pe as __namedExportsOrder,ge as default};
