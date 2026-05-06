import{r as l,b as Ke,h as Qe,d as pe,j as e,m as T}from"./iframe-C2Py7iTP.js";import{u as Ze}from"./useMotionPreference-vZJsvje4.js";import{c as ea}from"./createGlassStyle-BfWnO-qv.js";import{u as aa}from"./soundDesign-CmJXb3Bf.js";import{O as sa}from"./OptimizedGlassCore-xEcyrF8U.js";import"./preload-helper-PPVm8Dsz.js";const ta=[{id:"conv2d_1",name:"Early Features",description:"Basic edges and textures",type:"conv",depth:1,features:["edges","lines","basic_shapes"],strength:.5},{id:"conv2d_5",name:"Texture Patterns",description:"Complex textures and patterns",type:"conv",depth:5,features:["textures","patterns","repetition"],strength:.7},{id:"mixed3a",name:"Object Parts",description:"Parts of objects and shapes",type:"inception",depth:10,features:["object_parts","curves","complex_shapes"],strength:1},{id:"mixed4a",name:"Abstract Objects",description:"Abstract object representations",type:"inception",depth:15,features:["abstract_objects","compositions","spatial_relations"],strength:1.2},{id:"mixed4d",name:"Complex Structures",description:"Complex architectural structures",type:"inception",depth:18,features:["buildings","architecture","complex_structures"],strength:1.5},{id:"mixed5b",name:"High-Level Concepts",description:"Abstract concepts and scenes",type:"inception",depth:25,features:["scenes","concepts","abstract_ideas"],strength:2}],na={layers:["mixed3a"],iterations:20,learningRate:.01,octaveScale:1.4,octaves:4,maxLoss:10,stepSize:1.5,tileSize:512},te=l.forwardRef(({imageSource:o,availableLayers:ne=ta,selectedLayers:He=["mixed3a"],dreamSettings:Me={},showLayerSelector:ze=!0,showPreview:_e=!0,showSettings:ke=!0,enableRealTime:re=!1,enableAnimation:N=!0,enableTiling:We=!0,animationSpeed:ve=1,canvasWidth:ye=800,canvasHeight:xe=600,onDreamGenerated:be,onLayerActivation:Se,onProgress:we,className:De="",...Ie},Ce)=>{const Oe=Ke(),[x,fe]=l.useState(!1),[Le,Re]=l.useState(0),[ie,Ne]=l.useState(0),[S,Fe]=l.useState(o||""),[j,Ge]=l.useState(""),[je,qe]=l.useState({}),Ae=l.useRef(0),[Ve,Ee]=l.useState(We),[$e,Ue]=l.useState(N),[t,w]=l.useState({...na,...Me,layers:He}),le=l.useRef(null),oe=l.useRef(null),P=l.useRef();Qe("glass-deep-dream");const{shouldAnimate:b}=Ze(),{play:f}=aa(),Te=l.useCallback((a,s)=>{const{width:r,height:c}=s,d=[];switch(a.type){case"conv":for(let i=0;i<100;i++){const g=Math.floor(Math.random()*r),v=(Math.floor(Math.random()*c)*r+g)*4,u=s.data[v],h=s.data[v+1],p=s.data[v+2],y=Math.tanh((u+h+p)/765-.5)*a.strength;d.push(y)}break;case"inception":for(let i=0;i<50;i++){const g=(Math.random()-.5)*a.strength*2;d.push(Math.tanh(g))}break;default:for(let i=0;i<64;i++)d.push((Math.random()-.5)*a.strength)}return d},[]),Pe=l.useCallback((a,s,r)=>{const c=new Uint8ClampedArray(a.data),{width:d,height:i}=a;for(let g=0;g<i;g++)for(let m=0;m<d;m++){const v=(g*d+m)*4;let u=c[v],h=c[v+1],p=c[v+2];switch(s.type){case"conv":const y=m/d-.5,L=g/i-.5,R=Math.sqrt(y*y+L*L),A=Math.sin(R*20)*r*s.strength*50;u=Math.max(0,Math.min(255,u+A)),h=Math.max(0,Math.min(255,h+A)),p=Math.max(0,Math.min(255,p+A));break;case"inception":const ge=Math.cos((m+g)*.05)*Math.sin(m*.02),Je=Math.sin((m+g)*.05)*Math.cos(g*.02),me=(ge+Je)*r*s.strength*30;u=Math.max(0,Math.min(255,u+me)),h=Math.max(0,Math.min(255,h+me*.8)),p=Math.max(0,Math.min(255,p+me*.6));break;case"dense":const ue=Math.sin(m*.01)*Math.cos(g*.01)*r*s.strength*20;u=Math.max(0,Math.min(255,u*(1+ue/255))),h=Math.max(0,Math.min(255,h*(1+ue/255))),p=Math.max(0,Math.min(255,p*(1+ue/255)));break;default:const he=Math.sin(m*.03)*Math.cos(g*.03)*r*s.strength*15;u=Math.max(0,Math.min(255,u+he)),h=Math.max(0,Math.min(255,h+he)),p=Math.max(0,Math.min(255,p+he))}c[v]=u,c[v+1]=h,c[v+2]=p}return new ImageData(c,d,i)},[]),ce=l.useCallback(async()=>{if(!S)return;fe(!0),Re(0),Ne(0),f("processing");const a=le.current,s=oe.current;if(!a||!s)return;const r=a.getContext("2d"),c=s.getContext("2d");if(!r||!c)return;const d=new Image;d.onload=async()=>{r.drawImage(d,0,0,a.width,a.height);let i=r.getImageData(0,0,a.width,a.height);for(let m=0;m<t.octaves;m++){const v=Math.pow(t.octaveScale,m);Math.floor(a.width/v),Math.floor(a.height/v);for(let u=0;u<Math.floor(t.iterations/t.octaves);u++){const h=m*Math.floor(t.iterations/t.octaves)+u;Re(h);const p=h/t.iterations*100;Ne(p),we?.(p,h);for(const y of t.layers){const L=ne.find(R=>R.id===y);if(L){const R=Te(L,i);qe(ge=>({...ge,[y]:R})),Se?.(y,R);const A=t.learningRate*t.stepSize;i=Pe(i,L,A)}}c.putImageData(i,0,0),await new Promise(y=>setTimeout(y,pe.DURATION.fast/ve))}}const g=s.toDataURL();Ge(g),be?.(g,t),fe(!1),f("success")},d.src=S},[S,t,ne,Te,Pe,ve,we,Se,be,f]),de=l.useCallback(()=>{if(!N||x)return;Ae.current+=1;const a=oe.current;if(a&&j){const s=a.getContext("2d");if(s){const r=new Image;r.onload=()=>{s.save(),s.globalAlpha=.1,s.translate(a.width/2,a.height/2),s.rotate(Ae.current*.01),s.drawImage(r,-a.width/2,-a.height/2),s.restore()},r.src=j}}P.current=requestAnimationFrame(de)},[N,x,j]),Be=l.useCallback(a=>{w(s=>{const r=s.layers.includes(a)?s.layers.filter(c=>c!==a):[...s.layers,a];return{...s,layers:r}}),f("select")},[f]);l.useEffect(()=>{if(!(!N||x))return P.current=requestAnimationFrame(de),()=>{P.current&&cancelAnimationFrame(P.current)}},[N,x,de]),l.useEffect(()=>{if(re&&S){const a=setTimeout(()=>{ce()},1e3);return()=>clearTimeout(a)}},[t,re,S,ce]);const Xe=()=>e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Neural Layers"}),e.jsx("div",{className:"glass-space-y-2",children:ne.map(a=>e.jsxs(T.div,{className:`
                p-3 rounded-lg border cursor-pointer transition-all duration-[${pe.DURATION.fast}ms]
                ${t.layers.includes(a.id)?"border-blue-400 bg-blue-400/20":"border-white/20 hover:border-white/40 bg-white/5"}
              `,whileHover:b?{scale:1.01}:{},whileTap:b?{scale:.99}:{},onClick:()=>Be(a.id),children:[e.jsxs("div",{className:"glass-flex glass-items-start glass-justify-between",children:[e.jsxs("div",{className:"glass-flex-1",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-mb-1",children:[e.jsx("h5",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90",children:a.name}),e.jsx("span",{className:`
                      px-2 py-0.5 rounded text-xs font-medium
                      ${a.type==="conv"?"bg-green-500/20 text-green-300":a.type==="inception"?"bg-purple-500/20 text-purple-300":a.type==="dense"?"bg-blue-500/20 text-blue-300":"bg-gray-500/20 text-gray-300"}
                    `,children:a.type})]}),e.jsx("p",{className:"glass-text-xs glass-text-primary-glass-opacity-60 glass-mb-2",children:a.description}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4 glass-text-xs glass-text-primary-glass-opacity-50",children:[e.jsxs("span",{children:["Depth: ",a.depth]}),e.jsxs("span",{children:["Strength: ",a.strength.toFixed(1)]})]}),e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-1 glass-mt-2",children:a.features.slice(0,3).map(s=>e.jsx("span",{className:"glass-px-1.5 glass-py-0.5 glass-surface-subtle/10 glass-text-primary-glass-opacity-60 glass-radius glass-text-xs",children:s.replace("_"," ")},s))})]}),t.layers.includes(a.id)&&e.jsx("div",{className:"glass-text-primary glass-ml-2",children:"✓"})]}),je[a.id]&&e.jsx("div",{className:"glass-mt-2 glass-pt-2 glass-border-t glass-border-white/10",children:e.jsx("div",{className:"glass-flex glass-items-center glass-space-x-1",children:je[a.id].slice(0,20).map((s,r)=>e.jsx("div",{className:"glass-w-1 glass-surface-blue glass-radius",style:{height:`${Math.abs(s)*10+2}px`,opacity:Math.abs(s)}},r))})})]},a.id))})]}),Ye=()=>e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Dream Settings"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Iterations: ",t.iterations]}),e.jsx("input",{type:"range",min:"5",max:"100",value:t.iterations,onChange:a=>w(s=>({...s,iterations:parseInt(a.target.value)})),"aria-label":`Iterations: ${t.iterations}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Learning Rate: ",t.learningRate.toFixed(3)]}),e.jsx("input",{type:"range",min:"0.001",max:"0.1",step:"0.001",value:t.learningRate,onChange:a=>w(s=>({...s,learningRate:parseFloat(a.target.value)})),"aria-label":`Learning Rate: ${t.learningRate.toFixed(3)}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Octaves: ",t.octaves]}),e.jsx("input",{type:"range",min:"1",max:"8",value:t.octaves,onChange:a=>w(s=>({...s,octaves:parseInt(a.target.value)})),"aria-label":`Octaves: ${t.octaves}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Octave Scale: ",t.octaveScale.toFixed(1)]}),e.jsx("input",{type:"range",min:"1.1",max:"2.0",step:"0.1",value:t.octaveScale,onChange:a=>w(s=>({...s,octaveScale:parseFloat(a.target.value)})),"aria-label":`Octave Scale: ${t.octaveScale.toFixed(1)}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Step Size: ",t.stepSize.toFixed(1)]}),e.jsx("input",{type:"range",min:"0.5",max:"5.0",step:"0.1",value:t.stepSize,onChange:a=>w(s=>({...s,stepSize:parseFloat(a.target.value)})),"aria-label":`Step Size: ${t.stepSize.toFixed(1)}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Max Loss: ",t.maxLoss.toFixed(1)]}),e.jsx("input",{type:"range",min:"1.0",max:"50.0",step:"1.0",value:t.maxLoss,onChange:a=>w(s=>({...s,maxLoss:parseFloat(a.target.value)})),"aria-label":`Max Loss: ${t.maxLoss.toFixed(1)}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[e.jsxs("label",{className:"glass-flex glass-items-center glass-space-x-2 glass-cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:Ve,onChange:a=>Ee(a.target.checked),className:"glass-w-4 glass-h-4 glass-radius glass-border-white/30"}),e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Enable Tiling"})]}),e.jsxs("label",{className:"glass-flex glass-items-center glass-space-x-2 glass-cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:$e,onChange:a=>Ue(a.target.checked),className:"glass-w-4 glass-h-4 glass-radius glass-border-white/30"}),e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Animate Result"})]})]})]});return e.jsxs(sa,{ref:Ce,variant:"frosted",className:`p-6 space-y-6 ${De}`,...Ie,children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90",children:"DeepDream Glass"}),e.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Neural network-powered surreal image generation"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[re&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),e.jsx("span",{className:"glass-text-xs",children:"Real-time"})]}),x&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-4 glass-h-4 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin"}),e.jsx("span",{className:"glass-text-xs",children:"Dreaming..."})]})]})]}),_e&&e.jsxs("div",{className:"glass-grid glass-grid-cols-1 lg:glass-grid-cols-2 glass-gap-4",children:[e.jsxs("div",{className:"glass-space-y-2",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Original"}),e.jsxs("div",{className:"glass-relative glass-aspect-video glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden",children:[e.jsx("canvas",{ref:le,width:ye,height:xe,className:"glass-w-full glass-h-full glass-object-cover"}),!S&&e.jsx("div",{className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center glass-text-primary-glass-opacity-50",children:e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-2",children:"🖼️"}),e.jsx("p",{children:"No image loaded"})]})})]})]}),e.jsxs("div",{className:"glass-space-y-2",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"DeepDream"}),e.jsxs("div",{className:"glass-relative glass-aspect-video glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden",children:[e.jsx("canvas",{ref:oe,width:ye,height:xe,className:"glass-w-full glass-h-full glass-object-cover"}),x&&e.jsx("div",{className:"glass-absolute glass-inset-0 glass-surface-dark/50 glass-flex glass-items-center glass-justify-center",children:e.jsxs("div",{className:"glass-text-center glass-text-primary",children:[e.jsx("div",{className:"glass-w-8 glass-h-8 glass-border-2 glass-border-white glass-border-t-transparent glass-radius-full glass-animate-spin glass-mx-auto glass-mb-2"}),e.jsxs("div",{className:"glass-text-sm",children:["Iteration ",Le]}),e.jsxs("div",{className:"glass-text-xs glass-mt-1",children:[Math.round(ie),"% complete"]})]})})]})]})]}),x&&e.jsxs("div",{className:`
            p-3 rounded-lg border border-blue-400/30
            ${ea({blur:"sm",opacity:.8}).background}
          `,children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-2",children:[e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Generating Deep Dream..."}),e.jsxs("span",{className:"glass-text-sm glass-font-medium glass-text-primary",children:[Math.round(ie),"%"]})]}),e.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:e.jsx(T.div,{className:"glass-surface-blue glass-h-2 glass-radius-full",animate:{width:`${ie}%`},transition:Oe?{duration:0}:{duration:pe.DURATION.normal/1e3}})}),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mt-1 glass-text-xs glass-text-primary-glass-opacity-60",children:[e.jsxs("span",{children:["Iteration: ",Le," / ",t.iterations]}),e.jsxs("span",{children:["Layers: ",t.layers.length]})]})]}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 lg:glass-grid-cols-2 glass-gap-6",children:[ze&&e.jsx(Xe,{}),ke&&e.jsx(Ye,{})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-pt-4 glass-border-t glass-border-white/10",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[e.jsx("input",{type:"file",accept:"image/*",onChange:a=>{const s=a.target.files?.[0];if(s){const r=URL.createObjectURL(s);Fe(r),f("upload");const c=le.current;if(c){const d=c.getContext("2d");if(d){const i=new Image;i.onload=()=>{d.drawImage(i,0,0,c.width,c.height)},i.src=r}}}},className:"glass-hidden",id:"dream-image-upload"}),e.jsx(T.label,{htmlFor:"dream-image-upload",className:"glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-cursor-pointer glass-transition-colors",whileHover:b?{scale:1.02}:{},whileTap:b?{scale:.98}:{},children:"Upload Image"}),e.jsx(T.button,{className:"glass-px-4 glass-py-2 glass-border glass-border-white/30 hover:glass-border-white/50 glass-text-primary-glass-opacity-80 glass-radius-lg glass-text-sm glass-transition-colors disabled:glass-opacity-50",whileHover:b?{scale:1.02}:{},whileTap:b?{scale:.98}:{},onClick:ce,disabled:x||!S||t.layers.length===0,children:x?"Generating...":"Generate Dream"})]}),j&&e.jsx(T.a,{href:j,download:"deep-dream.png",className:"glass-px-4 glass-py-2 glass-surface-green hover:glass-surface-green glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors",whileHover:b?{scale:1.02}:{},whileTap:b?{scale:.98}:{},children:"Download Dream"})]})]})});te.displayName="GlassDeepDreamGlass";try{te.displayName="GlassDeepDreamGlass",te.__docgenInfo={description:"",displayName:"GlassDeepDreamGlass",props:{imageSource:{defaultValue:null,description:"",name:"imageSource",required:!1,type:{name:"string | undefined"}},availableLayers:{defaultValue:{value:`[
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
]`},description:"",name:"availableLayers",required:!1,type:{name:"NeuralLayer[] | undefined"}},selectedLayers:{defaultValue:{value:'["mixed3a"]'},description:"",name:"selectedLayers",required:!1,type:{name:"string[] | undefined"}},dreamSettings:{defaultValue:{value:"{}"},description:"",name:"dreamSettings",required:!1,type:{name:"Partial<DeepDreamSettings> | undefined"}},showLayerSelector:{defaultValue:{value:"true"},description:"",name:"showLayerSelector",required:!1,type:{name:"boolean | undefined"}},showPreview:{defaultValue:{value:"true"},description:"",name:"showPreview",required:!1,type:{name:"boolean | undefined"}},showSettings:{defaultValue:{value:"true"},description:"",name:"showSettings",required:!1,type:{name:"boolean | undefined"}},enableRealTime:{defaultValue:{value:"false"},description:"",name:"enableRealTime",required:!1,type:{name:"boolean | undefined"}},enableAnimation:{defaultValue:{value:"true"},description:"",name:"enableAnimation",required:!1,type:{name:"boolean | undefined"}},enableTiling:{defaultValue:{value:"true"},description:"",name:"enableTiling",required:!1,type:{name:"boolean | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},canvasWidth:{defaultValue:{value:"800"},description:"",name:"canvasWidth",required:!1,type:{name:"number | undefined"}},canvasHeight:{defaultValue:{value:"600"},description:"",name:"canvasHeight",required:!1,type:{name:"number | undefined"}},onDreamGenerated:{defaultValue:null,description:"",name:"onDreamGenerated",required:!1,type:{name:"((imageUrl: string, settings: DeepDreamSettings) => void) | undefined"}},onLayerActivation:{defaultValue:null,description:"",name:"onLayerActivation",required:!1,type:{name:"((layerId: string, activation: number[]) => void) | undefined"}},onProgress:{defaultValue:null,description:"",name:"onProgress",required:!1,type:{name:"((progress: number, iteration: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const n=[{id:"conv2d_1",name:"Early Features",description:"Basic edges and textures",type:"conv",depth:1,features:["edges","lines","basic_shapes"],strength:.5},{id:"conv2d_5",name:"Texture Patterns",description:"Complex textures and patterns",type:"conv",depth:5,features:["textures","patterns","repetition"],strength:.7},{id:"mixed3a",name:"Object Parts",description:"Parts of objects and shapes",type:"inception",depth:10,features:["object_parts","curves","complex_shapes"],strength:1},{id:"mixed4a",name:"Abstract Objects",description:"Abstract object representations",type:"inception",depth:15,features:["abstract_objects","compositions","spatial_relations"],strength:1.2},{id:"mixed4d",name:"Complex Structures",description:"Complex architectural structures",type:"inception",depth:18,features:["buildings","architecture","complex_structures"],strength:1.5},{id:"mixed5b",name:"High-Level Concepts",description:"Abstract concepts and scenes",type:"inception",depth:25,features:["scenes","concepts","abstract_ideas"],strength:2},{id:"dense_1",name:"Global Features",description:"High-level global representations",type:"dense",depth:30,features:["global_patterns","semantic_meaning","context"],strength:1.8}],ua={title:"Glass UI/AI/GlassDeepDreamGlass",component:te,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{canvasWidth:{control:{type:"range",min:400,max:1200,step:50}},canvasHeight:{control:{type:"range",min:300,max:800,step:50}},animationSpeed:{control:{type:"range",min:.1,max:3,step:.1}},showLayerSelector:{control:"boolean"},showPreview:{control:"boolean"},showSettings:{control:"boolean"},enableRealTime:{control:"boolean"},enableAnimation:{control:"boolean"},enableTiling:{control:"boolean"}}},H={args:{availableLayers:n,selectedLayers:["mixed3a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,enableTiling:!0,animationSpeed:1,dreamSettings:{iterations:20,learningRate:.01,octaveScale:1.4,octaves:4,maxLoss:10,stepSize:1.5,tileSize:512}}},M={args:{availableLayers:n.filter(o=>o.depth<=5),selectedLayers:["conv2d_1","conv2d_5"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:15,learningRate:.005,stepSize:1}}},z={args:{availableLayers:n.filter(o=>o.depth>=15),selectedLayers:["mixed4d","mixed5b"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:30,learningRate:.02,stepSize:2,octaves:5}}},_={args:{availableLayers:n.filter(o=>o.type==="conv"),selectedLayers:["conv2d_1"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:25,learningRate:.008,stepSize:1.2}}},k={args:{availableLayers:n.filter(o=>o.type==="inception"),selectedLayers:["mixed3a","mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:20,learningRate:.015,stepSize:1.8,octaveScale:1.3}}},W={args:{availableLayers:n.filter(o=>o.type==="dense"),selectedLayers:["dense_1"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:40,learningRate:.025,stepSize:2.5}}},D={args:{availableLayers:n,selectedLayers:["conv2d_1","mixed3a","mixed4d","dense_1"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:35,learningRate:.012,stepSize:1.6,octaves:6}}},I={args:{availableLayers:n,selectedLayers:["mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:80,learningRate:.005,stepSize:.8,octaves:3}}},C={args:{availableLayers:n,selectedLayers:["mixed3a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!0,enableAnimation:!0,dreamSettings:{iterations:8,learningRate:.02,stepSize:2,octaves:2}}},O={args:{availableLayers:n,selectedLayers:["mixed3a","mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:15,learningRate:.08,stepSize:3,octaves:3}}},F={args:{availableLayers:n,selectedLayers:["mixed4d"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:50,learningRate:.001,stepSize:.5,octaves:8}}},G={args:{availableLayers:n,selectedLayers:["mixed3a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:40,learningRate:.01,stepSize:1.5,octaves:8,octaveScale:1.2}}},q={args:{availableLayers:n,selectedLayers:["mixed4d"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:20,learningRate:.02,stepSize:2,octaves:2,octaveScale:1.8}}},V={args:{availableLayers:n,selectedLayers:["conv2d_5"],canvasWidth:600,canvasHeight:400,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!0,enableAnimation:!0,dreamSettings:{iterations:10,learningRate:.015,stepSize:1.5,octaves:3}}},E={args:{availableLayers:n,selectedLayers:["mixed3a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!1,enableTiling:!0,dreamSettings:{iterations:25,learningRate:.01,stepSize:1.5}}},$={args:{availableLayers:n,selectedLayers:["mixed3a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,animationSpeed:3,dreamSettings:{iterations:15,learningRate:.02,stepSize:2}}},U={args:{availableLayers:n,selectedLayers:["mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,animationSpeed:.3,dreamSettings:{iterations:30,learningRate:.008,stepSize:1.2}}},B={args:{availableLayers:n.slice(0,3),selectedLayers:["mixed3a"],canvasWidth:600,canvasHeight:400,showLayerSelector:!1,showPreview:!0,showSettings:!1,enableRealTime:!1,enableAnimation:!1,dreamSettings:{iterations:20,learningRate:.01,stepSize:1.5}}},X={args:{availableLayers:n,selectedLayers:["conv2d_1","mixed3a"],canvasWidth:400,canvasHeight:300,showLayerSelector:!0,showPreview:!1,showSettings:!1,enableRealTime:!1,enableAnimation:!1}},Y={args:{availableLayers:n,selectedLayers:["mixed3a"],canvasWidth:400,canvasHeight:300,showLayerSelector:!1,showPreview:!1,showSettings:!0,enableRealTime:!1,enableAnimation:!1,dreamSettings:{iterations:25,learningRate:.015,stepSize:1.8,octaves:4}}},J={args:{availableLayers:n,selectedLayers:["mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!1,showPreview:!0,showSettings:!1,enableRealTime:!1,enableAnimation:!0}},K={args:{availableLayers:n,selectedLayers:["mixed3a","mixed4d"],canvasWidth:1200,canvasHeight:800,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:30,learningRate:.008,stepSize:1.2,octaves:5,tileSize:1024}}},Q={args:{availableLayers:n,selectedLayers:["conv2d_5"],canvasWidth:400,canvasHeight:300,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!0,enableAnimation:!0,dreamSettings:{iterations:15,learningRate:.02,stepSize:2,tileSize:256}}},Z={args:{availableLayers:n,selectedLayers:[],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!1}},ee={args:{availableLayers:n,selectedLayers:n.map(o=>o.id),canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:50,learningRate:.005,stepSize:1,octaves:6}}},ae={args:{availableLayers:n.map(o=>({...o,strength:o.strength*2})),selectedLayers:["mixed3a","mixed4a"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:20,learningRate:.025,stepSize:3}}},se={args:{availableLayers:n.map(o=>({...o,strength:o.strength*.3})),selectedLayers:["mixed4d","mixed5b"],canvasWidth:800,canvasHeight:600,showLayerSelector:!0,showPreview:!0,showSettings:!0,enableRealTime:!1,enableAnimation:!0,dreamSettings:{iterations:40,learningRate:.05,stepSize:4}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['mixed3a'],
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
}`,...H.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers.filter(l => l.depth <= 5),
    selectedLayers: ['conv2d_1', 'conv2d_5'],
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
}`,...M.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers.filter(l => l.depth >= 15),
    selectedLayers: ['mixed4d', 'mixed5b'],
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
}`,...z.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers.filter(l => l.type === 'conv'),
    selectedLayers: ['conv2d_1'],
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
}`,..._.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers.filter(l => l.type === 'inception'),
    selectedLayers: ['mixed3a', 'mixed4a'],
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
}`,...k.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers.filter(l => l.type === 'dense'),
    selectedLayers: ['dense_1'],
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
}`,...W.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['conv2d_1', 'mixed3a', 'mixed4d', 'dense_1'],
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
}`,...D.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['mixed4a'],
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
}`,...I.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['mixed3a'],
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
}`,...C.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['mixed3a', 'mixed4a'],
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
}`,...O.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['mixed4d'],
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
}`,...F.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['mixed3a'],
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
}`,...G.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['mixed4d'],
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
}`,...q.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['conv2d_5'],
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
}`,...V.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['mixed3a'],
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
}`,...E.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['mixed3a'],
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
}`,...$.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['mixed4a'],
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
}`,...U.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers.slice(0, 3),
    selectedLayers: ['mixed3a'],
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
}`,...B.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['conv2d_1', 'mixed3a'],
    canvasWidth: 400,
    canvasHeight: 300,
    showLayerSelector: true,
    showPreview: false,
    showSettings: false,
    enableRealTime: false,
    enableAnimation: false
  }
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['mixed3a'],
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
}`,...Y.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['mixed4a'],
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: false,
    showPreview: true,
    showSettings: false,
    enableRealTime: false,
    enableAnimation: true
  }
}`,...J.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['mixed3a', 'mixed4d'],
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
}`,...K.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: ['conv2d_5'],
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
}`,...Q.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
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
}`,...Z.parameters?.docs?.source}}};ee.parameters={...ee.parameters,docs:{...ee.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers,
    selectedLayers: mockNeuralLayers.map(l => l.id),
    canvasWidth: 800,
    canvasHeight: 600,
    showLayerSelector: true,
    showPreview: true,
    showSettings: true,
    enableRealTime: false,
    enableAnimation: true,
    dreamSettings: {
      iterations: 50,
      learningRate: 0.005,
      stepSize: 1.0,
      octaves: 6
    }
  }
}`,...ee.parameters?.docs?.source}}};ae.parameters={...ae.parameters,docs:{...ae.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers.map(l => ({
      ...l,
      strength: l.strength * 2
    })),
    selectedLayers: ['mixed3a', 'mixed4a'],
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
}`,...ae.parameters?.docs?.source}}};se.parameters={...se.parameters,docs:{...se.parameters?.docs,source:{originalSource:`{
  args: {
    availableLayers: mockNeuralLayers.map(l => ({
      ...l,
      strength: l.strength * 0.3
    })),
    selectedLayers: ['mixed4d', 'mixed5b'],
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
}`,...se.parameters?.docs?.source}}};const ha=["Default","EarlyLayers","DeepLayers","ConvolutionalLayers","InceptionLayers","DenseLayers","MultiLayerDream","HighIterations","LowIterations","HighLearningRate","LowLearningRate","ManyOctaves","FewOctaves","RealTimeMode","AnimationDisabled","FastAnimation","SlowAnimation","MinimalInterface","LayerSelectorOnly","SettingsOnly","PreviewOnly","LargeCanvas","SmallCanvas","NoLayersSelected","AllLayersSelected","HighIntensity","LowIntensity"];export{ee as AllLayersSelected,E as AnimationDisabled,_ as ConvolutionalLayers,z as DeepLayers,H as Default,W as DenseLayers,M as EarlyLayers,$ as FastAnimation,q as FewOctaves,ae as HighIntensity,I as HighIterations,O as HighLearningRate,k as InceptionLayers,K as LargeCanvas,X as LayerSelectorOnly,se as LowIntensity,C as LowIterations,F as LowLearningRate,G as ManyOctaves,B as MinimalInterface,D as MultiLayerDream,Z as NoLayersSelected,J as PreviewOnly,V as RealTimeMode,Y as SettingsOnly,U as SlowAnimation,Q as SmallCanvas,ha as __namedExportsOrder,ua as default};
