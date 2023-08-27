/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Wechat</b> integration.</span>
 * <a href="https://zoom.us/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/zoom.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/wechat
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * See: https://developers.weixin.qq.com/doc/oplatform/en/Mobile_App/WeChat_Login/Authorized_API_call_UnionID.html
 */
export interface WechatProfile {
  openid: string;
  nickname: string;
  sex: 1 | 2;
  province: string;
  city: string;
  country: string;
  headimgurl: string;
  privilege: string[];
  unionid: string;
}

// Any config required that isn't part of the `OAuthUserConfig` spec should belong here
// For example, we must pass a `redirectUrl` to the Notion API when requesting tokens, therefore we add it here
interface AdditionalConfig {
  redirectUri: string
}

/**
 * Add Wechat login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/wechat
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Wechat from "@auth/core/providers/wechat"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Wechat({ clientId: WECHAT_CLIENT_ID, clientSecret: WECHAT_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Wechat OAuth 2.0 Integration Guide](https://developers.weixin.qq.com/doc/oplatform/en/Mobile_App/WeChat_Login/Development_Guide.html)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Wechat provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Wechat provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/wechat.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).
 *
 * :::
 *
 * :::info **Disclaimer**
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 *
 * :::
 */
export default function Wechat(
  config: OAuthUserConfig<WechatProfile> & AdditionalConfig
): OAuthConfig<WechatProfile> {
  return {
    id: "wechat",
    name: "Wechat",
    type: "oauth",
    // authorization: "https://open.weixin.qq.com/connect/oauth2/authorize?response_type=code",
    // token: "https://zoom.us/oauth/token",
    // userinfo: "https://api.weixin.qq.com/sns/userinfo",
    // profile(profile) {
    //   return {
    //     id: profile.id,
    //     name: `${profile.first_name} ${profile.last_name}`,
    //     email: profile.email,
    //     image: profile.pic_url,
    //   }
    // },
    // params: { grant_type: 'authorization_code' },
    token: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    authorization: {
      url: 'https://open.weixin.qq.com/connect/qrconnect',
      params: {
        appid: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        scope: 'snsapi_login',
      },
      async request({ url }) {
        const wechatUrl = new URL(url)
        wechatUrl.hash = "#wechat_redirect"
        return wechatUrl.href
      },
    },
    // profile: 'https://api.weixin.qq.com/sns/userinfo?openid=',
    profile: (profile) => {
      return {
        id: profile.openid,
        name: profile.nickname,
        email: null,
        image: profile.headimgurl,
      };
    },
    options: config,
  }
}
