/* collaborative-workspace showcase (REQ-QUAL-58, tier S1, default scene saturated-abstract).
   Composes public entries directly (contract §3.3): an app-shell document editor with
   a comment thread in a resizable side panel, a share popover and a publish dialog. */
import * as React from 'react';
import {
  Avatar,
  AvatarGroup,
  Breadcrumbs,
  Button,
  Combobox,
  ContextMenu,
  Dialog,
  IconButton,
  Menu,
  Popover,
  Tabs,
} from 'aura-glass';
import { AppShell, ResizablePanels, TopBar } from 'aura-glass/app-shell';
import { Message, Thread } from 'aura-glass/ai';
import { MoreHorizontalIcon, Share2Icon } from 'aura-glass/icons';
import {
  BREADCRUMBS,
  COLLABORATORS,
  COMMENTS,
  COPY,
  PEOPLE,
  PLAN_STEPS,
  RISKS,
  SECTIONS,
  SHOWCASE_EPOCH,
} from './copy';
import cover from './assets/brief-cover.avif';
import styles from './collaborative-workspace.module.css';

export interface CollaborativeWorkspaceProps {
  /** Fixed epoch (REQ-QUAL-59 determinism). */
  now?: number;
}

/** Fragment: share popover with a multi-select people picker (Combobox chips). */
export function CollaborativeShare({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [people, setPeople] = React.useState<string[]>(['Ravi Patel']);
  return (
    <Popover.Root defaultOpen={defaultOpen}>
      <Popover.Trigger render={<Button startIcon={<Share2Icon />} />}>Share</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup>
            <Popover.Title>{COPY.shareTitle}</Popover.Title>
            <Popover.Description>{COPY.shareDescription}</Popover.Description>
            <div className={styles.share}>
              <Combobox.Root
                items={PEOPLE}
                multiple
                value={people}
                onValueChange={(v: unknown) => setPeople(Array.isArray(v) ? (v as string[]) : [])}
              >
                <Combobox.Chips>
                  {people.map((p) => (
                    <Combobox.Chip key={p}>{p}</Combobox.Chip>
                  ))}
                </Combobox.Chips>
                <Combobox.Input placeholder={COPY.shareLabel} aria-label={COPY.shareLabel} />
                <Combobox.Content>
                  {PEOPLE.map((p) => (
                    <Combobox.Item key={p} value={p}>
                      {p}
                    </Combobox.Item>
                  ))}
                  <Combobox.Empty>No matching people</Combobox.Empty>
                </Combobox.Content>
              </Combobox.Root>
              <Popover.Close render={<Button />}>Send invites</Popover.Close>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function Document() {
  return (
    <article className={styles.document} aria-labelledby="cw-doc-title">
      <img className={styles.cover} src={cover} alt="" width={960} height={540} />
      <h2 id="cw-doc-title">{COPY.docTitle}</h2>
      <p>{COPY.docMeta}</p>
      <Tabs.Root defaultValue="brief">
        <Tabs.List aria-label="Document sections">
          <Tabs.Tab value="brief">{COPY.tabs.brief}</Tabs.Tab>
          <Tabs.Tab value="plan">{COPY.tabs.plan}</Tabs.Tab>
          <Tabs.Tab value="risks">{COPY.tabs.risks}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="brief">
          {SECTIONS.map((s) => (
            <ContextMenu.Root key={s.id}>
              <ContextMenu.Trigger>
                <section className={styles.docSection} aria-labelledby={`cw-${s.id}`}>
                  <h3 id={`cw-${s.id}`}>{s.heading}</h3>
                  {s.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </section>
              </ContextMenu.Trigger>
              <ContextMenu.Portal>
                <ContextMenu.Positioner>
                  <ContextMenu.Popup>
                    <ContextMenu.Item>Comment on section</ContextMenu.Item>
                    <ContextMenu.Item>Copy link to section</ContextMenu.Item>
                    <ContextMenu.Separator />
                    <ContextMenu.Item>Suggest an edit</ContextMenu.Item>
                  </ContextMenu.Popup>
                </ContextMenu.Positioner>
              </ContextMenu.Portal>
            </ContextMenu.Root>
          ))}
        </Tabs.Panel>
        <Tabs.Panel value="plan">
          <ol>
            {PLAN_STEPS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </Tabs.Panel>
        <Tabs.Panel value="risks">
          <ul>
            {RISKS.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Tabs.Panel>
      </Tabs.Root>
    </article>
  );
}

function Comments() {
  return (
    <section className={styles.comments} aria-labelledby="cw-comments">
      <h2 id="cw-comments">{COPY.commentsHeading}</h2>
      <Thread messages={COMMENTS} label={COPY.commentsHeading} />
      <Message
        message={{
          id: 'c-draft',
          role: 'user',
          parts: [{ type: 'text', text: 'Resolved: dispute window is 90 days.' }],
        }}
      />
    </section>
  );
}

/** Fragment: document beside the comment thread. */
export function CollaborativeDocumentComments() {
  return (
    <ResizablePanels.Root defaultLayout={[64, 36]} labels={{ resize: 'Resize comments panel' }}>
      <ResizablePanels.Panel id="document" label="Document" minSize={40}>
        <Document />
      </ResizablePanels.Panel>
      <ResizablePanels.Handle />
      <ResizablePanels.Panel id="comments" label={COPY.commentsHeading} minSize={24}>
        <Comments />
      </ResizablePanels.Panel>
    </ResizablePanels.Root>
  );
}

export function CollaborativeWorkspace({ now = SHOWCASE_EPOCH }: CollaborativeWorkspaceProps) {
  const edited = new Date(now).toISOString().slice(0, 10);
  return (
    <>
      <AppShell.SkipLink>{COPY.skip}</AppShell.SkipLink>
      <AppShell.Root>
        <TopBar.Root>
          <TopBar.Leading>
            <TopBar.Title>{COPY.product}</TopBar.Title>
            <Breadcrumbs.Root>
              {BREADCRUMBS.map((b) => (
                <Breadcrumbs.Item key={b.href}>
                  <Breadcrumbs.Link href={b.href}>{b.label}</Breadcrumbs.Link>
                </Breadcrumbs.Item>
              ))}
              <Breadcrumbs.Current>{COPY.docTitle}</Breadcrumbs.Current>
            </Breadcrumbs.Root>
          </TopBar.Leading>
          <TopBar.Trailing>
            <AvatarGroup>
              {COLLABORATORS.map((name) => (
                <Avatar.Root key={name} name={name} size="sm" />
              ))}
            </AvatarGroup>
            <CollaborativeShare />
            <Dialog.Root>
              <Dialog.Trigger render={<Button />}>Publish</Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Popup>
                  <Dialog.Header>
                    <Dialog.Title>{COPY.publishTitle}</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <Dialog.Description>{COPY.publishBody}</Dialog.Description>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.Close>Cancel</Dialog.Close>
                    <Dialog.Close render={<Button />}>Publish</Dialog.Close>
                  </Dialog.Footer>
                </Dialog.Popup>
              </Dialog.Portal>
            </Dialog.Root>
            <Menu.Root>
              <Menu.Trigger render={<IconButton label="Document options" icon={<MoreHorizontalIcon />} />} />
              <Menu.Portal>
                <Menu.Positioner>
                  <Menu.Popup>
                    <Menu.Item>Version history</Menu.Item>
                    <Menu.Item>Export as PDF</Menu.Item>
                    <Menu.Item>Duplicate</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item>Move to archive</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </TopBar.Trailing>
        </TopBar.Root>
        <AppShell.Main>
          <AppShell.PageHeader title={COPY.docTitle} description={`Last saved ${edited}`} headingLevel={1} />
          <div className={styles.page}>
            <CollaborativeDocumentComments />
          </div>
        </AppShell.Main>
      </AppShell.Root>
    </>
  );
}
