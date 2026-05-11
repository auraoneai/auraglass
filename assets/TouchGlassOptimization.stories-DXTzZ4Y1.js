import{r as s,b as P,g as V,j as e,m as q,e as z,c as _}from"./iframe-CrdWMSIk.js";import{u as X}from"./use-motion-value-Dz_T9ciX.js";import"./preload-helper-PPVm8Dsz.js";const H=s.forwardRef(({children:a,onTap:i,onLongPress:r,onSwipe:d,className:l,touchFeedback:n=!0,rippleEffect:o=!0,hapticsEnabled:t=!0,glassIntensity:c="medium",...y},m)=>{const u=P(),[p,f]=s.useState(!1),[b,x]=s.useState([]),[g,E]=s.useState(null),T=s.useRef(null),M=X(1),U=X(1),h=s.useCallback((v="light")=>{if(!(!t||typeof window>"u")&&"navigator"in window&&"vibrate"in navigator){const C={light:[10],medium:[20],heavy:[30,10,30]};navigator.vibrate(C[v])}},[t]),Y=s.useCallback(v=>{if(v.preventDefault(),f(!0),M.set(.95),n&&h("light"),r){const C=setTimeout(()=>{h("medium"),r(),E(null)},500);E(C)}if(o&&T.current){const C=T.current.getBoundingClientRect(),N=v.touches[0],R=N.clientX-C.left,k=N.clientY-C.top,j={id:Date.now(),x:R,y:k,timestamp:Date.now()};x(D=>[...D,j]),setTimeout(()=>{x(D=>D.filter(Z=>Z.id!==j.id))},600)}},[n,o,r,h,M]),$=s.useCallback(()=>{f(!1),M.set(1),g&&(clearTimeout(g),E(null)),i&&!g&&(h("light"),i())},[g,i,h,M]),J=s.useCallback((v,C)=>{const{offset:N,velocity:R}=C,k=50,j=500;if(Math.abs(N.x)>k||Math.abs(R.x)>j){const D=N.x>0?"right":"left";d?.(D),h("medium")}else if(Math.abs(N.y)>k||Math.abs(R.y)>j){const D=N.y>0?"down":"up";d?.(D),h("medium")}},[d,h]),Q={light:V({intent:"neutral",elevation:"level2"}),medium:V({intent:"neutral",elevation:"level2"}),heavy:V({intent:"neutral",elevation:"level2"})}[c];return e.jsxs(q.div,{ref:v=>{T.current=v,typeof m=="function"?m(v):m&&(m.current=v)},className:_("relative overflow-hidden touch-none select-none",l),style:{...Q,borderRadius:"12px",minHeight:"44px",minWidth:"44px",scale:M,opacity:U},onTouchStart:Y,onTouchEnd:$,onPanEnd:J,drag:"x",dragConstraints:{left:0,right:0},dragElastic:.1,...y,children:[a,e.jsx(z,{children:b.map(v=>e.jsx(q.div,{className:"glass-absolute glass-pointer-events-none",style:{left:v.x-20,top:v.y-20,width:40,height:40,borderRadius:"50%",background:'/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */'},initial:{scale:0,opacity:1},animate:u?{}:{scale:3,opacity:0},exit:{opacity:0},transition:u?{duration:0}:{duration:.6,ease:"easeOut"}},v.id))}),n&&e.jsx(z,{children:p&&e.jsx(q.div,{className:"glass-absolute glass-inset-0 glass-pointer-events-none",style:{background:'/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',borderRadius:"inherit"},initial:{opacity:0},animate:u?{}:{opacity:1},exit:{opacity:0},transition:u?{duration:0}:{duration:.1}})})]})});H.displayName="TouchOptimizedGlass";const K=s.forwardRef((a,i)=>e.jsx(H,{ref:i,...a}));K.displayName="TouchGlassOptimization";function W({children:a,swipeThreshold:i=50,onSwipeLeft:r,onSwipeRight:d,onSwipeUp:l,onSwipeDown:n,className:o=""}){const t=P(),[c,y]=s.useState(null),m=s.useRef(null),u=s.useCallback(p=>{switch(y(p),p){case"left":r?.();break;case"right":d?.();break;case"up":l?.();break;case"down":n?.();break}setTimeout(()=>y(null),300)},[r,d,l,n]);return e.jsx(q.div,{ref:m,className:`relative ${o}`,style:V({intent:"neutral",elevation:"level2"}),drag:"x",dragConstraints:{left:0,right:0},dragElastic:.2,onDragEnd:(p,f)=>{const{offset:b,velocity:x}=f;if(Math.abs(b.x)>i||Math.abs(x.x)>500){const g=b.x>0?"right":"left";u(g)}else if(Math.abs(b.y)>i||Math.abs(x.y)>500){const g=b.y>0?"down":"up";u(g)}},animate:c?{x:c==="left"?-50:c==="right"?50:0,y:c==="up"?-50:c==="down"?50:0,opacity:.7}:{x:0,y:0,opacity:1},transition:t?{duration:0}:{duration:.3},children:a})}function w({children:a,screenSize:i,devicePixelRatio:r,autoAdapt:d=!0,className:l=""}){const n=P(),[o,t]=s.useState("medium");s.useEffect(()=>{if(!d)return;const m=()=>{const u=window.innerWidth,p=r||window.devicePixelRatio||1;let f="medium";u<768?f=p>2?"light":"medium":u<1200?f=p>1.5?"medium":"heavy":f=p>1.5?"heavy":"medium",t(f)};return m(),window.addEventListener("resize",m),()=>window.removeEventListener("resize",m)},[d,r]);const y={light:V({intent:"neutral",elevation:"level2"}),medium:V({intent:"neutral",elevation:"level2"}),heavy:V({intent:"neutral",elevation:"level2"})}[o];return e.jsx(q.div,{className:l,style:{...y,borderRadius:"12px",transition:"all 0.3s ease-in-out"},animate:n?{}:{opacity:1},initial:{opacity:0},children:a})}function L({children:a,color:i="var(--glass-bg-hover)",maxRipples:r=3,rippleDuration:d=600,className:l=""}){const n=P(),[o,t]=s.useState([]),c=s.useRef(null),y=s.useCallback(m=>{if(!c.current)return;const u=c.current.getBoundingClientRect(),p=m.touches[0],f=p.clientX-u.left,b=p.clientY-u.top,x={id:Date.now(),x:f,y:b};t(g=>[...g,x].slice(-r)),setTimeout(()=>{t(g=>g.filter(E=>E.id!==x.id))},d)},[r,d]);return e.jsxs("div",{ref:c,className:`relative overflow-hidden ${l}`,onTouchStart:y,children:[a,e.jsx(z,{children:o.map(m=>e.jsx(q.div,{className:"glass-absolute glass-pointer-events-none glass-radius-full",style:{left:m.x-20,top:m.y-20,width:40,height:40,background:i},initial:{scale:0,opacity:1},animate:n?{}:{scale:4,opacity:0},exit:{opacity:0},transition:n?{duration:0}:{duration:d/1e3,ease:"easeOut"}},m.id))})]})}function S({isOpen:a,onClose:i,children:r,height:d="50vh",snapPoints:l=["25vh","50vh","75vh"],className:n=""}){const o=P(),[t,c]=s.useState(d),y=s.useCallback((m,u)=>{const{offset:p,velocity:f}=u;if(p.y>100||f.y>500)i();else{const x=u.point.y,g=l.reduce((E,T)=>{const M=parseFloat(T),U=Math.abs(x-M),h=Math.abs(x-parseFloat(E));return U<h?T:E});c(g)}},[i,l]);return e.jsx(z,{children:a&&e.jsxs(e.Fragment,{children:[e.jsx(q.div,{className:_("glass-foundation-complete glass-position-fixed glass-inset-0 glass-surface-overlay glass-z-40"),initial:{opacity:0},animate:o?{}:{opacity:1},exit:{opacity:0},onClick:i}),e.jsxs(q.div,{className:`fixed bottom-0 left-0 right-0 z-50 ${n}`,style:V({intent:"neutral",elevation:"level2"}),initial:{y:"100%"},animate:o?{}:{y:0},exit:{y:"100%"},transition:o?{duration:0}:{duration:.3},drag:"y",dragConstraints:{top:0,bottom:0},dragElastic:.1,onDragEnd:y,children:[e.jsx("div",{className:"glass-flex glass-justify-center glass-py-3",children:e.jsx("div",{className:_("glass-w-12 glass-h-1.5 glass-surface-secondary glass-radius-full")})}),e.jsx("div",{className:"glass-px-6 glass-pb-6 glass-overflow-y-auto glass-max-h-full",children:r})]})]})})}try{W.displayName="MobileGlassNavigation",W.__docgenInfo={description:"",displayName:"MobileGlassNavigation",props:{swipeThreshold:{defaultValue:{value:"50"},description:"",name:"swipeThreshold",required:!1,type:{name:"number | undefined"}},onSwipeLeft:{defaultValue:null,description:"",name:"onSwipeLeft",required:!1,type:{name:"(() => void) | undefined"}},onSwipeRight:{defaultValue:null,description:"",name:"onSwipeRight",required:!1,type:{name:"(() => void) | undefined"}},onSwipeUp:{defaultValue:null,description:"",name:"onSwipeUp",required:!1,type:{name:"(() => void) | undefined"}},onSwipeDown:{defaultValue:null,description:"",name:"onSwipeDown",required:!1,type:{name:"(() => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{w.displayName="AdaptiveGlassDensity",w.__docgenInfo={description:"",displayName:"AdaptiveGlassDensity",props:{screenSize:{defaultValue:null,description:"",name:"screenSize",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"small"'},{value:'"large"'},{value:'"xlarge"'}]}},devicePixelRatio:{defaultValue:null,description:"",name:"devicePixelRatio",required:!1,type:{name:"number | undefined"}},autoAdapt:{defaultValue:{value:"true"},description:"",name:"autoAdapt",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{L.displayName="TouchRippleEffects",L.__docgenInfo={description:"",displayName:"TouchRippleEffects",props:{color:{defaultValue:{value:"var(--glass-bg-hover)"},description:"",name:"color",required:!1,type:{name:"string | undefined"}},maxRipples:{defaultValue:{value:"3"},description:"",name:"maxRipples",required:!1,type:{name:"number | undefined"}},rippleDuration:{defaultValue:{value:"600"},description:"",name:"rippleDuration",required:!1,type:{name:"number | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{S.displayName="MobileGlassBottomSheet",S.__docgenInfo={description:"",displayName:"MobileGlassBottomSheet",props:{isOpen:{defaultValue:null,description:"",name:"isOpen",required:!0,type:{name:"boolean"}},onClose:{defaultValue:null,description:"",name:"onClose",required:!0,type:{name:"() => void"}},height:{defaultValue:{value:"50vh"},description:"",name:"height",required:!1,type:{name:"string | undefined"}},snapPoints:{defaultValue:{value:'["25vh", "50vh", "75vh"]'},description:"",name:"snapPoints",required:!1,type:{name:"string[] | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{H.displayName="TouchOptimizedGlass",H.__docgenInfo={description:"",displayName:"TouchOptimizedGlass",props:{onTap:{defaultValue:null,description:`Callback when the tap gesture successfully ends on this element.

\`\`\`jsx
function onTap(event, info) {
  console.log(info.point.x, info.point.y)
}

<motion.div onTap={onTap} />
\`\`\``,name:"onTap",required:!1,type:{name:"(() => void) | undefined"}},onLongPress:{defaultValue:null,description:"",name:"onLongPress",required:!1,type:{name:"(() => void) | undefined"}},onSwipe:{defaultValue:null,description:"",name:"onSwipe",required:!1,type:{name:'((direction: "left" | "right" | "up" | "down") => void) | undefined'}},touchFeedback:{defaultValue:{value:"true"},description:"",name:"touchFeedback",required:!1,type:{name:"boolean | undefined"}},rippleEffect:{defaultValue:{value:"true"},description:"",name:"rippleEffect",required:!1,type:{name:"boolean | undefined"}},hapticsEnabled:{defaultValue:{value:"true"},description:"",name:"hapticsEnabled",required:!1,type:{name:"boolean | undefined"}},glassIntensity:{defaultValue:{value:"medium"},description:"",name:"glassIntensity",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"light"'},{value:'"medium"'},{value:'"heavy"'}]}},onError:{defaultValue:null,description:"",name:"onError",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},defaultChecked:{defaultValue:null,description:"",name:"defaultChecked",required:!1,type:{name:"boolean | undefined"}},defaultValue:{defaultValue:null,description:"",name:"defaultValue",required:!1,type:{name:"string | number | readonly string[] | undefined"}},suppressContentEditableWarning:{defaultValue:null,description:"",name:"suppressContentEditableWarning",required:!1,type:{name:"boolean | undefined"}},suppressHydrationWarning:{defaultValue:null,description:"",name:"suppressHydrationWarning",required:!1,type:{name:"boolean | undefined"}},accessKey:{defaultValue:null,description:"",name:"accessKey",required:!1,type:{name:"string | undefined"}},autoCapitalize:{defaultValue:null,description:"",name:"autoCapitalize",required:!1,type:{name:'"off" | "none" | "on" | "sentences" | "words" | "characters" | (string & {}) | undefined'}},autoFocus:{defaultValue:null,description:"",name:"autoFocus",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},contentEditable:{defaultValue:null,description:"",name:"contentEditable",required:!1,type:{name:'Booleanish | "inherit" | "plaintext-only" | undefined'}},contextMenu:{defaultValue:null,description:"",name:"contextMenu",required:!1,type:{name:"string | undefined"}},dir:{defaultValue:null,description:"",name:"dir",required:!1,type:{name:"string | undefined"}},draggable:{defaultValue:null,description:"",name:"draggable",required:!1,type:{name:"Booleanish | undefined"}},enterKeyHint:{defaultValue:null,description:"",name:"enterKeyHint",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"enter"'},{value:'"done"'},{value:'"go"'},{value:'"next"'},{value:'"previous"'},{value:'"search"'},{value:'"send"'}]}},hidden:{defaultValue:null,description:"",name:"hidden",required:!1,type:{name:"boolean | undefined"}},id:{defaultValue:null,description:"",name:"id",required:!1,type:{name:"string | undefined"}},lang:{defaultValue:null,description:"",name:"lang",required:!1,type:{name:"string | undefined"}},nonce:{defaultValue:null,description:"",name:"nonce",required:!1,type:{name:"string | undefined"}},slot:{defaultValue:null,description:"",name:"slot",required:!1,type:{name:"string | undefined"}},spellCheck:{defaultValue:null,description:"",name:"spellCheck",required:!1,type:{name:"Booleanish | undefined"}},tabIndex:{defaultValue:null,description:"",name:"tabIndex",required:!1,type:{name:"number | undefined"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string | undefined"}},translate:{defaultValue:null,description:"",name:"translate",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"yes"'},{value:'"no"'}]}},radioGroup:{defaultValue:null,description:"",name:"radioGroup",required:!1,type:{name:"string | undefined"}},role:{defaultValue:null,description:"",name:"role",required:!1,type:{name:"AriaRole | undefined"}},about:{defaultValue:null,description:"",name:"about",required:!1,type:{name:"string | undefined"}},content:{defaultValue:null,description:"",name:"content",required:!1,type:{name:"string | undefined"}},datatype:{defaultValue:null,description:"",name:"datatype",required:!1,type:{name:"string | undefined"}},inlist:{defaultValue:null,description:"",name:"inlist",required:!1,type:{name:"any"}},prefix:{defaultValue:null,description:"",name:"prefix",required:!1,type:{name:"string | undefined"}},property:{defaultValue:null,description:"",name:"property",required:!1,type:{name:"string | undefined"}},rel:{defaultValue:null,description:"",name:"rel",required:!1,type:{name:"string | undefined"}},resource:{defaultValue:null,description:"",name:"resource",required:!1,type:{name:"string | undefined"}},rev:{defaultValue:null,description:"",name:"rev",required:!1,type:{name:"string | undefined"}},typeof:{defaultValue:null,description:"",name:"typeof",required:!1,type:{name:"string | undefined"}},vocab:{defaultValue:null,description:"",name:"vocab",required:!1,type:{name:"string | undefined"}},autoCorrect:{defaultValue:null,description:"",name:"autoCorrect",required:!1,type:{name:"string | undefined"}},autoSave:{defaultValue:null,description:"",name:"autoSave",required:!1,type:{name:"string | undefined"}},color:{defaultValue:null,description:"",name:"color",required:!1,type:{name:"string | undefined"}},itemProp:{defaultValue:null,description:"",name:"itemProp",required:!1,type:{name:"string | undefined"}},itemScope:{defaultValue:null,description:"",name:"itemScope",required:!1,type:{name:"boolean | undefined"}},itemType:{defaultValue:null,description:"",name:"itemType",required:!1,type:{name:"string | undefined"}},itemID:{defaultValue:null,description:"",name:"itemID",required:!1,type:{name:"string | undefined"}},itemRef:{defaultValue:null,description:"",name:"itemRef",required:!1,type:{name:"string | undefined"}},results:{defaultValue:null,description:"",name:"results",required:!1,type:{name:"number | undefined"}},security:{defaultValue:null,description:"",name:"security",required:!1,type:{name:"string | undefined"}},unselectable:{defaultValue:null,description:"",name:"unselectable",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"off"'},{value:'"on"'}]}},inputMode:{defaultValue:null,description:"",name:"inputMode",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"search"'},{value:'"text"'},{value:'"tel"'},{value:'"url"'},{value:'"email"'},{value:'"numeric"'},{value:'"decimal"'}]}},is:{defaultValue:null,description:"",name:"is",required:!1,type:{name:"string | undefined"}},exportparts:{defaultValue:null,description:"",name:"exportparts",required:!1,type:{name:"string | undefined"}},part:{defaultValue:null,description:"",name:"part",required:!1,type:{name:"string | undefined"}},"aria-activedescendant":{defaultValue:null,description:"",name:"aria-activedescendant",required:!1,type:{name:"string | undefined"}},"aria-atomic":{defaultValue:null,description:"",name:"aria-atomic",required:!1,type:{name:"Booleanish | undefined"}},"aria-autocomplete":{defaultValue:null,description:"",name:"aria-autocomplete",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"list"'},{value:'"inline"'},{value:'"both"'}]}},"aria-braillelabel":{defaultValue:null,description:"",name:"aria-braillelabel",required:!1,type:{name:"string | undefined"}},"aria-brailleroledescription":{defaultValue:null,description:"",name:"aria-brailleroledescription",required:!1,type:{name:"string | undefined"}},"aria-busy":{defaultValue:null,description:"",name:"aria-busy",required:!1,type:{name:"Booleanish | undefined"}},"aria-checked":{defaultValue:null,description:"",name:"aria-checked",required:!1,type:{name:'boolean | "true" | "false" | "mixed" | undefined'}},"aria-colcount":{defaultValue:null,description:"",name:"aria-colcount",required:!1,type:{name:"number | undefined"}},"aria-colindex":{defaultValue:null,description:"",name:"aria-colindex",required:!1,type:{name:"number | undefined"}},"aria-colindextext":{defaultValue:null,description:"",name:"aria-colindextext",required:!1,type:{name:"string | undefined"}},"aria-colspan":{defaultValue:null,description:"",name:"aria-colspan",required:!1,type:{name:"number | undefined"}},"aria-controls":{defaultValue:null,description:"",name:"aria-controls",required:!1,type:{name:"string | undefined"}},"aria-current":{defaultValue:null,description:"",name:"aria-current",required:!1,type:{name:'boolean | "true" | "false" | "page" | "step" | "location" | "date" | "time" | undefined'}},"aria-describedby":{defaultValue:null,description:"",name:"aria-describedby",required:!1,type:{name:"string | undefined"}},"aria-description":{defaultValue:null,description:"",name:"aria-description",required:!1,type:{name:"string | undefined"}},"aria-details":{defaultValue:null,description:"",name:"aria-details",required:!1,type:{name:"string | undefined"}},"aria-disabled":{defaultValue:null,description:"",name:"aria-disabled",required:!1,type:{name:"Booleanish | undefined"}},"aria-dropeffect":{defaultValue:null,description:"",name:"aria-dropeffect",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"link"'},{value:'"copy"'},{value:'"execute"'},{value:'"move"'},{value:'"popup"'}]}},"aria-errormessage":{defaultValue:null,description:"",name:"aria-errormessage",required:!1,type:{name:"string | undefined"}},"aria-expanded":{defaultValue:null,description:"",name:"aria-expanded",required:!1,type:{name:"Booleanish | undefined"}},"aria-flowto":{defaultValue:null,description:"",name:"aria-flowto",required:!1,type:{name:"string | undefined"}},"aria-grabbed":{defaultValue:null,description:"",name:"aria-grabbed",required:!1,type:{name:"Booleanish | undefined"}},"aria-haspopup":{defaultValue:null,description:"",name:"aria-haspopup",required:!1,type:{name:'boolean | "true" | "false" | "dialog" | "grid" | "listbox" | "menu" | "tree" | undefined'}},"aria-hidden":{defaultValue:null,description:"",name:"aria-hidden",required:!1,type:{name:"Booleanish | undefined"}},"aria-invalid":{defaultValue:null,description:"",name:"aria-invalid",required:!1,type:{name:'boolean | "true" | "false" | "grammar" | "spelling" | undefined'}},"aria-keyshortcuts":{defaultValue:null,description:"",name:"aria-keyshortcuts",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}},"aria-labelledby":{defaultValue:null,description:"",name:"aria-labelledby",required:!1,type:{name:"string | undefined"}},"aria-level":{defaultValue:null,description:"",name:"aria-level",required:!1,type:{name:"number | undefined"}},"aria-live":{defaultValue:null,description:"",name:"aria-live",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"off"'},{value:'"assertive"'},{value:'"polite"'}]}},"aria-modal":{defaultValue:null,description:"",name:"aria-modal",required:!1,type:{name:"Booleanish | undefined"}},"aria-multiline":{defaultValue:null,description:"",name:"aria-multiline",required:!1,type:{name:"Booleanish | undefined"}},"aria-multiselectable":{defaultValue:null,description:"",name:"aria-multiselectable",required:!1,type:{name:"Booleanish | undefined"}},"aria-orientation":{defaultValue:null,description:"",name:"aria-orientation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"horizontal"'},{value:'"vertical"'}]}},"aria-owns":{defaultValue:null,description:"",name:"aria-owns",required:!1,type:{name:"string | undefined"}},"aria-placeholder":{defaultValue:null,description:"",name:"aria-placeholder",required:!1,type:{name:"string | undefined"}},"aria-posinset":{defaultValue:null,description:"",name:"aria-posinset",required:!1,type:{name:"number | undefined"}},"aria-pressed":{defaultValue:null,description:"",name:"aria-pressed",required:!1,type:{name:'boolean | "true" | "false" | "mixed" | undefined'}},"aria-readonly":{defaultValue:null,description:"",name:"aria-readonly",required:!1,type:{name:"Booleanish | undefined"}},"aria-relevant":{defaultValue:null,description:"",name:"aria-relevant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"text"'},{value:'"additions"'},{value:'"additions removals"'},{value:'"additions text"'},{value:'"all"'},{value:'"removals"'},{value:'"removals additions"'},{value:'"removals text"'},{value:'"text additions"'},{value:'"text removals"'}]}},"aria-required":{defaultValue:null,description:"",name:"aria-required",required:!1,type:{name:"Booleanish | undefined"}},"aria-roledescription":{defaultValue:null,description:"",name:"aria-roledescription",required:!1,type:{name:"string | undefined"}},"aria-rowcount":{defaultValue:null,description:"",name:"aria-rowcount",required:!1,type:{name:"number | undefined"}},"aria-rowindex":{defaultValue:null,description:"",name:"aria-rowindex",required:!1,type:{name:"number | undefined"}},"aria-rowindextext":{defaultValue:null,description:"",name:"aria-rowindextext",required:!1,type:{name:"string | undefined"}},"aria-rowspan":{defaultValue:null,description:"",name:"aria-rowspan",required:!1,type:{name:"number | undefined"}},"aria-selected":{defaultValue:null,description:"",name:"aria-selected",required:!1,type:{name:"Booleanish | undefined"}},"aria-setsize":{defaultValue:null,description:"",name:"aria-setsize",required:!1,type:{name:"number | undefined"}},"aria-sort":{defaultValue:null,description:"",name:"aria-sort",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"ascending"'},{value:'"descending"'},{value:'"other"'}]}},"aria-valuemax":{defaultValue:null,description:"",name:"aria-valuemax",required:!1,type:{name:"number | undefined"}},"aria-valuemin":{defaultValue:null,description:"",name:"aria-valuemin",required:!1,type:{name:"number | undefined"}},"aria-valuenow":{defaultValue:null,description:"",name:"aria-valuenow",required:!1,type:{name:"number | undefined"}},"aria-valuetext":{defaultValue:null,description:"",name:"aria-valuetext",required:!1,type:{name:"string | undefined"}},dangerouslySetInnerHTML:{defaultValue:null,description:"",name:"dangerouslySetInnerHTML",required:!1,type:{name:"{ __html: string | TrustedHTML; } | undefined"}},onCopy:{defaultValue:null,description:"",name:"onCopy",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onCopyCapture:{defaultValue:null,description:"",name:"onCopyCapture",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onCut:{defaultValue:null,description:"",name:"onCut",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onCutCapture:{defaultValue:null,description:"",name:"onCutCapture",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onPaste:{defaultValue:null,description:"",name:"onPaste",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onPasteCapture:{defaultValue:null,description:"",name:"onPasteCapture",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onCompositionEnd:{defaultValue:null,description:"",name:"onCompositionEnd",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onCompositionEndCapture:{defaultValue:null,description:"",name:"onCompositionEndCapture",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onCompositionStart:{defaultValue:null,description:"",name:"onCompositionStart",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onCompositionStartCapture:{defaultValue:null,description:"",name:"onCompositionStartCapture",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onCompositionUpdate:{defaultValue:null,description:"",name:"onCompositionUpdate",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onCompositionUpdateCapture:{defaultValue:null,description:"",name:"onCompositionUpdateCapture",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onFocus:{defaultValue:null,description:"",name:"onFocus",required:!1,type:{name:"FocusEventHandler<HTMLDivElement> | undefined"}},onFocusCapture:{defaultValue:null,description:"",name:"onFocusCapture",required:!1,type:{name:"FocusEventHandler<HTMLDivElement> | undefined"}},onBlur:{defaultValue:null,description:"",name:"onBlur",required:!1,type:{name:"FocusEventHandler<HTMLDivElement> | undefined"}},onBlurCapture:{defaultValue:null,description:"",name:"onBlurCapture",required:!1,type:{name:"FocusEventHandler<HTMLDivElement> | undefined"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onChangeCapture:{defaultValue:null,description:"",name:"onChangeCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onBeforeInput:{defaultValue:null,description:"",name:"onBeforeInput",required:!1,type:{name:"InputEventHandler<HTMLDivElement> | undefined"}},onBeforeInputCapture:{defaultValue:null,description:"",name:"onBeforeInputCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onInput:{defaultValue:null,description:"",name:"onInput",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onInputCapture:{defaultValue:null,description:"",name:"onInputCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onReset:{defaultValue:null,description:"",name:"onReset",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onResetCapture:{defaultValue:null,description:"",name:"onResetCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onSubmit:{defaultValue:null,description:"",name:"onSubmit",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onSubmitCapture:{defaultValue:null,description:"",name:"onSubmitCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onInvalid:{defaultValue:null,description:"",name:"onInvalid",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onInvalidCapture:{defaultValue:null,description:"",name:"onInvalidCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onLoad:{defaultValue:null,description:"",name:"onLoad",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadCapture:{defaultValue:null,description:"",name:"onLoadCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onErrorCapture:{defaultValue:null,description:"",name:"onErrorCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onKeyDown:{defaultValue:null,description:"",name:"onKeyDown",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onKeyDownCapture:{defaultValue:null,description:"",name:"onKeyDownCapture",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onKeyPress:{defaultValue:null,description:"",name:"onKeyPress",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onKeyPressCapture:{defaultValue:null,description:"",name:"onKeyPressCapture",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onKeyUp:{defaultValue:null,description:"",name:"onKeyUp",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onKeyUpCapture:{defaultValue:null,description:"",name:"onKeyUpCapture",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onAbort:{defaultValue:null,description:"",name:"onAbort",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onAbortCapture:{defaultValue:null,description:"",name:"onAbortCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onCanPlay:{defaultValue:null,description:"",name:"onCanPlay",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onCanPlayCapture:{defaultValue:null,description:"",name:"onCanPlayCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onCanPlayThrough:{defaultValue:null,description:"",name:"onCanPlayThrough",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onCanPlayThroughCapture:{defaultValue:null,description:"",name:"onCanPlayThroughCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onDurationChange:{defaultValue:null,description:"",name:"onDurationChange",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onDurationChangeCapture:{defaultValue:null,description:"",name:"onDurationChangeCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEmptied:{defaultValue:null,description:"",name:"onEmptied",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEmptiedCapture:{defaultValue:null,description:"",name:"onEmptiedCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEncrypted:{defaultValue:null,description:"",name:"onEncrypted",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEncryptedCapture:{defaultValue:null,description:"",name:"onEncryptedCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEnded:{defaultValue:null,description:"",name:"onEnded",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEndedCapture:{defaultValue:null,description:"",name:"onEndedCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadedData:{defaultValue:null,description:"",name:"onLoadedData",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadedDataCapture:{defaultValue:null,description:"",name:"onLoadedDataCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadedMetadata:{defaultValue:null,description:"",name:"onLoadedMetadata",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadedMetadataCapture:{defaultValue:null,description:"",name:"onLoadedMetadataCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadStart:{defaultValue:null,description:"",name:"onLoadStart",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadStartCapture:{defaultValue:null,description:"",name:"onLoadStartCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPause:{defaultValue:null,description:"",name:"onPause",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPauseCapture:{defaultValue:null,description:"",name:"onPauseCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPlay:{defaultValue:null,description:"",name:"onPlay",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPlayCapture:{defaultValue:null,description:"",name:"onPlayCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPlaying:{defaultValue:null,description:"",name:"onPlaying",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPlayingCapture:{defaultValue:null,description:"",name:"onPlayingCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onProgress:{defaultValue:null,description:"",name:"onProgress",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onProgressCapture:{defaultValue:null,description:"",name:"onProgressCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onRateChange:{defaultValue:null,description:"",name:"onRateChange",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onRateChangeCapture:{defaultValue:null,description:"",name:"onRateChangeCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSeeked:{defaultValue:null,description:"",name:"onSeeked",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSeekedCapture:{defaultValue:null,description:"",name:"onSeekedCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSeeking:{defaultValue:null,description:"",name:"onSeeking",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSeekingCapture:{defaultValue:null,description:"",name:"onSeekingCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onStalled:{defaultValue:null,description:"",name:"onStalled",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onStalledCapture:{defaultValue:null,description:"",name:"onStalledCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSuspend:{defaultValue:null,description:"",name:"onSuspend",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSuspendCapture:{defaultValue:null,description:"",name:"onSuspendCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onTimeUpdate:{defaultValue:null,description:"",name:"onTimeUpdate",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onTimeUpdateCapture:{defaultValue:null,description:"",name:"onTimeUpdateCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onVolumeChange:{defaultValue:null,description:"",name:"onVolumeChange",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onVolumeChangeCapture:{defaultValue:null,description:"",name:"onVolumeChangeCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onWaiting:{defaultValue:null,description:"",name:"onWaiting",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onWaitingCapture:{defaultValue:null,description:"",name:"onWaitingCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onAuxClick:{defaultValue:null,description:"",name:"onAuxClick",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onAuxClickCapture:{defaultValue:null,description:"",name:"onAuxClickCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onClickCapture:{defaultValue:null,description:"",name:"onClickCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onContextMenu:{defaultValue:null,description:"",name:"onContextMenu",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onContextMenuCapture:{defaultValue:null,description:"",name:"onContextMenuCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onDoubleClick:{defaultValue:null,description:"",name:"onDoubleClick",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onDoubleClickCapture:{defaultValue:null,description:"",name:"onDoubleClickCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onDragCapture:{defaultValue:null,description:"",name:"onDragCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragEndCapture:{defaultValue:null,description:"",name:"onDragEndCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragEnter:{defaultValue:null,description:"",name:"onDragEnter",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragEnterCapture:{defaultValue:null,description:"",name:"onDragEnterCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragExit:{defaultValue:null,description:"",name:"onDragExit",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragExitCapture:{defaultValue:null,description:"",name:"onDragExitCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragLeave:{defaultValue:null,description:"",name:"onDragLeave",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragLeaveCapture:{defaultValue:null,description:"",name:"onDragLeaveCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragOver:{defaultValue:null,description:"",name:"onDragOver",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragOverCapture:{defaultValue:null,description:"",name:"onDragOverCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragStartCapture:{defaultValue:null,description:"",name:"onDragStartCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDrop:{defaultValue:null,description:"",name:"onDrop",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDropCapture:{defaultValue:null,description:"",name:"onDropCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onMouseDown:{defaultValue:null,description:"",name:"onMouseDown",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseDownCapture:{defaultValue:null,description:"",name:"onMouseDownCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseEnter:{defaultValue:null,description:"",name:"onMouseEnter",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseLeave:{defaultValue:null,description:"",name:"onMouseLeave",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseMove:{defaultValue:null,description:"",name:"onMouseMove",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseMoveCapture:{defaultValue:null,description:"",name:"onMouseMoveCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseOut:{defaultValue:null,description:"",name:"onMouseOut",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseOutCapture:{defaultValue:null,description:"",name:"onMouseOutCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseOver:{defaultValue:null,description:"",name:"onMouseOver",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseOverCapture:{defaultValue:null,description:"",name:"onMouseOverCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseUp:{defaultValue:null,description:"",name:"onMouseUp",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseUpCapture:{defaultValue:null,description:"",name:"onMouseUpCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onSelect:{defaultValue:null,description:"",name:"onSelect",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSelectCapture:{defaultValue:null,description:"",name:"onSelectCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onTouchCancel:{defaultValue:null,description:"",name:"onTouchCancel",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchCancelCapture:{defaultValue:null,description:"",name:"onTouchCancelCapture",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchEnd:{defaultValue:null,description:"",name:"onTouchEnd",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchEndCapture:{defaultValue:null,description:"",name:"onTouchEndCapture",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchMove:{defaultValue:null,description:"",name:"onTouchMove",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchMoveCapture:{defaultValue:null,description:"",name:"onTouchMoveCapture",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchStart:{defaultValue:null,description:"",name:"onTouchStart",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchStartCapture:{defaultValue:null,description:"",name:"onTouchStartCapture",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onPointerDown:{defaultValue:null,description:"",name:"onPointerDown",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerDownCapture:{defaultValue:null,description:"",name:"onPointerDownCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerMove:{defaultValue:null,description:"",name:"onPointerMove",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerMoveCapture:{defaultValue:null,description:"",name:"onPointerMoveCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerUp:{defaultValue:null,description:"",name:"onPointerUp",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerUpCapture:{defaultValue:null,description:"",name:"onPointerUpCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerCancel:{defaultValue:null,description:"",name:"onPointerCancel",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerCancelCapture:{defaultValue:null,description:"",name:"onPointerCancelCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerEnter:{defaultValue:null,description:"",name:"onPointerEnter",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerLeave:{defaultValue:null,description:"",name:"onPointerLeave",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerOver:{defaultValue:null,description:"",name:"onPointerOver",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerOverCapture:{defaultValue:null,description:"",name:"onPointerOverCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerOut:{defaultValue:null,description:"",name:"onPointerOut",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerOutCapture:{defaultValue:null,description:"",name:"onPointerOutCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onGotPointerCapture:{defaultValue:null,description:"",name:"onGotPointerCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onGotPointerCaptureCapture:{defaultValue:null,description:"",name:"onGotPointerCaptureCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onLostPointerCapture:{defaultValue:null,description:"",name:"onLostPointerCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onLostPointerCaptureCapture:{defaultValue:null,description:"",name:"onLostPointerCaptureCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onScroll:{defaultValue:null,description:"",name:"onScroll",required:!1,type:{name:"UIEventHandler<HTMLDivElement> | undefined"}},onScrollCapture:{defaultValue:null,description:"",name:"onScrollCapture",required:!1,type:{name:"UIEventHandler<HTMLDivElement> | undefined"}},onWheel:{defaultValue:null,description:"",name:"onWheel",required:!1,type:{name:"WheelEventHandler<HTMLDivElement> | undefined"}},onWheelCapture:{defaultValue:null,description:"",name:"onWheelCapture",required:!1,type:{name:"WheelEventHandler<HTMLDivElement> | undefined"}},onAnimationStartCapture:{defaultValue:null,description:"",name:"onAnimationStartCapture",required:!1,type:{name:"AnimationEventHandler<HTMLDivElement> | undefined"}},onAnimationEnd:{defaultValue:null,description:"",name:"onAnimationEnd",required:!1,type:{name:"AnimationEventHandler<HTMLDivElement> | undefined"}},onAnimationEndCapture:{defaultValue:null,description:"",name:"onAnimationEndCapture",required:!1,type:{name:"AnimationEventHandler<HTMLDivElement> | undefined"}},onAnimationIteration:{defaultValue:null,description:"",name:"onAnimationIteration",required:!1,type:{name:"AnimationEventHandler<HTMLDivElement> | undefined"}},onAnimationIterationCapture:{defaultValue:null,description:"",name:"onAnimationIterationCapture",required:!1,type:{name:"AnimationEventHandler<HTMLDivElement> | undefined"}},onTransitionEnd:{defaultValue:null,description:"",name:"onTransitionEnd",required:!1,type:{name:"TransitionEventHandler<HTMLDivElement> | undefined"}},onTransitionEndCapture:{defaultValue:null,description:"",name:"onTransitionEndCapture",required:!1,type:{name:"TransitionEventHandler<HTMLDivElement> | undefined"}}}}}catch{}try{K.displayName="TouchGlassOptimization",K.__docgenInfo={description:"",displayName:"TouchGlassOptimization",props:{onTap:{defaultValue:null,description:`Callback when the tap gesture successfully ends on this element.

\`\`\`jsx
function onTap(event, info) {
  console.log(info.point.x, info.point.y)
}

<motion.div onTap={onTap} />
\`\`\``,name:"onTap",required:!1,type:{name:"(() => void) | undefined"}},onLongPress:{defaultValue:null,description:"",name:"onLongPress",required:!1,type:{name:"(() => void) | undefined"}},onSwipe:{defaultValue:null,description:"",name:"onSwipe",required:!1,type:{name:'((direction: "left" | "right" | "up" | "down") => void) | undefined'}},touchFeedback:{defaultValue:{value:"true"},description:"",name:"touchFeedback",required:!1,type:{name:"boolean | undefined"}},rippleEffect:{defaultValue:{value:"true"},description:"",name:"rippleEffect",required:!1,type:{name:"boolean | undefined"}},hapticsEnabled:{defaultValue:{value:"true"},description:"",name:"hapticsEnabled",required:!1,type:{name:"boolean | undefined"}},glassIntensity:{defaultValue:{value:"medium"},description:"",name:"glassIntensity",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"light"'},{value:'"medium"'},{value:'"heavy"'}]}},onError:{defaultValue:null,description:"",name:"onError",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},defaultChecked:{defaultValue:null,description:"",name:"defaultChecked",required:!1,type:{name:"boolean | undefined"}},defaultValue:{defaultValue:null,description:"",name:"defaultValue",required:!1,type:{name:"string | number | readonly string[] | undefined"}},suppressContentEditableWarning:{defaultValue:null,description:"",name:"suppressContentEditableWarning",required:!1,type:{name:"boolean | undefined"}},suppressHydrationWarning:{defaultValue:null,description:"",name:"suppressHydrationWarning",required:!1,type:{name:"boolean | undefined"}},accessKey:{defaultValue:null,description:"",name:"accessKey",required:!1,type:{name:"string | undefined"}},autoCapitalize:{defaultValue:null,description:"",name:"autoCapitalize",required:!1,type:{name:'"off" | "none" | "on" | "sentences" | "words" | "characters" | (string & {}) | undefined'}},autoFocus:{defaultValue:null,description:"",name:"autoFocus",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},contentEditable:{defaultValue:null,description:"",name:"contentEditable",required:!1,type:{name:'Booleanish | "inherit" | "plaintext-only" | undefined'}},contextMenu:{defaultValue:null,description:"",name:"contextMenu",required:!1,type:{name:"string | undefined"}},dir:{defaultValue:null,description:"",name:"dir",required:!1,type:{name:"string | undefined"}},draggable:{defaultValue:null,description:"",name:"draggable",required:!1,type:{name:"Booleanish | undefined"}},enterKeyHint:{defaultValue:null,description:"",name:"enterKeyHint",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"enter"'},{value:'"done"'},{value:'"go"'},{value:'"next"'},{value:'"previous"'},{value:'"search"'},{value:'"send"'}]}},hidden:{defaultValue:null,description:"",name:"hidden",required:!1,type:{name:"boolean | undefined"}},id:{defaultValue:null,description:"",name:"id",required:!1,type:{name:"string | undefined"}},lang:{defaultValue:null,description:"",name:"lang",required:!1,type:{name:"string | undefined"}},nonce:{defaultValue:null,description:"",name:"nonce",required:!1,type:{name:"string | undefined"}},slot:{defaultValue:null,description:"",name:"slot",required:!1,type:{name:"string | undefined"}},spellCheck:{defaultValue:null,description:"",name:"spellCheck",required:!1,type:{name:"Booleanish | undefined"}},tabIndex:{defaultValue:null,description:"",name:"tabIndex",required:!1,type:{name:"number | undefined"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string | undefined"}},translate:{defaultValue:null,description:"",name:"translate",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"yes"'},{value:'"no"'}]}},radioGroup:{defaultValue:null,description:"",name:"radioGroup",required:!1,type:{name:"string | undefined"}},role:{defaultValue:null,description:"",name:"role",required:!1,type:{name:"AriaRole | undefined"}},about:{defaultValue:null,description:"",name:"about",required:!1,type:{name:"string | undefined"}},content:{defaultValue:null,description:"",name:"content",required:!1,type:{name:"string | undefined"}},datatype:{defaultValue:null,description:"",name:"datatype",required:!1,type:{name:"string | undefined"}},inlist:{defaultValue:null,description:"",name:"inlist",required:!1,type:{name:"any"}},prefix:{defaultValue:null,description:"",name:"prefix",required:!1,type:{name:"string | undefined"}},property:{defaultValue:null,description:"",name:"property",required:!1,type:{name:"string | undefined"}},rel:{defaultValue:null,description:"",name:"rel",required:!1,type:{name:"string | undefined"}},resource:{defaultValue:null,description:"",name:"resource",required:!1,type:{name:"string | undefined"}},rev:{defaultValue:null,description:"",name:"rev",required:!1,type:{name:"string | undefined"}},typeof:{defaultValue:null,description:"",name:"typeof",required:!1,type:{name:"string | undefined"}},vocab:{defaultValue:null,description:"",name:"vocab",required:!1,type:{name:"string | undefined"}},autoCorrect:{defaultValue:null,description:"",name:"autoCorrect",required:!1,type:{name:"string | undefined"}},autoSave:{defaultValue:null,description:"",name:"autoSave",required:!1,type:{name:"string | undefined"}},color:{defaultValue:null,description:"",name:"color",required:!1,type:{name:"string | undefined"}},itemProp:{defaultValue:null,description:"",name:"itemProp",required:!1,type:{name:"string | undefined"}},itemScope:{defaultValue:null,description:"",name:"itemScope",required:!1,type:{name:"boolean | undefined"}},itemType:{defaultValue:null,description:"",name:"itemType",required:!1,type:{name:"string | undefined"}},itemID:{defaultValue:null,description:"",name:"itemID",required:!1,type:{name:"string | undefined"}},itemRef:{defaultValue:null,description:"",name:"itemRef",required:!1,type:{name:"string | undefined"}},results:{defaultValue:null,description:"",name:"results",required:!1,type:{name:"number | undefined"}},security:{defaultValue:null,description:"",name:"security",required:!1,type:{name:"string | undefined"}},unselectable:{defaultValue:null,description:"",name:"unselectable",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"off"'},{value:'"on"'}]}},inputMode:{defaultValue:null,description:"",name:"inputMode",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"search"'},{value:'"text"'},{value:'"tel"'},{value:'"url"'},{value:'"email"'},{value:'"numeric"'},{value:'"decimal"'}]}},is:{defaultValue:null,description:"",name:"is",required:!1,type:{name:"string | undefined"}},exportparts:{defaultValue:null,description:"",name:"exportparts",required:!1,type:{name:"string | undefined"}},part:{defaultValue:null,description:"",name:"part",required:!1,type:{name:"string | undefined"}},"aria-activedescendant":{defaultValue:null,description:"",name:"aria-activedescendant",required:!1,type:{name:"string | undefined"}},"aria-atomic":{defaultValue:null,description:"",name:"aria-atomic",required:!1,type:{name:"Booleanish | undefined"}},"aria-autocomplete":{defaultValue:null,description:"",name:"aria-autocomplete",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"list"'},{value:'"inline"'},{value:'"both"'}]}},"aria-braillelabel":{defaultValue:null,description:"",name:"aria-braillelabel",required:!1,type:{name:"string | undefined"}},"aria-brailleroledescription":{defaultValue:null,description:"",name:"aria-brailleroledescription",required:!1,type:{name:"string | undefined"}},"aria-busy":{defaultValue:null,description:"",name:"aria-busy",required:!1,type:{name:"Booleanish | undefined"}},"aria-checked":{defaultValue:null,description:"",name:"aria-checked",required:!1,type:{name:'boolean | "true" | "false" | "mixed" | undefined'}},"aria-colcount":{defaultValue:null,description:"",name:"aria-colcount",required:!1,type:{name:"number | undefined"}},"aria-colindex":{defaultValue:null,description:"",name:"aria-colindex",required:!1,type:{name:"number | undefined"}},"aria-colindextext":{defaultValue:null,description:"",name:"aria-colindextext",required:!1,type:{name:"string | undefined"}},"aria-colspan":{defaultValue:null,description:"",name:"aria-colspan",required:!1,type:{name:"number | undefined"}},"aria-controls":{defaultValue:null,description:"",name:"aria-controls",required:!1,type:{name:"string | undefined"}},"aria-current":{defaultValue:null,description:"",name:"aria-current",required:!1,type:{name:'boolean | "true" | "false" | "page" | "step" | "location" | "date" | "time" | undefined'}},"aria-describedby":{defaultValue:null,description:"",name:"aria-describedby",required:!1,type:{name:"string | undefined"}},"aria-description":{defaultValue:null,description:"",name:"aria-description",required:!1,type:{name:"string | undefined"}},"aria-details":{defaultValue:null,description:"",name:"aria-details",required:!1,type:{name:"string | undefined"}},"aria-disabled":{defaultValue:null,description:"",name:"aria-disabled",required:!1,type:{name:"Booleanish | undefined"}},"aria-dropeffect":{defaultValue:null,description:"",name:"aria-dropeffect",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"link"'},{value:'"copy"'},{value:'"execute"'},{value:'"move"'},{value:'"popup"'}]}},"aria-errormessage":{defaultValue:null,description:"",name:"aria-errormessage",required:!1,type:{name:"string | undefined"}},"aria-expanded":{defaultValue:null,description:"",name:"aria-expanded",required:!1,type:{name:"Booleanish | undefined"}},"aria-flowto":{defaultValue:null,description:"",name:"aria-flowto",required:!1,type:{name:"string | undefined"}},"aria-grabbed":{defaultValue:null,description:"",name:"aria-grabbed",required:!1,type:{name:"Booleanish | undefined"}},"aria-haspopup":{defaultValue:null,description:"",name:"aria-haspopup",required:!1,type:{name:'boolean | "true" | "false" | "dialog" | "grid" | "listbox" | "menu" | "tree" | undefined'}},"aria-hidden":{defaultValue:null,description:"",name:"aria-hidden",required:!1,type:{name:"Booleanish | undefined"}},"aria-invalid":{defaultValue:null,description:"",name:"aria-invalid",required:!1,type:{name:'boolean | "true" | "false" | "grammar" | "spelling" | undefined'}},"aria-keyshortcuts":{defaultValue:null,description:"",name:"aria-keyshortcuts",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}},"aria-labelledby":{defaultValue:null,description:"",name:"aria-labelledby",required:!1,type:{name:"string | undefined"}},"aria-level":{defaultValue:null,description:"",name:"aria-level",required:!1,type:{name:"number | undefined"}},"aria-live":{defaultValue:null,description:"",name:"aria-live",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"off"'},{value:'"assertive"'},{value:'"polite"'}]}},"aria-modal":{defaultValue:null,description:"",name:"aria-modal",required:!1,type:{name:"Booleanish | undefined"}},"aria-multiline":{defaultValue:null,description:"",name:"aria-multiline",required:!1,type:{name:"Booleanish | undefined"}},"aria-multiselectable":{defaultValue:null,description:"",name:"aria-multiselectable",required:!1,type:{name:"Booleanish | undefined"}},"aria-orientation":{defaultValue:null,description:"",name:"aria-orientation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"horizontal"'},{value:'"vertical"'}]}},"aria-owns":{defaultValue:null,description:"",name:"aria-owns",required:!1,type:{name:"string | undefined"}},"aria-placeholder":{defaultValue:null,description:"",name:"aria-placeholder",required:!1,type:{name:"string | undefined"}},"aria-posinset":{defaultValue:null,description:"",name:"aria-posinset",required:!1,type:{name:"number | undefined"}},"aria-pressed":{defaultValue:null,description:"",name:"aria-pressed",required:!1,type:{name:'boolean | "true" | "false" | "mixed" | undefined'}},"aria-readonly":{defaultValue:null,description:"",name:"aria-readonly",required:!1,type:{name:"Booleanish | undefined"}},"aria-relevant":{defaultValue:null,description:"",name:"aria-relevant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"text"'},{value:'"additions"'},{value:'"additions removals"'},{value:'"additions text"'},{value:'"all"'},{value:'"removals"'},{value:'"removals additions"'},{value:'"removals text"'},{value:'"text additions"'},{value:'"text removals"'}]}},"aria-required":{defaultValue:null,description:"",name:"aria-required",required:!1,type:{name:"Booleanish | undefined"}},"aria-roledescription":{defaultValue:null,description:"",name:"aria-roledescription",required:!1,type:{name:"string | undefined"}},"aria-rowcount":{defaultValue:null,description:"",name:"aria-rowcount",required:!1,type:{name:"number | undefined"}},"aria-rowindex":{defaultValue:null,description:"",name:"aria-rowindex",required:!1,type:{name:"number | undefined"}},"aria-rowindextext":{defaultValue:null,description:"",name:"aria-rowindextext",required:!1,type:{name:"string | undefined"}},"aria-rowspan":{defaultValue:null,description:"",name:"aria-rowspan",required:!1,type:{name:"number | undefined"}},"aria-selected":{defaultValue:null,description:"",name:"aria-selected",required:!1,type:{name:"Booleanish | undefined"}},"aria-setsize":{defaultValue:null,description:"",name:"aria-setsize",required:!1,type:{name:"number | undefined"}},"aria-sort":{defaultValue:null,description:"",name:"aria-sort",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"ascending"'},{value:'"descending"'},{value:'"other"'}]}},"aria-valuemax":{defaultValue:null,description:"",name:"aria-valuemax",required:!1,type:{name:"number | undefined"}},"aria-valuemin":{defaultValue:null,description:"",name:"aria-valuemin",required:!1,type:{name:"number | undefined"}},"aria-valuenow":{defaultValue:null,description:"",name:"aria-valuenow",required:!1,type:{name:"number | undefined"}},"aria-valuetext":{defaultValue:null,description:"",name:"aria-valuetext",required:!1,type:{name:"string | undefined"}},dangerouslySetInnerHTML:{defaultValue:null,description:"",name:"dangerouslySetInnerHTML",required:!1,type:{name:"{ __html: string | TrustedHTML; } | undefined"}},onCopy:{defaultValue:null,description:"",name:"onCopy",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onCopyCapture:{defaultValue:null,description:"",name:"onCopyCapture",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onCut:{defaultValue:null,description:"",name:"onCut",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onCutCapture:{defaultValue:null,description:"",name:"onCutCapture",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onPaste:{defaultValue:null,description:"",name:"onPaste",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onPasteCapture:{defaultValue:null,description:"",name:"onPasteCapture",required:!1,type:{name:"ClipboardEventHandler<HTMLDivElement> | undefined"}},onCompositionEnd:{defaultValue:null,description:"",name:"onCompositionEnd",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onCompositionEndCapture:{defaultValue:null,description:"",name:"onCompositionEndCapture",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onCompositionStart:{defaultValue:null,description:"",name:"onCompositionStart",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onCompositionStartCapture:{defaultValue:null,description:"",name:"onCompositionStartCapture",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onCompositionUpdate:{defaultValue:null,description:"",name:"onCompositionUpdate",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onCompositionUpdateCapture:{defaultValue:null,description:"",name:"onCompositionUpdateCapture",required:!1,type:{name:"CompositionEventHandler<HTMLDivElement> | undefined"}},onFocus:{defaultValue:null,description:"",name:"onFocus",required:!1,type:{name:"FocusEventHandler<HTMLDivElement> | undefined"}},onFocusCapture:{defaultValue:null,description:"",name:"onFocusCapture",required:!1,type:{name:"FocusEventHandler<HTMLDivElement> | undefined"}},onBlur:{defaultValue:null,description:"",name:"onBlur",required:!1,type:{name:"FocusEventHandler<HTMLDivElement> | undefined"}},onBlurCapture:{defaultValue:null,description:"",name:"onBlurCapture",required:!1,type:{name:"FocusEventHandler<HTMLDivElement> | undefined"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onChangeCapture:{defaultValue:null,description:"",name:"onChangeCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onBeforeInput:{defaultValue:null,description:"",name:"onBeforeInput",required:!1,type:{name:"InputEventHandler<HTMLDivElement> | undefined"}},onBeforeInputCapture:{defaultValue:null,description:"",name:"onBeforeInputCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onInput:{defaultValue:null,description:"",name:"onInput",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onInputCapture:{defaultValue:null,description:"",name:"onInputCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onReset:{defaultValue:null,description:"",name:"onReset",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onResetCapture:{defaultValue:null,description:"",name:"onResetCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onSubmit:{defaultValue:null,description:"",name:"onSubmit",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onSubmitCapture:{defaultValue:null,description:"",name:"onSubmitCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onInvalid:{defaultValue:null,description:"",name:"onInvalid",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onInvalidCapture:{defaultValue:null,description:"",name:"onInvalidCapture",required:!1,type:{name:"FormEventHandler<HTMLDivElement> | undefined"}},onLoad:{defaultValue:null,description:"",name:"onLoad",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadCapture:{defaultValue:null,description:"",name:"onLoadCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onErrorCapture:{defaultValue:null,description:"",name:"onErrorCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onKeyDown:{defaultValue:null,description:"",name:"onKeyDown",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onKeyDownCapture:{defaultValue:null,description:"",name:"onKeyDownCapture",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onKeyPress:{defaultValue:null,description:"",name:"onKeyPress",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onKeyPressCapture:{defaultValue:null,description:"",name:"onKeyPressCapture",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onKeyUp:{defaultValue:null,description:"",name:"onKeyUp",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onKeyUpCapture:{defaultValue:null,description:"",name:"onKeyUpCapture",required:!1,type:{name:"KeyboardEventHandler<HTMLDivElement> | undefined"}},onAbort:{defaultValue:null,description:"",name:"onAbort",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onAbortCapture:{defaultValue:null,description:"",name:"onAbortCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onCanPlay:{defaultValue:null,description:"",name:"onCanPlay",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onCanPlayCapture:{defaultValue:null,description:"",name:"onCanPlayCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onCanPlayThrough:{defaultValue:null,description:"",name:"onCanPlayThrough",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onCanPlayThroughCapture:{defaultValue:null,description:"",name:"onCanPlayThroughCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onDurationChange:{defaultValue:null,description:"",name:"onDurationChange",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onDurationChangeCapture:{defaultValue:null,description:"",name:"onDurationChangeCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEmptied:{defaultValue:null,description:"",name:"onEmptied",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEmptiedCapture:{defaultValue:null,description:"",name:"onEmptiedCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEncrypted:{defaultValue:null,description:"",name:"onEncrypted",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEncryptedCapture:{defaultValue:null,description:"",name:"onEncryptedCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEnded:{defaultValue:null,description:"",name:"onEnded",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onEndedCapture:{defaultValue:null,description:"",name:"onEndedCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadedData:{defaultValue:null,description:"",name:"onLoadedData",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadedDataCapture:{defaultValue:null,description:"",name:"onLoadedDataCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadedMetadata:{defaultValue:null,description:"",name:"onLoadedMetadata",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadedMetadataCapture:{defaultValue:null,description:"",name:"onLoadedMetadataCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadStart:{defaultValue:null,description:"",name:"onLoadStart",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onLoadStartCapture:{defaultValue:null,description:"",name:"onLoadStartCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPause:{defaultValue:null,description:"",name:"onPause",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPauseCapture:{defaultValue:null,description:"",name:"onPauseCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPlay:{defaultValue:null,description:"",name:"onPlay",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPlayCapture:{defaultValue:null,description:"",name:"onPlayCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPlaying:{defaultValue:null,description:"",name:"onPlaying",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onPlayingCapture:{defaultValue:null,description:"",name:"onPlayingCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onProgress:{defaultValue:null,description:"",name:"onProgress",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onProgressCapture:{defaultValue:null,description:"",name:"onProgressCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onRateChange:{defaultValue:null,description:"",name:"onRateChange",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onRateChangeCapture:{defaultValue:null,description:"",name:"onRateChangeCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSeeked:{defaultValue:null,description:"",name:"onSeeked",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSeekedCapture:{defaultValue:null,description:"",name:"onSeekedCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSeeking:{defaultValue:null,description:"",name:"onSeeking",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSeekingCapture:{defaultValue:null,description:"",name:"onSeekingCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onStalled:{defaultValue:null,description:"",name:"onStalled",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onStalledCapture:{defaultValue:null,description:"",name:"onStalledCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSuspend:{defaultValue:null,description:"",name:"onSuspend",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSuspendCapture:{defaultValue:null,description:"",name:"onSuspendCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onTimeUpdate:{defaultValue:null,description:"",name:"onTimeUpdate",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onTimeUpdateCapture:{defaultValue:null,description:"",name:"onTimeUpdateCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onVolumeChange:{defaultValue:null,description:"",name:"onVolumeChange",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onVolumeChangeCapture:{defaultValue:null,description:"",name:"onVolumeChangeCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onWaiting:{defaultValue:null,description:"",name:"onWaiting",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onWaitingCapture:{defaultValue:null,description:"",name:"onWaitingCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onAuxClick:{defaultValue:null,description:"",name:"onAuxClick",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onAuxClickCapture:{defaultValue:null,description:"",name:"onAuxClickCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onClickCapture:{defaultValue:null,description:"",name:"onClickCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onContextMenu:{defaultValue:null,description:"",name:"onContextMenu",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onContextMenuCapture:{defaultValue:null,description:"",name:"onContextMenuCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onDoubleClick:{defaultValue:null,description:"",name:"onDoubleClick",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onDoubleClickCapture:{defaultValue:null,description:"",name:"onDoubleClickCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onDragCapture:{defaultValue:null,description:"",name:"onDragCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragEndCapture:{defaultValue:null,description:"",name:"onDragEndCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragEnter:{defaultValue:null,description:"",name:"onDragEnter",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragEnterCapture:{defaultValue:null,description:"",name:"onDragEnterCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragExit:{defaultValue:null,description:"",name:"onDragExit",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragExitCapture:{defaultValue:null,description:"",name:"onDragExitCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragLeave:{defaultValue:null,description:"",name:"onDragLeave",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragLeaveCapture:{defaultValue:null,description:"",name:"onDragLeaveCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragOver:{defaultValue:null,description:"",name:"onDragOver",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragOverCapture:{defaultValue:null,description:"",name:"onDragOverCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDragStartCapture:{defaultValue:null,description:"",name:"onDragStartCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDrop:{defaultValue:null,description:"",name:"onDrop",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onDropCapture:{defaultValue:null,description:"",name:"onDropCapture",required:!1,type:{name:"DragEventHandler<HTMLDivElement> | undefined"}},onMouseDown:{defaultValue:null,description:"",name:"onMouseDown",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseDownCapture:{defaultValue:null,description:"",name:"onMouseDownCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseEnter:{defaultValue:null,description:"",name:"onMouseEnter",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseLeave:{defaultValue:null,description:"",name:"onMouseLeave",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseMove:{defaultValue:null,description:"",name:"onMouseMove",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseMoveCapture:{defaultValue:null,description:"",name:"onMouseMoveCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseOut:{defaultValue:null,description:"",name:"onMouseOut",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseOutCapture:{defaultValue:null,description:"",name:"onMouseOutCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseOver:{defaultValue:null,description:"",name:"onMouseOver",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseOverCapture:{defaultValue:null,description:"",name:"onMouseOverCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseUp:{defaultValue:null,description:"",name:"onMouseUp",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onMouseUpCapture:{defaultValue:null,description:"",name:"onMouseUpCapture",required:!1,type:{name:"MouseEventHandler<HTMLDivElement> | undefined"}},onSelect:{defaultValue:null,description:"",name:"onSelect",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onSelectCapture:{defaultValue:null,description:"",name:"onSelectCapture",required:!1,type:{name:"ReactEventHandler<HTMLDivElement> | undefined"}},onTouchCancel:{defaultValue:null,description:"",name:"onTouchCancel",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchCancelCapture:{defaultValue:null,description:"",name:"onTouchCancelCapture",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchEnd:{defaultValue:null,description:"",name:"onTouchEnd",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchEndCapture:{defaultValue:null,description:"",name:"onTouchEndCapture",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchMove:{defaultValue:null,description:"",name:"onTouchMove",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchMoveCapture:{defaultValue:null,description:"",name:"onTouchMoveCapture",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchStart:{defaultValue:null,description:"",name:"onTouchStart",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onTouchStartCapture:{defaultValue:null,description:"",name:"onTouchStartCapture",required:!1,type:{name:"TouchEventHandler<HTMLDivElement> | undefined"}},onPointerDown:{defaultValue:null,description:"",name:"onPointerDown",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerDownCapture:{defaultValue:null,description:"",name:"onPointerDownCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerMove:{defaultValue:null,description:"",name:"onPointerMove",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerMoveCapture:{defaultValue:null,description:"",name:"onPointerMoveCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerUp:{defaultValue:null,description:"",name:"onPointerUp",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerUpCapture:{defaultValue:null,description:"",name:"onPointerUpCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerCancel:{defaultValue:null,description:"",name:"onPointerCancel",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerCancelCapture:{defaultValue:null,description:"",name:"onPointerCancelCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerEnter:{defaultValue:null,description:"",name:"onPointerEnter",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerLeave:{defaultValue:null,description:"",name:"onPointerLeave",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerOver:{defaultValue:null,description:"",name:"onPointerOver",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerOverCapture:{defaultValue:null,description:"",name:"onPointerOverCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerOut:{defaultValue:null,description:"",name:"onPointerOut",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onPointerOutCapture:{defaultValue:null,description:"",name:"onPointerOutCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onGotPointerCapture:{defaultValue:null,description:"",name:"onGotPointerCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onGotPointerCaptureCapture:{defaultValue:null,description:"",name:"onGotPointerCaptureCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onLostPointerCapture:{defaultValue:null,description:"",name:"onLostPointerCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onLostPointerCaptureCapture:{defaultValue:null,description:"",name:"onLostPointerCaptureCapture",required:!1,type:{name:"PointerEventHandler<HTMLDivElement> | undefined"}},onScroll:{defaultValue:null,description:"",name:"onScroll",required:!1,type:{name:"UIEventHandler<HTMLDivElement> | undefined"}},onScrollCapture:{defaultValue:null,description:"",name:"onScrollCapture",required:!1,type:{name:"UIEventHandler<HTMLDivElement> | undefined"}},onWheel:{defaultValue:null,description:"",name:"onWheel",required:!1,type:{name:"WheelEventHandler<HTMLDivElement> | undefined"}},onWheelCapture:{defaultValue:null,description:"",name:"onWheelCapture",required:!1,type:{name:"WheelEventHandler<HTMLDivElement> | undefined"}},onAnimationStartCapture:{defaultValue:null,description:"",name:"onAnimationStartCapture",required:!1,type:{name:"AnimationEventHandler<HTMLDivElement> | undefined"}},onAnimationEnd:{defaultValue:null,description:"",name:"onAnimationEnd",required:!1,type:{name:"AnimationEventHandler<HTMLDivElement> | undefined"}},onAnimationEndCapture:{defaultValue:null,description:"",name:"onAnimationEndCapture",required:!1,type:{name:"AnimationEventHandler<HTMLDivElement> | undefined"}},onAnimationIteration:{defaultValue:null,description:"",name:"onAnimationIteration",required:!1,type:{name:"AnimationEventHandler<HTMLDivElement> | undefined"}},onAnimationIterationCapture:{defaultValue:null,description:"",name:"onAnimationIterationCapture",required:!1,type:{name:"AnimationEventHandler<HTMLDivElement> | undefined"}},onTransitionEnd:{defaultValue:null,description:"",name:"onTransitionEnd",required:!1,type:{name:"TransitionEventHandler<HTMLDivElement> | undefined"}},onTransitionEndCapture:{defaultValue:null,description:"",name:"onTransitionEndCapture",required:!1,type:{name:"TransitionEventHandler<HTMLDivElement> | undefined"}}}}}catch{}const ee=`
  .ag-touch-story-surface {
    --glass-text-primary: #f8fafc;
    --glass-text-secondary: #e2e8f0;
    --glass-text-tertiary: #cbd5e1;
    --typography-text-primary: #f8fafc;
    --typography-text-secondary: #e2e8f0;
    height: 100vh;
    min-height: 100vh;
    width: 100%;
    overflow: auto;
    box-sizing: border-box;
    background:
      radial-gradient(circle at 18% 12%, rgba(59, 130, 246, 0.28), transparent 32%),
      radial-gradient(circle at 82% 16%, rgba(20, 184, 166, 0.22), transparent 30%),
      linear-gradient(135deg, #0f172a 0%, #4c1d95 50%, #164e63 100%);
    color: #f8fafc;
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
    color: #f8fafc !important;
  }

  .ag-touch-story-surface .glass-surface-subtle\\/10 {
    background: rgba(15, 23, 42, 0.76) !important;
  }

  .ag-touch-story-surface .glass-surface-subtle\\/20,
  .ag-touch-story-surface .glass-surface-blue\\/20,
  .ag-touch-story-surface .glass-surface-green\\/20 {
    background: rgba(30, 41, 59, 0.82) !important;
  }

  .ag-touch-story-surface .glass-contrast-guard {
    color: #f8fafc !important;
  }

  .ag-touch-story-surface button:disabled {
    opacity: 0.52;
    cursor: not-allowed;
  }

  .ag-touch-story-surface button {
    background: rgba(15, 23, 42, 0.88) !important;
    color: #f8fafc !important;
    border-color: rgba(226, 232, 240, 0.24) !important;
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
`,ie={title:"Effects + Advanced/Touch Glass Optimization",component:H,parameters:{docs:{description:{component:"Comprehensive touch interaction optimization for glassmorphism components with haptic feedback, gesture recognition, and mobile-first interactions."}},layout:"fullscreen"},decorators:[a=>e.jsxs(e.Fragment,{children:[e.jsx("style",{children:ee}),e.jsx(a,{})]})],tags:["autodocs"]},ae=()=>{const[a,i]=s.useState(0),[r,d]=s.useState(0),[l,n]=s.useState(null),[o,t]=s.useState(""),c=()=>{i(u=>u+1),t("Tap")},y=()=>{d(u=>u+1),t("Long Press")},m=u=>{n(u),t(`Swipe ${u}`)};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"glass-text-center",children:[e.jsx("h2",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"Touch Glass Interactions"}),e.jsx("p",{className:"glass-text-primary",children:"Try tapping, long pressing, and swiping on the glass below"})]}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-6",children:[e.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-text-center glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-2",children:a}),e.jsx("div",{className:"glass-text-primary",children:"Taps"})]}),e.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-text-center glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-2",children:r}),e.jsx("div",{className:"glass-text-primary",children:"Long Presses"})]}),e.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-text-center glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-2",children:l?l.toUpperCase():"—"}),e.jsx("div",{className:"glass-text-primary",children:"Last Swipe"})]})]}),e.jsx("div",{className:"glass-text-center",children:e.jsxs("div",{className:"inline-glass-block glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-px-6 glass-py-3 glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-primary glass-text-sm",children:"Last Action:"}),e.jsx("div",{className:"glass-text-primary glass-font-medium",children:o||"None"})]})}),e.jsx("div",{className:"glass-text-center",children:e.jsx(H,{onTap:c,onLongPress:y,onSwipe:m,touchFeedback:!0,rippleEffect:!0,hapticsEnabled:!0,glassIntensity:"medium",className:"glass-mx-auto",children:e.jsxs("div",{className:"glass-p-8 min-h-[200px] glass-flex glass-flex-col glass-items-center glass-justify-center",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"👆"}),e.jsx("div",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Touch Glass"}),e.jsx("div",{className:"glass-text-primary glass-text-sm glass-text-center max-w-xs",children:"Tap, long press, or swipe this glass surface to see different interactions"})]})})}),e.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard",children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Touch Instructions"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4 glass-text-primary",children:[e.jsxs("div",{className:"glass-space-y-2",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-blue"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Tap:"})," Quick touch for immediate action"]})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Long Press:"})," Hold for 500ms for context menu"]})]})]}),e.jsxs("div",{className:"glass-space-y-2",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-primary"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Swipe Left/Right:"})," Navigate between content"]})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-primary"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Swipe Up/Down:"})," Scroll or dismiss"]})]})]})]})]})]})},A={args:{},render:()=>e.jsx("div",{className:"ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:e.jsx("div",{className:"max-w-4xl glass-mx-auto",children:e.jsx(ae,{})})})},O={args:{touchFeedback:!0,rippleEffect:!0,hapticsEnabled:!0,children:e.jsxs("div",{className:"glass-p-6 glass-text-center",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"📱"}),e.jsx("div",{className:"glass-text-primary glass-font-medium",children:"Touch Feedback"}),e.jsx("div",{className:"glass-text-primary glass-text-sm",children:"Visual, haptic, and ripple effects"})]})},render:a=>e.jsx("div",{className:"ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:e.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[e.jsxs("div",{className:"glass-text-center mb-12",children:[e.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"🎯 Touch Feedback Demo"}),e.jsx("p",{className:"glass-text-xl glass-text-primary",children:"Experience visual feedback, haptic responses, and ripple effects"})]}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-8 mb-12",children:[e.jsx(H,{...a,onTap:()=>console.log("Light feedback"),glassIntensity:"light"}),e.jsx(H,{...a,onTap:()=>console.log("Medium feedback"),glassIntensity:"medium"}),e.jsx(H,{...a,onTap:()=>console.log("Heavy feedback"),glassIntensity:"heavy"})]}),e.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard",children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Feedback Types"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-6",children:[e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"👆"}),e.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Visual Feedback"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Scale and opacity changes on touch"})]}),e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"📳"}),e.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Haptic Feedback"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Vibration patterns for touch confirmation"})]}),e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"💫"}),e.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Ripple Effects"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Material Design-inspired touch ripples"})]})]})]})]})})},F={args:{},render:()=>{const[a,i]=s.useState(0),[r,d]=s.useState([]),l=[{title:"Dashboard",icon:"📊",color:"linear-gradient(135deg, #3b82f6, #06b6d4)"},{title:"Messages",icon:"💬",color:"linear-gradient(135deg, #22c55e, #10b981)"},{title:"Settings",icon:"⚙️",color:"linear-gradient(135deg, #8b5cf6, #ec4899)"},{title:"Profile",icon:"👤",color:"linear-gradient(135deg, #f97316, #ef4444)"}],n=o=>{d(t=>[...t.slice(-4),o]),o==="left"&&a<l.length-1?i(t=>t+1):o==="right"&&a>0&&i(t=>t-1)};return e.jsx("div",{className:"ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:e.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[e.jsxs("div",{className:"glass-text-center mb-12",children:[e.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"📱 Mobile Glass Navigation"}),e.jsx("p",{className:"glass-text-xl glass-text-primary",children:"Swipe left/right to navigate between pages"})]}),e.jsxs("div",{className:"mb-8",children:[e.jsx("div",{className:"glass-flex glass-justify-center glass-gap-2 glass-mb-4",children:l.map((o,t)=>e.jsx("div",{className:"glass-radius-full",style:{width:12,height:12,background:t===a?"#fff":"rgba(255,255,255,0.36)",transition:"background 160ms ease"}},t))}),e.jsx("div",{className:"glass-text-center mb-6",children:e.jsxs("div",{className:"inline-glass-block glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-px-6 glass-py-3 glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-primary glass-text-sm",children:"Current Page"}),e.jsx("div",{className:"glass-text-primary glass-font-medium",children:l[a].title})]})})]}),e.jsx(W,{onSwipeLeft:()=>n("left"),onSwipeRight:()=>n("right"),onSwipeUp:()=>n("up"),onSwipeDown:()=>n("down"),children:e.jsxs("div",{className:"glass-p-8 glass-text-center",children:[e.jsx("div",{className:"glass-radius-2xl glass-mb-6",style:{display:"inline-block",padding:32,background:l[a].color},children:e.jsx("div",{className:"glass-text-6xl",children:l[a].icon})}),e.jsx("h2",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:l[a].title}),e.jsx("p",{className:"glass-text-primary glass-text-lg",children:"Swipe left or right to navigate between different sections"})]})}),e.jsxs("div",{className:"mt-8 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard",children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Swipe History"}),e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-2",children:r.length===0?e.jsx("div",{className:"glass-text-primary",children:"No swipes yet"}):r.map((o,t)=>e.jsxs("div",{className:"glass-px-3 glass-py-1 glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-text-sm",children:[o," →"]},t))})]}),e.jsxs("div",{className:"mt-8 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard",children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Navigation Controls"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4",children:[e.jsx("button",{onClick:()=>n("left"),className:"glass-px-4 glass-py-2 glass-surface-blue/20 hover:glass-surface-blue/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",disabled:a>=l.length-1,children:"← Left"}),e.jsx("button",{onClick:()=>n("right"),className:"glass-px-4 glass-py-2 glass-surface-blue/20 hover:glass-surface-blue/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",disabled:a<=0,children:"Right →"}),e.jsx("button",{onClick:()=>n("up"),className:"glass-px-4 glass-py-2 glass-surface-green/20 hover:glass-surface-green/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"↑ Up"}),e.jsx("button",{onClick:()=>n("down"),className:"glass-px-4 glass-py-2 glass-surface-green/20 hover:glass-surface-green/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"Down ↓"})]})]})]})})}},B={args:{},render:()=>e.jsx("div",{className:"ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:e.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[e.jsxs("div",{className:"glass-text-center mb-12",children:[e.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"📐 Adaptive Glass Density"}),e.jsx("p",{className:"glass-text-xl glass-text-primary",children:"Glass effects that automatically adapt to screen size and device capabilities"})]}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-3 glass-gap-8 mb-12",children:[e.jsx(w,{screenSize:"small",devicePixelRatio:1,autoAdapt:!0,children:e.jsxs("div",{className:"glass-p-6 glass-text-center",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"📱"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Mobile (Small)"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Optimized for small screens with reduced effects for better performance"}),e.jsxs("div",{className:"mt-4 glass-text-primary glass-text-xs",children:["• Lower density effects",e.jsx("br",{}),"• Reduced blur intensity",e.jsx("br",{}),"• Minimal animations",e.jsx("br",{}),"• Touch-optimized"]})]})}),e.jsx(w,{screenSize:"medium",devicePixelRatio:1.5,autoAdapt:!0,children:e.jsxs("div",{className:"glass-p-6 glass-text-center",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"💻"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Tablet (Medium)"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Balanced effects for medium screens with moderate performance impact"}),e.jsxs("div",{className:"mt-4 glass-text-primary glass-text-xs",children:["• Medium density effects",e.jsx("br",{}),"• Standard blur intensity",e.jsx("br",{}),"• Balanced animations",e.jsx("br",{}),"• Touch-friendly"]})]})}),e.jsx(w,{screenSize:"large",devicePixelRatio:2,autoAdapt:!0,children:e.jsxs("div",{className:"glass-p-6 glass-text-center",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"🖥️"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Desktop (Large)"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Full effects for large screens with high-performance capabilities"}),e.jsxs("div",{className:"mt-4 glass-text-primary glass-text-xs",children:["• High density effects",e.jsx("br",{}),"• Maximum blur intensity",e.jsx("br",{}),"• Complex animations",e.jsx("br",{}),"• Mouse optimized"]})]})})]}),e.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard",children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center",children:"Adaptive Features"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-4 glass-gap-6",children:[e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"📏"}),e.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Screen Size"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Adapts to viewport dimensions"})]}),e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"🔍"}),e.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Pixel Ratio"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Considers device pixel density"})]}),e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"⚡"}),e.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Performance"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Auto-adjusts based on capabilities"})]}),e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"♿"}),e.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Accessibility"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Maintains usability across devices"})]})]})]})]})})},I={args:{},render:()=>e.jsx("div",{className:"ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:e.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[e.jsxs("div",{className:"glass-text-center mb-12",children:[e.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"💫 Touch Ripple Effects"}),e.jsx("p",{className:"glass-text-xl glass-text-primary",children:"Material Design-inspired ripple effects with customizable colors and timing"})]}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-8 mb-12",children:[e.jsx(L,{color:"var(--glass-border-default)",maxRipples:3,rippleDuration:600,children:e.jsxs("div",{className:"glass-p-8 glass-text-center glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"🌊"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Default Ripple"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Standard white ripple with medium duration and up to 3 simultaneous ripples"})]})}),e.jsx(L,{color:"hsl(var(--glass-color-primary)/0.6)",maxRipples:5,rippleDuration:800,children:e.jsxs("div",{className:"glass-p-8 glass-text-center glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"💙"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Blue Ripple"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Custom blue color with longer duration and more simultaneous ripples"})]})}),e.jsx(L,{color:"hsl(var(--glass-color-success)/0.5)",maxRipples:2,rippleDuration:400,children:e.jsxs("div",{className:"glass-p-8 glass-text-center glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"💚"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Green Ripple"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Fast green ripple with limited simultaneous effects for subtle feedback"})]})}),e.jsx(L,{color:"rgba(249, 115, 22, 0.7)",maxRipples:4,rippleDuration:1e3,children:e.jsxs("div",{className:"glass-p-8 glass-text-center glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"🧡"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Orange Ripple"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Bold orange ripple with slow, dramatic animation and multiple effects"})]})})]}),e.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard",children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center",children:"Ripple Effect Features"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-8",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-3",children:"Customization Options"}),e.jsxs("div",{className:"glass-space-y-2 glass-text-primary",children:[e.jsx("div",{children:"• Custom colors and opacity"}),e.jsx("div",{children:"• Adjustable animation duration"}),e.jsx("div",{children:"• Configurable ripple limits"}),e.jsx("div",{children:"• Size and scale control"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-3",children:"Performance Features"}),e.jsxs("div",{className:"glass-space-y-2 glass-text-primary",children:[e.jsx("div",{children:"• Efficient DOM manipulation"}),e.jsx("div",{children:"• Automatic cleanup"}),e.jsx("div",{children:"• GPU-accelerated animations"}),e.jsx("div",{children:"• Memory leak prevention"})]})]})]})]})]})})},G={args:{},render:()=>{const[a,i]=s.useState({menu:!1,settings:!1,profile:!1}),r=l=>{i(n=>({...n,[l]:!0}))},d=l=>{i(n=>({...n,[l]:!1}))};return e.jsx("div",{className:"ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:e.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[e.jsxs("div",{className:"glass-text-center mb-12",children:[e.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"📄 Mobile Glass Bottom Sheet"}),e.jsx("p",{className:"glass-text-xl glass-text-primary",children:"Touch-optimized bottom sheets with snap points and smooth animations"})]}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-6 mb-12",children:[e.jsx("div",{className:"glass-text-center",children:e.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-mb-4 glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"🍽️"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Menu Sheet"}),e.jsx("p",{className:"glass-text-primary glass-text-sm glass-mb-4",children:"Navigation menu with quick actions and shortcuts"}),e.jsx("button",{onClick:()=>r("menu"),className:"glass-px-6 glass-py-2 glass-surface-blue/20 hover:glass-surface-blue/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"Open Menu"})]})}),e.jsx("div",{className:"glass-text-center",children:e.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-mb-4 glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"⚙️"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Settings Sheet"}),e.jsx("p",{className:"glass-text-primary glass-text-sm glass-mb-4",children:"Configuration options and preferences panel"}),e.jsx("button",{onClick:()=>r("settings"),className:"glass-px-6 glass-py-2 glass-surface-green/20 hover:glass-surface-green/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"Open Settings"})]})}),e.jsx("div",{className:"glass-text-center",children:e.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-mb-4 glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"👤"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Profile Sheet"}),e.jsx("p",{className:"glass-text-primary glass-text-sm glass-mb-4",children:"User profile information and account settings"}),e.jsx("button",{onClick:()=>r("profile"),className:"glass-px-6 glass-py-2 glass-surface-primary/20 hover:glass-surface-primary/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"Open Profile"})]})})]}),e.jsx(S,{isOpen:a.menu,onClose:()=>d("menu"),height:"60vh",snapPoints:["30vh","60vh","80vh"],children:e.jsxs("div",{className:"glass-p-6",children:[e.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary mb-6",children:"Navigation Menu"}),e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"🏠 Home"}),e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"🔍 Search"}),e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"❤️ Favorites"}),e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"📱 Downloads"}),e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"⚙️ Settings"})]})]})}),e.jsx(S,{isOpen:a.settings,onClose:()=>d("settings"),height:"70vh",snapPoints:["40vh","70vh"],children:e.jsxs("div",{className:"glass-p-6",children:[e.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary mb-6",children:"Settings"}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsx("span",{className:"glass-text-primary glass-font-medium",children:"Notifications"}),e.jsx("div",{className:"glass-w-12 glass-h-6 glass-surface-subtle/20 glass-radius-full glass-p-1",children:e.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-subtle glass-radius-full transform translate-x-6"})})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsx("span",{className:"glass-text-primary glass-font-medium",children:"Dark Mode"}),e.jsx("div",{className:"glass-w-12 glass-h-6 glass-surface-blue glass-radius-full glass-p-1",children:e.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-subtle glass-radius-full"})})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsx("span",{className:"glass-text-primary glass-font-medium",children:"Auto-play"}),e.jsx("div",{className:"glass-w-12 glass-h-6 glass-surface-subtle/20 glass-radius-full glass-p-1",children:e.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-subtle glass-radius-full"})})]}),e.jsx("div",{className:"pt-4 glass-border-t glass-border-white/20",children:e.jsx("button",{className:"glass-w-full glass-p-3 glass-surface-red/20 hover:glass-surface-red/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"Clear Cache"})})]})]})}),e.jsx(S,{isOpen:a.profile,onClose:()=>d("profile"),height:"75vh",snapPoints:["50vh","75vh"],children:e.jsxs("div",{className:"glass-p-6",children:[e.jsxs("div",{className:"glass-text-center mb-6",children:[e.jsx("div",{className:"glass-w-20 glass-h-20 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full glass-mx-auto glass-mb-4 glass-flex glass-items-center glass-justify-center",children:e.jsx("span",{className:"glass-text-3xl",children:"👤"})}),e.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-2",children:"John Doe"}),e.jsx("p",{className:"glass-text-primary",children:"john.doe@example.com"})]}),e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"✏️ Edit Profile"}),e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"🔒 Privacy Settings"}),e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"🔔 Notification Preferences"}),e.jsx("button",{className:"glass-w-full glass-p-4 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-font-medium transition-colors glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:"💳 Subscription"}),e.jsx("div",{className:"pt-4 glass-border-t glass-border-white/20",children:e.jsx("button",{className:"glass-w-full glass-p-3 glass-surface-red/20 hover:glass-surface-red/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"Sign Out"})})]})]})}),e.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard",children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center",children:"Bottom Sheet Features"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-4 glass-gap-6",children:[e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"📏"}),e.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Snap Points"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Multiple height positions"})]}),e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"👆"}),e.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Touch Drag"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Smooth drag interactions"})]}),e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"🎯"}),e.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Backdrop"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Modal backdrop with blur"})]}),e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"📱"}),e.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Mobile First"}),e.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Optimized for mobile UX"})]})]})]})]})})}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="ag-touch-story-surface glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <TouchDemo />
      </div>
    </div>
}`,...A.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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

        <div className="glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
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
}`,...O.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
              <div className="inline-glass-block glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-px-6 glass-py-3 glass-contrast-guard">
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

          <div className="mt-8 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">
              Swipe History
            </h3>
            <div className="glass-flex glass-flex-wrap glass-gap-2">
              {swipeHistory.length === 0 ? <div className="glass-text-primary">No swipes yet</div> : swipeHistory.map((swipe, index) => <div key={index} className="glass-px-3 glass-py-1 glass-surface-subtle/20 glass-radius-lg glass-text-primary glass-text-sm">
                    {swipe} →
                  </div>)}
            </div>
          </div>

          <div className="mt-8 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
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
}`,...F.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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

        <div className="glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
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
}`,...B.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
            <div className="glass-p-8 glass-text-center glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard">
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

          <TouchRippleEffects color="hsl(var(--glass-color-primary)/0.6)" maxRipples={5} rippleDuration={800}>
            <div className="glass-p-8 glass-text-center glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-3">💙</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">
                Blue Ripple
              </h3>
              <p className="glass-text-primary glass-text-sm">
                Custom blue color with longer duration and more simultaneous
                ripples
              </p>
            </div>
          </TouchRippleEffects>

          <TouchRippleEffects color="hsl(var(--glass-color-success)/0.5)" maxRipples={2} rippleDuration={400}>
            <div className="glass-p-8 glass-text-center glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-3">💚</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">
                Green Ripple
              </h3>
              <p className="glass-text-primary glass-text-sm">
                Fast green ripple with limited simultaneous effects for subtle
                feedback
              </p>
            </div>
          </TouchRippleEffects>

          <TouchRippleEffects color="rgba(249, 115, 22, 0.7)" maxRipples={4} rippleDuration={1000}>
            <div className="glass-p-8 glass-text-center glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-contrast-guard">
              <div className="glass-text-4xl glass-mb-3">🧡</div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">
                Orange Ripple
              </h3>
              <p className="glass-text-primary glass-text-sm">
                Bold orange ripple with slow, dramatic animation and multiple
                effects
              </p>
            </div>
          </TouchRippleEffects>
        </div>

        <div className="glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
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
}`,...I.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
              <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-mb-4 glass-contrast-guard">
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
              <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-mb-4 glass-contrast-guard">
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
              <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-mb-4 glass-contrast-guard">
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

          <div className="glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-2xl glass-p-6 glass-contrast-guard">
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
}`,...G.parameters?.docs?.source}}};const re=["InteractiveTouch","TouchFeedback","MobileNavigation","AdaptiveDensity","RippleEffects","BottomSheet"];export{B as AdaptiveDensity,G as BottomSheet,A as InteractiveTouch,F as MobileNavigation,I as RippleEffects,O as TouchFeedback,re as __namedExportsOrder,ie as default};
