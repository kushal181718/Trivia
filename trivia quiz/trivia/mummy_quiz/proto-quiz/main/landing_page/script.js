document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const playBtn = document.querySelector('.play-btn');
    
    if (username) {
        playBtn.onclick = () => window.location.href = '../quiz_categories/index.html';
    } else {
        playBtn.onclick = () => window.location.href = '../login_page/index.html';
    }
});

function handleLogout() {
    localStorage.removeItem('username');
    window.location.href = '../login_page/index.html';
}

class Background {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg'),
            antialias: true
        });
        
        this.mouse = new THREE.Vector2();
        this.particles = [];
        this.raycaster = new THREE.Raycaster();
        this.clock = new THREE.Clock();
        
        this.init();
    }

    init() {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x0c1222, 1);

        this.camera.position.z = 50;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x6366f1, 2);
        pointLight.position.set(0, 0, 20);
        this.scene.add(pointLight);

        this.createParticles();

        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('click', () => this.onMouseClick());

        this.animate();
    }

    createParticles() {
        const geometries = [
            new THREE.IcosahedronGeometry(0.8, 0),
            new THREE.OctahedronGeometry(0.8, 0),
            new THREE.TetrahedronGeometry(0.8, 0)
        ];

        const material = new THREE.MeshPhongMaterial({
            color: 0x6366f1,
            shininess: 100,
            transparent: true,
            opacity: 0.7
        });

        for(let i = 0; i < 100; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const particle = new THREE.Mesh(geometry, material.clone());
            
            particle.position.x = Math.random() * 100 - 50;
            particle.position.y = Math.random() * 100 - 50;
            particle.position.z = Math.random() * 50 - 25;

            particle.rotation.x = Math.random() * Math.PI;
            particle.rotation.y = Math.random() * Math.PI;

            particle.userData = {
                originalPosition: particle.position.clone(),
                originalScale: 1,
                targetScale: 1,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.05,
                    (Math.random() - 0.5) * 0.05,
                    (Math.random() - 0.5) * 0.05
                ),
                rotationSpeed: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                )
            };

            this.particles.push(particle);
            this.scene.add(particle);
        }
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        this.particles.forEach(particle => {
            const distance = this.raycaster.ray.distanceToPoint(particle.position);
            if (distance < 10) {
                gsap.to(particle.scale, {
                    x: 1.5,
                    y: 1.5,
                    z: 1.5,
                    duration: 0.3
                });
                
                gsap.to(particle.material, {
                    opacity: 1,
                    duration: 0.3
                });

                const force = particle.position.clone().sub(this.raycaster.ray.origin).normalize();
                particle.userData.velocity.add(force.multiplyScalar(0.01));
            } else {
                gsap.to(particle.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 0.3
                });
                
                gsap.to(particle.material, {
                    opacity: 0.7,
                    duration: 0.3
                });
            }
        });
    }

    onMouseClick() {
        this.particles.forEach(particle => {
            const distance = particle.position.distanceTo(this.camera.position);
            gsap.to(particle.position, {
                x: particle.position.x + (Math.random() - 0.5) * 10,
                y: particle.position.y + (Math.random() - 0.5) * 10,
                z: particle.position.z + (Math.random() - 0.5) * 10,
                duration: 1,
                ease: "elastic.out(1, 0.3)",
                delay: distance * 0.01
            });
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        this.particles.forEach(particle => {
            particle.position.add(particle.userData.velocity);
            particle.userData.velocity.multiplyScalar(0.98);

            particle.rotation.x += particle.userData.rotationSpeed.x;
            particle.rotation.y += particle.userData.rotationSpeed.y;
            particle.rotation.z += particle.userData.rotationSpeed.z;

            ['x', 'y', 'z'].forEach(axis => {
                const limit = axis === 'z' ? 25 : 50;
                if (Math.abs(particle.position[axis]) > limit) {
                    particle.userData.velocity[axis] *= -0.5;
                    particle.position[axis] = Math.sign(particle.position[axis]) * limit;
                }
            });

            particle.position.lerp(particle.userData.originalPosition, 0.01);
        });

        this.camera.rotation.z += 0.0002;

        this.renderer.render(this.scene, this.camera);
    }
}

class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.follower = document.querySelector('.cursor-follower');
        this.init();
    }

    init() {
        gsap.set([this.cursor, this.follower], {
            xPercent: -50,
            yPercent: -50
        });

        document.addEventListener('mousemove', (e) => {
            gsap.to(this.cursor, {
                duration: 0.1,
                x: e.clientX,
                y: e.clientY
            });

            gsap.to(this.follower, {
                duration: 0.5,
                x: e.clientX,
                y: e.clientY,
                ease: "power2.out"
            });
        });

        const links = document.querySelectorAll('button, .comment');
        
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(this.cursor, {
                    duration: 0.3,
                    scale: 2,
                    backgroundColor: '#6366f1'
                });
                
                gsap.to(this.follower, {
                    duration: 0.3,
                    scale: 1.5,
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(this.cursor, {
                    duration: 0.3,
                    scale: 1,
                    backgroundColor: '#fff'
                });
                
                gsap.to(this.follower, {
                    duration: 0.3,
                    scale: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                });
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const background = new Background();
    const cursor = new CustomCursor();
});