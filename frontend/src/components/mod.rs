//! The components module contains all shared components for our app. Components are the building blocks of dioxus apps.
//! They can be used to defined common UI elements like buttons, forms, and modals. In this template, we define a Hero
//! component and an Echo component for fullstack apps to be used in our app.

mod hero;
pub use hero::Hero;

mod echo;
pub use echo::Echo;

pub mod button;
pub use button::*;

pub mod sheet;
pub use sheet::*;

pub mod sidebar;
pub use sidebar::*;

pub mod sidebar_app;
pub use sidebar_app::*;

pub mod separator;
pub use separator::*;

pub mod tooltip;
pub use tooltip::*;

pub mod page_container;
pub use page_container::*;
