document.addEventListener("DOMContentLoaded", function () {
    const viewport = document.querySelector(".carousel_viewport");
    const indicator = document.querySelector(".carousel_progress_indicator");
    if (!viewport || !indicator) return;

    // =========================================
    // 1. UPDATE THE PROGRESS BAR
    // =========================================
    function updateProgressBar() {
        // How far the user has scrolled left
        const scrollLeft = viewport.scrollLeft;
        // Total scrollable distance (Total width minus what is currently visible)
        const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;
        
        // Calculate the percentage (0 to 100)
        let scrollPercentage = (scrollLeft / maxScrollLeft) * 100;
        
        // Safety catch for division by zero on very large screens
        if (maxScrollLeft === 0) scrollPercentage = 100; 

        // Apply it to the CSS width
        indicator.style.width = `${scrollPercentage}%`;

        // Elite Polish: Turn the bar gold if they reach the absolute end
        if (scrollPercentage >= 99) {
            indicator.style.backgroundColor = "#FFD700";
        } else {
            indicator.style.backgroundColor = "#ffffff";
        }
    }

    // Listen to native scroll events (swiping, trackpad, mouse wheel)
    viewport.addEventListener("scroll", updateProgressBar, { passive: true });
    
    // Run once on load to set the initial width
    updateProgressBar();
    // Re-calculate if the user flips their phone or resizes their laptop window
    window.addEventListener("resize", updateProgressBar);


    // =========================================
    // 2. LAPTOP ENHANCEMENT: MOUSE DRAGGING
    // =========================================
    let isDown = false;
    let startX;
    let scrollLeft;

    viewport.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - viewport.offsetLeft;
        scrollLeft = viewport.scrollLeft;
        // Disable scroll snapping temporarily while dragging for a smoother feel
        viewport.style.scrollSnapType = 'none'; 
    });

    viewport.addEventListener('mouseleave', () => {
        isDown = false;
        viewport.style.scrollSnapType = 'x mandatory';
    });

    viewport.addEventListener('mouseup', () => {
        isDown = false;
        viewport.style.scrollSnapType = 'x mandatory';
    });

    viewport.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault(); // Stop text selection
        const x = e.pageX - viewport.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed multiplier
        viewport.scrollLeft = scrollLeft - walk;
    });
});