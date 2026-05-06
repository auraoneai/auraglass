import{b as O,r as l,j as s,c as g}from"./iframe-OZreUAtx.js";import{b as Q}from"./index-C1jnw9c5.js";import{M as J}from"./MotionFramer-BTsVQK94.js";import{G as K}from"./GlassCard-CKgoLxcS.js";import{C as X}from"./clock-wLQwmP2a.js";import{I as Y}from"./image-CcGvtwes.js";import{V as Z}from"./video-CHbjYiaf.js";import{F as ss}from"./file-DLJL2yem.js";import{G as r}from"./GlassButton-6w9EY7YA.js";import{D as es}from"./download-5pmL2dSv.js";import{H as as}from"./heart-GLQvPRso.js";import{c as S}from"./createLucideIcon-B0rn4XfH.js";import{E as ts}from"./ellipsis-Dz4YJbsA.js";import{C as ls}from"./circle-alert-Br-4cN5a.js";import{C as ns}from"./check--5vnpxHA.js";import{f as w}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./utilsCore-B384u8by.js";import"./LiquidGlassMaterial-6ZsmKJqk.js";import"./LiquidGlassLayerProvider-D9koVs6n.js";import"./OptimizedGlassCore-DAQZMOh8.js";import"./index-BXuO5XkR.js";import"./GlassPredictiveEngine-Hj8SU_hc.js";import"./GlassAchievementSystem-CfusDed6.js";import"./GlassBiometricAdaptation-DaD9o7IG.js";import"./MotionPreferenceContext-DTxERmBA.js";import"./GlassEyeTracking-DEo0jGT7.js";import"./GlassSpatialAudio-C984SGkY.js";import"./index-ByImX2pa.js";const rs=[["path",{d:"M18 6 7 17l-5-5",key:"116fxf"}],["path",{d:"m22 10-7.5 7.5L13 16",key:"ke71qq"}]],is=S("check-check",rs);const os=[["path",{d:"M20 18v-2a4 4 0 0 0-4-4H4",key:"5vmcpk"}],["path",{d:"m9 17-5-5 5-5",key:"nvlc11"}]],cs=S("reply",os),v=({messages:o=[],currentUserId:A,enableReactions:V=!0,enableReplies:q=!0,showMessageStatus:I=!0,showTimestamps:R=!0,showAvatars:_=!0,enableSearch:j=!1,virtualScroll:ds=!1,onMessageClick:b,onMessageReaction:N,onMessageReply:C,onAttachmentDownload:k,className:L,"data-testid":z,...E})=>{const G=O(),[h,T]=l.useState(null),[c,H]=l.useState(""),[f,B]=l.useState(!1),d=l.useRef(null);l.useEffect(()=>{d.current&&typeof d.current.scrollIntoView=="function"&&d.current.scrollIntoView({behavior:"smooth"})},[o]);const U=l.useCallback(a=>{T(h===a.id?null:a.id),b?.(a)},[h,b]),M=l.useCallback((a,n)=>{N?.(a,n)},[N]),F=l.useCallback(a=>{C?.(a)},[C]),P=l.useCallback(a=>{k?.(a)},[k]),W=l.useCallback(a=>{const e=new Date().getTime()-a.getTime(),i=Math.floor(e/6e4),m=Math.floor(e/36e5);return i<1?"now":i<60?`${i}m`:m<24?`${m}h`:a.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},[]),$=(c?o.filter(a=>a.content.toLowerCase().includes(c.toLowerCase())||a.sender.name.toLowerCase().includes(c.toLowerCase())):o).reduce((a,n)=>{const e=n.timestamp.toDateString();return a[e]||(a[e]=[]),a[e].push(n),a},{});return s.jsx(J,{"data-glass-component":!0,preset:"fadeIn",className:"glass-w-full glass-h-full",children:s.jsxs(K,{className:g("flex flex-col h-full overflow-hidden",L),"data-testid":z,role:"log","aria-label":"Message list",...E,children:[j&&f&&s.jsx("div",{className:"glass-p-4 glass-border-b glass-border-white/10",children:s.jsx("input",{type:"text",placeholder:"Search messages...",value:c,onChange:a=>H(a.target.value),className:"glass-w-full glass-bg-fill glass-ring-1 glass-ring-white-opacity-10 glass-radius-lg glass-px-4 glass-py-2 glass-text-primary glass-placeholder-white-opacity-50 glass-focus-outline-none glass-focus-ring-white-opacity-30 glass-focus glass-touch-target glass-contrast-guard"})}),s.jsxs(Q,{className:"glass-flex-1 glass-overflow-y-auto glass-p-4",spacing:"lg",children:[Object.entries($).map(([a,n])=>s.jsxs("div",{children:[s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-my-6",children:s.jsx("div",{className:"glass-px-3 glass-py-1 glass-surface-subtle/10 glass-radius-full",children:s.jsx("span",{className:"glass-text-primary-glass-opacity-60 glass-text-xs",children:new Date(a).toLocaleDateString()})})}),s.jsx("div",{className:"glass-auto-gap glass-auto-gap-md",children:n.map((e,i)=>{const m=e.sender.id===A,D=h===e.id;return s.jsx("div",{className:g("group relative cursor-pointer glass-focus glass-touch-target",!G&&"transition-all duration-200 animate-slide-in-up",D&&"ring-2 ring-primary glass-radius-lg"),style:{animationDelay:`${Math.min(i,20)*20}ms`,animationFillMode:"both"},onClick:()=>U(e),children:s.jsxs("div",{className:g("flex glass-gap-3 glass-p-3 glass-radius-lg transition-all duration-200",D?"bg-primary/20":"hover:bg-white/5"),children:[_&&s.jsx("div",{className:"glass-flex-shrink-0",children:s.jsx("div",{className:"glass-w-10 glass-h-10 glass-radius-full glass-surface-subtle/20 glass-flex glass-items-center glass-justify-center",children:e.sender.avatar?s.jsx("img",{src:e.sender.avatar,alt:e.sender.name,className:"glass-w-full glass-h-full glass-radius-full glass-object-cover"}):s.jsx("span",{className:"glass-text-primary-glass-opacity-80 glass-text-sm glass-font-medium",children:e.sender.name.charAt(0).toUpperCase()})})}),s.jsxs("div",{className:"glass-flex-1 glass-min-glass-w-0",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-mb-1",children:[s.jsx("span",{className:"glass-text-primary glass-font-medium glass-text-sm",children:e.sender.name}),e.sender.status&&s.jsx("div",{className:g("w-2 h-2 glass-radius-full",e.sender.status==="online"?"bg-green-400":e.sender.status==="away"?"bg-yellow-400":e.sender.status==="busy"?"bg-red-400":"bg-gray-400")}),R&&s.jsxs("span",{className:"glass-text-primary-glass-opacity-60 glass-text-xs glass-flex glass-items-center glass-gap-1",children:[s.jsx(X,{className:"glass-w-3 glass-h-3"}),W(e.timestamp)]}),e.edited&&s.jsx("span",{className:"glass-text-primary-glass-opacity-50 glass-text-xs",children:"(edited)"})]}),s.jsx("div",{className:"glass-text-primary-glass-opacity-90 glass-text-sm glass-leading-relaxed",children:e.content}),e.attachments&&e.attachments.length>0&&s.jsx("div",{className:"glass-mt-3 glass-auto-gap glass-auto-gap-sm",children:e.attachments.map((t,x)=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 glass-p-3 glass-surface-dark/20 glass-radius-lg hover:glass-surface-dark/30 glass-transition-colors glass-cursor-pointer glass-border glass-border-white/10 hover:glass-border-white/20 glass-focus glass-touch-target glass-contrast-guard",onClick:y=>{y.stopPropagation(),P({url:t.url,name:t.name})},children:[s.jsxs("div",{className:"glass-flex-shrink-0",children:[t.type==="image"&&s.jsx(Y,{className:"glass-w-5 glass-h-5 glass-text-primary"}),t.type==="video"&&s.jsx(Z,{className:"glass-w-5 glass-h-5 glass-text-primary"}),t.type==="file"&&s.jsx(ss,{className:"glass-w-5 glass-h-5 glass-text-primary"})]}),s.jsxs("div",{className:"glass-flex-1 glass-min-glass-w-0",children:[s.jsx("p",{className:"glass-text-primary-glass-opacity-90 glass-text-sm glass-truncate",children:t.name}),t.size&&s.jsxs("p",{className:"glass-text-primary-glass-opacity-60 glass-text-xs",children:[(t.size/1024/1024).toFixed(1)," ","MB"]})]}),s.jsx(r,{variant:"ghost",size:"sm",className:"glass-p-1",children:s.jsx(es,{className:"glass-w-4 glass-h-4"})})]},x))}),e.reactions&&e.reactions.length>0&&s.jsx("div",{className:"glass-flex glass-gap-1 glass-mt-2",children:e.reactions.map((t,x)=>s.jsxs(r,{variant:"ghost",size:"sm",onClick:y=>{y.stopPropagation(),M(e.id,t.emoji)},className:"glass-h-6 glass-px-2 glass-text-xs glass-surface-subtle/10 glass-focus glass-touch-target",children:[t.emoji," ",t.count]},x))})]}),s.jsx("div",{className:"glass-flex-shrink-0 glass-opacity-0 glass-group-glass-hover-opacity-100 glass-transition-opacity",children:s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-1",children:[V&&s.jsx(r,{variant:"ghost",size:"sm",onClick:t=>{t.stopPropagation(),M(e.id,"👍")},className:"glass-p-1 glass-focus glass-touch-target",children:s.jsx(as,{className:"glass-w-3 glass-h-3"})}),q&&s.jsx(r,{variant:"ghost",size:"sm",onClick:t=>{t.stopPropagation(),F(e.id)},className:"glass-p-1 glass-focus glass-touch-target",children:s.jsx(cs,{className:"glass-w-3 glass-h-3"})}),s.jsx(r,{variant:"ghost",size:"sm",onClick:t=>t.stopPropagation(),className:"glass-p-1 glass-focus glass-touch-target",children:s.jsx(ts,{className:"glass-w-3 glass-h-3"})})]})}),I&&m&&s.jsx("div",{className:"glass-flex-shrink-0 glass-ml-2",children:e.type==="system"?s.jsx(ls,{className:"glass-w-4 glass-h-4 glass-text-primary"}):s.jsxs("div",{className:"glass-flex",children:[s.jsx(ns,{className:"glass-w-3 glass-h-3 glass-text-primary-glass-opacity-60"}),s.jsx(is,{className:"glass-w-3 glass-h-3 glass-text-primary glass--ml-1"})]})})]})},e.id)})})]},a)),s.jsx("div",{ref:d})]}),j&&s.jsx("div",{className:"glass-p-4 glass-border-t glass-border-white/10",children:s.jsx(r,{variant:"ghost",size:"sm",onClick:()=>B(!f),className:"glass-w-full glass-focus glass-touch-target",children:f?"Hide Search":"Search Messages"})})]})})};try{v.displayName="GlassMessageList",v.__docgenInfo={description:`GlassMessageList component
A scrollable list of chat messages with reactions, replies, and attachments`,displayName:"GlassMessageList",props:{messages:{defaultValue:{value:"[]"},description:"Messages to display",name:"messages",required:!1,type:{name:"ChatMessage[] | undefined"}},currentUserId:{defaultValue:null,description:"Current user ID",name:"currentUserId",required:!1,type:{name:"string | undefined"}},enableReactions:{defaultValue:{value:"true"},description:"Enable message reactions",name:"enableReactions",required:!1,type:{name:"boolean | undefined"}},enableReplies:{defaultValue:{value:"true"},description:"Enable message replies",name:"enableReplies",required:!1,type:{name:"boolean | undefined"}},showMessageStatus:{defaultValue:{value:"true"},description:"Show message status",name:"showMessageStatus",required:!1,type:{name:"boolean | undefined"}},showTimestamps:{defaultValue:{value:"true"},description:"Show timestamps",name:"showTimestamps",required:!1,type:{name:"boolean | undefined"}},showAvatars:{defaultValue:{value:"true"},description:"Show user avatars",name:"showAvatars",required:!1,type:{name:"boolean | undefined"}},enableSearch:{defaultValue:{value:"false"},description:"Enable message search",name:"enableSearch",required:!1,type:{name:"boolean | undefined"}},virtualScroll:{defaultValue:{value:"false"},description:"Virtual scrolling",name:"virtualScroll",required:!1,type:{name:"boolean | undefined"}},onMessageClick:{defaultValue:null,description:"Message click handler",name:"onMessageClick",required:!1,type:{name:"((message: ChatMessage) => void) | undefined"}},onMessageReaction:{defaultValue:null,description:"Message reaction handler",name:"onMessageReaction",required:!1,type:{name:"((messageId: string, emoji: string) => void) | undefined"}},onMessageReply:{defaultValue:null,description:"Message reply handler",name:"onMessageReply",required:!1,type:{name:"((messageId: string) => void) | undefined"}},onAttachmentDownload:{defaultValue:null,description:"Attachment download handler",name:"onAttachmentDownload",required:!1,type:{name:"((attachment: { url: string; name: string; }) => void) | undefined"}},className:{defaultValue:null,description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"Custom data-testid for testing",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const Bs={title:"Components/Interactive/GlassMessageList",component:v,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassmessagelist component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"},currentUserId:{control:"text",description:"Current user ID"},enableReactions:{control:"boolean",description:"Enable message reactions"},showTimestamps:{control:"boolean",description:"Show message timestamps"},showAvatars:{control:"boolean",description:"Show user avatars"}},args:{className:"",currentUserId:"user1",enableReactions:!0,showTimestamps:!0,showAvatars:!0}},u={args:{messages:[{id:"1",content:"Hello everyone! Welcome to the chat.",sender:{id:"user1",name:"Alice",avatar:"",status:"online"},timestamp:new Date(Date.now()-3e5),type:"text"},{id:"2",content:"Thanks Alice! Glad to be here.",sender:{id:"user2",name:"Bob",avatar:"",status:"online"},timestamp:new Date(Date.now()-24e4),type:"text"},{id:"3",content:"How is everyone doing today?",sender:{id:"user3",name:"Charlie",avatar:"",status:"away"},timestamp:new Date(Date.now()-18e4),type:"text"}],onMessageClick:w(),onMessageReaction:w()}},p={args:{messages:[{id:"1",content:"Check out this image I found!",sender:{id:"user1",name:"Alice",avatar:"",status:"online"},timestamp:new Date(Date.now()-12e4),type:"text",attachments:[{type:"image",url:"https://via.placeholder.com/300x200",name:"sample-image.jpg",size:245760}]},{id:"2",content:"Here's the document you requested.",sender:{id:"user2",name:"Bob",avatar:"",status:"online"},timestamp:new Date(Date.now()-6e4),type:"text",attachments:[{type:"file",url:"#",name:"important-document.pdf",size:1048576}]}],onAttachmentDownload:w()}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    messages: [{
      id: '1',
      content: 'Hello everyone! Welcome to the chat.',
      sender: {
        id: 'user1',
        name: 'Alice',
        avatar: '',
        status: 'online' as const
      },
      timestamp: new Date(Date.now() - 300000),
      // 5 minutes ago
      type: 'text' as const
    }, {
      id: '2',
      content: 'Thanks Alice! Glad to be here.',
      sender: {
        id: 'user2',
        name: 'Bob',
        avatar: '',
        status: 'online' as const
      },
      timestamp: new Date(Date.now() - 240000),
      // 4 minutes ago
      type: 'text' as const
    }, {
      id: '3',
      content: 'How is everyone doing today?',
      sender: {
        id: 'user3',
        name: 'Charlie',
        avatar: '',
        status: 'away' as const
      },
      timestamp: new Date(Date.now() - 180000),
      // 3 minutes ago
      type: 'text' as const
    }],
    onMessageClick: fn(),
    onMessageReaction: fn()
  }
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    messages: [{
      id: '1',
      content: 'Check out this image I found!',
      sender: {
        id: 'user1',
        name: 'Alice',
        avatar: '',
        status: 'online' as const
      },
      timestamp: new Date(Date.now() - 120000),
      type: 'text' as const,
      attachments: [{
        type: 'image',
        url: 'https://via.placeholder.com/300x200',
        name: 'sample-image.jpg',
        size: 245760
      }]
    }, {
      id: '2',
      content: 'Here\\'s the document you requested.',
      sender: {
        id: 'user2',
        name: 'Bob',
        avatar: '',
        status: 'online' as const
      },
      timestamp: new Date(Date.now() - 60000),
      type: 'text' as const,
      attachments: [{
        type: 'file',
        url: '#',
        name: 'important-document.pdf',
        size: 1048576
      }]
    }],
    onAttachmentDownload: fn()
  }
}`,...p.parameters?.docs?.source}}};const Us=["Default","WithAttachments"];export{u as Default,p as WithAttachments,Us as __namedExportsOrder,Bs as default};
