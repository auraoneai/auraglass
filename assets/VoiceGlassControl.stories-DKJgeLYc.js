import{b as Y,r as l,j as s,m as d,c as E,e as z}from"./iframe-DL0Cy6Qm.js";import{a1 as R,bG as Z,S as ss,ah as O,a2 as as,aO as es,be as ls,bf as ts,bH as rs,u as is,x as $,y as K}from"./components-DpExAbu2.js";import"./preload-helper-PPVm8Dsz.js";const ns=()=>{const[t,N]=l.useState(!1),[S,L]=l.useState(!1),[c,j]=l.useState(!1),[w,q]=l.useState(""),[M,B]=l.useState(""),[k,m]=l.useState(null),[a,n]=l.useState(null),[I,C]=l.useState(!1),[V,h]=l.useState([]);l.useEffect(()=>{if(j(typeof window<"u"&&("webkitSpeechRecognition"in window||"SpeechRecognition"in window)&&"speechSynthesis"in window),typeof window<"u"&&"speechSynthesis"in window){const v=()=>{const p=speechSynthesis.getVoices();h(p)};v(),speechSynthesis.onvoiceschanged=v}},[]);const g=l.useCallback(()=>{if(!c){n("Voice control not supported in this browser");return}N(!0),n(null)},[c]),f=l.useCallback(()=>{N(!1),L(!1),C(!1)},[]),b=l.useCallback(()=>{t?f():g()},[t,g,f]),D=l.useCallback((v,p)=>{if(!c)return;const y=new SpeechSynthesisUtterance(v);p&&(y.voice=p),speechSynthesis.speak(y)},[c]),u=l.useCallback(()=>{n(null)},[]),T=l.useCallback(()=>V,[V]);return{state:{isEnabled:t,isListening:S,isSupported:c,transcript:w,interimTranscript:M,lastCommand:k,error:a,wakeWordDetected:I,lastFeedback:k?.feedback},actions:{enable:g,disable:f,toggle:b,speak:D,clearError:u,getAvailableVoices:T}}},cs=()=>['"Hey Genesis" - wake word to activate voice control','"Show navigation" - open main navigation menu','"Hide navigation" - close main navigation menu','"Go to home" - navigate to home page','"Go to settings" - navigate to settings page','"Scroll up" - scroll page up','"Scroll down" - scroll page down','"Play music" - start playing media','"Pause music" - pause current media','"Next track" - skip to next track','"Previous track" - go to previous track','"Increase volume" - turn up volume','"Decrease volume" - turn down volume','"Show help" - display voice commands help','"Hide help" - close help overlay','"Toggle theme" - switch between light and dark mode','"Show notifications" - open notifications panel','"Hide notifications" - close notifications panel','"Search for [term]" - search for specific content','"Open [app name]" - launch specific application','"Close [window]" - close specific window or panel'];function x({className:t,position:N="top-left",autoEnable:S=!1,showTranscript:L=!0,onVoiceCommand:c,onToggleControls:j,wakeWord:w="Hey Genesis",enableFeedback:q=!0,showHelp:M=!0,maxTranscriptLength:B=100,"data-testid":k}){const m=Y(),{state:a,actions:n}=ns(),[I,C]=l.useState(!1),[V,h]=l.useState(!1),[g,f]=l.useState(null),[b,D]=l.useState(q),[u,T]=l.useState(75),[v,p]=l.useState(!1);l.useEffect(()=>{S&&a.isSupported&&!a.isEnabled&&n.enable()},[S,a.isSupported,a.isEnabled,n]),l.useEffect(()=>{const r=()=>{const e=n.getAvailableVoices();if(e.length>0&&!g){const o=e.find(H=>H.lang.startsWith("en")&&H.localService)||e.find(H=>H.lang.startsWith("en"))||e[0];f(o)}};return r(),typeof window<"u"&&window.speechSynthesis&&(window.speechSynthesis.onvoiceschanged=r),()=>{typeof window<"u"&&window.speechSynthesis&&(window.speechSynthesis.onvoiceschanged=null)}},[n,g]),l.useEffect(()=>{a.lastCommand&&c&&c(a.lastCommand.originalText??a.lastCommand.action,a.lastCommand)},[a.lastCommand,c]),l.useEffect(()=>{a.lastCommand?.type==="TOGGLE_CONTROLS"&&j&&j(a.lastCommand.parameters?.show===!0)},[a.lastCommand,j]);const y=l.useCallback(r=>{const e=r.toLowerCase().trim();if(e.includes("show navigation")||e.includes("open menu"))i({feedback:"Navigation menu opened"});else if(e.includes("hide navigation")||e.includes("close menu"))i({feedback:"Navigation menu closed"});else if(e.includes("go to home"))i({feedback:"Navigating to home"});else if(e.includes("go to settings"))i({feedback:"Opening settings"});else if(e.includes("play music")||e.includes("play"))p(!0),i({feedback:"Playing music"});else if(e.includes("pause music")||e.includes("pause"))p(!1),i({feedback:"Music paused"});else if(e.includes("next track")||e.includes("next"))i({feedback:"Next track"});else if(e.includes("previous track")||e.includes("previous"))i({feedback:"Previous track"});else if(e.includes("increase volume")||e.includes("volume up")){const o=Math.min(100,u+10);T(o),i({feedback:`Volume set to ${o}%`})}else if(e.includes("decrease volume")||e.includes("volume down")){const o=Math.max(0,u-10);T(o),i({feedback:`Volume set to ${o}%`})}else e.includes("toggle theme")?i({feedback:"Theme toggled"}):e.includes("show help")?(h(!0),i({feedback:"Help panel opened"})):e.includes("hide help")?(h(!1),i({feedback:"Help panel closed"})):e.includes("show notifications")?i({feedback:"Notifications panel opened"}):e.includes("hide notifications")?i({feedback:"Notifications panel closed"}):e.includes("what can i say")||e.includes("help")?(h(!0),i({feedback:"Showing available voice commands"})):i({feedback:`I didn't understand: "${r}"`})},[u]),i=r=>{b&&r.feedback&&n.speak(r.feedback,g||void 0)},_={"bottom-left":"bottom-4 left-4","bottom-right":"bottom-4 right-4","top-left":"top-4 left-4","top-right":"top-4 right-4"},U=()=>a.isSupported?a.isListening?s.jsx($,{className:"glass-h-5 glass-w-5 glass-text-primary"}):a.wakeWordDetected?s.jsx($,{className:"glass-h-5 glass-w-5 glass-text-primary glass-animate-pulse"}):a.error?s.jsx(R,{className:"glass-h-5 glass-w-5 glass-text-primary"}):a.isEnabled?s.jsx(K,{className:"glass-h-5 glass-w-5 glass-text-secondary"}):s.jsx(K,{className:"glass-h-5 glass-w-5 glass-text-secondary"}):s.jsx(R,{className:"glass-h-5 glass-w-5 glass-text-primary"}),X=()=>a.isSupported?a.isListening?"border-blue-400 bg-blue-400/10":a.wakeWordDetected?"border-green-400 bg-green-400/10":a.error?"border-red-400 bg-red-400/10":"border-gray-400 bg-gray-400/10":"border-red-400 bg-red-400/10",J=()=>a.isSupported?a.isListening?`Listening for "${w}"...`:a.wakeWordDetected?"Wake word detected! Speak your command...":a.error?a.error:a.isEnabled?"Voice control active - say wake word to begin":"Voice control inactive":"Voice control not supported",Q=()=>{const r=["show navigation","play music","increase volume","toggle theme","show help"],e=r[Math.floor(Math.random()*r.length)];y(e)};return a.isSupported?s.jsx("div",{className:E("fixed z-50",_[N],t),"data-testid":k||"voiceglasscontrol",children:s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-2",children:[s.jsxs(d.div,{className:E("glass-backdrop-blur-lg border p-3 rounded-lg transition-all duration-300 glass-contrast-guard",X()),whileHover:{scale:1.05},children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("button",{onClick:n.toggle,className:"glass-flex glass-items-center glass-justify-center glass-w-10 glass-h-10 glass-radius-full glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",children:U()}),s.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[s.jsx("div",{className:"glass-text-sm glass-font-medium glass-text-primary",children:"Voice Control"}),s.jsx("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-truncate",children:J()})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1",children:[M&&s.jsx("button",{onClick:()=>h(!0),className:"glass-p-1.5 hover:glass-surface-subtle/10 glass-radius glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",title:"Help",children:s.jsx(Z,{className:"glass-h-4 glass-w-4 glass-text-primary-opacity-70"})}),s.jsx("button",{onClick:()=>C(!0),className:"glass-p-1.5 hover:glass-surface-subtle/10 glass-radius glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",title:"Settings",children:s.jsx(ss,{className:"glass-h-4 glass-w-4 glass-text-primary-opacity-70"})})]})]}),a.wakeWordDetected&&s.jsx(d.div,{initial:{opacity:0,y:-10},animate:m?{}:{opacity:1,y:0},exit:{opacity:0,y:-10},className:"glass-mt-2 glass-p-2 glass-surface-green/20 glass-radius glass-text-xs glass-text-primary glass-text-center",children:"🎤 Wake word detected - speak your command now!"}),a.error&&s.jsx(d.div,{initial:{opacity:0,y:-10},animate:m?{}:{opacity:1,y:0},className:"glass-mt-2 glass-p-2 glass-surface-red/20 glass-radius glass-text-xs glass-text-primary",children:s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{children:a.error}),s.jsx("button",{onClick:n.clearError,className:"glass-p-0.5 hover:glass-surface-red/20 glass-radius glass-focus glass-touch-target glass-contrast-guard",children:s.jsx(O,{className:"glass-h-3 glass-w-3"})})]})}),L&&(a.transcript||a.interimTranscript)&&s.jsx(d.div,{initial:{opacity:0,y:-10},animate:m?{}:{opacity:1,y:0},className:"glass-mt-2 glass-p-2 glass-surface-subtle/10 glass-radius glass-text-xs",children:s.jsxs("div",{className:"glass-text-primary glass-font-medium",children:[a.transcript,s.jsx("span",{className:"glass-text-primary-glass-opacity-50 glass-italic",children:a.interimTranscript})]})}),a.lastFeedback&&s.jsx(d.div,{initial:{opacity:0,y:-10},animate:m?{}:{opacity:1,y:0},className:"glass-mt-2 glass-p-2 glass-surface-blue/20 glass-radius glass-text-xs glass-text-primary",children:s.jsxs("div",{className:"glass-flex glass-items-start glass-gap-2",children:[s.jsx(as,{className:"glass-h-3 glass-w-3 glass-mt-0-5 glass-flex-shrink-0"}),s.jsx("span",{children:a.lastFeedback})]})}),v&&s.jsxs(d.div,{initial:{opacity:0,y:-10},animate:m?{}:{opacity:1,y:0},className:"glass-mt-2 glass-flex glass-items-center glass-gap-2 glass-p-2 glass-surface-subtle/10 glass-radius",children:[s.jsx("button",{onClick:()=>p(!1),className:"glass-p-1 hover:glass-surface-subtle/20 glass-radius glass-focus glass-touch-target glass-contrast-guard",title:"Pause",children:s.jsx(es,{className:"glass-h-3 glass-w-3 glass-text-primary"})}),s.jsx("button",{onClick:()=>y("previous track"),className:"glass-p-1 hover:glass-surface-subtle/20 glass-radius glass-focus glass-touch-target glass-contrast-guard",title:"Previous",children:s.jsx(ls,{className:"glass-h-3 glass-w-3 glass-text-primary"})}),s.jsx("button",{onClick:()=>y("next track"),className:"glass-p-1 hover:glass-surface-subtle/20 glass-radius glass-focus glass-touch-target glass-contrast-guard",title:"Next",children:s.jsx(ts,{className:"glass-h-3 glass-w-3 glass-text-primary"})}),s.jsxs("div",{className:"glass-flex-1 glass-flex glass-items-center glass-gap-2",children:[s.jsx(rs,{className:"glass-h-3 glass-w-3 glass-text-primary-opacity-70"}),s.jsx("div",{className:"glass-flex-1 glass-surface-subtle/20 glass-radius-full glass-h-1",children:s.jsx("div",{className:"glass-surface-blue glass-h-1 glass-radius-full glass-transition-all",style:{width:`${u}%`}})}),s.jsxs("span",{className:"glass-text-xs glass-text-primary-opacity-70",children:[u,"%"]})]})]})]}),s.jsx(z,{children:I&&s.jsx(d.div,{initial:{opacity:0,scale:.95,y:20},animate:m?{}:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.95,y:20},children:s.jsxs("div",{className:"glass-backdrop-blur-lg glass-border glass-border-white/20 glass-surface-subtle/10 glass-p-4 glass-radius-lg glass-w-80 glass-contrast-guard",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-3",children:[s.jsx("h3",{className:"glass-font-medium glass-text-primary",children:"Voice Settings"}),s.jsx("button",{onClick:()=>C(!1),className:"glass-p-1 hover:glass-surface-subtle/10 glass-radius glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",children:s.jsx(O,{className:"glass-h-4 glass-w-4 glass-text-primary-opacity-70"})})]}),s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Wake Word"}),s.jsx("input",{type:"text",value:w,readOnly:!0,className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius glass-text-primary glass-text-sm glass-focus glass-touch-target glass-contrast-guard"}),s.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-60 glass-mt-1",children:"Say this to activate voice control"})]}),s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Voice"}),s.jsx("select",{value:g?.name||"",onChange:r=>{const e=n.getAvailableVoices().find(o=>o.name===r.target.value);f(e||null)},className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius glass-text-primary glass-text-sm glass-focus glass-touch-target glass-contrast-guard",children:n.getAvailableVoices().map(r=>s.jsxs("option",{value:r.name,className:"glass-surface-primary",children:[r.name," (",r.lang,")"]},r.name))})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsxs("div",{children:[s.jsx("div",{className:"glass-text-sm glass-font-medium glass-text-primary",children:"Voice Feedback"}),s.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:"Speak command confirmations"})]}),s.jsx("button",{onClick:()=>D(!b),className:E("w-10 h-6 rounded-full transition-colors relative glass-focus glass-touch-target glass-contrast-guard",b?"bg-blue-500":"bg-white/20"),children:s.jsx("div",{className:`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${b?"transform translate-x-4":"translate-x-0.5"}`})})]}),s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Test Commands"}),s.jsx("button",{onClick:Q,className:"glass-w-full glass-p-2 glass-surface-blue/20 hover:glass-surface-blue/30 glass-border glass-border-blue/30 glass-radius glass-text-primary glass-text-sm glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"Try Random Command"}),s.jsx("button",{onClick:()=>n.speak("Voice control is working correctly",g||void 0),className:"glass-w-full glass-p-2 glass-surface-green/20 hover:glass-surface-green/30 glass-border glass-border-green/30 glass-radius glass-text-primary glass-text-sm glass-transition-colors glass-mt-2 glass-focus glass-touch-target glass-contrast-guard",children:"Test Voice Output"})]}),s.jsxs("div",{className:"glass-pt-3 glass-border-t glass-border-white/10 glass-space-y-1 glass-text-xs glass-text-primary-glass-opacity-60",children:[s.jsxs("div",{children:["Status: ",a.isEnabled?"Enabled":"Disabled"]}),s.jsxs("div",{children:["Listening: ",a.isListening?"Active":"Inactive"]}),s.jsxs("div",{children:["Available voices: ",n.getAvailableVoices().length]}),s.jsxs("div",{children:["Volume: ",u,"%"]})]})]})]})})}),s.jsx(z,{children:V&&s.jsx(d.div,{initial:{opacity:0,scale:.95,y:20},animate:m?{}:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.95,y:20},children:s.jsxs("div",{className:"glass-backdrop-blur-lg glass-border glass-border-white/20 glass-surface-subtle/10 glass-p-4 glass-radius-lg glass-w-96 glass-max-h-80 glass-overflow-y-auto glass-contrast-guard",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-3",children:[s.jsx("h3",{className:"glass-font-medium glass-text-primary",children:"Voice Commands"}),s.jsx("button",{onClick:()=>h(!1),className:"glass-p-1 hover:glass-surface-subtle/10 glass-radius glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",children:s.jsx(O,{className:"glass-h-4 glass-w-4 glass-text-primary-opacity-70"})})]}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{className:"glass-text-sm glass-text-primary-glass-opacity-80",children:["Start commands with"," ",s.jsxs("span",{className:"glass-font-mono glass-surface-subtle/20 glass-px-1 glass-radius",children:['"',w,'"']}),":"]}),s.jsx("div",{className:"glass-space-y-2",children:cs().slice(0,10).map((r,e)=>s.jsx("div",{className:"glass-p-2 glass-surface-subtle/5 glass-radius glass-text-sm",children:s.jsxs("div",{className:"glass-text-primary glass-font-mono",children:['"',r,'"']})},e))}),s.jsx("div",{className:"glass-pt-3 glass-border-t glass-border-white/10",children:s.jsxs("div",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-mb-1",children:[s.jsx(is,{className:"glass-h-3 glass-w-3"}),s.jsx("span",{children:"Tips:"})]}),s.jsxs("ul",{className:"glass-list-disc glass-list-inside glass-space-y-1 glass-ml-5",children:[s.jsx("li",{children:"Speak clearly and at normal volume"}),s.jsx("li",{children:"Wait for the wake word confirmation"}),s.jsx("li",{children:"Use natural language variations"}),s.jsx("li",{children:"Check your microphone permissions"})]})]})})]})]})})})]})}):s.jsx("div",{className:E("fixed z-50",_[N],t),"data-testid":k||"voiceglasscontrol",children:s.jsx(d.div,{className:"glass-backdrop-blur-lg glass-border glass-border-red/20 glass-surface-red/10 glass-p-3 glass-radius-lg glass-contrast-guard",whileHover:{scale:1.05},children:s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-text-primary",children:[s.jsx(R,{className:"glass-h-4 glass-w-4"}),s.jsx("span",{className:"glass-text-sm",children:"Voice control not supported"})]})})})}try{x.displayName="VoiceGlassControl",x.__docgenInfo={description:"",displayName:"VoiceGlassControl",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},position:{defaultValue:{value:"top-left"},description:"",name:"position",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"top-right"'},{value:'"top-left"'},{value:'"bottom-right"'},{value:'"bottom-left"'}]}},autoEnable:{defaultValue:{value:"false"},description:"",name:"autoEnable",required:!1,type:{name:"boolean | undefined"}},showTranscript:{defaultValue:{value:"true"},description:"",name:"showTranscript",required:!1,type:{name:"boolean | undefined"}},onVoiceCommand:{defaultValue:null,description:"",name:"onVoiceCommand",required:!1,type:{name:"((command: string, result: VoiceCommandResult) => void) | undefined"}},onToggleControls:{defaultValue:null,description:"",name:"onToggleControls",required:!1,type:{name:"((show: boolean) => void) | undefined"}},wakeWord:{defaultValue:{value:"Hey Genesis"},description:"",name:"wakeWord",required:!1,type:{name:"string | undefined"}},enableFeedback:{defaultValue:{value:"true"},description:"",name:"enableFeedback",required:!1,type:{name:"boolean | undefined"}},showHelp:{defaultValue:{value:"true"},description:"",name:"showHelp",required:!1,type:{name:"boolean | undefined"}},maxTranscriptLength:{defaultValue:{value:"100"},description:"",name:"maxTranscriptLength",required:!1,type:{name:"number | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const gs=`
  .ag-voice-story {
    --glass-text-primary: #f8fafc;
    --glass-text-secondary: #e2e8f0;
    --glass-text-tertiary: #cbd5e1;
    --typography-text-primary: #f8fafc;
    --typography-text-secondary: #e2e8f0;
    height: 100vh;
    min-height: 100vh;
    width: 100%;
    overflow: auto;
    box-sizing: border-box;
    background:
      radial-gradient(circle at 16% 12%, rgba(236, 72, 153, 0.24), transparent 32%),
      radial-gradient(circle at 82% 18%, rgba(20, 184, 166, 0.24), transparent 28%),
      linear-gradient(135deg, #0f172a 0%, #312e81 48%, #0f766e 100%);
    color: #f8fafc;
    padding: clamp(16px, 4vw, 32px);
  }

  .ag-voice-story,
  .ag-voice-story *,
  .ag-voice-story *::before,
  .ag-voice-story *::after {
    box-sizing: border-box;
  }

  .ag-voice-story .glass-text-primary,
  .ag-voice-story .glass-text-secondary,
  .ag-voice-story h1,
  .ag-voice-story h2,
  .ag-voice-story h3,
  .ag-voice-story p,
  .ag-voice-story span,
  .ag-voice-story div {
    color: #f8fafc !important;
  }

  .ag-voice-story .glass-surface-subtle\\/10 {
    background: rgba(15, 23, 42, 0.78) !important;
  }

  .ag-voice-story .glass-surface-subtle\\/20 {
    background: rgba(30, 41, 59, 0.82) !important;
  }

  .ag-voice-story .glass-contrast-guard {
    color: #f8fafc !important;
  }

  .ag-voice-story button {
    background: rgba(15, 23, 42, 0.88) !important;
    color: #f8fafc !important;
    border-color: rgba(226, 232, 240, 0.24) !important;
  }

  .ag-voice-story .glass-grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .ag-voice-story .glass-grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ag-voice-story .max-w-4xl {
    max-width: 56rem;
  }

  .ag-voice-story .max-w-6xl {
    max-width: 72rem;
  }

  .ag-voice-story .mb-8 {
    margin-bottom: 2rem;
  }

  .ag-voice-story [data-testid="voiceglasscontrol"] {
    max-width: calc(100vw - 32px);
    color: #f8fafc !important;
  }

  .ag-voice-story [data-testid="voiceglasscontrol"] .glass-w-80,
  .ag-voice-story [data-testid="voiceglasscontrol"] .glass-w-96 {
    width: min(24rem, calc(100vw - 32px));
    max-width: calc(100vw - 32px);
  }

  @media (max-width: 640px) {
    .ag-voice-story {
      padding: 16px;
    }

    .ag-voice-story [data-testid="voiceglasscontrol"] {
      left: 16px !important;
      right: 16px !important;
      width: auto;
      max-width: calc(100vw - 32px);
    }
  }

  @media (min-width: 768px) {
    .ag-voice-story .md\\:glass-grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .ag-voice-story .md\\:glass-grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .ag-voice-story .md\\:glass-grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
`,us={title:"Effects + Advanced/Voice Glass Control",component:x,parameters:{layout:"fullscreen",docs:{description:{component:"Advanced voice interaction system with wake word detection, natural language processing, and hands-free glass UI control."}}},argTypes:{position:{control:{type:"select",options:["bottom-left","bottom-right","top-left","top-right"]},description:"Control panel position"},autoEnable:{control:"boolean",description:"Automatically enable on mount"},showTranscript:{control:"boolean",description:"Display speech transcript"},wakeWord:{control:"text",description:"Wake word for activation"},enableFeedback:{control:"boolean",description:"Enable voice feedback"},showHelp:{control:"boolean",description:"Show help button"}},decorators:[t=>s.jsxs(s.Fragment,{children:[s.jsx("style",{children:gs}),s.jsx(t,{})]})]},W={args:{position:"top-left",autoEnable:!1,showTranscript:!0,wakeWord:"Hey Genesis",enableFeedback:!0,showHelp:!0},render:t=>s.jsx("div",{className:"ag-voice-story glass-min-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8",children:"Voice Control Demo"}),s.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-6 mb-8",children:[s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4",children:"Voice Commands"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-sm glass-text-secondary",children:[s.jsx("p",{children:'Try saying: "Hey Genesis"'}),s.jsx("p",{children:'• "Show navigation"'}),s.jsx("p",{children:'• "Play music"'}),s.jsx("p",{children:'• "Increase volume"'}),s.jsx("p",{children:'• "Toggle theme"'}),s.jsx("p",{children:'• "Show help"'})]})]}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4",children:"Voice Features"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full"}),s.jsx("span",{className:"glass-text-sm glass-text-secondary",children:"Wake word detection"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-blue glass-radius-full"}),s.jsx("span",{className:"glass-text-sm glass-text-secondary",children:"Natural language processing"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-primary glass-radius-full"}),s.jsx("span",{className:"glass-text-sm glass-text-secondary",children:"Voice feedback"})]})]})]})]}),s.jsx(x,{...t})]})})},P={args:{position:"bottom-right",autoEnable:!0,showTranscript:!0,wakeWord:"Hey Music",enableFeedback:!0,showHelp:!0},render:t=>s.jsx("div",{className:"ag-voice-story glass-min-h-screen glass-gradient-primary glass-gradient-primary via-pink-900 glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary mb-8",children:"Voice Music Player"}),s.jsxs("div",{className:"glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-xl glass-p-6 mb-8 glass-contrast-guard",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsxs("div",{children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:"Now Playing"}),s.jsx("p",{className:"glass-text-primary",children:"Song Title - Artist Name"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-4",children:[s.jsx("button",{className:"glass-p-2 glass-surface-subtle/20 glass-radius-lg hover:glass-surface-subtle/30 transition-colors",children:"⏮️"}),s.jsx("button",{className:"glass-p-3 glass-surface-subtle/20 glass-radius-lg hover:glass-surface-subtle/30 transition-colors",children:"▶️"}),s.jsx("button",{className:"glass-p-2 glass-surface-subtle/20 glass-radius-lg hover:glass-surface-subtle/30 transition-colors",children:"⏭️"})]})]}),s.jsxs("div",{className:"glass-mb-4",children:[s.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:s.jsx("div",{className:"glass-surface-subtle glass-h-2 glass-radius-full",style:{width:"30%"}})}),s.jsxs("div",{className:"glass-flex glass-justify-between glass-text-sm glass-text-primary mt-1",children:[s.jsx("span",{children:"1:23"}),s.jsx("span",{children:"4:15"})]})]}),s.jsx("div",{className:"glass-text-center glass-text-primary glass-text-sm",children:'Try saying: "Play music", "Pause music", "Next track", "Increase volume"'})]}),s.jsx(x,{...t})]})})},F={args:{position:"top-right",autoEnable:!0,showTranscript:!0,wakeWord:"Hey Home",enableFeedback:!0,showHelp:!0},render:t=>s.jsx("div",{className:"ag-voice-story glass-min-h-screen glass-gradient-primary glass-gradient-primary via-teal-900 glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary mb-8",children:"Smart Home Control"}),s.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-6 mb-8",children:[s.jsxs("div",{className:"glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-xl glass-p-6 glass-contrast-guard",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary",children:"Living Room"}),s.jsx("div",{className:"glass-w-3 glass-h-3 glass-surface-yellow glass-radius-full"})]}),s.jsxs("div",{className:"glass-space-y-2 glass-text-sm glass-text-primary",children:[s.jsx("p",{children:"💡 Lights: On"}),s.jsx("p",{children:"🌡️ Temperature: 72°F"}),s.jsx("p",{children:"🎵 Music: Playing"})]})]}),s.jsxs("div",{className:"glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-xl glass-p-6 glass-contrast-guard",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary",children:"Kitchen"}),s.jsx("div",{className:"glass-w-3 glass-h-3 glass-surface-green glass-radius-full"})]}),s.jsxs("div",{className:"glass-space-y-2 glass-text-sm glass-text-primary",children:[s.jsx("p",{children:"💡 Lights: Off"}),s.jsx("p",{children:"🌡️ Temperature: 70°F"}),s.jsx("p",{children:"🔒 Security: Armed"})]})]}),s.jsxs("div",{className:"glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-xl glass-p-6 glass-contrast-guard",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary",children:"Bedroom"}),s.jsx("div",{className:"glass-w-3 glass-h-3 glass-surface-blue glass-radius-full"})]}),s.jsxs("div",{className:"glass-space-y-2 glass-text-sm glass-text-primary",children:[s.jsx("p",{children:"💡 Lights: Dimmed"}),s.jsx("p",{children:"🌡️ Temperature: 68°F"}),s.jsx("p",{children:"😴 Sleep Mode: Active"})]})]})]}),s.jsxs("div",{className:"glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-xl glass-p-6 mb-8 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary glass-mb-4",children:"Voice Commands"}),s.jsxs("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4 glass-text-sm glass-text-primary",children:[s.jsx("div",{children:'"Turn on lights"'}),s.jsx("div",{children:'"Set temperature to 72"'}),s.jsx("div",{children:'"Play music"'}),s.jsx("div",{children:'"Arm security"'}),s.jsx("div",{children:'"Good night"'}),s.jsx("div",{children:'"Wake up"'}),s.jsx("div",{children:'"Lock doors"'}),s.jsx("div",{children:'"Show cameras"'})]})]}),s.jsx(x,{...t})]})})},A={args:{position:"bottom-left",autoEnable:!0,showTranscript:!0,wakeWord:"Hey Assist",enableFeedback:!0,showHelp:!0},render:t=>s.jsx("div",{className:"ag-voice-story glass-min-h-screen glass-surface-subtle glass-p-8",children:s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-secondary mb-8",children:"Accessibility Assistant"}),s.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-6 mb-8",children:[s.jsxs("div",{className:"glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4",children:"Screen Reader Support"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-sm glass-text-secondary",children:[s.jsx("p",{children:"🔊 Voice feedback for all actions"}),s.jsx("p",{children:"📖 Detailed descriptions"}),s.jsx("p",{children:"🎯 Focus management"}),s.jsx("p",{children:"⌨️ Keyboard navigation"})]})]}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4",children:"Voice Commands"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-sm glass-text-secondary",children:[s.jsx("p",{children:'"Read this page"'}),s.jsx("p",{children:'"Show help"'}),s.jsx("p",{children:'"Increase text size"'}),s.jsx("p",{children:'"Toggle high contrast"'})]})]})]}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-blue-200 mb-8",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary glass-mb-4",children:"Try These Commands"}),s.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4 glass-text-sm glass-text-primary",children:[s.jsx("div",{children:`"What's on this page?"`}),s.jsx("div",{children:'"Read the main content"'}),s.jsx("div",{children:'"Show navigation menu"'}),s.jsx("div",{children:'"Go to settings"'}),s.jsx("div",{children:'"Increase font size"'}),s.jsx("div",{children:'"Toggle dark mode"'})]})]}),s.jsx(x,{...t})]})})},G={args:{position:"top-left",autoEnable:!1,showTranscript:!1,wakeWord:"Hey",enableFeedback:!1,showHelp:!1},render:t=>s.jsx("div",{className:"ag-voice-story glass-min-h-screen glass-surface-subtle glass-p-8",children:s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-2xl glass-font-bold glass-text-secondary mb-8",children:"Minimal Voice Control"}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle glass-shadow-sm",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4",children:"Clean Interface"}),s.jsx("p",{className:"glass-text-secondary glass-mb-4",children:"Minimal voice control interface with essential features only. Perfect for applications that need subtle voice interaction."}),s.jsx("div",{className:"glass-text-sm glass-text-secondary",children:'Say "Hey" to activate voice control'})]}),s.jsx(x,{...t})]})})};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    position: "top-left",
    autoEnable: false,
    showTranscript: true,
    wakeWord: "Hey Genesis",
    enableFeedback: true,
    showHelp: true
  },
  render: (args: any) => <div className="ag-voice-story glass-min-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8">
          Voice Control Demo
        </h1>

        <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-6 mb-8">
          <div className="glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4">
              Voice Commands
            </h3>
            <div className="glass-space-y-2 glass-text-sm glass-text-secondary">
              <p>Try saying: "Hey Genesis"</p>
              <p>• "Show navigation"</p>
              <p>• "Play music"</p>
              <p>• "Increase volume"</p>
              <p>• "Toggle theme"</p>
              <p>• "Show help"</p>
            </div>
          </div>

          <div className="glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4">
              Voice Features
            </h3>
            <div className="glass-space-y-3">
              <div className="glass-flex glass-items-center glass-gap-2">
                <div className="glass-w-2 glass-h-2 glass-surface-green glass-radius-full"></div>
                <span className="glass-text-sm glass-text-secondary">
                  Wake word detection
                </span>
              </div>
              <div className="glass-flex glass-items-center glass-gap-2">
                <div className="glass-w-2 glass-h-2 glass-surface-blue glass-radius-full"></div>
                <span className="glass-text-sm glass-text-secondary">
                  Natural language processing
                </span>
              </div>
              <div className="glass-flex glass-items-center glass-gap-2">
                <div className="glass-w-2 glass-h-2 glass-surface-primary glass-radius-full"></div>
                <span className="glass-text-sm glass-text-secondary">
                  Voice feedback
                </span>
              </div>
            </div>
          </div>
        </div>

        <VoiceGlassControl {...args} />
      </div>
    </div>
}`,...W.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    position: "bottom-right",
    autoEnable: true,
    showTranscript: true,
    wakeWord: "Hey Music",
    enableFeedback: true,
    showHelp: true
  },
  render: (args: any) => <div className="ag-voice-story glass-min-h-screen glass-gradient-primary glass-gradient-primary via-pink-900 glass-gradient-primary glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-primary mb-8">
          Voice Music Player
        </h1>

        <div className="glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-xl glass-p-6 mb-8 glass-contrast-guard">
          <div className="glass-flex glass-items-center glass-justify-between glass-mb-4">
            <div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary">
                Now Playing
              </h3>
              <p className="glass-text-primary">Song Title - Artist Name</p>
            </div>
            <div className="glass-flex glass-items-center glass-gap-4">
              <button className="glass-p-2 glass-surface-subtle/20 glass-radius-lg hover:glass-surface-subtle/30 transition-colors">
                ⏮️
              </button>
              <button className="glass-p-3 glass-surface-subtle/20 glass-radius-lg hover:glass-surface-subtle/30 transition-colors">
                ▶️
              </button>
              <button className="glass-p-2 glass-surface-subtle/20 glass-radius-lg hover:glass-surface-subtle/30 transition-colors">
                ⏭️
              </button>
            </div>
          </div>

          <div className="glass-mb-4">
            <div className="glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2">
              <div className="glass-surface-subtle glass-h-2 glass-radius-full" style={{
              width: "30%"
            }}></div>
            </div>
            <div className="glass-flex glass-justify-between glass-text-sm glass-text-primary mt-1">
              <span>1:23</span>
              <span>4:15</span>
            </div>
          </div>

          <div className="glass-text-center glass-text-primary glass-text-sm">
            Try saying: "Play music", "Pause music", "Next track", "Increase
            volume"
          </div>
        </div>

        <VoiceGlassControl {...args} />
      </div>
    </div>
}`,...P.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    position: "top-right",
    autoEnable: true,
    showTranscript: true,
    wakeWord: "Hey Home",
    enableFeedback: true,
    showHelp: true
  },
  render: (args: any) => <div className="ag-voice-story glass-min-h-screen glass-gradient-primary glass-gradient-primary via-teal-900 glass-gradient-primary glass-p-8">
      <div className="max-w-6xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-primary mb-8">
          Smart Home Control
        </h1>

        <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-6 mb-8">
          <div className="glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-xl glass-p-6 glass-contrast-guard">
            <div className="glass-flex glass-items-center glass-justify-between glass-mb-4">
              <h3 className="glass-text-lg glass-font-semibold glass-text-primary">
                Living Room
              </h3>
              <div className="glass-w-3 glass-h-3 glass-surface-yellow glass-radius-full"></div>
            </div>
            <div className="glass-space-y-2 glass-text-sm glass-text-primary">
              <p>💡 Lights: On</p>
              <p>🌡️ Temperature: 72°F</p>
              <p>🎵 Music: Playing</p>
            </div>
          </div>

          <div className="glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-xl glass-p-6 glass-contrast-guard">
            <div className="glass-flex glass-items-center glass-justify-between glass-mb-4">
              <h3 className="glass-text-lg glass-font-semibold glass-text-primary">
                Kitchen
              </h3>
              <div className="glass-w-3 glass-h-3 glass-surface-green glass-radius-full"></div>
            </div>
            <div className="glass-space-y-2 glass-text-sm glass-text-primary">
              <p>💡 Lights: Off</p>
              <p>🌡️ Temperature: 70°F</p>
              <p>🔒 Security: Armed</p>
            </div>
          </div>

          <div className="glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-xl glass-p-6 glass-contrast-guard">
            <div className="glass-flex glass-items-center glass-justify-between glass-mb-4">
              <h3 className="glass-text-lg glass-font-semibold glass-text-primary">
                Bedroom
              </h3>
              <div className="glass-w-3 glass-h-3 glass-surface-blue glass-radius-full"></div>
            </div>
            <div className="glass-space-y-2 glass-text-sm glass-text-primary">
              <p>💡 Lights: Dimmed</p>
              <p>🌡️ Temperature: 68°F</p>
              <p>😴 Sleep Mode: Active</p>
            </div>
          </div>
        </div>

        <div className="glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-xl glass-p-6 mb-8 glass-contrast-guard">
          <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-4">
            Voice Commands
          </h3>
          <div className="glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4 glass-text-sm glass-text-primary">
            <div>"Turn on lights"</div>
            <div>"Set temperature to 72"</div>
            <div>"Play music"</div>
            <div>"Arm security"</div>
            <div>"Good night"</div>
            <div>"Wake up"</div>
            <div>"Lock doors"</div>
            <div>"Show cameras"</div>
          </div>
        </div>

        <VoiceGlassControl {...args} />
      </div>
    </div>
}`,...F.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    position: "bottom-left",
    autoEnable: true,
    showTranscript: true,
    wakeWord: "Hey Assist",
    enableFeedback: true,
    showHelp: true
  },
  render: (args: any) => <div className="ag-voice-story glass-min-h-screen glass-surface-subtle glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary mb-8">
          Accessibility Assistant
        </h1>

        <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-6 mb-8">
          <div className="glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle">
            <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">
              Screen Reader Support
            </h3>
            <div className="glass-space-y-2 glass-text-sm glass-text-secondary">
              <p>🔊 Voice feedback for all actions</p>
              <p>📖 Detailed descriptions</p>
              <p>🎯 Focus management</p>
              <p>⌨️ Keyboard navigation</p>
            </div>
          </div>

          <div className="glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle">
            <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">
              Voice Commands
            </h3>
            <div className="glass-space-y-2 glass-text-sm glass-text-secondary">
              <p>"Read this page"</p>
              <p>"Show help"</p>
              <p>"Increase text size"</p>
              <p>"Toggle high contrast"</p>
            </div>
          </div>
        </div>

        <div className="glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-blue-200 mb-8">
          <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-4">
            Try These Commands
          </h3>
          <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4 glass-text-sm glass-text-primary">
            <div>"What's on this page?"</div>
            <div>"Read the main content"</div>
            <div>"Show navigation menu"</div>
            <div>"Go to settings"</div>
            <div>"Increase font size"</div>
            <div>"Toggle dark mode"</div>
          </div>
        </div>

        <VoiceGlassControl {...args} />
      </div>
    </div>
}`,...A.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    position: "top-left",
    autoEnable: false,
    showTranscript: false,
    wakeWord: "Hey",
    enableFeedback: false,
    showHelp: false
  },
  render: (args: any) => <div className="ag-voice-story glass-min-h-screen glass-surface-subtle glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-2xl glass-font-bold glass-text-secondary mb-8">
          Minimal Voice Control
        </h1>

        <div className="glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle glass-shadow-sm">
          <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">
            Clean Interface
          </h3>
          <p className="glass-text-secondary glass-mb-4">
            Minimal voice control interface with essential features only.
            Perfect for applications that need subtle voice interaction.
          </p>
          <div className="glass-text-sm glass-text-secondary">
            Say "Hey" to activate voice control
          </div>
        </div>

        <VoiceGlassControl {...args} />
      </div>
    </div>
}`,...G.parameters?.docs?.source}}};const ps=["Default","MusicPlayer","SmartHome","Accessibility","Minimal"];export{A as Accessibility,W as Default,G as Minimal,P as MusicPlayer,F as SmartHome,ps as __namedExportsOrder,us as default};
