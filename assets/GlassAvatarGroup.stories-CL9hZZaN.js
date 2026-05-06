import{r as w,h as N,j as s,c as d}from"./iframe-DpweptvF.js";import"./preload-helper-PPVm8Dsz.js";const t=w.forwardRef(({users:e,max:c=5,size:l="md",className:g,id:p,"aria-label":f,...h},x)=>{const v=N(p||"avatar-group"),r=l==="sm"?24:l==="lg"?40:32,b=l==="sm"?-8:l==="lg"?-12:-10,m=e.slice(0,c),n=e.length-m.length,y=`Group of ${e.length} users${n>0?`, showing ${m.length} of ${e.length}`:""}`;return s.jsxs("div",{"data-glass-component":!0,ref:x,id:v,className:d("flex items-center",g),role:"group","aria-label":f||y,...h,children:[m.map((a,u)=>s.jsxs("div",{className:"glass-relative",style:{marginLeft:u===0?0:b},role:"img","aria-label":`${a.name}${a.status?` (${a.status})`:""}`,children:[a.avatar?s.jsx("img",{src:a.avatar,alt:a.name,width:r,height:r,className:"glass-radius-full glass-object-cover glass-border glass-border-white/20"}):s.jsx("div",{className:"glass-radius-full glass-surface-subtle/10 glass-border glass-border-white/20 glass-flex glass-items-center glass-justify-center",style:{width:r,height:r},children:s.jsx("span",{className:"glass-text-xs glass-text-primary-glass-opacity-80","aria-hidden":"true",children:a.name.charAt(0)})}),a.status&&s.jsx("span",{className:d("absolute -bottom-0.5 -right-0.5 w-3 h-3 glass-radius-full border-2 border-background",a.status==="online"?"bg-green-500":a.status==="away"?"bg-yellow-500":a.status==="busy"?"bg-red-500":"bg-slate-500"),"aria-label":`Status: ${a.status}`,role:"img"})]},a.name+u)),n>0&&s.jsx("div",{className:"glass-radius-full glass-surface-subtle/10 glass-border glass-border-white/20 glass-flex glass-items-center glass-justify-center glass-ml--10px",style:{width:r,height:r},role:"img","aria-label":`${n} more users`,children:s.jsxs("span",{className:"glass-text-xs glass-text-primary-glass-opacity-80","aria-hidden":"true",children:["+",n]})})]})});t.displayName="GlassAvatarGroup";try{t.displayName="GlassAvatarGroup",t.__docgenInfo={description:"",displayName:"GlassAvatarGroup",props:{users:{defaultValue:null,description:"",name:"users",required:!0,type:{name:"AvatarItem[]"}},max:{defaultValue:{value:"5"},description:"",name:"max",required:!1,type:{name:"number | undefined"}},size:{defaultValue:{value:"md"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},id:{defaultValue:null,description:"Custom ID",name:"id",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"Custom ARIA label",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}const G={title:"Components/Interactive/GlassAvatarGroup",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassavatargroup component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},i={args:{users:[{name:"Alice Johnson",status:"online"},{name:"Bob Smith",status:"away"},{name:"Carol Davis",status:"busy"},{name:"David Wilson",status:"offline"},{name:"Eve Brown",status:"online"},{name:"Frank Miller",status:"away"}],max:5,size:"md"}},o={render:e=>s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:s.jsx(t,{...e})}),args:{users:[{name:"User 1",status:"online"},{name:"User 2",status:"online"},{name:"User 3",status:"online"}],max:3,size:"sm"}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};const _=["Default","Variants"];export{i as Default,o as Variants,_ as __namedExportsOrder,G as default};
