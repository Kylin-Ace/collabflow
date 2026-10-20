"use client";

import { useMemo, useState } from "react";

type Status = "Todo" | "In progress" | "Done";
type Task = { id: string; title: string; project: string; status: Status; priority: "Urgent" | "High" | "Medium" | "Low"; assignee: string; due: string; tag: string };

const initialTasks: Task[] = [
  { id: "WEB-142", title: "Map out onboarding flow", project: "Website redesign", status: "Todo", priority: "High", assignee: "AM", due: "Today", tag: "Design" },
  { id: "WEB-139", title: "Audit existing component library", project: "Website redesign", status: "Todo", priority: "Medium", assignee: "JL", due: "Oct 22", tag: "Research" },
  { id: "WEB-136", title: "Write release notes for v2.4", project: "Website redesign", status: "Todo", priority: "Low", assignee: "SK", due: "Oct 24", tag: "Content" },
  { id: "WEB-141", title: "Build responsive navigation", project: "Website redesign", status: "In progress", priority: "Urgent", assignee: "JL", due: "Today", tag: "Engineering" },
  { id: "WEB-138", title: "Finalize homepage wireframes", project: "Website redesign", status: "In progress", priority: "High", assignee: "AM", due: "Oct 21", tag: "Design" },
  { id: "WEB-137", title: "Set up analytics events", project: "Website redesign", status: "In progress", priority: "Medium", assignee: "MR", due: "Oct 23", tag: "Engineering" },
  { id: "WEB-140", title: "Define new color tokens", project: "Website redesign", status: "Done", priority: "Medium", assignee: "SK", due: "Oct 18", tag: "Design" },
  { id: "WEB-135", title: "Review accessibility checklist", project: "Website redesign", status: "Done", priority: "Low", assignee: "MR", due: "Oct 17", tag: "Research" },
];

const columns: Status[] = ["Todo", "In progress", "Done"];
const people: Record<string, string> = { AM: "Ava Mitchell", JL: "Jordan Lee", SK: "Sam Kim", MR: "Morgan Reed" };

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    inbox: <><path d="M4 4h16l1 11h-5l-2 3h-4l-2-3H3L4 4Z" /><path d="M3.5 15h5l2 3h3l2-3h5" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1a1.7 1.7 0 1 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.3a1.7 1.7 0 1 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 1 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 1 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 1 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V4a1.7 1.7 0 1 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 1 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a1.7 1.7 0 1 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2.9Z" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    filter: <><path d="M4 6h16M7 12h10m-7 6h4" /><circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    board: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16m6-16v16" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name] ?? paths.grid}</svg>;
}

