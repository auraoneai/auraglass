import{r as o,j as s,c as m}from"./iframe-CXbhLBXA.js";import{L as d}from"./LiquidGlassScrollEdge-B49SeJEm.js";import"./preload-helper-PPVm8Dsz.js";const a=o.forwardRef(({items:i,showScrollButtons:e=!0,className:c,children:u,...g},p)=>{const r=o.useRef(null),t=n=>r.current?.scrollBy({left:n,behavior:"smooth"});return s.jsxs("div",{ref:p,className:m("liquid-glass-carousel-rail glass-relative",c),"data-liquid-glass-carousel-rail":"true",...g,children:[s.jsx(d,{edge:"left",styleMode:"soft",targetRef:r}),s.jsxs("div",{ref:r,className:"glass-flex glass-gap-3 glass-overflow-x-auto glass-px-8 glass-py-2","data-liquid-glass-scroll-target":!0,children:[i?.map((n,f)=>s.jsx("div",{className:"glass-shrink-0",children:n},f)),u]}),s.jsx(d,{edge:"right",styleMode:"soft",targetRef:r}),e&&s.jsxs(s.Fragment,{children:[s.jsx("button",{type:"button","aria-label":"Scroll left",className:"glass-absolute glass-left-0 glass-top-1/2",onClick:()=>t(-240),children:"‹"}),s.jsx("button",{type:"button","aria-label":"Scroll right",className:"glass-absolute glass-right-0 glass-top-1/2",onClick:()=>t(240),children:"›"})]})]})});a.displayName="LiquidGlassCarouselRail";try{a.displayName="LiquidGlassCarouselRail",a.__docgenInfo={description:"",displayName:"LiquidGlassCarouselRail",props:{items:{defaultValue:null,description:"",name:"items",required:!1,type:{name:"ReactNode[] | undefined"}},showScrollButtons:{defaultValue:{value:"true"},description:"",name:"showScrollButtons",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const y={title:"Data + Visualization/Liquid Glass Carousel Rail",component:a,parameters:{layout:"fullscreen",previewSurface:"app"}},l={render:()=>s.jsxs("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:32,boxSizing:"border-box"},children:[s.jsx("style",{children:`
        .liquid-carousel-story,
        .liquid-carousel-story * {
          color: #0f172a !important;
        }

        .liquid-glass-carousel-rail>button {
          border: 0;
          border-radius: 999px;
          background: rgba(15,23,42,.84);
          color: #fff !important;
          cursor: pointer;
          font: 24px/1 system-ui;
          width: 36px;
          height: 36px;
          transform: translateY(-50%);
          box-shadow: 0 10px 28px rgba(15,23,42,.24);
        }
      `}),s.jsxs("div",{className:"liquid-carousel-story",style:{width:"min(860px, 100%)",borderRadius:28,padding:24,background:"rgba(255,255,255,0.82)",color:"#0f172a"},children:[s.jsx("h2",{style:{margin:"0 0 14px",fontSize:20},children:"Featured surfaces"}),s.jsx(a,{items:Array.from({length:6},(i,e)=>s.jsxs("div",{className:"glass-radius-xl glass-surface-subtle glass-p-4",style:{width:180,minHeight:128,display:"grid",alignContent:"end",background:`linear-gradient(135deg, rgba(255,255,255,.86), rgba(${40+e*20},${120+e*10},220,.18))`,color:"#0f172a"},children:[s.jsxs("strong",{children:["Surface ",e+1]}),s.jsx("span",{style:{color:"#475569",fontSize:12},children:"Adaptive preview"})]},e))})]})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 32,
    boxSizing: "border-box"
  }}>
      <style>{\`
        .liquid-carousel-story,
        .liquid-carousel-story * {
          color: #0f172a !important;
        }

        .liquid-glass-carousel-rail>button {
          border: 0;
          border-radius: 999px;
          background: rgba(15,23,42,.84);
          color: #fff !important;
          cursor: pointer;
          font: 24px/1 system-ui;
          width: 36px;
          height: 36px;
          transform: translateY(-50%);
          box-shadow: 0 10px 28px rgba(15,23,42,.24);
        }
      \`}</style>
      <div className="liquid-carousel-story" style={{
      width: "min(860px, 100%)",
      borderRadius: 28,
      padding: 24,
      background: "rgba(255,255,255,0.82)",
      color: "#0f172a"
    }}>
        <h2 style={{
        margin: "0 0 14px",
        fontSize: 20
      }}>Featured surfaces</h2>
        <LiquidGlassCarouselRail items={Array.from({
        length: 6
      }, (_, i) => <div key={i} className="glass-radius-xl glass-surface-subtle glass-p-4" style={{
        width: 180,
        minHeight: 128,
        display: "grid",
        alignContent: "end",
        background: \`linear-gradient(135deg, rgba(255,255,255,.86), rgba(\${40 + i * 20},\${120 + i * 10},220,.18))\`,
        color: "#0f172a"
      }}>
              <strong>Surface {i + 1}</strong>
              <span style={{
          color: "#475569",
          fontSize: 12
        }}>Adaptive preview</span>
            </div>)} />
      </div>
    </div>
}`,...l.parameters?.docs?.source}}};const v=["Default"];export{l as Default,v as __namedExportsOrder,y as default};
