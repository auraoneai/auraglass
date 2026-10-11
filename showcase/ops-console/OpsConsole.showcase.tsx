/* ops-console showcase (REQ-QUAL-58, tier S1, default scene flat-black).
   Composes registry/blocks/app-frame (contract §3.3): the block supplies AppShell,
   TopBar, Sidebar, Inspector and StatusBar; the showcase fills AppShell.Main and
   drives the sidebar into its rail state through AppShell.Controller. */
import * as React from 'react';
import {
  ActivityFeed,
  AlertDialog,
  Button,
  Card,
  Heading,
  IconButton,
  Menu,
  Text,
  Toast,
  Tooltip,
  useToast,
} from 'aura-glass';
import { AppShell, Inspector, ResizablePanels } from 'aura-glass/app-shell';
import { Table, TreeView } from 'aura-glass/data';
import { MoreHorizontalIcon } from 'aura-glass/icons';
import { AppFrame } from '../../registry/blocks/app-frame/index';
import {
  ACTIVITY,
  COPY,
  DETAIL_FIELDS,
  INCIDENT_COLUMNS,
  INCIDENT_SUMMARY,
  INCIDENTS,
  NAV,
  SHOWCASE_EPOCH,
  TOPOLOGY,
  type IncidentRow,
  type TopologyNode,
} from './copy';
import mark from './assets/beacon-mark.avif';
import styles from './ops-console.module.css';

export interface OpsConsoleProps {
  /** Fixed epoch for relative timestamps (REQ-QUAL-59 determinism). */
  now?: number;
}

/** Fragment: the incident grid with its row-actions menu. */
export function OpsConsoleIncidents() {
  return (
    <Card.Root className={styles.section} render={<section aria-labelledby="ops-incidents-heading" />}>
      <div className={styles.sectionHeader}>
        <Heading level={2} size="title-3" id="ops-incidents-heading">
          {COPY.incidentsHeading}
        </Heading>
        <Menu.Root>
          <Menu.Trigger render={<IconButton label={COPY.actions} icon={<MoreHorizontalIcon />} />} />
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.Item>Acknowledge selected</Menu.Item>
                <Menu.Item>Reassign commander</Menu.Item>
                <Menu.Item>Open bridge call</Menu.Item>
                <Menu.Separator />
                <Menu.Item>Export as CSV</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
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
    </Card.Root>
  );
}

/** Fragment: topology tree beside the selected service detail, in resizable panels. */
export function OpsConsoleSplit({ now = SHOWCASE_EPOCH }: OpsConsoleProps) {
  return (
    <Card.Root className={styles.split}>
    <ResizablePanels.Root defaultLayout={[35, 65]} labels={{ resize: 'Resize topology panel' }}>
      <ResizablePanels.Panel id="topology" label={COPY.topologyHeading} minSize={20}>
        <section className={styles.pane} aria-labelledby="ops-topology-heading">
          <Heading level={2} size="title-3" id="ops-topology-heading">
            {COPY.topologyHeading}
          </Heading>
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
        <section className={styles.pane} aria-labelledby="ops-detail-heading">
          <Heading level={2} size="title-3" id="ops-detail-heading">
            {COPY.detailHeading}
          </Heading>
          <dl className={styles.facts}>
            {DETAIL_FIELDS.map((f) => (
              <div key={f.label} className={styles.fact}>
                <Text type="caption" muted render={<dt />}>
                  {f.label}
                </Text>
                <Text weight="medium" render={<dd />}>
                  {f.value}
                </Text>
              </div>
            ))}
          </dl>
          <Heading level={3} size="sm">
            {COPY.activityHeading}
          </Heading>
          <ActivityFeed items={ACTIVITY} timeFormat="relative" now={now} headingLevel={4} aria-label={COPY.activityHeading} />
        </section>
      </ResizablePanels.Panel>
    </ResizablePanels.Root>
    </Card.Root>
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
          <Tooltip.Portal>
            <Tooltip.Positioner>
              <Tooltip.Popup>{COPY.ackTooltip}</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
      <AlertDialog.Root intent="danger">
        <AlertDialog.Trigger render={<Button intent="danger" />}>{COPY.resolveAction}</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Popup>
            <AlertDialog.Title>{COPY.resolveTitle}</AlertDialog.Title>
            <AlertDialog.Description>{COPY.resolveBody}</AlertDialog.Description>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Keep open</AlertDialog.Cancel>
              <AlertDialog.Action>{COPY.resolveAction}</AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
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
      <AppFrame
        title={COPY.product}
        brand={<img className={styles.mark} src={mark} alt="" width={28} height={28} />}
        nav={NAV}
        currentNav="incidents"
        navLabel={COPY.navLabel}
        inspectorTitle={COPY.inspectorTitle}
        inspector={INCIDENT_SUMMARY.map((f) => (
          <Inspector.Field key={f.label} label={f.label}>
            {f.value}
          </Inspector.Field>
        ))}
        status={COPY.status}
      >
        <AppShell.Controller sidebar={sidebar} onSidebarChange={setSidebar} />
        <div className={styles.page}>
          <AppShell.PageHeader
            title={COPY.pageTitle}
            description={COPY.pageDescription}
            headingLevel={1}
            actions={<IncidentActions />}
          />
          <OpsConsoleIncidents />
          <OpsConsoleSplit now={now} />
        </div>
      </AppFrame>
    </Toast.Provider>
  );
}
