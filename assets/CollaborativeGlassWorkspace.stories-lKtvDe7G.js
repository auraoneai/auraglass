import{j as s,r as c,c as d,g as m}from"./iframe-FdJLCixk.js";import{C as ys}from"./GlassCollaborationProvider-Bv_r4Qs4.js";import{c as z}from"./createLucideIcon-BQ5nBFq9.js";import{M as ns}from"./mic-sUGXDiWe.js";import{M as ks}from"./mic-off-DDMCiP_e.js";import{L as js}from"./layers-BkpcHPOq.js";import{M as Ns,a as is}from"./minimize-BF7AgL-e.js";import{C as Cs}from"./copy-BwN26Al5.js";import{T as Ss}from"./trash-2-BhHqJ6FE.js";import{S as Vs}from"./save-VTuL0zRx.js";import{S as Es}from"./settings-DkHyshc2.js";import"./preload-helper-PPVm8Dsz.js";const Ms=[["path",{d:"M11 14h10",key:"1w8e9d"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v1.344",key:"1e62lh"}],["path",{d:"m17 18 4-4-4-4",key:"z2g111"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113",key:"bjbb7m"}],["rect",{x:"8",y:"2",width:"8",height:"4",rx:"1",key:"ublpy"}]],qs=z("clipboard-paste",Ms);const Is=[["path",{d:"M21 7v6h-6",key:"3ptur4"}],["path",{d:"M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7",key:"1kgawr"}]],cs=z("redo",Is);const Us=[["path",{d:"M3 7v6h6",key:"1v2h90"}],["path",{d:"M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",key:"1r6uu6"}]],gs=z("undo",Us);const _s=[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0",key:"1x1e6c"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}]],Ls=z("wifi",_s);function $(e){return s.jsx(ys,{roomId:e.workspaceId,enableRealTime:e.enableRealTimeSync,children:s.jsx(Rs,{...e})})}function Rs({className:e="",layout:i="split",theme:l="dark",showMiniMap:r=!0,showOnlineUsers:a=!0,showCursors:n=!0,enableAdvancedEffects:o=!0,compact:t=!1,contained:b=!1,maxHeight:u,canvasWidth:v=1200,canvasHeight:w=800,gridSize:y=20,showGrid:k=!0,showRulers:j=!1,enableSnapping:N=!0,enableVoiceChat:p=!1,enableScreenSharing:J=!1,enableComments:C=!0,enableVersionControl:h=!0,enableRealTimeSync:S=!0,onWorkspaceReady:V,onUserJoined:g,onUserLeft:B,onElementSelected:Q,onError:$s,"aria-label":us}){const ps={workspace:{id:"workspace-1",name:"Collaborative Design Session"},currentUser:{id:"user-1",name:"Current User",role:"admin"},onlineUsers:[{id:"user-1",name:"Alice Johnson",role:"admin",avatar:"",color:"var(--glass-color-primary)"},{id:"user-2",name:"Bob Smith",role:"editor",avatar:"",color:"var(--glass-color-success)"},{id:"user-3",name:"Carol Davis",role:"viewer",avatar:"",color:"var(--glass-color-warning)"}],canEdit:!0,isVoiceActive:!1,voiceUsers:[],toggleVoice:()=>{},createSnapshot:()=>{},undo:()=>{},redo:()=>{},canUndo:!0,canRedo:!1},{workspace:E,currentUser:O,onlineUsers:Z,canEdit:ms,isVoiceActive:M,voiceUsers:P,toggleVoice:A,createSnapshot:K,undo:X,redo:Y,canUndo:ss,canRedo:es}=ps,[q,bs]=c.useState(i),[F,fs]=c.useState(null),[as,hs]=c.useState(!t),[xs,Hs]=c.useState(!t),[G,ls]=c.useState(!1),[vs,rs]=c.useState(!1),[ws,ts]=c.useState(!1),f=u??(t||b?260:void 0);c.useEffect(()=>{E&&V?.(E)},[E,V]);const I=c.useCallback(os=>{fs(os),Q?.(os)},[Q]),x=c.useMemo(()=>{switch(q){case"canvas-focused":return{canvasSize:"glass-flex-1",editorSize:"glass-w-80",direction:"row",canvasFirst:!0};case"editor-focused":return{canvasSize:"glass-w-80",editorSize:"glass-flex-1",direction:"row",canvasFirst:!1};case"tabs":return{canvasSize:"glass-w-full",editorSize:"glass-w-full",direction:"col",canvasFirst:!0};default:return{canvasSize:"glass-flex-1",editorSize:"glass-flex-1",direction:"row",canvasFirst:!0}}},[q]);return!E||!O?s.jsx(Fs,{message:"Setting up workspace..."}):s.jsxs("div",{className:d("glass-collaborative-workspace workspace-glass-shell glass-relative glass-flex glass-flex-col glass-surface-overlay",t||b?"glass-h-full glass-min-h-0 glass-overflow-hidden":"glass-h-screen",e),style:{...f!==void 0?{maxHeight:typeof f=="number"?`${f}px`:f,height:typeof f=="number"?`${f}px`:f}:null},role:"main","aria-live":"polite","aria-label":us,children:[s.jsx("style",{children:`
        .glass-collaborative-workspace.workspace-glass-shell {
          background: linear-gradient(135deg, #07111f 0%, #0f172a 44%, #111827 100%), #07111f !important;
          background-color: #07111f !important;
          color: #f8fafc !important;
        }

        .glass-collaborative-workspace .workspace-glass-panel {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.82)), rgba(15, 23, 42, 0.9) !important;
          background-color: rgba(15, 23, 42, 0.9) !important;
          border-color: rgba(148, 163, 184, 0.3) !important;
          color: #f8fafc !important;
        }

        .glass-collaborative-workspace .workspace-glass-panel .glass-text-primary,
        .glass-collaborative-workspace .workspace-glass-panel .glass-text-secondary,
        .glass-collaborative-workspace .workspace-glass-panel .glass-text-tertiary,
        .glass-collaborative-workspace .workspace-glass-panel .glass-text-primary-glass-opacity-60,
        .glass-collaborative-workspace .workspace-glass-panel .glass-text-primary-glass-opacity-80,
        .glass-collaborative-workspace .workspace-glass-panel .glass-text-primary-opacity-70 {
          color: #f8fafc !important;
        }

        .glass-collaborative-workspace .workspace-glass-panel label,
        .glass-collaborative-workspace .workspace-glass-panel p,
        .glass-collaborative-workspace .workspace-glass-panel span {
          color: inherit;
        }

        .glass-collaborative-workspace .workspace-glass-panel button,
        .glass-collaborative-workspace .workspace-glass-panel .workspace-glass-button {
          background-color: rgba(15, 23, 42, 0.68);
          border: 1px solid rgba(148, 163, 184, 0.28);
          color: #f8fafc !important;
        }

        .glass-collaborative-workspace .workspace-glass-panel .glass-surface-primary,
        .glass-collaborative-workspace .workspace-glass-button-primary {
          background: linear-gradient(135deg, rgba(3, 105, 161, 0.96), rgba(29, 78, 216, 0.92)), rgba(3, 105, 161, 0.96) !important;
          background-color: rgba(3, 105, 161, 0.96) !important;
          border-color: rgba(125, 211, 252, 0.42);
        }

        .glass-collaborative-workspace .workspace-glass-inset {
          background: rgba(15, 23, 42, 0.68) !important;
          background-color: rgba(15, 23, 42, 0.68) !important;
          border: 1px solid rgba(148, 163, 184, 0.24) !important;
          color: #f8fafc !important;
        }

        .glass-collaborative-workspace .glass-collaboration-number,
        .glass-collaborative-workspace .glass-collaboration-range {
          appearance: none;
          -webkit-appearance: none;
        }

        .glass-collaborative-workspace .glass-collaboration-number {
          background: rgba(15, 23, 42, 0.72);
          border: 1px solid rgba(148, 163, 184, 0.42);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
          color: #f8fafc;
        }

        .glass-collaborative-workspace .glass-collaboration-number::placeholder {
          color: rgba(226, 232, 240, 0.68);
        }

        .glass-collaborative-workspace .glass-collaboration-number::-webkit-outer-spin-button,
        .glass-collaborative-workspace .glass-collaboration-number::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .glass-collaborative-workspace .glass-collaboration-range {
          height: 0.625rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.42);
          background:
            linear-gradient(90deg, rgba(56, 189, 248, 0.9), rgba(34, 197, 94, 0.5)),
            rgba(15, 23, 42, 0.72);
          box-shadow:
            inset 0 1px 2px rgba(2, 6, 23, 0.28),
            0 1px 0 rgba(255, 255, 255, 0.08);
          cursor: pointer;
        }

        .glass-collaborative-workspace .glass-collaboration-range::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 999px;
          border: 2px solid rgba(248, 250, 252, 0.96);
          background: #38bdf8;
          box-shadow: 0 6px 18px rgba(14, 165, 233, 0.4);
        }

        .glass-collaborative-workspace .glass-collaboration-range::-moz-range-thumb {
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 999px;
          border: 2px solid rgba(248, 250, 252, 0.96);
          background: #38bdf8;
          box-shadow: 0 6px 18px rgba(14, 165, 233, 0.4);
        }
      `}),xs&&s.jsx(Ts,{workspace:E,currentUser:O,onlineUsers:Z,canEdit:ms,isVoiceActive:M,voiceUsers:P,onToggleVoice:A,onCreateSnapshot:K,onUndo:X,onRedo:Y,canUndo:ss,canRedo:es,onLayoutChange:bs,activeLayout:q,onToggleSidebar:()=>hs(!as),onToggleFullscreen:()=>ls(!G),isFullscreen:G,showOnlineUsers:a,enableVoiceChat:p,enableVersionControl:h}),s.jsxs("div",{className:d("glass-flex-1 glass-flex glass-min-h-0",x.direction==="col"?"glass-flex-col":"glass-flex-row"),children:[q==="tabs"?s.jsx(Ws,{selectedElementId:F,onElementSelect:I,width:v,height:w,gridSize:y,showGrid:k,showRulers:j,enableSnapping:N,enableComments:C,enableRealTimeSync:S}):s.jsxs(s.Fragment,{children:[x.canvasFirst&&s.jsx("div",{className:d(x.canvasSize,"glass-min-w-0 glass-p-4"),children:s.jsx(H,{width:v,height:w,gridSize:y,showGrid:k,showRulers:j,enableSnapping:N,onElementSelect:I,className:d("glass-h-full")})}),!t&&s.jsx("div",{className:d(x.editorSize,"glass-min-w-0 glass-p-4"),children:s.jsx(ds,{target:F||"global",showPreview:!0,showHistory:h,showComments:C,enableRealTimeSync:S,layout:"vertical",className:"glass-h-full"})}),!x.canvasFirst&&s.jsx("div",{className:d(x.canvasSize,"glass-min-w-0 glass-p-4"),children:s.jsx(H,{width:v,height:w,gridSize:y,showGrid:k,showRulers:j,enableSnapping:N,onElementSelect:I,className:d("glass-h-full")})})]}),as&&s.jsx(zs,{selectedElementId:F,onElementSelect:I,showMiniMap:r,showOnlineUsers:a,onlineUsers:Z,currentUser:O,isVoiceActive:M,voiceUsers:P,enableComments:C})]}),!t&&n&&(o?s.jsx(D,{showNames:!0,showVoiceIndicators:p,cursorSize:"md",glassLevel:"medium",enableRippleEffect:!0,enableGlowEffect:!0}):s.jsx(W,{showNames:!0,showVoiceIndicators:p,cursorSize:"md",glassLevel:"medium"})),!t&&vs&&p&&s.jsx(Os,{isActive:M,voiceUsers:P,onClose:()=>rs(!1),onToggleVoice:A}),!t&&ws&&h&&s.jsx(Ps,{onClose:()=>ts(!1),onCreateSnapshot:K,canUndo:ss,canRedo:es,onUndo:X,onRedo:Y}),s.jsx(As,{isVoiceActive:M,onToggleVoice:A,onShowVoicePanel:()=>rs(!0),onShowVersionPanel:()=>ts(!0),onToggleFullscreen:()=>ls(!G),enableVoiceChat:p,enableVersionControl:h})]})}function Ts({workspace:e,currentUser:i,onlineUsers:l,canEdit:r,isVoiceActive:a,voiceUsers:n,onToggleVoice:o,onCreateSnapshot:t,onUndo:b,onRedo:u,canUndo:v,canRedo:w,onLayoutChange:y,activeLayout:k,onToggleSidebar:j,onToggleFullscreen:N,isFullscreen:p,showOnlineUsers:J,enableVoiceChat:C,enableVersionControl:h}){const[S,V]=c.useState(!1);return s.jsxs("div",{className:"workspace-header workspace-glass-panel glass-flex glass-items-center glass-justify-between glass-px-4 glass-py-3 glass-border-b glass-border-white/10",style:m({intent:"neutral",elevation:"level2"}),children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-4",children:[s.jsx("h1",{className:"glass-text-xl glass-font-bold glass-text-primary",children:e.name}),s.jsx("div",{className:"glass-text-sm glass-text-primary",style:{opacity:"var(--glass-opacity-60)"},children:r?"✏️ Editing":"👁️ Viewing"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[h&&s.jsxs(s.Fragment,{children:[s.jsx("button",{onClick:b,disabled:!v,className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary glass-focus glass-touch-target glass-contrast-guard",style:{opacity:"var(--glass-opacity-50)"},title:"Undo","aria-label":"Undo last action",children:s.jsx(gs,{className:"glass-w-4 glass-h-4"})}),s.jsx("button",{onClick:u,disabled:!w,className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary glass-focus glass-touch-target glass-contrast-guard",style:{opacity:"var(--glass-opacity-50)"},title:"Redo","aria-label":"Redo last action",children:s.jsx(cs,{className:"glass-w-4 glass-h-4"})}),s.jsx("button",{onClick:()=>t(`Snapshot ${Date.now()}`),className:"workspace-glass-button-primary glass-px-3 glass-py-2 glass-text-sm glass-surface-primary glass-text-primary glass-radius",title:"Create Snapshot",children:"📷 Snapshot"})]}),s.jsxs("div",{className:"glass-relative",children:[s.jsx("button",{onClick:()=>V(!S),className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary",title:"Change Layout","aria-label":"Change workspace layout",children:"🔀"}),S&&s.jsx("div",{className:"glass-absolute glass-top-full glass-left-0 glass-mt-2 glass-p-2 glass-surface-overlay glass-border glass-border-white/20 glass-radius glass-shadow-lg glass-z-50",children:["split","tabs","canvas-focused","editor-focused"].map(g=>s.jsx("button",{onClick:()=>{y(g),V(!1)},className:d("glass-block glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-radius glass-text-primary",k===g?"glass-surface-primary":"glass-surface-transparent"),children:g.charAt(0).toUpperCase()+g.slice(1).replace("-"," ")},g))})]}),C&&s.jsxs("button",{onClick:o,className:d("glass-p-2 glass-radius glass-text-primary",a?"glass-surface-success":"glass-surface-transparent"),title:a?"Leave Voice Chat":"Join Voice Chat","aria-label":a?"Leave voice chat":"Join voice chat",children:[a?s.jsx(ns,{className:"glass-w-4 glass-h-4"}):s.jsx(ks,{className:"glass-w-4 glass-h-4"}),n.length>0&&` (${n.length})`]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[J&&s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsxs("div",{className:"glass-flex",children:[l.slice(0,5).map((g,B)=>s.jsx("div",{className:"glass-w-8 glass-h-8 glass-radius-full glass-border-2 glass-border-white glass-flex glass-items-center glass-justify-center glass-text-xs glass-font-bold glass-text-primary",style:{backgroundColor:g.color,marginLeft:B===0?0:-8},title:g.name,children:g.name[0]},g.id)),l.length>5&&s.jsxs("div",{className:"glass-w-8 glass-h-8 glass-radius-full glass-surface-primary glass-border-2 glass-border-white glass-flex glass-items-center glass-justify-center glass-text-xs glass-text-primary",children:["+",l.length-5]})]}),s.jsxs("span",{className:"glass-text-sm glass-text-primary",style:{opacity:"var(--glass-opacity-60)"},children:[l.length," online"]})]}),s.jsx("button",{onClick:j,className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",title:"Toggle Sidebar","aria-label":"Toggle sidebar",children:s.jsx(js,{className:"glass-w-4 glass-h-4"})}),s.jsx("button",{onClick:N,className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",title:"Toggle Fullscreen","aria-label":p?"Exit fullscreen":"Enter fullscreen",children:p?s.jsx(Ns,{className:"glass-w-4 glass-h-4"}):s.jsx(is,{className:"glass-w-4 glass-h-4"})})]})]})}function Ws({selectedElementId:e,onElementSelect:i,enableComments:l,enableRealTimeSync:r,...a}){const[n,o]=c.useState("canvas");return s.jsxs("div",{className:"glass-flex glass-flex-col glass-h-full",children:[s.jsxs("div",{className:"glass-flex glass-border-b glass-border-white/20 glass-surface-overlay",children:[s.jsx("button",{onClick:()=>o("canvas"),className:`glass-px-6 glass-py-3 glass-font-medium ${n==="canvas"?"glass-text-white glass-border-b-2 glass-border-blue-400 glass-surface-overlay":"glass-text-white-opacity-70 glass-hover-text-white"}`,children:"🎨 Canvas"}),s.jsx("button",{onClick:()=>o("editor"),className:`glass-px-6 glass-py-3 glass-font-medium ${n==="editor"?"glass-text-white glass-border-b-2 glass-border-blue-400 glass-surface-overlay":"glass-text-white-opacity-70 glass-hover-text-white"}`,children:"⚙️ Properties"})]}),s.jsx("div",{className:"glass-flex-1 glass-p-4",children:n==="canvas"?s.jsx(H,{...a,onElementSelect:i,className:"glass-h-full"}):s.jsx(ds,{showComments:l,enableRealTimeSync:r,className:"glass-h-full"})})]})}function H({width:e,height:i,gridSize:l,showGrid:r,showRulers:a,enableSnapping:n,onElementSelect:o,className:t}){return s.jsxs("div",{className:`collaborative-canvas workspace-glass-panel relative ${t}`,style:m({intent:"neutral",elevation:"level2"}),children:[r&&s.jsx("div",{className:"glass-absolute glass-inset-0 glass-opacity-20",style:{backgroundImage:"linear-gradient(var(--glass-bg-default) 1px, transparent 1px), linear-gradient(90deg, var(--glass-bg-default) 1px, transparent 1px)",backgroundSize:`${l}px ${l}px`}}),s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full glass-text-primary-glass-opacity-60",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"🎨"}),s.jsx("p",{className:"glass-text-lg",children:"Collaborative Canvas"}),s.jsx("p",{className:"glass-text-sm",children:"Click to start designing together"})]})})]})}function ds({target:e,showPreview:i,showHistory:l,showComments:r,enableRealTimeSync:a,layout:n,className:o}){return s.jsx("div",{className:`multi-user-editor workspace-glass-panel ${o}`,style:m({intent:"neutral",elevation:"level2"}),children:s.jsxs("div",{className:"glass-p-4",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h2",{className:"glass-text-primary glass-font-semibold",children:"Properties Editor"}),s.jsxs("div",{className:"glass-flex glass-gap-2",children:[l&&s.jsx("button",{className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary",children:"📜"}),r&&s.jsx("button",{className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary",children:"💬"}),a&&s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1 glass-text-primary glass-text-sm",children:[s.jsx(Ls,{className:"glass-w-3 glass-h-3"})," Live"]})]})]}),s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2",children:"Target Element"}),s.jsx("div",{className:"workspace-glass-inset glass-p-2 glass-surface-subtle/5 glass-radius glass-text-primary glass-text-sm",children:e})]}),s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2",children:"Properties"}),s.jsxs("div",{className:"glass-space-y-2",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60 glass-text-sm glass-w-20",children:"Width:"}),s.jsx("input",{type:"number","data-glass-component":"number",className:"glass-collaboration-number glass-flex-1 glass-p-2 glass-surface-subtle/10 glass-radius glass-text-primary glass-text-sm glass-touch-target glass-contrast-guard",placeholder:"Auto","aria-label":"Width"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60 glass-text-sm glass-w-20",children:"Height:"}),s.jsx("input",{type:"number","data-glass-component":"number",className:"glass-collaboration-number glass-flex-1 glass-p-2 glass-surface-subtle/10 glass-radius glass-text-primary glass-text-sm glass-touch-target glass-contrast-guard",placeholder:"Auto","aria-label":"Height"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60 glass-text-sm glass-w-20",children:"Opacity:"}),s.jsx("input",{type:"range","data-glass-component":"range",min:"0",max:"1",step:"0.1",className:"glass-collaboration-range glass-flex-1 glass-touch-target glass-contrast-guard","aria-label":"Opacity"})]})]})]})]})]})})}function zs({selectedElementId:e,onElementSelect:i,showMiniMap:l,showOnlineUsers:r,onlineUsers:a,currentUser:n,isVoiceActive:o,voiceUsers:t,enableComments:b}){return s.jsxs("div",{className:"workspace-sidebar workspace-glass-panel glass-w-80 glass-border-l glass-border-white/20 glass-p-4 glass-space-y-4",style:m({intent:"neutral",elevation:"level2"}),children:[l&&s.jsxs("div",{className:"glass-space-y-2",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-80 glass-uppercase",children:"Mini Map"}),s.jsx("div",{className:"workspace-glass-inset glass-aspect-video glass-surface-overlay glass-border glass-border-white/20 glass-radius glass-p-2",children:s.jsx("div",{className:"glass-text-xs glass-text-primary glass-text-center glass-mt-8",children:"Canvas overview"})})]}),r&&s.jsxs("div",{className:"glass-space-y-2",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-80 glass-uppercase",children:"Online Users"}),s.jsx("div",{className:"glass-space-y-2",children:a.map(u=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 glass-p-2 glass-radius hover:glass-surface-subtle/5",children:[s.jsx("div",{className:"glass-w-6 glass-h-6 glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs glass-font-bold glass-text-primary",style:{backgroundColor:u.color},children:u.name[0]}),s.jsxs("div",{className:"glass-flex-1",children:[s.jsx("div",{className:"glass-text-sm glass-text-primary",children:u.name}),s.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-50",children:u.role})]}),t.includes(u.id)&&s.jsx("div",{className:"glass-text-primary glass-text-xs",children:"🎤"})]},u.id))})]}),s.jsxs("div",{className:"glass-space-y-2",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-80 glass-uppercase",children:"Quick Actions"}),s.jsxs("div",{className:"glass-space-y-2",children:[s.jsxs("button",{className:"glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-radius glass-text-primary",children:[s.jsx(Cs,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-2"}),"Copy Selected"]}),s.jsxs("button",{className:"glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-radius glass-text-primary",children:[s.jsx(qs,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-2"}),"Paste"]}),s.jsxs("button",{className:"glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-radius glass-text-primary",children:[s.jsx(Ss,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-2"}),"Delete Selected"]})]})]})]})}function W({showNames:e,showVoiceIndicators:i,cursorSize:l,glassLevel:r}){const a=l==="lg"?18:l==="sm"?12:15,n=[{id:"aurora",name:"Aurora",color:"#38bdf8",x:"24%",y:"34%"},{id:"lumen",name:"Lumen",color:"#c084fc",x:"58%",y:"48%"},{id:"orbit",name:"Orbit",color:"#facc15",x:"72%",y:"26%"}];return s.jsx("div",{className:"glass-pointer-events-none glass-absolute glass-inset-0 glass-z-30",children:n.map(o=>s.jsxs("div",{className:"glass-absolute glass-flex glass-items-start glass-gap-1.5",style:{left:o.x,top:o.y},children:[s.jsx("svg",{width:a,height:Math.round(a*1.32),viewBox:"0 0 18 24","aria-hidden":"true",style:{color:o.color,filter:r==="high"?`drop-shadow(0 0 12px ${o.color})`:"drop-shadow(0 4px 10px rgba(0,0,0,0.35))"},children:s.jsx("path",{d:"M2 2L16 14.5L10.3 15.2L7.4 22L2 2Z",fill:"currentColor",stroke:"rgba(255,255,255,0.88)",strokeWidth:"1.4",strokeLinejoin:"round"})}),e&&s.jsxs("span",{className:"glass-radius-full glass-px-2 glass-py-0.5 glass-text-xs glass-font-medium glass-text-primary glass-shadow-lg glass-backdrop-blur-md",style:{...m({intent:"neutral",elevation:"level2"}),border:`1px solid ${o.color}`},children:[o.name,i?" mic":""]})]},o.id))})}function D({showNames:e,showVoiceIndicators:i,cursorSize:l,glassLevel:r,enableRippleEffect:a,enableGlowEffect:n}){return s.jsxs(s.Fragment,{children:[a&&s.jsxs(s.Fragment,{children:[s.jsx("span",{className:"glass-pointer-events-none glass-absolute glass-z-20 glass-radius-full",style:{left:"48%",top:"52%",width:72,height:72,border:"1px solid rgba(56,189,248,0.42)",boxShadow:"0 0 38px rgba(56,189,248,0.16)",transform:"translate(-50%, -50%)"}}),s.jsx("span",{className:"glass-pointer-events-none glass-absolute glass-z-20 glass-radius-full",style:{left:"48%",top:"52%",width:34,height:34,border:"1px solid rgba(192,132,252,0.5)",transform:"translate(-50%, -50%)"}})]}),s.jsx(W,{showNames:e,showVoiceIndicators:i,cursorSize:l,glassLevel:n?"high":r})]})}function Os({isActive:e,voiceUsers:i,onClose:l,onToggleVoice:r}){return s.jsxs("div",{className:"glass-fixed glass-bottom-4 glass-right-4 glass-w-80 glass-p-4 glass-radius-lg glass-border glass-border-white/20",style:m({intent:"neutral",elevation:"level2"}),children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h3",{className:"glass-text-primary glass-font-semibold",children:"Voice Chat"}),s.jsx("button",{onClick:l,className:"glass-contrast-guard glass-focus glass-touch-target hover:glass-text-primary glass-text-primary-opacity-70","aria-label":"Close voice chat panel",children:"✕"})]}),s.jsx("div",{className:"glass-space-y-2 glass-mb-4",children:i.map(a=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-text-primary glass-text-sm",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse"}),"User ",a]},a))}),s.jsxs("button",{onClick:r,className:d("glass-w-full glass-py-2 glass-radius glass-text-primary glass-transition",e?"glass-surface-danger":"glass-surface-success"),children:[e?"🔇 Leave":"🎤 Join"," Voice Chat"]})]})}function Ps({onClose:e,onCreateSnapshot:i,canUndo:l,canRedo:r,onUndo:a,onRedo:n}){return s.jsxs("div",{className:"glass-fixed glass-bottom-4 glass-left-4 glass-w-80 glass-p-4 glass-radius-lg glass-border glass-border-white/20",style:m({intent:"neutral",elevation:"level2"}),children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h3",{className:"glass-text-primary glass-font-semibold",children:"Version Control"}),s.jsx("button",{onClick:e,className:"glass-contrast-guard glass-focus glass-touch-target hover:glass-text-primary glass-text-primary-opacity-70","aria-label":"Close version control panel",children:"✕"})]}),s.jsxs("div",{className:"glass-space-y-2",children:[s.jsxs("div",{className:"glass-flex glass-gap-2",children:[s.jsxs("button",{onClick:a,disabled:!l,className:"glass-flex-1 glass-py-2 glass-px-3 glass-radius glass-surface-subtle/10 glass-text-primary disabled:glass-opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:[s.jsx(gs,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-1"}),"Undo"]}),s.jsxs("button",{onClick:n,disabled:!r,className:"glass-flex-1 glass-py-2 glass-px-3 glass-radius glass-surface-subtle/10 glass-text-primary disabled:glass-opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:[s.jsx(cs,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-1"}),"Redo"]})]}),s.jsxs("button",{onClick:()=>i(`Manual snapshot ${Date.now()}`),className:"glass-w-full glass-py-2 glass-px-3 glass-radius glass-surface-primary glass-text-primary",children:[s.jsx(Vs,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-1"}),"Create Snapshot"]})]})]})}function As({isVoiceActive:e,onToggleVoice:i,onShowVoicePanel:l,onShowVersionPanel:r,onToggleFullscreen:a,enableVoiceChat:n,enableVersionControl:o}){const[t,b]=c.useState(!1);return s.jsxs("div",{className:"glass-fixed glass-bottom-6 glass-right-6",children:[s.jsxs("div",{className:d("glass-flex glass-flex-col glass-gap-2",!t&&"glass-pointer-events-none"),style:{opacity:t?1:0,pointerEvents:t?"auto":"none",transition:"opacity 160ms ease"},children:[n&&s.jsx("button",{onClick:l,className:"glass-w-12 glass-h-12 glass-radius-full glass-surface-success glass-text-primary glass-flex glass-items-center glass-justify-center glass-shadow-lg glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",title:"Voice Chat","aria-label":"Open voice chat panel",children:s.jsx(ns,{className:"glass-w-4 glass-h-4"})}),o&&s.jsx("button",{onClick:r,className:"glass-w-12 glass-h-12 glass-radius-full glass-surface-primary glass-text-primary glass-flex glass-items-center glass-justify-center glass-shadow-lg glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",title:"Version Control","aria-label":"Open version control panel",children:s.jsx(Es,{className:"glass-w-4 glass-h-4"})}),s.jsx("button",{onClick:a,className:"glass-w-12 glass-h-12 glass-radius-full glass-surface-primary glass-text-primary glass-flex glass-items-center glass-justify-center glass-shadow-lg hover:glass-surface-subtle glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",title:"Fullscreen","aria-label":"Toggle fullscreen mode",children:s.jsx(is,{className:"glass-w-4 glass-h-4"})})]}),s.jsx("button",{onClick:()=>b(!t),className:"glass-w-14 glass-h-14 glass-radius-full glass-surface-overlay glass-text-primary glass-flex glass-items-center glass-justify-center glass-shadow-lg glass-hover-bg-slate-600 glass-mt-2",style:m({intent:"neutral",elevation:"level2"}),"aria-label":t?"Close floating actions menu":"Open floating actions menu",children:t?"✕":"⚡"})]})}function Fs({message:e="Connecting to workspace..."}){return s.jsx("div",{className:"glass-h-screen glass-flex glass-items-center glass-justify-center glass-surface-overlay",children:s.jsxs("div",{className:"glass-text-center glass-space-y-4",children:[s.jsx("div",{className:"glass-w-16 glass-h-16 glass-border-4 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin glass-mx-auto"}),s.jsx("div",{className:"glass-text-primary glass-text-lg",children:e}),s.jsx("div",{className:"glass-text-primary-glass-opacity-60 glass-text-sm",children:"Please wait..."})]})})}try{$.displayName="CollaborativeGlassWorkspace",$.__docgenInfo={description:"",displayName:"CollaborativeGlassWorkspace",props:{workspaceId:{defaultValue:null,description:"",name:"workspaceId",required:!0,type:{name:"string"}},userId:{defaultValue:null,description:"",name:"userId",required:!0,type:{name:"string"}},userName:{defaultValue:null,description:"",name:"userName",required:!0,type:{name:"string"}},userEmail:{defaultValue:null,description:"",name:"userEmail",required:!0,type:{name:"string"}},userRole:{defaultValue:null,description:"",name:"userRole",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"admin"'},{value:'"editor"'},{value:'"viewer"'}]}},userAvatar:{defaultValue:null,description:"",name:"userAvatar",required:!1,type:{name:"string | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}},enableVoiceChat:{defaultValue:null,description:"",name:"enableVoiceChat",required:!1,type:{name:"boolean | undefined"}},enableScreenSharing:{defaultValue:null,description:"",name:"enableScreenSharing",required:!1,type:{name:"boolean | undefined"}},enableComments:{defaultValue:null,description:"",name:"enableComments",required:!1,type:{name:"boolean | undefined"}},enableVersionControl:{defaultValue:null,description:"",name:"enableVersionControl",required:!1,type:{name:"boolean | undefined"}},enableRealTimeSync:{defaultValue:null,description:"",name:"enableRealTimeSync",required:!1,type:{name:"boolean | undefined"}},layout:{defaultValue:null,description:"",name:"layout",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"split"'},{value:'"tabs"'},{value:'"canvas-focused"'},{value:'"editor-focused"'}]}},theme:{defaultValue:null,description:"",name:"theme",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"auto"'},{value:'"dark"'},{value:'"light"'}]}},showMiniMap:{defaultValue:null,description:"",name:"showMiniMap",required:!1,type:{name:"boolean | undefined"}},showOnlineUsers:{defaultValue:null,description:"",name:"showOnlineUsers",required:!1,type:{name:"boolean | undefined"}},showCursors:{defaultValue:null,description:"",name:"showCursors",required:!1,type:{name:"boolean | undefined"}},enableAdvancedEffects:{defaultValue:null,description:"",name:"enableAdvancedEffects",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:null,description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:null,description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},canvasWidth:{defaultValue:null,description:"",name:"canvasWidth",required:!1,type:{name:"number | undefined"}},canvasHeight:{defaultValue:null,description:"",name:"canvasHeight",required:!1,type:{name:"number | undefined"}},gridSize:{defaultValue:null,description:"",name:"gridSize",required:!1,type:{name:"number | undefined"}},showGrid:{defaultValue:null,description:"",name:"showGrid",required:!1,type:{name:"boolean | undefined"}},showRulers:{defaultValue:null,description:"",name:"showRulers",required:!1,type:{name:"boolean | undefined"}},enableSnapping:{defaultValue:null,description:"",name:"enableSnapping",required:!1,type:{name:"boolean | undefined"}},onWorkspaceReady:{defaultValue:null,description:"",name:"onWorkspaceReady",required:!1,type:{name:"((workspace: WorkspaceSummary) => void) | undefined"}},onUserJoined:{defaultValue:null,description:"",name:"onUserJoined",required:!1,type:{name:"((user: WorkspaceUser) => void) | undefined"}},onUserLeft:{defaultValue:null,description:"",name:"onUserLeft",required:!1,type:{name:"((userId: string) => void) | undefined"}},onElementSelected:{defaultValue:null,description:"",name:"onElementSelected",required:!1,type:{name:"((elementId: string | null) => void) | undefined"}},onError:{defaultValue:null,description:"",name:"onError",required:!1,type:{name:"((error: WorkspaceError) => void) | undefined"}}}}}catch{}try{W.displayName="GlassTeamCursors",W.__docgenInfo={description:"",displayName:"GlassTeamCursors",props:{showNames:{defaultValue:null,description:"",name:"showNames",required:!1,type:{name:"boolean | undefined"}},showVoiceIndicators:{defaultValue:null,description:"",name:"showVoiceIndicators",required:!1,type:{name:"boolean | undefined"}},cursorSize:{defaultValue:null,description:"",name:"cursorSize",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},glassLevel:{defaultValue:null,description:"",name:"glassLevel",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"high"'},{value:'"low"'}]}}}}}catch{}try{D.displayName="GlassTeamCursorsWithEffects",D.__docgenInfo={description:"",displayName:"GlassTeamCursorsWithEffects",props:{enableRippleEffect:{defaultValue:null,description:"",name:"enableRippleEffect",required:!1,type:{name:"boolean | undefined"}},enableGlowEffect:{defaultValue:null,description:"",name:"enableGlowEffect",required:!1,type:{name:"boolean | undefined"}},showNames:{defaultValue:null,description:"",name:"showNames",required:!1,type:{name:"boolean | undefined"}},showVoiceIndicators:{defaultValue:null,description:"",name:"showVoiceIndicators",required:!1,type:{name:"boolean | undefined"}},cursorSize:{defaultValue:null,description:"",name:"cursorSize",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},glassLevel:{defaultValue:null,description:"",name:"glassLevel",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"high"'},{value:'"low"'}]}}}}}catch{}const Gs=({children:e})=>s.jsxs("div",{className:"collaborative-workspace-story-frame",style:{width:"100%",height:"100dvh",maxHeight:"100vh",minHeight:0,minWidth:0,boxSizing:"border-box",overflow:"hidden",color:"inherit"},children:[e,s.jsx("style",{children:`
      .collaborative-workspace-story-frame .glass-collaborative-workspace.workspace-glass-shell {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.76), rgba(30, 41, 59, 0.68)), rgba(15, 23, 42, 0.76) !important;
        background-color: rgba(15, 23, 42, 0.76) !important;
        color: #f8fafc !important;
      }

      .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.78), rgba(30, 41, 59, 0.7)), rgba(15, 23, 42, 0.78) !important;
        background-color: rgba(15, 23, 42, 0.78) !important;
      }

      .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-inset,
      .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel button,
      .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel .workspace-glass-button {
        background: rgba(15, 23, 42, 0.7) !important;
        background-color: rgba(15, 23, 42, 0.7) !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace.workspace-glass-shell {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.52), rgba(226, 232, 240, 0.42)), rgba(255, 255, 255, 0.46) !important;
        background-color: rgba(255, 255, 255, 0.46) !important;
        color: #0f172a !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.68), rgba(226, 232, 240, 0.54)), rgba(255, 255, 255, 0.62) !important;
        background-color: rgba(255, 255, 255, 0.62) !important;
        border-color: rgba(15, 23, 42, 0.16) !important;
        color: #0f172a !important;
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
        color: #0f172a !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-inset,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel button,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel .workspace-glass-button {
        background: rgba(255, 255, 255, 0.62) !important;
        background-color: rgba(255, 255, 255, 0.62) !important;
        border-color: rgba(15, 23, 42, 0.18) !important;
        color: #0f172a !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-button-primary {
        color: #f8fafc !important;
      }
    `})]}),re={title:"Workflows/Collaborative Glass Workspace",component:$,decorators:[e=>s.jsx(Gs,{children:s.jsx(e,{})})],parameters:{layout:"fullscreen",previewSurface:"app",docs:{description:{component:"A complete real-time collaborative design environment with multi-user editing, voice chat, version control, and live cursors."}}},argTypes:{layout:{control:{type:"select",options:["split","tabs","canvas-focused","editor-focused"]},description:"Workspace layout mode"},theme:{control:{type:"select",options:["dark","light","auto"]},description:"UI theme preference"},showMiniMap:{control:"boolean",description:"Show workspace minimap"},showOnlineUsers:{control:"boolean",description:"Show online users panel"},showCursors:{control:"boolean",description:"Show collaborative cursors"},enableVoiceChat:{control:"boolean",description:"Enable voice communication"},enableVersionControl:{control:"boolean",description:"Enable version control features"}}},U={args:{workspaceId:"demo-workspace-1",userId:"user-demo-1",userName:"Demo User",userEmail:"demo@example.com",userRole:"admin",layout:"split",theme:"dark",showMiniMap:!0,showOnlineUsers:!0,showCursors:!0,enableVoiceChat:!0,enableVersionControl:!0,canvasWidth:1200,canvasHeight:800}},_={args:{workspaceId:"design-studio",userId:"designer-1",userName:"Design Pro",userEmail:"designer@studio.com",userRole:"admin",layout:"canvas-focused",theme:"dark",showMiniMap:!0,showOnlineUsers:!0,showCursors:!0,enableVoiceChat:!0,enableVersionControl:!0,enableAdvancedEffects:!0,canvasWidth:1920,canvasHeight:1080,gridSize:15}},L={args:{workspaceId:"code-session",userId:"developer-1",userName:"Code Master",userEmail:"dev@company.com",userRole:"editor",layout:"editor-focused",theme:"dark",showMiniMap:!1,showOnlineUsers:!0,showCursors:!0,enableVoiceChat:!1,enableVersionControl:!0,enableRealTimeSync:!0}},R={args:{workspaceId:"minimal-workspace",userId:"user-minimal",userName:"Minimal User",userEmail:"minimal@example.com",userRole:"viewer",layout:"tabs",theme:"light",showMiniMap:!1,showOnlineUsers:!1,showCursors:!1,enableVoiceChat:!1,enableVersionControl:!1}},T={args:{workspaceId:"voice-workspace",userId:"voice-user",userName:"Voice User",userEmail:"voice@example.com",userRole:"admin",layout:"split",theme:"dark",showMiniMap:!0,showOnlineUsers:!0,showCursors:!0,enableVoiceChat:!0,enableScreenSharing:!0,enableComments:!0,enableVersionControl:!0}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    workspaceId: 'demo-workspace-1',
    userId: 'user-demo-1',
    userName: 'Demo User',
    userEmail: 'demo@example.com',
    userRole: 'admin',
    layout: 'split',
    theme: 'dark',
    showMiniMap: true,
    showOnlineUsers: true,
    showCursors: true,
    enableVoiceChat: true,
    enableVersionControl: true,
    canvasWidth: 1200,
    canvasHeight: 800
  }
}`,...U.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    workspaceId: 'design-studio',
    userId: 'designer-1',
    userName: 'Design Pro',
    userEmail: 'designer@studio.com',
    userRole: 'admin',
    layout: 'canvas-focused',
    theme: 'dark',
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
}`,..._.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    workspaceId: 'code-session',
    userId: 'developer-1',
    userName: 'Code Master',
    userEmail: 'dev@company.com',
    userRole: 'editor',
    layout: 'editor-focused',
    theme: 'dark',
    showMiniMap: false,
    showOnlineUsers: true,
    showCursors: true,
    enableVoiceChat: false,
    enableVersionControl: true,
    enableRealTimeSync: true
  }
}`,...L.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    workspaceId: 'minimal-workspace',
    userId: 'user-minimal',
    userName: 'Minimal User',
    userEmail: 'minimal@example.com',
    userRole: 'viewer',
    layout: 'tabs',
    theme: 'light',
    showMiniMap: false,
    showOnlineUsers: false,
    showCursors: false,
    enableVoiceChat: false,
    enableVersionControl: false
  }
}`,...R.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    workspaceId: 'voice-workspace',
    userId: 'voice-user',
    userName: 'Voice User',
    userEmail: 'voice@example.com',
    userRole: 'admin',
    layout: 'split',
    theme: 'dark',
    showMiniMap: true,
    showOnlineUsers: true,
    showCursors: true,
    enableVoiceChat: true,
    enableScreenSharing: true,
    enableComments: true,
    enableVersionControl: true
  }
}`,...T.parameters?.docs?.source}}};const te=["Default","DesignStudio","CodeCollaboration","MinimalWorkspace","VoiceEnabled"];export{L as CodeCollaboration,U as Default,_ as DesignStudio,R as MinimalWorkspace,T as VoiceEnabled,te as __namedExportsOrder,re as default};
