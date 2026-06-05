import{r as N,c as k,j as s,C as u,d as A,R as q}from"./iframe-DBNhMyqR.js";import{f as D}from"./index-CLSxArU-.js";import{G as m}from"./GlassButton-DrQCiHsr.js";import{O as _}from"./OptimizedGlassCore-DUu6GVWj.js";import{M as O}from"./MotionFramer-BEm296yJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";import"./LiquidGlassMaterial-DU2fkJY_.js";import"./LiquidGlassLayerProvider-BIZ5pcBB.js";import"./a11y-BSdOe7Q0.js";import"./GlassPredictiveEngine-ByAfKOZ2.js";import"./GlassAchievementSystem-ijsi_Ncd.js";import"./GlassBiometricAdaptation-B8TpL5FZ.js";import"./MotionPreferenceContext-D5i-k5Lj.js";import"./GlassEyeTracking-iRWOe25K.js";import"./GlassSpatialAudio-g_v8UQSM.js";import"./deviceCapabilities-pg7tQO9x.js";import"./utilsCore-SpUZHZAH.js";const I=N.createContext(void 0),p=()=>{const e=N.useContext(I);return e||{notifications:[],addNotification:()=>{},removeNotification:()=>{},clearAll:()=>{}}},h=({children:e})=>{const[t,n]=N.useState([]),r=o=>{const g=Date.now().toString()+Math.random().toString(36).substr(2,9),c={...o,id:g};if(n(f=>[c,...f]),!c.persistent){const f=c.duration||A.DURATION.slower*5;setTimeout(()=>{i(g)},f)}},i=o=>{n(g=>g.filter(c=>c.id!==o))},a=()=>{n([])};return s.jsx(I.Provider,{"data-glass-component":!0,value:{notifications:t,addNotification:r,removeNotification:i,clearAll:a},children:e})},d=N.forwardRef(({position:e="top-right",maxNotifications:t=5,autoHideDelay:n=A.DURATION.slower*5,animation:r="slide",showClearAll:i=!0,className:a,...o},g)=>{const{notifications:c,removeNotification:f,clearAll:R}=p(),z={"top-right":"top-4 right-4","top-left":"top-4 left-4","bottom-right":"bottom-4 right-4","bottom-left":"bottom-4 left-4","top-center":"top-4 left-1/2 transform -translate-x-1/2","bottom-center":"bottom-4 left-1/2 transform -translate-x-1/2"},S=c.slice(0,t),E=l=>{switch(l){case"success":return{icon:"✓",bgClass:"glass-border-green-500/20 bg-green-500/10",iconClass:"text-green-400"};case"error":return{icon:"✕",bgClass:"glass-border-red-500/20 bg-red-500/10",iconClass:"text-red-400"};case"warning":return{icon:"⚠",bgClass:"glass-border-yellow-500/20 bg-yellow-500/10",iconClass:"text-yellow-400"};default:return{icon:"ℹ",bgClass:"glass-border-blue-500/20 bg-blue-500/10",iconClass:"text-blue-400"}}},T=k("fixed z-50 glass-gap-2",z[e],a);return S.length===0?s.jsx("div",{ref:g,className:T,"aria-live":"polite","data-empty":!0,...o,children:s.jsx("span",{className:"glass-sr-only",children:"No notifications"})}):s.jsxs("div",{ref:g,className:T,"aria-live":"polite",...o,children:[i&&c.length>1&&s.jsx(_,{elevation:"level1",intensity:"medium",depth:1,tint:"neutral",border:"subtle",animation:"none",performanceMode:"low",className:"glass-px-3 glass-py-1 glass-radius-full glass-text-xs glass-cursor-pointer hover:glass-surface-subtle/10 glass-transition-colors",onClick:R,children:s.jsxs(u,{children:["Clear All (",c.length,")"]})}),S.map((l,M)=>{const j=E(l.type);return s.jsx(O,{delay:M*100,children:s.jsxs(_,{elevation:"level2",intensity:"medium",depth:2,tint:"neutral",border:"subtle",animation:"none",performanceMode:"medium",className:k("min-w-80 max-w-sm glass-p-4 glass-radius-lg glass-border glass-backdrop-blur-md",j.bgClass),children:[s.jsxs("div",{className:"glass-flex glass-items-start glass-gap-3",children:[s.jsx("div",{className:`glass-flex-shrink-0 glass-w-6 glass-h-6 glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-sm glass-font-bold ${j.iconClass}`,children:j.icon}),s.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[s.jsx(u,{children:s.jsx("h4",{className:"glass-text-sm glass-font-semibold glass-text-primary",children:l.title})}),l.message&&s.jsx(u,{children:s.jsx("p",{className:"glass-mt-1 glass-text-sm glass-text-primary-glass-opacity-80",children:l.message})}),l.action&&s.jsx(u,{children:s.jsx("button",{onClick:l.action.onClick,className:"glass-mt-2 glass-text-sm glass-font-medium glass-text-primary hover:glass-text-secondary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:l.action.label})})]}),s.jsx("button",{onClick:F=>f(l.id),className:"glass-flex-shrink-0 glass-w-5 glass-h-5 glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-primary-glass-opacity-60 hover:glass-text-primary-glass-opacity-90 hover:glass-surface-subtle/10 glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"✕"})]}),!l.persistent&&l.duration&&s.jsx("div",{className:"glass-mt-3 glass-h-1 glass-surface-subtle/20 glass-radius-full glass-overflow-hidden",children:s.jsx("div",{className:`glass-h-full glass-surface-subtle/40 glass-radius-full glass-transition-all glass-duration-[${A.DURATION.fast/6}ms] glass-ease-linear`,style:{animation:`shrink ${l.duration}ms linear forwards`}})})]})},l.id)})]})});d.displayName="GlassNotificationCenter";const G=N.forwardRef(({notification:e,onClose:t,className:n,...r},i)=>{const a=V(e.type);return s.jsx(_,{ref:i,elevation:"level1",intensity:"medium",depth:2,tint:"neutral",border:"subtle",animation:"none",performanceMode:"medium",className:k("glass-p-4 glass-radius-lg glass-border",a.bgClass,n),...r,children:s.jsxs("div",{className:"glass-flex glass-items-start glass-gap-3",children:[s.jsx("div",{className:`glass-w-6 glass-h-6 glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-sm ${a.iconClass}`,children:a.icon}),s.jsxs("div",{className:"glass-flex-1",children:[s.jsx(u,{children:s.jsx("h4",{className:"glass-font-semibold",children:e.title})}),e.message&&s.jsx(u,{children:s.jsx("p",{className:"glass-text-sm glass-opacity-80",children:e.message})})]}),s.jsx("button",{onClick:t,className:"glass-contrast-guard glass-focus glass-touch-target hover:glass-text-primary glass-text-primary-glass-opacity-60",children:"✕"})]})})});G.displayName="GlassNotificationItem";const V=e=>{switch(e){case"success":return{icon:"✓",bgClass:"glass-border-green-500/20 bg-green-500/10",iconClass:"text-green-400"};case"error":return{icon:"✕",bgClass:"glass-border-red-500/20 bg-red-500/10",iconClass:"text-red-400"};case"warning":return{icon:"⚠",bgClass:"glass-border-yellow-500/20 bg-yellow-500/10",iconClass:"text-yellow-400"};default:return{icon:"ℹ",bgClass:"glass-border-blue-500/20 bg-blue-500/10",iconClass:"text-blue-400"}}},W=`
  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
`;if(typeof document<"u"&&typeof window<"u"&&!document.querySelector("#glass-notification-styles")){const t=document.createElement("style");t.id="glass-notification-styles",t.textContent=W,document.head.appendChild(t)}const P=()=>{const{addNotification:e,removeNotification:t,clearAll:n}=p();return{notify:{success:(i,a,o)=>{e({type:"success",title:i,message:a,...o})},error:(i,a,o)=>{e({type:"error",title:i,message:a,...o})},warning:(i,a,o)=>{e({type:"warning",title:i,message:a,...o})},info:(i,a,o)=>{e({type:"info",title:i,message:a,...o})}},removeNotification:t,clearAll:n}};try{h.displayName="GlassNotificationProvider",h.__docgenInfo={description:"",displayName:"GlassNotificationProvider",props:{}}}catch{}try{d.displayName="GlassNotificationCenter",d.__docgenInfo={description:`GlassNotificationCenter component
A notification center with glassmorphism styling for managing toast notifications`,displayName:"GlassNotificationCenter",props:{position:{defaultValue:{value:"top-right"},description:"Position of the notification center",name:"position",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"bottom-right"'},{value:'"bottom-left"'},{value:'"top-right"'},{value:'"top-left"'},{value:'"top-center"'},{value:'"bottom-center"'}]}},maxNotifications:{defaultValue:{value:"5"},description:"Maximum number of notifications to show",name:"maxNotifications",required:!1,type:{name:"number | undefined"}},autoHideDelay:{defaultValue:{value:"ANIMATION.DURATION.slower * 5"},description:"Auto-hide delay for non-persistent notifications (ms)",name:"autoHideDelay",required:!1,type:{name:"number | undefined"}},animation:{defaultValue:{value:"slide"},description:"Animation preset for notifications",name:"animation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"scale"'},{value:'"fade"'},{value:'"slide"'},{value:'"bounce"'}]}},showClearAll:{defaultValue:{value:"true"},description:"Whether to show clear all button",name:"showClearAll",required:!1,type:{name:"boolean | undefined"}}}}}catch{}try{G.displayName="GlassNotificationItem",G.__docgenInfo={description:"",displayName:"GlassNotificationItem",props:{notification:{defaultValue:null,description:"",name:"notification",required:!0,type:{name:"GlassNotification"}},onClose:{defaultValue:null,description:"",name:"onClose",required:!0,type:{name:"() => void"}}}}}catch{}try{P.displayName="useNotificationCenter",P.__docgenInfo={description:"Utility hooks and helpers for notifications",displayName:"useNotificationCenter",props:{}}}catch{}const rs={title:"Data + Visualization/Glass Notification Center",component:d,parameters:{layout:"centered",docs:{description:{component:"A sophisticated notification system with glass morphism styling and advanced positioning."}}},argTypes:{position:{control:{type:"select"},options:["top-right","top-left","bottom-right","bottom-left","top-center","bottom-center"],description:"Position of the notification center"},maxNotifications:{control:{type:"number",min:1,max:10},description:"Maximum number of notifications to show"},autoHideDelay:{control:{type:"number",min:1e3,max:1e4,step:500},description:"Auto-hide delay for non-persistent notifications (ms)"}},args:{position:"top-right",maxNotifications:5,autoHideDelay:5e3}},B=({position:e})=>{const{addNotification:t,removeNotification:n,clearAll:r}=p(),i=()=>{t({type:"success",title:"Success!",message:"Your action was completed successfully.",duration:4e3})},a=()=>{t({type:"error",title:"Error Occurred",message:"Something went wrong. Please try again.",duration:6e3})},o=()=>{t({type:"warning",title:"Warning",message:"This action cannot be undone.",duration:5e3})},g=()=>{t({type:"info",title:"Information",message:"Here is some important information for you.",duration:4e3})},c=()=>{t({type:"info",title:"Persistent Notification",message:"This notification will stay until manually dismissed.",persistent:!0,action:{label:"Learn More",onClick:D()}})};return s.jsxs("div",{className:"glass-gap-4",children:[s.jsxs("div",{className:"glass-text-center glass-mb-6",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-2",children:"Notification Center Demo"}),s.jsx("p",{className:"glass-text-sm opacity-80",children:"Click the buttons below to trigger different types of notifications."})]}),s.jsxs("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-3 glass-gap-3 glass-mx-auto",children:[s.jsx(m,{onClick:i,variant:"success",size:"sm",children:"Success"}),s.jsx(m,{onClick:a,variant:"error",size:"sm",children:"Error"}),s.jsx(m,{onClick:o,variant:"warning",size:"sm",children:"Warning"}),s.jsx(m,{onClick:g,size:"sm",children:"Info"}),s.jsx(m,{onClick:c,variant:"secondary",size:"sm",children:"Persistent"}),s.jsx(m,{onClick:r,variant:"outline",size:"sm",children:"Clear All"})]}),s.jsx(d,{position:e})]})},x={render:e=>s.jsx(h,{children:s.jsx(B,{position:e.position})})},y={render:e=>s.jsxs("div",{className:"glass-stack glass-stack-lg",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-2",children:"Notification Positions"}),s.jsx("p",{className:"glass-text-sm opacity-80",children:"Try different positions for the notification center."})]}),s.jsx("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-3 glass-gap-6",children:["top-right","top-left","bottom-right","bottom-left","top-center","bottom-center"].map(t=>s.jsxs("div",{className:"glass-border glass-border-white/20 glass-radius-lg glass-p-4",children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-mb-3 glass-capitalize glass-text-center",children:t.replace("-"," ")}),s.jsxs(h,{children:[s.jsx(B,{position:t}),s.jsx(d,{position:t})]})]},t))})]}),args:{}},b={render:e=>{const{addNotification:t}=p();return q.useEffect(()=>{[{type:"success",title:"Task Completed",message:"Your file has been uploaded successfully."},{type:"error",title:"Upload Failed",message:"The file size exceeds the maximum limit."},{type:"warning",title:"Storage Warning",message:"You are running low on storage space."},{type:"info",title:"New Feature",message:"Check out our latest updates and improvements."}].forEach((r,i)=>{setTimeout(()=>{t({...r,duration:8e3})},i*500)})},[]),s.jsxs("div",{className:"glass-text-center glass-gap-4",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold",children:"Notification Types"}),s.jsx("p",{className:"glass-text-sm opacity-80",children:"All notification types are displayed above."}),s.jsx(d,{...e})]})},args:{}},v={render:e=>{const{addNotification:t}=p(),n=()=>{t({type:"info",title:"Action Required",message:"Please review and confirm your recent changes.",persistent:!0,action:{label:"Review Now",onClick:D()}})};return s.jsxs("div",{className:"glass-text-center glass-gap-4",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-2",children:"Notifications with Actions"}),s.jsx("p",{className:"glass-text-sm opacity-80 glass-mb-4",children:"Click the button to see a notification with an action button."}),s.jsx(m,{onClick:n,children:"Show Action Notification"}),s.jsx(d,{...e})]})},args:{}},w={render:e=>{const{addNotification:t}=p(),n=()=>{const r=["success","error","warning","info"],i=["File uploaded successfully","Database connection failed","Disk space running low","System update available","Backup completed","Network timeout occurred"];for(let a=0;a<6;a++)setTimeout(()=>{t({type:r[a%r.length],title:i[a],message:`Notification ${a+1} of 6`,duration:7e3})},a*300)};return s.jsxs("div",{className:"glass-text-center glass-gap-4",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-2",children:"Bulk Notifications"}),s.jsx("p",{className:"glass-text-sm opacity-80 glass-mb-4",children:"Test how the system handles multiple notifications."}),s.jsx(m,{onClick:n,children:"Show 6 Notifications"}),s.jsx(d,{...e})]})},args:{}},C={render:e=>s.jsx(h,{children:s.jsxs("div",{className:"glass-text-center glass-gap-4",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-2",children:"Custom Styled Notifications"}),s.jsx("p",{className:"glass-text-sm opacity-80 glass-mb-4",children:"Notifications with custom glass morphism styling."}),s.jsx(d,{...e,className:"custom-notification-center"})]})}),args:{position:"top-center",maxNotifications:3}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <GlassNotificationProvider>
      <NotificationDemo position={args.position} />
    </GlassNotificationProvider>
}`,...x.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-stack glass-stack-lg">
      <div className="glass-text-center">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Notification Positions</h3>
        <p className="glass-text-sm opacity-80">Try different positions for the notification center.</p>
      </div>

      <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-3 glass-gap-6">
        {(['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'] as const).map(position => <div key={position} className="glass-border glass-border-white/20 glass-radius-lg glass-p-4">
            <h4 className="glass-text-sm glass-font-medium glass-mb-3 glass-capitalize glass-text-center">{position.replace('-', ' ')}</h4>
            <GlassNotificationProvider>
              <NotificationDemo position={position} />
              <GlassNotificationCenter position={position} />
            </GlassNotificationProvider>
          </div>)}
      </div>
    </div>,
  args: {}
}`,...y.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => {
    const {
      addNotification
    } = useNotifications();
    React.useEffect(() => {
      // Add sample notifications of each type
      const notifications = [{
        type: 'success' as const,
        title: 'Task Completed',
        message: 'Your file has been uploaded successfully.'
      }, {
        type: 'error' as const,
        title: 'Upload Failed',
        message: 'The file size exceeds the maximum limit.'
      }, {
        type: 'warning' as const,
        title: 'Storage Warning',
        message: 'You are running low on storage space.'
      }, {
        type: 'info' as const,
        title: 'New Feature',
        message: 'Check out our latest updates and improvements.'
      }];
      notifications.forEach((notification, index) => {
        setTimeout(() => {
          addNotification({
            ...notification,
            duration: 8000
          });
        }, index * 500);
      });
    }, []);
    return <div className="glass-text-center glass-gap-4">
        <h3 className="glass-text-lg glass-font-semibold">Notification Types</h3>
        <p className="glass-text-sm opacity-80">All notification types are displayed above.</p>
        <GlassNotificationCenter {...args} />
      </div>;
  },
  args: {}
}`,...b.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => {
    const {
      addNotification
    } = useNotifications();
    const showActionNotification = () => {
      addNotification({
        type: 'info',
        title: 'Action Required',
        message: 'Please review and confirm your recent changes.',
        persistent: true,
        action: {
          label: 'Review Now',
          onClick: fn()
        }
      });
    };
    return <div className="glass-text-center glass-gap-4">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Notifications with Actions</h3>
        <p className="glass-text-sm opacity-80 glass-mb-4">Click the button to see a notification with an action button.</p>
        <GlassButton onClick={showActionNotification}>Show Action Notification</GlassButton>
        <GlassNotificationCenter {...args} />
      </div>;
  },
  args: {}
}`,...v.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => {
    const {
      addNotification
    } = useNotifications();
    const showBulkNotifications = () => {
      const types: ('success' | 'error' | 'warning' | 'info')[] = ['success', 'error', 'warning', 'info'];
      const messages = ['File uploaded successfully', 'Database connection failed', 'Disk space running low', 'System update available', 'Backup completed', 'Network timeout occurred'];
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          addNotification({
            type: types[i % types.length],
            title: messages[i],
            message: \`Notification \${i + 1} of 6\`,
            duration: 7000
          });
        }, i * 300);
      }
    };
    return <div className="glass-text-center glass-gap-4">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Bulk Notifications</h3>
        <p className="glass-text-sm opacity-80 glass-mb-4">Test how the system handles multiple notifications.</p>
        <GlassButton onClick={showBulkNotifications}>Show 6 Notifications</GlassButton>
        <GlassNotificationCenter {...args} />
      </div>;
  },
  args: {}
}`,...w.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <GlassNotificationProvider>
      <div className="glass-text-center glass-gap-4">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Custom Styled Notifications</h3>
        <p className="glass-text-sm opacity-80 glass-mb-4">Notifications with custom glass morphism styling.</p>
        <GlassNotificationCenter {...args} className="custom-notification-center" />
      </div>
    </GlassNotificationProvider>,
  args: {
    position: 'top-center',
    maxNotifications: 3
  }
}`,...C.parameters?.docs?.source}}};const cs=["Default","Positions","NotificationTypes","WithActions","BulkNotifications","CustomStyling"];export{w as BulkNotifications,C as CustomStyling,x as Default,b as NotificationTypes,y as Positions,v as WithActions,cs as __namedExportsOrder,rs as default};
