import{b as $,r as d,f as I,j as s,m as p,d as o,e as B,c as w,C as _,g as E}from"./iframe-mbNquNNc.js";import{u as O,I as b}from"./IntelligentColorSystem-B-0qaDih.js";import"./preload-helper-PPVm8Dsz.js";function m({entityId:l,brandColors:r,fallbackColors:a={primary:"var(--glass-color-primary)",secondary:I.semantic.secondary},animationDuration:t=o.DURATION.slower,className:g="",children:N}){const n=$(),{currentPalette:k,adaptToBrand:u}=O(),[e,j]=d.useState(null),[S,G]=d.useState(!1),[C,D]=d.useState(!1),U=async c=>(await new Promise(M=>setTimeout(M,o.DURATION.fast/3)),{apple:{entityId:"apple",primaryColor:"var(--brand-apple-primary, #007AFF)",secondaryColor:"var(--brand-apple-secondary, #5856D6)",logoUrl:"/logos/apple.png",colorHistory:[{color:"var(--brand-apple-primary, #007AFF)",timestamp:Date.now()-864e5,confidence:.95},{color:"var(--brand-apple-dark, #1D1D1F)",timestamp:Date.now()-1728e5,confidence:.87}]},google:{entityId:"google",primaryColor:"var(--brand-google-primary, #4285F4)",secondaryColor:"var(--brand-google-secondary, #34A853)",logoUrl:"/logos/google.png",colorHistory:[{color:"var(--brand-google-primary, #4285F4)",timestamp:Date.now()-864e5,confidence:.98},{color:"var(--brand-google-warm, #EA4335)",timestamp:Date.now()-1728e5,confidence:.92}]},microsoft:{entityId:"microsoft",primaryColor:"var(--brand-microsoft-primary, #0078D4)",secondaryColor:"var(--brand-microsoft-secondary, #106EBE)",logoUrl:"/logos/microsoft.png",colorHistory:[{color:"var(--brand-microsoft-primary, #0078D4)",timestamp:Date.now()-864e5,confidence:.93},{color:"var(--brand-microsoft-accent, #00BCF2)",timestamp:Date.now()-1728e5,confidence:.89}]}}[c]||{entityId:c,primaryColor:a.primary,secondaryColor:a.secondary,colorHistory:[]});d.useEffect(()=>{if(!l){j(null);return}let c=!0;return G(!0),U(l).then(x=>{c&&(j(x),D(!0))}).catch(()=>{c&&j({entityId:l,primaryColor:a.primary,secondaryColor:a.secondary,colorHistory:[]})}).finally(()=>{c&&G(!1)}),()=>{c=!1}},[l,a.primary,a.secondary]),d.useEffect(()=>{r&&r.length>0&&u(r)},[r,u]);const R=()=>e?{"--brand-primary":e.primaryColor,"--brand-secondary":e.secondaryColor,"--brand-primary-rgb":P(e.primaryColor),"--brand-secondary-rgb":P(e.secondaryColor),"--brand-primary-alpha-10":`${e.primaryColor}1A`,"--brand-primary-alpha-20":`${e.primaryColor}33`,"--brand-primary-alpha-30":`${e.primaryColor}4D`,"--brand-secondary-alpha-10":`${e.secondaryColor}1A`,"--brand-secondary-alpha-20":`${e.secondaryColor}33`,"--brand-secondary-alpha-30":`${e.secondaryColor}4D`}:{},P=c=>{const x=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);return x?`${parseInt(x[1],16)}, ${parseInt(x[2],16)}, ${parseInt(x[3],16)}`:"0, 0, 0"};return s.jsxs(p.div,{className:`brand-color-integration ${g}`,style:{...R(),position:"relative"},animate:C?{background:["transparent",`${e?.primaryColor}04`,"transparent"]}:{},transition:n?{duration:0}:{duration:t/1e3,ease:o.EASING.easeInOut},onAnimationComplete:()=>{C&&D(!1)},children:[s.jsx(B,{children:S&&s.jsx(p.div,{className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center glass-z-50",style:E({intent:"neutral",elevation:"level2"}),initial:{opacity:0},animate:n?{}:{opacity:1},exit:{opacity:0},children:s.jsxs(p.div,{className:w("glass-flex glass-items-center glass-space-x-3 glass-text-primary"),initial:{y:10,opacity:0},animate:n?{}:{y:0,opacity:1},children:[s.jsx(p.div,{className:w("glass-w-5 glass-h-5 glass-border-2 glass-border-primary glass-border-t-transparent glass-radius-full"),animate:n?{}:{rotate:360},transition:n?{duration:0}:{duration:o.DURATION.slower/1e3,repeat:1/0,ease:o.EASING.linear}}),s.jsx(_,{children:s.jsx("span",{className:"glass-text-sm",children:"Loading brand colors..."})})]})})}),s.jsx(B,{children:e&&!S&&s.jsx(p.div,{className:"glass-absolute glass-top-2 glass-right-2 glass-z-10",initial:{opacity:0,scale:0,y:-10},animate:n?{}:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:0,y:-10},transition:n?{duration:0}:{delay:o.DURATION.fast/1e3,duration:o.DURATION.normal/1e3},children:s.jsxs("div",{className:w("glass-flex glass-items-center glass-space-x-1 glass-px-2 glass-py-1 glass-radius-full glass-text-xs glass-font-medium glass-text-primary"),style:E({intent:"neutral",elevation:"level2"}),children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full",style:{backgroundColor:e.primaryColor}}),s.jsx(_,{children:s.jsx("span",{children:"Brand"})})]})})}),s.jsx(B,{children:C&&e&&s.jsx(p.div,{className:"glass-absolute glass-inset-0 glass-pointer-events-none",style:{background:`radial-gradient(circle at center, ${e.primaryColor}20 0%, transparent 70%)`,borderRadius:"inherit"},initial:{opacity:0,scale:.8},animate:n?{}:{opacity:1,scale:1.02},exit:{opacity:0,scale:1.05},transition:n?{duration:0}:{duration:t/1e3,ease:"easeOut"}})}),N,s.jsx("style",{dangerouslySetInnerHTML:{__html:e?`
          .brand-color-integration {
            --brand-glass-primary: ${e.primaryColor}1A;
            --brand-glass-secondary: ${e.secondaryColor}1A;
            --brand-border-primary: ${e.primaryColor}33;
            --brand-border-secondary: ${e.secondaryColor}33;
            --brand-shadow-primary: 0 8px 32px ${e.primaryColor}20;
            --brand-shadow-secondary: 0 8px 32px ${e.secondaryColor}20;
          }
        `:""}})]})}function i({children:l,variant:r="primary",className:a="",onClick:t,disabled:g=!1,...N}){const n=$(),[k,u]=d.useState(!1),e={primary:{background:'/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',border:"1px solid var(--brand-border-primary, var(--glass-color-primary, 0.3))",boxShadow:"var(--glass-elev-2)",color:"var(--brand-primary, "+I.semantic.primary+")"},secondary:{background:'/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',border:"1px solid var(--brand-border-secondary, rgba(var(--glass-color-brand-secondary-rgb, 30, 64, 175) / 0.3))",boxShadow:"var(--glass-elev-2)",color:"var(--brand-secondary, "+I.semantic.secondary+")"}};return s.jsxs(p.button,{className:`relative px-4 py-2 rounded-lg font-medium transition-all ${a}`,style:{transitionDuration:"var(--glass-motion-duration-fast)",...e[r]},onClick:t,disabled:g,onMouseDown:()=>u(!0),onMouseUp:()=>u(!1),onMouseLeave:()=>u(!1),whileHover:!g&&!n?{scale:1.01,y:-.5,boxShadow:r==="primary"?"var(--brand-shadow-primary, 0 8px 24px color-mix(in srgb, var(--glass-color-primary) 20%, transparent))":"var(--brand-shadow-secondary, 0 8px 24px color-mix(in srgb, var(--glass-color-brand-secondary) 20%, transparent))"}:{},whileTap:!g&&!n?{scale:.99,y:0}:{},transition:{duration:o.DURATION.fast/1e3},animate:{opacity:g?.5:1,filter:g?"grayscale(1)":"grayscale(0)"},...N,children:[l,s.jsx(p.div,{className:"glass-absolute glass-inset-0 glass-radius-lg glass-pointer-events-none",style:{background:`radial-gradient(circle at center, var(--brand-${r}, color-mix(in srgb, var(--glass-color-primary) 20%, transparent)) 0%, transparent 70%)`},animate:k?{scale:[1,1.1,1],opacity:[0,.2,0]}:{},transition:n?{duration:0}:{duration:o.DURATION.fast/1e3,ease:o.EASING.easeOut}})]})}function A(l){const[r,a]=d.useState(null);return d.useEffect(()=>{if(!l)return;(async()=>{try{a({apple:{entityId:"apple",primaryColor:"var(--brand-apple-primary, #007AFF)",secondaryColor:"var(--brand-apple-secondary, #5856D6)",colorHistory:[]},google:{entityId:"google",primaryColor:"var(--brand-google-primary, #4285F4)",secondaryColor:"var(--brand-google-secondary, #34A853)",colorHistory:[]}}[l]||null)}catch{a(null)}})()},[l]),r}try{m.displayName="BrandColorIntegration",m.__docgenInfo={description:"",displayName:"BrandColorIntegration",props:{entityId:{defaultValue:null,description:"",name:"entityId",required:!1,type:{name:"string | undefined"}},brandColors:{defaultValue:null,description:"",name:"brandColors",required:!1,type:{name:"string[] | undefined"}},fallbackColors:{defaultValue:{value:`{
    primary: "var(--glass-color-primary)",
    secondary: COLORS.semantic.secondary,
  }`},description:"",name:"fallbackColors",required:!1,type:{name:"{ primary: string; secondary: string; } | undefined"}},animationDuration:{defaultValue:{value:"700"},description:"",name:"animationDuration",required:!1,type:{name:"number | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{i.displayName="BrandGlassButton",i.__docgenInfo={description:"",displayName:"BrandGlassButton",props:{variant:{defaultValue:{value:"primary"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"primary"'},{value:'"secondary"'}]}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void) | undefined"}},disabled:{defaultValue:{value:"false"},description:"",name:"disabled",required:!1,type:{name:"boolean | undefined"}}}}}catch{}try{A.displayName="useBrandColors",A.__docgenInfo={description:"",displayName:"useBrandColors",props:{}}}catch{}const V={title:"Advanced/BrandColorIntegration",component:m,parameters:{docs:{description:{component:"Dynamic brand color integration system that seamlessly adapts brand colors into the glassmorphism ecosystem with smooth transitions and accessibility compliance."}},layout:"fullscreen"},tags:["autodocs"]},F=()=>{const[l,r]=d.useState("apple"),a=A(l);return s.jsxs("div",{className:"space-y-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"Brand Color Integration"}),s.jsx("p",{className:"glass-text-secondary",children:"Seamlessly integrate brand colors with glassmorphism effects"})]}),s.jsx("div",{className:"glass-flex glass-flex-wrap glass-justify-center glass-gap-4 mb-8",children:["apple","google","microsoft"].map(t=>s.jsx("button",{onClick:()=>r(t),className:`px-6 py-3 rounded-lg font-medium transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard ${l===t?"glass-surface-primary glass-text-primary shadow-lg":"glass-surface-secondary glass-text-secondary hover:glass-surface-hover"}`,children:t.charAt(0).toUpperCase()+t.slice(1)},t))}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-6",children:[s.jsxs("div",{className:"glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-w-12 glass-h-12 glass-radius-full glass-mb-4",style:{backgroundColor:a?.primaryColor||"#007AFF"},children:s.jsx("span",{className:"glass-text-primary glass-font-bold glass-text-lg",children:a?.primaryColor?"✓":"?"})}),s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Primary Color"}),s.jsx("p",{className:"glass-text-secondary glass-text-sm glass-mb-3",children:a?.primaryColor||"Loading..."}),s.jsx("div",{className:"glass-w-full glass-h-3 glass-radius-full glass-surface-accent",children:s.jsx("div",{className:"glass-h-full glass-radius-full transition-all duration-500",style:{backgroundColor:a?.primaryColor||"#007AFF",width:a?.primaryColor?"100%":"0%"}})})]}),s.jsxs("div",{className:"glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-w-12 glass-h-12 glass-radius-full glass-mb-4",style:{backgroundColor:a?.secondaryColor||"#5856D6"},children:s.jsx("span",{className:"glass-text-primary glass-font-bold glass-text-lg",children:a?.secondaryColor?"✓":"?"})}),s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Secondary Color"}),s.jsx("p",{className:"glass-text-secondary glass-text-sm glass-mb-3",children:a?.secondaryColor||"Loading..."}),s.jsx("div",{className:"glass-w-full glass-h-3 glass-radius-full glass-surface-accent",children:s.jsx("div",{className:"glass-h-full glass-radius-full transition-all duration-500",style:{backgroundColor:a?.secondaryColor||"#5856D6",width:a?.secondaryColor?"100%":"0%"}})})]}),s.jsxs("div",{className:"glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-w-12 glass-h-12 glass-radius-full glass-mb-4 glass-surface-accent",children:s.jsx("span",{className:"glass-text-primary glass-font-bold glass-text-lg",children:a?.colorHistory?.length||0})}),s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Color History"}),s.jsxs("p",{className:"glass-text-secondary glass-text-sm glass-mb-3",children:[a?.colorHistory?.length||0," color variations tracked"]}),s.jsx("div",{className:"glass-flex glass-gap-1",children:(a?.colorHistory?.slice(0,5)||[]).map((t,g)=>s.jsx("div",{className:"glass-w-6 glass-h-6 glass-radius-full glass-border glass-border-white/20",style:{backgroundColor:t.color},title:`Confidence: ${(t.confidence*100).toFixed(0)}%`},g))})]})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6",children:[s.jsxs("div",{className:"glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Brand Glass Button"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsx(i,{variant:"primary",className:"glass-w-full",children:"Primary Brand Button"}),s.jsx(i,{variant:"secondary",className:"glass-w-full",children:"Secondary Brand Button"})]})]}),s.jsxs("div",{className:"glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Brand Integration Features"}),s.jsxs("div",{className:"glass-space-y-3 glass-text-primary/80",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"Dynamic color adaptation"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"Smooth transitions"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"Accessibility compliance"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"Color history tracking"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"Entity-based branding"})]})]})]})]})]})},y={args:{entityId:"apple",children:s.jsx(F,{})},render:l=>s.jsx(b,{children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8 dark",children:s.jsx("div",{className:"max-w-6xl glass-mx-auto",children:s.jsx(m,{...l})})})})},v={args:{brandColors:["#FF6B6B","#4ECDC4","#45B7D1"],children:s.jsx(F,{})},render:l=>s.jsx(b,{children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8 dark",children:s.jsx("div",{className:"max-w-6xl glass-mx-auto",children:s.jsx(m,{...l})})})})},h={args:{},render:()=>s.jsx(b,{children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8 dark",children:s.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[s.jsxs("div",{className:"glass-text-center mb-12",children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-primary glass-mb-4",children:"🏢 Entity-Based Branding"}),s.jsx("p",{className:"glass-text-xl glass-text-primary/80",children:"Pre-configured brand integrations for major entities"})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-8 mb-12",children:[s.jsx(m,{entityId:"apple",children:s.jsxs("div",{className:"glass-p-8 glass-text-center",children:[s.jsx("div",{className:"glass-text-6xl glass-mb-4",children:"🍎"}),s.jsx("h3",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-2",children:"Apple"}),s.jsx("p",{className:"glass-text-primary/80",children:"Clean, minimal design with blue accents"}),s.jsxs("div",{className:"mt-6 glass-space-y-3",children:[s.jsx(i,{variant:"primary",children:"Get Started"}),s.jsx(i,{variant:"secondary",children:"Learn More"})]})]})}),s.jsx(m,{entityId:"google",children:s.jsxs("div",{className:"glass-p-8 glass-text-center",children:[s.jsx("div",{className:"glass-text-6xl glass-mb-4",children:"🔍"}),s.jsx("h3",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-2",children:"Google"}),s.jsx("p",{className:"glass-text-primary/80",children:"Colorful and accessible design system"}),s.jsxs("div",{className:"mt-6 glass-space-y-3",children:[s.jsx(i,{variant:"primary",children:"Search"}),s.jsx(i,{variant:"secondary",children:"Explore"})]})]})}),s.jsx(m,{entityId:"microsoft",children:s.jsxs("div",{className:"glass-p-8 glass-text-center",children:[s.jsx("div",{className:"glass-text-6xl glass-mb-4",children:"🪟"}),s.jsx("h3",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-2",children:"Microsoft"}),s.jsx("p",{className:"glass-text-primary/80",children:"Professional and enterprise-focused"}),s.jsxs("div",{className:"mt-6 glass-space-y-3",children:[s.jsx(i,{variant:"primary",children:"Productivity"}),s.jsx(i,{variant:"secondary",children:"Cloud"})]})]})})]}),s.jsxs("div",{className:"glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-8 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-2xl glass-font-bold glass-text-primary mb-6 glass-text-center",children:"Brand Integration Benefits"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-4 glass-gap-6",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"🎨"}),s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Consistent Branding"}),s.jsx("p",{className:"glass-text-secondary glass-text-sm",children:"Maintain brand identity across all components"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"⚡"}),s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Real-time Adaptation"}),s.jsx("p",{className:"glass-text-secondary glass-text-sm",children:"Smooth transitions between brand themes"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"♿"}),s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Accessibility First"}),s.jsx("p",{className:"glass-text-secondary glass-text-sm",children:"WCAG compliant color combinations"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"📊"}),s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Analytics Ready"}),s.jsx("p",{className:"glass-text-secondary glass-text-sm",children:"Color usage tracking and optimization"})]})]})]})]})})})},f={args:{},render:()=>{const[l,r]=d.useState("apple");return s.jsx(b,{children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8 dark",children:s.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[s.jsxs("div",{className:"glass-text-center mb-12",children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-primary glass-mb-4",children:"🔄 Brand Comparison"}),s.jsx("p",{className:"glass-text-xl glass-text-primary/80",children:"Compare how different brands adapt to glassmorphism"})]}),s.jsx("div",{className:"glass-flex glass-justify-center glass-gap-4 mb-8",children:["apple","google","microsoft"].map(a=>s.jsx("button",{onClick:()=>r(a),className:`px-6 py-3 rounded-lg font-medium transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard ${l===a?"glass-surface-primary glass-text-primary shadow-lg scale-105":"glass-surface-secondary glass-text-primary/80 hover:glass-surface-accent"}`,children:a.charAt(0).toUpperCase()+a.slice(1)},a))}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 lg:glass-glass-grid-cols-2 glass-gap-8",children:[s.jsx(m,{entityId:l,children:s.jsxs("div",{className:"glass-p-8",children:[s.jsxs("h3",{className:"glass-text-2xl glass-font-bold glass-text-primary mb-6",children:[l.charAt(0).toUpperCase()+l.slice(1)," Brand Integration"]}),s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{className:"glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-p-4 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-3",children:"Color Palette"}),s.jsxs("div",{className:"glass-flex glass-gap-3",children:[s.jsx("div",{className:"glass-w-12 glass-h-12 glass-radius-lg glass-border glass-border-white/20",style:{backgroundColor:"var(--brand-primary)"}}),s.jsx("div",{className:"glass-w-12 glass-h-12 glass-radius-lg glass-border glass-border-white/20",style:{backgroundColor:"var(--brand-secondary)"}}),s.jsx("div",{className:"glass-w-12 glass-h-12 glass-radius-lg glass-surface-accent"})]})]}),s.jsxs("div",{className:"glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-p-4 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-3",children:"Glass Effects"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsx(i,{variant:"primary",className:"glass-w-full",children:"Primary Action"}),s.jsx(i,{variant:"secondary",className:"glass-w-full",children:"Secondary Action"})]})]}),s.jsxs("div",{className:"glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-p-4 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-3",children:"Brand Features"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/80",children:[s.jsx("div",{children:"• Dynamic color adaptation"}),s.jsx("div",{children:"• Smooth brand transitions"}),s.jsx("div",{children:"• Accessibility compliance"}),s.jsx("div",{children:"• Performance optimized"})]})]})]})]})}),s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{className:"glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Integration Metrics"}),s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{className:"glass-flex glass-justify-between glass-items-center",children:[s.jsx("span",{className:"glass-text-primary/80",children:"Color Harmony"}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-20 glass-h-2 glass-surface-accent glass-radius-full",children:s.jsx("div",{className:"glass-w-16 glass-h-2 glass-surface-green glass-radius-full"})}),s.jsx("span",{className:"glass-text-primary glass-text-sm",children:"80%"})]})]}),s.jsxs("div",{className:"glass-flex glass-justify-between glass-items-center",children:[s.jsx("span",{className:"glass-text-primary/80",children:"Accessibility"}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-20 glass-h-2 glass-surface-accent glass-radius-full",children:s.jsx("div",{className:"w-18 glass-h-2 glass-surface-green glass-radius-full"})}),s.jsx("span",{className:"glass-text-primary glass-text-sm",children:"90%"})]})]}),s.jsxs("div",{className:"glass-flex glass-justify-between glass-items-center",children:[s.jsx("span",{className:"glass-text-primary/80",children:"Performance"}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-20 glass-h-2 glass-surface-accent glass-radius-full",children:s.jsx("div",{className:"w-19 glass-h-2 glass-surface-green glass-radius-full"})}),s.jsx("span",{className:"glass-text-primary glass-text-sm",children:"95%"})]})]})]})]}),s.jsxs("div",{className:"glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Usage Examples"}),s.jsxs("div",{className:"glass-space-y-3 glass-text-primary/80",children:[s.jsx("div",{className:"glass-p-3 glass-surface-muted glass-radius-lg",children:s.jsx("code",{className:"glass-text-sm",children:`<BrandColorIntegration entityId="${l}">`})}),s.jsx("div",{className:"glass-p-3 glass-surface-muted glass-radius-lg",children:s.jsx("code",{className:"glass-text-sm",children:'<BrandGlassButton variant="primary">Action</BrandGlassButton>'})}),s.jsx("div",{className:"glass-p-3 glass-surface-muted glass-radius-lg",children:s.jsxs("code",{className:"glass-text-sm",children:["const brandColors = useBrandColors('",l,"')"]})})]})]})]})]})]})})})}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    entityId: 'apple',
    children: <BrandShowcaseContent />
  },
  render: args => <IntelligentColorProvider>
      <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8 dark">
        <div className="max-w-6xl glass-mx-auto">
          <BrandColorIntegration {...args} />
        </div>
      </div>
    </IntelligentColorProvider>
}`,...y.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    brandColors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
    children: <BrandShowcaseContent />
  },
  render: args => <IntelligentColorProvider>
      <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8 dark">
        <div className="max-w-6xl glass-mx-auto">
          <BrandColorIntegration {...args} />
        </div>
      </div>
    </IntelligentColorProvider>
}`,...v.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <IntelligentColorProvider>
      <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8 dark">
        <div className="max-w-6xl glass-mx-auto">
          <div className="glass-text-center mb-12">
            <h1 className="glass-text-4xl glass-font-bold glass-text-primary glass-mb-4">
              🏢 Entity-Based Branding
            </h1>
            <p className="glass-text-xl glass-text-primary/80">
              Pre-configured brand integrations for major entities
            </p>
          </div>

          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-8 mb-12">
            <BrandColorIntegration entityId="apple">
              <div className="glass-p-8 glass-text-center">
                <div className="glass-text-6xl glass-mb-4">🍎</div>
                <h3 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-2">Apple</h3>
                <p className="glass-text-primary/80">Clean, minimal design with blue accents</p>
                <div className="mt-6 glass-space-y-3">
                  <BrandGlassButton variant="primary">Get Started</BrandGlassButton>
                  <BrandGlassButton variant="secondary">Learn More</BrandGlassButton>
                </div>
              </div>
            </BrandColorIntegration>

            <BrandColorIntegration entityId="google">
              <div className="glass-p-8 glass-text-center">
                <div className="glass-text-6xl glass-mb-4">🔍</div>
                <h3 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-2">Google</h3>
                <p className="glass-text-primary/80">Colorful and accessible design system</p>
                <div className="mt-6 glass-space-y-3">
                  <BrandGlassButton variant="primary">Search</BrandGlassButton>
                  <BrandGlassButton variant="secondary">Explore</BrandGlassButton>
                </div>
              </div>
            </BrandColorIntegration>

            <BrandColorIntegration entityId="microsoft">
              <div className="glass-p-8 glass-text-center">
                <div className="glass-text-6xl glass-mb-4">🪟</div>
                <h3 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-2">Microsoft</h3>
                <p className="glass-text-primary/80">Professional and enterprise-focused</p>
                <div className="mt-6 glass-space-y-3">
                  <BrandGlassButton variant="primary">Productivity</BrandGlassButton>
                  <BrandGlassButton variant="secondary">Cloud</BrandGlassButton>
                </div>
              </div>
            </BrandColorIntegration>
          </div>

          <div className="glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-8 glass-contrast-guard">
            <h3 className="glass-text-2xl glass-font-bold glass-text-primary mb-6 glass-text-center">Brand Integration Benefits</h3>
            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-4 glass-gap-6">
              <div className="glass-text-center">
                <div className="glass-text-4xl glass-mb-3">🎨</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Consistent Branding</h4>
                <p className="glass-text-secondary glass-text-sm">Maintain brand identity across all components</p>
              </div>
              <div className="glass-text-center">
                <div className="glass-text-4xl glass-mb-3">⚡</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Real-time Adaptation</h4>
                <p className="glass-text-secondary glass-text-sm">Smooth transitions between brand themes</p>
              </div>
              <div className="glass-text-center">
                <div className="glass-text-4xl glass-mb-3">♿</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Accessibility First</h4>
                <p className="glass-text-secondary glass-text-sm">WCAG compliant color combinations</p>
              </div>
              <div className="glass-text-center">
                <div className="glass-text-4xl glass-mb-3">📊</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Analytics Ready</h4>
                <p className="glass-text-secondary glass-text-sm">Color usage tracking and optimization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </IntelligentColorProvider>
}`,...h.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const [activeBrand, setActiveBrand] = useState('apple');
    return <IntelligentColorProvider>
        <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8 dark">
          <div className="max-w-6xl glass-mx-auto">
            <div className="glass-text-center mb-12">
              <h1 className="glass-text-4xl glass-font-bold glass-text-primary glass-mb-4">
                🔄 Brand Comparison
              </h1>
              <p className="glass-text-xl glass-text-primary/80">
                Compare how different brands adapt to glassmorphism
              </p>
            </div>

            <div className="glass-flex glass-justify-center glass-gap-4 mb-8">
              {['apple', 'google', 'microsoft'].map(brand => <button key={brand} onClick={() => setActiveBrand(brand)} className={\`px-6 py-3 rounded-lg font-medium transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard \${activeBrand === brand ? 'glass-surface-primary glass-text-primary shadow-lg scale-105' : 'glass-surface-secondary glass-text-primary/80 hover:glass-surface-accent'}\`}>
                  {brand.charAt(0).toUpperCase() + brand.slice(1)}
                </button>)}
            </div>

            <div className="glass-grid glass-glass-grid-cols-1 lg:glass-glass-grid-cols-2 glass-gap-8">
              <BrandColorIntegration entityId={activeBrand}>
                <div className="glass-p-8">
                  <h3 className="glass-text-2xl glass-font-bold glass-text-primary mb-6">
                    {activeBrand.charAt(0).toUpperCase() + activeBrand.slice(1)} Brand Integration
                  </h3>

                  <div className="space-y-6">
                    <div className="glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-p-4 glass-contrast-guard">
                      <h4 className="glass-font-semibold glass-text-primary glass-mb-3">Color Palette</h4>
                      <div className="glass-flex glass-gap-3">
                        <div className="glass-w-12 glass-h-12 glass-radius-lg glass-border glass-border-white/20" style={{
                        backgroundColor: 'var(--brand-primary)'
                      }} />
                        <div className="glass-w-12 glass-h-12 glass-radius-lg glass-border glass-border-white/20" style={{
                        backgroundColor: 'var(--brand-secondary)'
                      }} />
                        <div className="glass-w-12 glass-h-12 glass-radius-lg glass-surface-accent" />
                      </div>
                    </div>

                    <div className="glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-p-4 glass-contrast-guard">
                      <h4 className="glass-font-semibold glass-text-primary glass-mb-3">Glass Effects</h4>
                      <div className="glass-space-y-3">
                        <BrandGlassButton variant="primary" className="glass-w-full">
                          Primary Action
                        </BrandGlassButton>
                        <BrandGlassButton variant="secondary" className="glass-w-full">
                          Secondary Action
                        </BrandGlassButton>
                      </div>
                    </div>

                    <div className="glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-p-4 glass-contrast-guard">
                      <h4 className="glass-font-semibold glass-text-primary glass-mb-3">Brand Features</h4>
                      <div className="glass-space-y-2 glass-text-primary/80">
                        <div>• Dynamic color adaptation</div>
                        <div>• Smooth brand transitions</div>
                        <div>• Accessibility compliance</div>
                        <div>• Performance optimized</div>
                      </div>
                    </div>
                  </div>
                </div>
              </BrandColorIntegration>

              <div className="space-y-6">
                <div className="glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard">
                  <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Integration Metrics</h3>
                  <div className="glass-space-y-4">
                    <div className="glass-flex glass-justify-between glass-items-center">
                      <span className="glass-text-primary/80">Color Harmony</span>
                      <div className="glass-flex glass-items-center glass-gap-2">
                        <div className="glass-w-20 glass-h-2 glass-surface-accent glass-radius-full">
                          <div className="glass-w-16 glass-h-2 glass-surface-green glass-radius-full" />
                        </div>
                        <span className="glass-text-primary glass-text-sm">80%</span>
                      </div>
                    </div>

                    <div className="glass-flex glass-justify-between glass-items-center">
                      <span className="glass-text-primary/80">Accessibility</span>
                      <div className="glass-flex glass-items-center glass-gap-2">
                        <div className="glass-w-20 glass-h-2 glass-surface-accent glass-radius-full">
                          <div className="w-18 glass-h-2 glass-surface-green glass-radius-full" />
                        </div>
                        <span className="glass-text-primary glass-text-sm">90%</span>
                      </div>
                    </div>

                    <div className="glass-flex glass-justify-between glass-items-center">
                      <span className="glass-text-primary/80">Performance</span>
                      <div className="glass-flex glass-items-center glass-gap-2">
                        <div className="glass-w-20 glass-h-2 glass-surface-accent glass-radius-full">
                          <div className="w-19 glass-h-2 glass-surface-green glass-radius-full" />
                        </div>
                        <span className="glass-text-primary glass-text-sm">95%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-surface-secondary glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard">
                  <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Usage Examples</h3>
                  <div className="glass-space-y-3 glass-text-primary/80">
                    <div className="glass-p-3 glass-surface-muted glass-radius-lg">
                      <code className="glass-text-sm">
                        {\`<BrandColorIntegration entityId="\${activeBrand}">\`}
                      </code>
                    </div>
                    <div className="glass-p-3 glass-surface-muted glass-radius-lg">
                      <code className="glass-text-sm">
                        {\`<BrandGlassButton variant="primary">Action</BrandGlassButton>\`}
                      </code>
                    </div>
                    <div className="glass-p-3 glass-surface-muted glass-radius-lg">
                      <code className="glass-text-sm">
                        const brandColors = useBrandColors('{activeBrand}')
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IntelligentColorProvider>;
  }
}`,...f.parameters?.docs?.source}}};const q=["BasicIntegration","CustomBrandColors","EntityShowcase","BrandComparison"];export{y as BasicIntegration,f as BrandComparison,v as CustomBrandColors,h as EntityShowcase,q as __namedExportsOrder,V as default};
