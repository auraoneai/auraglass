import{f as n,r as u,j as t,C as U,c as $,b as X}from"./iframe-DBNhMyqR.js";import{u as J}from"./a11y-BSdOe7Q0.js";import{O as K}from"./OptimizedGlassCore-DUu6GVWj.js";import{u as Q}from"./use-animation-frame-gO7FqUCr.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-pg7tQO9x.js";const z=(a,s)=>{if(a.startsWith("#")){const l=a.replace("#",""),f=l.length===3?l.split("").map(p=>p+p).join(""):l,c=parseInt(f.slice(0,6),16),d=c>>16&255,h=c>>8&255,b=c&255;return`rgba(${d}, ${h}, ${b}, ${s})`}return a.startsWith("rgb(")?a.replace("rgb(","rgba(").replace(")",`, ${s})`):`rgba(14, 165, 233, ${s})`};function v({className:a,colors:s=[n.semantic.primary,n.semantic.primary,n.semantic.primary,n.semantic.warning],points:l=4,speed:f=.5,blur:c=100,opacity:d=.8,animate:h=!0,interactive:b=!1,complexity:p="moderate",variant:g="ambient",respectMotionPreference:H=!0,compact:L=!1,contained:P=!1,preview:I=!1,height:V,maxHeight:S,style:W,"aria-label":F}){const B=X(),q=h&&(H?!B:!0),E=L||P||I,D=typeof V=="number"?`${V}px`:V,T=typeof S=="number"?`${S}px`:S,y=u.useRef(null),C=u.useRef([]),G=u.useRef({x:0,y:0}),k=u.useRef(0);u.useEffect(()=>{const o=y.current;if(!o)return;const r=p==="simple"?3:p==="moderate"?l:l*2;C.current=Array.from({length:r},(i,e)=>({x:Math.random()*o.width,y:Math.random()*o.height,vx:(Math.random()-.5)*f,vy:(Math.random()-.5)*f,color:s[e%s.length],radius:100+Math.random()*200}))},[s,l,f,p]),u.useEffect(()=>{if(!b)return;const o=r=>{const i=y.current;if(!i)return;const e=i.getBoundingClientRect();G.current={x:r.clientX-e.left,y:r.clientY-e.top}};return window.addEventListener("mousemove",o),()=>window.removeEventListener("mousemove",o)},[b]),u.useEffect(()=>{const o=()=>{const r=y.current;if(!r)return;const i=r.parentElement;i&&(r.width=i.clientWidth,r.height=i.clientHeight)};return o(),window.addEventListener("resize",o),()=>window.removeEventListener("resize",o)},[]),Q(o=>{if(!q)return;const r=y.current,i=r?.getContext("2d");!r||!i||(k.current+=1,i.clearRect(0,0,r.width,r.height),C.current.forEach((e,O)=>{if(q){if(e.x+=e.vx,e.y+=e.vy,(e.x<0||e.x>r.width)&&(e.vx*=-1),(e.y<0||e.y>r.height)&&(e.vy*=-1),e.x=Math.max(0,Math.min(r.width,e.x)),e.y=Math.max(0,Math.min(r.height,e.y)),b){const _=G.current.x-e.x,j=G.current.y-e.y,M=Math.sqrt(_*_+j*j);if(M<150){const A=(150-M)/150;e.vx-=_/M*A*.5,e.vy-=j/M*A*.5}}e.x+=Math.sin(k.current*.01+O)*.3,e.y+=Math.cos(k.current*.01+O)*.3}const x=i.createRadialGradient(e.x,e.y,0,e.x,e.y,e.radius),R=e.color;x.addColorStop(0,z(R,d)),x.addColorStop(.5,z(R,d*.5)),x.addColorStop(1,z(R,0)),i.fillStyle=x,i.fillRect(0,0,r.width,r.height)}),g==="vibrant"?i.globalCompositeOperation="screen":g==="dark"?i.globalCompositeOperation="multiply":g==="subtle"&&(i.globalAlpha=.5))});const Y=u.useMemo(()=>{switch(g){case"vibrant":return"saturate(1.5) brightness(1.2)";case"subtle":return"saturate(0.8) brightness(0.9)";case"dark":return"saturate(1.2) brightness(0.7) contrast(1.2)";default:return"saturate(1) brightness(1)"}},[g]);return t.jsxs("div",{className:$("relative overflow-hidden",a),style:{width:"100%",minHeight:D??(E?220:void 0),maxHeight:T??(E?240:void 0),...W??{}},"aria-label":F,children:[t.jsx("canvas",{ref:y,className:"glass-absolute glass-inset-0 glass-w-full glass-h-full",style:{filter:`blur(${c}px) ${Y}`,opacity:d}}),q?t.jsxs(t.Fragment,{children:[t.jsx("div",{"aria-hidden":"true",className:"ag-glass-mesh-gradient-motion-layer",style:{position:"absolute",inset:"-30%",filter:`blur(${Math.max(12,Math.round(c*.28))}px)`,opacity:Math.min(.78,Math.max(.38,d*.68)),mixBlendMode:g==="dark"?"screen":"plus-lighter",pointerEvents:"none",animation:"ag-glass-mesh-gradient-motion 2.8s ease-in-out infinite alternate"}}),t.jsx("style",{children:`
            .ag-glass-mesh-gradient-motion-layer {
              background:
                radial-gradient(circle at 22% 32%, rgba(124,211,255,0.72), transparent 28%),
                radial-gradient(circle at 78% 42%, rgba(216,111,255,0.64), transparent 32%),
                radial-gradient(circle at 48% 76%, rgba(99,255,218,0.48), transparent 30%);
            }
            @keyframes ag-glass-mesh-gradient-motion {
              0% {
                transform: translate3d(-8%, -4%, 0) rotate(-7deg) scale(0.96);
                opacity: ${Math.min(.72,Math.max(.34,d*.56))};
              }
              50% {
                transform: translate3d(7%, 5%, 0) rotate(8deg) scale(1.06);
                opacity: ${Math.min(.9,Math.max(.48,d*.82))};
              }
              100% {
                transform: translate3d(2%, -7%, 0) rotate(-2deg) scale(1);
                opacity: ${Math.min(.8,Math.max(.42,d*.68))};
              }
            }
          `})]}):null]})}const N=u.forwardRef(function({children:s,className:l,"aria-label":f,...c},d){const h=J("mesh-background");return t.jsxs(K,{ref:d,intensity:"subtle",blur:"medium",className:$("relative",l),id:h,role:"presentation","aria-label":f||"Mesh gradient background","aria-hidden":"true",children:[t.jsx(v,{className:"glass-absolute glass-inset-0",...c}),t.jsx("div",{className:"glass-relative glass-z-10",children:t.jsx(U,{children:s})})]})}),Z={ocean:{colors:[n.semantic.primary,n.semantic.primary,n.semantic.primary,n.semantic.primary],variant:"ambient",speed:.3,blur:120},sunset:{colors:[n.semantic.warning,n.semantic.warning,n.semantic.primary,n.semantic.error],variant:"vibrant",speed:.4,blur:100},aurora:{colors:[n.semantic.success,n.semantic.success,n.semantic.primary,n.semantic.primary,n.semantic.primary],variant:"ambient",speed:.2,blur:150,points:5},galaxy:{colors:[n.semantic.primary,n.semantic.primary,n.semantic.primary,n.semantic.primary],variant:"dark",speed:.15,blur:200,complexity:"complex"},minimal:{colors:["var(--glass-gray-200)","var(--glass-gray-300)","var(--glass-gray-400)"],variant:"subtle",speed:.1,blur:150,complexity:"simple"}};function ee(a,s="analogous"){return u.useMemo(()=>{const l=[a];switch(s){case"analogous":l.push(m(a,30),m(a,-30),m(a,60));break;case"complementary":l.push(m(a,180),m(a,150),m(a,210));break;case"triadic":l.push(m(a,120),m(a,240));break}return l},[a,s])}function m(a,s){return a+s.toString(16).slice(-2)}try{v.displayName="GlassMeshGradient",v.__docgenInfo={description:"",displayName:"GlassMeshGradient",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},colors:{defaultValue:{value:`[
    COLORS.semantic.primary,
    COLORS.semantic.primary,
    COLORS.semantic.primary,
    COLORS.semantic.warning,
  ]`},description:"",name:"colors",required:!1,type:{name:"string[] | undefined"}},points:{defaultValue:{value:"4"},description:"",name:"points",required:!1,type:{name:"number | undefined"}},speed:{defaultValue:{value:"0.5"},description:"",name:"speed",required:!1,type:{name:"number | undefined"}},blur:{defaultValue:{value:"100"},description:"",name:"blur",required:!1,type:{name:"number | undefined"}},opacity:{defaultValue:{value:"0.8"},description:"",name:"opacity",required:!1,type:{name:"number | undefined"}},animate:{defaultValue:{value:"true"},description:"",name:"animate",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:{value:"false"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},complexity:{defaultValue:{value:"moderate"},description:"",name:"complexity",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"complex"'},{value:'"simple"'},{value:'"moderate"'}]}},variant:{defaultValue:{value:"ambient"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"dark"'},{value:'"subtle"'},{value:'"ambient"'},{value:'"vibrant"'}]}},respectMotionPreference:{defaultValue:{value:"true"},description:"",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},preview:{defaultValue:{value:"false"},description:"",name:"preview",required:!1,type:{name:"boolean | undefined"}},height:{defaultValue:null,description:"",name:"height",required:!1,type:{name:"string | number | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}try{N.displayName="GlassMeshBackground",N.__docgenInfo={description:"",displayName:"GlassMeshBackground",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},colors:{defaultValue:null,description:"",name:"colors",required:!1,type:{name:"string[] | undefined"}},points:{defaultValue:null,description:"",name:"points",required:!1,type:{name:"number | undefined"}},speed:{defaultValue:null,description:"",name:"speed",required:!1,type:{name:"number | undefined"}},blur:{defaultValue:null,description:"",name:"blur",required:!1,type:{name:"number | undefined"}},opacity:{defaultValue:null,description:"",name:"opacity",required:!1,type:{name:"number | undefined"}},animate:{defaultValue:null,description:"",name:"animate",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:null,description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},complexity:{defaultValue:null,description:"",name:"complexity",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"complex"'},{value:'"simple"'},{value:'"moderate"'}]}},variant:{defaultValue:null,description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"dark"'},{value:'"subtle"'},{value:'"ambient"'},{value:'"vibrant"'}]}},respectMotionPreference:{defaultValue:null,description:"",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:null,description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:null,description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},preview:{defaultValue:null,description:"",name:"preview",required:!1,type:{name:"boolean | undefined"}},height:{defaultValue:null,description:"",name:"height",required:!1,type:{name:"string | number | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}const ae=Object.freeze(Object.defineProperty({__proto__:null,GlassMeshBackground:N,GlassMeshGradient:v,meshGradientPresets:Z,useMeshGradientColors:ee},Symbol.toStringTag,{value:"Module"})),ne="GlassMeshGradient",re=ae[ne],ue={title:"Effects + Advanced/Glass Mesh Gradient",component:re,parameters:{layout:"centered",docs:{description:{component:"Component-owned Storybook coverage for GlassMeshGradient. This story renders the certified AuraGlass sample used by the full visual certification suite."}}}},w={parameters:{previewSurface:"media"},render:()=>t.jsxs("div",{style:{position:"relative",boxSizing:"border-box",width:"100%",maxWidth:760,height:"clamp(320px, 56vh, 420px)",overflow:"hidden",borderRadius:20,border:"1px solid rgba(255, 255, 255, 0.34)",background:"rgba(15, 23, 42, 0.68)",backdropFilter:"blur(22px)",boxShadow:"0 28px 72px rgba(15, 23, 42, 0.34)"},children:[t.jsx(v,{"aria-label":"GlassMeshGradient animated mesh gradient preview",className:"glass-absolute glass-inset-0",colors:["#38bdf8","#22c55e","#a855f7","#f59e0b"],points:6,speed:.32,blur:72,opacity:.92,variant:"vibrant"}),t.jsx("div",{style:{position:"relative",zIndex:1,display:"grid",boxSizing:"border-box",height:"100%",alignContent:"end",padding:"clamp(20px, 4vw, 32px)",color:"#f8fafc"},children:t.jsxs("div",{style:{maxWidth:420,padding:"clamp(16px, 3vw, 20px)",borderRadius:16,color:"#f8fafc",background:"rgba(15, 23, 42, 0.70)",border:"1px solid rgba(255, 255, 255, 0.24)",backdropFilter:"blur(18px)"},children:[t.jsx("div",{style:{fontSize:13,fontWeight:700,color:"#e2e8f0"},children:"ADVANCED VISUAL SYSTEM"}),t.jsx("h3",{style:{margin:"8px 0 6px",fontSize:"clamp(22px, 5vw, 28px)",lineHeight:1.12,color:"#f8fafc"},children:"Mesh Gradient Field"}),t.jsx("p",{style:{margin:0,fontSize:15,lineHeight:1.55,color:"#f8fafc"},children:"A full-size animated canvas with enough contrast and foreground structure to verify color blending, blur, and glass layering."})]})})]})};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}};const ce=["Default"];export{w as Default,ce as __namedExportsOrder,ue as default};
