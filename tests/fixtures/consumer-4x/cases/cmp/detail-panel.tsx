/* CMP-426 consumer-4x case: overlays — modal, drawer, popover, tooltip, toast. */
'use client';
import * as React from 'react';
import {
  GlassModal,
  GlassDrawer,
  GlassPopover,
  GlassTooltip,
  GlassButton,
  GlassToastProvider,
  useToast,
} from 'aura-glass';

function RowActions() {
  const { addToast } = useToast();
  return (
    <GlassButton
      variant="secondary"
      onClick={() => addToast({ type: 'success', title: 'Saved', description: 'Row updated' })}
    >
      Notify
    </GlassButton>
  );
}

export function DetailPanel() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  return (
    <GlassToastProvider position="bottom-right" duration={4000}>
      <GlassTooltip content="Opens the record editor" position="top">
        <GlassButton variant="primary" onClick={() => setModalOpen(true)}>
          Edit
        </GlassButton>
      </GlassTooltip>
      <GlassPopover
        trigger="click"
        placement="bottom-start"
        content={<div>Filter by status, date or owner.</div>}
      >
        <GlassButton variant="secondary">Filters</GlassButton>
      </GlassPopover>
      <GlassButton variant="ghost" onClick={() => setDrawerOpen(true)}>
        Details
      </GlassButton>
      <RowActions />

      <GlassModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit record"
        description="Changes apply immediately."
        size="lg"
        closeOnBackdropClick={false}
        footer={<GlassButton variant="primary" onClick={() => setModalOpen(false)}>Done</GlassButton>}
      >
        <p>Record fields go here.</p>
      </GlassModal>

      <GlassDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        position="right"
        title="Details"
      >
        <p>Drawer content.</p>
      </GlassDrawer>
    </GlassToastProvider>
  );
}
