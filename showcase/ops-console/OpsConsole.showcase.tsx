/* ops-console showcase (REQ-QUAL-58, tier S1, default scene flat-black).
   Composes registry/blocks/app-frame (contract §3.3): the block supplies AppShell,
   TopBar, Sidebar, Inspector and StatusBar; the showcase fills AppShell.Main and
   drives the sidebar into its rail state through AppShell.Controller. */
import * as React from 'react';
import { ActivityFeed, AlertDialog, Button, IconButton, Menu, Toast, Tooltip, useToast } from 'aura-glass';
import { AlertDialogBackdrop, AlertDialogPopup, AlertDialogPortal } from 'aura-glass/components/alert-dialog';
import { MenuPopup, MenuPortal, MenuPositioner } from 'aura-glass/components/menu';
import { TooltipPopup, TooltipPortal, TooltipPositioner } from 'aura-glass/components/tooltip';
import { AppShell, ResizablePanels } from 'aura-glass/app-shell';
import { Table, TreeView } from 'aura-glass/data';
import { MoreHorizontalIcon } from 'aura-glass/icons';
import { AppFrame } from '../../registry/blocks/app-frame/index';
import {
  ACTIVITY,
  COPY,
  DETAIL_FIELDS,
  INCIDENT_COLUMNS,
  INCIDENTS,
  SHOWCASE_EPOCH,
  TOPOLOGY,
  type IncidentRow,
  type TopologyNode,
} from './copy';
import styles from './ops-console.module.css';

export interface OpsConsoleProps {
  /** Fixed epoch for relative timestamps (REQ-QUAL-59 determinism). */
  now?: number;
}

/** Fragment: the incident grid with its row-actions menu. */
export function OpsConsoleIncidents() {
  return (
    <section className={styles.section} aria-labelledby="ops-incidents-heading">
      <div className={styles.sectionHeader}>
        <h2 id="ops-incidents-heading" className={styles.heading}>{COPY.incidentsHeading}</h2>
        <Menu.Root>
          <Menu.Trigger render={<IconButton label={COPY.actions} icon={<MoreHorizontalIcon />} />} />
          <MenuPortal>
            <MenuPositioner>
              <MenuPopup>
                <Menu.Item>Acknowledge selected</Menu.Item>
                <Menu.Item>Reassign commander</Menu.Item>
                <Menu.Item>Open bridge call</Menu.Item>
                <Menu.Separator />
                <Menu.Item>Export as CSV</Menu.Item>
              </MenuPopup>
            </MenuPositioner>
          </MenuPortal>
        </Menu.Root>
      </div>
      <Table<IncidentRow>
        data={INCIDENTS}
        columns={INCIDENT_COLUMNS}
        getRowId={(r) => r.id}
        caption={COPY.incidentsCaption}
        mode="grid"
        size="sm"
        selectionMode="multiple"
        stickyHeader
      />
    </section>
  );
}

/** Fragment: topology tree beside the selected service detail, in resizable panels. */
export function OpsConsoleSplit({ now = SHOWCASE_EPOCH }: OpsConsoleProps) {
  return (
    <ResizablePanels.Root defaultLayout={[35, 65]} labels={{ resize: 'Resize topology panel' }}>
      <ResizablePanels.Panel id="topology" label={COPY.topologyHeading} minSize={20}>
        <section className={styles.section} aria-labelledby="ops-topology-heading">
          <h2 id="ops-topology-heading" className={styles.heading}>{COPY.topologyHeading}</h2>
          <TreeView<TopologyNode>
            items={TOPOLOGY}
            getKey={(n) => n.id}
            getTextValue={(n) => n.label}
            getChildren={(n) => n.children}
            aria-label={COPY.topologyHeading}
            defaultExpandedKeys={['eu-west-1', 'us-east-2']}
            defaultSelectedKeys={['checkout-api']}
            selectionMode="single"
          />
        </section>
      </ResizablePanels.Panel>
      <ResizablePanels.Handle />
      <ResizablePanels.Panel id="detail" label={COPY.detailHeading} minSize={30}>
        <section className={styles.section} aria-labelledby="ops-detail-heading">
          <h2 id="ops-detail-heading" className={styles.heading}>{COPY.detailHeading}</h2>
          <dl className={styles.facts}>
            {DETAIL_FIELDS.map((f) => (
              <div key={f.label} className={styles.fact}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          <h3>{COPY.activityHeading}</h3>
          <ActivityFeed items={ACTIVITY} timeFormat="relative" now={now} headingLevel={4} aria-label={COPY.activityHeading} />
        </section>
      </ResizablePanels.Panel>
    </ResizablePanels.Root>
  );
}

function IncidentActions() {
  const toast = useToast();
  return (
    <div className={styles.actions}>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger
            render={
              <Button onClick={() => toast.add({ title: COPY.toastTitle, description: COPY.toastBody, intent: 'info' })} />
            }
          >
            Acknowledge INC-4821
          </Tooltip.Trigger>
          <TooltipPortal>
            <TooltipPositioner>
              <TooltipPopup>{COPY.ackTooltip}</TooltipPopup>
            </TooltipPositioner>
          </TooltipPortal>
        </Tooltip.Root>
      </Tooltip.Provider>
      <AlertDialog.Root intent="danger">
        <AlertDialog.Trigger>{COPY.resolveAction}</AlertDialog.Trigger>
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup>
            <AlertDialog.Title>{COPY.resolveTitle}</AlertDialog.Title>
            <AlertDialog.Description>{COPY.resolveBody}</AlertDialog.Description>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Keep open</AlertDialog.Cancel>
              <AlertDialog.Action>{COPY.resolveAction}</AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog.Root>
      <Toast.Viewport>
        {toast.toasts.map((t) => (
          <Toast.Root key={t.id} toast={t}>
            <Toast.Title>{t.title}</Toast.Title>
            <Toast.Description>{t.description}</Toast.Description>
            <Toast.Close>Dismiss</Toast.Close>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </div>
  );
}

export function OpsConsole({ now = SHOWCASE_EPOCH }: OpsConsoleProps) {
  const [sidebar, setSidebar] = React.useState<'expanded' | 'rail' | 'collapsed'>('rail');
  return (
    <Toast.Provider>
      <AppShell.SkipLink>{COPY.skip}</AppShell.SkipLink>
      <AppFrame>
        <AppShell.Controller sidebar={sidebar} onSidebarChange={setSidebar} />
        <AppShell.PageHeader
          title={COPY.pageTitle}
          description={COPY.pageDescription}
          headingLevel={1}
          actions={<IncidentActions />}
        />
        <div className={styles.page}>
          <OpsConsoleIncidents />
          <OpsConsoleSplit now={now} />
        </div>
      </AppFrame>
    </Toast.Provider>
  );
}
