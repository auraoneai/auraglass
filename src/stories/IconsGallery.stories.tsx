import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  ActivityIcon,
  BellIcon,
  CalendarIcon,
  CheckIcon,
  CloseIcon,
  DashboardIcon,
  DatabaseIcon,
  DownloadIcon,
  FilterIcon,
  HomeIcon,
  ImageIcon,
  InfoIcon,
  MenuIcon,
  MoreHorizontalIcon,
  PlayIcon,
  SearchIcon,
  SendIcon,
  SettingsIcon,
  SparkIcon,
  UserIcon,
  UsersIcon,
  WarningIcon,
  ZapIcon,
  type GlassIconComponent,
} from "../icons";

type IconEntry = {
  name: string;
  description: string;
  Icon: GlassIconComponent;
};

const groups: Array<{ title: string; items: IconEntry[] }> = [
  {
    title: "Navigation",
    items: [
      { name: "HomeIcon", description: "Primary app destination", Icon: HomeIcon },
      { name: "DashboardIcon", description: "Analytics and workspace hubs", Icon: DashboardIcon },
      { name: "MenuIcon", description: "Mobile and compact navigation", Icon: MenuIcon },
      { name: "SettingsIcon", description: "Configuration and preferences", Icon: SettingsIcon },
      { name: "MoreHorizontalIcon", description: "Overflow actions", Icon: MoreHorizontalIcon },
    ],
  },
  {
    title: "Actions",
    items: [
      { name: "SearchIcon", description: "Command and global search", Icon: SearchIcon },
      { name: "FilterIcon", description: "List and table filtering", Icon: FilterIcon },
      { name: "DownloadIcon", description: "Export and save flows", Icon: DownloadIcon },
      { name: "SendIcon", description: "Submit or message actions", Icon: SendIcon },
      { name: "CloseIcon", description: "Dismiss overlays", Icon: CloseIcon },
    ],
  },
  {
    title: "Status",
    items: [
      { name: "CheckIcon", description: "Success and completion states", Icon: CheckIcon },
      { name: "WarningIcon", description: "Warning and review states", Icon: WarningIcon },
      { name: "InfoIcon", description: "Guidance and context", Icon: InfoIcon },
      { name: "BellIcon", description: "Notifications and alerts", Icon: BellIcon },
      { name: "ZapIcon", description: "High-priority or automated actions", Icon: ZapIcon },
    ],
  },
  {
    title: "Product Surfaces",
    items: [
      { name: "ActivityIcon", description: "Telemetry and activity feeds", Icon: ActivityIcon },
      { name: "DatabaseIcon", description: "Data-heavy admin surfaces", Icon: DatabaseIcon },
      { name: "CalendarIcon", description: "Scheduling workflows", Icon: CalendarIcon },
      { name: "ImageIcon", description: "Media and asset workflows", Icon: ImageIcon },
      { name: "PlayIcon", description: "Media controls", Icon: PlayIcon },
      { name: "UserIcon", description: "Account and profile surfaces", Icon: UserIcon },
      { name: "UsersIcon", description: "Collaboration and teams", Icon: UsersIcon },
      { name: "SparkIcon", description: "AI and premium actions", Icon: SparkIcon },
    ],
  },
];

const IconsGallery = () => (
  <main style={styles.page}>
    <section style={styles.header}>
      <span style={styles.kicker}>AuraGlass by AuraOne 3.2</span>
      <h1 style={styles.title}>First-party icon gallery</h1>
      <p style={styles.copy}>
        These symbols ship from AuraGlass itself. They are used by the 3.2 app
        chrome surfaces so consumers do not need Lucide for core product UI.
      </p>
    </section>
    <section style={styles.groups}>
      {groups.map((group) => (
        <article key={group.title} style={styles.group}>
          <h2 style={styles.groupTitle}>{group.title}</h2>
          <div style={styles.grid}>
            {group.items.map(({ name, description, Icon }) => (
              <div key={name} style={styles.card}>
                <div style={styles.iconShell}>
                  <Icon aria-hidden="true" size={28} strokeWidth={1.85} />
                </div>
                <div>
                  <h3 style={styles.cardTitle}>{name}</h3>
                  <p style={styles.cardCopy}>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  </main>
);

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100dvh",
    padding: 32,
    color: "#f8fafc",
    boxSizing: "border-box",
    background:
      "radial-gradient(circle at 14% 18%, rgba(94,234,212,0.32), transparent 35%), radial-gradient(circle at 84% 26%, rgba(168,85,247,0.30), transparent 36%), #07111f",
  },
  header: {
    maxWidth: 1120,
    margin: "0 auto 28px",
    display: "grid",
    gap: 10,
  },
  kicker: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0,
    textTransform: "uppercase",
    color: "#7dd3fc",
  },
  title: {
    margin: 0,
    fontSize: 40,
    lineHeight: 1.08,
    letterSpacing: 0,
    fontWeight: 680,
  },
  copy: {
    maxWidth: 760,
    margin: 0,
    color: "rgba(248,250,252,0.72)",
    fontSize: 16,
    lineHeight: 1.6,
  },
  groups: {
    maxWidth: 1120,
    margin: "0 auto",
    display: "grid",
    gap: 18,
  },
  group: {
    padding: 18,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(7,17,31,0.72)",
    boxShadow: "0 24px 72px rgba(0,0,0,0.34)",
  },
  groupTitle: {
    margin: "0 0 14px",
    fontSize: 18,
    fontWeight: 650,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 12,
  },
  card: {
    minHeight: 112,
    display: "grid",
    gridTemplateColumns: "52px 1fr",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.075)",
  },
  iconShell: {
    width: 48,
    height: 48,
    display: "grid",
    placeItems: "center",
    borderRadius: 12,
    color: "#bae6fd",
    background:
      "linear-gradient(135deg, rgba(125,211,252,0.26), rgba(192,132,252,0.22))",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.20)",
  },
  cardTitle: {
    margin: "0 0 4px",
    fontSize: 14,
    fontWeight: 700,
  },
  cardCopy: {
    margin: 0,
    color: "rgba(248,250,252,0.66)",
    fontSize: 12,
    lineHeight: 1.45,
  },
};

const meta: Meta<typeof IconsGallery> = {
  title: "Reference/Category Galleries/Icons Gallery",
  component: IconsGallery,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
