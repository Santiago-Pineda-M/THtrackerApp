/**
 * APPLICATION LAYER - SaveSidebarStateUseCase
 * Caso de uso para guardar el estado del Sidebar en el repositorio.
 */

import type { IUseCase } from '../../../Domain/IPatterns';
import type { ISidebarRepository } from '../../../Domain/Repositories/ISidebarRepository';
import { SidebarState } from '../../../Domain/Entities/SidebarState';

export interface SaveSidebarStateInput {
    isMenuOpen: boolean;
}

export class SaveSidebarStateUseCase implements IUseCase<SaveSidebarStateInput, void> {
    private readonly sidebarRepository: ISidebarRepository;

    constructor(sidebarRepository: ISidebarRepository) {
        this.sidebarRepository = sidebarRepository;
    }

    async execute(input: SaveSidebarStateInput): Promise<void> {
        const sidebarState = SidebarState.create({
            isMenuOpen: input.isMenuOpen
        });
        this.sidebarRepository.saveState(sidebarState);
    }
}
