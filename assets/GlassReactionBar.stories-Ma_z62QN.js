import{j as e}from"./iframe-DxUvObG1.js";import{G as p}from"./GlassButton-BKwl-q-g.js";import{f as l}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BaBnAiqB.js";import"./LiquidGlassMaterial-BTDbEReQ.js";import"./LiquidGlassLayerProvider-BQCQV5bZ.js";import"./a11y-vOvrykAi.js";import"./GlassPredictiveEngine-Db1qhY2e.js";import"./GlassAchievementSystem-Cgco6AOk.js";import"./OptimizedGlassCore-Ge4l3l3b.js";import"./deviceCapabilities-Ciz7WW1Y.js";import"./GlassBiometricAdaptation-jVd1d_Gs.js";import"./MotionPreferenceContext-CAU0EN1d.js";import"./GlassEyeTracking-C5efJHMa.js";import"./GlassSpatialAudio-DleknYpK.js";import"./MotionFramer-B6pu9S5n.js";import"./utilsCore-B6VxTi_O.js";import"./index-ByImX2pa.js";function o({reactions:s=[],onReact:c,className:i}){const r=Array.isArray(s)?s:[];return e.jsx("div",{"data-glass-component":!0,className:i,children:e.jsx("div",{className:"glass-flex glass-gap-2",children:r.length===0?e.jsx("span",{className:"glass-text-sm glass-text-secondary",children:"No reactions yet."}):r.map(n=>e.jsxs(p,{variant:"ghost",size:"sm",onClick:()=>c?.(n.key),children:[e.jsx("span",{className:"glass-mr-1",children:n.label}),e.jsx("span",{className:"glass-text-primary-opacity-70",children:n.count})]},n.key))})})}try{o.displayName="GlassReactionBar",o.__docgenInfo={description:"",displayName:"GlassReactionBar",props:{reactions:{defaultValue:{value:"[]"},description:"",name:"reactions",required:!1,type:{name:"Reaction[]"}},onReact:{defaultValue:null,description:"",name:"onReact",required:!1,type:{name:"((key: string) => void) | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const S={title:"Effects + Advanced/Glass Reaction Bar",component:o,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassreactionbar component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"}},args:{className:""}},a={args:{reactions:[{key:"like",label:"👍",count:12},{key:"love",label:"❤️",count:8},{key:"laugh",label:"😂",count:5},{key:"wow",label:"😮",count:3},{key:"sad",label:"😢",count:1}],onReact:l()}},t={args:{reactions:[{key:"thumbs_up",label:"👍",count:42},{key:"heart",label:"❤️",count:38},{key:"fire",label:"🔥",count:27},{key:"clap",label:"👏",count:19},{key:"rocket",label:"🚀",count:15},{key:"thinking",label:"🤔",count:7},{key:"eyes",label:"👀",count:4}],onReact:l()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    reactions: [{
      key: 'like',
      label: '👍',
      count: 12
    }, {
      key: 'love',
      label: '❤️',
      count: 8
    }, {
      key: 'laugh',
      label: '😂',
      count: 5
    }, {
      key: 'wow',
      label: '😮',
      count: 3
    }, {
      key: 'sad',
      label: '😢',
      count: 1
    }],
    onReact: fn()
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    reactions: [{
      key: 'thumbs_up',
      label: '👍',
      count: 42
    }, {
      key: 'heart',
      label: '❤️',
      count: 38
    }, {
      key: 'fire',
      label: '🔥',
      count: 27
    }, {
      key: 'clap',
      label: '👏',
      count: 19
    }, {
      key: 'rocket',
      label: '🚀',
      count: 15
    }, {
      key: 'thinking',
      label: '🤔',
      count: 7
    }, {
      key: 'eyes',
      label: '👀',
      count: 4
    }],
    onReact: fn()
  }
}`,...t.parameters?.docs?.source}}};const q=["Default","PopularReactions"];export{a as Default,t as PopularReactions,q as __namedExportsOrder,S as default};
