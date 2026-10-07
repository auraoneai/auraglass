import{j as s}from"./iframe-Cqi-9gHA.js";import{G as l}from"./GlassWipeSlider-CApX643T.js";import"./preload-helper-PPVm8Dsz.js";import"./useMotionPreference-fk1VFuMQ.js";import"./use-motion-value-ByrzuTwe.js";import"./use-spring-CpFTAR5U.js";import"./use-transform-D2AIRsYx.js";const m={title:"Reference/Legacy Components/Glass Wipe Slider",component:l,parameters:{layout:"padded",docs:{description:{component:"A glass morphism glasswipeslider component."}}},argTypes:{className:{control:"text",description:"className prop"},initialPosition:{control:{type:"range",min:0,max:100},description:"initial position prop"},orientation:{control:{type:"select"},options:["horizontal","vertical"],description:"orientation prop"}},args:{className:"",initialPosition:50,orientation:"horizontal"}},a={render:t=>s.jsx("div",{style:{width:"calc(100vw - 64px)",maxWidth:760,minWidth:0,margin:"auto"},children:s.jsx(l,{...t})}),args:{beforeContent:s.jsxs("div",{className:"glass-p-8 glass-text-center glass-radius-lg glass-flex glass-flex-col glass-items-center glass-justify-center",style:{width:"100%",height:"100%",boxSizing:"border-box",paddingLeft:"56%",color:"rgba(22,27,34,.94)",background:"linear-gradient(145deg, rgba(252,253,254,.98), rgba(215,220,227,.96))"},children:[s.jsx("p",{className:"glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide",children:"Original"}),s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-mb-2",children:"Soft daylight"}),s.jsx("p",{className:"glass-text-sm",children:"Neutral tonal range before refinement"})]}),afterContent:s.jsxs("div",{className:"glass-p-8 glass-text-center glass-radius-lg glass-flex glass-flex-col glass-items-center glass-justify-center",style:{width:"100%",height:"100%",boxSizing:"border-box",paddingRight:"56%",color:"rgba(22,27,34,.94)",background:"radial-gradient(circle at 25% 20%, rgba(255,255,255,.92), transparent 35%), linear-gradient(145deg, rgba(235,238,242,.98), rgba(181,188,198,.96))"},children:[s.jsx("p",{className:"glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide",children:"Refined"}),s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-mb-2",children:"Sculpted glass"}),s.jsx("p",{className:"glass-text-sm",children:"Balanced highlights and material depth"})]}),initialPosition:50}},e={render:t=>s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:s.jsx(l,{...t})}),args:{beforeContent:s.jsx("div",{className:"glass-p-4 glass-text-center glass-surface-red/20 glass-radius-md",children:s.jsx("span",{className:"glass-text-sm",children:"Before"})}),afterContent:s.jsx("div",{className:"glass-p-4 glass-text-center glass-surface-green/20 glass-radius-md",children:s.jsx("span",{className:"glass-text-sm",children:"After"})}),initialPosition:30}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    width: "calc(100vw - 64px)",
    maxWidth: 760,
    minWidth: 0,
    margin: "auto"
  }}>
      <GlassWipeSlider {...args} />
    </div>,
  args: {
    beforeContent: <div className="glass-p-8 glass-text-center glass-radius-lg glass-flex glass-flex-col glass-items-center glass-justify-center" style={{
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      paddingLeft: "56%",
      color: "rgba(22,27,34,.94)",
      background: "linear-gradient(145deg, rgba(252,253,254,.98), rgba(215,220,227,.96))"
    }}>
        <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide">
          Original
        </p>
        <h3 className="glass-text-xl glass-font-semibold glass-mb-2">
          Soft daylight
        </h3>
        <p className="glass-text-sm">Neutral tonal range before refinement</p>
      </div>,
    afterContent: <div className="glass-p-8 glass-text-center glass-radius-lg glass-flex glass-flex-col glass-items-center glass-justify-center" style={{
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      paddingRight: "56%",
      color: "rgba(22,27,34,.94)",
      background: "radial-gradient(circle at 25% 20%, rgba(255,255,255,.92), transparent 35%), linear-gradient(145deg, rgba(235,238,242,.98), rgba(181,188,198,.96))"
    }}>
        <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide">
          Refined
        </p>
        <h3 className="glass-text-xl glass-font-semibold glass-mb-2">
          Sculpted glass
        </h3>
        <p className="glass-text-sm">Balanced highlights and material depth</p>
      </div>,
    initialPosition: 50
  }
}`,...a.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassWipeSlider {...args} />
    </div>,
  args: {
    beforeContent: <div className="glass-p-4 glass-text-center glass-surface-red/20 glass-radius-md">
        <span className="glass-text-sm">Before</span>
      </div>,
    afterContent: <div className="glass-p-4 glass-text-center glass-surface-green/20 glass-radius-md">
        <span className="glass-text-sm">After</span>
      </div>,
    initialPosition: 30
  }
}`,...e.parameters?.docs?.source}}};const p=["Default","Variants"];export{a as Default,e as Variants,p as __namedExportsOrder,m as default};
