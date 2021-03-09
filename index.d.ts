import passport from 'passport'
import { StrategyOptions, VerifyFunction } from 'passport-oauth2'

export type Profile = {
  provider: 'naver'
  id: string
  nickname?: string
  profileImage?: string
  age?: string
  gender?: string
  email?: string
  mobile?: string
  mobileE164?: string
  name?: string
  birthday?: string
  birthYear?: string
  _raw: string
  _json: string
}

export class Strategy extends passport.Strategy {
  constructor(options: Partial<StrategyOptions>, verify: VerifyFunction)

  userProfile(accessToken: string, done: (error: Error, profile?: Profile) => void)
}
