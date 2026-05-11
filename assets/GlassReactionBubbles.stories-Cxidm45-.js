import{r as u,b as xe,j as s,e as ve,m as h,c as t}from"./iframe-CCVHZjui.js";import{u as Ce}from"./soundDesign-BUt5NYqY.js";import{u as be}from"./a11y-DYpJNAyD.js";import{u as je}from"./useMotionPreference-D2eeqZD8.js";import{c as x}from"./createGlassStyle-BfWnO-qv.js";import{O as Ne}from"./OptimizedGlassCore-D_hfAzIe.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-WGQt4yIJ.js";var Me={};const Be=["❤️","😀","😂","🎉","👏","🔥","💯","⭐","👍","👎","😍","🤔","😮","😢","💪","🙌"],oe=["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FECA57","#FF9FF3","#54A0FF","#5F27CD","#00D2D3","#FF9F43"],Fe=()=>{const n=Date.now();return[{id:"demo-reaction-1",emoji:"🎉",userId:"demo-a",userName:"Aurora",userColor:"#38bdf8",x:96,y:86,timestamp:n-1200,size:34,velocity:{x:.2,y:-.4},life:4200,maxLife:5e3},{id:"demo-reaction-2",emoji:"✨",userId:"demo-b",userName:"Lumen",userColor:"#a3e635",x:168,y:118,timestamp:n-2400,size:30,velocity:{x:-.1,y:-.2},life:3600,maxLife:5e3},{id:"demo-reaction-3",emoji:"💎",userId:"demo-c",userName:"Orbit",userColor:"#22d3ee",x:238,y:76,timestamp:n-3600,size:32,velocity:{x:.1,y:-.3},life:3e3,maxLife:5e3}]},X=u.forwardRef(({width:n=360,height:i=260,reactions:Y=[],availableEmojis:y=Be,showControls:J=!0,showUserNames:ie=!0,bubbleLifetime:z=5e3,maxBubbles:K=50,gravity:Q=.1,windForce:Z=.05,bounceEnabled:ee=!0,fadeOut:le=!0,soundEnabled:se=!0,realTimeMode:A=!1,interactive:G=!0,onReactionAdd:ae,onReactionClick:te,className:ce="",...ue},de)=>{const g=xe(),[f,re]=u.useState(Y.length>0?Y:Fe),[C,me]=u.useState(y[0]),[Re,Ee]=u.useState(!1),{play:ne}=Ce();be("glass-reaction-bubbles");const{shouldAnimate:p}=je(),P=u.useRef(),b=typeof process<"u"&&Me?.JEST_WORKER_ID!==void 0;P.current||(P.current=()=>Math.random());const r=P.current;u.useEffect(()=>{if(b||!A)return;const e=setInterval(()=>{if(r()<.3){const a=y[Math.floor(r()*y.length)],o=r()*(n-40)+20,m=r()*(i-40)+20;w(a,o,m,`user-${Date.now()}`,"Anonymous")}},2e3);return()=>clearInterval(e)},[A,y,n,i]),u.useEffect(()=>{if(b||f.length===0)return;const e=requestAnimationFrame(()=>{re(a=>a.map(o=>{const m=o.life-16;if(m<=0)return null;const d={...o.velocity};d.y+=Q,d.x+=(r()-.5)*Z;let l=o.x+d.x,c=o.y+d.y;return ee?((l<=0||l>=n-40)&&(d.x*=-.7,l=Math.max(0,Math.min(n-40,l))),(c<=0||c>=i-40)&&(d.y*=-.7,c=Math.max(0,Math.min(i-40,c)))):(l<-40&&(l=n),l>n&&(l=-40),c<-40&&(c=i),c>i&&(c=-40)),{...o,x:l,y:c,velocity:d,life:m}}).filter(o=>o!==null))});return()=>cancelAnimationFrame(e)},[f,Q,Z,ee,n,i]);const w=u.useCallback((e,a,o,m,d)=>{const l={id:`reaction-${Date.now()}-${r()}`,emoji:e,userId:m||"current",userName:d||"You",userColor:oe[Math.floor(r()*oe.length)],x:a??r()*(n-40)+20,y:o??r()*(i-40)+20,timestamp:Date.now(),size:30+r()*20,velocity:{x:(r()-.5)*4,y:(r()-.5)*4-2},life:z,maxLife:z};re(c=>[...c,l].slice(-K)),se&&ne("notification"),ae?.(e,l.x,l.y)},[n,i,z,K,se,ne,ae]),ge=u.useCallback(e=>{if(!G)return;const a=e.currentTarget.getBoundingClientRect(),o=e.clientX-a.left,m=e.clientY-a.top;w(C,o,m)},[G,C,w]),pe=u.useCallback((e,a)=>{a.stopPropagation(),te?.(e);for(let o=0;o<3;o++)w(e.emoji,e.x+(r()-.5)*20,e.y+(r()-.5)*20)},[te,w]),he=e=>le?Math.max(.1,e.life/e.maxLife):1,W=e=>{const a=1-e.life/e.maxLife;return .8+Math.sin(a*Math.PI)*.4},fe=({bubble:e})=>s.jsx(h.div,{className:t("glass-absolute glass-cursor-pointer glass-select-none glass-z-10"),style:{left:e.x,top:e.y,fontSize:e.size||30},initial:{scale:0,opacity:0},animate:g?{}:{scale:W(e),opacity:he(e),rotate:Math.sin(Date.now()/1e3+e.timestamp)*10},exit:{scale:0,opacity:0,y:e.y-50},transition:p?{type:"spring",stiffness:300,damping:20}:{duration:0},onClick:a=>pe(e,a),whileHover:{scale:W(e)*1.1},whileTap:{scale:W(e)*.9},children:s.jsxs("div",{className:t("glass-relative glass-inline-flex glass-items-center glass-justify-center glass-radius-full glass-border glass-border-white/20",x({blur:"sm",opacity:.8}).background),children:[s.jsx("span",{className:t("glass-text-2xl"),children:e.emoji}),ie&&s.jsx(h.div,{className:t("glass-absolute glass-bottom-8-neg glass-left-1/2 glass-transform glass-translate-x-1/2-neg"),initial:{opacity:0,y:10},animate:g?{}:{opacity:.8,y:0},exit:{opacity:0,y:10},transition:p?{delay:.2}:{duration:0},children:s.jsx("div",{className:t("glass-px-2 glass-py-1 glass-text-xs glass-font-medium glass-text-primary glass-radius glass-border glass-border-white/20 glass-whitespace-nowrap",x({blur:"sm",opacity:.8}).background),children:e.userName})}),s.jsx(h.div,{className:t("glass-absolute glass-inset-0 glass-radius-full"),style:{background:`radial-gradient(circle, ${e.userColor||"#FF6B6B"}40 0%, transparent 70%)`},animate:g?{}:{scale:[1,1.5,1],opacity:[.3,.1,.3]},transition:p?{duration:2,repeat:1/0,ease:"easeInOut"}:{duration:0}})]})}),ye=()=>s.jsx(h.div,{className:t("glass-flex glass-flex-wrap glass-gap-2 glass-p-3 glass-radius-lg glass-max-w-xs",x({blur:"sm",opacity:.8}).background),initial:{opacity:0,y:20},animate:g?{}:{opacity:1,y:0},transition:p?{duration:.3}:{duration:0},children:y.map(e=>s.jsx("button",{onClick:()=>me(e),className:t("glass-w-10 glass-h-10 glass-radius-lg glass-flex glass-items-center glass-justify-center glass-text-xl glass-focus glass-touch-target glass-contrast-guard",C===e?"glass-surface-subtle/20 glass-ring-2 glass-ring-primary":"glass-surface-transparent"),children:e},e))}),$={totalReactions:f.length,recentReactions:f.filter(e=>Date.now()-e.timestamp<5e3).length,mostUsedEmoji:f.reduce((e,a)=>(e[a.emoji]=(e[a.emoji]||0)+1,e),{})},H=Object.entries($.mostUsedEmoji).sort(([,e],[,a])=>a-e)[0],we=u.useMemo(()=>b?Array.from({length:5},(e,a)=>({left:n/6*(a+1),top:i/6*(a+1),duration:3+a*.25,delay:a*.2})):Array.from({length:5},()=>({left:r()*n,top:r()*i,duration:3+r()*2,delay:r()*2})),[i,b,r,n]);return s.jsxs(Ne,{ref:de,intensity:"subtle",className:t("glass-relative glass-overflow-hidden",ce),style:{width:"100%",maxWidth:"100%",height:i},...ue,children:[s.jsxs("div",{className:t("glass-absolute glass-inset-0 glass-cursor-crosshair"),onClick:ge,style:{width:"100%",height:i},children:[s.jsx(ve,{children:f.map(e=>s.jsx(fe,{bubble:e},e.id))}),we.map((e,a)=>s.jsx(h.div,{className:t("glass-absolute glass-w-2 glass-h-2 glass-surface-muted glass-radius-full"),style:{left:e.left,top:e.top},animate:g?{}:{y:[0,-20,0],opacity:[.2,.8,.2],scale:[.5,1,.5]},transition:p?{duration:e.duration,repeat:1/0,delay:e.delay,ease:"easeInOut"}:{duration:0}},a))]}),J&&s.jsx("div",{className:t("glass-absolute glass-top-4 glass-left-4 glass-z-20 glass-max-w-48"),children:s.jsx(ye,{})}),s.jsx(h.div,{className:t("glass-absolute glass-top-4 glass-right-4 glass-z-20 glass-p-3 glass-radius-lg",x({blur:"sm",opacity:.8}).background),initial:{opacity:0,x:20},animate:g?{}:{opacity:1,x:0},transition:p?{delay:.5}:{duration:0},children:s.jsxs("div",{className:t("glass-text-sm glass-text-secondary glass-space-y-1"),children:[s.jsxs("div",{className:t("glass-flex glass-items-center glass-gap-2 glass-whitespace-nowrap"),children:[s.jsx("span",{children:$.totalReactions}),s.jsx("span",{className:t("glass-text-muted"),children:"total"})]}),s.jsxs("div",{className:t("glass-flex glass-items-center glass-gap-2 glass-whitespace-nowrap"),children:[s.jsx("span",{children:$.recentReactions}),s.jsx("span",{className:t("glass-text-muted"),children:"recent"})]}),H&&s.jsxs("div",{className:t("glass-flex glass-items-center glass-gap-2 glass-whitespace-nowrap"),children:[s.jsx("span",{children:H[0]}),s.jsxs("span",{className:t("glass-text-muted"),children:[H[1],"x"]})]})]})}),G&&J&&i>=300&&s.jsxs(h.div,{className:t("glass-absolute glass-bottom-4 glass-left-1-2 glass-z-20 glass-px-4 glass-py-2 glass-radius-lg glass-text-sm glass-text-secondary glass-whitespace-nowrap",x({blur:"sm",opacity:.8}).background),style:{transform:"translateX(-50%)"},initial:{opacity:0,y:20},animate:g?{}:{opacity:1,y:0},transition:p?{delay:1}:{duration:0},children:["Click anywhere to add ",C," • Click bubbles to multiply them"]}),A&&s.jsxs("div",{className:t("glass-absolute glass-bottom-4 glass-right-4 glass-z-20 glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-text-muted"),children:[s.jsx("div",{className:t("glass-w-2 glass-h-2 glass-surface-success glass-radius-full")}),s.jsx("span",{children:"Live reactions"})]})]})});try{X.displayName="GlassReactionBubbles",X.__docgenInfo={description:"",displayName:"GlassReactionBubbles",props:{width:{defaultValue:{value:"360"},description:"",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"260"},description:"",name:"height",required:!1,type:{name:"number | undefined"}},reactions:{defaultValue:{value:"[]"},description:"",name:"reactions",required:!1,type:{name:"ReactionBubble[] | undefined"}},availableEmojis:{defaultValue:{value:`[
  "❤️",
  "😀",
  "😂",
  "🎉",
  "👏",
  "🔥",
  "💯",
  "⭐",
  "👍",
  "👎",
  "😍",
  "🤔",
  "😮",
  "😢",
  "💪",
  "🙌",
]`},description:"",name:"availableEmojis",required:!1,type:{name:"string[] | undefined"}},showControls:{defaultValue:{value:"true"},description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showUserNames:{defaultValue:{value:"true"},description:"",name:"showUserNames",required:!1,type:{name:"boolean | undefined"}},bubbleLifetime:{defaultValue:{value:"5000"},description:"",name:"bubbleLifetime",required:!1,type:{name:"number | undefined"}},maxBubbles:{defaultValue:{value:"50"},description:"",name:"maxBubbles",required:!1,type:{name:"number | undefined"}},gravity:{defaultValue:{value:"0.1"},description:"",name:"gravity",required:!1,type:{name:"number | undefined"}},windForce:{defaultValue:{value:"0.05"},description:"",name:"windForce",required:!1,type:{name:"number | undefined"}},bounceEnabled:{defaultValue:{value:"true"},description:"",name:"bounceEnabled",required:!1,type:{name:"boolean | undefined"}},fadeOut:{defaultValue:{value:"true"},description:"",name:"fadeOut",required:!1,type:{name:"boolean | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},realTimeMode:{defaultValue:{value:"false"},description:"",name:"realTimeMode",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:{value:"true"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},onReactionAdd:{defaultValue:null,description:"",name:"onReactionAdd",required:!1,type:{name:"((emoji: string, x?: number | undefined, y?: number | undefined) => void) | undefined"}},onReactionClick:{defaultValue:null,description:"",name:"onReactionClick",required:!1,type:{name:"((reaction: ReactionBubble) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const v=[{id:"1",emoji:"❤️",userId:"user1",userName:"Alice",userColor:"#FF6B6B",x:150,y:100,timestamp:Date.now()-1e3,size:35,velocity:{x:1,y:-.5},life:4e3,maxLife:5e3},{id:"2",emoji:"😂",userId:"user2",userName:"Bob",userColor:"#4ECDC4",x:300,y:200,timestamp:Date.now()-2e3,size:40,velocity:{x:-.5,y:-1},life:3e3,maxLife:5e3},{id:"3",emoji:"🎉",userId:"user3",userName:"Carol",userColor:"#45B7D1",x:450,y:150,timestamp:Date.now()-500,size:30,velocity:{x:.8,y:-1.2},life:4500,maxLife:5e3}],Se=["🚀","⚡","🌟","💎","🔥","🎊","🌈","✨"],_e={title:"Workflows/Glass Reaction Bubbles",component:X,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{width:{control:{type:"range",min:300,max:1e3,step:50}},height:{control:{type:"range",min:200,max:600,step:50}},bubbleLifetime:{control:{type:"range",min:1e3,max:1e4,step:500}},maxBubbles:{control:{type:"range",min:10,max:100,step:10}},gravity:{control:{type:"range",min:0,max:1,step:.05}},windForce:{control:{type:"range",min:0,max:.5,step:.01}}}},j={args:{width:600,height:400,reactions:v,showControls:!0,showUserNames:!0,interactive:!0}},N={args:{width:700,height:450,realTimeMode:!0,showControls:!0,showUserNames:!0,interactive:!0,soundEnabled:!0}},M={args:{width:600,height:400,availableEmojis:Se,showControls:!0,showUserNames:!0,interactive:!0}},B={args:{width:600,height:400,reactions:v,showControls:!1,showUserNames:!0,interactive:!1}},F={args:{width:400,height:300,reactions:v.slice(0,2),showControls:!0,showUserNames:!1,interactive:!0}},S={args:{width:900,height:600,reactions:v,showControls:!0,showUserNames:!0,interactive:!0,realTimeMode:!0}},R={args:{width:600,height:400,gravity:.5,windForce:.1,showControls:!0,interactive:!0,realTimeMode:!0}},E={args:{width:600,height:400,gravity:.02,windForce:.02,showControls:!0,interactive:!0,realTimeMode:!0}},T={args:{width:600,height:400,bounceEnabled:!1,gravity:.1,windForce:.05,showControls:!0,interactive:!0,realTimeMode:!0}},L={args:{width:600,height:400,bubbleLifetime:1e4,showControls:!0,interactive:!0,realTimeMode:!0}},k={args:{width:600,height:400,bubbleLifetime:2e3,showControls:!0,interactive:!0,realTimeMode:!0}},V={args:{width:800,height:500,maxBubbles:100,showControls:!0,interactive:!0,realTimeMode:!0}},D={args:{width:600,height:400,maxBubbles:15,showControls:!0,interactive:!0,realTimeMode:!0}},q={args:{width:600,height:400,fadeOut:!1,showControls:!0,interactive:!0,realTimeMode:!0}},U={args:{width:600,height:400,windForce:.2,gravity:.05,showControls:!0,interactive:!0,realTimeMode:!0}},I={args:{width:600,height:400,soundEnabled:!1,showControls:!0,interactive:!0,realTimeMode:!0}},O={args:{width:600,height:400,reactions:v,interactive:!1,showControls:!1,showUserNames:!0}},_={args:{width:800,height:500,availableEmojis:["🌪️","⚡","🌊","🔥","❄️","🌟"],realTimeMode:!0,maxBubbles:80,gravity:.3,windForce:.15,showControls:!0,interactive:!0}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    reactions: mockReactions,
    showControls: true,
    showUserNames: true,
    interactive: true
  }
}`,...j.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 450,
    realTimeMode: true,
    showControls: true,
    showUserNames: true,
    interactive: true,
    soundEnabled: true
  }
}`,...N.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    availableEmojis: customEmojis,
    showControls: true,
    showUserNames: true,
    interactive: true
  }
}`,...M.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    reactions: mockReactions,
    showControls: false,
    showUserNames: true,
    interactive: false
  }
}`,...B.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 300,
    reactions: mockReactions.slice(0, 2),
    showControls: true,
    showUserNames: false,
    interactive: true
  }
}`,...F.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    width: 900,
    height: 600,
    reactions: mockReactions,
    showControls: true,
    showUserNames: true,
    interactive: true,
    realTimeMode: true
  }
}`,...S.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    gravity: 0.5,
    windForce: 0.1,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...R.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    gravity: 0.02,
    windForce: 0.02,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...E.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    bounceEnabled: false,
    gravity: 0.1,
    windForce: 0.05,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...T.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    bubbleLifetime: 10000,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...L.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    bubbleLifetime: 2000,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...k.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 500,
    maxBubbles: 100,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...V.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    maxBubbles: 15,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...D.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    fadeOut: false,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...q.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    windForce: 0.2,
    gravity: 0.05,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...U.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    soundEnabled: false,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...I.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    reactions: mockReactions,
    interactive: false,
    showControls: false,
    showUserNames: true
  }
}`,...O.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 500,
    availableEmojis: ['🌪️', '⚡', '🌊', '🔥', '❄️', '🌟'],
    realTimeMode: true,
    maxBubbles: 80,
    gravity: 0.3,
    windForce: 0.15,
    showControls: true,
    interactive: true
  }
}`,..._.parameters?.docs?.source}}};const ze=["Default","RealTimeMode","CustomEmojis","NoControls","CompactView","LargeCanvas","HighGravity","LowGravity","NoBounce","LongLifetime","ShortLifetime","ManyBubbles","FewBubbles","NoFadeOut","StrongWind","SilentMode","ReadOnlyMode","EmojiStorm"];export{F as CompactView,M as CustomEmojis,j as Default,_ as EmojiStorm,D as FewBubbles,R as HighGravity,S as LargeCanvas,L as LongLifetime,E as LowGravity,V as ManyBubbles,T as NoBounce,B as NoControls,q as NoFadeOut,O as ReadOnlyMode,N as RealTimeMode,k as ShortLifetime,I as SilentMode,U as StrongWind,ze as __namedExportsOrder,_e as default};
