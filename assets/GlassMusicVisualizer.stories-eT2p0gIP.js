import{r as u,a as es,j as a,c as x,m as We}from"./iframe-DFMMcocb.js";import{u as ss}from"./useMotionPreference-CXubJTNb.js";import{u as A}from"./a11y-Q0mX7KvA.js";import{c as as}from"./createGlassStyle-Cr0Un8y6.js";import{u as ns}from"./soundDesign-DAOJZn7H.js";import{P as ts,p as rs,q as is}from"./components-Ue9Uo88O.js";import{O as os}from"./OptimizedGlassCore-1D6AE-uZ.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-iDxBLJQX.js";const ls={volume:.8,gain:1,bassBoost:0,trebleBoost:0,smoothing:.8,fftSize:256},cs={mode:"bars",colorScheme:"monochrome",particleCount:100,sensitivity:1,symmetry:!1,mirror:!1},k={rainbow:["hsl(var(--glass-color-danger))","hsl(var(--glass-color-warning))","hsl(var(--glass-color-warning))","hsl(var(--glass-color-success))","hsl(var(--glass-color-success))","hsl(var(--glass-color-info))","hsl(var(--glass-color-info))","hsl(var(--glass-color-primary))","hsl(var(--glass-color-primary))","var(--glass-color-secondary)"],monochrome:["rgba(248,250,252,.96)","rgba(226,232,240,.96)","rgba(203,213,225,.96)","rgba(148,163,184,.96)","rgba(100,116,139,.96)","rgba(71,85,105,.96)","rgba(51,65,85,.96)","rgba(30,41,59,.96)"],neon:["#ff00ff","#ff0080","#ff0040","#ff8040","#ffff40","#80ff40","#40ff40","#40ff80","#40ffff","#4080ff"],fire:["#ffff00","#ffcc00","#ff9900","#ff6600","#ff3300","#ff0000","#cc0000","#990000"],ice:["var(--glass-white)","color-mix(in srgb, hsl(var(--glass-color-info)) 12%, white)","color-mix(in srgb, hsl(var(--glass-color-info)) 25%, white)","color-mix(in srgb, hsl(var(--glass-color-info)) 38%, white)","color-mix(in srgb, hsl(var(--glass-color-info)) 50%, white)","color-mix(in srgb, hsl(var(--glass-color-info)) 63%, white)","color-mix(in srgb, hsl(var(--glass-color-info)) 75%, white)","color-mix(in srgb, hsl(var(--glass-color-info)) 88%, white)"],galaxy:["#1a1a2e","#16213e","#0f3460","#533483","#7209b7","#a663cc","#4cc9f0"]},us={color:"var(--glass-theme-text, var(--glass-text-primary))"},le=u.forwardRef(({audioSource:f,audioSettings:Ne={},visualSettings:De={},compact:m=!1,contained:ce=!1,maxHeight:He,showControls:Re=!0,showFrequencyDisplay:ke=!1,showWaveform:gs=!0,showSpectrum:ms=!0,showSettings:Ve=!1,realTimeAnalysis:ue=!0,enableInteraction:ve=!0,enableRecording:hs=!1,canvasWidth:F=800,canvasHeight:M=400,onAudioLoad:Pe,onFrequencyData:Se,onBeatDetected:be,className:Be="",...Ge},Le)=>{const T=es(),[y,I]=u.useState(!1),[_e,ds]=u.useState(!1),[we,xe]=u.useState(0),[Ce,$e]=u.useState(0),[W,je]=u.useState(new Uint8Array(128)),[fs,qe]=u.useState(new Uint8Array(128)),[ge,Ee]=u.useState(0),[v,me]=u.useState({...ls,...Ne}),[d,he]=u.useState({...cs,...De}),N=u.useRef(null),h=u.useRef(null),C=u.useRef(null),j=u.useRef(null),de=u.useRef(null),w=u.useRef(),z=u.useRef([]),Ae=A("glass-music-mode"),ze=A("glass-music-color-scheme");A("glass-music-smoothing"),A("glass-music-fft-size");const Fe=A("glass-music-volume");A("glass-music-visualizer");const{shouldAnimate:b}=ss(),{play:q}=ns(),D=He??(m||ce?320:void 0),H=u.useCallback(async()=>{try{C.current||(C.current=new(window.AudioContext||window.webkitAudioContext));const e=C.current,s=e.createAnalyser();s.fftSize=v.fftSize,s.smoothingTimeConstant=v.smoothing,j.current=s;const t=s.frequencyBinCount;if(je(new Uint8Array(t)),qe(new Uint8Array(t)),f&&typeof f=="string"){const r=h.current;if(r){r.src=f;const n=e.createMediaElementSource(r);n.connect(s),s.connect(e.destination),de.current=n}}else if(f instanceof MediaStream){const r=e.createMediaStreamSource(f);r.connect(s),s.connect(e.destination),de.current=r}}catch{j.current=null,de.current=null}},[f,v.fftSize,v.smoothing]),Me=u.useCallback(e=>{const s=Math.floor(e.length*.1),t=Math.floor(e.length*.3);let r=0,n=0;for(let c=0;c<s;c++)r+=e[c];for(let c=s;c<t;c++)n+=e[c];const o=r/s,i=n/(t-s),l=(o+i)/2/255;return Ee(l),l>.7&&be?.(l),l},[be]),fe=u.useCallback(()=>{const e=N.current,s=j.current;if(!e||!s)return;const t=e.getContext("2d");if(!t)return;const r=new Uint8Array(s.frequencyBinCount),n=new Uint8Array(s.frequencyBinCount);s.getByteFrequencyData(r),s.getByteTimeDomainData(n),je(r),qe(n),Se?.(r);const o=Me(r);t.fillStyle="rgba(var(--glass-color-black) / var(--glass-opacity-10))",t.fillRect(0,0,e.width,e.height);const i=k[d.colorScheme]||k.rainbow;switch(d.mode){case"bars":Ue(t,r,i,o);break;case"wave":Oe(t,n,i,o);break;case"circular":Ye(t,r,i,o);break;case"spectrum":Xe(t,r,i);break;case"particles":Je(t,r,i);break;case"ripples":Ke(t,r,i,o);break}ue&&y&&b&&!T&&(w.current=requestAnimationFrame(fe))},[d,ue,y,b,T,Me,Se]),Ue=(e,s,t,r)=>{const n=e.canvas.width/s.length,o=d.sensitivity;for(let i=0;i<s.length;i++){const l=s[i]/255*e.canvas.height*o,c=Math.floor(i/s.length*t.length),g=Math.max(.3,r);e.fillStyle=t[c]+Math.floor(g*255).toString(16).padStart(2,"0"),e.fillRect(i*n,e.canvas.height-l,n-1,l),d.mirror&&e.fillRect(i*n,0,n-1,l)}},Oe=(e,s,t,r)=>{e.lineWidth=2+r*3,e.strokeStyle=t[Math.floor(r*t.length)],e.beginPath();const n=e.canvas.width/s.length;let o=0;for(let i=0;i<s.length;i++){const c=s[i]/128*d.sensitivity*e.canvas.height/2;i===0?e.moveTo(o,c):e.lineTo(o,c),o+=n}e.stroke()},Ye=(e,s,t,r)=>{const n=e.canvas.width/2,o=e.canvas.height/2,i=Math.min(n,o)*.7;for(let l=0;l<s.length;l++){const c=l/s.length*Math.PI*2,g=s[l]/255*i*d.sensitivity*.5,p=n+Math.cos(c)*i,S=o+Math.sin(c)*i,R=n+Math.cos(c)*(i+g),pe=o+Math.sin(c)*(i+g),ye=Math.floor(l/s.length*t.length);e.strokeStyle=t[ye],e.lineWidth=1+r*2,e.beginPath(),e.moveTo(p,S),e.lineTo(R,pe),e.stroke()}},Xe=(e,s,t,r)=>{const{width:n,height:o}=e.canvas;e.drawImage(e.canvas,1,0,n-1,o,0,0,n-1,o),e.clearRect(n-1,0,1,o);const i=n-1;for(let l=0;l<s.length;l++){const c=Math.floor(l/s.length*o),g=s[l]/255,p=Math.floor(g*t.length),S=t[p]||"#ffffff";e.fillStyle=S.startsWith("#")?`${S}${Math.round(g*255).toString(16).padStart(2,"0")}`:S,e.fillRect(i,c,1,Math.max(1,Math.ceil(o/s.length)))}},Je=(e,s,t,r)=>{z.current=z.current.filter(n=>(n.x+=n.vx,n.y+=n.vy,n.life-=.01,n.vy+=.1,n.life>0&&n.x>=0&&n.x<=e.canvas.width&&n.y>=0&&n.y<=e.canvas.height));for(let n=0;n<s.length;n+=4)if(z.current.length<d.particleCount){const o=s[n]/255;o>.1&&z.current.push({x:n/s.length*e.canvas.width,y:e.canvas.height-o*e.canvas.height*.5,vx:(Math.random()-.5)*4,vy:-Math.random()*o*5,size:o*5+1,color:t[Math.floor(o*t.length)],life:1})}z.current.forEach(n=>{e.save(),e.globalAlpha=n.life,e.fillStyle=n.color,e.beginPath(),e.arc(n.x,n.y,n.size,0,Math.PI*2),e.fill(),e.restore()})},Ke=(e,s,t,r)=>{const n=e.canvas.width/2,o=e.canvas.height/2;if(s.reduce((i,l)=>i+l,0)/s.length/255,r>.3)for(let l=0;l<5;l++){const c=r*200+l*50,g=Math.max(0,1-c/300);e.strokeStyle=t[l%t.length]+Math.floor(g*255).toString(16).padStart(2,"0"),e.lineWidth=3,e.beginPath(),e.arc(n,o,c,0,Math.PI*2),e.stroke()}for(let i=0;i<s.length;i+=8){const l=i/s.length*Math.PI*2,c=s[i]/255,g=c*100+50,p=n+Math.cos(l)*g,S=o+Math.sin(l)*g;e.fillStyle=t[Math.floor(c*t.length)],e.beginPath(),e.arc(p,S,c*5+1,0,Math.PI*2),e.fill()}},Te=u.useCallback(async()=>{if(C.current||await H(),h.current)try{await h.current.play(),I(!0),b&&!T&&fe(),q("play")}catch{I(!1)}},[H,fe,q,b,T]),Ie=u.useCallback(()=>{h.current&&(h.current.pause(),I(!1),w.current&&cancelAnimationFrame(w.current),q("pause"))},[q]),Qe=u.useCallback(()=>{h.current&&(h.current.pause(),h.current.currentTime=0,I(!1),xe(0),w.current&&cancelAnimationFrame(w.current),q("stop"))},[q]);u.useEffect(()=>(f&&H(),()=>{w.current&&cancelAnimationFrame(w.current),C.current&&C.current.close()}),[f,H]),u.useEffect(()=>{const e=N.current;e&&(e.width=F,e.height=M)},[F,M]),u.useEffect(()=>{const e=N.current;if(!e||j.current&&y)return;const s=e.getContext("2d");if(!s)return;const{width:t,height:r}=e,n=s.createLinearGradient(0,0,t,r);n.addColorStop(0,"rgba(255, 255, 255, 0.18)"),n.addColorStop(.48,"rgba(255, 255, 255, 0.08)"),n.addColorStop(1,"rgba(255, 255, 255, 0.12)"),s.clearRect(0,0,t,r),s.fillStyle="rgba(255, 255, 255, 0.08)",s.fillRect(0,0,t,r),s.fillStyle=n,s.fillRect(0,0,t,r);const o=k[d.colorScheme]||k.rainbow,i=m?32:56,l=m?3:4,c=Math.max(3,(t-l*(i-1))/i);for(let g=0;g<i;g+=1){const p=g/Math.max(1,i-1),S=.25+Math.abs(Math.sin(p*Math.PI*3.2))*.48+Math.abs(Math.cos(p*Math.PI*8.4))*.16,R=Math.min(r*.82,r*S),pe=g*(c+l),ye=r-R-r*.08;s.fillStyle=o[g%o.length],s.globalAlpha=.74,s.fillRect(pe,ye,c,R)}s.globalAlpha=1,s.strokeStyle="rgba(255,255,255,0.14)",s.lineWidth=1,s.beginPath(),s.moveTo(0,r*.5);for(let g=0;g<=t;g+=8){const p=r*.5+Math.sin(g/t*Math.PI*4)*(m?10:18);s.lineTo(g,p)}s.stroke()},[F,M,m,y,d.colorScheme]);const Ze=()=>a.jsxs("div",{className:x("glass-flex glass-items-center glass-gap-2",m?"glass-flex-wrap":"glass-space-x-4"),children:[a.jsx("style",{children:`.glass-music-visualizer,
          .glass-music-visualizer :where(h3, p, label, span, button) {
            color: var(--glass-theme-text, var(--glass-text-primary)) !important;
            -webkit-text-fill-color: currentColor;
          }
          .glass-music-visualizer :where(button) {
            background: linear-gradient(180deg, rgba(255,255,255,.34), rgba(248,250,252,.24)) !important;
            border: 1px solid rgba(148,163,184,.38) !important;
          }
          .glass-music-visualizer input[type="range"] {
            appearance: none;
            height: 8px;
            border-radius: 999px;
            background: rgba(255,255,255,.28) !important;
            box-shadow: inset 0 0 0 1px rgba(71,85,105,.34), inset 0 2px 4px rgba(71,85,105,.14);
          }
          .glass-music-visualizer input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 999px;
            border: 1px solid rgba(100,116,139,.34);
            background: rgba(255,255,255,.98);
            box-shadow: 0 4px 12px rgba(15,23,42,.2);
          }
          .glass-music-visualizer input[type="range"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 999px;
            border: 1px solid rgba(100,116,139,.34);
            background: rgba(255,255,255,.98);
            box-shadow: 0 4px 12px rgba(15,23,42,.2);
          }`}),a.jsx(We.button,{className:x("glass-text-primary glass-radius-lg glass-transition-colors",m?"glass-p-1.5 glass-text-xs":"glass-p-2"),whileHover:b?{scale:1.1}:{},whileTap:b?{scale:.9}:{},onClick:y?Ie:Te,style:{color:"var(--glass-theme-text, var(--glass-text-primary))"},"aria-label":y?"Pause visualization":"Play visualization",children:y?a.jsx(ts,{className:"glass-h-4 glass-w-4","aria-hidden":"true"}):a.jsx(rs,{className:"glass-h-4 glass-w-4","aria-hidden":"true"})}),a.jsx(We.button,{className:x("glass-text-primary glass-radius-lg glass-transition-colors",m?"glass-p-1.5 glass-text-xs":"glass-p-2"),whileHover:b?{scale:1.1}:{},whileTap:b?{scale:.9}:{},onClick:Qe,style:{color:"var(--glass-theme-text, var(--glass-text-primary))"},"aria-label":"Stop visualization",children:a.jsx(is,{className:"glass-h-4 glass-w-4","aria-hidden":"true"})}),a.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1",children:[a.jsxs("span",{className:"glass-text-xs",style:{color:"var(--glass-theme-text-secondary, var(--glass-text-secondary))"},children:[Math.floor(we/60),":",Math.floor(we%60).toString().padStart(2,"0")]}),a.jsx("span",{style:{color:"var(--glass-theme-text-secondary, var(--glass-text-secondary))"},children:"/"}),a.jsxs("span",{className:"glass-text-xs",style:{color:"var(--glass-theme-text-secondary, var(--glass-text-secondary))"},children:[Math.floor(Ce/60),":",Math.floor(Ce%60).toString().padStart(2,"0")]})]}),a.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1",children:[a.jsx("label",{htmlFor:Fe,className:"glass-text-xs",style:{color:"var(--glass-theme-text, var(--glass-text-primary))"},children:m?"Vol":"Volume:"}),a.jsxs("div",{className:x("glass-relative glass-h-5",m?"glass-w-12":"glass-w-16"),children:[a.jsx("span",{"aria-hidden":"true",className:"glass-absolute glass-left-0 glass-right-0 glass-top-1/2 glass-h-2 glass-radius-full",style:{background:"rgba(255,255,255,.28)",border:"1px solid rgba(71,85,105,.34)",transform:"translateY(-50%)"}}),a.jsx("span",{"aria-hidden":"true",className:"glass-absolute glass-top-1/2 glass-h-4 glass-w-4 glass-radius-full",style:{left:`calc(${v.volume*100}% - 8px)`,background:"rgba(255,255,255,.98)",border:"1px solid rgba(71,85,105,.4)",boxShadow:"0 3px 9px rgba(15,23,42,.18)",transform:"translateY(-50%)"}}),a.jsx("input",{type:"range",min:"0",max:"1",step:"0.1",value:v.volume,onChange:e=>{const s=parseFloat(e.target.value);me(t=>({...t,volume:s})),h.current&&(h.current.volume=s)},className:"glass-absolute glass-inset-0 glass-h-full glass-w-full glass-cursor-pointer",style:{opacity:.001},"aria-label":"Volume",id:Fe})]})]})]});return a.jsxs(os,{ref:Le,variant:"frosted","data-glass-component":!0,className:x("glass-music-visualizer glass-max-w-full glass-overflow-auto",m?"glass-p-3 glass-space-y-2":"glass-p-4 glass-space-y-4",Be),style:{...us,background:"rgba(255,255,255,.28)",border:"1px solid rgba(148,163,184,.3)",boxShadow:"0 24px 64px rgba(15,23,42,.14), inset 0 1px 0 rgba(255,255,255,.9)",maxHeight:D!==void 0?typeof D=="number"?`${D}px`:D:"100%",overflow:m||ce?"auto":void 0,minWidth:0},...Ge,children:[a.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-gap-3",children:[a.jsxs("div",{className:"glass-min-w-0",children:[a.jsx("h3",{className:x("glass-font-semibold glass-truncate",m?"glass-text-sm":"glass-text-lg"),style:{color:"var(--glass-theme-text, var(--glass-text-primary))"},children:"Music Visualizer"}),a.jsx("p",{className:x(m||ce?"glass-whitespace-normal glass-break-words":"glass-truncate",m?"glass-text-xs":"glass-text-sm"),style:{color:"var(--glass-theme-text-secondary, var(--glass-text-secondary))"},children:"Real-time audio visualization and analysis"})]}),a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[ue&&a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[a.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),a.jsx("span",{className:"glass-text-xs",children:"Live"})]}),_e&&a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[a.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-red glass-radius-full glass-animate-pulse"}),a.jsx("span",{className:"glass-text-xs",children:"Recording"})]})]})]}),f&&typeof f=="string"&&a.jsx("audio",{ref:h,src:f,onLoadedMetadata:()=>{h.current&&($e(h.current.duration),Pe?.(h.current.duration))},onTimeUpdate:()=>{h.current&&xe(h.current.currentTime)}}),Re&&a.jsx(Ze,{}),a.jsxs("div",{className:"glass-relative",children:[a.jsx("canvas",{ref:N,width:F,height:M,className:`
              glass-w-full glass-border glass-border-white/20 glass-radius-lg glass-surface-dark/20
              ${ve?"glass-cursor-pointer":""}
            `,style:{height:m?"130px":"clamp(120px, 26vw, 220px)",display:"block"},onClick:ve?y?Ie:Te:void 0}),!y&&a.jsx("div",{"aria-hidden":"true",className:"glass-pointer-events-none glass-absolute glass-inset-5 glass-flex glass-items-end glass-justify-between glass-gap-1 glass-overflow-hidden",children:Array.from({length:m?24:40},(e,s)=>{const t=22+Math.abs(Math.sin(s*.46))*58+Math.abs(Math.cos(s*.19))*26;return a.jsx("span",{className:"glass-flex-1 glass-radius-full",style:{height:`${Math.min(96,t)}%`,background:`rgba(${51+s*2}, ${65+s*2}, ${85+s*2}, .56)`,minWidth:2}},s)})}),a.jsx("div",{className:"glass-absolute glass-top-2 glass-right-2",children:a.jsx("div",{className:"glass-w-4 glass-h-4 glass-radius-full",style:{opacity:ge,transform:`scale(${1+ge})`,background:"rgba(71,85,105,.84)"}})})]}),Ve&&a.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4",children:[a.jsxs("div",{className:"glass-space-y-4",children:[a.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Visualization"}),a.jsxs("div",{className:"glass-space-y-3",children:[a.jsxs("div",{children:[a.jsx("label",{htmlFor:Ae,className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"Mode"}),a.jsxs("select",{id:Ae,value:d.mode,onChange:e=>he(s=>({...s,mode:e.target.value})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"Visualization mode",children:[a.jsx("option",{value:"bars",children:"Frequency Bars"}),a.jsx("option",{value:"wave",children:"Waveform"}),a.jsx("option",{value:"circular",children:"Circular"}),a.jsx("option",{value:"spectrum",children:"Spectrum"}),a.jsx("option",{value:"particles",children:"Particles"}),a.jsx("option",{value:"ripples",children:"Ripples"})]})]}),a.jsxs("div",{children:[a.jsx("label",{htmlFor:ze,className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"Color Scheme"}),a.jsxs("select",{id:ze,value:d.colorScheme,onChange:e=>he(s=>({...s,colorScheme:e.target.value})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"Color scheme",children:[a.jsx("option",{value:"rainbow",children:"Rainbow"}),a.jsx("option",{value:"monochrome",children:"Monochrome"}),a.jsx("option",{value:"neon",children:"Neon"}),a.jsx("option",{value:"fire",children:"Fire"}),a.jsx("option",{value:"ice",children:"Ice"}),a.jsx("option",{value:"galaxy",children:"Galaxy"})]})]}),a.jsxs("div",{children:[a.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Sensitivity: ",d.sensitivity.toFixed(1)]}),a.jsx("input",{type:"range",min:"0.1",max:"3.0",step:"0.1",value:d.sensitivity,onChange:e=>he(s=>({...s,sensitivity:parseFloat(e.target.value)})),className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":"Sensitivity"})]})]})]}),a.jsxs("div",{className:"glass-space-y-4",children:[a.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Audio Settings"}),a.jsxs("div",{className:"glass-space-y-3",children:[a.jsxs("div",{children:[a.jsxs("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:["Smoothing: ",v.smoothing.toFixed(1)]}),a.jsx("input",{type:"range",min:"0.0",max:"1.0",step:"0.1",value:v.smoothing,onChange:e=>{const s=parseFloat(e.target.value);me(t=>({...t,smoothing:s})),j.current&&(j.current.smoothingTimeConstant=s)},className:"glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer","aria-label":"Smoothing"})]}),a.jsxs("div",{children:[a.jsx("label",{className:"glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"FFT Size"}),a.jsxs("select",{value:v.fftSize,onChange:e=>me(s=>({...s,fftSize:parseInt(e.target.value)})),className:"glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm","aria-label":"FFT size",children:[a.jsx("option",{value:"128",children:"128"}),a.jsx("option",{value:"256",children:"256"}),a.jsx("option",{value:"512",children:"512"}),a.jsx("option",{value:"1024",children:"1024"}),a.jsx("option",{value:"2048",children:"2048"})]})]})]})]})]}),ke&&a.jsxs("div",{className:`
            glass-p-3 glass-radius-lg glass-border glass-border-white/10
            ${as({blur:"sm",opacity:.6}).background}
          `,children:[a.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2",children:"Frequency Analysis"}),a.jsxs("div",{className:"glass-grid glass-grid-cols-4 glass-gap-4 glass-text-sm",children:[a.jsxs("div",{children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Bass:"}),a.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[Math.round(W.slice(0,8).reduce((e,s)=>e+s,0)/8/255*100),"%"]})]}),a.jsxs("div",{children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Mid:"}),a.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[Math.round(W.slice(8,32).reduce((e,s)=>e+s,0)/24/255*100),"%"]})]}),a.jsxs("div",{children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Treble:"}),a.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[Math.round(W.slice(32).reduce((e,s)=>e+s,0)/(W.length-32)/255*100),"%"]})]}),a.jsxs("div",{children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Beat:"}),a.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[Math.round(ge*100),"%"]})]})]})]})]})});le.displayName="GlassMusicVisualizer";try{le.displayName="GlassMusicVisualizer",le.__docgenInfo={description:"",displayName:"GlassMusicVisualizer",props:{audioSource:{defaultValue:null,description:"",name:"audioSource",required:!1,type:{name:"string | MediaStream | undefined"}},audioSettings:{defaultValue:{value:"{}"},description:"",name:"audioSettings",required:!1,type:{name:"Partial<AudioSettings> | undefined"}},visualSettings:{defaultValue:{value:"{}"},description:"",name:"visualSettings",required:!1,type:{name:"Partial<VisualizationSettings> | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},showControls:{defaultValue:{value:"true"},description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},showFrequencyDisplay:{defaultValue:{value:"false"},description:"",name:"showFrequencyDisplay",required:!1,type:{name:"boolean | undefined"}},showWaveform:{defaultValue:{value:"true"},description:"",name:"showWaveform",required:!1,type:{name:"boolean | undefined"}},showSpectrum:{defaultValue:{value:"true"},description:"",name:"showSpectrum",required:!1,type:{name:"boolean | undefined"}},showSettings:{defaultValue:{value:"false"},description:"",name:"showSettings",required:!1,type:{name:"boolean | undefined"}},realTimeAnalysis:{defaultValue:{value:"true"},description:"",name:"realTimeAnalysis",required:!1,type:{name:"boolean | undefined"}},enableInteraction:{defaultValue:{value:"true"},description:"",name:"enableInteraction",required:!1,type:{name:"boolean | undefined"}},enableRecording:{defaultValue:{value:"false"},description:"",name:"enableRecording",required:!1,type:{name:"boolean | undefined"}},canvasWidth:{defaultValue:{value:"800"},description:"",name:"canvasWidth",required:!1,type:{name:"number | undefined"}},canvasHeight:{defaultValue:{value:"400"},description:"",name:"canvasHeight",required:!1,type:{name:"number | undefined"}},onAudioLoad:{defaultValue:null,description:"",name:"onAudioLoad",required:!1,type:{name:"((duration: number) => void) | undefined"}},onFrequencyData:{defaultValue:null,description:"",name:"onFrequencyData",required:!1,type:{name:"((data: Uint8Array<ArrayBufferLike>) => void) | undefined"}},onBeatDetected:{defaultValue:null,description:"",name:"onBeatDetected",required:!1,type:{name:"((intensity: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const qs={title:"AI + Intelligence/Glass Music Visualizer",component:le,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{canvasWidth:{control:{type:"range",min:400,max:1200,step:50}},canvasHeight:{control:{type:"range",min:200,max:600,step:50}},showControls:{control:"boolean"},showFrequencyDisplay:{control:"boolean"},showWaveform:{control:"boolean"},showSpectrum:{control:"boolean"},realTimeAnalysis:{control:"boolean"},enableInteraction:{control:"boolean"},enableRecording:{control:"boolean"}}},V={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,showWaveform:!0,showSpectrum:!0,realTimeAnalysis:!0,enableInteraction:!0,enableRecording:!1,audioSettings:{volume:.8,gain:1,bassBoost:0,trebleBoost:0,smoothing:.8,fftSize:256},visualSettings:{mode:"bars",colorScheme:"monochrome",particleCount:100,sensitivity:1,symmetry:!1,mirror:!1}}},P={args:{canvasWidth:800,canvasHeight:300,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"rainbow",sensitivity:1.2,symmetry:!1,mirror:!0},audioSettings:{fftSize:512,smoothing:.7}}},B={args:{canvasWidth:800,canvasHeight:300,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"wave",colorScheme:"neon",sensitivity:1.5,symmetry:!0,mirror:!1},audioSettings:{fftSize:1024,smoothing:.9}}},G={args:{canvasWidth:600,canvasHeight:600,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"circular",colorScheme:"galaxy",sensitivity:1,symmetry:!0,mirror:!1},audioSettings:{fftSize:256,smoothing:.8}}},L={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,showSpectrum:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"spectrum",colorScheme:"fire",sensitivity:1},audioSettings:{fftSize:512,smoothing:.6}}},_={args:{canvasWidth:800,canvasHeight:500,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"particles",colorScheme:"rainbow",particleCount:150,sensitivity:1.3},audioSettings:{fftSize:256,smoothing:.7}}},$={args:{canvasWidth:600,canvasHeight:600,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"ripples",colorScheme:"ice",sensitivity:1.5},audioSettings:{fftSize:256,smoothing:.8}}},E={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"neon",sensitivity:1.2,mirror:!0},audioSettings:{fftSize:512,smoothing:.7}}},U={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"fire",sensitivity:1,mirror:!1},audioSettings:{fftSize:256,smoothing:.8}}},O={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"circular",colorScheme:"ice",sensitivity:.8,symmetry:!0},audioSettings:{fftSize:256,smoothing:.9}}},Y={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"wave",colorScheme:"monochrome",sensitivity:1.5},audioSettings:{fftSize:1024,smoothing:.8}}},X={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"rainbow",sensitivity:3,mirror:!0},audioSettings:{fftSize:256,smoothing:.5}}},J={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"rainbow",sensitivity:.3,mirror:!1},audioSettings:{fftSize:256,smoothing:.9}}},K={args:{canvasWidth:1e3,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"galaxy",sensitivity:1},audioSettings:{fftSize:2048,smoothing:.8}}},Q={args:{canvasWidth:600,canvasHeight:300,showControls:!1,showFrequencyDisplay:!1,showWaveform:!1,showSpectrum:!1,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"circular",colorScheme:"neon",sensitivity:1}}},Z={args:{canvasWidth:800,canvasHeight:200,showControls:!0,showFrequencyDisplay:!1,showWaveform:!1,showSpectrum:!1,realTimeAnalysis:!0,enableInteraction:!1,visualSettings:{mode:"bars",colorScheme:"rainbow",sensitivity:1}}},ee={args:{canvasWidth:400,canvasHeight:200,showControls:!1,showFrequencyDisplay:!0,showWaveform:!1,showSpectrum:!1,realTimeAnalysis:!0,enableInteraction:!1,visualSettings:{mode:"bars",colorScheme:"monochrome",sensitivity:1}}},se={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,enableRecording:!0,visualSettings:{mode:"spectrum",colorScheme:"fire",sensitivity:1},audioSettings:{fftSize:512,smoothing:.7}}},ae={args:{canvasWidth:1200,canvasHeight:300,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"galaxy",sensitivity:1,mirror:!1},audioSettings:{fftSize:512,smoothing:.8}}},ne={args:{canvasWidth:400,canvasHeight:600,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"neon",sensitivity:1.2,mirror:!0},audioSettings:{fftSize:256,smoothing:.8}}},te={args:{canvasWidth:600,canvasHeight:600,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"circular",colorScheme:"rainbow",sensitivity:1,symmetry:!0,mirror:!1},audioSettings:{fftSize:256,smoothing:.8}}},re={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"bars",colorScheme:"ice",sensitivity:1,symmetry:!1,mirror:!0},audioSettings:{fftSize:512,smoothing:.7}}},ie={args:{canvasWidth:800,canvasHeight:500,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"particles",colorScheme:"galaxy",particleCount:300,sensitivity:1.5},audioSettings:{fftSize:256,smoothing:.6}}},oe={args:{canvasWidth:800,canvasHeight:400,showControls:!0,showFrequencyDisplay:!0,realTimeAnalysis:!0,enableInteraction:!0,visualSettings:{mode:"particles",colorScheme:"neon",particleCount:50,sensitivity:1},audioSettings:{fftSize:256,smoothing:.8}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
      colorScheme: 'monochrome',
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
}`,...L.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...oe.parameters?.docs?.source}}};const As=["Default","FrequencyBars","WaveformMode","CircularVisualizer","SpectrumAnalyzer","ParticleSystem","RipplesEffect","NeonTheme","FireTheme","IceTheme","MonochromeMode","HighSensitivity","LowSensitivity","HighResolutionFFT","MinimalInterface","ControlsOnly","FrequencyDisplayOnly","RecordingMode","WideCanvas","TallCanvas","SymmetricVisualization","MirroredBars","HighParticleCount","LowParticleCount"];export{G as CircularVisualizer,Z as ControlsOnly,V as Default,U as FireTheme,P as FrequencyBars,ee as FrequencyDisplayOnly,ie as HighParticleCount,K as HighResolutionFFT,X as HighSensitivity,O as IceTheme,oe as LowParticleCount,J as LowSensitivity,Q as MinimalInterface,re as MirroredBars,Y as MonochromeMode,E as NeonTheme,_ as ParticleSystem,se as RecordingMode,$ as RipplesEffect,L as SpectrumAnalyzer,te as SymmetricVisualization,ne as TallCanvas,B as WaveformMode,ae as WideCanvas,As as __namedExportsOrder,qs as default};
