import{j as e,g as s}from"./iframe-DMS_w3ti.js";import{C as r}from"./CursorGlow-DHa1zA_p.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-C8aSFzaY.js";const c={title:"Effects + Advanced/Cursor Glow",component:r,parameters:{layout:"fullscreen",docs:{description:{component:"Pointer-following glow overlay. Pointer-events: none. Respects reduced motion."}}},argTypes:{size:{control:{type:"range",min:120,max:600,step:10}},intensity:{control:{type:"range",min:0,max:1,step:.05}},opacity:{control:{type:"range",min:0,max:1,step:.02}},color:{control:"color",type:"string",table:{type:{summary:"string"}}}},args:{size:320,intensity:.6,opacity:.18,color:"var(--glass-white)"}},t={render:o=>e.jsxs("div",{style:{position:"relative",minHeight:"70vh",background:"linear-gradient(120deg,#0f172a,#1e293b)",overflow:"hidden"},children:[e.jsx(r,{...o}),e.jsx("div",{style:{position:"absolute",inset:0,display:"grid",placeItems:"center"},children:e.jsxs("div",{style:s({intent:"neutral",elevation:"level2"}),children:[e.jsx("h3",{style:{margin:0,fontWeight:600},children:"Cursor Glow"}),e.jsx("p",{style:{opacity:.75},children:"Move your cursor around to see the glow."})]})})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    position: 'relative',
    minHeight: '70vh',
    background: 'linear-gradient(120deg,#0f172a,#1e293b)',
    overflow: 'hidden'
  }}>
      <CursorGlow {...args} />
      <div style={{
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center'
    }}>
        <div style={createGlassStyle({
        intent: "neutral",
        elevation: "level2"
      })}>
          <h3 style={{
          margin: 0,
          fontWeight: 600
        }}>Cursor Glow</h3>
          <p style={{
          opacity: 0.75
        }}>Move your cursor around to see the glow.</p>
        </div>
      </div>
    </div>
}`,...t.parameters?.docs?.source}}};const d=["Default"];export{t as Default,d as __namedExportsOrder,c as default};
