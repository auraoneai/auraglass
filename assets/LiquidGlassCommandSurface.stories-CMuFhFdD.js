import{r as n,j as a,c as u}from"./iframe-Cqi-9gHA.js";import{L as v}from"./LiquidGlassMaterial-D0WtSJtx.js";import{L as w}from"./LiquidGlassScrollEdge-kV_JXW4I.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassLayerProvider-BPcOSNPa.js";const i=n.forwardRef(({open:r,onOpenChange:g,items:p,placeholder:h="Search commands",className:x,...b},f)=>{const[o,y]=n.useState(""),[t,d]=n.useState(0),m=n.useRef(null),c=n.useMemo(()=>p.filter(e=>e.label.toLowerCase().includes(o.toLowerCase())),[p,o]);return r?a.jsxs("div",{className:"glass-fixed glass-inset-0 glass-z-1200 glass-grid glass-place-items-start glass-overflow-y-auto glass-px-4 glass-py-16 sm:glass-px-6 sm:glass-py-24",children:[a.jsx("div",{"aria-hidden":"true","data-glass-overlay":"true",className:"glass-absolute glass-inset-0 glass-bg-white/20 glass-backdrop-blur-md",onClick:()=>g?.(!1)}),a.jsxs(v,{ref:f,material:"liquid",radius:"2xl",className:u("liquid-glass-command-surface glass-relative glass-z-10 glass-mx-auto glass-w-full glass-max-w-2xl glass-overflow-hidden",x),style:{background:"linear-gradient(135deg, rgba(255,255,255,0.30), rgba(255,255,255,0.18) 55%, rgba(255,255,255,0.12))",color:"var(--glass-theme-text, var(--glass-text-primary))","--glass-theme-text":"rgba(15,23,42,0.94)","--glass-theme-text-secondary":"rgba(15,23,42,0.76)"},...b,children:[a.jsx("input",{value:o,onChange:e=>y(e.target.value),onKeyDown:e=>{e.key==="Escape"&&g?.(!1),e.key==="ArrowDown"&&d(s=>Math.min(s+1,c.length-1)),e.key==="ArrowUp"&&d(s=>Math.max(s-1,0)),e.key==="Enter"&&c[t]?.onSelect?.()},role:"combobox","aria-expanded":!0,placeholder:h,className:"glass-w-full glass-bg-transparent glass-p-4 glass-outline-none"}),a.jsxs("div",{ref:m,role:"listbox",className:"glass-relative glass-max-h-[min(24rem,calc(100vh-12rem))] glass-overflow-y-auto glass-p-2 glass-space-y-2","data-liquid-glass-scroll-target":!0,children:[a.jsx(w,{edge:"top",styleMode:"soft",targetRef:m}),c.map((e,s)=>a.jsxs("button",{type:"button",role:"option","aria-selected":s===t,disabled:e.disabled,className:u("glass-flex glass-w-full glass-min-w-0 glass-items-center glass-gap-3 glass-radius-lg glass-px-3 glass-py-2 glass-text-left",s===t&&"glass-surface-primary/20"),style:{background:s===t?"rgba(255,255,255,0.24)":"rgba(255,255,255,0.12)",color:"var(--glass-theme-text, var(--glass-text-primary))"},onMouseEnter:()=>d(s),onClick:e.onSelect,children:[e.icon,a.jsxs("span",{className:"glass-min-w-0 glass-flex-1",children:[a.jsx("span",{className:"glass-block glass-truncate glass-text-primary",children:e.label}),e.description&&a.jsx("span",{className:"glass-block glass-truncate glass-text-xs glass-text-secondary",style:{color:"var(--glass-theme-text-secondary, var(--glass-text-secondary))"},children:e.description})]}),e.shortcut&&a.jsx("span",{className:"glass-shrink-0 glass-text-xs glass-text-secondary",style:{color:"var(--glass-theme-text-secondary, var(--glass-text-secondary))"},children:e.shortcut})]},e.id))]})]})]}):null});i.displayName="LiquidGlassCommandSurface";try{i.displayName="LiquidGlassCommandSurface",i.__docgenInfo={description:"",displayName:"LiquidGlassCommandSurface",props:{open:{defaultValue:null,description:"",name:"open",required:!0,type:{name:"boolean"}},onOpenChange:{defaultValue:null,description:"",name:"onOpenChange",required:!1,type:{name:"((open: boolean) => void) | undefined"}},items:{defaultValue:null,description:"",name:"items",required:!0,type:{name:"LiquidGlassCommandItem[]"}},placeholder:{defaultValue:{value:"Search commands"},description:"",name:"placeholder",required:!1,type:{name:"string | undefined"}}}}}catch{}const N={title:"Effects + Advanced/Liquid Glass Command Surface",component:i,parameters:{layout:"fullscreen",previewSurface:"app"}},l={render:()=>a.jsxs("div",{"data-bg":"light",className:"glass-on-light",style:{minHeight:"100vh",width:"100%",padding:32,boxSizing:"border-box",color:"#0f172a"},children:[a.jsx("style",{children:`
        .glass-liquid-command-story-backdrop {
          min-height: calc(100vh - 64px);
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(280px, .8fr);
          gap: 24px;
          border-radius: 32px;
          padding: 28px;
          background:
            radial-gradient(circle at 22% 24%, rgba(255,255,255,.30), rgba(255,255,255,.08) 28%),
            radial-gradient(circle at 78% 68%, rgba(148,163,184,.10), rgba(255,255,255,.08) 30%),
            linear-gradient(135deg, rgba(255,255,255,.64), rgba(236,238,240,.38));
          box-shadow: 0 24px 80px rgba(15,23,42,.14);
        }

        .glass-liquid-command-story-card {
          border-radius: 24px;
          padding: 22px;
          background: rgba(255,255,255,.52);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.64);
        }

        .liquid-glass-command-surface {
          color: #0f172a;
          box-shadow: 0 28px 90px rgba(15, 23, 42, .2);
        }

        .liquid-glass-command-surface input {
          appearance: none;
          color: #0f172a;
          caret-color: #2563eb;
        }

        .liquid-glass-command-surface button {
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font: inherit;
        }

        @media (max-width: 720px) {
          .glass-liquid-command-story-backdrop {
            min-height: calc(100vh - 40px);
            grid-template-columns: 1fr;
            padding: 20px;
          }
        }
      `}),a.jsxs("div",{className:"glass-liquid-command-story-backdrop","aria-hidden":"true",children:[a.jsxs("section",{className:"glass-liquid-command-story-card",children:[a.jsx("h2",{style:{margin:0,fontSize:28},children:"Workspace command center"}),a.jsx("p",{style:{maxWidth:520,color:"#475569"},children:"The command surface floats over real app content with enough spacing for groups, shortcuts, hover states, and scroll edge treatment."})]}),a.jsxs("section",{className:"glass-liquid-command-story-card",children:[a.jsx("strong",{children:"Recent activity"}),a.jsx("div",{style:{display:"grid",gap:10,marginTop:16},children:["Media export finished","Review room synced","Design tokens updated"].map(r=>a.jsx("span",{style:{borderRadius:16,padding:"10px 12px",background:"rgba(255,255,255,.54)"},children:r},r))})]})]}),a.jsx(i,{open:!0,placeholder:"Search commands",items:[{id:"open-dashboard",label:"Open dashboard",description:"Jump to the workspace overview",shortcut:"Cmd 1"},{id:"review-media",label:"Review media queue",description:"Inspect exports waiting for approval",shortcut:"Cmd 2"},{id:"toggle-liquid",label:"Toggle Liquid preview",description:"Switch the canvas into clear glass mode",shortcut:"Cmd L"},{id:"share-room",label:"Share review room",description:"Copy the current review room link",shortcut:"Cmd Shift S"},{id:"open-settings",label:"Open material settings",description:"Tune IOR, thickness, and performance policy",shortcut:"Cmd ,"}]})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div data-bg="light" className="glass-on-light" style={{
    minHeight: "100vh",
    width: "100%",
    padding: 32,
    boxSizing: "border-box",
    color: "#0f172a"
  }}>
      <style>{\`
        .glass-liquid-command-story-backdrop {
          min-height: calc(100vh - 64px);
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(280px, .8fr);
          gap: 24px;
          border-radius: 32px;
          padding: 28px;
          background:
            radial-gradient(circle at 22% 24%, rgba(255,255,255,.30), rgba(255,255,255,.08) 28%),
            radial-gradient(circle at 78% 68%, rgba(148,163,184,.10), rgba(255,255,255,.08) 30%),
            linear-gradient(135deg, rgba(255,255,255,.64), rgba(236,238,240,.38));
          box-shadow: 0 24px 80px rgba(15,23,42,.14);
        }

        .glass-liquid-command-story-card {
          border-radius: 24px;
          padding: 22px;
          background: rgba(255,255,255,.52);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.64);
        }

        .liquid-glass-command-surface {
          color: #0f172a;
          box-shadow: 0 28px 90px rgba(15, 23, 42, .2);
        }

        .liquid-glass-command-surface input {
          appearance: none;
          color: #0f172a;
          caret-color: #2563eb;
        }

        .liquid-glass-command-surface button {
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font: inherit;
        }

        @media (max-width: 720px) {
          .glass-liquid-command-story-backdrop {
            min-height: calc(100vh - 40px);
            grid-template-columns: 1fr;
            padding: 20px;
          }
        }
      \`}</style>
      <div className="glass-liquid-command-story-backdrop" aria-hidden="true">
        <section className="glass-liquid-command-story-card">
          <h2 style={{
          margin: 0,
          fontSize: 28
        }}>Workspace command center</h2>
          <p style={{
          maxWidth: 520,
          color: "#475569"
        }}>
            The command surface floats over real app content with enough spacing
            for groups, shortcuts, hover states, and scroll edge treatment.
          </p>
        </section>
        <section className="glass-liquid-command-story-card">
          <strong>Recent activity</strong>
          <div style={{
          display: "grid",
          gap: 10,
          marginTop: 16
        }}>
            {["Media export finished", "Review room synced", "Design tokens updated"].map(item => <span key={item} style={{
            borderRadius: 16,
            padding: "10px 12px",
            background: "rgba(255,255,255,.54)"
          }}>
                {item}
              </span>)}
          </div>
        </section>
      </div>
      <LiquidGlassCommandSurface open placeholder="Search commands" items={[{
      id: "open-dashboard",
      label: "Open dashboard",
      description: "Jump to the workspace overview",
      shortcut: "Cmd 1"
    }, {
      id: "review-media",
      label: "Review media queue",
      description: "Inspect exports waiting for approval",
      shortcut: "Cmd 2"
    }, {
      id: "toggle-liquid",
      label: "Toggle Liquid preview",
      description: "Switch the canvas into clear glass mode",
      shortcut: "Cmd L"
    }, {
      id: "share-room",
      label: "Share review room",
      description: "Copy the current review room link",
      shortcut: "Cmd Shift S"
    }, {
      id: "open-settings",
      label: "Open material settings",
      description: "Tune IOR, thickness, and performance policy",
      shortcut: "Cmd ,"
    }]} />
    </div>
}`,...l.parameters?.docs?.source}}};const L=["Default"];export{l as Default,L as __namedExportsOrder,N as default};
