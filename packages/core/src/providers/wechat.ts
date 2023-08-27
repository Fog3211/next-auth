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
  sex: 0 | 1 | 2;
  province: string;
  city: string;
  country: string;
  headimgurl: string;
  privilege: string[];
  unionid: string;
}

// Any config required that isn't part of the `OAuthUserConfig` spec should belong here
// For example, we must pass a `redirectUri` to the Wechat API when requesting tokens, therefore we add it here
interface AdditionalConfig {
  redirectUri: string
  lang: 'cn' | 'en'
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
 *   providers: [Wechat({ clientId: WECHAT_CLIENT_ID, clientSecret: WECHAT_CLIENT_SECRET, redirectUri: process.env.WECHAT_REDIRECT_URI })],
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
  options: OAuthUserConfig<WechatProfile> & AdditionalConfig
): OAuthConfig<WechatProfile> {
  return {
    id: "wechat",
    name: "Wechat",
    type: "oauth",
    token: {
      url: 'https://api.weixin.qq.com/sns/oauth2/access_token',
      params: {
        grant_type: 'authorization_code',
        appid: options.clientId,
      },
      request: async (p) => {
        console.log(p)
        return  {
          token: ''
        }
      }
    },
    authorization: `https://open.weixin.qq.com/connect/qrconnect?appid=${options.clientId}&redirect_uri=${options.redirectUri}&response_type=code&scope=snsapi_login&state=STATE&lang=${options.lang}#wechat_redirect`,
    userinfo: "https://api.weixin.qq.com/sns/userinfo",
    // userinfo: {
    //   url: "https://api.github.com/user",
    //   async request({ tokens, provider }) {
    //     const profile = await fetch(provider.userinfo?.url as URL, {
    //       headers: {
    //         Authorization: `Bearer ${tokens.access_token}`,
    //         "User-Agent": "authjs",
    //       },
    //     }).then(async (res) => await res.json())

    //     if (!profile.email) {
    //       // If the user does not have a public email, get another via the GitHub API
    //       // See https://docs.github.com/en/rest/users/emails#list-public-email-addresses-for-the-authenticated-user
    //       const res = await fetch("https://api.github.com/user/emails", {
    //         headers: {
    //           Authorization: `Bearer ${tokens.access_token}`,
    //           "User-Agent": "authjs",
    //         },
    //       })

    //       if (res.ok) {
    //         const emails: GitHubEmail[] = await res.json()
    //         profile.email = (emails.find((e) => e.primary) ?? emails[0]).email
    //       }
    //     }

    //     return profile
    //   },
    // },
    // profile: 'https://api.weixin.qq.com/sns/userinfo?openid=',
    profile: (profile) => {
      return {
        id: profile.openid,
        name: profile.nickname,
        email: null,
        image: profile.headimgurl,
      };
    },
    style: {
      logo: "/wechat.svg",
      logoDark: "/wechat.svg",
      bg: "#fff",
      bgDark: "#24292f",
      text: "#000",
      textDark: "#fff",
    },
    options,
  }
}
