import{r as n,j as a,c as k}from"./iframe-RsoZoStf.js";import{L as g}from"./LiquidGlassMaterial-GdijC9oA.js";const s={border:0,background:"transparent",color:"inherit",font:"inherit",outline:"none"},N=`
  .liquid-glass-search-field,
  .liquid-glass-search-field * {
    box-sizing: border-box;
  }

  .liquid-glass-search-field-control {
    color: var(--glass-text-primary);
    min-height: 44px;
    backdrop-filter: blur(16px) saturate(1.4) brightness(1.08) contrast(1.04) !important;
    -webkit-backdrop-filter: blur(16px) saturate(1.4) brightness(1.08) contrast(1.04) !important;
    transition-property: transform, box-shadow, border-color, background-color !important;
  }

  .liquid-glass-search-field-control > label {
    min-height: 44px;
  }

  .liquid-glass-search-field-control input::placeholder {
    color: var(--glass-text-tertiary);
  }

  .liquid-glass-search-field-dropdown {
    /* LiquidGlassMaterial owns the canonical white-frost fill, hairline
       border, and blur/filter chain; this selector only owns overflow. */
    color: var(--glass-theme-text, var(--glass-text-primary));
    overflow: hidden;
    backdrop-filter: blur(16px) saturate(1.4) brightness(1.08) contrast(1.04) !important;
    -webkit-backdrop-filter: blur(16px) saturate(1.4) brightness(1.08) contrast(1.04) !important;
    transition-property: transform, box-shadow, border-color, background-color !important;
  }

  .liquid-glass-search-field-option {
    display: block;
    width: 100%;
    min-height: 44px;
    background: rgba(var(--glass-color-white) / var(--glass-opacity-10));
    color: var(--glass-theme-text, var(--glass-text-primary));
    border: 1px solid transparent;
  }

  .liquid-glass-search-field-option:hover,
  .liquid-glass-search-field-option:focus-visible {
    background: rgba(var(--glass-color-white) / var(--glass-opacity-20));
    border-color: var(--glass-border-hover);
  }
`,o=n.forwardRef(({value:d,onValueChange:h,onSelect:m,placeholder:c="Search",placement:b="auto",minimized:t=!1,onMinimizedChange:x,suggestions:u=[],results:i=[],scope:p,className:v,...y},q)=>{const[w,j]=n.useState(""),l=d??w,r=n.useMemo(()=>l?i.filter(e=>e.label.toLowerCase().includes(l.toLowerCase())):i.slice(0,6),[l,i]),f=e=>{j(e),h?.(e)};return a.jsxs("div",{ref:q,className:k("liquid-glass-search-field glass-relative",v),"data-liquid-glass-search-field":"true","data-placement":b,"data-minimized":t?"true":"false",...y,children:[a.jsx("style",{children:N}),a.jsx(g,{material:"liquid",intent:"neutral",radius:"full",elevation:"level1",tintMode:"light",sheen:0,adaptToContent:!1,enableRefraction:!1,enableReflection:!1,adaptToMotion:!1,enableMicroInteractions:!1,performanceLevel:"efficient",className:"liquid-glass-search-field-control",children:a.jsxs("label",{className:"glass-flex glass-items-center glass-gap-2 glass-px-3 glass-py-2",children:[a.jsx("span",{className:"glass-sr-only",children:c}),p&&a.jsx("span",{className:"glass-text-xs glass-text-secondary",children:p}),t?a.jsx("button",{type:"button",onClick:()=>x?.(!1),"aria-label":"Open search",style:{...s,cursor:"pointer"},children:"Search"}):a.jsx("input",{value:l,onChange:e=>f(e.target.value),placeholder:c,className:"glass-min-w-0 glass-flex-1 glass-bg-transparent glass-outline-none",style:{...s,minWidth:0},role:"combobox","aria-expanded":r.length>0})]})}),!t&&(r.length>0||u.length>0)&&a.jsx(g,{material:"liquid",intent:"neutral",radius:"xl",elevation:"level1",tintMode:"light",sheen:0,adaptToContent:!1,enableRefraction:!1,enableReflection:!1,adaptToMotion:!1,enableMicroInteractions:!1,performanceLevel:"efficient",className:"liquid-glass-search-field-dropdown glass-absolute glass-left-0 glass-right-0 glass-top-full glass-z-50 glass-mt-2",style:{position:"absolute",insetInline:0,top:"calc(100% + 8px)",zIndex:50},children:a.jsxs("div",{role:"listbox",className:"glass-flex glass-flex-col glass-p-2",style:{maxHeight:280,overflowY:"auto",gap:8},children:[r.map(e=>a.jsxs("button",{type:"button",role:"option",className:"liquid-glass-search-field-option glass-radius-lg glass-px-3 glass-py-2 glass-text-left",style:{...s,cursor:"pointer"},onClick:()=>m?.(e),children:[a.jsx("span",{className:"glass-block",children:e.label}),e.description&&a.jsx("span",{className:"glass-text-xs glass-text-secondary",children:e.description})]},e.id)),!l&&u.map(e=>a.jsx("button",{type:"button",className:"liquid-glass-search-field-option glass-radius-lg glass-px-3 glass-py-2 glass-text-left",style:{...s,cursor:"pointer"},onClick:()=>f(e),children:e},e))]})})]})});o.displayName="LiquidGlassSearchField";try{o.displayName="LiquidGlassSearchField",o.__docgenInfo={description:"",displayName:"LiquidGlassSearchField",props:{value:{defaultValue:null,description:"",name:"value",required:!1,type:{name:"string | undefined"}},onValueChange:{defaultValue:null,description:"",name:"onValueChange",required:!1,type:{name:"((value: string) => void) | undefined"}},onSelect:{defaultValue:null,description:"",name:"onSelect",required:!1,type:{name:"((result: LiquidGlassSearchResult) => void) | undefined"}},placeholder:{defaultValue:{value:"Search"},description:"",name:"placeholder",required:!1,type:{name:"string | undefined"}},placement:{defaultValue:{value:"auto"},description:"",name:"placement",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"center"'},{value:'"auto"'},{value:'"bottom"'},{value:'"top-trailing"'}]}},minimized:{defaultValue:{value:"false"},description:"",name:"minimized",required:!1,type:{name:"boolean | undefined"}},onMinimizedChange:{defaultValue:null,description:"",name:"onMinimizedChange",required:!1,type:{name:"((minimized: boolean) => void) | undefined"}},suggestions:{defaultValue:{value:"[]"},description:"",name:"suggestions",required:!1,type:{name:"string[] | undefined"}},results:{defaultValue:{value:"[]"},description:"",name:"results",required:!1,type:{name:"LiquidGlassSearchResult[] | undefined"}},scope:{defaultValue:null,description:"",name:"scope",required:!1,type:{name:"string | undefined"}}}}}catch{}export{o as L};
