// Matrix Effect Script
class MatrixEffect {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.drops = [];
        
        // Parse URL parameters
        this.params = this.parseURLParams();
        
        // Set default values
        this.fontSize = parseInt(this.params.fontsize) || 16;
        this.textColor = this.params.color || '#00ff00';
        this.backgroundColor = this.params.bg || '#000000';
        this.speed = parseInt(this.params.speed) || 50; // Animation delay in ms (lower = faster)
        this.fadeTime = this.params.fade || '0a'; // Fade opacity (00-ff)
        this.useJapanese = this.params.japanese !== 'false'; // Default true, false to disable
        
        // Convert color names to hex if needed
        this.textColor = this.colorNameToHex(this.textColor) || this.textColor;
        this.backgroundColor = this.colorNameToHex(this.backgroundColor) || this.backgroundColor;
        
        // Validate and format fade time
        this.fadeTime = this.validateFadeTime(this.fadeTime);
        
        // Set canvas and body background
        document.body.style.background = this.backgroundColor;
        this.canvas.style.background = this.backgroundColor;
        
        // Matrix characters
        const latinChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        const japaneseChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        this.chars = this.useJapanese ? latinChars + japaneseChars : latinChars;
        
        this.init();
        this.animate();
        
        // Hide controls after 10 seconds
        setTimeout(() => {
            const controls = document.querySelector('.controls');
            if (controls) {
                controls.classList.add('hidden');
            }
        }, 10000);
    }
    
    parseURLParams() {
        const params = {};
        const urlParams = new URLSearchParams(window.location.search);
        for (const [key, value] of urlParams) {
            params[key] = value;
        }
        return params;
    }
    
    validateFadeTime(fade) {
        // Convert fade parameter to valid hex opacity
        if (fade.length === 1) {
            fade = fade + fade; // Convert single digit to double
        }
        
        // Validate hex values
        const validHex = /^[0-9a-fA-F]{1,2}$/;
        if (!validHex.test(fade)) {
            return '0a'; // Default fade
        }
        
        // Ensure it's 2 characters
        if (fade.length === 1) {
            fade = '0' + fade;
        }
        
        return fade.toLowerCase();
    }
    
    colorNameToHex(color) {
        const colors = {
            'black': '#000000',
            'white': '#ffffff',
            'red': '#ff0000',
            'green': '#00ff00',
            'blue': '#0000ff',
            'yellow': '#ffff00',
            'cyan': '#00ffff',
            'magenta': '#ff00ff',
            'orange': '#ffa500',
            'purple': '#800080',
            'pink': '#ffc0cb',
            'brown': '#a52a2a',
            'gray': '#808080',
            'grey': '#808080',
            'lime': '#00ff00',
            'navy': '#000080',
            'darkblue': '#00008b',
            'darkgreen': '#006400',
            'darkred': '#8b0000'
        };
        return colors[color.toLowerCase()];
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize drops
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = new Array(this.columns).fill(0);
        
        // Randomize initial positions
        for (let i = 0; i < this.drops.length; i++) {
            this.drops[i] = Math.random() * -100;
        }
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        
        // Adjust drops array if needed
        if (this.drops.length !== this.columns) {
            this.drops = new Array(this.columns).fill(0);
            for (let i = 0; i < this.drops.length; i++) {
                this.drops[i] = Math.random() * -100;
            }
        }
    }
    
    draw() {
        // Create trailing effect with customizable fade
        this.ctx.fillStyle = this.backgroundColor + this.fadeTime;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set text properties
        this.ctx.fillStyle = this.textColor;
        this.ctx.font = `${this.fontSize}px 'Courier New', monospace`;
        
        // Draw characters
        for (let i = 0; i < this.drops.length; i++) {
            // Random character
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            
            // Draw character
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            this.ctx.fillText(char, x, y);
            
            // Move drop down
            this.drops[i]++;
            
            // Reset drop if it goes off screen or randomly
            if (y > this.canvas.height || Math.random() > 0.975) {
                this.drops[i] = 0;
            }
        }
    }
    
    animate() {
        this.draw();
        setTimeout(() => this.animate(), this.speed);
    }
}

// Start the effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MatrixEffect();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animation when tab is not visible
        return;
    }
});