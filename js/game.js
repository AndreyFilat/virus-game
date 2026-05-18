        class VirusGame {
            constructor() {
                this.dnaPoints = 0;
                this.selectedCountry = null;
                this.infectionLevel = 1;
                this.infectedCount = 1247;
                this.spreadRate = 12;
                this.countryCount = 1;
                this.lethality = 0.1;
                
                this.countries = {
                    china: { name: 'Китай', population: 1400000000 },
                    usa: { name: 'США', population: 330000000 },
                    russia: { name: 'Россия', population: 146000000 },
                    brazil: { name: 'Бразилия', population: 215000000 },
                    india: { name: 'Индия', population: 1380000000 },
                    germany: { name: 'Германия', population: 83000000 }
                };
                
                this.init();
            }
            
            init() {
                this.bindEvents();
                this.updateDNACounter();
                this.spawnMapBubbles();
            }
            
            bindEvents() {
                // DNA Bubbles
                document.querySelectorAll('.dna-bubble').forEach(bubble => {
                    bubble.addEventListener('click', (e) => this.collectDNA(e));
                });
                
                // Evolution Menu
                const evoBtn = document.getElementById('evolutionMenuBtn');
                if (evoBtn) evoBtn.addEventListener('click', () => this.showEvolutionMenu());
                
                const backBtn = document.getElementById('backToMap');
                if (backBtn) backBtn.addEventListener('click', () => this.showMapScreen());
            }
            
            collectDNA(event) {
                const bubble = event.currentTarget;
                const dnaAmount = parseInt(bubble.dataset.dna);
                const rect = bubble.getBoundingClientRect();
                
                // Add DNA points
                this.dnaPoints += dnaAmount;
                this.updateDNACounter();
                
                // Create elegant pop effect
                this.createPopEffect(rect.left + rect.width/2, rect.top + rect.height/2, `+${dnaAmount}`);
                
                // Smooth bubble pop animation
                bubble.classList.add('popping');
                
                setTimeout(() => {
                    bubble.classList.add('popped');
                    
                    // Check if all bubbles collected
                    const remainingBubbles = document.querySelectorAll('.dna-bubble:not(.popped)').length;
                    if (remainingBubbles === 0) {
                        setTimeout(() => this.showVirusCreation(), 800);
                    }
                }, 800);
            }
            
            createPopEffect(x, y, text) {
                const effect = document.createElement('div');
                effect.className = 'pop-effect';
                effect.textContent = text;
                effect.style.left = x + 'px';
                effect.style.top = y + 'px';
                
                document.body.appendChild(effect);
                
                setTimeout(() => {
                    effect.remove();
                }, 1000);
            }
            
            updateDNACounter() {
                document.getElementById('dnaCount').textContent = this.dnaPoints;
            }
            
            showVirusCreation() {
                document.getElementById('startScreen').classList.remove('active');
                setTimeout(() => {
                    document.getElementById('worldMapScreen').classList.add('active');
                }, 200);
            }
            
            spawnMapBubbles() {
                const territory = document.getElementById('territory');
                
                setInterval(() => {
                    if (document.getElementById('mapScreen').classList.contains('active')) {
                        this.spawnMapBubble(territory);
                    }
                }, 3000 + Math.random() * 4000); // 3-7 seconds
            }
            
            spawnMapBubble(container) {
                const bubble = document.createElement('div');
                bubble.className = 'map-bubble';
                bubble.innerHTML = '<div class="dna-symbol">🧬</div>';
                
                // Random position
                const containerRect = container.getBoundingClientRect();
                const x = Math.random() * (containerRect.width - 60 - 40) + 20;
                const y = Math.random() * (containerRect.height - 60 - 60) + 50;
                
                bubble.style.left = x + 'px';
                bubble.style.top = y + 'px';
                bubble.dataset.dna = Math.floor(Math.random() * 10) + 5; // 5-14 DNA
                
                // Add click event
                bubble.addEventListener('click', (e) => {
                    const dnaAmount = parseInt(bubble.dataset.dna);
                    this.dnaPoints += dnaAmount;
                    this.updateDNACounter();
                    
                    const rect = bubble.getBoundingClientRect();
                    this.createPopEffect(rect.left + rect.width/2, rect.top + rect.height/2, `+${dnaAmount}`);
                    
                    bubble.classList.add('popping');
                    setTimeout(() => bubble.remove(), 800);
                });
                
                container.appendChild(bubble);
                
                // Auto-remove after 10 seconds if not clicked
                setTimeout(() => {
                    if (bubble.parentNode) {
                        bubble.style.opacity = '0.3';
                        setTimeout(() => {
                            if (bubble.parentNode) bubble.remove();
                        }, 2000);
                    }
                }, 10000);
            }
            
            startSimulation() {
                // Update stats periodically
                setInterval(() => {
                    this.updateStats();
                }, 2000);
            }
            
            showEvolutionMenu() {
                document.getElementById('mapScreen').classList.remove('active');
                setTimeout(() => {
                    document.getElementById('evolutionScreen').classList.add('active');
                }, 200);
            }
            
            showMapScreen() {
                document.getElementById('evolutionScreen').classList.remove('active');
                setTimeout(() => {
                    document.getElementById('mapScreen').classList.add('active');
                }, 200);
            }
            
            updateStats() {
                // Simulate virus spread
                const growth = 1 + (this.spreadRate / 100) * (Math.random() * 0.5 + 0.5);
                this.infectedCount = Math.floor(this.infectedCount * growth);
                
                // Update display
                document.getElementById('infectedCount').textContent = this.formatNumber(this.infectedCount);
                document.getElementById('spreadRate').textContent = `+${this.spreadRate}%`;
                document.getElementById('countryCount').textContent = this.countryCount;
                document.getElementById('lethality').textContent = `${this.lethality}%`;
                
                // Update infection level
                if (this.infectedCount > 10000 && this.infectionLevel === 1) {
                    this.infectionLevel = 2;
                    document.getElementById('infectionLevel').textContent = this.infectionLevel;
                }
            }
            
            formatNumber(num) {
                if (num >= 1000000) {
                    return (num / 1000000).toFixed(1) + 'M';
                } else if (num >= 1000) {
                    return (num / 1000).toFixed(1) + 'K';
                }
                return num.toString();
            }
        }
        
        // Initialize game
        const game = new VirusGame();
        
        // Prevent zoom on double tap (iOS Safari)
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
