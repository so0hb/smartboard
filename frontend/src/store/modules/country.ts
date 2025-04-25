export function initStateCountry(): API.Country {
    return {
      name: '',
      alpha_2: '',
      alpha_3: '',
      countryCode: '',
      iso_31662: '',
      region: '',
      subRegion: '',
      intermediateRegion: '',
      regionCode: '',
      subRegionCode: '',
      intermediateRegionCode: '',
      isActivate: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
  
  const tableName = 'country';
  import { createBaseStore } from './baseStore';
  export const useCountryStore = createBaseStore<API.Country>(tableName, initStateCountry, "country");
  