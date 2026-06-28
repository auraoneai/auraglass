import{j as e}from"./iframe-BM_sOc7A.js";import{A as n}from"./AuroraBackground-ClHbCs69.js";import{D as s}from"./DisplayText-DTfHWh2H.js";import"./preload-helper-PPVm8Dsz.js";/* empty css                  */const l={title:"Marketing/Aurora Background",component:n,parameters:{layout:"fullscreen"},argTypes:{palette:{control:"select",options:["aurora","prism","ocean","ember","mono"]},intensity:{control:"select",options:["subtle","medium","strong"]},motion:{control:"select",options:["none","subtle","full"]}}},r={args:{particles:24,grain:!0,vignette:!0,seed:"storybook-contained"},render:o=>e.jsxs("section",{style:{position:"relative",minHeight:520,overflow:"hidden",padding:48},children:[e.jsx(n,{...o}),e.jsx("div",{style:{position:"relative",zIndex:1,maxWidth:760},children:e.jsx(s,{as:"h1",size:"hero",gradient:"aurora",children:"Liquid Glass marketing surfaces"})})]})},t={args:{particles:12,reducedMotion:!0,grain:!0,vignette:!0,seed:"storybook-reduced"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    particles: 24,
    grain: true,
    vignette: true,
    seed: "storybook-contained"
  },
  render: args => <section style={{
    position: "relative",
    minHeight: 520,
    overflow: "hidden",
    padding: 48
  }}>
      <AuroraBackground {...args} />
      <div style={{
      position: "relative",
      zIndex: 1,
      maxWidth: 760
    }}>
        <DisplayText as="h1" size="hero" gradient="aurora">
          Liquid Glass marketing surfaces
        </DisplayText>
      </div>
    </section>
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    particles: 12,
    reducedMotion: true,
    grain: true,
    vignette: true,
    seed: "storybook-reduced"
  }
}`,...t.parameters?.docs?.source}}};const p=["Contained","ReducedMotion"];export{r as Contained,t as ReducedMotion,p as __namedExportsOrder,l as default};
