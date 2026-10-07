import{j as s,c as D}from"./iframe-RsoZoStf.js";import"./preload-helper-PPVm8Dsz.js";const G=[0,0];function i({data:e,width:o=120,height:r=32,compact:h=!1,contained:x=!1,maxHeight:n,stroke:v="#70d6ff",fill:y="none",className:b,style:k,preserveAspectRatio:w,...N}){const a=h||x,p=typeof n=="number"?n:typeof n=="string"?Number.parseFloat(n):void 0,u=typeof o=="number"?o:120,V=a?"100%":o,m=a?Math.min(r,Number.isFinite(p)?p:28):r,_=typeof n=="number"?`${n}px`:n,t=Array.isArray(e)&&e.length?e:G,j=Math.max(...t),f=Math.min(...t),q=c=>r-2-(c-f)/(j-f||1)*(r-4),S=t.length>1?(u-4)/(t.length-1):0,A=t.map((c,g)=>`${g===0?"M":"L"} ${2+g*S} ${q(c)}`).join(" ");return s.jsx("svg",{"data-glass-component":!0,"data-compact":a||void 0,viewBox:`0 0 ${u} ${r}`,width:V,height:m,preserveAspectRatio:a?"none":w,className:D("glass-text-primary",b),style:{display:a?"block":void 0,minWidth:a?0:void 0,maxWidth:"100%",height:a?m:"auto",maxHeight:_,flex:a?"1 1 auto":void 0,...k},...N,children:s.jsx("path",{d:A,fill:y,stroke:v,strokeWidth:2,strokeLinejoin:"round",strokeLinecap:"round"})})}try{i.displayName="GlassSparkline",i.__docgenInfo={description:"",displayName:"GlassSparkline",props:{data:{defaultValue:null,description:"",name:"data",required:!1,type:{name:"number[] | undefined"}},width:{defaultValue:{value:"120"},description:"",name:"width",required:!1,type:{name:"string | number | undefined"}},height:{defaultValue:{value:"32"},description:"",name:"height",required:!1,type:{name:"number | undefined"}},compact:{defaultValue:{value:"false"},description:`Fill the available inline space and use a preview-safe height.
Default rendering remains the existing fixed 120x32 sparkline.`,name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:`Alias for compact sizing when the sparkline is rendered inside a bounded
card, widget, or preview surface.`,name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:`Optional rendered max-height. The SVG viewBox remains numeric so the path
math stays deterministic while the rendered box can be constrained.`,name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},stroke:{defaultValue:{value:"#70d6ff"},description:"",name:"stroke",required:!1,type:{name:"string | undefined"}},fill:{defaultValue:{value:"none"},description:"",name:"fill",required:!1,type:{name:"string | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const W={title:"Data + Visualization/Glass Sparkline",component:i,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasssparkline component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},l={render:e=>s.jsx("div",{className:"glass-neutral-level1 glass-rounded-2xl glass-p-6",children:s.jsx(i,{...e})}),args:{data:[10,15,8,20,12,18,25,16,22,19],width:220,height:60}},d={render:e=>s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:s.jsx(i,{...e})}),args:{data:[5,12,8,15,10,20,18],width:100,height:40}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-neutral-level1 glass-rounded-2xl glass-p-6">
      <GlassSparkline {...args} />
    </div>,
  args: {
    data: [10, 15, 8, 20, 12, 18, 25, 16, 22, 19],
    width: 220,
    height: 60
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassSparkline {...args} />
    </div>,
  args: {
    data: [5, 12, 8, 15, 10, 20, 18],
    width: 100,
    height: 40
  }
}`,...d.parameters?.docs?.source}}};const F=["Default","Variants"];export{l as Default,d as Variants,F as __namedExportsOrder,W as default};
