export enum UserType{
    OWNER = 0,
    ADMIN = 1,
    SELLER = 2,
}

export interface UserDto {
    userID: string; // UUID se representa como string en TypeScript
    name?: string; // Puede ser nulo en C#, por lo que es opcional en TypeScript
    email?: string; // Puede ser nulo en C#, por lo que es opcional en TypeScript
    phone?: string; // Puede ser nulo en C#, por lo que es opcional en TypeScript
    commercialPhone?: string; // Puede ser nulo en C#, por lo que es opcional en TypeScript
    userType: UserType; // Presumiblemente un enum o tipo definido en TypeScript
    token?: string; // Puede ser nulo en C#, por lo que es opcional en TypeScript
  }