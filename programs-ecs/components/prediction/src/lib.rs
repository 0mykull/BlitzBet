use bolt_lang::*;

declare_id!("B3fMRhqjewwf938pybLncA4o1wErSvzMhQfGg7EkDani");

#[component]
#[derive(Default)]
pub struct Prediction {
    pub wager: u64,
    pub strike_price: u64,
    pub direction: u8,       // 1 = Up, 2 = Down
    pub resolved_status: u8, // 0 = Pending, 1 = Won, 2 = Lost
}
