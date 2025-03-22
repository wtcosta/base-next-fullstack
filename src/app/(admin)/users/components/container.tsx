'use client'

import ComponentCard from "@/components/common/ComponentCard";
import TableUsers from "./table";
import { useState } from "react";
import { EditModal } from "./editModal";
import type { UserWithRoles } from "@/_types/prisma/user";

export function ContainerUsersPage({users}: {users: UserWithRoles[]}) {
    const [showModal, setShowModal] = useState(false);

    function handleAddUser() {
        setShowModal(!showModal);
    }

    return (
        <div>
            <ComponentCard title="Lista de Usuários" actionAddButton={handleAddUser} desc="Gerencie os usuários do sistema">
                <TableUsers users={users} />
            </ComponentCard>
            {showModal && (
                <EditModal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                    }}
                />
            )}
        </div>
    );
}
