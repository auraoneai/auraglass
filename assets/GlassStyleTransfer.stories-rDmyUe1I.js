import{r as o,b as be,h as je,d as y,j as e,m as x}from"./iframe-BEVTBSqr.js";import{u as Me}from"./useMotionPreference-0AWWC8Sd.js";import{c as Ce}from"./createGlassStyle-BfWnO-qv.js";import{u as Ne}from"./soundDesign-DMAEZrSq.js";import{O as Pe}from"./OptimizedGlassCore-BMFMzxVt.js";import"./preload-helper-PPVm8Dsz.js";const ke=[{id:"van-gogh",name:"Van Gogh Starry Night",description:"Impressionistic swirls and bold brushstrokes",previewUrl:"/styles/van-gogh.jpg",strength:.8,category:"artistic"},{id:"picasso",name:"Picasso Cubism",description:"Geometric fragmentation and multiple perspectives",previewUrl:"/styles/picasso.jpg",strength:.7,category:"artistic"},{id:"monet",name:"Monet Water Lilies",description:"Soft impressionistic light and color",previewUrl:"/styles/monet.jpg",strength:.6,category:"artistic"},{id:"film-noir",name:"Film Noir",description:"High contrast black and white cinematography",previewUrl:"/styles/film-noir.jpg",strength:.9,category:"photographic"},{id:"synthwave",name:"Synthwave",description:"Retro-futuristic neon aesthetics",previewUrl:"/styles/synthwave.jpg",strength:.8,category:"modern"},{id:"kandinsky",name:"Kandinsky Abstract",description:"Geometric abstraction with vibrant colors",previewUrl:"/styles/kandinsky.jpg",strength:.7,category:"abstract"}],z=o.forwardRef(({sourceImage:d,styleModels:W=ke,selectedStyle:te="",transferStrength:le=.7,realTimePreview:m=!0,showProgressIndicator:J=!0,showStyleLibrary:ne=!0,showAdvancedControls:oe=!0,preserveColors:ie=!1,enhanceDetails:ce=!0,blendMode:de="normal",resolution:ge="medium",onStyleSelect:Q,onTransferComplete:X,onProgressUpdate:Y,className:ue="",...me},he)=>{const pe=be(),[f,Z]=o.useState(!1),[b,K]=o.useState(0),[j,ee]=o.useState(""),[i,ye]=o.useState(d||""),[c,fe]=o.useState(te),[g,v]=o.useState({strength:le,preserveColors:ie,enhanceDetails:ce,blendMode:de,resolution:ge}),se=o.useRef(null),re=o.useRef(null);je("glass-style-transfer");const{shouldAnimate:u}=Me(),{play:w}=Ne(),h=o.useCallback(async(s,a)=>{if(!s||!a)return;Z(!0),K(0),w("processing");const p=[{label:"Loading models...",duration:y.DURATION.slow},{label:"Analyzing content...",duration:y.DURATION.slower*1.1},{label:"Extracting style features...",duration:y.DURATION.slower*1.4},{label:"Applying style transfer...",duration:y.DURATION.slower*2.1},{label:"Optimizing result...",duration:y.DURATION.slower},{label:"Finalizing...",duration:y.DURATION.slow*1.4}];let S=0;for(let t=0;t<p.length;t++){const M=p[t];await new Promise(n=>setTimeout(n,M.duration)),S=(t+1)/p.length*100,K(S),Y?.(S)}const l=se.current;if(l){const t=l.getContext("2d");if(t){const M=W.find(C=>C.id===a),n=t.createLinearGradient(0,0,l.width,l.height);switch(M?.category){case"artistic":n.addColorStop(0,"var(--glass-color-danger)"),n.addColorStop(.5,"var(--glass-color-info)"),n.addColorStop(1,"var(--glass-color-primary)");break;case"photographic":n.addColorStop(0,"#2D3748"),n.addColorStop(.5,"#4A5568"),n.addColorStop(1,"#718096");break;case"abstract":n.addColorStop(0,"#9F7AEA"),n.addColorStop(.5,"#F093FB"),n.addColorStop(1,"#F9844A");break;default:n.addColorStop(0,"#667EEA"),n.addColorStop(1,"#764BA2")}if(t.fillStyle=n,t.fillRect(0,0,l.width,l.height),M?.category==="artistic")for(let C=0;C<50;C++)t.beginPath(),t.strokeStyle=`rgba(255, 255, 255, ${Math.random()*.3})`,t.lineWidth=Math.random()*3+1,t.moveTo(Math.random()*l.width,Math.random()*l.height),t.lineTo(Math.random()*l.width,Math.random()*l.height),t.stroke();const ae=l.toDataURL();ee(ae),X?.(ae)}}Z(!1),w("success")},[W,Y,X,w]),ve=o.useCallback(s=>{const a=s.target.files?.[0];if(!a)return;const p=new FileReader;p.onload=S=>{const l=S.target?.result;ye(l),m&&c&&h(l,c)},p.readAsDataURL(a)},[m,c,h]),we=o.useCallback(s=>{fe(s),Q?.(s),w("select"),m&&i&&h(i,s)},[m,i,h,Q,w]);o.useEffect(()=>{if(m&&i&&c){const s=setTimeout(()=>{h(i,c)},500);return()=>clearTimeout(s)}},[g,m,i,c,h]);const Se=()=>e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Style Library"}),e.jsx("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-3 glass-gap-3",children:W.map(s=>e.jsxs(x.div,{className:`
                relative p-3 rounded-lg border cursor-pointer transition-all duration-200
                ${c===s.id?"border-blue-400 bg-blue-400/20":"border-white/20 hover:border-white/40 bg-white/5"}
              `,whileHover:u?{scale:1.02}:{},whileTap:u?{scale:.98}:{},onClick:()=>we(s.id),children:[e.jsx("div",{className:"glass-aspect-square glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-mb-2 glass-overflow-hidden",children:e.jsx("div",{className:`
                  w-full h-full bg-gradient-to-br 
                  ${s.category==="artistic"?"from-red-400 to-blue-400":s.category==="photographic"?"from-gray-600 to-gray-800":s.category==="abstract"?"from-purple-400 to-pink-400":s.category==="vintage"?"from-yellow-600 to-orange-800":"from-blue-400 to-purple-600"}
                `})}),e.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-90 glass-font-medium glass-mb-1",children:s.name}),e.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:s.description}),e.jsx("div",{className:"glass-absolute glass-top-2 glass-right-2",children:e.jsx("div",{className:`
                  px-1.5 py-0.5 rounded text-xs font-medium
                  ${s.category==="artistic"?"bg-red-500/20 text-red-300":s.category==="photographic"?"bg-gray-500/20 text-gray-300":s.category==="abstract"?"bg-purple-500/20 text-purple-300":s.category==="vintage"?"bg-orange-500/20 text-orange-300":"bg-blue-500/20 text-blue-300"}
                `,children:s.category})})]},s.id))})]}),xe=()=>e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Advanced Controls"}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-2",children:["Transfer Strength: ",Math.round(g.strength*100),"%"]}),e.jsx("input",{type:"range",min:"0",max:"1",step:"0.1",value:g.strength,onChange:s=>v(a=>({...a,strength:parseFloat(s.target.value)})),"aria-label":`Transfer Strength: ${Math.round(g.strength*100)}%`,className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer glass-slider"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-2",children:"Resolution"}),e.jsxs("select",{value:g.resolution,onChange:s=>v(a=>({...a,resolution:s.target.value})),"aria-label":"Resolution",className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm",children:[e.jsx("option",{value:"low",children:"Low (512px)"}),e.jsx("option",{value:"medium",children:"Medium (1024px)"}),e.jsx("option",{value:"high",children:"High (2048px)"}),e.jsx("option",{value:"ultra",children:"Ultra (4096px)"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-2",children:"Blend Mode"}),e.jsxs("select",{value:g.blendMode,onChange:s=>v(a=>({...a,blendMode:s.target.value})),"aria-label":"Blend Mode",className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm",children:[e.jsx("option",{value:"normal",children:"Normal"}),e.jsx("option",{value:"multiply",children:"Multiply"}),e.jsx("option",{value:"screen",children:"Screen"}),e.jsx("option",{value:"overlay",children:"Overlay"}),e.jsx("option",{value:"soft-light",children:"Soft Light"})]})]})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-6",children:[e.jsxs("label",{className:"glass-flex glass-items-center glass-space-x-2 glass-cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:g.preserveColors,onChange:s=>v(a=>({...a,preserveColors:s.target.checked})),className:"glass-w-4 glass-h-4 glass-radius glass-border-white/30"}),e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Preserve Colors"})]}),e.jsxs("label",{className:"glass-flex glass-items-center glass-space-x-2 glass-cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:g.enhanceDetails,onChange:s=>v(a=>({...a,enhanceDetails:s.target.checked})),className:"glass-w-4 glass-h-4 glass-radius glass-border-white/30"}),e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Enhance Details"})]})]})]});return e.jsxs(Pe,{ref:he,variant:"frosted",className:`p-6 space-y-6 ${ue}`,...me,children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90",children:"Style Transfer AI"}),e.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Transform your images with artistic styles"})]}),e.jsx("div",{className:"glass-flex glass-items-center glass-space-x-2",children:m&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),e.jsx("span",{className:"glass-text-xs",children:"Real-time"})]})})]}),e.jsxs("div",{className:"glass-grid glass-grid-cols-1 lg:glass-grid-cols-2 glass-gap-6",children:[e.jsxs("div",{className:"glass-space-y-4",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Source Image"}),e.jsxs("div",{className:"glass-relative glass-aspect-square glass-surface-subtle/5 glass-border-2 glass-border-dashed glass-border-white/30 glass-radius-lg glass-overflow-hidden glass-cursor-pointer hover:glass-border-white/50 glass-transition-colors",onClick:()=>re.current?.click(),children:[i?e.jsx("img",{src:i,alt:"Source",className:"glass-w-full glass-h-full glass-object-cover"}):e.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full glass-text-primary-glass-opacity-50",children:e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-2",children:"📷"}),e.jsx("p",{children:"Click to upload image"}),e.jsx("p",{className:"glass-text-xs glass-mt-1",children:"PNG, JPG up to 10MB"})]})}),e.jsx("input",{ref:re,type:"file",accept:"image/*",onChange:ve,"aria-label":"Upload image file",className:"glass-hidden glass-touch-target glass-contrast-guard"})]})]}),e.jsxs("div",{className:"glass-space-y-4",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Style Preview"}),f&&J&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-text-primary",children:[e.jsx("div",{className:"glass-w-4 glass-h-4 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin"}),e.jsxs("span",{className:"glass-text-xs",children:[Math.round(b),"%"]})]})]}),e.jsxs("div",{className:"glass-relative glass-aspect-square glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden",children:[j?e.jsx("img",{src:j,alt:"Styled preview",className:"glass-w-full glass-h-full glass-object-cover"}):e.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full glass-text-primary-glass-opacity-50",children:e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-4xl glass-mb-2",children:"🎨"}),e.jsx("p",{children:"Style preview will appear here"})]})}),f&&e.jsx("div",{className:"glass-absolute glass-inset-0 glass-surface-dark/50 glass-flex glass-items-center glass-justify-center",children:e.jsxs("div",{className:"glass-text-center glass-text-primary",children:[e.jsx("div",{className:"glass-w-8 glass-h-8 glass-border-2 glass-border-white glass-border-t-transparent glass-radius-full glass-animate-spin glass-mx-auto glass-mb-2"}),e.jsx("div",{className:"glass-text-sm",children:"Processing..."}),e.jsxs("div",{className:"glass-text-xs glass-mt-1",children:[Math.round(b),"% complete"]})]})})]}),e.jsx("canvas",{ref:se,width:512,height:512,className:"glass-hidden"})]})]}),ne&&e.jsx(Se,{}),oe&&e.jsx(xe,{}),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-pt-4 glass-border-t glass-border-white/10",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[e.jsx(x.button,{className:"glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors",whileHover:u?{scale:1.02}:{},whileTap:u?{scale:.98}:{},onClick:()=>i&&c&&h(i,c),disabled:f||!i||!c,children:f?"Processing...":"Apply Style"}),e.jsx(x.button,{className:"glass-px-4 glass-py-2 glass-border glass-border-white/30 hover:glass-border-white/50 glass-text-primary-glass-opacity-80 glass-radius-lg glass-text-sm glass-transition-colors",whileHover:u?{scale:1.02}:{},whileTap:u?{scale:.98}:{},onClick:()=>{ee(""),K(0)},children:"Clear"})]}),j&&e.jsx(x.a,{href:j,download:"styled-image.png",className:"glass-px-4 glass-py-2 glass-surface-green hover:glass-surface-green glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors",whileHover:u?{scale:1.02}:{},whileTap:u?{scale:.98}:{},children:"Download Result"})]}),f&&J&&e.jsxs("div",{className:`
            p-3 rounded-lg border border-blue-400/30
            ${Ce({blur:"sm",opacity:.8}).background}
          `,children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-2",children:[e.jsx("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:"Processing Style Transfer"}),e.jsxs("span",{className:"glass-text-sm glass-font-medium glass-text-primary",children:[Math.round(b),"%"]})]}),e.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:e.jsx(x.div,{className:"glass-surface-blue glass-h-2 glass-radius-full",animate:{width:`${b}%`},transition:pe?{duration:0}:{duration:.3}})})]})]})});z.displayName="GlassStyleTransfer";try{z.displayName="GlassStyleTransfer",z.__docgenInfo={description:"",displayName:"GlassStyleTransfer",props:{sourceImage:{defaultValue:null,description:"",name:"sourceImage",required:!1,type:{name:"string | undefined"}},styleModels:{defaultValue:{value:`[
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
]`},description:"",name:"styleModels",required:!1,type:{name:"StyleModel[] | undefined"}},selectedStyle:{defaultValue:{value:""},description:"",name:"selectedStyle",required:!1,type:{name:"string | undefined"}},transferStrength:{defaultValue:{value:"0.7"},description:"",name:"transferStrength",required:!1,type:{name:"number | undefined"}},realTimePreview:{defaultValue:{value:"true"},description:"",name:"realTimePreview",required:!1,type:{name:"boolean | undefined"}},showProgressIndicator:{defaultValue:{value:"true"},description:"",name:"showProgressIndicator",required:!1,type:{name:"boolean | undefined"}},showStyleLibrary:{defaultValue:{value:"true"},description:"",name:"showStyleLibrary",required:!1,type:{name:"boolean | undefined"}},showAdvancedControls:{defaultValue:{value:"true"},description:"",name:"showAdvancedControls",required:!1,type:{name:"boolean | undefined"}},preserveColors:{defaultValue:{value:"false"},description:"",name:"preserveColors",required:!1,type:{name:"boolean | undefined"}},enhanceDetails:{defaultValue:{value:"true"},description:"",name:"enhanceDetails",required:!1,type:{name:"boolean | undefined"}},blendMode:{defaultValue:{value:"normal"},description:"",name:"blendMode",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"normal"'},{value:'"multiply"'},{value:'"overlay"'},{value:'"screen"'},{value:'"soft-light"'}]}},resolution:{defaultValue:{value:"medium"},description:"",name:"resolution",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"low"'},{value:'"high"'},{value:'"ultra"'}]}},onStyleSelect:{defaultValue:null,description:"",name:"onStyleSelect",required:!1,type:{name:"((styleId: string) => void) | undefined"}},onTransferComplete:{defaultValue:null,description:"",name:"onTransferComplete",required:!1,type:{name:"((result: string) => void) | undefined"}},onProgressUpdate:{defaultValue:null,description:"",name:"onProgressUpdate",required:!1,type:{name:"((progress: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const r=[{id:"van-gogh",name:"Van Gogh Starry Night",description:"Impressionistic swirls and bold brushstrokes",previewUrl:"/styles/van-gogh.jpg",strength:.8,category:"artistic"},{id:"picasso",name:"Picasso Cubism",description:"Geometric fragmentation and multiple perspectives",previewUrl:"/styles/picasso.jpg",strength:.7,category:"artistic"},{id:"monet",name:"Monet Water Lilies",description:"Soft impressionistic light and color",previewUrl:"/styles/monet.jpg",strength:.6,category:"artistic"},{id:"film-noir",name:"Film Noir",description:"High contrast black and white cinematography",previewUrl:"/styles/film-noir.jpg",strength:.9,category:"photographic"},{id:"synthwave",name:"Synthwave",description:"Retro-futuristic neon aesthetics",previewUrl:"/styles/synthwave.jpg",strength:.8,category:"modern"},{id:"kandinsky",name:"Kandinsky Abstract",description:"Geometric abstraction with vibrant colors",previewUrl:"/styles/kandinsky.jpg",strength:.7,category:"abstract"}],Re={title:"Glass UI/AI/GlassStyleTransfer",component:z,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{transferStrength:{control:{type:"range",min:0,max:1,step:.1}},realTimePreview:{control:"boolean"},showProgressIndicator:{control:"boolean"},showStyleLibrary:{control:"boolean"},showAdvancedControls:{control:"boolean"},preserveColors:{control:"boolean"},enhanceDetails:{control:"boolean"},blendMode:{control:{type:"select",options:["normal","multiply","screen","overlay","soft-light"]}},resolution:{control:{type:"select",options:["low","medium","high","ultra"]}}}},N={args:{styleModels:r,selectedStyle:"van-gogh",transferStrength:.7,realTimePreview:!0,showProgressIndicator:!0,showStyleLibrary:!0,showAdvancedControls:!0,preserveColors:!1,enhanceDetails:!0,blendMode:"normal",resolution:"medium"}},P={args:{styleModels:r.filter(d=>d.category==="artistic"),selectedStyle:"van-gogh",transferStrength:.8,realTimePreview:!0,showStyleLibrary:!0,showAdvancedControls:!0}},k={args:{styleModels:r.filter(d=>d.category==="photographic"),selectedStyle:"film-noir",transferStrength:.9,realTimePreview:!0,showStyleLibrary:!0,showAdvancedControls:!0,preserveColors:!1}},A={args:{styleModels:r.filter(d=>d.category==="abstract"),selectedStyle:"kandinsky",transferStrength:.7,realTimePreview:!0,showStyleLibrary:!0,showAdvancedControls:!0}},T={args:{styleModels:r,selectedStyle:"picasso",transferStrength:1,realTimePreview:!0,showProgressIndicator:!0,showStyleLibrary:!0,showAdvancedControls:!0,enhanceDetails:!0}},I={args:{styleModels:r,selectedStyle:"monet",transferStrength:.3,realTimePreview:!0,showProgressIndicator:!0,showStyleLibrary:!0,showAdvancedControls:!0,preserveColors:!0}},L={args:{styleModels:r,selectedStyle:"van-gogh",transferStrength:.6,realTimePreview:!0,preserveColors:!0,enhanceDetails:!0,showAdvancedControls:!0}},U={args:{styleModels:r,selectedStyle:"synthwave",transferStrength:.8,resolution:"ultra",realTimePreview:!1,showProgressIndicator:!0,showAdvancedControls:!0}},D={args:{styleModels:r,selectedStyle:"film-noir",transferStrength:.7,blendMode:"multiply",realTimePreview:!0,showAdvancedControls:!0}},R={args:{styleModels:r,selectedStyle:"kandinsky",transferStrength:.6,blendMode:"overlay",realTimePreview:!0,showAdvancedControls:!0}},G={args:{styleModels:r,selectedStyle:"monet",transferStrength:.7,showStyleLibrary:!1,showAdvancedControls:!1,showProgressIndicator:!1,realTimePreview:!0}},q={args:{styleModels:r,selectedStyle:"",transferStrength:.7,showStyleLibrary:!0,showAdvancedControls:!1,showProgressIndicator:!0,realTimePreview:!0}},V={args:{styleModels:r,selectedStyle:"van-gogh",transferStrength:.7,showStyleLibrary:!1,showAdvancedControls:!0,showProgressIndicator:!0,realTimePreview:!0}},O={args:{styleModels:r,selectedStyle:"picasso",transferStrength:.8,realTimePreview:!1,showProgressIndicator:!0,showStyleLibrary:!0,showAdvancedControls:!0}},B={args:{styleModels:r,selectedStyle:"van-gogh",transferStrength:.7,realTimePreview:!1,showProgressIndicator:!0,showStyleLibrary:!0,showAdvancedControls:!0,resolution:"high"}},F={args:{styleModels:r,selectedStyle:"synthwave",transferStrength:.7,enhanceDetails:!0,preserveColors:!1,realTimePreview:!0,showAdvancedControls:!0}},H={args:{styleModels:r,selectedStyle:"monet",transferStrength:.8,blendMode:"soft-light",preserveColors:!0,enhanceDetails:!0,showAdvancedControls:!0}},E={args:{styleModels:r,selectedStyle:"kandinsky",transferStrength:.6,blendMode:"screen",realTimePreview:!0,showAdvancedControls:!0}},_={args:{styleModels:r,selectedStyle:"van-gogh",transferStrength:.7,resolution:"low",realTimePreview:!0,showProgressIndicator:!0,showAdvancedControls:!0}},$={args:{styleModels:[...r,{id:"custom-style",name:"Custom Neural Style",description:"User-uploaded style reference",previewUrl:"/styles/custom.jpg",strength:.8,category:"modern"}],selectedStyle:"custom-style",transferStrength:.8,showStyleLibrary:!0,showAdvancedControls:!0}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels.filter(s => s.category === 'artistic'),
    selectedStyle: 'van-gogh',
    transferStrength: 0.8,
    realTimePreview: true,
    showStyleLibrary: true,
    showAdvancedControls: true
  }
}`,...P.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels.filter(s => s.category === 'photographic'),
    selectedStyle: 'film-noir',
    transferStrength: 0.9,
    realTimePreview: true,
    showStyleLibrary: true,
    showAdvancedControls: true,
    preserveColors: false
  }
}`,...k.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels.filter(s => s.category === 'abstract'),
    selectedStyle: 'kandinsky',
    transferStrength: 0.7,
    realTimePreview: true,
    showStyleLibrary: true,
    showAdvancedControls: true
  }
}`,...A.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'van-gogh',
    transferStrength: 0.6,
    realTimePreview: true,
    preserveColors: true,
    enhanceDetails: true,
    showAdvancedControls: true
  }
}`,...L.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'synthwave',
    transferStrength: 0.8,
    resolution: 'ultra',
    realTimePreview: false,
    showProgressIndicator: true,
    showAdvancedControls: true
  }
}`,...U.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'film-noir',
    transferStrength: 0.7,
    blendMode: 'multiply',
    realTimePreview: true,
    showAdvancedControls: true
  }
}`,...D.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'kandinsky',
    transferStrength: 0.6,
    blendMode: 'overlay',
    realTimePreview: true,
    showAdvancedControls: true
  }
}`,...R.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'van-gogh',
    transferStrength: 0.7,
    showStyleLibrary: false,
    showAdvancedControls: true,
    showProgressIndicator: true,
    realTimePreview: true
  }
}`,...V.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'picasso',
    transferStrength: 0.8,
    realTimePreview: false,
    showProgressIndicator: true,
    showStyleLibrary: true,
    showAdvancedControls: true
  }
}`,...O.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'synthwave',
    transferStrength: 0.7,
    enhanceDetails: true,
    preserveColors: false,
    realTimePreview: true,
    showAdvancedControls: true
  }
}`,...F.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'monet',
    transferStrength: 0.8,
    blendMode: 'soft-light',
    preserveColors: true,
    enhanceDetails: true,
    showAdvancedControls: true
  }
}`,...H.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'kandinsky',
    transferStrength: 0.6,
    blendMode: 'screen',
    realTimePreview: true,
    showAdvancedControls: true
  }
}`,...E.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    styleModels: mockStyleModels,
    selectedStyle: 'van-gogh',
    transferStrength: 0.7,
    resolution: 'low',
    realTimePreview: true,
    showProgressIndicator: true,
    showAdvancedControls: true
  }
}`,..._.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};const Ge=["Default","ArtisticStyles","PhotographicStyles","AbstractStyles","HighStrengthTransfer","LowStrengthTransfer","ColorPreservation","HighResolution","MultiplyBlendMode","OverlayBlendMode","MinimalInterface","StyleLibraryOnly","AdvancedControlsOnly","ProcessingState","DisabledRealTime","DetailEnhancement","SoftLightBlend","ScreenBlendMode","LowResolutionFast","CustomStyleModel"];export{A as AbstractStyles,V as AdvancedControlsOnly,P as ArtisticStyles,L as ColorPreservation,$ as CustomStyleModel,N as Default,F as DetailEnhancement,B as DisabledRealTime,U as HighResolution,T as HighStrengthTransfer,_ as LowResolutionFast,I as LowStrengthTransfer,G as MinimalInterface,D as MultiplyBlendMode,R as OverlayBlendMode,k as PhotographicStyles,O as ProcessingState,E as ScreenBlendMode,H as SoftLightBlend,q as StyleLibraryOnly,Ge as __namedExportsOrder,Re as default};
