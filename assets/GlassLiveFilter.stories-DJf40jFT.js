import{r as p,b as Ke,h as Ze,j as r,m as W,d as es}from"./iframe-rcK9Xf1b.js";import{u as ss}from"./useMotionPreference-CCRUNF2D.js";import{u as as}from"./soundDesign-BzTj-xWn.js";import{O as ts}from"./OptimizedGlassCore-BtDfN8Ts.js";import"./preload-helper-PPVm8Dsz.js";const rs=[{id:"grayscale",name:"Grayscale",description:"Convert to black and white",category:"color",intensity:1,parameters:{strength:1}},{id:"sepia",name:"Sepia",description:"Vintage sepia tone effect",category:"vintage",intensity:.8,parameters:{warmth:.8}},{id:"blur",name:"Gaussian Blur",description:"Smooth blur effect",category:"blur",intensity:1,parameters:{radius:5}},{id:"sharpen",name:"Sharpen",description:"Enhance image details",category:"artistic",intensity:.6,parameters:{amount:.6}},{id:"brightness",name:"Brightness",description:"Adjust image brightness",category:"color",intensity:1.2,parameters:{level:1.2}},{id:"contrast",name:"Contrast",description:"Adjust image contrast",category:"color",intensity:1.3,parameters:{level:1.3}},{id:"saturation",name:"Saturation",description:"Adjust color saturation",category:"color",intensity:1.5,parameters:{level:1.5}},{id:"hue-shift",name:"Hue Shift",description:"Shift color hues",category:"color",intensity:.5,parameters:{degrees:30}},{id:"edge-detect",name:"Edge Detection",description:"Detect and highlight edges",category:"artistic",intensity:1,parameters:{threshold:.5}},{id:"emboss",name:"Emboss",description:"3D embossed effect",category:"artistic",intensity:.8,parameters:{strength:.8}},{id:"vintage",name:"Vintage Film",description:"Old film camera effect",category:"vintage",intensity:.9,parameters:{grain:.3,vignette:.5}},{id:"neon",name:"Neon Glow",description:"Cyberpunk neon effect",category:"modern",intensity:1.2,parameters:{glow:1.2,color:"var(--glass-color-secondary)"}}],ns={quality:"medium",fps:30,enableGPU:!0,batchSize:4},re=p.forwardRef(({videoSource:m,imageSource:Se,availableFilters:L=rs,selectedFilters:Re=[],processingSettings:Le={},showFilterLibrary:Ne=!0,showPreview:He=!0,showControls:Te=!0,enableRealTimeProcessing:ne=!0,enableChaining:is=!0,enableCustomFilters:ls=!1,maxFilters:ie=5,canvasWidth:de=800,canvasHeight:me=600,onFilterApply:he,onProcessingComplete:We,onError:pe,className:Me="",...Ue},Ge)=>{Ke();const[be,ve]=p.useState(!1),[w,le]=p.useState(Re),[R,N]=p.useState({}),[ye,qe]=p.useState(""),[oe,Ae]=p.useState(Se||""),[os,cs]=p.useState(0),[H,ce]=p.useState({...ns,...Le}),fe=p.useRef(null),ge=p.useRef(null),ue=p.useRef(),we=p.useRef(null);Ze("glass-live-filter");const{shouldAnimate:j}=ss(),{play:S}=as(),Fe=p.useCallback(async()=>{const a=ge.current;if(a)try{m instanceof MediaStream?a.srcObject=m:typeof m=="string"&&(a.src=m),await a.play()}catch(n){pe?.(n)}},[m,pe]),ke=p.useCallback((a,n)=>{let e=new ImageData(new Uint8ClampedArray(a.data),a.width,a.height);return n.forEach(s=>{const t=R[s.id]||s.parameters||{};switch(s.id){case"grayscale":e=Ee(e,F(t,"strength",1));break;case"sepia":e=xe(e,F(t,"warmth",.8));break;case"blur":e=Ve(e,F(t,"radius",5));break;case"brightness":e=Ie(e,F(t,"level",1.2));break;case"contrast":e=ze(e,F(t,"level",1.3));break;case"saturation":e=Oe(e,F(t,"level",1.5));break;case"hue-shift":e=De(e,F(t,"degrees",30));break;case"edge-detect":e=Be(e,F(t,"threshold",.5));break;case"emboss":e=_e(e,F(t,"strength",.8));break;case"vintage":e=$e(e,t);break;case"neon":e=Qe(e,t);break}}),e},[R]),Ee=(a,n)=>{const e=a.data;for(let s=0;s<e.length;s+=4){const t=Math.round(.299*e[s]+.587*e[s+1]+.114*e[s+2]);e[s]=e[s]+(t-e[s])*n,e[s+1]=e[s+1]+(t-e[s+1])*n,e[s+2]=e[s+2]+(t-e[s+2])*n}return a},xe=(a,n)=>{const e=a.data;for(let s=0;s<e.length;s+=4){const t=e[s],i=e[s+1],l=e[s+2],g=Math.min(255,t*.393+i*.769+l*.189),h=Math.min(255,t*.349+i*.686+l*.168),v=Math.min(255,t*.272+i*.534+l*.131);e[s]=t+(g-t)*n,e[s+1]=i+(h-i)*n,e[s+2]=l+(v-l)*n}return a},Ve=(a,n)=>{const e=a.data,s=a.width,t=a.height,i=new Uint8ClampedArray(e),l=Math.floor(n);for(let g=l;g<t-l;g++)for(let h=l;h<s-l;h++){let v=0,u=0,C=0,x=0,c=0;for(let y=-l;y<=l;y++)for(let b=-l;b<=l;b++){const f=((g+y)*s+(h+b))*4;v+=e[f],u+=e[f+1],C+=e[f+2],x+=e[f+3],c++}const d=(g*s+h)*4;i[d]=v/c,i[d+1]=u/c,i[d+2]=C/c,i[d+3]=x/c}return new ImageData(i,s,t)},Ie=(a,n)=>{const e=a.data,s=n;for(let t=0;t<e.length;t+=4)e[t]=Math.min(255,e[t]*s),e[t+1]=Math.min(255,e[t+1]*s),e[t+2]=Math.min(255,e[t+2]*s);return a},ze=(a,n)=>{const e=a.data,s=n,t=128*(1-s);for(let i=0;i<e.length;i+=4)e[i]=Math.max(0,Math.min(255,e[i]*s+t)),e[i+1]=Math.max(0,Math.min(255,e[i+1]*s+t)),e[i+2]=Math.max(0,Math.min(255,e[i+2]*s+t));return a},Oe=(a,n)=>{const e=a.data;for(let s=0;s<e.length;s+=4){const t=.299*e[s]+.587*e[s+1]+.114*e[s+2];e[s]=t+(e[s]-t)*n,e[s+1]=t+(e[s+1]-t)*n,e[s+2]=t+(e[s+2]-t)*n}return a},De=(a,n)=>{const e=a.data;for(let s=0;s<e.length;s+=4){const t=e[s]/255,i=e[s+1]/255,l=e[s+2]/255,g=Math.max(t,i,l),h=Math.min(t,i,l),v=g-h;if(v===0)continue;let u=0;g===t?u=(i-l)/v%6:g===i?u=(l-t)/v+2:u=(t-i)/v+4,u=(u*60+n)%360,u<0&&(u+=360);const C=(g+h)/2,x=v/(1-Math.abs(2*C-1)),c=(1-Math.abs(2*C-1))*x,d=c*(1-Math.abs(u/60%2-1)),y=C-c/2;let b=0,f=0,P=0;u<60?(b=c,f=d,P=0):u<120?(b=d,f=c,P=0):u<180?(b=0,f=c,P=d):u<240?(b=0,f=d,P=c):u<300?(b=d,f=0,P=c):(b=c,f=0,P=d),e[s]=Math.round((b+y)*255),e[s+1]=Math.round((f+y)*255),e[s+2]=Math.round((P+y)*255)}return a},Be=(a,n)=>{const e=a.data,s=a.width,t=a.height,i=new Uint8ClampedArray(e.length);for(let l=1;l<t-1;l++)for(let g=1;g<s-1;g++){const h=(l*s+g)*4;let v=0,u=0;for(let c=-1;c<=1;c++)for(let d=-1;d<=1;d++){const y=((l+c)*s+(g+d))*4,b=.299*e[y]+.587*e[y+1]+.114*e[y+2],f=[[-1,0,1],[-2,0,2],[-1,0,1]],P=[[-1,-2,-1],[0,0,0],[1,2,1]];v+=b*f[c+1][d+1],u+=b*P[c+1][d+1]}const x=Math.sqrt(v*v+u*u)>n*255?255:0;i[h]=x,i[h+1]=x,i[h+2]=x,i[h+3]=e[h+3]}return new ImageData(i,s,t)},_e=(a,n)=>{const e=a.data,s=a.width,t=a.height,i=new Uint8ClampedArray(e),l=[[-2,-1,0],[-1,1,1],[0,1,2]];for(let g=1;g<t-1;g++)for(let h=1;h<s-1;h++){let v=0,u=0,C=0;for(let c=-1;c<=1;c++)for(let d=-1;d<=1;d++){const y=((g+c)*s+(h+d))*4,b=l[c+1][d+1];v+=e[y]*b,u+=e[y+1]*b,C+=e[y+2]*b}const x=(g*s+h)*4;i[x]=Math.max(0,Math.min(255,v*n+128)),i[x+1]=Math.max(0,Math.min(255,u*n+128)),i[x+2]=Math.max(0,Math.min(255,C*n+128))}return new ImageData(i,s,t)},F=(a,n,e)=>{const s=a[n];if(typeof s=="number")return s;if(typeof s=="string"){const t=Number(s);return Number.isFinite(t)?t:e}return e},$e=(a,n)=>{let e=a;e=xe(e,.7);const s=F(n,"grain",.3),t=e.data;for(let i=0;i<t.length;i+=4){const l=(Math.random()-.5)*s*255;t[i]=Math.max(0,Math.min(255,t[i]+l)),t[i+1]=Math.max(0,Math.min(255,t[i+1]+l)),t[i+2]=Math.max(0,Math.min(255,t[i+2]+l))}return e},Qe=(a,n)=>{const e=a.data,s=F(n,"glow",1.2);for(let t=0;t<e.length;t+=4)(e[t]+e[t+1]+e[t+2])/3>128&&(e[t]=Math.min(255,e[t]*s),e[t+1]=Math.min(255,e[t+1]*s),e[t+2]=Math.min(255,e[t+2]*s));return a},T=p.useCallback(()=>{const a=fe.current,n=we.current,e=ge.current;if(!a||!n)return;const s=a.getContext("2d"),t=n.getContext("2d");if(!s||!t)return;let i=null;if(e&&!e.paused)s.drawImage(e,0,0,a.width,a.height),i=s.getImageData(0,0,a.width,a.height);else if(oe){const l=new Image;l.onload=()=>{s.drawImage(l,0,0,a.width,a.height);const g=s.getImageData(0,0,a.width,a.height);Ce(g,t)},l.src=oe;return}i&&Ce(i,t),ne&&e&&!e.paused&&(ue.current=requestAnimationFrame(T))},[w,ne,oe]),Ce=(a,n)=>{const e=L.filter(i=>w.includes(i.id));if(e.length===0){n.putImageData(a,0,0);return}ve(!0);const s=ke(a,e);n.putImageData(s,0,0);const t=n.canvas.toDataURL();qe(t),We?.(t),ve(!1)},Xe=p.useCallback(a=>{if(w.length>=ie){S("error");return}le(e=>[...e,a]);const n=L.find(e=>e.id===a);n&&(N(e=>({...e,[a]:{...n.parameters}})),he?.(a,n.parameters??{}),S("select"))},[w,ie,L,he,S]),Pe=p.useCallback(a=>{le(n=>n.filter(e=>e!==a)),N(n=>{const{[a]:e,...s}=n;return s}),S("remove")},[S]),je=p.useCallback((a,n,e)=>{N(s=>({...s,[a]:{...s[a],[n]:e}}))},[]);p.useEffect(()=>(m&&Fe(),()=>{ue.current&&cancelAnimationFrame(ue.current)}),[m,Fe]),p.useEffect(()=>{T()},[w,R,T]);const Ye=()=>r.jsxs("div",{className:"glass-space-y-4",children:[r.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Filter Library"}),r.jsx("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-3 lg:glass-grid-cols-4 glass-gap-3",children:L.map(a=>r.jsxs(W.div,{className:`
                p-3 rounded-lg border cursor-pointer transition-all duration-[${es.DURATION.fast}ms]
                ${w.includes(a.id)?"border-blue-400 bg-blue-400/20":"border-white/20 hover:border-white/40 bg-white/5"}
              `,whileHover:j?{scale:1.02}:{},whileTap:j?{scale:.98}:{},onClick:()=>{w.includes(a.id)?Pe(a.id):Xe(a.id)},children:[r.jsx("div",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90 glass-mb-1",children:a.name}),r.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-60 glass-mb-2",children:a.description}),r.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[r.jsx("span",{className:`
                  px-2 py-0.5 rounded text-xs font-medium
                  ${a.category==="artistic"?"bg-purple-500/20 text-purple-300":a.category==="color"?"bg-blue-500/20 text-blue-300":a.category==="blur"?"bg-gray-500/20 text-gray-300":a.category==="distortion"?"bg-red-500/20 text-red-300":a.category==="vintage"?"bg-orange-500/20 text-orange-300":"bg-green-500/20 text-green-300"}
                `,children:a.category}),w.includes(a.id)&&r.jsx("div",{className:"glass-text-primary",children:"✓"})]})]},a.id))})]}),Je=()=>r.jsxs("div",{className:"glass-space-y-4",children:[r.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[r.jsxs("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:["Active Filters (",w.length,"/",ie,")"]}),w.length>0&&r.jsx("button",{onClick:()=>{le([]),N({}),S("clear")},className:"glass-text-xs glass-text-primary hover:glass-text-secondary glass-transition-colors",children:"Clear All"})]}),w.length===0?r.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-50 glass-italic",children:"No filters applied"}):r.jsx("div",{className:"glass-space-y-3",children:w.map((a,n)=>{const e=L.find(s=>s.id===a);return e?r.jsxs("div",{className:"glass-p-3 glass-radius-lg glass-border glass-border-white/10 glass-surface-subtle/5",children:[r.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-2",children:[r.jsx("span",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90",children:e.name}),r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[r.jsxs("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:["#",n+1]}),r.jsx("button",{onClick:()=>Pe(a),className:"glass-text-primary hover:glass-text-secondary glass-transition-colors",children:"×"})]})]}),e.parameters&&Object.entries(e.parameters).map(([s,t])=>r.jsxs("div",{className:"glass-mt-2",children:[r.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:[s.charAt(0).toUpperCase()+s.slice(1),":",typeof t=="number"?` ${F(R[a]??{},s,t).toFixed(2)}`:""]}),typeof t=="number"?r.jsx("input",{type:"range",min:s==="degrees"?-180:0,max:s==="degrees"?180:s==="radius"?20:3,step:s==="degrees"?1:.1,value:R[a]?.[s]??t,onChange:i=>je(a,s,parseFloat(i.target.value)),className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":`${s.charAt(0).toUpperCase()+s.slice(1)} filter parameter`}):r.jsx("input",{type:"color",value:R[a]?.[s]??t,onChange:i=>je(a,s,i.target.value),className:"glass-w-8 glass-h-6 glass-radius glass-border glass-border-white/20","aria-label":`${s.charAt(0).toUpperCase()+s.slice(1)} color picker`})]},s))]},a):null})})]});return r.jsxs(ts,{ref:Ge,variant:"frosted",className:`p-6 space-y-6 ${Me}`,...Ue,children:[r.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[r.jsxs("div",{children:[r.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90",children:"Live Image Filter"}),r.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Real-time image and video processing with custom filters"})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[ne&&r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[r.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),r.jsx("span",{className:"glass-text-xs",children:"Real-time"})]}),be&&r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[r.jsx("div",{className:"glass-w-4 glass-h-4 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin"}),r.jsx("span",{className:"glass-text-xs",children:"Processing"})]})]})]}),He&&r.jsxs("div",{className:"glass-grid glass-grid-cols-1 lg:glass-grid-cols-2 glass-gap-4",children:[r.jsxs("div",{className:"glass-space-y-2",children:[r.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Original"}),r.jsxs("div",{className:"glass-relative glass-aspect-video glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden",children:[r.jsx("canvas",{ref:fe,width:de,height:me,className:"glass-w-full glass-h-full glass-object-cover"}),m&&r.jsx("video",{ref:ge,className:"glass-hidden",autoPlay:!0,muted:!0,loop:!0})]})]}),r.jsxs("div",{className:"glass-space-y-2",children:[r.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Filtered"}),r.jsxs("div",{className:"glass-relative glass-aspect-video glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden",children:[r.jsx("canvas",{ref:we,width:de,height:me,className:"glass-w-full glass-h-full glass-object-cover"}),be&&r.jsx("div",{className:"glass-absolute glass-inset-0 glass-surface-dark/50 glass-flex glass-items-center glass-justify-center",children:r.jsx("div",{className:"glass-w-8 glass-h-8 glass-border-2 glass-border-white glass-border-t-transparent glass-radius-full glass-animate-spin"})})]})]})]}),Te&&r.jsxs("div",{className:"glass-grid glass-grid-cols-1 lg:glass-grid-cols-2 glass-gap-6",children:[r.jsx(Je,{}),r.jsxs("div",{className:"glass-space-y-4",children:[r.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Processing Settings"}),r.jsxs("div",{className:"glass-grid glass-grid-cols-2 glass-gap-4",children:[r.jsxs("div",{children:[r.jsx("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"Quality"}),r.jsxs("select",{value:H.quality,onChange:a=>ce(n=>({...n,quality:a.target.value})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"Processing quality",children:[r.jsx("option",{value:"low",children:"Low"}),r.jsx("option",{value:"medium",children:"Medium"}),r.jsx("option",{value:"high",children:"High"}),r.jsx("option",{value:"ultra",children:"Ultra"})]})]}),r.jsxs("div",{children:[r.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["FPS: ",H.fps]}),r.jsx("input",{type:"range",min:"1",max:"60",value:H.fps,onChange:a=>ce(n=>({...n,fps:parseInt(a.target.value)})),className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":"Frames per second"})]})]}),r.jsx("div",{className:"glass-flex glass-items-center glass-space-x-4",children:r.jsxs("label",{className:"glass-flex glass-items-center glass-space-x-2 glass-cursor-pointer",children:[r.jsx("input",{type:"checkbox",checked:H.enableGPU,onChange:a=>ce(n=>({...n,enableGPU:a.target.checked})),className:"glass-w-4 glass-h-4 glass-radius glass-border-white/30"}),r.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"GPU Acceleration"})]})})]})]}),Ne&&r.jsx(Ye,{}),r.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-pt-4 glass-border-t glass-border-white/10",children:[r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[r.jsx("input",{type:"file",accept:"image/*",onChange:a=>{const n=a.target.files?.[0];if(n){const e=URL.createObjectURL(n);Ae(e),S("upload")}},className:"glass-hidden",id:"image-upload"}),r.jsx(W.label,{htmlFor:"image-upload",className:"glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-cursor-pointer glass-transition-colors",whileHover:j?{scale:1.02}:{},whileTap:j?{scale:.98}:{},children:"Upload Image"}),r.jsx(W.button,{className:"glass-px-4 glass-py-2 glass-border glass-border-white/30 hover:glass-border-white/50 glass-text-primary-glass-opacity-80 glass-radius-lg glass-text-sm glass-transition-colors",whileHover:j?{scale:1.02}:{},whileTap:j?{scale:.98}:{},onClick:()=>T(),children:"Apply Filters"})]}),ye&&r.jsx(W.a,{href:ye,download:"filtered-image.png",className:"glass-px-4 glass-py-2 glass-surface-green hover:glass-surface-green glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors",whileHover:j?{scale:1.02}:{},whileTap:j?{scale:.98}:{},children:"Download Result"})]})]})});re.displayName="GlassLiveFilter";try{re.displayName="GlassLiveFilter",re.__docgenInfo={description:"",displayName:"GlassLiveFilter",props:{videoSource:{defaultValue:null,description:"",name:"videoSource",required:!1,type:{name:"string | MediaStream | undefined"}},imageSource:{defaultValue:null,description:"",name:"imageSource",required:!1,type:{name:"string | undefined"}},availableFilters:{defaultValue:{value:`[
  {
    id: "grayscale",
    name: "Grayscale",
    description: "Convert to black and white",
    category: "color",
    intensity: 1.0,
    parameters: { strength: 1.0 },
  },
  {
    id: "sepia",
    name: "Sepia",
    description: "Vintage sepia tone effect",
    category: "vintage",
    intensity: 0.8,
    parameters: { warmth: 0.8 },
  },
  {
    id: "blur",
    name: "Gaussian Blur",
    description: "Smooth blur effect",
    category: "blur",
    intensity: 1.0,
    parameters: { radius: 5 },
  },
  {
    id: "sharpen",
    name: "Sharpen",
    description: "Enhance image details",
    category: "artistic",
    intensity: 0.6,
    parameters: { amount: 0.6 },
  },
  {
    id: "brightness",
    name: "Brightness",
    description: "Adjust image brightness",
    category: "color",
    intensity: 1.2,
    parameters: { level: 1.2 },
  },
  {
    id: "contrast",
    name: "Contrast",
    description: "Adjust image contrast",
    category: "color",
    intensity: 1.3,
    parameters: { level: 1.3 },
  },
  {
    id: "saturation",
    name: "Saturation",
    description: "Adjust color saturation",
    category: "color",
    intensity: 1.5,
    parameters: { level: 1.5 },
  },
  {
    id: "hue-shift",
    name: "Hue Shift",
    description: "Shift color hues",
    category: "color",
    intensity: 0.5,
    parameters: { degrees: 30 },
  },
  {
    id: "edge-detect",
    name: "Edge Detection",
    description: "Detect and highlight edges",
    category: "artistic",
    intensity: 1.0,
    parameters: { threshold: 0.5 },
  },
  {
    id: "emboss",
    name: "Emboss",
    description: "3D embossed effect",
    category: "artistic",
    intensity: 0.8,
    parameters: { strength: 0.8 },
  },
  {
    id: "vintage",
    name: "Vintage Film",
    description: "Old film camera effect",
    category: "vintage",
    intensity: 0.9,
    parameters: { grain: 0.3, vignette: 0.5 },
  },
  {
    id: "neon",
    name: "Neon Glow",
    description: "Cyberpunk neon effect",
    category: "modern",
    intensity: 1.2,
    parameters: { glow: 1.2, color: "var(--glass-color-secondary)" },
  },
]`},description:"",name:"availableFilters",required:!1,type:{name:"FilterEffect[] | undefined"}},selectedFilters:{defaultValue:{value:"[]"},description:"",name:"selectedFilters",required:!1,type:{name:"string[] | undefined"}},processingSettings:{defaultValue:{value:"{}"},description:"",name:"processingSettings",required:!1,type:{name:"Partial<ProcessingSettings> | undefined"}},showFilterLibrary:{defaultValue:{value:"true"},description:"",name:"showFilterLibrary",required:!1,type:{name:"boolean | undefined"}},showPreview:{defaultValue:{value:"true"},description:"",name:"showPreview",required:!1,type:{name:"boolean | undefined"}},showControls:{defaultValue:{value:"true"},description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},enableRealTimeProcessing:{defaultValue:{value:"true"},description:"",name:"enableRealTimeProcessing",required:!1,type:{name:"boolean | undefined"}},enableChaining:{defaultValue:{value:"true"},description:"",name:"enableChaining",required:!1,type:{name:"boolean | undefined"}},enableCustomFilters:{defaultValue:{value:"false"},description:"",name:"enableCustomFilters",required:!1,type:{name:"boolean | undefined"}},maxFilters:{defaultValue:{value:"5"},description:"",name:"maxFilters",required:!1,type:{name:"number | undefined"}},canvasWidth:{defaultValue:{value:"800"},description:"",name:"canvasWidth",required:!1,type:{name:"number | undefined"}},canvasHeight:{defaultValue:{value:"600"},description:"",name:"canvasHeight",required:!1,type:{name:"number | undefined"}},onFilterApply:{defaultValue:null,description:"",name:"onFilterApply",required:!1,type:{name:"((filterId: string, params: FilterParameters) => void) | undefined"}},onProcessingComplete:{defaultValue:null,description:"",name:"onProcessingComplete",required:!1,type:{name:"((processedData: string) => void) | undefined"}},onError:{defaultValue:null,description:"",name:"onError",required:!1,type:{name:"((error: Error) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const o=[{id:"grayscale",name:"Grayscale",description:"Convert to black and white",category:"color",intensity:1,parameters:{strength:1}},{id:"sepia",name:"Sepia",description:"Vintage sepia tone effect",category:"vintage",intensity:.8,parameters:{warmth:.8}},{id:"blur",name:"Gaussian Blur",description:"Smooth blur effect",category:"blur",intensity:1,parameters:{radius:5}},{id:"brightness",name:"Brightness",description:"Adjust image brightness",category:"color",intensity:1.2,parameters:{level:1.2}},{id:"contrast",name:"Contrast",description:"Adjust image contrast",category:"color",intensity:1.3,parameters:{level:1.3}},{id:"edge-detect",name:"Edge Detection",description:"Detect and highlight edges",category:"artistic",intensity:1,parameters:{threshold:.5}},{id:"vintage",name:"Vintage Film",description:"Old film camera effect",category:"vintage",intensity:.9,parameters:{grain:.3,vignette:.5}},{id:"neon",name:"Neon Glow",description:"Cyberpunk neon effect",category:"modern",intensity:1.2,parameters:{glow:1.2,color:"#ff00ff"}}],ps={title:"Glass UI/AI/GlassLiveFilter",component:re,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{canvasWidth:{control:{type:"range",min:400,max:1200,step:50}},canvasHeight:{control:{type:"range",min:300,max:800,step:50}},maxFilters:{control:{type:"range",min:1,max:10,step:1}},showFilterLibrary:{control:"boolean"},showPreview:{control:"boolean"},showControls:{control:"boolean"},enableRealTimeProcessing:{control:"boolean"},enableChaining:{control:"boolean"},enableCustomFilters:{control:"boolean"}}},M={args:{availableFilters:o,selectedFilters:["brightness"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,enableCustomFilters:!1,maxFilters:5,processingSettings:{quality:"medium",fps:30,enableGPU:!0,batchSize:4}}},U={args:{availableFilters:o.filter(m=>m.category==="color"),selectedFilters:["brightness","contrast"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:3}},G={args:{availableFilters:o.filter(m=>m.category==="artistic"),selectedFilters:["edge-detect"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:3}},q={args:{availableFilters:o.filter(m=>m.category==="vintage"),selectedFilters:["sepia","vintage"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!1,enableChaining:!0,maxFilters:3}},A={args:{availableFilters:o.filter(m=>m.category==="blur"),selectedFilters:["blur"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!1,maxFilters:2}},k={args:{availableFilters:o.filter(m=>m.category==="modern"),selectedFilters:["neon"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:3}},E={args:{availableFilters:o,selectedFilters:["contrast","edge-detect"],canvasWidth:1e3,canvasHeight:800,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!1,enableChaining:!0,maxFilters:8,processingSettings:{quality:"ultra",fps:60,enableGPU:!0,batchSize:8}}},V={args:{availableFilters:o,selectedFilters:["grayscale"],canvasWidth:600,canvasHeight:400,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:3,processingSettings:{quality:"low",fps:15,enableGPU:!1,batchSize:2}}},I={args:{availableFilters:o.slice(0,4),selectedFilters:["sepia"],canvasWidth:600,canvasHeight:400,showFilterLibrary:!1,showPreview:!0,showControls:!1,enableRealTimeProcessing:!0,enableChaining:!1,maxFilters:2}},z={args:{availableFilters:o,selectedFilters:["vintage","blur"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!1,showPreview:!0,showControls:!1,enableRealTimeProcessing:!1,enableChaining:!0,maxFilters:3}},O={args:{availableFilters:o,selectedFilters:[],canvasWidth:400,canvasHeight:300,showFilterLibrary:!0,showPreview:!1,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:5}},D={args:{availableFilters:o,selectedFilters:["brightness","neon"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,enableCustomFilters:!0,maxFilters:7}},B={args:{availableFilters:o,selectedFilters:["grayscale","sepia","blur","brightness","contrast"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:5}},_={args:{availableFilters:o,selectedFilters:["edge-detect"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!1,maxFilters:1}},$={args:{availableFilters:o,selectedFilters:["brightness","contrast","sepia","vintage"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!1,enableChaining:!0,maxFilters:6}},Q={args:{availableFilters:o,selectedFilters:["blur","edge-detect","neon"],canvasWidth:1e3,canvasHeight:800,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:5,processingSettings:{quality:"high",fps:60,enableGPU:!0,batchSize:8}}},X={args:{availableFilters:o,selectedFilters:["grayscale","brightness"],canvasWidth:600,canvasHeight:400,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:3,processingSettings:{quality:"medium",fps:30,enableGPU:!1,batchSize:2}}},Y={args:{availableFilters:o,selectedFilters:["brightness","contrast"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:4,processingSettings:{quality:"medium",fps:60,enableGPU:!0,batchSize:6}}},J={args:{availableFilters:o,selectedFilters:["vintage","blur","edge-detect"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:5,processingSettings:{quality:"high",fps:10,enableGPU:!0,batchSize:2}}},K={args:{availableFilters:o,selectedFilters:["sepia","contrast"],canvasWidth:1200,canvasHeight:400,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:5}},Z={args:{availableFilters:o,selectedFilters:["brightness","edge-detect"],canvasWidth:400,canvasHeight:800,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:5}},ee={args:{availableFilters:o.slice(0,6),selectedFilters:["grayscale"],canvasWidth:400,canvasHeight:300,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:3}},se={args:{availableFilters:o,selectedFilters:["vintage","neon"],canvasWidth:1200,canvasHeight:900,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!1,enableChaining:!0,maxFilters:8,processingSettings:{quality:"ultra",fps:30,enableGPU:!0,batchSize:8}}},ae={args:{availableFilters:o,selectedFilters:[],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:5}},te={args:{availableFilters:o,selectedFilters:o.map(m=>m.id),canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!1,enableChaining:!0,maxFilters:10}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: ['brightness'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    enableCustomFilters: false,
    maxFilters: 5,
    processingSettings: {
      quality: 'medium',
      fps: 30,
      enableGPU: true,
      batchSize: 4
    }
  }
}`,...M.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters.filter(f => f.category === 'color'),
    selectedFilters: ['brightness', 'contrast'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 3
  }
}`,...U.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters.filter(f => f.category === 'artistic'),
    selectedFilters: ['edge-detect'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 3
  }
}`,...G.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters.filter(f => f.category === 'vintage'),
    selectedFilters: ['sepia', 'vintage'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: false,
    enableChaining: true,
    maxFilters: 3
  }
}`,...q.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters.filter(f => f.category === 'blur'),
    selectedFilters: ['blur'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: false,
    maxFilters: 2
  }
}`,...A.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters.filter(f => f.category === 'modern'),
    selectedFilters: ['neon'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 3
  }
}`,...k.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: ['contrast', 'edge-detect'],
    canvasWidth: 1000,
    canvasHeight: 800,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: false,
    enableChaining: true,
    maxFilters: 8,
    processingSettings: {
      quality: 'ultra',
      fps: 60,
      enableGPU: true,
      batchSize: 8
    }
  }
}`,...E.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: ['grayscale'],
    canvasWidth: 600,
    canvasHeight: 400,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 3,
    processingSettings: {
      quality: 'low',
      fps: 15,
      enableGPU: false,
      batchSize: 2
    }
  }
}`,...V.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters.slice(0, 4),
    selectedFilters: ['sepia'],
    canvasWidth: 600,
    canvasHeight: 400,
    showFilterLibrary: false,
    showPreview: true,
    showControls: false,
    enableRealTimeProcessing: true,
    enableChaining: false,
    maxFilters: 2
  }
}`,...I.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: ['vintage', 'blur'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: false,
    showPreview: true,
    showControls: false,
    enableRealTimeProcessing: false,
    enableChaining: true,
    maxFilters: 3
  }
}`,...z.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: [],
    canvasWidth: 400,
    canvasHeight: 300,
    showFilterLibrary: true,
    showPreview: false,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 5
  }
}`,...O.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: ['brightness', 'neon'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    enableCustomFilters: true,
    maxFilters: 7
  }
}`,...D.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: ['grayscale', 'sepia', 'blur', 'brightness', 'contrast'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 5
  }
}`,...B.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: ['edge-detect'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: false,
    maxFilters: 1
  }
}`,..._.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: ['brightness', 'contrast', 'sepia', 'vintage'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: false,
    enableChaining: true,
    maxFilters: 6
  }
}`,...$.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: ['blur', 'edge-detect', 'neon'],
    canvasWidth: 1000,
    canvasHeight: 800,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 5,
    processingSettings: {
      quality: 'high',
      fps: 60,
      enableGPU: true,
      batchSize: 8
    }
  }
}`,...Q.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: ['grayscale', 'brightness'],
    canvasWidth: 600,
    canvasHeight: 400,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 3,
    processingSettings: {
      quality: 'medium',
      fps: 30,
      enableGPU: false,
      batchSize: 2
    }
  }
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: ['brightness', 'contrast'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 4,
    processingSettings: {
      quality: 'medium',
      fps: 60,
      enableGPU: true,
      batchSize: 6
    }
  }
}`,...Y.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: ['vintage', 'blur', 'edge-detect'],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 5,
    processingSettings: {
      quality: 'high',
      fps: 10,
      enableGPU: true,
      batchSize: 2
    }
  }
}`,...J.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: ['sepia', 'contrast'],
    canvasWidth: 1200,
    canvasHeight: 400,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 5
  }
}`,...K.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: ['brightness', 'edge-detect'],
    canvasWidth: 400,
    canvasHeight: 800,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 5
  }
}`,...Z.parameters?.docs?.source}}};ee.parameters={...ee.parameters,docs:{...ee.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters.slice(0, 6),
    selectedFilters: ['grayscale'],
    canvasWidth: 400,
    canvasHeight: 300,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 3
  }
}`,...ee.parameters?.docs?.source}}};se.parameters={...se.parameters,docs:{...se.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: ['vintage', 'neon'],
    canvasWidth: 1200,
    canvasHeight: 900,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: false,
    enableChaining: true,
    maxFilters: 8,
    processingSettings: {
      quality: 'ultra',
      fps: 30,
      enableGPU: true,
      batchSize: 8
    }
  }
}`,...se.parameters?.docs?.source}}};ae.parameters={...ae.parameters,docs:{...ae.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: [],
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: true,
    enableChaining: true,
    maxFilters: 5
  }
}`,...ae.parameters?.docs?.source}}};te.parameters={...te.parameters,docs:{...te.parameters?.docs,source:{originalSource:`{
  args: {
    availableFilters: customFilters,
    selectedFilters: customFilters.map(f => f.id),
    canvasWidth: 800,
    canvasHeight: 600,
    showFilterLibrary: true,
    showPreview: true,
    showControls: true,
    enableRealTimeProcessing: false,
    enableChaining: true,
    maxFilters: 10
  }
}`,...te.parameters?.docs?.source}}};const bs=["Default","ColorFilters","ArtisticFilters","VintageFilters","BlurEffects","ModernEffects","HighQualityProcessing","LowQualityFast","MinimalInterface","PreviewOnly","FilterLibraryFocus","CustomFiltersEnabled","MaxFiltersReached","SingleFilterMode","ChainedFilters","GPUAccelerated","CPUProcessing","HighFrameRate","LowFrameRate","WideCanvas","TallCanvas","SmallCanvas","LargeCanvas","NoFiltersSelected","AllFiltersSelected"];export{te as AllFiltersSelected,G as ArtisticFilters,A as BlurEffects,X as CPUProcessing,$ as ChainedFilters,U as ColorFilters,D as CustomFiltersEnabled,M as Default,O as FilterLibraryFocus,Q as GPUAccelerated,Y as HighFrameRate,E as HighQualityProcessing,se as LargeCanvas,J as LowFrameRate,V as LowQualityFast,B as MaxFiltersReached,I as MinimalInterface,k as ModernEffects,ae as NoFiltersSelected,z as PreviewOnly,_ as SingleFilterMode,ee as SmallCanvas,Z as TallCanvas,q as VintageFilters,K as WideCanvas,bs as __namedExportsOrder,ps as default};
