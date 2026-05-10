import{r,j as e,m as g,e as X}from"./iframe-DinEdlu4.js";import{f as le}from"./index-CLSxArU-.js";import{u as we}from"./useMotionPreference-Bqsl3944.js";import{u as Ne}from"./a11y-BZVU29oS.js";import{u as Re}from"./soundDesign-BHpxgFtq.js";import{u as Ve}from"./use-motion-value-BsHTACuJ.js";import{u as qe}from"./use-transform-vFQxR5l1.js";import{O as Ae}from"./OptimizedGlassCore-mTd-BSmd.js";import{P as me}from"./play-CZOj2xMj.js";import{H as Y}from"./house-DUuaotpX.js";import{U as Z}from"./user-Qru3dTn3.js";import{S as ee}from"./settings-DSB3XMsQ.js";import{M as se}from"./mail-fW-ZNu16.js";import{S as ce}from"./search-D-OgmSQv.js";import{B as ue}from"./bell-JoD3tNz_.js";import{H as Fe}from"./heart-BeyYhLi8.js";import{S as Pe}from"./share-DHoiOdGB.js";import{D as ke}from"./download-CgXPm_bp.js";import{c as He}from"./createLucideIcon-DfdB-aiz.js";import{T as Le}from"./trash-2-BHNgeJrE.js";import{P as de}from"./plus-BdComIaR.js";import{P as Te}from"./pause-rSyAxTfU.js";import{C as Ge}from"./camera-BWF7IGHo.js";import{M as _e}from"./mic-DYijf-io.js";import{M as De}from"./minus-B2wey5mW.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";import"./deviceCapabilities-8hOeRztp.js";const Ue=[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]],$e=He("square-pen",Ue),$=r.forwardRef(({items:n=[],centerElement:f,radius:o=120,itemSize:l=48,isOpen:i=!1,onOpenChange:te,rotationSpeed:re=.5,autoRotate:ne=!1,hoverExpansion:ge=1.2,springTension:h=300,springFriction:x=25,glassConfig:fe={},soundEnabled:c=!0,className:he="",style:xe={},...be},Se)=>{const[ye,ie]=r.useState(null),[ve,ze]=r.useState(null),[b,je]=r.useState(0),Oe=r.useRef(null),S=r.useRef(),{prefersReducedMotion:m}=we(),B=Ne(),{play:u}=Re(),J=Ve(0);qe(J,[0,360],[0,360]),r.useEffect(()=>{if(ne&&i&&!m){const s=()=>{je(d=>(d+re)%360),J.set(b),S.current=requestAnimationFrame(s)};S.current=requestAnimationFrame(s)}return()=>{S.current&&cancelAnimationFrame(S.current)}},[ne,i,re,m,b,J]);const Ie=r.useCallback(()=>{te?.(!i),c&&u("tap")},[i,te,c,u]),Ce=r.useCallback(s=>{s.disabled||(ie(s.id),s.onClick?.(),c&&u("tap"),setTimeout(()=>ie(null),200))},[c,u]),oe=r.useCallback(s=>{ze(s),c&&s&&u("hover")},[c,u]),K=r.useCallback((s,d)=>{const p=(360/d*s+b)*(Math.PI/180),Q=Math.cos(p)*o,W=Math.sin(p)*o;return{x:Q,y:W,angle:p*(180/Math.PI)}},[o,b]),Ee=()=>({hidden:{scale:0,opacity:0,x:0,y:0},visible:s=>({scale:1,opacity:1,x:K(s,n.length).x,y:K(s,n.length).y,transition:{type:"spring",tension:h,friction:x,delay:m?0:s*.1}}),hover:{scale:ge,transition:{type:"spring",tension:h*2,friction:x}},active:{scale:.9,transition:{type:"spring",tension:h*3,friction:x}}}),Me={closed:{rotate:0,scale:1},open:{rotate:m?0:180,scale:1.1,transition:{type:"spring",tension:h,friction:x}}};return e.jsxs(Ae,{ref:Se,className:`glass-orbital-menu relative ${he}`,style:{width:(o+l)*2+40,height:(o+l)*2+40,...xe},glassConfig:{blur:20,opacity:.8,saturation:1.2,brightness:1.1,...fe},"aria-label":"Orbital navigation menu",role:"toolbar",id:B,...be,children:[e.jsxs("div",{ref:Oe,className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center",children:[e.jsx(g.button,{className:"glass-relative glass-z-20 glass-flex glass-items-center glass-justify-center glass-surface glass-radius-full glass-border glass-border-white/20 glass-backdrop-blur-md glass-surface-subtle/10 hover:glass-surface-subtle/15 glass-transition-colors glass-contrast-guard",style:{width:l+8,height:l+8},variants:Me,animate:i?"open":"closed",onClick:Ie,"aria-expanded":i,"aria-controls":`${B}-items`,"aria-label":i?"Close menu":"Open menu",children:f||e.jsxs(g.div,{className:"glass-w-6 glass-h-6 glass-flex glass-flex-col glass-items-center glass-justify-center",animate:{rotate:i?45:0},children:[e.jsx("div",{className:"glass-w-4 glass-h-0-5 glass-surface-subtle/70 glass-mb-1"}),e.jsx("div",{className:"glass-w-4 glass-h-0-5 glass-surface-subtle/70"})]})}),e.jsx("div",{id:`${B}-items`,className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center glass-pointer-events-none",role:"group",children:e.jsx(X,{children:i&&n.map((s,d)=>{const p=K(d,n.length),Q=ve===s.id,W=ye===s.id;return e.jsx(g.div,{className:"glass-absolute glass-pointer-events-auto",custom:d,variants:Ee(),initial:m?!1:"hidden",animate:m?!1:"visible",exit:"hidden",whileHover:!m&&!s.disabled?"hover":void 0,style:{x:p.x,y:p.y},children:e.jsxs(g.button,{className:`
                        relative flex items-center justify-center glass-surface rounded-full
                        border border-white/20 glass-backdrop-blur-md transition-all duration-200
                        ${s.disabled?"bg-white/5 text-white/40 cursor-not-allowed":"bg-white/10 hover:bg-white/15 text-white/90 hover:text-white"}
                        ${W?"ring-2 ring-white/40":""}
                      `,style:{width:l,height:l},onClick:()=>Ce(s),onMouseEnter:()=>oe(s.id),onMouseLeave:()=>oe(null),disabled:s.disabled,role:"button","aria-label":s.label,title:s.shortcut?`${s.label} (${s.shortcut})`:s.label,children:[s.icon&&e.jsx("div",{className:"glass-text-lg",children:s.icon}),s.shortcut&&e.jsx("div",{className:"glass-absolute glass--top-2 glass--right-2 glass-surface-dark/50 glass-text-primary-opacity-70 glass-text-xs glass-px-1 glass-py-0.5 glass-radius glass-text-10px glass-backdrop-blur-sm glass-contrast-guard",children:s.shortcut}),e.jsx(X,{children:Q&&!m&&e.jsx(g.div,{className:"glass-absolute glass-top-full glass-mt-2 glass-surface-dark/80 glass-text-primary glass-text-xs glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-whitespace-nowrap glass-contrast-guard",initial:{opacity:0,y:-5},animate:{opacity:1,y:0},exit:{opacity:0,y:-5},transition:{duration:.15},children:s.label})})]})},s.id)})})}),e.jsx(X,{children:i&&e.jsx(g.div,{className:"glass-absolute glass-border glass-border-white/10 glass-radius-full glass-pointer-events-none",style:{width:o*2,height:o*2},initial:{opacity:0,scale:.5},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.5},transition:{type:"spring",tension:h,friction:x}})})]}),e.jsxs("div",{className:"glass-absolute glass-bottom-2 glass-right-2 glass-text-xs glass-text-primary-glass-opacity-60",children:[n.length," items"]})]})});$.displayName="GlassOrbitalMenu";try{$.displayName="GlassOrbitalMenu",$.__docgenInfo={description:"",displayName:"GlassOrbitalMenu",props:{items:{defaultValue:{value:"[]"},description:"",name:"items",required:!1,type:{name:"OrbitalMenuItem[]"}},centerElement:{defaultValue:null,description:"",name:"centerElement",required:!1,type:{name:"ReactNode"}},radius:{defaultValue:{value:"120"},description:"",name:"radius",required:!1,type:{name:"number | undefined"}},itemSize:{defaultValue:{value:"48"},description:"",name:"itemSize",required:!1,type:{name:"number | undefined"}},isOpen:{defaultValue:{value:"false"},description:"",name:"isOpen",required:!1,type:{name:"boolean | undefined"}},onOpenChange:{defaultValue:null,description:"",name:"onOpenChange",required:!1,type:{name:"((open: boolean) => void) | undefined"}},rotationSpeed:{defaultValue:{value:"0.5"},description:"",name:"rotationSpeed",required:!1,type:{name:"number | undefined"}},autoRotate:{defaultValue:{value:"false"},description:"",name:"autoRotate",required:!1,type:{name:"boolean | undefined"}},hoverExpansion:{defaultValue:{value:"1.2"},description:"",name:"hoverExpansion",required:!1,type:{name:"number | undefined"}},springTension:{defaultValue:{value:"300"},description:"",name:"springTension",required:!1,type:{name:"number | undefined"}},springFriction:{defaultValue:{value:"25"},description:"",name:"springFriction",required:!1,type:{name:"number | undefined"}},glassConfig:{defaultValue:{value:"{}"},description:"",name:"glassConfig",required:!1,type:{name:"{ blur?: number | undefined; opacity?: number | undefined; saturation?: number | undefined; brightness?: number | undefined; contrast?: number | undefined; } | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}}}}}catch{}const a=(n,f,o,l)=>({id:n,label:f,icon:o,shortcut:l,onClick:le(),category:"action",priority:Math.floor(Math.random()*5),metadata:{usage:Math.floor(Math.random()*100),lastUsed:new Date().toISOString()}}),t=[a("home","Home",e.jsx(Y,{size:20}),"⌘H"),a("profile","Profile",e.jsx(Z,{size:20}),"⌘U"),a("settings","Settings",e.jsx(ee,{size:20}),"⌘,"),a("messages","Messages",e.jsx(se,{size:20}),"⌘M")],ae=[a("home","Home",e.jsx(Y,{size:20}),"⌘H"),a("profile","Profile",e.jsx(Z,{size:20}),"⌘U"),a("settings","Settings",e.jsx(ee,{size:20}),"⌘,"),a("messages","Messages",e.jsx(se,{size:20}),"⌘M"),a("search","Search",e.jsx(ce,{size:20}),"⌘F"),a("notifications","Notifications",e.jsx(ue,{size:20}),"⌘N")],pe=[a("home","Home",e.jsx(Y,{size:20}),"⌘H"),a("profile","Profile",e.jsx(Z,{size:20}),"⌘U"),a("settings","Settings",e.jsx(ee,{size:20}),"⌘,"),a("messages","Messages",e.jsx(se,{size:20}),"⌘M"),a("search","Search",e.jsx(ce,{size:20}),"⌘F"),a("notifications","Notifications",e.jsx(ue,{size:20}),"⌘N"),a("favorites","Favorites",e.jsx(Fe,{size:20}),"⌘L"),a("share","Share",e.jsx(Pe,{size:20}),"⌘S"),a("download","Download",e.jsx(ke,{size:20}),"⌘D"),a("edit","Edit",e.jsx($e,{size:20}),"⌘E"),a("delete","Delete",e.jsx(Le,{size:20}),"⌘⌫"),a("add","Add New",e.jsx(de,{size:20}),"⌘+")],Be=[a("play","Play",e.jsx(me,{size:20}),"Space"),a("pause","Pause",e.jsx(Te,{size:20}),"Space"),a("camera","Camera",e.jsx(Ge,{size:20}),"⌘C"),a("mic","Microphone",e.jsx(_e,{size:20}),"⌘⇧M"),a("volume-up","Volume Up",e.jsx(de,{size:20}),"↑"),a("volume-down","Volume Down",e.jsx(De,{size:20}),"↓")],Je=e.jsx("div",{className:"glass-w-8 glass-h-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full glass-flex glass-items-center glass-justify-center",children:e.jsx("div",{className:"glass-w-3 glass-h-3 glass-surface-subtle glass-radius-full"})}),zs={title:"Surfaces/App Shells + Layout/Glass Orbital Menu",component:$,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{radius:{control:{type:"range",min:60,max:200,step:10}},itemSize:{control:{type:"range",min:32,max:80,step:4}},isOpen:{control:"boolean"},rotationSpeed:{control:{type:"range",min:0,max:2,step:.1}},autoRotate:{control:"boolean"},hoverExpansion:{control:{type:"range",min:1,max:2,step:.1}},springTension:{control:{type:"range",min:100,max:500,step:50}},springFriction:{control:{type:"range",min:10,max:50,step:5}},soundEnabled:{control:"boolean"}}},y={args:{items:t,isOpen:!0,radius:120,itemSize:48,rotationSpeed:.5,autoRotate:!1,hoverExpansion:1.2,springTension:300,springFriction:25,soundEnabled:!0,glassConfig:{blur:20,opacity:.8,saturation:1.2,brightness:1.1,contrast:1.1}}},v={args:{items:t,isOpen:!1,radius:120,itemSize:48}},z={args:{items:ae,isOpen:!0,radius:140,itemSize:52,autoRotate:!0,rotationSpeed:.3}},j={args:{items:ae,isOpen:!0,radius:120,itemSize:48,autoRotate:!0,rotationSpeed:1.2}},O={args:{items:pe,isOpen:!0,radius:180,itemSize:56,hoverExpansion:1.3}},I={args:{items:t,isOpen:!0,radius:80,itemSize:40,hoverExpansion:1.15}},C={args:{items:pe,isOpen:!0,radius:160,itemSize:48,autoRotate:!0,rotationSpeed:.2}},E={args:{items:Be,isOpen:!0,radius:100,itemSize:52,centerElement:e.jsx("div",{className:"glass-w-8 glass-h-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full glass-flex glass-items-center glass-justify-center",children:e.jsx(me,{size:16,className:"glass-text-primary ml-0.5"})})}},M={args:{items:t,isOpen:!0,radius:120,itemSize:48,centerElement:Je}},w={args:{items:t,isOpen:!0,radius:140,itemSize:72,hoverExpansion:1.2}},N={args:{items:ae,isOpen:!0,radius:100,itemSize:36,hoverExpansion:1.3}},R={args:{items:t,isOpen:!0,radius:120,itemSize:48,hoverExpansion:1.8}},V={args:{items:t,isOpen:!0,radius:120,itemSize:48,hoverExpansion:1.1}},q={args:{items:t,isOpen:!0,radius:120,itemSize:48,springTension:150,springFriction:40}},A={args:{items:t,isOpen:!0,radius:120,itemSize:48,springTension:500,springFriction:15}},F={args:{items:t,isOpen:!0,radius:120,itemSize:48,springTension:400,springFriction:12}},P={args:{items:t,isOpen:!0,radius:120,itemSize:48,springTension:600,springFriction:50}},k={args:{items:t.map((n,f)=>({...n,disabled:f%2===0})),isOpen:!0,radius:120,itemSize:48}},H={args:{items:t,isOpen:!0,radius:120,itemSize:48,soundEnabled:!1}},L={args:{items:t,isOpen:!0,radius:120,itemSize:48,glassConfig:{blur:30,opacity:.6,saturation:1.5,brightness:1.3,contrast:1.2}}},T={args:{items:t,isOpen:!0,radius:120,itemSize:48,glassConfig:{blur:10,opacity:.9,saturation:1,brightness:1,contrast:1}}},G={args:{items:t,isOpen:!0,radius:120,itemSize:48,glassConfig:{blur:40,opacity:.5,saturation:2,brightness:1.5,contrast:1.3}}},_={args:{items:t,isOpen:!0,radius:80,itemSize:36,hoverExpansion:1.2,autoRotate:!0,rotationSpeed:.4}},D={args:{items:t,isOpen:!0,radius:200,itemSize:60,hoverExpansion:1.3}},U={args:{items:t,isOpen:!1,radius:120,itemSize:48,onOpenChange:le()}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    rotationSpeed: 0.5,
    autoRotate: false,
    hoverExpansion: 1.2,
    springTension: 300,
    springFriction: 25,
    soundEnabled: true,
    glassConfig: {
      blur: 20,
      opacity: 0.8,
      saturation: 1.2,
      brightness: 1.1,
      contrast: 1.1
    }
  }
}`,...y.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: false,
    radius: 120,
    itemSize: 48
  }
}`,...v.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    items: extendedItems,
    isOpen: true,
    radius: 140,
    itemSize: 52,
    autoRotate: true,
    rotationSpeed: 0.3
  }
}`,...z.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    items: extendedItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    autoRotate: true,
    rotationSpeed: 1.2
  }
}`,...j.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    items: manyItems,
    isOpen: true,
    radius: 180,
    itemSize: 56,
    hoverExpansion: 1.3
  }
}`,...O.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: true,
    radius: 80,
    itemSize: 40,
    hoverExpansion: 1.15
  }
}`,...I.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    items: manyItems,
    isOpen: true,
    radius: 160,
    itemSize: 48,
    autoRotate: true,
    rotationSpeed: 0.2
  }
}`,...C.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    items: mediaItems,
    isOpen: true,
    radius: 100,
    itemSize: 52,
    centerElement: <div className="glass-w-8 glass-h-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full glass-flex glass-items-center glass-justify-center">
        <Play size={16} className="glass-text-primary ml-0.5" />
      </div>
  }
}`,...E.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    centerElement: customCenterElement
  }
}`,...M.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: true,
    radius: 140,
    itemSize: 72,
    hoverExpansion: 1.2
  }
}`,...w.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    items: extendedItems,
    isOpen: true,
    radius: 100,
    itemSize: 36,
    hoverExpansion: 1.3
  }
}`,...N.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    hoverExpansion: 1.8
  }
}`,...R.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    hoverExpansion: 1.1
  }
}`,...V.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    springTension: 150,
    springFriction: 40
  }
}`,...q.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    springTension: 500,
    springFriction: 15
  }
}`,...A.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    springTension: 400,
    springFriction: 12
  }
}`,...F.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    springTension: 600,
    springFriction: 50
  }
}`,...P.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems.map((item, index) => ({
      ...item,
      disabled: index % 2 === 0
    })),
    isOpen: true,
    radius: 120,
    itemSize: 48
  }
}`,...k.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    soundEnabled: false
  }
}`,...H.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    glassConfig: {
      blur: 30,
      opacity: 0.6,
      saturation: 1.5,
      brightness: 1.3,
      contrast: 1.2
    }
  }
}`,...L.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    glassConfig: {
      blur: 10,
      opacity: 0.9,
      saturation: 1.0,
      brightness: 1.0,
      contrast: 1.0
    }
  }
}`,...T.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: true,
    radius: 120,
    itemSize: 48,
    glassConfig: {
      blur: 40,
      opacity: 0.5,
      saturation: 2.0,
      brightness: 1.5,
      contrast: 1.3
    }
  }
}`,...G.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: true,
    radius: 80,
    itemSize: 36,
    hoverExpansion: 1.2,
    autoRotate: true,
    rotationSpeed: 0.4
  }
}`,..._.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: true,
    radius: 200,
    itemSize: 60,
    hoverExpansion: 1.3
  }
}`,...D.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    isOpen: false,
    radius: 120,
    itemSize: 48,
    onOpenChange: fn()
  }
}`,...U.parameters?.docs?.source}}};const js=["Default","Closed","AutoRotating","FastRotation","LargeRadius","SmallRadius","ManyItems","MediaControls","CustomCenter","LargeItems","SmallItems","HighExpansion","LowExpansion","SlowAnimation","FastAnimation","BouncyAnimation","StiffAnimation","DisabledItems","NoSounds","CustomGlass","MinimalGlass","IntenseGlass","CompactLayout","SpacedLayout","Interactive"];export{z as AutoRotating,F as BouncyAnimation,v as Closed,_ as CompactLayout,M as CustomCenter,L as CustomGlass,y as Default,k as DisabledItems,A as FastAnimation,j as FastRotation,R as HighExpansion,G as IntenseGlass,U as Interactive,w as LargeItems,O as LargeRadius,V as LowExpansion,C as ManyItems,E as MediaControls,T as MinimalGlass,H as NoSounds,q as SlowAnimation,N as SmallItems,I as SmallRadius,D as SpacedLayout,P as StiffAnimation,js as __namedExportsOrder,zs as default};
