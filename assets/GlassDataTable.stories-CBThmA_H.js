import{j as a,d as p}from"./iframe-ChjdpTMc.js";import{G as s}from"./GlassDataTable-oeY7mymh.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassCore-CbIQyGSU.js";const f={title:"Workflows/Glass Data Table",component:s,parameters:{layout:"fullscreen",docs:{description:{component:"A comprehensive data table component with sorting, filtering, pagination, and loading states."}}}},b=`
  .ag-data-table-story {
    min-height: 100vh;
    width: 100%;
    overflow: auto;
    box-sizing: border-box;
    background:
      radial-gradient(circle at 16% 12%, rgba(59, 130, 246, 0.24), transparent 30%),
      radial-gradient(circle at 84% 18%, rgba(20, 184, 166, 0.22), transparent 28%),
      linear-gradient(135deg, #0f172a 0%, #1e293b 48%, #0f766e 100%);
    color: #f8fafc;
    padding: clamp(16px, 4vw, 32px);
  }

  .ag-data-table-story h1,
  .ag-data-table-story p,
  .ag-data-table-story .glass-text-secondary {
    color: #f8fafc;
  }

  .ag-data-table-story p {
    opacity: 0.92;
  }

  .ag-data-table-story .mb-6 {
    margin-bottom: 1.5rem;
  }

  .ag-data-table-story table {
    min-width: 760px;
  }

  .ag-data-table-story [data-glass-component] {
    flex-wrap: wrap;
    gap: 12px;
  }

  .ag-data-table-story button {
    color: #0f172a !important;
    background: rgba(255, 255, 255, 0.78) !important;
    border-color: rgba(15, 23, 42, 0.18) !important;
  }

  [data-storybook-preview-mode="dark"] .ag-data-table-story button {
    color: #f8fafc !important;
    background: rgba(15, 23, 42, 0.68) !important;
    border-color: rgba(226, 232, 240, 0.22) !important;
  }

  @media (max-width: 640px) {
    .ag-data-table-story table {
      min-width: 680px;
    }

    .ag-data-table-story [data-glass-component] {
      align-items: flex-start;
      justify-content: flex-start;
    }
  }
`,r=({children:e,maxWidth:t=1280})=>a.jsxs("div",{className:"ag-data-table-story glass-contrast-guard",children:[a.jsx("style",{children:b}),a.jsx("div",{style:{maxWidth:t,margin:"0 auto",minWidth:0},children:e})]}),g=[{id:1,name:"Alice Johnson",email:"alice@example.com",role:"Admin",status:"Active",joinDate:"2023-01-15",projects:12},{id:2,name:"Bob Smith",email:"bob@example.com",role:"Developer",status:"Active",joinDate:"2023-03-22",projects:8},{id:3,name:"Carol Brown",email:"carol@example.com",role:"Designer",status:"Inactive",joinDate:"2022-11-08",projects:15},{id:4,name:"David Wilson",email:"david@example.com",role:"Manager",status:"Active",joinDate:"2022-09-12",projects:23},{id:5,name:"Eva Davis",email:"eva@example.com",role:"Developer",status:"Active",joinDate:"2023-05-03",projects:6},{id:6,name:"Frank Miller",email:"frank@example.com",role:"Designer",status:"Active",joinDate:"2023-02-18",projects:11},{id:7,name:"Grace Lee",email:"grace@example.com",role:"Developer",status:"Inactive",joinDate:"2022-12-01",projects:9},{id:8,name:"Henry Taylor",email:"henry@example.com",role:"Admin",status:"Active",joinDate:"2022-10-15",projects:18},{id:9,name:"Iris Chen",email:"iris@example.com",role:"Manager",status:"Active",joinDate:"2023-04-07",projects:14},{id:10,name:"Jack Anderson",email:"jack@example.com",role:"Developer",status:"Active",joinDate:"2023-06-12",projects:4},{id:11,name:"Kate Wilson",email:"kate@example.com",role:"Designer",status:"Active",joinDate:"2023-01-28",projects:7},{id:12,name:"Liam Garcia",email:"liam@example.com",role:"Developer",status:"Inactive",joinDate:"2022-08-14",projects:13}],d=[{key:"name",label:"Name",sortable:!0,width:"200px",render:e=>a.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[a.jsx("div",{className:"glass-w-8 glass-h-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-primary glass-text-sm glass-font-medium",children:String(e).charAt(0)}),a.jsx("span",{className:"glass-font-medium",children:String(e)})]})},{key:"email",label:"Email",sortable:!0,render:e=>a.jsx("span",{className:"glass-text-primary hover:glass-text-primary",children:String(e)})},{key:"role",label:"Role",sortable:!0,render:e=>{const m={Admin:{background:"#fee2e2",color:"#991b1b"},Manager:{background:"#f3e8ff",color:"#6b21a8"},Developer:{background:"#dbeafe",color:"#1e40af"},Designer:{background:"#dcfce7",color:"#166534"}}[e]||{background:"#f3f4f6",color:"#1f2937"};return a.jsx("span",{className:"glass-radius-full glass-text-xs glass-font-medium",style:{...m,display:"inline-block",padding:"4px 8px"},children:String(e)})}},{key:"status",label:"Status",sortable:!0,render:e=>a.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[a.jsx("div",{className:"glass-radius-full",style:{width:8,height:8,background:e==="Active"?"#22c55e":"#9ca3af",flex:"0 0 auto"}}),a.jsx("span",{style:{color:e==="Active"?"#86efac":"#e5e7eb"},children:String(e)})]})},{key:"projects",label:"Projects",sortable:!0,render:e=>a.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[a.jsx("span",{className:"font-mono glass-text-sm",children:String(e)}),a.jsx("div",{className:"glass-w-16 glass-h-1 glass-surface-subtle glass-radius-full overflow-hidden",children:a.jsx("div",{className:`glass-h-full glass-surface-blue transition-all duration-[${p.DURATION.normal}ms]`,style:{width:`${Math.min(100,Number(e)/25*100)}%`}})})]})},{key:"joinDate",label:"Join Date",sortable:!0,render:e=>new Date(String(e)).toLocaleDateString()}],n={args:{data:g,columns:d,searchable:!0,paginated:!0,pageSize:8},render:e=>a.jsxs(r,{children:[a.jsxs("div",{className:"mb-6",children:[a.jsx("h1",{className:"glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2",children:"User Management"}),a.jsx("p",{className:"glass-text-secondary",children:"Manage your team members and their roles"})]}),a.jsx(s,{...e})]})},l={args:{data:[],columns:d,loading:!0,loadingRows:6},render:e=>a.jsxs(r,{children:[a.jsxs("div",{className:"mb-6",children:[a.jsx("h1",{className:"glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2",children:"Loading Data"}),a.jsx("p",{className:"glass-text-secondary",children:"Loading skeleton animation while data loads"})]}),a.jsx(s,{...e})]})},o={args:{data:[],columns:d,emptyMessage:"No users found. Try adjusting your search criteria."},render:e=>a.jsxs(r,{children:[a.jsxs("div",{className:"mb-6",children:[a.jsx("h1",{className:"glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2",children:"Empty State"}),a.jsx("p",{className:"glass-text-secondary",children:"How the table looks when there's no data"})]}),a.jsx(s,{...e})]})},i={args:{data:[{name:"Task 1",priority:"High",status:"In Progress",assignee:"Alice"},{name:"Task 2",priority:"Medium",status:"Completed",assignee:"Bob"},{name:"Task 3",priority:"Low",status:"Todo",assignee:"Carol"},{name:"Task 4",priority:"High",status:"In Progress",assignee:"David"}],columns:[{key:"name",label:"Task Name",sortable:!0},{key:"priority",label:"Priority",sortable:!0,render:e=>{const m={High:{background:"#fee2e2",color:"#991b1b"},Medium:{background:"#fef3c7",color:"#92400e"},Low:{background:"#dcfce7",color:"#166534"}}[e]||{background:"#f3f4f6",color:"#1f2937"};return a.jsx("span",{className:"glass-radius glass-text-sm",style:{...m,display:"inline-block",padding:"4px 8px"},children:String(e)})}},{key:"status",label:"Status",sortable:!0},{key:"assignee",label:"Assignee",sortable:!0}],searchable:!1,paginated:!1},render:e=>a.jsxs(r,{maxWidth:896,children:[a.jsxs("div",{className:"mb-6",children:[a.jsx("h1",{className:"glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2",children:"Simple Task List"}),a.jsx("p",{className:"glass-text-secondary",children:"Basic table without search or pagination"})]}),a.jsx(s,{...e})]})},c={args:{data:g.concat(g.map((e,t)=>({...e,id:e.id+100,name:e.name+" (Copy)",email:`copy${t+1}@example.com`}))),columns:d,searchable:!0,paginated:!0,pageSize:5},render:e=>a.jsxs(r,{children:[a.jsxs("div",{className:"mb-6",children:[a.jsx("h1",{className:"glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2",children:"Complete Data Table"}),a.jsx("p",{className:"glass-text-secondary",children:"All features enabled: search, sort, pagination with larger dataset"})]}),a.jsx(s,{...e})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    data: sampleUsers,
    columns: userColumns,
    searchable: true,
    paginated: true,
    pageSize: 8
  },
  render: args => <TableStoryFrame>
      <div className="mb-6">
        <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">
          User Management
        </h1>
        <p className="glass-text-secondary">
          Manage your team members and their roles
        </p>
      </div>
      <GlassDataTable {...args} />
    </TableStoryFrame>
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    data: [],
    columns: userColumns,
    loading: true,
    loadingRows: 6
  },
  render: args => <TableStoryFrame>
      <div className="mb-6">
        <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">
          Loading Data
        </h1>
        <p className="glass-text-secondary">
          Loading skeleton animation while data loads
        </p>
      </div>
      <GlassDataTable {...args} />
    </TableStoryFrame>
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    data: [],
    columns: userColumns,
    emptyMessage: "No users found. Try adjusting your search criteria."
  },
  render: args => <TableStoryFrame>
      <div className="mb-6">
        <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">
          Empty State
        </h1>
        <p className="glass-text-secondary">
          How the table looks when there's no data
        </p>
      </div>
      <GlassDataTable {...args} />
    </TableStoryFrame>
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    data: [{
      name: "Task 1",
      priority: "High",
      status: "In Progress",
      assignee: "Alice"
    }, {
      name: "Task 2",
      priority: "Medium",
      status: "Completed",
      assignee: "Bob"
    }, {
      name: "Task 3",
      priority: "Low",
      status: "Todo",
      assignee: "Carol"
    }, {
      name: "Task 4",
      priority: "High",
      status: "In Progress",
      assignee: "David"
    }],
    columns: [{
      key: "name",
      label: "Task Name",
      sortable: true
    }, {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (value: any) => {
        const colors = {
          High: {
            background: "#fee2e2",
            color: "#991b1b"
          },
          Medium: {
            background: "#fef3c7",
            color: "#92400e"
          },
          Low: {
            background: "#dcfce7",
            color: "#166534"
          }
        };
        const colorStyle = colors[value as keyof typeof colors] || {
          background: "#f3f4f6",
          color: "#1f2937"
        };
        return <span className="glass-radius glass-text-sm" style={{
          ...colorStyle,
          display: "inline-block",
          padding: "4px 8px"
        }}>
              {String(value)}
            </span>;
      }
    }, {
      key: "status",
      label: "Status",
      sortable: true
    }, {
      key: "assignee",
      label: "Assignee",
      sortable: true
    }],
    searchable: false,
    paginated: false
  },
  render: args => <TableStoryFrame maxWidth={896}>
      <div className="mb-6">
        <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">
          Simple Task List
        </h1>
        <p className="glass-text-secondary">
          Basic table without search or pagination
        </p>
      </div>
      <GlassDataTable {...args} />
    </TableStoryFrame>
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    data: sampleUsers.concat(sampleUsers.map((user, i) => ({
      ...user,
      id: user.id + 100,
      name: user.name + " (Copy)",
      email: \`copy\${i + 1}@example.com\`
    }))),
    columns: userColumns,
    searchable: true,
    paginated: true,
    pageSize: 5
  },
  render: args => <TableStoryFrame>
      <div className="mb-6">
        <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">
          Complete Data Table
        </h1>
        <p className="glass-text-secondary">
          All features enabled: search, sort, pagination with larger dataset
        </p>
      </div>
      <GlassDataTable {...args} />
    </TableStoryFrame>
}`,...c.parameters?.docs?.source}}};const j=["Default","LoadingState","EmptyState","SimpleTable","AllFeatures"];export{c as AllFeatures,n as Default,o as EmptyState,l as LoadingState,i as SimpleTable,j as __namedExportsOrder,f as default};
