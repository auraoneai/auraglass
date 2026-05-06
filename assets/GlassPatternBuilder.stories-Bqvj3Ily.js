import{r as l,h as We,j as t,c as j}from"./iframe-DBVOVM-c.js";import{u as $e}from"./MotionPreferenceContext-DuNK6mTA.js";import{u as Ge}from"./soundDesign-CFDh3vcV.js";import{O as D}from"./OptimizedGlassCore-CyIux4a_.js";import{M as Te}from"./MotionFramer-DLgCJzPg.js";import"./preload-helper-PPVm8Dsz.js";import"./utilsCore-B0Pwu3YL.js";const V=l.forwardRef(({width:d=800,height:i=600,layers:H=[],activeLayerIndex:le=0,selectedElements:ne=[],showGrid:U=!0,gridSize:m=20,snapToGrid:Z=!1,zoom:ie=1,templates:ce=[],colorPalette:f=["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD","#F8C471"],showRulers:J=!0,backgroundColor:k="var(--glass-white)",exportFormat:X="png",onChange:P,onLayerChange:w,onElementSelect:R,onTemplateApply:Y,onExport:E,showControls:de=!0,showLayerPanel:K=!0,showProperties:qe=!0,respectMotionPreference:ue=!0,className:ge,...pe},he)=>{const{prefersReducedMotion:Q,isMotionSafe:me}=$e(),{play:u}=Ge(),C=l.useRef(null),ye=We("glass-pattern-builder"),[c,b]=l.useState(H.length>0?H:[{name:"Layer 1",elements:[],visible:!0,locked:!1,opacity:1,blendMode:"normal",id:"layer-1"}]),[g,S]=l.useState(le),[ee,se]=l.useState(ne),[z,fe]=l.useState("circle"),[_,be]=l.useState(f[0]),[B,ae]=l.useState(!1),[F,re]=l.useState(null),[p,ve]=l.useState(ie),[y,Ie]=l.useState({x:0,y:0}),[v,xe]=l.useState([c]),[h,O]=l.useState(0),we=[...[{name:"Geometric Grid",category:"Abstract",preview:"grid-preview",id:"template-grid",layers:[{name:"Grid Layer",id:"grid-layer",visible:!0,locked:!1,opacity:1,blendMode:"normal",elements:Array.from({length:25},(s,e)=>({type:"square",x:e%5*100+50,y:Math.floor(e/5)*100+50,width:60,height:60,rotation:0,color:f[e%f.length],opacity:.8,strokeColor:"var(--glass-black)",strokeWidth:2,id:`grid-${e}`,properties:{}}))}]},{name:"Concentric Circles",category:"Organic",preview:"circles-preview",id:"template-circles",layers:[{name:"Circles Layer",id:"circles-layer",visible:!0,locked:!1,opacity:1,blendMode:"normal",elements:Array.from({length:8},(s,e)=>({type:"circle",x:d/2,y:i/2,width:(e+1)*40,height:(e+1)*40,rotation:0,color:"transparent",opacity:.6,strokeColor:f[e%f.length],strokeWidth:3,id:`circle-${e}`,properties:{}}))}]},{name:"Mandala",category:"Decorative",preview:"mandala-preview",id:"template-mandala",layers:[{name:"Mandala Layer",id:"mandala-layer",visible:!0,locked:!1,opacity:1,blendMode:"normal",elements:Array.from({length:12},(s,e)=>({type:"circle",x:d/2+Math.cos(e*Math.PI/6)*100,y:i/2+Math.sin(e*Math.PI/6)*100,width:40,height:40,rotation:0,color:f[e%3],opacity:.7,strokeColor:"var(--glass-black)",strokeWidth:1,id:`mandala-${e}`,properties:{}}))}]}],...ce],M=l.useCallback(s=>{const e=C.current;if(!e)return{x:0,y:0};const r=e.getBoundingClientRect(),o=(s.clientX-r.left-y.x)/p,a=(s.clientY-r.top-y.y)/p;return Z?{x:Math.round(o/m)*m,y:Math.round(a/m)*m}:{x:o,y:a}},[y,p,Z,m]),te=l.useCallback((s,e)=>({type:z,x:s,y:e,width:50,height:50,rotation:0,color:_,opacity:1,strokeColor:"var(--glass-black)",strokeWidth:2,id:`element-${Date.now()}-${Math.random()}`,properties:{}}),[z,_]),Fe=l.useCallback(s=>{const e=M(s),r=c[g]?.elements.find(o=>e.x>=o.x-o.width/2&&e.x<=o.x+o.width/2&&e.y>=o.y-o.height/2&&e.y<=o.y+o.height/2);r?(se([r.id]),R?.([r.id])):(ae(!0),re(e),se([]),R?.([])),u("tap")},[M,c,g,R,u]),Ce=l.useCallback(s=>{},[B,F]),ke=l.useCallback(s=>{if(!B||!F)return;M(s);const e=te(F.x,F.y),r=[...c];r[g]&&(r[g]={...r[g],elements:[...r[g].elements,e]},b(r),x(r),P?.(r),w?.(r,g)),ae(!1),re(null),u("success")},[B,F,M,te,c,g,P,w,u]),x=l.useCallback(s=>{const e=v.slice(0,h+1);e.push([...s]),e.length>50?e.shift():O(h+1),xe(e)},[v,h]),Pe=l.useCallback(()=>{h>0&&(O(h-1),b(v[h-1]),u("tap"))},[h,v,u]),Ee=l.useCallback(()=>{h<v.length-1&&(O(h+1),b(v[h+1]),u("tap"))},[h,v,u]),Se=l.useCallback(()=>{const s={name:`Layer ${c.length+1}`,elements:[],visible:!0,locked:!1,opacity:1,blendMode:"normal",id:`layer-${Date.now()}`},e=[...c,s];b(e),S(e.length-1),x(e),w?.(e,e.length-1),u("success")},[c,x,w,u]),Be=l.useCallback(s=>{if(c.length<=1)return;const e=c.filter((r,o)=>o!==s);b(e),S(Math.min(g,e.length-1)),x(e),w?.(e,Math.min(g,e.length-1)),u("error")},[c,g,x,w,u]),Me=l.useCallback(s=>{b(s.layers),S(0),x(s.layers),Y?.(s),P?.(s.layers),u("success")},[x,Y,P,u]),je=l.useCallback(()=>{const s=C.current;if(s){switch(X){case"png":const e=s.toDataURL("image/png");E?.(e,"png");break;case"svg":const r=De(c,d,i);E?.(r,"svg");break;case"json":const o=JSON.stringify({layers:c,width:d,height:i},null,2);E?.(o,"json");break}u("success")}},[c,d,i,X,E,u]),De=l.useCallback((s,e,r)=>{let o=`<svg width="${e}" height="${r}" xmlns="http://www.w3.org/2000/svg">`;return o+=`<rect width="100%" height="100%" fill="${k}"/>`,s.forEach(a=>{a.visible&&(o+=`<g opacity="${a.opacity}">`,a.elements.forEach(n=>{switch(n.type){case"circle":o+=`<circle cx="${n.x}" cy="${n.y}" r="${n.width/2}" 
                      fill="${n.color}" stroke="${n.strokeColor}" stroke-width="${n.strokeWidth}" 
                      opacity="${n.opacity}" transform="rotate(${n.rotation} ${n.x} ${n.y})"/>`;break;case"square":o+=`<rect x="${n.x-n.width/2}" y="${n.y-n.height/2}" 
                      width="${n.width}" height="${n.height}" 
                      fill="${n.color}" stroke="${n.strokeColor}" stroke-width="${n.strokeWidth}" 
                      opacity="${n.opacity}" transform="rotate(${n.rotation} ${n.x} ${n.y})"/>`;break}}),o+="</g>")}),o+="</svg>",o},[k]),oe=l.useCallback(()=>{const s=C.current;if(!s)return;const e=s.getContext("2d");if(e){if(e.fillStyle=k,e.fillRect(0,0,d,i),e.save(),e.translate(y.x,y.y),e.scale(p,p),U){e.strokeStyle="rgba(var(--glass-color-black) / var(--glass-opacity-10))",e.lineWidth=1/p;for(let r=0;r<=d;r+=m)e.beginPath(),e.moveTo(r,0),e.lineTo(r,i),e.stroke();for(let r=0;r<=i;r+=m)e.beginPath(),e.moveTo(0,r),e.lineTo(d,r),e.stroke()}if(c.forEach((r,o)=>{r.visible&&(e.save(),e.globalAlpha=r.opacity,r.elements.forEach(a=>{switch(e.save(),e.translate(a.x,a.y),e.rotate(a.rotation*Math.PI/180),e.globalAlpha=a.opacity,a.type){case"circle":e.fillStyle=a.color,e.strokeStyle=a.strokeColor,e.lineWidth=a.strokeWidth,e.beginPath(),e.arc(0,0,a.width/2,0,Math.PI*2),a.color!=="transparent"&&e.fill(),a.strokeWidth>0&&e.stroke();break;case"square":e.fillStyle=a.color,e.strokeStyle=a.strokeColor,e.lineWidth=a.strokeWidth,a.color!=="transparent"&&e.fillRect(-a.width/2,-a.height/2,a.width,a.height),a.strokeWidth>0&&e.strokeRect(-a.width/2,-a.height/2,a.width,a.height);break;case"triangle":e.fillStyle=a.color,e.strokeStyle=a.strokeColor,e.lineWidth=a.strokeWidth,e.beginPath(),e.moveTo(0,-a.height/2),e.lineTo(-a.width/2,a.height/2),e.lineTo(a.width/2,a.height/2),e.closePath(),a.color!=="transparent"&&e.fill(),a.strokeWidth>0&&e.stroke();break;case"line":e.strokeStyle=a.strokeColor||a.color,e.lineWidth=a.strokeWidth,e.beginPath(),e.moveTo(-a.width/2,0),e.lineTo(a.width/2,0),e.stroke();break}ee.includes(a.id)&&(e.strokeStyle="var(--glass-color-primary)",e.lineWidth=2/p,e.setLineDash([5/p,5/p]),e.strokeRect(-a.width/2-5,-a.height/2-5,a.width+10,a.height+10),e.setLineDash([])),e.restore()}),e.restore())}),e.restore(),J){e.fillStyle="rgba(var(--glass-color-black) / var(--glass-opacity-10))",e.fillRect(0,0,d,20),e.fillRect(0,0,20,i),e.fillStyle="#333",e.font="10px monospace",e.textAlign="center";for(let r=0;r<d;r+=50)e.fillText(r.toString(),r+y.x,15);e.save(),e.rotate(-Math.PI/2);for(let r=0;r<i;r+=50)e.fillText(r.toString(),-r-y.y,15);e.restore()}}},[k,d,i,y,p,U,m,c,ee,J]);l.useEffect(()=>{const s=()=>{oe(),Q||requestAnimationFrame(s)};s()},[oe,Q]),l.useEffect(()=>{const s=C.current;s&&(s.width=d,s.height=i)},[d,i]);const Ne=()=>de?t.jsxs(D,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:"glass-pattern-tools glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-contrast-guard glass-border glass-border-glass-border/20 glass-contrast-guard",children:[t.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[t.jsx("span",{className:"glass-text-sm glass-font-medium",children:"Tool:"}),["circle","square","triangle","line"].map(s=>t.jsx("button",{onClick:()=>fe(s),className:j("glass-px-3 glass-py-1 glass-radius-md transition-colors capitalize glass-focus glass-touch-target glass-contrast-guard",z===s?"bg-primary/20 text-primary":"bg-background/20 hover:bg-background/30"),children:s},s))]}),t.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[t.jsx("span",{className:"glass-text-sm glass-font-medium",children:"Color:"}),t.jsx("div",{className:"glass-flex glass-gap-1",children:f.map((s,e)=>t.jsx("button",{onClick:()=>be(s),className:j("w-6 h-6 glass-radius-sm border-2 transition-all glass-focus glass-touch-target glass-contrast-guard",_===s?"border-primary":"border-border/30"),style:{backgroundColor:s},"aria-label":`Select color ${e+1}`},`${s}-${e}`))})]}),t.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[t.jsx("button",{onClick:Pe,className:"glass-focus glass-touch-target glass-contrast-guard glass-radius-md glass-surface-overlay hover:glass-surface-overlay glass-px-3 glass-py-1",children:"Undo"}),t.jsx("button",{onClick:Ee,className:"glass-focus glass-touch-target glass-contrast-guard glass-radius-md glass-surface-overlay hover:glass-surface-overlay glass-px-3 glass-py-1",children:"Redo"}),t.jsx("button",{onClick:je,className:"glass-focus glass-touch-target glass-contrast-guard glass-radius-md glass-surface-primary/20 hover:glass-surface-primary/30 glass-px-3 glass-py-1 glass-text-primary",children:"Export"})]}),t.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[t.jsx("span",{className:"glass-text-sm",children:"Zoom:"}),t.jsx("input",{type:"range",min:"0.5",max:"3",step:"0.1",value:p,onChange:s=>ve(parseFloat(s.target.value)),className:"glass-w-20 glass-focus glass-touch-target glass-contrast-guard","aria-label":"Zoom level"}),t.jsxs("span",{className:"glass-text-sm glass-min-w-3ch",children:[Math.round(p*100),"%"]})]})]}):null,Ae=()=>K?t.jsxs(D,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:"glass-layer-panel glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-contrast-guard glass-border glass-border-glass-border/20 glass-contrast-guard",children:[t.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-3",children:[t.jsx("span",{className:"glass-text-sm glass-font-medium",children:"Layers"}),t.jsx("button",{onClick:Se,className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-primary/20 hover:glass-surface-primary/30 glass-text-primary glass-text-xs glass-focus glass-touch-target glass-contrast-guard",children:"Add"})]}),t.jsx("div",{className:"glass-space-y-2",children:c.map((s,e)=>t.jsxs("div",{className:j("glass-p-2 glass-radius-md border transition-colors cursor-pointer glass-focus glass-touch-target glass-contrast-guard",e===g?"border-primary/50 bg-primary/10":"border-border/20 bg-background/10 hover:bg-background/20"),onClick:()=>S(e),children:[t.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[t.jsx("span",{className:"glass-text-sm glass-font-medium",children:s.name}),t.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1",children:[t.jsx("button",{onClick:r=>{r.stopPropagation();const o=[...c];o[e]={...o[e],visible:!o[e].visible},b(o)},className:"glass-text-xs glass-px-1 hover:glass-surface-overlay glass-radius-sm glass-focus glass-touch-target glass-contrast-guard","aria-label":s.visible?`Hide layer ${s.name}`:`Show layer ${s.name}`,children:s.visible?"👁":"👁‍🗨"}),t.jsx("button",{onClick:r=>{r.stopPropagation(),Be(e)},className:"glass-text-xs glass-px-1 hover:glass-surface-red/20 glass-radius-sm glass-text-primary glass-focus glass-touch-target glass-contrast-guard","aria-label":`Delete layer ${s.name}`,children:"🗑"})]})]}),t.jsxs("div",{className:"glass-text-xs glass-text-secondary glass-mt-1",children:[s.elements.length," elements"]})]},s.id))})]}):null,Le=()=>t.jsxs(D,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:"glass-templates glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-contrast-guard glass-border glass-border-glass-border/20 glass-contrast-guard",children:[t.jsx("div",{className:"glass-text-sm glass-font-medium glass-mb-3",children:"Templates"}),t.jsx("div",{className:"glass-space-y-2",children:we.map(s=>t.jsxs("button",{onClick:()=>Me(s),className:"glass-w-full glass-p-2 glass-radius-md glass-surface-overlay hover:glass-surface-overlay glass-text-left glass-focus glass-touch-target glass-contrast-guard",children:[t.jsx("div",{className:"glass-text-sm glass-font-medium",children:s.name}),t.jsx("div",{className:"glass-text-xs glass-text-secondary",children:s.category})]},s.id))})]});return t.jsx(D,{ref:he,id:ye,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",className:j("glass-pattern-builder relative glass-radius-lg glass-glass-backdrop-blur-md glass-contrast-guard border border-border/20",ge),...pe,children:t.jsxs(Te,{preset:me&&ue?"fadeIn":"none",className:"glass-flex glass-flex-col glass-gap-4 glass-p-4",children:[Ne(),t.jsxs("div",{className:"glass-flex glass-gap-4",children:[K&&t.jsxs("div",{className:"glass-w-64 glass-space-y-4",children:[Ae(),Le()]}),t.jsx("div",{className:"glass-flex-1",children:t.jsx("canvas",{ref:C,width:d,height:i,className:"glass-border glass-border-glass-border/20 glass-radius-md glass-surface-subtle glass-cursor-crosshair",onMouseDown:Fe,onMouseMove:Ce,onMouseUp:ke,style:{width:d,height:i}})})]})]})})});V.displayName="GlassPatternBuilder";try{V.displayName="GlassPatternBuilder",V.__docgenInfo={description:"",displayName:"GlassPatternBuilder",props:{width:{defaultValue:{value:"800"},description:"Canvas width",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"600"},description:"Canvas height",name:"height",required:!1,type:{name:"number | undefined"}},layers:{defaultValue:{value:"[]"},description:"Current pattern layers",name:"layers",required:!1,type:{name:"PatternLayer[] | undefined"}},activeLayerIndex:{defaultValue:{value:"0"},description:"Active layer index",name:"activeLayerIndex",required:!1,type:{name:"number | undefined"}},selectedElements:{defaultValue:{value:"[]"},description:"Selected element IDs",name:"selectedElements",required:!1,type:{name:"string[] | undefined"}},showGrid:{defaultValue:{value:"true"},description:"Whether grid is visible",name:"showGrid",required:!1,type:{name:"boolean | undefined"}},gridSize:{defaultValue:{value:"20"},description:"Grid size",name:"gridSize",required:!1,type:{name:"number | undefined"}},snapToGrid:{defaultValue:{value:"false"},description:"Whether to snap to grid",name:"snapToGrid",required:!1,type:{name:"boolean | undefined"}},zoom:{defaultValue:{value:"1"},description:"Zoom level",name:"zoom",required:!1,type:{name:"number | undefined"}},templates:{defaultValue:{value:"[]"},description:"Pattern templates",name:"templates",required:!1,type:{name:"PatternTemplate[] | undefined"}},colorPalette:{defaultValue:{value:`[
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#96CEB4",
        "#FFEAA7",
        "#DDA0DD",
        "#F8C471",
      ]`},description:"Available colors",name:"colorPalette",required:!1,type:{name:"string[] | undefined"}},showRulers:{defaultValue:{value:"true"},description:"Whether to show rulers",name:"showRulers",required:!1,type:{name:"boolean | undefined"}},backgroundColor:{defaultValue:{value:"var(--glass-white)"},description:"Background color",name:"backgroundColor",required:!1,type:{name:"string | undefined"}},exportFormat:{defaultValue:{value:"png"},description:"Export format",name:"exportFormat",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"svg"'},{value:'"json"'},{value:'"png"'}]}},onChange:{defaultValue:null,description:"Pattern change handler",name:"onChange",required:!1,type:{name:"((layers: PatternLayer[]) => void) | undefined"}},onLayerChange:{defaultValue:null,description:"Layer change handler",name:"onLayerChange",required:!1,type:{name:"((layers: PatternLayer[], activeIndex: number) => void) | undefined"}},onElementSelect:{defaultValue:null,description:"Element selection handler",name:"onElementSelect",required:!1,type:{name:"((elementIds: string[]) => void) | undefined"}},onTemplateApply:{defaultValue:null,description:"Template apply handler",name:"onTemplateApply",required:!1,type:{name:"((template: PatternTemplate) => void) | undefined"}},onExport:{defaultValue:null,description:"Export handler",name:"onExport",required:!1,type:{name:"((data: string, format: string) => void) | undefined"}},showControls:{defaultValue:{value:"true"},description:"Show controls",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showLayerPanel:{defaultValue:{value:"true"},description:"Show layer panel",name:"showLayerPanel",required:!1,type:{name:"boolean | undefined"}},showProperties:{defaultValue:{value:"true"},description:"Show element properties",name:"showProperties",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Respect user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const Je={title:"Glass UI/Interactive/GlassPatternBuilder",component:V,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{width:{control:{type:"range",min:400,max:1200,step:50}},height:{control:{type:"range",min:300,max:800,step:50}},zoom:{control:{type:"range",min:.5,max:3,step:.1}},gridSize:{control:{type:"range",min:10,max:50,step:5}},backgroundColor:{control:{type:"color"},type:"string",table:{type:{summary:"string"}}},exportFormat:{control:{type:"select"},options:["png","svg","json"]}}},N={args:{width:800,height:600,showControls:!0,showLayerPanel:!0,showProperties:!0,showGrid:!0,showRulers:!0}},A={args:{width:600,height:400,colorPalette:["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7"],gridSize:20,snapToGrid:!0,showGrid:!0}},L={args:{width:500,height:400,showControls:!1,showLayerPanel:!1,showProperties:!1,showRulers:!1,showGrid:!1}},W={args:{width:700,height:500,colorPalette:["#FF0080","#FF8000","#FFFF00","#80FF00","#00FF80","#0080FF","#8000FF","#FF0080"],backgroundColor:"#1A1A1A",showGrid:!0,gridSize:25}},$={args:{width:1e3,height:700,showControls:!0,showLayerPanel:!0,zoom:.8,gridSize:30}},G={args:{width:600,height:400,layers:[{name:"Background",id:"bg-layer",visible:!0,locked:!1,opacity:1,blendMode:"normal",elements:[{type:"square",x:300,y:200,width:580,height:380,rotation:0,color:"#F0F8FF",opacity:.8,strokeColor:"#4169E1",strokeWidth:2,id:"bg-rect",properties:{}}]},{name:"Shapes",id:"shapes-layer",visible:!0,locked:!1,opacity:1,blendMode:"normal",elements:[{type:"circle",x:200,y:150,width:80,height:80,rotation:0,color:"#FF6B6B",opacity:.9,strokeColor:"#CC5555",strokeWidth:3,id:"circle-1",properties:{}},{type:"triangle",x:400,y:150,width:80,height:80,rotation:0,color:"#4ECDC4",opacity:.9,strokeColor:"#3EAAA0",strokeWidth:3,id:"triangle-1",properties:{}},{type:"square",x:300,y:250,width:60,height:60,rotation:45,color:"#45B7D1",opacity:.9,strokeColor:"#3695B8",strokeWidth:3,id:"square-1",properties:{}}]}],activeLayerIndex:1}},T={args:{width:800,height:600,showControls:!0,showLayerPanel:!0,showGrid:!0,snapToGrid:!0,gridSize:20,colorPalette:["#E74C3C","#3498DB","#2ECC71","#F39C12","#9B59B6","#1ABC9C","#34495E","#E67E22"],templates:[{name:"Flower Pattern",category:"Nature",preview:"flower-preview",id:"template-flower",layers:[{name:"Petals",id:"petals-layer",visible:!0,locked:!1,opacity:1,blendMode:"normal",elements:Array.from({length:8},(d,i)=>({type:"circle",x:400+Math.cos(i*Math.PI/4)*60,y:300+Math.sin(i*Math.PI/4)*60,width:40,height:40,rotation:0,color:"#FF69B4",opacity:.8,strokeColor:"#FF1493",strokeWidth:2,id:`petal-${i}`,properties:{}})).concat([{type:"circle",x:400,y:300,width:30,height:30,rotation:0,color:"#FFD700",opacity:1,strokeColor:"#FFA500",strokeWidth:2,id:"center",properties:{}}])}]}]}},q={args:{width:600,height:600,backgroundColor:"#2C3E50",colorPalette:["#E74C3C","#3498DB","#2ECC71","#F39C12","#9B59B6","#E67E22","#1ABC9C","#ECF0F1"],showGrid:!0,gridSize:30,snapToGrid:!0,zoom:1}},I={args:{width:900,height:650,showControls:!0,showLayerPanel:!0,showProperties:!0,showRulers:!0,showGrid:!0,snapToGrid:!1,gridSize:15,zoom:1,colorPalette:["#FF5733","#33FF57","#3357FF","#FF33F5","#F5FF33","#33FFF5","#F533FF","#57FF33"],exportFormat:"svg"}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    showControls: true,
    showLayerPanel: true,
    showProperties: true,
    showGrid: true,
    showRulers: true
  }
}`,...N.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    gridSize: 20,
    snapToGrid: true,
    showGrid: true
  }
}`,...A.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    width: 500,
    height: 400,
    showControls: false,
    showLayerPanel: false,
    showProperties: false,
    showRulers: false,
    showGrid: false
  }
}`,...L.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 500,
    colorPalette: ['#FF0080', '#FF8000', '#FFFF00', '#80FF00', '#00FF80', '#0080FF', '#8000FF', '#FF0080'],
    backgroundColor: '#1A1A1A',
    showGrid: true,
    gridSize: 25
  }
}`,...W.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    width: 1000,
    height: 700,
    showControls: true,
    showLayerPanel: true,
    zoom: 0.8,
    gridSize: 30
  }
}`,...$.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    layers: [{
      name: 'Background',
      id: 'bg-layer',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'normal',
      elements: [{
        type: 'square',
        x: 300,
        y: 200,
        width: 580,
        height: 380,
        rotation: 0,
        color: '#F0F8FF',
        opacity: 0.8,
        strokeColor: '#4169E1',
        strokeWidth: 2,
        id: 'bg-rect',
        properties: {}
      }]
    }, {
      name: 'Shapes',
      id: 'shapes-layer',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'normal',
      elements: [{
        type: 'circle',
        x: 200,
        y: 150,
        width: 80,
        height: 80,
        rotation: 0,
        color: '#FF6B6B',
        opacity: 0.9,
        strokeColor: '#CC5555',
        strokeWidth: 3,
        id: 'circle-1',
        properties: {}
      }, {
        type: 'triangle',
        x: 400,
        y: 150,
        width: 80,
        height: 80,
        rotation: 0,
        color: '#4ECDC4',
        opacity: 0.9,
        strokeColor: '#3EAAA0',
        strokeWidth: 3,
        id: 'triangle-1',
        properties: {}
      }, {
        type: 'square',
        x: 300,
        y: 250,
        width: 60,
        height: 60,
        rotation: 45,
        color: '#45B7D1',
        opacity: 0.9,
        strokeColor: '#3695B8',
        strokeWidth: 3,
        id: 'square-1',
        properties: {}
      }]
    }],
    activeLayerIndex: 1
  }
}`,...G.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    showControls: true,
    showLayerPanel: true,
    showGrid: true,
    snapToGrid: true,
    gridSize: 20,
    colorPalette: ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#34495E', '#E67E22'],
    templates: [{
      name: 'Flower Pattern',
      category: 'Nature',
      preview: 'flower-preview',
      id: 'template-flower',
      layers: [{
        name: 'Petals',
        id: 'petals-layer',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'normal',
        elements: Array.from({
          length: 8
        }, (_, i) => ({
          type: 'circle' as const,
          x: 400 + Math.cos(i * Math.PI / 4) * 60,
          y: 300 + Math.sin(i * Math.PI / 4) * 60,
          width: 40,
          height: 40,
          rotation: 0,
          color: '#FF69B4',
          opacity: 0.8,
          strokeColor: '#FF1493',
          strokeWidth: 2,
          id: \`petal-\${i}\`,
          properties: {}
        })).concat([{
          type: 'circle' as const,
          x: 400,
          y: 300,
          width: 30,
          height: 30,
          rotation: 0,
          color: '#FFD700',
          opacity: 1,
          strokeColor: '#FFA500',
          strokeWidth: 2,
          id: 'center',
          properties: {}
        }])
      }]
    }]
  }
}`,...T.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 600,
    backgroundColor: '#2C3E50',
    colorPalette: ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#E67E22', '#1ABC9C', '#ECF0F1'],
    showGrid: true,
    gridSize: 30,
    snapToGrid: true,
    zoom: 1
  }
}`,...q.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    width: 900,
    height: 650,
    showControls: true,
    showLayerPanel: true,
    showProperties: true,
    showRulers: true,
    showGrid: true,
    snapToGrid: false,
    gridSize: 15,
    zoom: 1,
    colorPalette: ['#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33', '#33FFF5', '#F533FF', '#57FF33'],
    exportFormat: 'svg'
  }
}`,...I.parameters?.docs?.source}}};const Xe=["Default","BasicBuilder","MinimalInterface","WithCustomColors","LargeCanvas","WithPresetLayers","PatternDesigner","GeometricDesign","InteractiveWorkspace"];export{A as BasicBuilder,N as Default,q as GeometricDesign,I as InteractiveWorkspace,$ as LargeCanvas,L as MinimalInterface,T as PatternDesigner,W as WithCustomColors,G as WithPresetLayers,Xe as __namedExportsOrder,Je as default};
