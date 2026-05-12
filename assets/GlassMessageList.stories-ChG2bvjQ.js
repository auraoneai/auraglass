import{b as re,r,j as e,c as l}from"./iframe-B_p7zla-.js";import{b as ie}from"./index-CfJyg_Zv.js";import{M as oe}from"./MotionFramer-o4e46iWo.js";import{G as ce}from"./GlassCard-nwPAfeoz.js";import{C as de}from"./clock-w824dmdS.js";import{I as me}from"./image-BzYBoguq.js";import{V as ge}from"./video-DbMZqzDh.js";import{F as ue}from"./file-g4ggxgLt.js";import{G as c}from"./GlassButton-BLOvqXGF.js";import{D as pe}from"./download-DCrBDyiN.js";import{H as fe}from"./heart-BXaOPcbb.js";import{c as I}from"./createLucideIcon-D6fqlqMf.js";import{E as he}from"./ellipsis-41rGvYTo.js";import{C as xe}from"./circle-alert-BEdVFR22.js";import{C as ye}from"./check-CXS1Xxcf.js";import{f as N}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./utilsCore-8IEQIJNb.js";import"./LiquidGlassMaterial-C_6TtWno.js";import"./LiquidGlassLayerProvider-C-9aZbrB.js";import"./OptimizedGlassCore-DOcR6zy-.js";import"./deviceCapabilities-BJ_x-v1T.js";import"./index-CGSQAKf9.js";import"./a11y-Js05jiIh.js";import"./GlassPredictiveEngine-D6Iw_Zo5.js";import"./GlassAchievementSystem-CjoOxvts.js";import"./GlassBiometricAdaptation-D1X16vNJ.js";import"./MotionPreferenceContext-BpYLW5VW.js";import"./GlassEyeTracking-1XHT9Ucr.js";import"./GlassSpatialAudio-N4RyGCEL.js";import"./index-ByImX2pa.js";const ve=[["path",{d:"M18 6 7 17l-5-5",key:"116fxf"}],["path",{d:"m22 10-7.5 7.5L13 16",key:"ke71qq"}]],we=I("check-check",ve);const be=[["path",{d:"M20 18v-2a4 4 0 0 0-4-4H4",key:"5vmcpk"}],["path",{d:"m9 17-5-5 5-5",key:"nvlc11"}]],je=I("reply",be),C=({messages:o=[],currentUserId:R,enableReactions:z=!0,enableReplies:_=!0,showMessageStatus:G=!0,showTimestamps:H=!0,showAvatars:L=!0,enableSearch:M=!1,virtualScroll:Ce=!1,onMessageClick:k,onMessageReaction:D,onMessageReply:S,onAttachmentDownload:A,className:E,compact:T=!1,contained:U=!1,preview:B=!1,maxHeight:h,maxWidth:x,density:W="comfortable","data-testid":$,...F})=>{const P=re(),[y,O]=r.useState(null),[m,Q]=r.useState(""),[v,K]=r.useState(!1),g=r.useRef(null);r.useEffect(()=>{g.current&&typeof g.current.scrollIntoView=="function"&&g.current.scrollIntoView({behavior:"smooth"})},[o]);const J=r.useCallback(a=>{O(y===a.id?null:a.id),k?.(a)},[y,k]),V=r.useCallback((a,i)=>{D?.(a,i)},[D]),X=r.useCallback(a=>{S?.(a)},[S]),Y=r.useCallback(a=>{A?.(a)},[A]),Z=r.useCallback(a=>{const s=new Date().getTime()-a.getTime(),d=Math.floor(s/6e4),u=Math.floor(s/36e5);return d<1?"now":d<60?`${d}m`:u<24?`${u}h`:a.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},[]),ee=(m?o.filter(a=>a.content.toLowerCase().includes(m.toLowerCase())||a.sender.name.toLowerCase().includes(m.toLowerCase())):o).reduce((a,i)=>{const s=i.timestamp.toDateString();return a[s]||(a[s]=[]),a[s].push(i),a},{}),n=T||B||W==="compact",w=U||n,se=typeof h=="number"?`${h}px`:h,ae=typeof x=="number"?`${x}px`:x,te=n?!1:L,ne=n?!1:G,le=n?!1:_;return e.jsx(oe,{"data-glass-component":!0,preset:"fadeIn",className:"glass-w-full glass-h-full",children:e.jsxs(ce,{className:l("flex flex-col h-full overflow-hidden",w&&"glass-w-full",n&&"glass-text-sm",E),style:{maxHeight:se??(w?"220px":void 0),maxWidth:ae??(w?"320px":void 0)},"data-testid":$,role:"log","aria-label":"Message list",...F,children:[M&&v&&e.jsx("div",{className:l(n?"glass-p-2":"glass-p-4","glass-border-b glass-border-white/10"),children:e.jsx("input",{type:"text",placeholder:"Search messages...",value:m,onChange:a=>Q(a.target.value),className:"glass-w-full glass-bg-fill glass-ring-1 glass-ring-white-opacity-10 glass-radius-lg glass-px-4 glass-py-2 glass-text-primary glass-placeholder-white-opacity-50 glass-focus-outline-none glass-focus-ring-white-opacity-30 glass-focus glass-touch-target glass-contrast-guard"})}),e.jsxs(ie,{className:l("glass-flex-1 glass-overflow-y-auto",n?"glass-p-2":"glass-p-4"),spacing:n?"sm":"lg",children:[Object.entries(ee).map(([a,i])=>e.jsxs("div",{children:[e.jsx("div",{className:l("glass-flex glass-items-center glass-justify-center",n?"glass-my-2":"glass-my-6"),children:e.jsx("div",{className:"glass-px-3 glass-py-1 glass-surface-subtle/10 glass-radius-full",children:e.jsx("span",{className:"glass-text-primary-glass-opacity-60 glass-text-xs",children:new Date(a).toLocaleDateString()})})}),e.jsx("div",{className:l("glass-auto-gap",n?"glass-auto-gap-sm":"glass-auto-gap-md"),children:i.map((s,d)=>{const u=s.sender.id===R,q=y===s.id;return e.jsx("div",{className:l("group relative cursor-pointer glass-focus glass-touch-target",!P&&"transition-all duration-200 animate-slide-in-up",q&&"ring-2 ring-primary glass-radius-lg"),style:{animationDelay:`${Math.min(d,20)*20}ms`,animationFillMode:"both"},onClick:()=>J(s),children:e.jsxs("div",{className:l("flex glass-radius-lg transition-all duration-200",n?"glass-gap-2 glass-p-2":"glass-gap-3 glass-p-3",q?"bg-primary/20":"hover:bg-white/5"),children:[te&&e.jsx("div",{className:"glass-flex-shrink-0",children:e.jsx("div",{className:"glass-w-10 glass-h-10 glass-radius-full glass-surface-subtle/20 glass-flex glass-items-center glass-justify-center",children:s.sender.avatar?e.jsx("img",{src:s.sender.avatar,alt:s.sender.name,className:"glass-w-full glass-h-full glass-radius-full glass-object-cover"}):e.jsx("span",{className:"glass-text-primary-glass-opacity-80 glass-text-sm glass-font-medium",children:s.sender.name.charAt(0).toUpperCase()})})}),e.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[e.jsxs("div",{className:l("glass-flex glass-items-center glass-gap-2",n?"glass-mb-0":"glass-mb-1"),children:[e.jsx("span",{className:"glass-text-primary glass-font-medium glass-text-sm",children:s.sender.name}),s.sender.status&&e.jsx("div",{className:l("w-2 h-2 glass-radius-full",s.sender.status==="online"?"bg-green-400":s.sender.status==="away"?"bg-yellow-400":s.sender.status==="busy"?"bg-red-400":"bg-gray-400")}),H&&!n&&e.jsxs("span",{className:"glass-text-primary-glass-opacity-60 glass-text-xs glass-flex glass-items-center glass-gap-1",children:[e.jsx(de,{className:"glass-w-3 glass-h-3"}),Z(s.timestamp)]}),s.edited&&e.jsx("span",{className:"glass-text-primary-glass-opacity-50 glass-text-xs",children:"(edited)"})]}),e.jsx("div",{className:l("glass-text-primary-glass-opacity-90 glass-leading-relaxed",n?"glass-text-xs glass-line-clamp-2":"glass-text-sm"),children:s.content}),s.attachments&&s.attachments.length>0&&!n&&e.jsx("div",{className:"glass-mt-3 glass-auto-gap glass-auto-gap-sm",children:s.attachments.map((t,b)=>e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 glass-p-3 glass-surface-dark/20 glass-radius-lg hover:glass-surface-dark/30 glass-transition-colors glass-cursor-pointer glass-border glass-border-white/10 hover:glass-border-white/20 glass-focus glass-touch-target glass-contrast-guard",onClick:j=>{j.stopPropagation(),Y({url:t.url,name:t.name})},children:[e.jsxs("div",{className:"glass-flex-shrink-0",children:[t.type==="image"&&e.jsx(me,{className:"glass-w-5 glass-h-5 glass-text-primary"}),t.type==="video"&&e.jsx(ge,{className:"glass-w-5 glass-h-5 glass-text-primary"}),t.type==="file"&&e.jsx(ue,{className:"glass-w-5 glass-h-5 glass-text-primary"})]}),e.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[e.jsx("p",{className:"glass-text-primary-glass-opacity-90 glass-text-sm glass-truncate",children:t.name}),t.size&&e.jsxs("p",{className:"glass-text-primary-glass-opacity-60 glass-text-xs",children:[(t.size/1024/1024).toFixed(1)," ","MB"]})]}),e.jsx(c,{variant:"ghost",size:"sm",className:"glass-p-1",children:e.jsx(pe,{className:"glass-w-4 glass-h-4"})})]},b))}),s.reactions&&s.reactions.length>0&&e.jsx("div",{className:"glass-flex glass-gap-1 glass-mt-2",children:s.reactions.map((t,b)=>e.jsxs(c,{variant:"ghost",size:"sm",onClick:j=>{j.stopPropagation(),V(s.id,t.emoji)},className:"glass-h-6 glass-px-2 glass-text-xs glass-surface-subtle/10 glass-focus glass-touch-target",children:[t.emoji," ",t.count]},b))})]}),!n&&e.jsx("div",{className:"glass-absolute glass-right-2 glass-top-2 glass-z-10 glass-opacity-0 glass-group-glass-hover-opacity-100 glass-transition-opacity",children:e.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-1",children:[z&&e.jsx(c,{variant:"ghost",size:"sm",onClick:t=>{t.stopPropagation(),V(s.id,"👍")},className:"glass-p-1 glass-focus glass-touch-target",children:e.jsx(fe,{className:"glass-w-3 glass-h-3"})}),le&&e.jsx(c,{variant:"ghost",size:"sm",onClick:t=>{t.stopPropagation(),X(s.id)},className:"glass-p-1 glass-focus glass-touch-target",children:e.jsx(je,{className:"glass-w-3 glass-h-3"})}),e.jsx(c,{variant:"ghost",size:"sm",onClick:t=>t.stopPropagation(),className:"glass-p-1 glass-focus glass-touch-target",children:e.jsx(he,{className:"glass-w-3 glass-h-3"})})]})}),ne&&u&&e.jsx("div",{className:"glass-flex-shrink-0 glass-ml-2",children:s.type==="system"?e.jsx(xe,{className:"glass-w-4 glass-h-4 glass-text-primary"}):e.jsxs("div",{className:"glass-flex",children:[e.jsx(ye,{className:"glass-w-3 glass-h-3 glass-text-primary-glass-opacity-60"}),e.jsx(we,{className:"glass-w-3 glass-h-3 glass-text-primary glass--ml-1"})]})})]})},s.id)})})]},a)),e.jsx("div",{ref:g})]}),M&&e.jsx("div",{className:l(n?"glass-p-2":"glass-p-4","glass-border-t glass-border-white/10"),children:e.jsx(c,{variant:"ghost",size:"sm",onClick:()=>K(!v),className:"glass-w-full glass-focus glass-touch-target",children:v?"Hide Search":"Search Messages"})})]})})};try{C.displayName="GlassMessageList",C.__docgenInfo={description:`GlassMessageList component
A scrollable list of chat messages with reactions, replies, and attachments`,displayName:"GlassMessageList",props:{messages:{defaultValue:{value:"[]"},description:"Messages to display",name:"messages",required:!1,type:{name:"ChatMessage[] | undefined"}},currentUserId:{defaultValue:null,description:"Current user ID",name:"currentUserId",required:!1,type:{name:"string | undefined"}},enableReactions:{defaultValue:{value:"true"},description:"Enable message reactions",name:"enableReactions",required:!1,type:{name:"boolean | undefined"}},enableReplies:{defaultValue:{value:"true"},description:"Enable message replies",name:"enableReplies",required:!1,type:{name:"boolean | undefined"}},showMessageStatus:{defaultValue:{value:"true"},description:"Show message status",name:"showMessageStatus",required:!1,type:{name:"boolean | undefined"}},showTimestamps:{defaultValue:{value:"true"},description:"Show timestamps",name:"showTimestamps",required:!1,type:{name:"boolean | undefined"}},showAvatars:{defaultValue:{value:"true"},description:"Show user avatars",name:"showAvatars",required:!1,type:{name:"boolean | undefined"}},enableSearch:{defaultValue:{value:"false"},description:"Enable message search",name:"enableSearch",required:!1,type:{name:"boolean | undefined"}},virtualScroll:{defaultValue:{value:"false"},description:"Virtual scrolling",name:"virtualScroll",required:!1,type:{name:"boolean | undefined"}},onMessageClick:{defaultValue:null,description:"Message click handler",name:"onMessageClick",required:!1,type:{name:"((message: ChatMessage) => void) | undefined"}},onMessageReaction:{defaultValue:null,description:"Message reaction handler",name:"onMessageReaction",required:!1,type:{name:"((messageId: string, emoji: string) => void) | undefined"}},onMessageReply:{defaultValue:null,description:"Message reply handler",name:"onMessageReply",required:!1,type:{name:"((messageId: string) => void) | undefined"}},onAttachmentDownload:{defaultValue:null,description:"Attachment download handler",name:"onAttachmentDownload",required:!1,type:{name:"((attachment: { url: string; name: string; }) => void) | undefined"}},className:{defaultValue:null,description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}},compact:{defaultValue:{value:"false"},description:"Compact density for constrained cards, drawers, and documentation previews.",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"Keep the message list inside a bounded local surface.",name:"contained",required:!1,type:{name:"boolean | undefined"}},preview:{defaultValue:{value:"false"},description:"Alias for compact preview rendering.",name:"preview",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"Maximum rendered height when contained or compact.",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},maxWidth:{defaultValue:null,description:"Maximum rendered width when contained or compact.",name:"maxWidth",required:!1,type:{name:"string | number | undefined"}},density:{defaultValue:{value:"comfortable"},description:"Optional density override for embedded surfaces.",name:"density",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"compact"'},{value:'"comfortable"'},{value:'"spacious"'}]}},"data-testid":{defaultValue:null,description:"Custom data-testid for testing",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const Ne=`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
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
  `)}`,ts={title:"Workflows/Glass Message List",component:C,parameters:{layout:"fullscreen",docs:{description:{component:"A glass morphism glassmessagelist component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"},currentUserId:{control:"text",description:"Current user ID"},enableReactions:{control:"boolean",description:"Enable message reactions"},showTimestamps:{control:"boolean",description:"Show message timestamps"},showAvatars:{control:"boolean",description:"Show user avatars"}},args:{className:"",currentUserId:"user1",enableReactions:!0,showTimestamps:!0,showAvatars:!0},decorators:[o=>e.jsx("div",{style:{boxSizing:"border-box",display:"grid",minHeight:"100vh",overflow:"hidden",padding:16,placeItems:"center",width:"min(100%, 440px)"},children:e.jsx(o,{})})]},p={args:{messages:[{id:"1",content:"Hello everyone! Welcome to the chat.",sender:{id:"user1",name:"Alice",avatar:"",status:"online"},timestamp:new Date(Date.now()-3e5),type:"text"},{id:"2",content:"Thanks Alice! Glad to be here.",sender:{id:"user2",name:"Bob",avatar:"",status:"online"},timestamp:new Date(Date.now()-24e4),type:"text"},{id:"3",content:"How is everyone doing today?",sender:{id:"user3",name:"Charlie",avatar:"",status:"away"},timestamp:new Date(Date.now()-18e4),type:"text"}],onMessageClick:N(),onMessageReaction:N()}},f={args:{messages:[{id:"1",content:"Check out this image I found!",sender:{id:"user1",name:"Alice",avatar:"",status:"online"},timestamp:new Date(Date.now()-12e4),type:"text",attachments:[{type:"image",url:Ne,name:"sample-image.jpg",size:245760}]},{id:"2",content:"Here's the document you requested.",sender:{id:"user2",name:"Bob",avatar:"",status:"online"},timestamp:new Date(Date.now()-6e4),type:"text",attachments:[{type:"file",url:"#",name:"important-document.pdf",size:1048576}]}],onAttachmentDownload:N()}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}};const ns=["Default","WithAttachments"];export{p as Default,f as WithAttachments,ns as __namedExportsOrder,ts as default};
