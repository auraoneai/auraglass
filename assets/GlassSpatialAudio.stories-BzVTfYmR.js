import{j as e}from"./iframe-Cqi-9gHA.js";import{G as c,a as d,b as p,c as m,u as S}from"./GlassSpatialAudio-CItqE0YP.js";import"./preload-helper-PPVm8Dsz.js";const h={title:"Effects + Advanced/Glass Spatial Audio",component:c,parameters:{layout:"fullscreen",previewSurface:"component",docs:{description:{component:"The real spatial-audio exports, mounted individually with safe provider context and no automatic audio playback."}}},tags:["autodocs"]},t=({children:a})=>e.jsx("main",{style:{minHeight:"100vh",padding:"clamp(1.25rem, 5vw, 4rem)",display:"grid",placeItems:"center",color:"rgba(15, 23, 42, 0.92)",background:"radial-gradient(circle at 16% 16%, rgba(255, 255, 255, 0.98), transparent 34%), linear-gradient(145deg, #ececec 0%, #fafafa 48%, #e2e2e2 100%)"},children:e.jsx("div",{style:{width:"min(100%, 52rem)"},children:a})}),o=({eyebrow:a,title:n,children:u})=>e.jsxs("section",{className:"glass-surface-primary glass-blur-backdrop glass-border glass-border-white/20 glass-radius-2xl glass-p-6 glass-space-y-3",children:[e.jsx("p",{className:"glass-text-xs glass-text-tertiary glass-uppercase glass-tracking-wide",children:a}),e.jsx("h2",{className:"glass-text-2xl glass-text-primary glass-font-semibold",children:n}),e.jsx("p",{className:"glass-text-sm glass-text-secondary",children:u??"Spatial feedback is ready and remains silent until an intentional interaction."})]});function g(){const{isInitialized:a,masterVolume:n}=S();return e.jsxs(o,{eyebrow:"Live provider context",title:a?"Audio engine ready":"Audio engine standing by",children:["Master volume is ",Math.round(n*100),"%; automatic playback is disabled for this preview."]})}const s={name:"GlassSpatialAudio",render:()=>e.jsx(t,{children:e.jsx(c,{autoInitialize:!1,children:e.jsx(o,{eyebrow:"Spatial sound field",title:"Glass spatial audio"})})})},i={name:"GlassSpatialAudioProvider",render:()=>e.jsx(t,{children:e.jsx(d,{autoInitialize:!1,children:e.jsx(g,{})})})},r={name:"GlassAudioReactive",render:()=>e.jsx(t,{children:e.jsx(d,{autoInitialize:!1,children:e.jsx(p,{reactToFrequency:!1,reactToVolume:!1,className:"glass-radius-2xl",children:e.jsx(o,{eyebrow:"Reactive material",title:"Audio-reactive glass"})})})})},l={name:"GlassSpatialVisualizer",render:()=>e.jsxs(t,{children:[e.jsx(o,{eyebrow:"Three-dimensional field",title:"Spatial visualizer",children:"The live visualizer export is mounted in the lower-right corner with a silent provider and an empty source field."}),e.jsx(d,{autoInitialize:!1,children:e.jsx(m,{show:!0,className:"glass-w-60 glass-h-60"})})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "GlassSpatialAudio",
  render: () => <Scene>
      <GlassSpatialAudioComponent autoInitialize={false}>
        <AudioSurface eyebrow="Spatial sound field" title="Glass spatial audio" />
      </GlassSpatialAudioComponent>
    </Scene>
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "GlassSpatialAudioProvider",
  render: () => <Scene>
      <GlassSpatialAudioProviderComponent autoInitialize={false}>
        <SpatialAudioProviderConsumer />
      </GlassSpatialAudioProviderComponent>
    </Scene>
}`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "GlassAudioReactive",
  render: () => <Scene>
      <GlassSpatialAudioProviderComponent autoInitialize={false}>
        <GlassAudioReactiveComponent reactToFrequency={false} reactToVolume={false} className="glass-radius-2xl">
          <AudioSurface eyebrow="Reactive material" title="Audio-reactive glass" />
        </GlassAudioReactiveComponent>
      </GlassSpatialAudioProviderComponent>
    </Scene>
}`,...r.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "GlassSpatialVisualizer",
  render: () => <Scene>
      <AudioSurface eyebrow="Three-dimensional field" title="Spatial visualizer">
        The live visualizer export is mounted in the lower-right corner with a
        silent provider and an empty source field.
      </AudioSurface>
      <GlassSpatialAudioProviderComponent autoInitialize={false}>
        <GlassSpatialVisualizerComponent show className="glass-w-60 glass-h-60" />
      </GlassSpatialAudioProviderComponent>
    </Scene>
}`,...l.parameters?.docs?.source}}};const A=["GlassSpatialAudio","GlassSpatialAudioProvider","GlassAudioReactive","GlassSpatialVisualizer"];export{r as GlassAudioReactive,s as GlassSpatialAudio,i as GlassSpatialAudioProvider,l as GlassSpatialVisualizer,A as __namedExportsOrder,h as default};
