import{r as u,j as e,c as N}from"./iframe-C2Py7iTP.js";import{T as l}from"./ToggleButton-CCHvnKNz.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassAchievementSystem-DjbL6xVt.js";import"./OptimizedGlassCore-xEcyrF8U.js";import"./GlassBiometricAdaptation-A7cjmcue.js";import"./MotionPreferenceContext-DOVeBjOR.js";import"./GlassEyeTracking-CyJl1QCH.js";import"./GlassPredictiveEngine-ZsWyIufl.js";import"./GlassSpatialAudio-BXD-nyUP.js";import"./MotionFramer-Bqa_dH4n.js";import"./utilsCore-DHlzAtb4.js";const U=(n,i)=>N("inline-flex glass-radius-md",n==="vertical"?"flex-col":"flex-row",i?"w-full":"w-auto");function H(n,i){const{children:b,value:G,defaultValue:g,onChange:B,exclusive:c=!1,orientation:V="horizontal",className:q,style:z,glass:C=!1,glassVariant:w,blurStrength:M,color:_="primary",size:E="medium",fullWidth:S=!1,variant:L="outlined",...O}=n,[A,W]=u.useState(g!==void 0?c&&Array.isArray(g)?g[0]??null:g:null),x=G!==void 0,t=x?G:A,I=u.useCallback((o,r)=>{o.stopPropagation();let s;if(c)s=t===r?null:r;else{const d=Array.isArray(t)?t:t?[t]:[];d.includes(r)?(s=d.filter(y=>y!==r),(s?.length||0)===0&&(s=null)):s=[...d,r]}x||W(s),B&&B(o,s)},[t,c,x,B]),k=u.Children.count(b),P=u.Children.map(b,(o,r)=>{if(!u.isValidElement(o))return o;const s=r===0,d=r===k-1,y=c?o.props?.value===t:Array.isArray(t)?t.includes(o.props?.value):o.props?.value===t,D={color:_,size:E,fullWidth:S,variant:L,glass:C,glassVariant:w,blurStrength:M,selected:y,onChange:I,grouped:!0,groupOrientation:V,isGroupStart:s,isGroupEnd:d};return u.cloneElement(o,D)}),R=U(V,S);return e.jsx("div",{"data-glass-component":!0,ref:i,role:"group",className:N(R,q),style:{...z||{}},...O,children:P})}const a=u.forwardRef(H),j=u.forwardRef((n,i)=>e.jsx(a,{...n,glass:!0,ref:i}));j.displayName="GlassToggleButtonGroup";try{a.displayName="ToggleButtonGroup",a.__docgenInfo={description:`ToggleButtonGroup Component

A group of toggle buttons.`,displayName:"ToggleButtonGroup",props:{value:{defaultValue:null,description:"",name:"value",required:!1,type:{name:"string | number | (string | number)[] | undefined"}},defaultValue:{defaultValue:null,description:"",name:"defaultValue",required:!1,type:{name:"string | number | (string | number)[] | undefined"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((event: MouseEvent<HTMLButtonElement, MouseEvent>, value: string | number | (string | number)[]) => void) | undefined"}},exclusive:{defaultValue:null,description:"",name:"exclusive",required:!1,type:{name:"boolean | undefined"}},orientation:{defaultValue:null,description:"",name:"orientation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"horizontal"'},{value:'"vertical"'}]}},size:{defaultValue:null,description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},variant:{defaultValue:null,description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"primary"'},{value:'"default"'},{value:'"outlined"'},{value:'"secondary"'}]}},glass:{defaultValue:null,description:"",name:"glass",required:!1,type:{name:"boolean | undefined"}},color:{defaultValue:null,description:"",name:"color",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"primary"'},{value:'"success"'},{value:'"warning"'},{value:'"info"'},{value:'"error"'},{value:'"secondary"'}]}},fullWidth:{defaultValue:null,description:"",name:"fullWidth",required:!1,type:{name:"boolean | undefined"}},glassVariant:{defaultValue:null,description:"",name:"glassVariant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"clear"'},{value:'"dynamic"'},{value:'"frosted"'},{value:'"tinted"'},{value:'"luminous"'}]}},blurStrength:{defaultValue:null,description:"",name:"blurStrength",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"standard"'},{value:'"none"'},{value:'"light"'},{value:'"heavy"'}]}}}}}catch{}try{j.displayName="GlassToggleButtonGroup",j.__docgenInfo={description:`GlassToggleButtonGroup Component

Glass variant of the ToggleButtonGroup component.`,displayName:"GlassToggleButtonGroup",props:{value:{defaultValue:null,description:"",name:"value",required:!1,type:{name:"string | number | (string | number)[] | undefined"}},defaultValue:{defaultValue:null,description:"",name:"defaultValue",required:!1,type:{name:"string | number | (string | number)[] | undefined"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((event: MouseEvent<HTMLButtonElement, MouseEvent>, value: string | number | (string | number)[]) => void) | undefined"}},exclusive:{defaultValue:null,description:"",name:"exclusive",required:!1,type:{name:"boolean | undefined"}},orientation:{defaultValue:null,description:"",name:"orientation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"horizontal"'},{value:'"vertical"'}]}},size:{defaultValue:null,description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},variant:{defaultValue:null,description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"primary"'},{value:'"default"'},{value:'"outlined"'},{value:'"secondary"'}]}},glass:{defaultValue:null,description:"",name:"glass",required:!1,type:{name:"boolean | undefined"}},color:{defaultValue:null,description:"",name:"color",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"primary"'},{value:'"success"'},{value:'"warning"'},{value:'"info"'},{value:'"error"'},{value:'"secondary"'}]}},fullWidth:{defaultValue:null,description:"",name:"fullWidth",required:!1,type:{name:"boolean | undefined"}},glassVariant:{defaultValue:null,description:"",name:"glassVariant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"clear"'},{value:'"dynamic"'},{value:'"frosted"'},{value:'"tinted"'},{value:'"luminous"'}]}},blurStrength:{defaultValue:null,description:"",name:"blurStrength",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"standard"'},{value:'"none"'},{value:'"light"'},{value:'"heavy"'}]}}}}}catch{}const te={title:"Components/Toggle-button/ToggleButtonGroup",component:a,parameters:{layout:"centered",docs:{description:{component:"A group of toggle buttons with glassmorphism styling and coordinated selection behavior."}}},argTypes:{exclusive:{control:"boolean",description:"Whether only one button can be selected at a time"},orientation:{control:{type:"select"},options:["horizontal","vertical"],description:"Layout orientation"},size:{control:{type:"select"},options:["sm","md","lg","medium"],description:"Size of buttons in the group"},variant:{control:{type:"select"},options:["default","primary","secondary","outlined"],description:"Visual variant"},color:{control:{type:"select"},options:["primary","secondary","success","warning","error","info"],description:"Color theme"},glass:{control:"boolean",description:"Enable glassmorphism effect"},glassVariant:{control:{type:"select"},options:["frosted","dynamic","clear","tinted","luminous"],description:"Glass styling variant"},fullWidth:{control:"boolean",description:"Make the group full width"},className:{control:"text",description:"Additional CSS classes"}},args:{exclusive:!0,orientation:"horizontal",size:"md",variant:"default",color:"primary",glass:!0,glassVariant:"frosted",fullWidth:!1}},m={render:n=>e.jsxs(a,{...n,children:[e.jsx(l,{value:"bold",children:"Bold"}),e.jsx(l,{value:"italic",children:"Italic"}),e.jsx(l,{value:"underline",children:"Underline"})]})},v={render:n=>e.jsxs(a,{...n,exclusive:!0,children:[e.jsx(l,{value:"left",children:"Left"}),e.jsx(l,{value:"center",children:"Center"}),e.jsx(l,{value:"right",children:"Right"})]}),args:{exclusive:!0}},p={render:n=>e.jsxs(a,{...n,exclusive:!1,children:[e.jsx(l,{value:"bold",children:"Bold"}),e.jsx(l,{value:"italic",children:"Italic"}),e.jsx(l,{value:"underline",children:"Underline"}),e.jsx(l,{value:"strikethrough",children:"Strike"})]}),args:{exclusive:!1}},f={render:n=>e.jsxs(a,{...n,orientation:"vertical",children:[e.jsx(l,{value:"top",children:"Top"}),e.jsx(l,{value:"middle",children:"Middle"}),e.jsx(l,{value:"bottom",children:"Bottom"})]}),args:{orientation:"vertical"}},h={render:n=>e.jsxs("div",{className:"glass-gap-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Default"}),e.jsxs(a,{...n,variant:"default",children:[e.jsx(l,{value:"1",children:"One"}),e.jsx(l,{value:"2",children:"Two"}),e.jsx(l,{value:"3",children:"Three"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Primary"}),e.jsxs(a,{...n,variant:"primary",children:[e.jsx(l,{value:"1",children:"One"}),e.jsx(l,{value:"2",children:"Two"}),e.jsx(l,{value:"3",children:"Three"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Secondary"}),e.jsxs(a,{...n,variant:"secondary",children:[e.jsx(l,{value:"1",children:"One"}),e.jsx(l,{value:"2",children:"Two"}),e.jsx(l,{value:"3",children:"Three"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Outlined"}),e.jsxs(a,{...n,variant:"outlined",children:[e.jsx(l,{value:"1",children:"One"}),e.jsx(l,{value:"2",children:"Two"}),e.jsx(l,{value:"3",children:"Three"})]})]})]})},T={render:n=>e.jsxs("div",{className:"glass-gap-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Small"}),e.jsxs(a,{...n,size:"sm",children:[e.jsx(l,{value:"s",children:"Small"}),e.jsx(l,{value:"m",children:"Medium"}),e.jsx(l,{value:"l",children:"Large"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Medium"}),e.jsxs(a,{...n,size:"md",children:[e.jsx(l,{value:"s",children:"Small"}),e.jsx(l,{value:"m",children:"Medium"}),e.jsx(l,{value:"l",children:"Large"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Large"}),e.jsxs(a,{...n,size:"lg",children:[e.jsx(l,{value:"s",children:"Small"}),e.jsx(l,{value:"m",children:"Medium"}),e.jsx(l,{value:"l",children:"Large"})]})]})]})};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <ToggleButtonGroup {...args}>
      <ToggleButton value="bold">Bold</ToggleButton>
      <ToggleButton value="italic">Italic</ToggleButton>
      <ToggleButton value="underline">Underline</ToggleButton>
    </ToggleButtonGroup>
}`,...m.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <ToggleButtonGroup {...args} exclusive={true}>
      <ToggleButton value="left">Left</ToggleButton>
      <ToggleButton value="center">Center</ToggleButton>
      <ToggleButton value="right">Right</ToggleButton>
    </ToggleButtonGroup>,
  args: {
    exclusive: true
  }
}`,...v.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <ToggleButtonGroup {...args} exclusive={false}>
      <ToggleButton value="bold">Bold</ToggleButton>
      <ToggleButton value="italic">Italic</ToggleButton>
      <ToggleButton value="underline">Underline</ToggleButton>
      <ToggleButton value="strikethrough">Strike</ToggleButton>
    </ToggleButtonGroup>,
  args: {
    exclusive: false
  }
}`,...p.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <ToggleButtonGroup {...args} orientation="vertical">
      <ToggleButton value="top">Top</ToggleButton>
      <ToggleButton value="middle">Middle</ToggleButton>
      <ToggleButton value="bottom">Bottom</ToggleButton>
    </ToggleButtonGroup>,
  args: {
    orientation: 'vertical'
  }
}`,...f.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="glass-gap-4">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Default</h4>
        <ToggleButtonGroup {...args} variant="default">
          <ToggleButton value="1">One</ToggleButton>
          <ToggleButton value="2">Two</ToggleButton>
          <ToggleButton value="3">Three</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Primary</h4>
        <ToggleButtonGroup {...args} variant="primary">
          <ToggleButton value="1">One</ToggleButton>
          <ToggleButton value="2">Two</ToggleButton>
          <ToggleButton value="3">Three</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Secondary</h4>
        <ToggleButtonGroup {...args} variant="secondary">
          <ToggleButton value="1">One</ToggleButton>
          <ToggleButton value="2">Two</ToggleButton>
          <ToggleButton value="3">Three</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Outlined</h4>
        <ToggleButtonGroup {...args} variant="outlined">
          <ToggleButton value="1">One</ToggleButton>
          <ToggleButton value="2">Two</ToggleButton>
          <ToggleButton value="3">Three</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
}`,...h.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="glass-gap-4">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Small</h4>
        <ToggleButtonGroup {...args} size="sm">
          <ToggleButton value="s">Small</ToggleButton>
          <ToggleButton value="m">Medium</ToggleButton>
          <ToggleButton value="l">Large</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Medium</h4>
        <ToggleButtonGroup {...args} size="md">
          <ToggleButton value="s">Small</ToggleButton>
          <ToggleButton value="m">Medium</ToggleButton>
          <ToggleButton value="l">Large</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Large</h4>
        <ToggleButtonGroup {...args} size="lg">
          <ToggleButton value="s">Small</ToggleButton>
          <ToggleButton value="m">Medium</ToggleButton>
          <ToggleButton value="l">Large</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
}`,...T.parameters?.docs?.source}}};const oe=["Default","Exclusive","Multiple","Vertical","Variants","Sizes"];export{m as Default,v as Exclusive,p as Multiple,T as Sizes,h as Variants,f as Vertical,oe as __namedExportsOrder,te as default};
