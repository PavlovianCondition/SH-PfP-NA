// ==UserScript==
// @name         SH-PfP-NA
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @updateURL    https://raw.githubusercontent.com/PavlovianCondition/SH-PfP-NA/main/SH-PfP-NA.user.js
// @downloadURL  https://raw.githubusercontent.com/PavlovianCondition/SH-PfP-NA/main/SH-PfP-NA.user.js
// @description  Stopgap fix for NA users affected by the SpaceHey profile-picture CDN routing error
// @author       Pavlovian Condition
// @match        https://spacehey.com/*
// @match        https://*.spacehey.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spacehey.com
// @grant        GM_xmlhttpRequest
// @connect      spacehey.com
// @connect      *.spacehey.com
// @exclude      https://spacehey.com/settings
// @exclude      https://spacehey.com/reset
// @exclude      https://spacehey.com/export
// @exclude      https://spacehey.com/deleteaccount
// ==/UserScript==
// Copyright (c) 2026 Pavlovian Condition. All Rights Reserved.
// This source code is proprietary. Unauthorized copying, redistribution, or
// mirrors of this script are strictly prohibited.
// Modification is permitted solely through forks and pull requests directed
// to the official GitHub repository: https://github.com/PavlovianCondition/SH-PfP-NA.

(function() {
    'use strict';
let profPageExcluArray = ['/home', '/browse', '/search', '/bulletin', '/favorites']
const idCache = {}
let queueIndex = 0

function profileFetcher(targetUrl, userId, imgElement) {
    if (userId in idCache) {
        imgElement.src = idCache[userId]
        return;
    }
    let xhr = GM_xmlhttpRequest({
        method: "GET",
        url: targetUrl,
        responseType: "stream",
        onloadstart: function(response) {
            console.log("Fetching URL:", targetUrl);
            let reader = response.response.getReader();
            let decoder = new TextDecoder();
            let buffer = '';
            function readChunk() {
                reader.read().then(({ done, value }) => {
                    if (done) return;
                    buffer += decoder.decode(value, { stream: true });
                    let targetIndex = buffer.indexOf('<meta property="og:image" content="');
                    if (targetIndex !== -1) {
                        let afterContent = buffer.substring(targetIndex + 35);
                        let endQuoteIndex = afterContent.indexOf('"');
                        if (endQuoteIndex !== -1) {
                            let extimg = afterContent.substring(0, endQuoteIndex);
                            if (userId) idCache[userId] = extimg;
                            imgElement.src = extimg;
                            xhr.abort();
                        }
                    }
                    readChunk();
                }
                );
            }
            readChunk();
            console.log(response)
        }
});


}

const currentDomain = window.location.hostname;
const currentPath = window.location.pathname;
    console.log(currentDomain)
    console.log(currentPath)
    // v Homepage handler
    if (currentPath === '/home') {
        console.log('YO!')
        let profileavatar = document.querySelector('.profile-pic > a > .pfp-fallback')
            let imgElement = profileavatar
            if (profileavatar) {
                let parentLink = profileavatar.closest('a')
                if (parentLink) {
                    let rawHref = parentLink.getAttribute('href');
                    let targetUrl = rawHref.startsWith('http') ? rawHref : 'https://spacehey.com' + rawHref;
                    let userId = rawHref.split('?id=')[1];
                    if (!userId) {
                        userId = rawHref.replace(/^\/+/, '');
                    }
                    profileFetcher(targetUrl, userId, imgElement);
                }
                console.log('you found at', profileavatar);
            }

        document.querySelectorAll(':not(.profile-pic) > a > .pfp-fallback').forEach(function(pfp) {
            pfp.onerror = function() {
                queueIndex++;
                setTimeout(function() {
                    let imgElement = pfp
                    let parentLink = pfp.closest('a');
                    if (parentLink) {
                        let rawHref = parentLink.getAttribute('href');
                        let targetUrl = rawHref.startsWith('http') ? rawHref : 'https://spacehey.com' + rawHref;
                        let userId = rawHref.split('?id=')[1];
                        if (!userId) {
                            userId = rawHref.replace(/^\/+/, '');
                        }
                        profileFetcher(targetUrl, userId, imgElement);
                    }
                }, queueIndex * 475);
            }

            console.log(pfp)
        });
    }
    // v Profile handler
    if (currentDomain === 'spacehey.com' && !profPageExcluArray.includes(currentPath)) {
        let profileavatar = document.querySelector('.profile-pic .pfp-fallback')
        if (profileavatar) {
            let metaSwitch = function() {
                let metaTag = document.querySelector('meta[property="og:image"]');
                    if (metaTag) {
                        profileavatar.src = metaTag.getAttribute('content');
                    }
            }
            profileavatar.onerror = function() {
                metaSwitch();
            }
            if (profileavatar.src === 'https://spacehey.com/img/default_profile_pic.png') {
                metaSwitch();
            }
        }

        document.querySelectorAll(':not(.profile-pic) > .pfp-fallback').forEach(function(pfp) {
            pfp.onerror = function() {
                queueIndex++;
                setTimeout(function() {
                    let imgElement = pfp
                    let parentLink = pfp.closest('a');
                    if (parentLink) {
                        let rawHref = parentLink.getAttribute('href');
                        let targetUrl = rawHref.startsWith('http') ? rawHref : 'https://spacehey.com' + rawHref;
                        let userId = rawHref.split('?id=')[1];
                        if (!userId) {
                            userId = rawHref.replace(/^\/+/, '');
                        }
                        profileFetcher(targetUrl, userId, imgElement);
                    }
                }, queueIndex * 475);
            }

            console.log(pfp)
        });

    }
    // v Browse, Search handler
    if (currentPath === '/browse' || currentPath === '/search') {
        document.querySelectorAll('a > .pfp-fallback').forEach(function(pfp) {
            pfp.onerror = function() {
                queueIndex++;
                setTimeout(function() {
                    let imgElement = pfp
                    let parentLink = pfp.closest('a');
                    if (parentLink) {
                        let rawHref = parentLink.getAttribute('href');
                        let targetUrl = rawHref.startsWith('http') ? rawHref : 'https://spacehey.com' + rawHref;
                        let userId = rawHref.split('?id=')[1];
                        if (!userId) {
                            userId = rawHref.replace(/^\/+/, '');
                        }
                        profileFetcher(targetUrl, userId, imgElement);
                    }
                }, queueIndex * 475);
            }

            console.log(pfp)
        });
    }
    // v IM handler
    if (currentDomain === 'im.spacehey.com') {
        console.log("DOM state at execution:", document.querySelectorAll('.chat-item').length);
        let profileavatar = document.querySelector('.profile-pic.pfp-fallback.own-pfp-image')
        if (profileavatar) {
            let lookup = profileavatar.onerror = function() {
                queueIndex++;
                setTimeout(function() {
                    let imgElement = profileavatar
                    let parentLink = profileavatar.closest('a');
                    if (parentLink) {
                        let rawHref = parentLink.getAttribute('href');
                        if (rawHref !== '') {
                        let targetUrl = rawHref.startsWith('http') ? rawHref : 'https://spacehey.com' + rawHref;
                        let userId = rawHref.split('?id=')[1];
                        if (!userId) {
                            userId = rawHref.replace(/^\/+/, '');
                        }
                        profileFetcher(targetUrl, userId, imgElement);
                        }
                    }
                }, queueIndex * 475);
            }
/*            if (profileavatar.src === 'https://spacehey.com/img/default_profile_pic.png') {
                    lookup();
            }*/
        }
        let mutObs = new MutationObserver(function(mutations) {
            if (currentPath !== '/new') {
                document.querySelectorAll('.profile-pic.pfp-fallback:not(.own-pfp-image):not([data-fixed])').forEach(function(pfp) {
                pfp.setAttribute('data-fixed', 'true');
                console.log("Newly discovered element flagged:", pfp);
                let lookup = pfp.onerror = function() {
                    queueIndex++;
                    setTimeout(function() {
                        let imgElement = pfp
                        let parentLink = pfp.closest('.chat-item');
                        if (parentLink) {
                            let rawHref = parentLink.getAttribute('data-user');
                            console.log("Sidebar error event attached & fired for ID:", rawHref);
                            let targetUrl = 'https://spacehey.com/profile?id=' + rawHref;
                            let userId = rawHref;
                            profileFetcher(targetUrl, userId, imgElement);
                            return;
                        }
                        else {
                            let rawHref = pfp.closest('.chat-header-profile-link').getAttribute('href')
                            let targetUrl = rawHref.startsWith('http') ? rawHref : 'https://spacehey.com' + rawHref;
                            let userId = rawHref.split('?id=')[1];
                            if (!userId) {
                                userId = rawHref.replace(/^\/+/, '');
                            }
                            profileFetcher(targetUrl, userId, imgElement);
                        }
                    }, queueIndex * 475);
                }
/*                if (pfp.src === 'https://spacehey.com/img/default_profile_pic.png') {
                        lookup();
                    }*/

                console.log(pfp)
                });
            }
        });
        mutObs.observe(document.body, { childList: true, subtree: true });
        if (currentPath === '/new') {
            console.log('YO!')
            document.querySelectorAll('a > .pfp-fallback').forEach(function(pfp) {
                pfp.onerror = function() {
                queueIndex++;
                setTimeout(function() {
                    let imgElement = pfp
                    let parentLink = pfp.closest('a');
                    if (parentLink) {
                        let rawHref = parentLink.getAttribute('href');
                        let cleanHref = rawHref.split('?user=')[1];
                        let targetUrl = 'https://spacehey.com/profile?id=' + cleanHref;
                        let userId = cleanHref;
                        profileFetcher(targetUrl, userId, imgElement);
                    }
                }, queueIndex * 475);
            }
                console.log(pfp)
            }
        )}
    }
    // v Blog handler
    if (currentDomain.startsWith('blog.spacehey.com')) {
        let profileavatar = document.querySelector('.profile-pic .pfp-fallback')
        if (profileavatar) {
        let metaSwitch = function() {
            let metaTag = document.querySelector('meta[property="og:image"]');
                if (metaTag) {
                    profileavatar.src = metaTag.getAttribute('content');
                }
        }
        profileavatar.onerror = function() {
            metaSwitch();
        }
        if (profileavatar.src === 'https://spacehey.com/img/default_profile_pic.png') {
            metaSwitch();
        }
        }
        document.querySelectorAll(':not(.profile-pic) > .pfp-fallback').forEach(function(pfp) {
        pfp.onerror = function() {
            queueIndex++;
            setTimeout(function() {
                let imgElement = pfp
                let parentLink = pfp.closest('a');
                if (parentLink) {
                    let rawHref = parentLink.getAttribute('href');
                    let targetUrl = rawHref.startsWith('http') ? rawHref : 'https://spacehey.com' + rawHref;
                    let userId = rawHref.split('?id=')[1];
                    if (!userId) {
                        userId = rawHref.replace(/^\/+/, '');
                    }
                    profileFetcher(targetUrl, userId, imgElement);
                }
            }, queueIndex * 475);
        }

        console.log(pfp)
        });
    }
    // v Bulletin handler
    if (currentPath === '/bulletin' || currentPath === '/bulletincomment') {
        let profileavatar = document.querySelector('.profile-pic .pfp-fallback')
        profileavatar.onerror = function() {
            let imgElement = profileavatar
            let author = document.querySelector('.author-details > h4 > a')
            let rawHref = author.getAttribute('href')
            let targetUrl = rawHref.startsWith('http') ? rawHref : 'https://spacehey.com' + rawHref;
                let userId = rawHref.split('?id=')[1];
                if (!userId) {
                    userId = rawHref.replace(/^\/+/, '');
                }
                profileFetcher(targetUrl, userId, imgElement);
        }
        document.querySelectorAll(':not(.profile-pic) > .pfp-fallback').forEach(function(pfp) {
            pfp.onerror = function() {
                queueIndex++;
                setTimeout(function() {
                    let imgElement = pfp
                    let parentLink = pfp.closest('a');
                    if (parentLink) {
                        let rawHref = parentLink.getAttribute('href');
                        let targetUrl = rawHref.startsWith('http') ? rawHref : 'https://spacehey.com' + rawHref;
                        let userId = rawHref.split('?id=')[1];
                        if (!userId) {
                            userId = rawHref.replace(/^\/+/, '');
                        }
                        profileFetcher(targetUrl, userId, imgElement);
                    }
                }, queueIndex * 475);
            }

            console.log(pfp)
        });

    }
    // v Forum handler
    if (currentDomain === 'forum.spacehey.com') {
        if (currentPath === '/forum') {
            console.log('YO!')
            document.querySelectorAll('.profile-pic.pfp-fallback').forEach(function(profileavatar) {
                profileavatar.onerror = function() {
                    queueIndex++;
                    setTimeout(function() {
                        let imgElement = profileavatar
                        let parentLink = profileavatar.closest('a');
                        if (parentLink) {
                            let rawHref = parentLink.getAttribute('href');
                            if (rawHref !== '') {
                                let cleanHref = rawHref.split('?id=')[1];
                                let targetUrl = 'https://spacehey.com/profile?id=' + cleanHref;
                                let userId = cleanHref;
                                if (!userId) {
                                    userId = rawHref.replace(/^\/+/, '');
                                }
                                profileFetcher(targetUrl, userId, imgElement);
                            }
                        }
                    }, queueIndex * 475);
                }

            })
        }
        /* --non-functional as of this version, commenting out to keep it vestigial-- if (currentPath === '/topic') {
            console.log('YO!')
            document.querySelectorAll('.profile-pic.pfp-fallback').forEach(function(profileavatar) {
                profileavatar.onerror = function() {
                    queueIndex++;
                    setTimeout(function() {
                        let imgElement = profileavatar
                        let parentLink = profileavatar.closest('a');
                        if (parentLink) {
                            let rawHref = parentLink.getAttribute('href');
                            if (rawHref !== '') {
                            let targetUrl = rawHref.startsWith('http') ? rawHref : 'https://spacehey.com' + rawHref;
                            let userId = rawHref.split('?id=')[1];
                            if (!userId) {
                                userId = rawHref.replace(/^\/+/, '');
                            }
                            profileFetcher(targetUrl, userId, imgElement);
                            }
                        }
                    }, queueIndex * 475);
                }

            })
        } */
        if (currentPath === '/user' || currentPath !== '/forum' && currentPath !== '/topic') {
            let profileavatar = document.querySelector('.profile-pic .pfp-fallback')
            if (profileavatar) {
                profileavatar.onerror = function() {

                let imgElement = profileavatar
                let parentLink = document.querySelector('.url-info.view-full-profile > p > a')
                if (parentLink) {
                        let rawHref = parentLink.getAttribute('href');
                        if (rawHref !== '') {
                        let targetUrl = rawHref.startsWith('http') ? rawHref : 'https://spacehey.com' + rawHref;
                        let userId = rawHref.split('?id=')[1];
                        if (!userId) {
                            userId = rawHref.replace(/^\/+/, '');
                        }
                        profileFetcher(targetUrl, userId, imgElement);
                        }
                    }
                }
                console.log(profileavatar);
            }
        }

    }
    // v Groups handler
    if (currentDomain === 'groups.spacehey.com') {
        if (currentPath === '/' || currentPath === '/new' || currentPath === '/category') {
            document.querySelectorAll('.group-info > a > .group-pic').forEach(function(groupIcon) {
                groupIcon.onerror = function(){
                    if (groupIcon.src.includes('https://external-media.spacehey.net')) {
                        (groupIcon.src) = 'https://static.spacehey.net/img/default/grouppic.png'
                        return;
                    }
                    queueIndex++;
                    setTimeout(function() {
                    let imgElement = groupIcon
                    let parentLink = groupIcon.closest('a')
                    let href = parentLink.getAttribute('href')
                    let targetUrl = 'https://groups.spacehey.com' + href
                    let userId = href
                    profileFetcher(targetUrl, userId, imgElement);
                    }, queueIndex * 475);
                }
            })
            //<a href="/group?id=45901">


        }
        if (currentPath === '/members') {document.querySelectorAll('a > .pfp-fallback').forEach(function(pfp) {
            pfp.onerror = function() {
                queueIndex++;
                setTimeout(function() {
                    let imgElement = pfp
                    let parentLink = pfp.closest('a');
                    if (parentLink) {
                        let rawHref = parentLink.getAttribute('href');
                        let targetUrl = rawHref.startsWith('http') ? rawHref : 'https://spacehey.com' + rawHref;
                        let userId = rawHref.split('?id=')[1];
                        if (!userId) {
                            userId = rawHref.replace(/^\/+/, '');
                        }
                        profileFetcher(targetUrl, userId, imgElement);
                    }
                }, queueIndex * 475);
            }

            console.log(pfp)
        });}
        else {
            let groupPic = document.querySelector('.group-pic')
            let metaSwitch = function() {
                let metaTag = document.querySelector('meta[property="og:image"]');
                    if (metaTag) {
                        groupPic.src = metaTag.getAttribute('content');
                    }
            }
            groupPic.onerror = function() {
                metaSwitch();
            }
            document.querySelectorAll('a > .profile-pic.pfp-fallback').forEach(function(pfp) {
            pfp.onerror = function() {
                queueIndex++;
                setTimeout(function() {
                    let imgElement = pfp
                    let parentLink = pfp.closest('a');
                    if (parentLink) {
                        let rawHref = parentLink.getAttribute('href');
                        let targetUrl = rawHref.startsWith('http') ? rawHref : 'https://spacehey.com' + rawHref;
                        let userId = rawHref.split('?id=')[1];
                        if (!userId) {
                            userId = rawHref.replace(/^\/+/, '');
                        }
                        profileFetcher(targetUrl, userId, imgElement);
                    }
                }, queueIndex * 475);
            }

            console.log(pfp)
        });
        }
    }
    // v Layouts handler
    if (currentDomain === 'layouts.spacehey.com') {
        if (currentPath === '/layout') {
            let profileavatar = document.querySelector('.profile-pic .pfp-fallback')
            profileavatar.onerror = function() {
                let imgElement = profileavatar
                let author = document.querySelector('.author-details > h4 > a')
                if (author) {
                    let rawHref = author.getAttribute('href')
                    let cleanHref = rawHref.split('user?id=')[1];
                    let targetUrl = 'https://spacehey.com/profile?id=' + cleanHref;
                    let userId = cleanHref;
                profileFetcher(targetUrl, userId, imgElement);
                }
        }
            document.querySelectorAll(':not(.profile-pic) > a > .pfp-fallback').forEach(function(pfp) {
            pfp.onerror = function() {
                queueIndex++;
                setTimeout(function() {
                    let imgElement = pfp
                    let parentLink = pfp.closest('a');
                    if (parentLink) {
                        let rawHref = parentLink.getAttribute('href');
                        let targetUrl = rawHref.startsWith('http') ? rawHref : 'https://spacehey.com' + rawHref;
                        let userId = rawHref.split('?id=')[1];
                        if (!userId) {
                            userId = rawHref.replace(/^\/+/, '');
                        }
                        profileFetcher(targetUrl, userId, imgElement);
                    }
                }, queueIndex * 475);
            }

            console.log(pfp)
        });
        }
    }
    // v Favourites handler
    if (currentPath === '/favorites') {
        document.querySelectorAll('a > .pfp-fallback').forEach(function(pfp) {
            pfp.onerror = function() {
                queueIndex++;
                setTimeout(function() {
                    let imgElement = pfp
                    let parentLink = pfp.closest('a');
                    if (parentLink) {
                        let rawHref = parentLink.getAttribute('href');
                        let targetUrl = rawHref.startsWith('http') ? rawHref : 'https://spacehey.com' + rawHref;
                        let userId = rawHref.split('?id=')[1];
                        if (!userId) {
                            userId = rawHref.replace(/^\/+/, '');
                        }
                        profileFetcher(targetUrl, userId, imgElement);
                    }
                }, queueIndex * 475);
            }

            console.log(pfp)
        });
    }

})();
