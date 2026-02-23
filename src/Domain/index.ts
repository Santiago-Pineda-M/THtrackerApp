/**
 * DOMAIN LAYER - Barrel Exports (actualizado)
 * Punto de entrada único para importar desde la capa de Dominio.
 */
export { Ploc } from './Ploc';
export type { IUseCase } from './Interfaces/IUseCase';
export type { IHttpClient, HttpResponse } from './Interfaces/IHttpClient';
export type { IStorage } from './Interfaces/IStorage';
export * from './Auth/AuthStatus';
export * from './Auth/AuthEntities';
