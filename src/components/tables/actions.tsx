import { Eye, Edit, Trash, MoreVertical } from "lucide-react";
import { useEffect, useRef } from "react";
import { useUserPermissions } from "@/hooks/useUserPermissions";

type ActionsProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleEye?: () => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
}

export function Actions({ isOpen, setIsOpen, handleEye, handleEdit, handleDelete }: ActionsProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { hasAnyRole } = useUserPermissions();
  const isAdmin = hasAnyRole(['ADMINISTRADOR', 'SUPERADMIN']);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  // Se não houver nenhuma ação disponível, não renderiza o dropdown
  if (!handleEye && !handleEdit && !handleDelete) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-white/[0.05]"
      >
          <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>

      {isOpen && (
      <div 
          className="py-1 absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-white/[0.05] z-50"
          style={{
              position: 'fixed',
              top: dropdownRef.current?.getBoundingClientRect().bottom ?? 0,
              right: window.innerWidth - (dropdownRef.current?.getBoundingClientRect().right ?? 0),
          }}
      >
          {handleEye && (
            <button
                type="button"
                onClick={handleEye}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.05]"
            >
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
            </button>
          )}

          {handleEdit && isAdmin && (
            <button
                type="button"
                onClick={handleEdit}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.05]"
            >
                <Edit className="mr-2 h-4 w-4" />
                Editar
            </button>
          )}

          {handleDelete && isAdmin && (
            <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-white/[0.05]"
            >
                <Trash className="mr-2 h-4 w-4" />
                Excluir
            </button>
          )}
      </div>
      )}
  </div>
  );
}