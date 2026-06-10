import{r as o,j as s,c as K}from"./iframe-CYOgkXcw.js";import{O as G}from"./OptimizedGlassCore-BKU-VEbW.js";import{f as Q}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-sc2QmrsH.js";import"./index-ByImX2pa.js";const O=({data:k,connections:j=[],editable:y=!1,showMinimap:T=!1,zoomable:$=!0,direction:S="horizontal",nodeSpacing:b=120,className:x="",onNodeClick:g,onNodeDoubleClick:r,onNodeChange:L,onNodeAdd:he,onNodeDelete:fe})=>{const[ee,ne]=o.useState(null),[v,B]=o.useState(null),[w,F]=o.useState(1),[D,ae]=o.useState({x:0,y:0}),[C,Z]=o.useState(!1),[P,_]=o.useState(null),[A,E]=o.useState(""),ie=o.useRef(null),se=o.useRef(null),h=o.useRef(null),d=o.useCallback(e=>{const l=[],c=Math.max(b,150),t=88,n={x:80,y:180},a=(i,m,p,u,f,M)=>{const U=(p-(u-1)/2)*t;let N=i.position;if(!N)if(S==="vertical")N={x:M.x+U,y:n.y+m*c};else if(S==="radial"&&m>0){const V=p/u*Math.PI*2,R=c*m;N={x:n.x+Math.cos(V)*R,y:n.y+Math.sin(V)*R}}else N={x:n.x+m*c,y:M.y+U};const ge={...i,position:N,level:m,parentId:f};l.push(ge),i.children?.forEach((V,R)=>{a(V,m+1,R,i.children?.length||1,i.id,N)})};return a(e,0,0,1,void 0,n),l},[S,b])(k),te=o.useMemo(()=>{if(d.length===0)return"-40 0 760 320";const e=Math.min(...d.map(i=>i.position.x)),l=Math.min(...d.map(i=>i.position.y)),c=Math.max(...d.map(i=>i.position.x+140)),t=Math.max(...d.map(i=>i.position.y+80)),n=Math.max(360,c-e+160),a=Math.max(240,t-l+140);return`${e-80} ${l-70} ${n} ${a}`},[d]),le=e=>{ne(e.id),g?.(e)},oe=e=>{y&&(_(e.id),E(e.label)),r?.(e)},H=()=>{P&&A.trim()&&L?.(P,{label:A.trim()}),_(null),E("")},re=()=>{_(null),E("")},de=(e,l)=>{y&&(B(l),h.current={x:e.clientX,y:e.clientY})},W=o.useCallback(e=>{if(!v||!h.current)return;const l=e.clientX-h.current.x,c=e.clientY-h.current.y,t=d.find(n=>n.id===v);t&&L?.(v,{position:{x:t.position.x+l,y:t.position.y+c}})},[v,d,L]),I=o.useCallback(()=>{B(null),h.current=null},[]),ce=e=>{if(!$)return;e.preventDefault();const l=e.deltaY>0?.9:1.1,c=Math.max(.1,Math.min(3,w*l));F(c)},ue=e=>{$&&(Z(!0),h.current={x:e.clientX-D.x,y:e.clientY-D.y})},Y=o.useCallback(e=>{!C||!h.current||ae({x:e.clientX-h.current.x,y:e.clientY-h.current.y})},[C]),X=o.useCallback(()=>{Z(!1),h.current=null},[]);o.useEffect(()=>(v&&(document.addEventListener("mousemove",W),document.addEventListener("mouseup",I)),C&&(document.addEventListener("mousemove",Y),document.addEventListener("mouseup",X)),()=>{document.removeEventListener("mousemove",W),document.removeEventListener("mouseup",I),document.removeEventListener("mousemove",Y),document.removeEventListener("mouseup",X)}),[v,C,W,I,Y,X]);const me=()=>{const e=[],l=(t,n)=>{const a=j.find(p=>p.from===t.id&&p.to===n.id),i=a?.color||"rgba(255, 255, 255, 0.28)",m=a?.type==="dashed"?"5,5":a?.type==="dotted"?"2,2":"none";if(e.push(s.jsx("line",{x1:t.position.x+50,y1:t.position.y+25,x2:n.position.x+50,y2:n.position.y+25,stroke:i,strokeWidth:"2",strokeDasharray:m,markerEnd:"url(#arrowhead)"},`${t.id}-${n.id}`)),a?.label){const p=(t.position.x+n.position.x)/2+50,u=(t.position.y+n.position.y)/2+25;e.push(s.jsx("text",{x:p,y:u-5,textAnchor:"middle",className:"glass-text-xs glass-fill-white/70",children:a.label},`${t.id}-${n.id}-label`))}};j.forEach(t=>{const n=d.find(i=>i.id===t.from),a=d.find(i=>i.id===t.to);n&&a&&l(n,a)});const c=t=>{t.children?.forEach(n=>{const a=d.find(i=>i.id===n.id);a&&(l(t,a),c(a))})};return c(d[0]),e},pe=()=>d.map(e=>{const l=ee===e.id,c=P===e.id,t=v===e.id,n=e.size==="lg"?92:e.size==="sm"?58:74,a=n*.5,i=e.color||"rgba(14, 25, 46, 0.86)",m=l?"rgba(109, 211, 255, 0.72)":"rgba(255, 255, 255, 0.22)";let p;if(c)p=s.jsx("foreignObject",{x:e.position.x,y:e.position.y,width:n,height:a,children:s.jsx("input",{autoFocus:!0,value:A,onChange:u=>E(u.target.value),onKeyDown:u=>{u.key==="Enter"&&H(),u.key==="Escape"&&re()},onBlur:H,className:"glass-w-full glass-h-full glass-px-2 glass-py-1 glass-bg-transparent glass-border glass-border-white/30 glass-radius-md glass-text-primary glass-text-sm glass-focus-outline-none focus:glass-border-white/60 glass-focus glass-touch-target glass-contrast-guard"})});else{let u;switch(e.shape){case"rectangle":u=s.jsx("rect",{x:e.position.x,y:e.position.y,width:n,height:a,rx:"8",fill:i,stroke:m,strokeWidth:l?"2":"1"});break;case"diamond":const f=e.position.x+n/2,M=e.position.y+a/2;u=s.jsx("polygon",{points:`${f},${M-a/2} ${f+n/2},${M} ${f},${M+a/2} ${f-n/2},${M}`,fill:i,stroke:m,strokeWidth:l?"2":"1"});break;default:u=s.jsx("circle",{cx:e.position.x+n/2,cy:e.position.y+a/2,r:Math.min(n,a)/2,fill:i,stroke:m,strokeWidth:l?"2":"1"})}p=s.jsxs("g",{className:K("glass-cursor-pointer glass-focus glass-touch-target glass-contrast-guard",t?"glass-cursor-grabbing":"glass-cursor-grab"),onMouseDown:f=>de(f,e.id),onClick:f=>le(e),onDoubleClick:()=>oe(e),children:[u,s.jsxs("text",{x:e.position.x+n/2,y:e.position.y+a/2+4,textAnchor:"middle",className:"glass-text-sm glass-fill-white glass-font-medium glass-pointer-events-none glass-select-none",fill:"rgba(255, 255, 255, 0.94)",children:[e.icon&&s.jsx("tspan",{x:e.position.x+n/2-15,children:e.icon}),s.jsx("tspan",{x:e.icon?e.position.x+n/2+15:e.position.x+n/2,children:e.label})]})]})}return s.jsx("g",{children:p},e.id)});return s.jsxs(G,{"data-glass-component":!0,className:K("glass-mind-map glass-relative glass-overflow-hidden glass-max-w-full glass-surface-dark/30 glass-border glass-border-white/10",x),intensity:"subtle",elevation:"level1",style:{width:"100%",height:"clamp(200px, 32vw, 300px)",maxWidth:"100%",boxSizing:"border-box",background:"var(--glass-primary-level3-surface)"},children:[s.jsxs("div",{className:"glass-absolute glass-top-2 glass-left-2 glass-z-10 glass-flex glass-gap-2",children:[s.jsx(G,{className:"glass-px-2 glass-py-1 glass-radius-md glass-text-xs glass-cursor-pointer glass-surface-dark/40 hover:glass-surface-subtle/10 glass-focus glass-touch-target glass-contrast-guard",intensity:"subtle",onClick:e=>F(1),children:"Reset Zoom"}),s.jsxs(G,{className:"glass-px-2 glass-py-1 glass-radius-md glass-text-xs glass-surface-dark/40",intensity:"subtle",children:["Zoom: ",(w*100).toFixed(0),"%"]})]}),T&&s.jsx("div",{className:"glass-absolute glass-bottom-4 glass-right-4 glass-z-10 glass-w-32 glass-h-24 glass-surface-dark/20 glass-radius-md glass-border glass-border-white/20",children:s.jsx("svg",{className:"glass-w-full glass-h-full",viewBox:"0 0 320 240",children:d.map(e=>s.jsx("circle",{cx:(e.position.x+160)/3,cy:(e.position.y+120)/3,r:"2",fill:"rgba(255, 255, 255, 0.48)"},`mini-${e.id}`))})}),s.jsx("div",{ref:se,className:"glass-overflow-auto",onWheel:ce,onMouseDown:ue,style:{width:"100%",height:"100%",minWidth:0,minHeight:0,cursor:C?"grabbing":"grab",background:"var(--glass-neutral-level2-surface)"},children:s.jsxs("svg",{ref:ie,className:"glass-w-full glass-h-full",viewBox:te,preserveAspectRatio:"xMidYMid meet",style:{transform:`scale(${w}) translate(${D.x/w}px, ${D.y/w}px)`,transformOrigin:"center",overflow:"visible"},children:[s.jsx("defs",{children:s.jsx("marker",{id:"arrowhead",markerWidth:"10",markerHeight:"7",refX:"9",refY:"3.5",orient:"auto",children:s.jsx("polygon",{points:"0 0, 10 3.5, 0 7",fill:"rgba(255, 255, 255, 0.32)"})})}),me(),pe()]})})]})},J=k=>{const[j,y]=o.useState(k);return{data:j,addNode:(b,x)=>{const g=r=>r.id===b?{...r,children:[...r.children||[],x]}:{...r,children:r.children?.map(g)};y(g)},updateNode:(b,x)=>{const g=r=>r.id===b?{...r,...x}:{...r,children:r.children?.map(g)};y(g)},deleteNode:b=>{const x=g=>({...g,children:g.children?.filter(r=>r.id!==b).map(x)});y(x)},setData:y}};try{O.displayName="GlassMindMap",O.__docgenInfo={description:"",displayName:"GlassMindMap",props:{data:{defaultValue:null,description:"Root node of the mind map",name:"data",required:!0,type:{name:"MindMapNode"}},connections:{defaultValue:{value:"[]"},description:"Custom connections between nodes",name:"connections",required:!1,type:{name:"MindMapConnection[] | undefined"}},editable:{defaultValue:{value:"false"},description:"Whether nodes are editable",name:"editable",required:!1,type:{name:"boolean | undefined"}},showMinimap:{defaultValue:{value:"false"},description:"Whether to show mini-map",name:"showMinimap",required:!1,type:{name:"boolean | undefined"}},zoomable:{defaultValue:{value:"true"},description:"Whether to enable zoom and pan",name:"zoomable",required:!1,type:{name:"boolean | undefined"}},direction:{defaultValue:{value:"horizontal"},description:"Layout direction",name:"direction",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"horizontal"'},{value:'"vertical"'},{value:'"radial"'}]}},nodeSpacing:{defaultValue:{value:"120"},description:"Node spacing",name:"nodeSpacing",required:!1,type:{name:"number | undefined"}},className:{defaultValue:{value:""},description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}},onNodeClick:{defaultValue:null,description:"Node click handler",name:"onNodeClick",required:!1,type:{name:"((node: MindMapNode) => void) | undefined"}},onNodeDoubleClick:{defaultValue:null,description:"Node double-click handler",name:"onNodeDoubleClick",required:!1,type:{name:"((node: MindMapNode) => void) | undefined"}},onNodeChange:{defaultValue:null,description:"Node change handler (for editing)",name:"onNodeChange",required:!1,type:{name:"((nodeId: string, changes: Partial<MindMapNode>) => void) | undefined"}},onNodeAdd:{defaultValue:null,description:"Node add handler",name:"onNodeAdd",required:!1,type:{name:"((parentId: string, newNode: MindMapNode) => void) | undefined"}},onNodeDelete:{defaultValue:null,description:"Node delete handler",name:"onNodeDelete",required:!1,type:{name:"((nodeId: string) => void) | undefined"}}}}}catch{}try{J.displayName="useMindMap",J.__docgenInfo={description:"",displayName:"useMindMap",props:{id:{defaultValue:null,description:"",name:"id",required:!0,type:{name:"string"}},label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string"}},color:{defaultValue:null,description:"",name:"color",required:!1,type:{name:"string | undefined"}},position:{defaultValue:null,description:"",name:"position",required:!1,type:{name:"{ x: number; y: number; } | undefined"}},size:{defaultValue:null,description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},shape:{defaultValue:null,description:"",name:"shape",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"circle"'},{value:'"rectangle"'},{value:'"diamond"'}]}},icon:{defaultValue:null,description:"",name:"icon",required:!1,type:{name:"ReactNode"}},data:{defaultValue:null,description:"",name:"data",required:!1,type:{name:"unknown"}}}}}catch{}const we={title:"Workflows/Glass Mind Map",component:O,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassmindmap component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"},editable:{control:"boolean",description:"Enable node editing"},direction:{control:{type:"select"},options:["horizontal","vertical","radial"],description:"Layout direction"},showMinimap:{control:"boolean",description:"Show mini-map"},zoomable:{control:"boolean",description:"Enable zoom and pan"}},args:{className:"",editable:!1,direction:"horizontal",showMinimap:!0,zoomable:!0}},q={args:{data:{id:"root",label:"Project Planning",children:[{id:"research",label:"Research",children:[{id:"market",label:"Market Analysis"},{id:"competitors",label:"Competitor Research"}]},{id:"development",label:"Development",children:[{id:"frontend",label:"Frontend"},{id:"backend",label:"Backend"},{id:"testing",label:"Testing"}]},{id:"deployment",label:"Deployment",children:[{id:"staging",label:"Staging"},{id:"production",label:"Production"}]}]},onNodeClick:Q()}},z={args:{data:{id:"root",label:"AI Development",children:[{id:"ml",label:"Machine Learning",children:[{id:"supervised",label:"Supervised Learning",children:[{id:"classification",label:"Classification"},{id:"regression",label:"Regression"}]},{id:"unsupervised",label:"Unsupervised Learning",children:[{id:"clustering",label:"Clustering"},{id:"dimensionality",label:"Dimensionality Reduction"}]}]},{id:"nlp",label:"Natural Language Processing",children:[{id:"sentiment",label:"Sentiment Analysis"},{id:"translation",label:"Machine Translation"},{id:"generation",label:"Text Generation"}]},{id:"vision",label:"Computer Vision",children:[{id:"detection",label:"Object Detection"},{id:"recognition",label:"Image Recognition"},{id:"segmentation",label:"Image Segmentation"}]}]},direction:"radial",onNodeClick:Q()}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    data: {
      id: 'root',
      label: 'Project Planning',
      children: [{
        id: 'research',
        label: 'Research',
        children: [{
          id: 'market',
          label: 'Market Analysis'
        }, {
          id: 'competitors',
          label: 'Competitor Research'
        }]
      }, {
        id: 'development',
        label: 'Development',
        children: [{
          id: 'frontend',
          label: 'Frontend'
        }, {
          id: 'backend',
          label: 'Backend'
        }, {
          id: 'testing',
          label: 'Testing'
        }]
      }, {
        id: 'deployment',
        label: 'Deployment',
        children: [{
          id: 'staging',
          label: 'Staging'
        }, {
          id: 'production',
          label: 'Production'
        }]
      }]
    },
    onNodeClick: fn()
  }
}`,...q.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    data: {
      id: 'root',
      label: 'AI Development',
      children: [{
        id: 'ml',
        label: 'Machine Learning',
        children: [{
          id: 'supervised',
          label: 'Supervised Learning',
          children: [{
            id: 'classification',
            label: 'Classification'
          }, {
            id: 'regression',
            label: 'Regression'
          }]
        }, {
          id: 'unsupervised',
          label: 'Unsupervised Learning',
          children: [{
            id: 'clustering',
            label: 'Clustering'
          }, {
            id: 'dimensionality',
            label: 'Dimensionality Reduction'
          }]
        }]
      }, {
        id: 'nlp',
        label: 'Natural Language Processing',
        children: [{
          id: 'sentiment',
          label: 'Sentiment Analysis'
        }, {
          id: 'translation',
          label: 'Machine Translation'
        }, {
          id: 'generation',
          label: 'Text Generation'
        }]
      }, {
        id: 'vision',
        label: 'Computer Vision',
        children: [{
          id: 'detection',
          label: 'Object Detection'
        }, {
          id: 'recognition',
          label: 'Image Recognition'
        }, {
          id: 'segmentation',
          label: 'Image Segmentation'
        }]
      }]
    },
    direction: 'radial',
    onNodeClick: fn()
  }
}`,...z.parameters?.docs?.source}}};const Ce=["Default","ComplexMindMap"];export{z as ComplexMindMap,q as Default,Ce as __namedExportsOrder,we as default};
