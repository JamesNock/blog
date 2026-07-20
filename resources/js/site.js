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
    const posthogKey = 'phc_z6i8Ve9HPy7m4VwwvoBxWCLWgpT7qr6dqeT5wzMNcu7e'
    let posthogPromise

    const loadPostHog = () => {
        posthogPromise ??= import('posthog-js').then(({ default: posthog }) => {
            posthog.init(posthogKey, {
                api_host: 'https://eu.i.posthog.com',
                ui_host: 'https://eu.posthog.com',
                defaults: '2026-05-30',
                person_profiles: 'identified_only',
            })

            return posthog
        }).catch((error) => {
            posthogPromise = undefined
            console.error('Unable to load PostHog', error)
        })

        return posthogPromise
    }

    const enablePostHog = async () => {
        const posthog = await loadPostHog()

        if (posthog?.has_opted_out_capturing()) {
            posthog.opt_in_capturing({ captureEventName: false })
            posthog.capture('$pageview')
        }
    }

    const disablePostHog = async () => {
        if (!posthogPromise) {
            return
        }

        const posthog = await posthogPromise
        posthog?.opt_out_capturing()
    }

    const cookieBannerEl = document.querySelector('#cookie-banner');
    if (!localStorage.getItem('cookies-accepted')) {
        cookieBannerEl.classList.remove('hidden')
    } else if (localStorage.getItem('cookies-accepted') === 'all') {
        void enablePostHog();
    }

    document.querySelector('.js-cookies-allow-min')?.addEventListener('click', () => {
        localStorage.setItem('cookies-accepted', 'minimal');
        void disablePostHog();
        cookieBannerEl.classList.add('hidden');
    });

    document.querySelector('.js-cookies-allow-all')?.addEventListener('click', () => {
        localStorage.setItem('cookies-accepted', 'all');
        void enablePostHog();
        cookieBannerEl.classList.add('hidden');
    });

    document.querySelector('.js-cookies-manage')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('cookies-accepted');
        void disablePostHog();
        cookieBannerEl.classList.remove('hidden');
    });
})();
