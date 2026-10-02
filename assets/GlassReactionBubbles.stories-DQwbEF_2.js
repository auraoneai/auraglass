import{r as u,a as Re,j as s,d as Ee,m as f,c as r}from"./iframe-DFMMcocb.js";import{u as Te}from"./soundDesign-DAOJZn7H.js";import{u as Le}from"./a11y-Q0mX7KvA.js";import{u as Ve}from"./useMotionPreference-CXubJTNb.js";import{c as v}from"./createGlassStyle-Cr0Un8y6.js";import{O as ke}from"./OptimizedGlassCore-1D6AE-uZ.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-iDxBLJQX.js";var qe={};const Ue=["❤️","😀","😂","🎉","👏","🔥","💯","⭐","👍","👎","😍","🤔","😮","😢","💪","🙌"],ue=["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FECA57","#FF9FF3","#54A0FF","#5F27CD","#00D2D3","#FF9F43"],De=(t=0)=>[{id:"demo-reaction-1",emoji:"🎉",userId:"demo-a",userName:"Aurora",userColor:"#38bdf8",x:96,y:86,timestamp:t-1200,size:34,velocity:{x:.2,y:-.4},life:4200,maxLife:5e3},{id:"demo-reaction-2",emoji:"✨",userId:"demo-b",userName:"Lumen",userColor:"#a3e635",x:168,y:118,timestamp:t-2400,size:30,velocity:{x:-.1,y:-.2},life:3600,maxLife:5e3},{id:"demo-reaction-3",emoji:"💎",userId:"demo-c",userName:"Orbit",userColor:"#22d3ee",x:238,y:76,timestamp:t-3600,size:32,velocity:{x:.1,y:-.3},life:3e3,maxLife:5e3}],Ie=(t=1234)=>{let o=t>>>0;return()=>(o=(o*1664525+1013904223)%4294967296,o/4294967296)},Q=u.forwardRef(({width:t=360,height:o=260,reactions:$=[],availableEmojis:y=Ue,showControls:Z=!0,showUserNames:de=!0,bubbleLifetime:H=5e3,maxBubbles:ee=50,gravity:se=.1,windForce:ae=.05,bounceEnabled:te=!0,fadeOut:me=!0,soundEnabled:re=!0,realTimeMode:P=!1,interactive:Y=!0,demoState:ge="active",autoplay:pe,compact:b=!1,contained:fe=!1,maxHeight:he,onReactionAdd:ne,onReactionClick:oe,className:ye="",...xe},we)=>{const x=Re(),ve=$.length===0&&(pe||ge==="active"),[h,ie]=u.useState($.length>0?$:ve?De(0):[]),[j,Ce]=u.useState(y[0]),[Ae,Oe]=u.useState(!1),{play:le}=Te();Le("glass-reaction-bubbles");const{shouldAnimate:p}=Ve(),X=u.useRef(),N=typeof process<"u"&&qe?.JEST_WORKER_ID!==void 0;X.current||(X.current=Ie());const n=X.current;u.useEffect(()=>{if(N||!P)return;const e=setInterval(()=>{if(n()<.3){const a=y[Math.floor(n()*y.length)],i=n()*(t-40)+20,g=n()*(o-40)+20;w(a,i,g,`user-${Date.now()}`,"Anonymous")}},2e3);return()=>clearInterval(e)},[P,y,t,o]),u.useEffect(()=>{if(N||h.length===0)return;const e=requestAnimationFrame(()=>{ie(a=>a.map(i=>{const g=i.life-16;if(g<=0)return null;const d={...i.velocity};d.y+=se,d.x+=(n()-.5)*ae;let l=i.x+d.x,c=i.y+d.y;return te?((l<=0||l>=t-40)&&(d.x*=-.7,l=Math.max(0,Math.min(t-40,l))),(c<=0||c>=o-40)&&(d.y*=-.7,c=Math.max(0,Math.min(o-40,c)))):(l<-40&&(l=t),l>t&&(l=-40),c<-40&&(c=o),c>o&&(c=-40)),{...i,x:l,y:c,velocity:d,life:g}}).filter(i=>i!==null))});return()=>cancelAnimationFrame(e)},[h,se,ae,te,t,o]);const w=u.useCallback((e,a,i,g,d)=>{const l={id:`reaction-${Date.now()}-${n()}`,emoji:e,userId:g||"current",userName:d||"You",userColor:ue[Math.floor(n()*ue.length)],x:a??n()*(t-40)+20,y:i??n()*(o-40)+20,timestamp:Date.now(),size:30+n()*20,velocity:{x:(n()-.5)*4,y:(n()-.5)*4-2},life:H,maxLife:H};ie(c=>[...c,l].slice(-ee)),re&&le("notification"),ne?.(e,l.x,l.y)},[t,o,H,ee,re,le,ne]),be=u.useCallback(e=>{if(!Y)return;const a=e.currentTarget.getBoundingClientRect(),i=e.clientX-a.left,g=e.clientY-a.top;w(j,i,g)},[Y,j,w]),je=u.useCallback((e,a)=>{a.stopPropagation(),oe?.(e);for(let i=0;i<3;i++)w(e.emoji,e.x+(n()-.5)*20,e.y+(n()-.5)*20)},[oe,w]),ce=e=>me?Math.max(.1,e.life/e.maxLife):1,M=e=>{const a=1-e.life/e.maxLife;return .8+Math.sin(a*Math.PI)*.4},Ne=({bubble:e})=>s.jsx(f.div,{className:r("glass-absolute glass-cursor-pointer glass-select-none glass-z-10"),style:{left:`${Math.min(100,Math.max(0,e.x/Math.max(t,1)*100))}%`,top:`${Math.min(100,Math.max(0,e.y/Math.max(o,1)*100))}%`,fontSize:e.size||30,maxWidth:"calc(100% - 8px)"},initial:{scale:0,opacity:0},animate:x?{scale:M(e),opacity:ce(e)}:{scale:M(e),opacity:ce(e),rotate:Math.sin((e.maxLife-e.life)/1e3+e.timestamp)*10},exit:{scale:0,opacity:0,y:e.y-50},transition:p?{type:"spring",stiffness:300,damping:20}:{duration:0},onClick:a=>je(e,a),whileHover:{scale:M(e)*1.1},whileTap:{scale:M(e)*.9},children:s.jsxs("div",{className:r("glass-relative glass-inline-flex glass-items-center glass-justify-center glass-radius-full glass-border glass-border-white/20",v({blur:"sm",opacity:.8}).background),children:[s.jsx("span",{className:r("glass-text-2xl"),children:e.emoji}),Be&&s.jsx(f.div,{className:r("glass-absolute glass-bottom-8-neg glass-left-1/2 glass-transform glass-translate-x-1/2-neg"),initial:{opacity:0,y:10},animate:{opacity:.8,y:0},exit:{opacity:0,y:10},transition:p?{delay:.2}:{duration:0},children:s.jsx("div",{className:r("glass-px-2 glass-py-1 glass-text-xs glass-font-medium glass-text-primary glass-radius glass-border glass-border-white/20 glass-whitespace-nowrap",v({blur:"sm",opacity:.8}).background),children:e.userName})}),s.jsx(f.div,{className:r("glass-absolute glass-inset-0 glass-radius-full"),style:{background:`radial-gradient(circle, ${e.userColor||"#FF6B6B"}40 0%, transparent 70%)`},animate:x?{scale:1,opacity:.2}:{scale:[1,1.5,1],opacity:[.3,.1,.3]},transition:p?{duration:2,repeat:1/0,ease:"easeInOut"}:{duration:0}})]})}),Me=()=>s.jsx(f.div,{className:r("glass-flex glass-flex-wrap glass-gap-2 glass-p-3 glass-radius-lg glass-max-w-xs",v({blur:"sm",opacity:.8}).background),initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:p?{duration:.3}:{duration:0},children:y.map(e=>s.jsx("button",{onClick:()=>Ce(e),className:r("glass-w-10 glass-h-10 glass-radius-lg glass-flex glass-items-center glass-justify-center glass-text-xl glass-focus glass-touch-target glass-contrast-guard",j===e?"glass-surface-subtle/20 glass-ring-2 glass-ring-primary":"glass-surface-transparent"),children:e},e))}),J={totalReactions:h.length,recentReactions:h.filter(e=>e.life>0).length,mostUsedEmoji:h.reduce((e,a)=>(e[a.emoji]=(e[a.emoji]||0)+1,e),{})},K=Object.entries(J.mostUsedEmoji).sort(([,e],[,a])=>a-e)[0],m=he??(b||fe?220:o),S=typeof m=="number"?m:o,Se=b?!1:Z,Be=b?!1:de,Fe=u.useMemo(()=>N?Array.from({length:5},(e,a)=>({left:t/6*(a+1),top:S/6*(a+1),duration:3+a*.25,delay:a*.2})):Array.from({length:5},()=>({left:n()*t,top:n()*S,duration:3+n()*2,delay:n()*2})),[S,N,n,t]);return s.jsxs(ke,{ref:we,intensity:"subtle",className:r("glass-relative glass-overflow-hidden",ye),style:{width:`${t}px`,minWidth:0,maxWidth:"100vw",boxSizing:"border-box",height:typeof m=="number"?`${m}px`:m,maxHeight:typeof m=="number"?`${m}px`:m},...xe,children:[s.jsxs("div",{className:r("glass-absolute glass-inset-0 glass-cursor-crosshair"),onClick:be,style:{width:"100%",height:S,maxWidth:"100%",overflow:"hidden"},children:[s.jsx(Ee,{children:h.map(e=>s.jsx(Ne,{bubble:e},e.id))}),Fe.map((e,a)=>s.jsx(f.div,{className:r("glass-absolute glass-w-2 glass-h-2 glass-surface-muted glass-radius-full"),style:{left:e.left,top:e.top},animate:x?{}:{y:[0,-20,0],opacity:[.2,.8,.2],scale:[.5,1,.5]},transition:p?{duration:e.duration,repeat:1/0,delay:e.delay,ease:"easeInOut"}:{duration:0}},a))]}),Se&&s.jsx("div",{className:r("glass-absolute glass-top-4 glass-left-4 glass-z-20 glass-max-w-48"),children:s.jsx(Me,{})}),!b&&s.jsx(f.div,{className:r("glass-absolute glass-top-4 glass-right-4 glass-z-20 glass-p-3 glass-radius-lg",v({blur:"sm",opacity:.8}).background),initial:{opacity:0,x:20},animate:x?{}:{opacity:1,x:0},transition:p?{delay:.5}:{duration:0},children:s.jsxs("div",{className:r("glass-text-sm glass-text-secondary glass-space-y-1"),children:[s.jsxs("div",{className:r("glass-flex glass-items-center glass-gap-2 glass-whitespace-nowrap"),children:[s.jsx("span",{children:J.totalReactions}),s.jsx("span",{style:{color:"var(--glass-theme-text, var(--glass-text-primary))"},children:"total"})]}),s.jsxs("div",{className:r("glass-flex glass-items-center glass-gap-2 glass-whitespace-nowrap"),children:[s.jsx("span",{children:J.recentReactions}),s.jsx("span",{style:{color:"var(--glass-theme-text, var(--glass-text-primary))"},children:"recent"})]}),K&&s.jsxs("div",{className:r("glass-flex glass-items-center glass-gap-2 glass-whitespace-nowrap"),children:[s.jsx("span",{children:K[0]}),s.jsxs("span",{className:r("glass-text-muted"),children:[K[1],"x"]})]})]})}),Y&&Z&&o>=300&&s.jsxs(f.div,{className:r("glass-absolute glass-bottom-4 glass-left-4 glass-z-20 glass-px-4 glass-py-2 glass-radius-lg glass-text-sm glass-text-secondary",v({blur:"sm",opacity:.8}).background),style:{width:"calc(100% - 32px)",maxWidth:"calc(100% - 32px)",boxSizing:"border-box",whiteSpace:"normal",textAlign:"center"},initial:{opacity:0,y:20},animate:x?{}:{opacity:1,y:0},transition:p?{delay:1}:{duration:0},children:["Click anywhere to add ",j," • Click bubbles to multiply them"]}),P&&s.jsxs("div",{className:r("glass-absolute glass-bottom-4 glass-right-4 glass-z-20 glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-text-muted"),children:[s.jsx("div",{className:r("glass-w-2 glass-h-2 glass-surface-success glass-radius-full")}),s.jsx("span",{children:"Live reactions"})]})]})});try{Q.displayName="GlassReactionBubbles",Q.__docgenInfo={description:"",displayName:"GlassReactionBubbles",props:{width:{defaultValue:{value:"360"},description:"",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"260"},description:"",name:"height",required:!1,type:{name:"number | undefined"}},reactions:{defaultValue:{value:"[]"},description:"",name:"reactions",required:!1,type:{name:"ReactionBubble[] | undefined"}},availableEmojis:{defaultValue:{value:`[
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
]`},description:"",name:"availableEmojis",required:!1,type:{name:"string[] | undefined"}},showControls:{defaultValue:{value:"true"},description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showUserNames:{defaultValue:{value:"true"},description:"",name:"showUserNames",required:!1,type:{name:"boolean | undefined"}},bubbleLifetime:{defaultValue:{value:"5000"},description:"",name:"bubbleLifetime",required:!1,type:{name:"number | undefined"}},maxBubbles:{defaultValue:{value:"50"},description:"",name:"maxBubbles",required:!1,type:{name:"number | undefined"}},gravity:{defaultValue:{value:"0.1"},description:"",name:"gravity",required:!1,type:{name:"number | undefined"}},windForce:{defaultValue:{value:"0.05"},description:"",name:"windForce",required:!1,type:{name:"number | undefined"}},bounceEnabled:{defaultValue:{value:"true"},description:"",name:"bounceEnabled",required:!1,type:{name:"boolean | undefined"}},fadeOut:{defaultValue:{value:"true"},description:"",name:"fadeOut",required:!1,type:{name:"boolean | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},realTimeMode:{defaultValue:{value:"false"},description:"",name:"realTimeMode",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:{value:"true"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},demoState:{defaultValue:{value:"active"},description:'Starts the reaction field with a visible, package-owned demo state.\nUse `"idle"` when an empty field is required.',name:"demoState",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"active"'},{value:'"idle"'}]}},autoplay:{defaultValue:null,description:'Alias for `demoState="active"` for docs/catalog previews.',name:"autoplay",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},onReactionAdd:{defaultValue:null,description:"",name:"onReactionAdd",required:!1,type:{name:"((emoji: string, x?: number | undefined, y?: number | undefined) => void) | undefined"}},onReactionClick:{defaultValue:null,description:"",name:"onReactionClick",required:!1,type:{name:"((reaction: ReactionBubble) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const C=[{id:"1",emoji:"❤️",userId:"user1",userName:"Alice",userColor:"#FF6B6B",x:150,y:100,timestamp:Date.now()-1e3,size:35,velocity:{x:1,y:-.5},life:4e3,maxLife:5e3},{id:"2",emoji:"😂",userId:"user2",userName:"Bob",userColor:"#4ECDC4",x:300,y:200,timestamp:Date.now()-2e3,size:40,velocity:{x:-.5,y:-1},life:3e3,maxLife:5e3},{id:"3",emoji:"🎉",userId:"user3",userName:"Carol",userColor:"#45B7D1",x:450,y:150,timestamp:Date.now()-500,size:30,velocity:{x:.8,y:-1.2},life:4500,maxLife:5e3}],ze=["🚀","⚡","🌟","💎","🔥","🎊","🌈","✨"],Ke={title:"Workflows/Glass Reaction Bubbles",component:Q,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{width:{control:{type:"range",min:300,max:1e3,step:50}},height:{control:{type:"range",min:200,max:600,step:50}},bubbleLifetime:{control:{type:"range",min:1e3,max:1e4,step:500}},maxBubbles:{control:{type:"range",min:10,max:100,step:10}},gravity:{control:{type:"range",min:0,max:1,step:.05}},windForce:{control:{type:"range",min:0,max:.5,step:.01}}}},B={args:{width:600,height:400,reactions:C,showControls:!0,showUserNames:!0,interactive:!0}},F={args:{width:700,height:450,realTimeMode:!0,showControls:!0,showUserNames:!0,interactive:!0,soundEnabled:!0}},R={args:{width:600,height:400,availableEmojis:ze,showControls:!0,showUserNames:!0,interactive:!0}},E={args:{width:600,height:400,reactions:C,showControls:!1,showUserNames:!0,interactive:!1}},T={args:{width:400,height:300,reactions:C.slice(0,2),showControls:!0,showUserNames:!1,interactive:!0}},L={args:{width:900,height:600,reactions:C,showControls:!0,showUserNames:!0,interactive:!0,realTimeMode:!0}},V={args:{width:600,height:400,gravity:.5,windForce:.1,showControls:!0,interactive:!0,realTimeMode:!0}},k={args:{width:600,height:400,gravity:.02,windForce:.02,showControls:!0,interactive:!0,realTimeMode:!0}},q={args:{width:600,height:400,bounceEnabled:!1,gravity:.1,windForce:.05,showControls:!0,interactive:!0,realTimeMode:!0}},U={args:{width:600,height:400,bubbleLifetime:1e4,showControls:!0,interactive:!0,realTimeMode:!0}},D={args:{width:600,height:400,bubbleLifetime:2e3,showControls:!0,interactive:!0,realTimeMode:!0}},I={args:{width:800,height:500,maxBubbles:100,showControls:!0,interactive:!0,realTimeMode:!0}},z={args:{width:600,height:400,maxBubbles:15,showControls:!0,interactive:!0,realTimeMode:!0}},A={args:{width:600,height:400,fadeOut:!1,showControls:!0,interactive:!0,realTimeMode:!0}},O={args:{width:600,height:400,windForce:.2,gravity:.05,showControls:!0,interactive:!0,realTimeMode:!0}},_={args:{width:600,height:400,soundEnabled:!1,showControls:!0,interactive:!0,realTimeMode:!0}},G={args:{width:600,height:400,reactions:C,interactive:!1,showControls:!1,showUserNames:!0}},W={args:{width:800,height:500,availableEmojis:["🌪️","⚡","🌊","🔥","❄️","🌟"],realTimeMode:!0,maxBubbles:80,gravity:.3,windForce:.15,showControls:!0,interactive:!0}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    reactions: mockReactions,
    showControls: true,
    showUserNames: true,
    interactive: true
  }
}`,...B.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 450,
    realTimeMode: true,
    showControls: true,
    showUserNames: true,
    interactive: true,
    soundEnabled: true
  }
}`,...F.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    availableEmojis: customEmojis,
    showControls: true,
    showUserNames: true,
    interactive: true
  }
}`,...R.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    reactions: mockReactions,
    showControls: false,
    showUserNames: true,
    interactive: false
  }
}`,...E.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 300,
    reactions: mockReactions.slice(0, 2),
    showControls: true,
    showUserNames: false,
    interactive: true
  }
}`,...T.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    width: 900,
    height: 600,
    reactions: mockReactions,
    showControls: true,
    showUserNames: true,
    interactive: true,
    realTimeMode: true
  }
}`,...L.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    gravity: 0.5,
    windForce: 0.1,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...V.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    gravity: 0.02,
    windForce: 0.02,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...k.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    bubbleLifetime: 10000,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...U.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    bubbleLifetime: 2000,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...D.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 500,
    maxBubbles: 100,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...I.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    maxBubbles: 15,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...z.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    fadeOut: false,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...A.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    windForce: 0.2,
    gravity: 0.05,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...O.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    soundEnabled: false,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,..._.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    reactions: mockReactions,
    interactive: false,
    showControls: false,
    showUserNames: true
  }
}`,...G.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}};const Qe=["Default","RealTimeMode","CustomEmojis","NoControls","CompactView","LargeCanvas","HighGravity","LowGravity","NoBounce","LongLifetime","ShortLifetime","ManyBubbles","FewBubbles","NoFadeOut","StrongWind","SilentMode","ReadOnlyMode","EmojiStorm"];export{T as CompactView,R as CustomEmojis,B as Default,W as EmojiStorm,z as FewBubbles,V as HighGravity,L as LargeCanvas,U as LongLifetime,k as LowGravity,I as ManyBubbles,q as NoBounce,E as NoControls,A as NoFadeOut,G as ReadOnlyMode,F as RealTimeMode,D as ShortLifetime,_ as SilentMode,O as StrongWind,Qe as __namedExportsOrder,Ke as default};
