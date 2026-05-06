import{j as s,r as v}from"./iframe-C2Py7iTP.js";import{f as u}from"./index-CLSxArU-.js";import{G as t,a as l,u as P,b as w}from"./GlassPredictiveEngine-ZsWyIufl.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";const M={title:"Advanced/Consciousness Interface/Predictive Engine",component:t,parameters:{layout:"fullscreen",docs:{description:{component:`
# Glass Predictive Engine

AI-powered system that learns user behavior patterns and anticipates interface needs using neural networks.

## Features
- **Neural Network Learning** - Uses artificial neural networks to analyze behavior patterns
- **Real-time Predictions** - Generates predictions with confidence scoring
- **Behavioral Analysis** - Tracks sequences, temporal patterns, spatial interactions, and context
- **Adaptive Insights** - Provides performance, usability, and engagement recommendations
- **Persistent Learning** - Saves and loads user patterns across sessions

## Usage
The Predictive Engine observes user interactions and builds behavioral models to predict future needs. It can preload content, suggest actions, optimize performance, and provide insights.

## AI Capabilities
- **Sequential Pattern Recognition** - Learns action sequences and predicts next steps
- **Temporal Pattern Analysis** - Identifies time-based usage patterns
- **Spatial Interaction Mapping** - Tracks screen region preferences
- **Contextual Adaptation** - Adapts based on device type, time of day, etc.
- **Neural Network Training** - Continuously improves predictions through feedback
        `}}},argTypes:{},args:{onPrediction:u(),onInsight:u()},tags:["autodocs"]};function g(){const[a,r]=v.useState(0),[I,A]=v.useState("balanced"),{predictions:m,insights:x,engine:E}=P(),{recordClick:y,recordHover:f,recordFocus:N}=w("demo-component"),p=e=>{r(b=>b+1);const h={currentTarget:document.createElement("div"),preventDefault:()=>{},stopPropagation:()=>{}},j={currentTarget:document.createElement("div"),preventDefault:()=>{},stopPropagation:()=>{}};e==="click"&&y(h),e==="hover"&&f(h),e==="focus"&&N(j)};return s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center glass-gap-4",children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-primary",children:"🧠 Glass Predictive Engine"}),s.jsx("p",{className:"glass-text-lg glass-text-secondary",children:"AI-powered system that learns your behavior and anticipates your needs"}),s.jsxs("div",{className:"glass-surface-secondary glass-radius-lg glass-p-4",children:[s.jsxs("div",{className:"glass-text-sm glass-text-primary glass-mb-2",children:["AI Learning Progress: ",a," interactions recorded"]}),s.jsx("div",{className:"glass-w-full glass-surface-primary glass-radius-sm glass-h-2 overflow-hidden",children:s.jsx("div",{className:"glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary transition-all duration-500",style:{width:`${Math.min(100,a*2)}%`}})})]})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6",children:[{id:"button-1",label:"Primary Action",color:"blue"},{id:"button-2",label:"Secondary Action",color:"purple"},{id:"button-3",label:"Tertiary Action",color:"green"}].map(e=>s.jsxs("div",{className:`glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 cursor-pointer
                      hover:glass-elev-3 transition-all duration-300 text-center glass-gap-4
                      bg-gradient-to-br from-${e.color}-500/10 to-${e.color}-600/10`,onClick:()=>p("click"),onMouseEnter:()=>p("hover"),onFocus:()=>p("focus"),tabIndex:0,children:[s.jsx("div",{className:"glass-text-2xl",children:"🎯"}),s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary",children:e.label}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Click to generate AI predictions"})]},e.id))}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 lg:glass-glass-grid-cols-2 glass-gap-6",children:[s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsxs("h3",{className:"glass-text-xl glass-font-medium glass-text-primary glass-mb-4",children:["🔮 AI Predictions (",m.length,")"]}),m.length>0?s.jsx("div",{className:"glass-gap-3",children:m.slice(0,5).map(e=>s.jsxs("div",{className:"glass-surface-secondary glass-radius-md glass-p-3",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-2",children:[s.jsxs("span",{className:"glass-text-sm glass-font-medium glass-text-primary glass-capitalize",children:[e.type,": ",e.target]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full",style:{backgroundColor:e.confidence>.8?"var(--glass-color-success)":e.confidence>.6?"var(--glass-color-warning)":"var(--glass-color-danger)"}}),s.jsxs("span",{className:"glass-text-xs glass-text-secondary",children:[(e.confidence*100).toFixed(0),"%"]})]})]}),s.jsxs("div",{className:"glass-text-xs glass-text-tertiary",children:["Timing: ",e.timing,"ms | Metadata: ",Object.keys(e.metadata).length," items"]})]},e.id))}):s.jsx("div",{className:"glass-text-center glass-text-sm glass-text-secondary glass-py-8",children:"Start interacting to see AI predictions appear..."})]}),s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsxs("h3",{className:"glass-text-xl glass-font-medium glass-text-primary glass-mb-4",children:["💡 AI Insights (",x.length,")"]}),x.length>0?s.jsx("div",{className:"glass-gap-3",children:x.slice(0,3).map(e=>s.jsxs("div",{className:"glass-surface-secondary glass-radius-md glass-p-3",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-2",children:[s.jsx("span",{className:"glass-text-sm glass-font-medium glass-text-primary glass-capitalize",children:e.category}),s.jsxs("span",{className:"glass-text-xs glass-text-secondary",children:["Impact: ",(e.impact*100).toFixed(0),"%"]})]}),s.jsx("div",{className:"glass-text-sm glass-text-primary glass-mb-1",children:e.insight}),s.jsxs("div",{className:"glass-text-xs glass-text-tertiary",children:["💡 ",e.recommendation]}),s.jsxs("div",{className:"glass-text-xs glass-text-quaternary glass-mt-1",children:["Confidence: ",(e.confidence*100).toFixed(0),"%"]})]},e.id))}):s.jsx("div",{className:"glass-text-center glass-text-sm glass-text-secondary glass-py-8",children:"AI insights will appear after sufficient interaction data..."})]})]}),s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-medium glass-text-primary glass-mb-4",children:"🧪 Neural Network Activity"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-3 glass-gap-4 glass-text-center",children:[s.jsxs("div",{className:"glass-gap-2",children:[s.jsx("div",{className:"glass-text-2xl",children:"📥"}),s.jsx("div",{className:"glass-text-sm glass-text-secondary",children:"Input Layer"}),s.jsx("div",{className:"glass-text-lg glass-font-medium glass-text-primary",children:a>10?"10 neurons":`${a} neurons`})]}),s.jsxs("div",{className:"glass-gap-2",children:[s.jsx("div",{className:"glass-text-2xl",children:"🔄"}),s.jsx("div",{className:"glass-text-sm glass-text-secondary",children:"Hidden Layer"}),s.jsx("div",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"20 neurons"})]}),s.jsxs("div",{className:"glass-gap-2",children:[s.jsx("div",{className:"glass-text-2xl",children:"📤"}),s.jsx("div",{className:"glass-text-sm glass-text-secondary",children:"Output Layer"}),s.jsx("div",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"5 predictions"})]})]}),s.jsx("div",{className:"glass-mt-4 glass-text-center",children:s.jsxs("div",{className:"glass-glass-inline-glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full animate-pulse"}),s.jsxs("span",{className:"glass-text-sm glass-text-primary",children:["Neural network ",a>5?"actively learning":"initializing"]})]})})]})]})}const i={render:a=>s.jsxs(t,{...a,children:[s.jsx(g,{}),s.jsx(l,{showInsights:!0,maxPredictions:5})]})},n={render:a=>s.jsxs(t,{...a,children:[s.jsxs("div",{className:"glass-p-8",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Conservative AI Mode"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mb-6",children:"High confidence threshold (80%), slower learning, 3 max predictions"}),s.jsx(g,{})]}),s.jsx(l,{showInsights:!0,maxPredictions:3})]}),parameters:{docs:{description:{story:"Conservative mode with high confidence thresholds and fewer predictions."}}}},c={render:a=>s.jsxs(t,{...a,children:[s.jsxs("div",{className:"glass-p-8",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Aggressive AI Mode"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mb-6",children:"Low confidence threshold (40%), fast learning, 10 max predictions"}),s.jsx(g,{})]}),s.jsx(l,{showInsights:!0,maxPredictions:10})]}),parameters:{docs:{description:{story:"Aggressive mode with low confidence thresholds and many predictions."}}}},o={render:a=>s.jsxs(t,{...a,children:[s.jsxs("div",{className:"glass-p-8",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Experimental AI Mode"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mb-6",children:"Ultra-low confidence threshold (30%), maximum predictions (15), advanced neural network"}),s.jsx(g,{})]}),s.jsx(l,{showInsights:!0,maxPredictions:15})]}),parameters:{docs:{description:{story:"Experimental mode with the most aggressive prediction settings for maximum AI responsiveness."}}}},d={render:()=>s.jsxs(t,{children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Prediction Indicator Demo"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mb-8",children:"The floating AI indicator shows when predictions are available. Click elements to generate predictions."}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4",children:Array.from({length:8},(a,r)=>s.jsxs("button",{className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-4 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard",onClick:()=>console.log(`Button ${r+1} clicked`),children:[s.jsx("div",{className:"glass-text-lg glass-mb-2",children:"🎯"}),s.jsxs("div",{className:"glass-text-sm glass-text-primary",children:["Action ",r+1]})]},r))})]}),s.jsx(l,{showInsights:!0,maxPredictions:5})]}),parameters:{docs:{description:{story:"Shows just the floating prediction indicator with interactive elements."}}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => <GlassPredictiveEngineProvider {...args}>
      <PredictiveEngineDemo />
      <GlassPredictionIndicator showInsights={true} maxPredictions={5} />
    </GlassPredictiveEngineProvider>
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <GlassPredictiveEngineProvider {...args}>
      <div className="glass-p-8">
        <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
          Conservative AI Mode
        </h2>
        <p className="glass-text-sm glass-text-secondary mb-6">
          High confidence threshold (80%), slower learning, 3 max predictions
        </p>
        <PredictiveEngineDemo />
      </div>
      <GlassPredictionIndicator showInsights={true} maxPredictions={3} />
    </GlassPredictiveEngineProvider>,
  parameters: {
    docs: {
      description: {
        story: 'Conservative mode with high confidence thresholds and fewer predictions.'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <GlassPredictiveEngineProvider {...args}>
      <div className="glass-p-8">
        <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
          Aggressive AI Mode
        </h2>
        <p className="glass-text-sm glass-text-secondary mb-6">
          Low confidence threshold (40%), fast learning, 10 max predictions
        </p>
        <PredictiveEngineDemo />
      </div>
      <GlassPredictionIndicator showInsights={true} maxPredictions={10} />
    </GlassPredictiveEngineProvider>,
  parameters: {
    docs: {
      description: {
        story: 'Aggressive mode with low confidence thresholds and many predictions.'
      }
    }
  }
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <GlassPredictiveEngineProvider {...args}>
      <div className="glass-p-8">
        <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
          Experimental AI Mode
        </h2>
        <p className="glass-text-sm glass-text-secondary mb-6">
          Ultra-low confidence threshold (30%), maximum predictions (15), advanced neural network
        </p>
        <PredictiveEngineDemo />
      </div>
      <GlassPredictionIndicator showInsights={true} maxPredictions={15} />
    </GlassPredictiveEngineProvider>,
  parameters: {
    docs: {
      description: {
        story: 'Experimental mode with the most aggressive prediction settings for maximum AI responsiveness.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <GlassPredictiveEngineProvider>
      <div className="glass-min-glass-h-screen glass-p-8">
        <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
          Prediction Indicator Demo
        </h2>
        <p className="glass-text-sm glass-text-secondary mb-8">
          The floating AI indicator shows when predictions are available. Click elements to generate predictions.
        </p>
        
        <div className="glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4">
          {Array.from({
          length: 8
        }, (_, i) => <button key={i} className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-4 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard" onClick={() => console.log(\`Button \${i + 1} clicked\`)}>
              <div className="glass-text-lg glass-mb-2">🎯</div>
              <div className="glass-text-sm glass-text-primary">Action {i + 1}</div>
            </button>)}
        </div>
      </div>
      <GlassPredictionIndicator showInsights={true} maxPredictions={5} />
    </GlassPredictiveEngineProvider>,
  parameters: {
    docs: {
      description: {
        story: 'Shows just the floating prediction indicator with interactive elements.'
      }
    }
  }
}`,...d.parameters?.docs?.source}}};const D=["Interactive","Conservative","Aggressive","Experimental","PredictionIndicatorOnly"];export{c as Aggressive,n as Conservative,o as Experimental,i as Interactive,d as PredictionIndicatorOnly,D as __namedExportsOrder,M as default};
