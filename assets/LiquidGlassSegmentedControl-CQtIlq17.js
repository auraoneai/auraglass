import{r as p,j as a,c as i}from"./iframe-CN7unHsM.js";import{L as m,a as g}from"./LiquidGlassMaterial-BH5nbjzw.js";const s=p.forwardRef(({segments:l,value:t,onValueChange:n,density:d="comfortable",className:o,...u},c)=>a.jsxs(m,{ref:c,material:"liquid",radius:"full",className:i("liquid-glass-segmented-control glass-inline-flex",o),"data-density":d,...u,children:[a.jsx("style",{children:`
        .liquid-glass-segmented-control button {
          background-color: rgba(15, 23, 42, 0.72) !important;
          border: 1px solid rgba(255, 255, 255, 0.24) !important;
          color: rgba(255, 255, 255, 0.95) !important;
        }

        .liquid-glass-segmented-control button span {
          color: rgba(255, 255, 255, 0.95) !important;
        }
      `}),a.jsx(g,{className:"glass-flex glass-gap-1 glass-p-1",role:"group",children:l.map(e=>{const r=e.id===t;return a.jsxs("button",{type:"button",disabled:e.disabled,"aria-pressed":r,className:i("glass-flex glass-items-center glass-gap-1 glass-radius-full glass-px-3 glass-py-1 glass-text-sm",r&&"glass-surface-primary glass-text-primary"),onClick:()=>n?.(e.id),children:[e.icon,a.jsx("span",{children:e.label})]},e.id)})})]}));s.displayName="LiquidGlassSegmentedControl";try{s.displayName="LiquidGlassSegmentedControl",s.__docgenInfo={description:"",displayName:"LiquidGlassSegmentedControl",props:{segments:{defaultValue:null,description:"",name:"segments",required:!0,type:{name:"LiquidGlassSegment[]"}},value:{defaultValue:null,description:"",name:"value",required:!1,type:{name:"string | undefined"}},onValueChange:{defaultValue:null,description:"",name:"onValueChange",required:!1,type:{name:"((value: string) => void) | undefined"}},density:{defaultValue:{value:"comfortable"},description:"",name:"density",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"compact"'},{value:'"comfortable"'},{value:'"spacious"'}]}}}}}catch{}export{s as L};
