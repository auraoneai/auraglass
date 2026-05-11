import{r as u,b as Se,j as s,e as Be,m as h,c as t}from"./iframe-CrdWMSIk.js";import{u as Fe}from"./soundDesign-Ct9H_xED.js";import{u as Re}from"./a11y-C6c8VL3n.js";import{u as Ee}from"./useMotionPreference-DiZSpnSa.js";import{c as v}from"./createGlassStyle-BfWnO-qv.js";import{O as Te}from"./OptimizedGlassCore-BMxL0Y3X.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-ClxBxKMX.js";var Le={};const ke=["❤️","😀","😂","🎉","👏","🔥","💯","⭐","👍","👎","😍","🤔","😮","😢","💪","🙌"],ce=["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FECA57","#FF9FF3","#54A0FF","#5F27CD","#00D2D3","#FF9F43"],Ve=()=>{const n=Date.now();return[{id:"demo-reaction-1",emoji:"🎉",userId:"demo-a",userName:"Aurora",userColor:"#38bdf8",x:96,y:86,timestamp:n-1200,size:34,velocity:{x:.2,y:-.4},life:4200,maxLife:5e3},{id:"demo-reaction-2",emoji:"✨",userId:"demo-b",userName:"Lumen",userColor:"#a3e635",x:168,y:118,timestamp:n-2400,size:30,velocity:{x:-.1,y:-.2},life:3600,maxLife:5e3},{id:"demo-reaction-3",emoji:"💎",userId:"demo-c",userName:"Orbit",userColor:"#22d3ee",x:238,y:76,timestamp:n-3600,size:32,velocity:{x:.1,y:-.3},life:3e3,maxLife:5e3}]},K=u.forwardRef(({width:n=360,height:l=260,reactions:Q=[],availableEmojis:w=ke,showControls:Z=!0,showUserNames:ue=!0,bubbleLifetime:H=5e3,maxBubbles:ee=50,gravity:se=.1,windForce:ae=.05,bounceEnabled:te=!0,fadeOut:de=!0,soundEnabled:re=!0,realTimeMode:$=!1,interactive:P=!0,compact:b=!1,contained:me=!1,maxHeight:ge,onReactionAdd:ne,onReactionClick:oe,className:pe="",...fe},he)=>{const p=Se(),[y,ie]=u.useState(Q.length>0?Q:Ve),[N,ye]=u.useState(w[0]),[De,Ue]=u.useState(!1),{play:le}=Fe();Re("glass-reaction-bubbles");const{shouldAnimate:f}=Ee(),W=u.useRef(),j=typeof process<"u"&&Le?.JEST_WORKER_ID!==void 0;W.current||(W.current=()=>Math.random());const r=W.current;u.useEffect(()=>{if(j||!$)return;const e=setInterval(()=>{if(r()<.3){const a=w[Math.floor(r()*w.length)],o=r()*(n-40)+20,g=r()*(l-40)+20;x(a,o,g,`user-${Date.now()}`,"Anonymous")}},2e3);return()=>clearInterval(e)},[$,w,n,l]),u.useEffect(()=>{if(j||y.length===0)return;const e=requestAnimationFrame(()=>{ie(a=>a.map(o=>{const g=o.life-16;if(g<=0)return null;const d={...o.velocity};d.y+=se,d.x+=(r()-.5)*ae;let i=o.x+d.x,c=o.y+d.y;return te?((i<=0||i>=n-40)&&(d.x*=-.7,i=Math.max(0,Math.min(n-40,i))),(c<=0||c>=l-40)&&(d.y*=-.7,c=Math.max(0,Math.min(l-40,c)))):(i<-40&&(i=n),i>n&&(i=-40),c<-40&&(c=l),c>l&&(c=-40)),{...o,x:i,y:c,velocity:d,life:g}}).filter(o=>o!==null))});return()=>cancelAnimationFrame(e)},[y,se,ae,te,n,l]);const x=u.useCallback((e,a,o,g,d)=>{const i={id:`reaction-${Date.now()}-${r()}`,emoji:e,userId:g||"current",userName:d||"You",userColor:ce[Math.floor(r()*ce.length)],x:a??r()*(n-40)+20,y:o??r()*(l-40)+20,timestamp:Date.now(),size:30+r()*20,velocity:{x:(r()-.5)*4,y:(r()-.5)*4-2},life:H,maxLife:H};ie(c=>[...c,i].slice(-ee)),re&&le("notification"),ne?.(e,i.x,i.y)},[n,l,H,ee,re,le,ne]),we=u.useCallback(e=>{if(!P)return;const a=e.currentTarget.getBoundingClientRect(),o=e.clientX-a.left,g=e.clientY-a.top;x(N,o,g)},[P,N,x]),xe=u.useCallback((e,a)=>{a.stopPropagation(),oe?.(e);for(let o=0;o<3;o++)x(e.emoji,e.x+(r()-.5)*20,e.y+(r()-.5)*20)},[oe,x]),ve=e=>de?Math.max(.1,e.life/e.maxLife):1,X=e=>{const a=1-e.life/e.maxLife;return .8+Math.sin(a*Math.PI)*.4},Ce=({bubble:e})=>s.jsx(h.div,{className:t("glass-absolute glass-cursor-pointer glass-select-none glass-z-10"),style:{left:e.x,top:e.y,fontSize:e.size||30},initial:{scale:0,opacity:0},animate:p?{}:{scale:X(e),opacity:ve(e),rotate:Math.sin(Date.now()/1e3+e.timestamp)*10},exit:{scale:0,opacity:0,y:e.y-50},transition:f?{type:"spring",stiffness:300,damping:20}:{duration:0},onClick:a=>xe(e,a),whileHover:{scale:X(e)*1.1},whileTap:{scale:X(e)*.9},children:s.jsxs("div",{className:t("glass-relative glass-inline-flex glass-items-center glass-justify-center glass-radius-full glass-border glass-border-white/20",v({blur:"sm",opacity:.8}).background),children:[s.jsx("span",{className:t("glass-text-2xl"),children:e.emoji}),je&&s.jsx(h.div,{className:t("glass-absolute glass-bottom-8-neg glass-left-1/2 glass-transform glass-translate-x-1/2-neg"),initial:{opacity:0,y:10},animate:p?{}:{opacity:.8,y:0},exit:{opacity:0,y:10},transition:f?{delay:.2}:{duration:0},children:s.jsx("div",{className:t("glass-px-2 glass-py-1 glass-text-xs glass-font-medium glass-text-primary glass-radius glass-border glass-border-white/20 glass-whitespace-nowrap",v({blur:"sm",opacity:.8}).background),children:e.userName})}),s.jsx(h.div,{className:t("glass-absolute glass-inset-0 glass-radius-full"),style:{background:`radial-gradient(circle, ${e.userColor||"#FF6B6B"}40 0%, transparent 70%)`},animate:p?{}:{scale:[1,1.5,1],opacity:[.3,.1,.3]},transition:f?{duration:2,repeat:1/0,ease:"easeInOut"}:{duration:0}})]})}),be=()=>s.jsx(h.div,{className:t("glass-flex glass-flex-wrap glass-gap-2 glass-p-3 glass-radius-lg glass-max-w-xs",v({blur:"sm",opacity:.8}).background),initial:{opacity:0,y:20},animate:p?{}:{opacity:1,y:0},transition:f?{duration:.3}:{duration:0},children:w.map(e=>s.jsx("button",{onClick:()=>ye(e),className:t("glass-w-10 glass-h-10 glass-radius-lg glass-flex glass-items-center glass-justify-center glass-text-xl glass-focus glass-touch-target glass-contrast-guard",N===e?"glass-surface-subtle/20 glass-ring-2 glass-ring-primary":"glass-surface-transparent"),children:e},e))}),Y={totalReactions:y.length,recentReactions:y.filter(e=>Date.now()-e.timestamp<5e3).length,mostUsedEmoji:y.reduce((e,a)=>(e[a.emoji]=(e[a.emoji]||0)+1,e),{})},J=Object.entries(Y.mostUsedEmoji).sort(([,e],[,a])=>a-e)[0],m=ge??(b||me?220:l),M=typeof m=="number"?m:l,Ne=b?!1:Z,je=b?!1:ue,Me=u.useMemo(()=>j?Array.from({length:5},(e,a)=>({left:n/6*(a+1),top:M/6*(a+1),duration:3+a*.25,delay:a*.2})):Array.from({length:5},()=>({left:r()*n,top:r()*M,duration:3+r()*2,delay:r()*2})),[M,j,r,n]);return s.jsxs(Te,{ref:he,intensity:"subtle",className:t("glass-relative glass-overflow-hidden",pe),style:{width:"100%",maxWidth:"100%",height:typeof m=="number"?`${m}px`:m,maxHeight:typeof m=="number"?`${m}px`:m},...fe,children:[s.jsxs("div",{className:t("glass-absolute glass-inset-0 glass-cursor-crosshair"),onClick:we,style:{width:"100%",height:M},children:[s.jsx(Be,{children:y.map(e=>s.jsx(Ce,{bubble:e},e.id))}),Me.map((e,a)=>s.jsx(h.div,{className:t("glass-absolute glass-w-2 glass-h-2 glass-surface-muted glass-radius-full"),style:{left:e.left,top:e.top},animate:p?{}:{y:[0,-20,0],opacity:[.2,.8,.2],scale:[.5,1,.5]},transition:f?{duration:e.duration,repeat:1/0,delay:e.delay,ease:"easeInOut"}:{duration:0}},a))]}),Ne&&s.jsx("div",{className:t("glass-absolute glass-top-4 glass-left-4 glass-z-20 glass-max-w-48"),children:s.jsx(be,{})}),!b&&s.jsx(h.div,{className:t("glass-absolute glass-top-4 glass-right-4 glass-z-20 glass-p-3 glass-radius-lg",v({blur:"sm",opacity:.8}).background),initial:{opacity:0,x:20},animate:p?{}:{opacity:1,x:0},transition:f?{delay:.5}:{duration:0},children:s.jsxs("div",{className:t("glass-text-sm glass-text-secondary glass-space-y-1"),children:[s.jsxs("div",{className:t("glass-flex glass-items-center glass-gap-2 glass-whitespace-nowrap"),children:[s.jsx("span",{children:Y.totalReactions}),s.jsx("span",{className:t("glass-text-muted"),children:"total"})]}),s.jsxs("div",{className:t("glass-flex glass-items-center glass-gap-2 glass-whitespace-nowrap"),children:[s.jsx("span",{children:Y.recentReactions}),s.jsx("span",{className:t("glass-text-muted"),children:"recent"})]}),J&&s.jsxs("div",{className:t("glass-flex glass-items-center glass-gap-2 glass-whitespace-nowrap"),children:[s.jsx("span",{children:J[0]}),s.jsxs("span",{className:t("glass-text-muted"),children:[J[1],"x"]})]})]})}),P&&Z&&l>=300&&s.jsxs(h.div,{className:t("glass-absolute glass-bottom-4 glass-left-1-2 glass-z-20 glass-px-4 glass-py-2 glass-radius-lg glass-text-sm glass-text-secondary glass-whitespace-nowrap",v({blur:"sm",opacity:.8}).background),style:{transform:"translateX(-50%)"},initial:{opacity:0,y:20},animate:p?{}:{opacity:1,y:0},transition:f?{delay:1}:{duration:0},children:["Click anywhere to add ",N," • Click bubbles to multiply them"]}),$&&s.jsxs("div",{className:t("glass-absolute glass-bottom-4 glass-right-4 glass-z-20 glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-text-muted"),children:[s.jsx("div",{className:t("glass-w-2 glass-h-2 glass-surface-success glass-radius-full")}),s.jsx("span",{children:"Live reactions"})]})]})});try{K.displayName="GlassReactionBubbles",K.__docgenInfo={description:"",displayName:"GlassReactionBubbles",props:{width:{defaultValue:{value:"360"},description:"",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"260"},description:"",name:"height",required:!1,type:{name:"number | undefined"}},reactions:{defaultValue:{value:"[]"},description:"",name:"reactions",required:!1,type:{name:"ReactionBubble[] | undefined"}},availableEmojis:{defaultValue:{value:`[
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
]`},description:"",name:"availableEmojis",required:!1,type:{name:"string[] | undefined"}},showControls:{defaultValue:{value:"true"},description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showUserNames:{defaultValue:{value:"true"},description:"",name:"showUserNames",required:!1,type:{name:"boolean | undefined"}},bubbleLifetime:{defaultValue:{value:"5000"},description:"",name:"bubbleLifetime",required:!1,type:{name:"number | undefined"}},maxBubbles:{defaultValue:{value:"50"},description:"",name:"maxBubbles",required:!1,type:{name:"number | undefined"}},gravity:{defaultValue:{value:"0.1"},description:"",name:"gravity",required:!1,type:{name:"number | undefined"}},windForce:{defaultValue:{value:"0.05"},description:"",name:"windForce",required:!1,type:{name:"number | undefined"}},bounceEnabled:{defaultValue:{value:"true"},description:"",name:"bounceEnabled",required:!1,type:{name:"boolean | undefined"}},fadeOut:{defaultValue:{value:"true"},description:"",name:"fadeOut",required:!1,type:{name:"boolean | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},realTimeMode:{defaultValue:{value:"false"},description:"",name:"realTimeMode",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:{value:"true"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},onReactionAdd:{defaultValue:null,description:"",name:"onReactionAdd",required:!1,type:{name:"((emoji: string, x?: number | undefined, y?: number | undefined) => void) | undefined"}},onReactionClick:{defaultValue:null,description:"",name:"onReactionClick",required:!1,type:{name:"((reaction: ReactionBubble) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const C=[{id:"1",emoji:"❤️",userId:"user1",userName:"Alice",userColor:"#FF6B6B",x:150,y:100,timestamp:Date.now()-1e3,size:35,velocity:{x:1,y:-.5},life:4e3,maxLife:5e3},{id:"2",emoji:"😂",userId:"user2",userName:"Bob",userColor:"#4ECDC4",x:300,y:200,timestamp:Date.now()-2e3,size:40,velocity:{x:-.5,y:-1},life:3e3,maxLife:5e3},{id:"3",emoji:"🎉",userId:"user3",userName:"Carol",userColor:"#45B7D1",x:450,y:150,timestamp:Date.now()-500,size:30,velocity:{x:.8,y:-1.2},life:4500,maxLife:5e3}],qe=["🚀","⚡","🌟","💎","🔥","🎊","🌈","✨"],We={title:"Workflows/Glass Reaction Bubbles",component:K,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{width:{control:{type:"range",min:300,max:1e3,step:50}},height:{control:{type:"range",min:200,max:600,step:50}},bubbleLifetime:{control:{type:"range",min:1e3,max:1e4,step:500}},maxBubbles:{control:{type:"range",min:10,max:100,step:10}},gravity:{control:{type:"range",min:0,max:1,step:.05}},windForce:{control:{type:"range",min:0,max:.5,step:.01}}}},S={args:{width:600,height:400,reactions:C,showControls:!0,showUserNames:!0,interactive:!0}},B={args:{width:700,height:450,realTimeMode:!0,showControls:!0,showUserNames:!0,interactive:!0,soundEnabled:!0}},F={args:{width:600,height:400,availableEmojis:qe,showControls:!0,showUserNames:!0,interactive:!0}},R={args:{width:600,height:400,reactions:C,showControls:!1,showUserNames:!0,interactive:!1}},E={args:{width:400,height:300,reactions:C.slice(0,2),showControls:!0,showUserNames:!1,interactive:!0}},T={args:{width:900,height:600,reactions:C,showControls:!0,showUserNames:!0,interactive:!0,realTimeMode:!0}},L={args:{width:600,height:400,gravity:.5,windForce:.1,showControls:!0,interactive:!0,realTimeMode:!0}},k={args:{width:600,height:400,gravity:.02,windForce:.02,showControls:!0,interactive:!0,realTimeMode:!0}},V={args:{width:600,height:400,bounceEnabled:!1,gravity:.1,windForce:.05,showControls:!0,interactive:!0,realTimeMode:!0}},q={args:{width:600,height:400,bubbleLifetime:1e4,showControls:!0,interactive:!0,realTimeMode:!0}},D={args:{width:600,height:400,bubbleLifetime:2e3,showControls:!0,interactive:!0,realTimeMode:!0}},U={args:{width:800,height:500,maxBubbles:100,showControls:!0,interactive:!0,realTimeMode:!0}},I={args:{width:600,height:400,maxBubbles:15,showControls:!0,interactive:!0,realTimeMode:!0}},O={args:{width:600,height:400,fadeOut:!1,showControls:!0,interactive:!0,realTimeMode:!0}},_={args:{width:600,height:400,windForce:.2,gravity:.05,showControls:!0,interactive:!0,realTimeMode:!0}},z={args:{width:600,height:400,soundEnabled:!1,showControls:!0,interactive:!0,realTimeMode:!0}},A={args:{width:600,height:400,reactions:C,interactive:!1,showControls:!1,showUserNames:!0}},G={args:{width:800,height:500,availableEmojis:["🌪️","⚡","🌊","🔥","❄️","🌟"],realTimeMode:!0,maxBubbles:80,gravity:.3,windForce:.15,showControls:!0,interactive:!0}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    reactions: mockReactions,
    showControls: true,
    showUserNames: true,
    interactive: true
  }
}`,...S.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 450,
    realTimeMode: true,
    showControls: true,
    showUserNames: true,
    interactive: true,
    soundEnabled: true
  }
}`,...B.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    availableEmojis: customEmojis,
    showControls: true,
    showUserNames: true,
    interactive: true
  }
}`,...F.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    reactions: mockReactions,
    showControls: false,
    showUserNames: true,
    interactive: false
  }
}`,...R.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 300,
    reactions: mockReactions.slice(0, 2),
    showControls: true,
    showUserNames: false,
    interactive: true
  }
}`,...E.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    width: 900,
    height: 600,
    reactions: mockReactions,
    showControls: true,
    showUserNames: true,
    interactive: true,
    realTimeMode: true
  }
}`,...T.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    gravity: 0.5,
    windForce: 0.1,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...L.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    gravity: 0.02,
    windForce: 0.02,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...k.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    bubbleLifetime: 10000,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...q.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    bubbleLifetime: 2000,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...D.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 500,
    maxBubbles: 100,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...U.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    maxBubbles: 15,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...I.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    fadeOut: false,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...O.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    windForce: 0.2,
    gravity: 0.05,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,..._.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    soundEnabled: false,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...z.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    reactions: mockReactions,
    interactive: false,
    showControls: false,
    showUserNames: true
  }
}`,...A.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}};const Xe=["Default","RealTimeMode","CustomEmojis","NoControls","CompactView","LargeCanvas","HighGravity","LowGravity","NoBounce","LongLifetime","ShortLifetime","ManyBubbles","FewBubbles","NoFadeOut","StrongWind","SilentMode","ReadOnlyMode","EmojiStorm"];export{E as CompactView,F as CustomEmojis,S as Default,G as EmojiStorm,I as FewBubbles,L as HighGravity,T as LargeCanvas,q as LongLifetime,k as LowGravity,U as ManyBubbles,V as NoBounce,R as NoControls,O as NoFadeOut,A as ReadOnlyMode,B as RealTimeMode,D as ShortLifetime,z as SilentMode,_ as StrongWind,Xe as __namedExportsOrder,We as default};
