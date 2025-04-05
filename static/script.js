document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    }); 

    // Format timestamps
    document.querySelectorAll('.timestamp').forEach(el => {
        const timestamp = parseInt(el.textContent);
        if (!isNaN(timestamp)) {
            const date = new Date(timestamp * 1000);
            el.textContent = date.toLocaleString();
        }
    });
// Add hover effects to the crypto icon
const cryptoIcon = document.querySelector('.crypto-icon');
if (cryptoIcon) {
    cryptoIcon.addEventListener('mouseenter', () => {
        cryptoIcon.style.animationPlayState = 'paused';
    });
    cryptoIcon.addEventListener('mouseleave', () => {
        cryptoIcon.style.animationPlayState = 'running';
    });
}
    // Copy address functionality
    document.querySelectorAll('.address').forEach(el => {
        el.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            });
        });
    });

    // Animate mining button
    const miningBtn = document.querySelector('.mining-btn');
    if (miningBtn) {
        miningBtn.addEventListener('click', function(e) {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 1000);
        });
    }

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let valid = true;
            const inputs = this.querySelectorAll('input[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = 'var(--accent-color)';
                    valid = false;
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (!valid) {
                e.preventDefault();
                alert('Please fill in all required fields');
            }
        });
    });

    // Update clock in footer
    function updateClock() {
        const now = new Date();
        const clockElement = document.getElementById('footer-clock');
        if (clockElement) {
            clockElement.textContent = now.toLocaleTimeString();
        }
    }
    
    setInterval(updateClock, 1000);
    updateClock();

    // Blockchain visualization (for homepage)
    const canvas = document.getElementById('blockchain-visual');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 200;
        
        // Draw blockchain visualization
        ctx.fillStyle = 'rgba(6, 214, 160, 0.2)';
        ctx.strokeStyle = 'var(--highlight-color)';
        ctx.lineWidth = 2;
        
        const blockWidth = 60;
        const blockHeight = 80;
        const gap = 30;
        const startX = 50;
        const startY = canvas.height / 2 - blockHeight / 2;
        
        for (let i = 0; i < 5; i++) {
            const x = startX + i * (blockWidth + gap);
            
            // Draw block
            ctx.fillRect(x, startY, blockWidth, blockHeight);
            ctx.strokeRect(x, startY, blockWidth, blockHeight);
            
            // Draw chain link
            if (i > 0) {
                ctx.beginPath();
                ctx.moveTo(x - gap, startY + blockHeight / 2);
                ctx.lineTo(x, startY + blockHeight / 2);
                ctx.stroke();
            }
            
            // Block text
            ctx.fillStyle = 'var(--highlight-color)';
            ctx.font = 'bold 14px Orbitron';
            ctx.textAlign = 'center';
            ctx.fillText(`Block ${i+1}`, x + blockWidth / 2, startY + 30);
            
            ctx.fillStyle = 'var(--text-color)';
            ctx.font = '10px Roboto';
            ctx.fillText(`Tx: ${i}`, x + blockWidth / 2, startY + 50);
        }
    }
});