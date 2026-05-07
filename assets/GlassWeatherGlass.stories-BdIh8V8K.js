import{r as i,j as s,c as Me,d as De}from"./iframe-C1j_9pGm.js";import{u as Ce}from"./a11y-DqIQidVG.js";import{u as ke}from"./MotionPreferenceContext-HBw8OzFx.js";import{O as oe}from"./OptimizedGlassCore-fs4nsz79.js";import{M as We}from"./MotionFramer-JM_agJcB.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-BHvtgRvM.js";import"./utilsCore-MhQK04QN.js";const R=i.forwardRef(({width:u=600,height:l=400,weather:de={type:"clear",intensity:.5,temperature:20,humidity:.6,pressure:1013,windSpeed:10,windDirection:45,visibility:10,id:"default-weather"},autoUpdate:T=!1,updateInterval:V=De.DURATION.slower*50,particleDensity:_=1,showAtmosphericEffects:U=!0,weatherResponsive:p=!0,temperatureRange:B=[-20,40],showWeatherInfo:H=!0,animationSpeed:y=1,windStrength:Y=1,dayNightCycle:L=!0,timeOfDay:ue=12,onWeatherChange:I,onAtmosphericEvent:Ee,showControls:ce=!0,respectMotionPreference:j=!0,className:he,...X},me)=>{const{prefersReducedMotion:K,isMotionSafe:pe}=ke(),$=i.useRef(null),g=i.useRef(),ye=Ce("glass-weather-glass"),[r,w]=i.useState(de),[J,ge]=i.useState([]),[Q,we]=i.useState([]),[Ae,fe]=i.useState(0),[P,Ne]=i.useState(ue),[c,Z]=i.useState([255,255,255]),[h,ee]=i.useState(["rgba(14, 165, 233, 0.78)","rgba(59, 130, 246, 0.52)"]),be={clear:{sky:["rgba(14, 165, 233, 0.78)","rgba(59, 130, 246, 0.52)"],glass:[255,255,255]},sunny:{sky:["rgba(251, 191, 36, 0.82)","rgba(249, 115, 22, 0.5)"],glass:[255,248,220]},cloudy:{sky:["rgba(107, 114, 128, 0.72)","rgba(156, 163, 175, 0.58)"],glass:[211,211,211]},rainy:{sky:["rgba(14, 165, 233, 0.66)","rgba(75, 85, 99, 0.64)"],glass:[70,130,180]},stormy:{sky:["rgba(31, 41, 55, 0.88)","rgba(168, 85, 247, 0.42)"],glass:[47,79,79]},snowy:{sky:["rgba(255, 255, 255, 0.9)","rgba(226, 232, 240, 0.72)"],glass:[240,248,255]},foggy:{sky:["rgba(156, 163, 175, 0.68)","rgba(229, 231, 235, 0.58)"],glass:[192,192,192]},windy:{sky:["rgba(14, 165, 233, 0.62)","rgba(168, 85, 247, 0.44)"],glass:[176,196,222]}},te=i.useCallback(n=>{const[e,d]=B,t=Math.max(0,Math.min(1,(n-e)/(d-e)));if(t<.5){const a=t*2;return[Math.round(135+120*a),Math.round(206+49*a),255]}else{const a=(t-.5)*2;return[255,Math.round(255-100*a),Math.round(255-255*a)]}},[B]);i.useEffect(()=>{if(!p)return;const n=be[r.type],e=n.sky;(h[0]!==e[0]||h[1]!==e[1])&&ee(e);const d=r.type==="clear"||r.type==="sunny"?te(r.temperature):n.glass;(c[0]!==d[0]||c[1]!==d[1]||c[2]!==d[2])&&Z(d)},[r,p,te,h,c]),i.useEffect(()=>{if(!L)return;P>=6&&P<=18||(ee(["#191970","#483D8B"]),Z([25,25,112]))},[P,L]);const ne=i.useCallback((n,e)=>{const d=Math.floor(e*100*_),t=[];for(let a=0;a<d;a++){let o={x:Math.random()*u,y:-10,size:Math.random()*3+1,opacity:Math.random()*.8+.2,lifetime:Math.random()*5e3+2e3,rotation:0,rotationSpeed:(Math.random()-.5)*2,id:`particle-${n}-${a}-${Date.now()}`};switch(n){case"rainy":o={...o,type:"rain",vx:(Math.random()-.5)*r.windSpeed*.1,vy:Math.random()*5+3,color:[100,149,237],size:Math.random()*2+.5};break;case"snowy":o={...o,type:"snow",vx:(Math.random()-.5)*r.windSpeed*.05,vy:Math.random()*2+.5,color:[255,255,255],size:Math.random()*4+2,rotationSpeed:(Math.random()-.5)*1};break;case"foggy":o={...o,type:"fog",x:Math.random()*u,y:Math.random()*l,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.2,color:[220,220,220],size:Math.random()*20+10,opacity:Math.random()*.3+.1};break;case"windy":o={...o,type:"leaf",vx:(Math.random()-.5)*r.windSpeed*.2,vy:Math.random()*3+1,color:[34,139,34],size:Math.random()*3+1,rotationSpeed:(Math.random()-.5)*5};break;default:r.humidity>.8&&(o={...o,type:"droplet",vx:(Math.random()-.5)*.5,vy:Math.random()*1+.2,color:[173,216,230],size:Math.random()*1.5+.5,opacity:Math.random()*.5+.1});break}o.type&&t.push(o)}return t},[u,r.windSpeed,r.humidity,_]),re=i.useCallback(()=>{if(!U)return[];const n=[];return r.type==="stormy"&&Math.random()<.02&&n.push({type:"lightning",intensity:Math.random()*.8+.2,duration:200+Math.random()*300,position:{x:Math.random()*u,y:Math.random()*l*.3},color:[255,255,255],id:`lightning-${Date.now()}`}),r.type==="rainy"&&r.intensity<.3&&Math.random()<.01&&n.push({type:"rainbow",intensity:Math.random()*.6+.4,duration:5e3+Math.random()*5e3,position:{x:u*.8,y:l*.3},color:[255,255,255],id:`rainbow-${Date.now()}`}),r.humidity>.8&&Math.random()<.1&&n.push({type:"mist",intensity:r.humidity,duration:3e3+Math.random()*2e3,position:{x:Math.random()*u,y:l*.8},color:[230,230,250],id:`mist-${Date.now()}`}),n},[U,r,u,l]),F=i.useCallback(n=>{ge(e=>{const d=e.map(a=>{const o=r.windSpeed*Y*.01,m=Math.cos(r.windDirection*Math.PI/180)*o,ie=Math.sin(r.windDirection*Math.PI/180)*o;return{...a,x:a.x+(a.vx+m)*n*y,y:a.y+(a.vy+ie)*n*y,rotation:a.rotation+a.rotationSpeed*n*y,lifetime:a.lifetime-n}}).filter(a=>a.lifetime>0&&a.x>-50&&a.x<u+50&&a.y>-50&&a.y<l+50),t=ne(r.type,r.intensity);return[...d,...t.slice(0,Math.max(0,200-d.length))]})},[r,Y,y,u,l,ne]),O=i.useCallback(n=>{we(e=>{const d=e.map(a=>({...a,duration:a.duration-n})).filter(a=>a.duration>0),t=re();return[...d,...t]})},[re]),G=i.useCallback(()=>{const n=$.current;if(!n)return;const e=n.getContext("2d");if(!e)return;const d=e.createLinearGradient(0,0,0,l);d.addColorStop(0,h[0]),d.addColorStop(1,h[1]),e.fillStyle=d,e.fillRect(0,0,u,l),Q.forEach(t=>{switch(e.save(),e.globalAlpha=t.intensity*(t.duration/5e3),t.type){case"lightning":e.strokeStyle=`rgb(${t.color[0]}, ${t.color[1]}, ${t.color[2]})`,e.lineWidth=3,e.shadowBlur=10,e.shadowColor="white",e.beginPath(),e.moveTo(t.position.x,0),e.lineTo(t.position.x+Math.random()*20-10,l*.3),e.lineTo(t.position.x+Math.random()*30-15,l*.6),e.lineTo(t.position.x+Math.random()*20-10,l),e.stroke();break;case"rainbow":const a=t.position.x,o=t.position.y,m=100;["#FF0000","#FF7F00","#FFFF00","#00FF00","#0000FF","#4B0082","#9400D3"].forEach((Se,xe)=>{e.strokeStyle=Se,e.lineWidth=8,e.beginPath(),e.arc(a,o,m+xe*12,0,Math.PI,!1),e.stroke()});break;case"mist":const z=e.createRadialGradient(t.position.x,t.position.y,0,t.position.x,t.position.y,100);z.addColorStop(0,`rgba(${t.color[0]}, ${t.color[1]}, ${t.color[2]}, ${t.intensity})`),z.addColorStop(1,"rgba(255, 255, 255, 0)"),e.fillStyle=z,e.fillRect(0,0,u,l);break}e.restore()}),J.forEach(t=>{e.save(),e.globalAlpha=t.opacity,e.translate(t.x,t.y),e.rotate(t.rotation);const a=`rgb(${t.color[0]}, ${t.color[1]}, ${t.color[2]})`;switch(t.type){case"rain":e.strokeStyle=a,e.lineWidth=t.size,e.beginPath(),e.moveTo(0,-t.size),e.lineTo(0,t.size),e.stroke();break;case"snow":e.fillStyle=a,e.beginPath(),e.arc(0,0,t.size,0,Math.PI*2),e.fill(),e.strokeStyle=a,e.lineWidth=.5;for(let m=0;m<6;m++)e.beginPath(),e.moveTo(0,0),e.lineTo(0,-t.size),e.stroke(),e.rotate(Math.PI/3);break;case"fog":const o=e.createRadialGradient(0,0,0,0,0,t.size);o.addColorStop(0,`rgba(${t.color[0]}, ${t.color[1]}, ${t.color[2]}, ${t.opacity})`),o.addColorStop(1,"rgba(255, 255, 255, 0)"),e.fillStyle=o,e.beginPath(),e.arc(0,0,t.size,0,Math.PI*2),e.fill();break;case"leaf":e.fillStyle=a,e.beginPath(),e.ellipse(0,0,t.size,t.size*.6,0,0,Math.PI*2),e.fill();break;case"droplet":e.fillStyle=a,e.beginPath(),e.arc(0,0,t.size,0,Math.PI*2),e.fill();break}e.restore()}),p&&(e.save(),e.globalAlpha=.1,e.fillStyle=`rgb(${c[0]}, ${c[1]}, ${c[2]})`,e.fillRect(0,0,u,l),e.restore()),H&&(e.save(),e.fillStyle="rgba(15, 23, 42, 0.72)",e.fillRect(10,10,200,120),e.fillStyle="white",e.font="14px sans-serif",e.fillText(`Weather: ${r.type}`,20,30),e.fillText(`Temperature: ${r.temperature}°C`,20,50),e.fillText(`Humidity: ${Math.round(r.humidity*100)}%`,20,70),e.fillText(`Wind: ${Math.round(r.windSpeed)} km/h`,20,90),e.fillText(`Pressure: ${r.pressure} hPa`,20,110),e.restore())},[u,l,h,Q,J,p,c,H,r]),q=i.useRef(G),ae=i.useRef(F),se=i.useRef(O);i.useEffect(()=>{q.current=G},[G]),i.useEffect(()=>{ae.current=F},[F]),i.useEffect(()=>{se.current=O},[O]),i.useEffect(()=>{if(K&&j){q.current();return}const n=()=>{fe(d=>d+16),ae.current(16),se.current(16),q.current(),g.current=requestAnimationFrame(n)};return g.current=requestAnimationFrame(n),()=>{g.current&&cancelAnimationFrame(g.current)}},[K,j]),i.useEffect(()=>{if(!T)return;const n=setInterval(()=>{const e={...r,type:["clear","cloudy","rainy","sunny"][Math.floor(Math.random()*4)],intensity:Math.random(),temperature:r.temperature+(Math.random()-.5)*10,humidity:Math.random(),pressure:1e3+Math.random()*50,windSpeed:Math.random()*30,windDirection:Math.random()*360,id:`weather-${Date.now()}`};w(e),I?.(e)},V);return()=>clearInterval(n)},[T,V,r,I]),i.useEffect(()=>{const n=$.current;n&&(n.width=u,n.height=l)},[u,l]);const ve=()=>ce?s.jsxs(oe,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:"glass-weather-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("label",{htmlFor:"weather-type",className:"glass-text-sm",children:"Weather:"}),s.jsxs("select",{id:"weather-type",value:r.type,onChange:n=>{const e={...r,type:n.target.value};w(e),I?.(e)},"aria-label":"Weather type selection",className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20 glass-contrast-guard glass-focus glass-touch-target",children:[s.jsx("option",{value:"clear",children:"Clear"}),s.jsx("option",{value:"sunny",children:"Sunny"}),s.jsx("option",{value:"cloudy",children:"Cloudy"}),s.jsx("option",{value:"rainy",children:"Rainy"}),s.jsx("option",{value:"stormy",children:"Stormy"}),s.jsx("option",{value:"snowy",children:"Snowy"}),s.jsx("option",{value:"foggy",children:"Foggy"}),s.jsx("option",{value:"windy",children:"Windy"})]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("label",{htmlFor:"weather-intensity",className:"glass-text-sm",children:"Intensity:"}),s.jsx("input",{id:"weather-intensity",type:"range",min:"0",max:"1",step:"0.1",value:r.intensity,onChange:n=>{const e={...r,intensity:parseFloat(n.target.value)};w(e)},"aria-label":"Weather intensity",className:"glass-w-20 glass-focus glass-touch-target glass-contrast-guard"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("label",{htmlFor:"weather-temp",className:"glass-text-sm",children:"Temp:"}),s.jsx("input",{id:"weather-temp",type:"range",min:"-20",max:"40",value:r.temperature,onChange:n=>{const e={...r,temperature:parseInt(n.target.value)};w(e)},"aria-label":"Temperature in Celsius",className:"glass-w-20 glass-focus glass-touch-target glass-contrast-guard"}),s.jsxs("span",{className:"glass-text-sm glass-min-w-3ch",children:[r.temperature,"°C"]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsxs("label",{className:"glass-text-sm",children:[s.jsx("input",{type:"checkbox",checked:T,onChange:n=>{},"aria-label":"Enable auto update",className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Auto Update"]}),s.jsxs("label",{className:"glass-text-sm",children:[s.jsx("input",{type:"checkbox",checked:p,onChange:n=>{},"aria-label":"Enable weather responsive styling",className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Responsive"]})]})]}):null;return s.jsx(oe,{ref:me,id:ye,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",className:Me("glass-weather-glass relative glass-radius-lg glass-glass-backdrop-blur-md border border-border/20",he),"data-testid":X["data-testid"],role:"region","aria-label":"Weather visualization with controls",...X,children:s.jsxs(We,{preset:pe&&j?"fadeIn":"none",className:"glass-flex glass-flex-col glass-gap-4 glass-p-4",children:[ve(),s.jsx("div",{className:"glass-relative",children:s.jsx("canvas",{ref:$,width:u,height:l,className:"glass-border glass-border-glass-border/20 glass-radius-md",style:{width:u,height:l}})})]})})});R.displayName="GlassWeatherGlass";try{R.displayName="GlassWeatherGlass",R.__docgenInfo={description:"",displayName:"GlassWeatherGlass",props:{width:{defaultValue:{value:"600"},description:"Canvas width",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"400"},description:"Canvas height",name:"height",required:!1,type:{name:"number | undefined"}},weather:{defaultValue:{value:`{
        type: "clear",
        intensity: 0.5,
        temperature: 20,
        humidity: 0.6,
        pressure: 1013,
        windSpeed: 10,
        windDirection: 45,
        visibility: 10,
        id: "default-weather",
      }`},description:"Current weather condition",name:"weather",required:!1,type:{name:"WeatherCondition | undefined"}},autoUpdate:{defaultValue:{value:"false"},description:"Whether to auto-update weather",name:"autoUpdate",required:!1,type:{name:"boolean | undefined"}},updateInterval:{defaultValue:{value:"ANIMATION.DURATION.slower * 50"},description:"Update interval in milliseconds",name:"updateInterval",required:!1,type:{name:"number | undefined"}},particleDensity:{defaultValue:{value:"1"},description:"Particle count multiplier",name:"particleDensity",required:!1,type:{name:"number | undefined"}},showAtmosphericEffects:{defaultValue:{value:"true"},description:"Whether to show atmospheric effects",name:"showAtmosphericEffects",required:!1,type:{name:"boolean | undefined"}},weatherResponsive:{defaultValue:{value:"true"},description:"Glass tint response to weather",name:"weatherResponsive",required:!1,type:{name:"boolean | undefined"}},temperatureRange:{defaultValue:{value:"[-20, 40]"},description:"Temperature range for color mapping",name:"temperatureRange",required:!1,type:{name:"[number, number] | undefined"}},showWeatherInfo:{defaultValue:{value:"true"},description:"Whether to show weather info",name:"showWeatherInfo",required:!1,type:{name:"boolean | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"Animation speed multiplier",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},windStrength:{defaultValue:{value:"1"},description:"Wind effect strength",name:"windStrength",required:!1,type:{name:"number | undefined"}},dayNightCycle:{defaultValue:{value:"true"},description:"Whether to show day/night cycle",name:"dayNightCycle",required:!1,type:{name:"boolean | undefined"}},timeOfDay:{defaultValue:{value:"12"},description:"Current time of day (0-24)",name:"timeOfDay",required:!1,type:{name:"number | undefined"}},onWeatherChange:{defaultValue:null,description:"Weather change handler",name:"onWeatherChange",required:!1,type:{name:"((weather: WeatherCondition) => void) | undefined"}},onAtmosphericEvent:{defaultValue:null,description:"Atmospheric event handler",name:"onAtmosphericEvent",required:!1,type:{name:"((effect: AtmosphericEffect) => void) | undefined"}},showControls:{defaultValue:{value:"true"},description:"Show controls",name:"showControls",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Respect user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const{fn:le}=__STORYBOOK_MODULE_TEST__,Ge={title:"Effects + Advanced/Glass Weather Glass",component:R,parameters:{layout:"centered"},tags:["autodocs"],args:{onWeatherChange:le(),onAtmosphericEvent:le()},argTypes:{width:{control:{type:"range",min:300,max:1e3,step:50}},height:{control:{type:"range",min:200,max:600,step:50}},particleDensity:{control:{type:"range",min:.1,max:2,step:.1}},animationSpeed:{control:{type:"range",min:.1,max:3,step:.1}},windStrength:{control:{type:"range",min:.1,max:3,step:.1}},timeOfDay:{control:{type:"range",min:0,max:24,step:1}}}},f={args:{width:600,height:400,showControls:!0,showWeatherInfo:!0,weatherResponsive:!0}},b={args:{width:500,height:350,weather:{type:"clear",intensity:.3,temperature:22,humidity:.5,pressure:1015,windSpeed:8,windDirection:90,visibility:15,id:"clear-weather"},dayNightCycle:!0,timeOfDay:14}},v={args:{width:600,height:400,weather:{type:"rainy",intensity:.8,temperature:16,humidity:.9,pressure:1005,windSpeed:15,windDirection:225,visibility:5,id:"rainy-weather"},particleDensity:1.5,showAtmosphericEffects:!0}},S={args:{width:600,height:400,weather:{type:"snowy",intensity:.7,temperature:-5,humidity:.8,pressure:1020,windSpeed:12,windDirection:0,visibility:3,id:"snowy-weather"},particleDensity:1.2,windStrength:.8}},x={args:{width:700,height:450,weather:{type:"stormy",intensity:.9,temperature:18,humidity:.95,pressure:995,windSpeed:35,windDirection:270,visibility:2,id:"stormy-weather"},showAtmosphericEffects:!0,animationSpeed:1.5}},M={args:{width:500,height:300,weather:{type:"foggy",intensity:.8,temperature:12,humidity:.99,pressure:1018,windSpeed:3,windDirection:180,visibility:.5,id:"foggy-weather"},particleDensity:2,showAtmosphericEffects:!0}},D={args:{width:600,height:400,weather:{type:"sunny",intensity:.9,temperature:28,humidity:.4,pressure:1022,windSpeed:5,windDirection:135,visibility:20,id:"sunny-weather"},timeOfDay:12,dayNightCycle:!0}},C={args:{width:600,height:350,weather:{type:"windy",intensity:.7,temperature:20,humidity:.6,pressure:1010,windSpeed:25,windDirection:315,visibility:12,id:"windy-weather"},windStrength:2,particleDensity:.8}},k={args:{width:600,height:400,weather:{type:"clear",intensity:.2,temperature:10,humidity:.7,pressure:1015,windSpeed:8,windDirection:90,visibility:15,id:"night-weather"},dayNightCycle:!0,timeOfDay:2,showAtmosphericEffects:!0}},W={args:{width:600,height:400,autoUpdate:!0,updateInterval:5e3,weatherResponsive:!0,showWeatherInfo:!0,showAtmosphericEffects:!0}},E={args:{width:400,height:250,showControls:!1,showWeatherInfo:!1,weatherResponsive:!0,weather:{type:"cloudy",intensity:.6,temperature:18,humidity:.7,pressure:1012,windSpeed:10,windDirection:180,visibility:8,id:"minimal-weather"}}},A={args:{width:700,height:500,weather:{type:"rainy",intensity:1,temperature:14,humidity:1,pressure:1e3,windSpeed:20,windDirection:225,visibility:3,id:"heavy-rain"},particleDensity:2.5,animationSpeed:1.8,windStrength:1.5}},N={args:{width:600,height:400,weather:{type:"sunny",intensity:.9,temperature:38,humidity:.2,pressure:1025,windSpeed:3,windDirection:90,visibility:25,id:"extreme-heat"},weatherResponsive:!0,temperatureRange:[-20,45],timeOfDay:13}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    showControls: true,
    showWeatherInfo: true,
    weatherResponsive: true
  }
}`,...f.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    width: 500,
    height: 350,
    weather: {
      type: 'clear',
      intensity: 0.3,
      temperature: 22,
      humidity: 0.5,
      pressure: 1015,
      windSpeed: 8,
      windDirection: 90,
      visibility: 15,
      id: 'clear-weather'
    },
    dayNightCycle: true,
    timeOfDay: 14
  }
}`,...b.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    weather: {
      type: 'rainy',
      intensity: 0.8,
      temperature: 16,
      humidity: 0.9,
      pressure: 1005,
      windSpeed: 15,
      windDirection: 225,
      visibility: 5,
      id: 'rainy-weather'
    },
    particleDensity: 1.5,
    showAtmosphericEffects: true
  }
}`,...v.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    weather: {
      type: 'snowy',
      intensity: 0.7,
      temperature: -5,
      humidity: 0.8,
      pressure: 1020,
      windSpeed: 12,
      windDirection: 0,
      visibility: 3,
      id: 'snowy-weather'
    },
    particleDensity: 1.2,
    windStrength: 0.8
  }
}`,...S.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 450,
    weather: {
      type: 'stormy',
      intensity: 0.9,
      temperature: 18,
      humidity: 0.95,
      pressure: 995,
      windSpeed: 35,
      windDirection: 270,
      visibility: 2,
      id: 'stormy-weather'
    },
    showAtmosphericEffects: true,
    animationSpeed: 1.5
  }
}`,...x.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    width: 500,
    height: 300,
    weather: {
      type: 'foggy',
      intensity: 0.8,
      temperature: 12,
      humidity: 0.99,
      pressure: 1018,
      windSpeed: 3,
      windDirection: 180,
      visibility: 0.5,
      id: 'foggy-weather'
    },
    particleDensity: 2,
    showAtmosphericEffects: true
  }
}`,...M.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    weather: {
      type: 'sunny',
      intensity: 0.9,
      temperature: 28,
      humidity: 0.4,
      pressure: 1022,
      windSpeed: 5,
      windDirection: 135,
      visibility: 20,
      id: 'sunny-weather'
    },
    timeOfDay: 12,
    dayNightCycle: true
  }
}`,...D.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 350,
    weather: {
      type: 'windy',
      intensity: 0.7,
      temperature: 20,
      humidity: 0.6,
      pressure: 1010,
      windSpeed: 25,
      windDirection: 315,
      visibility: 12,
      id: 'windy-weather'
    },
    windStrength: 2,
    particleDensity: 0.8
  }
}`,...C.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    weather: {
      type: 'clear',
      intensity: 0.2,
      temperature: 10,
      humidity: 0.7,
      pressure: 1015,
      windSpeed: 8,
      windDirection: 90,
      visibility: 15,
      id: 'night-weather'
    },
    dayNightCycle: true,
    timeOfDay: 2,
    showAtmosphericEffects: true
  }
}`,...k.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    autoUpdate: true,
    updateInterval: 5000,
    weatherResponsive: true,
    showWeatherInfo: true,
    showAtmosphericEffects: true
  }
}`,...W.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 250,
    showControls: false,
    showWeatherInfo: false,
    weatherResponsive: true,
    weather: {
      type: 'cloudy',
      intensity: 0.6,
      temperature: 18,
      humidity: 0.7,
      pressure: 1012,
      windSpeed: 10,
      windDirection: 180,
      visibility: 8,
      id: 'minimal-weather'
    }
  }
}`,...E.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 500,
    weather: {
      type: 'rainy',
      intensity: 1,
      temperature: 14,
      humidity: 1,
      pressure: 1000,
      windSpeed: 20,
      windDirection: 225,
      visibility: 3,
      id: 'heavy-rain'
    },
    particleDensity: 2.5,
    animationSpeed: 1.8,
    windStrength: 1.5
  }
}`,...A.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    weather: {
      type: 'sunny',
      intensity: 0.9,
      temperature: 38,
      humidity: 0.2,
      pressure: 1025,
      windSpeed: 3,
      windDirection: 90,
      visibility: 25,
      id: 'extreme-heat'
    },
    weatherResponsive: true,
    temperatureRange: [-20, 45],
    timeOfDay: 13
  }
}`,...N.parameters?.docs?.source}}};const qe=["Default","ClearSky","RainyDay","SnowyWeather","StormyWeather","FoggyConditions","SunnyWeather","WindyConditions","NightTime","AutoUpdating","MinimalInterface","HighDensityParticles","TemperatureExtreme"];export{W as AutoUpdating,b as ClearSky,f as Default,M as FoggyConditions,A as HighDensityParticles,E as MinimalInterface,k as NightTime,v as RainyDay,S as SnowyWeather,x as StormyWeather,D as SunnyWeather,N as TemperatureExtreme,C as WindyConditions,qe as __namedExportsOrder,Ge as default};
