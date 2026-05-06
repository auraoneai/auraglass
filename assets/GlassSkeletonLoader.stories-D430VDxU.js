import{r as g,j as s,c as i}from"./iframe-rcK9Xf1b.js";import{a as y}from"./useAccessibilitySettings-Dbicsi4m.js";import{G as _}from"./errorBoundary-BHHlm1TP.js";import{O as o}from"./OptimizedGlassCore-BtDfN8Ts.js";import"./preload-helper-PPVm8Dsz.js";const T=`
  @keyframes glass-pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.02);
    }
  }
`,z=`
  @keyframes glass-wave {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`,V=`
  @keyframes glass-shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
`,q=`
  @keyframes glass-sheen-move {
    0% { transform: translateX(-150%) rotate(15deg); }
    100% { transform: translateX(150%) rotate(15deg); }
  }
  @keyframes glass-depth-pulse {
    0%, 100% { box-shadow: var(--glass-elev-2); }
    50% { box-shadow: var(--glass-elev-2); }
  }
`,l=g.memo(({loading:e=!0,text:t="Loading...",size:m="md",variant:n="pulse",className:f="",children:r,"aria-label":S,"data-testid":k})=>{const[j,w]=g.useState(!1),{shouldAnimate:N,animationDuration:d}=y();g.useEffect(()=>{w(!0)},[]);const G=g.useCallback(()=>{if(!e&&j)return s.jsx(s.Fragment,{children:r});const L={sm:"glass-w-6 glass-h-6",md:"glass-w-8 glass-h-8",lg:"glass-w-12 glass-h-12",xl:"glass-w-16 glass-h-16"},C=()=>{if(!N)return{};switch(n){case"wave":return{position:"relative",overflow:"hidden",background:'/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',backgroundSize:"200px 100%",animation:`glass-wave ${d*5}ms infinite`};case"shimmer":return{position:"relative",overflow:"hidden",background:'/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',backgroundSize:"200px 100%",animation:`glass-shimmer ${d*7}ms infinite, glass-depth-pulse ${d*14}ms ease-in-out infinite`};case"sheen":return{position:"relative",overflow:"hidden",background:'/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */'};default:return{animation:`glass-pulse ${d*7}ms ease-in-out infinite`}}};return s.jsxs("div",{"data-glass-component":!0,"data-testid":k||"glassskeletonloader",className:i("glass-flex glass-flex-col glass-items-center glass-justify-center glass-gap-4",f),"aria-label":S,children:[s.jsxs("div",{style:{position:"relative"},children:[s.jsx(o,{className:i("glass-radius-full",L[m]),style:{...C()},intensity:"medium",elevation:"level1",interactive:!1}),N&&n==="sheen"&&s.jsx("span",{"aria-hidden":!0,style:{position:"absolute",inset:0,borderRadius:"9999px",background:'/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',filter:"blur(6px) saturate(120%)",transform:"translateX(-150%) rotate(15deg)",animation:`glass-sheen-move ${d*6}ms ease-in-out infinite`,pointerEvents:"none"}})]}),t&&s.jsx(o,{className:"glass-px-4 glass-py-2 glass-radius-lg",intensity:"subtle",elevation:"level1",children:s.jsx("span",{className:i("glass-text-sm glass-text-primary-70 glass-font-medium"),children:t})})]})},[e,j,r,m,n,f,t,N,d]);return s.jsx(_,{componentName:"GlassSkeletonLoader",children:s.jsxs(s.Fragment,{children:[s.jsxs("style",{children:[T,z,V,q]}),G()]})})}),a=({lines:e=1,width:t="100%",className:m=""})=>{y();const n=Array.isArray(t)?t:[t];return s.jsx("div",{className:i("glass-gap-2",m),children:Array.from({length:e},(f,r)=>s.jsx(o,{className:i("glass-h-4 glass-radius-md"),style:{width:n[r%n.length],animation:"glass-pulse 2s ease-in-out infinite",animationDelay:`${r*.1}s`},intensity:"subtle",elevation:"level1",interactive:!1},r))})},b=({className:e=""})=>{const t={animation:"glass-pulse 2s ease-in-out infinite"};return s.jsxs(o,{className:i("glass-p-6 glass-gap-4",e),intensity:"medium",elevation:"level1",children:[s.jsx(a,{lines:1,width:"60%"}),s.jsx(a,{lines:2,width:["100%","80%"]}),s.jsxs("div",{className:i("glass-flex glass-gap-2"),children:[s.jsx(o,{className:i("glass-h-8 glass-w-16 glass-radius-md"),style:{...t},intensity:"subtle",elevation:"level1"}),s.jsx(o,{className:i("glass-h-8 glass-w-16 glass-radius-md"),style:{...t,animationDelay:"0.2s"},intensity:"subtle",elevation:"level1"})]})]})};try{l.displayName="GlassSkeletonLoader",l.__docgenInfo={description:"",displayName:"GlassSkeletonLoader",props:{loading:{defaultValue:null,description:"Whether the loader is active",name:"loading",required:!1,type:{name:"boolean | undefined"}},text:{defaultValue:null,description:"Custom loading text",name:"text",required:!1,type:{name:"string | undefined"}},size:{defaultValue:null,description:"Size of the loader",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"xl"'}]}},variant:{defaultValue:null,description:"Animation variant",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sheen"'},{value:'"pulse"'},{value:'"shimmer"'},{value:'"wave"'}]}},className:{defaultValue:{value:""},description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"Testing identifier",name:"data-testid",required:!1,type:{name:"string | undefined"}},children:{defaultValue:null,description:"Children to show when not loading",name:"children",required:!1,type:{name:"ReactNode"}},"aria-label":{defaultValue:null,description:"ARIA label for accessibility",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}try{a.displayName="GlassSkeletonText",a.__docgenInfo={description:"",displayName:"GlassSkeletonText",props:{lines:{defaultValue:{value:"1"},description:"",name:"lines",required:!1,type:{name:"number | undefined"}},width:{defaultValue:{value:"100%"},description:"",name:"width",required:!1,type:{name:"string | string[] | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{b.displayName="GlassSkeletonCard",b.__docgenInfo={description:"",displayName:"GlassSkeletonCard",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const $={title:"Components/Data-display/GlassSkeletonLoader",component:l,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassskeletonloader component."}}},argTypes:{loading:{control:"boolean",description:"Whether the loader is active"},text:{control:"text",description:"Custom loading text"},size:{control:{type:"select",options:["sm","md","lg","xl"]},description:"Size of the loader"},variant:{control:{type:"select",options:["pulse","wave","shimmer"]},description:"Animation variant"}},args:{loading:!0,text:"Loading...",size:"md",variant:"pulse"}},c={args:{loading:!0,text:"Loading content..."}},u={render:e=>s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6 max-w-4xl",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-4",children:"Pulse"}),s.jsx(l,{...e,variant:"pulse"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-4",children:"Wave"}),s.jsx(l,{...e,variant:"wave"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-4",children:"Shimmer"}),s.jsx(l,{...e,variant:"shimmer"})]})]}),args:{loading:!0,text:"Loading..."}},x={render:e=>s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-center glass-gap-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-2",children:"Small"}),s.jsx(l,{...e,size:"sm"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-2",children:"Medium"}),s.jsx(l,{...e,size:"md"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-2",children:"Large"}),s.jsx(l,{...e,size:"lg"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-2",children:"Extra Large"}),s.jsx(l,{...e,size:"xl"})]})]}),args:{loading:!0,text:"Loading..."}},h={render:e=>s.jsx(l,{...e,children:s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-radius-lg glass-text-center",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-2",children:"Content Loaded!"}),s.jsx("p",{className:"glass-text-sm opacity-80",children:"This content appears when loading is complete."})]})}),args:{loading:!1,text:"Loading..."}},p={render:e=>s.jsxs("div",{className:"glass-gap-4 max-w-md",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Single Line"}),s.jsx(a,{lines:1})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Multiple Lines"}),s.jsx(a,{lines:3})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Long Content Block"}),s.jsx(a,{lines:5})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"With Custom Width"}),s.jsx(a,{lines:2,width:["100%","80%"]})]})]}),args:{loading:!0}},v={render:e=>s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 max-w-4xl",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-3",children:"Title Skeleton"}),s.jsx(a,{lines:1}),s.jsx("div",{className:"glass-mt-2",children:s.jsx(a,{lines:3,width:["100%","90%","60%"]})})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-3",children:"List Item Skeleton"}),s.jsx("div",{className:"glass-gap-3",children:s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx(a,{lines:1,width:"40px"}),s.jsx("div",{className:"glass-flex-1",children:s.jsx(a,{lines:2,width:["100%","70%"]})})]})})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-3",children:"Card Content"}),s.jsx(a,{lines:1}),s.jsx("div",{className:"glass-mt-2",children:s.jsx(a,{lines:2,width:["100%","80%"]})})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-3",children:"Comment Skeleton"}),s.jsxs("div",{className:"glass-flex glass-items-start glass-gap-3",children:[s.jsx(a,{lines:1,width:"32px"}),s.jsx("div",{className:"glass-flex-1",children:s.jsx(a,{lines:3,width:["100%","90%","40%"]})})]})]})]}),args:{loading:!0}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true,
    text: 'Loading content...'
  }
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6 max-w-4xl">
      <div className="glass-text-center">
        <h3 className="glass-text-sm glass-font-semibold glass-mb-4">Pulse</h3>
        <GlassSkeletonLoader {...args} variant="pulse" />
      </div>
      <div className="glass-text-center">
        <h3 className="glass-text-sm glass-font-semibold glass-mb-4">Wave</h3>
        <GlassSkeletonLoader {...args} variant="wave" />
      </div>
      <div className="glass-text-center">
        <h3 className="glass-text-sm glass-font-semibold glass-mb-4">Shimmer</h3>
        <GlassSkeletonLoader {...args} variant="shimmer" />
      </div>
    </div>,
  args: {
    loading: true,
    text: 'Loading...'
  }
}`,...u.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-items-center glass-justify-center glass-gap-8">
      <div className="glass-text-center">
        <h3 className="glass-text-sm glass-font-semibold glass-mb-2">Small</h3>
        <GlassSkeletonLoader {...args} size="sm" />
      </div>
      <div className="glass-text-center">
        <h3 className="glass-text-sm glass-font-semibold glass-mb-2">Medium</h3>
        <GlassSkeletonLoader {...args} size="md" />
      </div>
      <div className="glass-text-center">
        <h3 className="glass-text-sm glass-font-semibold glass-mb-2">Large</h3>
        <GlassSkeletonLoader {...args} size="lg" />
      </div>
      <div className="glass-text-center">
        <h3 className="glass-text-sm glass-font-semibold glass-mb-2">Extra Large</h3>
        <GlassSkeletonLoader {...args} size="xl" />
      </div>
    </div>,
  args: {
    loading: true,
    text: 'Loading...'
  }
}`,...x.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <GlassSkeletonLoader {...args}>
      <div className="glass-p-6 glass-surface-subtle/10 glass-radius-lg glass-text-center">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Content Loaded!</h3>
        <p className="glass-text-sm opacity-80">This content appears when loading is complete.</p>
      </div>
    </GlassSkeletonLoader>,
  args: {
    loading: false,
    text: 'Loading...'
  }
}`,...h.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-gap-4 max-w-md">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Single Line</h4>
        <GlassSkeletonText lines={1} />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Multiple Lines</h4>
        <GlassSkeletonText lines={3} />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Long Content Block</h4>
        <GlassSkeletonText lines={5} />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">With Custom Width</h4>
        <GlassSkeletonText lines={2} width={['100%', '80%']} />
      </div>
    </div>,
  args: {
    loading: true
  }
}`,...p.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 max-w-4xl">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-3">Title Skeleton</h4>
        <GlassSkeletonText lines={1} />
        <div className="glass-mt-2">
          <GlassSkeletonText lines={3} width={['100%', '90%', '60%']} />
        </div>
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-3">List Item Skeleton</h4>
        <div className="glass-gap-3">
          <div className="glass-flex glass-items-center glass-gap-3">
            <GlassSkeletonText lines={1} width="40px" />
            <div className="glass-flex-1">
              <GlassSkeletonText lines={2} width={['100%', '70%']} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-3">Card Content</h4>
        <GlassSkeletonText lines={1} />
        <div className="glass-mt-2">
          <GlassSkeletonText lines={2} width={['100%', '80%']} />
        </div>
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-3">Comment Skeleton</h4>
        <div className="glass-flex glass-items-start glass-gap-3">
          <GlassSkeletonText lines={1} width="32px" />
          <div className="glass-flex-1">
            <GlassSkeletonText lines={3} width={['100%', '90%', '40%']} />
          </div>
        </div>
      </div>
    </div>,
  args: {
    loading: true
  }
}`,...v.parameters?.docs?.source}}};const M=["Default","Variants","DifferentSizes","WithChildren","SkeletonText","SkeletonTextVariants"];export{c as Default,x as DifferentSizes,p as SkeletonText,v as SkeletonTextVariants,u as Variants,h as WithChildren,M as __namedExportsOrder,$ as default};
