import{r as c,j as o,c as Ee,R as Ce}from"./iframe-D8J9cnFR.js";import{u as De}from"./a11y-CN6sYyZZ.js";import{u as Re}from"./MotionPreferenceContext-D_H4P3UO.js";import{u as qe}from"./soundDesign-kt0K90Ii.js";import{O as we}from"./OptimizedGlassCore-BnRS7lWr.js";import{M as Ve}from"./MotionFramer-BPZ4j4Tf.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-D-Vbq3pm.js";import"./utilsCore-DvvNjYyo.js";const w=c.forwardRef(({width:r=800,height:l=600,nebulaType:f="emission",density:p=.7,temperature:h=1e4,stellarWindStrength:g=.5,layerCount:Q=5,showStarClusters:W=!0,showCosmicDust:_=!0,animationSpeed:x=1,turbulenceLevel:U=.6,colorIntensity:Z=.8,cameraDistance:ee=1,timeScale:y=1,ionizationLevel:S=.7,showEmissionLines:O=!0,showMagneticField:K=!1,onNebulaEvolution:se,onStarFormation:ae,showControls:Se=!0,showNebulaInfo:te=!0,respectMotionPreference:B=!0,className:Me,...ne},Ne)=>{const{prefersReducedMotion:re,isMotionSafe:Te}=Re(),{play:oe}=qe(),Y=c.useRef(null),M=c.useRef(),Le=De("glass-nebula-clouds"),[le,ie]=c.useState([]),[H,Ie]=c.useState([]),[ue,ce]=c.useState([]),[v,$e]=c.useState(0),[de,je]=c.useState(0),[N,X]=c.useState("formation"),me={emission:{colors:[[255,100,100],[100,255,100],[100,100,255],[255,255,100]],baseTemperature:1e4,ionizedGas:!0},reflection:{colors:[[150,200,255],[200,220,255],[120,180,255]],baseTemperature:3e3,ionizedGas:!1},dark:{colors:[[50,50,50],[80,60,40],[40,40,60]],baseTemperature:10,ionizedGas:!1},planetary:{colors:[[100,255,255],[255,100,255],[255,255,100],[100,255,100]],baseTemperature:5e4,ionizedGas:!0},supernova:{colors:[[255,255,255],[255,200,100],[255,100,100],[100,200,255]],baseTemperature:1e6,ionizedGas:!0}},pe=c.useCallback(t=>t<3e3?[255,100,0]:t<5e3?[255,200,100]:t<7e3?[255,255,200]:t<1e4?[200,220,255]:t<2e4?[150,200,255]:[100,150,255],[]),he=c.useCallback(()=>{const t=me[f],e=[];for(let n=0;n<Q;n++){const s=[],a=p*(1-n*.1),i=h*(1+(Math.random()-.5)*.3);for(let u=0;u<r;u+=20)for(let d=0;d<l;d+=20){const m=Math.sin(u*.01+n)*Math.cos(d*.01+n)*Math.sin(u*d*1e-4+n*2);Math.abs(m)>.3&&s.push({x:u+(Math.random()-.5)*40,y:d+(Math.random()-.5)*40,density:a*Math.abs(m),temperature:i*(.8+Math.random()*.4)})}e.push({name:`Layer ${n+1}`,points:s,color:t.colors[n%t.colors.length],opacity:Z*(.8-n*.1),scale:1+n*.2,rotation:0,rotationSpeed:(Math.random()-.5)*.001,turbulence:U*(1+n*.1),id:`nebula-layer-${n}`})}ie(e)},[f,Q,p,h,r,l,Z,U]),ge=c.useCallback(()=>{if(!W)return;const t=[],e=Math.floor(3+Math.random()*4);for(let n=0;n<e;n++){const s=Math.random()*r,a=Math.random()*l,i=Math.random()*.8+.2,u=Math.random()*100,d=[],m=Math.floor(i*20+10);for(let b=0;b<m;b++){const xe=Math.random()*Math.PI*2,ve=Math.random()*80,C=["O","B","A","F","G","K","M"][Math.floor(Math.random()*7)],ze={O:[150,180,255],B:[180,200,255],A:[220,230,255],F:[255,245,240],G:[255,255,200],K:[255,200,150],M:[255,150,100]};d.push({x:Math.cos(xe)*ve,y:Math.sin(xe)*ve,brightness:Math.random()*.8+.2,color:ze[C],size:C==="O"||C==="B"?3:C==="M"?1:2,twinklePhase:Math.random()*Math.PI*2,spectralClass:C})}t.push({x:s,y:a,stars:d,density:i,age:u,id:`cluster-${n}`})}Ie(t)},[W,r,l]),fe=c.useCallback(()=>{if(!_)return;const t=[],e=Math.floor(2+Math.random()*3);for(let n=0;n<e;n++){const s=[],a=Math.floor(p*100+50),i=["silicate","carbon","ice","organic"][Math.floor(Math.random()*4)],u={silicate:[150,120,80],carbon:[80,60,40],ice:[200,220,255],organic:[120,100,60]};for(let d=0;d<a;d++)s.push({x:Math.random()*r,y:Math.random()*l,vx:(Math.random()-.5)*g,vy:(Math.random()-.5)*g,size:Math.random()*2+.5,opacity:Math.random()*.3+.1,color:u[i],temperature:50+Math.random()*200,lifetime:Math.random()*1e4+5e3});t.push({particles:s,density:p*(.5+Math.random()*.5),composition:i,id:`dust-cloud-${n}`})}ce(t)},[_,p,r,l,g]);c.useEffect(()=>{he(),ge(),fe()},[he,ge,fe]);const be=c.useCallback(t=>{ie(e=>e.map(n=>({...n,rotation:n.rotation+n.rotationSpeed*t*x*y,points:n.points.map(s=>({...s,x:s.x+Math.sin(v*1e-4+s.y*.01)*n.turbulence*.1,y:s.y+Math.cos(v*1e-4+s.x*.01)*n.turbulence*.1,density:Math.max(.1,s.density+(Math.random()-.5)*.05*g)}))})))},[x,y,v,g]),ye=c.useCallback(t=>{ce(e=>e.map(n=>({...n,particles:n.particles.map(s=>({...s,x:s.x+s.vx*t*x,y:s.y+s.vy*t*x,lifetime:s.lifetime-t,opacity:Math.max(0,s.opacity-t*5e-5)})).filter(s=>s.lifetime>0&&s.x>-50&&s.x<r+50&&s.y>-50&&s.y<l+50)})))},[x,r,l]);c.useEffect(()=>{const t=setInterval(()=>{je(e=>{const n=e+y*.1;if(n<10?X("formation"):n<50?X("mature"):X("dispersing"),se?.(n,N),Math.random()<.05*y){const s={x:Math.random()*r,y:Math.random()*l};ae?.(s),oe("success")}return n})},5e3);return()=>clearInterval(t)},[y,N,se,ae,r,l,oe]);const J=c.useCallback(()=>{const t=Y.current;if(!t)return;const e=t.getContext("2d");if(!e)return;const n=e.createRadialGradient(r/2,l/2,0,r/2,l/2,Math.max(r,l)/2);n.addColorStop(0,"rgb(5, 5, 15)"),n.addColorStop(1,"rgb(0, 0, 5)"),e.fillStyle=n,e.fillRect(0,0,r,l),e.fillStyle="white";for(let s=0;s<100;s++){const a=Math.random()*r,i=Math.random()*l,u=Math.random();e.globalAlpha=u*.5,e.beginPath(),e.arc(a,i,u,0,Math.PI*2),e.fill()}if(ue.forEach(s=>{s.particles.forEach(a=>{a.opacity<.01||(e.globalAlpha=a.opacity,e.fillStyle=`rgb(${a.color[0]}, ${a.color[1]}, ${a.color[2]})`,e.beginPath(),e.arc(a.x,a.y,a.size,0,Math.PI*2),e.fill())})}),e.globalAlpha=1,le.forEach((s,a)=>{if(e.save(),e.translate(r/2,l/2),e.rotate(s.rotation),e.scale(s.scale,s.scale),e.translate(-r/2,-l/2),s.points.forEach(i=>{const u=i.density*p;if(u<.1)return;const d=Math.max(10,u*30/ee),m=S>.5?s.color:pe(i.temperature),b=e.createRadialGradient(i.x,i.y,0,i.x,i.y,d);b.addColorStop(0,`rgba(${m[0]}, ${m[1]}, ${m[2]}, ${s.opacity*u})`),b.addColorStop(.5,`rgba(${m[0]}, ${m[1]}, ${m[2]}, ${s.opacity*u*.5})`),b.addColorStop(1,`rgba(${m[0]}, ${m[1]}, ${m[2]}, 0)`),e.fillStyle=b,e.beginPath(),e.arc(i.x,i.y,d,0,Math.PI*2),e.fill()}),O&&me[f].ionizedGas){e.globalAlpha=S*.3,e.strokeStyle=`rgb(${s.color[0]}, ${s.color[1]}, ${s.color[2]})`,e.lineWidth=1;for(let i=0;i<s.points.length-1;i+=10){const u=s.points[i],d=s.points[i+1];!u||!d||(e.beginPath(),e.moveTo(u.x,u.y),e.lineTo(d.x,d.y),e.stroke())}}e.restore()}),K){e.strokeStyle="rgba(100, 255, 255, 0.2)",e.lineWidth=1,e.globalAlpha=.3;for(let s=0;s<r;s+=100)for(let a=0;a<l;a+=100){const i=Math.sin(s*.01)*Math.cos(a*.01);Math.abs(i)>.3&&(e.beginPath(),e.moveTo(s,a),e.bezierCurveTo(s+50,a+i*30,s+80,a+i*20,s+100,a),e.stroke())}}H.forEach(s=>{s.stars.forEach(a=>{const i=Math.sin(v*.005+a.twinklePhase)*.3+.7;e.globalAlpha=a.brightness*i;const u=e.createRadialGradient(s.x+a.x,s.y+a.y,0,s.x+a.x,s.y+a.y,a.size*3);u.addColorStop(0,`rgb(${a.color[0]}, ${a.color[1]}, ${a.color[2]})`),u.addColorStop(.3,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, 0.8)`),u.addColorStop(1,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, 0)`),e.fillStyle=u,e.beginPath(),e.arc(s.x+a.x,s.y+a.y,a.size*3,0,Math.PI*2),e.fill(),e.fillStyle=`rgb(${a.color[0]}, ${a.color[1]}, ${a.color[2]})`,e.beginPath(),e.arc(s.x+a.x,s.y+a.y,a.size,0,Math.PI*2),e.fill()})}),te&&(e.save(),e.fillStyle="var(--glass-text-secondary-dark)",e.fillRect(10,10,250,160),e.fillStyle="white",e.font="14px sans-serif",e.fillText(`Nebula Type: ${f}`,20,30),e.fillText(`Age: ${de.toFixed(1)} million years`,20,50),e.fillText(`Phase: ${N}`,20,70),e.fillText(`Temperature: ${h.toLocaleString()} K`,20,90),e.fillText(`Density: ${Math.round(p*100)}%`,20,110),e.fillText(`Ionization: ${Math.round(S*100)}%`,20,130),e.fillText(`Star Clusters: ${H.length}`,20,150),e.restore())},[r,l,ue,le,p,ee,S,pe,O,f,K,v,H,te,de,N,h]);c.useEffect(()=>{if(re&&B){J();return}const t=e=>{$e(s=>s+16),be(16),ye(16),J(),M.current=requestAnimationFrame(t)};return M.current=requestAnimationFrame(t),()=>{M.current&&cancelAnimationFrame(M.current)}},[re,B,J,be,ye]),c.useEffect(()=>{const t=Y.current;t&&(t.width=r,t.height=l)},[r,l]);const ke=()=>Se?o.jsxs(we,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:"glass-nebula-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard",children:[o.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[o.jsx("label",{htmlFor:"nebula-type",className:"glass-text-sm",children:"Type:"}),o.jsxs("select",{id:"nebula-type",value:f,onChange:t=>{},"aria-label":"Nebula type selection",className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20 glass-contrast-guard glass-focus glass-touch-target",children:[o.jsx("option",{value:"emission",children:"Emission"}),o.jsx("option",{value:"reflection",children:"Reflection"}),o.jsx("option",{value:"dark",children:"Dark"}),o.jsx("option",{value:"planetary",children:"Planetary"}),o.jsx("option",{value:"supernova",children:"Supernova"})]})]}),o.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[o.jsx("label",{htmlFor:"nebula-density",className:"glass-text-sm",children:"Density:"}),o.jsx("input",{id:"nebula-density",type:"range",min:"0.1",max:"1",step:"0.1",value:p,onChange:t=>{},"aria-label":"Nebula density",className:"glass-w-20 glass-focus glass-touch-target glass-contrast-guard"})]}),o.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[o.jsx("label",{htmlFor:"nebula-temperature",className:"glass-text-sm",children:"Temperature:"}),o.jsx("input",{id:"nebula-temperature",type:"range",min:"10",max:"100000",step:"1000",value:h,onChange:t=>{},"aria-label":"Nebula temperature in Kelvin",className:"glass-w-20 glass-focus glass-touch-target glass-contrast-guard"}),o.jsxs("span",{className:"glass-text-xs",children:[(h/1e3).toFixed(1),"K K"]})]}),o.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[o.jsx("label",{htmlFor:"nebula-timescale",className:"glass-text-sm",children:"Time Scale:"}),o.jsx("input",{id:"nebula-timescale",type:"range",min:"0.1",max:"10",step:"0.1",value:y,onChange:t=>{},"aria-label":"Time scale multiplier",className:"glass-w-20 glass-focus glass-touch-target glass-contrast-guard"})]}),o.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[o.jsxs("label",{className:"glass-text-sm",children:[o.jsx("input",{type:"checkbox",checked:W,onChange:t=>{},"aria-label":"Show star clusters",className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Stars"]}),o.jsxs("label",{className:"glass-text-sm",children:[o.jsx("input",{type:"checkbox",checked:_,onChange:t=>{},"aria-label":"Show cosmic dust",className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Dust"]}),o.jsxs("label",{className:"glass-text-sm",children:[o.jsx("input",{type:"checkbox",checked:O,onChange:t=>{},"aria-label":"Show emission lines",className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Emission"]}),o.jsxs("label",{className:"glass-text-sm",children:[o.jsx("input",{type:"checkbox",checked:K,onChange:t=>{},"aria-label":"Show magnetic field",className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Magnetic"]})]})]}):null;return o.jsx(we,{ref:Ne,id:Le,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",className:Ee("glass-nebula-clouds relative glass-radius-lg glass-backdrop-blur border border-border/20",Me),"data-testid":ne["data-testid"],role:"region","aria-label":"Nebula clouds visualization with controls",...ne,children:o.jsxs(Ve,{preset:Te&&B?"fadeIn":"none",className:"glass-flex glass-flex-col glass-gap-4 glass-p-4",children:[ke(),o.jsx("div",{className:"glass-relative",children:o.jsx("canvas",{ref:Y,width:r,height:l,className:"glass-border glass-border-glass-border/20 glass-radius-md glass-surface-dark glass-contrast-guard",style:{width:r,height:l}})})]})})});w.displayName="GlassNebulaClouds";try{w.displayName="GlassNebulaClouds",w.__docgenInfo={description:"",displayName:"GlassNebulaClouds",props:{width:{defaultValue:{value:"800"},description:"Canvas width",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"600"},description:"Canvas height",name:"height",required:!1,type:{name:"number | undefined"}},nebulaType:{defaultValue:{value:"emission"},description:"Nebula type",name:"nebulaType",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"dark"'},{value:'"emission"'},{value:'"reflection"'},{value:'"planetary"'},{value:'"supernova"'}]}},density:{defaultValue:{value:"0.7"},description:"Overall nebula density",name:"density",required:!1,type:{name:"number | undefined"}},temperature:{defaultValue:{value:"10000"},description:"Gas temperature (affects color)",name:"temperature",required:!1,type:{name:"number | undefined"}},stellarWindStrength:{defaultValue:{value:"0.5"},description:"Stellar wind strength",name:"stellarWindStrength",required:!1,type:{name:"number | undefined"}},layerCount:{defaultValue:{value:"5"},description:"Number of nebula layers",name:"layerCount",required:!1,type:{name:"number | undefined"}},showStarClusters:{defaultValue:{value:"true"},description:"Show star clusters",name:"showStarClusters",required:!1,type:{name:"boolean | undefined"}},showCosmicDust:{defaultValue:{value:"true"},description:"Show cosmic dust",name:"showCosmicDust",required:!1,type:{name:"boolean | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"Animation speed",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},turbulenceLevel:{defaultValue:{value:"0.6"},description:"Turbulence level",name:"turbulenceLevel",required:!1,type:{name:"number | undefined"}},colorIntensity:{defaultValue:{value:"0.8"},description:"Color intensity",name:"colorIntensity",required:!1,type:{name:"number | undefined"}},cameraDistance:{defaultValue:{value:"1"},description:"Camera distance (affects perspective)",name:"cameraDistance",required:!1,type:{name:"number | undefined"}},timeScale:{defaultValue:{value:"1"},description:"Time scale (affects evolution)",name:"timeScale",required:!1,type:{name:"number | undefined"}},ionizationLevel:{defaultValue:{value:"0.7"},description:"Ionization level",name:"ionizationLevel",required:!1,type:{name:"number | undefined"}},showEmissionLines:{defaultValue:{value:"true"},description:"Whether to show emission lines",name:"showEmissionLines",required:!1,type:{name:"boolean | undefined"}},showMagneticField:{defaultValue:{value:"false"},description:"Magnetic field visualization",name:"showMagneticField",required:!1,type:{name:"boolean | undefined"}},onNebulaEvolution:{defaultValue:null,description:"Nebula evolution handler",name:"onNebulaEvolution",required:!1,type:{name:"((age: number, state: string) => void) | undefined"}},onStarFormation:{defaultValue:null,description:"Star formation handler",name:"onStarFormation",required:!1,type:{name:"((location: { x: number; y: number; }) => void) | undefined"}},showControls:{defaultValue:{value:"true"},description:"Show controls",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showNebulaInfo:{defaultValue:{value:"true"},description:"Show nebula info",name:"showNebulaInfo",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Respect user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const Fe=(r,l)=>{const[f,p]=Ce.useState({width:r,height:l,mobile:!1});return Ce.useEffect(()=>{const h=()=>{const g=window.innerWidth<520;p({width:g?Math.min(260,window.innerWidth-96):r,height:g?320:l,mobile:g})};return h(),window.addEventListener("resize",h),()=>window.removeEventListener("resize",h)},[l,r]),f},Ge=r=>{const l=Fe(r.width??800,r.height??600);return o.jsx(w,{...r,width:l.width,height:l.height,showControls:l.mobile?!1:r.showControls})},Xe={title:"Effects + Advanced/Glass Nebula Clouds",component:w,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{width:{control:{type:"range",min:400,max:1200,step:50}},height:{control:{type:"range",min:300,max:800,step:50}},density:{control:{type:"range",min:.1,max:1,step:.1}},temperature:{control:{type:"range",min:10,max:1e5,step:1e3}},stellarWindStrength:{control:{type:"range",min:0,max:1,step:.1}},colorIntensity:{control:{type:"range",min:.1,max:1,step:.1}},turbulenceLevel:{control:{type:"range",min:.1,max:2,step:.1}},timeScale:{control:{type:"range",min:.1,max:10,step:.1}},nebulaType:{control:{type:"select"},options:["emission","reflection","dark","planetary","supernova"]}}},T={render:r=>o.jsx(Ge,{...r}),args:{width:800,height:600,showControls:!0,showNebulaInfo:!0,showStarClusters:!0,showCosmicDust:!0}},L={args:{width:700,height:500,nebulaType:"emission",temperature:1e4,density:.8,ionizationLevel:.9,showEmissionLines:!0,colorIntensity:.9}},I={args:{width:600,height:400,nebulaType:"reflection",temperature:3e3,density:.6,ionizationLevel:.2,showStarClusters:!0,showCosmicDust:!0}},$={args:{width:650,height:450,nebulaType:"dark",temperature:10,density:.9,colorIntensity:.4,showCosmicDust:!0,showStarClusters:!1}},j={args:{width:500,height:500,nebulaType:"planetary",temperature:5e4,density:.5,ionizationLevel:1,layerCount:3,showEmissionLines:!0,turbulenceLevel:.3}},k={args:{width:800,height:600,nebulaType:"supernova",temperature:1e6,density:.4,stellarWindStrength:.9,turbulenceLevel:1.5,showMagneticField:!0,colorIntensity:1}},z={args:{width:700,height:500,nebulaType:"emission",density:.9,temperature:15e3,timeScale:5,showStarClusters:!0,turbulenceLevel:.8}},E={args:{width:750,height:550,nebulaType:"emission",density:.6,temperature:8e3,timeScale:2,stellarWindStrength:.7,layerCount:6}},D={args:{width:800,height:600,nebulaType:"reflection",density:.3,temperature:5e3,stellarWindStrength:.8,timeScale:1,colorIntensity:.5}},R={args:{width:600,height:400,turbulenceLevel:2,stellarWindStrength:.9,density:.8,animationSpeed:1.5,layerCount:7}},q={args:{width:700,height:500,nebulaType:"dark",temperature:20,density:1,showCosmicDust:!0,showStarClusters:!0,colorIntensity:.3}},V={args:{width:650,height:450,nebulaType:"emission",temperature:3e4,ionizationLevel:1,density:.7,showEmissionLines:!0,colorIntensity:1}},F={args:{width:400,height:300,showControls:!1,showNebulaInfo:!1,nebulaType:"emission",density:.6,showStarClusters:!0}},G={args:{width:800,height:600,showMagneticField:!0,nebulaType:"supernova",stellarWindStrength:.8,ionizationLevel:.9,turbulenceLevel:1.2}},P={args:{width:750,height:550,nebulaType:"emission",density:.9,temperature:12e3,showStarClusters:!0,showCosmicDust:!0,timeScale:3,turbulenceLevel:.9}},A={args:{width:900,height:700,layerCount:8,density:.8,temperature:15e3,showStarClusters:!0,showCosmicDust:!0,showEmissionLines:!0,showMagneticField:!0,turbulenceLevel:1.5,colorIntensity:.9,stellarWindStrength:.7}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: args => <ResponsiveNebulaClouds {...args} />,
  args: {
    width: 800,
    height: 600,
    showControls: true,
    showNebulaInfo: true,
    showStarClusters: true,
    showCosmicDust: true
  }
}`,...T.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    turbulenceLevel: 2,
    stellarWindStrength: 0.9,
    density: 0.8,
    animationSpeed: 1.5,
    layerCount: 7
  }
}`,...R.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 300,
    showControls: false,
    showNebulaInfo: false,
    nebulaType: 'emission',
    density: 0.6,
    showStarClusters: true
  }
}`,...F.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    showMagneticField: true,
    nebulaType: 'supernova',
    stellarWindStrength: 0.8,
    ionizationLevel: 0.9,
    turbulenceLevel: 1.2
  }
}`,...G.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}};const Je=["Default","EmissionNebula","ReflectionNebula","DarkNebula","PlanetaryNebula","SupernovaRemnant","YoungNebula","MaturingNebula","DispersingNebula","HighTurbulence","ColdMolecularCloud","HotIonizedGas","MinimalInterface","MagneticFieldVisible","StarFormingRegion","ComplexNebula"];export{q as ColdMolecularCloud,A as ComplexNebula,$ as DarkNebula,T as Default,D as DispersingNebula,L as EmissionNebula,R as HighTurbulence,V as HotIonizedGas,G as MagneticFieldVisible,E as MaturingNebula,F as MinimalInterface,j as PlanetaryNebula,I as ReflectionNebula,P as StarFormingRegion,k as SupernovaRemnant,z as YoungNebula,Je as __namedExportsOrder,Xe as default};
