/**
 * APPLICATION LAYER - GetSidebarStateUseCase
 * Caso de uso para obtener el estado del Sidebar desde el repositorio.
 */

import type { IUseCase } from '../../../Domain/IPatterns';
import type { ISidebarRepository } from '../../../Domain/Repositories/ISidebarRepository';
import { SidebarState } from '../../../Domain/Entities/SidebarState';

export class GetSidebarStateUseCase implements IUseCase<void, SidebarState> {
    private readonly sidebarRepository: ISidebarRepository;

    constructor(sidebarRepository: ISidebarRepository) {
        this.sidebarRepository = sidebarRepository;
    }

    async execute(): Promise<SidebarState> {
        return this.sidebarRepository.getState();
    }
}
