import{j as e,a as G,r as i,C as m,m as M,b as p,c as j}from"./iframe-DFMMcocb.js";import"./preload-helper-PPVm8Dsz.js";class I{constructor(s){this.config=s,this.designTokens=this.initializeDesignTokens(),this.templateLibrary=new Map,this.loadTemplateLibrary()}initializeDesignTokens(){return{colors:{primary:"hsl(var(--glass-color-primary))",secondary:"hsl(var(--glass-color-success))",accent:"hsl(var(--glass-color-primary))",background:"var(--glass-primary-level2-surface)",surface:"color-mix(in srgb, var(--glass-white) 10%, transparent)",text:"var(--glass-white)",textSecondary:"color-mix(in srgb, var(--glass-white) 70%, transparent)"},spacing:{xs:"0.25rem",sm:"0.5rem",md:"1rem",lg:"1.5rem",xl:"2rem","2xl":"3rem"},typography:{fontSize:{xs:"0.75rem",sm:"0.875rem",base:"1rem",lg:"1.125rem",xl:"1.25rem","2xl":"1.5rem"},fontWeight:{light:300,normal:400,medium:500,semibold:600,bold:700}},shadows:{sm:"0 1px 2px 0 color-mix(in srgb, var(--glass-black) 5%, transparent)",md:"0 4px 6px -1px color-mix(in srgb, var(--glass-black) 10%, transparent)",lg:"0 10px 15px -3px color-mix(in srgb, var(--glass-black) 10%, transparent)",glass:"0 8px 32px color-mix(in srgb, var(--glass-black) 37%, transparent)"},borders:{radius:"0.375rem"},animations:{duration:{fast:"var(--glass-motion-duration-fast)",normal:"var(--glass-motion-duration-normal)",slow:"var(--glass-motion-duration-slow)"},easing:{ease:"var(--glass-motion-ease-standard)",easeIn:"var(--glass-motion-ease-in)",easeOut:"var(--glass-motion-ease-out)",bounce:"var(--glass-motion-ease-spring)"}}}}loadTemplateLibrary(){this.templateLibrary.set("card",`
      <div className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6">
        {children}
      </div>
    `),this.templateLibrary.set("button",`
      <motion.button
        className="glass-surface-secondary glass-px-4 glass-py-2 glass-radius-md glass-text-primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.button>
    `),this.templateLibrary.set("input",`
      <input
        className="glass-surface-secondary glass-border glass-radius-md glass-px-3 glass-py-2 glass-text-primary glass-touch-target glass-contrast-guard"
        placeholder={placeholder}
      />
    `)}async generateLayout(s){const a=Date.now(),t=await this.generateJSXFromPrompt(s),r=await this.generateCSSFromPrompt(s);return{id:`layout-${Date.now()}`,prompt:s,jsx:t,css:r,tokens:this.designTokens,confidence:.85,iterations:1,timestamp:a}}async generateJSXFromPrompt(s){const{description:a,purpose:t,style:r="standard"}=s;let o="";return a.toLowerCase().includes("dashboard")?o=this.generateDashboardLayout(s):a.toLowerCase().includes("form")?o=this.generateFormLayout(s):a.toLowerCase().includes("card")?o=this.generateCardLayout(s):a.toLowerCase().includes("list")?o=this.generateListLayout(s):o=this.generateGenericLayout(s),o}generateDashboardLayout(s){return`
<div className="glass-min-glass-h-screen glass-surface-primary glass-p-6">
  <div className="glass-max-w-7xl glass-mx-auto glass-space-y-6">
    {/* Header */}
    <div className="glass-flex glass-items-center glass-justify-between">
      <h1 className="glass-text-3xl glass-font-bold glass-text-primary">Dashboard</h1>
      <div className="glass-flex glass-gap-4">
        <motion.button className="glass-surface-secondary glass-px-4 glass-py-2 glass-radius-md">
          Settings
        </motion.button>
        <motion.button className="glass-surface-accent glass-px-4 glass-py-2 glass-radius-md">
          New Item
        </motion.button>
      </div>
    </div>

    {/* Stats Grid */}
    <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-4 glass-gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="glass-surface-secondary glass-elev-2 glass-radius-lg glass-p-6"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: ${p.DURATION.normal/1e3} }}
        >
          <div className="glass-text-2xl glass-font-bold glass-text-primary">{stat.value}</div>
          <div className="glass-text-sm glass-text-secondary">{stat.label}</div>
        </motion.div>
      ))}
    </div>

    {/* Main Content */}
    <div className="glass-grid glass-grid-cols-1 lg:glass-grid-cols-3 glass-gap-6">
      <div className="lg:glass-col-span-2">
        <div className="glass-surface-secondary glass-elev-2 glass-radius-lg glass-p-6">
          <h2 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Main Chart</h2>
          {/* Chart component would go here */}
        </div>
      </div>
      <div className="glass-space-y-6">
        <div className="glass-surface-secondary glass-elev-2 glass-radius-lg glass-p-6">
          <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-4">Recent Activity</h3>
          {/* Activity list would go here */}
        </div>
      </div>
    </div>
  </div>
</div>`}generateFormLayout(s){return`
<div className="glass-max-w-md glass-mx-auto glass-surface-primary glass-elev-3 glass-radius-lg glass-p-8">
  <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-6 glass-text-center">Contact Form</h2>
  
  <form className="glass-space-y-6">
    <div>
      <label className="glass-block glass-text-sm glass-font-medium glass-text-secondary glass-mb-2">
        Full Name
      </label>
      <input
        type="text"
        className="glass-w-full glass-surface-secondary glass-border glass-radius-md glass-px-3 glass-py-2 glass-text-primary placeholder-glass-opacity-50 glass-touch-target glass-contrast-guard"
        placeholder="Enter your full name"
      />
    </div>

    <div>
      <label className="glass-block glass-text-sm glass-font-medium glass-text-secondary glass-mb-2">
        Email Address
      </label>
      <input
        type="email"
        className="glass-w-full glass-surface-secondary glass-border glass-radius-md glass-px-3 glass-py-2 glass-text-primary placeholder-glass-opacity-50 glass-touch-target glass-contrast-guard"
        placeholder="Enter your email"
      />
    </div>

    <div>
      <label className="glass-block glass-text-sm glass-font-medium glass-text-secondary glass-mb-2">
        Message
      </label>
      <textarea
        rows={4}
        className="glass-w-full glass-surface-secondary glass-border glass-radius-md glass-px-3 glass-py-2 glass-text-primary placeholder-glass-opacity-50 glass-touch-target glass-contrast-guard"
        placeholder="Enter your message"
      />
    </div>

    <motion.button
      type="submit"
      className="glass-w-full glass-surface-accent glass-elev-2 glass-radius-md glass-py-3 glass-font-semibold glass-text-primary"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      Send Message
    </motion.button>
  </form>
</div>`}generateCardLayout(s){return`
<div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-3 glass-gap-6 glass-p-6">
  {items.map((item, index) => (
    <motion.div
      key={item.id}
      className="glass-surface-secondary glass-elev-2 glass-radius-lg glass-overflow-hidden"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: ${p.DURATION.normal/1e3} }}
      whileHover={{ scale: 1.02 }}
    >
      {item.image && (
        <div className="glass-aspect-video glass-gradient-primary glass-gradient-primary glass-gradient-primary"></div>
      )}
      
      <div className="glass-p-6">
        <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">
          {item.title}
        </h3>
        <p className="glass-text-secondary glass-mb-4">
          {item.description}
        </p>
        
        <div className="glass-flex glass-items-center glass-justify-between">
          <span className="glass-text-sm glass-text-tertiary">
            {item.date}
          </span>
          <motion.button
            className="glass-surface-accent glass-px-3 glass-py-1 glass-radius-sm glass-text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View
          </motion.button>
        </div>
      </div>
    </motion.div>
  ))}
</div>`}generateListLayout(s){return`
<div className="glass-max-w-2xl glass-mx-auto glass-surface-primary glass-elev-2 glass-radius-lg glass-overflow-hidden">
  <div className="glass-p-6 glass-border-b glass-border">
    <h2 className="glass-text-2xl glass-font-bold glass-text-primary">List Items</h2>
    <p className="glass-text-secondary glass-mt-1">Manage your items efficiently</p>
  </div>
  
  <div className="glass-divide-y glass-divide">
    {items.map((item, index) => (
      <motion.div
        key={item.id}
        className="glass-p-4 hover:glass-surface-secondary glass-transition-colors"
        initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: ${p.DURATION.normal/1e3} }}
      >
        <div className="glass-flex glass-items-center glass-justify-between">
          <div className="glass-flex glass-items-center glass-gap-3">
            <div className="glass-w-10 glass-h-10 glass-surface-accent glass-radius-full glass-flex glass-items-center glass-justify-center">
              {item.icon}
            </div>
            <div>
              <div className="glass-font-medium glass-text-primary">{item.title}</div>
              <div className="glass-text-sm glass-text-secondary">{item.subtitle}</div>
            </div>
          </div>
          
          <div className="glass-flex glass-items-center glass-gap-2">
            <motion.button
              className="glass-p-2 glass-surface-secondary glass-radius-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Edit
            </motion.button>
            <motion.button
              className="glass-p-2 glass-surface-secondary glass-radius-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Delete
            </motion.button>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</div>`}generateGenericLayout(s){return`
<div className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6">
  <div className="glass-text-center glass-gap-4">
    <h1 className="glass-text-3xl glass-font-bold glass-text-primary">
      Generated Component
    </h1>
    <p className="glass-text-secondary glass-max-w-md glass-mx-auto">
      This is a dynamically generated component based on your prompt: "${s.description}"
    </p>
    
    <div className="glass-flex glass-justify-center glass-gap-4 glass-pt-4">
      <motion.button
        className="glass-surface-accent glass-px-6 glass-py-3 glass-radius-md glass-font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Primary Action
      </motion.button>
      <motion.button
        className="glass-surface-secondary glass-px-6 glass-py-3 glass-radius-md glass-font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Secondary Action
      </motion.button>
    </div>
  </div>
</div>`}async generateCSSFromPrompt(s){const{style:a="standard"}=s,t=`
.generated-component {
  /* Canonical neutral liquid-glass material. Keep both filter spellings in
     generated output because consumers may render outside AuraGlass CSS. */
  backdrop-filter: blur(24px) saturate(160%) brightness(1.08) contrast(1.04);
  -webkit-backdrop-filter: blur(24px) saturate(160%) brightness(1.08) contrast(1.04);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.12) 100%);
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: var(--glass-radius-xl);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), var(--glass-elev-2);
}

.generated-component .glass-surface-primary {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.14) 100%);
  border: 1px solid rgba(255, 255, 255, 0.24);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(24px) saturate(160%) brightness(1.08) contrast(1.04);
  -webkit-backdrop-filter: blur(24px) saturate(160%) brightness(1.08) contrast(1.04);
}

.generated-component .glass-surface-secondary {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.10) 100%);
  border: 1px solid rgba(255, 255, 255, 0.20);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(24px) saturate(160%) brightness(1.08) contrast(1.04);
  -webkit-backdrop-filter: blur(24px) saturate(160%) brightness(1.08) contrast(1.04);
}

.generated-component .glass-text-primary {
  color: var(--glass-text-primary);
}

.generated-component .glass-text-secondary {
  color: var(--glass-text-secondary);
}

.generated-component .glass-border {
  border: 1px solid var(--glass-border-default);
}
`;let r="";switch(a){case"minimal":r=`
.generated-component {
  --glass-blur: var(--glass-blur-sm);
  --glass-opacity: var(--glass-opacity-5);
  --animation-duration: var(--glass-motion-duration-fast);
}
`;break;case"detailed":r=`
.generated-component {
  --glass-blur: var(--glass-blur-xl);
  --glass-opacity: var(--glass-opacity-15);
  --animation-duration: var(--glass-motion-duration-slow);
  box-shadow: var(--glass-elev-2);
}
`;break;case"experimental":r=`
.generated-component {
  --glass-blur: var(--glass-blur-2xl);
  --glass-opacity: var(--glass-opacity-20);
  --animation-duration: var(--glass-motion-duration-slower);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.14) 100%);
  animation: glowPulse var(--glass-motion-duration-slowest) var(--glass-motion-ease-in-out) infinite alternate;
}

@keyframes glowPulse {
  0% { box-shadow: var(--glass-elev-2); }
  100% { box-shadow: var(--glass-elev-2); }
}
`;break}return t+r}}class _{constructor(){this.population=[],this.fitnessScores=new Map,this.generationCount=0}async optimizeLayout(s,a){return this.population.length===0&&(this.population=await this.createInitialPopulation(s)),this.calculateFitnessScores(a),this.population=await this.evolvePopulation(),this.generationCount++,this.getBestLayout()}async createInitialPopulation(s){const a=[s];for(let t=0;t<9;t++){const r=await this.createVariant(s);a.push(r)}return a}async createVariant(s){const a=["spacing","colors","typography","shadows","animations"],t=a[Math.floor(Math.random()*a.length)],r={...s.tokens};switch(t){case"colors":const o=Math.floor(Math.random()*360);r.colors.primary=`hsl(${o}, 70%, 60%)`;break;case"spacing":const n=.8+Math.random()*.4;Object.keys(r.spacing).forEach(c=>{const u=parseFloat(r.spacing[c]);r.spacing[c]=`${u*n}rem`});break}return{...s,id:`${s.id}-variant-${Date.now()}`,tokens:r,confidence:s.confidence*(.8+Math.random()*.4),timestamp:Date.now()}}calculateFitnessScores(s){this.population.forEach((a,t)=>{const r=s[t]||.5;this.fitnessScores.set(a.id,r)})}async evolvePopulation(){const s=this.selection(),a=await this.crossover(s);return this.mutation(a)}selection(){const s=[];for(;s.length<this.population.length/2;){const t=[];for(let o=0;o<3;o++){const n=Math.floor(Math.random()*this.population.length);t.push(this.population[n])}const r=t.reduce((o,n)=>{const c=this.fitnessScores.get(o.id)||0;return(this.fitnessScores.get(n.id)||0)>c?n:o});s.push(r)}return s}async crossover(s){const a=[...s];for(;a.length<this.population.length;){const t=s[Math.floor(Math.random()*s.length)],r=s[Math.floor(Math.random()*s.length)],o=await this.combineLayouts(t,r);a.push(o)}return a}async combineLayouts(s,a){const t={colors:Math.random()>.5?s.tokens.colors:a.tokens.colors,spacing:Math.random()>.5?s.tokens.spacing:a.tokens.spacing,typography:Math.random()>.5?s.tokens.typography:a.tokens.typography,shadows:Math.random()>.5?s.tokens.shadows:a.tokens.shadows,borders:Math.random()>.5?s.tokens.borders:a.tokens.borders,animations:Math.random()>.5?s.tokens.animations:a.tokens.animations};return{id:`child-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,prompt:s.prompt,jsx:Math.random()>.5?s.jsx:a.jsx,css:s.css,tokens:t,confidence:(s.confidence+a.confidence)/2,iterations:Math.max(s.iterations,a.iterations)+1,timestamp:Date.now()}}async mutation(s){return Promise.all(s.map(async t=>Math.random()<.1?await this.createVariant(t):t))}getBestLayout(){return this.population.reduce((s,a)=>{const t=this.fitnessScores.get(s.id)||0;return(this.fitnessScores.get(a.id)||0)>t?a:s})}}const k=i.createContext({generator:null,optimizer:null,generateLayout:async()=>({}),optimizeLayout:async()=>({}),currentLayouts:[]});function y({children:l,config:s={model:"claude",temperature:.7,maxTokens:2e3,designSystem:"glass",accessibility:!0,responsive:!0}}){G();const a=i.useRef(),t=i.useRef(),[r,o]=i.useState([]);i.useEffect(()=>{const d={model:"claude",temperature:.7,maxTokens:2e3,designSystem:"glass",accessibility:!0,responsive:!0,...s};a.current=new I(d),t.current=new _},[s]);const n=i.useCallback(async d=>{if(!a.current)throw new Error("Generator not initialized");const g=await a.current.generateLayout(d);return o(h=>[...h,g]),g},[]),c=i.useCallback(async(d,g)=>{if(!t.current)throw new Error("Optimizer not initialized");const h=await t.current.optimizeLayout(d,g);return o(A=>[...A,h]),h},[]),u={generator:a.current||null,optimizer:t.current||null,generateLayout:n,optimizeLayout:c,currentLayouts:r};return e.jsx(k.Provider,{value:u,children:l})}function R(){const l=i.useContext(k);if(!l)throw new Error("useAutoComposer must be used within GlassAutoComposerProvider");return l}function x({className:l}){const{generateLayout:s}=R(),[a,t]=i.useState(""),[r,o]=i.useState(null),[n,c]=i.useState(!1),u=async()=>{if(a.trim()){c(!0);try{const g=await s({description:a,purpose:"user-requested",style:"standard"});o(g)}catch{o(null)}finally{c(!1)}}},d=G();return e.jsxs("div",{className:j("space-y-6",l),role:"main","aria-label":"AI Layout Generator",children:[e.jsxs("div",{className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6",children:[e.jsx(m,{children:e.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"AI Layout Generator"})}),e.jsxs("div",{className:"glass-gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"layout-prompt-textarea",className:"glass-block glass-text-sm glass-font-medium glass-text-secondary glass-mb-2",children:e.jsx(m,{children:"Describe the layout you want"})}),e.jsx("textarea",{id:"layout-prompt-textarea",className:"glass-w-full glass-surface-secondary glass-border glass-radius-md glass-px-3 glass-py-2 glass-text-primary glass-touch-target glass-contrast-guard",rows:3,value:a,onChange:g=>t(g.target.value),placeholder:"e.g., Create a modern dashboard with charts, stats cards, and a sidebar navigation","aria-label":"Layout description input","aria-describedby":"layout-prompt-description"}),e.jsx("span",{id:"layout-prompt-description",className:"glass-sr-only",children:"Enter a description of the layout you want to generate"})]}),e.jsx(M.button,{className:"glass-surface-accent glass-px-6 glass-py-3 glass-radius-md glass-font-medium",onClick:u,disabled:n||!a.trim(),whileHover:d?void 0:{scale:1.02},whileTap:d?void 0:{scale:.98},transition:d?{duration:0}:{duration:p.DURATION.fast,ease:p.EASING.easeOut},"aria-label":n?"Generating layout":"Generate layout","aria-busy":n,children:e.jsx(m,{children:n?"Generating...":"Generate Layout"})})]})]}),r&&e.jsxs("div",{className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6",role:"region","aria-label":"Generated layout preview",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[e.jsx(m,{children:e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:"Generated Layout"})}),e.jsx("div",{className:"glass-flex glass-items-center glass-gap-2",children:e.jsx(m,{children:e.jsxs("span",{className:"glass-text-sm glass-text-secondary",children:["Confidence: ",(r.confidence*100).toFixed(0),"%"]})})})]}),e.jsxs("div",{className:"glass-gap-4",children:[e.jsxs("div",{children:[e.jsx(m,{children:e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-secondary glass-mb-2",children:"JSX Code"})}),e.jsx("pre",{className:"glass-surface-secondary glass-radius-md glass-p-4 glass-text-xs glass-text-primary glass-overflow-x-auto","aria-label":"Generated JSX code",children:r.jsx})]}),e.jsxs("div",{children:[e.jsx(m,{children:e.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-secondary glass-mb-2",children:"CSS Styles"})}),e.jsx("pre",{className:"glass-surface-secondary glass-radius-md glass-p-4 glass-text-xs glass-text-primary glass-overflow-x-auto","aria-label":"Generated CSS styles",children:r.css})]})]})]})]})}function S({layout:l,data:s={},className:a}){const t=i.useCallback(()=>e.jsx("div",{className:"generated-component glass-p-6 glass-text-center",children:e.jsxs(m,{children:[e.jsx("h3",{className:"glass-text-xl glass-font-bold glass-text-primary glass-mb-2",children:"Generated Component Preview"}),e.jsxs("p",{className:"glass-text-secondary glass-mb-4",children:['Based on: "',l.prompt.description,'"']}),e.jsxs("div",{className:"glass-text-xs glass-text-tertiary",children:["Generated at: ",new Date(l.timestamp).toLocaleString()]})]})}),[l]);return e.jsxs("div",{className:j("generated-layout",a),children:[e.jsx("style",{children:l.css}),t()]})}function N({children:l,className:s,...a}){return e.jsx(y,{children:e.jsx("div",{className:s,...a,children:l||e.jsx(x,{})})})}try{y.displayName="GlassAutoComposerProvider",y.__docgenInfo={description:"",displayName:"GlassAutoComposerProvider",props:{config:{defaultValue:{value:`{
    model: "claude",
    temperature: 0.7,
    maxTokens: 2000,
    designSystem: "glass",
    accessibility: true,
    responsive: true,
  }`},description:"",name:"config",required:!1,type:{name:"Partial<ComposerConfig> | undefined"}}}}}catch{}try{x.displayName="GlassAutoComposerInterface",x.__docgenInfo={description:"",displayName:"GlassAutoComposerInterface",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{S.displayName="GlassGeneratedLayoutRenderer",S.__docgenInfo={description:"",displayName:"GlassGeneratedLayoutRenderer",props:{layout:{defaultValue:null,description:"",name:"layout",required:!0,type:{name:"GeneratedLayout"}},data:{defaultValue:{value:"{}"},description:"",name:"data",required:!1,type:{name:"Record<string, unknown> | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{N.displayName="GlassAutoComposer",N.__docgenInfo={description:"",displayName:"GlassAutoComposer",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const $={title:"AI + Intelligence/Glass Auto Composer",component:N,parameters:{layout:"fullscreen",previewSurface:"component",docs:{description:{component:"Direct stories for every visual GlassAutoComposer export, using deterministic local generation settings and neutral liquid-glass presentation."}}},tags:["autodocs"]},P={boxSizing:"border-box",display:"grid",minHeight:"100vh",minWidth:0,padding:"clamp(20px, 6vw, 72px)",placeItems:"center",width:"100%"},T={minWidth:0,width:"min(100%, 760px)"},L={accessibility:!0,designSystem:"glass",maxTokens:1200,model:"local",responsive:!0,temperature:.3},D={confidence:.96,css:"",id:"story-layout-release-overview",iterations:1,jsx:'<ReleaseOverview status="ready" />',prompt:{constraints:["responsive","accessible","neutral liquid glass"],description:"A calm release overview for an AI workspace",purpose:"release planning",style:"minimal"},timestamp:Date.UTC(2026,7,12,16,0,0),tokens:{animations:{duration:{normal:"var(--glass-motion-duration-normal)"},easing:{ease:"var(--glass-motion-ease-standard)"}},borders:{radius:"var(--glass-radius-lg)"},colors:{accent:"var(--glass-text-secondary)",background:"var(--glass-bg-default)",primary:"var(--glass-text-primary)",secondary:"var(--glass-text-secondary)",surface:"var(--glass-gradient-neutral)",text:"var(--glass-text-primary)",textSecondary:"var(--glass-text-secondary)"},shadows:{glass:"var(--glass-elev-2)"},spacing:{lg:"1.5rem",md:"1rem",sm:"0.5rem"},typography:{fontSize:{base:"1rem",lg:"1.125rem"},fontWeight:{medium:500,semibold:600}}}};function C({children:l}){return e.jsx("div",{style:P,children:e.jsx("div",{style:T,children:l})})}const f={name:"GlassAutoComposer",render:()=>e.jsx(C,{children:e.jsx(N,{className:"glass-w-full"})})},v={name:"GlassAutoComposerProvider",render:()=>e.jsx(C,{children:e.jsx(y,{config:L,children:e.jsx(x,{className:"glass-w-full"})})})},b={name:"GlassAutoComposerInterface",render:()=>e.jsx(C,{children:e.jsx(y,{config:L,children:e.jsx(x,{className:"glass-w-full"})})})},w={name:"GlassGeneratedLayoutRenderer",render:()=>e.jsx(C,{children:e.jsx(S,{className:"glass-foundation-complete glass-radius-3xl glass-shadow-soft-xl",data:{status:"ready"},layout:D})})};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "GlassAutoComposer",
  render: () => <StoryStage>
      <GlassAutoComposerComponent className="glass-w-full" />
    </StoryStage>
}`,...f.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "GlassAutoComposerProvider",
  render: () => <StoryStage>
      <GlassAutoComposerProviderComponent config={composerConfig}>
        <GlassAutoComposerInterfaceComponent className="glass-w-full" />
      </GlassAutoComposerProviderComponent>
    </StoryStage>
}`,...v.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "GlassAutoComposerInterface",
  render: () => <StoryStage>
      <GlassAutoComposerProviderComponent config={composerConfig}>
        <GlassAutoComposerInterfaceComponent className="glass-w-full" />
      </GlassAutoComposerProviderComponent>
    </StoryStage>
}`,...b.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: "GlassGeneratedLayoutRenderer",
  render: () => <StoryStage>
      <GlassGeneratedLayoutRendererComponent className="glass-foundation-complete glass-radius-3xl glass-shadow-soft-xl" data={{
      status: "ready"
    }} layout={renderedLayout} />
    </StoryStage>
}`,...w.parameters?.docs?.source}}};const F=["GlassAutoComposer","GlassAutoComposerProvider","GlassAutoComposerInterface","GlassGeneratedLayoutRenderer"];export{f as GlassAutoComposer,b as GlassAutoComposerInterface,v as GlassAutoComposerProvider,w as GlassGeneratedLayoutRenderer,F as __namedExportsOrder,$ as default};
