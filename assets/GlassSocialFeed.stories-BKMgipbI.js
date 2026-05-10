import{r as c,b as Te,d,j as s,e as Ce,m as h,c as i}from"./iframe-DinEdlu4.js";import{u as _}from"./a11y-BZVU29oS.js";import{u as Ie}from"./useMotionPreference-Bqsl3944.js";import{c as q}from"./createGlassStyle-BfWnO-qv.js";import{O as be}from"./OptimizedGlassCore-mTd-BSmd.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-8hOeRztp.js";const $={low:{color:"var(--glass-gray-500)",icon:"📊"},medium:{color:"var(--glass-color-success)",icon:"📈"},high:{color:"var(--glass-color-warning)",icon:"🔥"},viral:{color:"var(--glass-color-danger)",icon:"🚀"}},A=c.forwardRef(({posts:o,currentUserId:ke,showInteractions:z=!0,showTimestamps:J=!0,showMedia:Y=!0,showTags:K=!0,compactMode:m=!1,maxHeight:H,infiniteScroll:Q=!1,realTimeUpdates:P=!1,sortBy:D="timestamp",filterBy:B="all",onLike:X,onShare:Z,onComment:ee,onUserClick:se,onPostClick:ae,onLoadMore:L,className:te="",...re},ne)=>{const oe=Te(),[G,ie]=c.useState(new Set),[le,ce]=c.useState(new Set),[de,me]=c.useState(new Set),[R,ue]=c.useState(o);_("glass-social-feed");const F=_("glass-social-sort"),{shouldAnimate:ge}=Ie(),he=e=>ge?e:{duration:0};c.useEffect(()=>{if(!P)return;const e=setInterval(()=>{ue(t=>t.map(a=>({...a,likes:a.likes+(Math.random()<.3?Math.floor(Math.random()*3):0),comments:a.comments+(Math.random()<.2?1:0),shares:a.shares+(Math.random()<.15?1:0)})))},d.DURATION.slower*7);return()=>clearInterval(e)},[P]);const V=c.useMemo(()=>{let e=[...R];switch(B){case"following":e=e.filter(t=>t.author.verified);break;case"liked":e=e.filter(t=>G.has(t.id));break}switch(D){case"likes":e.sort((t,a)=>a.likes-t.likes);break;case"engagement":e.sort((t,a)=>a.likes+a.comments+a.shares-(t.likes+t.comments+t.shares));break;default:e.sort((t,a)=>a.timestamp.getTime()-t.timestamp.getTime())}return e},[R,B,D,G]),fe=e=>{const a=new Date().getTime()-e.getTime(),l=Math.floor(a/6e4),g=Math.floor(a/36e5),u=Math.floor(a/864e5);return l<1?"Just now":l<60?`${l}m`:g<24?`${g}h`:u<7?`${u}d`:e.toLocaleDateString()},pe=e=>{const t=e.likes+e.comments+e.shares;return t>1e3?"viral":t>100?"high":t>10?"medium":"low"},we=e=>{ie(t=>{const a=new Set(t);return a.has(e)?a.delete(e):a.add(e),a}),X?.(e)},xe=e=>{ce(t=>new Set(t).add(e)),Z?.(e)},ve=e=>{me(t=>{const a=new Set(t);return a.has(e)?a.delete(e):a.add(e),a})},ye=({post:e,index:t})=>{const a=de.has(e.id),l=G.has(e.id),g=le.has(e.id),u=pe(e),O=!m&&e.content.length>200;return s.jsxs(h.div,{layout:!0,initial:{opacity:0,y:20},animate:oe?{}:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:he({duration:d.DURATION.normal/1e3,delay:t*.05}),className:"glass-relative glass-p-4 glass-radius-lg glass-cursor-pointer glass-transition-all glass-border glass-border-white/10",style:{...q({variant:"default",radius:"lg"}),transitionDuration:`${d.DURATION.fast}ms`},onClick:()=>ae?.(e.id),children:[s.jsxs("div",{className:"glass-flex glass-items-start glass-space-x-3 glass-mb-3",children:[s.jsxs(h.div,{className:"glass-relative glass-cursor-pointer",onClick:r=>{r.stopPropagation(),se?.(e.author.id)},whileHover:{scale:1.05},whileTap:{scale:.95},children:[s.jsx("div",{className:i("glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-primary glass-font-semibold glass-overflow-hidden",m?"glass-w-8 glass-h-8":"glass-w-12 glass-h-12"),style:q({variant:"default",radius:"full"}),children:e.author.avatar?s.jsx("img",{src:e.author.avatar,alt:e.author.name,className:"glass-w-full glass-h-full glass-radius-full glass-object-cover"}):e.author.name.charAt(0).toUpperCase()}),e.author.verified&&s.jsx("div",{className:"glass-absolute glass-w-4 glass-h-4 glass-surface-primary glass-radius-full glass-flex glass-items-center glass-justify-center",style:{right:-4,bottom:-4},children:s.jsx("span",{className:"glass-text-primary glass-text-xs",children:"✓"})})]}),s.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[s.jsx("h3",{className:i("glass-font-semibold glass-text-primary glass-truncate",m?"glass-text-sm":"glass-text-base"),children:e.author.name}),s.jsxs("span",{className:i("glass-text-secondary",m?"glass-text-xs":"glass-text-sm"),children:["@",e.author.username]}),s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full",style:{backgroundColor:$[u].color},title:`${u} engagement`})]}),J&&s.jsx("p",{className:i("glass-text-tertiary",m?"glass-text-xs":"glass-text-sm"),children:fe(e.timestamp)})]})]}),s.jsxs("div",{className:"glass-mb-3",children:[s.jsxs("p",{className:i("glass-text-primary glass-leading-relaxed",m?"glass-text-sm":"glass-text-base"),children:[O&&!a?`${e.content.slice(0,200)}...`:e.content,O&&s.jsx("button",{onClick:r=>{r.stopPropagation(),ve(e.id)},className:"glass-ml-2 glass-text-primary hover:glass-text-secondary glass-text-sm glass-font-medium glass-focus glass-touch-target glass-contrast-guard",children:a?"Show less":"Show more"})]}),K&&e.tags&&e.tags.length>0&&s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-2 glass-mt-2",children:e.tags.map(r=>s.jsxs("span",{className:"glass-px-2 glass-py-1 glass-text-xs glass-radius-full glass-surface-info glass-text-primary glass-cursor-pointer glass-transition-colors",style:{transitionDuration:`${d.DURATION.fast}ms`},children:["#",r]},r))})]}),Y&&e.media&&e.media.length>0&&s.jsx("div",{className:"glass-mb-3 glass-radius-lg glass-overflow-hidden",children:s.jsx("div",{className:i("glass-grid glass-gap-2",e.media.length===1?"glass-grid-cols-1":"glass-grid-cols-2"),children:e.media.slice(0,4).map((r,W)=>s.jsxs("div",{className:"glass-relative glass-aspect-square glass-surface-subtle/5 glass-radius-lg glass-overflow-hidden",children:[r.type==="image"?s.jsx("img",{src:r.url,alt:r.alt||"Post media",className:"glass-w-full glass-h-full glass-object-cover glass-hover-scale-105",style:{transition:`transform ${d.DURATION.normal}ms ease`}}):r.type==="video"?s.jsx("video",{src:r.url,poster:r.thumbnail,className:"glass-w-full glass-h-full glass-object-cover",controls:!0}):s.jsx("img",{src:r.url,alt:r.alt||"GIF",className:"glass-w-full glass-h-full glass-object-cover"}),e.media&&e.media.length>4&&W===3&&s.jsx("div",{className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center",style:{background:'/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */'},children:s.jsxs("span",{className:"glass-text-primary glass-font-semibold",children:["+",e.media.length-3," more"]})})]},W))})}),z&&s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-pt-3 glass-border-t glass-border-white/10",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-6",children:[s.jsxs(h.button,{onClick:r=>{r.stopPropagation(),we(e.id)},className:i("glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",l?"glass-text-danger":"glass-text-secondary"),style:{transitionDuration:`${d.DURATION.fast}ms`},whileHover:{scale:1.05},whileTap:{scale:.95},children:[s.jsx("span",{children:l?"❤️":"🤍"}),s.jsx("span",{children:e.likes+(l?1:0)})]}),s.jsxs("button",{onClick:r=>{r.stopPropagation(),ee?.(e.id)},className:"glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-text-secondary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",style:{transitionDuration:"200ms"},children:[s.jsx("span",{children:"💬"}),s.jsx("span",{children:e.comments})]}),s.jsxs(h.button,{onClick:r=>{r.stopPropagation(),xe(e.id)},className:i("glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",g?"glass-text-success":"glass-text-secondary"),style:{transitionDuration:`${d.DURATION.fast}ms`},whileHover:{scale:1.05},whileTap:{scale:.95},children:[s.jsx("span",{children:"🔄"}),s.jsx("span",{children:e.shares+(g?1:0)})]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-text-primary-glass-opacity-50",children:[s.jsx("span",{children:$[u].icon}),s.jsx("span",{children:e.likes+e.comments+e.shares})]})]})]})};return s.jsx(be,{ref:ne,variant:"frosted",className:`${te}`,style:{maxHeight:H,overflowY:H?"auto":void 0,overflowX:"hidden"},...re,children:s.jsxs("div",{className:"glass-p-4 glass-space-y-4",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsxs("h2",{className:"glass-text-lg glass-font-semibold glass-text-primary-glass-opacity-90",children:["Social Feed (",V.length,")"]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-text-sm",children:[P&&s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse"}),s.jsx("span",{children:"Live"})]}),s.jsx("label",{htmlFor:F,className:"glass-sr-only",children:"Sort posts by"}),s.jsxs("select",{id:F,value:D,onChange:e=>{},className:"glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius glass-px-2 glass-py-1 glass-text-primary glass-text-sm glass-focus glass-touch-target glass-contrast-guard","aria-label":"Sort posts by",children:[s.jsx("option",{value:"timestamp",children:"Latest"}),s.jsx("option",{value:"likes",children:"Most Liked"}),s.jsx("option",{value:"engagement",children:"Most Engaging"})]})]})]}),s.jsxs("div",{className:i("glass-space-y-4",H&&"glass-overflow-y-auto"),children:[s.jsx(Ce,{children:V.map((e,t)=>s.jsx(ye,{post:e,index:t},e.id))}),Q&&L&&s.jsx(h.button,{onClick:L,className:"glass-w-full glass-p-4 glass-radius-lg glass-text-sm glass-font-medium glass-text-secondary glass-transition-colors glass-border glass-border-white/10 glass-focus glass-touch-target glass-contrast-guard",style:{...q({variant:"default",radius:"lg"}),transitionDuration:"200ms"},whileHover:{scale:1.02},whileTap:{scale:.98},children:"Load More Posts"})]}),V.length===0&&s.jsxs("div",{className:"glass-text-center glass-py-12",children:[s.jsx("div",{className:"glass-text-6xl glass-mb-4",children:"📱"}),s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary-opacity-70 glass-mb-2",children:"No posts to show"}),s.jsx("p",{className:"glass-text-primary-glass-opacity-50",children:B==="liked"?"You haven't liked any posts yet":"Your feed is empty. Try following some users!"})]})]})})});try{A.displayName="GlassSocialFeed",A.__docgenInfo={description:"",displayName:"GlassSocialFeed",props:{posts:{defaultValue:null,description:"",name:"posts",required:!0,type:{name:"SocialPost[]"}},currentUserId:{defaultValue:null,description:"",name:"currentUserId",required:!1,type:{name:"string | undefined"}},showInteractions:{defaultValue:{value:"true"},description:"",name:"showInteractions",required:!1,type:{name:"boolean | undefined"}},showTimestamps:{defaultValue:{value:"true"},description:"",name:"showTimestamps",required:!1,type:{name:"boolean | undefined"}},showMedia:{defaultValue:{value:"true"},description:"",name:"showMedia",required:!1,type:{name:"boolean | undefined"}},showTags:{defaultValue:{value:"true"},description:"",name:"showTags",required:!1,type:{name:"boolean | undefined"}},compactMode:{defaultValue:{value:"false"},description:"",name:"compactMode",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"number | undefined"}},infiniteScroll:{defaultValue:{value:"false"},description:"",name:"infiniteScroll",required:!1,type:{name:"boolean | undefined"}},realTimeUpdates:{defaultValue:{value:"false"},description:"",name:"realTimeUpdates",required:!1,type:{name:"boolean | undefined"}},sortBy:{defaultValue:{value:"timestamp"},description:"",name:"sortBy",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"timestamp"'},{value:'"engagement"'},{value:'"likes"'}]}},filterBy:{defaultValue:{value:"all"},description:"",name:"filterBy",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"all"'},{value:'"following"'},{value:'"liked"'}]}},onLike:{defaultValue:null,description:"",name:"onLike",required:!1,type:{name:"((postId: string) => void) | undefined"}},onShare:{defaultValue:null,description:"",name:"onShare",required:!1,type:{name:"((postId: string) => void) | undefined"}},onComment:{defaultValue:null,description:"",name:"onComment",required:!1,type:{name:"((postId: string) => void) | undefined"}},onUserClick:{defaultValue:null,description:"",name:"onUserClick",required:!1,type:{name:"((userId: string) => void) | undefined"}},onPostClick:{defaultValue:null,description:"",name:"onPostClick",required:!1,type:{name:"((postId: string) => void) | undefined"}},onLoadMore:{defaultValue:null,description:"",name:"onLoadMore",required:!1,type:{name:"(() => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const n=[{id:"1",author:{id:"user1",name:"Alice Johnson",username:"alicej",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",verified:!0},content:"Just shipped a new feature using Glass UI components! The glassmorphism effects look incredible. 🚀✨ #WebDev #GlassUI",timestamp:new Date(Date.now()-1800*1e3),likes:142,shares:23,comments:18,tags:["WebDev","GlassUI","Frontend"],media:[{type:"image",url:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27400%27%20height=%27300%27%20viewBox=%270%200%20400%20300%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20x2=%271%27%20y1=%270%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%230ea5e9%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%230f766e%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27400%27%20height=%27300%27%20rx=%2724%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27320%27%20cy=%2760%27%20r=%2752%27%20fill=%27%23ffffff%27%20opacity=%27.18%27/%3E%3Cpath%20d=%27M40%20235l88-92%2070%2068%2055-42%20107%2066v28H40z%27%20fill=%27%23ffffff%27%20opacity=%27.82%27/%3E%3C/svg%3E",alt:"Glass UI screenshot"}]},{id:"2",author:{id:"user2",name:"Bob Chen",username:"bobdev",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",verified:!1},content:"Working on a new dashboard design. The blur effects and transparency create such a modern feel! What do you think about the color scheme? Should I go with warmer tones or keep it cool? 🎨",timestamp:new Date(Date.now()-7200*1e3),likes:89,shares:12,comments:34,tags:["Design","Dashboard","UI"],media:[{type:"image",url:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27400%27%20height=%27300%27%20viewBox=%270%200%20400%20300%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20x2=%271%27%20y1=%270%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%230ea5e9%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%230f766e%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27400%27%20height=%27300%27%20rx=%2724%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27320%27%20cy=%2760%27%20r=%2752%27%20fill=%27%23ffffff%27%20opacity=%27.18%27/%3E%3Cpath%20d=%27M40%20235l88-92%2070%2068%2055-42%20107%2066v28H40z%27%20fill=%27%23ffffff%27%20opacity=%27.82%27/%3E%3C/svg%3E",alt:"Dashboard mockup"},{type:"image",url:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27400%27%20height=%27300%27%20viewBox=%270%200%20400%20300%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20x2=%271%27%20y1=%270%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%230ea5e9%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%230f766e%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27400%27%20height=%27300%27%20rx=%2724%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27320%27%20cy=%2760%27%20r=%2752%27%20fill=%27%23ffffff%27%20opacity=%27.18%27/%3E%3Cpath%20d=%27M40%20235l88-92%2070%2068%2055-42%20107%2066v28H40z%27%20fill=%27%23ffffff%27%20opacity=%27.82%27/%3E%3C/svg%3E",alt:"Color palette"}]},{id:"3",author:{id:"user3",name:"Carol Martinez",username:"carolcodes",verified:!0},content:"Quick tip: When using glassmorphism, make sure your contrast ratios are still accessible! Beautiful design shouldn't come at the cost of usability. 💡♿ #A11y #DesignTips",timestamp:new Date(Date.now()-14400*1e3),likes:256,shares:89,comments:42,tags:["A11y","DesignTips","Accessibility"]},{id:"4",author:{id:"user4",name:"David Kim",username:"dkim_design",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",verified:!1},content:"New animation preview! 🎬 Created this smooth transition effect for our app's onboarding flow. The combination of glass morphism and micro-interactions creates such an engaging experience.",timestamp:new Date(Date.now()-360*60*1e3),likes:312,shares:56,comments:67,tags:["Animation","Microinteractions","Onboarding"],media:[{type:"image",url:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27400%27%20height=%27300%27%20viewBox=%270%200%20400%20300%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20x2=%271%27%20y1=%270%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%230ea5e9%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%230f766e%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27400%27%20height=%27300%27%20rx=%2724%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27320%27%20cy=%2760%27%20r=%2752%27%20fill=%27%23ffffff%27%20opacity=%27.18%27/%3E%3Cpath%20d=%27M40%20235l88-92%2070%2068%2055-42%20107%2066v28H40z%27%20fill=%27%23ffffff%27%20opacity=%27.82%27/%3E%3C/svg%3E",thumbnail:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27400%27%20height=%27300%27%20viewBox=%270%200%20400%20300%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20x2=%271%27%20y1=%270%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%230ea5e9%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%230f766e%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27400%27%20height=%27300%27%20rx=%2724%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27320%27%20cy=%2760%27%20r=%2752%27%20fill=%27%23ffffff%27%20opacity=%27.18%27/%3E%3Cpath%20d=%27M40%20235l88-92%2070%2068%2055-42%20107%2066v28H40z%27%20fill=%27%23ffffff%27%20opacity=%27.82%27/%3E%3C/svg%3E",alt:"Animation preview"}]},{id:"5",author:{id:"user5",name:"Emma Thompson",username:"emmaux",verified:!0},content:"Just published a comprehensive guide on implementing glassmorphism in React components. Covers everything from basic styling to advanced techniques like backdrop filters and layering. Link in bio! 📖",timestamp:new Date(Date.now()-480*60*1e3),likes:445,shares:127,comments:93,tags:["React","Tutorial","Glassmorphism","Frontend"]},{id:"6",author:{id:"user6",name:"Frank Wilson",username:"frankw",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",verified:!1},content:"Beautiful glass components! 😍 The depth and lighting effects are perfect. How do you handle browser compatibility issues with backdrop-filter?",timestamp:new Date(Date.now()-720*60*1e3),likes:67,shares:8,comments:23,tags:["BrowserSupport","CSS"]}],Pe={title:"Workflows/Glass Social Feed",component:A,parameters:{layout:"fullscreen",previewSurface:"app"},decorators:[o=>s.jsx("div",{className:"glass-flex glass-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-6",style:{boxSizing:"border-box"},children:s.jsx(o,{})})],tags:["autodocs"],argTypes:{sortBy:{control:{type:"select"},options:["timestamp","likes","engagement"]},filterBy:{control:{type:"select"},options:["all","following","liked"]},maxHeight:{control:{type:"range",min:300,max:800,step:50}}}},f={args:{posts:n,currentUserId:"current",maxHeight:720,showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},p={args:{posts:n,currentUserId:"current",maxHeight:720,compactMode:!0,showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!1}},w={args:{posts:n,currentUserId:"current",maxHeight:720,realTimeUpdates:!0,showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},x={args:{posts:n,currentUserId:"current",maxHeight:720,sortBy:"likes",showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},v={args:{posts:n,currentUserId:"current",maxHeight:720,sortBy:"engagement",showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},y={args:{posts:n,currentUserId:"current",maxHeight:500,showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},T={args:{posts:n,currentUserId:"current",maxHeight:720,showMedia:!1,showInteractions:!0,showTimestamps:!0,showTags:!0}},C={args:{posts:n,currentUserId:"current",maxHeight:720,showInteractions:!1,showTimestamps:!0,showMedia:!0,showTags:!0}},I={args:{posts:n.map(o=>({...o,media:void 0})),currentUserId:"current",maxHeight:720,showInteractions:!0,showTimestamps:!0,showMedia:!1,showTags:!0}},b={args:{posts:n.filter(o=>o.author.verified),currentUserId:"current",maxHeight:720,showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},k={args:{posts:n.filter(o=>o.likes+o.comments+o.shares>200),currentUserId:"current",maxHeight:720,sortBy:"engagement",showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},E={args:{posts:n.filter(o=>Date.now()-o.timestamp.getTime()<14400*1e3),currentUserId:"current",maxHeight:720,sortBy:"timestamp",showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},j={args:{posts:n,currentUserId:"current",infiniteScroll:!0,maxHeight:600,showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},M={args:{posts:n,currentUserId:"current",maxHeight:720,compactMode:!0,showInteractions:!1,showTimestamps:!1,showMedia:!1,showTags:!1}},N={args:{posts:[],currentUserId:"current",maxHeight:720,showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},S={args:{posts:[n[0]],currentUserId:"current",maxHeight:720,showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},U={args:{posts:[{...n[1],content:`This is a much longer post to demonstrate how the feed handles extended content. 
        
        When users write longer posts, we automatically truncate them and provide an option to expand. This keeps the feed clean while still allowing for detailed content when needed.
        
        The glass morphism effects work beautifully with longer content too, creating a cohesive visual experience throughout the entire feed. The backdrop blur and transparency effects help maintain readability even with complex layouts.
        
        We also handle various media types including images, videos, and GIFs. The grid layout automatically adjusts based on the number of media items, and we show a preview indicator when there are more than 4 items.`}],currentUserId:"current",maxHeight:720,showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    maxHeight: 720,
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...f.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    maxHeight: 720,
    compactMode: true,
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: false
  }
}`,...p.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    maxHeight: 720,
    realTimeUpdates: true,
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...w.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    maxHeight: 720,
    sortBy: 'likes',
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...x.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    maxHeight: 720,
    sortBy: 'engagement',
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...v.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    maxHeight: 500,
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...y.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    maxHeight: 720,
    showMedia: false,
    showInteractions: true,
    showTimestamps: true,
    showTags: true
  }
}`,...T.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    maxHeight: 720,
    showInteractions: false,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...C.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts.map(post => ({
      ...post,
      media: undefined
    })),
    currentUserId: 'current',
    maxHeight: 720,
    showInteractions: true,
    showTimestamps: true,
    showMedia: false,
    showTags: true
  }
}`,...I.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts.filter(post => post.author.verified),
    currentUserId: 'current',
    maxHeight: 720,
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...b.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts.filter(post => post.likes + post.comments + post.shares > 200),
    currentUserId: 'current',
    maxHeight: 720,
    sortBy: 'engagement',
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...k.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts.filter(post => Date.now() - post.timestamp.getTime() < 4 * 60 * 60 * 1000),
    currentUserId: 'current',
    maxHeight: 720,
    sortBy: 'timestamp',
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...E.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    infiniteScroll: true,
    maxHeight: 600,
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...j.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    maxHeight: 720,
    compactMode: true,
    showInteractions: false,
    showTimestamps: false,
    showMedia: false,
    showTags: false
  }
}`,...M.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    posts: [],
    currentUserId: 'current',
    maxHeight: 720,
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...N.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    posts: [mockPosts[0]],
    currentUserId: 'current',
    maxHeight: 720,
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...S.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    posts: [{
      ...mockPosts[1],
      content: \`This is a much longer post to demonstrate how the feed handles extended content. 
        
        When users write longer posts, we automatically truncate them and provide an option to expand. This keeps the feed clean while still allowing for detailed content when needed.
        
        The glass morphism effects work beautifully with longer content too, creating a cohesive visual experience throughout the entire feed. The backdrop blur and transparency effects help maintain readability even with complex layouts.
        
        We also handle various media types including images, videos, and GIFs. The grid layout automatically adjusts based on the number of media items, and we show a preview indicator when there are more than 4 items.\`
    }],
    currentUserId: 'current',
    maxHeight: 720,
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...U.parameters?.docs?.source}}};const De=["Default","CompactMode","RealTimeUpdates","SortByLikes","SortByEngagement","LimitedHeight","NoMedia","NoInteractions","TextOnly","VerifiedUsers","HighEngagement","RecentPosts","WithInfiniteScroll","MinimalView","EmptyFeed","SinglePost","LongContent"];export{p as CompactMode,f as Default,N as EmptyFeed,k as HighEngagement,y as LimitedHeight,U as LongContent,M as MinimalView,C as NoInteractions,T as NoMedia,w as RealTimeUpdates,E as RecentPosts,S as SinglePost,v as SortByEngagement,x as SortByLikes,I as TextOnly,b as VerifiedUsers,j as WithInfiniteScroll,De as __namedExportsOrder,Pe as default};
