import{r as p,b as H,a as $,R as O,c as h,j as e}from"./iframe-Cqi-9gHA.js";import{u as T}from"./MotionPreferenceContext-Da-updIo.js";import{u as z}from"./a11y-DBBBNlGj.js";import{O as F}from"./OptimizedGlassCore-CWgizUMZ.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-DlsmEFaF.js";const U="_container_12o4q_25",X="_gradientLayer_12o4q_38",Y="_gradientInteractive_12o4q_51",J="_animateGradient_12o4q_55",K="_atmosphericEffect_12o4q_62",Q="_animateClouds_12o4q_73",Z="_blurLayer_12o4q_80",ee="_contentLayer_12o4q_86",ae="_reduceMotion_12o4q_165",s={container:U,gradientLayer:X,gradientInteractive:Y,animateGradient:J,atmosphericEffect:K,animateClouds:Q,blurLayer:Z,contentLayer:ee,reduceMotion:ae},se=["rgba(255, 255, 255, 0.28)","rgba(241, 245, 249, 0.22)","rgba(226, 232, 240, 0.18)","rgba(255, 255, 255, 0.12)"],ne=(l,n)=>{const{children:o,className:w,style:_,baseColor:k="rgba(226, 232, 240, 0.72)",gradientColors:b=se,intensity:C=.7,animate:d=!0,animationDuration:N=H.DURATION.slower/1e3,interactive:t=!1,blur:te=!1,blurAmount:re=5,intent:q="neutral",elevation:A="level2",tier:j="medium",respectMotionPreference:V=!0,...M}=l,B=z("atmospheric-bg"),L=$(),{prefersReducedMotion:R}=T(),a=V&&(L||R),v=O.Children.count(o)===0,[y,S]=p.useState({x:50,y:50}),c=p.useRef(null);p.useEffect(()=>{if(!t||a)return;const r=x=>{if(!c.current)return;const u=c.current.getBoundingClientRect(),G=(x.clientX-u.left)/u.width*100,W=(x.clientY-u.top)/u.height*100;S({x:G,y:W})};if(!(typeof window>"u"))return window.addEventListener("mousemove",r,{passive:!0}),()=>{window.removeEventListener("mousemove",r)}},[t,a]);const E=r=>{c.current!==r&&(c.current=r),typeof n=="function"?n(r):n&&(n.current=r)},f={backgroundColor:k,backgroundImage:`linear-gradient(125deg, ${b.join(", ")})`,opacity:C};t&&!a&&(f.backgroundPosition=`${50+(y.x-50)*.2}% ${50+(y.y-50)*.2}%`),d&&!a&&!t&&(f["--atmosphere-gradient-duration"]=`${N}s`);const I=h(s.gradientLayer,t&&!a&&s.gradientInteractive,d&&!a&&!t&&s.animateGradient,a&&s.reduceMotion),D=h(s.atmosphericEffect,d&&!a&&s.animateClouds,a&&s.reduceMotion),P={};return e.jsxs(F,{ref:E,intent:q,elevation:A,tier:j,className:h("glass-atmospheric-background",s.container,w),style:{..._||{}},id:B,role:v?"img":void 0,"aria-label":v?`Atmospheric background with ${d&&!a?"animated":"static"} ${b.length} color gradient`:void 0,tabIndex:t?0:void 0,...M,children:[e.jsx("div",{className:I,style:{...f},"aria-hidden":"true"}),e.jsx("div",{className:D,"aria-hidden":"true"}),e.jsx("div",{className:s.blurLayer,style:{...P},"aria-hidden":"true"}),e.jsx("div",{className:s.contentLayer,children:o})]})},i=p.forwardRef(ne);i.displayName="AtmosphericBackground";try{i.displayName="AtmosphericBackground",i.__docgenInfo={description:`AtmosphericBackground Component

A dynamic background component with atmospheric effects.`,displayName:"AtmosphericBackground",props:{variant:{defaultValue:null,description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"clear"'},{value:'"cloudy"'},{value:'"rainy"'},{value:'"stormy"'},{value:'"foggy"'},{value:'"sunny"'}]}},intensity:{defaultValue:null,description:"",name:"intensity",required:!1,type:{name:"number | undefined"}},animated:{defaultValue:null,description:"",name:"animated",required:!1,type:{name:"boolean | undefined"}},animate:{defaultValue:null,description:"",name:"animate",required:!1,type:{name:"boolean | undefined"}},particleCount:{defaultValue:null,description:"",name:"particleCount",required:!1,type:{name:"number | undefined"}},colorScheme:{defaultValue:null,description:"",name:"colorScheme",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"day"'},{value:'"night"'},{value:'"dusk"'},{value:'"dawn"'}]}},weather:{defaultValue:null,description:"",name:"weather",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"cloudy"'},{value:'"rainy"'},{value:'"foggy"'},{value:'"sunny"'},{value:'"snowy"'}]}},baseColor:{defaultValue:null,description:"",name:"baseColor",required:!1,type:{name:"string | undefined"}},gradientColors:{defaultValue:null,description:"",name:"gradientColors",required:!1,type:{name:"string[] | undefined"}},animationDuration:{defaultValue:null,description:"",name:"animationDuration",required:!1,type:{name:"number | undefined"}},interactive:{defaultValue:null,description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},blur:{defaultValue:null,description:"",name:"blur",required:!1,type:{name:"boolean | undefined"}},blurAmount:{defaultValue:null,description:"",name:"blurAmount",required:!1,type:{name:"number | undefined"}},intent:{defaultValue:null,description:"Glass surface intent",name:"intent",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"primary"'},{value:'"neutral"'},{value:'"success"'},{value:'"warning"'},{value:'"danger"'},{value:'"info"'}]}},elevation:{defaultValue:null,description:"Glass surface elevation",name:"elevation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"level1"'},{value:'"level2"'},{value:'"level3"'},{value:'"level4"'}]}},tier:{defaultValue:null,description:"Performance tier",name:"tier",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"high"'},{value:'"low"'}]}},respectMotionPreference:{defaultValue:null,description:"If true, respects user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const me={title:"Effects + Advanced/Atmospheric Background",component:i,parameters:{layout:"fullscreen",previewSurface:"component",docs:{description:{component:"Atmospheric background constrained to a readable media-style composition."}}},argTypes:{className:{control:"text",description:"Custom CSS class name"},variant:{control:{type:"select"},options:["clear","cloudy","rainy","stormy","foggy","sunny"],description:"Atmospheric variant"},intensity:{control:{type:"number",min:0,max:1,step:.1},description:"Effect intensity"},animate:{control:"boolean",description:"Enable animations"}},args:{className:"",variant:"clear",intensity:.5,animate:!1}},m={render:l=>e.jsx(i,{...l,className:"glass-w-full glass-flex glass-items-center glass-justify-center",style:{minHeight:"min(100vh, 760px)"},baseColor:"rgba(226, 232, 240, 0.72)",gradientColors:["rgba(255, 255, 255, 0.28)","rgba(241, 245, 249, 0.22)","rgba(226, 232, 240, 0.18)"],animate:!1,children:e.jsxs("section",{className:"glass-w-full glass-max-w-3xl glass-rounded-2xl glass-p-8 glass-shadow-2xl glass-backdrop-blur-md",style:{width:"min(calc(100vw - 48px), 48rem)",maxWidth:"100%",minWidth:0,color:"#0f172a",background:"rgba(255,255,255,.24)"},children:[e.jsx("p",{className:"glass-text-sm glass-font-semibold glass-uppercase glass-tracking-wide",style:{color:"rgba(15, 23, 42, 0.94)"},children:"Atmospheric surface"}),e.jsx("h1",{className:"glass-mt-2 glass-font-semibold",style:{overflowWrap:"anywhere",wordBreak:"normal",color:"#0f172a",fontSize:"clamp(1.45rem, 7vw, 1.875rem)",lineHeight:1.1,maxWidth:"18ch"},children:"Command center backdrop"}),e.jsx("p",{className:"glass-mt-3 glass-max-w-2xl glass-text-sm",style:{color:"rgba(51, 65, 85, 0.92)"},children:"Foreground panels remain legible while the background demonstrates depth and color."})]})}),args:{variant:"clear",intensity:.5,animate:!1}},g={render:l=>e.jsx("div",{className:"glass-grid glass-w-full glass-gap-4 glass-p-6",style:{gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 220px), 1fr))",minHeight:"min(100vh, 760px)"},children:[["Dawn",["rgba(14, 165, 233, 0.44)","rgba(245, 158, 11, 0.28)"]],["Night",["rgba(37, 99, 235, 0.38)","rgba(124, 58, 237, 0.3)"]],["Signal",["rgba(20, 184, 166, 0.38)","rgba(16, 185, 129, 0.24)"]]].map(([n,o])=>e.jsx(i,{...l,gradientColors:o,className:"glass-min-h-[360px] glass-overflow-hidden glass-rounded-2xl glass-p-5 glass-flex glass-items-end",animate:!1,children:e.jsxs("div",{className:"glass-rounded-xl glass-bg-black/30 glass-p-4 glass-text-white glass-backdrop-blur-md",children:[e.jsx("h3",{className:"glass-text-base glass-font-semibold",children:n}),e.jsx("p",{className:"glass-mt-2 glass-text-sm glass-text-white/75",children:"Compact media tile with controlled contrast."})]})},n))}),args:{variant:"cloudy"}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <AtmosphericBackground {...args} className="glass-w-full glass-flex glass-items-center glass-justify-center" style={{
    minHeight: 'min(100vh, 760px)'
  }} baseColor="rgba(226, 232, 240, 0.72)" gradientColors={['rgba(255, 255, 255, 0.28)', 'rgba(241, 245, 249, 0.22)', 'rgba(226, 232, 240, 0.18)']} animate={false}>
      <section className="glass-w-full glass-max-w-3xl glass-rounded-2xl glass-p-8 glass-shadow-2xl glass-backdrop-blur-md" style={{
      width: 'min(calc(100vw - 48px), 48rem)',
      maxWidth: '100%',
      minWidth: 0,
      color: '#0f172a',
      background: 'rgba(255,255,255,.24)'
    }}>
        <p className="glass-text-sm glass-font-semibold glass-uppercase glass-tracking-wide" style={{
        color: 'rgba(15, 23, 42, 0.94)'
      }}>
          Atmospheric surface
        </p>
        <h1 className="glass-mt-2 glass-font-semibold" style={{
        overflowWrap: 'anywhere',
        wordBreak: 'normal',
        color: '#0f172a',
        fontSize: 'clamp(1.45rem, 7vw, 1.875rem)',
        lineHeight: 1.1,
        maxWidth: '18ch'
      }}>
          Command center backdrop
        </h1>
        <p className="glass-mt-3 glass-max-w-2xl glass-text-sm" style={{
        color: 'rgba(51, 65, 85, 0.92)'
      }}>
          Foreground panels remain legible while the background demonstrates depth and color.
        </p>
      </section>
    </AtmosphericBackground>,
  args: {
    variant: 'clear',
    intensity: 0.5,
    animate: false
  }
}`,...m.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-w-full glass-gap-4 glass-p-6" style={{
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
    minHeight: 'min(100vh, 760px)'
  }}>
      {[['Dawn', ['rgba(14, 165, 233, 0.44)', 'rgba(245, 158, 11, 0.28)']], ['Night', ['rgba(37, 99, 235, 0.38)', 'rgba(124, 58, 237, 0.3)']], ['Signal', ['rgba(20, 184, 166, 0.38)', 'rgba(16, 185, 129, 0.24)']]].map(([label, colors]) => <AtmosphericBackground key={label as string} {...args} gradientColors={colors as string[]} className="glass-min-h-[360px] glass-overflow-hidden glass-rounded-2xl glass-p-5 glass-flex glass-items-end" animate={false}>
          <div className="glass-rounded-xl glass-bg-black/30 glass-p-4 glass-text-white glass-backdrop-blur-md">
            <h3 className="glass-text-base glass-font-semibold">{label as string}</h3>
            <p className="glass-mt-2 glass-text-sm glass-text-white/75">
              Compact media tile with controlled contrast.
            </p>
          </div>
        </AtmosphericBackground>)}
    </div>,
  args: {
    variant: 'cloudy'
  }
}`,...g.parameters?.docs?.source}}};const ge=["Default","Variants"];export{m as Default,g as Variants,ge as __namedExportsOrder,me as default};
