class BeforeYouLeave extends HTMLElement {
  constructor() {
    super();
    this.popup = this.querySelector('.modal--popup');
    this.expiresMinutes = Number(this.dataset.expireMinutes) || 0;
    this.timeToShow = this.expiresMinutes * 60 * 1000;
    this.overlay = this.querySelector('[id^="Modal-Overlay-"]');
    this.content = this.querySelector('.popup__inner');

    this.idleTimer = null;
    this.boundReset = this.resetTimer.bind(this);
    this.boundCheck = this.checkIdle.bind(this);

    this.querySelector('.popup__close')?.addEventListener('click', () => this.setClosePopup());
    this.overlay?.addEventListener('click', () => this.setClosePopup());

    if (Shopify.designMode) {
      document.addEventListener('shopify:section:select', e => {
        if (e.target.matches('.section-before-you-leave')) this.setOpenPopup();
      });
      document.addEventListener('shopify:section:deselect', e => {
        if (e.target.matches('.section-before-you-leave')) this.setClosePopup();
      });
    }
  }

  connectedCallback() {
    if (!this.popup) return;

    if (!Shopify.designMode) {
      ['mousemove', 'keydown', 'scroll'].forEach(evt =>
        document.addEventListener(evt, this.boundReset)
      );
      this.startIdleTimer();
    }
  }

  disconnectedCallback() {
    if (Shopify.designMode) return;
    ['mousemove', 'keydown', 'scroll'].forEach(evt =>
      document.removeEventListener(evt, this.boundReset)
    );
    clearTimeout(this.idleTimer);
  }

  startIdleTimer() {
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(this.boundCheck, this.timeToShow);
  }

  resetTimer() {
    clearTimeout(this.idleTimer);
    this.startIdleTimer();
  }

  checkIdle() {
    if (!document.body.classList.contains('overflow-hidden')) this.setOpenPopup();
  }

  setOpenPopup() {
    if (!this.popup) return;
    this.popup.setAttribute('open', 'true');
    this.animateOpen();
    document.body.classList.add('overflow-hidden');
    document.documentElement.setAttribute('scroll-lock', '');
  }

  setClosePopup() {
    if (!this.popup) return;
    this.animateClose();
    this.startIdleTimer();
    setTimeout(() => {
      this.popup.removeAttribute('open');
      document.body.classList.remove('overflow-hidden');
      document.documentElement.removeAttribute('scroll-lock');
    }, 100);
  }

  animateOpen() {
    Motion.timeline([
      [this.content, { opacity: [0, 1], transform: ['translate(-50%, -40%)', 'translate(-50%, -50%)'] }, { duration: 0.3, at: '-0.15' }]
    ]).finished;
  }

  animateClose() {
    Motion.timeline([
      [this.content, { opacity: [1, 0], transform: ['translate(-50%, -50%)', 'translate(-50%, -40%)'] }, { duration: 0.2 }]
    ]).finished;
  }
}
if (!customElements.get('before-you-leave')) customElements.define('before-you-leave', BeforeYouLeave);