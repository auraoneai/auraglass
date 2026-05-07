import{r as l,j as s}from"./iframe-C1j_9pGm.js";import{O as A}from"./OptimizedGlassCore-fs4nsz79.js";import{f as B}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-BHvtgRvM.js";import"./index-ByImX2pa.js";const I=({data:x,connections:k=[],editable:b=!1,showMinimap:W=!0,zoomable:E=!0,direction:S="horizontal",nodeSpacing:u=120,className:h="",onNodeClick:p,onNodeDoubleClick:d,onNodeChange:V,onNodeAdd:oe,onNodeDelete:re})=>{const[Z,U]=l.useState(null),[y,Y]=l.useState(null),[N,X]=l.useState(1),[w,H]=l.useState({x:0,y:0}),[M,G]=l.useState(!1),[R,q]=l.useState(null),[z,C]=l.useState(""),K=l.useRef(null),J=l.useRef(null),m=l.useRef(null),O=l.useCallback((e,t=0,g)=>{const a=[];let n=0,i=0;switch(S){case"horizontal":n=t*u,i=a.length*60-(e.children?.length||1)*30;break;case"vertical":n=a.length*60-(e.children?.length||1)*30,i=t*u;break;case"radial":const o=a.length/(e.children?.length||1)*Math.PI*2,r=t*u;n=Math.cos(o)*r,i=Math.sin(o)*r;break}const c={...e,position:e.position||{x:n,y:i},level:t,parentId:g};return a.push(c),e.children?.forEach(o=>{a.push(...O(o,t+1,e.id))}),a},[S,u]),f=O(x),Q=e=>{U(e.id),p?.(e)},ee=e=>{b&&(q(e.id),C(e.label)),d?.(e)},T=()=>{R&&z.trim()&&V?.(R,{label:z.trim()}),q(null),C("")},ne=()=>{q(null),C("")},ae=(e,t)=>{b&&(Y(t),m.current={x:e.clientX,y:e.clientY})},L=l.useCallback(e=>{if(!y||!m.current)return;const t=e.clientX-m.current.x,g=e.clientY-m.current.y,a=f.find(n=>n.id===y);a&&V?.(y,{position:{x:a.position.x+t,y:a.position.y+g}})},[y,f,V]),P=l.useCallback(()=>{Y(null),m.current=null},[]),ie=e=>{if(!E)return;e.preventDefault();const t=e.deltaY>0?.9:1.1,g=Math.max(.1,Math.min(3,N*t));X(g)},se=e=>{E&&(G(!0),m.current={x:e.clientX-w.x,y:e.clientY-w.y})},_=l.useCallback(e=>{!M||!m.current||H({x:e.clientX-m.current.x,y:e.clientY-m.current.y})},[M]),$=l.useCallback(()=>{G(!1),m.current=null},[]);l.useEffect(()=>(y&&(document.addEventListener("mousemove",L),document.addEventListener("mouseup",P)),M&&(document.addEventListener("mousemove",_),document.addEventListener("mouseup",$)),()=>{document.removeEventListener("mousemove",L),document.removeEventListener("mouseup",P),document.removeEventListener("mousemove",_),document.removeEventListener("mouseup",$)}),[y,M,L,P,_,$]);const te=()=>{const e=[],t=(a,n)=>{const i=k.find(r=>r.from===a.id&&r.to===n.id),c=i?.color||"var(--glass-white)40",o=i?.type==="dashed"?"5,5":i?.type==="dotted"?"2,2":"none";if(e.push(s.jsx("line",{x1:a.position.x+50,y1:a.position.y+25,x2:n.position.x+50,y2:n.position.y+25,stroke:c,strokeWidth:"2",strokeDasharray:o,markerEnd:"url(#arrowhead)"},`${a.id}-${n.id}`)),i?.label){const r=(a.position.x+n.position.x)/2+50,v=(a.position.y+n.position.y)/2+25;e.push(s.jsx("text",{x:r,y:v-5,textAnchor:"middle",className:"glass-text-xs glass-fill-white/70",children:i.label},`${a.id}-${n.id}-label`))}};k.forEach(a=>{const n=f.find(c=>c.id===a.from),i=f.find(c=>c.id===a.to);n&&i&&t(n,i)});const g=a=>{a.children?.forEach(n=>{const i=f.find(c=>c.id===n.id);i&&(t(a,i),g(i))})};return g(f[0]),e},le=()=>f.map(e=>{const t=Z===e.id,g=R===e.id,a=y===e.id,n=e.size==="lg"?100:e.size==="sm"?60:80,i=n*.5;let c;if(g)c=s.jsx("foreignObject",{x:e.position.x,y:e.position.y,width:n,height:i,children:s.jsx("input",{autoFocus:!0,value:z,onChange:o=>C(o.target.value),onKeyDown:o=>{o.key==="Enter"&&T(),o.key==="Escape"&&ne()},onBlur:T,className:"glass-w-full glass-h-full glass-px-2 glass-py-1 glass-bg-transparent glass-border glass-border-white/30 glass-radius-md glass-text-primary glass-text-sm glass-focus-outline-none focus:glass-border-white/60 glass-focus glass-touch-target glass-contrast-guard"})});else{let o;switch(e.shape){case"rectangle":o=s.jsx("rect",{x:e.position.x,y:e.position.y,width:n,height:i,rx:"8",fill:e.color||"var(--glass-white)20",stroke:t?"var(--glass-white)60":"var(--glass-white)30",strokeWidth:t?"2":"1"});break;case"diamond":const r=e.position.x+n/2,v=e.position.y+i/2;o=s.jsx("polygon",{points:`${r},${v-i/2} ${r+n/2},${v} ${r},${v+i/2} ${r-n/2},${v}`,fill:e.color||"var(--glass-white)20",stroke:t?"var(--glass-white)60":"var(--glass-white)30",strokeWidth:t?"2":"1"});break;default:o=s.jsx("circle",{cx:e.position.x+n/2,cy:e.position.y+i/2,r:Math.min(n,i)/2,fill:e.color||"var(--glass-white)20",stroke:t?"var(--glass-white)60":"var(--glass-white)30",strokeWidth:t?"2":"1"})}c=s.jsxs("g",{className:`cursor-pointer glass-focus glass-touch-target glass-contrast-guard ${a?"cursor-grabbing":"cursor-grab"}`,onMouseDown:r=>ae(r,e.id),onClick:r=>Q(e),onDoubleClick:()=>ee(e),children:[o,s.jsxs("text",{x:e.position.x+n/2,y:e.position.y+i/2+4,textAnchor:"middle",className:"glass-text-sm glass-fill-white glass-font-medium glass-pointer-events-none glass-select-none",children:[e.icon&&s.jsx("tspan",{x:e.position.x+n/2-15,children:e.icon}),s.jsx("tspan",{x:e.icon?e.position.x+n/2+15:e.position.x+n/2,children:e.label})]})]})}return s.jsx("g",{children:c},e.id)});return s.jsxs(A,{"data-glass-component":!0,className:`relative overflow-hidden ${h}`,intensity:"medium",elevation:"level1",children:[s.jsxs("div",{className:"glass-absolute glass-top-4 glass-left-4 glass-z-10 glass-flex glass-gap-2",children:[s.jsx(A,{className:"glass-px-3 glass-py-1 glass-radius-md glass-text-sm glass-cursor-pointer hover:glass-surface-subtle/10 glass-focus glass-touch-target glass-contrast-guard",intensity:"subtle",onClick:e=>X(1),children:"Reset Zoom"}),s.jsxs(A,{className:"glass-px-3 glass-py-1 glass-radius-md glass-text-sm",intensity:"subtle",children:["Zoom: ",(N*100).toFixed(0),"%"]})]}),W&&s.jsx("div",{className:"glass-absolute glass-bottom-4 glass-right-4 glass-z-10 glass-w-32 glass-h-24 glass-surface-dark/20 glass-radius-md glass-border glass-border-white/20",children:s.jsx("svg",{className:"glass-w-full glass-h-full",viewBox:"0 0 320 240",children:f.map(e=>s.jsx("circle",{cx:(e.position.x+160)/3,cy:(e.position.y+120)/3,r:"2",fill:"var(--glass-white)60"},`mini-${e.id}`))})}),s.jsx("div",{ref:J,className:"glass-w-full glass-h-full glass-overflow-hidden",onWheel:ie,onMouseDown:se,style:{cursor:M?"grabbing":"grab"},children:s.jsxs("svg",{ref:K,className:"glass-w-full glass-h-full",style:{transform:`scale(${N}) translate(${w.x/N}px, ${w.y/N}px)`,transformOrigin:"center"},children:[s.jsx("defs",{children:s.jsx("marker",{id:"arrowhead",markerWidth:"10",markerHeight:"7",refX:"9",refY:"3.5",orient:"auto",children:s.jsx("polygon",{points:"0 0, 10 3.5, 0 7",fill:"var(--glass-white)40"})})}),te(),le()]})})]})},F=x=>{const[k,b]=l.useState(x);return{data:k,addNode:(u,h)=>{const p=d=>d.id===u?{...d,children:[...d.children||[],h]}:{...d,children:d.children?.map(p)};b(p)},updateNode:(u,h)=>{const p=d=>d.id===u?{...d,...h}:{...d,children:d.children?.map(p)};b(p)},deleteNode:u=>{const h=p=>({...p,children:p.children?.filter(d=>d.id!==u).map(h)});b(h)},setData:b}};try{I.displayName="GlassMindMap",I.__docgenInfo={description:"",displayName:"GlassMindMap",props:{data:{defaultValue:null,description:"Root node of the mind map",name:"data",required:!0,type:{name:"MindMapNode"}},connections:{defaultValue:{value:"[]"},description:"Custom connections between nodes",name:"connections",required:!1,type:{name:"MindMapConnection[] | undefined"}},editable:{defaultValue:{value:"false"},description:"Whether nodes are editable",name:"editable",required:!1,type:{name:"boolean | undefined"}},showMinimap:{defaultValue:{value:"true"},description:"Whether to show mini-map",name:"showMinimap",required:!1,type:{name:"boolean | undefined"}},zoomable:{defaultValue:{value:"true"},description:"Whether to enable zoom and pan",name:"zoomable",required:!1,type:{name:"boolean | undefined"}},direction:{defaultValue:{value:"horizontal"},description:"Layout direction",name:"direction",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"horizontal"'},{value:'"vertical"'},{value:'"radial"'}]}},nodeSpacing:{defaultValue:{value:"120"},description:"Node spacing",name:"nodeSpacing",required:!1,type:{name:"number | undefined"}},className:{defaultValue:{value:""},description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}},onNodeClick:{defaultValue:null,description:"Node click handler",name:"onNodeClick",required:!1,type:{name:"((node: MindMapNode) => void) | undefined"}},onNodeDoubleClick:{defaultValue:null,description:"Node double-click handler",name:"onNodeDoubleClick",required:!1,type:{name:"((node: MindMapNode) => void) | undefined"}},onNodeChange:{defaultValue:null,description:"Node change handler (for editing)",name:"onNodeChange",required:!1,type:{name:"((nodeId: string, changes: Partial<MindMapNode>) => void) | undefined"}},onNodeAdd:{defaultValue:null,description:"Node add handler",name:"onNodeAdd",required:!1,type:{name:"((parentId: string, newNode: MindMapNode) => void) | undefined"}},onNodeDelete:{defaultValue:null,description:"Node delete handler",name:"onNodeDelete",required:!1,type:{name:"((nodeId: string) => void) | undefined"}}}}}catch{}try{F.displayName="useMindMap",F.__docgenInfo={description:"",displayName:"useMindMap",props:{id:{defaultValue:null,description:"",name:"id",required:!0,type:{name:"string"}},label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string"}},color:{defaultValue:null,description:"",name:"color",required:!1,type:{name:"string | undefined"}},position:{defaultValue:null,description:"",name:"position",required:!1,type:{name:"{ x: number; y: number; } | undefined"}},size:{defaultValue:null,description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},shape:{defaultValue:null,description:"",name:"shape",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"circle"'},{value:'"rectangle"'},{value:'"diamond"'}]}},icon:{defaultValue:null,description:"",name:"icon",required:!1,type:{name:"ReactNode"}},data:{defaultValue:null,description:"",name:"data",required:!1,type:{name:"unknown"}}}}}catch{}const he={title:"Workflows/Glass Mind Map",component:I,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassmindmap component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"},editable:{control:"boolean",description:"Enable node editing"},direction:{control:{type:"select"},options:["horizontal","vertical","radial"],description:"Layout direction"},showMinimap:{control:"boolean",description:"Show mini-map"},zoomable:{control:"boolean",description:"Enable zoom and pan"}},args:{className:"",editable:!1,direction:"horizontal",showMinimap:!0,zoomable:!0}},j={args:{data:{id:"root",label:"Project Planning",children:[{id:"research",label:"Research",children:[{id:"market",label:"Market Analysis"},{id:"competitors",label:"Competitor Research"}]},{id:"development",label:"Development",children:[{id:"frontend",label:"Frontend"},{id:"backend",label:"Backend"},{id:"testing",label:"Testing"}]},{id:"deployment",label:"Deployment",children:[{id:"staging",label:"Staging"},{id:"production",label:"Production"}]}]},onNodeClick:B()}},D={args:{data:{id:"root",label:"AI Development",children:[{id:"ml",label:"Machine Learning",children:[{id:"supervised",label:"Supervised Learning",children:[{id:"classification",label:"Classification"},{id:"regression",label:"Regression"}]},{id:"unsupervised",label:"Unsupervised Learning",children:[{id:"clustering",label:"Clustering"},{id:"dimensionality",label:"Dimensionality Reduction"}]}]},{id:"nlp",label:"Natural Language Processing",children:[{id:"sentiment",label:"Sentiment Analysis"},{id:"translation",label:"Machine Translation"},{id:"generation",label:"Text Generation"}]},{id:"vision",label:"Computer Vision",children:[{id:"detection",label:"Object Detection"},{id:"recognition",label:"Image Recognition"},{id:"segmentation",label:"Image Segmentation"}]}]},direction:"radial",onNodeClick:B()}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
