"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_oauth2_1 = __importStar(require("passport-oauth2"));
var constants_1 = require("./constants");
var Strategy = /** @class */ (function (_super) {
    __extends(Strategy, _super);
    function Strategy(options, verify) {
        var _this = this;
        options.authorizationURL = options.authorizationURL || constants_1.AUTHORIZATION_URL;
        options.tokenURL = options.tokenURL || constants_1.TOKEN_URL;
        options.clientSecret = options.clientSecret || constants_1.AUTHORIZATION_NAME;
        _this = _super.call(this, options, verify) || this;
        _this.name = 'naver';
        _this._profileURL = constants_1.PROFILE_URL;
        return _this;
    }
    Strategy.prototype.authorizationParams = function (options) {
        var params = {};
        // https://developers.naver.com/docs/login/devguide/#5-1-5-%EC%82%AC%EC%9A%A9%EC%9E%90%EA%B0%80-%EA%B1%B0%EB%B6%80%ED%95%9C-%ED%94%84%EB%A1%9C%ED%95%84-%EA%B6%8C%ED%95%9C%EC%97%90-%EB%8C%80%ED%95%98%EC%97%AC-%EB%8B%A4%EC%8B%9C-%EB%8F%99%EC%9D%98%EB%A5%BC-%EC%88%98%ED%96%89%ED%95%98%EB%8A%94-%EA%B2%BD%EC%9A%B0
        if (options.authType) {
            params.auth_type = options.authType;
        }
        return params;
    };
    Strategy.prototype.userProfile = function (accessToken, done) {
        this._oauth2.get(this._profileURL, accessToken, function (err, body) {
            if (err) {
                return done(new passport_oauth2_1.InternalOAuthError('Fail to fetch user profile', err));
            }
            try {
                var parsedBody = JSON.parse(body);
                var _a = parsedBody, response = _a.response, resultcode = _a.resultcode;
                if (resultcode !== '00') {
                    return done(new passport_oauth2_1.InternalOAuthError('Something went wrong from naver login api', err));
                }
                var id = response.id, nickname = response.nickname, age = response.age, gender = response.gender, email = response.email, mobile = response.mobile, name_1 = response.name, birthday = response.birthday, birthYear = response.birthyear, profileImage = response.profile_image, mobileE164 = response.mobile_e164;
                var profile = {
                    provider: constants_1.AUTHORIZATION_NAME,
                    id: id,
                    nickname: nickname,
                    profileImage: profileImage,
                    age: age,
                    gender: gender,
                    email: email,
                    mobile: mobile,
                    mobileE164: mobileE164,
                    name: name_1,
                    birthday: birthday,
                    birthYear: birthYear,
                    _raw: body,
                    _json: parsedBody,
                };
                done(null, profile);
            }
            catch (e) {
                return done(new passport_oauth2_1.InternalOAuthError('😵 Failed to parse profile response', err));
            }
        });
    };
    return Strategy;
}(passport_oauth2_1.default));
exports.default = Strategy;
