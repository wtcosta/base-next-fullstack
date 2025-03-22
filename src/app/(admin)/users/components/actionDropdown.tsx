'use client';

import { useState } from "react";
import { EditModal } from "./editModal";
import { Actions } from "@/components/tables/actions";
import type { UserWithRoles } from "@/_types/prisma/user";

export function ActionsDropdown({ user }: { user: UserWithRoles}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <Actions
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleEye={() => setShowEditModal(true)}
          handleEdit={() => setShowEditModal(true)}
      />
      <EditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={user}
      />
    </>
  );
}