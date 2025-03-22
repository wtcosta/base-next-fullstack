import type { User, UserRoles } from "@prisma/client";

export interface UserWithRoles extends User {
  roles: UserRoles[];
}