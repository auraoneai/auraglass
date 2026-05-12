import{r as g,b as ve,d as y,j as e,m as P}from"./iframe-DxUvObG1.js";import{u as Se}from"./useMotionPreference-CNuePJnm.js";import{u as Pe}from"./a11y-vOvrykAi.js";import{c as je}from"./createGlassStyle-BfWnO-qv.js";import{u as Ae}from"./soundDesign-D1S366Vp.js";import{O as Ge}from"./OptimizedGlassCore-Ge4l3l3b.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-Ciz7WW1Y.js";const Ne=[{id:"cosmic-abstract",text:"Cosmic abstract painting with swirling galaxies and nebulae in vibrant colors",style:"abstract expressionism",category:"abstract",tags:["space","cosmic","vibrant","swirling"]},{id:"cyberpunk-city",text:"Cyberpunk cityscape at night with neon lights reflecting on wet streets",style:"digital art",category:"architecture",tags:["cyberpunk","neon","city","night"]},{id:"ethereal-portrait",text:"Ethereal portrait of a person made of flowing light and energy",style:"digital painting",category:"portrait",tags:["ethereal","light","energy","flowing"]},{id:"surreal-landscape",text:"Surreal landscape with floating islands and impossible waterfalls",style:"surrealism",category:"landscape",tags:["surreal","floating","impossible","waterfalls"]},{id:"biomech-fusion",text:"Biomechanical fusion of organic forms and technological components",style:"biomechanical art",category:"surreal",tags:["biomechanical","organic","technology","fusion"]}],ke=["photorealistic","oil painting","watercolor","digital art","abstract expressionism","impressionism","cyberpunk","steampunk","art nouveau","minimalist","baroque","surrealism"],Me={"--glass-text-primary":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))","--typography-text-primary":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))","--glass-theme-text":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))",color:"var(--glass-theme-text, rgba(255, 255, 255, 0.95))"},O=g.forwardRef(({prompt:l="",suggestions:ie=Ne,generationSettings:oe={},showPromptLibrary:le=!1,showAdvancedSettings:ce=!1,showGenerationHistory:ge=!1,enableIterativeGeneration:Le=!0,enablePromptEnhancement:_=!0,enableStyleMixing:Ee=!1,realTimeGeneration:z=!1,onPromptChange:W,onGenerate:Ie,onImageGenerated:K,className:me="",...de},pe)=>{const B=ve(),[d,Q]=g.useState(l),[w,X]=g.useState(!1),[Y,Z]=g.useState(0),[ue,he]=g.useState(_),[ee,ye]=g.useState([]),[se,be]=g.useState([]),[n,b]=g.useState({model:"stable-diffusion",style:"photorealistic",resolution:"768x768",steps:25,guidance:7.5,iterations:1,...oe}),ae=g.useRef(null);Pe("glass-generative-art");const{shouldAnimate:v}=Se(),{play:S}=Ae(),te=g.useCallback(s=>{const f=["highly detailed","professional quality","studio lighting","8k resolution","masterpiece","trending on artstation","photorealistic","cinematic composition"].sort(()=>Math.random()-.5).slice(0,3).join(", ");return`${s}, ${f}, ${n.style} style`},[n.style]),J=g.useCallback(async s=>{if(!s.trim())return;X(!0),Z(0),S("processing");const t=_?te(s):s,f=[{label:"Initializing model...",duration:y.DURATION.normal},{label:"Processing prompt...",duration:y.DURATION.slow},{label:"Generating base composition...",duration:y.DURATION.slower*1.4},{label:"Adding details...",duration:y.DURATION.slower*2.1},{label:"Applying style...",duration:y.DURATION.slower*1.1},{label:"Refining image...",duration:y.DURATION.slower},{label:"Finalizing...",duration:y.DURATION.slow*1.4}];for(let m=0;m<f.length;m++)await new Promise(p=>setTimeout(p,f[m].duration)),Z((m+1)/f.length*100);const x=[];for(let m=0;m<n.iterations;m++){const p=ae.current;if(p){const a=p.getContext("2d");if(a){p.width=512,p.height=512;const u=s.toLowerCase();let o;if(u.includes("space")||u.includes("cosmic")?(o=a.createRadialGradient(256,256,0,256,256,400),o.addColorStop(0,"var(--glass-gray-900)"),o.addColorStop(.5,"var(--glass-gray-800)"),o.addColorStop(1,"var(--glass-gray-900)")):u.includes("cyberpunk")||u.includes("neon")?(o=a.createLinearGradient(0,0,512,512),o.addColorStop(0,"var(--glass-black)"),o.addColorStop(.5,"var(--glass-gray-900)"),o.addColorStop(1,"var(--glass-color-secondary)")):u.includes("nature")||u.includes("landscape")?(o=a.createLinearGradient(0,0,0,512),o.addColorStop(0,"var(--glass-color-info)"),o.addColorStop(.7,"#98fb98"),o.addColorStop(1,"#228b22")):(o=a.createLinearGradient(0,0,512,512),o.addColorStop(0,"#667eea"),o.addColorStop(1,"#764ba2")),a.fillStyle=o,a.fillRect(0,0,512,512),n.style.includes("abstract"))for(let i=0;i<15;i++){a.save(),a.translate(Math.random()*512,Math.random()*512),a.rotate(Math.random()*Math.PI*2);const c=a.createRadialGradient(0,0,0,0,0,50+Math.random()*100);c.addColorStop(0,`hsla(${Math.random()*360}, 70%, 60%, 0.8)`),c.addColorStop(1,`hsla(${Math.random()*360}, 50%, 40%, 0.3)`),a.fillStyle=c,a.beginPath(),a.ellipse(0,0,Math.random()*80+20,Math.random()*120+30,0,0,Math.PI*2),a.fill(),a.restore()}else if(n.style.includes("geometric"))for(let i=0;i<20;i++){a.save(),a.translate(Math.random()*512,Math.random()*512),a.rotate(Math.random()*Math.PI*2),a.strokeStyle=`hsla(${Math.random()*360}, 60%, 50%, 0.7)`,a.lineWidth=Math.random()*3+1,a.beginPath();const c=Math.random()*60+20;a.rect(-c/2,-c/2,c,c),a.stroke(),a.restore()}else if(u.includes("particle")||n.style.includes("digital"))for(let i=0;i<100;i++)a.fillStyle=`hsla(${Math.random()*60+180}, 80%, 60%, ${Math.random()*.8+.2})`,a.beginPath(),a.arc(Math.random()*512,Math.random()*512,Math.random()*3+1,0,Math.PI*2),a.fill();const ne=a.getImageData(0,0,512,512),h=ne.data;for(let i=0;i<h.length;i+=4){const c=(Math.random()-.5)*20;h[i]=Math.max(0,Math.min(255,h[i]+c)),h[i+1]=Math.max(0,Math.min(255,h[i+1]+c)),h[i+2]=Math.max(0,Math.min(255,h[i+2]+c))}a.putImageData(ne,0,0);const we=p.toDataURL("image/png");x.push(we)}}}ye(m=>[...x,...m].slice(0,12));const re={id:Date.now().toString(),prompt:t,imageUrl:x[0]||"",settings:{...n},timestamp:Date.now()};be(m=>[re,...m].slice(0,20)),X(!1),S("success"),x[0]&&K?.(x[0],re)},[n,_,te,K,S]);g.useEffect(()=>{if(z&&d&&d!==l){const s=setTimeout(()=>{J(d)},2e3);return()=>clearTimeout(s)}},[d,z,J,l]);const fe=()=>e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Prompt Library"}),e.jsx("div",{className:"glass-grid glass-gap-2",children:ie.map(s=>e.jsx(P.div,{className:"glass-p-3 glass-radius-lg glass-border glass-border-white/20 hover:glass-border-white/40 glass-surface-subtle/5 glass-cursor-pointer glass-transition-colors",whileHover:v?{scale:1.01}:{},onClick:()=>{Q(s.text),W?.(s.text),S("select")},children:e.jsx("div",{className:"glass-flex glass-items-start glass-justify-between",children:e.jsxs("div",{className:"glass-flex-1",children:[e.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-90 glass-mb-1",children:s.text}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[e.jsx("span",{className:`
                      glass-px-2 glass-py-0.5 glass-radius glass-text-xs glass-font-medium
                      ${s.category==="abstract"?"glass-surface-primary/20 glass-text-secondary":s.category==="landscape"?"glass-surface-green/20 glass-text-secondary":s.category==="portrait"?"glass-surface-blue/20 glass-text-secondary":s.category==="architecture"?"glass-surface-muted/20 glass-text-secondary":s.category==="nature"?"glass-surface-green/20 glass-text-secondary":"glass-surface-primary/20 glass-text-secondary"}
                    `,children:s.category}),s.tags.slice(0,2).map(t=>e.jsx("span",{className:"glass-px-1.5 glass-py-0.5 glass-surface-subtle/10 glass-text-primary-glass-opacity-60 glass-radius glass-text-xs",children:t},t))]})]})})},s.id))})]}),xe=()=>e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Generation Settings"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"model-select",className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-2",children:"Model"}),e.jsxs("select",{id:"model-select",value:n.model,onChange:s=>b(t=>({...t,model:s.target.value})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"AI model",children:[e.jsx("option",{value:"stable-diffusion",children:"Stable Diffusion"}),e.jsx("option",{value:"midjourney",children:"Midjourney"}),e.jsx("option",{value:"dall-e",children:"DALL-E"}),e.jsx("option",{value:"custom",children:"Custom Model"})]})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"style-select",className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-2",children:"Style"}),e.jsx("select",{id:"style-select",value:n.style,onChange:s=>b(t=>({...t,style:s.target.value})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"Art style preset",children:ke.map(s=>e.jsx("option",{value:s,children:s.charAt(0).toUpperCase()+s.slice(1)},s))})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"resolution-select",className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-2",children:"Resolution"}),e.jsxs("select",{id:"resolution-select",value:n.resolution,onChange:s=>b(t=>({...t,resolution:s.target.value})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"Image resolution",children:[e.jsx("option",{value:"512x512",children:"512 × 512"}),e.jsx("option",{value:"768x768",children:"768 × 768"}),e.jsx("option",{value:"1024x1024",children:"1024 × 1024"}),e.jsx("option",{value:"1920x1080",children:"1920 × 1080"})]})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"iterations-slider",className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-2",children:["Iterations: ",n.iterations]}),e.jsx("input",{id:"iterations-slider",type:"range",min:"1",max:"4",value:n.iterations,onChange:s=>b(t=>({...t,iterations:parseInt(s.target.value)})),className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":"Number of iterations"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"steps-slider",className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-2",children:["Steps: ",n.steps]}),e.jsx("input",{id:"steps-slider",type:"range",min:"10",max:"50",value:n.steps,onChange:s=>b(t=>({...t,steps:parseInt(s.target.value)})),className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":"Number of steps"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"guidance-slider",className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-2",children:["Guidance: ",n.guidance]}),e.jsx("input",{id:"guidance-slider",type:"range",min:"1",max:"20",step:"0.5",value:n.guidance,onChange:s=>b(t=>({...t,guidance:parseFloat(s.target.value)})),className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":"Guidance scale"})]})]})]});return e.jsxs(Ge,{ref:pe,variant:"frosted","data-glass-component":!0,style:{...Me,maxHeight:"100%",minWidth:0},className:`glass-p-4 glass-space-y-4 glass-max-w-full glass-overflow-auto ${me}`,...de,children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-gap-3 glass-min-w-0",children:[e.jsxs("div",{className:"glass-min-w-0",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary-glass-opacity-90 glass-truncate",children:"AI Art Generator"}),e.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Create stunning AI-generated artwork from text prompts"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[z&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),e.jsx("span",{className:"glass-text-xs",children:"Live"})]}),w&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-4 glass-h-4 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin"}),e.jsx("span",{className:"glass-text-xs",children:"Generating"})]})]})]}),e.jsxs("div",{className:"glass-space-y-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2",children:"Describe your artwork"}),e.jsx("textarea",{value:d,onChange:s=>{Q(s.target.value),W?.(s.target.value)},placeholder:"A majestic dragon soaring through a cosmic nebula, digital art style, highly detailed...",className:"glass-w-full glass-h-20 glass-p-3 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-placeholder-white-opacity-50 glass-resize-none glass-focus-outline-none focus:glass-border-blue"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-gap-3 glass-flex-wrap",children:[e.jsx("div",{className:"glass-flex glass-items-center glass-space-x-4",children:e.jsxs("label",{className:"glass-flex glass-items-center glass-space-x-2 glass-cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:ue,onChange:s=>he(s.target.checked),className:"glass-w-4 glass-h-4 glass-radius glass-border-white/30"}),e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Enhance Prompt"})]})}),e.jsx(P.button,{className:"glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-font-medium glass-transition-colors disabled:glass-opacity-50",whileHover:v?{scale:1.02}:{},whileTap:v?{scale:.98}:{},onClick:()=>J(d),disabled:w||!d.trim(),children:w?"Generating...":"Generate Art"})]})]}),w&&e.jsxs("div",{className:`
            glass-p-3 glass-radius-lg glass-border glass-border-blue/30
            ${je({blur:"sm",opacity:.8}).background}
          `,children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-2",children:[e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Generating artwork..."}),e.jsxs("span",{className:"glass-text-sm glass-font-medium glass-text-primary",children:[Math.round(Y),"%"]})]}),e.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:e.jsx(P.div,{className:"glass-surface-blue glass-h-2 glass-radius-full",animate:{width:`${Y}%`},transition:B?{duration:0}:{duration:.3}})})]}),ee.length>0&&e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Generated Artwork"}),e.jsx("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-3 lg:glass-grid-cols-4 glass-gap-4",children:ee.map((s,t)=>e.jsxs(P.div,{className:"glass-relative glass-aspect-square glass-radius-lg glass-overflow-hidden glass-surface-subtle/10 glass-group glass-cursor-pointer",whileHover:v?{scale:1.02}:{},initial:{opacity:0,scale:.9},animate:B?{}:{opacity:1,scale:1},transition:B?{duration:0}:{duration:.3},children:[e.jsx("img",{src:s,alt:`Generated art ${t+1}`,className:"glass-w-full glass-h-full glass-object-cover"}),e.jsx("div",{className:"glass-absolute glass-inset-0 glass-surface-dark/50 glass-opacity-0 glass-group-glass-hover-opacity-100 glass-transition-opacity glass-flex glass-items-center glass-justify-center",children:e.jsx("button",{className:"glass-p-2 glass-surface-subtle/20 glass-radius-lg glass-text-primary hover:glass-surface-subtle/30 glass-transition-colors",children:e.jsx("svg",{className:"glass-w-5 glass-h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"})})})})]},t))})]}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4",children:[le&&e.jsx(fe,{}),ce&&e.jsx(xe,{})]}),ge&&se.length>0&&e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Recent Generations"}),e.jsx("div",{className:"glass-space-y-2 glass-max-glass-h-64 glass-overflow-y-auto",children:se.map(s=>e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-3 glass-p-2 glass-radius-lg glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-cursor-pointer glass-transition-colors",onClick:()=>{Q(s.prompt),W?.(s.prompt)},children:[e.jsx("img",{src:s.imageUrl,alt:"Generated",className:"glass-w-12 glass-h-12 glass-radius glass-object-cover"}),e.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[e.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-90 glass-truncate",children:s.prompt}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-mt-1",children:[e.jsx("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:s.settings.model}),e.jsx("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:s.settings.resolution}),e.jsx("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:new Date(s.timestamp).toLocaleDateString()})]})]})]},s.id))})]}),e.jsx("canvas",{ref:ae,className:"glass-hidden"})]})});O.displayName="GlassGenerativeArt";try{O.displayName="GlassGenerativeArt",O.__docgenInfo={description:"",displayName:"GlassGenerativeArt",props:{prompt:{defaultValue:{value:""},description:"",name:"prompt",required:!1,type:{name:"string | undefined"}},suggestions:{defaultValue:{value:`[
  {
    id: "cosmic-abstract",
    text: "Cosmic abstract painting with swirling galaxies and nebulae in vibrant colors",
    style: "abstract expressionism",
    category: "abstract",
    tags: ["space", "cosmic", "vibrant", "swirling"],
  },
  {
    id: "cyberpunk-city",
    text: "Cyberpunk cityscape at night with neon lights reflecting on wet streets",
    style: "digital art",
    category: "architecture",
    tags: ["cyberpunk", "neon", "city", "night"],
  },
  {
    id: "ethereal-portrait",
    text: "Ethereal portrait of a person made of flowing light and energy",
    style: "digital painting",
    category: "portrait",
    tags: ["ethereal", "light", "energy", "flowing"],
  },
  {
    id: "surreal-landscape",
    text: "Surreal landscape with floating islands and impossible waterfalls",
    style: "surrealism",
    category: "landscape",
    tags: ["surreal", "floating", "impossible", "waterfalls"],
  },
  {
    id: "biomech-fusion",
    text: "Biomechanical fusion of organic forms and technological components",
    style: "biomechanical art",
    category: "surreal",
    tags: ["biomechanical", "organic", "technology", "fusion"],
  },
]`},description:"",name:"suggestions",required:!1,type:{name:"ArtPrompt[] | undefined"}},generationSettings:{defaultValue:{value:"{}"},description:"",name:"generationSettings",required:!1,type:{name:"Partial<GenerationSettings> | undefined"}},showPromptLibrary:{defaultValue:{value:"false"},description:"",name:"showPromptLibrary",required:!1,type:{name:"boolean | undefined"}},showAdvancedSettings:{defaultValue:{value:"false"},description:"",name:"showAdvancedSettings",required:!1,type:{name:"boolean | undefined"}},showGenerationHistory:{defaultValue:{value:"false"},description:"",name:"showGenerationHistory",required:!1,type:{name:"boolean | undefined"}},enableIterativeGeneration:{defaultValue:{value:"true"},description:"",name:"enableIterativeGeneration",required:!1,type:{name:"boolean | undefined"}},enablePromptEnhancement:{defaultValue:{value:"true"},description:"",name:"enablePromptEnhancement",required:!1,type:{name:"boolean | undefined"}},enableStyleMixing:{defaultValue:{value:"false"},description:"",name:"enableStyleMixing",required:!1,type:{name:"boolean | undefined"}},realTimeGeneration:{defaultValue:{value:"false"},description:"",name:"realTimeGeneration",required:!1,type:{name:"boolean | undefined"}},onPromptChange:{defaultValue:null,description:"",name:"onPromptChange",required:!1,type:{name:"((prompt: string) => void) | undefined"}},onGenerate:{defaultValue:null,description:"",name:"onGenerate",required:!1,type:{name:"((prompt: string, settings: GenerationSettings) => void) | undefined"}},onImageGenerated:{defaultValue:null,description:"",name:"onImageGenerated",required:!1,type:{name:"((imageUrl: string, metadata: GeneratedImageMetadata) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const r=[{id:"cosmic-abstract",text:"Cosmic abstract painting with swirling galaxies and nebulae in vibrant colors",style:"abstract expressionism",category:"abstract",tags:["space","cosmic","vibrant","swirling"]},{id:"cyberpunk-city",text:"Cyberpunk cityscape at night with neon lights reflecting on wet streets",style:"digital art",category:"architecture",tags:["cyberpunk","neon","city","night"]},{id:"ethereal-portrait",text:"Ethereal portrait of a person made of flowing light and energy",style:"digital painting",category:"portrait",tags:["ethereal","light","energy","flowing"]},{id:"surreal-landscape",text:"Surreal landscape with floating islands and impossible waterfalls",style:"surrealism",category:"landscape",tags:["surreal","floating","impossible","waterfalls"]},{id:"biomech-fusion",text:"Biomechanical fusion of organic forms and technological components",style:"biomechanical art",category:"surreal",tags:["biomechanical","organic","technology","fusion"]},{id:"ocean-depths",text:"Deep ocean scene with bioluminescent creatures and coral reefs",style:"photorealistic",category:"nature",tags:["ocean","bioluminescent","coral","deep"]}],Ue={title:"AI + Intelligence/Glass Generative Art",component:O,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{prompt:{control:"text"},showPromptLibrary:{control:"boolean"},showAdvancedSettings:{control:"boolean"},showGenerationHistory:{control:"boolean"},enableIterativeGeneration:{control:"boolean"},enablePromptEnhancement:{control:"boolean"},enableStyleMixing:{control:"boolean"},realTimeGeneration:{control:"boolean"}}},j={args:{prompt:"A majestic dragon soaring through a cosmic nebula",suggestions:r,showPromptLibrary:!0,showAdvancedSettings:!0,showGenerationHistory:!0,enableIterativeGeneration:!0,enablePromptEnhancement:!0,enableStyleMixing:!1,realTimeGeneration:!1}},A={args:{prompt:"Peaceful zen garden with cherry blossoms",suggestions:r.slice(0,3),showPromptLibrary:!1,showAdvancedSettings:!1,showGenerationHistory:!1,enablePromptEnhancement:!0,realTimeGeneration:!1}},G={args:{prompt:"",suggestions:r,showPromptLibrary:!0,showAdvancedSettings:!1,showGenerationHistory:!1,enablePromptEnhancement:!0,realTimeGeneration:!1}},N={args:{prompt:"Futuristic city with flying cars and holographic displays",suggestions:r,showPromptLibrary:!0,showAdvancedSettings:!0,showGenerationHistory:!0,enableIterativeGeneration:!0,enablePromptEnhancement:!0,enableStyleMixing:!0,realTimeGeneration:!1,generationSettings:{model:"stable-diffusion",style:"cyberpunk",resolution:"1024x1024",steps:30,guidance:8.5,iterations:2}}},k={args:{prompt:"Abstract geometric patterns with vibrant colors",suggestions:r,showPromptLibrary:!0,showAdvancedSettings:!0,showGenerationHistory:!0,enablePromptEnhancement:!0,realTimeGeneration:!0}},M={args:{prompt:"Flowing abstract forms with gradient colors and dynamic movement",suggestions:r.filter(l=>l.category==="abstract"),showPromptLibrary:!0,showAdvancedSettings:!0,enablePromptEnhancement:!0,generationSettings:{style:"abstract expressionism",steps:25,guidance:7}}},L={args:{prompt:"Portrait of a wise elder with kind eyes and weathered features",suggestions:r.filter(l=>l.category==="portrait"),showPromptLibrary:!0,showAdvancedSettings:!0,enablePromptEnhancement:!0,generationSettings:{style:"photorealistic",resolution:"768x768",steps:35,guidance:9}}},E={args:{prompt:"Majestic mountain range at sunset with golden light",suggestions:r.filter(l=>l.category==="landscape"),showPromptLibrary:!0,showAdvancedSettings:!0,enablePromptEnhancement:!0,generationSettings:{style:"photorealistic",resolution:"1920x1080",steps:30,guidance:7.5}}},I={args:{prompt:"Melting clocks in a dreamlike landscape with impossible architecture",suggestions:r.filter(l=>l.category==="surreal"),showPromptLibrary:!0,showAdvancedSettings:!0,enablePromptEnhancement:!0,generationSettings:{style:"surrealism",steps:40,guidance:8}}},C={args:{prompt:"Enchanted forest with magical creatures and glowing mushrooms",suggestions:r.filter(l=>l.category==="nature"),showPromptLibrary:!0,showAdvancedSettings:!0,enablePromptEnhancement:!0,generationSettings:{style:"fantasy art",resolution:"768x768",steps:28,guidance:7.5}}},H={args:{prompt:"Detailed architectural interior with ornate decorations",suggestions:r,showPromptLibrary:!0,showAdvancedSettings:!0,showGenerationHistory:!0,enablePromptEnhancement:!0,generationSettings:{model:"dall-e",style:"photorealistic",resolution:"1024x1024",steps:50,guidance:10,iterations:1}}},T={args:{prompt:"Colorful bird in tropical paradise",suggestions:r,showPromptLibrary:!0,showAdvancedSettings:!0,enableIterativeGeneration:!0,enablePromptEnhancement:!0,generationSettings:{iterations:4,steps:25,guidance:7.5}}},D={args:{prompt:"Modern city skyline in impressionist painting style",suggestions:r,showPromptLibrary:!0,showAdvancedSettings:!0,enableStyleMixing:!0,enablePromptEnhancement:!0,generationSettings:{style:"impressionism",steps:35,guidance:8}}},R={args:{prompt:"Simple drawing of a cat",suggestions:r,showPromptLibrary:!0,showAdvancedSettings:!0,enablePromptEnhancement:!1,realTimeGeneration:!1}},F={args:{prompt:"Anime character with magical powers",suggestions:r,showPromptLibrary:!0,showAdvancedSettings:!0,enablePromptEnhancement:!0,generationSettings:{model:"custom",style:"anime",resolution:"768x768",steps:30,guidance:8}}},q={args:{prompt:"Generated artwork example",suggestions:r.slice(0,2),showPromptLibrary:!1,showAdvancedSettings:!1,showGenerationHistory:!0,enablePromptEnhancement:!0}},V={args:{prompt:"Panoramic view of alien planet with multiple moons",suggestions:r,showPromptLibrary:!0,showAdvancedSettings:!0,enablePromptEnhancement:!0,generationSettings:{resolution:"1920x1080",style:"sci-fi",steps:32,guidance:7.8}}},U={args:{prompt:"Creative interpretation of music as visual art",suggestions:r,showPromptLibrary:!0,showAdvancedSettings:!0,enablePromptEnhancement:!0,generationSettings:{guidance:3,steps:40,style:"abstract expressionism"}}},$={args:{prompt:"Precise technical blueprint of futuristic machine",suggestions:r,showPromptLibrary:!0,showAdvancedSettings:!0,enablePromptEnhancement:!0,generationSettings:{guidance:15,steps:35,style:"technical illustration"}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'A majestic dragon soaring through a cosmic nebula',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    showGenerationHistory: true,
    enableIterativeGeneration: true,
    enablePromptEnhancement: true,
    enableStyleMixing: false,
    realTimeGeneration: false
  }
}`,...j.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Peaceful zen garden with cherry blossoms',
    suggestions: mockArtPrompts.slice(0, 3),
    showPromptLibrary: false,
    showAdvancedSettings: false,
    showGenerationHistory: false,
    enablePromptEnhancement: true,
    realTimeGeneration: false
  }
}`,...A.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: '',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: false,
    showGenerationHistory: false,
    enablePromptEnhancement: true,
    realTimeGeneration: false
  }
}`,...G.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Futuristic city with flying cars and holographic displays',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    showGenerationHistory: true,
    enableIterativeGeneration: true,
    enablePromptEnhancement: true,
    enableStyleMixing: true,
    realTimeGeneration: false,
    generationSettings: {
      model: 'stable-diffusion',
      style: 'cyberpunk',
      resolution: '1024x1024',
      steps: 30,
      guidance: 8.5,
      iterations: 2
    }
  }
}`,...N.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Abstract geometric patterns with vibrant colors',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    showGenerationHistory: true,
    enablePromptEnhancement: true,
    realTimeGeneration: true
  }
}`,...k.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Flowing abstract forms with gradient colors and dynamic movement',
    suggestions: mockArtPrompts.filter(p => p.category === 'abstract'),
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      style: 'abstract expressionism',
      steps: 25,
      guidance: 7.0
    }
  }
}`,...M.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Portrait of a wise elder with kind eyes and weathered features',
    suggestions: mockArtPrompts.filter(p => p.category === 'portrait'),
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      style: 'photorealistic',
      resolution: '768x768',
      steps: 35,
      guidance: 9.0
    }
  }
}`,...L.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Majestic mountain range at sunset with golden light',
    suggestions: mockArtPrompts.filter(p => p.category === 'landscape'),
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      style: 'photorealistic',
      resolution: '1920x1080',
      steps: 30,
      guidance: 7.5
    }
  }
}`,...E.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Melting clocks in a dreamlike landscape with impossible architecture',
    suggestions: mockArtPrompts.filter(p => p.category === 'surreal'),
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      style: 'surrealism',
      steps: 40,
      guidance: 8.0
    }
  }
}`,...I.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Enchanted forest with magical creatures and glowing mushrooms',
    suggestions: mockArtPrompts.filter(p => p.category === 'nature'),
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      style: 'fantasy art',
      resolution: '768x768',
      steps: 28,
      guidance: 7.5
    }
  }
}`,...C.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Detailed architectural interior with ornate decorations',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    showGenerationHistory: true,
    enablePromptEnhancement: true,
    generationSettings: {
      model: 'dall-e',
      style: 'photorealistic',
      resolution: '1024x1024',
      steps: 50,
      guidance: 10.0,
      iterations: 1
    }
  }
}`,...H.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Colorful bird in tropical paradise',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enableIterativeGeneration: true,
    enablePromptEnhancement: true,
    generationSettings: {
      iterations: 4,
      steps: 25,
      guidance: 7.5
    }
  }
}`,...T.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Modern city skyline in impressionist painting style',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enableStyleMixing: true,
    enablePromptEnhancement: true,
    generationSettings: {
      style: 'impressionism',
      steps: 35,
      guidance: 8.0
    }
  }
}`,...D.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Simple drawing of a cat',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: false,
    realTimeGeneration: false
  }
}`,...R.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Anime character with magical powers',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      model: 'custom',
      style: 'anime',
      resolution: '768x768',
      steps: 30,
      guidance: 8.0
    }
  }
}`,...F.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Generated artwork example',
    suggestions: mockArtPrompts.slice(0, 2),
    showPromptLibrary: false,
    showAdvancedSettings: false,
    showGenerationHistory: true,
    enablePromptEnhancement: true
  }
}`,...q.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Panoramic view of alien planet with multiple moons',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      resolution: '1920x1080',
      style: 'sci-fi',
      steps: 32,
      guidance: 7.8
    }
  }
}`,...V.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Creative interpretation of music as visual art',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      guidance: 3.0,
      steps: 40,
      style: 'abstract expressionism'
    }
  }
}`,...U.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    prompt: 'Precise technical blueprint of futuristic machine',
    suggestions: mockArtPrompts,
    showPromptLibrary: true,
    showAdvancedSettings: true,
    enablePromptEnhancement: true,
    generationSettings: {
      guidance: 15.0,
      steps: 35,
      style: 'technical illustration'
    }
  }
}`,...$.parameters?.docs?.source}}};const $e=["Default","MinimalInterface","PromptLibraryFocus","AdvancedMode","RealTimeGeneration","AbstractArtFocus","PortraitMode","LandscapeMode","SurrealArt","NatureTheme","HighQualityMode","MultipleIterations","StyleMixing","PromptEnhancementDisabled","CustomModel","HistoryFocus","WideAspectRatio","LowGuidance","HighGuidance"];export{M as AbstractArtFocus,N as AdvancedMode,F as CustomModel,j as Default,$ as HighGuidance,H as HighQualityMode,q as HistoryFocus,E as LandscapeMode,U as LowGuidance,A as MinimalInterface,T as MultipleIterations,C as NatureTheme,L as PortraitMode,R as PromptEnhancementDisabled,G as PromptLibraryFocus,k as RealTimeGeneration,D as StyleMixing,I as SurrealArt,V as WideAspectRatio,$e as __namedExportsOrder,Ue as default};
