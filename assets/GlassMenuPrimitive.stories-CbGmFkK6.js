import{j as s}from"./iframe-Cqi-9gHA.js";import{f as r}from"./index-DdjpOZjl.js";import{G as m,a as e,b as o,c as a}from"./GlassMenuPrimitive-0xTUokvl.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";import"./OptimizedGlassCore-CWgizUMZ.js";import"./deviceCapabilities-DlsmEFaF.js";import"./DismissableLayer-wExlqaAf.js";import"./FocusScope-BRi9nSbc.js";const p=r(),c=r(),C={title:"Navigation/Glass Menu Primitive",component:m,parameters:{layout:"fullscreen",previewSurface:"app",docs:{description:{component:"Direct coverage for the GlassMenuPrimitive namespace and its exported Root, Content, and Item components."}}}},n={name:"GlassMenuPrimitive",render:()=>s.jsxs("div",{className:"glass-grid glass-w-full glass-gap-4 glass-p-4",style:{minHeight:"100vh",alignContent:"center",gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))"},children:[s.jsxs("section",{className:"glass-mx-auto glass-w-full glass-max-w-md glass-space-y-3",children:[s.jsx("h2",{className:"glass-m-0 glass-text-lg glass-font-semibold glass-text-primary",children:"Namespace API"}),s.jsx(e.Root,{orientation:"vertical","aria-label":"Workspace actions",className:"glass-w-full",children:s.jsxs(e.Content,{positionStrategy:"contained",onDismiss:p,children:[s.jsxs(e.Item,{className:"glass-px-3 glass-py-2",children:["Open workspace",s.jsx("span",{className:"glass-text-xs glass-text-secondary",children:"Enter"})]}),s.jsxs(e.Item,{className:"glass-px-3 glass-py-2",children:["Duplicate view",s.jsx("span",{className:"glass-text-xs glass-text-secondary",children:"⌘D"})]}),s.jsx(e.Item,{className:"glass-px-3 glass-py-2",disabled:!0,children:"Archive locked view"})]})})]}),s.jsxs("section",{className:"glass-mx-auto glass-w-full glass-max-w-md glass-space-y-3",children:[s.jsx("h2",{className:"glass-m-0 glass-text-lg glass-font-semibold glass-text-primary",children:"Named exports"}),s.jsx(m,{orientation:"vertical","aria-label":"Document actions",className:"glass-w-full",children:s.jsxs(o,{positionStrategy:"contained",onDismiss:c,children:[s.jsx(a,{className:"glass-px-3 glass-py-2",children:"Share document"}),s.jsx(a,{className:"glass-px-3 glass-py-2",children:"Export snapshot"})]})})]})]})},t={name:"GlassMenuPrimitiveRoot",render:()=>s.jsx("div",{className:"glass-mx-auto glass-w-full glass-max-w-md glass-p-4",children:s.jsx(m,{"aria-label":"Root-only navigation menu",className:"glass-w-full",children:s.jsx(o,{positionStrategy:"contained","aria-label":"Root-contained actions",children:s.jsx(a,{className:"glass-px-3 glass-py-2",children:"Root-contained action"})})})})},i={name:"GlassMenuPrimitiveContent",render:()=>s.jsx("div",{className:"glass-mx-auto glass-w-full glass-max-w-md glass-p-4",children:s.jsx(o,{positionStrategy:"contained",onDismiss:c,"aria-label":"Contained menu content",children:s.jsx(a,{className:"glass-px-3 glass-py-2",children:"Content-contained action"})})})},l={name:"GlassMenuPrimitiveItem",render:()=>s.jsx("div",{className:"glass-mx-auto glass-w-full glass-max-w-md glass-p-4",children:s.jsx(m,{"aria-label":"Menu item example",className:"glass-w-full",children:s.jsx(o,{positionStrategy:"contained","aria-label":"Item export menu",children:s.jsxs(a,{className:"glass-px-3 glass-py-2",children:["Individually exported menu item",s.jsx("span",{className:"glass-text-xs glass-text-secondary",children:"⌘I"})]})})})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "GlassMenuPrimitive",
  render: () => <div className="glass-grid glass-w-full glass-gap-4 glass-p-4" style={{
    minHeight: "100vh",
    alignContent: "center",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))"
  }}>
      <section className="glass-mx-auto glass-w-full glass-max-w-md glass-space-y-3">
        <h2 className="glass-m-0 glass-text-lg glass-font-semibold glass-text-primary">
          Namespace API
        </h2>
        <GlassMenuPrimitiveNamespace.Root orientation="vertical" aria-label="Workspace actions" className="glass-w-full">
          <GlassMenuPrimitiveNamespace.Content positionStrategy="contained" onDismiss={namespaceDismiss}>
            <GlassMenuPrimitiveNamespace.Item className="glass-px-3 glass-py-2">
              Open workspace
              <span className="glass-text-xs glass-text-secondary">Enter</span>
            </GlassMenuPrimitiveNamespace.Item>
            <GlassMenuPrimitiveNamespace.Item className="glass-px-3 glass-py-2">
              Duplicate view
              <span className="glass-text-xs glass-text-secondary">⌘D</span>
            </GlassMenuPrimitiveNamespace.Item>
            <GlassMenuPrimitiveNamespace.Item className="glass-px-3 glass-py-2" disabled>
              Archive locked view
            </GlassMenuPrimitiveNamespace.Item>
          </GlassMenuPrimitiveNamespace.Content>
        </GlassMenuPrimitiveNamespace.Root>
      </section>

      <section className="glass-mx-auto glass-w-full glass-max-w-md glass-space-y-3">
        <h2 className="glass-m-0 glass-text-lg glass-font-semibold glass-text-primary">
          Named exports
        </h2>
        <GlassMenuPrimitiveRootComponent orientation="vertical" aria-label="Document actions" className="glass-w-full">
          <GlassMenuPrimitiveContentComponent positionStrategy="contained" onDismiss={namedDismiss}>
            <GlassMenuPrimitiveItemComponent className="glass-px-3 glass-py-2">
              Share document
            </GlassMenuPrimitiveItemComponent>
            <GlassMenuPrimitiveItemComponent className="glass-px-3 glass-py-2">
              Export snapshot
            </GlassMenuPrimitiveItemComponent>
          </GlassMenuPrimitiveContentComponent>
        </GlassMenuPrimitiveRootComponent>
      </section>
    </div>
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "GlassMenuPrimitiveRoot",
  render: () => <div className="glass-mx-auto glass-w-full glass-max-w-md glass-p-4">
      <GlassMenuPrimitiveRootComponent aria-label="Root-only navigation menu" className="glass-w-full">
        <GlassMenuPrimitiveContentComponent positionStrategy="contained" aria-label="Root-contained actions">
          <GlassMenuPrimitiveItemComponent className="glass-px-3 glass-py-2">
            Root-contained action
          </GlassMenuPrimitiveItemComponent>
        </GlassMenuPrimitiveContentComponent>
      </GlassMenuPrimitiveRootComponent>
    </div>
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "GlassMenuPrimitiveContent",
  render: () => <div className="glass-mx-auto glass-w-full glass-max-w-md glass-p-4">
      <GlassMenuPrimitiveContentComponent positionStrategy="contained" onDismiss={namedDismiss} aria-label="Contained menu content">
        <GlassMenuPrimitiveItemComponent className="glass-px-3 glass-py-2">
          Content-contained action
        </GlassMenuPrimitiveItemComponent>
      </GlassMenuPrimitiveContentComponent>
    </div>
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "GlassMenuPrimitiveItem",
  render: () => <div className="glass-mx-auto glass-w-full glass-max-w-md glass-p-4">
      <GlassMenuPrimitiveRootComponent aria-label="Menu item example" className="glass-w-full">
        <GlassMenuPrimitiveContentComponent positionStrategy="contained" aria-label="Item export menu">
          <GlassMenuPrimitiveItemComponent className="glass-px-3 glass-py-2">
            Individually exported menu item
            <span className="glass-text-xs glass-text-secondary">⌘I</span>
          </GlassMenuPrimitiveItemComponent>
        </GlassMenuPrimitiveContentComponent>
      </GlassMenuPrimitiveRootComponent>
    </div>
}`,...l.parameters?.docs?.source}}};const y=["GlassMenuPrimitive","GlassMenuPrimitiveRoot","GlassMenuPrimitiveContent","GlassMenuPrimitiveItem"];export{n as GlassMenuPrimitive,i as GlassMenuPrimitiveContent,l as GlassMenuPrimitiveItem,t as GlassMenuPrimitiveRoot,y as __namedExportsOrder,C as default};
