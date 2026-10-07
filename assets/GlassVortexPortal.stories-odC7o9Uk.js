import{r as o,b as f,j as r,c as ne}from"./iframe-Cqi-9gHA.js";import{u as Ae}from"./a11y-DBBBNlGj.js";import{u as ke}from"./MotionPreferenceContext-Da-updIo.js";import{u as Te}from"./soundDesign-BN0GUCjA.js";import{O as ve}from"./OptimizedGlassCore-CWgizUMZ.js";import{M as Ee}from"./MotionFramer-CH53jSUC.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-DlsmEFaF.js";import"./utilsCore-iuxhMr4m.js";const Ge={blue:{primary:[210,216,224],secondary:[246,248,250],accent:[92,101,114]},purple:{primary:[205,210,220],secondary:[244,246,250],accent:[98,93,108]},green:{primary:[207,216,211],secondary:[244,248,246],accent:[88,103,95]},red:{primary:[220,211,211],secondary:[250,246,246],accent:[112,92,92]},gold:{primary:[220,216,205],secondary:[250,248,242],accent:[110,101,82]},cosmic:{primary:[211,214,222],secondary:[248,249,252],accent:[88,95,108]}},P=o.forwardRef(({width:l=600,height:c=600,radius:g=150,ringCount:R=8,rotationSpeed:x=1,intensity:L=.8,depth:H=10,type:xe="dimensional",colorScheme:b="blue",active:be=!0,opening:oe=!1,closing:le=!1,particleCount:w=100,showDistortion:C=!0,distortionIntensity:U=.5,energyLevel:Oe=1,pulsing:W=!0,pulseFrequency:ie=2,showEventHorizon:ce=!0,interactive:X=!0,onActivate:Se,onDeactivate:we,onEntry:ue,timeScale:M=1,showControls:Ce=!0,debug:Y=!1,respectMotionPreference:B=!0,className:Me,...Pe},Re)=>{const{prefersReducedMotion:de,isMotionSafe:Ve}=ke(),{play:y}=Te(),V=o.useRef(null),q=o.useRef(),qe=Ae("glass-vortex-portal"),[Q,me]=o.useState([]),[S,J]=o.useState([]),[pe,je]=o.useState([]),[h,j]=o.useState(L),[m,K]=o.useState(g),[d,ge]=o.useState(be),[he,Ie]=o.useState(0),p=Ge[b],Z=o.useCallback(()=>{const s=[];for(let e=0;e<R;e++){const t=g/R*(e+1),n=(1+e*.2)*x,a=Math.max(.1,1-e/R*.8);s.push({radius:t,rotation:Math.random()*Math.PI*2,speed:n,opacity:a,color:e%2===0?p.primary:p.secondary,thickness:Math.max(1,5-e),id:`ring-${e}`})}me(s)},[R,g,x,b]),ee=o.useCallback(()=>{const s=[];for(let e=0;e<w;e++){const t=Math.random()*Math.PI*2,n=Math.random()*g*1.5;s.push({x:l/2+Math.cos(t)*n,y:c/2+Math.sin(t)*n,angle:t,radius:n,speed:(Math.random()*2+1)*x,size:Math.random()*3+1,opacity:Math.random()*.8+.2,color:[p.accent[0]+Math.random()*50,p.accent[1]+Math.random()*50,p.accent[2]+Math.random()*50],lifetime:Math.random()*f.DURATION.slower*10+f.DURATION.slower*3,id:`particle-${e}`})}J(s)},[w,g,l,c,x,b]),ae=o.useCallback(()=>{if(!C)return;const s=[],e=Math.floor(U*10);for(let t=0;t<e;t++)s.push({x:Math.random()*l,y:Math.random()*c,intensity:Math.random()*U,frequency:Math.random()*.02+.01,type:["ripple","spiral","quantum","void"][Math.floor(Math.random()*4)],id:`distortion-${t}`});je(s)},[C,U,l,c]);o.useEffect(()=>{Z(),ee(),ae()},[Z,ee,ae]),o.useEffect(()=>{if(oe){j(0),K(0);const s=setInterval(()=>{j(e=>Math.min(L,e+.02)),K(e=>Math.min(g,e+3))},f.DURATION.fast);return setTimeout(()=>{clearInterval(s),y("success")},f.DURATION.slower*3),()=>clearInterval(s)}if(le){const s=setInterval(()=>{j(e=>Math.max(0,e-.02)),K(e=>Math.max(0,e-3))},f.DURATION.fast);return setTimeout(()=>{clearInterval(s),ge(!1),y("error")},f.DURATION.slower*3),()=>clearInterval(s)}},[oe,le,L,g,y]);const fe=o.useCallback(s=>{me(e=>e.map(t=>({...t,rotation:t.rotation+t.speed*s*M*(d?1:.1),opacity:t.opacity*h,radius:t.radius/g*m})))},[M,d,h,m,g]),ye=o.useCallback(s=>{if(J(e=>e.map(t=>{const n=l/2,a=c/2,i=t.angle+t.speed*s*M;let u=t.radius;d&&(u=Math.max(5,t.radius-20*s*M),u<10&&(u=g*1.5,t.lifetime=Math.random()*5e3+2e3));const v=n+Math.cos(i)*u,re=a+Math.sin(i)*u;return{...t,x:v,y:re,angle:i,radius:u,opacity:t.opacity*h,lifetime:t.lifetime-s}}).filter(t=>t.lifetime>0)),S.length<w&&d){const e=[],t=Math.min(5,w-S.length);for(let n=0;n<t;n++){const a=Math.random()*Math.PI*2,i=g*1.5;e.push({x:l/2+Math.cos(a)*i,y:c/2+Math.sin(a)*i,angle:a,radius:i,speed:(Math.random()*2+1)*x,size:Math.random()*3+1,opacity:Math.random()*.8+.2,color:[p.accent[0]+Math.random()*50,p.accent[1]+Math.random()*50,p.accent[2]+Math.random()*50],lifetime:Math.random()*f.DURATION.slower*10+f.DURATION.slower*3,id:`particle-${Date.now()}-${n}`})}J(n=>[...n,...e])}},[l,c,g,M,d,h,S.length,w,x,b]),te=o.useCallback(()=>{const s=V.current;if(!s)return;const e=s.getContext("2d");if(!e)return;const t=l/2,n=c/2;if(e.fillStyle="rgba(0, 0, 0, 0.1)",e.fillRect(0,0,l,c),C&&d&&pe.forEach(a=>{const i=50*a.intensity,u=e.createRadialGradient(a.x,a.y,0,a.x,a.y,i);u.addColorStop(0,"rgba(255, 255, 255, 0.02)"),u.addColorStop(1,"transparent"),e.fillStyle=u,e.fillRect(0,0,l,c)}),ce&&d){const a=e.createRadialGradient(t,n,m*.1,t,n,m);a.addColorStop(0,`rgba(${p.primary[0]}, ${p.primary[1]}, ${p.primary[2]}, 0.8)`),a.addColorStop(.7,`rgba(${p.primary[0]}, ${p.primary[1]}, ${p.primary[2]}, 0.3)`),a.addColorStop(1,"transparent"),e.fillStyle=a,e.beginPath(),e.arc(t,n,m,0,Math.PI*2),e.fill()}if(Q.forEach((a,i)=>{if(a.opacity<.01)return;e.save(),e.translate(t,n),e.rotate(a.rotation);const u=e.createLinearGradient(-a.radius,0,a.radius,0);u.addColorStop(0,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, 0)`),u.addColorStop(.5,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, ${a.opacity})`),u.addColorStop(1,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, 0)`),e.strokeStyle=u,e.lineWidth=a.thickness,e.globalAlpha=a.opacity*h;for(let v=0;v<H;v++){const re=a.radius+v*2,De=(1-v/H)*a.opacity;e.globalAlpha=De*h,e.beginPath(),e.arc(0,0,re,0,Math.PI*2),e.stroke()}e.restore()}),S.forEach(a=>{if(a.opacity<.01)return;const i=e.createRadialGradient(a.x,a.y,0,a.x,a.y,a.size);i.addColorStop(0,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, ${a.opacity})`),i.addColorStop(1,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, 0)`),e.fillStyle=i,e.beginPath(),e.arc(a.x,a.y,a.size,0,Math.PI*2),e.fill()}),d&&m>10){const a=e.createRadialGradient(t,n,0,t,n,m*.3);a.addColorStop(0,"rgba(0, 0, 0, 1)"),a.addColorStop(1,"rgba(0, 0, 0, 0)"),e.fillStyle=a,e.beginPath(),e.arc(t,n,m*.3,0,Math.PI*2),e.fill()}if(W&&d){const a=Math.sin(he*ie)*.3+.7,i=e.createRadialGradient(t,n,m*.8,t,n,m*1.2);i.addColorStop(0,"rgba(255, 255, 255, 0)"),i.addColorStop(1,`rgba(255, 255, 255, ${a*.1})`),e.fillStyle=i,e.beginPath(),e.arc(t,n,m*1.2,0,Math.PI*2),e.fill()}Y&&(e.fillStyle="white",e.font="12px monospace",e.fillText(`Intensity: ${h.toFixed(2)}`,10,20),e.fillText(`Radius: ${m.toFixed(0)}`,10,35),e.fillText(`Rings: ${Q.length}`,10,50),e.fillText(`Particles: ${S.length}`,10,65),e.fillText(`Active: ${d}`,10,80))},[l,c,m,h,C,pe,d,ce,b,Q,H,S,W,he,ie,Y]),se=o.useCallback(s=>{if(de&&B){te();return}const e=.016;Ie(t=>t+e),fe(e),ye(e),te(),q.current=requestAnimationFrame(se)},[de,B,te,fe,ye]);o.useEffect(()=>(q.current=requestAnimationFrame(se),()=>{q.current&&cancelAnimationFrame(q.current)}),[se]),o.useEffect(()=>{const s=V.current;if(!s)return;const e=Math.min(window.devicePixelRatio||1,2);s.width=Math.round(l*e),s.height=Math.round(c*e),s.getContext("2d")?.setTransform(e,0,0,e,0,0)},[l,c]);const Ne=o.useCallback(s=>{if(!X)return;const e=V.current;if(!e)return;const t=e.getBoundingClientRect(),n=s.clientX-t.left,a=s.clientY-t.top,i=l/2,u=c/2;Math.sqrt((n-i)**2+(a-u)**2)<m&&d&&(ue?.(n,a),y("success"))},[X,l,c,m,d,ue,y]),$e=()=>Ce?r.jsxs(ve,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:"glass-portal-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard",children:[r.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[r.jsx("button",{onClick:()=>{ge(!d),d?we?.():Se?.(),y("tap")},className:ne("glass-px-3 glass-py-2 glass-radius-full glass-focus glass-touch-target glass-contrast-guard glass-border glass-border-subtle glass-surface-overlay glass-text-primary"),children:d?"Deactivate":"Activate"}),r.jsx("button",{onClick:()=>{Z(),ee(),ae(),y("success")},className:"glass-px-3 glass-py-2 glass-radius-full glass-surface-overlay glass-border glass-border-subtle glass-text-primary glass-focus glass-touch-target glass-contrast-guard",children:"Reset"})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[r.jsx("label",{className:"glass-text-sm",htmlFor:"vortex-type-select",children:"Type:"}),r.jsxs("select",{id:"vortex-type-select",value:xe,onChange:s=>{},className:"glass-px-3 glass-py-2 glass-radius-full glass-surface-overlay glass-border glass-border-subtle glass-text-primary glass-touch-target","aria-label":"Select vortex type",children:[r.jsx("option",{value:"dimensional",children:"Dimensional"}),r.jsx("option",{value:"energy",children:"Energy"}),r.jsx("option",{value:"void",children:"Void"}),r.jsx("option",{value:"quantum",children:"Quantum"}),r.jsx("option",{value:"temporal",children:"Temporal"})]})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[r.jsx("label",{className:"glass-text-sm",htmlFor:"vortex-color-select",children:"Color:"}),r.jsxs("select",{id:"vortex-color-select",value:b,onChange:s=>{},className:"glass-px-3 glass-py-2 glass-radius-full glass-surface-overlay glass-border glass-border-subtle glass-text-primary glass-touch-target","aria-label":"Select color scheme",children:[r.jsx("option",{value:"blue",children:"Blue"}),r.jsx("option",{value:"purple",children:"Purple"}),r.jsx("option",{value:"green",children:"Green"}),r.jsx("option",{value:"red",children:"Red"}),r.jsx("option",{value:"gold",children:"Gold"}),r.jsx("option",{value:"cosmic",children:"Cosmic"})]})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[r.jsx("label",{className:"glass-text-sm",htmlFor:"vortex-intensity-range",children:"Intensity:"}),r.jsx("input",{id:"vortex-intensity-range",type:"range",min:"0",max:"1",step:"0.1",value:h,onChange:s=>j(parseFloat(s.target.value)),className:"glass-w-20 glass-focus glass-touch-target glass-contrast-guard glass-accent-neutral","aria-label":"Adjust vortex intensity"}),r.jsxs("span",{className:"glass-text-sm glass-min-w-3ch",children:[(h*100).toFixed(0),"%"]})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[r.jsxs("label",{className:"glass-text-sm",children:[r.jsx("input",{type:"checkbox",checked:W,onChange:s=>{},className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Pulse"]}),r.jsxs("label",{className:"glass-text-sm",children:[r.jsx("input",{type:"checkbox",checked:C,onChange:s=>{},className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Distortion"]}),r.jsxs("label",{className:"glass-text-sm",children:[r.jsx("input",{type:"checkbox",checked:Y,onChange:s=>{},className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Debug"]})]})]}):null;return r.jsx(ve,{ref:Re,id:qe,elevation:"level1",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:ne("glass-vortex-portal glass-relative glass-w-full glass-radius-lg glass-backdrop-blur-md glass-border glass-border-subtle",Me),...Pe,children:r.jsxs(Ee,{preset:Ve&&B?"fadeIn":"none",className:"glass-flex glass-flex-col glass-gap-4 glass-p-4",children:[$e(),r.jsx("div",{className:"glass-relative glass-w-full glass-overflow-hidden glass-radius-md",children:r.jsx("canvas",{ref:V,width:l,height:c,className:ne("glass-border glass-border-subtle glass-radius-md",X&&"cursor-pointer"),onClick:Ne,style:{display:"block",width:`min(100%, ${l}px)`,height:"auto",aspectRatio:`${l} / ${c}`,background:"linear-gradient(145deg, rgb(247 248 250), rgb(221 225 231))"}})})]})})});P.displayName="GlassVortexPortal";try{P.displayName="GlassVortexPortal",P.__docgenInfo={description:"",displayName:"GlassVortexPortal",props:{width:{defaultValue:{value:"600"},description:"Canvas width",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"600"},description:"Canvas height",name:"height",required:!1,type:{name:"number | undefined"}},radius:{defaultValue:{value:"150"},description:"Portal radius",name:"radius",required:!1,type:{name:"number | undefined"}},ringCount:{defaultValue:{value:"8"},description:"Number of vortex rings",name:"ringCount",required:!1,type:{name:"number | undefined"}},rotationSpeed:{defaultValue:{value:"1"},description:"Base rotation speed",name:"rotationSpeed",required:!1,type:{name:"number | undefined"}},intensity:{defaultValue:{value:"0.8"},description:"Portal intensity (0-1)",name:"intensity",required:!1,type:{name:"number | undefined"}},depth:{defaultValue:{value:"10"},description:"Portal depth effect",name:"depth",required:!1,type:{name:"number | undefined"}},type:{defaultValue:{value:"dimensional"},description:"Portal type",name:"type",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"dimensional"'},{value:'"energy"'},{value:'"void"'},{value:'"quantum"'},{value:'"temporal"'}]}},colorScheme:{defaultValue:{value:"blue"},description:"Portal color scheme",name:"colorScheme",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"blue"'},{value:'"gold"'},{value:'"green"'},{value:'"purple"'},{value:'"red"'},{value:'"cosmic"'}]}},active:{defaultValue:{value:"true"},description:"Whether portal is active",name:"active",required:!1,type:{name:"boolean | undefined"}},opening:{defaultValue:{value:"false"},description:"Whether portal is opening",name:"opening",required:!1,type:{name:"boolean | undefined"}},closing:{defaultValue:{value:"false"},description:"Whether portal is closing",name:"closing",required:!1,type:{name:"boolean | undefined"}},particleCount:{defaultValue:{value:"100"},description:"Particle count for effects",name:"particleCount",required:!1,type:{name:"number | undefined"}},showDistortion:{defaultValue:{value:"true"},description:"Whether to show dimensional distortion",name:"showDistortion",required:!1,type:{name:"boolean | undefined"}},distortionIntensity:{defaultValue:{value:"0.5"},description:"Distortion intensity",name:"distortionIntensity",required:!1,type:{name:"number | undefined"}},energyLevel:{defaultValue:{value:"1"},description:"Portal energy level",name:"energyLevel",required:!1,type:{name:"number | undefined"}},pulsing:{defaultValue:{value:"true"},description:"Whether portal pulses",name:"pulsing",required:!1,type:{name:"boolean | undefined"}},pulseFrequency:{defaultValue:{value:"2"},description:"Pulse frequency",name:"pulseFrequency",required:!1,type:{name:"number | undefined"}},showEventHorizon:{defaultValue:{value:"true"},description:"Whether to show event horizon",name:"showEventHorizon",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:{value:"true"},description:"Whether portal is interactive",name:"interactive",required:!1,type:{name:"boolean | undefined"}},onActivate:{defaultValue:null,description:"Portal activation handler",name:"onActivate",required:!1,type:{name:"(() => void) | undefined"}},onDeactivate:{defaultValue:null,description:"Portal deactivation handler",name:"onDeactivate",required:!1,type:{name:"(() => void) | undefined"}},onEntry:{defaultValue:null,description:"Portal entry handler",name:"onEntry",required:!1,type:{name:"((x: number, y: number) => void) | undefined"}},timeScale:{defaultValue:{value:"1"},description:"Animation speed multiplier",name:"timeScale",required:!1,type:{name:"number | undefined"}},showControls:{defaultValue:{value:"true"},description:"Show portal controls",name:"showControls",required:!1,type:{name:"boolean | undefined"}},debug:{defaultValue:{value:"false"},description:"Debug mode",name:"debug",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Respect user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const Be={title:"Effects + Advanced/Glass Vortex Portal",component:P,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{width:{control:{type:"range",min:400,max:800,step:50}},height:{control:{type:"range",min:400,max:800,step:50}},radius:{control:{type:"range",min:50,max:300,step:10}},intensity:{control:{type:"range",min:0,max:1,step:.1}},rotationSpeed:{control:{type:"range",min:.1,max:3,step:.1}},type:{control:{type:"select"},options:["dimensional","energy","void","quantum","temporal"]},colorScheme:{control:{type:"select"},options:["blue","purple","green","red","gold","cosmic"]}}},I={render:l=>r.jsx("div",{style:{width:"min(720px, 100%)",margin:"auto"},children:r.jsx(P,{...l})}),args:{width:600,height:600,radius:150,active:!0,showControls:!0,interactive:!0}},N={args:{width:500,height:500,type:"dimensional",colorScheme:"blue",radius:120,intensity:.9,pulsing:!0,showDistortion:!0}},$={args:{width:600,height:600,type:"energy",colorScheme:"gold",radius:180,rotationSpeed:2,energyLevel:1.5,particleCount:150}},D={args:{width:400,height:400,type:"void",colorScheme:"purple",radius:100,intensity:.7,showEventHorizon:!0,distortionIntensity:.8}},A={args:{width:700,height:500,type:"quantum",colorScheme:"cosmic",radius:200,ringCount:12,pulsing:!0,pulseFrequency:3}},k={args:{width:550,height:550,type:"temporal",colorScheme:"green",radius:160,depth:15,showDistortion:!0,distortionIntensity:.6}},T={args:{width:500,height:500,colorScheme:"red",radius:140,intensity:.8,rotationSpeed:1.5,particleCount:120,interactive:!0}},E={args:{width:600,height:600,opening:!0,radius:150,colorScheme:"blue",showControls:!1}},G={args:{width:600,height:600,closing:!0,radius:150,colorScheme:"red",showControls:!1}},O={args:{width:300,height:300,radius:80,showControls:!1,showEventHorizon:!1,showDistortion:!1,pulsing:!1,ringCount:5}},F={args:{width:700,height:700,radius:250,intensity:1,rotationSpeed:2.5,ringCount:15,particleCount:200,depth:20,energyLevel:2}},z={args:{width:800,height:600,radius:200,interactive:!0,showControls:!0,debug:!0,pulsing:!0,showDistortion:!0,colorScheme:"cosmic"}},_={args:{width:500,height:500,radius:130,rotationSpeed:.3,timeScale:.5,pulsing:!0,pulseFrequency:1,showDistortion:!0}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    width: "min(720px, 100%)",
    margin: "auto"
  }}>
      <GlassVortexPortal {...args} />
    </div>,
  args: {
    width: 600,
    height: 600,
    radius: 150,
    active: true,
    showControls: true,
    interactive: true
  }
}`,...I.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    width: 500,
    height: 500,
    type: "dimensional",
    colorScheme: "blue",
    radius: 120,
    intensity: 0.9,
    pulsing: true,
    showDistortion: true
  }
}`,...N.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 600,
    type: "energy",
    colorScheme: "gold",
    radius: 180,
    rotationSpeed: 2,
    energyLevel: 1.5,
    particleCount: 150
  }
}`,...$.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 400,
    type: "void",
    colorScheme: "purple",
    radius: 100,
    intensity: 0.7,
    showEventHorizon: true,
    distortionIntensity: 0.8
  }
}`,...D.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 500,
    type: "quantum",
    colorScheme: "cosmic",
    radius: 200,
    ringCount: 12,
    pulsing: true,
    pulseFrequency: 3
  }
}`,...A.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    width: 550,
    height: 550,
    type: "temporal",
    colorScheme: "green",
    radius: 160,
    depth: 15,
    showDistortion: true,
    distortionIntensity: 0.6
  }
}`,...k.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    width: 500,
    height: 500,
    colorScheme: "red",
    radius: 140,
    intensity: 0.8,
    rotationSpeed: 1.5,
    particleCount: 120,
    interactive: true
  }
}`,...T.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 600,
    opening: true,
    radius: 150,
    colorScheme: "blue",
    showControls: false
  }
}`,...E.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 600,
    closing: true,
    radius: 150,
    colorScheme: "red",
    showControls: false
  }
}`,...G.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    width: 300,
    height: 300,
    radius: 80,
    showControls: false,
    showEventHorizon: false,
    showDistortion: false,
    pulsing: false,
    ringCount: 5
  }
}`,...O.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 700,
    radius: 250,
    intensity: 1,
    rotationSpeed: 2.5,
    ringCount: 15,
    particleCount: 200,
    depth: 20,
    energyLevel: 2
  }
}`,...F.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    radius: 200,
    interactive: true,
    showControls: true,
    debug: true,
    pulsing: true,
    showDistortion: true,
    colorScheme: "cosmic"
  }
}`,...z.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    width: 500,
    height: 500,
    radius: 130,
    rotationSpeed: 0.3,
    timeScale: 0.5,
    pulsing: true,
    pulseFrequency: 1,
    showDistortion: true
  }
}`,..._.parameters?.docs?.source}}};const Qe=["Default","DimensionalPortal","EnergyVortex","VoidPortal","QuantumTunnel","TemporalRift","RedVortex","OpeningPortal","ClosingPortal","MinimalPortal","HighIntensityVortex","InteractivePlayground","SlowMotionVortex"];export{G as ClosingPortal,I as Default,N as DimensionalPortal,$ as EnergyVortex,F as HighIntensityVortex,z as InteractivePlayground,O as MinimalPortal,E as OpeningPortal,A as QuantumTunnel,T as RedVortex,_ as SlowMotionVortex,k as TemporalRift,D as VoidPortal,Qe as __namedExportsOrder,Be as default};
