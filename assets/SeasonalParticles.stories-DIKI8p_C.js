const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SeasonalParticles.r3f-Cjz6JT6y.js","./iframe-DpweptvF.js","./preload-helper-PPVm8Dsz.js","./iframe-BBVYlW5A.css","./react-three-fiber.esm-Dnw2i2j6.js","./index-CWG1rEj-.js","./random-B9-1h0DP.js","./pause-DizZQn_H.js","./createLucideIcon-eJ4-KqhR.js","./play-Kk_nf272.js","./wind-De1xyNS-.js","./snowflake-B2yzgBZ3.js","./sun-Bc3Sa5NP.js"])))=>i.map(i=>d[i]);
import{r as x,j as s,c as h}from"./iframe-DpweptvF.js";import{_ as v}from"./preload-helper-PPVm8Dsz.js";import{a as y}from"./reactVersion-C0Jyrkmz.js";let b=null;function e(a){const[l,f]=x.useState(b);if(x.useEffect(()=>{let t=!1;if(y())return l||v(()=>import("./SeasonalParticles.r3f-Cjz6JT6y.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12]),import.meta.url).then(r=>{if(t)return;const n=r.SeasonalParticlesR3F||r.default;b=n,f(()=>n)}).catch(()=>{}),()=>{t=!0}},[l]),!l){const{className:t,children:r,...n}=a;return s.jsx("div",{className:h("seasonal-particles glass-relative glass-overflow-hidden",t),...n,children:s.jsx("div",{className:h("glass-relative glass-z-10"),children:r})})}return s.jsx(l,{...a})}try{e.displayName="SeasonalParticles",e.__docgenInfo={description:"",displayName:"SeasonalParticles",props:{season:{defaultValue:null,description:"",name:"season",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"auto"'},{value:'"spring"'},{value:'"summer"'},{value:'"autumn"'},{value:'"winter"'}]}},particleCount:{defaultValue:null,description:"",name:"particleCount",required:!1,type:{name:"number | undefined"}},windStrength:{defaultValue:null,description:"",name:"windStrength",required:!1,type:{name:"number | undefined"}},animationSpeed:{defaultValue:null,description:"",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},showControls:{defaultValue:null,description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},autoSeason:{defaultValue:null,description:"",name:"autoSeason",required:!1,type:{name:"boolean | undefined"}},seasonDuration:{defaultValue:null,description:"",name:"seasonDuration",required:!1,type:{name:"number | undefined"}},onSeasonChange:{defaultValue:null,description:"",name:"onSeasonChange",required:!1,type:{name:"((season: string) => void) | undefined"}},seed:{defaultValue:null,description:"",name:"seed",required:!1,type:{name:"string | number | undefined"}}}}}catch{}const j={title:"Effects/SeasonalParticles",component:e,parameters:{layout:"fullscreen",docs:{description:{component:"Beautiful seasonal particle effects that dynamically adapt to different seasons with realistic weather and environmental animations."}}},argTypes:{season:{control:{type:"select",options:["winter","spring","summer","autumn","auto"]},description:"Season for particle effects"},particleCount:{control:{type:"number",min:10,max:100,step:10},description:"Number of particles"},windStrength:{control:{type:"number",min:0,max:2,step:.1},description:"Wind strength affecting particles"},animationSpeed:{control:{type:"number",min:.1,max:2,step:.1},description:"Animation speed multiplier"},autoSeason:{control:"boolean",description:"Automatically cycle through seasons"},seasonDuration:{control:{type:"number",min:5e3,max:3e4,step:1e3},description:"Duration of each season in auto mode"},showControls:{control:"boolean",description:"Show season controls"}}},i={args:{season:"winter",particleCount:50,windStrength:.5,animationSpeed:1,autoSeason:!1,showControls:!0},render:a=>s.jsx("div",{className:"glass-relative",children:s.jsx(e,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-blue-800 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsxs("div",{className:"glass-text-center glass-text-primary",children:[s.jsx("div",{className:"glass-text-6xl glass-mb-4",children:"❄️"}),s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-mb-4",children:"Winter Wonderland"}),s.jsx("p",{className:"glass-text-xl text-blue-200 max-w-2xl",children:"Experience the magic of falling snow with realistic physics and beautiful winter ambiance. Watch the snowflakes gently drift down with natural wind effects."}),s.jsx("div",{className:"mt-8 glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard",children:s.jsxs("p",{className:"glass-text-sm text-blue-200",children:["❄️ Snow particles with realistic falling animation",s.jsx("br",{}),"🌬️ Wind effects that influence particle movement",s.jsx("br",{}),"🎨 Dynamic lighting and atmospheric effects"]})})]})})})})},g={args:{season:"spring",particleCount:40,windStrength:.8,animationSpeed:1.2,autoSeason:!1,showControls:!0},render:a=>s.jsx("div",{className:"glass-relative",children:s.jsx(e,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-pink-300 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsxs("div",{className:"glass-text-center glass-text-secondary",children:[s.jsx("div",{className:"glass-text-6xl glass-mb-4",children:"🌸"}),s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-mb-4",children:"Spring Blossoms"}),s.jsx("p",{className:"glass-text-xl glass-text-secondary max-w-2xl",children:"Celebrate the arrival of spring with floating petals and gentle breezes. Experience the rebirth of nature through delicate particle animations."}),s.jsx("div",{className:"mt-8 glass-p-4 glass-surface-subtle/80 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/50 glass-contrast-guard",children:s.jsxs("p",{className:"glass-text-sm glass-text-secondary",children:["🌸 Floating flower petals with organic movement",s.jsx("br",{}),"🌬️ Gentle spring breezes affecting particles",s.jsx("br",{}),"🎨 Vibrant colors celebrating new life"]})})]})})})})},o={args:{season:"summer",particleCount:30,windStrength:1.2,animationSpeed:1.5,autoSeason:!1,showControls:!0},render:a=>s.jsx("div",{className:"glass-relative",children:s.jsx(e,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-orange-400 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsxs("div",{className:"glass-text-center glass-text-primary",children:[s.jsx("div",{className:"glass-text-6xl glass-mb-4",children:"☀️"}),s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-mb-4",children:"Summer Rays"}),s.jsx("p",{className:"glass-text-xl text-orange-100 max-w-2xl",children:"Feel the warmth of summer with radiant sun rays and golden particles. Experience the energy and brightness of the summer season."}),s.jsx("div",{className:"mt-8 glass-p-4 glass-surface-dark/20 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/30 glass-contrast-guard",children:s.jsxs("p",{className:"glass-text-sm text-orange-100",children:["☀️ Radiant sun rays with pulsing light effects",s.jsx("br",{}),"🌟 Golden particles dancing in the summer breeze",s.jsx("br",{}),"🎨 Warm, vibrant colors evoking summer energy"]})})]})})})})},c={args:{season:"autumn",particleCount:45,windStrength:1,animationSpeed:.8,autoSeason:!1,showControls:!0},render:a=>s.jsx("div",{className:"glass-relative",children:s.jsx(e,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-red-600 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsxs("div",{className:"glass-text-center glass-text-primary",children:[s.jsx("div",{className:"glass-text-6xl glass-mb-4",children:"🍂"}),s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-mb-4",children:"Autumn Leaves"}),s.jsx("p",{className:"glass-text-xl text-orange-100 max-w-2xl",children:"Witness the beauty of fall with gently falling leaves and crisp autumn winds. Experience the changing colors and peaceful descent of autumn foliage."}),s.jsx("div",{className:"mt-8 glass-p-4 glass-surface-dark/20 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/30 glass-contrast-guard",children:s.jsxs("p",{className:"glass-text-sm text-orange-100",children:["🍂 Falling autumn leaves with realistic physics",s.jsx("br",{}),"🌬️ Crisp winds carrying particles naturally",s.jsx("br",{}),"🎨 Rich, earthy colors of fall foliage"]})})]})})})})},d={args:{season:"auto",particleCount:35,windStrength:.7,animationSpeed:1,autoSeason:!0,seasonDuration:8e3,showControls:!0},render:a=>s.jsx("div",{className:"glass-relative",children:s.jsx(e,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-blue-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsxs("div",{className:"glass-text-center glass-text-primary",children:[s.jsx("div",{className:"glass-text-6xl glass-mb-4",children:"🌈"}),s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-mb-4",children:"Seasonal Journey"}),s.jsx("p",{className:"glass-text-xl text-purple-200 max-w-2xl",children:"Embark on a journey through all four seasons automatically. Watch as the environment transforms with each seasonal change."}),s.jsx("div",{className:"mt-8 glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard",children:s.jsxs("p",{className:"glass-text-sm text-purple-200",children:["🌈 Automatic seasonal progression every 8 seconds",s.jsx("br",{}),"🔄 Smooth transitions between different environments",s.jsx("br",{}),"🎭 Dynamic particle systems adapting to each season"]})}),s.jsx("div",{className:"mt-4 glass-text-sm glass-text-secondary",children:"Seasons cycle: Winter → Spring → Summer → Autumn → Repeat"})]})})})})},m={args:{season:"winter",particleCount:20,windStrength:.3,animationSpeed:.6,autoSeason:!1,showControls:!1},render:a=>s.jsx("div",{className:"glass-relative",children:s.jsx(e,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-surface-subtle glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"❄️"}),s.jsx("h1",{className:"glass-text-2xl glass-font-bold glass-text-secondary glass-mb-4",children:"Minimal Winter"}),s.jsx("p",{className:"glass-text-secondary max-w-xl",children:"A subtle winter scene with gentle snowfall. Perfect for applications needing understated seasonal effects."})]})})})})},u={args:{season:"summer",particleCount:80,windStrength:1.5,animationSpeed:2,autoSeason:!1,showControls:!0},render:a=>s.jsx("div",{className:"glass-relative",children:s.jsx(e,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-orange-400 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8",children:s.jsxs("div",{className:"glass-text-center glass-text-primary",children:[s.jsx("div",{className:"glass-text-5xl glass-mb-4",children:"☀️"}),s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-mb-4",children:"Intense Summer"}),s.jsx("p",{className:"glass-text-xl text-yellow-100 max-w-2xl",children:"Experience summer in full intensity with abundant sun rays and strong winds. Feel the heat and energy of the brightest season!"})]})})})})},p={args:{season:"auto",particleCount:25,windStrength:.6,animationSpeed:.8,autoSeason:!0,seasonDuration:12e3,showControls:!0},render:a=>s.jsx("div",{className:"glass-relative",children:s.jsx(e,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-p-8",children:s.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-primary glass-text-center mb-12",children:"Seasonal Gallery"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8",children:[s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Winter ❄️"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm glass-mb-4",children:"Gentle snowfall with crystalline beauty and peaceful ambiance. Perfect for creating a serene, magical atmosphere."}),s.jsxs("div",{className:"glass-text-xs glass-text-secondary",children:["• Realistic snow physics",s.jsx("br",{}),"• Wind-affected drift",s.jsx("br",{}),"• Icy blue aesthetics"]})]}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Spring 🌸"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm glass-mb-4",children:"Delicate flower petals dancing in the spring breeze. Symbolizing renewal and the beauty of new beginnings."}),s.jsxs("div",{className:"glass-text-xs text-pink-300",children:["• Organic petal movement",s.jsx("br",{}),"• Vibrant spring colors",s.jsx("br",{}),"• Gentle floating animation"]})]}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Summer ☀️"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm glass-mb-4",children:"Radiant sun rays and golden particles filling the air. Capturing the warmth and energy of bright summer days."}),s.jsxs("div",{className:"glass-text-xs glass-text-secondary",children:["• Pulsing light effects",s.jsx("br",{}),"• Golden particle systems",s.jsx("br",{}),"• Warm, vibrant energy"]})]}),s.jsxs("div",{className:"glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Autumn 🍂"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm glass-mb-4",children:"Falling leaves in rich autumn colors with realistic physics. Celebrating the beauty of change and transition."}),s.jsxs("div",{className:"glass-text-xs glass-text-secondary",children:["• Realistic leaf physics",s.jsx("br",{}),"• Earthy autumn palette",s.jsx("br",{}),"• Swirling wind effects"]})]})]})]})})})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    season: 'winter',
    particleCount: 50,
    windStrength: 0.5,
    animationSpeed: 1,
    autoSeason: false,
    showControls: true
  },
  render: args => <div className="glass-relative">
      <SeasonalParticles {...args}>
        <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-blue-800 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
          <div className="glass-text-center glass-text-primary">
            <div className="glass-text-6xl glass-mb-4">❄️</div>
            <h1 className="glass-text-4xl glass-font-bold glass-mb-4">Winter Wonderland</h1>
            <p className="glass-text-xl text-blue-200 max-w-2xl">
              Experience the magic of falling snow with realistic physics and beautiful winter ambiance.
              Watch the snowflakes gently drift down with natural wind effects.
            </p>
            <div className="mt-8 glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard">
              <p className="glass-text-sm text-blue-200">
                ❄️ Snow particles with realistic falling animation<br />
                🌬️ Wind effects that influence particle movement<br />
                🎨 Dynamic lighting and atmospheric effects
              </p>
            </div>
          </div>
        </div>
      </SeasonalParticles>
    </div>
}`,...i.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    season: 'spring',
    particleCount: 40,
    windStrength: 0.8,
    animationSpeed: 1.2,
    autoSeason: false,
    showControls: true
  },
  render: args => <div className="glass-relative">
      <SeasonalParticles {...args}>
        <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-pink-300 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
          <div className="glass-text-center glass-text-secondary">
            <div className="glass-text-6xl glass-mb-4">🌸</div>
            <h1 className="glass-text-4xl glass-font-bold glass-mb-4">Spring Blossoms</h1>
            <p className="glass-text-xl glass-text-secondary max-w-2xl">
              Celebrate the arrival of spring with floating petals and gentle breezes.
              Experience the rebirth of nature through delicate particle animations.
            </p>
            <div className="mt-8 glass-p-4 glass-surface-subtle/80 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/50 glass-contrast-guard">
              <p className="glass-text-sm glass-text-secondary">
                🌸 Floating flower petals with organic movement<br />
                🌬️ Gentle spring breezes affecting particles<br />
                🎨 Vibrant colors celebrating new life
              </p>
            </div>
          </div>
        </div>
      </SeasonalParticles>
    </div>
}`,...g.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    season: 'summer',
    particleCount: 30,
    windStrength: 1.2,
    animationSpeed: 1.5,
    autoSeason: false,
    showControls: true
  },
  render: args => <div className="glass-relative">
      <SeasonalParticles {...args}>
        <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-orange-400 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
          <div className="glass-text-center glass-text-primary">
            <div className="glass-text-6xl glass-mb-4">☀️</div>
            <h1 className="glass-text-4xl glass-font-bold glass-mb-4">Summer Rays</h1>
            <p className="glass-text-xl text-orange-100 max-w-2xl">
              Feel the warmth of summer with radiant sun rays and golden particles.
              Experience the energy and brightness of the summer season.
            </p>
            <div className="mt-8 glass-p-4 glass-surface-dark/20 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/30 glass-contrast-guard">
              <p className="glass-text-sm text-orange-100">
                ☀️ Radiant sun rays with pulsing light effects<br />
                🌟 Golden particles dancing in the summer breeze<br />
                🎨 Warm, vibrant colors evoking summer energy
              </p>
            </div>
          </div>
        </div>
      </SeasonalParticles>
    </div>
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    season: 'autumn',
    particleCount: 45,
    windStrength: 1.0,
    animationSpeed: 0.8,
    autoSeason: false,
    showControls: true
  },
  render: args => <div className="glass-relative">
      <SeasonalParticles {...args}>
        <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-red-600 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
          <div className="glass-text-center glass-text-primary">
            <div className="glass-text-6xl glass-mb-4">🍂</div>
            <h1 className="glass-text-4xl glass-font-bold glass-mb-4">Autumn Leaves</h1>
            <p className="glass-text-xl text-orange-100 max-w-2xl">
              Witness the beauty of fall with gently falling leaves and crisp autumn winds.
              Experience the changing colors and peaceful descent of autumn foliage.
            </p>
            <div className="mt-8 glass-p-4 glass-surface-dark/20 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/30 glass-contrast-guard">
              <p className="glass-text-sm text-orange-100">
                🍂 Falling autumn leaves with realistic physics<br />
                🌬️ Crisp winds carrying particles naturally<br />
                🎨 Rich, earthy colors of fall foliage
              </p>
            </div>
          </div>
        </div>
      </SeasonalParticles>
    </div>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    season: 'auto',
    particleCount: 35,
    windStrength: 0.7,
    animationSpeed: 1,
    autoSeason: true,
    seasonDuration: 8000,
    showControls: true
  },
  render: args => <div className="glass-relative">
      <SeasonalParticles {...args}>
        <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-blue-900 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
          <div className="glass-text-center glass-text-primary">
            <div className="glass-text-6xl glass-mb-4">🌈</div>
            <h1 className="glass-text-4xl glass-font-bold glass-mb-4">Seasonal Journey</h1>
            <p className="glass-text-xl text-purple-200 max-w-2xl">
              Embark on a journey through all four seasons automatically.
              Watch as the environment transforms with each seasonal change.
            </p>
            <div className="mt-8 glass-p-4 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard">
              <p className="glass-text-sm text-purple-200">
                🌈 Automatic seasonal progression every 8 seconds<br />
                🔄 Smooth transitions between different environments<br />
                🎭 Dynamic particle systems adapting to each season
              </p>
            </div>
            <div className="mt-4 glass-text-sm glass-text-secondary">
              Seasons cycle: Winter → Spring → Summer → Autumn → Repeat
            </div>
          </div>
        </div>
      </SeasonalParticles>
    </div>
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    season: 'winter',
    particleCount: 20,
    windStrength: 0.3,
    animationSpeed: 0.6,
    autoSeason: false,
    showControls: false
  },
  render: args => <div className="glass-relative">
      <SeasonalParticles {...args}>
        <div className="glass-min-glass-h-screen glass-surface-subtle glass-flex glass-items-center glass-justify-center glass-p-8">
          <div className="glass-text-center">
            <div className="glass-text-4xl glass-mb-4">❄️</div>
            <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-4">Minimal Winter</h1>
            <p className="glass-text-secondary max-w-xl">
              A subtle winter scene with gentle snowfall.
              Perfect for applications needing understated seasonal effects.
            </p>
          </div>
        </div>
      </SeasonalParticles>
    </div>
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    season: 'summer',
    particleCount: 80,
    windStrength: 1.5,
    animationSpeed: 2,
    autoSeason: false,
    showControls: true
  },
  render: args => <div className="glass-relative">
      <SeasonalParticles {...args}>
        <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-orange-400 glass-gradient-primary glass-flex glass-items-center glass-justify-center glass-p-8">
          <div className="glass-text-center glass-text-primary">
            <div className="glass-text-5xl glass-mb-4">☀️</div>
            <h1 className="glass-text-3xl glass-font-bold glass-mb-4">Intense Summer</h1>
            <p className="glass-text-xl text-yellow-100 max-w-2xl">
              Experience summer in full intensity with abundant sun rays and strong winds.
              Feel the heat and energy of the brightest season!
            </p>
          </div>
        </div>
      </SeasonalParticles>
    </div>
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    season: 'auto',
    particleCount: 25,
    windStrength: 0.6,
    animationSpeed: 0.8,
    autoSeason: true,
    seasonDuration: 12000,
    showControls: true
  },
  render: args => <div className="glass-relative">
      <SeasonalParticles {...args}>
        <div className="glass-min-glass-h-screen glass-p-8">
          <div className="max-w-6xl glass-mx-auto">
            <h1 className="glass-text-4xl glass-font-bold glass-text-primary glass-text-center mb-12">
              Seasonal Gallery
            </h1>

            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8">
              <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Winter ❄️</h3>
                <p className="glass-text-primary/80 glass-text-sm glass-mb-4">
                  Gentle snowfall with crystalline beauty and peaceful ambiance.
                  Perfect for creating a serene, magical atmosphere.
                </p>
                <div className="glass-text-xs glass-text-secondary">
                  • Realistic snow physics<br />
                  • Wind-affected drift<br />
                  • Icy blue aesthetics
                </div>
              </div>

              <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Spring 🌸</h3>
                <p className="glass-text-primary/80 glass-text-sm glass-mb-4">
                  Delicate flower petals dancing in the spring breeze.
                  Symbolizing renewal and the beauty of new beginnings.
                </p>
                <div className="glass-text-xs text-pink-300">
                  • Organic petal movement<br />
                  • Vibrant spring colors<br />
                  • Gentle floating animation
                </div>
              </div>

              <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Summer ☀️</h3>
                <p className="glass-text-primary/80 glass-text-sm glass-mb-4">
                  Radiant sun rays and golden particles filling the air.
                  Capturing the warmth and energy of bright summer days.
                </p>
                <div className="glass-text-xs glass-text-secondary">
                  • Pulsing light effects<br />
                  • Golden particle systems<br />
                  • Warm, vibrant energy
                </div>
              </div>

              <div className="glass-p-6 glass-surface-subtle/10 glass-glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-white/20 glass-contrast-guard">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Autumn 🍂</h3>
                <p className="glass-text-primary/80 glass-text-sm glass-mb-4">
                  Falling leaves in rich autumn colors with realistic physics.
                  Celebrating the beauty of change and transition.
                </p>
                <div className="glass-text-xs glass-text-secondary">
                  • Realistic leaf physics<br />
                  • Earthy autumn palette<br />
                  • Swirling wind effects
                </div>
              </div>
            </div>
          </div>
        </div>
      </SeasonalParticles>
    </div>
}`,...p.parameters?.docs?.source}}};const C=["Winter","Spring","Summer","Autumn","AutoSeason","MinimalWinter","IntenseSummer","SeasonalGallery"];export{d as AutoSeason,c as Autumn,u as IntenseSummer,m as MinimalWinter,p as SeasonalGallery,g as Spring,o as Summer,i as Winter,C as __namedExportsOrder,j as default};
