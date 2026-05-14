import{b as ne,r,j as e,c as n}from"./iframe-D2N3vCdj.js";import{k as re,aJ as ie,aI as oe,aS as ce,a6 as de,H as me,bb as ge,a0 as ue,a1 as pe,b as fe,bc as he}from"./components-C1jHIR2f.js";import{b as xe}from"./index-Cl3akDGX.js";import{M as ye}from"./MotionFramer-BTHpoTOv.js";import{G as we}from"./GlassCard-CTwub12s.js";import{G as c}from"./GlassButton-DADGQ5u1.js";import{f as N}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./utilsCore-ChCm-RwF.js";import"./LiquidGlassMaterial-Y3bF4vfX.js";import"./LiquidGlassLayerProvider-DuyeeDou.js";import"./OptimizedGlassCore-Cfx2wP22.js";import"./deviceCapabilities-BiFtu_BJ.js";import"./a11y-NWIw7uLP.js";import"./GlassPredictiveEngine-DsRdSIEV.js";import"./GlassAchievementSystem-CRVBaZaX.js";import"./GlassBiometricAdaptation-G6oWNKvq.js";import"./MotionPreferenceContext-CrXN3CiK.js";import"./GlassEyeTracking-BLN3AOs1.js";import"./GlassSpatialAudio-P8l215F-.js";import"./index-ByImX2pa.js";const C=({messages:o=[],currentUserId:I,enableReactions:R=!0,enableReplies:z=!0,showMessageStatus:G=!0,showTimestamps:H=!0,showAvatars:T=!0,enableSearch:M=!1,virtualScroll:be=!1,onMessageClick:S,onMessageReaction:D,onMessageReply:k,onAttachmentDownload:A,className:L,compact:E=!1,contained:_=!1,preview:U=!1,maxHeight:h,maxWidth:x,density:B="comfortable","data-testid":W,...$})=>{const F=ne(),[y,P]=r.useState(null),[m,O]=r.useState(""),[w,Q]=r.useState(!1),g=r.useRef(null);r.useEffect(()=>{g.current&&typeof g.current.scrollIntoView=="function"&&g.current.scrollIntoView({behavior:"smooth"})},[o]);const J=r.useCallback(a=>{P(y===a.id?null:a.id),S?.(a)},[y,S]),V=r.useCallback((a,i)=>{D?.(a,i)},[D]),K=r.useCallback(a=>{k?.(a)},[k]),X=r.useCallback(a=>{A?.(a)},[A]),Y=r.useCallback(a=>{const s=new Date().getTime()-a.getTime(),d=Math.floor(s/6e4),u=Math.floor(s/36e5);return d<1?"now":d<60?`${d}m`:u<24?`${u}h`:a.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},[]),Z=(m?o.filter(a=>a.content.toLowerCase().includes(m.toLowerCase())||a.sender.name.toLowerCase().includes(m.toLowerCase())):o).reduce((a,i)=>{const s=i.timestamp.toDateString();return a[s]||(a[s]=[]),a[s].push(i),a},{}),l=E||U||B==="compact",v=_||l,ee=typeof h=="number"?`${h}px`:h,se=typeof x=="number"?`${x}px`:x,ae=l?!1:T,te=l?!1:G,le=l?!1:z;return e.jsx(ye,{"data-glass-component":!0,preset:"fadeIn",className:"glass-w-full glass-h-full",children:e.jsxs(we,{className:n("flex flex-col h-full overflow-hidden",v&&"glass-w-full",l&&"glass-text-sm",L),style:{maxHeight:ee??(v?"220px":void 0),maxWidth:se??(v?"320px":void 0)},"data-testid":W,role:"log","aria-label":"Message list",...$,children:[M&&w&&e.jsx("div",{className:n(l?"glass-p-2":"glass-p-4","glass-border-b glass-border-white/10"),children:e.jsx("input",{type:"text",placeholder:"Search messages...",value:m,onChange:a=>O(a.target.value),className:"glass-w-full glass-bg-fill glass-ring-1 glass-ring-white-opacity-10 glass-radius-lg glass-px-4 glass-py-2 glass-text-primary glass-placeholder-white-opacity-50 glass-focus-outline-none glass-focus-ring-white-opacity-30 glass-focus glass-touch-target glass-contrast-guard"})}),e.jsxs(xe,{className:n("glass-flex-1 glass-overflow-y-auto",l?"glass-p-2":"glass-p-4"),spacing:l?"sm":"lg",children:[Object.entries(Z).map(([a,i])=>e.jsxs("div",{children:[e.jsx("div",{className:n("glass-flex glass-items-center glass-justify-center",l?"glass-my-2":"glass-my-6"),children:e.jsx("div",{className:"glass-px-3 glass-py-1 glass-surface-subtle/10 glass-radius-full",children:e.jsx("span",{className:"glass-text-primary-glass-opacity-60 glass-text-xs",children:new Date(a).toLocaleDateString()})})}),e.jsx("div",{className:n("glass-auto-gap",l?"glass-auto-gap-sm":"glass-auto-gap-md"),children:i.map((s,d)=>{const u=s.sender.id===I,q=y===s.id;return e.jsx("div",{className:n("group relative cursor-pointer glass-focus glass-touch-target",!F&&"transition-all duration-200 animate-slide-in-up",q&&"ring-2 ring-primary glass-radius-lg"),style:{animationDelay:`${Math.min(d,20)*20}ms`,animationFillMode:"both"},onClick:()=>J(s),children:e.jsxs("div",{className:n("flex glass-radius-lg transition-all duration-200",l?"glass-gap-2 glass-p-2":"glass-gap-3 glass-p-3",q?"bg-primary/20":"hover:bg-white/5"),children:[ae&&e.jsx("div",{className:"glass-flex-shrink-0",children:e.jsx("div",{className:"glass-w-10 glass-h-10 glass-radius-full glass-surface-subtle/20 glass-flex glass-items-center glass-justify-center",children:s.sender.avatar?e.jsx("img",{src:s.sender.avatar,alt:s.sender.name,className:"glass-w-full glass-h-full glass-radius-full glass-object-cover"}):e.jsx("span",{className:"glass-text-primary-glass-opacity-80 glass-text-sm glass-font-medium",children:s.sender.name.charAt(0).toUpperCase()})})}),e.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[e.jsxs("div",{className:n("glass-flex glass-items-center glass-gap-2",l?"glass-mb-0":"glass-mb-1"),children:[e.jsx("span",{className:"glass-text-primary glass-font-medium glass-text-sm",children:s.sender.name}),s.sender.status&&e.jsx("div",{className:n("w-2 h-2 glass-radius-full",s.sender.status==="online"?"bg-green-400":s.sender.status==="away"?"bg-yellow-400":s.sender.status==="busy"?"bg-red-400":"bg-gray-400")}),H&&!l&&e.jsxs("span",{className:"glass-text-primary-glass-opacity-60 glass-text-xs glass-flex glass-items-center glass-gap-1",children:[e.jsx(re,{className:"glass-w-3 glass-h-3"}),Y(s.timestamp)]}),s.edited&&e.jsx("span",{className:"glass-text-primary-glass-opacity-50 glass-text-xs",children:"(edited)"})]}),e.jsx("div",{className:n("glass-text-primary-glass-opacity-90 glass-leading-relaxed",l?"glass-text-xs glass-line-clamp-2":"glass-text-sm"),children:s.content}),s.attachments&&s.attachments.length>0&&!l&&e.jsx("div",{className:"glass-mt-3 glass-auto-gap glass-auto-gap-sm",children:s.attachments.map((t,b)=>e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 glass-p-3 glass-surface-dark/20 glass-radius-lg hover:glass-surface-dark/30 glass-transition-colors glass-cursor-pointer glass-border glass-border-white/10 hover:glass-border-white/20 glass-focus glass-touch-target glass-contrast-guard",onClick:j=>{j.stopPropagation(),X({url:t.url,name:t.name})},children:[e.jsxs("div",{className:"glass-flex-shrink-0",children:[t.type==="image"&&e.jsx(ie,{className:"glass-w-5 glass-h-5 glass-text-primary"}),t.type==="video"&&e.jsx(oe,{className:"glass-w-5 glass-h-5 glass-text-primary"}),t.type==="file"&&e.jsx(ce,{className:"glass-w-5 glass-h-5 glass-text-primary"})]}),e.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[e.jsx("p",{className:"glass-text-primary-glass-opacity-90 glass-text-sm glass-truncate",children:t.name}),t.size&&e.jsxs("p",{className:"glass-text-primary-glass-opacity-60 glass-text-xs",children:[(t.size/1024/1024).toFixed(1)," ","MB"]})]}),e.jsx(c,{variant:"ghost",size:"sm",className:"glass-p-1",children:e.jsx(de,{className:"glass-w-4 glass-h-4"})})]},b))}),s.reactions&&s.reactions.length>0&&e.jsx("div",{className:"glass-flex glass-gap-1 glass-mt-2",children:s.reactions.map((t,b)=>e.jsxs(c,{variant:"ghost",size:"sm",onClick:j=>{j.stopPropagation(),V(s.id,t.emoji)},className:"glass-h-6 glass-px-2 glass-text-xs glass-surface-subtle/10 glass-focus glass-touch-target",children:[t.emoji," ",t.count]},b))})]}),!l&&e.jsx("div",{className:"glass-absolute glass-right-2 glass-top-2 glass-z-10 glass-opacity-0 glass-group-glass-hover-opacity-100 glass-transition-opacity",children:e.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-1",children:[R&&e.jsx(c,{variant:"ghost",size:"sm",onClick:t=>{t.stopPropagation(),V(s.id,"👍")},className:"glass-p-1 glass-focus glass-touch-target",children:e.jsx(me,{className:"glass-w-3 glass-h-3"})}),le&&e.jsx(c,{variant:"ghost",size:"sm",onClick:t=>{t.stopPropagation(),K(s.id)},className:"glass-p-1 glass-focus glass-touch-target",children:e.jsx(ge,{className:"glass-w-3 glass-h-3"})}),e.jsx(c,{variant:"ghost",size:"sm",onClick:t=>t.stopPropagation(),className:"glass-p-1 glass-focus glass-touch-target",children:e.jsx(ue,{className:"glass-w-3 glass-h-3"})})]})}),te&&u&&e.jsx("div",{className:"glass-flex-shrink-0 glass-ml-2",children:s.type==="system"?e.jsx(pe,{className:"glass-w-4 glass-h-4 glass-text-primary"}):e.jsxs("div",{className:"glass-flex",children:[e.jsx(fe,{className:"glass-w-3 glass-h-3 glass-text-primary-glass-opacity-60"}),e.jsx(he,{className:"glass-w-3 glass-h-3 glass-text-primary glass--ml-1"})]})})]})},s.id)})})]},a)),e.jsx("div",{ref:g})]}),M&&e.jsx("div",{className:n(l?"glass-p-2":"glass-p-4","glass-border-t glass-border-white/10"),children:e.jsx(c,{variant:"ghost",size:"sm",onClick:()=>Q(!w),className:"glass-w-full glass-focus glass-touch-target",children:w?"Hide Search":"Search Messages"})})]})})};try{C.displayName="GlassMessageList",C.__docgenInfo={description:`GlassMessageList component
A scrollable list of chat messages with reactions, replies, and attachments`,displayName:"GlassMessageList",props:{messages:{defaultValue:{value:"[]"},description:"Messages to display",name:"messages",required:!1,type:{name:"ChatMessage[] | undefined"}},currentUserId:{defaultValue:null,description:"Current user ID",name:"currentUserId",required:!1,type:{name:"string | undefined"}},enableReactions:{defaultValue:{value:"true"},description:"Enable message reactions",name:"enableReactions",required:!1,type:{name:"boolean | undefined"}},enableReplies:{defaultValue:{value:"true"},description:"Enable message replies",name:"enableReplies",required:!1,type:{name:"boolean | undefined"}},showMessageStatus:{defaultValue:{value:"true"},description:"Show message status",name:"showMessageStatus",required:!1,type:{name:"boolean | undefined"}},showTimestamps:{defaultValue:{value:"true"},description:"Show timestamps",name:"showTimestamps",required:!1,type:{name:"boolean | undefined"}},showAvatars:{defaultValue:{value:"true"},description:"Show user avatars",name:"showAvatars",required:!1,type:{name:"boolean | undefined"}},enableSearch:{defaultValue:{value:"false"},description:"Enable message search",name:"enableSearch",required:!1,type:{name:"boolean | undefined"}},virtualScroll:{defaultValue:{value:"false"},description:"Virtual scrolling",name:"virtualScroll",required:!1,type:{name:"boolean | undefined"}},onMessageClick:{defaultValue:null,description:"Message click handler",name:"onMessageClick",required:!1,type:{name:"((message: ChatMessage) => void) | undefined"}},onMessageReaction:{defaultValue:null,description:"Message reaction handler",name:"onMessageReaction",required:!1,type:{name:"((messageId: string, emoji: string) => void) | undefined"}},onMessageReply:{defaultValue:null,description:"Message reply handler",name:"onMessageReply",required:!1,type:{name:"((messageId: string) => void) | undefined"}},onAttachmentDownload:{defaultValue:null,description:"Attachment download handler",name:"onAttachmentDownload",required:!1,type:{name:"((attachment: { url: string; name: string; }) => void) | undefined"}},className:{defaultValue:null,description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}},compact:{defaultValue:{value:"false"},description:"Compact density for constrained cards, drawers, and documentation previews.",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"Keep the message list inside a bounded local surface.",name:"contained",required:!1,type:{name:"boolean | undefined"}},preview:{defaultValue:{value:"false"},description:"Alias for compact preview rendering.",name:"preview",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"Maximum rendered height when contained or compact.",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},maxWidth:{defaultValue:null,description:"Maximum rendered width when contained or compact.",name:"maxWidth",required:!1,type:{name:"string | number | undefined"}},density:{defaultValue:{value:"comfortable"},description:"Optional density override for embedded surfaces.",name:"density",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"compact"'},{value:'"comfortable"'},{value:'"spacious"'}]}},"data-testid":{defaultValue:null,description:"Custom data-testid for testing",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const ve=`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
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
  `)}`,$e={title:"Workflows/Glass Message List",component:C,parameters:{layout:"fullscreen",docs:{description:{component:"A glass morphism glassmessagelist component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"},currentUserId:{control:"text",description:"Current user ID"},enableReactions:{control:"boolean",description:"Enable message reactions"},showTimestamps:{control:"boolean",description:"Show message timestamps"},showAvatars:{control:"boolean",description:"Show user avatars"}},args:{className:"",currentUserId:"user1",enableReactions:!0,showTimestamps:!0,showAvatars:!0},decorators:[o=>e.jsx("div",{style:{boxSizing:"border-box",display:"grid",minHeight:"100vh",overflow:"hidden",padding:16,placeItems:"center",width:"min(100%, 440px)"},children:e.jsx(o,{})})]},p={args:{messages:[{id:"1",content:"Hello everyone! Welcome to the chat.",sender:{id:"user1",name:"Alice",avatar:"",status:"online"},timestamp:new Date(Date.now()-3e5),type:"text"},{id:"2",content:"Thanks Alice! Glad to be here.",sender:{id:"user2",name:"Bob",avatar:"",status:"online"},timestamp:new Date(Date.now()-24e4),type:"text"},{id:"3",content:"How is everyone doing today?",sender:{id:"user3",name:"Charlie",avatar:"",status:"away"},timestamp:new Date(Date.now()-18e4),type:"text"}],onMessageClick:N(),onMessageReaction:N()}},f={args:{messages:[{id:"1",content:"Check out this image I found!",sender:{id:"user1",name:"Alice",avatar:"",status:"online"},timestamp:new Date(Date.now()-12e4),type:"text",attachments:[{type:"image",url:ve,name:"sample-image.jpg",size:245760}]},{id:"2",content:"Here's the document you requested.",sender:{id:"user2",name:"Bob",avatar:"",status:"online"},timestamp:new Date(Date.now()-6e4),type:"text",attachments:[{type:"file",url:"#",name:"important-document.pdf",size:1048576}]}],onAttachmentDownload:N()}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}};const Fe=["Default","WithAttachments"];export{p as Default,f as WithAttachments,Fe as __namedExportsOrder,$e as default};
