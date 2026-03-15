/**
 * CONTROLLERS LAYER - Health Module
 * Ploc que gestiona el estado de la pantalla de Health Check.
 * Es TypeScript puro, sin dependencias de React.
 */
import { Ploc } from "../../Domain/Ploc";
import { GetHealthUseCase } from "../../Application/UseCases/Health/GetHealthUseCase";

export interface IHealthState {
    isAlive: boolean;
    isLoading: boolean;
    lastChecked?: Date;
}

export class HealthPloc extends Ploc<IHealthState> {
    private readonly getHealthUseCase: GetHealthUseCase;

    constructor(getHealthUseCase: GetHealthUseCase) {
        super({ isAlive: false, isLoading: false });
        this.getHealthUseCase = getHealthUseCase;
    }

    async checkHealth(): Promise<void> {
        this.changeState({ ...this.state, isLoading: true });
        const isAlive = await this.getHealthUseCase.execute();
        this.changeState({
            isAlive,
            isLoading: false,
            lastChecked: new Date(),
        });
    }
}
