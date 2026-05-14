import{j as e}from"./iframe-CtRSFJTE.js";import{G as p}from"./GlassButton-DD-ftUX_.js";import{f as l}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-Y9gB2z_t.js";import"./LiquidGlassLayerProvider-BvezYu1G.js";import"./a11y-vcEGPYia.js";import"./GlassPredictiveEngine-CNJ6uPG_.js";import"./GlassAchievementSystem-b48HUKbq.js";import"./OptimizedGlassCore-gF2O5jvN.js";import"./deviceCapabilities-DvV84Xg1.js";import"./GlassBiometricAdaptation-B6aineW4.js";import"./MotionPreferenceContext-DqZUVy35.js";import"./GlassEyeTracking-BijQUaQZ.js";import"./GlassSpatialAudio-u9ax0mAo.js";import"./MotionFramer-BHAMyJdN.js";import"./utilsCore-DsYObD65.js";import"./index-ByImX2pa.js";function o({reactions:s=[],onReact:c,className:i}){const r=Array.isArray(s)?s:[];return e.jsx("div",{"data-glass-component":!0,className:i,children:e.jsx("div",{className:"glass-flex glass-gap-2",children:r.length===0?e.jsx("span",{className:"glass-text-sm glass-text-secondary",children:"No reactions yet."}):r.map(n=>e.jsxs(p,{variant:"ghost",size:"sm",onClick:()=>c?.(n.key),children:[e.jsx("span",{className:"glass-mr-1",children:n.label}),e.jsx("span",{className:"glass-text-primary-opacity-70",children:n.count})]},n.key))})})}try{o.displayName="GlassReactionBar",o.__docgenInfo={description:"",displayName:"GlassReactionBar",props:{reactions:{defaultValue:{value:"[]"},description:"",name:"reactions",required:!1,type:{name:"Reaction[]"}},onReact:{defaultValue:null,description:"",name:"onReact",required:!1,type:{name:"((key: string) => void) | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const w={title:"Effects + Advanced/Glass Reaction Bar",component:o,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassreactionbar component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"}},args:{className:""}},a={args:{reactions:[{key:"like",label:"👍",count:12},{key:"love",label:"❤️",count:8},{key:"laugh",label:"😂",count:5},{key:"wow",label:"😮",count:3},{key:"sad",label:"😢",count:1}],onReact:l()}},t={args:{reactions:[{key:"thumbs_up",label:"👍",count:42},{key:"heart",label:"❤️",count:38},{key:"fire",label:"🔥",count:27},{key:"clap",label:"👏",count:19},{key:"rocket",label:"🚀",count:15},{key:"thinking",label:"🤔",count:7},{key:"eyes",label:"👀",count:4}],onReact:l()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const S=["Default","PopularReactions"];export{a as Default,t as PopularReactions,S as __namedExportsOrder,w as default};
