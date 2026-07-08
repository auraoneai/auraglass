import{r as C,b as I,j as e}from"./iframe-AZkd8Eyt.js";import"./preload-helper-PPVm8Dsz.js";const n=C.forwardRef(({children:o,label:g,value:b,active:t=!1,disabled:a=!1,icon:d,badge:u,onClick:m,className:f="",style:v={},href:s,target:x},y)=>{const l=I(),c="var(--glass-theme-accent-primary, #5ac8ff)",h="var(--glass-theme-text, var(--glass-text-primary))",w=l?"0ms":"var(--glass-theme-motion-hover, 180ms)",p=()=>{!a&&m&&m(b)},N=i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),p())},j={position:"relative",display:"inline-flex",alignItems:"center",gap:"8px",padding:"12px 20px",border:"none",borderRadius:"var(--glass-theme-button-radius, var(--glass-radius-md, 16px))",background:t?"color-mix(in srgb, var(--glass-theme-accent-primary, rgba(96, 165, 250, 0.65)) 24%, transparent)":"transparent",color:h,fontSize:"14px",fontWeight:t?600:400,cursor:a?"not-allowed":"pointer",opacity:a?.5:t?1:.82,transition:l?"none":`all ${w} cubic-bezier(0.4, 0, 0.2, 1)`,textDecoration:"none",userSelect:"none",...v},q=s?"a":"button";return e.jsxs(q,{ref:y,className:`glass-tab-item ${t?"active":""} ${a?"disabled":""} ${f}`,style:{...j},onClick:s?void 0:p,onKeyDown:s?void 0:N,disabled:s?void 0:a,href:s,target:x,role:"tab","aria-selected":t,"aria-disabled":a,tabIndex:a?-1:0,children:[d&&e.jsx("span",{className:"glass-tab-item-icon","aria-hidden":"true",children:d}),e.jsx("span",{className:"glass-tab-item-label",children:o||g}),u!==void 0&&e.jsx("span",{className:"glass-tab-item-badge",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:"20px",height:"20px",padding:"0 6px",borderRadius:"10px",background:c,color:"var(--glass-theme-text, #05111d)",fontSize:"11px",fontWeight:600},children:u}),t&&!l&&e.jsx("span",{className:"glass-tab-item-indicator",style:{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:"80%",height:"2px",background:c,borderRadius:"2px 2px 0 0"},"aria-hidden":"true"}),e.jsx("style",{children:`
          .glass-tab-item:hover:not(.disabled) {
            background: var(
              --glass-theme-accent-primary,
              rgba(255, 255, 255, 0.08)
            ) !important;
            transform: translateY(-1px);
          }

          .glass-tab-item:active:not(.disabled) {
            transform: translateY(0);
          }

          .glass-tab-item:focus-visible {
            outline: none;
            box-shadow: var(
              --glass-theme-focus-ring,
              0 0 0 3px rgba(99, 102, 241, 0.3)
            );
          }

          .glass-tab-item-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
          }

          @media (prefers-reduced-motion: reduce) {
            .glass-tab-item,
            .glass-tab-item-indicator {
              transition: none !important;
              animation: none !important;
            }
            .glass-tab-item:hover:not(.disabled) {
              transform: none !important;
            }
          }
        `})]})});n.displayName="GlassTabItem";try{n.displayName="GlassTabItem",n.__docgenInfo={description:"Glass Tab Item Component",displayName:"GlassTabItem",props:{label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string"}},value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"string"}},active:{defaultValue:{value:"false"},description:"",name:"active",required:!1,type:{name:"boolean | undefined"}},disabled:{defaultValue:{value:"false"},description:"",name:"disabled",required:!1,type:{name:"boolean | undefined"}},icon:{defaultValue:null,description:"",name:"icon",required:!1,type:{name:"ReactNode"}},badge:{defaultValue:null,description:"",name:"badge",required:!1,type:{name:"string | number | undefined"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"((value: string) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},href:{defaultValue:null,description:"",name:"href",required:!1,type:{name:"string | undefined"}},target:{defaultValue:null,description:"",name:"target",required:!1,type:{name:"string | undefined"}}}}}catch{}const S={title:"Navigation/Glass Tab Item",component:n,parameters:{layout:"centered",docs:{description:{component:"Component-owned Storybook coverage for GlassTabItem."}}}},r={args:{label:"Overview",value:"overview"},render:()=>e.jsxs("div",{role:"tablist",className:"glass-flex glass-gap-2 glass-p-3 glass-radius-lg glass-surface-subtle",children:[e.jsx(n,{label:"Overview",value:"overview",active:!0,badge:"1"}),e.jsx(n,{label:"Settings",value:"settings"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Overview",
    value: "overview"
  },
  render: () => <div role="tablist" className="glass-flex glass-gap-2 glass-p-3 glass-radius-lg glass-surface-subtle">
      <Component label="Overview" value="overview" active badge="1" />
      <Component label="Settings" value="settings" />
    </div>
}`,...r.parameters?.docs?.source}}};const _=["Default"];export{r as Default,_ as __namedExportsOrder,S as default};
