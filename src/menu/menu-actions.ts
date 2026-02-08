import { invoke } from '@tauri-apps/api/core';

export const openRomAction = () => {
    invoke('open_rom_file');
}
