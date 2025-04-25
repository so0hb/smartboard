export function initStateCompanyAI(): API.CompanyAI {
  return {
    name: '',
    companyUrl: '',
    logoUrl: '',
    apiKey: '',
    apiUrl: '',
    isActivate: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}
const tableName = 'ai_company';
import { createBaseStore } from './baseStore';
export const useCompanyStore = createBaseStore<API.CompanyAI>(tableName, initStateCompanyAI, "company");
