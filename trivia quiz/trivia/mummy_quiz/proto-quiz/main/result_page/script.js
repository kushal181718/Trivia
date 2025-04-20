function createConfetti() {
    const colors = ['#60A5FA', '#34D399', '#F472B6', '#FBBF24', '#A78BFA'];
    const shapes = ['circle', 'square', 'triangle'];

    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random properties
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const left = Math.random() * 100 + 'vw';
        const animationDuration = (Math.random() * 3 + 2) + 's'; // 2-5 seconds
        const size = Math.random() * 10 + 5 + 'px'; // 5-15px

        // Apply styles
        confetti.style.left = left;
        confetti.style.width = size;
        confetti.style.height = size;
        confetti.style.background = color;
        confetti.style.animationDuration = animationDuration;

        // Apply shape
        if (shape === 'circle') {
            confetti.style.borderRadius = '50%';
        } else if (shape === 'triangle') {
            confetti.style.width = '0';
            confetti.style.height = '0';
            confetti.style.borderLeft = size + ' solid transparent';
            confetti.style.borderRight = size + ' solid transparent';
            confetti.style.borderBottom = size + ' solid ' + color;
            confetti.style.background = 'none';
        }

        document.body.appendChild(confetti);

        // Remove confetti after animation
        confetti.addEventListener('animationend', () => {
            confetti.remove();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const results = JSON.parse(localStorage.getItem('quizResults'));
    
    if (!results) {
        window.location.href = '../quiz_categories/index.html';
        return;
    }

    // Update the stats directly
    document.getElementById('correct-answers').textContent = results.correctAnswers || 0;
    document.getElementById('wrong-answers').textContent = results.wrongAnswers || 0;
    document.getElementById('max-streak').textContent = results.maxStreak || 0;

    // Ensure the result card is visible
    const resultCard = document.querySelector('.result-card');
    resultCard.style.opacity = '1';
    resultCard.style.display = 'block';

    // Create initial confetti burst
    createConfetti();

    // Create periodic confetti for high scores
    if (results.score >= 80) {
        setInterval(() => {
            createConfetti();
        }, 5000); // Create new confetti every 5 seconds
    }

    // Animate score number with GSAP
    gsap.to('.score-number', {
        textContent: results.score,
        duration: 2,
        snap: { textContent: 1 },
        ease: "power2.out",
        onUpdate: function() {
            if (results.score >= 80) {
                this.targets()[0].style.color = '#FFD700';
            } else if (results.score >= 60) {
                this.targets()[0].style.color = '#60A5FA';
            }
        }
    });

    // Add celebration effects based on score
    if (results.score >= 90) {
        document.querySelector('.score-circle').classList.add('perfect-score');
    } else if (results.score >= 70) {
        document.querySelector('.score-circle').classList.add('high-score');
    }

    // Create celebration effects based on score
    function createCelebration(score) {
        const container = document.querySelector('.result-container');
        
        if (score >= 90) {
            createRainbowConfetti();
        } else if (score >= 80) {
            createGoldenBurst();
        } else if (score >= 60) {
            createGreenBurst();
        } else if (score >= 40) {
            createBlueBurst();
        }
    }

    function createRainbowConfetti() {
        const colors = ['#FF6B6B', '#4ECDC4', '#A78BFA', '#FFB347', '#FF48B0'];
        for (let i = 0; i < 100; i++) {
            createParticle(colors[Math.floor(Math.random() * colors.length)], true);
        }
    }

    function createGoldenBurst() {
        for (let i = 0; i < 50; i++) {
            createParticle('#FFD700', false);
        }
    }

    function createGreenBurst() {
        for (let i = 0; i < 30; i++) {
            createParticle('#4CAF50', false);
        }
    }

    function createBlueBurst() {
        for (let i = 0; i < 20; i++) {
            createParticle('#4ECDC4', false);
        }
    }

    function createParticle(color, isConfetti) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        document.body.appendChild(particle);

        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight + 100;
        const rotation = Math.random() * 360;
        const duration = 1 + Math.random() * 2;

        gsap.set(particle, {
            x: x,
            y: y,
            backgroundColor: color,
            rotation: rotation
        });

        gsap.to(particle, {
            y: isConfetti ? '-100%' : y - 300,
            x: x + (Math.random() - 0.5) * 200,
            rotation: rotation + (Math.random() - 0.5) * 720,
            duration: duration,
            ease: 'power1.out',
            onComplete: () => particle.remove()
        });
    }

    // Function to create particles around the score circle
    function createScoreParticles(score) {
        const scoreCircle = document.querySelector('.score-circle');
        const rect = scoreCircle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        if (score >= 90) {
            createGoldParticles(centerX, centerY);
        } else if (score >= 70) {
            createSilverParticles(centerX, centerY);
        } else if (score >= 50) {
            createBronzeParticles(centerX, centerY);
        } else {
            createBasicParticles(centerX, centerY);
        }
    }

    function createGoldParticles(centerX, centerY) {
        const colors = ['#FFD700', '#FFA500', '#FFFF00', '#DAA520'];
        createParticleExplosion(centerX, centerY, colors, 50);
        addSparkleEffect('.score-circle');
    }

    function createSilverParticles(centerX, centerY) {
        const colors = ['#C0C0C0', '#A9A9A9', '#E8E8E8', '#B8B8B8'];
        createParticleExplosion(centerX, centerY, colors, 40);
    }

    function createBronzeParticles(centerX, centerY) {
        const colors = ['#CD7F32', '#B8860B', '#D2691E'];
        createParticleExplosion(centerX, centerY, colors, 30);
    }

    function createBasicParticles(centerX, centerY) {
        const colors = ['#4ECDC4', '#A78BFA', '#FF6B6B'];
        createParticleExplosion(centerX, centerY, colors, 20);
    }

    function createParticleExplosion(centerX, centerY, colors, count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'score-particle';
            document.body.appendChild(particle);

            const angle = (Math.PI * 2 * i) / count;
            const velocity = 2 + Math.random() * 3;
            const size = 5 + Math.random() * 10;
            const color = colors[Math.floor(Math.random() * colors.length)];

            gsap.set(particle, {
                x: centerX,
                y: centerY,
                backgroundColor: color,
                width: size,
                height: size,
                borderRadius: '50%'
            });

            gsap.to(particle, {
                x: centerX + Math.cos(angle) * 150 * velocity,
                y: centerY + Math.sin(angle) * 150 * velocity,
                opacity: 0,
                duration: 1.5 + Math.random(),
                ease: 'power3.out',
                onComplete: () => particle.remove()
            });
        }
    }

    function addSparkleEffect(selector) {
        const element = document.querySelector(selector);
        element.style.overflow = 'visible';
        
        gsap.to(element, {
            boxShadow: '0 0 40px #FFD700',
            repeat: -1,
            yoyo: true,
            duration: 1.5
        });
    }

    // Initial animations
    gsap.from('.result-card', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.8)",
        onComplete: () => createCelebration(results.score)
    });

    // Add after the initial result-card animation
    gsap.from('.title-text', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.8)",
        delay: 0.2
    });

    gsap.from('.title-underline', {
        scaleX: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.8
    });

    // Animate score circle with particles
    gsap.from('.score-circle', {
        scale: 0,
        rotation: -180,
        duration: 1.5,
        ease: "back.out(1.7)",
        delay: 0.3,
        onComplete: () => {
            createScoreParticles(results.score);
            
            if (results.score >= 70) {
                gsap.to('.score-circle', {
                    scale: 1.1,
                    repeat: -1,
                    yoyo: true,
                    duration: 1.5,
                    ease: "power1.inOut"
                });
            }
        }
    });

    // Animate stats with stagger
    gsap.from('.stat-item', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        delay: 1
    });

    if (results.score >= 80) {
        // Animate buttons
        gsap.from('.buttons-container button', {
            y: 30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.2,
            ease: "power2.out",
            delay: 1.5
        });
    }

    // Score counter animation with color change
    const scoreNumber = document.querySelector('.score-number');
    gsap.to(scoreNumber, {
        textContent: results.score,
        duration: 2,
        snap: { textContent: 1 },
        ease: "power2.out",
        delay: 0.5,
        onUpdate: () => {
            if (results.score >= 80) {
                scoreNumber.style.color = '#FFD700';
            } else if (results.score >= 50) {
                scoreNumber.style.color = '#A78BFA';
            }
        }
    });

    // Update stats with proper mapping
    const statsMapping = {
        'correct-answers': results.correctAnswers,
        'wrong-answers': results.wrongAnswers,
        'max-streak': results.maxStreak
    };

    Object.entries(statsMapping).forEach(([id, value], index) => {
        gsap.to(`#${id}`, {
            textContent: value,
            duration: 1,
            snap: { textContent: 1 },
            delay: 1.5 + (index * 0.2)
        });
    });

    localStorage.removeItem('quizResults');

    const saveScore = (results) => {
        const username = localStorage.getItem('username');
        if (!username) return;

        const scores = JSON.parse(localStorage.getItem('quizScores')) || [];
        const category = new URLSearchParams(window.location.search).get('category') || 'general';
        
        const newScore = {
            player: username,
            score: results.score,
            category: category,
            correctAnswers: results.correctAnswers,
            wrongAnswers: results.wrongAnswers,
            maxStreak: results.maxStreak,
            date: new Date().toISOString()
        };
        
        scores.push(newScore);
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('quizScores', JSON.stringify(scores.slice(0, 100)));
    };

    saveScore(results);
}); 