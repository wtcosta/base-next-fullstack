"use client";

import type React from "react";
import Button from "../ui/button/Button";
import { PlusIcon } from "lucide-react";
import { useUserPermissions } from "@/hooks/useUserPermissions";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  actionAddButton?: () => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  actionAddButton,
}) => {
  const { hasAnyRole } = useUserPermissions();

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5 flex justify-between items-center">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        {actionAddButton && hasAnyRole(['ADMINISTRADOR', 'SUPERADMIN']) && (
          <div className="mt-1 flex justify-end">
            <Button
              onClick={actionAddButton}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
