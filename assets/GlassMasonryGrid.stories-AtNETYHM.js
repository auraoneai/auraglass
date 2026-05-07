import{r as i,b as Qe,j as e,m as Ue}from"./iframe-BJUPYBdj.js";import{u as Je}from"./useMotionPreference-B9UZkK67.js";import{u as Ke}from"./a11y-Cl5jzkbw.js";import{c as Xe}from"./createGlassStyle-BfWnO-qv.js";import{u as Ye}from"./soundDesign-HxlLtGpL.js";import{O as We}from"./OptimizedGlassCore-n2ERVMDY.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-C60oOEa3.js";const Ze={columns:"auto",gap:16,minItemWidth:200,maxItemWidth:400,itemPadding:12,autoResize:!0,animationDelay:.05,breakpoints:{1200:4,900:3,600:2,400:1}},ae=i.forwardRef(({items:u,config:j={},showControls:k=!0,showFilters:re=!0,showStats:M=!0,enableVirtualization:c=!1,enableInfiniteScroll:f=!1,enableDragReorder:d=!1,enableSearch:de=!1,filterBy:je="",sortBy:ke="id",sortOrder:Me="asc",loadingItems:ge=0,onItemClick:Fe,onItemsReorder:he,onLoadMore:pe,onFilterChange:Ne,className:De="",...Pe},Ve)=>{const Be=Qe(),[ne,Re]=i.useState([]),[g,Oe]=i.useState({width:0,height:0}),[I,ze]=i.useState(je),[F,qe]=i.useState(""),[S,fe]=i.useState({by:ke,order:Me}),[b,ye]=i.useState(null),[Ge,we]=i.useState([]),[oe,xe]=i.useState(!1),h=i.useRef(null),Le=i.useRef({}),ie=i.useRef(null),le=i.useRef(null),[o]=i.useState({...Ze,...j});Ke("glass-masonry-grid");const{shouldAnimate:Ie}=Je(),{play:v}=Ye(),N=i.useCallback(s=>{if(o.columns!=="auto")return o.columns;const a=Object.entries(o.breakpoints).map(([n,r])=>[parseInt(n),r]).sort((n,r)=>r[0]-n[0]);for(const[n,r]of a)if(s>=n)return r;const t=s-o.gap*2,l=o.minItemWidth+o.gap;return Math.max(1,Math.floor(t/l))},[o]),ce=i.useCallback(s=>{let a=[...s];return F.trim()&&(a=a.filter(t=>{const l=F.toLowerCase();return t.id.toLowerCase().includes(l)||t.category?.toLowerCase().includes(l)||JSON.stringify(t.metadata).toLowerCase().includes(l)})),I&&I!=="all"&&(a=a.filter(t=>t.category===I)),a.sort((t,l)=>{let n,r;switch(S.by){case"height":n=t.height||200,r=l.height||200;break;case"priority":n=t.priority||0,r=l.priority||0;break;case"category":n=t.category||"",r=l.category||"";break;default:n=t.id,r=l.id}return S.order==="desc"?n<r?1:n>r?-1:0:n>r?1:n<r?-1:0}),a},[F,I,S]),Se=i.useCallback((s,a)=>{if(!a||s.length===0)return[];const t=N(a),l=a-o.gap*(t+1),n=Math.min(o.maxItemWidth||1/0,Math.max(o.minItemWidth,l/t)),r=new Array(t).fill(0),C=[];return s.forEach((y,ve)=>{const p=r.indexOf(Math.min(...r));let W=y.height||200;y.aspectRatio&&(W=n/y.aspectRatio);const Ce=o.gap+p*(n+o.gap),$e=r[p]+(r[p]===0,o.gap),Te={...y,x:Ce,y:$e,width:n,computedHeight:W,column:p};C.push(Te),r[p]+=W+o.gap}),C},[N,o]),x=i.useCallback(()=>{if(!h.current)return;const s=h.current.offsetWidth,a=ce(u),t=Se(a,s);Re(t);const l=t.length?Math.max(...t.map(n=>n.y+n.computedHeight))+o.gap:0;if(Oe({width:s,height:l}),c){const n=h.current,r=n.scrollTop,C=n.offsetHeight,y=C*.5,ve=t.filter(p=>{const W=p.y;return p.y+p.computedHeight>=r-y&&W<=r+C+y});we(ve)}else we(t)},[u,ce,Se,o,c]);i.useEffect(()=>{if(!o.autoResize)return;const s=()=>{x()};return window.addEventListener("resize",s),()=>window.removeEventListener("resize",s)},[x,o.autoResize]),i.useEffect(()=>{if(h.current)return ie.current=new ResizeObserver(s=>{for(const a of s)a.target===h.current&&x()}),ie.current.observe(h.current),()=>{ie.current?.disconnect()}},[x]),i.useEffect(()=>{if(!f||!h.current)return;le.current=new IntersectionObserver(a=>{a.forEach(t=>{t.isIntersecting&&!oe&&(xe(!0),pe?.(),setTimeout(()=>xe(!1),1e3))})},{threshold:.1});const s=document.createElement("div");return s.className="masonry-sentinel",s.style.height="1px",h.current.appendChild(s),le.current.observe(s),()=>{le.current?.disconnect()}},[f,oe,pe]),i.useEffect(()=>{x()},[x]);const Ae=i.useCallback((s,a)=>{d&&(ye(a),v("pickup"))},[d,v]),Ee=i.useCallback((s,a)=>{if(!d||!b)return;const t=[...u],l=t.findIndex(r=>r.id===b),n=t.findIndex(r=>r.id===a);if(l!==-1&&n!==-1){const[r]=t.splice(l,1);t.splice(n,0,r),he?.(t),v("place")}ye(null)},[d,b,u,he,v]),be=Array.from(new Set(u.map(s=>s.category).filter(Boolean))),He=()=>e.jsxs("div",{className:"glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-mb-6",children:[de&&e.jsx("div",{className:"glass-flex-1 glass-min-glass-w-48",children:e.jsx("input",{type:"text",placeholder:"Search items...",value:F,onChange:s=>qe(s.target.value),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-placeholder-white-opacity-50 glass-text-sm glass-focus glass-touch-target glass-contrast-guard"})}),re&&be.length>0&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[e.jsx("span",{className:"glass-text-sm glass-text-primary-opacity-70",children:"Filter:"}),e.jsxs("select",{value:I,onChange:s=>{ze(s.target.value),Ne?.(s.target.value)},className:"glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius glass-text-primary-glass-opacity-90 glass-text-sm glass-focus glass-touch-target glass-contrast-guard","aria-label":"Filter items by category",children:[e.jsx("option",{value:"",children:"All"}),be.map(s=>e.jsx("option",{value:s,children:s},s))]})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[e.jsx("span",{className:"glass-text-sm glass-text-primary-opacity-70",children:"Sort:"}),e.jsxs("select",{value:S.by,onChange:s=>fe(a=>({...a,by:s.target.value})),className:"glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius glass-text-primary-glass-opacity-90 glass-text-sm glass-focus glass-touch-target glass-contrast-guard","aria-label":"Sort items",children:[e.jsx("option",{value:"id",children:"ID"}),e.jsx("option",{value:"height",children:"Height"}),e.jsx("option",{value:"priority",children:"Priority"}),e.jsx("option",{value:"category",children:"Category"})]}),e.jsx("button",{onClick:()=>fe(s=>({...s,order:s.order==="asc"?"desc":"asc"})),className:"glass-p-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-border glass-border-white/20 glass-radius glass-text-primary-glass-opacity-90 glass-text-sm glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",children:S.order==="asc"?"↑":"↓"})]})]}),_e=()=>{const s=ce(u),a=Math.max(...ne.map(l=>l.y+l.computedHeight)),t=ne.length>0?a/ne.length:0;return e.jsx("div",{className:`
          mb-4 p-3 rounded-lg border border-white/10
          ${Xe({blur:"sm",opacity:.6}).background}
        `,children:e.jsxs("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4 glass-text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Total Items:"}),e.jsx("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:u.length})]}),e.jsxs("div",{children:[e.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Visible:"}),e.jsx("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:s.length})]}),e.jsxs("div",{children:[e.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Columns:"}),e.jsx("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:g.width?N(g.width):"-"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Avg Height:"}),e.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[t.toFixed(0),"px"]})]})]})})};return e.jsxs(We,{ref:Ve,variant:"frosted",className:`p-6 ${De}`,...Pe,children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90",children:"Masonry Grid"}),e.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Pinterest-style dynamic layout system"})]}),c&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-blue glass-radius-full"}),e.jsx("span",{className:"glass-text-xs",children:"Virtualized"})]})]}),M&&e.jsx(_e,{}),(k||re||de)&&e.jsx(He,{}),e.jsx("div",{ref:h,className:"glass-relative glass-overflow-auto",style:{height:c?"600px":"auto",maxHeight:c?"600px":"none"},children:e.jsxs("div",{className:"glass-relative",style:{width:"100%",height:g.height||"auto",minHeight:g.height||200},children:[Ge.map((s,a)=>e.jsx(Ue.div,{ref:t=>{t&&(Le.current[s.id]=t)},className:`
                  absolute cursor-pointer transition-all duration-200
                  ${b===s.id?"opacity-50 scale-95":"opacity-100 scale-100"}
                  ${d?"glass-hover-scale-105":""}
                `,style:{left:s.x,top:s.y,width:s.width,height:s.computedHeight,zIndex:b===s.id?1e3:1},initial:Ie?{opacity:0,scale:.8}:!1,animate:{opacity:1,scale:1},transition:Be?{duration:0}:{delay:Ie?a*o.animationDelay:0,duration:.3},drag:d,onDragStart:(t,l)=>Ae(t,s.id),onDragEnd:(t,l)=>Ee(t,s.id),onClick:()=>{Fe?.(s,a),v("select")},children:e.jsx(We,{variant:"frosted",className:"glass-w-full glass-h-full hover:glass-surface-subtle/10 glass-transition-all glass-duration-200",style:{padding:o.itemPadding},children:s.content})},s.id)),ge>0&&e.jsx(e.Fragment,{children:Array.from({length:ge},(s,a)=>e.jsx("div",{className:"glass-absolute glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-animate-pulse",style:{left:a%N(g.width)*(300+o.gap)+o.gap,top:g.height+o.gap,width:300,height:200+Math.random()*100}},`loading-${a}`))}),oe&&f&&e.jsx("div",{className:"glass-absolute glass-w-full glass-flex glass-items-center glass-justify-center glass-py-8",style:{top:g.height+o.gap},children:e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-text-primary",children:[e.jsx("div",{className:"glass-w-4 glass-h-4 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin"}),e.jsx("span",{className:"glass-text-sm",children:"Loading more items..."})]})})]})}),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mt-6 glass-pt-4 glass-border-t glass-border-white/10 glass-text-xs glass-text-primary-glass-opacity-60",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[d&&e.jsx("span",{children:"Drag items to reorder"}),f&&e.jsx("span",{children:"Scroll to load more"}),c&&e.jsx("span",{children:"Virtualized for performance"})]}),e.jsxs("div",{children:["Grid: ",g.width,"×",g.height,"px"]})]})]})});ae.displayName="GlassMasonryGrid";try{ae.displayName="GlassMasonryGrid",ae.__docgenInfo={description:"",displayName:"GlassMasonryGrid",props:{items:{defaultValue:null,description:"",name:"items",required:!0,type:{name:"MasonryItem[]"}},config:{defaultValue:{value:"{}"},description:"",name:"config",required:!1,type:{name:"Partial<MasonryConfig> | undefined"}},showControls:{defaultValue:{value:"true"},description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showFilters:{defaultValue:{value:"true"},description:"",name:"showFilters",required:!1,type:{name:"boolean | undefined"}},showStats:{defaultValue:{value:"true"},description:"",name:"showStats",required:!1,type:{name:"boolean | undefined"}},enableVirtualization:{defaultValue:{value:"false"},description:"",name:"enableVirtualization",required:!1,type:{name:"boolean | undefined"}},enableInfiniteScroll:{defaultValue:{value:"false"},description:"",name:"enableInfiniteScroll",required:!1,type:{name:"boolean | undefined"}},enableDragReorder:{defaultValue:{value:"false"},description:"",name:"enableDragReorder",required:!1,type:{name:"boolean | undefined"}},enableSearch:{defaultValue:{value:"false"},description:"",name:"enableSearch",required:!1,type:{name:"boolean | undefined"}},filterBy:{defaultValue:{value:""},description:"",name:"filterBy",required:!1,type:{name:"string | undefined"}},sortBy:{defaultValue:{value:"id"},description:"",name:"sortBy",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"id"'},{value:'"height"'},{value:'"priority"'},{value:'"category"'}]}},sortOrder:{defaultValue:{value:"asc"},description:"",name:"sortOrder",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"desc"'},{value:'"asc"'}]}},loadingItems:{defaultValue:{value:"0"},description:"",name:"loadingItems",required:!1,type:{name:"number | undefined"}},onItemClick:{defaultValue:null,description:"",name:"onItemClick",required:!1,type:{name:"((item: MasonryItem, index: number) => void) | undefined"}},onItemsReorder:{defaultValue:null,description:"",name:"onItemsReorder",required:!1,type:{name:"((items: MasonryItem[]) => void) | undefined"}},onLoadMore:{defaultValue:null,description:"",name:"onLoadMore",required:!1,type:{name:"(() => void) | undefined"}},onFilterChange:{defaultValue:null,description:"",name:"onFilterChange",required:!1,type:{name:"((filter: string) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const me=u=>{const j=["photos","quotes","articles","videos","recipes"],k=["from-red-400 to-pink-600","from-blue-400 to-purple-600","from-green-400 to-teal-600","from-yellow-400 to-orange-600","from-purple-400 to-indigo-600"];return Array.from({length:u},(re,M)=>{const c=j[Math.floor(Math.random()*j.length)],f=150+Math.random()*250,d=k[Math.floor(Math.random()*k.length)];return{id:`item-${M+1}`,height:f,category:c,priority:Math.floor(Math.random()*5),content:e.jsxs("div",{className:`h-full w-full bg-gradient-to-br ${d} rounded-lg flex items-center justify-center text-white relative overflow-hidden`,children:[e.jsx("div",{className:"glass-absolute glass-inset-0 glass-surface-dark/20"}),e.jsxs("div",{className:"glass-relative glass-z-10 glass-text-center glass-p-4",children:[e.jsxs("h4",{className:"glass-font-semibold glass-mb-2",children:[c.charAt(0).toUpperCase()+c.slice(1)," ",M+1]}),e.jsxs("p",{className:"glass-text-sm glass-opacity-90",children:[c==="photos"&&"Beautiful landscape photography",c==="quotes"&&'"Every moment is a fresh beginning."',c==="articles"&&"Interesting article about technology and innovation in modern world.",c==="videos"&&"Watch this amazing video content",c==="recipes"&&"Delicious recipe for home cooking"]}),e.jsxs("div",{className:"mt-2 glass-text-xs opacity-75",children:["Priority: ",Math.floor(Math.random()*5)," • ",Math.floor(f),"px"]})]})]}),metadata:{author:`User ${Math.floor(Math.random()*100)}`,likes:Math.floor(Math.random()*1e3),views:Math.floor(Math.random()*5e3)}}})},m=me(24),w=me(8),ue=me(50),ls={title:"Surfaces/App Shells + Layout/Glass Masonry Grid",component:ae,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{showControls:{control:"boolean"},showFilters:{control:"boolean"},showStats:{control:"boolean"},enableVirtualization:{control:"boolean"},enableInfiniteScroll:{control:"boolean"},enableDragReorder:{control:"boolean"},enableSearch:{control:"boolean"},sortBy:{control:{type:"select",options:["id","height","priority","category"]}},sortOrder:{control:{type:"select",options:["asc","desc"]}},loadingItems:{control:{type:"range",min:0,max:10,step:1}}}},D={args:{items:m,showControls:!0,showFilters:!0,showStats:!0,enableVirtualization:!1,enableInfiniteScroll:!1,enableDragReorder:!1,enableSearch:!0,sortBy:"id",sortOrder:"asc",loadingItems:0,config:{columns:"auto",gap:16,minItemWidth:200,maxItemWidth:400,itemPadding:12,autoResize:!0,animationDelay:.05,breakpoints:{1200:4,900:3,600:2,400:1}}}},P={args:{items:m,showControls:!0,showFilters:!0,showStats:!0,config:{columns:3,gap:20,minItemWidth:250,itemPadding:16}}},V={args:{items:ue,showControls:!0,showFilters:!0,showStats:!0,config:{columns:5,gap:8,minItemWidth:150,maxItemWidth:200,itemPadding:8,animationDelay:.02}}},B={args:{items:w,showControls:!0,showFilters:!0,showStats:!0,config:{columns:2,gap:24,minItemWidth:300,maxItemWidth:500,itemPadding:20}}},R={args:{items:ue,showControls:!0,showFilters:!0,showStats:!0,enableVirtualization:!0,config:{columns:"auto",gap:16,minItemWidth:200,animationDelay:.01}}},O={args:{items:m,showControls:!0,showFilters:!0,showStats:!0,enableInfiniteScroll:!0,loadingItems:3,config:{columns:"auto",gap:16,minItemWidth:220}}},z={args:{items:w,showControls:!0,showFilters:!1,showStats:!0,enableDragReorder:!0,config:{columns:3,gap:20,minItemWidth:200,itemPadding:16}}},q={args:{items:m,showControls:!0,showFilters:!0,showStats:!0,enableSearch:!0,filterBy:"photos",config:{columns:"auto",gap:16,minItemWidth:200}}},G={args:{items:m,showControls:!0,showFilters:!0,showStats:!0,sortBy:"height",sortOrder:"desc",config:{columns:4,gap:16,minItemWidth:180}}},L={args:{items:m,showControls:!0,showFilters:!0,showStats:!0,sortBy:"priority",sortOrder:"desc",config:{columns:"auto",gap:16,minItemWidth:200}}},A={args:{items:m,showControls:!0,showFilters:!0,showStats:!0,sortBy:"category",sortOrder:"asc",config:{columns:"auto",gap:16,minItemWidth:200}}},E={args:{items:w,showControls:!1,showFilters:!1,showStats:!1,enableSearch:!1,config:{columns:"auto",gap:16,minItemWidth:200,animationDelay:.08}}},H={args:{items:m,showControls:!0,showFilters:!0,showStats:!0,config:{columns:"auto",gap:16,minItemWidth:200,breakpoints:{1400:6,1200:5,1e3:4,800:3,600:2,400:1}}}},_={args:{items:w,showControls:!0,showStats:!0,config:{columns:3,gap:32,minItemWidth:200,itemPadding:20}}},$={args:{items:m,showControls:!0,showStats:!0,config:{columns:5,gap:4,minItemWidth:150,itemPadding:8}}},T={args:{items:w,showControls:!0,showStats:!0,config:{columns:3,gap:16,minItemWidth:200,animationDelay:.2}}},Q={args:{items:m,showControls:!0,showStats:!0,config:{columns:"auto",gap:16,minItemWidth:200,animationDelay:.01}}},U={args:{items:m,showControls:!0,showStats:!0,config:{columns:"auto",gap:16,minItemWidth:200,animationDelay:0}}},J={args:{items:m,showControls:!0,showFilters:!0,showStats:!0,enableSearch:!0,config:{columns:"auto",gap:16,minItemWidth:200}}},K={args:{items:m.filter(u=>u.category==="photos"),showControls:!0,showFilters:!1,showStats:!0,config:{columns:"auto",gap:16,minItemWidth:250,maxItemWidth:350}}},X={args:{items:m.filter(u=>u.category==="quotes"),showControls:!0,showFilters:!1,showStats:!0,config:{columns:2,gap:20,minItemWidth:300,itemPadding:20}}},Y={args:{items:m,showControls:!0,showFilters:!0,showStats:!0,enableVirtualization:!0,enableInfiniteScroll:!0,enableDragReorder:!0,enableSearch:!0,loadingItems:2,config:{columns:"auto",gap:16,minItemWidth:200,maxItemWidth:300,itemPadding:12,autoResize:!0,animationDelay:.05}}},Z={args:{items:w,showControls:!0,showStats:!0,loadingItems:6,config:{columns:"auto",gap:16,minItemWidth:200}}},ee={args:{items:[],showControls:!0,showFilters:!0,showStats:!0,enableSearch:!0,config:{columns:"auto",gap:16,minItemWidth:200}}},se={args:{items:w,showControls:!0,showStats:!0,config:{columns:1,gap:16,minItemWidth:400,maxItemWidth:600,itemPadding:20}}},te={args:{items:ue,showControls:!0,showStats:!0,config:{columns:8,gap:8,minItemWidth:120,maxItemWidth:150,itemPadding:8,animationDelay:.01}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    enableVirtualization: false,
    enableInfiniteScroll: false,
    enableDragReorder: false,
    enableSearch: true,
    sortBy: 'id',
    sortOrder: 'asc',
    loadingItems: 0,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
      maxItemWidth: 400,
      itemPadding: 12,
      autoResize: true,
      animationDelay: 0.05,
      breakpoints: {
        1200: 4,
        900: 3,
        600: 2,
        400: 1
      }
    }
  }
}`,...D.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    config: {
      columns: 3,
      gap: 20,
      minItemWidth: 250,
      itemPadding: 16
    }
  }
}`,...P.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    items: largeMockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    config: {
      columns: 5,
      gap: 8,
      minItemWidth: 150,
      maxItemWidth: 200,
      itemPadding: 8,
      animationDelay: 0.02
    }
  }
}`,...V.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    items: smallMockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    config: {
      columns: 2,
      gap: 24,
      minItemWidth: 300,
      maxItemWidth: 500,
      itemPadding: 20
    }
  }
}`,...B.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    items: largeMockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    enableVirtualization: true,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
      animationDelay: 0.01
    }
  }
}`,...R.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    enableInfiniteScroll: true,
    loadingItems: 3,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 220
    }
  }
}`,...O.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    items: smallMockItems,
    showControls: true,
    showFilters: false,
    showStats: true,
    enableDragReorder: true,
    config: {
      columns: 3,
      gap: 20,
      minItemWidth: 200,
      itemPadding: 16
    }
  }
}`,...z.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    enableSearch: true,
    filterBy: 'photos',
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200
    }
  }
}`,...q.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    sortBy: 'height',
    sortOrder: 'desc',
    config: {
      columns: 4,
      gap: 16,
      minItemWidth: 180
    }
  }
}`,...G.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    sortBy: 'priority',
    sortOrder: 'desc',
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200
    }
  }
}`,...L.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    sortBy: 'category',
    sortOrder: 'asc',
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200
    }
  }
}`,...A.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    items: smallMockItems,
    showControls: false,
    showFilters: false,
    showStats: false,
    enableSearch: false,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
      animationDelay: 0.08
    }
  }
}`,...E.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
      breakpoints: {
        1400: 6,
        1200: 5,
        1000: 4,
        800: 3,
        600: 2,
        400: 1
      }
    }
  }
}`,...H.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    items: smallMockItems,
    showControls: true,
    showStats: true,
    config: {
      columns: 3,
      gap: 32,
      minItemWidth: 200,
      itemPadding: 20
    }
  }
}`,..._.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    items: mockItems,
    showControls: true,
    showStats: true,
    config: {
      columns: 5,
      gap: 4,
      minItemWidth: 150,
      itemPadding: 8
    }
  }
}`,...$.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    items: smallMockItems,
    showControls: true,
    showStats: true,
    config: {
      columns: 3,
      gap: 16,
      minItemWidth: 200,
      animationDelay: 0.2
    }
  }
}`,...T.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    items: mockItems,
    showControls: true,
    showStats: true,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
      animationDelay: 0.01
    }
  }
}`,...Q.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    items: mockItems,
    showControls: true,
    showStats: true,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
      animationDelay: 0
    }
  }
}`,...U.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    enableSearch: true,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200
    }
  }
}`,...J.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    items: mockItems.filter(item => item.category === 'photos'),
    showControls: true,
    showFilters: false,
    showStats: true,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 250,
      maxItemWidth: 350
    }
  }
}`,...K.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    items: mockItems.filter(item => item.category === 'quotes'),
    showControls: true,
    showFilters: false,
    showStats: true,
    config: {
      columns: 2,
      gap: 20,
      minItemWidth: 300,
      itemPadding: 20
    }
  }
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    items: mockItems,
    showControls: true,
    showFilters: true,
    showStats: true,
    enableVirtualization: true,
    enableInfiniteScroll: true,
    enableDragReorder: true,
    enableSearch: true,
    loadingItems: 2,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200,
      maxItemWidth: 300,
      itemPadding: 12,
      autoResize: true,
      animationDelay: 0.05
    }
  }
}`,...Y.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    items: smallMockItems,
    showControls: true,
    showStats: true,
    loadingItems: 6,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200
    }
  }
}`,...Z.parameters?.docs?.source}}};ee.parameters={...ee.parameters,docs:{...ee.parameters?.docs,source:{originalSource:`{
  args: {
    items: [],
    showControls: true,
    showFilters: true,
    showStats: true,
    enableSearch: true,
    config: {
      columns: 'auto',
      gap: 16,
      minItemWidth: 200
    }
  }
}`,...ee.parameters?.docs?.source}}};se.parameters={...se.parameters,docs:{...se.parameters?.docs,source:{originalSource:`{
  args: {
    items: smallMockItems,
    showControls: true,
    showStats: true,
    config: {
      columns: 1,
      gap: 16,
      minItemWidth: 400,
      maxItemWidth: 600,
      itemPadding: 20
    }
  }
}`,...se.parameters?.docs?.source}}};te.parameters={...te.parameters,docs:{...te.parameters?.docs,source:{originalSource:`{
  args: {
    items: largeMockItems,
    showControls: true,
    showStats: true,
    config: {
      columns: 8,
      gap: 8,
      minItemWidth: 120,
      maxItemWidth: 150,
      itemPadding: 8,
      animationDelay: 0.01
    }
  }
}`,...te.parameters?.docs?.source}}};const cs=["Default","FixedColumns","DenseLayout","WideLayout","Virtualized","InfiniteScroll","DragAndDrop","FilterableGrid","SortedByHeight","SortedByPriority","SortedByCategory","MinimalInterface","ResponsiveBreakpoints","LargeGaps","SmallGaps","SlowAnimation","FastAnimation","NoAnimation","SearchEnabled","PhotosOnly","QuotesOnly","AllFeatures","LoadingState","EmptyState","SingleColumn","ManyColumns"];export{Y as AllFeatures,D as Default,V as DenseLayout,z as DragAndDrop,ee as EmptyState,Q as FastAnimation,q as FilterableGrid,P as FixedColumns,O as InfiniteScroll,_ as LargeGaps,Z as LoadingState,te as ManyColumns,E as MinimalInterface,U as NoAnimation,K as PhotosOnly,X as QuotesOnly,H as ResponsiveBreakpoints,J as SearchEnabled,se as SingleColumn,T as SlowAnimation,$ as SmallGaps,A as SortedByCategory,G as SortedByHeight,L as SortedByPriority,R as Virtualized,B as WideLayout,cs as __namedExportsOrder,ls as default};
