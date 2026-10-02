import{a as _,r as l,b as p,e as W,j as e,d as B,C as X,c as j,m as D}from"./iframe-DFMMcocb.js";import{g as Y}from"./soundDesign-DAOJZn7H.js";import{u as L}from"./use-motion-value-DTfxZb5F.js";import"./preload-helper-PPVm8Dsz.js";const F=[{emoji:"👍",name:"Like",color:"hsl(var(--glass-color-primary))",sound:"success",shortcut:"1"},{emoji:"❤️",name:"Love",color:"hsl(var(--glass-color-danger))",sound:"notification",shortcut:"2"},{emoji:"😂",name:"Laugh",color:"hsl(var(--glass-color-warning))",sound:"tap",shortcut:"3"},{emoji:"😮",name:"Wow",color:W.semantic.secondary,sound:"morph",shortcut:"4"},{emoji:"😢",name:"Sad",color:"var(--glass-gray-500)",sound:"slide",shortcut:"5"},{emoji:"😡",name:"Angry",color:"var(--glass-color-danger-dark)",sound:"error",shortcut:"6"},{emoji:"🎉",name:"Celebrate",color:"hsl(var(--glass-color-success))",sound:"success",shortcut:"7"},{emoji:"🤔",name:"Think",color:"hsl(var(--glass-color-warning))",sound:"hover",shortcut:"8"}];function V({children:g,className:o,style:x,reactions:i=[],reactionTypes:a=F,maxReactions:t=50,autoExpire:n=5e3,enablePhysics:s=!0,enableSounds:h=!0,enableShortcuts:k=!0,enableBurst:v=!0,glassEffect:w=!0,onReactionAdd:R,onReactionExpire:N}){_();const y=l.useRef(null),[q,S]=l.useState([]),[A,b]=l.useState(!1),[E,$]=l.useState({x:0,y:0}),T=l.useRef(0),O=l.useRef(0),P=[...i,...q].slice(-t),z=l.useCallback(r=>{const u=Date.now(),c=u-T.current;if(c<p.DURATION.normal){const f=y.current;if(!f)return;const d=f.getBoundingClientRect(),m=r.clientX-d.left,I=r.clientY-d.top;if(C(a[0].emoji,{x:m,y:I},1),v&&c<p.DURATION.fast&&(O.current++,O.current>=2))for(let G=0;G<5;G++)setTimeout(()=>{const K=a[Math.floor(Math.random()*a.length)];C(K.emoji,{x:m+(Math.random()-.5)*100,y:I+(Math.random()-.5)*100},Math.random()*.5+.5)},G*p.DURATION.fast)}else O.current=0;T.current=u},[a,v]),H=l.useCallback(r=>{r.preventDefault();const u=y.current;if(!u)return;const c=u.getBoundingClientRect(),f=r.clientX-c.left,d=r.clientY-c.top;$({x:f,y:d}),b(!0)},[]),C=l.useCallback((r,u,c=1)=>{const f=a.find(m=>m.emoji===r),d={id:`${Date.now()}-${Math.random()}`,emoji:r,position:u,timestamp:Date.now(),intensity:c,physics:s?{velocity:{x:(Math.random()-.5)*200*c,y:-Math.random()*100*c-50},rotation:(Math.random()-.5)*180,scale:.8+Math.random()*.4}:void 0};S(m=>[...m,d]),h&&f?.sound&&Y.playGlassSound(f.sound),"vibrate"in navigator&&navigator.vibrate(p.DURATION.fast/3*c),R?.(d),n>0&&setTimeout(()=>{S(m=>m.filter(I=>I.id!==d.id)),N?.(d.id)},n)},[a,s,h,n,R,N]);return l.useEffect(()=>{if(!k)return;const r=u=>{if(u.key>="1"&&u.key<="9"){const c=parseInt(u.key)-1,f=a[c];if(f){const d=y.current;if(d){const m=d.getBoundingClientRect();C(f.emoji,{x:m.width/2,y:m.height/2})}}}};return window.addEventListener("keypress",r),()=>window.removeEventListener("keypress",r)},[k,a,C]),e.jsxs("div",{ref:y,className:j("relative",o),style:x,onClick:z,onContextMenu:H,role:"region","aria-label":"Interactive reactions area",children:[g,e.jsx("div",{className:"glass-absolute glass-inset-0 glass-pointer-events-none glass-overflow-hidden",children:e.jsx(B,{children:P.map(r=>e.jsx(J,{reaction:r,enablePhysics:s,glassEffect:w},r.id))})}),e.jsx(B,{children:A&&e.jsx(Q,{position:E,reactionTypes:a,onReactionSelect:r=>{C(r,E),b(!1)},onClose:()=>b(!1),glassEffect:w})}),k&&e.jsx(X,{children:e.jsxs("div",{className:"glass-absolute glass-bottom-2 glass-right-2 glass-surface-primary glass-p-2 glass-radius-sm glass-text-xs glass-opacity-50",role:"status","aria-label":"Keyboard shortcuts hint",children:["Press 1-",a.length," for quick reactions"]})})]})}function J({reaction:g,enablePhysics:o,glassEffect:x}){const i=_(),{emoji:a,position:t,physics:n,intensity:s,timestamp:h}=g,k=(Date.now()-h)/1e3,v=L(t.x),w=L(t.y),R=L(n?.rotation||0),N=L(n?.scale||1);return l.useEffect(()=>{if(!o||!n)return;let y,q=Date.now();const S=()=>{const A=Date.now(),b=(A-q)/1e3;q=A,n.velocity.y+=980*b,v.set(v.get()+n.velocity.x*b),w.set(w.get()+n.velocity.y*b),R.set(R.get()+n.rotation*b);const E=Math.max(0,1-k*.2);N.set((n.scale||1)*E),E>0&&(y=requestAnimationFrame(S))};return y=requestAnimationFrame(S),()=>{y&&cancelAnimationFrame(y)}},[o,n,k,v,w,R,N]),e.jsxs(D.div,{className:j("absolute select-none",x&&"glass-optimized-glass glass-blur-sm"),style:{x:o?v:t.x,y:o?w:t.y,rotate:o?R:0,scale:o?N:1,fontSize:`${24+s*12}px`},initial:{opacity:0,scale:0,rotate:-180},animate:i?{}:{opacity:1,scale:o?void 0:1+s*.5,rotate:o?void 0:0},exit:{opacity:0,scale:0,rotate:180},transition:i?{duration:0}:{duration:p.DURATION.normal/1e3},children:[e.jsx("span",{className:"glass-block glass-transform glass--translate-x-1-2 glass--translate-y-1-2",children:a}),x&&e.jsx(D.div,{className:"glass-absolute glass-inset-0 glass-gradient-primary glass-gradient-primary glass-via-white glass-gradient-primary glass-opacity-30",animate:i?{}:{x:[-100,100]},transition:i?{duration:0}:{duration:p.DURATION.slower/1e3,repeat:1/0,ease:p.EASING.linear}})]})}function Q({position:g,reactionTypes:o,onReactionSelect:x,onClose:i,glassEffect:a}){const t=_(),n=l.useRef(null);return l.useEffect(()=>{const s=h=>{n.current&&!n.current.contains(h.target)&&i()};return document.addEventListener("mousedown",s),()=>document.removeEventListener("mousedown",s)},[i]),l.useEffect(()=>{const s=h=>{h.key==="Escape"&&i()};return document.addEventListener("keydown",s),()=>document.removeEventListener("keydown",s)},[i]),e.jsxs(D.div,{ref:n,className:j("absolute z-50 pointer-events-auto",a?"glass-surface-primary glass-elev-3":"bg-white shadow-lg","glass-radius-lg glass-p-2"),style:{left:g.x,top:g.y,transform:"translate(-50%, -100%)"},initial:{opacity:0,scale:.8,y:10},animate:t?{}:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.8,y:10},transition:t?{duration:0}:{duration:p.DURATION.normal/1e3},role:"menu","aria-label":"Reaction picker",children:[e.jsx("div",{className:"glass-grid glass-grid-cols-4 glass-gap-1",children:o.map((s,h)=>e.jsx(D.button,{className:j("w-10 h-10 flex items-center justify-center glass-radius-lg","hover:bg-white/10 transition-colors glass-text-xl",a&&"glass-button-secondary"),whileHover:t?{}:{scale:1.1},whileTap:t?{}:{scale:.9},onClick:()=>x(s.emoji),title:`${s.name} (${s.shortcut})`,"aria-label":`React with ${s.name} emoji`,role:"menuitem",initial:{opacity:0,scale:0},animate:{opacity:1,scale:1},transition:t?{duration:0}:{duration:p.DURATION.normal/1e3},children:s.emoji},s.emoji))}),e.jsx("div",{className:j("absolute top-full left-1/2 transform -translate-x-1/2","w-0 h-0 border-l-4 border-r-4 border-t-4","border-l-transparent border-r-transparent",a?"border-t-white/20":"border-t-white")})]})}function U({reactionTypes:g=F.slice(0,6),onReactionClick:o,className:x,glassEffect:i=!0}){const a=_();return e.jsx(D.div,{className:j("flex items-center glass-gap-2 glass-p-2 glass-radius-full",i?"glass-surface-primary glass-elev-2":"bg-white shadow-lg",x),initial:{opacity:0,y:20},animate:a?{}:{opacity:1,y:0},children:g.map((t,n)=>e.jsx(D.button,{className:j("w-8 h-8 flex items-center justify-center glass-radius-full","hover:bg-white/10 transition-colors glass-text-lg",i&&"glass-button-secondary"),whileHover:a?{}:{scale:1.1},whileTap:a?{}:{scale:.9},onClick:()=>o?.(t.emoji),title:t.name,"aria-label":`React with ${t.name} emoji`,initial:{opacity:0,scale:0},animate:{opacity:1,scale:1},transition:a?{duration:0}:{duration:p.DURATION.normal/1e3},children:t.emoji},t.emoji))})}try{V.displayName="GlassReactions",V.__docgenInfo={description:"",displayName:"GlassReactions",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},reactions:{defaultValue:{value:"[]"},description:"",name:"reactions",required:!1,type:{name:"Reaction[] | undefined"}},reactionTypes:{defaultValue:{value:`[
  {
    emoji: "👍",
    name: "Like",
    color: "hsl(var(--glass-color-primary))",
    sound: "success",
    shortcut: "1",
  },
  {
    emoji: "❤️",
    name: "Love",
    color: "hsl(var(--glass-color-danger))",
    sound: "notification",
    shortcut: "2",
  },
  {
    emoji: "😂",
    name: "Laugh",
    color: "hsl(var(--glass-color-warning))",
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
    color: "hsl(var(--glass-color-success))",
    sound: "success",
    shortcut: "7",
  },
  {
    emoji: "🤔",
    name: "Think",
    color: "hsl(var(--glass-color-warning))",
    sound: "hover",
    shortcut: "8",
  },
]`},description:"",name:"reactionTypes",required:!1,type:{name:"ReactionType[] | undefined"}},maxReactions:{defaultValue:{value:"50"},description:"",name:"maxReactions",required:!1,type:{name:"number | undefined"}},autoExpire:{defaultValue:{value:"5000"},description:"",name:"autoExpire",required:!1,type:{name:"number | undefined"}},enablePhysics:{defaultValue:{value:"true"},description:"",name:"enablePhysics",required:!1,type:{name:"boolean | undefined"}},enableSounds:{defaultValue:{value:"true"},description:"",name:"enableSounds",required:!1,type:{name:"boolean | undefined"}},enableShortcuts:{defaultValue:{value:"true"},description:"",name:"enableShortcuts",required:!1,type:{name:"boolean | undefined"}},enableBurst:{defaultValue:{value:"true"},description:"",name:"enableBurst",required:!1,type:{name:"boolean | undefined"}},glassEffect:{defaultValue:{value:"true"},description:"",name:"glassEffect",required:!1,type:{name:"boolean | undefined"}},onReactionAdd:{defaultValue:null,description:"",name:"onReactionAdd",required:!1,type:{name:'((reaction: Omit<Reaction, "id" | "timestamp">) => void) | undefined'}},onReactionExpire:{defaultValue:null,description:"",name:"onReactionExpire",required:!1,type:{name:"((reactionId: string) => void) | undefined"}}}}}catch{}try{U.displayName="GlassReactionBar",U.__docgenInfo={description:"",displayName:"GlassReactionBar",props:{reactionTypes:{defaultValue:{value:"defaultReactionTypes.slice(0, 6)"},description:"",name:"reactionTypes",required:!1,type:{name:"ReactionType[] | undefined"}},onReactionClick:{defaultValue:null,description:"",name:"onReactionClick",required:!1,type:{name:"((emoji: string) => void) | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},glassEffect:{defaultValue:{value:"true"},description:"",name:"glassEffect",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const Z={minHeight:"100vh",display:"grid",placeItems:"center",padding:"clamp(20px, 5vw, 64px)",boxSizing:"border-box",background:"radial-gradient(circle at 80% 14%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0) 30%), linear-gradient(145deg, #f7f7f6 0%, #e2e2e0 100%)"},ee={background:"linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.14))",border:"1px solid rgba(15, 23, 42, 0.16)",boxShadow:"inset 0 1px 0 rgba(255, 255, 255, 0.32), 0 24px 56px rgba(15, 23, 42, 0.12)",backdropFilter:"blur(24px) saturate(1.5) brightness(1.04) contrast(1.02)",WebkitBackdropFilter:"blur(24px) saturate(1.5) brightness(1.04) contrast(1.02)"},ae=[{id:"reaction-like",emoji:"👍",position:{x:28,y:28},timestamp:0,intensity:.1}],oe={title:"Effects + Advanced/Glass Reactions",component:V,args:{children:null},parameters:{layout:"fullscreen",previewSurface:"component",docs:{description:{component:"The real GlassReactions export with deterministic initial reactions and all overlays constrained to the liquid surface."}}}},M={render:()=>e.jsx("main",{style:Z,children:e.jsx(V,{className:"glass-foundation-complete glass-w-full glass-max-w-3xl glass-radius-3xl glass-p-8",style:ee,reactions:ae,enablePhysics:!1,enableSounds:!1,enableShortcuts:!1,enableBurst:!1,autoExpire:0,glassEffect:!0,children:e.jsxs("div",{className:"glass-grid glass-min-h-320 glass-content-center glass-gap-4 glass-text-center",children:[e.jsx("span",{className:"glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide",style:{color:"rgba(15, 23, 42, 0.68)"},children:"Live feedback"}),e.jsx("h2",{className:"glass-text-3xl glass-font-semibold glass-text-primary",children:"Reactions with physical presence"}),e.jsx("p",{className:"glass-mx-auto glass-max-w-lg glass-text-secondary glass-leading-relaxed",children:"Lightweight emoji feedback can burst, drift, and expire without disturbing the layout beneath it."})]})})})};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <main style={frameStyle}>
      <GlassReactions className="glass-foundation-complete glass-w-full glass-max-w-3xl glass-radius-3xl glass-p-8" style={surfaceStyle} reactions={initialReactions} enablePhysics={false} enableSounds={false} enableShortcuts={false} enableBurst={false} autoExpire={0} glassEffect>
        <div className="glass-grid glass-min-h-320 glass-content-center glass-gap-4 glass-text-center">
          <span className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide" style={{
          color: "rgba(15, 23, 42, 0.68)"
        }}>
            Live feedback
          </span>
          <h2 className="glass-text-3xl glass-font-semibold glass-text-primary">
            Reactions with physical presence
          </h2>
          <p className="glass-mx-auto glass-max-w-lg glass-text-secondary glass-leading-relaxed">
            Lightweight emoji feedback can burst, drift, and expire without
            disturbing the layout beneath it.
          </p>
        </div>
      </GlassReactions>
    </main>
}`,...M.parameters?.docs?.source}}};const ie=["Default"];export{M as Default,ie as __namedExportsOrder,oe as default};
