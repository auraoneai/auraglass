import{j as s}from"./iframe-BAa00EyB.js";import{G as m,a,b as l}from"./GlassBreadcrumb-CZOK3S5E.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-B9S5gwrW.js";import"./OptimizedGlassCore-C-o3fDW9.js";import"./deviceCapabilities-DPcRGa6_.js";const b={title:"Navigation/Glass Breadcrumb",component:m,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"Breadcrumb navigation with enough page context to judge contrast and spacing."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},e={render:t=>s.jsxs("section",{className:"glass-w-[720px] glass-rounded-2xl glass-bg-white/70 glass-p-6 glass-shadow-xl",children:[s.jsxs(m,{...t,size:"md",elevation:"level2",children:[s.jsx(a,{children:s.jsx(l,{href:"#",children:"Workspaces"})}),s.jsx(a,{children:s.jsx(l,{href:"#",children:"Enterprise"})}),s.jsx(a,{children:s.jsx(l,{href:"#",children:"Reports"})}),s.jsx(a,{isCurrentPage:!0,children:"Q2 Forecast"})]}),s.jsxs("div",{className:"glass-mt-6",children:[s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Report path"}),s.jsx("h2",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:"Q2 Forecast"}),s.jsx("p",{className:"glass-mt-2 glass-text-sm glass-text-secondary",children:"Breadcrumbs stay legible on a realistic glass page surface."})]})]}),args:{className:"",children:null}},r={render:t=>s.jsx("div",{className:"glass-grid glass-w-[760px] glass-gap-4",children:[3,5].map(d=>s.jsx("div",{className:"glass-rounded-xl glass-bg-white/70 glass-p-4 glass-shadow-sm",children:s.jsx(m,{...t,maxItems:d,separator:"›",children:["Home","Products","Analytics","Dashboards","Revenue"].map((c,i,n)=>s.jsx(a,{isCurrentPage:i===n.length-1,children:i===n.length-1?c:s.jsx(l,{href:"#",children:c})},c))})},d))}),args:{className:"",children:null}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: args => <section className="glass-w-[720px] glass-rounded-2xl glass-bg-white/70 glass-p-6 glass-shadow-xl">
      <GlassBreadcrumb {...args} size="md" elevation="level2">
        <GlassBreadcrumbItem>
          <GlassBreadcrumbLink href="#">Workspaces</GlassBreadcrumbLink>
        </GlassBreadcrumbItem>
        <GlassBreadcrumbItem>
          <GlassBreadcrumbLink href="#">Enterprise</GlassBreadcrumbLink>
        </GlassBreadcrumbItem>
        <GlassBreadcrumbItem>
          <GlassBreadcrumbLink href="#">Reports</GlassBreadcrumbLink>
        </GlassBreadcrumbItem>
        <GlassBreadcrumbItem isCurrentPage>Q2 Forecast</GlassBreadcrumbItem>
      </GlassBreadcrumb>
      <div className="glass-mt-6">
        <p className="glass-text-sm glass-text-secondary">Report path</p>
        <h2 className="glass-text-xl glass-font-semibold glass-text-primary">
          Q2 Forecast
        </h2>
        <p className="glass-mt-2 glass-text-sm glass-text-secondary">
          Breadcrumbs stay legible on a realistic glass page surface.
        </p>
      </div>
    </section>,
  args: {
    className: '',
    children: null
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="glass-grid glass-w-[760px] glass-gap-4">
      {[3, 5].map(maxItems => <div key={maxItems} className="glass-rounded-xl glass-bg-white/70 glass-p-4 glass-shadow-sm">
          <GlassBreadcrumb {...args} maxItems={maxItems} separator="›">
            {['Home', 'Products', 'Analytics', 'Dashboards', 'Revenue'].map((item, index, items) => <GlassBreadcrumbItem key={item} isCurrentPage={index === items.length - 1}>
                {index === items.length - 1 ? item : <GlassBreadcrumbLink href="#">{item}</GlassBreadcrumbLink>}
              </GlassBreadcrumbItem>)}
          </GlassBreadcrumb>
        </div>)}
    </div>,
  args: {
    className: '',
    children: null
  }
}`,...r.parameters?.docs?.source}}};const B=["Default","Variants"];export{e as Default,r as Variants,B as __namedExportsOrder,b as default};
