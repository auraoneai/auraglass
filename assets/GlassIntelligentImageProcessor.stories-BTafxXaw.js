import{j as s}from"./iframe-DF7JlHBi.js";import{I as i}from"./GlassImageProcessingProvider-ZJM9Xe3y.js";import{G as o}from"./GlassIntelligentImageUploader-BteVlbeH.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassCore-B34oaa8V.js";const d={title:"AI + Intelligence/Glass Intelligent Image Processor",component:o,parameters:{layout:"padded",docs:{description:{component:"AI-powered image processing with optimization and simple editing."}}},decorators:[a=>s.jsx(i,{children:s.jsx("div",{style:{minHeight:"600px",background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",padding:"2rem"},children:s.jsx(a,{})})})]},e={name:"Basic Image Uploader",args:{maxFiles:5,maxFileSize:10,acceptedFormats:["image/jpeg","image/png","image/webp"],onImagesUploaded:a=>{console.log("Images uploaded:",a)}},parameters:{docs:{description:{story:"Basic intelligent image uploader with real-time processing feedback."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: 'Basic Image Uploader',
  args: {
    maxFiles: 5,
    maxFileSize: 10,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    onImagesUploaded: images => {
      console.log('Images uploaded:', images);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic intelligent image uploader with real-time processing feedback.'
      }
    }
  }
}`,...e.parameters?.docs?.source}}};const g=["BasicUploader"];export{e as BasicUploader,g as __namedExportsOrder,d as default};
