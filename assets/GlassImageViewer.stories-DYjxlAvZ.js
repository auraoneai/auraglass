import{G as s}from"./GlassImageViewer-p7GBWamM.js";import{f as t}from"./index-CLSxArU-.js";import"./iframe-DBNhMyqR.js";import"./preload-helper-PPVm8Dsz.js";import"./components-DpX7EYd3.js";import"./index-D0WSv8Z5.js";import"./GlassCard-C4nhM4vv.js";import"./LiquidGlassMaterial-DU2fkJY_.js";import"./LiquidGlassLayerProvider-BIZ5pcBB.js";import"./OptimizedGlassCore-DUu6GVWj.js";import"./deviceCapabilities-pg7tQO9x.js";import"./MotionFramer-BEm296yJ.js";import"./utilsCore-SpUZHZAH.js";import"./GlassButton-DrQCiHsr.js";import"./a11y-BSdOe7Q0.js";import"./GlassPredictiveEngine-ByAfKOZ2.js";import"./GlassAchievementSystem-ijsi_Ncd.js";import"./GlassBiometricAdaptation-B8TpL5FZ.js";import"./MotionPreferenceContext-D5i-k5Lj.js";import"./GlassEyeTracking-iRWOe25K.js";import"./GlassSpatialAudio-g_v8UQSM.js";import"./index-ByImX2pa.js";const a=(l,i,e=800,o=600)=>`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${o}" viewBox="0 0 ${e} ${o}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0f172a"/>
          <stop offset="0.55" stop-color="${i}"/>
          <stop offset="1" stop-color="#0f766e"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <circle cx="${e*.76}" cy="${o*.26}" r="${Math.min(e,o)*.18}" fill="rgba(255,255,255,.18)"/>
      <rect x="${e*.1}" y="${o*.16}" width="${e*.5}" height="${o*.13}" rx="22" fill="rgba(255,255,255,.16)"/>
      <rect x="${e*.1}" y="${o*.76}" width="${e*.72}" height="${o*.035}" rx="12" fill="rgba(255,255,255,.22)"/>
      <text x="${e*.1}" y="${o*.68}" font-family="Inter, Arial, sans-serif" font-size="${Math.max(24,e*.052)}" font-weight="700" fill="#ffffff">${l}</text>
    </svg>
  `)}`,W={title:"Media/Glass Image Viewer",component:s,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassimageviewer component."}}},argTypes:{images:{control:"object",description:"Array of images to display"},initialIndex:{control:"number",description:"Initial image index to display"},enableZoom:{control:"boolean",description:"Whether to enable zoom functionality"},enablePan:{control:"boolean",description:"Whether to enable pan functionality"},enableRotation:{control:"boolean",description:"Whether to enable rotation"},enableFullscreen:{control:"boolean",description:"Whether to enable fullscreen mode"},enableNavigation:{control:"boolean",description:"Whether to enable image navigation"},showZoomControls:{control:"boolean",description:"Whether to show zoom controls"},showRotationControls:{control:"boolean",description:"Whether to show rotation controls"},showDownloadButton:{control:"boolean",description:"Whether to show download button"},showImageInfo:{control:"boolean",description:"Whether to show image information"},autoPlay:{control:"boolean",description:"Whether to auto-play slideshow"},autoPlayInterval:{control:"number",description:"Auto-play interval in milliseconds"}},args:{images:[{src:a("Landscape","#2563eb"),alt:"Sample Image 1",title:"Beautiful Landscape",description:"A stunning landscape view",width:800,height:600},{src:a("Architecture","#7c3aed"),alt:"Sample Image 2",title:"Urban Architecture",description:"Modern city architecture",width:800,height:600},{src:a("Nature Detail","#0f766e"),alt:"Sample Image 3",title:"Nature Close-up",description:"Detailed nature photography",width:800,height:600}],initialIndex:0,enableZoom:!0,enablePan:!0,enableRotation:!0,enableFullscreen:!0,enableNavigation:!0,showZoomControls:!0,showRotationControls:!0,showDownloadButton:!0,showImageInfo:!0,autoPlay:!1,autoPlayInterval:3e3,onImageChange:t(),onZoomChange:t(),onFullscreenChange:t()}},n={args:{images:[{src:a("Sample Image","#2563eb",600,400),alt:"Default Image",title:"Sample Image",description:"A sample image for the image viewer"}],onImageChange:t(),onZoomChange:t(),onFullscreenChange:t()}},r={args:{images:[{src:a("Gallery 1","#7c3aed",600,400),alt:"Gallery Image 1",title:"Gallery Image 1",description:"First image in gallery"},{src:a("Gallery 2","#0f766e",600,400),alt:"Gallery Image 2",title:"Gallery Image 2",description:"Second image in gallery"}],enableZoom:!0,enablePan:!0,enableRotation:!0,enableFullscreen:!0,enableNavigation:!0,showZoomControls:!0,showRotationControls:!0,showDownloadButton:!0,showImageInfo:!0,autoPlay:!0,autoPlayInterval:5e3,onImageChange:t(),onZoomChange:t(),onFullscreenChange:t()}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    images: [{
      src: viewerImage('Sample Image', '#2563eb', 600, 400),
      alt: 'Default Image',
      title: 'Sample Image',
      description: 'A sample image for the image viewer'
    }],
    onImageChange: fn(),
    onZoomChange: fn(),
    onFullscreenChange: fn()
  }
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    images: [{
      src: viewerImage('Gallery 1', '#7c3aed', 600, 400),
      alt: 'Gallery Image 1',
      title: 'Gallery Image 1',
      description: 'First image in gallery'
    }, {
      src: viewerImage('Gallery 2', '#0f766e', 600, 400),
      alt: 'Gallery Image 2',
      title: 'Gallery Image 2',
      description: 'Second image in gallery'
    }],
    enableZoom: true,
    enablePan: true,
    enableRotation: true,
    enableFullscreen: true,
    enableNavigation: true,
    showZoomControls: true,
    showRotationControls: true,
    showDownloadButton: true,
    showImageInfo: true,
    autoPlay: true,
    autoPlayInterval: 5000,
    onImageChange: fn(),
    onZoomChange: fn(),
    onFullscreenChange: fn()
  }
}`,...r.parameters?.docs?.source}}};const A=["Default","Variants"];export{n as Default,r as Variants,A as __namedExportsOrder,W as default};
