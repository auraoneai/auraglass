import{j as e,c as S}from"./iframe-DFMMcocb.js";import{G as c}from"./GlassButton-XgI0pEAb.js";import{a as u,b as m,c as p,d as g,e as o}from"./GlassSelectCompound-CNwF7EUb.js";import{f as y}from"./index-DdjpOZjl.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-D8CGevp8.js";import"./LiquidGlassLayerProvider-B-mIHSJM.js";import"./a11y-Q0mX7KvA.js";import"./GlassPredictiveEngine-D_3E50m3.js";import"./GlassAchievementSystem-BqTd0FRN.js";import"./OptimizedGlassCore-1D6AE-uZ.js";import"./deviceCapabilities-iDxBLJQX.js";import"./GlassBiometricAdaptation-CNYoTdw5.js";import"./MotionPreferenceContext-VYRcsRrk.js";import"./GlassEyeTracking-DFVitI9H.js";import"./GlassSpatialAudio-BRwfDyUV.js";import"./MotionFramer-Cvto7X39.js";import"./utilsCore-D5Hayjvj.js";import"./components-Ue9Uo88O.js";import"./Positioner-BSNF7ASG.js";import"./DismissableLayer-NGCrAxdI.js";import"./Portal-iPLyP925.js";import"./index-DzLM6mV3.js";import"./index-TTwV6w3V.js";import"./index-CWG1rEj-.js";import"./index-ByImX2pa.js";function D(l){return!!(l&&typeof l=="object"&&Array.isArray(l.rules))}const h=l=>typeof l=="string"||typeof l=="number"?String(l):"";function x({fields:l=[],value:n={combinator:"AND",rules:[]},onChange:N=()=>{},className:j,"data-testid":A}){const i=s=>N({...s}),C=(s,r,t)=>{const d=l.find(a=>a.id===s.field)||l[0];return e.jsxs("div",{"data-glass-component":!0,className:"glass-flex glass-flex-wrap glass-items-center glass-gap-2",children:[e.jsxs(u,{value:s.field,onValueChange:a=>{s.field=a,i(n)},children:[e.jsx(m,{className:"glass-w-40 glass-h-8 glass-text-sm","aria-label":"Select field",children:e.jsx(p,{placeholder:"Field"})}),e.jsx(g,{children:l.map(a=>e.jsx(o,{value:a.id,children:a.label},a.id))})]}),e.jsxs(u,{value:s.op,onValueChange:a=>{s.op=a,i(n)},children:[e.jsx(m,{className:"glass-w-28 glass-h-8 glass-text-sm","aria-label":"Select operator",children:e.jsx(p,{placeholder:"Op"})}),e.jsx(g,{children:["=","!=",">",">=","<","<=","contains"].map(a=>e.jsx(o,{value:a,children:a},a))})]}),d.type==="select"?e.jsxs(u,{value:h(s.value),onValueChange:a=>{const w=a==="__clear__"?"":a;s.value=w,i(n)},children:[e.jsx(m,{className:"glass-w-48 glass-h-8 glass-text-sm","aria-label":"Select value",children:e.jsx(p,{placeholder:"Value"})}),e.jsxs(g,{children:[e.jsx(o,{value:"__clear__",children:"—"}),d.options?.map(a=>e.jsx(o,{value:a.value,children:a.label},a.value))]})]}):e.jsx("input",{value:h(s.value),onChange:a=>{s.value=a.target.value,i(n)},className:"glass-min-w-0 glass-flex-1 glass-bg-white/10 glass-border glass-border-white/35 glass-radius-md glass-px-2 glass-py-1 glass-text-sm glass-text-white glass-placeholder-white/70 glass-focus glass-touch-target glass-contrast-guard"}),e.jsx(c,{size:"sm",variant:"ghost",onClick:a=>{t.rules.splice(r,1),i(n)},className:"glass-text-primary hover:glass-text-secondary",children:"Remove"})]},r)},f=(s,r)=>e.jsxs("div",{className:"glass-radius-xl glass-border glass-border-white/25 glass-bg-white/10 glass-backdrop-blur-md glass-p-3 glass-space-y-3 glass-text-white glass-contrast-guard",children:[e.jsxs("div",{className:"glass-flex glass-flex-wrap glass-items-center glass-gap-2",children:[e.jsxs(u,{value:s.combinator,onValueChange:t=>{s.combinator=t,i(n)},children:[e.jsx(m,{className:"glass-w-24 glass-h-8 glass-text-sm","aria-label":"Select combinator (AND/OR)",children:e.jsx(p,{})}),e.jsxs(g,{children:[e.jsx(o,{value:"AND",children:"AND"}),e.jsx(o,{value:"OR",children:"OR"})]})]}),e.jsx(c,{size:"sm",variant:"secondary",onClick:t=>{s.rules.push({field:l[0].id,op:"=",value:""}),i(n)},children:"+ Rule"}),e.jsx(c,{size:"sm",variant:"ghost",onClick:t=>{s.rules.push({combinator:"AND",rules:[]}),i(n)},className:"glass-text-primary hover:glass-text-secondary",children:"+ Group"}),r&&e.jsx(c,{size:"sm",variant:"ghost",onClick:t=>{r.rules.splice(r.rules.indexOf(s),1),i(n)},className:"glass-text-primary hover:glass-text-secondary",children:"Remove"})]}),e.jsx("div",{className:"glass-space-y-2",children:s.rules.map((t,d)=>D(t)?e.jsx("div",{children:f(t,s)},d):C(t,d,s))})]});return e.jsx("div",{className:S("glass-w-full glass-max-w-3xl glass-space-y-2 glass-text-white",j),"data-testid":A,role:"group","aria-label":"Query builder",children:f(n)})}try{x.displayName="GlassQueryBuilder",x.__docgenInfo={description:"",displayName:"GlassQueryBuilder",props:{fields:{defaultValue:{value:"[]"},description:"",name:"fields",required:!1,type:{name:"FieldDef[] | undefined"}},value:{defaultValue:{value:'{ combinator: "AND", rules: [] }'},description:"",name:"value",required:!1,type:{name:"RuleGroup | undefined"}},onChange:{defaultValue:{value:"() => {}"},description:"",name:"onChange",required:!1,type:{name:"((v: RuleGroup) => void) | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"Custom data-testid for testing",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const ee={title:"Workflows/Glass Query Builder",component:x,parameters:{layout:"fullscreen",previewSurface:"app",docs:{description:{component:"A glass morphism glassquerybuilder component."}}},decorators:[l=>e.jsx("div",{className:"glass-flex glass-min-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8",style:{boxSizing:"border-box"},children:e.jsx(l,{})})],argTypes:{className:{control:"text",description:"Additional CSS classes"}},args:{className:""}},v={args:{fields:[{id:"name",label:"Name",type:"text"},{id:"age",label:"Age",type:"number"},{id:"status",label:"Status",type:"select",options:[{label:"Active",value:"active"},{label:"Inactive",value:"inactive"},{label:"Pending",value:"pending"}]},{id:"department",label:"Department",type:"select",options:[{label:"Engineering",value:"eng"},{label:"Marketing",value:"marketing"},{label:"Sales",value:"sales"}]}],value:{combinator:"AND",rules:[{field:"name",op:"contains",value:"John"},{field:"status",op:"=",value:"active"}]},onChange:y()}},b={args:{fields:[{id:"firstName",label:"First Name",type:"text"},{id:"lastName",label:"Last Name",type:"text"},{id:"email",label:"Email",type:"text"},{id:"role",label:"Role",type:"select",options:[{label:"Admin",value:"admin"},{label:"User",value:"user"},{label:"Guest",value:"guest"}]},{id:"createdAt",label:"Created Date",type:"text"},{id:"isActive",label:"Active",type:"select",options:[{label:"Yes",value:"true"},{label:"No",value:"false"}]}],value:{combinator:"OR",rules:[{combinator:"AND",rules:[{field:"role",op:"=",value:"admin"},{field:"isActive",op:"=",value:"true"}]},{combinator:"AND",rules:[{field:"email",op:"contains",value:"@company.com"},{field:"createdAt",op:">",value:"2023-01-01"}]}]},onChange:y()}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
