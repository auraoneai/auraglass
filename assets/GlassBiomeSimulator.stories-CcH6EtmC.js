import{r as u,h as ye,R as be,j as i,c as we}from"./iframe-C2Py7iTP.js";import{u as ve}from"./MotionPreferenceContext-DOVeBjOR.js";import{O as se}from"./OptimizedGlassCore-xEcyrF8U.js";import{M as Se}from"./MotionFramer-Bqa_dH4n.js";import"./preload-helper-PPVm8Dsz.js";import"./utilsCore-DHlzAtb4.js";const N=u.forwardRef(({width:m=800,height:l=500,biome:re={type:"forest",temperature:18,humidity:.7,windSpeed:8,lightLevel:.8,season:"spring",timeOfDay:12,id:"default-biome"},particleDensity:g=1,animationSpeed:w=1,showWeatherEffects:V=!0,dayNightCycle:F=!0,seasonalTransitions:Me=!0,wildlifeActivity:xe=.5,ambientSoundLevel:De=.3,windStrength:G=1,showAtmosphericLayers:_=!0,parallaxEnabled:z=!0,onBiomeChange:ne,onSeasonChange:ie,onTimeChange:oe,showControls:le=!0,showBiomeInfo:H=!0,respectMotionPreference:$=!0,className:de,...me},ce)=>{const{prefersReducedMotion:U,isMotionSafe:ue}=ve(),q=u.useRef(null),v=u.useRef(),he=ye("glass-biome-simulator"),[o,R]=u.useState(re),[Y,J]=u.useState([]),[K,pe]=u.useState([]),[Q,fe]=u.useState(0),[X,ke]=u.useState({x:0,y:0}),f=be.useMemo(()=>({forest:{colors:{sky:["#87CEEB","#98FB98"],ground:[34,139,34],accent:[139,69,19]},particles:["leaf","pollen","insect"],elements:["tree","grass","flower"],sounds:["birds","rustling","wind"]},ocean:{colors:{sky:["#87CEEB","#E0F6FF"],ground:[25,25,112],accent:[255,255,255]},particles:["water","droplet"],elements:["water","cloud"],sounds:["waves","seagulls","wind"]},desert:{colors:{sky:["#FFD700","#FFA500"],ground:[238,203,173],accent:[160,82,45]},particles:["dust","sand"],elements:["rock","cactus"],sounds:["wind","sand"]},tundra:{colors:{sky:["#B0C4DE","#F0F8FF"],ground:[248,248,255],accent:[70,130,180]},particles:["snow","ice"],elements:["ice","rock"],sounds:["wind","ice"]},grassland:{colors:{sky:["#87CEEB","#98FB98"],ground:[124,252,0],accent:[255,215,0]},particles:["pollen","grass"],elements:["grass","flower"],sounds:["wind","insects"]},rainforest:{colors:{sky:["#228B22","#90EE90"],ground:[0,100,0],accent:[255,69,0]},particles:["water","leaf","spore"],elements:["tree","vine","flower"],sounds:["rain","birds","insects"]},mountain:{colors:{sky:["#4682B4","#E0F6FF"],ground:[105,105,105],accent:[255,255,255]},particles:["snow","cloud"],elements:["mountain","rock","snow"],sounds:["wind","echo"]},swamp:{colors:{sky:["#696969","#A9A9A9"],ground:[85,107,47],accent:[255,140,0]},particles:["fog","insect","bubble"],elements:["water","tree","fog"],sounds:["frogs","insects","bubbles"]}}),[]),Z=u.useCallback(s=>{f[s];const e=[];e.push({name:"Background",depth:0,opacity:1,parallaxSpeed:.1,id:"bg-layer",elements:[]});const d=[];if(s==="forest")for(let a=0;a<8;a++)d.push({type:"tree",x:a*m/8+Math.random()*50,y:l*.3+Math.random()*50,width:60+Math.random()*40,height:80+Math.random()*60,color:[34,100,34],opacity:.6,id:`far-tree-${a}`});else if(s==="mountain")for(let a=0;a<5;a++)d.push({type:"mountain",x:a*m/4,y:l*.2,width:m/3,height:l*.6,color:[105,105,105],opacity:.7,id:`mountain-${a}`});e.push({name:"Far",depth:1,opacity:.8,parallaxSpeed:.3,id:"far-layer",elements:d});const n=[];if(s==="grassland")for(let a=0;a<20;a++)n.push({type:"grass",x:Math.random()*m,y:l*.7+Math.random()*l*.2,width:10+Math.random()*20,height:20+Math.random()*30,color:[124,252,0],opacity:.8,id:`grass-${a}`});else s==="ocean"&&n.push({type:"water",x:0,y:l*.6,width:m,height:l*.4,color:[25,25,112],opacity:.8,animation:"wave",id:"ocean-water"});e.push({name:"Mid",depth:2,opacity:.9,parallaxSpeed:.6,id:"mid-layer",elements:n});const c=[];if(s==="forest")for(let a=0;a<3;a++)c.push({type:"tree",x:a*m/3+Math.random()*100,y:l*.2,width:80+Math.random()*60,height:120+Math.random()*80,color:[34,139,34],opacity:1,id:`near-tree-${a}`});return e.push({name:"Near",depth:3,opacity:1,parallaxSpeed:1,id:"near-layer",elements:c}),e},[m,l,f]),S=u.useCallback((s,e)=>{const d=f[s],n=[];for(let c=0;c<e;c++){const a=d.particles[Math.floor(Math.random()*d.particles.length)];let r={x:Math.random()*m,y:Math.random()*l,size:Math.random()*5+2,opacity:Math.random()*.8+.2,lifetime:Math.random()*1e4+5e3,rotation:Math.random()*Math.PI*2,rotationSpeed:(Math.random()-.5)*.1,type:a,id:`particle-${a}-${c}-${Date.now()}`};switch(a){case"leaf":r={...r,vx:(Math.random()-.5)*2,vy:Math.random()*1+.5,color:[34,139,34],size:Math.random()*8+4,rotationSpeed:(Math.random()-.5)*.2};break;case"pollen":r={...r,vx:(Math.random()-.5)*1,vy:(Math.random()-.5)*.5,color:[255,215,0],size:Math.random()*3+1};break;case"water":r={...r,vx:(Math.random()-.5)*.5,vy:Math.random()*3+2,color:[173,216,230],size:Math.random()*4+2};break;case"droplet":r={...r,vx:(Math.random()-.5)*.4,vy:Math.random()*2.5+1.5,color:[173,216,230],size:Math.random()*3+1};break;case"dust":r={...r,vx:o.windSpeed*.1+(Math.random()-.5)*1,vy:(Math.random()-.5)*.5,color:[238,203,173],size:Math.random()*2+1,opacity:Math.random()*.5+.1};break;case"sand":r={...r,vx:o.windSpeed*.15+(Math.random()-.5)*1,vy:(Math.random()-.5)*.3,color:[237,201,175],size:Math.random()*2+.5,opacity:Math.random()*.4+.1};break;case"snow":r={...r,vx:(Math.random()-.5)*o.windSpeed*.1,vy:Math.random()*2+1,color:[255,255,255],size:Math.random()*6+3,rotationSpeed:(Math.random()-.5)*.1};break;case"ice":r={...r,vx:(Math.random()-.5)*o.windSpeed*.08,vy:Math.random()*1.5+.5,color:[200,230,255],size:Math.random()*4+2,rotationSpeed:(Math.random()-.5)*.08};break;case"insect":r={...r,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,color:[0,0,0],size:Math.random()*2+1};break;case"spore":r={...r,vx:(Math.random()-.5)*.5,vy:-Math.random()*.5,color:[144,238,144],size:Math.random()*3+1,opacity:Math.random()*.6+.2};break;case"fog":r={...r,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.1,color:[210,210,220],size:Math.random()*20+10,opacity:Math.random()*.2+.05};break;case"bubble":r={...r,vx:(Math.random()-.5)*.3,vy:-Math.random()*.8,color:[180,220,255],size:Math.random()*5+2,opacity:Math.random()*.5+.2};break;case"cloud":r={...r,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.1,color:[220,220,230],size:Math.random()*30+20,opacity:Math.random()*.25+.1};break}n.push(r)}return n},[m,l,f,o.windSpeed]);u.useEffect(()=>{const s=Z(o.type);pe(s);const e=Math.floor(50*g),d=S(o.type,e);J(d)},[o.type,Z,S,g]);const ee=u.useCallback(s=>{J(e=>{const d=e.map(n=>{const c=o.windSpeed*G*.01;return{...n,x:n.x+(n.vx+c)*s*w,y:n.y+n.vy*s*w,rotation:n.rotation+n.rotationSpeed*s*w,lifetime:n.lifetime-s}}).filter(n=>n.lifetime>0&&n.x>-50&&n.x<m+50&&n.y>-50&&n.y<l+50);if(d.length<50*g){const n=Math.min(5,Math.floor(50*g)-d.length),c=S(o.type,n);return[...d,...c]}return d})},[o,G,w,m,l,S,g]),ae=u.useCallback((s,e)=>{if(!F)return e;const d=s>=6&&s<=18,n=d?Math.sin((s-6)/12*Math.PI):.2;return e.map(c=>{const a=parseInt(c.slice(1,3),16),r=parseInt(c.slice(3,5),16),t=parseInt(c.slice(5,7),16),p=Math.round(a*n),y=Math.round(r*n),h=Math.round(t*n+(d?0:50));return`rgb(${p}, ${y}, ${h})`})},[F]),W=u.useCallback(()=>{const s=q.current;if(!s)return;const e=s.getContext("2d");if(!e)return;const d=f[o.type],n=ae(o.timeOfDay,d.colors.sky),c=e.createLinearGradient(0,0,0,l);c.addColorStop(0,n[0]),c.addColorStop(1,n[1]),e.fillStyle=c,e.fillRect(0,0,m,l),_&&K.forEach(a=>{e.save(),e.globalAlpha=a.opacity;const r=z?X.x*a.parallaxSpeed:0;a.elements.forEach(t=>{e.save(),e.translate(t.x+r,t.y),e.globalAlpha=t.opacity;const p=`rgb(${t.color[0]}, ${t.color[1]}, ${t.color[2]})`;switch(t.type){case"tree":e.fillStyle=p,e.fillRect(-t.width*.1,0,t.width*.2,t.height*.3),e.beginPath(),e.ellipse?e.ellipse(0,-t.height*.3,t.width*.5,t.height*.7,0,0,Math.PI*2):e.arc(0,-t.height*.3,t.width*.5,0,Math.PI*2),e.fill();break;case"mountain":e.fillStyle=p,e.beginPath(),e.moveTo(-t.width*.5,t.height),e.lineTo(0,0),e.lineTo(t.width*.5,t.height),e.closePath(),e.fill();break;case"grass":e.strokeStyle=p,e.lineWidth=2,e.beginPath(),e.moveTo(0,t.height),e.quadraticCurveTo(t.width*.5,0,0,-t.height*.5),e.stroke();break;case"cloud":e.fillStyle=p,e.globalAlpha=t.opacity*.6,e.beginPath();const y=Math.max(10,Math.min(t.width,t.height)*.3);for(let h=-2;h<=2;h++)e.moveTo(h*y*.8,0),e.arc(h*y*.8,0,y*(1-Math.abs(h)*.1),0,Math.PI*2);e.fill(),e.globalAlpha=t.opacity;break;case"water":if(e.fillStyle=p,e.fillRect(-t.width*.5,0,t.width,t.height),t.animation==="wave"){e.strokeStyle="var(--glass-bg-hover)",e.lineWidth=1;const h=Q*.002;for(let b=0;b<t.width;b+=10){const te=Math.sin((b+h*100)*.02)*5;e.beginPath(),e.moveTo(b-t.width*.5,te),e.lineTo(b+5-t.width*.5,te),e.stroke()}}break;case"rock":e.fillStyle=p,e.beginPath(),e.ellipse?e.ellipse(0,0,t.width*.5,t.height*.3,0,0,Math.PI*2):e.arc(0,0,t.width*.5,0,Math.PI*2),e.fill();break;case"flower":e.fillStyle=p,e.beginPath(),e.arc(0,0,t.size||5,0,Math.PI*2),e.fill(),e.fillStyle="rgba(255, 100, 150, 0.8)";for(let h=0;h<5;h++)e.save(),e.rotate(h/5*Math.PI*2),e.beginPath(),e.ellipse?e.ellipse(0,-8,3,6,0,0,Math.PI*2):e.arc(0,-8,3,0,Math.PI*2),e.fill(),e.restore();break}e.restore()}),e.restore()}),Y.forEach(a=>{e.save(),e.globalAlpha=a.opacity,e.translate(a.x,a.y),e.rotate(a.rotation);const r=Array.isArray(a.color)?`rgb(${a.color[0]}, ${a.color[1]}, ${a.color[2]})`:"var(--glass-white)";switch(a.type){case"leaf":e.fillStyle=r,e.beginPath(),e.ellipse?e.ellipse(0,0,a.size,a.size*.6,0,0,Math.PI*2):e.arc(0,0,a.size,0,Math.PI*2),e.fill();break;case"pollen":case"dust":case"sand":case"spore":e.fillStyle=r,e.beginPath(),e.arc(0,0,a.size,0,Math.PI*2),e.fill();break;case"snow":case"ice":e.fillStyle=r,e.beginPath(),e.arc(0,0,a.size,0,Math.PI*2),e.fill(),e.strokeStyle=r,e.lineWidth=.5;for(let p=0;p<6;p++)e.beginPath(),e.moveTo(0,0),e.lineTo(0,-a.size),e.stroke(),e.rotate(Math.PI/3);break;case"water":case"droplet":case"bubble":e.fillStyle=r,e.beginPath(),e.arc(0,0,a.size,0,Math.PI*2),e.fill();break;case"fog":case"cloud":const t=e.createRadialGradient(0,0,0,0,0,a.size);t.addColorStop(0,`rgba(${Array.isArray(a.color)?`${a.color[0]}, ${a.color[1]}, ${a.color[2]}`:"255, 255, 255"}, ${Math.min(.5,a.opacity)})`),t.addColorStop(1,"rgba(255, 255, 255, 0)"),e.fillStyle=t,e.beginPath(),e.arc(0,0,a.size,0,Math.PI*2),e.fill();break;case"insect":e.fillStyle=r,e.fillRect(-a.size*.5,-a.size*.2,a.size,a.size*.4);break}e.restore()}),V&&(o.humidity>.8&&(e.save(),e.globalAlpha=(o.humidity-.8)*.5,e.fillStyle="rgba(200, 200, 220, 0.1)",e.fillRect(0,0,m,l),e.restore()),o.temperature<0&&(e.save(),e.globalAlpha=Math.abs(o.temperature)*.01,e.fillStyle="rgba(173, 216, 230, 0.1)",e.fillRect(0,0,m,l),e.restore())),H&&(e.save(),e.fillStyle="var(--glass-text-secondary-dark)",e.fillRect(10,10,250,140),e.fillStyle="white",e.font="14px sans-serif",e.fillText(`Biome: ${o.type}`,20,30),e.fillText(`Season: ${o.season}`,20,50),e.fillText(`Temperature: ${o.temperature}°C`,20,70),e.fillText(`Humidity: ${Math.round(o.humidity*100)}%`,20,90),e.fillText(`Wind: ${Math.round(o.windSpeed)} km/h`,20,110),e.fillText(`Time: ${Math.floor(o.timeOfDay)}:${String(Math.floor(o.timeOfDay%1*60)).padStart(2,"0")}`,20,130),e.restore())},[m,l,f,o,ae,_,K,z,X,Q,Y,V,H]);u.useEffect(()=>{if(U&&$){W();return}const s=e=>{fe(n=>n+16),ee(16),W(),v.current=requestAnimationFrame(s)};return v.current=requestAnimationFrame(s),()=>{v.current&&cancelAnimationFrame(v.current)}},[U,$,W,ee]),u.useEffect(()=>{const s=q.current;s&&(s.width=m,s.height=l)},[m,l]);const ge=()=>le?i.jsxs(se,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:"glass-biome-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard",children:[i.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[i.jsx("label",{className:"glass-text-sm",htmlFor:"biome-select",children:"Biome:"}),i.jsxs("select",{id:"biome-select",value:o.type,onChange:s=>{const e={...o,type:s.target.value};R(e),ne?.(e)},className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20 glass-contrast-guard","aria-label":"Select biome type",children:[i.jsx("option",{value:"forest",children:"Forest"}),i.jsx("option",{value:"ocean",children:"Ocean"}),i.jsx("option",{value:"desert",children:"Desert"}),i.jsx("option",{value:"tundra",children:"Tundra"}),i.jsx("option",{value:"grassland",children:"Grassland"}),i.jsx("option",{value:"rainforest",children:"Rainforest"}),i.jsx("option",{value:"mountain",children:"Mountain"}),i.jsx("option",{value:"swamp",children:"Swamp"})]})]}),i.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[i.jsx("label",{className:"glass-text-sm",htmlFor:"biome-season-select",children:"Season:"}),i.jsxs("select",{id:"biome-season-select",value:o.season,onChange:s=>{const e={...o,season:s.target.value};R(e),ie?.(s.target.value)},className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20 glass-contrast-guard","aria-label":"Select season",children:[i.jsx("option",{value:"spring",children:"Spring"}),i.jsx("option",{value:"summer",children:"Summer"}),i.jsx("option",{value:"autumn",children:"Autumn"}),i.jsx("option",{value:"winter",children:"Winter"})]})]}),i.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[i.jsx("label",{className:"glass-text-sm",htmlFor:"biome-time-range",children:"Time:"}),i.jsx("input",{id:"biome-time-range",type:"range",min:"0",max:"24",step:"0.5",value:o.timeOfDay,onChange:s=>{const e=parseFloat(s.target.value);R(d=>({...d,timeOfDay:e})),oe?.(e)},className:"glass-w-20","aria-label":"Adjust time of day"})]}),i.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[i.jsxs("label",{className:"glass-text-sm",children:[i.jsx("input",{type:"checkbox",checked:F,onChange:s=>{},className:"glass-mr-1"}),"Day/Night"]}),i.jsxs("label",{className:"glass-text-sm",children:[i.jsx("input",{type:"checkbox",checked:z,onChange:s=>{},className:"glass-mr-1"}),"Parallax"]})]})]}):null;return i.jsx(se,{ref:ce,id:he,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",className:we("glass-biome-simulator relative glass-radius-lg glass-glass-backdrop-blur-md border border-border/20",de),...me,children:i.jsxs(Se,{preset:ue&&$?"fadeIn":"none",className:"glass-flex glass-flex-col glass-gap-4 glass-p-4",children:[ge(),i.jsx("div",{className:"glass-relative",children:i.jsx("canvas",{ref:q,width:m,height:l,className:"glass-border glass-border-glass-border/20 glass-radius-md",style:{width:m,height:l}})})]})})});N.displayName="GlassBiomeSimulator";try{N.displayName="GlassBiomeSimulator",N.__docgenInfo={description:"",displayName:"GlassBiomeSimulator",props:{width:{defaultValue:{value:"800"},description:"Canvas width",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"500"},description:"Canvas height",name:"height",required:!1,type:{name:"number | undefined"}},biome:{defaultValue:{value:`{
        type: "forest",
        temperature: 18,
        humidity: 0.7,
        windSpeed: 8,
        lightLevel: 0.8,
        season: "spring",
        timeOfDay: 12,
        id: "default-biome",
      }`},description:"Current biome data",name:"biome",required:!1,type:{name:"BiomeData | undefined"}},particleDensity:{defaultValue:{value:"1"},description:"Particle density multiplier",name:"particleDensity",required:!1,type:{name:"number | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"Animation speed",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},showWeatherEffects:{defaultValue:{value:"true"},description:"Whether to show weather effects",name:"showWeatherEffects",required:!1,type:{name:"boolean | undefined"}},dayNightCycle:{defaultValue:{value:"true"},description:"Whether to show day/night cycle",name:"dayNightCycle",required:!1,type:{name:"boolean | undefined"}},seasonalTransitions:{defaultValue:{value:"true"},description:"Seasonal transitions",name:"seasonalTransitions",required:!1,type:{name:"boolean | undefined"}},wildlifeActivity:{defaultValue:{value:"0.5"},description:"Wildlife activity level",name:"wildlifeActivity",required:!1,type:{name:"number | undefined"}},ambientSoundLevel:{defaultValue:{value:"0.3"},description:"Ambient sound levels",name:"ambientSoundLevel",required:!1,type:{name:"number | undefined"}},windStrength:{defaultValue:{value:"1"},description:"Wind effect strength",name:"windStrength",required:!1,type:{name:"number | undefined"}},showAtmosphericLayers:{defaultValue:{value:"true"},description:"Whether to show atmospheric layers",name:"showAtmosphericLayers",required:!1,type:{name:"boolean | undefined"}},parallaxEnabled:{defaultValue:{value:"true"},description:"Camera parallax enabled",name:"parallaxEnabled",required:!1,type:{name:"boolean | undefined"}},onBiomeChange:{defaultValue:null,description:"Biome change handler",name:"onBiomeChange",required:!1,type:{name:"((biome: BiomeData) => void) | undefined"}},onSeasonChange:{defaultValue:null,description:"Season change handler",name:"onSeasonChange",required:!1,type:{name:'((season: "spring" | "summer" | "autumn" | "winter") => void) | undefined'}},onTimeChange:{defaultValue:null,description:"Time change handler",name:"onTimeChange",required:!1,type:{name:"((timeOfDay: number) => void) | undefined"}},showControls:{defaultValue:{value:"true"},description:"Show controls",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showBiomeInfo:{defaultValue:{value:"true"},description:"Show biome info",name:"showBiomeInfo",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Respect user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const Ee={title:"Glass UI/Atmospheric/GlassBiomeSimulator",component:N,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{width:{control:{type:"range",min:400,max:1200,step:50}},height:{control:{type:"range",min:300,max:800,step:50}},particleDensity:{control:{type:"range",min:.1,max:3,step:.1}},animationSpeed:{control:{type:"range",min:.1,max:3,step:.1}},wildlifeActivity:{control:{type:"range",min:0,max:1,step:.1}},windStrength:{control:{type:"range",min:.1,max:3,step:.1}}}},M={args:{width:800,height:500,showControls:!0,showBiomeInfo:!0,dayNightCycle:!0,parallaxEnabled:!0}},x={args:{width:700,height:400,biome:{type:"forest",temperature:18,humidity:.7,windSpeed:8,lightLevel:.8,season:"spring",timeOfDay:14,id:"forest-biome"},particleDensity:1.2,wildlifeActivity:.7}},D={args:{width:800,height:450,biome:{type:"ocean",temperature:22,humidity:.9,windSpeed:15,lightLevel:.9,season:"summer",timeOfDay:12,id:"ocean-biome"},showWeatherEffects:!0,parallaxEnabled:!0}},k={args:{width:600,height:350,biome:{type:"desert",temperature:35,humidity:.2,windSpeed:12,lightLevel:1,season:"summer",timeOfDay:15,id:"desert-biome"},particleDensity:.8,windStrength:1.5}},B={args:{width:700,height:400,biome:{type:"tundra",temperature:-15,humidity:.6,windSpeed:20,lightLevel:.6,season:"winter",timeOfDay:10,id:"tundra-biome"},particleDensity:1.5,showWeatherEffects:!0}},C={args:{width:800,height:400,biome:{type:"grassland",temperature:24,humidity:.5,windSpeed:10,lightLevel:.9,season:"spring",timeOfDay:16,id:"grassland-biome"},wildlifeActivity:.8,windStrength:1.2}},A={args:{width:750,height:450,biome:{type:"rainforest",temperature:26,humidity:.95,windSpeed:5,lightLevel:.6,season:"summer",timeOfDay:13,id:"rainforest-biome"},particleDensity:2,showAtmosphericLayers:!0}},L={args:{width:800,height:500,biome:{type:"mountain",temperature:5,humidity:.7,windSpeed:25,lightLevel:.8,season:"autumn",timeOfDay:11,id:"mountain-biome"},parallaxEnabled:!0,showAtmosphericLayers:!0}},O={args:{width:700,height:400,biome:{type:"swamp",temperature:20,humidity:1,windSpeed:3,lightLevel:.4,season:"autumn",timeOfDay:18,id:"swamp-biome"},particleDensity:1.8,wildlifeActivity:.9}},P={args:{width:600,height:350,biome:{type:"forest",temperature:12,humidity:.8,windSpeed:6,lightLevel:.2,season:"autumn",timeOfDay:2,id:"night-forest"},dayNightCycle:!0,wildlifeActivity:.3}},E={args:{width:800,height:400,biome:{type:"tundra",temperature:-25,humidity:.4,windSpeed:30,lightLevel:.5,season:"winter",timeOfDay:14,id:"winter-tundra"},particleDensity:2.5,windStrength:2,showWeatherEffects:!0}},j={args:{width:700,height:350,biome:{type:"desert",temperature:42,humidity:.1,windSpeed:8,lightLevel:1,season:"summer",timeOfDay:13,id:"summer-desert"},particleDensity:.5,windStrength:1.8}},I={args:{width:500,height:300,showControls:!1,showBiomeInfo:!1,biome:{type:"ocean",temperature:20,humidity:.8,windSpeed:10,lightLevel:.7,season:"spring",timeOfDay:15,id:"minimal-ocean"},particleDensity:.8}},T={args:{width:800,height:500,biome:{type:"rainforest",temperature:28,humidity:1,windSpeed:8,lightLevel:.7,season:"summer",timeOfDay:14,id:"active-rainforest"},particleDensity:3,wildlifeActivity:1,animationSpeed:1.5,showWeatherEffects:!0,showAtmosphericLayers:!0}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 500,
    showControls: true,
    showBiomeInfo: true,
    dayNightCycle: true,
    parallaxEnabled: true
  }
}`,...M.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}};const je=["Default","ForestBiome","OceanBiome","DesertBiome","TundraBiome","GrasslandBiome","RainforestBiome","MountainBiome","SwampBiome","NightTimeForest","WinterTundra","SummerDesert","MinimalInterface","HighActivity"];export{M as Default,k as DesertBiome,x as ForestBiome,C as GrasslandBiome,T as HighActivity,I as MinimalInterface,L as MountainBiome,P as NightTimeForest,D as OceanBiome,A as RainforestBiome,j as SummerDesert,O as SwampBiome,B as TundraBiome,E as WinterTundra,je as __namedExportsOrder,Ee as default};
