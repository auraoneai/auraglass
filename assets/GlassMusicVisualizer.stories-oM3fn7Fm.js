import{r as u,b as es,j as a,c as w,m as ze}from"./iframe-BGoRE5Do.js";import{u as ss}from"./useMotionPreference-Ct6LqXAq.js";import{u as A}from"./a11y-BGeEhmxI.js";import{c as as}from"./createGlassStyle-BfWnO-qv.js";import{u as ns}from"./soundDesign-wB5--F2R.js";import{O as ts}from"./OptimizedGlassCore-MyIZufQF.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-DE3cL9ZV.js";const rs={volume:.8,gain:1,bassBoost:0,trebleBoost:0,smoothing:.8,fftSize:256},is={mode:"bars",colorScheme:"rainbow",particleCount:100,sensitivity:1,symmetry:!1,mirror:!1},k={rainbow:["hsl(var(--glass-color-danger))","hsl(var(--glass-color-warning))","hsl(var(--glass-color-warning))","hsl(var(--glass-color-success))","hsl(var(--glass-color-success))","hsl(var(--glass-color-info))","hsl(var(--glass-color-info))","hsl(var(--glass-color-primary))","hsl(var(--glass-color-primary))","var(--glass-color-secondary)"],monochrome:["var(--glass-white)","color-mix(in srgb, var(--glass-white) 88%, black)","color-mix(in srgb, var(--glass-white) 75%, black)","color-mix(in srgb, var(--glass-white) 63%, black)","color-mix(in srgb, var(--glass-white) 50%, black)","color-mix(in srgb, var(--glass-white) 38%, black)","color-mix(in srgb, var(--glass-white) 25%, black)","color-mix(in srgb, var(--glass-white) 13%, black)"],neon:["#ff00ff","#ff0080","#ff0040","#ff8040","#ffff40","#80ff40","#40ff40","#40ff80","#40ffff","#4080ff"],fire:["#ffff00","#ffcc00","#ff9900","#ff6600","#ff3300","#ff0000","#cc0000","#990000"],ice:["var(--glass-white)","color-mix(in srgb, hsl(var(--glass-color-info)) 12%, white)","color-mix(in srgb, hsl(var(--glass-color-info)) 25%, white)","color-mix(in srgb, hsl(var(--glass-color-info)) 38%, white)","color-mix(in srgb, hsl(var(--glass-color-info)) 50%, white)","color-mix(in srgb, hsl(var(--glass-color-info)) 63%, white)","color-mix(in srgb, hsl(var(--glass-color-info)) 75%, white)","color-mix(in srgb, hsl(var(--glass-color-info)) 88%, white)"],galaxy:["#1a1a2e","#16213e","#0f3460","#533483","#7209b7","#a663cc","#4cc9f0"]},os={"--glass-text-primary":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))","--typography-text-primary":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))","--glass-theme-text":"var(--glass-theme-text, rgba(255, 255, 255, 0.95))",color:"var(--glass-theme-text, rgba(255, 255, 255, 0.95))"},le=u.forwardRef(({audioSource:f,audioSettings:De={},visualSettings:He={},compact:h=!1,contained:pe=!1,maxHeight:Ne,showControls:Re=!0,showFrequencyDisplay:ke=!1,showWaveform:ls=!0,showSpectrum:cs=!0,showSettings:Ve=!1,realTimeAnalysis:ce=!0,enableInteraction:ve=!0,enableRecording:us=!1,canvasWidth:T=800,canvasHeight:I=400,onAudioLoad:Pe,onFrequencyData:Se,onBeatDetected:be,className:Be="",...Ge},Le)=>{const M=es(),[F,W]=u.useState(!1),[Ee,ms]=u.useState(!1),[we,xe]=u.useState(0),[Ce,_e]=u.useState(0),[z,je]=u.useState(new Uint8Array(128)),[gs,Ae]=u.useState(new Uint8Array(128)),[ue,Ue]=u.useState(0),[v,me]=u.useState({...rs,...De}),[d,ge]=u.useState({...is,...He}),D=u.useRef(null),g=u.useRef(null),x=u.useRef(null),C=u.useRef(null),he=u.useRef(null),b=u.useRef(),q=u.useRef([]),Fe=A("glass-music-mode"),qe=A("glass-music-color-scheme");A("glass-music-smoothing"),A("glass-music-fft-size");const Te=A("glass-music-volume");A("glass-music-visualizer");const{shouldAnimate:S}=ss(),{play:j}=ns(),H=Ne??(h||pe?240:void 0),N=u.useCallback(async()=>{try{x.current||(x.current=new(window.AudioContext||window.webkitAudioContext));const e=x.current,s=e.createAnalyser();s.fftSize=v.fftSize,s.smoothingTimeConstant=v.smoothing,C.current=s;const t=s.frequencyBinCount;if(je(new Uint8Array(t)),Ae(new Uint8Array(t)),f&&typeof f=="string"){const r=g.current;if(r){r.src=f;const n=e.createMediaElementSource(r);n.connect(s),s.connect(e.destination),he.current=n}}else if(f instanceof MediaStream){const r=e.createMediaStreamSource(f);r.connect(s),s.connect(e.destination),he.current=r}}catch{C.current=null,he.current=null}},[f,v.fftSize,v.smoothing]),Ie=u.useCallback(e=>{const s=Math.floor(e.length*.1),t=Math.floor(e.length*.3);let r=0,n=0;for(let c=0;c<s;c++)r+=e[c];for(let c=s;c<t;c++)n+=e[c];const o=r/s,i=n/(t-s),l=(o+i)/2/255;return Ue(l),l>.7&&be?.(l),l},[be]),de=u.useCallback(()=>{const e=D.current,s=C.current;if(!e||!s)return;const t=e.getContext("2d");if(!t)return;const r=new Uint8Array(s.frequencyBinCount),n=new Uint8Array(s.frequencyBinCount);s.getByteFrequencyData(r),s.getByteTimeDomainData(n),je(r),Ae(n),Se?.(r);const o=Ie(r);t.fillStyle="rgba(var(--glass-color-black) / var(--glass-opacity-10))",t.fillRect(0,0,e.width,e.height);const i=k[d.colorScheme]||k.rainbow;switch(d.mode){case"bars":Oe(t,r,i,o);break;case"wave":$e(t,n,i,o);break;case"circular":Xe(t,r,i,o);break;case"spectrum":Ye(t,r,i);break;case"particles":Je(t,r,i);break;case"ripples":Ke(t,r,i,o);break}ce&&F&&S&&!M&&(b.current=requestAnimationFrame(de))},[d,ce,F,S,M,Ie,Se]),Oe=(e,s,t,r)=>{const n=e.canvas.width/s.length,o=d.sensitivity;for(let i=0;i<s.length;i++){const l=s[i]/255*e.canvas.height*o,c=Math.floor(i/s.length*t.length),m=Math.max(.3,r);e.fillStyle=t[c]+Math.floor(m*255).toString(16).padStart(2,"0"),e.fillRect(i*n,e.canvas.height-l,n-1,l),d.mirror&&e.fillRect(i*n,0,n-1,l)}},$e=(e,s,t,r)=>{e.lineWidth=2+r*3,e.strokeStyle=t[Math.floor(r*t.length)],e.beginPath();const n=e.canvas.width/s.length;let o=0;for(let i=0;i<s.length;i++){const c=s[i]/128*d.sensitivity*e.canvas.height/2;i===0?e.moveTo(o,c):e.lineTo(o,c),o+=n}e.stroke()},Xe=(e,s,t,r)=>{const n=e.canvas.width/2,o=e.canvas.height/2,i=Math.min(n,o)*.7;for(let l=0;l<s.length;l++){const c=l/s.length*Math.PI*2,m=s[l]/255*i*d.sensitivity*.5,y=n+Math.cos(c)*i,p=o+Math.sin(c)*i,R=n+Math.cos(c)*(i+m),fe=o+Math.sin(c)*(i+m),ye=Math.floor(l/s.length*t.length);e.strokeStyle=t[ye],e.lineWidth=1+r*2,e.beginPath(),e.moveTo(y,p),e.lineTo(R,fe),e.stroke()}},Ye=(e,s,t,r)=>{const{width:n,height:o}=e.canvas;e.drawImage(e.canvas,1,0,n-1,o,0,0,n-1,o),e.clearRect(n-1,0,1,o);const i=n-1;for(let l=0;l<s.length;l++){const c=Math.floor(l/s.length*o),m=s[l]/255,y=Math.floor(m*t.length),p=t[y]||"#ffffff";e.fillStyle=p.startsWith("#")?`${p}${Math.round(m*255).toString(16).padStart(2,"0")}`:p,e.fillRect(i,c,1,Math.max(1,Math.ceil(o/s.length)))}},Je=(e,s,t,r)=>{q.current=q.current.filter(n=>(n.x+=n.vx,n.y+=n.vy,n.life-=.01,n.vy+=.1,n.life>0&&n.x>=0&&n.x<=e.canvas.width&&n.y>=0&&n.y<=e.canvas.height));for(let n=0;n<s.length;n+=4)if(q.current.length<d.particleCount){const o=s[n]/255;o>.1&&q.current.push({x:n/s.length*e.canvas.width,y:e.canvas.height-o*e.canvas.height*.5,vx:(Math.random()-.5)*4,vy:-Math.random()*o*5,size:o*5+1,color:t[Math.floor(o*t.length)],life:1})}q.current.forEach(n=>{e.save(),e.globalAlpha=n.life,e.fillStyle=n.color,e.beginPath(),e.arc(n.x,n.y,n.size,0,Math.PI*2),e.fill(),e.restore()})},Ke=(e,s,t,r)=>{const n=e.canvas.width/2,o=e.canvas.height/2;if(s.reduce((i,l)=>i+l,0)/s.length/255,r>.3)for(let l=0;l<5;l++){const c=r*200+l*50,m=Math.max(0,1-c/300);e.strokeStyle=t[l%t.length]+Math.floor(m*255).toString(16).padStart(2,"0"),e.lineWidth=3,e.beginPath(),e.arc(n,o,c,0,Math.PI*2),e.stroke()}for(let i=0;i<s.length;i+=8){const l=i/s.length*Math.PI*2,c=s[i]/255,m=c*100+50,y=n+Math.cos(l)*m,p=o+Math.sin(l)*m;e.fillStyle=t[Math.floor(c*t.length)],e.beginPath(),e.arc(y,p,c*5+1,0,Math.PI*2),e.fill()}},Me=u.useCallback(async()=>{if(x.current||await N(),g.current)try{await g.current.play(),W(!0),S&&!M&&de(),j("play")}catch{W(!1)}},[N,de,j,S,M]),We=u.useCallback(()=>{g.current&&(g.current.pause(),W(!1),b.current&&cancelAnimationFrame(b.current),j("pause"))},[j]),Qe=u.useCallback(()=>{g.current&&(g.current.pause(),g.current.currentTime=0,W(!1),xe(0),b.current&&cancelAnimationFrame(b.current),j("stop"))},[j]);u.useEffect(()=>(f&&N(),()=>{b.current&&cancelAnimationFrame(b.current),x.current&&x.current.close()}),[f,N]),u.useEffect(()=>{const e=D.current;e&&(e.width=T,e.height=I)},[T,I]),u.useEffect(()=>{const e=D.current;if(!e||C.current)return;const s=e.getContext("2d");if(!s)return;const{width:t,height:r}=e,n=s.createLinearGradient(0,0,t,r);n.addColorStop(0,"rgba(56, 189, 248, 0.16)"),n.addColorStop(.48,"rgba(168, 85, 247, 0.16)"),n.addColorStop(1,"rgba(244, 63, 94, 0.18)"),s.fillStyle="rgba(8, 13, 28, 0.86)",s.fillRect(0,0,t,r),s.fillStyle=n,s.fillRect(0,0,t,r);const o=k[d.colorScheme]||k.rainbow,i=h?32:56,l=h?3:4,c=Math.max(3,(t-l*(i-1))/i);for(let m=0;m<i;m+=1){const y=m/Math.max(1,i-1),p=.25+Math.abs(Math.sin(y*Math.PI*3.2))*.48+Math.abs(Math.cos(y*Math.PI*8.4))*.16,R=Math.min(r*.82,r*p),fe=m*(c+l),ye=r-R-r*.08;s.fillStyle=o[m%o.length],s.globalAlpha=.74,s.fillRect(fe,ye,c,R)}s.globalAlpha=1,s.strokeStyle="rgba(255,255,255,0.14)",s.lineWidth=1,s.beginPath(),s.moveTo(0,r*.5);for(let m=0;m<=t;m+=8){const y=r*.5+Math.sin(m/t*Math.PI*4)*(h?10:18);s.lineTo(m,y)}s.stroke()},[T,I,h,d.colorScheme]);const Ze=()=>a.jsxs("div",{className:w("glass-flex glass-items-center glass-gap-2",h?"glass-flex-wrap":"glass-space-x-4"),children:[a.jsx(ze.button,{className:w("glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-transition-colors",h?"glass-p-1.5 glass-text-xs":"glass-p-2"),whileHover:S?{scale:1.1}:{},whileTap:S?{scale:.9}:{},onClick:F?We:Me,children:F?"⏸️":"▶️"}),a.jsx(ze.button,{className:w("glass-surface-primary hover:glass-surface-primary glass-text-primary glass-radius-lg glass-transition-colors",h?"glass-p-1.5 glass-text-xs":"glass-p-2"),whileHover:S?{scale:1.1}:{},whileTap:S?{scale:.9}:{},onClick:Qe,children:"⏹️"}),a.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1",children:[a.jsxs("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:[Math.floor(we/60),":",Math.floor(we%60).toString().padStart(2,"0")]}),a.jsx("span",{className:"glass-text-primary-glass-opacity-40",children:"/"}),a.jsxs("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:[Math.floor(Ce/60),":",Math.floor(Ce%60).toString().padStart(2,"0")]})]}),a.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1",children:[a.jsx("label",{htmlFor:Te,className:"glass-text-xs glass-text-primary-glass-opacity-80",children:h?"Vol":"Volume:"}),a.jsx("input",{type:"range",min:"0",max:"1",step:"0.1",value:v.volume,onChange:e=>{const s=parseFloat(e.target.value);me(t=>({...t,volume:s})),g.current&&(g.current.volume=s)},className:w("glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer",h?"glass-w-12":"glass-w-16"),"aria-label":"Volume",id:Te})]})]});return a.jsxs(ts,{ref:Le,variant:"frosted","data-glass-component":!0,className:w("glass-music-visualizer glass-max-w-full glass-overflow-auto",h?"glass-p-3 glass-space-y-2":"glass-p-4 glass-space-y-4",Be),style:{...os,maxHeight:H!==void 0?typeof H=="number"?`${H}px`:H:"100%",overflow:h||pe?"auto":void 0,minWidth:0},...Ge,children:[a.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-gap-3",children:[a.jsxs("div",{className:"glass-min-w-0",children:[a.jsx("h3",{className:w("glass-font-semibold glass-text-primary-glass-opacity-90 glass-truncate",h?"glass-text-sm":"glass-text-lg"),children:"Music Visualizer"}),a.jsx("p",{className:w("glass-text-primary-glass-opacity-60 glass-truncate",h?"glass-text-xs":"glass-text-sm"),children:"Real-time audio visualization and analysis"})]}),a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[ce&&a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[a.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),a.jsx("span",{className:"glass-text-xs",children:"Live"})]}),Ee&&a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[a.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-red glass-radius-full glass-animate-pulse"}),a.jsx("span",{className:"glass-text-xs",children:"Recording"})]})]})]}),f&&typeof f=="string"&&a.jsx("audio",{ref:g,src:f,onLoadedMetadata:()=>{g.current&&(_e(g.current.duration),Pe?.(g.current.duration))},onTimeUpdate:()=>{g.current&&xe(g.current.currentTime)}}),Re&&a.jsx(Ze,{}),a.jsxs("div",{className:"glass-relative",children:[a.jsx("canvas",{ref:D,width:T,height:I,className:`
              glass-w-full glass-border glass-border-white/20 glass-radius-lg glass-surface-dark/20
              ${ve?"glass-cursor-pointer":""}
            `,style:{height:h?"130px":"clamp(120px, 26vw, 220px)",display:"block"},onClick:ve?F?We:Me:void 0}),a.jsx("div",{className:"glass-absolute glass-top-2 glass-right-2",children:a.jsx("div",{className:"glass-w-4 glass-h-4 glass-radius-full glass-surface-red",style:{opacity:ue,transform:`scale(${1+ue})`}})})]}),Ve&&a.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4",children:[a.jsxs("div",{className:"glass-space-y-4",children:[a.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Visualization"}),a.jsxs("div",{className:"glass-space-y-3",children:[a.jsxs("div",{children:[a.jsx("label",{htmlFor:Fe,className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"Mode"}),a.jsxs("select",{id:Fe,value:d.mode,onChange:e=>ge(s=>({...s,mode:e.target.value})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"Visualization mode",children:[a.jsx("option",{value:"bars",children:"Frequency Bars"}),a.jsx("option",{value:"wave",children:"Waveform"}),a.jsx("option",{value:"circular",children:"Circular"}),a.jsx("option",{value:"spectrum",children:"Spectrum"}),a.jsx("option",{value:"particles",children:"Particles"}),a.jsx("option",{value:"ripples",children:"Ripples"})]})]}),a.jsxs("div",{children:[a.jsx("label",{htmlFor:qe,className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"Color Scheme"}),a.jsxs("select",{id:qe,value:d.colorScheme,onChange:e=>ge(s=>({...s,colorScheme:e.target.value})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"Color scheme",children:[a.jsx("option",{value:"rainbow",children:"Rainbow"}),a.jsx("option",{value:"monochrome",children:"Monochrome"}),a.jsx("option",{value:"neon",children:"Neon"}),a.jsx("option",{value:"fire",children:"Fire"}),a.jsx("option",{value:"ice",children:"Ice"}),a.jsx("option",{value:"galaxy",children:"Galaxy"})]})]}),a.jsxs("div",{children:[a.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Sensitivity: ",d.sensitivity.toFixed(1)]}),a.jsx("input",{type:"range",min:"0.1",max:"3.0",step:"0.1",value:d.sensitivity,onChange:e=>ge(s=>({...s,sensitivity:parseFloat(e.target.value)})),className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":"Sensitivity"})]})]})]}),a.jsxs("div",{className:"glass-space-y-4",children:[a.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Audio Settings"}),a.jsxs("div",{className:"glass-space-y-3",children:[a.jsxs("div",{children:[a.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Smoothing: ",v.smoothing.toFixed(1)]}),a.jsx("input",{type:"range",min:"0.0",max:"1.0",step:"0.1",value:v.smoothing,onChange:e=>{const s=parseFloat(e.target.value);me(t=>({...t,smoothing:s})),C.current&&(C.current.smoothingTimeConstant=s)},className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":"Smoothing"})]}),a.jsxs("div",{children:[a.jsx("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"FFT Size"}),a.jsxs("select",{value:v.fftSize,onChange:e=>me(s=>({...s,fftSize:parseInt(e.target.value)})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"FFT size",children:[a.jsx("option",{value:"128",children:"128"}),a.jsx("option",{value:"256",children:"256"}),a.jsx("option",{value:"512",children:"512"}),a.jsx("option",{value:"1024",children:"1024"}),a.jsx("option",{value:"2048",children:"2048"})]})]})]})]})]}),ke&&a.jsxs("div",{className:`
            glass-p-3 glass-radius-lg glass-border glass-border-white/10
            ${as({blur:"sm",opacity:.6}).background}
          `,children:[a.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2",children:"Frequency Analysis"}),a.jsxs("div",{className:"glass-grid glass-grid-cols-4 glass-gap-4 glass-text-sm",children:[a.jsxs("div",{children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Bass:"}),a.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[Math.round(z.slice(0,8).reduce((e,s)=>e+s,0)/8/255*100),"%"]})]}),a.jsxs("div",{children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Mid:"}),a.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[Math.round(z.slice(8,32).reduce((e,s)=>e+s,0)/24/255*100),"%"]})]}),a.jsxs("div",{children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Treble:"}),a.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[Math.round(z.slice(32).reduce((e,s)=>e+s,0)/(z.length-32)/255*100),"%"]})]}),a.jsxs("div",{children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Beat:"}),a.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[Math.round(ue*100),"%"]})]})]})]})]})});le.displayName="GlassMusicVisualizer";try{le.displayName="GlassMusicVisualizer",le.__docgenInfo={description:"",displayName:"GlassMusicVisualizer",props:{audioSource:{defaultValue:null,description:"",name:"audioSource",required:!1,type:{name:"string | MediaStream | undefined"}},audioSettings:{defaultValue:{value:"{}"},description:"",name:"audioSettings",required:!1,type:{name:"Partial<AudioSettings> | undefined"}},visualSettings:{defaultValue:{value:"{}"},description:"",name:"visualSettings",required:!1,type:{name:"Partial<VisualizationSettings> | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},showControls:{defaultValue:{value:"true"},description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showFrequencyDisplay:{defaultValue:{value:"false"},description:"",name:"showFrequencyDisplay",required:!1,type:{name:"boolean | undefined"}},showWaveform:{defaultValue:{value:"true"},description:"",name:"showWaveform",required:!1,type:{name:"boolean | undefined"}},showSpectrum:{defaultValue:{value:"true"},description:"",name:"showSpectrum",required:!1,type:{name:"boolean | undefined"}},showSettings:{defaultValue:{value:"false"},description:"",name:"showSettings",required:!1,type:{name:"boolean | undefined"}},realTimeAnalysis:{defaultValue:{value:"true"},description:"",name:"realTimeAnalysis",required:!1,type:{name:"boolean | undefined"}},enableInteraction:{defaultValue:{value:"true"},description:"",name:"enableInteraction",required:!1,type:{name:"boolean | undefined"}},enableRecording:{defaultValue:{value:"false"},description:"",name:"enableRecording",required:!1,type:{name:"boolean | undefined"}},canvasWidth:{defaultValue:{value:"800"},description:"",name:"canvasWidth",required:!1,type:{name:"number | undefined"}},canvasHeight:{defaultValue:{value:"400"},description:"",name:"canvasHeight",required:!1,type:{name:"number | undefined"}},onAudioLoad:{defaultValue:null,description:"",name:"onAudioLoad",required:!1,type:{name:"((duration: number) => void) | undefined"}},onFrequencyData:{defaultValue:null,description:"",name:"onFrequencyData",required:!1,type:{name:"((data: Uint8Array<ArrayBufferLike>) => void) | undefined"}},onBeatDetected:{defaultValue:null,description:"",name:"onBeatDetected",required:!1,type:{name:"((intensity: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const ws={title:"AI + Intelligence/Glass Music Visualizer",component:le,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{canvasWidth:{control:{type:"range",min:400,max:1200,step:50}},canvasHeight:{control:{type:"range",min:200,max:600,step:50}},showControls:{control:"boolean"},showFrequencyDisplay:{control:"boolean"},showWaveform:{control:"boolean"},showSpectrum:{control:"boolean"},realTimeAnalysis:{control:"boolean"},enableInteraction:{control:"boolean"},enableRecording:{control:"boolean"}}},V={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,showWaveform:!0,showSpectrum:!0,realTimeAnalysis:!0,enableInteraction:!0,enableRecording:!1,audioSettings:{volume:.8,gain:1,bassBoost:0,trebleBoost:0,smoothing:.8,fftSize:256},visualSettings:{mode:"bars",colorScheme:"rainbow",particleCount:100,sensitivity:1,symmetry:!1,mirror:!1}}},P={args:{canvasWidth:800,canvasHeight:300,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"rainbow",sensitivity:1.2,symmetry:!1,mirror:!0},audioSettings:{fftSize:512,smoothing:.7}}},B={args:{canvasWidth:800,canvasHeight:300,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"wave",colorScheme:"neon",sensitivity:1.5,symmetry:!0,mirror:!1},audioSettings:{fftSize:1024,smoothing:.9}}},G={args:{canvasWidth:600,canvasHeight:600,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"circular",colorScheme:"galaxy",sensitivity:1,symmetry:!0,mirror:!1},audioSettings:{fftSize:256,smoothing:.8}}},L={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,showSpectrum:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"spectrum",colorScheme:"fire",sensitivity:1},audioSettings:{fftSize:512,smoothing:.6}}},E={args:{canvasWidth:800,canvasHeight:500,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"particles",colorScheme:"rainbow",particleCount:150,sensitivity:1.3},audioSettings:{fftSize:256,smoothing:.7}}},_={args:{canvasWidth:600,canvasHeight:600,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"ripples",colorScheme:"ice",sensitivity:1.5},audioSettings:{fftSize:256,smoothing:.8}}},U={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"neon",sensitivity:1.2,mirror:!0},audioSettings:{fftSize:512,smoothing:.7}}},O={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"fire",sensitivity:1,mirror:!1},audioSettings:{fftSize:256,smoothing:.8}}},$={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"circular",colorScheme:"ice",sensitivity:.8,symmetry:!0},audioSettings:{fftSize:256,smoothing:.9}}},X={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"wave",colorScheme:"monochrome",sensitivity:1.5},audioSettings:{fftSize:1024,smoothing:.8}}},Y={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"rainbow",sensitivity:3,mirror:!0},audioSettings:{fftSize:256,smoothing:.5}}},J={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"rainbow",sensitivity:.3,mirror:!1},audioSettings:{fftSize:256,smoothing:.9}}},K={args:{canvasWidth:1e3,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"galaxy",sensitivity:1},audioSettings:{fftSize:2048,smoothing:.8}}},Q={args:{canvasWidth:600,canvasHeight:300,showControls:!1,showFrequencyDisplay:!1,showWaveform:!1,showSpectrum:!1,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"circular",colorScheme:"neon",sensitivity:1}}},Z={args:{canvasWidth:800,canvasHeight:200,showControls:!0,showFrequencyDisplay:!1,showWaveform:!1,showSpectrum:!1,realTimeAnalysis:!0,enableInteraction:!1,visualSettings:{mode:"bars",colorScheme:"rainbow",sensitivity:1}}},ee={args:{canvasWidth:400,canvasHeight:200,showControls:!1,showFrequencyDisplay:!0,showWaveform:!1,showSpectrum:!1,realTimeAnalysis:!0,enableInteraction:!1,visualSettings:{mode:"bars",colorScheme:"monochrome",sensitivity:1}}},se={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,enableRecording:!0,visualSettings:{mode:"spectrum",colorScheme:"fire",sensitivity:1},audioSettings:{fftSize:512,smoothing:.7}}},ae={args:{canvasWidth:1200,canvasHeight:300,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"galaxy",sensitivity:1,mirror:!1},audioSettings:{fftSize:512,smoothing:.8}}},ne={args:{canvasWidth:400,canvasHeight:600,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"neon",sensitivity:1.2,mirror:!0},audioSettings:{fftSize:256,smoothing:.8}}},te={args:{canvasWidth:600,canvasHeight:600,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"circular",colorScheme:"rainbow",sensitivity:1,symmetry:!0,mirror:!1},audioSettings:{fftSize:256,smoothing:.8}}},re={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"ice",sensitivity:1,symmetry:!1,mirror:!0},audioSettings:{fftSize:512,smoothing:.7}}},ie={args:{canvasWidth:800,canvasHeight:500,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"particles",colorScheme:"galaxy",particleCount:300,sensitivity:1.5},audioSettings:{fftSize:256,smoothing:.6}}},oe={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"particles",colorScheme:"neon",particleCount:50,sensitivity:1},audioSettings:{fftSize:256,smoothing:.8}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
      colorScheme: 'rainbow',
      sensitivity: 0.3,
      mirror: false
    },
    audioSettings: {
      fftSize: 256,
      smoothing: 0.9
    }
  }
}`,...J.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
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
}`,...K.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
}`,...Q.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
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
}`,...Z.parameters?.docs?.source}}};ee.parameters={...ee.parameters,docs:{...ee.parameters?.docs,source:{originalSource:`{
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
}`,...ee.parameters?.docs?.source}}};se.parameters={...se.parameters,docs:{...se.parameters?.docs,source:{originalSource:`{
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
}`,...se.parameters?.docs?.source}}};ae.parameters={...ae.parameters,docs:{...ae.parameters?.docs,source:{originalSource:`{
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
}`,...ae.parameters?.docs?.source}}};ne.parameters={...ne.parameters,docs:{...ne.parameters?.docs,source:{originalSource:`{
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
}`,...ne.parameters?.docs?.source}}};te.parameters={...te.parameters,docs:{...te.parameters?.docs,source:{originalSource:`{
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
}`,...te.parameters?.docs?.source}}};re.parameters={...re.parameters,docs:{...re.parameters?.docs,source:{originalSource:`{
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
}`,...re.parameters?.docs?.source}}};ie.parameters={...ie.parameters,docs:{...ie.parameters?.docs,source:{originalSource:`{
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
}`,...ie.parameters?.docs?.source}}};oe.parameters={...oe.parameters,docs:{...oe.parameters?.docs,source:{originalSource:`{
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
}`,...oe.parameters?.docs?.source}}};const xs=["Default","FrequencyBars","WaveformMode","CircularVisualizer","SpectrumAnalyzer","ParticleSystem","RipplesEffect","NeonTheme","FireTheme","IceTheme","MonochromeMode","HighSensitivity","LowSensitivity","HighResolutionFFT","MinimalInterface","ControlsOnly","FrequencyDisplayOnly","RecordingMode","WideCanvas","TallCanvas","SymmetricVisualization","MirroredBars","HighParticleCount","LowParticleCount"];export{G as CircularVisualizer,Z as ControlsOnly,V as Default,O as FireTheme,P as FrequencyBars,ee as FrequencyDisplayOnly,ie as HighParticleCount,K as HighResolutionFFT,Y as HighSensitivity,$ as IceTheme,oe as LowParticleCount,J as LowSensitivity,Q as MinimalInterface,re as MirroredBars,X as MonochromeMode,U as NeonTheme,E as ParticleSystem,se as RecordingMode,_ as RipplesEffect,L as SpectrumAnalyzer,te as SymmetricVisualization,ne as TallCanvas,B as WaveformMode,ae as WideCanvas,xs as __namedExportsOrder,ws as default};
