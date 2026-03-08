use bolt_lang::*;
use ephemeral_rollups_sdk::ephemeral;
use prediction::Prediction;

declare_id!("DHB1zodaXgDG4n7W1KqjooVhQ3bc5vm3ZMEDkaSjMk9d");

#[ephemeral]
#[system]
pub mod resolve {

    pub fn execute(ctx: Context<Components>, args_p: Vec<u8>) -> Result<Components> {
        let prediction = &mut ctx.accounts.prediction;

        // Ensure args_p has enough bytes (8 bytes for u64)
        if args_p.len() < 8 {
            return Ok(ctx.accounts);
        }

        let final_price_bytes: [u8; 8] = args_p[0..8].try_into().unwrap();
        let final_price = u64::from_le_bytes(final_price_bytes);

        let is_up = final_price > prediction.strike_price;

        // 1 = Up, 2 = Down
        if (prediction.direction == 1 && is_up) || (prediction.direction == 2 && !is_up) {
            prediction.resolved_status = 1; // Won
        } else {
            prediction.resolved_status = 2; // Lost
        }

        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub prediction: Prediction,
    }
}
