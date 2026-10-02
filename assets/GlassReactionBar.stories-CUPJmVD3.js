import{j as e}from"./iframe-DFMMcocb.js";import{G as p}from"./GlassButton-XgI0pEAb.js";import{f as r}from"./index-DdjpOZjl.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-D8CGevp8.js";import"./LiquidGlassLayerProvider-B-mIHSJM.js";import"./a11y-Q0mX7KvA.js";import"./GlassPredictiveEngine-D_3E50m3.js";import"./GlassAchievementSystem-BqTd0FRN.js";import"./OptimizedGlassCore-1D6AE-uZ.js";import"./deviceCapabilities-iDxBLJQX.js";import"./GlassBiometricAdaptation-CNYoTdw5.js";import"./MotionPreferenceContext-VYRcsRrk.js";import"./GlassEyeTracking-DFVitI9H.js";import"./GlassSpatialAudio-BRwfDyUV.js";import"./MotionFramer-Cvto7X39.js";import"./utilsCore-D5Hayjvj.js";import"./index-ByImX2pa.js";function l({reactions:a=[],onReact:c,className:i}){const o=Array.isArray(a)?a:[];return e.jsx("div",{"data-glass-component":!0,className:i,children:e.jsx("div",{className:"glass-flex glass-gap-2",children:o.length===0?e.jsx("span",{className:"glass-text-sm glass-text-secondary",children:"No reactions yet."}):o.map(s=>e.jsxs(p,{variant:"ghost",size:"sm",onClick:()=>c?.(s.key),children:[e.jsx("span",{className:"glass-mr-1",children:s.label}),e.jsx("span",{className:"glass-text-primary-opacity-70",children:s.count})]},s.key))})})}try{l.displayName="GlassReactionBar",l.__docgenInfo={description:"",displayName:"GlassReactionBar",props:{reactions:{defaultValue:{value:"[]"},description:"",name:"reactions",required:!1,type:{name:"Reaction[]"}},onReact:{defaultValue:null,description:"",name:"onReact",required:!1,type:{name:"((key: string) => void) | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const w={title:"Effects + Advanced/Glass Reaction Bar",component:l,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassreactionbar component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"}},args:{className:""}},n={render:a=>e.jsx("div",{className:"glass-neutral-level1 glass-rounded-3xl glass-p-6",children:e.jsx(l,{...a})}),args:{reactions:[{key:"like",label:"👍",count:12},{key:"love",label:"❤️",count:8},{key:"laugh",label:"😂",count:5},{key:"wow",label:"😮",count:3},{key:"sad",label:"😢",count:1}],className:"",onReact:r()}},t={args:{reactions:[{key:"thumbs_up",label:"👍",count:42},{key:"heart",label:"❤️",count:38},{key:"fire",label:"🔥",count:27},{key:"clap",label:"👏",count:19},{key:"rocket",label:"🚀",count:15},{key:"thinking",label:"🤔",count:7},{key:"eyes",label:"👀",count:4}],onReact:r()}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-neutral-level1 glass-rounded-3xl glass-p-6">
      <GlassReactionBar {...args} />
    </div>,
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
    className: '',
    onReact: fn()
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const S=["Default","PopularReactions"];export{n as Default,t as PopularReactions,S as __namedExportsOrder,w as default};
