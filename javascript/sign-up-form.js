document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       1. AUTO-FILL EVENT NAME
    ========================================= */
    const urlParams = new URLSearchParams(window.location.search);
    const eventName = urlParams.get("event") || "Private Run";
    const eventInput = document.getElementById("event-name");
    
    if(eventInput) eventInput.value = eventName;

    /* =========================================
       2. GUEST COUNTER
    ========================================= */
    let guests = 0;
    const guestDisplay = document.getElementById("guest-count");
    const plusBtn = document.getElementById("guest-plus");
    const minusBtn = document.getElementById("guest-minus");

    if(plusBtn && minusBtn) {
        plusBtn.addEventListener("click", () => {
            guests++;
            guestDisplay.textContent = guests;
        });

        minusBtn.addEventListener("click", () => {
            if (guests > 0) {
                guests--;
                guestDisplay.textContent = guests;
            }
        });
    }

    function getSelectedAgeGroup() {
        const selected = document.querySelector('input[name="age_group"]:checked');
        return selected ? selected.value : null;
    }

    /* =========================================
       3. SEND REGISTRATION VIA WHATSAPP
    ========================================= */
    const generateBtn = document.getElementById("generate-pdf");

    if(generateBtn) {
        generateBtn.addEventListener("click", function() {
            
            const playerName = document.getElementById("player-name").value.trim();
            const ageGroup = getSelectedAgeGroup();

            /* ===== VALIDATION ===== */
            if (!playerName) return alert("Please enter your name.");
            if (!ageGroup) return alert("Please select your age group.");

            /* ===== PREPARE MESSAGE ===== */
            const message = `🏀 *LOCKED IN RUN REGISTRATION*\n\n` +
                            `*Event:* ${eventName}\n` +
                            `*Player:* ${playerName}\n` +
                            `*Age Group:* ${ageGroup}\n` +
                            `*Guests:* ${guests}\n\n` +
                            `I've completed my registration. Let me know where to send the payment receipt!`;

            const waUrl = `https://wa.me/351911861637?text=${encodeURIComponent(message)}`;

            /* ===== REDIRECT TO WHATSAPP ===== */
            // This works smoothly on both mobile and desktop
            window.open(waUrl, "_blank", "noopener,noreferrer");
            
            // Subtle UI feedback letting the user know the action completed
            generateBtn.innerText = "OPENED IN WHATSAPP";
            generateBtn.style.opacity = "0.7";
        });
    }
});