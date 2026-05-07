import{r as l,b as ye,d as c,j as s,e as Te,m as h}from"./iframe-B2YkWo0R.js";import{u as O}from"./a11y-Bb31ansd.js";import{u as Ce}from"./useMotionPreference-BhtD6cPl.js";import{c as V}from"./createGlassStyle-BfWnO-qv.js";import{O as be}from"./OptimizedGlassCore-CYII0g9k.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-DmRU0S_3.js";const W={low:{color:"var(--glass-gray-500)",icon:"📊"},medium:{color:"var(--glass-color-success)",icon:"📈"},high:{color:"var(--glass-color-warning)",icon:"🔥"},viral:{color:"var(--glass-color-danger)",icon:"🚀"}},$=l.forwardRef(({posts:o,currentUserId:Ie,showInteractions:_=!0,showTimestamps:z=!0,showMedia:J=!0,showTags:Y=!0,compactMode:d=!1,maxHeight:q,infiniteScroll:K=!1,realTimeUpdates:U=!1,sortBy:P="timestamp",filterBy:D="all",onLike:Q,onShare:X,onComment:Z,onUserClick:ee,onPostClick:se,onLoadMore:A,className:te="",...ae},re)=>{const ne=ye(),[B,oe]=l.useState(new Set),[ie,le]=l.useState(new Set),[ce,de]=l.useState(new Set),[H,ue]=l.useState(o);O("glass-social-feed");const L=O("glass-social-sort"),{shouldAnimate:me}=Ce(),he=e=>me?e:{duration:0};l.useEffect(()=>{if(!U)return;const e=setInterval(()=>{ue(a=>a.map(t=>({...t,likes:t.likes+(Math.random()<.3?Math.floor(Math.random()*3):0),comments:t.comments+(Math.random()<.2?1:0),shares:t.shares+(Math.random()<.15?1:0)})))},c.DURATION.slower*7);return()=>clearInterval(e)},[U]);const G=l.useMemo(()=>{let e=[...H];switch(D){case"following":e=e.filter(a=>a.author.verified);break;case"liked":e=e.filter(a=>B.has(a.id));break}switch(P){case"likes":e.sort((a,t)=>t.likes-a.likes);break;case"engagement":e.sort((a,t)=>t.likes+t.comments+t.shares-(a.likes+a.comments+a.shares));break;default:e.sort((a,t)=>t.timestamp.getTime()-a.timestamp.getTime())}return e},[H,D,P,B]),ge=e=>{const t=new Date().getTime()-e.getTime(),i=Math.floor(t/6e4),m=Math.floor(t/36e5),u=Math.floor(t/864e5);return i<1?"Just now":i<60?`${i}m`:m<24?`${m}h`:u<7?`${u}d`:e.toLocaleDateString()},fe=e=>{const a=e.likes+e.comments+e.shares;return a>1e3?"viral":a>100?"high":a>10?"medium":"low"},pe=e=>{oe(a=>{const t=new Set(a);return t.has(e)?t.delete(e):t.add(e),t}),Q?.(e)},we=e=>{le(a=>new Set(a).add(e)),X?.(e)},xe=e=>{de(a=>{const t=new Set(a);return t.has(e)?t.delete(e):t.add(e),t})},ve=({post:e,index:a})=>{const t=ce.has(e.id),i=B.has(e.id),m=ie.has(e.id),u=fe(e),R=!d&&e.content.length>200;return s.jsxs(h.div,{layout:!0,initial:{opacity:0,y:20},animate:ne?{}:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:he({duration:c.DURATION.normal/1e3,delay:a*.05}),className:`
            relative p-4 rounded-lg cursor-pointer transition-all duration-[${c.DURATION.fast}ms]
            ${V({variant:"default"})}
            hover:bg-white/5 border border-white/10
          `,onClick:()=>se?.(e.id),children:[s.jsxs("div",{className:"glass-flex glass-items-start glass-space-x-3 glass-mb-3",children:[s.jsxs(h.div,{className:"glass-relative glass-cursor-pointer",onClick:r=>{r.stopPropagation(),ee?.(e.author.id)},whileHover:{scale:1.05},whileTap:{scale:.95},children:[s.jsx("div",{className:`
                ${d?"w-8 h-8":"w-12 h-12"}
                rounded-full bg-gradient-to-br from-gray-300 to-gray-500
                flex items-center justify-center text-white font-semibold
                ${V({variant:"default"})}
              `,children:e.author.avatar?s.jsx("img",{src:e.author.avatar,alt:e.author.name,className:"glass-w-full glass-h-full glass-radius-full glass-object-cover"}):e.author.name.charAt(0).toUpperCase()}),e.author.verified&&s.jsx("div",{className:"glass-absolute glass--glass-bottom-1 glass--right-1 glass-w-4 glass-h-4 glass-surface-blue glass-radius-full glass-flex glass-items-center glass-justify-center",children:s.jsx("span",{className:"glass-text-primary glass-text-xs",children:"✓"})})]}),s.jsxs("div",{className:"glass-flex-1 glass-min-glass-w-0",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[s.jsx("h3",{className:`
                  font-semibold text-white/90 truncate
                  ${d?"text-sm":"text-base"}
                `,children:e.author.name}),s.jsxs("span",{className:`
                  text-white/60
                  ${d?"text-xs":"text-sm"}
                `,children:["@",e.author.username]}),s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full",style:{backgroundColor:W[u].color},title:`${u} engagement`})]}),z&&s.jsx("p",{className:`
                  text-white/50
                  ${d?"text-xs":"text-sm"}
                `,children:ge(e.timestamp)})]})]}),s.jsxs("div",{className:"glass-mb-3",children:[s.jsxs("p",{className:`
              text-white/90 leading-relaxed
              ${d?"text-sm":"text-base"}
            `,children:[R&&!t?`${e.content.slice(0,200)}...`:e.content,R&&s.jsx("button",{onClick:r=>{r.stopPropagation(),xe(e.id)},className:"glass-ml-2 glass-text-primary hover:glass-text-secondary glass-text-sm glass-font-medium glass-focus glass-touch-target glass-contrast-guard",children:t?"Show less":"Show more"})]}),Y&&e.tags&&e.tags.length>0&&s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-2 glass-mt-2",children:e.tags.map(r=>s.jsxs("span",{className:`
                      px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 
                      hover:bg-blue-500/30 cursor-pointer transition-colors duration-[${c.DURATION.fast}ms]
                    `,children:["#",r]},r))})]}),J&&e.media&&e.media.length>0&&s.jsx("div",{className:"glass-mb-3 glass-radius-lg glass-overflow-hidden",children:s.jsx("div",{className:`
                grid gap-2
                ${e.media.length===1?"grid-cols-1":"grid-cols-2"}
              `,children:e.media.slice(0,4).map((r,F)=>s.jsxs("div",{className:"glass-relative glass-aspect-square glass-surface-subtle/5 glass-radius-lg glass-overflow-hidden",children:[r.type==="image"?s.jsx("img",{src:r.url,alt:r.alt||"Post media",className:`glass-w-full glass-h-full glass-object-cover glass-hover-scale-105 glass-transition-transform glass-duration-[${c.DURATION.normal}ms]`}):r.type==="video"?s.jsx("video",{src:r.url,poster:r.thumbnail,className:"glass-w-full glass-h-full glass-object-cover",controls:!0}):s.jsx("img",{src:r.url,alt:r.alt||"GIF",className:"glass-w-full glass-h-full glass-object-cover"}),e.media&&e.media.length>4&&F===3&&s.jsx("div",{className:"glass-absolute glass-inset-0 glass-surface-dark/60 glass-flex glass-items-center glass-justify-center",children:s.jsxs("span",{className:"glass-text-primary glass-font-semibold",children:["+",e.media.length-3," more"]})})]},F))})}),_&&s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-pt-3 glass-border-t glass-border-white/10",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-6",children:[s.jsxs(h.button,{onClick:r=>{r.stopPropagation(),pe(e.id)},className:`
                    flex items-center space-x-2 text-sm transition-colors duration-[${c.DURATION.fast}ms]
                    ${i?"text-red-400":"text-white/60 hover:text-red-400"}
                  `,whileHover:{scale:1.05},whileTap:{scale:.95},children:[s.jsx("span",{children:i?"❤️":"🤍"}),s.jsx("span",{children:e.likes+(i?1:0)})]}),s.jsxs("button",{onClick:r=>{r.stopPropagation(),Z?.(e.id)},className:"glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-text-primary-glass-opacity-60 hover:glass-text-primary glass-transition-colors glass-duration-200 glass-focus glass-touch-target glass-contrast-guard",children:[s.jsx("span",{children:"💬"}),s.jsx("span",{children:e.comments})]}),s.jsxs(h.button,{onClick:r=>{r.stopPropagation(),we(e.id)},className:`
                    flex items-center space-x-2 text-sm transition-colors duration-[${c.DURATION.fast}ms]
                    ${m?"text-green-400":"text-white/60 hover:text-green-400"}
                  `,whileHover:{scale:1.05},whileTap:{scale:.95},children:[s.jsx("span",{children:"🔄"}),s.jsx("span",{children:e.shares+(m?1:0)})]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-text-primary-glass-opacity-50",children:[s.jsx("span",{children:W[u].icon}),s.jsx("span",{children:e.likes+e.comments+e.shares})]})]})]})};return s.jsx(be,{ref:re,variant:"frosted",className:`${te}`,style:{maxHeight:q},...ae,children:s.jsxs("div",{className:"glass-p-4 glass-space-y-4",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsxs("h2",{className:"glass-text-lg glass-font-semibold glass-text-primary-glass-opacity-90",children:["Social Feed (",G.length,")"]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-text-sm",children:[U&&s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),s.jsx("span",{children:"Live"})]}),s.jsx("label",{htmlFor:L,className:"glass-sr-only",children:"Sort posts by"}),s.jsxs("select",{id:L,value:P,onChange:e=>{},className:"glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius glass-px-2 glass-py-1 glass-text-primary glass-text-sm glass-focus glass-touch-target glass-contrast-guard","aria-label":"Sort posts by",children:[s.jsx("option",{value:"timestamp",children:"Latest"}),s.jsx("option",{value:"likes",children:"Most Liked"}),s.jsx("option",{value:"engagement",children:"Most Engaging"})]})]})]}),s.jsxs("div",{className:`
              space-y-4 
              ${q?"overflow-y-auto":""}
            `,children:[s.jsx(Te,{children:G.map((e,a)=>s.jsx(ve,{post:e,index:a},e.id))}),K&&A&&s.jsx(h.button,{onClick:A,className:`
                  w-full p-4 rounded-lg text-sm font-medium text-white/70 
                  hover:text-white hover:bg-white/5 transition-colors duration-200
                  ${V({variant:"default"})}
                  border border-white/10
                `,whileHover:{scale:1.02},whileTap:{scale:.98},children:"Load More Posts"})]}),G.length===0&&s.jsxs("div",{className:"glass-text-center glass-py-12",children:[s.jsx("div",{className:"glass-text-6xl glass-mb-4",children:"📱"}),s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary-opacity-70 glass-mb-2",children:"No posts to show"}),s.jsx("p",{className:"glass-text-primary-glass-opacity-50",children:D==="liked"?"You haven't liked any posts yet":"Your feed is empty. Try following some users!"})]})]})})});try{$.displayName="GlassSocialFeed",$.__docgenInfo={description:"",displayName:"GlassSocialFeed",props:{posts:{defaultValue:null,description:"",name:"posts",required:!0,type:{name:"SocialPost[]"}},currentUserId:{defaultValue:null,description:"",name:"currentUserId",required:!1,type:{name:"string | undefined"}},showInteractions:{defaultValue:{value:"true"},description:"",name:"showInteractions",required:!1,type:{name:"boolean | undefined"}},showTimestamps:{defaultValue:{value:"true"},description:"",name:"showTimestamps",required:!1,type:{name:"boolean | undefined"}},showMedia:{defaultValue:{value:"true"},description:"",name:"showMedia",required:!1,type:{name:"boolean | undefined"}},showTags:{defaultValue:{value:"true"},description:"",name:"showTags",required:!1,type:{name:"boolean | undefined"}},compactMode:{defaultValue:{value:"false"},description:"",name:"compactMode",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"number | undefined"}},infiniteScroll:{defaultValue:{value:"false"},description:"",name:"infiniteScroll",required:!1,type:{name:"boolean | undefined"}},realTimeUpdates:{defaultValue:{value:"false"},description:"",name:"realTimeUpdates",required:!1,type:{name:"boolean | undefined"}},sortBy:{defaultValue:{value:"timestamp"},description:"",name:"sortBy",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"engagement"'},{value:'"timestamp"'},{value:'"likes"'}]}},filterBy:{defaultValue:{value:"all"},description:"",name:"filterBy",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"all"'},{value:'"following"'},{value:'"liked"'}]}},onLike:{defaultValue:null,description:"",name:"onLike",required:!1,type:{name:"((postId: string) => void) | undefined"}},onShare:{defaultValue:null,description:"",name:"onShare",required:!1,type:{name:"((postId: string) => void) | undefined"}},onComment:{defaultValue:null,description:"",name:"onComment",required:!1,type:{name:"((postId: string) => void) | undefined"}},onUserClick:{defaultValue:null,description:"",name:"onUserClick",required:!1,type:{name:"((userId: string) => void) | undefined"}},onPostClick:{defaultValue:null,description:"",name:"onPostClick",required:!1,type:{name:"((postId: string) => void) | undefined"}},onLoadMore:{defaultValue:null,description:"",name:"onLoadMore",required:!1,type:{name:"(() => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const n=[{id:"1",author:{id:"user1",name:"Alice Johnson",username:"alicej",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",verified:!0},content:"Just shipped a new feature using Glass UI components! The glassmorphism effects look incredible. 🚀✨ #WebDev #GlassUI",timestamp:new Date(Date.now()-1800*1e3),likes:142,shares:23,comments:18,tags:["WebDev","GlassUI","Frontend"],media:[{type:"image",url:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27400%27%20height=%27300%27%20viewBox=%270%200%20400%20300%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20x2=%271%27%20y1=%270%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%230ea5e9%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%230f766e%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27400%27%20height=%27300%27%20rx=%2724%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27320%27%20cy=%2760%27%20r=%2752%27%20fill=%27%23ffffff%27%20opacity=%27.18%27/%3E%3Cpath%20d=%27M40%20235l88-92%2070%2068%2055-42%20107%2066v28H40z%27%20fill=%27%23ffffff%27%20opacity=%27.82%27/%3E%3C/svg%3E",alt:"Glass UI screenshot"}]},{id:"2",author:{id:"user2",name:"Bob Chen",username:"bobdev",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",verified:!1},content:"Working on a new dashboard design. The blur effects and transparency create such a modern feel! What do you think about the color scheme? Should I go with warmer tones or keep it cool? 🎨",timestamp:new Date(Date.now()-7200*1e3),likes:89,shares:12,comments:34,tags:["Design","Dashboard","UI"],media:[{type:"image",url:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27400%27%20height=%27300%27%20viewBox=%270%200%20400%20300%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20x2=%271%27%20y1=%270%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%230ea5e9%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%230f766e%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27400%27%20height=%27300%27%20rx=%2724%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27320%27%20cy=%2760%27%20r=%2752%27%20fill=%27%23ffffff%27%20opacity=%27.18%27/%3E%3Cpath%20d=%27M40%20235l88-92%2070%2068%2055-42%20107%2066v28H40z%27%20fill=%27%23ffffff%27%20opacity=%27.82%27/%3E%3C/svg%3E",alt:"Dashboard mockup"},{type:"image",url:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27400%27%20height=%27300%27%20viewBox=%270%200%20400%20300%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20x2=%271%27%20y1=%270%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%230ea5e9%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%230f766e%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27400%27%20height=%27300%27%20rx=%2724%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27320%27%20cy=%2760%27%20r=%2752%27%20fill=%27%23ffffff%27%20opacity=%27.18%27/%3E%3Cpath%20d=%27M40%20235l88-92%2070%2068%2055-42%20107%2066v28H40z%27%20fill=%27%23ffffff%27%20opacity=%27.82%27/%3E%3C/svg%3E",alt:"Color palette"}]},{id:"3",author:{id:"user3",name:"Carol Martinez",username:"carolcodes",verified:!0},content:"Quick tip: When using glassmorphism, make sure your contrast ratios are still accessible! Beautiful design shouldn't come at the cost of usability. 💡♿ #A11y #DesignTips",timestamp:new Date(Date.now()-14400*1e3),likes:256,shares:89,comments:42,tags:["A11y","DesignTips","Accessibility"]},{id:"4",author:{id:"user4",name:"David Kim",username:"dkim_design",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",verified:!1},content:"New animation preview! 🎬 Created this smooth transition effect for our app's onboarding flow. The combination of glass morphism and micro-interactions creates such an engaging experience.",timestamp:new Date(Date.now()-360*60*1e3),likes:312,shares:56,comments:67,tags:["Animation","Microinteractions","Onboarding"],media:[{type:"image",url:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27400%27%20height=%27300%27%20viewBox=%270%200%20400%20300%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20x2=%271%27%20y1=%270%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%230ea5e9%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%230f766e%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27400%27%20height=%27300%27%20rx=%2724%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27320%27%20cy=%2760%27%20r=%2752%27%20fill=%27%23ffffff%27%20opacity=%27.18%27/%3E%3Cpath%20d=%27M40%20235l88-92%2070%2068%2055-42%20107%2066v28H40z%27%20fill=%27%23ffffff%27%20opacity=%27.82%27/%3E%3C/svg%3E",thumbnail:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27400%27%20height=%27300%27%20viewBox=%270%200%20400%20300%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20x2=%271%27%20y1=%270%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%230ea5e9%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%230f766e%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27400%27%20height=%27300%27%20rx=%2724%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27320%27%20cy=%2760%27%20r=%2752%27%20fill=%27%23ffffff%27%20opacity=%27.18%27/%3E%3Cpath%20d=%27M40%20235l88-92%2070%2068%2055-42%20107%2066v28H40z%27%20fill=%27%23ffffff%27%20opacity=%27.82%27/%3E%3C/svg%3E",alt:"Animation preview"}]},{id:"5",author:{id:"user5",name:"Emma Thompson",username:"emmaux",verified:!0},content:"Just published a comprehensive guide on implementing glassmorphism in React components. Covers everything from basic styling to advanced techniques like backdrop filters and layering. Link in bio! 📖",timestamp:new Date(Date.now()-480*60*1e3),likes:445,shares:127,comments:93,tags:["React","Tutorial","Glassmorphism","Frontend"]},{id:"6",author:{id:"user6",name:"Frank Wilson",username:"frankw",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",verified:!1},content:"Beautiful glass components! 😍 The depth and lighting effects are perfect. How do you handle browser compatibility issues with backdrop-filter?",timestamp:new Date(Date.now()-720*60*1e3),likes:67,shares:8,comments:23,tags:["BrowserSupport","CSS"]}],Pe={title:"Workflows/Glass Social Feed",component:$,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{sortBy:{control:{type:"select"},options:["timestamp","likes","engagement"]},filterBy:{control:{type:"select"},options:["all","following","liked"]},maxHeight:{control:{type:"range",min:300,max:800,step:50}}}},g={args:{posts:n,currentUserId:"current",showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},f={args:{posts:n,currentUserId:"current",compactMode:!0,showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!1}},p={args:{posts:n,currentUserId:"current",realTimeUpdates:!0,showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},w={args:{posts:n,currentUserId:"current",sortBy:"likes",showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},x={args:{posts:n,currentUserId:"current",sortBy:"engagement",showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},v={args:{posts:n,currentUserId:"current",maxHeight:500,showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},y={args:{posts:n,currentUserId:"current",showMedia:!1,showInteractions:!0,showTimestamps:!0,showTags:!0}},T={args:{posts:n,currentUserId:"current",showInteractions:!1,showTimestamps:!0,showMedia:!0,showTags:!0}},C={args:{posts:n.map(o=>({...o,media:void 0})),currentUserId:"current",showInteractions:!0,showTimestamps:!0,showMedia:!1,showTags:!0}},b={args:{posts:n.filter(o=>o.author.verified),currentUserId:"current",showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},I={args:{posts:n.filter(o=>o.likes+o.comments+o.shares>200),currentUserId:"current",sortBy:"engagement",showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},k={args:{posts:n.filter(o=>Date.now()-o.timestamp.getTime()<14400*1e3),currentUserId:"current",sortBy:"timestamp",showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},E={args:{posts:n,currentUserId:"current",infiniteScroll:!0,maxHeight:600,showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},j={args:{posts:n,currentUserId:"current",compactMode:!0,showInteractions:!1,showTimestamps:!1,showMedia:!1,showTags:!1}},M={args:{posts:[],currentUserId:"current",showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},N={args:{posts:[n[0]],currentUserId:"current",showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}},S={args:{posts:[{...n[1],content:`This is a much longer post to demonstrate how the feed handles extended content. 
        
        When users write longer posts, we automatically truncate them and provide an option to expand. This keeps the feed clean while still allowing for detailed content when needed.
        
        The glass morphism effects work beautifully with longer content too, creating a cohesive visual experience throughout the entire feed. The backdrop blur and transparency effects help maintain readability even with complex layouts.
        
        We also handle various media types including images, videos, and GIFs. The grid layout automatically adjusts based on the number of media items, and we show a preview indicator when there are more than 4 items.`}],currentUserId:"current",showInteractions:!0,showTimestamps:!0,showMedia:!0,showTags:!0}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...g.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    compactMode: true,
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: false
  }
}`,...f.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    realTimeUpdates: true,
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...p.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    sortBy: 'likes',
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...w.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    sortBy: 'engagement',
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...x.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    maxHeight: 500,
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...v.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    showMedia: false,
    showInteractions: true,
    showTimestamps: true,
    showTags: true
  }
}`,...y.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    showInteractions: false,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...T.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts.map(post => ({
      ...post,
      media: undefined
    })),
    currentUserId: 'current',
    showInteractions: true,
    showTimestamps: true,
    showMedia: false,
    showTags: true
  }
}`,...C.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts.filter(post => post.author.verified),
    currentUserId: 'current',
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...b.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts.filter(post => post.likes + post.comments + post.shares > 200),
    currentUserId: 'current',
    sortBy: 'engagement',
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...I.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts.filter(post => Date.now() - post.timestamp.getTime() < 4 * 60 * 60 * 1000),
    currentUserId: 'current',
    sortBy: 'timestamp',
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...k.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    posts: mockPosts,
    currentUserId: 'current',
    compactMode: true,
    showInteractions: false,
    showTimestamps: false,
    showMedia: false,
    showTags: false
  }
}`,...j.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    posts: [],
    currentUserId: 'current',
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...M.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    posts: [mockPosts[0]],
    currentUserId: 'current',
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...N.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    posts: [{
      ...mockPosts[1],
      content: \`This is a much longer post to demonstrate how the feed handles extended content. 
        
        When users write longer posts, we automatically truncate them and provide an option to expand. This keeps the feed clean while still allowing for detailed content when needed.
        
        The glass morphism effects work beautifully with longer content too, creating a cohesive visual experience throughout the entire feed. The backdrop blur and transparency effects help maintain readability even with complex layouts.
        
        We also handle various media types including images, videos, and GIFs. The grid layout automatically adjusts based on the number of media items, and we show a preview indicator when there are more than 4 items.\`
    }],
    currentUserId: 'current',
    showInteractions: true,
    showTimestamps: true,
    showMedia: true,
    showTags: true
  }
}`,...S.parameters?.docs?.source}}};const De=["Default","CompactMode","RealTimeUpdates","SortByLikes","SortByEngagement","LimitedHeight","NoMedia","NoInteractions","TextOnly","VerifiedUsers","HighEngagement","RecentPosts","WithInfiniteScroll","MinimalView","EmptyFeed","SinglePost","LongContent"];export{f as CompactMode,g as Default,M as EmptyFeed,I as HighEngagement,v as LimitedHeight,S as LongContent,j as MinimalView,T as NoInteractions,y as NoMedia,p as RealTimeUpdates,k as RecentPosts,N as SinglePost,x as SortByEngagement,w as SortByLikes,C as TextOnly,b as VerifiedUsers,E as WithInfiniteScroll,De as __namedExportsOrder,Pe as default};
