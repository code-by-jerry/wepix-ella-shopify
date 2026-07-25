if (!customElements.get("custom-testimonials")) {
  customElements.define("custom-testimonials", class CustomTestimonials extends HTMLElement {
    constructor() {
      super();
      this.carousel = this.querySelector('.custom-testimonials-carousel');
      this.prevBtn = this.querySelector('.custom-testimonials-prev');
      this.nextBtn = this.querySelector('.custom-testimonials-next');
      
      this.bindEvents();
    }

    bindEvents() {
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
  });
}
