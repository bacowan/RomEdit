import { Menu, MenuItem, Submenu } from "@tauri-apps/api/menu";
import { act } from "react";

const setupMenu = async (actions: MenuActions) => {
    const fileSubmenu = await Submenu.new({
        text: 'File',
        items: [
          await MenuItem.new({
            id: 'new-project',
            text: 'New Project',
            action: () => {
              actions.newProjectAction();
            },
          }),
          await MenuItem.new({
            id: 'open-project',
            text: 'Open Project',
            action: () => {
              actions.loadProjectAction();
            },
          }),
          await MenuItem.new({
            id: 'save-project',
            text: 'Save Project',
            action: () => {
                console.log('Save Project pressed');
            },
          })
        ]
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