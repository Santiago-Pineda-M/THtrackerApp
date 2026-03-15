/**
 * DOMAIN LAYER - Auth Module
 * Tipos de dominio de autenticación que no son entidades completas.
 */

/**
 * Representación del usuario autenticado tal como se expone al estado de la UI.
 */
export interface IUserSession {
    id: string;
    name: string;
    email: string;
}
