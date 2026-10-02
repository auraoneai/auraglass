import{j as a}from"./iframe-DFMMcocb.js";import{I as t}from"./GlassImageProcessingProvider-DPhqHuu5.js";import{G as r}from"./GlassIntelligentImageUploader-B-jivKX0.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassCore-ClJjsDJc.js";const m={title:"AI + Intelligence/Glass Intelligent Image Uploader",component:r,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"Direct rendering of the public GlassIntelligentImageUploader export inside its required image-processing provider."}}},tags:["autodocs"]},e={render:()=>a.jsx(t,{children:a.jsx("div",{style:{width:"min(720px, calc(100vw - 32px))",maxHeight:"calc(100vh - 48px)"},children:a.jsx(r,{"aria-label":"Intelligent image uploader",maxFiles:6,maxFileSize:12,acceptedFormats:["image/jpeg","image/png","image/webp"],showEditor:!1,showOptimization:!0,showTemplates:!0,showAIFeatures:!0})})})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <ImageProcessingProvider>
      <div style={{
      width: "min(720px, calc(100vw - 32px))",
      maxHeight: "calc(100vh - 48px)"
    }}>
        <IntelligentImageUploader aria-label="Intelligent image uploader" maxFiles={6} maxFileSize={12} acceptedFormats={["image/jpeg", "image/png", "image/webp"]} showEditor={false} showOptimization showTemplates showAIFeatures />
      </div>
    </ImageProcessingProvider>
}`,...e.parameters?.docs?.source}}};const p=["GlassIntelligentImageUploader"];export{e as GlassIntelligentImageUploader,p as __namedExportsOrder,m as default};
