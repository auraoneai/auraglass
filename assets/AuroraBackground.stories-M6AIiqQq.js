import{r as f,j as n,c as k}from"./iframe-DMS_w3ti.js";/* empty css                  */import{D as j}from"./DisplayText-BZ5nuE_G.js";import"./preload-helper-PPVm8Dsz.js";const M="auraglass-marketing";function q(e){const r=String(e);let a=2166136261;for(let o=0;o<r.length;o+=1)a^=r.charCodeAt(o),a=Math.imul(a,16777619);return a>>>0}function N(e){let r=q(e)||1;return()=>(r=Math.imul(1664525,r)+1013904223,(r>>>0)/4294967296)}function A(e,r){const a=N(r);return Array.from({length:e},(o,u)=>({id:`ag-particle-${u}`,x:`${(a()*100).toFixed(3)}%`,y:`${(a()*100).toFixed(3)}%`,size:`${(1.5+a()*3.5).toFixed(2)}px`,alpha:`${(.26+a()*.42).toFixed(2)}`,duration:`${(8+a()*12).toFixed(2)}s`,delay:`${(-1*a()*12).toFixed(2)}s`}))}function V(e){return typeof e=="number"?Math.max(0,Math.min(80,Math.floor(e))):e?24:0}const i=f.forwardRef(({palette:e="aurora",intensity:r="medium",motion:a="subtle",particles:o=!1,grain:u=!1,vignette:v=!1,fixed:y=!1,reducedMotion:c=!1,seed:m=M,className:x,children:p,...l},b)=>{const g=V(o),h=f.useMemo(()=>A(g,m),[g,m]),_=c?"none":a;return n.jsxs("div",{ref:b,"aria-hidden":p?l["aria-hidden"]:l["aria-hidden"]??!0,"data-ag-palette":e,"data-ag-reduced-motion":c||a==="none"||void 0,"data-fixed":y||void 0,"data-intensity":r,"data-motion":_,className:k("ag-marketing-scope ag-aurora-background",x),...l,children:[n.jsx("span",{className:"ag-aurora-background__blob"}),n.jsx("span",{className:"ag-aurora-background__blob"}),n.jsx("span",{className:"ag-aurora-background__blob"}),h.map(t=>n.jsx("span",{className:"ag-aurora-background__particle","data-testid":"aurora-particle",style:{"--ag-particle-x":t.x,"--ag-particle-y":t.y,"--ag-particle-size":t.size,"--ag-particle-alpha":t.alpha,"--ag-particle-duration":t.duration,"--ag-particle-delay":t.delay}},t.id)),u&&n.jsx("span",{className:"ag-aurora-background__grain"}),v&&n.jsx("span",{className:"ag-aurora-background__vignette"}),p]})});i.displayName="AuroraBackground";try{i.displayName="AuroraBackground",i.__docgenInfo={description:"",displayName:"AuroraBackground",props:{palette:{defaultValue:{value:"aurora"},description:"",name:"palette",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"prism"'},{value:'"aurora"'},{value:'"ocean"'},{value:'"ember"'},{value:'"mono"'}]}},intensity:{defaultValue:{value:"medium"},description:"",name:"intensity",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"strong"'},{value:'"medium"'},{value:'"subtle"'}]}},motion:{defaultValue:{value:"subtle"},description:"",name:"motion",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"subtle"'},{value:'"full"'}]}},particles:{defaultValue:{value:"false"},description:"",name:"particles",required:!1,type:{name:"number | boolean | undefined"}},grain:{defaultValue:{value:"false"},description:"",name:"grain",required:!1,type:{name:"boolean | undefined"}},vignette:{defaultValue:{value:"false"},description:"",name:"vignette",required:!1,type:{name:"boolean | undefined"}},fixed:{defaultValue:{value:"false"},description:"",name:"fixed",required:!1,type:{name:"boolean | undefined"}},reducedMotion:{defaultValue:{value:"false"},description:"",name:"reducedMotion",required:!1,type:{name:"boolean | undefined"}},seed:{defaultValue:{value:"auraglass-marketing"},description:"",name:"seed",required:!1,type:{name:"string | number | undefined"}}}}}catch{}const D={title:"Marketing/Aurora Background",component:i,parameters:{layout:"fullscreen"},argTypes:{palette:{control:"select",options:["aurora","prism","ocean","ember","mono"]},intensity:{control:"select",options:["subtle","medium","strong"]},motion:{control:"select",options:["none","subtle","full"]}}},s={args:{particles:24,grain:!0,vignette:!0,seed:"storybook-contained"},render:e=>n.jsxs("section",{style:{position:"relative",minHeight:520,overflow:"hidden",padding:48},children:[n.jsx(i,{...e}),n.jsx("div",{style:{position:"relative",zIndex:1,maxWidth:760},children:n.jsx(j,{as:"h1",size:"hero",gradient:"aurora",children:"Liquid Glass marketing surfaces"})})]})},d={args:{particles:12,reducedMotion:!0,grain:!0,vignette:!0,seed:"storybook-reduced"}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    particles: 24,
    grain: true,
    vignette: true,
    seed: "storybook-contained"
  },
  render: args => <section style={{
    position: "relative",
    minHeight: 520,
    overflow: "hidden",
    padding: 48
  }}>
      <AuroraBackground {...args} />
      <div style={{
      position: "relative",
      zIndex: 1,
      maxWidth: 760
    }}>
        <DisplayText as="h1" size="hero" gradient="aurora">
          Liquid Glass marketing surfaces
        </DisplayText>
      </div>
    </section>
}`,...s.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    particles: 12,
    reducedMotion: true,
    grain: true,
    vignette: true,
    seed: "storybook-reduced"
  }
}`,...d.parameters?.docs?.source}}};const E=["Contained","ReducedMotion"];export{s as Contained,d as ReducedMotion,E as __namedExportsOrder,D as default};
