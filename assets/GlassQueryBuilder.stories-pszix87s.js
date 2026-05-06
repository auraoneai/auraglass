import{j as e,c as G}from"./iframe-mbNquNNc.js";import{G as c}from"./GlassButton-Dj39LQ52.js";import{a as u,b as m,c as p,d as g,e as o}from"./GlassSelectCompound-BqKISElS.js";import{f as y}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-vu3jGQGZ.js";import"./LiquidGlassMaterial-D9GzyZBz.js";import"./LiquidGlassLayerProvider-DsdConQJ.js";import"./GlassPredictiveEngine-D3b8OhcD.js";import"./GlassAchievementSystem-BuLAT0VQ.js";import"./OptimizedGlassCore-CPvpl-y1.js";import"./GlassBiometricAdaptation-Cvck8KpT.js";import"./MotionPreferenceContext-BfJvNZar.js";import"./GlassEyeTracking-jVjspFjL.js";import"./GlassSpatialAudio-CRCXq6J3.js";import"./MotionFramer-BekP4wEp.js";import"./utilsCore-CTDrFk4s.js";import"./index-BR42oJqw.js";import"./index-DEBUAgt2.js";import"./index-CWG1rEj-.js";import"./Combination-DoFZuw-b.js";import"./chevron-down-D_UdBln2.js";import"./createLucideIcon-CpanR7Fq.js";import"./check-C_-ChHE1.js";import"./chevron-up-UhyIM9eY.js";import"./index-ByImX2pa.js";function S(s){return!!(s&&typeof s=="object"&&Array.isArray(s.rules))}const x=s=>typeof s=="string"||typeof s=="number"?String(s):"";function f({fields:s=[],value:n={combinator:"AND",rules:[]},onChange:N=()=>{},className:j,"data-testid":A}){const i=l=>N({...l}),C=(l,r,t)=>{const d=s.find(a=>a.id===l.field)||s[0];return e.jsxs("div",{"data-glass-component":!0,className:"glass-flex glass-items-center glass-gap-2",children:[e.jsxs(u,{value:l.field,onValueChange:a=>{l.field=a,i(n)},children:[e.jsx(m,{className:"glass-w-40 glass-h-8 glass-text-sm","aria-label":"Select field",children:e.jsx(p,{placeholder:"Field"})}),e.jsx(g,{children:s.map(a=>e.jsx(o,{value:a.id,children:a.label},a.id))})]}),e.jsxs(u,{value:l.op,onValueChange:a=>{l.op=a,i(n)},children:[e.jsx(m,{className:"glass-w-28 glass-h-8 glass-text-sm","aria-label":"Select operator",children:e.jsx(p,{placeholder:"Op"})}),e.jsx(g,{children:["=","!=",">",">=","<","<=","contains"].map(a=>e.jsx(o,{value:a,children:a},a))})]}),d.type==="select"?e.jsxs(u,{value:x(l.value),onValueChange:a=>{const D=a==="__clear__"?"":a;l.value=D,i(n)},children:[e.jsx(m,{className:"glass-w-48 glass-h-8 glass-text-sm","aria-label":"Select value",children:e.jsx(p,{placeholder:"Value"})}),e.jsxs(g,{children:[e.jsx(o,{value:"__clear__",children:"—"}),d.options?.map(a=>e.jsx(o,{value:a.value,children:a.label},a.value))]})]}):e.jsx("input",{value:x(l.value),onChange:a=>{l.value=a.target.value,i(n)},className:"glass-bg-transparent glass-border glass-border-white/20 glass-radius-md glass-px-2 glass-py-1 glass-text-sm glass-focus glass-touch-target glass-contrast-guard"}),e.jsx(c,{size:"sm",variant:"ghost",onClick:a=>{t.rules.splice(r,1),i(n)},children:"Remove"})]},r)},h=(l,r)=>e.jsxs("div",{className:"glass-radius-xl glass-border glass-border-white/20 glass-p-3 glass-gap-2",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsxs(u,{value:l.combinator,onValueChange:t=>{l.combinator=t,i(n)},children:[e.jsx(m,{className:"glass-w-24 glass-h-8 glass-text-sm","aria-label":"Select combinator (AND/OR)",children:e.jsx(p,{})}),e.jsxs(g,{children:[e.jsx(o,{value:"AND",children:"AND"}),e.jsx(o,{value:"OR",children:"OR"})]})]}),e.jsx(c,{size:"sm",variant:"secondary",onClick:t=>{l.rules.push({field:s[0].id,op:"=",value:""}),i(n)},children:"+ Rule"}),e.jsx(c,{size:"sm",variant:"ghost",onClick:t=>{l.rules.push({combinator:"AND",rules:[]}),i(n)},children:"+ Group"}),r&&e.jsx(c,{size:"sm",variant:"ghost",onClick:t=>{r.rules.splice(r.rules.indexOf(l),1),i(n)},children:"Remove"})]}),e.jsx("div",{className:"glass-gap-2",children:l.rules.map((t,d)=>S(t)?e.jsx("div",{children:h(t,l)},d):C(t,d,l))})]});return e.jsx("div",{className:G("glass-gap-2",j),"data-testid":A,role:"group","aria-label":"Query builder",children:h(n)})}try{f.displayName="GlassQueryBuilder",f.__docgenInfo={description:"",displayName:"GlassQueryBuilder",props:{fields:{defaultValue:{value:"[]"},description:"",name:"fields",required:!1,type:{name:"FieldDef[] | undefined"}},value:{defaultValue:{value:'{ combinator: "AND", rules: [] }'},description:"",name:"value",required:!1,type:{name:"RuleGroup | undefined"}},onChange:{defaultValue:{value:"() => {}"},description:"",name:"onChange",required:!1,type:{name:"((v: RuleGroup) => void) | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"Custom data-testid for testing",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const ee={title:"Components/Interactive/GlassQueryBuilder",component:f,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassquerybuilder component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"}},args:{className:""}},v={args:{fields:[{id:"name",label:"Name",type:"text"},{id:"age",label:"Age",type:"number"},{id:"status",label:"Status",type:"select",options:[{label:"Active",value:"active"},{label:"Inactive",value:"inactive"},{label:"Pending",value:"pending"}]},{id:"department",label:"Department",type:"select",options:[{label:"Engineering",value:"eng"},{label:"Marketing",value:"marketing"},{label:"Sales",value:"sales"}]}],value:{combinator:"AND",rules:[{field:"name",op:"contains",value:"John"},{field:"status",op:"=",value:"active"}]},onChange:y()}},b={args:{fields:[{id:"firstName",label:"First Name",type:"text"},{id:"lastName",label:"Last Name",type:"text"},{id:"email",label:"Email",type:"text"},{id:"role",label:"Role",type:"select",options:[{label:"Admin",value:"admin"},{label:"User",value:"user"},{label:"Guest",value:"guest"}]},{id:"createdAt",label:"Created Date",type:"text"},{id:"isActive",label:"Active",type:"select",options:[{label:"Yes",value:"true"},{label:"No",value:"false"}]}],value:{combinator:"OR",rules:[{combinator:"AND",rules:[{field:"role",op:"=",value:"admin"},{field:"isActive",op:"=",value:"true"}]},{combinator:"AND",rules:[{field:"email",op:"contains",value:"@company.com"},{field:"createdAt",op:">",value:"2023-01-01"}]}]},onChange:y()}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    fields: [{
      id: 'name',
      label: 'Name',
      type: 'text'
    }, {
      id: 'age',
      label: 'Age',
      type: 'number'
    }, {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [{
        label: 'Active',
        value: 'active'
      }, {
        label: 'Inactive',
        value: 'inactive'
      }, {
        label: 'Pending',
        value: 'pending'
      }]
    }, {
      id: 'department',
      label: 'Department',
      type: 'select',
      options: [{
        label: 'Engineering',
        value: 'eng'
      }, {
        label: 'Marketing',
        value: 'marketing'
      }, {
        label: 'Sales',
        value: 'sales'
      }]
    }],
    value: {
      combinator: 'AND',
      rules: [{
        field: 'name',
        op: 'contains',
        value: 'John'
      }, {
        field: 'status',
        op: '=',
        value: 'active'
      }]
    },
    onChange: fn()
  }
}`,...v.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    fields: [{
      id: 'firstName',
      label: 'First Name',
      type: 'text'
    }, {
      id: 'lastName',
      label: 'Last Name',
      type: 'text'
    }, {
      id: 'email',
      label: 'Email',
      type: 'text'
    }, {
      id: 'role',
      label: 'Role',
      type: 'select',
      options: [{
        label: 'Admin',
        value: 'admin'
      }, {
        label: 'User',
        value: 'user'
      }, {
        label: 'Guest',
        value: 'guest'
      }]
    }, {
      id: 'createdAt',
      label: 'Created Date',
      type: 'text'
    }, {
      id: 'isActive',
      label: 'Active',
      type: 'select',
      options: [{
        label: 'Yes',
        value: 'true'
      }, {
        label: 'No',
        value: 'false'
      }]
    }],
    value: {
      combinator: 'OR',
      rules: [{
        combinator: 'AND',
        rules: [{
          field: 'role',
          op: '=',
          value: 'admin'
        }, {
          field: 'isActive',
          op: '=',
          value: 'true'
        }]
      }, {
        combinator: 'AND',
        rules: [{
          field: 'email',
          op: 'contains',
          value: '@company.com'
        }, {
          field: 'createdAt',
          op: '>',
          value: '2023-01-01'
        }]
      }]
    },
    onChange: fn()
  }
}`,...b.parameters?.docs?.source}}};const ae=["Default","ComplexQuery"];export{b as ComplexQuery,v as Default,ae as __namedExportsOrder,ee as default};
