import splitbee from '@splitbee/web';

import Prism from 'prismjs'

import 'prismjs/themes/prism-tomorrow.css' // see other themes in the prism docs

import 'prismjs/components/prism-markup-templating'

import 'prismjs/components/prism-php'

import 'prismjs/components/prism-bash'

import 'prismjs/components/prism-css'

import 'prismjs/components/prism-json'

import 'prismjs/components/prism-javascript'

import 'prismjs/components/prism-yaml'

// Prism.highlightAll()

(() => {
    splitbee.init()

    const deleteAllCookiesWithPrefix = (prefix) => {
        // Get all cookies as a single string
        const cookies = document.cookie.split(';');

        // Loop through all cookies
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            const cookieName = cookie.split('=')[0];

            // Check if the cookie name starts with the given prefix
            if (cookieName.startsWith(prefix)) {
                // Delete the cookie by setting its expiration date to the past
                document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            }
        }
    }

    const removeSplitBeeCookies = () => {
        deleteAllCookiesWithPrefix('sb_');
    }

    const cookieBannerEl = document.querySelector('#cookie-banner');
    if (!localStorage.getItem('cookies-accepted')) {
        cookieBannerEl.classList.remove('hidden')
    } else if (localStorage.getItem('cookies-accepted') === 'all') {
        splitbee.enableCookie();
    }

    document.querySelector('.js-cookies-allow-min')?.addEventListener('click', () => {
        localStorage.setItem('cookies-accepted', 'minimal');
        removeSplitBeeCookies();
        cookieBannerEl.classList.add('hidden');
    });

    document.querySelector('.js-cookies-allow-all')?.addEventListener('click', () => {
        localStorage.setItem('cookies-accepted', 'all');
        splitbee.enableCookie();
        cookieBannerEl.classList.add('hidden');
    });

    document.querySelector('.js-cookies-manage')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('cookies-accepted');
        removeSplitBeeCookies();
        cookieBannerEl.classList.remove('hidden');
    });
})();
