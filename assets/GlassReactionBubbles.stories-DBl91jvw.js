import{r as u,b as xe,h as ve,j as t,e as Ce,m as h,c as r}from"./iframe-Ddb4tVEK.js";import{u as be}from"./soundDesign-BF6Mrk1X.js";import{u as je}from"./useMotionPreference-DAknDGJC.js";import{c as x}from"./createGlassStyle-BfWnO-qv.js";import{O as Ne}from"./OptimizedGlassCore-ac4MFqVE.js";import"./preload-helper-PPVm8Dsz.js";var Me={};const Be=["❤️","😀","😂","🎉","👏","🔥","💯","⭐","👍","👎","😍","🤔","😮","😢","💪","🙌"],ne=["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FECA57","#FF9FF3","#54A0FF","#5F27CD","#00D2D3","#FF9F43"],Y=u.forwardRef(({width:o=600,height:i=400,reactions:oe=[],availableEmojis:y=Be,showControls:X=!0,showUserNames:ie=!0,bubbleLifetime:A=5e3,maxBubbles:J=50,gravity:K=.1,windForce:Q=.05,bounceEnabled:Z=!0,fadeOut:le=!0,soundEnabled:ee=!0,realTimeMode:z=!1,interactive:G=!0,onReactionAdd:te,onReactionClick:se,className:ce="",...ue},de)=>{const p=xe(),[f,ae]=u.useState(oe),[C,me]=u.useState(y[0]),[Fe,Ee]=u.useState(!1),{play:re}=be();ve("glass-reaction-bubbles");const{shouldAnimate:g}=je(),$=u.useRef(),b=typeof process<"u"&&Me?.JEST_WORKER_ID!==void 0;$.current||($.current=()=>Math.random());const a=$.current;u.useEffect(()=>{if(b||!z)return;const e=setInterval(()=>{if(a()<.3){const s=y[Math.floor(a()*y.length)],n=a()*(o-40)+20,m=a()*(i-40)+20;w(s,n,m,`user-${Date.now()}`,"Anonymous")}},2e3);return()=>clearInterval(e)},[z,y,o,i]),u.useEffect(()=>{if(b||f.length===0)return;const e=requestAnimationFrame(()=>{ae(s=>s.map(n=>{const m=n.life-16;if(m<=0)return null;const d={...n.velocity};d.y+=K,d.x+=(a()-.5)*Q;let l=n.x+d.x,c=n.y+d.y;return Z?((l<=0||l>=o-40)&&(d.x*=-.7,l=Math.max(0,Math.min(o-40,l))),(c<=0||c>=i-40)&&(d.y*=-.7,c=Math.max(0,Math.min(i-40,c)))):(l<-40&&(l=o),l>o&&(l=-40),c<-40&&(c=i),c>i&&(c=-40)),{...n,x:l,y:c,velocity:d,life:m}}).filter(n=>n!==null))});return()=>cancelAnimationFrame(e)},[f,K,Q,Z,o,i]);const w=u.useCallback((e,s,n,m,d)=>{const l={id:`reaction-${Date.now()}-${a()}`,emoji:e,userId:m||"current",userName:d||"You",userColor:ne[Math.floor(a()*ne.length)],x:s??a()*(o-40)+20,y:n??a()*(i-40)+20,timestamp:Date.now(),size:30+a()*20,velocity:{x:(a()-.5)*4,y:(a()-.5)*4-2},life:A,maxLife:A};ae(c=>[...c,l].slice(-J)),ee&&re("notification"),te?.(e,l.x,l.y)},[o,i,A,J,ee,re,te]),pe=u.useCallback(e=>{if(!G)return;const s=e.currentTarget.getBoundingClientRect(),n=e.clientX-s.left,m=e.clientY-s.top;w(C,n,m)},[G,C,w]),ge=u.useCallback((e,s)=>{s.stopPropagation(),se?.(e);for(let n=0;n<3;n++)w(e.emoji,e.x+(a()-.5)*20,e.y+(a()-.5)*20)},[se,w]),he=e=>le?Math.max(.1,e.life/e.maxLife):1,P=e=>{const s=1-e.life/e.maxLife;return .8+Math.sin(s*Math.PI)*.4},fe=({bubble:e})=>t.jsx(h.div,{className:r("glass-absolute glass-cursor-pointer glass-select-none glass-z-10"),style:{left:e.x,top:e.y,fontSize:e.size||30},initial:{scale:0,opacity:0},animate:p?{}:{scale:P(e),opacity:he(e),rotate:Math.sin(Date.now()/1e3+e.timestamp)*10},exit:{scale:0,opacity:0,y:e.y-50},transition:g?{type:"spring",stiffness:300,damping:20}:{duration:0},onClick:s=>ge(e,s),whileHover:{scale:P(e)*1.1},whileTap:{scale:P(e)*.9},children:t.jsxs("div",{className:`
          relative inline-flex items-center justify-center rounded-full
          ${x({blur:"sm",opacity:.8}).background}
          border border-white/20
        `,children:[t.jsx("span",{className:r("glass-text-2xl"),children:e.emoji}),ie&&t.jsx(h.div,{className:r("glass-absolute glass-bottom-8-neg glass-left-1/2 glass-transform glass-translate-x-1/2-neg"),initial:{opacity:0,y:10},animate:p?{}:{opacity:.8,y:0},exit:{opacity:0,y:10},transition:g?{delay:.2}:{duration:0},children:t.jsx("div",{className:`
                px-2 py-1 text-xs font-medium text-white rounded
                ${x({blur:"sm",opacity:.8}).background}
                border border-white/20 whitespace-nowrap
              `,children:e.userName})}),t.jsx(h.div,{className:r("glass-absolute glass-inset-0 glass-radius-full"),style:{background:`radial-gradient(circle, ${e.userColor||"#FF6B6B"}40 0%, transparent 70%)`},animate:p?{}:{scale:[1,1.5,1],opacity:[.3,.1,.3]},transition:g?{duration:2,repeat:1/0,ease:"easeInOut"}:{duration:0}})]})}),ye=()=>t.jsx(h.div,{className:`
          flex flex-wrap gap-2 p-3 rounded-lg max-w-xs
          ${x({blur:"sm",opacity:.8}).background}
        `,initial:{opacity:0,y:20},animate:p?{}:{opacity:1,y:0},transition:g?{duration:.3}:{duration:0},children:y.map(e=>t.jsx("button",{onClick:()=>me(e),className:`
              w-10 h-10 rounded-lg flex items-center justify-center text-xl
              transition-all duration-200 hover:scale-110
              glass-focus glass-touch-target glass-contrast-guard
              ${C===e?"bg-white/20 ring-2 ring-blue-400/50":"hover:bg-white/10"}
            `,children:e},e))}),H={totalReactions:f.length,recentReactions:f.filter(e=>Date.now()-e.timestamp<5e3).length,mostUsedEmoji:f.reduce((e,s)=>(e[s.emoji]=(e[s.emoji]||0)+1,e),{})},W=Object.entries(H.mostUsedEmoji).sort(([,e],[,s])=>s-e)[0],we=u.useMemo(()=>b?Array.from({length:5},(e,s)=>({left:o/6*(s+1),top:i/6*(s+1),duration:3+s*.25,delay:s*.2})):Array.from({length:5},()=>({left:a()*o,top:a()*i,duration:3+a()*2,delay:a()*2})),[i,b,a,o]);return t.jsxs(Ne,{ref:de,intensity:"subtle",className:r("glass-relative glass-overflow-hidden",ce),style:{width:o,height:i},...ue,children:[t.jsxs("div",{className:r("glass-absolute glass-inset-0 glass-cursor-crosshair"),onClick:pe,style:{width:o,height:i},children:[t.jsx(Ce,{children:f.map(e=>t.jsx(fe,{bubble:e},e.id))}),we.map((e,s)=>t.jsx(h.div,{className:r("glass-absolute glass-w-2 glass-h-2 glass-surface-muted glass-radius-full"),style:{left:e.left,top:e.top},animate:p?{}:{y:[0,-20,0],opacity:[.2,.8,.2],scale:[.5,1,.5]},transition:g?{duration:e.duration,repeat:1/0,delay:e.delay,ease:"easeInOut"}:{duration:0}},s))]}),X&&t.jsx("div",{className:r("glass-absolute glass-top-4 glass-left-4 glass-z-20"),children:t.jsx(ye,{})}),t.jsx(h.div,{className:`
            absolute top-4 right-4 z-20 p-3 rounded-lg
            ${x({blur:"sm",opacity:.8}).background}
          `,initial:{opacity:0,x:20},animate:p?{}:{opacity:1,x:0},transition:g?{delay:.5}:{duration:0},children:t.jsxs("div",{className:r("glass-text-sm glass-text-secondary glass-space-y-1"),children:[t.jsxs("div",{className:r("glass-flex glass-items-center glass-space-x-2"),children:[t.jsx("span",{children:H.totalReactions}),t.jsx("span",{className:r("glass-text-muted"),children:"total"})]}),t.jsxs("div",{className:r("glass-flex glass-items-center glass-space-x-2"),children:[t.jsx("span",{children:H.recentReactions}),t.jsx("span",{className:r("glass-text-muted"),children:"recent"})]}),W&&t.jsxs("div",{className:r("glass-flex glass-items-center glass-space-x-2"),children:[t.jsx("span",{children:W[0]}),t.jsxs("span",{className:r("glass-text-muted"),children:[W[1],"x"]})]})]})}),G&&X&&t.jsxs(h.div,{className:`
              absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20
              px-4 py-2 rounded-lg text-sm text-white/70
              ${x({blur:"sm",opacity:.8}).background}
            `,initial:{opacity:0,y:20},animate:p?{}:{opacity:1,y:0},transition:g?{delay:1}:{duration:0},children:["Click anywhere to add ",C," • Click bubbles to multiply them"]}),z&&t.jsxs("div",{className:r("glass-absolute glass-bottom-4 glass-right-4 glass-z-20 glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-text-muted"),children:[t.jsx("div",{className:r("glass-w-2 glass-h-2 glass-surface-success glass-radius-full")}),t.jsx("span",{children:"Live reactions"})]})]})});try{Y.displayName="GlassReactionBubbles",Y.__docgenInfo={description:"",displayName:"GlassReactionBubbles",props:{width:{defaultValue:{value:"600"},description:"",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"400"},description:"",name:"height",required:!1,type:{name:"number | undefined"}},reactions:{defaultValue:{value:"[]"},description:"",name:"reactions",required:!1,type:{name:"ReactionBubble[] | undefined"}},availableEmojis:{defaultValue:{value:`[
  '❤️', '😀', '😂', '🎉', '👏', '🔥', '💯', '⭐',
  '👍', '👎', '😍', '🤔', '😮', '😢', '💪', '🙌'
]`},description:"",name:"availableEmojis",required:!1,type:{name:"string[] | undefined"}},showControls:{defaultValue:{value:"true"},description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showUserNames:{defaultValue:{value:"true"},description:"",name:"showUserNames",required:!1,type:{name:"boolean | undefined"}},bubbleLifetime:{defaultValue:{value:"5000"},description:"",name:"bubbleLifetime",required:!1,type:{name:"number | undefined"}},maxBubbles:{defaultValue:{value:"50"},description:"",name:"maxBubbles",required:!1,type:{name:"number | undefined"}},gravity:{defaultValue:{value:"0.1"},description:"",name:"gravity",required:!1,type:{name:"number | undefined"}},windForce:{defaultValue:{value:"0.05"},description:"",name:"windForce",required:!1,type:{name:"number | undefined"}},bounceEnabled:{defaultValue:{value:"true"},description:"",name:"bounceEnabled",required:!1,type:{name:"boolean | undefined"}},fadeOut:{defaultValue:{value:"true"},description:"",name:"fadeOut",required:!1,type:{name:"boolean | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},realTimeMode:{defaultValue:{value:"false"},description:"",name:"realTimeMode",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:{value:"true"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},onReactionAdd:{defaultValue:null,description:"",name:"onReactionAdd",required:!1,type:{name:"((emoji: string, x?: number | undefined, y?: number | undefined) => void) | undefined"}},onReactionClick:{defaultValue:null,description:"",name:"onReactionClick",required:!1,type:{name:"((reaction: ReactionBubble) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const v=[{id:"1",emoji:"❤️",userId:"user1",userName:"Alice",userColor:"#FF6B6B",x:150,y:100,timestamp:Date.now()-1e3,size:35,velocity:{x:1,y:-.5},life:4e3,maxLife:5e3},{id:"2",emoji:"😂",userId:"user2",userName:"Bob",userColor:"#4ECDC4",x:300,y:200,timestamp:Date.now()-2e3,size:40,velocity:{x:-.5,y:-1},life:3e3,maxLife:5e3},{id:"3",emoji:"🎉",userId:"user3",userName:"Carol",userColor:"#45B7D1",x:450,y:150,timestamp:Date.now()-500,size:30,velocity:{x:.8,y:-1.2},life:4500,maxLife:5e3}],Se=["🚀","⚡","🌟","💎","🔥","🎊","🌈","✨"],De={title:"Glass UI/Social/GlassReactionBubbles",component:Y,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{width:{control:{type:"range",min:300,max:1e3,step:50}},height:{control:{type:"range",min:200,max:600,step:50}},bubbleLifetime:{control:{type:"range",min:1e3,max:1e4,step:500}},maxBubbles:{control:{type:"range",min:10,max:100,step:10}},gravity:{control:{type:"range",min:0,max:1,step:.05}},windForce:{control:{type:"range",min:0,max:.5,step:.01}}}},j={args:{width:600,height:400,reactions:v,showControls:!0,showUserNames:!0,interactive:!0}},N={args:{width:700,height:450,realTimeMode:!0,showControls:!0,showUserNames:!0,interactive:!0,soundEnabled:!0}},M={args:{width:600,height:400,availableEmojis:Se,showControls:!0,showUserNames:!0,interactive:!0}},B={args:{width:600,height:400,reactions:v,showControls:!1,showUserNames:!0,interactive:!1}},S={args:{width:400,height:300,reactions:v.slice(0,2),showControls:!0,showUserNames:!1,interactive:!0}},F={args:{width:900,height:600,reactions:v,showControls:!0,showUserNames:!0,interactive:!0,realTimeMode:!0}},E={args:{width:600,height:400,gravity:.5,windForce:.1,showControls:!0,interactive:!0,realTimeMode:!0}},R={args:{width:600,height:400,gravity:.02,windForce:.02,showControls:!0,interactive:!0,realTimeMode:!0}},T={args:{width:600,height:400,bounceEnabled:!1,gravity:.1,windForce:.05,showControls:!0,interactive:!0,realTimeMode:!0}},k={args:{width:600,height:400,bubbleLifetime:1e4,showControls:!0,interactive:!0,realTimeMode:!0}},L={args:{width:600,height:400,bubbleLifetime:2e3,showControls:!0,interactive:!0,realTimeMode:!0}},V={args:{width:800,height:500,maxBubbles:100,showControls:!0,interactive:!0,realTimeMode:!0}},U={args:{width:600,height:400,maxBubbles:15,showControls:!0,interactive:!0,realTimeMode:!0}},q={args:{width:600,height:400,fadeOut:!1,showControls:!0,interactive:!0,realTimeMode:!0}},D={args:{width:600,height:400,windForce:.2,gravity:.05,showControls:!0,interactive:!0,realTimeMode:!0}},I={args:{width:600,height:400,soundEnabled:!1,showControls:!0,interactive:!0,realTimeMode:!0}},O={args:{width:600,height:400,reactions:v,interactive:!1,showControls:!1,showUserNames:!0}},_={args:{width:800,height:500,availableEmojis:["🌪️","⚡","🌊","🔥","❄️","🌟"],realTimeMode:!0,maxBubbles:80,gravity:.3,windForce:.15,showControls:!0,interactive:!0}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 300,
    reactions: mockReactions.slice(0, 2),
    showControls: true,
    showUserNames: false,
    interactive: true
  }
}`,...S.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    width: 900,
    height: 600,
    reactions: mockReactions,
    showControls: true,
    showUserNames: true,
    interactive: true,
    realTimeMode: true
  }
}`,...F.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    gravity: 0.5,
    windForce: 0.1,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...E.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    gravity: 0.02,
    windForce: 0.02,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...R.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    bubbleLifetime: 10000,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...k.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    bubbleLifetime: 2000,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...L.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 500,
    maxBubbles: 100,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...V.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    maxBubbles: 15,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...U.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    fadeOut: false,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...q.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    windForce: 0.2,
    gravity: 0.05,
    showControls: true,
    interactive: true,
    realTimeMode: true
  }
}`,...D.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};const Ie=["Default","RealTimeMode","CustomEmojis","NoControls","CompactView","LargeCanvas","HighGravity","LowGravity","NoBounce","LongLifetime","ShortLifetime","ManyBubbles","FewBubbles","NoFadeOut","StrongWind","SilentMode","ReadOnlyMode","EmojiStorm"];export{S as CompactView,M as CustomEmojis,j as Default,_ as EmojiStorm,U as FewBubbles,E as HighGravity,F as LargeCanvas,k as LongLifetime,R as LowGravity,V as ManyBubbles,T as NoBounce,B as NoControls,q as NoFadeOut,O as ReadOnlyMode,N as RealTimeMode,L as ShortLifetime,I as SilentMode,D as StrongWind,Ie as __namedExportsOrder,De as default};
