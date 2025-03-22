import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionsDropdown } from "./actionDropdown";

import Badge from "@/components/ui/badge/Badge";
import { UserRoleLabel } from "@/enums/prisma";
import type { UserWithRoles } from "@/_types/prisma/user";

export default function TableUsers({users}: {users: UserWithRoles[]}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                    Nome
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                    Funções
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                    Email
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                    Status
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span />
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex flex-col items-start gap-2">
                      {user.roles.map((roleObj) => (
                        <Badge
                          key={roleObj.role}
                          size="sm"
                          color="primary"
                        >
                          {UserRoleLabel[roleObj.role]}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        user.status === 'ATIVO'
                          ? 'success'
                          : user.status === 'PENDENTE'
                          ? 'warning'
                          : 'error'
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <ActionsDropdown user={user}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
