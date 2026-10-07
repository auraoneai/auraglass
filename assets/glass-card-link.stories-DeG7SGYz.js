import{a as i,j as n,c as d}from"./iframe-Cqi-9gHA.js";import{M as p}from"./MotionFramer-CH53jSUC.js";import"./preload-helper-PPVm8Dsz.js";import"./utilsCore-iuxhMr4m.js";const t=({href:a,children:l,className:o,...c})=>(i(),n.jsx(p,{"data-glass-component":!0,className:"glass-inline-glass-block",children:n.jsx("a",{href:a,className:d("relative inline-block overflow-hidden glass-radius-xl","transition-all duration-300 ease-in-out","focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2","glass-focus glass-touch-target glass-contrast-guard",o),...c,children:l})}));try{t.displayName="GlassCardLink",t.__docgenInfo={description:"",displayName:"GlassCardLink",props:{href:{defaultValue:null,description:"",name:"href",required:!0,type:{name:"string"}}}}}catch{}try{glasscardlink.displayName="glasscardlink",glasscardlink.__docgenInfo={description:"",displayName:"glasscardlink",props:{href:{defaultValue:null,description:"",name:"href",required:!0,type:{name:"string"}}}}}catch{}const h={title:"Surfaces/Cards + Panels/glass card link",component:t,parameters:{layout:"centered",previewSurface:"component"},argTypes:{href:{control:{type:"text"}}}},s={render:a=>n.jsx("div",{className:"glass-neutral-level1 glass-rounded-2xl glass-p-8",children:n.jsx(t,{...a,children:"Glass glass-card-link"})}),args:{}},e={args:{...s.args,href:"https://example.com"}},r={args:{...s.args,href:"#","aria-disabled":!0}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-neutral-level1 glass-rounded-2xl glass-p-8">
      <GlassCardLink {...args}>Glass glass-card-link</GlassCardLink>
    </div>,
  args: {}
}`,...s.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    href: 'https://example.com'
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    href: '#',
    'aria-disabled': true
  }
}`,...r.parameters?.docs?.source}}};const _=["Default","WithCustomHref","Disabled"];export{s as Default,r as Disabled,e as WithCustomHref,_ as __namedExportsOrder,h as default};
