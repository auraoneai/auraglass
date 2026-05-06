import{j as s,r as l}from"./iframe-DpweptvF.js";import"./preload-helper-PPVm8Dsz.js";const m=e=>(console.log("Mock Galileo plugin created with config:",e),{id:"galileo-interaction",beforeInit:()=>console.log("Plugin beforeInit called"),afterInit:()=>console.log("Plugin afterInit called"),beforeUpdate:()=>console.log("Plugin beforeUpdate called"),afterUpdate:()=>console.log("Plugin afterUpdate called"),destroy:()=>console.log("Plugin destroy called"),config:{enabled:!0,magneticEffect:!0,rippleEffect:!0,glowEffect:!0,...e}}),k={title:"Components/Plugins/GalileoElementInteractionPlugin",parameters:{layout:"centered",docs:{description:{component:"A chart plugin that adds interactive effects like magnetic attraction, ripple effects, and glow to chart elements."}}},argTypes:{enabled:{control:"boolean",description:"Enable/disable the plugin",defaultValue:!0},magneticEffect:{control:"boolean",description:"Enable magnetic attraction effect on hover",defaultValue:!0},rippleEffect:{control:"boolean",description:"Enable ripple effect on click",defaultValue:!0},glowEffect:{control:"boolean",description:"Enable glow effect",defaultValue:!0}},args:{enabled:!0,magneticEffect:!0,rippleEffect:!0,glowEffect:!0,stiffness:.1,damping:.8,mass:1,scale:1.1,glowIntensity:.5,rippleSpeed:.6,rippleSize:2}},t={render:e=>{const n={enabled:e.enabled??!0,magneticEffect:e.magneticEffect??!0,rippleEffect:e.rippleEffect??!0,glowEffect:e.glowEffect??!0,physics:{stiffness:200,damping:15,mass:.8},visual:{scale:1.05,glowIntensity:.3,rippleSpeed:.6,rippleSize:2}};m(n);const g=({className:f,label:u,dotColor:b})=>{const i=l.useRef(null),[x,c]=l.useState({}),h=l.useCallback(o=>{const d=i.current;if(!d)return;const a=d.getBoundingClientRect(),y=o.clientX-a.left,N=o.clientY-a.top,p=Math.max(a.width,a.height)*.8;c({backgroundImage:`radial-gradient(${p}px ${p}px at ${y}px ${N}px, rgba(255,255,255,0.18), rgba(255,255,255,0.06) 45%, rgba(255,255,255,0) 60%)`})},[]),v=l.useCallback(()=>c({}),[]);return s.jsxs("div",{ref:i,onMouseMove:h,onMouseLeave:v,className:`chart-element relative overflow-hidden ${f}`,style:{transition:"transform 180ms ease, box-shadow 180ms ease"},children:[s.jsx("div",{className:"glass-absolute glass-inset-0 glass-pointer-events-none",style:{...x??{}}}),s.jsxs("div",{className:"glass-relative glass-text-center",children:[s.jsx("div",{className:"glass-w-8 glass-h-8 glass-radius-full glass-mx-auto glass-mb-2",style:{backgroundColor:b}}),s.jsx("p",{className:"glass-text-sm glass-font-medium",children:u})]})]})};return s.jsxs("div",{className:"glass-p-8 space-y-6",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-mb-2",children:"Galileo Element Interaction Plugin"}),s.jsx("p",{className:"glass-text-sm opacity-80 glass-mb-4",children:"Hover over and click the elements below to see the interactive effects."})]}),s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4 glass-justify-center",children:[s.jsx(g,{className:"glass-p-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-glass-glass-backdrop-blur-md glass-border glass-border-white/20 glass-radius-lg glass-cursor-pointer glass-contrast-guard",label:"Data Point 1",dotColor:"var(--glass-color-primary)"}),s.jsx(g,{className:"glass-p-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-glass-glass-backdrop-blur-md glass-border glass-border-white/20 glass-radius-lg glass-cursor-pointer glass-contrast-guard",label:"Data Point 2",dotColor:"var(--glass-color-success)"}),s.jsx(g,{className:"glass-p-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-glass-glass-backdrop-blur-md glass-border glass-border-white/20 glass-radius-lg glass-cursor-pointer glass-contrast-guard",label:"Data Point 3",dotColor:"#6366F1"})]}),s.jsxs("div",{className:"glass-surface-subtle/50 glass-glass-glass-backdrop-blur-md glass-border glass-border-white/10 glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-text-sm glass-font-semibold glass-mb-2",children:"Plugin Status:"}),s.jsx("p",{className:"glass-text-xs opacity-75",children:"Plugin created successfully with effects: Magnetic, Ripple, Glow"})]})]})},args:{enabled:!0,magneticEffect:!0,rippleEffect:!0,glowEffect:!0}},r={render:e=>{const n={enabled:e.enabled??!0,magneticEffect:!1,rippleEffect:!1,glowEffect:!1,physics:{stiffness:200,damping:15,mass:.8},visual:{scale:1.05,glowIntensity:.3,rippleSpeed:.6,rippleSize:2}};return m(n),s.jsxs("div",{className:"glass-p-8 space-y-6",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-mb-2",children:"Disabled Effects"}),s.jsx("p",{className:"glass-text-sm opacity-80 glass-mb-4",children:"All interactive effects are disabled. Elements won't respond to hover or click."})]}),s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4 glass-justify-center",children:s.jsx("div",{className:"chart-element glass-p-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-glass-glass-backdrop-blur-md glass-border glass-border-white/20 glass-radius-lg glass-cursor-pointer glass-contrast-guard",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-w-8 glass-h-8 glass-surface-red glass-radius-full glass-mx-auto glass-mb-2 glass-contrast-guard"}),s.jsx("p",{className:"glass-text-sm glass-font-medium",children:"No Effects"})]})})}),s.jsxs("div",{className:"glass-surface-subtle/50 glass-glass-glass-backdrop-blur-md glass-border glass-border-white/10 glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h4",{className:"glass-text-sm glass-font-semibold glass-mb-2",children:"Plugin Status:"}),s.jsx("p",{className:"glass-text-xs opacity-75",children:"Plugin created with all effects disabled"})]})]})},args:{enabled:!0,magneticEffect:!1,rippleEffect:!1,glowEffect:!1}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: (args: PluginArgs) => {
    // Create plugin instance with story args
    const config: Partial<GalileoInteractionConfig> = {
      enabled: args.enabled ?? true,
      magneticEffect: args.magneticEffect ?? true,
      rippleEffect: args.rippleEffect ?? true,
      glowEffect: args.glowEffect ?? true,
      physics: {
        stiffness: 200,
        damping: 15,
        mass: 0.8
      },
      visual: {
        scale: 1.05,
        glowIntensity: 0.3,
        rippleSpeed: 0.6,
        rippleSize: 2
      }
    };
    const plugin = createGalileoPlugin(config);

    // Simple hover lens card for demo elements
    const LensCard: React.FC<{
      className: string;
      label: string;
      dotColor: string;
    }> = ({
      className,
      label,
      dotColor
    }) => {
      const ref = useRef<HTMLDivElement | null>(null);
      const [style, setStyle] = useState<React.CSSProperties>({});
      const onMove = useCallback((e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const size = Math.max(r.width, r.height) * 0.8;
        setStyle({
          backgroundImage: \`radial-gradient(\${size}px \${size}px at \${x}px \${y}px, rgba(255,255,255,0.18), rgba(255,255,255,0.06) 45%, rgba(255,255,255,0) 60%)\`
          // Use createGlassStyle() instead, // Use createGlassStyle() instead,
        });
      }, []);
      const onLeave = useCallback(() => setStyle({}), []);
      return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={\`chart-element relative overflow-hidden \${className}\`} style={{
        transition: 'transform 180ms ease, box-shadow 180ms ease'
      }}>
          <div className="glass-absolute glass-inset-0 glass-pointer-events-none" style={{
          ...(style ?? {})
        }} />
          <div className="glass-relative glass-text-center">
            <div className="glass-w-8 glass-h-8 glass-radius-full glass-mx-auto glass-mb-2" style={{
            backgroundColor: dotColor
          }} />
            <p className="glass-text-sm glass-font-medium">{label}</p>
          </div>
        </div>;
    };
    return <div className="glass-p-8 space-y-6">
        <div className="glass-text-center">
          <h3 className="glass-text-xl glass-font-semibold glass-mb-2">Galileo Element Interaction Plugin</h3>
          <p className="glass-text-sm opacity-80 glass-mb-4">
            Hover over and click the elements below to see the interactive effects.
          </p>
        </div>

        <div className="glass-flex glass-flex-wrap glass-gap-4 glass-justify-center">
          <LensCard className="glass-p-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-glass-glass-backdrop-blur-md glass-border glass-border-white/20 glass-radius-lg glass-cursor-pointer glass-contrast-guard" label="Data Point 1" dotColor="var(--glass-color-primary)" />
          <LensCard className="glass-p-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-glass-glass-backdrop-blur-md glass-border glass-border-white/20 glass-radius-lg glass-cursor-pointer glass-contrast-guard" label="Data Point 2" dotColor="var(--glass-color-success)" />
          <LensCard className="glass-p-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-glass-glass-backdrop-blur-md glass-border glass-border-white/20 glass-radius-lg glass-cursor-pointer glass-contrast-guard" label="Data Point 3" dotColor="#6366F1" />
        </div>

        <div className="glass-surface-subtle/50 glass-glass-glass-backdrop-blur-md glass-border glass-border-white/10 glass-radius-lg glass-p-4 glass-contrast-guard">
          <h4 className="glass-text-sm glass-font-semibold glass-mb-2">Plugin Status:</h4>
          <p className="glass-text-xs opacity-75">
            Plugin created successfully with effects: Magnetic, Ripple, Glow
          </p>
        </div>
      </div>;
  },
  args: {
    enabled: true,
    magneticEffect: true,
    rippleEffect: true,
    glowEffect: true
  }
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: (args: PluginArgs) => {
    const config: Partial<GalileoInteractionConfig> = {
      enabled: args.enabled ?? true,
      magneticEffect: false,
      rippleEffect: false,
      glowEffect: false,
      physics: {
        stiffness: 200,
        damping: 15,
        mass: 0.8
      },
      visual: {
        scale: 1.05,
        glowIntensity: 0.3,
        rippleSpeed: 0.6,
        rippleSize: 2
      }
    };
    const plugin = createGalileoPlugin(config);
    return <div className="glass-p-8 space-y-6">
        <div className="glass-text-center">
          <h3 className="glass-text-xl glass-font-semibold glass-mb-2">Disabled Effects</h3>
          <p className="glass-text-sm opacity-80 glass-mb-4">
            All interactive effects are disabled. Elements won't respond to hover or click.
          </p>
        </div>

        <div className="glass-flex glass-flex-wrap glass-gap-4 glass-justify-center">
          <div className="chart-element glass-p-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-glass-glass-backdrop-blur-md glass-border glass-border-white/20 glass-radius-lg glass-cursor-pointer glass-contrast-guard">
            <div className="glass-text-center">
              <div className="glass-w-8 glass-h-8 glass-surface-red glass-radius-full glass-mx-auto glass-mb-2 glass-contrast-guard"></div>
              <p className="glass-text-sm glass-font-medium">No Effects</p>
            </div>
          </div>
        </div>

        <div className="glass-surface-subtle/50 glass-glass-glass-backdrop-blur-md glass-border glass-border-white/10 glass-radius-lg glass-p-4 glass-contrast-guard">
          <h4 className="glass-text-sm glass-font-semibold glass-mb-2">Plugin Status:</h4>
          <p className="glass-text-xs opacity-75">
            Plugin created with all effects disabled
          </p>
        </div>
      </div>;
  },
  args: {
    enabled: true,
    magneticEffect: false,
    rippleEffect: false,
    glowEffect: false
  }
}`,...r.parameters?.docs?.source}}};const j=["Default","DisabledEffects"];export{t as Default,r as DisabledEffects,j as __namedExportsOrder,k as default};
