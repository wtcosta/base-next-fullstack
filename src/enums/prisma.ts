import type { UserRole, UserStatus } from "@prisma/client";

export const UserRoleLabel: Record<UserRole, string> = {
  USUARIO: 'Usuário',
  ADMINISTRADOR: 'Administrador',
  SUPERADMIN: 'Super Admin'
} as const;

export const UserStatusLabel: Record<UserStatus, string> = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  PENDENTE: 'Pendente'
} as const;
