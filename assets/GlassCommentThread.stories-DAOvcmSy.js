import{R as f,j as s,c as t}from"./iframe-DBVOVM-c.js";import{G as y}from"./GlassButton-DDji8ykS.js";import{O as v}from"./OptimizedGlassCore-CyIux4a_.js";import{f as i}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DEDjQVGp.js";import"./LiquidGlassMaterial-BxQSDtcp.js";import"./LiquidGlassLayerProvider-EOSql5rI.js";import"./GlassPredictiveEngine-DQcsU0Kw.js";import"./GlassAchievementSystem-D2fh9x4W.js";import"./GlassBiometricAdaptation-ov4NVf6J.js";import"./MotionPreferenceContext-DuNK6mTA.js";import"./GlassEyeTracking-BL8t9uSv.js";import"./GlassSpatialAudio-cNFLaQk4.js";import"./MotionFramer-DLgCJzPg.js";import"./utilsCore-B0Pwu3YL.js";import"./index-ByImX2pa.js";function l({comments:d,onReply:c,className:h,...u}){const[o,x]=f.useState({}),p=(e,m)=>x(a=>({...a,[e]:m})),g=(e,m=0)=>s.jsxs("div",{className:t("glass-gap-2"),children:[s.jsxs(v,{elevation:"level1",className:t("glass-radius-lg glass-p-3 glass-border glass-border-white-15"),children:[s.jsx("div",{className:t("glass-text-sm glass-text-primary-90 glass-font-medium"),children:e.author}),s.jsx("div",{className:t("glass-text-sm glass-text-primary-80 glass-whitespace-pre-wrap"),children:e.text}),e.createdAt&&s.jsx("div",{className:t("glass-text-xs glass-text-primary-60 glass-mt-1"),children:e.createdAt})]}),s.jsxs("div",{className:t("glass-ml-6"),children:[s.jsxs("div",{className:t("glass-flex glass-gap-2 glass-items-center"),children:[s.jsx("input",{value:o[e.id]??"",onChange:a=>p(e.id,a.target.value),placeholder:"Reply…",className:t("glass-flex-1 glass-bg-transparent glass-border glass-border-white-20 glass-radius-lg glass-px-2 glass-py-1 glass-text-sm glass-outline-none glass-focus glass-touch-target glass-contrast-guard")}),s.jsx(y,{size:"sm",variant:"secondary",onClick:a=>{c&&o[e.id]&&(c(e.id,o[e.id]),p(e.id,""))},children:"Reply"})]}),e.replies?.length?s.jsx("div",{className:t("glass-mt-2 glass-gap-2"),children:(e.replies||[]).map(a=>g(a,m+1))}):null]})]},e.id);return s.jsx("div",{className:t("glass-gap-3",h),...u,children:(d||[]).map(e=>g(e))})}try{l.displayName="GlassCommentThread",l.__docgenInfo={description:"",displayName:"GlassCommentThread",props:{comments:{defaultValue:null,description:"",name:"comments",required:!0,type:{name:"Comment[]"}},onReply:{defaultValue:null,description:"",name:"onReply",required:!1,type:{name:"((parentId: string, text: string) => void) | undefined"}}}}}catch{}const k={title:"Components/Interactive/GlassCommentThread",component:l,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasscommentthread component."}}},argTypes:{comments:{control:"object",description:"Array of comment objects"},onReply:{control:!1,description:"Callback function for replying to comments"}},args:{comments:[{id:"1",author:"User 1",text:"This is a sample comment",createdAt:"2024-01-01"}],onReply:i()}},r={args:{comments:[{id:"1",author:"John Doe",text:"This is a sample comment thread",createdAt:"2024-01-01 10:00:00"},{id:"2",author:"Jane Smith",text:"This is a reply to the first comment",createdAt:"2024-01-01 10:05:00"}],onReply:i()}},n={args:{comments:[{id:"1",author:"User",text:"Sample comment for variants",createdAt:"2024-01-01"}],onReply:i()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    comments: [{
      id: '1',
      author: 'John Doe',
      text: 'This is a sample comment thread',
      createdAt: '2024-01-01 10:00:00'
    }, {
      id: '2',
      author: 'Jane Smith',
      text: 'This is a reply to the first comment',
      createdAt: '2024-01-01 10:05:00'
    }],
    onReply: fn()
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    comments: [{
      id: '1',
      author: 'User',
      text: 'Sample comment for variants',
      createdAt: '2024-01-01'
    }],
    onReply: fn()
  }
}`,...n.parameters?.docs?.source}}};const q=["Default","Variants"];export{r as Default,n as Variants,q as __namedExportsOrder,k as default};
