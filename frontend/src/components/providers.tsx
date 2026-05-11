import { RouteSectionProps } from "@solidjs/router";
import { Toaster } from "solid-sonner";

export function Providers(props: RouteSectionProps) {
  return (
    <>
      {props.children}

      <Toaster
        theme="system"
        closeButton
        toastOptions={{
          classNames: { toast: "bg-base-200!", closeButton: "bg-base-200!" },
        }}
      />
    </>
  );
}
