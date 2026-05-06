import{r as u,j as t,c as p}from"./iframe-DpweptvF.js";import{L as c}from"./LiquidGlassControlGroup-D4SpMEaD.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-nIJf4szv.js";import"./LiquidGlassLayerProvider-DwkmVtLC.js";const l=u.forwardRef(({controls:s,placement:r="top-right",materialVariant:o="clear",className:i,...n},d)=>t.jsx("div",{ref:d,className:p("liquid-glass-map-controls glass-absolute glass-z-30",i),"data-liquid-glass-map-controls":"true","data-placement":r,...n,children:t.jsx(c,{orientation:"vertical",materialVariant:o,"aria-label":"Map controls",children:s.map(a=>t.jsx("button",{type:"button",disabled:a.disabled,"aria-label":a.label,className:"glass-radius-full glass-p-2",onClick:a.onClick,children:a.icon??a.label},a.id))})}));l.displayName="LiquidGlassMapControls";try{l.displayName="LiquidGlassMapControls",l.__docgenInfo={description:"",displayName:"LiquidGlassMapControls",props:{controls:{defaultValue:null,description:"",name:"controls",required:!0,type:{name:"LiquidGlassMapControl[]"}},placement:{defaultValue:{value:"top-right"},description:"",name:"placement",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"bottom-right"'},{value:'"bottom-left"'},{value:'"top-right"'},{value:'"top-left"'}]}},materialVariant:{defaultValue:{value:"clear"},description:"",name:"materialVariant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"regular"'},{value:'"clear"'}]}}}}}catch{}const q={title:"Interactive/LiquidGlassMapControls",component:l},e={args:{controls:[{id:"zoom-in",label:"+"},{id:"zoom-out",label:"-"}]}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    controls: [{
      id: "zoom-in",
      label: "+"
    }, {
      id: "zoom-out",
      label: "-"
    }]
  }
}`,...e.parameters?.docs?.source}}};const _=["Satellite"];export{e as Satellite,_ as __namedExportsOrder,q as default};
