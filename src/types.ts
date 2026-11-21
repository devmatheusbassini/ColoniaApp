export type PetSpecies = 'Cão'|'Gato'|'Outros'
export type YesNo = 'Sim'|'Não'|''
export type MedicationType = 'Contínua'|'Pontual'|''
export type PetTerm = {
 vaccinesUpToDate?:YesNo; dewormingUpToDate?:YesNo; fleaTickMedication?:YesNo; imageAuthorization?:YesNo; bathOnExit?:YesNo;
 belongings?:string[]; otherBelongings?:string; foodQuantity?:string; mealsPerDay?:string; feedingTimes?:string; instructions?:string
}
export type Pet = {
 id:string; photo?:string; name:string; species:PetSpecies; breed?:string; birthDate?:string; age?:string; sex?:'Macho'|'Fêmea'|''; neutered?:YesNo;
 temperament?:string[]; temperamentNotes?:string; medicationType?:MedicationType; medicationDetails?:string; postStayNotes?:string;
 guardian:string; phone:string; address:string; addr?:{cep:string;street:string;number:string;complement:string;district:string;city:string;state:string}; guardianRg?:string; guardianCpf?:string; guardianInstagram?:string;
 emergencyName?:string; emergencyRelation?:string; emergencyPhone?:string;
 vetClinic?:string; vetClinicPhone?:string; veterinarianName?:string; veterinarianPhone?:string;
 notes?:string; latitude?:number; longitude?:number; signature?:string; termSignedAt?:string; term?:PetTerm; createdAt:string
}
export type Vaccine = { id:string; petId:string; name:string; appliedAt:string; expiresAt:string; proof?:string }
export type Incident = { id:string; petId:string; description:string; occurredAt:string; tutorNotified?:YesNo; contactNotes?:string; attachment?:string; createdAt:string; updatedAt?:string }
export type BudgetStatus = 'Rascunho'|'Aprovado'|'Entrada confirmada'|'Finalizado'|'Cancelado'
export type Payment = { id:string; value:number; method:string; date:string; notes?:string }
export type QuoteItem = { species:PetSpecies; quantity:number; normalRate:number; discountRate?:number }
export type ServiceItem = { name:string; value:number; quantity:number; pet?:string }
export type Budget = {
 id:string; petId?:string; petIds?:string[]; quickGuardianName?:string; quickPetName?:string; quickGuardianPhone?:string; quickLabel?:string; quoteItems?:QuoteItem[]; validUntil?:string;
 entryDate:string; exitDate:string; entryTime?:string; exitTime?:string; dailyRate:number; days:number; manualDays?:boolean;
 timeExtra:boolean; timeExtraValue?:number; seasonType:'Nenhum'|'Feriado'|'Alta temporada'|'Data comemorativa';
 seasonMode:'R$'|'%'; seasonValue:number; discount:number; discountDailyRate?:number; showComparison?:boolean;
 services?:ServiceItem[]; normalTotal?:number; discountedTotal?:number; notes?:string; status:BudgetStatus;
 paidValue?:number; payments?:Payment[]; entryConfirmedAt?:string; exitConfirmedAt?:string; cancelledAt?:string; removedFromBudgetListAt?:string; createdAt:string
}
export type AppData = { pets:Pet[]; vaccines:Vaccine[]; budgets:Budget[]; incidents:Incident[]; deleted?:Record<string,string> }
