use anchor_lang::prelude::*;

declare_id!("8CfNbqPDAVDWZhTWEKg475aRzERSkXhRd4R37CHBShhQ");

#[program]
pub mod whitelist_token_sale {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
