import{r as $,j as s,c,d as b}from"./iframe-DuFCckax.js";import{O as y}from"./OptimizedGlassCore-Dfu3jw2K.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-8v_R2xci.js";const z=`
  @keyframes skeleton-pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: var(--glass-opacity-60);
    }
  }

  @keyframes skeleton-wave {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`,B={background:"var(--glass-primary-level3-surface)",border:"1px solid rgba(148, 163, 184, 0.18)",boxShadow:"0 8px 20px rgba(2, 6, 23, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.06)"},T={background:"var(--glass-primary-level3-surface)",border:"1px solid rgba(148, 163, 184, 0.18)",boxShadow:"0 12px 28px rgba(2, 6, 23, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.06)"},a=$.forwardRef(({variant:e="text",width:t,height:d,animation:o="pulse",className:g,lines:h=1,spacing:S="0.5rem",...G},_)=>{const A=()=>{const m=typeof t=="number"?`${t}px`:t||"100%",n=typeof d=="number"?`${d}px`:d;switch(e){case"circular":const p=n||m||"2rem";return{width:p,height:p,borderRadius:"50%"};case"glass-radius-md":return{width:m,height:n||"1rem",borderRadius:"var(--glass-radius-md)"};case"rectangular":return{width:m,height:n||"1rem",borderRadius:"var(--glass-radius-sm)"};default:return{width:m,height:n||"1rem",borderRadius:"var(--glass-radius-xs)"}}},C=()=>{switch(o){case"pulse":return{animation:`skeleton-pulse ${b.DURATION.slower*2}ms ${b.EASING.easeInOut} infinite`};case"wave":return{position:"relative",overflow:"hidden",background:"var(--glass-primary-level3-surface)",backgroundSize:"200% 100%",animation:`skeleton-wave ${b.DURATION.slower*2}ms infinite`};default:return{}}};return e==="text"&&h>1?s.jsxs(s.Fragment,{children:[s.jsx("style",{children:z}),s.jsx("div",{ref:_,className:c("glass-gap-2",g),...G,children:Array.from({length:h},(m,n)=>{const p=Array.isArray(t)?t[n%t.length]:typeof t=="string"&&t.includes(",")?t.split(",")[n%t.split(",").length].trim():n===h-1?"60%":"100%";return s.jsx(y,{"data-glass-component":!0,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",animation:"none",performanceMode:"low","data-glass-skeleton":"true","data-skeleton-variant":e,className:c("block glass-skeleton",o==="pulse"&&"animate-pulse"),style:{...B,...A(),width:p,...C(),animationDelay:`${n*.1}s`}},n)})})]}):s.jsxs(s.Fragment,{children:[s.jsx("style",{children:z}),s.jsx(y,{ref:_,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",animation:"none",performanceMode:"low","data-glass-skeleton":"true","data-skeleton-variant":e,"data-skeleton-animation":o,className:c("block glass-skeleton",o==="pulse"&&"animate-pulse",g),style:{...B,...A(),...C()},...G})]})});a.displayName="GlassSkeleton";const i=({size:e="md",className:t=""})=>{const d={sm:"glass-w-8 glass-h-8",md:"glass-w-10 glass-h-10",lg:"glass-w-12 glass-h-12",xl:"glass-w-16 glass-h-16"};return s.jsx(a,{variant:"circular",className:`${d[e]} ${t}`,animation:"pulse"})},l=({width:e="80px",className:t=""})=>s.jsx(a,{variant:"glass-radius-md",width:e,height:"2.5rem",className:t,animation:"pulse"}),r=({className:e=""})=>s.jsxs(y,{elevation:"level1",intensity:"medium",depth:2,tint:"neutral",border:"subtle",animation:"none",performanceMode:"medium",className:c("glass-p-6 glass-gap-4",e),style:T,children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-4",children:[s.jsx(i,{size:"md"}),s.jsxs("div",{className:"glass-gap-2 glass-flex-1",children:[s.jsx(a,{width:"60%",height:"1rem"}),s.jsx(a,{width:"40%",height:"0.75rem"})]})]}),s.jsxs("div",{className:"glass-gap-3",children:[s.jsx(a,{height:"1rem"}),s.jsx(a,{height:"1rem",width:"80%"}),s.jsx(a,{height:"1rem",width:"60%"})]}),s.jsxs("div",{className:"glass-flex glass-gap-2 glass-pt-2",children:[s.jsx(a,{width:"60px",height:"2rem",variant:"glass-radius-md"}),s.jsx(a,{width:"60px",height:"2rem",variant:"glass-radius-md"})]})]}),V=({rows:e=5,columns:t=4,className:d=""})=>s.jsxs(y,{elevation:"level1",intensity:"medium",depth:2,tint:"neutral",border:"subtle",animation:"none",performanceMode:"medium",className:c("glass-overflow-hidden",d),style:T,children:[s.jsx("div",{className:"glass-p-4 glass-border-b glass-border-white/10",children:s.jsx("div",{className:"glass-grid glass-gap-4",style:{gridTemplateColumns:`repeat(${t}, 1fr)`},children:Array.from({length:t},(o,g)=>s.jsx(a,{height:"1rem",width:"80%"},`header-${g}`))})}),s.jsx("div",{className:"glass-divide-y glass-divide-white-opacity-5",children:Array.from({length:e},(o,g)=>s.jsx("div",{className:"glass-p-4",children:s.jsx("div",{className:"glass-grid glass-gap-4",style:{gridTemplateColumns:`repeat(${t}, 1fr)`},children:Array.from({length:t},(h,S)=>s.jsx(a,{height:"1rem",width:S===t-1?"60%":"100%"},`cell-${g}-${S}`))})},`row-${g}`))})]}),q=({items:e=3,className:t=""})=>s.jsx("div",{className:`glass-gap-4 ${t}`,children:Array.from({length:e},(d,o)=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-4",children:[s.jsx(i,{size:"sm"}),s.jsxs("div",{className:"glass-flex-1 glass-gap-2",children:[s.jsx(a,{height:"1rem",width:"70%"}),s.jsx(a,{height:"0.75rem",width:"50%"})]}),s.jsx(a,{width:"60px",height:"1.5rem",variant:"glass-radius-md"})]},o))});try{a.displayName="GlassSkeleton",a.__docgenInfo={description:`GlassSkeleton component
A skeleton loader with glassmorphism styling for loading states`,displayName:"GlassSkeleton",props:{variant:{defaultValue:{value:"text"},description:"Shape variant of the skeleton",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"text"'},{value:'"circular"'},{value:'"glass-radius-md"'},{value:'"rectangular"'}]}},width:{defaultValue:{value:"80px"},description:"Width of the skeleton",name:"width",required:!1,type:{name:"string | number | undefined"}},height:{defaultValue:null,description:"Height of the skeleton",name:"height",required:!1,type:{name:"string | number | undefined"}},animation:{defaultValue:{value:"pulse"},description:"Animation variant",name:"animation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"pulse"'},{value:'"wave"'}]}},lines:{defaultValue:{value:"1"},description:"Number of skeleton lines (for text variant)",name:"lines",required:!1,type:{name:"number | undefined"}},spacing:{defaultValue:{value:"0.5rem"},description:"Spacing between lines (for text variant)",name:"spacing",required:!1,type:{name:"string | undefined"}}}}}catch{}try{i.displayName="GlassSkeletonAvatar",i.__docgenInfo={description:"",displayName:"GlassSkeletonAvatar",props:{size:{defaultValue:{value:"md"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"xl"'}]}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{l.displayName="GlassSkeletonButton",l.__docgenInfo={description:"",displayName:"GlassSkeletonButton",props:{width:{defaultValue:{value:"80px"},description:"",name:"width",required:!1,type:{name:"string | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{r.displayName="GlassSkeletonCard",r.__docgenInfo={description:"",displayName:"GlassSkeletonCard",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{V.displayName="GlassSkeletonTable",V.__docgenInfo={description:"",displayName:"GlassSkeletonTable",props:{rows:{defaultValue:{value:"5"},description:"",name:"rows",required:!1,type:{name:"number | undefined"}},columns:{defaultValue:{value:"4"},description:"",name:"columns",required:!1,type:{name:"number | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{q.displayName="GlassSkeletonList",q.__docgenInfo={description:"",displayName:"GlassSkeletonList",props:{items:{defaultValue:{value:"3"},description:"",name:"items",required:!1,type:{name:"number | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const M={title:"Data + Visualization/Glass Skeleton",component:a,parameters:{layout:"centered",docs:{description:{component:"Glass morphism skeleton components for loading states with various shapes and animations."}}},decorators:[e=>s.jsx("div",{className:"glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5",style:{width:"min(760px, calc(100vw - 64px))"},children:s.jsx(e,{})})],argTypes:{variant:{control:{type:"select"},options:["text","rectangular","circular","glass-radius-md"],description:"Shape variant of the skeleton"},animation:{control:{type:"select"},options:["pulse","wave","none"],description:"Animation type"},width:{control:"text",description:"Width of the skeleton"},height:{control:"text",description:"Height of the skeleton"},lines:{control:{type:"number",min:1,max:10},description:"Number of text lines (for text variant)"}},args:{variant:"rectangular",animation:"pulse",width:"200px",height:"100px",lines:1}},u={render:e=>s.jsxs("div",{className:"glass-stack glass-stack-md",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-3",children:"Rectangular"}),s.jsx(a,{...e,variant:"rectangular",width:"100%",height:"60px"})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-3",children:"Circular"}),s.jsx(a,{...e,variant:"circular",width:"60px",height:"60px"})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-3",children:"Rounded"}),s.jsx(a,{...e,variant:"glass-radius-md",width:"100%",height:"40px"})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-3",children:"Text"}),s.jsx(a,{...e,variant:"text",width:"100%",height:"20px"})]})]}),args:{}},x={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Pulse Animation"}),s.jsx(a,{...e,animation:"pulse",width:"100%",height:"40px"})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Wave Animation"}),s.jsx(a,{...e,animation:"wave",width:"100%",height:"40px"})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"No Animation"}),s.jsx(a,{...e,animation:"none",width:"100%",height:"40px"})]})]}),args:{}},v={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Single Line"}),s.jsx(a,{variant:"text",lines:1,width:"100%",height:"20px"})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Multiple Lines"}),s.jsx(a,{variant:"text",lines:3,width:"100%",height:"20px"})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Long Text Block"}),s.jsx(a,{variant:"text",lines:5,width:"100%",height:"20px"})]})]}),args:{}},f={render:e=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-4",children:[s.jsx(i,{size:"sm"}),s.jsx(i,{size:"md"}),s.jsx(i,{size:"lg"}),s.jsx(i,{size:"xl"})]}),args:{}},j={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Button Sizes"}),s.jsxs("div",{className:"glass-gap-2",children:[s.jsx(l,{width:"60px"}),s.jsx(l,{width:"80px"}),s.jsx(l,{width:"100px"})]})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Full Width"}),s.jsx(l,{width:"100%"})]})]}),args:{}},N={render:e=>s.jsxs("div",{className:"glass-grid glass-grid-cols-2 glass-gap-6",children:[s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{})]}),args:{}},k={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-4",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx(i,{size:"md"}),s.jsxs("div",{className:"glass-flex-1 glass-gap-2",children:[s.jsx(a,{variant:"text",lines:1,width:"100%",height:"1rem"}),s.jsx(a,{variant:"text",lines:1,width:"100%",height:"0.75rem"})]})]}),s.jsx(r,{}),s.jsxs("div",{className:"glass-flex glass-justify-end glass-gap-2",children:[s.jsx(l,{width:"60px"}),s.jsx(l,{width:"60px"})]})]}),args:{}},w={render:e=>s.jsxs("div",{className:"glass-stack glass-stack-md",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx(i,{size:"lg"}),s.jsxs("div",{className:"glass-gap-2",children:[s.jsx(a,{variant:"text",lines:1,width:"100%",height:"1rem"}),s.jsx(a,{variant:"text",lines:1,width:"100%",height:"0.75rem"})]})]}),s.jsx(l,{width:"60px"})]}),s.jsxs("div",{className:"glass-gap-4",children:[s.jsx(a,{variant:"text",lines:2,width:"100%",height:"1rem"}),s.jsx(a,{variant:"rectangular",width:"100%",height:"200px"}),s.jsx(a,{variant:"text",lines:3,width:"100%",height:"1rem"})]}),s.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-4",children:[s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{})]}),s.jsxs("div",{className:"glass-flex glass-justify-between glass-items-center",children:[s.jsxs("div",{className:"glass-flex glass-gap-2",children:[s.jsx(l,{width:"60px"}),s.jsx(l,{width:"60px"})]}),s.jsx(l,{width:"80px"})]})]}),args:{}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-stack glass-stack-md">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-3">Rectangular</h4>
        <GlassSkeleton {...args} variant="rectangular" width="100%" height="60px" />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-3">Circular</h4>
        <GlassSkeleton {...args} variant="circular" width="60px" height="60px" />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-3">Rounded</h4>
        <GlassSkeleton {...args} variant="glass-radius-md" width="100%" height="40px" />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-3">Text</h4>
        <GlassSkeleton {...args} variant="text" width="100%" height="20px" />
      </div>
    </div>,
  args: {}
}`,...u.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Pulse Animation</h4>
        <GlassSkeleton {...args} animation="pulse" width="100%" height="40px" />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Wave Animation</h4>
        <GlassSkeleton {...args} animation="wave" width="100%" height="40px" />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">No Animation</h4>
        <GlassSkeleton {...args} animation="none" width="100%" height="40px" />
      </div>
    </div>,
  args: {}
}`,...x.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Single Line</h4>
        <GlassSkeleton variant="text" lines={1} width="100%" height="20px" />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Multiple Lines</h4>
        <GlassSkeleton variant="text" lines={3} width="100%" height="20px" />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Long Text Block</h4>
        <GlassSkeleton variant="text" lines={5} width="100%" height="20px" />
      </div>
    </div>,
  args: {}
}`,...v.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-items-center glass-gap-4">
      <GlassSkeletonAvatar size="sm" />
      <GlassSkeletonAvatar size="md" />
      <GlassSkeletonAvatar size="lg" />
      <GlassSkeletonAvatar size="xl" />
    </div>,
  args: {}
}`,...f.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Button Sizes</h4>
        <div className="glass-gap-2">
          <GlassSkeletonButton width="60px" />
          <GlassSkeletonButton width="80px" />
          <GlassSkeletonButton width="100px" />
        </div>
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Full Width</h4>
        <GlassSkeletonButton width="100%" />
      </div>
    </div>,
  args: {}
}`,...j.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-grid-cols-2 glass-gap-6">
      <GlassSkeletonCard />
      <GlassSkeletonCard />
      <GlassSkeletonCard />
      <GlassSkeletonCard />
    </div>,
  args: {}
}`,...N.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4">
      <div className="glass-flex glass-items-center glass-gap-3">
        <GlassSkeletonAvatar size="md" />
        <div className="glass-flex-1 glass-gap-2">
          <GlassSkeleton variant="text" lines={1} width="100%" height="1rem" />
          <GlassSkeleton variant="text" lines={1} width="100%" height="0.75rem" />
        </div>
      </div>

      <GlassSkeletonCard />

      <div className="glass-flex glass-justify-end glass-gap-2">
        <GlassSkeletonButton width="60px" />
        <GlassSkeletonButton width="60px" />
      </div>
    </div>,
  args: {}
}`,...k.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-stack glass-stack-md">
      {/* Header */}
      <div className="glass-flex glass-items-center glass-justify-between">
        <div className="glass-flex glass-items-center glass-gap-3">
          <GlassSkeletonAvatar size="lg" />
          <div className="glass-gap-2">
            <GlassSkeleton variant="text" lines={1} width="100%" height="1rem" />
            <GlassSkeleton variant="text" lines={1} width="100%" height="0.75rem" />
          </div>
        </div>
        <GlassSkeletonButton width="60px" />
      </div>

      {/* Content */}
      <div className="glass-gap-4">
        <GlassSkeleton variant="text" lines={2} width="100%" height="1rem" />
        <GlassSkeleton variant="rectangular" width="100%" height="200px" />
        <GlassSkeleton variant="text" lines={3} width="100%" height="1rem" />
      </div>

      {/* Cards Grid */}
      <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-4">
        <GlassSkeletonCard />
        <GlassSkeletonCard />
        <GlassSkeletonCard />
      </div>

      {/* Actions */}
      <div className="glass-flex glass-justify-between glass-items-center">
        <div className="glass-flex glass-gap-2">
          <GlassSkeletonButton width="60px" />
          <GlassSkeletonButton width="60px" />
        </div>
        <GlassSkeletonButton width="80px" />
      </div>
    </div>,
  args: {}
}`,...w.parameters?.docs?.source}}};const O=["Variants","Animations","SkeletonText","SkeletonAvatar","SkeletonButton","SkeletonCard","LoadingState","ComplexLayout"];export{x as Animations,w as ComplexLayout,k as LoadingState,f as SkeletonAvatar,j as SkeletonButton,N as SkeletonCard,v as SkeletonText,u as Variants,O as __namedExportsOrder,M as default};
