import{j as e}from"./iframe-Cqi-9gHA.js";import{H as a,a as n,b as t}from"./HoudiniGlassCard-VkFUmmZO.js";import"./preload-helper-PPVm8Dsz.js";import"./components-D_brxh8E.js";const m={title:"Effects + Advanced/Houdini Glass Card",component:a,parameters:{layout:"fullscreen",docs:{description:{component:"Direct Storybook coverage for the exported Houdini glass card and showcase components."}}}},i={width:"100%",minHeight:"100vh",padding:"clamp(20px, 4vw, 48px)",boxSizing:"border-box"},s={args:{children:null},render:()=>e.jsx(n,{enabledEffects:["frost","border"],performanceMode:!0,children:e.jsx("main",{style:i,children:e.jsx("div",{style:{width:"min(100%, 680px)",margin:"0 auto"},children:e.jsx(a,{title:"Liquid Glass Workspace",description:"A direct mount of the exported Houdini glass card.",preset:"standard",effects:["frost","border"],interactive:!0,showControls:!0,children:e.jsxs("div",{className:"glass-space-y-3 glass-p-2",children:[e.jsx("p",{className:"glass-text-primary glass-font-medium",children:"Refined depth, responsive highlights, and clear content hierarchy."}),e.jsx("p",{className:"glass-text-secondary glass-text-sm",children:"The card remains readable and structurally intact across the certification viewports."})]})})})})})},r={args:{children:null},render:()=>e.jsx(n,{enabledEffects:["frost","caustics","border","refraction"],performanceMode:!0,children:e.jsx("main",{style:i,children:e.jsx("div",{style:{width:"min(100%, 1120px)",margin:"0 auto"},children:e.jsx(t,{})})})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <HoudiniGlassProvider enabledEffects={["frost", "border"]} performanceMode>
      <main style={storyFrame}>
        <div style={{
        width: "min(100%, 680px)",
        margin: "0 auto"
      }}>
          <HoudiniGlassCardComponent title="Liquid Glass Workspace" description="A direct mount of the exported Houdini glass card." preset="standard" effects={["frost", "border"]} interactive showControls>
            <div className="glass-space-y-3 glass-p-2">
              <p className="glass-text-primary glass-font-medium">
                Refined depth, responsive highlights, and clear content
                hierarchy.
              </p>
              <p className="glass-text-secondary glass-text-sm">
                The card remains readable and structurally intact across the
                certification viewports.
              </p>
            </div>
          </HoudiniGlassCardComponent>
        </div>
      </main>
    </HoudiniGlassProvider>
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <HoudiniGlassProvider enabledEffects={["frost", "caustics", "border", "refraction"]} performanceMode>
      <main style={storyFrame}>
        <div style={{
        width: "min(100%, 1120px)",
        margin: "0 auto"
      }}>
          <HoudiniGlassShowcaseComponent />
        </div>
      </main>
    </HoudiniGlassProvider>
}`,...r.parameters?.docs?.source}}};const p=["HoudiniGlassCard","HoudiniGlassShowcase"];export{s as HoudiniGlassCard,r as HoudiniGlassShowcase,p as __namedExportsOrder,m as default};
