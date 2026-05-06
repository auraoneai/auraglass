import{j as s,r}from"./iframe-BEVTBSqr.js";import{a as y,u as v}from"./GlassCollaborationProvider-BfBASLNx.js";import{G as f}from"./GlassCollaborativeCursor-DcaSBcu-.js";import{G as b,b as j}from"./GlassCollaborativeComments-CCny7ut9.js";import{G as x}from"./GlassCore-B8gD0Gsp.js";import"./preload-helper-PPVm8Dsz.js";const A={title:"Collaboration/GlassCollaboration",parameters:{layout:"fullscreen",docs:{description:{component:"Complete real-time collaboration system with live cursors, comments, user presence, and activity tracking - like Google Docs, Figma, or Miro."}}}},N=({user:a})=>{const{setCurrentUser:e}=v();return r.useEffect(()=>{a&&e(a)},[a,e]),null},t=({roomId:a,currentUser:e,showCursors:i=!0,showComments:l=!0,showDashboard:h=!0})=>{const[d,u]=r.useState(e||null);return r.useEffect(()=>{if(!d){const p={id:`user-${Date.now()}`,name:"Demo User",email:"demo@example.com",color:"var(--glass-color-primary)",lastActive:Date.now()};u(p)}},[d]),r.useEffect(()=>{e&&u(e)},[e]),s.jsx(y,{roomId:a,enableRealTime:!0,children:s.jsxs("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-white glass-gradient-primary glass-relative",children:[s.jsx("div",{className:"glass-relative glass-z-10 glass-p-8",children:s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-secondary glass-mb-4",children:"Real-Time Collaboration Demo"}),s.jsx("p",{className:"glass-text-lg glass-text-secondary mb-8",children:"Experience the future of collaborative work with live cursors, comments, and real-time activity tracking."}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 lg:glass-glass-grid-cols-2 glass-gap-8",children:[s.jsxs(x,{className:"glass-relative glass-p-8 glass-min-glass-h-96",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-semibold glass-text-secondary glass-mb-4",children:"Interactive Workspace"}),s.jsx("p",{className:"glass-text-secondary mb-6",children:"Double-click anywhere to add comments. Move your cursor to see live collaboration in action."}),s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{className:"glass-p-4 glass-surface-subtle glass-radius-lg",children:[s.jsx("h3",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Project Overview"}),s.jsx("p",{className:"glass-text-primary glass-text-sm",children:"This is a sample content area where you can add comments and see other users' cursors. Try double-clicking on different parts of this text to leave comments."})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle glass-radius-lg",children:[s.jsx("h3",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Features Implemented"}),s.jsxs("ul",{className:"glass-text-primary glass-text-sm space-y-1",children:[s.jsx("li",{children:"• Real-time cursor tracking"}),s.jsx("li",{children:"• Collaborative commenting system"}),s.jsx("li",{children:"• User presence indicators"}),s.jsx("li",{children:"• Activity feed and history"}),s.jsx("li",{children:"• Live connection status"})]})]}),s.jsxs("div",{className:"glass-p-4 glass-surface-subtle glass-radius-lg",children:[s.jsx("h3",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Try It Out"}),s.jsx("p",{className:"glass-text-primary glass-text-sm",children:"Watch as simulated users join the session and move their cursors around. You can interact with their comments and see live activity updates."})]})]}),l&&s.jsx(b,{className:"glass-absolute glass-inset-0",allowComments:!0})]}),s.jsxs("div",{className:"space-y-6",children:[s.jsxs(x,{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-secondary glass-mb-4",children:"🚀 Collaboration Features"}),s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{className:"glass-flex glass-items-start glass-gap-3",children:[s.jsx("div",{className:"glass-w-8 glass-h-8 glass-surface-subtle glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-sm",children:"👆"}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-text-secondary",children:"Live Cursors"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"See where other users are working in real-time"})]})]}),s.jsxs("div",{className:"glass-flex glass-items-start glass-gap-3",children:[s.jsx("div",{className:"glass-w-8 glass-h-8 glass-surface-subtle glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-sm",children:"💬"}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-text-secondary",children:"Smart Comments"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Add contextual comments with replies and resolution"})]})]}),s.jsxs("div",{className:"glass-flex glass-items-start glass-gap-3",children:[s.jsx("div",{className:"glass-w-8 glass-h-8 glass-surface-subtle glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-sm",children:"👥"}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-text-secondary",children:"User Presence"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"See who's online and their activity status"})]})]}),s.jsxs("div",{className:"glass-flex glass-items-start glass-gap-3",children:[s.jsx("div",{className:"glass-w-8 glass-h-8 glass-surface-subtle glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-sm",children:"📊"}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-text-secondary",children:"Activity Feed"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Track all collaboration events and changes"})]})]})]})]}),s.jsxs(x,{className:"glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-secondary glass-mb-4",children:"💡 How to Use"}),s.jsxs("div",{className:"glass-space-y-3 glass-text-sm glass-text-secondary",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-w-5 glass-h-5 glass-surface-blue glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs",children:"1"}),s.jsx("span",{children:"Move your cursor around to see live tracking"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-w-5 glass-h-5 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs",children:"2"}),s.jsx("span",{children:"Double-click anywhere to add a comment"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-w-5 glass-h-5 glass-surface-green glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs",children:"3"}),s.jsx("span",{children:"Click comment dots to view and reply"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-w-5 glass-h-5 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs",children:"4"}),s.jsx("span",{children:"Watch the collaboration dashboard for activity"})]})]})]})]})]})]})}),i&&s.jsx(f,{}),h&&s.jsx(j,{position:"top-right",showUserList:!0,showActivityFeed:!0,showControls:!0}),s.jsx(N,{user:d})]})})},o={render:()=>s.jsx(t,{roomId:"demo-room-1",showCursors:!0,showComments:!0,showDashboard:!0}),parameters:{docs:{description:{story:"Complete collaboration demo with all features enabled. Watch as simulated users join and interact with the workspace."}}}},c={render:()=>s.jsx(t,{roomId:"cursors-demo",showCursors:!0,showComments:!1,showDashboard:!0}),parameters:{docs:{description:{story:"Demonstration focusing on real-time cursor tracking and user presence."}}}},n={render:()=>s.jsx(t,{roomId:"comments-demo",showCursors:!1,showComments:!0,showDashboard:!0}),parameters:{docs:{description:{story:"Demonstration focusing on the collaborative commenting system with replies and resolution."}}}},m={render:()=>{const[a,e]=r.useState(),i=[{id:"user-1",name:"Alice Johnson",email:"alice@company.com",color:"var(--glass-color-primary)",lastActive:Date.now()},{id:"user-2",name:"Bob Smith",email:"bob@company.com",color:"var(--glass-color-danger)",lastActive:Date.now()},{id:"user-3",name:"Carol Davis",email:"carol@company.com",color:"var(--glass-color-success)",lastActive:Date.now()}];return s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{className:"glass-surface-subtle glass-p-4 glass-radius-lg",children:[s.jsx("h3",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"Switch User Perspective"}),s.jsx("div",{className:"glass-flex glass-gap-2",children:i.map(l=>s.jsx("button",{onClick:()=>e(l),className:`px-3 py-2 rounded text-sm ${a?.id===l.id?"bg-blue-600 text-white":"bg-white text-blue-600 hover:bg-blue-100"}`,style:{borderColor:l.color},children:l.name},l.id))})]}),s.jsx(t,{roomId:"multi-user-demo",currentUser:a||i[0],showCursors:!0,showComments:!0,showDashboard:!0})]})},parameters:{docs:{description:{story:"Switch between different user perspectives to see how collaboration looks from each user's viewpoint."}}}},g={render:()=>s.jsxs("div",{className:"space-y-8",children:[s.jsxs("div",{className:"glass-text-center glass-py-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-xl",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-secondary glass-mb-4",children:"🤝 Real-Time Collaboration System"}),s.jsx("p",{className:"glass-text-lg glass-text-secondary max-w-3xl glass-mx-auto leading-relaxed",children:"Experience the next generation of collaborative interfaces with live cursors, contextual comments, user presence, and real-time activity tracking."}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-4 glass-gap-6 mt-8 max-w-4xl glass-mx-auto",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-w-12 glass-h-12 glass-surface-blue glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3",children:"👆"}),s.jsx("h3",{className:"glass-font-semibold",children:"Live Cursors"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mt-1",children:"See exactly where other users are working"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-w-12 glass-h-12 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3",children:"💬"}),s.jsx("h3",{className:"glass-font-semibold",children:"Smart Comments"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mt-1",children:"Contextual discussions with replies and resolution"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-w-12 glass-h-12 glass-surface-green glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3",children:"👥"}),s.jsx("h3",{className:"glass-font-semibold",children:"User Presence"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mt-1",children:"Real-time online status and activity indicators"})]}),s.jsxs("div",{className:"glass-text-center",children:[s.jsx("div",{className:"glass-w-12 glass-h-12 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3",children:"📊"}),s.jsx("h3",{className:"glass-font-semibold",children:"Activity Feed"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mt-1",children:"Complete history of all collaboration events"})]})]})]}),s.jsx(t,{roomId:"showcase-demo",showCursors:!0,showComments:!0,showDashboard:!0}),s.jsxs("div",{className:"glass-surface-subtle glass-border-l-4 glass-border-yellow glass-p-6 glass-radius-r-lg",children:[s.jsx("h3",{className:"glass-font-semibold glass-text-primary glass-mb-2",children:"🚀 Advanced Collaboration Features"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 glass-text-sm glass-text-primary",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-mb-2",children:"Real-Time Features:"}),s.jsxs("ul",{className:"space-y-1",children:[s.jsx("li",{children:"• Live cursor tracking with user identification"}),s.jsx("li",{children:"• Instant comment synchronization"}),s.jsx("li",{children:"• Real-time user presence indicators"}),s.jsx("li",{children:"• Connection status monitoring"}),s.jsx("li",{children:"• Activity feed with live updates"})]})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-mb-2",children:"Collaboration Tools:"}),s.jsxs("ul",{className:"space-y-1",children:[s.jsx("li",{children:"• Contextual commenting system"}),s.jsx("li",{children:"• Comment replies and resolution"}),s.jsx("li",{children:"• User avatars and color coding"}),s.jsx("li",{children:"• Expandable collaboration dashboard"}),s.jsx("li",{children:"• Toggle controls for all features"})]})]})]})]}),s.jsxs("div",{className:"glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-text-primary glass-p-8 glass-radius-xl",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-mb-4",children:"🎯 Perfect for Modern Applications"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6",children:[s.jsxs("div",{children:[s.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"Document Editing"}),s.jsxs("ul",{className:"glass-text-sm space-y-1 glass-opacity-90",children:[s.jsx("li",{children:"• Google Docs-style collaboration"}),s.jsx("li",{children:"• Real-time text editing"}),s.jsx("li",{children:"• Comment threads"}),s.jsx("li",{children:"• User presence awareness"})]})]}),s.jsxs("div",{children:[s.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"Design Tools"}),s.jsxs("ul",{className:"glass-text-sm space-y-1 glass-opacity-90",children:[s.jsx("li",{children:"• Figma-like cursor tracking"}),s.jsx("li",{children:"• Live design feedback"}),s.jsx("li",{children:"• Collaborative annotations"}),s.jsx("li",{children:"• Multi-user workspaces"})]})]}),s.jsxs("div",{children:[s.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"Project Management"}),s.jsxs("ul",{className:"glass-text-sm space-y-1 glass-opacity-90",children:[s.jsx("li",{children:"• Team activity monitoring"}),s.jsx("li",{children:"• Real-time discussions"}),s.jsx("li",{children:"• Progress tracking"}),s.jsx("li",{children:"• Instant notifications"})]})]})]})]})]}),parameters:{docs:{description:{story:"Complete showcase of the collaboration system with detailed feature explanations and use cases."}}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
    return <div className="glass-space-y-4">
        <div className="glass-surface-subtle glass-p-4 glass-radius-lg">
          <h3 className="glass-font-semibold glass-text-primary glass-mb-2">Switch User Perspective</h3>
          <div className="glass-flex glass-gap-2">
            {demoUsers.map(user => <button key={user.id} onClick={() => setSelectedUser(user)} className={\`px-3 py-2 rounded text-sm \${selectedUser?.id === user.id ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-100'}\`} style={{
            borderColor: user.color
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
}`,...m.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};const T=["FullDemo","CursorsOnly","CommentsOnly","MultipleUsers","CollaborationShowcase"];export{g as CollaborationShowcase,n as CommentsOnly,c as CursorsOnly,o as FullDemo,m as MultipleUsers,T as __namedExportsOrder,A as default};
