import{f as n,r as o,j as l,C as A,c as E,b as L}from"./iframe-CrdWMSIk.js";import{u as I}from"./a11y-C6c8VL3n.js";import{O as W}from"./OptimizedGlassCore-BMxL0Y3X.js";import{u as $}from"./use-animation-frame-CdPMq06T.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-ClxBxKMX.js";const R=(a,i)=>{if(a.startsWith("#")){const s=a.replace("#",""),c=s.length===3?s.split("").map(g=>g+g).join(""):s,m=parseInt(c.slice(0,6),16),p=m>>16&255,f=m>>8&255,b=m&255;return`rgba(${p}, ${f}, ${b}, ${i})`}return a.startsWith("rgb(")?a.replace("rgb(","rgba(").replace(")",`, ${i})`):`rgba(14, 165, 233, ${i})`};function y({className:a,colors:i=[n.semantic.primary,n.semantic.primary,n.semantic.primary,n.semantic.warning],points:s=4,speed:c=.5,blur:m=100,opacity:p=.8,animate:f=!0,interactive:b=!1,complexity:g="moderate",variant:h="ambient","aria-label":O}){L();const v=o.useRef(null),z=o.useRef([]),S=o.useRef({x:0,y:0}),G=o.useRef(0);o.useEffect(()=>{const d=v.current;if(!d)return;const r=g==="simple"?3:g==="moderate"?s:s*2;z.current=Array.from({length:r},(t,e)=>({x:Math.random()*d.width,y:Math.random()*d.height,vx:(Math.random()-.5)*c,vy:(Math.random()-.5)*c,color:i[e%i.length],radius:100+Math.random()*200}))},[i,s,c,g]),o.useEffect(()=>{if(!b)return;const d=r=>{const t=v.current;if(!t)return;const e=t.getBoundingClientRect();S.current={x:r.clientX-e.left,y:r.clientY-e.top}};return window.addEventListener("mousemove",d),()=>window.removeEventListener("mousemove",d)},[b]),o.useEffect(()=>{const d=()=>{const r=v.current;if(!r)return;const t=r.parentElement;t&&(r.width=t.clientWidth,r.height=t.clientHeight)};return d(),window.addEventListener("resize",d),()=>window.removeEventListener("resize",d)},[]),$(d=>{if(!f)return;const r=v.current,t=r?.getContext("2d");!r||!t||(G.current+=1,t.clearRect(0,0,r.width,r.height),z.current.forEach((e,j)=>{if(f){if(e.x+=e.vx,e.y+=e.vy,(e.x<0||e.x>r.width)&&(e.vx*=-1),(e.y<0||e.y>r.height)&&(e.vy*=-1),e.x=Math.max(0,Math.min(r.width,e.x)),e.y=Math.max(0,Math.min(r.height,e.y)),b){const k=S.current.x-e.x,q=S.current.y-e.y,w=Math.sqrt(k*k+q*q);if(w<150){const N=(150-w)/150;e.vx-=k/w*N*.5,e.vy-=q/w*N*.5}}e.x+=Math.sin(G.current*.01+j)*.3,e.y+=Math.cos(G.current*.01+j)*.3}const x=t.createRadialGradient(e.x,e.y,0,e.x,e.y,e.radius),V=e.color;x.addColorStop(0,R(V,p)),x.addColorStop(.5,R(V,p*.5)),x.addColorStop(1,R(V,0)),t.fillStyle=x,t.fillRect(0,0,r.width,r.height)}),h==="vibrant"?t.globalCompositeOperation="screen":h==="dark"?t.globalCompositeOperation="multiply":h==="subtle"&&(t.globalAlpha=.5))});const C=o.useMemo(()=>{switch(h){case"vibrant":return"saturate(1.5) brightness(1.2)";case"subtle":return"saturate(0.8) brightness(0.9)";case"dark":return"saturate(1.2) brightness(0.7) contrast(1.2)";default:return"saturate(1) brightness(1)"}},[h]);return l.jsx("div",{className:E("relative overflow-hidden",a),"aria-label":O,children:l.jsx("canvas",{ref:v,className:"glass-absolute glass-inset-0 glass-w-full glass-h-full",style:{filter:`blur(${m}px) ${C}`,opacity:p}})})}const _=o.forwardRef(function({children:i,className:s,"aria-label":c,...m},p){const f=I("mesh-background");return l.jsxs(W,{ref:p,intensity:"subtle",blur:"medium",className:E("relative",s),id:f,role:"presentation","aria-label":c||"Mesh gradient background","aria-hidden":"true",children:[l.jsx(y,{className:"glass-absolute glass-inset-0",...m}),l.jsx("div",{className:"glass-relative glass-z-10",children:l.jsx(A,{children:i})})]})}),F={ocean:{colors:[n.semantic.primary,n.semantic.primary,n.semantic.primary,n.semantic.primary],variant:"ambient",speed:.3,blur:120},sunset:{colors:[n.semantic.warning,n.semantic.warning,n.semantic.primary,n.semantic.error],variant:"vibrant",speed:.4,blur:100},aurora:{colors:[n.semantic.success,n.semantic.success,n.semantic.primary,n.semantic.primary,n.semantic.primary],variant:"ambient",speed:.2,blur:150,points:5},galaxy:{colors:[n.semantic.primary,n.semantic.primary,n.semantic.primary,n.semantic.primary],variant:"dark",speed:.15,blur:200,complexity:"complex"},minimal:{colors:["var(--glass-gray-200)","var(--glass-gray-300)","var(--glass-gray-400)"],variant:"subtle",speed:.1,blur:150,complexity:"simple"}};function H(a,i="analogous"){return o.useMemo(()=>{const s=[a];switch(i){case"analogous":s.push(u(a,30),u(a,-30),u(a,60));break;case"complementary":s.push(u(a,180),u(a,150),u(a,210));break;case"triadic":s.push(u(a,120),u(a,240));break}return s},[a,i])}function u(a,i){return a+i.toString(16).slice(-2)}try{y.displayName="GlassMeshGradient",y.__docgenInfo={description:"",displayName:"GlassMeshGradient",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},colors:{defaultValue:{value:`[
    COLORS.semantic.primary,
    COLORS.semantic.primary,
    COLORS.semantic.primary,
    COLORS.semantic.warning,
  ]`},description:"",name:"colors",required:!1,type:{name:"string[] | undefined"}},points:{defaultValue:{value:"4"},description:"",name:"points",required:!1,type:{name:"number | undefined"}},speed:{defaultValue:{value:"0.5"},description:"",name:"speed",required:!1,type:{name:"number | undefined"}},blur:{defaultValue:{value:"100"},description:"",name:"blur",required:!1,type:{name:"number | undefined"}},opacity:{defaultValue:{value:"0.8"},description:"",name:"opacity",required:!1,type:{name:"number | undefined"}},animate:{defaultValue:{value:"true"},description:"",name:"animate",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:{value:"false"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},complexity:{defaultValue:{value:"moderate"},description:"",name:"complexity",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"complex"'},{value:'"simple"'},{value:'"moderate"'}]}},variant:{defaultValue:{value:"ambient"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"dark"'},{value:'"ambient"'},{value:'"vibrant"'},{value:'"subtle"'}]}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}try{_.displayName="GlassMeshBackground",_.__docgenInfo={description:"",displayName:"GlassMeshBackground",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},colors:{defaultValue:null,description:"",name:"colors",required:!1,type:{name:"string[] | undefined"}},points:{defaultValue:null,description:"",name:"points",required:!1,type:{name:"number | undefined"}},speed:{defaultValue:null,description:"",name:"speed",required:!1,type:{name:"number | undefined"}},blur:{defaultValue:null,description:"",name:"blur",required:!1,type:{name:"number | undefined"}},opacity:{defaultValue:null,description:"",name:"opacity",required:!1,type:{name:"number | undefined"}},animate:{defaultValue:null,description:"",name:"animate",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:null,description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},complexity:{defaultValue:null,description:"",name:"complexity",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"complex"'},{value:'"simple"'},{value:'"moderate"'}]}},variant:{defaultValue:null,description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"dark"'},{value:'"ambient"'},{value:'"vibrant"'},{value:'"subtle"'}]}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}const D=Object.freeze(Object.defineProperty({__proto__:null,GlassMeshBackground:_,GlassMeshGradient:y,meshGradientPresets:F,useMeshGradientColors:H},Symbol.toStringTag,{value:"Module"})),B="GlassMeshGradient",P=D[B],Q={title:"Effects + Advanced/Glass Mesh Gradient",component:P,parameters:{layout:"centered",docs:{description:{component:"Component-owned Storybook coverage for GlassMeshGradient. This story renders the certified AuraGlass sample used by the full visual certification suite."}}}},M={parameters:{previewSurface:"media"},render:()=>l.jsxs("div",{style:{position:"relative",boxSizing:"border-box",width:"100%",maxWidth:760,height:"clamp(320px, 56vh, 420px)",overflow:"hidden",borderRadius:20,border:"1px solid rgba(255, 255, 255, 0.34)",background:"rgba(15, 23, 42, 0.68)",backdropFilter:"blur(22px)",boxShadow:"0 28px 72px rgba(15, 23, 42, 0.34)"},children:[l.jsx(y,{"aria-label":"GlassMeshGradient animated mesh gradient preview",className:"glass-absolute glass-inset-0",colors:["#38bdf8","#22c55e","#a855f7","#f59e0b"],points:6,speed:.32,blur:72,opacity:.92,variant:"vibrant"}),l.jsx("div",{style:{position:"relative",zIndex:1,display:"grid",boxSizing:"border-box",height:"100%",alignContent:"end",padding:"clamp(20px, 4vw, 32px)",color:"#f8fafc"},children:l.jsxs("div",{style:{maxWidth:420,padding:"clamp(16px, 3vw, 20px)",borderRadius:16,color:"#f8fafc",background:"rgba(15, 23, 42, 0.70)",border:"1px solid rgba(255, 255, 255, 0.24)",backdropFilter:"blur(18px)"},children:[l.jsx("div",{style:{fontSize:13,fontWeight:700,color:"#e2e8f0"},children:"ADVANCED VISUAL SYSTEM"}),l.jsx("h3",{style:{margin:"8px 0 6px",fontSize:"clamp(22px, 5vw, 28px)",lineHeight:1.12,color:"#f8fafc"},children:"Mesh Gradient Field"}),l.jsx("p",{style:{margin:0,fontSize:15,lineHeight:1.55,color:"#f8fafc"},children:"A full-size animated canvas with enough contrast and foreground structure to verify color blending, blur, and glass layering."})]})})]})};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  parameters: {
    previewSurface: "media"
  },
  render: () => <div style={{
    position: "relative",
    boxSizing: "border-box",
    width: "100%",
    maxWidth: 760,
    height: "clamp(320px, 56vh, 420px)",
    overflow: "hidden",
    borderRadius: 20,
    border: "1px solid rgba(255, 255, 255, 0.34)",
    background: "rgba(15, 23, 42, 0.68)",
    backdropFilter: "blur(22px)",
    boxShadow: "0 28px 72px rgba(15, 23, 42, 0.34)"
  }}>
      <GlassMeshGradient aria-label="GlassMeshGradient animated mesh gradient preview" className="glass-absolute glass-inset-0" colors={["#38bdf8", "#22c55e", "#a855f7", "#f59e0b"]} points={6} speed={0.32} blur={72} opacity={0.92} variant="vibrant" />
      <div style={{
      position: "relative",
      zIndex: 1,
      display: "grid",
      boxSizing: "border-box",
      height: "100%",
      alignContent: "end",
      padding: "clamp(20px, 4vw, 32px)",
      color: "#f8fafc"
    }}>
        <div style={{
        maxWidth: 420,
        padding: "clamp(16px, 3vw, 20px)",
        borderRadius: 16,
        color: "#f8fafc",
        background: "rgba(15, 23, 42, 0.70)",
        border: "1px solid rgba(255, 255, 255, 0.24)",
        backdropFilter: "blur(18px)"
      }}>
          <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#e2e8f0"
        }}>
            ADVANCED VISUAL SYSTEM
          </div>
          <h3 style={{
          margin: "8px 0 6px",
          fontSize: "clamp(22px, 5vw, 28px)",
          lineHeight: 1.12,
          color: "#f8fafc"
        }}>
            Mesh Gradient Field
          </h3>
          <p style={{
          margin: 0,
          fontSize: 15,
          lineHeight: 1.55,
          color: "#f8fafc"
        }}>
            A full-size animated canvas with enough contrast and foreground
            structure to verify color blending, blur, and glass layering.
          </p>
        </div>
      </div>
    </div>
}`,...M.parameters?.docs?.source}}};const Z=["Default"];export{M as Default,Z as __namedExportsOrder,Q as default};
