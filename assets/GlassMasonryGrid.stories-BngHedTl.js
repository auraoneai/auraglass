import{r as i,b as ss,j as e,m as ts,c as as}from"./iframe-B8jVgyad.js";import{u as rs}from"./useMotionPreference-BlzAqUHb.js";import{u as ns}from"./a11y-B5SIjMKz.js";import{c as os}from"./createGlassStyle-BfWnO-qv.js";import{u as is}from"./soundDesign-CllqvAQo.js";import{O as Fe}from"./OptimizedGlassCore-LJ9cg0Vq.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-TeCERPXa.js";const ls={columns:"auto",gap:16,minItemWidth:200,maxItemWidth:400,itemPadding:12,autoResize:!0,animationDelay:.05,breakpoints:{1200:4,900:3,600:2,400:1}},oe=i.forwardRef(({items:c,config:k={},showControls:F=!0,showFilters:N=!0,showStats:pe=!0,enableVirtualization:m=!1,enableInfiniteScroll:h=!1,enableDragReorder:g=!1,enableSearch:M=!1,filterBy:D="",sortBy:Ne="id",sortOrder:Me="asc",loadingItems:fe=0,onItemClick:De,onItemsReorder:ye,onLoadMore:we,onFilterChange:Pe,compact:d=!1,contained:Ve=!1,maxHeight:Be,className:Re="",...ze},Oe)=>{const qe=ss(),[ie,He]=i.useState([]),[p,Le]=i.useState({width:0,height:0}),[I,Ge]=i.useState(D),[P,Ae]=i.useState(""),[b,xe]=i.useState({by:Ne,order:Me}),[v,Se]=i.useState(null),[Ee,Ie]=i.useState([]),[le,be]=i.useState(!1),f=i.useRef(null),_e=i.useRef({}),ce=i.useRef(null),me=i.useRef(null),[o]=i.useState({...ls,...k});ns("glass-masonry-grid");const{shouldAnimate:ve}=rs(),{play:C}=is(),Te=d?!1:F,$e=d?!1:N,Qe=d?!1:pe,Ue=d?!1:M,ue=Be??(d||Ve?240:"min(760px, calc(100vh - 64px))"),V=i.useCallback(s=>{if(o.columns!=="auto")return o.columns;const a=Object.entries(o.breakpoints).map(([n,r])=>[parseInt(n),r]).sort((n,r)=>r[0]-n[0]);for(const[n,r]of a)if(s>=n)return r;const t=s-o.gap*2,l=o.minItemWidth+o.gap;return Math.max(1,Math.floor(t/l))},[o]),de=i.useCallback(s=>{let a=[...s];return P.trim()&&(a=a.filter(t=>{const l=P.toLowerCase();return t.id.toLowerCase().includes(l)||t.category?.toLowerCase().includes(l)||JSON.stringify(t.metadata).toLowerCase().includes(l)})),I&&I!=="all"&&(a=a.filter(t=>t.category===I)),a.sort((t,l)=>{let n,r;switch(b.by){case"height":n=t.height||200,r=l.height||200;break;case"priority":n=t.priority||0,r=l.priority||0;break;case"category":n=t.category||"",r=l.category||"";break;default:n=t.id,r=l.id}return b.order==="desc"?n<r?1:n>r?-1:0:n>r?1:n<r?-1:0}),a},[P,I,b]),Ce=i.useCallback((s,a)=>{if(!a||s.length===0)return[];const t=V(a),l=a-o.gap*(t+1),n=Math.min(o.maxItemWidth||1/0,Math.max(o.minItemWidth,l/t)),r=new Array(t).fill(0),W=[];return s.forEach((w,je)=>{const y=r.indexOf(Math.min(...r));let j=w.height||200;w.aspectRatio&&(j=n/w.aspectRatio);const ke=o.gap+y*(n+o.gap),Ze=r[y]+(r[y]===0,o.gap),es={...w,x:ke,y:Ze,width:n,computedHeight:j,column:y};W.push(es),r[y]+=j+o.gap}),W},[V,o]),S=i.useCallback(()=>{if(!f.current)return;const s=f.current.offsetWidth,a=de(c),t=Ce(a,s);He(t);const l=t.length?Math.max(...t.map(n=>n.y+n.computedHeight))+o.gap:0;if(Le({width:s,height:l}),m){const n=f.current,r=n.scrollTop,W=n.offsetHeight,w=W*.5,je=t.filter(y=>{const j=y.y;return y.y+y.computedHeight>=r-w&&j<=r+W+w});Ie(je)}else Ie(t)},[c,de,Ce,o,m]);i.useEffect(()=>{if(!o.autoResize)return;const s=()=>{S()};return window.addEventListener("resize",s),()=>window.removeEventListener("resize",s)},[S,o.autoResize]),i.useEffect(()=>{if(f.current)return ce.current=new ResizeObserver(s=>{for(const a of s)a.target===f.current&&S()}),ce.current.observe(f.current),()=>{ce.current?.disconnect()}},[S]),i.useEffect(()=>{if(!h||!f.current)return;me.current=new IntersectionObserver(a=>{a.forEach(t=>{t.isIntersecting&&!le&&(be(!0),we?.(),setTimeout(()=>be(!1),1e3))})},{threshold:.1});const s=document.createElement("div");return s.className="masonry-sentinel",s.style.height="1px",f.current.appendChild(s),me.current.observe(s),()=>{me.current?.disconnect()}},[h,le,we]),i.useEffect(()=>{S()},[S]);const Je=i.useCallback((s,a)=>{g&&(Se(a),C("pickup"))},[g,C]),Xe=i.useCallback((s,a)=>{if(!g||!v)return;const t=[...c],l=t.findIndex(r=>r.id===v),n=t.findIndex(r=>r.id===a);if(l!==-1&&n!==-1){const[r]=t.splice(l,1);t.splice(n,0,r),ye?.(t),C("place")}Se(null)},[g,v,c,ye,C]),We=Array.from(new Set(c.map(s=>s.category).filter(Boolean))),Ye=()=>e.jsxs("div",{className:"glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-mb-6",children:[M&&e.jsx("div",{className:"glass-flex-1 glass-min-glass-w-48",children:e.jsx("input",{type:"text",placeholder:"Search items...",value:P,onChange:s=>Ae(s.target.value),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-placeholder-white-opacity-50 glass-text-sm glass-focus glass-touch-target glass-contrast-guard"})}),N&&We.length>0&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[e.jsx("span",{className:"glass-text-sm glass-text-primary-opacity-70",children:"Filter:"}),e.jsxs("select",{value:I,onChange:s=>{Ge(s.target.value),Pe?.(s.target.value)},className:"glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius glass-text-primary-glass-opacity-90 glass-text-sm glass-focus glass-touch-target glass-contrast-guard","aria-label":"Filter items by category",children:[e.jsx("option",{value:"",children:"All"}),We.map(s=>e.jsx("option",{value:s,children:s},s))]})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[e.jsx("span",{className:"glass-text-sm glass-text-primary-opacity-70",children:"Sort:"}),e.jsxs("select",{value:b.by,onChange:s=>xe(a=>({...a,by:s.target.value})),className:"glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius glass-text-primary-glass-opacity-90 glass-text-sm glass-focus glass-touch-target glass-contrast-guard","aria-label":"Sort items",children:[e.jsx("option",{value:"id",children:"ID"}),e.jsx("option",{value:"height",children:"Height"}),e.jsx("option",{value:"priority",children:"Priority"}),e.jsx("option",{value:"category",children:"Category"})]}),e.jsx("button",{onClick:()=>xe(s=>({...s,order:s.order==="asc"?"desc":"asc"})),className:"glass-p-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-border glass-border-white/20 glass-radius glass-text-primary-glass-opacity-90 glass-text-sm glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",children:b.order==="asc"?"↑":"↓"})]})]}),Ke=()=>{const s=de(c),a=Math.max(...ie.map(l=>l.y+l.computedHeight)),t=ie.length>0?a/ie.length:0;return e.jsx("div",{className:`
          mb-4 p-3 rounded-lg border border-white/10
          ${os({blur:"sm",opacity:.6}).background}
        `,children:e.jsxs("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4 glass-text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Total Items:"}),e.jsx("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:c.length})]}),e.jsxs("div",{children:[e.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Visible:"}),e.jsx("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:s.length})]}),e.jsxs("div",{children:[e.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Columns:"}),e.jsx("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:p.width?V(p.width):"-"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Avg Height:"}),e.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[t.toFixed(0),"px"]})]})]})})};return e.jsxs(Fe,{ref:Oe,variant:"frosted",className:as("glass-masonry-grid",d?"glass-p-3":"p-6",Re),style:{width:d?"100%":"min(1120px, calc(100vw - 48px))",maxWidth:"100%",maxHeight:typeof ue=="number"?`${ue}px`:ue,overflowX:"auto",overflowY:"auto",boxSizing:"border-box"},...ze,children:[!d&&e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90",children:"Masonry Grid"}),e.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Pinterest-style dynamic layout system"})]}),m&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[e.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-blue glass-radius-full"}),e.jsx("span",{className:"glass-text-xs",children:"Virtualized"})]})]}),Qe&&e.jsx(Ke,{}),(Te||$e||Ue)&&e.jsx(Ye,{}),e.jsx("div",{ref:f,className:"glass-relative glass-overflow-auto",style:{height:d?180:m?"600px":"auto",maxHeight:d?180:m?"600px":"none",minHeight:d?160:200},children:e.jsxs("div",{className:"glass-relative",style:{width:"100%",height:p.height||"auto",minHeight:p.height||200},children:[Ee.map((s,a)=>e.jsx(ts.div,{ref:t=>{t&&(_e.current[s.id]=t)},className:`
                  absolute cursor-pointer transition-all duration-200
                  ${v===s.id?"opacity-50 scale-95":"opacity-100 scale-100"}
                  ${g?"glass-hover-scale-105":""}
                `,style:{left:s.x,top:s.y,width:s.width,height:s.computedHeight,zIndex:v===s.id?1e3:1},initial:ve?{opacity:0,scale:.8}:!1,animate:{opacity:1,scale:1},transition:qe?{duration:0}:{delay:ve?a*o.animationDelay:0,duration:.3},drag:g,onDragStart:(t,l)=>Je(t,s.id),onDragEnd:(t,l)=>Xe(t,s.id),onClick:()=>{De?.(s,a),C("select")},children:e.jsx(Fe,{variant:"frosted",className:"glass-w-full glass-h-full hover:glass-surface-subtle/10 glass-transition-all glass-duration-200",style:{padding:o.itemPadding,boxSizing:"border-box",overflow:"auto"},children:s.content})},s.id)),fe>0&&e.jsx(e.Fragment,{children:Array.from({length:fe},(s,a)=>e.jsx("div",{className:"glass-absolute glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-animate-pulse",style:{left:a%V(p.width)*(300+o.gap)+o.gap,top:p.height+o.gap,width:300,height:200+Math.random()*100}},`loading-${a}`))}),le&&h&&e.jsx("div",{className:"glass-absolute glass-w-full glass-flex glass-items-center glass-justify-center glass-py-8",style:{top:p.height+o.gap},children:e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-text-primary",children:[e.jsx("div",{className:"glass-w-4 glass-h-4 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin"}),e.jsx("span",{className:"glass-text-sm",children:"Loading more items..."})]})})]})}),!d&&e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mt-6 glass-pt-4 glass-border-t glass-border-white/10 glass-text-xs glass-text-primary-glass-opacity-60",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[g&&e.jsx("span",{children:"Drag items to reorder"}),h&&e.jsx("span",{children:"Scroll to load more"}),m&&e.jsx("span",{children:"Virtualized for performance"})]}),e.jsxs("div",{children:["Grid: ",p.width,"×",p.height,"px"]})]})]})});oe.displayName="GlassMasonryGrid";try{oe.displayName="GlassMasonryGrid",oe.__docgenInfo={description:"",displayName:"GlassMasonryGrid",props:{items:{defaultValue:null,description:"",name:"items",required:!0,type:{name:"MasonryItem[]"}},config:{defaultValue:{value:"{}"},description:"",name:"config",required:!1,type:{name:"Partial<MasonryConfig> | undefined"}},showControls:{defaultValue:{value:"true"},description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showFilters:{defaultValue:{value:"true"},description:"",name:"showFilters",required:!1,type:{name:"boolean | undefined"}},showStats:{defaultValue:{value:"true"},description:"",name:"showStats",required:!1,type:{name:"boolean | undefined"}},enableVirtualization:{defaultValue:{value:"false"},description:"",name:"enableVirtualization",required:!1,type:{name:"boolean | undefined"}},enableInfiniteScroll:{defaultValue:{value:"false"},description:"",name:"enableInfiniteScroll",required:!1,type:{name:"boolean | undefined"}},enableDragReorder:{defaultValue:{value:"false"},description:"",name:"enableDragReorder",required:!1,type:{name:"boolean | undefined"}},enableSearch:{defaultValue:{value:"false"},description:"",name:"enableSearch",required:!1,type:{name:"boolean | undefined"}},filterBy:{defaultValue:{value:""},description:"",name:"filterBy",required:!1,type:{name:"string | undefined"}},sortBy:{defaultValue:{value:"id"},description:"",name:"sortBy",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"id"'},{value:'"height"'},{value:'"priority"'},{value:'"category"'}]}},sortOrder:{defaultValue:{value:"asc"},description:"",name:"sortOrder",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"desc"'},{value:'"asc"'}]}},loadingItems:{defaultValue:{value:"0"},description:"",name:"loadingItems",required:!1,type:{name:"number | undefined"}},onItemClick:{defaultValue:null,description:"",name:"onItemClick",required:!1,type:{name:"((item: MasonryItem, index: number) => void) | undefined"}},onItemsReorder:{defaultValue:null,description:"",name:"onItemsReorder",required:!1,type:{name:"((items: MasonryItem[]) => void) | undefined"}},onLoadMore:{defaultValue:null,description:"",name:"onLoadMore",required:!1,type:{name:"(() => void) | undefined"}},onFilterChange:{defaultValue:null,description:"",name:"onFilterChange",required:!1,type:{name:"((filter: string) => void) | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const ge=c=>{const k=["photos","quotes","articles","videos","recipes"],F=["from-red-400 to-pink-600","from-blue-400 to-purple-600","from-green-400 to-teal-600","from-yellow-400 to-orange-600","from-purple-400 to-indigo-600"],N={photos:"Landscape set",quotes:"Fresh beginning",articles:"Technology notes",videos:"Video content",recipes:"Home recipe"};return Array.from({length:c},(pe,m)=>{const h=k[m%k.length],g=150+m*37%220,M=F[m%F.length],D=m%5;return{id:`item-${m+1}`,height:g,category:h,priority:D,content:e.jsxs("div",{className:`glass-h-full glass-w-full bg-gradient-to-br ${M} rounded-lg flex items-center justify-center text-white relative glass-overflow-auto`,children:[e.jsx("div",{className:"glass-absolute glass-inset-0 glass-surface-dark/20"}),e.jsxs("div",{className:"glass-relative glass-z-10 glass-text-center glass-p-2 glass-text-white",children:[e.jsxs("h4",{className:"glass-font-semibold glass-mb-2",children:[h.charAt(0).toUpperCase()+h.slice(1)," ",m+1]}),e.jsx("p",{className:"glass-text-sm glass-opacity-90",children:N[h]}),e.jsxs("div",{className:"mt-2 glass-text-xs opacity-75",children:["Priority: ",D," • ",Math.floor(g),"px"]})]})]}),metadata:{author:`User ${m*7%100}`,likes:m*53%1e3,views:m*211%5e3}}})},u=ge(24),x=ge(8),he=ge(50),ys={title:"Surfaces/App Shells + Layout/Glass Masonry Grid",component:oe,parameters:{layout:"fullscreen",previewSurface:"app"},decorators:[c=>e.jsx("div",{className:"glass-flex glass-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8",style:{boxSizing:"border-box"},children:e.jsx(c,{})})],tags:["autodocs"],argTypes:{showControls:{control:"boolean"},showFilters:{control:"boolean"},showStats:{control:"boolean"},enableVirtualization:{control:"boolean"},enableInfiniteScroll:{control:"boolean"},enableDragReorder:{control:"boolean"},enableSearch:{control:"boolean"},sortBy:{control:{type:"select",options:["id","height","priority","category"]}},sortOrder:{control:{type:"select",options:["asc","desc"]}},loadingItems:{control:{type:"range",min:0,max:10,step:1}}}},B={args:{items:u,showControls:!0,showFilters:!0,showStats:!0,enableVirtualization:!1,enableInfiniteScroll:!1,enableDragReorder:!1,enableSearch:!0,sortBy:"id",sortOrder:"asc",loadingItems:0,config:{columns:"auto",gap:16,minItemWidth:200,maxItemWidth:400,itemPadding:12,autoResize:!0,animationDelay:.05,breakpoints:{1200:4,900:3,600:2,400:1}}}},R={args:{items:u,showControls:!0,showFilters:!0,showStats:!0,config:{columns:3,gap:20,minItemWidth:250,itemPadding:16}}},z={args:{items:he,showControls:!0,showFilters:!0,showStats:!0,config:{columns:5,gap:8,minItemWidth:150,maxItemWidth:200,itemPadding:8,animationDelay:.02}}},O={args:{items:x,showControls:!0,showFilters:!0,showStats:!0,config:{columns:2,gap:24,minItemWidth:300,maxItemWidth:500,itemPadding:20}}},q={args:{items:he,showControls:!0,showFilters:!0,showStats:!0,enableVirtualization:!0,config:{columns:"auto",gap:16,minItemWidth:200,animationDelay:.01}}},H={args:{items:u,showControls:!0,showFilters:!0,showStats:!0,enableInfiniteScroll:!0,loadingItems:3,config:{columns:"auto",gap:16,minItemWidth:220}}},L={args:{items:x,showControls:!0,showFilters:!1,showStats:!0,enableDragReorder:!0,config:{columns:3,gap:20,minItemWidth:200,itemPadding:16}}},G={args:{items:u,showControls:!0,showFilters:!0,showStats:!0,enableSearch:!0,filterBy:"photos",config:{columns:"auto",gap:16,minItemWidth:200}}},A={args:{items:u,showControls:!0,showFilters:!0,showStats:!0,sortBy:"height",sortOrder:"desc",config:{columns:4,gap:16,minItemWidth:180}}},E={args:{items:u,showControls:!0,showFilters:!0,showStats:!0,sortBy:"priority",sortOrder:"desc",config:{columns:"auto",gap:16,minItemWidth:200}}},_={args:{items:u,showControls:!0,showFilters:!0,showStats:!0,sortBy:"category",sortOrder:"asc",config:{columns:"auto",gap:16,minItemWidth:200}}},T={args:{items:x,showControls:!1,showFilters:!1,showStats:!1,enableSearch:!1,config:{columns:"auto",gap:16,minItemWidth:200,animationDelay:.08}}},$={args:{items:u,showControls:!0,showFilters:!0,showStats:!0,config:{columns:"auto",gap:16,minItemWidth:200,breakpoints:{1400:6,1200:5,1e3:4,800:3,600:2,400:1}}}},Q={args:{items:x,showControls:!0,showStats:!0,config:{columns:3,gap:32,minItemWidth:200,itemPadding:20}}},U={args:{items:u,showControls:!0,showStats:!0,config:{columns:5,gap:4,minItemWidth:150,itemPadding:8}}},J={args:{items:x,showControls:!0,showStats:!0,config:{columns:3,gap:16,minItemWidth:200,animationDelay:.2}}},X={args:{items:u,showControls:!0,showStats:!0,config:{columns:"auto",gap:16,minItemWidth:200,animationDelay:.01}}},Y={args:{items:u,showControls:!0,showStats:!0,config:{columns:"auto",gap:16,minItemWidth:200,animationDelay:0}}},K={args:{items:u,showControls:!0,showFilters:!0,showStats:!0,enableSearch:!0,config:{columns:"auto",gap:16,minItemWidth:200}}},Z={args:{items:u.filter(c=>c.category==="photos"),showControls:!0,showFilters:!1,showStats:!0,config:{columns:"auto",gap:16,minItemWidth:250,maxItemWidth:350}}},ee={args:{items:u.filter(c=>c.category==="quotes"),showControls:!0,showFilters:!1,showStats:!0,config:{columns:2,gap:20,minItemWidth:300,itemPadding:20}}},se={args:{items:u,showControls:!0,showFilters:!0,showStats:!0,enableVirtualization:!0,enableInfiniteScroll:!0,enableDragReorder:!0,enableSearch:!0,loadingItems:2,config:{columns:"auto",gap:16,minItemWidth:200,maxItemWidth:300,itemPadding:12,autoResize:!0,animationDelay:.05}}},te={args:{items:x,showControls:!0,showStats:!0,loadingItems:6,config:{columns:"auto",gap:16,minItemWidth:200}}},ae={args:{items:[],showControls:!0,showFilters:!0,showStats:!0,enableSearch:!0,config:{columns:"auto",gap:16,minItemWidth:200}}},re={args:{items:x,showControls:!0,showStats:!0,config:{columns:1,gap:16,minItemWidth:400,maxItemWidth:600,itemPadding:20}}},ne={args:{items:he,showControls:!0,showStats:!0,config:{columns:8,gap:8,minItemWidth:120,maxItemWidth:150,itemPadding:8,animationDelay:.01}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
}`,...Q.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
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
}`,...K.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
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
}`,...Z.parameters?.docs?.source}}};ee.parameters={...ee.parameters,docs:{...ee.parameters?.docs,source:{originalSource:`{
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
}`,...ee.parameters?.docs?.source}}};se.parameters={...se.parameters,docs:{...se.parameters?.docs,source:{originalSource:`{
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
}`,...se.parameters?.docs?.source}}};te.parameters={...te.parameters,docs:{...te.parameters?.docs,source:{originalSource:`{
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
}`,...te.parameters?.docs?.source}}};ae.parameters={...ae.parameters,docs:{...ae.parameters?.docs,source:{originalSource:`{
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
}`,...ae.parameters?.docs?.source}}};re.parameters={...re.parameters,docs:{...re.parameters?.docs,source:{originalSource:`{
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
}`,...re.parameters?.docs?.source}}};ne.parameters={...ne.parameters,docs:{...ne.parameters?.docs,source:{originalSource:`{
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
}`,...ne.parameters?.docs?.source}}};const ws=["Default","FixedColumns","DenseLayout","WideLayout","Virtualized","InfiniteScroll","DragAndDrop","FilterableGrid","SortedByHeight","SortedByPriority","SortedByCategory","MinimalInterface","ResponsiveBreakpoints","LargeGaps","SmallGaps","SlowAnimation","FastAnimation","NoAnimation","SearchEnabled","PhotosOnly","QuotesOnly","AllFeatures","LoadingState","EmptyState","SingleColumn","ManyColumns"];export{se as AllFeatures,B as Default,z as DenseLayout,L as DragAndDrop,ae as EmptyState,X as FastAnimation,G as FilterableGrid,R as FixedColumns,H as InfiniteScroll,Q as LargeGaps,te as LoadingState,ne as ManyColumns,T as MinimalInterface,Y as NoAnimation,Z as PhotosOnly,ee as QuotesOnly,$ as ResponsiveBreakpoints,K as SearchEnabled,re as SingleColumn,J as SlowAnimation,U as SmallGaps,_ as SortedByCategory,A as SortedByHeight,E as SortedByPriority,q as Virtualized,O as WideLayout,ws as __namedExportsOrder,ys as default};
