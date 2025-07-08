export enum BusinessOptions 
    {  
        // 'Resmaprem'=0,
        'Valplas'=1,
    }
  
    // Interface para ProductModel
export interface ProductModel {
    productID: string; // Guid en C# se mapea como string en TypeScript
    name: string;
    business?: BusinessOptions | null; // Nullable enum
    description: string; // String vacío por defecto
    manufacturer?: string | null; // String vacío por defecto
    weightKg?: number | null; // Decimal en C# se mapea como number en TypeScript
    width?: number | null;
    long?: number | null; // "Long" en C# es ambiguo, pero aquí parece ser un número
    height?: number | null;
    origin?: string | null; // String vacío por defecto
    code: number; // Campo requerido
    container: boolean; // Valor por defecto: false
    productIdRelated?: string | null; // Guid nullable
    quantity?: number | null; // Valor por defecto: 0
    costPrice: number
  }

 export const businessOptions = [
    { value: BusinessOptions.Valplas, label: 'Valplas' },
  ];

  export const businessLabel = {
    [BusinessOptions.Valplas]:'Valplas'
  }
