interface MenuActions {
    newProjectAction: () => void;
    loadProjectAction: () => void;
}

interface ProjectLoadedEventParams {
    path: string,
    size: number
}