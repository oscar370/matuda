use crate::components::Button;
use dioxus::prelude::*;

#[component]
pub fn Home() -> Element {
    rsx! {
        div {
            Button { class: "w-full", "Init App" }
        }
    }
}
