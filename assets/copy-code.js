class CopyCode extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener('click', this.copyCode.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.copyCode.bind(this));
  }

  copyCode() {
    this.inputField = this.querySelector('.promotion-code__field .promo-code__input');
    this.tooltip = this.querySelector('.tooltip');
    navigator.clipboard.writeText(this.inputField.value).then(() => {
      this.tooltip.textContent = this.tooltip.dataset.success_message;
    });
  }
}
customElements.define('copy-code', CopyCode);