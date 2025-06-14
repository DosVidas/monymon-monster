// Escena de bienvenida del juego Monymon
class WelcomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WelcomeScene' });
    }
    
    preload() {
        // Crear gráficos simples para la pantalla de bienvenida
        this.load.image('logo', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="100" fill="#e74c3c"/>
                <text x="100" y="35" font-family="monospace" font-size="24" fill="white" text-anchor="middle">MONYMON</text>
                <text x="100" y="65" font-family="monospace" font-size="12" fill="white" text-anchor="middle">Mini Juego RPG</text>
                <text x="100" y="85" font-family="monospace" font-size="10" fill="white" text-anchor="middle">Para Telegram</text>
            </svg>
        `));
    }
    
    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Fondo degradado
        this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0x2c3e50);
        
        // Logo del juego
        const logo = this.add.image(centerX, centerY - 100, 'logo');
        logo.setScale(1.5);
        
        // Título principal
        const title = MonymonUtils.createPixelText(this, centerX, centerY + 50, '¡Bienvenido a Monymon!', 32, '#e74c3c');
        
        // Subtítulo
        const subtitle = MonymonUtils.createPixelText(this, centerX, centerY + 90, 'Un mundo de criaturas te espera', 18, '#ecf0f1');
        
        // Instrucciones
        const instructions = MonymonUtils.createPixelText(this, centerX, centerY + 130, 'Toca para comenzar tu aventura', 16, '#95a5a6');
        
        // Botón de inicio
        const startButton = MonymonUtils.createButton(
            this, 
            centerX, 
            centerY + 180, 
            200, 
            50, 
            'COMENZAR',
            () => {
                this.scene.start('MonsterSelectScene');
            }
        );
        
        // Animación del título
        this.tweens.add({
            targets: title,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Animación de las instrucciones
        this.tweens.add({
            targets: instructions,
            alpha: 0.5,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Información de versión
        MonymonUtils.createPixelText(this, centerX, this.cameras.main.height - 30, 'v1.0 - Hecho para Telegram', 12, '#7f8c8d');
        
        // Hacer toda la pantalla clickeable para comenzar
        this.input.on('pointerdown', () => {
            this.scene.start('MonsterSelectScene');
        });
    }
}

