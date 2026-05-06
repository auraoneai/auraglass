import{j as s,r as S}from"./iframe-mbNquNNc.js";import{s as u,G as c,a as f,u as A,b as m,c as T}from"./GlassSpatialAudio-CRCXq6J3.js";import"./preload-helper-PPVm8Dsz.js";const F={title:"Advanced/Consciousness Interface/Spatial Audio",component:c,parameters:{layout:"fullscreen",docs:{description:{component:`
# Glass Spatial Audio System

3D positioned glass sounds with Web Audio API and Head-Related Transfer Function (HRTF) processing.

## Features
- **3D Spatial Positioning** - Sounds positioned in 3D space with accurate directional audio
- **HRTF Processing** - Head-Related Transfer Function for realistic 3D audio perception
- **Glass-Themed Sound Library** - Synthesized glass sounds (tap, hover, slide, break, ambient)
- **Real-time Audio Analysis** - Volume and frequency analysis for reactive components
- **Spatial Visualization** - 3D audio space visualization with active sound sources
- **Multiple Distance Models** - Linear, inverse, and exponential distance attenuation

## Technical Implementation
- **Web Audio API** - Full Web Audio API integration with AudioContext management
- **PannerNode** - 3D audio positioning with HRTF or equalpower panning
- **Synthetic Audio Generation** - Procedurally generated glass sounds using oscillators
- **Audio-Reactive Components** - Visual elements that respond to audio characteristics
- **Performance Optimized** - Efficient audio buffer management and source pooling

## Sound Types
- **UI Sounds** - Sharp, metallic sounds for interface interactions
- **Ambient Sounds** - Soft, ethereal glass atmosphere
- **Feedback Sounds** - Glass breaking, sliding, and transformation effects
- **Notification Sounds** - Bell-like glass chimes for alerts

## Browser Support
- **Modern Browsers** - Chrome, Firefox, Edge, Safari with Web Audio API
- **HTTPS Required** - Some browsers require HTTPS for audio context
- **User Interaction** - Audio context must be initialized after user gesture
        `}}},argTypes:{settings:{control:"object",description:"Spatial audio configuration settings"},autoInitialize:{control:"boolean",description:"Automatically initialize audio on user interaction"}},tags:["autodocs"]};function R(){const{isInitialized:t,masterVolume:a,setMasterVolume:l}=A(),{playTap:o,playHover:i,playSlide:r,playBreak:e,playNotification:N}=T(),[j,w]=S.useState(0),[b,z]=S.useState(!0),G=S.useRef(null),k=(n,g)=>{switch(w(d=>d+1),n){case"tap":o(g);break;case"hover":i(g);break;case"slide":r(g);break;case"break":e(g);break;case"notification":N(g);break}};return s.jsxs("div",{ref:G,className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center glass-gap-4",children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-primary",children:"🎵 Glass Spatial Audio"}),s.jsx("p",{className:"glass-text-lg glass-text-secondary",children:"3D positioned glass sounds that respond to your interactions"}),s.jsxs("div",{className:"glass-flex glass-justify-center glass-items-center space-x-6",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2",children:[s.jsx("div",{className:`w-2 h-2 glass-radius-full ${t?"bg-green-400":"bg-red-400"}`}),s.jsx("span",{className:"glass-text-sm glass-text-primary",children:t?"Audio Active":"Click to Initialize"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2",children:[s.jsx("span",{className:"glass-text-sm glass-text-primary",children:"🔊"}),s.jsx("input",{type:"range",min:"0",max:"1",step:"0.1",value:a,onChange:n=>l(parseFloat(n.target.value)),className:"glass-w-20 glass-focus glass-touch-target glass-contrast-guard"}),s.jsxs("span",{className:"glass-text-xs glass-text-secondary",children:[(a*100).toFixed(0),"%"]})]}),s.jsx("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2",children:s.jsxs("span",{className:"glass-text-sm glass-text-primary",children:["🎶 Sounds Played: ",j]})})]}),s.jsx("button",{onClick:()=>z(!b),className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-px-4 glass-py-2 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard",children:b?"🎵 Hide Audio Visualizer":"🎵 Show Audio Visualizer"})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-6",children:[{sound:"tap",icon:"🫳",label:"Glass Tap",description:"Sharp metallic tap sound"},{sound:"hover",icon:"👻",label:"Glass Hover",description:"Subtle ethereal whisper"},{sound:"slide",icon:"↔️",label:"Glass Slide",description:"Smooth sliding effect"},{sound:"break",icon:"💥",label:"Glass Break",description:"Dramatic shattering"},{sound:"notification",icon:"🔔",label:"Glass Bell",description:"Crystalline notification"},{sound:"tap",icon:"⚡",label:"Energy Burst",description:"High-energy glass effect"},{sound:"hover",icon:"🌟",label:"Starlight",description:"Gentle twinkling sound"},{sound:"slide",icon:"🌊",label:"Glass Wave",description:"Flowing glass texture"}].map((n,g)=>s.jsxs("button",{className:`glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center glass-gap-4 
                      hover:glass-elev-3 transition-all duration-300 glass-cursor-pointer group glass-focus glass-touch-target glass-contrast-guard`,onClick:d=>k(n.sound,d.currentTarget),onMouseEnter:d=>i(d.currentTarget),children:[s.jsx("div",{className:"glass-text-3xl group-hover:scale-110 transition-transform duration-300",children:n.icon}),s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary",children:n.label}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:n.description}),s.jsx("div",{className:"glass-text-xs glass-text-tertiary",children:"Click to hear spatial audio"})]},`sound-${g}`))}),s.jsxs("div",{className:"glass-stack glass-stack-lg",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-2",children:"🎨 Audio-Reactive Glass"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Components that visually respond to audio characteristics"})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6",children:[s.jsxs(f,{position:{x:-.5,y:0,z:0},reactToVolume:!0,intensityMultiplier:1.5,className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center glass-gap-4",children:[s.jsx("div",{className:"glass-text-2xl",children:"🎵"}),s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"Volume Reactive"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Responds to audio volume levels"})]}),s.jsxs(f,{position:{x:0,y:0,z:0},reactToVolume:!0,reactToFrequency:!0,intensityMultiplier:1.2,className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center glass-gap-4",children:[s.jsx("div",{className:"glass-text-2xl",children:"🌈"}),s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"Full Spectrum"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Responds to volume and frequency"})]}),s.jsxs(f,{position:{x:.5,y:0,z:0},reactToFrequency:!0,intensityMultiplier:2,className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center glass-gap-4",children:[s.jsx("div",{className:"glass-text-2xl",children:"📊"}),s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"Frequency Reactive"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Responds to frequency analysis"})]})]})]}),s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-medium glass-text-primary glass-mb-4",children:"🔊 Spatial Audio Features"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-6",children:[s.jsxs("div",{className:"glass-gap-3",children:[s.jsx("h4",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"3D Positioning"}),s.jsxs("ul",{className:"glass-gap-1 glass-text-sm glass-text-secondary",children:[s.jsx("li",{children:"• HRTF processing for realistic 3D audio"}),s.jsx("li",{children:"• Distance-based volume attenuation"}),s.jsx("li",{children:"• Directional panning effects"}),s.jsx("li",{children:"• Real-time position updates"})]})]}),s.jsxs("div",{className:"glass-gap-3",children:[s.jsx("h4",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"Glass Sounds"}),s.jsxs("ul",{className:"glass-gap-1 glass-text-sm glass-text-secondary",children:[s.jsx("li",{children:"• Synthesized glass tones"}),s.jsx("li",{children:"• Multiple sound variations"}),s.jsx("li",{children:"• Category-based organization"}),s.jsx("li",{children:"• Procedural audio generation"})]})]}),s.jsxs("div",{className:"glass-gap-3",children:[s.jsx("h4",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"Interactive Features"}),s.jsxs("ul",{className:"glass-gap-1 glass-text-sm glass-text-secondary",children:[s.jsx("li",{children:"• Mouse position tracking"}),s.jsx("li",{children:"• Element-based positioning"}),s.jsx("li",{children:"• Volume and frequency analysis"}),s.jsx("li",{children:"• Visual audio feedback"})]})]})]})]}),s.jsx(m,{show:b})]})}const p={render:t=>s.jsx(c,{...t,children:s.jsx(R,{})}),args:{settings:u.standard,autoInitialize:!0}},x={render:t=>s.jsxs(c,{...t,children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Minimal Spatial Audio"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mb-6",children:"Non-spatial audio with reduced volume and simplified effects"})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4",children:["Tap","Hover","Slide","Break"].map((a,l)=>{const{playTap:o,playHover:i,playSlide:r,playBreak:e}=T(),N={Tap:o,Hover:i,Slide:r,Break:e};return s.jsxs("button",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-4 glass-text-center hover:glass-elev-2 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard",onClick:j=>N[a](j.currentTarget),children:[s.jsx("div",{className:"glass-text-xl glass-mb-2",children:"🔊"}),s.jsx("div",{className:"glass-text-sm glass-text-primary",children:a})]},a)})})]}),s.jsx(m,{show:!0})]}),args:{settings:u.minimal,autoInitialize:!0},parameters:{docs:{description:{story:"Minimal mode with non-spatial audio and reduced volume."}}}},h={render:t=>s.jsxs(c,{...t,children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Immersive Spatial Audio"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mb-6",children:"Full 3D spatial audio with HRTF processing and Doppler effects"})]}),s.jsxs("div",{className:"glass-relative glass-h-96 glass-surface-primary glass-elev-1 glass-radius-lg glass-p-8",children:[s.jsxs("div",{className:"glass-text-center mb-6",children:[s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"3D Audio Space"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Click anywhere to place sounds in 3D space"})]}),s.jsxs("div",{className:"glass-relative glass-w-full glass-h-full glass-surface-secondary glass-radius-lg cursor-crosshair",onClick:a=>{const l=a.currentTarget.getBoundingClientRect(),o=(a.clientX-l.left)/l.width*2-1,i=1-(a.clientY-l.top)/l.height*2,{playGlassSound:r}=A();r("tap",{x:o,y:i,z:0},{volume:.8});const e=document.createElement("div");e.className="glass-absolute glass-w-4 glass-h-4 glass-surface-primary glass-radius-full animate-ping",e.style.left=`${(o+1)/2*100}%`,e.style.top=`${(1-i)/2*100}%`,e.style.transform="translate(-50%, -50%)",a.currentTarget.appendChild(e),setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e)},1e3)},children:[s.jsx("div",{className:"glass-absolute glass-glassglass--top-2 left-2 glass-text-xs glass-text-tertiary",children:"Left (-1, 1)"}),s.jsx("div",{className:"glass-absolute glass-glassglass--top-2 right-2 glass-text-xs glass-text-tertiary",children:"Right (1, 1)"}),s.jsx("div",{className:"glass-absolute bottom-2 left-2 glass-text-xs glass-text-tertiary",children:"Left (-1, -1)"}),s.jsx("div",{className:"glass-absolute bottom-2 right-2 glass-text-xs glass-text-tertiary",children:"Right (1, -1)"}),s.jsxs("div",{className:"glass-absolute glassglass--top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",children:[s.jsx("div",{className:"glass-w-3 glass-h-3 glass-surface-green glass-radius-full"}),s.jsx("div",{className:"glass-text-xs glass-text-primary glass-mt-1",children:"Listener (0, 0)"})]})]})]})]}),s.jsx(m,{show:!0})]}),args:{settings:u.immersive,autoInitialize:!0},parameters:{docs:{description:{story:"Immersive mode with full 3D spatial audio, HRTF processing, and interactive positioning."}}}},y={render:t=>s.jsxs(c,{...t,children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Gaming Audio Mode"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mb-6",children:"High-performance spatial audio optimized for gaming interactions"})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-3 md:glass-glass-grid-cols-5 glass-gap-4",children:Array.from({length:15},(a,l)=>{const{playTap:o,playBreak:i}=T(),r=l%3===0;return s.jsx("button",{className:`aspect-square glass-surface-primary glass-elev-2 glass-radius-lg 
                          hover:glass-elev-3 transition-all duration-300 flex items-center justify-center
                          ${r?"bg-red-500/20":"glass-surface-primary/20"}`,onClick:e=>{r?i(e.currentTarget):o(e.currentTarget)},children:s.jsx("div",{className:"glass-text-xl",children:r?"🎯":"⚪"})},l)})}),s.jsxs("div",{className:"glass-text-center glass-surface-primary glass-elev-1 glass-radius-lg glass-p-4",children:[s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"🎯 Red targets: Break sound | ⚪ Blue targets: Tap sound"}),s.jsx("p",{className:"glass-text-xs glass-text-tertiary glass-mt-2",children:"Optimized for low latency and precise audio positioning"})]})]}),s.jsx(m,{show:!0})]}),args:{settings:u.gaming,autoInitialize:!0},parameters:{docs:{description:{story:"Gaming mode with optimized performance for interactive gaming experiences."}}}},v={render:t=>s.jsxs(c,{...t,children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Audio-Reactive Components"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mb-6",children:"Visual components that respond to spatial audio characteristics"})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-4 glass-gap-6",children:[{position:{x:-.8,y:.5,z:0},label:"Left High"},{position:{x:.8,y:.5,z:0},label:"Right High"},{position:{x:-.8,y:-.5,z:0},label:"Left Low"},{position:{x:.8,y:-.5,z:0},label:"Right Low"}].map((a,l)=>s.jsxs(f,{position:a.position,reactToVolume:!0,reactToFrequency:l%2===0,intensityMultiplier:1.5,className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center glass-gap-4 glass-min-glass-h-32",children:[s.jsx("div",{className:"glass-text-2xl",children:"🎵"}),s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary",children:a.label}),s.jsx("p",{className:"glass-text-xs glass-text-secondary",children:l%2===0?"Volume + Frequency":"Volume Only"})]},l))}),s.jsx("div",{className:"glass-text-center",children:s.jsx("button",{className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-px-6 glass-py-3 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard",onClick:()=>{const{playGlassSound:a}=A();a("ambientGlass",{x:0,y:0,z:0},{loop:!0,volume:.5})},children:"🎵 Start Ambient Audio"})})]}),s.jsx(m,{show:!1})]}),args:{settings:u.standard,autoInitialize:!0},parameters:{docs:{description:{story:"Shows audio-reactive components responding to spatial audio characteristics."}}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <GlassSpatialAudioProvider {...args}>
      <SpatialAudioDemo />
    </GlassSpatialAudioProvider>,
  args: {
    settings: spatialAudioPresets.standard,
    autoInitialize: true
  }
}`,...p.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <GlassSpatialAudioProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Minimal Spatial Audio
          </h2>
          <p className="glass-text-sm glass-text-secondary mb-6">
            Non-spatial audio with reduced volume and simplified effects
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4">
          {['Tap', 'Hover', 'Slide', 'Break'].map((soundType, i) => {
          const {
            playTap,
            playHover,
            playSlide,
            playBreak
          } = useGlassSound();
          const sounds = {
            Tap: playTap,
            Hover: playHover,
            Slide: playSlide,
            Break: playBreak
          };
          return <button key={soundType} className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-4 glass-text-center hover:glass-elev-2 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard" onClick={e => sounds[soundType as keyof typeof sounds](e.currentTarget)}>
                <div className="glass-text-xl glass-mb-2">🔊</div>
                <div className="glass-text-sm glass-text-primary">{soundType}</div>
              </button>;
        })}
        </div>
      </div>
      <GlassSpatialVisualizer show={true} />
    </GlassSpatialAudioProvider>,
  args: {
    settings: spatialAudioPresets.minimal,
    autoInitialize: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal mode with non-spatial audio and reduced volume.'
      }
    }
  }
}`,...x.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <GlassSpatialAudioProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Immersive Spatial Audio
          </h2>
          <p className="glass-text-sm glass-text-secondary mb-6">
            Full 3D spatial audio with HRTF processing and Doppler effects
          </p>
        </div>
        
        <div className="glass-relative glass-h-96 glass-surface-primary glass-elev-1 glass-radius-lg glass-p-8">
          <div className="glass-text-center mb-6">
            <h3 className="glass-text-lg glass-font-medium glass-text-primary">
              3D Audio Space
            </h3>
            <p className="glass-text-sm glass-text-secondary">
              Click anywhere to place sounds in 3D space
            </p>
          </div>
          
          <div className="glass-relative glass-w-full glass-h-full glass-surface-secondary glass-radius-lg cursor-crosshair" onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width * 2 - 1; // -1 to 1
          const y = 1 - (e.clientY - rect.top) / rect.height * 2; // -1 to 1 (inverted)

          const {
            playGlassSound
          } = useSpatialAudio();
          playGlassSound('tap', {
            x,
            y,
            z: 0
          }, {
            volume: 0.8
          });

          // Visual feedback
          const dot = document.createElement('div');
          dot.className = 'glass-absolute glass-w-4 glass-h-4 glass-surface-primary glass-radius-full animate-ping';
          dot.style.left = \`\${(x + 1) / 2 * 100}%\`;
          dot.style.top = \`\${(1 - y) / 2 * 100}%\`;
          dot.style.transform = 'translate(-50%, -50%)';
          e.currentTarget.appendChild(dot);
          setTimeout(() => {
            if (dot.parentNode) {
              dot.parentNode.removeChild(dot);
            }
          }, 1000);
        }}>
            <div className="glass-absolute glass-glassglass--top-2 left-2 glass-text-xs glass-text-tertiary">
              Left (-1, 1)
            </div>
            <div className="glass-absolute glass-glassglass--top-2 right-2 glass-text-xs glass-text-tertiary">
              Right (1, 1)
            </div>
            <div className="glass-absolute bottom-2 left-2 glass-text-xs glass-text-tertiary">
              Left (-1, -1)
            </div>
            <div className="glass-absolute bottom-2 right-2 glass-text-xs glass-text-tertiary">
              Right (1, -1)
            </div>
            <div className="glass-absolute glassglass--top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="glass-w-3 glass-h-3 glass-surface-green glass-radius-full" />
              <div className="glass-text-xs glass-text-primary glass-mt-1">Listener (0, 0)</div>
            </div>
          </div>
        </div>
      </div>
      <GlassSpatialVisualizer show={true} />
    </GlassSpatialAudioProvider>,
  args: {
    settings: spatialAudioPresets.immersive,
    autoInitialize: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Immersive mode with full 3D spatial audio, HRTF processing, and interactive positioning.'
      }
    }
  }
}`,...h.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <GlassSpatialAudioProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Gaming Audio Mode
          </h2>
          <p className="glass-text-sm glass-text-secondary mb-6">
            High-performance spatial audio optimized for gaming interactions
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-3 md:glass-glass-grid-cols-5 glass-gap-4">
          {Array.from({
          length: 15
        }, (_, i) => {
          const {
            playTap,
            playBreak
          } = useGlassSound();
          const isTarget = i % 3 === 0;
          return <button key={i} className={\`aspect-square glass-surface-primary glass-elev-2 glass-radius-lg 
                          hover:glass-elev-3 transition-all duration-300 flex items-center justify-center
                          \${isTarget ? 'bg-red-500/20' : 'glass-surface-primary/20'}\`} onClick={e => {
            if (isTarget) {
              playBreak(e.currentTarget);
            } else {
              playTap(e.currentTarget);
            }
          }}>
                <div className="glass-text-xl">
                  {isTarget ? '🎯' : '⚪'}
                </div>
              </button>;
        })}
        </div>
        
        <div className="glass-text-center glass-surface-primary glass-elev-1 glass-radius-lg glass-p-4">
          <p className="glass-text-sm glass-text-secondary">
            🎯 Red targets: Break sound | ⚪ Blue targets: Tap sound
          </p>
          <p className="glass-text-xs glass-text-tertiary glass-mt-2">
            Optimized for low latency and precise audio positioning
          </p>
        </div>
      </div>
      <GlassSpatialVisualizer show={true} />
    </GlassSpatialAudioProvider>,
  args: {
    settings: spatialAudioPresets.gaming,
    autoInitialize: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Gaming mode with optimized performance for interactive gaming experiences.'
      }
    }
  }
}`,...y.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <GlassSpatialAudioProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Audio-Reactive Components
          </h2>
          <p className="glass-text-sm glass-text-secondary mb-6">
            Visual components that respond to spatial audio characteristics
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-4 glass-gap-6">
          {[{
          position: {
            x: -0.8,
            y: 0.5,
            z: 0
          },
          label: 'Left High'
        }, {
          position: {
            x: 0.8,
            y: 0.5,
            z: 0
          },
          label: 'Right High'
        }, {
          position: {
            x: -0.8,
            y: -0.5,
            z: 0
          },
          label: 'Left Low'
        }, {
          position: {
            x: 0.8,
            y: -0.5,
            z: 0
          },
          label: 'Right Low'
        }].map((config, i) => <GlassAudioReactive key={i} position={config.position} reactToVolume={true} reactToFrequency={i % 2 === 0} intensityMultiplier={1.5} className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center glass-gap-4 glass-min-glass-h-32">
              <div className="glass-text-2xl">🎵</div>
              <h3 className="glass-text-sm glass-font-medium glass-text-primary">{config.label}</h3>
              <p className="glass-text-xs glass-text-secondary">
                {i % 2 === 0 ? 'Volume + Frequency' : 'Volume Only'}
              </p>
            </GlassAudioReactive>)}
        </div>
        
        <div className="glass-text-center">
          <button className="glass-surface-primary glass-elev-2 glass-radius-lg glass-px-6 glass-py-3 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard" onClick={() => {
          const {
            playGlassSound
          } = useSpatialAudio();
          playGlassSound('ambientGlass', {
            x: 0,
            y: 0,
            z: 0
          }, {
            loop: true,
            volume: 0.5
          });
        }}>
            🎵 Start Ambient Audio
          </button>
        </div>
      </div>
      <GlassSpatialVisualizer show={false} />
    </GlassSpatialAudioProvider>,
  args: {
    settings: spatialAudioPresets.standard,
    autoInitialize: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows audio-reactive components responding to spatial audio characteristics.'
      }
    }
  }
}`,...v.parameters?.docs?.source}}};const H=["Interactive","MinimalMode","ImmersiveMode","GamingMode","AudioReactiveOnly"];export{v as AudioReactiveOnly,y as GamingMode,h as ImmersiveMode,p as Interactive,x as MinimalMode,H as __namedExportsOrder,F as default};
