import{r as p,a as ve,j as e,c as R,R as Y}from"./iframe-Cqi-9gHA.js";import{G as V}from"./GlassCore-BlpRxUNK.js";import"./preload-helper-PPVm8Dsz.js";const X=r=>Array.isArray(r)&&r.every(n=>typeof n=="string"),Se=r=>typeof r=="object"&&r!==null&&!Array.isArray(r)&&"start"in r&&"end"in r,M=r=>X(r)?r:[],oe=(r,n)=>typeof r=="number"?r:n,ge=r=>{const n=r.toLowerCase();let m="search";n.includes("find")||n.includes("show")||n.includes("get")?m="retrieve":n.includes("compare")||n.includes("vs")||n.includes("versus")?m="compare":n.includes("best")||n.includes("top")||n.includes("recommend")?m="recommend":(n.includes("help")||n.includes("how to")||n.includes("tutorial"))&&(m="help");const c=[];r.match(/(\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|today|yesterday|last week|this month)/gi)?.forEach(a=>{c.push({type:"date",value:a})}),r.match(/\b\d+(?:\.\d+)?\b/g)?.forEach(a=>{c.push({type:"number",value:a})}),["product","service","article","document","image","video","user","project"].forEach(a=>{n.includes(a)&&c.push({type:"category",value:a})});const d=["good","great","excellent","amazing","best","love","fantastic"],i=["bad","terrible","awful","worst","hate","horrible","useless"],h=d.some(a=>n.includes(a)),S=i.some(a=>n.includes(a));let u="neutral";h&&!S?u="positive":S&&!h&&(u="negative");const j=["the","a","an","and","or","but","in","on","at","to","for","of","with","by","is","are","was","were","been","be","have","has","had","do","does","did","will","would","could","should","may","might","can","this","that","these","those"],x=r.toLowerCase().split(/\s+/).filter(a=>a.length>2&&!j.includes(a)).filter((a,b,N)=>N.indexOf(a)===b);return{intent:m,entities:c,sentiment:u,keywords:x}},je=(r,n,m,c=!0)=>{if(!r.trim()&&Object.keys(m).length===0)return n;const f=c?ge(r):null,g=r.toLowerCase().split(/\s+/).filter(l=>l.length>0);return n.map(l=>{let d=0;const i=g.reduce((x,a)=>x+(l.title.toLowerCase().includes(a)?1:0),0),h=g.reduce((x,a)=>x+(l.description.toLowerCase().includes(a)?.5:0),0),S=g.reduce((x,a)=>x+l.tags.filter(b=>b.toLowerCase().includes(a)).length*.7,0);if(d=i*3+h+S,f&&c){f.intent==="recommend"&&l.metadata?.rating&&(d+=l.metadata.rating*.5),f.entities.forEach(a=>{a.type==="category"&&l.category.toLowerCase().includes(a.value)&&(d+=1)});const x=f.keywords.filter(a=>l.title.toLowerCase().includes(a)||l.description.toLowerCase().includes(a)).length;d+=x*.3}let u=!0;Object.entries(m).forEach(([x,a])=>{if(!(!a||Array.isArray(a)&&a.length===0))switch(x){case"category":X(a)?u=u&&a.includes(l.category):typeof a=="string"&&(u=u&&l.category===a);break;case"tags":X(a)&&(u=u&&a.some(b=>l.tags.includes(b)));break;case"dateRange":if(l.metadata?.date&&Se(a)){const b=new Date(l.metadata.date),N=new Date(a.start),F=new Date(a.end);u=u&&b>=N&&b<=F}break;case"rating":l.metadata?.rating&&typeof a=="number"&&(u=u&&l.metadata.rating>=a);break}}),u||(d=0);const j={};return d>0&&g.forEach(x=>{l.title.toLowerCase().includes(x)&&(j.title||(j.title=[]),j.title.push(x)),l.description.toLowerCase().includes(x)&&(j.description||(j.description=[]),j.description.push(x))}),{...l,score:d,highlights:j}}).filter(l=>l.score>0).sort((l,d)=>d.score-l.score)},ce=(r,n,m)=>{const c=[];if(!n||n.length===0)return c;const f=r.toLowerCase();m.filter(i=>i.toLowerCase().includes(f)).slice(0,3).forEach(i=>{c.push({text:i,type:"query"})}),[...new Set(n.map(i=>i.category))].filter(i=>i.toLowerCase().includes(f)).slice(0,3).forEach(i=>{const h=n.filter(S=>S.category===i).length;c.push({text:i,type:"category",category:"Categories",count:h})});const d=n.flatMap(i=>i.tags).reduce((i,h)=>(i[h]=(i[h]||0)+1,i),{});return Object.entries(d).filter(([i])=>i.toLowerCase().includes(f)).sort(([,i],[,h])=>h-i).slice(0,5).forEach(([i,h])=>{c.push({text:i,type:"tag",category:"Tags",count:h})}),c},$=({data:r=[],initialQuery:n="",onSearch:m,onResultClick:c,placeholder:f="Search with natural language...",showFilters:g=!0,showSuggestions:l=!0,suggestionsInitiallyOpen:d=!1,enableNLP:i=!0,enableVoiceSearch:h=!1,maxResults:S=50,className:u,"aria-label":j,"data-testid":x})=>{const[a,b]=p.useState(n),[N,F]=p.useState([]),[K,Z]=p.useState(()=>n?ce(n,r,[]):[]),[w,I]=p.useState({}),[de,T]=p.useState(d),[U,E]=p.useState(!1),[ee,pe]=p.useState([]),[A,he]=p.useState(null),[se,G]=p.useState(!1),ae=p.useRef(null),C=p.useRef(),ue=p.useRef([]),D=p.useRef(!1),P=p.useRef(!0),q=ve(),te=p.useMemo(()=>{if(!r||r.length===0)return[];const s=[...new Set(r.map(o=>o.category))],y=r.flatMap(o=>o?.tags||[]).reduce((o,v)=>(v&&(o[v]=(o[v]||0)+1),o),{}),k=Object.entries(y).sort(([,o],[,v])=>v-o).slice(0,20).map(([o,v])=>({value:o,label:o,count:v}));return[{id:"category",name:"Category",type:"multiselect",options:s.map(o=>({value:o,label:o,count:r.filter(v=>v.category===o).length}))},{id:"tags",name:"Tags",type:"multiselect",options:k},{id:"rating",name:"Minimum Rating",type:"range",range:{min:0,max:5,step:.5}}]},[r]);p.useEffect(()=>(D.current=!0,P.current=!0,()=>{D.current=!1,C.current&&clearTimeout(C.current)}),[]);const re=p.useCallback((s,t)=>{D.current&&(E(!0),C.current&&clearTimeout(C.current),C.current=setTimeout(()=>{if(!D.current)return;if(!s.trim()&&Object.keys(t).length===0){F([]),E(!1);return}const k=je(s,r,t,i).slice(0,S);F(k),E(!1),i&&s.trim()&&he(ge(s)),m?.(s,t)},300))},[r,i,S,m]);p.useEffect(()=>{if(P.current){P.current=!1;return}if(D.current)if(a.length>0){const s=r.length>0?r:[],t=ce(a,s,ee);Z(t),T(!0)}else Z([]),T(!1)},[a]);const ne=p.useRef(re);ne.current=re,p.useEffect(()=>{if(P.current){P.current=!1;return}if(D.current){if(!a.trim()&&Object.keys(w).length===0){F([]),E(!1);return}return ne.current(a,w),()=>{C.current&&clearTimeout(C.current)}}},[a,w]);const me=s=>{b(s)},xe=s=>{s.type==="query"?b(s.text):s.type==="category"?I(t=>({...t,category:[...M(t.category),s.text]})):s.type==="tag"&&I(t=>({...t,tags:[...M(t.tags),s.text]})),T(!1),ae.current?.focus()},ie=()=>{a.trim()&&!ee.includes(a.trim())&&pe(s=>[a.trim(),...s.slice(0,9)]),T(!1)},H=(s,t)=>{I(y=>({...y,[s]:t}))},fe=()=>{I({})},ye=()=>{const s=window.webkitSpeechRecognition;if(!h||!s)return;const t=new s;t.lang="en-US",t.continuous=!1,t.interimResults=!1,t.onstart=()=>{G(!0)},t.onresult=y=>{const k=y.results[0][0].transcript;b(k),G(!1)},t.onerror=()=>{G(!1)},t.onend=()=>{G(!1)},t.start()},le=(s,t=[])=>{if(!t.length)return s;const y=t.filter(Boolean).map(o=>o.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"));if(!y.length)return s;const k=new RegExp(`(${y.join("|")})`,"gi");return e.jsx(e.Fragment,{children:s.split(k).map((o,v)=>y.some(we=>new RegExp(`^${we}$`,"i").test(o))?e.jsx("mark",{className:"glass-px-1 glass-radius-sm glass-surface-subtle glass-text-primary",children:o},`${o}-${v}`):e.jsx(Y.Fragment,{children:o},`${o}-${v}`))})},be=s=>({document:"📄",article:"📝",image:"🖼️",video:"🎥",product:"🛍️",user:"👤",project:"📁",service:"⚙️"})[s.toLowerCase()]||"🔍";return e.jsxs("div",{"data-glass-component":!0,className:R("glass-intelligent-search glass-w-full glass-min-w-0",u),style:{width:"100%",maxWidth:"64rem",margin:"0 auto"},"aria-label":j,"data-testid":x,children:[e.jsx("style",{children:`
        .glass-intelligent-search-panel {
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.2)),
            rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.18) !important;
          color: var(--glass-theme-text, var(--glass-text-primary)) !important;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.82),
            0 18px 48px rgba(15, 23, 42, 0.12);
          backdrop-filter: blur(24px) saturate(1.5) brightness(1.04) contrast(1.04);
          -webkit-backdrop-filter: blur(24px) saturate(1.5) brightness(1.04) contrast(1.04);
        }

        .glass-intelligent-search-panel label,
        .glass-intelligent-search-panel h3 {
          color: var(--glass-theme-text, var(--glass-text-primary)) !important;
        }

        .glass-intelligent-search-panel p {
          color: var(--glass-theme-text-secondary, var(--glass-text-secondary)) !important;
        }

        .glass-intelligent-search-panel button {
          min-height: 44px;
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.22)),
            rgba(255, 255, 255, 0.26) !important;
          border: 1px solid rgba(255, 255, 255, 0.18) !important;
          color: var(--glass-theme-text, var(--glass-text-primary)) !important;
          border-radius: 14px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.84), 0 6px 18px rgba(15, 23, 42, 0.08);
        }

        .glass-intelligent-search-panel .glass-search-primary-action {
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.22)),
            rgba(255, 255, 255, 0.3) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          color: var(--glass-theme-text, var(--glass-text-primary)) !important;
          font-weight: 650;
        }

        .glass-intelligent-search-dropdown {
          background: rgba(255, 255, 255, 0.3) !important;
          background-image: none !important;
          border: 1px solid rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(var(--glass-neutral-level4-blur)) var(--glass-filter-base);
          -webkit-backdrop-filter: blur(var(--glass-neutral-level4-blur)) var(--glass-filter-base);
        }

        .glass-intelligent-search-dropdown--fixture {
          position: relative !important;
          inset: auto !important;
          margin: 0 16px 16px !important;
          max-height: none !important;
          overflow: visible !important;
          padding: 8px !important;
        }

        .glass-intelligent-search-dropdown [role="option"] {
          margin-bottom: 8px;
        }

        .glass-intelligent-search-dropdown [role="option"]:last-child {
          margin-bottom: 0;
        }

        .glass-intelligent-search input[type="text"] {
          appearance: none;
          -webkit-appearance: none;
          min-height: 44px;
          padding-left: 44px !important;
          background: rgba(255, 255, 255, 0.32) !important;
          color: var(--glass-theme-text, var(--glass-text-primary)) !important;
          border-color: rgba(255, 255, 255, 0.18) !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .glass-intelligent-search input[type="text"]::placeholder {
          color: var(--glass-theme-text-tertiary, var(--glass-text-tertiary)) !important;
        }

        .glass-search-input-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto auto;
          align-items: center;
          gap: 12px;
          padding: 16px;
        }

        .glass-search-input-wrap { position: relative; min-width: 0; }
        .glass-search-leading-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          display: grid;
          width: 20px;
          height: 20px;
          place-items: center;
          color: var(--glass-theme-text-secondary, var(--glass-text-secondary)) !important;
          pointer-events: none;
        }

        .glass-search-leading-icon span { color: inherit !important; line-height: 1; }

        .glass-search-filters-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .glass-search-filter-options {
          display: grid;
          gap: 8px;
          max-height: 176px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .glass-search-filter-option {
          display: grid !important;
          grid-template-columns: 18px minmax(0, 1fr) auto;
          align-items: center !important;
          gap: 10px !important;
          min-height: 36px;
          color: var(--glass-theme-text, var(--glass-text-primary)) !important;
        }

        .glass-search-filter-label,
        .glass-search-filter-count {
          color: var(--glass-theme-text-secondary, var(--glass-text-secondary)) !important;
        }

        .glass-search-filter-count { font-variant-numeric: tabular-nums; }

        .glass-search-checkbox {
          appearance: none;
          -webkit-appearance: none;
          width: 1rem;
          height: 1rem;
          flex: 0 0 1rem;
          margin-top: 0.125rem;
          border-radius: 0.375rem;
          border: 1px solid rgba(15, 23, 42, 0.28);
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.24));
          box-shadow:
            inset 0 1px 1px rgba(255, 255, 255, 0.18),
            0 4px 12px rgba(15, 23, 42, 0.1);
          cursor: pointer;
        }

        .glass-search-checkbox:checked {
          border-color: rgba(15, 23, 42, 0.58);
          background:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='m3.5 8.3 2.8 2.8 6.2-6.2' fill='none' stroke='%230f172a' stroke-width='2.1' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 13px 13px no-repeat,
            rgba(255, 255, 255, 0.35);
          box-shadow:
            0 0 0 1px rgba(15, 23, 42, 0.18),
            0 8px 18px rgba(15, 23, 42, 0.14);
        }

        .glass-search-range {
          appearance: none;
          -webkit-appearance: none;
          height: 0.625rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.42);
          background:
            linear-gradient(90deg, rgba(226, 232, 240, 0.96), rgba(203, 213, 225, 0.82)),
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
          background: #94a3b8;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.24);
        }

        .glass-search-range::-moz-range-thumb {
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 999px;
          border: 2px solid rgba(248, 250, 252, 0.96);
          background: #94a3b8;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.24);
        }

        .glass-search-voice-ready {
          margin-top: 16px;
          padding: clamp(24px, 5vw, 44px);
          text-align: center;
        }

        .glass-search-voice-ready-icon {
          display: grid;
          width: 58px;
          height: 58px;
          margin: 0 auto 14px;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.82), 0 12px 28px rgba(15,23,42,.1);
          font-size: 24px;
        }

        .glass-search-voice-ready h3 { margin: 0 0 8px; font-size: 1.1rem; }
        .glass-search-voice-ready p { max-width: 34rem; margin: 0 auto; line-height: 1.55; }

        @media (max-width: 720px) {
          .glass-search-input-row { grid-template-columns: minmax(0, 1fr) auto; }
          .glass-search-primary-action { grid-column: 1 / -1; width: 100%; }
          .glass-search-filters-grid { grid-template-columns: 1fr; }
          .glass-search-filter-options { max-height: none; overflow-y: visible; }
        }

        @media (max-width: 390px) {
          .glass-search-input-row { padding: 12px; gap: 10px; }
          .glass-search-input-row > button:not(.glass-search-primary-action) { width: 44px; padding-inline: 0 !important; }
        }
      `}),e.jsxs(V,{className:"glass-relative glass-intelligent-search-panel",children:[e.jsxs("div",{className:"glass-search-input-row",children:[e.jsxs("div",{className:"glass-search-input-wrap",children:[e.jsx("input",{ref:ae,type:"text",value:a,onChange:s=>me(s.target.value),onKeyDown:s=>{s.key==="Enter"?ie():s.key==="Escape"&&T(!1)},onFocus:()=>T(K.length>0),placeholder:f,className:"glass-w-full glass-min-w-0 glass-pl-10 glass-pr-4 glass-py-3 glass-border glass-border-subtle glass-radius-lg glass-focus-ring-2 glass-focus-ring-blue-500 focus:glass-border-blue glass-focus glass-touch-target glass-contrast-guard","aria-label":"Search input","aria-busy":U}),e.jsx("div",{className:"glass-search-leading-icon",children:U?e.jsx("div",{className:R("glass-w-5 glass-h-5 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full",!q&&"glass-animate-spin"),role:"status","aria-label":"Searching"}):e.jsx("span",{className:"glass-text-lg",children:"🔍"})})]}),h&&e.jsx("button",{onClick:ye,disabled:se,className:R("glass-px-3 glass-py-3 glass-radius-lg glass-focus glass-touch-target glass-contrast-guard",!q&&"glass-transition-colors",se?R("glass-surface-subtle glass-text-primary",!q&&"glass-animate-pulse"):"glass-surface-subtle glass-text-secondary hover:glass-surface-subtle"),title:"Voice search",children:"🎤"}),e.jsx("button",{onClick:ie,className:R("glass-search-primary-action glass-px-6 glass-py-3 glass-text-primary glass-radius-lg glass-focus glass-touch-target glass-contrast-guard",!q&&"glass-transition-colors"),children:"Search"})]}),de&&K.length>0&&e.jsx("div",{className:R("glass-intelligent-search-dropdown glass-absolute glass-top-full glass-left-0 glass-right-0 glass-mt-2 glass-border glass-border-subtle glass-radius-lg glass-shadow-lg glass-z-50 glass-max-h-60 glass-overflow-y-auto glass-contrast-guard",d&&"glass-intelligent-search-dropdown--fixture"),role:"listbox",children:K.map((s,t)=>e.jsxs("button",{ref:y=>ue.current[t]=y,onClick:()=>xe(s),className:"glass-w-full glass-px-4 glass-py-2 glass-text-left hover:glass-surface-subtle glass-flex glass-items-center glass-justify-between glass-gap-3 glass-border-b glass-border-subtle last:glass-border-b-0 glass-focus glass-touch-target glass-contrast-guard",role:"option",children:[e.jsxs("div",{className:"glass-flex glass-min-w-0 glass-items-center glass-gap-3",children:[e.jsxs("span",{className:"glass-text-sm",children:[s.type==="query"&&"🔍",s.type==="category"&&"📁",s.type==="tag"&&"🏷️"]}),e.jsx("span",{className:"glass-text-secondary glass-min-w-0 glass-break-words",children:s.text}),s.category&&e.jsxs("span",{className:"glass-text-xs glass-text-secondary",children:["in ",s.category]})]}),s.count&&e.jsx("span",{className:"glass-text-xs glass-text-secondary",children:s.count})]},`${s.type}-${s.text}`))})]}),i&&A&&a.trim()&&e.jsx(V,{className:"glass-intelligent-search-panel glass-mt-4 glass-p-4 glass-surface-subtle",children:e.jsxs("div",{className:"glass-flex glass-flex-wrap glass-items-center glass-gap-3 glass-text-sm",children:[e.jsxs("div",{className:"glass-flex glass-min-w-0 glass-items-center glass-gap-2",children:[e.jsx("span",{className:"glass-font-medium glass-text-primary",children:"Intent:"}),e.jsx("span",{className:"glass-px-2 glass-py-1 glass-surface-subtle glass-text-primary glass-radius glass-capitalize glass-break-words",children:A.intent})]}),A.entities.length>0&&e.jsxs("div",{className:"glass-flex glass-min-w-0 glass-flex-wrap glass-items-center glass-gap-2",children:[e.jsx("span",{className:"glass-font-medium glass-text-primary",children:"Entities:"}),e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-1",children:A.entities.slice(0,3).map((s,t)=>e.jsxs("span",{className:"glass-px-2 glass-py-1 glass-surface-subtle glass-text-primary glass-radius glass-text-xs glass-break-words",children:[s.type,": ",s.value]},t))})]}),e.jsxs("div",{className:"glass-flex glass-min-w-0 glass-flex-wrap glass-items-center glass-gap-2",children:[e.jsx("span",{className:"glass-font-medium glass-text-primary",children:"Keywords:"}),e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-1",children:A.keywords.slice(0,4).map((s,t)=>e.jsx("span",{className:"glass-px-2 glass-py-1 glass-surface-subtle glass-text-primary glass-radius glass-text-xs glass-break-words",children:s},t))})]})]})}),g&&te.length>0&&e.jsxs(V,{className:"glass-intelligent-search-panel glass-mt-4 glass-p-4",children:[e.jsxs("div",{className:"glass-flex glass-flex-wrap glass-items-center glass-justify-between glass-gap-3 glass-mb-4",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary",children:"Filters"}),Object.keys(w).length>0&&e.jsx("button",{onClick:fe,className:"glass-text-sm glass-text-primary hover:glass-text-primary glass-focus glass-touch-target glass-contrast-guard",children:"Clear all"})]}),e.jsx("div",{className:"glass-search-filters-grid",children:te.map(s=>e.jsxs("div",{children:[e.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-secondary glass-mb-2",children:s.name}),s.type==="multiselect"&&e.jsx("div",{className:"glass-search-filter-options",children:s.options?.map(t=>e.jsxs("label",{className:"glass-search-filter-option glass-text-sm glass-touch-target glass-contrast-guard",children:[e.jsx("input",{type:"checkbox","data-glass-component":"checkbox",checked:M(w[s.id]).includes(t.value),onChange:y=>{const k=M(w[s.id]);y.target.checked?H(s.id,[...k,t.value]):H(s.id,k.filter(o=>o!==t.value))},className:"glass-search-checkbox glass-radius glass-border-subtle glass-text-primary glass-focus-ring-blue-500 glass-focus glass-contrast-guard"}),e.jsx("span",{className:"glass-search-filter-label glass-min-w-0 glass-break-words",children:t.label}),e.jsxs("span",{className:"glass-search-filter-count glass-text-xs",children:["(",t.count,")"]})]},t.value))}),s.type==="range"&&s.range&&e.jsxs("div",{children:[e.jsx("input",{type:"range","data-glass-component":"range",min:s.range.min,max:s.range.max,step:s.range.step||1,value:oe(w[s.id],s.range.min),onChange:t=>H(s.id,parseFloat(t.target.value)),className:"glass-search-range glass-w-full glass-focus glass-contrast-guard"}),e.jsxs("div",{className:"glass-flex glass-justify-between glass-text-xs glass-text-secondary glass-mt-1",children:[e.jsx("span",{children:s.range.min}),e.jsx("span",{className:"glass-font-medium",children:oe(w[s.id],s.range.min)}),e.jsx("span",{children:s.range.max})]})]})]},s.id))})]}),e.jsxs("div",{className:"glass-mt-6",children:[h&&!g&&!a.trim()&&e.jsxs(V,{className:"glass-intelligent-search-panel glass-search-voice-ready glass-contrast-guard",children:[e.jsx("div",{className:"glass-search-voice-ready-icon","aria-hidden":"true",children:"🎤"}),e.jsx("h3",{children:"Voice search is ready"}),e.jsx("p",{children:"Use the microphone button or type a request above. Spoken queries are transcribed locally by your browser before search begins."})]}),a.trim()||Object.keys(w).length>0?e.jsxs("div",{className:"glass-mb-4 glass-text-sm glass-text-secondary glass-break-words",role:"status","aria-live":"polite",children:["Found ",N.length," results",a.trim()&&e.jsxs("span",{children:[" ",'for "',e.jsx("span",{className:"glass-font-medium",children:a}),'"']}),Object.keys(w).length>0&&e.jsxs("span",{children:[" with ",Object.keys(w).length," filters applied"]})]}):null,e.jsxs("div",{className:"glass-space-y-4",children:[N.map(s=>e.jsx(V,{className:R("glass-intelligent-search-panel glass-p-6 glass-cursor-pointer hover:glass-shadow-lg glass-contrast-guard",!q&&"glass-transition-shadow"),onClick:()=>c?.(s),onKeyDown:t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),c?.(s))},role:c?"button":"article",tabIndex:c?0:void 0,children:e.jsxs("div",{className:"glass-flex glass-flex-col sm:glass-flex-row glass-items-start glass-gap-4",children:[e.jsx("div",{className:"glass-text-2xl glass-flex-shrink-0",children:be(s.category)}),e.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[e.jsxs("div",{className:"glass-flex glass-flex-wrap glass-items-center glass-gap-2 glass-mb-2",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary glass-min-w-0 glass-break-words",children:le(s.title,s.highlights?.title)}),e.jsx("span",{className:"glass-px-2 glass-py-1 glass-text-xs glass-surface-subtle glass-text-secondary glass-radius glass-break-words",children:s.category}),s.metadata?.rating&&e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1",children:[e.jsx("span",{className:"glass-text-primary",children:"⭐"}),e.jsx("span",{className:"glass-text-sm glass-text-secondary",children:s.metadata.rating})]})]}),e.jsx("p",{className:"glass-text-secondary glass-mb-3 glass-break-words",children:le(s.description,s.highlights?.description)}),s.tags.length>0&&e.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-1",children:[s.tags.slice(0,5).map(t=>e.jsx("span",{className:"glass-px-2 glass-py-1 glass-text-xs glass-surface-subtle glass-text-primary glass-radius glass-break-words",children:t},t)),s.tags.length>5&&e.jsxs("span",{className:"glass-px-2 glass-py-1 glass-text-xs glass-surface-subtle glass-text-secondary glass-radius",children:["+",s.tags.length-5," more"]})]})]}),e.jsxs("div",{className:"glass-text-sm glass-text-secondary glass-flex-shrink-0",children:["Score: ",s.score.toFixed(1)]})]})},s.id)),N.length===0&&(a.trim()||Object.keys(w).length>0)&&!U&&e.jsxs(V,{className:"glass-intelligent-search-panel glass-text-center glass-px-6 glass-py-12 glass-text-secondary glass-surface-subtle glass-contrast-guard",children:[e.jsx("div",{className:"glass-text-5xl glass-mb-4",children:"🔍"}),e.jsx("h3",{className:"glass-text-lg glass-font-medium glass-mb-2 glass-text-secondary",children:"No results found"}),e.jsx("p",{className:"glass-text-sm glass-break-words",children:"Try adjusting your search terms or filters, or try using more general keywords."})]})]})]})]})};try{$.displayName="GlassIntelligentSearch",$.__docgenInfo={description:"",displayName:"GlassIntelligentSearch",props:{data:{defaultValue:{value:"[]"},description:"",name:"data",required:!1,type:{name:"SearchResult[] | undefined"}},initialQuery:{defaultValue:{value:""},description:"",name:"initialQuery",required:!1,type:{name:"string | undefined"}},onSearch:{defaultValue:null,description:"",name:"onSearch",required:!1,type:{name:"((query: string, filters: SearchFilters) => void) | undefined"}},onResultClick:{defaultValue:null,description:"",name:"onResultClick",required:!1,type:{name:"((result: SearchResult) => void) | undefined"}},placeholder:{defaultValue:{value:"Search with natural language..."},description:"",name:"placeholder",required:!1,type:{name:"string | undefined"}},showFilters:{defaultValue:{value:"true"},description:"",name:"showFilters",required:!1,type:{name:"boolean | undefined"}},showSuggestions:{defaultValue:{value:"true"},description:"",name:"showSuggestions",required:!1,type:{name:"boolean | undefined"}},suggestionsInitiallyOpen:{defaultValue:{value:"false"},description:"",name:"suggestionsInitiallyOpen",required:!1,type:{name:"boolean | undefined"}},enableNLP:{defaultValue:{value:"true"},description:"",name:"enableNLP",required:!1,type:{name:"boolean | undefined"}},enableVoiceSearch:{defaultValue:{value:"false"},description:"",name:"enableVoiceSearch",required:!1,type:{name:"boolean | undefined"}},maxResults:{defaultValue:{value:"50"},description:"",name:"maxResults",required:!1,type:{name:"number | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const ke=({children:r})=>e.jsxs("div",{className:"glass-intelligent-search-story-frame",style:{width:"100%",height:"100vh",minHeight:0,boxSizing:"border-box",overflowX:"hidden",overflowY:"auto",padding:"clamp(16px, 3vw, 32px)",color:"#0f172a",background:"linear-gradient(135deg, #f8fafc 0%, #f3f5f7 48%, #e7ebef 100%)"},children:[e.jsx("div",{style:{width:"min(100%, 1120px)",margin:"0 auto"},children:r}),e.jsx("style",{children:`
      .glass-intelligent-search-story-frame,
      .glass-intelligent-search-story-frame * {
        box-sizing: border-box;
      }

      .glass-intelligent-search-story-frame .glass-intelligent-search-panel {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.22)), rgba(255, 255, 255, 0.28) !important;
        background-color: rgba(255, 255, 255, 0.28) !important;
      }

      .glass-intelligent-search-story-frame .glass-intelligent-search-dropdown {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.24)), rgba(255, 255, 255, 0.3) !important;
        background-color: rgba(255, 255, 255, 0.3) !important;
      }

      .glass-intelligent-search-story-frame .glass-intelligent-search input[type="text"] {
        background: rgba(255, 255, 255, 0.18) !important;
        background-color: rgba(255, 255, 255, 0.18) !important;
      }

      .glass-intelligent-search-story-frame .search-story-surface {
        display: grid;
        gap: 24px;
      }

      .glass-intelligent-search-story-frame .search-story-hero,
      .glass-intelligent-search-story-frame .search-story-callout {
        border: 1px solid rgba(15, 23, 42, 0.12);
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.28);
        box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
        backdrop-filter: blur(24px) saturate(1.8) brightness(1.05) contrast(1.05);
        -webkit-backdrop-filter: blur(24px) saturate(1.8) brightness(1.05) contrast(1.05);
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
    `})]}),Le={title:"Controls/Search/Glass Intelligent Search",component:$,decorators:[r=>e.jsx(ke,{children:e.jsx(r,{})})],parameters:{layout:"fullscreen",previewSurface:"app",docs:{description:{component:"Advanced search interface with NLP capabilities, smart filters, voice search, and intelligent suggestions - like Google or Elasticsearch with AI enhancement."}}}},L=[{id:"1",title:"Getting Started with React Hooks",description:"Learn how to use React Hooks to manage state and side effects in functional components. This comprehensive guide covers useState, useEffect, useContext, and custom hooks.",category:"Tutorial",tags:["react","hooks","javascript","frontend","web development"],score:0,metadata:{rating:4.8,author:"Jane Smith",date:"2024-01-15"}},{id:"2",title:"Advanced TypeScript Patterns",description:"Master advanced TypeScript concepts including generics, conditional types, mapped types, and utility types. Build type-safe applications with confidence.",category:"Documentation",tags:["typescript","patterns","advanced","types","programming"],score:0,metadata:{rating:4.6,author:"John Doe",date:"2024-02-20"}},{id:"3",title:"Building Responsive Design Systems",description:"Create scalable design systems with CSS-in-JS, design tokens, and component libraries. Learn best practices for responsive design and accessibility.",category:"Article",tags:["design system","css","responsive","accessibility","ui/ux"],score:0,metadata:{rating:4.9,author:"Alice Johnson",date:"2024-03-10"}},{id:"4",title:"Node.js Performance Optimization",description:"Optimize your Node.js applications for better performance. Learn about memory management, clustering, caching strategies, and monitoring tools.",category:"Guide",tags:["nodejs","performance","optimization","backend","javascript"],score:0,metadata:{rating:4.5,author:"Bob Wilson",date:"2024-01-25"}},{id:"5",title:"Introduction to Machine Learning",description:"Start your journey into machine learning with Python. Cover supervised and unsupervised learning, neural networks, and practical applications.",category:"Course",tags:["machine learning","python","ai","neural networks","data science"],score:0,metadata:{rating:4.7,author:"Dr. Sarah Chen",date:"2024-02-05"}},{id:"6",title:"GraphQL API Development",description:"Build efficient APIs with GraphQL. Learn about schemas, resolvers, subscriptions, and integration with React applications.",category:"Tutorial",tags:["graphql","api","react","backend","web development"],score:0,metadata:{rating:4.4,author:"Mike Rodriguez",date:"2024-03-01"}},{id:"7",title:"Docker Containerization Guide",description:"Containerize your applications with Docker. Learn about images, containers, Docker Compose, and deployment strategies.",category:"Guide",tags:["docker","containerization","deployment","devops","infrastructure"],score:0,metadata:{rating:4.6,author:"Emily Davis",date:"2024-01-30"}},{id:"8",title:"CSS Grid and Flexbox Mastery",description:"Master modern CSS layout techniques with Grid and Flexbox. Create complex layouts with ease and build responsive designs.",category:"Tutorial",tags:["css","grid","flexbox","layout","responsive design"],score:0,metadata:{rating:4.8,author:"Tom Anderson",date:"2024-02-15"}},{id:"9",title:"Vue.js 3 Composition API",description:"Explore Vue.js 3 and the Composition API. Learn about reactive state management, component composition, and modern Vue development.",category:"Documentation",tags:["vue","composition api","javascript","frontend","web development"],score:0,metadata:{rating:4.5,author:"Lisa Wong",date:"2024-03-05"}},{id:"10",title:"Database Design Principles",description:"Learn fundamental database design principles. Cover normalization, indexing, relationships, and performance optimization strategies.",category:"Guide",tags:["database","design","sql","normalization","performance"],score:0,metadata:{rating:4.7,author:"David Kim",date:"2024-01-20"}},{id:"11",title:"AWS Cloud Architecture",description:"Design scalable cloud architectures on AWS. Learn about EC2, S3, Lambda, RDS, and best practices for cloud-native applications.",category:"Course",tags:["aws","cloud","architecture","serverless","infrastructure"],score:0,metadata:{rating:4.9,author:"Jennifer Lee",date:"2024-02-28"}},{id:"12",title:"Testing Strategies for React Apps",description:"Comprehensive testing strategies for React applications. Cover unit testing, integration testing, and end-to-end testing with modern tools.",category:"Article",tags:["testing","react","jest","cypress","quality assurance"],score:0,metadata:{rating:4.6,author:"Chris Taylor",date:"2024-03-12"}}],z={args:{data:L,initialQuery:"design",suggestionsInitiallyOpen:!0,placeholder:"Search for tutorials, articles, and guides...",showFilters:!0,showSuggestions:!0,enableNLP:!1,enableVoiceSearch:!1,maxResults:10},parameters:{docs:{description:{story:'Basic search interface with text matching and filters. Try searching for "React", "TypeScript", or "CSS".'}}}},O={args:{data:L,placeholder:"Ask me anything in natural language...",showFilters:!0,showSuggestions:!0,enableNLP:!0,enableVoiceSearch:!0,maxResults:10},parameters:{docs:{description:{story:'Advanced search with NLP capabilities. Try queries like "find the best React tutorials", "show me guides about performance", or "compare frontend frameworks".'}}}},B={args:{data:L,placeholder:"Click the microphone to search with your voice...",showFilters:!1,showSuggestions:!0,enableNLP:!0,enableVoiceSearch:!0,maxResults:8},parameters:{docs:{description:{story:"Voice-enabled search with speech recognition. Click the microphone button and speak your search query."}}}},_={args:{data:L,placeholder:"Use filters to find content...",showFilters:!0,showSuggestions:!1,enableNLP:!1,enableVoiceSearch:!1,maxResults:15},parameters:{docs:{description:{story:"Focus on advanced filtering capabilities. Use the filter controls to narrow down results by category, tags, and rating."}}}},Q={render:()=>{const[r,n]=Y.useState(""),[m,c]=Y.useState("No result selected"),f=(l,d)=>{n(l)},g=l=>{c(l.title)};return e.jsxs("div",{className:"search-story-surface",children:[e.jsxs("section",{className:"search-story-hero",children:[e.jsxs("div",{children:[e.jsx("h1",{children:"Knowledge Search Workspace"}),e.jsx("p",{children:"Natural-language search, adaptive filters, suggestions, and result scoring are composed as a real documentation workspace."})]}),e.jsxs("div",{className:"search-story-metrics","aria-label":"Search demo metrics",children:[e.jsxs("div",{className:"search-story-metric",children:[e.jsx("strong",{children:L.length}),e.jsx("span",{children:"indexed records"})]}),e.jsxs("div",{className:"search-story-metric",children:[e.jsx("strong",{children:"3"}),e.jsx("span",{children:"filter dimensions"})]}),e.jsxs("div",{className:"search-story-metric",children:[e.jsx("strong",{children:r||"Ready"}),e.jsx("span",{children:"current query"})]}),e.jsxs("div",{className:"search-story-metric",children:[e.jsx("strong",{children:m}),e.jsx("span",{children:"selection state"})]})]})]}),e.jsx($,{data:L,onSearch:f,onResultClick:g,placeholder:"Try: 'find the best React tutorials' or 'show me guides about performance'",showFilters:!0,showSuggestions:!0,enableNLP:!0,enableVoiceSearch:!0,maxResults:12}),e.jsxs("section",{className:"search-story-callout",children:[e.jsx("h3",{children:"Recommended demo queries"}),e.jsx("p",{children:"These examples exercise scoring, suggestions, query analysis, and multi-select filter controls without depending on external services."}),e.jsxs("div",{className:"search-story-examples",children:[e.jsxs("div",{children:[e.jsx("h4",{children:"Natural language"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Find the best React tutorials"}),e.jsx("li",{children:"Show me guides about performance"}),e.jsx("li",{children:"Compare frontend frameworks"}),e.jsx("li",{children:"Help me learn machine learning"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{children:"Feature coverage"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Type to reveal suggestions and result highlighting"}),e.jsx("li",{children:"Filter by category, tags, and minimum rating"}),e.jsx("li",{children:"Inspect NLP intent and extracted keywords"}),e.jsx("li",{children:"Select a result to update the workspace state"})]})]})]})]})]})},parameters:{docs:{description:{story:"Complete showcase of the intelligent search system with all advanced features enabled."}}}},W={render:()=>{const r=["Tutorial","Article","Guide","Course","Documentation","Video","Podcast","Tool"],n=["React","Vue","Angular","Node.js","Python","TypeScript","JavaScript","Go","Rust","Java"],m=["Performance","Security","Testing","Design","Architecture","DevOps","Database","API","Frontend","Backend"],c=Array.from({length:100},(f,g)=>{const l=n[g%n.length],d=m[g%m.length],i=r[g%r.length],h=3+g*17%21/10,S=String(g%12+1).padStart(2,"0"),u=String(g%28+1).padStart(2,"0");return{id:`item-${g}`,title:`${d} in ${l} - ${i} #${g+1}`,description:`Learn about ${d.toLowerCase()} concepts in ${l}. This ${i.toLowerCase()} covers advanced techniques, best practices, and real-world applications for modern development.`,category:i,tags:[l.toLowerCase(),d.toLowerCase(),i.toLowerCase(),"programming","development"],score:0,metadata:{rating:Math.round(h*10)/10,author:`Author ${g+1}`,date:`2024-${S}-${u}`}}});return e.jsxs("div",{className:"glass-space-y-4",children:[e.jsxs("div",{className:"glass-surface-subtle glass-p-4 glass-radius-lg",children:[e.jsx("h3",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Performance Test Dataset"}),e.jsxs("p",{className:"glass-text-primary glass-text-sm",children:["This demo uses ",c.length," items to test search performance with larger datasets. Try searching for technology names, topics, or categories to see how the intelligent search handles scale."]})]}),e.jsx($,{data:c,placeholder:"Search through 100+ items with intelligent filtering...",showFilters:!0,showSuggestions:!0,enableNLP:!0,enableVoiceSearch:!0,maxResults:20})]})},parameters:{docs:{description:{story:"Performance test with a larger dataset of 100+ items to demonstrate search scalability and intelligent filtering."}}}},J={args:{data:L.slice(0,6),placeholder:"Custom styled search interface...",showFilters:!0,showSuggestions:!0,enableNLP:!0,enableVoiceSearch:!1,maxResults:6,className:"search-compact"},parameters:{docs:{description:{story:"Search interface with custom styling and layout constraints."}}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    data: sampleData,
    initialQuery: "design",
    suggestionsInitiallyOpen: true,
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
}`,...O.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
        story: "Voice-enabled search with speech recognition. Click the microphone button and speak your search query."
      }
    }
  }
}`,...B.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
        story: "Focus on advanced filtering capabilities. Use the filter controls to narrow down results by category, tags, and rating."
      }
    }
  }
}`,..._.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedTitle, setSelectedTitle] = React.useState("No result selected");
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
              Natural-language search, adaptive filters, suggestions, and result
              scoring are composed as a real documentation workspace.
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
              <strong>{searchQuery || "Ready"}</strong>
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
            These examples exercise scoring, suggestions, query analysis, and
            multi-select filter controls without depending on external services.
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
        story: "Complete showcase of the intelligent search system with all advanced features enabled."
      }
    }
  }
}`,...Q.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: () => {
    // Generate larger dataset for performance testing
    const categories = ["Tutorial", "Article", "Guide", "Course", "Documentation", "Video", "Podcast", "Tool"];
    const technologies = ["React", "Vue", "Angular", "Node.js", "Python", "TypeScript", "JavaScript", "Go", "Rust", "Java"];
    const topics = ["Performance", "Security", "Testing", "Design", "Architecture", "DevOps", "Database", "API", "Frontend", "Backend"];
    const largeDataset: SearchResult[] = Array.from({
      length: 100
    }, (_, i) => {
      const tech = technologies[i % technologies.length];
      const topic = topics[i % topics.length];
      const category = categories[i % categories.length];
      const rating = 3 + i * 17 % 21 / 10;
      const month = String(i % 12 + 1).padStart(2, "0");
      const day = String(i % 28 + 1).padStart(2, "0");
      return {
        id: \`item-\${i}\`,
        title: \`\${topic} in \${tech} - \${category} #\${i + 1}\`,
        description: \`Learn about \${topic.toLowerCase()} concepts in \${tech}. This \${category.toLowerCase()} covers advanced techniques, best practices, and real-world applications for modern development.\`,
        category,
        tags: [tech.toLowerCase(), topic.toLowerCase(), category.toLowerCase(), "programming", "development"],
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
          <h3 className="glass-font-semibold glass-text-primary glass-mb-2">
            Performance Test Dataset
          </h3>
          <p className="glass-text-primary glass-text-sm">
            This demo uses {largeDataset.length} items to test search
            performance with larger datasets. Try searching for technology
            names, topics, or categories to see how the intelligent search
            handles scale.
          </p>
        </div>

        <GlassIntelligentSearch data={largeDataset} placeholder="Search through 100+ items with intelligent filtering..." showFilters={true} showSuggestions={true} enableNLP={true} enableVoiceSearch={true} maxResults={20} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: "Performance test with a larger dataset of 100+ items to demonstrate search scalability and intelligent filtering."
      }
    }
  }
}`,...W.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
        story: "Search interface with custom styling and layout constraints."
      }
    }
  }
}`,...J.parameters?.docs?.source}}};const Te=["BasicSearch","IntelligentNLP","VoiceSearch","FiltersOnly","SearchShowcase","LargeDataset","CustomStyling"];export{z as BasicSearch,J as CustomStyling,_ as FiltersOnly,O as IntelligentNLP,W as LargeDataset,Q as SearchShowcase,B as VoiceSearch,Te as __namedExportsOrder,Le as default};
