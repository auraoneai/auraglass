import{r as c,b as F,j as a,c as C}from"./iframe-BJUPYBdj.js";import"./preload-helper-PPVm8Dsz.js";const k=`
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`,P={refraction:`
    precision mediump float;
    
    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_intensity;
    
    varying vec2 v_texCoord;
    
    void main() {
      vec2 uv = v_texCoord;
      vec2 center = vec2(0.5, 0.5);
      vec2 mouseNorm = u_mouse / u_resolution;
      
      // Calculate refraction based on distance from mouse
      float dist = distance(uv, mouseNorm);
      float refraction = sin(dist * 10.0 - u_time * 2.0) * 0.02 * u_intensity;
      
      // Apply chromatic aberration
      vec2 rOffset = uv + vec2(refraction, 0.0);
      vec2 gOffset = uv;
      vec2 bOffset = uv - vec2(refraction, 0.0);
      
      float r = texture2D(u_image, rOffset).r;
      float g = texture2D(u_image, gOffset).g;
      float b = texture2D(u_image, bOffset).b;
      
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `,dispersion:`
    precision mediump float;
    
    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_intensity;
    
    varying vec2 v_texCoord;
    
    void main() {
      vec2 uv = v_texCoord;
      
      // Rainbow dispersion effect
      float wave = sin(uv.y * 10.0 + u_time) * 0.01 * u_intensity;
      
      vec2 rUV = uv + vec2(wave * 2.0, 0.0);
      vec2 gUV = uv + vec2(wave, 0.0);
      vec2 bUV = uv;
      
      vec3 color;
      color.r = texture2D(u_image, rUV).r;
      color.g = texture2D(u_image, gUV).g;
      color.b = texture2D(u_image, bUV).b;
      
      // Add prismatic highlights
      float highlight = sin(uv.x * 20.0 + u_time * 2.0) * 0.1;
      color += vec3(highlight, highlight * 0.5, highlight * 0.3);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,frosted:`
    precision mediump float;
    
    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_intensity;
    
    varying vec2 v_texCoord;
    
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    void main() {
      vec2 uv = v_texCoord;
      vec3 color = vec3(0.0);
      
      // Frosted glass blur
      float blurSize = 0.01 * u_intensity;
      int samples = 9;
      
      for(int i = 0; i < samples; i++) {
        float angle = float(i) / float(samples) * 6.28318;
        vec2 offset = vec2(cos(angle), sin(angle)) * blurSize;
        offset *= random(uv + float(i));
        
        color += texture2D(u_image, uv + offset).rgb;
      }
      
      color /= float(samples);
      
      // Add frost texture
      float frost = random(uv * 100.0 + u_time * 0.1) * 0.1;
      color += vec3(frost);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,crystal:`
    precision mediump float;
    
    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_intensity;
    
    varying vec2 v_texCoord;
    
    void main() {
      vec2 uv = v_texCoord;
      vec2 center = vec2(0.5, 0.5);
      
      // Crystal facets
      float angle = atan(uv.y - center.y, uv.x - center.x);
      float facets = 8.0;
      angle = floor(angle * facets) / facets;
      
      float dist = distance(uv, center);
      vec2 facetUV = center + vec2(cos(angle), sin(angle)) * dist;
      
      // Refraction through crystal
      vec2 refractUV = mix(uv, facetUV, u_intensity * 0.5);
      vec3 color = texture2D(u_image, refractUV).rgb;
      
      // Add sparkle
      float sparkle = sin(angle * 20.0 + u_time * 3.0) * 0.2;
      color += vec3(sparkle);
      
      // Inner reflections
      float reflection = sin(dist * 30.0 - u_time * 2.0) * 0.1;
      color += vec3(reflection, reflection * 0.8, reflection * 1.2);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,prism:`
    precision mediump float;
    
    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_intensity;
    
    varying vec2 v_texCoord;
    
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    void main() {
      vec2 uv = v_texCoord;
      
      // Prism light splitting
      float prismAngle = uv.x + sin(uv.y * 10.0 + u_time) * 0.1;
      
      // Sample at different wavelengths
      vec3 color = vec3(0.0);
      int samples = 7;
      
      for(int i = 0; i < samples; i++) {
        float wavelength = float(i) / float(samples);
        vec2 offset = vec2(wavelength * 0.02 * u_intensity, 0.0);
        
        vec3 sample = texture2D(u_image, uv + offset).rgb;
        
        // Apply wavelength-based tinting
        vec3 tint = hsv2rgb(vec3(wavelength, 0.8, 1.0));
        color += sample * tint;
      }
      
      color /= float(samples);
      
      // Add rainbow spectrum overlay
      float spectrum = sin(prismAngle * 20.0) * 0.3;
      vec3 rainbow = hsv2rgb(vec3(prismAngle, 1.0, spectrum));
      color = mix(color, rainbow, 0.2 * u_intensity);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `};function m({className:v,variant:_="refraction",intensity:y=1,animated:E=!0,interactive:S=!0,backgroundColor:L="transparent"}){const u=c.useRef(null),p=c.useRef(null),g=c.useRef(null),x=c.useRef(0),b=c.useRef({x:0,y:0}),[T,d]=c.useState(!0),h=F(),R=E&&!h;c.useEffect(()=>{const e=u.current;if(!e)return;d(!0);const t=e.getContext("webgl")||e.getContext("experimental-webgl");if(!t){d(!1);return}p.current=t;const n=A(t,t.VERTEX_SHADER,k),r=A(t,t.FRAGMENT_SHADER,P[_]);if(!n||!r){d(!1);return}const o=G(t,n,r);if(!o){d(!1);return}return g.current=o,U(t,o),D(t),w(),()=>{x.current&&cancelAnimationFrame(x.current);try{t.getExtension("WEBGL_lose_context")?.loseContext()}catch{}p.current=null,g.current=null}},[_,R,y]),c.useEffect(()=>{if(!S||h||typeof window>"u")return;const e=t=>{const n=u.current;if(!n)return;const r=n.getBoundingClientRect();b.current={x:t.clientX-r.left,y:t.clientY-r.top}};return window.addEventListener("mousemove",e,{passive:!0}),()=>window.removeEventListener("mousemove",e)},[S,h]);function A(e,t,n){const r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null}function G(e,t,n){const r=e.createProgram();return r?(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),e.getProgramParameter(r,e.LINK_STATUS)?r:(e.deleteProgram(r),null)):null}function U(e,t){const n=new Float32Array([-1,-1,1,-1,-1,1,1,1]),r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,n,e.STATIC_DRAW);const o=e.getAttribLocation(t,"a_position");e.enableVertexAttribArray(o),e.vertexAttribPointer(o,2,e.FLOAT,!1,0,0);const i=new Float32Array([0,1,1,1,0,0,1,0]),s=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,s),e.bufferData(e.ARRAY_BUFFER,i,e.STATIC_DRAW);const l=e.getAttribLocation(t,"a_texCoord");e.enableVertexAttribArray(l),e.vertexAttribPointer(l,2,e.FLOAT,!1,0,0)}function D(e){const t=e.createTexture();e.bindTexture(e.TEXTURE_2D,t);const n=256,r=256,o=new Uint8Array(n*r*4);for(let i=0;i<r;i++)for(let s=0;s<n;s++){const l=(i*n+s)*4;o[l]=s/n*255,o[l+1]=i/r*255,o[l+2]=128,o[l+3]=255}e.texImage2D(e.TEXTURE_2D,0,e.RGBA,n,r,0,e.RGBA,e.UNSIGNED_BYTE,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR)}function w(){const e=p.current,t=g.current,n=u.current;if(!e||!t||!n)return;e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.useProgram(t);const r=e.getUniformLocation(t,"u_resolution");e.uniform2f(r,n.width,n.height);const o=e.getUniformLocation(t,"u_mouse");e.uniform2f(o,b.current.x,b.current.y);const i=e.getUniformLocation(t,"u_time");e.uniform1f(i,performance.now()/1e3);const s=e.getUniformLocation(t,"u_intensity");e.uniform1f(s,y),e.drawArrays(e.TRIANGLE_STRIP,0,4),R&&typeof requestAnimationFrame=="function"&&(x.current=requestAnimationFrame(w))}return T?a.jsx("div",{className:C("relative overflow-hidden",v),style:{backgroundColor:L},children:a.jsx("canvas",{ref:u,className:"glass-absolute glass-inset-0 glass-w-full glass-h-full glass-pointer-events-none",width:800,height:600,"aria-hidden":"true"})}):a.jsx("div",{"data-glass-component":!0,className:C("OptimizedGlass intensity={0.2} glassBlur={6} glass-p-4",v),role:"status",children:a.jsx("p",{className:"glass-text-secondary",children:"WebGL not supported"})})}try{m.displayName="GlassWebGLShader",m.__docgenInfo={description:"",displayName:"GlassWebGLShader",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},variant:{defaultValue:{value:"refraction"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"frosted"'},{value:'"refraction"'},{value:'"dispersion"'},{value:'"crystal"'},{value:'"prism"'}]}},intensity:{defaultValue:{value:"1"},description:"",name:"intensity",required:!1,type:{name:"number | undefined"}},animated:{defaultValue:{value:"true"},description:"",name:"animated",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:{value:"true"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},backgroundColor:{defaultValue:{value:"transparent"},description:"",name:"backgroundColor",required:!1,type:{name:"string | undefined"}}}}}catch{}const B=Object.freeze(Object.defineProperty({__proto__:null,GlassWebGLShader:m},Symbol.toStringTag,{value:"Module"})),N="GlassWebGLShader",I=B[N],W={title:"Effects + Advanced/Glass Web GLShader",component:I,parameters:{layout:"centered",docs:{description:{component:"Component-owned Storybook coverage for GlassWebGLShader. This story renders the certified AuraGlass sample used by the full visual certification suite."}}}},f={parameters:{previewSurface:"media"},render:()=>a.jsxs("div",{style:{position:"relative",boxSizing:"border-box",width:"100%",maxWidth:800,height:"clamp(320px, 58vh, 450px)",overflow:"hidden",borderRadius:20,border:"1px solid rgba(255, 255, 255, 0.28)",background:"linear-gradient(135deg, rgba(15, 23, 42, 0.68) 0%, rgba(22, 78, 99, 0.7) 42%, rgba(76, 29, 149, 0.68) 100%)",backdropFilter:"blur(22px)",boxShadow:"0 28px 72px rgba(15, 23, 42, 0.4)"},children:[a.jsx(m,{className:"glass-absolute glass-inset-0",variant:"prism",intensity:.72,animated:!0,interactive:!1,backgroundColor:"transparent"}),a.jsx("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,background:"linear-gradient(120deg, rgba(255, 255, 255, 0.18), transparent 38%, rgba(255, 255, 255, 0.12) 68%, transparent)",pointerEvents:"none",mixBlendMode:"screen"}}),a.jsx("div",{style:{position:"relative",zIndex:1,display:"grid",boxSizing:"border-box",height:"100%",alignContent:"end",padding:"clamp(20px, 4vw, 34px)",color:"#f8fafc"},children:a.jsxs("div",{style:{width:"min(440px, 100%)",padding:"clamp(16px, 3vw, 22px)",borderRadius:16,color:"#f8fafc",background:"rgba(15, 23, 42, 0.70)",border:"1px solid rgba(255, 255, 255, 0.24)",backdropFilter:"blur(18px)"},children:[a.jsx("div",{style:{fontSize:13,fontWeight:700,color:"#e2e8f0"},children:"GPU GLASS SHADER"}),a.jsx("h3",{style:{margin:"8px 0 6px",fontSize:"clamp(22px, 5vw, 28px)",lineHeight:1.12,color:"#f8fafc"},children:"Prism Refraction Preview"}),a.jsx("p",{style:{margin:0,fontSize:15,lineHeight:1.55,color:"#f8fafc"},children:"The WebGL canvas now fills a framed scene, giving Storybook a nonblank render target for shader and fallback inspection."})]})})]})};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  parameters: {
    previewSurface: "media"
  },
  render: () => <div style={{
    position: "relative",
    boxSizing: "border-box",
    width: "100%",
    maxWidth: 800,
    height: "clamp(320px, 58vh, 450px)",
    overflow: "hidden",
    borderRadius: 20,
    border: "1px solid rgba(255, 255, 255, 0.28)",
    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.68) 0%, rgba(22, 78, 99, 0.7) 42%, rgba(76, 29, 149, 0.68) 100%)",
    backdropFilter: "blur(22px)",
    boxShadow: "0 28px 72px rgba(15, 23, 42, 0.4)"
  }}>
      <GlassWebGLShader className="glass-absolute glass-inset-0" variant="prism" intensity={0.72} animated interactive={false} backgroundColor="transparent" />
      <div aria-hidden="true" style={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(120deg, rgba(255, 255, 255, 0.18), transparent 38%, rgba(255, 255, 255, 0.12) 68%, transparent)",
      pointerEvents: "none",
      mixBlendMode: "screen"
    }} />
      <div style={{
      position: "relative",
      zIndex: 1,
      display: "grid",
      boxSizing: "border-box",
      height: "100%",
      alignContent: "end",
      padding: "clamp(20px, 4vw, 34px)",
      color: "#f8fafc"
    }}>
        <div style={{
        width: "min(440px, 100%)",
        padding: "clamp(16px, 3vw, 22px)",
        borderRadius: 16,
        color: "#f8fafc",
        background: "rgba(15, 23, 42, 0.70)",
        border: "1px solid rgba(255, 255, 255, 0.24)",
        backdropFilter: "blur(18px)"
      }}>
          <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#e2e8f0"
        }}>
            GPU GLASS SHADER
          </div>
          <h3 style={{
          margin: "8px 0 6px",
          fontSize: "clamp(22px, 5vw, 28px)",
          lineHeight: 1.12,
          color: "#f8fafc"
        }}>
            Prism Refraction Preview
          </h3>
          <p style={{
          margin: 0,
          fontSize: 15,
          lineHeight: 1.55,
          color: "#f8fafc"
        }}>
            The WebGL canvas now fills a framed scene, giving Storybook a
            nonblank render target for shader and fallback inspection.
          </p>
        </div>
      </div>
    </div>
}`,...f.parameters?.docs?.source}}};const j=["Default"];export{f as Default,j as __namedExportsOrder,W as default};
