import{r as u,b as $e,j as s,m as Ce}from"./iframe-CmCTHNdg.js";import{u as Xe}from"./useMotionPreference-3eaW2Fyn.js";import{u as b}from"./a11y-CGf66_f7.js";import{c as Ye}from"./createGlassStyle-BfWnO-qv.js";import{u as Je}from"./soundDesign-CHnf3ZWR.js";import{O as Ke}from"./OptimizedGlassCore-DdRXKYNZ.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-BIzeQ8zU.js";const Qe={volume:.8,gain:1,bassBoost:0,trebleBoost:0,smoothing:.8,fftSize:256},Ze={mode:"bars",colorScheme:"rainbow",particleCount:100,sensitivity:1,symmetry:!1,mirror:!1},je={rainbow:["var(--glass-color-danger)","var(--glass-color-warning)","var(--glass-color-warning)","var(--glass-color-success)","var(--glass-color-success)","var(--glass-color-info)","var(--glass-color-info)","var(--glass-color-primary)","var(--glass-color-primary)","var(--glass-color-secondary)"],monochrome:["var(--glass-white)","color-mix(in srgb, var(--glass-white) 88%, black)","color-mix(in srgb, var(--glass-white) 75%, black)","color-mix(in srgb, var(--glass-white) 63%, black)","color-mix(in srgb, var(--glass-white) 50%, black)","color-mix(in srgb, var(--glass-white) 38%, black)","color-mix(in srgb, var(--glass-white) 25%, black)","color-mix(in srgb, var(--glass-white) 13%, black)"],neon:["#ff00ff","#ff0080","#ff0040","#ff8040","#ffff40","#80ff40","#40ff40","#40ff80","#40ffff","#4080ff"],fire:["#ffff00","#ffcc00","#ff9900","#ff6600","#ff3300","#ff0000","#cc0000","#990000"],ice:["var(--glass-white)","color-mix(in srgb, var(--glass-color-info) 12%, white)","color-mix(in srgb, var(--glass-color-info) 25%, white)","color-mix(in srgb, var(--glass-color-info) 38%, white)","color-mix(in srgb, var(--glass-color-info) 50%, white)","color-mix(in srgb, var(--glass-color-info) 63%, white)","color-mix(in srgb, var(--glass-color-info) 75%, white)","color-mix(in srgb, var(--glass-color-info) 88%, white)"],galaxy:["#1a1a2e","#16213e","#0f3460","#533483","#7209b7","#a663cc","#4cc9f0"]},es={"--glass-text-primary":"rgba(15, 23, 42, 0.94)","--typography-text-primary":"rgba(15, 23, 42, 0.94)","--glass-theme-text":"rgba(15, 23, 42, 0.94)",color:"rgba(15, 23, 42, 0.94)"},Z=u.forwardRef(({audioSource:g,audioSettings:Fe={},visualSettings:Ae={},showControls:qe=!0,showFrequencyDisplay:Te=!0,showWaveform:ss=!0,showSpectrum:as=!0,realTimeAnalysis:ee=!0,enableInteraction:ce=!0,enableRecording:ns=!1,canvasWidth:se=800,canvasHeight:ae=400,onAudioLoad:Ie,onFrequencyData:ue,onBeatDetected:me,className:We="",...ze},Me)=>{$e();const[w,F]=u.useState(!1),[De,ts]=u.useState(!1),[ge,he]=u.useState(0),[de,Ne]=u.useState(0),[A,fe]=u.useState(new Uint8Array(128)),[rs,ye]=u.useState(new Uint8Array(128)),[ne,He]=u.useState(0),[f,te]=u.useState({...Qe,...Fe}),[h,re]=u.useState({...Ze,...Ae}),ie=u.useRef(null),m=u.useRef(null),v=u.useRef(null),x=u.useRef(null),oe=u.useRef(null),y=u.useRef(),C=u.useRef([]),pe=b("glass-music-mode"),ve=b("glass-music-color-scheme");b("glass-music-smoothing"),b("glass-music-fft-size");const Se=b("glass-music-volume");b("glass-music-visualizer");const{shouldAnimate:q}=Xe(),{play:S}=Je(),T=u.useCallback(async()=>{try{v.current||(v.current=new(window.AudioContext||window.webkitAudioContext));const e=v.current,a=e.createAnalyser();a.fftSize=f.fftSize,a.smoothingTimeConstant=f.smoothing,x.current=a;const t=a.frequencyBinCount;if(fe(new Uint8Array(t)),ye(new Uint8Array(t)),g&&typeof g=="string"){const i=m.current;if(i){i.src=g;const n=e.createMediaElementSource(i);n.connect(a),a.connect(e.destination),oe.current=n}}else if(g instanceof MediaStream){const i=e.createMediaStreamSource(g);i.connect(a),a.connect(e.destination),oe.current=i}}catch{x.current=null,oe.current=null}},[g,f.fftSize,f.smoothing]),be=u.useCallback(e=>{const a=Math.floor(e.length*.1),t=Math.floor(e.length*.3);let i=0,n=0;for(let c=0;c<a;c++)i+=e[c];for(let c=a;c<t;c++)n+=e[c];const o=i/a,r=n/(t-a),l=(o+r)/2/255;return He(l),l>.7&&me?.(l),l},[me]),le=u.useCallback(()=>{const e=ie.current,a=x.current;if(!e||!a)return;const t=e.getContext("2d");if(!t)return;const i=new Uint8Array(a.frequencyBinCount),n=new Uint8Array(a.frequencyBinCount);a.getByteFrequencyData(i),a.getByteTimeDomainData(n),fe(i),ye(n),ue?.(i);const o=be(i);t.fillStyle="rgba(var(--glass-color-black) / var(--glass-opacity-10))",t.fillRect(0,0,e.width,e.height);const r=je[h.colorScheme]||je.rainbow;switch(h.mode){case"bars":Re(t,i,r,o);break;case"wave":ke(t,n,r,o);break;case"circular":Ve(t,i,r,o);break;case"spectrum":Pe(t,i,r);break;case"particles":Be(t,i,r);break;case"ripples":Ge(t,i,r,o);break}ee&&w&&(y.current=requestAnimationFrame(le))},[h,ee,w,be,ue]),Re=(e,a,t,i)=>{const n=e.canvas.width/a.length,o=h.sensitivity;for(let r=0;r<a.length;r++){const l=a[r]/255*e.canvas.height*o,c=Math.floor(r/a.length*t.length),d=Math.max(.3,i);e.fillStyle=t[c]+Math.floor(d*255).toString(16).padStart(2,"0"),e.fillRect(r*n,e.canvas.height-l,n-1,l),h.mirror&&e.fillRect(r*n,0,n-1,l)}},ke=(e,a,t,i)=>{e.lineWidth=2+i*3,e.strokeStyle=t[Math.floor(i*t.length)],e.beginPath();const n=e.canvas.width/a.length;let o=0;for(let r=0;r<a.length;r++){const c=a[r]/128*h.sensitivity*e.canvas.height/2;r===0?e.moveTo(o,c):e.lineTo(o,c),o+=n}e.stroke()},Ve=(e,a,t,i)=>{const n=e.canvas.width/2,o=e.canvas.height/2,r=Math.min(n,o)*.7;for(let l=0;l<a.length;l++){const c=l/a.length*Math.PI*2,d=a[l]/255*r*h.sensitivity*.5,j=n+Math.cos(c)*r,p=o+Math.sin(c)*r,Ee=n+Math.cos(c)*(r+d),Ue=o+Math.sin(c)*(r+d),Oe=Math.floor(l/a.length*t.length);e.strokeStyle=t[Oe],e.lineWidth=1+i*2,e.beginPath(),e.moveTo(j,p),e.lineTo(Ee,Ue),e.stroke()}},Pe=(e,a,t,i)=>{const{width:n,height:o}=e.canvas;e.drawImage(e.canvas,1,0,n-1,o,0,0,n-1,o),e.clearRect(n-1,0,1,o);const r=n-1;for(let l=0;l<a.length;l++){const c=Math.floor(l/a.length*o),d=a[l]/255,j=Math.floor(d*t.length),p=t[j]||"#ffffff";e.fillStyle=p.startsWith("#")?`${p}${Math.round(d*255).toString(16).padStart(2,"0")}`:p,e.fillRect(r,c,1,Math.max(1,Math.ceil(o/a.length)))}},Be=(e,a,t,i)=>{C.current=C.current.filter(n=>(n.x+=n.vx,n.y+=n.vy,n.life-=.01,n.vy+=.1,n.life>0&&n.x>=0&&n.x<=e.canvas.width&&n.y>=0&&n.y<=e.canvas.height));for(let n=0;n<a.length;n+=4)if(C.current.length<h.particleCount){const o=a[n]/255;o>.1&&C.current.push({x:n/a.length*e.canvas.width,y:e.canvas.height-o*e.canvas.height*.5,vx:(Math.random()-.5)*4,vy:-Math.random()*o*5,size:o*5+1,color:t[Math.floor(o*t.length)],life:1})}C.current.forEach(n=>{e.save(),e.globalAlpha=n.life,e.fillStyle=n.color,e.beginPath(),e.arc(n.x,n.y,n.size,0,Math.PI*2),e.fill(),e.restore()})},Ge=(e,a,t,i)=>{const n=e.canvas.width/2,o=e.canvas.height/2;if(a.reduce((r,l)=>r+l,0)/a.length/255,i>.3)for(let l=0;l<5;l++){const c=i*200+l*50,d=Math.max(0,1-c/300);e.strokeStyle=t[l%t.length]+Math.floor(d*255).toString(16).padStart(2,"0"),e.lineWidth=3,e.beginPath(),e.arc(n,o,c,0,Math.PI*2),e.stroke()}for(let r=0;r<a.length;r+=8){const l=r/a.length*Math.PI*2,c=a[r]/255,d=c*100+50,j=n+Math.cos(l)*d,p=o+Math.sin(l)*d;e.fillStyle=t[Math.floor(c*t.length)],e.beginPath(),e.arc(j,p,c*5+1,0,Math.PI*2),e.fill()}},we=u.useCallback(async()=>{if(v.current||await T(),m.current)try{await m.current.play(),F(!0),le(),S("play")}catch{F(!1)}},[T,le,S]),xe=u.useCallback(()=>{m.current&&(m.current.pause(),F(!1),y.current&&cancelAnimationFrame(y.current),S("pause"))},[S]),Le=u.useCallback(()=>{m.current&&(m.current.pause(),m.current.currentTime=0,F(!1),he(0),y.current&&cancelAnimationFrame(y.current),S("stop"))},[S]);u.useEffect(()=>(g&&T(),()=>{y.current&&cancelAnimationFrame(y.current),v.current&&v.current.close()}),[g,T]),u.useEffect(()=>{const e=ie.current;e&&(e.width=se,e.height=ae)},[se,ae]);const _e=()=>s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[s.jsx(Ce.button,{className:"glass-p-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-transition-colors",whileHover:q?{scale:1.1}:{},whileTap:q?{scale:.9}:{},onClick:w?xe:we,children:w?"⏸️":"▶️"}),s.jsx(Ce.button,{className:"glass-p-2 glass-surface-primary hover:glass-surface-primary glass-text-primary glass-radius-lg glass-transition-colors",whileHover:q?{scale:1.1}:{},whileTap:q?{scale:.9}:{},onClick:Le,children:"⏹️"}),s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[s.jsxs("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:[Math.floor(ge/60),":",Math.floor(ge%60).toString().padStart(2,"0")]}),s.jsx("span",{className:"glass-text-primary-glass-opacity-40",children:"/"}),s.jsxs("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:[Math.floor(de/60),":",Math.floor(de%60).toString().padStart(2,"0")]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[s.jsx("label",{htmlFor:Se,className:"glass-text-xs glass-text-primary-glass-opacity-80",children:"Volume:"}),s.jsx("input",{type:"range",min:"0",max:"1",step:"0.1",value:f.volume,onChange:e=>{const a=parseFloat(e.target.value);te(t=>({...t,volume:a})),m.current&&(m.current.volume=a)},className:"glass-w-16 glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":"Volume",id:Se})]})]});return s.jsxs(Ke,{ref:Me,variant:"frosted",className:`p-6 space-y-6 ${We}`,style:es,...ze,children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsxs("div",{children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90",children:"Music Visualizer"}),s.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Real-time audio visualization and analysis"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[ee&&s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),s.jsx("span",{className:"glass-text-xs",children:"Live"})]}),De&&s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-red glass-radius-full glass-animate-pulse"}),s.jsx("span",{className:"glass-text-xs",children:"Recording"})]})]})]}),g&&typeof g=="string"&&s.jsx("audio",{ref:m,src:g,onLoadedMetadata:()=>{m.current&&(Ne(m.current.duration),Ie?.(m.current.duration))},onTimeUpdate:()=>{m.current&&he(m.current.currentTime)}}),qe&&s.jsx(_e,{}),s.jsxs("div",{className:"glass-relative",children:[s.jsx("canvas",{ref:ie,width:se,height:ae,className:`
              w-full border border-white/20 rounded-lg bg-black/20
              ${ce?"cursor-pointer":""}
            `,onClick:ce?w?xe:we:void 0}),s.jsx("div",{className:"glass-absolute glass-top-2 glass-right-2",children:s.jsx("div",{className:"glass-w-4 glass-h-4 glass-radius-full glass-surface-red",style:{opacity:ne,transform:`scale(${1+ne})`}})})]}),s.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-6",children:[s.jsxs("div",{className:"glass-space-y-4",children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Visualization"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{children:[s.jsx("label",{htmlFor:pe,className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"Mode"}),s.jsxs("select",{id:pe,value:h.mode,onChange:e=>re(a=>({...a,mode:e.target.value})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"Visualization mode",children:[s.jsx("option",{value:"bars",children:"Frequency Bars"}),s.jsx("option",{value:"wave",children:"Waveform"}),s.jsx("option",{value:"circular",children:"Circular"}),s.jsx("option",{value:"spectrum",children:"Spectrum"}),s.jsx("option",{value:"particles",children:"Particles"}),s.jsx("option",{value:"ripples",children:"Ripples"})]})]}),s.jsxs("div",{children:[s.jsx("label",{htmlFor:ve,className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"Color Scheme"}),s.jsxs("select",{id:ve,value:h.colorScheme,onChange:e=>re(a=>({...a,colorScheme:e.target.value})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"Color scheme",children:[s.jsx("option",{value:"rainbow",children:"Rainbow"}),s.jsx("option",{value:"monochrome",children:"Monochrome"}),s.jsx("option",{value:"neon",children:"Neon"}),s.jsx("option",{value:"fire",children:"Fire"}),s.jsx("option",{value:"ice",children:"Ice"}),s.jsx("option",{value:"galaxy",children:"Galaxy"})]})]}),s.jsxs("div",{children:[s.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Sensitivity: ",h.sensitivity.toFixed(1)]}),s.jsx("input",{type:"range",min:"0.1",max:"3.0",step:"0.1",value:h.sensitivity,onChange:e=>re(a=>({...a,sensitivity:parseFloat(e.target.value)})),className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":"Sensitivity"})]})]})]}),s.jsxs("div",{className:"glass-space-y-4",children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Audio Settings"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{children:[s.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Smoothing: ",f.smoothing.toFixed(1)]}),s.jsx("input",{type:"range",min:"0.0",max:"1.0",step:"0.1",value:f.smoothing,onChange:e=>{const a=parseFloat(e.target.value);te(t=>({...t,smoothing:a})),x.current&&(x.current.smoothingTimeConstant=a)},className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":"Smoothing"})]}),s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"FFT Size"}),s.jsxs("select",{value:f.fftSize,onChange:e=>te(a=>({...a,fftSize:parseInt(e.target.value)})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"FFT size",children:[s.jsx("option",{value:"128",children:"128"}),s.jsx("option",{value:"256",children:"256"}),s.jsx("option",{value:"512",children:"512"}),s.jsx("option",{value:"1024",children:"1024"}),s.jsx("option",{value:"2048",children:"2048"})]})]})]})]})]}),Te&&s.jsxs("div",{className:`
            p-3 rounded-lg border border-white/10
            ${Ye({blur:"sm",opacity:.6}).background}
          `,children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2",children:"Frequency Analysis"}),s.jsxs("div",{className:"glass-grid glass-grid-cols-4 glass-gap-4 glass-text-sm",children:[s.jsxs("div",{children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Bass:"}),s.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[Math.round(A.slice(0,8).reduce((e,a)=>e+a,0)/8/255*100),"%"]})]}),s.jsxs("div",{children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Mid:"}),s.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[Math.round(A.slice(8,32).reduce((e,a)=>e+a,0)/24/255*100),"%"]})]}),s.jsxs("div",{children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Treble:"}),s.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[Math.round(A.slice(32).reduce((e,a)=>e+a,0)/(A.length-32)/255*100),"%"]})]}),s.jsxs("div",{children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Beat:"}),s.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[Math.round(ne*100),"%"]})]})]})]})]})});Z.displayName="GlassMusicVisualizer";try{Z.displayName="GlassMusicVisualizer",Z.__docgenInfo={description:"",displayName:"GlassMusicVisualizer",props:{audioSource:{defaultValue:null,description:"",name:"audioSource",required:!1,type:{name:"string | MediaStream | undefined"}},audioSettings:{defaultValue:{value:"{}"},description:"",name:"audioSettings",required:!1,type:{name:"Partial<AudioSettings> | undefined"}},visualSettings:{defaultValue:{value:"{}"},description:"",name:"visualSettings",required:!1,type:{name:"Partial<VisualizationSettings> | undefined"}},showControls:{defaultValue:{value:"true"},description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showFrequencyDisplay:{defaultValue:{value:"true"},description:"",name:"showFrequencyDisplay",required:!1,type:{name:"boolean | undefined"}},showWaveform:{defaultValue:{value:"true"},description:"",name:"showWaveform",required:!1,type:{name:"boolean | undefined"}},showSpectrum:{defaultValue:{value:"true"},description:"",name:"showSpectrum",required:!1,type:{name:"boolean | undefined"}},realTimeAnalysis:{defaultValue:{value:"true"},description:"",name:"realTimeAnalysis",required:!1,type:{name:"boolean | undefined"}},enableInteraction:{defaultValue:{value:"true"},description:"",name:"enableInteraction",required:!1,type:{name:"boolean | undefined"}},enableRecording:{defaultValue:{value:"false"},description:"",name:"enableRecording",required:!1,type:{name:"boolean | undefined"}},canvasWidth:{defaultValue:{value:"800"},description:"",name:"canvasWidth",required:!1,type:{name:"number | undefined"}},canvasHeight:{defaultValue:{value:"400"},description:"",name:"canvasHeight",required:!1,type:{name:"number | undefined"}},onAudioLoad:{defaultValue:null,description:"",name:"onAudioLoad",required:!1,type:{name:"((duration: number) => void) | undefined"}},onFrequencyData:{defaultValue:null,description:"",name:"onFrequencyData",required:!1,type:{name:"((data: Uint8Array<ArrayBufferLike>) => void) | undefined"}},onBeatDetected:{defaultValue:null,description:"",name:"onBeatDetected",required:!1,type:{name:"((intensity: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const ds={title:"AI + Intelligence/Glass Music Visualizer",component:Z,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{canvasWidth:{control:{type:"range",min:400,max:1200,step:50}},canvasHeight:{control:{type:"range",min:200,max:600,step:50}},showControls:{control:"boolean"},showFrequencyDisplay:{control:"boolean"},showWaveform:{control:"boolean"},showSpectrum:{control:"boolean"},realTimeAnalysis:{control:"boolean"},enableInteraction:{control:"boolean"},enableRecording:{control:"boolean"}}},I={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,showWaveform:!0,showSpectrum:!0,realTimeAnalysis:!0,enableInteraction:!0,enableRecording:!1,audioSettings:{volume:.8,gain:1,bassBoost:0,trebleBoost:0,smoothing:.8,fftSize:256},visualSettings:{mode:"bars",colorScheme:"rainbow",particleCount:100,sensitivity:1,symmetry:!1,mirror:!1}}},W={args:{canvasWidth:800,canvasHeight:300,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"rainbow",sensitivity:1.2,symmetry:!1,mirror:!0},audioSettings:{fftSize:512,smoothing:.7}}},z={args:{canvasWidth:800,canvasHeight:300,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"wave",colorScheme:"neon",sensitivity:1.5,symmetry:!0,mirror:!1},audioSettings:{fftSize:1024,smoothing:.9}}},M={args:{canvasWidth:600,canvasHeight:600,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"circular",colorScheme:"galaxy",sensitivity:1,symmetry:!0,mirror:!1},audioSettings:{fftSize:256,smoothing:.8}}},D={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,showSpectrum:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"spectrum",colorScheme:"fire",sensitivity:1},audioSettings:{fftSize:512,smoothing:.6}}},N={args:{canvasWidth:800,canvasHeight:500,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"particles",colorScheme:"rainbow",particleCount:150,sensitivity:1.3},audioSettings:{fftSize:256,smoothing:.7}}},H={args:{canvasWidth:600,canvasHeight:600,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"ripples",colorScheme:"ice",sensitivity:1.5},audioSettings:{fftSize:256,smoothing:.8}}},R={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"neon",sensitivity:1.2,mirror:!0},audioSettings:{fftSize:512,smoothing:.7}}},k={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"fire",sensitivity:1,mirror:!1},audioSettings:{fftSize:256,smoothing:.8}}},V={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"circular",colorScheme:"ice",sensitivity:.8,symmetry:!0},audioSettings:{fftSize:256,smoothing:.9}}},P={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"wave",colorScheme:"monochrome",sensitivity:1.5},audioSettings:{fftSize:1024,smoothing:.8}}},B={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"rainbow",sensitivity:3,mirror:!0},audioSettings:{fftSize:256,smoothing:.5}}},G={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"rainbow",sensitivity:.3,mirror:!1},audioSettings:{fftSize:256,smoothing:.9}}},L={args:{canvasWidth:1e3,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"galaxy",sensitivity:1},audioSettings:{fftSize:2048,smoothing:.8}}},_={args:{canvasWidth:600,canvasHeight:300,showControls:!1,showFrequencyDisplay:!1,showWaveform:!1,showSpectrum:!1,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"circular",colorScheme:"neon",sensitivity:1}}},E={args:{canvasWidth:800,canvasHeight:200,showControls:!0,showFrequencyDisplay:!1,showWaveform:!1,showSpectrum:!1,realTimeAnalysis:!0,enableInteraction:!1,visualSettings:{mode:"bars",colorScheme:"rainbow",sensitivity:1}}},U={args:{canvasWidth:400,canvasHeight:200,showControls:!1,showFrequencyDisplay:!0,showWaveform:!1,showSpectrum:!1,realTimeAnalysis:!0,enableInteraction:!1,visualSettings:{mode:"bars",colorScheme:"monochrome",sensitivity:1}}},O={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,enableRecording:!0,visualSettings:{mode:"spectrum",colorScheme:"fire",sensitivity:1},audioSettings:{fftSize:512,smoothing:.7}}},$={args:{canvasWidth:1200,canvasHeight:300,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"galaxy",sensitivity:1,mirror:!1},audioSettings:{fftSize:512,smoothing:.8}}},X={args:{canvasWidth:400,canvasHeight:600,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"neon",sensitivity:1.2,mirror:!0},audioSettings:{fftSize:256,smoothing:.8}}},Y={args:{canvasWidth:600,canvasHeight:600,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"circular",colorScheme:"rainbow",sensitivity:1,symmetry:!0,mirror:!1},audioSettings:{fftSize:256,smoothing:.8}}},J={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"ice",sensitivity:1,symmetry:!1,mirror:!0},audioSettings:{fftSize:512,smoothing:.7}}},K={args:{canvasWidth:800,canvasHeight:500,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"particles",colorScheme:"galaxy",particleCount:300,sensitivity:1.5},audioSettings:{fftSize:256,smoothing:.6}}},Q={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"particles",colorScheme:"neon",particleCount:50,sensitivity:1},audioSettings:{fftSize:256,smoothing:.8}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    showWaveform: true,
    showSpectrum: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    enableRecording: false,
    audioSettings: {
      volume: 0.8,
      gain: 1.0,
      bassBoost: 0,
      trebleBoost: 0,
      smoothing: 0.8,
      fftSize: 256
    },
    visualSettings: {
      mode: 'bars',
      colorScheme: 'rainbow',
      particleCount: 100,
      sensitivity: 1.0,
      symmetry: false,
      mirror: false
    }
  }
}`,...I.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 800,
    canvasHeight: 300,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'rainbow',
      sensitivity: 1.2,
      symmetry: false,
      mirror: true
    },
    audioSettings: {
      fftSize: 512,
      smoothing: 0.7
    }
  }
}`,...W.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 800,
    canvasHeight: 300,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'wave',
      colorScheme: 'neon',
      sensitivity: 1.5,
      symmetry: true,
      mirror: false
    },
    audioSettings: {
      fftSize: 1024,
      smoothing: 0.9
    }
  }
}`,...z.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 600,
    canvasHeight: 600,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'circular',
      colorScheme: 'galaxy',
      sensitivity: 1.0,
      symmetry: true,
      mirror: false
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.8
    }
  }
}`,...M.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    showSpectrum: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'spectrum',
      colorScheme: 'fire',
      sensitivity: 1.0
    },
    audioSettings: {
      fftSize: 512,
      smoothing: 0.6
    }
  }
}`,...D.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 800,
    canvasHeight: 500,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'particles',
      colorScheme: 'rainbow',
      particleCount: 150,
      sensitivity: 1.3
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.7
    }
  }
}`,...N.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 600,
    canvasHeight: 600,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'ripples',
      colorScheme: 'ice',
      sensitivity: 1.5
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.8
    }
  }
}`,...H.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'neon',
      sensitivity: 1.2,
      mirror: true
    },
    audioSettings: {
      fftSize: 512,
      smoothing: 0.7
    }
  }
}`,...R.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'fire',
      sensitivity: 1.0,
      mirror: false
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.8
    }
  }
}`,...k.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'circular',
      colorScheme: 'ice',
      sensitivity: 0.8,
      symmetry: true
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.9
    }
  }
}`,...V.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'wave',
      colorScheme: 'monochrome',
      sensitivity: 1.5
    },
    audioSettings: {
      fftSize: 1024,
      smoothing: 0.8
    }
  }
}`,...P.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'rainbow',
      sensitivity: 3.0,
      mirror: true
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.5
    }
  }
}`,...B.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'rainbow',
      sensitivity: 0.3,
      mirror: false
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.9
    }
  }
}`,...G.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 1000,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'galaxy',
      sensitivity: 1.0
    },
    audioSettings: {
      fftSize: 2048,
      smoothing: 0.8
    }
  }
}`,...L.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 600,
    canvasHeight: 300,
    showControls: false,
    showFrequencyDisplay: false,
    showWaveform: false,
    showSpectrum: false,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'circular',
      colorScheme: 'neon',
      sensitivity: 1.0
    }
  }
}`,..._.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 800,
    canvasHeight: 200,
    showControls: true,
    showFrequencyDisplay: false,
    showWaveform: false,
    showSpectrum: false,
    realTimeAnalysis: true,
    enableInteraction: false,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'rainbow',
      sensitivity: 1.0
    }
  }
}`,...E.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 400,
    canvasHeight: 200,
    showControls: false,
    showFrequencyDisplay: true,
    showWaveform: false,
    showSpectrum: false,
    realTimeAnalysis: true,
    enableInteraction: false,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'monochrome',
      sensitivity: 1.0
    }
  }
}`,...U.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    enableRecording: true,
    visualSettings: {
      mode: 'spectrum',
      colorScheme: 'fire',
      sensitivity: 1.0
    },
    audioSettings: {
      fftSize: 512,
      smoothing: 0.7
    }
  }
}`,...O.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 1200,
    canvasHeight: 300,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'galaxy',
      sensitivity: 1.0,
      mirror: false
    },
    audioSettings: {
      fftSize: 512,
      smoothing: 0.8
    }
  }
}`,...$.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 400,
    canvasHeight: 600,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'neon',
      sensitivity: 1.2,
      mirror: true
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.8
    }
  }
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 600,
    canvasHeight: 600,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'circular',
      colorScheme: 'rainbow',
      sensitivity: 1.0,
      symmetry: true,
      mirror: false
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.8
    }
  }
}`,...Y.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'bars',
      colorScheme: 'ice',
      sensitivity: 1.0,
      symmetry: false,
      mirror: true
    },
    audioSettings: {
      fftSize: 512,
      smoothing: 0.7
    }
  }
}`,...J.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 800,
    canvasHeight: 500,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'particles',
      colorScheme: 'galaxy',
      particleCount: 300,
      sensitivity: 1.5
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.6
    }
  }
}`,...K.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    canvasWidth: 800,
    canvasHeight: 400,
    showControls: true,
    showFrequencyDisplay: true,
    realTimeAnalysis: true,
    enableInteraction: true,
    visualSettings: {
      mode: 'particles',
      colorScheme: 'neon',
      particleCount: 50,
      sensitivity: 1.0
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.8
    }
  }
}`,...Q.parameters?.docs?.source}}};const fs=["Default","FrequencyBars","WaveformMode","CircularVisualizer","SpectrumAnalyzer","ParticleSystem","RipplesEffect","NeonTheme","FireTheme","IceTheme","MonochromeMode","HighSensitivity","LowSensitivity","HighResolutionFFT","MinimalInterface","ControlsOnly","FrequencyDisplayOnly","RecordingMode","WideCanvas","TallCanvas","SymmetricVisualization","MirroredBars","HighParticleCount","LowParticleCount"];export{M as CircularVisualizer,E as ControlsOnly,I as Default,k as FireTheme,W as FrequencyBars,U as FrequencyDisplayOnly,K as HighParticleCount,L as HighResolutionFFT,B as HighSensitivity,V as IceTheme,Q as LowParticleCount,G as LowSensitivity,_ as MinimalInterface,J as MirroredBars,P as MonochromeMode,R as NeonTheme,N as ParticleSystem,O as RecordingMode,H as RipplesEffect,D as SpectrumAnalyzer,Y as SymmetricVisualization,X as TallCanvas,z as WaveformMode,$ as WideCanvas,fs as __namedExportsOrder,ds as default};
