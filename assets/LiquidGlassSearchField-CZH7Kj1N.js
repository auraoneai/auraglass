import{r as n,j as a,c as N}from"./iframe-CrdWMSIk.js";import{L as f}from"./LiquidGlassMaterial-YBLuTURd.js";const s={border:0,background:"transparent",color:"inherit",font:"inherit",outline:"none"},V=`
  .liquid-glass-search-field,
  .liquid-glass-search-field * {
    box-sizing: border-box;
  }

  .liquid-glass-search-field-control {
    color: rgba(248, 250, 252, 0.96);
  }

  .liquid-glass-search-field-control input::placeholder {
    color: rgba(226, 232, 240, 0.68);
  }

  .liquid-glass-search-field-dropdown {
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.84)) !important;
    border: 1px solid rgba(148, 163, 184, 0.24);
    color: rgba(248, 250, 252, 0.96);
    box-shadow: 0 22px 56px rgba(2, 6, 23, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.12);
    overflow: hidden;
  }

  .liquid-glass-search-field-option {
    background: rgba(15, 23, 42, 0.62) !important;
    color: rgba(248, 250, 252, 0.96) !important;
    border: 1px solid transparent;
  }

  .liquid-glass-search-field-option span {
    color: rgba(248, 250, 252, 0.96) !important;
  }

  [data-liquid-glass-search-field="true"] button.liquid-glass-search-field-option {
    background: rgba(15, 23, 42, 0.7) !important;
    color: rgba(248, 250, 252, 0.96) !important;
  }

  [data-liquid-glass-search-field="true"] button.liquid-glass-search-field-option span,
  [data-liquid-glass-search-field="true"] button.liquid-glass-search-field-option .glass-block,
  [data-liquid-glass-search-field="true"] button.liquid-glass-search-field-option .glass-text-secondary {
    color: rgba(248, 250, 252, 0.96) !important;
  }

  .liquid-glass-search-field-option:hover,
  .liquid-glass-search-field-option:focus-visible {
    background: rgba(56, 189, 248, 0.2) !important;
    border-color: rgba(125, 211, 252, 0.28);
  }
`,o=n.forwardRef(({value:d,onValueChange:m,onSelect:h,placeholder:u="Search",placement:b="auto",minimized:i=!1,onMinimizedChange:x,suggestions:c=[],results:r=[],scope:p,className:q,...y},v)=>{const[S,j]=n.useState(""),l=d??S,t=n.useMemo(()=>l?r.filter(e=>e.label.toLowerCase().includes(l.toLowerCase())):r.slice(0,6),[l,r]),g=e=>{j(e),m?.(e)};return a.jsxs("div",{ref:v,className:N("liquid-glass-search-field glass-relative",q),"data-liquid-glass-search-field":"true","data-placement":b,"data-minimized":i?"true":"false",...y,children:[a.jsx("style",{children:V}),a.jsx(f,{material:"liquid",radius:"full",interactive:!0,elevation:"level1",sheen:0,adaptToContent:!1,enableRefraction:!1,enableReflection:!1,performanceLevel:"efficient",className:"liquid-glass-search-field-control",style:{background:'/* Use createGlassStyle({ intent: "primary", elevation: "level3" }) */',border:"1px solid rgba(148, 163, 184, 0.24)",boxShadow:"0 10px 28px rgba(2, 6, 23, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.08)"},children:a.jsxs("label",{className:"glass-flex glass-items-center glass-gap-2 glass-px-3 glass-py-2",children:[a.jsx("span",{className:"glass-sr-only",children:u}),p&&a.jsx("span",{className:"glass-text-xs glass-text-secondary",children:p}),i?a.jsx("button",{type:"button",onClick:()=>x?.(!1),"aria-label":"Open search",style:{...s,cursor:"pointer"},children:"Search"}):a.jsx("input",{value:l,onChange:e=>g(e.target.value),placeholder:u,className:"glass-min-w-0 glass-flex-1 glass-bg-transparent glass-outline-none",style:{...s,minWidth:0},role:"combobox","aria-expanded":t.length>0})]})}),!i&&(t.length>0||c.length>0)&&a.jsx(f,{material:"liquid",radius:"xl",elevation:"level1",sheen:0,adaptToContent:!1,enableRefraction:!1,enableReflection:!1,performanceLevel:"efficient",className:"liquid-glass-search-field-dropdown glass-absolute glass-left-0 glass-right-0 glass-top-full glass-z-50 glass-mt-2",style:{background:'/* Use createGlassStyle({ intent: "primary", elevation: "level3" }) */',border:"1px solid rgba(148, 163, 184, 0.2)",boxShadow:"0 18px 44px rgba(2, 6, 23, 0.34)"},children:a.jsxs("div",{role:"listbox",className:"glass-flex glass-flex-col glass-p-2",style:{maxHeight:280,overflowY:"auto"},children:[t.map(e=>a.jsxs("button",{type:"button",role:"option",className:"liquid-glass-search-field-option glass-radius-lg glass-px-3 glass-py-2 glass-text-left",style:{...s,cursor:"pointer"},onClick:()=>h?.(e),children:[a.jsx("span",{className:"glass-block",children:e.label}),e.description&&a.jsx("span",{className:"glass-text-xs glass-text-secondary",children:e.description})]},e.id)),!l&&c.map(e=>a.jsx("button",{type:"button",className:"liquid-glass-search-field-option glass-radius-lg glass-px-3 glass-py-2 glass-text-left",style:{...s,cursor:"pointer"},onClick:()=>g(e),children:e},e))]})})]})});o.displayName="LiquidGlassSearchField";try{o.displayName="LiquidGlassSearchField",o.__docgenInfo={description:"",displayName:"LiquidGlassSearchField",props:{value:{defaultValue:null,description:"",name:"value",required:!1,type:{name:"string | undefined"}},onValueChange:{defaultValue:null,description:"",name:"onValueChange",required:!1,type:{name:"((value: string) => void) | undefined"}},onSelect:{defaultValue:null,description:"",name:"onSelect",required:!1,type:{name:"((result: LiquidGlassSearchResult) => void) | undefined"}},placeholder:{defaultValue:{value:"Search"},description:"",name:"placeholder",required:!1,type:{name:"string | undefined"}},placement:{defaultValue:{value:"auto"},description:"",name:"placement",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"center"'},{value:'"auto"'},{value:'"bottom"'},{value:'"top-trailing"'}]}},minimized:{defaultValue:{value:"false"},description:"",name:"minimized",required:!1,type:{name:"boolean | undefined"}},onMinimizedChange:{defaultValue:null,description:"",name:"onMinimizedChange",required:!1,type:{name:"((minimized: boolean) => void) | undefined"}},suggestions:{defaultValue:{value:"[]"},description:"",name:"suggestions",required:!1,type:{name:"string[] | undefined"}},results:{defaultValue:{value:"[]"},description:"",name:"results",required:!1,type:{name:"LiquidGlassSearchResult[] | undefined"}},scope:{defaultValue:null,description:"",name:"scope",required:!1,type:{name:"string | undefined"}}}}}catch{}export{o as L};
