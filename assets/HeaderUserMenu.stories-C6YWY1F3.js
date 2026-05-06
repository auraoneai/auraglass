import{r as c,h as _,b as M,j as e,c as l,d as R,an as U,R as V}from"./iframe-mbNquNNc.js";import{G as D}from"./GlassPopover-Bausah_I.js";import{G as g}from"./GlassAvatar-Bzj-yKcI.js";import{C as u}from"./chevron-right-e5pK4KAf.js";import"./preload-helper-PPVm8Dsz.js";import"./FocusTrap-D21dLcpk.js";import"./LiquidGlassMaterial-D9GzyZBz.js";import"./LiquidGlassLayerProvider-DsdConQJ.js";import"./MotionFramer-BekP4wEp.js";import"./utilsCore-CTDrFk4s.js";import"./OptimizedGlassCore-CPvpl-y1.js";import"./createLucideIcon-CpanR7Fq.js";const t=c.forwardRef(({user:a={id:"default",name:"User",email:"",avatar:"",status:"offline"},items:p=[],respectMotionPreference:m=!0,"aria-label":f,"data-testid":x,className:o},h)=>{const v=_("user-menu"),y=M(),b=m&&y,[d,i]=c.useState(!1),j=a.status==="online"?"bg-green-500":a.status==="away"?"bg-yellow-500":a.status==="busy"?"bg-red-500":"bg-gray-500";return e.jsx("nav",{role:"navigation","aria-label":f||"User menu","data-testid":x,className:o,children:e.jsx(D,{open:d,onOpenChange:i,trigger:"click",placement:"bottom-end",appearance:"glass",contentClassName:"w-80 glass-p-1 ring-1 ring-white/10 shadow-[0_20px_60px_color-mix(in_srgb,_var(--glass-black)_55%,_transparent)] rounded-2xl",content:e.jsxs("div",{className:"glass-w-80",children:[e.jsx("div",{className:"glass-px-4 glass-pt-4",children:e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 glass-px-3 glass-py-3 glass-gradient-primary glass-gradient-primary glass-via-white-opacity-3 glass-gradient-primary glass-border glass-border-white/12 glass-shadow-[inset_0_1px_0_color-mix(in_srgb,_var(--glass-white)_8%,_transparent)]",style:{borderRadius:U.xl},children:[e.jsx(g,{size:"md",src:a.avatar,fallbackText:a.name,showStatus:!!a.status,status:a.status}),e.jsxs("div",{className:"glass-min-w-0",children:[e.jsx("div",{className:"glass-font-semibold glass-text-primary glass-truncate",children:a.name}),a.email&&e.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-80 glass-truncate",children:a.email}),a.status&&e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1 glass-mt-1",children:[e.jsx("span",{className:l("inline-block w-2 h-2 glass-radius-full",j)}),e.jsx("span",{className:"glass-text-xs glass-text-primary-opacity-70 glass-capitalize",children:a.status})]})]})]})}),e.jsx("div",{className:"glass-p-2",children:p.map((s,N)=>e.jsxs(V.Fragment,{children:[s?.separator&&N>0&&e.jsx("div",{className:"glass-my-2 glass-border-t glass-border-white/10"}),s?.href?e.jsxs("a",{href:s?.href,className:l("group w-full flex items-center justify-between glass-gap-3 rounded-[14px] glass-px-3 glass-py-2.5 transition-colors","glass-text-primary/90 hover:glass-text-primary hover:bg-white/10","glass-focus glass-touch-target glass-contrast-guard"),onClick:w=>i(!1),children:[e.jsxs("span",{className:"glass-inline-glass-flex glass-items-center glass-gap-3 glass-truncate",children:[s?.icon&&e.jsx("span",{className:"glass-text-primary-glass-opacity-80",children:s?.icon}),e.jsx("span",{className:"glass-truncate",children:s?.label})]}),e.jsx(u,{className:"glass-w-4 glass-h-4 glass-text-primary-glass-opacity-40 glass-group-hover:glass-text-primary-opacity-70"})]}):e.jsxs("button",{type:"button",onClick:w=>{s?.onClick?.(),i(!1)},className:l("w-full flex items-center justify-between glass-gap-3 rounded-[14px] glass-px-3 glass-py-2.5 transition-colors","glass-focus glass-touch-target glass-contrast-guard",s?.variant==="danger"?"text-red-300 hover:bg-red-500/10":"glass-text-primary/90 hover:glass-text-primary hover:bg-white/10"),children:[e.jsxs("span",{className:"glass-inline-glass-flex glass-items-center glass-gap-3 glass-truncate",children:[s?.icon&&e.jsx("span",{className:l(s?.variant==="danger"?"text-red-400":"glass-text-primary/80"),children:s?.icon}),e.jsx("span",{className:"glass-truncate",children:s?.label})]}),s?.variant!=="danger"&&e.jsx(u,{className:"glass-w-4 glass-h-4 glass-text-primary-glass-opacity-40 glass-group-hover:glass-text-primary-opacity-70"})]})]},s?.id))})]}),children:e.jsx("button",{ref:h,type:"button",className:l("flex items-center glass-gap-2 glass-px-1.5 glass-py-1 glass-radius-full","bg-transparent text-foreground hover:bg-white/10 focus:outline-none focus:ring-2 glass-focus-ring-white-opacity-30","glass-focus glass-touch-target glass-contrast-guard",!b&&`transition-all duration-[${R.DURATION.fast}ms] glass-hover-scale-105`,o),"aria-label":a.name,"aria-haspopup":"menu","aria-expanded":d,id:v,children:e.jsx(g,{size:"sm",src:a.avatar,fallbackText:a.name,showStatus:!!a.status,status:a.status})})})})});t.displayName="HeaderUserMenu";try{t.displayName="HeaderUserMenu",t.__docgenInfo={description:"",displayName:"HeaderUserMenu",props:{user:{defaultValue:{value:`{
        id: "default",
        name: "User",
        email: "",
        avatar: "",
        status: "offline",
      }`},description:"",name:"user",required:!1,type:{name:"HeaderUserInfo | undefined"}},items:{defaultValue:{value:"[]"},description:"",name:"items",required:!1,type:{name:"HeaderUserMenuItem[] | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},intent:{defaultValue:null,description:"Glass surface intent",name:"intent",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"neutral"'},{value:'"primary"'},{value:'"success"'},{value:'"warning"'},{value:'"danger"'},{value:'"info"'}]}},elevation:{defaultValue:null,description:"Glass surface elevation",name:"elevation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"level1"'},{value:'"level2"'},{value:'"level3"'},{value:'"level4"'}]}},tier:{defaultValue:null,description:"Performance tier",name:"tier",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"low"'},{value:'"medium"'},{value:'"high"'}]}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to respect motion preferences for animations",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},"aria-label":{defaultValue:null,description:"Accessible label for the menu",name:"aria-label",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"Test ID for testing",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const J={title:"Components/Navigation/HeaderUserMenu",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism headerusermenu component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},r={args:{user:{id:"user1",name:"John Doe",email:"john.doe@example.com",avatar:"",status:"online"},items:[{id:"profile",label:"Profile",icon:"👤"},{id:"settings",label:"Settings",icon:"⚙️"},{id:"logout",label:"Logout",icon:"🚪",variant:"danger"}]}},n={render:a=>e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:e.jsx(t,{...a})}),args:{user:{id:"user1",name:"John Doe",email:"john.doe@example.com",avatar:"",status:"online"},items:[{id:"profile",label:"Profile",icon:"👤"},{id:"settings",label:"Settings",icon:"⚙️"}]}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    user: {
      id: 'user1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '',
      status: 'online'
    },
    items: [{
      id: 'profile',
      label: 'Profile',
      icon: '👤'
    }, {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️'
    }, {
      id: 'logout',
      label: 'Logout',
      icon: '🚪',
      variant: 'danger'
    }]
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <HeaderUserMenu {...args} />
    </div>,
  args: {
    user: {
      id: 'user1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '',
      status: 'online'
    },
    items: [{
      id: 'profile',
      label: 'Profile',
      icon: '👤'
    }, {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️'
    }]
  }
}`,...n.parameters?.docs?.source}}};const z=["Default","Variants"];export{r as Default,n as Variants,z as __namedExportsOrder,J as default};
