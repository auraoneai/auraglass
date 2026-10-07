import{r as s,R as S,j as a,c as r}from"./iframe-RsoZoStf.js";import{r as M}from"./index-DVcvShGp.js";import{L as P}from"./LiquidGlassAdaptiveSheet-jWMZlqBf.js";import{O as V}from"./OptimizedGlassCore-IzbAukgr.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BwSV5crb.js";import"./index-CWG1rEj-.js";import"./LiquidGlassMaterial-GdijC9oA.js";import"./LiquidGlassLayerProvider-BQssgZYr.js";import"./LiquidGlassScrollEdge-DnfkJYUb.js";import"./deviceCapabilities-CB0YcTGX.js";const c=s.forwardRef(({open:n,onClose:t,title:o,message:i,actions:h,showCancel:b=!0,cancelText:y="Cancel",elevation:x="level4",closeOnBackdrop:v=!0,animationDuration:k=300,material:E="glass",sourceId:G,presentationMode:T="interruptive",sourceTransition:R=!1,localDimming:_=!0,className:w,"aria-label":g,...p},j)=>{const[f,A]=S.useState(!1),[N,C]=S.useState(!1),d=s.useRef(null),q=s.useRef(0),u=s.useRef(0);if(E==="liquid")return a.jsxs(P,{ref:j,open:n,onOpenChange:e=>{e||t()},title:o,sourceId:R?G:void 0,presentationMode:T,materialVariant:_?"clear":"regular",className:w,"aria-label":g,...p,children:[i&&a.jsx("p",{className:"glass-text-sm glass-text-secondary",children:i}),a.jsxs("div",{className:"glass-mt-4 glass-flex glass-flex-col glass-gap-2",children:[h.map(e=>a.jsxs("button",{type:"button",disabled:e.disabled,className:r("glass-radius-lg glass-px-3 glass-py-2 glass-text-left",e.variant==="destructive"&&"glass-text-danger"),onClick:()=>{e.disabled||(e.onAction(),t())},children:[e.icon,e.label]},e.label)),b&&a.jsx("button",{type:"button",onClick:t,children:y})]})]});s.useEffect(()=>{n?(A(!0),setTimeout(()=>C(!0),10)):(C(!1),setTimeout(()=>A(!1),k))},[n,k]),s.useEffect(()=>{if(!f)return;const e=l=>{l.key==="Escape"&&t()};return document.addEventListener("keydown",e),document.body.style.overflow="hidden",()=>{document.removeEventListener("keydown",e),document.body.style.overflow=""}},[f,t]);const Y=s.useCallback(()=>{v&&t()},[v,t]),D=s.useCallback(e=>{e.disabled||(e.onAction(),t())},[t]),I=s.useCallback(e=>{q.current=e.touches[0].clientY,u.current=0},[]),O=s.useCallback(e=>{const l=e.touches[0].clientY-q.current;l>0&&(u.current=l,d.current&&(d.current.style.transform=`translateY(${l}px)`))},[]),W=s.useCallback(()=>{u.current>100?t():d.current&&(d.current.style.transform=""),u.current=0},[t]);if(!f)return null;const z=a.jsx("div",{className:r("fixed inset-0 z-50 flex items-end justify-center","transition-colors duration-300",N?"bg-black/40":"bg-black/0"),onClick:Y,role:"presentation",children:a.jsxs("div",{ref:d,onClick:e=>e.stopPropagation(),onTouchStart:I,onTouchMove:O,onTouchEnd:W,className:r("w-full max-w-2xl mx-auto glass-p-4 pb-safe glass-on-light","transition-transform duration-300 ease-out",N?"translate-y-0":"translate-y-full",w),role:"dialog","aria-modal":"true","aria-label":g,"aria-labelledby":o&&!g?"action-sheet-title":void 0,"aria-describedby":i?"action-sheet-message":void 0,"data-testid":p["data-testid"],...p,children:[a.jsxs(V,{ref:j,elevation:x,className:r("overflow-hidden glass-radius-2xl"),children:[(o||i)&&a.jsxs("div",{className:"glass-p-4 glass-text-center glass-border-b glass-border-subtle",children:[o&&a.jsx("h3",{id:"action-sheet-title",className:"glass-text-lg glass-font-semibold glass-text-primary glass-mb-1",children:o}),i&&a.jsx("p",{id:"action-sheet-message",className:"glass-text-sm glass-text-secondary",children:i})]}),a.jsx("div",{className:"glass-max-h-96 glass-overflow-y-auto glass-flex glass-flex-col glass-gap-2 glass-p-2",children:h.map((e,l)=>a.jsxs("button",{onClick:()=>D(e),disabled:e.disabled,className:r("w-full glass-p-4 flex items-center justify-center gap-3","glass-text-base font-medium","transition-all duration-200","glass-radius-lg glass-border glass-border-subtle","hover:bg-white/5 active:bg-white/10","disabled:opacity-50 glass-disabled-cursor-not-allowed",e.variant==="destructive"&&"text-red-500",e.variant==="primary"&&"text-blue-500 font-semibold",e.variant==="default"&&"glass-text-primary",!e.disabled&&"glass-focus glass-touch-target glass-contrast-guard"),type:"button",children:[e.icon&&a.jsx("span",{className:"glass-flex-shrink-0",children:e.icon}),a.jsx("span",{children:e.label})]},l))})]}),b&&a.jsx(V,{elevation:x,className:"glass-mt-2 glass-overflow-hidden glass-radius-2xl",children:a.jsx("button",{onClick:t,className:r("w-full glass-p-4 flex items-center justify-center","glass-text-base font-semibold glass-text-primary","transition-all duration-200","hover:bg-white/5 active:bg-white/10","glass-focus glass-touch-target glass-contrast-guard"),type:"button",children:y})})]})});return M.createPortal(z,document.body)});c.displayName="GlassActionSheet";try{c.displayName="GlassActionSheet",c.__docgenInfo={description:"",displayName:"GlassActionSheet",props:{open:{defaultValue:null,description:"Whether the action sheet is open",name:"open",required:!0,type:{name:"boolean"}},onClose:{defaultValue:null,description:"Callback when the action sheet should close",name:"onClose",required:!0,type:{name:"() => void"}},title:{defaultValue:null,description:"Action sheet title",name:"title",required:!1,type:{name:"string | undefined"}},message:{defaultValue:null,description:"Action sheet message/description",name:"message",required:!1,type:{name:"string | undefined"}},actions:{defaultValue:null,description:"List of actions",name:"actions",required:!0,type:{name:"GlassActionSheetAction[]"}},showCancel:{defaultValue:{value:"true"},description:"Show cancel button",name:"showCancel",required:!1,type:{name:"boolean | undefined"}},cancelText:{defaultValue:{value:"Cancel"},description:"Cancel button text",name:"cancelText",required:!1,type:{name:"string | undefined"}},elevation:{defaultValue:{value:"level4"},description:"Glassmorphism elevation level",name:"elevation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"level1"'},{value:'"level2"'},{value:'"level3"'},{value:'"level4"'},{value:'"level5"'}]}},closeOnBackdrop:{defaultValue:{value:"true"},description:"Close on backdrop click",name:"closeOnBackdrop",required:!1,type:{name:"boolean | undefined"}},animationDuration:{defaultValue:{value:"300"},description:"Animation duration in milliseconds",name:"animationDuration",required:!1,type:{name:"number | undefined"}},material:{defaultValue:{value:"glass"},description:"",name:"material",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"liquid"'},{value:'"glass"'}]}},sourceId:{defaultValue:null,description:"",name:"sourceId",required:!1,type:{name:"string | undefined"}},presentationMode:{defaultValue:{value:"interruptive"},description:"",name:"presentationMode",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"interruptive"'},{value:'"parallel"'}]}},sourceTransition:{defaultValue:{value:"false"},description:"",name:"sourceTransition",required:!1,type:{name:"boolean | undefined"}},localDimming:{defaultValue:{value:"true"},description:"",name:"localDimming",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const B=[{label:"Save to reading list",onAction:()=>{}},{label:"Copy link",onAction:()=>{}},{label:"Add a reminder",onAction:()=>{}}],L=`
  body > [role="presentation"]:has(> .ag-action-sheet-story-dialog) {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    transition-property: background-color;
    transition-duration: 300ms;
  }

  body > [role="presentation"]:has(> .ag-action-sheet-story-dialog.bg-black\\/40) {
    background: rgba(0, 0, 0, 0.4);
  }

  body > [role="presentation"] > .ag-action-sheet-story-dialog {
    box-sizing: border-box;
    width: 100%;
    max-width: 42rem;
    margin-inline: auto;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    transition: transform 300ms ease-out;
  }

  body > [role="presentation"] > .ag-action-sheet-story-dialog.translate-y-0 {
    transform: translateY(0);
  }

  body > [role="presentation"] > .ag-action-sheet-story-dialog.translate-y-full {
    transform: translateY(100%);
  }

  .ag-action-sheet-story-dialog .overflow-hidden {
    overflow: hidden;
  }

  .ag-action-sheet-story-dialog button.w-full {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }
`,te={title:"Effects + Advanced/Glass Action Sheet",component:c,parameters:{layout:"fullscreen",previewSurface:"app",controls:{exclude:["actions","onClose"]},docs:{description:{component:"A mobile action sheet rendered open with its real glass panels, action rows, and cancel affordance."}}},args:{open:!0,onClose:()=>{},title:"Share this article",message:"Choose what you would like to do with this story.",actions:B,showCancel:!0,cancelText:"Cancel",elevation:"level4",closeOnBackdrop:!1,animationDuration:300,material:"glass",className:"ag-action-sheet-story-dialog","aria-label":"Article actions"}},m={render:n=>a.jsxs(a.Fragment,{children:[a.jsx("style",{children:L}),a.jsxs("div",{style:{minHeight:"100vh",padding:"48px",color:"rgba(15, 23, 42, 0.92)",background:"linear-gradient(145deg, rgb(236, 241, 246) 0%, rgb(250, 252, 254) 48%, rgb(225, 232, 239) 100%)"},children:[a.jsxs("div",{style:{maxWidth:560},children:[a.jsx("p",{className:"glass-text-xs glass-font-medium glass-tracking-wide glass-uppercase",children:"Weekend edition"}),a.jsx("h2",{className:"glass-mt-3 glass-text-3xl glass-font-semibold",children:"Designing calmer digital spaces"}),a.jsx("p",{className:"glass-mt-3 glass-text-base",style:{opacity:.72},children:"A quiet canvas behind the sheet makes its edge treatment and material response easy to inspect."})]}),a.jsx(c,{...n})]})]})};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <>
      <style>{storybookPortalCompatibility}</style>
      <div style={{
      minHeight: "100vh",
      padding: "48px",
      color: "rgba(15, 23, 42, 0.92)",
      background: "linear-gradient(145deg, rgb(236, 241, 246) 0%, rgb(250, 252, 254) 48%, rgb(225, 232, 239) 100%)"
    }}>
        <div style={{
        maxWidth: 560
      }}>
          <p className="glass-text-xs glass-font-medium glass-tracking-wide glass-uppercase">
            Weekend edition
          </p>
          <h2 className="glass-mt-3 glass-text-3xl glass-font-semibold">
            Designing calmer digital spaces
          </h2>
          <p className="glass-mt-3 glass-text-base" style={{
          opacity: 0.72
        }}>
            A quiet canvas behind the sheet makes its edge treatment and
            material response easy to inspect.
          </p>
        </div>
        <GlassActionSheetComponent {...args} />
      </div>
    </>
}`,...m.parameters?.docs?.source}}};const se=["GlassActionSheet"];export{m as GlassActionSheet,se as __namedExportsOrder,te as default};
