import{r as c,g as L,j as s,f as G,b as k,m as _,d as I,C as h,c as p}from"./iframe-BEVTBSqr.js";import{u as H}from"./use-motion-value-jfgZoSOM.js";import{u as F}from"./use-spring-CtHc06QQ.js";import"./preload-helper-PPVm8Dsz.js";const $={opacity:{base:.1,hover:.15,active:.2},blur:{base:20,hover:15,active:10},brightness:{base:1,hover:1.1,active:1.2},tinting:{enabled:!0,intensity:.3,adaptiveColor:!0},texture:{type:"smooth",intensity:.5,animated:!1},environment:{weatherReactive:!0,timeReactive:!0,temperatureReactive:!0}},B=c.createContext(null),b=()=>{k();const t=c.useContext(B);if(!t)throw new Error("useGlassEngine must be used within GlassEngineProvider");return t},z=(t,a)=>{const e={smooth:`linear-gradient(135deg, rgba(255,255,255,${.1*a}), transparent)`,frosted:`
      radial-gradient(circle at 20% 30%, rgba(255,255,255,${.15*a}) 1px, transparent 1px),
      radial-gradient(circle at 70% 80%, rgba(255,255,255,${.1*a}) 1px, transparent 1px),
      linear-gradient(135deg, rgba(255,255,255,${.05*a}), transparent)
    `,rippled:`
      repeating-linear-gradient(
        45deg,
        rgba(255,255,255,${.08*a}),
        rgba(255,255,255,${.08*a}) 2px,
        transparent 2px,
        transparent 8px
      )
    `,crystalline:`
      conic-gradient(from 0deg at 50% 50%,
        rgba(255,255,255,${.2*a}) 0deg,
        transparent 60deg,
        rgba(255,255,255,${.1*a}) 120deg,
        transparent 180deg,
        rgba(255,255,255,${.15*a}) 240deg,
        transparent 300deg
      )
    `,liquid:`
      radial-gradient(ellipse at top, rgba(255,255,255,${.12*a}), transparent),
      radial-gradient(ellipse at bottom, rgba(255,255,255,${.08*a}), transparent)
    `};return e[t]||e.smooth},f=({children:t,initialConfig:a})=>{const[e,r]=c.useState({...$,...a}),i=c.useCallback(n=>{r(g=>({...g,...n,opacity:{...g.opacity,...n.opacity||{}},blur:{...g.blur,...n.blur||{}},brightness:{...g.brightness,...n.brightness||{}},tinting:{...g.tinting,...n.tinting||{}},texture:{...g.texture,...n.texture||{}},environment:{...g.environment,...n.environment||{}}}))},[]),d=c.useCallback((n="base",g)=>{const l=g?{...e,...g}:e,{opacity:m,blur:x,brightness:y,texture:P}=l;return m[n]||m.base,x[n]||x.base,y[n]||y.base,L({intent:"neutral",elevation:"level2"})},[e]),v=c.useCallback(n=>z(n,e.texture.intensity),[e.texture.intensity]),o=c.useCallback(n=>{r(g=>{if(!g.environment.weatherReactive&&!g.environment.timeReactive&&!g.environment.temperatureReactive)return g;let l={...g,opacity:{...g.opacity},blur:{...g.blur},brightness:{...g.brightness},texture:{...g.texture}};if(g.environment.weatherReactive)switch(n.weather){case"rainy":l.texture={...l.texture,type:"rippled",animated:!0},l.opacity.base=Math.min(.25,l.opacity.base+.05),l.blur.base=Math.max(10,l.blur.base-5);break;case"foggy":l.opacity.base=Math.max(.05,l.opacity.base-.03),l.blur.base=Math.min(30,l.blur.base+8);break;case"snowy":l.texture={...l.texture,type:"crystalline"},l.brightness.base=Math.min(1.3,l.brightness.base+.1);break;case"sunny":l.brightness.base=Math.min(1.4,l.brightness.base+.15),l.opacity.base=Math.min(.18,l.opacity.base+.02);break}if(g.environment.timeReactive){const m=n.timeOfDay;m>=20||m<=6?(l.opacity.base=Math.max(.05,l.opacity.base-.02),l.blur.base=Math.min(25,l.blur.base+3)):m>=12&&m<=16&&(l.brightness.base=Math.min(1.2,l.brightness.base+.05))}return g.environment.temperatureReactive&&(n.temperature<0?l.texture={...l.texture,type:"frosted"}:n.temperature>30&&(l.texture={...l.texture,type:"liquid",animated:!0})),l})},[]),u={config:e,updateConfig:i,createGlassStyle:d,getTexturePattern:v,adaptToEnvironment:o};return s.jsx(B.Provider,{value:u,children:t})},D=({children:t,variant:a="base",textureOverride:e,environmentalAware:r=!0,className:i="",as:d="div",...v})=>{const o=k(),{createGlassStyle:u,config:n,adaptToEnvironment:g}=b(),[l,m]=c.useState(a),x=c.useMemo(()=>{const y=e?{texture:{...n.texture,type:e}}:void 0;return u(l,y)},[u,l,e,n.texture]);return c.useEffect(()=>{if(r){const y={weather:"sunny",temperature:20,timeOfDay:new Date().getHours(),humidity:60,season:"spring"};g(y)}},[r,g]),s.jsx(_.div,{className:`relative ${i}`,style:{...x},onMouseEnter:()=>m("hover"),onMouseLeave:()=>m(a),onMouseDown:()=>m("active"),onMouseUp:()=>m("hover"),transition:o?{duration:0}:{duration:I.DURATION.fast/1e3},...v,children:t})},w=({children:t,dynamicOpacity:a=!0,opacityRange:e=[.05,.3],trigger:r="hover",className:i=""})=>{const{createGlassStyle:d,updateConfig:v}=b(),[o,u]=c.useState(e[0]);H(0);const n=F(o,{stiffness:300,damping:30});return c.useEffect(()=>{if(!a)return;let g;switch(r){case"time":g=setInterval(()=>{const m=new Date().getHours(),x=.1+(Math.sin(m/24*Math.PI*2)+1)*.1;u(Math.max(e[0],Math.min(e[1],x)))},I.DURATION.slower*85);break;case"scroll":const l=()=>{const m=window.scrollY/(document.body.scrollHeight-window.innerHeight),x=e[0]+m*(e[1]-e[0]);u(x)};return window.addEventListener("scroll",l),()=>window.removeEventListener("scroll",l)}return()=>{g&&clearInterval(g)}},[a,r,e]),s.jsx(_.div,{className:i,style:{...d("base"),backgroundColor:`rgba(var(--glass-color-white) / ${n})`},onMouseEnter:r==="hover"?()=>u(e[1]):void 0,onMouseLeave:r==="hover"?()=>u(e[0]):void 0,children:t})},S=({children:t,contentAware:a=!0,tintColor:e,intensity:r=.3,className:i=""})=>{const{createGlassStyle:d}=b(),[v,o]=c.useState(e||"var(--glass-bg-default)"),u=c.useRef(null),n=c.useCallback(()=>{if(!a||!u.current)return;if(u.current.querySelectorAll("img").length>0){const m=[G.semantic.primary,G.semantic.error,G.semantic.success,G.semantic.warning,G.semantic.primary],x=m[Math.floor(Math.random()*m.length)];if(x.startsWith("var("))o(`rgba(var(--glass-color-white) / var(--glass-opacity-${Math.round(r*100)}))`);else{const y=parseInt(x.slice(1,3),16),P=parseInt(x.slice(3,5),16),R=parseInt(x.slice(5,7),16);o(`rgba(${y}, ${P}, ${R}, ${r})`)}}},[a,r]);c.useEffect(()=>{a&&n()},[n,a]);const g=c.useMemo(()=>({...d("base"),backgroundColor:v}),[d,v]);return s.jsx("div",{ref:u,className:i,style:{...g},children:t})},N=({children:t,contentType:a="text",autoAdapt:e=!0,className:r=""})=>{const{createGlassStyle:i,updateConfig:d}=b(),[v,o]=c.useState("smooth");return c.useEffect(()=>{if(!e)return;const n={text:"smooth",image:"crystalline",video:"liquid",code:"frosted",data:"rippled"}[a];o(n),d({texture:{type:n,intensity:.6,animated:a==="video"}})},[a,e,d]),s.jsx("div",{className:r,style:{...i("base")},children:t})},j=({children:t,weatherAPI:a=!1,timeSync:e=!0,className:r=""})=>{const i=k(),{adaptToEnvironment:d,createGlassStyle:v}=b(),[o,u]=c.useState({weather:"sunny",temperature:20,timeOfDay:new Date().getHours(),humidity:50,season:"spring"});return c.useEffect(()=>{if(e){const n=()=>{u(l=>({...l,timeOfDay:new Date().getHours()}))};n();const g=setInterval(n,6e4);return()=>clearInterval(g)}},[e]),c.useEffect(()=>{if(a){const n={...o,weather:["sunny","cloudy","rainy"][Math.floor(Math.random()*3)],temperature:Math.random()*30+5,humidity:Math.random()*80+20};u(n)}},[a]),c.useEffect(()=>{d(o)},[o,d]),s.jsx(_.div,{className:r,style:{...v("base")},animate:{filter:`hue-rotate(${o.timeOfDay*15}deg) brightness(${1+(o.timeOfDay>12?(24-o.timeOfDay)/24:o.timeOfDay/24)*.2})`},transition:i?{duration:0}:{duration:I.DURATION.slower/1e3},children:t})},O=()=>{const{config:t,updateConfig:a,createGlassStyle:e}=b();return s.jsxs("div",{className:"glass-space-y-6 glass-p-6",children:[s.jsx("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4",children:["smooth","frosted","rippled","crystalline"].map(r=>s.jsx(D,{textureOverride:r,className:"glass-p-4 glass-text-center",children:s.jsxs(h,{children:[s.jsx("h3",{className:p("glass-text-primary glass-font-medium glass-capitalize glass-mb-2"),children:r}),s.jsx("p",{className:p("glass-text-secondary glass-text-sm"),children:"Glass texture variation"})]})},r))}),s.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-4",children:[s.jsx(w,{trigger:"hover",className:"glass-p-4","aria-label":"Dynamic opacity demonstration",children:s.jsxs(h,{children:[s.jsx("h3",{className:p("glass-text-primary glass-font-medium glass-mb-2"),children:"Dynamic Opacity"}),s.jsx("p",{className:p("glass-text-secondary glass-text-sm"),children:"Hover to see opacity change"})]})}),s.jsx(S,{contentAware:!0,className:"glass-p-4","aria-label":"Content-aware tinting demonstration",children:s.jsxs(h,{children:[s.jsx("h3",{className:p("glass-text-primary glass-font-medium glass-mb-2"),children:"Content-Aware Tinting"}),s.jsx("p",{className:p("glass-text-secondary glass-text-sm"),children:"Adapts to content colors"})]})}),s.jsx(j,{timeSync:!0,className:"glass-p-4","aria-label":"Environmental adaptation demonstration",children:s.jsxs(h,{children:[s.jsx("h3",{className:p("glass-text-primary glass-font-medium glass-mb-2"),children:"Environmental"}),s.jsx("p",{className:p("glass-text-secondary glass-text-sm"),children:"Reacts to time and weather"})]})})]}),s.jsxs("div",{className:"glass-p-4",style:{...e("base")},role:"region","aria-label":"Glass engine controls",children:[s.jsx(h,{children:s.jsx("h3",{className:p("glass-text-primary glass-font-medium glass-mb-4"),children:"Glass Engine Controls"})}),s.jsxs("div",{className:"glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4",children:[s.jsxs("div",{children:[s.jsx("label",{htmlFor:"base-opacity-slider",className:p("glass-display-block glass-text-secondary glass-text-sm glass-mb-2"),children:s.jsx(h,{children:"Base Opacity"})}),s.jsx("input",{id:"base-opacity-slider",type:"range",min:"0.05",max:"0.3",step:"0.01",value:t.opacity.base,onChange:r=>a({opacity:{...t.opacity,base:parseFloat(r.target.value)}}),className:"glass-w-full glass-focus glass-touch-target glass-contrast-guard","aria-label":"Base opacity slider","aria-valuemin":.05,"aria-valuemax":.3,"aria-valuenow":t.opacity.base})]}),s.jsxs("div",{children:[s.jsx("label",{htmlFor:"blur-intensity-slider",className:p("glass-display-block glass-text-secondary glass-text-sm glass-mb-2"),children:s.jsx(h,{children:"Blur Intensity"})}),s.jsx("input",{id:"blur-intensity-slider",type:"range",min:"5",max:"30",value:t.blur.base,onChange:r=>a({blur:{...t.blur,base:parseInt(r.target.value)}}),className:"glass-w-full glass-focus glass-touch-target glass-contrast-guard","aria-label":"Blur intensity slider","aria-valuemin":5,"aria-valuemax":30,"aria-valuenow":t.blur.base})]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mt-4",children:[s.jsx(h,{children:s.jsx("span",{className:p("glass-text-secondary"),children:"Environmental Reactions"})}),s.jsxs("label",{className:"glass-flex glass-items-center glass-space-x-2",children:[s.jsx("input",{type:"checkbox",checked:t.environment.weatherReactive,onChange:r=>a({environment:{...t.environment,weatherReactive:r.target.checked}}),className:"glass-focus glass-touch-target glass-contrast-guard","aria-label":"Enable weather reactive effects"}),s.jsx(h,{children:s.jsx("span",{className:p("glass-text-primary glass-text-sm"),children:"Weather"})})]})]})]})]})},V=({initialConfig:t,renderDemo:a=!0,children:e,className:r,...i})=>s.jsx(f,{initialConfig:t,children:s.jsx("div",{className:p("glass-engine-wrapper glass-space-y-6",r),role:"main","aria-label":"Glass engine",...i,children:e??(a?s.jsx(O,{}):null)})});try{f.displayName="GlassEngineProvider",f.__docgenInfo={description:"",displayName:"GlassEngineProvider",props:{initialConfig:{defaultValue:null,description:"",name:"initialConfig",required:!1,type:{name:"Partial<GlassEngineConfig> | undefined"}}}}}catch{}try{D.displayName="AdaptiveGlass",D.__docgenInfo={description:"",displayName:"AdaptiveGlass",props:{variant:{defaultValue:{value:"base"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"base"'},{value:'"active"'},{value:'"hover"'}]}},textureOverride:{defaultValue:null,description:"",name:"textureOverride",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"liquid"'},{value:'"smooth"'},{value:'"frosted"'},{value:'"rippled"'},{value:'"crystalline"'}]}},environmentalAware:{defaultValue:{value:"true"},description:"",name:"environmentalAware",required:!1,type:{name:"boolean | undefined"}},as:{defaultValue:{value:"div"},description:"",name:"as",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"symbol"'},{value:'"object"'},{value:'"material"'},{value:'"slot"'},{value:'"style"'},{value:'"title"'},{value:'"color"'},{value:'"a"'},{value:'"abbr"'},{value:'"address"'},{value:'"area"'},{value:'"article"'},{value:'"aside"'},{value:'"audio"'},{value:'"b"'},{value:'"base"'},{value:'"bdi"'},{value:'"bdo"'},{value:'"blockquote"'},{value:'"body"'},{value:'"br"'},{value:'"button"'},{value:'"canvas"'},{value:'"caption"'},{value:'"cite"'},{value:'"code"'},{value:'"col"'},{value:'"colgroup"'},{value:'"data"'},{value:'"datalist"'},{value:'"dd"'},{value:'"del"'},{value:'"details"'},{value:'"dfn"'},{value:'"dialog"'},{value:'"div"'},{value:'"dl"'},{value:'"dt"'},{value:'"em"'},{value:'"embed"'},{value:'"fieldset"'},{value:'"figcaption"'},{value:'"figure"'},{value:'"footer"'},{value:'"form"'},{value:'"h1"'},{value:'"h2"'},{value:'"h3"'},{value:'"h4"'},{value:'"h5"'},{value:'"h6"'},{value:'"head"'},{value:'"header"'},{value:'"hgroup"'},{value:'"hr"'},{value:'"html"'},{value:'"i"'},{value:'"iframe"'},{value:'"img"'},{value:'"input"'},{value:'"ins"'},{value:'"kbd"'},{value:'"label"'},{value:'"legend"'},{value:'"li"'},{value:'"link"'},{value:'"main"'},{value:'"map"'},{value:'"mark"'},{value:'"menu"'},{value:'"meta"'},{value:'"meter"'},{value:'"nav"'},{value:'"noscript"'},{value:'"ol"'},{value:'"optgroup"'},{value:'"option"'},{value:'"output"'},{value:'"p"'},{value:'"picture"'},{value:'"pre"'},{value:'"progress"'},{value:'"q"'},{value:'"rp"'},{value:'"rt"'},{value:'"ruby"'},{value:'"s"'},{value:'"samp"'},{value:'"script"'},{value:'"search"'},{value:'"section"'},{value:'"select"'},{value:'"small"'},{value:'"source"'},{value:'"span"'},{value:'"strong"'},{value:'"sub"'},{value:'"summary"'},{value:'"sup"'},{value:'"table"'},{value:'"tbody"'},{value:'"td"'},{value:'"template"'},{value:'"textarea"'},{value:'"tfoot"'},{value:'"th"'},{value:'"thead"'},{value:'"time"'},{value:'"tr"'},{value:'"track"'},{value:'"u"'},{value:'"ul"'},{value:'"var"'},{value:'"video"'},{value:'"wbr"'},{value:'"big"'},{value:'"center"'},{value:'"keygen"'},{value:'"menuitem"'},{value:'"param"'},{value:'"webview"'},{value:'"light"'},{value:'"text"'},{value:'"circle"'},{value:'"clipPath"'},{value:'"filter"'},{value:'"mask"'},{value:'"marker"'},{value:'"group"'},{value:'"switch"'},{value:'"noindex"'},{value:'"svg"'},{value:'"animate"'},{value:'"animateMotion"'},{value:'"animateTransform"'},{value:'"defs"'},{value:'"desc"'},{value:'"ellipse"'},{value:'"feBlend"'},{value:'"feColorMatrix"'},{value:'"feComponentTransfer"'},{value:'"feComposite"'},{value:'"feConvolveMatrix"'},{value:'"feDiffuseLighting"'},{value:'"feDisplacementMap"'},{value:'"feDistantLight"'},{value:'"feDropShadow"'},{value:'"feFlood"'},{value:'"feFuncA"'},{value:'"feFuncB"'},{value:'"feFuncG"'},{value:'"feFuncR"'},{value:'"feGaussianBlur"'},{value:'"feImage"'},{value:'"feMerge"'},{value:'"feMergeNode"'},{value:'"feMorphology"'},{value:'"feOffset"'},{value:'"fePointLight"'},{value:'"feSpecularLighting"'},{value:'"feSpotLight"'},{value:'"feTile"'},{value:'"feTurbulence"'},{value:'"foreignObject"'},{value:'"g"'},{value:'"image"'},{value:'"line"'},{value:'"linearGradient"'},{value:'"metadata"'},{value:'"mpath"'},{value:'"path"'},{value:'"pattern"'},{value:'"polygon"'},{value:'"polyline"'},{value:'"radialGradient"'},{value:'"rect"'},{value:'"set"'},{value:'"stop"'},{value:'"textPath"'},{value:'"tspan"'},{value:'"use"'},{value:'"view"'},{value:'"renamedTextGeometry"'},{value:'"effectComposer"'},{value:'"renderPass"'},{value:'"shaderPass"'},{value:'"imageMaterial"'},{value:'"splatMaterial"'},{value:'"gridMaterial"'},{value:'"positionMesh"'},{value:'"distortMaterialImpl"'},{value:'"wobbleMaterialImpl"'},{value:'"meshReflectorMaterialImpl"'},{value:'"meshRefractionMaterial"'},{value:'"meshTransmissionMaterial"'},{value:'"discardMaterialImpl"'},{value:'"pointMaterialImpl"'},{value:'"groundProjectedEnvImpl"'},{value:'"softShadowMaterial"'},{value:'"causticsProjectionMaterial"'},{value:'"meshReflectorMaterial"'},{value:'"starfieldMaterial"'},{value:'"cloudMaterial"'},{value:'"sparklesImplMaterial"'},{value:'"meshWireframeMaterial"'},{value:'"positionPoint"'},{value:'"segmentObject"'},{value:'"portalMaterialImpl"'},{value:'"object3D"'},{value:'"audioListener"'},{value:'"positionalAudio"'},{value:'"mesh"'},{value:'"batchedMesh"'},{value:'"instancedMesh"'},{value:'"scene"'},{value:'"sprite"'},{value:'"lOD"'},{value:'"skinnedMesh"'},{value:'"skeleton"'},{value:'"bone"'},{value:'"lineSegments"'},{value:'"lineLoop"'},{value:'"points"'},{value:'"camera"'},{value:'"perspectiveCamera"'},{value:'"orthographicCamera"'},{value:'"cubeCamera"'},{value:'"arrayCamera"'},{value:'"instancedBufferGeometry"'},{value:'"bufferGeometry"'},{value:'"boxBufferGeometry"'},{value:'"circleBufferGeometry"'},{value:'"coneBufferGeometry"'},{value:'"cylinderBufferGeometry"'},{value:'"dodecahedronBufferGeometry"'},{value:'"extrudeBufferGeometry"'},{value:'"icosahedronBufferGeometry"'},{value:'"latheBufferGeometry"'},{value:'"octahedronBufferGeometry"'},{value:'"planeBufferGeometry"'},{value:'"polyhedronBufferGeometry"'},{value:'"ringBufferGeometry"'},{value:'"shapeBufferGeometry"'},{value:'"sphereBufferGeometry"'},{value:'"tetrahedronBufferGeometry"'},{value:'"torusBufferGeometry"'},{value:'"torusKnotBufferGeometry"'},{value:'"tubeBufferGeometry"'},{value:'"wireframeGeometry"'},{value:'"tetrahedronGeometry"'},{value:'"octahedronGeometry"'},{value:'"icosahedronGeometry"'},{value:'"dodecahedronGeometry"'},{value:'"polyhedronGeometry"'},{value:'"tubeGeometry"'},{value:'"torusKnotGeometry"'},{value:'"torusGeometry"'},{value:'"sphereGeometry"'},{value:'"ringGeometry"'},{value:'"planeGeometry"'},{value:'"latheGeometry"'},{value:'"shapeGeometry"'},{value:'"extrudeGeometry"'},{value:'"edgesGeometry"'},{value:'"coneGeometry"'},{value:'"cylinderGeometry"'},{value:'"circleGeometry"'},{value:'"boxGeometry"'},{value:'"capsuleGeometry"'},{value:'"shadowMaterial"'},{value:'"spriteMaterial"'},{value:'"rawShaderMaterial"'},{value:'"shaderMaterial"'},{value:'"pointsMaterial"'},{value:'"meshPhysicalMaterial"'},{value:'"meshStandardMaterial"'},{value:'"meshPhongMaterial"'},{value:'"meshToonMaterial"'},{value:'"meshNormalMaterial"'},{value:'"meshLambertMaterial"'},{value:'"meshDepthMaterial"'},{value:'"meshDistanceMaterial"'},{value:'"meshBasicMaterial"'},{value:'"meshMatcapMaterial"'},{value:'"lineDashedMaterial"'},{value:'"lineBasicMaterial"'},{value:'"primitive"'},{value:'"spotLightShadow"'},{value:'"spotLight"'},{value:'"pointLight"'},{value:'"rectAreaLight"'},{value:'"hemisphereLight"'},{value:'"directionalLightShadow"'},{value:'"directionalLight"'},{value:'"ambientLight"'},{value:'"lightShadow"'},{value:'"ambientLightProbe"'},{value:'"hemisphereLightProbe"'},{value:'"lightProbe"'},{value:'"spotLightHelper"'},{value:'"skeletonHelper"'},{value:'"pointLightHelper"'},{value:'"hemisphereLightHelper"'},{value:'"gridHelper"'},{value:'"polarGridHelper"'},{value:'"directionalLightHelper"'},{value:'"cameraHelper"'},{value:'"boxHelper"'},{value:'"box3Helper"'},{value:'"planeHelper"'},{value:'"arrowHelper"'},{value:'"axesHelper"'},{value:'"texture"'},{value:'"videoTexture"'},{value:'"dataTexture"'},{value:'"dataTexture3D"'},{value:'"compressedTexture"'},{value:'"cubeTexture"'},{value:'"canvasTexture"'},{value:'"depthTexture"'},{value:'"raycaster"'},{value:'"vector2"'},{value:'"vector3"'},{value:'"vector4"'},{value:'"euler"'},{value:'"matrix3"'},{value:'"matrix4"'},{value:'"quaternion"'},{value:'"bufferAttribute"'},{value:'"float16BufferAttribute"'},{value:'"float32BufferAttribute"'},{value:'"float64BufferAttribute"'},{value:'"int8BufferAttribute"'},{value:'"int16BufferAttribute"'},{value:'"int32BufferAttribute"'},{value:'"uint8BufferAttribute"'},{value:'"uint16BufferAttribute"'},{value:'"uint32BufferAttribute"'},{value:'"instancedBufferAttribute"'},{value:'"fog"'},{value:'"fogExp2"'},{value:'"shape"'}]}}}}}catch{}try{w.displayName="GlassOpacityEngine",w.__docgenInfo={description:"",displayName:"GlassOpacityEngine",props:{dynamicOpacity:{defaultValue:{value:"true"},description:"",name:"dynamicOpacity",required:!1,type:{name:"boolean | undefined"}},opacityRange:{defaultValue:{value:"[0.05, 0.3]"},description:"",name:"opacityRange",required:!1,type:{name:"[number, number] | undefined"}},trigger:{defaultValue:{value:"hover"},description:"",name:"trigger",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"content"'},{value:'"time"'},{value:'"scroll"'},{value:'"hover"'}]}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{S.displayName="GlassColorTinting",S.__docgenInfo={description:"",displayName:"GlassColorTinting",props:{contentAware:{defaultValue:{value:"true"},description:"",name:"contentAware",required:!1,type:{name:"boolean | undefined"}},tintColor:{defaultValue:null,description:"",name:"tintColor",required:!1,type:{name:"string | undefined"}},intensity:{defaultValue:{value:"0.3"},description:"",name:"intensity",required:!1,type:{name:"number | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{N.displayName="GlassTextureVariations",N.__docgenInfo={description:"",displayName:"GlassTextureVariations",props:{contentType:{defaultValue:{value:"text"},description:"",name:"contentType",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"code"'},{value:'"data"'},{value:'"video"'},{value:'"text"'},{value:'"image"'}]}},autoAdapt:{defaultValue:{value:"true"},description:"",name:"autoAdapt",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{j.displayName="EnvironmentalGlass",j.__docgenInfo={description:"",displayName:"EnvironmentalGlass",props:{weatherAPI:{defaultValue:{value:"false"},description:"",name:"weatherAPI",required:!1,type:{name:"boolean | undefined"}},timeSync:{defaultValue:{value:"true"},description:"",name:"timeSync",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{O.displayName="GlassEngineDemo",O.__docgenInfo={description:"",displayName:"GlassEngineDemo",props:{}}}catch{}try{V.displayName="GlassEngine",V.__docgenInfo={description:"",displayName:"GlassEngine",props:{initialConfig:{defaultValue:null,description:"",name:"initialConfig",required:!1,type:{name:"Partial<GlassEngineConfig> | undefined"}},renderDemo:{defaultValue:{value:"true"},description:"",name:"renderDemo",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const J={title:"Advanced/GlassEngine",component:f,parameters:{docs:{description:{component:"Advanced glass configuration system with environmental adaptation, texture generation, and dynamic glass property management."}},layout:"fullscreen"},tags:["autodocs"]},U=()=>{const{createGlassStyle:t}=b(),[a,e]=c.useState("smooth"),r=[{name:"smooth",description:"Clean, minimal texture for text-heavy content"},{name:"frosted",description:"Subtle frost-like texture for modern interfaces"},{name:"rippled",description:"Water-like ripple effects for dynamic content"},{name:"crystalline",description:"Crystal-like facets perfect for image galleries"},{name:"liquid",description:"Fluid, organic texture for video content"}];return s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"Glass Texture Variations"}),s.jsx("p",{className:"glass-text-primary/80",children:"Five distinct glass textures for different content types"})]}),s.jsx("div",{className:"glass-flex glass-flex-wrap glass-justify-center glass-gap-3 mb-8",children:r.map(i=>s.jsx("button",{onClick:()=>e(i.name),className:`px-4 py-2 rounded-lg font-medium transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard ${a===i.name?"bg-white/20 text-white shadow-lg":"bg-white/10 text-white/80 hover:bg-white/15"}`,children:i.name.charAt(0).toUpperCase()+i.name.slice(1)},i.name))}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-6",children:r.map(i=>s.jsxs("div",{className:"glass-text-center",children:[s.jsxs("div",{className:`p-6 rounded-2xl mb-4 transition-all duration-300 ${a===i.name?"scale-105":""}`,style:t("base",{texture:{type:i.name,intensity:.6,animated:!1}}),children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2 glass-capitalize",children:i.name}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:i.description})]}),s.jsx("div",{className:"glass-text-primary/60 glass-text-xs",children:a===i.name?"Active":"Click to preview"})]},i.name))})]})},q=()=>{const{adaptToEnvironment:t}=b(),[a,e]=c.useState({weather:"sunny",temperature:20,timeOfDay:12,season:"spring"}),r=()=>{t({weather:a.weather,temperature:a.temperature,timeOfDay:a.timeOfDay,humidity:60,season:a.season})};return s.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Environmental Controls"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6",children:[s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-primary/80 glass-text-sm glass-mb-2",children:"Weather"}),s.jsxs("select",{value:a.weather,onChange:i=>e(d=>({...d,weather:i.target.value})),className:"glass-w-full glass-px-3 glass-py-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary glass-focus glass-touch-target glass-contrast-guard",children:[s.jsx("option",{value:"sunny",children:"Sunny"}),s.jsx("option",{value:"cloudy",children:"Cloudy"}),s.jsx("option",{value:"rainy",children:"Rainy"}),s.jsx("option",{value:"snowy",children:"Snowy"}),s.jsx("option",{value:"foggy",children:"Foggy"})]})]}),s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-primary/80 glass-text-sm glass-mb-2",children:"Temperature (°C)"}),s.jsx("input",{type:"range",min:"-10",max:"40",value:a.temperature,onChange:i=>e(d=>({...d,temperature:parseInt(i.target.value)})),className:"glass-w-full glass-focus glass-touch-target glass-contrast-guard"}),s.jsxs("div",{className:"glass-text-primary/60 glass-text-sm mt-1",children:[a.temperature,"°C"]})]}),s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-primary/80 glass-text-sm glass-mb-2",children:"Time of Day"}),s.jsx("input",{type:"range",min:"0",max:"23",value:a.timeOfDay,onChange:i=>e(d=>({...d,timeOfDay:parseInt(i.target.value)})),className:"glass-w-full glass-focus glass-touch-target glass-contrast-guard"}),s.jsxs("div",{className:"glass-text-primary/60 glass-text-sm mt-1",children:[a.timeOfDay,":00"]})]}),s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-primary/80 glass-text-sm glass-mb-2",children:"Season"}),s.jsxs("select",{value:a.season,onChange:i=>e(d=>({...d,season:i.target.value})),className:"glass-w-full glass-px-3 glass-py-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary glass-focus glass-touch-target glass-contrast-guard",children:[s.jsx("option",{value:"spring",children:"Spring"}),s.jsx("option",{value:"summer",children:"Summer"}),s.jsx("option",{value:"autumn",children:"Autumn"}),s.jsx("option",{value:"winter",children:"Winter"})]})]})]}),s.jsx("button",{onClick:r,className:"mt-6 glass-w-full glass-px-6 glass-py-3 glass-surface-subtle/20 hover:glass-surface-subtle/30 glass-text-primary glass-radius-lg glass-font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"Adapt to Environment"})]})},C={args:{},render:()=>s.jsx(f,{children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[s.jsxs("div",{className:"glass-text-center mb-12",children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-primary glass-mb-4",children:"🔧 Glass Engine Interactive Demo"}),s.jsx("p",{className:"glass-text-xl glass-text-primary/80",children:"Advanced glass configuration with environmental adaptation"})]}),s.jsx("div",{className:"mb-12",children:s.jsx(O,{})}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 lg:glass-glass-grid-cols-2 glass-gap-8",children:[s.jsx(q,{}),s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Engine Features"}),s.jsxs("div",{className:"glass-space-y-3 glass-text-primary/80",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"Dynamic glass configuration"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"Environmental adaptation"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"5 texture variations"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"Content-aware tinting"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"Performance optimized"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-radius-full glass-surface-green"}),s.jsx("span",{children:"Real-time adjustments"})]})]})]}),s.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Usage Examples"}),s.jsxs("div",{className:"glass-space-y-3 glass-text-primary/80 glass-text-sm",children:[s.jsx("div",{className:"glass-p-3 glass-surface-subtle/5 glass-radius-lg font-mono",children:'<AdaptiveGlass variant="hover">Content</AdaptiveGlass>'}),s.jsx("div",{className:"glass-p-3 glass-surface-subtle/5 glass-radius-lg font-mono",children:'<GlassOpacityEngine trigger="scroll">Content</GlassOpacityEngine>'}),s.jsx("div",{className:"glass-p-3 glass-surface-subtle/5 glass-radius-lg font-mono",children:"<EnvironmentalGlass timeSync={true}>Content</EnvironmentalGlass>"})]})]})]})]})]})})})},E={args:{},render:()=>s.jsx(f,{children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[s.jsx(U,{}),s.jsxs("div",{className:"mt-12 glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8",children:[s.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Texture Applications"}),s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/5 glass-radius-lg",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Smooth - Text Content"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Perfect for reading interfaces and documentation"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/5 glass-radius-lg",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Frosted - Modern UI"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Contemporary interfaces with subtle texture"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/5 glass-radius-lg",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Rippled - Interactive"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Dynamic content with movement and flow"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/5 glass-radius-lg",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Crystalline - Visual"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Image galleries and visual showcases"})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/5 glass-radius-lg",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Liquid - Media"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Video players and rich media content"})]})]})]}),s.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Performance Characteristics"}),s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{className:"glass-flex glass-justify-between glass-items-center glass-p-3 glass-surface-green/10 glass-radius-lg",children:[s.jsx("span",{className:"glass-text-primary/80",children:"Smooth"}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-20 glass-h-2 glass-surface-subtle/20 glass-radius-full",children:s.jsx("div",{className:"glass-w-16 glass-h-2 glass-surface-green glass-radius-full"})}),s.jsx("span",{className:"glass-text-primary glass-text-sm",children:"Low"})]})]}),s.jsxs("div",{className:"glass-flex glass-justify-between glass-items-center glass-p-3 glass-surface-yellow/10 glass-radius-lg",children:[s.jsx("span",{className:"glass-text-primary/80",children:"Frosted"}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-20 glass-h-2 glass-surface-subtle/20 glass-radius-full",children:s.jsx("div",{className:"glass-w-12 glass-h-2 glass-surface-yellow glass-radius-full"})}),s.jsx("span",{className:"glass-text-primary glass-text-sm",children:"Medium"})]})]}),s.jsxs("div",{className:"glass-flex glass-justify-between glass-items-center glass-p-3 glass-surface-primary/10 glass-radius-lg",children:[s.jsx("span",{className:"glass-text-primary/80",children:"Rippled"}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-20 glass-h-2 glass-surface-subtle/20 glass-radius-full",children:s.jsx("div",{className:"w-14 glass-h-2 glass-surface-primary glass-radius-full"})}),s.jsx("span",{className:"glass-text-primary glass-text-sm",children:"Medium"})]})]}),s.jsxs("div",{className:"glass-flex glass-justify-between glass-items-center glass-p-3 glass-surface-red/10 glass-radius-lg",children:[s.jsx("span",{className:"glass-text-primary/80",children:"Crystalline"}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-20 glass-h-2 glass-surface-subtle/20 glass-radius-full",children:s.jsx("div",{className:"w-18 glass-h-2 glass-surface-red glass-radius-full"})}),s.jsx("span",{className:"glass-text-primary glass-text-sm",children:"High"})]})]}),s.jsxs("div",{className:"glass-flex glass-justify-between glass-items-center glass-p-3 glass-surface-red/10 glass-radius-lg",children:[s.jsx("span",{className:"glass-text-primary/80",children:"Liquid"}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-20 glass-h-2 glass-surface-subtle/20 glass-radius-full",children:s.jsx("div",{className:"w-18 glass-h-2 glass-surface-red glass-radius-full"})}),s.jsx("span",{className:"glass-text-primary glass-text-sm",children:"High"})]})]})]})]})]})]})})})},A={args:{},render:()=>s.jsx(f,{children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[s.jsxs("div",{className:"glass-text-center mb-12",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"🌍 Environmental Glass Adaptation"}),s.jsx("p",{className:"glass-text-xl glass-text-primary/80",children:"Glass effects that respond to weather, time, temperature, and seasons"})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 lg:glass-glass-grid-cols-2 glass-gap-8 mb-12",children:[s.jsx(q,{}),s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Weather Adaptations"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{className:"glass-p-3 glass-surface-blue/10 glass-radius-lg",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-1",children:"Sunny"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Increased brightness and contrast"})]}),s.jsxs("div",{className:"glass-p-3 glass-surface-primary/10 glass-radius-lg",children:[s.jsx("h4",{className:"glass-font-medium glass-text-secondary glass-mb-1",children:"Cloudy"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Moderate adjustments"})]}),s.jsxs("div",{className:"glass-p-3 glass-surface-blue/10 glass-radius-lg",children:[s.jsx("h4",{className:"glass-font-medium glass-text-secondary glass-mb-1",children:"Rainy"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Ripple texture activation"})]}),s.jsxs("div",{className:"glass-p-3 glass-surface-subtle/10 glass-radius-lg",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-1",children:"Snowy"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Crystalline texture with brightness"})]}),s.jsxs("div",{className:"glass-p-3 glass-surface-primary/10 glass-radius-lg",children:[s.jsx("h4",{className:"glass-font-medium text-gray-300 glass-mb-1",children:"Foggy"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Reduced opacity and increased blur"})]})]})]}),s.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-4",children:"Time-Based Effects"}),s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("div",{className:"glass-p-3 glass-surface-primary/10 glass-radius-lg",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-1",children:"Dawn (5-9 AM)"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Warm amber tones"})]}),s.jsxs("div",{className:"glass-p-3 glass-surface-blue/10 glass-radius-lg",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-1",children:"Day (9-5 PM)"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Bright blue accents"})]}),s.jsxs("div",{className:"glass-p-3 glass-surface-primary/10 glass-radius-lg",children:[s.jsx("h4",{className:"glass-font-medium glass-text-secondary glass-mb-1",children:"Evening (5-8 PM)"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Orange transitions"})]}),s.jsxs("div",{className:"glass-p-3 bg-indigo-500/10 glass-radius-lg",children:[s.jsx("h4",{className:"glass-font-medium text-indigo-400 glass-mb-1",children:"Night (8-5 AM)"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Indigo and purple"})]})]})]})]})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-4 glass-gap-6",children:[s.jsx(j,{weatherAPI:!1,timeSync:!0,children:s.jsxs("div",{className:"glass-p-6 glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"☀️"}),s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Weather Reactive"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Adapts to weather conditions with appropriate textures and effects"})]})}),s.jsx(j,{weatherAPI:!1,timeSync:!0,children:s.jsxs("div",{className:"glass-p-6 glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"🕐"}),s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Time Aware"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Changes appearance throughout the day for optimal user experience"})]})}),s.jsx(j,{weatherAPI:!1,timeSync:!0,children:s.jsxs("div",{className:"glass-p-6 glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"🌡️"}),s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Temperature Sensitive"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Adjusts based on temperature with frosted or liquid textures"})]})}),s.jsx(j,{weatherAPI:!1,timeSync:!0,children:s.jsxs("div",{className:"glass-p-6 glass-text-center",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-3",children:"🍂"}),s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-2",children:"Seasonal Themes"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Adapts color schemes to match seasonal themes and palettes"})]})})]})]})})})},M={args:{},render:()=>s.jsx(f,{children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[s.jsxs("div",{className:"glass-text-center mb-12",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"🎨 Content-Aware Glass Adaptation"}),s.jsx("p",{className:"glass-text-xl glass-text-primary/80",children:"Glass effects that automatically adapt to different content types"})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-8 mb-12",children:[s.jsx(N,{contentType:"text",autoAdapt:!0,children:s.jsxs("div",{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"Text Content"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Uses smooth texture for optimal readability and clean appearance"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/60 glass-text-xs",children:[s.jsx("div",{children:"• Smooth texture"}),s.jsx("div",{children:"• High contrast"}),s.jsx("div",{children:"• Minimal blur"}),s.jsx("div",{children:"• Clean lines"})]})]})}),s.jsx(N,{contentType:"image",autoAdapt:!0,children:s.jsxs("div",{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"Image Gallery"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Crystalline texture enhances visual content with sparkling effects"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/60 glass-text-xs",children:[s.jsx("div",{children:"• Crystalline texture"}),s.jsx("div",{children:"• Enhanced depth"}),s.jsx("div",{children:"• Visual interest"}),s.jsx("div",{children:"• Premium feel"})]})]})}),s.jsx(N,{contentType:"video",autoAdapt:!0,children:s.jsxs("div",{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"Video Player"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Liquid texture creates dynamic, flowing effects for media content"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/60 glass-text-xs",children:[s.jsx("div",{children:"• Liquid texture"}),s.jsx("div",{children:"• Animated effects"}),s.jsx("div",{children:"• Dynamic movement"}),s.jsx("div",{children:"• Organic feel"})]})]})}),s.jsx(N,{contentType:"code",autoAdapt:!0,children:s.jsxs("div",{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"Code Editor"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Frosted texture provides subtle visual separation for technical content"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/60 glass-text-xs",children:[s.jsx("div",{children:"• Frosted texture"}),s.jsx("div",{children:"• Technical appearance"}),s.jsx("div",{children:"• Subtle effects"}),s.jsx("div",{children:"• Professional look"})]})]})}),s.jsx(N,{contentType:"data",autoAdapt:!0,children:s.jsxs("div",{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"Data Visualization"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Rippled texture adds movement and life to data presentations"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/60 glass-text-xs",children:[s.jsx("div",{children:"• Rippled texture"}),s.jsx("div",{children:"• Dynamic feel"}),s.jsx("div",{children:"• Data flow"}),s.jsx("div",{children:"• Interactive appearance"})]})]})}),s.jsx(S,{contentAware:!0,intensity:.3,children:s.jsxs("div",{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"Content Tinting"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Automatically extracts and applies colors from content for harmony"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/60 glass-text-xs",children:[s.jsx("div",{children:"• Color extraction"}),s.jsx("div",{children:"• Adaptive tinting"}),s.jsx("div",{children:"• Content harmony"}),s.jsx("div",{children:"• Dynamic adaptation"})]})]})})]}),s.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center",children:"Content Adaptation Benefits"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-4 glass-gap-6",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"📖"}),s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Better UX"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Optimized for content type"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"🎯"}),s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Context Aware"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Adapts to content automatically"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"⚡"}),s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Performance"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Optimized rendering per content"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-text-3xl glass-mb-3",children:"♿"}),s.jsx("h4",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Accessibility"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm",children:"Enhanced readability and contrast"})]})]})]})]})})})},T={args:{},render:()=>s.jsx(f,{children:s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-6xl glass-mx-auto",children:[s.jsxs("div",{className:"glass-text-center mb-12",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-mb-4",children:"🌊 Glass Opacity Engine"}),s.jsx("p",{className:"glass-text-xl glass-text-primary/80",children:"Dynamic opacity management with various triggers and smooth transitions"})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-8 mb-12",children:[s.jsx(w,{trigger:"hover",dynamicOpacity:!0,children:s.jsxs("div",{className:"glass-p-6 glass-text-center",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"Hover Trigger"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Opacity changes on mouse hover for interactive feedback"}),s.jsx("div",{className:"glass-text-primary/60 glass-text-xs",children:"Hover over this card to see the effect"})]})}),s.jsx(w,{trigger:"scroll",dynamicOpacity:!0,children:s.jsxs("div",{className:"glass-p-6 glass-text-center",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"Scroll Trigger"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Opacity responds to scroll position for depth and progression"}),s.jsx("div",{className:"glass-text-primary/60 glass-text-xs",children:"Scroll to see opacity changes"})]})}),s.jsx(w,{trigger:"time",dynamicOpacity:!0,children:s.jsxs("div",{className:"glass-p-6 glass-text-center",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary glass-mb-3",children:"Time Trigger"}),s.jsx("p",{className:"glass-text-primary/70 glass-text-sm glass-mb-4",children:"Opacity cycles based on time for ambient lighting effects"}),s.jsx("div",{className:"glass-text-primary/60 glass-text-xs",children:"Changes throughout the day"})]})})]}),s.jsxs("div",{className:"glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center",children:"Opacity Engine Features"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-3",children:"Trigger Types"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/80",children:[s.jsx("div",{children:"• Hover - Interactive feedback"}),s.jsx("div",{children:"• Scroll - Depth and progression"}),s.jsx("div",{children:"• Time - Ambient lighting"}),s.jsx("div",{children:"• Content - Context awareness"}),s.jsx("div",{children:"• Custom - Programmatic control"})]})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-3",children:"Benefits"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-primary/80",children:[s.jsx("div",{children:"• Smooth transitions"}),s.jsx("div",{children:"• Performance optimized"}),s.jsx("div",{children:"• Accessibility aware"}),s.jsx("div",{children:"• Battery conscious"}),s.jsx("div",{children:"• Customizable ranges"})]})]})]})]})]})})})};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <GlassEngineProvider>
      <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
        <div className="max-w-6xl glass-mx-auto">
          <div className="glass-text-center mb-12">
            <h1 className="glass-text-4xl glass-font-bold glass-text-primary glass-mb-4">
              🔧 Glass Engine Interactive Demo
            </h1>
            <p className="glass-text-xl glass-text-primary/80">
              Advanced glass configuration with environmental adaptation
            </p>
          </div>

          <div className="mb-12">
            <GlassEngineDemo />
          </div>

          <div className="glass-grid glass-glass-grid-cols-1 lg:glass-glass-grid-cols-2 glass-gap-8">
            <EnvironmentalControls />

            <div className="space-y-6">
              <div className="glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Engine Features</h3>
                <div className="glass-space-y-3 glass-text-primary/80">
                  <div className="glass-flex glass-items-center glass-gap-3">
                    <div className="glass-w-2 glass-h-2 glass-radius-full glass-surface-green" />
                    <span>Dynamic glass configuration</span>
                  </div>
                  <div className="glass-flex glass-items-center glass-gap-3">
                    <div className="glass-w-2 glass-h-2 glass-radius-full glass-surface-green" />
                    <span>Environmental adaptation</span>
                  </div>
                  <div className="glass-flex glass-items-center glass-gap-3">
                    <div className="glass-w-2 glass-h-2 glass-radius-full glass-surface-green" />
                    <span>5 texture variations</span>
                  </div>
                  <div className="glass-flex glass-items-center glass-gap-3">
                    <div className="glass-w-2 glass-h-2 glass-radius-full glass-surface-green" />
                    <span>Content-aware tinting</span>
                  </div>
                  <div className="glass-flex glass-items-center glass-gap-3">
                    <div className="glass-w-2 glass-h-2 glass-radius-full glass-surface-green" />
                    <span>Performance optimized</span>
                  </div>
                  <div className="glass-flex glass-items-center glass-gap-3">
                    <div className="glass-w-2 glass-h-2 glass-radius-full glass-surface-green" />
                    <span>Real-time adjustments</span>
                  </div>
                </div>
              </div>

              <div className="glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Usage Examples</h3>
                <div className="glass-space-y-3 glass-text-primary/80 glass-text-sm">
                  <div className="glass-p-3 glass-surface-subtle/5 glass-radius-lg font-mono">
                    {\`<AdaptiveGlass variant="hover">Content</AdaptiveGlass>\`}
                  </div>
                  <div className="glass-p-3 glass-surface-subtle/5 glass-radius-lg font-mono">
                    {\`<GlassOpacityEngine trigger="scroll">Content</GlassOpacityEngine>\`}
                  </div>
                  <div className="glass-p-3 glass-surface-subtle/5 glass-radius-lg font-mono">
                    {\`<EnvironmentalGlass timeSync={true}>Content</EnvironmentalGlass>\`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassEngineProvider>
}`,...C.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <GlassEngineProvider>
      <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
        <div className="max-w-6xl glass-mx-auto">
          <TextureShowcase />

          <div className="mt-12 glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8">
            <div className="glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard">
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Texture Applications</h3>
              <div className="glass-space-y-4">
                <div className="glass-p-4 glass-surface-subtle/5 glass-radius-lg">
                  <h4 className="glass-font-medium glass-text-primary glass-mb-2">Smooth - Text Content</h4>
                  <p className="glass-text-primary/70 glass-text-sm">Perfect for reading interfaces and documentation</p>
                </div>

                <div className="glass-p-4 glass-surface-subtle/5 glass-radius-lg">
                  <h4 className="glass-font-medium glass-text-primary glass-mb-2">Frosted - Modern UI</h4>
                  <p className="glass-text-primary/70 glass-text-sm">Contemporary interfaces with subtle texture</p>
                </div>

                <div className="glass-p-4 glass-surface-subtle/5 glass-radius-lg">
                  <h4 className="glass-font-medium glass-text-primary glass-mb-2">Rippled - Interactive</h4>
                  <p className="glass-text-primary/70 glass-text-sm">Dynamic content with movement and flow</p>
                </div>

                <div className="glass-p-4 glass-surface-subtle/5 glass-radius-lg">
                  <h4 className="glass-font-medium glass-text-primary glass-mb-2">Crystalline - Visual</h4>
                  <p className="glass-text-primary/70 glass-text-sm">Image galleries and visual showcases</p>
                </div>

                <div className="glass-p-4 glass-surface-subtle/5 glass-radius-lg">
                  <h4 className="glass-font-medium glass-text-primary glass-mb-2">Liquid - Media</h4>
                  <p className="glass-text-primary/70 glass-text-sm">Video players and rich media content</p>
                </div>
              </div>
            </div>

            <div className="glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard">
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Performance Characteristics</h3>
              <div className="glass-space-y-4">
                <div className="glass-flex glass-justify-between glass-items-center glass-p-3 glass-surface-green/10 glass-radius-lg">
                  <span className="glass-text-primary/80">Smooth</span>
                  <div className="glass-flex glass-items-center glass-gap-2">
                    <div className="glass-w-20 glass-h-2 glass-surface-subtle/20 glass-radius-full">
                      <div className="glass-w-16 glass-h-2 glass-surface-green glass-radius-full" />
                    </div>
                    <span className="glass-text-primary glass-text-sm">Low</span>
                  </div>
                </div>

                <div className="glass-flex glass-justify-between glass-items-center glass-p-3 glass-surface-yellow/10 glass-radius-lg">
                  <span className="glass-text-primary/80">Frosted</span>
                  <div className="glass-flex glass-items-center glass-gap-2">
                    <div className="glass-w-20 glass-h-2 glass-surface-subtle/20 glass-radius-full">
                      <div className="glass-w-12 glass-h-2 glass-surface-yellow glass-radius-full" />
                    </div>
                    <span className="glass-text-primary glass-text-sm">Medium</span>
                  </div>
                </div>

                <div className="glass-flex glass-justify-between glass-items-center glass-p-3 glass-surface-primary/10 glass-radius-lg">
                  <span className="glass-text-primary/80">Rippled</span>
                  <div className="glass-flex glass-items-center glass-gap-2">
                    <div className="glass-w-20 glass-h-2 glass-surface-subtle/20 glass-radius-full">
                      <div className="w-14 glass-h-2 glass-surface-primary glass-radius-full" />
                    </div>
                    <span className="glass-text-primary glass-text-sm">Medium</span>
                  </div>
                </div>

                <div className="glass-flex glass-justify-between glass-items-center glass-p-3 glass-surface-red/10 glass-radius-lg">
                  <span className="glass-text-primary/80">Crystalline</span>
                  <div className="glass-flex glass-items-center glass-gap-2">
                    <div className="glass-w-20 glass-h-2 glass-surface-subtle/20 glass-radius-full">
                      <div className="w-18 glass-h-2 glass-surface-red glass-radius-full" />
                    </div>
                    <span className="glass-text-primary glass-text-sm">High</span>
                  </div>
                </div>

                <div className="glass-flex glass-justify-between glass-items-center glass-p-3 glass-surface-red/10 glass-radius-lg">
                  <span className="glass-text-primary/80">Liquid</span>
                  <div className="glass-flex glass-items-center glass-gap-2">
                    <div className="glass-w-20 glass-h-2 glass-surface-subtle/20 glass-radius-full">
                      <div className="w-18 glass-h-2 glass-surface-red glass-radius-full" />
                    </div>
                    <span className="glass-text-primary glass-text-sm">High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassEngineProvider>
}`,...E.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <GlassEngineProvider>
      <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
        <div className="max-w-6xl glass-mx-auto">
          <div className="glass-text-center mb-12">
            <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
              🌍 Environmental Glass Adaptation
            </h1>
            <p className="glass-text-xl glass-text-primary/80">
              Glass effects that respond to weather, time, temperature, and seasons
            </p>
          </div>

          <div className="glass-grid glass-glass-grid-cols-1 lg:glass-glass-grid-cols-2 glass-gap-8 mb-12">
            <EnvironmentalControls />

            <div className="space-y-6">
              <div className="glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Weather Adaptations</h3>
                <div className="glass-space-y-3">
                  <div className="glass-p-3 glass-surface-blue/10 glass-radius-lg">
                    <h4 className="glass-font-medium glass-text-primary glass-mb-1">Sunny</h4>
                    <p className="glass-text-primary/70 glass-text-sm">Increased brightness and contrast</p>
                  </div>

                  <div className="glass-p-3 glass-surface-primary/10 glass-radius-lg">
                    <h4 className="glass-font-medium glass-text-secondary glass-mb-1">Cloudy</h4>
                    <p className="glass-text-primary/70 glass-text-sm">Moderate adjustments</p>
                  </div>

                  <div className="glass-p-3 glass-surface-blue/10 glass-radius-lg">
                    <h4 className="glass-font-medium glass-text-secondary glass-mb-1">Rainy</h4>
                    <p className="glass-text-primary/70 glass-text-sm">Ripple texture activation</p>
                  </div>

                  <div className="glass-p-3 glass-surface-subtle/10 glass-radius-lg">
                    <h4 className="glass-font-medium glass-text-primary glass-mb-1">Snowy</h4>
                    <p className="glass-text-primary/70 glass-text-sm">Crystalline texture with brightness</p>
                  </div>

                  <div className="glass-p-3 glass-surface-primary/10 glass-radius-lg">
                    <h4 className="glass-font-medium text-gray-300 glass-mb-1">Foggy</h4>
                    <p className="glass-text-primary/70 glass-text-sm">Reduced opacity and increased blur</p>
                  </div>
                </div>
              </div>

              <div className="glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-4">Time-Based Effects</h3>
                <div className="glass-space-y-3">
                  <div className="glass-p-3 glass-surface-primary/10 glass-radius-lg">
                    <h4 className="glass-font-medium glass-text-primary glass-mb-1">Dawn (5-9 AM)</h4>
                    <p className="glass-text-primary/70 glass-text-sm">Warm amber tones</p>
                  </div>

                  <div className="glass-p-3 glass-surface-blue/10 glass-radius-lg">
                    <h4 className="glass-font-medium glass-text-primary glass-mb-1">Day (9-5 PM)</h4>
                    <p className="glass-text-primary/70 glass-text-sm">Bright blue accents</p>
                  </div>

                  <div className="glass-p-3 glass-surface-primary/10 glass-radius-lg">
                    <h4 className="glass-font-medium glass-text-secondary glass-mb-1">Evening (5-8 PM)</h4>
                    <p className="glass-text-primary/70 glass-text-sm">Orange transitions</p>
                  </div>

                  <div className="glass-p-3 bg-indigo-500/10 glass-radius-lg">
                    <h4 className="glass-font-medium text-indigo-400 glass-mb-1">Night (8-5 AM)</h4>
                    <p className="glass-text-primary/70 glass-text-sm">Indigo and purple</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-4 glass-gap-6">
            <EnvironmentalGlass weatherAPI={false} timeSync={true}>
              <div className="glass-p-6 glass-text-center">
                <div className="glass-text-4xl glass-mb-3">☀️</div>
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Weather Reactive</h3>
                <p className="glass-text-primary/70 glass-text-sm">
                  Adapts to weather conditions with appropriate textures and effects
                </p>
              </div>
            </EnvironmentalGlass>

            <EnvironmentalGlass weatherAPI={false} timeSync={true}>
              <div className="glass-p-6 glass-text-center">
                <div className="glass-text-4xl glass-mb-3">🕐</div>
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Time Aware</h3>
                <p className="glass-text-primary/70 glass-text-sm">
                  Changes appearance throughout the day for optimal user experience
                </p>
              </div>
            </EnvironmentalGlass>

            <EnvironmentalGlass weatherAPI={false} timeSync={true}>
              <div className="glass-p-6 glass-text-center">
                <div className="glass-text-4xl glass-mb-3">🌡️</div>
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Temperature Sensitive</h3>
                <p className="glass-text-primary/70 glass-text-sm">
                  Adjusts based on temperature with frosted or liquid textures
                </p>
              </div>
            </EnvironmentalGlass>

            <EnvironmentalGlass weatherAPI={false} timeSync={true}>
              <div className="glass-p-6 glass-text-center">
                <div className="glass-text-4xl glass-mb-3">🍂</div>
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-2">Seasonal Themes</h3>
                <p className="glass-text-primary/70 glass-text-sm">
                  Adapts color schemes to match seasonal themes and palettes
                </p>
              </div>
            </EnvironmentalGlass>
          </div>
        </div>
      </div>
    </GlassEngineProvider>
}`,...A.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <GlassEngineProvider>
      <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
        <div className="max-w-6xl glass-mx-auto">
          <div className="glass-text-center mb-12">
            <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
              🎨 Content-Aware Glass Adaptation
            </h1>
            <p className="glass-text-xl glass-text-primary/80">
              Glass effects that automatically adapt to different content types
            </p>
          </div>

          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-8 mb-12">
            <GlassTextureVariations contentType="text" autoAdapt={true}>
              <div className="glass-p-6">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Text Content</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Uses smooth texture for optimal readability and clean appearance
                </p>
                <div className="glass-space-y-2 glass-text-primary/60 glass-text-xs">
                  <div>• Smooth texture</div>
                  <div>• High contrast</div>
                  <div>• Minimal blur</div>
                  <div>• Clean lines</div>
                </div>
              </div>
            </GlassTextureVariations>

            <GlassTextureVariations contentType="image" autoAdapt={true}>
              <div className="glass-p-6">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Image Gallery</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Crystalline texture enhances visual content with sparkling effects
                </p>
                <div className="glass-space-y-2 glass-text-primary/60 glass-text-xs">
                  <div>• Crystalline texture</div>
                  <div>• Enhanced depth</div>
                  <div>• Visual interest</div>
                  <div>• Premium feel</div>
                </div>
              </div>
            </GlassTextureVariations>

            <GlassTextureVariations contentType="video" autoAdapt={true}>
              <div className="glass-p-6">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Video Player</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Liquid texture creates dynamic, flowing effects for media content
                </p>
                <div className="glass-space-y-2 glass-text-primary/60 glass-text-xs">
                  <div>• Liquid texture</div>
                  <div>• Animated effects</div>
                  <div>• Dynamic movement</div>
                  <div>• Organic feel</div>
                </div>
              </div>
            </GlassTextureVariations>

            <GlassTextureVariations contentType="code" autoAdapt={true}>
              <div className="glass-p-6">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Code Editor</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Frosted texture provides subtle visual separation for technical content
                </p>
                <div className="glass-space-y-2 glass-text-primary/60 glass-text-xs">
                  <div>• Frosted texture</div>
                  <div>• Technical appearance</div>
                  <div>• Subtle effects</div>
                  <div>• Professional look</div>
                </div>
              </div>
            </GlassTextureVariations>

            <GlassTextureVariations contentType="data" autoAdapt={true}>
              <div className="glass-p-6">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Data Visualization</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Rippled texture adds movement and life to data presentations
                </p>
                <div className="glass-space-y-2 glass-text-primary/60 glass-text-xs">
                  <div>• Rippled texture</div>
                  <div>• Dynamic feel</div>
                  <div>• Data flow</div>
                  <div>• Interactive appearance</div>
                </div>
              </div>
            </GlassTextureVariations>

            <GlassColorTinting contentAware={true} intensity={0.3}>
              <div className="glass-p-6">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Content Tinting</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Automatically extracts and applies colors from content for harmony
                </p>
                <div className="glass-space-y-2 glass-text-primary/60 glass-text-xs">
                  <div>• Color extraction</div>
                  <div>• Adaptive tinting</div>
                  <div>• Content harmony</div>
                  <div>• Dynamic adaptation</div>
                </div>
              </div>
            </GlassColorTinting>
          </div>

          <div className="glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center">Content Adaptation Benefits</h3>
            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-4 glass-gap-6">
              <div className="glass-text-center">
                <div className="glass-text-3xl glass-mb-3">📖</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Better UX</h4>
                <p className="glass-text-primary/70 glass-text-sm">Optimized for content type</p>
              </div>
              <div className="glass-text-center">
                <div className="glass-text-3xl glass-mb-3">🎯</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Context Aware</h4>
                <p className="glass-text-primary/70 glass-text-sm">Adapts to content automatically</p>
              </div>
              <div className="glass-text-center">
                <div className="glass-text-3xl glass-mb-3">⚡</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Performance</h4>
                <p className="glass-text-primary/70 glass-text-sm">Optimized rendering per content</p>
              </div>
              <div className="glass-text-center">
                <div className="glass-text-3xl glass-mb-3">♿</div>
                <h4 className="glass-font-semibold glass-text-primary glass-mb-2">Accessibility</h4>
                <p className="glass-text-primary/70 glass-text-sm">Enhanced readability and contrast</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassEngineProvider>
}`,...M.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <GlassEngineProvider>
      <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary glass-p-8">
        <div className="max-w-6xl glass-mx-auto">
          <div className="glass-text-center mb-12">
            <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-mb-4">
              🌊 Glass Opacity Engine
            </h1>
            <p className="glass-text-xl glass-text-primary/80">
              Dynamic opacity management with various triggers and smooth transitions
            </p>
          </div>

          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-8 mb-12">
            <GlassOpacityEngine trigger="hover" dynamicOpacity={true}>
              <div className="glass-p-6 glass-text-center">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Hover Trigger</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Opacity changes on mouse hover for interactive feedback
                </p>
                <div className="glass-text-primary/60 glass-text-xs">
                  Hover over this card to see the effect
                </div>
              </div>
            </GlassOpacityEngine>

            <GlassOpacityEngine trigger="scroll" dynamicOpacity={true}>
              <div className="glass-p-6 glass-text-center">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Scroll Trigger</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Opacity responds to scroll position for depth and progression
                </p>
                <div className="glass-text-primary/60 glass-text-xs">
                  Scroll to see opacity changes
                </div>
              </div>
            </GlassOpacityEngine>

            <GlassOpacityEngine trigger="time" dynamicOpacity={true}>
              <div className="glass-p-6 glass-text-center">
                <h3 className="glass-text-xl glass-font-semibold glass-text-primary glass-mb-3">Time Trigger</h3>
                <p className="glass-text-primary/70 glass-text-sm glass-mb-4">
                  Opacity cycles based on time for ambient lighting effects
                </p>
                <div className="glass-text-primary/60 glass-text-xs">
                  Changes throughout the day
                </div>
              </div>
            </GlassOpacityEngine>
          </div>

          <div className="glass-surface-subtle/10 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-2xl glass-p-6 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-primary mb-6 glass-text-center">Opacity Engine Features</h3>
            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8">
              <div>
                <h4 className="glass-font-medium glass-text-primary glass-mb-3">Trigger Types</h4>
                <div className="glass-space-y-2 glass-text-primary/80">
                  <div>• Hover - Interactive feedback</div>
                  <div>• Scroll - Depth and progression</div>
                  <div>• Time - Ambient lighting</div>
                  <div>• Content - Context awareness</div>
                  <div>• Custom - Programmatic control</div>
                </div>
              </div>
              <div>
                <h4 className="glass-font-medium glass-text-primary glass-mb-3">Benefits</h4>
                <div className="glass-space-y-2 glass-text-primary/80">
                  <div>• Smooth transitions</div>
                  <div>• Performance optimized</div>
                  <div>• Accessibility aware</div>
                  <div>• Battery conscious</div>
                  <div>• Customizable ranges</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassEngineProvider>
}`,...T.parameters?.docs?.source}}};const Q=["InteractiveDemo","TextureVariations","EnvironmentalAdaptation","ContentAdaptation","OpacityEngine"];export{M as ContentAdaptation,A as EnvironmentalAdaptation,C as InteractiveDemo,T as OpacityEngine,E as TextureVariations,Q as __namedExportsOrder,J as default};
