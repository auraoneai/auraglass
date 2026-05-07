import{r as u,b as Xe,j as s,m as Ie}from"./iframe-CToTmdO0.js";import{u as Ye}from"./useMotionPreference-BhLipaJT.js";import{u as w}from"./a11y-E_E8Udq3.js";import{c as Je}from"./createGlassStyle-BfWnO-qv.js";import{u as Ke}from"./soundDesign-Dn36MD7A.js";import{O as Qe}from"./OptimizedGlassCore-tBAFSalT.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-BEZRvwEn.js";const Ze={volume:.8,gain:1,bassBoost:0,trebleBoost:0,smoothing:.8,fftSize:256},es={mode:"bars",colorScheme:"rainbow",particleCount:100,sensitivity:1,symmetry:!1,mirror:!1},qe={rainbow:["var(--glass-color-danger)","var(--glass-color-warning)","var(--glass-color-warning)","var(--glass-color-success)","var(--glass-color-success)","var(--glass-color-info)","var(--glass-color-info)","var(--glass-color-primary)","var(--glass-color-primary)","var(--glass-color-secondary)"],monochrome:["var(--glass-white)","color-mix(in srgb, var(--glass-white) 88%, black)","color-mix(in srgb, var(--glass-white) 75%, black)","color-mix(in srgb, var(--glass-white) 63%, black)","color-mix(in srgb, var(--glass-white) 50%, black)","color-mix(in srgb, var(--glass-white) 38%, black)","color-mix(in srgb, var(--glass-white) 25%, black)","color-mix(in srgb, var(--glass-white) 13%, black)"],neon:["#ff00ff","#ff0080","#ff0040","#ff8040","#ffff40","#80ff40","#40ff40","#40ff80","#40ffff","#4080ff"],fire:["#ffff00","#ffcc00","#ff9900","#ff6600","#ff3300","#ff0000","#cc0000","#990000"],ice:["var(--glass-white)","color-mix(in srgb, var(--glass-color-info) 12%, white)","color-mix(in srgb, var(--glass-color-info) 25%, white)","color-mix(in srgb, var(--glass-color-info) 38%, white)","color-mix(in srgb, var(--glass-color-info) 50%, white)","color-mix(in srgb, var(--glass-color-info) 63%, white)","color-mix(in srgb, var(--glass-color-info) 75%, white)","color-mix(in srgb, var(--glass-color-info) 88%, white)"],galaxy:["#1a1a2e","#16213e","#0f3460","#533483","#7209b7","#a663cc","#4cc9f0"]},ee=u.forwardRef(({audioSource:h,audioSettings:Te={},visualSettings:ze={},showControls:We=!0,showFrequencyDisplay:De=!0,showWaveform:ss=!0,showSpectrum:as=!0,realTimeAnalysis:se=!0,enableInteraction:he=!0,enableRecording:ns=!1,canvasWidth:ae=800,canvasHeight:ne=400,onAudioLoad:Me,onFrequencyData:de,onBeatDetected:fe,className:Ne="",...He},Re)=>{Xe();const[x,F]=u.useState(!1),[ke,ts]=u.useState(!1),[ye,pe]=u.useState(0),[ve,Ve]=u.useState(0),[A,Se]=u.useState(new Uint8Array(128)),[rs,be]=u.useState(new Uint8Array(128)),[te,Pe]=u.useState(0),[y,re]=u.useState({...Ze,...Te}),[d,ie]=u.useState({...es,...ze}),oe=u.useRef(null),g=u.useRef(null),S=u.useRef(null),C=u.useRef(null),le=u.useRef(null),p=u.useRef(),j=u.useRef([]),we=w("glass-music-mode"),xe=w("glass-music-color-scheme");w("glass-music-smoothing"),w("glass-music-fft-size");const Ce=w("glass-music-volume");w("glass-music-visualizer");const{shouldAnimate:I}=Ye(),{play:b}=Ke(),q=u.useCallback(async()=>{try{S.current||(S.current=new(window.AudioContext||window.webkitAudioContext));const e=S.current,a=e.createAnalyser();a.fftSize=y.fftSize,a.smoothingTimeConstant=y.smoothing,C.current=a;const t=a.frequencyBinCount;if(Se(new Uint8Array(t)),be(new Uint8Array(t)),h&&typeof h=="string"){const l=g.current;if(l){l.src=h;const n=e.createMediaElementSource(l);n.connect(a),a.connect(e.destination),le.current=n}}else if(h instanceof MediaStream){const l=e.createMediaStreamSource(h);l.connect(a),a.connect(e.destination),le.current=l}}catch{C.current=null,le.current=null}},[h,y.fftSize,y.smoothing]),je=u.useCallback(e=>{const a=Math.floor(e.length*.1),t=Math.floor(e.length*.3);let l=0,n=0;for(let c=0;c<a;c++)l+=e[c];for(let c=a;c<t;c++)n+=e[c];const r=l/a,i=n/(t-a),o=(r+i)/2/255;return Pe(o),o>.7&&fe?.(o),o},[fe]),ce=u.useCallback(()=>{const e=oe.current,a=C.current;if(!e||!a)return;const t=e.getContext("2d");if(!t)return;const l=new Uint8Array(a.frequencyBinCount),n=new Uint8Array(a.frequencyBinCount);a.getByteFrequencyData(l),a.getByteTimeDomainData(n),Se(l),be(n),de?.(l);const r=je(l);t.fillStyle="rgba(var(--glass-color-black) / var(--glass-opacity-10))",t.fillRect(0,0,e.width,e.height);const i=qe[d.colorScheme]||qe.rainbow;switch(d.mode){case"bars":Be(t,l,i,r);break;case"wave":Le(t,n,i,r);break;case"circular":_e(t,l,i,r);break;case"spectrum":Ee(t,l,i);break;case"particles":Ge(t,l,i);break;case"ripples":Ue(t,l,i,r);break}se&&x&&(p.current=requestAnimationFrame(ce))},[d,se,x,je,de]),Be=(e,a,t,l)=>{const n=e.canvas.width/a.length,r=d.sensitivity;for(let i=0;i<a.length;i++){const o=a[i]/255*e.canvas.height*r,c=Math.floor(i/a.length*t.length),m=Math.max(.3,l);e.fillStyle=t[c]+Math.floor(m*255).toString(16).padStart(2,"0"),e.fillRect(i*n,e.canvas.height-o,n-1,o),d.mirror&&e.fillRect(i*n,0,n-1,o)}},Le=(e,a,t,l)=>{e.lineWidth=2+l*3,e.strokeStyle=t[Math.floor(l*t.length)],e.beginPath();const n=e.canvas.width/a.length;let r=0;for(let i=0;i<a.length;i++){const c=a[i]/128*d.sensitivity*e.canvas.height/2;i===0?e.moveTo(r,c):e.lineTo(r,c),r+=n}e.stroke()},_e=(e,a,t,l)=>{const n=e.canvas.width/2,r=e.canvas.height/2,i=Math.min(n,r)*.7;for(let o=0;o<a.length;o++){const c=o/a.length*Math.PI*2,m=a[o]/255*i*d.sensitivity*.5,f=n+Math.cos(c)*i,v=r+Math.sin(c)*i,ue=n+Math.cos(c)*(i+m),me=r+Math.sin(c)*(i+m),ge=Math.floor(o/a.length*t.length);e.strokeStyle=t[ge],e.lineWidth=1+l*2,e.beginPath(),e.moveTo(f,v),e.lineTo(ue,me),e.stroke()}},Ee=(e,a,t,l)=>{const n=e.getImageData(0,0,e.canvas.width,e.canvas.height),r=n.data;for(let o=0;o<e.canvas.width-1;o++)for(let c=0;c<e.canvas.height;c++){const m=(c*e.canvas.width+o+1)*4,f=(c*e.canvas.width+o)*4;r[f]=r[m],r[f+1]=r[m+1],r[f+2]=r[m+2],r[f+3]=r[m+3]}const i=e.canvas.width-1;for(let o=0;o<a.length;o++){const c=Math.floor(o/a.length*e.canvas.height),m=a[o]/255,f=Math.floor(m*t.length),v=t[f]||"var(--glass-white)",ue=parseInt(v.slice(1,3),16),me=parseInt(v.slice(3,5),16),ge=parseInt(v.slice(5,7),16),T=(c*e.canvas.width+i)*4;r[T]=ue*m,r[T+1]=me*m,r[T+2]=ge*m,r[T+3]=255*m}e.putImageData(n,0,0)},Ge=(e,a,t,l)=>{j.current=j.current.filter(n=>(n.x+=n.vx,n.y+=n.vy,n.life-=.01,n.vy+=.1,n.life>0&&n.x>=0&&n.x<=e.canvas.width&&n.y>=0&&n.y<=e.canvas.height));for(let n=0;n<a.length;n+=4)if(j.current.length<d.particleCount){const r=a[n]/255;r>.1&&j.current.push({x:n/a.length*e.canvas.width,y:e.canvas.height-r*e.canvas.height*.5,vx:(Math.random()-.5)*4,vy:-Math.random()*r*5,size:r*5+1,color:t[Math.floor(r*t.length)],life:1})}j.current.forEach(n=>{e.save(),e.globalAlpha=n.life,e.fillStyle=n.color,e.beginPath(),e.arc(n.x,n.y,n.size,0,Math.PI*2),e.fill(),e.restore()})},Ue=(e,a,t,l)=>{const n=e.canvas.width/2,r=e.canvas.height/2;if(a.reduce((i,o)=>i+o,0)/a.length/255,l>.3)for(let o=0;o<5;o++){const c=l*200+o*50,m=Math.max(0,1-c/300);e.strokeStyle=t[o%t.length]+Math.floor(m*255).toString(16).padStart(2,"0"),e.lineWidth=3,e.beginPath(),e.arc(n,r,c,0,Math.PI*2),e.stroke()}for(let i=0;i<a.length;i+=8){const o=i/a.length*Math.PI*2,c=a[i]/255,m=c*100+50,f=n+Math.cos(o)*m,v=r+Math.sin(o)*m;e.fillStyle=t[Math.floor(c*t.length)],e.beginPath(),e.arc(f,v,c*5+1,0,Math.PI*2),e.fill()}},Fe=u.useCallback(async()=>{if(S.current||await q(),g.current)try{await g.current.play(),F(!0),ce(),b("play")}catch{F(!1)}},[q,ce,b]),Ae=u.useCallback(()=>{g.current&&(g.current.pause(),F(!1),p.current&&cancelAnimationFrame(p.current),b("pause"))},[b]),Oe=u.useCallback(()=>{g.current&&(g.current.pause(),g.current.currentTime=0,F(!1),pe(0),p.current&&cancelAnimationFrame(p.current),b("stop"))},[b]);u.useEffect(()=>(h&&q(),()=>{p.current&&cancelAnimationFrame(p.current),S.current&&S.current.close()}),[h,q]),u.useEffect(()=>{const e=oe.current;e&&(e.width=ae,e.height=ne)},[ae,ne]);const $e=()=>s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[s.jsx(Ie.button,{className:"glass-p-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-transition-colors",whileHover:I?{scale:1.1}:{},whileTap:I?{scale:.9}:{},onClick:x?Ae:Fe,children:x?"⏸️":"▶️"}),s.jsx(Ie.button,{className:"glass-p-2 glass-surface-primary hover:glass-surface-primary glass-text-primary glass-radius-lg glass-transition-colors",whileHover:I?{scale:1.1}:{},whileTap:I?{scale:.9}:{},onClick:Oe,children:"⏹️"}),s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[s.jsxs("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:[Math.floor(ye/60),":",Math.floor(ye%60).toString().padStart(2,"0")]}),s.jsx("span",{className:"glass-text-primary-glass-opacity-40",children:"/"}),s.jsxs("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:[Math.floor(ve/60),":",Math.floor(ve%60).toString().padStart(2,"0")]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[s.jsx("label",{htmlFor:Ce,className:"glass-text-xs glass-text-primary-glass-opacity-80",children:"Volume:"}),s.jsx("input",{type:"range",min:"0",max:"1",step:"0.1",value:y.volume,onChange:e=>{const a=parseFloat(e.target.value);re(t=>({...t,volume:a})),g.current&&(g.current.volume=a)},className:"glass-w-16 glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":"Volume",id:Ce})]})]});return s.jsxs(Qe,{ref:Re,variant:"frosted",className:`p-6 space-y-6 ${Ne}`,...He,children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsxs("div",{children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90",children:"Music Visualizer"}),s.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Real-time audio visualization and analysis"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[se&&s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),s.jsx("span",{className:"glass-text-xs",children:"Live"})]}),ke&&s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-red glass-radius-full glass-animate-pulse"}),s.jsx("span",{className:"glass-text-xs",children:"Recording"})]})]})]}),h&&typeof h=="string"&&s.jsx("audio",{ref:g,src:h,onLoadedMetadata:()=>{g.current&&(Ve(g.current.duration),Me?.(g.current.duration))},onTimeUpdate:()=>{g.current&&pe(g.current.currentTime)}}),We&&s.jsx($e,{}),s.jsxs("div",{className:"glass-relative",children:[s.jsx("canvas",{ref:oe,width:ae,height:ne,className:`
              w-full border border-white/20 rounded-lg bg-black/20
              ${he?"cursor-pointer":""}
            `,onClick:he?x?Ae:Fe:void 0}),s.jsx("div",{className:"glass-absolute glass-top-2 glass-right-2",children:s.jsx("div",{className:"glass-w-4 glass-h-4 glass-radius-full glass-surface-red",style:{opacity:te,transform:`scale(${1+te})`}})})]}),s.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-6",children:[s.jsxs("div",{className:"glass-space-y-4",children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Visualization"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{children:[s.jsx("label",{htmlFor:we,className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"Mode"}),s.jsxs("select",{id:we,value:d.mode,onChange:e=>ie(a=>({...a,mode:e.target.value})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"Visualization mode",children:[s.jsx("option",{value:"bars",children:"Frequency Bars"}),s.jsx("option",{value:"wave",children:"Waveform"}),s.jsx("option",{value:"circular",children:"Circular"}),s.jsx("option",{value:"spectrum",children:"Spectrum"}),s.jsx("option",{value:"particles",children:"Particles"}),s.jsx("option",{value:"ripples",children:"Ripples"})]})]}),s.jsxs("div",{children:[s.jsx("label",{htmlFor:xe,className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"Color Scheme"}),s.jsxs("select",{id:xe,value:d.colorScheme,onChange:e=>ie(a=>({...a,colorScheme:e.target.value})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"Color scheme",children:[s.jsx("option",{value:"rainbow",children:"Rainbow"}),s.jsx("option",{value:"monochrome",children:"Monochrome"}),s.jsx("option",{value:"neon",children:"Neon"}),s.jsx("option",{value:"fire",children:"Fire"}),s.jsx("option",{value:"ice",children:"Ice"}),s.jsx("option",{value:"galaxy",children:"Galaxy"})]})]}),s.jsxs("div",{children:[s.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Sensitivity: ",d.sensitivity.toFixed(1)]}),s.jsx("input",{type:"range",min:"0.1",max:"3.0",step:"0.1",value:d.sensitivity,onChange:e=>ie(a=>({...a,sensitivity:parseFloat(e.target.value)})),className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":"Sensitivity"})]})]})]}),s.jsxs("div",{className:"glass-space-y-4",children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Audio Settings"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{children:[s.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Smoothing: ",y.smoothing.toFixed(1)]}),s.jsx("input",{type:"range",min:"0.0",max:"1.0",step:"0.1",value:y.smoothing,onChange:e=>{const a=parseFloat(e.target.value);re(t=>({...t,smoothing:a})),C.current&&(C.current.smoothingTimeConstant=a)},className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":"Smoothing"})]}),s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"FFT Size"}),s.jsxs("select",{value:y.fftSize,onChange:e=>re(a=>({...a,fftSize:parseInt(e.target.value)})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"FFT size",children:[s.jsx("option",{value:"128",children:"128"}),s.jsx("option",{value:"256",children:"256"}),s.jsx("option",{value:"512",children:"512"}),s.jsx("option",{value:"1024",children:"1024"}),s.jsx("option",{value:"2048",children:"2048"})]})]})]})]})]}),De&&s.jsxs("div",{className:`
            p-3 rounded-lg border border-white/10
            ${Je({blur:"sm",opacity:.6}).background}
          `,children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2",children:"Frequency Analysis"}),s.jsxs("div",{className:"glass-grid glass-grid-cols-4 glass-gap-4 glass-text-sm",children:[s.jsxs("div",{children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Bass:"}),s.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[Math.round(A.slice(0,8).reduce((e,a)=>e+a,0)/8/255*100),"%"]})]}),s.jsxs("div",{children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Mid:"}),s.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[Math.round(A.slice(8,32).reduce((e,a)=>e+a,0)/24/255*100),"%"]})]}),s.jsxs("div",{children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Treble:"}),s.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[Math.round(A.slice(32).reduce((e,a)=>e+a,0)/(A.length-32)/255*100),"%"]})]}),s.jsxs("div",{children:[s.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Beat:"}),s.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[Math.round(te*100),"%"]})]})]})]})]})});ee.displayName="GlassMusicVisualizer";try{ee.displayName="GlassMusicVisualizer",ee.__docgenInfo={description:"",displayName:"GlassMusicVisualizer",props:{audioSource:{defaultValue:null,description:"",name:"audioSource",required:!1,type:{name:"string | MediaStream | undefined"}},audioSettings:{defaultValue:{value:"{}"},description:"",name:"audioSettings",required:!1,type:{name:"Partial<AudioSettings> | undefined"}},visualSettings:{defaultValue:{value:"{}"},description:"",name:"visualSettings",required:!1,type:{name:"Partial<VisualizationSettings> | undefined"}},showControls:{defaultValue:{value:"true"},description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showFrequencyDisplay:{defaultValue:{value:"true"},description:"",name:"showFrequencyDisplay",required:!1,type:{name:"boolean | undefined"}},showWaveform:{defaultValue:{value:"true"},description:"",name:"showWaveform",required:!1,type:{name:"boolean | undefined"}},showSpectrum:{defaultValue:{value:"true"},description:"",name:"showSpectrum",required:!1,type:{name:"boolean | undefined"}},realTimeAnalysis:{defaultValue:{value:"true"},description:"",name:"realTimeAnalysis",required:!1,type:{name:"boolean | undefined"}},enableInteraction:{defaultValue:{value:"true"},description:"",name:"enableInteraction",required:!1,type:{name:"boolean | undefined"}},enableRecording:{defaultValue:{value:"false"},description:"",name:"enableRecording",required:!1,type:{name:"boolean | undefined"}},canvasWidth:{defaultValue:{value:"800"},description:"",name:"canvasWidth",required:!1,type:{name:"number | undefined"}},canvasHeight:{defaultValue:{value:"400"},description:"",name:"canvasHeight",required:!1,type:{name:"number | undefined"}},onAudioLoad:{defaultValue:null,description:"",name:"onAudioLoad",required:!1,type:{name:"((duration: number) => void) | undefined"}},onFrequencyData:{defaultValue:null,description:"",name:"onFrequencyData",required:!1,type:{name:"((data: Uint8Array<ArrayBufferLike>) => void) | undefined"}},onBeatDetected:{defaultValue:null,description:"",name:"onBeatDetected",required:!1,type:{name:"((intensity: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const ds={title:"AI + Intelligence/Glass Music Visualizer",component:ee,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{canvasWidth:{control:{type:"range",min:400,max:1200,step:50}},canvasHeight:{control:{type:"range",min:200,max:600,step:50}},showControls:{control:"boolean"},showFrequencyDisplay:{control:"boolean"},showWaveform:{control:"boolean"},showSpectrum:{control:"boolean"},realTimeAnalysis:{control:"boolean"},enableInteraction:{control:"boolean"},enableRecording:{control:"boolean"}}},z={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,showWaveform:!0,showSpectrum:!0,realTimeAnalysis:!0,enableInteraction:!0,enableRecording:!1,audioSettings:{volume:.8,gain:1,bassBoost:0,trebleBoost:0,smoothing:.8,fftSize:256},visualSettings:{mode:"bars",colorScheme:"rainbow",particleCount:100,sensitivity:1,symmetry:!1,mirror:!1}}},W={args:{canvasWidth:800,canvasHeight:300,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"rainbow",sensitivity:1.2,symmetry:!1,mirror:!0},audioSettings:{fftSize:512,smoothing:.7}}},D={args:{canvasWidth:800,canvasHeight:300,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"wave",colorScheme:"neon",sensitivity:1.5,symmetry:!0,mirror:!1},audioSettings:{fftSize:1024,smoothing:.9}}},M={args:{canvasWidth:600,canvasHeight:600,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"circular",colorScheme:"galaxy",sensitivity:1,symmetry:!0,mirror:!1},audioSettings:{fftSize:256,smoothing:.8}}},N={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,showSpectrum:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"spectrum",colorScheme:"fire",sensitivity:1},audioSettings:{fftSize:512,smoothing:.6}}},H={args:{canvasWidth:800,canvasHeight:500,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"particles",colorScheme:"rainbow",particleCount:150,sensitivity:1.3},audioSettings:{fftSize:256,smoothing:.7}}},R={args:{canvasWidth:600,canvasHeight:600,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"ripples",colorScheme:"ice",sensitivity:1.5},audioSettings:{fftSize:256,smoothing:.8}}},k={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"neon",sensitivity:1.2,mirror:!0},audioSettings:{fftSize:512,smoothing:.7}}},V={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"fire",sensitivity:1,mirror:!1},audioSettings:{fftSize:256,smoothing:.8}}},P={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"circular",colorScheme:"ice",sensitivity:.8,symmetry:!0},audioSettings:{fftSize:256,smoothing:.9}}},B={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"wave",colorScheme:"monochrome",sensitivity:1.5},audioSettings:{fftSize:1024,smoothing:.8}}},L={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"rainbow",sensitivity:3,mirror:!0},audioSettings:{fftSize:256,smoothing:.5}}},_={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"rainbow",sensitivity:.3,mirror:!1},audioSettings:{fftSize:256,smoothing:.9}}},E={args:{canvasWidth:1e3,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"galaxy",sensitivity:1},audioSettings:{fftSize:2048,smoothing:.8}}},G={args:{canvasWidth:600,canvasHeight:300,showControls:!1,showFrequencyDisplay:!1,showWaveform:!1,showSpectrum:!1,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"circular",colorScheme:"neon",sensitivity:1}}},U={args:{canvasWidth:800,canvasHeight:200,showControls:!0,showFrequencyDisplay:!1,showWaveform:!1,showSpectrum:!1,realTimeAnalysis:!0,enableInteraction:!1,visualSettings:{mode:"bars",colorScheme:"rainbow",sensitivity:1}}},O={args:{canvasWidth:400,canvasHeight:200,showControls:!1,showFrequencyDisplay:!0,showWaveform:!1,showSpectrum:!1,realTimeAnalysis:!0,enableInteraction:!1,visualSettings:{mode:"bars",colorScheme:"monochrome",sensitivity:1}}},$={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,enableRecording:!0,visualSettings:{mode:"spectrum",colorScheme:"fire",sensitivity:1},audioSettings:{fftSize:512,smoothing:.7}}},X={args:{canvasWidth:1200,canvasHeight:300,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"galaxy",sensitivity:1,mirror:!1},audioSettings:{fftSize:512,smoothing:.8}}},Y={args:{canvasWidth:400,canvasHeight:600,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"neon",sensitivity:1.2,mirror:!0},audioSettings:{fftSize:256,smoothing:.8}}},J={args:{canvasWidth:600,canvasHeight:600,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"circular",colorScheme:"rainbow",sensitivity:1,symmetry:!0,mirror:!1},audioSettings:{fftSize:256,smoothing:.8}}},K={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"ice",sensitivity:1,symmetry:!1,mirror:!0},audioSettings:{fftSize:512,smoothing:.7}}},Q={args:{canvasWidth:800,canvasHeight:500,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"particles",colorScheme:"galaxy",particleCount:300,sensitivity:1.5},audioSettings:{fftSize:256,smoothing:.6}}},Z={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"particles",colorScheme:"neon",particleCount:50,sensitivity:1},audioSettings:{fftSize:256,smoothing:.8}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
      colorScheme: 'neon',
      sensitivity: 1.2,
      mirror: true
    },
    audioSettings: {
      fftSize: 512,
      smoothing: 0.7
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
}`,...V.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
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
}`,...K.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
}`,...Q.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
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
}`,...Z.parameters?.docs?.source}}};const fs=["Default","FrequencyBars","WaveformMode","CircularVisualizer","SpectrumAnalyzer","ParticleSystem","RipplesEffect","NeonTheme","FireTheme","IceTheme","MonochromeMode","HighSensitivity","LowSensitivity","HighResolutionFFT","MinimalInterface","ControlsOnly","FrequencyDisplayOnly","RecordingMode","WideCanvas","TallCanvas","SymmetricVisualization","MirroredBars","HighParticleCount","LowParticleCount"];export{M as CircularVisualizer,U as ControlsOnly,z as Default,V as FireTheme,W as FrequencyBars,O as FrequencyDisplayOnly,Q as HighParticleCount,E as HighResolutionFFT,L as HighSensitivity,P as IceTheme,Z as LowParticleCount,_ as LowSensitivity,G as MinimalInterface,K as MirroredBars,B as MonochromeMode,k as NeonTheme,H as ParticleSystem,$ as RecordingMode,R as RipplesEffect,N as SpectrumAnalyzer,J as SymmetricVisualization,Y as TallCanvas,D as WaveformMode,X as WideCanvas,fs as __namedExportsOrder,ds as default};
