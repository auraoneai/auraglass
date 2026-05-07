import{r,j as e,c as u}from"./iframe-B2YkWo0R.js";import{L as v}from"./LiquidGlassMaterial-DIoSyT1w.js";import{L as w}from"./LiquidGlassScrollEdge-BT5srVrr.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassLayerProvider-DpO-dbvQ.js";const i=r.forwardRef(({open:n,onOpenChange:p,items:m,placeholder:h="Search commands",className:x,...b},f)=>{const[t,y]=r.useState(""),[l,d]=r.useState(0),g=r.useRef(null),c=r.useMemo(()=>m.filter(a=>a.label.toLowerCase().includes(t.toLowerCase())),[m,t]);return n?e.jsxs("div",{className:"glass-fixed glass-inset-0 glass-z-1200 glass-grid glass-place-items-start glass-overflow-y-auto glass-px-4 glass-py-16 sm:glass-px-6 sm:glass-py-24",children:[e.jsx("button",{type:"button","aria-label":"Close command surface","data-glass-overlay":"true",className:"glass-absolute glass-inset-0 glass-bg-black/20",onClick:()=>p?.(!1)}),e.jsxs(v,{ref:f,material:"liquid",radius:"2xl",className:u("liquid-glass-command-surface glass-relative glass-z-10 glass-mx-auto glass-w-full glass-max-w-2xl glass-overflow-hidden",x),...b,children:[e.jsx("input",{value:t,onChange:a=>y(a.target.value),onKeyDown:a=>{a.key==="Escape"&&p?.(!1),a.key==="ArrowDown"&&d(s=>Math.min(s+1,c.length-1)),a.key==="ArrowUp"&&d(s=>Math.max(s-1,0)),a.key==="Enter"&&c[l]?.onSelect?.()},role:"combobox","aria-expanded":!0,placeholder:h,className:"glass-w-full glass-bg-transparent glass-p-4 glass-outline-none"}),e.jsxs("div",{ref:g,role:"listbox",className:"glass-relative glass-max-h-[min(24rem,calc(100vh-12rem))] glass-overflow-y-auto glass-p-2","data-liquid-glass-scroll-target":!0,children:[e.jsx(w,{edge:"top",styleMode:"soft",targetRef:g}),c.map((a,s)=>e.jsxs("button",{type:"button",role:"option","aria-selected":s===l,disabled:a.disabled,className:u("glass-flex glass-w-full glass-min-w-0 glass-items-center glass-gap-3 glass-radius-lg glass-px-3 glass-py-2 glass-text-left",s===l&&"glass-surface-primary"),onMouseEnter:()=>d(s),onClick:a.onSelect,children:[a.icon,e.jsxs("span",{className:"glass-min-w-0 glass-flex-1",children:[e.jsx("span",{className:"glass-block glass-truncate",children:a.label}),a.description&&e.jsx("span",{className:"glass-block glass-truncate glass-text-xs glass-text-secondary",children:a.description})]}),a.shortcut&&e.jsx("span",{className:"glass-shrink-0 glass-text-xs glass-text-secondary",children:a.shortcut})]},a.id))]})]})]}):null});i.displayName="LiquidGlassCommandSurface";try{i.displayName="LiquidGlassCommandSurface",i.__docgenInfo={description:"",displayName:"LiquidGlassCommandSurface",props:{open:{defaultValue:null,description:"",name:"open",required:!0,type:{name:"boolean"}},onOpenChange:{defaultValue:null,description:"",name:"onOpenChange",required:!1,type:{name:"((open: boolean) => void) | undefined"}},items:{defaultValue:null,description:"",name:"items",required:!0,type:{name:"LiquidGlassCommandItem[]"}},placeholder:{defaultValue:{value:"Search commands"},description:"",name:"placeholder",required:!1,type:{name:"string | undefined"}}}}}catch{}const N={title:"Effects + Advanced/Liquid Glass Command Surface",component:i,parameters:{layout:"fullscreen",previewSurface:"app"}},o={render:()=>e.jsxs("div",{"data-bg":"light",className:"glass-on-light",style:{minHeight:"100vh",width:"100%",padding:32,boxSizing:"border-box",color:"#0f172a"},children:[e.jsx("style",{children:`
        .liquid-command-story-backdrop {
          min-height: calc(100vh - 64px);
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(280px, .8fr);
          gap: 24px;
          border-radius: 32px;
          padding: 28px;
          background:
            radial-gradient(circle at 22% 24%, rgba(96,165,250,.34), transparent 28%),
            radial-gradient(circle at 78% 68%, rgba(45,212,191,.28), transparent 30%),
            linear-gradient(135deg, rgba(255,255,255,.58), rgba(248,250,252,.34));
          box-shadow: 0 24px 80px rgba(15,23,42,.14);
        }

        .liquid-command-story-card {
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
          .liquid-command-story-backdrop {
            min-height: calc(100vh - 40px);
            grid-template-columns: 1fr;
            padding: 20px;
          }
        }
      `}),e.jsxs("div",{className:"liquid-command-story-backdrop","aria-hidden":"true",children:[e.jsxs("section",{className:"liquid-command-story-card",children:[e.jsx("h2",{style:{margin:0,fontSize:28},children:"Workspace command center"}),e.jsx("p",{style:{maxWidth:520,color:"#475569"},children:"The command surface floats over real app content with enough spacing for groups, shortcuts, hover states, and scroll edge treatment."})]}),e.jsxs("section",{className:"liquid-command-story-card",children:[e.jsx("strong",{children:"Recent activity"}),e.jsx("div",{style:{display:"grid",gap:10,marginTop:16},children:["Media export finished","Review room synced","Design tokens updated"].map(n=>e.jsx("span",{style:{borderRadius:16,padding:"10px 12px",background:"rgba(255,255,255,.54)"},children:n},n))})]})]}),e.jsx(i,{open:!0,placeholder:"Search commands",items:[{id:"open-dashboard",label:"Open dashboard",description:"Jump to the workspace overview",shortcut:"Cmd 1"},{id:"review-media",label:"Review media queue",description:"Inspect exports waiting for approval",shortcut:"Cmd 2"},{id:"toggle-liquid",label:"Toggle Liquid preview",description:"Switch the canvas into clear glass mode",shortcut:"Cmd L"},{id:"share-room",label:"Share review room",description:"Copy the current review room link",shortcut:"Cmd Shift S"},{id:"open-settings",label:"Open material settings",description:"Tune IOR, thickness, and performance policy",shortcut:"Cmd ,"}]})]})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div data-bg="light" className="glass-on-light" style={{
    minHeight: "100vh",
    width: "100%",
    padding: 32,
    boxSizing: "border-box",
    color: "#0f172a"
  }}>
      <style>{\`
        .liquid-command-story-backdrop {
          min-height: calc(100vh - 64px);
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(280px, .8fr);
          gap: 24px;
          border-radius: 32px;
          padding: 28px;
          background:
            radial-gradient(circle at 22% 24%, rgba(96,165,250,.34), transparent 28%),
            radial-gradient(circle at 78% 68%, rgba(45,212,191,.28), transparent 30%),
            linear-gradient(135deg, rgba(255,255,255,.58), rgba(248,250,252,.34));
          box-shadow: 0 24px 80px rgba(15,23,42,.14);
        }

        .liquid-command-story-card {
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
          .liquid-command-story-backdrop {
            min-height: calc(100vh - 40px);
            grid-template-columns: 1fr;
            padding: 20px;
          }
        }
      \`}</style>
      <div className="liquid-command-story-backdrop" aria-hidden="true">
        <section className="liquid-command-story-card">
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
        <section className="liquid-command-story-card">
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
}`,...o.parameters?.docs?.source}}};const L=["Default"];export{o as Default,L as __namedExportsOrder,N as default};
