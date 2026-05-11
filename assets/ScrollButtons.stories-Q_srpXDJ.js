import{j as s}from"./iframe-CrdWMSIk.js";import{f as t}from"./index-CLSxArU-.js";import{S as g}from"./ScrollButtons-DgI5AWqj.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";const c={title:"Navigation/Scroll Buttons",component:g,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"Edge scroll buttons for horizontally overflowing tab and navigation rails."}}},args:{showLeft:!0,showRight:!0,onScrollLeft:t(),onScrollRight:t()}},e={render:r=>s.jsxs("div",{className:"glass-relative glass-w-[min(640px,calc(100vw-48px))] glass-overflow-hidden glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-5 glass-shadow-xl glass-backdrop-blur-xl",children:[s.jsx("div",{className:"glass-flex glass-gap-3 glass-overflow-x-auto glass-px-9",children:["Overview","Audience","Delivery","Creative","Budget","Review"].map(a=>s.jsx("span",{className:"glass-whitespace-nowrap glass-rounded-full glass-border glass-border-white/20 glass-bg-white/25 glass-px-4 glass-py-2 glass-text-sm glass-text-primary",children:a},a))}),s.jsx(g,{...r,className:"glass-bg-black/45 glass-text-white"})]})},l={args:{showLeft:!1,showRight:!0},render:r=>s.jsxs("div",{className:"glass-relative glass-w-[min(520px,calc(100vw-48px))] glass-overflow-hidden glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-5 glass-shadow-xl glass-backdrop-blur-xl",children:[s.jsx("div",{className:"glass-flex glass-gap-3 glass-overflow-x-auto glass-pr-9",children:["Roadmap","Launches","Incidents","Approvals"].map(a=>s.jsx("span",{className:"glass-whitespace-nowrap glass-rounded-full glass-border glass-border-white/20 glass-bg-white/25 glass-px-4 glass-py-2 glass-text-sm glass-text-primary",children:a},a))}),s.jsx(g,{...r,className:"glass-bg-black/45 glass-text-white"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-relative glass-w-[min(640px,calc(100vw-48px))] glass-overflow-hidden glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-5 glass-shadow-xl glass-backdrop-blur-xl">
      <div className="glass-flex glass-gap-3 glass-overflow-x-auto glass-px-9">
        {["Overview", "Audience", "Delivery", "Creative", "Budget", "Review"].map(item => <span key={item} className="glass-whitespace-nowrap glass-rounded-full glass-border glass-border-white/20 glass-bg-white/25 glass-px-4 glass-py-2 glass-text-sm glass-text-primary">
            {item}
          </span>)}
      </div>
      <ScrollButtons {...args} className="glass-bg-black/45 glass-text-white" />
    </div>
}`,...e.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    showLeft: false,
    showRight: true
  },
  render: args => <div className="glass-relative glass-w-[min(520px,calc(100vw-48px))] glass-overflow-hidden glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-5 glass-shadow-xl glass-backdrop-blur-xl">
      <div className="glass-flex glass-gap-3 glass-overflow-x-auto glass-pr-9">
        {["Roadmap", "Launches", "Incidents", "Approvals"].map(item => <span key={item} className="glass-whitespace-nowrap glass-rounded-full glass-border glass-border-white/20 glass-bg-white/25 glass-px-4 glass-py-2 glass-text-sm glass-text-primary">
            {item}
          </span>)}
      </div>
      <ScrollButtons {...args} className="glass-bg-black/45 glass-text-white" />
    </div>
}`,...l.parameters?.docs?.source}}};const m=["Default","RightOnly"];export{e as Default,l as RightOnly,m as __namedExportsOrder,c as default};
