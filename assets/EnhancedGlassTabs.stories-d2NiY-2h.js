import{r as i,b as X,j as a,c as v,d as b}from"./iframe-Ba4C8OEc.js";import{u as q}from"./a11y-S73Y6DdK.js";import{O as Y}from"./OptimizedGlassCore-CqLDO6n8.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-USAXnPyC.js";const Z=(t,s,r)=>{const n={primary:{light:"var(--glass-color-primary)",dark:"var(--glass-color-primary)"},secondary:{light:"var(--glass-color-secondary)",dark:"var(--glass-color-secondary)"},accent:{light:"var(--glass-color-danger)",dark:"var(--glass-color-danger)"},light:{light:"var(--glass-gray-50)",dark:"var(--glass-gray-100)"},dark:{light:"var(--glass-gray-800)",dark:"var(--glass-gray-900)"}}?.[t||"primary"][s?"dark":"light"];return{activeColor:n,activeBg:s?`${n}22`:`${n}11`,activeText:r?s?"var(--glass-white)":"var(--glass-black)":n,inactiveText:s?r?"color-mix(in srgb, var(--glass-white) 80%, transparent)":"color-mix(in srgb, var(--glass-white) 60%, transparent)":r?"var(--glass-text-secondary-dark)":"var(--glass-text-tertiary-dark)",hoverBg:s?"color-mix(in srgb, var(--glass-white) 5%, transparent)":"color-mix(in srgb, var(--glass-black) 3%, transparent)",disabledText:s?"var(--glass-bg-hover)":"color-mix(in srgb, var(--glass-black) 30%, transparent)"}},ee=()=>{const[t,s]=i.useState(!1);return i.useEffect(()=>{const r=window.matchMedia("(prefers-color-scheme: dark)");s(r.matches);const g=n=>s(n.matches);return r.addEventListener("change",g),()=>r.removeEventListener("change",g)},[]),t},u=i.forwardRef(({tabs:t=[],activeTab:s,onChange:r,variant:g="default",size:n="medium",color:A="primary",highContrast:V=!1,indicatorAnimation:j="slide",fullWidth:O=!1,defaultTab:R,physicsEnabled:ae=!0,showIndicator:$=!0,textAlign:w="center",className:D,style:G,respectMotionPreference:W=!0,"aria-label":z="Tabs","data-testid":B},H)=>{const M=X(),C=W&&M,I=ee(),_=q("tablist"),L=q("tab"),f=i.useRef({}),m=i.useRef(null),[d,k]=i.useState(s||R||((t?.length||0)>0?t[0].id:"")),[E,P]=i.useState({left:0,width:0,height:2,bottom:0}),N=e=>{d!==e&&(k(e),r&&r(e))};i.useImperativeHandle(H,()=>({getContainerElement:()=>m.current,setActiveTab:e=>{t.some(l=>l.id===e)&&N(e)},getActiveTab:()=>d,getTabElement:e=>f.current?.[e]||null}),[m,d,t,N,f]),i.useEffect(()=>{s!==void 0&&s!==d&&k(s)},[s]),i.useEffect(()=>{const e=()=>{const S=f.current?.[d];if(S&&m.current){const{left:Q,width:F}=S.getBoundingClientRect(),J=m.current.getBoundingClientRect().left||0,K=Q-J;P({left:K,width:F,height:n==="small"?2:n==="large"?4:3,bottom:0})}};e();const l=new ResizeObserver(()=>{e()});m.current&&l.observe(m.current);const o=f.current?.[d];return o&&l.observe(o),window.addEventListener("resize",e),()=>{l.disconnect(),window.removeEventListener("resize",e)}},[d,n]);const c=i.useMemo(()=>Z(A,I,V),[A,I,V]),p={small:{padding:"glass-py-2 glass-px-4",text:"glass-text-sm",indicatorHeight:2},medium:{padding:"glass-py-3 glass-px-5",text:"glass-text-base",indicatorHeight:3},large:{padding:"glass-py-4 glass-px-6",text:"glass-text-lg",indicatorHeight:4}}[n],U={left:"glass-justify-start",center:"glass-justify-center",right:"glass-justify-end"};return a.jsx("nav",{"aria-label":z,"data-testid":B,className:v(D),children:a.jsxs(Y,{ref:m,intent:"neutral",elevation:g==="elevated"?"level2":"level1",tier:"medium",intensity:"medium",depth:2,tint:"neutral",border:g==="outlined"?"subtle":"none",animation:C?"none":"gentle",performanceMode:"medium",className:v("glass-flex glass-relative glass-overflow-hidden glass-w-full glass-radius-lg",{"glass-bg-transparent":g==="text"}),style:{display:"flex",overflow:"hidden",width:"100%",...G},children:[a.jsx("div",{className:v("glass-flex glass-w-full glass-relative",{"[&>*]:glass-flex-1":O}),style:{display:"flex",width:"100%"},role:"tablist","aria-orientation":"horizontal",id:_,children:t.map(e=>{const l=d===e.id;return a.jsxs("button",{ref:o=>{f.current&&(f.current[e.id]=o)},role:"tab",id:`${L}-${e.id}`,tabIndex:e.disabled?-1:l?0:-1,"aria-selected":l,"aria-controls":`tabpanel-${e.id}`,disabled:e.disabled,className:v("glass-relative glass-flex glass-items-center glass-gap-2 glass-whitespace-nowrap glass-border-none glass-cursor-pointer",`glass-outline-none glass-transition-all glass-duration-[${b.DURATION.fast}ms] ${b.EASING.easeOut}`,"glass-focus glass-touch-target glass-contrast-guard","focus-visible:ring-2 focus-visible:ring-offset-2",p.padding,p.text,U[w],{"glass-cursor-not-allowed glass-opacity-50":e.disabled,"glass-bg-transparent":!l,"glass-font-semibold":l,"glass-font-medium":!l}),style:{display:"flex",alignItems:"center",justifyContent:w==="left"?"flex-start":w==="right"?"flex-end":"center",whiteSpace:"nowrap",color:e.disabled?c.disabledText:l?c.activeText:c.inactiveText,backgroundColor:l?c.activeBg:"transparent"},onMouseEnter:o=>{!e.disabled&&!l&&(o.currentTarget.style.backgroundColor=c.hoverBg,o.currentTarget.style.color=c.activeText)},onMouseLeave:o=>{!e.disabled&&!l&&(o.currentTarget.style.backgroundColor="transparent",o.currentTarget.style.color=c.inactiveText)},onClick:()=>!e.disabled&&N(e.id),children:[e.icon&&a.jsx("span",{"aria-hidden":"true",children:e.icon}),a.jsx("span",{children:e.label}),e.badgeCount!==void 0&&e.badgeCount>0&&a.jsx("span",{className:"glass-inline-glass-flex glass-items-center glass-justify-center glass-min-w-18px glass-h-18px glass-px-1.5 glass-text-xs glass-font-semibold glass-text-primary glass-radius-full",style:{backgroundColor:c.activeColor},children:e.badgeCount>99?"99+":e.badgeCount})]},e.id)})}),$&&d&&a.jsx("div",{className:v("glass-absolute glass-pointer-events-none",j==="slide"&&!C&&`glass-transition-all glass-duration-[${b.DURATION.normal}ms] ${b.EASING.easeOut}`,j==="fade"&&!C&&`glass-transition-opacity glass-duration-[${b.DURATION.fast}ms] ${b.EASING.easeOut}`),style:{left:`${E.left}px`,width:`${E.width}px`,height:`${p.indicatorHeight}px`,bottom:`${E.bottom}px`,backgroundColor:c.activeColor,borderRadius:`${p.indicatorHeight/2}px`,boxShadow:"var(--glass-elev-2)"}})]})})});u.displayName="EnhancedGlassTabs";try{u.displayName="EnhancedGlassTabs",u.__docgenInfo={description:"EnhancedGlassTabs Component",displayName:"EnhancedGlassTabs",props:{tabs:{defaultValue:{value:"[]"},description:"Array of tab items",name:"tabs",required:!1,type:{name:"TabItem[] | undefined"}},activeTab:{defaultValue:null,description:"Currently active tab ID",name:"activeTab",required:!1,type:{name:"string | undefined"}},onChange:{defaultValue:null,description:"Callback when tab changes",name:"onChange",required:!1,type:{name:"((tabId: string) => void) | undefined"}},variant:{defaultValue:{value:"default"},description:"Visual variant of the tabs",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"text"'},{value:'"outlined"'},{value:'"elevated"'}]}},size:{defaultValue:{value:"medium"},description:"Size of the tabs",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"small"'},{value:'"large"'}]}},color:{defaultValue:{value:"primary"},description:"Color scheme for the tabs",name:"color",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"light"'},{value:'"dark"'},{value:'"primary"'},{value:'"secondary"'},{value:'"accent"'}]}},highContrast:{defaultValue:{value:"false"},description:"Whether to use high contrast mode",name:"highContrast",required:!1,type:{name:"boolean | undefined"}},indicatorAnimation:{defaultValue:{value:"slide"},description:"Animation behavior of the indicator",name:"indicatorAnimation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"fade"'},{value:'"slide"'}]}},fullWidth:{defaultValue:{value:"false"},description:"Whether to stretch tabs to fill width",name:"fullWidth",required:!1,type:{name:"boolean | undefined"}},defaultTab:{defaultValue:null,description:"Default tab to select if none provided",name:"defaultTab",required:!1,type:{name:"string | undefined"}},physicsEnabled:{defaultValue:{value:"true"},description:"Whether to apply physics motion effects",name:"physicsEnabled",required:!1,type:{name:"boolean | undefined"}},showIndicator:{defaultValue:{value:"true"},description:"Whether to show the active indicator",name:"showIndicator",required:!1,type:{name:"boolean | undefined"}},textAlign:{defaultValue:{value:"center"},description:"Text alignment within tabs",name:"textAlign",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"center"'},{value:'"left"'},{value:'"right"'}]}},className:{defaultValue:null,description:"Additional CSS class name",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:null,description:"Inline styles",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to respect motion preferences for animations",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},"aria-label":{defaultValue:{value:"Tabs"},description:"Accessible label for the tabs",name:"aria-label",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"Test ID for testing",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const ce={title:"Navigation/Enhanced Glass Tabs",component:u,parameters:{layout:"centered",docs:{description:{component:"A glass morphism enhancedglasstabs component."}}},argTypes:{tabs:{control:"object",description:"Array of tab items"},activeTab:{control:"text",description:"Currently active tab ID"},variant:{control:{type:"select",options:["default","elevated","outlined","text"]},description:"Visual variant of the tabs"},size:{control:{type:"select",options:["small","medium","large"]},description:"Size of the tabs"},color:{control:{type:"select",options:["primary","secondary","accent","light","dark"]},description:"Color scheme for the tabs"},highContrast:{control:"boolean",description:"Whether to use high contrast mode"},indicatorAnimation:{control:{type:"select",options:["slide","fade","none"]},description:"Animation behavior of the indicator"},fullWidth:{control:"boolean",description:"Whether to stretch tabs to fill width"},showIndicator:{control:"boolean",description:"Whether to show the active indicator"},textAlign:{control:{type:"select",options:["center","left","right"]},description:"Text alignment within tabs"}},args:{tabs:[{id:"tab1",label:"Tab 1"},{id:"tab2",label:"Tab 2"},{id:"tab3",label:"Tab 3"}],activeTab:"tab1",variant:"default",size:"medium",color:"primary",highContrast:!1,indicatorAnimation:"slide",fullWidth:!1,showIndicator:!0,textAlign:"center"}},h={args:{tabs:[{id:"overview",label:"Overview"},{id:"analytics",label:"Analytics"},{id:"settings",label:"Settings"}],activeTab:"overview"}},y={render:t=>a.jsxs("div",{className:"space-y-8",children:[a.jsxs("div",{children:[a.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-4",children:"Default Variant"}),a.jsx(u,{...t})]}),a.jsxs("div",{children:[a.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-4",children:"Elevated Variant"}),a.jsx(u,{...t,variant:"elevated"})]}),a.jsxs("div",{children:[a.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-4",children:"Outlined Variant"}),a.jsx(u,{...t,variant:"outlined"})]}),a.jsxs("div",{children:[a.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-4",children:"Text Variant"}),a.jsx(u,{...t,variant:"text"})]})]}),args:{tabs:[{id:"tab1",label:"Home"},{id:"tab2",label:"Profile"},{id:"tab3",label:"Settings"}],activeTab:"tab1"}},x={args:{tabs:[{id:"notifications",label:"Notifications",badgeCount:5},{id:"messages",label:"Messages",badgeCount:12},{id:"tasks",label:"Tasks",badgeCount:3}],activeTab:"notifications"}},T={args:{tabs:[{id:"active",label:"Active"},{id:"disabled",label:"Disabled",disabled:!0},{id:"another",label:"Another"}],activeTab:"active"}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    tabs: [{
      id: 'overview',
      label: 'Overview'
    }, {
      id: 'analytics',
      label: 'Analytics'
    }, {
      id: 'settings',
      label: 'Settings'
    }],
    activeTab: 'overview'
  }
}`,...h.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <div className="space-y-8">
      <div>
        <h3 className="glass-text-lg glass-font-semibold glass-mb-4">Default Variant</h3>
        <EnhancedGlassTabs {...args} />
      </div>
      <div>
        <h3 className="glass-text-lg glass-font-semibold glass-mb-4">Elevated Variant</h3>
        <EnhancedGlassTabs {...args} variant="elevated" />
      </div>
      <div>
        <h3 className="glass-text-lg glass-font-semibold glass-mb-4">Outlined Variant</h3>
        <EnhancedGlassTabs {...args} variant="outlined" />
      </div>
      <div>
        <h3 className="glass-text-lg glass-font-semibold glass-mb-4">Text Variant</h3>
        <EnhancedGlassTabs {...args} variant="text" />
      </div>
    </div>,
  args: {
    tabs: [{
      id: 'tab1',
      label: 'Home'
    }, {
      id: 'tab2',
      label: 'Profile'
    }, {
      id: 'tab3',
      label: 'Settings'
    }],
    activeTab: 'tab1'
  }
}`,...y.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    tabs: [{
      id: 'notifications',
      label: 'Notifications',
      badgeCount: 5
    }, {
      id: 'messages',
      label: 'Messages',
      badgeCount: 12
    }, {
      id: 'tasks',
      label: 'Tasks',
      badgeCount: 3
    }],
    activeTab: 'notifications'
  }
}`,...x.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    tabs: [{
      id: 'active',
      label: 'Active'
    }, {
      id: 'disabled',
      label: 'Disabled',
      disabled: true
    }, {
      id: 'another',
      label: 'Another'
    }],
    activeTab: 'active'
  }
}`,...T.parameters?.docs?.source}}};const ue=["Default","Variants","WithBadges","DisabledTabs"];export{h as Default,T as DisabledTabs,y as Variants,x as WithBadges,ue as __namedExportsOrder,ce as default};
