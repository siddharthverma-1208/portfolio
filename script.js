document.addEventListener('DOMContentLoaded', () => {

  // Global Toast Logic
  const toast = document.getElementById('excuse-toast');
  const excuseText = document.getElementById('excuse-text');
  const closeToast = document.getElementById('close-toast');
  let toastTimeout;

  const excuses = [
    "Mere local system pe mast chal raha hai bhai! 💻",
    "Bhai wo bug nahi hai, undocumented feature hai! ✨",
    "RAM mein cosmic ray ne bit flip kar diya lagta hai! 👽",
    "Browser cache clear karke dekho ek baar! 🕵️‍♂️",
    "Staging server pe toh exact chal raha tha! 🤷‍♂️"
  ];

  function showToast(customMsg) {
    if (!toast || !excuseText) return;

    // Clear previous timeout if user clicks rapidly
    if (toastTimeout) clearTimeout(toastTimeout);

    if (customMsg) {
      excuseText.textContent = customMsg;
    } else {
      const randIdx = Math.floor(Math.random() * excuses.length);
      excuseText.textContent = excuses[randIdx];
    }

    toast.classList.remove('hidden');

    // Auto hide after 3 seconds
    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }

  if (closeToast) {
    closeToast.addEventListener('click', () => {
      toast.classList.add('hidden');
      if (toastTimeout) clearTimeout(toastTimeout);
    });
  }

  // --- 1. THEME & MATRIX TOGGLE ---
  const themeToggle = document.getElementById('theme-toggle');
  const matrixToggle = document.getElementById('matrix-toggle');
  const body = document.body;

  const savedTheme = localStorage.getItem('sv_theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('sv_theme', newTheme);
      themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    });
  }

  if (matrixToggle) {
    matrixToggle.addEventListener('click', () => {
      const currentMode = body.getAttribute('data-mode');
      if (currentMode === 'matrix') {
        body.setAttribute('data-mode', 'cyber');
        matrixToggle.style.transform = 'rotate(0deg)';
      } else {
        body.setAttribute('data-mode', 'matrix');
        matrixToggle.style.transform = 'rotate(180deg)';
        showToast('⚡ MATRIX MODE ACTIVATED! Welcome to the matrix, Lucknowi Dev!');
      }
    });
  }

  // --- 2. MUSIC PLAYER + VOLUME SLIDER ---
  const musicToggle = document.getElementById('music-toggle');
  const volumeSlider = document.getElementById('volume-slider');
  const bgMusic = document.getElementById('bg-music');
  let isMusicPlaying = false;

  if (bgMusic) {
    // Default calm level
    bgMusic.volume = 0.3;
    if (volumeSlider) volumeSlider.value = 0.3;

    // Play / Pause
    if (musicToggle) {
      musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
          bgMusic.pause();
          musicToggle.classList.remove('playing');
          musicToggle.textContent = '🎵';
          musicToggle.title = 'Play Calm Music 🎵';
        } else {
          // Re-enforce volume right before play (browser autoplay policies)
          bgMusic.volume = volumeSlider ? parseFloat(volumeSlider.value) : 0.3;
          bgMusic.play().catch(e => console.log('Audio playback failed:', e));
          musicToggle.classList.add('playing');
          musicToggle.textContent = '⏸️';
          musicToggle.title = 'Pause Music';
        }
        isMusicPlaying = !isMusicPlaying;
      });
    }

    // Live volume bar
    if (volumeSlider) {
      volumeSlider.addEventListener('input', () => {
        const vol = parseFloat(volumeSlider.value);
        bgMusic.volume = vol;

        // Status toast
        const pct = Math.round(vol * 100);
        if (pct === 0) {
          showToast('🔇 Muted');
        } else if (pct === 100) {
          showToast('🔊 Max Volume (100%)');
        } else {
          showToast(`🔊 Volume: ${pct}%`);
        }
      });
    }
  }

  // Mobile Hamburger Menu
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // --- 3. MULTI-COLOR PARTICLE BACKGROUND ---
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const colors = ['#ff0055', '#00f0ff', '#00ff66', '#9d4edd', '#ffcc00'];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // --- 4. MATRIX RAIN EFFECT ---
  const matrixCanvas = document.getElementById('matrix-canvas');
  if (matrixCanvas) {
    const mCtx = matrixCanvas.getContext('2d');
    function resizeMatrix() {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
    }
    resizeMatrix();
    window.addEventListener('resize', resizeMatrix);

    const matrixChars = '01100101 Python Django Lucknow CYRUS Siddharth IEEE SQL Chai';
    const fontSize = 14;
    const columns = Math.floor(window.innerWidth / fontSize);
    const drops = Array(columns).fill(1);

    function drawMatrix() {
      mCtx.fillStyle = 'rgba(2, 11, 4, 0.08)';
      mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      mCtx.fillStyle = '#00ff66';
      mCtx.font = fontSize + 'px Fira Code';

      for (let i = 0; i < drops.length; i++) {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      requestAnimationFrame(drawMatrix);
    }
    drawMatrix();
  }

  // --- 5. TERMINAL WIDGET ---
  const termInput = document.getElementById('terminal-input');
  const termOutput = document.getElementById('terminal-output');
  const termCard = document.getElementById('terminal-card');

  if (termCard && termInput) {
    termCard.addEventListener('click', () => {
      termInput.focus();
    });
  }

  const commands = {
    whoami: '👋 Siddharth Verma: Django Dev by day, Gamer by night. 🏛️ Lucknow.',
    skills: 'Python, Django, SQL... and pretending to know exactly what I am doing. 🤫',
    kd: 'In game? Above 1.0. In code? 0 syntax errors today (hopefully). 🎯',
    'sudo rm -rf /': 'Nice try. I have already deleted my browser history. 🕶️',
    matrix: 'Wake up, Neo... (Try clicking the green lightning icon in the nav bar!) 🐇',
    clear: 'CLEAR',
    cyrus: '🤖 CYRUS: "Greetings! I am Siddharth\'s AI Assistant."',
    lucknow: '🏛️ Muskuraiye, Aap Lucknow Mein Hain! Shehar Nawabon Ka, Code Siddharth Ka!'
  };

  if (termInput && termOutput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const inputVal = termInput.value.trim().toLowerCase();
        termInput.value = '';

        if (!inputVal) return;

        const pLine = document.createElement('p');
        pLine.className = 'term-line';
        pLine.innerHTML = `<span class="term-green">siddharth@lucknow</span>:<span class="term-blue">~</span>$ ${inputVal}`;
        termOutput.appendChild(pLine);

        const pResp = document.createElement('p');
        pResp.className = 'term-response';

        if (inputVal === 'clear') {
          termOutput.innerHTML = '';
          return;
        } else if (inputVal === 'sudo hire') {
          triggerConfetti();
          pResp.innerHTML = '🎉 Access Granted! Scroll down to the contact section.';
        } else if (commands[inputVal]) {
          pResp.innerHTML = commands[inputVal];
        } else {
          pResp.innerHTML = `zsh: command not found: ${inputVal}. Try typing <span class="term-cyan">'skills'</span>, <span class="term-yellow">'kd'</span>, or <span class="term-purple">'whoami'</span>.`;
        }

        termOutput.appendChild(pResp);
        const termBody = document.getElementById('terminal-body');
        if (termBody) termBody.scrollTop = termBody.scrollHeight;
      }
    });
  }

  // --- 6. CHAI REFUEL BUTTON ---
  const coffeeBtn = document.getElementById('btn-coffee');
  const coffeeMeter = document.getElementById('coffee-meter');
  let currentCoffee = 85;

  if (coffeeBtn && coffeeMeter) {
    coffeeBtn.addEventListener('click', () => {
      currentCoffee = Math.min(100, currentCoffee + 15);
      coffeeMeter.style.width = currentCoffee + '%';
      showToast(`☕ Kadak Chai Refueled (${currentCoffee}%)! Coding power 2x!`);

      // Auto drain logic when hitting 100%
      if (currentCoffee === 100) {
        setTimeout(() => {
          currentCoffee = 40;
          coffeeMeter.style.width = currentCoffee + '%';
        }, 5000);
      }
    });
  }

  // --- 7. DEV EXCUSE BUTTON ---
  const excuseBtn = document.getElementById('btn-excuse');
  if (excuseBtn) {
    excuseBtn.addEventListener('click', () => showToast());
  }

  // --- 8. CONFETTI CANNON ---
  const hireBtn = document.getElementById('btn-hire-me');
  if (hireBtn) {
    hireBtn.addEventListener('click', () => {
      triggerConfetti();
      showToast("🎉 Thank you! Reach out directly via Email or Instagram below.");
    });
  }

  function triggerConfetti() {
    const confettiColors = ['#ff0055', '#00f0ff', '#00ff66', '#ffcc00', '#9d4edd'];
    for (let i = 0; i < 45; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = '10px';
      particle.style.height = '10px';
      particle.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      particle.style.left = '50vw';
      particle.style.top = '40vh';
      particle.style.zIndex = '9999';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      document.body.appendChild(particle);

      const destX = (Math.random() - 0.5) * window.innerWidth * 0.8;
      const destY = (Math.random() - 0.5) * window.innerHeight * 0.8;

      particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${destX}px, ${destY}px) scale(0)`, opacity: 0 }
      ], {
        duration: 1200 + Math.random() * 500,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      }).onfinish = () => particle.remove();
    }
  }
});
// --- 9. FUNNY RESUME DOWNLOAD INTERACTION ---
const resumeBtn = document.getElementById('btn-resume');
if (resumeBtn) {
  resumeBtn.addEventListener('click', () => {
    triggerConfetti();
    showToast("📄 Resume Downloaded! Guaranteed 0% Malware, 100% Talent & Lucknowi Swag! 🐍✨");
  });
}

// --- CYRUS WIP BUTTON TOAST ---
const cyrusBtn = document.getElementById('cyrus-wip-btn');
if (cyrusBtn) {
  cyrusBtn.addEventListener('click', () => {
    showToast("🚧 CYRUS is currently cooking! Final code polishing in progress 🛠️");
  });
}