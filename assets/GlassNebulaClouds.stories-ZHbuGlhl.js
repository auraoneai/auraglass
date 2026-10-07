import{r as d,j as l,c as De,R as we}from"./iframe-Cqi-9gHA.js";import{u as Re}from"./a11y-DBBBNlGj.js";import{u as qe}from"./MotionPreferenceContext-Da-updIo.js";import{u as Ve}from"./soundDesign-BN0GUCjA.js";import{O as Se}from"./OptimizedGlassCore-CWgizUMZ.js";import{M as Fe}from"./MotionFramer-CH53jSUC.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-DlsmEFaF.js";import"./utilsCore-iuxhMr4m.js";const S=d.forwardRef(({width:o=800,height:i=600,nebulaType:f="emission",density:p=.7,temperature:h=1e4,stellarWindStrength:g=.5,layerCount:U=5,showStarClusters:_=!0,showCosmicDust:O=!0,animationSpeed:x=1,turbulenceLevel:Z=.6,colorIntensity:ee=.8,cameraDistance:ae=1,timeScale:y=1,ionizationLevel:M=.7,showEmissionLines:K=!0,showMagneticField:B=!1,onNebulaEvolution:se,onStarFormation:te,showControls:Me=!0,showNebulaInfo:ne=!0,respectMotionPreference:Y=!0,className:Ne,...re},Te)=>{const{prefersReducedMotion:oe,isMotionSafe:Le}=qe(),{play:le}=Ve(),H=d.useRef(null),N=d.useRef(),Ie=Re("glass-nebula-clouds"),[ie,ue]=d.useState([]),[X,$e]=d.useState([]),[ce,de]=d.useState([]),[v,je]=d.useState(0),[me,ke]=d.useState(0),[T,J]=d.useState("formation"),C=d.useCallback(s=>{const e=Math.round(s[0]*.2126+s[1]*.7152+s[2]*.0722),t=Math.max(112,Math.min(242,e));return[t,t,t]},[]),pe={emission:{colors:[[255,100,100],[100,255,100],[100,100,255],[255,255,100]],baseTemperature:1e4,ionizedGas:!0},reflection:{colors:[[150,200,255],[200,220,255],[120,180,255]],baseTemperature:3e3,ionizedGas:!1},dark:{colors:[[50,50,50],[80,60,40],[40,40,60]],baseTemperature:10,ionizedGas:!1},planetary:{colors:[[100,255,255],[255,100,255],[255,255,100],[100,255,100]],baseTemperature:5e4,ionizedGas:!0},supernova:{colors:[[255,255,255],[255,200,100],[255,100,100],[100,200,255]],baseTemperature:1e6,ionizedGas:!0}},he=d.useCallback(s=>s<3e3?[255,100,0]:s<5e3?[255,200,100]:s<7e3?[255,255,200]:s<1e4?[200,220,255]:s<2e4?[150,200,255]:[100,150,255],[]),ge=d.useCallback(()=>{const s=pe[f],e=[];for(let t=0;t<U;t++){const a=[],r=p*(1-t*.1),n=h*(1+(Math.random()-.5)*.3);for(let u=0;u<o;u+=20)for(let c=0;c<i;c+=20){const m=Math.sin(u*.01+t)*Math.cos(c*.01+t)*Math.sin(u*c*1e-4+t*2);Math.abs(m)>.3&&a.push({x:u+(Math.random()-.5)*40,y:c+(Math.random()-.5)*40,density:r*Math.abs(m),temperature:n*(.8+Math.random()*.4)})}e.push({name:`Layer ${t+1}`,points:a,color:s.colors[t%s.colors.length],opacity:ee*(.8-t*.1),scale:1+t*.2,rotation:0,rotationSpeed:(Math.random()-.5)*.001,turbulence:Z*(1+t*.1),id:`nebula-layer-${t}`})}ue(e)},[f,U,p,h,o,i,ee,Z]),fe=d.useCallback(()=>{if(!_)return;const s=[],e=Math.floor(3+Math.random()*4);for(let t=0;t<e;t++){const a=Math.random()*o,r=Math.random()*i,n=Math.random()*.8+.2,u=Math.random()*100,c=[],m=Math.floor(n*20+10);for(let b=0;b<m;b++){const ve=Math.random()*Math.PI*2,Ce=Math.random()*80,w=["O","B","A","F","G","K","M"][Math.floor(Math.random()*7)],Ee={O:[150,180,255],B:[180,200,255],A:[220,230,255],F:[255,245,240],G:[255,255,200],K:[255,200,150],M:[255,150,100]};c.push({x:Math.cos(ve)*Ce,y:Math.sin(ve)*Ce,brightness:Math.random()*.8+.2,color:Ee[w],size:w==="O"||w==="B"?3:w==="M"?1:2,twinklePhase:Math.random()*Math.PI*2,spectralClass:w})}s.push({x:a,y:r,stars:c,density:n,age:u,id:`cluster-${t}`})}$e(s)},[_,o,i]),be=d.useCallback(()=>{if(!O)return;const s=[],e=Math.floor(2+Math.random()*3);for(let t=0;t<e;t++){const a=[],r=Math.floor(p*100+50),n=["silicate","carbon","ice","organic"][Math.floor(Math.random()*4)],u={silicate:[150,120,80],carbon:[80,60,40],ice:[200,220,255],organic:[120,100,60]};for(let c=0;c<r;c++)a.push({x:Math.random()*o,y:Math.random()*i,vx:(Math.random()-.5)*g,vy:(Math.random()-.5)*g,size:Math.random()*2+.5,opacity:Math.random()*.3+.1,color:u[n],temperature:50+Math.random()*200,lifetime:Math.random()*1e4+5e3});s.push({particles:a,density:p*(.5+Math.random()*.5),composition:n,id:`dust-cloud-${t}`})}de(s)},[O,p,o,i,g]);d.useEffect(()=>{ge(),fe(),be()},[ge,fe,be]);const ye=d.useCallback(s=>{ue(e=>e.map(t=>({...t,rotation:t.rotation+t.rotationSpeed*s*x*y,points:t.points.map(a=>({...a,x:a.x+Math.sin(v*1e-4+a.y*.01)*t.turbulence*.1,y:a.y+Math.cos(v*1e-4+a.x*.01)*t.turbulence*.1,density:Math.max(.1,a.density+(Math.random()-.5)*.05*g)}))})))},[x,y,v,g]),xe=d.useCallback(s=>{de(e=>e.map(t=>({...t,particles:t.particles.map(a=>({...a,x:a.x+a.vx*s*x,y:a.y+a.vy*s*x,lifetime:a.lifetime-s,opacity:Math.max(0,a.opacity-s*5e-5)})).filter(a=>a.lifetime>0&&a.x>-50&&a.x<o+50&&a.y>-50&&a.y<i+50)})))},[x,o,i]);d.useEffect(()=>{const s=setInterval(()=>{ke(e=>{const t=e+y*.1;if(t<10?J("formation"):t<50?J("mature"):J("dispersing"),se?.(t,T),Math.random()<.05*y){const a={x:Math.random()*o,y:Math.random()*i};te?.(a),le("success")}return t})},5e3);return()=>clearInterval(s)},[y,T,se,te,o,i,le]);const Q=d.useCallback(()=>{const s=H.current;if(!s)return;const e=s.getContext("2d");if(!e)return;const t=e.createRadialGradient(o/2,i/2,0,o/2,i/2,Math.max(o,i)/2);t.addColorStop(0,"rgb(5, 5, 15)"),t.addColorStop(1,"rgb(0, 0, 5)"),e.fillStyle=t,e.fillRect(0,0,o,i),e.fillStyle="white";for(let a=0;a<100;a++){const r=Math.random()*o,n=Math.random()*i,u=Math.random();e.globalAlpha=u*.5,e.beginPath(),e.arc(r,n,u,0,Math.PI*2),e.fill()}if(ce.forEach(a=>{a.particles.forEach(r=>{if(r.opacity<.01)return;e.globalAlpha=r.opacity;const n=C(r.color);e.fillStyle=`rgb(${n[0]}, ${n[1]}, ${n[2]})`,e.beginPath(),e.arc(r.x,r.y,r.size,0,Math.PI*2),e.fill()})}),e.globalAlpha=1,ie.forEach((a,r)=>{if(e.save(),e.translate(o/2,i/2),e.rotate(a.rotation),e.scale(a.scale,a.scale),e.translate(-o/2,-i/2),a.points.forEach(n=>{const u=n.density*p;if(u<.1)return;const c=Math.max(10,u*30/ae),m=C(M>.5?a.color:he(n.temperature)),b=e.createRadialGradient(n.x,n.y,0,n.x,n.y,c);b.addColorStop(0,`rgba(${m[0]}, ${m[1]}, ${m[2]}, ${a.opacity*u})`),b.addColorStop(.5,`rgba(${m[0]}, ${m[1]}, ${m[2]}, ${a.opacity*u*.5})`),b.addColorStop(1,`rgba(${m[0]}, ${m[1]}, ${m[2]}, 0)`),e.fillStyle=b,e.beginPath(),e.arc(n.x,n.y,c,0,Math.PI*2),e.fill()}),K&&pe[f].ionizedGas){e.globalAlpha=M*.3;const n=C(a.color);e.strokeStyle=`rgb(${n[0]}, ${n[1]}, ${n[2]})`,e.lineWidth=1;for(let u=0;u<a.points.length-1;u+=10){const c=a.points[u],m=a.points[u+1];!c||!m||(e.beginPath(),e.moveTo(c.x,c.y),e.lineTo(m.x,m.y),e.stroke())}}e.restore()}),B){e.strokeStyle="rgba(220, 224, 230, 0.2)",e.lineWidth=1,e.globalAlpha=.3;for(let a=0;a<o;a+=100)for(let r=0;r<i;r+=100){const n=Math.sin(a*.01)*Math.cos(r*.01);Math.abs(n)>.3&&(e.beginPath(),e.moveTo(a,r),e.bezierCurveTo(a+50,r+n*30,a+80,r+n*20,a+100,r),e.stroke())}}X.forEach(a=>{a.stars.forEach(r=>{const n=C(r.color),u=Math.sin(v*.005+r.twinklePhase)*.3+.7;e.globalAlpha=r.brightness*u;const c=e.createRadialGradient(a.x+r.x,a.y+r.y,0,a.x+r.x,a.y+r.y,r.size*3);c.addColorStop(0,`rgb(${n[0]}, ${n[1]}, ${n[2]})`),c.addColorStop(.3,`rgba(${n[0]}, ${n[1]}, ${n[2]}, 0.8)`),c.addColorStop(1,`rgba(${n[0]}, ${n[1]}, ${n[2]}, 0)`),e.fillStyle=c,e.beginPath(),e.arc(a.x+r.x,a.y+r.y,r.size*3,0,Math.PI*2),e.fill(),e.fillStyle=`rgb(${n[0]}, ${n[1]}, ${n[2]})`,e.beginPath(),e.arc(a.x+r.x,a.y+r.y,r.size,0,Math.PI*2),e.fill()})}),ne&&(e.save(),e.fillStyle="var(--glass-text-secondary-dark)",e.fillRect(10,10,250,160),e.fillStyle="white",e.font="14px sans-serif",e.fillText(`Nebula Type: ${f}`,20,30),e.fillText(`Age: ${me.toFixed(1)} million years`,20,50),e.fillText(`Phase: ${T}`,20,70),e.fillText(`Temperature: ${h.toLocaleString()} K`,20,90),e.fillText(`Density: ${Math.round(p*100)}%`,20,110),e.fillText(`Ionization: ${Math.round(M*100)}%`,20,130),e.fillText(`Star Clusters: ${X.length}`,20,150),e.restore())},[o,i,ce,ie,p,ae,M,he,K,f,B,v,X,ne,me,T,h,C]);d.useEffect(()=>{if(oe&&Y){Q();return}const s=e=>{je(a=>a+16),ye(16),xe(16),Q(),N.current=requestAnimationFrame(s)};return N.current=requestAnimationFrame(s),()=>{N.current&&cancelAnimationFrame(N.current)}},[oe,Y,Q,ye,xe]),d.useEffect(()=>{const s=H.current;s&&(s.width=o,s.height=i)},[o,i]);const ze=()=>Me?l.jsxs(Se,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:"glass-nebula-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard",style:{color:"var(--glass-theme-text, var(--glass-text-primary))",background:"rgba(255, 255, 255, 0.24)",borderColor:"rgba(255, 255, 255, 0.18)"},children:[l.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[l.jsx("label",{htmlFor:"nebula-type",className:"glass-text-sm",children:"Type:"}),l.jsxs("select",{id:"nebula-type",value:f,onChange:s=>{},"aria-label":"Nebula type selection",className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20 glass-contrast-guard glass-focus glass-touch-target",style:{color:"var(--glass-theme-text, var(--glass-text-primary))",background:"rgba(255, 255, 255, 0.32)",borderColor:"rgba(255, 255, 255, 0.24)"},children:[l.jsx("option",{value:"emission",children:"Emission"}),l.jsx("option",{value:"reflection",children:"Reflection"}),l.jsx("option",{value:"dark",children:"Dark"}),l.jsx("option",{value:"planetary",children:"Planetary"}),l.jsx("option",{value:"supernova",children:"Supernova"})]})]}),l.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[l.jsx("label",{htmlFor:"nebula-density",className:"glass-text-sm",children:"Density:"}),l.jsx("input",{id:"nebula-density",type:"range",min:"0.1",max:"1",step:"0.1",value:p,onChange:s=>{},"aria-label":"Nebula density",className:"glass-w-20 glass-focus glass-touch-target glass-contrast-guard",style:{accentColor:"#526071"}})]}),l.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[l.jsx("label",{htmlFor:"nebula-temperature",className:"glass-text-sm",children:"Temperature:"}),l.jsx("input",{id:"nebula-temperature",type:"range",min:"10",max:"100000",step:"1000",value:h,onChange:s=>{},"aria-label":"Nebula temperature in Kelvin",className:"glass-w-20 glass-focus glass-touch-target glass-contrast-guard",style:{accentColor:"#526071"}}),l.jsxs("span",{className:"glass-text-xs",children:[(h/1e3).toFixed(1),"K K"]})]}),l.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[l.jsx("label",{htmlFor:"nebula-timescale",className:"glass-text-sm",children:"Time Scale:"}),l.jsx("input",{id:"nebula-timescale",type:"range",min:"0.1",max:"10",step:"0.1",value:y,onChange:s=>{},"aria-label":"Time scale multiplier",className:"glass-w-20 glass-focus glass-touch-target glass-contrast-guard",style:{accentColor:"#526071"}})]}),l.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[l.jsxs("label",{className:"glass-text-sm",children:[l.jsx("input",{type:"checkbox",checked:_,onChange:s=>{},"aria-label":"Show star clusters",className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard",style:{accentColor:"#526071"}}),"Stars"]}),l.jsxs("label",{className:"glass-text-sm",children:[l.jsx("input",{type:"checkbox",checked:O,onChange:s=>{},"aria-label":"Show cosmic dust",className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard",style:{accentColor:"#526071"}}),"Dust"]}),l.jsxs("label",{className:"glass-text-sm",children:[l.jsx("input",{type:"checkbox",checked:K,onChange:s=>{},"aria-label":"Show emission lines",className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard",style:{accentColor:"#526071"}}),"Emission"]}),l.jsxs("label",{className:"glass-text-sm",children:[l.jsx("input",{type:"checkbox",checked:B,onChange:s=>{},"aria-label":"Show magnetic field",className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard",style:{accentColor:"#526071"}}),"Magnetic"]})]})]}):null;return l.jsx(Se,{ref:Te,id:Ie,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",className:De("glass-nebula-clouds relative glass-radius-lg glass-backdrop-blur border border-border/20",Ne),"data-testid":re["data-testid"],role:"region","aria-label":"Nebula clouds visualization with controls",...re,children:l.jsxs(Fe,{preset:Le&&Y?"fadeIn":"none",className:"glass-flex glass-flex-col glass-gap-4 glass-p-4",children:[ze(),l.jsx("div",{className:"glass-relative",children:l.jsx("canvas",{ref:H,width:o,height:i,className:"glass-border glass-border-glass-border/20 glass-radius-md glass-surface-dark glass-contrast-guard",style:{width:o,height:i}})})]})})});S.displayName="GlassNebulaClouds";try{S.displayName="GlassNebulaClouds",S.__docgenInfo={description:"",displayName:"GlassNebulaClouds",props:{width:{defaultValue:{value:"800"},description:"Canvas width",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"600"},description:"Canvas height",name:"height",required:!1,type:{name:"number | undefined"}},nebulaType:{defaultValue:{value:"emission"},description:"Nebula type",name:"nebulaType",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"dark"'},{value:'"emission"'},{value:'"reflection"'},{value:'"planetary"'},{value:'"supernova"'}]}},density:{defaultValue:{value:"0.7"},description:"Overall nebula density",name:"density",required:!1,type:{name:"number | undefined"}},temperature:{defaultValue:{value:"10000"},description:"Gas temperature (affects color)",name:"temperature",required:!1,type:{name:"number | undefined"}},stellarWindStrength:{defaultValue:{value:"0.5"},description:"Stellar wind strength",name:"stellarWindStrength",required:!1,type:{name:"number | undefined"}},layerCount:{defaultValue:{value:"5"},description:"Number of nebula layers",name:"layerCount",required:!1,type:{name:"number | undefined"}},showStarClusters:{defaultValue:{value:"true"},description:"Show star clusters",name:"showStarClusters",required:!1,type:{name:"boolean | undefined"}},showCosmicDust:{defaultValue:{value:"true"},description:"Show cosmic dust",name:"showCosmicDust",required:!1,type:{name:"boolean | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"Animation speed",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},turbulenceLevel:{defaultValue:{value:"0.6"},description:"Turbulence level",name:"turbulenceLevel",required:!1,type:{name:"number | undefined"}},colorIntensity:{defaultValue:{value:"0.8"},description:"Color intensity",name:"colorIntensity",required:!1,type:{name:"number | undefined"}},cameraDistance:{defaultValue:{value:"1"},description:"Camera distance (affects perspective)",name:"cameraDistance",required:!1,type:{name:"number | undefined"}},timeScale:{defaultValue:{value:"1"},description:"Time scale (affects evolution)",name:"timeScale",required:!1,type:{name:"number | undefined"}},ionizationLevel:{defaultValue:{value:"0.7"},description:"Ionization level",name:"ionizationLevel",required:!1,type:{name:"number | undefined"}},showEmissionLines:{defaultValue:{value:"true"},description:"Whether to show emission lines",name:"showEmissionLines",required:!1,type:{name:"boolean | undefined"}},showMagneticField:{defaultValue:{value:"false"},description:"Magnetic field visualization",name:"showMagneticField",required:!1,type:{name:"boolean | undefined"}},onNebulaEvolution:{defaultValue:null,description:"Nebula evolution handler",name:"onNebulaEvolution",required:!1,type:{name:"((age: number, state: string) => void) | undefined"}},onStarFormation:{defaultValue:null,description:"Star formation handler",name:"onStarFormation",required:!1,type:{name:"((location: { x: number; y: number; }) => void) | undefined"}},showControls:{defaultValue:{value:"true"},description:"Show controls",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showNebulaInfo:{defaultValue:{value:"true"},description:"Show nebula info",name:"showNebulaInfo",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Respect user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const Ge=(o,i)=>{const[f,p]=we.useState({width:o,height:i,mobile:!1});return we.useEffect(()=>{const h=()=>{const g=window.innerWidth<520;p({width:g?Math.min(260,window.innerWidth-96):o,height:g?320:i,mobile:g})};return h(),window.addEventListener("resize",h),()=>window.removeEventListener("resize",h)},[i,o]),f},Pe=o=>{const i=Ge(o.width??800,o.height??600);return l.jsx(S,{...o,width:i.width,height:i.height,showControls:i.mobile?!1:o.showControls})},Je={title:"Effects + Advanced/Glass Nebula Clouds",component:S,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{width:{control:{type:"range",min:400,max:1200,step:50}},height:{control:{type:"range",min:300,max:800,step:50}},density:{control:{type:"range",min:.1,max:1,step:.1}},temperature:{control:{type:"range",min:10,max:1e5,step:1e3}},stellarWindStrength:{control:{type:"range",min:0,max:1,step:.1}},colorIntensity:{control:{type:"range",min:.1,max:1,step:.1}},turbulenceLevel:{control:{type:"range",min:.1,max:2,step:.1}},timeScale:{control:{type:"range",min:.1,max:10,step:.1}},nebulaType:{control:{type:"select"},options:["emission","reflection","dark","planetary","supernova"]}}},L={render:o=>l.jsx(Pe,{...o}),args:{width:800,height:600,showControls:!0,showNebulaInfo:!0,showStarClusters:!0,showCosmicDust:!0}},I={args:{width:700,height:500,nebulaType:"emission",temperature:1e4,density:.8,ionizationLevel:.9,showEmissionLines:!0,colorIntensity:.9}},$={args:{width:600,height:400,nebulaType:"reflection",temperature:3e3,density:.6,ionizationLevel:.2,showStarClusters:!0,showCosmicDust:!0}},j={args:{width:650,height:450,nebulaType:"dark",temperature:10,density:.9,colorIntensity:.4,showCosmicDust:!0,showStarClusters:!1}},k={args:{width:500,height:500,nebulaType:"planetary",temperature:5e4,density:.5,ionizationLevel:1,layerCount:3,showEmissionLines:!0,turbulenceLevel:.3}},z={args:{width:800,height:600,nebulaType:"supernova",temperature:1e6,density:.4,stellarWindStrength:.9,turbulenceLevel:1.5,showMagneticField:!0,colorIntensity:1}},E={args:{width:700,height:500,nebulaType:"emission",density:.9,temperature:15e3,timeScale:5,showStarClusters:!0,turbulenceLevel:.8}},D={args:{width:750,height:550,nebulaType:"emission",density:.6,temperature:8e3,timeScale:2,stellarWindStrength:.7,layerCount:6}},R={args:{width:800,height:600,nebulaType:"reflection",density:.3,temperature:5e3,stellarWindStrength:.8,timeScale:1,colorIntensity:.5}},q={args:{width:600,height:400,turbulenceLevel:2,stellarWindStrength:.9,density:.8,animationSpeed:1.5,layerCount:7}},V={args:{width:700,height:500,nebulaType:"dark",temperature:20,density:1,showCosmicDust:!0,showStarClusters:!0,colorIntensity:.3}},F={args:{width:650,height:450,nebulaType:"emission",temperature:3e4,ionizationLevel:1,density:.7,showEmissionLines:!0,colorIntensity:1}},G={args:{width:400,height:300,showControls:!1,showNebulaInfo:!1,nebulaType:"emission",density:.6,showStarClusters:!0}},P={args:{width:800,height:600,showMagneticField:!0,nebulaType:"supernova",stellarWindStrength:.8,ionizationLevel:.9,turbulenceLevel:1.2}},A={args:{width:750,height:550,nebulaType:"emission",density:.9,temperature:12e3,showStarClusters:!0,showCosmicDust:!0,timeScale:3,turbulenceLevel:.9}},W={args:{width:900,height:700,layerCount:8,density:.8,temperature:15e3,showStarClusters:!0,showCosmicDust:!0,showEmissionLines:!0,showMagneticField:!0,turbulenceLevel:1.5,colorIntensity:.9,stellarWindStrength:.7}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: args => <ResponsiveNebulaClouds {...args} />,
  args: {
    width: 800,
    height: 600,
    showControls: true,
    showNebulaInfo: true,
    showStarClusters: true,
    showCosmicDust: true
  }
}`,...L.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    turbulenceLevel: 2,
    stellarWindStrength: 0.9,
    density: 0.8,
    animationSpeed: 1.5,
    layerCount: 7
  }
}`,...q.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 300,
    showControls: false,
    showNebulaInfo: false,
    nebulaType: 'emission',
    density: 0.6,
    showStarClusters: true
  }
}`,...G.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    showMagneticField: true,
    nebulaType: 'supernova',
    stellarWindStrength: 0.8,
    ionizationLevel: 0.9,
    turbulenceLevel: 1.2
  }
}`,...P.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}};const Qe=["Default","EmissionNebula","ReflectionNebula","DarkNebula","PlanetaryNebula","SupernovaRemnant","YoungNebula","MaturingNebula","DispersingNebula","HighTurbulence","ColdMolecularCloud","HotIonizedGas","MinimalInterface","MagneticFieldVisible","StarFormingRegion","ComplexNebula"];export{V as ColdMolecularCloud,W as ComplexNebula,j as DarkNebula,L as Default,R as DispersingNebula,I as EmissionNebula,q as HighTurbulence,F as HotIonizedGas,P as MagneticFieldVisible,D as MaturingNebula,G as MinimalInterface,k as PlanetaryNebula,$ as ReflectionNebula,A as StarFormingRegion,z as SupernovaRemnant,E as YoungNebula,Qe as __namedExportsOrder,Je as default};
