import{j as s,r}from"./iframe-BJUPYBdj.js";import{C as b,u as f}from"./GlassCollaborationProvider-CBVF7qzi.js";import{G as y}from"./GlassCollaborativeCursor-BZSk6b49.js";import{G as v}from"./GlassCollaborativeComments-CX0uOHoq.js";import{G as j}from"./GlassCollaborationDashboard-CeB-_i-1.js";import{G as u}from"./GlassCore-Dr0igKnK.js";import"./preload-helper-PPVm8Dsz.js";const I={title:"Workflows/Glass Collaboration",decorators:[e=>s.jsx(w,{children:s.jsx(e,{})})],parameters:{layout:"fullscreen",previewSurface:"app",docs:{description:{component:"Complete real-time collaboration system with live cursors, comments, user presence, and activity tracking - like Google Docs, Figma, or Miro."}}}},w=({children:e})=>s.jsx("div",{className:"glass-collaboration-story-frame",style:{width:"100%",height:"100dvh",maxHeight:"100vh",minHeight:0,minWidth:0,boxSizing:"border-box",overflowX:"hidden",overflowY:"auto",color:"inherit"},children:e}),N=({user:e})=>{const{setCurrentUser:l}=f();return r.useEffect(()=>{e&&l(e)},[e,l]),null},t=({roomId:e,currentUser:l,showCursors:i=!0,showComments:a=!0,showDashboard:h=!0})=>{const[m,x]=r.useState(l||null);return r.useEffect(()=>{if(!m){const p={id:`user-${Date.now()}`,name:"Demo User",email:"demo@example.com",color:"var(--glass-color-primary)",lastActive:Date.now()};x(p)}},[m]),r.useEffect(()=>{l&&x(l)},[l]),s.jsx(b,{roomId:e,enableRealTime:!0,children:s.jsxs("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-white glass-gradient-primary glass-relative",children:[s.jsx("div",{className:"glass-relative glass-z-10 glass-p-8",children:s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-secondary glass-mb-4",children:"Real-Time Collaboration Demo"}),s.jsx("p",{className:"glass-text-lg glass-text-secondary mb-8",children:"Experience the future of collaborative work with live cursors, comments, and real-time activity tracking."}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 lg:glass-glass-grid-cols-2 glass-gap-8",children:[s.jsxs(u,{className:"glass-relative glass-p-8 glass-min-glass-h-96",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-semibold glass-text-secondary glass-mb-4",children:"Interactive Workspace"}),s.jsx("p",{className:"glass-text-secondary mb-6",children:"Double-click anywhere to add comments. Move your cursor to see live collaboration in action."}),s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{className:"glass-p-4 glass-surface-subtle glass-radius-lg",children:[s.jsx("h3",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Project Overview"}),s.jsx("p",{className:"glass-text-primary glass-text-sm",children:"This is a sample content area where you can add comments and see other users' cursors. Try double-clicking on different parts of this text to leave comments."})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle glass-radius-lg",children:[s.jsx("h3",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Features Implemented"}),s.jsxs("ul",{className:"glass-text-primary glass-text-sm space-y-1",children:[s.jsx("li",{children:"• Real-time cursor tracking"}),s.jsx("li",{children:"• Collaborative commenting system"}),s.jsx("li",{children:"• User presence indicators"}),s.jsx("li",{children:"• Activity feed and history"}),s.jsx("li",{children:"• Live connection status"})]})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle glass-radius-lg",children:[s.jsx("h3",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Try It Out"}),s.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Watch as simulated users join the session and move their cursors around. You can interact with their comments and see live activity updates."})]})]}),a&&s.jsx(v,{className:"glass-absolute glass-inset-0",allowComments:!0})]}),s.jsxs("div",{className:"space-y-6",children:[s.jsxs(u,{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-secondary glass-mb-4",children:"🚀 Collaboration Features"}),s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{className:"glass-flex glass-items-start glass-gap-3",children:[s.jsx("div",{className:"glass-w-8 glass-h-8 glass-surface-subtle glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-sm",children:"👆"}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-text-secondary",children:"Live Cursors"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"See where other users are working in real-time"})]})]}),s.jsxs("div",{className:"glass-flex glass-items-start glass-gap-3",children:[s.jsx("div",{className:"glass-w-8 glass-h-8 glass-surface-subtle glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-sm",children:"💬"}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-text-secondary",children:"Smart Comments"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Add contextual comments with replies and resolution"})]})]}),s.jsxs("div",{className:"glass-flex glass-items-start glass-gap-3",children:[s.jsx("div",{className:"glass-w-8 glass-h-8 glass-surface-subtle glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-sm",children:"👥"}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-text-secondary",children:"User Presence"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"See who's online and their activity status"})]})]}),s.jsxs("div",{className:"glass-flex glass-items-start glass-gap-3",children:[s.jsx("div",{className:"glass-w-8 glass-h-8 glass-surface-subtle glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-sm",children:"📊"}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-text-secondary",children:"Activity Feed"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Track all collaboration events and changes"})]})]})]})]}),s.jsxs(u,{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-secondary glass-mb-4",children:"💡 How to Use"}),s.jsxs("div",{className:"glass-space-y-3 glass-text-sm glass-text-secondary",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-w-5 glass-h-5 glass-surface-blue glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs",children:"1"}),s.jsx("span",{children:"Move your cursor around to see live tracking"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-w-5 glass-h-5 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs",children:"2"}),s.jsx("span",{children:"Double-click anywhere to add a comment"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-w-5 glass-h-5 glass-surface-green glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs",children:"3"}),s.jsx("span",{children:"Click comment dots to view and reply"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-w-5 glass-h-5 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs",children:"4"}),s.jsx("span",{children:"Watch the collaboration dashboard for activity"})]})]})]})]})]})]})}),i&&s.jsx(y,{}),h&&s.jsx(j,{position:"top-right",showUserList:!0,showActivityFeed:!0,showControls:!0}),s.jsx(N,{user:m})]})})},o={render:()=>s.jsx(t,{roomId:"demo-room-1",showCursors:!0,showComments:!0,showDashboard:!0}),parameters:{docs:{description:{story:"Complete collaboration demo with all features enabled. Watch as simulated users join and interact with the workspace."}}}},c={render:()=>s.jsx(t,{roomId:"cursors-demo",showCursors:!0,showComments:!1,showDashboard:!0}),parameters:{docs:{description:{story:"Demonstration focusing on real-time cursor tracking and user presence."}}}},n={render:()=>s.jsx(t,{roomId:"comments-demo",showCursors:!1,showComments:!0,showDashboard:!0}),parameters:{docs:{description:{story:"Demonstration focusing on the collaborative commenting system with replies and resolution."}}}},g={render:()=>{const[e,l]=r.useState(),i=[{id:"user-1",name:"Alice Johnson",email:"alice@company.com",color:"var(--glass-color-primary)",lastActive:Date.now()},{id:"user-2",name:"Bob Smith",email:"bob@company.com",color:"var(--glass-color-danger)",lastActive:Date.now()},{id:"user-3",name:"Carol Davis",email:"carol@company.com",color:"var(--glass-color-success)",lastActive:Date.now()}];return s.jsxs("div",{className:"glass-collaboration-multiple-users glass-space-y-4",style:{maxWidth:"100vw",overflowX:"hidden"},children:[s.jsxs("div",{className:"glass-collaboration-user-switch glass-surface-overlay glass-border glass-border-subtle glass-p-4 glass-radius-lg",style:{background:"rgba(255, 255, 255, 0.88)",borderColor:"rgba(15, 23, 42, 0.16)",color:"#0f172a"},children:[s.jsx("h3",{className:"glass-collaboration-user-switch-title glass-font-semibold glass-mb-2",style:{color:"#0f172a"},children:"Switch User Perspective"}),s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-2",children:i.map(a=>s.jsx("button",{onClick:()=>l(a),className:`glass-collaboration-user-switch-button glass-px-3 glass-py-2 glass-radius-lg glass-text-sm glass-font-medium glass-focus glass-touch-target glass-contrast-guard ${e?.id===a.id?"is-selected":""}`,style:{appearance:"none",WebkitAppearance:"none",border:`1px solid ${a.color}`,background:e?.id===a.id?"linear-gradient(135deg, rgba(29, 78, 216, 0.95), rgba(13, 148, 136, 0.95))":"rgba(255,255,255,0.62)",color:e?.id===a.id?"#fff":"#0f172a",boxShadow:e?.id===a.id?"0 8px 22px rgba(37,99,235,0.22)":"inset 0 1px 0 rgba(255,255,255,0.72)"},children:a.name},a.id))})]}),s.jsx(t,{roomId:"multi-user-demo",currentUser:e||i[0],showCursors:!0,showComments:!0,showDashboard:!0})]})},parameters:{docs:{description:{story:"Switch between different user perspectives to see how collaboration looks from each user's viewpoint."}}}},d={render:()=>s.jsxs("div",{className:"space-y-8",children:[s.jsxs("div",{className:"glass-text-center glass-py-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-xl",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-secondary glass-mb-4",children:"🤝 Real-Time Collaboration System"}),s.jsx("p",{className:"glass-text-lg glass-text-secondary max-w-3xl glass-mx-auto leading-relaxed",children:"Experience the next generation of collaborative interfaces with live cursors, contextual comments, user presence, and real-time activity tracking."}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-4 glass-gap-6 mt-8 max-w-4xl glass-mx-auto",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-w-12 glass-h-12 glass-surface-blue glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3",children:"👆"}),s.jsx("h3",{className:"glass-font-semibold",children:"Live Cursors"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mt-1",children:"See exactly where other users are working"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-w-12 glass-h-12 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3",children:"💬"}),s.jsx("h3",{className:"glass-font-semibold",children:"Smart Comments"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mt-1",children:"Contextual discussions with replies and resolution"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-w-12 glass-h-12 glass-surface-green glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3",children:"👥"}),s.jsx("h3",{className:"glass-font-semibold",children:"User Presence"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mt-1",children:"Real-time online status and activity indicators"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-w-12 glass-h-12 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3",children:"📊"}),s.jsx("h3",{className:"glass-font-semibold",children:"Activity Feed"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mt-1",children:"Complete history of all collaboration events"})]})]})]}),s.jsx(t,{roomId:"showcase-demo",showCursors:!0,showComments:!0,showDashboard:!0}),s.jsxs("div",{className:"glass-surface-subtle glass-border-l-4 glass-border-yellow glass-p-6 glass-radius-r-lg",children:[s.jsx("h3",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"🚀 Advanced Collaboration Features"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 glass-text-sm glass-text-primary",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-mb-2",children:"Real-Time Features:"}),s.jsxs("ul",{className:"space-y-1",children:[s.jsx("li",{children:"• Live cursor tracking with user identification"}),s.jsx("li",{children:"• Instant comment synchronization"}),s.jsx("li",{children:"• Real-time user presence indicators"}),s.jsx("li",{children:"• Connection status monitoring"}),s.jsx("li",{children:"• Activity feed with live updates"})]})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-mb-2",children:"Collaboration Tools:"}),s.jsxs("ul",{className:"space-y-1",children:[s.jsx("li",{children:"• Contextual commenting system"}),s.jsx("li",{children:"• Comment replies and resolution"}),s.jsx("li",{children:"• User avatars and color coding"}),s.jsx("li",{children:"• Expandable collaboration dashboard"}),s.jsx("li",{children:"• Toggle controls for all features"})]})]})]})]}),s.jsxs("div",{className:"glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-text-primary glass-p-8 glass-radius-xl",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-mb-4",children:"🎯 Perfect for Modern Applications"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6",children:[s.jsxs("div",{children:[s.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"Document Editing"}),s.jsxs("ul",{className:"glass-text-sm space-y-1 glass-opacity-90",children:[s.jsx("li",{children:"• Google Docs-style collaboration"}),s.jsx("li",{children:"• Real-time text editing"}),s.jsx("li",{children:"• Comment threads"}),s.jsx("li",{children:"• User presence awareness"})]})]}),s.jsxs("div",{children:[s.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"Design Tools"}),s.jsxs("ul",{className:"glass-text-sm space-y-1 glass-opacity-90",children:[s.jsx("li",{children:"• Figma-like cursor tracking"}),s.jsx("li",{children:"• Live design feedback"}),s.jsx("li",{children:"• Collaborative annotations"}),s.jsx("li",{children:"• Multi-user workspaces"})]})]}),s.jsxs("div",{children:[s.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"Project Management"}),s.jsxs("ul",{className:"glass-text-sm space-y-1 glass-opacity-90",children:[s.jsx("li",{children:"• Team activity monitoring"}),s.jsx("li",{children:"• Real-time discussions"}),s.jsx("li",{children:"• Progress tracking"}),s.jsx("li",{children:"• Instant notifications"})]})]})]})]})]}),parameters:{docs:{description:{story:"Complete showcase of the collaboration system with detailed feature explanations and use cases."}}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <CollaborationDemo roomId="demo-room-1" showCursors={true} showComments={true} showDashboard={true} />,
  parameters: {
    docs: {
      description: {
        story: 'Complete collaboration demo with all features enabled. Watch as simulated users join and interact with the workspace.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <CollaborationDemo roomId="cursors-demo" showCursors={true} showComments={false} showDashboard={true} />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstration focusing on real-time cursor tracking and user presence.'
      }
    }
  }
}`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <CollaborationDemo roomId="comments-demo" showCursors={false} showComments={true} showDashboard={true} />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstration focusing on the collaborative commenting system with replies and resolution.'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selectedUser, setSelectedUser] = useState<CollaborationUser>();
    const demoUsers: CollaborationUser[] = [{
      id: 'user-1',
      name: 'Alice Johnson',
      email: 'alice@company.com',
      color: 'var(--glass-color-primary)',
      lastActive: Date.now()
    }, {
      id: 'user-2',
      name: 'Bob Smith',
      email: 'bob@company.com',
      color: 'var(--glass-color-danger)',
      lastActive: Date.now()
    }, {
      id: 'user-3',
      name: 'Carol Davis',
      email: 'carol@company.com',
      color: 'var(--glass-color-success)',
      lastActive: Date.now()
    }];
    return <div className="glass-collaboration-multiple-users glass-space-y-4" style={{
      maxWidth: "100vw",
      overflowX: "hidden"
    }}>
        <div className="glass-collaboration-user-switch glass-surface-overlay glass-border glass-border-subtle glass-p-4 glass-radius-lg" style={{
        background: "rgba(255, 255, 255, 0.88)",
        borderColor: "rgba(15, 23, 42, 0.16)",
        color: "#0f172a"
      }}>
          <h3 className="glass-collaboration-user-switch-title glass-font-semibold glass-mb-2" style={{
          color: "#0f172a"
        }}>
            Switch User Perspective
          </h3>
          <div className="glass-flex glass-flex-wrap glass-gap-2">
            {demoUsers.map(user => <button key={user.id} onClick={() => setSelectedUser(user)} className={\`glass-collaboration-user-switch-button glass-px-3 glass-py-2 glass-radius-lg glass-text-sm glass-font-medium glass-focus glass-touch-target glass-contrast-guard \${selectedUser?.id === user.id ? "is-selected" : ""}\`} style={{
            appearance: "none",
            WebkitAppearance: "none",
            border: \`1px solid \${user.color}\`,
            background: selectedUser?.id === user.id ? "linear-gradient(135deg, rgba(29, 78, 216, 0.95), rgba(13, 148, 136, 0.95))" : "rgba(255,255,255,0.62)",
            color: selectedUser?.id === user.id ? "#fff" : "#0f172a",
            boxShadow: selectedUser?.id === user.id ? "0 8px 22px rgba(37,99,235,0.22)" : "inset 0 1px 0 rgba(255,255,255,0.72)"
          }}>
                {user.name}
              </button>)}
          </div>
        </div>

        <CollaborationDemo roomId="multi-user-demo" currentUser={selectedUser || demoUsers[0]} showCursors={true} showComments={true} showDashboard={true} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Switch between different user perspectives to see how collaboration looks from each user\\'s viewpoint.'
      }
    }
  }
}`,...g.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    return <div className="space-y-8">
        {/* Header */}
        <div className="glass-text-center glass-py-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-xl">
          <h1 className="glass-text-3xl glass-font-bold glass-text-secondary glass-mb-4">🤝 Real-Time Collaboration System</h1>
          <p className="glass-text-lg glass-text-secondary max-w-3xl glass-mx-auto leading-relaxed">
            Experience the next generation of collaborative interfaces with live cursors, 
            contextual comments, user presence, and real-time activity tracking.
          </p>
          
          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-4 glass-gap-6 mt-8 max-w-4xl glass-mx-auto">
            <div className="glass-text-center">
              <div className="glass-w-12 glass-h-12 glass-surface-blue glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3">
                👆
              </div>
              <h3 className="glass-font-semibold">Live Cursors</h3>
              <p className="glass-text-sm glass-text-secondary mt-1">See exactly where other users are working</p>
            </div>
            <div className="glass-text-center">
              <div className="glass-w-12 glass-h-12 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3">
                💬
              </div>
              <h3 className="glass-font-semibold">Smart Comments</h3>
              <p className="glass-text-sm glass-text-secondary mt-1">Contextual discussions with replies and resolution</p>
            </div>
            <div className="glass-text-center">
              <div className="glass-w-12 glass-h-12 glass-surface-green glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3">
                👥
              </div>
              <h3 className="glass-font-semibold">User Presence</h3>
              <p className="glass-text-sm glass-text-secondary mt-1">Real-time online status and activity indicators</p>
            </div>
            <div className="glass-text-center">
              <div className="glass-w-12 glass-h-12 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3">
                📊
              </div>
              <h3 className="glass-font-semibold">Activity Feed</h3>
              <p className="glass-text-sm glass-text-secondary mt-1">Complete history of all collaboration events</p>
            </div>
          </div>
        </div>

        <CollaborationDemo roomId="showcase-demo" showCursors={true} showComments={true} showDashboard={true} />

        <div className="glass-surface-subtle glass-border-l-4 glass-border-yellow glass-p-6 glass-radius-r-lg">
          <h3 className="glass-font-semibold glass-text-primary glass-mb-2">🚀 Advanced Collaboration Features</h3>
          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 glass-text-sm glass-text-primary">
            <div>
              <h4 className="glass-font-medium glass-mb-2">Real-Time Features:</h4>
              <ul className="space-y-1">
                <li>• Live cursor tracking with user identification</li>
                <li>• Instant comment synchronization</li>
                <li>• Real-time user presence indicators</li>
                <li>• Connection status monitoring</li>
                <li>• Activity feed with live updates</li>
              </ul>
            </div>
            <div>
              <h4 className="glass-font-medium glass-mb-2">Collaboration Tools:</h4>
              <ul className="space-y-1">
                <li>• Contextual commenting system</li>
                <li>• Comment replies and resolution</li>
                <li>• User avatars and color coding</li>
                <li>• Expandable collaboration dashboard</li>
                <li>• Toggle controls for all features</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-text-primary glass-p-8 glass-radius-xl">
          <h2 className="glass-text-2xl glass-font-bold glass-mb-4">🎯 Perfect for Modern Applications</h2>
          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6">
            <div>
              <h3 className="glass-font-semibold glass-mb-2">Document Editing</h3>
              <ul className="glass-text-sm space-y-1 glass-opacity-90">
                <li>• Google Docs-style collaboration</li>
                <li>• Real-time text editing</li>
                <li>• Comment threads</li>
                <li>• User presence awareness</li>
              </ul>
            </div>
            <div>
              <h3 className="glass-font-semibold glass-mb-2">Design Tools</h3>
              <ul className="glass-text-sm space-y-1 glass-opacity-90">
                <li>• Figma-like cursor tracking</li>
                <li>• Live design feedback</li>
                <li>• Collaborative annotations</li>
                <li>• Multi-user workspaces</li>
              </ul>
            </div>
            <div>
              <h3 className="glass-font-semibold glass-mb-2">Project Management</h3>
              <ul className="glass-text-sm space-y-1 glass-opacity-90">
                <li>• Team activity monitoring</li>
                <li>• Real-time discussions</li>
                <li>• Progress tracking</li>
                <li>• Instant notifications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete showcase of the collaboration system with detailed feature explanations and use cases.'
      }
    }
  }
}`,...d.parameters?.docs?.source}}};const F=["FullDemo","CursorsOnly","CommentsOnly","MultipleUsers","CollaborationShowcase"];export{d as CollaborationShowcase,n as CommentsOnly,c as CursorsOnly,o as FullDemo,g as MultipleUsers,F as __namedExportsOrder,I as default};
