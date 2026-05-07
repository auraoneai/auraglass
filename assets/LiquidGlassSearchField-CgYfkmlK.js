import{r as t,j as a,c as S}from"./iframe-C1j_9pGm.js";import{L as f}from"./LiquidGlassMaterial-BfOIzeQM.js";const s={border:0,background:"transparent",color:"inherit",font:"inherit",outline:"none"},V=`
  .liquid-glass-search-field,
  .liquid-glass-search-field * {
    box-sizing: border-box;
  }

  .liquid-glass-search-field-control {
    color: #0f172a;
  }

  .liquid-glass-search-field-control input::placeholder {
    color: rgba(51, 65, 85, 0.7);
  }

  .liquid-glass-search-field-dropdown {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.78)) !important;
    border: 1px solid rgba(15, 23, 42, 0.14);
    color: #0f172a;
    box-shadow: 0 22px 56px rgba(15, 23, 42, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.78);
    overflow: hidden;
  }

  .liquid-glass-search-field-option {
    color: #0f172a;
    border: 1px solid transparent;
  }

  .liquid-glass-search-field-option:hover,
  .liquid-glass-search-field-option:focus-visible {
    background: rgba(219, 234, 254, 0.78) !important;
    border-color: rgba(37, 99, 235, 0.18);
  }
`,d=t.forwardRef(({value:o,onValueChange:m,onSelect:h,placeholder:u="Search",placement:x="auto",minimized:i=!1,onMinimizedChange:b,suggestions:c=[],results:r=[],scope:p,className:q,...y},v)=>{const[j,N]=t.useState(""),l=o??j,n=t.useMemo(()=>l?r.filter(e=>e.label.toLowerCase().includes(l.toLowerCase())):r.slice(0,6),[l,r]),g=e=>{N(e),m?.(e)};return a.jsxs("div",{ref:v,className:S("liquid-glass-search-field glass-relative",q),"data-liquid-glass-search-field":"true","data-placement":x,"data-minimized":i?"true":"false",...y,children:[a.jsx("style",{children:V}),a.jsx(f,{material:"liquid",radius:"full",interactive:!0,className:"liquid-glass-search-field-control",children:a.jsxs("label",{className:"glass-flex glass-items-center glass-gap-2 glass-px-3 glass-py-2",children:[a.jsx("span",{className:"glass-sr-only",children:u}),p&&a.jsx("span",{className:"glass-text-xs glass-text-secondary",children:p}),i?a.jsx("button",{type:"button",onClick:()=>b?.(!1),"aria-label":"Open search",style:{...s,cursor:"pointer"},children:"Search"}):a.jsx("input",{value:l,onChange:e=>g(e.target.value),placeholder:u,className:"glass-min-w-0 glass-flex-1 glass-bg-transparent glass-outline-none",style:{...s,minWidth:0,color:"#0f172a"},role:"combobox","aria-expanded":n.length>0})]})}),!i&&(n.length>0||c.length>0)&&a.jsx(f,{material:"liquid",radius:"xl",className:"liquid-glass-search-field-dropdown glass-absolute glass-left-0 glass-right-0 glass-top-full glass-z-50 glass-mt-2",children:a.jsxs("div",{role:"listbox",className:"glass-flex glass-flex-col glass-p-2",style:{maxHeight:280,overflowY:"auto"},children:[n.map(e=>a.jsxs("button",{type:"button",role:"option",className:"liquid-glass-search-field-option glass-radius-lg glass-px-3 glass-py-2 glass-text-left",style:{...s,cursor:"pointer"},onClick:()=>h?.(e),children:[a.jsx("span",{className:"glass-block",children:e.label}),e.description&&a.jsx("span",{className:"glass-text-xs glass-text-secondary",children:e.description})]},e.id)),!l&&c.map(e=>a.jsx("button",{type:"button",className:"liquid-glass-search-field-option glass-radius-lg glass-px-3 glass-py-2 glass-text-left",style:{...s,cursor:"pointer"},onClick:()=>g(e),children:e},e))]})})]})});d.displayName="LiquidGlassSearchField";try{d.displayName="LiquidGlassSearchField",d.__docgenInfo={description:"",displayName:"LiquidGlassSearchField",props:{value:{defaultValue:null,description:"",name:"value",required:!1,type:{name:"string | undefined"}},onValueChange:{defaultValue:null,description:"",name:"onValueChange",required:!1,type:{name:"((value: string) => void) | undefined"}},onSelect:{defaultValue:null,description:"",name:"onSelect",required:!1,type:{name:"((result: LiquidGlassSearchResult) => void) | undefined"}},placeholder:{defaultValue:{value:"Search"},description:"",name:"placeholder",required:!1,type:{name:"string | undefined"}},placement:{defaultValue:{value:"auto"},description:"",name:"placement",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"center"'},{value:'"auto"'},{value:'"bottom"'},{value:'"top-trailing"'}]}},minimized:{defaultValue:{value:"false"},description:"",name:"minimized",required:!1,type:{name:"boolean | undefined"}},onMinimizedChange:{defaultValue:null,description:"",name:"onMinimizedChange",required:!1,type:{name:"((minimized: boolean) => void) | undefined"}},suggestions:{defaultValue:{value:"[]"},description:"",name:"suggestions",required:!1,type:{name:"string[] | undefined"}},results:{defaultValue:{value:"[]"},description:"",name:"results",required:!1,type:{name:"LiquidGlassSearchResult[] | undefined"}},scope:{defaultValue:null,description:"",name:"scope",required:!1,type:{name:"string | undefined"}}}}}catch{}export{d as L};
