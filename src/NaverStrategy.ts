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

    OAuth2Strategy.call(this, options, verify)

    this.name = 'naver'
    this._profileURL = PROFILE_URL
  }

  userProfile(accessToken: string, done: (error: Error, profile?: Profile) => void) {
    this._oauth2.get(this._profileURL, accessToken, (err: any, body: string) => {
      if (err) {
        return done(new InternalOAuthError('😵Fail to fetch user profile', err))
      }

      try {
        const parsedBody = JSON.parse(body)

        const { response, resultcode, message } = parsedBody as PassportProfileBody

        if (!response || !message) {
          return done(new InternalOAuthError('😵Empty api response & message', err))
        }

        if (resultcode !== '00') {
          return done(new InternalOAuthError('😵Something went wrong from naver login api', err))
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
