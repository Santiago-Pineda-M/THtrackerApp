import {
  Ploc,
  initialActivityLogStopState,
  type IActivityLogStopState,
} from '../../Domain'
import { StopActivityLogUseCase } from '../../Application/UseCases/ActivityLog/StopActivityLogUseCase'
import {
  SaveActivityLogValuesUseCase,
  type SaveLogValuesCommand,
} from '../../Application/UseCases/ActivityLog/SaveActivityLogValuesUseCase'
import type {
  ActivityLogResponse,
  ProblemDetails,
} from '../../Application/UseCases/ActivityLog/StopActivityLogUseCase'
import {
  GetListActivityValueDefinitionUseCase,
  type GetListActivityValueDefinitionPaginatedResponse,
} from '../../Application/UseCases/ActivityValueDefinition'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

/**
 * Interfaz auxiliar para tipar el usuario autenticado que debe exponer la clase base Ploc.
 * Ajústala según la entidad real de tu dominio.
 */
interface AuthenticatedUser {
  id: string
}

/**
 * PLOC encargado del flujo de cierre (Stop) de un registro de actividad.
 *
 * Responsabilidades:
 * 1. Cargar las definiciones de valor asociadas a la actividad.
 * 2. Detener el registro de actividad.
 * 3. Guardar opcionalmente los valores capturados en el formulario.
 * 4. Gestionar los estados de carga, errores y éxito.
 */
export class ActivityLogStopPloc extends Ploc<IActivityLogStopState> {
  private readonly stopActivityLogUseCase: StopActivityLogUseCase
  private readonly getDefinitionsUseCase: GetListActivityValueDefinitionUseCase
  private readonly saveValuesUseCase: SaveActivityLogValuesUseCase

  constructor(
    stopActivityLogUseCase: StopActivityLogUseCase,
    getDefinitionsUseCase: GetListActivityValueDefinitionUseCase,
    saveValuesUseCase: SaveActivityLogValuesUseCase
  ) {
    super(initialActivityLogStopState)
    this.stopActivityLogUseCase = stopActivityLogUseCase
    this.getDefinitionsUseCase = getDefinitionsUseCase
    this.saveValuesUseCase = saveValuesUseCase
  }

  /**
   * Prepara el cierre de una actividad cargando sus definiciones de valor.
   *
   * @param log - Registro de actividad que se desea detener.
   */
  async prepareStop(log: ActivityLogResponse): Promise<void> {
    this.changeState({
      ...this.state,
      logToStop: log,
      isLoadingDefinitions: true,
      errors: {},
      success: false,
    })

    try {
      const result = await this.getDefinitionsUseCase.execute({
        path: { activityId: log.activityId ?? '' },
        filters: undefined,
      })

      if (this.isDefinitionsSuccess(result)) {
        this.changeState({
          ...this.state,
          definitions: result,
          isLoadingDefinitions: false,
        })
        return
      }

      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        isLoadingDefinitions: false,
        errors: mappedErrors,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        isLoadingDefinitions: false,
        errors: { general: [message] },
      })
    }
  }

  /**
   * Detiene el registro de actividad y guarda los valores del formulario.
   *
   * @param logId - Identificador del log a detener.
   * @param values - Objeto que contiene la lista de ítems con valores a guardar.
   *                 Estructura: { items?: { id?: string; value?: string | null }[] }
   */
  async stopAndSaveValues(
    logId: string,
    values: { items?: Array<{ id?: string; value?: string | null }> }
  ): Promise<void> {
    const safeItems = values?.items ?? []

    this.changeState({
      ...this.state,
      isStopping: true,
      errors: {},
    })

    try {
      const stopResult = await this.stopActivityLogUseCase.execute({
        id: logId,
      })

      // Obtención tipada del usuario autenticado.
      // NOTA: La clase base Ploc debe exponer una propiedad `user` del tipo adecuado.
      // Si no es el caso, reemplaza esta obtención por la inyección real del usuario.
      const currentUser = (this as unknown as { user?: AuthenticatedUser }).user
      const userId = currentUser?.id ?? ''

      const requests: SaveLogValuesCommand = {
        activityLogId: logId,
        values: safeItems.map((item) => ({
          activityValueDefinitionId: item.id,
          value: item.value ?? null,
        })),
        userId,
      }

      if (this.isStopLogSuccess(stopResult)) {
        if (safeItems.length > 0) {
          // Llamada al caso de uso de guardado. La estructura { id: { id: logId }, requests }
          // debe coincidir con lo que espera SaveActivityLogValuesUseCase.execute().
          const saveResult = await this.saveValuesUseCase.execute({
            id: { id: logId },
            requests: requests,
          })

          if (this.isSaveValuesError(saveResult)) {
            const mappedErrors = mapProblemDetailsToErrors(saveResult)
            this.changeState({
              ...this.state,
              isStopping: false,
              errors: mappedErrors,
            })
            return
          }
        }

        // Éxito total: log detenido y valores guardados (si aplicaba)
        this.changeState({
          ...this.state,
          isStopping: false,
          success: true,
          logToStop: stopResult,
        })
        return
      }

      // Error al detener el log
      const mappedErrors = mapProblemDetailsToErrors(stopResult)
      this.changeState({
        ...this.state,
        isStopping: false,
        errors: mappedErrors,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        isStopping: false,
        errors: { general: [message] },
      })
    }
  }

  /**
   * Type guard: la respuesta de obtención de definiciones es exitosa.
   */
  private isDefinitionsSuccess(
    result: GetListActivityValueDefinitionPaginatedResponse | ProblemDetails
  ): result is GetListActivityValueDefinitionPaginatedResponse {
    return 'items' in result
  }

  /**
   * Type guard: la respuesta del stop es un ActivityLogResponse válido.
   */
  private isStopLogSuccess(
    result: ActivityLogResponse | ProblemDetails
  ): result is ActivityLogResponse {
    return 'id' in result && 'activityId' in result
  }

  /**
   * Type guard: la respuesta del guardado de valores indica error (ProblemDetails).
   */
  private isSaveValuesError(
    result: void | ProblemDetails
  ): result is ProblemDetails {
    return result !== undefined && 'type' in result
  }

  /**
   * Cancela el proceso de cierre y restablece el estado inicial.
   */
  cancelStop(): void {
    this.changeState(initialActivityLogStopState)
  }

  /**
   * Resetea el estado a sus valores por defecto.
   */
  reset(): void {
    this.changeState(initialActivityLogStopState)
  }
}
