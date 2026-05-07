import{r as t,j as e,c as n}from"./iframe-B2YkWo0R.js";import{O as T}from"./OptimizedGlassCore-CYII0g9k.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-DmRU0S_3.js";const X={javascript:{keywords:/\b(const|let|var|function|return|if|else|for|while|do|switch|case|default|try|catch|finally|throw|new|class|extends|super|import|export|from|async|await|yield|typeof|instanceof|in|of)\b/g,strings:/(["'`])(.*?)\1/g,comments:/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,numbers:/\b\d+(\.\d+)?\b/g,functions:/\b\w+(?=\()/g},typescript:{keywords:/\b(const|let|var|function|return|if|else|for|while|do|switch|case|default|try|catch|finally|throw|new|class|extends|super|import|export|from|async|await|yield|typeof|instanceof|in|of|interface|type|enum|namespace|module)\b/g,strings:/(["'`])(.*?)\1/g,comments:/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,numbers:/\b\d+(\.\d+)?\b/g,types:/\b[A-Z]\w*\b/g},python:{keywords:/\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|lambda|and|or|not|in|is|None|True|False)\b/g,strings:/(["'`])(.*?)\1/g,comments:/(#.*$)/gm,numbers:/\b\d+(\.\d+)?\b/g,functions:/\b\w+(?=\()/g},css:{properties:/([a-z-]+)(?=\s*:)/g,values:/:(.+?);/g,selectors:/([.#]?[\w-]+)(?=\s*\{)/g,comments:/(\/\*[\s\S]*?\*\/)/g},json:{keys:/"([^"]+)":/g,strings:/"([^"]+)"/g,numbers:/\b\d+(\.\d+)?\b/g}},N=({value:l="",language:i="plaintext",readOnly:f=!1,placeholder:h="Enter your code here...",fontSize:x=14,lineNumbers:c=!0,minimap:o=!1,wordWrap:A=!0,tabSize:E=2,autoComplete:W=!1,theme:Y="dark",maxHeight:G="400px",minHeight:I="200px",className:P="",onChange:v,onFocus:V,onBlur:q,onMount:F})=>{const[L,S]=t.useState(l),[ee,_]=t.useState(!1),[R,O]=t.useState({line:1,column:1}),g=t.useRef(null),H=t.useRef(null),u=l!==void 0?l:L,z=t.useCallback(a=>{const s=a.target.value;S(s),v?.(s)},[v]),D=t.useCallback(()=>{_(!0),V?.()},[V]),$=t.useCallback(()=>{_(!1),q?.()},[q]),U=t.useCallback((a,s)=>{if(s==="plaintext")return a;const r=X[s];if(!r)return a;let d=a;return Object.entries(r).forEach(([m,p])=>{d=d.replace(p,(Q,...se)=>`<span class="${B(m)}">${Q}</span>`)}),d},[]),B=a=>({keywords:"glass-text-blue-400",strings:"glass-text-green-400",comments:"glass-text-secondary",numbers:"glass-text-purple-400",functions:"glass-text-yellow-400",types:"glass-text-cyan-400",properties:"glass-text-blue-300",values:"glass-text-green-300",selectors:"glass-text-orange-400",keys:"glass-text-blue-300"})[a]||"glass-text-primary",K=t.useCallback(a=>{if(a.key==="Tab"&&!f){a.preventDefault();const s=g.current;if(!s)return;const r=s.selectionStart,d=s.selectionEnd,m=" ".repeat(E),p=u.substring(0,r)+m+u.substring(d);S(p),v?.(p),setTimeout(()=>{s.selectionStart=s.selectionEnd=r+E},0)}},[u,E,f,v]),M=t.useCallback(()=>{const a=g.current;if(!a)return;const s=a.value,r=a.selectionStart;let d=1,m=1;for(let p=0;p<r;p++)s[p]===`
`?(d++,m=1):m++;O({line:d,column:m})},[]);t.useEffect(()=>{const a=g.current,s=H.current;if(!a||!s)return;const r=()=>{s.scrollTop=a.scrollTop,s.scrollLeft=a.scrollLeft};return a.addEventListener("scroll",r),()=>a.removeEventListener("scroll",r)},[]),t.useEffect(()=>{g.current&&F&&F(g.current)},[F]);const Z=U(u,i),J=u.split(`
`);return e.jsxs(T,{"data-glass-component":!0,className:n("glass-relative glass-overflow-hidden",P),style:{maxHeight:G,minHeight:I},blur:"medium",elevation:"level1",children:[e.jsxs("div",{className:n("glass-flex glass-items-center glass-justify-between glass-p-3 glass-border-b glass-border-white-10"),children:[e.jsxs("div",{className:n("glass-flex glass-items-center glass-gap-4"),children:[e.jsx("span",{className:n("glass-text-sm glass-text-primary-70 glass-font-medium"),children:i.toUpperCase()}),c&&e.jsxs("span",{className:n("glass-text-xs glass-text-primary-50"),children:["Ln ",R.line,", Col ",R.column]})]}),e.jsx("div",{className:n("glass-flex glass-items-center glass-gap-2"),children:!f&&e.jsxs(e.Fragment,{children:[e.jsx("button",{className:n("glass-px-2 glass-py-1 glass-text-xs glass-text-primary-70 glass-hover-text-primary glass-hover-surface-subtle glass-radius-md glass-transition-colors"),onClick:a=>{const s=g.current;s&&(s.value="",S(""),v?.(""))},children:"Clear"}),e.jsx("button",{className:n("glass-px-2 glass-py-1 glass-text-xs glass-text-primary-70 glass-hover-text-primary glass-hover-surface-subtle glass-radius-md glass-transition-colors"),onClick:a=>{navigator.clipboard?.writeText(u)},children:"Copy"})]})})]}),e.jsxs("div",{className:n("glass-relative"),children:[e.jsx("pre",{ref:H,className:n("glass-absolute glass-inset-0 glass-p-4 glass-font-mono glass-text-sm glass-overflow-auto glass-pointer-events-none glass-whitespace-pre-wrap glass-break-words",A?"glass-break-words":"glass-whitespace-pre"),style:{fontSize:x,lineHeight:"1.5"},children:e.jsx("code",{dangerouslySetInnerHTML:{__html:Z||h},className:n(u?"":"glass-text-primary-30")})}),c&&e.jsx("div",{className:n("glass-absolute glass-left-0 glass-top-0 glass-bottom-0 glass-w-12 glass-surface-black-20 glass-border-r glass-border-white-10 glass-p-4 glass-text-right glass-text-primary-50 glass-text-sm glass-font-mono glass-select-none"),children:J.map((a,s)=>e.jsx("div",{className:n("glass-leading-6"),children:s+1},s))}),e.jsx("textarea",{ref:g,value:u,onChange:z,onFocus:D,onBlur:$,onKeyDown:K,onSelect:M,onClick:M,readOnly:f,placeholder:h,className:n("glass-w-full glass-p-4 glass-font-mono glass-text-sm glass-bg-transparent glass-text-transparent glass-caret-white glass-outline-none glass-resize-none glass-overflow-auto",A?"glass-break-words":"glass-whitespace-pre",c?"glass-pl-16":""),style:{fontSize:x,lineHeight:"1.5",minHeight:"100%",height:"100%"},spellCheck:!1,autoComplete:W?"on":"off",autoCorrect:"off",autoCapitalize:"off"})]})]})},k=({files:l,onFileChange:i,className:f=""})=>{const[h,x]=t.useState(l[0]?.name||""),c=l.find(o=>o.name===h)||l[0];return e.jsxs("div",{className:n("glass-grid glass-grid-cols-4 glass-gap-4",f),children:[e.jsxs(T,{className:n("glass-col-span-1 glass-p-4"),blur:"medium",elevation:"level1",children:[e.jsx("h3",{className:n("glass-text-sm glass-font-semibold glass-text-primary glass-mb-4"),children:"Files"}),e.jsx("div",{className:n("glass-gap-2"),children:l.map(o=>e.jsx("button",{onClick:A=>x(o.name),className:n("glass-w-full glass-text-left glass-px-3 glass-py-2 glass-radius-md glass-text-sm glass-transition-colors",h===o.name?"glass-surface-elevated glass-text-primary":"glass-text-primary-70 glass-hover-text-primary glass-hover-surface-subtle"),children:o.name},o.name))})]}),e.jsx("div",{className:n("glass-col-span-3"),children:c&&e.jsx(N,{value:c.content,language:c.language,onChange:o=>i?.(c.name,o)})})]})};try{N.displayName="GlassCodeEditor",N.__docgenInfo={description:"",displayName:"GlassCodeEditor",props:{value:{defaultValue:{value:""},description:"Code content",name:"value",required:!1,type:{name:"string | undefined"}},language:{defaultValue:{value:"plaintext"},description:"Language for syntax highlighting",name:"language",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"html"'},{value:'"ruby"'},{value:'"plaintext"'},{value:'"go"'},{value:'"json"'},{value:'"javascript"'},{value:'"typescript"'},{value:'"python"'},{value:'"java"'},{value:'"cpp"'},{value:'"csharp"'},{value:'"rust"'},{value:'"php"'},{value:'"swift"'},{value:'"kotlin"'},{value:'"scala"'},{value:'"css"'},{value:'"xml"'},{value:'"yaml"'},{value:'"sql"'},{value:'"bash"'},{value:'"powershell"'},{value:'"dockerfile"'},{value:'"markdown"'}]}},readOnly:{defaultValue:{value:"false"},description:"Whether the editor is read-only",name:"readOnly",required:!1,type:{name:"boolean | undefined"}},placeholder:{defaultValue:{value:"Enter your code here..."},description:"Placeholder text when empty",name:"placeholder",required:!1,type:{name:"string | undefined"}},fontSize:{defaultValue:{value:"14"},description:"Font size",name:"fontSize",required:!1,type:{name:"number | undefined"}},lineNumbers:{defaultValue:{value:"true"},description:"Number of lines to show",name:"lineNumbers",required:!1,type:{name:"boolean | undefined"}},minimap:{defaultValue:{value:"false"},description:"Whether to show minimap",name:"minimap",required:!1,type:{name:"boolean | undefined"}},wordWrap:{defaultValue:{value:"true"},description:"Whether to enable word wrap",name:"wordWrap",required:!1,type:{name:"boolean | undefined"}},tabSize:{defaultValue:{value:"2"},description:"Tab size",name:"tabSize",required:!1,type:{name:"number | undefined"}},autoComplete:{defaultValue:{value:"false"},description:"Whether to enable auto-completion",name:"autoComplete",required:!1,type:{name:"boolean | undefined"}},theme:{defaultValue:{value:"dark"},description:"Theme for syntax highlighting",name:"theme",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"auto"'},{value:'"dark"'},{value:'"light"'}]}},maxHeight:{defaultValue:{value:"400px"},description:"Maximum height",name:"maxHeight",required:!1,type:{name:"string | undefined"}},minHeight:{defaultValue:{value:"200px"},description:"Minimum height",name:"minHeight",required:!1,type:{name:"string | undefined"}},className:{defaultValue:{value:""},description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}},onChange:{defaultValue:null,description:"Change handler",name:"onChange",required:!1,type:{name:"((value: string) => void) | undefined"}},onFocus:{defaultValue:null,description:"Focus handler",name:"onFocus",required:!1,type:{name:"(() => void) | undefined"}},onBlur:{defaultValue:null,description:"Blur handler",name:"onBlur",required:!1,type:{name:"(() => void) | undefined"}},onMount:{defaultValue:null,description:"Mount handler",name:"onMount",required:!1,type:{name:"((editor: HTMLTextAreaElement) => void) | undefined"}}}}}catch{}try{k.displayName="GlassCodeEditorWithFiles",k.__docgenInfo={description:"",displayName:"GlassCodeEditorWithFiles",props:{files:{defaultValue:null,description:"",name:"files",required:!0,type:{name:"{ name: string; content: string; language: Language; }[]"}},onFileChange:{defaultValue:null,description:"",name:"onFileChange",required:!1,type:{name:"((filename: string, content: string) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const oe={title:"Effects + Advanced/Glass Code Editor",component:N,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasscodeeditor component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"},value:{control:"text",description:"Code content"},language:{control:{type:"select"},options:["javascript","typescript","python","html","css","json"],description:"Programming language"},readOnly:{control:"boolean",description:"Read-only mode"},lineNumbers:{control:"boolean",description:"Show line numbers"}},args:{className:"",value:`function hello() {
  console.log("Hello, World!");
}`,language:"javascript",readOnly:!1,lineNumbers:!0}},y={args:{value:'console.log("Hello from GlassCodeEditor!");',language:"javascript"}},b={args:{value:`interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "Alice",
  age: 30
};`,language:"typescript",lineNumbers:!0}},j={args:{value:`const data = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" }
];`,language:"javascript",readOnly:!0,lineNumbers:!0}},w={render:l=>e.jsx(k,{files:[{name:"index.js",content:`console.log("Hello from index.js!");

function greet(name) {
  return \`Hello, \${name}!\`;
}`,language:"javascript"},{name:"styles.css",content:`.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}`,language:"css"},{name:"App.tsx",content:`import React from "react";

const App: React.FC = () => {
  return (
    <div className="container">
      <h1>Hello World</h1>
    </div>
  );
};

export default App;`,language:"typescript"}],onFileChange:(...i)=>console.log("Mock function called",...i)}),args:{}},C={render:l=>e.jsx(k,{files:[{name:"package.json",content:`{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}`,language:"json"},{name:"src/App.js",content:`import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My React App</h1>
      </header>
    </div>
  );
}

export default App;`,language:"javascript"},{name:"src/App.css",content:`.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}`,language:"css"},{name:"README.md",content:`# My Project

This is a sample React project with multiple files.

## Getting Started

1. Install dependencies: \`npm install\`
2. Start development server: \`npm start\``,language:"markdown"}],onFileChange:(...i)=>console.log("Mock function called",...i)}),args:{}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'console.log("Hello from GlassCodeEditor!");',
    language: 'javascript'
  }
}`,...y.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'interface User {\\n  name: string;\\n  age: number;\\n}\\n\\nconst user: User = {\\n  name: "Alice",\\n  age: 30\\n};',
    language: 'typescript',
    lineNumbers: true
  }
}`,...b.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'const data = [\\n  { id: 1, name: "Item 1" },\\n  { id: 2, name: "Item 2" }\\n];',
    language: 'javascript',
    readOnly: true,
    lineNumbers: true
  }
}`,...j.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => <GlassCodeEditorWithFiles files={[{
    name: 'index.js',
    content: 'console.log("Hello from index.js!");\\n\\nfunction greet(name) {\\n  return \`Hello, \${name}!\`;\\n}',
    language: 'javascript'
  }, {
    name: 'styles.css',
    content: '.container {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  min-height: 100vh;\\n}',
    language: 'css'
  }, {
    name: 'App.tsx',
    content: 'import React from "react";\\n\\nconst App: React.FC = () => {\\n  return (\\n    <div className="container">\\n      <h1>Hello World</h1>\\n    </div>\\n  );\\n};\\n\\nexport default App;',
    language: 'typescript'
  }]} onFileChange={(...args) => console.log('Mock function called', ...args)} />,
  args: {}
}`,...w.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <GlassCodeEditorWithFiles files={[{
    name: 'package.json',
    content: '{\\n  "name": "my-project",\\n  "version": "1.0.0",\\n  "scripts": {\\n    "start": "react-scripts start",\\n    "build": "react-scripts build"\\n  }\\n}',
    language: 'json'
  }, {
    name: 'src/App.js',
    content: 'import React from "react";\\nimport "./App.css";\\n\\nfunction App() {\\n  return (\\n    <div className="App">\\n      <header className="App-header">\\n        <h1>My React App</h1>\\n      </header>\\n    </div>\\n  );\\n}\\n\\nexport default App;',
    language: 'javascript'
  }, {
    name: 'src/App.css',
    content: '.App {\\n  text-align: center;\\n}\\n\\n.App-header {\\n  background-color: #282c34;\\n  min-height: 100vh;\\n  display: flex;\\n  flex-direction: column;\\n  align-items: center;\\n  justify-content: center;\\n  color: white;\\n}',
    language: 'css'
  }, {
    name: 'README.md',
    content: '# My Project\\n\\nThis is a sample React project with multiple files.\\n\\n## Getting Started\\n\\n1. Install dependencies: \`npm install\`\\n2. Start development server: \`npm start\`',
    language: 'markdown'
  }]} onFileChange={(...args) => console.log('Mock function called', ...args)} />,
  args: {}
}`,...C.parameters?.docs?.source}}};const ie=["Default","TypeScriptExample","ReadOnlyExample","WithFiles","MultiFileProject"];export{y as Default,C as MultiFileProject,j as ReadOnlyExample,b as TypeScriptExample,w as WithFiles,ie as __namedExportsOrder,oe as default};
