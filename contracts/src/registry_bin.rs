#![no_std]
#![no_main]

#[cfg(target_arch = "wasm32")]
extern crate alloc;

#[path = "registry.rs"]
pub mod registry;
