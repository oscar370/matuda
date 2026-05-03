import { A } from "@solidjs/router";
import { House } from "lucide-solid";
import { JSX } from "solid-js";

type SidebarProps = {
  children: JSX.Element;
};

const ITEMS = [{ to: "/", title: "Home", icon: House }];

export function Sidebar(props: SidebarProps) {
  return (
    <div class="drawer md:drawer-open">
      <input id="sidebar" type="checkbox" class="drawer-toggle" />

      <div class="drawer-content">{props.children}</div>

      <div class="drawer-side is-drawer-close:overflow-visible">
        <label
          for="sidebar"
          aria-label="close sidebar"
          class="drawer-overlay"
        />

        <div class="bg-base-200 is-drawer-close:w-16 is-drawer-open:w-64 flex min-h-full flex-col items-start">
          <ul class="menu w-full grow">
            {ITEMS.map((i) => {
              const Icon = i.icon;
              return (
                <li>
                  <A
                    href={i.to}
                    class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip={i.title}
                    activeClass="menu-active"
                  >
                    <Icon />
                    <span class="is-drawer-close:hidden">{i.title}</span>
                  </A>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
