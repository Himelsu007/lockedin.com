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

    /* =========================================
       3. RECEIPT UPLOAD + PREVIEW + VALIDATION
    ========================================= */
    const fileInput = document.getElementById("receipt-upload");
    const previewContainer = document.getElementById("preview-container");
    const previewImg = document.getElementById("receipt-preview");
    const uploadLabelText = document.getElementById("upload-text");
    
    let receiptBase64 = null;

    if(fileInput) {
        fileInput.addEventListener("change", function(e) {
            const file = e.target.files[0];
            if (!file) return;

            // ENHANCEMENT: Prevent massive files from crashing the mobile browser (Max 5MB)
            const maxSize = 5 * 1024 * 1024; 
            if (file.size > maxSize) {
                alert("File is too large. Please upload an image under 5MB.");
                fileInput.value = ""; // Clear the input
                return;
            }

            uploadLabelText.textContent = `✔ ${file.name}`;
            const reader = new FileReader();
            
            reader.onload = function(event) {
                receiptBase64 = event.target.result;
                previewImg.src = receiptBase64;
                previewContainer.style.display = "block"; 
            };
            reader.readAsDataURL(file);
        });
    }

    function getSelectedAgeGroup() {
        const selected = document.querySelector('input[name="age_group"]:checked');
        return selected ? selected.value : null;
    }

    /* =========================================
       5. PDF GENERATION + WHATSAPP
    ========================================= */
    const generateBtn = document.getElementById("generate-pdf");

    if(generateBtn) {
        generateBtn.addEventListener("click", async function() {
            
            const container = document.getElementById("signup-container");
            const playerName = document.getElementById("player-name").value.trim();
            const ageGroup = getSelectedAgeGroup();

            /* ===== VALIDATION ===== */
            if (!playerName) return alert("Please enter your name.");
            if (!ageGroup) return alert("Please select your age group.");
            if (!fileInput.files.length) return alert("Please upload your payment receipt.");

            /* ===== BUTTON LOCK & UI PREP ===== */
            generateBtn.innerText = "PROCESSING...";
            generateBtn.disabled = true;
            
            // ENHANCEMENT: Hide the button so it doesn't appear in the generated PDF
            generateBtn.style.display = 'none';

            const opt = {
                margin: 0.2, // Tighter margins for mobile
                filename: `${playerName.replace(/\s+/g, "_")}_registration.pdf`,
                image: { type: "jpeg", quality: 0.95 }, // Slightly compressed for faster sharing
                html2canvas: {
                    scale: 2, // Keeps text sharp
                    backgroundColor: "#1c1c1e",
                    useCORS: true,
                    scrollY: 0 // Fixes bugs where scrolled pages cut off the top of the PDF
                },
                jsPDF: {
                    unit: "in",
                    format: "letter",
                    orientation: "portrait"
                }
            };

            try {
                // Ensure html2pdf is loaded
                if (typeof html2pdf === 'undefined') {
                    throw new Error("PDF Library failed to load. Please refresh.");
                }

                /* ===== GENERATE PDF ===== */
                const pdfBlob = await html2pdf().set(opt).from(container).output("blob");
                
                const file = new File(
                    [pdfBlob],
                    opt.filename,
                    { type: "application/pdf" }
                );

                /* ===== RESTORE UI ===== */
                generateBtn.style.display = 'block';

                /* ===== MESSAGE ===== */
                const message = `🏀 Locked In Run Registration\n\nEvent: ${eventName}\nName: ${playerName}\nAge Group: ${ageGroup}\nGuests: ${guests}\n\nReceipt attached below.`;

                /* =========================================
                   MOBILE SHARE API (The "App-like" UX)
                ========================================= */
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: "Locked In Run Registration",
                        text: message
                    });
                    generateBtn.innerText = "SENT SUCCESSFULLY";
                } else {
                    /* =========================================
                       DESKTOP FALLBACK
                    ========================================= */
                    html2pdf().set(opt).from(container).save();
                    const waUrl = `https://wa.me/351911861637?text=${encodeURIComponent(message)}`;
                    window.open(waUrl, "_blank", "noopener,noreferrer");
                    generateBtn.innerText = "PDF DOWNLOADED";
                    alert("PDF downloaded! Sending you to WhatsApp now to attach it.");
                }

            } catch (error) {
                console.error("System error:", error);
                generateBtn.style.display = 'block';
                generateBtn.innerText = "ERROR - TRY AGAIN";
                alert("Something went wrong generating the file. Please try again.");
            }

            generateBtn.disabled = false;
        });
    }
});