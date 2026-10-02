import{r as o,j as s,c as b}from"./iframe-DFMMcocb.js";import{L as d}from"./LiquidGlassScrollEdge-C6TvG12-.js";import"./preload-helper-PPVm8Dsz.js";const c={width:36,height:36,padding:0,border:"1px solid rgba(255, 255, 255, 0.18)",borderRadius:999,background:"rgba(255, 255, 255, 0.32)",color:"var(--glass-theme-text, var(--glass-text-primary))",boxShadow:"0 8px 24px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.28)",backdropFilter:"blur(16px) saturate(1.4) brightness(1.05) contrast(1.04)",WebkitBackdropFilter:"blur(16px) saturate(1.4) brightness(1.05) contrast(1.04)",transform:"translateY(-50%)",font:"600 24px/1 system-ui, sans-serif",cursor:"pointer"},e=o.forwardRef(({items:i,showScrollButtons:a=!0,className:u,children:p,...g},x)=>{const r=o.useRef(null),n=t=>r.current?.scrollBy({left:t,behavior:"smooth"});return s.jsxs("div",{ref:x,className:b("liquid-glass-carousel-rail glass-relative glass-w-full glass-max-w-full glass-min-w-0 glass-overflow-hidden",u),"data-liquid-glass-carousel-rail":"true",...g,children:[s.jsx(d,{edge:"left",styleMode:"soft",targetRef:r}),s.jsxs("div",{ref:r,className:"glass-flex glass-w-full glass-max-w-full glass-min-w-0 glass-gap-3 glass-overflow-x-auto glass-px-10 glass-py-2","data-liquid-glass-scroll-target":!0,children:[i?.map((t,m)=>s.jsx("div",{className:"glass-shrink-0",children:t},m)),p]}),s.jsx(d,{edge:"right",styleMode:"soft",targetRef:r}),a&&s.jsxs(s.Fragment,{children:[s.jsx("button",{type:"button","aria-label":"Scroll left",className:"glass-absolute glass-left-1 glass-top-1/2 glass-z-30",style:c,onClick:()=>n(-240),children:"‹"}),s.jsx("button",{type:"button","aria-label":"Scroll right",className:"glass-absolute glass-right-1 glass-top-1/2 glass-z-30",style:c,onClick:()=>n(240),children:"›"})]})]})});e.displayName="LiquidGlassCarouselRail";try{e.displayName="LiquidGlassCarouselRail",e.__docgenInfo={description:"",displayName:"LiquidGlassCarouselRail",props:{items:{defaultValue:null,description:"",name:"items",required:!1,type:{name:"ReactNode[] | undefined"}},showScrollButtons:{defaultValue:{value:"true"},description:"",name:"showScrollButtons",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const w={title:"Data + Visualization/Liquid Glass Carousel Rail",component:e,parameters:{layout:"fullscreen",previewSurface:"app"}},l={render:()=>s.jsxs("div",{style:{width:"100%",minWidth:0,minHeight:"100vh",display:"grid",placeItems:"center",padding:"clamp(12px, 4vw, 32px)",boxSizing:"border-box",overflow:"hidden"},children:[s.jsx("style",{children:`
        .liquid-carousel-story,
        .liquid-carousel-story * {
          color: #0f172a !important;
        }

        .liquid-glass-carousel-rail>button {
          border: 0;
          border-radius: 999px;
          background: rgba(255,255,255,.72);
          color: #111827 !important;
          cursor: pointer;
          font: 24px/1 system-ui;
          width: 36px;
          height: 36px;
          transform: translateY(-50%);
          box-shadow: 0 10px 28px rgba(15,23,42,.24);
        }
      `}),s.jsxs("div",{className:"liquid-carousel-story",style:{width:"min(860px, 100%)",maxWidth:"100%",minWidth:0,boxSizing:"border-box",overflow:"hidden",borderRadius:28,padding:"clamp(14px, 4vw, 24px)",background:"rgba(255,255,255,0.32)",color:"#0f172a"},children:[s.jsx("h2",{style:{margin:"0 0 14px",fontSize:20},children:"Featured surfaces"}),s.jsx(e,{items:Array.from({length:6},(i,a)=>s.jsxs("div",{className:"glass-radius-xl glass-surface-subtle glass-p-4",style:{width:"min(180px, calc(100vw - 128px))",minHeight:128,display:"grid",alignContent:"end",background:`linear-gradient(135deg, rgba(255,255,255,.32), rgba(255,255,255,${.12+a*.02}))`,color:"#0f172a",border:"1px solid rgba(15,23,42,.12)",boxShadow:"0 12px 30px rgba(15,23,42,.10), inset 0 1px 0 rgba(255,255,255,.26)"},children:[s.jsxs("strong",{children:["Surface ",a+1]}),s.jsx("span",{style:{color:"#475569",fontSize:12},children:"Adaptive preview"})]},a))})]})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: "100%",
    minWidth: 0,
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "clamp(12px, 4vw, 32px)",
    boxSizing: "border-box",
    overflow: "hidden"
  }}>
      <style>{\`
        .liquid-carousel-story,
        .liquid-carousel-story * {
          color: #0f172a !important;
        }

        .liquid-glass-carousel-rail>button {
          border: 0;
          border-radius: 999px;
          background: rgba(255,255,255,.72);
          color: #111827 !important;
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
      maxWidth: "100%",
      minWidth: 0,
      boxSizing: "border-box",
      overflow: "hidden",
      borderRadius: 28,
      padding: "clamp(14px, 4vw, 24px)",
      background: "rgba(255,255,255,0.32)",
      color: "#0f172a"
    }}>
        <h2 style={{
        margin: "0 0 14px",
        fontSize: 20
      }}>Featured surfaces</h2>
        <LiquidGlassCarouselRail items={Array.from({
        length: 6
      }, (_, i) => <div key={i} className="glass-radius-xl glass-surface-subtle glass-p-4" style={{
        width: "min(180px, calc(100vw - 128px))",
        minHeight: 128,
        display: "grid",
        alignContent: "end",
        background: \`linear-gradient(135deg, rgba(255,255,255,.32), rgba(255,255,255,\${0.12 + i * 0.02}))\`,
        color: "#0f172a",
        border: "1px solid rgba(15,23,42,.12)",
        boxShadow: "0 12px 30px rgba(15,23,42,.10), inset 0 1px 0 rgba(255,255,255,.26)"
      }}>
              <strong>Surface {i + 1}</strong>
              <span style={{
          color: "#475569",
          fontSize: 12
        }}>
                Adaptive preview
              </span>
            </div>)} />
      </div>
    </div>
}`,...l.parameters?.docs?.source}}};const v=["Default"];export{l as Default,v as __namedExportsOrder,w as default};
