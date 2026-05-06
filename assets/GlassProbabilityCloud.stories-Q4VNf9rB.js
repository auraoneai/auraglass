import{f as oe}from"./index-CLSxArU-.js";import{r as p,b as we,h as Fe,j as t,c as r,e as qe,m as ue}from"./iframe-Ddb4tVEK.js";import{u as je}from"./useMotionPreference-DAknDGJC.js";import{c as le}from"./createGlassStyle-BfWnO-qv.js";import{O as Te}from"./OptimizedGlassCore-ac4MFqVE.js";import"./index-ByImX2pa.js";import"./preload-helper-PPVm8Dsz.js";const j=(n=.1)=>(Math.random()-.5)*n*2,T=(n,i,P,v=1)=>Math.sin(n*v+P)*Math.cos(i*v+P*.7),ce=n=>n*n,K=p.forwardRef(({width:n=600,height:i=400,depth:P=200,probabilityPoints:v=[],uncertaintyPrinciple:Q=!0,quantumFluctuations:ee=!0,observerEffect:M=!0,heisenbergUncertainty:b=.5,waveParticleDuality:w=!0,showProbabilityDensity:te=!0,showWaveFunction:ae=!0,showUncertaintyBounds:ne=!0,animationSpeed:se=1,particleCount:re=100,measurementPrecision:Ce=.1,realTimeMode:H=!1,onMeasurement:me,onUncertaintyChange:ie,className:pe="",...ye},he)=>{const X=we(),Y=p.useRef(null),[f,ge]=p.useState(0),[F,be]=p.useState([]),[g,Z]=p.useState([]),[q,fe]=p.useState(b);je();const[x,J]=p.useState(!1);Fe("glass-probability-cloud"),p.useEffect(()=>{const s=Array.from({length:re},(a,e)=>({id:`particle-${e}`,x:Math.random()*n,y:Math.random()*i,z:Math.random()*P,probability:Math.random(),uncertainty:b+j(.1),waveFunction:Math.random()*2-1,phase:Math.random()*Math.PI*2,observationCount:0}));Z([...v,...s])},[re,n,i,P,b,v]),p.useEffect(()=>{const s=setInterval(()=>{ge(a=>a+.1*se)},16);return()=>clearInterval(s)},[se]),p.useEffect(()=>{if(!H)return;const s=setInterval(()=>{Z(a=>a.map(e=>{const o=T(e.x/n*4*Math.PI,e.y/i*4*Math.PI,f,1+e.phase/Math.PI),c=ce(o);let u=0,l=0,m=0;if(ee){const h=e.uncertainty*.5;u=j(h),l=j(h),m=j(h)}let d=e.uncertainty;if(Q){const Me=1-Math.sqrt(u*u+l*l+m*m);d=Math.max(b,1/(Me+.1))}return M&&x&&Math.sqrt(Math.pow(e.x-n/2,2)+Math.pow(e.y-i/2,2))<50?{...e,waveFunction:Math.sign(o)*.9,probability:.8,uncertainty:Math.max(.1,e.uncertainty*.5),observationCount:e.observationCount+1,lastObserved:Date.now()}:{...e,x:Math.max(0,Math.min(n,e.x+u)),y:Math.max(0,Math.min(i,e.y+l)),z:Math.max(0,Math.min(P,e.z+m)),waveFunction:o,probability:Math.max(.01,Math.min(1,c+.1)),uncertainty:Math.max(.05,Math.min(2,d)),phase:(e.phase+.05)%(2*Math.PI)}}))},50);return()=>clearInterval(s)},[H,f,n,i,P,Q,ee,M,b,x]),p.useEffect(()=>{const s=g.reduce((a,e)=>a+e.uncertainty,0)/g.length;fe(s||b),ie?.(s)},[g,b,ie]),p.useEffect(()=>{const s=Y.current;if(!s)return;const a=s.getContext("2d");if(a){if(a.clearRect(0,0,n,i),te){const e=a.createImageData(n,i);for(let o=0;o<n;o+=4)for(let c=0;c<i;c+=4){const u=T(o/n*4*Math.PI,c/i*4*Math.PI,f),l=ce(u),m=Math.floor(l*50+10),d=(c*n+o)*4;d<e.data.length-3&&(e.data[d]=100+m,e.data[d+1]=50+m,e.data[d+2]=200+m,e.data[d+3]=30)}a.putImageData(e,0,0)}if(g.forEach(e=>{const o=M&&e.lastObserved&&Date.now()-e.lastObserved<1e3?.9:e.probability*.7+.1,c=2+e.uncertainty*3,u=w?c*(1+Math.sin(f*3+e.phase)*.3):c;if(w&&e.uncertainty>.3){a.beginPath(),a.arc(e.x,e.y,u*2,0,2*Math.PI),a.fillStyle=`rgba(100, 150, 255, ${o*.3})`,a.fill();for(let l=1;l<=3;l++)a.beginPath(),a.arc(e.x,e.y,u*l*.7,0,2*Math.PI),a.strokeStyle=`rgba(150, 200, 255, ${o*.2/l})`,a.lineWidth=1,a.stroke()}else{a.beginPath(),a.arc(e.x,e.y,u,0,2*Math.PI);const l=a.createRadialGradient(e.x,e.y,0,e.x,e.y,u);l.addColorStop(0,`rgba(255, 255, 255, ${o})`),l.addColorStop(1,`rgba(100, 150, 255, ${o*.3})`),a.fillStyle=l,a.fill()}ne&&e.uncertainty>.2&&(a.beginPath(),a.arc(e.x,e.y,e.uncertainty*20,0,2*Math.PI),a.strokeStyle=`rgba(255, 100, 100, ${e.uncertainty*.3})`,a.lineWidth=1,a.setLineDash([2,3]),a.stroke(),a.setLineDash([]))}),ae){a.strokeStyle="rgba(200, 200, 255, 0.4)",a.lineWidth=1,a.beginPath();for(let e=0;e<n;e+=10){const o=T(e/n*4*Math.PI,i/2/i*4*Math.PI,f),c=i/2+o*30;e===0?a.moveTo(e,c):a.lineTo(e,c)}a.stroke(),a.beginPath();for(let e=0;e<i;e+=10){const o=T(n/2/n*4*Math.PI,e/i*4*Math.PI,f),c=n/2+o*30;e===0?a.moveTo(c,e):a.lineTo(c,e)}a.stroke()}}},[g,f,n,i,te,ae,ne,w,M]);const Pe=s=>{const a=Y.current;if(!a)return;const e=a.getBoundingClientRect(),o=s.clientX-e.left,c=s.clientY-e.top;let u=null,l=1/0;if(g.forEach(m=>{const d=Math.sqrt(Math.pow(m.x-o,2)+Math.pow(m.y-c,2));d<l&&d<30&&(l=d,u=m)}),u){const m={point:u,timestamp:Date.now(),uncertainty:u.uncertainty};be(d=>[...d.slice(-9),m]),me?.(u),Z(d=>d.map(h=>h.id===u.id?{...h,observationCount:h.observationCount+1,lastObserved:Date.now(),uncertainty:Math.max(.1,h.uncertainty*.7)}:h))}},ve=p.useMemo(()=>g.reduce((s,a)=>s+a.probability,0)/g.length||0,[g]),xe=p.useMemo(()=>1-(q-b),[q,b]);return t.jsx(Te,{ref:he,variant:"frosted",className:`relative ${pe}`,...ye,children:t.jsxs("div",{className:"glass-p-4 glass-space-y-4",children:[t.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[t.jsxs("div",{children:[t.jsx("h2",{className:r("glass-text-xl glass-font-semibold glass-text-primary"),children:"Probability Cloud"}),t.jsxs("p",{className:r("glass-text-sm glass-text-secondary"),children:[g.length," quantum states"]})]}),t.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[t.jsx("button",{onClick:()=>J(!x),className:`
                  px-3 py-1 rounded text-sm font-medium transition-colors duration-200
                  ${le({variant:"default"})}
                  glass-border-subtle
                  ${x?"glass-text-danger glass-border-danger":"glass-text-secondary hover:glass-text-primary"}
                `,children:x?"👁️ Observing":"👁️‍🗨️ Observe"}),t.jsxs("div",{className:r("glass-text-sm glass-text-muted"),children:["t: ",f.toFixed(1)]})]})]}),t.jsxs("div",{className:"glass-relative",children:[t.jsx("canvas",{ref:Y,width:n,height:i,className:r("glass-border-subtle glass-radius-lg glass-cursor-crosshair glass-surface-overlay"),onClick:Pe,onMouseEnter:()=>J(!0),onMouseLeave:()=>J(!1)}),t.jsx(qe,{children:F.map(s=>t.jsx(ue.div,{className:"glass-absolute glass-pointer-events-none",style:{left:s.point.x,top:s.point.y,transform:"translate(-50%, -50%)"},initial:{scale:0,opacity:1},animate:X?{}:{scale:2,opacity:0},exit:{opacity:0},transition:X?{duration:0}:{duration:1},children:t.jsx("div",{className:r("glass-w-4 glass-h-4 glass-border-2 glass-border-danger glass-radius-full")})},s.timestamp))})]}),t.jsxs("div",{className:r("glass-p-4 glass-radius-lg glass-border-subtle glass-space-y-3",le({variant:"default"})),children:[t.jsxs("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4 glass-text-sm",children:[t.jsxs("div",{children:[t.jsx("span",{className:r("glass-text-secondary"),children:"Uncertainty:"}),t.jsxs("div",{className:r("glass-flex glass-items-center glass-space-x-2 glass-mt-1"),children:[t.jsx("div",{className:r("glass-flex-1 glass-h-2 glass-surface-muted glass-radius-full glass-overflow-hidden"),children:t.jsx(ue.div,{className:r("glass-h-full glass-gradient-primary glass-radius-full"),animate:{width:`${Math.min(100,q*100)}%`},transition:X?{duration:0}:{duration:.3}})}),t.jsxs("span",{className:r("glass-text-primary glass-text-xs"),children:[(q*100).toFixed(1),"%"]})]})]}),t.jsxs("div",{children:[t.jsx("span",{className:r("glass-text-secondary"),children:"Avg Probability:"}),t.jsxs("div",{className:r("glass-text-primary glass-font-medium"),children:[(ve*100).toFixed(1),"%"]})]}),t.jsxs("div",{children:[t.jsx("span",{className:r("glass-text-secondary"),children:"Coherence:"}),t.jsxs("div",{className:r("glass-text-primary glass-font-medium"),children:[Math.max(0,Math.min(100,xe*100)).toFixed(1),"%"]})]}),t.jsxs("div",{children:[t.jsx("span",{className:r("glass-text-secondary"),children:"Measurements:"}),t.jsx("div",{className:r("glass-text-primary glass-font-medium"),children:F.length})]})]}),F.length>0&&t.jsxs("div",{className:"glass-space-y-1",children:[t.jsx("span",{className:r("glass-text-secondary glass-text-sm"),children:"Recent Measurements:"}),t.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-1",children:F.slice(-5).map(s=>t.jsxs("div",{className:r("glass-px-2 glass-py-1 glass-text-xs glass-surface-muted glass-radius glass-border-subtle"),children:["P: ",(s.point.probability*100).toFixed(0),"%",s.uncertainty>.5&&t.jsxs("span",{className:"glass-text-primary glass-ml-1",children:["±",s.uncertainty.toFixed(1)]})]},s.timestamp))})]})]}),t.jsxs("div",{className:r("glass-flex glass-items-center glass-justify-between glass-text-sm glass-text-muted"),children:[t.jsx("span",{children:"Click particles to measure • Hover to observe"}),t.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[Q&&t.jsxs("span",{className:"glass-flex glass-items-center glass-space-x-1",children:[t.jsx("span",{children:"⚛"}),t.jsx("span",{children:"Heisenberg"})]}),w&&t.jsxs("span",{className:"glass-flex glass-items-center glass-space-x-1",children:[t.jsx("span",{children:"〰️"}),t.jsx("span",{children:"Wave-Particle"})]}),H&&t.jsxs("span",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[t.jsx("div",{className:r("glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse")}),t.jsx("span",{children:"Live"})]})]})]})]})})});try{K.displayName="GlassProbabilityCloud",K.__docgenInfo={description:"",displayName:"GlassProbabilityCloud",props:{width:{defaultValue:{value:"600"},description:"",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"400"},description:"",name:"height",required:!1,type:{name:"number | undefined"}},depth:{defaultValue:{value:"200"},description:"",name:"depth",required:!1,type:{name:"number | undefined"}},probabilityPoints:{defaultValue:{value:"[]"},description:"",name:"probabilityPoints",required:!1,type:{name:"ProbabilityPoint[] | undefined"}},uncertaintyPrinciple:{defaultValue:{value:"true"},description:"",name:"uncertaintyPrinciple",required:!1,type:{name:"boolean | undefined"}},quantumFluctuations:{defaultValue:{value:"true"},description:"",name:"quantumFluctuations",required:!1,type:{name:"boolean | undefined"}},observerEffect:{defaultValue:{value:"true"},description:"",name:"observerEffect",required:!1,type:{name:"boolean | undefined"}},heisenbergUncertainty:{defaultValue:{value:"0.5"},description:"",name:"heisenbergUncertainty",required:!1,type:{name:"number | undefined"}},waveParticleDuality:{defaultValue:{value:"true"},description:"",name:"waveParticleDuality",required:!1,type:{name:"boolean | undefined"}},showProbabilityDensity:{defaultValue:{value:"true"},description:"",name:"showProbabilityDensity",required:!1,type:{name:"boolean | undefined"}},showWaveFunction:{defaultValue:{value:"true"},description:"",name:"showWaveFunction",required:!1,type:{name:"boolean | undefined"}},showUncertaintyBounds:{defaultValue:{value:"true"},description:"",name:"showUncertaintyBounds",required:!1,type:{name:"boolean | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},particleCount:{defaultValue:{value:"100"},description:"",name:"particleCount",required:!1,type:{name:"number | undefined"}},measurementPrecision:{defaultValue:{value:"0.1"},description:"",name:"measurementPrecision",required:!1,type:{name:"number | undefined"}},realTimeMode:{defaultValue:{value:"false"},description:"",name:"realTimeMode",required:!1,type:{name:"boolean | undefined"}},onMeasurement:{defaultValue:null,description:"",name:"onMeasurement",required:!1,type:{name:"((point: ProbabilityPoint) => void) | undefined"}},onUncertaintyChange:{defaultValue:null,description:"",name:"onUncertaintyChange",required:!1,type:{name:"((uncertainty: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const y=[{id:"point1",x:150,y:100,z:50,probability:.8,uncertainty:.3,waveFunction:.6,phase:Math.PI/4,observationCount:0},{id:"point2",x:300,y:200,z:80,probability:.6,uncertainty:.5,waveFunction:-.4,phase:Math.PI/2,observationCount:2},{id:"point3",x:450,y:150,z:120,probability:.9,uncertainty:.2,waveFunction:.8,phase:3*Math.PI/4,observationCount:1},{id:"point4",x:200,y:300,z:90,probability:.4,uncertainty:.7,waveFunction:-.3,phase:Math.PI,observationCount:0}],Se=y.map(n=>({...n,uncertainty:.8+Math.random()*.2,waveFunction:(Math.random()-.5)*2})),de=y.map(n=>({...n,uncertainty:.1+Math.random()*.1,probability:.7+Math.random()*.3})),We={title:"Glass UI/Quantum/GlassProbabilityCloud",component:K,parameters:{layout:"centered"},tags:["autodocs"],args:{onMeasurement:oe(),onUncertaintyChange:oe()},argTypes:{onMeasurement:{action:void 0},onUncertaintyChange:{action:void 0},width:{control:{type:"range",min:400,max:1e3,step:50}},height:{control:{type:"range",min:300,max:800,step:50}},particleCount:{control:{type:"range",min:20,max:200,step:10}},heisenbergUncertainty:{control:{type:"range",min:.1,max:1,step:.1}},animationSpeed:{control:{type:"range",min:.1,max:3,step:.1}},measurementPrecision:{control:{type:"range",min:.01,max:1,step:.01}}}},S={args:{width:600,height:400,probabilityPoints:y,uncertaintyPrinciple:!0,quantumFluctuations:!0,observerEffect:!0,waveParticleDuality:!0,showProbabilityDensity:!0,showWaveFunction:!0,showUncertaintyBounds:!0,realTimeMode:!0}},C={args:{width:700,height:500,particleCount:80,realTimeMode:!0,uncertaintyPrinciple:!0,quantumFluctuations:!0,observerEffect:!0,waveParticleDuality:!0,showProbabilityDensity:!0,showWaveFunction:!0,showUncertaintyBounds:!0}},N={args:{width:600,height:400,probabilityPoints:Se,heisenbergUncertainty:.8,uncertaintyPrinciple:!0,quantumFluctuations:!0,showUncertaintyBounds:!0,realTimeMode:!0}},D={args:{width:600,height:400,probabilityPoints:de,heisenbergUncertainty:.1,uncertaintyPrinciple:!0,quantumFluctuations:!1,showUncertaintyBounds:!0,realTimeMode:!0}},E={args:{width:600,height:400,probabilityPoints:y,waveParticleDuality:!1,showWaveFunction:!0,showProbabilityDensity:!0,uncertaintyPrinciple:!0,quantumFluctuations:!0,realTimeMode:!0}},U={args:{width:600,height:400,probabilityPoints:de,waveParticleDuality:!1,showWaveFunction:!1,showProbabilityDensity:!1,showUncertaintyBounds:!1,uncertaintyPrinciple:!1,quantumFluctuations:!1,realTimeMode:!0}},I={args:{width:600,height:400,probabilityPoints:y,observerEffect:!1,uncertaintyPrinciple:!0,quantumFluctuations:!0,realTimeMode:!0}},k={args:{width:600,height:400,probabilityPoints:y,quantumFluctuations:!1,uncertaintyPrinciple:!1,observerEffect:!0,realTimeMode:!0}},V={args:{width:600,height:400,probabilityPoints:y,showProbabilityDensity:!1,showWaveFunction:!1,showUncertaintyBounds:!1,uncertaintyPrinciple:!1,quantumFluctuations:!1,observerEffect:!1}},W={args:{width:800,height:600,particleCount:150,uncertaintyPrinciple:!0,quantumFluctuations:!0,observerEffect:!0,realTimeMode:!0}},O={args:{width:600,height:400,particleCount:20,uncertaintyPrinciple:!0,quantumFluctuations:!0,observerEffect:!0,realTimeMode:!0}},B={args:{width:600,height:400,probabilityPoints:y,animationSpeed:3,uncertaintyPrinciple:!0,quantumFluctuations:!0,realTimeMode:!0}},z={args:{width:600,height:400,probabilityPoints:y,animationSpeed:.3,uncertaintyPrinciple:!0,quantumFluctuations:!0,realTimeMode:!0}},R={args:{width:600,height:400,probabilityPoints:y,measurementPrecision:.01,uncertaintyPrinciple:!0,observerEffect:!0,realTimeMode:!0}},_={args:{width:600,height:400,probabilityPoints:y,measurementPrecision:.5,uncertaintyPrinciple:!0,observerEffect:!0,realTimeMode:!0}},$={args:{width:900,height:700,particleCount:120,uncertaintyPrinciple:!0,quantumFluctuations:!0,observerEffect:!0,realTimeMode:!0}},G={args:{width:400,height:300,particleCount:40,uncertaintyPrinciple:!0,quantumFluctuations:!0,observerEffect:!0,realTimeMode:!0}},L={args:{width:600,height:400,probabilityPoints:y,realTimeMode:!1,showProbabilityDensity:!0,showWaveFunction:!0,showUncertaintyBounds:!0}},A={args:{width:600,height:400,probabilityPoints:y,heisenbergUncertainty:.7,uncertaintyPrinciple:!0,quantumFluctuations:!0,waveParticleDuality:!0,realTimeMode:!0}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    observerEffect: true,
    waveParticleDuality: true,
    showProbabilityDensity: true,
    showWaveFunction: true,
    showUncertaintyBounds: true,
    realTimeMode: true
  }
}`,...S.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 500,
    particleCount: 80,
    realTimeMode: true,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    observerEffect: true,
    waveParticleDuality: true,
    showProbabilityDensity: true,
    showWaveFunction: true,
    showUncertaintyBounds: true
  }
}`,...C.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    probabilityPoints: highUncertaintyPoints,
    heisenbergUncertainty: 0.8,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    showUncertaintyBounds: true,
    realTimeMode: true
  }
}`,...N.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    probabilityPoints: lowUncertaintyPoints,
    heisenbergUncertainty: 0.1,
    uncertaintyPrinciple: true,
    quantumFluctuations: false,
    showUncertaintyBounds: true,
    realTimeMode: true
  }
}`,...D.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    waveParticleDuality: false,
    showWaveFunction: true,
    showProbabilityDensity: true,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    realTimeMode: true
  }
}`,...E.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    probabilityPoints: lowUncertaintyPoints,
    waveParticleDuality: false,
    showWaveFunction: false,
    showProbabilityDensity: false,
    showUncertaintyBounds: false,
    uncertaintyPrinciple: false,
    quantumFluctuations: false,
    realTimeMode: true
  }
}`,...U.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    observerEffect: false,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    realTimeMode: true
  }
}`,...I.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    quantumFluctuations: false,
    uncertaintyPrinciple: false,
    observerEffect: true,
    realTimeMode: true
  }
}`,...k.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    showProbabilityDensity: false,
    showWaveFunction: false,
    showUncertaintyBounds: false,
    uncertaintyPrinciple: false,
    quantumFluctuations: false,
    observerEffect: false
  }
}`,...V.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    particleCount: 150,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    observerEffect: true,
    realTimeMode: true
  }
}`,...W.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    particleCount: 20,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    observerEffect: true,
    realTimeMode: true
  }
}`,...O.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    animationSpeed: 3,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    realTimeMode: true
  }
}`,...B.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    animationSpeed: 0.3,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    realTimeMode: true
  }
}`,...z.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    measurementPrecision: 0.01,
    uncertaintyPrinciple: true,
    observerEffect: true,
    realTimeMode: true
  }
}`,...R.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    measurementPrecision: 0.5,
    uncertaintyPrinciple: true,
    observerEffect: true,
    realTimeMode: true
  }
}`,..._.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    width: 900,
    height: 700,
    particleCount: 120,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    observerEffect: true,
    realTimeMode: true
  }
}`,...$.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 300,
    particleCount: 40,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    observerEffect: true,
    realTimeMode: true
  }
}`,...G.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    realTimeMode: false,
    showProbabilityDensity: true,
    showWaveFunction: true,
    showUncertaintyBounds: true
  }
}`,...L.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    heisenbergUncertainty: 0.7,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    waveParticleDuality: true,
    realTimeMode: true
  }
}`,...A.parameters?.docs?.source}}};const Oe=["Default","RealTimeMode","HighUncertainty","LowUncertainty","WaveOnly","ParticleOnly","NoObserverEffect","NoQuantumFluctuations","MinimalVisualization","ManyParticles","FewParticles","FastAnimation","SlowAnimation","PreciseMeasurement","ImpreciseMeasurement","LargeCanvas","SmallCanvas","StaticMode","QuantumTunneling"];export{S as Default,B as FastAnimation,O as FewParticles,N as HighUncertainty,_ as ImpreciseMeasurement,$ as LargeCanvas,D as LowUncertainty,W as ManyParticles,V as MinimalVisualization,I as NoObserverEffect,k as NoQuantumFluctuations,U as ParticleOnly,R as PreciseMeasurement,A as QuantumTunneling,C as RealTimeMode,z as SlowAnimation,G as SmallCanvas,L as StaticMode,E as WaveOnly,Oe as __namedExportsOrder,We as default};
