import{r as h,R as Q,j as s,c as Le}from"./iframe-DFMMcocb.js";import{u as Ae}from"./a11y-Q0mX7KvA.js";import{u as je}from"./MotionPreferenceContext-VYRcsRrk.js";import{O as me}from"./OptimizedGlassCore-1D6AE-uZ.js";import{M as Be}from"./MotionFramer-Cvto7X39.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-iDxBLJQX.js";import"./utilsCore-D5Hayjvj.js";const k=h.forwardRef(({width:r=800,height:n=500,biome:G={type:"forest",temperature:18,humidity:.7,windSpeed:8,lightLevel:.8,season:"spring",timeOfDay:12,id:"default-biome"},particleDensity:b=1,animationSpeed:y=1,showWeatherEffects:x=!0,dayNightCycle:ue=!0,seasonalTransitions:$e=!0,wildlifeActivity:Ee=.5,ambientSoundLevel:ze=.3,windStrength:X=1,showAtmosphericLayers:Z=!0,parallaxEnabled:he=!0,onBiomeChange:pe,onSeasonChange:ge,onTimeChange:fe,showControls:ye=!0,showBiomeInfo:ee=!0,respectMotionPreference:F=!0,className:be,...we},xe)=>{const{prefersReducedMotion:ae,isMotionSafe:ve}=je(),_=h.useRef(null),D=h.useRef(),w=Ae("glass-biome-simulator"),[c,H]=h.useState(G),[te,re]=h.useState([]),[se,Se]=h.useState([]),[ne,Me]=h.useState(0),[ie,Ie]=h.useState({x:0,y:0}),[U,ke]=h.useState(ue),[Y,De]=h.useState(he),v=Q.useMemo(()=>({forest:{colors:{sky:["#dfe8eb","#b8c8c3"],ground:[72,91,82],accent:[111,104,91]},particles:["leaf","pollen","insect"],elements:["tree","grass","flower"],sounds:["birds","rustling","wind"]},ocean:{colors:{sky:["#dfe9ee","#afc1ca"],ground:[65,89,104],accent:[225,231,233]},particles:["water","droplet"],elements:["water","cloud"],sounds:["waves","seagulls","wind"]},desert:{colors:{sky:["#ede7df","#cbbdac"],ground:[157,137,112],accent:[126,105,86]},particles:["dust","sand"],elements:["rock","cactus"],sounds:["wind","sand"]},tundra:{colors:{sky:["#e8edf0","#c6d0d7"],ground:[211,219,224],accent:[107,126,139]},particles:["snow","ice"],elements:["ice","rock"],sounds:["wind","ice"]},grassland:{colors:{sky:["#e5e9e3","#bdc8b9"],ground:[102,117,91],accent:[151,139,99]},particles:["pollen","grass"],elements:["grass","flower"],sounds:["wind","insects"]},rainforest:{colors:{sky:["#d9e3df","#a9bab1"],ground:[55,79,68],accent:[119,101,82]},particles:["water","leaf","spore"],elements:["tree","vine","flower"],sounds:["rain","birds","insects"]},mountain:{colors:{sky:["#e2e8ec","#b7c4cc"],ground:[103,108,111],accent:[222,227,230]},particles:["snow","cloud"],elements:["mountain","rock","snow"],sounds:["wind","echo"]},swamp:{colors:{sky:["#d7dcda","#a9b1ad"],ground:[73,83,73],accent:[136,118,91]},particles:["fog","insect","bubble"],elements:["water","tree","fog"],sounds:["frogs","insects","bubbles"]}}),[]),oe=h.useCallback(l=>{v[l];const e=[];e.push({name:"Background",depth:0,opacity:1,parallaxSpeed:.1,id:"bg-layer",elements:[]});const o=[];if(l==="forest")for(let m=0;m<8;m++)o.push({type:"tree",x:m*r/8+Math.random()*50,y:n*.3+Math.random()*50,width:60+Math.random()*40,height:80+Math.random()*60,color:[74,91,82],opacity:.6,id:`far-tree-${m}`});else if(l==="mountain")for(let m=0;m<5;m++)o.push({type:"mountain",x:m*r/4,y:n*.2,width:r/3,height:n*.6,color:[105,105,105],opacity:.7,id:`mountain-${m}`});e.push({name:"Far",depth:1,opacity:.8,parallaxSpeed:.3,id:"far-layer",elements:o});const t=[];if(l==="grassland")for(let m=0;m<20;m++)t.push({type:"grass",x:Math.random()*r,y:n*.7+Math.random()*n*.2,width:10+Math.random()*20,height:20+Math.random()*30,color:[101,116,91],opacity:.8,id:`grass-${m}`});else l==="ocean"&&t.push({type:"water",x:0,y:n*.6,width:r,height:n*.4,color:[66,91,105],opacity:.8,animation:"wave",id:"ocean-water"});e.push({name:"Mid",depth:2,opacity:.9,parallaxSpeed:.6,id:"mid-layer",elements:t});const u=[];if(l==="forest")for(let m=0;m<3;m++)u.push({type:"tree",x:m*r/3+Math.random()*100,y:n*.2,width:80+Math.random()*60,height:120+Math.random()*80,color:[65,84,73],opacity:1,id:`near-tree-${m}`});return e.push({name:"Near",depth:3,opacity:1,parallaxSpeed:1,id:"near-layer",elements:u}),e},[r,n,v]),C=h.useCallback((l,e)=>{const o=v[l],t=[];for(let u=0;u<e;u++){const m=o.particles[Math.floor(Math.random()*o.particles.length)];let d={x:Math.random()*r,y:Math.random()*n,size:Math.random()*5+2,opacity:Math.random()*.8+.2,lifetime:Math.random()*1e4+5e3,rotation:Math.random()*Math.PI*2,rotationSpeed:(Math.random()-.5)*.1,type:m,id:`particle-${m}-${u}-${Date.now()}`};switch(m){case"leaf":d={...d,vx:(Math.random()-.5)*2,vy:Math.random()*1+.5,color:[34,139,34],size:Math.random()*8+4,rotationSpeed:(Math.random()-.5)*.2};break;case"pollen":d={...d,vx:(Math.random()-.5)*1,vy:(Math.random()-.5)*.5,color:[255,215,0],size:Math.random()*3+1};break;case"water":d={...d,vx:(Math.random()-.5)*.5,vy:Math.random()*3+2,color:[173,216,230],size:Math.random()*4+2};break;case"droplet":d={...d,vx:(Math.random()-.5)*.4,vy:Math.random()*2.5+1.5,color:[173,216,230],size:Math.random()*3+1};break;case"dust":d={...d,vx:c.windSpeed*.1+(Math.random()-.5)*1,vy:(Math.random()-.5)*.5,color:[238,203,173],size:Math.random()*2+1,opacity:Math.random()*.5+.1};break;case"sand":d={...d,vx:c.windSpeed*.15+(Math.random()-.5)*1,vy:(Math.random()-.5)*.3,color:[237,201,175],size:Math.random()*2+.5,opacity:Math.random()*.4+.1};break;case"snow":d={...d,vx:(Math.random()-.5)*c.windSpeed*.1,vy:Math.random()*2+1,color:[255,255,255],size:Math.random()*6+3,rotationSpeed:(Math.random()-.5)*.1};break;case"ice":d={...d,vx:(Math.random()-.5)*c.windSpeed*.08,vy:Math.random()*1.5+.5,color:[200,230,255],size:Math.random()*4+2,rotationSpeed:(Math.random()-.5)*.08};break;case"insect":d={...d,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,color:[0,0,0],size:Math.random()*2+1};break;case"spore":d={...d,vx:(Math.random()-.5)*.5,vy:-Math.random()*.5,color:[144,238,144],size:Math.random()*3+1,opacity:Math.random()*.6+.2};break;case"fog":d={...d,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.1,color:[210,210,220],size:Math.random()*20+10,opacity:Math.random()*.2+.05};break;case"bubble":d={...d,vx:(Math.random()-.5)*.3,vy:-Math.random()*.8,color:[180,220,255],size:Math.random()*5+2,opacity:Math.random()*.5+.2};break;case"cloud":d={...d,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.1,color:[220,220,230],size:Math.random()*30+20,opacity:Math.random()*.25+.1};break}t.push(d)}return t},[r,n,v,c.windSpeed]);h.useEffect(()=>{const l=oe(c.type);Se(l);const e=Math.floor(50*b),o=C(c.type,e);re(o)},[c.type,oe,C,b]);const le=h.useCallback(l=>{re(e=>{const o=e.map(t=>{const u=c.windSpeed*X*.01;return{...t,x:t.x+(t.vx+u)*l*y,y:t.y+t.vy*l*y,rotation:t.rotation+t.rotationSpeed*l*y,lifetime:t.lifetime-l}}).filter(t=>t.lifetime>0&&t.x>-50&&t.x<r+50&&t.y>-50&&t.y<n+50);if(o.length<50*b){const t=Math.min(5,Math.floor(50*b)-o.length),u=C(c.type,t);return[...o,...u]}return o})},[c,X,y,r,n,C,b]),de=h.useCallback((l,e)=>{if(!U)return e;const o=l>=6&&l<=18,t=o?Math.sin((l-6)/12*Math.PI):.2;return e.map(u=>{const m=parseInt(u.slice(1,3),16),d=parseInt(u.slice(3,5),16),L=parseInt(u.slice(5,7),16),A=Math.round(m*t),S=Math.round(d*t),i=Math.round(L*t+(o?0:50));return`rgb(${A}, ${S}, ${i})`})},[U]),J=h.useCallback(()=>{const l=_.current;if(!l)return;const e=l.getContext("2d");if(!e)return;const o=v[c.type],t=de(c.timeOfDay,o.colors.sky),u=e.createLinearGradient(0,0,0,n);u.addColorStop(0,t[0]),u.addColorStop(1,t[1]),e.fillStyle=u,e.fillRect(0,0,r,n);const m=e.createLinearGradient(0,n*.5,0,n),[d,L,A]=o.colors.ground;m.addColorStop(0,`rgba(${d}, ${L}, ${A}, 0.12)`),m.addColorStop(1,`rgba(${d}, ${L}, ${A}, 0.72)`),e.fillStyle=m,e.fillRect(0,n*.52,r,n*.48);const S=e.createRadialGradient(r*.72,n*.18,0,r*.72,n*.18,Math.max(r,n)*.68);if(S.addColorStop(0,"rgba(255, 255, 255, 0.42)"),S.addColorStop(.48,"rgba(255, 255, 255, 0.08)"),S.addColorStop(1,"rgba(255, 255, 255, 0)"),e.fillStyle=S,e.fillRect(0,0,r,n),Z&&se.forEach(i=>{e.save(),e.globalAlpha=i.opacity;const p=Y?ie.x*i.parallaxSpeed:0;i.elements.forEach(a=>{e.save(),e.translate(a.x+p,a.y),e.globalAlpha=a.opacity;const f=`rgb(${a.color[0]}, ${a.color[1]}, ${a.color[2]})`;switch(a.type){case"tree":e.fillStyle=f,e.fillRect(-a.width*.1,0,a.width*.2,a.height*.3),e.beginPath(),e.ellipse?e.ellipse(0,-a.height*.3,a.width*.5,a.height*.7,0,0,Math.PI*2):e.arc(0,-a.height*.3,a.width*.5,0,Math.PI*2),e.fill();break;case"mountain":e.fillStyle=f,e.beginPath(),e.moveTo(-a.width*.5,a.height),e.lineTo(0,0),e.lineTo(a.width*.5,a.height),e.closePath(),e.fill();break;case"grass":e.strokeStyle=f,e.lineWidth=2,e.beginPath(),e.moveTo(0,a.height),e.quadraticCurveTo(a.width*.5,0,0,-a.height*.5),e.stroke();break;case"cloud":e.fillStyle=f,e.globalAlpha=a.opacity*.6,e.beginPath();const K=Math.max(10,Math.min(a.width,a.height)*.3);for(let g=-2;g<=2;g++)e.moveTo(g*K*.8,0),e.arc(g*K*.8,0,K*(1-Math.abs(g)*.1),0,Math.PI*2);e.fill(),e.globalAlpha=a.opacity;break;case"water":if(e.fillStyle=f,e.fillRect(-a.width*.5,0,a.width,a.height),a.animation==="wave"){e.strokeStyle="var(--glass-bg-hover)",e.lineWidth=1;const g=ne*.002;for(let M=0;M<a.width;M+=10){const ce=Math.sin((M+g*100)*.02)*5;e.beginPath(),e.moveTo(M-a.width*.5,ce),e.lineTo(M+5-a.width*.5,ce),e.stroke()}}break;case"rock":e.fillStyle=f,e.beginPath(),e.ellipse?e.ellipse(0,0,a.width*.5,a.height*.3,0,0,Math.PI*2):e.arc(0,0,a.width*.5,0,Math.PI*2),e.fill();break;case"flower":e.fillStyle=f,e.beginPath(),e.arc(0,0,a.size||5,0,Math.PI*2),e.fill(),e.fillStyle="rgba(255, 100, 150, 0.8)";for(let g=0;g<5;g++)e.save(),e.rotate(g/5*Math.PI*2),e.beginPath(),e.ellipse?e.ellipse(0,-8,3,6,0,0,Math.PI*2):e.arc(0,-8,3,0,Math.PI*2),e.fill(),e.restore();break}e.restore()}),e.restore()}),te.forEach(i=>{e.save(),e.globalAlpha=i.opacity,e.translate(i.x,i.y),e.rotate(i.rotation);const p=Array.isArray(i.color)?`rgb(${i.color[0]}, ${i.color[1]}, ${i.color[2]})`:"var(--glass-white)";switch(i.type){case"leaf":e.fillStyle=p,e.beginPath(),e.ellipse?e.ellipse(0,0,i.size,i.size*.6,0,0,Math.PI*2):e.arc(0,0,i.size,0,Math.PI*2),e.fill();break;case"pollen":case"dust":case"sand":case"spore":e.fillStyle=p,e.beginPath(),e.arc(0,0,i.size,0,Math.PI*2),e.fill();break;case"snow":case"ice":e.fillStyle=p,e.beginPath(),e.arc(0,0,i.size,0,Math.PI*2),e.fill(),e.strokeStyle=p,e.lineWidth=.5;for(let f=0;f<6;f++)e.beginPath(),e.moveTo(0,0),e.lineTo(0,-i.size),e.stroke(),e.rotate(Math.PI/3);break;case"water":case"droplet":case"bubble":e.fillStyle=p,e.beginPath(),e.arc(0,0,i.size,0,Math.PI*2),e.fill();break;case"fog":case"cloud":const a=e.createRadialGradient(0,0,0,0,0,i.size);a.addColorStop(0,`rgba(${Array.isArray(i.color)?`${i.color[0]}, ${i.color[1]}, ${i.color[2]}`:"255, 255, 255"}, ${Math.min(.5,i.opacity)})`),a.addColorStop(1,"rgba(255, 255, 255, 0)"),e.fillStyle=a,e.beginPath(),e.arc(0,0,i.size,0,Math.PI*2),e.fill();break;case"insect":e.fillStyle=p,e.fillRect(-i.size*.5,-i.size*.2,i.size,i.size*.4);break}e.restore()}),x&&(c.humidity>.8&&(e.save(),e.globalAlpha=(c.humidity-.8)*.5,e.fillStyle="rgba(200, 200, 220, 0.1)",e.fillRect(0,0,r,n),e.restore()),c.temperature<0&&(e.save(),e.globalAlpha=Math.abs(c.temperature)*.01,e.fillStyle="rgba(173, 216, 230, 0.1)",e.fillRect(0,0,r,n),e.restore())),ee){e.save();const i=Math.min(246,r-24);e.fillStyle="rgba(248, 250, 252, 0.72)",e.strokeStyle="rgba(255, 255, 255, 0.7)",e.lineWidth=1,e.beginPath();const p=e;typeof p.roundRect=="function"?(p.roundRect(12,12,i,136,18),e.fill(),e.stroke()):e.fillRect(12,12,i,136),e.fillStyle="rgba(15, 23, 42, 0.9)",e.font="600 13px -apple-system, BlinkMacSystemFont, sans-serif",e.fillText(c.type.replace(/^./,a=>a.toUpperCase()),24,35),e.font="12px -apple-system, BlinkMacSystemFont, sans-serif",e.fillStyle="rgba(30, 41, 59, 0.76)",e.fillText(`Season · ${c.season}`,24,56),e.fillText(`Temperature · ${c.temperature}°C`,24,77),e.fillText(`Humidity · ${Math.round(c.humidity*100)}%`,24,98),e.fillText(`Wind · ${Math.round(c.windSpeed)} km/h`,24,119),e.fillText(`Local time · ${Math.floor(c.timeOfDay)}:${String(Math.floor(c.timeOfDay%1*60)).padStart(2,"0")}`,24,140),e.restore()}},[r,n,v,c,de,Z,se,Y,ie,ne,te,x,ee]);h.useEffect(()=>{if(ae&&F){J();return}const l=e=>{Me(t=>t+16),le(16),J(),D.current=requestAnimationFrame(l)};return D.current=requestAnimationFrame(l),()=>{D.current&&cancelAnimationFrame(D.current)}},[ae,F,J,le]),h.useEffect(()=>{const l=_.current;l&&(l.width=r,l.height=n)},[r,n]);const Ce=()=>{if(!ye)return null;const l={minHeight:40,border:"1px solid rgba(255, 255, 255, 0.72)",background:"linear-gradient(180deg, rgba(255,255,255,.74), rgba(241,245,249,.48))",boxShadow:"inset 0 1px 0 rgba(255,255,255,.82), 0 8px 24px rgba(30,41,59,.08)",color:"var(--glass-theme-text, var(--glass-text-primary))"},e=({checked:o,onChange:t,children:u})=>s.jsxs("button",{type:"button",role:"switch","aria-checked":o,onClick:t,className:"glass-biome-toggle glass-flex glass-items-center glass-justify-between glass-gap-3 glass-radius-full glass-px-3 glass-text-sm",style:l,children:[s.jsx("span",{children:u}),s.jsx("span",{"aria-hidden":"true",className:"glass-relative glass-block glass-radius-full",style:{width:38,height:22,background:o?"rgba(73, 94, 105, 0.82)":"rgba(100, 116, 139, 0.2)",boxShadow:"inset 0 0 0 1px rgba(15,23,42,.1)"},children:s.jsx("span",{className:"glass-absolute glass-radius-full",style:{width:18,height:18,left:o?18:2,top:2,background:"rgba(255,255,255,.96)",boxShadow:"0 2px 6px rgba(15,23,42,.22)",transition:"left 160ms ease"}})})]});return s.jsxs(me,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:"glass-biome-controls glass-grid glass-gap-3 glass-p-3 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard",style:{gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 150px), 1fr))",background:"rgba(248,250,252,.52)",color:"var(--glass-theme-text, var(--glass-text-primary))"},children:[s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-1",children:[s.jsx("label",{className:"glass-text-xs glass-font-medium",htmlFor:"biome-select",children:"Biome"}),s.jsxs("select",{id:"biome-select",value:c.type,onChange:o=>{const t={...c,type:o.target.value};H(t),pe?.(t)},className:"glass-w-full glass-appearance-none glass-px-3 glass-py-2 glass-radius-lg glass-contrast-guard",style:l,"aria-label":"Select biome type",children:[s.jsx("option",{value:"forest",children:"Forest"}),s.jsx("option",{value:"ocean",children:"Ocean"}),s.jsx("option",{value:"desert",children:"Desert"}),s.jsx("option",{value:"tundra",children:"Tundra"}),s.jsx("option",{value:"grassland",children:"Grassland"}),s.jsx("option",{value:"rainforest",children:"Rainforest"}),s.jsx("option",{value:"mountain",children:"Mountain"}),s.jsx("option",{value:"swamp",children:"Swamp"})]})]}),s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-1",children:[s.jsx("label",{className:"glass-text-xs glass-font-medium",htmlFor:"biome-season-select",children:"Season"}),s.jsxs("select",{id:"biome-season-select",value:c.season,onChange:o=>{const t={...c,season:o.target.value};H(t),ge?.(o.target.value)},className:"glass-w-full glass-appearance-none glass-px-3 glass-py-2 glass-radius-lg glass-contrast-guard",style:l,"aria-label":"Select season",children:[s.jsx("option",{value:"spring",children:"Spring"}),s.jsx("option",{value:"summer",children:"Summer"}),s.jsx("option",{value:"autumn",children:"Autumn"}),s.jsx("option",{value:"winter",children:"Winter"})]})]}),s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-1",children:[s.jsxs("label",{className:"glass-flex glass-justify-between glass-text-xs glass-font-medium",htmlFor:"biome-time-range",children:[s.jsx("span",{children:"Local time"}),s.jsxs("span",{children:[String(Math.floor(c.timeOfDay)).padStart(2,"0"),":00"]})]}),s.jsx("input",{id:"biome-time-range",type:"range",min:"0",max:"24",step:"0.5",value:c.timeOfDay,onChange:o=>{const t=parseFloat(o.target.value);H(u=>({...u,timeOfDay:t})),fe?.(t)},className:"glass-biome-range glass-w-full glass-cursor-pointer","aria-label":"Adjust time of day"})]}),s.jsxs("div",{className:"glass-grid glass-gap-2",children:[s.jsx(e,{checked:U,onChange:()=>ke(o=>!o),children:"Day / Night"}),s.jsx(e,{checked:Y,onChange:()=>De(o=>!o),children:"Parallax"})]})]})};return s.jsxs(me,{ref:xe,id:w,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",className:Le("glass-biome-simulator relative glass-radius-lg glass-backdrop-blur border border-border/20",be),...we,children:[s.jsx("style",{children:`
          #${w} .glass-biome-range { appearance: none; height: 28px; background: transparent; }
          #${w} .glass-biome-range::-webkit-slider-runnable-track { height: 6px; border-radius: 999px; background: rgba(71,85,105,.18); box-shadow: inset 0 1px 2px rgba(15,23,42,.12); }
          #${w} .glass-biome-range::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; margin-top: -7px; border-radius: 50%; border: 1px solid rgba(255,255,255,.9); background: linear-gradient(145deg,#fff,#dfe6e9); box-shadow: 0 3px 10px rgba(15,23,42,.25); }
          #${w} .glass-biome-range::-moz-range-track { height: 6px; border-radius: 999px; background: rgba(71,85,105,.18); }
          #${w} .glass-biome-range::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; border: 1px solid rgba(255,255,255,.9); background: #f8fafc; box-shadow: 0 3px 10px rgba(15,23,42,.25); }
          #${w} :where(select,button,input):focus-visible { outline: 3px solid rgba(56, 116, 145, .36); outline-offset: 2px; }
        `}),s.jsxs(Be,{preset:ve&&F?"fadeIn":"none",className:"glass-flex glass-flex-col glass-gap-4 glass-p-4",children:[Ce(),s.jsx("div",{className:"glass-relative glass-overflow-hidden glass-radius-lg",style:{boxShadow:"inset 0 1px 0 rgba(255,255,255,.8), 0 18px 45px rgba(30,41,59,.14)"},children:s.jsx("canvas",{ref:_,width:r,height:n,className:"glass-block glass-border glass-border-glass-border/20 glass-radius-lg",style:{width:"100%",maxWidth:r,height:"auto",aspectRatio:`${r} / ${n}`}})})]})]})});k.displayName="GlassBiomeSimulator";try{k.displayName="GlassBiomeSimulator",k.__docgenInfo={description:"",displayName:"GlassBiomeSimulator",props:{width:{defaultValue:{value:"800"},description:"Canvas width",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"500"},description:"Canvas height",name:"height",required:!1,type:{name:"number | undefined"}},biome:{defaultValue:{value:`{
        type: "forest",
        temperature: 18,
        humidity: 0.7,
        windSpeed: 8,
        lightLevel: 0.8,
        season: "spring",
        timeOfDay: 12,
        id: "default-biome",
      }`},description:"Current biome data",name:"biome",required:!1,type:{name:"BiomeData | undefined"}},particleDensity:{defaultValue:{value:"1"},description:"Particle density multiplier",name:"particleDensity",required:!1,type:{name:"number | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"Animation speed",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},showWeatherEffects:{defaultValue:{value:"true"},description:"Whether to show weather effects",name:"showWeatherEffects",required:!1,type:{name:"boolean | undefined"}},dayNightCycle:{defaultValue:{value:"true"},description:"Whether to show day/night cycle",name:"dayNightCycle",required:!1,type:{name:"boolean | undefined"}},seasonalTransitions:{defaultValue:{value:"true"},description:"Seasonal transitions",name:"seasonalTransitions",required:!1,type:{name:"boolean | undefined"}},wildlifeActivity:{defaultValue:{value:"0.5"},description:"Wildlife activity level",name:"wildlifeActivity",required:!1,type:{name:"number | undefined"}},ambientSoundLevel:{defaultValue:{value:"0.3"},description:"Ambient sound levels",name:"ambientSoundLevel",required:!1,type:{name:"number | undefined"}},windStrength:{defaultValue:{value:"1"},description:"Wind effect strength",name:"windStrength",required:!1,type:{name:"number | undefined"}},showAtmosphericLayers:{defaultValue:{value:"true"},description:"Whether to show atmospheric layers",name:"showAtmosphericLayers",required:!1,type:{name:"boolean | undefined"}},parallaxEnabled:{defaultValue:{value:"true"},description:"Camera parallax enabled",name:"parallaxEnabled",required:!1,type:{name:"boolean | undefined"}},onBiomeChange:{defaultValue:null,description:"Biome change handler",name:"onBiomeChange",required:!1,type:{name:"((biome: BiomeData) => void) | undefined"}},onSeasonChange:{defaultValue:null,description:"Season change handler",name:"onSeasonChange",required:!1,type:{name:'((season: "spring" | "summer" | "autumn" | "winter") => void) | undefined'}},onTimeChange:{defaultValue:null,description:"Time change handler",name:"onTimeChange",required:!1,type:{name:"((timeOfDay: number) => void) | undefined"}},showControls:{defaultValue:{value:"true"},description:"Show controls",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showBiomeInfo:{defaultValue:{value:"true"},description:"Show biome info",name:"showBiomeInfo",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Respect user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const Pe=(r,n)=>{const[G,b]=Q.useState({width:r,height:n,mobile:!1});return Q.useEffect(()=>{const y=()=>{const x=window.innerWidth<520;b({width:x?Math.max(240,window.innerWidth-48):r,height:x?300:n,mobile:x})};return y(),window.addEventListener("resize",y),()=>window.removeEventListener("resize",y)},[n,r]),G},Oe=r=>{const n=Pe(r.width??800,r.height??500);return s.jsx(k,{...r,width:n.width,height:n.height,showControls:r.showControls})},_e={title:"Effects + Advanced/Glass Biome Simulator",component:k,parameters:{layout:"fullscreen",previewSurface:"app"},decorators:[r=>s.jsx("div",{style:{minHeight:"100vh",padding:"clamp(12px, 4vw, 40px)",boxSizing:"border-box",display:"grid",placeItems:"center"},children:s.jsx(r,{})})],tags:["autodocs"],argTypes:{width:{control:{type:"range",min:400,max:1200,step:50}},height:{control:{type:"range",min:300,max:800,step:50}},particleDensity:{control:{type:"range",min:.1,max:3,step:.1}},animationSpeed:{control:{type:"range",min:.1,max:3,step:.1}},wildlifeActivity:{control:{type:"range",min:0,max:1,step:.1}},windStrength:{control:{type:"range",min:.1,max:3,step:.1}}}},j={render:r=>s.jsx(Oe,{...r}),args:{width:800,height:500,showControls:!0,showBiomeInfo:!0,dayNightCycle:!0,parallaxEnabled:!0}},B={args:{width:700,height:400,biome:{type:"forest",temperature:18,humidity:.7,windSpeed:8,lightLevel:.8,season:"spring",timeOfDay:14,id:"forest-biome"},particleDensity:1.2,wildlifeActivity:.7}},P={args:{width:800,height:450,biome:{type:"ocean",temperature:22,humidity:.9,windSpeed:15,lightLevel:.9,season:"summer",timeOfDay:12,id:"ocean-biome"},showWeatherEffects:!0,parallaxEnabled:!0}},O={args:{width:600,height:350,biome:{type:"desert",temperature:35,humidity:.2,windSpeed:12,lightLevel:1,season:"summer",timeOfDay:15,id:"desert-biome"},particleDensity:.8,windStrength:1.5}},$={args:{width:700,height:400,biome:{type:"tundra",temperature:-15,humidity:.6,windSpeed:20,lightLevel:.6,season:"winter",timeOfDay:10,id:"tundra-biome"},particleDensity:1.5,showWeatherEffects:!0}},E={args:{width:800,height:400,biome:{type:"grassland",temperature:24,humidity:.5,windSpeed:10,lightLevel:.9,season:"spring",timeOfDay:16,id:"grassland-biome"},wildlifeActivity:.8,windStrength:1.2}},z={args:{width:750,height:450,biome:{type:"rainforest",temperature:26,humidity:.95,windSpeed:5,lightLevel:.6,season:"summer",timeOfDay:13,id:"rainforest-biome"},particleDensity:2,showAtmosphericLayers:!0}},I={args:{width:800,height:500,biome:{type:"mountain",temperature:5,humidity:.7,windSpeed:25,lightLevel:.8,season:"autumn",timeOfDay:11,id:"mountain-biome"},parallaxEnabled:!0,showAtmosphericLayers:!0}},N={args:{width:700,height:400,biome:{type:"swamp",temperature:20,humidity:1,windSpeed:3,lightLevel:.4,season:"autumn",timeOfDay:18,id:"swamp-biome"},particleDensity:1.8,wildlifeActivity:.9}},T={args:{width:600,height:350,biome:{type:"forest",temperature:12,humidity:.8,windSpeed:6,lightLevel:.2,season:"autumn",timeOfDay:2,id:"night-forest"},dayNightCycle:!0,wildlifeActivity:.3}},R={args:{width:800,height:400,biome:{type:"tundra",temperature:-25,humidity:.4,windSpeed:30,lightLevel:.5,season:"winter",timeOfDay:14,id:"winter-tundra"},particleDensity:2.5,windStrength:2,showWeatherEffects:!0}},W={args:{width:700,height:350,biome:{type:"desert",temperature:42,humidity:.1,windSpeed:8,lightLevel:1,season:"summer",timeOfDay:13,id:"summer-desert"},particleDensity:.5,windStrength:1.8}},q={args:{width:500,height:300,showControls:!1,showBiomeInfo:!1,biome:{type:"ocean",temperature:20,humidity:.8,windSpeed:10,lightLevel:.7,season:"spring",timeOfDay:15,id:"minimal-ocean"},particleDensity:.8}},V={args:{width:800,height:500,biome:{type:"rainforest",temperature:28,humidity:1,windSpeed:8,lightLevel:.7,season:"summer",timeOfDay:14,id:"active-rainforest"},particleDensity:3,wildlifeActivity:1,animationSpeed:1.5,showWeatherEffects:!0,showAtmosphericLayers:!0}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: args => <ResponsiveBiomeSimulator {...args} />,
  args: {
    width: 800,
    height: 500,
    showControls: true,
    showBiomeInfo: true,
    dayNightCycle: true,
    parallaxEnabled: true
  }
}`,...j.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};const He=["Default","ForestBiome","OceanBiome","DesertBiome","TundraBiome","GrasslandBiome","RainforestBiome","MountainBiome","SwampBiome","NightTimeForest","WinterTundra","SummerDesert","MinimalInterface","HighActivity"];export{j as Default,O as DesertBiome,B as ForestBiome,E as GrasslandBiome,V as HighActivity,q as MinimalInterface,I as MountainBiome,T as NightTimeForest,P as OceanBiome,z as RainforestBiome,W as SummerDesert,N as SwampBiome,$ as TundraBiome,R as WinterTundra,He as __namedExportsOrder,_e as default};
