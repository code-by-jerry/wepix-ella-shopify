class MultitaskingBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setInitLayout();
    this.init();
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  init() {
    this.buttonToggle = this.querySelectorAll('.multi-t__button');
    this.onBodyClick = this.handleBodyClick.bind(this);

    if (this.querySelector('.button__back-to-top')) {
      this.scrollTopHeight = this.querySelector('.button__back-to-top .multi-t__button').offsetHeight;
      this.handleScroll = this.throttleScroll.bind(this);
      window.addEventListener('scroll', this.handleScroll);
    }

    this.buttonToggle?.forEach((button) => {
      button.addEventListener('click', this.open.bind(this));
    });

    ['.drawer__close', '[id^="Drawer-Overlay-"]'].forEach((selector) => {
      this.querySelector(selector)?.addEventListener('click', this.close.bind(this));
    });
  }

  setInitLayout() {
    this.querySelectorAll('.target-block')[0].classList.add('active');
    this.querySelectorAll('.target-block').forEach((button, index) => {
      button.setAttribute('data-index', index + 1);
    });
  }

  open(event) {
    this.buttonToggle?.forEach((button) => {
      if (button != event.currentTarget) {
        button.closest('.target-block')?.classList.remove('active');
        button.closest('.target-block').querySelector('.multi-t__wrapper')?.classList.remove('active');
      } else {
        this.activeFirst = this.querySelector(`.target-block:first-child`);
        if (
          button.closest('.target-block').classList.contains('active') &&
          !this.activeFirst.classList.contains('active')
        ) {

          this.querySelectorAll('.target-block').forEach((button) => {
            button.classList.remove('active');
          });
          this.activeFirst.classList.add('active');
        } else {
          this.activeFirst.classList.remove('active');
        }
      }
    });

    const targetBlock = event.currentTarget.closest('.target-block');
    const _target = event.currentTarget.dataset.target;
    if (targetBlock) {
      targetBlock.classList.toggle('active');

      if (_target === 'multitasking-social-media') {
        targetBlock.querySelector('.multi-t__wrapper')?.classList.toggle('active');
      } else if (_target === 'back-to-top') {
        window.scroll({ top: 0, behavior: 'smooth' });
        return false;
      }
    }

    document.body.addEventListener('click', this.onBodyClick);
  }

  close() {
    this.querySelectorAll('.target-block.active').forEach((button) => {
      button.classList.remove('active');
      button.querySelector('.multi-t__wrapper')?.classList.remove('active');
      this.querySelector('.target-block:first-child').classList.add('active');
    });

    document.body.removeEventListener('click', this.onBodyClick);
  }

  handleBodyClick(event) {
    const target = event.target;
    if (
      !this.contains(target) &&
      target !== document.getElementsByClassName('popup__inner') &&
      !target.closest('.popup__inner')
    )
      this.close();
  }

  throttleScroll() {
    if (!this.isScrolling) {
      window.requestAnimationFrame(() => {
        this.onScroll();
        this.isScrolling = false;
      });
    }
    this.isScrolling = true;
  }

  onScroll() {
    const backToTopButton = this.querySelector('.button__back-to-top');
    const firstTargetBlock = this.querySelector('.target-block:first-child');

    if (window.pageYOffset <= 300) {
      backToTopButton.classList.add('hide');

      if (!this.querySelector(`.button__back-to-top:first-child`) && backToTopButton.classList.contains('active')) {
        backToTopButton.classList.remove('active');
        firstTargetBlock?.classList.add('active');
      }

      backToTopButton.style.setProperty('--h-cus', '0px');
    } else {
      backToTopButton.classList.remove('hide');
      backToTopButton.style.setProperty('--h-cus', `${this.scrollTopHeight}px`);
    }
  }
}
if (!customElements.get('multitasking-bar')) customElements.define('multitasking-bar', MultitaskingBar);