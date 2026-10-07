import{r as c,j as e,c as t}from"./iframe-Cqi-9gHA.js";import{L as g}from"./LiquidGlassMaterial-D0WtSJtx.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassLayerProvider-BPcOSNPa.js";const a=c.forwardRef(({open:o,items:s,onOpenChange:i,sourceId:l,className:d,...p},u)=>o?e.jsxs(g,{ref:u,material:"liquid",radius:"xl",className:t("liquid-glass-popover-menu glass-on-light glass-min-w-56 glass-p-2",d),intent:"neutral",tintMode:"light",adaptToContent:!1,environmentAdaptation:!1,style:{background:"linear-gradient(135deg, rgba(255,255,255,0.32), rgba(255,255,255,0.16)), linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.08))","--glass-theme-text":"rgb(15,23,42)","--glass-text-primary":"rgb(15,23,42)","--glass-text-secondary":"rgba(15,23,42,0.76)","--glass-text-tertiary":"rgba(15,23,42,0.72)"},"data-liquid-glass-popover-menu":"true","data-source-id":l,...p,children:[e.jsx("style",{children:`
          .liquid-glass-popover-menu button {
            background-color: rgba(var(--glass-color-white) / 0.12) !important;
            border: 1px solid rgba(255, 255, 255, 0.28) !important;
            color: rgb(15, 23, 42) !important;
            min-height: 44px;
          }

          .liquid-glass-popover-menu button span {
            color: rgb(15, 23, 42) !important;
          }

          .liquid-glass-popover-menu button .glass-text-secondary {
            color: rgb(51, 65, 85) !important;
          }
        `}),e.jsx("div",{role:"menu",className:"glass-flex glass-flex-col glass-gap-2",children:s.map(n=>e.jsxs("button",{type:"button",role:"menuitem",disabled:n.disabled,"aria-checked":n.selected,className:t("glass-flex glass-items-center glass-gap-2 glass-radius-lg glass-px-3 glass-py-2 glass-text-left",n.selected&&"glass-surface-overlay"),onClick:()=>{n.onSelect?.(),i?.(!1)},children:[n.icon,e.jsx("span",{className:"glass-flex-1",children:n.label}),n.shortcut&&e.jsx("span",{className:"glass-text-xs glass-text-secondary",children:n.shortcut})]},n.id))})]}):null);a.displayName="LiquidGlassPopoverMenu";try{a.displayName="LiquidGlassPopoverMenu",a.__docgenInfo={description:"",displayName:"LiquidGlassPopoverMenu",props:{open:{defaultValue:null,description:"",name:"open",required:!0,type:{name:"boolean"}},items:{defaultValue:null,description:"",name:"items",required:!0,type:{name:"LiquidGlassPopoverMenuItem[]"}},onOpenChange:{defaultValue:null,description:"",name:"onOpenChange",required:!1,type:{name:"((open: boolean) => void) | undefined"}},sourceId:{defaultValue:null,description:"",name:"sourceId",required:!1,type:{name:"string | undefined"}}}}}catch{}const y={title:"Surfaces/Modals/Liquid Glass Popover Menu",component:a,parameters:{layout:"fullscreen",previewSurface:"app"}},r={render:()=>e.jsxs("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:32},children:[e.jsx("style",{children:`
        .liquid-popover-story,
        .liquid-popover-story * {
          color: #0f172a !important;
        }

        .liquid-popover-story > button {
          appearance: none;
          -webkit-appearance: none;
          border: 1px solid rgba(255,255,255,.28) !important;
          background: rgba(255,255,255,.18) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 8px 18px rgba(20,20,20,.10);
        }

        .liquid-glass-popover-menu button {
          appearance: none;
          -webkit-appearance: none;
          border: 1px solid rgba(255,255,255,.28);
          border-radius: 12px;
          background: rgba(255,255,255,.18);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.28);
          color: #0f172a !important;
          cursor: pointer;
          font: inherit;
          width: 100%;
        }
      `}),e.jsxs("div",{className:"liquid-popover-story",style:{position:"relative",width:360,minHeight:260,borderRadius:28,padding:24,background:"rgba(255,255,255,0.82)",color:"#0f172a"},children:[e.jsx("button",{type:"button",style:{border:0,borderRadius:999,background:"rgba(15,23,42,.10)",color:"#0f172a",padding:"8px 14px",font:"inherit"},children:"More actions"}),e.jsx("div",{style:{position:"absolute",top:72,left:24},children:e.jsx(a,{open:!0,items:[{id:"copy",label:"Copy",shortcut:"Cmd C"},{id:"duplicate",label:"Duplicate",shortcut:"Cmd D",selected:!0},{id:"archive",label:"Archive"}]})})]})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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

        .liquid-popover-story > button {
          appearance: none;
          -webkit-appearance: none;
          border: 1px solid rgba(255,255,255,.28) !important;
          background: rgba(255,255,255,.18) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 8px 18px rgba(20,20,20,.10);
        }

        .liquid-glass-popover-menu button {
          appearance: none;
          -webkit-appearance: none;
          border: 1px solid rgba(255,255,255,.28);
          border-radius: 12px;
          background: rgba(255,255,255,.18);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.28);
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
      }}>
          More actions
        </button>
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
}`,...r.parameters?.docs?.source}}};const v=["Default"];export{r as Default,v as __namedExportsOrder,y as default};
