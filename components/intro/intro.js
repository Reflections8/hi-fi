document.addEventListener('DOMContentLoaded', () => {

  async function animDepixelate($el, onlyPixelate = false) {
    const $parent = $el.parentNode;

    $parent.classList.add("-pixelated");

    const previousCanvas = $parent.querySelector("canvas");
    // if (previousCanvas) previousCanvas.remove();

    // add canvas
    const canvas = document.createElement("canvas");
    canvas.style.zIndex = -1;
    canvas.style.position = "relative";
    canvas.classList.add('intro__absoluteImg')

    if ($el.classList.contains('intro__absoluteImg--left')) {
      canvas.classList.add('intro__absoluteImg--left')
      canvas.classList.add('intro__absoluteImg--left--Canvas')
    }

    if ($el.classList.contains('intro__absoluteImg--right')) {
      canvas.classList.add('intro__absoluteImg--right')
      canvas.classList.add('intro__absoluteImg--right--Canvas')
    }
    $parent.appendChild(canvas);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    // handle dimensions
    const w = 240;
    const h = 300;

    // do the thing
    const pixelate = async (sample_amount) => {
      return new Promise((resolve) => {
        if (!canvas.parentNode) {
          resolve();
          return;
        }

        const sample_size = Math.round(w / sample_amount);

        ctx.canvas.width = w;
        ctx.canvas.height = h;
        ctx.drawImage($el, 0, 0, w, h);

        const pixelArr = ctx.getImageData(0, 0, w, h).data;

        for (let y = 0; y < h; y += sample_size) {
          for (let x = 0; x < w; x += sample_size) {
            const p = (x + y * w) * 4;
            ctx.fillStyle =
              "rgba(" +
              pixelArr[p] +
              "," +
              pixelArr[p + 1] +
              "," +
              pixelArr[p + 2] +
              "," +
              pixelArr[p + 3] +
              ")";
            ctx.fillRect(x, y, sample_size, sample_size);
          }
        }

        resolve();
      });
    };



    // // timeline
    const ITERATION_DELAY = 400;
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await pixelate(8);
    await delay(ITERATION_DELAY);
    await pixelate(16);
    await delay(ITERATION_DELAY);
    await pixelate(32);
    await delay(ITERATION_DELAY);
    await pixelate(48);
    await delay(ITERATION_DELAY);
    await pixelate(96);

    canvas.remove();
    $parent.classList.remove("-pixelated");
  }

  const { gsap } = window;
  const { ScrollTrigger } = gsap;
  gsap.registerPlugin(ScrollTrigger);

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".container",
      pin: true,
      start: "top top",
      end: "+=500",
      delay: 10,
      scrub: 8,
      snap: {
        snapTo: "labels",
        duration: { min: 0.2 },
        delay: 0.2,
        ease: "back.inOut",
      },
      direction: 'reverse',
    },
  });

// add animations and labels to the timeline
  tl.addLabel("start")
    .to(".intro__content-title", { translateY: '-15vh' })
    .to(".intro__content-text", { top: '-10vh' }, 'start')

  tl.addLabel("middle")
    .to(".intro__absoluteImg--left", { translateY: '-80vh' }, "middle")
    .to(".intro__absoluteImg--right", { translateY: '-100vh' }, "middle")

  tl.add(() => {
    animDepixelate(document.querySelector('.intro__absoluteImg--left'))
    animDepixelate(document.querySelector('.intro__absoluteImg--right'))
  }, "middle");

  function repeatTransform() {
    const leftImg = document.querySelector('.intro__absoluteImg--left');
    const rightImg = document.querySelector('.intro__absoluteImg--right');
    const leftCanvas = document.querySelector('.intro__absoluteImg--left--Canvas');
    const rightCanvas = document.querySelector('.intro__absoluteImg--right--Canvas');

    if (leftImg && leftCanvas) {
      const transformValue = `${leftImg.style.transform}`;
      leftCanvas.style.transform = transformValue;
    }
    if (rightImg && rightCanvas) {
      const transformValue = `${rightImg.style.transform}`;
      rightCanvas.style.transform = transformValue;
    }
  }

// Запускаем функцию повторения свойства transform
  repeatTransform();

// Наблюдаем за изменениями в свойствах transform обоих изображений
  const observerTransform = new MutationObserver(() => {
    repeatTransform();
  });

// Настройка MutationObserver для отслеживания изменений в свойствах transform
  observerTransform.observe(document.querySelector('.intro__absoluteImg--left'), { attributes: true });
  observerTransform.observe(document.querySelector('.intro__absoluteImg--right'), { attributes: true });
})
