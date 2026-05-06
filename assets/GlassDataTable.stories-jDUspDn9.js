import{j as s,d as c}from"./iframe-Ddb4tVEK.js";import{G as e}from"./GlassDataTable-ic4UwqQx.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassCore-bh6YK41v.js";const b={title:"Templates/Interactive/GlassDataTable",component:e,parameters:{layout:"fullscreen",docs:{description:{component:"A comprehensive data table component with sorting, filtering, pagination, and loading states."}}}},d=[{id:1,name:"Alice Johnson",email:"alice@example.com",role:"Admin",status:"Active",joinDate:"2023-01-15",projects:12},{id:2,name:"Bob Smith",email:"bob@example.com",role:"Developer",status:"Active",joinDate:"2023-03-22",projects:8},{id:3,name:"Carol Brown",email:"carol@example.com",role:"Designer",status:"Inactive",joinDate:"2022-11-08",projects:15},{id:4,name:"David Wilson",email:"david@example.com",role:"Manager",status:"Active",joinDate:"2022-09-12",projects:23},{id:5,name:"Eva Davis",email:"eva@example.com",role:"Developer",status:"Active",joinDate:"2023-05-03",projects:6},{id:6,name:"Frank Miller",email:"frank@example.com",role:"Designer",status:"Active",joinDate:"2023-02-18",projects:11},{id:7,name:"Grace Lee",email:"grace@example.com",role:"Developer",status:"Inactive",joinDate:"2022-12-01",projects:9},{id:8,name:"Henry Taylor",email:"henry@example.com",role:"Admin",status:"Active",joinDate:"2022-10-15",projects:18},{id:9,name:"Iris Chen",email:"iris@example.com",role:"Manager",status:"Active",joinDate:"2023-04-07",projects:14},{id:10,name:"Jack Anderson",email:"jack@example.com",role:"Developer",status:"Active",joinDate:"2023-06-12",projects:4},{id:11,name:"Kate Wilson",email:"kate@example.com",role:"Designer",status:"Active",joinDate:"2023-01-28",projects:7},{id:12,name:"Liam Garcia",email:"liam@example.com",role:"Developer",status:"Inactive",joinDate:"2022-08-14",projects:13}],o=[{key:"name",label:"Name",sortable:!0,width:"200px",render:a=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-8 glass-h-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-primary glass-text-sm glass-font-medium",children:String(a).charAt(0)}),s.jsx("span",{className:"glass-font-medium",children:String(a)})]})},{key:"email",label:"Email",sortable:!0,render:a=>s.jsx("span",{className:"glass-text-primary hover:glass-text-primary",children:String(a)})},{key:"role",label:"Role",sortable:!0,render:a=>{const g={Admin:"bg-red-100 text-red-800",Manager:"bg-purple-100 text-purple-800",Developer:"bg-blue-100 text-blue-800",Designer:"bg-green-100 text-green-800"}[a]||"bg-gray-100 text-gray-800";return s.jsx("span",{className:`px-2 py-1 rounded-full text-xs font-medium ${g}`,children:String(a)})}},{key:"status",label:"Status",sortable:!0,render:a=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:`w-2 h-2 rounded-full ${a==="Active"?"bg-green-500":"bg-gray-400"}`}),s.jsx("span",{className:a==="Active"?"text-green-700":"text-gray-500",children:String(a)})]})},{key:"projects",label:"Projects",sortable:!0,render:a=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"font-mono glass-text-sm",children:String(a)}),s.jsx("div",{className:"glass-w-16 glass-h-1 glass-surface-subtle glass-radius-full overflow-hidden",children:s.jsx("div",{className:`glass-h-full glass-surface-blue transition-all duration-[${c.DURATION.normal}ms]`,style:{width:`${Math.min(100,Number(a)/25*100)}%`}})})]})},{key:"joinDate",label:"Join Date",sortable:!0,render:a=>new Date(String(a)).toLocaleDateString()}],r={args:{data:d,columns:o,searchable:!0,paginated:!0,pageSize:8},render:a=>s.jsx("div",{className:"glass-p-8 glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary",children:s.jsxs("div",{className:"max-w-7xl glass-mx-auto",children:[s.jsxs("div",{className:"mb-6",children:[s.jsx("h1",{className:"glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2",children:"User Management"}),s.jsx("p",{className:"glass-text-secondary",children:"Manage your team members and their roles"})]}),s.jsx(e,{...a})]})})},l={args:{data:[],columns:o,loading:!0,loadingRows:6},render:a=>s.jsx("div",{className:"glass-p-8 glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary",children:s.jsxs("div",{className:"max-w-7xl glass-mx-auto",children:[s.jsxs("div",{className:"mb-6",children:[s.jsx("h1",{className:"glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2",children:"Loading Data"}),s.jsx("p",{className:"glass-text-secondary",children:"Loading skeleton animation while data loads"})]}),s.jsx(e,{...a})]})})},t={args:{data:[],columns:o,emptyMessage:"No users found. Try adjusting your search criteria."},render:a=>s.jsx("div",{className:"glass-p-8 glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary",children:s.jsxs("div",{className:"max-w-7xl glass-mx-auto",children:[s.jsxs("div",{className:"mb-6",children:[s.jsx("h1",{className:"glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2",children:"Empty State"}),s.jsx("p",{className:"glass-text-secondary",children:"How the table looks when there's no data"})]}),s.jsx(e,{...a})]})})},n={args:{data:[{name:"Task 1",priority:"High",status:"In Progress",assignee:"Alice"},{name:"Task 2",priority:"Medium",status:"Completed",assignee:"Bob"},{name:"Task 3",priority:"Low",status:"Todo",assignee:"Carol"},{name:"Task 4",priority:"High",status:"In Progress",assignee:"David"}],columns:[{key:"name",label:"Task Name",sortable:!0},{key:"priority",label:"Priority",sortable:!0,render:a=>{const g={High:"text-red-600 bg-red-50",Medium:"text-yellow-600 bg-yellow-50",Low:"text-green-600 bg-green-50"}[a]||"text-gray-600 bg-gray-50";return s.jsx("span",{className:`px-2 py-1 rounded text-sm ${g}`,children:String(a)})}},{key:"status",label:"Status",sortable:!0},{key:"assignee",label:"Assignee",sortable:!0}],searchable:!1,paginated:!1},render:a=>s.jsx("div",{className:"glass-p-8 glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary",children:s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsxs("div",{className:"mb-6",children:[s.jsx("h1",{className:"glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2",children:"Simple Task List"}),s.jsx("p",{className:"glass-text-secondary",children:"Basic table without search or pagination"})]}),s.jsx(e,{...a})]})})},i={args:{data:d.concat(d.map((a,m)=>({...a,id:a.id+100,name:a.name+" (Copy)",email:`copy${m+1}@example.com`}))),columns:o,searchable:!0,paginated:!0,pageSize:5},render:a=>s.jsx("div",{className:"glass-p-8 glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary",children:s.jsxs("div",{className:"max-w-7xl glass-mx-auto",children:[s.jsxs("div",{className:"mb-6",children:[s.jsx("h1",{className:"glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2",children:"Complete Data Table"}),s.jsx("p",{className:"glass-text-secondary",children:"All features enabled: search, sort, pagination with larger dataset"})]}),s.jsx(e,{...a})]})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    data: sampleUsers,
    columns: userColumns,
    searchable: true,
    paginated: true,
    pageSize: 8
  },
  render: args => <div className="glass-p-8 glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary">
      <div className="max-w-7xl glass-mx-auto">
        <div className="mb-6">
          <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">User Management</h1>
          <p className="glass-text-secondary">Manage your team members and their roles</p>
        </div>
        <GlassDataTable {...args} />
      </div>
    </div>
}`,...r.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    data: [],
    columns: userColumns,
    loading: true,
    loadingRows: 6
  },
  render: args => <div className="glass-p-8 glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary">
      <div className="max-w-7xl glass-mx-auto">
        <div className="mb-6">
          <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">Loading Data</h1>
          <p className="glass-text-secondary">Loading skeleton animation while data loads</p>
        </div>
        <GlassDataTable {...args} />
      </div>
    </div>
}`,...l.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    data: [],
    columns: userColumns,
    emptyMessage: 'No users found. Try adjusting your search criteria.'
  },
  render: args => <div className="glass-p-8 glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary">
      <div className="max-w-7xl glass-mx-auto">
        <div className="mb-6">
          <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">Empty State</h1>
          <p className="glass-text-secondary">How the table looks when there's no data</p>
        </div>
        <GlassDataTable {...args} />
      </div>
    </div>
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    data: [{
      name: 'Task 1',
      priority: 'High',
      status: 'In Progress',
      assignee: 'Alice'
    }, {
      name: 'Task 2',
      priority: 'Medium',
      status: 'Completed',
      assignee: 'Bob'
    }, {
      name: 'Task 3',
      priority: 'Low',
      status: 'Todo',
      assignee: 'Carol'
    }, {
      name: 'Task 4',
      priority: 'High',
      status: 'In Progress',
      assignee: 'David'
    }],
    columns: [{
      key: 'name',
      label: 'Task Name',
      sortable: true
    }, {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (value: any) => {
        const colors = {
          High: 'text-red-600 bg-red-50',
          Medium: 'text-yellow-600 bg-yellow-50',
          Low: 'text-green-600 bg-green-50'
        };
        const color = colors[value as keyof typeof colors] || 'text-gray-600 bg-gray-50';
        return <span className={\`px-2 py-1 rounded text-sm \${color}\`}>{String(value)}</span>;
      }
    }, {
      key: 'status',
      label: 'Status',
      sortable: true
    }, {
      key: 'assignee',
      label: 'Assignee',
      sortable: true
    }],
    searchable: false,
    paginated: false
  },
  render: args => <div className="glass-p-8 glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary">
      <div className="max-w-4xl glass-mx-auto">
        <div className="mb-6">
          <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">Simple Task List</h1>
          <p className="glass-text-secondary">Basic table without search or pagination</p>
        </div>
        <GlassDataTable {...args} />
      </div>
    </div>
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    data: sampleUsers.concat(sampleUsers.map((user, i) => ({
      ...user,
      id: user.id + 100,
      name: user.name + ' (Copy)',
      email: \`copy\${i + 1}@example.com\`
    }))),
    columns: userColumns,
    searchable: true,
    paginated: true,
    pageSize: 5
  },
  render: args => <div className="glass-p-8 glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary">
      <div className="max-w-7xl glass-mx-auto">
        <div className="mb-6">
          <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">Complete Data Table</h1>
          <p className="glass-text-secondary">All features enabled: search, sort, pagination with larger dataset</p>
        </div>
        <GlassDataTable {...args} />
      </div>
    </div>
}`,...i.parameters?.docs?.source}}};const h=["Default","LoadingState","EmptyState","SimpleTable","AllFeatures"];export{i as AllFeatures,r as Default,t as EmptyState,l as LoadingState,n as SimpleTable,h as __namedExportsOrder,b as default};
