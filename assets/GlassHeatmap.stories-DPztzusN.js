import{r,h as ye,j as a,c as h,C as g,d as Ce}from"./iframe-mbNquNNc.js";import{u as je}from"./MotionPreferenceContext-BfJvNZar.js";import{O as q}from"./OptimizedGlassCore-CPvpl-y1.js";import{M as ae}from"./MotionFramer-BekP4wEp.js";import"./preload-helper-PPVm8Dsz.js";import"./utilsCore-CTDrFk4s.js";const w=r.forwardRef(({data:C=[],xAxis:p,yAxis:f,colorScale:G={min:"var(--glass-color-primary)",max:"var(--glass-color-danger)"},cellSize:c=20,cellGap:k=1,showValues:E=!1,showGrid:L=!0,showTooltips:H=!0,selectable:T=!1,selectedCells:W=[],onSelectionChange:Z,onCellClick:z,onCellHover:O,renderCell:Y,renderTooltip:F,zoomable:I=!1,zoomLevel:se=1,onZoomChange:X,showLegend:R=!0,legendPosition:x="right",animated:S=!0,animationDuration:we=Ce.DURATION.slow,respectMotionPreference:K=!0,className:le,...te},re)=>{const v=Array.isArray(C)?C:[],b=Array.isArray(W)?W:[],{prefersReducedMotion:P}=je(),ne=ye("glass-heatmap"),[y,oe]=r.useState(null),[U,ie]=r.useState({x:0,y:0}),[d,de]=r.useState(se),J=r.useRef(null),ue=r.useRef(null),u=r.useMemo(()=>{let e=[],s=1/0,l=-1/0;if(!Array.isArray(v)||v.length===0)return{cells:[],minValue:0,maxValue:0,range:1};const t=v[0];if(Array.isArray(t)?v.forEach((o,V)=>{(Array.isArray(o)?o:[]).forEach((j,D)=>{s=Math.min(s,j),l=Math.max(l,j),e.push({row:V,col:D,value:j,normalizedValue:0})})}):v.forEach(o=>{typeof o?.value=="number"&&(s=Math.min(s,o.value),l=Math.max(l,o.value),e.push({row:o.y??0,col:o.x??0,value:o.value,normalizedValue:0,label:o.label,metadata:o.metadata}))}),e.length===0)return{cells:[],minValue:0,maxValue:0,range:1};const n=l-s||1;return e=e.map(i=>({...i,normalizedValue:(i.value-s)/n})),{cells:e,minValue:s,maxValue:l,range:n}},[v]),ce=u.cells.length>0,m=r.useMemo(()=>{if(!u.cells.length)return{rows:0,cols:0};const e=Math.max(...u.cells.map(l=>l.row))+1,s=Math.max(...u.cells.map(l=>l.col))+1;return{rows:e,cols:s}},[u.cells]),N=r.useCallback(e=>{const{min:s,mid:l,max:t,steps:n=100}=G;return l?e<=.5?$(s,l,e*2):$(l,t,(e-.5)*2):$(s,t,e)},[G]),$=r.useCallback((e,s,l)=>{const t=e.replace("#",""),n=s.replace("#",""),i=parseInt(t.substr(0,2),16),o=parseInt(t.substr(2,2),16),V=parseInt(t.substr(4,2),16),j=parseInt(n.substr(0,2),16),D=parseInt(n.substr(2,2),16),xe=parseInt(n.substr(4,2),16),he=Math.round(i+l*(j-i)),ve=Math.round(o+l*(D-o)),be=Math.round(V+l*(xe-V));return`#${he.toString(16).padStart(2,"0")}${ve.toString(16).padStart(2,"0")}${be.toString(16).padStart(2,"0")}`},[]),Q=r.useCallback((e,s)=>{if(T){const l={row:e.row,col:e.col},t=b.some(i=>i.row===e.row&&i.col===e.col);let n;s.ctrlKey||s.metaKey?n=t?b.filter(i=>!(i.row===e.row&&i.col===e.col)):[...b,l]:n=t?[]:[l],Z?.(n)}z?.(e)},[T,b,Z,z]),B=r.useCallback((e,s)=>{if(oe(e),O?.(e),e&&s&&H){const l=J.current?.getBoundingClientRect();l&&ie({x:s.clientX-l.left,y:s.clientY-l.top})}},[O,H]),_=r.useCallback((e,s)=>{if(!I)return;s?.preventDefault();const l=Math.max(.5,Math.min(3,d+e));de(l),X?.(l)},[I,d,X]),ee=r.useCallback((e,s)=>b.some(l=>l.row===e&&l.col===s),[b]),me=r.useCallback(e=>{const s=ee(e.row,e.col),l=y?.row===e.row&&y?.col===e.col,t=N(e.normalizedValue);return a.jsx(q,{elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",className:h("glass-heatmap-cell flex items-center justify-center glass-text-xs font-medium transition-all","cursor-pointer hover:scale-110 hover:z-10",s&&"ring-2 ring-primary ring-offset-1",l&&"shadow-lg scale-110 z-20",L&&"border border-border/20"),style:{backgroundColor:t,color:e.normalizedValue>.5?"var(--glass-white)":"var(--glass-black)",width:c*d,height:c*d,fontSize:`${Math.max(8,c*d*.4)}px`},onClick:n=>Q(e,n),onMouseEnter:n=>B(e,n),onMouseLeave:()=>B(null),children:E&&a.jsx("span",{className:"glass-select-none",children:typeof e.value=="number"?e.value.toFixed(1):e.value})})},[ee,y,N,c,d,L,E,Q,B]),ge=r.useCallback(e=>a.jsx(q,{elevation:"level3",intensity:"strong",depth:3,tint:"neutral",border:"strong",className:"glass-heatmap-tooltip glass-p-3 glass-radius-lg glass-shadow-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard",children:a.jsx("div",{className:"glass-text-sm glass-gap-1",children:a.jsxs(g,{children:[a.jsx("div",{className:"glass-font-semibold",children:e.label||`Cell (${e.col}, ${e.row})`}),a.jsxs("div",{children:["Value: ",e.value]}),p?.labels?.[e.col]&&a.jsxs("div",{children:["X: ",p.labels[e.col]]}),f?.labels?.[e.row]&&a.jsxs("div",{children:["Y: ",f.labels[e.row]]}),e.metadata&&Object.entries(e.metadata).map(([s,l])=>a.jsxs("div",{children:[s,": ",String(l)]},s))]})})}),[p,f]),pe=r.useCallback(()=>{if(!R)return null;const e=20,s=x==="top"||x==="bottom";return a.jsxs(q,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:h("glass-heatmap-legend glass-p-3 glass-radius-lg glass-backdrop-blur-md border border-border/20",s?"flex items-center glass-gap-3":"flex flex-col glass-gap-3"),children:[a.jsx(g,{children:a.jsx("div",{className:"glass-text-sm glass-font-medium glass-text-primary",children:"Legend"})}),a.jsxs("div",{className:h("flex",s?"flex-row items-center glass-gap-1":"flex-col glass-gap-1"),children:[a.jsx(g,{children:a.jsx("div",{className:"glass-text-xs glass-text-secondary",children:u.minValue.toFixed(1)})}),a.jsx("div",{className:h("flex",s?"flex-row":"flex-col"),children:Array.from({length:e},(l,t)=>a.jsx("div",{className:h("flex-1",s?"w-3 h-6":"w-6 h-3"),style:{backgroundColor:N(t/(e-1))}},t))}),a.jsx(g,{children:a.jsx("div",{className:"glass-text-xs glass-text-secondary",children:u.maxValue.toFixed(1)})})]})]})},[R,x,u,N]),fe=r.useMemo(()=>{const e=Array(m.rows).fill(null).map(()=>Array(m.cols).fill(null));return u.cells.forEach(s=>{s.row<m.rows&&s.col<m.cols&&(e[s.row][s.col]=s)}),e},[u.cells,m]);return a.jsx(q,{ref:re,id:ne,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",className:h("glass-heatmap glass-radius-lg glass-backdrop-blur-md border border-border/20 overflow-hidden",le),...te,children:a.jsxs(ae,{preset:!P&&K&&S?"fadeIn":"none",className:"glass-relative",children:[a.jsxs("div",{ref:J,className:h("flex",x==="left"&&"flex-row-reverse",x==="right"&&"flex-row",x==="top"&&"flex-col-reverse",x==="bottom"&&"flex-col"),children:[R&&a.jsx("div",{className:"glass-flex-shrink-0 glass-p-4",children:pe()}),a.jsx("div",{className:"glass-flex-1 glass-p-6 glass-overflow-auto",children:ce?a.jsxs("div",{className:"glass-flex",children:[f&&a.jsxs("div",{className:"glass-flex glass-flex-col glass-justify-between glass-mr-2",children:[f.title&&a.jsx(g,{children:a.jsx("div",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2 glass-writing-mode-vertical-lr glass-transform glass-rotate-180",children:f.title})}),a.jsx("div",{className:"glass-flex glass-flex-col glass-justify-between glass-h-full",children:f.labels?.map((e,s)=>a.jsx("div",{className:"glass-text-xs glass-text-secondary glass-text-right glass-pr-2",children:a.jsx(g,{children:e})},s))})]}),a.jsxs("div",{ref:ue,className:"glass-relative",onWheel:e=>_(e.deltaY>0?-.1:.1,e),children:[p&&a.jsxs("div",{className:"glass-mb-2",children:[p.title&&a.jsx("div",{className:"glass-text-sm glass-font-medium glass-text-primary glass-text-center glass-mb-2",children:p.title}),a.jsx("div",{className:"glass-flex glass-justify-between",style:{width:(c*d+k)*m.cols-k},children:p.labels?.map((e,s)=>a.jsx("div",{className:"glass-text-xs glass-text-secondary glass-text-center",children:a.jsx(g,{children:e})},s))})]}),a.jsx("div",{className:"glass-grid glass-gap-px",style:{gridTemplateColumns:`repeat(${m.cols}, ${c*d}px)`,gridTemplateRows:`repeat(${m.rows}, ${c*d}px)`,gap:`${k}px`},children:fe.map((e,s)=>e.map((l,t)=>a.jsx(ae,{preset:!P&&K&&S?"scaleIn":"none",delay:S?(s*m.cols+t)*10:0,children:l?Y?Y(l):me(l):a.jsx("div",{className:"glass-surface-overlay glass-border glass-border-dashed glass-border-glass-border/30",style:{width:c*d,height:c*d}})},`${s}-${t}`)))})]})]}):a.jsx(g,{children:a.jsx("div",{className:"glass-text-sm glass-text-secondary glass-text-center glass-p-10",children:"No heatmap data available."})})})]}),H&&y&&a.jsx("div",{className:"glass-absolute glass-pointer-events-none glass-z-50",style:{left:U.x+10,top:U.y-10,transform:"translateY(-100%)"},children:F?F(y):ge(y)}),I&&a.jsxs("div",{className:"glass-absolute glass-top-4 glass-right-4 glass-flex glass-flex-col glass-gap-1",children:[a.jsx("button",{onClick:()=>_(.1),className:"glass-w-8 glass-h-8 glass-flex glass-items-center glass-justify-center glass-radius-md glass-text-sm glass-font-bold glass-transition-all glass-hover-scale-105 glass-focus glass-touch-target glass-contrast-guard",children:"+"}),a.jsx("button",{onClick:()=>_(-.1),className:"glass-w-8 glass-h-8 glass-flex glass-items-center glass-justify-center glass-radius-md glass-text-sm glass-font-bold glass-transition-all glass-hover-scale-105 glass-focus glass-touch-target glass-contrast-guard",children:"−"})]})]})})});w.displayName="GlassHeatmap";try{w.displayName="GlassHeatmap",w.__docgenInfo={description:"",displayName:"GlassHeatmap",props:{data:{defaultValue:{value:"[]"},description:"Heatmap data",name:"data",required:!1,type:{name:"HeatmapDataPoint[] | number[][]"}},xAxis:{defaultValue:null,description:"X-axis configuration",name:"xAxis",required:!1,type:{name:"HeatmapAxis | undefined"}},yAxis:{defaultValue:null,description:"Y-axis configuration",name:"yAxis",required:!1,type:{name:"HeatmapAxis | undefined"}},colorScale:{defaultValue:{value:`{
        min: "var(--glass-color-primary)",
        max: "var(--glass-color-danger)",
      }`},description:"Color scale configuration",name:"colorScale",required:!1,type:{name:"HeatmapColorScale | undefined"}},cellSize:{defaultValue:{value:"20"},description:"Cell size in pixels",name:"cellSize",required:!1,type:{name:"number | undefined"}},cellGap:{defaultValue:{value:"1"},description:"Gap between cells",name:"cellGap",required:!1,type:{name:"number | undefined"}},showValues:{defaultValue:{value:"false"},description:"Whether to show cell values",name:"showValues",required:!1,type:{name:"boolean | undefined"}},showGrid:{defaultValue:{value:"true"},description:"Whether to show grid lines",name:"showGrid",required:!1,type:{name:"boolean | undefined"}},showTooltips:{defaultValue:{value:"true"},description:"Whether to show tooltips",name:"showTooltips",required:!1,type:{name:"boolean | undefined"}},selectable:{defaultValue:{value:"false"},description:"Whether to enable cell selection",name:"selectable",required:!1,type:{name:"boolean | undefined"}},selectedCells:{defaultValue:{value:"[]"},description:"Selected cells",name:"selectedCells",required:!1,type:{name:"{ row: number; col: number; }[] | undefined"}},onSelectionChange:{defaultValue:null,description:"Selection change handler",name:"onSelectionChange",required:!1,type:{name:"((cells: { row: number; col: number; }[]) => void) | undefined"}},onCellClick:{defaultValue:null,description:"Cell click handler",name:"onCellClick",required:!1,type:{name:"((cell: HeatmapCell) => void) | undefined"}},onCellHover:{defaultValue:null,description:"Cell hover handler",name:"onCellHover",required:!1,type:{name:"((cell: HeatmapCell | null) => void) | undefined"}},renderCell:{defaultValue:null,description:"Custom cell renderer",name:"renderCell",required:!1,type:{name:"((cell: HeatmapCell) => ReactNode) | undefined"}},renderTooltip:{defaultValue:null,description:"Custom tooltip renderer",name:"renderTooltip",required:!1,type:{name:"((cell: HeatmapCell) => ReactNode) | undefined"}},zoomable:{defaultValue:{value:"false"},description:"Whether to enable zoom",name:"zoomable",required:!1,type:{name:"boolean | undefined"}},zoomLevel:{defaultValue:{value:"1"},description:"Zoom level",name:"zoomLevel",required:!1,type:{name:"number | undefined"}},onZoomChange:{defaultValue:null,description:"Zoom change handler",name:"onZoomChange",required:!1,type:{name:"((level: number) => void) | undefined"}},showLegend:{defaultValue:{value:"true"},description:"Whether to show legend",name:"showLegend",required:!1,type:{name:"boolean | undefined"}},legendPosition:{defaultValue:{value:"right"},description:"Legend position",name:"legendPosition",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"left"'},{value:'"right"'},{value:'"top"'},{value:'"bottom"'}]}},animated:{defaultValue:{value:"true"},description:"Whether to enable animation",name:"animated",required:!1,type:{name:"boolean | undefined"}},animationDuration:{defaultValue:{value:"500"},description:"Animation duration in milliseconds",name:"animationDuration",required:!1,type:{name:"number | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Respect motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const He={title:"Components/Data-display/GlassHeatmap",component:w,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassheatmap component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},M={args:{data:[{x:0,y:0,value:1,label:"A1"},{x:1,y:0,value:2,label:"A2"},{x:2,y:0,value:3,label:"A3"},{x:0,y:1,value:4,label:"B1"},{x:1,y:1,value:5,label:"B2"},{x:2,y:1,value:6,label:"B3"},{x:0,y:2,value:7,label:"C1"},{x:1,y:2,value:8,label:"C2"},{x:2,y:2,value:9,label:"C3"}]}},A={render:C=>a.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:a.jsx(w,{...C})}),args:{data:[{x:0,y:0,value:1,label:"A1"},{x:1,y:0,value:2,label:"A2"},{x:0,y:1,value:3,label:"B1"},{x:1,y:1,value:4,label:"B2"}]}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    data: [{
      x: 0,
      y: 0,
      value: 1,
      label: 'A1'
    }, {
      x: 1,
      y: 0,
      value: 2,
      label: 'A2'
    }, {
      x: 2,
      y: 0,
      value: 3,
      label: 'A3'
    }, {
      x: 0,
      y: 1,
      value: 4,
      label: 'B1'
    }, {
      x: 1,
      y: 1,
      value: 5,
      label: 'B2'
    }, {
      x: 2,
      y: 1,
      value: 6,
      label: 'B3'
    }, {
      x: 0,
      y: 2,
      value: 7,
      label: 'C1'
    }, {
      x: 1,
      y: 2,
      value: 8,
      label: 'C2'
    }, {
      x: 2,
      y: 2,
      value: 9,
      label: 'C3'
    }]
  }
}`,...M.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassHeatmap {...args} />
    </div>,
  args: {
    data: [{
      x: 0,
      y: 0,
      value: 1,
      label: 'A1'
    }, {
      x: 1,
      y: 0,
      value: 2,
      label: 'A2'
    }, {
      x: 0,
      y: 1,
      value: 3,
      label: 'B1'
    }, {
      x: 1,
      y: 1,
      value: 4,
      label: 'B2'
    }]
  }
}`,...A.parameters?.docs?.source}}};const Ie=["Default","Variants"];export{M as Default,A as Variants,Ie as __namedExportsOrder,He as default};
