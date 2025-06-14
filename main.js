// Configuración principal del juego Monymon
class MonymonGame {
    constructor() {
        this.config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            backgroundColor: '#2c3e50',
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                min: {
                    width: 320,
                    height: 240
                },
                max: {
                    width: 800,
                    height: 600
                }
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: [WelcomeScene, MonsterSelectScene, GameScene]
        };
        
        this.game = new Phaser.Game(this.config);
        this.gameData = {
            selectedMonster: null,
            playerName: 'Entrenador',
            score: 0,
            level: 1
        };
        
        // Hacer los datos del juego accesibles globalmente
        window.monymonData = this.gameData;
    }
}

// Inicializar el juego cuando la página esté cargada
window.addEventListener('load', () => {
    new MonymonGame();
});

// Funciones utilitarias globales
window.MonymonUtils = {
    // Función para crear texto con estilo pixel
    createPixelText: function(scene, x, y, text, size = 24, color = '#ffffff') {
        return scene.add.text(x, y, text, {
            fontSize: size + 'px',
            fill: color,
            fontFamily: 'monospace',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
    },
    
    // Función para crear botones simples
    createButton: function(scene, x, y, width, height, text, callback) {
        const button = scene.add.rectangle(x, y, width, height, 0x3498db)
            .setStrokeStyle(2, 0x2980b9)
            .setInteractive()
            .on('pointerdown', callback)
            .on('pointerover', function() {
                this.setFillStyle(0x5dade2);
            })
            .on('pointerout', function() {
                this.setFillStyle(0x3498db);
            });
            
        const buttonText = this.createPixelText(scene, x, y, text, 18, '#ffffff');
        
        return { button, text: buttonText };
    }
};

