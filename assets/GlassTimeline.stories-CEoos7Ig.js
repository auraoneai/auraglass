import{r as z,j as e,c as a,C as i}from"./iframe-RsoZoStf.js";import{u as S}from"./a11y-WSL2JlLl.js";import{O as u}from"./OptimizedGlassCore-IzbAukgr.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-CB0YcTGX.js";const p={color:"var(--glass-theme-text, var(--glass-text-primary))"},C={...p,background:"linear-gradient(145deg, rgba(255,255,255,0.105) 0%, rgba(255,255,255,0.035) 52%, rgba(255,255,255,0.018) 100%)",backgroundColor:"rgba(255,255,255,0.018)",border:"1px solid rgba(255,255,255,0.18)",boxShadow:"inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 10px 28px rgba(15, 23, 42, 0.1)"},V=`.glass-timeline { width: 100%; max-width: 100%; box-sizing: border-box; }
.glass-timeline-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 16px; }
.glass-timeline-item { padding-left: 34px; min-width: 0; }
.glass-timeline-line { top: 18px; bottom: 18px; left: 10px; width: 2px; border-radius: 999px; }
.glass-timeline-dot { left: 5px; top: 18px; z-index: 2; box-sizing: border-box; }
.glass-timeline-card { min-width: 0; overflow: hidden; }
@media (max-width: 480px) {
  .glass-timeline-item { padding-left: 28px; }
  .glass-timeline-line { left: 8px; }
  .glass-timeline-dot { left: 3px; }
  .glass-timeline-card-row { display: grid; gap: 8px; }
  .glass-timeline-time { white-space: normal; }
}`,n=z.forwardRef(({items:t,variant:g="default",size:h="md",orientation:c="vertical",showLine:r=!0,timePosition:d="right",lineColor:v,dotColor:f,"aria-label":b,"data-testid":_,className:y,...j},N)=>{const w=S("timeline"),I={sm:{container:"",dot:"glass-w-2 glass-h-2",line:"",content:"glass-p-2 glass-text-sm",title:"glass-text-sm",subtitle:"glass-text-xs",time:"glass-text-xs",gap:"glass-gap-3"},md:{container:"",dot:"glass-w-3 glass-h-3",line:"",content:"glass-p-3 glass-text-base",title:"glass-text-base",subtitle:"glass-text-sm",time:"glass-text-xs",gap:"glass-gap-4"},lg:{container:"",dot:"glass-w-4 glass-h-4",line:"",content:"glass-p-4 glass-text-lg",title:"glass-text-lg",subtitle:"glass-text-base",time:"glass-text-sm",gap:"space-y-6"}},T={default:"glass-border-0",bordered:"glass-border glass-border-glass-border/20",compact:"glass-border-0"},l=I[h];return c==="horizontal"?e.jsxs("div",{"data-glass-component":!0,ref:N,id:w,className:a("glass-timeline glass-timeline-horizontal glass-relative glass-flex glass-items-start glass-gap-4 glass-overflow-x-auto",y),style:p,role:"list","aria-label":b||"Timeline",...j,children:[r&&e.jsx("div",{className:"glass-absolute glass-top-8 glass-left-0 glass-right-0 glass-h-px",style:{backgroundColor:v||"rgba(15, 23, 42, 0.2)"}}),t.map((s,q)=>e.jsxs("div",{className:"glass-relative glass-flex-shrink-0 glass-min-w-0",role:"listitem",children:[e.jsx("div",{className:a("glass-absolute top-6 left-1/2 -translate-x-1/2 glass-radius-full",l.dot),style:{backgroundColor:f||"var(--glass-theme-text-secondary, var(--glass-text-secondary))",border:"2px solid rgba(255, 255, 255, 0.9)",boxShadow:"0 0 0 3px rgba(15, 23, 42, 0.12)"}}),e.jsx("div",{className:"glass-pt-12",children:e.jsx(u,{elevation:"level1",intensity:"medium",depth:2,tint:"neutral",border:"subtle",animation:"none",performanceMode:"medium",className:a("glass-radius-lg max-w-xs glass-min-w-48",l.content,T[g]),style:C,children:e.jsxs("div",{className:"glass-min-w-0",children:[e.jsx("div",{className:a("glass-font-medium glass-text-primary glass-truncate",l.title),children:e.jsx(i,{children:s.title})}),s.subtitle&&e.jsx(i,{children:e.jsx("div",{className:a("glass-text-secondary glass-truncate glass-mt-1",l.subtitle),children:s.subtitle})}),s.time&&e.jsx(i,{children:e.jsx("div",{className:a("glass-text-secondary glass-mt-2",l.time),children:s.time})})]})})})]},s.id))]}):e.jsxs("div",{ref:N,id:w,"data-testid":_||"glasstimeline",className:a("glass-timeline glass-relative",l.container,y),style:p,"aria-label":b||"Timeline",...j,children:[r&&e.jsx("div",{className:a("glass-timeline-line glass-absolute top-0 bottom-0",l.line),style:{backgroundColor:v||"rgba(15, 23, 42, 0.2)"}}),e.jsx("ul",{className:a("glass-timeline-list glass-relative",l.gap),role:"list",children:t.map(s=>e.jsxs("li",{className:"glass-timeline-item glass-relative",role:"listitem",children:[e.jsx("span",{className:a("glass-timeline-dot glass-absolute glass-radius-full",l.dot),style:{backgroundColor:f||"var(--glass-theme-text-secondary, var(--glass-text-secondary))",border:"2px solid rgba(255, 255, 255, 0.92)",boxShadow:"0 0 0 3px rgba(15, 23, 42, 0.12)"}}),e.jsxs(u,{elevation:"level1",intensity:"medium",depth:2,tint:"neutral",border:"subtle",animation:"none",performanceMode:"medium",className:a("glass-timeline-card glass-radius-lg",l.content,T[g]),style:C,children:[e.jsxs("div",{className:"glass-timeline-card-row glass-flex glass-items-start glass-justify-between glass-gap-4",children:[e.jsxs("div",{className:"glass-flex glass-items-start glass-gap-3 glass-min-w-0 glass-flex-1",children:[s.icon&&e.jsx("div",{className:"glass-flex-shrink-0 glass-text-secondary glass-mt-0-5",children:s.icon}),e.jsxs("div",{className:"glass-min-w-0 glass-flex-1",children:[e.jsx("div",{className:a("glass-font-medium glass-text-primary",l.title),children:e.jsx(i,{children:s.title})}),s.subtitle&&e.jsx(i,{children:e.jsx("div",{className:a("glass-text-secondary glass-mt-1",l.subtitle),children:s.subtitle})})]})]}),s.time&&d==="right"&&e.jsx("div",{className:a("glass-timeline-time glass-text-secondary glass-whitespace-nowrap",l.time),children:e.jsx(i,{children:s.time})})]}),s.time&&d==="inline"&&e.jsx(i,{children:e.jsx("div",{className:a("glass-text-secondary glass-mt-2",l.time),children:s.time})})]})]},s.id))}),e.jsx("style",{children:V})]})});n.displayName="GlassTimeline";const x=z.forwardRef(({item:t,isLast:g=!1,size:h="md",className:c,...r},d)=>e.jsx("div",{ref:d,className:a("timeline-item",c),...r,children:e.jsxs(u,{elevation:"level1",intensity:"medium",depth:2,tint:"neutral",border:"subtle",animation:"none",performanceMode:"medium",className:"glass-radius-lg glass-p-3",children:[e.jsx(i,{children:e.jsx("div",{className:"glass-font-medium glass-text-primary",children:t.title})}),t.subtitle&&e.jsx(i,{children:e.jsx("div",{className:"glass-text-sm glass-text-secondary glass-mt-1",children:t.subtitle})}),t.time&&e.jsx(i,{children:e.jsx("div",{className:"glass-text-xs glass-text-secondary glass-mt-2",children:t.time})})]})}));x.displayName="TimelineItemComponent";try{n.displayName="GlassTimeline",n.__docgenInfo={description:`GlassTimeline component
A timeline component with glassmorphism styling for displaying chronological events`,displayName:"GlassTimeline",props:{items:{defaultValue:null,description:"Timeline items to display",name:"items",required:!0,type:{name:"TimelineItem[]"}},variant:{defaultValue:{value:"default"},description:"Timeline variant",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"compact"'},{value:'"bordered"'}]}},size:{defaultValue:{value:"md"},description:"Timeline size",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},orientation:{defaultValue:{value:"vertical"},description:"Timeline orientation",name:"orientation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"horizontal"'},{value:'"vertical"'}]}},showLine:{defaultValue:{value:"true"},description:"Whether to show connecting line",name:"showLine",required:!1,type:{name:"boolean | undefined"}},timePosition:{defaultValue:{value:"right"},description:"Position of time labels",name:"timePosition",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"left"'},{value:'"right"'},{value:'"inline"'}]}},lineColor:{defaultValue:null,description:"Custom connector line color",name:"lineColor",required:!1,type:{name:"string | undefined"}},dotColor:{defaultValue:null,description:"Custom dot color",name:"dotColor",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"ARIA label for the timeline",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}try{x.displayName="TimelineItemComponent",x.__docgenInfo={description:"",displayName:"TimelineItemComponent",props:{item:{defaultValue:null,description:"Timeline item data",name:"item",required:!0,type:{name:"TimelineItem"}},isLast:{defaultValue:{value:"false"},description:"Whether this is the last item",name:"isLast",required:!1,type:{name:"boolean | undefined"}},size:{defaultValue:{value:"md"},description:"Size variant",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}}}}}catch{}const D={title:"Data + Visualization/Glass Timeline",component:n,parameters:{layout:"fullscreen",previewSurface:"component",docs:{description:{component:"A glass morphism glasstimeline component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},o={decorators:[t=>e.jsx("main",{style:{minHeight:"100dvh",boxSizing:"border-box",display:"grid",placeItems:"center",padding:"clamp(16px, 5vw, 56px)"},children:e.jsx("div",{style:{width:"min(680px, 100%)",minWidth:0},children:e.jsx(t,{})})})],args:{items:[{id:"1",title:"Project Started",subtitle:"Initial setup completed",time:"2 hours ago"},{id:"2",title:"First Milestone",subtitle:"Core features implemented",time:"1 hour ago"},{id:"3",title:"Testing Phase",subtitle:"Bug fixes and optimizations",time:"30 min ago"}]}},m={render:t=>e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:e.jsx(n,{...t})}),args:{items:[{id:"1",title:"User Login",time:"5 min ago"},{id:"2",title:"Data Sync",time:"2 min ago"}]}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <main style={{
    minHeight: '100dvh',
    boxSizing: 'border-box',
    display: 'grid',
    placeItems: 'center',
    padding: 'clamp(16px, 5vw, 56px)'
  }}>
        <div style={{
      width: 'min(680px, 100%)',
      minWidth: 0
    }}><Story /></div>
      </main>],
  args: {
    items: [{
      id: '1',
      title: 'Project Started',
      subtitle: 'Initial setup completed',
      time: '2 hours ago'
    }, {
      id: '2',
      title: 'First Milestone',
      subtitle: 'Core features implemented',
      time: '1 hour ago'
    }, {
      id: '3',
      title: 'Testing Phase',
      subtitle: 'Bug fixes and optimizations',
      time: '30 min ago'
    }]
  }
}`,...o.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassTimeline {...args} />
    </div>,
  args: {
    items: [{
      id: '1',
      title: 'User Login',
      time: '5 min ago'
    }, {
      id: '2',
      title: 'Data Sync',
      time: '2 min ago'
    }]
  }
}`,...m.parameters?.docs?.source}}};const M=["Default","Variants"];export{o as Default,m as Variants,M as __namedExportsOrder,D as default};
