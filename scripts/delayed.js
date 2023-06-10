// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';
import {
    createEl,
    getMetaContentByName
} from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');


// add more delayed functionality here
const headEl = document.querySelector('head');

const noScriptEl = createEl('noscript', {}, '', headEl);
const gTagManager = createEl('iframe', {
    src: 'https://www.googletagmanager.com/ns.html?id=GTM-KRD9GM2',
    height: 0,
    width: 0,
    style: 'display:none;visibility:hidden'
}, noScriptEl);

//createEl('script', { type: 'text/javascript', src: 'https://js-cdn.dynatrace.com/jstag/147f84b2bdc/bf66617fkf/a87bda322e05b294_complete.js', crossorigin: 'anonymous' }, headEl);

//createEl('script', { type: 'text/javascript', src: 'https://cdn.polyfill.io/v2/polyfill.min.js', crossorigin: 'anonymous' }, headEl);

// CIVIC CookieControl Script
var config = {
    apiKey: 'aa86a594e17147325dde84ab69ee5baa88231d7e',
    product: 'PRO_MULTISITE',
    initialState: "notify",
    layout: 'POPUP',
    rejectButton: false,
    acceptBehaviour: 'recommended',
    necessaryCookies: ['JSESSIONID', 'JSESSIONDATA', 'acceleratorSecureGUID', 'country', 'PageName', 'PageURL', 'saml_request_path', 'AWSALB', 'AWSALBCORS', 'renderid', 'AWSELB', 'AWSELBCORS', 'hubspotutk', 'hutk', 'userdata'],
    locales: [
        {
            locale: 'ja',
            text: {
                title: '弊社のサイトは、Cookieを使用してご使用の端末機器に情報を保存しています。',
                intro: 'Cookieには技術的に必要不可欠なものと、お客様がどのようにサイトを使用されているか情報を収集し、お客様のニーズをより最適化するものがあります。',
                notifyTitle: 'このサイトにおけるCookie (クッキー)の選択について',
                notifyDescription: 'インテグリスはCookieを使用して、サイト機能の最適化と快適さを提供しています。',
                accept: '承認する',
                settings: 'Cookieの設定',
                acceptRecommended: '設定する (推奨)',
                necessaryTitle: '必要不可欠なCookie',
                necessaryDescription: '必要不可欠なCookieは、ページのナビゲーションやセキュリティ保護された領域へのアクセスなどを可能にします。ウェブサイトを正常に機能させるために必要不可欠なものですが、ブラウザの設定を変更することで保存したCookieを無効にすることができます。',
                on: 'オン',
                off: 'オフ',
                thirdPartyTitle: 'Some cookies require your attention',
                thirdPartyDescription: 'Consent for the following cookies could not be automatically revoked. Please follow the link(s) below to opt out manually.',
                optionalCookies: [
                    {
                        name: 'analytics',
                        label: 'アナリティクス',
                        description: 'このCookieは、弊社のウェブサイト、定額制サービス、モバイルアプリの使用状況や弊社のキャンペーンの効果、およびお客様へ提供する弊社のウェブサイトをカスタマイズするために総計データを収集します。',
                        cookies: [],
                        onAccept: function () { },
                        onRevoke: function () {
                            _satellite.track("privacyRevokeAnalytics");
                        },
                        lawfulBasis: 'legitimate interest'
                    }, {
                        name: 'advertising',
                        label: '広告',
                        description: 'このCookieは、お客様と関連性の高い広告を表示するために使用します。同じ広告が連続して表示されるのを防ぎ、広告を適切に表示し、場合によってはお客様の興味に添った広告を選択する機能があります。',
                        cookies: [],
                        thirdPartyCookies: [{ "name": "Google Ads", "optOutLink": "https://adssettings.google.com/" }, { "name": "LinkedIn", "optOutLink": "https://www.linkedin.com/psettings/advertising" }],
                        onAccept: function () { },
                        onRevoke: function () { },
                        lawfulBasis: 'legitimate interest'
                    }, {
                        name: 'socialsharing',
                        label: 'ソーシャルネットワーキング',
                        description: 'このCookieは、他のソーシャルネットワーキングやウェブサイトなどの第三者が、お客様が興味のある弊社のウェブサイト、定額制サービス、またはモバイルアプリのページやコンテンツを共有できるようにするために使用します。 このクッキーは広告目的にも使用されることがあります。',
                        cookies: [],
                        onAccept: function () { },
                        onRevoke: function () { },
                        lawfulBasis: 'legitimate interest'
                    }
                ],
                statement: {
                    description: '詳細はインテグリスのをご覧ください',
                    name: 'プライバシーポリシー',
                    url: '/content/ja/home/about-us/legal-trademark-notices/privacy-policy.html',
                    updated: '31/10/2018'
                }
            }

        },
        {
            locale: 'en',
            text: {
                notifyDescription: 'We use cookies to optimize site functionality and give you the best possible experience.',
                thirdPartyTitle: 'Some cookies require your attention',
                thirdPartyDescription: 'Consent for the following cookies could not be automatically revoked. Please follow the link(s) below to opt out manually.',
                acceptSettings: 'Accept Recommended Settings',
                acceptRecommended: 'Accept Recommended Settings'
            }
        }
    ],
    optionalCookies: [
        {
            name: 'analytics',
            label: 'Analytics',
            description: 'These cookies collect information that is used either in aggregate form to help us understand how our website, subscription service and mobile apps are being used or how effective our marketing campaigns are or to help us customize our website for you',
            cookies: [],
            onAccept: function () { },
            onRevoke: function () {
                _satellite.track("privacyRevokeAnalytics");
            },
            lawfulBasis: 'legitimate interest'
        }, {
            name: 'advertising',
            label: 'Advertising',
            description: 'These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.',
            cookies: [],
            thirdPartyCookies: [{ "name": "Google Ads", "optOutLink": "https://adssettings.google.com/" }, { "name": "LinkedIn", "optOutLink": "https://www.linkedin.com/psettings/advertising" }],
            onAccept: function () { },
            onRevoke: function () { },
            lawfulBasis: 'legitimate interest'
        }, {
            name: 'socialsharing',
            label: 'Social Sharing',
            description: 'These cookies are used to enable you to share pages and content that you find interesting on our websites, subscription service or mobile apps through third party social networking and other websites. These cookies may also be used for advertising purposes too.',
            cookies: [],
            onAccept: function () { },
            onRevoke: function () { },
            lawfulBasis: 'legitimate interest'
        }
    ],

    position: 'RIGHT',
    theme: 'DARK',
    branding: {
        removeIcon: true,
        removeAbout: true
    },
    statement: {
        description: 'For more information visit our',
        name: 'PRIVACY POLICY',
        url: '/en/home/about-us/legal-trademark-notices/privacy-policy.html',
        updated: '31/10/2018'
    }
};

