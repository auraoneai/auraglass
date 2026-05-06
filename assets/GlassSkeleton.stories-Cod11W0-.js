import{r as B,j as s,c as w,d as N}from"./iframe-mbNquNNc.js";import{O as S}from"./OptimizedGlassCore-CPvpl-y1.js";import"./preload-helper-PPVm8Dsz.js";const z=`
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
`,e=B.forwardRef(({variant:a="text",width:t,height:d,animation:o="pulse",className:b,lines:k=1,spacing:R="0.5rem",...G},y)=>{const A=()=>{const m=typeof t=="number"?`${t}px`:t||"100%",n=typeof d=="number"?`${d}px`:d;switch(a){case"circular":const g=n||m||"2rem";return{width:g,height:g,borderRadius:"50%"};case"glass-radius-md":return{width:m,height:n||"1rem",borderRadius:"var(--glass-radius-md)"};case"rectangular":return{width:m,height:n||"1rem",borderRadius:"var(--glass-radius-sm)"};default:return{width:m,height:n||"1rem",borderRadius:"var(--glass-radius-xs)"}}},C=()=>{switch(o){case"pulse":return{animation:`skeleton-pulse ${N.DURATION.slower*2}ms ${N.EASING.easeInOut} infinite`};case"wave":return{position:"relative",overflow:"hidden",background:'/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',backgroundSize:"200% 100%",animation:`skeleton-wave ${N.DURATION.slower*2}ms infinite`};default:return{}}};return a==="text"&&k>1?s.jsxs(s.Fragment,{children:[s.jsx("style",{children:z}),s.jsx("div",{ref:y,className:w("glass-gap-2",b),...G,children:Array.from({length:k},(m,n)=>{const g=Array.isArray(t)?t[n%t.length]:typeof t=="string"&&t.includes(",")?t.split(",")[n%t.split(",").length].trim():n===k-1?"60%":"100%";return s.jsx(S,{"data-glass-component":!0,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",animation:"none",performanceMode:"low","data-glass-skeleton":"true","data-skeleton-variant":a,className:w("block glass-skeleton",o==="pulse"&&"animate-pulse"),style:{...A(),width:g,...C(),animationDelay:`${n*.1}s`}},n)})})]}):s.jsxs(s.Fragment,{children:[s.jsx("style",{children:z}),s.jsx(S,{ref:y,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",animation:"none",performanceMode:"low","data-glass-skeleton":"true","data-skeleton-variant":a,"data-skeleton-animation":o,className:w("block glass-skeleton",o==="pulse"&&"animate-pulse",b),style:{...A(),...C()},...G})]})});e.displayName="GlassSkeleton";const r=({size:a="md",className:t=""})=>{const d={sm:"w-8 h-8",md:"w-10 h-10",lg:"w-12 h-12",xl:"w-16 h-16"};return s.jsx(e,{variant:"circular",className:`${d[a]} ${t}`,animation:"pulse"})},l=({width:a="80px",className:t=""})=>s.jsx(e,{variant:"glass-radius-md",width:a,height:"2.5rem",className:t,animation:"pulse"}),i=({className:a=""})=>s.jsxs(S,{elevation:"level1",intensity:"medium",depth:2,tint:"neutral",border:"subtle",animation:"none",performanceMode:"medium",className:w("glass-p-6 glass-gap-4",a),children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-4",children:[s.jsx(r,{size:"md"}),s.jsxs("div",{className:"glass-gap-2 glass-flex-1",children:[s.jsx(e,{width:"60%",height:"1rem"}),s.jsx(e,{width:"40%",height:"0.75rem"})]})]}),s.jsxs("div",{className:"glass-gap-3",children:[s.jsx(e,{height:"1rem"}),s.jsx(e,{height:"1rem",width:"80%"}),s.jsx(e,{height:"1rem",width:"60%"})]}),s.jsxs("div",{className:"glass-flex glass-gap-2 glass-pt-2",children:[s.jsx(e,{width:"60px",height:"2rem",variant:"glass-radius-md"}),s.jsx(e,{width:"60px",height:"2rem",variant:"glass-radius-md"})]})]});try{e.displayName="GlassSkeleton",e.__docgenInfo={description:`GlassSkeleton component
A skeleton loader with glassmorphism styling for loading states`,displayName:"GlassSkeleton",props:{variant:{defaultValue:{value:"text"},description:"Shape variant of the skeleton",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"text"'},{value:'"circular"'},{value:'"glass-radius-md"'},{value:'"rectangular"'}]}},width:{defaultValue:{value:"80px"},description:"Width of the skeleton",name:"width",required:!1,type:{name:"string | number | undefined"}},height:{defaultValue:null,description:"Height of the skeleton",name:"height",required:!1,type:{name:"string | number | undefined"}},animation:{defaultValue:{value:"pulse"},description:"Animation variant",name:"animation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"pulse"'},{value:'"wave"'}]}},lines:{defaultValue:{value:"1"},description:"Number of skeleton lines (for text variant)",name:"lines",required:!1,type:{name:"number | undefined"}},spacing:{defaultValue:{value:"0.5rem"},description:"Spacing between lines (for text variant)",name:"spacing",required:!1,type:{name:"string | undefined"}}}}}catch{}const V={title:"Components/Data-Display/GlassSkeleton",component:e,parameters:{layout:"centered",docs:{description:{component:"Glass morphism skeleton components for loading states with various shapes and animations."}}},argTypes:{variant:{control:{type:"select"},options:["text","rectangular","circular","glass-radius-md"],description:"Shape variant of the skeleton"},animation:{control:{type:"select"},options:["pulse","wave","none"],description:"Animation type"},width:{control:"text",description:"Width of the skeleton"},height:{control:"text",description:"Height of the skeleton"},lines:{control:{type:"number",min:1,max:10},description:"Number of text lines (for text variant)"}},args:{variant:"rectangular",animation:"pulse",width:"200px",height:"100px",lines:1}},c={render:a=>s.jsxs("div",{className:"space-y-6 max-w-md",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-3",children:"Rectangular"}),s.jsx(e,{...a,variant:"rectangular",width:"100%",height:"60px"})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-3",children:"Circular"}),s.jsx(e,{...a,variant:"circular",width:"60px",height:"60px"})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-3",children:"Rounded"}),s.jsx(e,{...a,variant:"glass-radius-md",width:"100%",height:"40px"})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-3",children:"Text"}),s.jsx(e,{...a,variant:"text",width:"100%",height:"20px"})]})]}),args:{}},h={render:a=>s.jsxs("div",{className:"glass-gap-4 max-w-md",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Pulse Animation"}),s.jsx(e,{...a,animation:"pulse",width:"100%",height:"40px"})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Wave Animation"}),s.jsx(e,{...a,animation:"wave",width:"100%",height:"40px"})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"No Animation"}),s.jsx(e,{...a,animation:"none",width:"100%",height:"40px"})]})]}),args:{}},x={render:a=>s.jsxs("div",{className:"glass-gap-4 max-w-md",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Single Line"}),s.jsx(e,{variant:"text",lines:1,width:"100%",height:"20px"})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Multiple Lines"}),s.jsx(e,{variant:"text",lines:3,width:"100%",height:"20px"})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Long Text Block"}),s.jsx(e,{variant:"text",lines:5,width:"100%",height:"20px"})]})]}),args:{}},u={render:a=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-4",children:[s.jsx(r,{size:"sm"}),s.jsx(r,{size:"md"}),s.jsx(r,{size:"lg"}),s.jsx(r,{size:"xl"})]}),args:{}},p={render:a=>s.jsxs("div",{className:"glass-gap-4 max-w-md",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Button Sizes"}),s.jsxs("div",{className:"glass-gap-2",children:[s.jsx(l,{width:"60px"}),s.jsx(l,{width:"80px"}),s.jsx(l,{width:"100px"})]})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Full Width"}),s.jsx(l,{width:"100%"})]})]}),args:{}},v={render:a=>s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 max-w-4xl",children:[s.jsx(i,{}),s.jsx(i,{}),s.jsx(i,{}),s.jsx(i,{})]}),args:{}},j={render:a=>s.jsxs("div",{className:"max-w-md glass-gap-4",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx(r,{size:"md"}),s.jsxs("div",{className:"glass-flex-1 glass-gap-2",children:[s.jsx(e,{variant:"text",lines:1,width:"100%",height:"1rem"}),s.jsx(e,{variant:"text",lines:1,width:"100%",height:"0.75rem"})]})]}),s.jsx(i,{}),s.jsxs("div",{className:"glass-flex glass-justify-end glass-gap-2",children:[s.jsx(l,{width:"60px"}),s.jsx(l,{width:"60px"})]})]}),args:{}},f={render:a=>s.jsxs("div",{className:"max-w-2xl space-y-6",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx(r,{size:"lg"}),s.jsxs("div",{className:"glass-gap-2",children:[s.jsx(e,{variant:"text",lines:1,width:"100%",height:"1rem"}),s.jsx(e,{variant:"text",lines:1,width:"100%",height:"0.75rem"})]})]}),s.jsx(l,{width:"60px"})]}),s.jsxs("div",{className:"glass-gap-4",children:[s.jsx(e,{variant:"text",lines:2,width:"100%",height:"1rem"}),s.jsx(e,{variant:"rectangular",width:"100%",height:"200px"}),s.jsx(e,{variant:"text",lines:3,width:"100%",height:"1rem"})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-4",children:[s.jsx(i,{}),s.jsx(i,{}),s.jsx(i,{})]}),s.jsxs("div",{className:"glass-flex glass-justify-between glass-items-center",children:[s.jsxs("div",{className:"glass-flex glass-gap-2",children:[s.jsx(l,{width:"60px"}),s.jsx(l,{width:"60px"})]}),s.jsx(l,{width:"80px"})]})]}),args:{}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <div className="space-y-6 max-w-md">
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
}`,...c.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-gap-4 max-w-md">
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
}`,...h.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-gap-4 max-w-md">
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
}`,...x.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-items-center glass-gap-4">
      <GlassSkeletonAvatar size="sm" />
      <GlassSkeletonAvatar size="md" />
      <GlassSkeletonAvatar size="lg" />
      <GlassSkeletonAvatar size="xl" />
    </div>,
  args: {}
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-gap-4 max-w-md">
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
}`,...p.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 max-w-4xl">
      <GlassSkeletonCard />
      <GlassSkeletonCard />
      <GlassSkeletonCard />
      <GlassSkeletonCard />
    </div>,
  args: {}
}`,...v.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: args => <div className="max-w-md glass-gap-4">
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
}`,...j.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <div className="max-w-2xl space-y-6">
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
      <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-4">
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
}`,...f.parameters?.docs?.source}}};const W=["Variants","Animations","SkeletonText","SkeletonAvatar","SkeletonButton","SkeletonCard","LoadingState","ComplexLayout"];export{h as Animations,f as ComplexLayout,j as LoadingState,u as SkeletonAvatar,p as SkeletonButton,v as SkeletonCard,x as SkeletonText,c as Variants,W as __namedExportsOrder,V as default};
