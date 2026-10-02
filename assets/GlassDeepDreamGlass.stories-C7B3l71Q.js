import{r as c,a as aa,b as _e,j as e,m as P}from"./iframe-DFMMcocb.js";import{u as sa}from"./useMotionPreference-CXubJTNb.js";import{u as ta}from"./a11y-Q0mX7KvA.js";import{c as ra}from"./createGlassStyle-Cr0Un8y6.js";import{u as na}from"./soundDesign-DAOJZn7H.js";import{O as ia}from"./OptimizedGlassCore-1D6AE-uZ.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-iDxBLJQX.js";const la=[{id:"conv2d_1",name:"Early Features",description:"Basic edges and textures",type:"conv",depth:1,features:["edges","lines","basic_shapes"],strength:.5},{id:"conv2d_5",name:"Texture Patterns",description:"Complex textures and patterns",type:"conv",depth:5,features:["textures","patterns","repetition"],strength:.7},{id:"mixed3a",name:"Object Parts",description:"Parts of objects and shapes",type:"inception",depth:10,features:["object_parts","curves","complex_shapes"],strength:1},{id:"mixed4a",name:"Abstract Objects",description:"Abstract object representations",type:"inception",depth:15,features:["abstract_objects","compositions","spatial_relations"],strength:1.2},{id:"mixed4d",name:"Complex Structures",description:"Complex architectural structures",type:"inception",depth:18,features:["buildings","architecture","complex_structures"],strength:1.5},{id:"mixed5b",name:"High-Level Concepts",description:"Abstract concepts and scenes",type:"inception",depth:25,features:["scenes","concepts","abstract_ideas"],strength:2}],oa={layers:["mixed3a"],iterations:20,learningRate:.01,octaveScale:1.4,octaves:4,maxLoss:10,stepSize:1.5,tileSize:512},ca={color:"var(--glass-theme-text, var(--glass-text-primary))"},le=c.forwardRef(({imageSource:o,availableLayers:oe=la,selectedLayers:We=["mixed3a"],dreamSettings:Ce={},compact:N=!1,showHeader:De=!N,showActions:Ie=!N,showLayerSelector:xe=!1,showPreview:Oe=!0,showSettings:fe=!1,enableRealTime:ce=!1,enableAnimation:A=!0,enableTiling:Fe=!0,animationSpeed:we=1,canvasWidth:de=800,canvasHeight:ge=600,onDreamGenerated:Se,onLayerActivation:Le,onProgress:Re,className:qe="",...Ge},$e)=>{const Ve=aa(),[x,je]=c.useState(!1),[Ne,Ae]=c.useState(0),[me,ke]=c.useState(0),[f,Ee]=c.useState(o||""),[k,Ue]=c.useState(""),[Te,Be]=c.useState({}),Pe=c.useRef(0),[Xe,Ye]=c.useState(Fe),[Ke,Je]=c.useState(A),[t,S]=c.useState({...oa,...Ce,layers:We}),H=c.useRef(null),z=c.useRef(null),M=c.useRef(),b=ta("glass-deep-dream"),{shouldAnimate:w}=sa(),{play:L}=na(),He=c.useCallback((a,s)=>{const{width:l,height:r}=s,d=[];switch(a.type){case"conv":for(let n=0;n<100;n++){const g=Math.floor(Math.random()*l),v=(Math.floor(Math.random()*r)*l+g)*4,u=s.data[v],p=s.data[v+1],h=s.data[v+2],y=Math.tanh((u+p+h)/765-.5)*a.strength;d.push(y)}break;case"inception":for(let n=0;n<50;n++){const g=(Math.random()-.5)*a.strength*2;d.push(Math.tanh(g))}break;default:for(let n=0;n<64;n++)d.push((Math.random()-.5)*a.strength)}return d},[]),ze=c.useCallback((a,s,l)=>{const r=new Uint8ClampedArray(a.data),{width:d,height:n}=a;for(let g=0;g<n;g++)for(let m=0;m<d;m++){const v=(g*d+m)*4;let u=r[v],p=r[v+1],h=r[v+2];switch(s.type){case"conv":const y=m/d-.5,R=g/n-.5,j=Math.sqrt(y*y+R*R),T=Math.sin(j*20)*l*s.strength*50;u=Math.max(0,Math.min(255,u+T)),p=Math.max(0,Math.min(255,p+T)),h=Math.max(0,Math.min(255,h+T));break;case"inception":const he=Math.cos((m+g)*.05)*Math.sin(m*.02),ea=Math.sin((m+g)*.05)*Math.cos(g*.02),ve=(he+ea)*l*s.strength*30;u=Math.max(0,Math.min(255,u+ve)),p=Math.max(0,Math.min(255,p+ve*.8)),h=Math.max(0,Math.min(255,h+ve*.6));break;case"dense":const be=Math.sin(m*.01)*Math.cos(g*.01)*l*s.strength*20;u=Math.max(0,Math.min(255,u*(1+be/255))),p=Math.max(0,Math.min(255,p*(1+be/255))),h=Math.max(0,Math.min(255,h*(1+be/255)));break;default:const ye=Math.sin(m*.03)*Math.cos(g*.03)*l*s.strength*15;u=Math.max(0,Math.min(255,u+ye)),p=Math.max(0,Math.min(255,p+ye)),h=Math.max(0,Math.min(255,h+ye))}r[v]=u,r[v+1]=p,r[v+2]=h}return new ImageData(r,d,n)},[]),ue=c.useCallback(async()=>{if(!f)return;je(!0),Ae(0),ke(0),L("processing");const a=H.current,s=z.current;if(!a||!s)return;const l=a.getContext("2d"),r=s.getContext("2d");if(!l||!r)return;const d=new Image;d.onload=async()=>{l.drawImage(d,0,0,a.width,a.height);let n=l.getImageData(0,0,a.width,a.height);for(let m=0;m<t.octaves;m++){const v=Math.pow(t.octaveScale,m);Math.floor(a.width/v),Math.floor(a.height/v);for(let u=0;u<Math.floor(t.iterations/t.octaves);u++){const p=m*Math.floor(t.iterations/t.octaves)+u;Ae(p);const h=p/t.iterations*100;ke(h),Re?.(h,p);for(const y of t.layers){const R=oe.find(j=>j.id===y);if(R){const j=He(R,n);Be(he=>({...he,[y]:j})),Le?.(y,j);const T=t.learningRate*t.stepSize;n=ze(n,R,T)}}r.putImageData(n,0,0),await new Promise(y=>setTimeout(y,_e.DURATION.fast/we))}}const g=s.toDataURL();Ue(g),Se?.(g,t),je(!1),L("success")},d.src=f},[f,t,oe,He,ze,we,Re,Le,Se,L]),pe=c.useCallback(()=>{if(!A||x)return;Pe.current+=1;const a=z.current;if(a&&k){const s=a.getContext("2d");if(s){const l=new Image;l.onload=()=>{s.save(),s.globalAlpha=.1,s.translate(a.width/2,a.height/2),s.rotate(Pe.current*.01),s.drawImage(l,-a.width/2,-a.height/2),s.restore()},l.src=k}}M.current=requestAnimationFrame(pe)},[A,x,k]),Me=c.useCallback(a=>{S(s=>{const l=s.layers.includes(a)?s.layers.filter(r=>r!==a):[...s.layers,a];return{...s,layers:l}}),L("select")},[L]);c.useEffect(()=>{if(!(!A||x))return M.current=requestAnimationFrame(pe),()=>{M.current&&cancelAnimationFrame(M.current)}},[A,x,pe]),c.useEffect(()=>{if(ce&&f){const a=setTimeout(()=>{ue()},1e3);return()=>clearTimeout(a)}},[t,ce,f,ue]),c.useEffect(()=>{if(f)return;const a=(s,l)=>{if(!s)return;const r=s.getContext("2d");if(!r)return;const d=r.createLinearGradient(0,0,s.width,s.height);d.addColorStop(0,"rgba(248, 250, 252, 0.98)"),d.addColorStop(1,"rgba(226, 232, 240, 0.94)"),r.fillStyle=d,r.fillRect(0,0,s.width,s.height),r.strokeStyle="rgba(100, 116, 139, 0.34)",r.lineWidth=2;for(let n=48;n<s.height;n+=72)r.beginPath(),r.moveTo(28,n),r.bezierCurveTo(s.width*.3,n-20,s.width*.68,n+20,s.width-28,n),r.stroke();r.fillStyle="rgba(30, 41, 59, 0.82)",r.font="600 18px system-ui, sans-serif",r.textAlign="center",r.fillText(l,s.width/2,s.height/2)};a(H.current,"Source preview"),a(z.current,"Dream preview")},[f,de,ge]);const Qe=()=>e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Neural Layers"}),e.jsx("div",{className:"glass-deep-dream-layer-list glass-grid glass-grid-cols-1 glass-gap-2",children:oe.map(a=>e.jsxs(P.div,{role:"checkbox","aria-checked":t.layers.includes(a.id),tabIndex:0,className:"glass-deep-dream-layer glass-p-3 glass-radius-lg glass-border glass-cursor-pointer",style:{background:t.layers.includes(a.id)?"rgba(226, 234, 238, 0.78)":"rgba(255, 255, 255, 0.46)",borderColor:t.layers.includes(a.id)?"rgba(71, 93, 105, 0.42)":"rgba(255, 255, 255, 0.68)",boxShadow:"inset 0 1px 0 rgba(255,255,255,.8), 0 7px 20px rgba(30,41,59,.06)"},whileHover:w?{scale:1.01}:{},whileTap:w?{scale:.99}:{},onClick:()=>Me(a.id),onKeyDown:s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),Me(a.id))},children:[e.jsxs("div",{className:"glass-flex glass-items-start glass-justify-between",children:[e.jsxs("div",{className:"glass-flex-1",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-mb-1",children:[e.jsx("h5",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90",children:a.name}),e.jsx("span",{className:"glass-px-2 glass-py-0.5 glass-radius-full glass-text-xs glass-font-medium",style:{background:"rgba(71,85,105,.1)",color:"var(--glass-theme-text-secondary, var(--glass-text-secondary))"},children:a.type})]}),e.jsx("p",{className:"glass-text-xs glass-text-primary-glass-opacity-60 glass-mb-2",children:a.description}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4 glass-text-xs glass-text-primary-glass-opacity-50",children:[e.jsxs("span",{children:["Depth: ",a.depth]}),e.jsxs("span",{children:["Strength: ",a.strength.toFixed(1)]})]}),e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-1 glass-mt-2",children:a.features.slice(0,3).map(s=>e.jsx("span",{className:"glass-px-1.5 glass-py-0.5 glass-surface-subtle/10 glass-text-primary-glass-opacity-60 glass-radius glass-text-xs",children:s.replace("_"," ")},s))})]}),t.layers.includes(a.id)&&e.jsx("div",{className:"glass-text-primary glass-ml-2",children:"✓"})]}),Te[a.id]&&e.jsx("div",{className:"glass-mt-2 glass-pt-2 glass-border-t glass-border-white/10",children:e.jsx("div",{className:"glass-flex glass-items-center glass-space-x-1",children:Te[a.id].slice(0,20).map((s,l)=>e.jsx("div",{className:"glass-w-1 glass-surface-blue glass-radius",style:{height:`${Math.abs(s)*10+2}px`,opacity:Math.abs(s)}},l))})})]},a.id))})]}),Ze=()=>e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Dream Settings"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-3",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Iterations: ",t.iterations]}),e.jsx("input",{type:"range",min:"5",max:"100",value:t.iterations,onChange:a=>S(s=>({...s,iterations:parseInt(a.target.value)})),"aria-label":`Iterations: ${t.iterations}`,className:"glass-deep-dream-range glass-w-full glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Learning Rate: ",t.learningRate.toFixed(3)]}),e.jsx("input",{type:"range",min:"0.001",max:"0.1",step:"0.001",value:t.learningRate,onChange:a=>S(s=>({...s,learningRate:parseFloat(a.target.value)})),"aria-label":`Learning Rate: ${t.learningRate.toFixed(3)}`,className:"glass-deep-dream-range glass-w-full glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Octaves: ",t.octaves]}),e.jsx("input",{type:"range",min:"1",max:"8",value:t.octaves,onChange:a=>S(s=>({...s,octaves:parseInt(a.target.value)})),"aria-label":`Octaves: ${t.octaves}`,className:"glass-deep-dream-range glass-w-full glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Octave Scale: ",t.octaveScale.toFixed(1)]}),e.jsx("input",{type:"range",min:"1.1",max:"2.0",step:"0.1",value:t.octaveScale,onChange:a=>S(s=>({...s,octaveScale:parseFloat(a.target.value)})),"aria-label":`Octave Scale: ${t.octaveScale.toFixed(1)}`,className:"glass-deep-dream-range glass-w-full glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Step Size: ",t.stepSize.toFixed(1)]}),e.jsx("input",{type:"range",min:"0.5",max:"5.0",step:"0.1",value:t.stepSize,onChange:a=>S(s=>({...s,stepSize:parseFloat(a.target.value)})),"aria-label":`Step Size: ${t.stepSize.toFixed(1)}`,className:"glass-deep-dream-range glass-w-full glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Max Loss: ",t.maxLoss.toFixed(1)]}),e.jsx("input",{type:"range",min:"1.0",max:"50.0",step:"1.0",value:t.maxLoss,onChange:a=>S(s=>({...s,maxLoss:parseFloat(a.target.value)})),"aria-label":`Max Loss: ${t.maxLoss.toFixed(1)}`,className:"glass-deep-dream-range glass-w-full glass-cursor-pointer"})]})]}),e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-2",children:[{label:"Enable Tiling",value:Xe,set:Ye},{label:"Animate Result",value:Ke,set:Je}].map(a=>e.jsxs("button",{type:"button",role:"switch","aria-checked":a.value,onClick:()=>a.set(!a.value),className:"glass-deep-dream-switch glass-flex glass-items-center glass-justify-between glass-gap-3 glass-radius-full glass-px-3 glass-py-2 glass-text-sm",style:{background:"rgba(255,255,255,.5)",border:"1px solid rgba(255,255,255,.72)",color:"var(--glass-theme-text, var(--glass-text-primary))"},children:[e.jsx("span",{children:a.label}),e.jsx("span",{"aria-hidden":"true",className:"glass-relative glass-radius-full",style:{width:36,height:21,background:a.value?"rgba(72,94,106,.84)":"rgba(100,116,139,.2)"},children:e.jsx("span",{className:"glass-absolute glass-radius-full",style:{width:17,height:17,top:2,left:a.value?17:2,background:"#fff",boxShadow:"0 2px 6px rgba(15,23,42,.25)",transition:"left 160ms ease"}})})]},a.label))})]});return e.jsxs(ia,{ref:$e,id:b,variant:"frosted","data-glass-component":!0,style:{...ca,minWidth:0,overflow:"visible"},className:`glass-deep-dream-glass ${N?"glass-p-3 glass-space-y-3":"glass-p-4 glass-space-y-4"} glass-max-w-full ${qe}`,...Ge,children:[e.jsx("style",{children:`
          #${b} .glass-deep-dream-range { appearance:none; height:28px; background:transparent; }
          #${b} .glass-deep-dream-range::-webkit-slider-runnable-track { height:6px; border-radius:999px; background:rgba(71,85,105,.17); box-shadow:inset 0 1px 2px rgba(15,23,42,.12); }
          #${b} .glass-deep-dream-range::-webkit-slider-thumb { appearance:none; width:20px; height:20px; margin-top:-7px; border-radius:50%; border:1px solid rgba(255,255,255,.92); background:linear-gradient(145deg,#fff,#dce4e8); box-shadow:0 3px 10px rgba(15,23,42,.24); }
          #${b} .glass-deep-dream-range::-moz-range-track { height:6px; border-radius:999px; background:rgba(71,85,105,.17); }
          #${b} .glass-deep-dream-range::-moz-range-thumb { width:20px; height:20px; border-radius:50%; border:1px solid rgba(255,255,255,.92); background:#f8fafc; box-shadow:0 3px 10px rgba(15,23,42,.24); }
          #${b} :where(button,[role="checkbox"],input,label):focus-visible { outline:3px solid rgba(56,116,145,.34); outline-offset:2px; }
          @media (min-width: 720px) { #${b} .glass-deep-dream-layer-list { grid-template-columns:repeat(2,minmax(0,1fr)); } }
          @media (max-width: 480px) { #${b} .glass-deep-dream-layer { padding:10px; } #${b} .glass-deep-dream-switch { width:100%; } }
        `}),De&&e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsxs("div",{className:"glass-min-w-0",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary-glass-opacity-90",children:"DeepDream Glass"}),e.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Neural network-powered surreal image generation"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[ce&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),e.jsx("span",{className:"glass-text-xs",children:"Real-time"})]}),x&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-4 glass-h-4 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin"}),e.jsx("span",{className:"glass-text-xs",children:"Dreaming..."})]})]})]}),Oe&&e.jsxs("div",{className:`glass-grid ${N?"glass-grid-cols-2 glass-gap-3":"glass-grid-cols-1 lg:glass-grid-cols-2 glass-gap-4"}`,style:N?{gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:10}:void 0,children:[e.jsxs("div",{className:"glass-space-y-2",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Original"}),e.jsxs("div",{className:"glass-relative glass-aspect-video glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden",children:[e.jsx("canvas",{ref:H,width:de,height:ge,className:"glass-block glass-w-full glass-h-full glass-object-cover"}),!f&&e.jsx("div",{className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center glass-text-primary-glass-opacity-50",children:e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-2","aria-hidden":"true",children:"◇"}),e.jsx("p",{children:"No image loaded"})]})})]})]}),e.jsxs("div",{className:"glass-space-y-2",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"DeepDream"}),e.jsxs("div",{className:"glass-relative glass-aspect-video glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden",children:[e.jsx("canvas",{ref:z,width:de,height:ge,className:"glass-block glass-w-full glass-h-full glass-object-cover"}),x&&e.jsx("div",{className:"glass-absolute glass-inset-0 glass-surface-dark/50 glass-flex glass-items-center glass-justify-center",children:e.jsxs("div",{className:"glass-text-center glass-text-primary",children:[e.jsx("div",{className:"glass-w-8 glass-h-8 glass-border-2 glass-border-white glass-border-t-transparent glass-radius-full glass-animate-spin glass-mx-auto glass-mb-2"}),e.jsxs("div",{className:"glass-text-sm",children:["Iteration ",Ne]}),e.jsxs("div",{className:"glass-text-xs glass-mt-1",children:[Math.round(me),"% complete"]})]})})]})]})]}),x&&e.jsxs("div",{className:`
            p-3 rounded-lg border border-blue-400/30
            ${ra({blur:"sm",opacity:.8}).background}
          `,children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-2",children:[e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Generating Deep Dream..."}),e.jsxs("span",{className:"glass-text-sm glass-font-medium glass-text-primary",children:[Math.round(me),"%"]})]}),e.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:e.jsx(P.div,{className:"glass-surface-blue glass-h-2 glass-radius-full",animate:{width:`${me}%`},transition:Ve?{duration:0}:{duration:_e.DURATION.normal/1e3}})}),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mt-1 glass-text-xs glass-text-primary-glass-opacity-60",children:[e.jsxs("span",{children:["Iteration: ",Ne," / ",t.iterations]}),e.jsxs("span",{children:["Layers: ",t.layers.length]})]})]}),(xe||fe)&&e.jsxs("div",{className:"glass-grid glass-grid-cols-1 lg:glass-grid-cols-2 glass-gap-4",children:[xe&&e.jsx(Qe,{}),fe&&e.jsx(Ze,{})]}),Ie&&e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-pt-4 glass-border-t glass-border-white/10",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[e.jsx("input",{type:"file",accept:"image/*",onChange:a=>{const s=a.target.files?.[0];if(s){const l=URL.createObjectURL(s);Ee(l),L("upload");const r=H.current;if(r){const d=r.getContext("2d");if(d){const n=new Image;n.onload=()=>{d.drawImage(n,0,0,r.width,r.height)},n.src=l}}}},className:"glass-hidden",id:"dream-image-upload"}),e.jsx(P.label,{htmlFor:"dream-image-upload",className:"glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-cursor-pointer glass-transition-colors",whileHover:w?{scale:1.02}:{},whileTap:w?{scale:.98}:{},children:"Upload Image"}),e.jsx(P.button,{className:"glass-px-4 glass-py-2 glass-border glass-border-white/30 hover:glass-border-white/50 glass-text-primary-glass-opacity-80 glass-radius-lg glass-text-sm glass-transition-colors disabled:glass-opacity-50",whileHover:w?{scale:1.02}:{},whileTap:w?{scale:.98}:{},onClick:ue,disabled:x||!f||t.layers.length===0,children:x?"Generating...":"Generate Dream"})]}),k&&e.jsx(P.a,{href:k,download:"deep-dream.png",className:"glass-px-4 glass-py-2 glass-surface-green hover:glass-surface-green glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors",whileHover:w?{scale:1.02}:{},whileTap:w?{scale:.98}:{},children:"Download Dream"})]})]})});le.displayName="GlassDeepDreamGlass";try{le.displayName="GlassDeepDreamGlass",le.__docgenInfo={description:"",displayName:"GlassDeepDreamGlass",props:{imageSource:{defaultValue:null,description:"",name:"imageSource",required:!1,type:{name:"string | undefined"}},availableLayers:{defaultValue:{value:`[
  {
    id: "conv2d_1",
    name: "Early Features",
    description: "Basic edges and textures",
    type: "conv",
    depth: 1,
    features: ["edges", "lines", "basic_shapes"],
    strength: 0.5,
  },
  {
    id: "conv2d_5",
    name: "Texture Patterns",
    description: "Complex textures and patterns",
    type: "conv",
    depth: 5,
    features: ["textures", "patterns", "repetition"],
    strength: 0.7,
  },
  {
    id: "mixed3a",
    name: "Object Parts",
    description: "Parts of objects and shapes",
    type: "inception",
    depth: 10,
    features: ["object_parts", "curves", "complex_shapes"],
    strength: 1.0,
  },
  {
    id: "mixed4a",
    name: "Abstract Objects",
    description: "Abstract object representations",
    type: "inception",
    depth: 15,
    features: ["abstract_objects", "compositions", "spatial_relations"],
    strength: 1.2,
  },
  {
    id: "mixed4d",
    name: "Complex Structures",
    description: "Complex architectural structures",
    type: "inception",
    depth: 18,
    features: ["buildings", "architecture", "complex_structures"],
    strength: 1.5,
  },
  {
    id: "mixed5b",
    name: "High-Level Concepts",
    description: "Abstract concepts and scenes",
    type: "inception",
    depth: 25,
    features: ["scenes", "concepts", "abstract_ideas"],
    strength: 2.0,
  },
]`},description:"",name:"availableLayers",required:!1,type:{name:"NeuralLayer[] | undefined"}},selectedLayers:{defaultValue:{value:'["mixed3a"]'},description:"",name:"selectedLayers",required:!1,type:{name:"string[] | undefined"}},dreamSettings:{defaultValue:{value:"{}"},description:"",name:"dreamSettings",required:!1,type:{name:"Partial<DeepDreamSettings> | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},showHeader:{defaultValue:{value:"!compact"},description:"",name:"showHeader",required:!1,type:{name:"boolean | undefined"}},showActions:{defaultValue:{value:"!compact"},description:"",name:"showActions",required:!1,type:{name:"boolean | undefined"}},showLayerSelector:{defaultValue:{value:"false"},description:"",name:"showLayerSelector",required:!1,type:{name:"boolean | undefined"}},showPreview:{defaultValue:{value:"true"},description:"",name:"showPreview",required:!1,type:{name:"boolean | undefined"}},showSettings:{defaultValue:{value:"false"},description:"",name:"showSettings",required:!1,type:{name:"boolean | undefined"}},enableRealTime:{defaultValue:{value:"false"},description:"",name:"enableRealTime",required:!1,type:{name:"boolean | undefined"}},enableAnimation:{defaultValue:{value:"true"},description:"",name:"enableAnimation",required:!1,type:{name:"boolean | undefined"}},enableTiling:{defaultValue:{value:"true"},description:"",name:"enableTiling",required:!1,type:{name:"boolean | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},canvasWidth:{defaultValue:{value:"800"},description:"",name:"canvasWidth",required:!1,type:{name:"number | undefined"}},canvasHeight:{defaultValue:{value:"600"},description:"",name:"canvasHeight",required:!1,type:{name:"number | undefined"}},onDreamGenerated:{defaultValue:null,description:"",name:"onDreamGenerated",required:!1,type:{name:"((imageUrl: string, settings: DeepDreamSettings) => void) | undefined"}},onLayerActivation:{defaultValue:null,description:"",name:"onLayerActivation",required:!1,type:{name:"((layerId: string, activation: number[]) => void) | undefined"}},onProgress:{defaultValue:null,description:"",name:"onProgress",required:!1,type:{name:"((progress: number, iteration: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const i=[{id:"conv2d_1",name:"Early Features",description:"Basic edges and textures",type:"conv",depth:1,features:["edges","lines","basic_shapes"],strength:.5},{id:"conv2d_5",name:"Texture Patterns",description:"Complex textures and patterns",type:"conv",depth:5,features:["textures","patterns","repetition"],strength:.7},{id:"mixed3a",name:"Object Parts",description:"Parts of objects and shapes",type:"inception",depth:10,features:["object_parts","curves","complex_shapes"],strength:1},{id:"mixed4a",name:"Abstract Objects",description:"Abstract object representations",type:"inception",depth:15,features:["abstract_objects","compositions","spatial_relations"],strength:1.2},{id:"mixed4d",name:"Complex Structures",description:"Complex architectural structures",type:"inception",depth:18,features:["buildings","architecture","complex_structures"],strength:1.5},{id:"mixed5b",name:"High-Level Concepts",description:"Abstract concepts and scenes",type:"inception",depth:25,features:["scenes","concepts","abstract_ideas"],strength:2},{id:"dense_1",name:"Global Features",description:"High-level global representations",type:"dense",depth:30,features:["global_patterns","semantic_meaning","context"],strength:1.8}],fa={title:"AI + Intelligence/Glass Deep Dream Glass",component:le,parameters:{layout:"fullscreen",previewSurface:"app"},tags:["autodocs"],args:{className:"deep-dream-story-card"},argTypes:{canvasWidth:{control:{type:"range",min:400,max:1200,step:50}},canvasHeight:{control:{type:"range",min:300,max:800,step:50}},animationSpeed:{control:{type:"range",min:.1,max:3,step:.1}},showLayerSelector:{control:"boolean"},showPreview:{control:"boolean"},showSettings:{control:"boolean"},enableRealTime:{control:"boolean"},enableAnimation:{control:"boolean"},enableTiling:{control:"boolean"}},decorators:[o=>e.jsxs("div",{"data-bg":"light",className:"glass-on-light",style:{width:"100%",height:"100vh",display:"flex",alignItems:"center",overflowX:"hidden",boxSizing:"border-box",padding:"clamp(16px, 3vw, 32px)",backgroundColor:"#f8fafc",backgroundImage:"linear-gradient(135deg, #f8fafc 0%, #f3f5f7 48%, #e7ebef 100%)",color:"#0f172a"},children:[e.jsx("style",{children:`
          .deep-dream-story-frame,
          .deep-dream-story-frame * {
            box-sizing: border-box;
          }

          .deep-dream-story-card {
            width: 100%;
            max-width: 900px;
            height: calc(100vh - 32px);
            overflow: hidden;
            margin: 0 auto;
            color: #0f172a;
          }

          .deep-dream-story-frame {
            width: 100%;
            overflow: visible;
          }

          .deep-dream-story-card > div:first-child,
          .deep-dream-story-card > div:last-child,
          .deep-dream-story-card > div:last-child > div {
            flex-wrap: wrap;
            gap: 12px;
          }

          .deep-dream-story-card :where(h3, h4, h5, p, span, label, button, a, div) {
            color: #0f172a;
            opacity: 1;
            overflow-wrap: anywhere;
          }

          .deep-dream-story-card :where(input, button, a, label) {
            max-width: 100%;
          }

          .deep-dream-story-card :where(.glass-grid) {
            width: 100%;
            min-width: 0;
          }

          .deep-dream-story-card :where(.lg\\:glass-grid-cols-2, .md\\:glass-grid-cols-2) {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          }

          .deep-dream-story-card canvas {
            max-width: 100%;
          }

          .deep-dream-story-card :where(.glass-aspect-video) {
            min-height: 0;
          }

          .deep-dream-story-card :where(.glass-space-x-4, .glass-space-x-2) {
            flex-wrap: wrap;
            row-gap: 10px;
          }

          .deep-dream-compact > div:nth-last-child(2) {
            grid-template-columns: minmax(0, 1fr);
          }

          .deep-dream-story-card label,
          .deep-dream-story-card button,
          .deep-dream-story-card a {
            white-space: normal;
          }

          .deep-dream-story-card label.glass-surface-blue {
            background: rgba(255, 255, 255, 0.24) !important;
            border: 1px solid rgba(255, 255, 255, 0.32) !important;
            color: rgba(15, 23, 42, 0.85) !important;
          }

          [data-storybook-preview-mode="dark"] .deep-dream-story-card :where(h3, h4, h5, p, button, a, label, span) {
            color: #0f172a !important;
            border-color: rgba(15, 23, 42, 0.18);
          }

          [data-storybook-preview-mode="dark"] .deep-dream-story-card :where(button, a, label, span[class]) {
            background: rgba(255, 255, 255, 0.82) !important;
          }

          [data-storybook-preview-mode="dark"] .deep-dream-story-card :where(.glass-surface-subtle, .glass-surface-primary, .glass-surface-blue, .glass-bg-white, .rounded, [class*="bg-white"], [class*="bg-green"], [class*="bg-purple"], [class*="bg-blue"], [class*="bg-gray"]) {
            background-color: rgba(255, 255, 255, 0.82) !important;
            background: rgba(255, 255, 255, 0.82) !important;
            border-color: rgba(15, 23, 42, 0.18) !important;
          }

          @media (max-width: 640px) {
            .deep-dream-story-card {
              padding: 12px !important;
            }

            .deep-dream-story-card > div:first-child {
              align-items: flex-start;
            }

            .deep-dream-story-card > div:last-child,
            .deep-dream-story-card > div:last-child > div {
              align-items: stretch;
              justify-content: flex-start;
            }

            .deep-dream-story-card :where(.lg\\:glass-grid-cols-2, .md\\:glass-grid-cols-2) {
              grid-template-columns: minmax(0, 1fr);
            }
          }
        `}),e.jsx("div",{className:"deep-dream-story-frame",children:e.jsx(o,{})})]})]},_={args:{compact:!0,availableLayers:i,selectedLayers:["mixed3a"],canvasWidth:640,canvasHeight:360,showLayerSelector:!1,showPreview:!0,showSettings:!1,enableRealTime:!1,enableAnimation:!0,enableTiling:!0,animationSpeed:1,dreamSettings:{iterations:20,learningRate:.01,octaveScale:1.4,octaves:4,maxLoss:10,stepSize:1.5,tileSize:512}}},W={args:{availableLayers:i.filter(o=>o.depth<=5),selectedLayers:["conv2d_1","conv2d_5"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:15,learningRate:.005,stepSize:1}}},C={args:{availableLayers:i.filter(o=>o.depth>=15),selectedLayers:["mixed4d","mixed5b"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:30,learningRate:.02,stepSize:2,octaves:5}}},D={args:{availableLayers:i.filter(o=>o.type==="conv"),selectedLayers:["conv2d_1"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:25,learningRate:.008,stepSize:1.2}}},I={args:{availableLayers:i.filter(o=>o.type==="inception"),selectedLayers:["mixed3a","mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:20,learningRate:.015,stepSize:1.8,octaveScale:1.3}}},O={args:{availableLayers:i.filter(o=>o.type==="dense"),selectedLayers:["dense_1"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:40,learningRate:.025,stepSize:2.5}}},F={args:{availableLayers:i,selectedLayers:["conv2d_1","mixed3a","mixed4d","dense_1"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:35,learningRate:.012,stepSize:1.6,octaves:6}}},q={args:{availableLayers:i,selectedLayers:["mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:80,learningRate:.005,stepSize:.8,octaves:3}}},G={args:{availableLayers:i,selectedLayers:["mixed3a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!0,enableAnimation:!0,dreamSettings:{iterations:8,learningRate:.02,stepSize:2,octaves:2}}},$={args:{availableLayers:i,selectedLayers:["mixed3a","mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:15,learningRate:.08,stepSize:3,octaves:3}}},V={args:{availableLayers:i,selectedLayers:["mixed4d"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:50,learningRate:.001,stepSize:.5,octaves:8}}},E={args:{availableLayers:i,selectedLayers:["mixed3a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:40,learningRate:.01,stepSize:1.5,octaves:8,octaveScale:1.2}}},U={args:{availableLayers:i,selectedLayers:["mixed4d"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:20,learningRate:.02,stepSize:2,octaves:2,octaveScale:1.8}}},B={args:{availableLayers:i,selectedLayers:["conv2d_5"],canvasWidth:600,canvasHeight:400,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!0,enableAnimation:!0,dreamSettings:{iterations:10,learningRate:.015,stepSize:1.5,octaves:3}}},X={args:{availableLayers:i,selectedLayers:["mixed3a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!1,enableTiling:!0,dreamSettings:{iterations:25,learningRate:.01,stepSize:1.5}}},Y={args:{availableLayers:i,selectedLayers:["mixed3a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,animationSpeed:3,dreamSettings:{iterations:15,learningRate:.02,stepSize:2}}},K={args:{availableLayers:i,selectedLayers:["mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,animationSpeed:.3,dreamSettings:{iterations:30,learningRate:.008,stepSize:1.2}}},J={args:{availableLayers:i.slice(0,3),selectedLayers:["mixed3a"],canvasWidth:600,canvasHeight:400,showLayerSelector:!1,showPreview:!0,showSettings:!1,enableRealTime:!1,enableAnimation:!1,dreamSettings:{iterations:20,learningRate:.01,stepSize:1.5}}},Q={args:{availableLayers:i,selectedLayers:["conv2d_1","mixed3a"],canvasWidth:400,canvasHeight:300,showLayerSelector:!0,showPreview:!1,showSettings:!1,enableRealTime:!1,enableAnimation:!1}},Z={args:{availableLayers:i,selectedLayers:["mixed3a"],canvasWidth:400,canvasHeight:300,showLayerSelector:!1,showPreview:!1,showSettings:!0,enableRealTime:!1,enableAnimation:!1,dreamSettings:{iterations:25,learningRate:.015,stepSize:1.8,octaves:4}}},ee={args:{availableLayers:i,selectedLayers:["mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!1,showPreview:!0,showSettings:!1,enableRealTime:!1,enableAnimation:!0}},ae={args:{availableLayers:i,selectedLayers:["mixed3a","mixed4d"],canvasWidth:1200,canvasHeight:800,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:30,learningRate:.008,stepSize:1.2,octaves:5,tileSize:1024}}},se={args:{availableLayers:i,selectedLayers:["conv2d_5"],canvasWidth:400,canvasHeight:300,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!0,enableAnimation:!0,dreamSettings:{iterations:15,learningRate:.02,stepSize:2,tileSize:256}}},te={args:{availableLayers:i,selectedLayers:[],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!1}},re={args:{availableLayers:i,selectedLayers:i.map(o=>o.id),canvasWidth:640,canvasHeight:360,showLayerSelector:!0,showPreview:!1,showSettings:!1,enableRealTime:!1,enableAnimation:!1,className:"deep-dream-story-card deep-dream-compact",dreamSettings:{iterations:24,learningRate:.005,stepSize:1,octaves:4}}},ne={args:{availableLayers:i.map(o=>({...o,strength:o.strength*2})),selectedLayers:["mixed3a","mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:20,learningRate:.025,stepSize:3}}},ie={args:{availableLayers:i.map(o=>({...o,strength:o.strength*.3})),selectedLayers:["mixed4d","mixed5b"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:40,learningRate:.05,stepSize:4}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    compact: true,
    availableLayers: mockNeuralLayers,
    selectedLayers: ["mixed3a"],
    canvasWidth: 640,
    canvasHeight: 360,
    showLayerSelector: false,
    showPreview: true,
    showSettings: false,
    enableRealTime: false,
    enableAnimation: true,
    enableTiling: true,
    animationSpeed: 1.0,
    dreamSettings: {
      iterations: 20,
      learningRate: 0.01,
      octaveScale: 1.4,
      octaves: 4,
      maxLoss: 10.0,
      stepSize: 1.5,
      tileSize: 512
    }
  }
}`,..._.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers.filter(l => l.depth <= 5),
    selectedLayers: ["conv2d_1", "conv2d_5"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    dreamSettings: {
      iterations: 15,
      learningRate: 0.005,
      stepSize: 1.0
    }
  }
}`,...W.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers.filter(l => l.depth >= 15),
    selectedLayers: ["mixed4d", "mixed5b"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    dreamSettings: {
      iterations: 30,
      learningRate: 0.02,
      stepSize: 2.0,
      octaves: 5
    }
  }
}`,...C.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers.filter(l => l.type === "conv"),
    selectedLayers: ["conv2d_1"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    dreamSettings: {
      iterations: 25,
      learningRate: 0.008,
      stepSize: 1.2
    }
  }
}`,...D.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers.filter(l => l.type === "inception"),
    selectedLayers: ["mixed3a", "mixed4a"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    dreamSettings: {
      iterations: 20,
      learningRate: 0.015,
      stepSize: 1.8,
      octaveScale: 1.3
    }
  }
}`,...I.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers.filter(l => l.type === "dense"),
    selectedLayers: ["dense_1"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    dreamSettings: {
      iterations: 40,
      learningRate: 0.025,
      stepSize: 2.5
    }
  }
}`,...O.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ["conv2d_1", "mixed3a", "mixed4d", "dense_1"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    dreamSettings: {
      iterations: 35,
      learningRate: 0.012,
      stepSize: 1.6,
      octaves: 6
    }
  }
}`,...F.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ["mixed4a"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    dreamSettings: {
      iterations: 80,
      learningRate: 0.005,
      stepSize: 0.8,
      octaves: 3
    }
  }
}`,...q.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ["mixed3a"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: true,
    enableAnimation: true,
    dreamSettings: {
      iterations: 8,
      learningRate: 0.02,
      stepSize: 2.0,
      octaves: 2
    }
  }
}`,...G.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ["mixed3a", "mixed4a"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    dreamSettings: {
      iterations: 15,
      learningRate: 0.08,
      stepSize: 3.0,
      octaves: 3
    }
  }
}`,...$.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ["mixed4d"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    dreamSettings: {
      iterations: 50,
      learningRate: 0.001,
      stepSize: 0.5,
      octaves: 8
    }
  }
}`,...V.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ["mixed3a"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    dreamSettings: {
      iterations: 40,
      learningRate: 0.01,
      stepSize: 1.5,
      octaves: 8,
      octaveScale: 1.2
    }
  }
}`,...E.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ["mixed4d"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    dreamSettings: {
      iterations: 20,
      learningRate: 0.02,
      stepSize: 2.0,
      octaves: 2,
      octaveScale: 1.8
    }
  }
}`,...U.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ["conv2d_5"],
    canvasWidth: 600,
    canvasHeight: 400,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: true,
    enableAnimation: true,
    dreamSettings: {
      iterations: 10,
      learningRate: 0.015,
      stepSize: 1.5,
      octaves: 3
    }
  }
}`,...B.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ["mixed3a"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: false,
    enableTiling: true,
    dreamSettings: {
      iterations: 25,
      learningRate: 0.01,
      stepSize: 1.5
    }
  }
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ["mixed3a"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    animationSpeed: 3.0,
    dreamSettings: {
      iterations: 15,
      learningRate: 0.02,
      stepSize: 2.0
    }
  }
}`,...Y.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ["mixed4a"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    animationSpeed: 0.3,
    dreamSettings: {
      iterations: 30,
      learningRate: 0.008,
      stepSize: 1.2
    }
  }
}`,...K.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers.slice(0, 3),
    selectedLayers: ["mixed3a"],
    canvasWidth: 600,
    canvasHeight: 400,
    showLayerSelector: false,
    showPreview: true,
    showSettings: false,
    enableRealTime: false,
    enableAnimation: false,
    dreamSettings: {
      iterations: 20,
      learningRate: 0.01,
      stepSize: 1.5
    }
  }
}`,...J.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ["conv2d_1", "mixed3a"],
    canvasWidth: 400,
    canvasHeight: 300,
    showLayerSelector: true,
    showPreview: false,
    showSettings: false,
    enableRealTime: false,
    enableAnimation: false
  }
}`,...Q.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ["mixed3a"],
    canvasWidth: 400,
    canvasHeight: 300,
    showLayerSelector: false,
    showPreview: false,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: false,
    dreamSettings: {
      iterations: 25,
      learningRate: 0.015,
      stepSize: 1.8,
      octaves: 4
    }
  }
}`,...Z.parameters?.docs?.source}}};ee.parameters={...ee.parameters,docs:{...ee.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ["mixed4a"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: false,
    showPreview: true,
    showSettings: false,
    enableRealTime: false,
    enableAnimation: true
  }
}`,...ee.parameters?.docs?.source}}};ae.parameters={...ae.parameters,docs:{...ae.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ["mixed3a", "mixed4d"],
    canvasWidth: 1200,
    canvasHeight: 800,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    dreamSettings: {
      iterations: 30,
      learningRate: 0.008,
      stepSize: 1.2,
      octaves: 5,
      tileSize: 1024
    }
  }
}`,...ae.parameters?.docs?.source}}};se.parameters={...se.parameters,docs:{...se.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ["conv2d_5"],
    canvasWidth: 400,
    canvasHeight: 300,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: true,
    enableAnimation: true,
    dreamSettings: {
      iterations: 15,
      learningRate: 0.02,
      stepSize: 2.0,
      tileSize: 256
    }
  }
}`,...se.parameters?.docs?.source}}};te.parameters={...te.parameters,docs:{...te.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: [],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: false
  }
}`,...te.parameters?.docs?.source}}};re.parameters={...re.parameters,docs:{...re.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: mockNeuralLayers.map(l => l.id),
    canvasWidth: 640,
    canvasHeight: 360,
    showLayerSelector: true,
    showPreview: false,
    showSettings: false,
    enableRealTime: false,
    enableAnimation: false,
    className: "deep-dream-story-card deep-dream-compact",
    dreamSettings: {
      iterations: 24,
      learningRate: 0.005,
      stepSize: 1.0,
      octaves: 4
    }
  }
}`,...re.parameters?.docs?.source}}};ne.parameters={...ne.parameters,docs:{...ne.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers.map(l => ({
      ...l,
      strength: l.strength * 2
    })),
    selectedLayers: ["mixed3a", "mixed4a"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    dreamSettings: {
      iterations: 20,
      learningRate: 0.025,
      stepSize: 3.0
    }
  }
}`,...ne.parameters?.docs?.source}}};ie.parameters={...ie.parameters,docs:{...ie.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers.map(l => ({
      ...l,
      strength: l.strength * 0.3
    })),
    selectedLayers: ["mixed4d", "mixed5b"],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    dreamSettings: {
      iterations: 40,
      learningRate: 0.05,
      stepSize: 4.0
    }
  }
}`,...ie.parameters?.docs?.source}}};const wa=["Default","EarlyLayers","DeepLayers","ConvolutionalLayers","InceptionLayers","DenseLayers","MultiLayerDream","HighIterations","LowIterations","HighLearningRate","LowLearningRate","ManyOctaves","FewOctaves","RealTimeMode","AnimationDisabled","FastAnimation","SlowAnimation","MinimalInterface","LayerSelectorOnly","SettingsOnly","PreviewOnly","LargeCanvas","SmallCanvas","NoLayersSelected","AllLayersSelected","HighIntensity","LowIntensity"];export{re as AllLayersSelected,X as AnimationDisabled,D as ConvolutionalLayers,C as DeepLayers,_ as Default,O as DenseLayers,W as EarlyLayers,Y as FastAnimation,U as FewOctaves,ne as HighIntensity,q as HighIterations,$ as HighLearningRate,I as InceptionLayers,ae as LargeCanvas,Q as LayerSelectorOnly,ie as LowIntensity,G as LowIterations,V as LowLearningRate,E as ManyOctaves,J as MinimalInterface,F as MultiLayerDream,te as NoLayersSelected,ee as PreviewOnly,B as RealTimeMode,Z as SettingsOnly,K as SlowAnimation,se as SmallCanvas,wa as __namedExportsOrder,fa as default};
