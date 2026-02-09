use memmap2::Mmap;

#[derive(Default)]
pub struct AppState {
    pub rom_file_map: Option<Mmap>,
}