function loadScript(scriptUrl) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.setAttribute("crossorigin", "anonymous");
    script.setAttribute("integrity", "sha256-OVuwbjMjalo6C3l7xfCV4uNPhjEiHfi76IsruVri6R4=");
    script.src = scriptUrl;
    document.head.appendChild(script);

    return new Promise((res, rej) => {
        script.onload = function () {
            res();
        }
        script.onerror = function () {
            rej();
        }
    });
}
// use
loadScript('https://cc.cdn.civiccomputing.com/9/cookieControl-9.8.min.js')
    .then(() => {
        CookieControl.load(config);
    })
    .catch(() => {
        console.error('Cookie control Script loading failed!');
    });

// **End CIVIC CookieControl Script

const pageInstanceID = (() => {
    const path = location.pathname;
    let pageInstanceID = 'content-microsite-live-poco-live';
    for (const part of path.split('/')) {
        if (part !== '') {
            pageInstanceID += `-${part}`;
        }
    }
    return pageInstanceID;
})();

let metaEl = createEl('meta', {
    name: 'digitaldata-hubspotTrackingCode',
    content: '//js.hs-scripts.com/4669942.js'
}, '', headEl);

metaEl = createEl('meta', {
    name: 'digitaldata-pageInstanceID',
    content: pageInstanceID
}, '', headEl);

metaEl = createEl('meta', {
    name: 'digitaldata-pageTitle',
    content: document.head.querySelector('title').textContent
}, '', headEl);

metaEl = createEl('meta', {
    name: 'digitaldata-destinationURL',
    content: location.href
}, '', headEl);

metaEl = createEl('meta', {
    name: 'digitaldata-pageType',
    content: 'page'
}, '', headEl);

metaEl = createEl('meta', {
    name: 'digitaldata-locale',
    content: 'en'
}, '', headEl);

metaEl = createEl('meta', {
    name: 'launchPath',
    content: '//assets.adobedtm.com/1b548f3b9240/c16617d20d5f/launch-b0421ba95fc7.min.js'
}, '', headEl);

metaEl = createEl('meta', {
    name: 'digitaldata-hubspotTrackingCode',
    content: '//js.hs-scripts.com/4669942.js'
}, '', headEl);

