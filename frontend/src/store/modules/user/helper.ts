import { ss } from '@/utils/storage'
import { Session, User } from '@supabase/supabase-js'

const LOCAL_NAME = 'userStorage'


export interface UserState {
  user: API.CurrentUser | null
  session: Session | null
  
}



export function defaultSetting(): UserState {
  return {
    session: null,
    user: null,
  
  }

}

export function getLocalState(): UserState {
  const localSetting: UserState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: UserState): void {
  ss.set(LOCAL_NAME, setting)
}
