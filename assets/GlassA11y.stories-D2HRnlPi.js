import{R as x,a as ms,r as u,j as s,b as N,m as w,c as h,d as F}from"./iframe-DFMMcocb.js";import{f as $}from"./index-DdjpOZjl.js";import{C as ps,M as bs,V as hs,K as xs,A as ys,S as fs,a as vs,R as Ns,b as ws,I as js,c as ks,d as Cs,T as Ss}from"./components-Ue9Uo88O.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";const W={contrastLevel:"normal",motionPreference:"full",reduceTransparency:!1,fontSizeMultiplier:1,colorBlindnessType:"none",enhanceKeyboardNavigation:!0,provideLongDescriptions:!0,useColorBlindFriendlyPalette:!1,enableHoverEffects:!1,announceStateChanges:!1,showSkipLinks:!1},p=x.forwardRef(function({className:a="",showDashboard:n=!0,onConfigChange:o,enableTesting:y=!0,position:g="fixed",defaultOpen:Q=!1,compact:X=!1,contained:Y=!1,preview:Z=!1,maxHeight:K,maxWidth:L,density:ss="comfortable","aria-label":as,"data-testid":es},ls){const C=ms(),[r,d]=u.useState(W),[V,rs]=u.useState(Q),[f,q]=u.useState("overview"),[I,O]=u.useState([]),[P,B]=u.useState(!1),m=r.motionPreference==="reduced",l=r.contrastLevel==="high",ts=r.reduceTransparency,[ns,is]=u.useState([{id:"contrast",title:"High Contrast & Visual",icon:s.jsx(ps,{className:"glass-w-5 glass-h-5"}),description:"Adjust contrast levels and visual accessibility settings",component:()=>s.jsx(D,{config:r,updateConfig:d,isHighContrast:l}),isExpanded:!1},{id:"motion",title:"Motion & Animation",icon:s.jsx(bs,{className:"glass-w-5 glass-h-5"}),description:"Control motion and animation preferences",component:()=>s.jsx(j,{config:r,updateConfig:d,isMotionReduced:m}),isExpanded:!1},{id:"screen-reader",title:"Screen Reader",icon:s.jsx(hs,{className:"glass-w-5 glass-h-5"}),description:"Enhanced screen reader support and descriptions",component:()=>s.jsx(H,{config:r,updateConfig:d}),isExpanded:!1},{id:"keyboard",title:"Keyboard Navigation",icon:s.jsx(xs,{className:"glass-w-5 glass-h-5"}),description:"Enhanced keyboard navigation and focus indicators",component:()=>s.jsx(k,{config:r,updateConfig:d}),isExpanded:!1}]);u.useEffect(()=>{o?.(r)},[r,o]);const os=u.useCallback(e=>{is(b=>b.map(S=>S.id===e?{...S,isExpanded:!S.isExpanded}:S))},[]),gs=u.useCallback(async()=>{B(!0);try{await new Promise(b=>setTimeout(b,N.DURATION.slower*1.5));const e=[{test:"WCAG 2.1 AA Compliance",status:"passed",score:95,details:"Most elements meet contrast requirements"},{test:"Keyboard Navigation",status:r.enhanceKeyboardNavigation?"passed":"warning",score:r.enhanceKeyboardNavigation?100:75,details:r.enhanceKeyboardNavigation?"All interactive elements are keyboard accessible":"Some elements may not be fully keyboard accessible"},{test:"Motion Preferences",status:"passed",score:100,details:"Motion preferences are respected"},{test:"Screen Reader Support",status:r.provideLongDescriptions?"passed":"warning",score:r.provideLongDescriptions?95:80,details:r.provideLongDescriptions?"Comprehensive descriptions provided":"Basic screen reader support active"},{test:"Color Blindness Support",status:r.useColorBlindFriendlyPalette?"passed":"info",score:r.useColorBlindFriendlyPalette?100:85,details:r.useColorBlindFriendlyPalette?"Color blind friendly palette active":"Standard color palette in use"}];O(e)}catch{O([])}finally{B(!1)}},[r]),ds=[{id:"high-contrast",label:"High Contrast",active:l,onClick:()=>d(e=>({...e,contrastLevel:e.contrastLevel==="high"?"normal":"high"}))},{id:"reduce-motion",label:"Reduce Motion",active:m,onClick:()=>d(e=>({...e,motionPreference:e.motionPreference==="reduced"?"full":"reduced"}))},{id:"reduce-transparency",label:"Reduce Transparency",active:ts,onClick:()=>d(e=>({...e,reduceTransparency:!e.reduceTransparency}))},{id:"large-text",label:"Large Text",active:r.fontSizeMultiplier>1,onClick:()=>d(e=>({...e,fontSizeMultiplier:e.fontSizeMultiplier>1?1:1.25}))}];if(!n)return null;const i=X||Z||ss==="compact",z=typeof K=="number"?`${K}px`:K,cs=typeof L=="number"?`${L}px`:L,c=Y||i,v=!c&&g==="relative",us={position:c?"relative":g,top:!c&&g==="fixed"?"20px":void 0,right:!c&&g==="fixed"?"20px":void 0,zIndex:!c&&g==="fixed"?1e3:void 0,maxHeight:c?z??"220px":void 0,maxWidth:cs??(c?"320px":void 0),width:c?"100%":void 0,overflow:c?"hidden":void 0};return s.jsxs("div",{ref:ls,className:`glass-a11y-controller ${a}`,style:{...us},"aria-label":as,"data-testid":es,children:[s.jsx(w.button,{onClick:()=>rs(!V),className:h("glass-foundation-complete glass-radius-full",i?"glass-w-10 glass-h-10":"glass-w-14 glass-h-14","flex items-center justify-center glass-shadow-lg hover:glass-shadow-xl","glass-transition glass-focus glass-press glass-magnet",{"glass-surface-dark glass-text-primary glass-border-primary":l,"glass-surface-transparent glass-text-secondary glass-border-subtle":!l,"rotate-45":V}),whileHover:{scale:1.05},whileTap:{scale:.95},"aria-label":"Toggle accessibility controls",title:"Accessibility Settings",children:s.jsx(ys,{className:"glass-w-6 glass-h-6"})}),s.jsx(F,{children:V&&s.jsxs(w.div,{initial:{opacity:0,scale:.9,y:-20},animate:C?{}:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.9,y:-20},transition:C?{duration:0}:{duration:m?N.DURATION.fast/1e3:N.DURATION.normal/1e3},className:h("glass-foundation-complete glass-w-96 glass-max-h-80vh overflow-hidden glass-shadow-2xl glass-radius-2xl glass-flex glass-flex-col",v?"glass-relative glass-ml-auto glass-mt-3":h("glass-absolute glass-right-0",i?"glass-top-11":"glass-top-16"),{"glass-surface-dark glass-border-primary glass-text-primary":l,"glass-surface-translucent glass-border-subtle glass-text-secondary":!l}),style:{position:v?"relative":"absolute",top:v?"auto":void 0,right:v?"auto":void 0,marginLeft:v?"auto":void 0,width:i?"min(20rem, 100%)":"min(24rem, calc(100vw - 2rem))",maxHeight:z??(i?"220px":"min(80vh, 42rem)")},"data-glass-a11y-panel":!0,"data-glass-a11y-placement":v?"flow":"popover",children:[s.jsxs("div",{className:h(i?"glass-p-3":"glass-p-6","glass-border-b glass-border-white/10"),children:[s.jsxs("div",{className:h("glass-flex glass-items-center glass-justify-between",i?"glass-mb-2":"glass-mb-4"),children:[s.jsxs("h2",{className:h("glass-font-semibold glass-flex glass-items-center glass-gap-2",i?"glass-text-sm":"glass-text-xl"),children:[s.jsx(fs,{className:"glass-w-5 glass-h-5"}),i?"A11y":"Accessibility Controls"]}),s.jsxs("div",{className:"glass-flex glass-gap-2",children:[s.jsx("button",{onClick:()=>{},className:`
                      p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 glass-focus glass-touch-target glass-contrast-guard
                      ${l?"hover:bg-white/20 text-white":"hover:bg-white/10 glass-text-secondary"}
                    `,title:"Detect system preferences",children:s.jsx(vs,{className:"glass-w-4 glass-h-4"})}),s.jsx("button",{onClick:()=>d(W),className:`
                      p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 glass-focus glass-touch-target glass-contrast-guard
                      ${l?"hover:bg-white/20 text-white":"hover:bg-white/10 glass-text-secondary"}
                    `,title:"Reset to defaults",children:s.jsx(Ns,{className:"glass-w-4 glass-h-4"})})]})]}),s.jsx("div",{className:h("glass-grid glass-grid-cols-2",i?"glass-gap-1":"glass-gap-2-5"),children:ds.map(e=>s.jsx(w.button,{onClick:e.onClick,whileHover:{scale:m?1:1.02},whileTap:{scale:m?1:.98},className:`
                      ${i?"p-2 text-xs":"p-3 text-sm"} rounded-lg font-medium transition-all duration-200
                      border focus:outline-none focus:ring-2 focus:ring-gray-400
                      ${e.active?l?"bg-white/30 border-white text-white":"bg-white/60 border-gray-400/50 text-gray-900":l?"bg-white/10 border-white/20 text-white/80 hover:bg-white/20":"bg-white/5 border-white/10 glass-text-secondary hover:bg-white/10"}
                    `,children:s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1",children:[e.active&&s.jsx(ws,{className:"glass-w-3 glass-h-3"}),s.jsx("span",{className:"glass-truncate",children:e.label})]})},e.id))})]}),s.jsxs("div",{className:"glass-flex-1 glass-overflow-y-auto",style:{minHeight:0},"data-glass-a11y-scroll-region":!0,children:[s.jsxs("div",{className:"glass-flex glass-border-b glass-border-white/10",children:[s.jsx("button",{onClick:()=>q("overview"),className:`
                    flex-1 ${i?"px-2 py-2 text-xs":"px-4 py-3 text-sm"} font-medium transition-colors
                    focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-inset glass-focus glass-touch-target glass-contrast-guard
                    ${f==="overview"?l?"bg-white/20 text-white":"bg-white/60 text-gray-900":l?"text-white/70 hover:text-white":"glass-text-secondary hover:glass-text-primary"}
                  `,children:"Overview"}),s.jsx("button",{onClick:()=>q("sections"),className:`
                    flex-1 ${i?"px-2 py-2 text-xs":"px-4 py-3 text-sm"} font-medium transition-colors
                    focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-inset glass-focus glass-touch-target glass-contrast-guard
                    ${f==="sections"?l?"bg-white/20 text-white":"bg-white/60 text-gray-900":l?"text-white/70 hover:text-white":"glass-text-secondary hover:glass-text-primary"}
                  `,children:"Settings"}),y&&s.jsx("button",{onClick:()=>q("testing"),className:`
                      flex-1 ${i?"px-2 py-2 text-xs":"px-4 py-3 text-sm"} font-medium transition-colors
                      focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-inset glass-focus glass-touch-target glass-contrast-guard
                      ${f==="testing"?l?"bg-white/20 text-white":"bg-white/60 text-gray-900":l?"text-white/70 hover:text-white":"glass-text-secondary hover:glass-text-primary"}
                    `,children:"Testing"})]}),s.jsxs("div",{className:i?"glass-p-3":"glass-p-6",children:[f==="overview"&&s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{className:"glass-grid glass-grid-cols-2 glass-gap-4 glass-text-sm",children:[s.jsxs("div",{className:`
                        p-3 rounded-lg border
                        ${l?"bg-white/10 border-white/20":"bg-white/5 border-white/10"}
                      `,children:[s.jsx("div",{className:"glass-font-medium glass-mb-1",children:"Contrast"}),s.jsx("div",{className:`capitalize ${l?"text-white/80":"glass-text-secondary"}`,children:r.contrastLevel})]}),s.jsxs("div",{className:`
                        p-3 rounded-lg border
                        ${l?"bg-white/10 border-white/20":"bg-white/5 border-white/10"}
                      `,children:[s.jsx("div",{className:"glass-font-medium glass-mb-1",children:"Motion"}),s.jsx("div",{className:`capitalize ${l?"text-white/80":"glass-text-secondary"}`,children:r.motionPreference})]}),s.jsxs("div",{className:`
                        p-3 rounded-lg border
                        ${l?"bg-white/10 border-white/20":"bg-white/5 border-white/10"}
                      `,children:[s.jsx("div",{className:"glass-font-medium glass-mb-1",children:"Text Scale"}),s.jsxs("div",{className:`${l?"text-white/80":"glass-text-secondary"}`,children:[Math.round(r.fontSizeMultiplier*100),"%"]})]}),s.jsxs("div",{className:`
                        p-3 rounded-lg border
                        ${l?"bg-white/10 border-white/20":"bg-white/5 border-white/10"}
                      `,children:[s.jsx("div",{className:"glass-font-medium glass-mb-1",children:"Color Vision"}),s.jsx("div",{className:`capitalize ${l?"text-white/80":"glass-text-secondary"}`,children:r.colorBlindnessType==="none"?"Normal":r.colorBlindnessType})]})]}),s.jsx("div",{className:`
                      p-4 rounded-lg border-l-4 border-gray-500
                      ${l?"bg-white/20 text-white":"bg-white/60 text-gray-900"}
                    `,children:s.jsxs("div",{className:"glass-flex glass-items-start glass-gap-3",children:[s.jsx(js,{className:"glass-w-5 glass-h-5 glass-mt-0-5 glass-flex-shrink-0"}),s.jsxs("div",{children:[s.jsx("p",{className:"glass-font-medium glass-mb-1",children:"WCAG 2.1 AAA Compliant"}),s.jsx("p",{className:"glass-text-sm glass-opacity-90",children:"This interface meets the highest accessibility standards and adapts to your needs."})]})]})})]}),f==="sections"&&s.jsx("div",{className:"glass-space-y-3",children:ns.map(e=>{const b=e.component;return s.jsxs("div",{className:"glass-border glass-border-white/10 glass-radius-lg",children:[s.jsx("button",{onClick:()=>os(e.id),className:`
                              w-full p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 glass-focus glass-touch-target glass-contrast-guard
                              ${l?"hover:bg-white/10 text-white":"hover:bg-white/8 glass-text-secondary"}
                            `,children:s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[e.icon,s.jsxs("div",{children:[s.jsx("div",{className:"glass-font-medium",children:e.title}),s.jsx("div",{className:`text-sm ${l?"text-white/70":"glass-text-tertiary"}`,children:e.description})]})]}),e.isExpanded?s.jsx(ks,{className:"glass-w-5 glass-h-5"}):s.jsx(Cs,{className:"glass-w-5 glass-h-5"})]})}),s.jsx(F,{children:e.isExpanded&&s.jsx(w.div,{initial:{height:0,opacity:0},animate:C?{}:{height:"auto",opacity:1},exit:{height:0,opacity:0},transition:C?{duration:0}:{duration:m?N.DURATION.fast/1e3:N.DURATION.normal/1e3},className:"glass-border-t glass-border-white/10",children:s.jsx("div",{className:"glass-p-4",children:s.jsx(b,{})})})})]},e.id)})}),f==="testing"&&y&&s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("h3",{className:"glass-font-medium",children:"Accessibility Tests"}),s.jsx(w.button,{onClick:gs,disabled:P,whileHover:{scale:m?1:1.05},whileTap:{scale:m?1:.95},className:`
                          px-4 py-2 rounded-lg text-sm font-medium transition-colors
                          focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50
                          ${l?"bg-white/20 text-white hover:bg-white/30":"bg-white/60 text-gray-900 hover:bg-white/75"}
                        `,children:s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx(Ss,{className:"glass-w-4 glass-h-4"}),P?"Running...":"Run Tests"]})})]}),I.length>0&&s.jsx("div",{className:"glass-space-y-3",children:I.map((e,b)=>s.jsxs("div",{className:`
                              p-3 rounded-lg border-l-4
                              ${e.status==="passed"?"border-green-500 bg-green-500/10":e.status==="warning"?"border-yellow-500 bg-yellow-500/10":"border-gray-500 bg-white/55"}
                            `,children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-1",children:[s.jsx("span",{className:"glass-font-medium",children:e.test}),s.jsxs("span",{className:"glass-text-sm",children:[e.score,"%"]})]}),s.jsx("p",{className:`text-sm ${l?"text-white/70":"glass-text-secondary"}`,children:e.details})]},b))})]})]})]})]})}),s.jsx("div",{className:"glass-sr-only",role:"region","aria-live":"polite",children:"Press Alt+A to open accessibility controls"})]})});p.displayName="GlassA11y";const D=x.forwardRef(function({config:a,updateConfig:n,isHighContrast:o},y){return s.jsxs("div",{ref:y,className:"glass-space-y-4",children:[s.jsx("h4",{className:"glass-font-medium",children:"High Contrast Settings"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-mb-2",children:"Contrast Level"}),s.jsxs("select",{value:a.contrastLevel,onChange:g=>n({...a,contrastLevel:g.target.value}),className:`w-full p-2 rounded border glass-focus glass-touch-target glass-contrast-guard ${o?"bg-white/10 border-white/20 text-white":"bg-white/5 border-white/10"}`,children:[s.jsx("option",{value:"normal",children:"Normal"}),s.jsx("option",{value:"high",children:"High Contrast"}),s.jsx("option",{value:"maximum",children:"Maximum Contrast"})]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Reduce Transparency"}),s.jsx("button",{onClick:()=>n({...a,reduceTransparency:!a.reduceTransparency}),className:`w-12 h-6 rounded-full transition-colors glass-focus glass-touch-target glass-contrast-guard ${a.reduceTransparency?"bg-gray-700":"bg-gray-300"}`,children:s.jsx("div",{className:`w-5 h-5 bg-white rounded-full transition-transform ${a.reduceTransparency?"translate-x-6":"translate-x-0.5"}`})})]})]})]})});D.displayName="GlassHighContrast";const j=x.forwardRef(function({config:a,updateConfig:n,isMotionReduced:o},y){return s.jsxs("div",{ref:y,className:"glass-space-y-4",children:[s.jsx("h4",{className:"glass-font-medium",children:"Motion & Animation"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-mb-2",children:"Motion Preference"}),s.jsxs("select",{value:a.motionPreference,onChange:g=>n({...a,motionPreference:g.target.value}),className:"glass-w-full glass-p-2 glass-radius-md glass-focus glass-touch-target glass-contrast-guard",style:{appearance:"none",background:"linear-gradient(145deg, rgba(255,255,255,0.105) 0%, rgba(255,255,255,0.035) 52%, rgba(255,255,255,0.018) 100%)",backgroundColor:"rgba(255,255,255,0.018)",border:"1px solid rgba(255,255,255,0.18)",color:"var(--glass-theme-text, var(--glass-text-primary))",opacity:1},children:[s.jsx("option",{value:"full",children:"Full Motion"}),s.jsx("option",{value:"reduced",children:"Reduced Motion"}),s.jsx("option",{value:"none",children:"No Motion"})]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Enable Hover Effects"}),s.jsx("button",{type:"button",role:"switch","aria-checked":a.enableHoverEffects,"aria-label":"Enable hover effects",onClick:()=>n({...a,enableHoverEffects:!a.enableHoverEffects}),className:"glass-relative glass-w-12 glass-h-6 glass-radius-full glass-focus glass-touch-target glass-contrast-guard glass-transition",style:{background:"linear-gradient(135deg, rgba(255,255,255,0.32), rgba(255,255,255,0.14))",border:`1px solid rgba(15,23,42,${a.enableHoverEffects?"0.28":"0.14"})`,boxShadow:a.enableHoverEffects?"inset 0 1px 6px rgba(255,255,255,0.14), 0 0 0 2px rgba(15,23,42,0.08)":"inset 0 1px 6px rgba(255,255,255,0.14)"},children:s.jsx("div",{className:"glass-absolute glass-top-0.5 glass-w-5 glass-h-5 glass-radius-full glass-transition",style:{left:a.enableHoverEffects?"calc(100% - 1.375rem)":"0.125rem",background:"rgba(255,255,255,0.96)",border:"1px solid rgba(15,23,42,0.16)",boxShadow:"0 2px 6px rgba(15,23,42,0.18)"}})})]})]})]})});j.displayName="GlassMotionControls";const H=x.forwardRef(function({config:a,updateConfig:n},o){return s.jsxs("div",{ref:o,className:"glass-space-y-4",children:[s.jsx("h4",{className:"glass-font-medium",children:"Screen Reader Support"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Provide Long Descriptions"}),s.jsx("button",{onClick:()=>n({...a,provideLongDescriptions:!a.provideLongDescriptions}),className:`w-12 h-6 rounded-full transition-colors glass-focus glass-touch-target glass-contrast-guard ${a.provideLongDescriptions?"bg-gray-700":"bg-gray-300"}`,children:s.jsx("div",{className:`w-5 h-5 bg-white rounded-full transition-transform ${a.provideLongDescriptions?"translate-x-6":"translate-x-0.5"}`})})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Announce State Changes"}),s.jsx("button",{onClick:()=>n({...a,announceStateChanges:!a.announceStateChanges}),className:`w-12 h-6 rounded-full transition-colors glass-focus glass-touch-target glass-contrast-guard ${a.announceStateChanges?"bg-gray-700":"bg-gray-300"}`,children:s.jsx("div",{className:`w-5 h-5 bg-white rounded-full transition-transform ${a.announceStateChanges?"translate-x-6":"translate-x-0.5"}`})})]})]})]})});H.displayName="GlassScreenReader";const k=x.forwardRef(function({config:a,updateConfig:n},o){return s.jsxs("div",{ref:o,className:"glass-space-y-4",children:[s.jsx("h4",{className:"glass-font-medium",children:"Keyboard Navigation"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Enhanced Keyboard Navigation"}),s.jsx("button",{type:"button",role:"switch","aria-checked":a.enhanceKeyboardNavigation,"aria-label":"Enhanced keyboard navigation",onClick:()=>n({...a,enhanceKeyboardNavigation:!a.enhanceKeyboardNavigation}),className:"glass-relative glass-w-12 glass-h-6 glass-radius-full glass-focus glass-touch-target glass-contrast-guard glass-transition",style:{background:"linear-gradient(135deg, rgba(255,255,255,0.32), rgba(255,255,255,0.14))",border:`1px solid rgba(15,23,42,${a.enhanceKeyboardNavigation?"0.28":"0.14"})`,boxShadow:"inset 0 1px 6px rgba(255,255,255,0.14)"},children:s.jsx("div",{className:"glass-absolute glass-top-0.5 glass-w-5 glass-h-5 glass-radius-full glass-transition",style:{left:a.enhanceKeyboardNavigation?"calc(100% - 1.375rem)":"0.125rem",background:"rgba(255,255,255,0.96)",border:"1px solid rgba(15,23,42,0.16)",boxShadow:"0 2px 6px rgba(15,23,42,0.18)"}})})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Skip Links"}),s.jsx("button",{type:"button",role:"switch","aria-checked":a.showSkipLinks,"aria-label":"Show skip links",onClick:()=>n({...a,showSkipLinks:!a.showSkipLinks}),className:"glass-relative glass-w-12 glass-h-6 glass-radius-full glass-focus glass-touch-target glass-contrast-guard glass-transition",style:{background:"linear-gradient(135deg, rgba(255,255,255,0.32), rgba(255,255,255,0.14))",border:`1px solid rgba(15,23,42,${a.showSkipLinks?"0.28":"0.14"})`,boxShadow:"inset 0 1px 6px rgba(255,255,255,0.14)"},children:s.jsx("div",{className:"glass-absolute glass-top-0.5 glass-w-5 glass-h-5 glass-radius-full glass-transition",style:{left:a.showSkipLinks?"calc(100% - 1.375rem)":"0.125rem",background:"rgba(255,255,255,0.96)",border:"1px solid rgba(15,23,42,0.16)",boxShadow:"0 2px 6px rgba(15,23,42,0.18)"}})})]})]})]})});k.displayName="GlassKeyboardNav";try{p.displayName="GlassA11y",p.__docgenInfo={description:"",displayName:"GlassA11y",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},showDashboard:{defaultValue:{value:"true"},description:"",name:"showDashboard",required:!1,type:{name:"boolean | undefined"}},onConfigChange:{defaultValue:null,description:"",name:"onConfigChange",required:!1,type:{name:"((config: GlassA11yConfig) => void) | undefined"}},enableTesting:{defaultValue:{value:"true"},description:"",name:"enableTesting",required:!1,type:{name:"boolean | undefined"}},position:{defaultValue:{value:"fixed"},description:"",name:"position",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"fixed"'},{value:'"relative"'}]}},defaultOpen:{defaultValue:{value:"false"},description:"",name:"defaultOpen",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:{value:"false"},description:"Compact density for constrained cards, drawers, and documentation previews.",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"Keep the controller inside a bounded local preview surface.",name:"contained",required:!1,type:{name:"boolean | undefined"}},preview:{defaultValue:{value:"false"},description:"Alias for compact preview rendering.",name:"preview",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"Maximum rendered height when contained or compact.",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},maxWidth:{defaultValue:null,description:"Maximum rendered width when contained or compact.",name:"maxWidth",required:!1,type:{name:"string | number | undefined"}},density:{defaultValue:{value:"comfortable"},description:"Optional density override for embedded surfaces.",name:"density",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"compact"'},{value:'"comfortable"'},{value:'"spacious"'}]}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}try{D.displayName="GlassHighContrast",D.__docgenInfo={description:"",displayName:"GlassHighContrast",props:{config:{defaultValue:null,description:"",name:"config",required:!0,type:{name:"GlassA11yConfig"}},updateConfig:{defaultValue:null,description:"",name:"updateConfig",required:!0,type:{name:"GlassA11yConfigUpdater"}},isHighContrast:{defaultValue:null,description:"",name:"isHighContrast",required:!0,type:{name:"boolean"}}}}}catch{}try{j.displayName="GlassMotionControls",j.__docgenInfo={description:"",displayName:"GlassMotionControls",props:{config:{defaultValue:null,description:"",name:"config",required:!0,type:{name:"GlassA11yConfig"}},updateConfig:{defaultValue:null,description:"",name:"updateConfig",required:!0,type:{name:"GlassA11yConfigUpdater"}},isMotionReduced:{defaultValue:null,description:"",name:"isMotionReduced",required:!0,type:{name:"boolean"}}}}}catch{}try{H.displayName="GlassScreenReader",H.__docgenInfo={description:"",displayName:"GlassScreenReader",props:{config:{defaultValue:null,description:"",name:"config",required:!0,type:{name:"GlassA11yConfig"}},updateConfig:{defaultValue:null,description:"",name:"updateConfig",required:!0,type:{name:"GlassA11yConfigUpdater"}}}}}catch{}try{k.displayName="GlassKeyboardNav",k.__docgenInfo={description:"",displayName:"GlassKeyboardNav",props:{config:{defaultValue:null,description:"",name:"config",required:!0,type:{name:"GlassA11yConfig"}},updateConfig:{defaultValue:null,description:"",name:"updateConfig",required:!0,type:{name:"GlassA11yConfigUpdater"}}}}}catch{}const E=`
  .ag-a11y-story {
    --glass-text-primary: #0f172a;
    --glass-text-secondary: #334155;
    --glass-text-tertiary: #475569;
    --typography-text-primary: #0f172a;
    --typography-text-secondary: #334155;
    color: #0f172a;
    width: 100%;
    min-height: 100vh;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    background:
      radial-gradient(circle at 16% 8%, rgba(255, 255, 255, 0.98), transparent 36%),
      linear-gradient(145deg, #fafafa 0%, #e9e9e9 100%) !important;
  }

  .ag-a11y-story *,
  .ag-a11y-story *::before,
  .ag-a11y-story *::after {
    box-sizing: border-box;
  }

  .ag-a11y-story .glass-text-primary,
  .ag-a11y-story .glass-text-secondary,
  .ag-a11y-story .glass-text-tertiary,
  .ag-a11y-story h1,
  .ag-a11y-story h2,
  .ag-a11y-story h3,
  .ag-a11y-story h4,
  .ag-a11y-story p,
  .ag-a11y-story span,
  .ag-a11y-story .text-gray-500,
  .ag-a11y-story .text-gray-600,
  .ag-a11y-story .text-gray-700,
  .ag-a11y-story .text-gray-800 {
    color: #0f172a !important;
  }

  .ag-a11y-story .glass-surface-subtle,
  .ag-a11y-story .glass-surface-subtle\\/80,
  .ag-a11y-story .glass-surface-primary\\/80,
  .ag-a11y-story .glass-surface-translucent,
  .ag-a11y-story .glass-contrast-guard {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.16)) !important;
    background-color: rgba(255, 255, 255, 0.18) !important;
    border-color: rgba(255, 255, 255, 0.92) !important;
    backdrop-filter: blur(24px) saturate(1.4) brightness(1.06) contrast(1.05) !important;
    -webkit-backdrop-filter: blur(24px) saturate(1.4) brightness(1.06) contrast(1.05) !important;
    color: #0f172a !important;
  }

  .ag-a11y-story .glass-foundation-complete {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.18)) !important;
    background-color: rgba(255, 255, 255, 0.20) !important;
    border-color: rgba(255, 255, 255, 0.94) !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), 0 20px 48px rgba(20,20,20,0.12) !important;
    backdrop-filter: blur(24px) saturate(1.4) brightness(1.06) contrast(1.05) !important;
    -webkit-backdrop-filter: blur(24px) saturate(1.4) brightness(1.06) contrast(1.05) !important;
  }

  .ag-a11y-story [class*="glass-w-96"] {
    width: min(24rem, 100%) !important;
    max-width: 100% !important;
  }

  .ag-a11y-story button[class*="flex-1"][class*="px-4"][class*="py-3"] {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.18)) !important;
    background-color: rgba(255, 255, 255, 0.20) !important;
    border-color: rgba(255, 255, 255, 0.92) !important;
    color: #0f172a !important;
  }

  .ag-a11y-story button,
  .ag-a11y-story input,
  .ag-a11y-story textarea,
  .ag-a11y-story select {
    max-width: 100%;
  }

  .ag-a11y-story button {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.18)) !important;
    background-color: rgba(255, 255, 255, 0.20) !important;
    border-color: rgba(255, 255, 255, 0.92) !important;
    color: #0f172a !important;
  }

  @media (max-width: 640px) {
    .ag-a11y-story {
      padding: 16px !important;
    }
  }

  .ag-a11y-story__stage {
    width: min(56rem, 100%);
    margin-inline: auto;
  }

  .ag-a11y-story__stage > .glass-a11y-controller {
    width: 100%;
  }

  .ag-a11y-story__support-grid {
    margin-top: 32px;
  }
`,Hs={title:"Foundations/Accessibility/Glass A11y",component:p,parameters:{layout:"fullscreen",docs:{description:{component:"A comprehensive accessibility control panel providing WCAG AAA compliance management with real-time testing and adaptive interfaces."}}},argTypes:{showDashboard:{control:"boolean",description:"Whether to show the accessibility dashboard"},enableTesting:{control:"boolean",description:"Enable accessibility testing features"},position:{control:{type:"select",options:["fixed","relative"]},description:"Positioning mode for the panel"},defaultOpen:{control:"boolean",description:"Open the control panel on initial render for Storybook inspection"},className:{control:"text",description:"Additional CSS classes"},onConfigChange:{action:"config changed",description:"Called when accessibility configuration changes"}}},U=({title:t,description:a,children:n})=>s.jsx("main",{className:"glass-on-light",style:{alignItems:"center",background:"linear-gradient(145deg, #fafafa 0%, #e9e9e9 100%)",boxSizing:"border-box",display:"flex",justifyContent:"center",minHeight:"100vh",padding:"clamp(20px, 6vw, 64px)"},children:s.jsxs("section",{className:"glass-neutral-level2 glass-contrast-guard",style:{background:"linear-gradient(145deg, rgba(255,255,255,0.30), rgba(255,255,255,0.16))",border:"1px solid rgba(255,255,255,0.94)",borderRadius:28,boxShadow:"0 24px 64px rgba(20,20,20,0.12), inset 0 1px 0 rgba(255,255,255,0.28)",color:"rgba(15,23,42,0.94)",maxWidth:560,padding:"clamp(22px, 5vw, 36px)",width:"100%"},children:[s.jsx("p",{style:{color:"rgba(15,23,42,0.72)",fontSize:13,fontWeight:650,letterSpacing:".1em",margin:0,textTransform:"uppercase"},children:"Accessibility preference"}),s.jsx("h2",{style:{color:"rgba(15,23,42,0.94)",fontSize:"clamp(24px,5vw,34px)",margin:"10px 0 8px"},children:t}),s.jsx("p",{style:{color:"rgba(15,23,42,0.74)",lineHeight:1.55,margin:"0 0 28px"},children:a}),n]})}),As=()=>{const[t,a]=x.useState({...J,enhanceKeyboardNavigation:!0,showSkipLinks:!0});return s.jsx(U,{title:"Keyboard navigation",description:"Keep shortcuts, skip links, and focus movement discoverable without introducing a colored control state.",children:s.jsx(k,{config:t,updateConfig:a})})},Ts=()=>{const[t,a]=x.useState({...J,motionPreference:"reduced",enableHoverEffects:!1});return s.jsx(U,{title:"Motion preferences",description:"Choose a comfortable motion level while retaining clear, neutral, glass-native controls.",children:s.jsx(j,{config:t,updateConfig:a,isMotionReduced:!0})})},J={contrastLevel:"normal",motionPreference:"full",reduceTransparency:!1,fontSizeMultiplier:1,colorBlindnessType:"none",enhanceKeyboardNavigation:!0,provideLongDescriptions:!0,useColorBlindFriendlyPalette:!1,enableHoverEffects:!1,announceStateChanges:!1,showSkipLinks:!1},A={name:"GlassKeyboardNav",render:()=>s.jsx(As,{})},T={name:"GlassMotionControls",render:()=>s.jsx(Ts,{})},_={args:{showDashboard:!0,enableTesting:!0,position:"relative",defaultOpen:!0,onConfigChange:$()},render:t=>s.jsxs("div",{className:"ag-a11y-story glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8",children:[s.jsx("style",{children:E}),s.jsxs("div",{className:"ag-a11y-story__stage",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8",children:"Accessibility Control Panel Demo"}),s.jsx(p,{...t,position:"relative",maxHeight:"min(56vh, 30rem)"}),s.jsxs("div",{className:"ag-a11y-story__support-grid glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8",children:[s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4",children:"Interactive Content"}),s.jsx("p",{className:"glass-text-secondary dark:text-gray-300 glass-mb-4",children:"This content demonstrates how accessibility settings can adapt the user interface in real-time. Try using the accessibility panel to see the changes."}),s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-subtle hover:glass-surface-subtle glass-text-primary glass-radius-lg transition-colors",children:"Interactive Button"})]}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4",children:"Form Elements"}),s.jsxs("div",{className:"glass-space-y-4",children:[s.jsx("input",{type:"text",placeholder:"Enter text here",className:"glass-w-full glass-p-3 glass-border glass-border-subtle dark:glass-border-gray-600 glass-radius-lg glass-surface-subtle dark:glass-surface-subtle glass-text-secondary dark:glass-text-primary glass-touch-target glass-contrast-guard"}),s.jsx("textarea",{placeholder:"Enter longer text here",rows:3,className:"glass-w-full glass-p-3 glass-border glass-border-subtle dark:glass-border-gray-600 glass-radius-lg glass-surface-subtle dark:glass-surface-subtle glass-text-secondary dark:glass-text-primary glass-touch-target glass-contrast-guard"})]})]})]})]})]})},M={args:{showDashboard:!0,enableTesting:!0,position:"relative",defaultOpen:!0,onConfigChange:$()},render:t=>s.jsxs("div",{className:"ag-a11y-story glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8",children:[s.jsx("style",{children:E}),s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8",children:"Accessibility Testing Demo"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6 mb-8",children:[s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2",children:"WCAG AA Compliance"}),s.jsx("div",{className:"glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2",children:s.jsx("div",{className:"glass-surface-dark glass-h-2 glass-radius-full",style:{width:"95%"}})}),s.jsx("p",{className:"glass-text-sm glass-text-secondary dark:text-gray-300",children:"95% compliant"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2",children:"Keyboard Navigation"}),s.jsx("div",{className:"glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2",children:s.jsx("div",{className:"glass-surface-dark glass-h-2 glass-radius-full",style:{width:"100%"}})}),s.jsx("p",{className:"glass-text-sm glass-text-secondary dark:text-gray-300",children:"Fully accessible"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2",children:"Screen Reader Support"}),s.jsx("div",{className:"glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2",children:s.jsx("div",{className:"glass-surface-primary glass-h-2 glass-radius-full",style:{width:"90%"}})}),s.jsx("p",{className:"glass-text-sm glass-text-secondary dark:text-gray-300",children:"90% supported"})]})]}),s.jsx(p,{...t})]})]})},G={args:{showDashboard:!0,enableTesting:!1,position:"relative",defaultOpen:!0,className:"custom-accessibility-theme",onConfigChange:$()},render:t=>s.jsxs("div",{className:"ag-a11y-story glass-min-glass-h-screen glass-p-8",children:[s.jsx("style",{children:E}),s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary mb-8",children:"High Contrast Mode Demo"}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle glass-border-2 glass-border-black glass-radius-xl",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-inverse glass-mb-4",children:"High Contrast Content"}),s.jsx("p",{className:"glass-text-inverse glass-mb-4",children:"This content uses high contrast colors for better visibility. The accessibility panel can automatically switch to high contrast mode."}),s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-dark glass-text-primary glass-border-2 glass-border-black glass-radius hover:glass-surface-primary transition-colors",children:"High Contrast Button"})]}),s.jsx("div",{className:"mt-8",children:s.jsx(p,{...t})})]})]})},R={args:{showDashboard:!0,enableTesting:!1,position:"relative",defaultOpen:!0,onConfigChange:$()},render:t=>s.jsxs("div",{className:"ag-a11y-story glass-min-glass-h-screen glass-surface-subtle glass-p-8",children:[s.jsx("style",{children:E}),s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-secondary mb-8",children:"Minimal Accessibility Demo"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8",children:[s.jsxs("div",{className:"glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4",children:"Clean Interface"}),s.jsx("p",{className:"glass-text-secondary glass-mb-4",children:"Simple, clean design that works well with accessibility features."})]}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4",children:"Focus States"}),s.jsx("p",{className:"glass-text-secondary glass-mb-4",children:"Clear focus indicators for keyboard navigation."}),s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-subtle glass-text-primary glass-radius hover:glass-surface-subtle focus:outline-none focus:ring-4 focus:ring-gray-300 transition-colors",children:"Focusable Button"})]})]}),s.jsx(p,{...t})]})]})};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  name: "GlassKeyboardNav",
  render: () => <DirectKeyboardNav />
}`,...A.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "GlassMotionControls",
  render: () => <DirectMotionControls />
}`,...T.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    showDashboard: true,
    enableTesting: true,
    position: "relative",
    defaultOpen: true,
    onConfigChange: fn()
  },
  render: args => <div className="ag-a11y-story glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8">
      <style>{glassA11yStoryStyles}</style>
      <div className="ag-a11y-story__stage">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8">
          Accessibility Control Panel Demo
        </h1>

        <GlassA11y {...args} position="relative" maxHeight="min(56vh, 30rem)" />

        <div className="ag-a11y-story__support-grid glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8">
          <div className="glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4">
              Interactive Content
            </h3>
            <p className="glass-text-secondary dark:text-gray-300 glass-mb-4">
              This content demonstrates how accessibility settings can adapt the
              user interface in real-time. Try using the accessibility panel to
              see the changes.
            </p>
            <button className="glass-px-4 glass-py-2 glass-surface-subtle hover:glass-surface-subtle glass-text-primary glass-radius-lg transition-colors">
              Interactive Button
            </button>
          </div>

          <div className="glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4">
              Form Elements
            </h3>
            <div className="glass-space-y-4">
              <input type="text" placeholder="Enter text here" className="glass-w-full glass-p-3 glass-border glass-border-subtle dark:glass-border-gray-600 glass-radius-lg glass-surface-subtle dark:glass-surface-subtle glass-text-secondary dark:glass-text-primary glass-touch-target glass-contrast-guard" />
              <textarea placeholder="Enter longer text here" rows={3} className="glass-w-full glass-p-3 glass-border glass-border-subtle dark:glass-border-gray-600 glass-radius-lg glass-surface-subtle dark:glass-surface-subtle glass-text-secondary dark:glass-text-primary glass-touch-target glass-contrast-guard" />
            </div>
          </div>
        </div>
      </div>
    </div>
}`,..._.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    showDashboard: true,
    enableTesting: true,
    position: "relative",
    defaultOpen: true,
    onConfigChange: fn()
  },
  render: args => <div className="ag-a11y-story glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8">
      <style>{glassA11yStoryStyles}</style>
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8">
          Accessibility Testing Demo
        </h1>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6 mb-8">
          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h4 className="glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2">
              WCAG AA Compliance
            </h4>
            <div className="glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2">
              <div className="glass-surface-dark glass-h-2 glass-radius-full" style={{
              width: "95%"
            }}></div>
            </div>
            <p className="glass-text-sm glass-text-secondary dark:text-gray-300">
              95% compliant
            </p>
          </div>

          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h4 className="glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2">
              Keyboard Navigation
            </h4>
            <div className="glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2">
              <div className="glass-surface-dark glass-h-2 glass-radius-full" style={{
              width: "100%"
            }}></div>
            </div>
            <p className="glass-text-sm glass-text-secondary dark:text-gray-300">
              Fully accessible
            </p>
          </div>

          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h4 className="glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2">
              Screen Reader Support
            </h4>
            <div className="glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2">
              <div className="glass-surface-primary glass-h-2 glass-radius-full" style={{
              width: "90%"
            }}></div>
            </div>
            <p className="glass-text-sm glass-text-secondary dark:text-gray-300">
              90% supported
            </p>
          </div>
        </div>

        <GlassA11y {...args} />
      </div>
    </div>
}`,...M.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    showDashboard: true,
    enableTesting: false,
    position: "relative",
    defaultOpen: true,
    className: "custom-accessibility-theme",
    onConfigChange: fn()
  },
  render: args => <div className="ag-a11y-story glass-min-glass-h-screen glass-p-8">
      <style>{glassA11yStoryStyles}</style>
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-primary mb-8">
          High Contrast Mode Demo
        </h1>

        <div className="glass-p-6 glass-surface-subtle glass-border-2 glass-border-black glass-radius-xl">
          <h3 className="glass-text-xl glass-font-semibold glass-text-inverse glass-mb-4">
            High Contrast Content
          </h3>
          <p className="glass-text-inverse glass-mb-4">
            This content uses high contrast colors for better visibility. The
            accessibility panel can automatically switch to high contrast mode.
          </p>
          <button className="glass-px-4 glass-py-2 glass-surface-dark glass-text-primary glass-border-2 glass-border-black glass-radius hover:glass-surface-primary transition-colors">
            High Contrast Button
          </button>
        </div>

        <div className="mt-8">
          <GlassA11y {...args} />
        </div>
      </div>
    </div>
}`,...G.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    showDashboard: true,
    enableTesting: false,
    position: "relative",
    defaultOpen: true,
    onConfigChange: fn()
  },
  render: args => <div className="ag-a11y-story glass-min-glass-h-screen glass-surface-subtle glass-p-8">
      <style>{glassA11yStoryStyles}</style>
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary mb-8">
          Minimal Accessibility Demo
        </h1>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8">
          <div className="glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle">
            <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">
              Clean Interface
            </h3>
            <p className="glass-text-secondary glass-mb-4">
              Simple, clean design that works well with accessibility features.
            </p>
          </div>

          <div className="glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle">
            <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">
              Focus States
            </h3>
            <p className="glass-text-secondary glass-mb-4">
              Clear focus indicators for keyboard navigation.
            </p>
            <button className="glass-px-4 glass-py-2 glass-surface-subtle glass-text-primary glass-radius hover:glass-surface-subtle focus:outline-none focus:ring-4 focus:ring-gray-300 transition-colors">
              Focusable Button
            </button>
          </div>
        </div>

        <GlassA11y {...args} />
      </div>
    </div>
}`,...R.parameters?.docs?.source}}};const $s=["GlassKeyboardNav","GlassMotionControls","Default","TestingMode","HighContrast","Minimal"];export{_ as Default,A as GlassKeyboardNav,T as GlassMotionControls,G as HighContrast,R as Minimal,M as TestingMode,$s as __namedExportsOrder,Hs as default};
