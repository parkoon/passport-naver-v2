import OAuth2Strategy, {
  InternalOAuthError,
  StrategyOptions,
  VerifyFunction,
} from 'passport-oauth2'

import { PassportProfileBody, Profile } from './types'
import { AUTHORIZATION_URL, AUTHORIZATION_NAME, TOKEN_URL, PROFILE_URL } from './constants'

export default class Strategy extends OAuth2Strategy {
  public _profileURL: string

  constructor(options: Partial<StrategyOptions>, verify: VerifyFunction) {
    options.authorizationURL = options.authorizationURL || AUTHORIZATION_URL
    options.tokenURL = options.tokenURL || TOKEN_URL
    options.clientSecret = options.clientSecret || AUTHORIZATION_NAME

    super(options as StrategyOptions, verify)

    this.name = 'naver'
    this._profileURL = PROFILE_URL
  }

  authorizationParams(options) {
    var params = {} as any

    // https://developers.naver.com/docs/login/devguide/#5-1-5-%EC%82%AC%EC%9A%A9%EC%9E%90%EA%B0%80-%EA%B1%B0%EB%B6%80%ED%95%9C-%ED%94%84%EB%A1%9C%ED%95%84-%EA%B6%8C%ED%95%9C%EC%97%90-%EB%8C%80%ED%95%98%EC%97%AC-%EB%8B%A4%EC%8B%9C-%EB%8F%99%EC%9D%98%EB%A5%BC-%EC%88%98%ED%96%89%ED%95%98%EB%8A%94-%EA%B2%BD%EC%9A%B0
    if (options.authType) {
      params.auth_type = options.authType
    }

    return params
  }

  userProfile(accessToken: string, done: (error: Error, profile?: Profile) => void) {
    this._oauth2.get(this._profileURL, accessToken, (err: any, body: string) => {
      if (err) {
        return done(new InternalOAuthError('Fail to fetch user profile', err))
      }

      try {
        const parsedBody = JSON.parse(body)

        const { response, resultcode } = parsedBody as PassportProfileBody

        if (resultcode !== '00') {
          return done(new InternalOAuthError('Something went wrong from naver login api', err))
        }

        const {
          id,
          nickname,
          age,
          gender,
          email,
          mobile,
          name,
          birthday,
          birthyear: birthYear,
          profile_image: profileImage,
          mobile_e164: mobileE164,
        } = response

        const profile: Profile = {
          provider: AUTHORIZATION_NAME,
          id,
          nickname,
          profileImage,
          age,
          gender,
          email,
          mobile,
          mobileE164,
          name,
          birthday,
          birthYear,
          _raw: body,
          _json: parsedBody,
        }

        done(null, profile)
      } catch (e) {
        return done(new InternalOAuthError('😵 Failed to parse profile response', err))
      }
    })
  }
}
