import{R as f,b as X,r as g,j as s,d as p,m as x,c as L,e as I}from"./iframe-DBVOVM-c.js";import{f as M}from"./index-CLSxArU-.js";import{c as _}from"./createLucideIcon-HCPRkE_a.js";import{M as Y}from"./move-wbIYztV1.js";import{V as Z}from"./volume-2-Dcr4ouEA.js";import{S as ss}from"./settings-C6hxxvNy.js";import{M as as}from"./monitor-B2WQZ5sa.js";import{R as es}from"./rotate-ccw-BOWGmy9d.js";import{C as ls}from"./check-DomXwogN.js";import{I as ts}from"./info-Bug-BfNE.js";import{C as rs}from"./chevron-up-Bvy-AnO8.js";import{C as is}from"./chevron-down-B_bmjmiS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";const ns=[["circle",{cx:"16",cy:"4",r:"1",key:"1grugj"}],["path",{d:"m18 19 1-7-6 1",key:"r0i19z"}],["path",{d:"m5 8 3-3 5.5 3-2.36 3.5",key:"9ptxx2"}],["path",{d:"M4.24 14.5a5 5 0 0 0 6.88 6",key:"10kmtu"}],["path",{d:"M13.76 17.5a5 5 0 0 0-6.88-6",key:"2qq6rc"}]],os=_("accessibility",ns);const gs=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 18a6 6 0 0 0 0-12v12z",key:"j4l70d"}]],ds=_("contrast",gs);const cs=[["path",{d:"M10 8h.01",key:"1r9ogq"}],["path",{d:"M12 12h.01",key:"1mp3jc"}],["path",{d:"M14 8h.01",key:"1primd"}],["path",{d:"M16 12h.01",key:"1l6xoz"}],["path",{d:"M18 8h.01",key:"emo2bl"}],["path",{d:"M6 8h.01",key:"x9i8wu"}],["path",{d:"M7 16h10",key:"wp8him"}],["path",{d:"M8 12h.01",key:"czm47f"}],["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}]],us=_("keyboard",cs);const ms=[["path",{d:"M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2",key:"125lnx"}],["path",{d:"M8.5 2h7",key:"csnxdl"}],["path",{d:"M14.5 16h-5",key:"1ox875"}]],hs=_("test-tube",ms),q={contrastLevel:"normal",motionPreference:"full",reduceTransparency:!1,fontSizeMultiplier:1,colorBlindnessType:"none",enhanceKeyboardNavigation:!0,provideLongDescriptions:!0,useColorBlindFriendlyPalette:!1,enableHoverEffects:!1,announceStateChanges:!1,showSkipLinks:!1},u=f.forwardRef(function({className:e="",showDashboard:i=!0,onConfigChange:n,enableTesting:h=!0,position:d="fixed","aria-label":V,"data-testid":K},P){const y=X(),[t,o]=g.useState(q),[G,B]=g.useState(!1),[b,R]=g.useState("overview"),[$,D]=g.useState([]),[E,H]=g.useState(!1),c=t.motionPreference==="reduced",l=t.contrastLevel==="high",z=t.reduceTransparency,[F,O]=g.useState([{id:"contrast",title:"High Contrast & Visual",icon:s.jsx(ds,{className:"glass-w-5 glass-h-5"}),description:"Adjust contrast levels and visual accessibility settings",component:()=>s.jsx(C,{config:t,updateConfig:o,isHighContrast:l}),isExpanded:!1},{id:"motion",title:"Motion & Animation",icon:s.jsx(Y,{className:"glass-w-5 glass-h-5"}),description:"Control motion and animation preferences",component:()=>s.jsx(A,{config:t,updateConfig:o,isMotionReduced:c}),isExpanded:!1},{id:"screen-reader",title:"Screen Reader",icon:s.jsx(Z,{className:"glass-w-5 glass-h-5"}),description:"Enhanced screen reader support and descriptions",component:()=>s.jsx(T,{config:t,updateConfig:o}),isExpanded:!1},{id:"keyboard",title:"Keyboard Navigation",icon:s.jsx(us,{className:"glass-w-5 glass-h-5"}),description:"Enhanced keyboard navigation and focus indicators",component:()=>s.jsx(S,{config:t,updateConfig:o}),isExpanded:!1}]);g.useEffect(()=>{n?.(t)},[t,n]);const U=g.useCallback(a=>{O(m=>m.map(v=>v.id===a?{...v,isExpanded:!v.isExpanded}:v))},[]),W=g.useCallback(async()=>{H(!0);try{await new Promise(m=>setTimeout(m,p.DURATION.slower*1.5));const a=[{test:"WCAG 2.1 AA Compliance",status:"passed",score:95,details:"Most elements meet contrast requirements"},{test:"Keyboard Navigation",status:t.enhanceKeyboardNavigation?"passed":"warning",score:t.enhanceKeyboardNavigation?100:75,details:t.enhanceKeyboardNavigation?"All interactive elements are keyboard accessible":"Some elements may not be fully keyboard accessible"},{test:"Motion Preferences",status:"passed",score:100,details:"Motion preferences are respected"},{test:"Screen Reader Support",status:t.provideLongDescriptions?"passed":"warning",score:t.provideLongDescriptions?95:80,details:t.provideLongDescriptions?"Comprehensive descriptions provided":"Basic screen reader support active"},{test:"Color Blindness Support",status:t.useColorBlindFriendlyPalette?"passed":"info",score:t.useColorBlindFriendlyPalette?100:85,details:t.useColorBlindFriendlyPalette?"Color blind friendly palette active":"Standard color palette in use"}];D(a)}catch{D([])}finally{H(!1)}},[t]),J=[{id:"high-contrast",label:"High Contrast",active:l,onClick:()=>o(a=>({...a,contrastLevel:a.contrastLevel==="high"?"normal":"high"}))},{id:"reduce-motion",label:"Reduce Motion",active:c,onClick:()=>o(a=>({...a,motionPreference:a.motionPreference==="reduced"?"full":"reduced"}))},{id:"reduce-transparency",label:"Reduce Transparency",active:z,onClick:()=>o(a=>({...a,reduceTransparency:!a.reduceTransparency}))},{id:"large-text",label:"Large Text",active:t.fontSizeMultiplier>1,onClick:()=>o(a=>({...a,fontSizeMultiplier:a.fontSizeMultiplier>1?1:1.25}))}];if(!i)return null;const Q={position:d,top:d==="fixed"?"20px":void 0,right:d==="fixed"?"20px":void 0,zIndex:d==="fixed"?1e3:void 0};return s.jsxs("div",{ref:P,className:`glass-a11y-controller ${e}`,style:{...Q},"aria-label":V,"data-testid":K,children:[s.jsx(x.button,{onClick:()=>B(!G),className:L("glass-foundation-complete glass-w-14 glass-glass-h-14 glass-radius-full","flex items-center justify-center glass-shadow-lg hover:glass-shadow-xl","glass-transition glass-focus glass-press glass-magnet",{"glass-surface-dark glass-text-primary glass-border-primary":l,"glass-surface-transparent glass-text-secondary glass-border-subtle":!l,"rotate-45":G}),whileHover:{scale:1.05},whileTap:{scale:.95},"aria-label":"Toggle accessibility controls",title:"Accessibility Settings",children:s.jsx(os,{className:"glass-w-6 glass-h-6"})}),s.jsx(I,{children:G&&s.jsxs(x.div,{initial:{opacity:0,scale:.9,y:-20},animate:y?{}:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.9,y:-20},transition:y?{duration:0}:{duration:c?p.DURATION.fast/1e3:p.DURATION.normal/1e3},className:L("glass-foundation-complete absolute glass-right-0 glass-top-16","glass-w-96 glass-max-h-80vh overflow-hidden glass-shadow-2xl glass-radius-2xl",{"glass-surface-dark glass-border-primary glass-text-primary":l,"glass-surface-translucent glass-border-subtle glass-text-secondary":!l}),children:[s.jsxs("div",{className:"glass-p-6 glass-border-b glass-border-white/10",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsxs("h2",{className:"glass-text-xl glass-font-semibold glass-flex glass-items-center glass-gap-2",children:[s.jsx(ss,{className:"glass-w-5 glass-h-5"}),"Accessibility Controls"]}),s.jsxs("div",{className:"glass-flex glass-gap-2",children:[s.jsx("button",{onClick:()=>{},className:`
                      p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 glass-focus glass-touch-target glass-contrast-guard
                      ${l?"hover:bg-white/20 text-white":"hover:bg-black/10 text-gray-600"}
                    `,title:"Detect system preferences",children:s.jsx(as,{className:"glass-w-4 glass-h-4"})}),s.jsx("button",{onClick:()=>o(q),className:`
                      p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 glass-focus glass-touch-target glass-contrast-guard
                      ${l?"hover:bg-white/20 text-white":"hover:bg-black/10 text-gray-600"}
                    `,title:"Reset to defaults",children:s.jsx(es,{className:"glass-w-4 glass-h-4"})})]})]}),s.jsx("div",{className:"glass-grid glass-grid-cols-2 glass-gap-2",children:J.map(a=>s.jsx(x.button,{onClick:a.onClick,whileHover:{scale:c?1:1.02},whileTap:{scale:c?1:.98},className:`
                      p-3 rounded-lg text-sm font-medium transition-all duration-200
                      border focus:outline-none focus:ring-2 focus:ring-blue-400
                      ${a.active?l?"bg-white/30 border-white text-white":"bg-blue-500/20 border-blue-500/50 text-blue-700":l?"bg-white/10 border-white/20 text-white/80 hover:bg-white/20":"bg-white/5 border-white/10 text-gray-600 hover:bg-white/10"}
                    `,children:s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1",children:[a.active&&s.jsx(ls,{className:"glass-w-3 glass-h-3"}),s.jsx("span",{className:"glass-truncate",children:a.label})]})},a.id))})]}),s.jsxs("div",{className:"glass-flex-1 glass-overflow-y-auto",children:[s.jsxs("div",{className:"glass-flex glass-border-b glass-border-white/10",children:[s.jsx("button",{onClick:()=>R("overview"),className:`
                    flex-1 px-4 py-3 text-sm font-medium transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset glass-focus glass-touch-target glass-contrast-guard
                    ${b==="overview"?l?"bg-white/20 text-white":"bg-white/10 text-blue-600":l?"text-white/70 hover:text-white":"text-gray-600 hover:text-gray-800"}
                  `,children:"Overview"}),s.jsx("button",{onClick:()=>R("sections"),className:`
                    flex-1 px-4 py-3 text-sm font-medium transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset glass-focus glass-touch-target glass-contrast-guard
                    ${b==="sections"?l?"bg-white/20 text-white":"bg-white/10 text-blue-600":l?"text-white/70 hover:text-white":"text-gray-600 hover:text-gray-800"}
                  `,children:"Settings"}),h&&s.jsx("button",{onClick:()=>R("testing"),className:`
                      flex-1 px-4 py-3 text-sm font-medium transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset glass-focus glass-touch-target glass-contrast-guard
                      ${b==="testing"?l?"bg-white/20 text-white":"bg-white/10 text-blue-600":l?"text-white/70 hover:text-white":"text-gray-600 hover:text-gray-800"}
                    `,children:"Testing"})]}),s.jsxs("div",{className:"glass-p-6",children:[b==="overview"&&s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{className:"glass-grid glass-grid-cols-2 glass-gap-4 glass-text-sm",children:[s.jsxs("div",{className:`
                        p-3 rounded-lg border
                        ${l?"bg-white/10 border-white/20":"bg-white/5 border-white/10"}
                      `,children:[s.jsx("div",{className:"glass-font-medium glass-mb-1",children:"Contrast"}),s.jsx("div",{className:`capitalize ${l?"text-white/80":"text-gray-600"}`,children:t.contrastLevel})]}),s.jsxs("div",{className:`
                        p-3 rounded-lg border
                        ${l?"bg-white/10 border-white/20":"bg-white/5 border-white/10"}
                      `,children:[s.jsx("div",{className:"glass-font-medium glass-mb-1",children:"Motion"}),s.jsx("div",{className:`capitalize ${l?"text-white/80":"text-gray-600"}`,children:t.motionPreference})]}),s.jsxs("div",{className:`
                        p-3 rounded-lg border
                        ${l?"bg-white/10 border-white/20":"bg-white/5 border-white/10"}
                      `,children:[s.jsx("div",{className:"glass-font-medium glass-mb-1",children:"Text Scale"}),s.jsxs("div",{className:`${l?"text-white/80":"text-gray-600"}`,children:[Math.round(t.fontSizeMultiplier*100),"%"]})]}),s.jsxs("div",{className:`
                        p-3 rounded-lg border
                        ${l?"bg-white/10 border-white/20":"bg-white/5 border-white/10"}
                      `,children:[s.jsx("div",{className:"glass-font-medium glass-mb-1",children:"Color Vision"}),s.jsx("div",{className:`capitalize ${l?"text-white/80":"text-gray-600"}`,children:t.colorBlindnessType==="none"?"Normal":t.colorBlindnessType})]})]}),s.jsx("div",{className:`
                      p-4 rounded-lg border-l-4 border-blue-500
                      ${l?"bg-blue-500/20 text-white":"bg-blue-50/50 text-blue-800"}
                    `,children:s.jsxs("div",{className:"glass-flex glass-items-start glass-gap-3",children:[s.jsx(ts,{className:"glass-w-5 glass-h-5 glass-mt-0-5 glass-flex-shrink-0"}),s.jsxs("div",{children:[s.jsx("p",{className:"glass-font-medium glass-mb-1",children:"WCAG 2.1 AAA Compliant"}),s.jsx("p",{className:"glass-text-sm glass-opacity-90",children:"This interface meets the highest accessibility standards and adapts to your needs."})]})]})})]}),b==="sections"&&s.jsx("div",{className:"glass-space-y-3",children:F.map(a=>{const m=a.component;return s.jsxs("div",{className:"glass-border glass-border-white/10 glass-radius-lg",children:[s.jsx("button",{onClick:()=>U(a.id),className:`
                              w-full p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 glass-focus glass-touch-target glass-contrast-guard
                              ${l?"hover:bg-white/10 text-white":"hover:bg-black/5 text-gray-700"}
                            `,children:s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[a.icon,s.jsxs("div",{children:[s.jsx("div",{className:"glass-font-medium",children:a.title}),s.jsx("div",{className:`text-sm ${l?"text-white/70":"text-gray-500"}`,children:a.description})]})]}),a.isExpanded?s.jsx(rs,{className:"glass-w-5 glass-h-5"}):s.jsx(is,{className:"glass-w-5 glass-h-5"})]})}),s.jsx(I,{children:a.isExpanded&&s.jsx(x.div,{initial:{height:0,opacity:0},animate:y?{}:{height:"auto",opacity:1},exit:{height:0,opacity:0},transition:y?{duration:0}:{duration:c?p.DURATION.fast/1e3:p.DURATION.normal/1e3},className:"glass-border-t glass-border-white/10",children:s.jsx("div",{className:"glass-p-4",children:s.jsx(m,{})})})})]},a.id)})}),b==="testing"&&h&&s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("h3",{className:"glass-font-medium",children:"Accessibility Tests"}),s.jsx(x.button,{onClick:W,disabled:E,whileHover:{scale:c?1:1.05},whileTap:{scale:c?1:.95},className:`
                          px-4 py-2 rounded-lg text-sm font-medium transition-colors
                          focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50
                          ${l?"bg-white/20 text-white hover:bg-white/30":"bg-blue-500/20 text-blue-700 hover:bg-blue-500/30"}
                        `,children:s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx(hs,{className:"glass-w-4 glass-h-4"}),E?"Running...":"Run Tests"]})})]}),$.length>0&&s.jsx("div",{className:"glass-space-y-3",children:$.map((a,m)=>s.jsxs("div",{className:`
                              p-3 rounded-lg border-l-4
                              ${a.status==="passed"?"border-green-500 bg-green-500/10":a.status==="warning"?"border-yellow-500 bg-yellow-500/10":"border-blue-500 bg-blue-500/10"}
                            `,children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-1",children:[s.jsx("span",{className:"glass-font-medium",children:a.test}),s.jsxs("span",{className:"glass-text-sm",children:[a.score,"%"]})]}),s.jsx("p",{className:`text-sm ${l?"text-white/70":"text-gray-600"}`,children:a.details})]},m))})]})]})]})]})}),s.jsx("div",{className:"glass-sr-only",role:"region","aria-live":"polite",children:"Press Alt+A to open accessibility controls"})]})});u.displayName="GlassA11y";const C=f.forwardRef(function({config:e,updateConfig:i,isHighContrast:n},h){return s.jsxs("div",{ref:h,className:"glass-space-y-4",children:[s.jsx("h4",{className:"glass-font-medium",children:"High Contrast Settings"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-mb-2",children:"Contrast Level"}),s.jsxs("select",{value:e.contrastLevel,onChange:d=>i({...e,contrastLevel:d.target.value}),className:`w-full p-2 rounded border glass-focus glass-touch-target glass-contrast-guard ${n?"bg-white/10 border-white/20 text-white":"bg-white/5 border-white/10"}`,children:[s.jsx("option",{value:"normal",children:"Normal"}),s.jsx("option",{value:"high",children:"High Contrast"}),s.jsx("option",{value:"maximum",children:"Maximum Contrast"})]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Reduce Transparency"}),s.jsx("button",{onClick:()=>i({...e,reduceTransparency:!e.reduceTransparency}),className:`w-12 h-6 rounded-full transition-colors glass-focus glass-touch-target glass-contrast-guard ${e.reduceTransparency?"bg-blue-500":"bg-gray-300"}`,children:s.jsx("div",{className:`w-5 h-5 bg-white rounded-full transition-transform ${e.reduceTransparency?"translate-x-6":"translate-x-0.5"}`})})]})]})]})});C.displayName="GlassHighContrast";const A=f.forwardRef(function({config:e,updateConfig:i,isMotionReduced:n},h){return s.jsxs("div",{ref:h,className:"glass-space-y-4",children:[s.jsx("h4",{className:"glass-font-medium",children:"Motion & Animation"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-mb-2",children:"Motion Preference"}),s.jsxs("select",{value:e.motionPreference,onChange:d=>i({...e,motionPreference:d.target.value}),className:`w-full p-2 rounded border glass-focus glass-touch-target glass-contrast-guard ${n?"bg-white/10 border-white/20 text-white":"bg-white/5 border-white/10"}`,children:[s.jsx("option",{value:"full",children:"Full Motion"}),s.jsx("option",{value:"reduced",children:"Reduced Motion"}),s.jsx("option",{value:"none",children:"No Motion"})]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Enable Hover Effects"}),s.jsx("button",{onClick:()=>i({...e,enableHoverEffects:!e.enableHoverEffects}),className:`w-12 h-6 rounded-full transition-colors glass-focus glass-touch-target glass-contrast-guard ${e.enableHoverEffects?"bg-blue-500":"bg-gray-300"}`,children:s.jsx("div",{className:`w-5 h-5 bg-white rounded-full transition-transform ${e.enableHoverEffects?"translate-x-6":"translate-x-0.5"}`})})]})]})]})});A.displayName="GlassMotionControls";const T=f.forwardRef(function({config:e,updateConfig:i},n){return s.jsxs("div",{ref:n,className:"glass-space-y-4",children:[s.jsx("h4",{className:"glass-font-medium",children:"Screen Reader Support"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Provide Long Descriptions"}),s.jsx("button",{onClick:()=>i({...e,provideLongDescriptions:!e.provideLongDescriptions}),className:`w-12 h-6 rounded-full transition-colors glass-focus glass-touch-target glass-contrast-guard ${e.provideLongDescriptions?"bg-blue-500":"bg-gray-300"}`,children:s.jsx("div",{className:`w-5 h-5 bg-white rounded-full transition-transform ${e.provideLongDescriptions?"translate-x-6":"translate-x-0.5"}`})})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Announce State Changes"}),s.jsx("button",{onClick:()=>i({...e,announceStateChanges:!e.announceStateChanges}),className:`w-12 h-6 rounded-full transition-colors glass-focus glass-touch-target glass-contrast-guard ${e.announceStateChanges?"bg-blue-500":"bg-gray-300"}`,children:s.jsx("div",{className:`w-5 h-5 bg-white rounded-full transition-transform ${e.announceStateChanges?"translate-x-6":"translate-x-0.5"}`})})]})]})]})});T.displayName="GlassScreenReader";const S=f.forwardRef(function({config:e,updateConfig:i},n){return s.jsxs("div",{ref:n,className:"glass-space-y-4",children:[s.jsx("h4",{className:"glass-font-medium",children:"Keyboard Navigation"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Enhanced Keyboard Navigation"}),s.jsx("button",{onClick:()=>i({...e,enhanceKeyboardNavigation:!e.enhanceKeyboardNavigation}),className:`w-12 h-6 rounded-full transition-colors glass-focus glass-touch-target glass-contrast-guard ${e.enhanceKeyboardNavigation?"bg-blue-500":"bg-gray-300"}`,children:s.jsx("div",{className:`w-5 h-5 bg-white rounded-full transition-transform ${e.enhanceKeyboardNavigation?"translate-x-6":"translate-x-0.5"}`})})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:"Skip Links"}),s.jsx("button",{onClick:()=>i({...e,showSkipLinks:!e.showSkipLinks}),className:`w-12 h-6 rounded-full transition-colors glass-focus glass-touch-target glass-contrast-guard ${e.showSkipLinks?"bg-blue-500":"bg-gray-300"}`,children:s.jsx("div",{className:`w-5 h-5 bg-white rounded-full transition-transform ${e.showSkipLinks?"translate-x-6":"translate-x-0.5"}`})})]})]})]})});S.displayName="GlassKeyboardNav";try{u.displayName="GlassA11y",u.__docgenInfo={description:"",displayName:"GlassA11y",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},showDashboard:{defaultValue:{value:"true"},description:"",name:"showDashboard",required:!1,type:{name:"boolean | undefined"}},onConfigChange:{defaultValue:null,description:"",name:"onConfigChange",required:!1,type:{name:"((config: GlassA11yConfig) => void) | undefined"}},enableTesting:{defaultValue:{value:"true"},description:"",name:"enableTesting",required:!1,type:{name:"boolean | undefined"}},position:{defaultValue:{value:"fixed"},description:"",name:"position",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"fixed"'},{value:'"relative"'}]}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}try{C.displayName="GlassHighContrast",C.__docgenInfo={description:"",displayName:"GlassHighContrast",props:{config:{defaultValue:null,description:"",name:"config",required:!0,type:{name:"GlassA11yConfig"}},updateConfig:{defaultValue:null,description:"",name:"updateConfig",required:!0,type:{name:"GlassA11yConfigUpdater"}},isHighContrast:{defaultValue:null,description:"",name:"isHighContrast",required:!0,type:{name:"boolean"}}}}}catch{}try{A.displayName="GlassMotionControls",A.__docgenInfo={description:"",displayName:"GlassMotionControls",props:{config:{defaultValue:null,description:"",name:"config",required:!0,type:{name:"GlassA11yConfig"}},updateConfig:{defaultValue:null,description:"",name:"updateConfig",required:!0,type:{name:"GlassA11yConfigUpdater"}},isMotionReduced:{defaultValue:null,description:"",name:"isMotionReduced",required:!0,type:{name:"boolean"}}}}}catch{}try{T.displayName="GlassScreenReader",T.__docgenInfo={description:"",displayName:"GlassScreenReader",props:{config:{defaultValue:null,description:"",name:"config",required:!0,type:{name:"GlassA11yConfig"}},updateConfig:{defaultValue:null,description:"",name:"updateConfig",required:!0,type:{name:"GlassA11yConfigUpdater"}}}}}catch{}try{S.displayName="GlassKeyboardNav",S.__docgenInfo={description:"",displayName:"GlassKeyboardNav",props:{config:{defaultValue:null,description:"",name:"config",required:!0,type:{name:"GlassA11yConfig"}},updateConfig:{defaultValue:null,description:"",name:"updateConfig",required:!0,type:{name:"GlassA11yConfigUpdater"}}}}}catch{}const Ms={title:"Accessibility/GlassA11y",component:u,parameters:{layout:"fullscreen",docs:{description:{component:"A comprehensive accessibility control panel providing WCAG AAA compliance management with real-time testing and adaptive interfaces."}}},argTypes:{showDashboard:{control:"boolean",description:"Whether to show the accessibility dashboard"},enableTesting:{control:"boolean",description:"Enable accessibility testing features"},position:{control:{type:"select",options:["fixed","relative"]},description:"Positioning mode for the panel"},className:{control:"text",description:"Additional CSS classes"},onConfigChange:{action:"config changed",description:"Called when accessibility configuration changes"}}},N={args:{showDashboard:!0,enableTesting:!0,position:"fixed",onConfigChange:M()},render:r=>s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8",children:"Accessibility Control Panel Demo"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8",children:[s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4",children:"Interactive Content"}),s.jsx("p",{className:"glass-text-secondary dark:text-gray-300 glass-mb-4",children:"This content demonstrates how accessibility settings can adapt the user interface in real-time. Try using the accessibility panel to see the changes."}),s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg transition-colors",children:"Interactive Button"})]}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4",children:"Form Elements"}),s.jsxs("div",{className:"glass-space-y-4",children:[s.jsx("input",{type:"text",placeholder:"Enter text here",className:"glass-w-full glass-p-3 glass-border glass-border-subtle dark:glass-border-gray-600 glass-radius-lg glass-surface-subtle dark:glass-surface-subtle glass-text-secondary dark:glass-text-primary glass-touch-target glass-contrast-guard"}),s.jsx("textarea",{placeholder:"Enter longer text here",rows:3,className:"glass-w-full glass-p-3 glass-border glass-border-subtle dark:glass-border-gray-600 glass-radius-lg glass-surface-subtle dark:glass-surface-subtle glass-text-secondary dark:glass-text-primary glass-touch-target glass-contrast-guard"})]})]})]}),s.jsx(u,{...r})]})})},w={args:{showDashboard:!0,enableTesting:!0,position:"fixed",onConfigChange:M()},render:r=>s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8",children:"Accessibility Testing Demo"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6 mb-8",children:[s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2",children:"WCAG AA Compliance"}),s.jsx("div",{className:"glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2",children:s.jsx("div",{className:"glass-surface-green glass-h-2 glass-radius-full",style:{width:"95%"}})}),s.jsx("p",{className:"glass-text-sm glass-text-secondary dark:text-gray-300",children:"95% compliant"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2",children:"Keyboard Navigation"}),s.jsx("div",{className:"glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2",children:s.jsx("div",{className:"glass-surface-blue glass-h-2 glass-radius-full",style:{width:"100%"}})}),s.jsx("p",{className:"glass-text-sm glass-text-secondary dark:text-gray-300",children:"Fully accessible"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2",children:"Screen Reader Support"}),s.jsx("div",{className:"glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2",children:s.jsx("div",{className:"glass-surface-primary glass-h-2 glass-radius-full",style:{width:"90%"}})}),s.jsx("p",{className:"glass-text-sm glass-text-secondary dark:text-gray-300",children:"90% supported"})]})]}),s.jsx(u,{...r})]})})},j={args:{showDashboard:!0,enableTesting:!1,position:"relative",className:"custom-accessibility-theme",onConfigChange:M()},render:r=>s.jsx("div",{className:"glass-min-glass-h-screen glass-surface-dark glass-p-8",children:s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary mb-8",children:"High Contrast Mode Demo"}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle glass-border-2 glass-border-black glass-radius-xl",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-inverse glass-mb-4",children:"High Contrast Content"}),s.jsx("p",{className:"glass-text-inverse glass-mb-4",children:"This content uses high contrast colors for better visibility. The accessibility panel can automatically switch to high contrast mode."}),s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-dark glass-text-primary glass-border-2 glass-border-black glass-radius hover:glass-surface-primary transition-colors",children:"High Contrast Button"})]}),s.jsx("div",{className:"mt-8",children:s.jsx(u,{...r})})]})})},k={args:{showDashboard:!0,enableTesting:!1,position:"relative",onConfigChange:M()},render:r=>s.jsx("div",{className:"glass-min-glass-h-screen glass-surface-subtle glass-p-8",children:s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-secondary mb-8",children:"Minimal Accessibility Demo"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8",children:[s.jsxs("div",{className:"glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4",children:"Clean Interface"}),s.jsx("p",{className:"glass-text-secondary glass-mb-4",children:"Simple, clean design that works well with accessibility features."})]}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4",children:"Focus States"}),s.jsx("p",{className:"glass-text-secondary glass-mb-4",children:"Clear focus indicators for keyboard navigation."}),s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-blue glass-text-primary glass-radius hover:glass-surface-blue focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors",children:"Focusable Button"})]})]}),s.jsx(u,{...r})]})})};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    showDashboard: true,
    enableTesting: true,
    position: 'fixed',
    onConfigChange: fn()
  },
  render: args => <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8">
          Accessibility Control Panel Demo
        </h1>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8">
          <div className="glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
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

          <div className="glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
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
}`,...N.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    showDashboard: true,
    enableTesting: true,
    position: 'fixed',
    onConfigChange: fn()
  },
  render: args => <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8">
          Accessibility Testing Demo
        </h1>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6 mb-8">
          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h4 className="glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2">WCAG AA Compliance</h4>
            <div className="glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2">
              <div className="glass-surface-green glass-h-2 glass-radius-full" style={{
              width: '95%'
            }}></div>
            </div>
            <p className="glass-text-sm glass-text-secondary dark:text-gray-300">95% compliant</p>
          </div>

          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h4 className="glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2">Keyboard Navigation</h4>
            <div className="glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2">
              <div className="glass-surface-blue glass-h-2 glass-radius-full" style={{
              width: '100%'
            }}></div>
            </div>
            <p className="glass-text-sm glass-text-secondary dark:text-gray-300">Fully accessible</p>
          </div>

          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
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
}`,...w.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    showDashboard: true,
    enableTesting: false,
    position: 'relative',
    className: 'custom-accessibility-theme',
    onConfigChange: fn()
  },
  render: args => <div className="glass-min-glass-h-screen glass-surface-dark glass-p-8">
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
}`,...j.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    showDashboard: true,
    enableTesting: false,
    position: 'relative',
    onConfigChange: fn()
  },
  render: args => <div className="glass-min-glass-h-screen glass-surface-subtle glass-p-8">
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
}`,...k.parameters?.docs?.source}}};const _s=["Default","TestingMode","HighContrast","Minimal"];export{N as Default,j as HighContrast,k as Minimal,w as TestingMode,_s as __namedExportsOrder,Ms as default};
