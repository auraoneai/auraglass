import{r as m,b as ys,j as s,c as T,R as K}from"./iframe-rcK9Xf1b.js";import{G as V}from"./GlassCore-0ZthLmo_.js";import"./preload-helper-PPVm8Dsz.js";const X=r=>Array.isArray(r)&&r.every(n=>typeof n=="string"),bs=r=>typeof r=="object"&&r!==null&&!Array.isArray(r)&&"start"in r&&"end"in r,G=r=>X(r)?r:[],ns=(r,n)=>typeof r=="number"?r:n,is=r=>{const n=r.toLowerCase();let h="search";n.includes("find")||n.includes("show")||n.includes("get")?h="retrieve":n.includes("compare")||n.includes("vs")||n.includes("versus")?h="compare":n.includes("best")||n.includes("top")||n.includes("recommend")?h="recommend":(n.includes("help")||n.includes("how to")||n.includes("tutorial"))&&(h="help");const d=[];r.match(/(\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|today|yesterday|last week|this month)/gi)?.forEach(t=>{d.push({type:"date",value:t})}),r.match(/\b\d+(?:\.\d+)?\b/g)?.forEach(t=>{d.push({type:"number",value:t})}),["product","service","article","document","image","video","user","project"].forEach(t=>{n.includes(t)&&d.push({type:"category",value:t})});const g=["good","great","excellent","amazing","best","love","fantastic"],i=["bad","terrible","awful","worst","hate","horrible","useless"],x=g.some(t=>n.includes(t)),j=i.some(t=>n.includes(t));let p="neutral";x&&!j?p="positive":j&&!x&&(p="negative");const o=["the","a","an","and","or","but","in","on","at","to","for","of","with","by","is","are","was","were","been","be","have","has","had","do","does","did","will","would","could","should","may","might","can","this","that","these","those"],u=r.toLowerCase().split(/\s+/).filter(t=>t.length>2&&!o.includes(t)).filter((t,w,C)=>C.indexOf(t)===w);return{intent:h,entities:d,sentiment:p,keywords:u}},ws=(r,n,h,d=!0)=>{if(!r.trim()&&Object.keys(h).length===0)return n;const y=d?is(r):null,f=r.toLowerCase().split(/\s+/).filter(l=>l.length>0);return n.map(l=>{let g=0;const i=f.reduce((u,t)=>u+(l.title.toLowerCase().includes(t)?1:0),0),x=f.reduce((u,t)=>u+(l.description.toLowerCase().includes(t)?.5:0),0),j=f.reduce((u,t)=>u+l.tags.filter(w=>w.toLowerCase().includes(t)).length*.7,0);if(g=i*3+x+j,y&&d){y.intent==="recommend"&&l.metadata?.rating&&(g+=l.metadata.rating*.5),y.entities.forEach(t=>{t.type==="category"&&l.category.toLowerCase().includes(t.value)&&(g+=1)});const u=y.keywords.filter(t=>l.title.toLowerCase().includes(t)||l.description.toLowerCase().includes(t)).length;g+=u*.3}let p=!0;Object.entries(h).forEach(([u,t])=>{if(!(!t||Array.isArray(t)&&t.length===0))switch(u){case"category":X(t)?p=p&&t.includes(l.category):typeof t=="string"&&(p=p&&l.category===t);break;case"tags":X(t)&&(p=p&&t.some(w=>l.tags.includes(w)));break;case"dateRange":if(l.metadata?.date&&bs(t)){const w=new Date(l.metadata.date),C=new Date(t.start),$=new Date(t.end);p=p&&w>=C&&w<=$}break;case"rating":l.metadata?.rating&&typeof t=="number"&&(p=p&&l.metadata.rating>=t);break}}),p||(g=0);const o={};return g>0&&f.forEach(u=>{l.title.toLowerCase().includes(u)&&(o.title||(o.title=[]),o.title.push(u)),l.description.toLowerCase().includes(u)&&(o.description||(o.description=[]),o.description.push(u))}),{...l,score:g,highlights:o}}).filter(l=>l.score>0).sort((l,g)=>g.score-l.score)},Ss=(r,n,h)=>{const d=[];if(!n||n.length===0)return d;const y=r.toLowerCase();h.filter(i=>i.toLowerCase().includes(y)).slice(0,3).forEach(i=>{d.push({text:i,type:"query"})}),[...new Set(n.map(i=>i.category))].filter(i=>i.toLowerCase().includes(y)).slice(0,3).forEach(i=>{const x=n.filter(j=>j.category===i).length;d.push({text:i,type:"category",category:"Categories",count:x})});const g=n.flatMap(i=>i.tags).reduce((i,x)=>(i[x]=(i[x]||0)+1,i),{});return Object.entries(g).filter(([i])=>i.toLowerCase().includes(y)).sort(([,i],[,x])=>x-i).slice(0,5).forEach(([i,x])=>{d.push({text:i,type:"tag",category:"Tags",count:x})}),d},I=({data:r=[],onSearch:n,onResultClick:h,placeholder:d="Search with natural language...",showFilters:y=!0,showSuggestions:f=!0,enableNLP:l=!0,enableVoiceSearch:g=!1,maxResults:i=50,className:x,"aria-label":j,"data-testid":p})=>{const[o,u]=m.useState(""),[t,w]=m.useState([]),[C,$]=m.useState([]),[S,E]=m.useState({}),[cs,R]=m.useState(!1),[U,q]=m.useState(!1),[Y,os]=m.useState([]),[A,gs]=m.useState(null),[Z,M]=m.useState(!1),ss=m.useRef(null),k=m.useRef(),ds=m.useRef([]),L=m.useRef(!1),F=m.useRef(!0),P=ys(),es=m.useMemo(()=>{if(!r||r.length===0)return[];const e=[...new Set(r.map(c=>c.category))],b=r.flatMap(c=>c?.tags||[]).reduce((c,v)=>(v&&(c[v]=(c[v]||0)+1),c),{}),N=Object.entries(b).sort(([,c],[,v])=>v-c).slice(0,20).map(([c,v])=>({value:c,label:c,count:v}));return[{id:"category",name:"Category",type:"multiselect",options:e.map(c=>({value:c,label:c,count:r.filter(v=>v.category===c).length}))},{id:"tags",name:"Tags",type:"multiselect",options:N},{id:"rating",name:"Minimum Rating",type:"range",range:{min:0,max:5,step:.5}}]},[r]);m.useEffect(()=>(L.current=!0,F.current=!0,()=>{L.current=!1,k.current&&clearTimeout(k.current)}),[]);const as=m.useCallback((e,a)=>{L.current&&(q(!0),k.current&&clearTimeout(k.current),k.current=setTimeout(()=>{if(!L.current)return;if(!e.trim()&&Object.keys(a).length===0){w([]),q(!1);return}const N=ws(e,r,a,l).slice(0,i);w(N),q(!1),l&&e.trim()&&gs(is(e)),n?.(e,a)},300))},[r,l,i,n]);m.useEffect(()=>{if(F.current){F.current=!1;return}if(L.current)if(o.length>0){const e=r.length>0?r:[],a=Ss(o,e,Y);$(a),R(!0)}else $([]),R(!1)},[o]);const ts=m.useRef(as);ts.current=as,m.useEffect(()=>{if(F.current){F.current=!1;return}if(L.current){if(!o.trim()&&Object.keys(S).length===0){w([]),q(!1);return}return ts.current(o,S),()=>{k.current&&clearTimeout(k.current)}}},[o,S]);const us=e=>{u(e)},ms=e=>{e.type==="query"?u(e.text):e.type==="category"?E(a=>({...a,category:[...G(a.category),e.text]})):e.type==="tag"&&E(a=>({...a,tags:[...G(a.tags),e.text]})),R(!1),ss.current?.focus()},rs=()=>{o.trim()&&!Y.includes(o.trim())&&os(e=>[o.trim(),...e.slice(0,9)]),R(!1)},H=(e,a)=>{E(b=>({...b,[e]:a}))},hs=()=>{E({})},ps=()=>{const e=window.webkitSpeechRecognition;if(!g||!e)return;const a=new e;a.lang="en-US",a.continuous=!1,a.interimResults=!1,a.onstart=()=>{M(!0)},a.onresult=b=>{const N=b.results[0][0].transcript;u(N),M(!1)},a.onerror=()=>{M(!1)},a.onend=()=>{M(!1)},a.start()},ls=(e,a=[])=>{if(!a.length)return e;const b=a.filter(Boolean).map(c=>c.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"));if(!b.length)return e;const N=new RegExp(`(${b.join("|")})`,"gi");return s.jsx(s.Fragment,{children:e.split(N).map((c,v)=>b.some(xs=>new RegExp(`^${xs}$`,"i").test(c))?s.jsx("mark",{className:"glass-px-1 glass-radius-sm glass-surface-subtle glass-text-primary",children:c},`${c}-${v}`):s.jsx(K.Fragment,{children:c},`${c}-${v}`))})},fs=e=>({document:"📄",article:"📝",image:"🖼️",video:"🎥",product:"🛍️",user:"👤",project:"📁",service:"⚙️"})[e.toLowerCase()]||"🔍";return s.jsxs("div",{"data-glass-component":!0,className:T("w-full max-w-4xl mx-auto glass-min-w-0",x),"aria-label":j,"data-testid":p,children:[s.jsxs(V,{className:"glass-relative",children:[s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-items-center glass-gap-3 glass-p-4",children:[s.jsxs("div",{className:"glass-relative glass-flex-1",children:[s.jsx("input",{ref:ss,type:"text",value:o,onChange:e=>us(e.target.value),onKeyDown:e=>{e.key==="Enter"?rs():e.key==="Escape"&&R(!1)},onFocus:()=>R(C.length>0),placeholder:d,className:"glass-w-full glass-min-w-0 glass-pl-10 glass-pr-4 glass-py-3 glass-border glass-border-subtle glass-radius-lg glass-focus-ring-2 glass-focus-ring-blue-500 focus:glass-border-blue glass-focus glass-touch-target glass-contrast-guard","aria-label":"Search input","aria-busy":U}),s.jsx("div",{className:"glass-absolute glass-left-3 glass-top-1/2 glass-transform glass--translate-y-1-2",children:U?s.jsx("div",{className:T("glass-w-5 glass-h-5 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full",!P&&"glass-animate-spin"),role:"status","aria-label":"Searching"}):s.jsx("span",{className:"glass-text-secondary glass-text-lg",children:"🔍"})})]}),g&&s.jsx("button",{onClick:ps,disabled:Z,className:T("glass-px-3 glass-py-3 glass-radius-lg glass-focus glass-touch-target glass-contrast-guard",!P&&"glass-transition-colors",Z?T("glass-surface-subtle glass-text-primary",!P&&"glass-animate-pulse"):"glass-surface-subtle glass-text-secondary hover:glass-surface-subtle"),title:"Voice search",children:"🎤"}),s.jsx("button",{onClick:rs,className:T("glass-px-6 glass-py-3 glass-surface-blue glass-text-primary glass-radius-lg hover:glass-surface-blue glass-focus glass-touch-target glass-contrast-guard",!P&&"glass-transition-colors"),children:"Search"})]}),cs&&C.length>0&&s.jsx("div",{className:"glass-absolute glass-top-full glass-left-0 glass-right-0 glass-mt-2 glass-surface-subtle glass-border glass-border-subtle glass-radius-lg glass-shadow-lg glass-z-50 glass-max-h-60 glass-overflow-y-auto glass-contrast-guard",role:"listbox",children:C.map((e,a)=>s.jsxs("button",{ref:b=>ds.current[a]=b,onClick:()=>ms(e),className:"glass-w-full glass-px-4 glass-py-2 glass-text-left hover:glass-surface-subtle glass-flex glass-items-center glass-justify-between glass-gap-3 glass-border-b glass-border-subtle last:glass-border-b-0 glass-focus glass-touch-target glass-contrast-guard",role:"option",children:[s.jsxs("div",{className:"glass-flex glass-min-w-0 glass-items-center glass-gap-3",children:[s.jsxs("span",{className:"glass-text-sm",children:[e.type==="query"&&"🔍",e.type==="category"&&"📁",e.type==="tag"&&"🏷️"]}),s.jsx("span",{className:"glass-text-secondary glass-min-w-0 glass-break-words",children:e.text}),e.category&&s.jsxs("span",{className:"glass-text-xs glass-text-secondary",children:["in ",e.category]})]}),e.count&&s.jsx("span",{className:"glass-text-xs glass-text-secondary",children:e.count})]},`${e.type}-${e.text}`))})]}),l&&A&&o.trim()&&s.jsx(V,{className:"glass-mt-4 glass-p-4 glass-surface-subtle",children:s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-items-center glass-gap-3 glass-text-sm",children:[s.jsxs("div",{className:"glass-flex glass-min-w-0 glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-font-medium glass-text-primary",children:"Intent:"}),s.jsx("span",{className:"glass-px-2 glass-py-1 glass-surface-subtle glass-text-primary glass-radius glass-capitalize glass-break-words",children:A.intent})]}),A.entities.length>0&&s.jsxs("div",{className:"glass-flex glass-min-w-0 glass-flex-wrap glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-font-medium glass-text-primary",children:"Entities:"}),s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-1",children:A.entities.slice(0,3).map((e,a)=>s.jsxs("span",{className:"glass-px-2 glass-py-1 glass-surface-subtle glass-text-primary glass-radius glass-text-xs glass-break-words",children:[e.type,": ",e.value]},a))})]}),s.jsxs("div",{className:"glass-flex glass-min-w-0 glass-flex-wrap glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-font-medium glass-text-primary",children:"Keywords:"}),s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-1",children:A.keywords.slice(0,4).map((e,a)=>s.jsx("span",{className:"glass-px-2 glass-py-1 glass-surface-subtle glass-text-primary glass-radius glass-text-xs glass-break-words",children:e},a))})]})]})}),y&&es.length>0&&s.jsxs(V,{className:"glass-mt-4 glass-p-4",children:[s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-items-center glass-justify-between glass-gap-3 glass-mb-4",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary",children:"Filters"}),Object.keys(S).length>0&&s.jsx("button",{onClick:hs,className:"glass-text-sm glass-text-primary hover:glass-text-primary glass-focus glass-touch-target glass-contrast-guard",children:"Clear all"})]}),s.jsx("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-4",children:es.map(e=>s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-secondary glass-mb-2",children:e.name}),e.type==="multiselect"&&s.jsx("div",{className:"glass-space-y-2 glass-max-h-32 glass-overflow-y-auto",children:e.options?.map(a=>s.jsxs("label",{className:"glass-flex glass-items-start glass-gap-2 glass-text-sm",children:[s.jsx("input",{type:"checkbox",checked:G(S[e.id]).includes(a.value),onChange:b=>{const N=G(S[e.id]);b.target.checked?H(e.id,[...N,a.value]):H(e.id,N.filter(c=>c!==a.value))},className:"glass-radius glass-border-subtle glass-text-primary glass-focus-ring-blue-500 glass-focus glass-touch-target glass-contrast-guard"}),s.jsx("span",{className:"glass-flex-1 glass-min-w-0 glass-break-words",children:a.label}),s.jsxs("span",{className:"glass-text-secondary glass-text-xs",children:["(",a.count,")"]})]},a.value))}),e.type==="range"&&e.range&&s.jsxs("div",{children:[s.jsx("input",{type:"range",min:e.range.min,max:e.range.max,step:e.range.step||1,value:ns(S[e.id],e.range.min),onChange:a=>H(e.id,parseFloat(a.target.value)),className:"glass-w-full glass-focus glass-touch-target glass-contrast-guard"}),s.jsxs("div",{className:"glass-flex glass-justify-between glass-text-xs glass-text-secondary glass-mt-1",children:[s.jsx("span",{children:e.range.min}),s.jsx("span",{className:"glass-font-medium",children:ns(S[e.id],e.range.min)}),s.jsx("span",{children:e.range.max})]})]})]},e.id))})]}),s.jsxs("div",{className:"glass-mt-6",children:[o.trim()||Object.keys(S).length>0?s.jsxs("div",{className:"glass-mb-4 glass-text-sm glass-text-secondary glass-break-words",role:"status","aria-live":"polite",children:["Found ",t.length," results",o.trim()&&s.jsxs("span",{children:[" ",'for "',s.jsx("span",{className:"glass-font-medium",children:o}),'"']}),Object.keys(S).length>0&&s.jsxs("span",{children:[" with ",Object.keys(S).length," filters applied"]})]}):null,s.jsxs("div",{className:"glass-space-y-4",children:[t.map(e=>s.jsx(V,{className:T("glass-p-6 glass-cursor-pointer hover:glass-shadow-lg glass-contrast-guard",!P&&"glass-transition-shadow"),onClick:()=>h?.(e),onKeyDown:a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),h?.(e))},role:h?"button":"article",tabIndex:h?0:void 0,children:s.jsxs("div",{className:"glass-flex glass-flex-col sm:glass-flex-row glass-items-start glass-gap-4",children:[s.jsx("div",{className:"glass-text-2xl glass-flex-shrink-0",children:fs(e.category)}),s.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-items-center glass-gap-2 glass-mb-2",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary glass-min-w-0 glass-break-words",children:ls(e.title,e.highlights?.title)}),s.jsx("span",{className:"glass-px-2 glass-py-1 glass-text-xs glass-surface-subtle glass-text-secondary glass-radius glass-break-words",children:e.category}),e.metadata?.rating&&s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1",children:[s.jsx("span",{className:"glass-text-primary",children:"⭐"}),s.jsx("span",{className:"glass-text-sm glass-text-secondary",children:e.metadata.rating})]})]}),s.jsx("p",{className:"glass-text-secondary glass-mb-3 glass-break-words",children:ls(e.description,e.highlights?.description)}),e.tags.length>0&&s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-1",children:[e.tags.slice(0,5).map(a=>s.jsx("span",{className:"glass-px-2 glass-py-1 glass-text-xs glass-surface-subtle glass-text-primary glass-radius glass-break-words",children:a},a)),e.tags.length>5&&s.jsxs("span",{className:"glass-px-2 glass-py-1 glass-text-xs glass-surface-subtle glass-text-secondary glass-radius",children:["+",e.tags.length-5," more"]})]})]}),s.jsxs("div",{className:"glass-text-sm glass-text-secondary glass-flex-shrink-0",children:["Score: ",e.score.toFixed(1)]})]})},e.id)),t.length===0&&(o.trim()||Object.keys(S).length>0)&&!U&&s.jsxs(V,{className:"glass-text-center glass-px-6 glass-py-12 glass-text-secondary glass-surface-subtle glass-contrast-guard",children:[s.jsx("div",{className:"glass-text-5xl glass-mb-4",children:"🔍"}),s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-mb-2 glass-text-secondary",children:"No results found"}),s.jsx("p",{className:"glass-text-sm glass-break-words",children:"Try adjusting your search terms or filters, or try using more general keywords."})]})]})]})]})};try{I.displayName="GlassIntelligentSearch",I.__docgenInfo={description:"",displayName:"GlassIntelligentSearch",props:{data:{defaultValue:{value:"[]"},description:"",name:"data",required:!1,type:{name:"SearchResult[] | undefined"}},onSearch:{defaultValue:null,description:"",name:"onSearch",required:!1,type:{name:"((query: string, filters: SearchFilters) => void) | undefined"}},onResultClick:{defaultValue:null,description:"",name:"onResultClick",required:!1,type:{name:"((result: SearchResult) => void) | undefined"}},placeholder:{defaultValue:{value:"Search with natural language..."},description:"",name:"placeholder",required:!1,type:{name:"string | undefined"}},showFilters:{defaultValue:{value:"true"},description:"",name:"showFilters",required:!1,type:{name:"boolean | undefined"}},showSuggestions:{defaultValue:{value:"true"},description:"",name:"showSuggestions",required:!1,type:{name:"boolean | undefined"}},enableNLP:{defaultValue:{value:"true"},description:"",name:"enableNLP",required:!1,type:{name:"boolean | undefined"}},enableVoiceSearch:{defaultValue:{value:"false"},description:"",name:"enableVoiceSearch",required:!1,type:{name:"boolean | undefined"}},maxResults:{defaultValue:{value:"50"},description:"",name:"maxResults",required:!1,type:{name:"number | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const Cs={title:"Search/GlassIntelligentSearch",component:I,parameters:{layout:"fullscreen",docs:{description:{component:"Advanced search interface with NLP capabilities, smart filters, voice search, and intelligent suggestions - like Google or Elasticsearch with AI enhancement."}}}},D=[{id:"1",title:"Getting Started with React Hooks",description:"Learn how to use React Hooks to manage state and side effects in functional components. This comprehensive guide covers useState, useEffect, useContext, and custom hooks.",category:"Tutorial",tags:["react","hooks","javascript","frontend","web development"],score:0,metadata:{rating:4.8,author:"Jane Smith",date:"2024-01-15"}},{id:"2",title:"Advanced TypeScript Patterns",description:"Master advanced TypeScript concepts including generics, conditional types, mapped types, and utility types. Build type-safe applications with confidence.",category:"Documentation",tags:["typescript","patterns","advanced","types","programming"],score:0,metadata:{rating:4.6,author:"John Doe",date:"2024-02-20"}},{id:"3",title:"Building Responsive Design Systems",description:"Create scalable design systems with CSS-in-JS, design tokens, and component libraries. Learn best practices for responsive design and accessibility.",category:"Article",tags:["design system","css","responsive","accessibility","ui/ux"],score:0,metadata:{rating:4.9,author:"Alice Johnson",date:"2024-03-10"}},{id:"4",title:"Node.js Performance Optimization",description:"Optimize your Node.js applications for better performance. Learn about memory management, clustering, caching strategies, and monitoring tools.",category:"Guide",tags:["nodejs","performance","optimization","backend","javascript"],score:0,metadata:{rating:4.5,author:"Bob Wilson",date:"2024-01-25"}},{id:"5",title:"Introduction to Machine Learning",description:"Start your journey into machine learning with Python. Cover supervised and unsupervised learning, neural networks, and practical applications.",category:"Course",tags:["machine learning","python","ai","neural networks","data science"],score:0,metadata:{rating:4.7,author:"Dr. Sarah Chen",date:"2024-02-05"}},{id:"6",title:"GraphQL API Development",description:"Build efficient APIs with GraphQL. Learn about schemas, resolvers, subscriptions, and integration with React applications.",category:"Tutorial",tags:["graphql","api","react","backend","web development"],score:0,metadata:{rating:4.4,author:"Mike Rodriguez",date:"2024-03-01"}},{id:"7",title:"Docker Containerization Guide",description:"Containerize your applications with Docker. Learn about images, containers, Docker Compose, and deployment strategies.",category:"Guide",tags:["docker","containerization","deployment","devops","infrastructure"],score:0,metadata:{rating:4.6,author:"Emily Davis",date:"2024-01-30"}},{id:"8",title:"CSS Grid and Flexbox Mastery",description:"Master modern CSS layout techniques with Grid and Flexbox. Create complex layouts with ease and build responsive designs.",category:"Tutorial",tags:["css","grid","flexbox","layout","responsive design"],score:0,metadata:{rating:4.8,author:"Tom Anderson",date:"2024-02-15"}},{id:"9",title:"Vue.js 3 Composition API",description:"Explore Vue.js 3 and the Composition API. Learn about reactive state management, component composition, and modern Vue development.",category:"Documentation",tags:["vue","composition api","javascript","frontend","web development"],score:0,metadata:{rating:4.5,author:"Lisa Wong",date:"2024-03-05"}},{id:"10",title:"Database Design Principles",description:"Learn fundamental database design principles. Cover normalization, indexing, relationships, and performance optimization strategies.",category:"Guide",tags:["database","design","sql","normalization","performance"],score:0,metadata:{rating:4.7,author:"David Kim",date:"2024-01-20"}},{id:"11",title:"AWS Cloud Architecture",description:"Design scalable cloud architectures on AWS. Learn about EC2, S3, Lambda, RDS, and best practices for cloud-native applications.",category:"Course",tags:["aws","cloud","architecture","serverless","infrastructure"],score:0,metadata:{rating:4.9,author:"Jennifer Lee",date:"2024-02-28"}},{id:"12",title:"Testing Strategies for React Apps",description:"Comprehensive testing strategies for React applications. Cover unit testing, integration testing, and end-to-end testing with modern tools.",category:"Article",tags:["testing","react","jest","cypress","quality assurance"],score:0,metadata:{rating:4.6,author:"Chris Taylor",date:"2024-03-12"}}],O={args:{data:D,placeholder:"Search for tutorials, articles, and guides...",showFilters:!0,showSuggestions:!0,enableNLP:!1,enableVoiceSearch:!1,maxResults:10},parameters:{docs:{description:{story:'Basic search interface with text matching and filters. Try searching for "React", "TypeScript", or "CSS".'}}}},z={args:{data:D,placeholder:"Ask me anything in natural language...",showFilters:!0,showSuggestions:!0,enableNLP:!0,enableVoiceSearch:!0,maxResults:10},parameters:{docs:{description:{story:'Advanced search with NLP capabilities. Try queries like "find the best React tutorials", "show me guides about performance", or "compare frontend frameworks".'}}}},_={args:{data:D,placeholder:"Click the microphone to search with your voice...",showFilters:!1,showSuggestions:!0,enableNLP:!0,enableVoiceSearch:!0,maxResults:8},parameters:{docs:{description:{story:"Voice-enabled search with speech recognition. Click the microphone button and speak your search query."}}}},B={args:{data:D,placeholder:"Use filters to find content...",showFilters:!0,showSuggestions:!1,enableNLP:!1,enableVoiceSearch:!1,maxResults:15},parameters:{docs:{description:{story:"Focus on advanced filtering capabilities. Use the filter controls to narrow down results by category, tags, and rating."}}}},W={render:()=>{const[r,n]=K.useState([]),[h,d]=K.useState(""),y=(l,g)=>{d(l)},f=l=>{alert(`Clicked: ${l.title}`)};return s.jsxs("div",{className:"space-y-8",children:[s.jsxs("div",{className:"glass-text-center glass-py-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-xl",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-secondary glass-mb-4",children:"🔍 Intelligent Search System"}),s.jsx("p",{className:"glass-text-lg glass-text-secondary max-w-3xl glass-mx-auto leading-relaxed",children:"Experience the future of search with natural language processing, intelligent filters, voice recognition, and smart suggestions powered by advanced algorithms."}),s.jsxs("div",{className:"glass-grid glass-glass-glass-grid-cols-1 md:glass-glass-glass-grid-cols-4 glass-gap-6 mt-8 max-w-4xl glass-mx-auto",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-w-12 glass-h-12 glass-surface-blue glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3",children:"🧠"}),s.jsx("h3",{className:"glass-font-semibold",children:"NLP Processing"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mt-1",children:"Understand natural language queries with intent recognition"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-w-12 glass-h-12 glass-surface-green glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3",children:"🎤"}),s.jsx("h3",{className:"glass-font-semibold",children:"Voice Search"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mt-1",children:"Speech-to-text search with real-time recognition"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-w-12 glass-h-12 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3",children:"🔧"}),s.jsx("h3",{className:"glass-font-semibold",children:"Smart Filters"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mt-1",children:"Dynamic filters that adapt to your content"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-w-12 glass-h-12 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3",children:"✨"}),s.jsx("h3",{className:"glass-font-semibold",children:"Auto-suggestions"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mt-1",children:"Intelligent suggestions based on content and history"})]})]})]}),s.jsx(I,{data:D,onSearch:y,onResultClick:f,placeholder:"Try: 'find the best React tutorials' or 'show me guides about performance'",showFilters:!0,showSuggestions:!0,enableNLP:!0,enableVoiceSearch:!0,maxResults:12}),s.jsxs("div",{className:"glass-surface-subtle glass-border-l-4 glass-border-yellow glass-p-6 glass-radius-r-lg",children:[s.jsx("h3",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"🧪 Try These Advanced Search Examples"}),s.jsxs("div",{className:"glass-grid glass-glass-glass-grid-cols-1 md:glass-glass-glass-grid-cols-2 glass-gap-4 glass-text-sm glass-text-primary",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-mb-2",children:"Natural Language Queries:"}),s.jsxs("ul",{className:"space-y-1",children:[s.jsx("li",{children:'• "Find the best React tutorials"'}),s.jsx("li",{children:'• "Show me guides about performance"'}),s.jsx("li",{children:'• "Compare frontend frameworks"'}),s.jsx("li",{children:'• "Help me learn machine learning"'}),s.jsx("li",{children:'• "What are the top rated courses?"'})]})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-mb-2",children:"Smart Features to Try:"}),s.jsxs("ul",{className:"space-y-1",children:[s.jsx("li",{children:"• Use voice search with the microphone button"}),s.jsx("li",{children:"• Watch auto-suggestions as you type"}),s.jsx("li",{children:"• Filter by category, tags, and ratings"}),s.jsx("li",{children:"• See NLP analysis of your queries"}),s.jsx("li",{children:"• Notice highlighted search terms in results"})]})]})]})]})]})},parameters:{docs:{description:{story:"Complete showcase of the intelligent search system with all advanced features enabled."}}}},Q={render:()=>{const r=["Tutorial","Article","Guide","Course","Documentation","Video","Podcast","Tool"],n=["React","Vue","Angular","Node.js","Python","TypeScript","JavaScript","Go","Rust","Java"],h=["Performance","Security","Testing","Design","Architecture","DevOps","Database","API","Frontend","Backend"],d=Array.from({length:100},(y,f)=>{const l=n[f%n.length],g=h[f%h.length],i=r[f%r.length];return{id:`item-${f}`,title:`${g} in ${l} - ${i} #${f+1}`,description:`Learn about ${g.toLowerCase()} concepts in ${l}. This ${i.toLowerCase()} covers advanced techniques, best practices, and real-world applications for modern development.`,category:i,tags:[l.toLowerCase(),g.toLowerCase(),i.toLowerCase(),"programming","development"],score:0,metadata:{rating:Math.round((3+Math.random()*2)*10)/10,author:`Author ${f+1}`,date:new Date(Date.now()-Math.random()*365*24*60*60*1e3).toISOString().split("T")[0]}}});return s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{className:"glass-surface-subtle glass-p-4 glass-radius-lg",children:[s.jsx("h3",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Performance Test Dataset"}),s.jsxs("p",{className:"glass-text-primary glass-text-sm",children:["This demo uses ",d.length," items to test search performance with larger datasets. Try searching for technology names, topics, or categories to see how the intelligent search handles scale."]})]}),s.jsx(I,{data:d,placeholder:"Search through 100+ items with intelligent filtering...",showFilters:!0,showSuggestions:!0,enableNLP:!0,enableVoiceSearch:!0,maxResults:20})]})},parameters:{docs:{description:{story:"Performance test with a larger dataset of 100+ items to demonstrate search scalability and intelligent filtering."}}}},J={args:{data:D.slice(0,6),placeholder:"Custom styled search interface...",showFilters:!0,showSuggestions:!0,enableNLP:!0,enableVoiceSearch:!1,maxResults:6,className:"max-w-2xl"},parameters:{docs:{description:{story:"Search interface with custom styling and layout constraints."}}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    data: sampleData,
    placeholder: "Search for tutorials, articles, and guides...",
    showFilters: true,
    showSuggestions: true,
    enableNLP: false,
    enableVoiceSearch: false,
    maxResults: 10
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic search interface with text matching and filters. Try searching for "React", "TypeScript", or "CSS".'
      }
    }
  }
}`,...O.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    data: sampleData,
    placeholder: "Ask me anything in natural language...",
    showFilters: true,
    showSuggestions: true,
    enableNLP: true,
    enableVoiceSearch: true,
    maxResults: 10
  },
  parameters: {
    docs: {
      description: {
        story: 'Advanced search with NLP capabilities. Try queries like "find the best React tutorials", "show me guides about performance", or "compare frontend frameworks".'
      }
    }
  }
}`,...z.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    data: sampleData,
    placeholder: "Click the microphone to search with your voice...",
    showFilters: false,
    showSuggestions: true,
    enableNLP: true,
    enableVoiceSearch: true,
    maxResults: 8
  },
  parameters: {
    docs: {
      description: {
        story: 'Voice-enabled search with speech recognition. Click the microphone button and speak your search query.'
      }
    }
  }
}`,..._.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    data: sampleData,
    placeholder: "Use filters to find content...",
    showFilters: true,
    showSuggestions: false,
    enableNLP: false,
    enableVoiceSearch: false,
    maxResults: 15
  },
  parameters: {
    docs: {
      description: {
        story: 'Focus on advanced filtering capabilities. Use the filter controls to narrow down results by category, tags, and rating.'
      }
    }
  }
}`,...B.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const handleSearch = (query: string, filters: Record<string, any>) => {
      setSearchQuery(query);
      // In real app, you'd make an API call here
    };
    const handleResultClick = (result: SearchResult) => {
      alert(\`Clicked: \${result.title}\`);
    };
    return <div className="space-y-8">
        {/* Header */}
        <div className="glass-text-center glass-py-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-xl">
          <h1 className="glass-text-3xl glass-font-bold glass-text-secondary glass-mb-4">🔍 Intelligent Search System</h1>
          <p className="glass-text-lg glass-text-secondary max-w-3xl glass-mx-auto leading-relaxed">
            Experience the future of search with natural language processing, intelligent filters, 
            voice recognition, and smart suggestions powered by advanced algorithms.
          </p>
          
          <div className="glass-grid glass-glass-glass-grid-cols-1 md:glass-glass-glass-grid-cols-4 glass-gap-6 mt-8 max-w-4xl glass-mx-auto">
            <div className="glass-text-center">
              <div className="glass-w-12 glass-h-12 glass-surface-blue glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3">
                🧠
              </div>
              <h3 className="glass-font-semibold">NLP Processing</h3>
              <p className="glass-text-sm glass-text-secondary mt-1">Understand natural language queries with intent recognition</p>
            </div>
            <div className="glass-text-center">
              <div className="glass-w-12 glass-h-12 glass-surface-green glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3">
                🎤
              </div>
              <h3 className="glass-font-semibold">Voice Search</h3>
              <p className="glass-text-sm glass-text-secondary mt-1">Speech-to-text search with real-time recognition</p>
            </div>
            <div className="glass-text-center">
              <div className="glass-w-12 glass-h-12 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3">
                🔧
              </div>
              <h3 className="glass-font-semibold">Smart Filters</h3>
              <p className="glass-text-sm glass-text-secondary mt-1">Dynamic filters that adapt to your content</p>
            </div>
            <div className="glass-text-center">
              <div className="glass-w-12 glass-h-12 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3">
                ✨
              </div>
              <h3 className="glass-font-semibold">Auto-suggestions</h3>
              <p className="glass-text-sm glass-text-secondary mt-1">Intelligent suggestions based on content and history</p>
            </div>
          </div>
        </div>

        <GlassIntelligentSearch data={sampleData} onSearch={handleSearch} onResultClick={handleResultClick} placeholder="Try: 'find the best React tutorials' or 'show me guides about performance'" showFilters={true} showSuggestions={true} enableNLP={true} enableVoiceSearch={true} maxResults={12} />

        <div className="glass-surface-subtle glass-border-l-4 glass-border-yellow glass-p-6 glass-radius-r-lg">
          <h3 className="glass-font-semibold glass-text-primary glass-mb-2">🧪 Try These Advanced Search Examples</h3>
          <div className="glass-grid glass-glass-glass-grid-cols-1 md:glass-glass-glass-grid-cols-2 glass-gap-4 glass-text-sm glass-text-primary">
            <div>
              <h4 className="glass-font-medium glass-mb-2">Natural Language Queries:</h4>
              <ul className="space-y-1">
                <li>• "Find the best React tutorials"</li>
                <li>• "Show me guides about performance"</li>
                <li>• "Compare frontend frameworks"</li>
                <li>• "Help me learn machine learning"</li>
                <li>• "What are the top rated courses?"</li>
              </ul>
            </div>
            <div>
              <h4 className="glass-font-medium glass-mb-2">Smart Features to Try:</h4>
              <ul className="space-y-1">
                <li>• Use voice search with the microphone button</li>
                <li>• Watch auto-suggestions as you type</li>
                <li>• Filter by category, tags, and ratings</li>
                <li>• See NLP analysis of your queries</li>
                <li>• Notice highlighted search terms in results</li>
              </ul>
            </div>
          </div>
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete showcase of the intelligent search system with all advanced features enabled.'
      }
    }
  }
}`,...W.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: () => {
    // Generate larger dataset for performance testing
    const categories = ['Tutorial', 'Article', 'Guide', 'Course', 'Documentation', 'Video', 'Podcast', 'Tool'];
    const technologies = ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'TypeScript', 'JavaScript', 'Go', 'Rust', 'Java'];
    const topics = ['Performance', 'Security', 'Testing', 'Design', 'Architecture', 'DevOps', 'Database', 'API', 'Frontend', 'Backend'];
    const largeDataset: SearchResult[] = Array.from({
      length: 100
    }, (_, i) => {
      const tech = technologies[i % technologies.length];
      const topic = topics[i % topics.length];
      const category = categories[i % categories.length];
      return {
        id: \`item-\${i}\`,
        title: \`\${topic} in \${tech} - \${category} #\${i + 1}\`,
        description: \`Learn about \${topic.toLowerCase()} concepts in \${tech}. This \${category.toLowerCase()} covers advanced techniques, best practices, and real-world applications for modern development.\`,
        category,
        tags: [tech.toLowerCase(), topic.toLowerCase(), category.toLowerCase(), 'programming', 'development'],
        score: 0,
        metadata: {
          rating: Math.round((3 + Math.random() * 2) * 10) / 10,
          author: \`Author \${i + 1}\`,
          date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      };
    });
    return <div className="glass-space-y-4">
        <div className="glass-surface-subtle glass-p-4 glass-radius-lg">
          <h3 className="glass-font-semibold glass-text-primary glass-mb-2">Performance Test Dataset</h3>
          <p className="glass-text-primary glass-text-sm">
            This demo uses {largeDataset.length} items to test search performance with larger datasets. 
            Try searching for technology names, topics, or categories to see how the intelligent search handles scale.
          </p>
        </div>

        <GlassIntelligentSearch data={largeDataset} placeholder="Search through 100+ items with intelligent filtering..." showFilters={true} showSuggestions={true} enableNLP={true} enableVoiceSearch={true} maxResults={20} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance test with a larger dataset of 100+ items to demonstrate search scalability and intelligent filtering.'
      }
    }
  }
}`,...Q.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    data: sampleData.slice(0, 6),
    placeholder: "Custom styled search interface...",
    showFilters: true,
    showSuggestions: true,
    enableNLP: true,
    enableVoiceSearch: false,
    maxResults: 6,
    className: "max-w-2xl"
  },
  parameters: {
    docs: {
      description: {
        story: 'Search interface with custom styling and layout constraints.'
      }
    }
  }
}`,...J.parameters?.docs?.source}}};const ks=["BasicSearch","IntelligentNLP","VoiceSearch","FiltersOnly","SearchShowcase","LargeDataset","CustomStyling"];export{O as BasicSearch,J as CustomStyling,B as FiltersOnly,z as IntelligentNLP,Q as LargeDataset,W as SearchShowcase,_ as VoiceSearch,ks as __namedExportsOrder,Cs as default};
