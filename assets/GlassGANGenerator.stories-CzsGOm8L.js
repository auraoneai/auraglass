import{r as d,b as Be,h as Ee,d as L,j as e,m as N}from"./iframe-mbNquNNc.js";import{u as Qe}from"./useMotionPreference-C8qnB4_e.js";import{c as Ge}from"./createGlassStyle-BfWnO-qv.js";import{u as Ze}from"./soundDesign-BPz1bpjX.js";import{O as Je}from"./OptimizedGlassCore-CPvpl-y1.js";import"./preload-helper-PPVm8Dsz.js";const Ke=[{id:"stylegan2-faces",name:"StyleGAN2 Faces",description:"High-quality human face generation",type:"stylegan",category:"faces",resolution:1024,latentDim:512,trained:!0},{id:"dcgan-art",name:"DCGAN Art",description:"Abstract art generation",type:"dcgan",category:"art",resolution:256,latentDim:100,trained:!0},{id:"biggan-objects",name:"BigGAN Objects",description:"Conditional object generation",type:"biggan",category:"objects",resolution:512,latentDim:128,trained:!0},{id:"cyclegan-style",name:"CycleGAN Style Transfer",description:"Unpaired image-to-image translation",type:"cyclegan",category:"style_transfer",resolution:256,latentDim:256,trained:!0},{id:"progressive-landscapes",name:"Progressive Landscapes",description:"Landscape scene generation",type:"progressive",category:"landscapes",resolution:512,latentDim:256,trained:!0},{id:"stylegan3-general",name:"StyleGAN3 General",description:"General purpose image generation",type:"stylegan",category:"general",resolution:512,latentDim:512,trained:!1}],Xe={seed:42,truncation:.7,styleStrength:1,noiseStrength:.5,batchSize:4,interpolationSteps:10},Ye={epochs:100,batchSize:32,learningRate:2e-4,beta1:.5,beta2:.999,discriminatorSteps:1,generatorSteps:1},te=d.forwardRef(({availableModels:s=Ke,selectedModel:ve="stylegan2-faces",generationParams:Ne={},trainingConfig:je={},showModelSelector:Ce=!0,showGenerationControls:Ae=!0,showTrainingControls:de=!0,showLatentSpace:Pe=!0,showProgress:Ie=!0,enableInterpolation:ge=!0,enableRealTime:ne=!1,maxGenerations:C=16,canvasWidth:ea=256,canvasHeight:aa=256,onModelSelect:me,onGenerate:ue,onTrainingProgress:pe,className:Le="",...Te},ze)=>{const re=Be(),[v,he]=d.useState(!1),[A,fe]=d.useState(!1),[j,ke]=d.useState(ve),[oe,De]=d.useState([]),[y,Re]=d.useState([]),[le,He]=d.useState({epoch:0,generatorLoss:0,discriminatorLoss:0}),[be,qe]=d.useState([]),[ye,ie]=d.useState(0),[g,P]=d.useState({...Xe,...Ne}),[xe,sa]=d.useState({...Ye,...je});d.useRef([]);const Se=d.useRef(null);d.useRef(null),Ee("glass-gan-generator");const{shouldAnimate:w}=Qe(),{play:M}=Ze(),h=s.find(a=>a.id===j)||s[0],we=d.useCallback(a=>Array.from({length:a},()=>(Math.random()-.5)*2),[]),I=d.useCallback((a,t,m)=>{const r=document.createElement("canvas");r.width=t.resolution,r.height=t.resolution;const p=r.getContext("2d");if(!p)return"";const S=p.createImageData(r.width,r.height),n=S.data;switch(t.type){case"stylegan":for(let c=0;c<r.height;c++)for(let l=0;l<r.width;l++){const o=(c*r.width+l)*4,f=a.slice(0,8).reduce((u,x)=>u+x,0)/8,b=(l/r.width-.5)*2,G=(c/r.height-.5)*2;if(t.category==="faces"){const u=Math.exp(-(b*b+G*G*.8)*2),x=Math.sin(b*10)*Math.cos(G*10)*.1;n[o]=Math.floor((.8+f*.2+x)*u*255),n[o+1]=Math.floor((.7+f*.3+x)*u*255),n[o+2]=Math.floor((.6+f*.4+x)*u*255),n[o+3]=255}else{const u=Math.sin(b*5+f)*Math.cos(G*5+f);n[o]=Math.floor((u+1)*128),n[o+1]=Math.floor((Math.sin(u*2)+1)*128),n[o+2]=Math.floor((Math.cos(u*3)+1)*128),n[o+3]=255}}break;case"dcgan":for(let c=0;c<r.height;c++)for(let l=0;l<r.width;l++){const o=(c*r.width+l)*4,b=.02*(1+a.slice(0,5).reduce((_e,$e)=>_e+$e,0)*.1),G=Math.sin(l*b)*Math.cos(c*b),u=Math.sin((l+c)*b*.8),x=Math.cos((l-c)*b*1.2);n[o]=Math.floor((G+1)*128),n[o+1]=Math.floor((u+1)*128),n[o+2]=Math.floor((x+1)*128),n[o+3]=255}break;case"biggan":for(let c=0;c<r.height;c++)for(let l=0;l<r.width;l++){const o=(c*r.width+l)*4,f=a.slice(-10),b=Math.floor(Math.abs(f[0])*10),u=[[255,100,100],[100,255,100],[100,100,255],[255,255,100],[255,100,255],[100,255,255],[200,150,100],[150,100,200],[100,200,150],[180,180,180]][b]||[128,128,128],x=(Math.random()-.5)*50;n[o]=Math.max(0,Math.min(255,u[0]+x)),n[o+1]=Math.max(0,Math.min(255,u[1]+x)),n[o+2]=Math.max(0,Math.min(255,u[2]+x)),n[o+3]=255}break;default:for(let c=0;c<r.height;c++)for(let l=0;l<r.width;l++){const o=(c*r.width+l)*4,f=a.slice(0,3).reduce((b,G,u)=>b+G*Math.sin((l+c)*.01*(u+1)),0);n[o]=Math.floor((Math.sin(f)+1)*128),n[o+1]=Math.floor((Math.cos(f*1.1)+1)*128),n[o+2]=Math.floor((Math.sin(f*.9)+1)*128),n[o+3]=255}}return p.putImageData(S,0,0),r.toDataURL()},[]),ce=d.useCallback(async()=>{if(!h.trained){M("error");return}he(!0),ie(0),M("processing");const a=[],t=[];for(let m=0;m<g.batchSize;m++){ie(m/g.batchSize*100);const p=we(h.latentDim).map(n=>n*g.truncation),S=I(p,h,g.seed+m);a.push(S),t.push(p),await new Promise(n=>setTimeout(n,L.DURATION.fast*1.3))}De(m=>[...a,...m].slice(0,C)),Re(m=>[...t,...m].slice(0,C)),ie(100),ue?.(a,g),he(!1),M("success")},[h,g,we,I,C,ue,M]),Ve=d.useCallback(async()=>{if(y.length<2)return;const a=y[0],t=y[1],m=g.interpolationSteps,r=[];for(let p=0;p<=m;p++){const S=p/m,n=a.map((l,o)=>l*(1-S)+t[o]*S),c=I(n,h,g.seed);r.push(c)}qe(r)},[y,g.interpolationSteps,g.seed,I,h]),We=d.useCallback(async()=>{if(!h)return;fe(!0),M("processing");for(let t=0;t<xe.epochs;t++){const m=1+Math.random()*.5-t*.01,r=.8+Math.random()*.3-t*.005;He({epoch:t+1,generatorLoss:Math.max(.1,m),discriminatorLoss:Math.max(.1,r)}),pe?.(t+1,{generator:m,discriminator:r}),await new Promise(p=>setTimeout(p,L.DURATION.fast))}const a=s.findIndex(t=>t.id===j);a!==-1&&(s[a].trained=!0),fe(!1),M("success")},[h,xe.epochs,j,s,pe,M]),Me=d.useCallback(()=>{const a=Se.current;if(!a||y.length===0)return;const t=a.getContext("2d");t&&(t.clearRect(0,0,a.width,a.height),y.slice(0,10).forEach((m,r)=>{const p=(m[0]+2)/4*a.width,S=(m[1]+2)/4*a.height;t.fillStyle=`hsl(${r*36}, 70%, 60%)`,t.beginPath(),t.arc(p,S,5,0,Math.PI*2),t.fill(),y.slice(r+1,10).forEach((n,c)=>{const l=Math.sqrt(Math.pow(m[0]-n[0],2)+Math.pow(m[1]-n[1],2));if(l<1){const o=(n[0]+2)/4*a.width,f=(n[1]+2)/4*a.height;t.strokeStyle=`color-mix(in srgb, var(--glass-white) ${30*(1-l)}%, transparent)`,t.lineWidth=1,t.beginPath(),t.moveTo(p,S),t.lineTo(o,f),t.stroke()}})}))},[y]),Fe=d.useCallback(a=>{ke(a),me?.(a),M("select")},[me,M]);d.useEffect(()=>{if(ne&&h.trained){const a=setInterval(()=>{v||ce()},5e3);return()=>clearInterval(a)}},[ne,h.trained,v,ce]),d.useEffect(()=>{Me()},[y,Me]);const Ue=()=>e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"GAN Models"}),e.jsx("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-3",children:s.map(a=>e.jsx(N.div,{className:`
                p-3 rounded-lg border cursor-pointer transition-all duration-[${L.DURATION.fast}ms]
                ${j===a.id?"border-blue-400 bg-blue-400/20":"border-white/20 hover:border-white/40 bg-white/5"}
              `,whileHover:w?{scale:1.01}:{},whileTap:w?{scale:.99}:{},onClick:()=>Fe(a.id),children:e.jsxs("div",{className:"glass-flex glass-items-start glass-justify-between",children:[e.jsxs("div",{className:"glass-flex-1",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-mb-1",children:[e.jsx("h5",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90",children:a.name}),a.trained?e.jsx("span",{className:"glass-px-2 glass-py-0.5 glass-surface-green/20 glass-text-secondary glass-radius glass-text-xs glass-font-medium",children:"Trained"}):e.jsx("span",{className:"glass-px-2 glass-py-0.5 glass-surface-primary/20 glass-text-secondary glass-radius glass-text-xs glass-font-medium",children:"Untrained"})]}),e.jsx("p",{className:"glass-text-xs glass-text-primary-glass-opacity-60 glass-mb-2",children:a.description}),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4 glass-text-xs glass-text-primary-glass-opacity-50",children:[e.jsxs("span",{children:[a.resolution,"px"]}),e.jsxs("span",{children:["Z:",a.latentDim]})]}),e.jsx("span",{className:`
                      px-2 py-0.5 rounded text-xs font-medium
                      ${a.type==="stylegan"?"bg-purple-500/20 text-purple-300":a.type==="dcgan"?"bg-blue-500/20 text-blue-300":a.type==="biggan"?"bg-green-500/20 text-green-300":a.type==="cyclegan"?"bg-red-500/20 text-red-300":"bg-gray-500/20 text-gray-300"}
                    `,children:a.type.toUpperCase()})]})]}),j===a.id&&e.jsx("div",{className:"glass-text-primary glass-ml-2",children:"✓"})]})},a.id))})]}),Oe=()=>e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Generation Parameters"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Seed: ",g.seed]}),e.jsx("input",{type:"range",min:"0",max:"1000",value:g.seed,onChange:a=>P(t=>({...t,seed:parseInt(a.target.value)})),"aria-label":`Seed: ${g.seed}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Truncation: ",g.truncation.toFixed(2)]}),e.jsx("input",{type:"range",min:"0.1",max:"2.0",step:"0.1",value:g.truncation,onChange:a=>P(t=>({...t,truncation:parseFloat(a.target.value)})),"aria-label":`Truncation: ${g.truncation.toFixed(2)}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Style Strength: ",g.styleStrength.toFixed(2)]}),e.jsx("input",{type:"range",min:"0.0",max:"2.0",step:"0.1",value:g.styleStrength,onChange:a=>P(t=>({...t,styleStrength:parseFloat(a.target.value)})),"aria-label":`Style Strength: ${g.styleStrength.toFixed(2)}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Batch Size: ",g.batchSize]}),e.jsx("input",{type:"range",min:"1",max:"8",value:g.batchSize,onChange:a=>P(t=>({...t,batchSize:parseInt(a.target.value)})),"aria-label":`Batch Size: ${g.batchSize}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]})]})]});return e.jsxs(Je,{ref:ze,variant:"frosted",className:`p-6 space-y-6 ${Le}`,...Te,children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90",children:"GAN Generator"}),e.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Generative Adversarial Networks for image synthesis"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[ne&&h.trained&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),e.jsx("span",{className:"glass-text-xs",children:"Auto-gen"})]}),v&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-4 glass-h-4 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin"}),e.jsx("span",{className:"glass-text-xs",children:"Generating..."})]}),A&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-4 glass-h-4 glass-border-2 glass-border-orange-400 glass-border-t-transparent glass-radius-full glass-animate-spin"}),e.jsx("span",{className:"glass-text-xs",children:"Training..."})]})]})]}),oe.length>0&&e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Generated Images"}),e.jsx("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-4 lg:glass-grid-cols-6 glass-gap-3",children:oe.slice(0,C).map((a,t)=>e.jsxs(N.div,{className:"glass-relative glass-aspect-square glass-radius-lg glass-overflow-hidden glass-surface-subtle/10 glass-group glass-cursor-pointer",whileHover:w?{scale:1.05}:{},initial:{opacity:0,scale:.8},animate:re?{}:{opacity:1,scale:1},transition:re?{duration:0}:{duration:L.DURATION.normal/1e3},children:[e.jsx("img",{src:a,alt:`Generated ${t+1}`,className:"glass-w-full glass-h-full glass-object-cover"}),e.jsx("div",{className:"glass-absolute glass-inset-0 glass-surface-dark/50 glass-opacity-0 glass-group-glass-hover-opacity-100 glass-transition-opacity glass-flex glass-items-center glass-justify-center",children:e.jsx("button",{className:"glass-p-2 glass-surface-subtle/20 glass-radius-lg glass-text-primary hover:glass-surface-subtle/30 glass-transition-colors",children:e.jsx("svg",{className:"glass-w-4 glass-h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"})})})})]},t))})]}),v&&Ie&&e.jsxs("div",{className:`
            p-3 rounded-lg border border-blue-400/30
            ${Ge({blur:"sm",opacity:.8}).background}
          `,children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-2",children:[e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Generating batch..."}),e.jsxs("span",{className:"glass-text-sm glass-font-medium glass-text-primary",children:[Math.round(ye),"%"]})]}),e.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:e.jsx(N.div,{className:"glass-surface-blue glass-h-2 glass-radius-full",animate:{width:`${ye}%`},transition:re?{duration:0}:{duration:.3}})})]}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 lg:glass-grid-cols-2 glass-gap-6",children:[Ce&&e.jsx(Ue,{}),Ae&&e.jsx(Oe,{})]}),Pe&&y.length>0&&e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Latent Space (2D Projection)"}),e.jsx("canvas",{ref:Se,width:400,height:300,className:"glass-w-full glass-max-w-md glass-border glass-border-white/20 glass-radius-lg glass-surface-dark/20"})]}),ge&&be.length>0&&e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Latent Interpolation"}),e.jsx("div",{className:"glass-flex glass-space-x-2 glass-overflow-x-auto glass-pb-2",children:be.map((a,t)=>e.jsx("div",{className:"glass-flex-shrink-0 glass-w-16 glass-h-16 glass-radius glass-border glass-border-white/20 glass-overflow-hidden",children:e.jsx("img",{src:a,alt:`Interpolation ${t}`,className:"glass-w-full glass-h-full glass-object-cover"})},t))})]}),A&&de&&e.jsxs("div",{className:`
            p-3 rounded-lg border border-orange-400/30
            ${Ge({blur:"sm",opacity:.8}).background}
          `,children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-2",children:[e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Training Model..."}),e.jsxs("span",{className:"glass-text-sm glass-font-medium glass-text-primary",children:["Epoch ",le.epoch]})]}),e.jsxs("div",{className:"glass-grid glass-grid-cols-2 glass-gap-4 glass-text-xs glass-text-primary-glass-opacity-60",children:[e.jsxs("div",{children:["Generator Loss: ",le.generatorLoss.toFixed(3)]}),e.jsxs("div",{children:["Discriminator Loss:"," ",le.discriminatorLoss.toFixed(3)]})]})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-pt-4 glass-border-t glass-border-white/10",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[e.jsx(N.button,{className:"glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors disabled:glass-opacity-50",whileHover:w?{scale:1.02}:{},whileTap:w?{scale:.98}:{},onClick:ce,disabled:v||!h.trained,children:v?"Generating...":"Generate Images"}),ge&&y.length>=2&&e.jsx(N.button,{className:"glass-px-4 glass-py-2 glass-border glass-border-white/30 hover:glass-border-white/50 glass-text-primary-glass-opacity-80 glass-radius-lg glass-text-sm glass-transition-colors",whileHover:w?{scale:1.02}:{},whileTap:w?{scale:.98}:{},onClick:Ve,children:"Interpolate"}),de&&!h.trained&&e.jsx(N.button,{className:"glass-px-4 glass-py-2 glass-surface-primary hover:glass-surface-primary glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors disabled:glass-opacity-50",whileHover:w?{scale:1.02}:{},whileTap:w?{scale:.98}:{},onClick:We,disabled:A,children:A?"Training...":"Train Model"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-text-xs glass-text-primary-glass-opacity-60",children:[e.jsxs("span",{children:["Generated: ",oe.length]}),e.jsx("span",{children:"•"}),e.jsxs("span",{children:["Model: ",h.name]})]})]})]})});te.displayName="GlassGANGenerator";try{te.displayName="GlassGANGenerator",te.__docgenInfo={description:"",displayName:"GlassGANGenerator",props:{availableModels:{defaultValue:{value:`[
  {
    id: "stylegan2-faces",
    name: "StyleGAN2 Faces",
    description: "High-quality human face generation",
    type: "stylegan",
    category: "faces",
    resolution: 1024,
    latentDim: 512,
    trained: true,
  },
  {
    id: "dcgan-art",
    name: "DCGAN Art",
    description: "Abstract art generation",
    type: "dcgan",
    category: "art",
    resolution: 256,
    latentDim: 100,
    trained: true,
  },
  {
    id: "biggan-objects",
    name: "BigGAN Objects",
    description: "Conditional object generation",
    type: "biggan",
    category: "objects",
    resolution: 512,
    latentDim: 128,
    trained: true,
  },
  {
    id: "cyclegan-style",
    name: "CycleGAN Style Transfer",
    description: "Unpaired image-to-image translation",
    type: "cyclegan",
    category: "style_transfer",
    resolution: 256,
    latentDim: 256,
    trained: true,
  },
  {
    id: "progressive-landscapes",
    name: "Progressive Landscapes",
    description: "Landscape scene generation",
    type: "progressive",
    category: "landscapes",
    resolution: 512,
    latentDim: 256,
    trained: true,
  },
  {
    id: "stylegan3-general",
    name: "StyleGAN3 General",
    description: "General purpose image generation",
    type: "stylegan",
    category: "general",
    resolution: 512,
    latentDim: 512,
    trained: false,
  },
]`},description:"",name:"availableModels",required:!1,type:{name:"GANModel[] | undefined"}},selectedModel:{defaultValue:{value:"stylegan2-faces"},description:"",name:"selectedModel",required:!1,type:{name:"string | undefined"}},generationParams:{defaultValue:{value:"{}"},description:"",name:"generationParams",required:!1,type:{name:"Partial<GenerationParams> | undefined"}},trainingConfig:{defaultValue:{value:"{}"},description:"",name:"trainingConfig",required:!1,type:{name:"Partial<TrainingConfig> | undefined"}},showModelSelector:{defaultValue:{value:"true"},description:"",name:"showModelSelector",required:!1,type:{name:"boolean | undefined"}},showGenerationControls:{defaultValue:{value:"true"},description:"",name:"showGenerationControls",required:!1,type:{name:"boolean | undefined"}},showTrainingControls:{defaultValue:{value:"true"},description:"",name:"showTrainingControls",required:!1,type:{name:"boolean | undefined"}},showLatentSpace:{defaultValue:{value:"true"},description:"",name:"showLatentSpace",required:!1,type:{name:"boolean | undefined"}},showProgress:{defaultValue:{value:"true"},description:"",name:"showProgress",required:!1,type:{name:"boolean | undefined"}},enableInterpolation:{defaultValue:{value:"true"},description:"",name:"enableInterpolation",required:!1,type:{name:"boolean | undefined"}},enableRealTime:{defaultValue:{value:"false"},description:"",name:"enableRealTime",required:!1,type:{name:"boolean | undefined"}},maxGenerations:{defaultValue:{value:"16"},description:"",name:"maxGenerations",required:!1,type:{name:"number | undefined"}},canvasWidth:{defaultValue:{value:"256"},description:"",name:"canvasWidth",required:!1,type:{name:"number | undefined"}},canvasHeight:{defaultValue:{value:"256"},description:"",name:"canvasHeight",required:!1,type:{name:"number | undefined"}},onModelSelect:{defaultValue:null,description:"",name:"onModelSelect",required:!1,type:{name:"((modelId: string) => void) | undefined"}},onGenerate:{defaultValue:null,description:"",name:"onGenerate",required:!1,type:{name:"((images: string[], params: GenerationParams) => void) | undefined"}},onTrainingProgress:{defaultValue:null,description:"",name:"onTrainingProgress",required:!1,type:{name:"((epoch: number, loss: { generator: number; discriminator: number; }) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const i=[{id:"stylegan2-faces",name:"StyleGAN2 Faces",description:"High-quality human face generation",type:"stylegan",category:"faces",resolution:1024,latentDim:512,trained:!0},{id:"dcgan-art",name:"DCGAN Art",description:"Abstract art generation",type:"dcgan",category:"art",resolution:256,latentDim:100,trained:!0},{id:"biggan-objects",name:"BigGAN Objects",description:"Conditional object generation",type:"biggan",category:"objects",resolution:512,latentDim:128,trained:!0},{id:"cyclegan-style",name:"CycleGAN Style Transfer",description:"Unpaired image-to-image translation",type:"cyclegan",category:"style_transfer",resolution:256,latentDim:256,trained:!0},{id:"progressive-landscapes",name:"Progressive Landscapes",description:"Landscape scene generation",type:"progressive",category:"landscapes",resolution:512,latentDim:256,trained:!0},{id:"stylegan3-general",name:"StyleGAN3 General",description:"General purpose image generation",type:"stylegan",category:"general",resolution:512,latentDim:512,trained:!1}],ca={title:"Glass UI/AI/GlassGANGenerator",component:te,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{maxGenerations:{control:{type:"range",min:4,max:32,step:4}},canvasWidth:{control:{type:"range",min:128,max:512,step:32}},canvasHeight:{control:{type:"range",min:128,max:512,step:32}},showModelSelector:{control:"boolean"},showGenerationControls:{control:"boolean"},showTrainingControls:{control:"boolean"},showLatentSpace:{control:"boolean"},showProgress:{control:"boolean"},enableInterpolation:{control:"boolean"},enableRealTime:{control:"boolean"}}},T={args:{availableModels:i,selectedModel:"stylegan2-faces",maxGenerations:16,canvasWidth:256,canvasHeight:256,showModelSelector:!0,showGenerationControls:!0,showTrainingControls:!0,showLatentSpace:!0,showProgress:!0,enableInterpolation:!0,enableRealTime:!1,generationParams:{seed:42,truncation:.7,styleStrength:1,noiseStrength:.5,batchSize:4,interpolationSteps:10},trainingConfig:{epochs:100,batchSize:32,learningRate:2e-4,beta1:.5,beta2:.999,discriminatorSteps:1,generatorSteps:1}}},z={args:{availableModels:i.filter(s=>s.type==="stylegan"),selectedModel:"stylegan2-faces",maxGenerations:12,showModelSelector:!0,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:.8,batchSize:6}}},k={args:{availableModels:i.filter(s=>s.type==="dcgan"),selectedModel:"dcgan-art",maxGenerations:16,showModelSelector:!0,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:1,styleStrength:1.5,batchSize:4}}},D={args:{availableModels:i.filter(s=>s.type==="biggan"),selectedModel:"biggan-objects",maxGenerations:20,showModelSelector:!0,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:.5,batchSize:8}}},R={args:{availableModels:i.filter(s=>s.type==="cyclegan"),selectedModel:"cyclegan-style",maxGenerations:8,showModelSelector:!0,showGenerationControls:!0,showLatentSpace:!1,enableInterpolation:!1,generationParams:{styleStrength:2,batchSize:2}}},H={args:{availableModels:i.filter(s=>s.type==="progressive"),selectedModel:"progressive-landscapes",maxGenerations:12,canvasWidth:512,canvasHeight:512,showModelSelector:!0,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:.6,batchSize:3}}},q={args:{availableModels:i.filter(s=>!s.trained),selectedModel:"stylegan3-general",maxGenerations:16,showModelSelector:!0,showGenerationControls:!0,showTrainingControls:!0,showProgress:!0,trainingConfig:{epochs:50,batchSize:16,learningRate:.001}}},V={args:{availableModels:i.filter(s=>s.resolution>=512),selectedModel:"stylegan2-faces",maxGenerations:8,canvasWidth:512,canvasHeight:512,showModelSelector:!0,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:.7,batchSize:2}}},W={args:{availableModels:i.filter(s=>s.resolution<=256),selectedModel:"dcgan-art",maxGenerations:24,canvasWidth:128,canvasHeight:128,showModelSelector:!0,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{batchSize:8}}},F={args:{availableModels:i.filter(s=>s.trained&&s.resolution<=256),selectedModel:"dcgan-art",maxGenerations:20,showModelSelector:!0,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,enableRealTime:!0,generationParams:{batchSize:2,truncation:.8}}},U={args:{availableModels:i.filter(s=>s.trained),selectedModel:"stylegan2-faces",maxGenerations:8,showModelSelector:!1,showGenerationControls:!0,showTrainingControls:!1,showLatentSpace:!0,enableInterpolation:!0,generationParams:{batchSize:2,interpolationSteps:20}}},O={args:{availableModels:[...i.filter(s=>s.trained),{id:"custom-model",name:"Custom GAN",description:"User-defined GAN architecture",type:"dcgan",category:"general",resolution:256,latentDim:128,trained:!1}],selectedModel:"custom-model",maxGenerations:16,showModelSelector:!0,showGenerationControls:!1,showTrainingControls:!0,showProgress:!0,showLatentSpace:!1,trainingConfig:{epochs:200,batchSize:64,learningRate:1e-4,discriminatorSteps:2,generatorSteps:1}}},_={args:{availableModels:i.filter(s=>s.trained),selectedModel:"stylegan2-faces",maxGenerations:10,showModelSelector:!1,showGenerationControls:!0,showTrainingControls:!1,showLatentSpace:!0,enableInterpolation:!0,generationParams:{batchSize:1,truncation:.5}}},$={args:{availableModels:i.filter(s=>s.trained).slice(0,2),selectedModel:"dcgan-art",maxGenerations:8,showModelSelector:!1,showGenerationControls:!1,showTrainingControls:!1,showLatentSpace:!1,showProgress:!1,enableInterpolation:!1}},B={args:{availableModels:i.filter(s=>s.trained),selectedModel:"biggan-objects",maxGenerations:32,showModelSelector:!0,showGenerationControls:!0,showProgress:!0,generationParams:{batchSize:8,truncation:.6}}},E={args:{availableModels:i.filter(s=>s.trained),selectedModel:"stylegan2-faces",maxGenerations:12,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:1.5,styleStrength:1.2,batchSize:4}}},Q={args:{availableModels:i.filter(s=>s.trained),selectedModel:"stylegan2-faces",maxGenerations:12,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:.3,styleStrength:.8,batchSize:4}}},Z={args:{availableModels:i.filter(s=>s.category==="faces"),selectedModel:"stylegan2-faces",maxGenerations:16,canvasWidth:512,canvasHeight:512,showModelSelector:!1,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:.7,batchSize:4}}},J={args:{availableModels:i.filter(s=>s.category==="art"),selectedModel:"dcgan-art",maxGenerations:20,showModelSelector:!1,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:1.2,styleStrength:1.5,batchSize:5}}},K={args:{availableModels:i.filter(s=>s.category==="objects"),selectedModel:"biggan-objects",maxGenerations:24,showModelSelector:!1,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:.6,batchSize:6}}},X={args:{availableModels:i.filter(s=>s.category==="landscapes"),selectedModel:"progressive-landscapes",maxGenerations:12,canvasWidth:512,canvasHeight:512,showModelSelector:!1,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:.8,batchSize:3}}},Y={args:{availableModels:i.filter(s=>s.category==="style_transfer"),selectedModel:"cyclegan-style",maxGenerations:8,showModelSelector:!1,showGenerationControls:!0,showLatentSpace:!1,enableInterpolation:!1,generationParams:{styleStrength:2,batchSize:2}}},ee={args:{availableModels:i,selectedModel:"stylegan2-faces",maxGenerations:16,showModelSelector:!0,showGenerationControls:!0,showTrainingControls:!0,showLatentSpace:!0,showProgress:!0,enableInterpolation:!0,enableRealTime:!1}},ae={args:{availableModels:i.filter(s=>s.resolution<=256),selectedModel:"dcgan-art",maxGenerations:32,canvasWidth:128,canvasHeight:128,showProgress:!0,enableRealTime:!0,generationParams:{batchSize:8,truncation:1}}},se={args:{availableModels:i.filter(s=>s.resolution>=512),selectedModel:"stylegan2-faces",maxGenerations:4,canvasWidth:512,canvasHeight:512,showProgress:!0,enableRealTime:!1,generationParams:{batchSize:1,truncation:.7}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels,
    selectedModel: 'stylegan2-faces',
    maxGenerations: 16,
    canvasWidth: 256,
    canvasHeight: 256,
    showModelSelector: true,
    showGenerationControls: true,
    showTrainingControls: true,
    showLatentSpace: true,
    showProgress: true,
    enableInterpolation: true,
    enableRealTime: false,
    generationParams: {
      seed: 42,
      truncation: 0.7,
      styleStrength: 1.0,
      noiseStrength: 0.5,
      batchSize: 4,
      interpolationSteps: 10
    },
    trainingConfig: {
      epochs: 100,
      batchSize: 32,
      learningRate: 0.0002,
      beta1: 0.5,
      beta2: 0.999,
      discriminatorSteps: 1,
      generatorSteps: 1
    }
  }
}`,...T.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.type === 'stylegan'),
    selectedModel: 'stylegan2-faces',
    maxGenerations: 12,
    showModelSelector: true,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 0.8,
      batchSize: 6
    }
  }
}`,...z.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.type === 'dcgan'),
    selectedModel: 'dcgan-art',
    maxGenerations: 16,
    showModelSelector: true,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 1.0,
      styleStrength: 1.5,
      batchSize: 4
    }
  }
}`,...k.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.type === 'biggan'),
    selectedModel: 'biggan-objects',
    maxGenerations: 20,
    showModelSelector: true,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 0.5,
      batchSize: 8
    }
  }
}`,...D.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.type === 'cyclegan'),
    selectedModel: 'cyclegan-style',
    maxGenerations: 8,
    showModelSelector: true,
    showGenerationControls: true,
    showLatentSpace: false,
    enableInterpolation: false,
    generationParams: {
      styleStrength: 2.0,
      batchSize: 2
    }
  }
}`,...R.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.type === 'progressive'),
    selectedModel: 'progressive-landscapes',
    maxGenerations: 12,
    canvasWidth: 512,
    canvasHeight: 512,
    showModelSelector: true,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 0.6,
      batchSize: 3
    }
  }
}`,...H.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => !m.trained),
    selectedModel: 'stylegan3-general',
    maxGenerations: 16,
    showModelSelector: true,
    showGenerationControls: true,
    showTrainingControls: true,
    showProgress: true,
    trainingConfig: {
      epochs: 50,
      batchSize: 16,
      learningRate: 0.001
    }
  }
}`,...q.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.resolution >= 512),
    selectedModel: 'stylegan2-faces',
    maxGenerations: 8,
    canvasWidth: 512,
    canvasHeight: 512,
    showModelSelector: true,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 0.7,
      batchSize: 2
    }
  }
}`,...V.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.resolution <= 256),
    selectedModel: 'dcgan-art',
    maxGenerations: 24,
    canvasWidth: 128,
    canvasHeight: 128,
    showModelSelector: true,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      batchSize: 8
    }
  }
}`,...W.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.trained && m.resolution <= 256),
    selectedModel: 'dcgan-art',
    maxGenerations: 20,
    showModelSelector: true,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    enableRealTime: true,
    generationParams: {
      batchSize: 2,
      truncation: 0.8
    }
  }
}`,...F.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.trained),
    selectedModel: 'stylegan2-faces',
    maxGenerations: 8,
    showModelSelector: false,
    showGenerationControls: true,
    showTrainingControls: false,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      batchSize: 2,
      interpolationSteps: 20
    }
  }
}`,...U.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: [...mockGANModels.filter(m => m.trained), {
      id: 'custom-model',
      name: 'Custom GAN',
      description: 'User-defined GAN architecture',
      type: 'dcgan',
      category: 'general',
      resolution: 256,
      latentDim: 128,
      trained: false
    }],
    selectedModel: 'custom-model',
    maxGenerations: 16,
    showModelSelector: true,
    showGenerationControls: false,
    showTrainingControls: true,
    showProgress: true,
    showLatentSpace: false,
    trainingConfig: {
      epochs: 200,
      batchSize: 64,
      learningRate: 0.0001,
      discriminatorSteps: 2,
      generatorSteps: 1
    }
  }
}`,...O.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.trained),
    selectedModel: 'stylegan2-faces',
    maxGenerations: 10,
    showModelSelector: false,
    showGenerationControls: true,
    showTrainingControls: false,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      batchSize: 1,
      truncation: 0.5
    }
  }
}`,..._.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.trained).slice(0, 2),
    selectedModel: 'dcgan-art',
    maxGenerations: 8,
    showModelSelector: false,
    showGenerationControls: false,
    showTrainingControls: false,
    showLatentSpace: false,
    showProgress: false,
    enableInterpolation: false
  }
}`,...$.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.trained),
    selectedModel: 'biggan-objects',
    maxGenerations: 32,
    showModelSelector: true,
    showGenerationControls: true,
    showProgress: true,
    generationParams: {
      batchSize: 8,
      truncation: 0.6
    }
  }
}`,...B.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.trained),
    selectedModel: 'stylegan2-faces',
    maxGenerations: 12,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 1.5,
      styleStrength: 1.2,
      batchSize: 4
    }
  }
}`,...E.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.trained),
    selectedModel: 'stylegan2-faces',
    maxGenerations: 12,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 0.3,
      styleStrength: 0.8,
      batchSize: 4
    }
  }
}`,...Q.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.category === 'faces'),
    selectedModel: 'stylegan2-faces',
    maxGenerations: 16,
    canvasWidth: 512,
    canvasHeight: 512,
    showModelSelector: false,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 0.7,
      batchSize: 4
    }
  }
}`,...Z.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.category === 'art'),
    selectedModel: 'dcgan-art',
    maxGenerations: 20,
    showModelSelector: false,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 1.2,
      styleStrength: 1.5,
      batchSize: 5
    }
  }
}`,...J.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.category === 'objects'),
    selectedModel: 'biggan-objects',
    maxGenerations: 24,
    showModelSelector: false,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 0.6,
      batchSize: 6
    }
  }
}`,...K.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.category === 'landscapes'),
    selectedModel: 'progressive-landscapes',
    maxGenerations: 12,
    canvasWidth: 512,
    canvasHeight: 512,
    showModelSelector: false,
    showGenerationControls: true,
    showLatentSpace: true,
    enableInterpolation: true,
    generationParams: {
      truncation: 0.8,
      batchSize: 3
    }
  }
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.category === 'style_transfer'),
    selectedModel: 'cyclegan-style',
    maxGenerations: 8,
    showModelSelector: false,
    showGenerationControls: true,
    showLatentSpace: false,
    enableInterpolation: false,
    generationParams: {
      styleStrength: 2.0,
      batchSize: 2
    }
  }
}`,...Y.parameters?.docs?.source}}};ee.parameters={...ee.parameters,docs:{...ee.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels,
    selectedModel: 'stylegan2-faces',
    maxGenerations: 16,
    showModelSelector: true,
    showGenerationControls: true,
    showTrainingControls: true,
    showLatentSpace: true,
    showProgress: true,
    enableInterpolation: true,
    enableRealTime: false
  }
}`,...ee.parameters?.docs?.source}}};ae.parameters={...ae.parameters,docs:{...ae.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.resolution <= 256),
    selectedModel: 'dcgan-art',
    maxGenerations: 32,
    canvasWidth: 128,
    canvasHeight: 128,
    showProgress: true,
    enableRealTime: true,
    generationParams: {
      batchSize: 8,
      truncation: 1.0
    }
  }
}`,...ae.parameters?.docs?.source}}};se.parameters={...se.parameters,docs:{...se.parameters?.docs,source:{originalSource:`{
  args: {
    availableModels: mockGANModels.filter(m => m.resolution >= 512),
    selectedModel: 'stylegan2-faces',
    maxGenerations: 4,
    canvasWidth: 512,
    canvasHeight: 512,
    showProgress: true,
    enableRealTime: false,
    generationParams: {
      batchSize: 1,
      truncation: 0.7
    }
  }
}`,...se.parameters?.docs?.source}}};const da=["Default","StyleGAN2Faces","DCGANArt","BigGANObjects","CycleGANStyleTransfer","ProgressiveGAN","UntrainedModel","HighResolution","LowResolution","RealTimeGeneration","InterpolationFocus","TrainingMode","LatentSpaceFocus","MinimalInterface","BatchGeneration","HighTruncation","LowTruncation","FaceGeneration","ArtGeneration","ObjectGeneration","LandscapeGeneration","StyleTransferMode","AllModelsAvailable","FastGeneration","SlowHighQuality"];export{ee as AllModelsAvailable,J as ArtGeneration,B as BatchGeneration,D as BigGANObjects,R as CycleGANStyleTransfer,k as DCGANArt,T as Default,Z as FaceGeneration,ae as FastGeneration,V as HighResolution,E as HighTruncation,U as InterpolationFocus,X as LandscapeGeneration,_ as LatentSpaceFocus,W as LowResolution,Q as LowTruncation,$ as MinimalInterface,K as ObjectGeneration,H as ProgressiveGAN,F as RealTimeGeneration,se as SlowHighQuality,z as StyleGAN2Faces,Y as StyleTransferMode,O as TrainingMode,q as UntrainedModel,da as __namedExportsOrder,ca as default};
