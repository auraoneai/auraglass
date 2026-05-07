import{r as c,R as Ms,j as s,c as w,g as k}from"./iframe-BJUPYBdj.js";import{u as Vs}from"./GlassMediaProvider-DXR-aviI.js";import{G as is}from"./GlassCore-Dr0igKnK.js";const C=e=>{if(isNaN(e))return"0:00";const d=Math.floor(e/3600),t=Math.floor(e%3600/60),r=Math.floor(e%60);return d>0?`${d}:${t.toString().padStart(2,"0")}:${r.toString().padStart(2,"0")}`:`${t}:${r.toString().padStart(2,"0")}`},Ps=e=>e.subtitles?.flatMap(d=>d.content?.map(t=>({...t,keywords:[],sentiment:"neutral"}))??[])??[],os=(e,d)=>!Number.isFinite(e)||!Number.isFinite(d)||d<=0?0:Math.max(0,Math.min(100,e/d*100)),Es=e=>!!e?.startsWith("data:video/"),As="data:image/svg+xml,"+encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#020617"/>
          <stop offset="0.55" stop-color="#1d4ed8"/>
          <stop offset="1" stop-color="#0f766e"/>
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#bg)"/>
      <circle cx="1018" cy="166" r="126" fill="rgba(255,255,255,0.14)"/>
      <rect x="96" y="104" width="620" height="122" rx="28" fill="rgba(255,255,255,0.16)"/>
      <path d="M604 360 468 280v160z" fill="#ffffff"/>
      <rect x="96" y="528" width="1088" height="16" rx="8" fill="rgba(255,255,255,0.24)"/>
      <rect x="96" y="528" width="462" height="16" rx="8" fill="#ffffff"/>
      <text x="132" y="178" font-family="Inter, Arial, sans-serif" font-size="52" font-weight="700" fill="#ffffff">AuraGlass Video</text>
      <text x="132" y="604" font-family="Inter, Arial, sans-serif" font-size="30" fill="#dbeafe">Stable visual media preview</text>
    </svg>
  `),L={...k({intent:"neutral",elevation:"level4",interactive:!0}),appearance:"none",WebkitAppearance:"none",border:"1px solid rgba(148, 163, 184, 0.42)",color:"#f8fafc",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 28px rgba(2,6,23,0.28)"},Rs={...k({intent:"primary",elevation:"level4",interactive:!0}),appearance:"none",WebkitAppearance:"none",color:"#f8fafc",borderColor:"rgba(191, 219, 254, 0.72)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 28px rgba(2,6,23,0.28)"},Y={...k({intent:"neutral",elevation:"level4"}),color:"#f8fafc",border:"1px solid rgba(148, 163, 184, 0.34)",boxShadow:"0 18px 38px rgba(2, 6, 23, 0.42)"},Is={appearance:"none",WebkitAppearance:"none",color:"#38bdf8",accentColor:"#38bdf8"},Ls=`
  .ag-advanced-video-player,
  .ag-advanced-video-player * {
    box-sizing: border-box;
  }

  .ag-advanced-video-player .ag-video-layout {
    display: flex;
    height: 100%;
    min-height: 0;
  }

  .ag-advanced-video-player .ag-video-surface {
    flex: 1 1 52rem;
    min-width: 32rem;
  }

  .ag-advanced-video-player .ag-video-side-panels {
    display: flex;
    flex: 0 1 42rem;
    min-width: 22rem;
    max-width: min(46rem, 48%);
    height: 100%;
    overflow: hidden;
    border-left: 1px solid rgba(226, 232, 240, 0.18);
    background: rgba(2, 6, 23, 0.22);
  }

  .ag-advanced-video-player .ag-video-side-panel {
    flex: 1 1 20rem;
    min-width: 18rem;
    height: 100%;
    overflow: hidden;
  }

  .ag-advanced-video-player .ag-video-side-panel + .ag-video-side-panel {
    border-left: 1px solid rgba(226, 232, 240, 0.16);
  }

  .ag-advanced-video-player .ag-video-panel-content {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.78));
    border-radius: 0;
    color: #f8fafc;
  }

  .ag-advanced-video-player .ag-video-panel-scroll {
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding-right: 2px;
  }

  .ag-advanced-video-player .ag-video-controls {
    border-top: 1px solid rgba(226, 232, 240, 0.24);
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.42), rgba(2, 6, 23, 0.92)),
      rgba(2, 6, 23, 0.84);
    backdrop-filter: blur(26px) saturate(1.45);
    -webkit-backdrop-filter: blur(26px) saturate(1.45);
  }

  .ag-advanced-video-player .ag-video-control-row,
  .ag-advanced-video-player .ag-video-control-group {
    min-width: 0;
  }

  @media (max-width: 980px) {
    .ag-advanced-video-player {
      min-height: 0 !important;
    }

    .ag-advanced-video-player .ag-video-layout {
      flex-direction: column;
      height: auto;
    }

    .ag-advanced-video-player .ag-video-surface {
      flex: 0 0 auto;
      min-width: 0;
      width: 100%;
      aspect-ratio: 16 / 9;
      min-height: 260px;
    }

    .ag-advanced-video-player .ag-video-side-panels {
      flex: 0 0 auto;
      width: 100%;
      max-width: none;
      min-width: 0;
      height: auto;
      max-height: none;
      border-left: 0;
      border-top: 1px solid rgba(226, 232, 240, 0.18);
    }

    .ag-advanced-video-player .ag-video-side-panel {
      min-width: min(100%, 19rem);
      min-height: 260px;
      max-height: 340px;
    }
  }

  @media (max-width: 640px) {
    .ag-advanced-video-player .ag-video-controls {
      position: relative !important;
      padding: 12px !important;
    }

    .ag-advanced-video-player .ag-video-surface {
      aspect-ratio: auto;
      min-height: 0;
    }

    .ag-advanced-video-player .ag-video-surface > img,
    .ag-advanced-video-player .ag-video-surface > video {
      position: relative !important;
      aspect-ratio: 16 / 9;
      min-height: 220px;
    }

    .ag-advanced-video-player .ag-video-side-panels {
      flex-direction: column;
    }

    .ag-advanced-video-player .ag-video-side-panel {
      width: 100%;
      min-width: 0;
      max-height: 300px;
    }
  }
