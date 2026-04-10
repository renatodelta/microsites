(function () {
  const CONSENT_KEY = 'cdc_cookie_consent_v1';
  const CONSENT_COOKIE = 'cdc_cookie_consent';
  const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

  const defaultConsent = {
    necessary: true,
    analytics: false,
    marketing: false,
    updatedAt: null
  };

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  });

  function readConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return {
        ...defaultConsent,
        ...parsed,
        necessary: true
      };
    } catch (error) {
      return null;
    }
  }

  function writeConsent(consent) {
    const safeConsent = {
      necessary: true,
      analytics: !!consent.analytics,
      marketing: !!consent.marketing,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(safeConsent));

    const encoded = encodeURIComponent(JSON.stringify({
      n: 1,
      a: safeConsent.analytics ? 1 : 0,
      m: safeConsent.marketing ? 1 : 0,
      t: safeConsent.updatedAt
    }));

    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${CONSENT_COOKIE}=${encoded}; path=/; max-age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;

    return safeConsent;
  }

  function mapToGoogleConsent(consent) {
    const analyticsGranted = consent.analytics ? 'granted' : 'denied';
    const marketingGranted = consent.marketing ? 'granted' : 'denied';

    return {
      ad_storage: marketingGranted,
      ad_user_data: marketingGranted,
      ad_personalization: marketingGranted,
      analytics_storage: analyticsGranted,
      functionality_storage: 'granted',
      security_storage: 'granted'
    };
  }

  function applyGoogleConsent(consent) {
    gtag('consent', 'update', mapToGoogleConsent(consent));
  }

  function loadCategoryScripts(consent) {
    const blockedScripts = document.querySelectorAll('script[data-consent-category][type="text/plain"]');
    blockedScripts.forEach((scriptTag) => {
      const category = scriptTag.getAttribute('data-consent-category');
      const allow =
        category === 'necessary' ||
        (category === 'analytics' && consent.analytics) ||
        (category === 'marketing' && consent.marketing);

      if (!allow || scriptTag.dataset.loaded === '1') return;

      const activeScript = document.createElement('script');
      const source = scriptTag.getAttribute('data-src');
      if (source) {
        activeScript.src = source;
        activeScript.async = scriptTag.hasAttribute('data-async');
      } else {
        activeScript.textContent = scriptTag.textContent;
      }

      activeScript.dataset.consentCategory = category;
      activeScript.dataset.loadedFromConsent = '1';
      scriptTag.dataset.loaded = '1';
      scriptTag.parentNode.insertBefore(activeScript, scriptTag.nextSibling);
    });
  }

  const interacted = false;
  let interactionEvents = ['scroll', 'mousemove', 'touchstart', 'keydown', 'click'];
  let pendingGTM = false;
  let pendingAdSense = false;

  function loadGTMIfConsent(consent) {
    if (window.__gtmLoaded) return;
    window.__gtmLoaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-PZ6RXCVQFZ';
    document.head.appendChild(script);

    gtag('js', new Date());
    gtag('config', 'G-PZ6RXCVQFZ');
  }

  function triggerOptionalScripts(consent, interact) {
    if (!interact) {
        setTimeout(function() {
            triggerOptionalScripts(consent, true);
        }, 4000); // Fail-safe after 4 seconds
        return;
    }
    
    // Load GTM
    loadGTMIfConsent(consent);

    // Load AdSense
    const adClientMeta = document.querySelector('meta[name="adsense-client"]');
    if (adClientMeta && !window.__adsenseLoaded && (consent.marketing || consent.analytics)) {
        window.__adsenseLoaded = true;
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.requestNonPersonalizedAds = consent.marketing ? 0 : 1;

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adClientMeta.content)}`;
        script.crossOrigin = 'anonymous';
        script.onload = function () {
          document.dispatchEvent(new CustomEvent('adsense:loaded', {
            detail: { personalized: consent.marketing }
          }));
        };
        document.head.appendChild(script);
    }
  }

  function applyConsent(consent) {
    applyGoogleConsent(consent);
    loadCategoryScripts(consent);

    // Always delay heavy scripts until interaction
    function onInteraction() {
        interactionEvents.forEach(e => window.removeEventListener(e, onInteraction, { passive: true }));
        triggerOptionalScripts(consent, true);
    }

    interactionEvents.forEach(e => window.addEventListener(e, onInteraction, { passive: true }));
    triggerOptionalScripts(consent, false); // fallback
  }

  function createConsentBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-banner__content">
        <p>
          Utilizamos cookies essenciais para o funcionamento do site e cookies opcionais para estatísticas e exibição de anúncios personalizados. Você pode aceitar todos os cookies, rejeitar os opcionais ou gerenciar suas preferências a qualquer momento nas configurações.
        </p>
        <div class="cookie-banner__actions">
          <button type="button" class="btn cookie-banner__manage" data-cookie-action="manage" aria-label="Gerenciar preferências" title="Gerenciar preferências">⚙</button>
          <button type="button" class="btn secondary btn-cookie-reject" data-cookie-action="reject">REJEITAR COOKIES</button>
          <button type="button" class="btn btn-cookie-accept" data-cookie-action="accept">ACEITAR COOKIES</button>
        </div>
      </div>
    `;

    return banner;
  }

  function createPreferenceModal() {
    const modal = document.createElement('div');
    modal.className = 'cookie-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="cookie-modal__overlay" data-cookie-close="1"></div>
      <div class="cookie-modal__panel" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">
        <h2 id="cookie-modal-title">Gerenciar preferências de cookies</h2>
        <p>Você pode revisar e alterar seu consentimento a qualquer momento.</p>

        <div class="cookie-option">
          <div>
            <strong>Necessários</strong>
            <p>Essenciais para segurança, navegação e funcionamento do site.</p>
          </div>
          <label class="cookie-switch">
            <input type="checkbox" checked disabled />
            <span>Sempre ativo</span>
          </label>
        </div>

        <div class="cookie-option">
          <div>
            <strong>Estatísticos</strong>
            <p>Ajudam a entender uso do site e melhorar conteúdo.</p>
          </div>
          <label class="cookie-switch">
            <input id="cookie-analytics" type="checkbox" />
            <span>Permitir</span>
          </label>
        </div>

        <div class="cookie-option">
          <div>
            <strong>Marketing/Publicidade</strong>
            <p>Controla personalização de anúncios e medição de campanhas.</p>
          </div>
          <label class="cookie-switch">
            <input id="cookie-marketing" type="checkbox" />
            <span>Permitir</span>
          </label>
        </div>

        <div class="cookie-modal__actions">
          <button type="button" class="btn" data-cookie-save="1">Salvar preferências</button>
          <button type="button" class="btn secondary" data-cookie-close="1">Fechar</button>
        </div>
      </div>
    `;

    return modal;
  }

  function sanitizeValue(text) {
    return String(text)
      .replace(/[<>]/g, '')
      .replace(/[\u0000-\u001F\u007F]/g, '')
      .trim();
  }

  function attachFormProtection() {
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      if (!form.querySelector('input[name="_hp_field"]')) {
        const honey = document.createElement('input');
        honey.type = 'text';
        honey.name = '_hp_field';
        honey.tabIndex = -1;
        honey.autocomplete = 'off';
        honey.className = 'hp-field';
        form.appendChild(honey);
      }

      form.addEventListener('submit', function (event) {
        const hp = form.querySelector('input[name="_hp_field"]');
        if (hp && hp.value) {
          event.preventDefault();
          return;
        }

        form.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach((field) => {
          field.value = sanitizeValue(field.value);
        });
      });
    });
  }

  function initMobileMenu() {
    const topbar = document.querySelector('.topbar');
    const nav = topbar ? topbar.querySelector('nav') : null;

    if (!topbar || !nav || topbar.querySelector('.nav-toggle')) return;

    if (!nav.id) {
      nav.id = 'site-nav';
    }

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Abrir menu');
    toggle.setAttribute('aria-controls', nav.id);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';

    topbar.insertBefore(toggle, nav);

    function closeMenu() {
      topbar.classList.remove('is-nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
    }

    toggle.addEventListener('click', function () {
      const isOpen = topbar.classList.toggle('is-nav-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (event) {
      if (window.innerWidth > 820) return;
      if (!topbar.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    attachFormProtection();
    initMobileMenu();

    const banner = createConsentBanner();
    const modal = createPreferenceModal();
    document.body.appendChild(banner);
    document.body.appendChild(modal);

    const analyticsInput = modal.querySelector('#cookie-analytics');
    const marketingInput = modal.querySelector('#cookie-marketing');

    function openModal() {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }

    function hideBanner() {
      banner.classList.add('is-hidden');
    }

    function syncInputs(consent) {
      analyticsInput.checked = !!consent.analytics;
      marketingInput.checked = !!consent.marketing;
    }

    function saveAndApply(consent) {
      const stored = writeConsent(consent);
      applyConsent(stored);
      syncInputs(stored);
      hideBanner();
    }

    const existingConsent = readConsent();
    if (existingConsent) {
      syncInputs(existingConsent);
      applyConsent(existingConsent);
      hideBanner();
    }

    banner.addEventListener('click', function (event) {
      const action = event.target.getAttribute('data-cookie-action');
      if (!action) return;

      if (action === 'accept') {
        saveAndApply({ necessary: true, analytics: true, marketing: true });
      }

      if (action === 'reject') {
        saveAndApply({ necessary: true, analytics: false, marketing: false });
      }

      if (action === 'manage') {
        openModal();
      }
    });

    modal.addEventListener('click', function (event) {
      if (event.target.getAttribute('data-cookie-close') === '1') {
        closeModal();
      }

      if (event.target.getAttribute('data-cookie-save') === '1') {
        saveAndApply({
          necessary: true,
          analytics: analyticsInput.checked,
          marketing: marketingInput.checked
        });
        closeModal();
      }
    });

  });
})();
