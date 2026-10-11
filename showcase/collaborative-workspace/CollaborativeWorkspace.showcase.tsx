/* collaborative-workspace showcase (REQ-QUAL-58, tier S1, default scene saturated-abstract).
   Composes public entries directly (contract §3.3): an app-shell document editor with
   a comment thread in a resizable side panel, a share popover and a publish dialog.
   Material roles: the TopBar and every popup are glass over the scene; the document
   is a content-raised sheet, the comment rail content-sunken beside it. */
import * as React from 'react';
import {
  Avatar,
  AvatarGroup,
  Breadcrumbs,
  Button,
  Combobox,
  ContextMenu,
  Dialog,
  Heading,
  IconButton,
  Menu,
  Popover,
  Surface,
  Tabs,
  Text,
} from 'aura-glass';
import { AppShell, ResizablePanels, TopBar } from 'aura-glass/app-shell';
import { Message, Thread, type AgMessage } from 'aura-glass/ai';
import { MoreHorizontalIcon, Share2Icon } from 'aura-glass/icons';
import {
  BREADCRUMBS,
  COHORT_COLUMNS,
  COHORTS,
  COLLABORATORS,
  COMMENT_AUTHORS,
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

const TIME = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', timeStyle: 'short' });

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
              <Popover.Close render={<Button prominent />}>Send invites</Popover.Close>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function PublishDialog() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={(o: boolean) => setOpen(o)}>
      <Dialog.Trigger render={<Button prominent />}>Publish</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Header>
            <Dialog.Title>{COPY.publishTitle}</Dialog.Title>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>{COPY.publishBody}</Dialog.Description>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="clear" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button prominent onClick={() => setOpen(false)}>
              Publish
            </Button>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** The document body. `titled` renders its own heading (the fragment); the full
    page shows the title once, in the PageHeader. */
function Document({ titled }: { titled: boolean }) {
  return (
    <article
      className={styles.document}
      {...(titled ? { 'aria-labelledby': 'cw-doc-title' } : { 'aria-label': COPY.docTitle })}
    >
      <Surface layer="content" content="content-sunken" className={styles.coverFrame}>
        <img className={styles.cover} src={cover} alt="" width={960} height={540} />
      </Surface>
      {titled ? (
        <Heading level={2} size="title-2" id="cw-doc-title">
          {COPY.docTitle}
        </Heading>
      ) : null}
      <Text type="caption" muted>{COPY.docMeta}</Text>
      <Tabs.Root defaultValue="brief">
        <Tabs.List aria-label="Document sections">
          <Tabs.Tab value="brief">{COPY.tabs.brief}</Tabs.Tab>
          <Tabs.Tab value="plan">{COPY.tabs.plan}</Tabs.Tab>
          <Tabs.Tab value="risks">{COPY.tabs.risks}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="brief">
          <div className={styles.sections}>
            {SECTIONS.map((s) => (
              <ContextMenu.Root key={s.id}>
                <ContextMenu.Trigger>
                  <section className={styles.docSection} aria-labelledby={`cw-${s.id}`}>
                    <Heading level={3} size="title-3" id={`cw-${s.id}`}>
                      {s.heading}
                    </Heading>
                    {s.body.map((p) => (
                      <Text key={p} render={<p />}>
                        {p}
                      </Text>
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
          </div>
          <section className={styles.docSection} aria-labelledby="cw-cohorts">
            <h3 id="cw-cohorts">{COPY.cohortsHeading}</h3>
            <table>
              <caption>{COPY.cohortsCaption}</caption>
              <thead>
                <tr>
                  {COHORT_COLUMNS.map((c) => (
                    <th key={c} scope="col">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COHORTS.map(([country, ...cells]) => (
                  <tr key={country}>
                    <th scope="row">{country}</th>
                    {cells.map((c, i) => (
                      <td key={COHORT_COLUMNS[i + 1]}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </Tabs.Panel>
        <Tabs.Panel value="plan">
          <ol className={styles.list}>
            {PLAN_STEPS.map((p) => (
              <Text key={p} render={<li />}>
                {p}
              </Text>
            ))}
          </ol>
        </Tabs.Panel>
        <Tabs.Panel value="risks">
          <ul className={styles.list}>
            {RISKS.map((r) => (
              <Text key={r} render={<li />}>
                {r}
              </Text>
            ))}
          </ul>
        </Tabs.Panel>
      </Tabs.Root>
    </article>
  );
}

/** One comment: avatar, author, time and the message text. */
function Comment({ message }: { message: AgMessage }) {
  const author = COMMENT_AUTHORS[message.id] ?? 'Collaborator';
  const at = message.metadata?.createdAt;
  return (
    <Message message={message} author={author} className={styles.comment}>
      <Message.Avatar>
        <Avatar.Root name={author} size="sm" />
      </Message.Avatar>
      <div className={styles.commentBody}>
        <div className={styles.commentHead}>
          <Text type="label">{author}</Text>
          {at !== undefined ? (
            <Text type="caption" muted>
              {TIME.format(new Date(at))}
            </Text>
          ) : null}
        </div>
        <Message.Content>
          <Text render={<div />}>
            <Message.Parts message={message} />
          </Text>
        </Message.Content>
      </div>
    </Message>
  );
}

function Comments() {
  return (
    <Surface layer="content" content="content-sunken" className={styles.comments} render={<section aria-labelledby="cw-comments" />}>
      <div className={styles.commentsHead}>
        <Heading level={2} size="title-3" id="cw-comments">
          {COPY.commentsHeading}
        </Heading>
        <Text type="caption" muted>{COPY.commentsMeta}</Text>
      </div>
      <Thread messages={COMMENTS} label={COPY.commentsHeading} className={styles.thread}>
        <Thread.Items render={(m: AgMessage) => <Comment message={m} />} />
      </Thread>
      <div className={styles.resolved}>
        <Text type="caption" muted>{COPY.resolved}</Text>
        <Comment
          message={{
            id: 'c-draft',
            role: 'user',
            parts: [{ type: 'text', text: 'Dispute window confirmed at 90 days; Summary updated.' }],
          }}
        />
      </div>
    </Surface>
  );
}

/** Document beside the comment thread, on one content-raised sheet. */
function Workspace({ header, titled }: { header?: React.ReactNode; titled: boolean }) {
  return (
    <Surface layer="content" content="content-raised" className={styles.workspace}>
      {header}
      <ResizablePanels.Root defaultLayout={[66, 34]} labels={{ resize: 'Resize comments panel' }}>
        <ResizablePanels.Panel id="document" label="Document" minSize={40}>
          <Document titled={titled} />
        </ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel id="comments" label={COPY.commentsHeading} minSize={24}>
          <Comments />
        </ResizablePanels.Panel>
      </ResizablePanels.Root>
    </Surface>
  );
}

/** Fragment: document beside the comment thread. */
export function CollaborativeDocumentComments() {
  return <Workspace titled />;
}

export function CollaborativeWorkspace({ now = SHOWCASE_EPOCH }: CollaborativeWorkspaceProps) {
  const edited = new Date(now).toISOString().slice(0, 10);
  return (
    <AppShell.Root defaultSidebar="collapsed">
      <AppShell.SkipLink>{COPY.skip}</AppShell.SkipLink>
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
          <PublishDialog />
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
        <div className={styles.page}>
          <Workspace
            titled={false}
            header={<AppShell.PageHeader title={COPY.docTitle} description={`Last saved ${edited}`} headingLevel={1} />}
          />
        </div>
      </AppShell.Main>
    </AppShell.Root>
  );
}
