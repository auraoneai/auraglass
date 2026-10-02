import{C as r,j as e}from"./iframe-DFMMcocb.js";import"./preload-helper-PPVm8Dsz.js";const a={minHeight:"100vh",width:"100%",display:"grid",placeItems:"center",padding:"clamp(20px, 5vw, 64px)",boxSizing:"border-box",background:"radial-gradient(circle at 20% 15%, rgba(255,255,255,0.98), transparent 36%), linear-gradient(145deg, #fafafa 0%, #e9e9e9 52%, #f7f7f7 100%)",color:"#0f172a"},n={width:"min(680px, 100%)",display:"grid",gap:"12px",padding:"clamp(24px, 5vw, 44px)",borderRadius:"32px",background:"linear-gradient(145deg, rgba(255,255,255,0.30), rgba(255,255,255,0.16))",border:"1px solid rgba(255,255,255,0.92)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.28), 0 28px 64px rgba(20,20,20,0.12)",backdropFilter:"blur(24px) saturate(1.4) brightness(1.05) contrast(1.02)",WebkitBackdropFilter:"blur(24px) saturate(1.4) brightness(1.05) contrast(1.02)"},i={title:"Foundations/Accessibility/Contrast Guard",component:r,parameters:{layout:"fullscreen",docs:{description:{component:"The real ContrastGuard export rendered over a detailed, neutral canvas so its adaptive WCAG text protection can be inspected directly."}}}},t={render:()=>e.jsx("main",{style:a,children:e.jsxs(r,{as:"section",level:"AAA",minContrast:7,autoAdjust:!0,demoBackdrop:"busy-light",style:n,"aria-label":"Contrast-protected liquid glass content",children:[e.jsx("span",{style:{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(15,23,42,0.7)"},children:"Accessibility · AAA target"}),e.jsx("strong",{style:{fontSize:"clamp(1.65rem, 4vw, 2.75rem)",lineHeight:1.04,letterSpacing:"-0.04em"},children:"Readable through every layer."}),e.jsx("span",{style:{color:"rgba(15,23,42,0.72)",lineHeight:1.65},children:"ContrastGuard measures the rendered backdrop and keeps foreground content legible without flattening the depth of the liquid material."})]})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <main style={frameStyle}>
      <ContrastGuard as="section" level="AAA" minContrast={7} autoAdjust demoBackdrop="busy-light" style={guardStyle} aria-label="Contrast-protected liquid glass content">
        <span style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(15,23,42,0.7)"
      }}>
          Accessibility · AAA target
        </span>
        <strong style={{
        fontSize: "clamp(1.65rem, 4vw, 2.75rem)",
        lineHeight: 1.04,
        letterSpacing: "-0.04em"
      }}>
          Readable through every layer.
        </strong>
        <span style={{
        color: "rgba(15,23,42,0.72)",
        lineHeight: 1.65
      }}>
          ContrastGuard measures the rendered backdrop and keeps foreground
          content legible without flattening the depth of the liquid material.
        </span>
      </ContrastGuard>
    </main>
}`,...t.parameters?.docs?.source}}};const l=["Default"];export{t as Default,l as __namedExportsOrder,i as default};
