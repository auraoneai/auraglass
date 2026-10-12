/* mobile-productivity showcase (REQ-QUAL-58, tier S1, default scene photo, 390×844).
   Composes public entries directly (contract §3.3): MobileShell with a TabBar and
   accessory, a task list that morphs into a detail view via SourceTransition, a
   detented quick-add Sheet with form controls, a Toast and GlassPreferencesPanel.
   Material roles: top bar, tab bar, search field, sheet and toast are the glass
   layers over the photo; the day summary, task list and settings sit on
   content-raised Cards so no text is set straight on the photo. */
import * as React from 'react';
import {
  Button,
  Card,
  Checkbox,
  Fieldset,
  Heading,
  NumberField,
  Progress,
  RadioGroup,
  SearchField,
  Separator,
  Sheet,
  SourceTransition,
  Switch,
  TabBar,
  Text,
  TextField,
  Toast,
  useToast,
} from 'aura-glass';
import { AppShell, MobileShell, TopBar } from 'aura-glass/app-shell';
import { GlassPreferencesPanel } from 'aura-glass/theme';
import { CalendarIcon, FolderIcon, HomeIcon, PlusIcon, SettingsIcon } from 'aura-glass/icons';
import { COPY, PRIORITIES, SHOWCASE_EPOCH, TASKS } from './copy';
import mark from './assets/tasks-mark.avif';
import styles from './mobile-productivity.module.css';

export interface MobileProductivityProps {
  /** Fixed epoch (REQ-QUAL-59 determinism). */
  now?: number;
}

const DONE = TASKS.filter((t) => t.done).length;

/** Fragment: the tab bar with its accessory row. */
export function MobileTabBar({ onQuickAdd }: { onQuickAdd?: () => void }) {
  return (
    <TabBar.Root appearance="floating" accessoryPlacement="persist" aria-label="Sections">
      <TabBar.Accessory>
        <div className={styles.accessory}>
          <Text type="caption">{COPY.nowPlaying}</Text>
          <Button size="sm" startIcon={<PlusIcon />} onClick={onQuickAdd}>
            {COPY.quickAdd}
          </Button>
        </div>
      </TabBar.Accessory>
      <TabBar.Item href="#today" current icon={<HomeIcon />}>{COPY.tabs.today}</TabBar.Item>
      <TabBar.Item href="#upcoming" icon={<CalendarIcon />}>{COPY.tabs.upcoming}</TabBar.Item>
      <TabBar.Item href="#projects" icon={<FolderIcon />}>{COPY.tabs.projects}</TabBar.Item>
      <TabBar.Item href="#settings" icon={<SettingsIcon />}>{COPY.tabs.settings}</TabBar.Item>
    </TabBar.Root>
  );
}

/** Fragment: the quick-add Sheet with three detents (half, content, full). */
export function MobileQuickAddSheet({
  open,
  onOpenChange,
  defaultDetent = 0,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultDetent?: number;
}) {
  const toast = useToast();
  return (
    <Sheet.Root
      side="bottom"
      detents={[0.4, 'content', 'full']}
      defaultDetent={defaultDetent}
      {...(open !== undefined ? { open } : { defaultOpen: true })}
      {...(onOpenChange ? { onOpenChange: (o: boolean) => onOpenChange(o) } : {})}
      labels={{ handle: 'Resize new task sheet', detents: ['Peek', 'Form', 'Full screen'] }}
    >


        <Sheet.Content>
          <Sheet.Handle />
          <Sheet.Header>
            <Sheet.Title>{COPY.sheetTitle}</Sheet.Title>
          </Sheet.Header>
          <Sheet.Body>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <TextField label={COPY.taskName} defaultValue={COPY.taskNameValue} />
              <NumberField label={COPY.estimate} defaultValue={1.5} min={0.25} max={12} step={0.25} />
              <Fieldset legend={COPY.priority}>
                <RadioGroup.Root defaultValue="normal" aria-label={COPY.priority}>
                  {PRIORITIES.map((p) => (
                    <RadioGroup.Item key={p.value} value={p.value}>{p.label}</RadioGroup.Item>
                  ))}
                </RadioGroup.Root>
              </Fieldset>
              <Separator />
              <Switch defaultChecked>{COPY.remind}</Switch>
              <Checkbox value="team" defaultChecked>{COPY.shareWithTeam}</Checkbox>
            </form>
          </Sheet.Body>
          <Sheet.Footer>
            <Sheet.Close render={<Button variant="clear" />} aria-label={undefined}>
              Cancel
            </Sheet.Close>
            <Sheet.Close
              render={<Button prominent />}
              aria-label={undefined}
              onClick={() => toast.add({ title: COPY.saved, description: COPY.savedBody, intent: 'success' })}
            >
              {COPY.save}
            </Sheet.Close>
          </Sheet.Footer>
        </Sheet.Content>

    </Sheet.Root>
  );
}

