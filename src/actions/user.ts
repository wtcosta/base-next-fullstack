'use server'

import { revalidatePath } from "next/cache";
import type { UserStatus, UserRole } from "@prisma/client";
import { userService } from "@/services/user";

interface RoleSelection {
  role: UserRole;
}

export async function handleCreateUser(formData: FormData) {
  try {
    const roles = JSON.parse(formData.get('roles') as string) as RoleSelection[];

    await userService.createUser({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      status: formData.get('status') as UserStatus,
      roles: {
        create: roles.map((r) => ({
          role: r.role
        }))
      }
    });

    revalidatePath('/users');
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao criar usuário');
  }
}

export async function handleUpdateUser(userId: string, formData: FormData) {
  try {
    const roles = JSON.parse(formData.get('roles') as string) as RoleSelection[];

    const data = {
      name: formData.get('name') as string,
      status: formData.get('status') as UserStatus,
      password: formData.get('password') as string,
      roles: {
        deleteMany: {},
        create: roles.map(r => ({
          role: r.role
        }))
      }
    }

    await userService.updateUser(userId, data)
    
    revalidatePath('/users');
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao atualizar usuário');
  }
}