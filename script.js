 class SmoothScroll {
      constructor() {
        this.sections = document.querySelectorAll('.scrollSection');
        this.currentSection = 0;
        this.isScrolling = false;
        this.scrollBuffer = [];
        this.lastScrollTime = 0;
        this.SCROLL_COOLDOWN = 800;

        this.init();
      }

      init() {
        document.body.style.overflow = 'hidden';
        this.addWheelListener();
        this.addKeyboardListener();
        this.addTouchListener();
        this.scrollToSection(0, false);
      }

      scrollToSection(index, animate = true) {
        if (index < 0 || index >= this.sections.length) return false;

        this.currentSection = index;
        this.isScrolling = animate;

        this.sections[index].scrollIntoView({
          behavior: animate ? 'smooth' : 'instant',
          block: 'start'
        });

        if (animate) {
          setTimeout(() => {
            this.isScrolling = false;
            this.processScrollBuffer();
          }, 600);
        }

        return true;
      }

      addWheelListener() {
        let wheelTimeout;

        window.addEventListener('wheel', (e) => {
          e.preventDefault();

          const now = Date.now();

          if (this.isScrolling || now - this.lastScrollTime < this.SCROLL_COOLDOWN) {
            return;
          }

          clearTimeout(wheelTimeout);

          wheelTimeout = setTimeout(() => {
            const direction = e.deltaY > 0 ? 1 : -1;
            const targetSection = this.currentSection + direction;

            if (this.scrollToSection(targetSection)) {
              this.lastScrollTime = now;
            }
          }, 50);
        }, { passive: false });
      }

      addKeyboardListener() {
        const keyMap = {
          'ArrowDown': 1,
          'ArrowUp': -1,
          'Space': 1,
          'PageDown': 1,
          'PageUp': -1
        };

        window.addEventListener('keydown', (e) => {
          if (keyMap[e.code] !== undefined) {
            e.preventDefault();

            if (this.isScrolling) return;

            const direction = keyMap[e.code];
            const targetSection = this.currentSection + direction;

            if (this.scrollToSection(targetSection)) {
              this.lastScrollTime = Date.now();
            }
          }
        }, { passive: false });
      }

      addTouchListener() {
        let startY = 0;
        let startTime = 0;

        window.addEventListener('touchstart', (e) => {
          startY = e.touches[0].clientY;
          startTime = Date.now();
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
          if (this.isScrolling) return;

          const endY = e.changedTouches[0].clientY;
          const endTime = Date.now();
          const deltaY = startY - endY;
          const deltaTime = endTime - startTime;

          if (Math.abs(deltaY) > 50 && deltaTime < 300) {
            const direction = deltaY > 0 ? 1 : -1;
            const targetSection = this.currentSection + direction;

            if (this.scrollToSection(targetSection)) {
              this.lastScrollTime = endTime;
            }
          }
        }, { passive: true });
      }

      processScrollBuffer() {
        if (this.scrollBuffer.length > 0) {
          const direction = this.scrollBuffer.pop();
          this.scrollBuffer = [];

          const targetSection = this.currentSection + direction;
          this.scrollToSection(targetSection);
        }
      }

      goToSection(index) {
        if (!this.isScrolling) {
          this.scrollToSection(index);
          this.lastScrollTime = Date.now();
        }
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      window.smoothScroll = new SmoothScroll();
    });