function TaskList({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <Card.Root className={styles.card} render={<section aria-labelledby="mp-tasks" />}>
      <Heading level={2} size="title-3" id="mp-tasks">
        {COPY.tasksHeading}
      </Heading>
      <ul role="list" className={styles.tasks}>
        {TASKS.map((t, i) => (
          <li key={t.id} className={styles.task}>
            {i > 0 ? <Separator /> : null}
            <SourceTransition.Source id={t.id}>
              <div className={styles.taskRow}>
                <div className={styles.taskText}>
                  <Checkbox value={t.id} defaultChecked={t.done}>{t.title}</Checkbox>
                  <Text type="caption" muted className={styles.taskMeta}>
                    {t.project} · {t.due}
                  </Text>
                </div>
                <Button size="sm" variant="clear" onClick={() => onOpen(t.id)} aria-label={`Open ${t.title}`}>
                  Details
                </Button>
              </div>
            </SourceTransition.Source>
          </li>
        ))}
      </ul>
    </Card.Root>
  );
}

function TaskDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const task = TASKS.find((t) => t.id === id) ?? TASKS[0];
  return (
    <SourceTransition.Destination id={id}>
      <Card.Root className={styles.card} render={<section aria-labelledby="mp-detail-title" />}>
        <Heading level={2} size="title-2" id="mp-detail-title">
          {task.title}
        </Heading>
        <Text muted>
          {task.project} · due {task.due}
        </Text>
        <Button onClick={onBack}>{COPY.detailBack}</Button>
      </Card.Root>
    </SourceTransition.Destination>
  );
}

function Toasts() {
  const toast = useToast();
  return (
    <Toast.Viewport position="top-center">
      {toast.toasts.map((t) => (
        <Toast.Root key={t.id} toast={t}>
          <Toast.Title>{t.title}</Toast.Title>
          <Toast.Description>{t.description}</Toast.Description>
          <Toast.Close>Dismiss</Toast.Close>
        </Toast.Root>
      ))}
    </Toast.Viewport>
  );
}

/** Fragment wrapper: the quick-add Sheet held at one of its three detents. */
export function MobileSheetAtDetent({ detent }: { detent: 0 | 1 | 2 }) {
  return (
    <Toast.Provider>
      <MobileQuickAddSheet defaultDetent={detent} />
      <Toasts />
    </Toast.Provider>
  );
}

export function MobileProductivity({ now = SHOWCASE_EPOCH }: MobileProductivityProps) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<string | null>(null);
  const today = new Date(now).toISOString().slice(0, 10);
  const open = (id: string) => void SourceTransition.start(id, () => setDetail(id));
  const back = () => void SourceTransition.start(detail ?? '', () => setDetail(null));
  return (
    <Toast.Provider>
      <MobileShell
        topBar={
          <>
            <TopBar.Leading>
              <img className={styles.mark} src={mark} alt="" width={28} height={28} />
              <TopBar.Title>{COPY.product}</TopBar.Title>
            </TopBar.Leading>
            <AppShell.SkipLink>{COPY.skip}</AppShell.SkipLink>
          </>
        }
        tabBar={<MobileTabBar onQuickAdd={() => setSheetOpen(true)} />}
      >
        <div className={styles.page}>
          <Card.Root className={styles.card}>
            <div className={styles.titleRow}>
              <Heading level={1} size="title-1">
                {COPY.title}
              </Heading>
              <Text type="caption" muted>{today}</Text>
            </div>
            <Text type="caption">{COPY.summary}</Text>
            <Progress value={DONE} max={TASKS.length} aria-label={COPY.progressLabel} />
          </Card.Root>
          <SearchField aria-label={COPY.searchLabel} placeholder={COPY.searchPlaceholder} />
          <SourceTransition.Root>
            {detail ? <TaskDetail id={detail} onBack={back} /> : <TaskList onOpen={open} />}
          </SourceTransition.Root>
          <Card.Root className={styles.prefs} render={<section aria-labelledby="mp-prefs" />}>
            <div className={styles.prefsHead}>
              <Heading level={2} size="title-3" id="mp-prefs">
                {COPY.preferences}
              </Heading>
              <Text type="caption" muted>{COPY.preferencesBody}</Text>
            </div>
            <GlassPreferencesPanel />
          </Card.Root>
        </div>
      </MobileShell>
      <MobileQuickAddSheet open={sheetOpen} onOpenChange={setSheetOpen} />
      <Toasts />
    </Toast.Provider>
  );
}
