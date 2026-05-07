import{b as O,r as l,j as s,c as g}from"./iframe-C1j_9pGm.js";import{b as Q}from"./index-BbjCvVQP.js";import{M as J}from"./MotionFramer-JM_agJcB.js";import{G as K}from"./GlassCard-D8D1Bkmw.js";import{C as X}from"./clock-CU55bWlg.js";import{I as Y}from"./image-D3aCNnwn.js";import{V as Z}from"./video-T7oHvUuK.js";import{F as ss}from"./file-D3FMMVz4.js";import{G as i}from"./GlassButton-DkcqNLpM.js";import{D as es}from"./download-C4s8TDmc.js";import{H as as}from"./heart-BTC82Mnc.js";import{c as S}from"./createLucideIcon-BFlZd7Ja.js";import{E as ts}from"./ellipsis-DcYmsm52.js";import{C as ls}from"./circle-alert-BMZD9Dy8.js";import{C as ns}from"./check-DdKzWiZM.js";import{f as w}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./utilsCore-MhQK04QN.js";import"./LiquidGlassMaterial-BfOIzeQM.js";import"./LiquidGlassLayerProvider-CRD6ea23.js";import"./OptimizedGlassCore-fs4nsz79.js";import"./deviceCapabilities-BHvtgRvM.js";import"./index-BHYlK66i.js";import"./a11y-DqIQidVG.js";import"./GlassPredictiveEngine-D7TA3Ph8.js";import"./GlassAchievementSystem-DGJv5RbB.js";import"./GlassBiometricAdaptation-Cdkb9XAh.js";import"./MotionPreferenceContext-HBw8OzFx.js";import"./GlassEyeTracking-DElS-_jN.js";import"./GlassSpatialAudio-FEy3Zs_i.js";import"./index-ByImX2pa.js";const rs=[["path",{d:"M18 6 7 17l-5-5",key:"116fxf"}],["path",{d:"m22 10-7.5 7.5L13 16",key:"ke71qq"}]],is=S("check-check",rs);const os=[["path",{d:"M20 18v-2a4 4 0 0 0-4-4H4",key:"5vmcpk"}],["path",{d:"m9 17-5-5 5-5",key:"nvlc11"}]],cs=S("reply",os),v=({messages:r=[],currentUserId:A,enableReactions:I=!0,enableReplies:V=!0,showMessageStatus:q=!0,showTimestamps:R=!0,showAvatars:z=!0,enableSearch:b=!1,virtualScroll:ms=!1,onMessageClick:j,onMessageReaction:N,onMessageReply:C,onAttachmentDownload:k,className:_,"data-testid":G,...L})=>{const T=O(),[h,E]=l.useState(null),[c,H]=l.useState(""),[f,U]=l.useState(!1),d=l.useRef(null);l.useEffect(()=>{d.current&&typeof d.current.scrollIntoView=="function"&&d.current.scrollIntoView({behavior:"smooth"})},[r]);const B=l.useCallback(a=>{E(h===a.id?null:a.id),j?.(a)},[h,j]),M=l.useCallback((a,n)=>{N?.(a,n)},[N]),F=l.useCallback(a=>{C?.(a)},[C]),P=l.useCallback(a=>{k?.(a)},[k]),W=l.useCallback(a=>{const e=new Date().getTime()-a.getTime(),o=Math.floor(e/6e4),m=Math.floor(e/36e5);return o<1?"now":o<60?`${o}m`:m<24?`${m}h`:a.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},[]),$=(c?r.filter(a=>a.content.toLowerCase().includes(c.toLowerCase())||a.sender.name.toLowerCase().includes(c.toLowerCase())):r).reduce((a,n)=>{const e=n.timestamp.toDateString();return a[e]||(a[e]=[]),a[e].push(n),a},{});return s.jsx(J,{"data-glass-component":!0,preset:"fadeIn",className:"glass-w-full glass-h-full",children:s.jsxs(K,{className:g("flex flex-col h-full overflow-hidden",_),"data-testid":G,role:"log","aria-label":"Message list",...L,children:[b&&f&&s.jsx("div",{className:"glass-p-4 glass-border-b glass-border-white/10",children:s.jsx("input",{type:"text",placeholder:"Search messages...",value:c,onChange:a=>H(a.target.value),className:"glass-w-full glass-bg-fill glass-ring-1 glass-ring-white-opacity-10 glass-radius-lg glass-px-4 glass-py-2 glass-text-primary glass-placeholder-white-opacity-50 glass-focus-outline-none glass-focus-ring-white-opacity-30 glass-focus glass-touch-target glass-contrast-guard"})}),s.jsxs(Q,{className:"glass-flex-1 glass-overflow-y-auto glass-p-4",spacing:"lg",children:[Object.entries($).map(([a,n])=>s.jsxs("div",{children:[s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-my-6",children:s.jsx("div",{className:"glass-px-3 glass-py-1 glass-surface-subtle/10 glass-radius-full",children:s.jsx("span",{className:"glass-text-primary-glass-opacity-60 glass-text-xs",children:new Date(a).toLocaleDateString()})})}),s.jsx("div",{className:"glass-auto-gap glass-auto-gap-md",children:n.map((e,o)=>{const m=e.sender.id===A,D=h===e.id;return s.jsx("div",{className:g("group relative cursor-pointer glass-focus glass-touch-target",!T&&"transition-all duration-200 animate-slide-in-up",D&&"ring-2 ring-primary glass-radius-lg"),style:{animationDelay:`${Math.min(o,20)*20}ms`,animationFillMode:"both"},onClick:()=>B(e),children:s.jsxs("div",{className:g("flex glass-gap-3 glass-p-3 glass-radius-lg transition-all duration-200",D?"bg-primary/20":"hover:bg-white/5"),children:[z&&s.jsx("div",{className:"glass-flex-shrink-0",children:s.jsx("div",{className:"glass-w-10 glass-h-10 glass-radius-full glass-surface-subtle/20 glass-flex glass-items-center glass-justify-center",children:e.sender.avatar?s.jsx("img",{src:e.sender.avatar,alt:e.sender.name,className:"glass-w-full glass-h-full glass-radius-full glass-object-cover"}):s.jsx("span",{className:"glass-text-primary-glass-opacity-80 glass-text-sm glass-font-medium",children:e.sender.name.charAt(0).toUpperCase()})})}),s.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-mb-1",children:[s.jsx("span",{className:"glass-text-primary glass-font-medium glass-text-sm",children:e.sender.name}),e.sender.status&&s.jsx("div",{className:g("w-2 h-2 glass-radius-full",e.sender.status==="online"?"bg-green-400":e.sender.status==="away"?"bg-yellow-400":e.sender.status==="busy"?"bg-red-400":"bg-gray-400")}),R&&s.jsxs("span",{className:"glass-text-primary-glass-opacity-60 glass-text-xs glass-flex glass-items-center glass-gap-1",children:[s.jsx(X,{className:"glass-w-3 glass-h-3"}),W(e.timestamp)]}),e.edited&&s.jsx("span",{className:"glass-text-primary-glass-opacity-50 glass-text-xs",children:"(edited)"})]}),s.jsx("div",{className:"glass-text-primary-glass-opacity-90 glass-text-sm glass-leading-relaxed",children:e.content}),e.attachments&&e.attachments.length>0&&s.jsx("div",{className:"glass-mt-3 glass-auto-gap glass-auto-gap-sm",children:e.attachments.map((t,x)=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 glass-p-3 glass-surface-dark/20 glass-radius-lg hover:glass-surface-dark/30 glass-transition-colors glass-cursor-pointer glass-border glass-border-white/10 hover:glass-border-white/20 glass-focus glass-touch-target glass-contrast-guard",onClick:y=>{y.stopPropagation(),P({url:t.url,name:t.name})},children:[s.jsxs("div",{className:"glass-flex-shrink-0",children:[t.type==="image"&&s.jsx(Y,{className:"glass-w-5 glass-h-5 glass-text-primary"}),t.type==="video"&&s.jsx(Z,{className:"glass-w-5 glass-h-5 glass-text-primary"}),t.type==="file"&&s.jsx(ss,{className:"glass-w-5 glass-h-5 glass-text-primary"})]}),s.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[s.jsx("p",{className:"glass-text-primary-glass-opacity-90 glass-text-sm glass-truncate",children:t.name}),t.size&&s.jsxs("p",{className:"glass-text-primary-glass-opacity-60 glass-text-xs",children:[(t.size/1024/1024).toFixed(1)," ","MB"]})]}),s.jsx(i,{variant:"ghost",size:"sm",className:"glass-p-1",children:s.jsx(es,{className:"glass-w-4 glass-h-4"})})]},x))}),e.reactions&&e.reactions.length>0&&s.jsx("div",{className:"glass-flex glass-gap-1 glass-mt-2",children:e.reactions.map((t,x)=>s.jsxs(i,{variant:"ghost",size:"sm",onClick:y=>{y.stopPropagation(),M(e.id,t.emoji)},className:"glass-h-6 glass-px-2 glass-text-xs glass-surface-subtle/10 glass-focus glass-touch-target",children:[t.emoji," ",t.count]},x))})]}),s.jsx("div",{className:"glass-absolute glass-right-2 glass-top-2 glass-z-10 glass-opacity-0 glass-group-glass-hover-opacity-100 glass-transition-opacity",children:s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-1",children:[I&&s.jsx(i,{variant:"ghost",size:"sm",onClick:t=>{t.stopPropagation(),M(e.id,"👍")},className:"glass-p-1 glass-focus glass-touch-target",children:s.jsx(as,{className:"glass-w-3 glass-h-3"})}),V&&s.jsx(i,{variant:"ghost",size:"sm",onClick:t=>{t.stopPropagation(),F(e.id)},className:"glass-p-1 glass-focus glass-touch-target",children:s.jsx(cs,{className:"glass-w-3 glass-h-3"})}),s.jsx(i,{variant:"ghost",size:"sm",onClick:t=>t.stopPropagation(),className:"glass-p-1 glass-focus glass-touch-target",children:s.jsx(ts,{className:"glass-w-3 glass-h-3"})})]})}),q&&m&&s.jsx("div",{className:"glass-flex-shrink-0 glass-ml-2",children:e.type==="system"?s.jsx(ls,{className:"glass-w-4 glass-h-4 glass-text-primary"}):s.jsxs("div",{className:"glass-flex",children:[s.jsx(ns,{className:"glass-w-3 glass-h-3 glass-text-primary-glass-opacity-60"}),s.jsx(is,{className:"glass-w-3 glass-h-3 glass-text-primary glass--ml-1"})]})})]})},e.id)})})]},a)),s.jsx("div",{ref:d})]}),b&&s.jsx("div",{className:"glass-p-4 glass-border-t glass-border-white/10",children:s.jsx(i,{variant:"ghost",size:"sm",onClick:()=>U(!f),className:"glass-w-full glass-focus glass-touch-target",children:f?"Hide Search":"Search Messages"})})]})})};try{v.displayName="GlassMessageList",v.__docgenInfo={description:`GlassMessageList component
A scrollable list of chat messages with reactions, replies, and attachments`,displayName:"GlassMessageList",props:{messages:{defaultValue:{value:"[]"},description:"Messages to display",name:"messages",required:!1,type:{name:"ChatMessage[] | undefined"}},currentUserId:{defaultValue:null,description:"Current user ID",name:"currentUserId",required:!1,type:{name:"string | undefined"}},enableReactions:{defaultValue:{value:"true"},description:"Enable message reactions",name:"enableReactions",required:!1,type:{name:"boolean | undefined"}},enableReplies:{defaultValue:{value:"true"},description:"Enable message replies",name:"enableReplies",required:!1,type:{name:"boolean | undefined"}},showMessageStatus:{defaultValue:{value:"true"},description:"Show message status",name:"showMessageStatus",required:!1,type:{name:"boolean | undefined"}},showTimestamps:{defaultValue:{value:"true"},description:"Show timestamps",name:"showTimestamps",required:!1,type:{name:"boolean | undefined"}},showAvatars:{defaultValue:{value:"true"},description:"Show user avatars",name:"showAvatars",required:!1,type:{name:"boolean | undefined"}},enableSearch:{defaultValue:{value:"false"},description:"Enable message search",name:"enableSearch",required:!1,type:{name:"boolean | undefined"}},virtualScroll:{defaultValue:{value:"false"},description:"Virtual scrolling",name:"virtualScroll",required:!1,type:{name:"boolean | undefined"}},onMessageClick:{defaultValue:null,description:"Message click handler",name:"onMessageClick",required:!1,type:{name:"((message: ChatMessage) => void) | undefined"}},onMessageReaction:{defaultValue:null,description:"Message reaction handler",name:"onMessageReaction",required:!1,type:{name:"((messageId: string, emoji: string) => void) | undefined"}},onMessageReply:{defaultValue:null,description:"Message reply handler",name:"onMessageReply",required:!1,type:{name:"((messageId: string) => void) | undefined"}},onAttachmentDownload:{defaultValue:null,description:"Attachment download handler",name:"onAttachmentDownload",required:!1,type:{name:"((attachment: { url: string; name: string; }) => void) | undefined"}},className:{defaultValue:null,description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"Custom data-testid for testing",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const ds=`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0f172a"/>
          <stop offset="0.6" stop-color="#2563eb"/>
          <stop offset="1" stop-color="#0f766e"/>
        </linearGradient>
      </defs>
      <rect width="300" height="200" fill="url(#bg)"/>
      <circle cx="220" cy="56" r="34" fill="rgba(255,255,255,.18)"/>
      <text x="28" y="124" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" fill="#ffffff">Attachment</text>
    </svg>
  `)}`,Ps={title:"Workflows/Glass Message List",component:v,parameters:{layout:"fullscreen",docs:{description:{component:"A glass morphism glassmessagelist component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"},currentUserId:{control:"text",description:"Current user ID"},enableReactions:{control:"boolean",description:"Enable message reactions"},showTimestamps:{control:"boolean",description:"Show message timestamps"},showAvatars:{control:"boolean",description:"Show user avatars"}},args:{className:"",currentUserId:"user1",enableReactions:!0,showTimestamps:!0,showAvatars:!0},decorators:[r=>s.jsx("div",{style:{boxSizing:"border-box",display:"grid",minHeight:"100vh",overflow:"hidden",padding:16,placeItems:"center",width:"min(100%, calc(100vw - 64px))"},children:s.jsx(r,{})})]},u={args:{messages:[{id:"1",content:"Hello everyone! Welcome to the chat.",sender:{id:"user1",name:"Alice",avatar:"",status:"online"},timestamp:new Date(Date.now()-3e5),type:"text"},{id:"2",content:"Thanks Alice! Glad to be here.",sender:{id:"user2",name:"Bob",avatar:"",status:"online"},timestamp:new Date(Date.now()-24e4),type:"text"},{id:"3",content:"How is everyone doing today?",sender:{id:"user3",name:"Charlie",avatar:"",status:"away"},timestamp:new Date(Date.now()-18e4),type:"text"}],onMessageClick:w(),onMessageReaction:w()}},p={args:{messages:[{id:"1",content:"Check out this image I found!",sender:{id:"user1",name:"Alice",avatar:"",status:"online"},timestamp:new Date(Date.now()-12e4),type:"text",attachments:[{type:"image",url:ds,name:"sample-image.jpg",size:245760}]},{id:"2",content:"Here's the document you requested.",sender:{id:"user2",name:"Bob",avatar:"",status:"online"},timestamp:new Date(Date.now()-6e4),type:"text",attachments:[{type:"file",url:"#",name:"important-document.pdf",size:1048576}]}],onAttachmentDownload:w()}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
        url: attachmentImage,
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
}`,...p.parameters?.docs?.source}}};const Ws=["Default","WithAttachments"];export{u as Default,p as WithAttachments,Ws as __namedExportsOrder,Ps as default};
