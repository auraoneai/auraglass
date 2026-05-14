import{r as o,d as f,j as s,c as ne}from"./iframe-Ba4C8OEc.js";import{u as Ae}from"./a11y-S73Y6DdK.js";import{u as ke}from"./MotionPreferenceContext-BFEebokt.js";import{u as Te}from"./soundDesign-CpxfSKoe.js";import{O as ve}from"./OptimizedGlassCore-CqLDO6n8.js";import{M as Ee}from"./MotionFramer-BD6tt_zB.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-USAXnPyC.js";import"./utilsCore-W4jNCRfx.js";const Ge={blue:{primary:[100,150,255],secondary:[150,200,255],accent:[50,100,200]},purple:{primary:[200,100,255],secondary:[255,150,255],accent:[150,50,200]},green:{primary:[100,255,150],secondary:[150,255,200],accent:[50,200,100]},red:{primary:[255,100,100],secondary:[255,150,150],accent:[200,50,50]},gold:{primary:[255,200,100],secondary:[255,220,150],accent:[200,150,50]},cosmic:{primary:[255,100,200],secondary:[100,200,255],accent:[200,255,100]}},_=o.forwardRef(({width:i=600,height:c=600,radius:g=150,ringCount:P=8,rotationSpeed:x=1,intensity:L=.8,depth:H=10,type:xe="dimensional",colorScheme:b="blue",active:be=!0,opening:oe=!1,closing:le=!1,particleCount:C=100,showDistortion:w=!0,distortionIntensity:U=.5,energyLevel:Oe=1,pulsing:W=!0,pulseFrequency:ie=2,showEventHorizon:ce=!0,interactive:X=!0,onActivate:Se,onDeactivate:Ce,onEntry:ue,timeScale:M=1,showControls:we=!0,debug:Y=!1,respectMotionPreference:B=!0,className:Me,...Pe},Re)=>{const{prefersReducedMotion:de,isMotionSafe:qe}=ke(),{play:y}=Te(),R=o.useRef(null),q=o.useRef(),Ve=Ae("glass-vortex-portal"),[Q,me]=o.useState([]),[S,J]=o.useState([]),[pe,Ie]=o.useState([]),[h,V]=o.useState(L),[m,K]=o.useState(g),[u,ge]=o.useState(be),[he,je]=o.useState(0),p=Ge[b],Z=o.useCallback(()=>{const r=[];for(let e=0;e<P;e++){const t=g/P*(e+1),n=(1+e*.2)*x,a=Math.max(.1,1-e/P*.8);r.push({radius:t,rotation:Math.random()*Math.PI*2,speed:n,opacity:a,color:e%2===0?p.primary:p.secondary,thickness:Math.max(1,5-e),id:`ring-${e}`})}me(r)},[P,g,x,b]),ee=o.useCallback(()=>{const r=[];for(let e=0;e<C;e++){const t=Math.random()*Math.PI*2,n=Math.random()*g*1.5;r.push({x:i/2+Math.cos(t)*n,y:c/2+Math.sin(t)*n,angle:t,radius:n,speed:(Math.random()*2+1)*x,size:Math.random()*3+1,opacity:Math.random()*.8+.2,color:[p.accent[0]+Math.random()*50,p.accent[1]+Math.random()*50,p.accent[2]+Math.random()*50],lifetime:Math.random()*f.DURATION.slower*10+f.DURATION.slower*3,id:`particle-${e}`})}J(r)},[C,g,i,c,x,b]),ae=o.useCallback(()=>{if(!w)return;const r=[],e=Math.floor(U*10);for(let t=0;t<e;t++)r.push({x:Math.random()*i,y:Math.random()*c,intensity:Math.random()*U,frequency:Math.random()*.02+.01,type:["ripple","spiral","quantum","void"][Math.floor(Math.random()*4)],id:`distortion-${t}`});Ie(r)},[w,U,i,c]);o.useEffect(()=>{Z(),ee(),ae()},[Z,ee,ae]),o.useEffect(()=>{if(oe){V(0),K(0);const r=setInterval(()=>{V(e=>Math.min(L,e+.02)),K(e=>Math.min(g,e+3))},f.DURATION.fast);return setTimeout(()=>{clearInterval(r),y("success")},f.DURATION.slower*3),()=>clearInterval(r)}if(le){const r=setInterval(()=>{V(e=>Math.max(0,e-.02)),K(e=>Math.max(0,e-3))},f.DURATION.fast);return setTimeout(()=>{clearInterval(r),ge(!1),y("error")},f.DURATION.slower*3),()=>clearInterval(r)}},[oe,le,L,g,y]);const fe=o.useCallback(r=>{me(e=>e.map(t=>({...t,rotation:t.rotation+t.speed*r*M*(u?1:.1),opacity:t.opacity*h,radius:t.radius/g*m})))},[M,u,h,m,g]),ye=o.useCallback(r=>{if(J(e=>e.map(t=>{const n=i/2,a=c/2,l=t.angle+t.speed*r*M;let d=t.radius;u&&(d=Math.max(5,t.radius-20*r*M),d<10&&(d=g*1.5,t.lifetime=Math.random()*5e3+2e3));const v=n+Math.cos(l)*d,se=a+Math.sin(l)*d;return{...t,x:v,y:se,angle:l,radius:d,opacity:t.opacity*h,lifetime:t.lifetime-r}}).filter(t=>t.lifetime>0)),S.length<C&&u){const e=[],t=Math.min(5,C-S.length);for(let n=0;n<t;n++){const a=Math.random()*Math.PI*2,l=g*1.5;e.push({x:i/2+Math.cos(a)*l,y:c/2+Math.sin(a)*l,angle:a,radius:l,speed:(Math.random()*2+1)*x,size:Math.random()*3+1,opacity:Math.random()*.8+.2,color:[p.accent[0]+Math.random()*50,p.accent[1]+Math.random()*50,p.accent[2]+Math.random()*50],lifetime:Math.random()*f.DURATION.slower*10+f.DURATION.slower*3,id:`particle-${Date.now()}-${n}`})}J(n=>[...n,...e])}},[i,c,g,M,u,h,S.length,C,x,b]),te=o.useCallback(()=>{const r=R.current;if(!r)return;const e=r.getContext("2d");if(!e)return;const t=i/2,n=c/2;if(e.fillStyle="rgba(0, 0, 0, 0.1)",e.fillRect(0,0,i,c),w&&u&&pe.forEach(a=>{const l=50*a.intensity,d=e.createRadialGradient(a.x,a.y,0,a.x,a.y,l);d.addColorStop(0,"rgba(255, 255, 255, 0.02)"),d.addColorStop(1,"transparent"),e.fillStyle=d,e.fillRect(0,0,i,c)}),ce&&u){const a=e.createRadialGradient(t,n,m*.1,t,n,m);a.addColorStop(0,`rgba(${p.primary[0]}, ${p.primary[1]}, ${p.primary[2]}, 0.8)`),a.addColorStop(.7,`rgba(${p.primary[0]}, ${p.primary[1]}, ${p.primary[2]}, 0.3)`),a.addColorStop(1,"transparent"),e.fillStyle=a,e.beginPath(),e.arc(t,n,m,0,Math.PI*2),e.fill()}if(Q.forEach((a,l)=>{if(a.opacity<.01)return;e.save(),e.translate(t,n),e.rotate(a.rotation);const d=e.createLinearGradient(-a.radius,0,a.radius,0);d.addColorStop(0,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, 0)`),d.addColorStop(.5,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, ${a.opacity})`),d.addColorStop(1,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, 0)`),e.strokeStyle=d,e.lineWidth=a.thickness,e.globalAlpha=a.opacity*h;for(let v=0;v<H;v++){const se=a.radius+v*2,De=(1-v/H)*a.opacity;e.globalAlpha=De*h,e.beginPath(),e.arc(0,0,se,0,Math.PI*2),e.stroke()}e.restore()}),S.forEach(a=>{if(a.opacity<.01)return;const l=e.createRadialGradient(a.x,a.y,0,a.x,a.y,a.size);l.addColorStop(0,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, ${a.opacity})`),l.addColorStop(1,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, 0)`),e.fillStyle=l,e.beginPath(),e.arc(a.x,a.y,a.size,0,Math.PI*2),e.fill()}),u&&m>10){const a=e.createRadialGradient(t,n,0,t,n,m*.3);a.addColorStop(0,"rgba(0, 0, 0, 1)"),a.addColorStop(1,"rgba(0, 0, 0, 0)"),e.fillStyle=a,e.beginPath(),e.arc(t,n,m*.3,0,Math.PI*2),e.fill()}if(W&&u){const a=Math.sin(he*ie)*.3+.7,l=e.createRadialGradient(t,n,m*.8,t,n,m*1.2);l.addColorStop(0,"rgba(255, 255, 255, 0)"),l.addColorStop(1,`rgba(255, 255, 255, ${a*.1})`),e.fillStyle=l,e.beginPath(),e.arc(t,n,m*1.2,0,Math.PI*2),e.fill()}Y&&(e.fillStyle="white",e.font="12px monospace",e.fillText(`Intensity: ${h.toFixed(2)}`,10,20),e.fillText(`Radius: ${m.toFixed(0)}`,10,35),e.fillText(`Rings: ${Q.length}`,10,50),e.fillText(`Particles: ${S.length}`,10,65),e.fillText(`Active: ${u}`,10,80))},[i,c,m,h,w,pe,u,ce,b,Q,H,S,W,he,ie,Y]),re=o.useCallback(r=>{if(de&&B){te();return}const e=.016;je(t=>t+e),fe(e),ye(e),te(),q.current=requestAnimationFrame(re)},[de,B,te,fe,ye]);o.useEffect(()=>(q.current=requestAnimationFrame(re),()=>{q.current&&cancelAnimationFrame(q.current)}),[re]),o.useEffect(()=>{const r=R.current;r&&(r.width=i,r.height=c)},[i,c]);const Ne=o.useCallback(r=>{if(!X)return;const e=R.current;if(!e)return;const t=e.getBoundingClientRect(),n=r.clientX-t.left,a=r.clientY-t.top,l=i/2,d=c/2;Math.sqrt((n-l)**2+(a-d)**2)<m&&u&&(ue?.(n,a),y("success"))},[X,i,c,m,u,ue,y]),$e=()=>we?s.jsxs(ve,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:"glass-portal-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("button",{onClick:()=>{ge(!u),u?Ce?.():Se?.(),y("tap")},className:ne("glass-px-3 glass-py-1 glass-radius-md transition-colors glass-focus glass-touch-target glass-contrast-guard",u?"bg-red-500/20 hover:bg-red-500/30 text-red-400":"bg-green-500/20 hover:bg-green-500/30 text-green-400"),children:u?"Deactivate":"Activate"}),s.jsx("button",{onClick:()=>{Z(),ee(),ae(),y("success")},className:"glass-px-3 glass-py-1 glass-radius-md glass-bg-secondary/20 hover:glass-bg-secondary/30 glass-focus glass-touch-target glass-contrast-guard",children:"Reset"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("label",{className:"glass-text-sm",htmlFor:"vortex-type-select",children:"Type:"}),s.jsxs("select",{id:"vortex-type-select",value:xe,onChange:r=>{},className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20","aria-label":"Select vortex type",children:[s.jsx("option",{value:"dimensional",children:"Dimensional"}),s.jsx("option",{value:"energy",children:"Energy"}),s.jsx("option",{value:"void",children:"Void"}),s.jsx("option",{value:"quantum",children:"Quantum"}),s.jsx("option",{value:"temporal",children:"Temporal"})]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("label",{className:"glass-text-sm",htmlFor:"vortex-color-select",children:"Color:"}),s.jsxs("select",{id:"vortex-color-select",value:b,onChange:r=>{},className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20","aria-label":"Select color scheme",children:[s.jsx("option",{value:"blue",children:"Blue"}),s.jsx("option",{value:"purple",children:"Purple"}),s.jsx("option",{value:"green",children:"Green"}),s.jsx("option",{value:"red",children:"Red"}),s.jsx("option",{value:"gold",children:"Gold"}),s.jsx("option",{value:"cosmic",children:"Cosmic"})]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("label",{className:"glass-text-sm",htmlFor:"vortex-intensity-range",children:"Intensity:"}),s.jsx("input",{id:"vortex-intensity-range",type:"range",min:"0",max:"1",step:"0.1",value:h,onChange:r=>V(parseFloat(r.target.value)),className:"glass-w-20 glass-focus glass-touch-target glass-contrast-guard","aria-label":"Adjust vortex intensity"}),s.jsxs("span",{className:"glass-text-sm glass-min-w-3ch",children:[(h*100).toFixed(0),"%"]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsxs("label",{className:"glass-text-sm",children:[s.jsx("input",{type:"checkbox",checked:W,onChange:r=>{},className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Pulse"]}),s.jsxs("label",{className:"glass-text-sm",children:[s.jsx("input",{type:"checkbox",checked:w,onChange:r=>{},className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Distortion"]}),s.jsxs("label",{className:"glass-text-sm",children:[s.jsx("input",{type:"checkbox",checked:Y,onChange:r=>{},className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Debug"]})]})]}):null;return s.jsx(ve,{ref:Re,id:Ve,elevation:"level1",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:ne("glass-vortex-portal relative glass-radius-lg glass-backdrop-blur-md border border-border/20",Me),...Pe,children:s.jsxs(Ee,{preset:qe&&B?"fadeIn":"none",className:"glass-flex glass-flex-col glass-gap-4 glass-p-4",children:[$e(),s.jsx("div",{className:"glass-relative",children:s.jsx("canvas",{ref:R,width:i,height:c,className:ne("border border-border/20 glass-radius-md bg-black",X&&"cursor-pointer"),onClick:Ne,style:{width:i,height:c}})})]})})});_.displayName="GlassVortexPortal";try{_.displayName="GlassVortexPortal",_.__docgenInfo={description:"",displayName:"GlassVortexPortal",props:{width:{defaultValue:{value:"600"},description:"Canvas width",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"600"},description:"Canvas height",name:"height",required:!1,type:{name:"number | undefined"}},radius:{defaultValue:{value:"150"},description:"Portal radius",name:"radius",required:!1,type:{name:"number | undefined"}},ringCount:{defaultValue:{value:"8"},description:"Number of vortex rings",name:"ringCount",required:!1,type:{name:"number | undefined"}},rotationSpeed:{defaultValue:{value:"1"},description:"Base rotation speed",name:"rotationSpeed",required:!1,type:{name:"number | undefined"}},intensity:{defaultValue:{value:"0.8"},description:"Portal intensity (0-1)",name:"intensity",required:!1,type:{name:"number | undefined"}},depth:{defaultValue:{value:"10"},description:"Portal depth effect",name:"depth",required:!1,type:{name:"number | undefined"}},type:{defaultValue:{value:"dimensional"},description:"Portal type",name:"type",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"dimensional"'},{value:'"energy"'},{value:'"void"'},{value:'"quantum"'},{value:'"temporal"'}]}},colorScheme:{defaultValue:{value:"blue"},description:"Portal color scheme",name:"colorScheme",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"blue"'},{value:'"gold"'},{value:'"green"'},{value:'"purple"'},{value:'"red"'},{value:'"cosmic"'}]}},active:{defaultValue:{value:"true"},description:"Whether portal is active",name:"active",required:!1,type:{name:"boolean | undefined"}},opening:{defaultValue:{value:"false"},description:"Whether portal is opening",name:"opening",required:!1,type:{name:"boolean | undefined"}},closing:{defaultValue:{value:"false"},description:"Whether portal is closing",name:"closing",required:!1,type:{name:"boolean | undefined"}},particleCount:{defaultValue:{value:"100"},description:"Particle count for effects",name:"particleCount",required:!1,type:{name:"number | undefined"}},showDistortion:{defaultValue:{value:"true"},description:"Whether to show dimensional distortion",name:"showDistortion",required:!1,type:{name:"boolean | undefined"}},distortionIntensity:{defaultValue:{value:"0.5"},description:"Distortion intensity",name:"distortionIntensity",required:!1,type:{name:"number | undefined"}},energyLevel:{defaultValue:{value:"1"},description:"Portal energy level",name:"energyLevel",required:!1,type:{name:"number | undefined"}},pulsing:{defaultValue:{value:"true"},description:"Whether portal pulses",name:"pulsing",required:!1,type:{name:"boolean | undefined"}},pulseFrequency:{defaultValue:{value:"2"},description:"Pulse frequency",name:"pulseFrequency",required:!1,type:{name:"number | undefined"}},showEventHorizon:{defaultValue:{value:"true"},description:"Whether to show event horizon",name:"showEventHorizon",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:{value:"true"},description:"Whether portal is interactive",name:"interactive",required:!1,type:{name:"boolean | undefined"}},onActivate:{defaultValue:null,description:"Portal activation handler",name:"onActivate",required:!1,type:{name:"(() => void) | undefined"}},onDeactivate:{defaultValue:null,description:"Portal deactivation handler",name:"onDeactivate",required:!1,type:{name:"(() => void) | undefined"}},onEntry:{defaultValue:null,description:"Portal entry handler",name:"onEntry",required:!1,type:{name:"((x: number, y: number) => void) | undefined"}},timeScale:{defaultValue:{value:"1"},description:"Animation speed multiplier",name:"timeScale",required:!1,type:{name:"number | undefined"}},showControls:{defaultValue:{value:"true"},description:"Show portal controls",name:"showControls",required:!1,type:{name:"boolean | undefined"}},debug:{defaultValue:{value:"false"},description:"Debug mode",name:"debug",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Respect user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const Be={title:"Effects + Advanced/Glass Vortex Portal",component:_,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{width:{control:{type:"range",min:400,max:800,step:50}},height:{control:{type:"range",min:400,max:800,step:50}},radius:{control:{type:"range",min:50,max:300,step:10}},intensity:{control:{type:"range",min:0,max:1,step:.1}},rotationSpeed:{control:{type:"range",min:.1,max:3,step:.1}},type:{control:{type:"select"},options:["dimensional","energy","void","quantum","temporal"]},colorScheme:{control:{type:"select"},options:["blue","purple","green","red","gold","cosmic"]}}},I={args:{width:600,height:600,radius:150,active:!0,showControls:!0,interactive:!0}},j={args:{width:500,height:500,type:"dimensional",colorScheme:"blue",radius:120,intensity:.9,pulsing:!0,showDistortion:!0}},N={args:{width:600,height:600,type:"energy",colorScheme:"gold",radius:180,rotationSpeed:2,energyLevel:1.5,particleCount:150}},$={args:{width:400,height:400,type:"void",colorScheme:"purple",radius:100,intensity:.7,showEventHorizon:!0,distortionIntensity:.8}},D={args:{width:700,height:500,type:"quantum",colorScheme:"cosmic",radius:200,ringCount:12,pulsing:!0,pulseFrequency:3}},A={args:{width:550,height:550,type:"temporal",colorScheme:"green",radius:160,depth:15,showDistortion:!0,distortionIntensity:.6}},k={args:{width:500,height:500,colorScheme:"red",radius:140,intensity:.8,rotationSpeed:1.5,particleCount:120,interactive:!0}},T={args:{width:600,height:600,opening:!0,radius:150,colorScheme:"blue",showControls:!1}},E={args:{width:600,height:600,closing:!0,radius:150,colorScheme:"red",showControls:!1}},G={args:{width:300,height:300,radius:80,showControls:!1,showEventHorizon:!1,showDistortion:!1,pulsing:!1,ringCount:5}},O={args:{width:700,height:700,radius:250,intensity:1,rotationSpeed:2.5,ringCount:15,particleCount:200,depth:20,energyLevel:2}},F={args:{width:800,height:600,radius:200,interactive:!0,showControls:!0,debug:!0,pulsing:!0,showDistortion:!0,colorScheme:"cosmic"}},z={args:{width:500,height:500,radius:130,rotationSpeed:.3,timeScale:.5,pulsing:!0,pulseFrequency:1,showDistortion:!0}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 600,
    radius: 150,
    active: true,
    showControls: true,
    interactive: true
  }
}`,...I.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    width: 500,
    height: 500,
    type: 'dimensional',
    colorScheme: 'blue',
    radius: 120,
    intensity: 0.9,
    pulsing: true,
    showDistortion: true
  }
}`,...j.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 600,
    type: 'energy',
    colorScheme: 'gold',
    radius: 180,
    rotationSpeed: 2,
    energyLevel: 1.5,
    particleCount: 150
  }
}`,...N.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 400,
    type: 'void',
    colorScheme: 'purple',
    radius: 100,
    intensity: 0.7,
    showEventHorizon: true,
    distortionIntensity: 0.8
  }
}`,...$.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 500,
    type: 'quantum',
    colorScheme: 'cosmic',
    radius: 200,
    ringCount: 12,
    pulsing: true,
    pulseFrequency: 3
  }
}`,...D.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    width: 550,
    height: 550,
    type: 'temporal',
    colorScheme: 'green',
    radius: 160,
    depth: 15,
    showDistortion: true,
    distortionIntensity: 0.6
  }
}`,...A.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    width: 500,
    height: 500,
    colorScheme: 'red',
    radius: 140,
    intensity: 0.8,
    rotationSpeed: 1.5,
    particleCount: 120,
    interactive: true
  }
}`,...k.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 600,
    opening: true,
    radius: 150,
    colorScheme: 'blue',
    showControls: false
  }
}`,...T.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 600,
    closing: true,
    radius: 150,
    colorScheme: 'red',
    showControls: false
  }
}`,...E.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    radius: 200,
    interactive: true,
    showControls: true,
    debug: true,
    pulsing: true,
    showDistortion: true,
    colorScheme: 'cosmic'
  }
}`,...F.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}};const Qe=["Default","DimensionalPortal","EnergyVortex","VoidPortal","QuantumTunnel","TemporalRift","RedVortex","OpeningPortal","ClosingPortal","MinimalPortal","HighIntensityVortex","InteractivePlayground","SlowMotionVortex"];export{E as ClosingPortal,I as Default,j as DimensionalPortal,N as EnergyVortex,O as HighIntensityVortex,F as InteractivePlayground,G as MinimalPortal,T as OpeningPortal,D as QuantumTunnel,k as RedVortex,z as SlowMotionVortex,A as TemporalRift,$ as VoidPortal,Qe as __namedExportsOrder,Be as default};
