import{r as c,b as k,j as s,c as r,d as I,ah as M,R as S}from"./iframe-LB2Lfhgp.js";import{G as U}from"./GlassPopover-DPALISv2.js";import{G as m}from"./GlassAvatar-BRgn_6sZ.js";import{u as H}from"./a11y-DBdyTOMI.js";import{C as u}from"./chevron-right-g2PVrFxW.js";import"./preload-helper-PPVm8Dsz.js";import"./FocusTrap-DbeTyZk9.js";import"./LiquidGlassMaterial-O4aHTI2D.js";import"./LiquidGlassLayerProvider-DEWz-jJN.js";import"./MotionFramer-CR_bXaKW.js";import"./utilsCore-iKIe4RkQ.js";import"./OptimizedGlassCore-Bt3saaFo.js";import"./deviceCapabilities-DKKFd1VE.js";import"./createLucideIcon-CKdMI_TB.js";const l=c.forwardRef(({user:a={id:"default",name:"User",email:"",avatar:"",status:"offline"},items:t=[],respectMotionPreference:x=!0,"aria-label":f,"data-testid":h,className:d},y)=>{const v=H("user-menu"),b=k(),w=x&&b,[g,o]=c.useState(!1),N=a.status==="online"?"bg-green-500":a.status==="away"?"bg-yellow-500":a.status==="busy"?"bg-red-500":"bg-gray-500";return s.jsx("nav",{role:"navigation","aria-label":f||"User menu","data-testid":h,className:d,children:s.jsx(U,{open:g,onOpenChange:o,trigger:"click",placement:"bottom-end",appearance:"glass",contentClassName:"w-80 glass-p-1 ring-1 ring-white/10 shadow-[0_20px_60px_color-mix(in_srgb,_var(--glass-black)_55%,_transparent)] rounded-2xl",content:s.jsxs("div",{className:"glass-w-80",children:[s.jsx("div",{className:"glass-px-4 glass-pt-4",children:s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 glass-px-3 glass-py-3 glass-gradient-primary glass-gradient-primary glass-via-white-opacity-3 glass-gradient-primary glass-border glass-border-white/12 glass-shadow-[inset_0_1px_0_color-mix(in_srgb,_var(--glass-white)_8%,_transparent)]",style:{borderRadius:M.xl},children:[s.jsx(m,{size:"md",src:a.avatar,fallbackText:a.name,showStatus:!!a.status,status:a.status}),s.jsxs("div",{className:"glass-min-w-0",children:[s.jsx("div",{className:"glass-font-semibold glass-text-primary glass-truncate",children:a.name}),a.email&&s.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-80 glass-truncate",children:a.email}),a.status&&s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1 glass-mt-1",children:[s.jsx("span",{className:r("inline-block w-2 h-2 glass-radius-full",N)}),s.jsx("span",{className:"glass-text-xs glass-text-primary-opacity-70 glass-capitalize",children:a.status})]})]})]})}),s.jsx("div",{className:"glass-p-2",children:t.map((e,j)=>s.jsxs(S.Fragment,{children:[e?.separator&&j>0&&s.jsx("div",{className:"glass-my-2 glass-border-t glass-border-white/10"}),e?.href?s.jsxs("a",{href:e?.href,className:r("group w-full flex items-center justify-between glass-gap-3 rounded-[14px] glass-px-3 glass-py-2.5 transition-colors","glass-text-primary/90 hover:glass-text-primary hover:bg-white/10","glass-focus glass-touch-target glass-contrast-guard"),onClick:_=>o(!1),children:[s.jsxs("span",{className:"glass-inline-glass-flex glass-items-center glass-gap-3 glass-truncate",children:[e?.icon&&s.jsx("span",{className:"glass-text-primary-glass-opacity-80",children:e?.icon}),s.jsx("span",{className:"glass-truncate",children:e?.label})]}),s.jsx(u,{className:"glass-w-4 glass-h-4 glass-text-primary-glass-opacity-40 glass-group-hover:glass-text-primary-opacity-70"})]}):s.jsxs("button",{type:"button",onClick:_=>{e?.onClick?.(),o(!1)},className:r("w-full flex items-center justify-between glass-gap-3 rounded-[14px] glass-px-3 glass-py-2.5 transition-colors","glass-focus glass-touch-target glass-contrast-guard",e?.variant==="danger"?"text-red-300 hover:bg-red-500/10":"glass-text-primary/90 hover:glass-text-primary hover:bg-white/10"),style:{border:0,background:"transparent",font:"inherit"},children:[s.jsxs("span",{className:"glass-inline-glass-flex glass-items-center glass-gap-3 glass-truncate",children:[e?.icon&&s.jsx("span",{className:r(e?.variant==="danger"?"text-red-400":"glass-text-primary/80"),children:e?.icon}),s.jsx("span",{className:"glass-truncate",children:e?.label})]}),e?.variant!=="danger"&&s.jsx(u,{className:"glass-w-4 glass-h-4 glass-text-primary-glass-opacity-40 glass-group-hover:glass-text-primary-opacity-70"})]})]},e?.id))})]}),children:s.jsx("button",{ref:y,type:"button",className:r("flex items-center glass-gap-2 glass-px-1.5 glass-py-1 glass-radius-full","bg-transparent text-foreground hover:bg-white/10 focus:outline-none focus:ring-2 glass-focus-ring-white-opacity-30","glass-focus glass-touch-target glass-contrast-guard",!w&&`transition-all duration-[${I.DURATION.fast}ms] glass-hover-scale-105`,d),style:{border:0,background:"transparent",color:"inherit",font:"inherit"},"aria-label":a.name,"aria-haspopup":"menu","aria-expanded":g,id:v,children:s.jsx(m,{size:"sm",src:a.avatar,fallbackText:a.name,showStatus:!!a.status,status:a.status})})})})});l.displayName="HeaderUserMenu";try{l.displayName="HeaderUserMenu",l.__docgenInfo={description:"",displayName:"HeaderUserMenu",props:{user:{defaultValue:{value:`{
        id: "default",
        name: "User",
        email: "",
        avatar: "",
        status: "offline",
      }`},description:"",name:"user",required:!1,type:{name:"HeaderUserInfo | undefined"}},items:{defaultValue:{value:"[]"},description:"",name:"items",required:!1,type:{name:"HeaderUserMenuItem[] | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},intent:{defaultValue:null,description:"Glass surface intent",name:"intent",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"warning"'},{value:'"success"'},{value:'"primary"'},{value:'"neutral"'},{value:'"danger"'},{value:'"info"'}]}},elevation:{defaultValue:null,description:"Glass surface elevation",name:"elevation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"level1"'},{value:'"level2"'},{value:'"level3"'},{value:'"level4"'}]}},tier:{defaultValue:null,description:"Performance tier",name:"tier",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"high"'},{value:'"medium"'},{value:'"low"'}]}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to respect motion preferences for animations",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},"aria-label":{defaultValue:null,description:"Accessible label for the menu",name:"aria-label",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"Test ID for testing",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const p={id:"user1",name:"Maya Chen",email:"maya.chen@example.com",avatar:"",status:"online"},R=[{id:"profile",label:"Profile",icon:"P"},{id:"settings",label:"Settings",icon:"S"},{id:"logout",label:"Logout",icon:"L",variant:"danger"}],F={title:"Navigation/Header User Menu",component:l,parameters:{layout:"fullscreen",previewSurface:"app",docs:{description:{component:"Header user menu trigger shown in realistic glass app headers."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"}},args:{user:p,items:R,className:""}},n={render:a=>s.jsx("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:16,boxSizing:"border-box"},children:s.jsxs("header",{className:"glass-flex glass-w-full glass-max-w-3xl glass-items-center glass-justify-between glass-gap-4 glass-rounded-2xl glass-p-4 glass-shadow-xl",style:{width:"100%",maxWidth:760,background:"rgba(255,255,255,0.86)",color:"#0f172a"},children:[s.jsxs("div",{className:"glass-min-w-0",children:[s.jsx("p",{className:"glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide",style:{color:"#475569"},children:"Account"}),s.jsx("h3",{className:"glass-text-lg glass-font-semibold",style:{color:"#0f172a"},children:"Workspace header"})]}),s.jsx(l,{...a})]})})},i={render:a=>s.jsx("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:16,boxSizing:"border-box"},children:s.jsx("div",{className:"glass-grid glass-w-full glass-max-w-4xl glass-grid-cols-1 glass-gap-4 sm:glass-grid-cols-3",style:{width:"100%",maxWidth:920},children:[{name:"Maya Chen",status:"online"},{name:"Noah Patel",status:"away"},{name:"Iris Stone",status:"busy"}].map(t=>s.jsxs("header",{className:"glass-flex glass-items-center glass-justify-between glass-rounded-2xl glass-p-4 glass-shadow-lg",style:{background:"rgba(255,255,255,0.86)",color:"#0f172a"},children:[s.jsx("span",{className:"glass-text-sm glass-font-medium",style:{color:"#0f172a"},children:t.name}),s.jsx(l,{...a,user:{...p,...t}})]},t.name))})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: 16,
    boxSizing: 'border-box'
  }}>
    <header className="glass-flex glass-w-full glass-max-w-3xl glass-items-center glass-justify-between glass-gap-4 glass-rounded-2xl glass-p-4 glass-shadow-xl" style={{
      width: '100%',
      maxWidth: 760,
      background: 'rgba(255,255,255,0.86)',
      color: '#0f172a'
    }}>
      <div className="glass-min-w-0">
        <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide" style={{
          color: '#475569'
        }}>
          Account
        </p>
        <h3 className="glass-text-lg glass-font-semibold" style={{
          color: '#0f172a'
        }}>Workspace header</h3>
      </div>
      <HeaderUserMenu {...args} />
    </header>
    </div>
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: 16,
    boxSizing: 'border-box'
  }}>
    <div className="glass-grid glass-w-full glass-max-w-4xl glass-grid-cols-1 glass-gap-4 sm:glass-grid-cols-3" style={{
      width: '100%',
      maxWidth: 920
    }}>
      {[{
        name: 'Maya Chen',
        status: 'online' as const
      }, {
        name: 'Noah Patel',
        status: 'away' as const
      }, {
        name: 'Iris Stone',
        status: 'busy' as const
      }].map(variantUser => <header key={variantUser.name} className="glass-flex glass-items-center glass-justify-between glass-rounded-2xl glass-p-4 glass-shadow-lg" style={{
        background: 'rgba(255,255,255,0.86)',
        color: '#0f172a'
      }}>
          <span className="glass-text-sm glass-font-medium" style={{
          color: '#0f172a'
        }}>{variantUser.name}</span>
          <HeaderUserMenu {...args} user={{
          ...user,
          ...variantUser
        }} />
        </header>)}
    </div>
    </div>
}`,...i.parameters?.docs?.source}}};const $=["Default","Variants"];export{n as Default,i as Variants,$ as __namedExportsOrder,F as default};
