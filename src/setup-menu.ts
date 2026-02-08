import { Menu, MenuItem, Submenu } from "@tauri-apps/api/menu";

const setupMenu = async () => {
    const fileSubmenu = await Submenu.new({
        text: 'File',
        items: [
          await MenuItem.new({
            id: 'new-project',
            text: 'New Project',
            action: () => {
              console.log('New Project pressed');
            },
          }),
          await MenuItem.new({
            id: 'open-project',
            text: 'Open Project',
            action: () => {
              console.log('Open Project pressed');
            },
          }),
          await MenuItem.new({
            id: 'save-project',
            text: 'Save Project',
            action: () => {
                console.log('Save Project pressed');
            },
          }),
          await MenuItem.new({
            id: 'open-rom',
            text: 'Open ROM',
            action: () => {
                console.log('Open ROM pressed');
            },
          }),
        ],
    });
    const editSubmenu = await Submenu.new({
        text: 'Edit',
        items: [
            await MenuItem.new({
                id: 'undo',
                text: 'Undo',
                action: () => {
                    console.log('Undo pressed');
                },
            }),
            await MenuItem.new({
                id: 'redo',
                text: 'Redo',
                action: () => {
                    console.log('Redo pressed');
                },
            }),
        ]
    });
    const menu = await Menu.new({
        items: [fileSubmenu, editSubmenu],
    });
    
    menu.setAsAppMenu();
}

export default setupMenu;