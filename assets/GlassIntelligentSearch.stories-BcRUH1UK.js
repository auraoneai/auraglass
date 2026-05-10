import{r as p,b as ye,j as e,c as D,R as U}from"./iframe-DinEdlu4.js";import{G as P}from"./GlassCore-kK8wVcbU.js";import"./preload-helper-PPVm8Dsz.js";const X=t=>Array.isArray(t)&&t.every(n=>typeof n=="string"),be=t=>typeof t=="object"&&t!==null&&!Array.isArray(t)&&"start"in t&&"end"in t,M=t=>X(t)?t:[],ne=(t,n)=>typeof t=="number"?t:n,ie=t=>{const n=t.toLowerCase();let d="search";n.includes("find")||n.includes("show")||n.includes("get")?d="retrieve":n.includes("compare")||n.includes("vs")||n.includes("versus")?d="compare":n.includes("best")||n.includes("top")||n.includes("recommend")?d="recommend":(n.includes("help")||n.includes("how to")||n.includes("tutorial"))&&(d="help");const u=[];t.match(/(\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|today|yesterday|last week|this month)/gi)?.forEach(r=>{u.push({type:"date",value:r})}),t.match(/\b\d+(?:\.\d+)?\b/g)?.forEach(r=>{u.push({type:"number",value:r})}),["product","service","article","document","image","video","user","project"].forEach(r=>{n.includes(r)&&u.push({type:"category",value:r})});const g=["good","great","excellent","amazing","best","love","fantastic"],i=["bad","terrible","awful","worst","hate","horrible","useless"],x=g.some(r=>n.includes(r)),j=i.some(r=>n.includes(r));let f="neutral";x&&!j?f="positive":j&&!x&&(f="negative");const c=["the","a","an","and","or","but","in","on","at","to","for","of","with","by","is","are","was","were","been","be","have","has","had","do","does","did","will","would","could","should","may","might","can","this","that","these","those"],h=t.toLowerCase().split(/\s+/).filter(r=>r.length>2&&!c.includes(r)).filter((r,w,k)=>k.indexOf(r)===w);return{intent:d,entities:u,sentiment:f,keywords:h}},we=(t,n,d,u=!0)=>{if(!t.trim()&&Object.keys(d).length===0)return n;const y=u?ie(t):null,m=t.toLowerCase().split(/\s+/).filter(l=>l.length>0);return n.map(l=>{let g=0;const i=m.reduce((h,r)=>h+(l.title.toLowerCase().includes(r)?1:0),0),x=m.reduce((h,r)=>h+(l.description.toLowerCase().includes(r)?.5:0),0),j=m.reduce((h,r)=>h+l.tags.filter(w=>w.toLowerCase().includes(r)).length*.7,0);if(g=i*3+x+j,y&&u){y.intent==="recommend"&&l.metadata?.rating&&(g+=l.metadata.rating*.5),y.entities.forEach(r=>{r.type==="category"&&l.category.toLowerCase().includes(r.value)&&(g+=1)});const h=y.keywords.filter(r=>l.title.toLowerCase().includes(r)||l.description.toLowerCase().includes(r)).length;g+=h*.3}let f=!0;Object.entries(d).forEach(([h,r])=>{if(!(!r||Array.isArray(r)&&r.length===0))switch(h){case"category":X(r)?f=f&&r.includes(l.category):typeof r=="string"&&(f=f&&l.category===r);break;case"tags":X(r)&&(f=f&&r.some(w=>l.tags.includes(w)));break;case"dateRange":if(l.metadata?.date&&be(r)){const w=new Date(l.metadata.date),k=new Date(r.start),q=new Date(r.end);f=f&&w>=k&&w<=q}break;case"rating":l.metadata?.rating&&typeof r=="number"&&(f=f&&l.metadata.rating>=r);break}}),f||(g=0);const c={};return g>0&&m.forEach(h=>{l.title.toLowerCase().includes(h)&&(c.title||(c.title=[]),c.title.push(h)),l.description.toLowerCase().includes(h)&&(c.description||(c.description=[]),c.description.push(h))}),{...l,score:g,highlights:c}}).filter(l=>l.score>0).sort((l,g)=>g.score-l.score)},Se=(t,n,d)=>{const u=[];if(!n||n.length===0)return u;const y=t.toLowerCase();d.filter(i=>i.toLowerCase().includes(y)).slice(0,3).forEach(i=>{u.push({text:i,type:"query"})}),[...new Set(n.map(i=>i.category))].filter(i=>i.toLowerCase().includes(y)).slice(0,3).forEach(i=>{const x=n.filter(j=>j.category===i).length;u.push({text:i,type:"category",category:"Categories",count:x})});const g=n.flatMap(i=>i.tags).reduce((i,x)=>(i[x]=(i[x]||0)+1,i),{});return Object.entries(g).filter(([i])=>i.toLowerCase().includes(y)).sort(([,i],[,x])=>x-i).slice(0,5).forEach(([i,x])=>{u.push({text:i,type:"tag",category:"Tags",count:x})}),u},$=({data:t=[],onSearch:n,onResultClick:d,placeholder:u="Search with natural language...",showFilters:y=!0,showSuggestions:m=!0,enableNLP:l=!0,enableVoiceSearch:g=!1,maxResults:i=50,className:x,"aria-label":j,"data-testid":f})=>{const[c,h]=p.useState(""),[r,w]=p.useState([]),[k,q]=p.useState([]),[S,I]=p.useState({}),[oe,L]=p.useState(!1),[K,E]=p.useState(!1),[Y,ce]=p.useState([]),[F,ge]=p.useState(null),[Z,G]=p.useState(!1),ee=p.useRef(null),C=p.useRef(),de=p.useRef([]),T=p.useRef(!1),V=p.useRef(!0),A=ye(),se=p.useMemo(()=>{if(!t||t.length===0)return[];const s=[...new Set(t.map(o=>o.category))],b=t.flatMap(o=>o?.tags||[]).reduce((o,v)=>(v&&(o[v]=(o[v]||0)+1),o),{}),N=Object.entries(b).sort(([,o],[,v])=>v-o).slice(0,20).map(([o,v])=>({value:o,label:o,count:v}));return[{id:"category",name:"Category",type:"multiselect",options:s.map(o=>({value:o,label:o,count:t.filter(v=>v.category===o).length}))},{id:"tags",name:"Tags",type:"multiselect",options:N},{id:"rating",name:"Minimum Rating",type:"range",range:{min:0,max:5,step:.5}}]},[t]);p.useEffect(()=>(T.current=!0,V.current=!0,()=>{T.current=!1,C.current&&clearTimeout(C.current)}),[]);const ae=p.useCallback((s,a)=>{T.current&&(E(!0),C.current&&clearTimeout(C.current),C.current=setTimeout(()=>{if(!T.current)return;if(!s.trim()&&Object.keys(a).length===0){w([]),E(!1);return}const N=we(s,t,a,l).slice(0,i);w(N),E(!1),l&&s.trim()&&ge(ie(s)),n?.(s,a)},300))},[t,l,i,n]);p.useEffect(()=>{if(V.current){V.current=!1;return}if(T.current)if(c.length>0){const s=t.length>0?t:[],a=Se(c,s,Y);q(a),L(!0)}else q([]),L(!1)},[c]);const te=p.useRef(ae);te.current=ae,p.useEffect(()=>{if(V.current){V.current=!1;return}if(T.current){if(!c.trim()&&Object.keys(S).length===0){w([]),E(!1);return}return te.current(c,S),()=>{C.current&&clearTimeout(C.current)}}},[c,S]);const ue=s=>{h(s)},he=s=>{s.type==="query"?h(s.text):s.type==="category"?I(a=>({...a,category:[...M(a.category),s.text]})):s.type==="tag"&&I(a=>({...a,tags:[...M(a.tags),s.text]})),L(!1),ee.current?.focus()},re=()=>{c.trim()&&!Y.includes(c.trim())&&ce(s=>[c.trim(),...s.slice(0,9)]),L(!1)},H=(s,a)=>{I(b=>({...b,[s]:a}))},pe=()=>{I({})},me=()=>{const s=window.webkitSpeechRecognition;if(!g||!s)return;const a=new s;a.lang="en-US",a.continuous=!1,a.interimResults=!1,a.onstart=()=>{G(!0)},a.onresult=b=>{const N=b.results[0][0].transcript;h(N),G(!1)},a.onerror=()=>{G(!1)},a.onend=()=>{G(!1)},a.start()},le=(s,a=[])=>{if(!a.length)return s;const b=a.filter(Boolean).map(o=>o.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"));if(!b.length)return s;const N=new RegExp(`(${b.join("|")})`,"gi");return e.jsx(e.Fragment,{children:s.split(N).map((o,v)=>b.some(xe=>new RegExp(`^${xe}$`,"i").test(o))?e.jsx("mark",{className:"glass-px-1 glass-radius-sm glass-surface-subtle glass-text-primary",children:o},`${o}-${v}`):e.jsx(U.Fragment,{children:o},`${o}-${v}`))})},fe=s=>({document:"📄",article:"📝",image:"🖼️",video:"🎥",product:"🛍️",user:"👤",project:"📁",service:"⚙️"})[s.toLowerCase()]||"🔍";return e.jsxs("div",{"data-glass-component":!0,className:D("glass-intelligent-search glass-w-full glass-min-w-0",x),style:{width:"100%",maxWidth:"64rem",margin:"0 auto"},"aria-label":j,"data-testid":f,children:[e.jsx("style",{children:`
        .glass-intelligent-search-panel {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.76), rgba(15, 23, 42, 0.68)), rgba(15, 23, 42, 0.72) !important;
          background-color: rgba(15, 23, 42, 0.72) !important;
          border-color: rgba(148, 163, 184, 0.24) !important;
          color: rgba(248, 250, 252, 0.96) !important;
          box-shadow: 0 18px 52px rgba(2, 6, 23, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }

        .glass-intelligent-search-panel .glass-text-primary,
        .glass-intelligent-search-panel .glass-text-secondary,
        .glass-intelligent-search-panel .glass-text-tertiary {
          color: rgba(248, 250, 252, 0.96) !important;
        }

        .glass-intelligent-search-panel label,
        .glass-intelligent-search-panel p,
        .glass-intelligent-search-panel span {
          color: inherit;
        }

        .glass-intelligent-search-panel button {
          background-color: rgba(15, 23, 42, 0.58) !important;
          border: 1px solid rgba(148, 163, 184, 0.24) !important;
          color: rgba(248, 250, 252, 0.96) !important;
          border-radius: 12px;
        }

        .glass-intelligent-search-panel .glass-search-primary-action {
          background: linear-gradient(135deg, rgba(3, 105, 161, 0.96), rgba(29, 78, 216, 0.92)), rgba(3, 105, 161, 0.96) !important;
          background-color: rgba(3, 105, 161, 0.96) !important;
          border-color: rgba(125, 211, 252, 0.42);
          color: #f8fafc !important;
        }

        .glass-intelligent-search-dropdown {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.94), rgba(15, 23, 42, 0.9)), rgba(15, 23, 42, 0.92) !important;
          background-color: rgba(15, 23, 42, 0.92) !important;
          backdrop-filter: blur(18px) saturate(1.35);
          -webkit-backdrop-filter: blur(18px) saturate(1.35);
        }

        .glass-intelligent-search input[type="text"] {
          appearance: none;
          -webkit-appearance: none;
          background: rgba(15, 23, 42, 0.7);
          color: rgba(248, 250, 252, 0.96);
          border-color: rgba(148, 163, 184, 0.26);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .glass-intelligent-search input[type="text"]::placeholder {
          color: rgba(226, 232, 240, 0.62);
        }

        .glass-search-checkbox {
          appearance: none;
          -webkit-appearance: none;
          width: 1rem;
          height: 1rem;
          flex: 0 0 1rem;
          margin-top: 0.125rem;
          border-radius: 0.375rem;
          border: 1px solid rgba(148, 163, 184, 0.6);
          background:
            linear-gradient(135deg, rgba(30, 41, 59, 0.88), rgba(15, 23, 42, 0.74)),
            rgba(15, 23, 42, 0.82);
          box-shadow:
            inset 0 1px 1px rgba(255, 255, 255, 0.12),
            0 4px 12px rgba(2, 6, 23, 0.22);
          cursor: pointer;
        }

        .glass-search-checkbox:checked {
          border-color: rgba(56, 189, 248, 0.9);
          background:
            linear-gradient(135deg, rgba(56, 189, 248, 0.96), rgba(37, 99, 235, 0.9)),
            rgba(255, 255, 255, 0.76);
          box-shadow:
            inset 0 0 0 3px rgba(255, 255, 255, 0.82),
            0 0 0 1px rgba(125, 211, 252, 0.34),
            0 8px 18px rgba(14, 165, 233, 0.22);
        }

        .glass-search-range {
          appearance: none;
          -webkit-appearance: none;
          height: 0.625rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.42);
          background:
            linear-gradient(90deg, rgba(56, 189, 248, 0.9), rgba(125, 211, 252, 0.44)),
            rgba(255, 255, 255, 0.72);
          box-shadow:
            inset 0 1px 2px rgba(2, 6, 23, 0.28),
            0 1px 0 rgba(255, 255, 255, 0.08);
          cursor: pointer;
        }

        .glass-search-range::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 999px;
          border: 2px solid rgba(248, 250, 252, 0.96);
          background: #38bdf8;
          box-shadow: 0 6px 18px rgba(14, 165, 233, 0.4);
        }

        .glass-search-range::-moz-range-thumb {
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 999px;
          border: 2px solid rgba(248, 250, 252, 0.96);
          background: #38bdf8;
          box-shadow: 0 6px 18px rgba(14, 165, 233, 0.4);
        }
      `}),e.jsxs(P,{className:"glass-relative glass-intelligent-search-panel",children:[e.jsxs("div",{className:"glass-flex glass-flex-wrap glass-items-center glass-gap-3 glass-p-4",children:[e.jsxs("div",{className:"glass-relative glass-flex-1",children:[e.jsx("input",{ref:ee,type:"text",value:c,onChange:s=>ue(s.target.value),onKeyDown:s=>{s.key==="Enter"?re():s.key==="Escape"&&L(!1)},onFocus:()=>L(k.length>0),placeholder:u,className:"glass-w-full glass-min-w-0 glass-pl-10 glass-pr-4 glass-py-3 glass-border glass-border-subtle glass-radius-lg glass-focus-ring-2 glass-focus-ring-blue-500 focus:glass-border-blue glass-focus glass-touch-target glass-contrast-guard","aria-label":"Search input","aria-busy":K}),e.jsx("div",{className:"glass-absolute glass-left-3 glass-top-1/2 glass-transform glass--translate-y-1-2",children:K?e.jsx("div",{className:D("glass-w-5 glass-h-5 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full",!A&&"glass-animate-spin"),role:"status","aria-label":"Searching"}):e.jsx("span",{className:"glass-text-secondary glass-text-lg",children:"🔍"})})]}),g&&e.jsx("button",{onClick:me,disabled:Z,className:D("glass-px-3 glass-py-3 glass-radius-lg glass-focus glass-touch-target glass-contrast-guard",!A&&"glass-transition-colors",Z?D("glass-surface-subtle glass-text-primary",!A&&"glass-animate-pulse"):"glass-surface-subtle glass-text-secondary hover:glass-surface-subtle"),title:"Voice search",children:"🎤"}),e.jsx("button",{onClick:re,className:D("glass-search-primary-action glass-px-6 glass-py-3 glass-surface-blue glass-text-primary glass-radius-lg hover:glass-surface-blue glass-focus glass-touch-target glass-contrast-guard",!A&&"glass-transition-colors"),children:"Search"})]}),oe&&k.length>0&&e.jsx("div",{className:"glass-intelligent-search-panel glass-intelligent-search-dropdown glass-absolute glass-top-full glass-left-0 glass-right-0 glass-mt-2 glass-surface-subtle glass-border glass-border-subtle glass-radius-lg glass-shadow-lg glass-z-50 glass-max-h-60 glass-overflow-y-auto glass-contrast-guard",role:"listbox",children:k.map((s,a)=>e.jsxs("button",{ref:b=>de.current[a]=b,onClick:()=>he(s),className:"glass-w-full glass-px-4 glass-py-2 glass-text-left hover:glass-surface-subtle glass-flex glass-items-center glass-justify-between glass-gap-3 glass-border-b glass-border-subtle last:glass-border-b-0 glass-focus glass-touch-target glass-contrast-guard",role:"option",children:[e.jsxs("div",{className:"glass-flex glass-min-w-0 glass-items-center glass-gap-3",children:[e.jsxs("span",{className:"glass-text-sm",children:[s.type==="query"&&"🔍",s.type==="category"&&"📁",s.type==="tag"&&"🏷️"]}),e.jsx("span",{className:"glass-text-secondary glass-min-w-0 glass-break-words",children:s.text}),s.category&&e.jsxs("span",{className:"glass-text-xs glass-text-secondary",children:["in ",s.category]})]}),s.count&&e.jsx("span",{className:"glass-text-xs glass-text-secondary",children:s.count})]},`${s.type}-${s.text}`))})]}),l&&F&&c.trim()&&e.jsx(P,{className:"glass-intelligent-search-panel glass-mt-4 glass-p-4 glass-surface-subtle",children:e.jsxs("div",{className:"glass-flex glass-flex-wrap glass-items-center glass-gap-3 glass-text-sm",children:[e.jsxs("div",{className:"glass-flex glass-min-w-0 glass-items-center glass-gap-2",children:[e.jsx("span",{className:"glass-font-medium glass-text-primary",children:"Intent:"}),e.jsx("span",{className:"glass-px-2 glass-py-1 glass-surface-subtle glass-text-primary glass-radius glass-capitalize glass-break-words",children:F.intent})]}),F.entities.length>0&&e.jsxs("div",{className:"glass-flex glass-min-w-0 glass-flex-wrap glass-items-center glass-gap-2",children:[e.jsx("span",{className:"glass-font-medium glass-text-primary",children:"Entities:"}),e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-1",children:F.entities.slice(0,3).map((s,a)=>e.jsxs("span",{className:"glass-px-2 glass-py-1 glass-surface-subtle glass-text-primary glass-radius glass-text-xs glass-break-words",children:[s.type,": ",s.value]},a))})]}),e.jsxs("div",{className:"glass-flex glass-min-w-0 glass-flex-wrap glass-items-center glass-gap-2",children:[e.jsx("span",{className:"glass-font-medium glass-text-primary",children:"Keywords:"}),e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-1",children:F.keywords.slice(0,4).map((s,a)=>e.jsx("span",{className:"glass-px-2 glass-py-1 glass-surface-subtle glass-text-primary glass-radius glass-text-xs glass-break-words",children:s},a))})]})]})}),y&&se.length>0&&e.jsxs(P,{className:"glass-intelligent-search-panel glass-mt-4 glass-p-4",children:[e.jsxs("div",{className:"glass-flex glass-flex-wrap glass-items-center glass-justify-between glass-gap-3 glass-mb-4",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary",children:"Filters"}),Object.keys(S).length>0&&e.jsx("button",{onClick:pe,className:"glass-text-sm glass-text-primary hover:glass-text-primary glass-focus glass-touch-target glass-contrast-guard",children:"Clear all"})]}),e.jsx("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-4",children:se.map(s=>e.jsxs("div",{children:[e.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-secondary glass-mb-2",children:s.name}),s.type==="multiselect"&&e.jsx("div",{className:"glass-space-y-2 glass-max-h-32 glass-overflow-y-auto",children:s.options?.map(a=>e.jsxs("label",{className:"glass-flex glass-items-start glass-gap-2 glass-text-sm glass-touch-target glass-contrast-guard",children:[e.jsx("input",{type:"checkbox","data-glass-component":"checkbox",checked:M(S[s.id]).includes(a.value),onChange:b=>{const N=M(S[s.id]);b.target.checked?H(s.id,[...N,a.value]):H(s.id,N.filter(o=>o!==a.value))},className:"glass-search-checkbox glass-radius glass-border-subtle glass-text-primary glass-focus-ring-blue-500 glass-focus glass-contrast-guard"}),e.jsx("span",{className:"glass-flex-1 glass-min-w-0 glass-break-words",children:a.label}),e.jsxs("span",{className:"glass-text-secondary glass-text-xs",children:["(",a.count,")"]})]},a.value))}),s.type==="range"&&s.range&&e.jsxs("div",{children:[e.jsx("input",{type:"range","data-glass-component":"range",min:s.range.min,max:s.range.max,step:s.range.step||1,value:ne(S[s.id],s.range.min),onChange:a=>H(s.id,parseFloat(a.target.value)),className:"glass-search-range glass-w-full glass-focus glass-contrast-guard"}),e.jsxs("div",{className:"glass-flex glass-justify-between glass-text-xs glass-text-secondary glass-mt-1",children:[e.jsx("span",{children:s.range.min}),e.jsx("span",{className:"glass-font-medium",children:ne(S[s.id],s.range.min)}),e.jsx("span",{children:s.range.max})]})]})]},s.id))})]}),e.jsxs("div",{className:"glass-mt-6",children:[c.trim()||Object.keys(S).length>0?e.jsxs("div",{className:"glass-mb-4 glass-text-sm glass-text-secondary glass-break-words",role:"status","aria-live":"polite",children:["Found ",r.length," results",c.trim()&&e.jsxs("span",{children:[" ",'for "',e.jsx("span",{className:"glass-font-medium",children:c}),'"']}),Object.keys(S).length>0&&e.jsxs("span",{children:[" with ",Object.keys(S).length," filters applied"]})]}):null,e.jsxs("div",{className:"glass-space-y-4",children:[r.map(s=>e.jsx(P,{className:D("glass-intelligent-search-panel glass-p-6 glass-cursor-pointer hover:glass-shadow-lg glass-contrast-guard",!A&&"glass-transition-shadow"),onClick:()=>d?.(s),onKeyDown:a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),d?.(s))},role:d?"button":"article",tabIndex:d?0:void 0,children:e.jsxs("div",{className:"glass-flex glass-flex-col sm:glass-flex-row glass-items-start glass-gap-4",children:[e.jsx("div",{className:"glass-text-2xl glass-flex-shrink-0",children:fe(s.category)}),e.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[e.jsxs("div",{className:"glass-flex glass-flex-wrap glass-items-center glass-gap-2 glass-mb-2",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary glass-min-w-0 glass-break-words",children:le(s.title,s.highlights?.title)}),e.jsx("span",{className:"glass-px-2 glass-py-1 glass-text-xs glass-surface-subtle glass-text-secondary glass-radius glass-break-words",children:s.category}),s.metadata?.rating&&e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1",children:[e.jsx("span",{className:"glass-text-primary",children:"⭐"}),e.jsx("span",{className:"glass-text-sm glass-text-secondary",children:s.metadata.rating})]})]}),e.jsx("p",{className:"glass-text-secondary glass-mb-3 glass-break-words",children:le(s.description,s.highlights?.description)}),s.tags.length>0&&e.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-1",children:[s.tags.slice(0,5).map(a=>e.jsx("span",{className:"glass-px-2 glass-py-1 glass-text-xs glass-surface-subtle glass-text-primary glass-radius glass-break-words",children:a},a)),s.tags.length>5&&e.jsxs("span",{className:"glass-px-2 glass-py-1 glass-text-xs glass-surface-subtle glass-text-secondary glass-radius",children:["+",s.tags.length-5," more"]})]})]}),e.jsxs("div",{className:"glass-text-sm glass-text-secondary glass-flex-shrink-0",children:["Score: ",s.score.toFixed(1)]})]})},s.id)),r.length===0&&(c.trim()||Object.keys(S).length>0)&&!K&&e.jsxs(P,{className:"glass-intelligent-search-panel glass-text-center glass-px-6 glass-py-12 glass-text-secondary glass-surface-subtle glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-5xl glass-mb-4",children:"🔍"}),e.jsx("h3",{className:"glass-text-lg glass-font-medium glass-mb-2 glass-text-secondary",children:"No results found"}),e.jsx("p",{className:"glass-text-sm glass-break-words",children:"Try adjusting your search terms or filters, or try using more general keywords."})]})]})]})]})};try{$.displayName="GlassIntelligentSearch",$.__docgenInfo={description:"",displayName:"GlassIntelligentSearch",props:{data:{defaultValue:{value:"[]"},description:"",name:"data",required:!1,type:{name:"SearchResult[] | undefined"}},onSearch:{defaultValue:null,description:"",name:"onSearch",required:!1,type:{name:"((query: string, filters: SearchFilters) => void) | undefined"}},onResultClick:{defaultValue:null,description:"",name:"onResultClick",required:!1,type:{name:"((result: SearchResult) => void) | undefined"}},placeholder:{defaultValue:{value:"Search with natural language..."},description:"",name:"placeholder",required:!1,type:{name:"string | undefined"}},showFilters:{defaultValue:{value:"true"},description:"",name:"showFilters",required:!1,type:{name:"boolean | undefined"}},showSuggestions:{defaultValue:{value:"true"},description:"",name:"showSuggestions",required:!1,type:{name:"boolean | undefined"}},enableNLP:{defaultValue:{value:"true"},description:"",name:"enableNLP",required:!1,type:{name:"boolean | undefined"}},enableVoiceSearch:{defaultValue:{value:"false"},description:"",name:"enableVoiceSearch",required:!1,type:{name:"boolean | undefined"}},maxResults:{defaultValue:{value:"50"},description:"",name:"maxResults",required:!1,type:{name:"number | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const ve=({children:t})=>e.jsxs("div",{className:"glass-intelligent-search-story-frame",style:{width:"100%",height:"100vh",minHeight:0,boxSizing:"border-box",overflowX:"hidden",overflowY:"auto",padding:"clamp(16px, 3vw, 32px)",color:"#0f172a",background:"linear-gradient(135deg, rgba(239,246,255,0.95), rgba(240,253,250,0.9) 52%, rgba(248,250,252,0.96))"},children:[e.jsx("div",{style:{width:"min(100%, 1120px)",margin:"0 auto"},children:t}),e.jsx("style",{children:`
      .glass-intelligent-search-story-frame,
      .glass-intelligent-search-story-frame * {
        box-sizing: border-box;
      }

      .glass-intelligent-search-story-frame .glass-intelligent-search-panel {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.84), rgba(248, 250, 252, 0.72)), rgba(255, 255, 255, 0.78) !important;
        background-color: rgba(255, 255, 255, 0.78) !important;
      }

      .glass-intelligent-search-story-frame .glass-intelligent-search-dropdown {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(248, 250, 252, 0.86)), rgba(255, 255, 255, 0.9) !important;
        background-color: rgba(255, 255, 255, 0.9) !important;
      }

      .glass-intelligent-search-story-frame .glass-intelligent-search input[type="text"] {
        background: rgba(255, 255, 255, 0.78) !important;
        background-color: rgba(255, 255, 255, 0.78) !important;
      }

      .glass-intelligent-search-story-frame .search-story-surface {
        display: grid;
        gap: 24px;
      }

      .glass-intelligent-search-story-frame .search-story-hero,
      .glass-intelligent-search-story-frame .search-story-callout {
        border: 1px solid rgba(15, 23, 42, 0.12);
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.72);
        box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
        backdrop-filter: blur(22px) saturate(1.35);
      }

      .glass-intelligent-search-story-frame .search-story-hero {
        display: grid;
        grid-template-columns: minmax(0, 1.25fr) minmax(220px, 0.75fr);
        gap: 24px;
        align-items: center;
        padding: clamp(20px, 3vw, 32px);
      }

      .glass-intelligent-search-story-frame .search-story-hero h1 {
        margin: 0 0 10px;
        color: #0f172a;
        font-size: clamp(1.6rem, 3vw, 2.45rem);
        line-height: 1.08;
      }

      .glass-intelligent-search-story-frame .search-story-hero p,
      .glass-intelligent-search-story-frame .search-story-callout p {
        margin: 0;
        color: #334155;
        line-height: 1.6;
      }

      .glass-intelligent-search-story-frame .search-story-metrics {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .glass-intelligent-search-story-frame .search-story-metric {
        min-height: 88px;
        border: 1px solid rgba(15, 23, 42, 0.1);
        border-radius: 16px;
        padding: 14px;
        background: rgba(255, 255, 255, 0.62);
      }

      .glass-intelligent-search-story-frame .search-story-metric strong {
        display: block;
        color: #0f172a;
        font-size: 1.4rem;
        line-height: 1.1;
        overflow-wrap: anywhere;
      }

      .glass-intelligent-search-story-frame .search-story-metric span {
        display: block;
        margin-top: 6px;
        color: #475569;
        font-size: 0.875rem;
      }

      .glass-intelligent-search-story-frame .search-story-callout {
        padding: 22px;
      }

      .glass-intelligent-search-story-frame .search-story-callout h3,
      .glass-intelligent-search-story-frame .search-story-callout h4 {
        margin: 0 0 10px;
        color: #0f172a;
      }

      .glass-intelligent-search-story-frame .search-story-examples {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
        margin-top: 14px;
      }

      .glass-intelligent-search-story-frame .search-story-examples ul {
        margin: 0;
        padding-left: 1.1rem;
        color: #334155;
        line-height: 1.7;
      }

      .glass-intelligent-search-story-frame .search-compact {
        max-width: 42rem !important;
      }

      @media (max-width: 760px) {
        .glass-intelligent-search-story-frame .search-story-hero,
        .glass-intelligent-search-story-frame .search-story-examples {
          grid-template-columns: 1fr;
        }
      }
    `})]}),Ce={title:"Controls/Search/Glass Intelligent Search",component:$,decorators:[t=>e.jsx(ve,{children:e.jsx(t,{})})],parameters:{layout:"fullscreen",previewSurface:"app",docs:{description:{component:"Advanced search interface with NLP capabilities, smart filters, voice search, and intelligent suggestions - like Google or Elasticsearch with AI enhancement."}}}},R=[{id:"1",title:"Getting Started with React Hooks",description:"Learn how to use React Hooks to manage state and side effects in functional components. This comprehensive guide covers useState, useEffect, useContext, and custom hooks.",category:"Tutorial",tags:["react","hooks","javascript","frontend","web development"],score:0,metadata:{rating:4.8,author:"Jane Smith",date:"2024-01-15"}},{id:"2",title:"Advanced TypeScript Patterns",description:"Master advanced TypeScript concepts including generics, conditional types, mapped types, and utility types. Build type-safe applications with confidence.",category:"Documentation",tags:["typescript","patterns","advanced","types","programming"],score:0,metadata:{rating:4.6,author:"John Doe",date:"2024-02-20"}},{id:"3",title:"Building Responsive Design Systems",description:"Create scalable design systems with CSS-in-JS, design tokens, and component libraries. Learn best practices for responsive design and accessibility.",category:"Article",tags:["design system","css","responsive","accessibility","ui/ux"],score:0,metadata:{rating:4.9,author:"Alice Johnson",date:"2024-03-10"}},{id:"4",title:"Node.js Performance Optimization",description:"Optimize your Node.js applications for better performance. Learn about memory management, clustering, caching strategies, and monitoring tools.",category:"Guide",tags:["nodejs","performance","optimization","backend","javascript"],score:0,metadata:{rating:4.5,author:"Bob Wilson",date:"2024-01-25"}},{id:"5",title:"Introduction to Machine Learning",description:"Start your journey into machine learning with Python. Cover supervised and unsupervised learning, neural networks, and practical applications.",category:"Course",tags:["machine learning","python","ai","neural networks","data science"],score:0,metadata:{rating:4.7,author:"Dr. Sarah Chen",date:"2024-02-05"}},{id:"6",title:"GraphQL API Development",description:"Build efficient APIs with GraphQL. Learn about schemas, resolvers, subscriptions, and integration with React applications.",category:"Tutorial",tags:["graphql","api","react","backend","web development"],score:0,metadata:{rating:4.4,author:"Mike Rodriguez",date:"2024-03-01"}},{id:"7",title:"Docker Containerization Guide",description:"Containerize your applications with Docker. Learn about images, containers, Docker Compose, and deployment strategies.",category:"Guide",tags:["docker","containerization","deployment","devops","infrastructure"],score:0,metadata:{rating:4.6,author:"Emily Davis",date:"2024-01-30"}},{id:"8",title:"CSS Grid and Flexbox Mastery",description:"Master modern CSS layout techniques with Grid and Flexbox. Create complex layouts with ease and build responsive designs.",category:"Tutorial",tags:["css","grid","flexbox","layout","responsive design"],score:0,metadata:{rating:4.8,author:"Tom Anderson",date:"2024-02-15"}},{id:"9",title:"Vue.js 3 Composition API",description:"Explore Vue.js 3 and the Composition API. Learn about reactive state management, component composition, and modern Vue development.",category:"Documentation",tags:["vue","composition api","javascript","frontend","web development"],score:0,metadata:{rating:4.5,author:"Lisa Wong",date:"2024-03-05"}},{id:"10",title:"Database Design Principles",description:"Learn fundamental database design principles. Cover normalization, indexing, relationships, and performance optimization strategies.",category:"Guide",tags:["database","design","sql","normalization","performance"],score:0,metadata:{rating:4.7,author:"David Kim",date:"2024-01-20"}},{id:"11",title:"AWS Cloud Architecture",description:"Design scalable cloud architectures on AWS. Learn about EC2, S3, Lambda, RDS, and best practices for cloud-native applications.",category:"Course",tags:["aws","cloud","architecture","serverless","infrastructure"],score:0,metadata:{rating:4.9,author:"Jennifer Lee",date:"2024-02-28"}},{id:"12",title:"Testing Strategies for React Apps",description:"Comprehensive testing strategies for React applications. Cover unit testing, integration testing, and end-to-end testing with modern tools.",category:"Article",tags:["testing","react","jest","cypress","quality assurance"],score:0,metadata:{rating:4.6,author:"Chris Taylor",date:"2024-03-12"}}],z={args:{data:R,placeholder:"Search for tutorials, articles, and guides...",showFilters:!0,showSuggestions:!0,enableNLP:!1,enableVoiceSearch:!1,maxResults:10},parameters:{docs:{description:{story:'Basic search interface with text matching and filters. Try searching for "React", "TypeScript", or "CSS".'}}}},O={args:{data:R,placeholder:"Ask me anything in natural language...",showFilters:!0,showSuggestions:!0,enableNLP:!0,enableVoiceSearch:!0,maxResults:10},parameters:{docs:{description:{story:'Advanced search with NLP capabilities. Try queries like "find the best React tutorials", "show me guides about performance", or "compare frontend frameworks".'}}}},_={args:{data:R,placeholder:"Click the microphone to search with your voice...",showFilters:!1,showSuggestions:!0,enableNLP:!0,enableVoiceSearch:!0,maxResults:8},parameters:{docs:{description:{story:"Voice-enabled search with speech recognition. Click the microphone button and speak your search query."}}}},B={args:{data:R,placeholder:"Use filters to find content...",showFilters:!0,showSuggestions:!1,enableNLP:!1,enableVoiceSearch:!1,maxResults:15},parameters:{docs:{description:{story:"Focus on advanced filtering capabilities. Use the filter controls to narrow down results by category, tags, and rating."}}}},W={render:()=>{const[t,n]=U.useState(""),[d,u]=U.useState("No result selected"),y=(l,g)=>{n(l)},m=l=>{u(l.title)};return e.jsxs("div",{className:"search-story-surface",children:[e.jsxs("section",{className:"search-story-hero",children:[e.jsxs("div",{children:[e.jsx("h1",{children:"Knowledge Search Workspace"}),e.jsx("p",{children:"Natural-language search, adaptive filters, suggestions, and result scoring are composed as a real documentation workspace."})]}),e.jsxs("div",{className:"search-story-metrics","aria-label":"Search demo metrics",children:[e.jsxs("div",{className:"search-story-metric",children:[e.jsx("strong",{children:R.length}),e.jsx("span",{children:"indexed records"})]}),e.jsxs("div",{className:"search-story-metric",children:[e.jsx("strong",{children:"3"}),e.jsx("span",{children:"filter dimensions"})]}),e.jsxs("div",{className:"search-story-metric",children:[e.jsx("strong",{children:t||"Ready"}),e.jsx("span",{children:"current query"})]}),e.jsxs("div",{className:"search-story-metric",children:[e.jsx("strong",{children:d}),e.jsx("span",{children:"selection state"})]})]})]}),e.jsx($,{data:R,onSearch:y,onResultClick:m,placeholder:"Try: 'find the best React tutorials' or 'show me guides about performance'",showFilters:!0,showSuggestions:!0,enableNLP:!0,enableVoiceSearch:!0,maxResults:12}),e.jsxs("section",{className:"search-story-callout",children:[e.jsx("h3",{children:"Recommended demo queries"}),e.jsx("p",{children:"These examples exercise scoring, suggestions, query analysis, and multi-select filter controls without depending on external services."}),e.jsxs("div",{className:"search-story-examples",children:[e.jsxs("div",{children:[e.jsx("h4",{children:"Natural language"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Find the best React tutorials"}),e.jsx("li",{children:"Show me guides about performance"}),e.jsx("li",{children:"Compare frontend frameworks"}),e.jsx("li",{children:"Help me learn machine learning"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{children:"Feature coverage"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Type to reveal suggestions and result highlighting"}),e.jsx("li",{children:"Filter by category, tags, and minimum rating"}),e.jsx("li",{children:"Inspect NLP intent and extracted keywords"}),e.jsx("li",{children:"Select a result to update the workspace state"})]})]})]})]})]})},parameters:{docs:{description:{story:"Complete showcase of the intelligent search system with all advanced features enabled."}}}},J={render:()=>{const t=["Tutorial","Article","Guide","Course","Documentation","Video","Podcast","Tool"],n=["React","Vue","Angular","Node.js","Python","TypeScript","JavaScript","Go","Rust","Java"],d=["Performance","Security","Testing","Design","Architecture","DevOps","Database","API","Frontend","Backend"],u=Array.from({length:100},(y,m)=>{const l=n[m%n.length],g=d[m%d.length],i=t[m%t.length],x=3+m*17%21/10,j=String(m%12+1).padStart(2,"0"),f=String(m%28+1).padStart(2,"0");return{id:`item-${m}`,title:`${g} in ${l} - ${i} #${m+1}`,description:`Learn about ${g.toLowerCase()} concepts in ${l}. This ${i.toLowerCase()} covers advanced techniques, best practices, and real-world applications for modern development.`,category:i,tags:[l.toLowerCase(),g.toLowerCase(),i.toLowerCase(),"programming","development"],score:0,metadata:{rating:Math.round(x*10)/10,author:`Author ${m+1}`,date:`2024-${j}-${f}`}}});return e.jsxs("div",{className:"glass-space-y-4",children:[e.jsxs("div",{className:"glass-surface-subtle glass-p-4 glass-radius-lg",children:[e.jsx("h3",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Performance Test Dataset"}),e.jsxs("p",{className:"glass-text-primary glass-text-sm",children:["This demo uses ",u.length," items to test search performance with larger datasets. Try searching for technology names, topics, or categories to see how the intelligent search handles scale."]})]}),e.jsx($,{data:u,placeholder:"Search through 100+ items with intelligent filtering...",showFilters:!0,showSuggestions:!0,enableNLP:!0,enableVoiceSearch:!0,maxResults:20})]})},parameters:{docs:{description:{story:"Performance test with a larger dataset of 100+ items to demonstrate search scalability and intelligent filtering."}}}},Q={args:{data:R.slice(0,6),placeholder:"Custom styled search interface...",showFilters:!0,showSuggestions:!0,enableNLP:!0,enableVoiceSearch:!1,maxResults:6,className:"search-compact"},parameters:{docs:{description:{story:"Search interface with custom styling and layout constraints."}}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedTitle, setSelectedTitle] = React.useState('No result selected');
    const handleSearch = (query: string, filters: Record<string, any>) => {
      setSearchQuery(query);
    };
    const handleResultClick = (result: SearchResult) => {
      setSelectedTitle(result.title);
    };
    return <div className="search-story-surface">
        <section className="search-story-hero">
          <div>
            <h1>Knowledge Search Workspace</h1>
            <p>
              Natural-language search, adaptive filters, suggestions, and result scoring are composed as a real documentation workspace.
            </p>
          </div>
          <div className="search-story-metrics" aria-label="Search demo metrics">
            <div className="search-story-metric">
              <strong>{sampleData.length}</strong>
              <span>indexed records</span>
            </div>
            <div className="search-story-metric">
              <strong>3</strong>
              <span>filter dimensions</span>
            </div>
            <div className="search-story-metric">
              <strong>{searchQuery || 'Ready'}</strong>
              <span>current query</span>
            </div>
            <div className="search-story-metric">
              <strong>{selectedTitle}</strong>
              <span>selection state</span>
            </div>
          </div>
        </section>

        <GlassIntelligentSearch data={sampleData} onSearch={handleSearch} onResultClick={handleResultClick} placeholder="Try: 'find the best React tutorials' or 'show me guides about performance'" showFilters={true} showSuggestions={true} enableNLP={true} enableVoiceSearch={true} maxResults={12} />

        <section className="search-story-callout">
          <h3>Recommended demo queries</h3>
          <p>
            These examples exercise scoring, suggestions, query analysis, and multi-select filter controls without depending on external services.
          </p>
          <div className="search-story-examples">
            <div>
              <h4>Natural language</h4>
              <ul>
                <li>Find the best React tutorials</li>
                <li>Show me guides about performance</li>
                <li>Compare frontend frameworks</li>
                <li>Help me learn machine learning</li>
              </ul>
            </div>
            <div>
              <h4>Feature coverage</h4>
              <ul>
                <li>Type to reveal suggestions and result highlighting</li>
                <li>Filter by category, tags, and minimum rating</li>
                <li>Inspect NLP intent and extracted keywords</li>
                <li>Select a result to update the workspace state</li>
              </ul>
            </div>
          </div>
        </section>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete showcase of the intelligent search system with all advanced features enabled.'
      }
    }
  }
}`,...W.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
      const rating = 3 + i * 17 % 21 / 10;
      const month = String(i % 12 + 1).padStart(2, '0');
      const day = String(i % 28 + 1).padStart(2, '0');
      return {
        id: \`item-\${i}\`,
        title: \`\${topic} in \${tech} - \${category} #\${i + 1}\`,
        description: \`Learn about \${topic.toLowerCase()} concepts in \${tech}. This \${category.toLowerCase()} covers advanced techniques, best practices, and real-world applications for modern development.\`,
        category,
        tags: [tech.toLowerCase(), topic.toLowerCase(), category.toLowerCase(), 'programming', 'development'],
        score: 0,
        metadata: {
          rating: Math.round(rating * 10) / 10,
          author: \`Author \${i + 1}\`,
          date: \`2024-\${month}-\${day}\`
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
}`,...J.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    data: sampleData.slice(0, 6),
    placeholder: "Custom styled search interface...",
    showFilters: true,
    showSuggestions: true,
    enableNLP: true,
    enableVoiceSearch: false,
    maxResults: 6,
    className: "search-compact"
  },
  parameters: {
    docs: {
      description: {
        story: 'Search interface with custom styling and layout constraints.'
      }
    }
  }
}`,...Q.parameters?.docs?.source}}};const Re=["BasicSearch","IntelligentNLP","VoiceSearch","FiltersOnly","SearchShowcase","LargeDataset","CustomStyling"];export{z as BasicSearch,Q as CustomStyling,B as FiltersOnly,O as IntelligentNLP,J as LargeDataset,W as SearchShowcase,_ as VoiceSearch,Re as __namedExportsOrder,Ce as default};
