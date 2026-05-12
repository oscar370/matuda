import { A, RouteSectionProps } from "@solidjs/router";
import { FileText, Settings, Terminal } from "lucide-solid";
import { For } from "solid-js";
import { Sidebar, SidebarContent, SidebarPanel } from "./sidebar";

const ITEMS = [
  { to: "/service", title: "Service", icon: Terminal },
  { to: "/config", title: "Matugen config", icon: FileText },
  { to: "/settings", title: "Settings", icon: Settings },
];

export default function AppLayout(props: RouteSectionProps) {
  return (
    <Sidebar>
      <SidebarContent>{props.children}</SidebarContent>

      <SidebarPanel>
        <ul class="menu w-full grow gap-1">
          <For each={ITEMS}>
            {(i) => {
              const Icon = i.icon;
              return (
                <li>
                  <A
                    href={i.to}
                    class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip={i.title}
                    activeClass="menu-active"
                    end
                  >
                    <Icon />
                    <span class="is-drawer-close:hidden">{i.title}</span>
                  </A>
                </li>
              );
            }}
          </For>
        </ul>
      </SidebarPanel>
    </Sidebar>
  );
}
