import{G as s}from"./GlassImageViewer-6wOWnEav.js";import{f as t}from"./index-CLSxArU-.js";import"./iframe-D5XNSE8t.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DRyS_3Ac.js";import"./GlassCard-BMR1Sm4j.js";import"./LiquidGlassMaterial-PIWApLWo.js";import"./LiquidGlassLayerProvider-Cctd_86z.js";import"./OptimizedGlassCore-CXfAtOX-.js";import"./deviceCapabilities-QhTB8XNW.js";import"./MotionFramer-BJ26b83I.js";import"./utilsCore-BoSRIG9I.js";import"./x-BwNljDFy.js";import"./createLucideIcon-C9kAMw0Q.js";import"./GlassButton-BOFlydal.js";import"./index-C5YfwLuS.js";import"./a11y-BFAoh2ff.js";import"./GlassPredictiveEngine-z1M3s8P_.js";import"./GlassAchievementSystem-DddBzQgy.js";import"./GlassBiometricAdaptation-CNbD9aRM.js";import"./MotionPreferenceContext-BsYtSTuz.js";import"./GlassEyeTracking-XfaAeBCk.js";import"./GlassSpatialAudio-dtj1_O9L.js";import"./chevron-left-DnMcFAP5.js";import"./chevron-right-Dq_KJ-SF.js";import"./zoom-in-B_DKc1yX.js";import"./rotate-ccw-S3RM4fyn.js";import"./download-P57WoUNq.js";import"./minimize-2-XSohWJTr.js";import"./pause-Blsj6Iv9.js";import"./play-DJBCJevN.js";import"./house-BEK0SfA1.js";import"./index-ByImX2pa.js";const a=(l,i,e=800,o=600)=>`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
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
  `)}`,_={title:"Media/Glass Image Viewer",component:s,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassimageviewer component."}}},argTypes:{images:{control:"object",description:"Array of images to display"},initialIndex:{control:"number",description:"Initial image index to display"},enableZoom:{control:"boolean",description:"Whether to enable zoom functionality"},enablePan:{control:"boolean",description:"Whether to enable pan functionality"},enableRotation:{control:"boolean",description:"Whether to enable rotation"},enableFullscreen:{control:"boolean",description:"Whether to enable fullscreen mode"},enableNavigation:{control:"boolean",description:"Whether to enable image navigation"},showZoomControls:{control:"boolean",description:"Whether to show zoom controls"},showRotationControls:{control:"boolean",description:"Whether to show rotation controls"},showDownloadButton:{control:"boolean",description:"Whether to show download button"},showImageInfo:{control:"boolean",description:"Whether to show image information"},autoPlay:{control:"boolean",description:"Whether to auto-play slideshow"},autoPlayInterval:{control:"number",description:"Auto-play interval in milliseconds"}},args:{images:[{src:a("Landscape","#2563eb"),alt:"Sample Image 1",title:"Beautiful Landscape",description:"A stunning landscape view",width:800,height:600},{src:a("Architecture","#7c3aed"),alt:"Sample Image 2",title:"Urban Architecture",description:"Modern city architecture",width:800,height:600},{src:a("Nature Detail","#0f766e"),alt:"Sample Image 3",title:"Nature Close-up",description:"Detailed nature photography",width:800,height:600}],initialIndex:0,enableZoom:!0,enablePan:!0,enableRotation:!0,enableFullscreen:!0,enableNavigation:!0,showZoomControls:!0,showRotationControls:!0,showDownloadButton:!0,showImageInfo:!0,autoPlay:!1,autoPlayInterval:3e3,onImageChange:t(),onZoomChange:t(),onFullscreenChange:t()}},n={args:{images:[{src:a("Sample Image","#2563eb",600,400),alt:"Default Image",title:"Sample Image",description:"A sample image for the image viewer"}],onImageChange:t(),onZoomChange:t(),onFullscreenChange:t()}},r={args:{images:[{src:a("Gallery 1","#7c3aed",600,400),alt:"Gallery Image 1",title:"Gallery Image 1",description:"First image in gallery"},{src:a("Gallery 2","#0f766e",600,400),alt:"Gallery Image 2",title:"Gallery Image 2",description:"Second image in gallery"}],enableZoom:!0,enablePan:!0,enableRotation:!0,enableFullscreen:!0,enableNavigation:!0,showZoomControls:!0,showRotationControls:!0,showDownloadButton:!0,showImageInfo:!0,autoPlay:!0,autoPlayInterval:5e3,onImageChange:t(),onZoomChange:t(),onFullscreenChange:t()}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};const j=["Default","Variants"];export{n as Default,r as Variants,j as __namedExportsOrder,_ as default};
