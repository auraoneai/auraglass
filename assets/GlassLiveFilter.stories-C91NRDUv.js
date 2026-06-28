import{r as p,b as ss,j as r,m as q,d as as}from"./iframe-CCaBsF9w.js";import{u as ts}from"./a11y-BxiHjbz4.js";import{u as rs}from"./useMotionPreference-B6u71JCm.js";import{u as ns}from"./soundDesign-C-LGviiG.js";import{n as is}from"./colorInput-DwY-dk75.js";import{O as ls}from"./OptimizedGlassCore-itRtGneW.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-CCAksaEw.js";const os=[{id:"grayscale",name:"Grayscale",description:"Convert to black and white",category:"color",intensity:1,parameters:{strength:1}},{id:"sepia",name:"Sepia",description:"Vintage sepia tone effect",category:"vintage",intensity:.8,parameters:{warmth:.8}},{id:"blur",name:"Gaussian Blur",description:"Smooth blur effect",category:"blur",intensity:1,parameters:{radius:5}},{id:"sharpen",name:"Sharpen",description:"Enhance image details",category:"artistic",intensity:.6,parameters:{amount:.6}},{id:"brightness",name:"Brightness",description:"Adjust image brightness",category:"color",intensity:1.2,parameters:{level:1.2}},{id:"contrast",name:"Contrast",description:"Adjust image contrast",category:"color",intensity:1.3,parameters:{level:1.3}},{id:"saturation",name:"Saturation",description:"Adjust color saturation",category:"color",intensity:1.5,parameters:{level:1.5}},{id:"hue-shift",name:"Hue Shift",description:"Shift color hues",category:"color",intensity:.5,parameters:{degrees:30}},{id:"edge-detect",name:"Edge Detection",description:"Detect and highlight edges",category:"artistic",intensity:1,parameters:{threshold:.5}},{id:"emboss",name:"Emboss",description:"3D embossed effect",category:"artistic",intensity:.8,parameters:{strength:.8}},{id:"vintage",name:"Vintage Film",description:"Old film camera effect",category:"vintage",intensity:.9,parameters:{grain:.3,vignette:.5}},{id:"neon",name:"Neon Glow",description:"Cyberpunk neon effect",category:"modern",intensity:1.2,parameters:{glow:1.2,color:"var(--glass-color-secondary)"}}],cs={quality:"medium",fps:30,enableGPU:!0,batchSize:4},gs={"--glass-text-primary":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))","--typography-text-primary":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))","--glass-theme-text":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))",color:"var(--glass-theme-text, rgba(255, 255, 255, 0.95))"},ie=p.forwardRef(({videoSource:g,imageSource:Re,availableFilters:N=os,selectedFilters:Le=[],processingSettings:Ne={},compact:S=!1,showHeader:He=!S,showActions:Te=!S,showFilterLibrary:We=!0,showPreview:Me=!0,showControls:qe=!1,enableRealTimeProcessing:H=!1,enableChaining:ds=!0,enableCustomFilters:us=!1,maxFilters:le=5,canvasWidth:me=640,canvasHeight:he=360,onFilterApply:pe,onProcessingComplete:Ue,onError:be,className:Ge="",...Ae},ke)=>{ss();const[ve,fe]=p.useState(!1),[w,oe]=p.useState(Le),[L,T]=p.useState({}),[ye,Ve]=p.useState(""),[ce,Ee]=p.useState(Re||""),[ms,hs]=p.useState(0),[W,ge]=p.useState({...cs,...Ne}),we=p.useRef(null),de=p.useRef(null),ue=p.useRef(),Fe=p.useRef(null);ts("glass-live-filter");const{shouldAnimate:j}=rs(),{play:R}=ns(),xe=p.useCallback(async()=>{const a=de.current;if(a)try{g instanceof MediaStream?a.srcObject=g:typeof g=="string"&&(a.src=g),await a.play()}catch(n){be?.(n)}},[g,be]),ze=p.useCallback((a,n)=>{let e=new ImageData(new Uint8ClampedArray(a.data),a.width,a.height);return n.forEach(s=>{const t=L[s.id]||s.parameters||{};switch(s.id){case"grayscale":e=Ie(e,F(t,"strength",1));break;case"sepia":e=Ce(e,F(t,"warmth",.8));break;case"blur":e=Oe(e,F(t,"radius",5));break;case"brightness":e=De(e,F(t,"level",1.2));break;case"contrast":e=Be(e,F(t,"level",1.3));break;case"saturation":e=_e(e,F(t,"level",1.5));break;case"hue-shift":e=$e(e,F(t,"degrees",30));break;case"edge-detect":e=Qe(e,F(t,"threshold",.5));break;case"emboss":e=Xe(e,F(t,"strength",.8));break;case"vintage":e=Ye(e,t);break;case"neon":e=Je(e,t);break}}),e},[L]),Ie=(a,n)=>{const e=a.data;for(let s=0;s<e.length;s+=4){const t=Math.round(.299*e[s]+.587*e[s+1]+.114*e[s+2]);e[s]=e[s]+(t-e[s])*n,e[s+1]=e[s+1]+(t-e[s+1])*n,e[s+2]=e[s+2]+(t-e[s+2])*n}return a},Ce=(a,n)=>{const e=a.data;for(let s=0;s<e.length;s+=4){const t=e[s],i=e[s+1],l=e[s+2],d=Math.min(255,t*.393+i*.769+l*.189),h=Math.min(255,t*.349+i*.686+l*.168),v=Math.min(255,t*.272+i*.534+l*.131);e[s]=t+(d-t)*n,e[s+1]=i+(h-i)*n,e[s+2]=l+(v-l)*n}return a},Oe=(a,n)=>{const e=a.data,s=a.width,t=a.height,i=new Uint8ClampedArray(e),l=Math.floor(n);for(let d=l;d<t-l;d++)for(let h=l;h<s-l;h++){let v=0,u=0,C=0,x=0,c=0;for(let f=-l;f<=l;f++)for(let b=-l;b<=l;b++){const y=((d+f)*s+(h+b))*4;v+=e[y],u+=e[y+1],C+=e[y+2],x+=e[y+3],c++}const m=(d*s+h)*4;i[m]=v/c,i[m+1]=u/c,i[m+2]=C/c,i[m+3]=x/c}return new ImageData(i,s,t)},De=(a,n)=>{const e=a.data,s=n;for(let t=0;t<e.length;t+=4)e[t]=Math.min(255,e[t]*s),e[t+1]=Math.min(255,e[t+1]*s),e[t+2]=Math.min(255,e[t+2]*s);return a},Be=(a,n)=>{const e=a.data,s=n,t=128*(1-s);for(let i=0;i<e.length;i+=4)e[i]=Math.max(0,Math.min(255,e[i]*s+t)),e[i+1]=Math.max(0,Math.min(255,e[i+1]*s+t)),e[i+2]=Math.max(0,Math.min(255,e[i+2]*s+t));return a},_e=(a,n)=>{const e=a.data;for(let s=0;s<e.length;s+=4){const t=.299*e[s]+.587*e[s+1]+.114*e[s+2];e[s]=t+(e[s]-t)*n,e[s+1]=t+(e[s+1]-t)*n,e[s+2]=t+(e[s+2]-t)*n}return a},$e=(a,n)=>{const e=a.data;for(let s=0;s<e.length;s+=4){const t=e[s]/255,i=e[s+1]/255,l=e[s+2]/255,d=Math.max(t,i,l),h=Math.min(t,i,l),v=d-h;if(v===0)continue;let u=0;d===t?u=(i-l)/v%6:d===i?u=(l-t)/v+2:u=(t-i)/v+4,u=(u*60+n)%360,u<0&&(u+=360);const C=(d+h)/2,x=v/(1-Math.abs(2*C-1)),c=(1-Math.abs(2*C-1))*x,m=c*(1-Math.abs(u/60%2-1)),f=C-c/2;let b=0,y=0,P=0;u<60?(b=c,y=m,P=0):u<120?(b=m,y=c,P=0):u<180?(b=0,y=c,P=m):u<240?(b=0,y=m,P=c):u<300?(b=m,y=0,P=c):(b=c,y=0,P=m),e[s]=Math.round((b+f)*255),e[s+1]=Math.round((y+f)*255),e[s+2]=Math.round((P+f)*255)}return a},Qe=(a,n)=>{const e=a.data,s=a.width,t=a.height,i=new Uint8ClampedArray(e.length);for(let l=1;l<t-1;l++)for(let d=1;d<s-1;d++){const h=(l*s+d)*4;let v=0,u=0;for(let c=-1;c<=1;c++)for(let m=-1;m<=1;m++){const f=((l+c)*s+(d+m))*4,b=.299*e[f]+.587*e[f+1]+.114*e[f+2],y=[[-1,0,1],[-2,0,2],[-1,0,1]],P=[[-1,-2,-1],[0,0,0],[1,2,1]];v+=b*y[c+1][m+1],u+=b*P[c+1][m+1]}const x=Math.sqrt(v*v+u*u)>n*255?255:0;i[h]=x,i[h+1]=x,i[h+2]=x,i[h+3]=e[h+3]}return new ImageData(i,s,t)},Xe=(a,n)=>{const e=a.data,s=a.width,t=a.height,i=new Uint8ClampedArray(e),l=[[-2,-1,0],[-1,1,1],[0,1,2]];for(let d=1;d<t-1;d++)for(let h=1;h<s-1;h++){let v=0,u=0,C=0;for(let c=-1;c<=1;c++)for(let m=-1;m<=1;m++){const f=((d+c)*s+(h+m))*4,b=l[c+1][m+1];v+=e[f]*b,u+=e[f+1]*b,C+=e[f+2]*b}const x=(d*s+h)*4;i[x]=Math.max(0,Math.min(255,v*n+128)),i[x+1]=Math.max(0,Math.min(255,u*n+128)),i[x+2]=Math.max(0,Math.min(255,C*n+128))}return new ImageData(i,s,t)},F=(a,n,e)=>{const s=a[n];if(typeof s=="number")return s;if(typeof s=="string"){const t=Number(s);return Number.isFinite(t)?t:e}return e},Ye=(a,n)=>{let e=a;e=Ce(e,.7);const s=F(n,"grain",.3),t=e.data;for(let i=0;i<t.length;i+=4){const l=(Math.random()-.5)*s*255;t[i]=Math.max(0,Math.min(255,t[i]+l)),t[i+1]=Math.max(0,Math.min(255,t[i+1]+l)),t[i+2]=Math.max(0,Math.min(255,t[i+2]+l))}return e},Je=(a,n)=>{const e=a.data,s=F(n,"glow",1.2);for(let t=0;t<e.length;t+=4)(e[t]+e[t+1]+e[t+2])/3>128&&(e[t]=Math.min(255,e[t]*s),e[t+1]=Math.min(255,e[t+1]*s),e[t+2]=Math.min(255,e[t+2]*s));return a},M=p.useCallback(()=>{const a=we.current,n=Fe.current,e=de.current;if(!a||!n)return;const s=a.getContext("2d"),t=n.getContext("2d");if(!s||!t)return;let i=null;if(e&&!e.paused)s.drawImage(e,0,0,a.width,a.height),i=s.getImageData(0,0,a.width,a.height);else if(ce){const l=new Image;l.onload=()=>{s.drawImage(l,0,0,a.width,a.height);const d=s.getImageData(0,0,a.width,a.height);Pe(d,t,!0)},l.src=ce;return}i&&Pe(i,t,!(H&&e&&!e.paused)),H&&e&&!e.paused&&(ue.current=requestAnimationFrame(M))},[w,H,ce]),Pe=(a,n,e=!0)=>{const s=N.filter(i=>w.includes(i.id));if(s.length===0){n.putImageData(a,0,0);return}fe(!0);const t=ze(a,s);if(n.putImageData(t,0,0),e){const i=n.canvas.toDataURL();Ve(i),Ue?.(i)}fe(!1)},Ke=p.useCallback(a=>{if(w.length>=le){R("error");return}oe(e=>[...e,a]);const n=N.find(e=>e.id===a);n&&(T(e=>({...e,[a]:{...n.parameters}})),pe?.(a,n.parameters??{}),R("select"))},[w,le,N,pe,R]),je=p.useCallback(a=>{oe(n=>n.filter(e=>e!==a)),T(n=>{const{[a]:e,...s}=n;return s}),R("remove")},[R]),Se=p.useCallback((a,n,e)=>{T(s=>({...s,[a]:{...s[a],[n]:e}}))},[]);p.useEffect(()=>(g&&xe(),()=>{ue.current&&cancelAnimationFrame(ue.current)}),[g,xe]),p.useEffect(()=>{M()},[w,L,M]);const Ze=()=>r.jsxs("div",{className:"glass-space-y-4",children:[r.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Filter Library"}),r.jsx("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-3 lg:glass-grid-cols-4 glass-gap-3",children:N.map(a=>r.jsxs(q.div,{className:`
                glass-p-3 glass-radius-lg glass-border glass-cursor-pointer glass-transition-all duration-[${as.DURATION.fast}ms]
                ${w.includes(a.id)?"glass-border-blue glass-surface-blue/20":"glass-border-white/20 hover:glass-border-white/40 glass-surface-subtle/5"}
              `,whileHover:j?{scale:1.02}:{},whileTap:j?{scale:.98}:{},onClick:()=>{w.includes(a.id)?je(a.id):Ke(a.id)},children:[r.jsx("div",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90 glass-mb-1",children:a.name}),r.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-60 glass-mb-2",children:a.description}),r.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[r.jsx("span",{className:`
                  glass-px-2 glass-py-0.5 glass-radius glass-text-xs glass-font-medium
                  ${a.category==="artistic"?"glass-surface-primary/20 glass-text-secondary":a.category==="color"?"glass-surface-blue/20 glass-text-secondary":a.category==="blur"?"glass-surface-muted/20 glass-text-secondary":a.category==="distortion"?"glass-surface-red/20 glass-text-secondary":a.category==="vintage"?"glass-surface-amber/20 glass-text-secondary":"glass-surface-green/20 glass-text-secondary"}
                `,children:a.category}),w.includes(a.id)&&r.jsx("div",{className:"glass-text-primary",children:"✓"})]})]},a.id))})]}),es=()=>r.jsxs("div",{className:"glass-space-y-4",children:[r.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[r.jsxs("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:["Active Filters (",w.length,"/",le,")"]}),w.length>0&&r.jsx("button",{onClick:()=>{oe([]),T({}),R("clear")},className:"glass-text-xs glass-text-primary hover:glass-text-secondary glass-transition-colors",children:"Clear All"})]}),w.length===0?r.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-50 glass-italic",children:"No filters applied"}):r.jsx("div",{className:"glass-space-y-3",children:w.map((a,n)=>{const e=N.find(s=>s.id===a);return e?r.jsxs("div",{className:"glass-p-3 glass-radius-lg glass-border glass-border-white/10 glass-surface-subtle/5",children:[r.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-2",children:[r.jsx("span",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90",children:e.name}),r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[r.jsxs("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:["#",n+1]}),r.jsx("button",{onClick:()=>je(a),className:"glass-text-primary hover:glass-text-secondary glass-transition-colors",children:"×"})]})]}),e.parameters&&Object.entries(e.parameters).map(([s,t])=>r.jsxs("div",{className:"glass-mt-2",children:[r.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:[s.charAt(0).toUpperCase()+s.slice(1),":",typeof t=="number"?` ${F(L[a]??{},s,t).toFixed(2)}`:""]}),typeof t=="number"?r.jsx("input",{type:"range",min:s==="degrees"?-180:0,max:s==="degrees"?180:s==="radius"?20:3,step:s==="degrees"?1:.1,value:L[a]?.[s]??t,onChange:i=>Se(a,s,parseFloat(i.target.value)),className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":`${s.charAt(0).toUpperCase()+s.slice(1)} filter parameter`}):r.jsx("input",{type:"color",value:is(String(L[a]?.[s]??t)),onChange:i=>Se(a,s,i.target.value),className:"glass-w-8 glass-h-6 glass-radius glass-border glass-border-white/20","aria-label":`${s.charAt(0).toUpperCase()+s.slice(1)} color picker`})]},s))]},a):null})})]});return r.jsxs(ls,{ref:ke,variant:"frosted","data-glass-component":!0,style:{...gs,maxHeight:"100%",minWidth:0,height:S?"100%":void 0,overflow:S?"hidden":void 0},className:`${S?"glass-p-3 glass-space-y-3":"glass-p-4 glass-space-y-4"} glass-max-w-full glass-overflow-auto ${Ge}`,...Ae,children:[He&&r.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-gap-3 glass-min-w-0",children:[r.jsxs("div",{className:"glass-min-w-0",children:[r.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary-glass-opacity-90 glass-truncate",children:"Live Image Filter"}),r.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Real-time image and video processing with custom filters"})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-flex-shrink-0",children:[H&&r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[r.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),r.jsx("span",{className:"glass-text-xs",children:"Real-time"})]}),ve&&r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[r.jsx("div",{className:"glass-w-4 glass-h-4 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin"}),r.jsx("span",{className:"glass-text-xs",children:"Processing"})]})]})]}),Me&&r.jsxs("div",{className:`glass-grid ${S?"glass-grid-cols-2 glass-gap-3":"glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-3"}`,style:S?{gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:10}:void 0,children:[r.jsxs("div",{className:"glass-space-y-2",children:[r.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Original"}),r.jsxs("div",{className:"glass-relative glass-aspect-video glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden",children:[r.jsx("canvas",{ref:we,width:me,height:he,className:"glass-w-full glass-h-full glass-object-cover"}),g&&r.jsx("video",{ref:de,className:"glass-hidden",autoPlay:!0,muted:!0,loop:!0})]})]}),r.jsxs("div",{className:"glass-space-y-2",children:[r.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Filtered"}),r.jsxs("div",{className:"glass-relative glass-aspect-video glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden",children:[r.jsx("canvas",{ref:Fe,width:me,height:he,className:"glass-w-full glass-h-full glass-object-cover"}),ve&&r.jsx("div",{className:"glass-absolute glass-inset-0 glass-surface-dark/50 glass-flex glass-items-center glass-justify-center",children:r.jsx("div",{className:"glass-w-8 glass-h-8 glass-border-2 glass-border-white glass-border-t-transparent glass-radius-full glass-animate-spin"})})]})]})]}),qe&&r.jsxs("div",{className:"glass-grid glass-grid-cols-1 lg:glass-grid-cols-2 glass-gap-6",children:[r.jsx(es,{}),r.jsxs("div",{className:"glass-space-y-4",children:[r.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Processing Settings"}),r.jsxs("div",{className:"glass-grid glass-grid-cols-2 glass-gap-4",children:[r.jsxs("div",{children:[r.jsx("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"Quality"}),r.jsxs("select",{value:W.quality,onChange:a=>ge(n=>({...n,quality:a.target.value})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"Processing quality",children:[r.jsx("option",{value:"low",children:"Low"}),r.jsx("option",{value:"medium",children:"Medium"}),r.jsx("option",{value:"high",children:"High"}),r.jsx("option",{value:"ultra",children:"Ultra"})]})]}),r.jsxs("div",{children:[r.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["FPS: ",W.fps]}),r.jsx("input",{type:"range",min:"1",max:"60",value:W.fps,onChange:a=>ge(n=>({...n,fps:parseInt(a.target.value)})),className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":"Frames per second"})]})]}),r.jsx("div",{className:"glass-flex glass-items-center glass-space-x-4",children:r.jsxs("label",{className:"glass-flex glass-items-center glass-space-x-2 glass-cursor-pointer",children:[r.jsx("input",{type:"checkbox",checked:W.enableGPU,onChange:a=>ge(n=>({...n,enableGPU:a.target.checked})),className:"glass-w-4 glass-h-4 glass-radius glass-border-white/30"}),r.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"GPU Acceleration"})]})})]})]}),We&&r.jsx(Ze,{}),Te&&r.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-gap-3 glass-pt-3 glass-border-t glass-border-white/10 glass-flex-wrap",children:[r.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-flex-wrap",children:[r.jsx("input",{type:"file",accept:"image/*",onChange:a=>{const n=a.target.files?.[0];if(n){const e=URL.createObjectURL(n);Ee(e),R("upload")}},className:"glass-hidden",id:"image-upload"}),r.jsx(q.label,{htmlFor:"image-upload",className:"glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-cursor-pointer glass-transition-colors",whileHover:j?{scale:1.02}:{},whileTap:j?{scale:.98}:{},children:"Upload Image"}),r.jsx(q.button,{className:"glass-px-4 glass-py-2 glass-border glass-border-white/30 hover:glass-border-white/50 glass-text-primary-glass-opacity-80 glass-radius-lg glass-text-sm glass-transition-colors",whileHover:j?{scale:1.02}:{},whileTap:j?{scale:.98}:{},onClick:()=>M(),children:"Apply Filters"})]}),ye&&r.jsx(q.a,{href:ye,download:"filtered-image.png",className:"glass-px-4 glass-py-2 glass-surface-green hover:glass-surface-green glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors",whileHover:j?{scale:1.02}:{},whileTap:j?{scale:.98}:{},children:"Download Result"})]})]})});ie.displayName="GlassLiveFilter";try{ie.displayName="GlassLiveFilter",ie.__docgenInfo={description:"",displayName:"GlassLiveFilter",props:{videoSource:{defaultValue:null,description:"",name:"videoSource",required:!1,type:{name:"string | MediaStream | undefined"}},imageSource:{defaultValue:null,description:"",name:"imageSource",required:!1,type:{name:"string | undefined"}},availableFilters:{defaultValue:{value:`[
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
]`},description:"",name:"availableFilters",required:!1,type:{name:"FilterEffect[] | undefined"}},selectedFilters:{defaultValue:{value:"[]"},description:"",name:"selectedFilters",required:!1,type:{name:"string[] | undefined"}},processingSettings:{defaultValue:{value:"{}"},description:"",name:"processingSettings",required:!1,type:{name:"Partial<ProcessingSettings> | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},showHeader:{defaultValue:{value:"!compact"},description:"",name:"showHeader",required:!1,type:{name:"boolean | undefined"}},showActions:{defaultValue:{value:"!compact"},description:"",name:"showActions",required:!1,type:{name:"boolean | undefined"}},showFilterLibrary:{defaultValue:{value:"true"},description:"",name:"showFilterLibrary",required:!1,type:{name:"boolean | undefined"}},showPreview:{defaultValue:{value:"true"},description:"",name:"showPreview",required:!1,type:{name:"boolean | undefined"}},showControls:{defaultValue:{value:"false"},description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},enableRealTimeProcessing:{defaultValue:{value:"false"},description:"",name:"enableRealTimeProcessing",required:!1,type:{name:"boolean | undefined"}},enableChaining:{defaultValue:{value:"true"},description:"",name:"enableChaining",required:!1,type:{name:"boolean | undefined"}},enableCustomFilters:{defaultValue:{value:"false"},description:"",name:"enableCustomFilters",required:!1,type:{name:"boolean | undefined"}},maxFilters:{defaultValue:{value:"5"},description:"",name:"maxFilters",required:!1,type:{name:"number | undefined"}},canvasWidth:{defaultValue:{value:"640"},description:"",name:"canvasWidth",required:!1,type:{name:"number | undefined"}},canvasHeight:{defaultValue:{value:"360"},description:"",name:"canvasHeight",required:!1,type:{name:"number | undefined"}},onFilterApply:{defaultValue:null,description:"",name:"onFilterApply",required:!1,type:{name:"((filterId: string, params: FilterParameters) => void) | undefined"}},onProcessingComplete:{defaultValue:null,description:"",name:"onProcessingComplete",required:!1,type:{name:"((processedData: string) => void) | undefined"}},onError:{defaultValue:null,description:"",name:"onError",required:!1,type:{name:"((error: Error) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const o=[{id:"grayscale",name:"Grayscale",description:"Convert to black and white",category:"color",intensity:1,parameters:{strength:1}},{id:"sepia",name:"Sepia",description:"Vintage sepia tone effect",category:"vintage",intensity:.8,parameters:{warmth:.8}},{id:"blur",name:"Gaussian Blur",description:"Smooth blur effect",category:"blur",intensity:1,parameters:{radius:5}},{id:"brightness",name:"Brightness",description:"Adjust image brightness",category:"color",intensity:1.2,parameters:{level:1.2}},{id:"contrast",name:"Contrast",description:"Adjust image contrast",category:"color",intensity:1.3,parameters:{level:1.3}},{id:"edge-detect",name:"Edge Detection",description:"Detect and highlight edges",category:"artistic",intensity:1,parameters:{threshold:.5}},{id:"vintage",name:"Vintage Film",description:"Old film camera effect",category:"vintage",intensity:.9,parameters:{grain:.3,vignette:.5}},{id:"neon",name:"Neon Glow",description:"Cyberpunk neon effect",category:"modern",intensity:1.2,parameters:{glow:1.2,color:"#ff00ff"}}],Cs={title:"AI + Intelligence/Glass Live Filter",component:ie,parameters:{layout:"fullscreen"},tags:["autodocs"],decorators:[g=>r.jsx("div",{style:{width:"100%",minHeight:"100vh",boxSizing:"border-box",display:"flex",alignItems:"center",justifyContent:"center",padding:"clamp(12px, 2.5vw, 28px)",overflow:"hidden"},children:r.jsx("div",{style:{width:"min(1180px, 100%)",maxHeight:"calc(100vh - 48px)",overflow:"auto",borderRadius:18,boxSizing:"border-box"},children:r.jsx(g,{})})})],argTypes:{canvasWidth:{control:{type:"range",min:400,max:1200,step:50}},canvasHeight:{control:{type:"range",min:300,max:800,step:50}},maxFilters:{control:{type:"range",min:1,max:10,step:1}},showFilterLibrary:{control:"boolean"},showPreview:{control:"boolean"},showControls:{control:"boolean"},enableRealTimeProcessing:{control:"boolean"},enableChaining:{control:"boolean"},enableCustomFilters:{control:"boolean"}}},U={args:{availableFilters:o,selectedFilters:["brightness"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,enableCustomFilters:!1,maxFilters:5,processingSettings:{quality:"medium",fps:30,enableGPU:!0,batchSize:4}}},G={args:{availableFilters:o.filter(g=>g.category==="color"),selectedFilters:["brightness","contrast"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:3}},A={args:{availableFilters:o.filter(g=>g.category==="artistic"),selectedFilters:["edge-detect"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:3}},k={args:{availableFilters:o.filter(g=>g.category==="vintage"),selectedFilters:["sepia","vintage"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!1,enableChaining:!0,maxFilters:3}},V={args:{availableFilters:o.filter(g=>g.category==="blur"),selectedFilters:["blur"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!1,maxFilters:2}},E={args:{availableFilters:o.filter(g=>g.category==="modern"),selectedFilters:["neon"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:3}},z={args:{availableFilters:o,selectedFilters:["contrast","edge-detect"],canvasWidth:1e3,canvasHeight:800,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!1,enableChaining:!0,maxFilters:8,processingSettings:{quality:"ultra",fps:60,enableGPU:!0,batchSize:8}}},I={args:{availableFilters:o,selectedFilters:["grayscale"],canvasWidth:600,canvasHeight:400,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:3,processingSettings:{quality:"low",fps:15,enableGPU:!1,batchSize:2}}},O={args:{availableFilters:o.slice(0,4),selectedFilters:["sepia"],canvasWidth:600,canvasHeight:400,showFilterLibrary:!1,showPreview:!0,showControls:!1,enableRealTimeProcessing:!0,enableChaining:!1,maxFilters:2}},D={args:{availableFilters:o,selectedFilters:["vintage","blur"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!1,showPreview:!0,showControls:!1,enableRealTimeProcessing:!1,enableChaining:!0,maxFilters:3}},B={args:{availableFilters:o,selectedFilters:[],canvasWidth:400,canvasHeight:300,showFilterLibrary:!0,showPreview:!1,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:5}},_={args:{availableFilters:o,selectedFilters:["brightness","neon"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,enableCustomFilters:!0,maxFilters:7}},$={args:{availableFilters:o,selectedFilters:["grayscale","sepia","blur","brightness","contrast"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:5}},Q={args:{availableFilters:o,selectedFilters:["edge-detect"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!1,maxFilters:1}},X={args:{availableFilters:o,selectedFilters:["brightness","contrast","sepia","vintage"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!1,enableChaining:!0,maxFilters:6}},Y={args:{availableFilters:o,selectedFilters:["blur","edge-detect","neon"],canvasWidth:1e3,canvasHeight:800,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:5,processingSettings:{quality:"high",fps:60,enableGPU:!0,batchSize:8}}},J={args:{availableFilters:o,selectedFilters:["grayscale","brightness"],canvasWidth:600,canvasHeight:400,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:3,processingSettings:{quality:"medium",fps:30,enableGPU:!1,batchSize:2}}},K={args:{availableFilters:o,selectedFilters:["brightness","contrast"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:4,processingSettings:{quality:"medium",fps:60,enableGPU:!0,batchSize:6}}},Z={args:{availableFilters:o,selectedFilters:["vintage","blur","edge-detect"],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:5,processingSettings:{quality:"high",fps:10,enableGPU:!0,batchSize:2}}},ee={args:{availableFilters:o,selectedFilters:["sepia","contrast"],canvasWidth:1200,canvasHeight:400,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:5}},se={args:{availableFilters:o,selectedFilters:["brightness","edge-detect"],canvasWidth:400,canvasHeight:800,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:5}},ae={args:{availableFilters:o.slice(0,6),selectedFilters:["grayscale"],canvasWidth:400,canvasHeight:300,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:3}},te={args:{availableFilters:o,selectedFilters:["vintage","neon"],canvasWidth:1200,canvasHeight:900,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!1,enableChaining:!0,maxFilters:8,processingSettings:{quality:"ultra",fps:30,enableGPU:!0,batchSize:8}}},re={args:{availableFilters:o,selectedFilters:[],canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!0,enableChaining:!0,maxFilters:5}},ne={args:{availableFilters:o,selectedFilters:o.map(g=>g.id),canvasWidth:800,canvasHeight:600,showFilterLibrary:!0,showPreview:!0,showControls:!0,enableRealTimeProcessing:!1,enableChaining:!0,maxFilters:10}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
}`,...Q.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
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
}`,...K.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
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
}`,...Z.parameters?.docs?.source}}};ee.parameters={...ee.parameters,docs:{...ee.parameters?.docs,source:{originalSource:`{
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
}`,...ee.parameters?.docs?.source}}};se.parameters={...se.parameters,docs:{...se.parameters?.docs,source:{originalSource:`{
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
}`,...se.parameters?.docs?.source}}};ae.parameters={...ae.parameters,docs:{...ae.parameters?.docs,source:{originalSource:`{
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
}`,...ae.parameters?.docs?.source}}};te.parameters={...te.parameters,docs:{...te.parameters?.docs,source:{originalSource:`{
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
}`,...te.parameters?.docs?.source}}};re.parameters={...re.parameters,docs:{...re.parameters?.docs,source:{originalSource:`{
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
}`,...re.parameters?.docs?.source}}};ne.parameters={...ne.parameters,docs:{...ne.parameters?.docs,source:{originalSource:`{
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
}`,...ne.parameters?.docs?.source}}};const Ps=["Default","ColorFilters","ArtisticFilters","VintageFilters","BlurEffects","ModernEffects","HighQualityProcessing","LowQualityFast","MinimalInterface","PreviewOnly","FilterLibraryFocus","CustomFiltersEnabled","MaxFiltersReached","SingleFilterMode","ChainedFilters","GPUAccelerated","CPUProcessing","HighFrameRate","LowFrameRate","WideCanvas","TallCanvas","SmallCanvas","LargeCanvas","NoFiltersSelected","AllFiltersSelected"];export{ne as AllFiltersSelected,A as ArtisticFilters,V as BlurEffects,J as CPUProcessing,X as ChainedFilters,G as ColorFilters,_ as CustomFiltersEnabled,U as Default,B as FilterLibraryFocus,Y as GPUAccelerated,K as HighFrameRate,z as HighQualityProcessing,te as LargeCanvas,Z as LowFrameRate,I as LowQualityFast,$ as MaxFiltersReached,O as MinimalInterface,E as ModernEffects,re as NoFiltersSelected,D as PreviewOnly,Q as SingleFilterMode,ae as SmallCanvas,se as TallCanvas,k as VintageFilters,ee as WideCanvas,Ps as __namedExportsOrder,Cs as default};
