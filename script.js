// Advanced AegisBot Dashboard JavaScript
class AegisBotDashboard {
    constructor() {
        this.apiUrl = '/api/status';
        this.updateInterval = 30000; // 30 seconds
        this.data = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateData();
        this.startAutoUpdate();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Refresh button
        window.refreshData = () => this.refreshData();
        
        // Navigation smooth scrolling
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                this.scrollToSection(target);
                this.updateActiveNavLink(link);
            });
        });
    }

    setupNavigation() {
        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            const sections = ['dashboard', 'commands', 'stats', 'system'];
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const height = element.offsetHeight;
                    
                    if (scrollPos >= offsetTop && scrollPos < offsetTop + height) {
                        this.updateActiveNavLink(document.querySelector(`[href="#${section}"]`));
                    }
                }
            });
        });
    }

    scrollToSection(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    async updateData() {
        try {
            const response = await fetch(this.apiUrl);
            const result = await response.json();
            
            if (result.success) {
                this.data = result.data;
                this.renderData();
            } else {
                this.renderOfflineState();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            this.renderOfflineState();
        }
    }

    renderData() {
        const data = this.data;
        
        // Update status indicators
        this.updateStatusIndicators(data.isOnline);
        
        // Update hero stats
        this.updateHeroStats(data);
        
        // Update dashboard cards
        this.updateDashboardCards(data);
        
        // Update statistics
        this.updateStatistics(data);
        
        // Update system information
        this.updateSystemInfo(data);
        
        // Update commands
        this.updateCommands(data.commands);
        
        // Update last update time
        this.updateLastUpdateTime();
    }

    updateStatusIndicators(isOnline) {
        const indicators = ['navStatus', 'cardStatus'];
        
        indicators.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const dot = element.querySelector('.status-dot');
                const text = element.querySelector('span');
                
                if (isOnline) {
                    dot.classList.remove('offline');
                    dot.classList.add('online');
                    text.textContent = 'Online';
                } else {
                    dot.classList.remove('online');
                    dot.classList.add('offline');
                    text.textContent = 'Offline';
                }
            }
        });
    }

    updateHeroStats(data) {
        this.animateNumber('heroUsers', data.totalUsers || 0);
        this.animateNumber('heroGroups', data.totalGroups || 0);
        this.animateNumber('heroPets', data.totalPets || 0);
    }

    updateDashboardCards(data) {
        // Update uptime
        const uptimeElement = document.getElementById('uptime');
        if (uptimeElement) {
            uptimeElement.textContent = this.formatUptime(data.uptime);
        }
        
        // Update registered users
        const registeredElement = document.getElementById('registeredUsers');
        if (registeredElement) {
            registeredElement.textContent = (data.registeredUsers || 0).toLocaleString('de-DE');
        }
        
        // Update activity stats
        this.animateNumber('totalUsers', data.totalUsers || 0);
        this.animateNumber('totalGroups', data.totalGroups || 0);
        this.animateNumber('totalPets', data.totalPets || 0);
        
        // Update system resources
        if (data.system && data.system.ram) {
            this.updateRAMUsage(data.system.ram);
            this.updateCPUInfo(data.system.cpu);
        }
    }

    updateStatistics(data) {
        this.animateNumber('statUsers', data.totalUsers || 0);
        this.animateNumber('statGroups', data.totalGroups || 0);
        this.animateNumber('statPets', data.totalPets || 0);
        this.animateNumber('statRegistered', data.registeredUsers || 0);
    }

    updateSystemInfo(data) {
        if (data.system) {
            // Update memory information
            if (data.system.ram) {
                const ram = data.system.ram;
                const memoryBar = document.getElementById('memoryBar');
                const memoryUsed = document.getElementById('memoryUsed');
                const memoryTotal = document.getElementById('memoryTotal');
                
                if (memoryBar) {
                    memoryBar.style.width = `${ram.percentage}%`;
                }
                if (memoryUsed) {
                    memoryUsed.textContent = `${ram.used} GB`;
                }
                if (memoryTotal) {
                    memoryTotal.textContent = `${ram.total} GB`;
                }
            }
            
            // Update CPU information
            if (data.system.cpu) {
                const cpu = data.system.cpu;
                const cpuModel = document.getElementById('cpuModel');
                const cpuCores = document.getElementById('cpuCores');
                const cpuArch = document.getElementById('cpuArch');
                
                if (cpuModel) {
                    cpuModel.textContent = this.truncateText(cpu.model, 30);
                }
                if (cpuCores) {
                    cpuCores.textContent = cpu.cores;
                }
                if (cpuArch) {
                    cpuArch.textContent = `${cpu.platform} ${cpu.arch}`;
                }
            }
        }
    }

    updateRAMUsage(ram) {
        const ramUsage = document.getElementById('ramUsage');
        const ramProgress = document.getElementById('ramProgress');
        const cpuInfo = document.getElementById('cpuInfo');
        const platformInfo = document.getElementById('platformInfo');
        
        if (ramUsage) {
            ramUsage.textContent = `${ram.used}/${ram.total} GB`;
        }
        
        if (ramProgress) {
            ramProgress.style.width = `${ram.percentage}%`;
        }
        
        if (cpuInfo) {
            cpuInfo.textContent = `${ram.percentage}% RAM-Verbrauch`;
        }
        
        if (platformInfo) {
            platformInfo.textContent = `${ram.free} GB Frei`;
        }
    }

    updateCPUInfo(cpu) {
        const cpuInfo = document.getElementById('cpuInfo');
        const platformInfo = document.getElementById('platformInfo');
        
        if (cpuInfo) {
            cpuInfo.textContent = this.truncateText(cpu.model, 25);
        }
        
        if (platformInfo) {
            platformInfo.textContent = `${cpu.platform} (${cpu.cores} Kerne)`;
        }
    }

    updateCommands(commands) {
        const commandsGrid = document.getElementById('commandsGrid');
        if (!commandsGrid || !commands) return;
        
        commandsGrid.innerHTML = '';
        
        const categoryIcons = {
            economy: 'fas fa-coins',
            games: 'fas fa-dice',
            shop: 'fas fa-shopping-cart',
            jobs: 'fas fa-briefcase',
            houses: 'fas fa-home',
            pets: 'fas fa-paw',
            notes: 'fas fa-sticky-note',
            sticker: 'fas fa-image',
            group: 'fas fa-users',
            moderation: 'fas fa-shield-alt',
            botmoderation: 'fas fa-robot',
            owner: 'fas fa-crown',
            utility: 'fas fa-tools'
        };
        
        const categoryNames = {
            economy: 'Economy System',
            games: 'Casino & Spiele',
            shop: 'Shop & Inventar',
            jobs: 'Job System',
            houses: 'Immobilien',
            pets: 'Haustier System',
            notes: 'Persönliche Notizen',
            sticker: 'Sticker Creator',
            group: 'Gruppen Features',
            moderation: 'Gruppen Moderation',
            botmoderation: 'Bot Moderation',
            owner: 'Owner & Admin',
            utility: 'Utilities & Info'
        };
        
        Object.entries(commands).forEach(([category, commandList]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'command-category';
            
            const icon = categoryIcons[category] || 'fas fa-terminal';
            const name = categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
            
            categoryDiv.innerHTML = `
                <h3><i class="${icon}"></i> ${name}</h3>
                <div class="command-list">
                    ${commandList.map(cmd => `
                        <div class="command-item">
                            <code>${cmd.cmd}</code>
                            <span>${cmd.desc}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            
            commandsGrid.appendChild(categoryDiv);
        });
        
        // Add animation to command items
        this.animateCommandItems();
    }

    animateCommandItems() {
        const commandItems = document.querySelectorAll('.command-item');
        commandItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    updateLastUpdateTime() {
        const lastUpdate = document.getElementById('lastUpdate');
        if (lastUpdate) {
            lastUpdate.textContent = new Date().toLocaleTimeString('de-DE');
        }
    }

    renderOfflineState() {
        this.updateStatusIndicators(false);
        
        // Set default values for offline state
        const elements = [
            'heroUsers', 'heroGroups', 'heroPets',
            'totalUsers', 'totalGroups', 'totalPets',
            'statUsers', 'statGroups', 'statPets', 'statRegistered'
        ];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '0';
            }
        });
        
        const textElements = [
            'uptime', 'registeredUsers', 'ramUsage',
            'cpuInfo', 'platformInfo', 'memoryUsed', 'memoryTotal'
        ];
        
        textElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '--';
            }
        });
        
        // Reset progress bars
        const progressBars = ['ramProgress', 'memoryBar'];
        progressBars.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.width = '0%';
            }
        });
    }

    animateNumber(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = parseInt(element.textContent) || 0;
        const increment = Math.ceil((targetValue - currentValue) / 20);
        
        if (currentValue !== targetValue) {
            const timer = setInterval(() => {
                const current = parseInt(element.textContent) || 0;
                if (current < targetValue) {
                    element.textContent = Math.min(current + increment, targetValue).toLocaleString('de-DE');
                } else {
                    element.textContent = targetValue.toLocaleString('de-DE');
                    clearInterval(timer);
                }
            }, 50);
        }
    }

    formatUptime(uptime) {
        if (!uptime || uptime <= 0) return '--';
        
        const seconds = Math.floor(uptime / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}T ${hours % 24}h ${minutes % 60}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    truncateText(text, maxLength) {
        if (!text) return 'Lädt...';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    refreshData() {
        const refreshIcon = document.getElementById('refreshIcon');
        if (refreshIcon) {
            refreshIcon.classList.add('spinning');
        }
        
        this.updateData().finally(() => {
            setTimeout(() => {
                if (refreshIcon) {
                    refreshIcon.classList.remove('spinning');
                }
            }, 1000);
        });
    }

    startAutoUpdate() {
        setInterval(() => {
            this.updateData();
        }, this.updateInterval);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AegisBotDashboard();
    
    // Add smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.dashboard-card, .stat-card, .system-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Add hover effects to cards
    document.querySelectorAll('.dashboard-card, .stat-card, .system-card, .command-category').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});