`,qs=({isPlaying:e,currentTime:d,duration:t,volume:r,playbackRate:g,isFullscreen:h,isMuted:x,quality:m,buffered:a,onPlayPause:u,onSeek:f,onVolumeChange:p,onPlaybackRateChange:j,onQualityChange:q,onFullscreenToggle:_,onMuteToggle:l})=>{const[b,S]=c.useState(!1),[T,M]=c.useState(!1),[V,P]=c.useState(!1),[$,N]=c.useState(!1),G=i=>{const v=i.currentTarget.getBoundingClientRect(),n=(i.clientX-v.left)/v.width*t;f(n)},y=i=>{if($){const v=i.currentTarget.getBoundingClientRect(),B=(i.clientX-v.left)/v.width,n=Math.max(0,Math.min(t,B*t));f(n)}},E=[.25,.5,.75,1,1.25,1.5,1.75,2],Q=["auto","144p","240p","360p","480p","720p","1080p"],U=os(d,t),A=os(a,t);return s.jsxs("div",{"data-glass-component":!0,className:"glass-absolute glass-bottom-0 glass-left-0 glass-right-0 glass-p-4 ag-video-controls",style:{...k({intent:"neutral",elevation:"level4"}),position:"absolute",top:"auto",right:0,bottom:0,left:0,zIndex:20,color:"#f8fafc"},children:[s.jsxs("div",{className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-full glass-cursor-pointer glass-mb-4 glass-relative",onClick:G,onMouseMove:y,onMouseDown:()=>N(!0),onMouseUp:()=>N(!1),onMouseLeave:()=>N(!1),children:[s.jsx("div",{className:"glass-absolute glass-top-0 glass-left-0 glass-h-full glass-surface-subtle glass-radius-full",style:{width:`${A}%`}}),s.jsx("div",{className:"glass-absolute glass-top-0 glass-left-0 glass-h-full glass-surface-blue glass-radius-full",style:{width:`${U}%`}}),s.jsx("div",{className:"glass-absolute glass-top-1/2 glass-transform glass--translate-y-1-2 glass-w-4 glass-h-4 glass-surface-blue glass-radius-full glass-border-2 glass-border-white glass-shadow-md",style:{left:`calc(${U}% - 8px)`}})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-text-primary ag-video-control-row",style:{gap:14,flexWrap:"wrap"},children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 ag-video-control-group",style:{flexWrap:"wrap"},children:[s.jsx("button",{onClick:u,className:"glass-w-12 glass-h-12 glass-flex glass-items-center glass-justify-center glass-surface-subtle/20 hover:glass-surface-subtle/30 glass-radius-full glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",style:Rs,"aria-label":e?"Pause video":"Play video",children:e?s.jsxs("div",{className:"glass-flex glass-gap-1",children:[s.jsx("div",{className:"glass-w-1 glass-h-4 glass-surface-subtle glass-radius-full"}),s.jsx("div",{className:"glass-w-1 glass-h-4 glass-surface-subtle glass-radius-full"})]}):s.jsx("div",{className:"glass-w-0 glass-h-0 glass-border-l-4 glass-border-l-white glass-border-y-4 glass-border-y-transparent glass-ml-1"})}),s.jsxs("div",{className:"glass-relative",onMouseEnter:()=>S(!0),onMouseLeave:()=>S(!1),children:[s.jsx("button",{onClick:l,className:"glass-w-10 glass-h-10 glass-flex glass-items-center glass-justify-center hover:glass-surface-subtle/20 glass-radius-full glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",style:L,"aria-label":x||r===0?"Unmute video":"Mute video",children:x||r===0?"🔇":r<.5?"🔉":"🔊"}),b&&s.jsx("div",{className:"glass-absolute glass-bottom-12 glass--left-1-2 glass-transform glass--translate-x-1-2 glass-radius-lg glass-p-2",style:Y,children:s.jsx("input",{type:"range",min:"0",max:"1",step:"0.01",value:x?0:r,onChange:i=>p(Number(i.target.value)),className:"glass-w-16 glass-h-1 glass-surface-subtle/20 glass-radius-full glass-appearance-none glass-slider-thumb-white glass-focus glass-touch-target glass-contrast-guard",style:Is})})]}),s.jsxs("div",{className:"glass-text-sm glass-font-mono",style:{...k({intent:"neutral",elevation:"level3"}),color:"#f8fafc",border:"1px solid rgba(148, 163, 184, 0.3)",borderRadius:999,padding:"8px 12px",whiteSpace:"nowrap"},children:[C(d)," / ",C(t)]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 ag-video-control-group",style:{flexWrap:"wrap"},children:[s.jsxs("div",{className:"glass-relative",children:[s.jsxs("button",{onClick:()=>M(!T),className:"glass-px-3 glass-py-2 glass-text-sm hover:glass-surface-subtle/20 glass-radius-md glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",style:L,"aria-label":`Playback speed: ${g}x`,children:[g,"x"]}),T&&s.jsx("div",{className:"glass-absolute glass-bottom-12 glass-right-0 glass-radius-lg glass-p-2 glass-min-glass-w-20",style:Y,children:E.map(i=>s.jsxs("button",{onClick:()=>{j(i),M(!1)},className:w("block w-full text-left px-3 py-2 text-sm rounded hover:bg-white/20 transition-colors glass-focus glass-touch-target glass-contrast-guard",i===g&&"bg-blue-500"),style:{color:"#f8fafc",background:i===g?"rgba(37, 99, 235, 0.96)":"transparent"},children:[i,"x"]},i))})]}),s.jsxs("div",{className:"glass-relative",children:[s.jsx("button",{onClick:()=>P(!V),className:"glass-px-3 glass-py-2 glass-text-sm hover:glass-surface-subtle/20 glass-radius-md glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",style:L,"aria-label":`Video quality: ${m}`,children:m}),V&&s.jsx("div",{className:"glass-absolute glass-bottom-12 glass-right-0 glass-radius-lg glass-p-2 glass-min-glass-w-20",style:Y,children:Q.map(i=>s.jsx("button",{onClick:()=>{q(i),P(!1)},className:w("block w-full text-left px-3 py-2 text-sm rounded hover:bg-white/20 transition-colors glass-focus glass-touch-target glass-contrast-guard",i===m&&"bg-blue-500"),style:{color:"#f8fafc",background:i===m?"rgba(37, 99, 235, 0.96)":"transparent"},children:i},i))})]}),s.jsx("button",{onClick:_,className:"glass-w-10 glass-h-10 glass-flex glass-items-center glass-justify-center hover:glass-surface-subtle/20 glass-radius-full glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",style:L,"aria-label":h?"Exit fullscreen":"Enter fullscreen",children:h?"⊟":"⊞"})]})]})]})},_s=({chapters:e,currentTime:d,onChapterClick:t})=>s.jsxs("div",{className:"ag-video-panel-content glass-surface-subtle glass-text-primary glass-p-4",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-4",children:"Chapters"}),s.jsx("div",{className:"ag-video-panel-scroll glass-space-y-2",children:e.map(r=>{const g=d>=r.startTime&&d<=r.endTime;return s.jsxs("button",{onClick:()=>t(r),className:w("glass-flex glass-items-center glass-gap-3 glass-w-full glass-p-3 glass-radius-lg glass-text-left glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",g?"glass-surface-blue":"glass-surface-dark"),style:{background:g?"rgba(37, 99, 235, 0.84)":"rgba(15, 23, 42, 0.66)",border:"1px solid rgba(226, 232, 240, 0.18)",color:"#f8fafc",minHeight:84},children:[r.thumbnail&&s.jsx("img",{src:r.thumbnail,alt:r.title,className:"glass-w-16 glass-h-9 glass-object-cover glass-radius"}),s.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[s.jsx("div",{className:"glass-font-medium",children:r.title}),s.jsxs("div",{className:"glass-text-sm glass-text-primary",children:[C(r.startTime)," -"," ",C(r.endTime)]}),r.description&&s.jsx("div",{className:"glass-text-xs glass-text-primary glass-mt-1",children:r.description})]})]},r.id)})})]}),$s=({transcript:e,currentTime:d,searchQuery:t,onSearchChange:r,onTranscriptClick:g})=>{const[h,x]=c.useState([]);c.useEffect(()=>{if(t){const a=e.filter(u=>u.text.toLowerCase().includes(t.toLowerCase()));x(a)}else x([])},[t,e]);const m=(a,u)=>{if(!u)return a;const f=new RegExp(`(${u})`,"gi");return a.split(f).map((p,j)=>p.toLowerCase()===u.toLowerCase()?s.jsx("mark",{className:"glass-surface-subtle glass-text-inverse glass-radius glass-px-1",children:p},j):p)};return s.jsxs("div",{className:"ag-video-panel-content glass-surface-subtle glass-text-primary glass-p-4 glass-h-full glass-flex glass-flex-col",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold",children:"Transcript"}),s.jsxs("div",{className:"glass-text-sm glass-text-primary",children:[e.length," entries"]})]}),s.jsxs("div",{className:"glass-mb-4",children:[s.jsx("input",{type:"text",placeholder:"Search transcript...",value:t,onChange:a=>r(a.target.value),className:"glass-w-full glass-px-3 glass-py-2 glass-surface-dark glass-text-primary glass-border glass-border-gray-700 glass-radius-lg glass-placeholder-gray-400 glass-focus-outline-none glass-focus-ring-2 glass-focus-ring-blue-500 glass-focus glass-touch-target glass-contrast-guard"}),t&&s.jsxs("div",{className:"glass-text-sm glass-text-primary glass-mt-2",children:[h.length," results found"]})]}),s.jsx("div",{className:"ag-video-panel-scroll glass-flex-1 glass-space-y-3",children:(t?h:e).map(a=>{const u=d>=a.startTime&&d<=a.endTime,f=a.confidence||0;return s.jsxs("button",{onClick:()=>g(a),className:w("glass-flex glass-flex-col glass-items-start glass-gap-2 glass-w-full glass-p-3 glass-radius-lg glass-text-left glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",u?"glass-surface-blue":"glass-surface-dark"),style:{background:u?"rgba(37, 99, 235, 0.84)":"rgba(15, 23, 42, 0.66)",border:"1px solid rgba(226, 232, 240, 0.18)",color:"#f8fafc"},children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-w-full",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-text-xs glass-text-primary glass-font-mono",children:C(a.startTime)}),a.speaker&&s.jsx("span",{className:"glass-text-xs glass-surface-subtle glass-text-primary glass-px-2 glass-py-1 glass-radius",children:a.speaker})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[f>0&&s.jsxs("div",{className:w("text-xs px-2 py-1 rounded",f>.9?"bg-green-600":f>.7?"bg-yellow-600":"bg-red-600"),children:[Math.round(f*100),"%"]}),a.sentiment&&s.jsx("div",{className:"glass-text-xs",children:a.sentiment==="positive"?"😊":a.sentiment==="negative"?"😔":"😐"})]})]}),s.jsx("div",{className:"glass-text-sm glass-leading-relaxed",children:t?m(a.text,t):a.text}),a.keywords&&a.keywords.length>0&&s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-1 glass-mt-2",children:a.keywords.map(p=>s.jsx("span",{className:"glass-text-xs glass-surface-subtle glass-text-primary glass-px-2 glass-py-1 glass-radius",children:p},p))})]},a.id)})})]})},Z=({mediaFile:e,className:d,"data-testid":t,showControls:r=!0,showTranscript:g=!1,showChapters:h=!1,showAnalytics:x=!1,autoplay:m=!1,muted:a=!1,loop:u=!1,preload:f="metadata",poster:p,onTimeUpdate:j,onEnded:q,onError:_})=>{const{playbackState:l,setPlaybackState:b,play:S,pause:T,seekTo:M,setVolume:V,setPlaybackRate:P,toggleMute:$,toggleFullscreen:N,setQuality:G,transcripts:y,generateTranscript:E,searchTranscript:Q,getTranscriptAtTime:U,setActiveChapter:A,getChapterAtTime:i,trackView:v,trackEngagement:B}=Vs(),n=c.useRef(null),H=c.useRef(null),[ds,W]=c.useState(r),[z,gs]=c.useState(null),[cs,us]=c.useState(""),[fs,O]=c.useState(!1),D=Ms.useMemo(()=>Ps(e),[e]),F=y[e.id]??D,R=l?.mediaId===e.id&&l.isPlaying,X=l?.mediaId===e.id?l.currentTime:0,ss=l?.mediaId===e.id?l.duration:e.duration||0,ps=l?.volume||1,ms=l?.playbackRate||1,es=l?.isFullscreen||!1,as=l?.isMuted||!1,hs=l?.quality||"auto",ls=p||e.poster||e.thumbnail||As,I=!e.src||Es(e.src);c.useEffect(()=>{if(g){if(D.length>0){O(!0);return}!y[e.id]&&g?E(e.id).then(()=>{O(!0)}):y[e.id]&&O(!0)}},[e.id,g,E,y,D.length]);const xs=c.useCallback(()=>{W(!0),z&&clearTimeout(z);const o=setTimeout(()=>{R&&W(!1)},3e3);gs(o)},[R,z]),vs=()=>{if(n.current){const o=n.current.currentTime;l&&l.mediaId===e.id&&b({...l,currentTime:o}),j?.(o);const ns=i(e.id,o);ns&&A(e.id,ns.id)}},bs=()=>{if(n.current){const o=n.current.duration;l&&l.mediaId===e.id&&b({...l,duration:o,isLoading:!1})}},ys=()=>{l&&l.mediaId===e.id&&b({...l,isPlaying:!1,currentTime:0}),v(e.id,ss),q?.()},ws=()=>{l&&l.mediaId===e.id&&b({...l,isError:!0,isLoading:!1}),_?.("Video playback error occurred")},J=()=>{R?(T(),n.current&&n.current.pause()):(S(e.id),n.current&&!I&&n.current.play())},K=o=>{M(o),n.current&&(n.current.currentTime=o)},js=o=>{V(o),n.current&&(n.current.volume=o)},Ns=o=>{P(o),n.current&&(n.current.playbackRate=o)},ks=()=>{$(),n.current&&(n.current.muted=!as)},Cs=()=>{N(),es?document.exitFullscreen&&document.exitFullscreen():H.current?.requestFullscreen&&H.current.requestFullscreen()},Ss=o=>{K(o.startTime),A(e.id,o.id)},Ts=o=>{K(o.startTime)},ts=h&&!!(e.chapters&&e.chapters.length>0),rs=g&&fs&&F.length>0;return s.jsxs("div",{className:w("ag-advanced-video-player glass-relative glass-radius-lg glass-overflow-hidden",d),"data-testid":t||"glassadvancedvideoplayer",style:{background:"#020617",color:"#f8fafc",minHeight:320},children:[s.jsx("style",{children:Ls}),s.jsxs("div",{ref:H,className:"ag-video-layout glass-relative glass-w-full glass-h-full",style:{minHeight:0},onMouseMove:xs,onMouseLeave:()=>W(!1),children:[s.jsxs("div",{className:"ag-video-surface glass-flex-1 glass-relative",style:{minHeight:0,overflow:"hidden"},children:[I&&s.jsx("img",{src:ls,alt:e.title||"Video preview",className:"glass-absolute glass-inset-0 glass-w-full glass-h-full glass-object-cover",style:{background:"#020617",cursor:"pointer",minHeight:"100%"},onClick:J}),s.jsx("video",{ref:n,src:I?void 0:e.src,poster:ls,autoPlay:m,muted:a,loop:u,preload:f,className:"glass-w-full glass-h-full glass-object-contain",style:I?{display:"none"}:void 0,onTimeUpdate:vs,onLoadedMetadata:bs,onEnded:ys,onError:ws,onClick:J}),l?.isLoading&&s.jsx("div",{className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center glass-surface-dark/50",children:s.jsx("div",{className:"glass-animate-spin glass-radius-full glass-h-16 glass-w-16 glass-border-4 glass-border-white glass-border-t-transparent"})}),l?.isError&&s.jsx("div",{className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center glass-surface-dark/80 glass-text-primary",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"⚠️"}),s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-mb-2",children:"Playback Error"}),s.jsx("p",{className:"glass-text-secondary",children:"Unable to load video content"})]})}),ds&&s.jsx(qs,{isPlaying:R,currentTime:X,duration:ss,volume:ps,playbackRate:ms,isFullscreen:es,isMuted:as,quality:hs,buffered:n.current?.buffered.length?n.current.buffered.end(n.current.buffered.length-1):0,onPlayPause:J,onSeek:K,onVolumeChange:js,onPlaybackRateChange:Ns,onQualityChange:G,onFullscreenToggle:Cs,onMuteToggle:ks})]}),(ts||rs)&&s.jsxs("div",{className:"ag-video-side-panels glass-flex",children:[ts&&e.chapters&&s.jsx(is,{className:"ag-video-side-panel glass-h-full glass-overflow-hidden",children:s.jsx(_s,{chapters:e.chapters,currentTime:X,onChapterClick:Ss})}),rs&&s.jsx(is,{className:"ag-video-side-panel glass-h-full glass-overflow-hidden",children:s.jsx($s,{transcript:F,currentTime:X,searchQuery:cs,onSearchChange:us,onTranscriptClick:Ts})})]})]})]})};try{Z.displayName="GlassAdvancedVideoPlayer",Z.__docgenInfo={description:"",displayName:"GlassAdvancedVideoPlayer",props:{mediaFile:{defaultValue:null,description:"",name:"mediaFile",required:!0,type:{name:"MediaFile"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}},showControls:{defaultValue:{value:"true"},description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showTranscript:{defaultValue:{value:"false"},description:"",name:"showTranscript",required:!1,type:{name:"boolean | undefined"}},showChapters:{defaultValue:{value:"false"},description:"",name:"showChapters",required:!1,type:{name:"boolean | undefined"}},showAnalytics:{defaultValue:{value:"false"},description:"",name:"showAnalytics",required:!1,type:{name:"boolean | undefined"}},autoplay:{defaultValue:{value:"false"},description:"",name:"autoplay",required:!1,type:{name:"boolean | undefined"}},muted:{defaultValue:{value:"false"},description:"",name:"muted",required:!1,type:{name:"boolean | undefined"}},loop:{defaultValue:{value:"false"},description:"",name:"loop",required:!1,type:{name:"boolean | undefined"}},preload:{defaultValue:{value:"metadata"},description:"",name:"preload",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"auto"'},{value:'"none"'},{value:'"metadata"'}]}},poster:{defaultValue:null,description:"",name:"poster",required:!1,type:{name:"string | undefined"}},onTimeUpdate:{defaultValue:null,description:"",name:"onTimeUpdate",required:!1,type:{name:"((currentTime: number) => void) | undefined"}},onEnded:{defaultValue:null,description:"",name:"onEnded",required:!1,type:{name:"(() => void) | undefined"}},onError:{defaultValue:null,description:"",name:"onError",required:!1,type:{name:"((error: string) => void) | undefined"}}}}}catch{}const Hs=Object.freeze(Object.defineProperty({__proto__:null,GlassAdvancedVideoPlayer:Z},Symbol.toStringTag,{value:"Module"}));export{Hs as C,Z as G};
