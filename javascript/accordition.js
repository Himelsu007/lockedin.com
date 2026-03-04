document.querySelectorAll(".accordion-header").forEach(header => {
    header.addEventListener("click", function () {

        const item = this.parentElement;
        const content = item.querySelector(".accordion-content");
        const iconImg = this.querySelector(".icon img");

        const isActive = item.classList.contains("active");

        // Close all first (optional — if you want only one open)
        document.querySelectorAll(".accordion-item").forEach(i => {
            i.classList.remove("active");
            i.querySelector(".accordion-content").style.height = 0;
            i.querySelector(".icon img").src = "assets/icons/donwards_arrow.svg";
        });

        if (!isActive) {
            item.classList.add("active");
            content.style.height = content.scrollHeight + "px";
            iconImg.src = "assets/icons/active_accordition_icon.svg";
        }

    });
});