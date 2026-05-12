import{r as _,R,j as s,c as y,g as $}from"./iframe-C_vLCgmV.js";import{u as S}from"./a11y-BbCUV6V2.js";import"./preload-helper-PPVm8Dsz.js";const v=$({intent:"neutral",elevation:"level2"}),l=_.forwardRef(({users:r=[],children:x,max:h=5,size:n="md",className:w,id:j,"aria-label":N,...A},G)=>{const C=S(j||"avatar-group"),a=n==="sm"?24:n==="lg"?40:32,c=n==="sm"?-8:n==="lg"?-12:-10,i=R.Children.toArray(x),o=i.length>0,g=r.slice(0,h),p=i.slice(0,h),d=o?i.length-p.length:r.length-g.length,b=o?i.length:r.length,f=o?p.length:g.length,I=`Group of ${b} users${d>0?`, showing ${f} of ${b}`:""}`;return s.jsxs("div",{"data-glass-component":!0,ref:G,id:C,className:y("glass-flex glass-items-center glass-justify-center glass-min-w-0",w),role:"group","aria-label":N||I,...A,children:[o?p.map((e,t)=>s.jsx("div",{className:"glass-relative",style:{marginLeft:t===0?0:c,zIndex:f-t},children:e},t)):g.map((e,t)=>s.jsxs("div",{className:"glass-relative",style:{marginLeft:t===0?0:c,zIndex:f-t},role:"img","aria-label":`${e.name}${e.status?` (${e.status})`:""}`,children:[e.avatar?s.jsx("img",{src:e.avatar,alt:e.name,width:a,height:a,className:"glass-radius-full glass-object-cover glass-border glass-border-white/20",style:{display:"block",width:a,height:a,borderRadius:9999,objectFit:"cover"}}):s.jsx("div",{className:"glass-radius-full glass-surface-subtle/10 glass-border glass-border-white/20 glass-flex glass-items-center glass-justify-center",style:{...v,width:a,height:a,borderRadius:9999,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255, 255, 255, 0.22)"},children:s.jsx("span",{className:"glass-text-xs glass-text-primary",style:{color:"rgba(248, 250, 252, 0.92)",fontSize:12,fontWeight:600},"aria-hidden":"true",children:e.name.charAt(0)})}),e.status&&s.jsx("span",{className:y("absolute -bottom-0.5 -right-0.5 w-3 h-3 glass-radius-full border-2 border-background",e.status==="online"?"bg-green-500":e.status==="away"?"bg-yellow-500":e.status==="busy"?"bg-red-500":"bg-slate-500"),style:{position:"absolute",right:-2,bottom:-2,width:12,height:12,borderRadius:9999},"aria-label":`Status: ${e.status}`,role:"img"})]},e.name+t)),d>0&&s.jsx("div",{className:"glass-radius-full glass-surface-subtle/10 glass-border glass-border-white/20 glass-flex glass-items-center glass-justify-center glass-ml--10px",style:{...v,width:a,height:a,marginLeft:c,borderRadius:9999,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255, 255, 255, 0.22)"},role:"img","aria-label":`${d} more users`,children:s.jsxs("span",{className:"glass-text-xs glass-text-primary","aria-hidden":"true",children:["+",d]})})]})});l.displayName="GlassAvatarGroup";try{l.displayName="GlassAvatarGroup",l.__docgenInfo={description:"",displayName:"GlassAvatarGroup",props:{users:{defaultValue:{value:"[]"},description:"",name:"users",required:!1,type:{name:"AvatarItem[] | undefined"}},max:{defaultValue:{value:"5"},description:"",name:"max",required:!1,type:{name:"number | undefined"}},size:{defaultValue:{value:"md"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},id:{defaultValue:null,description:"Custom ID",name:"id",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"Custom ARIA label",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}const z={title:"Effects + Advanced/Glass Avatar Group",component:l,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassavatargroup component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},m={args:{users:[{name:"Alice Johnson",status:"online"},{name:"Bob Smith",status:"away"},{name:"Carol Davis",status:"busy"},{name:"David Wilson",status:"offline"},{name:"Eve Brown",status:"online"},{name:"Frank Miller",status:"away"}],max:5,size:"md"}},u={render:r=>s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:s.jsx(l,{...r})}),args:{users:[{name:"User 1",status:"online"},{name:"User 2",status:"online"},{name:"User 3",status:"online"}],max:3,size:"sm"}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    users: [{
      name: 'Alice Johnson',
      status: 'online'
    }, {
      name: 'Bob Smith',
      status: 'away'
    }, {
      name: 'Carol Davis',
      status: 'busy'
    }, {
      name: 'David Wilson',
      status: 'offline'
    }, {
      name: 'Eve Brown',
      status: 'online'
    }, {
      name: 'Frank Miller',
      status: 'away'
    }],
    max: 5,
    size: 'md'
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassAvatarGroup {...args} />
    </div>,
  args: {
    users: [{
      name: 'User 1',
      status: 'online'
    }, {
      name: 'User 2',
      status: 'online'
    }, {
      name: 'User 3',
      status: 'online'
    }],
    max: 3,
    size: 'sm'
  }
}`,...u.parameters?.docs?.source}}};const E=["Default","Variants"];export{m as Default,u as Variants,E as __namedExportsOrder,z as default};
