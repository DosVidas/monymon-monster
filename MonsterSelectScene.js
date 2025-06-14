// Escena de selección de monstruo inicial
class MonsterSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MonsterSelectScene' });
        this.monsters = [
            {
                id: 'firemon',
                name: 'Firemon',
                type: 'Fuego',
                color: 0xe74c3c,
                hp: 100,
                attack: 25,
                defense: 15,
                description: 'Un monstruo ardiente con gran poder de ataque'
            },
            {
                id: 'watermon',
                name: 'Watermon', 
                type: 'Agua',
                color: 0x3498db,
                hp: 120,
                attack: 20,
                defense: 20,
                description: 'Un monstruo acuático con buena defensa'
            },
            {
                id: 'leafmon',
                name: 'Leafmon',
                type: 'Planta',
                color: 0x27ae60,
                hp: 110,
                attack: 22,
                defense: 18,
                description: 'Un monstruo natural con estadísticas balanceadas'
            }
        ];
        this.selectedIndex = 0;
    }
    
    preload() {
        // Crear sprites simples para los monstruos usando gráficos generados
        this.monsters.forEach(monster => {
            this.load.image(monster.id, 'data:image/svg+xml;base64,' + btoa(`
                <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="50" fill="#${monster.color.toString(16).padStart(6, '0')}"/>
                    <circle cx="45" cy="45" r="8" fill="white"/>
                    <circle cx="75" cy="45" r="8" fill="white"/>
                    <circle cx="45" cy="45" r="4" fill="black"/>
                    <circle cx="75" cy="45" r="4" fill="black"/>
                    <path d="M 40 75 Q 60 85 80 75" stroke="black" stroke-width="3" fill="none"/>
                    <text x="60" y="105" font-family="monospace" font-size="12" fill="black" text-anchor="middle">${monster.name}</text>
                </svg>
            `));
        });
    }
    
    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Fondo
        this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0x34495e);
        
        // Título
        MonymonUtils.createPixelText(this, centerX, 50, 'Elige tu Monymon inicial', 28, '#ecf0f1');
        
        // Crear las cartas de monstruos
        this.monsterCards = [];
        const cardWidth = 200;
        const cardSpacing = 220;
        const startX = centerX - cardSpacing;
        
        this.monsters.forEach((monster, index) => {
            const cardX = startX + (index * cardSpacing);
            const cardY = centerY;
            
            // Carta del monstruo
            const card = this.add.rectangle(cardX, cardY, cardWidth, 280, 0x2c3e50)
                .setStrokeStyle(3, index === this.selectedIndex ? 0xf39c12 : 0x7f8c8d)
                .setInteractive()
                .on('pointerdown', () => this.selectMonster(index))
                .on('pointerover', () => this.highlightCard(index))
                .on('pointerout', () => this.unhighlightCard(index));
            
            // Sprite del monstruo
            const sprite = this.add.image(cardX, cardY - 60, monster.id).setScale(0.8);
            
            // Nombre del monstruo
            const name = MonymonUtils.createPixelText(this, cardX, cardY + 20, monster.name, 20, '#ecf0f1');
            
            // Tipo
            const type = MonymonUtils.createPixelText(this, cardX, cardY + 45, `Tipo: ${monster.type}`, 14, '#95a5a6');
            
            // Estadísticas
            const stats = MonymonUtils.createPixelText(this, cardX, cardY + 70, 
                `HP: ${monster.hp}\\nATK: ${monster.attack}\\nDEF: ${monster.defense}`, 12, '#bdc3c7');
            
            this.monsterCards.push({
                card,
                sprite,
                name,
                type,
                stats,
                monster,
                index
            });
        });
        
        // Descripción del monstruo seleccionado
        this.descriptionText = MonymonUtils.createPixelText(this, centerX, centerY + 180, 
            this.monsters[this.selectedIndex].description, 16, '#ecf0f1');
        this.descriptionText.setWordWrapWidth(600);
        
        // Botón de confirmación
        this.confirmButton = MonymonUtils.createButton(
            this,
            centerX,
            centerY + 230,
            180,
            45,
            'CONFIRMAR',
            () => this.confirmSelection()
        );
        
        // Instrucciones
        MonymonUtils.createPixelText(this, centerX, this.cameras.main.height - 40, 
            'Usa las flechas o toca para seleccionar', 14, '#7f8c8d');
        
        // Controles de teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Actualizar la selección inicial
        this.updateSelection();
    }
    
    update() {
        // Navegación con teclado
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            this.selectedIndex = Math.max(0, this.selectedIndex - 1);
            this.updateSelection();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            this.selectedIndex = Math.min(this.monsters.length - 1, this.selectedIndex + 1);
            this.updateSelection();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.confirmSelection();
        }
    }
    
    selectMonster(index) {
        this.selectedIndex = index;
        this.updateSelection();
    }
    
    highlightCard(index) {
        if (index !== this.selectedIndex) {
            this.monsterCards[index].card.setStrokeStyle(3, 0x95a5a6);
        }
    }
    
    unhighlightCard(index) {
        if (index !== this.selectedIndex) {
            this.monsterCards[index].card.setStrokeStyle(3, 0x7f8c8d);
        }
    }
    
    updateSelection() {
        // Actualizar el borde de las cartas
        this.monsterCards.forEach((card, index) => {
            if (index === this.selectedIndex) {
                card.card.setStrokeStyle(3, 0xf39c12);
                // Animación de selección
                this.tweens.add({
                    targets: card.sprite,
                    scaleX: 0.9,
                    scaleY: 0.9,
                    duration: 200,
                    yoyo: true,
                    ease: 'Power2'
                });
            } else {
                card.card.setStrokeStyle(3, 0x7f8c8d);
            }
        });
        
        // Actualizar descripción
        this.descriptionText.setText(this.monsters[this.selectedIndex].description);
    }
    
    confirmSelection() {
        const selectedMonster = this.monsters[this.selectedIndex];
        
        // Guardar la selección en los datos del juego
        window.monymonData.selectedMonster = selectedMonster;
        
        // Efecto de confirmación
        const card = this.monsterCards[this.selectedIndex];
        this.tweens.add({
            targets: [card.card, card.sprite, card.name, card.type, card.stats],
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            yoyo: true,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Transición a la escena del juego
                this.scene.start('GameScene');
            }
        });
        
        // Mensaje de confirmación
        const confirmText = MonymonUtils.createPixelText(this, 
            this.cameras.main.width / 2, 
            this.cameras.main.height / 2 + 120, 
            `¡Has elegido a ${selectedMonster.name}!`, 20, '#f39c12');
        
        this.tweens.add({
            targets: confirmText,
            alpha: 0,
            duration: 2000,
            ease: 'Power2'
        });
    }
}

