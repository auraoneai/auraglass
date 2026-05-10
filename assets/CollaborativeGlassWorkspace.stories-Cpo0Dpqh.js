import{j as s,r as i,c as b,g as h}from"./iframe-CmCTHNdg.js";import{C as xs}from"./GlassCollaborationProvider-BHTw009f.js";import{c as R}from"./createLucideIcon-CTGDdcyK.js";import{M as rs}from"./mic-C8glYkkY.js";import{M as vs}from"./mic-off-50UPOjLZ.js";import{L as ws}from"./layers-BbZFtvSA.js";import{M as ys,a as ts}from"./minimize-Ckc9r8Ih.js";import{C as ks}from"./copy-B52kIDMw.js";import{T as js}from"./trash-2-BRaN3pVG.js";import{S as Ns}from"./save-BPBrFaw1.js";import{S as Cs}from"./settings-BQa8lI6C.js";import"./preload-helper-PPVm8Dsz.js";const Ss=[["path",{d:"M11 14h10",key:"1w8e9d"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v1.344",key:"1e62lh"}],["path",{d:"m17 18 4-4-4-4",key:"z2g111"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113",key:"bjbb7m"}],["rect",{x:"8",y:"2",width:"8",height:"4",rx:"1",key:"ublpy"}]],Vs=R("clipboard-paste",Ss);const Es=[["path",{d:"M21 7v6h-6",key:"3ptur4"}],["path",{d:"M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7",key:"1kgawr"}]],os=R("redo",Es);const Ms=[["path",{d:"M3 7v6h6",key:"1v2h90"}],["path",{d:"M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",key:"1r6uu6"}]],ns=R("undo",Ms);const qs=[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0",key:"1x1e6c"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}]],Is=R("wifi",qs);function G(e){return s.jsx(xs,{roomId:e.workspaceId,enableRealTime:e.enableRealTimeSync,children:s.jsx(Us,{...e})})}function Us({className:e="",layout:o="split",theme:a="dark",showMiniMap:r=!0,showOnlineUsers:l=!0,showCursors:t=!0,enableAdvancedEffects:c=!0,canvasWidth:n=1200,canvasHeight:u=800,gridSize:g=20,showGrid:x=!0,showRulers:v=!1,enableSnapping:w=!0,enableVoiceChat:p=!1,enableScreenSharing:D=!1,enableComments:y=!0,enableVersionControl:m=!0,enableRealTimeSync:N=!0,onWorkspaceReady:C,onUserJoined:H,onUserLeft:T,onElementSelected:k,onError:d,"aria-label":cs}){const gs={workspace:{id:"workspace-1",name:"Collaborative Design Session"},currentUser:{id:"user-1",name:"Current User",role:"admin"},onlineUsers:[{id:"user-1",name:"Alice Johnson",role:"admin",avatar:"",color:"var(--glass-color-primary)"},{id:"user-2",name:"Bob Smith",role:"editor",avatar:"",color:"var(--glass-color-success)"},{id:"user-3",name:"Carol Davis",role:"viewer",avatar:"",color:"var(--glass-color-warning)"}],canEdit:!0,isVoiceActive:!1,voiceUsers:[],toggleVoice:()=>{},createSnapshot:()=>{},undo:()=>{},redo:()=>{},canUndo:!0,canRedo:!1},{workspace:j,currentUser:W,onlineUsers:J,canEdit:ds,isVoiceActive:S,voiceUsers:z,toggleVoice:L,createSnapshot:B,undo:Q,redo:K,canUndo:X,canRedo:Y}=gs,[V,us]=i.useState(o),[O,ps]=i.useState(null),[Z,ms]=i.useState(!0),[bs,Gs]=i.useState(!0),[P,ss]=i.useState(!1),[hs,es]=i.useState(!1),[fs,as]=i.useState(!1);i.useEffect(()=>{j&&C?.(j)},[j,C]);const E=i.useCallback(ls=>{ps(ls),k?.(ls)},[k]),f=i.useMemo(()=>{switch(V){case"canvas-focused":return{canvasSize:"flex-1",editorSize:"w-80",direction:"row",canvasFirst:!0};case"editor-focused":return{canvasSize:"w-80",editorSize:"flex-1",direction:"row",canvasFirst:!1};case"tabs":return{canvasSize:"w-full",editorSize:"w-full",direction:"col",canvasFirst:!0};default:return{canvasSize:"flex-1",editorSize:"flex-1",direction:"row",canvasFirst:!0}}},[V]);return!j||!W?s.jsx(Os,{message:"Setting up workspace..."}):s.jsxs("div",{className:b("glass-collaborative-workspace workspace-glass-shell glass-h-screen glass-flex glass-flex-col glass-surface-dark",e),role:"main","aria-live":"polite","aria-label":cs,children:[s.jsx("style",{children:`
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

        .glass-collaborative-workspace .workspace-glass-panel .glass-surface-blue,
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
      `}),bs&&s.jsx(_s,{workspace:j,currentUser:W,onlineUsers:J,canEdit:ds,isVoiceActive:S,voiceUsers:z,onToggleVoice:L,onCreateSnapshot:B,onUndo:Q,onRedo:K,canUndo:X,canRedo:Y,onLayoutChange:us,activeLayout:V,onToggleSidebar:()=>ms(!Z),onToggleFullscreen:()=>ss(!P),isFullscreen:P,showOnlineUsers:l,enableVoiceChat:p,enableVersionControl:m}),s.jsxs("div",{className:b("glass-flex-1 glass-flex glass-min-h-0",f.direction==="col"?"glass-flex-col":"glass-flex-row"),children:[V==="tabs"?s.jsx(Rs,{selectedElementId:O,onElementSelect:E,width:n,height:u,gridSize:g,showGrid:x,showRulers:v,enableSnapping:w,enableComments:y,enableRealTimeSync:N}):s.jsxs(s.Fragment,{children:[f.canvasFirst&&s.jsx("div",{className:b(f.canvasSize,"glass-min-w-0 glass-p-4"),children:s.jsx(A,{width:n,height:u,gridSize:g,showGrid:x,showRulers:v,enableSnapping:w,onElementSelect:E,className:b("glass-h-full")})}),s.jsx("div",{className:b(f.editorSize,"glass-min-w-0 glass-p-4"),children:s.jsx(is,{target:O||"global",showPreview:!0,showHistory:m,showComments:y,enableRealTimeSync:N,layout:"vertical",className:"glass-h-full"})}),!f.canvasFirst&&s.jsx("div",{className:b(f.canvasSize,"glass-min-w-0 glass-p-4"),children:s.jsx(A,{width:n,height:u,gridSize:g,showGrid:x,showRulers:v,enableSnapping:w,onElementSelect:E,className:b("glass-h-full")})})]}),Z&&s.jsx(Ts,{selectedElementId:O,onElementSelect:E,showMiniMap:r,showOnlineUsers:l,onlineUsers:J,currentUser:W,isVoiceActive:S,voiceUsers:z,enableComments:y})]}),t&&(c?s.jsx(F,{showNames:!0,showVoiceIndicators:p,cursorSize:"md",glassLevel:"medium",enableRippleEffect:!0,enableGlowEffect:!0}):s.jsx($,{showNames:!0,showVoiceIndicators:p,cursorSize:"md",glassLevel:"medium"})),hs&&p&&s.jsx(Ws,{isActive:S,voiceUsers:z,onClose:()=>es(!1),onToggleVoice:L}),fs&&m&&s.jsx(zs,{onClose:()=>as(!1),onCreateSnapshot:B,canUndo:X,canRedo:Y,onUndo:Q,onRedo:K}),s.jsx(Ls,{isVoiceActive:S,onToggleVoice:L,onShowVoicePanel:()=>es(!0),onShowVersionPanel:()=>as(!0),onToggleFullscreen:()=>ss(!P),enableVoiceChat:p,enableVersionControl:m})]})}function _s({workspace:e,currentUser:o,onlineUsers:a,canEdit:r,isVoiceActive:l,voiceUsers:t,onToggleVoice:c,onCreateSnapshot:n,onUndo:u,onRedo:g,canUndo:x,canRedo:v,onLayoutChange:w,activeLayout:p,onToggleSidebar:D,onToggleFullscreen:y,isFullscreen:m,showOnlineUsers:N,enableVoiceChat:C,enableVersionControl:H}){const[T,k]=i.useState(!1);return s.jsxs("div",{className:"workspace-header workspace-glass-panel glass-flex glass-items-center glass-justify-between glass-px-4 glass-py-3 glass-border-b glass-border-white/10",style:h({intent:"neutral",elevation:"level2"}),children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-4",children:[s.jsx("h1",{className:"glass-text-xl glass-font-bold glass-text-primary",children:e.name}),s.jsx("div",{className:"glass-text-sm glass-text-primary",style:{opacity:"var(--glass-opacity-60)"},children:r?"✏️ Editing":"👁️ Viewing"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[H&&s.jsxs(s.Fragment,{children:[s.jsx("button",{onClick:u,disabled:!x,className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary glass-focus glass-touch-target glass-contrast-guard",style:{opacity:"var(--glass-opacity-50)"},title:"Undo","aria-label":"Undo last action",children:s.jsx(ns,{className:"glass-w-4 glass-h-4"})}),s.jsx("button",{onClick:g,disabled:!v,className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary glass-focus glass-touch-target glass-contrast-guard",style:{opacity:"var(--glass-opacity-50)"},title:"Redo","aria-label":"Redo last action",children:s.jsx(os,{className:"glass-w-4 glass-h-4"})}),s.jsx("button",{onClick:()=>n(`Snapshot ${Date.now()}`),className:"workspace-glass-button-primary glass-px-3 glass-py-2 glass-text-sm glass-surface-blue glass-text-primary glass-radius hover:glass-surface-blue",title:"Create Snapshot",children:"📷 Snapshot"})]}),s.jsxs("div",{className:"glass-relative",children:[s.jsx("button",{onClick:()=>k(!T),className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary",title:"Change Layout","aria-label":"Change workspace layout",children:"🔀"}),T&&s.jsx("div",{className:"glass-absolute glass-top-full glass-left-0 glass-mt-2 glass-p-2 glass-surface-dark glass-border glass-border-white/20 glass-radius glass-shadow-lg glass-z-50",children:["split","tabs","canvas-focused","editor-focused"].map(d=>s.jsx("button",{onClick:()=>{w(d),k(!1)},className:`block w-full text-left px-3 py-2 text-sm rounded hover:bg-white/10 text-white ${p===d?"bg-blue-600":""}`,children:d.charAt(0).toUpperCase()+d.slice(1).replace("-"," ")},d))})]}),C&&s.jsxs("button",{onClick:c,className:`p-2 rounded ${l?"bg-green-600 text-white":"hover:bg-white/10 text-white"}`,title:l?"Leave Voice Chat":"Join Voice Chat","aria-label":l?"Leave voice chat":"Join voice chat",children:[l?s.jsx(rs,{className:"glass-w-4 glass-h-4"}):s.jsx(vs,{className:"glass-w-4 glass-h-4"}),t.length>0&&` (${t.length})`]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[N&&s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsxs("div",{className:"glass-flex glass--space-x-2",children:[a.slice(0,5).map(d=>s.jsx("div",{className:"glass-w-8 glass-h-8 glass-radius-full glass-border-2 glass-border-white glass-flex glass-items-center glass-justify-center glass-text-xs glass-font-bold glass-text-primary",style:{backgroundColor:d.color},title:d.name,children:d.name[0]},d.id)),a.length>5&&s.jsxs("div",{className:"glass-w-8 glass-h-8 glass-radius-full glass-surface-primary glass-border-2 glass-border-white glass-flex glass-items-center glass-justify-center glass-text-xs glass-text-primary",children:["+",a.length-5]})]}),s.jsxs("span",{className:"glass-text-sm glass-text-primary",style:{opacity:"var(--glass-opacity-60)"},children:[a.length," online"]})]}),s.jsx("button",{onClick:D,className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",title:"Toggle Sidebar","aria-label":"Toggle sidebar",children:s.jsx(ws,{className:"glass-w-4 glass-h-4"})}),s.jsx("button",{onClick:y,className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",title:"Toggle Fullscreen","aria-label":m?"Exit fullscreen":"Enter fullscreen",children:m?s.jsx(ys,{className:"glass-w-4 glass-h-4"}):s.jsx(ts,{className:"glass-w-4 glass-h-4"})})]})]})}function Rs({selectedElementId:e,onElementSelect:o,enableComments:a,enableRealTimeSync:r,...l}){const[t,c]=i.useState("canvas");return s.jsxs("div",{className:"glass-flex glass-flex-col glass-h-full",children:[s.jsxs("div",{className:"glass-flex glass-border-b glass-border-white/20 glass-surface-dark",children:[s.jsx("button",{onClick:()=>c("canvas"),className:`glass-px-6 glass-py-3 glass-font-medium ${t==="canvas"?"glass-text-white glass-border-b-2 glass-border-blue-400 glass-surface-dark":"glass-text-white-opacity-70 glass-hover-text-white"}`,children:"🎨 Canvas"}),s.jsx("button",{onClick:()=>c("editor"),className:`glass-px-6 glass-py-3 glass-font-medium ${t==="editor"?"glass-text-white glass-border-b-2 glass-border-blue-400 glass-surface-dark":"glass-text-white-opacity-70 glass-hover-text-white"}`,children:"⚙️ Properties"})]}),s.jsx("div",{className:"glass-flex-1 glass-p-4",children:t==="canvas"?s.jsx(A,{...l,onElementSelect:o,className:"glass-h-full"}):s.jsx(is,{showComments:a,enableRealTimeSync:r,className:"glass-h-full"})})]})}function A({width:e,height:o,gridSize:a,showGrid:r,showRulers:l,enableSnapping:t,onElementSelect:c,className:n}){return s.jsxs("div",{className:`collaborative-canvas workspace-glass-panel relative ${n}`,style:h({intent:"neutral",elevation:"level2"}),children:[r&&s.jsx("div",{className:"glass-absolute glass-inset-0 glass-opacity-20",style:{backgroundImage:"linear-gradient(var(--glass-bg-default) 1px, transparent 1px), linear-gradient(90deg, var(--glass-bg-default) 1px, transparent 1px)",backgroundSize:`${a}px ${a}px`}}),s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full glass-text-primary-glass-opacity-60",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"🎨"}),s.jsx("p",{className:"glass-text-lg",children:"Collaborative Canvas"}),s.jsx("p",{className:"glass-text-sm",children:"Click to start designing together"})]})})]})}function is({target:e,showPreview:o,showHistory:a,showComments:r,enableRealTimeSync:l,layout:t,className:c}){return s.jsx("div",{className:`multi-user-editor workspace-glass-panel ${c}`,style:h({intent:"neutral",elevation:"level2"}),children:s.jsxs("div",{className:"glass-p-4",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h2",{className:"glass-text-primary glass-font-semibold",children:"Properties Editor"}),s.jsxs("div",{className:"glass-flex glass-gap-2",children:[a&&s.jsx("button",{className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary",children:"📜"}),r&&s.jsx("button",{className:"glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary",children:"💬"}),l&&s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1 glass-text-primary glass-text-sm",children:[s.jsx(Is,{className:"glass-w-3 glass-h-3"})," Live"]})]})]}),s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2",children:"Target Element"}),s.jsx("div",{className:"workspace-glass-inset glass-p-2 glass-surface-subtle/5 glass-radius glass-text-primary glass-text-sm",children:e})]}),s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2",children:"Properties"}),s.jsxs("div",{className:"glass-space-y-2",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60 glass-text-sm glass-w-20",children:"Width:"}),s.jsx("input",{type:"number","data-glass-component":"number",className:"glass-collaboration-number glass-flex-1 glass-p-2 glass-surface-subtle/10 glass-radius glass-text-primary glass-text-sm glass-touch-target glass-contrast-guard",placeholder:"Auto","aria-label":"Width"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60 glass-text-sm glass-w-20",children:"Height:"}),s.jsx("input",{type:"number","data-glass-component":"number",className:"glass-collaboration-number glass-flex-1 glass-p-2 glass-surface-subtle/10 glass-radius glass-text-primary glass-text-sm glass-touch-target glass-contrast-guard",placeholder:"Auto","aria-label":"Height"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60 glass-text-sm glass-w-20",children:"Opacity:"}),s.jsx("input",{type:"range","data-glass-component":"range",min:"0",max:"1",step:"0.1",className:"glass-collaboration-range glass-flex-1 glass-touch-target glass-contrast-guard","aria-label":"Opacity"})]})]})]})]})]})})}function Ts({selectedElementId:e,onElementSelect:o,showMiniMap:a,showOnlineUsers:r,onlineUsers:l,currentUser:t,isVoiceActive:c,voiceUsers:n,enableComments:u}){return s.jsxs("div",{className:"workspace-sidebar workspace-glass-panel glass-w-80 glass-border-l glass-border-white/20 glass-p-4 glass-space-y-4",style:h({intent:"neutral",elevation:"level2"}),children:[a&&s.jsxs("div",{className:"glass-space-y-2",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-80 glass-uppercase",children:"Mini Map"}),s.jsx("div",{className:"workspace-glass-inset glass-aspect-video glass-surface-dark glass-border glass-border-white/20 glass-radius glass-p-2",children:s.jsx("div",{className:"glass-text-xs glass-text-primary glass-text-center glass-mt-8",children:"Canvas overview"})})]}),r&&s.jsxs("div",{className:"glass-space-y-2",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-80 glass-uppercase",children:"Online Users"}),s.jsx("div",{className:"glass-space-y-2",children:l.map(g=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 glass-p-2 glass-radius hover:glass-surface-subtle/5",children:[s.jsx("div",{className:"glass-w-6 glass-h-6 glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs glass-font-bold glass-text-primary",style:{backgroundColor:g.color},children:g.name[0]}),s.jsxs("div",{className:"glass-flex-1",children:[s.jsx("div",{className:"glass-text-sm glass-text-primary",children:g.name}),s.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-50",children:g.role})]}),n.includes(g.id)&&s.jsx("div",{className:"glass-text-primary glass-text-xs",children:"🎤"})]},g.id))})]}),s.jsxs("div",{className:"glass-space-y-2",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-80 glass-uppercase",children:"Quick Actions"}),s.jsxs("div",{className:"glass-space-y-2",children:[s.jsxs("button",{className:"glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-radius glass-text-primary",children:[s.jsx(ks,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-2"}),"Copy Selected"]}),s.jsxs("button",{className:"glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-radius glass-text-primary",children:[s.jsx(Vs,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-2"}),"Paste"]}),s.jsxs("button",{className:"glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-radius glass-text-primary",children:[s.jsx(js,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-2"}),"Delete Selected"]})]})]})]})}function $({showNames:e,showVoiceIndicators:o,cursorSize:a,glassLevel:r}){return null}function F({showNames:e,showVoiceIndicators:o,cursorSize:a,glassLevel:r,enableRippleEffect:l,enableGlowEffect:t}){return null}function Ws({isActive:e,voiceUsers:o,onClose:a,onToggleVoice:r}){return s.jsxs("div",{className:"glass-fixed glass-bottom-4 glass-right-4 glass-w-80 glass-p-4 glass-radius-lg glass-border glass-border-white/20",style:h({intent:"neutral",elevation:"level2"}),children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h3",{className:"glass-text-primary glass-font-semibold",children:"Voice Chat"}),s.jsx("button",{onClick:a,className:"glass-contrast-guard glass-focus glass-touch-target hover:glass-text-primary glass-text-primary-opacity-70","aria-label":"Close voice chat panel",children:"✕"})]}),s.jsx("div",{className:"glass-space-y-2 glass-mb-4",children:o.map(l=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-text-primary glass-text-sm",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),"User ",l]},l))}),s.jsxs("button",{onClick:r,className:`w-full py-2 rounded ${e?"bg-red-600 hover:bg-red-700":"bg-green-600 hover:bg-green-700"} text-white transition-colors`,children:[e?"🔇 Leave":"🎤 Join"," Voice Chat"]})]})}function zs({onClose:e,onCreateSnapshot:o,canUndo:a,canRedo:r,onUndo:l,onRedo:t}){return s.jsxs("div",{className:"glass-fixed glass-bottom-4 glass-left-4 glass-w-80 glass-p-4 glass-radius-lg glass-border glass-border-white/20",style:h({intent:"neutral",elevation:"level2"}),children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h3",{className:"glass-text-primary glass-font-semibold",children:"Version Control"}),s.jsx("button",{onClick:e,className:"glass-contrast-guard glass-focus glass-touch-target hover:glass-text-primary glass-text-primary-opacity-70","aria-label":"Close version control panel",children:"✕"})]}),s.jsxs("div",{className:"glass-space-y-2",children:[s.jsxs("div",{className:"glass-flex glass-gap-2",children:[s.jsxs("button",{onClick:l,disabled:!a,className:"glass-flex-1 glass-py-2 glass-px-3 glass-radius glass-surface-subtle/10 glass-text-primary disabled:glass-opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:[s.jsx(ns,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-1"}),"Undo"]}),s.jsxs("button",{onClick:t,disabled:!r,className:"glass-flex-1 glass-py-2 glass-px-3 glass-radius glass-surface-subtle/10 glass-text-primary disabled:glass-opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:[s.jsx(os,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-1"}),"Redo"]})]}),s.jsxs("button",{onClick:()=>o(`Manual snapshot ${Date.now()}`),className:"glass-w-full glass-py-2 glass-px-3 glass-radius glass-surface-blue glass-text-primary hover:glass-surface-blue",children:[s.jsx(Ns,{className:"glass-w-4 glass-h-4 glass-inline glass-mr-1"}),"Create Snapshot"]})]})]})}function Ls({isVoiceActive:e,onToggleVoice:o,onShowVoicePanel:a,onShowVersionPanel:r,onToggleFullscreen:l,enableVoiceChat:t,enableVersionControl:c}){const[n,u]=i.useState(!1);return s.jsxs("div",{className:"glass-fixed glass-bottom-6 glass-right-6",children:[s.jsxs("div",{className:`flex flex-col gap-2 ${n?"opacity-100":"opacity-0 pointer-events-none"} transition-opacity`,children:[t&&s.jsx("button",{onClick:a,className:"glass-w-12 glass-h-12 glass-radius-full glass-surface-green glass-text-primary glass-flex glass-items-center glass-justify-center glass-shadow-lg hover:glass-surface-green glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",title:"Voice Chat","aria-label":"Open voice chat panel",children:s.jsx(rs,{className:"glass-w-4 glass-h-4"})}),c&&s.jsx("button",{onClick:r,className:"glass-w-12 glass-h-12 glass-radius-full glass-surface-blue glass-text-primary glass-flex glass-items-center glass-justify-center glass-shadow-lg hover:glass-surface-blue glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",title:"Version Control","aria-label":"Open version control panel",children:s.jsx(Cs,{className:"glass-w-4 glass-h-4"})}),s.jsx("button",{onClick:l,className:"glass-w-12 glass-h-12 glass-radius-full glass-surface-primary glass-text-primary glass-flex glass-items-center glass-justify-center glass-shadow-lg hover:glass-surface-subtle glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",title:"Fullscreen","aria-label":"Toggle fullscreen mode",children:s.jsx(ts,{className:"glass-w-4 glass-h-4"})})]}),s.jsx("button",{onClick:()=>u(!n),className:"glass-w-14 glass-h-14 glass-radius-full glass-surface-dark glass-text-primary glass-flex glass-items-center glass-justify-center glass-shadow-lg glass-hover-bg-slate-600 glass-mt-2",style:h({intent:"neutral",elevation:"level2"}),"aria-label":n?"Close floating actions menu":"Open floating actions menu",children:n?"✕":"⚡"})]})}function Os({message:e="Connecting to workspace..."}){return s.jsx("div",{className:"glass-h-screen glass-flex glass-items-center glass-justify-center glass-surface-dark",children:s.jsxs("div",{className:"glass-text-center glass-space-y-4",children:[s.jsx("div",{className:"glass-w-16 glass-h-16 glass-border-4 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin glass-mx-auto"}),s.jsx("div",{className:"glass-text-primary glass-text-lg",children:e}),s.jsx("div",{className:"glass-text-primary-glass-opacity-60 glass-text-sm",children:"Please wait..."})]})})}try{G.displayName="CollaborativeGlassWorkspace",G.__docgenInfo={description:"",displayName:"CollaborativeGlassWorkspace",props:{workspaceId:{defaultValue:null,description:"",name:"workspaceId",required:!0,type:{name:"string"}},userId:{defaultValue:null,description:"",name:"userId",required:!0,type:{name:"string"}},userName:{defaultValue:null,description:"",name:"userName",required:!0,type:{name:"string"}},userEmail:{defaultValue:null,description:"",name:"userEmail",required:!0,type:{name:"string"}},userRole:{defaultValue:null,description:"",name:"userRole",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"admin"'},{value:'"editor"'},{value:'"viewer"'}]}},userAvatar:{defaultValue:null,description:"",name:"userAvatar",required:!1,type:{name:"string | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}},enableVoiceChat:{defaultValue:null,description:"",name:"enableVoiceChat",required:!1,type:{name:"boolean | undefined"}},enableScreenSharing:{defaultValue:null,description:"",name:"enableScreenSharing",required:!1,type:{name:"boolean | undefined"}},enableComments:{defaultValue:null,description:"",name:"enableComments",required:!1,type:{name:"boolean | undefined"}},enableVersionControl:{defaultValue:null,description:"",name:"enableVersionControl",required:!1,type:{name:"boolean | undefined"}},enableRealTimeSync:{defaultValue:null,description:"",name:"enableRealTimeSync",required:!1,type:{name:"boolean | undefined"}},layout:{defaultValue:null,description:"",name:"layout",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"split"'},{value:'"tabs"'},{value:'"canvas-focused"'},{value:'"editor-focused"'}]}},theme:{defaultValue:null,description:"",name:"theme",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"light"'},{value:'"dark"'},{value:'"auto"'}]}},showMiniMap:{defaultValue:null,description:"",name:"showMiniMap",required:!1,type:{name:"boolean | undefined"}},showOnlineUsers:{defaultValue:null,description:"",name:"showOnlineUsers",required:!1,type:{name:"boolean | undefined"}},showCursors:{defaultValue:null,description:"",name:"showCursors",required:!1,type:{name:"boolean | undefined"}},enableAdvancedEffects:{defaultValue:null,description:"",name:"enableAdvancedEffects",required:!1,type:{name:"boolean | undefined"}},canvasWidth:{defaultValue:null,description:"",name:"canvasWidth",required:!1,type:{name:"number | undefined"}},canvasHeight:{defaultValue:null,description:"",name:"canvasHeight",required:!1,type:{name:"number | undefined"}},gridSize:{defaultValue:null,description:"",name:"gridSize",required:!1,type:{name:"number | undefined"}},showGrid:{defaultValue:null,description:"",name:"showGrid",required:!1,type:{name:"boolean | undefined"}},showRulers:{defaultValue:null,description:"",name:"showRulers",required:!1,type:{name:"boolean | undefined"}},enableSnapping:{defaultValue:null,description:"",name:"enableSnapping",required:!1,type:{name:"boolean | undefined"}},onWorkspaceReady:{defaultValue:null,description:"",name:"onWorkspaceReady",required:!1,type:{name:"((workspace: WorkspaceSummary) => void) | undefined"}},onUserJoined:{defaultValue:null,description:"",name:"onUserJoined",required:!1,type:{name:"((user: WorkspaceUser) => void) | undefined"}},onUserLeft:{defaultValue:null,description:"",name:"onUserLeft",required:!1,type:{name:"((userId: string) => void) | undefined"}},onElementSelected:{defaultValue:null,description:"",name:"onElementSelected",required:!1,type:{name:"((elementId: string | null) => void) | undefined"}},onError:{defaultValue:null,description:"",name:"onError",required:!1,type:{name:"((error: WorkspaceError) => void) | undefined"}}}}}catch{}try{$.displayName="GlassTeamCursors",$.__docgenInfo={description:"",displayName:"GlassTeamCursors",props:{showNames:{defaultValue:null,description:"",name:"showNames",required:!1,type:{name:"boolean | undefined"}},showVoiceIndicators:{defaultValue:null,description:"",name:"showVoiceIndicators",required:!1,type:{name:"boolean | undefined"}},cursorSize:{defaultValue:null,description:"",name:"cursorSize",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},glassLevel:{defaultValue:null,description:"",name:"glassLevel",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"high"'},{value:'"medium"'},{value:'"low"'}]}}}}}catch{}try{F.displayName="GlassTeamCursorsWithEffects",F.__docgenInfo={description:"",displayName:"GlassTeamCursorsWithEffects",props:{enableRippleEffect:{defaultValue:null,description:"",name:"enableRippleEffect",required:!1,type:{name:"boolean | undefined"}},enableGlowEffect:{defaultValue:null,description:"",name:"enableGlowEffect",required:!1,type:{name:"boolean | undefined"}},showNames:{defaultValue:null,description:"",name:"showNames",required:!1,type:{name:"boolean | undefined"}},showVoiceIndicators:{defaultValue:null,description:"",name:"showVoiceIndicators",required:!1,type:{name:"boolean | undefined"}},cursorSize:{defaultValue:null,description:"",name:"cursorSize",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},glassLevel:{defaultValue:null,description:"",name:"glassLevel",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"high"'},{value:'"medium"'},{value:'"low"'}]}}}}}catch{}const Ps=({children:e})=>s.jsxs("div",{className:"collaborative-workspace-story-frame",style:{width:"100%",height:"100dvh",maxHeight:"100vh",minHeight:0,minWidth:0,boxSizing:"border-box",overflow:"hidden",color:"inherit"},children:[e,s.jsx("style",{children:`
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
    `})]}),se={title:"Workflows/Collaborative Glass Workspace",component:G,decorators:[e=>s.jsx(Ps,{children:s.jsx(e,{})})],parameters:{layout:"fullscreen",previewSurface:"app",docs:{description:{component:"A complete real-time collaborative design environment with multi-user editing, voice chat, version control, and live cursors."}}},argTypes:{layout:{control:{type:"select",options:["split","tabs","canvas-focused","editor-focused"]},description:"Workspace layout mode"},theme:{control:{type:"select",options:["dark","light","auto"]},description:"UI theme preference"},showMiniMap:{control:"boolean",description:"Show workspace minimap"},showOnlineUsers:{control:"boolean",description:"Show online users panel"},showCursors:{control:"boolean",description:"Show collaborative cursors"},enableVoiceChat:{control:"boolean",description:"Enable voice communication"},enableVersionControl:{control:"boolean",description:"Enable version control features"}}},M={args:{workspaceId:"demo-workspace-1",userId:"user-demo-1",userName:"Demo User",userEmail:"demo@example.com",userRole:"admin",layout:"split",theme:"dark",showMiniMap:!0,showOnlineUsers:!0,showCursors:!0,enableVoiceChat:!0,enableVersionControl:!0,canvasWidth:1200,canvasHeight:800}},q={args:{workspaceId:"design-studio",userId:"designer-1",userName:"Design Pro",userEmail:"designer@studio.com",userRole:"admin",layout:"canvas-focused",theme:"dark",showMiniMap:!0,showOnlineUsers:!0,showCursors:!0,enableVoiceChat:!0,enableVersionControl:!0,enableAdvancedEffects:!0,canvasWidth:1920,canvasHeight:1080,gridSize:15}},I={args:{workspaceId:"code-session",userId:"developer-1",userName:"Code Master",userEmail:"dev@company.com",userRole:"editor",layout:"editor-focused",theme:"dark",showMiniMap:!1,showOnlineUsers:!0,showCursors:!0,enableVoiceChat:!1,enableVersionControl:!0,enableRealTimeSync:!0}},U={args:{workspaceId:"minimal-workspace",userId:"user-minimal",userName:"Minimal User",userEmail:"minimal@example.com",userRole:"viewer",layout:"tabs",theme:"light",showMiniMap:!1,showOnlineUsers:!1,showCursors:!1,enableVoiceChat:!1,enableVersionControl:!1}},_={args:{workspaceId:"voice-workspace",userId:"voice-user",userName:"Voice User",userEmail:"voice@example.com",userRole:"admin",layout:"split",theme:"dark",showMiniMap:!0,showOnlineUsers:!0,showCursors:!0,enableVoiceChat:!0,enableScreenSharing:!0,enableComments:!0,enableVersionControl:!0}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};const ee=["Default","DesignStudio","CodeCollaboration","MinimalWorkspace","VoiceEnabled"];export{I as CodeCollaboration,M as Default,q as DesignStudio,U as MinimalWorkspace,_ as VoiceEnabled,ee as __namedExportsOrder,se as default};
