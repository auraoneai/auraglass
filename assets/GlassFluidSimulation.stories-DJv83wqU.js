import{r,j as l,c as Ce}from"./iframe-DJTDWGSM.js";import{u as Oe}from"./a11y-CN2zrjbV.js";import{u as He}from"./MotionPreferenceContext-C897q-Ib.js";import{u as Le}from"./soundDesign-B8P3ppRu.js";import{O as we}from"./OptimizedGlassCore-CauEN3Nh.js";import{M as We}from"./MotionFramer-DmYp_Rjk.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-C53zky6h.js";import"./utilsCore-B-Ktf6tF.js";const Ue=[100,150,255,.8],H=r.forwardRef(({width:d=800,height:m=600,particleCount:L=200,viscosity:te=.1,gravity:re=.5,smoothingRadius:S=25,restDensity:f=1e3,gasConstant:ne=200,damping:W=.99,showTrails:b=!0,trailLength:oe=10,fluidColor:C=Ue,backgroundColor:le="rgba(var(--glass-color-black) / var(--glass-opacity-10))",interactive:w=!0,forceStrength:U=1,forces:Fe=[],timeStep:y=.016,paused:Se=!1,maxFPS:ie=60,debug:z=!1,showControls:ke=!0,preset:Pe="water",onChange:B,onForceChange:Y,respectMotionPreference:Z=!0,className:qe,...Ve},Ee)=>{const{prefersReducedMotion:k,isMotionSafe:Ne}=He(),{play:h}=Le(),P=r.useRef(null),M=r.useRef(),ue=r.useRef(0),je=Oe("glass-fluid-simulation"),[K,ce]=r.useState([]),[q,X]=r.useState([]),[F,de]=r.useState(Fe),[v,Re]=r.useState(!Se),[me,Te]=r.useState(60),[ge,Ae]=r.useState(Pe),[x,_e]=r.useState({x:0,y:0}),[V,pe]=r.useState(!1),J=r.useRef(B);r.useEffect(()=>{J.current=B},[B]);const Q=r.useRef(Y);r.useEffect(()=>{Q.current=Y},[Y]);const ee=r.useRef(K);r.useEffect(()=>{ee.current=K},[K]);const $e={water:{viscosity:.1,gravity:.5,gasConstant:200,damping:.99,color:[100,150,255,.8]},honey:{viscosity:.8,gravity:.3,gasConstant:150,damping:.95,color:[255,200,50,.9]},mercury:{viscosity:.2,gravity:.8,gasConstant:400,damping:.98,color:[192,192,192,.95]},gas:{viscosity:.05,gravity:-.1,gasConstant:100,damping:.999,color:[200,255,200,.3]},plasma:{viscosity:.01,gravity:.1,gasConstant:300,damping:.997,color:[255,100,255,.7]}},se=r.useCallback(()=>{const t=[];for(let s=0;s<L;s++)t.push({x:Math.random()*d*.8+d*.1,y:Math.random()*m*.8+m*.1,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,density:f,pressure:0,color:[...C],id:`particle-${s}`});ce(t),X([t]),J.current?.(t)},[L,d,m,f]);r.useEffect(()=>{se()},[L,d,m,f,se]),r.useEffect(()=>{},[ge]);const fe=r.useCallback(t=>{const s=S,e=s*s;t.forEach(a=>{let i=0;t.forEach(n=>{const o=a.x-n.x,u=a.y-n.y,c=o*o+u*u;if(c<e){const p=Math.sqrt(c),g=Math.max(0,s-p);i+=g*g}}),a.density=Math.max(i,f),a.pressure=ne*(a.density-f)})},[S,f,ne]),ye=r.useCallback(t=>{const s=S;t.forEach(e=>{let a=0,i=0;if(t.forEach(n=>{if(e.id===n.id)return;const o=e.x-n.x,u=e.y-n.y,c=Math.sqrt(o*o+u*u);if(c<s&&c>0){const p=(s-c)/s,g=(e.pressure+n.pressure)/(2*n.density)*p;a+=o/c*g,i+=u/c*g;const be=te*p/n.density;a+=(n.vx-e.vx)*be,i+=(n.vy-e.vy)*be}}),F.forEach(n=>{const o=e.x-n.x,u=e.y-n.y,c=Math.sqrt(o*o+u*u);if(c<n.radius){const p=(n.radius-c)/n.radius,g=n.strength*p*U;switch(n.type){case"push":c>0&&(a+=o/c*g,i+=u/c*g);break;case"pull":c>0&&(a-=o/c*g,i-=u/c*g);break;case"vortex":a+=-u*g*.01,i+=o*g*.01;break;case"wave":a+=Math.sin(Date.now()*.001)*g,i+=Math.cos(Date.now()*.001)*g;break}}}),w&&V){const n=e.x-x.x,o=e.y-x.y,u=Math.sqrt(n*n+o*o);if(u<100&&u>0){const p=50*((100-u)/100)*U;a-=n/u*p,i-=o/u*p}}i+=re,e.vx+=a*y,e.vy+=i*y,e.vx*=W,e.vy*=W})},[S,te,F,U,w,V,x,re,y,W]),he=r.useCallback(t=>{t.forEach(s=>{s.x+=s.vx*y,s.y+=s.vy*y,s.x<10&&(s.x=10,s.vx=Math.abs(s.vx)*.5),s.x>d-10&&(s.x=d-10,s.vx=-Math.abs(s.vx)*.5),s.y<10&&(s.y=10,s.vy=Math.abs(s.vy)*.5),s.y>m-10&&(s.y=m-10,s.vy=-Math.abs(s.vy)*.5);const e=Math.sqrt(s.vx*s.vx+s.vy*s.vy),a=Math.min(e/10,1);s.color[0]=C[0]+a*100,s.color[1]=C[1],s.color[2]=C[2]+a*50})},[y,d,m,C]),ve=r.useCallback(t=>{const s=P.current;if(!s)return;const e=s.getContext("2d");e&&(e.fillStyle=le,e.fillRect(0,0,d,m),b&&q.length>1&&q.forEach((a,i)=>{const n=i/q.length*.3;a.forEach(o=>{e.globalAlpha=n,e.fillStyle=`rgba(${o.color[0]}, ${o.color[1]}, ${o.color[2]}, ${n})`,e.beginPath(),e.arc(o.x,o.y,2,0,Math.PI*2),e.fill()})}),e.globalAlpha=1,t.forEach(a=>{const i=Math.max(2,a.density/f*4),n=e.createRadialGradient(a.x,a.y,0,a.x,a.y,i);n.addColorStop(0,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, ${a.color[3]})`),n.addColorStop(1,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, 0)`),e.fillStyle=n,e.beginPath(),e.arc(a.x,a.y,i,0,Math.PI*2),e.fill()}),F.forEach(a=>{e.strokeStyle=a.type==="push"?"red":a.type==="pull"?"blue":a.type==="vortex"?"purple":"green",e.globalAlpha=.3,e.lineWidth=2,e.beginPath(),e.arc(a.x,a.y,a.radius,0,Math.PI*2),e.stroke()}),z&&(e.fillStyle="white",e.font="12px monospace",e.globalAlpha=1,e.fillText(`FPS: ${me}`,10,20),e.fillText(`Particles: ${t.length}`,10,40),e.fillText(`Forces: ${F.length}`,10,60)),w&&V&&(e.strokeStyle="yellow",e.globalAlpha=.5,e.lineWidth=1,e.beginPath(),e.arc(x.x,x.y,100,0,Math.PI*2),e.stroke()))},[le,d,m,b,q,f,F,z,me,w,V,x]),E=r.useCallback(t=>{if(k&&Z||!v)return;const s=t-ue.current;if(s<1e3/ie){M.current=requestAnimationFrame(E);return}ue.current=t,Te(Math.round(1e3/s)),ce(e=>{const a=[...e];return fe(a),ye(a),he(a),b&&X(i=>[...i,[...a]].slice(-oe)),J.current?.(a),ee.current=a,a}),ve(ee.current),M.current=requestAnimationFrame(E)},[k,Z,v,ie,fe,ye,he,b,oe,ve]);r.useEffect(()=>(v&&!k&&(M.current=requestAnimationFrame(E)),()=>{M.current&&cancelAnimationFrame(M.current)}),[E,v,k]),r.useEffect(()=>{const t=P.current;if(!t)return;t.width=d,t.height=m;const s=t.getContext("2d");s&&(s.imageSmoothingEnabled=!0)},[d,m]);const Ge=r.useCallback(t=>{const s=P.current;if(!s)return;const e=s.getBoundingClientRect();_e({x:t.clientX-e.left,y:t.clientY-e.top})},[]),De=r.useCallback(t=>{pe(!0),h("tap")},[h]),xe=r.useCallback(()=>{pe(!1)},[]),ae=r.useCallback(t=>{const s={...t,id:`force-${Date.now()}-${Math.random()}`};de(e=>{const a=[...e,s];return Q.current?.(a),a}),h("success")},[h]);r.useCallback(t=>{de(s=>{const e=s.filter(a=>a.id!==t);return Q.current?.(e),e}),h("error")},[h]);const Ie=()=>ke?l.jsxs(we,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:"glass-fluid-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard",children:[l.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[l.jsx("button",{onClick:()=>Re(!v),className:"glass-px-3 glass-py-1 glass-radius-md glass-surface-primary/20 hover:glass-surface-primary/30 glass-text-primary",children:v?"Pause":"Play"}),l.jsx("button",{onClick:se,className:"glass-px-3 glass-py-1 glass-radius-md glass-bg-secondary/20 hover:glass-bg-secondary/30 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"Reset"})]}),l.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[l.jsx("label",{className:"glass-text-sm",htmlFor:"preset-select",children:"Preset:"}),l.jsx("select",{id:"preset-select",value:ge,onChange:t=>Ae(t.target.value),className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20","aria-label":"Select fluid simulation preset",children:Object.keys($e).map(t=>l.jsx("option",{value:t,children:t.charAt(0).toUpperCase()+t.slice(1)},t))})]}),l.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[l.jsx("button",{onClick:()=>ae({x:d/2,y:m/2,strength:10,type:"push",radius:50}),className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-red/20 hover:glass-surface-red/30 glass-text-primary glass-text-sm",children:"Add Push"}),l.jsx("button",{onClick:()=>ae({x:d/2,y:m/2,strength:10,type:"pull",radius:50}),className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-blue/20 hover:glass-surface-blue/30 glass-text-primary glass-text-sm",children:"Add Pull"}),l.jsx("button",{onClick:()=>ae({x:d/2,y:m/2,strength:10,type:"vortex",radius:100}),className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-primary/20 hover:glass-surface-primary/30 glass-text-primary glass-text-sm",children:"Add Vortex"})]}),l.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[l.jsxs("label",{className:"glass-text-sm",children:[l.jsx("input",{type:"checkbox",checked:b,onChange:t=>X([]),className:"glass-mr-1"}),"Trails"]}),l.jsxs("label",{className:"glass-text-sm",children:[l.jsx("input",{type:"checkbox",checked:z,onChange:t=>{},className:"glass-mr-1"}),"Debug"]})]})]}):null;return l.jsx(we,{ref:Ee,id:je,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",className:Ce("glass-fluid-simulation relative glass-radius-lg glass-backdrop-blur-md border border-border/20",qe),...Ve,children:l.jsxs(We,{preset:Ne&&Z?"fadeIn":"none",className:"glass-flex glass-flex-col glass-gap-4 glass-p-4",children:[Ie(),l.jsx("div",{className:"glass-relative",children:l.jsx("canvas",{ref:P,width:d,height:m,className:Ce("border border-border/20 glass-radius-md bg-black/10",w&&"cursor-crosshair"),onMouseMove:Ge,onMouseDown:De,onMouseUp:xe,onMouseLeave:xe,style:{width:d,height:m}})})]})})});H.displayName="GlassFluidSimulation";try{H.displayName="GlassFluidSimulation",H.__docgenInfo={description:"",displayName:"GlassFluidSimulation",props:{width:{defaultValue:{value:"800"},description:"Canvas width",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"600"},description:"Canvas height",name:"height",required:!1,type:{name:"number | undefined"}},particleCount:{defaultValue:{value:"200"},description:"Number of fluid particles",name:"particleCount",required:!1,type:{name:"number | undefined"}},viscosity:{defaultValue:{value:"0.1"},description:"Fluid viscosity (0-1)",name:"viscosity",required:!1,type:{name:"number | undefined"}},gravity:{defaultValue:{value:"0.5"},description:"Gravity strength",name:"gravity",required:!1,type:{name:"number | undefined"}},smoothingRadius:{defaultValue:{value:"25"},description:"Smoothing radius for SPH",name:"smoothingRadius",required:!1,type:{name:"number | undefined"}},restDensity:{defaultValue:{value:"1000"},description:"Rest density of fluid",name:"restDensity",required:!1,type:{name:"number | undefined"}},gasConstant:{defaultValue:{value:"200"},description:"Gas constant for pressure",name:"gasConstant",required:!1,type:{name:"number | undefined"}},damping:{defaultValue:{value:"0.99"},description:"Damping factor",name:"damping",required:!1,type:{name:"number | undefined"}},showTrails:{defaultValue:{value:"true"},description:"Whether to show particle trails",name:"showTrails",required:!1,type:{name:"boolean | undefined"}},trailLength:{defaultValue:{value:"10"},description:"Trail length",name:"trailLength",required:!1,type:{name:"number | undefined"}},fluidColor:{defaultValue:{value:`[
  100, 150, 255, 0.8,
]`},description:"Fluid color",name:"fluidColor",required:!1,type:{name:"[number, number, number, number] | undefined"}},backgroundColor:{defaultValue:{value:"rgba(var(--glass-color-black) / var(--glass-opacity-10))"},description:"Background color",name:"backgroundColor",required:!1,type:{name:"string | undefined"}},interactive:{defaultValue:{value:"true"},description:"Whether to enable interactive forces",name:"interactive",required:!1,type:{name:"boolean | undefined"}},forceStrength:{defaultValue:{value:"1"},description:"Force strength multiplier",name:"forceStrength",required:!1,type:{name:"number | undefined"}},forces:{defaultValue:{value:"[]"},description:"External forces",name:"forces",required:!1,type:{name:"FluidForce[] | undefined"}},timeStep:{defaultValue:{value:"0.016"},description:"Animation speed multiplier",name:"timeStep",required:!1,type:{name:"number | undefined"}},paused:{defaultValue:{value:"false"},description:"Whether simulation is paused",name:"paused",required:!1,type:{name:"boolean | undefined"}},maxFPS:{defaultValue:{value:"60"},description:"Frame rate limit",name:"maxFPS",required:!1,type:{name:"number | undefined"}},debug:{defaultValue:{value:"false"},description:"Debug mode",name:"debug",required:!1,type:{name:"boolean | undefined"}},showControls:{defaultValue:{value:"true"},description:"Show controls",name:"showControls",required:!1,type:{name:"boolean | undefined"}},preset:{defaultValue:{value:"water"},description:"Fluid preset",name:"preset",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"water"'},{value:'"honey"'},{value:'"mercury"'},{value:'"gas"'},{value:'"plasma"'}]}},onChange:{defaultValue:null,description:"Change handler",name:"onChange",required:!1,type:{name:"((particles: FluidParticle[]) => void) | undefined"}},onForceChange:{defaultValue:null,description:"Force change handler",name:"onForceChange",required:!1,type:{name:"((forces: FluidForce[]) => void) | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Respect user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const{fn:Me}=__STORYBOOK_MODULE_TEST__,ss={title:"Effects + Advanced/Glass Fluid Simulation",component:H,parameters:{layout:"centered"},tags:["autodocs"],args:{onChange:Me(),onForceChange:Me()},argTypes:{fluidColor:{control:!1},width:{control:{type:"range",min:400,max:1200,step:50}},height:{control:{type:"range",min:300,max:800,step:50}},particleCount:{control:{type:"range",min:50,max:500,step:10}},viscosity:{control:{type:"range",min:0,max:1,step:.1}},gravity:{control:{type:"range",min:-1,max:2,step:.1}},preset:{control:{type:"select"},options:["water","honey","mercury","gas","plasma"]}}},N={args:{width:800,height:600,particleCount:200,showControls:!0,interactive:!0}},j={args:{width:600,height:400,preset:"water",particleCount:150,showTrails:!0,interactive:!0}},R={args:{width:500,height:400,preset:"honey",particleCount:100,viscosity:.8,gravity:.3,showTrails:!1}},T={args:{width:400,height:300,preset:"mercury",particleCount:80,gravity:.8,interactive:!0}},A={args:{width:700,height:500,preset:"gas",particleCount:300,gravity:-.1,showTrails:!0,trailLength:20}},_={args:{width:800,height:600,preset:"plasma",particleCount:250,showTrails:!0,interactive:!0,forces:[{x:200,y:300,strength:15,type:"vortex",radius:100,id:"vortex1"},{x:600,y:300,strength:10,type:"pull",radius:80,id:"pull1"}]}},$={args:{width:900,height:700,particleCount:300,interactive:!0,showControls:!0,debug:!0,showTrails:!0,forceStrength:2}},G={args:{width:400,height:300,particleCount:100,showControls:!1,showTrails:!1,interactive:!1,backgroundColor:"transparent"}},D={args:{width:600,height:400,particleCount:150,viscosity:.9,damping:.9,gravity:.2,showTrails:!0}},I={args:{width:700,height:500,particleCount:200,gravity:0,interactive:!0,forces:[{x:350,y:250,strength:20,type:"vortex",radius:150,id:"center-vortex"}]}},O={args:{width:800,height:600,particleCount:250,interactive:!0,forces:[{x:200,y:200,strength:12,type:"push",radius:60,id:"push1"},{x:600,y:200,strength:12,type:"pull",radius:60,id:"pull1"},{x:200,y:400,strength:15,type:"vortex",radius:80,id:"vortex1"},{x:600,y:400,strength:8,type:"wave",radius:70,id:"wave1"}]}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    particleCount: 200,
    showControls: true,
    interactive: true
  }
}`,...N.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    preset: 'water',
    particleCount: 150,
    showTrails: true,
    interactive: true
  }
}`,...j.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    width: 500,
    height: 400,
    preset: 'honey',
    particleCount: 100,
    viscosity: 0.8,
    gravity: 0.3,
    showTrails: false
  }
}`,...R.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 300,
    preset: 'mercury',
    particleCount: 80,
    gravity: 0.8,
    interactive: true
  }
}`,...T.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 500,
    preset: 'gas',
    particleCount: 300,
    gravity: -0.1,
    showTrails: true,
    trailLength: 20
  }
}`,...A.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    preset: 'plasma',
    particleCount: 250,
    showTrails: true,
    interactive: true,
    forces: [{
      x: 200,
      y: 300,
      strength: 15,
      type: 'vortex',
      radius: 100,
      id: 'vortex1'
    }, {
      x: 600,
      y: 300,
      strength: 10,
      type: 'pull',
      radius: 80,
      id: 'pull1'
    }]
  }
}`,..._.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    width: 900,
    height: 700,
    particleCount: 300,
    interactive: true,
    showControls: true,
    debug: true,
    showTrails: true,
    forceStrength: 2
  }
}`,...$.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 300,
    particleCount: 100,
    showControls: false,
    showTrails: false,
    interactive: false,
    backgroundColor: 'transparent'
  }
}`,...G.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    particleCount: 150,
    viscosity: 0.9,
    damping: 0.9,
    gravity: 0.2,
    showTrails: true
  }
}`,...D.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 500,
    particleCount: 200,
    gravity: 0,
    interactive: true,
    forces: [{
      x: 350,
      y: 250,
      strength: 20,
      type: 'vortex',
      radius: 150,
      id: 'center-vortex'
    }]
  }
}`,...I.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    particleCount: 250,
    interactive: true,
    forces: [{
      x: 200,
      y: 200,
      strength: 12,
      type: 'push',
      radius: 60,
      id: 'push1'
    }, {
      x: 600,
      y: 200,
      strength: 12,
      type: 'pull',
      radius: 60,
      id: 'pull1'
    }, {
      x: 200,
      y: 400,
      strength: 15,
      type: 'vortex',
      radius: 80,
      id: 'vortex1'
    }, {
      x: 600,
      y: 400,
      strength: 8,
      type: 'wave',
      radius: 70,
      id: 'wave1'
    }]
  }
}`,...O.parameters?.docs?.source}}};const as=["Default","WaterSimulation","HoneyFlow","MercuryDroplets","GasCloud","PlasmaField","InteractivePlayground","MinimalFluid","HighViscosity","ZeroGravity","MultiForceField"];export{N as Default,A as GasCloud,D as HighViscosity,R as HoneyFlow,$ as InteractivePlayground,T as MercuryDroplets,G as MinimalFluid,O as MultiForceField,_ as PlasmaField,j as WaterSimulation,I as ZeroGravity,as as __namedExportsOrder,ss as default};
