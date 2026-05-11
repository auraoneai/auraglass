import{b as O,j as r,m as C,d as y,c as k,f as W,r as o,e as $,C as X}from"./iframe-CrdWMSIk.js";import{g as Y}from"./soundDesign-Ct9H_xED.js";import{u as q}from"./use-motion-value-Dz_T9ciX.js";import{S as J}from"./StorybookVisualShowcase-CTObJbkE.js";import"./preload-helper-PPVm8Dsz.js";const B=[{emoji:"👍",name:"Like",color:"var(--glass-color-primary)",sound:"success",shortcut:"1"},{emoji:"❤️",name:"Love",color:"var(--glass-color-danger)",sound:"notification",shortcut:"2"},{emoji:"😂",name:"Laugh",color:"var(--glass-color-warning)",sound:"tap",shortcut:"3"},{emoji:"😮",name:"Wow",color:W.semantic.secondary,sound:"morph",shortcut:"4"},{emoji:"😢",name:"Sad",color:"var(--glass-gray-500)",sound:"slide",shortcut:"5"},{emoji:"😡",name:"Angry",color:"var(--glass-color-danger-dark)",sound:"error",shortcut:"6"},{emoji:"🎉",name:"Celebrate",color:"var(--glass-color-success)",sound:"success",shortcut:"7"},{emoji:"🤔",name:"Think",color:"var(--glass-color-warning)",sound:"hover",shortcut:"8"}];function G({children:c,className:s,reactions:g=[],reactionTypes:e=B,maxReactions:l=50,autoExpire:a=5e3,enablePhysics:n=!0,enableSounds:t=!0,enableShortcuts:u=!0,enableBurst:R=!0,glassEffect:v=!0,onReactionAdd:j,onReactionExpire:b}){O();const x=o.useRef(null),[D,S]=o.useState([]),[M,N]=o.useState(!1),[w,_]=o.useState({x:0,y:0}),U=o.useRef(0),V=o.useRef(0),z=[...g,...D].slice(-l),K=o.useCallback(i=>{const f=Date.now(),d=f-U.current;if(d<y.DURATION.normal){const h=x.current;if(!h)return;const m=h.getBoundingClientRect(),p=i.clientX-m.left,A=i.clientY-m.top;if(E(e[0].emoji,{x:p,y:A},1),R&&d<y.DURATION.fast&&(V.current++,V.current>=2))for(let L=0;L<5;L++)setTimeout(()=>{const H=e[Math.floor(Math.random()*e.length)];E(H.emoji,{x:p+(Math.random()-.5)*100,y:A+(Math.random()-.5)*100},Math.random()*.5+.5)},L*y.DURATION.fast)}else V.current=0;U.current=f},[e,R]),P=o.useCallback(i=>{i.preventDefault();const f=x.current;if(!f)return;const d=f.getBoundingClientRect(),h=i.clientX-d.left,m=i.clientY-d.top;_({x:h,y:m}),N(!0)},[]),E=o.useCallback((i,f,d=1)=>{const h=e.find(p=>p.emoji===i),m={id:`${Date.now()}-${Math.random()}`,emoji:i,position:f,timestamp:Date.now(),intensity:d,physics:n?{velocity:{x:(Math.random()-.5)*200*d,y:-Math.random()*100*d-50},rotation:(Math.random()-.5)*180,scale:.8+Math.random()*.4}:void 0};S(p=>[...p,m]),t&&h?.sound&&Y.playGlassSound(h.sound),"vibrate"in navigator&&navigator.vibrate(y.DURATION.fast/3*d),j?.(m),a>0&&setTimeout(()=>{S(p=>p.filter(A=>A.id!==m.id)),b?.(m.id)},a)},[e,n,t,a,j,b]);return o.useEffect(()=>{if(!u)return;const i=f=>{if(f.key>="1"&&f.key<="9"){const d=parseInt(f.key)-1,h=e[d];if(h){const m=x.current;if(m){const p=m.getBoundingClientRect();E(h.emoji,{x:p.width/2,y:p.height/2})}}}};return window.addEventListener("keypress",i),()=>window.removeEventListener("keypress",i)},[u,e,E]),r.jsxs("div",{ref:x,className:k("relative",s),onClick:K,onContextMenu:P,role:"region","aria-label":"Interactive reactions area",children:[c,r.jsx("div",{className:"glass-absolute glass-inset-0 glass-pointer-events-none glass-overflow-hidden",children:r.jsx($,{children:z.map(i=>r.jsx(Q,{reaction:i,enablePhysics:n,glassEffect:v},i.id))})}),r.jsx($,{children:M&&r.jsx(Z,{position:w,reactionTypes:e,onReactionSelect:i=>{E(i,w),N(!1)},onClose:()=>N(!1),glassEffect:v})}),u&&r.jsx(X,{children:r.jsxs("div",{className:"glass-absolute glass-bottom-2 glass-right-2 glass-surface-primary glass-p-2 glass-radius-sm glass-text-xs glass-opacity-50",role:"status","aria-label":"Keyboard shortcuts hint",children:["Press 1-",e.length," for quick reactions"]})})]})}function Q({reaction:c,enablePhysics:s,glassEffect:g}){const e=O(),{emoji:l,position:a,physics:n,intensity:t,timestamp:u}=c,R=(Date.now()-u)/1e3,v=q(a.x),j=q(a.y),b=q(n?.rotation||0),x=q(n?.scale||1);return o.useEffect(()=>{if(!s||!n)return;let D,S=Date.now();const M=()=>{const N=Date.now(),w=(N-S)/1e3;S=N,n.velocity.y+=980*w,v.set(v.get()+n.velocity.x*w),j.set(j.get()+n.velocity.y*w),b.set(b.get()+n.rotation*w);const _=Math.max(0,1-R*.2);x.set((n.scale||1)*_),_>0&&(D=requestAnimationFrame(M))};return D=requestAnimationFrame(M),()=>{D&&cancelAnimationFrame(D)}},[s,n,R,v,j,b,x]),r.jsxs(C.div,{className:k("absolute select-none",g&&"glass-optimized-glass glass-blur-sm"),style:{x:s?v:a.x,y:s?j:a.y,rotate:s?b:0,scale:s?x:1,fontSize:`${24+t*12}px`},initial:{opacity:0,scale:0,rotate:-180},animate:e?{}:{opacity:1,scale:s?void 0:1+t*.5,rotate:s?void 0:0},exit:{opacity:0,scale:0,rotate:180},transition:e?{duration:0}:{duration:y.DURATION.normal/1e3},children:[r.jsx("span",{className:"glass-block glass-transform glass--translate-x-1-2 glass--translate-y-1-2",children:l}),g&&r.jsx(C.div,{className:"glass-absolute glass-inset-0 glass-gradient-primary glass-gradient-primary glass-via-white glass-gradient-primary glass-opacity-30",animate:e?{}:{x:[-100,100]},transition:e?{duration:0}:{duration:y.DURATION.slower/1e3,repeat:1/0,ease:y.EASING.linear}})]})}function Z({position:c,reactionTypes:s,onReactionSelect:g,onClose:e,glassEffect:l}){const a=O(),n=o.useRef(null);return o.useEffect(()=>{const t=u=>{n.current&&!n.current.contains(u.target)&&e()};return document.addEventListener("mousedown",t),()=>document.removeEventListener("mousedown",t)},[e]),o.useEffect(()=>{const t=u=>{u.key==="Escape"&&e()};return document.addEventListener("keydown",t),()=>document.removeEventListener("keydown",t)},[e]),r.jsxs(C.div,{ref:n,className:k("absolute z-50 pointer-events-auto",l?"glass-surface-primary glass-elev-3":"bg-white shadow-lg","glass-radius-lg glass-p-2"),style:{left:c.x,top:c.y,transform:"translate(-50%, -100%)"},initial:{opacity:0,scale:.8,y:10},animate:a?{}:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.8,y:10},transition:a?{duration:0}:{duration:y.DURATION.normal/1e3},role:"menu","aria-label":"Reaction picker",children:[r.jsx("div",{className:"glass-grid glass-grid-cols-4 glass-gap-1",children:s.map((t,u)=>r.jsx(C.button,{className:k("w-10 h-10 flex items-center justify-center glass-radius-lg","hover:bg-white/10 transition-colors glass-text-xl",l&&"glass-button-secondary"),whileHover:a?{}:{scale:1.1},whileTap:a?{}:{scale:.9},onClick:()=>g(t.emoji),title:`${t.name} (${t.shortcut})`,"aria-label":`React with ${t.name} emoji`,role:"menuitem",initial:{opacity:0,scale:0},animate:{opacity:1,scale:1},transition:a?{duration:0}:{duration:y.DURATION.normal/1e3},children:t.emoji},t.emoji))}),r.jsx("div",{className:k("absolute top-full left-1/2 transform -translate-x-1/2","w-0 h-0 border-l-4 border-r-4 border-t-4","border-l-transparent border-r-transparent",l?"border-t-white/20":"border-t-white")})]})}function ee(){const[c,s]=o.useState([]),g=o.useCallback((a,n,t=1,u)=>{const R={id:`${Date.now()}-${Math.random()}`,emoji:a,position:n,user:u,timestamp:Date.now(),intensity:t};return s(v=>[...v,R]),R},[]),e=o.useCallback(a=>{s(n=>n.filter(t=>t.id!==a))},[]),l=o.useCallback(()=>{s([])},[]);return{reactions:c,addReaction:g,removeReaction:e,clearReactions:l}}function T({reactionTypes:c=B.slice(0,6),onReactionClick:s,className:g,glassEffect:e=!0}){const l=O();return r.jsx(C.div,{className:k("flex items-center glass-gap-2 glass-p-2 glass-radius-full",e?"glass-surface-primary glass-elev-2":"bg-white shadow-lg",g),initial:{opacity:0,y:20},animate:l?{}:{opacity:1,y:0},children:c.map((a,n)=>r.jsx(C.button,{className:k("w-8 h-8 flex items-center justify-center glass-radius-full","hover:bg-white/10 transition-colors glass-text-lg",e&&"glass-button-secondary"),whileHover:l?{}:{scale:1.1},whileTap:l?{}:{scale:.9},onClick:()=>s?.(a.emoji),title:a.name,"aria-label":`React with ${a.name} emoji`,initial:{opacity:0,scale:0},animate:{opacity:1,scale:1},transition:l?{duration:0}:{duration:y.DURATION.normal/1e3},children:a.emoji},a.emoji))})}try{G.displayName="GlassReactions",G.__docgenInfo={description:"",displayName:"GlassReactions",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},reactions:{defaultValue:{value:"[]"},description:"",name:"reactions",required:!1,type:{name:"Reaction[] | undefined"}},reactionTypes:{defaultValue:{value:`[
  {
    emoji: "👍",
    name: "Like",
    color: "var(--glass-color-primary)",
    sound: "success",
    shortcut: "1",
  },
  {
    emoji: "❤️",
    name: "Love",
    color: "var(--glass-color-danger)",
    sound: "notification",
    shortcut: "2",
  },
  {
    emoji: "😂",
    name: "Laugh",
    color: "var(--glass-color-warning)",
    sound: "tap",
    shortcut: "3",
  },
  {
    emoji: "😮",
    name: "Wow",
    color: COLORS.semantic.secondary,
    sound: "morph",
    shortcut: "4",
  },
  {
    emoji: "😢",
    name: "Sad",
    color: "var(--glass-gray-500)",
    sound: "slide",
    shortcut: "5",
  },
  {
    emoji: "😡",
    name: "Angry",
    color: "var(--glass-color-danger-dark)",
    sound: "error",
    shortcut: "6",
  },
  {
    emoji: "🎉",
    name: "Celebrate",
    color: "var(--glass-color-success)",
    sound: "success",
    shortcut: "7",
  },
  {
    emoji: "🤔",
    name: "Think",
    color: "var(--glass-color-warning)",
    sound: "hover",
    shortcut: "8",
  },
]`},description:"",name:"reactionTypes",required:!1,type:{name:"ReactionType[] | undefined"}},maxReactions:{defaultValue:{value:"50"},description:"",name:"maxReactions",required:!1,type:{name:"number | undefined"}},autoExpire:{defaultValue:{value:"5000"},description:"",name:"autoExpire",required:!1,type:{name:"number | undefined"}},enablePhysics:{defaultValue:{value:"true"},description:"",name:"enablePhysics",required:!1,type:{name:"boolean | undefined"}},enableSounds:{defaultValue:{value:"true"},description:"",name:"enableSounds",required:!1,type:{name:"boolean | undefined"}},enableShortcuts:{defaultValue:{value:"true"},description:"",name:"enableShortcuts",required:!1,type:{name:"boolean | undefined"}},enableBurst:{defaultValue:{value:"true"},description:"",name:"enableBurst",required:!1,type:{name:"boolean | undefined"}},glassEffect:{defaultValue:{value:"true"},description:"",name:"glassEffect",required:!1,type:{name:"boolean | undefined"}},onReactionAdd:{defaultValue:null,description:"",name:"onReactionAdd",required:!1,type:{name:'((reaction: Omit<Reaction, "id" | "timestamp">) => void) | undefined'}},onReactionExpire:{defaultValue:null,description:"",name:"onReactionExpire",required:!1,type:{name:"((reactionId: string) => void) | undefined"}}}}}catch{}try{T.displayName="GlassReactionBar",T.__docgenInfo={description:"",displayName:"GlassReactionBar",props:{reactionTypes:{defaultValue:{value:"defaultReactionTypes.slice(0, 6)"},description:"",name:"reactionTypes",required:!1,type:{name:"ReactionType[] | undefined"}},onReactionClick:{defaultValue:null,description:"",name:"onReactionClick",required:!1,type:{name:"((emoji: string) => void) | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},glassEffect:{defaultValue:{value:"true"},description:"",name:"glassEffect",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const ae=Object.freeze(Object.defineProperty({__proto__:null,GlassReactionBar:T,GlassReactions:G,useGlassReactions:ee},Symbol.toStringTag,{value:"Module"})),F="GlassReactions",ne=ae[F],le={title:"Effects + Advanced/Glass Reactions",component:ne,parameters:{layout:"fullscreen",previewSurface:"media",docs:{description:{component:"Component-owned Storybook coverage for GlassReactions. This story renders the certified AuraGlass sample used by the full visual certification suite."}}}},I={render:()=>r.jsx(J,{name:F,kind:"advanced"})};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => <StorybookVisualShowcase name={componentName} kind="advanced" />
}`,...I.parameters?.docs?.source}}};const ce=["Default"];export{I as Default,ce as __namedExportsOrder,le as default};
