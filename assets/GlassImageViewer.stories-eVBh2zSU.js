import{G as n}from"./GlassImageViewer-tAFZvrtB.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-DpweptvF.js";import"./preload-helper-PPVm8Dsz.js";import"./index-yUfQYjzS.js";import"./GlassCard-5JQQ9cg_.js";import"./LiquidGlassMaterial-nIJf4szv.js";import"./LiquidGlassLayerProvider-DwkmVtLC.js";import"./OptimizedGlassCore-UOg4NIOz.js";import"./MotionFramer-BmJovKMH.js";import"./utilsCore-Diw1ReC2.js";import"./x-CqbWQJ3p.js";import"./createLucideIcon-eJ4-KqhR.js";import"./GlassButton-CoJjSHnE.js";import"./index-DErlfuJO.js";import"./GlassPredictiveEngine-CJz8dse6.js";import"./GlassAchievementSystem-DQQoVp6r.js";import"./GlassBiometricAdaptation-CJofGeVw.js";import"./MotionPreferenceContext-5A7bWbbY.js";import"./GlassEyeTracking-BvBuetm1.js";import"./GlassSpatialAudio-Csw4ezvx.js";import"./chevron-left-DZ8A7DqS.js";import"./chevron-right-1rtoKK3s.js";import"./zoom-in-CgwDwIpA.js";import"./rotate-ccw-B4o_IHYr.js";import"./download-CF_Hshdb.js";import"./minimize-2-BxKhMbnt.js";import"./pause-DizZQn_H.js";import"./play-Kk_nf272.js";import"./house-DRYHFuAz.js";import"./index-ByImX2pa.js";const V={title:"Components/Interactive/GlassImageViewer",component:n,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassimageviewer component."}}},argTypes:{images:{control:"object",description:"Array of images to display"},initialIndex:{control:"number",description:"Initial image index to display"},enableZoom:{control:"boolean",description:"Whether to enable zoom functionality"},enablePan:{control:"boolean",description:"Whether to enable pan functionality"},enableRotation:{control:"boolean",description:"Whether to enable rotation"},enableFullscreen:{control:"boolean",description:"Whether to enable fullscreen mode"},enableNavigation:{control:"boolean",description:"Whether to enable image navigation"},showZoomControls:{control:"boolean",description:"Whether to show zoom controls"},showRotationControls:{control:"boolean",description:"Whether to show rotation controls"},showDownloadButton:{control:"boolean",description:"Whether to show download button"},showImageInfo:{control:"boolean",description:"Whether to show image information"},autoPlay:{control:"boolean",description:"Whether to auto-play slideshow"},autoPlayInterval:{control:"number",description:"Auto-play interval in milliseconds"}},args:{images:[{src:"https://picsum.photos/800/600?random=1",alt:"Sample Image 1",title:"Beautiful Landscape",description:"A stunning landscape view",width:800,height:600},{src:"https://picsum.photos/800/600?random=2",alt:"Sample Image 2",title:"Urban Architecture",description:"Modern city architecture",width:800,height:600},{src:"https://picsum.photos/800/600?random=3",alt:"Sample Image 3",title:"Nature Close-up",description:"Detailed nature photography",width:800,height:600}],initialIndex:0,enableZoom:!0,enablePan:!0,enableRotation:!0,enableFullscreen:!0,enableNavigation:!0,showZoomControls:!0,showRotationControls:!0,showDownloadButton:!0,showImageInfo:!0,autoPlay:!1,autoPlayInterval:3e3,onImageChange:e(),onZoomChange:e(),onFullscreenChange:e()}},o={args:{images:[{src:"https://picsum.photos/600/400?random=1",alt:"Default Image",title:"Sample Image",description:"A sample image for the image viewer"}],onImageChange:e(),onZoomChange:e(),onFullscreenChange:e()}},t={args:{images:[{src:"https://picsum.photos/600/400?random=2",alt:"Gallery Image 1",title:"Gallery Image 1",description:"First image in gallery"},{src:"https://picsum.photos/600/400?random=3",alt:"Gallery Image 2",title:"Gallery Image 2",description:"Second image in gallery"}],enableZoom:!0,enablePan:!0,enableRotation:!0,enableFullscreen:!0,enableNavigation:!0,showZoomControls:!0,showRotationControls:!0,showDownloadButton:!0,showImageInfo:!0,autoPlay:!0,autoPlayInterval:5e3,onImageChange:e(),onZoomChange:e(),onFullscreenChange:e()}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    images: [{
      src: 'https://picsum.photos/600/400?random=1',
      alt: 'Default Image',
      title: 'Sample Image',
      description: 'A sample image for the image viewer'
    }],
    onImageChange: fn(),
    onZoomChange: fn(),
    onFullscreenChange: fn()
  }
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    images: [{
      src: 'https://picsum.photos/600/400?random=2',
      alt: 'Gallery Image 1',
      title: 'Gallery Image 1',
      description: 'First image in gallery'
    }, {
      src: 'https://picsum.photos/600/400?random=3',
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
}`,...t.parameters?.docs?.source}}};const z=["Default","Variants"];export{o as Default,t as Variants,z as __namedExportsOrder,V as default};
