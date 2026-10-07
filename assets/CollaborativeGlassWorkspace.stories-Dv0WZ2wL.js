import{j as s,f as p,c as g,r as c}from"./iframe-RsoZoStf.js";import{x as is,y as cs,z as gs,J as ks,N as js,O as Ns,Q as ds,W as Cs,X as Vs,Y as Ss,_ as Es,$ as qs,S as Is}from"./components-DwI53NlZ.js";import{C as Ms}from"./GlassCollaborationProvider-B6BjFtbx.js";import"./preload-helper-PPVm8Dsz.js";function D(e){return s.jsx(Ms,{roomId:e.workspaceId,enableRealTime:e.enableRealTimeSync,children:s.jsx(Us,{...e})})}function Us({className:e="",layout:n="split",theme:l="dark",showMiniMap:t=!0,showOnlineUsers:r=!0,showCursors:o=!0,enableAdvancedEffects:i=!0,compact:a=!1,contained:b=!1,maxHeight:u,canvasWidth:v=1200,canvasHeight:w=800,gridSize:y=20,showGrid:k=!0,showRulers:j=!1,enableSnapping:N=!0,enableVoiceChat:m=!1,enableScreenSharing:B=!1,enableComments:C=!0,enableVersionControl:f=!0,enableRealTimeSync:V=!0,onWorkspaceReady:S,onUserJoined:d,onUserLeft:Q,onElementSelected:X,onError:Ps,"aria-label":ms}){const ps={workspace:{id:"workspace-1",name:"Collaborative Design Session"},currentUser:{id:"user-1",name:"Current User",role:"admin"},onlineUsers:[{id:"user-1",name:"Alice Johnson",role:"admin",avatar:"",color:"hsl(var(--glass-color-primary))"},{id:"user-2",name:"Bob Smith",role:"editor",avatar:"",color:"hsl(var(--glass-color-success))"},{id:"user-3",name:"Carol Davis",role:"viewer",avatar:"",color:"hsl(var(--glass-color-warning))"}],canEdit:!0,isVoiceActive:!1,voiceUsers:[],toggleVoice:()=>{},createSnapshot:()=>{},undo:()=>{},redo:()=>{},canUndo:!0,canRedo:!1},{workspace:E,currentUser:P,onlineUsers:Y,canEdit:bs,isVoiceActive:I,voiceUsers:A,toggleVoice:F,createSnapshot:Z,undo:K,redo:ss,canUndo:es,canRedo:as}=ps,[M,hs]=c.useState(n),[$,fs]=c.useState(null),[ls,xs]=c.useState(!a),[vs,As]=c.useState(!a),[H,rs]=c.useState(!1),[ws,ts]=c.useState(!1),[ys,os]=c.useState(!1),h=u??(a||b?260:void 0);c.useEffect(()=>{E&&S?.(E)},[E,S]);const U=c.useCallback(ns=>{fs(ns),X?.(ns)},[X]),x=c.useMemo(()=>{switch(M){case"canvas-focused":return{canvasSize:"glass-flex-1",editorSize:"glass-w-80",direction:"row",canvasFirst:!0};case"editor-focused":return{canvasSize:"glass-w-80",editorSize:"glass-flex-1",direction:"row",canvasFirst:!1};case"tabs":return{canvasSize:"glass-w-full",editorSize:"glass-w-full",direction:"col",canvasFirst:!0};default:return{canvasSize:"glass-flex-1",editorSize:"glass-flex-1",direction:"row",canvasFirst:!0}}},[M]);return!E||!P?s.jsx(Gs,{message:"Setting up workspace..."}):s.jsxs("div",{className:g("glass-collaborative-workspace workspace-glass-shell glass-relative glass-flex glass-flex-col glass-surface-overlay",a||b?"glass-h-full glass-min-h-0 glass-overflow-hidden":"glass-h-screen",e),style:{...h!==void 0?{maxHeight:typeof h=="number"?`${h}px`:h,height:typeof h=="number"?`${h}px`:h}:null},role:"main","aria-live":"polite","aria-label":ms,children:[s.jsx("style",{children:`
        .glass-collaborative-workspace.workspace-glass-shell {
          background: linear-gradient(145deg, rgba(255,255,255,0.105) 0%, rgba(255,255,255,0.035) 52%, rgba(255,255,255,0.018) 100%);
          color: var(--glass-text-primary);
        }

        .glass-collaborative-workspace .workspace-glass-panel {
          background: rgba(255, 255, 255, 0.18);
          border-color: var(--glass-neutral-level3-border-color);
          color: var(--glass-theme-text, var(--glass-text-primary));
          backdrop-filter: blur(24px) saturate(1.45) brightness(1.04) contrast(1.03);
          -webkit-backdrop-filter: blur(24px) saturate(1.45) brightness(1.04) contrast(1.03);
          box-shadow: var(--glass-neutral-level3-shadow);
          min-width: 0;
          max-width: 100%;
          width: 100%;
          overflow: hidden;
        }

        .glass-collaborative-workspace .workspace-glass-panel label,
        .glass-collaborative-workspace .workspace-glass-panel p,
        .glass-collaborative-workspace .workspace-glass-panel span {
          color: inherit;
        }

        .glass-collaborative-workspace .workspace-glass-panel button,
        .glass-collaborative-workspace .workspace-glass-panel .workspace-glass-button {
          background-color: rgba(var(--glass-color-white) / 0.1);
          border: 1px solid var(--glass-border-default);
          color: var(--glass-text-primary);
        }

        .glass-collaborative-workspace .workspace-glass-panel .glass-surface-primary,
        .glass-collaborative-workspace .workspace-glass-button-primary {
          background: var(--glass-primary-level3-surface);
          border-color: var(--glass-primary-level3-border-color);
          color: var(--glass-primary-level3-text-primary);
        }

        .glass-collaborative-workspace .workspace-glass-inset {
          background: rgba(var(--glass-color-white) / 0.08);
          border: 1px solid var(--glass-border-default);
          color: var(--glass-text-primary);
          min-width: 0;
          max-width: 100%;
          width: 100%;
          overflow: hidden;
        }

        .glass-collaborative-workspace .workspace-main-content {
          flex-wrap: wrap;
        }

        .glass-collaborative-workspace .workspace-main-content > div {
          min-width: min(100%, 300px);
        }

        .glass-collaborative-workspace .glass-collaboration-number,
        .glass-collaborative-workspace .glass-collaboration-range {
          appearance: none;
          -webkit-appearance: none;
        }

        .glass-collaborative-workspace .glass-collaboration-number {
          background: rgba(var(--glass-color-white) / 0.08);
          border: 1px solid var(--glass-border-default);
          box-shadow: inset 0 1px 0 rgba(var(--glass-color-white) / 0.12);
          color: var(--glass-text-primary);
        }

        .glass-collaborative-workspace .glass-collaboration-number::placeholder {
          color: var(--glass-text-tertiary);
        }

        .glass-collaborative-workspace .glass-collaboration-number::-webkit-outer-spin-button,
        .glass-collaborative-workspace .glass-collaboration-number::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .glass-collaborative-workspace .glass-collaboration-range {
          height: 0.625rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.3);
          box-shadow:
            inset 0 1px 2px rgba(15, 23, 42, 0.12),
            0 1px 0 rgba(255, 255, 255, 0.32);
          cursor: pointer;
        }

        .glass-collaborative-workspace .glass-collaboration-range::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 999px;
          border: 2px solid rgba(255, 255, 255, 0.96);
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.22);
        }

        .glass-collaborative-workspace .glass-collaboration-range::-moz-range-thumb {
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 999px;
          border: 2px solid rgba(255, 255, 255, 0.96);
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.22);
        }
      `}),vs&&s.jsx(Ts,{workspace:E,currentUser:P,onlineUsers:Y,canEdit:bs,isVoiceActive:I,voiceUsers:A,onToggleVoice:F,onCreateSnapshot:Z,onUndo:K,onRedo:ss,canUndo:es,canRedo:as,onLayoutChange:hs,activeLayout:M,onToggleSidebar:()=>xs(!ls),onToggleFullscreen:()=>rs(!H),isFullscreen:H,showOnlineUsers:r,enableVoiceChat:m,enableVersionControl:f}),s.jsxs("div",{className:g("workspace-main-content glass-flex-1 glass-flex glass-min-h-0 glass-min-w-0 glass-w-full glass-overflow-hidden",x.direction==="col"?"glass-flex-col":"glass-flex-row"),children:[M==="tabs"?s.jsx(Rs,{selectedElementId:$,onElementSelect:U,width:v,height:w,gridSize:y,showGrid:k,showRulers:j,enableSnapping:N,enableComments:C,enableRealTimeSync:V}):s.jsxs(s.Fragment,{children:[x.canvasFirst&&s.jsx("div",{className:g(x.canvasSize,"glass-min-w-0 glass-p-4"),children:s.jsx(J,{width:v,height:w,gridSize:y,showGrid:k,showRulers:j,enableSnapping:N,onElementSelect:U,className:g("glass-h-full")})}),!a&&s.jsx("div",{className:g(x.editorSize,"glass-min-w-0 glass-p-4"),children:s.jsx(us,{target:$||"global",showPreview:!0,showHistory:f,showComments:C,enableRealTimeSync:V,layout:"vertical",className:"glass-h-full"})}),!x.canvasFirst&&s.jsx("div",{className:g(x.canvasSize,"glass-min-w-0 glass-p-4"),children:s.jsx(J,{width:v,height:w,gridSize:y,showGrid:k,showRulers:j,enableSnapping:N,onElementSelect:U,className:g("glass-h-full")})})]}),ls&&s.jsx(Ws,{selectedElementId:$,onElementSelect:U,showMiniMap:t,showOnlineUsers:r,onlineUsers:Y,currentUser:P,isVoiceActive:I,voiceUsers:A,enableComments:C})]}),!a&&o&&(i?s.jsx(O,{showNames:!0,showVoiceIndicators:m,cursorSize:"md",glassLevel:"medium",enableRippleEffect:!0,enableGlowEffect:!0}):s.jsx(q,{showNames:!0,showVoiceIndicators:m,cursorSize:"md",glassLevel:"medium"})),!a&&ws&&m&&s.jsx(Ls,{isActive:I,voiceUsers:A,onClose:()=>ts(!1),onToggleVoice:F}),!a&&ys&&f&&s.jsx(zs,{onClose:()=>os(!1),onCreateSnapshot:Z,canUndo:es,canRedo:as,onUndo:K,onRedo:ss}),s.jsx(_s,{isVoiceActive:I,onToggleVoice:F,onShowVoicePanel:()=>ts(!0),onShowVersionPanel:()=>os(!0),onToggleFullscreen:()=>rs(!H),enableVoiceChat:m,enableVersionControl:f})]})}function Ts({workspace:e,currentUser:n,onlineUsers:l,canEdit:t,isVoiceActive:r,voiceUsers:o,onToggleVoice:i,onCreateSnapshot:a,onUndo:b,onRedo:u,canUndo:v,canRedo:w,onLayoutChange:y,activeLayout:k,onToggleSidebar:j,onToggleFullscreen:N,isFullscreen:m,showOnlineUsers:B,enableVoiceChat:C,enableVersionControl:f}){const[V,S]=c.useState(!1);return s.jsxs("div",{className:"workspace-header workspace-glass-panel glass-flex glass-items-center glass-justify-between glass-flex-wrap glass-gap-2 glass-px-4 glass-py-3 glass-border-b glass-border-white/10",style:p({intent:"neutral",elevation:"level2"}),children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-4 glass-min-w-0",children:[s.jsx("h1",{className:"glass-text-xl glass-font-bold glass-text-primary",children:e.name}),s.jsx("div",{className:"glass-text-sm glass-text-primary glass-whitespace-nowrap",style:{color:"var(--glass-theme-text, var(--glass-text-primary))"},children:t?"✏️ Editing":"👁️ Viewing"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-min-w-0 glass-flex-wrap",children:[f&&s.jsxs(s.Fragment,{children:[s.jsx("button",{onClick:b,disabled:!v,className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary glass-focus glass-touch-target glass-contrast-guard",style:{opacity:"var(--glass-opacity-50)"},title:"Undo","aria-label":"Undo last action",children:s.jsx(is,{className:"glass-w-4 glass-h-4"})}),s.jsx("button",{onClick:u,disabled:!w,className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary glass-focus glass-touch-target glass-contrast-guard",style:{opacity:"var(--glass-opacity-50)"},title:"Redo","aria-label":"Redo last action",children:s.jsx(cs,{className:"glass-w-4 glass-h-4"})}),s.jsx("button",{onClick:()=>a(`Snapshot ${Date.now()}`),className:"workspace-glass-button-primary glass-px-3 glass-py-2 glass-text-sm glass-surface-primary glass-text-primary glass-radius",title:"Create Snapshot",children:"📷 Snapshot"})]}),s.jsxs("div",{className:"glass-relative",children:[s.jsx("button",{onClick:()=>S(!V),className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary",title:"Change Layout","aria-label":"Change workspace layout",children:"🔀"}),V&&s.jsx("div",{className:"glass-absolute glass-top-full glass-left-0 glass-mt-2 glass-p-2 glass-surface-overlay glass-border glass-border-white/20 glass-radius glass-shadow-lg glass-z-50",children:["split","tabs","canvas-focused","editor-focused"].map(d=>s.jsx("button",{onClick:()=>{y(d),S(!1)},className:g("glass-block glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-radius glass-text-primary",k===d?"glass-surface-primary":"glass-surface-transparent"),children:d.charAt(0).toUpperCase()+d.slice(1).replace("-"," ")},d))})]}),C&&s.jsxs("button",{onClick:i,className:g("glass-p-2 glass-radius glass-text-primary",r?"glass-surface-success":"glass-surface-transparent"),title:r?"Leave Voice Chat":"Join Voice Chat","aria-label":r?"Leave voice chat":"Join voice chat",children:[r?s.jsx(gs,{className:"glass-w-4 glass-h-4"}):s.jsx(ks,{className:"glass-w-4 glass-h-4"}),o.length>0&&` (${o.length})`]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-min-w-0 glass-flex-wrap",children:[B&&s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsxs("div",{className:"glass-flex",children:[l.slice(0,5).map((d,Q)=>s.jsx("div",{className:"glass-w-8 glass-h-8 glass-radius-full glass-border-2 glass-border-white glass-flex glass-items-center glass-justify-center glass-text-xs glass-font-bold glass-text-primary",style:{backgroundColor:d.color,marginLeft:Q===0?0:-8},title:d.name,children:d.name[0]},d.id)),l.length>5&&s.jsxs("div",{className:"glass-w-8 glass-h-8 glass-radius-full glass-surface-primary glass-border-2 glass-border-white glass-flex glass-items-center glass-justify-center glass-text-xs glass-text-primary",children:["+",l.length-5]})]}),s.jsxs("span",{className:"glass-text-sm glass-text-primary",style:{color:"var(--glass-theme-text, var(--glass-text-primary))"},children:[l.length," online"]})]}),s.jsx("button",{onClick:j,className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",title:"Toggle Sidebar","aria-label":"Toggle sidebar",children:s.jsx(js,{className:"glass-w-4 glass-h-4"})}),s.jsx("button",{onClick:N,className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",title:"Toggle Fullscreen","aria-label":m?"Exit fullscreen":"Enter fullscreen",children:m?s.jsx(Ns,{className:"glass-w-4 glass-h-4"}):s.jsx(ds,{className:"glass-w-4 glass-h-4"})})]})]})}function Rs({selectedElementId:e,onElementSelect:n,enableComments:l,enableRealTimeSync:t,...r}){const[o,i]=c.useState("canvas");return s.jsxs("div",{className:"glass-flex glass-flex-col glass-h-full",children:[s.jsxs("div",{className:"glass-flex glass-border-b glass-border-white/20 glass-surface-overlay",children:[s.jsx("button",{onClick:()=>i("canvas"),className:`glass-px-6 glass-py-3 glass-font-medium ${o==="canvas"?"glass-text-white glass-border-b-2 glass-border-blue-400 glass-surface-overlay":"glass-text-white-opacity-70 glass-hover-text-white"}`,children:"🎨 Canvas"}),s.jsx("button",{onClick:()=>i("editor"),className:`glass-px-6 glass-py-3 glass-font-medium ${o==="editor"?"glass-text-white glass-border-b-2 glass-border-blue-400 glass-surface-overlay":"glass-text-white-opacity-70 glass-hover-text-white"}`,children:"⚙️ Properties"})]}),s.jsx("div",{className:"glass-flex-1 glass-p-4",children:o==="canvas"?s.jsx(J,{...r,onElementSelect:n,className:"glass-h-full"}):s.jsx(us,{showComments:l,enableRealTimeSync:t,className:"glass-h-full"})})]})}function J({width:e,height:n,gridSize:l,showGrid:t,showRulers:r,enableSnapping:o,onElementSelect:i,className:a}){return s.jsxs("div",{className:`collaborative-canvas workspace-glass-panel relative glass-w-full glass-min-w-0 ${a}`,style:p({intent:"neutral",elevation:"level2"}),children:[t&&s.jsx("div",{className:"glass-absolute glass-inset-0 glass-opacity-20",style:{backgroundImage:"linear-gradient(var(--glass-bg-default) 1px, transparent 1px), linear-gradient(90deg, var(--glass-bg-default) 1px, transparent 1px)",backgroundSize:`${l}px ${l}px`}}),s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full glass-text-primary-glass-opacity-60",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"🎨"}),s.jsx("p",{className:"glass-text-lg",children:"Collaborative Canvas"}),s.jsx("p",{className:"glass-text-sm",children:"Click to start designing together"})]})})]})}function us({target:e,showPreview:n,showHistory:l,showComments:t,enableRealTimeSync:r,layout:o,className:i}){return s.jsx("div",{className:`multi-user-editor workspace-glass-panel glass-w-full glass-min-w-0 ${i}`,style:p({intent:"neutral",elevation:"level2"}),children:s.jsxs("div",{className:"glass-p-4",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h2",{className:"glass-text-primary glass-font-semibold",children:"Properties Editor"}),s.jsxs("div",{className:"glass-flex glass-gap-2",children:[l&&s.jsx("button",{className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary",children:"📜"}),t&&s.jsx("button",{className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary",children:"💬"}),r&&s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1 glass-text-primary glass-text-sm",children:[s.jsx(Cs,{className:"glass-w-3 glass-h-3"})," Live"]})]})]}),s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2",children:"Target Element"}),s.jsx("div",{className:"workspace-glass-inset glass-p-2 glass-surface-subtle/5 glass-radius glass-text-primary glass-text-sm",children:e})]}),s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2",children:"Properties"}),s.jsxs("div",{className:"glass-space-y-2",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60 glass-text-sm glass-w-20",children:"Width:"}),s.jsx("input",{type:"number","data-glass-component":"number",className:"glass-collaboration-number glass-flex-1 glass-p-2 glass-surface-subtle/10 glass-radius glass-text-primary glass-text-sm glass-touch-target glass-contrast-guard",placeholder:"Auto","aria-label":"Width"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60 glass-text-sm glass-w-20",children:"Height:"}),s.jsx("input",{type:"number","data-glass-component":"number",className:"glass-collaboration-number glass-flex-1 glass-p-2 glass-surface-subtle/10 glass-radius glass-text-primary glass-text-sm glass-touch-target glass-contrast-guard",placeholder:"Auto","aria-label":"Height"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60 glass-text-sm glass-w-20",children:"Opacity:"}),s.jsx("input",{type:"range","data-glass-component":"range",min:"0",max:"1",step:"0.1",className:"glass-collaboration-range glass-flex-1 glass-touch-target glass-contrast-guard","aria-label":"Opacity"})]})]})]})]})]})})}function Ws({selectedElementId:e,onElementSelect:n,showMiniMap:l,showOnlineUsers:t,onlineUsers:r,currentUser:o,isVoiceActive:i,voiceUsers:a,enableComments:b}){return s.jsxs("div",{className:"workspace-sidebar workspace-glass-panel glass-w-80 glass-border-l glass-border-white/20 glass-p-4 glass-space-y-4",style:p({intent:"neutral",elevation:"level2"}),children:[l&&s.jsxs("div",{className:"glass-space-y-2",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-80 glass-uppercase",children:"Mini Map"}),s.jsx("div",{className:"workspace-glass-inset glass-aspect-video glass-surface-overlay glass-border glass-border-white/20 glass-radius glass-p-2",children:s.jsx("div",{className:"glass-text-xs glass-text-primary glass-text-center glass-mt-8",children:"Canvas overview"})})]}),t&&s.jsxs("div",{className:"glass-space-y-2",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-80 glass-uppercase",children:"Online Users"}),s.jsx("div",{className:"glass-space-y-2",children:r.map(u=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 glass-p-2 glass-radius hover:glass-surface-subtle/5",children:[s.jsx("div",{className:"glass-w-6 glass-h-6 glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs glass-font-bold glass-text-primary",style:{backgroundColor:u.color},children:u.name[0]}),s.jsxs("div",{className:"glass-flex-1",children:[s.jsx("div",{className:"glass-text-sm glass-text-primary",children:u.name}),s.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-50",children:u.role})]}),a.includes(u.id)&&s.jsx("div",{className:"glass-text-primary glass-text-xs",children:"🎤"})]},u.id))})]}),s.jsxs("div",{className:"glass-space-y-2",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-80 glass-uppercase",children:"Quick Actions"}),s.jsxs("div",{className:"glass-space-y-2",children:[s.jsxs("button",{className:"glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-radius glass-text-primary",children:[s.jsx(Vs,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-2"}),"Copy Selected"]}),s.jsxs("button",{className:"glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-radius glass-text-primary",children:[s.jsx(Ss,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-2"}),"Paste"]}),s.jsxs("button",{className:"glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-radius glass-text-primary",children:[s.jsx(Es,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-2"}),"Delete Selected"]})]})]})]})}function q({showNames:e,showVoiceIndicators:n,cursorSize:l,glassLevel:t,contained:r=!1}){const o=l==="lg"?18:l==="sm"?12:15,i=[{id:"aurora",name:"Aurora",color:"#38bdf8",x:"24%",y:"34%"},{id:"lumen",name:"Lumen",color:"#c084fc",x:"58%",y:"48%"},{id:"orbit",name:"Orbit",color:"#facc15",x:"72%",y:"26%"}];return s.jsx("div",{className:g("glass-pointer-events-none glass-absolute glass-overflow-hidden",r?"glass-inset-0 glass-z-10":"glass-team-cursors-layer glass-z-30"),children:i.map(a=>s.jsxs("div",{className:"glass-absolute glass-flex glass-items-start glass-gap-1.5",style:{left:a.x,top:a.y},children:[s.jsx("svg",{width:o,height:Math.round(o*1.32),viewBox:"0 0 18 24","aria-hidden":"true",style:{color:a.color,filter:t==="high"?`drop-shadow(0 0 12px ${a.color})`:"drop-shadow(0 4px 10px rgba(0,0,0,0.35))"},children:s.jsx("path",{d:"M2 2L16 14.5L10.3 15.2L7.4 22L2 2Z",fill:"currentColor",stroke:"rgba(255,255,255,0.88)",strokeWidth:"1.4",strokeLinejoin:"round"})}),e&&s.jsxs("span",{className:"glass-radius-full glass-px-2 glass-py-0.5 glass-text-xs glass-font-medium glass-text-primary glass-shadow-lg glass-backdrop-blur-md",style:{...p({intent:"neutral",elevation:"level2"}),border:`1px solid ${a.color}`},children:[a.name,n?" mic":""]})]},a.id))})}function O({showNames:e,showVoiceIndicators:n,cursorSize:l,glassLevel:t,enableRippleEffect:r,enableGlowEffect:o}){return s.jsxs("div",{className:"glass-team-cursors-layer glass-pointer-events-none glass-absolute glass-z-30 glass-overflow-hidden",children:[r&&s.jsxs(s.Fragment,{children:[s.jsx("span",{className:"glass-pointer-events-none glass-absolute glass-z-20 glass-radius-full",style:{left:"48%",top:"52%",width:72,height:72,border:"1px solid rgba(56,189,248,0.42)",boxShadow:"0 0 38px rgba(56,189,248,0.16)",transform:"translate(-50%, -50%)"}}),s.jsx("span",{className:"glass-pointer-events-none glass-absolute glass-z-20 glass-radius-full",style:{left:"48%",top:"52%",width:34,height:34,border:"1px solid rgba(192,132,252,0.5)",transform:"translate(-50%, -50%)"}})]}),s.jsx(q,{showNames:e,showVoiceIndicators:n,cursorSize:l,glassLevel:o?"high":t,contained:!0})]})}function Ls({isActive:e,voiceUsers:n,onClose:l,onToggleVoice:t}){return s.jsxs("div",{className:"glass-fixed glass-bottom-4 glass-right-4 glass-w-80 glass-p-4 glass-radius-lg glass-border glass-border-white/20",style:p({intent:"neutral",elevation:"level2"}),children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h3",{className:"glass-text-primary glass-font-semibold",children:"Voice Chat"}),s.jsx("button",{onClick:l,className:"glass-contrast-guard glass-focus glass-touch-target hover:glass-text-primary glass-text-primary-opacity-70","aria-label":"Close voice chat panel",children:"✕"})]}),s.jsx("div",{className:"glass-space-y-2 glass-mb-4",children:n.map(r=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-text-primary glass-text-sm",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse"}),"User ",r]},r))}),s.jsxs("button",{onClick:t,className:g("glass-w-full glass-py-2 glass-radius glass-text-primary glass-transition",e?"glass-surface-danger":"glass-surface-success"),children:[e?"🔇 Leave":"🎤 Join"," Voice Chat"]})]})}function zs({onClose:e,onCreateSnapshot:n,canUndo:l,canRedo:t,onUndo:r,onRedo:o}){return s.jsxs("div",{className:"glass-fixed glass-bottom-4 glass-left-4 glass-w-80 glass-p-4 glass-radius-lg glass-border glass-border-white/20",style:p({intent:"neutral",elevation:"level2"}),children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h3",{className:"glass-text-primary glass-font-semibold",children:"Version Control"}),s.jsx("button",{onClick:e,className:"glass-contrast-guard glass-focus glass-touch-target hover:glass-text-primary glass-text-primary-opacity-70","aria-label":"Close version control panel",children:"✕"})]}),s.jsxs("div",{className:"glass-space-y-2",children:[s.jsxs("div",{className:"glass-flex glass-gap-2",children:[s.jsxs("button",{onClick:r,disabled:!l,className:"glass-flex-1 glass-py-2 glass-px-3 glass-radius glass-surface-subtle/10 glass-text-primary disabled:glass-opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:[s.jsx(is,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-1"}),"Undo"]}),s.jsxs("button",{onClick:o,disabled:!t,className:"glass-flex-1 glass-py-2 glass-px-3 glass-radius glass-surface-subtle/10 glass-text-primary disabled:glass-opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:[s.jsx(cs,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-1"}),"Redo"]})]}),s.jsxs("button",{onClick:()=>n(`Manual snapshot ${Date.now()}`),className:"glass-w-full glass-py-2 glass-px-3 glass-radius glass-surface-primary glass-text-primary",children:[s.jsx(qs,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-1"}),"Create Snapshot"]})]})]})}function _s({isVoiceActive:e,onToggleVoice:n,onShowVoicePanel:l,onShowVersionPanel:t,onToggleFullscreen:r,enableVoiceChat:o,enableVersionControl:i}){const[a,b]=c.useState(!1);return s.jsxs("div",{className:"glass-fixed glass-bottom-6 glass-right-6",children:[s.jsxs("div",{className:g("glass-flex glass-flex-col glass-gap-2",!a&&"glass-pointer-events-none"),style:{opacity:a?1:0,pointerEvents:a?"auto":"none",transition:"opacity 160ms ease"},children:[o&&s.jsx("button",{onClick:l,className:"glass-w-12 glass-h-12 glass-radius-full glass-surface-success glass-text-primary glass-flex glass-items-center glass-justify-center glass-shadow-lg glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",title:"Voice Chat","aria-label":"Open voice chat panel",children:s.jsx(gs,{className:"glass-w-4 glass-h-4"})}),i&&s.jsx("button",{onClick:t,className:"glass-w-12 glass-h-12 glass-radius-full glass-surface-primary glass-text-primary glass-flex glass-items-center glass-justify-center glass-shadow-lg glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",title:"Version Control","aria-label":"Open version control panel",children:s.jsx(Is,{className:"glass-w-4 glass-h-4"})}),s.jsx("button",{onClick:r,className:"glass-w-12 glass-h-12 glass-radius-full glass-surface-primary glass-text-primary glass-flex glass-items-center glass-justify-center glass-shadow-lg hover:glass-surface-subtle glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",title:"Fullscreen","aria-label":"Toggle fullscreen mode",children:s.jsx(ds,{className:"glass-w-4 glass-h-4"})})]}),s.jsx("button",{onClick:()=>b(!a),className:"glass-w-14 glass-h-14 glass-radius-full glass-surface-overlay glass-text-primary glass-flex glass-items-center glass-justify-center glass-shadow-lg hover:bg-white/15 glass-mt-2",style:p({intent:"neutral",elevation:"level2"}),"aria-label":a?"Close floating actions menu":"Open floating actions menu",children:a?"✕":"⚡"})]})}function Gs({message:e="Connecting to workspace..."}){return s.jsx("div",{className:"glass-h-screen glass-flex glass-items-center glass-justify-center glass-surface-overlay",children:s.jsxs("div",{className:"glass-text-center glass-space-y-4",children:[s.jsx("div",{className:"glass-w-16 glass-h-16 glass-border-4 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin glass-mx-auto"}),s.jsx("div",{className:"glass-text-primary glass-text-lg",children:e}),s.jsx("div",{className:"glass-text-primary-glass-opacity-60 glass-text-sm",children:"Please wait..."})]})})}try{D.displayName="CollaborativeGlassWorkspace",D.__docgenInfo={description:"",displayName:"CollaborativeGlassWorkspace",props:{workspaceId:{defaultValue:null,description:"",name:"workspaceId",required:!0,type:{name:"string"}},userId:{defaultValue:null,description:"",name:"userId",required:!0,type:{name:"string"}},userName:{defaultValue:null,description:"",name:"userName",required:!0,type:{name:"string"}},userEmail:{defaultValue:null,description:"",name:"userEmail",required:!0,type:{name:"string"}},userRole:{defaultValue:null,description:"",name:"userRole",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"admin"'},{value:'"editor"'},{value:'"viewer"'}]}},userAvatar:{defaultValue:null,description:"",name:"userAvatar",required:!1,type:{name:"string | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}},enableVoiceChat:{defaultValue:null,description:"",name:"enableVoiceChat",required:!1,type:{name:"boolean | undefined"}},enableScreenSharing:{defaultValue:null,description:"",name:"enableScreenSharing",required:!1,type:{name:"boolean | undefined"}},enableComments:{defaultValue:null,description:"",name:"enableComments",required:!1,type:{name:"boolean | undefined"}},enableVersionControl:{defaultValue:null,description:"",name:"enableVersionControl",required:!1,type:{name:"boolean | undefined"}},enableRealTimeSync:{defaultValue:null,description:"",name:"enableRealTimeSync",required:!1,type:{name:"boolean | undefined"}},layout:{defaultValue:null,description:"",name:"layout",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"split"'},{value:'"tabs"'},{value:'"canvas-focused"'},{value:'"editor-focused"'}]}},theme:{defaultValue:null,description:"",name:"theme",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"auto"'},{value:'"dark"'},{value:'"light"'}]}},showMiniMap:{defaultValue:null,description:"",name:"showMiniMap",required:!1,type:{name:"boolean | undefined"}},showOnlineUsers:{defaultValue:null,description:"",name:"showOnlineUsers",required:!1,type:{name:"boolean | undefined"}},showCursors:{defaultValue:null,description:"",name:"showCursors",required:!1,type:{name:"boolean | undefined"}},enableAdvancedEffects:{defaultValue:null,description:"",name:"enableAdvancedEffects",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:null,description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:null,description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},canvasWidth:{defaultValue:null,description:"",name:"canvasWidth",required:!1,type:{name:"number | undefined"}},canvasHeight:{defaultValue:null,description:"",name:"canvasHeight",required:!1,type:{name:"number | undefined"}},gridSize:{defaultValue:null,description:"",name:"gridSize",required:!1,type:{name:"number | undefined"}},showGrid:{defaultValue:null,description:"",name:"showGrid",required:!1,type:{name:"boolean | undefined"}},showRulers:{defaultValue:null,description:"",name:"showRulers",required:!1,type:{name:"boolean | undefined"}},enableSnapping:{defaultValue:null,description:"",name:"enableSnapping",required:!1,type:{name:"boolean | undefined"}},onWorkspaceReady:{defaultValue:null,description:"",name:"onWorkspaceReady",required:!1,type:{name:"((workspace: WorkspaceSummary) => void) | undefined"}},onUserJoined:{defaultValue:null,description:"",name:"onUserJoined",required:!1,type:{name:"((user: WorkspaceUser) => void) | undefined"}},onUserLeft:{defaultValue:null,description:"",name:"onUserLeft",required:!1,type:{name:"((userId: string) => void) | undefined"}},onElementSelected:{defaultValue:null,description:"",name:"onElementSelected",required:!1,type:{name:"((elementId: string | null) => void) | undefined"}},onError:{defaultValue:null,description:"",name:"onError",required:!1,type:{name:"((error: WorkspaceError) => void) | undefined"}}}}}catch{}try{q.displayName="GlassTeamCursors",q.__docgenInfo={description:"",displayName:"GlassTeamCursors",props:{showNames:{defaultValue:null,description:"",name:"showNames",required:!1,type:{name:"boolean | undefined"}},showVoiceIndicators:{defaultValue:null,description:"",name:"showVoiceIndicators",required:!1,type:{name:"boolean | undefined"}},cursorSize:{defaultValue:null,description:"",name:"cursorSize",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},glassLevel:{defaultValue:null,description:"",name:"glassLevel",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"high"'},{value:'"low"'}]}},contained:{defaultValue:{value:"false"},description:"Render inside a parent cursor layer instead of creating a second overlay.",name:"contained",required:!1,type:{name:"boolean | undefined"}}}}}catch{}try{O.displayName="GlassTeamCursorsWithEffects",O.__docgenInfo={description:"",displayName:"GlassTeamCursorsWithEffects",props:{enableRippleEffect:{defaultValue:null,description:"",name:"enableRippleEffect",required:!1,type:{name:"boolean | undefined"}},enableGlowEffect:{defaultValue:null,description:"",name:"enableGlowEffect",required:!1,type:{name:"boolean | undefined"}},showNames:{defaultValue:null,description:"",name:"showNames",required:!1,type:{name:"boolean | undefined"}},showVoiceIndicators:{defaultValue:null,description:"",name:"showVoiceIndicators",required:!1,type:{name:"boolean | undefined"}},cursorSize:{defaultValue:null,description:"",name:"cursorSize",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},glassLevel:{defaultValue:null,description:"",name:"glassLevel",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"high"'},{value:'"low"'}]}},contained:{defaultValue:null,description:"Render inside a parent cursor layer instead of creating a second overlay.",name:"contained",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const Os=({children:e})=>s.jsxs("div",{className:"collaborative-workspace-story-frame",style:{width:"100%",height:"100dvh",maxHeight:"100vh",minHeight:0,minWidth:0,boxSizing:"border-box",overflow:"hidden",color:"inherit"},children:[e,s.jsx("style",{children:`
      .collaborative-workspace-story-frame .glass-collaborative-workspace.workspace-glass-shell {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2)), rgba(255, 255, 255, 0.28) !important;
        background-color: rgba(255, 255, 255, 0.28) !important;
        color: rgba(15, 23, 42, 0.85) !important;
      }

      .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.24)), rgba(255, 255, 255, 0.3) !important;
        background-color: rgba(255, 255, 255, 0.3) !important;
      }

      .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-inset,
      .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel button,
      .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel .workspace-glass-button {
        background: rgba(255, 255, 255, 0.14) !important;
        background-color: rgba(255, 255, 255, 0.14) !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace.workspace-glass-shell {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.24)), rgba(255, 255, 255, 0.3) !important;
        background-color: rgba(255, 255, 255, 0.3) !important;
        color: rgba(15, 23, 42, 0.85) !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.24)), rgba(255, 255, 255, 0.3) !important;
        background-color: rgba(255, 255, 255, 0.3) !important;
        border-color: rgba(255, 255, 255, 0.32) !important;
        color: rgba(15, 23, 42, 0.85) !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel .glass-text-primary,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel .glass-text-secondary,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel .glass-text-tertiary,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel [class*="glass-text-primary"],
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel [class*="glass-text-secondary"],
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel label,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel div,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel p,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel span {
        color: rgba(15, 23, 42, 0.85) !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-inset,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel button,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel .workspace-glass-button {
        background: rgba(255, 255, 255, 0.18) !important;
        background-color: rgba(255, 255, 255, 0.18) !important;
        border-color: rgba(255, 255, 255, 0.32) !important;
        color: rgba(15, 23, 42, 0.85) !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-button-primary {
        color: rgba(255, 255, 255, 0.95) !important;
      }
    `})]}),Js={title:"Workflows/Collaborative Glass Workspace",component:D,decorators:[e=>s.jsx(Os,{children:s.jsx(e,{})})],parameters:{layout:"fullscreen",previewSurface:"app",docs:{description:{component:"A complete real-time collaborative design environment with multi-user editing, voice chat, version control, and live cursors."}}},argTypes:{layout:{control:{type:"select",options:["split","tabs","canvas-focused","editor-focused"]},description:"Workspace layout mode"},theme:{control:{type:"select",options:["dark","light","auto"]},description:"UI theme preference"},showMiniMap:{control:"boolean",description:"Show workspace minimap"},showOnlineUsers:{control:"boolean",description:"Show online users panel"},showCursors:{control:"boolean",description:"Show collaborative cursors"},enableVoiceChat:{control:"boolean",description:"Enable voice communication"},enableVersionControl:{control:"boolean",description:"Enable version control features"}}},T={args:{workspaceId:"demo-workspace-1",userId:"user-demo-1",userName:"Demo User",userEmail:"demo@example.com",userRole:"admin",layout:"split",theme:"dark",showMiniMap:!0,showOnlineUsers:!0,showCursors:!0,enableVoiceChat:!0,enableVersionControl:!0,canvasWidth:1200,canvasHeight:800}},R={render:()=>s.jsx("div",{className:"glass-relative glass-h-full glass-min-h-80 glass-w-full glass-overflow-hidden glass-radius-3xl glass-neutral-level1","aria-label":"Team cursor collaboration canvas",children:s.jsx(q,{showNames:!0,showVoiceIndicators:!0,glassLevel:"medium"})})},W={render:()=>s.jsx("div",{className:"glass-relative glass-h-full glass-min-h-80 glass-w-full glass-overflow-hidden glass-radius-3xl glass-neutral-level1","aria-label":"Team cursor effects collaboration canvas",children:s.jsx(O,{showNames:!0,showVoiceIndicators:!0,enableRippleEffect:!0,enableGlowEffect:!0})})},L={args:{workspaceId:"design-studio",userId:"designer-1",userName:"Design Pro",userEmail:"designer@studio.com",userRole:"admin",layout:"canvas-focused",theme:"dark",showMiniMap:!0,showOnlineUsers:!0,showCursors:!0,enableVoiceChat:!0,enableVersionControl:!0,enableAdvancedEffects:!0,canvasWidth:1920,canvasHeight:1080,gridSize:15}},z={args:{workspaceId:"code-session",userId:"developer-1",userName:"Code Master",userEmail:"dev@company.com",userRole:"editor",layout:"editor-focused",theme:"dark",showMiniMap:!1,showOnlineUsers:!0,showCursors:!0,enableVoiceChat:!1,enableVersionControl:!0,enableRealTimeSync:!0}},_={args:{workspaceId:"minimal-workspace",userId:"user-minimal",userName:"Minimal User",userEmail:"minimal@example.com",userRole:"viewer",layout:"tabs",theme:"light",showMiniMap:!1,showOnlineUsers:!1,showCursors:!1,enableVoiceChat:!1,enableVersionControl:!1}},G={args:{workspaceId:"voice-workspace",userId:"voice-user",userName:"Voice User",userEmail:"voice@example.com",userRole:"admin",layout:"split",theme:"dark",showMiniMap:!0,showOnlineUsers:!0,showCursors:!0,enableVoiceChat:!0,enableScreenSharing:!0,enableComments:!0,enableVersionControl:!0}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    workspaceId: "demo-workspace-1",
    userId: "user-demo-1",
    userName: "Demo User",
    userEmail: "demo@example.com",
    userRole: "admin",
    layout: "split",
    theme: "dark",
    showMiniMap: true,
    showOnlineUsers: true,
    showCursors: true,
    enableVoiceChat: true,
    enableVersionControl: true,
    canvasWidth: 1200,
    canvasHeight: 800
  }
}`,...T.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => <div className="glass-relative glass-h-full glass-min-h-80 glass-w-full glass-overflow-hidden glass-radius-3xl glass-neutral-level1" aria-label="Team cursor collaboration canvas">
      <GlassTeamCursorsComponent showNames showVoiceIndicators glassLevel="medium" />
    </div>
}`,...R.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: () => <div className="glass-relative glass-h-full glass-min-h-80 glass-w-full glass-overflow-hidden glass-radius-3xl glass-neutral-level1" aria-label="Team cursor effects collaboration canvas">
      <GlassTeamCursorsWithEffectsComponent showNames showVoiceIndicators enableRippleEffect enableGlowEffect />
    </div>
}`,...W.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    workspaceId: "design-studio",
    userId: "designer-1",
    userName: "Design Pro",
    userEmail: "designer@studio.com",
    userRole: "admin",
    layout: "canvas-focused",
    theme: "dark",
    showMiniMap: true,
    showOnlineUsers: true,
    showCursors: true,
    enableVoiceChat: true,
    enableVersionControl: true,
    enableAdvancedEffects: true,
    canvasWidth: 1920,
    canvasHeight: 1080,
    gridSize: 15
  }
}`,...L.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    workspaceId: "code-session",
    userId: "developer-1",
    userName: "Code Master",
    userEmail: "dev@company.com",
    userRole: "editor",
    layout: "editor-focused",
    theme: "dark",
    showMiniMap: false,
    showOnlineUsers: true,
    showCursors: true,
    enableVoiceChat: false,
    enableVersionControl: true,
    enableRealTimeSync: true
  }
}`,...z.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    workspaceId: "minimal-workspace",
    userId: "user-minimal",
    userName: "Minimal User",
    userEmail: "minimal@example.com",
    userRole: "viewer",
    layout: "tabs",
    theme: "light",
    showMiniMap: false,
    showOnlineUsers: false,
    showCursors: false,
    enableVoiceChat: false,
    enableVersionControl: false
  }
}`,..._.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    workspaceId: "voice-workspace",
    userId: "voice-user",
    userName: "Voice User",
    userEmail: "voice@example.com",
    userRole: "admin",
    layout: "split",
    theme: "dark",
    showMiniMap: true,
    showOnlineUsers: true,
    showCursors: true,
    enableVoiceChat: true,
    enableScreenSharing: true,
    enableComments: true,
    enableVersionControl: true
  }
}`,...G.parameters?.docs?.source}}};const Bs=["Default","GlassTeamCursors","GlassTeamCursorsWithEffects","DesignStudio","CodeCollaboration","MinimalWorkspace","VoiceEnabled"];export{z as CodeCollaboration,T as Default,L as DesignStudio,R as GlassTeamCursors,W as GlassTeamCursorsWithEffects,_ as MinimalWorkspace,G as VoiceEnabled,Bs as __namedExportsOrder,Js as default};
