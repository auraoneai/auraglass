import{r as c,h as ze,j as r,c as De}from"./iframe-mbNquNNc.js";import{u as Ee}from"./MotionPreferenceContext-BfJvNZar.js";import{u as qe}from"./soundDesign-BPz1bpjX.js";import{O as Ce}from"./OptimizedGlassCore-CPvpl-y1.js";import{M as Ge}from"./MotionFramer-BekP4wEp.js";import"./preload-helper-PPVm8Dsz.js";import"./utilsCore-CTDrFk4s.js";const R=c.forwardRef(({width:i=800,height:u=600,nebulaType:h="emission",density:p=.7,temperature:f=1e4,stellarWindStrength:y=.5,layerCount:J=5,showStarClusters:W=!0,showCosmicDust:_=!0,animationSpeed:x=1,turbulenceLevel:Q=.6,colorIntensity:Z=.8,cameraDistance:ee=1,timeScale:b=1,ionizationLevel:S=.7,showEmissionLines:O=!0,showMagneticField:K=!1,onNebulaEvolution:ae,onStarFormation:se,showControls:Se=!0,showNebulaInfo:te=!0,respectMotionPreference:H=!0,className:we,...ne},Me)=>{const{prefersReducedMotion:re,isMotionSafe:Ne}=Ee(),{play:oe}=qe(),B=c.useRef(null),w=c.useRef(),Te=ze("glass-nebula-clouds"),[le,ie]=c.useState([]),[Y,Ie]=c.useState([]),[ue,ce]=c.useState([]),[v,$e]=c.useState(0),[de,Le]=c.useState(0),[M,U]=c.useState("formation"),me={emission:{colors:[[255,100,100],[100,255,100],[100,100,255],[255,255,100]],baseTemperature:1e4,ionizedGas:!0},reflection:{colors:[[150,200,255],[200,220,255],[120,180,255]],baseTemperature:3e3,ionizedGas:!1},dark:{colors:[[50,50,50],[80,60,40],[40,40,60]],baseTemperature:10,ionizedGas:!1},planetary:{colors:[[100,255,255],[255,100,255],[255,255,100],[100,255,100]],baseTemperature:5e4,ionizedGas:!0},supernova:{colors:[[255,255,255],[255,200,100],[255,100,100],[100,200,255]],baseTemperature:1e6,ionizedGas:!0}},pe=c.useCallback(t=>t<3e3?[255,100,0]:t<5e3?[255,200,100]:t<7e3?[255,255,200]:t<1e4?[200,220,255]:t<2e4?[150,200,255]:[100,150,255],[]),ge=c.useCallback(()=>{const t=me[h],e=[];for(let n=0;n<J;n++){const a=[],s=p*(1-n*.1),o=f*(1+(Math.random()-.5)*.3);for(let l=0;l<i;l+=20)for(let d=0;d<u;d+=20){const m=Math.sin(l*.01+n)*Math.cos(d*.01+n)*Math.sin(l*d*1e-4+n*2);Math.abs(m)>.3&&a.push({x:l+(Math.random()-.5)*40,y:d+(Math.random()-.5)*40,density:s*Math.abs(m),temperature:o*(.8+Math.random()*.4)})}e.push({name:`Layer ${n+1}`,points:a,color:t.colors[n%t.colors.length],opacity:Z*(.8-n*.1),scale:1+n*.2,rotation:0,rotationSpeed:(Math.random()-.5)*.001,turbulence:Q*(1+n*.1),id:`nebula-layer-${n}`})}ie(e)},[h,J,p,f,i,u,Z,Q]),he=c.useCallback(()=>{if(!W)return;const t=[],e=Math.floor(3+Math.random()*4);for(let n=0;n<e;n++){const a=Math.random()*i,s=Math.random()*u,o=Math.random()*.8+.2,l=Math.random()*100,d=[],m=Math.floor(o*20+10);for(let g=0;g<m;g++){const xe=Math.random()*Math.PI*2,ve=Math.random()*80,C=["O","B","A","F","G","K","M"][Math.floor(Math.random()*7)],ke={O:[150,180,255],B:[180,200,255],A:[220,230,255],F:[255,245,240],G:[255,255,200],K:[255,200,150],M:[255,150,100]};d.push({x:Math.cos(xe)*ve,y:Math.sin(xe)*ve,brightness:Math.random()*.8+.2,color:ke[C],size:C==="O"||C==="B"?3:C==="M"?1:2,twinklePhase:Math.random()*Math.PI*2,spectralClass:C})}t.push({x:a,y:s,stars:d,density:o,age:l,id:`cluster-${n}`})}Ie(t)},[W,i,u]),fe=c.useCallback(()=>{if(!_)return;const t=[],e=Math.floor(2+Math.random()*3);for(let n=0;n<e;n++){const a=[],s=Math.floor(p*100+50),o=["silicate","carbon","ice","organic"][Math.floor(Math.random()*4)],l={silicate:[150,120,80],carbon:[80,60,40],ice:[200,220,255],organic:[120,100,60]};for(let d=0;d<s;d++)a.push({x:Math.random()*i,y:Math.random()*u,vx:(Math.random()-.5)*y,vy:(Math.random()-.5)*y,size:Math.random()*2+.5,opacity:Math.random()*.3+.1,color:l[o],temperature:50+Math.random()*200,lifetime:Math.random()*1e4+5e3});t.push({particles:a,density:p*(.5+Math.random()*.5),composition:o,id:`dust-cloud-${n}`})}ce(t)},[_,p,i,u,y]);c.useEffect(()=>{ge(),he(),fe()},[ge,he,fe]);const be=c.useCallback(t=>{ie(e=>e.map(n=>({...n,rotation:n.rotation+n.rotationSpeed*t*x*b,points:n.points.map(a=>({...a,x:a.x+Math.sin(v*1e-4+a.y*.01)*n.turbulence*.1,y:a.y+Math.cos(v*1e-4+a.x*.01)*n.turbulence*.1,density:Math.max(.1,a.density+(Math.random()-.5)*.05*y)}))})))},[x,b,v,y]),ye=c.useCallback(t=>{ce(e=>e.map(n=>({...n,particles:n.particles.map(a=>({...a,x:a.x+a.vx*t*x,y:a.y+a.vy*t*x,lifetime:a.lifetime-t,opacity:Math.max(0,a.opacity-t*5e-5)})).filter(a=>a.lifetime>0&&a.x>-50&&a.x<i+50&&a.y>-50&&a.y<u+50)})))},[x,i,u]);c.useEffect(()=>{const t=setInterval(()=>{Le(e=>{const n=e+b*.1;if(n<10?U("formation"):n<50?U("mature"):U("dispersing"),ae?.(n,M),Math.random()<.05*b){const a={x:Math.random()*i,y:Math.random()*u};se?.(a),oe("success")}return n})},5e3);return()=>clearInterval(t)},[b,M,ae,se,i,u,oe]);const X=c.useCallback(()=>{const t=B.current;if(!t)return;const e=t.getContext("2d");if(!e)return;const n=e.createRadialGradient(i/2,u/2,0,i/2,u/2,Math.max(i,u)/2);n.addColorStop(0,"rgb(5, 5, 15)"),n.addColorStop(1,"rgb(0, 0, 5)"),e.fillStyle=n,e.fillRect(0,0,i,u),e.fillStyle="white";for(let a=0;a<100;a++){const s=Math.random()*i,o=Math.random()*u,l=Math.random();e.globalAlpha=l*.5,e.beginPath(),e.arc(s,o,l,0,Math.PI*2),e.fill()}if(ue.forEach(a=>{a.particles.forEach(s=>{s.opacity<.01||(e.globalAlpha=s.opacity,e.fillStyle=`rgb(${s.color[0]}, ${s.color[1]}, ${s.color[2]})`,e.beginPath(),e.arc(s.x,s.y,s.size,0,Math.PI*2),e.fill())})}),e.globalAlpha=1,le.forEach((a,s)=>{if(e.save(),e.translate(i/2,u/2),e.rotate(a.rotation),e.scale(a.scale,a.scale),e.translate(-i/2,-u/2),a.points.forEach(o=>{const l=o.density*p;if(l<.1)return;const d=Math.max(10,l*30/ee),m=S>.5?a.color:pe(o.temperature),g=e.createRadialGradient(o.x,o.y,0,o.x,o.y,d);g.addColorStop(0,`rgba(${m[0]}, ${m[1]}, ${m[2]}, ${a.opacity*l})`),g.addColorStop(.5,`rgba(${m[0]}, ${m[1]}, ${m[2]}, ${a.opacity*l*.5})`),g.addColorStop(1,`rgba(${m[0]}, ${m[1]}, ${m[2]}, 0)`),e.fillStyle=g,e.beginPath(),e.arc(o.x,o.y,d,0,Math.PI*2),e.fill()}),O&&me[h].ionizedGas){e.globalAlpha=S*.3,e.strokeStyle=`rgb(${a.color[0]}, ${a.color[1]}, ${a.color[2]})`,e.lineWidth=1;for(let o=0;o<a.points.length-1;o+=10){const l=a.points[o],d=a.points[o+1];!l||!d||(e.beginPath(),e.moveTo(l.x,l.y),e.lineTo(d.x,d.y),e.stroke())}}e.restore()}),K){e.strokeStyle="rgba(100, 255, 255, 0.2)",e.lineWidth=1,e.globalAlpha=.3;for(let a=0;a<i;a+=100)for(let s=0;s<u;s+=100){const o=Math.sin(a*.01)*Math.cos(s*.01);Math.abs(o)>.3&&(e.beginPath(),e.moveTo(a,s),e.bezierCurveTo(a+50,s+o*30,a+80,s+o*20,a+100,s),e.stroke())}}Y.forEach(a=>{a.stars.forEach(s=>{const o=Math.sin(v*.005+s.twinklePhase)*.3+.7;e.globalAlpha=s.brightness*o;const l=e.createRadialGradient(a.x+s.x,a.y+s.y,0,a.x+s.x,a.y+s.y,s.size*3);l.addColorStop(0,`rgb(${s.color[0]}, ${s.color[1]}, ${s.color[2]})`),l.addColorStop(.3,`rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, 0.8)`),l.addColorStop(1,`rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, 0)`),e.fillStyle=l,e.beginPath(),e.arc(a.x+s.x,a.y+s.y,s.size*3,0,Math.PI*2),e.fill(),e.fillStyle=`rgb(${s.color[0]}, ${s.color[1]}, ${s.color[2]})`,e.beginPath(),e.arc(a.x+s.x,a.y+s.y,s.size,0,Math.PI*2),e.fill()})}),te&&(e.save(),e.fillStyle="var(--glass-text-secondary-dark)",e.fillRect(10,10,250,160),e.fillStyle="white",e.font="14px sans-serif",e.fillText(`Nebula Type: ${h}`,20,30),e.fillText(`Age: ${de.toFixed(1)} million years`,20,50),e.fillText(`Phase: ${M}`,20,70),e.fillText(`Temperature: ${f.toLocaleString()} K`,20,90),e.fillText(`Density: ${Math.round(p*100)}%`,20,110),e.fillText(`Ionization: ${Math.round(S*100)}%`,20,130),e.fillText(`Star Clusters: ${Y.length}`,20,150),e.restore())},[i,u,ue,le,p,ee,S,pe,O,h,K,v,Y,te,de,M,f]);c.useEffect(()=>{if(re&&H){X();return}const t=e=>{$e(a=>a+16),be(16),ye(16),X(),w.current=requestAnimationFrame(t)};return w.current=requestAnimationFrame(t),()=>{w.current&&cancelAnimationFrame(w.current)}},[re,H,X,be,ye]),c.useEffect(()=>{const t=B.current;t&&(t.width=i,t.height=u)},[i,u]);const je=()=>Se?r.jsxs(Ce,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:"glass-nebula-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard",children:[r.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[r.jsx("label",{htmlFor:"nebula-type",className:"glass-text-sm",children:"Type:"}),r.jsxs("select",{id:"nebula-type",value:h,onChange:t=>{},"aria-label":"Nebula type selection",className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20 glass-contrast-guard glass-focus glass-touch-target",children:[r.jsx("option",{value:"emission",children:"Emission"}),r.jsx("option",{value:"reflection",children:"Reflection"}),r.jsx("option",{value:"dark",children:"Dark"}),r.jsx("option",{value:"planetary",children:"Planetary"}),r.jsx("option",{value:"supernova",children:"Supernova"})]})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[r.jsx("label",{htmlFor:"nebula-density",className:"glass-text-sm",children:"Density:"}),r.jsx("input",{id:"nebula-density",type:"range",min:"0.1",max:"1",step:"0.1",value:p,onChange:t=>{},"aria-label":"Nebula density",className:"glass-w-20 glass-focus glass-touch-target glass-contrast-guard"})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[r.jsx("label",{htmlFor:"nebula-temperature",className:"glass-text-sm",children:"Temperature:"}),r.jsx("input",{id:"nebula-temperature",type:"range",min:"10",max:"100000",step:"1000",value:f,onChange:t=>{},"aria-label":"Nebula temperature in Kelvin",className:"glass-w-20 glass-focus glass-touch-target glass-contrast-guard"}),r.jsxs("span",{className:"glass-text-xs",children:[(f/1e3).toFixed(1),"K K"]})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[r.jsx("label",{htmlFor:"nebula-timescale",className:"glass-text-sm",children:"Time Scale:"}),r.jsx("input",{id:"nebula-timescale",type:"range",min:"0.1",max:"10",step:"0.1",value:b,onChange:t=>{},"aria-label":"Time scale multiplier",className:"glass-w-20 glass-focus glass-touch-target glass-contrast-guard"})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[r.jsxs("label",{className:"glass-text-sm",children:[r.jsx("input",{type:"checkbox",checked:W,onChange:t=>{},"aria-label":"Show star clusters",className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Stars"]}),r.jsxs("label",{className:"glass-text-sm",children:[r.jsx("input",{type:"checkbox",checked:_,onChange:t=>{},"aria-label":"Show cosmic dust",className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Dust"]}),r.jsxs("label",{className:"glass-text-sm",children:[r.jsx("input",{type:"checkbox",checked:O,onChange:t=>{},"aria-label":"Show emission lines",className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Emission"]}),r.jsxs("label",{className:"glass-text-sm",children:[r.jsx("input",{type:"checkbox",checked:K,onChange:t=>{},"aria-label":"Show magnetic field",className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Magnetic"]})]})]}):null;return r.jsx(Ce,{ref:Me,id:Te,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",className:De("glass-nebula-clouds relative glass-radius-lg glass-glass-backdrop-blur-md border border-border/20",we),"data-testid":ne["data-testid"],role:"region","aria-label":"Nebula clouds visualization with controls",...ne,children:r.jsxs(Ge,{preset:Ne&&H?"fadeIn":"none",className:"glass-flex glass-flex-col glass-gap-4 glass-p-4",children:[je(),r.jsx("div",{className:"glass-relative",children:r.jsx("canvas",{ref:B,width:i,height:u,className:"glass-border glass-border-glass-border/20 glass-radius-md glass-surface-dark glass-contrast-guard",style:{width:i,height:u}})})]})})});R.displayName="GlassNebulaClouds";try{R.displayName="GlassNebulaClouds",R.__docgenInfo={description:"",displayName:"GlassNebulaClouds",props:{width:{defaultValue:{value:"800"},description:"Canvas width",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"600"},description:"Canvas height",name:"height",required:!1,type:{name:"number | undefined"}},nebulaType:{defaultValue:{value:"emission"},description:"Nebula type",name:"nebulaType",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"dark"'},{value:'"emission"'},{value:'"reflection"'},{value:'"planetary"'},{value:'"supernova"'}]}},density:{defaultValue:{value:"0.7"},description:"Overall nebula density",name:"density",required:!1,type:{name:"number | undefined"}},temperature:{defaultValue:{value:"10000"},description:"Gas temperature (affects color)",name:"temperature",required:!1,type:{name:"number | undefined"}},stellarWindStrength:{defaultValue:{value:"0.5"},description:"Stellar wind strength",name:"stellarWindStrength",required:!1,type:{name:"number | undefined"}},layerCount:{defaultValue:{value:"5"},description:"Number of nebula layers",name:"layerCount",required:!1,type:{name:"number | undefined"}},showStarClusters:{defaultValue:{value:"true"},description:"Show star clusters",name:"showStarClusters",required:!1,type:{name:"boolean | undefined"}},showCosmicDust:{defaultValue:{value:"true"},description:"Show cosmic dust",name:"showCosmicDust",required:!1,type:{name:"boolean | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"Animation speed",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},turbulenceLevel:{defaultValue:{value:"0.6"},description:"Turbulence level",name:"turbulenceLevel",required:!1,type:{name:"number | undefined"}},colorIntensity:{defaultValue:{value:"0.8"},description:"Color intensity",name:"colorIntensity",required:!1,type:{name:"number | undefined"}},cameraDistance:{defaultValue:{value:"1"},description:"Camera distance (affects perspective)",name:"cameraDistance",required:!1,type:{name:"number | undefined"}},timeScale:{defaultValue:{value:"1"},description:"Time scale (affects evolution)",name:"timeScale",required:!1,type:{name:"number | undefined"}},ionizationLevel:{defaultValue:{value:"0.7"},description:"Ionization level",name:"ionizationLevel",required:!1,type:{name:"number | undefined"}},showEmissionLines:{defaultValue:{value:"true"},description:"Whether to show emission lines",name:"showEmissionLines",required:!1,type:{name:"boolean | undefined"}},showMagneticField:{defaultValue:{value:"false"},description:"Magnetic field visualization",name:"showMagneticField",required:!1,type:{name:"boolean | undefined"}},onNebulaEvolution:{defaultValue:null,description:"Nebula evolution handler",name:"onNebulaEvolution",required:!1,type:{name:"((age: number, state: string) => void) | undefined"}},onStarFormation:{defaultValue:null,description:"Star formation handler",name:"onStarFormation",required:!1,type:{name:"((location: { x: number; y: number; }) => void) | undefined"}},showControls:{defaultValue:{value:"true"},description:"Show controls",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showNebulaInfo:{defaultValue:{value:"true"},description:"Show nebula info",name:"showNebulaInfo",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Respect user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const Oe={title:"Glass UI/Atmospheric/GlassNebulaClouds",component:R,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{width:{control:{type:"range",min:400,max:1200,step:50}},height:{control:{type:"range",min:300,max:800,step:50}},density:{control:{type:"range",min:.1,max:1,step:.1}},temperature:{control:{type:"range",min:10,max:1e5,step:1e3}},stellarWindStrength:{control:{type:"range",min:0,max:1,step:.1}},colorIntensity:{control:{type:"range",min:.1,max:1,step:.1}},turbulenceLevel:{control:{type:"range",min:.1,max:2,step:.1}},timeScale:{control:{type:"range",min:.1,max:10,step:.1}},nebulaType:{control:{type:"select"},options:["emission","reflection","dark","planetary","supernova"]}}},N={args:{width:800,height:600,showControls:!0,showNebulaInfo:!0,showStarClusters:!0,showCosmicDust:!0}},T={args:{width:700,height:500,nebulaType:"emission",temperature:1e4,density:.8,ionizationLevel:.9,showEmissionLines:!0,colorIntensity:.9}},I={args:{width:600,height:400,nebulaType:"reflection",temperature:3e3,density:.6,ionizationLevel:.2,showStarClusters:!0,showCosmicDust:!0}},$={args:{width:650,height:450,nebulaType:"dark",temperature:10,density:.9,colorIntensity:.4,showCosmicDust:!0,showStarClusters:!1}},L={args:{width:500,height:500,nebulaType:"planetary",temperature:5e4,density:.5,ionizationLevel:1,layerCount:3,showEmissionLines:!0,turbulenceLevel:.3}},j={args:{width:800,height:600,nebulaType:"supernova",temperature:1e6,density:.4,stellarWindStrength:.9,turbulenceLevel:1.5,showMagneticField:!0,colorIntensity:1}},k={args:{width:700,height:500,nebulaType:"emission",density:.9,temperature:15e3,timeScale:5,showStarClusters:!0,turbulenceLevel:.8}},z={args:{width:750,height:550,nebulaType:"emission",density:.6,temperature:8e3,timeScale:2,stellarWindStrength:.7,layerCount:6}},D={args:{width:800,height:600,nebulaType:"reflection",density:.3,temperature:5e3,stellarWindStrength:.8,timeScale:1,colorIntensity:.5}},E={args:{width:600,height:400,turbulenceLevel:2,stellarWindStrength:.9,density:.8,animationSpeed:1.5,layerCount:7}},q={args:{width:700,height:500,nebulaType:"dark",temperature:20,density:1,showCosmicDust:!0,showStarClusters:!0,colorIntensity:.3}},G={args:{width:650,height:450,nebulaType:"emission",temperature:3e4,ionizationLevel:1,density:.7,showEmissionLines:!0,colorIntensity:1}},V={args:{width:400,height:300,showControls:!1,showNebulaInfo:!1,nebulaType:"emission",density:.6,showStarClusters:!0}},F={args:{width:800,height:600,showMagneticField:!0,nebulaType:"supernova",stellarWindStrength:.8,ionizationLevel:.9,turbulenceLevel:1.2}},P={args:{width:750,height:550,nebulaType:"emission",density:.9,temperature:12e3,showStarClusters:!0,showCosmicDust:!0,timeScale:3,turbulenceLevel:.9}},A={args:{width:900,height:700,layerCount:8,density:.8,temperature:15e3,showStarClusters:!0,showCosmicDust:!0,showEmissionLines:!0,showMagneticField:!0,turbulenceLevel:1.5,colorIntensity:.9,stellarWindStrength:.7}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    showControls: true,
    showNebulaInfo: true,
    showStarClusters: true,
    showCosmicDust: true
  }
}`,...N.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 500,
    nebulaType: 'emission',
    temperature: 10000,
    density: 0.8,
    ionizationLevel: 0.9,
    showEmissionLines: true,
    colorIntensity: 0.9
  }
}`,...T.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    nebulaType: 'reflection',
    temperature: 3000,
    density: 0.6,
    ionizationLevel: 0.2,
    showStarClusters: true,
    showCosmicDust: true
  }
}`,...I.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    width: 650,
    height: 450,
    nebulaType: 'dark',
    temperature: 10,
    density: 0.9,
    colorIntensity: 0.4,
    showCosmicDust: true,
    showStarClusters: false
  }
}`,...$.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    width: 500,
    height: 500,
    nebulaType: 'planetary',
    temperature: 50000,
    density: 0.5,
    ionizationLevel: 1,
    layerCount: 3,
    showEmissionLines: true,
    turbulenceLevel: 0.3
  }
}`,...L.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    nebulaType: 'supernova',
    temperature: 1000000,
    density: 0.4,
    stellarWindStrength: 0.9,
    turbulenceLevel: 1.5,
    showMagneticField: true,
    colorIntensity: 1
  }
}`,...j.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 500,
    nebulaType: 'emission',
    density: 0.9,
    temperature: 15000,
    timeScale: 5,
    showStarClusters: true,
    turbulenceLevel: 0.8
  }
}`,...k.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    width: 750,
    height: 550,
    nebulaType: 'emission',
    density: 0.6,
    temperature: 8000,
    timeScale: 2,
    stellarWindStrength: 0.7,
    layerCount: 6
  }
}`,...z.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    nebulaType: 'reflection',
    density: 0.3,
    temperature: 5000,
    stellarWindStrength: 0.8,
    timeScale: 1,
    colorIntensity: 0.5
  }
}`,...D.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    turbulenceLevel: 2,
    stellarWindStrength: 0.9,
    density: 0.8,
    animationSpeed: 1.5,
    layerCount: 7
  }
}`,...E.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 500,
    nebulaType: 'dark',
    temperature: 20,
    density: 1,
    showCosmicDust: true,
    showStarClusters: true,
    colorIntensity: 0.3
  }
}`,...q.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    width: 650,
    height: 450,
    nebulaType: 'emission',
    temperature: 30000,
    ionizationLevel: 1,
    density: 0.7,
    showEmissionLines: true,
    colorIntensity: 1
  }
}`,...G.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 300,
    showControls: false,
    showNebulaInfo: false,
    nebulaType: 'emission',
    density: 0.6,
    showStarClusters: true
  }
}`,...V.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    showMagneticField: true,
    nebulaType: 'supernova',
    stellarWindStrength: 0.8,
    ionizationLevel: 0.9,
    turbulenceLevel: 1.2
  }
}`,...F.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    width: 750,
    height: 550,
    nebulaType: 'emission',
    density: 0.9,
    temperature: 12000,
    showStarClusters: true,
    showCosmicDust: true,
    timeScale: 3,
    turbulenceLevel: 0.9
  }
}`,...P.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    width: 900,
    height: 700,
    layerCount: 8,
    density: 0.8,
    temperature: 15000,
    showStarClusters: true,
    showCosmicDust: true,
    showEmissionLines: true,
    showMagneticField: true,
    turbulenceLevel: 1.5,
    colorIntensity: 0.9,
    stellarWindStrength: 0.7
  }
}`,...A.parameters?.docs?.source}}};const Ke=["Default","EmissionNebula","ReflectionNebula","DarkNebula","PlanetaryNebula","SupernovaRemnant","YoungNebula","MaturingNebula","DispersingNebula","HighTurbulence","ColdMolecularCloud","HotIonizedGas","MinimalInterface","MagneticFieldVisible","StarFormingRegion","ComplexNebula"];export{q as ColdMolecularCloud,A as ComplexNebula,$ as DarkNebula,N as Default,D as DispersingNebula,T as EmissionNebula,E as HighTurbulence,G as HotIonizedGas,F as MagneticFieldVisible,z as MaturingNebula,V as MinimalInterface,L as PlanetaryNebula,I as ReflectionNebula,P as StarFormingRegion,j as SupernovaRemnant,k as YoungNebula,Ke as __namedExportsOrder,Oe as default};
