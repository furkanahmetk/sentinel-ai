#![no_std]
#![no_main]

#[cfg(target_arch = "wasm32")]
extern crate alloc;

#[path = "marketplace.rs"]
pub mod marketplace;
