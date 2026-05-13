import{r as s,L as p,j as a,c as x}from"./iframe-6PHIdj5K.js";import"./preload-helper-PPVm8Dsz.js";const C=`
  attribute vec2 position;
  attribute vec2 texCoord;
  varying vec2 vTexCoord;
  varying vec2 vPosition;
  
  uniform mat4 uProjection;
  uniform mat4 uModelView;
  uniform float uTime;
  uniform vec2 uResolution;
  
  void main() {
    vTexCoord = texCoord;
    vPosition = position;
    gl_Position = uProjection * uModelView * vec4(position, 0.0, 1.0);
  }
`,D=`
  precision highp float;
  
  varying vec2 vTexCoord;
  varying vec2 vPosition;
  
  uniform sampler2D uBackdropTexture;
  uniform sampler2D uNormalMap;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uIOR;
  uniform float uThickness;
  uniform float uSheen;
  uniform vec2 uTilt;
  uniform bool uEnableRefraction;
  uniform bool uEnableReflection;
  uniform bool uEnableParallax;
  
  // IOR-based refraction calculation
  vec2 refract2D(vec2 incident, vec2 normal, float ior) {
    float cosI = dot(incident, normal);
    float sinT2 = (1.0 - cosI * cosI) / (ior * ior);
    
    if (sinT2 > 1.0) {
      // Total internal reflection
      return reflect(incident, normal);
    }
    
    float cosT = sqrt(1.0 - sinT2);
    return incident / ior - normal * (cosT - cosI / ior);
  }
  
  // Generate procedural normal map for glass thickness
  vec3 generateNormal(vec2 uv, float thickness, float time) {
    vec2 offset = vec2(0.001) * thickness;
    
    // Create subtle surface variation
    float height1 = sin(uv.x * 20.0 + time * 0.5) * cos(uv.y * 15.0 + time * 0.3) * 0.1;
    float height2 = sin(uv.x * 35.0 - time * 0.7) * cos(uv.y * 25.0 - time * 0.4) * 0.05;
    
    float heightL = sin((uv.x - offset.x) * 20.0 + time * 0.5) * cos(uv.y * 15.0 + time * 0.3) * 0.1;
    float heightR = sin((uv.x + offset.x) * 20.0 + time * 0.5) * cos(uv.y * 15.0 + time * 0.3) * 0.1;
    float heightT = sin(uv.x * 20.0 + time * 0.5) * cos((uv.y + offset.y) * 15.0 + time * 0.3) * 0.1;
    float heightB = sin(uv.x * 20.0 + time * 0.5) * cos((uv.y - offset.y) * 15.0 + time * 0.3) * 0.1;
    
    vec3 normal;
    normal.x = (heightL - heightR) / (2.0 * offset.x);
    normal.y = (heightB - heightT) / (2.0 * offset.y);
    normal.z = 1.0;
    
    return normalize(normal);
  }
  
  // Fresnel reflectance calculation
  float fresnel(vec3 incident, vec3 normal, float ior) {
    float cosI = abs(dot(incident, normal));
    float sinI = sqrt(1.0 - cosI * cosI);
    float sinT = sinI / ior;
    
    if (sinT >= 1.0) {
      return 1.0; // Total internal reflection
    }
    
    float cosT = sqrt(1.0 - sinT * sinT);
    float rs = (ior * cosI - cosT) / (ior * cosI + cosT);
    float rp = (ior * cosT - cosI) / (ior * cosT + cosI);
    
    return (rs * rs + rp * rp) * 0.5;
  }
  
  void main() {
    vec2 uv = vTexCoord;
    vec2 screenUV = gl_FragCoord.xy / uResolution;
    
    // Generate surface normal based on thickness
    vec3 normal = generateNormal(uv, uThickness * 0.1, uTime);
    
    // Apply device tilt to normal
    normal.xy += uTilt * 0.3;
    normal = normalize(normal);
    
    vec4 color = vec4(0.0);
    
    if (uEnableRefraction) {
      // Calculate refracted sampling coordinates
      vec2 incident = normalize(vec2(0.0, -1.0));
      vec2 refracted = refract2D(incident, normal.xy, 1.0 / uIOR);
      
      // Sample backdrop with refraction offset
      vec2 refractedUV = screenUV + refracted * uThickness * 0.01;
      refractedUV = clamp(refractedUV, 0.0, 1.0);
      
      vec4 refractedColor = texture2D(uBackdropTexture, refractedUV);
      color += refractedColor * 0.7;
    } else {
      // Fallback: direct backdrop sampling
      color += texture2D(uBackdropTexture, screenUV) * 0.7;
    }
    
    if (uEnableReflection) {
      // Calculate reflection
      vec3 viewDir = normalize(vec3(screenUV - 0.5, -1.0));
      vec3 reflected = reflect(viewDir, normal);
      
      // Sample environment for reflection (simplified)
      vec2 reflectionUV = screenUV + reflected.xy * 0.05;
      reflectionUV = clamp(reflectionUV, 0.0, 1.0);
      
      vec4 reflectionColor = texture2D(uBackdropTexture, reflectionUV);
      
      // Apply Fresnel for realistic reflection strength
      float fresnelStrength = fresnel(viewDir, normal, uIOR);
      color += reflectionColor * fresnelStrength * 0.3;
    }
    
    // Edge sheen effect
    if (uSheen > 0.0) {
      float edgeDistance = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
      float sheenStrength = 1.0 - smoothstep(0.0, 0.1, edgeDistance);
      
      vec3 sheenColor = vec3(1.0, 1.0, 1.0);
      color.rgb += sheenColor * sheenStrength * uSheen * 0.2;
    }
    
    // Glass tint overlay
    vec4 glassTint = vec4(1.0, 1.0, 1.0, 0.95);
    color = mix(color, glassTint, 0.15);
    
    // Apply thickness-based opacity
    color.a = 0.85 + uThickness * 0.02;
    
    gl_FragColor = color;
  }
`;class P{constructor(){this.gl=null,this.program=null,this.canvas=null,this.uniforms={},this.attributes={},this.isInitialized=!1,this.animationFrameId=null,this.backdropTexture=null}async initialize(e){try{if(this.canvas=e,this.gl=e.getContext("webgl")||e.getContext("experimental-webgl"),!this.gl)return!1;const i=["OES_texture_float","WEBGL_color_buffer_float"];for(const t of i)this.gl.getExtension(t);return this.program=this.createShaderProgram(C,D),this.program?(this.setupUniformsAndAttributes(),this.setupGeometry(),this.isInitialized=!0,!0):!1}catch{return!1}}render(e){if(!this.gl||!this.program||!this.isInitialized)return;const i=this.gl;i.clear(i.COLOR_BUFFER_BIT),i.viewport(0,0,this.canvas.width,this.canvas.height),i.useProgram(this.program),this.updateUniforms(e),i.drawArrays(i.TRIANGLE_STRIP,0,4)}async updateBackdrop(e){if(!(!this.gl||!this.isInitialized))try{const i=await this.captureElementBackdrop(e);if(!i)return;this.backdropTexture||(this.backdropTexture=this.gl.createTexture()),this.gl.bindTexture(this.gl.TEXTURE_2D,this.backdropTexture),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,i),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR)}catch{}}dispose(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.gl&&(this.program&&this.gl.deleteProgram(this.program),this.backdropTexture&&this.gl.deleteTexture(this.backdropTexture)),this.isInitialized=!1}static isSupported(){try{const e=document.createElement("canvas");return!!(e.getContext("webgl")||e.getContext("experimental-webgl"))}catch{return!1}}createShaderProgram(e,i){if(!this.gl)return null;const t=this.compileShader(e,this.gl.VERTEX_SHADER),n=this.compileShader(i,this.gl.FRAGMENT_SHADER);if(!t||!n)return null;const o=this.gl.createProgram();return o?(this.gl.attachShader(o,t),this.gl.attachShader(o,n),this.gl.linkProgram(o),this.gl.getProgramParameter(o,this.gl.LINK_STATUS)?o:(this.gl.deleteProgram(o),null)):null}compileShader(e,i){if(!this.gl)return null;const t=this.gl.createShader(i);return t?(this.gl.shaderSource(t,e),this.gl.compileShader(t),this.gl.getShaderParameter(t,this.gl.COMPILE_STATUS)?t:(this.gl.deleteShader(t),null)):null}setupUniformsAndAttributes(){if(!this.gl||!this.program)return;const e=["uBackdropTexture","uNormalMap","uResolution","uTime","uIOR","uThickness","uSheen","uTilt","uEnableRefraction","uEnableReflection","uEnableParallax","uProjection","uModelView"];for(const i of e)this.uniforms[i]=this.gl.getUniformLocation(this.program,i);this.attributes.position=this.gl.getAttribLocation(this.program,"position"),this.attributes.texCoord=this.gl.getAttribLocation(this.program,"texCoord")}setupGeometry(){if(!this.gl)return;const e=new Float32Array([-1,-1,1,-1,-1,1,1,1]),i=new Float32Array([0,0,1,0,0,1,1,1]),t=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,t),this.gl.bufferData(this.gl.ARRAY_BUFFER,e,this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(this.attributes.position),this.gl.vertexAttribPointer(this.attributes.position,2,this.gl.FLOAT,!1,0,0);const n=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,n),this.gl.bufferData(this.gl.ARRAY_BUFFER,i,this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(this.attributes.texCoord),this.gl.vertexAttribPointer(this.attributes.texCoord,2,this.gl.FLOAT,!1,0,0)}updateUniforms(e){!this.gl||!this.canvas||(this.uniforms.uIOR&&this.gl.uniform1f(this.uniforms.uIOR,e.ior),this.uniforms.uThickness&&this.gl.uniform1f(this.uniforms.uThickness,e.thickness),this.uniforms.uSheen&&this.gl.uniform1f(this.uniforms.uSheen,e.sheen),this.uniforms.uTime&&this.gl.uniform1f(this.uniforms.uTime,e.time),this.uniforms.uResolution&&this.gl.uniform2f(this.uniforms.uResolution,this.canvas.width,this.canvas.height),this.uniforms.uTilt&&this.gl.uniform2f(this.uniforms.uTilt,e.tilt.x,e.tilt.y),this.uniforms.uEnableRefraction&&this.gl.uniform1i(this.uniforms.uEnableRefraction,e.enableRefraction?1:0),this.uniforms.uEnableReflection&&this.gl.uniform1i(this.uniforms.uEnableReflection,e.enableReflection?1:0),this.uniforms.uEnableParallax&&this.gl.uniform1i(this.uniforms.uEnableParallax,e.enableParallax?1:0),this.uniforms.uBackdropTexture&&this.backdropTexture&&(this.gl.activeTexture(this.gl.TEXTURE0),this.gl.bindTexture(this.gl.TEXTURE_2D,this.backdropTexture),this.gl.uniform1i(this.uniforms.uBackdropTexture,0)))}async captureElementBackdrop(e){try{const i=document.createElement("canvas"),t=i.getContext("2d");if(!t)return null;i.width=e.clientWidth||256,i.height=e.clientHeight||256;const n=t.createLinearGradient(0,0,i.width,i.height);return n.addColorStop(0,"#4f46e5"),n.addColorStop(.5,"#7c3aed"),n.addColorStop(1,"#ec4899"),t.fillStyle=n,t.fillRect(0,0,i.width,i.height),i}catch{return null}}}const R=({material:c="liquid",variant:e="regular",ior:i=p.material.ior.liquid,thickness:t=p.material.thickness.medium,sheen:n=p.material.sheen.subtle,enableRefraction:o=!0,enableReflection:E=!0,enableParallax:S=!1,adaptToMotion:q=!0,className:_,children:I,onFallback:y})=>{const f=s.useRef(null),g=s.useRef(null),d=s.useRef(null),[m,k]=s.useState(!1),[U,G]=s.useState({x:0,y:0}),L=s.useRef(Date.now()),A=s.useRef(0),T=s.useRef(!1);return s.useEffect(()=>((async()=>{if(!f.current)return;const r=P.isSupported();if(k(r),!r){y?.();return}d.current=new P,await d.current.initialize(f.current)||(k(!1),y?.())})(),()=>{d.current?.dispose()}),[y]),s.useEffect(()=>{if(!q||!m)return;const l=r=>{if(r.beta!==null&&r.gamma!==null){const u=p.motionFluency.tilt.sensitivity;G({x:Math.max(-1,Math.min(1,r.gamma*u)),y:Math.max(-1,Math.min(1,r.beta*u))})}};if(typeof DeviceOrientationEvent<"u")return window.addEventListener("deviceorientation",l),()=>window.removeEventListener("deviceorientation",l)},[q,m]),s.useEffect(()=>{if(!m||!d.current)return;let l;const r=()=>{if(d.current&&f.current){const u=(Date.now()-L.current)/1e3;d.current.render({ior:i,thickness:t,sheen:n,tilt:U,enableRefraction:o,enableReflection:E,enableParallax:S,time:u}),g.current&&u-A.current>=1&&!T.current&&(A.current=u,T.current=!0,d.current.updateBackdrop(g.current).finally(()=>{T.current=!1}))}l=requestAnimationFrame(r)};return r(),()=>{l&&cancelAnimationFrame(l)}},[m,i,t,n,U,o,E,S]),s.useEffect(()=>{if(!f.current||!g.current)return;const l=()=>{const r=f.current,h=g.current.getBoundingClientRect(),w=window.devicePixelRatio||1;r.width=h.width*w,r.height=h.height*w,r.style.width=`${h.width}px`,r.style.height=`${h.height}px`};return l(),window.addEventListener("resize",l),()=>window.removeEventListener("resize",l)},[]),m?a.jsxs("div",{ref:g,className:x("glass-surface-primary glass-relative glass-overflow-hidden",_),children:[a.jsx("canvas",{ref:f,className:x("glass-absolute glass-inset-0 glass-w-full glass-h-full glass-pointer-events-none"),style:{zIndex:1}}),a.jsx("div",{className:x("glass-relative glass-z-10"),children:I})]}):a.jsx("div",{"data-glass-component":!0,ref:g,className:x("glass-surface-primary glass-blur-backdrop glass-relative glass-overflow-hidden",_),style:{background:`linear-gradient(135deg, rgba(255,255,255,${.15+n*.05}) 0%, rgba(255,255,255,${.05+n*.02}) 100%)`,border:`1px solid rgba(255,255,255,${.3+n*.1})`},children:I})},b=R;try{R.displayName="LiquidGlassGPURenderer",R.__docgenInfo={description:"",displayName:"LiquidGlassGPURenderer",props:{material:{defaultValue:{value:"liquid"},description:"",name:"material",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"liquid"'},{value:'"standard"'}]}},variant:{defaultValue:{value:"regular"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"clear"'},{value:'"regular"'}]}},ior:{defaultValue:{value:"LIQUID_GLASS.material.ior.liquid"},description:"",name:"ior",required:!1,type:{name:"number | undefined"}},thickness:{defaultValue:{value:"LIQUID_GLASS.material.thickness.medium"},description:"",name:"thickness",required:!1,type:{name:"number | undefined"}},sheen:{defaultValue:{value:"LIQUID_GLASS.material.sheen.subtle"},description:"",name:"sheen",required:!1,type:{name:"number | undefined"}},enableRefraction:{defaultValue:{value:"true"},description:"",name:"enableRefraction",required:!1,type:{name:"boolean | undefined"}},enableReflection:{defaultValue:{value:"true"},description:"",name:"enableReflection",required:!1,type:{name:"boolean | undefined"}},enableParallax:{defaultValue:{value:"false"},description:"",name:"enableParallax",required:!1,type:{name:"boolean | undefined"}},adaptToMotion:{defaultValue:{value:"true"},description:"",name:"adaptToMotion",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},onFallback:{defaultValue:null,description:"",name:"onFallback",required:!1,type:{name:"(() => void) | undefined"}}}}}catch{}try{b.displayName="LiquidGlassGPU",b.__docgenInfo={description:"",displayName:"LiquidGlassGPU",props:{material:{defaultValue:{value:"liquid"},description:"",name:"material",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"liquid"'},{value:'"standard"'}]}},variant:{defaultValue:{value:"regular"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"clear"'},{value:'"regular"'}]}},ior:{defaultValue:{value:"LIQUID_GLASS.material.ior.liquid"},description:"",name:"ior",required:!1,type:{name:"number | undefined"}},thickness:{defaultValue:{value:"LIQUID_GLASS.material.thickness.medium"},description:"",name:"thickness",required:!1,type:{name:"number | undefined"}},sheen:{defaultValue:{value:"LIQUID_GLASS.material.sheen.subtle"},description:"",name:"sheen",required:!1,type:{name:"number | undefined"}},enableRefraction:{defaultValue:{value:"true"},description:"",name:"enableRefraction",required:!1,type:{name:"boolean | undefined"}},enableReflection:{defaultValue:{value:"true"},description:"",name:"enableReflection",required:!1,type:{name:"boolean | undefined"}},enableParallax:{defaultValue:{value:"false"},description:"",name:"enableParallax",required:!1,type:{name:"boolean | undefined"}},adaptToMotion:{defaultValue:{value:"true"},description:"",name:"adaptToMotion",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},onFallback:{defaultValue:null,description:"",name:"onFallback",required:!1,type:{name:"(() => void) | undefined"}}}}}catch{}const F={title:"Effects + Advanced/Liquid Glass GPU",component:b,parameters:{layout:"fullscreen",previewSurface:"app"}},v={render:()=>a.jsxs("div",{className:"liquid-glass-gpu-story",style:{minHeight:"100vh",width:"100%",display:"grid",placeItems:"center",padding:32,boxSizing:"border-box"},children:[a.jsx("style",{children:`
        .liquid-glass-gpu-scene {
          width: min(920px, 100%);
          min-height: 520px;
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(280px, .85fr);
          gap: 24px;
          padding: 28px;
          border-radius: 32px;
          color: #0f172a;
          background:
            radial-gradient(circle at 18% 20%, rgba(96, 165, 250, .42), transparent 28%),
            radial-gradient(circle at 78% 64%, rgba(45, 212, 191, .34), transparent 30%),
            linear-gradient(135deg, rgba(255,255,255,.64), rgba(219,234,254,.36));
          box-shadow: 0 28px 90px rgba(15, 23, 42, .18);
        }

        .liquid-glass-gpu-demo {
          min-height: 360px;
          border-radius: 30px;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.72), 0 24px 70px rgba(15,23,42,.18);
        }

        .liquid-glass-gpu-panel {
          display: grid;
          align-content: center;
          gap: 18px;
          min-width: 0;
        }

        .liquid-glass-gpu-stat-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .liquid-glass-gpu-stat {
          border-radius: 18px;
          padding: 14px;
          background: rgba(255,255,255,.58);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.64);
        }

        @media (max-width: 720px) {
          .liquid-glass-gpu-story { padding: 20px; place-items: start center; }
          .liquid-glass-gpu-scene { grid-template-columns: 1fr; min-height: auto; padding: 20px; }
          .liquid-glass-gpu-demo { min-height: 300px; }
        }
      `}),a.jsxs("div",{className:"liquid-glass-gpu-scene",children:[a.jsx(b,{variant:"clear",ior:1.58,thickness:18,sheen:.72,enableRefraction:!0,enableReflection:!0,enableParallax:!0,className:"liquid-glass-gpu-demo",children:a.jsxs("div",{style:{minHeight:360,display:"grid",alignContent:"end",gap:10,padding:24,boxSizing:"border-box"},children:[a.jsx("strong",{style:{fontSize:22},children:"GPU refraction layer"}),a.jsx("span",{style:{maxWidth:360,color:"#334155"},children:"A clear Liquid Glass shader surface over a detailed backdrop with readable foreground content."})]})}),a.jsxs("aside",{className:"liquid-glass-gpu-panel",children:[a.jsxs("div",{children:[a.jsx("h2",{style:{margin:0,fontSize:26},children:"Liquid Glass GPU"}),a.jsx("p",{style:{margin:"8px 0 0",color:"#475569"},children:"This story renders the component itself, including its CSS fallback, instead of a certification placeholder."})]}),a.jsx("div",{className:"liquid-glass-gpu-stat-grid",children:[["IOR","1.58"],["Thickness","18px"],["Sheen","72%"],["Mode","Clear"]].map(([c,e])=>a.jsxs("div",{className:"liquid-glass-gpu-stat",children:[a.jsx("span",{style:{display:"block",color:"#64748b",fontSize:12},children:c}),a.jsx("strong",{style:{display:"block",marginTop:4},children:e})]},c))})]})]})]})};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div className="liquid-glass-gpu-story" style={{
    minHeight: "100vh",
    width: "100%",
    display: "grid",
    placeItems: "center",
    padding: 32,
    boxSizing: "border-box"
  }}>
      <style>{\`
        .liquid-glass-gpu-scene {
          width: min(920px, 100%);
          min-height: 520px;
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(280px, .85fr);
          gap: 24px;
          padding: 28px;
          border-radius: 32px;
          color: #0f172a;
          background:
            radial-gradient(circle at 18% 20%, rgba(96, 165, 250, .42), transparent 28%),
            radial-gradient(circle at 78% 64%, rgba(45, 212, 191, .34), transparent 30%),
            linear-gradient(135deg, rgba(255,255,255,.64), rgba(219,234,254,.36));
          box-shadow: 0 28px 90px rgba(15, 23, 42, .18);
        }

        .liquid-glass-gpu-demo {
          min-height: 360px;
          border-radius: 30px;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.72), 0 24px 70px rgba(15,23,42,.18);
        }

        .liquid-glass-gpu-panel {
          display: grid;
          align-content: center;
          gap: 18px;
          min-width: 0;
        }

        .liquid-glass-gpu-stat-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .liquid-glass-gpu-stat {
          border-radius: 18px;
          padding: 14px;
          background: rgba(255,255,255,.58);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.64);
        }

        @media (max-width: 720px) {
          .liquid-glass-gpu-story { padding: 20px; place-items: start center; }
          .liquid-glass-gpu-scene { grid-template-columns: 1fr; min-height: auto; padding: 20px; }
          .liquid-glass-gpu-demo { min-height: 300px; }
        }
      \`}</style>
      <div className="liquid-glass-gpu-scene">
        <LiquidGlassGPU variant="clear" ior={1.58} thickness={18} sheen={0.72} enableRefraction enableReflection enableParallax className="liquid-glass-gpu-demo">
          <div style={{
          minHeight: 360,
          display: "grid",
          alignContent: "end",
          gap: 10,
          padding: 24,
          boxSizing: "border-box"
        }}>
            <strong style={{
            fontSize: 22
          }}>GPU refraction layer</strong>
            <span style={{
            maxWidth: 360,
            color: "#334155"
          }}>
              A clear Liquid Glass shader surface over a detailed backdrop with
              readable foreground content.
            </span>
          </div>
        </LiquidGlassGPU>
        <aside className="liquid-glass-gpu-panel">
          <div>
            <h2 style={{
            margin: 0,
            fontSize: 26
          }}>Liquid Glass GPU</h2>
            <p style={{
            margin: "8px 0 0",
            color: "#475569"
          }}>
              This story renders the component itself, including its CSS fallback,
              instead of a certification placeholder.
            </p>
          </div>
          <div className="liquid-glass-gpu-stat-grid">
            {[["IOR", "1.58"], ["Thickness", "18px"], ["Sheen", "72%"], ["Mode", "Clear"]].map(([label, value]) => <div key={label} className="liquid-glass-gpu-stat">
                <span style={{
              display: "block",
              color: "#64748b",
              fontSize: 12
            }}>
                  {label}
                </span>
                <strong style={{
              display: "block",
              marginTop: 4
            }}>{value}</strong>
              </div>)}
          </div>
        </aside>
      </div>
    </div>
}`,...v.parameters?.docs?.source}}};const B=["Default"];export{v as Default,B as __namedExportsOrder,F as default};
