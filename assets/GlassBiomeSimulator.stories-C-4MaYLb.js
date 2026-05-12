import{r as u,R as _,j as n,c as we}from"./iframe-FdJLCixk.js";import{u as be}from"./a11y-COKpGJzx.js";import{u as ve}from"./MotionPreferenceContext-CQKnbTlR.js";import{O as ne}from"./OptimizedGlassCore-DXYTmyU1.js";import{M as Se}from"./MotionFramer-uMbPgrLU.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-B5v4J8AJ.js";import"./utilsCore-DnuVLwe3.js";const S=u.forwardRef(({width:o=800,height:l=500,biome:F={type:"forest",temperature:18,humidity:.7,windSpeed:8,lightLevel:.8,season:"spring",timeOfDay:12,id:"default-biome"},particleDensity:g=1,animationSpeed:f=1,showWeatherEffects:y=!0,dayNightCycle:$=!0,seasonalTransitions:De=!0,wildlifeActivity:ke=.5,ambientSoundLevel:Be=.3,windStrength:H=1,showAtmosphericLayers:Y=!0,parallaxEnabled:R=!0,onBiomeChange:ie,onSeasonChange:oe,onTimeChange:le,showControls:de=!0,showBiomeInfo:J=!0,respectMotionPreference:q=!0,className:me,...ce},ue)=>{const{prefersReducedMotion:K,isMotionSafe:he}=ve(),W=u.useRef(null),x=u.useRef(),pe=be("glass-biome-simulator"),[d,V]=u.useState(F),[Q,U]=u.useState([]),[X,fe]=u.useState([]),[Z,ge]=u.useState(0),[ee,Ce]=u.useState({x:0,y:0}),w=_.useMemo(()=>({forest:{colors:{sky:["#87CEEB","#98FB98"],ground:[34,139,34],accent:[139,69,19]},particles:["leaf","pollen","insect"],elements:["tree","grass","flower"],sounds:["birds","rustling","wind"]},ocean:{colors:{sky:["#87CEEB","#E0F6FF"],ground:[25,25,112],accent:[255,255,255]},particles:["water","droplet"],elements:["water","cloud"],sounds:["waves","seagulls","wind"]},desert:{colors:{sky:["#FFD700","#FFA500"],ground:[238,203,173],accent:[160,82,45]},particles:["dust","sand"],elements:["rock","cactus"],sounds:["wind","sand"]},tundra:{colors:{sky:["#B0C4DE","#F0F8FF"],ground:[248,248,255],accent:[70,130,180]},particles:["snow","ice"],elements:["ice","rock"],sounds:["wind","ice"]},grassland:{colors:{sky:["#87CEEB","#98FB98"],ground:[124,252,0],accent:[255,215,0]},particles:["pollen","grass"],elements:["grass","flower"],sounds:["wind","insects"]},rainforest:{colors:{sky:["#228B22","#90EE90"],ground:[0,100,0],accent:[255,69,0]},particles:["water","leaf","spore"],elements:["tree","vine","flower"],sounds:["rain","birds","insects"]},mountain:{colors:{sky:["#4682B4","#E0F6FF"],ground:[105,105,105],accent:[255,255,255]},particles:["snow","cloud"],elements:["mountain","rock","snow"],sounds:["wind","echo"]},swamp:{colors:{sky:["#696969","#A9A9A9"],ground:[85,107,47],accent:[255,140,0]},particles:["fog","insect","bubble"],elements:["water","tree","fog"],sounds:["frogs","insects","bubbles"]}}),[]),ae=u.useCallback(s=>{w[s];const e=[];e.push({name:"Background",depth:0,opacity:1,parallaxSpeed:.1,id:"bg-layer",elements:[]});const m=[];if(s==="forest")for(let a=0;a<8;a++)m.push({type:"tree",x:a*o/8+Math.random()*50,y:l*.3+Math.random()*50,width:60+Math.random()*40,height:80+Math.random()*60,color:[34,100,34],opacity:.6,id:`far-tree-${a}`});else if(s==="mountain")for(let a=0;a<5;a++)m.push({type:"mountain",x:a*o/4,y:l*.2,width:o/3,height:l*.6,color:[105,105,105],opacity:.7,id:`mountain-${a}`});e.push({name:"Far",depth:1,opacity:.8,parallaxSpeed:.3,id:"far-layer",elements:m});const i=[];if(s==="grassland")for(let a=0;a<20;a++)i.push({type:"grass",x:Math.random()*o,y:l*.7+Math.random()*l*.2,width:10+Math.random()*20,height:20+Math.random()*30,color:[124,252,0],opacity:.8,id:`grass-${a}`});else s==="ocean"&&i.push({type:"water",x:0,y:l*.6,width:o,height:l*.4,color:[25,25,112],opacity:.8,animation:"wave",id:"ocean-water"});e.push({name:"Mid",depth:2,opacity:.9,parallaxSpeed:.6,id:"mid-layer",elements:i});const c=[];if(s==="forest")for(let a=0;a<3;a++)c.push({type:"tree",x:a*o/3+Math.random()*100,y:l*.2,width:80+Math.random()*60,height:120+Math.random()*80,color:[34,139,34],opacity:1,id:`near-tree-${a}`});return e.push({name:"Near",depth:3,opacity:1,parallaxSpeed:1,id:"near-layer",elements:c}),e},[o,l,w]),M=u.useCallback((s,e)=>{const m=w[s],i=[];for(let c=0;c<e;c++){const a=m.particles[Math.floor(Math.random()*m.particles.length)];let r={x:Math.random()*o,y:Math.random()*l,size:Math.random()*5+2,opacity:Math.random()*.8+.2,lifetime:Math.random()*1e4+5e3,rotation:Math.random()*Math.PI*2,rotationSpeed:(Math.random()-.5)*.1,type:a,id:`particle-${a}-${c}-${Date.now()}`};switch(a){case"leaf":r={...r,vx:(Math.random()-.5)*2,vy:Math.random()*1+.5,color:[34,139,34],size:Math.random()*8+4,rotationSpeed:(Math.random()-.5)*.2};break;case"pollen":r={...r,vx:(Math.random()-.5)*1,vy:(Math.random()-.5)*.5,color:[255,215,0],size:Math.random()*3+1};break;case"water":r={...r,vx:(Math.random()-.5)*.5,vy:Math.random()*3+2,color:[173,216,230],size:Math.random()*4+2};break;case"droplet":r={...r,vx:(Math.random()-.5)*.4,vy:Math.random()*2.5+1.5,color:[173,216,230],size:Math.random()*3+1};break;case"dust":r={...r,vx:d.windSpeed*.1+(Math.random()-.5)*1,vy:(Math.random()-.5)*.5,color:[238,203,173],size:Math.random()*2+1,opacity:Math.random()*.5+.1};break;case"sand":r={...r,vx:d.windSpeed*.15+(Math.random()-.5)*1,vy:(Math.random()-.5)*.3,color:[237,201,175],size:Math.random()*2+.5,opacity:Math.random()*.4+.1};break;case"snow":r={...r,vx:(Math.random()-.5)*d.windSpeed*.1,vy:Math.random()*2+1,color:[255,255,255],size:Math.random()*6+3,rotationSpeed:(Math.random()-.5)*.1};break;case"ice":r={...r,vx:(Math.random()-.5)*d.windSpeed*.08,vy:Math.random()*1.5+.5,color:[200,230,255],size:Math.random()*4+2,rotationSpeed:(Math.random()-.5)*.08};break;case"insect":r={...r,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,color:[0,0,0],size:Math.random()*2+1};break;case"spore":r={...r,vx:(Math.random()-.5)*.5,vy:-Math.random()*.5,color:[144,238,144],size:Math.random()*3+1,opacity:Math.random()*.6+.2};break;case"fog":r={...r,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.1,color:[210,210,220],size:Math.random()*20+10,opacity:Math.random()*.2+.05};break;case"bubble":r={...r,vx:(Math.random()-.5)*.3,vy:-Math.random()*.8,color:[180,220,255],size:Math.random()*5+2,opacity:Math.random()*.5+.2};break;case"cloud":r={...r,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.1,color:[220,220,230],size:Math.random()*30+20,opacity:Math.random()*.25+.1};break}i.push(r)}return i},[o,l,w,d.windSpeed]);u.useEffect(()=>{const s=ae(d.type);fe(s);const e=Math.floor(50*g),m=M(d.type,e);U(m)},[d.type,ae,M,g]);const te=u.useCallback(s=>{U(e=>{const m=e.map(i=>{const c=d.windSpeed*H*.01;return{...i,x:i.x+(i.vx+c)*s*f,y:i.y+i.vy*s*f,rotation:i.rotation+i.rotationSpeed*s*f,lifetime:i.lifetime-s}}).filter(i=>i.lifetime>0&&i.x>-50&&i.x<o+50&&i.y>-50&&i.y<l+50);if(m.length<50*g){const i=Math.min(5,Math.floor(50*g)-m.length),c=M(d.type,i);return[...m,...c]}return m})},[d,H,f,o,l,M,g]),se=u.useCallback((s,e)=>{if(!$)return e;const m=s>=6&&s<=18,i=m?Math.sin((s-6)/12*Math.PI):.2;return e.map(c=>{const a=parseInt(c.slice(1,3),16),r=parseInt(c.slice(3,5),16),t=parseInt(c.slice(5,7),16),p=Math.round(a*i),b=Math.round(r*i),h=Math.round(t*i+(m?0:50));return`rgb(${p}, ${b}, ${h})`})},[$]),G=u.useCallback(()=>{const s=W.current;if(!s)return;const e=s.getContext("2d");if(!e)return;const m=w[d.type],i=se(d.timeOfDay,m.colors.sky),c=e.createLinearGradient(0,0,0,l);c.addColorStop(0,i[0]),c.addColorStop(1,i[1]),e.fillStyle=c,e.fillRect(0,0,o,l),Y&&X.forEach(a=>{e.save(),e.globalAlpha=a.opacity;const r=R?ee.x*a.parallaxSpeed:0;a.elements.forEach(t=>{e.save(),e.translate(t.x+r,t.y),e.globalAlpha=t.opacity;const p=`rgb(${t.color[0]}, ${t.color[1]}, ${t.color[2]})`;switch(t.type){case"tree":e.fillStyle=p,e.fillRect(-t.width*.1,0,t.width*.2,t.height*.3),e.beginPath(),e.ellipse?e.ellipse(0,-t.height*.3,t.width*.5,t.height*.7,0,0,Math.PI*2):e.arc(0,-t.height*.3,t.width*.5,0,Math.PI*2),e.fill();break;case"mountain":e.fillStyle=p,e.beginPath(),e.moveTo(-t.width*.5,t.height),e.lineTo(0,0),e.lineTo(t.width*.5,t.height),e.closePath(),e.fill();break;case"grass":e.strokeStyle=p,e.lineWidth=2,e.beginPath(),e.moveTo(0,t.height),e.quadraticCurveTo(t.width*.5,0,0,-t.height*.5),e.stroke();break;case"cloud":e.fillStyle=p,e.globalAlpha=t.opacity*.6,e.beginPath();const b=Math.max(10,Math.min(t.width,t.height)*.3);for(let h=-2;h<=2;h++)e.moveTo(h*b*.8,0),e.arc(h*b*.8,0,b*(1-Math.abs(h)*.1),0,Math.PI*2);e.fill(),e.globalAlpha=t.opacity;break;case"water":if(e.fillStyle=p,e.fillRect(-t.width*.5,0,t.width,t.height),t.animation==="wave"){e.strokeStyle="var(--glass-bg-hover)",e.lineWidth=1;const h=Z*.002;for(let v=0;v<t.width;v+=10){const re=Math.sin((v+h*100)*.02)*5;e.beginPath(),e.moveTo(v-t.width*.5,re),e.lineTo(v+5-t.width*.5,re),e.stroke()}}break;case"rock":e.fillStyle=p,e.beginPath(),e.ellipse?e.ellipse(0,0,t.width*.5,t.height*.3,0,0,Math.PI*2):e.arc(0,0,t.width*.5,0,Math.PI*2),e.fill();break;case"flower":e.fillStyle=p,e.beginPath(),e.arc(0,0,t.size||5,0,Math.PI*2),e.fill(),e.fillStyle="rgba(255, 100, 150, 0.8)";for(let h=0;h<5;h++)e.save(),e.rotate(h/5*Math.PI*2),e.beginPath(),e.ellipse?e.ellipse(0,-8,3,6,0,0,Math.PI*2):e.arc(0,-8,3,0,Math.PI*2),e.fill(),e.restore();break}e.restore()}),e.restore()}),Q.forEach(a=>{e.save(),e.globalAlpha=a.opacity,e.translate(a.x,a.y),e.rotate(a.rotation);const r=Array.isArray(a.color)?`rgb(${a.color[0]}, ${a.color[1]}, ${a.color[2]})`:"var(--glass-white)";switch(a.type){case"leaf":e.fillStyle=r,e.beginPath(),e.ellipse?e.ellipse(0,0,a.size,a.size*.6,0,0,Math.PI*2):e.arc(0,0,a.size,0,Math.PI*2),e.fill();break;case"pollen":case"dust":case"sand":case"spore":e.fillStyle=r,e.beginPath(),e.arc(0,0,a.size,0,Math.PI*2),e.fill();break;case"snow":case"ice":e.fillStyle=r,e.beginPath(),e.arc(0,0,a.size,0,Math.PI*2),e.fill(),e.strokeStyle=r,e.lineWidth=.5;for(let p=0;p<6;p++)e.beginPath(),e.moveTo(0,0),e.lineTo(0,-a.size),e.stroke(),e.rotate(Math.PI/3);break;case"water":case"droplet":case"bubble":e.fillStyle=r,e.beginPath(),e.arc(0,0,a.size,0,Math.PI*2),e.fill();break;case"fog":case"cloud":const t=e.createRadialGradient(0,0,0,0,0,a.size);t.addColorStop(0,`rgba(${Array.isArray(a.color)?`${a.color[0]}, ${a.color[1]}, ${a.color[2]}`:"255, 255, 255"}, ${Math.min(.5,a.opacity)})`),t.addColorStop(1,"rgba(255, 255, 255, 0)"),e.fillStyle=t,e.beginPath(),e.arc(0,0,a.size,0,Math.PI*2),e.fill();break;case"insect":e.fillStyle=r,e.fillRect(-a.size*.5,-a.size*.2,a.size,a.size*.4);break}e.restore()}),y&&(d.humidity>.8&&(e.save(),e.globalAlpha=(d.humidity-.8)*.5,e.fillStyle="rgba(200, 200, 220, 0.1)",e.fillRect(0,0,o,l),e.restore()),d.temperature<0&&(e.save(),e.globalAlpha=Math.abs(d.temperature)*.01,e.fillStyle="rgba(173, 216, 230, 0.1)",e.fillRect(0,0,o,l),e.restore())),J&&(e.save(),e.fillStyle="var(--glass-text-secondary-dark)",e.fillRect(10,10,250,140),e.fillStyle="white",e.font="14px sans-serif",e.fillText(`Biome: ${d.type}`,20,30),e.fillText(`Season: ${d.season}`,20,50),e.fillText(`Temperature: ${d.temperature}°C`,20,70),e.fillText(`Humidity: ${Math.round(d.humidity*100)}%`,20,90),e.fillText(`Wind: ${Math.round(d.windSpeed)} km/h`,20,110),e.fillText(`Time: ${Math.floor(d.timeOfDay)}:${String(Math.floor(d.timeOfDay%1*60)).padStart(2,"0")}`,20,130),e.restore())},[o,l,w,d,se,Y,X,R,ee,Z,Q,y,J]);u.useEffect(()=>{if(K&&q){G();return}const s=e=>{ge(i=>i+16),te(16),G(),x.current=requestAnimationFrame(s)};return x.current=requestAnimationFrame(s),()=>{x.current&&cancelAnimationFrame(x.current)}},[K,q,G,te]),u.useEffect(()=>{const s=W.current;s&&(s.width=o,s.height=l)},[o,l]);const ye=()=>de?n.jsxs(ne,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:"glass-biome-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard",children:[n.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[n.jsx("label",{className:"glass-text-sm",htmlFor:"biome-select",children:"Biome:"}),n.jsxs("select",{id:"biome-select",value:d.type,onChange:s=>{const e={...d,type:s.target.value};V(e),ie?.(e)},className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20 glass-contrast-guard","aria-label":"Select biome type",children:[n.jsx("option",{value:"forest",children:"Forest"}),n.jsx("option",{value:"ocean",children:"Ocean"}),n.jsx("option",{value:"desert",children:"Desert"}),n.jsx("option",{value:"tundra",children:"Tundra"}),n.jsx("option",{value:"grassland",children:"Grassland"}),n.jsx("option",{value:"rainforest",children:"Rainforest"}),n.jsx("option",{value:"mountain",children:"Mountain"}),n.jsx("option",{value:"swamp",children:"Swamp"})]})]}),n.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[n.jsx("label",{className:"glass-text-sm",htmlFor:"biome-season-select",children:"Season:"}),n.jsxs("select",{id:"biome-season-select",value:d.season,onChange:s=>{const e={...d,season:s.target.value};V(e),oe?.(s.target.value)},className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20 glass-contrast-guard","aria-label":"Select season",children:[n.jsx("option",{value:"spring",children:"Spring"}),n.jsx("option",{value:"summer",children:"Summer"}),n.jsx("option",{value:"autumn",children:"Autumn"}),n.jsx("option",{value:"winter",children:"Winter"})]})]}),n.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[n.jsx("label",{className:"glass-text-sm",htmlFor:"biome-time-range",children:"Time:"}),n.jsx("input",{id:"biome-time-range",type:"range",min:"0",max:"24",step:"0.5",value:d.timeOfDay,onChange:s=>{const e=parseFloat(s.target.value);V(m=>({...m,timeOfDay:e})),le?.(e)},className:"glass-w-20","aria-label":"Adjust time of day"})]}),n.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[n.jsxs("label",{className:"glass-text-sm",children:[n.jsx("input",{type:"checkbox",checked:$,onChange:s=>{},className:"glass-mr-1"}),"Day/Night"]}),n.jsxs("label",{className:"glass-text-sm",children:[n.jsx("input",{type:"checkbox",checked:R,onChange:s=>{},className:"glass-mr-1"}),"Parallax"]})]})]}):null;return n.jsx(ne,{ref:ue,id:pe,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",className:we("glass-biome-simulator relative glass-radius-lg glass-glass-backdrop-blur-md border border-border/20",me),...ce,children:n.jsxs(Se,{preset:he&&q?"fadeIn":"none",className:"glass-flex glass-flex-col glass-gap-4 glass-p-4",children:[ye(),n.jsx("div",{className:"glass-relative",children:n.jsx("canvas",{ref:W,width:o,height:l,className:"glass-border glass-border-glass-border/20 glass-radius-md",style:{width:o,height:l}})})]})})});S.displayName="GlassBiomeSimulator";try{S.displayName="GlassBiomeSimulator",S.__docgenInfo={description:"",displayName:"GlassBiomeSimulator",props:{width:{defaultValue:{value:"800"},description:"Canvas width",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"500"},description:"Canvas height",name:"height",required:!1,type:{name:"number | undefined"}},biome:{defaultValue:{value:`{
        type: "forest",
        temperature: 18,
        humidity: 0.7,
        windSpeed: 8,
        lightLevel: 0.8,
        season: "spring",
        timeOfDay: 12,
        id: "default-biome",
      }`},description:"Current biome data",name:"biome",required:!1,type:{name:"BiomeData | undefined"}},particleDensity:{defaultValue:{value:"1"},description:"Particle density multiplier",name:"particleDensity",required:!1,type:{name:"number | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"Animation speed",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},showWeatherEffects:{defaultValue:{value:"true"},description:"Whether to show weather effects",name:"showWeatherEffects",required:!1,type:{name:"boolean | undefined"}},dayNightCycle:{defaultValue:{value:"true"},description:"Whether to show day/night cycle",name:"dayNightCycle",required:!1,type:{name:"boolean | undefined"}},seasonalTransitions:{defaultValue:{value:"true"},description:"Seasonal transitions",name:"seasonalTransitions",required:!1,type:{name:"boolean | undefined"}},wildlifeActivity:{defaultValue:{value:"0.5"},description:"Wildlife activity level",name:"wildlifeActivity",required:!1,type:{name:"number | undefined"}},ambientSoundLevel:{defaultValue:{value:"0.3"},description:"Ambient sound levels",name:"ambientSoundLevel",required:!1,type:{name:"number | undefined"}},windStrength:{defaultValue:{value:"1"},description:"Wind effect strength",name:"windStrength",required:!1,type:{name:"number | undefined"}},showAtmosphericLayers:{defaultValue:{value:"true"},description:"Whether to show atmospheric layers",name:"showAtmosphericLayers",required:!1,type:{name:"boolean | undefined"}},parallaxEnabled:{defaultValue:{value:"true"},description:"Camera parallax enabled",name:"parallaxEnabled",required:!1,type:{name:"boolean | undefined"}},onBiomeChange:{defaultValue:null,description:"Biome change handler",name:"onBiomeChange",required:!1,type:{name:"((biome: BiomeData) => void) | undefined"}},onSeasonChange:{defaultValue:null,description:"Season change handler",name:"onSeasonChange",required:!1,type:{name:'((season: "spring" | "summer" | "autumn" | "winter") => void) | undefined'}},onTimeChange:{defaultValue:null,description:"Time change handler",name:"onTimeChange",required:!1,type:{name:"((timeOfDay: number) => void) | undefined"}},showControls:{defaultValue:{value:"true"},description:"Show controls",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showBiomeInfo:{defaultValue:{value:"true"},description:"Show biome info",name:"showBiomeInfo",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Respect user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const xe=(o,l)=>{const[F,g]=_.useState({width:o,height:l,mobile:!1});return _.useEffect(()=>{const f=()=>{const y=window.innerWidth<520;g({width:y?Math.min(260,window.innerWidth-96):o,height:y?320:l,mobile:y})};return f(),window.addEventListener("resize",f),()=>window.removeEventListener("resize",f)},[l,o]),F},Me=o=>{const l=xe(o.width??800,o.height??500);return n.jsx(S,{...o,width:l.width,height:l.height,showControls:l.mobile?!1:o.showControls})},ze={title:"Effects + Advanced/Glass Biome Simulator",component:S,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{width:{control:{type:"range",min:400,max:1200,step:50}},height:{control:{type:"range",min:300,max:800,step:50}},particleDensity:{control:{type:"range",min:.1,max:3,step:.1}},animationSpeed:{control:{type:"range",min:.1,max:3,step:.1}},wildlifeActivity:{control:{type:"range",min:0,max:1,step:.1}},windStrength:{control:{type:"range",min:.1,max:3,step:.1}}}},D={render:o=>n.jsx(Me,{...o}),args:{width:800,height:500,showControls:!0,showBiomeInfo:!0,dayNightCycle:!0,parallaxEnabled:!0}},k={args:{width:700,height:400,biome:{type:"forest",temperature:18,humidity:.7,windSpeed:8,lightLevel:.8,season:"spring",timeOfDay:14,id:"forest-biome"},particleDensity:1.2,wildlifeActivity:.7}},B={args:{width:800,height:450,biome:{type:"ocean",temperature:22,humidity:.9,windSpeed:15,lightLevel:.9,season:"summer",timeOfDay:12,id:"ocean-biome"},showWeatherEffects:!0,parallaxEnabled:!0}},C={args:{width:600,height:350,biome:{type:"desert",temperature:35,humidity:.2,windSpeed:12,lightLevel:1,season:"summer",timeOfDay:15,id:"desert-biome"},particleDensity:.8,windStrength:1.5}},A={args:{width:700,height:400,biome:{type:"tundra",temperature:-15,humidity:.6,windSpeed:20,lightLevel:.6,season:"winter",timeOfDay:10,id:"tundra-biome"},particleDensity:1.5,showWeatherEffects:!0}},L={args:{width:800,height:400,biome:{type:"grassland",temperature:24,humidity:.5,windSpeed:10,lightLevel:.9,season:"spring",timeOfDay:16,id:"grassland-biome"},wildlifeActivity:.8,windStrength:1.2}},E={args:{width:750,height:450,biome:{type:"rainforest",temperature:26,humidity:.95,windSpeed:5,lightLevel:.6,season:"summer",timeOfDay:13,id:"rainforest-biome"},particleDensity:2,showAtmosphericLayers:!0}},O={args:{width:800,height:500,biome:{type:"mountain",temperature:5,humidity:.7,windSpeed:25,lightLevel:.8,season:"autumn",timeOfDay:11,id:"mountain-biome"},parallaxEnabled:!0,showAtmosphericLayers:!0}},P={args:{width:700,height:400,biome:{type:"swamp",temperature:20,humidity:1,windSpeed:3,lightLevel:.4,season:"autumn",timeOfDay:18,id:"swamp-biome"},particleDensity:1.8,wildlifeActivity:.9}},j={args:{width:600,height:350,biome:{type:"forest",temperature:12,humidity:.8,windSpeed:6,lightLevel:.2,season:"autumn",timeOfDay:2,id:"night-forest"},dayNightCycle:!0,wildlifeActivity:.3}},I={args:{width:800,height:400,biome:{type:"tundra",temperature:-25,humidity:.4,windSpeed:30,lightLevel:.5,season:"winter",timeOfDay:14,id:"winter-tundra"},particleDensity:2.5,windStrength:2,showWeatherEffects:!0}},T={args:{width:700,height:350,biome:{type:"desert",temperature:42,humidity:.1,windSpeed:8,lightLevel:1,season:"summer",timeOfDay:13,id:"summer-desert"},particleDensity:.5,windStrength:1.8}},z={args:{width:500,height:300,showControls:!1,showBiomeInfo:!1,biome:{type:"ocean",temperature:20,humidity:.8,windSpeed:10,lightLevel:.7,season:"spring",timeOfDay:15,id:"minimal-ocean"},particleDensity:.8}},N={args:{width:800,height:500,biome:{type:"rainforest",temperature:28,humidity:1,windSpeed:8,lightLevel:.7,season:"summer",timeOfDay:14,id:"active-rainforest"},particleDensity:3,wildlifeActivity:1,animationSpeed:1.5,showWeatherEffects:!0,showAtmosphericLayers:!0}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: args => <ResponsiveBiomeSimulator {...args} />,
  args: {
    width: 800,
    height: 500,
    showControls: true,
    showBiomeInfo: true,
    dayNightCycle: true,
    parallaxEnabled: true
  }
}`,...D.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 400,
    biome: {
      type: 'forest',
      temperature: 18,
      humidity: 0.7,
      windSpeed: 8,
      lightLevel: 0.8,
      season: 'spring',
      timeOfDay: 14,
      id: 'forest-biome'
    },
    particleDensity: 1.2,
    wildlifeActivity: 0.7
  }
}`,...k.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 450,
    biome: {
      type: 'ocean',
      temperature: 22,
      humidity: 0.9,
      windSpeed: 15,
      lightLevel: 0.9,
      season: 'summer',
      timeOfDay: 12,
      id: 'ocean-biome'
    },
    showWeatherEffects: true,
    parallaxEnabled: true
  }
}`,...B.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 350,
    biome: {
      type: 'desert',
      temperature: 35,
      humidity: 0.2,
      windSpeed: 12,
      lightLevel: 1,
      season: 'summer',
      timeOfDay: 15,
      id: 'desert-biome'
    },
    particleDensity: 0.8,
    windStrength: 1.5
  }
}`,...C.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 400,
    biome: {
      type: 'tundra',
      temperature: -15,
      humidity: 0.6,
      windSpeed: 20,
      lightLevel: 0.6,
      season: 'winter',
      timeOfDay: 10,
      id: 'tundra-biome'
    },
    particleDensity: 1.5,
    showWeatherEffects: true
  }
}`,...A.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 400,
    biome: {
      type: 'grassland',
      temperature: 24,
      humidity: 0.5,
      windSpeed: 10,
      lightLevel: 0.9,
      season: 'spring',
      timeOfDay: 16,
      id: 'grassland-biome'
    },
    wildlifeActivity: 0.8,
    windStrength: 1.2
  }
}`,...L.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    width: 750,
    height: 450,
    biome: {
      type: 'rainforest',
      temperature: 26,
      humidity: 0.95,
      windSpeed: 5,
      lightLevel: 0.6,
      season: 'summer',
      timeOfDay: 13,
      id: 'rainforest-biome'
    },
    particleDensity: 2,
    showAtmosphericLayers: true
  }
}`,...E.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 500,
    biome: {
      type: 'mountain',
      temperature: 5,
      humidity: 0.7,
      windSpeed: 25,
      lightLevel: 0.8,
      season: 'autumn',
      timeOfDay: 11,
      id: 'mountain-biome'
    },
    parallaxEnabled: true,
    showAtmosphericLayers: true
  }
}`,...O.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 400,
    biome: {
      type: 'swamp',
      temperature: 20,
      humidity: 1,
      windSpeed: 3,
      lightLevel: 0.4,
      season: 'autumn',
      timeOfDay: 18,
      id: 'swamp-biome'
    },
    particleDensity: 1.8,
    wildlifeActivity: 0.9
  }
}`,...P.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 350,
    biome: {
      type: 'forest',
      temperature: 12,
      humidity: 0.8,
      windSpeed: 6,
      lightLevel: 0.2,
      season: 'autumn',
      timeOfDay: 2,
      id: 'night-forest'
    },
    dayNightCycle: true,
    wildlifeActivity: 0.3
  }
}`,...j.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 400,
    biome: {
      type: 'tundra',
      temperature: -25,
      humidity: 0.4,
      windSpeed: 30,
      lightLevel: 0.5,
      season: 'winter',
      timeOfDay: 14,
      id: 'winter-tundra'
    },
    particleDensity: 2.5,
    windStrength: 2,
    showWeatherEffects: true
  }
}`,...I.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 350,
    biome: {
      type: 'desert',
      temperature: 42,
      humidity: 0.1,
      windSpeed: 8,
      lightLevel: 1,
      season: 'summer',
      timeOfDay: 13,
      id: 'summer-desert'
    },
    particleDensity: 0.5,
    windStrength: 1.8
  }
}`,...T.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    width: 500,
    height: 300,
    showControls: false,
    showBiomeInfo: false,
    biome: {
      type: 'ocean',
      temperature: 20,
      humidity: 0.8,
      windSpeed: 10,
      lightLevel: 0.7,
      season: 'spring',
      timeOfDay: 15,
      id: 'minimal-ocean'
    },
    particleDensity: 0.8
  }
}`,...z.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 500,
    biome: {
      type: 'rainforest',
      temperature: 28,
      humidity: 1,
      windSpeed: 8,
      lightLevel: 0.7,
      season: 'summer',
      timeOfDay: 14,
      id: 'active-rainforest'
    },
    particleDensity: 3,
    wildlifeActivity: 1,
    animationSpeed: 1.5,
    showWeatherEffects: true,
    showAtmosphericLayers: true
  }
}`,...N.parameters?.docs?.source}}};const Ne=["Default","ForestBiome","OceanBiome","DesertBiome","TundraBiome","GrasslandBiome","RainforestBiome","MountainBiome","SwampBiome","NightTimeForest","WinterTundra","SummerDesert","MinimalInterface","HighActivity"];export{D as Default,C as DesertBiome,k as ForestBiome,L as GrasslandBiome,N as HighActivity,z as MinimalInterface,O as MountainBiome,j as NightTimeForest,B as OceanBiome,E as RainforestBiome,T as SummerDesert,P as SwampBiome,A as TundraBiome,I as WinterTundra,Ne as __namedExportsOrder,ze as default};
