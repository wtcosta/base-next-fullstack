"use client";

import { useSession } from "next-auth/react";
import { useCallback, useMemo } from "react";
import type { UserRole } from "@prisma/client";
import { UserRoleLabel } from "@/enums/prisma";

/**
 * Hook para gerenciar permissões do usuário.
 * Fornece funções úteis para verificar papéis e autenticação do usuário.
 * 
 * @returns Objeto com funções e dados relacionados às permissões do usuário
 */
export function useUserPermissions() {
  // Obtém os dados da sessão do usuário usando NextAuth
  const { data: session } = useSession();
  
  // Memoriza os papéis do usuário para evitar recálculos desnecessários
  const userRoles = useMemo(() => session?.user?.roles || [], [session]);
  
  /**
   * Verifica se o usuário possui um papel específico
   * @param role - O papel a ser verificado
   * @returns true se o usuário possui o papel, false caso contrário
   */
  const hasRole = useCallback((role: UserRole) => {
    return userRoles.includes(role);
  }, [userRoles]);
  
  /**
   * Verifica se o usuário possui pelo menos um dos papéis especificados
   * Se nenhum papel for especificado, retorna true
   * @param roles - Array de papéis a serem verificados
   * @returns true se o usuário possui pelo menos um dos papéis ou se nenhum papel foi especificado
   */
  const hasAnyRole = useCallback((roles: UserRole[]) => {
    if (!roles || roles.length === 0) return true;
    return roles.some(role => userRoles.includes(role));
  }, [userRoles]);
  
  /**
   * Verifica se o usuário possui todos os papéis especificados
   * Se nenhum papel for especificado, retorna true
   * @param roles - Array de papéis a serem verificados
   * @returns true se o usuário possui todos os papéis ou se nenhum papel foi especificado
   */
  const hasAllRoles = useCallback((roles: UserRole[]) => {
    if (!roles || roles.length === 0) return true;
    return roles.every(role => userRoles.includes(role));
  }, [userRoles]);
  
  /**
   * Obtém os rótulos (labels) dos papéis do usuário em formato legível
   * Exemplo: 'ADMIN' -> 'Administrador'
   * @returns Array com os rótulos dos papéis do usuário
   */
  const getUserRoleLabels = useCallback(() => {
    return userRoles.map(role => UserRoleLabel[role]);
  }, [userRoles]);
  
  return {
    userRoles,
    userRoleLabels: getUserRoleLabels(),
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAuthenticated: !!session?.user
  };
} 