import type { UserWithRoles } from "@/_types/prisma/user";
import db from "./_db";
import type { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

export const userService = {
  async findAll() {
    try {
      const users = await db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          roles: {
            select: {
              role: true
            }
          },
          image: true,
          createdAt: true,
        },
        orderBy: {
          name: 'asc'
        }
      });
  
      return users as UserWithRoles[];
    } catch (error) {
      console.error(error)
      throw new Error('Erro ao buscar usuários');
    }
  },

  async findById(userId: string) {
    return await db.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          select: {
            role: true
          }
        }
      }
    });
  },
  
  async isUserAdmin(userId: string): Promise<boolean> {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        roles: true
      }
    });
  
    return user?.roles.some(role => ['ADMINISTRADOR', 'SUPERADMIN'].includes(role.role)) ?? false;
  },

  async createUser(data: Prisma.UserCreateInput) {
    try {
      const hashedPassword = await bcrypt.hash(data.password as string, 10);

      return await db.user.create({
        data: data,
        password: hashedPassword as never
      });
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao criar usuário');
    }
  },
  
  async updateUser(userId: string, data: Prisma.UserUpdateInput) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password as string, 10);
    }
    return await db.user.update({
      where: { id: userId },
      data: data
    });
  }
}