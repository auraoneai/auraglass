import{r as c,j as e,c as a}from"./iframe-DinEdlu4.js";import{L as m}from"./LiquidGlassMaterial-CvuHza0N.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassLayerProvider-GNUOtjWn.js";const r=c.forwardRef(({open:s,items:t,onOpenChange:i,sourceId:l,className:d,...p},u)=>s?e.jsxs(m,{ref:u,material:"liquid",radius:"xl",className:a("liquid-glass-popover-menu glass-min-w-56 glass-p-2",d),"data-liquid-glass-popover-menu":"true","data-source-id":l,...p,children:[e.jsx("style",{children:`
          .liquid-glass-popover-menu button {
            background-color: rgba(15, 23, 42, 0.72) !important;
            border: 1px solid rgba(255, 255, 255, 0.24) !important;
            color: rgba(255, 255, 255, 0.95) !important;
          }

          .liquid-glass-popover-menu button span {
            color: rgba(255, 255, 255, 0.95) !important;
          }

          .liquid-glass-popover-menu button .glass-text-secondary {
            color: rgba(255, 255, 255, 0.78) !important;
          }
        `}),e.jsx("div",{role:"menu",className:"glass-flex glass-flex-col glass-gap-1",children:t.map(n=>e.jsxs("button",{type:"button",role:"menuitem",disabled:n.disabled,"aria-checked":n.selected,className:a("glass-flex glass-items-center glass-gap-2 glass-radius-lg glass-px-3 glass-py-2 glass-text-left",n.selected&&"glass-surface-primary"),onClick:()=>{n.onSelect?.(),i?.(!1)},children:[n.icon,e.jsx("span",{className:"glass-flex-1",children:n.label}),n.shortcut&&e.jsx("span",{className:"glass-text-xs glass-text-secondary",children:n.shortcut})]},n.id))})]}):null);r.displayName="LiquidGlassPopoverMenu";try{r.displayName="LiquidGlassPopoverMenu",r.__docgenInfo={description:"",displayName:"LiquidGlassPopoverMenu",props:{open:{defaultValue:null,description:"",name:"open",required:!0,type:{name:"boolean"}},items:{defaultValue:null,description:"",name:"items",required:!0,type:{name:"LiquidGlassPopoverMenuItem[]"}},onOpenChange:{defaultValue:null,description:"",name:"onOpenChange",required:!1,type:{name:"((open: boolean) => void) | undefined"}},sourceId:{defaultValue:null,description:"",name:"sourceId",required:!1,type:{name:"string | undefined"}}}}}catch{}const v={title:"Surfaces/Modals/Liquid Glass Popover Menu",component:r,parameters:{layout:"fullscreen",previewSurface:"app"}},o={render:()=>e.jsxs("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:32},children:[e.jsx("style",{children:`
        .liquid-popover-story,
        .liquid-popover-story * {
          color: #0f172a !important;
        }

        .liquid-glass-popover-menu button {
          border: 0;
          background: transparent;
          color: #0f172a !important;
          cursor: pointer;
          font: inherit;
          width: 100%;
        }
      `}),e.jsxs("div",{className:"liquid-popover-story",style:{position:"relative",width:360,minHeight:260,borderRadius:28,padding:24,background:"rgba(255,255,255,0.82)",color:"#0f172a"},children:[e.jsx("button",{type:"button",style:{border:0,borderRadius:999,background:"rgba(15,23,42,.10)",color:"#0f172a",padding:"8px 14px",font:"inherit"},children:"More actions"}),e.jsx("div",{style:{position:"absolute",top:72,left:24},children:e.jsx(r,{open:!0,items:[{id:"copy",label:"Copy",shortcut:"Cmd C"},{id:"duplicate",label:"Duplicate",shortcut:"Cmd D",selected:!0},{id:"archive",label:"Archive"}]})})]})]})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 32
  }}>
      <style>{\`
        .liquid-popover-story,
        .liquid-popover-story * {
          color: #0f172a !important;
        }

        .liquid-glass-popover-menu button {
          border: 0;
          background: transparent;
          color: #0f172a !important;
          cursor: pointer;
          font: inherit;
          width: 100%;
        }
      \`}</style>
      <div className="liquid-popover-story" style={{
      position: "relative",
      width: 360,
      minHeight: 260,
      borderRadius: 28,
      padding: 24,
      background: "rgba(255,255,255,0.82)",
      color: "#0f172a"
    }}>
        <button type="button" style={{
        border: 0,
        borderRadius: 999,
        background: "rgba(15,23,42,.10)",
        color: "#0f172a",
        padding: "8px 14px",
        font: "inherit"
      }}>More actions</button>
        <div style={{
        position: "absolute",
        top: 72,
        left: 24
      }}>
          <LiquidGlassPopoverMenu open items={[{
          id: "copy",
          label: "Copy",
          shortcut: "Cmd C"
        }, {
          id: "duplicate",
          label: "Duplicate",
          shortcut: "Cmd D",
          selected: true
        }, {
          id: "archive",
          label: "Archive"
        }]} />
        </div>
      </div>
    </div>
}`,...o.parameters?.docs?.source}}};const h=["Default"];export{o as Default,h as __namedExportsOrder,v as default};
