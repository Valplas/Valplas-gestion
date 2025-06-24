import  { useState } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function TableActions({ onEdit, onDelete }: TableActionsProps) {
    const [hovered, setHovered] = useState<"edit" | "delete" | null>(null);

  return (
    <div className="flex items-center space-x-2">
      {/* Botón de Editar */}
      <button
        className="relative flex items-center justify-center p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
        onClick={onEdit}
        onMouseEnter={() => setHovered("edit")}
        onMouseLeave={() => setHovered(null)}
      >
        <BsPencil className="w-5 h-5" />
        {hovered === "edit" && (
          <span className="absolute bottom-8 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md">
            Editar
          </span>
        )}
      </button>

      {/* Botón de Eliminar */}
      <button
        className="relative flex items-center justify-center p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
        onClick={onDelete}
        
        onMouseEnter={() => setHovered("delete")}
        onMouseLeave={() => setHovered(null)}
      >
        <BsTrash className="w-5 h-5" />
        {hovered === "delete" && (
          <span className="absolute bottom-8 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md">
            Borrar
          </span>
        )}
      </button>
    </div>
  );
}
