use super::sidebar::*;
use crate::Route;
use dioxus::prelude::*;

#[component]
pub fn SidebarApp() -> Element {
    rsx! {
      SidebarProvider {
        Sidebar {
          side: SidebarSide::Left,
          variant: SidebarVariant::Sidebar,
          collapsible: SidebarCollapsible::Offcanvas,

          SidebarHeader { class: "items-center justify-center", "Matuda" }

          SidebarContent {
            SidebarGroup {
              SidebarGroupContent {
                SidebarMenu {
                  SidebarMenuItem {
                    SidebarMenuButton { is_active: true, "Home" }
                  }
                }
              }
            }
          }
        }

        SidebarRail {}

        SidebarInset { class: "w-full",
          header { class: "flex h-10 items-center px-1", SidebarTrigger {} }

          div { class: "container mx-auto flex flex-col gap-2 px-1 py-4",
            Outlet::<Route> {}
          }
        
        }
      }
    }
}
