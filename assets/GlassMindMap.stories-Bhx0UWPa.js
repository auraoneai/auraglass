import{r as l,j as t}from"./iframe-C4NFeGrN.js";import{O as A}from"./OptimizedGlassCore-pFwkcNDS.js";import{f as F}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-CcJXKEC9.js";import"./index-ByImX2pa.js";const I=({data:y,connections:k=[],editable:b=!1,showMinimap:W=!0,zoomable:E=!0,direction:S="horizontal",nodeSpacing:u=120,className:h="",onNodeClick:p,onNodeDoubleClick:d,onNodeChange:V,onNodeAdd:oe,onNodeDelete:re})=>{const[Z,H]=l.useState(null),[x,Y]=l.useState(null),[N,X]=l.useState(1),[w,U]=l.useState({x:0,y:0}),[M,G]=l.useState(!1),[z,R]=l.useState(null),[q,C]=l.useState(""),K=l.useRef(null),J=l.useRef(null),m=l.useRef(null),O=l.useCallback((e,s=0,g)=>{const i=[];let n=0,a=0;switch(S){case"horizontal":n=s*u,a=i.length*60-(e.children?.length||1)*30;break;case"vertical":n=i.length*60-(e.children?.length||1)*30,a=s*u;break;case"radial":const o=i.length/(e.children?.length||1)*Math.PI*2,r=s*u;n=Math.cos(o)*r,a=Math.sin(o)*r;break}const c={...e,position:e.position||{x:n,y:a},level:s,parentId:g};return i.push(c),e.children?.forEach(o=>{i.push(...O(o,s+1,e.id))}),i},[S,u]),f=O(y),Q=e=>{H(e.id),p?.(e)},ee=e=>{b&&(R(e.id),C(e.label)),d?.(e)},T=()=>{z&&q.trim()&&V?.(z,{label:q.trim()}),R(null),C("")},ne=()=>{R(null),C("")},ie=(e,s)=>{b&&(Y(s),m.current={x:e.clientX,y:e.clientY})},L=l.useCallback(e=>{if(!x||!m.current)return;const s=e.clientX-m.current.x,g=e.clientY-m.current.y,i=f.find(n=>n.id===x);i&&V?.(x,{position:{x:i.position.x+s,y:i.position.y+g}})},[x,f,V]),P=l.useCallback(()=>{Y(null),m.current=null},[]),ae=e=>{if(!E)return;e.preventDefault();const s=e.deltaY>0?.9:1.1,g=Math.max(.1,Math.min(3,N*s));X(g)},te=e=>{E&&(G(!0),m.current={x:e.clientX-w.x,y:e.clientY-w.y})},_=l.useCallback(e=>{!M||!m.current||U({x:e.clientX-m.current.x,y:e.clientY-m.current.y})},[M]),$=l.useCallback(()=>{G(!1),m.current=null},[]);l.useEffect(()=>(x&&(document.addEventListener("mousemove",L),document.addEventListener("mouseup",P)),M&&(document.addEventListener("mousemove",_),document.addEventListener("mouseup",$)),()=>{document.removeEventListener("mousemove",L),document.removeEventListener("mouseup",P),document.removeEventListener("mousemove",_),document.removeEventListener("mouseup",$)}),[x,M,L,P,_,$]);const se=()=>{const e=[],s=(i,n)=>{const a=k.find(r=>r.from===i.id&&r.to===n.id),c=a?.color||"var(--glass-white)40",o=a?.type==="dashed"?"5,5":a?.type==="dotted"?"2,2":"none";if(e.push(t.jsx("line",{x1:i.position.x+50,y1:i.position.y+25,x2:n.position.x+50,y2:n.position.y+25,stroke:c,strokeWidth:"2",strokeDasharray:o,markerEnd:"url(#arrowhead)"},`${i.id}-${n.id}`)),a?.label){const r=(i.position.x+n.position.x)/2+50,v=(i.position.y+n.position.y)/2+25;e.push(t.jsx("text",{x:r,y:v-5,textAnchor:"middle",className:"glass-text-xs glass-fill-white/70",children:a.label},`${i.id}-${n.id}-label`))}};k.forEach(i=>{const n=f.find(c=>c.id===i.from),a=f.find(c=>c.id===i.to);n&&a&&s(n,a)});const g=i=>{i.children?.forEach(n=>{const a=f.find(c=>c.id===n.id);a&&(s(i,a),g(a))})};return g(f[0]),e},le=()=>f.map(e=>{const s=Z===e.id,g=z===e.id,i=x===e.id,n=e.size==="lg"?100:e.size==="sm"?60:80,a=n*.5;let c;if(g)c=t.jsx("foreignObject",{x:e.position.x,y:e.position.y,width:n,height:a,children:t.jsx("input",{autoFocus:!0,value:q,onChange:o=>C(o.target.value),onKeyDown:o=>{o.key==="Enter"&&T(),o.key==="Escape"&&ne()},onBlur:T,className:"glass-w-full glass-h-full glass-px-2 glass-py-1 glass-bg-transparent glass-border glass-border-white/30 glass-radius-md glass-text-primary glass-text-sm glass-focus-outline-none focus:glass-border-white/60 glass-focus glass-touch-target glass-contrast-guard"})});else{let o;switch(e.shape){case"rectangle":o=t.jsx("rect",{x:e.position.x,y:e.position.y,width:n,height:a,rx:"8",fill:e.color||"var(--glass-white)20",stroke:s?"var(--glass-white)60":"var(--glass-white)30",strokeWidth:s?"2":"1"});break;case"diamond":const r=e.position.x+n/2,v=e.position.y+a/2;o=t.jsx("polygon",{points:`${r},${v-a/2} ${r+n/2},${v} ${r},${v+a/2} ${r-n/2},${v}`,fill:e.color||"var(--glass-white)20",stroke:s?"var(--glass-white)60":"var(--glass-white)30",strokeWidth:s?"2":"1"});break;default:o=t.jsx("circle",{cx:e.position.x+n/2,cy:e.position.y+a/2,r:Math.min(n,a)/2,fill:e.color||"var(--glass-white)20",stroke:s?"var(--glass-white)60":"var(--glass-white)30",strokeWidth:s?"2":"1"})}c=t.jsxs("g",{className:`cursor-pointer glass-focus glass-touch-target glass-contrast-guard ${i?"cursor-grabbing":"cursor-grab"}`,onMouseDown:r=>ie(r,e.id),onClick:r=>Q(e),onDoubleClick:()=>ee(e),children:[o,t.jsxs("text",{x:e.position.x+n/2,y:e.position.y+a/2+4,textAnchor:"middle",className:"glass-text-sm glass-fill-white glass-font-medium glass-pointer-events-none glass-select-none",children:[e.icon&&t.jsx("tspan",{x:e.position.x+n/2-15,children:e.icon}),t.jsx("tspan",{x:e.icon?e.position.x+n/2+15:e.position.x+n/2,children:e.label})]})]})}return t.jsx("g",{children:c},e.id)});return t.jsxs(A,{"data-glass-component":!0,className:`glass-mind-map relative overflow-auto ${h}`,intensity:"medium",elevation:"level1",style:{width:"min(920px, calc(100vw - 48px))",height:"min(560px, calc(100vh - 64px))",maxWidth:"100%",boxSizing:"border-box"},children:[t.jsxs("div",{className:"glass-absolute glass-top-4 glass-left-4 glass-z-10 glass-flex glass-gap-2",children:[t.jsx(A,{className:"glass-px-3 glass-py-1 glass-radius-md glass-text-sm glass-cursor-pointer hover:glass-surface-subtle/10 glass-focus glass-touch-target glass-contrast-guard",intensity:"subtle",onClick:e=>X(1),children:"Reset Zoom"}),t.jsxs(A,{className:"glass-px-3 glass-py-1 glass-radius-md glass-text-sm",intensity:"subtle",children:["Zoom: ",(N*100).toFixed(0),"%"]})]}),W&&t.jsx("div",{className:"glass-absolute glass-bottom-4 glass-right-4 glass-z-10 glass-w-32 glass-h-24 glass-surface-dark/20 glass-radius-md glass-border glass-border-white/20",children:t.jsx("svg",{className:"glass-w-full glass-h-full",viewBox:"0 0 320 240",children:f.map(e=>t.jsx("circle",{cx:(e.position.x+160)/3,cy:(e.position.y+120)/3,r:"2",fill:"var(--glass-white)60"},`mini-${e.id}`))})}),t.jsx("div",{ref:J,className:"glass-overflow-auto",onWheel:ae,onMouseDown:te,style:{width:920,height:560,minWidth:920,minHeight:560,cursor:M?"grabbing":"grab"},children:t.jsxs("svg",{ref:K,className:"glass-w-full glass-h-full",viewBox:"-120 -120 920 560",style:{transform:`scale(${N}) translate(${w.x/N}px, ${w.y/N}px)`,transformOrigin:"center",overflow:"visible"},children:[t.jsx("defs",{children:t.jsx("marker",{id:"arrowhead",markerWidth:"10",markerHeight:"7",refX:"9",refY:"3.5",orient:"auto",children:t.jsx("polygon",{points:"0 0, 10 3.5, 0 7",fill:"var(--glass-white)40"})})}),se(),le()]})})]})},B=y=>{const[k,b]=l.useState(y);return{data:k,addNode:(u,h)=>{const p=d=>d.id===u?{...d,children:[...d.children||[],h]}:{...d,children:d.children?.map(p)};b(p)},updateNode:(u,h)=>{const p=d=>d.id===u?{...d,...h}:{...d,children:d.children?.map(p)};b(p)},deleteNode:u=>{const h=p=>({...p,children:p.children?.filter(d=>d.id!==u).map(h)});b(h)},setData:b}};try{I.displayName="GlassMindMap",I.__docgenInfo={description:"",displayName:"GlassMindMap",props:{data:{defaultValue:null,description:"Root node of the mind map",name:"data",required:!0,type:{name:"MindMapNode"}},connections:{defaultValue:{value:"[]"},description:"Custom connections between nodes",name:"connections",required:!1,type:{name:"MindMapConnection[] | undefined"}},editable:{defaultValue:{value:"false"},description:"Whether nodes are editable",name:"editable",required:!1,type:{name:"boolean | undefined"}},showMinimap:{defaultValue:{value:"true"},description:"Whether to show mini-map",name:"showMinimap",required:!1,type:{name:"boolean | undefined"}},zoomable:{defaultValue:{value:"true"},description:"Whether to enable zoom and pan",name:"zoomable",required:!1,type:{name:"boolean | undefined"}},direction:{defaultValue:{value:"horizontal"},description:"Layout direction",name:"direction",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"horizontal"'},{value:'"vertical"'},{value:'"radial"'}]}},nodeSpacing:{defaultValue:{value:"120"},description:"Node spacing",name:"nodeSpacing",required:!1,type:{name:"number | undefined"}},className:{defaultValue:{value:""},description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}},onNodeClick:{defaultValue:null,description:"Node click handler",name:"onNodeClick",required:!1,type:{name:"((node: MindMapNode) => void) | undefined"}},onNodeDoubleClick:{defaultValue:null,description:"Node double-click handler",name:"onNodeDoubleClick",required:!1,type:{name:"((node: MindMapNode) => void) | undefined"}},onNodeChange:{defaultValue:null,description:"Node change handler (for editing)",name:"onNodeChange",required:!1,type:{name:"((nodeId: string, changes: Partial<MindMapNode>) => void) | undefined"}},onNodeAdd:{defaultValue:null,description:"Node add handler",name:"onNodeAdd",required:!1,type:{name:"((parentId: string, newNode: MindMapNode) => void) | undefined"}},onNodeDelete:{defaultValue:null,description:"Node delete handler",name:"onNodeDelete",required:!1,type:{name:"((nodeId: string) => void) | undefined"}}}}}catch{}try{B.displayName="useMindMap",B.__docgenInfo={description:"",displayName:"useMindMap",props:{id:{defaultValue:null,description:"",name:"id",required:!0,type:{name:"string"}},label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string"}},color:{defaultValue:null,description:"",name:"color",required:!1,type:{name:"string | undefined"}},position:{defaultValue:null,description:"",name:"position",required:!1,type:{name:"{ x: number; y: number; } | undefined"}},size:{defaultValue:null,description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},shape:{defaultValue:null,description:"",name:"shape",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"circle"'},{value:'"rectangle"'},{value:'"diamond"'}]}},icon:{defaultValue:null,description:"",name:"icon",required:!1,type:{name:"ReactNode"}},data:{defaultValue:null,description:"",name:"data",required:!1,type:{name:"unknown"}}}}}catch{}const he={title:"Workflows/Glass Mind Map",component:I,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassmindmap component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"},editable:{control:"boolean",description:"Enable node editing"},direction:{control:{type:"select"},options:["horizontal","vertical","radial"],description:"Layout direction"},showMinimap:{control:"boolean",description:"Show mini-map"},zoomable:{control:"boolean",description:"Enable zoom and pan"}},args:{className:"",editable:!1,direction:"horizontal",showMinimap:!0,zoomable:!0}},j={args:{data:{id:"root",label:"Project Planning",children:[{id:"research",label:"Research",children:[{id:"market",label:"Market Analysis"},{id:"competitors",label:"Competitor Research"}]},{id:"development",label:"Development",children:[{id:"frontend",label:"Frontend"},{id:"backend",label:"Backend"},{id:"testing",label:"Testing"}]},{id:"deployment",label:"Deployment",children:[{id:"staging",label:"Staging"},{id:"production",label:"Production"}]}]},onNodeClick:F()}},D={args:{data:{id:"root",label:"AI Development",children:[{id:"ml",label:"Machine Learning",children:[{id:"supervised",label:"Supervised Learning",children:[{id:"classification",label:"Classification"},{id:"regression",label:"Regression"}]},{id:"unsupervised",label:"Unsupervised Learning",children:[{id:"clustering",label:"Clustering"},{id:"dimensionality",label:"Dimensionality Reduction"}]}]},{id:"nlp",label:"Natural Language Processing",children:[{id:"sentiment",label:"Sentiment Analysis"},{id:"translation",label:"Machine Translation"},{id:"generation",label:"Text Generation"}]},{id:"vision",label:"Computer Vision",children:[{id:"detection",label:"Object Detection"},{id:"recognition",label:"Image Recognition"},{id:"segmentation",label:"Image Segmentation"}]}]},direction:"radial",onNodeClick:F()}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}};const fe=["Default","ComplexMindMap"];export{D as ComplexMindMap,j as Default,fe as __namedExportsOrder,he as default};
