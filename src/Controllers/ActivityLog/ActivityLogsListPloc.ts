import { Ploc, initialActivityLogsListState } from '../../Domain';
import type { IActivityLogsListState } from '../../Domain';
import type { GetActivityLogsUseCase, StartActivityLogUseCase, StopActivityLogUseCase } from '../../Application/UseCases/ActivityLog';

export class ActivityLogsListPloc extends Ploc<IActivityLogsListState> {
    private readonly getActivityLogsUseCase: GetActivityLogsUseCase;
    private readonly startActivityLogUseCase: StartActivityLogUseCase;
    private readonly stopActivityLogUseCase: StopActivityLogUseCase;

    constructor(
        getActivityLogsUseCase: GetActivityLogsUseCase,
        startActivityLogUseCase: StartActivityLogUseCase,
        stopActivityLogUseCase: StopActivityLogUseCase
    ) {
        super(initialActivityLogsListState);
        this.getActivityLogsUseCase = getActivityLogsUseCase;
        this.startActivityLogUseCase = startActivityLogUseCase;
        this.stopActivityLogUseCase = stopActivityLogUseCase;
    }

    async getLogs(activityId: string) {
        this.changeState({ ...this.state, activityId, isLoading: true, error: null });

        const result = await this.getActivityLogsUseCase.execute({ activityId });

        if (result.success) {
            this.changeState({
                ...this.state,
                logs: result.logs,
                isLoading: false,
            });
        } else {
            this.changeState({
                ...this.state,
                error: result.error,
                isLoading: false,
            });
        }
    }

    async startLog() {
        if (!this.state.activityId) return;

        this.changeState({ ...this.state, isLoading: true, error: null });

        const result = await this.startActivityLogUseCase.execute({ activityId: this.state.activityId });

        if (result.success) {
            // Añadir el nuevo registro al inicio de la lista
            this.changeState({
                ...this.state,
                logs: [result.log, ...this.state.logs],
                isLoading: false,
            });
        } else {
            this.changeState({
                ...this.state,
                error: result.error,
                isLoading: false,
            });
        }
    }

    async stopLog(logId: string) {
        this.changeState({ ...this.state, isLoading: true, error: null });

        const result = await this.stopActivityLogUseCase.execute({ logId });

        if (result.success) {
            // Actualizar el log en la lista con la hora de fin y la duración calculada
            const updatedLogs = this.state.logs.map(log =>
                log.id === logId ? result.log : log
            );
            this.changeState({
                ...this.state,
                logs: updatedLogs,
                isLoading: false,
            });
        } else {
            this.changeState({
                ...this.state,
                error: result.error,
                isLoading: false,
            });
        }
    }

    reset() {
        this.changeState(initialActivityLogsListState);
    }
}
