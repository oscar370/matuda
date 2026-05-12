import { JSX } from "solid-js";

type SidebarProps = {
  children: JSX.Element;
};

export function Sidebar(props: SidebarProps) {
  return (
    <div class="drawer md:drawer-open">
      <input id="sidebar" type="checkbox" class="drawer-toggle" />

      {props.children}
    </div>
  );
}

type SidebarPanelProps = {
  children: JSX.Element;
};

export function SidebarPanel(props: SidebarPanelProps) {
  return (
    <div class="drawer-side is-drawer-close:overflow-visible">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label for="sidebar" aria-label="close sidebar" class="drawer-overlay" />
      <div class="bg-base-200 is-drawer-close:w-16 is-drawer-open:w-64 flex min-h-full flex-col items-start">
        {props.children}
      </div>
    </div>
  );
}

type SidebarContentProps = {
  children: JSX.Element;
};

export function SidebarContent(props: SidebarContentProps) {
  return <div class="drawer-content overflow-hidden">{props.children}</div>;
}
