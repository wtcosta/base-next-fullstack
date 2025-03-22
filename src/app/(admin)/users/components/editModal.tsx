'use client';

import type { UserWithRoles } from "@/_types/prisma/user";
import { handleCreateUser, handleUpdateUser } from "@/actions/user";
import { UserRoleLabel, UserStatusLabel } from "@/enums/prisma";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useState, useEffect } from "react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserWithRoles;
}

export function EditModal({ isOpen, onClose, user }: EditModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [roleSelections, setRoleSelections] = useState<Array<{role: string, selected: boolean}>>([]);

  useEffect(() => {
    if (user) {
      // Inicializa as seleções de roles
      setRoleSelections(
        Object.keys(UserRoleLabel).map(role => ({
          role,
          selected: user.roles.some(r => r.role === role)
        }))
      );
    } else {
      // Inicializa as seleções de roles para um novo usuário
      setRoleSelections(
        Object.keys(UserRoleLabel).map(role => ({
          role,
          selected: role === '' // Por padrão, seleciona apenas VOLUNTARIO
        }))
      );
    }
  }, [user]);
  
  const handleRoleToggle = (role: string) => {
    setRoleSelections(prev => 
      prev.map(item => 
        item.role === role 
          ? { ...item, selected: !item.selected } 
          : item
      )
    );
  };

  const handleSubmit = async (formData: FormData) => {
    
    // Prepara os dados de roles selecionadas
    const selectedRoles = roleSelections
      .filter(r => r.selected)
      .map(r => ({
        role: r.role
      }));
    
    // Adiciona os dados ao FormData
    formData.set('roles', JSON.stringify(selectedRoles));
    
    try {
      if (user) {
        await handleUpdateUser(user.id, formData);
      } else {
        await handleCreateUser(formData);
      }
      onClose();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar usuário');
    }
  };

  if (!isOpen) return null;
  const isNewUser = !user?.id;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
            }
          }}
        />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <form action={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  {isNewUser ? 'Adicionar usuário' : 'Editar usuário'}
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Nome
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={user?.name || ''}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={user?.email || ''}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Senha
                      </label>
                      <div className="relative">
                        <input
                          placeholder="Digite sua senha"
                          name="password"
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          defaultValue={user?.password || ''}
                          type={showPassword ? "text" : "password"}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={user?.status || ''}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {Object.entries(UserStatusLabel).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="roles"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Funções
                  </label>
                  <div className="space-y-2">
                    {Object.entries(UserRoleLabel).map(([value, label]) => (
                      <div key={value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`role-${value}`}
                          checked={roleSelections.find(r => r.role === value)?.selected || false}
                          onChange={() => handleRoleToggle(value)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`role-${value}`}
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Salvar alterações
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}