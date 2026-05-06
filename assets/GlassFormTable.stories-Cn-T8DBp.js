import{j as e,c as a}from"./iframe-OZreUAtx.js";import{G as g}from"./GlassButton-6w9EY7YA.js";import{f as u}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXuO5XkR.js";import"./LiquidGlassMaterial-6ZsmKJqk.js";import"./LiquidGlassLayerProvider-D9koVs6n.js";import"./GlassPredictiveEngine-Hj8SU_hc.js";import"./GlassAchievementSystem-CfusDed6.js";import"./OptimizedGlassCore-DAQZMOh8.js";import"./GlassBiometricAdaptation-DaD9o7IG.js";import"./MotionPreferenceContext-DTxERmBA.js";import"./GlassEyeTracking-DEo0jGT7.js";import"./GlassSpatialAudio-C984SGkY.js";import"./MotionFramer-BTsVQK94.js";import"./utilsCore-B384u8by.js";import"./index-ByImX2pa.js";function d({columns:n,rows:h,onChange:c,className:f,"data-testid":x}){const p=n??[],t=h??[],y=(s,l,r)=>{const o=t.slice();o[s]={...o[s],[l]:r},c(o)},b=()=>c([...t,{}]),w=s=>c(t.filter((l,r)=>r!==s));return e.jsxs("div",{"data-glass-component":!0,className:a("glass-overflow-auto glass-radius-xl glass-border glass-border-white-15",f),"data-testid":x,role:"region","aria-label":"Editable data table",children:[e.jsxs("table",{className:a("glass-w-full glass-text-sm"),role:"table","aria-label":"Form data table",children:[e.jsx("thead",{className:a("glass-surface-white-5"),children:e.jsxs("tr",{role:"row",children:[p.map(s=>e.jsx("th",{role:"columnheader",className:a("glass-text-left glass-px-3 glass-py-2 glass-text-primary-70"),children:s.header},String(s.key))),e.jsx("th",{role:"columnheader",className:a("glass-px-3 glass-py-2"),"aria-label":"Actions",scope:"col",children:e.jsx("span",{className:"glass-sr-only",children:"Actions"})})]})}),e.jsx("tbody",{children:t.map((s,l)=>e.jsxs("tr",{role:"row",className:a("glass-border-t glass-border-white-10"),children:[p.map(r=>e.jsx("td",{role:"gridcell",className:a("glass-px-3 glass-py-2"),children:e.jsx("input",{className:a("glass-bg-transparent glass-border glass-border-white-20 glass-radius-md glass-px-2 glass-py-1 glass-w-full glass-focus glass-touch-target glass-contrast-guard"),value:String(s[r.key]??""),onChange:o=>y(l,r.key,o.target.value),"aria-label":`${r.header} for row ${l+1}`})},String(r.key))),e.jsx("td",{role:"gridcell",className:a("glass-px-3 glass-py-2 glass-text-right"),children:e.jsx(g,{size:"sm",variant:"ghost",onClick:r=>w(l),"aria-label":`Remove row ${l+1}`,children:"Remove"})})]},l))})]}),e.jsx("div",{className:a("glass-p-2"),children:e.jsx(g,{size:"sm",variant:"secondary",onClick:b,"aria-label":"Add new row",children:"Add Row"})})]})}try{d.displayName="GlassFormTable",d.__docgenInfo={description:"",displayName:"GlassFormTable",props:{columns:{defaultValue:null,description:"",name:"columns",required:!0,type:{name:"ColumnDef<T>[]"}},rows:{defaultValue:null,description:"",name:"rows",required:!0,type:{name:"T[]"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(rows: T[]) => void"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const D={title:"Components/Input/GlassFormTable",component:d,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformtable component."}}},argTypes:{},args:{}},m={args:{columns:[{key:"name",header:"Name"},{key:"email",header:"Email"},{key:"role",header:"Role"}],rows:[{name:"John Doe",email:"john@example.com",role:"Admin"},{name:"Jane Smith",email:"jane@example.com",role:"User"}],onChange:u()}},i={render:n=>e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:e.jsx(d,{...n})}),args:{columns:[{key:"name",header:"Name"},{key:"email",header:"Email"}],rows:[{name:"Alice Johnson",email:"alice@example.com",role:"User"}],onChange:u()}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    columns: [{
      key: 'name' as keyof User,
      header: 'Name'
    }, {
      key: 'email' as keyof User,
      header: 'Email'
    }, {
      key: 'role' as keyof User,
      header: 'Role'
    }],
    rows: [{
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin'
    }, {
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User'
    }],
    onChange: fn()
  }
}`,...m.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassFormTable {...args} />
    </div>,
  args: {
    columns: [{
      key: 'name' as keyof User,
      header: 'Name'
    }, {
      key: 'email' as keyof User,
      header: 'Email'
    }],
    rows: [{
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'User'
    }],
    onChange: fn()
  }
}`,...i.parameters?.docs?.source}}};const $=["Default","Variants"];export{m as Default,i as Variants,$ as __namedExportsOrder,D as default};
