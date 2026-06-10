import{r as w,j as u,c as z}from"./iframe-CYOgkXcw.js";/* empty css                  */import"./preload-helper-PPVm8Dsz.js";function T(a){return typeof a=="number"?`${a}px`:a}const l=w.forwardRef(({size:a="18rem",palette:m="aurora",pulse:p=!0,glow:g="medium",interactive:i=!1,tiltX:d=0,tiltY:c=0,className:f,style:y,children:v,...t},b)=>{const x=e=>{if(i){const r=e.currentTarget.getBoundingClientRect();if(r.width<=0||r.height<=0){t.onPointerMove?.(e);return}const h=((e.clientX-r.left)/r.width-.5)*12,P=((e.clientY-r.top)/r.height-.5)*-12;e.currentTarget.style.setProperty("--ag-tilt-y",`${h.toFixed(2)}deg`),e.currentTarget.style.setProperty("--ag-tilt-x",`${P.toFixed(2)}deg`)}t.onPointerMove?.(e)},_=e=>{i&&(e.currentTarget.style.setProperty("--ag-tilt-x",`${d}deg`),e.currentTarget.style.setProperty("--ag-tilt-y",`${c}deg`)),t.onPointerLeave?.(e)};return u.jsxs("div",{ref:b,"aria-hidden":t["aria-hidden"]??!0,"data-ag-palette":m,"data-glow":g,"data-interactive":i||void 0,"data-pulse":p||void 0,className:z("ag-marketing-scope ag-aurora-orb",f),style:{"--ag-orb-size":T(a),"--ag-tilt-x":`${d}deg`,"--ag-tilt-y":`${c}deg`,...y},...t,onPointerMove:x,onPointerLeave:_,children:[u.jsx("span",{className:"ag-aurora-orb__core"}),u.jsx("span",{className:"ag-aurora-orb__shine"}),v]})});l.displayName="AuroraOrb";try{l.displayName="AuroraOrb",l.__docgenInfo={description:"",displayName:"AuroraOrb",props:{size:{defaultValue:{value:"18rem"},description:"",name:"size",required:!1,type:{name:"string | number | undefined"}},palette:{defaultValue:{value:"aurora"},description:"",name:"palette",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"aurora"'},{value:'"prism"'},{value:'"ocean"'},{value:'"ember"'},{value:'"mono"'}]}},pulse:{defaultValue:{value:"true"},description:"",name:"pulse",required:!1,type:{name:"boolean | undefined"}},glow:{defaultValue:{value:"medium"},description:"",name:"glow",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"strong"'},{value:'"none"'},{value:'"medium"'},{value:'"subtle"'}]}},interactive:{defaultValue:{value:"false"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},tiltX:{defaultValue:{value:"0"},description:"",name:"tiltX",required:!1,type:{name:"number | undefined"}},tiltY:{defaultValue:{value:"0"},description:"",name:"tiltY",required:!1,type:{name:"number | undefined"}}}}}catch{}const N={title:"Marketing/Aurora Orb",component:l,parameters:{layout:"centered"},argTypes:{palette:{control:"select",options:["aurora","prism","ocean","ember","mono"]},glow:{control:"select",options:["none","subtle","medium","strong"]}}},n={args:{size:280,pulse:!0,glow:"strong"}},o={args:{size:220,pulse:!1,glow:"subtle",palette:"ocean"}},s={args:{interactive:!0,tiltX:8,tiltY:-10,size:"18rem"}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    size: 280,
    pulse: true,
    glow: "strong"
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    size: 220,
    pulse: false,
    glow: "subtle",
    palette: "ocean"
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    interactive: true,
    tiltX: 8,
    tiltY: -10,
    size: "18rem"
  }
}`,...s.parameters?.docs?.source}}};const O=["Pulsing","Static","ControlledTilt"];export{s as ControlledTilt,n as Pulsing,o as Static,O as __namedExportsOrder,N as default};
