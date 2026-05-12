import{r as n,j as e,c as ne,d as Ke}from"./iframe-LAGStZOr.js";import{u as Je}from"./a11y-C_KrV_f1.js";import{u as Xe}from"./MotionPreferenceContext-C7yRy-IY.js";import{u as Ye}from"./soundDesign-B613TIvB.js";import{O as Ve}from"./OptimizedGlassCore-Jd0dTpF2.js";import{M as Qe}from"./MotionFramer-Duk6IhfR.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-B9hm0WxX.js";import"./utilsCore-D2ntLguv.js";const B=n.forwardRef(({active:V=!1,language:O="en-US",continuous:$=!0,interimResults:re=!0,maxAlternatives:te=1,commands:oe=[],wakeWord:H,confidenceThreshold:ie=.7,showVisualizer:m=!0,visualizerStyle:K="waveform",showTranscript:Te=!0,maxTranscriptLength:le=500,timeout:Ze=3e4,noiseSuppression:ce=!0,echoCancellation:ue=!0,autoGainControl:de=!0,onVoiceStart:pe,onVoiceEnd:me,onResult:ge,onCommand:he,onError:f,onAudioLevel:fe,onTranscriptChange:T,showControls:je=!0,respectMotionPreference:_e=!0,className:Ne,"data-testid":ke,...Re},Me)=>{const{prefersReducedMotion:j,isMotionSafe:qe}=Xe(),{play:b}=Ye(),J=n.useRef(null),X=n.useRef(),x=n.useRef(null),_=n.useRef(null),Y=n.useRef(null),Q=n.useRef(null),Ie=Je("glass-voice-input"),[l,Z]=n.useState(!1),[es,ss]=n.useState(!1),[ve,we]=n.useState(""),[ee,ye]=n.useState(""),[N,Ae]=n.useState(0),[xe,Le]=n.useState(0),[k,We]=n.useState([]),[g,Ee]=n.useState(new Float32Array(256)),[z,Fe]=n.useState(!1),[S,be]=n.useState("prompt");n.useEffect(()=>{const a="webkitSpeechRecognition"in window||"SpeechRecognition"in window;Fe(a),a||f?.("Speech recognition is not supported in this browser")},[f]);const ze=n.useCallback(()=>{if(!z)return;const a=window.SpeechRecognition||window.webkitSpeechRecognition,s=new a;s.continuous=$,s.interimResults=re,s.lang=O,s.maxAlternatives=te,s.onstart=()=>{Z(!0),pe?.(),b("tap")},s.onend=()=>{Z(!1),me?.(),b("success")},s.onresult=r=>{let t="",u="";for(let d=r.resultIndex;d<r.results.length;d++){const o=r.results[d],c=o[0].transcript,v=o[0].confidence;o.isFinal?(t+=c,ge?.(c,v),Ge(c,v)):u+=c}t&&we(d=>{const o=(d+t).slice(-le);return T?.(o),o}),ye(u)},s.onerror=r=>{f?.(r.error),Z(!1),b("error")},x.current=s},[z,$,re,O,te,le,pe,me,ge,T,f,b]),Se=n.useCallback(async()=>{try{const a=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:ue,noiseSuppression:ce,autoGainControl:de}});Q.current=a,be("granted");const s=new(window.AudioContext||window.webkitAudioContext),r=s.createAnalyser(),t=s.createMediaStreamSource(a);r.fftSize=512,r.smoothingTimeConstant=.8,t.connect(r),_.current=s,Y.current=r,m&&Pe()}catch{be("denied"),f?.("Microphone access denied")}},[ue,ce,de,m,f]),Pe=n.useCallback(()=>{if(!Y.current)return;const a=Y.current,s=a.frequencyBinCount,r=new Float32Array(s),t=()=>{a.getFloatFrequencyData(r);const u=r.reduce((p,w)=>p+Math.abs(w),0),d=Math.min(1,u/s/50);Ae(d),fe?.(d);let o=0,c=-1/0;for(let p=0;p<s;p++)r[p]>c&&(c=r[p],o=p);const v=o*_.current.sampleRate/(a.fftSize*2);Le(v),Ee(new Float32Array(r)),m&&(X.current=requestAnimationFrame(t))};t()},[m,fe]),Ge=n.useCallback((a,s)=>{if(s<ie)return;const r=a.toLowerCase().trim();oe.forEach(t=>{const u=t.phrase.toLowerCase();let d=!1;if(t.fuzzy){const o=r.split(" "),c=u.split(" ");d=c.filter(p=>o.some(w=>w.includes(p)||p.includes(w))).length/c.length>=.7}else d=r.includes(u);if(d){const o={phrase:t.phrase,action:t.action,confidence:s,timestamp:Date.now(),id:`command-${Date.now()}`};We(c=>[...c.slice(-9),o]),he?.(o),b("success")}}),H&&r.includes(H.toLowerCase())&&(l||C())},[ie,oe,H,l,he,b]);n.useEffect(()=>{ze()},[ze]);const C=n.useCallback(()=>{if(!(!x.current||l)){S!=="granted"&&Se();try{x.current.start()}catch{f?.("Failed to start voice recognition")}}},[l,S,Se,f]),R=n.useCallback(()=>{if(!(!x.current||!l))try{x.current.stop()}catch{f?.("Failed to stop voice recognition")}},[l]),De=n.useCallback(()=>{l?R():C()},[l,C,R]);n.useEffect(()=>{V&&!l?C():!V&&l&&R()},[V,l,C,R]),n.useEffect(()=>()=>{X.current&&cancelAnimationFrame(X.current),Q.current&&Q.current.getTracks().forEach(a=>a.stop()),_.current&&_.current.close(),x.current&&x.current.abort()},[]);const Ce=n.useCallback(()=>{if(!m||j)return null;const a=J.current;if(!a)return null;const s=a.getContext("2d");if(!s)return null;const{width:r,height:t}=a;if(s.clearRect(0,0,r,t),!g||N===0)return null;const u=s.createLinearGradient(0,t,0,0);switch(u.addColorStop(0,"color-mix(in srgb, var(--glass-color-info) 80%, transparent)"),u.addColorStop(.5,"color-mix(in srgb, var(--glass-color-info) 60%, transparent)"),u.addColorStop(1,"color-mix(in srgb, var(--glass-color-info) 40%, transparent)"),K){case"waveform":s.strokeStyle=u,s.lineWidth=2,s.beginPath();const d=r/g.length;let o=0;for(let i=0;i<g.length;i++){const y=(g[i]+100)/100*t/2;i===0?s.moveTo(o,y):s.lineTo(o,y),o+=d}s.stroke();break;case"bars":const c=r/g.length*2;for(let i=0;i<g.length;i++){const h=(g[i]+100)/100*t,y=i*c;s.fillStyle=u,s.fillRect(y,t-h,c-1,h)}break;case"circular":const v=r/2,p=t/2,w=Math.min(v,p)*.6;s.lineWidth=3;for(let i=0;i<g.length;i++){const h=i/g.length*Math.PI*2,y=(g[i]+100)/100*50,se=v+Math.cos(h)*w,ae=p+Math.sin(h)*w,$e=v+Math.cos(h)*(w+y),He=p+Math.sin(h)*(w+y);s.strokeStyle=u,s.beginPath(),s.moveTo(se,ae),s.lineTo($e,He),s.stroke()}break;case"particle":const Oe=Math.min(50,Math.floor(N*100));for(let i=0;i<Oe;i++){const h=Math.random()*r,y=Math.random()*t,se=Math.random()*3+1,ae=Math.random()*.8+.2;s.fillStyle=`color-mix(in srgb, var(--glass-color-info) ${ae*100}%, transparent)`,s.beginPath(),s.arc(h,y,se,0,Math.PI*2),s.fill()}break}},[m,j,g,N,K]);n.useEffect(()=>{if(m&&!j){const a=()=>{Ce(),m&&requestAnimationFrame(a)};a()}},[m,j,Ce]),n.useEffect(()=>{const a=J.current;a&&(a.width=400,a.height=100)},[]);const Ue=n.useCallback(()=>{we(""),ye(""),T?.("")},[T]),Be=()=>je?e.jsxs(Ve,{elevation:"level2",intensity:"medium",depth:1,tint:"neutral",border:"subtle",className:"glass-voice-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-contrast-guard glass-border glass-border-glass-border/20 glass-contrast-guard",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("button",{onClick:De,disabled:!z||S==="denied",className:ne("glass-px-4 glass-py-2 glass-radius-md font-medium transition-all","glass-focus glass-touch-target glass-contrast-guard",l?"bg-red-500/20 hover:bg-red-500/30 text-red-400":"bg-green-500/20 hover:bg-green-500/30 text-green-400",(!z||S==="denied")&&"opacity-50 cursor-not-allowed"),children:l?"Stop Listening":"Start Listening"}),e.jsx("button",{onClick:Ue,className:"glass-px-3 glass-py-2 glass-radius-md glass-bg-secondary/20 hover:glass-bg-secondary/30 glass-focus glass-touch-target glass-contrast-guard",children:"Clear"})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("label",{htmlFor:"voice-language",className:"glass-text-sm",children:"Language:"}),e.jsxs("select",{id:"voice-language",value:O,onChange:a=>{},"aria-label":"Select voice recognition language",className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20 glass-focus glass-touch-target glass-contrast-guard",children:[e.jsx("option",{value:"en-US",children:"English (US)"}),e.jsx("option",{value:"en-GB",children:"English (UK)"}),e.jsx("option",{value:"es-ES",children:"Spanish"}),e.jsx("option",{value:"fr-FR",children:"French"}),e.jsx("option",{value:"de-DE",children:"German"}),e.jsx("option",{value:"it-IT",children:"Italian"}),e.jsx("option",{value:"ja-JP",children:"Japanese"}),e.jsx("option",{value:"ko-KR",children:"Korean"}),e.jsx("option",{value:"zh-CN",children:"Chinese (Mandarin)"})]})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("label",{htmlFor:"visualizer-style",className:"glass-text-sm",children:"Style:"}),e.jsxs("select",{id:"visualizer-style",value:K,onChange:a=>{},"aria-label":"Select visualizer style",className:"glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20 glass-focus glass-touch-target glass-contrast-guard",children:[e.jsx("option",{value:"waveform",children:"Waveform"}),e.jsx("option",{value:"bars",children:"Bars"}),e.jsx("option",{value:"circular",children:"Circular"}),e.jsx("option",{value:"particle",children:"Particle"})]})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsxs("label",{className:"glass-text-sm",children:[e.jsx("input",{type:"checkbox",checked:$,onChange:a=>{},className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Continuous"]}),e.jsxs("label",{className:"glass-text-sm",children:[e.jsx("input",{type:"checkbox",checked:m,onChange:a=>{},className:"glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"}),"Visualizer"]})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("span",{className:"glass-text-sm",children:"Audio Level:"}),e.jsx("div",{className:"glass-w-20 glass-h-2 glass-surface-overlay glass-radius-full glass-overflow-hidden",children:e.jsx("div",{className:`glass-h-full glass-surface-green/60 glass-transition-all glass-duration-[${Ke.DURATION.fast/6}ms]`,style:{width:`${N*100}%`}})})]})]}):null;return e.jsx(Ve,{ref:Me,id:Ie,elevation:"level1",intensity:"subtle",depth:1,tint:"neutral",border:"subtle",className:ne("glass-voice-input relative glass-radius-lg glass-glass-backdrop-blur-md glass-contrast-guard border border-border/20",Ne),role:"region","aria-label":"Voice input","data-testid":ke,...Re,children:e.jsxs(Qe,{preset:qe&&_e?"fadeIn":"none",className:"glass-flex glass-flex-col glass-gap-4 glass-p-4",children:[Be(),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-p-3 glass-surface-overlay glass-radius-md",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[e.jsx("div",{className:ne("w-3 h-3 glass-radius-full",l?"bg-green-500 animate-pulse":"bg-red-500")}),e.jsx("span",{className:"glass-text-sm glass-font-medium",children:l?"Listening...":"Ready"}),xe>0&&e.jsxs("span",{className:"glass-text-xs glass-text-secondary",children:[Math.round(xe),"Hz"]})]}),e.jsxs("div",{className:"glass-text-xs glass-text-secondary",children:[S==="denied"&&"Microphone access denied",!z&&"Speech recognition not supported",k.length>0&&`${k.length} commands recognized`]})]}),m&&e.jsx("div",{className:"glass-p-4 glass-surface-overlay glass-radius-md",children:e.jsx("canvas",{ref:J,className:"glass-w-full",style:{height:"100px"}})}),Te&&(ve||ee)&&e.jsxs("div",{className:"glass-p-4 glass-surface-overlay glass-radius-md",children:[e.jsx("div",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Transcript:"}),e.jsxs("div",{className:"glass-text-sm",children:[e.jsx("span",{children:ve}),ee&&e.jsxs("span",{className:"glass-text-secondary glass-italic",children:[" ",ee]})]})]}),k.length>0&&e.jsxs("div",{className:"glass-p-4 glass-surface-overlay glass-radius-md",children:[e.jsx("div",{className:"glass-text-sm glass-font-medium glass-mb-2",children:"Recent Commands:"}),e.jsx("div",{className:"glass-space-y-1",children:k.slice(-5).map(a=>e.jsxs("div",{className:"glass-text-xs glass-p-2 glass-surface-primary/10 glass-radius-sm",children:[e.jsx("span",{className:"glass-font-medium",children:a.phrase}),e.jsxs("span",{className:"glass-text-secondary glass-ml-2",children:["(",Math.round(a.confidence*100),"% confidence)"]})]},a.id))})]})]})})});B.displayName="GlassVoiceInput";try{B.displayName="GlassVoiceInput",B.__docgenInfo={description:"",displayName:"GlassVoiceInput",props:{active:{defaultValue:{value:"false"},description:"Whether voice input is active",name:"active",required:!1,type:{name:"boolean | undefined"}},language:{defaultValue:{value:"en-US"},description:"Voice recognition language",name:"language",required:!1,type:{name:"string | undefined"}},continuous:{defaultValue:{value:"true"},description:"Continuous listening mode",name:"continuous",required:!1,type:{name:"boolean | undefined"}},interimResults:{defaultValue:{value:"true"},description:"Interim results while speaking",name:"interimResults",required:!1,type:{name:"boolean | undefined"}},maxAlternatives:{defaultValue:{value:"1"},description:"Maximum recognition alternatives",name:"maxAlternatives",required:!1,type:{name:"number | undefined"}},commands:{defaultValue:{value:"[]"},description:"Commands to listen for",name:"commands",required:!1,type:{name:"{ phrase: string; action: string; fuzzy?: boolean | undefined; }[] | undefined"}},wakeWord:{defaultValue:null,description:"Wake word for activation",name:"wakeWord",required:!1,type:{name:"string | undefined"}},confidenceThreshold:{defaultValue:{value:"0.7"},description:"Minimum confidence threshold",name:"confidenceThreshold",required:!1,type:{name:"number | undefined"}},showVisualizer:{defaultValue:{value:"true"},description:"Whether to show voice visualizations",name:"showVisualizer",required:!1,type:{name:"boolean | undefined"}},visualizerStyle:{defaultValue:{value:"waveform"},description:"Visualizer style",name:"visualizerStyle",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"particle"'},{value:'"bars"'},{value:'"circular"'},{value:'"waveform"'}]}},showTranscript:{defaultValue:{value:"true"},description:"Whether to show transcript",name:"showTranscript",required:!1,type:{name:"boolean | undefined"}},maxTranscriptLength:{defaultValue:{value:"500"},description:"Maximum transcript length",name:"maxTranscriptLength",required:!1,type:{name:"number | undefined"}},timeout:{defaultValue:{value:"30000"},description:"Voice input timeout",name:"timeout",required:!1,type:{name:"number | undefined"}},noiseSuppression:{defaultValue:{value:"true"},description:"Noise suppression",name:"noiseSuppression",required:!1,type:{name:"boolean | undefined"}},echoCancellation:{defaultValue:{value:"true"},description:"Echo cancellation",name:"echoCancellation",required:!1,type:{name:"boolean | undefined"}},autoGainControl:{defaultValue:{value:"true"},description:"Auto gain control",name:"autoGainControl",required:!1,type:{name:"boolean | undefined"}},onVoiceStart:{defaultValue:null,description:"Voice change handler",name:"onVoiceStart",required:!1,type:{name:"(() => void) | undefined"}},onVoiceEnd:{defaultValue:null,description:"Voice end handler",name:"onVoiceEnd",required:!1,type:{name:"(() => void) | undefined"}},onResult:{defaultValue:null,description:"Speech result handler",name:"onResult",required:!1,type:{name:"((result: string, confidence: number) => void) | undefined"}},onCommand:{defaultValue:null,description:"Command recognition handler",name:"onCommand",required:!1,type:{name:"((command: VoiceCommand) => void) | undefined"}},onError:{defaultValue:null,description:"Error handler",name:"onError",required:!1,type:{name:"((error: string) => void) | undefined"}},onAudioLevel:{defaultValue:null,description:"Audio level handler",name:"onAudioLevel",required:!1,type:{name:"((level: number) => void) | undefined"}},onTranscriptChange:{defaultValue:null,description:"Transcript change handler",name:"onTranscriptChange",required:!1,type:{name:"((transcript: string) => void) | undefined"}},showControls:{defaultValue:{value:"true"},description:"Show controls",name:"showControls",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Respect user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},"data-testid":{defaultValue:null,description:"Custom data-testid for testing",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const ds={title:"Effects + Advanced/Glass Voice Input",component:B,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{language:{control:{type:"select"},options:["en-US","en-GB","es-ES","fr-FR","de-DE","it-IT","ja-JP","ko-KR","zh-CN"]},visualizerStyle:{control:{type:"select"},options:["waveform","circular","bars","particle"]},confidenceThreshold:{control:{type:"range",min:0,max:1,step:.1}},maxTranscriptLength:{control:{type:"range",min:100,max:2e3,step:100}}}},M={args:{showControls:!0,showVisualizer:!0,showTranscript:!0}},q={args:{language:"en-US",continuous:!0,interimResults:!0,showVisualizer:!0,visualizerStyle:"waveform",confidenceThreshold:.7}},I={args:{commands:[{phrase:"hello",action:"greet"},{phrase:"open menu",action:"open_menu"},{phrase:"close window",action:"close_window"},{phrase:"search for",action:"search",fuzzy:!0},{phrase:"navigate to",action:"navigate",fuzzy:!0}],confidenceThreshold:.6,showTranscript:!0,showVisualizer:!0}},A={args:{wakeWord:"hey glass",continuous:!1,commands:[{phrase:"what time is it",action:"get_time"},{phrase:"show weather",action:"show_weather"},{phrase:"play music",action:"play_music"}],showControls:!0}},L={args:{visualizerStyle:"circular",showVisualizer:!0,showTranscript:!1,showControls:!1}},W={args:{visualizerStyle:"bars",showVisualizer:!0,showTranscript:!0,continuous:!0}},E={args:{visualizerStyle:"particle",showVisualizer:!0,showTranscript:!1,showControls:!0}},F={args:{language:"es-ES",commands:[{phrase:"hola",action:"greet"},{phrase:"abre menú",action:"open_menu"},{phrase:"buscar",action:"search",fuzzy:!0}],showTranscript:!0,showControls:!0}},P={args:{confidenceThreshold:.4,interimResults:!0,continuous:!0,maxAlternatives:3,showTranscript:!0}},G={args:{showControls:!1,showVisualizer:!1,showTranscript:!0,continuous:!0,maxTranscriptLength:200}},D={args:{wakeWord:"assistant",commands:[{phrase:"what time is it",action:"get_time"},{phrase:"what day is it",action:"get_date"},{phrase:"open calendar",action:"open_calendar"},{phrase:"set reminder",action:"set_reminder",fuzzy:!0},{phrase:"search web for",action:"web_search",fuzzy:!0},{phrase:"send message to",action:"send_message",fuzzy:!0},{phrase:"call",action:"make_call",fuzzy:!0},{phrase:"play",action:"play_media",fuzzy:!0},{phrase:"stop",action:"stop_media"},{phrase:"volume up",action:"volume_up"},{phrase:"volume down",action:"volume_down"}],confidenceThreshold:.7,continuous:!0,showVisualizer:!0,visualizerStyle:"circular",showTranscript:!0,showControls:!0}},U={args:{active:!1,language:"en-US",continuous:!0,interimResults:!0,commands:[{phrase:"start recording",action:"start_recording"},{phrase:"stop recording",action:"stop_recording"},{phrase:"clear transcript",action:"clear_transcript"},{phrase:"change language",action:"change_language"},{phrase:"switch visualizer",action:"switch_visualizer"}],wakeWord:"wake up",confidenceThreshold:.6,showVisualizer:!0,visualizerStyle:"waveform",showTranscript:!0,maxTranscriptLength:500,showControls:!0,noiseSuppression:!0,echoCancellation:!0,autoGainControl:!0}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    showControls: true,
    showVisualizer: true,
    showTranscript: true
  }
}`,...M.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    language: 'en-US',
    continuous: true,
    interimResults: true,
    showVisualizer: true,
    visualizerStyle: 'waveform',
    confidenceThreshold: 0.7
  }
}`,...q.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    commands: [{
      phrase: 'hello',
      action: 'greet'
    }, {
      phrase: 'open menu',
      action: 'open_menu'
    }, {
      phrase: 'close window',
      action: 'close_window'
    }, {
      phrase: 'search for',
      action: 'search',
      fuzzy: true
    }, {
      phrase: 'navigate to',
      action: 'navigate',
      fuzzy: true
    }],
    confidenceThreshold: 0.6,
    showTranscript: true,
    showVisualizer: true
  }
}`,...I.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    wakeWord: 'hey glass',
    continuous: false,
    commands: [{
      phrase: 'what time is it',
      action: 'get_time'
    }, {
      phrase: 'show weather',
      action: 'show_weather'
    }, {
      phrase: 'play music',
      action: 'play_music'
    }],
    showControls: true
  }
}`,...A.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    visualizerStyle: 'circular',
    showVisualizer: true,
    showTranscript: false,
    showControls: false
  }
}`,...L.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    visualizerStyle: 'bars',
    showVisualizer: true,
    showTranscript: true,
    continuous: true
  }
}`,...W.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    visualizerStyle: 'particle',
    showVisualizer: true,
    showTranscript: false,
    showControls: true
  }
}`,...E.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    language: 'es-ES',
    commands: [{
      phrase: 'hola',
      action: 'greet'
    }, {
      phrase: 'abre menú',
      action: 'open_menu'
    }, {
      phrase: 'buscar',
      action: 'search',
      fuzzy: true
    }],
    showTranscript: true,
    showControls: true
  }
}`,...F.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    confidenceThreshold: 0.4,
    interimResults: true,
    continuous: true,
    maxAlternatives: 3,
    showTranscript: true
  }
}`,...P.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    showControls: false,
    showVisualizer: false,
    showTranscript: true,
    continuous: true,
    maxTranscriptLength: 200
  }
}`,...G.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    wakeWord: 'assistant',
    commands: [{
      phrase: 'what time is it',
      action: 'get_time'
    }, {
      phrase: 'what day is it',
      action: 'get_date'
    }, {
      phrase: 'open calendar',
      action: 'open_calendar'
    }, {
      phrase: 'set reminder',
      action: 'set_reminder',
      fuzzy: true
    }, {
      phrase: 'search web for',
      action: 'web_search',
      fuzzy: true
    }, {
      phrase: 'send message to',
      action: 'send_message',
      fuzzy: true
    }, {
      phrase: 'call',
      action: 'make_call',
      fuzzy: true
    }, {
      phrase: 'play',
      action: 'play_media',
      fuzzy: true
    }, {
      phrase: 'stop',
      action: 'stop_media'
    }, {
      phrase: 'volume up',
      action: 'volume_up'
    }, {
      phrase: 'volume down',
      action: 'volume_down'
    }],
    confidenceThreshold: 0.7,
    continuous: true,
    showVisualizer: true,
    visualizerStyle: 'circular',
    showTranscript: true,
    showControls: true
  }
}`,...D.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    active: false,
    language: 'en-US',
    continuous: true,
    interimResults: true,
    commands: [{
      phrase: 'start recording',
      action: 'start_recording'
    }, {
      phrase: 'stop recording',
      action: 'stop_recording'
    }, {
      phrase: 'clear transcript',
      action: 'clear_transcript'
    }, {
      phrase: 'change language',
      action: 'change_language'
    }, {
      phrase: 'switch visualizer',
      action: 'switch_visualizer'
    }],
    wakeWord: 'wake up',
    confidenceThreshold: 0.6,
    showVisualizer: true,
    visualizerStyle: 'waveform',
    showTranscript: true,
    maxTranscriptLength: 500,
    showControls: true,
    noiseSuppression: true,
    echoCancellation: true,
    autoGainControl: true
  }
}`,...U.parameters?.docs?.source}}};const ps=["Default","BasicVoiceInput","CommandRecognition","WakeWordEnabled","CircularVisualizer","BarsVisualizer","ParticleVisualizer","MultiLanguage","HighSensitivity","MinimalInterface","VoiceAssistant","InteractiveDemo"];export{W as BarsVisualizer,q as BasicVoiceInput,L as CircularVisualizer,I as CommandRecognition,M as Default,P as HighSensitivity,U as InteractiveDemo,G as MinimalInterface,F as MultiLanguage,E as ParticleVisualizer,D as VoiceAssistant,A as WakeWordEnabled,ps as __namedExportsOrder,ds as default};
