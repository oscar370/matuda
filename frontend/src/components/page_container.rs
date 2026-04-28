use dioxus::prelude::*;

#[component]
pub fn PageContainer(children: Element) -> Element {
    rsx! {
      main { class: "container mx-auto flex flex-col gap-2 px-1 py-4", {children} }
    }
}
