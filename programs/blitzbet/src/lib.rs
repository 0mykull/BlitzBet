use bolt_lang::prelude::*;
use prediction::Prediction;

declare_id!("9PsgRUyaxqZBbCKXELZuu3sPVzzuw8S7xxFUNkycoDfB");

#[program]
pub mod blitzbet {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, args: InitializeArgs) -> Result<()> {
        let prediction = &mut ctx.accounts.prediction;
        prediction.wager = args.wager;
        prediction.strike_price = args.strike_price;
        prediction.direction = args.direction;
        prediction.resolved_status = 0;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8 + 8 + 1 + 1)]
    pub prediction: Account<'info, Prediction>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct InitializeArgs {
    pub wager: u64,
    pub strike_price: u64,
    pub direction: u8,
}
