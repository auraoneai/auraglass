import{j as e}from"./iframe-Cqi-9gHA.js";import{G as l}from"./GlassPageTabs-EX-BCHfP.js";import{G as r}from"./GlassLoadingState-O8uZa3cE.js";import{G as o}from"./GlassEmptyState-MqDXVE3f.js";import{G as i}from"./GlassErrorState-D78znoJl.js";import{G as n}from"./GlassCard-D12uqCBo.js";import{G as t}from"./GlassFilterBar-wzK9Yxde.js";import{G as d}from"./GlassButton-DSUfTc6z.js";import{G as m}from"./GlassSearchField-nRMVLdCk.js";import{G as p}from"./GlassCombobox-B5Ib2r21.js";import{G as c}from"./GlassFieldGroup-sCZgT2Cf.js";import{G as a}from"./GlassFormField-CLpCHNCi.js";import{G as g}from"./GlassDateField-BxVZk3tl.js";import{G as u}from"./GlassTimeField-BB8xxiQC.js";import{G}from"./GlassValidationMessage-DeixD9g8.js";import"./preload-helper-PPVm8Dsz.js";import"./components-D_brxh8E.js";import"./OptimizedGlassCore-CWgizUMZ.js";import"./deviceCapabilities-DlsmEFaF.js";import"./LiquidGlassMaterial-D0WtSJtx.js";import"./LiquidGlassLayerProvider-BPcOSNPa.js";import"./a11y-DBBBNlGj.js";import"./GlassPredictiveEngine-DWJWfFvG.js";import"./GlassAchievementSystem-a9__MuEd.js";import"./GlassBiometricAdaptation-CK7SW6sR.js";import"./MotionPreferenceContext-Da-updIo.js";import"./GlassEyeTracking-PHKeMwz0.js";import"./GlassSpatialAudio-CItqE0YP.js";import"./MotionFramer-CH53jSUC.js";import"./utilsCore-iuxhMr4m.js";import"./GlassInput-DolFnFNQ.js";const K={title:"3.2/Production Workflow Components",parameters:{layout:"fullscreen"}},s={render:()=>e.jsx("main",{className:"glass-min-h-screen glass-bg-slate-950 glass-p-8 glass-text-primary",children:e.jsx("div",{className:"glass-mx-auto glass-max-w-6xl glass-space-y-6",children:e.jsx(l,{tabs:[{value:"overview",label:"Overview",badge:"Live",panel:e.jsxs("div",{className:"glass-grid glass-gap-4 md:glass-grid-cols-3",children:[e.jsx(r,{label:"Syncing usage",variant:"progress",progress:64}),e.jsx(o,{variant:"compact",title:"No exceptions",description:"All workflow checks are clear."}),e.jsx(i,{severity:"warning",title:"One webhook delayed",description:"Retry the integration when the provider responds.",onRetry:()=>{}})]})},{value:"filters",label:"Filters",panel:e.jsxs(n,{className:"glass-space-y-4 glass-p-4",children:[e.jsx(t,{filters:[{id:"status",label:"Status",value:"Open"},{id:"owner",label:"Owner",value:"Design"}],actions:e.jsx(d,{size:"sm",children:"Apply"})}),e.jsx(m,{label:"Search workflows",placeholder:"Search workflows",value:"",onChange:()=>{}}),e.jsx(p,{label:"Owner",options:[{value:"ana",label:"Ana",group:"Design"},{value:"bo",label:"Bo",group:"Engineering"},{value:"cy",label:"Cy",group:"Support"}]})]})},{value:"schedule",label:"Schedule",panel:e.jsxs(c,{legend:"Release window",description:"Set the publish date and owner-visible validation.",columns:2,children:[e.jsx(a,{label:"Date",htmlFor:"story-date",children:e.jsx(g,{id:"story-date",label:"Date"})}),e.jsx(a,{label:"Time",htmlFor:"story-time",children:e.jsx(u,{id:"story-time",label:"Time"})}),e.jsx(G,{tone:"success",children:"Release window saved."})]})}]})})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