function Avatar({ initials, small = false }: { initials: string; small?: boolean }) {
  return <span className={`avatar avatar-${initials.toLowerCase()}${small ? " avatar-small" : ""}`} title={people[initials]}>{initials}</span>;
}

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All issues");
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [toast, setToast] = useState("");
  const [selectedNav, setSelectedNav] = useState("My issues");

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesQuery = `${task.title} ${task.id} ${task.tag}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === "All issues" || task.status === activeFilter;
    return matchesQuery && matchesFilter;
  }), [tasks, query, activeFilter]);

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setTasks((current) => [{ id: `WEB-${143 + current.length - initialTasks.length}`, title, project: "Website redesign", status: "Todo", priority: "Medium", assignee: "AM", due: "No date", tag: "New" }, ...current]);
    setNewTitle("");
    setModalOpen(false);
    setToast("Issue added to your project");
    window.setTimeout(() => setToast(""), 2600);
  }

  function updateStatus(id: string, status: Status) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, status } : task));
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button className="workspace-switcher" aria-label="Switch workspace"><span className="workspace-mark">f</span><span className="workspace-name"><strong>figma.com</strong><small>Workspace</small></span><span className="switch-chevron">⌄</span></button>
        <button className="search-shortcut" onClick={() => document.getElementById("issue-search")?.focus()}><Icon name="search" size={16} /><span>Search</span><kbd>⌘ K</kbd></button>
        <nav className="side-nav" aria-label="Main navigation">
          {[["My issues", "inbox"], ["Projects", "grid"], ["Views", "board"]].map(([label, icon]) => <button key={label} className={`nav-link ${selectedNav === label ? "nav-active" : ""}`} onClick={() => setSelectedNav(label)}><Icon name={icon} size={16} />{label}{label === "My issues" && <span className="nav-count">4</span>}</button>)}
        </nav>
        <div className="side-section"><div className="section-heading"><span>YOUR TEAMS</span><button aria-label="Add a team"><Icon name="plus" size={15} /></button></div><button className="team-link"><span className="team-dot dot-purple">F</span> Figma team <span className="side-dots">···</span></button><button className="team-link"><span className="team-dot dot-blue">M</span> Marketing</button><button className="team-link"><span className="team-dot dot-green">E</span> Engineering</button></div>
        <div className="side-section project-section"><div className="section-heading"><span>FAVORITES</span><button aria-label="Add a favorite"><Icon name="plus" size={15} /></button></div><button className="favorite-link"><span className="favorite-glyph">✳</span> Website redesign</button><button className="favorite-link"><span className="favorite-glyph mint">◈</span> Mobile app 2.0</button></div>
        <div className="sidebar-bottom"><button className="nav-link" onClick={() => setToast("Settings are ready to customize")}><Icon name="settings" size={16} />Settings</button><div className="profile"><Avatar initials="AM" /><div><strong>Ava Mitchell</strong><small>Free plan</small></div><Icon name="more" size={17} /></div></div>
      </aside>

      <section className="main-panel">
        <header className="topbar"><div className="breadcrumbs"><span>Figma team</span><Icon name="chevron" size={14} /><strong>{selectedNav}</strong><Icon name="chevron" size={14} /><span className="muted">Website redesign</span></div><div className="top-actions"><button className="icon-button" aria-label="Open inbox" onClick={() => setToast("You're all caught up")}><Icon name="inbox" size={17} /></button><span className="top-divider" /><button className="invite-button" onClick={() => setToast("Invite link copied to clipboard")}>Share</button><div className="avatar-stack"><Avatar initials="JL" small /><Avatar initials="SK" small /><Avatar initials="MR" small /><span className="avatar avatar-more">+2</span></div><Avatar initials="AM" small /></div></header>

        <div className="content-wrap">
          <div className="project-overline"><span className="project-icon">✳</span> Projects <Icon name="chevron" size={13} /><span>Website redesign</span><button className="plain-icon" aria-label="More project options"><Icon name="more" size={17} /></button></div>
          <div className="project-heading"><div><div className="heading-title-row"><h1>Website redesign</h1><span className="status-pill"><span /> On track</span></div><p>A fresh look for the next chapter of Figma.</p></div><button className="primary-button" onClick={() => setModalOpen(true)}><Icon name="plus" size={16} /> New issue</button></div>
          <div className="project-meta"><div className="meta-item"><span className="meta-label">LEAD</span><Avatar initials="AM" small /><span>Ava Mitchell</span></div><div className="meta-item"><span className="meta-label">DUE DATE</span><Icon name="calendar" size={15} /><span>Oct 31, 2025</span></div><div className="meta-item"><span className="meta-label">CYCLE</span><span className="cycle-badge">Cycle 12</span><span>Oct 13 – Oct 27</span></div></div>
          <div className="progress-wrap"><div className="progress-top"><span>Project progress</span><strong>{Math.round((tasks.filter((task) => task.status === "Done").length / Math.max(tasks.length, 1)) * 100)}% <span className="muted">complete</span></strong></div><div className="progress-bar"><span style={{ width: `${(tasks.filter((task) => task.status === "Done").length / Math.max(tasks.length, 1)) * 100}%` }} /></div></div>
          <div className="content-divider" />
          <div className="board-toolbar"><div className="view-tabs"><button className="view-tab active-tab"><Icon name="board" size={15} /> Board</button><button className="view-tab" onClick={() => setToast("List view coming soon")}>☷ <span>List</span></button><button className="view-tab" onClick={() => setToast("Timeline view coming soon")}>▥ <span>Timeline</span></button></div><div className="board-actions"><div className="filter-select"><Icon name="filter" size={15} /><select value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)} aria-label="Filter issues"><option>All issues</option>{columns.map((column) => <option key={column}>{column}</option>)}</select><span>⌄</span></div><label className="issue-search"><Icon name="search" size={15} /><input id="issue-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search issues" /></label><button className="icon-button" aria-label="More board options" onClick={() => setToast("Board options") }><Icon name="more" size={17} /></button></div></div>

          <div className="board-grid">{columns.map((column) => {
            const columnTasks = visibleTasks.filter((task) => task.status === column);
            return <section className="board-column" key={column}><div className="column-heading"><span className={`column-status status-${column.toLowerCase().replace(" ", "-")}`} />{column}<span className="column-count">{columnTasks.length}</span><button aria-label={`Add ${column} issue`} className="column-add" onClick={() => setModalOpen(true)}><Icon name="plus" size={15} /></button><button aria-label={`More ${column} options`} className="column-more" onClick={() => setToast(`${column} options`)}><Icon name="more" size={16} /></button></div><div className="task-list">{columnTasks.map((task) => <article className="task-card" key={task.id}><div className="task-card-top"><span className="issue-id">{task.id}</span><button className="card-more" aria-label={`More options for ${task.id}`} onClick={() => setToast(`Options for ${task.id}`)}><Icon name="more" size={16} /></button></div><h3>{task.title}</h3><div className="task-tags"><span className={`tag tag-${task.tag.toLowerCase()}`}>{task.tag}</span><span className={`priority priority-${task.priority.toLowerCase()}`}><span />{task.priority}</span></div><div className="task-footer"><div><Avatar initials={task.assignee} small /><span className={task.due === "Today" ? "due-today" : "due-label"}>{task.due}</span></div><label className="status-edit"><span className="sr-only">Status for {task.id}</span><select aria-label={`Status for ${task.id}`} value={task.status} onChange={(event) => updateStatus(task.id, event.target.value as Status)}>{columns.map((item) => <option key={item}>{item}</option>)}</select><span>⌄</span></label></div></article>)}{columnTasks.length === 0 && <div className="empty-column">No issues here yet</div>}<button className="add-issue" onClick={() => setModalOpen(true)}><Icon name="plus" size={15} /> Add issue</button></div></section>;
          })}</div>
        </div>
      </section>

      {modalOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}><form className="issue-modal" onSubmit={addTask}><div className="modal-heading"><div><span className="modal-kicker">WEBSITE REDESIGN</span><h2>Create a new issue</h2></div><button type="button" className="plain-icon" aria-label="Close" onClick={() => setModalOpen(false)}><Icon name="close" size={19} /></button></div><label className="form-label" htmlFor="new-issue-title">Issue title</label><input autoFocus id="new-issue-title" className="title-input" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="What needs to get done?" required maxLength={100} /><div className="modal-note">Your issue will be added to the Todo column.</div><div className="modal-footer"><button type="button" className="cancel-button" onClick={() => setModalOpen(false)}>Cancel</button><button className="primary-button" type="submit"><Icon name="plus" size={15} /> Create issue</button></div></form></div>}
      {toast && <div className="toast" role="status">{toast}<button onClick={() => setToast("")} aria-label="Dismiss notification"><Icon name="close" size={14} /></button></div>}
    </main>
  );
}
