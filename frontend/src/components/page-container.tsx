import { PanelLeft } from "lucide-solid";
import { JSX } from "solid-js";

type PageContainerProps = {
  title: string;
  actions?: JSX.Element;
  children: JSX.Element;
};

export function PageContainer(props: PageContainerProps) {
  return (
    <div class="w-full">
      <header class="grid h-13 w-full grid-cols-3 items-center justify-center px-1">
        <div class="flex">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label
            aria-label="toggle sidebar"
            for="sidebar"
            class="btn btn-ghost size-8 p-1 md:hidden"
          >
            <PanelLeft />
          </label>
        </div>

        <h1 class="col-end-3 text-center font-bold">{props.title}</h1>

        {props.actions}
      </header>

      <main class="animate-slide-in mx-auto flex max-w-150 flex-col gap-4 px-1 py-4">
        {props.children}
      </main>
    </div>
  );
}
