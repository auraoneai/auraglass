import{r as o,b as Ce,d as f,j as e,m as b}from"./iframe-GrkikuRp.js";import{u as Ne}from"./useMotionPreference-Bmt0fF-P.js";import{u as Pe}from"./a11y-CCC13-1v.js";import{c as ke}from"./createGlassStyle-BfWnO-qv.js";import{u as Ae}from"./soundDesign-CRcNpSlC.js";import{O as Te}from"./OptimizedGlassCore-BK6ui_Z7.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-Cdjfew4F.js";const Ie=[{id:"van-gogh",name:"Van Gogh Starry Night",description:"Impressionistic swirls and bold brushstrokes",previewUrl:"/styles/van-gogh.jpg",strength:.8,category:"artistic"},{id:"picasso",name:"Picasso Cubism",description:"Geometric fragmentation and multiple perspectives",previewUrl:"/styles/picasso.jpg",strength:.7,category:"artistic"},{id:"monet",name:"Monet Water Lilies",description:"Soft impressionistic light and color",previewUrl:"/styles/monet.jpg",strength:.6,category:"artistic"},{id:"film-noir",name:"Film Noir",description:"High contrast black and white cinematography",previewUrl:"/styles/film-noir.jpg",strength:.9,category:"photographic"},{id:"synthwave",name:"Synthwave",description:"Retro-futuristic neon aesthetics",previewUrl:"/styles/synthwave.jpg",strength:.8,category:"modern"},{id:"kandinsky",name:"Kandinsky Abstract",description:"Geometric abstraction with vibrant colors",previewUrl:"/styles/kandinsky.jpg",strength:.7,category:"abstract"}],Le={"--glass-text-primary":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))","--typography-text-primary":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))","--glass-theme-text":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))",color:"var(--glass-theme-text, rgba(255, 255, 255, 0.95))"},z=o.forwardRef(({sourceImage:g,styleModels:K=Ie,selectedStyle:le="",transferStrength:ne=.7,compact:d=!1,showHeader:oe=!d,showActions:ie=!d,realTimePreview:h=!0,showProgressIndicator:Q=!0,showStyleLibrary:ce=!1,showAdvancedControls:de=!1,preserveColors:ge=!1,enhanceDetails:ue=!0,blendMode:me="normal",resolution:he="medium",onStyleSelect:X,onTransferComplete:Y,onProgressUpdate:Z,className:pe="",...ye},fe)=>{const ve=Ce(),[v,ee]=o.useState(!1),[j,J]=o.useState(0),[M,se]=o.useState(""),[i,we]=o.useState(g||""),[c,Se]=o.useState(le),[u,w]=o.useState({strength:ne,preserveColors:ge,enhanceDetails:ue,blendMode:me,resolution:he}),re=o.useRef(null),ae=o.useRef(null);Pe("glass-style-transfer");const{shouldAnimate:m}=Ne(),{play:S}=Ae(),p=o.useCallback(async(s,a)=>{if(!s||!a)return;ee(!0),J(0),S("processing");const y=[{label:"Loading models...",duration:f.DURATION.slow},{label:"Analyzing content...",duration:f.DURATION.slower*1.1},{label:"Extracting style features...",duration:f.DURATION.slower*1.4},{label:"Applying style transfer...",duration:f.DURATION.slower*2.1},{label:"Optimizing result...",duration:f.DURATION.slower},{label:"Finalizing...",duration:f.DURATION.slow*1.4}];let x=0;for(let t=0;t<y.length;t++){const C=y[t];await new Promise(n=>setTimeout(n,C.duration)),x=(t+1)/y.length*100,J(x),Z?.(x)}const l=re.current;if(l){const t=l.getContext("2d");if(t){const C=K.find(N=>N.id===a),n=t.createLinearGradient(0,0,l.width,l.height);switch(C?.category){case"artistic":n.addColorStop(0,"hsl(var(--glass-color-danger))"),n.addColorStop(.5,"hsl(var(--glass-color-info))"),n.addColorStop(1,"hsl(var(--glass-color-primary))");break;case"photographic":n.addColorStop(0,"#2D3748"),n.addColorStop(.5,"#4A5568"),n.addColorStop(1,"#718096");break;case"abstract":n.addColorStop(0,"#9F7AEA"),n.addColorStop(.5,"#F093FB"),n.addColorStop(1,"#F9844A");break;default:n.addColorStop(0,"#667EEA"),n.addColorStop(1,"#764BA2")}if(t.fillStyle=n,t.fillRect(0,0,l.width,l.height),C?.category==="artistic")for(let N=0;N<50;N++)t.beginPath(),t.strokeStyle=`rgba(255, 255, 255, ${Math.random()*.3})`,t.lineWidth=Math.random()*3+1,t.moveTo(Math.random()*l.width,Math.random()*l.height),t.lineTo(Math.random()*l.width,Math.random()*l.height),t.stroke();const te=l.toDataURL();se(te),Y?.(te)}}ee(!1),S("success")},[K,Z,Y,S]),xe=o.useCallback(s=>{const a=s.target.files?.[0];if(!a)return;const y=new FileReader;y.onload=x=>{const l=x.target?.result;we(l),h&&c&&p(l,c)},y.readAsDataURL(a)},[h,c,p]),be=o.useCallback(s=>{Se(s),X?.(s),S("select"),h&&i&&p(i,s)},[h,i,p,X,S]);o.useEffect(()=>{if(h&&i&&c){const s=setTimeout(()=>{p(i,c)},500);return()=>clearTimeout(s)}},[u,h,i,c,p]);const je=()=>e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Style Library"}),e.jsx("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-3 glass-gap-3",children:K.map(s=>e.jsxs(b.div,{className:`
                glass-relative glass-p-3 glass-radius-lg glass-border glass-cursor-pointer glass-transition-all glass-duration-200
                ${c===s.id?"glass-border-blue glass-surface-blue/20":"glass-border-white/20 hover:glass-border-white/40 glass-surface-subtle/5"}
              `,whileHover:m?{scale:1.02}:{},whileTap:m?{scale:.98}:{},onClick:()=>be(s.id),children:[e.jsx("div",{className:"glass-aspect-square glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-mb-2 glass-overflow-hidden",children:e.jsx("div",{className:`
                  glass-w-full glass-h-full glass-gradient-primary
                  ${s.category==="artistic"?"from-red-400 to-blue-400":s.category==="photographic"?"from-gray-600 to-gray-800":s.category==="abstract"?"from-purple-400 to-pink-400":s.category==="vintage"?"from-yellow-600 to-orange-800":"from-blue-400 to-purple-600"}
                `})}),e.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-90 glass-font-medium glass-mb-1",children:s.name}),e.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:s.description}),e.jsx("div",{className:"glass-absolute glass-top-2 glass-right-2",children:e.jsx("div",{className:`
                  glass-px-1.5 glass-py-0.5 glass-radius glass-text-xs glass-font-medium
                  ${s.category==="artistic"?"glass-surface-red/20 glass-text-red":s.category==="photographic"?"glass-surface-muted/20 glass-text-secondary":s.category==="abstract"?"glass-surface-primary/20 glass-text-secondary":s.category==="vintage"?"glass-surface-amber/20 glass-text-secondary":"glass-surface-blue/20 glass-text-secondary"}
                `,children:s.category})})]},s.id))})]}),Me=()=>e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Advanced Controls"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-2",children:["Transfer Strength: ",Math.round(u.strength*100),"%"]}),e.jsx("input",{type:"range",min:"0",max:"1",step:"0.1",value:u.strength,onChange:s=>w(a=>({...a,strength:parseFloat(s.target.value)})),"aria-label":`Transfer Strength: ${Math.round(u.strength*100)}%`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer glass-slider"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-2",children:"Resolution"}),e.jsxs("select",{value:u.resolution,onChange:s=>w(a=>({...a,resolution:s.target.value})),"aria-label":"Resolution",className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm",children:[e.jsx("option",{value:"low",children:"Low (512px)"}),e.jsx("option",{value:"medium",children:"Medium (1024px)"}),e.jsx("option",{value:"high",children:"High (2048px)"}),e.jsx("option",{value:"ultra",children:"Ultra (4096px)"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-2",children:"Blend Mode"}),e.jsxs("select",{value:u.blendMode,onChange:s=>w(a=>({...a,blendMode:s.target.value})),"aria-label":"Blend Mode",className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm",children:[e.jsx("option",{value:"normal",children:"Normal"}),e.jsx("option",{value:"multiply",children:"Multiply"}),e.jsx("option",{value:"screen",children:"Screen"}),e.jsx("option",{value:"overlay",children:"Overlay"}),e.jsx("option",{value:"soft-light",children:"Soft Light"})]})]})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-6",children:[e.jsxs("label",{className:"glass-flex glass-items-center glass-space-x-2 glass-cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:u.preserveColors,onChange:s=>w(a=>({...a,preserveColors:s.target.checked})),className:"glass-w-4 glass-h-4 glass-radius glass-border-white/30"}),e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Preserve Colors"})]}),e.jsxs("label",{className:"glass-flex glass-items-center glass-space-x-2 glass-cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:u.enhanceDetails,onChange:s=>w(a=>({...a,enhanceDetails:s.target.checked})),className:"glass-w-4 glass-h-4 glass-radius glass-border-white/30"}),e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Enhance Details"})]})]})]});return e.jsxs(Te,{ref:fe,variant:"frosted","data-glass-component":!0,className:`${d?"glass-p-3 glass-space-y-3":"glass-p-4 glass-space-y-4"} glass-max-w-full glass-overflow-auto ${pe}`,style:{...Le,maxHeight:"100%",minWidth:0,height:d?"100%":void 0,overflow:d?"hidden":void 0},...ye,children:[oe&&e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-gap-3 glass-min-w-0",children:[e.jsxs("div",{className:"glass-min-w-0",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary-glass-opacity-90 glass-truncate",children:"Style Transfer AI"}),e.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Transform your images with artistic styles"})]}),e.jsx("div",{className:"glass-flex glass-items-center glass-space-x-2",children:h&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),e.jsx("span",{className:"glass-text-xs",children:"Real-time"})]})})]}),e.jsxs("div",{className:`glass-grid ${d?"glass-grid-cols-2 glass-gap-3":"glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-3"}`,style:d?{gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:10}:void 0,children:[e.jsxs("div",{className:"glass-space-y-2",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Source Image"}),e.jsxs("div",{className:"glass-relative glass-aspect-video glass-surface-subtle/5 glass-border glass-border-dashed glass-border-white/30 glass-radius-lg glass-overflow-hidden glass-cursor-pointer hover:glass-border-white/50 glass-transition-colors",onClick:()=>ae.current?.click(),children:[i?e.jsx("img",{src:i,alt:"Source",className:"glass-w-full glass-h-full glass-object-cover"}):e.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full glass-text-primary-glass-opacity-50",children:e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"📷"}),!d&&e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Click to upload image"}),e.jsx("p",{className:"glass-text-xs glass-mt-1",children:"PNG, JPG up to 10MB"})]})]})}),e.jsx("input",{ref:ae,type:"file",accept:"image/*",onChange:xe,"aria-label":"Upload image file",className:"glass-hidden glass-touch-target glass-contrast-guard"})]})]}),e.jsxs("div",{className:"glass-space-y-2",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Style Preview"}),v&&Q&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-text-primary",children:[e.jsx("div",{className:"glass-w-4 glass-h-4 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin"}),e.jsxs("span",{className:"glass-text-xs",children:[Math.round(j),"%"]})]})]}),e.jsxs("div",{className:"glass-relative glass-aspect-video glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden",children:[M?e.jsx("img",{src:M,alt:"Styled preview",className:"glass-w-full glass-h-full glass-object-cover"}):e.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full glass-text-primary-glass-opacity-50",children:e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"🎨"}),!d&&e.jsx("p",{children:"Style preview will appear here"})]})}),v&&e.jsx("div",{className:"glass-absolute glass-inset-0 glass-surface-dark/50 glass-flex glass-items-center glass-justify-center",children:e.jsxs("div",{className:"glass-text-center glass-text-primary",children:[e.jsx("div",{className:"glass-w-8 glass-h-8 glass-border-2 glass-border-white glass-border-t-transparent glass-radius-full glass-animate-spin glass-mx-auto glass-mb-2"}),e.jsx("div",{className:"glass-text-sm",children:"Processing..."}),e.jsxs("div",{className:"glass-text-xs glass-mt-1",children:[Math.round(j),"% complete"]})]})})]}),e.jsx("canvas",{ref:re,width:512,height:512,className:"glass-hidden"})]})]}),ce&&e.jsx(je,{}),de&&e.jsx(Me,{}),ie&&e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-gap-3 glass-pt-3 glass-border-t glass-border-white/10 glass-flex-wrap",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-flex-wrap",children:[e.jsx(b.button,{className:"glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors",whileHover:m?{scale:1.02}:{},whileTap:m?{scale:.98}:{},onClick:()=>i&&c&&p(i,c),disabled:v||!i||!c,children:v?"Processing...":"Apply Style"}),e.jsx(b.button,{className:"glass-px-4 glass-py-2 glass-border glass-border-white/30 hover:glass-border-white/50 glass-text-primary-glass-opacity-80 glass-radius-lg glass-text-sm glass-transition-colors",whileHover:m?{scale:1.02}:{},whileTap:m?{scale:.98}:{},onClick:()=>{se(""),J(0)},children:"Clear"})]}),M&&e.jsx(b.a,{href:M,download:"styled-image.png",className:"glass-px-4 glass-py-2 glass-surface-green hover:glass-surface-green glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors",whileHover:m?{scale:1.02}:{},whileTap:m?{scale:.98}:{},children:"Download Result"})]}),v&&Q&&e.jsxs("div",{className:`
            glass-p-3 glass-radius-lg glass-border glass-border-blue/30
            ${ke({blur:"sm",opacity:.8}).background}
          `,children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-2",children:[e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Processing Style Transfer"}),e.jsxs("span",{className:"glass-text-sm glass-font-medium glass-text-primary",children:[Math.round(j),"%"]})]}),e.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:e.jsx(b.div,{className:"glass-surface-blue glass-h-2 glass-radius-full",animate:{width:`${j}%`},transition:ve?{duration:0}:{duration:.3}})})]})]})});z.displayName="GlassStyleTransfer";try{z.displayName="GlassStyleTransfer",z.__docgenInfo={description:"",displayName:"GlassStyleTransfer",props:{sourceImage:{defaultValue:null,description:"",name:"sourceImage",required:!1,type:{name:"string | undefined"}},styleModels:{defaultValue:{value:`[
  {
    id: "van-gogh",
    name: "Van Gogh Starry Night",
    description: "Impressionistic swirls and bold brushstrokes",
    previewUrl: "/styles/van-gogh.jpg",
    strength: 0.8,
    category: "artistic",
  },
  {
    id: "picasso",
    name: "Picasso Cubism",
    description: "Geometric fragmentation and multiple perspectives",
    previewUrl: "/styles/picasso.jpg",
    strength: 0.7,
    category: "artistic",
  },
  {
    id: "monet",
    name: "Monet Water Lilies",
    description: "Soft impressionistic light and color",
    previewUrl: "/styles/monet.jpg",
    strength: 0.6,
    category: "artistic",
  },
  {
    id: "film-noir",
    name: "Film Noir",
    description: "High contrast black and white cinematography",
    previewUrl: "/styles/film-noir.jpg",
    strength: 0.9,
    category: "photographic",
  },
  {
    id: "synthwave",
    name: "Synthwave",
    description: "Retro-futuristic neon aesthetics",
    previewUrl: "/styles/synthwave.jpg",
    strength: 0.8,
    category: "modern",
  },
  {
    id: "kandinsky",
    name: "Kandinsky Abstract",
    description: "Geometric abstraction with vibrant colors",
    previewUrl: "/styles/kandinsky.jpg",
    strength: 0.7,
    category: "abstract",
  },
]`},description:"",name:"styleModels",required:!1,type:{name:"StyleModel[] | undefined"}},selectedStyle:{defaultValue:{value:""},description:"",name:"selectedStyle",required:!1,type:{name:"string | undefined"}},transferStrength:{defaultValue:{value:"0.7"},description:"",name:"transferStrength",required:!1,type:{name:"number | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},showHeader:{defaultValue:{value:"!compact"},description:"",name:"showHeader",required:!1,type:{name:"boolean | undefined"}},showActions:{defaultValue:{value:"!compact"},description:"",name:"showActions",required:!1,type:{name:"boolean | undefined"}},realTimePreview:{defaultValue:{value:"true"},description:"",name:"realTimePreview",required:!1,type:{name:"boolean | undefined"}},showProgressIndicator:{defaultValue:{value:"true"},description:"",name:"showProgressIndicator",required:!1,type:{name:"boolean | undefined"}},showStyleLibrary:{defaultValue:{value:"false"},description:"",name:"showStyleLibrary",required:!1,type:{name:"boolean | undefined"}},showAdvancedControls:{defaultValue:{value:"false"},description:"",name:"showAdvancedControls",required:!1,type:{name:"boolean | undefined"}},preserveColors:{defaultValue:{value:"false"},description:"",name:"preserveColors",required:!1,type:{name:"boolean | undefined"}},enhanceDetails:{defaultValue:{value:"true"},description:"",name:"enhanceDetails",required:!1,type:{name:"boolean | undefined"}},blendMode:{defaultValue:{value:"normal"},description:"",name:"blendMode",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"normal"'},{value:'"multiply"'},{value:'"overlay"'},{value:'"screen"'},{value:'"soft-light"'}]}},resolution:{defaultValue:{value:"medium"},description:"",name:"resolution",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"ultra"'},{value:'"high"'},{value:'"low"'}]}},onStyleSelect:{defaultValue:null,description:"",name:"onStyleSelect",required:!1,type:{name:"((styleId: string) => void) | undefined"}},onTransferComplete:{defaultValue:null,description:"",name:"onTransferComplete",required:!1,type:{name:"((result: string) => void) | undefined"}},onProgressUpdate:{defaultValue:null,description:"",name:"onProgressUpdate",required:!1,type:{name:"((progress: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const r=[{id:"van-gogh",name:"Van Gogh Starry Night",description:"Impressionistic swirls and bold brushstrokes",previewUrl:"/styles/van-gogh.jpg",strength:.8,category:"artistic"},{id:"picasso",name:"Picasso Cubism",description:"Geometric fragmentation and multiple perspectives",previewUrl:"/styles/picasso.jpg",strength:.7,category:"artistic"},{id:"monet",name:"Monet Water Lilies",description:"Soft impressionistic light and color",previewUrl:"/styles/monet.jpg",strength:.6,category:"artistic"},{id:"film-noir",name:"Film Noir",description:"High contrast black and white cinematography",previewUrl:"/styles/film-noir.jpg",strength:.9,category:"photographic"},{id:"synthwave",name:"Synthwave",description:"Retro-futuristic neon aesthetics",previewUrl:"/styles/synthwave.jpg",strength:.8,category:"modern"},{id:"kandinsky",name:"Kandinsky Abstract",description:"Geometric abstraction with vibrant colors",previewUrl:"/styles/kandinsky.jpg",strength:.7,category:"abstract"}],Fe={title:"AI + Intelligence/Glass Style Transfer",component:z,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{transferStrength:{control:{type:"range",min:0,max:1,step:.1}},realTimePreview:{control:"boolean"},showProgressIndicator:{control:"boolean"},showStyleLibrary:{control:"boolean"},showAdvancedControls:{control:"boolean"},preserveColors:{control:"boolean"},enhanceDetails:{control:"boolean"},blendMode:{control:{type:"select",options:["normal","multiply","screen","overlay","soft-light"]}},resolution:{control:{type:"select",options:["low","medium","high","ultra"]}}}},P={args:{styleModels:r,selectedStyle:"van-gogh",transferStrength:.7,realTimePreview:!0,showProgressIndicator:!0,showStyleLibrary:!0,showAdvancedControls:!0,preserveColors:!1,enhanceDetails:!0,blendMode:"normal",resolution:"medium"}},k={args:{styleModels:r.filter(g=>g.category==="artistic"),selectedStyle:"van-gogh",transferStrength:.8,realTimePreview:!0,showStyleLibrary:!0,showAdvancedControls:!0}},A={args:{styleModels:r.filter(g=>g.category==="photographic"),selectedStyle:"film-noir",transferStrength:.9,realTimePreview:!0,showStyleLibrary:!0,showAdvancedControls:!0,preserveColors:!1}},T={args:{styleModels:r.filter(g=>g.category==="abstract"),selectedStyle:"kandinsky",transferStrength:.7,realTimePreview:!0,showStyleLibrary:!0,showAdvancedControls:!0}},I={args:{styleModels:r,selectedStyle:"picasso",transferStrength:1,realTimePreview:!0,showProgressIndicator:!0,showStyleLibrary:!0,showAdvancedControls:!0,enhanceDetails:!0}},L={args:{styleModels:r,selectedStyle:"monet",transferStrength:.3,realTimePreview:!0,showProgressIndicator:!0,showStyleLibrary:!0,showAdvancedControls:!0,preserveColors:!0}},U={args:{styleModels:r,selectedStyle:"van-gogh",transferStrength:.6,realTimePreview:!0,preserveColors:!0,enhanceDetails:!0,showAdvancedControls:!0}},D={args:{styleModels:r,selectedStyle:"synthwave",transferStrength:.8,resolution:"ultra",realTimePreview:!1,showProgressIndicator:!0,showAdvancedControls:!0}},R={args:{styleModels:r,selectedStyle:"film-noir",transferStrength:.7,blendMode:"multiply",realTimePreview:!0,showAdvancedControls:!0}},V={args:{styleModels:r,selectedStyle:"kandinsky",transferStrength:.6,blendMode:"overlay",realTimePreview:!0,showAdvancedControls:!0}},G={args:{styleModels:r,selectedStyle:"monet",transferStrength:.7,showStyleLibrary:!1,showAdvancedControls:!1,showProgressIndicator:!1,realTimePreview:!0}},q={args:{styleModels:r,selectedStyle:"",transferStrength:.7,showStyleLibrary:!0,showAdvancedControls:!1,showProgressIndicator:!0,realTimePreview:!0}},O={args:{styleModels:r,selectedStyle:"van-gogh",transferStrength:.7,showStyleLibrary:!1,showAdvancedControls:!0,showProgressIndicator:!0,realTimePreview:!0}},H={args:{styleModels:r,selectedStyle:"picasso",transferStrength:.8,realTimePreview:!1,showProgressIndicator:!0,showStyleLibrary:!0,showAdvancedControls:!0}},F={args:{styleModels:r,selectedStyle:"van-gogh",transferStrength:.7,realTimePreview:!1,showProgressIndicator:!0,showStyleLibrary:!0,showAdvancedControls:!0,resolution:"high"}},B={args:{styleModels:r,selectedStyle:"synthwave",transferStrength:.7,enhanceDetails:!0,preserveColors:!1,realTimePreview:!0,showAdvancedControls:!0}},E={args:{styleModels:r,selectedStyle:"monet",transferStrength:.8,blendMode:"soft-light",preserveColors:!0,enhanceDetails:!0,showAdvancedControls:!0}},_={args:{styleModels:r,selectedStyle:"kandinsky",transferStrength:.6,blendMode:"screen",realTimePreview:!0,showAdvancedControls:!0}},$={args:{styleModels:r,selectedStyle:"van-gogh",transferStrength:.7,resolution:"low",realTimePreview:!0,showProgressIndicator:!0,showAdvancedControls:!0}},W={args:{styleModels:[...r,{id:"custom-style",name:"Custom Neural Style",description:"User-uploaded style reference",previewUrl:"/styles/custom.jpg",strength:.8,category:"modern"}],selectedStyle:"custom-style",transferStrength:.8,showStyleLibrary:!0,showAdvancedControls:!0}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'van-gogh',
    transferStrength: 0.7,
    realTimePreview: true,
    showProgressIndicator: true,
    showStyleLibrary: true,
    showAdvancedControls: true,
    preserveColors: false,
    enhanceDetails: true,
    blendMode: 'normal',
    resolution: 'medium'
  }
}`,...P.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels.filter(s => s.category === 'artistic'),
    selectedStyle: 'van-gogh',
    transferStrength: 0.8,
    realTimePreview: true,
    showStyleLibrary: true,
    showAdvancedControls: true
  }
}`,...k.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels.filter(s => s.category === 'photographic'),
    selectedStyle: 'film-noir',
    transferStrength: 0.9,
    realTimePreview: true,
    showStyleLibrary: true,
    showAdvancedControls: true,
    preserveColors: false
  }
}`,...A.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels.filter(s => s.category === 'abstract'),
    selectedStyle: 'kandinsky',
    transferStrength: 0.7,
    realTimePreview: true,
    showStyleLibrary: true,
    showAdvancedControls: true
  }
}`,...T.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'picasso',
    transferStrength: 1.0,
    realTimePreview: true,
    showProgressIndicator: true,
    showStyleLibrary: true,
    showAdvancedControls: true,
    enhanceDetails: true
  }
}`,...I.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'monet',
    transferStrength: 0.3,
    realTimePreview: true,
    showProgressIndicator: true,
    showStyleLibrary: true,
    showAdvancedControls: true,
    preserveColors: true
  }
}`,...L.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'van-gogh',
    transferStrength: 0.6,
    realTimePreview: true,
    preserveColors: true,
    enhanceDetails: true,
    showAdvancedControls: true
  }
}`,...U.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'synthwave',
    transferStrength: 0.8,
    resolution: 'ultra',
    realTimePreview: false,
    showProgressIndicator: true,
    showAdvancedControls: true
  }
}`,...D.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'film-noir',
    transferStrength: 0.7,
    blendMode: 'multiply',
    realTimePreview: true,
    showAdvancedControls: true
  }
}`,...R.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'kandinsky',
    transferStrength: 0.6,
    blendMode: 'overlay',
    realTimePreview: true,
    showAdvancedControls: true
  }
}`,...V.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'monet',
    transferStrength: 0.7,
    showStyleLibrary: false,
    showAdvancedControls: false,
    showProgressIndicator: false,
    realTimePreview: true
  }
}`,...G.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: '',
    transferStrength: 0.7,
    showStyleLibrary: true,
    showAdvancedControls: false,
    showProgressIndicator: true,
    realTimePreview: true
  }
}`,...q.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'van-gogh',
    transferStrength: 0.7,
    showStyleLibrary: false,
    showAdvancedControls: true,
    showProgressIndicator: true,
    realTimePreview: true
  }
}`,...O.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'picasso',
    transferStrength: 0.8,
    realTimePreview: false,
    showProgressIndicator: true,
    showStyleLibrary: true,
    showAdvancedControls: true
  }
}`,...H.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'van-gogh',
    transferStrength: 0.7,
    realTimePreview: false,
    showProgressIndicator: true,
    showStyleLibrary: true,
    showAdvancedControls: true,
    resolution: 'high'
  }
}`,...F.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'synthwave',
    transferStrength: 0.7,
    enhanceDetails: true,
    preserveColors: false,
    realTimePreview: true,
    showAdvancedControls: true
  }
}`,...B.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'monet',
    transferStrength: 0.8,
    blendMode: 'soft-light',
    preserveColors: true,
    enhanceDetails: true,
    showAdvancedControls: true
  }
}`,...E.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'kandinsky',
    transferStrength: 0.6,
    blendMode: 'screen',
    realTimePreview: true,
    showAdvancedControls: true
  }
}`,..._.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'van-gogh',
    transferStrength: 0.7,
    resolution: 'low',
    realTimePreview: true,
    showProgressIndicator: true,
    showAdvancedControls: true
  }
}`,...$.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: [...mockStyleModels, {
      id: 'custom-style',
      name: 'Custom Neural Style',
      description: 'User-uploaded style reference',
      previewUrl: '/styles/custom.jpg',
      strength: 0.8,
      category: 'modern'
    }],
    selectedStyle: 'custom-style',
    transferStrength: 0.8,
    showStyleLibrary: true,
    showAdvancedControls: true
  }
}`,...W.parameters?.docs?.source}}};const Be=["Default","ArtisticStyles","PhotographicStyles","AbstractStyles","HighStrengthTransfer","LowStrengthTransfer","ColorPreservation","HighResolution","MultiplyBlendMode","OverlayBlendMode","MinimalInterface","StyleLibraryOnly","AdvancedControlsOnly","ProcessingState","DisabledRealTime","DetailEnhancement","SoftLightBlend","ScreenBlendMode","LowResolutionFast","CustomStyleModel"];export{T as AbstractStyles,O as AdvancedControlsOnly,k as ArtisticStyles,U as ColorPreservation,W as CustomStyleModel,P as Default,B as DetailEnhancement,F as DisabledRealTime,D as HighResolution,I as HighStrengthTransfer,$ as LowResolutionFast,L as LowStrengthTransfer,G as MinimalInterface,R as MultiplyBlendMode,V as OverlayBlendMode,A as PhotographicStyles,H as ProcessingState,_ as ScreenBlendMode,E as SoftLightBlend,q as StyleLibraryOnly,Be as __namedExportsOrder,Fe as default};
