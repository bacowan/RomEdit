use serde::Serialize;
use serde::Deserialize;

#[derive(Serialize, Deserialize)]
pub struct Project {
    pub name: String,
    pub rom_path: String
}