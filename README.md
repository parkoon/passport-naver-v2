# passport-naver-v2

passport oauth2 에 naver 로그인 연동

네이버에서 구현한 [passport-naver](https://github.com/naver/passport-naver) 가 있지만, 5~6년 전에 개발 이후로 더 이상 진전이 없고, 프로필 데이터도 한정적으로 제공하고 있어서 개발한 모듈

passport-facebook 과 passport-kakao 를 참고하여 개발

## 설치하기

```sh
npm install passport-naver-v2
```

## 사용하기

- https://developers.naver.com/apps/#/register?api=nvlogin 에서 애플리케이션을 등록한다.
- 네아로 검수 요청을 하기 전 이라면, 멤버관리에 테스터 아이디를 등록해준다.
- 네아로 애플리케이션을 생성하고 받은 **Client ID** 와 **Client Secret** 을 개발 환경에 `.env` 를 생성하고 `CLIENT_ID` `CLIENT_SECRET` 을 입력해준다.

> `passport` 에 적용하는 코드는 다음과 같다.

```javascript
import passport from 'passport'
import { Strategy as NaverStrategy, Profile as NaverProfile } from 'passport-naver-v2'

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `/auth/callback`, // 애플리케이션을 등록할 때 입력했던 callbackURL 을 입력해준다.
    },
    (accessToken: string, refreshToken: string, profile: NaverProfile, done: any) => {
      // 이곳에서 사용자 계정 관련된 작업을 한다.

      done(null, profile)
    }
  )
)
```

## 프로필 모델 구조

| key          | value  | optional | description                           |
| ------------ | ------ | -------- | ------------------------------------- |
| provider     | String | X        | naver 고정값                          |
| id           | String | X        | 사용자의 naver id                     |
| nickname     | String | O        | 사용자의 닉네임                       |
| profileImage | String | O        | 사용자의 프로필 이미지                |
| age          | String | O        | 사용자의 나이 (ex, '28-29')           |
| gender       | String | O        | 사용자의 성별 (ex, 'F' 또는 'M')      |
| email        | String | O        | 사용자의 이메일                       |
| mobile       | String | O        | 사용자의 전화번호                     |
| mobileE164   | String | O        | 사용자의 전화번호 (국가번호 포함)     |
| name         | String | O        | 사용자의 이름                         |
| birthday     | String | O        | 사용자의 생년월일                     |
| birthYear    | String | O        | 사용자의 생년                         |
| \_raw        | String | O        | 프로필 조회로 얻어진 json string      |
| \_json       | Object | O        | 프로필 조회로 얻어진 json 원본 데이터 |

## 샘플코드 실행하기

1. **sample** 폴더로 이동한다
2. `npm install` 로 패키지를 설치한다.
3. `.env` 파일을 생성하고 네아로 애플리케이션을 생성할때 받은 **Client ID** 와 **Client Secret** 를 `API_KEY` 와 `CLIENT_SECRET_KEY` 에 각각 입력해준다.
4. `npm start` 로 서버를 실행한다.
5. 브라우저를 열고 `http://locahost:3000/login` 을 접속한다.

## 예외사항

네이버는 필수정보 항목에 체크를 하지 않아도 로그인이 된다. 필수 항목 또한 사용자가 선택할 수 있다는데, 그럼 선택이랑 다를게 없어 보이는데 왜 그랬는지 알 수 없다. [참고](https://developers.naver.com/forum/posts/30506)

이 부분은 서비스를 개발할 때 문제가 된다. 네아로에서 받은 이메일을 통해 서비스에 회원가입을 하는 로직이 있다면 서비스 서버에서는 오류를 내뱉을 것이다.

필수임에도 동의 체크를 하지 않고 들어온 고객에 한하여 다시 동의창을 보여주는게 이상적으로 보인다.

이미 동의를 한 사용자에게 동의창을 다시 띄우기 위해서는 사용자가 네이버 계정에 들어가서 서비스 연결을 끊어야 한다.

하지만 아래와 같은 옵션을 이용하면, 사용자가 서비스 이용을 끊지 않고도 다시 동의창을 호출 할 수 있다.

```javascript
app.get('/login', passport.authenticate('naver', { authType: 'reprompt' }))
```

`reprompt` 말고도 `reauthenticate` 옵션도 있다. `reauthenticate` 는 동의창이 아닌 아이디 / 패스워드 입력부터 시작한다.
