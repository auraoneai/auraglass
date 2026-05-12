import{r as l,j as o,c as $e,C as ge,R as ye}from"./iframe-C690vU5J.js";import{u as Ne}from"./a11y-CqibiY8Q.js";import{u as Ge}from"./MotionPreferenceContext-IxMuCihq.js";import{u as Re}from"./soundDesign-D57lKTxC.js";import{O as fe}from"./OptimizedGlassCore-BFIVwF34.js";import{M as Ie}from"./MotionFramer-BSdpDBRW.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-CziwpX2D.js";import"./utilsCore-BwjSsiAl.js";const x=l.forwardRef(({width:n=800,height:i=500,intensity:W=.7,solarWindStrength:d=.6,geomagneticActivity:m=.5,colorPreset:g="classic",showStars:_=!0,showSolarWind:w=!0,animationSpeed:h=1,waveComplexity:J=1,layerCount:Q=4,observationTime:v=22,latitude:X=65,showAtmosphericGlow:Z=!0,activityLevel:D="moderate",realTimeMode:F=!1,onAuroraChange:ee,onSolarEvent:ae,showControls:be=!0,showAuroraInfo:te=!0,respectMotionPreference:O=!0,className:we,...xe},Se)=>{const{prefersReducedMotion:se,isMotionSafe:Ce}=Ge(),{play:S}=Re(),z=l.useRef(null),C=l.useRef(),Me=Ne("glass-aurora-display"),[re,oe]=l.useState([]),[ne,ie]=l.useState([]),[Y,le]=l.useState({stars:[],shootingStars:[],id:"starfield"}),[b,Ae]=l.useState(0),[y,B]=l.useState(W),[Ee,Te]=l.useState([]),Pe={classic:[[0,255,146],[255,0,255],[0,255,255],[255,255,0]],rare:[[255,0,0],[128,0,128],[255,165,0],[255,192,203]],storm:[[255,255,255],[255,0,0],[255,100,100],[200,200,255]],sunset:[[255,140,0],[255,69,0],[255,20,147],[138,43,226]],cosmic:[[75,0,130],[148,0,211],[0,191,255],[127,255,212]]},ce=l.useCallback(()=>{const r=Array.from({length:200},(e,t)=>({x:Math.random()*n,y:Math.random()*i*.6,brightness:Math.random()*.8+.2,twinklePhase:Math.random()*Math.PI*2}));le(e=>({...e,stars:r}))},[n,i]),ue=l.useCallback(()=>{const r=Pe[g],e=[];for(let t=0;t<Q;t++){const s=[],a=i*(.3+t*.15),c=60+t*20;for(let u=0;u<=n;u+=10)s.push({x:u,y:a+Math.sin(u*.01+t)*(20+J*10),intensity:Math.random()*.5+.5});e.push({points:s,color:r[t%r.length],opacity:y*.8*(1-t*.2),waveOffset:t*Math.PI/4,waveSpeed:.02+t*.01,height:c,id:`aurora-layer-${t}`})}oe(e),Te(r.map(t=>`rgb(${t[0]}, ${t[1]}, ${t[2]})`)),ee?.(y,r.map(t=>`rgb(${t[0]}, ${t[1]}, ${t[2]})`))},[g,Q,n,i,J,y,ee]),de=l.useCallback(()=>{if(!w)return;const r=Math.floor(d*50),e=[];for(let t=0;t<r;t++)e.push({x:Math.random()*n,y:-10,vx:(Math.random()-.5)*2,vy:Math.random()*3+2,size:Math.random()*2+1,opacity:Math.random()*.6+.2,color:[255,255,255],energy:Math.random()*d,lifetime:Math.random()*3e3+1e3,id:`solar-particle-${t}`});ie(e)},[w,d,n]);l.useEffect(()=>{ce(),ue(),de()},[ce,ue,de]);const me=l.useCallback(r=>{oe(e=>e.map(t=>({...t,waveOffset:t.waveOffset+t.waveSpeed*r*h,opacity:Math.max(0,t.opacity+(Math.random()-.5)*.02*m),points:t.points.map((s,a)=>({...s,y:s.y+Math.sin(t.waveOffset+a*.1)*(2+m*3),intensity:Math.max(.3,Math.min(1,s.intensity+(Math.random()-.5)*.1))}))})))},[h,m]),he=l.useCallback(r=>{ie(e=>{const t=e.map(s=>({...s,x:s.x+s.vx*r*h,y:s.y+s.vy*r*h,lifetime:s.lifetime-r,opacity:Math.max(0,s.opacity-r*5e-4)})).filter(s=>s.lifetime>0&&s.x>-50&&s.x<n+50&&s.y<i+50);if(t.length<d*30){const s=Array.from({length:Math.min(5,Math.floor(d*30)-t.length)},(a,c)=>({x:Math.random()*n,y:-10,vx:(Math.random()-.5)*2,vy:Math.random()*3+2,size:Math.random()*2+1,opacity:Math.random()*.6+.2,color:[255,255,255],energy:Math.random()*d,lifetime:Math.random()*3e3+1e3,id:`solar-particle-new-${c}-${Date.now()}`}));return[...t,...s]}return t})},[h,d,n,i]),pe=l.useCallback(r=>{le(e=>{const t=e.shootingStars.map(s=>({...s,x:s.x+s.vx*r*h,y:s.y+s.vy*r*h,lifetime:s.lifetime-r,trail:[{x:s.x,y:s.y,opacity:1},...s.trail.map((a,c)=>({...a,opacity:a.opacity*.95}))].slice(0,10)})).filter(s=>s.lifetime>0&&s.x<n+100);return Math.random()<.001*h&&(t.push({x:Math.random()*n,y:Math.random()*i*.3,vx:Math.random()*3+2,vy:Math.random()*2+1,lifetime:Math.random()*2e3+1e3,trail:[]}),S("success")),{...e,shootingStars:t}})},[h,n,i,S]);l.useEffect(()=>{if(!F)return;const r=setInterval(()=>{if(Math.random()<.1){const e=Math.random()<.3?"flare":Math.random()<.6?"wind":"storm";switch(ae?.(e),e){case"flare":B(t=>Math.min(1,t+.3));break;case"wind":break;case"storm":B(1),S("error");break}}},1e4);return()=>clearInterval(r)},[F,ae,S]);const H=l.useCallback(()=>{const r=z.current;if(!r)return;const e=r.getContext("2d");if(!e)return;const t=e.createLinearGradient(0,0,0,i),s=v<6||v>18;if(s?(t.addColorStop(0,"rgb(10, 10, 30)"),t.addColorStop(.6,"rgb(5, 5, 15)"),t.addColorStop(1,"rgb(0, 0, 5)")):(t.addColorStop(0,"rgb(70, 130, 180)"),t.addColorStop(1,"rgb(25, 25, 112)")),e.fillStyle=t,e.fillRect(0,0,n,i),_&&s&&(Y.stars.forEach(a=>{const c=Math.sin(b*.003+a.twinklePhase)*.3+.7;e.globalAlpha=a.brightness*c,e.fillStyle="white",e.beginPath(),e.arc(a.x,a.y,1,0,Math.PI*2),e.fill()}),Y.shootingStars.forEach(a=>{a.trail.forEach((c,u)=>{e.globalAlpha=c.opacity*(1-u*.1),e.fillStyle="white",e.beginPath(),e.arc(c.x,c.y,2-u*.2,0,Math.PI*2),e.fill()})})),Z&&s){const a=e.createRadialGradient(n/2,i*.8,0,n/2,i*.8,n);a.addColorStop(0,"rgba(100, 200, 100, 0.1)"),a.addColorStop(1,"rgba(100, 200, 100, 0)"),e.fillStyle=a,e.fillRect(0,0,n,i)}e.globalAlpha=1,re.forEach(a=>{if(a.opacity<.01)return;const c=e.createLinearGradient(0,0,0,a.height);c.addColorStop(0,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, 0)`),c.addColorStop(.5,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, ${a.opacity})`),c.addColorStop(1,`rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, 0)`),e.fillStyle=c,e.beginPath(),e.moveTo(a.points[0].x,a.points[0].y+a.height/2),a.points.forEach((p,f)=>{if(f===0)return;const K=a.points[f-1],U=(p.intensity+K.intensity)/2,je=p.y+Math.sin(b*.001+f*.1)*U*10;e.lineTo(p.x,je)});for(let p=a.points.length-1;p>=0;p--){const f=a.points[p],K=f.intensity,U=f.y+Math.sin(b*.001+p*.1)*K*10;e.lineTo(f.x,U+a.height)}e.closePath(),e.fill(),e.save(),e.globalCompositeOperation="overlay",e.globalAlpha=.3;const u=e.createLinearGradient(b*.1%n,0,(b*.1+100)%n,0);u.addColorStop(0,"rgba(255, 255, 255, 0)"),u.addColorStop(.5,"rgba(255, 255, 255, 0.8)"),u.addColorStop(1,"rgba(255, 255, 255, 0)"),e.fillStyle=u,e.fill(),e.restore()}),w&&ne.forEach(a=>{e.globalAlpha=a.opacity,e.fillStyle=`rgb(${a.color[0]}, ${a.color[1]}, ${a.color[2]})`,e.shadowBlur=a.energy*10,e.shadowColor=`rgb(${a.color[0]}, ${a.color[1]}, ${a.color[2]})`,e.beginPath(),e.arc(a.x,a.y,a.size,0,Math.PI*2),e.fill(),e.shadowBlur=0}),te&&(e.save(),e.fillStyle="rgba(15, 23, 42, 0.72)",e.fillRect(10,10,220,160),e.fillStyle="rgba(248, 250, 252, 0.92)",e.font="var(--typography-body-size) sans-serif",e.fillText(`Aurora Intensity: ${Math.round(y*100)}%`,20,30),e.fillText(`Activity Level: ${D}`,20,50),e.fillText(`Solar Wind: ${Math.round(d*100)}%`,20,70),e.fillText(`Geomagnetic: ${Math.round(m*100)}%`,20,90),e.fillText(`Latitude: ${X}°`,20,110),e.fillText(`Time: ${Math.floor(v)}:${String(Math.floor(v%1*60)).padStart(2,"0")}`,20,130),e.fillText(`Visibility: ${s?"Good":"Poor"}`,20,150),e.restore())},[n,i,v,_,Y,b,Z,re,w,ne,te,y,D,d,m,X]);l.useEffect(()=>{if(se&&O){H();return}const r=e=>{Ae(s=>s+16),me(16),he(16),pe(16),H(),C.current=requestAnimationFrame(r)};return C.current=requestAnimationFrame(r),()=>{C.current&&cancelAnimationFrame(C.current)}},[se,O,H,me,he,pe]),l.useEffect(()=>{const r=z.current;r&&(r.width=n,r.height=i)},[n,i]);const Le=()=>be?o.jsxs(fe,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:"glass-aurora-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard",children:[o.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[o.jsx(ge,{children:o.jsx("label",{htmlFor:"aurora-intensity",className:"glass-text-sm",children:"Intensity:"})}),o.jsx("input",{id:"aurora-intensity",type:"range",min:"0",max:"1",step:"0.1",value:y,onChange:r=>B(parseFloat(r.target.value)),className:"glass-w-20","aria-label":"Aurora intensity"}),o.jsx(ge,{children:o.jsxs("span",{className:"glass-text-sm glass-min-w-3ch",children:[Math.round(y*100),"%"]})})]}),o.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[o.jsx("label",{htmlFor:"aurora-colors",className:"glass-text-sm",children:"Colors:"}),o.jsxs("select",{id:"aurora-colors",value:g,onChange:r=>{},className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20 glass-contrast-guard","aria-label":"Aurora color preset",children:[o.jsx("option",{value:"classic",children:"Classic"}),o.jsx("option",{value:"rare",children:"Rare"}),o.jsx("option",{value:"storm",children:"Storm"}),o.jsx("option",{value:"sunset",children:"Sunset"}),o.jsx("option",{value:"cosmic",children:"Cosmic"})]})]}),o.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[o.jsx("label",{htmlFor:"aurora-activity",className:"glass-text-sm",children:"Activity:"}),o.jsxs("select",{id:"aurora-activity",value:D,onChange:r=>{},className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20 glass-contrast-guard","aria-label":"Aurora activity level",children:[o.jsx("option",{value:"low",children:"Low"}),o.jsx("option",{value:"moderate",children:"Moderate"}),o.jsx("option",{value:"high",children:"High"}),o.jsx("option",{value:"storm",children:"Storm"})]})]}),o.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[o.jsx("label",{htmlFor:"aurora-time",className:"glass-text-sm",children:"Time:"}),o.jsx("input",{id:"aurora-time",type:"range",min:"0",max:"24",step:"0.5",value:v,onChange:r=>{},className:"glass-w-20","aria-label":"Observation time in hours"})]}),o.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[o.jsxs("label",{className:"glass-text-sm",children:[o.jsx("input",{type:"checkbox",checked:_,onChange:r=>{},className:"glass-mr-1"}),"Stars"]}),o.jsxs("label",{className:"glass-text-sm",children:[o.jsx("input",{type:"checkbox",checked:w,onChange:r=>{},className:"glass-mr-1"}),"Solar Wind"]}),o.jsxs("label",{className:"glass-text-sm",children:[o.jsx("input",{type:"checkbox",checked:F,onChange:r=>{},className:"glass-mr-1"}),"Real-time"]})]})]}):null;return o.jsx(fe,{ref:Se,id:Me,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",className:$e("glass-aurora-display relative glass-radius-lg glass-glass-backdrop-blur-md border border-border/20",we),...xe,children:o.jsxs(Ie,{preset:Ce&&O?"fadeIn":"none",className:"glass-flex glass-flex-col glass-gap-4 glass-p-4",children:[Le(),o.jsx("div",{className:"glass-relative",children:o.jsx("canvas",{ref:z,width:n,height:i,className:"glass-border glass-border-glass-border/20 glass-radius-md glass-surface-dark glass-contrast-guard",style:{width:n,height:i}})})]})})});x.displayName="GlassAuroraDisplay";try{x.displayName="GlassAuroraDisplay",x.__docgenInfo={description:"",displayName:"GlassAuroraDisplay",props:{width:{defaultValue:{value:"800"},description:"Canvas width",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"500"},description:"Canvas height",name:"height",required:!1,type:{name:"number | undefined"}},intensity:{defaultValue:{value:"0.7"},description:"Aurora intensity (0-1)",name:"intensity",required:!1,type:{name:"number | undefined"}},solarWindStrength:{defaultValue:{value:"0.6"},description:"Solar wind strength",name:"solarWindStrength",required:!1,type:{name:"number | undefined"}},geomagneticActivity:{defaultValue:{value:"0.5"},description:"Geomagnetic activity level",name:"geomagneticActivity",required:!1,type:{name:"number | undefined"}},colorPreset:{defaultValue:{value:"classic"},description:"Aurora colors preset",name:"colorPreset",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"classic"'},{value:'"rare"'},{value:'"storm"'},{value:'"sunset"'},{value:'"cosmic"'}]}},showStars:{defaultValue:{value:"true"},description:"Whether to show stars",name:"showStars",required:!1,type:{name:"boolean | undefined"}},showSolarWind:{defaultValue:{value:"true"},description:"Whether to show solar wind particles",name:"showSolarWind",required:!1,type:{name:"boolean | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"Animation speed multiplier",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},waveComplexity:{defaultValue:{value:"1"},description:"Aurora wave complexity",name:"waveComplexity",required:!1,type:{name:"number | undefined"}},layerCount:{defaultValue:{value:"4"},description:"Number of aurora layers",name:"layerCount",required:!1,type:{name:"number | undefined"}},observationTime:{defaultValue:{value:"22"},description:"Time of observation (affects visibility)",name:"observationTime",required:!1,type:{name:"number | undefined"}},latitude:{defaultValue:{value:"65"},description:"Geographic latitude (affects aurora position)",name:"latitude",required:!1,type:{name:"number | undefined"}},showAtmosphericGlow:{defaultValue:{value:"true"},description:"Whether to show atmospheric glow",name:"showAtmosphericGlow",required:!1,type:{name:"boolean | undefined"}},activityLevel:{defaultValue:{value:"moderate"},description:"Aurora activity level",name:"activityLevel",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"low"'},{value:'"high"'},{value:'"moderate"'},{value:'"storm"'}]}},realTimeMode:{defaultValue:{value:"false"},description:"Real-time data mode",name:"realTimeMode",required:!1,type:{name:"boolean | undefined"}},onAuroraChange:{defaultValue:null,description:"Aurora change handler",name:"onAuroraChange",required:!1,type:{name:"((intensity: number, colors: string[]) => void) | undefined"}},onSolarEvent:{defaultValue:null,description:"Solar event handler",name:"onSolarEvent",required:!1,type:{name:'((eventType: "storm" | "flare" | "wind") => void) | undefined'}},showControls:{defaultValue:{value:"true"},description:"Show controls",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showAuroraInfo:{defaultValue:{value:"true"},description:"Show aurora info",name:"showAuroraInfo",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Respect user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const{fn:ve}=__STORYBOOK_MODULE_TEST__,Ve=(n,i)=>{const[W,d]=ye.useState({width:n,height:i,mobile:!1});return ye.useEffect(()=>{const m=()=>{const g=window.innerWidth<520;d({width:g?Math.min(260,window.innerWidth-96):n,height:g?320:i,mobile:g})};return m(),window.addEventListener("resize",m),()=>window.removeEventListener("resize",m)},[i,n]),W},qe=n=>{const i=Ve(n.width??800,n.height??500);return o.jsx(x,{...n,width:i.width,height:i.height,showControls:i.mobile?!1:n.showControls})},He={title:"Effects + Advanced/Glass Aurora Display",component:x,parameters:{layout:"centered"},tags:["autodocs"],args:{onAuroraChange:ve(),onSolarEvent:ve()},argTypes:{width:{control:{type:"range",min:400,max:1200,step:50}},height:{control:{type:"range",min:300,max:800,step:50}},intensity:{control:{type:"range",min:0,max:1,step:.1}},solarWindStrength:{control:{type:"range",min:0,max:1,step:.1}},geomagneticActivity:{control:{type:"range",min:0,max:1,step:.1}},observationTime:{control:{type:"range",min:0,max:24,step:.5}},latitude:{control:{type:"range",min:0,max:90,step:5}},colorPreset:{control:{type:"select"},options:["classic","rare","storm","sunset","cosmic"]},activityLevel:{control:{type:"select"},options:["low","moderate","high","storm"]}}},M={render:n=>o.jsx(qe,{...n}),args:{width:800,height:500,showControls:!0,showAuroraInfo:!0,showStars:!0,showSolarWind:!0}},A={args:{width:700,height:400,intensity:.8,colorPreset:"classic",activityLevel:"moderate",observationTime:22,latitude:65,showStars:!0,showAtmosphericGlow:!0}},T={args:{width:800,height:500,intensity:1,colorPreset:"storm",activityLevel:"storm",solarWindStrength:.9,geomagneticActivity:.9,observationTime:23,showSolarWind:!0}},P={args:{width:600,height:350,intensity:.9,colorPreset:"rare",activityLevel:"high",latitude:70,observationTime:1,layerCount:6}},L={args:{width:750,height:450,intensity:.6,colorPreset:"sunset",activityLevel:"moderate",observationTime:19,showAtmosphericGlow:!0,waveComplexity:1.5}},j={args:{width:800,height:600,intensity:.8,colorPreset:"cosmic",activityLevel:"high",solarWindStrength:.7,observationTime:2,latitude:75,layerCount:5}},$={args:{width:500,height:300,intensity:.3,activityLevel:"low",solarWindStrength:.2,geomagneticActivity:.3,showSolarWind:!1,layerCount:2}},N={args:{width:700,height:400,intensity:.9,latitude:85,activityLevel:"high",observationTime:0,colorPreset:"classic",showStars:!0}},G={args:{width:600,height:400,intensity:.7,observationTime:0,colorPreset:"classic",showStars:!0,showAtmosphericGlow:!0,activityLevel:"moderate"}},R={args:{width:600,height:350,intensity:.2,observationTime:14,showStars:!1,colorPreset:"classic",activityLevel:"low"}},I={args:{width:800,height:500,intensity:.8,waveComplexity:2,layerCount:6,colorPreset:"cosmic",activityLevel:"high",observationTime:23}},V={args:{width:400,height:250,showControls:!1,showAuroraInfo:!1,intensity:.6,colorPreset:"classic",observationTime:22}},q={args:{width:800,height:500,realTimeMode:!0,intensity:.5,colorPreset:"storm",showSolarWind:!0,activityLevel:"moderate",observationTime:21}},E={args:{width:600,height:400,showStars:!1,showAtmosphericGlow:!1,intensity:.9,colorPreset:"rare",observationTime:22}},k={args:{width:900,height:600,intensity:1,activityLevel:"storm",solarWindStrength:1,geomagneticActivity:1,colorPreset:"storm",layerCount:8,waveComplexity:2,observationTime:1,latitude:80}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: args => <ResponsiveAuroraDisplay {...args} />,
  args: {
    width: 800,
    height: 500,
    showControls: true,
    showAuroraInfo: true,
    showStars: true,
    showSolarWind: true
  }
}`,...M.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 400,
    intensity: 0.8,
    colorPreset: 'classic',
    activityLevel: 'moderate',
    observationTime: 22,
    latitude: 65,
    showStars: true,
    showAtmosphericGlow: true
  }
}`,...A.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 500,
    intensity: 1,
    colorPreset: 'storm',
    activityLevel: 'storm',
    solarWindStrength: 0.9,
    geomagneticActivity: 0.9,
    observationTime: 23,
    showSolarWind: true
  }
}`,...T.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 350,
    intensity: 0.9,
    colorPreset: 'rare',
    activityLevel: 'high',
    latitude: 70,
    observationTime: 1,
    layerCount: 6
  }
}`,...P.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    width: 750,
    height: 450,
    intensity: 0.6,
    colorPreset: 'sunset',
    activityLevel: 'moderate',
    observationTime: 19,
    showAtmosphericGlow: true,
    waveComplexity: 1.5
  }
}`,...L.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    intensity: 0.8,
    colorPreset: 'cosmic',
    activityLevel: 'high',
    solarWindStrength: 0.7,
    observationTime: 2,
    latitude: 75,
    layerCount: 5
  }
}`,...j.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    width: 500,
    height: 300,
    intensity: 0.3,
    activityLevel: 'low',
    solarWindStrength: 0.2,
    geomagneticActivity: 0.3,
    showSolarWind: false,
    layerCount: 2
  }
}`,...$.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 400,
    intensity: 0.9,
    latitude: 85,
    activityLevel: 'high',
    observationTime: 0,
    colorPreset: 'classic',
    showStars: true
  }
}`,...N.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    intensity: 0.7,
    observationTime: 0,
    colorPreset: 'classic',
    showStars: true,
    showAtmosphericGlow: true,
    activityLevel: 'moderate'
  }
}`,...G.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 350,
    intensity: 0.2,
    observationTime: 14,
    showStars: false,
    colorPreset: 'classic',
    activityLevel: 'low'
  }
}`,...R.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 500,
    intensity: 0.8,
    waveComplexity: 2,
    layerCount: 6,
    colorPreset: 'cosmic',
    activityLevel: 'high',
    observationTime: 23
  }
}`,...I.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 250,
    showControls: false,
    showAuroraInfo: false,
    intensity: 0.6,
    colorPreset: 'classic',
    observationTime: 22
  }
}`,...V.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 500,
    realTimeMode: true,
    intensity: 0.5,
    colorPreset: 'storm',
    showSolarWind: true,
    activityLevel: 'moderate',
    observationTime: 21
  }
}`,...q.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    showStars: false,
    showAtmosphericGlow: false,
    intensity: 0.9,
    colorPreset: 'rare',
    observationTime: 22
  }
}`,...E.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    width: 900,
    height: 600,
    intensity: 1,
    activityLevel: 'storm',
    solarWindStrength: 1,
    geomagneticActivity: 1,
    colorPreset: 'storm',
    layerCount: 8,
    waveComplexity: 2,
    observationTime: 1,
    latitude: 80
  }
}`,...k.parameters?.docs?.source}}};const Ke=["Default","ClassicAurora","StormyAurora","RareColors","SunsetAurora","CosmicDisplay","LowActivity","HighLatitude","Midnight","DaytimeView","ComplexWaves","MinimalInterface","RealTimeMode","NoStars","IntenseActivity"];export{A as ClassicAurora,I as ComplexWaves,j as CosmicDisplay,R as DaytimeView,M as Default,N as HighLatitude,k as IntenseActivity,$ as LowActivity,G as Midnight,V as MinimalInterface,E as NoStars,P as RareColors,q as RealTimeMode,T as StormyAurora,L as SunsetAurora,Ke as __namedExportsOrder,He as default};
