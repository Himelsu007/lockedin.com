document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('signature-pad');
    const ctx = canvas.getContext('2d');
    const dateInput = document.getElementById('auth-date');
    let drawing = false;

    // 1. Set current date automatically
    dateInput.value = new Date().toLocaleDateString('en-GB');

    // 2. Simple Signature Logic
    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX || e.touches[0].clientX) - rect.left,
            y: (e.clientY || e.touches[0].clientY) - rect.top
        };
    }

    const startDrawing = (e) => { drawing = true; draw(e); };
    const stopDrawing = () => { drawing = false; ctx.beginPath(); };

 const draw = (e) => {
    if (!drawing) return;

    // Prevent the screen from scrolling
    if (e.cancelable) e.preventDefault(); 

    const pos = getPos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ffffff';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
};

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);
    
    // Touch support for mobile
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    document.getElementById('clear-signature').onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 3. Generate & Download PDF
document.getElementById('generate-pdf').onclick = async function() {
    const element = document.querySelector('.auth-container');
    const name = document.getElementById('auth-name').value;
    
    if(!name) return alert("Please enter your name first!");

    // 1. Visual Feedback (The "Processing" state)
    this.innerText = "PROCESSING...";
    this.classList.add('disabled');

    const opt = {
        margin: 0.5,
        filename: `Authorization_${name.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#1c1c1e' },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // 2. Generate PDF as a "Blob" (raw data) instead of just saving
    const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
    
    // 3. Create a File object from the Blob
    const file = new File([pdfBlob], opt.filename, { type: 'application/pdf' });

    // 4. Use the Web Share API (Mobile Magic)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                files: [file],
                title: 'Signed Authorization',
                text: `Hello! Here is my signed authorization for ${name}.`
            });
            this.innerText = "SENT SUCCESSFULLY";
        } catch (err) {
            // User cancelled or share failed
            console.error("Share failed:", err);
            this.innerText = "FINALIZE & DOWNLOAD";
            html2pdf().set(opt).from(element).save(); // Fallback to download
        }
    } else {
        // 5. Fallback for Desktop (Since computers can't "Share" to WhatsApp easily)
        alert("Desktop detected. Downloading PDF... Please attach it manually to WhatsApp.");
        html2pdf().set(opt).from(element).save();
        
        // Open WhatsApp with a pre-filled message after download
        const waMsg = encodeURIComponent(`Hello! I just downloaded my signed authorization for ${name}. I am attaching it now.`);
        window.open(`https://wa.me/351911861637?text=${waMsg}`, '_blank');
        this.innerText = "FINALIZE & DOWNLOAD";
    }
    
    this.classList.remove('disabled');
};
});