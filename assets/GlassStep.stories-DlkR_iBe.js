import{r as N,j as r,c as _}from"./iframe-C2Py7iTP.js";import{G as j}from"./GlassStepIcon-Bx3jNIBE.js";import{G as k}from"./GlassStepLabel-xq6Jdhl9.js";import{M as $}from"./MotionFramer-Bqa_dH4n.js";import{O as w}from"./OptimizedGlassCore-xEcyrF8U.js";import"./preload-helper-PPVm8Dsz.js";import"./check-Ck9kkIKS.js";import"./createLucideIcon-DYSTPsPi.js";import"./utilsCore-DHlzAtb4.js";const z=(t,a,e,s)=>{const o=["flex items-center relative flex-1 glass-p-2 transition-all duration-300 ease-in-out",s&&!e?"cursor-pointer hover:bg-glass-light-primary/5 glass-hover-scale-1-01":"cursor-default"];return e&&o.push("opacity-50 pointer-events-none"),o.filter(Boolean).join(" ")},D=t=>t==="vertical"?"flex-col text-center":"flex-row text-left",i=N.forwardRef(({step:t,index:a,active:e,completed:s,orientation:o,onClick:c,intent:m="neutral",elevation:f="level1",tier:v="medium",className:b,style:h},V)=>{const p=!!c,y=o||"horizontal",C={id:`step-${a}`,title:`Step ${a+1}`,label:`Step ${a+1}`,disabled:!0},n=t??C,l=n.disabled??!1,x=n.label||n.title,S=()=>{c&&!l&&c(n)},G=z(e,s,l,p),q=D(y);return r.jsx($,{"data-glass-component":!0,children:r.jsxs(w,{ref:V,intent:m,elevation:f,tier:v,className:_(G,q,b),style:{...h||{}},onClick:S,role:p?"button":"listitem","aria-label":`Step ${a+1}: ${x}${e?" (current)":""}${s?" (completed)":""}${l?" (disabled)":""}`,"aria-current":e?"step":void 0,"aria-disabled":l,tabIndex:p&&!l?0:-1,onKeyDown:p&&!l?g=>{(g.key==="Enter"||g.key===" ")&&(g.preventDefault(),S())}:void 0,children:[r.jsx(j,{index:a,active:e,completed:s,icon:n.icon,intent:m,elevation:f,tier:v}),r.jsx(k,{label:x,active:e,completed:s,orientation:y,intent:m,elevation:f,tier:v})]})})});i.displayName="GlassStep";try{i.displayName="GlassStep",i.__docgenInfo={description:"",displayName:"GlassStep",props:{step:{defaultValue:null,description:"",name:"step",required:!1,type:{name:"Step | undefined"}},index:{defaultValue:null,description:"",name:"index",required:!0,type:{name:"number"}},active:{defaultValue:null,description:"",name:"active",required:!0,type:{name:"boolean"}},completed:{defaultValue:null,description:"",name:"completed",required:!0,type:{name:"boolean"}},orientation:{defaultValue:null,description:"",name:"orientation",required:!0,type:{name:"enum",value:[{value:'"horizontal"'},{value:'"vertical"'}]}},clickable:{defaultValue:null,description:"",name:"clickable",required:!1,type:{name:"boolean | undefined"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"((step: Step) => void) | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},intent:{defaultValue:{value:"neutral"},description:"Glass surface intent",name:"intent",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"neutral"'},{value:'"primary"'},{value:'"success"'},{value:'"warning"'},{value:'"danger"'},{value:'"info"'}]}},elevation:{defaultValue:{value:"level1"},description:"Glass surface elevation",name:"elevation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"level1"'},{value:'"level2"'},{value:'"level3"'},{value:'"level4"'}]}},tier:{defaultValue:{value:"medium"},description:"Performance tier",name:"tier",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"low"'},{value:'"medium"'},{value:'"high"'}]}}}}}catch{}const A={title:"Components/Input/GlassStep",component:i,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassstep component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},u={args:{step:{id:"step1",title:"Step 1",description:"First step in the process",completed:!1,active:!0},index:0,active:!0,completed:!1,orientation:"horizontal"}},d={render:t=>r.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:r.jsx(i,{...t})}),args:{step:{id:"completed-step",title:"Completed Step",description:"This step is done",completed:!0},index:1,active:!1,completed:!0,orientation:"horizontal"}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    step: {
      id: 'step1',
      title: 'Step 1',
      description: 'First step in the process',
      completed: false,
      active: true
    },
    index: 0,
    active: true,
    completed: false,
    orientation: 'horizontal'
  }
}`,...u.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassStep {...args} />
    </div>,
  args: {
    step: {
      id: 'completed-step',
      title: 'Completed Step',
      description: 'This step is done',
      completed: true
    },
    index: 1,
    active: false,
    completed: true,
    orientation: 'horizontal'
  }
}`,...d.parameters?.docs?.source}}};const B=["Default","Variants"];export{u as Default,d as Variants,B as __namedExportsOrder,A as default};
