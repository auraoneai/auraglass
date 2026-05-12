import React from 'react';
import {
    GlassAlert,
    GlassBadge,
    GlassButton,
    GlassCard,
    GlassDataTable,
    GlassDialog,
    GlassHeader,
    GlassInput,
    GlassModal,
    GlassProgress,
    GlassTimeline,
    OptimizedGlass
} from '../src';

export function AuraGlassExample() {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);

    // Sample data for components
    const tableData = [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    ];

    const timelineItems = [
        { id: '1', title: 'Project Started', time: '2 hours ago', subtitle: 'Initial setup completed' },
        { id: '2', title: 'First Deployment', time: '1 hour ago', subtitle: 'Successfully deployed to production' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
            <OptimizedGlass className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <GlassHeader className="mb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-white">AuraGlass by AuraOne Demo</h1>
                        <div className="flex space-x-4">
                            <GlassButton variant="secondary" onClick={() => setDialogOpen(true)}>
                                Open Dialog
                            </GlassButton>
                            <GlassButton onClick={() => setModalOpen(true)}>
                                Open Modal
                            </GlassButton>
                        </div>
                    </div>
                </GlassHeader>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Form Section */}
                    <GlassCard className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-white">Form Components</h2>
                        <div className="space-y-4">
                            <GlassInput placeholder="Enter your name" />
                            <GlassInput type="email" placeholder="Enter your email" />
                            <GlassInput type="password" placeholder="Enter your password" />
                            <GlassButton className="w-full">Submit Form</GlassButton>
                        </div>
                    </GlassCard>

                    {/* Data Display */}
                    <GlassCard className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-white">Data Display</h2>
                        <div className="space-y-4">
                            <div className="flex space-x-2">
                                <GlassBadge>Default</GlassBadge>
                                <GlassBadge variant="success">Success</GlassBadge>
                                <GlassBadge variant="warning">Warning</GlassBadge>
                                <GlassBadge variant="error">Error</GlassBadge>
                            </div>
                            <GlassProgress value={75} className="w-full" />
                            <GlassAlert variant="success">
                                <strong>Success!</strong> Your action was completed successfully.
                            </GlassAlert>
                        </div>
                    </GlassCard>

                    {/* Timeline */}
                    <GlassCard className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-white">Timeline</h2>
                        <GlassTimeline items={timelineItems} />
                    </GlassCard>

                    {/* Data Table */}
                    <GlassCard className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-white">Data Table</h2>
                        <GlassDataTable
                            columns={[
                                { id: 'name', accessorKey: 'name', header: 'Name' },
                                { id: 'email', accessorKey: 'email', header: 'Email' },
                                { id: 'status', accessorKey: 'status', header: 'Status' }
                            ]}
                            data={tableData}
                        />
                    </GlassCard>

                </div>

                {/* Interactive Components */}
                <GlassCard className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Interactive Components</h2>
                    <div className="flex flex-wrap gap-4">
                        <GlassButton variant="primary">Primary Button</GlassButton>
                        <GlassButton variant="secondary">Secondary Button</GlassButton>
                        <GlassButton variant="ghost">Ghost Button</GlassButton>
                        <GlassButton disabled>Disabled Button</GlassButton>
                        <GlassButton loading>Loading Button</GlassButton>
                    </div>
                </GlassCard>

            </OptimizedGlass>

            {/* Dialog */}
            <GlassDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <GlassCard className="p-6 max-w-md">
                    <h3 className="text-lg font-semibold mb-2 text-white">Confirmation Dialog</h3>
                    <p className="text-gray-300 mb-4">Are you sure you want to proceed with this action?</p>
                    <div className="flex justify-end space-x-3">
                        <GlassButton variant="ghost" onClick={() => setDialogOpen(false)}>
                            Cancel
                        </GlassButton>
                        <GlassButton onClick={() => setDialogOpen(false)}>
                            Confirm
                        </GlassButton>
                    </div>
                </GlassCard>
            </GlassDialog>

            {/* Modal */}
            <GlassModal open={modalOpen} onClose={() => setModalOpen(false)}>
                <GlassCard className="p-8 max-w-lg">
                    <h3 className="text-xl font-semibold mb-4 text-white">Welcome to AuraGlass by AuraOne</h3>
                    <p className="text-gray-300 mb-6">
                        This is a comprehensive glassmorphism design system built with React and TypeScript.
                        It provides beautiful, modern UI components with advanced glass effects and animations.
                    </p>
                    <div className="flex justify-end">
                        <GlassButton onClick={() => setModalOpen(false)}>
                            Get Started
                        </GlassButton>
                    </div>
                </GlassCard>
            </GlassModal>
        </div>
    );
}

export default AuraGlassExample;
