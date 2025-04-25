import { defineStore } from 'pinia'
import { store } from '@/store/helper'
import countryList, { Country } from 'country-list';
type UtilState = {
    code: number
}
function getDefaultUtil(): UtilState {
    return {
        code: 1
    }
}
export const useUtilStore = defineStore('util-store', {
    state: (): UtilState => getDefaultUtil(),
    actions: {
        getAllCountry(): Country[] {
            return countryList.getData();
        },
        getCountryOption() {
            return countryList.getData().map(country => ({
                label: country.name,
                value: country.code,
                disabled: false,
            }));
        }

    },
})

export function useAppStoreWithOut1() {
    return useUtilStore(store)
}
