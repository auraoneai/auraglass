import{r as l,a as S,f as j,j as e,m as C,d as B,c as w}from"./iframe-RsoZoStf.js";import{u as X}from"./use-motion-value-aOYkBdRR.js";import"./preload-helper-PPVm8Dsz.js";const I={background:"linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0.18))",border:"1px solid rgba(32,32,32,0.14)",boxShadow:"0 14px 34px rgba(32,32,32,0.1), inset 0 1px 0 rgba(255,255,255,0.26)"},E=l.forwardRef(({children:s,onTap:i,onLongPress:r,onSwipe:d,className:n,touchFeedback:a=!0,rippleEffect:o=!0,hapticsEnabled:t=!0,glassIntensity:g="medium",...v},c)=>{const u=S(),[m,f]=l.useState(!1),[b,h]=l.useState([]),[p,N]=l.useState(null),T=l.useRef(null),M=X(1),U=X(1),y=l.useCallback((x="light")=>{if(!(!t||typeof window>"u")&&"navigator"in window&&"vibrate"in navigator){const H={light:[10],medium:[20],heavy:[30,10,30]};navigator.vibrate(H[x])}},[t]),Y=l.useCallback(x=>{if(x.preventDefault(),f(!0),M.set(.95),a&&y("light"),r){const H=setTimeout(()=>{y("medium"),r(),N(null)},500);N(H)}if(o&&T.current){const H=T.current.getBoundingClientRect(),D=x.touches[0],L=D.clientX-H.left,k=D.clientY-H.top,q={id:Date.now(),x:L,y:k,timestamp:Date.now()};h(V=>[...V,q]),setTimeout(()=>{h(V=>V.filter(Z=>Z.id!==q.id))},600)}},[a,o,r,y,M]),Q=l.useCallback(()=>{f(!1),M.set(1),p&&(clearTimeout(p),N(null)),i&&!p&&(y("light"),i())},[p,i,y,M]),J=l.useCallback((x,H)=>{const{offset:D,velocity:L}=H,k=50,q=500;if(Math.abs(D.x)>k||Math.abs(L.x)>q){const V=D.x>0?"right":"left";d?.(V),y("medium")}else if(Math.abs(D.y)>k||Math.abs(L.y)>q){const V=D.y>0?"down":"up";d?.(V),y("medium")}},[d,y]),$={light:j({intent:"neutral",elevation:"level2"}),medium:j({intent:"neutral",elevation:"level2"}),heavy:j({intent:"neutral",elevation:"level2"})}[g];return e.jsxs(C.div,{ref:x=>{T.current=x,typeof c=="function"?c(x):c&&(c.current=x)},className:w("relative overflow-hidden touch-none select-none",n),style:{...$,...I,borderRadius:"12px",minHeight:"44px",minWidth:"44px",scale:M,opacity:U},onTouchStart:Y,onTouchEnd:Q,onPanEnd:J,drag:"x",dragConstraints:{left:0,right:0},dragElastic:.1,...v,children:[s,e.jsx(B,{children:b.map(x=>e.jsx(C.div,{className:"glass-absolute glass-pointer-events-none",style:{left:x.x-20,top:x.y-20,width:40,height:40,borderRadius:"50%",background:"var(--glass-neutral-level2-surface)"},initial:{scale:0,opacity:1},animate:u?{}:{scale:3,opacity:0},exit:{opacity:0},transition:u?{duration:0}:{duration:.6,ease:"easeOut"}},x.id))}),a&&e.jsx(B,{children:m&&e.jsx(C.div,{className:"glass-absolute glass-inset-0 glass-pointer-events-none",style:{background:"var(--glass-neutral-level2-surface)",borderRadius:"inherit"},initial:{opacity:0},animate:u?{}:{opacity:1},exit:{opacity:0},transition:u?{duration:0}:{duration:.1}})})]})});E.displayName="TouchOptimizedGlass";const W=l.forwardRef((s,i)=>e.jsx(E,{ref:i,...s}));W.displayName="TouchGlassOptimization";function ee({children:s,swipeThreshold:i=50,onSwipeLeft:r,onSwipeRight:d,onSwipeUp:n,onSwipeDown:a,className:o=""}){const t=S(),[g,v]=l.useState(null),c=l.useRef(null),u=l.useCallback(m=>{switch(v(m),m){case"left":r?.();break;case"right":d?.();break;case"up":n?.();break;case"down":a?.();break}setTimeout(()=>v(null),300)},[r,d,n,a]);return e.jsx(C.div,{ref:c,className:w("glass-relative glass-w-full glass-max-w-full glass-min-w-0 glass-overflow-hidden",o),style:{...j({intent:"neutral",elevation:"level2"}),...I,borderRadius:24,boxSizing:"border-box"},drag:"x",dragConstraints:{left:0,right:0},dragElastic:.2,onDragEnd:(m,f)=>{const{offset:b,velocity:h}=f;if(Math.abs(b.x)>i||Math.abs(h.x)>500){const p=b.x>0?"right":"left";u(p)}else if(Math.abs(b.y)>i||Math.abs(h.y)>500){const p=b.y>0?"down":"up";u(p)}},animate:g?{x:g==="left"?-50:g==="right"?50:0,y:g==="up"?-50:g==="down"?50:0,opacity:.7}:{x:0,y:0,opacity:1},transition:t?{duration:0}:{duration:.3},children:s})}function K({children:s,screenSize:i,devicePixelRatio:r,autoAdapt:d=!0,className:n=""}){const a=S(),[o,t]=l.useState("medium");l.useEffect(()=>{if(!d)return;const c=()=>{const u=window.innerWidth,m=r||window.devicePixelRatio||1;let f="medium";u<768?f=m>2?"light":"medium":u<1200?f=m>1.5?"medium":"heavy":f=m>1.5?"heavy":"medium",t(f)};return c(),window.addEventListener("resize",c),()=>window.removeEventListener("resize",c)},[d,r]);const v={light:j({intent:"neutral",elevation:"level2"}),medium:j({intent:"neutral",elevation:"level2"}),heavy:j({intent:"neutral",elevation:"level2"})}[o];return e.jsx(C.div,{className:n,style:{...v,...I,borderRadius:"12px",transition:"all 0.3s ease-in-out"},animate:a?{}:{opacity:1},initial:{opacity:0},children:s})}function P({children:s,color:i="var(--glass-bg-hover)",maxRipples:r=3,rippleDuration:d=600,className:n=""}){const a=S(),[o,t]=l.useState([]),g=l.useRef(null),v=l.useCallback(c=>{if(!g.current)return;const u=g.current.getBoundingClientRect(),m=c.touches[0],f=m.clientX-u.left,b=m.clientY-u.top,h={id:Date.now(),x:f,y:b};t(p=>[...p,h].slice(-r)),setTimeout(()=>{t(p=>p.filter(N=>N.id!==h.id))},d)},[r,d]);return e.jsxs("div",{ref:g,className:`relative overflow-hidden ${n}`,onTouchStart:v,children:[s,e.jsx(B,{children:o.map(c=>e.jsx(C.div,{className:"glass-absolute glass-pointer-events-none glass-radius-full",style:{left:c.x-20,top:c.y-20,width:40,height:40,background:i},initial:{scale:0,opacity:1},animate:a?{}:{scale:4,opacity:0},exit:{opacity:0},transition:a?{duration:0}:{duration:d/1e3,ease:"easeOut"}},c.id))})]})}function _({isOpen:s,onClose:i,children:r,height:d="50vh",snapPoints:n=["25vh","50vh","75vh"],className:a=""}){const o=S(),[t,g]=l.useState(d),v=l.useCallback((c,u)=>{const{offset:m,velocity:f}=u;if(m.y>100||f.y>500)i();else{const h=u.point.y,p=n.reduce((N,T)=>{const M=parseFloat(T),U=Math.abs(h-M),y=Math.abs(h-parseFloat(N));return U<y?T:N});g(p)}},[i,n]);return e.jsx(B,{children:s&&e.jsxs(e.Fragment,{children:[e.jsx(C.div,{className:w("glass-foundation-complete glass-position-fixed glass-inset-0 glass-z-40"),style:{background:"rgba(32, 32, 32, 0.32)"},initial:{opacity:0},animate:o?{}:{opacity:1},exit:{opacity:0},onClick:i}),e.jsxs(C.div,{className:w("glass-position-fixed glass-bottom-0 glass-left-0 glass-right-0 glass-z-50 glass-w-full glass-max-w-full glass-overflow-hidden",a),style:{...j({intent:"neutral",elevation:"level2"}),...I,height:t,maxHeight:"min(82vh, calc(100vh - 12px))",borderRadius:"28px 28px 0 0",boxSizing:"border-box"},initial:{y:"100%"},animate:o?{}:{y:0},exit:{y:"100%"},transition:o?{duration:0}:{duration:.3},drag:"y",dragConstraints:{top:0,bottom:0},dragElastic:.1,onDragEnd:v,children:[e.jsx("div",{className:"glass-flex glass-justify-center glass-py-3",children:e.jsx("div",{className:w("glass-w-12 glass-h-1.5 glass-surface-secondary glass-radius-full")})}),e.jsx("div",{className:"glass-px-6 glass-pb-6 glass-overflow-y-auto glass-max-h-full",children:r})]})]})})}try{E.displayName="TouchOptimizedGlass",E.__docgenInfo={description:"",displayName:"TouchOptimizedGlass",props:{swipeThreshold:{defaultValue:{value:"50"},description:"",name:"swipeThreshold",required:!1,type:{name:"number | undefined"}},onSwipeLeft:{defaultValue:null,description:"",name:"onSwipeLeft",required:!1,type:{name:"(() => void) | undefined"}},onSwipeRight:{defaultValue:null,description:"",name:"onSwipeRight",required:!1,type:{name:"(() => void) | undefined"}},onSwipeUp:{defaultValue:null,description:"",name:"onSwipeUp",required:!1,type:{name:"(() => void) | undefined"}},onSwipeDown:{defaultValue:null,description:"",name:"onSwipeDown",required:!1,type:{name:"(() => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{W.displayName="TouchGlassOptimization",W.__docgenInfo={description:"",displayName:"TouchGlassOptimization",props:{onTap:{defaultValue:null,description:`Callback when the tap gesture successfully ends on this element.

\`\`\`jsx
function onTap(event, info) {
  console.log(info.point.x, info.point.y)
}

<motion.div onTap={onTap} />
\`\`\``,name:"onTap",required:!1,type:{name:"(() => void) | undefined"}},onLongPress:{defaultValue:null,description:"",name:"onLongPress",required:!1,type:{name:"(() => void) | undefined"}},onSwipe:{defaultValue:null,description:"",name:"onSwipe",required:!1,type:{name:'((direction: "left" | "right" | "up" | "down") => void) | undefined'}},touchFeedback:{defaultValue:{value:"true"},description:"",name:"touchFeedback",required:!1,type:{name:"boolean | undefined"}},rippleEffect:{defaultValue:{value:"true"},description:"",name:"rippleEffect",required:!1,type:{name:"boolean | undefined"}},hapticsEnabled:{defaultValue:{value:"true"},description:"",name:"hapticsEnabled",required:!1,type:{name:"boolean | undefined"}},glassIntensity:{defaultValue:{value:"medium"},description:"",name:"glassIntensity",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"light"'},{value:'"heavy"'}]}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},defaultChecked:{defaultValue:null,description:"",name:"defaultChecked",required:!1,type:{name:"boolean | undefined"}},defaultValue:{defaultValue:null,description:"",name:"defaultValue",required:!1,type:{name:"string | number | readonly string[] | undefined"}},suppressContentEditableWarning:{defaultValue:null,description:"",name:"suppressContentEditableWarning",required:!1,type:{name:"boolean | undefined"}},suppressHydrationWarning:{defaultValue:null,description:"",name:"suppressHydrationWarning",required:!1,type:{name:"boolean | undefined"}},accessKey:{defaultValue:null,description:"",name:"accessKey",required:!1,type:{name:"string | undefined"}},autoCapitalize:{defaultValue:null,description:"",name:"autoCapitalize",required:!1,type:{name:'"none" | (string & {}) | "off" | "on" | "sentences" | "words" | "characters" | undefined'}},autoFocus:{defaultValue:null,description:"",name:"autoFocus",required:!1,type:{name:"boolean | undefined"}},contentEditable:{defaultValue:null,description:"",name:"contentEditable",required:!1,type:{name:'"inherit" | Booleanish | "plaintext-only" | undefined'}},contextMenu:{defaultValue:null,description:"",name:"contextMenu",required:!1,type:{name:"string | undefined"}},dir:{defaultValue:null,description:"",name:"dir",required:!1,type:{name:"string | undefined"}},draggable:{defaultValue:null,description:"",name:"draggable",required:!1,type:{name:"Booleanish | undefined"}},enterKeyHint:{defaultValue:null,description:"",name:"enterKeyHint",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"search"'},{value:'"next"'},{value:'"enter"'},{value:'"done"'},{value:'"go"'},{value:'"previous"'},{value:'"send"'}]}},hidden:{defaultValue:null,description:"",name:"hidden",required:!1,type:{name:"boolean | undefined"}},id:{defaultValue:null,description:"",name:"id",required:!1,type:{name:"string | undefined"}},lang:{defaultValue:null,description:"",name:"lang",required:!1,type:{name:"string | undefined"}},nonce:{defaultValue:null,description:"",name:"nonce",required:!1,type:{name:"string | undefined"}},slot:{defaultValue:null,description:"",name:"slot",required:!1,type:{name:"string | undefined"}},spellCheck:{defaultValue:null,description:"",name:"spellCheck",required:!1,type:{name:"Booleanish | undefined"}},tabIndex:{defaultValue:null,description:"",name:"tabIndex",required:!1,type:{name:"number | undefined"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string | undefined"}},translate:{defaultValue:null,description:"",name:"translate",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"yes"'},{value:'"no"'}]}},radioGroup:{defaultValue:null,description:"",name:"radioGroup",required:!1,type:{name:"string | undefined"}},role:{defaultValue:null,description:"",name:"role",required:!1,type:{name:"AriaRole | undefined"}},about:{defaultValue:null,description:"",name:"about",required:!1,type:{name:"string | undefined"}},content:{defaultValue:null,description:"",name:"content",required:!1,type:{name:"string | undefined"}},datatype:{defaultValue:null,description:"",name:"datatype",required:!1,type:{name:"string | undefined"}},inlist:{defaultValue:null,description:"",name:"inlist",required:!1,type:{name:"any"}},prefix:{defaultValue:null,description:"",name:"prefix",required:!1,type:{name:"string | undefined"}},property:{defaultValue:null,description:"",name:"property",required:!1,type:{name:"string | undefined"}},rel:{defaultValue:null,description:"",name:"rel",required:!1,type:{name:"string | undefined"}},resource:{defaultValue:null,description:"",name:"resource",required:!1,type:{name:"string | undefined"}},rev:{defaultValue:null,description:"",name:"rev",required:!1,type:{name:"string | undefined"}},typeof:{defaultValue:null,description:"",name:"typeof",required:!1,type:{name:"string | undefined"}},vocab:{defaultValue:null,description:"",name:"vocab",required:!1,type:{name:"string | undefined"}},autoCorrect:{defaultValue:null,description:"",name:"autoCorrect",required:!1,type:{name:"string | undefined"}},autoSave:{defaultValue:null,description:"",name:"autoSave",required:!1,type:{name:"string | undefined"}},color:{defaultValue:null,description:"",name:"color",required:!1,type:{name:"string | undefined"}},itemProp:{defaultValue:null,description:"",name:"itemProp",required:!1,type:{name:"string | undefined"}},itemScope:{defaultValue:null,description:"",name:"itemScope",required:!1,type:{name:"boolean | undefined"}},itemType:{defaultValue:null,description:"",name:"itemType",required:!1,type:{name:"string | undefined"}},itemID:{defaultValue:null,description:"",name:"itemID",required:!1,type:{name:"string | undefined"}},itemRef:{defaultValue:null,description:"",name:"itemRef",required:!1,type:{name:"string | undefined"}},results:{defaultValue:null,description:"",name:"results",required:!1,type:{name:"number | undefined"}},security:{defaultValue:null,description:"",name:"security",required:!1,type:{name:"string | undefined"}},unselectable:{defaultValue:null,description:"",name:"unselectable",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"off"'},{value:'"on"'}]}},inputMode:{defaultValue:null,description:"",name:"inputMode",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"search"'},{value:'"none"'},{value:'"text"'},{value:'"tel"'},{value:'"url"'},{value:'"email"'},{value:'"numeric"'},{value:'"decimal"'}]}},is:{defaultValue:null,description:"",name:"is",required:!1,type:{name:"string | undefined"}},exportparts:{defaultValue:null,description:"",name:"exportparts",required:!1,type:{name:"string | undefined"}},part:{defaultValue:null,description:"",name:"part",required:!1,type:{name:"string | undefined"}},"aria-activedescendant":{defaultValue:null,description:"",name:"aria-activedescendant",required:!1,type:{name:"string | undefined"}},"aria-atomic":{defaultValue:null,description:"",name:"aria-atomic",required:!1,type:{name:"Booleanish | undefined"}},"aria-autocomplete":{defaultValue:null,description:"",name:"aria-autocomplete",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"both"'},{value:'"inline"'},{value:'"list"'}]}},"aria-braillelabel":{defaultValue:null,description:"",name:"aria-braillelabel",required:!1,type:{name:"string | undefined"}},"aria-brailleroledescription":{defaultValue:null,description:"",name:"aria-brailleroledescription",required:!1,type:{name:"string | undefined"}},"aria-busy":{defaultValue:null,description:"",name:"aria-busy",required:!1,type:{name:"Booleanish | undefined"}},"aria-checked":{defaultValue:null,description:"",name:"aria-checked",required:!1,type:{name:'boolean | "mixed" | "false" | "true" | undefined'}},"aria-colcount":{defaultValue:null,description:"",name:"aria-colcount",required:!1,type:{name:"number | undefined"}},"aria-colindex":{defaultValue:null,description:"",name:"aria-colindex",required:!1,type:{name:"number | undefined"}},"aria-colindextext":{defaultValue:null,description:"",name:"aria-colindextext",required:!1,type:{name:"string | undefined"}},"aria-colspan":{defaultValue:null,description:"",name:"aria-colspan",required:!1,type:{name:"number | undefined"}},"aria-controls":{defaultValue:null,description:"",name:"aria-controls",required:!1,type:{name:"string | undefined"}},"aria-current":{defaultValue:null,description:"",name:"aria-current",required:!1,type:{name:'boolean | "time" | "page" | "false" | "true" | "step" | "location" | "date" | undefined'}},"aria-describedby":{defaultValue:null,description:"",name:"aria-describedby",required:!1,type:{name:"string | undefined"}},"aria-description":{defaultValue:null,description:"",name:"aria-description",required:!1,type:{name:"string | undefined"}},"aria-details":{defaultValue:null,description:"",name:"aria-details",required:!1,type:{name:"string | undefined"}},"aria-disabled":{defaultValue:null,description:"",name:"aria-disabled",required:!1,type:{name:"Booleanish | undefined"}},"aria-dropeffect":{defaultValue:null,description:"",name:"aria-dropeffect",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"link"'},{value:'"none"'},{value:'"copy"'},{value:'"move"'},{value:'"execute"'},{value:'"popup"'}]}},"aria-errormessage":{defaultValue:null,description:"",name:"aria-errormessage",required:!1,type:{name:"string | undefined"}},"aria-expanded":{defaultValue:null,description:"",name:"aria-expanded",required:!1,type:{name:"Booleanish | undefined"}},"aria-flowto":{defaultValue:null,description:"",name:"aria-flowto",required:!1,type:{name:"string | undefined"}},"aria-grabbed":{defaultValue:null,description:"",name:"aria-grabbed",required:!1,type:{name:"Booleanish | undefined"}},"aria-haspopup":{defaultValue:null,description:"",name:"aria-haspopup",required:!1,type:{name:'boolean | "dialog" | "menu" | "listbox" | "grid" | "false" | "true" | "tree" | undefined'}},"aria-hidden":{defaultValue:null,description:"",name:"aria-hidden",required:!1,type:{name:"Booleanish | undefined"}},"aria-invalid":{defaultValue:null,description:"",name:"aria-invalid",required:!1,type:{name:'boolean | "false" | "true" | "grammar" | "spelling" | undefined'}},"aria-keyshortcuts":{defaultValue:null,description:"",name:"aria-keyshortcuts",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}},"aria-labelledby":{defaultValue:null,description:"",name:"aria-labelledby",required:!1,type:{name:"string | undefined"}},"aria-level":{defaultValue:null,description:"",name:"aria-level",required:!1,type:{name:"number | undefined"}},"aria-live":{defaultValue:null,description:"",name:"aria-live",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"off"'},{value:'"assertive"'},{value:'"polite"'}]}},"aria-modal":{defaultValue:null,description:"",name:"aria-modal",required:!1,type:{name:"Booleanish | undefined"}},"aria-multiline":{defaultValue:null,description:"",name:"aria-multiline",required:!1,type:{name:"Booleanish | undefined"}},"aria-multiselectable":{defaultValue:null,description:"",name:"aria-multiselectable",required:!1,type:{name:"Booleanish | undefined"}},"aria-orientation":{defaultValue:null,description:"",name:"aria-orientation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"horizontal"'},{value:'"vertical"'}]}},"aria-owns":{defaultValue:null,description:"",name:"aria-owns",required:!1,type:{name:"string | undefined"}},"aria-placeholder":{defaultValue:null,description:"",name:"aria-placeholder",required:!1,type:{name:"string | undefined"}},"aria-posinset":{defaultValue:null,description:"",name:"aria-posinset",required:!1,type:{name:"number | undefined"}},"aria-pressed":{defaultValue:null,description:"",name:"aria-pressed",required:!1,type:{name:'boolean | "mixed" | "false" | "true" | undefined'}},"aria-readonly":{defaultValue:null,description:"",name:"aria-readonly",required:!1,type:{name:"Booleanish | undefined"}},"aria-relevant":{defaultValue:null,description:"",name:"aria-relevant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"all"'},{value:'"text"'},{value:'"additions"'},{value:'"additions removals"'},{value:'"additions text"'},{value:'"removals"'},{value:'"removals additions"'},{value:'"removals text"'},{value:'"text additions"'},{value:'"text removals"'}]}},"aria-required":{defaultValue:null,description:"",name:"aria-required",required:!1,type:{name:"Booleanish | undefined"}},"aria-roledescription":{defaultValue:null,description:"",name:"aria-roledescription",required:!1,type:{name:"string | undefined"}},"aria-rowcount":{defaultValue:null,description:"",name:"aria-rowcount",required:!1,type:{name:"number | undefined"}},"aria-rowindex":{defaultValue:null,description:"",name:"aria-rowindex",required:!1,type:{name:"number | undefined"}},"aria-rowindextext":{defaultValue:null,description:"",name:"aria-rowindextext",required:!1,type:{name:"string | undefined"}},"aria-rowspan":{defaultValue:null,description:"",name:"aria-rowspan",required:!1,type:{name:"number | undefined"}},"aria-selected":{defaultValue:null,description:"",name:"aria-selected",required:!1,type:{name:"Booleanish | undefined"}},"aria-setsize":{defaultValue:null,description:"",name:"aria-setsize",required:!1,type:{name:"number | undefined"}},"aria-sort":{defaultValue:null,description:"",name:"aria-sort",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"ascending"'},{value:'"descending"'},{value:'"other"'}]}},"aria-valuemax":{defaultValue:null,description:"",name:"aria-valuemax",required:!1,type:{name:"number | undefined"}},"aria-valuemin":{defaultValue:null,description:"",name:"aria-valuemin",required:!1,type:{name:"number | undefined"}},"aria-valuenow":{defaultValue:null,description:"",name:"aria-valuenow",required:!1,type:{name:"number | undefined"}},"aria-valuetext":{defaultValue:null,description:"",name:"aria-valuetext",required:!1,type:{name:"string | undefined"}},dangerouslySetInnerHTML:{defaultValue:null,description:"",name:"dangerouslySetInnerHTML",required:!1,type:{name:"{ __html: string | TrustedHTML; } | undefined"}},onCopy:{defaultValue:null,description:"",name:"onCopy",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onCopyCapture:{defaultValue:null,description:"",name:"onCopyCapture",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onCut:{defaultValue:null,description:"",name:"onCut",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onCutCapture:{defaultValue:null,description:"",name:"onCutCapture",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onPaste:{defaultValue:null,description:"",name:"onPaste",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onPasteCapture:{defaultValue:null,description:"",name:"onPasteCapture",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onCompositionEnd:{defaultValue:null,description:"",name:"onCompositionEnd",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onCompositionEndCapture:{defaultValue:null,description:"",name:"onCompositionEndCapture",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onCompositionStart:{defaultValue:null,description:"",name:"onCompositionStart",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onCompositionStartCapture:{defaultValue:null,description:"",name:"onCompositionStartCapture",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onCompositionUpdate:{defaultValue:null,description:"",name:"onCompositionUpdate",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onCompositionUpdateCapture:{defaultValue:null,description:"",name:"onCompositionUpdateCapture",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onFocus:{defaultValue:null,description:"",name:"onFocus",required:!1,type:{name:"FocusEventHandler<HTMLDivElement> | undefined"}},onFocusCapture:{defaultValue:null,description:"",name:"onFocusCapture",required:!1,type:{name:"FocusEventHandler<HTMLDivElement> | undefined"}},onBlur:{defaultValue:null,description:"",name:"onBlur",required:!1,type:{name:"FocusEventHandler<HTMLDivElement> | undefined"}},onBlurCapture:{defaultValue:null,description:"",name:"onBlurCapture",required:!1,type:{name:"FocusEventHandler<HTMLDivElement> | undefined"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onChangeCapture:{defaultValue:null,description:"",name:"onChangeCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onBeforeInput:{defaultValue:null,description:"",name:"onBeforeInput",required:!1,type:{name:"InputEventHandler<HTMLDivElement> | undefined"}},onBeforeInputCapture:{defaultValue:null,description:"",name:"onBeforeInputCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onInput:{defaultValue:null,description:"",name:"onInput",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onInputCapture:{defaultValue:null,description:"",name:"onInputCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onReset:{defaultValue:null,description:"",name:"onReset",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onResetCapture:{defaultValue:null,description:"",name:"onResetCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onSubmit:{defaultValue:null,description:"",name:"onSubmit",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onSubmitCapture:{defaultValue:null,description:"",name:"onSubmitCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onInvalid:{defaultValue:null,description:"",name:"onInvalid",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onInvalidCapture:{defaultValue:null,description:"",name:"onInvalidCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onLoad:{defaultValue:null,description:"",name:"onLoad",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadCapture:{defaultValue:null,description:"",name:"onLoadCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onError:{defaultValue:null,description:"",name:"onError",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onErrorCapture:{defaultValue:null,description:"",name:"onErrorCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onKeyDown:{defaultValue:null,description:"",name:"onKeyDown",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onKeyDownCapture:{defaultValue:null,description:"",name:"onKeyDownCapture",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onKeyPress:{defaultValue:null,description:"",name:"onKeyPress",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onKeyPressCapture:{defaultValue:null,description:"",name:"onKeyPressCapture",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onKeyUp:{defaultValue:null,description:"",name:"onKeyUp",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onKeyUpCapture:{defaultValue:null,description:"",name:"onKeyUpCapture",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onAbort:{defaultValue:null,description:"",name:"onAbort",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onAbortCapture:{defaultValue:null,description:"",name:"onAbortCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onCanPlay:{defaultValue:null,description:"",name:"onCanPlay",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onCanPlayCapture:{defaultValue:null,description:"",name:"onCanPlayCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onCanPlayThrough:{defaultValue:null,description:"",name:"onCanPlayThrough",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onCanPlayThroughCapture:{defaultValue:null,description:"",name:"onCanPlayThroughCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onDurationChange:{defaultValue:null,description:"",name:"onDurationChange",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onDurationChangeCapture:{defaultValue:null,description:"",name:"onDurationChangeCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEmptied:{defaultValue:null,description:"",name:"onEmptied",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEmptiedCapture:{defaultValue:null,description:"",name:"onEmptiedCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEncrypted:{defaultValue:null,description:"",name:"onEncrypted",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEncryptedCapture:{defaultValue:null,description:"",name:"onEncryptedCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEnded:{defaultValue:null,description:"",name:"onEnded",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEndedCapture:{defaultValue:null,description:"",name:"onEndedCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadedData:{defaultValue:null,description:"",name:"onLoadedData",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadedDataCapture:{defaultValue:null,description:"",name:"onLoadedDataCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadedMetadata:{defaultValue:null,description:"",name:"onLoadedMetadata",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadedMetadataCapture:{defaultValue:null,description:"",name:"onLoadedMetadataCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadStart:{defaultValue:null,description:"",name:"onLoadStart",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadStartCapture:{defaultValue:null,description:"",name:"onLoadStartCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPause:{defaultValue:null,description:"",name:"onPause",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPauseCapture:{defaultValue:null,description:"",name:"onPauseCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPlay:{defaultValue:null,description:"",name:"onPlay",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPlayCapture:{defaultValue:null,description:"",name:"onPlayCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPlaying:{defaultValue:null,description:"",name:"onPlaying",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPlayingCapture:{defaultValue:null,description:"",name:"onPlayingCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onProgress:{defaultValue:null,description:"",name:"onProgress",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onProgressCapture:{defaultValue:null,description:"",name:"onProgressCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onRateChange:{defaultValue:null,description:"",name:"onRateChange",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onRateChangeCapture:{defaultValue:null,description:"",name:"onRateChangeCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSeeked:{defaultValue:null,description:"",name:"onSeeked",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSeekedCapture:{defaultValue:null,description:"",name:"onSeekedCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSeeking:{defaultValue:null,description:"",name:"onSeeking",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSeekingCapture:{defaultValue:null,description:"",name:"onSeekingCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onStalled:{defaultValue:null,description:"",name:"onStalled",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onStalledCapture:{defaultValue:null,description:"",name:"onStalledCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSuspend:{defaultValue:null,description:"",name:"onSuspend",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSuspendCapture:{defaultValue:null,description:"",name:"onSuspendCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onTimeUpdate:{defaultValue:null,description:"",name:"onTimeUpdate",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onTimeUpdateCapture:{defaultValue:null,description:"",name:"onTimeUpdateCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onVolumeChange:{defaultValue:null,description:"",name:"onVolumeChange",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onVolumeChangeCapture:{defaultValue:null,description:"",name:"onVolumeChangeCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onWaiting:{defaultValue:null,description:"",name:"onWaiting",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onWaitingCapture:{defaultValue:null,description:"",name:"onWaitingCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onAuxClick:{defaultValue:null,description:"",name:"onAuxClick",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onAuxClickCapture:{defaultValue:null,description:"",name:"onAuxClickCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onClickCapture:{defaultValue:null,description:"",name:"onClickCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onContextMenu:{defaultValue:null,description:"",name:"onContextMenu",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onContextMenuCapture:{defaultValue:null,description:"",name:"onContextMenuCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onDoubleClick:{defaultValue:null,description:"",name:"onDoubleClick",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onDoubleClickCapture:{defaultValue:null,description:"",name:"onDoubleClickCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onDragCapture:{defaultValue:null,description:"",name:"onDragCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragEndCapture:{defaultValue:null,description:"",name:"onDragEndCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragEnter:{defaultValue:null,description:"",name:"onDragEnter",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragEnterCapture:{defaultValue:null,description:"",name:"onDragEnterCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragExit:{defaultValue:null,description:"",name:"onDragExit",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragExitCapture:{defaultValue:null,description:"",name:"onDragExitCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragLeave:{defaultValue:null,description:"",name:"onDragLeave",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragLeaveCapture:{defaultValue:null,description:"",name:"onDragLeaveCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragOver:{defaultValue:null,description:"",name:"onDragOver",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragOverCapture:{defaultValue:null,description:"",name:"onDragOverCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragStartCapture:{defaultValue:null,description:"",name:"onDragStartCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDrop:{defaultValue:null,description:"",name:"onDrop",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDropCapture:{defaultValue:null,description:"",name:"onDropCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onMouseDown:{defaultValue:null,description:"",name:"onMouseDown",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseDownCapture:{defaultValue:null,description:"",name:"onMouseDownCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseEnter:{defaultValue:null,description:"",name:"onMouseEnter",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseLeave:{defaultValue:null,description:"",name:"onMouseLeave",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseMove:{defaultValue:null,description:"",name:"onMouseMove",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseMoveCapture:{defaultValue:null,description:"",name:"onMouseMoveCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseOut:{defaultValue:null,description:"",name:"onMouseOut",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseOutCapture:{defaultValue:null,description:"",name:"onMouseOutCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseOver:{defaultValue:null,description:"",name:"onMouseOver",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseOverCapture:{defaultValue:null,description:"",name:"onMouseOverCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseUp:{defaultValue:null,description:"",name:"onMouseUp",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseUpCapture:{defaultValue:null,description:"",name:"onMouseUpCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onSelect:{defaultValue:null,description:"",name:"onSelect",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSelectCapture:{defaultValue:null,description:"",name:"onSelectCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onTouchCancel:{defaultValue:null,description:"",name:"onTouchCancel",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchCancelCapture:{defaultValue:null,description:"",name:"onTouchCancelCapture",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchEnd:{defaultValue:null,description:"",name:"onTouchEnd",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchEndCapture:{defaultValue:null,description:"",name:"onTouchEndCapture",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchMove:{defaultValue:null,description:"",name:"onTouchMove",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchMoveCapture:{defaultValue:null,description:"",name:"onTouchMoveCapture",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchStart:{defaultValue:null,description:"",name:"onTouchStart",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchStartCapture:{defaultValue:null,description:"",name:"onTouchStartCapture",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onPointerDown:{defaultValue:null,description:"",name:"onPointerDown",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerDownCapture:{defaultValue:null,description:"",name:"onPointerDownCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerMove:{defaultValue:null,description:"",name:"onPointerMove",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerMoveCapture:{defaultValue:null,description:"",name:"onPointerMoveCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerUp:{defaultValue:null,description:"",name:"onPointerUp",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerUpCapture:{defaultValue:null,description:"",name:"onPointerUpCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerCancel:{defaultValue:null,description:"",name:"onPointerCancel",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerCancelCapture:{defaultValue:null,description:"",name:"onPointerCancelCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerEnter:{defaultValue:null,description:"",name:"onPointerEnter",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerLeave:{defaultValue:null,description:"",name:"onPointerLeave",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerOver:{defaultValue:null,description:"",name:"onPointerOver",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerOverCapture:{defaultValue:null,description:"",name:"onPointerOverCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerOut:{defaultValue:null,description:"",name:"onPointerOut",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerOutCapture:{defaultValue:null,description:"",name:"onPointerOutCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onGotPointerCapture:{defaultValue:null,description:"",name:"onGotPointerCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onGotPointerCaptureCapture:{defaultValue:null,description:"",name:"onGotPointerCaptureCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onLostPointerCapture:{defaultValue:null,description:"",name:"onLostPointerCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onLostPointerCaptureCapture:{defaultValue:null,description:"",name:"onLostPointerCaptureCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onScroll:{defaultValue:null,description:"",name:"onScroll",required:!1,type:{name:"UIEventHandler<HTMLDivElement> | undefined"}},onScrollCapture:{defaultValue:null,description:"",name:"onScrollCapture",required:!1,type:{name:"UIEventHandler<HTMLDivElement> | undefined"}},onWheel:{defaultValue:null,description:"",name:"onWheel",required:!1,type:{name:"WheelEventHandler<HTMLDivElement> | undefined"}},onWheelCapture:{defaultValue:null,description:"",name:"onWheelCapture",required:!1,type:{name:"WheelEventHandler<HTMLDivElement> | undefined"}},onAnimationStartCapture:{defaultValue:null,description:"",name:"onAnimationStartCapture",required:!1,type:{name:"AnimationEventHandler<HTMLDivElement> | undefined"}},onAnimationEnd:{defaultValue:null,description:"",name:"onAnimationEnd",required:!1,type:{name:"AnimationEventHandler<HTMLDivElement> | undefined"}},onAnimationEndCapture:{defaultValue:null,description:"",name:"onAnimationEndCapture",required:!1,type:{name:"AnimationEventHandler<HTMLDivElement> | undefined"}},onAnimationIteration:{defaultValue:null,description:"",name:"onAnimationIteration",required:!1,type:{name:"AnimationEventHandler<HTMLDivElement> | undefined"}},onAnimationIterationCapture:{defaultValue:null,description:"",name:"onAnimationIterationCapture",required:!1,type:{name:"AnimationEventHandler<HTMLDivElement> | undefined"}},onTransitionEnd:{defaultValue:null,description:"",name:"onTransitionEnd",required:!1,type:{name:"TransitionEventHandler<HTMLDivElement> | undefined"}},onTransitionEndCapture:{defaultValue:null,description:"",name:"onTransitionEndCapture",required:!1,type:{name:"TransitionEventHandler<HTMLDivElement> | undefined"}}}}}catch{}const se=`
  .ag-touch-story-surface {
    --glass-text-primary: rgba(24, 24, 24, 0.94);
    --glass-text-secondary: rgba(48, 48, 48, 0.76);
    --glass-text-tertiary: rgba(72, 72, 72, 0.64);
    --typography-text-primary: rgba(24, 24, 24, 0.94);
    --typography-text-secondary: rgba(48, 48, 48, 0.76);
    --glass-neutral-level2-surface: linear-gradient(135deg, rgba(255, 255, 255, 0.64), rgba(255, 255, 255, 0.38));
    height: 100vh;
    min-height: 100vh;
    width: 100%;
    overflow: auto;
    box-sizing: border-box;
    background:
      radial-gradient(circle at 18% 12%, rgba(255, 255, 255, 0.92), transparent 34%),
      radial-gradient(circle at 82% 16%, rgba(196, 196, 196, 0.2), transparent 32%),
      linear-gradient(135deg, #fafafa 0%, #eeeeee 48%, #dedede 100%);
    color: rgba(24, 24, 24, 0.94);
    padding: clamp(16px, 4vw, 32px);
  }

  .ag-touch-story-surface,
  .ag-touch-story-surface *,
  .ag-touch-story-surface *::before,
  .ag-touch-story-surface *::after {
    box-sizing: border-box;
  }

  .ag-touch-story-surface .glass-text-primary,
  .ag-touch-story-surface .glass-text-secondary,
  .ag-touch-story-surface h1,
  .ag-touch-story-surface h2,
  .ag-touch-story-surface h3,
  .ag-touch-story-surface h4,
  .ag-touch-story-surface p,
  .ag-touch-story-surface span,
  .ag-touch-story-surface div {
    color: rgba(24, 24, 24, 0.94) !important;
  }

  .ag-touch-story-surface .glass-surface-subtle\\/10 {
    background: rgba(255, 255, 255, 0.2) !important;
    color: rgba(24, 24, 24, 0.94) !important;
  }

  .ag-touch-story-surface .glass-surface-subtle\\/20,
  .ag-touch-story-surface .glass-surface-blue\\/20,
  .ag-touch-story-surface .glass-surface-green\\/20 {
    background: rgba(255, 255, 255, 0.28) !important;
    color: rgba(24, 24, 24, 0.94) !important;
  }

  .ag-touch-story-surface .glass-contrast-guard {
    color: rgba(24, 24, 24, 0.94) !important;
  }

  .ag-touch-story-surface :is(.glass-surface-blue, .glass-surface-green, .glass-surface-primary) {
    background: rgba(255, 255, 255, 0.28) !important;
  }

  .ag-touch-story-surface button:disabled {
    opacity: 0.52;
    cursor: not-allowed;
  }

  .ag-touch-story-surface button {
    background: rgba(255, 255, 255, 0.28) !important;
    color: rgba(24, 24, 24, 0.94) !important;
    border-color: rgba(32, 32, 32, 0.12) !important;
  }

  .ag-touch-story-surface .glass-grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .ag-touch-story-surface .glass-grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ag-touch-story-surface .max-w-4xl {
    max-width: 56rem;
  }

  .ag-touch-story-surface .max-w-6xl {
    max-width: 72rem;
  }

  .ag-touch-story-surface .max-w-xs {
    max-width: 20rem;
  }

  .ag-touch-story-surface .mb-6 {
    margin-bottom: 1.5rem;
  }

  .ag-touch-story-surface .mb-8 {
    margin-bottom: 2rem;
  }

  .ag-touch-story-surface .mt-8 {
    margin-top: 2rem;
  }

  .ag-touch-story-surface .mb-12 {
    margin-bottom: 3rem;
  }

  .ag-touch-story-surface .mt-4 {
    margin-top: 1rem;
  }

  .ag-touch-story-surface .pt-4 {
    padding-top: 1rem;
  }

  .ag-touch-story-surface .space-y-6 > * + * {
    margin-top: 1.5rem;
  }

  .ag-touch-story-surface .min-h-\\[200px\\] {
    min-height: 200px;
  }

  .ag-touch-story-surface .fixed.bottom-0.left-0.right-0.z-50 {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    max-height: min(82vh, calc(100vh - 24px));
    overflow: auto;
  }

  .ag-touch-story-surface [class*="overflow-hidden"] {
    overflow: visible;
  }

  @media (max-width: 640px) {
    .ag-touch-story-surface {
      padding: 16px;
    }

    .ag-touch-story-surface .glass-grid {
      min-width: 0;
    }
  }

  @media (min-width: 768px) {
    .ag-touch-story-surface .md\\:glass-grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .ag-touch-story-surface .md\\:glass-grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .ag-touch-story-surface .md\\:glass-grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  @media (min-width: 1024px) {
    .ag-touch-story-surface .lg\\:glass-grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .ag-touch-story-surface .lg\\:glass-grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
`,re={title:"Effects + Advanced/Touch Glass Optimization",component:E,parameters:{docs:{description:{component:"Comprehensive touch interaction optimization for glassmorphism components with haptic feedback, gesture recognition, and mobile-first interactions."}},layout:"fullscreen"},decorators:[s=>e.jsxs(e.Fragment,{children:[e.jsx("style",{children:se}),e.jsx(s,{})]})],tags:["autodocs"]},ae=()=>{const[s,i]=l.useState(0),[r,d]=l.useState(0),[n,a]=l.useState(null),[o,t]=l.useState(""),g=()=>{i(u=>u+1),t("Tap")},v=()=>{d(u=>u+1),t("Long Press")},c=u=>{a(u),t(`Swipe ${u}`)};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"glass-text-center",children:[e.jsx("h2",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"Touch Glass Interactions"}),e.jsx("p",{className:"glass-text-primary",children:"Try tapping, long pressing, and swiping on the glass below"})]}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-6",children:[e.jsxs("div",{className:"glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-text-center glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-2",children:s}),e.jsx("div",{className:"glass-text-primary",children:"Taps"})]}),e.jsxs("div",{className:"glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-text-center glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-2",children:r}),e.jsx("div",{className:"glass-text-primary",children:"Long Presses"})]}),e.jsxs("div",{className:"glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-text-center glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-2",children:n?n.toUpperCase():"—"}),e.jsx("div",{className:"glass-text-primary",children:"Last Swipe"})]})]}),e.jsx("div",{className:"glass-text-center",children:e.jsxs("div",{className:"inline-glass-block glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-px-6 glass-py-3 glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-primary glass-text-sm",children:"Last Action:"}),e.jsx("div",{className:"glass-text-primary glass-font-medium",children:o||"None"})]})}),e.jsx("div",{className:"glass-text-center",children:e.jsx(E,{onTap:g,onLongPress:v,onSwipe:c,touchFeedback:!0,rippleEffect:!0,hapticsEnabled:!0,glassIntensity:"medium",className:"glass-mx-auto",children:e.jsxs("div",{className:"glass-p-8 min-h-[200px] glass-flex glass-flex-col glass-items-center glass-justify-center",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"👆"}),e.jsx("div",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Touch Glass"}),e.jsx("div",{className:"glass-text-primary glass-text-sm glass-text-center max-w-xs",children:"Tap, long press, or swipe this glass surface to see different interactions"})]})})}),e.jsxs("div",{className:"glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard",children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Touch Instructions"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4 glass-text-primary",children:[e.jsxs("div",{className:"glass-space-y-2",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-blue"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Tap:"})," Quick touch for immediate action"]})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Long Press:"})," Hold for 500ms for context menu"]})]})]}),e.jsxs("div",{className:"glass-space-y-2",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-primary"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Swipe Left/Right:"})," Navigate between content"]})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-primary"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Swipe Up/Down:"})," Scroll or dismiss"]})]})]})]})]})]})},R={args:{},render:()=>e.jsx("div",{className:"ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:e.jsx("div",{className:"max-w-4xl glass-mx-auto",children:e.jsx(ae,{})})})},A={args:{touchFeedback:!0,rippleEffect:!0,hapticsEnabled:!0,children:e.jsxs("div",{className:"glass-p-6 glass-text-center",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"📱"}),e.jsx("div",{className:"glass-text-primary glass-font-medium",children:"Touch Feedback"}),e.jsx("div",{className:"glass-text-primary glass-text-sm",children:"Visual, haptic, and ripple effects"})]})},render:s=>e.jsx("div",{className:"ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:e.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[e.jsxs("div",{className:"glass-text-center mb-12",children:[e.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"🎯 Touch Feedback Demo"}),e.jsx("p",{className:"glass-text-xl glass-text-primary",children:"Experience visual feedback, haptic responses, and ripple effects"})]}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-8 mb-12",children:[e.jsx(E,{...s,onTap:()=>console.log("Light feedback"),glassIntensity:"light"}),e.jsx(E,{...s,onTap:()=>console.log("Medium feedback"),glassIntensity:"medium"}),e.jsx(E,{...s,onTap:()=>console.log("Heavy feedback"),glassIntensity:"heavy"})]}),e.jsxs("div",{className:"glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard",children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Feedback Types"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-6",children:[e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"👆"}),e.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Visual Feedback"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Scale and opacity changes on touch"})]}),e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"📳"}),e.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Haptic Feedback"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Vibration patterns for touch confirmation"})]}),e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"💫"}),e.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Ripple Effects"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Material Design-inspired touch ripples"})]})]})]})]})})},O={args:{},render:()=>{const[s,i]=l.useState(0),[r,d]=l.useState([]),n=[{title:"Dashboard",icon:"📊",color:"linear-gradient(135deg, #3b82f6, #06b6d4)"},{title:"Messages",icon:"💬",color:"linear-gradient(135deg, #22c55e, #10b981)"},{title:"Settings",icon:"⚙️",color:"linear-gradient(135deg, #8b5cf6, #ec4899)"},{title:"Profile",icon:"👤",color:"linear-gradient(135deg, #f97316, #ef4444)"}],a=o=>{d(t=>[...t.slice(-4),o]),o==="left"&&s<n.length-1?i(t=>t+1):o==="right"&&s>0&&i(t=>t-1)};return e.jsx("div",{className:"ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:e.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[e.jsxs("div",{className:"glass-text-center mb-12",children:[e.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"📱 Mobile Glass Navigation"}),e.jsx("p",{className:"glass-text-xl glass-text-primary",children:"Swipe left/right to navigate between pages"})]}),e.jsxs("div",{className:"mb-8",children:[e.jsx("div",{className:"glass-flex glass-justify-center glass-gap-2 glass-mb-4",children:n.map((o,t)=>e.jsx("div",{className:"glass-radius-full",style:{width:12,height:12,background:t===s?"#fff":"rgba(255,255,255,0.36)",transition:"background 160ms ease"}},t))}),e.jsx("div",{className:"glass-text-center mb-6",children:e.jsxs("div",{className:"inline-glass-block glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-px-6 glass-py-3 glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-primary glass-text-sm",children:"Current Page"}),e.jsx("div",{className:"glass-text-primary glass-font-medium",children:n[s].title})]})})]}),e.jsx(ee,{onSwipeLeft:()=>a("left"),onSwipeRight:()=>a("right"),onSwipeUp:()=>a("up"),onSwipeDown:()=>a("down"),children:e.jsxs("div",{className:"glass-p-8 glass-text-center",children:[e.jsx("div",{className:"glass-radius-2xl glass-mb-6",style:{display:"inline-block",padding:32,background:n[s].color},children:e.jsx("div",{className:"glass-text-6xl",children:n[s].icon})}),e.jsx("h2",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:n[s].title}),e.jsx("p",{className:"glass-text-primary glass-text-lg",children:"Swipe left or right to navigate between different sections"})]})}),e.jsxs("div",{className:"mt-8 glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard",children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Swipe History"}),e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-2",children:r.length===0?e.jsx("div",{className:"glass-text-primary",children:"No swipes yet"}):r.map((o,t)=>e.jsxs("div",{className:"glass-px-3 glass-py-1 glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-text-sm",children:[o," →"]},t))})]}),e.jsxs("div",{className:"mt-8 glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard",children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Navigation Controls"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4",children:[e.jsx("button",{onClick:()=>a("left"),className:"glass-px-4 glass-py-2 glass-surface-blue/20 hover:glass-surface-blue/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",disabled:s>=n.length-1,children:"← Left"}),e.jsx("button",{onClick:()=>a("right"),className:"glass-px-4 glass-py-2 glass-surface-blue/20 hover:glass-surface-blue/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",disabled:s<=0,children:"Right →"}),e.jsx("button",{onClick:()=>a("up"),className:"glass-px-4 glass-py-2 glass-surface-green/20 hover:glass-surface-green/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"↑ Up"}),e.jsx("button",{onClick:()=>a("down"),className:"glass-px-4 glass-py-2 glass-surface-green/20 hover:glass-surface-green/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"Down ↓"})]})]})]})})}},F={args:{},render:()=>e.jsx("div",{className:"ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:e.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[e.jsxs("div",{className:"glass-text-center mb-12",children:[e.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"📐 Adaptive Glass Density"}),e.jsx("p",{className:"glass-text-xl glass-text-primary",children:"Glass effects that automatically adapt to screen size and device capabilities"})]}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-3 glass-gap-8 mb-12",children:[e.jsx(K,{screenSize:"small",devicePixelRatio:1,autoAdapt:!0,children:e.jsxs("div",{className:"glass-p-6 glass-text-center",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"📱"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Mobile (Small)"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Optimized for small screens with reduced effects for better performance"}),e.jsxs("div",{className:"mt-4 glass-text-primary glass-text-xs",children:["• Lower density effects",e.jsx("br",{}),"• Reduced blur intensity",e.jsx("br",{}),"• Minimal animations",e.jsx("br",{}),"• Touch-optimized"]})]})}),e.jsx(K,{screenSize:"medium",devicePixelRatio:1.5,autoAdapt:!0,children:e.jsxs("div",{className:"glass-p-6 glass-text-center",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"💻"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Tablet (Medium)"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Balanced effects for medium screens with moderate performance impact"}),e.jsxs("div",{className:"mt-4 glass-text-primary glass-text-xs",children:["• Medium density effects",e.jsx("br",{}),"• Standard blur intensity",e.jsx("br",{}),"• Balanced animations",e.jsx("br",{}),"• Touch-friendly"]})]})}),e.jsx(K,{screenSize:"large",devicePixelRatio:2,autoAdapt:!0,children:e.jsxs("div",{className:"glass-p-6 glass-text-center",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"🖥️"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Desktop (Large)"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Full effects for large screens with high-performance capabilities"}),e.jsxs("div",{className:"mt-4 glass-text-primary glass-text-xs",children:["• High density effects",e.jsx("br",{}),"• Maximum blur intensity",e.jsx("br",{}),"• Complex animations",e.jsx("br",{}),"• Mouse optimized"]})]})})]}),e.jsxs("div",{className:"glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard",children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center",children:"Adaptive Features"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-4 glass-gap-6",children:[e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"📏"}),e.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Screen Size"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Adapts to viewport dimensions"})]}),e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"🔍"}),e.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Pixel Ratio"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Considers device pixel density"})]}),e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"⚡"}),e.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Performance"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Auto-adjusts based on capabilities"})]}),e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"♿"}),e.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Accessibility"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Maintains usability across devices"})]})]})]})]})})},z={args:{},render:()=>e.jsx("div",{className:"ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:e.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[e.jsxs("div",{className:"glass-text-center mb-12",children:[e.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"💫 Touch Ripple Effects"}),e.jsx("p",{className:"glass-text-xl glass-text-primary",children:"Material Design-inspired ripple effects with customizable colors and timing"})]}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-8 mb-12",children:[e.jsx(P,{color:"var(--glass-border-default)",maxRipples:3,rippleDuration:600,children:e.jsxs("div",{className:"glass-p-8 glass-text-center glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"🌊"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Default Ripple"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Standard white ripple with medium duration and up to 3 simultaneous ripples"})]})}),e.jsx(P,{color:"rgba(86, 94, 105, 0.38)",maxRipples:5,rippleDuration:800,children:e.jsxs("div",{className:"glass-p-8 glass-text-center glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"💙"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Soft Ripple"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Soft graphite ripple with longer duration and more simultaneous ripples"})]})}),e.jsx(P,{color:"rgba(44, 50, 59, 0.28)",maxRipples:2,rippleDuration:400,children:e.jsxs("div",{className:"glass-p-8 glass-text-center glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"💚"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Quick Ripple"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Fast neutral ripple with limited simultaneous effects for subtle feedback"})]})}),e.jsx(P,{color:"rgba(25, 30, 38, 0.34)",maxRipples:4,rippleDuration:1e3,children:e.jsxs("div",{className:"glass-p-8 glass-text-center glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"🧡"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Dramatic Ripple"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Deeper graphite ripple with slow, dramatic animation and multiple effects"})]})})]}),e.jsxs("div",{className:"glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard",children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center",children:"Ripple Effect Features"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-8",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-3",children:"Customization Options"}),e.jsxs("div",{className:"glass-space-y-2 glass-text-primary",children:[e.jsx("div",{children:"• Custom colors and opacity"}),e.jsx("div",{children:"• Adjustable animation duration"}),e.jsx("div",{children:"• Configurable ripple limits"}),e.jsx("div",{children:"• Size and scale control"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-3",children:"Performance Features"}),e.jsxs("div",{className:"glass-space-y-2 glass-text-primary",children:[e.jsx("div",{children:"• Efficient DOM manipulation"}),e.jsx("div",{children:"• Automatic cleanup"}),e.jsx("div",{children:"• GPU-accelerated animations"}),e.jsx("div",{children:"• Memory leak prevention"})]})]})]})]})]})})},G={args:{},render:()=>{const[s,i]=l.useState({menu:!1,settings:!1,profile:!1}),r=n=>{i(a=>({...a,[n]:!0}))},d=n=>{i(a=>({...a,[n]:!1}))};return e.jsx("div",{className:"ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:e.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[e.jsxs("div",{className:"glass-text-center mb-12",children:[e.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"📄 Mobile Glass Bottom Sheet"}),e.jsx("p",{className:"glass-text-xl glass-text-primary",children:"Touch-optimized bottom sheets with snap points and smooth animations"})]}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-6 mb-12",children:[e.jsx("div",{className:"glass-text-center",children:e.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-mb-4 glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"🍽️"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Menu Sheet"}),e.jsx("p",{className:"glass-text-primary glass-text-sm glass-mb-4",children:"Navigation menu with quick actions and shortcuts"}),e.jsx("button",{onClick:()=>r("menu"),className:"glass-px-6 glass-py-2 glass-surface-blue/20 hover:glass-surface-blue/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"Open Menu"})]})}),e.jsx("div",{className:"glass-text-center",children:e.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-mb-4 glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"⚙️"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Settings Sheet"}),e.jsx("p",{className:"glass-text-primary glass-text-sm glass-mb-4",children:"Configuration options and preferences panel"}),e.jsx("button",{onClick:()=>r("settings"),className:"glass-px-6 glass-py-2 glass-surface-green/20 hover:glass-surface-green/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"Open Settings"})]})}),e.jsx("div",{className:"glass-text-center",children:e.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-mb-4 glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"👤"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Profile Sheet"}),e.jsx("p",{className:"glass-text-primary glass-text-sm glass-mb-4",children:"User profile information and account settings"}),e.jsx("button",{onClick:()=>r("profile"),className:"glass-px-6 glass-py-2 glass-surface-primary/20 hover:glass-surface-primary/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"Open Profile"})]})})]}),e.jsx(_,{isOpen:s.menu,onClose:()=>d("menu"),height:"60vh",snapPoints:["30vh","60vh","80vh"],children:e.jsxs("div",{className:"glass-p-6",children:[e.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary mb-6",children:"Navigation Menu"}),e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"🏠 Home"}),e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"🔍 Search"}),e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"❤️ Favorites"}),e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"📱 Downloads"}),e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"⚙️ Settings"})]})]})}),e.jsx(_,{isOpen:s.settings,onClose:()=>d("settings"),height:"70vh",snapPoints:["40vh","70vh"],children:e.jsxs("div",{className:"glass-p-6",children:[e.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary mb-6",children:"Settings"}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsx("span",{className:"glass-text-primary glass-font-medium",children:"Notifications"}),e.jsx("div",{className:"glass-w-12 glass-h-6 glass-surface-subtle/20 glass-radius-full glass-p-1",children:e.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-subtle glass-radius-full transform translate-x-6"})})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsx("span",{className:"glass-text-primary glass-font-medium",children:"Dark Mode"}),e.jsx("div",{className:"glass-w-12 glass-h-6 glass-surface-blue glass-radius-full glass-p-1",children:e.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-subtle glass-radius-full"})})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsx("span",{className:"glass-text-primary glass-font-medium",children:"Auto-play"}),e.jsx("div",{className:"glass-w-12 glass-h-6 glass-surface-subtle/20 glass-radius-full glass-p-1",children:e.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-subtle glass-radius-full"})})]}),e.jsx("div",{className:"pt-4 glass-border-t glass-border-white/20",children:e.jsx("button",{className:"glass-w-full glass-p-3 glass-surface-red/20 hover:glass-surface-red/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"Clear Cache"})})]})]})}),e.jsx(_,{isOpen:s.profile,onClose:()=>d("profile"),height:"75vh",snapPoints:["50vh","75vh"],children:e.jsxs("div",{className:"glass-p-6",children:[e.jsxs("div",{className:"glass-text-center mb-6",children:[e.jsx("div",{className:"glass-w-20 glass-h-20 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full glass-mx-auto glass-mb-4 glass-flex glass-items-center glass-justify-center",children:e.jsx("span",{className:"glass-text-3xl",children:"👤"})}),e.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-2",children:"John Doe"}),e.jsx("p",{className:"glass-text-primary",children:"john.doe@example.com"})]}),e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"✏️ Edit Profile"}),e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"🔒 Privacy Settings"}),e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"🔔 Notification Preferences"}),e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"💳 Subscription"}),e.jsx("div",{className:"pt-4 glass-border-t glass-border-white/20",children:e.jsx("button",{className:"glass-w-full glass-p-3 glass-surface-red/20 hover:glass-surface-red/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"Sign Out"})})]})]})}),e.jsxs("div",{className:"glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard",children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center",children:"Bottom Sheet Features"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-4 glass-gap-6",children:[e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"📏"}),e.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Snap Points"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Multiple height positions"})]}),e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"👆"}),e.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Touch Drag"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Smooth drag interactions"})]}),e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"🎯"}),e.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Backdrop"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Modal backdrop with blur"})]}),e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"📱"}),e.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Mobile First"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Optimized for mobile UX"})]})]})]})]})})}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <TouchDemo />
      </div>
    </div>
}`,...R.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    touchFeedback: true,
    rippleEffect: true,
    hapticsEnabled: true,
    children: <div className="glass-p-6 glass-text-center">
        <div className="glass-text-4xl glass-mb-3">📱</div>
        <div className="glass-text-primary glass-font-medium">
          Touch Feedback
        </div>
        <div className="glass-text-primary glass-text-sm">
          Visual, haptic, and ripple effects
        </div>
      </div>
  },
  render: args => <div className="ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <div className="glass-text-center mb-12">
          <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
            🎯 Touch Feedback Demo
          </h1>
          <p className="glass-text-xl glass-text-primary">
            Experience visual feedback, haptic responses, and ripple effects
          </p>
        </div>

        <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-8 mb-12">
          <TouchOptimizedGlass {...args} onTap={() => console.log("Light feedback")} glassIntensity="light" />

          <TouchOptimizedGlass {...args} onTap={() => console.log("Medium feedback")} glassIntensity="medium" />

          <TouchOptimizedGlass {...args} onTap={() => console.log("Heavy feedback")} glassIntensity="heavy" />
        </div>

        <div className="glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
          <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">
            Feedback Types
          </h3>
          <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-6">
            <div className="glass-text-center">
              <div className="glass-text-3xl glass-mb-3">👆</div>
              <h4 className="glass-font-medium glass-text-primary glass-mb-2">
                Visual Feedback
              </h4>
              <p className="glass-text-primary glass-text-sm">
                Scale and opacity changes on touch
              </p>
            </div>

            <div className="glass-text-center">
              <div className="glass-text-3xl glass-mb-3">📳</div>
              <h4 className="glass-font-medium glass-text-primary glass-mb-2">
                Haptic Feedback
              </h4>
              <p className="glass-text-primary glass-text-sm">
                Vibration patterns for touch confirmation
              </p>
            </div>

            <div className="glass-text-center">
              <div className="glass-text-3xl glass-mb-3">💫</div>
              <h4 className="glass-font-medium glass-text-primary glass-mb-2">
                Ripple Effects
              </h4>
              <p className="glass-text-primary glass-text-sm">
                Material Design-inspired touch ripples
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
}`,...A.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [swipeHistory, setSwipeHistory] = useState<string[]>([]);
    const pages = [{
      title: "Dashboard",
      icon: "📊",
      color: "linear-gradient(135deg, #3b82f6, #06b6d4)"
    }, {
      title: "Messages",
      icon: "💬",
      color: "linear-gradient(135deg, #22c55e, #10b981)"
    }, {
      title: "Settings",
      icon: "⚙️",
      color: "linear-gradient(135deg, #8b5cf6, #ec4899)"
    }, {
      title: "Profile",
      icon: "👤",
      color: "linear-gradient(135deg, #f97316, #ef4444)"
    }];
    const handleSwipe = (direction: "left" | "right" | "up" | "down") => {
      setSwipeHistory(prev => [...prev.slice(-4), direction]);
      if (direction === "left" && currentPage < pages.length - 1) {
        setCurrentPage(prev => prev + 1);
      } else if (direction === "right" && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      }
    };
    return <div className="ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
        <div className="max-w-4xl glass-mx-auto">
          <div className="glass-text-center mb-12">
            <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
              📱 Mobile Glass Navigation
            </h1>
            <p className="glass-text-xl glass-text-primary">
              Swipe left/right to navigate between pages
            </p>
          </div>

          <div className="mb-8">
            <div className="glass-flex glass-justify-center glass-gap-2 glass-mb-4">
              {pages.map((_, index) => <div key={index} className="glass-radius-full" style={{
              width: 12,
              height: 12,
              background: index === currentPage ? "#fff" : "rgba(255,255,255,0.36)",
              transition: "background 160ms ease"
            }} />)}
            </div>

            <div className="glass-text-center mb-6">
              <div className="inline-glass-block glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-px-6 glass-py-3 glass-contrast-guard">
                <div className="glass-text-primary glass-text-sm">
                  Current Page
                </div>
                <div className="glass-text-primary glass-font-medium">
                  {pages[currentPage].title}
                </div>
              </div>
            </div>
          </div>

          <MobileGlassNavigation onSwipeLeft={() => handleSwipe("left")} onSwipeRight={() => handleSwipe("right")} onSwipeUp={() => handleSwipe("up")} onSwipeDown={() => handleSwipe("down")}>
            <div className="glass-p-8 glass-text-center">
              <div className="glass-radius-2xl glass-mb-6" style={{
              display: "inline-block",
              padding: 32,
              background: pages[currentPage].color
            }}>
                <div className="glass-text-6xl">{pages[currentPage].icon}</div>
              </div>
              <h2 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
                {pages[currentPage].title}
              </h2>
              <p className="glass-text-primary glass-text-lg">
                Swipe left or right to navigate between different sections
              </p>
            </div>
          </MobileGlassNavigation>

          <div className="mt-8 glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">
              Swipe History
            </h3>
            <div className="glass-flex glass-flex-wrap glass-gap-2">
              {swipeHistory.length === 0 ? <div className="glass-text-primary">No swipes yet</div> : swipeHistory.map((swipe, index) => <div key={index} className="glass-px-3 glass-py-1 glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-text-sm">
                    {swipe} →
                  </div>)}
            </div>
          </div>

          <div className="mt-8 glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">
              Navigation Controls
            </h3>
            <div className="glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4">
              <button onClick={() => handleSwipe("left")} className="glass-px-4 glass-py-2 glass-surface-blue/20 hover:glass-surface-blue/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard" disabled={currentPage >= pages.length - 1}>
                ← Left
              </button>

              <button onClick={() => handleSwipe("right")} className="glass-px-4 glass-py-2 glass-surface-blue/20 hover:glass-surface-blue/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard" disabled={currentPage <= 0}>
                Right →
              </button>

              <button onClick={() => handleSwipe("up")} className="glass-px-4 glass-py-2 glass-surface-green/20 hover:glass-surface-green/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard">
                ↑ Up
              </button>

              <button onClick={() => handleSwipe("down")} className="glass-px-4 glass-py-2 glass-surface-green/20 hover:glass-surface-green/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard">
                Down ↓
              </button>
            </div>
          </div>
        </div>
      </div>;
  }
}`,...O.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
      <div className="max-w-6xl glass-mx-auto">
        <div className="glass-text-center mb-12">
          <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
            📐 Adaptive Glass Density
          </h1>
          <p className="glass-text-xl glass-text-primary">
            Glass effects that automatically adapt to screen size and device
            capabilities
          </p>
        </div>

        <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-3 glass-gap-8 mb-12">
          <AdaptiveGlassDensity screenSize="small" devicePixelRatio={1} autoAdapt={true}>
            <div className="glass-p-6 glass-text-center">
              <div className="glass-text-4xl glass-mb-3">📱</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">
                Mobile (Small)
              </h3>
              <p className="glass-text-primary glass-text-sm">
                Optimized for small screens with reduced effects for better
                performance
              </p>
              <div className="mt-4 glass-text-primary glass-text-xs">
                • Lower density effects
                <br />
                • Reduced blur intensity
                <br />
                • Minimal animations
                <br />• Touch-optimized
              </div>
            </div>
          </AdaptiveGlassDensity>

          <AdaptiveGlassDensity screenSize="medium" devicePixelRatio={1.5} autoAdapt={true}>
            <div className="glass-p-6 glass-text-center">
              <div className="glass-text-4xl glass-mb-3">💻</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">
                Tablet (Medium)
              </h3>
              <p className="glass-text-primary glass-text-sm">
                Balanced effects for medium screens with moderate performance
                impact
              </p>
              <div className="mt-4 glass-text-primary glass-text-xs">
                • Medium density effects
                <br />
                • Standard blur intensity
                <br />
                • Balanced animations
                <br />• Touch-friendly
              </div>
            </div>
          </AdaptiveGlassDensity>

          <AdaptiveGlassDensity screenSize="large" devicePixelRatio={2} autoAdapt={true}>
            <div className="glass-p-6 glass-text-center">
              <div className="glass-text-4xl glass-mb-3">🖥️</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">
                Desktop (Large)
              </h3>
              <p className="glass-text-primary glass-text-sm">
                Full effects for large screens with high-performance
                capabilities
              </p>
              <div className="mt-4 glass-text-primary glass-text-xs">
                • High density effects
                <br />
                • Maximum blur intensity
                <br />
                • Complex animations
                <br />• Mouse optimized
              </div>
            </div>
          </AdaptiveGlassDensity>
        </div>

        <div className="glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
          <h3 className="glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center">
            Adaptive Features
          </h3>
          <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-4 glass-gap-6">
            <div className="glass-text-center">
              <div className="glass-text-3xl glass-mb-3">📏</div>
              <h4 className="glass-font-semibold glass-text-primary glass-mb-2">
                Screen Size
              </h4>
              <p className="glass-text-primary glass-text-sm">
                Adapts to viewport dimensions
              </p>
            </div>

            <div className="glass-text-center">
              <div className="glass-text-3xl glass-mb-3">🔍</div>
              <h4 className="glass-font-semibold glass-text-primary glass-mb-2">
                Pixel Ratio
              </h4>
              <p className="glass-text-primary glass-text-sm">
                Considers device pixel density
              </p>
            </div>

            <div className="glass-text-center">
              <div className="glass-text-3xl glass-mb-3">⚡</div>
              <h4 className="glass-font-semibold glass-text-primary glass-mb-2">
                Performance
              </h4>
              <p className="glass-text-primary glass-text-sm">
                Auto-adjusts based on capabilities
              </p>
            </div>

            <div className="glass-text-center">
              <div className="glass-text-3xl glass-mb-3">♿</div>
              <h4 className="glass-font-semibold glass-text-primary glass-mb-2">
                Accessibility
              </h4>
              <p className="glass-text-primary glass-text-sm">
                Maintains usability across devices
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
}`,...F.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <div className="glass-text-center mb-12">
          <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
            💫 Touch Ripple Effects
          </h1>
          <p className="glass-text-xl glass-text-primary">
            Material Design-inspired ripple effects with customizable colors and
            timing
          </p>
        </div>

        <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-8 mb-12">
          <TouchRippleEffects color="var(--glass-border-default)" maxRipples={3} rippleDuration={600}>
            <div className="glass-p-8 glass-text-center glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-3">🌊</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">
                Default Ripple
              </h3>
              <p className="glass-text-primary glass-text-sm">
                Standard white ripple with medium duration and up to 3
                simultaneous ripples
              </p>
            </div>
          </TouchRippleEffects>

          <TouchRippleEffects color="rgba(86, 94, 105, 0.38)" maxRipples={5} rippleDuration={800}>
            <div className="glass-p-8 glass-text-center glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-3">💙</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">
                Soft Ripple
              </h3>
              <p className="glass-text-primary glass-text-sm">
                Soft graphite ripple with longer duration and more simultaneous
                ripples
              </p>
            </div>
          </TouchRippleEffects>

          <TouchRippleEffects color="rgba(44, 50, 59, 0.28)" maxRipples={2} rippleDuration={400}>
            <div className="glass-p-8 glass-text-center glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-3">💚</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">
                Quick Ripple
              </h3>
              <p className="glass-text-primary glass-text-sm">
                Fast neutral ripple with limited simultaneous effects for subtle
                feedback
              </p>
            </div>
          </TouchRippleEffects>

          <TouchRippleEffects color="rgba(25, 30, 38, 0.34)" maxRipples={4} rippleDuration={1000}>
            <div className="glass-p-8 glass-text-center glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-3">🧡</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">
                Dramatic Ripple
              </h3>
              <p className="glass-text-primary glass-text-sm">
                Deeper graphite ripple with slow, dramatic animation and
                multiple effects
              </p>
            </div>
          </TouchRippleEffects>
        </div>

        <div className="glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
          <h3 className="glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center">
            Ripple Effect Features
          </h3>
          <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-8">
            <div>
              <h4 className="glass-font-medium glass-text-primary glass-mb-3">
                Customization Options
              </h4>
              <div className="glass-space-y-2 glass-text-primary">
                <div>• Custom colors and opacity</div>
                <div>• Adjustable animation duration</div>
                <div>• Configurable ripple limits</div>
                <div>• Size and scale control</div>
              </div>
            </div>
            <div>
              <h4 className="glass-font-medium glass-text-primary glass-mb-3">
                Performance Features
              </h4>
              <div className="glass-space-y-2 glass-text-primary">
                <div>• Efficient DOM manipulation</div>
                <div>• Automatic cleanup</div>
                <div>• GPU-accelerated animations</div>
                <div>• Memory leak prevention</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
}`,...z.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const [sheets, setSheets] = useState({
      menu: false,
      settings: false,
      profile: false
    });
    const openSheet = (sheet: keyof typeof sheets) => {
      setSheets(prev => ({
        ...prev,
        [sheet]: true
      }));
    };
    const closeSheet = (sheet: keyof typeof sheets) => {
      setSheets(prev => ({
        ...prev,
        [sheet]: false
      }));
    };
    return <div className="ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
        <div className="max-w-4xl glass-mx-auto">
          <div className="glass-text-center mb-12">
            <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
              📄 Mobile Glass Bottom Sheet
            </h1>
            <p className="glass-text-xl glass-text-primary">
              Touch-optimized bottom sheets with snap points and smooth
              animations
            </p>
          </div>

          <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-6 mb-12">
            <div className="glass-text-center">
              <div className="glass-p-6 glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-mb-4 glass-contrast-guard">
                <div className="glass-text-4xl glass-mb-3">🍽️</div>
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">
                  Menu Sheet
                </h3>
                <p className="glass-text-primary glass-text-sm glass-mb-4">
                  Navigation menu with quick actions and shortcuts
                </p>
                <button onClick={() => openSheet("menu")} className="glass-px-6 glass-py-2 glass-surface-blue/20 hover:glass-surface-blue/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard">
                  Open Menu
                </button>
              </div>
            </div>

            <div className="glass-text-center">
              <div className="glass-p-6 glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-mb-4 glass-contrast-guard">
                <div className="glass-text-4xl glass-mb-3">⚙️</div>
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">
                  Settings Sheet
                </h3>
                <p className="glass-text-primary glass-text-sm glass-mb-4">
                  Configuration options and preferences panel
                </p>
                <button onClick={() => openSheet("settings")} className="glass-px-6 glass-py-2 glass-surface-green/20 hover:glass-surface-green/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard">
                  Open Settings
                </button>
              </div>
            </div>

            <div className="glass-text-center">
              <div className="glass-p-6 glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-mb-4 glass-contrast-guard">
                <div className="glass-text-4xl glass-mb-3">👤</div>
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">
                  Profile Sheet
                </h3>
                <p className="glass-text-primary glass-text-sm glass-mb-4">
                  User profile information and account settings
                </p>
                <button onClick={() => openSheet("profile")} className="glass-px-6 glass-py-2 glass-surface-primary/20 hover:glass-surface-primary/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard">
                  Open Profile
                </button>
              </div>
            </div>
          </div>

          {/* Menu Sheet */}
          <MobileGlassBottomSheet isOpen={sheets.menu} onClose={() => closeSheet("menu")} height="60vh" snapPoints={["30vh", "60vh", "80vh"]}>
            <div className="glass-p-6">
              <h2 className="glass-text-2xl glass-font-bold glass-text-primary mb-6">
                Navigation Menu
              </h2>
              <div className="glass-space-y-4">
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  🏠 Home
                </button>
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  🔍 Search
                </button>
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  ❤️ Favorites
                </button>
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  📱 Downloads
                </button>
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  ⚙️ Settings
                </button>
              </div>
            </div>
          </MobileGlassBottomSheet>

          {/* Settings Sheet */}
          <MobileGlassBottomSheet isOpen={sheets.settings} onClose={() => closeSheet("settings")} height="70vh" snapPoints={["40vh", "70vh"]}>
            <div className="glass-p-6">
              <h2 className="glass-text-2xl glass-font-bold glass-text-primary mb-6">
                Settings
              </h2>
              <div className="space-y-6">
                <div className="glass-flex glass-items-center glass-justify-between">
                  <span className="glass-text-primary glass-font-medium">
                    Notifications
                  </span>
                  <div className="glass-w-12 glass-h-6 glass-surface-subtle/20 glass-radius-full glass-p-1">
                    <div className="glass-w-4 glass-h-4 glass-surface-subtle glass-radius-full transform translate-x-6"></div>
                  </div>
                </div>

                <div className="glass-flex glass-items-center glass-justify-between">
                  <span className="glass-text-primary glass-font-medium">
                    Dark Mode
                  </span>
                  <div className="glass-w-12 glass-h-6 glass-surface-blue glass-radius-full glass-p-1">
                    <div className="glass-w-4 glass-h-4 glass-surface-subtle glass-radius-full"></div>
                  </div>
                </div>

                <div className="glass-flex glass-items-center glass-justify-between">
                  <span className="glass-text-primary glass-font-medium">
                    Auto-play
                  </span>
                  <div className="glass-w-12 glass-h-6 glass-surface-subtle/20 glass-radius-full glass-p-1">
                    <div className="glass-w-4 glass-h-4 glass-surface-subtle glass-radius-full"></div>
                  </div>
                </div>

                <div className="pt-4 glass-border-t glass-border-white/20">
                  <button className="glass-w-full glass-p-3 glass-surface-red/20 hover:glass-surface-red/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard">
                    Clear Cache
                  </button>
                </div>
              </div>
            </div>
          </MobileGlassBottomSheet>

          {/* Profile Sheet */}
          <MobileGlassBottomSheet isOpen={sheets.profile} onClose={() => closeSheet("profile")} height="75vh" snapPoints={["50vh", "75vh"]}>
            <div className="glass-p-6">
              <div className="glass-text-center mb-6">
                <div className="glass-w-20 glass-h-20 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full glass-mx-auto glass-mb-4 glass-flex glass-items-center glass-justify-center">
                  <span className="glass-text-3xl">👤</span>
                </div>
                <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-2">
                  John Doe
                </h2>
                <p className="glass-text-primary">john.doe@example.com</p>
              </div>

              <div className="glass-space-y-4">
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  ✏️ Edit Profile
                </button>
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  🔒 Privacy Settings
                </button>
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  🔔 Notification Preferences
                </button>
                <button className="glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard">
                  💳 Subscription
                </button>

                <div className="pt-4 glass-border-t glass-border-white/20">
                  <button className="glass-w-full glass-p-3 glass-surface-red/20 hover:glass-surface-red/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </MobileGlassBottomSheet>

          <div className="glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center">
              Bottom Sheet Features
            </h3>
            <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-4 glass-gap-6">
              <div className="glass-text-center">
                <div className="glass-text-3xl glass-mb-3">📏</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">
                  Snap Points
                </h4>
                <p className="glass-text-primary glass-text-sm">
                  Multiple height positions
                </p>
              </div>

              <div className="glass-text-center">
                <div className="glass-text-3xl glass-mb-3">👆</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">
                  Touch Drag
                </h4>
                <p className="glass-text-primary glass-text-sm">
                  Smooth drag interactions
                </p>
              </div>

              <div className="glass-text-center">
                <div className="glass-text-3xl glass-mb-3">🎯</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">
                  Backdrop
                </h4>
                <p className="glass-text-primary glass-text-sm">
                  Modal backdrop with blur
                </p>
              </div>

              <div className="glass-text-center">
                <div className="glass-text-3xl glass-mb-3">📱</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">
                  Mobile First
                </h4>
                <p className="glass-text-primary glass-text-sm">
                  Optimized for mobile UX
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>;
  }
}`,...G.parameters?.docs?.source}}};const de=["InteractiveTouch","TouchFeedback","MobileNavigation","AdaptiveDensity","RippleEffects","BottomSheet"];export{F as AdaptiveDensity,G as BottomSheet,R as InteractiveTouch,O as MobileNavigation,z as RippleEffects,A as TouchFeedback,de as __namedExportsOrder,re as default};
