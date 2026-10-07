import{j as e}from"./iframe-Cqi-9gHA.js";import{G as i}from"./GlassAdvancedVideoPlayer-BteIcirx.js";import{M as t}from"./GlassMediaProvider-CWHq7Ksi.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassCore-BlpRxUNK.js";const f={title:"Media/Glass Advanced Video Player",component:i,parameters:{layout:"fullscreen",previewSurface:"component",docs:{description:{component:"Direct, deterministic coverage for GlassAdvancedVideoPlayer using an inline poster, local media fixture, and its real provider context."}}},tags:["autodocs"]},o=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">','<defs><linearGradient id="canvas" x1="0" y1="0" x2="1" y2="1">','<stop offset="0" stop-color="#dce5ec"/><stop offset="0.48" stop-color="#f8fafc"/>','<stop offset="1" stop-color="#cbd8e2"/></linearGradient></defs>','<rect width="1280" height="720" fill="url(#canvas)"/>','<circle cx="640" cy="350" r="92" fill="rgba(255,255,255,0.32)" stroke="rgba(255,255,255,0.72)" stroke-width="3"/>','<path d="M620 300 700 350 620 400Z" fill="#0f172a"/>','<text x="84" y="112" font-family="Aeonik,Arial,sans-serif" font-size="52" font-weight="700" fill="#0f172a">AuraGlass Studio</text>','<text x="88" y="164" font-family="Aeonik,Arial,sans-serif" font-size="25" fill="#334155">A deterministic media preview</text>','<rect x="84" y="618" width="1112" height="12" rx="6" fill="rgba(15,23,42,0.12)"/>','<rect x="84" y="618" width="428" height="12" rx="6" fill="rgba(15,23,42,0.72)"/>',"</svg>"].join(""),r=`data:image/svg+xml,${encodeURIComponent(o)}`,a={id:"storybook-glass-video",type:"video",src:"data:video/mp4;base64,",poster:r,title:"Designing with liquid glass",description:"Material, hierarchy, and motion in one focused preview.",duration:86,quality:"1080p"},n={alignItems:"center",boxSizing:"border-box",display:"flex",justifyContent:"center",minHeight:"100vh",padding:"clamp(16px, 4vw, 48px)",width:"100%"},s={name:"GlassAdvancedVideoPlayer",args:{mediaFile:a},render:()=>e.jsx("main",{style:n,children:e.jsx("div",{style:{width:"min(100%, 960px)"},children:e.jsx(t,{children:e.jsx(i,{mediaFile:a,showControls:!0,showChapters:!1,showTranscript:!1,showAnalytics:!1,preload:"none","data-testid":"glass-advanced-video-player-story"})})})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "GlassAdvancedVideoPlayer",
  args: {
    mediaFile: sampleVideo
  },
  render: () => <main style={stageStyle}>
      <div style={{
      width: "min(100%, 960px)"
    }}>
        <GlassMediaProvider>
          <GlassAdvancedVideoPlayerComponent mediaFile={sampleVideo} showControls showChapters={false} showTranscript={false} showAnalytics={false} preload="none" data-testid="glass-advanced-video-player-story" />
        </GlassMediaProvider>
      </div>
    </main>
}`,...s.parameters?.docs?.source}}};const v=["GlassAdvancedVideoPlayer"];export{s as GlassAdvancedVideoPlayer,v as __namedExportsOrder,f as default};
