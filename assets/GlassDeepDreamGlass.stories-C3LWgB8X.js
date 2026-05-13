import{r as o,b as ea,d as ve,j as e,m as P}from"./iframe-CWR0-zUi.js";import{u as aa}from"./useMotionPreference-xwiP7vMk.js";import{u as sa}from"./a11y-DSISWsBF.js";import{c as ta}from"./createGlassStyle-BfWnO-qv.js";import{u as ra}from"./soundDesign-BXVLBOn2.js";import{O as na}from"./OptimizedGlassCore-BBTk9mqX.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-D9RQ8fuG.js";const ia=[{id:"conv2d_1",name:"Early Features",description:"Basic edges and textures",type:"conv",depth:1,features:["edges","lines","basic_shapes"],strength:.5},{id:"conv2d_5",name:"Texture Patterns",description:"Complex textures and patterns",type:"conv",depth:5,features:["textures","patterns","repetition"],strength:.7},{id:"mixed3a",name:"Object Parts",description:"Parts of objects and shapes",type:"inception",depth:10,features:["object_parts","curves","complex_shapes"],strength:1},{id:"mixed4a",name:"Abstract Objects",description:"Abstract object representations",type:"inception",depth:15,features:["abstract_objects","compositions","spatial_relations"],strength:1.2},{id:"mixed4d",name:"Complex Structures",description:"Complex architectural structures",type:"inception",depth:18,features:["buildings","architecture","complex_structures"],strength:1.5},{id:"mixed5b",name:"High-Level Concepts",description:"Abstract concepts and scenes",type:"inception",depth:25,features:["scenes","concepts","abstract_ideas"],strength:2}],la={layers:["mixed3a"],iterations:20,learningRate:.01,octaveScale:1.4,octaves:4,maxLoss:10,stepSize:1.5,tileSize:512},oa={"--glass-text-primary":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))","--typography-text-primary":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))","--glass-theme-text":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))",color:"var(--glass-theme-text, rgba(255, 255, 255, 0.95))"},re=o.forwardRef(({imageSource:n,availableLayers:ne=ia,selectedLayers:Me=["mixed3a"],dreamSettings:_e={},compact:f=!1,showHeader:We=!f,showActions:Ie=!f,showLayerSelector:ye=!1,showPreview:De=!0,showSettings:be=!1,enableRealTime:ie=!1,enableAnimation:j=!0,enableTiling:Ce=!0,animationSpeed:xe=1,canvasWidth:fe=800,canvasHeight:we=600,onDreamGenerated:Se,onLayerActivation:Le,onProgress:Re,className:Oe="",...Fe},qe)=>{const Ge=ea(),[b,Ne]=o.useState(!1),[je,Ae]=o.useState(0),[le,Te]=o.useState(0),[w,Ve]=o.useState(n||""),[A,$e]=o.useState(""),[Pe,Ee]=o.useState({}),He=o.useRef(0),[Ue,Be]=o.useState(Ce),[Xe,Ye]=o.useState(j),[t,S]=o.useState({...la,..._e,layers:Me}),oe=o.useRef(null),ce=o.useRef(null),H=o.useRef();sa("glass-deep-dream");const{shouldAnimate:x}=aa(),{play:L}=ra(),ke=o.useCallback((a,s)=>{const{width:i,height:c}=s,d=[];switch(a.type){case"conv":for(let l=0;l<100;l++){const g=Math.floor(Math.random()*i),v=(Math.floor(Math.random()*c)*i+g)*4,u=s.data[v],p=s.data[v+1],h=s.data[v+2],y=Math.tanh((u+p+h)/765-.5)*a.strength;d.push(y)}break;case"inception":for(let l=0;l<50;l++){const g=(Math.random()-.5)*a.strength*2;d.push(Math.tanh(g))}break;default:for(let l=0;l<64;l++)d.push((Math.random()-.5)*a.strength)}return d},[]),ze=o.useCallback((a,s,i)=>{const c=new Uint8ClampedArray(a.data),{width:d,height:l}=a;for(let g=0;g<l;g++)for(let m=0;m<d;m++){const v=(g*d+m)*4;let u=c[v],p=c[v+1],h=c[v+2];switch(s.type){case"conv":const y=m/d-.5,R=g/l-.5,N=Math.sqrt(y*y+R*R),T=Math.sin(N*20)*i*s.strength*50;u=Math.max(0,Math.min(255,u+T)),p=Math.max(0,Math.min(255,p+T)),h=Math.max(0,Math.min(255,h+T));break;case"inception":const me=Math.cos((m+g)*.05)*Math.sin(m*.02),Ze=Math.sin((m+g)*.05)*Math.cos(g*.02),ue=(me+Ze)*i*s.strength*30;u=Math.max(0,Math.min(255,u+ue)),p=Math.max(0,Math.min(255,p+ue*.8)),h=Math.max(0,Math.min(255,h+ue*.6));break;case"dense":const pe=Math.sin(m*.01)*Math.cos(g*.01)*i*s.strength*20;u=Math.max(0,Math.min(255,u*(1+pe/255))),p=Math.max(0,Math.min(255,p*(1+pe/255))),h=Math.max(0,Math.min(255,h*(1+pe/255)));break;default:const he=Math.sin(m*.03)*Math.cos(g*.03)*i*s.strength*15;u=Math.max(0,Math.min(255,u+he)),p=Math.max(0,Math.min(255,p+he)),h=Math.max(0,Math.min(255,h+he))}c[v]=u,c[v+1]=p,c[v+2]=h}return new ImageData(c,d,l)},[]),de=o.useCallback(async()=>{if(!w)return;Ne(!0),Ae(0),Te(0),L("processing");const a=oe.current,s=ce.current;if(!a||!s)return;const i=a.getContext("2d"),c=s.getContext("2d");if(!i||!c)return;const d=new Image;d.onload=async()=>{i.drawImage(d,0,0,a.width,a.height);let l=i.getImageData(0,0,a.width,a.height);for(let m=0;m<t.octaves;m++){const v=Math.pow(t.octaveScale,m);Math.floor(a.width/v),Math.floor(a.height/v);for(let u=0;u<Math.floor(t.iterations/t.octaves);u++){const p=m*Math.floor(t.iterations/t.octaves)+u;Ae(p);const h=p/t.iterations*100;Te(h),Re?.(h,p);for(const y of t.layers){const R=ne.find(N=>N.id===y);if(R){const N=ke(R,l);Ee(me=>({...me,[y]:N})),Le?.(y,N);const T=t.learningRate*t.stepSize;l=ze(l,R,T)}}c.putImageData(l,0,0),await new Promise(y=>setTimeout(y,ve.DURATION.fast/xe))}}const g=s.toDataURL();$e(g),Se?.(g,t),Ne(!1),L("success")},d.src=w},[w,t,ne,ke,ze,xe,Re,Le,Se,L]),ge=o.useCallback(()=>{if(!j||b)return;He.current+=1;const a=ce.current;if(a&&A){const s=a.getContext("2d");if(s){const i=new Image;i.onload=()=>{s.save(),s.globalAlpha=.1,s.translate(a.width/2,a.height/2),s.rotate(He.current*.01),s.drawImage(i,-a.width/2,-a.height/2),s.restore()},i.src=A}}H.current=requestAnimationFrame(ge)},[j,b,A]),Je=o.useCallback(a=>{S(s=>{const i=s.layers.includes(a)?s.layers.filter(c=>c!==a):[...s.layers,a];return{...s,layers:i}}),L("select")},[L]);o.useEffect(()=>{if(!(!j||b))return H.current=requestAnimationFrame(ge),()=>{H.current&&cancelAnimationFrame(H.current)}},[j,b,ge]),o.useEffect(()=>{if(ie&&w){const a=setTimeout(()=>{de()},1e3);return()=>clearTimeout(a)}},[t,ie,w,de]);const Ke=()=>e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Neural Layers"}),e.jsx("div",{className:"glass-space-y-2",children:ne.map(a=>e.jsxs(P.div,{className:`
                p-3 rounded-lg border cursor-pointer transition-all duration-[${ve.DURATION.fast}ms]
                ${t.layers.includes(a.id)?"border-blue-400 bg-blue-400/20":"border-white/20 hover:border-white/40 bg-white/5"}
              `,whileHover:x?{scale:1.01}:{},whileTap:x?{scale:.99}:{},onClick:()=>Je(a.id),children:[e.jsxs("div",{className:"glass-flex glass-items-start glass-justify-between",children:[e.jsxs("div",{className:"glass-flex-1",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-mb-1",children:[e.jsx("h5",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90",children:a.name}),e.jsx("span",{className:`
                      px-2 py-0.5 rounded text-xs font-medium
                      ${a.type==="conv"?"bg-green-500/20 text-green-300":a.type==="inception"?"bg-purple-500/20 text-purple-300":a.type==="dense"?"bg-blue-500/20 text-blue-300":"bg-gray-500/20 text-gray-300"}
                    `,children:a.type})]}),e.jsx("p",{className:"glass-text-xs glass-text-primary-glass-opacity-60 glass-mb-2",children:a.description}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4 glass-text-xs glass-text-primary-glass-opacity-50",children:[e.jsxs("span",{children:["Depth: ",a.depth]}),e.jsxs("span",{children:["Strength: ",a.strength.toFixed(1)]})]}),e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-1 glass-mt-2",children:a.features.slice(0,3).map(s=>e.jsx("span",{className:"glass-px-1.5 glass-py-0.5 glass-surface-subtle/10 glass-text-primary-glass-opacity-60 glass-radius glass-text-xs",children:s.replace("_"," ")},s))})]}),t.layers.includes(a.id)&&e.jsx("div",{className:"glass-text-primary glass-ml-2",children:"✓"})]}),Pe[a.id]&&e.jsx("div",{className:"glass-mt-2 glass-pt-2 glass-border-t glass-border-white/10",children:e.jsx("div",{className:"glass-flex glass-items-center glass-space-x-1",children:Pe[a.id].slice(0,20).map((s,i)=>e.jsx("div",{className:"glass-w-1 glass-surface-blue glass-radius",style:{height:`${Math.abs(s)*10+2}px`,opacity:Math.abs(s)}},i))})})]},a.id))})]}),Qe=()=>e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Dream Settings"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Iterations: ",t.iterations]}),e.jsx("input",{type:"range",min:"5",max:"100",value:t.iterations,onChange:a=>S(s=>({...s,iterations:parseInt(a.target.value)})),"aria-label":`Iterations: ${t.iterations}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Learning Rate: ",t.learningRate.toFixed(3)]}),e.jsx("input",{type:"range",min:"0.001",max:"0.1",step:"0.001",value:t.learningRate,onChange:a=>S(s=>({...s,learningRate:parseFloat(a.target.value)})),"aria-label":`Learning Rate: ${t.learningRate.toFixed(3)}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Octaves: ",t.octaves]}),e.jsx("input",{type:"range",min:"1",max:"8",value:t.octaves,onChange:a=>S(s=>({...s,octaves:parseInt(a.target.value)})),"aria-label":`Octaves: ${t.octaves}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Octave Scale: ",t.octaveScale.toFixed(1)]}),e.jsx("input",{type:"range",min:"1.1",max:"2.0",step:"0.1",value:t.octaveScale,onChange:a=>S(s=>({...s,octaveScale:parseFloat(a.target.value)})),"aria-label":`Octave Scale: ${t.octaveScale.toFixed(1)}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Step Size: ",t.stepSize.toFixed(1)]}),e.jsx("input",{type:"range",min:"0.5",max:"5.0",step:"0.1",value:t.stepSize,onChange:a=>S(s=>({...s,stepSize:parseFloat(a.target.value)})),"aria-label":`Step Size: ${t.stepSize.toFixed(1)}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Max Loss: ",t.maxLoss.toFixed(1)]}),e.jsx("input",{type:"range",min:"1.0",max:"50.0",step:"1.0",value:t.maxLoss,onChange:a=>S(s=>({...s,maxLoss:parseFloat(a.target.value)})),"aria-label":`Max Loss: ${t.maxLoss.toFixed(1)}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[e.jsxs("label",{className:"glass-flex glass-items-center glass-space-x-2 glass-cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:Ue,onChange:a=>Be(a.target.checked),className:"glass-w-4 glass-h-4 glass-radius glass-border-white/30"}),e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Enable Tiling"})]}),e.jsxs("label",{className:"glass-flex glass-items-center glass-space-x-2 glass-cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:Xe,onChange:a=>Ye(a.target.checked),className:"glass-w-4 glass-h-4 glass-radius glass-border-white/30"}),e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Animate Result"})]})]})]});return e.jsxs(na,{ref:qe,variant:"frosted","data-glass-component":!0,style:{...oa,maxHeight:"100%",minWidth:0,height:f?"100%":void 0,overflow:f?"hidden":void 0},className:`glass-deep-dream-glass ${f?"glass-p-3 glass-space-y-3":"glass-p-4 glass-space-y-4"} glass-max-w-full glass-overflow-auto ${Oe}`,...Fe,children:[We&&e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsxs("div",{className:"glass-min-w-0",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary-glass-opacity-90",children:"DeepDream Glass"}),e.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Neural network-powered surreal image generation"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[ie&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),e.jsx("span",{className:"glass-text-xs",children:"Real-time"})]}),b&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-4 glass-h-4 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin"}),e.jsx("span",{className:"glass-text-xs",children:"Dreaming..."})]})]})]}),De&&e.jsxs("div",{className:`glass-grid ${f?"glass-grid-cols-2 glass-gap-3":"glass-grid-cols-1 lg:glass-grid-cols-2 glass-gap-4"}`,style:f?{gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:10}:void 0,children:[e.jsxs("div",{className:"glass-space-y-2",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Original"}),e.jsxs("div",{className:"glass-relative glass-aspect-video glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden",children:[e.jsx("canvas",{ref:oe,width:fe,height:we,className:"glass-w-full glass-h-full glass-object-cover"}),!w&&e.jsx("div",{className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center glass-text-primary-glass-opacity-50",children:e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-2",children:"🖼️"}),e.jsx("p",{children:"No image loaded"})]})})]})]}),e.jsxs("div",{className:"glass-space-y-2",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"DeepDream"}),e.jsxs("div",{className:"glass-relative glass-aspect-video glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden",children:[e.jsx("canvas",{ref:ce,width:fe,height:we,className:"glass-w-full glass-h-full glass-object-cover"}),b&&e.jsx("div",{className:"glass-absolute glass-inset-0 glass-surface-dark/50 glass-flex glass-items-center glass-justify-center",children:e.jsxs("div",{className:"glass-text-center glass-text-primary",children:[e.jsx("div",{className:"glass-w-8 glass-h-8 glass-border-2 glass-border-white glass-border-t-transparent glass-radius-full glass-animate-spin glass-mx-auto glass-mb-2"}),e.jsxs("div",{className:"glass-text-sm",children:["Iteration ",je]}),e.jsxs("div",{className:"glass-text-xs glass-mt-1",children:[Math.round(le),"% complete"]})]})})]})]})]}),b&&e.jsxs("div",{className:`
            p-3 rounded-lg border border-blue-400/30
            ${ta({blur:"sm",opacity:.8}).background}
          `,children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-2",children:[e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Generating Deep Dream..."}),e.jsxs("span",{className:"glass-text-sm glass-font-medium glass-text-primary",children:[Math.round(le),"%"]})]}),e.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:e.jsx(P.div,{className:"glass-surface-blue glass-h-2 glass-radius-full",animate:{width:`${le}%`},transition:Ge?{duration:0}:{duration:ve.DURATION.normal/1e3}})}),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mt-1 glass-text-xs glass-text-primary-glass-opacity-60",children:[e.jsxs("span",{children:["Iteration: ",je," / ",t.iterations]}),e.jsxs("span",{children:["Layers: ",t.layers.length]})]})]}),(ye||be)&&e.jsxs("div",{className:"glass-grid glass-grid-cols-1 lg:glass-grid-cols-2 glass-gap-4",children:[ye&&e.jsx(Ke,{}),be&&e.jsx(Qe,{})]}),Ie&&e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-pt-4 glass-border-t glass-border-white/10",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[e.jsx("input",{type:"file",accept:"image/*",onChange:a=>{const s=a.target.files?.[0];if(s){const i=URL.createObjectURL(s);Ve(i),L("upload");const c=oe.current;if(c){const d=c.getContext("2d");if(d){const l=new Image;l.onload=()=>{d.drawImage(l,0,0,c.width,c.height)},l.src=i}}}},className:"glass-hidden",id:"dream-image-upload"}),e.jsx(P.label,{htmlFor:"dream-image-upload",className:"glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-cursor-pointer glass-transition-colors",whileHover:x?{scale:1.02}:{},whileTap:x?{scale:.98}:{},children:"Upload Image"}),e.jsx(P.button,{className:"glass-px-4 glass-py-2 glass-border glass-border-white/30 hover:glass-border-white/50 glass-text-primary-glass-opacity-80 glass-radius-lg glass-text-sm glass-transition-colors disabled:glass-opacity-50",whileHover:x?{scale:1.02}:{},whileTap:x?{scale:.98}:{},onClick:de,disabled:b||!w||t.layers.length===0,children:b?"Generating...":"Generate Dream"})]}),A&&e.jsx(P.a,{href:A,download:"deep-dream.png",className:"glass-px-4 glass-py-2 glass-surface-green hover:glass-surface-green glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors",whileHover:x?{scale:1.02}:{},whileTap:x?{scale:.98}:{},children:"Download Dream"})]})]})});re.displayName="GlassDeepDreamGlass";try{re.displayName="GlassDeepDreamGlass",re.__docgenInfo={description:"",displayName:"GlassDeepDreamGlass",props:{imageSource:{defaultValue:null,description:"",name:"imageSource",required:!1,type:{name:"string | undefined"}},availableLayers:{defaultValue:{value:`[
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
]`},description:"",name:"availableLayers",required:!1,type:{name:"NeuralLayer[] | undefined"}},selectedLayers:{defaultValue:{value:'["mixed3a"]'},description:"",name:"selectedLayers",required:!1,type:{name:"string[] | undefined"}},dreamSettings:{defaultValue:{value:"{}"},description:"",name:"dreamSettings",required:!1,type:{name:"Partial<DeepDreamSettings> | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},showHeader:{defaultValue:{value:"!compact"},description:"",name:"showHeader",required:!1,type:{name:"boolean | undefined"}},showActions:{defaultValue:{value:"!compact"},description:"",name:"showActions",required:!1,type:{name:"boolean | undefined"}},showLayerSelector:{defaultValue:{value:"false"},description:"",name:"showLayerSelector",required:!1,type:{name:"boolean | undefined"}},showPreview:{defaultValue:{value:"true"},description:"",name:"showPreview",required:!1,type:{name:"boolean | undefined"}},showSettings:{defaultValue:{value:"false"},description:"",name:"showSettings",required:!1,type:{name:"boolean | undefined"}},enableRealTime:{defaultValue:{value:"false"},description:"",name:"enableRealTime",required:!1,type:{name:"boolean | undefined"}},enableAnimation:{defaultValue:{value:"true"},description:"",name:"enableAnimation",required:!1,type:{name:"boolean | undefined"}},enableTiling:{defaultValue:{value:"true"},description:"",name:"enableTiling",required:!1,type:{name:"boolean | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},canvasWidth:{defaultValue:{value:"800"},description:"",name:"canvasWidth",required:!1,type:{name:"number | undefined"}},canvasHeight:{defaultValue:{value:"600"},description:"",name:"canvasHeight",required:!1,type:{name:"number | undefined"}},onDreamGenerated:{defaultValue:null,description:"",name:"onDreamGenerated",required:!1,type:{name:"((imageUrl: string, settings: DeepDreamSettings) => void) | undefined"}},onLayerActivation:{defaultValue:null,description:"",name:"onLayerActivation",required:!1,type:{name:"((layerId: string, activation: number[]) => void) | undefined"}},onProgress:{defaultValue:null,description:"",name:"onProgress",required:!1,type:{name:"((progress: number, iteration: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const r=[{id:"conv2d_1",name:"Early Features",description:"Basic edges and textures",type:"conv",depth:1,features:["edges","lines","basic_shapes"],strength:.5},{id:"conv2d_5",name:"Texture Patterns",description:"Complex textures and patterns",type:"conv",depth:5,features:["textures","patterns","repetition"],strength:.7},{id:"mixed3a",name:"Object Parts",description:"Parts of objects and shapes",type:"inception",depth:10,features:["object_parts","curves","complex_shapes"],strength:1},{id:"mixed4a",name:"Abstract Objects",description:"Abstract object representations",type:"inception",depth:15,features:["abstract_objects","compositions","spatial_relations"],strength:1.2},{id:"mixed4d",name:"Complex Structures",description:"Complex architectural structures",type:"inception",depth:18,features:["buildings","architecture","complex_structures"],strength:1.5},{id:"mixed5b",name:"High-Level Concepts",description:"Abstract concepts and scenes",type:"inception",depth:25,features:["scenes","concepts","abstract_ideas"],strength:2},{id:"dense_1",name:"Global Features",description:"High-level global representations",type:"dense",depth:30,features:["global_patterns","semantic_meaning","context"],strength:1.8}],xa={title:"AI + Intelligence/Glass Deep Dream Glass",component:re,parameters:{layout:"fullscreen",previewSurface:"app"},tags:["autodocs"],args:{className:"deep-dream-story-card"},argTypes:{canvasWidth:{control:{type:"range",min:400,max:1200,step:50}},canvasHeight:{control:{type:"range",min:300,max:800,step:50}},animationSpeed:{control:{type:"range",min:.1,max:3,step:.1}},showLayerSelector:{control:"boolean"},showPreview:{control:"boolean"},showSettings:{control:"boolean"},enableRealTime:{control:"boolean"},enableAnimation:{control:"boolean"},enableTiling:{control:"boolean"}},decorators:[n=>e.jsxs("div",{"data-bg":"light",className:"glass-on-light",style:{width:"100%",minHeight:"100vh",display:"flex",alignItems:"center",overflowX:"hidden",boxSizing:"border-box",padding:"clamp(16px, 3vw, 32px)",backgroundColor:"#f8fafc",backgroundImage:"linear-gradient(135deg, #f8fafc 0%, #e7f0ff 42%, #f4f0ff 100%)",color:"#0f172a"},children:[e.jsx("style",{children:`
          .deep-dream-story-frame,
          .deep-dream-story-frame * {
            box-sizing: border-box;
          }

          .deep-dream-story-card {
            width: 100%;
            max-width: 960px;
            margin: 0 auto;
            color: #0f172a;
          }

          .deep-dream-story-frame {
            width: 100%;
            max-height: min(760px, calc(100vh - 64px));
            overflow: auto;
            border-radius: 20px;
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
            background: #1d4ed8 !important;
            border: 1px solid rgba(30, 64, 175, 0.42) !important;
            color: #ffffff !important;
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
            .deep-dream-story-frame {
              max-height: calc(100vh - 40px);
            }

            .deep-dream-story-card {
              padding: 16px !important;
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
        `}),e.jsx("div",{className:"deep-dream-story-frame",children:e.jsx(n,{})})]})]},k={args:{availableLayers:r,selectedLayers:["mixed3a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,enableTiling:!0,animationSpeed:1,dreamSettings:{iterations:20,learningRate:.01,octaveScale:1.4,octaves:4,maxLoss:10,stepSize:1.5,tileSize:512}}},z={args:{availableLayers:r.filter(n=>n.depth<=5),selectedLayers:["conv2d_1","conv2d_5"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:15,learningRate:.005,stepSize:1}}},M={args:{availableLayers:r.filter(n=>n.depth>=15),selectedLayers:["mixed4d","mixed5b"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:30,learningRate:.02,stepSize:2,octaves:5}}},_={args:{availableLayers:r.filter(n=>n.type==="conv"),selectedLayers:["conv2d_1"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:25,learningRate:.008,stepSize:1.2}}},W={args:{availableLayers:r.filter(n=>n.type==="inception"),selectedLayers:["mixed3a","mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:20,learningRate:.015,stepSize:1.8,octaveScale:1.3}}},I={args:{availableLayers:r.filter(n=>n.type==="dense"),selectedLayers:["dense_1"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:40,learningRate:.025,stepSize:2.5}}},D={args:{availableLayers:r,selectedLayers:["conv2d_1","mixed3a","mixed4d","dense_1"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:35,learningRate:.012,stepSize:1.6,octaves:6}}},C={args:{availableLayers:r,selectedLayers:["mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:80,learningRate:.005,stepSize:.8,octaves:3}}},O={args:{availableLayers:r,selectedLayers:["mixed3a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!0,enableAnimation:!0,dreamSettings:{iterations:8,learningRate:.02,stepSize:2,octaves:2}}},F={args:{availableLayers:r,selectedLayers:["mixed3a","mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:15,learningRate:.08,stepSize:3,octaves:3}}},q={args:{availableLayers:r,selectedLayers:["mixed4d"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:50,learningRate:.001,stepSize:.5,octaves:8}}},G={args:{availableLayers:r,selectedLayers:["mixed3a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:40,learningRate:.01,stepSize:1.5,octaves:8,octaveScale:1.2}}},V={args:{availableLayers:r,selectedLayers:["mixed4d"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:20,learningRate:.02,stepSize:2,octaves:2,octaveScale:1.8}}},$={args:{availableLayers:r,selectedLayers:["conv2d_5"],canvasWidth:600,canvasHeight:400,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!0,enableAnimation:!0,dreamSettings:{iterations:10,learningRate:.015,stepSize:1.5,octaves:3}}},E={args:{availableLayers:r,selectedLayers:["mixed3a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!1,enableTiling:!0,dreamSettings:{iterations:25,learningRate:.01,stepSize:1.5}}},U={args:{availableLayers:r,selectedLayers:["mixed3a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,animationSpeed:3,dreamSettings:{iterations:15,learningRate:.02,stepSize:2}}},B={args:{availableLayers:r,selectedLayers:["mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,animationSpeed:.3,dreamSettings:{iterations:30,learningRate:.008,stepSize:1.2}}},X={args:{availableLayers:r.slice(0,3),selectedLayers:["mixed3a"],canvasWidth:600,canvasHeight:400,showLayerSelector:!1,showPreview:!0,showSettings:!1,enableRealTime:!1,enableAnimation:!1,dreamSettings:{iterations:20,learningRate:.01,stepSize:1.5}}},Y={args:{availableLayers:r,selectedLayers:["conv2d_1","mixed3a"],canvasWidth:400,canvasHeight:300,showLayerSelector:!0,showPreview:!1,showSettings:!1,enableRealTime:!1,enableAnimation:!1}},J={args:{availableLayers:r,selectedLayers:["mixed3a"],canvasWidth:400,canvasHeight:300,showLayerSelector:!1,showPreview:!1,showSettings:!0,enableRealTime:!1,enableAnimation:!1,dreamSettings:{iterations:25,learningRate:.015,stepSize:1.8,octaves:4}}},K={args:{availableLayers:r,selectedLayers:["mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!1,showPreview:!0,showSettings:!1,enableRealTime:!1,enableAnimation:!0}},Q={args:{availableLayers:r,selectedLayers:["mixed3a","mixed4d"],canvasWidth:1200,canvasHeight:800,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:30,learningRate:.008,stepSize:1.2,octaves:5,tileSize:1024}}},Z={args:{availableLayers:r,selectedLayers:["conv2d_5"],canvasWidth:400,canvasHeight:300,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!0,enableAnimation:!0,dreamSettings:{iterations:15,learningRate:.02,stepSize:2,tileSize:256}}},ee={args:{availableLayers:r,selectedLayers:[],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!1}},ae={args:{availableLayers:r,selectedLayers:r.map(n=>n.id),canvasWidth:640,canvasHeight:360,showLayerSelector:!0,showPreview:!1,showSettings:!1,enableRealTime:!1,enableAnimation:!1,className:"deep-dream-story-card deep-dream-compact",dreamSettings:{iterations:24,learningRate:.005,stepSize:1,octaves:4}}},se={args:{availableLayers:r.map(n=>({...n,strength:n.strength*2})),selectedLayers:["mixed3a","mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:20,learningRate:.025,stepSize:3}}},te={args:{availableLayers:r.map(n=>({...n,strength:n.strength*.3})),selectedLayers:["mixed4d","mixed5b"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:40,learningRate:.05,stepSize:4}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
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
}`,...K.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
}`,...Q.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
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
}`,...Z.parameters?.docs?.source}}};ee.parameters={...ee.parameters,docs:{...ee.parameters?.docs,source:{originalSource:`{
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
}`,...ee.parameters?.docs?.source}}};ae.parameters={...ae.parameters,docs:{...ae.parameters?.docs,source:{originalSource:`{
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
}`,...ae.parameters?.docs?.source}}};se.parameters={...se.parameters,docs:{...se.parameters?.docs,source:{originalSource:`{
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
}`,...se.parameters?.docs?.source}}};te.parameters={...te.parameters,docs:{...te.parameters?.docs,source:{originalSource:`{
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
}`,...te.parameters?.docs?.source}}};const fa=["Default","EarlyLayers","DeepLayers","ConvolutionalLayers","InceptionLayers","DenseLayers","MultiLayerDream","HighIterations","LowIterations","HighLearningRate","LowLearningRate","ManyOctaves","FewOctaves","RealTimeMode","AnimationDisabled","FastAnimation","SlowAnimation","MinimalInterface","LayerSelectorOnly","SettingsOnly","PreviewOnly","LargeCanvas","SmallCanvas","NoLayersSelected","AllLayersSelected","HighIntensity","LowIntensity"];export{ae as AllLayersSelected,E as AnimationDisabled,_ as ConvolutionalLayers,M as DeepLayers,k as Default,I as DenseLayers,z as EarlyLayers,U as FastAnimation,V as FewOctaves,se as HighIntensity,C as HighIterations,F as HighLearningRate,W as InceptionLayers,Q as LargeCanvas,Y as LayerSelectorOnly,te as LowIntensity,O as LowIterations,q as LowLearningRate,G as ManyOctaves,X as MinimalInterface,D as MultiLayerDream,ee as NoLayersSelected,K as PreviewOnly,$ as RealTimeMode,J as SettingsOnly,B as SlowAnimation,Z as SmallCanvas,fa as __namedExportsOrder,xa as default};
