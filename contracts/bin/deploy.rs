use odra::prelude::*;
use std::env;
use sentinel_contracts::marketplace::Marketplace;
use sentinel_contracts::registry::InvestigationRegistry;
use odra::host::{Deployer, InstallConfig, NoArgs};
use odra_casper_livenet_env;

pub fn main() {
    env::set_var("ODRA_CASPER_LIVENET_ENV", "casper_livenet.env");
    let env = odra_casper_livenet_env::env();
    env.set_gas(750_000_000_000u64); // 750 CSPR

    println!("Deploying Marketplace...");
    let marketplace = Marketplace::deploy_with_cfg(&env, NoArgs, InstallConfig::upgradable::<Marketplace>());
    let mk_address = format!("{:?}", marketplace.address());
    println!("Marketplace deployed at: {}", mk_address);

    println!("Deploying InvestigationRegistry...");
    let registry = InvestigationRegistry::deploy_with_cfg(&env, NoArgs, InstallConfig::upgradable::<InvestigationRegistry>());
    let reg_address = format!("{:?}", registry.address());
    println!("InvestigationRegistry deployed at: {}", reg_address);

    println!("✅ Deployment Successful!");
}
