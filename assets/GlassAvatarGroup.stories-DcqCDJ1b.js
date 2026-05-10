import{r as w,j as a,c as d}from"./iframe-DinEdlu4.js";import{u as N}from"./a11y-BZVU29oS.js";import"./preload-helper-PPVm8Dsz.js";const t=w.forwardRef(({users:e,max:c=5,size:l="md",className:g,id:p,"aria-label":f,...h},x)=>{const v=N(p||"avatar-group"),r=l==="sm"?24:l==="lg"?40:32,b=l==="sm"?-8:l==="lg"?-12:-10,m=e.slice(0,c),n=e.length-m.length,y=`Group of ${e.length} users${n>0?`, showing ${m.length} of ${e.length}`:""}`;return a.jsxs("div",{"data-glass-component":!0,ref:x,id:v,className:d("glass-flex glass-items-center glass-justify-center glass-min-w-0",g),role:"group","aria-label":f||y,...h,children:[m.map((s,u)=>a.jsxs("div",{className:"glass-relative",style:{marginLeft:u===0?0:b},role:"img","aria-label":`${s.name}${s.status?` (${s.status})`:""}`,children:[s.avatar?a.jsx("img",{src:s.avatar,alt:s.name,width:r,height:r,className:"glass-radius-full glass-object-cover glass-border glass-border-white/20",style:{display:"block"}}):a.jsx("div",{className:"glass-radius-full glass-surface-subtle/10 glass-border glass-border-white/20 glass-flex glass-items-center glass-justify-center",style:{width:r,height:r},children:a.jsx("span",{className:"glass-text-xs glass-text-primary","aria-hidden":"true",children:s.name.charAt(0)})}),s.status&&a.jsx("span",{className:d("absolute -bottom-0.5 -right-0.5 w-3 h-3 glass-radius-full border-2 border-background",s.status==="online"?"bg-green-500":s.status==="away"?"bg-yellow-500":s.status==="busy"?"bg-red-500":"bg-slate-500"),"aria-label":`Status: ${s.status}`,role:"img"})]},s.name+u)),n>0&&a.jsx("div",{className:"glass-radius-full glass-surface-subtle/10 glass-border glass-border-white/20 glass-flex glass-items-center glass-justify-center glass-ml--10px",style:{width:r,height:r},role:"img","aria-label":`${n} more users`,children:a.jsxs("span",{className:"glass-text-xs glass-text-primary","aria-hidden":"true",children:["+",n]})})]})});t.displayName="GlassAvatarGroup";try{t.displayName="GlassAvatarGroup",t.__docgenInfo={description:"",displayName:"GlassAvatarGroup",props:{users:{defaultValue:null,description:"",name:"users",required:!0,type:{name:"AvatarItem[]"}},max:{defaultValue:{value:"5"},description:"",name:"max",required:!1,type:{name:"number | undefined"}},size:{defaultValue:{value:"md"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},id:{defaultValue:null,description:"Custom ID",name:"id",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"Custom ARIA label",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}const _={title:"Effects + Advanced/Glass Avatar Group",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassavatargroup component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},i={args:{users:[{name:"Alice Johnson",status:"online"},{name:"Bob Smith",status:"away"},{name:"Carol Davis",status:"busy"},{name:"David Wilson",status:"offline"},{name:"Eve Brown",status:"online"},{name:"Frank Miller",status:"away"}],max:5,size:"md"}},o={render:e=>a.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:a.jsx(t,{...e})}),args:{users:[{name:"User 1",status:"online"},{name:"User 2",status:"online"},{name:"User 3",status:"online"}],max:3,size:"sm"}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};const $=["Default","Variants"];export{i as Default,o as Variants,$ as __namedExportsOrder,_ as default};
