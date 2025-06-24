export enum CLIENT_TYPE {
  Individual = 0,
  Business = 1,
}

export enum TAX_CONDITION {
  ConsumidorFinal = 0,
  Monotributista = 1,
  ResponsableInscripto = 2,
}

export const taxConditions = [
  { value: TAX_CONDITION.ConsumidorFinal, label: 'Consumidor Final' },
  { value: TAX_CONDITION.Monotributista, label: 'Monotributista' },
  { value: TAX_CONDITION.ResponsableInscripto, label: 'Responsable Inscripto' },
];

export const clientType = [
  { value: CLIENT_TYPE.Individual, label: 'Persona' },
  { value: CLIENT_TYPE.Business, label: 'Negocio' },
];

export interface ClientModel {
  clientID: string; // En TypeScript, `Guid` se representa como `string`
  clientName?: string;
  clientSurname?: string; // Opcional
  clientType?: CLIENT_TYPE; // Opcional
  clientNumber?: number;
  clientAddress?: string;
  clientLocality?: string;
  clientNotes?: string; // Opcional
  clientWorkingHours?: string;
  clientPoint?: string; // Opcional
  clientPhone?: string;
  clientAlternativePhone?: string; // Opcional
  clientEmail?: string;
  clientCUIT?: string;
  clientTaxCondition?: TAX_CONDITION;
  clientFont?: string; // Opcional
  clientDate?: Date;
}