// Adobe Launch Script
const digitalData = {
    pageInstanceID: getMetaContentByName("digitaldata-pageInstanceID"),
    page: {
        pageInfo: {
            pageID: getMetaContentByName("digitaldata-pageTitle"),
            destinationURL: getMetaContentByName("digitaldata-destinationURL"),
            referringURL: document.referrer
        },
        category: {
            primaryCategory: "",
            subCategory1: "",
            pageType: getMetaContentByName("digitaldata-pageType")
        },
        attributes: {
            language: getMetaContentByName("digitaldata-locale"),
            errorPage: ""
        }
    },
    cookiepreference: {
        analytics: true,
        advertising: true,
        socialnetworking: true
    }
};

setTimeout(function () {
    if (digitalData.cookiepreference.analytics === true && digitalData.cookiepreference.advertising === true && digitalData.cookiepreference.socialnetworking === true) {
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
            var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-KRD9GM2');

        var hubspotTrackingCode = getMetaContentByName("digitaldata-hubspotTrackingCode");
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (hubspotTrackingCode != null) {
            script.src = hubspotTrackingCode;
        }
        script.setAttribute("async", "");
        script.setAttribute("defer", "");
        script.setAttribute("id", "hs-script-loader");
        document.head.appendChild(script);
    }
}, 500);
var localeVar = document.getElementsByTagName("head")[0].getAttribute("data-locale");
var countryCookieValue = "";
var expiryTime = 0;
function readCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
};

function setCookie(name, value, expires, path, domain, secure) {
    cookieStr = name + "=" + encodeURI(value) + "; ";

    if (expires) {
        expires = setExpiration(expires);
        cookieStr += "expires=" + expires + "; ";
    }
    if (path) {
        cookieStr += "path=" + path + "; ";
    }
    if (domain) {
        cookieStr += "domain=" + domain + "; ";
    }
    if (secure) {
        cookieStr += "secure; ";
    }

    document.cookie = cookieStr;
}

function setExpiration(cookieLife) {
    var today = new Date();
    var expr = new Date(today.getTime() + cookieLife * 24 * 60 * 60 * 1000);
    return expr.toGMTString();
}

var cookieValue = readCookie("country");

if (!cookieValue) {
    let url = "https://poco.entegris.com/bin/content/entegris-live/getCountry.json?cache=false";
    let currentUrl = new URL(window.location.href);
    let searchParams = new URLSearchParams(currentUrl.search);
    let remoteIp = searchParams.get('remoteTestIPAddress');
    console.log(searchParams.get('remoteTestIPAddress'));
    url = remoteIp ? url + '&remoteTestIPAddress=' + remoteIp : url;

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {

                console.log("Called showReCaptcha And response is:" + xhr.responseText);
                console.log("200 response found");
                if (xhr.responseText) {

                    var caller = xhr.responseText;
                    if (caller == 'bot') {
                        expiryTime = 365;
                        console.log("Creating country cookie for bots");
                    } else {
                        digitalData.page.attributes.country = caller;
                    }
                    setCookie('country', caller, expiryTime, '/');
                    console.log("country cookie created for caller:" + caller);
                    var head = document.querySelector("head");
                    head.setAttribute('data-country', caller);
                    countryCookieValue = caller;
                } else {
                    console.log("reCaptcha has to be shown");
                }
            } else {
                console.error(xhr.statusText);
            }
            preloadDefault();
            loadLaunchCode();
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
        preloadDefault();
        loadLaunchCode();
    };
    xhr.send(null);

} else {
    cookieValue = decodeURIComponent(cookieValue);
    digitalData.page.attributes.country = cookieValue;
    countryCookieValue = cookieValue;
    preloadDefault();
    loadLaunchCode();
}

