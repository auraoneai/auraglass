import{r,h as ke,j as o,c as U}from"./iframe-rcK9Xf1b.js";import{u as Se}from"./MotionPreferenceContext-mQDtMATf.js";import{u as Ge}from"./soundDesign-BzTj-xWn.js";import{O as he}from"./OptimizedGlassCore-BtDfN8Ts.js";import{M as De}from"./MotionFramer-D0-HiDbD.js";import"./preload-helper-PPVm8Dsz.js";import"./utilsCore-jun4nkmH.js";const V=r.forwardRef(({width:h=600,height:g=400,active:m=!0,sensitivity:b=.8,maxGestureDuration:Fe=5e3,minGesturePoints:H=3,showTrail:y=!0,trailColor:A="var(--glass-color-primary)",trailFadeDuration:Pe=2e3,showFeedback:w=!0,feedbackDuration:qe=1e3,gestureTemplates:pe=[],multiTouch:_=!1,maxTouches:Ie=2,recognitionTimeout:je=1e3,debug:E=!1,onGestureStart:O,onGestureMove:L,onGestureEnd:J,onGestureRecognized:K,onMultiTouch:Q,showControls:ge=!0,respectMotionPreference:ye=!0,className:fe,...R},xe)=>{const{prefersReducedMotion:ee,isMotionSafe:be}=Se(),{play:p}=Ge(),v=r.useRef(null),$=r.useRef(),we=ke("glass-gesture-zone"),[d,T]=r.useState(new Map),[te,se]=r.useState([]),[M,ne]=r.useState([]),[Z,B]=r.useState([]),[ae,W]=r.useState([]),[re,X]=r.useState([]),[Y,oe]=r.useState(!1),ie=[...[{name:"Circle",type:"circle",points:Array.from({length:16},(s,e)=>({x:Math.cos(e/16*Math.PI*2),y:Math.sin(e/16*Math.PI*2)})),threshold:.3},{name:"Swipe Right",type:"swipe_right",points:[{x:-1,y:0},{x:-.5,y:0},{x:0,y:0},{x:.5,y:0},{x:1,y:0}],threshold:.4},{name:"Swipe Left",type:"swipe_left",points:[{x:1,y:0},{x:.5,y:0},{x:0,y:0},{x:-.5,y:0},{x:-1,y:0}],threshold:.4},{name:"Swipe Up",type:"swipe_up",points:[{x:0,y:1},{x:0,y:.5},{x:0,y:0},{x:0,y:-.5},{x:0,y:-1}],threshold:.4},{name:"Swipe Down",type:"swipe_down",points:[{x:0,y:-1},{x:0,y:-.5},{x:0,y:0},{x:0,y:.5},{x:0,y:1}],threshold:.4},{name:"Tap",type:"tap",points:[{x:0,y:0}],threshold:.1},{name:"Double Tap",type:"double_tap",points:[{x:0,y:0}],threshold:.1},{name:"Pinch",type:"pinch",points:[{x:-.5,y:0},{x:0,y:0},{x:.5,y:0}],threshold:.3}],...pe],le=r.useCallback(s=>{if(s.length===0)return[];const e=Math.min(...s.map(c=>c.x)),t=Math.max(...s.map(c=>c.x)),a=Math.min(...s.map(c=>c.y)),n=Math.max(...s.map(c=>c.y)),i=(e+t)/2,u=(a+n)/2,l=Math.max(1,(t-e)/2),f=Math.max(1,(n-a)/2),x=Math.max(l,f);return s.map(c=>({x:(c.x-i)/x,y:(c.y-u)/x}))},[]),ue=r.useCallback((s,e)=>{if(s.length===0||e.length===0)return 0;const t=s.length,a=e.length,n=Array(t+1).fill(null).map(()=>Array(a+1).fill(1/0));n[0][0]=0;for(let u=1;u<=t;u++)for(let l=1;l<=a;l++){const f=Math.sqrt(Math.pow(s[u-1].x-e[l-1].x,2)+Math.pow(s[u-1].y-e[l-1].y,2));n[u][l]=f+Math.min(n[u-1][l],n[u][l-1],n[u-1][l-1])}const i=1-n[t][a]/Math.max(t,a);return Math.max(0,i)},[]),ce=r.useCallback(s=>{if(s.points.length<H)return;const e=le(s.points);let t=null;for(const a of ie){const n=ue(e,a.points);n>=a.threshold*b&&(!t||n>t.confidence)&&(t={template:a,confidence:n})}if(t){const a={type:t.template.type,confidence:t.confidence,data:{template:t.template.name,strokeId:s.id,duration:s.endTime-s.startTime,velocity:s.velocity,direction:s.direction,distance:s.distance},timestamp:Date.now(),stroke:s,id:`gesture-${Date.now()}`};ne(n=>[...n.slice(-9),a]),K?.(a),w&&W(n=>[...n,{gesture:a,opacity:1}]),p("success")}},[H,le,ie,ue,b,K,w,p]),C=r.useCallback(s=>{if(s.length<2)return{velocity:0,direction:0,distance:0};let e=0,t=0;for(let l=1;l<s.length;l++){const f=s[l].x-s[l-1].x,x=s[l].y-s[l-1].y,c=s[l].timestamp-s[l-1].timestamp;e+=Math.sqrt(f*f+x*x),t+=c}const a=t>0?e/t:0,n=s[0],i=s[s.length-1],u=Math.atan2(i.y-n.y,i.x-n.x);return{velocity:a,direction:u,distance:e}},[]),k=r.useCallback(s=>{const e=v.current;if(!e)return{x:0,y:0,timestamp:Date.now(),id:""};const t=e.getBoundingClientRect();return{x:s.clientX-t.left,y:s.clientY-t.top,timestamp:Date.now(),pressure:s.pressure||1,id:`point-${Date.now()}-${Math.random()}`}},[]),ve=r.useCallback(s=>{if(!m)return;s.preventDefault();const e=k(s),t=s.pointerId.toString(),a={points:[e],startTime:Date.now(),endTime:Date.now(),velocity:0,direction:0,distance:0,id:`stroke-${t}-${Date.now()}`};T(n=>new Map(n.set(t,a))),X(n=>[...n,e]),O?.(e),p("tap")},[m,k,O,p]),Te=r.useCallback(s=>{if(!m)return;const e=k(s),t=s.pointerId.toString(),a=d.get(t);if(!a)return;const n={...a,points:[...a.points,e],endTime:Date.now(),...C([...a.points,e])};T(i=>new Map(i.set(t,n))),y&&B(i=>[...i,{point:e,opacity:1,size:Math.min(8,Math.max(2,(e.pressure||1)*6))}]),L?.(e,n)},[m,k,d,C,y,L]),de=r.useCallback(s=>{if(!m)return;const e=s.pointerId.toString(),t=d.get(e);if(!t)return;const a={...t,endTime:Date.now(),...C(t.points)};T(n=>{const i=new Map(n);return i.delete(e),i}),se(n=>[...n.slice(-19),a]),X(n=>n.filter(i=>i.id!==t.points[t.points.length-1]?.id)),setTimeout(()=>{ce(a)},100),J?.(a),p("success")},[m,d,C,ce,J,p]);r.useEffect(()=>{const s=d.size;if(_&&s>=2){oe(!0);const e=Array.from(d.values()).map(t=>t.points[t.points.length-1]);Q?.(e)}else oe(!1)},[d,_,Q]),r.useEffect(()=>{if(!y)return;const s=setInterval(()=>{B(e=>e.map(t=>({...t,opacity:Math.max(0,t.opacity-.02)})).filter(t=>t.opacity>0))},16);return()=>clearInterval(s)},[y]),r.useEffect(()=>{if(!w)return;const s=setInterval(()=>{W(e=>e.map(t=>({...t,opacity:Math.max(0,t.opacity-.01)})).filter(t=>t.opacity>0))},16);return()=>clearInterval(s)},[w]);const me=r.useCallback(()=>{const s=v.current;if(!s)return;const e=s.getContext("2d");if(e&&(e.clearRect(0,0,h,g),y&&!ee&&Z.forEach((t,a)=>{const{point:n,opacity:i,size:u}=t;e.globalAlpha=i,e.fillStyle=A,e.beginPath(),e.arc(n.x,n.y,u,0,Math.PI*2),e.fill()}),e.globalAlpha=1,e.strokeStyle=A,e.lineWidth=2,e.lineCap="round",e.lineJoin="round",d.forEach(t=>{if(!(t.points.length<2)){e.beginPath(),e.moveTo(t.points[0].x,t.points[0].y);for(let a=1;a<t.points.length;a++)e.lineTo(t.points[a].x,t.points[a].y);e.stroke()}}),Y&&re.forEach(t=>{e.strokeStyle="#FF6B6B",e.lineWidth=3,e.beginPath(),e.arc(t.x,t.y,15,0,Math.PI*2),e.stroke()}),ae.forEach(({gesture:t,opacity:a})=>{const n=h/2,i=g/2;e.globalAlpha=a,e.fillStyle="#4ADE80",e.font="18px sans-serif",e.textAlign="center",e.fillText(t.type.replace("_"," ").toUpperCase(),n,i),e.font="12px sans-serif",e.fillText(`${Math.round(t.confidence*100)}%`,n,i+25)}),E)){e.globalAlpha=1,e.fillStyle="white",e.font="10px monospace",e.textAlign="left";let t=15;e.fillText(`Active Strokes: ${d.size}`,10,t),t+=15,e.fillText(`Completed: ${te.length}`,10,t),t+=15,e.fillText(`Recognized: ${M.length}`,10,t),t+=15,e.fillText(`Multi-touch: ${Y}`,10,t),t+=15,e.fillText(`Trail Points: ${Z.length}`,10,t)}},[h,g,y,ee,Z,A,d,Y,re,ae,E,te.length,M.length]);r.useEffect(()=>{const s=()=>{me(),$.current=requestAnimationFrame(s)};return s(),()=>{$.current&&cancelAnimationFrame($.current)}},[me]),r.useEffect(()=>{const s=v.current;s&&(s.width=h,s.height=g)},[h,g]);const Me=r.useCallback(()=>{T(new Map),se([]),ne([]),B([]),W([]),X([]),p("error")},[p]),Ce=()=>ge?o.jsxs(he,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:"glass-gesture-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard",children:[o.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[o.jsx("button",{onClick:()=>{},className:U("glass-px-3 glass-py-1 glass-radius-md glass-focus glass-touch-target glass-contrast-guard",m?"bg-green-500/20 hover:bg-green-500/30 text-green-400":"bg-red-500/20 hover:bg-red-500/30 text-red-400"),children:m?"Active":"Inactive"}),o.jsx("button",{onClick:Me,className:"glass-px-3 glass-py-1 glass-radius-md glass-bg-secondary/20 hover:glass-bg-secondary/30 glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard",children:"Clear"})]}),o.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[o.jsx("label",{htmlFor:"gesture-sensitivity",className:"glass-text-sm",children:"Sensitivity:"}),o.jsx("input",{id:"gesture-sensitivity",type:"range",min:"0.1",max:"1",step:"0.1",value:b,onChange:s=>{},className:"glass-w-20 glass-focus glass-touch-target glass-contrast-guard","aria-label":"Gesture sensitivity"}),o.jsxs("span",{className:"glass-text-sm glass-min-w-3ch",children:[Math.round(b*100),"%"]})]}),o.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[o.jsxs("label",{className:"glass-text-sm",children:[o.jsx("input",{type:"checkbox",checked:y,onChange:s=>{},className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Trail"]}),o.jsxs("label",{className:"glass-text-sm",children:[o.jsx("input",{type:"checkbox",checked:_,onChange:s=>{},className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Multi-touch"]}),o.jsxs("label",{className:"glass-text-sm",children:[o.jsx("input",{type:"checkbox",checked:E,onChange:s=>{},className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Debug"]})]})]}):null;return o.jsx(he,{ref:xe,id:we,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",className:U("glass-gesture-zone relative glass-radius-lg glass-glass-backdrop-blur-md border border-border/20 glass-contrast-guard",fe),"data-testid":R["data-testid"],"aria-label":R["aria-label"]||"Gesture recognition zone",...R,children:o.jsxs(De,{preset:be&&ye?"fadeIn":"none",className:"glass-flex glass-flex-col glass-gap-4 glass-p-4",children:[Ce(),o.jsx("div",{className:"glass-relative",children:o.jsx("canvas",{ref:v,width:h,height:g,className:U("border border-border/20 glass-radius-md bg-background/5",m&&"cursor-crosshair"),onPointerDown:ve,onPointerMove:Te,onPointerUp:de,onPointerLeave:de,style:{width:h,height:g,touchAction:"none"}})}),M.length>0&&o.jsxs("div",{className:"glass-p-4 glass-surface-overlay glass-radius-md",children:[o.jsx("div",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Recent Gestures:"}),o.jsx("div",{className:"glass-space-y-1",children:M.slice(-5).map(s=>o.jsxs("div",{className:"glass-text-xs glass-p-2 glass-surface-primary/10 glass-radius-sm",children:[o.jsx("span",{className:"glass-font-medium",children:s.type.replace("_"," ")}),o.jsxs("span",{className:"glass-text-secondary glass-ml-2",children:[Math.round(s.confidence*100),"% confidence"]})]},s.id))})]})]})})});V.displayName="GlassGestureZone";try{V.displayName="GlassGestureZone",V.__docgenInfo={description:"",displayName:"GlassGestureZone",props:{width:{defaultValue:{value:"600"},description:"Zone width",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"400"},description:"Zone height",name:"height",required:!1,type:{name:"number | undefined"}},active:{defaultValue:{value:"true"},description:"Whether gesture recognition is active",name:"active",required:!1,type:{name:"boolean | undefined"}},sensitivity:{defaultValue:{value:"0.8"},description:"Gesture recognition sensitivity",name:"sensitivity",required:!1,type:{name:"number | undefined"}},maxGestureDuration:{defaultValue:{value:"5000"},description:"Maximum gesture duration",name:"maxGestureDuration",required:!1,type:{name:"number | undefined"}},minGesturePoints:{defaultValue:{value:"3"},description:"Minimum points for gesture",name:"minGesturePoints",required:!1,type:{name:"number | undefined"}},showTrail:{defaultValue:{value:"true"},description:"Whether to show gesture trail",name:"showTrail",required:!1,type:{name:"boolean | undefined"}},trailColor:{defaultValue:{value:"var(--glass-color-primary)"},description:"Trail color",name:"trailColor",required:!1,type:{name:"string | undefined"}},trailFadeDuration:{defaultValue:{value:"2000"},description:"Trail fade duration",name:"trailFadeDuration",required:!1,type:{name:"number | undefined"}},showFeedback:{defaultValue:{value:"true"},description:"Whether to show gesture feedback",name:"showFeedback",required:!1,type:{name:"boolean | undefined"}},feedbackDuration:{defaultValue:{value:"1000"},description:"Feedback duration",name:"feedbackDuration",required:!1,type:{name:"number | undefined"}},gestureTemplates:{defaultValue:{value:"[]"},description:"Custom gesture templates",name:"gestureTemplates",required:!1,type:{name:"GestureTemplate[] | undefined"}},multiTouch:{defaultValue:{value:"false"},description:"Whether to enable multi-touch",name:"multiTouch",required:!1,type:{name:"boolean | undefined"}},maxTouches:{defaultValue:{value:"2"},description:"Maximum simultaneous touches",name:"maxTouches",required:!1,type:{name:"number | undefined"}},recognitionTimeout:{defaultValue:{value:"1000"},description:"Gesture recognition timeout",name:"recognitionTimeout",required:!1,type:{name:"number | undefined"}},debug:{defaultValue:{value:"false"},description:"Whether to show debug info",name:"debug",required:!1,type:{name:"boolean | undefined"}},onGestureStart:{defaultValue:null,description:"Gesture start handler",name:"onGestureStart",required:!1,type:{name:"((point: GesturePoint) => void) | undefined"}},onGestureMove:{defaultValue:null,description:"Gesture move handler",name:"onGestureMove",required:!1,type:{name:"((point: GesturePoint, stroke: GestureStroke) => void) | undefined"}},onGestureEnd:{defaultValue:null,description:"Gesture end handler",name:"onGestureEnd",required:!1,type:{name:"((stroke: GestureStroke) => void) | undefined"}},onGestureRecognized:{defaultValue:null,description:"Gesture recognition handler",name:"onGestureRecognized",required:!1,type:{name:"((gesture: RecognizedGesture) => void) | undefined"}},onMultiTouch:{defaultValue:null,description:"Multi-touch handler",name:"onMultiTouch",required:!1,type:{name:"((points: GesturePoint[]) => void) | undefined"}},showControls:{defaultValue:{value:"true"},description:"Show controls",name:"showControls",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Respect user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const Ze={title:"Glass UI/Interactive/GlassGestureZone",component:V,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{width:{control:{type:"range",min:300,max:800,step:50}},height:{control:{type:"range",min:200,max:600,step:50}},sensitivity:{control:{type:"range",min:.1,max:1,step:.1}},trailColor:{control:{type:"color"},type:"string",table:{type:{summary:"string"}}}}},S={args:{width:600,height:400,active:!0,showControls:!0,showTrail:!0,showFeedback:!0}},G={args:{width:500,height:300,sensitivity:.8,showTrail:!0,showFeedback:!0,debug:!1}},D={args:{width:600,height:400,multiTouch:!0,maxTouches:3,showTrail:!0,trailColor:"var(--glass-color-success)"}},F={args:{width:400,height:300,sensitivity:1,minGesturePoints:2,showTrail:!0,showFeedback:!0}},P={args:{width:500,height:350,showTrail:!0,trailColor:"#8B5CF6",trailFadeDuration:3e3,showFeedback:!1}},q={args:{width:600,height:400,debug:!0,showTrail:!0,showFeedback:!0,showControls:!0}},I={args:{width:400,height:250,showControls:!1,showTrail:!1,showFeedback:!0,sensitivity:.7}},j={args:{width:600,height:400,gestureTemplates:[{name:"Triangle",type:"triangle",points:[{x:0,y:-1},{x:.866,y:.5},{x:-.866,y:.5},{x:0,y:-1}],threshold:.4},{name:"Square",type:"square",points:[{x:-1,y:-1},{x:1,y:-1},{x:1,y:1},{x:-1,y:1},{x:-1,y:-1}],threshold:.3},{name:"Zigzag",type:"zigzag",points:[{x:-1,y:0},{x:-.5,y:-1},{x:0,y:0},{x:.5,y:-1},{x:1,y:0}],threshold:.4}],showTrail:!0,showFeedback:!0,debug:!0}},N={args:{width:700,height:500,active:!0,sensitivity:.8,multiTouch:!0,maxTouches:2,showTrail:!0,trailColor:"var(--glass-color-primary)",showFeedback:!0,feedbackDuration:2e3,showControls:!0,debug:!1,gestureTemplates:[{name:"Heart",type:"heart",points:[{x:0,y:.3},{x:-.5,y:-.3},{x:-.8,y:-.7},{x:-.3,y:-1},{x:0,y:-.5},{x:.3,y:-1},{x:.8,y:-.7},{x:.5,y:-.3},{x:0,y:.3}],threshold:.25},{name:"Star",type:"star",points:[{x:0,y:-1},{x:.2,y:-.3},{x:1,y:-.3},{x:.3,y:.1},{x:.6,y:1},{x:0,y:.4},{x:-.6,y:1},{x:-.3,y:.1},{x:-1,y:-.3},{x:-.2,y:-.3},{x:0,y:-1}],threshold:.3}]}},z={args:{width:400,height:300,multiTouch:!0,showTrail:!0,trailColor:"var(--glass-color-warning)",sensitivity:.9,showFeedback:!0,showControls:!1}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    active: true,
    showControls: true,
    showTrail: true,
    showFeedback: true
  }
}`,...S.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    width: 500,
    height: 300,
    sensitivity: 0.8,
    showTrail: true,
    showFeedback: true,
    debug: false
  }
}`,...G.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    multiTouch: true,
    maxTouches: 3,
    showTrail: true,
    trailColor: 'var(--glass-color-success)'
  }
}`,...D.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 300,
    sensitivity: 1,
    minGesturePoints: 2,
    showTrail: true,
    showFeedback: true
  }
}`,...F.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    width: 500,
    height: 350,
    showTrail: true,
    trailColor: '#8B5CF6',
    trailFadeDuration: 3000,
    showFeedback: false
  }
}`,...P.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    debug: true,
    showTrail: true,
    showFeedback: true,
    showControls: true
  }
}`,...q.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 250,
    showControls: false,
    showTrail: false,
    showFeedback: true,
    sensitivity: 0.7
  }
}`,...I.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    width: 600,
    height: 400,
    gestureTemplates: [{
      name: 'Triangle',
      type: 'triangle',
      points: [{
        x: 0,
        y: -1
      }, {
        x: 0.866,
        y: 0.5
      }, {
        x: -0.866,
        y: 0.5
      }, {
        x: 0,
        y: -1
      }],
      threshold: 0.4
    }, {
      name: 'Square',
      type: 'square',
      points: [{
        x: -1,
        y: -1
      }, {
        x: 1,
        y: -1
      }, {
        x: 1,
        y: 1
      }, {
        x: -1,
        y: 1
      }, {
        x: -1,
        y: -1
      }],
      threshold: 0.3
    }, {
      name: 'Zigzag',
      type: 'zigzag',
      points: [{
        x: -1,
        y: 0
      }, {
        x: -0.5,
        y: -1
      }, {
        x: 0,
        y: 0
      }, {
        x: 0.5,
        y: -1
      }, {
        x: 1,
        y: 0
      }],
      threshold: 0.4
    }],
    showTrail: true,
    showFeedback: true,
    debug: true
  }
}`,...j.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 500,
    active: true,
    sensitivity: 0.8,
    multiTouch: true,
    maxTouches: 2,
    showTrail: true,
    trailColor: 'var(--glass-color-primary)',
    showFeedback: true,
    feedbackDuration: 2000,
    showControls: true,
    debug: false,
    gestureTemplates: [{
      name: 'Heart',
      type: 'heart',
      points: [{
        x: 0,
        y: 0.3
      }, {
        x: -0.5,
        y: -0.3
      }, {
        x: -0.8,
        y: -0.7
      }, {
        x: -0.3,
        y: -1
      }, {
        x: 0,
        y: -0.5
      }, {
        x: 0.3,
        y: -1
      }, {
        x: 0.8,
        y: -0.7
      }, {
        x: 0.5,
        y: -0.3
      }, {
        x: 0,
        y: 0.3
      }],
      threshold: 0.25
    }, {
      name: 'Star',
      type: 'star',
      points: [{
        x: 0,
        y: -1
      }, {
        x: 0.2,
        y: -0.3
      }, {
        x: 1,
        y: -0.3
      }, {
        x: 0.3,
        y: 0.1
      }, {
        x: 0.6,
        y: 1
      }, {
        x: 0,
        y: 0.4
      }, {
        x: -0.6,
        y: 1
      }, {
        x: -0.3,
        y: 0.1
      }, {
        x: -1,
        y: -0.3
      }, {
        x: -0.2,
        y: -0.3
      }, {
        x: 0,
        y: -1
      }],
      threshold: 0.3
    }]
  }
}`,...N.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    width: 400,
    height: 300,
    multiTouch: true,
    showTrail: true,
    trailColor: 'var(--glass-color-warning)',
    sensitivity: 0.9,
    showFeedback: true,
    showControls: false
  }
}`,...z.parameters?.docs?.source}}};const Be=["Default","BasicGestures","MultiTouchEnabled","HighSensitivity","CustomTrail","DebugMode","MinimalInterface","CustomGestures","InteractivePlayground","TouchInterface"];export{G as BasicGestures,j as CustomGestures,P as CustomTrail,q as DebugMode,S as Default,F as HighSensitivity,N as InteractivePlayground,I as MinimalInterface,D as MultiTouchEnabled,z as TouchInterface,Be as __namedExportsOrder,Ze as default};
