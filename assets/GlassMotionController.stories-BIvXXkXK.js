import{r as o,h as z,j as s,c as Q,o as R,R as ts}from"./iframe-C2Py7iTP.js";import{u as K}from"./MotionPreferenceContext-DOVeBjOR.js";import"./preload-helper-PPVm8Dsz.js";const es=o.createContext(void 0),U=()=>{const e=o.useContext(es);if(!e)throw new Error("useMotionController must be used within a GlassMotionController");return e},ss={linear:e=>e,easeIn:e=>e*e,easeOut:e=>e*(2-e),easeInOut:e=>e<.5?2*e*e:-1+(4-2*e)*e,bounce:e=>e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375,elastic:e=>e===0?0:e===1?1:-Math.pow(2,-10*e)*Math.sin((e-.1)*5*Math.PI)+1},k=o.forwardRef(({enabled:e=!0,speed:g=1,reduceMotion:j=!1,respectMotionPreference:t=!0,children:I,className:M,"aria-label":u,...b},y)=>{const[p,c]=o.useState(!1),f=K(),v=z("motion-controller"),N=t?j||f.prefersReducedMotion:j,w=async(n,l)=>{if(!e||N){N&&(G(n,l.type,l.direction||"center"),R(`Animation ${l.type} applied instantly due to reduced motion preference`,"polite"));return}return c(!0),R(`Starting ${l.type} animation`,"polite"),new Promise(m=>{const{type:a,direction:i="center",duration:P=1e3,delay:d=0,easing:q="easeOut",repeat:C=0,yoyo:V=!1,amplitude:Z=1,frequency:B=1}=l,J=P*g;let S,E=0;const T=_=>{if(S||(S=_),_-S<d){requestAnimationFrame(T);return}const L=_-S-d,O=Math.min(L/J,1),as=ss[q](O);if(r(n,a,i,as,Z,B),O<1)requestAnimationFrame(T);else if(E++,E<=C){if(S=_,V){const ls=x();requestAnimationFrame(ls);return}}else c(!1),R(`Animation ${l.type} completed`,"polite"),m()};requestAnimationFrame(T)})},h=async n=>{if(!e||N){N&&(n.forEach(({element:m,config:a})=>{G(m,a.type,a.direction||"center")}),R(`${n.length} animations applied instantly due to reduced motion preference`,"polite"));return}c(!0),R(`Starting batch animation of ${n.length} elements`,"polite");const l=n.map(({element:m,config:a})=>w(m,a));await Promise.all(l),c(!1),R("Batch animation completed","polite")},x=(n,l,m,a,i,P,d)=>q=>{},r=(n,l,m,a,i,P)=>{const d={};switch(l){case"fadeIn":case"fadeOut":d.opacity=l==="fadeIn"?a.toString():(1-a).toString();break;case"slideIn":case"slideOut":const q=100,C=l==="slideIn"?1-a:a;switch(m){case"up":d.transform=`translateY(${q*C}px)`;break;case"down":d.transform=`translateY(-${q*C}px)`;break;case"left":d.transform=`translateX(${q*C}px)`;break;case"right":d.transform=`translateX(-${q*C}px)`;break}break;case"scaleIn":case"scaleOut":const V=l==="scaleIn"?0:1,B=V+((l==="scaleIn"?1:0)-V)*a;d.transform=`scale(${B})`;break;case"bounce":const J=i*50,S=ss.bounce(a);d.transform=`translateY(${J*(1-S)}px)`;break;case"shake":const E=i*10,T=Math.sin(a*P*Math.PI*2)*E;d.transform=`translateX(${T}px)`;break;case"pulse":const _=1+Math.sin(a*P*Math.PI*2)*i*.1;d.transform=`scale(${_})`;break;case"rotate":const L=a*360*P;d.transform=`rotate(${L}deg)`;break;case"flip":const O=a*180;d.transform=`rotateY(${O}deg)`;break}Object.assign(n.style,d)},G=(n,l,m)=>{const a={};switch(l){case"fadeIn":a.opacity="1";break;case"fadeOut":a.opacity="0";break;case"slideIn":case"scaleIn":a.transform="none",a.opacity="1";break;case"slideOut":case"scaleOut":a.opacity="0";break;default:a.opacity="1",a.transform="none";break}Object.assign(n.style,a)};return s.jsx("div",{ref:y,className:M,id:v,"aria-label":u||(p?"Animation in progress":"Animation controller"),"aria-busy":p,role:"region",...b,children:s.jsx(es.Provider,{value:{enabled:e&&!N,speed:g,reduceMotion:N,animate:w,batchAnimate:h},children:I})})});k.displayName="GlassMotionController";const A=o.forwardRef(({animation:e,children:g,className:j="",trigger:t="mount",respectMotionPreference:I=!0,"aria-label":M,...u},b)=>{const{animate:y,enabled:p,reduceMotion:c}=U(),f=o.useRef(null),[v,N]=o.useState(!1),[w,h]=o.useState(!1),x=K(),r=z("animated"),G=i=>{f.current=i,typeof b=="function"?b(i):b&&(b.current=i)},n=I?c||x.prefersReducedMotion:c;o.useEffect(()=>{!p||!e||!f.current||v||t==="mount"&&(h(!0),y(f.current,e).then(()=>{N(!0),h(!1)}).catch(()=>{h(!1)}))},[y,e,p,t,v]);const l=async()=>{if(!(!p||!e||!f.current)&&t==="click"){h(!0);try{await y(f.current,e)}finally{h(!1)}}},m=async()=>{if(!(!p||!e||!f.current||t!=="hover")){h(!0);try{await y(f.current,e)}finally{h(!1)}}},a=i=>{t==="click"&&(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),l())};return s.jsxs("div",{ref:G,id:r,className:j,onClick:t==="click"?l:void 0,onMouseEnter:t==="hover"?m:void 0,onKeyDown:t==="click"?a:void 0,tabIndex:t==="click"?0:void 0,role:t==="click"?"button":void 0,"aria-label":M||(t==="click"?"Animated interactive element":void 0),"aria-busy":w,"aria-describedby":n?`${r}-motion-notice`:void 0,...u,children:[g,n&&s.jsx("div",{id:`${r}-motion-notice`,className:Q("glass-sr-only"),children:"Motion animations are disabled due to accessibility preferences"})]})});A.displayName="GlassAnimated";const $=o.forwardRef(({children:e,staggerDelay:g=100,className:j="",respectMotionPreference:t=!0,"aria-label":I,...M},u)=>{const{batchAnimate:b,enabled:y,reduceMotion:p}=U(),c=o.useRef(null),[f,v]=o.useState(!1),N=K(),w=z("animation-sequence"),h=r=>{c.current=r,typeof u=="function"?u(r):u&&(u.current=r)},x=t?p||N.prefersReducedMotion:p;return o.useEffect(()=>{if(!y||!c.current)return;const r=c.current.children,G=Array.from(r).map((n,l)=>({element:n,config:{type:"fadeIn",direction:"up",duration:600,delay:x?0:l*g,easing:"easeOut"}}));v(!0),b(G).then(()=>v(!1)).catch(()=>v(!1))},[b,y,g,x]),s.jsxs("div",{ref:h,id:w,className:j,role:"region","aria-label":I||"Animation sequence","aria-busy":f,"aria-describedby":x?`${w}-motion-notice`:void 0,...M,children:[e,x&&s.jsx("div",{id:`${w}-motion-notice`,className:Q("glass-sr-only"),children:"Sequential animations are disabled due to accessibility preferences"})]})});$.displayName="GlassAnimationSequence";const X=o.forwardRef(({timeline:e,children:g,className:j="",respectMotionPreference:t=!0,"aria-label":I,...M},u)=>{const{animate:b,enabled:y,reduceMotion:p}=U(),c=o.useRef(null),[f,v]=o.useState(!1),N=K(),w=z("animation-timeline"),h=r=>{c.current=r,typeof u=="function"?u(r):u&&(u.current=r)},x=t?p||N.prefersReducedMotion:p;return o.useEffect(()=>{if(!y||!c.current)return;v(!0);let r=[];e.forEach(({selector:G,animation:n,startTime:l=0})=>{const m=c.current?.querySelector(G);if(m){const a=new Promise(i=>{setTimeout(()=>{b(m,n).then(i).catch(i)},x?0:l)});r.push(a)}}),Promise.all(r).then(()=>v(!1)).catch(()=>v(!1))},[b,y,e,x]),s.jsxs("div",{ref:h,id:w,className:j,role:"region","aria-label":I||"Animation timeline","aria-busy":f,"aria-describedby":x?`${w}-motion-notice`:void 0,...M,children:[g,x&&s.jsx("div",{id:`${w}-motion-notice`,className:Q("glass-sr-only"),children:"Timeline animations are disabled due to accessibility preferences"})]})});X.displayName="GlassAnimationTimeline";try{k.displayName="GlassMotionController",k.__docgenInfo={description:"",displayName:"GlassMotionController",props:{enabled:{defaultValue:{value:"true"},description:"Whether animations are globally enabled",name:"enabled",required:!1,type:{name:"boolean | undefined"}},speed:{defaultValue:{value:"1"},description:"Global animation duration multiplier",name:"speed",required:!1,type:{name:"number | undefined"}},reduceMotion:{defaultValue:{value:"false"},description:"Whether to reduce motion for accessibility",name:"reduceMotion",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to respect motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},children:{defaultValue:null,description:"Children to animate",name:"children",required:!0,type:{name:"ReactNode"}},className:{defaultValue:{value:""},description:"Additional CSS class",name:"className",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"ARIA label for the motion controller",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}try{A.displayName="GlassAnimated",A.__docgenInfo={description:"",displayName:"GlassAnimated",props:{animation:{defaultValue:null,description:"",name:"animation",required:!1,type:{name:"AnimationConfig | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},trigger:{defaultValue:{value:"mount"},description:"",name:"trigger",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"manual"'},{value:'"hover"'},{value:'"click"'},{value:'"mount"'}]}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to respect motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},"aria-label":{defaultValue:null,description:"ARIA label for the animated element",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}try{$.displayName="GlassAnimationSequence",$.__docgenInfo={description:"",displayName:"GlassAnimationSequence",props:{staggerDelay:{defaultValue:{value:"100"},description:"",name:"staggerDelay",required:!1,type:{name:"number | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to respect motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},"aria-label":{defaultValue:null,description:"ARIA label for the sequence",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}try{X.displayName="GlassAnimationTimeline",X.__docgenInfo={description:"",displayName:"GlassAnimationTimeline",props:{timeline:{defaultValue:null,description:"",name:"timeline",required:!0,type:{name:"{ selector: string; animation: AnimationConfig; startTime?: number | undefined; }[]"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to respect motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},"aria-label":{defaultValue:null,description:"ARIA label for the timeline",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}const os={title:"Components/Animations/GlassMotionController",component:k,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassmotioncontroller component."}}},argTypes:{},args:{}},D={args:{children:s.jsxs("div",{className:"glass-foundation-complete glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-8 glass-text-center glass-contrast-guard",children:[s.jsx(A,{animation:{type:"fadeIn",duration:650},children:s.jsx("h3",{className:"glass-heading glass-text-2xl glass-font-bold glass-mb-4",children:"GlassMotionController"})}),s.jsx(A,{animation:{type:"slideIn",direction:"up",duration:800,delay:120},children:s.jsx("p",{className:"glass-body glass-text-base leading-relaxed",children:"Experience the ultimate glassmorphism component with stunning visual effects and premium typography."})}),s.jsxs("div",{className:"mt-6 glass-glass-inline-glass-flex glass-items-center glass-gap-3 glass-justify-center",children:[s.jsx(A,{animation:{type:"scaleIn",duration:600,delay:220},children:s.jsx("button",{className:"glass-foundation-complete glass-hover bg-glass-frosted glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-px-4 glass-py-2 transition-all glass-contrast-guard",children:"Try It"})}),s.jsx(A,{animation:{type:"fadeIn",duration:600,delay:300},children:s.jsx("span",{className:"glass-caption glass-text-xs opacity-80",children:"Animated on mount"})})]})]})}},F={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-6",children:[s.jsx(k,{...e,children:s.jsxs("div",{className:"glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-6 glass-text-center min-w-40 glass-contrast-guard",children:[s.jsx("span",{className:"glass-heading glass-text-lg glass-font-semibold",children:"Primary"}),s.jsx("p",{className:"glass-caption glass-text-sm glass-mt-1 opacity-80",children:"Premium variant"})]})}),s.jsx(k,{...e,children:s.jsxs("div",{className:"glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-6 glass-text-center min-w-40 glass-contrast-guard",children:[s.jsx("span",{className:"glass-heading glass-text-lg glass-font-semibold",children:"Secondary"}),s.jsx("p",{className:"glass-caption glass-text-sm glass-mt-1 opacity-80",children:"Elegant variant"})]})}),s.jsx(k,{...e,children:s.jsxs("div",{className:"glass-foundation-complete glass-glass-glass-backdrop-blur-md bg-glass-frosted glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-6 glass-text-center min-w-40 glass-contrast-guard",children:[s.jsx("span",{className:"glass-heading glass-text-lg glass-font-semibold",children:"Frosted"}),s.jsx("p",{className:"glass-caption glass-text-sm glass-mt-1 opacity-80",children:"Crystal clear"})]})})]}),args:{children:null}},W={render:e=>s.jsx(k,{enabled:!0,children:s.jsx($,{staggerDelay:200,children:s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-3 glass-gap-4",children:[s.jsxs(A,{className:"glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-p-6 glass-text-center hover:glass-shadow-2xl transition-all glass-contrast-guard",children:[s.jsx("div",{className:"glass-heading glass-text-xl glass-font-bold glass-mb-2",children:"Step 1"}),s.jsx("div",{className:"glass-body glass-text-sm glass-opacity-90",children:"Initialize"})]}),s.jsxs(A,{className:"glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-p-6 glass-text-center hover:glass-shadow-2xl transition-all glass-contrast-guard",children:[s.jsx("div",{className:"glass-heading glass-text-xl glass-font-bold glass-mb-2",children:"Step 2"}),s.jsx("div",{className:"glass-body glass-text-sm glass-opacity-90",children:"Process"})]}),s.jsxs(A,{className:"glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-p-6 glass-text-center hover:glass-shadow-2xl transition-all glass-contrast-guard",children:[s.jsx("div",{className:"glass-heading glass-text-xl glass-font-bold glass-mb-2",children:"Step 3"}),s.jsx("div",{className:"glass-body glass-text-sm glass-opacity-90",children:"Complete"})]})]})})})},Y={render:e=>s.jsx(k,{enabled:!0,children:s.jsx(X,{timeline:[{selector:".timeline-element",animation:{type:"fadeIn",duration:600},startTime:0},{selector:".timeline-element",animation:{type:"slideIn",direction:"left",duration:800},startTime:1e3},{selector:".timeline-element",animation:{type:"scaleIn",duration:600},startTime:2e3}],children:s.jsxs("div",{className:"timeline-element glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-12 glass-text-center glass-contrast-guard",children:[s.jsx("h3",{className:"glass-heading glass-text-3xl glass-font-bold glass-mb-4",children:"Timeline Animation"}),s.jsx("p",{className:"glass-body glass-text-lg leading-relaxed max-w-md glass-mx-auto",children:"Watch this element transform through a complex animation sequence with breathtaking glassmorphism effects."}),s.jsxs("div",{className:"mt-6 glass-glass-inline-glass-flex glass-items-center glass-gap-2 glass-code glass-px-4 glass-py-2 glass-radius-lg",children:[s.jsx("span",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full animate-pulse glass-contrast-guard"}),s.jsx("span",{className:"glass-text-xs font-mono",children:"Animation Active"})]})]})})})},H={render:e=>{const[g,j]=ts.useState(!1);return s.jsx(k,{enabled:!0,children:s.jsxs("div",{className:"glass-auto-gap glass-auto-gap-2xl",children:[s.jsx("div",{className:"glass-flex glass-justify-center",children:s.jsx("button",{onClick:t=>j(!g),className:"glass-foundation-complete glass-hover glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-px-8 glass-py-4 glass-radius-xl transition-all glass-button hover:glass-shadow-2xl hover:scale-110 hover:rotate-1 glass-focus glass-touch-target glass-contrast-guard",children:s.jsxs("span",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:`w-3 h-3 glass-radius-full ${g?"bg-red-400":"bg-green-400"} animate-pulse`}),s.jsxs("span",{className:"glass-heading glass-text-lg glass-font-semibold",children:[g?"Pause":"Play"," Sequence"]})]})})}),s.jsx($,{staggerDelay:g?200:0,children:s.jsx("div",{className:"glass-grid glass-glass-grid-cols-4 glass-gap-4",children:["🔵","🟢","🟡","🔴"].map((t,I)=>s.jsxs(A,{className:"glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-p-8 glass-radius-2xl glass-text-center hover:glass-shadow-2xl hover:scale-105 hover:-rotate-2 transition-all duration-300 glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-3 filter drop-glass-shadow-lg",children:t}),s.jsxs("div",{className:"glass-caption glass-text-xs glass-font-medium opacity-80 glass-uppercase tracking-wider",children:["Item ",I+1]})]},I))})})]})})}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div className="glass-foundation-complete glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-8 glass-text-center glass-contrast-guard">
        <GlassAnimated animation={{
        type: 'fadeIn',
        duration: 650
      }}>
          <h3 className="glass-heading glass-text-2xl glass-font-bold glass-mb-4">GlassMotionController</h3>
        </GlassAnimated>
        <GlassAnimated animation={{
        type: 'slideIn',
        direction: 'up',
        duration: 800,
        delay: 120
      }}>
          <p className="glass-body glass-text-base leading-relaxed">
            Experience the ultimate glassmorphism component with stunning visual effects and premium typography.
          </p>
        </GlassAnimated>
        <div className="mt-6 glass-glass-inline-glass-flex glass-items-center glass-gap-3 glass-justify-center">
          <GlassAnimated animation={{
          type: 'scaleIn',
          duration: 600,
          delay: 220
        }}>
            <button className="glass-foundation-complete glass-hover bg-glass-frosted glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-px-4 glass-py-2 transition-all glass-contrast-guard">
              Try It
            </button>
          </GlassAnimated>
          <GlassAnimated animation={{
          type: 'fadeIn',
          duration: 600,
          delay: 300
        }}>
            <span className="glass-caption glass-text-xs opacity-80">Animated on mount</span>
          </GlassAnimated>
        </div>
      </div>
  }
}`,...D.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-6">
      <GlassMotionController {...args}>
        <div className="glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-6 glass-text-center min-w-40 glass-contrast-guard">
          <span className="glass-heading glass-text-lg glass-font-semibold">Primary</span>
          <p className="glass-caption glass-text-sm glass-mt-1 opacity-80">Premium variant</p>
        </div>
      </GlassMotionController>
      <GlassMotionController {...args}>
        <div className="glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-6 glass-text-center min-w-40 glass-contrast-guard">
          <span className="glass-heading glass-text-lg glass-font-semibold">Secondary</span>
          <p className="glass-caption glass-text-sm glass-mt-1 opacity-80">Elegant variant</p>
        </div>
      </GlassMotionController>
      <GlassMotionController {...args}>
        <div className="glass-foundation-complete glass-glass-glass-backdrop-blur-md bg-glass-frosted glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-6 glass-text-center min-w-40 glass-contrast-guard">
          <span className="glass-heading glass-text-lg glass-font-semibold">Frosted</span>
          <p className="glass-caption glass-text-sm glass-mt-1 opacity-80">Crystal clear</p>
        </div>
      </GlassMotionController>
    </div>,
  args: {
    children: null
  }
}`,...F.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: args => <GlassMotionController enabled={true}>
      <GlassAnimationSequence staggerDelay={200}>
        <div className="glass-grid glass-glass-grid-cols-3 glass-gap-4">
          <GlassAnimated className="glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-p-6 glass-text-center hover:glass-shadow-2xl transition-all glass-contrast-guard">
            <div className="glass-heading glass-text-xl glass-font-bold glass-mb-2">Step 1</div>
            <div className="glass-body glass-text-sm glass-opacity-90">Initialize</div>
          </GlassAnimated>
          <GlassAnimated className="glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-p-6 glass-text-center hover:glass-shadow-2xl transition-all glass-contrast-guard">
            <div className="glass-heading glass-text-xl glass-font-bold glass-mb-2">Step 2</div>
            <div className="glass-body glass-text-sm glass-opacity-90">Process</div>
          </GlassAnimated>
          <GlassAnimated className="glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-p-6 glass-text-center hover:glass-shadow-2xl transition-all glass-contrast-guard">
            <div className="glass-heading glass-text-xl glass-font-bold glass-mb-2">Step 3</div>
            <div className="glass-body glass-text-sm glass-opacity-90">Complete</div>
          </GlassAnimated>
        </div>
      </GlassAnimationSequence>
    </GlassMotionController>
}`,...W.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: args => <GlassMotionController enabled={true}>
      <GlassAnimationTimeline timeline={[{
      selector: '.timeline-element',
      animation: {
        type: 'fadeIn',
        duration: 600
      },
      startTime: 0
    }, {
      selector: '.timeline-element',
      animation: {
        type: 'slideIn',
        direction: 'left',
        duration: 800
      },
      startTime: 1000
    }, {
      selector: '.timeline-element',
      animation: {
        type: 'scaleIn',
        duration: 600
      },
      startTime: 2000
    }]}>
        <div className="timeline-element glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-12 glass-text-center glass-contrast-guard">
          <h3 className="glass-heading glass-text-3xl glass-font-bold glass-mb-4">Timeline Animation</h3>
          <p className="glass-body glass-text-lg leading-relaxed max-w-md glass-mx-auto">Watch this element transform through a complex animation sequence with breathtaking glassmorphism effects.</p>
          <div className="mt-6 glass-glass-inline-glass-flex glass-items-center glass-gap-2 glass-code glass-px-4 glass-py-2 glass-radius-lg">
            <span className="glass-w-2 glass-h-2 glass-surface-green glass-radius-full animate-pulse glass-contrast-guard"></span>
            <span className="glass-text-xs font-mono">Animation Active</span>
          </div>
        </div>
      </GlassAnimationTimeline>
    </GlassMotionController>
}`,...Y.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    return <GlassMotionController enabled={true}>
        <div className="glass-auto-gap glass-auto-gap-2xl">
          <div className="glass-flex glass-justify-center">
            <button onClick={e => setIsPlaying(!isPlaying)} className="glass-foundation-complete glass-hover glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-px-8 glass-py-4 glass-radius-xl transition-all glass-button hover:glass-shadow-2xl hover:scale-110 hover:rotate-1 glass-focus glass-touch-target glass-contrast-guard">
              <span className="glass-flex glass-items-center glass-gap-3">
                <div className={\`w-3 h-3 glass-radius-full \${isPlaying ? 'bg-red-400' : 'bg-green-400'} animate-pulse\`}></div>
                <span className="glass-heading glass-text-lg glass-font-semibold">
                  {isPlaying ? 'Pause' : 'Play'} Sequence
                </span>
              </span>
            </button>
          </div>

          <GlassAnimationSequence staggerDelay={isPlaying ? 200 : 0}>
            <div className="glass-grid glass-glass-grid-cols-4 glass-gap-4">
              {['🔵', '🟢', '🟡', '🔴'].map((emoji, index) => <GlassAnimated key={index} className="glass-foundation-complete glass-glass-glass-backdrop-blur-md glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-p-8 glass-radius-2xl glass-text-center hover:glass-shadow-2xl hover:scale-105 hover:-rotate-2 transition-all duration-300 glass-contrast-guard">
                  <div className="glass-text-4xl glass-mb-3 filter drop-glass-shadow-lg">{emoji}</div>
                  <div className="glass-caption glass-text-xs glass-font-medium opacity-80 glass-uppercase tracking-wider">Item {index + 1}</div>
                </GlassAnimated>)}
            </div>
          </GlassAnimationSequence>
        </div>
      </GlassMotionController>;
  }
}`,...H.parameters?.docs?.source}}};const ds=["Default","Variants","AnimationSequence","AnimationTimeline","InteractiveSequence"];export{W as AnimationSequence,Y as AnimationTimeline,D as Default,H as InteractiveSequence,F as Variants,ds as __namedExportsOrder,os as default};
