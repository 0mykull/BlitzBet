use bolt_lang::*;

declare_id!("BY8jon3Y6BdquDY8pQQuamYDU3MJArWDiZktqvN6r39k");

#[component]
#[derive(Default)]
pub struct Position {
    pub x: i64,
    pub y: i64,
    pub z: i64,
    #[max_len(20)]
    pub description: String,
}