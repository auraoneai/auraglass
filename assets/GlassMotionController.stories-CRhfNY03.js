import{r as g,j as e,c as D,R as le}from"./iframe-DL0Cy6Qm.js";import{u as L,a as O}from"./a11y-BmS7yTss.js";import{u as Q}from"./MotionPreferenceContext-CE2cIJWP.js";import"./preload-helper-PPVm8Dsz.js";const se=g.createContext(void 0),te={enabled:!1,speed:1,reduceMotion:!0,animate:async()=>{},batchAnimate:async()=>{}},Z=()=>g.useContext(se)??te,ee={linear:s=>s,easeIn:s=>s*s,easeOut:s=>s*(2-s),easeInOut:s=>s<.5?2*s*s:-1+(4-2*s)*s,bounce:s=>s<1/2.75?7.5625*s*s:s<2/2.75?7.5625*(s-=1.5/2.75)*s+.75:s<2.5/2.75?7.5625*(s-=2.25/2.75)*s+.9375:7.5625*(s-=2.625/2.75)*s+.984375,elastic:s=>s===0?0:s===1?1:-Math.pow(2,-10*s)*Math.sin((s-.1)*5*Math.PI)+1},C=g.forwardRef(({enabled:s=!0,speed:u=1,reduceMotion:q=!1,respectMotionPreference:I=!0,children:r,className:$,"aria-label":T,...j},f)=>{const[k,S]=g.useState(!1),E=Q(),h=L("motion-controller"),d=I?q||E.prefersReducedMotion:q,x=async(o,n)=>{if(!s||d){d&&(y(o,n.type,n.direction||"center"),O(`Animation ${n.type} applied instantly due to reduced motion preference`,"polite"));return}return S(!0),O(`Starting ${n.type} animation`,"polite"),new Promise(i=>{const{type:a,direction:N="center",duration:m=1e3,delay:l=0,easing:c="easeOut",repeat:t=0,yoyo:P=!1,amplitude:G=1,frequency:V=1}=n,_=m*u;let A,R=0;const W=p=>{if(A||(A=p),p-A<l){requestAnimationFrame(W);return}const U=p-A-l,H=Math.min(U/_,1),ae=ee[c](H);if(b(o,a,N,ae,G,V),H<1)requestAnimationFrame(W);else if(R++,R<=t){if(A=p,P){const ne=w();requestAnimationFrame(ne);return}}else S(!1),O(`Animation ${n.type} completed`,"polite"),i()};requestAnimationFrame(W)})},v=async o=>{if(!s||d){d&&(o.forEach(({element:i,config:a})=>{y(i,a.type,a.direction||"center")}),O(`${o.length} animations applied instantly due to reduced motion preference`,"polite"));return}S(!0),O(`Starting batch animation of ${o.length} elements`,"polite");const n=o.map(({element:i,config:a})=>x(i,a));await Promise.all(n),S(!1),O("Batch animation completed","polite")},w=(o,n,i,a,N,m,l)=>c=>{},b=(o,n,i,a,N,m)=>{const l={};switch(n){case"fadeIn":case"fadeOut":l.opacity=n==="fadeIn"?a.toString():(1-a).toString();break;case"slideIn":case"slideOut":const c=100,t=n==="slideIn"?1-a:a;switch(i){case"up":l.transform=`translateY(${c*t}px)`;break;case"down":l.transform=`translateY(-${c*t}px)`;break;case"left":l.transform=`translateX(${c*t}px)`;break;case"right":l.transform=`translateX(-${c*t}px)`;break}break;case"scaleIn":case"scaleOut":const P=n==="scaleIn"?0:1,V=P+((n==="scaleIn"?1:0)-P)*a;l.transform=`scale(${V})`;break;case"bounce":const _=N*50,A=ee.bounce(a);l.transform=`translateY(${_*(1-A)}px)`;break;case"shake":const R=N*10,W=Math.sin(a*m*Math.PI*2)*R;l.transform=`translateX(${W}px)`;break;case"pulse":const p=1+Math.sin(a*m*Math.PI*2)*N*.1;l.transform=`scale(${p})`;break;case"rotate":const U=a*360*m;l.transform=`rotate(${U}deg)`;break;case"flip":const H=a*180;l.transform=`rotateY(${H}deg)`;break}Object.assign(o.style,l)},y=(o,n,i)=>{const a={};switch(n){case"fadeIn":a.opacity="1";break;case"fadeOut":a.opacity="0";break;case"slideIn":case"scaleIn":a.transform="none",a.opacity="1";break;case"slideOut":case"scaleOut":a.opacity="0";break;default:a.opacity="1",a.transform="none";break}Object.assign(o.style,a)};return e.jsx("div",{ref:f,className:$,id:h,"aria-label":T||(k?"Animation in progress":"Animation controller"),"aria-busy":k,role:"region",...j,children:e.jsx(se.Provider,{value:{enabled:s&&!d,speed:u,reduceMotion:d,animate:x,batchAnimate:v},children:r})})});C.displayName="GlassMotionController";const M=g.forwardRef(({animation:s,children:u,className:q="",style:I,trigger:r="mount",compact:$=!1,contained:T=!1,preview:j=!1,maxHeight:f,maxWidth:k,respectMotionPreference:S=!0,"aria-label":E,...h},d)=>{const{animate:x,enabled:v,reduceMotion:w}=Z(),b=g.useRef(null),[y,o]=g.useState(!1),[n,i]=g.useState(!1),a=Q(),N=L("animated"),m=p=>{b.current=p,typeof d=="function"?d(p):d&&(d.current=p)},l=S?w||a.prefersReducedMotion:w,c=s?.repeat===1/0&&r==="mount"&&!l?s:void 0,t=c?.type==="pulse"?{animation:`ag-glass-animated-pulse ${c.duration??1200}ms ease-in-out infinite`}:c?.type==="rotate"?{animation:`ag-glass-animated-rotate ${c.duration??1200}ms linear infinite`}:void 0,G=T||($||j),V=typeof f=="number"?`${f}px`:f,_=typeof k=="number"?`${k}px`:k;g.useEffect(()=>{!v||!s||!b.current||y||r==="mount"&&(i(!0),x(b.current,s).then(()=>{o(!0),i(!1)}).catch(()=>{i(!1)}))},[x,s,v,r,y]);const A=async()=>{if(!(!v||!s||!b.current)&&r==="click"){i(!0);try{await x(b.current,s)}finally{i(!1)}}},R=async()=>{if(!(!v||!s||!b.current||r!=="hover")){i(!0);try{await x(b.current,s)}finally{i(!1)}}},W=p=>{r==="click"&&(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),A())};return e.jsxs("div",{ref:m,id:N,className:D(G&&"glass-overflow-hidden glass-w-full",q),style:{maxHeight:V??(G?"220px":void 0),maxWidth:_??(G?"320px":void 0),...t,...I??{}},onClick:r==="click"?A:void 0,onMouseEnter:r==="hover"?R:void 0,onKeyDown:r==="click"?W:void 0,tabIndex:r==="click"?0:void 0,role:r==="click"?"button":void 0,"aria-label":E||(r==="click"?"Animated interactive element":void 0),"aria-busy":n,"aria-describedby":l?`${N}-motion-notice`:void 0,...h,children:[u,l&&e.jsx("div",{id:`${N}-motion-notice`,className:D("glass-sr-only"),children:"Motion animations are disabled due to accessibility preferences"}),t?e.jsx("style",{children:`
            @keyframes ag-glass-animated-pulse {
              0%, 100% { transform: scale(1); filter: brightness(1); }
              50% { transform: scale(${1+(c?.amplitude??1)*.05}); filter: brightness(1.18); }
            }
            @keyframes ag-glass-animated-rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}):null]})});M.displayName="GlassAnimated";const F=g.forwardRef(({children:s,staggerDelay:u=100,className:q="",style:I,compact:r=!1,contained:$=!1,preview:T=!1,maxHeight:j,maxWidth:f,respectMotionPreference:k=!0,"aria-label":S,...E},h)=>{const{batchAnimate:d,enabled:x,reduceMotion:v}=Z(),w=g.useRef(null),[b,y]=g.useState(!1),o=Q(),n=L("animation-sequence"),i=t=>{w.current=t,typeof h=="function"?h(t):h&&(h.current=t)},a=k?v||o.prefersReducedMotion:v,m=$||(r||T),l=typeof j=="number"?`${j}px`:j,c=typeof f=="number"?`${f}px`:f;return g.useEffect(()=>{if(!x||!w.current)return;const t=w.current.children,P=Array.from(t).map((G,V)=>({element:G,config:{type:"fadeIn",direction:"up",duration:600,delay:a?0:V*u,easing:"easeOut"}}));y(!0),d(P).then(()=>y(!1)).catch(()=>y(!1))},[d,x,u,a]),e.jsxs("div",{ref:i,id:n,className:D(m&&"glass-overflow-auto glass-w-full",q),style:{maxHeight:l??(m?"220px":void 0),maxWidth:c??(m?"320px":void 0),...I??{}},role:"region","aria-label":S||"Animation sequence","aria-busy":b,"aria-describedby":a?`${n}-motion-notice`:void 0,...E,children:[s,a&&e.jsx("div",{id:`${n}-motion-notice`,className:D("glass-sr-only"),children:"Sequential animations are disabled due to accessibility preferences"})]})});F.displayName="GlassAnimationSequence";const J=g.forwardRef(({timeline:s,children:u,className:q="",style:I,compact:r=!1,contained:$=!1,preview:T=!1,maxHeight:j,maxWidth:f,respectMotionPreference:k=!0,"aria-label":S,...E},h)=>{const{animate:d,enabled:x,reduceMotion:v}=Z(),w=g.useRef(null),[b,y]=g.useState(!1),o=Q(),n=L("animation-timeline"),i=t=>{w.current=t,typeof h=="function"?h(t):h&&(h.current=t)},a=k?v||o.prefersReducedMotion:v,m=$||(r||T),l=typeof j=="number"?`${j}px`:j,c=typeof f=="number"?`${f}px`:f;return g.useEffect(()=>{if(!x||!w.current)return;y(!0);let t=[];s.forEach(({selector:P,animation:G,startTime:V=0})=>{const _=w.current?.querySelector(P);if(_){const A=new Promise(R=>{setTimeout(()=>{d(_,G).then(R).catch(R)},a?0:V)});t.push(A)}}),Promise.all(t).then(()=>y(!1)).catch(()=>y(!1))},[d,x,s,a]),e.jsxs("div",{ref:i,id:n,className:D(m&&"glass-overflow-auto glass-w-full",q),style:{maxHeight:l??(m?"220px":void 0),maxWidth:c??(m?"320px":void 0),...I??{}},role:"region","aria-label":S||"Animation timeline","aria-busy":b,"aria-describedby":a?`${n}-motion-notice`:void 0,...E,children:[u,a&&e.jsx("div",{id:`${n}-motion-notice`,className:D("glass-sr-only"),children:"Timeline animations are disabled due to accessibility preferences"})]})});J.displayName="GlassAnimationTimeline";try{C.displayName="GlassMotionController",C.__docgenInfo={description:"",displayName:"GlassMotionController",props:{enabled:{defaultValue:{value:"true"},description:"Whether animations are globally enabled",name:"enabled",required:!1,type:{name:"boolean | undefined"}},speed:{defaultValue:{value:"1"},description:"Global animation duration multiplier",name:"speed",required:!1,type:{name:"number | undefined"}},reduceMotion:{defaultValue:{value:"false"},description:"Whether to reduce motion for accessibility",name:"reduceMotion",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to respect motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},children:{defaultValue:null,description:"Children to animate",name:"children",required:!0,type:{name:"ReactNode"}},className:{defaultValue:{value:""},description:"Additional CSS class",name:"className",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"ARIA label for the motion controller",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}try{M.displayName="GlassAnimated",M.__docgenInfo={description:"",displayName:"GlassAnimated",props:{animation:{defaultValue:null,description:"",name:"animation",required:!1,type:{name:"AnimationConfig | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},trigger:{defaultValue:{value:"mount"},description:"",name:"trigger",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"manual"'},{value:'"hover"'},{value:'"click"'},{value:'"mount"'}]}},compact:{defaultValue:{value:"false"},description:"Compact density for constrained cards, drawers, and documentation previews.",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"Keep the animated surface inside a bounded local viewport.",name:"contained",required:!1,type:{name:"boolean | undefined"}},preview:{defaultValue:{value:"false"},description:"Alias for compact preview rendering.",name:"preview",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"Maximum rendered height when contained or compact.",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},maxWidth:{defaultValue:null,description:"Maximum rendered width when contained or compact.",name:"maxWidth",required:!1,type:{name:"string | number | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to respect motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},"aria-label":{defaultValue:null,description:"ARIA label for the animated element",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}try{F.displayName="GlassAnimationSequence",F.__docgenInfo={description:"",displayName:"GlassAnimationSequence",props:{staggerDelay:{defaultValue:{value:"100"},description:"",name:"staggerDelay",required:!1,type:{name:"number | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},compact:{defaultValue:{value:"false"},description:"Compact density for constrained cards, drawers, and documentation previews.",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"Keep the sequence inside a bounded local viewport.",name:"contained",required:!1,type:{name:"boolean | undefined"}},preview:{defaultValue:{value:"false"},description:"Alias for compact preview rendering.",name:"preview",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"Maximum rendered height when contained or compact.",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},maxWidth:{defaultValue:null,description:"Maximum rendered width when contained or compact.",name:"maxWidth",required:!1,type:{name:"string | number | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to respect motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},"aria-label":{defaultValue:null,description:"ARIA label for the sequence",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}try{J.displayName="GlassAnimationTimeline",J.__docgenInfo={description:"",displayName:"GlassAnimationTimeline",props:{timeline:{defaultValue:null,description:"",name:"timeline",required:!0,type:{name:"{ selector: string; animation: AnimationConfig; startTime?: number | undefined; }[]"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},compact:{defaultValue:{value:"false"},description:"Compact density for constrained cards, drawers, and documentation previews.",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"Keep the timeline inside a bounded local viewport.",name:"contained",required:!1,type:{name:"boolean | undefined"}},preview:{defaultValue:{value:"false"},description:"Alias for compact preview rendering.",name:"preview",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"Maximum rendered height when contained or compact.",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},maxWidth:{defaultValue:null,description:"Maximum rendered width when contained or compact.",name:"maxWidth",required:!1,type:{name:"string | number | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to respect motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},"aria-label":{defaultValue:null,description:"ARIA label for the timeline",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}const ce={title:"Foundations/Motion/Glass Motion Controller",component:C,parameters:{layout:"centered",previewSurface:"media",docs:{description:{component:"A glass morphism glassmotioncontroller component."}}},decorators:[s=>e.jsxs("div",{className:"motion-controller-story-shell",style:{width:"100%",maxWidth:920,maxHeight:"min(720px, calc(100vh - 64px))",overflow:"auto",borderRadius:20,border:"1px solid rgba(255, 255, 255, 0.24)",background:"linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(17, 94, 89, 0.92))",boxShadow:"0 28px 72px rgba(2, 6, 23, 0.44)",color:"#f8fafc",padding:"clamp(16px, 3vw, 28px)"},children:[e.jsx("style",{children:`
          .motion-controller-story-shell,
          .motion-controller-story-shell * {
            box-sizing: border-box;
          }

          .motion-controller-story-shell :where(h1, h2, h3, p, span, button, div) {
            color: #f8fafc;
            overflow-wrap: anywhere;
          }

          .motion-controller-story-shell :where(.glass-body, .glass-caption) {
            color: #e2e8f0;
            opacity: 1;
          }

          .motion-controller-story-shell :where(button, [role="button"]) {
            min-width: 0;
            max-width: 100%;
            background: rgba(15, 23, 42, 0.72);
            border-color: rgba(255, 255, 255, 0.34);
          }

          .motion-controller-story-shell :where(.glass-flex, .glass-glass-inline-glass-flex) {
            flex-wrap: wrap;
          }

          .motion-controller-story-shell :where(.glass-grid) {
            width: 100%;
            min-width: 0;
          }

          .motion-controller-story-shell :where(.glass-glass-grid-cols-3, .glass-glass-grid-cols-4) {
            grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
          }

          @media (max-width: 560px) {
            .motion-controller-story-shell {
              max-height: calc(100vh - 40px);
              padding: 16px;
            }

            .motion-controller-story-shell :where(.glass-p-12, .glass-p-8, .glass-p-6) {
              padding: 18px;
            }
          }
        `}),e.jsx(s,{})]})],argTypes:{},args:{}},K={args:{children:e.jsxs("div",{className:"glass-foundation-complete glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-8 glass-text-center glass-contrast-guard",children:[e.jsx(M,{animation:{type:"fadeIn",duration:650},children:e.jsx("h3",{className:"glass-heading glass-text-2xl glass-font-bold glass-mb-4",children:"GlassMotionController"})}),e.jsx(M,{animation:{type:"slideIn",direction:"up",duration:800,delay:120},children:e.jsx("p",{className:"glass-body glass-text-base leading-relaxed",children:"Experience the ultimate glassmorphism component with stunning visual effects and premium typography."})}),e.jsxs("div",{className:"mt-6 glass-glass-inline-glass-flex glass-items-center glass-gap-3 glass-justify-center",children:[e.jsx(M,{animation:{type:"scaleIn",duration:600,delay:220},children:e.jsx("button",{className:"glass-foundation-complete glass-hover bg-glass-frosted glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-px-4 glass-py-2 transition-all glass-contrast-guard",children:"Try It"})}),e.jsx(M,{animation:{type:"fadeIn",duration:600,delay:300},children:e.jsx("span",{className:"glass-caption glass-text-xs opacity-80",children:"Animated on mount"})})]})]})}},Y={render:s=>e.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-6",children:[e.jsx(C,{...s,children:e.jsxs("div",{className:"glass-foundation-complete glass-glass-backdrop-blur glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-6 glass-text-center min-w-40 glass-contrast-guard",children:[e.jsx("span",{className:"glass-heading glass-text-lg glass-font-semibold",children:"Primary"}),e.jsx("p",{className:"glass-caption glass-text-sm glass-mt-1 opacity-80",children:"Premium variant"})]})}),e.jsx(C,{...s,children:e.jsxs("div",{className:"glass-foundation-complete glass-glass-backdrop-blur glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-6 glass-text-center min-w-40 glass-contrast-guard",children:[e.jsx("span",{className:"glass-heading glass-text-lg glass-font-semibold",children:"Secondary"}),e.jsx("p",{className:"glass-caption glass-text-sm glass-mt-1 opacity-80",children:"Elegant variant"})]})}),e.jsx(C,{...s,children:e.jsxs("div",{className:"glass-foundation-complete glass-glass-backdrop-blur bg-glass-frosted glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-6 glass-text-center min-w-40 glass-contrast-guard",children:[e.jsx("span",{className:"glass-heading glass-text-lg glass-font-semibold",children:"Frosted"}),e.jsx("p",{className:"glass-caption glass-text-sm glass-mt-1 opacity-80",children:"Crystal clear"})]})})]}),args:{children:null}},z={render:s=>e.jsx(C,{enabled:!0,children:e.jsx(F,{staggerDelay:200,children:e.jsxs("div",{className:"glass-grid glass-glass-grid-cols-3 glass-gap-4",children:[e.jsxs(M,{className:"glass-foundation-complete glass-glass-backdrop-blur glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-p-6 glass-text-center hover:glass-shadow-2xl transition-all glass-contrast-guard",children:[e.jsx("div",{className:"glass-heading glass-text-xl glass-font-bold glass-mb-2",children:"Step 1"}),e.jsx("div",{className:"glass-body glass-text-sm glass-opacity-90",children:"Initialize"})]}),e.jsxs(M,{className:"glass-foundation-complete glass-glass-backdrop-blur glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-p-6 glass-text-center hover:glass-shadow-2xl transition-all glass-contrast-guard",children:[e.jsx("div",{className:"glass-heading glass-text-xl glass-font-bold glass-mb-2",children:"Step 2"}),e.jsx("div",{className:"glass-body glass-text-sm glass-opacity-90",children:"Process"})]}),e.jsxs(M,{className:"glass-foundation-complete glass-glass-backdrop-blur glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-p-6 glass-text-center hover:glass-shadow-2xl transition-all glass-contrast-guard",children:[e.jsx("div",{className:"glass-heading glass-text-xl glass-font-bold glass-mb-2",children:"Step 3"}),e.jsx("div",{className:"glass-body glass-text-sm glass-opacity-90",children:"Complete"})]})]})})})},X={render:s=>e.jsx(C,{enabled:!0,children:e.jsx(J,{timeline:[{selector:".timeline-element",animation:{type:"fadeIn",duration:600},startTime:0},{selector:".timeline-element",animation:{type:"slideIn",direction:"left",duration:800},startTime:1e3},{selector:".timeline-element",animation:{type:"scaleIn",duration:600},startTime:2e3}],children:e.jsxs("div",{className:"timeline-element glass-foundation-complete glass-glass-backdrop-blur glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-12 glass-text-center glass-contrast-guard",children:[e.jsx("h3",{className:"glass-heading glass-text-3xl glass-font-bold glass-mb-4",children:"Timeline Animation"}),e.jsx("p",{className:"glass-body glass-text-lg leading-relaxed max-w-md glass-mx-auto",children:"Watch this element transform through a complex animation sequence with breathtaking glassmorphism effects."}),e.jsxs("div",{className:"mt-6 glass-glass-inline-glass-flex glass-items-center glass-gap-2 glass-code glass-px-4 glass-py-2 glass-radius-lg",children:[e.jsx("span",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full animate-pulse glass-contrast-guard"}),e.jsx("span",{className:"glass-text-xs font-mono",children:"Animation Active"})]})]})})})},B={render:s=>{const[u,q]=le.useState(!1);return e.jsx(C,{enabled:!0,children:e.jsxs("div",{className:"glass-auto-gap glass-auto-gap-2xl",children:[e.jsx("div",{className:"glass-flex glass-justify-center",children:e.jsx("button",{onClick:I=>q(!u),className:"glass-foundation-complete glass-hover glass-glass-backdrop-blur glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-px-8 glass-py-4 glass-radius-xl transition-all glass-button hover:glass-shadow-2xl hover:scale-110 hover:rotate-1 glass-focus glass-touch-target glass-contrast-guard",children:e.jsxs("span",{className:"glass-flex glass-items-center glass-gap-3",children:[e.jsx("div",{className:`w-3 h-3 glass-radius-full ${u?"bg-red-400":"bg-green-400"} animate-pulse`}),e.jsxs("span",{className:"glass-heading glass-text-lg glass-font-semibold",children:[u?"Pause":"Play"," Sequence"]})]})})}),e.jsx(F,{staggerDelay:u?200:0,children:e.jsx("div",{className:"glass-grid glass-glass-grid-cols-4 glass-gap-4",children:["🔵","🟢","🟡","🔴"].map((I,r)=>e.jsxs(M,{className:"glass-foundation-complete glass-glass-backdrop-blur glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-p-8 glass-radius-2xl glass-text-center hover:glass-shadow-2xl hover:scale-105 hover:-rotate-2 transition-all duration-300 glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3 filter drop-glass-shadow-lg",children:I}),e.jsxs("div",{className:"glass-caption glass-text-xs glass-font-medium opacity-80 glass-uppercase tracking-wider",children:["Item ",r+1]})]},r))})})]})})}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div className="glass-foundation-complete glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-8 glass-text-center glass-contrast-guard">
        <GlassAnimated animation={{
        type: "fadeIn",
        duration: 650
      }}>
          <h3 className="glass-heading glass-text-2xl glass-font-bold glass-mb-4">
            GlassMotionController
          </h3>
        </GlassAnimated>
        <GlassAnimated animation={{
        type: "slideIn",
        direction: "up",
        duration: 800,
        delay: 120
      }}>
          <p className="glass-body glass-text-base leading-relaxed">
            Experience the ultimate glassmorphism component with stunning visual
            effects and premium typography.
          </p>
        </GlassAnimated>
        <div className="mt-6 glass-glass-inline-glass-flex glass-items-center glass-gap-3 glass-justify-center">
          <GlassAnimated animation={{
          type: "scaleIn",
          duration: 600,
          delay: 220
        }}>
            <button className="glass-foundation-complete glass-hover bg-glass-frosted glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-px-4 glass-py-2 transition-all glass-contrast-guard">
              Try It
            </button>
          </GlassAnimated>
          <GlassAnimated animation={{
          type: "fadeIn",
          duration: 600,
          delay: 300
        }}>
            <span className="glass-caption glass-text-xs opacity-80">
              Animated on mount
            </span>
          </GlassAnimated>
        </div>
      </div>
  }
}`,...K.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-6">
      <GlassMotionController {...args}>
        <div className="glass-foundation-complete glass-glass-backdrop-blur glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-6 glass-text-center min-w-40 glass-contrast-guard">
          <span className="glass-heading glass-text-lg glass-font-semibold">
            Primary
          </span>
          <p className="glass-caption glass-text-sm glass-mt-1 opacity-80">
            Premium variant
          </p>
        </div>
      </GlassMotionController>
      <GlassMotionController {...args}>
        <div className="glass-foundation-complete glass-glass-backdrop-blur glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-6 glass-text-center min-w-40 glass-contrast-guard">
          <span className="glass-heading glass-text-lg glass-font-semibold">
            Secondary
          </span>
          <p className="glass-caption glass-text-sm glass-mt-1 opacity-80">
            Elegant variant
          </p>
        </div>
      </GlassMotionController>
      <GlassMotionController {...args}>
        <div className="glass-foundation-complete glass-glass-backdrop-blur bg-glass-frosted glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-6 glass-text-center min-w-40 glass-contrast-guard">
          <span className="glass-heading glass-text-lg glass-font-semibold">
            Frosted
          </span>
          <p className="glass-caption glass-text-sm glass-mt-1 opacity-80">
            Crystal clear
          </p>
        </div>
      </GlassMotionController>
    </div>,
  args: {
    children: null
  }
}`,...Y.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: args => <GlassMotionController enabled={true}>
      <GlassAnimationSequence staggerDelay={200}>
        <div className="glass-grid glass-glass-grid-cols-3 glass-gap-4">
          <GlassAnimated className="glass-foundation-complete glass-glass-backdrop-blur glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-p-6 glass-text-center hover:glass-shadow-2xl transition-all glass-contrast-guard">
            <div className="glass-heading glass-text-xl glass-font-bold glass-mb-2">
              Step 1
            </div>
            <div className="glass-body glass-text-sm glass-opacity-90">
              Initialize
            </div>
          </GlassAnimated>
          <GlassAnimated className="glass-foundation-complete glass-glass-backdrop-blur glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-p-6 glass-text-center hover:glass-shadow-2xl transition-all glass-contrast-guard">
            <div className="glass-heading glass-text-xl glass-font-bold glass-mb-2">
              Step 2
            </div>
            <div className="glass-body glass-text-sm glass-opacity-90">
              Process
            </div>
          </GlassAnimated>
          <GlassAnimated className="glass-foundation-complete glass-glass-backdrop-blur glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-xl glass-p-6 glass-text-center hover:glass-shadow-2xl transition-all glass-contrast-guard">
            <div className="glass-heading glass-text-xl glass-font-bold glass-mb-2">
              Step 3
            </div>
            <div className="glass-body glass-text-sm glass-opacity-90">
              Complete
            </div>
          </GlassAnimated>
        </div>
      </GlassAnimationSequence>
    </GlassMotionController>
}`,...z.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: args => <GlassMotionController enabled={true}>
      <GlassAnimationTimeline timeline={[{
      selector: ".timeline-element",
      animation: {
        type: "fadeIn",
        duration: 600
      },
      startTime: 0
    }, {
      selector: ".timeline-element",
      animation: {
        type: "slideIn",
        direction: "left",
        duration: 800
      },
      startTime: 1000
    }, {
      selector: ".timeline-element",
      animation: {
        type: "scaleIn",
        duration: 600
      },
      startTime: 2000
    }]}>
        <div className="timeline-element glass-foundation-complete glass-glass-backdrop-blur glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-radius-2xl glass-p-12 glass-text-center glass-contrast-guard">
          <h3 className="glass-heading glass-text-3xl glass-font-bold glass-mb-4">
            Timeline Animation
          </h3>
          <p className="glass-body glass-text-lg leading-relaxed max-w-md glass-mx-auto">
            Watch this element transform through a complex animation sequence
            with breathtaking glassmorphism effects.
          </p>
          <div className="mt-6 glass-glass-inline-glass-flex glass-items-center glass-gap-2 glass-code glass-px-4 glass-py-2 glass-radius-lg">
            <span className="glass-w-2 glass-h-2 glass-surface-green glass-radius-full animate-pulse glass-contrast-guard"></span>
            <span className="glass-text-xs font-mono">Animation Active</span>
          </div>
        </div>
      </GlassAnimationTimeline>
    </GlassMotionController>
}`,...X.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    return <GlassMotionController enabled={true}>
        <div className="glass-auto-gap glass-auto-gap-2xl">
          <div className="glass-flex glass-justify-center">
            <button onClick={e => setIsPlaying(!isPlaying)} className="glass-foundation-complete glass-hover glass-glass-backdrop-blur glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-px-8 glass-py-4 glass-radius-xl transition-all glass-button hover:glass-shadow-2xl hover:scale-110 hover:rotate-1 glass-focus glass-touch-target glass-contrast-guard">
              <span className="glass-flex glass-items-center glass-gap-3">
                <div className={\`w-3 h-3 glass-radius-full \${isPlaying ? "bg-red-400" : "bg-green-400"} animate-pulse\`}></div>
                <span className="glass-heading glass-text-lg glass-font-semibold">
                  {isPlaying ? "Pause" : "Play"} Sequence
                </span>
              </span>
            </button>
          </div>

          <GlassAnimationSequence staggerDelay={isPlaying ? 200 : 0}>
            <div className="glass-grid glass-glass-grid-cols-4 glass-gap-4">
              {["🔵", "🟢", "🟡", "🔴"].map((emoji, index) => <GlassAnimated key={index} className="glass-foundation-complete glass-glass-backdrop-blur glass-bg-transparent glass-border-white/40 glass-shadow-2xl glass-p-8 glass-radius-2xl glass-text-center hover:glass-shadow-2xl hover:scale-105 hover:-rotate-2 transition-all duration-300 glass-contrast-guard">
                  <div className="glass-text-4xl glass-mb-3 filter drop-glass-shadow-lg">
                    {emoji}
                  </div>
                  <div className="glass-caption glass-text-xs glass-font-medium opacity-80 glass-uppercase tracking-wider">
                    Item {index + 1}
                  </div>
                </GlassAnimated>)}
            </div>
          </GlassAnimationSequence>
        </div>
      </GlassMotionController>;
  }
}`,...B.parameters?.docs?.source}}};const ge=["Default","Variants","AnimationSequence","AnimationTimeline","InteractiveSequence"];export{z as AnimationSequence,X as AnimationTimeline,K as Default,B as InteractiveSequence,Y as Variants,ge as __namedExportsOrder,ce as default};
