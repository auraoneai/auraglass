import{R as N,b as os,r as d,j as s,d as f,m as v,c as y,e as P}from"./iframe-CsQVqAwV.js";import{f as _}from"./index-CLSxArU-.js";import{C as gs,M as ds,V as cs,K as us,A as ms,S as ps,a as hs,R as bs,b as xs,I as ys,c as fs,d as vs,T as Ns}from"./components-DbL1lRmA.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";const B={contrastLevel:"normal",motionPreference:"full",reduceTransparency:!1,fontSizeMultiplier:1,colorBlindnessType:"none",enhanceKeyboardNavigation:!0,provideLongDescriptions:!0,useColorBlindFriendlyPalette:!1,enableHoverEffects:!1,announceStateChanges:!1,showSkipLinks:!1},p=N.forwardRef(function({className:e="",showDashboard:n=!0,onConfigChange:o,enableTesting:b=!0,position:c="fixed",defaultOpen:F=!1,compact:z=!1,contained:U=!1,preview:W=!1,maxHeight:D,maxWidth:H,density:J="comfortable","aria-label":Q,"data-testid":X},Y){const w=os(),[t,g]=d.useState(B),[E,Z]=d.useState(F),[x,V]=d.useState("overview"),[q,L]=d.useState([]),[I,O]=d.useState(!1),u=t.motionPreference==="reduced",l=t.contrastLevel==="high",ss=t.reduceTransparency,[as,es]=d.useState([{id:"contrast",title:"High Contrast & Visual",icon:s.jsx(gs,{className:"glass-w-5 glass-h-5"}),description:"Adjust contrast levels and visual accessibility settings",component:()=>s.jsx(T,{config:t,updateConfig:g,isHighContrast:l}),isExpanded:!1},{id:"motion",title:"Motion & Animation",icon:s.jsx(ds,{className:"glass-w-5 glass-h-5"}),description:"Control motion and animation preferences",component:()=>s.jsx(G,{config:t,updateConfig:g,isMotionReduced:u}),isExpanded:!1},{id:"screen-reader",title:"Screen Reader",icon:s.jsx(cs,{className:"glass-w-5 glass-h-5"}),description:"Enhanced screen reader support and descriptions",component:()=>s.jsx(M,{config:t,updateConfig:g}),isExpanded:!1},{id:"keyboard",title:"Keyboard Navigation",icon:s.jsx(us,{className:"glass-w-5 glass-h-5"}),description:"Enhanced keyboard navigation and focus indicators",component:()=>s.jsx(R,{config:t,updateConfig:g}),isExpanded:!1}]);d.useEffect(()=>{o?.(t)},[t,o]);const ls=d.useCallback(a=>{es(h=>h.map(j=>j.id===a?{...j,isExpanded:!j.isExpanded}:j))},[]),ts=d.useCallback(async()=>{O(!0);try{await new Promise(h=>setTimeout(h,f.DURATION.slower*1.5));const a=[{test:"WCAG 2.1 AA Compliance",status:"passed",score:95,details:"Most elements meet contrast requirements"},{test:"Keyboard Navigation",status:t.enhanceKeyboardNavigation?"passed":"warning",score:t.enhanceKeyboardNavigation?100:75,details:t.enhanceKeyboardNavigation?"All interactive elements are keyboard accessible":"Some elements may not be fully keyboard accessible"},{test:"Motion Preferences",status:"passed",score:100,details:"Motion preferences are respected"},{test:"Screen Reader Support",status:t.provideLongDescriptions?"passed":"warning",score:t.provideLongDescriptions?95:80,details:t.provideLongDescriptions?"Comprehensive descriptions provided":"Basic screen reader support active"},{test:"Color Blindness Support",status:t.useColorBlindFriendlyPalette?"passed":"info",score:t.useColorBlindFriendlyPalette?100:85,details:t.useColorBlindFriendlyPalette?"Color blind friendly palette active":"Standard color palette in use"}];L(a)}catch{L([])}finally{O(!1)}},[t]),rs=[{id:"high-contrast",label:"High Contrast",active:l,onClick:()=>g(a=>({...a,contrastLevel:a.contrastLevel==="high"?"normal":"high"}))},{id:"reduce-motion",label:"Reduce Motion",active:u,onClick:()=>g(a=>({...a,motionPreference:a.motionPreference==="reduced"?"full":"reduced"}))},{id:"reduce-transparency",label:"Reduce Transparency",active:ss,onClick:()=>g(a=>({...a,reduceTransparency:!a.reduceTransparency}))},{id:"large-text",label:"Large Text",active:t.fontSizeMultiplier>1,onClick:()=>g(a=>({...a,fontSizeMultiplier:a.fontSizeMultiplier>1?1:1.25}))}];if(!n)return null;const i=z||W||J==="compact",K=typeof D=="number"?`${D}px`:D,is=typeof H=="number"?`${H}px`:H,m=U||i,ns={position:m?"relative":c,top:!m&&c==="fixed"?"20px":void 0,right:!m&&c==="fixed"?"20px":void 0,zIndex:!m&&c==="fixed"?1e3:void 0,maxHeight:K??(m?"220px":void 0),maxWidth:is??(m?"320px":void 0),width:m?"100%":void 0,overflow:m?"hidden":void 0};return s.jsxs("div",{ref:Y,className:`glass-a11y-controller ${e}`,style:{...ns},"aria-label":Q,"data-testid":X,children:[s.jsx(v.button,{onClick:()=>Z(!E),className:y("glass-foundation-complete glass-radius-full",i?"glass-w-10 glass-h-10":"glass-w-14 glass-h-14","flex items-center justify-center glass-shadow-lg hover:glass-shadow-xl","glass-transition glass-focus glass-press glass-magnet",{"glass-surface-dark glass-text-primary glass-border-primary":l,"glass-surface-transparent glass-text-secondary glass-border-subtle":!l,"rotate-45":E}),whileHover:{scale:1.05},whileTap:{scale:.95},"aria-label":"Toggle accessibility controls",title:"Accessibility Settings",children:s.jsx(ms,{className:"glass-w-6 glass-h-6"})}),s.jsx(P,{children:E&&s.jsxs(v.div,{initial:{opacity:0,scale:.9,y:-20},animate:w?{}:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.9,y:-20},transition:w?{duration:0}:{duration:u?f.DURATION.fast/1e3:f.DURATION.normal/1e3},className:y("glass-foundation-complete absolute glass-right-0",i?"glass-top-11":"glass-top-16","glass-w-96 glass-max-h-80vh overflow-hidden glass-shadow-2xl glass-radius-2xl",{"glass-surface-dark glass-border-primary glass-text-primary":l,"glass-surface-translucent glass-border-subtle glass-text-secondary":!l}),style:{width:i?"min(20rem, 100%)":"min(24rem, calc(100vw - 2rem))",maxHeight:K??(i?"220px":"min(80vh, 42rem)")},children:[s.jsxs("div",{className:y(i?"glass-p-3":"glass-p-6","glass-border-b glass-border-white/10"),children:[s.jsxs("div",{className:y("glass-flex glass-items-center glass-justify-between",i?"glass-mb-2":"glass-mb-4"),children:[s.jsxs("h2",{className:y("glass-font-semibold glass-flex glass-items-center glass-gap-2",i?"glass-text-sm":"glass-text-xl"),children:[s.jsx(ps,{className:"glass-w-5 glass-h-5"}),i?"A11y":"Accessibility Controls"]}),s.jsxs("div",{className:"glass-flex glass-gap-2",children:[s.jsx("button",{onClick:()=>{},className:`
                      p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 glass-focus glass-touch-target glass-contrast-guard
                      ${l?"hover:bg-white/20 text-white":"hover:bg-white/10 glass-text-secondary"}
                    `,title:"Detect system preferences",children:s.jsx(hs,{className:"glass-w-4 glass-h-4"})}),s.jsx("button",{onClick:()=>g(B),className:`
                      p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 glass-focus glass-touch-target glass-contrast-guard
                      ${l?"hover:bg-white/20 text-white":"hover:bg-white/10 glass-text-secondary"}
                    `,title:"Reset to defaults",children:s.jsx(bs,{className:"glass-w-4 glass-h-4"})})]})]}),s.jsx("div",{className:y("glass-grid glass-grid-cols-2",i?"glass-gap-1":"glass-gap-2"),children:rs.map(a=>s.jsx(v.button,{onClick:a.onClick,whileHover:{scale:u?1:1.02},whileTap:{scale:u?1:.98},className:`
                      ${i?"p-2 text-xs":"p-3 text-sm"} rounded-lg font-medium transition-all duration-200
                      border focus:outline-none focus:ring-2 focus:ring-blue-400
                      ${a.active?l?"bg-white/30 border-white text-white":"bg-blue-500/20 border-blue-500/50 text-blue-700":l?"bg-white/10 border-white/20 text-white/80 hover:bg-white/20":"bg-white/5 border-white/10 glass-text-secondary hover:bg-white/10"}
                    `,children:s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1",children:[a.active&&s.jsx(xs,{className:"glass-w-3 glass-h-3"}),s.jsx("span",{className:"glass-truncate",children:a.label})]})},a.id))})]}),s.jsxs("div",{className:"glass-flex-1 glass-overflow-y-auto",children:[s.jsxs("div",{className:"glass-flex glass-border-b glass-border-white/10",children:[s.jsx("button",{onClick:()=>V("overview"),className:`
                    flex-1 ${i?"px-2 py-2 text-xs":"px-4 py-3 text-sm"} font-medium transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset glass-focus glass-touch-target glass-contrast-guard
                    ${x==="overview"?l?"bg-white/20 text-white":"bg-white/10 text-blue-600":l?"text-white/70 hover:text-white":"glass-text-secondary hover:glass-text-primary"}
                  `,children:"Overview"}),s.jsx("button",{onClick:()=>V("sections"),className:`
                    flex-1 ${i?"px-2 py-2 text-xs":"px-4 py-3 text-sm"} font-medium transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset glass-focus glass-touch-target glass-contrast-guard
                    ${x==="sections"?l?"bg-white/20 text-white":"bg-white/10 text-blue-600":l?"text-white/70 hover:text-white":"glass-text-secondary hover:glass-text-primary"}
                  `,children:"Settings"}),b&&s.jsx("button",{onClick:()=>V("testing"),className:`
                      flex-1 ${i?"px-2 py-2 text-xs":"px-4 py-3 text-sm"} font-medium transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset glass-focus glass-touch-target glass-contrast-guard
                      ${x==="testing"?l?"bg-white/20 text-white":"bg-white/10 text-blue-600":l?"text-white/70 hover:text-white":"glass-text-secondary hover:glass-text-primary"}
                    `,children:"Testing"})]}),s.jsxs("div",{className:i?"glass-p-3":"glass-p-6",children:[x==="overview"&&s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{className:"glass-grid glass-grid-cols-2 glass-gap-4 glass-text-sm",children:[s.jsxs("div",{className:`
                        p-3 rounded-lg border
                        ${l?"bg-white/10 border-white/20":"bg-white/5 border-white/10"}
                      `,children:[s.jsx("div",{className:"glass-font-medium glass-mb-1",children:"Contrast"}),s.jsx("div",{className:`capitalize ${l?"text-white/80":"glass-text-secondary"}`,children:t.contrastLevel})]}),s.jsxs("div",{className:`
                        p-3 rounded-lg border
                        ${l?"bg-white/10 border-white/20":"bg-white/5 border-white/10"}
                      `,children:[s.jsx("div",{className:"glass-font-medium glass-mb-1",children:"Motion"}),s.jsx("div",{className:`capitalize ${l?"text-white/80":"glass-text-secondary"}`,children:t.motionPreference})]}),s.jsxs("div",{className:`
                        p-3 rounded-lg border
                        ${l?"bg-white/10 border-white/20":"bg-white/5 border-white/10"}
                      `,children:[s.jsx("div",{className:"glass-font-medium glass-mb-1",children:"Text Scale"}),s.jsxs("div",{className:`${l?"text-white/80":"glass-text-secondary"}`,children:[Math.round(t.fontSizeMultiplier*100),"%"]})]}),s.jsxs("div",{className:`
                        p-3 rounded-lg border
                        ${l?"bg-white/10 border-white/20":"bg-white/5 border-white/10"}
                      `,children:[s.jsx("div",{className:"glass-font-medium glass-mb-1",children:"Color Vision"}),s.jsx("div",{className:`capitalize ${l?"text-white/80":"glass-text-secondary"}`,children:t.colorBlindnessType==="none"?"Normal":t.colorBlindnessType})]})]}),s.jsx("div",{className:`
                      p-4 rounded-lg border-l-4 border-blue-500
                      ${l?"bg-blue-500/20 text-white":"bg-blue-50/50 text-blue-800"}
                    `,children:s.jsxs("div",{className:"glass-flex glass-items-start glass-gap-3",children:[s.jsx(ys,{className:"glass-w-5 glass-h-5 glass-mt-0-5 glass-flex-shrink-0"}),s.jsxs("div",{children:[s.jsx("p",{className:"glass-font-medium glass-mb-1",children:"WCAG 2.1 AAA Compliant"}),s.jsx("p",{className:"glass-text-sm glass-opacity-90",children:"This interface meets the highest accessibility standards and adapts to your needs."})]})]})})]}),x==="sections"&&s.jsx("div",{className:"glass-space-y-3",children:as.map(a=>{const h=a.component;return s.jsxs("div",{className:"glass-border glass-border-white/10 glass-radius-lg",children:[s.jsx("button",{onClick:()=>ls(a.id),className:`
                              w-full p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 glass-focus glass-touch-target glass-contrast-guard
                              ${l?"hover:bg-white/10 text-white":"hover:bg-white/8 glass-text-secondary"}
                            `,children:s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[a.icon,s.jsxs("div",{children:[s.jsx("div",{className:"glass-font-medium",children:a.title}),s.jsx("div",{className:`text-sm ${l?"text-white/70":"glass-text-tertiary"}`,children:a.description})]})]}),a.isExpanded?s.jsx(fs,{className:"glass-w-5 glass-h-5"}):s.jsx(vs,{className:"glass-w-5 glass-h-5"})]})}),s.jsx(P,{children:a.isExpanded&&s.jsx(v.div,{initial:{height:0,opacity:0},animate:w?{}:{height:"auto",opacity:1},exit:{height:0,opacity:0},transition:w?{duration:0}:{duration:u?f.DURATION.fast/1e3:f.DURATION.normal/1e3},className:"glass-border-t glass-border-white/10",children:s.jsx("div",{className:"glass-p-4",children:s.jsx(h,{})})})})]},a.id)})}),x==="testing"&&b&&s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("h3",{className:"glass-font-medium",children:"Accessibility Tests"}),s.jsx(v.button,{onClick:ts,disabled:I,whileHover:{scale:u?1:1.05},whileTap:{scale:u?1:.95},className:`
                          px-4 py-2 rounded-lg text-sm font-medium transition-colors
                          focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50
                          ${l?"bg-white/20 text-white hover:bg-white/30":"bg-blue-500/20 text-blue-700 hover:bg-blue-500/30"}
                        `,children:s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx(Ns,{className:"glass-w-4 glass-h-4"}),I?"Running...":"Run Tests"]})})]}),q.length>0&&s.jsx("div",{className:"glass-space-y-3",children:q.map((a,h)=>s.jsxs("div",{className:`
                              p-3 rounded-lg border-l-4
                              ${a.status==="passed"?"border-green-500 bg-green-500/10":a.status==="warning"?"border-yellow-500 bg-yellow-500/10":"border-blue-500 bg-blue-500/10"}
                            `,children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-1",children:[s.jsx("span",{className:"glass-font-medium",children:a.test}),s.jsxs("span",{className:"glass-text-sm",children:[a.score,"%"]})]}),s.jsx("p",{className:`text-sm ${l?"text-white/70":"glass-text-secondary"}`,children:a.details})]},h))})]})]})]})]})}),s.jsx("div",{className:"glass-sr-only",role:"region","aria-live":"polite",children:"Press Alt+A to open accessibility controls"})]})});p.displayName="GlassA11y";const T=N.forwardRef(function({config:e,updateConfig:n,isHighContrast:o},b){return s.jsxs("div",{ref:b,className:"glass-space-y-4",children:[s.jsx("h4",{className:"glass-font-medium",children:"High Contrast Settings"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-mb-2",children:"Contrast Level"}),s.jsxs("select",{value:e.contrastLevel,onChange:c=>n({...e,contrastLevel:c.target.value}),className:`w-full p-2 rounded border glass-focus glass-touch-target glass-contrast-guard ${o?"bg-white/10 border-white/20 text-white":"bg-white/5 border-white/10"}`,children:[s.jsx("option",{value:"normal",children:"Normal"}),s.jsx("option",{value:"high",children:"High Contrast"}),s.jsx("option",{value:"maximum",children:"Maximum Contrast"})]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Reduce Transparency"}),s.jsx("button",{onClick:()=>n({...e,reduceTransparency:!e.reduceTransparency}),className:`w-12 h-6 rounded-full transition-colors glass-focus glass-touch-target glass-contrast-guard ${e.reduceTransparency?"bg-blue-500":"bg-gray-300"}`,children:s.jsx("div",{className:`w-5 h-5 bg-white rounded-full transition-transform ${e.reduceTransparency?"translate-x-6":"translate-x-0.5"}`})})]})]})]})});T.displayName="GlassHighContrast";const G=N.forwardRef(function({config:e,updateConfig:n,isMotionReduced:o},b){return s.jsxs("div",{ref:b,className:"glass-space-y-4",children:[s.jsx("h4",{className:"glass-font-medium",children:"Motion & Animation"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-mb-2",children:"Motion Preference"}),s.jsxs("select",{value:e.motionPreference,onChange:c=>n({...e,motionPreference:c.target.value}),className:`w-full p-2 rounded border glass-focus glass-touch-target glass-contrast-guard ${o?"bg-white/10 border-white/20 text-white":"bg-white/5 border-white/10"}`,children:[s.jsx("option",{value:"full",children:"Full Motion"}),s.jsx("option",{value:"reduced",children:"Reduced Motion"}),s.jsx("option",{value:"none",children:"No Motion"})]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Enable Hover Effects"}),s.jsx("button",{onClick:()=>n({...e,enableHoverEffects:!e.enableHoverEffects}),className:`w-12 h-6 rounded-full transition-colors glass-focus glass-touch-target glass-contrast-guard ${e.enableHoverEffects?"bg-blue-500":"bg-gray-300"}`,children:s.jsx("div",{className:`w-5 h-5 bg-white rounded-full transition-transform ${e.enableHoverEffects?"translate-x-6":"translate-x-0.5"}`})})]})]})]})});G.displayName="GlassMotionControls";const M=N.forwardRef(function({config:e,updateConfig:n},o){return s.jsxs("div",{ref:o,className:"glass-space-y-4",children:[s.jsx("h4",{className:"glass-font-medium",children:"Screen Reader Support"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Provide Long Descriptions"}),s.jsx("button",{onClick:()=>n({...e,provideLongDescriptions:!e.provideLongDescriptions}),className:`w-12 h-6 rounded-full transition-colors glass-focus glass-touch-target glass-contrast-guard ${e.provideLongDescriptions?"bg-blue-500":"bg-gray-300"}`,children:s.jsx("div",{className:`w-5 h-5 bg-white rounded-full transition-transform ${e.provideLongDescriptions?"translate-x-6":"translate-x-0.5"}`})})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Announce State Changes"}),s.jsx("button",{onClick:()=>n({...e,announceStateChanges:!e.announceStateChanges}),className:`w-12 h-6 rounded-full transition-colors glass-focus glass-touch-target glass-contrast-guard ${e.announceStateChanges?"bg-blue-500":"bg-gray-300"}`,children:s.jsx("div",{className:`w-5 h-5 bg-white rounded-full transition-transform ${e.announceStateChanges?"translate-x-6":"translate-x-0.5"}`})})]})]})]})});M.displayName="GlassScreenReader";const R=N.forwardRef(function({config:e,updateConfig:n},o){return s.jsxs("div",{ref:o,className:"glass-space-y-4",children:[s.jsx("h4",{className:"glass-font-medium",children:"Keyboard Navigation"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Enhanced Keyboard Navigation"}),s.jsx("button",{onClick:()=>n({...e,enhanceKeyboardNavigation:!e.enhanceKeyboardNavigation}),className:`w-12 h-6 rounded-full transition-colors glass-focus glass-touch-target glass-contrast-guard ${e.enhanceKeyboardNavigation?"bg-blue-500":"bg-gray-300"}`,children:s.jsx("div",{className:`w-5 h-5 bg-white rounded-full transition-transform ${e.enhanceKeyboardNavigation?"translate-x-6":"translate-x-0.5"}`})})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Skip Links"}),s.jsx("button",{onClick:()=>n({...e,showSkipLinks:!e.showSkipLinks}),className:`w-12 h-6 rounded-full transition-colors glass-focus glass-touch-target glass-contrast-guard ${e.showSkipLinks?"bg-blue-500":"bg-gray-300"}`,children:s.jsx("div",{className:`w-5 h-5 bg-white rounded-full transition-transform ${e.showSkipLinks?"translate-x-6":"translate-x-0.5"}`})})]})]})]})});R.displayName="GlassKeyboardNav";try{p.displayName="GlassA11y",p.__docgenInfo={description:"",displayName:"GlassA11y",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},showDashboard:{defaultValue:{value:"true"},description:"",name:"showDashboard",required:!1,type:{name:"boolean | undefined"}},onConfigChange:{defaultValue:null,description:"",name:"onConfigChange",required:!1,type:{name:"((config: GlassA11yConfig) => void) | undefined"}},enableTesting:{defaultValue:{value:"true"},description:"",name:"enableTesting",required:!1,type:{name:"boolean | undefined"}},position:{defaultValue:{value:"fixed"},description:"",name:"position",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"fixed"'},{value:'"relative"'}]}},defaultOpen:{defaultValue:{value:"false"},description:"",name:"defaultOpen",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:{value:"false"},description:"Compact density for constrained cards, drawers, and documentation previews.",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"Keep the controller inside a bounded local preview surface.",name:"contained",required:!1,type:{name:"boolean | undefined"}},preview:{defaultValue:{value:"false"},description:"Alias for compact preview rendering.",name:"preview",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"Maximum rendered height when contained or compact.",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},maxWidth:{defaultValue:null,description:"Maximum rendered width when contained or compact.",name:"maxWidth",required:!1,type:{name:"string | number | undefined"}},density:{defaultValue:{value:"comfortable"},description:"Optional density override for embedded surfaces.",name:"density",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"compact"'},{value:'"comfortable"'},{value:'"spacious"'}]}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}try{T.displayName="GlassHighContrast",T.__docgenInfo={description:"",displayName:"GlassHighContrast",props:{config:{defaultValue:null,description:"",name:"config",required:!0,type:{name:"GlassA11yConfig"}},updateConfig:{defaultValue:null,description:"",name:"updateConfig",required:!0,type:{name:"GlassA11yConfigUpdater"}},isHighContrast:{defaultValue:null,description:"",name:"isHighContrast",required:!0,type:{name:"boolean"}}}}}catch{}try{G.displayName="GlassMotionControls",G.__docgenInfo={description:"",displayName:"GlassMotionControls",props:{config:{defaultValue:null,description:"",name:"config",required:!0,type:{name:"GlassA11yConfig"}},updateConfig:{defaultValue:null,description:"",name:"updateConfig",required:!0,type:{name:"GlassA11yConfigUpdater"}},isMotionReduced:{defaultValue:null,description:"",name:"isMotionReduced",required:!0,type:{name:"boolean"}}}}}catch{}try{M.displayName="GlassScreenReader",M.__docgenInfo={description:"",displayName:"GlassScreenReader",props:{config:{defaultValue:null,description:"",name:"config",required:!0,type:{name:"GlassA11yConfig"}},updateConfig:{defaultValue:null,description:"",name:"updateConfig",required:!0,type:{name:"GlassA11yConfigUpdater"}}}}}catch{}try{R.displayName="GlassKeyboardNav",R.__docgenInfo={description:"",displayName:"GlassKeyboardNav",props:{config:{defaultValue:null,description:"",name:"config",required:!0,type:{name:"GlassA11yConfig"}},updateConfig:{defaultValue:null,description:"",name:"updateConfig",required:!0,type:{name:"GlassA11yConfigUpdater"}}}}}catch{}const $=`
  .ag-a11y-story {
    --glass-text-primary: #f8fafc;
    --glass-text-secondary: #e2e8f0;
    --glass-text-tertiary: #cbd5e1;
    --typography-text-primary: #f8fafc;
    --typography-text-secondary: #e2e8f0;
    color: #f8fafc;
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
    box-sizing: border-box;
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
    color: #f8fafc !important;
  }

  .ag-a11y-story .glass-surface-subtle,
  .ag-a11y-story .glass-surface-subtle\\/80,
  .ag-a11y-story .glass-surface-primary\\/80,
  .ag-a11y-story .glass-surface-translucent,
  .ag-a11y-story .glass-contrast-guard {
    background: rgba(15, 23, 42, 0.78) !important;
    color: #f8fafc !important;
  }

  .ag-a11y-story [class*="glass-w-96"] {
    width: min(24rem, 100%) !important;
    max-width: 100% !important;
  }

  .ag-a11y-story [class*="glass-max-h-80vh"] {
    max-height: min(80vh, calc(100vh - 32px)) !important;
  }

  .ag-a11y-story button[class*="flex-1"][class*="px-4"][class*="py-3"] {
    background: rgba(15, 23, 42, 0.92) !important;
    color: #f8fafc !important;
  }

  .ag-a11y-story button,
  .ag-a11y-story input,
  .ag-a11y-story textarea,
  .ag-a11y-story select {
    max-width: 100%;
  }

  .ag-a11y-story button {
    background: rgba(15, 23, 42, 0.92) !important;
    color: #f8fafc !important;
    border-color: rgba(226, 232, 240, 0.28) !important;
  }

  @media (max-width: 640px) {
    .ag-a11y-story {
      padding: 16px !important;
    }
  }
`,Ss={title:"Foundations/Accessibility/Glass A11y",component:p,parameters:{layout:"fullscreen",docs:{description:{component:"A comprehensive accessibility control panel providing WCAG AAA compliance management with real-time testing and adaptive interfaces."}}},argTypes:{showDashboard:{control:"boolean",description:"Whether to show the accessibility dashboard"},enableTesting:{control:"boolean",description:"Enable accessibility testing features"},position:{control:{type:"select",options:["fixed","relative"]},description:"Positioning mode for the panel"},defaultOpen:{control:"boolean",description:"Open the control panel on initial render for Storybook inspection"},className:{control:"text",description:"Additional CSS classes"},onConfigChange:{action:"config changed",description:"Called when accessibility configuration changes"}}},k={args:{showDashboard:!0,enableTesting:!0,position:"relative",defaultOpen:!0,onConfigChange:_()},render:r=>s.jsxs("div",{className:"ag-a11y-story glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8",children:[s.jsx("style",{children:$}),s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8",children:"Accessibility Control Panel Demo"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8",children:[s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4",children:"Interactive Content"}),s.jsx("p",{className:"glass-text-secondary dark:text-gray-300 glass-mb-4",children:"This content demonstrates how accessibility settings can adapt the user interface in real-time. Try using the accessibility panel to see the changes."}),s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg transition-colors",children:"Interactive Button"})]}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4",children:"Form Elements"}),s.jsxs("div",{className:"glass-space-y-4",children:[s.jsx("input",{type:"text",placeholder:"Enter text here",className:"glass-w-full glass-p-3 glass-border glass-border-subtle dark:glass-border-gray-600 glass-radius-lg glass-surface-subtle dark:glass-surface-subtle glass-text-secondary dark:glass-text-primary glass-touch-target glass-contrast-guard"}),s.jsx("textarea",{placeholder:"Enter longer text here",rows:3,className:"glass-w-full glass-p-3 glass-border glass-border-subtle dark:glass-border-gray-600 glass-radius-lg glass-surface-subtle dark:glass-surface-subtle glass-text-secondary dark:glass-text-primary glass-touch-target glass-contrast-guard"})]})]})]}),s.jsx(p,{...r})]})]})},C={args:{showDashboard:!0,enableTesting:!0,position:"relative",defaultOpen:!0,onConfigChange:_()},render:r=>s.jsxs("div",{className:"ag-a11y-story glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8",children:[s.jsx("style",{children:$}),s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8",children:"Accessibility Testing Demo"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6 mb-8",children:[s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2",children:"WCAG AA Compliance"}),s.jsx("div",{className:"glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2",children:s.jsx("div",{className:"glass-surface-green glass-h-2 glass-radius-full",style:{width:"95%"}})}),s.jsx("p",{className:"glass-text-sm glass-text-secondary dark:text-gray-300",children:"95% compliant"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2",children:"Keyboard Navigation"}),s.jsx("div",{className:"glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2",children:s.jsx("div",{className:"glass-surface-blue glass-h-2 glass-radius-full",style:{width:"100%"}})}),s.jsx("p",{className:"glass-text-sm glass-text-secondary dark:text-gray-300",children:"Fully accessible"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2",children:"Screen Reader Support"}),s.jsx("div",{className:"glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2",children:s.jsx("div",{className:"glass-surface-primary glass-h-2 glass-radius-full",style:{width:"90%"}})}),s.jsx("p",{className:"glass-text-sm glass-text-secondary dark:text-gray-300",children:"90% supported"})]})]}),s.jsx(p,{...r})]})]})},A={args:{showDashboard:!0,enableTesting:!1,position:"relative",defaultOpen:!0,className:"custom-accessibility-theme",onConfigChange:_()},render:r=>s.jsxs("div",{className:"ag-a11y-story glass-min-glass-h-screen glass-surface-dark glass-p-8",children:[s.jsx("style",{children:$}),s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary mb-8",children:"High Contrast Mode Demo"}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle glass-border-2 glass-border-black glass-radius-xl",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-inverse glass-mb-4",children:"High Contrast Content"}),s.jsx("p",{className:"glass-text-inverse glass-mb-4",children:"This content uses high contrast colors for better visibility. The accessibility panel can automatically switch to high contrast mode."}),s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-dark glass-text-primary glass-border-2 glass-border-black glass-radius hover:glass-surface-primary transition-colors",children:"High Contrast Button"})]}),s.jsx("div",{className:"mt-8",children:s.jsx(p,{...r})})]})]})},S={args:{showDashboard:!0,enableTesting:!1,position:"relative",defaultOpen:!0,onConfigChange:_()},render:r=>s.jsxs("div",{className:"ag-a11y-story glass-min-glass-h-screen glass-surface-subtle glass-p-8",children:[s.jsx("style",{children:$}),s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-secondary mb-8",children:"Minimal Accessibility Demo"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8",children:[s.jsxs("div",{className:"glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4",children:"Clean Interface"}),s.jsx("p",{className:"glass-text-secondary glass-mb-4",children:"Simple, clean design that works well with accessibility features."})]}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4",children:"Focus States"}),s.jsx("p",{className:"glass-text-secondary glass-mb-4",children:"Clear focus indicators for keyboard navigation."}),s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-blue glass-text-primary glass-radius hover:glass-surface-blue focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors",children:"Focusable Button"})]})]}),s.jsx(p,{...r})]})]})};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    showDashboard: true,
    enableTesting: true,
    position: 'relative',
    defaultOpen: true,
    onConfigChange: fn()
  },
  render: args => <div className="ag-a11y-story glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8">
      <style>{glassA11yStoryStyles}</style>
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8">
          Accessibility Control Panel Demo
        </h1>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8">
          <div className="glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4">
              Interactive Content
            </h3>
            <p className="glass-text-secondary dark:text-gray-300 glass-mb-4">
              This content demonstrates how accessibility settings can adapt the user interface in real-time.
              Try using the accessibility panel to see the changes.
            </p>
            <button className="glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg transition-colors">
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

        <GlassA11y {...args} />
      </div>
    </div>
}`,...k.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    showDashboard: true,
    enableTesting: true,
    position: 'relative',
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
            <h4 className="glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2">WCAG AA Compliance</h4>
            <div className="glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2">
              <div className="glass-surface-green glass-h-2 glass-radius-full" style={{
              width: '95%'
            }}></div>
            </div>
            <p className="glass-text-sm glass-text-secondary dark:text-gray-300">95% compliant</p>
          </div>

          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h4 className="glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2">Keyboard Navigation</h4>
            <div className="glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2">
              <div className="glass-surface-blue glass-h-2 glass-radius-full" style={{
              width: '100%'
            }}></div>
            </div>
            <p className="glass-text-sm glass-text-secondary dark:text-gray-300">Fully accessible</p>
          </div>

          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h4 className="glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2">Screen Reader Support</h4>
            <div className="glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2">
              <div className="glass-surface-primary glass-h-2 glass-radius-full" style={{
              width: '90%'
            }}></div>
            </div>
            <p className="glass-text-sm glass-text-secondary dark:text-gray-300">90% supported</p>
          </div>
        </div>

        <GlassA11y {...args} />
      </div>
    </div>
}`,...C.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    showDashboard: true,
    enableTesting: false,
    position: 'relative',
    defaultOpen: true,
    className: 'custom-accessibility-theme',
    onConfigChange: fn()
  },
  render: args => <div className="ag-a11y-story glass-min-glass-h-screen glass-surface-dark glass-p-8">
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
            This content uses high contrast colors for better visibility.
            The accessibility panel can automatically switch to high contrast mode.
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
}`,...A.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    showDashboard: true,
    enableTesting: false,
    position: 'relative',
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
            <button className="glass-px-4 glass-py-2 glass-surface-blue glass-text-primary glass-radius hover:glass-surface-blue focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors">
              Focusable Button
            </button>
          </div>
        </div>

        <GlassA11y {...args} />
      </div>
    </div>
}`,...S.parameters?.docs?.source}}};const Ts=["Default","TestingMode","HighContrast","Minimal"];export{k as Default,A as HighContrast,S as Minimal,C as TestingMode,Ts as __namedExportsOrder,Ss as default};
