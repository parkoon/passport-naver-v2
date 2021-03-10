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

  userProfile(accessToken: string, done: (error: Error, profile?: Profile) => void): void
  authorizationParams(options: any): any

  name: string
}

declare module 'passport' {
  interface AuthenticateOptions {
    /**
     * `reauthenticate`
     *
     * 접근 토큰이 유효하더라도 사용자로 하여금 다시한번 인증을 수행하여 계정보안 수준을 높이고자 할 때 사용한다.
     * 아이디와 패스워드 모두 다시 입력한다.
     *
     * `reprompt`
     * 프로필 항목을 다시 동의 받을 때 사용한다.
     * 아이디와 패스워드 입력 없이 프로필 동의 창으로 이동하여 다시 동의를 받는다.
     */
    authType?: 'reprompt' | 'reauthenticate'
  }
}
