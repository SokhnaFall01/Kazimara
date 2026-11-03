"use client";

import type { KazimaraApi } from "./client";
import { apiMock } from "./mock";

export type { KazimaraApi } from "./client";
export * from "./types";

/**
 * Point d'entrée unique. Quand l'API NestJS sera prête, on ajoutera `apiHttp`
 * (client généré depuis l'OpenAPI) et on basculera avec NEXT_PUBLIC_API_MODE=http.
 */
export const api: KazimaraApi = apiMock;
