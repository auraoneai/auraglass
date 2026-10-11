/* ai-command-center showcase (REQ-QUAL-58, tier S1, default scene dark-media).
   Composes registry/blocks/ai-workspace (contract §3.3) inside the app-shell entry,
   plus the ./ai flagships the block does not render on its own. Imports: public
   entries, the block's index/fixtures, and this folder only (REQ-QUAL-59). */
import * as React from 'react';
import { Button, Command, CommandPalette, IconButton, Toast, useToast } from 'aura-glass';
import { AppShell, Inspector, Sidebar, TopBar } from 'aura-glass/app-shell';
import {
  AgentSteps,
  Citation,
  Composer,
  Message,
  Reasoning,
  SourceList,
  StreamingText,
  Thread,
  ToolCall,
} from 'aura-glass/ai';
import { CommandIcon, SettingsIcon, Share2Icon } from 'aura-glass/icons';
import { AiWorkspace } from '../../registry/blocks/ai-workspace/index';
import {
  COMMANDS,
  CONVERSATIONS,
  COPY,
  INSPECTOR_FIELDS,
  MESSAGES,
  REASONING_TEXT,
  SHOWCASE_EPOCH,
  SOURCES,
  STEPS,
  STREAMING_SUMMARY,
  TOOL_CALLS,
} from './copy';
import mark from './assets/workspace-mark.avif';
import styles from './ai-command-center.module.css';

export interface AiCommandCenterProps {
  /** Fixed epoch for every time-derived value (REQ-QUAL-59 determinism). */
  now?: number;
}

/** Fragment: the conversation thread (role="log" viewport). */
export function AiCommandCenterThread() {
  return (
    <section className={styles.fragment} aria-labelledby="acc-thread-heading">
      <h2 id="acc-thread-heading">{COPY.pageTitle}</h2>
      <Thread messages={MESSAGES} label="Incident conversation" />
    </section>
  );
}

/** Fragment: the composer with a draft in progress. */
export function AiCommandCenterComposer() {
  return (
    <section className={styles.fragment} aria-labelledby="acc-composer-heading">
      <h2 id="acc-composer-heading">{COPY.draftReply}</h2>
      <Composer defaultValue="Draft the customer-facing status update for EU-West checkout." />
    </section>
  );
}

/** Fragment: one ToolCall per display state, the approval among them. */
export function AiCommandCenterToolCalls() {
  const [decisions, setDecisions] = React.useState<Record<string, boolean>>({});
  return (
    <section className={styles.fragment} aria-labelledby="acc-tools-heading">
      <h2 id="acc-tools-heading">{COPY.toolActivity}</h2>
      <ol className={styles.toolStack}>
        {TOOL_CALLS.map((part) => (
          <li key={part.toolCallId}>
            <ToolCall
              part={part}
              onApprovalResponse={(detail: { approved: boolean }) =>
                setDecisions((d) => ({ ...d, [part.toolCallId]: detail.approved }))
              }
            />
          </li>
        ))}
      </ol>
      <p className={styles.visuallyQuiet} aria-live="polite">
        {Object.keys(decisions).length > 0 ? COPY.toastTitle : ''}
      </p>
    </section>
  );
}

function ApprovalToast() {
  const toast = useToast();
  const shown = React.useRef(false);
  React.useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    toast.add({ title: COPY.toastTitle, description: COPY.toastBody, intent: 'success', timeout: 0 });
  }, [toast]);
  return (
    <Toast.Viewport>
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

export function AiCommandCenter({ now = SHOWCASE_EPOCH }: AiCommandCenterProps) {
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const opened = new Date(now).toISOString().slice(11, 16);
  return (
    <Toast.Provider>
      <AppShell.SkipLink>{COPY.skip}</AppShell.SkipLink>
      <AppShell.Root>
        <TopBar.Root>
          <TopBar.Leading>
            <img className={styles.mark} src={mark} alt="" width={28} height={28} />
            <TopBar.Title>{COPY.product}</TopBar.Title>
          </TopBar.Leading>
          <TopBar.Trailing>
            <Button startIcon={<CommandIcon />} onClick={() => setPaletteOpen(true)}>
              {COPY.commandHint} {COPY.commandShortcut}
            </Button>
            <IconButton label={COPY.share} icon={<Share2Icon />} />
            <IconButton label={COPY.settings} icon={<SettingsIcon />} />
          </TopBar.Trailing>
        </TopBar.Root>
        <Sidebar.Root labels={{ navigation: COPY.navLabel }}>
          <Sidebar.Nav aria-label={COPY.navLabel}>
            {CONVERSATIONS.map((c) => (
              <Sidebar.Item key={c.id} href={`#${c.id}`} current={c.current}>
                {c.label}
              </Sidebar.Item>
            ))}
          </Sidebar.Nav>
        </Sidebar.Root>
        <AppShell.Main>
          <AppShell.PageHeader title={COPY.pageTitle} description={COPY.pageDescription} headingLevel={1} />
          <div className={styles.workspace}>
            <section className={styles.conversation} aria-label="Conversation">
              <AiWorkspace initialMessages={MESSAGES} />
            </section>
            <section className={styles.activity} aria-labelledby="acc-activity-heading">
              <h2 id="acc-activity-heading">{COPY.toolActivity}</h2>
              <ol className={styles.toolStack}>
                {TOOL_CALLS.map((part) => (
                  <li key={part.toolCallId}>
                    <ToolCall part={part} onApprovalResponse={() => undefined} />
                  </li>
                ))}
              </ol>
              <h3>{COPY.reasoning}</h3>
              <Reasoning text={REASONING_TEXT} state="done" durationMs={4200} />
              <h3>{COPY.draftReply}</h3>
              <Message
                message={{
                  id: 'm-draft',
                  role: 'assistant',
                  parts: [{ type: 'text', text: STREAMING_SUMMARY }],
                  metadata: { status: 'streaming', createdAt: now },
                }}
              />
              <p>
                <StreamingText text={STREAMING_SUMMARY} streaming announce="off" />{' '}
                <Citation messageId="m-draft" source={SOURCES[0]!} index={1} />
              </p>
              <h3>{COPY.sources}</h3>
              <SourceList messageId="m-draft" sources={SOURCES} />
            </section>
          </div>
        </AppShell.Main>
        <Inspector.Root aria-label={COPY.runbook}>
          <Inspector.Header title={COPY.runbook} />
          <Inspector.Content>
            {INSPECTOR_FIELDS.map((f) => (
              <Inspector.Field key={f.label} label={f.label}>
                {f.label === 'Opened' ? `${opened} UTC` : f.value}
              </Inspector.Field>
            ))}
            <AgentSteps steps={STEPS} />
          </Inspector.Content>
        </Inspector.Root>
      </AppShell.Root>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen}>
        <Command.Root>
          <Command.Input placeholder={COPY.commandHint} />
          <Command.List>
            {COMMANDS.map((c) => (
              <Command.Item key={c.value} value={c.value} onSelect={() => setPaletteOpen(false)}>
                {c.label}
              </Command.Item>
            ))}
          </Command.List>
        </Command.Root>
      </CommandPalette>
      <ApprovalToast />
    </Toast.Provider>
  );
}
