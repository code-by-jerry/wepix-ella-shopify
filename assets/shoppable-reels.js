if (!customElements.get("shoppable-reels")) {
  customElements.define("shoppable-reels", class ShoppableReels extends HTMLElement {
    constructor() {
      super();
      this.modal = this.querySelector('shoppable-reels-modal');
      this.videoElement = this.querySelector('.shoppable-modal-video');
      this.closeBtn = this.querySelector('.shoppable-modal-close');
      this.miniProductBtn = this.querySelector('.shoppable-modal-btn');
      this.bottomSheet = this.querySelector('.shoppable-bottom-sheet');
      this.sheetCloseBtn = this.querySelector('.shoppable-sheet-close');
      this.sheetContent = this.querySelector('.shoppable-sheet-content-inner');
      this.sheetProductHeader = this.querySelector('.shoppable-sheet-product-header');
      
      this.carousel = this.querySelector('.shoppable-reels-carousel');
      this.prevBtn = this.querySelector('.shoppable-reels-prev');
      this.nextBtn = this.querySelector('.shoppable-reels-next');
      
      this.bindEvents();
    }

    bindEvents() {
      // Open reel
      this.querySelectorAll('.shoppable-reel-card').forEach(card => {
        card.addEventListener('click', (e) => this.openReel(card));
      });

      // Close modal
      if(this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeModal());
      
      // Close sheet
      if(this.sheetCloseBtn) this.sheetCloseBtn.addEventListener('click', () => this.closeSheet());

      // Open sheet / load product
      if(this.miniProductBtn) this.miniProductBtn.addEventListener('click', () => this.openProductSheet());

      // Slider controls
      if(this.prevBtn) this.prevBtn.addEventListener('click', () => this.scrollSlider(-1));
      if(this.nextBtn) this.nextBtn.addEventListener('click', () => this.scrollSlider(1));
      if(this.carousel) {
        this.carousel.addEventListener('scroll', () => this.updateArrows());
        // Initialize arrows on load
        setTimeout(() => this.updateArrows(), 100);
      }
    }

    updateArrows() {
      if(!this.carousel || !this.prevBtn || !this.nextBtn) return;
      if (this.carousel.scrollLeft <= 5) {
        this.prevBtn.setAttribute('disabled', 'disabled');
      } else {
        this.prevBtn.removeAttribute('disabled');
      }
      
      if (this.carousel.scrollLeft >= this.carousel.scrollWidth - this.carousel.clientWidth - 10) {
        this.nextBtn.setAttribute('disabled', 'disabled');
      } else {
        this.nextBtn.removeAttribute('disabled');
      }
    }

    scrollSlider(direction) {
      if(!this.carousel) return;
      const scrollAmount = this.carousel.clientWidth * 0.8;
      this.carousel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
    }

    openReel(card) {
      const videoSrc = card.dataset.videoSrc;
      const productUrl = card.dataset.productUrl;
      const productTitle = card.dataset.productTitle;
      const productPrice = card.dataset.productPrice;
      const productImage = card.dataset.productImage;

      // Set video
      if (videoSrc) {
        this.videoElement.src = videoSrc;
        this.videoElement.play();
      }

      // Update mini product card
      this.querySelector('.shoppable-modal-mini-title').textContent = productTitle;
      this.querySelector('.shoppable-modal-mini-price').innerHTML = productPrice;
      this.querySelector('.shoppable-modal-mini-product img').src = productImage;
      this.currentProductUrl = productUrl;
      this.currentProductImage = productImage;
      this.currentProductTitle = productTitle;

      this.modal.setAttribute('open', '');
    }

    closeModal() {
      this.modal.removeAttribute('open');
      this.videoElement.pause();
      this.videoElement.src = "";
      this.closeSheet();
    }

    openProductSheet() {
      if (!this.currentProductUrl) return;

      this.miniProductBtn.classList.add('loading');

      // Fetch product page HTML
      fetch(this.currentProductUrl.split("?")[0])
        .then(response => response.text())
        .then(responseText => {
          const responseHTML = new DOMParser().parseFromString(responseText, "text/html");
          const productElement = responseHTML.querySelector("product-info");

          // Clean up product element for bottom sheet (remove gallery, share, etc)
          this.preprocessProductHTML(productElement);

          // Update sheet header
          let priceHTML = '';
          const priceEl = responseHTML.querySelector('.price');
          if(priceEl) priceHTML = priceEl.innerHTML;

          this.sheetProductHeader.innerHTML = `
            <img src="${this.currentProductImage}" alt="Product">
            <div class="details">
              <h4>${this.currentProductTitle}</h4>
              <div class="price">${priceHTML}</div>
            </div>
          `;

          // Inject form
          this.sheetContent.innerHTML = productElement.outerHTML;

          // Re-initialize custom elements if necessary
          // This ensures variant pickers work
          const variantPickers = this.sheetContent.querySelectorAll('variant-selects, variant-radios');
          variantPickers.forEach(picker => {
            if(picker.connectedCallback) picker.connectedCallback();
          });

          if (window.Shopify && Shopify.PaymentButton) Shopify.PaymentButton.init();
          
          this.bottomSheet.classList.add('is-open');
        })
        .finally(() => {
          this.miniProductBtn.classList.remove('loading');
        });
    }

    closeSheet() {
      this.bottomSheet.classList.remove('is-open');
    }

    preprocessProductHTML(productElement) {
       // Remove parts of the product page we don't want in the bottom sheet
       const removeSelectors = [
         'pickup-availability',
         'share-button',
         'product-modal',
         'modal-dialog',
         '.product__media-wrapper',
         '.product__title'
       ];
       removeSelectors.forEach(sel => {
         const els = productElement.querySelectorAll(sel);
         els.forEach(el => el.remove());
       });
       productElement.setAttribute("data-update-url", "false");
    }
  });
}