async function loadLoginDetails() {
    var pagepath = getMetaContentByName("digitaldata-pageInstanceID");
    if (!pagepath.includes('poco') && !pagepath.includes('lifesciences')) {
        var userCookie = readCookie('userdata');
        let profileArr = [];
        let userArr = [];
        let profileObj = {};
        let userObj = {};
        let attributes = {};
        if (!userCookie) {
            let url = "/header";
            let hybrisUrl = "/shop/en/USD";
            url = hybrisUrl + url;

            let login = false;

            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log("200 response found");
                        if (xhr.responseText) {
                            var data = JSON.parse(xhr.responseText);
                            if (data.loginStatus != 'true') {
                                let userdet = {};
                                login = true;
                                attributes.loginStatus = login;
                                userdet.ls = data.loginStatus;
                                profileObj.attributes = attributes;

                                let profileInfo = {};
                                profileInfo.profileEmail = data.profileEmail;
                                profileInfo.profileID = data.profileID;
                                profileInfo.profilePk = data.profilePk;
                                profileInfo.delivery = data.delivery;
                                userdet.email = data.profileEmail;
                                userdet.id = data.profileID;
                                userdet.pk = data.profilePk;
                                userdet.delivery = data.delivery;
                                if (data.company != "undefined" || data.company != null) {
                                    profileInfo.company = data.company;
                                    userdet.company = data.company;
                                } else {
                                    profileInfo.company = "";
                                    userdet.company = "";
                                }
                                if (data.salesOrg != "undefined" || data.salesOrg != null) {
                                    profileInfo.organization = data.salesOrg;
                                    userdet.org = data.salesOrg;
                                } else {
                                    profileInfo.organization = "";
                                    userdet.org = "";
                                }
                                profileObj.profileInfo = profileInfo;

                                let address = {};
                                if (data.city != null) {
                                    address.city = data.city;
                                    userdet.city = data.city;
                                } if (data.state_province != null) {
                                    address.state_province = data.state_province;
                                    userdet.state = data.state;
                                }
                                if (data.country != null) {
                                    address.country = data.country.isocode;
                                    userdet.cnt = data.country.isocode;
                                }
                                profileObj.address = address;

                                setCookie("userdata", JSON.stringify(userdet), expiryTime, "/");
                            } else {
                                login = false;
                                attributes.loginStatus = login;
                                profileObj.attributes = attributes;
                            }
                            profileArr.push(profileObj);
                            userObj.profile = profileArr;
                            userArr.push(userObj);
                            digitalData.user = userArr;
                        } else {
                            console.log("Data not found");
                        }
                    } else {
                        console.error(xhr.statusText);
                    }
                }
            };
            xhr.onerror = function (e) {
                console.error("Data not found");
            };
            xhr.send(null);
        } else {
            var data = JSON.parse(decodeURI(userCookie));
            if (data.ls != 'true') {
                attributes.loginStatus = true;
                profileObj.attributes = attributes;
            }
            let profileInfo = {};
            profileInfo.profileEmail = data.email;
            profileInfo.profileID = data.id;
            profileInfo.profilePk = data.pk;
            profileInfo.delivery = data.delivery;
            if (data.company != "undefined" || data.company != null) {
                profileInfo.company = data.company;
            } else {
                profileInfo.company = "";
            }
            if (data.org != "undefined" || data.org != null) {
                profileInfo.organization = data.org;
            } else {
                profileInfo.organization = "";
            }
            profileObj.profileInfo = profileInfo;
            let address = {};
            if (data.city != null) {
                address.city = data.city;
            } if (data.state != null) {
                address.state_province = data.state;
            }
            if (data.cnt != null) {
                address.country = data.cnt;
            }
            profileObj.address = address;

            profileArr.push(profileObj);
            userObj.profile = profileArr;
            userArr.push(userObj);
            digitalData.user = userArr;
        }
    }
}

function preloadDefault() {
    var readCookieControl = JSON.parse(readCookie("CookieControl"));
    if (readCookieControl !== null) {
        var optionalCookies = readCookieControl.optionalCookies;
        digitalData.cookiepreference = {};
        if (optionalCookies.analytics !== "revoked") {
            digitalData.cookiepreference.analytics = true;

            var hubspotTrackingCode = getMetaContentByName("digitaldata-hubspotTrackingCode");
            var script = document.createElement("script");
            script.type = "text/javascript";
            if (hubspotTrackingCode != null) {
                script.src = hubspotTrackingCode;
            }
            script.setAttribute("async", "");
            script.setAttribute("defer", "");
            script.setAttribute("id", "hs-script-loader");
            document.head.appendChild(script);
        } else {
            digitalData.cookiepreference.analytics = false;
        }
        if (optionalCookies.advertising !== "revoked") {
            digitalData.cookiepreference.advertising = true;
        } else {
            digitalData.cookiepreference.advertising = false;
        }
        if (optionalCookies.socialsharing !== "revoked") {
            digitalData.cookiepreference.socialnetworking = true;
        } else {
            digitalData.cookiepreference.socialnetworking = false;
        }

        if (optionalCookies.analytics !== "revoked" && optionalCookies.advertising !== "revoked") {
            (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-KRD9GM2');
        }
    }
}

async function loadLaunchCode() {
    await loadLoginDetails();
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = getMetaContentByName("launchPath");
    script.setAttribute("async", "");
    document.head.appendChild(script);
}

// **End Adobe Launch Script