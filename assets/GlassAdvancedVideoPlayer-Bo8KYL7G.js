import{r as g,R as Ee,j as e,c as w,g as C}from"./iframe-DxUvObG1.js";import{u as Re}from"./GlassMediaProvider-CXuiK_lB.js";import{G as ne}from"./GlassCore-HtvaqyRn.js";const S=s=>{if(isNaN(s))return"0:00";const d=Math.floor(s/3600),r=Math.floor(s%3600/60),i=Math.floor(s%60);return d>0?`${d}:${r.toString().padStart(2,"0")}:${i.toString().padStart(2,"0")}`:`${r}:${i.toString().padStart(2,"0")}`},Ae=s=>s.subtitles?.flatMap(d=>d.content?.map(r=>({...r,keywords:[],sentiment:"neutral"}))??[])??[],de=(s,d)=>!Number.isFinite(s)||!Number.isFinite(d)||d<=0?0:Math.max(0,Math.min(100,s/d*100)),qe=s=>!!s?.startsWith("data:video/"),Ie="data:image/svg+xml,"+encodeURIComponent(`
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
  `),G={...C({intent:"neutral",elevation:"level4",interactive:!0}),appearance:"none",WebkitAppearance:"none",border:"1px solid rgba(148, 163, 184, 0.42)",color:"#f8fafc",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 28px rgba(2,6,23,0.28)"},Le={...C({intent:"primary",elevation:"level4",interactive:!0}),appearance:"none",WebkitAppearance:"none",color:"#f8fafc",borderColor:"rgba(191, 219, 254, 0.72)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 28px rgba(2,6,23,0.28)"},Z={...C({intent:"neutral",elevation:"level4"}),color:"#f8fafc",border:"1px solid rgba(148, 163, 184, 0.34)",boxShadow:"0 18px 38px rgba(2, 6, 23, 0.42)"},Ge={appearance:"none",WebkitAppearance:"none",color:"#38bdf8",accentColor:"#38bdf8"},_e=`
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
    flex: 1 1 0;
    min-width: 0;
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
    overflow: hidden;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.78));
    border-radius: 0;
    color: #f8fafc;
  }

  .ag-advanced-video-player .ag-video-panel-scroll {
    flex: 1 1 auto;
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

  .ag-advanced-video-player.ag-video-compact {
    overflow: hidden !important;
    min-height: 0 !important;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-layout {
    flex-direction: column;
    height: auto;
    overflow: hidden !important;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-surface {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    min-width: 0;
    width: 100%;
    aspect-ratio: auto;
    min-height: 0;
    overflow: hidden !important;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-surface > img,
  .ag-advanced-video-player.ag-video-compact .ag-video-surface > video {
    position: relative !important;
    aspect-ratio: 16 / 9;
    min-height: 160px;
    flex: 0 0 auto;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-controls {
    position: relative !important;
    padding: 8px !important;
    flex: 0 0 auto;
    overflow: hidden;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-control-row {
    gap: 8px !important;
    align-items: flex-start !important;
    flex-direction: row;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-control-group {
    gap: 6px !important;
    flex: 1 1 100%;
    width: 100%;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-control-group:last-child {
    display: none;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-controls button {
    min-width: 34px !important;
    min-height: 34px !important;
    max-width: 44px;
    padding: 6px !important;
    font-size: 12px !important;
  }

  .ag-advanced-video-player.ag-video-compact .ag-video-controls [aria-label^="Playback speed"],
  .ag-advanced-video-player.ag-video-compact .ag-video-controls [aria-label^="Video quality"] {
    min-width: 42px !important;
    max-width: 52px;
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
    .ag-advanced-video-player {
      overflow: hidden !important;
    }

    .ag-advanced-video-player .ag-video-layout {
      overflow: hidden !important;
    }

    .ag-advanced-video-player .ag-video-surface {
      display: flex;
      flex-direction: column;
      overflow: hidden !important;
    }

    .ag-advanced-video-player .ag-video-controls {
      position: relative !important;
      padding: 8px !important;
      flex: 0 0 auto;
      overflow: hidden;
    }

    .ag-advanced-video-player .ag-video-control-row {
      gap: 8px !important;
      align-items: flex-start !important;
      flex-direction: column;
    }

    .ag-advanced-video-player .ag-video-control-group {
      gap: 6px !important;
      flex: 1 1 100%;
      width: 100%;
    }

    .ag-advanced-video-player .ag-video-control-group:last-child {
      justify-content: flex-start;
    }

    .ag-advanced-video-player .ag-video-controls button {
      min-width: 34px !important;
      min-height: 34px !important;
      max-width: 44px;
      padding: 6px !important;
      font-size: 12px !important;
    }

    .ag-advanced-video-player .ag-video-controls [aria-label^="Playback speed"],
    .ag-advanced-video-player .ag-video-controls [aria-label^="Video quality"] {
      min-width: 42px !important;
      max-width: 52px;
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
      flex: 0 0 auto;
    }

    .ag-advanced-video-player .ag-video-side-panels {
      flex-direction: column;
    }

    .ag-advanced-video-player .ag-video-side-panel {
      width: 100%;
      min-width: 0;
      min-height: 420px;
      height: auto;
      max-height: none;
      overflow: visible !important;
    }

    .ag-advanced-video-player .ag-video-panel-content {
      height: auto;
      max-height: 420px;
    }
  }
`,$e=({isPlaying:s,currentTime:d,duration:r,volume:i,playbackRate:c,isFullscreen:v,isMuted:h,quality:m,buffered:a,onPlayPause:u,onSeek:p,onVolumeChange:f,onPlaybackRateChange:j,onQualityChange:_,onFullscreenToggle:$,onMuteToggle:l})=>{const[b,T]=g.useState(!1),[M,V]=g.useState(!1),[P,E]=g.useState(!1),[z,N]=g.useState(!1),U=n=>{const x=n.currentTarget.getBoundingClientRect(),o=(n.clientX-x.left)/x.width*r;p(o)},y=n=>{if(z){const x=n.currentTarget.getBoundingClientRect(),H=(n.clientX-x.left)/x.width,o=Math.max(0,Math.min(r,H*r));p(o)}},R=[.25,.5,.75,1,1.25,1.5,1.75,2],F=["auto","144p","240p","360p","480p","720p","1080p"],B=de(d,r),A=de(a,r);return e.jsxs("div",{"data-glass-component":!0,className:"glass-absolute glass-bottom-0 glass-left-0 glass-right-0 glass-p-4 ag-video-controls",style:{...C({intent:"neutral",elevation:"level4"}),position:"absolute",top:"auto",right:0,bottom:0,left:0,zIndex:20,color:"#f8fafc"},children:[e.jsxs("div",{className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-full glass-cursor-pointer glass-mb-4 glass-relative",onClick:U,onMouseMove:y,onMouseDown:()=>N(!0),onMouseUp:()=>N(!1),onMouseLeave:()=>N(!1),children:[e.jsx("div",{className:"glass-absolute glass-top-0 glass-left-0 glass-h-full glass-surface-subtle glass-radius-full",style:{width:`${A}%`}}),e.jsx("div",{className:"glass-absolute glass-top-0 glass-left-0 glass-h-full glass-surface-primary glass-radius-full",style:{width:`${B}%`}}),e.jsx("div",{className:"glass-absolute glass-top-1/2 glass-transform glass--translate-y-1-2 glass-w-4 glass-h-4 glass-surface-primary glass-radius-full glass-border-2 glass-border-white glass-shadow-md",style:{left:`calc(${B}% - 8px)`}})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-text-primary ag-video-control-row",style:{gap:14,flexWrap:"wrap"},children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 ag-video-control-group",style:{flexWrap:"wrap"},children:[e.jsx("button",{onClick:u,className:"glass-w-12 glass-h-12 glass-flex glass-items-center glass-justify-center glass-surface-subtle/20 hover:glass-surface-subtle/30 glass-radius-full glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",style:Le,"aria-label":s?"Pause video":"Play video",children:s?e.jsxs("div",{className:"glass-flex glass-gap-1",children:[e.jsx("div",{className:"glass-w-1 glass-h-4 glass-surface-subtle glass-radius-full"}),e.jsx("div",{className:"glass-w-1 glass-h-4 glass-surface-subtle glass-radius-full"})]}):e.jsx("div",{className:"glass-w-0 glass-h-0 glass-border-l-4 glass-border-l-white glass-border-y-4 glass-border-y-transparent glass-ml-1"})}),e.jsxs("div",{className:"glass-relative",onMouseEnter:()=>T(!0),onMouseLeave:()=>T(!1),children:[e.jsx("button",{onClick:l,className:"glass-w-10 glass-h-10 glass-flex glass-items-center glass-justify-center hover:glass-surface-subtle/20 glass-radius-full glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",style:G,"aria-label":h||i===0?"Unmute video":"Mute video",children:h||i===0?"🔇":i<.5?"🔉":"🔊"}),b&&e.jsx("div",{className:"glass-absolute glass-bottom-12 glass--left-1-2 glass-transform glass--translate-x-1-2 glass-radius-lg glass-p-2",style:Z,children:e.jsx("input",{type:"range",min:"0",max:"1",step:"0.01",value:h?0:i,onChange:n=>f(Number(n.target.value)),className:"glass-w-16 glass-h-1 glass-surface-subtle/20 glass-radius-full glass-appearance-none glass-slider-thumb-white glass-focus glass-touch-target glass-contrast-guard",style:Ge})})]}),e.jsxs("div",{className:"glass-text-sm glass-font-mono",style:{...C({intent:"neutral",elevation:"level3"}),color:"#f8fafc",border:"1px solid rgba(148, 163, 184, 0.3)",borderRadius:999,padding:"8px 12px",whiteSpace:"nowrap"},children:[S(d)," / ",S(r)]})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 ag-video-control-group",style:{flexWrap:"wrap"},children:[e.jsxs("div",{className:"glass-relative",children:[e.jsxs("button",{onClick:()=>V(!M),className:"glass-px-3 glass-py-2 glass-text-sm hover:glass-surface-subtle/20 glass-radius-md glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",style:G,"aria-label":`Playback speed: ${c}x`,children:[c,"x"]}),M&&e.jsx("div",{className:"glass-absolute glass-bottom-12 glass-right-0 glass-radius-lg glass-p-2 glass-min-w-20",style:Z,children:R.map(n=>e.jsxs("button",{onClick:()=>{j(n),V(!1)},className:w("glass-block glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-radius glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",n===c&&"glass-surface-primary"),style:{color:"#f8fafc",background:n===c?"rgba(37, 99, 235, 0.96)":"transparent"},children:[n,"x"]},n))})]}),e.jsxs("div",{className:"glass-relative",children:[e.jsx("button",{onClick:()=>E(!P),className:"glass-px-3 glass-py-2 glass-text-sm hover:glass-surface-subtle/20 glass-radius-md glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",style:G,"aria-label":`Video quality: ${m}`,children:m}),P&&e.jsx("div",{className:"glass-absolute glass-bottom-12 glass-right-0 glass-radius-lg glass-p-2 glass-min-w-20",style:Z,children:F.map(n=>e.jsx("button",{onClick:()=>{_(n),E(!1)},className:w("glass-block glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-radius glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",n===m&&"glass-surface-primary"),style:{color:"#f8fafc",background:n===m?"rgba(37, 99, 235, 0.96)":"transparent"},children:n},n))})]}),e.jsx("button",{onClick:$,className:"glass-w-10 glass-h-10 glass-flex glass-items-center glass-justify-center hover:glass-surface-subtle/20 glass-radius-full glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",style:G,"aria-label":v?"Exit fullscreen":"Enter fullscreen",children:v?"⊟":"⊞"})]})]})]})},ze=({chapters:s,currentTime:d,onChapterClick:r})=>e.jsxs("div",{className:"ag-video-panel-content glass-surface-subtle glass-text-primary glass-p-4",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-4",children:"Chapters"}),e.jsx("div",{className:"ag-video-panel-scroll glass-space-y-2",children:s.map(i=>{const c=d>=i.startTime&&d<=i.endTime;return e.jsxs("button",{onClick:()=>r(i),className:w("glass-flex glass-items-center glass-gap-3 glass-w-full glass-p-3 glass-radius-lg glass-text-left glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",c?"glass-surface-primary":"glass-surface-overlay"),style:{background:c?"rgba(37, 99, 235, 0.84)":"rgba(15, 23, 42, 0.66)",border:"1px solid rgba(226, 232, 240, 0.18)",color:"#f8fafc",minHeight:84},children:[i.thumbnail&&e.jsx("img",{src:i.thumbnail,alt:i.title,className:"glass-w-16 glass-h-9 glass-object-cover glass-radius"}),e.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[e.jsx("div",{className:"glass-font-medium",children:i.title}),e.jsxs("div",{className:"glass-text-sm glass-text-primary",children:[S(i.startTime)," -"," ",S(i.endTime)]}),i.description&&e.jsx("div",{className:"glass-text-xs glass-text-primary glass-mt-1",children:i.description})]})]},i.id)})})]}),Ue=({transcript:s,currentTime:d,searchQuery:r,onSearchChange:i,onTranscriptClick:c})=>{const[v,h]=g.useState([]);g.useEffect(()=>{if(r){const a=s.filter(u=>u.text.toLowerCase().includes(r.toLowerCase()));h(a)}else h([])},[r,s]);const m=(a,u)=>{if(!u)return a;const p=new RegExp(`(${u})`,"gi");return a.split(p).map((f,j)=>f.toLowerCase()===u.toLowerCase()?e.jsx("mark",{className:"glass-surface-subtle glass-text-inverse glass-radius glass-px-1",children:f},j):f)};return e.jsxs("div",{className:"ag-video-panel-content glass-surface-subtle glass-text-primary glass-p-4 glass-h-full glass-flex glass-flex-col",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold",children:"Transcript"}),e.jsxs("div",{className:"glass-text-sm glass-text-primary",children:[s.length," entries"]})]}),e.jsxs("div",{className:"glass-mb-4",children:[e.jsx("input",{type:"text",placeholder:"Search transcript...",value:r,onChange:a=>i(a.target.value),className:"glass-w-full glass-px-3 glass-py-2 glass-surface-overlay glass-text-primary glass-border glass-border-subtle glass-radius-lg glass-focus glass-touch-target glass-contrast-guard"}),r&&e.jsxs("div",{className:"glass-text-sm glass-text-primary glass-mt-2",children:[v.length," results found"]})]}),e.jsx("div",{className:"ag-video-panel-scroll glass-flex-1 glass-space-y-3",children:(r?v:s).map(a=>{const u=d>=a.startTime&&d<=a.endTime,p=a.confidence||0;return e.jsxs("button",{onClick:()=>c(a),className:w("glass-flex glass-flex-col glass-items-start glass-gap-2 glass-w-full glass-p-3 glass-radius-lg glass-text-left glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",u?"glass-surface-primary":"glass-surface-overlay"),style:{background:u?"rgba(37, 99, 235, 0.84)":"rgba(15, 23, 42, 0.66)",border:"1px solid rgba(226, 232, 240, 0.18)",color:"#f8fafc"},children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-w-full",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("span",{className:"glass-text-xs glass-text-primary glass-font-mono",children:S(a.startTime)}),a.speaker&&e.jsx("span",{className:"glass-text-xs glass-surface-subtle glass-text-primary glass-px-2 glass-py-1 glass-radius",children:a.speaker})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[p>0&&e.jsxs("div",{className:w("glass-text-xs glass-px-2 glass-py-1 glass-radius",p>.9?"glass-surface-success":p>.7?"glass-surface-warning":"glass-surface-danger"),children:[Math.round(p*100),"%"]}),a.sentiment&&e.jsx("div",{className:"glass-text-xs",children:a.sentiment==="positive"?"😊":a.sentiment==="negative"?"😔":"😐"})]})]}),e.jsx("div",{className:"glass-text-sm glass-leading-relaxed",children:r?m(a.text,r):a.text}),a.keywords&&a.keywords.length>0&&e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-1 glass-mt-2",children:a.keywords.map(f=>e.jsx("span",{className:"glass-text-xs glass-surface-subtle glass-text-primary glass-px-2 glass-py-1 glass-radius",children:f},f))})]},a.id)})})]})},Q=({mediaFile:s,className:d,"data-testid":r,showControls:i=!0,showTranscript:c=!1,showChapters:v=!1,showAnalytics:h=!1,autoplay:m=!1,muted:a=!1,loop:u=!1,preload:p="metadata",poster:f,onTimeUpdate:j,onEnded:_,onError:$})=>{const{playbackState:l,setPlaybackState:b,play:T,pause:M,seekTo:V,setVolume:P,setPlaybackRate:E,toggleMute:z,toggleFullscreen:N,setQuality:U,transcripts:y,generateTranscript:R,searchTranscript:F,getTranscriptAtTime:B,setActiveChapter:A,getChapterAtTime:n,trackView:x,trackEngagement:H}=Re(),o=g.useRef(null),q=g.useRef(null),[ge,W]=g.useState(i),[ce,ue]=g.useState(!1),[O,pe]=g.useState(null),[fe,me]=g.useState(""),[ve,D]=g.useState(!1),X=Ee.useMemo(()=>Ae(s),[s]),ee=y[s.id]??X,I=l?.mediaId===s.id&&l.isPlaying,J=l?.mediaId===s.id?l.currentTime:0,se=l?.mediaId===s.id?l.duration:s.duration||0,he=l?.volume||1,xe=l?.playbackRate||1,ae=l?.isFullscreen||!1,le=l?.isMuted||!1,be=l?.quality||"auto",te=f||s.poster||s.thumbnail||Ie,L=!s.src||qe(s.src);g.useEffect(()=>{const t=q.current;if(!t||typeof ResizeObserver>"u")return;const k=()=>{ue(t.getBoundingClientRect().width<560)};k();const oe=new ResizeObserver(k);return oe.observe(t),()=>oe.disconnect()},[]),g.useEffect(()=>{if(c){if(X.length>0){D(!0);return}!y[s.id]&&c?R(s.id).then(()=>{D(!0)}):y[s.id]&&D(!0)}},[s.id,c,R,y,X.length]);const ye=g.useCallback(()=>{W(!0),O&&clearTimeout(O);const t=setTimeout(()=>{I&&W(!1)},3e3);pe(t)},[I,O]),we=()=>{if(o.current){const t=o.current.currentTime;l&&l.mediaId===s.id&&b({...l,currentTime:t}),j?.(t);const k=n(s.id,t);k&&A(s.id,k.id)}},je=()=>{if(o.current){const t=o.current.duration;l&&l.mediaId===s.id&&b({...l,duration:t,isLoading:!1})}},Ne=()=>{l&&l.mediaId===s.id&&b({...l,isPlaying:!1,currentTime:0}),x(s.id,se),_?.()},ke=()=>{l&&l.mediaId===s.id&&b({...l,isError:!0,isLoading:!1}),$?.("Video playback error occurred")},K=()=>{I?(M(),o.current&&o.current.pause()):(T(s.id),o.current&&!L&&o.current.play())},Y=t=>{V(t),o.current&&(o.current.currentTime=t)},Ce=t=>{P(t),o.current&&(o.current.volume=t)},Se=t=>{E(t),o.current&&(o.current.playbackRate=t)},Te=()=>{z(),o.current&&(o.current.muted=!le)},Me=()=>{N(),ae?document.exitFullscreen&&document.exitFullscreen():q.current?.requestFullscreen&&q.current.requestFullscreen()},Ve=t=>{Y(t.startTime),A(s.id,t.id)},Pe=t=>{Y(t.startTime)},re=v&&!!(s.chapters&&s.chapters.length>0),ie=c&&ve&&ee.length>0;return e.jsxs("div",{className:w("ag-advanced-video-player glass-relative glass-radius-lg glass-overflow-hidden",ce&&"ag-video-compact",d),"data-testid":r||"glassadvancedvideoplayer",style:{background:"#020617",color:"#f8fafc",minHeight:320},children:[e.jsx("style",{children:_e}),e.jsxs("div",{ref:q,className:"ag-video-layout glass-relative glass-w-full glass-h-full",style:{minHeight:0},onMouseMove:ye,onMouseLeave:()=>W(!1),children:[e.jsxs("div",{className:"ag-video-surface glass-flex-1 glass-relative",style:{minHeight:0,overflow:"hidden"},children:[L&&e.jsx("img",{src:te,alt:s.title||"Video preview",className:"glass-absolute glass-inset-0 glass-w-full glass-h-full glass-object-cover",style:{background:"#020617",cursor:"pointer",minHeight:"100%"},onClick:K}),e.jsx("video",{ref:o,src:L?void 0:s.src,poster:te,autoPlay:m,muted:a,loop:u,preload:p,className:"glass-w-full glass-h-full glass-object-contain",style:L?{display:"none"}:void 0,onTimeUpdate:we,onLoadedMetadata:je,onEnded:Ne,onError:ke,onClick:K}),l?.isLoading&&e.jsx("div",{className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center",style:{background:'/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */'},children:e.jsx("div",{className:"glass-animate-spin glass-radius-full glass-h-16 glass-w-16 glass-border-4 glass-border-white glass-border-t-transparent"})}),l?.isError&&e.jsx("div",{className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center glass-text-primary",style:{background:'/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */'},children:e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"⚠️"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-mb-2",children:"Playback Error"}),e.jsx("p",{className:"glass-text-secondary",children:"Unable to load video content"})]})}),ge&&e.jsx($e,{isPlaying:I,currentTime:J,duration:se,volume:he,playbackRate:xe,isFullscreen:ae,isMuted:le,quality:be,buffered:o.current?.buffered.length?o.current.buffered.end(o.current.buffered.length-1):0,onPlayPause:K,onSeek:Y,onVolumeChange:Ce,onPlaybackRateChange:Se,onQualityChange:U,onFullscreenToggle:Me,onMuteToggle:Te})]}),(re||ie)&&e.jsxs("div",{className:"ag-video-side-panels glass-flex",children:[re&&s.chapters&&e.jsx(ne,{className:"ag-video-side-panel glass-h-full glass-overflow-hidden",children:e.jsx(ze,{chapters:s.chapters,currentTime:J,onChapterClick:Ve})}),ie&&e.jsx(ne,{className:"ag-video-side-panel glass-h-full glass-overflow-hidden",children:e.jsx(Ue,{transcript:ee,currentTime:J,searchQuery:fe,onSearchChange:me,onTranscriptClick:Pe})})]})]})]})};try{Q.displayName="GlassAdvancedVideoPlayer",Q.__docgenInfo={description:"",displayName:"GlassAdvancedVideoPlayer",props:{mediaFile:{defaultValue:null,description:"",name:"mediaFile",required:!0,type:{name:"MediaFile"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}},showControls:{defaultValue:{value:"true"},description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showTranscript:{defaultValue:{value:"false"},description:"",name:"showTranscript",required:!1,type:{name:"boolean | undefined"}},showChapters:{defaultValue:{value:"false"},description:"",name:"showChapters",required:!1,type:{name:"boolean | undefined"}},showAnalytics:{defaultValue:{value:"false"},description:"",name:"showAnalytics",required:!1,type:{name:"boolean | undefined"}},autoplay:{defaultValue:{value:"false"},description:"",name:"autoplay",required:!1,type:{name:"boolean | undefined"}},muted:{defaultValue:{value:"false"},description:"",name:"muted",required:!1,type:{name:"boolean | undefined"}},loop:{defaultValue:{value:"false"},description:"",name:"loop",required:!1,type:{name:"boolean | undefined"}},preload:{defaultValue:{value:"metadata"},description:"",name:"preload",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"auto"'},{value:'"metadata"'}]}},poster:{defaultValue:null,description:"",name:"poster",required:!1,type:{name:"string | undefined"}},onTimeUpdate:{defaultValue:null,description:"",name:"onTimeUpdate",required:!1,type:{name:"((currentTime: number) => void) | undefined"}},onEnded:{defaultValue:null,description:"",name:"onEnded",required:!1,type:{name:"(() => void) | undefined"}},onError:{defaultValue:null,description:"",name:"onError",required:!1,type:{name:"((error: string) => void) | undefined"}}}}}catch{}const Oe=Object.freeze(Object.defineProperty({__proto__:null,GlassAdvancedVideoPlayer:Q},Symbol.toStringTag,{value:"Module"}));export{Oe as C,Q as G};
