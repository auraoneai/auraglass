import{r as g,b as Ze,d as T,j as e,m as j}from"./iframe-DBNhMyqR.js";import{u as Je}from"./useMotionPreference-CU0FHO2Y.js";import{u as Ke}from"./a11y-BSdOe7Q0.js";import{c as Ge}from"./createGlassStyle-BfWnO-qv.js";import{u as Xe}from"./soundDesign-aOl6NvN9.js";import{O as Ye}from"./OptimizedGlassCore-DUu6GVWj.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-pg7tQO9x.js";const ea=[{id:"stylegan2-faces",name:"StyleGAN2 Faces",description:"High-quality human face generation",type:"stylegan",category:"faces",resolution:1024,latentDim:512,trained:!0},{id:"dcgan-art",name:"DCGAN Art",description:"Abstract art generation",type:"dcgan",category:"art",resolution:256,latentDim:100,trained:!0},{id:"biggan-objects",name:"BigGAN Objects",description:"Conditional object generation",type:"biggan",category:"objects",resolution:512,latentDim:128,trained:!0},{id:"cyclegan-style",name:"CycleGAN Style Transfer",description:"Unpaired image-to-image translation",type:"cyclegan",category:"style_transfer",resolution:256,latentDim:256,trained:!0},{id:"progressive-landscapes",name:"Progressive Landscapes",description:"Landscape scene generation",type:"progressive",category:"landscapes",resolution:512,latentDim:256,trained:!0},{id:"stylegan3-general",name:"StyleGAN3 General",description:"General purpose image generation",type:"stylegan",category:"general",resolution:512,latentDim:512,trained:!1}],aa={seed:42,truncation:.7,styleStrength:1,noiseStrength:.5,batchSize:4,interpolationSteps:10},sa={epochs:100,batchSize:32,learningRate:2e-4,beta1:.5,beta2:.999,discriminatorSteps:1,generatorSteps:1},ta={"--glass-text-primary":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))","--typography-text-primary":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))","--glass-theme-text":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))",color:"var(--glass-theme-text, rgba(255, 255, 255, 0.95))"},ne=g.forwardRef(({availableModels:s=ea,selectedModel:Ne="stylegan2-faces",generationParams:je={},trainingConfig:Ce={},compact:y=!1,showHeader:Ae=!y,showActions:Pe=!y,showModelSelector:Ie=!0,showGenerationControls:Le=!1,showTrainingControls:de=!1,showLatentSpace:Te=!1,showProgress:ze=!0,enableInterpolation:me=!0,enableRealTime:re=!1,maxGenerations:A=16,canvasWidth:na=256,canvasHeight:ra=256,onModelSelect:ue,onGenerate:pe,onTrainingProgress:he,className:ke="",...De},Re)=>{const oe=Ze(),[N,fe]=g.useState(!1),[P,be]=g.useState(!1),[C,He]=g.useState(Ne),[le,qe]=g.useState([]),[x,Ve]=g.useState([]),[ie,We]=g.useState({epoch:0,generatorLoss:0,discriminatorLoss:0}),[ye,Fe]=g.useState([]),[xe,ce]=g.useState(0),[d,I]=g.useState({...aa,...je}),[we,oa]=g.useState({...sa,...Ce});g.useRef([]);const Se=g.useRef(null);g.useRef(null),Ke("glass-gan-generator");const{shouldAnimate:M}=Je(),{play:v}=Xe(),h=s.find(a=>a.id===C)||s[0],Me=g.useCallback(a=>Array.from({length:a},()=>(Math.random()-.5)*2),[]),L=g.useCallback((a,t,m)=>{const r=document.createElement("canvas");r.width=t.resolution,r.height=t.resolution;const p=r.getContext("2d");if(!p)return"";const S=p.createImageData(r.width,r.height),n=S.data;switch(t.type){case"stylegan":for(let c=0;c<r.height;c++)for(let l=0;l<r.width;l++){const o=(c*r.width+l)*4,f=a.slice(0,8).reduce((u,w)=>u+w,0)/8,b=(l/r.width-.5)*2,G=(c/r.height-.5)*2;if(t.category==="faces"){const u=Math.exp(-(b*b+G*G*.8)*2),w=Math.sin(b*10)*Math.cos(G*10)*.1;n[o]=Math.floor((.8+f*.2+w)*u*255),n[o+1]=Math.floor((.7+f*.3+w)*u*255),n[o+2]=Math.floor((.6+f*.4+w)*u*255),n[o+3]=255}else{const u=Math.sin(b*5+f)*Math.cos(G*5+f);n[o]=Math.floor((u+1)*128),n[o+1]=Math.floor((Math.sin(u*2)+1)*128),n[o+2]=Math.floor((Math.cos(u*3)+1)*128),n[o+3]=255}}break;case"dcgan":for(let c=0;c<r.height;c++)for(let l=0;l<r.width;l++){const o=(c*r.width+l)*4,b=.02*(1+a.slice(0,5).reduce((Ee,Qe)=>Ee+Qe,0)*.1),G=Math.sin(l*b)*Math.cos(c*b),u=Math.sin((l+c)*b*.8),w=Math.cos((l-c)*b*1.2);n[o]=Math.floor((G+1)*128),n[o+1]=Math.floor((u+1)*128),n[o+2]=Math.floor((w+1)*128),n[o+3]=255}break;case"biggan":for(let c=0;c<r.height;c++)for(let l=0;l<r.width;l++){const o=(c*r.width+l)*4,f=a.slice(-10),b=Math.floor(Math.abs(f[0])*10),u=[[255,100,100],[100,255,100],[100,100,255],[255,255,100],[255,100,255],[100,255,255],[200,150,100],[150,100,200],[100,200,150],[180,180,180]][b]||[128,128,128],w=(Math.random()-.5)*50;n[o]=Math.max(0,Math.min(255,u[0]+w)),n[o+1]=Math.max(0,Math.min(255,u[1]+w)),n[o+2]=Math.max(0,Math.min(255,u[2]+w)),n[o+3]=255}break;default:for(let c=0;c<r.height;c++)for(let l=0;l<r.width;l++){const o=(c*r.width+l)*4,f=a.slice(0,3).reduce((b,G,u)=>b+G*Math.sin((l+c)*.01*(u+1)),0);n[o]=Math.floor((Math.sin(f)+1)*128),n[o+1]=Math.floor((Math.cos(f*1.1)+1)*128),n[o+2]=Math.floor((Math.sin(f*.9)+1)*128),n[o+3]=255}}return p.putImageData(S,0,0),r.toDataURL()},[]),ge=g.useCallback(async()=>{if(!h.trained){v("error");return}fe(!0),ce(0),v("processing");const a=[],t=[];for(let m=0;m<d.batchSize;m++){ce(m/d.batchSize*100);const p=Me(h.latentDim).map(n=>n*d.truncation),S=L(p,h,d.seed+m);a.push(S),t.push(p),await new Promise(n=>setTimeout(n,T.DURATION.fast*1.3))}qe(m=>[...a,...m].slice(0,A)),Ve(m=>[...t,...m].slice(0,A)),ce(100),pe?.(a,d),fe(!1),v("success")},[h,d,Me,L,A,pe,v]),$e=g.useCallback(async()=>{if(x.length<2)return;const a=x[0],t=x[1],m=d.interpolationSteps,r=[];for(let p=0;p<=m;p++){const S=p/m,n=a.map((l,o)=>l*(1-S)+t[o]*S),c=L(n,h,d.seed);r.push(c)}Fe(r)},[x,d.interpolationSteps,d.seed,L,h]),Ue=g.useCallback(async()=>{if(!h)return;be(!0),v("processing");for(let t=0;t<we.epochs;t++){const m=1+Math.random()*.5-t*.01,r=.8+Math.random()*.3-t*.005;We({epoch:t+1,generatorLoss:Math.max(.1,m),discriminatorLoss:Math.max(.1,r)}),he?.(t+1,{generator:m,discriminator:r}),await new Promise(p=>setTimeout(p,T.DURATION.fast))}const a=s.findIndex(t=>t.id===C);a!==-1&&(s[a].trained=!0),be(!1),v("success")},[h,we.epochs,C,s,he,v]),ve=g.useCallback(()=>{const a=Se.current;if(!a||x.length===0)return;const t=a.getContext("2d");t&&(t.clearRect(0,0,a.width,a.height),x.slice(0,10).forEach((m,r)=>{const p=(m[0]+2)/4*a.width,S=(m[1]+2)/4*a.height;t.fillStyle=`hsl(${r*36}, 70%, 60%)`,t.beginPath(),t.arc(p,S,5,0,Math.PI*2),t.fill(),x.slice(r+1,10).forEach((n,c)=>{const l=Math.sqrt(Math.pow(m[0]-n[0],2)+Math.pow(m[1]-n[1],2));if(l<1){const o=(n[0]+2)/4*a.width,f=(n[1]+2)/4*a.height;t.strokeStyle=`color-mix(in srgb, var(--glass-white) ${30*(1-l)}%, transparent)`,t.lineWidth=1,t.beginPath(),t.moveTo(p,S),t.lineTo(o,f),t.stroke()}})}))},[x]),Oe=g.useCallback(a=>{He(a),ue?.(a),v("select")},[ue,v]);g.useEffect(()=>{if(re&&h.trained){const a=setInterval(()=>{N||ge()},5e3);return()=>clearInterval(a)}},[re,h.trained,N,ge]),g.useEffect(()=>{ve()},[x,ve]);const _e=()=>e.jsxs("div",{className:y?"glass-space-y-3":"glass-space-y-4",children:[!y&&e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"GAN Models"}),e.jsx("div",{className:`glass-grid ${y?"glass-grid-cols-1 glass-gap-2":"glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-3"}`,style:y?{gridTemplateColumns:"1fr",gap:8}:void 0,children:s.map(a=>e.jsx(j.div,{className:`
                glass-p-3 glass-radius-lg glass-border glass-cursor-pointer glass-transition-all duration-[${T.DURATION.fast}ms]
                ${C===a.id?"glass-border-blue glass-surface-blue/20":"glass-border-white/20 hover:glass-border-white/40 glass-surface-subtle/5"}
              `,whileHover:M?{scale:1.01}:{},whileTap:M?{scale:.99}:{},onClick:()=>Oe(a.id),children:e.jsxs("div",{className:"glass-flex glass-items-start glass-justify-between",children:[e.jsxs("div",{className:"glass-flex-1",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-mb-1",children:[e.jsx("h5",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90",children:a.name}),a.trained?e.jsx("span",{className:"glass-px-2 glass-py-0.5 glass-surface-green/20 glass-text-secondary glass-radius glass-text-xs glass-font-medium",children:"Trained"}):e.jsx("span",{className:"glass-px-2 glass-py-0.5 glass-surface-primary/20 glass-text-secondary glass-radius glass-text-xs glass-font-medium",children:"Untrained"})]}),e.jsx("p",{className:"glass-text-xs glass-text-primary-glass-opacity-60 glass-mb-2",children:a.description}),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4 glass-text-xs glass-text-primary-glass-opacity-50",children:[e.jsxs("span",{children:[a.resolution,"px"]}),e.jsxs("span",{children:["Z:",a.latentDim]})]}),e.jsx("span",{className:`
                      glass-px-2 glass-py-0.5 glass-radius glass-text-xs glass-font-medium
                      ${a.type==="stylegan"?"glass-surface-primary/20 glass-text-secondary":a.type==="dcgan"?"glass-surface-blue/20 glass-text-secondary":a.type==="biggan"?"glass-surface-green/20 glass-text-secondary":a.type==="cyclegan"?"glass-surface-red/20 glass-text-secondary":"glass-surface-muted/20 glass-text-secondary"}
                    `,children:a.type.toUpperCase()})]})]}),C===a.id&&e.jsx("div",{className:"glass-text-primary glass-ml-2",children:"✓"})]})},a.id))})]}),Be=()=>e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Generation Parameters"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Seed: ",d.seed]}),e.jsx("input",{type:"range",min:"0",max:"1000",value:d.seed,onChange:a=>I(t=>({...t,seed:parseInt(a.target.value)})),"aria-label":`Seed: ${d.seed}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Truncation: ",d.truncation.toFixed(2)]}),e.jsx("input",{type:"range",min:"0.1",max:"2.0",step:"0.1",value:d.truncation,onChange:a=>I(t=>({...t,truncation:parseFloat(a.target.value)})),"aria-label":`Truncation: ${d.truncation.toFixed(2)}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Style Strength: ",d.styleStrength.toFixed(2)]}),e.jsx("input",{type:"range",min:"0.0",max:"2.0",step:"0.1",value:d.styleStrength,onChange:a=>I(t=>({...t,styleStrength:parseFloat(a.target.value)})),"aria-label":`Style Strength: ${d.styleStrength.toFixed(2)}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Batch Size: ",d.batchSize]}),e.jsx("input",{type:"range",min:"1",max:"8",value:d.batchSize,onChange:a=>I(t=>({...t,batchSize:parseInt(a.target.value)})),"aria-label":`Batch Size: ${d.batchSize}`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"})]})]})]});return e.jsxs(Ye,{ref:Re,variant:"frosted","data-glass-component":!0,style:{...ta,maxHeight:"100%",minWidth:0,height:y?"100%":void 0,overflow:y?"hidden":void 0},className:`${y?"glass-p-3 glass-space-y-3":"glass-p-4 glass-space-y-4"} glass-max-w-full glass-overflow-auto ${ke}`,...De,children:[Ae&&e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-gap-3 glass-min-w-0",children:[e.jsxs("div",{className:"glass-min-w-0",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary-glass-opacity-90 glass-truncate",children:"GAN Generator"}),e.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Generative Adversarial Networks for image synthesis"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[re&&h.trained&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),e.jsx("span",{className:"glass-text-xs",children:"Auto-gen"})]}),N&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-4 glass-h-4 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin"}),e.jsx("span",{className:"glass-text-xs",children:"Generating..."})]}),P&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-4 glass-h-4 glass-border-2 glass-border-orange-400 glass-border-t-transparent glass-radius-full glass-animate-spin"}),e.jsx("span",{className:"glass-text-xs",children:"Training..."})]})]})]}),le.length>0&&e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Generated Images"}),e.jsx("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-4 lg:glass-grid-cols-6 glass-gap-3",children:le.slice(0,A).map((a,t)=>e.jsxs(j.div,{className:"glass-relative glass-aspect-square glass-radius-lg glass-overflow-hidden glass-surface-subtle/10 glass-group glass-cursor-pointer",whileHover:M?{scale:1.05}:{},initial:{opacity:0,scale:.8},animate:oe?{}:{opacity:1,scale:1},transition:oe?{duration:0}:{duration:T.DURATION.normal/1e3},children:[e.jsx("img",{src:a,alt:`Generated ${t+1}`,className:"glass-w-full glass-h-full glass-object-cover"}),e.jsx("div",{className:"glass-absolute glass-inset-0 glass-surface-dark/50 glass-opacity-0 glass-group-glass-hover-opacity-100 glass-transition-opacity glass-flex glass-items-center glass-justify-center",children:e.jsx("button",{className:"glass-p-2 glass-surface-subtle/20 glass-radius-lg glass-text-primary hover:glass-surface-subtle/30 glass-transition-colors",children:e.jsx("svg",{className:"glass-w-4 glass-h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"})})})})]},t))})]}),N&&ze&&e.jsxs("div",{className:`
            glass-p-3 glass-radius-lg glass-border glass-border-blue/30
            ${Ge({blur:"sm",opacity:.8}).background}
          `,children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-2",children:[e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Generating batch..."}),e.jsxs("span",{className:"glass-text-sm glass-font-medium glass-text-primary",children:[Math.round(xe),"%"]})]}),e.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:e.jsx(j.div,{className:"glass-surface-blue glass-h-2 glass-radius-full",animate:{width:`${xe}%`},transition:oe?{duration:0}:{duration:.3}})})]}),e.jsxs("div",{className:`glass-grid ${y?"glass-grid-cols-1 glass-gap-2":"glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4"}`,style:y?{gridTemplateColumns:"1fr",gap:8}:void 0,children:[Ie&&e.jsx(_e,{}),Le&&e.jsx(Be,{})]}),Te&&x.length>0&&e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Latent Space (2D Projection)"}),e.jsx("canvas",{ref:Se,width:400,height:300,className:"glass-w-full glass-max-w-md glass-border glass-border-white/20 glass-radius-lg glass-surface-dark/20"})]}),me&&ye.length>0&&e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Latent Interpolation"}),e.jsx("div",{className:"glass-flex glass-space-x-2 glass-overflow-x-auto glass-pb-2",children:ye.map((a,t)=>e.jsx("div",{className:"glass-flex-shrink-0 glass-w-16 glass-h-16 glass-radius glass-border glass-border-white/20 glass-overflow-hidden",children:e.jsx("img",{src:a,alt:`Interpolation ${t}`,className:"glass-w-full glass-h-full glass-object-cover"})},t))})]}),P&&de&&e.jsxs("div",{className:`
            glass-p-3 glass-radius-lg glass-border glass-border-orange/30
            ${Ge({blur:"sm",opacity:.8}).background}
          `,children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-2",children:[e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Training Model..."}),e.jsxs("span",{className:"glass-text-sm glass-font-medium glass-text-primary",children:["Epoch ",ie.epoch]})]}),e.jsxs("div",{className:"glass-grid glass-grid-cols-2 glass-gap-4 glass-text-xs glass-text-primary-glass-opacity-60",children:[e.jsxs("div",{children:["Generator Loss: ",ie.generatorLoss.toFixed(3)]}),e.jsxs("div",{children:["Discriminator Loss:"," ",ie.discriminatorLoss.toFixed(3)]})]})]}),Pe&&e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-gap-3 glass-pt-3 glass-border-t glass-border-white/10 glass-flex-wrap",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-flex-wrap",children:[e.jsx(j.button,{className:"glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors disabled:glass-opacity-50",whileHover:M?{scale:1.02}:{},whileTap:M?{scale:.98}:{},onClick:ge,disabled:N||!h.trained,children:N?"Generating...":"Generate Images"}),me&&x.length>=2&&e.jsx(j.button,{className:"glass-px-4 glass-py-2 glass-border glass-border-white/30 hover:glass-border-white/50 glass-text-primary-glass-opacity-80 glass-radius-lg glass-text-sm glass-transition-colors",whileHover:M?{scale:1.02}:{},whileTap:M?{scale:.98}:{},onClick:$e,children:"Interpolate"}),de&&!h.trained&&e.jsx(j.button,{className:"glass-px-4 glass-py-2 glass-surface-primary hover:glass-surface-primary glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors disabled:glass-opacity-50",whileHover:M?{scale:1.02}:{},whileTap:M?{scale:.98}:{},onClick:Ue,disabled:P,children:P?"Training...":"Train Model"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-text-xs glass-text-primary-glass-opacity-60 glass-min-w-0 glass-flex-wrap",children:[e.jsxs("span",{children:["Generated: ",le.length]}),e.jsx("span",{children:"•"}),e.jsxs("span",{children:["Model: ",h.name]})]})]})]})});ne.displayName="GlassGANGenerator";try{ne.displayName="GlassGANGenerator",ne.__docgenInfo={description:"",displayName:"GlassGANGenerator",props:{availableModels:{defaultValue:{value:`[
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
]`},description:"",name:"availableModels",required:!1,type:{name:"GANModel[] | undefined"}},selectedModel:{defaultValue:{value:"stylegan2-faces"},description:"",name:"selectedModel",required:!1,type:{name:"string | undefined"}},generationParams:{defaultValue:{value:"{}"},description:"",name:"generationParams",required:!1,type:{name:"Partial<GenerationParams> | undefined"}},trainingConfig:{defaultValue:{value:"{}"},description:"",name:"trainingConfig",required:!1,type:{name:"Partial<TrainingConfig> | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},showHeader:{defaultValue:{value:"!compact"},description:"",name:"showHeader",required:!1,type:{name:"boolean | undefined"}},showActions:{defaultValue:{value:"!compact"},description:"",name:"showActions",required:!1,type:{name:"boolean | undefined"}},showModelSelector:{defaultValue:{value:"true"},description:"",name:"showModelSelector",required:!1,type:{name:"boolean | undefined"}},showGenerationControls:{defaultValue:{value:"false"},description:"",name:"showGenerationControls",required:!1,type:{name:"boolean | undefined"}},showTrainingControls:{defaultValue:{value:"false"},description:"",name:"showTrainingControls",required:!1,type:{name:"boolean | undefined"}},showLatentSpace:{defaultValue:{value:"false"},description:"",name:"showLatentSpace",required:!1,type:{name:"boolean | undefined"}},showProgress:{defaultValue:{value:"true"},description:"",name:"showProgress",required:!1,type:{name:"boolean | undefined"}},enableInterpolation:{defaultValue:{value:"true"},description:"",name:"enableInterpolation",required:!1,type:{name:"boolean | undefined"}},enableRealTime:{defaultValue:{value:"false"},description:"",name:"enableRealTime",required:!1,type:{name:"boolean | undefined"}},maxGenerations:{defaultValue:{value:"16"},description:"",name:"maxGenerations",required:!1,type:{name:"number | undefined"}},canvasWidth:{defaultValue:{value:"256"},description:"",name:"canvasWidth",required:!1,type:{name:"number | undefined"}},canvasHeight:{defaultValue:{value:"256"},description:"",name:"canvasHeight",required:!1,type:{name:"number | undefined"}},onModelSelect:{defaultValue:null,description:"",name:"onModelSelect",required:!1,type:{name:"((modelId: string) => void) | undefined"}},onGenerate:{defaultValue:null,description:"",name:"onGenerate",required:!1,type:{name:"((images: string[], params: GenerationParams) => void) | undefined"}},onTrainingProgress:{defaultValue:null,description:"",name:"onTrainingProgress",required:!1,type:{name:"((epoch: number, loss: { generator: number; discriminator: number; }) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const i=[{id:"stylegan2-faces",name:"StyleGAN2 Faces",description:"High-quality human face generation",type:"stylegan",category:"faces",resolution:1024,latentDim:512,trained:!0},{id:"dcgan-art",name:"DCGAN Art",description:"Abstract art generation",type:"dcgan",category:"art",resolution:256,latentDim:100,trained:!0},{id:"biggan-objects",name:"BigGAN Objects",description:"Conditional object generation",type:"biggan",category:"objects",resolution:512,latentDim:128,trained:!0},{id:"cyclegan-style",name:"CycleGAN Style Transfer",description:"Unpaired image-to-image translation",type:"cyclegan",category:"style_transfer",resolution:256,latentDim:256,trained:!0},{id:"progressive-landscapes",name:"Progressive Landscapes",description:"Landscape scene generation",type:"progressive",category:"landscapes",resolution:512,latentDim:256,trained:!0},{id:"stylegan3-general",name:"StyleGAN3 General",description:"General purpose image generation",type:"stylegan",category:"general",resolution:512,latentDim:512,trained:!1}],ha={title:"AI + Intelligence/Glass GANGenerator",component:ne,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{maxGenerations:{control:{type:"range",min:4,max:32,step:4}},canvasWidth:{control:{type:"range",min:128,max:512,step:32}},canvasHeight:{control:{type:"range",min:128,max:512,step:32}},showModelSelector:{control:"boolean"},showGenerationControls:{control:"boolean"},showTrainingControls:{control:"boolean"},showLatentSpace:{control:"boolean"},showProgress:{control:"boolean"},enableInterpolation:{control:"boolean"},enableRealTime:{control:"boolean"}}},z={args:{availableModels:i,selectedModel:"stylegan2-faces",maxGenerations:16,canvasWidth:256,canvasHeight:256,showModelSelector:!0,showGenerationControls:!0,showTrainingControls:!0,showLatentSpace:!0,showProgress:!0,enableInterpolation:!0,enableRealTime:!1,generationParams:{seed:42,truncation:.7,styleStrength:1,noiseStrength:.5,batchSize:4,interpolationSteps:10},trainingConfig:{epochs:100,batchSize:32,learningRate:2e-4,beta1:.5,beta2:.999,discriminatorSteps:1,generatorSteps:1}}},k={args:{availableModels:i.filter(s=>s.type==="stylegan"),selectedModel:"stylegan2-faces",maxGenerations:12,showModelSelector:!0,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:.8,batchSize:6}}},D={args:{availableModels:i.filter(s=>s.type==="dcgan"),selectedModel:"dcgan-art",maxGenerations:16,showModelSelector:!0,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:1,styleStrength:1.5,batchSize:4}}},R={args:{availableModels:i.filter(s=>s.type==="biggan"),selectedModel:"biggan-objects",maxGenerations:20,showModelSelector:!0,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:.5,batchSize:8}}},H={args:{availableModels:i.filter(s=>s.type==="cyclegan"),selectedModel:"cyclegan-style",maxGenerations:8,showModelSelector:!0,showGenerationControls:!0,showLatentSpace:!1,enableInterpolation:!1,generationParams:{styleStrength:2,batchSize:2}}},q={args:{availableModels:i.filter(s=>s.type==="progressive"),selectedModel:"progressive-landscapes",maxGenerations:12,canvasWidth:512,canvasHeight:512,showModelSelector:!0,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:.6,batchSize:3}}},V={args:{availableModels:i.filter(s=>!s.trained),selectedModel:"stylegan3-general",maxGenerations:16,showModelSelector:!0,showGenerationControls:!0,showTrainingControls:!0,showProgress:!0,trainingConfig:{epochs:50,batchSize:16,learningRate:.001}}},W={args:{availableModels:i.filter(s=>s.resolution>=512),selectedModel:"stylegan2-faces",maxGenerations:8,canvasWidth:512,canvasHeight:512,showModelSelector:!0,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:.7,batchSize:2}}},F={args:{availableModels:i.filter(s=>s.resolution<=256),selectedModel:"dcgan-art",maxGenerations:24,canvasWidth:128,canvasHeight:128,showModelSelector:!0,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{batchSize:8}}},$={args:{availableModels:i.filter(s=>s.trained&&s.resolution<=256),selectedModel:"dcgan-art",maxGenerations:20,showModelSelector:!0,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,enableRealTime:!0,generationParams:{batchSize:2,truncation:.8}}},U={args:{availableModels:i.filter(s=>s.trained),selectedModel:"stylegan2-faces",maxGenerations:8,showModelSelector:!1,showGenerationControls:!0,showTrainingControls:!1,showLatentSpace:!0,enableInterpolation:!0,generationParams:{batchSize:2,interpolationSteps:20}}},O={args:{availableModels:[...i.filter(s=>s.trained),{id:"custom-model",name:"Custom GAN",description:"User-defined GAN architecture",type:"dcgan",category:"general",resolution:256,latentDim:128,trained:!1}],selectedModel:"custom-model",maxGenerations:16,showModelSelector:!0,showGenerationControls:!1,showTrainingControls:!0,showProgress:!0,showLatentSpace:!1,trainingConfig:{epochs:200,batchSize:64,learningRate:1e-4,discriminatorSteps:2,generatorSteps:1}}},_={args:{availableModels:i.filter(s=>s.trained),selectedModel:"stylegan2-faces",maxGenerations:10,showModelSelector:!1,showGenerationControls:!0,showTrainingControls:!1,showLatentSpace:!0,enableInterpolation:!0,generationParams:{batchSize:1,truncation:.5}}},B={args:{availableModels:i.filter(s=>s.trained).slice(0,2),selectedModel:"dcgan-art",maxGenerations:8,showModelSelector:!1,showGenerationControls:!1,showTrainingControls:!1,showLatentSpace:!1,showProgress:!1,enableInterpolation:!1}},E={args:{availableModels:i.filter(s=>s.trained),selectedModel:"biggan-objects",maxGenerations:32,showModelSelector:!0,showGenerationControls:!0,showProgress:!0,generationParams:{batchSize:8,truncation:.6}}},Q={args:{availableModels:i.filter(s=>s.trained),selectedModel:"stylegan2-faces",maxGenerations:12,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:1.5,styleStrength:1.2,batchSize:4}}},Z={args:{availableModels:i.filter(s=>s.trained),selectedModel:"stylegan2-faces",maxGenerations:12,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:.3,styleStrength:.8,batchSize:4}}},J={args:{availableModels:i.filter(s=>s.category==="faces"),selectedModel:"stylegan2-faces",maxGenerations:16,canvasWidth:512,canvasHeight:512,showModelSelector:!1,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:.7,batchSize:4}}},K={args:{availableModels:i.filter(s=>s.category==="art"),selectedModel:"dcgan-art",maxGenerations:20,showModelSelector:!1,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:1.2,styleStrength:1.5,batchSize:5}}},X={args:{availableModels:i.filter(s=>s.category==="objects"),selectedModel:"biggan-objects",maxGenerations:24,showModelSelector:!1,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:.6,batchSize:6}}},Y={args:{availableModels:i.filter(s=>s.category==="landscapes"),selectedModel:"progressive-landscapes",maxGenerations:12,canvasWidth:512,canvasHeight:512,showModelSelector:!1,showGenerationControls:!0,showLatentSpace:!0,enableInterpolation:!0,generationParams:{truncation:.8,batchSize:3}}},ee={args:{availableModels:i.filter(s=>s.category==="style_transfer"),selectedModel:"cyclegan-style",maxGenerations:8,showModelSelector:!1,showGenerationControls:!0,showLatentSpace:!1,enableInterpolation:!1,generationParams:{styleStrength:2,batchSize:2}}},ae={args:{availableModels:i,selectedModel:"stylegan2-faces",maxGenerations:16,showModelSelector:!0,showGenerationControls:!0,showTrainingControls:!0,showLatentSpace:!0,showProgress:!0,enableInterpolation:!0,enableRealTime:!1}},se={args:{availableModels:i.filter(s=>s.resolution<=256),selectedModel:"dcgan-art",maxGenerations:32,canvasWidth:128,canvasHeight:128,showProgress:!0,enableRealTime:!0,generationParams:{batchSize:8,truncation:1}}},te={args:{availableModels:i.filter(s=>s.resolution>=512),selectedModel:"stylegan2-faces",maxGenerations:4,canvasWidth:512,canvasHeight:512,showProgress:!0,enableRealTime:!1,generationParams:{batchSize:1,truncation:.7}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
}`,...Q.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
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
}`,...Z.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
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
}`,...K.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}};ee.parameters={...ee.parameters,docs:{...ee.parameters?.docs,source:{originalSource:`{
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
}`,...ee.parameters?.docs?.source}}};ae.parameters={...ae.parameters,docs:{...ae.parameters?.docs,source:{originalSource:`{
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
}`,...ae.parameters?.docs?.source}}};se.parameters={...se.parameters,docs:{...se.parameters?.docs,source:{originalSource:`{
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
}`,...se.parameters?.docs?.source}}};te.parameters={...te.parameters,docs:{...te.parameters?.docs,source:{originalSource:`{
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
}`,...te.parameters?.docs?.source}}};const fa=["Default","StyleGAN2Faces","DCGANArt","BigGANObjects","CycleGANStyleTransfer","ProgressiveGAN","UntrainedModel","HighResolution","LowResolution","RealTimeGeneration","InterpolationFocus","TrainingMode","LatentSpaceFocus","MinimalInterface","BatchGeneration","HighTruncation","LowTruncation","FaceGeneration","ArtGeneration","ObjectGeneration","LandscapeGeneration","StyleTransferMode","AllModelsAvailable","FastGeneration","SlowHighQuality"];export{ae as AllModelsAvailable,K as ArtGeneration,E as BatchGeneration,R as BigGANObjects,H as CycleGANStyleTransfer,D as DCGANArt,z as Default,J as FaceGeneration,se as FastGeneration,W as HighResolution,Q as HighTruncation,U as InterpolationFocus,Y as LandscapeGeneration,_ as LatentSpaceFocus,F as LowResolution,Z as LowTruncation,B as MinimalInterface,X as ObjectGeneration,q as ProgressiveGAN,$ as RealTimeGeneration,te as SlowHighQuality,k as StyleGAN2Faces,ee as StyleTransferMode,O as TrainingMode,V as UntrainedModel,fa as __namedExportsOrder,ha as default};
