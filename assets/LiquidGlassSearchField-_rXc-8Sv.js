import{r as t,j as a,c as N}from"./iframe-GrkikuRp.js";import{L as f}from"./LiquidGlassMaterial-QJo0sijf.js";const s={border:0,background:"transparent",color:"inherit",font:"inherit",outline:"none"},w=`
  .liquid-glass-search-field,
  .liquid-glass-search-field * {
    box-sizing: border-box;
  }

  .liquid-glass-search-field-control {
    color: var(--glass-text-primary);
  }

  .liquid-glass-search-field-control input::placeholder {
    color: var(--glass-text-tertiary);
  }

  .liquid-glass-search-field-dropdown {
    background: var(--glass-neutral-level4-surface);
    border: 1px solid var(--glass-neutral-level4-border-color);
    color: var(--glass-neutral-level4-text-primary);
    backdrop-filter: blur(var(--glass-neutral-level4-blur)) var(--glass-filter-base);
    -webkit-backdrop-filter: blur(var(--glass-neutral-level4-blur)) var(--glass-filter-base);
    box-shadow: var(--glass-neutral-level4-shadow);
    overflow: hidden;
  }

  .liquid-glass-search-field-option {
    background: rgba(var(--glass-color-white) / 0.06);
    color: var(--glass-text-primary);
    border: 1px solid transparent;
  }

  .liquid-glass-search-field-option:hover,
  .liquid-glass-search-field-option:focus-visible {
    background: rgba(56, 189, 248, 0.2);
    border-color: rgba(125, 211, 252, 0.28);
  }
`,o=t.forwardRef(({value:d,onValueChange:m,onSelect:h,placeholder:u="Search",placement:b="auto",minimized:r=!1,onMinimizedChange:v,suggestions:c=[],results:i=[],scope:p,className:x,...y},q)=>{const[j,S]=t.useState(""),l=d??j,n=t.useMemo(()=>l?i.filter(e=>e.label.toLowerCase().includes(l.toLowerCase())):i.slice(0,6),[l,i]),g=e=>{S(e),m?.(e)};return a.jsxs("div",{ref:q,className:N("liquid-glass-search-field glass-relative",x),"data-liquid-glass-search-field":"true","data-placement":b,"data-minimized":r?"true":"false",...y,children:[a.jsx("style",{children:w}),a.jsx(f,{material:"liquid",radius:"full",interactive:!0,elevation:"level1",sheen:0,adaptToContent:!1,enableRefraction:!1,enableReflection:!1,performanceLevel:"efficient",className:"liquid-glass-search-field-control",style:{background:"var(--glass-primary-level3-surface)",border:"1px solid rgba(148, 163, 184, 0.24)",boxShadow:"0 10px 28px rgba(2, 6, 23, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.08)"},children:a.jsxs("label",{className:"glass-flex glass-items-center glass-gap-2 glass-px-3 glass-py-2",children:[a.jsx("span",{className:"glass-sr-only",children:u}),p&&a.jsx("span",{className:"glass-text-xs glass-text-secondary",children:p}),r?a.jsx("button",{type:"button",onClick:()=>v?.(!1),"aria-label":"Open search",style:{...s,cursor:"pointer"},children:"Search"}):a.jsx("input",{value:l,onChange:e=>g(e.target.value),placeholder:u,className:"glass-min-w-0 glass-flex-1 glass-bg-transparent glass-outline-none",style:{...s,minWidth:0},role:"combobox","aria-expanded":n.length>0})]})}),!r&&(n.length>0||c.length>0)&&a.jsx(f,{material:"liquid",radius:"xl",elevation:"level1",sheen:0,adaptToContent:!1,enableRefraction:!1,enableReflection:!1,performanceLevel:"efficient",className:"liquid-glass-search-field-dropdown glass-absolute glass-left-0 glass-right-0 glass-top-full glass-z-50 glass-mt-2",style:{background:"var(--glass-primary-level3-surface)",border:"1px solid rgba(148, 163, 184, 0.2)",boxShadow:"0 18px 44px rgba(2, 6, 23, 0.34)"},children:a.jsxs("div",{role:"listbox",className:"glass-flex glass-flex-col glass-p-2",style:{maxHeight:280,overflowY:"auto"},children:[n.map(e=>a.jsxs("button",{type:"button",role:"option",className:"liquid-glass-search-field-option glass-radius-lg glass-px-3 glass-py-2 glass-text-left",style:{...s,cursor:"pointer"},onClick:()=>h?.(e),children:[a.jsx("span",{className:"glass-block",children:e.label}),e.description&&a.jsx("span",{className:"glass-text-xs glass-text-secondary",children:e.description})]},e.id)),!l&&c.map(e=>a.jsx("button",{type:"button",className:"liquid-glass-search-field-option glass-radius-lg glass-px-3 glass-py-2 glass-text-left",style:{...s,cursor:"pointer"},onClick:()=>g(e),children:e},e))]})})]})});o.displayName="LiquidGlassSearchField";try{o.displayName="LiquidGlassSearchField",o.__docgenInfo={description:"",displayName:"LiquidGlassSearchField",props:{value:{defaultValue:null,description:"",name:"value",required:!1,type:{name:"string | undefined"}},onValueChange:{defaultValue:null,description:"",name:"onValueChange",required:!1,type:{name:"((value: string) => void) | undefined"}},onSelect:{defaultValue:null,description:"",name:"onSelect",required:!1,type:{name:"((result: LiquidGlassSearchResult) => void) | undefined"}},placeholder:{defaultValue:{value:"Search"},description:"",name:"placeholder",required:!1,type:{name:"string | undefined"}},placement:{defaultValue:{value:"auto"},description:"",name:"placement",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"center"'},{value:'"auto"'},{value:'"bottom"'},{value:'"top-trailing"'}]}},minimized:{defaultValue:{value:"false"},description:"",name:"minimized",required:!1,type:{name:"boolean | undefined"}},onMinimizedChange:{defaultValue:null,description:"",name:"onMinimizedChange",required:!1,type:{name:"((minimized: boolean) => void) | undefined"}},suggestions:{defaultValue:{value:"[]"},description:"",name:"suggestions",required:!1,type:{name:"string[] | undefined"}},results:{defaultValue:{value:"[]"},description:"",name:"results",required:!1,type:{name:"LiquidGlassSearchResult[] | undefined"}},scope:{defaultValue:null,description:"",name:"scope",required:!1,type:{name:"string | undefined"}}}}}catch{}export{o as L};
