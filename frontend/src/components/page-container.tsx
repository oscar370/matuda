import { useLocation, useNavigate } from "@solidjs/router";
import { ChevronLeft, PanelLeft } from "lucide-solid";
import { createEffect, createMemo, createSignal, JSX } from "solid-js";

let internalHistoryCount = 0;
const [canGoBack, setCanGoBack] = createSignal(false);

export function useNavigationLogic() {
  const location = useLocation();

  createEffect(() => {
    location.pathname;
    internalHistoryCount++;
    setCanGoBack(internalHistoryCount > 1);
  });

  const isSubPage = (depth: number) => {
    return location.pathname.split("/").filter(Boolean).length > depth;
  };

  return { canGoBack, isSubPage };
}

type PageContainerProps = {
  title: string;
  actions?: JSX.Element;
  children: JSX.Element;
};

export function PageContainer(props: PageContainerProps) {
  return (
    <div class="w-full">
      <header class="grid h-12 w-full grid-cols-3 items-center justify-center px-1">
        <div class="flex">
          <label
            aria-label="toggle sidebar"
            for="sidebar"
            class="btn btn-ghost size-8 p-1"
          >
            <PanelLeft />
          </label>

          <BackButton />
        </div>

        <h1 class="text-center font-bold">{props.title}</h1>

        {props.actions}
      </header>

      <main class="container mx-auto flex flex-col gap-2 px-1 py-4">
        {props.children}
      </main>
    </div>
  );
}

function BackButton() {
  const navigate = useNavigate();
  const { canGoBack, isSubPage } = useNavigationLogic();
  const showBackButton = createMemo(() => isSubPage(2) && canGoBack());

  return (
    <li class="list-none items-start">
      <button
        aria-label="Back to the previous page"
        class="btn btn-ghost size-8 p-1"
        disabled={!showBackButton()}
        onClick={() => navigate(-1)}
      >
        <ChevronLeft />
      </button>
    </li>
  );
}
