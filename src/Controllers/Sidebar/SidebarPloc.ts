/**
 * CONTROLLER LAYER - SidebarPloc
 * Ploc para gestionar el estado del Sidebar con persistencia en localStorage.
 */

import { Ploc } from '../../Domain/Ploc';
import type { ISidebarState } from '../../Domain';
import { initialSidebarState } from '../../Domain';

// Importar casos de uso
import type { GetSidebarStateUseCase, SaveSidebarStateUseCase } from '../../Application/UseCases/Sidebar';

export class SidebarPloc extends Ploc<ISidebarState> {
    private readonly getSidebarStateUseCase: GetSidebarStateUseCase;
    private readonly saveSidebarStateUseCase: SaveSidebarStateUseCase;

    constructor(
        getSidebarStateUseCase: GetSidebarStateUseCase,
        saveSidebarStateUseCase: SaveSidebarStateUseCase
    ) {
        super(initialSidebarState);
        this.getSidebarStateUseCase = getSidebarStateUseCase;
        this.saveSidebarStateUseCase = saveSidebarStateUseCase;
    }

    async init(): Promise<void> {
        try {
            const sidebarState = await this.getSidebarStateUseCase.execute();
            this.changeState({
                isMenuOpen: sidebarState.isMenuOpen
            });
        } catch {
            // Si falla, usar estado por defecto
            this.changeState(initialSidebarState);
        }
    }

    toggleMenu(): void {
        const newIsMenuOpen = !this.state.isMenuOpen;
        this.changeState({
            isMenuOpen: newIsMenuOpen
        });
        // Persistir el nuevo estado
        this.saveState(newIsMenuOpen);
    }

    private async saveState(isMenuOpen: boolean): Promise<void> {
        try {
            await this.saveSidebarStateUseCase.execute({ isMenuOpen });
        } catch (error) {
            console.error('[SidebarPloc] Error al guardar el estado:', error);
        }
    }
}
