import{j as e}from"./iframe-RsoZoStf.js";import{G as l}from"./GlassPageTabs-C5e19AHw.js";import{G as r}from"./GlassLoadingState-D0-JVUj8.js";import{G as o}from"./GlassEmptyState-C05hBrRd.js";import{G as i}from"./GlassErrorState-BIJu4qzF.js";import{G as n}from"./GlassCard-CbtK8PY3.js";import{G as t}from"./GlassFilterBar-2Y-VawOi.js";import{G as d}from"./GlassButton-BmzykaoH.js";import{G as m}from"./GlassSearchField-DGLyZpS2.js";import{G as p}from"./GlassCombobox-CaUNeZoa.js";import{G as c}from"./GlassFieldGroup-DhTvoPr_.js";import{G as a}from"./GlassFormField-BF3TFKxa.js";import{G as g}from"./GlassDateField-DsctQgv-.js";import{G as u}from"./GlassTimeField-8ypHr7-L.js";import{G}from"./GlassValidationMessage-BdPmw19i.js";import"./preload-helper-PPVm8Dsz.js";import"./components-DwI53NlZ.js";import"./OptimizedGlassCore-IzbAukgr.js";import"./deviceCapabilities-CB0YcTGX.js";import"./LiquidGlassMaterial-GdijC9oA.js";import"./LiquidGlassLayerProvider-BQssgZYr.js";import"./a11y-WSL2JlLl.js";import"./GlassPredictiveEngine-xQEpY0TP.js";import"./GlassAchievementSystem-Bhc5NHtk.js";import"./GlassBiometricAdaptation-B9HDXiFX.js";import"./MotionPreferenceContext-B3rOXnSa.js";import"./GlassEyeTracking-CJXggKsV.js";import"./GlassSpatialAudio-nY9QSvQ1.js";import"./MotionFramer-tKl7gvze.js";import"./utilsCore-DLcXNkaQ.js";import"./GlassInput-ZzQM0vBn.js";const K={title:"3.2/Production Workflow Components",parameters:{layout:"fullscreen"}},s={render:()=>e.jsx("main",{className:"glass-min-h-screen glass-bg-slate-950 glass-p-8 glass-text-primary",children:e.jsx("div",{className:"glass-mx-auto glass-max-w-6xl glass-space-y-6",children:e.jsx(l,{tabs:[{value:"overview",label:"Overview",badge:"Live",panel:e.jsxs("div",{className:"glass-grid glass-gap-4 md:glass-grid-cols-3",children:[e.jsx(r,{label:"Syncing usage",variant:"progress",progress:64}),e.jsx(o,{variant:"compact",title:"No exceptions",description:"All workflow checks are clear."}),e.jsx(i,{severity:"warning",title:"One webhook delayed",description:"Retry the integration when the provider responds.",onRetry:()=>{}})]})},{value:"filters",label:"Filters",panel:e.jsxs(n,{className:"glass-space-y-4 glass-p-4",children:[e.jsx(t,{filters:[{id:"status",label:"Status",value:"Open"},{id:"owner",label:"Owner",value:"Design"}],actions:e.jsx(d,{size:"sm",children:"Apply"})}),e.jsx(m,{label:"Search workflows",placeholder:"Search workflows",value:"",onChange:()=>{}}),e.jsx(p,{label:"Owner",options:[{value:"ana",label:"Ana",group:"Design"},{value:"bo",label:"Bo",group:"Engineering"},{value:"cy",label:"Cy",group:"Support"}]})]})},{value:"schedule",label:"Schedule",panel:e.jsxs(c,{legend:"Release window",description:"Set the publish date and owner-visible validation.",columns:2,children:[e.jsx(a,{label:"Date",htmlFor:"story-date",children:e.jsx(g,{id:"story-date",label:"Date"})}),e.jsx(a,{label:"Time",htmlFor:"story-time",children:e.jsx(u,{id:"story-time",label:"Time"})}),e.jsx(G,{tone:"success",children:"Release window saved."})]})}]})})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <main className="glass-min-h-screen glass-bg-slate-950 glass-p-8 glass-text-primary">
      <div className="glass-mx-auto glass-max-w-6xl glass-space-y-6">
        <GlassPageTabs tabs={[{
        value: "overview",
        label: "Overview",
        badge: "Live",
        panel: <div className="glass-grid glass-gap-4 md:glass-grid-cols-3">
                  <GlassLoadingState label="Syncing usage" variant="progress" progress={64} />
                  <GlassEmptyState variant="compact" title="No exceptions" description="All workflow checks are clear." />
                  <GlassErrorState severity="warning" title="One webhook delayed" description="Retry the integration when the provider responds." onRetry={() => undefined} />
                </div>
      }, {
        value: "filters",
        label: "Filters",
        panel: <GlassCard className="glass-space-y-4 glass-p-4">
                  <GlassFilterBar filters={[{
            id: "status",
            label: "Status",
            value: "Open"
          }, {
            id: "owner",
            label: "Owner",
            value: "Design"
          }]} actions={<GlassButton size="sm">Apply</GlassButton>} />
                  <GlassSearchField label="Search workflows" placeholder="Search workflows" value="" onChange={() => undefined} />
                  <GlassCombobox label="Owner" options={[{
            value: "ana",
            label: "Ana",
            group: "Design"
          }, {
            value: "bo",
            label: "Bo",
            group: "Engineering"
          }, {
            value: "cy",
            label: "Cy",
            group: "Support"
          }]} />
                </GlassCard>
      }, {
        value: "schedule",
        label: "Schedule",
        panel: <GlassFieldGroup legend="Release window" description="Set the publish date and owner-visible validation." columns={2}>
                  <GlassFormField label="Date" htmlFor="story-date">
                    <GlassDateField id="story-date" label="Date" />
                  </GlassFormField>
                  <GlassFormField label="Time" htmlFor="story-time">
                    <GlassTimeField id="story-time" label="Time" />
                  </GlassFormField>
                  <GlassValidationMessage tone="success">
                    Release window saved.
                  </GlassValidationMessage>
                </GlassFieldGroup>
      }]} />
      </div>
    </main>
}`,...s.parameters?.docs?.source}}};const Q=["WorkflowSurface"];export{s as WorkflowSurface,Q as __namedExportsOrder,K as default};
