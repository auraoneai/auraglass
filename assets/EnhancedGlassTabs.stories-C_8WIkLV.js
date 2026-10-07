import{r as n,a as X,j as a,c as v,b}from"./iframe-Cqi-9gHA.js";import{u as q}from"./a11y-DBBBNlGj.js";import{O as Y}from"./OptimizedGlassCore-CWgizUMZ.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-DlsmEFaF.js";const Z=(s,l,i)=>({primary:{light:"hsl(var(--glass-color-primary))",dark:"hsl(var(--glass-color-primary))"},secondary:{light:"var(--glass-color-secondary)",dark:"var(--glass-color-secondary)"},accent:{light:"hsl(var(--glass-color-danger))",dark:"hsl(var(--glass-color-danger))"},light:{light:"var(--glass-gray-50)",dark:"var(--glass-gray-100)"},dark:{light:"var(--glass-gray-800)",dark:"var(--glass-gray-900)"}}?.[s||"primary"][l?"dark":"light"],{activeColor:"var(--glass-theme-text, var(--glass-text-primary))",activeBg:"rgba(255, 255, 255, 0.28)",activeText:i?l?"var(--glass-white)":"var(--glass-black)":"var(--glass-theme-text, var(--glass-text-primary))",inactiveText:l?i?"color-mix(in srgb, var(--glass-white) 80%, transparent)":"rgba(255, 255, 255, 0.82)":i?"var(--glass-text-secondary-dark)":"var(--glass-theme-text-secondary, var(--glass-text-secondary))",hoverBg:l?"color-mix(in srgb, var(--glass-white) 5%, transparent)":"color-mix(in srgb, var(--glass-black) 3%, transparent)",disabledText:l?"var(--glass-bg-hover)":"color-mix(in srgb, var(--glass-black) 30%, transparent)"}),ee=()=>{const[s,l]=n.useState(!1);return n.useEffect(()=>{const i=window.matchMedia("(prefers-color-scheme: dark)");l(i.matches);const u=m=>l(m.matches);return i.addEventListener("change",u),()=>i.removeEventListener("change",u)},[]),s},c=n.forwardRef(({tabs:s=[],activeTab:l,onChange:i,variant:u="default",size:m="medium",color:A="primary",highContrast:V=!1,indicatorAnimation:j="slide",fullWidth:O=!1,defaultTab:R,physicsEnabled:ae=!0,showIndicator:D=!0,textAlign:w="center",className:G,style:W,respectMotionPreference:$=!0,"aria-label":z="Tabs","data-testid":M},B)=>{const H=X(),C=$&&H,I=ee(),_=q("tablist"),L=q("tab"),f=n.useRef({}),g=n.useRef(null),[o,k]=n.useState(l||R||((s?.length||0)>0?s[0].id:"")),[E,P]=n.useState({left:0,width:0,height:2,bottom:0}),N=e=>{o!==e&&(k(e),i&&i(e))};n.useImperativeHandle(B,()=>({getContainerElement:()=>g.current,setActiveTab:e=>{s.some(t=>t.id===e)&&N(e)},getActiveTab:()=>o,getTabElement:e=>f.current?.[e]||null}),[g,o,s,N,f]),n.useEffect(()=>{l!==void 0&&l!==o&&k(l)},[l]),n.useEffect(()=>{const e=()=>{const S=f.current?.[o];if(S&&g.current){const{left:Q,width:F}=S.getBoundingClientRect(),J=g.current.getBoundingClientRect().left||0,K=Q-J;P({left:K,width:F,height:m==="small"?2:m==="large"?4:3,bottom:0})}};e();const t=new ResizeObserver(()=>{e()});g.current&&t.observe(g.current);const r=f.current?.[o];return r&&t.observe(r),window.addEventListener("resize",e),()=>{t.disconnect(),window.removeEventListener("resize",e)}},[o,m]);const d=n.useMemo(()=>Z(A,I,V),[A,I,V]),h={small:{padding:"glass-py-2 glass-px-4",text:"glass-text-sm",indicatorHeight:2},medium:{padding:"glass-py-3 glass-px-5",text:"glass-text-base",indicatorHeight:3},large:{padding:"glass-py-4 glass-px-6",text:"glass-text-lg",indicatorHeight:4}}[m],U={left:"glass-justify-start",center:"glass-justify-center",right:"glass-justify-end"};return a.jsx("nav",{"aria-label":z,"data-testid":M,className:v(G),children:a.jsxs(Y,{ref:g,intent:"neutral",elevation:u==="elevated"?"level2":"level1",tier:"medium",intensity:"medium",depth:2,tint:"neutral",border:u==="outlined"?"subtle":"none",animation:C?"none":"gentle",performanceMode:"medium",className:v("glass-flex glass-relative glass-overflow-hidden glass-w-full glass-radius-lg",{"glass-bg-transparent":u==="text"}),style:{display:"flex",overflow:"hidden",width:"100%",...W},children:[a.jsx("div",{className:v("glass-flex glass-w-full glass-relative",{"[&>*]:glass-flex-1":O}),style:{display:"flex",width:"100%"},role:"tablist","aria-orientation":"horizontal",id:_,children:s.map(e=>{const t=o===e.id;return a.jsxs("button",{ref:r=>{f.current&&(f.current[e.id]=r)},role:"tab",id:`${L}-${e.id}`,tabIndex:e.disabled?-1:t?0:-1,"aria-selected":t,"aria-controls":`tabpanel-${e.id}`,disabled:e.disabled,className:v("glass-relative glass-flex glass-items-center glass-gap-2 glass-whitespace-nowrap glass-border-none glass-cursor-pointer",`glass-outline-none glass-transition-all glass-duration-[${b.DURATION.fast}ms] ${b.EASING.easeOut}`,"glass-focus glass-touch-target glass-contrast-guard","focus-visible:ring-2 focus-visible:ring-offset-2",h.padding,h.text,U[w],{"glass-cursor-not-allowed glass-opacity-50":e.disabled,"glass-bg-transparent":!t,"glass-font-semibold":t,"glass-font-medium":!t}),style:{display:"flex",alignItems:"center",justifyContent:w==="left"?"flex-start":w==="right"?"flex-end":"center",whiteSpace:"nowrap",color:e.disabled?d.disabledText:t?d.activeText:d.inactiveText,backgroundColor:t?d.activeBg:"transparent"},onMouseEnter:r=>{!e.disabled&&!t&&(r.currentTarget.style.backgroundColor=d.hoverBg,r.currentTarget.style.color=d.activeText)},onMouseLeave:r=>{!e.disabled&&!t&&(r.currentTarget.style.backgroundColor="transparent",r.currentTarget.style.color=d.inactiveText)},onClick:()=>!e.disabled&&N(e.id),children:[e.icon&&a.jsx("span",{"aria-hidden":"true",children:e.icon}),a.jsx("span",{children:e.label}),e.badgeCount!==void 0&&e.badgeCount>0&&a.jsx("span",{className:"glass-inline-glass-flex glass-items-center glass-justify-center glass-min-w-18px glass-h-18px glass-px-1.5 glass-text-xs glass-font-semibold glass-text-primary glass-radius-full",style:{backgroundColor:d.activeColor},children:e.badgeCount>99?"99+":e.badgeCount})]},e.id)})}),D&&o&&a.jsx("div",{className:v("glass-absolute glass-pointer-events-none",j==="slide"&&!C&&`glass-transition-all glass-duration-[${b.DURATION.normal}ms] ${b.EASING.easeOut}`,j==="fade"&&!C&&`glass-transition-opacity glass-duration-[${b.DURATION.fast}ms] ${b.EASING.easeOut}`),style:{left:`${E.left}px`,width:`${E.width}px`,height:`${h.indicatorHeight}px`,bottom:`${E.bottom}px`,backgroundColor:d.activeColor,borderRadius:`${h.indicatorHeight/2}px`,boxShadow:"var(--glass-elev-2)"}})]})})});c.displayName="EnhancedGlassTabs";try{c.displayName="EnhancedGlassTabs",c.__docgenInfo={description:"EnhancedGlassTabs Component",displayName:"EnhancedGlassTabs",props:{tabs:{defaultValue:{value:"[]"},description:"Array of tab items",name:"tabs",required:!1,type:{name:"TabItem[] | undefined"}},activeTab:{defaultValue:null,description:"Currently active tab ID",name:"activeTab",required:!1,type:{name:"string | undefined"}},onChange:{defaultValue:null,description:"Callback when tab changes",name:"onChange",required:!1,type:{name:"((tabId: string) => void) | undefined"}},variant:{defaultValue:{value:"default"},description:"Visual variant of the tabs",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"text"'},{value:'"outlined"'},{value:'"elevated"'}]}},size:{defaultValue:{value:"medium"},description:"Size of the tabs",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"small"'},{value:'"medium"'},{value:'"large"'}]}},color:{defaultValue:{value:"primary"},description:"Color scheme for the tabs",name:"color",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"dark"'},{value:'"light"'},{value:'"primary"'},{value:'"secondary"'},{value:'"accent"'}]}},highContrast:{defaultValue:{value:"false"},description:"Whether to use high contrast mode",name:"highContrast",required:!1,type:{name:"boolean | undefined"}},indicatorAnimation:{defaultValue:{value:"slide"},description:"Animation behavior of the indicator",name:"indicatorAnimation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"fade"'},{value:'"slide"'}]}},fullWidth:{defaultValue:{value:"false"},description:"Whether to stretch tabs to fill width",name:"fullWidth",required:!1,type:{name:"boolean | undefined"}},defaultTab:{defaultValue:null,description:"Default tab to select if none provided",name:"defaultTab",required:!1,type:{name:"string | undefined"}},physicsEnabled:{defaultValue:{value:"true"},description:"Whether to apply physics motion effects",name:"physicsEnabled",required:!1,type:{name:"boolean | undefined"}},showIndicator:{defaultValue:{value:"true"},description:"Whether to show the active indicator",name:"showIndicator",required:!1,type:{name:"boolean | undefined"}},textAlign:{defaultValue:{value:"center"},description:"Text alignment within tabs",name:"textAlign",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"center"'},{value:'"left"'},{value:'"right"'}]}},className:{defaultValue:null,description:"Additional CSS class name",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:null,description:"Inline styles",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to respect motion preferences for animations",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},"aria-label":{defaultValue:{value:"Tabs"},description:"Accessible label for the tabs",name:"aria-label",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"Test ID for testing",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const ce={title:"Navigation/Enhanced Glass Tabs",component:c,parameters:{layout:"centered",docs:{description:{component:"A glass morphism enhancedglasstabs component."}}},argTypes:{tabs:{control:"object",description:"Array of tab items"},activeTab:{control:"text",description:"Currently active tab ID"},variant:{control:{type:"select",options:["default","elevated","outlined","text"]},description:"Visual variant of the tabs"},size:{control:{type:"select",options:["small","medium","large"]},description:"Size of the tabs"},color:{control:{type:"select",options:["primary","secondary","accent","light","dark"]},description:"Color scheme for the tabs"},highContrast:{control:"boolean",description:"Whether to use high contrast mode"},indicatorAnimation:{control:{type:"select",options:["slide","fade","none"]},description:"Animation behavior of the indicator"},fullWidth:{control:"boolean",description:"Whether to stretch tabs to fill width"},showIndicator:{control:"boolean",description:"Whether to show the active indicator"},textAlign:{control:{type:"select",options:["center","left","right"]},description:"Text alignment within tabs"}},args:{tabs:[{id:"tab1",label:"Tab 1"},{id:"tab2",label:"Tab 2"},{id:"tab3",label:"Tab 3"}],activeTab:"tab1",variant:"default",size:"medium",color:"primary",highContrast:!1,indicatorAnimation:"slide",fullWidth:!1,showIndicator:!0,textAlign:"center"}},p={args:{tabs:[{id:"overview",label:"Overview"},{id:"analytics",label:"Analytics"},{id:"settings",label:"Settings"}],activeTab:"overview"}},x={render:s=>a.jsxs("div",{className:"space-y-8",children:[a.jsxs("div",{children:[a.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-4",children:"Default Variant"}),a.jsx(c,{...s})]}),a.jsxs("div",{children:[a.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-4",children:"Elevated Variant"}),a.jsx(c,{...s,variant:"elevated"})]}),a.jsxs("div",{children:[a.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-4",children:"Outlined Variant"}),a.jsx(c,{...s,variant:"outlined"})]}),a.jsxs("div",{children:[a.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-4",children:"Text Variant"}),a.jsx(c,{...s,variant:"text"})]})]}),args:{tabs:[{id:"tab1",label:"Home"},{id:"tab2",label:"Profile"},{id:"tab3",label:"Settings"}],activeTab:"tab1"}},y={args:{tabs:[{id:"notifications",label:"Notifications",badgeCount:5},{id:"messages",label:"Messages",badgeCount:12},{id:"tasks",label:"Tasks",badgeCount:3}],activeTab:"notifications"}},T={args:{tabs:[{id:"active",label:"Active"},{id:"disabled",label:"Disabled",disabled:!0},{id:"another",label:"Another"}],activeTab:"active"}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}};const ue=["Default","Variants","WithBadges","DisabledTabs"];export{p as Default,T as DisabledTabs,x as Variants,y as WithBadges,ue as __namedExportsOrder,ce as default};
