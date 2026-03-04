document.addEventListener("DOMContentLoaded", function () {

    const track = document.querySelector(".carousel_track");
    const viewport = document.querySelector(".carousel_viewport");
    const items = document.querySelectorAll(".home_page_product_boxes");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");

    const gap = 20;
    let index = 0;
    let itemWidth = items[0].offsetWidth + gap;

    function updateCarousel() {
        track.style.transform = `translateX(-${index * itemWidth}px)`;
    }

    function goNext() {
        index = (index + 1) % items.length;
        updateCarousel();
    }

    function goPrev() {
        index = (index - 1 + items.length) % items.length;
        updateCarousel();
    }

    nextBtn.addEventListener("click", goNext);
    prevBtn.addEventListener("click", goPrev);

    /* =========================
       STABLE TOUCH VERSION
    ========================== */

    let startX = 0;

    viewport.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    viewport.addEventListener("touchend", (e) => {
        const endX = e.changedTouches[0].clientX;
        const distance = startX - endX;
        const threshold = 50;

        if (distance > threshold) {
            goNext();
        } else if (distance < -threshold) {
            goPrev();
        }
    });

    /* =========================
       RESPONSIVE FIX
    ========================== */

    window.addEventListener("resize", () => {
        itemWidth = items[0].offsetWidth + gap;
        updateCarousel();
    });

});