/* mobile-productivity showcase (REQ-QUAL-58, tier S1, default scene photo, 390×844).
   Composes public entries directly (contract §3.3): MobileShell with a TabBar and
   accessory, a task list that morphs into a detail view via SourceTransition, a
   detented quick-add Sheet with form controls, a Toast and GlassPreferencesPanel. */
import * as React from 'react';
import {
  Button,
  Checkbox,
  NumberField,
  RadioGroup,
  SearchField,
  Sheet,
  SourceTransition,
  Switch,
  TabBar,
  TextField,
  Toast,
  useToast,
} from 'aura-glass';
import { AppShell, MobileShell } from 'aura-glass/app-shell';
import { GlassPreferencesPanel } from 'aura-glass/theme';
import { CalendarIcon, FolderIcon, HomeIcon, PlusIcon, SettingsIcon } from 'aura-glass/icons';
import { COPY, PRIORITIES, SHOWCASE_EPOCH, TASKS } from './copy';
import mark from './assets/tasks-mark.avif';
import styles from './mobile-productivity.module.css';

export interface MobileProductivityProps {
  /** Fixed epoch (REQ-QUAL-59 determinism). */
  now?: number;
}

/** Fragment: the tab bar with its accessory row. */
export function MobileTabBar({ onQuickAdd }: { onQuickAdd?: () => void }) {
  return (
    <TabBar.Root appearance="floating" accessoryPlacement="persist" aria-label="Sections">
      <TabBar.Accessory>
        <div className={styles.accessory}>
          <span>{COPY.nowPlaying}</span>
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
      <Sheet.Portal>
        <Sheet.Backdrop />
        <Sheet.Popup>
          <Sheet.Handle />
          <Sheet.Header>
            <Sheet.Title>{COPY.sheetTitle}</Sheet.Title>
          </Sheet.Header>
          <Sheet.Body>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <TextField label={COPY.taskName} defaultValue={COPY.taskNameValue} />
              <NumberField label={COPY.estimate} defaultValue={1.5} min={0.25} max={12} step={0.25} />
              <fieldset className={styles.fieldset}>
                <legend>{COPY.priority}</legend>
                <RadioGroup.Root defaultValue="normal" aria-label={COPY.priority}>
                  {PRIORITIES.map((p) => (
                    <RadioGroup.Item key={p.value} value={p.value}>{p.label}</RadioGroup.Item>
                  ))}
                </RadioGroup.Root>
              </fieldset>
              <Switch defaultChecked>{COPY.remind}</Switch>
              <Checkbox value="team" defaultChecked>{COPY.shareWithTeam}</Checkbox>
            </form>
          </Sheet.Body>
          <Sheet.Footer>
            <Sheet.Close>Cancel</Sheet.Close>
            <Sheet.Close
              render={<Button />}
              onClick={() => toast.add({ title: COPY.saved, description: COPY.savedBody, intent: 'success' })}
            >
              {COPY.save}
            </Sheet.Close>
          </Sheet.Footer>
        </Sheet.Popup>
      </Sheet.Portal>
    </Sheet.Root>
  );
}

function TaskList({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <ul className={styles.tasks}>
      {TASKS.map((t) => (
        <li key={t.id} className={styles.task}>
          <SourceTransition.Source id={t.id}>
            <Checkbox value={t.id} defaultChecked={t.done}>{t.title}</Checkbox>
            <p className={styles.taskMeta}>
              {t.project} · {t.due}
            </p>
            <Button size="sm" variant="clear" onClick={() => onOpen(t.id)} aria-label={`Open ${t.title}`}>
              Details
            </Button>
          </SourceTransition.Source>
        </li>
      ))}
    </ul>
  );
}

function TaskDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const task = TASKS.find((t) => t.id === id) ?? TASKS[0];
  return (
    <SourceTransition.Destination id={id}>
      <section className={styles.detail} aria-labelledby="mp-detail-title">
        <h2 id="mp-detail-title">{task.title}</h2>
        <p>
          {task.project} · due {task.due}
        </p>
        <Button onClick={onBack}>{COPY.detailBack}</Button>
      </section>
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
      <AppShell.SkipLink>{COPY.skip}</AppShell.SkipLink>
      <MobileShell
        topBar={
          <div className={styles.topBar}>
            <img className={styles.mark} src={mark} alt="" width={28} height={28} />
            <span>{COPY.product}</span>
          </div>
        }
        tabBar={<MobileTabBar onQuickAdd={() => setSheetOpen(true)} />}
      >
        <div className={styles.page}>
          <h1 className={styles.title}>
            {COPY.title} <span className={styles.date}>{today}</span>
          </h1>
          <SearchField label={COPY.searchLabel} placeholder={COPY.searchPlaceholder} />
          <SourceTransition.Root>
            {detail ? <TaskDetail id={detail} onBack={back} /> : <TaskList onOpen={open} />}
          </SourceTransition.Root>
          <section className={styles.prefs} aria-labelledby="mp-prefs">
            <h2 id="mp-prefs">{COPY.preferences}</h2>
            <GlassPreferencesPanel />
          </section>
        </div>
      </MobileShell>
      <MobileQuickAddSheet open={sheetOpen} onOpenChange={setSheetOpen} />
      <Toasts />
    </Toast.Provider>
  );
}
