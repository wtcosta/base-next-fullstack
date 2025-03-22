import type { UserStatus, UserRole } from "@prisma/client";

import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import db from "./_db";
import bcrypt from "bcrypt";

// Definindo uma interface para o usuário estendido
interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  status?: UserStatus | null;
  roles?: UserRole[] | null;
}

// Estendendo os tipos do NextAuth
declare module "next-auth" {
  // Estendendo a interface User para incluir nossos campos personalizados
  interface User {
    status?: UserStatus | null;
    roles?: UserRole[] | null;
  }
  
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      status?: UserStatus | null;
      roles?: UserRole[] | null;
    };
  }
  
  interface JWT {
    credentials?: boolean;
    status?: UserStatus | null;
    roles?: UserRole[] | null;
    userId?: string;
  }
}

const adapter = PrismaAdapter(db);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const user = await db.user.findFirst({
            where: {
              email: credentials.email as string,
            },
            include: {
              roles: {
                select: {
                  role: true
                }
              }
            }
          });

          if (!user) {
            throw new Error("Invalid credentials.");
          }

          // Compare a senha fornecida com a senha criptografada
          const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password as string);
          if (!isPasswordValid) {
            throw new Error("Invalid credentials.");
          }
          
          // Transformar o usuário para incluir as roles em um formato mais simples
          const extendedUser: ExtendedUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            status: user.status,
            roles: user.roles?.map(r => r.role) || []
          };
          
          return extendedUser;
        } catch (error) {
          console.error("Erro na autenticação:", error);
          throw new Error("Erro na autenticação. Tente novamente.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      try {
        if (account?.provider === "credentials") {
          token.credentials = true;
        }
        
        // Adiciona status e roles ao token quando o usuário faz login
        if (user) {          
          const extendedUser = user as ExtendedUser;
          token.userId = extendedUser.id;
          token.status = extendedUser.status || null;
          token.roles = extendedUser.roles || null;
        }
        
        return token;
      } catch (error) {
        console.error("Erro ao processar JWT:", error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        // Adiciona status e roles à sessão do usuário
        if (session.user) {
          // Verificar se token existe e tem a propriedade userId
          if (token && 'userId' in token && token.userId) {
            session.user.id = token.userId as string;
          }
          
          // Verificar se token existe antes de acessar suas propriedades
          if (token) {
            session.user.status = (token.status as UserStatus) || null;
            session.user.roles = (token.roles as UserRole[]) || null;
          }
        }
        
        return session;
      } catch (error) {
        console.error("Erro ao processar sessão:", error);
        return session;
      }
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
});

export const signUp = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  await db.user.create({
    data: {
      email: email as string,
      password: password as string,
    },
  });
};