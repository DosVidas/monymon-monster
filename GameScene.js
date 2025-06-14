// Escena principal del juego donde ocurre la aventura
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.companion = null;
        this.npcs = [];
        this.obstacles = [];
        this.playerSpeed = 160;
        this.isInBattle = false;
    }
    
    preload() {
        // Crear sprite del jugador
        this.load.image('player', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="12" r="8" fill="#f39c12"/>
                <rect x="12" y="16" width="8" height="12" fill="#3498db"/>
                <rect x="10" y="20" width="4" height="8" fill="#e67e22"/>
                <rect x="18" y="20" width="4" height="8" fill="#e67e22"/>
                <circle cx="13" cy="10" r="1" fill="black"/>
                <circle cx="19" cy="10" r="1" fill="black"/>
            </svg>
        `));
        
        // Crear sprites para NPCs
        this.load.image('npc', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="12" r="8" fill="#e74c3c"/>
                <rect x="12" y="16" width="8" height="12" fill="#8e44ad"/>
                <rect x="10" y="20" width="4" height="8" fill="#2c3e50"/>
                <rect x="18" y="20" width="4" height="8" fill="#2c3e50"/>
                <circle cx="13" cy="10" r="1" fill="black"/>
                <circle cx="19" cy="10" r="1" fill="black"/>
                <text x="16" y="35" font-family="monospace" font-size="8" fill="red" text-anchor="middle">!</text>
            </svg>
        `));
        
        // Crear tiles para el mapa
        this.load.image('grass', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" fill="#27ae60"/>
                <rect x="0" y="0" width="16" height="16" fill="#2ecc71"/>
                <rect x="16" y="16" width="16" height="16" fill="#2ecc71"/>
            </svg>
        `));
        
        this.load.image('tree', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <rect x="14" y="20" width="4" height="12" fill="#8b4513"/>
                <circle cx="16" cy="16" r="12" fill="#228b22"/>
                <circle cx="12" cy="12" r="6" fill="#32cd32"/>
                <circle cx="20" cy="12" r="6" fill="#32cd32"/>
            </svg>
        `));
        
        this.load.image('rock', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <polygon points="16,4 28,20 4,20" fill="#7f8c8d"/>
                <polygon points="16,4 28,20 22,20 16,8" fill="#95a5a6"/>
            </svg>
        `));
    }
    
    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Crear el mapa de tiles
        this.createMap();
        
        // Crear el jugador
        this.player = this.physics.add.sprite(centerX, centerY, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(24, 24);
        
        // Crear el monstruo compañero
        this.createCompanion();
        
        // Crear NPCs
        this.createNPCs();
        
        // Configurar controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        
        // Configurar cámara
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1.5);
        
        // UI del juego
        this.createUI();
        
        // Configurar colisiones
        this.physics.add.collider(this.player, this.obstacles);
        this.physics.add.overlap(this.player, this.npcs, this.startBattle, null, this);
        
        // Mensaje de bienvenida
        this.showMessage(`¡Bienvenido, entrenador! Tu ${window.monymonData.selectedMonster.name} te acompaña en esta aventura.`);
    }
    
    createMap() {
        // Crear un mapa simple con tiles de césped
        const mapWidth = 25;
        const mapHeight = 19;
        const tileSize = 32;
        
        // Fondo de césped
        for (let x = 0; x < mapWidth; x++) {
            for (let y = 0; y < mapHeight; y++) {
                this.add.image(x * tileSize + 16, y * tileSize + 16, 'grass');
            }
        }
        
        // Añadir obstáculos (árboles y rocas)
        const obstaclePositions = [
            { x: 3, y: 3, type: 'tree' },
            { x: 8, y: 5, type: 'rock' },
            { x: 15, y: 2, type: 'tree' },
            { x: 20, y: 7, type: 'tree' },
            { x: 5, y: 12, type: 'rock' },
            { x: 18, y: 15, type: 'tree' },
            { x: 10, y: 8, type: 'tree' },
            { x: 22, y: 12, type: 'rock' }
        ];
        
        obstaclePositions.forEach(pos => {
            const obstacle = this.physics.add.staticSprite(
                pos.x * tileSize + 16, 
                pos.y * tileSize + 16, 
                pos.type
            );
            obstacle.body.setSize(28, 28);
            this.obstacles.push(obstacle);
        });
        
        // Configurar límites del mundo
        this.physics.world.setBounds(0, 0, mapWidth * tileSize, mapHeight * tileSize);
    }
    
    createCompanion() {
        const monster = window.monymonData.selectedMonster;
        
        // Crear sprite del compañero basado en el monstruo seleccionado
        this.load.image('companion', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#${monster.color.toString(16).padStart(6, '0')}"/>
                <circle cx="9" cy="9" r="2" fill="white"/>
                <circle cx="15" cy="9" r="2" fill="white"/>
                <circle cx="9" cy="9" r="1" fill="black"/>
                <circle cx="15" cy="9" r="1" fill="black"/>
                <path d="M 8 15 Q 12 17 16 15" stroke="black" stroke-width="1" fill="none"/>
            </svg>
        `));
        
        this.load.start();
        this.load.once('complete', () => {
            this.companion = this.physics.add.sprite(
                this.player.x - 40, 
                this.player.y, 
                'companion'
            );
            this.companion.setCollideWorldBounds(true);
        });
    }
    
    createNPCs() {
        const npcPositions = [
            { x: 200, y: 150 },
            { x: 450, y: 300 },
            { x: 600, y: 200 },
            { x: 300, y: 400 }
        ];
        
        npcPositions.forEach((pos, index) => {
            const npc = this.physics.add.sprite(pos.x, pos.y, 'npc');
            npc.setCollideWorldBounds(true);
            npc.body.setSize(24, 24);
            npc.npcId = index;
            npc.defeated = false;
            this.npcs.push(npc);
            
            // Movimiento aleatorio para los NPCs
            this.time.addEvent({
                delay: 2000 + Math.random() * 3000,
                callback: () => this.moveNPCRandomly(npc),
                loop: true
            });
        });
    }
    
    createUI() {
        // Panel de información fijo en la pantalla
        this.uiContainer = this.add.container(0, 0);
        this.uiContainer.setScrollFactor(0);
        
        // Fondo del panel
        const uiBackground = this.add.rectangle(10, 10, 200, 80, 0x2c3e50, 0.8);
        uiBackground.setOrigin(0, 0);
        
        // Información del monstruo
        const monster = window.monymonData.selectedMonster;
        this.monsterNameText = this.add.text(20, 20, monster.name, {
            fontSize: '16px',
            fill: '#ecf0f1',
            fontFamily: 'monospace'
        });
        
        this.monsterHPText = this.add.text(20, 40, `HP: ${monster.hp}/${monster.hp}`, {
            fontSize: '14px',
            fill: '#e74c3c',
            fontFamily: 'monospace'
        });
        
        this.scoreText = this.add.text(20, 60, `Puntuación: ${window.monymonData.score}`, {
            fontSize: '14px',
            fill: '#f39c12',
            fontFamily: 'monospace'
        });
        
        this.uiContainer.add([uiBackground, this.monsterNameText, this.monsterHPText, this.scoreText]);
        
        // Controles en pantalla para móviles
        this.createTouchControls();
    }
    
    createTouchControls() {
        const buttonSize = 60;
        const buttonSpacing = 80;
        const baseX = this.cameras.main.width - 150;
        const baseY = this.cameras.main.height - 150;
        
        // Botones direccionales
        const directions = [
            { key: 'up', x: baseX, y: baseY - buttonSpacing, text: '↑' },
            { key: 'down', x: baseX, y: baseY + buttonSpacing, text: '↓' },
            { key: 'left', x: baseX - buttonSpacing, y: baseY, text: '←' },
            { key: 'right', x: baseX + buttonSpacing, y: baseY, text: '→' }
        ];
        
        this.touchButtons = {};
        
        directions.forEach(dir => {
            const button = this.add.circle(dir.x, dir.y, buttonSize/2, 0x3498db, 0.7)
                .setScrollFactor(0)
                .setInteractive()
                .on('pointerdown', () => {
                    this.touchButtons[dir.key] = true;
                })
                .on('pointerup', () => {
                    this.touchButtons[dir.key] = false;
                })
                .on('pointerout', () => {
                    this.touchButtons[dir.key] = false;
                });
            
            this.add.text(dir.x, dir.y, dir.text, {
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'monospace'
            }).setOrigin(0.5).setScrollFactor(0);
        });
    }
    
    update() {
        if (this.isInBattle) return;
        
        // Movimiento del jugador
        this.player.setVelocity(0);
        
        let moving = false;
        
        // Controles de teclado
        if (this.cursors.left.isDown || this.wasd.A.isDown || this.touchButtons.left) {
            this.player.setVelocityX(-this.playerSpeed);
            moving = true;
        } else if (this.cursors.right.isDown || this.wasd.D.isDown || this.touchButtons.right) {
            this.player.setVelocityX(this.playerSpeed);
            moving = true;
        }
        
        if (this.cursors.up.isDown || this.wasd.W.isDown || this.touchButtons.up) {
            this.player.setVelocityY(-this.playerSpeed);
            moving = true;
        } else if (this.cursors.down.isDown || this.wasd.S.isDown || this.touchButtons.down) {
            this.player.setVelocityY(this.playerSpeed);
            moving = true;
        }
        
        // Hacer que el compañero siga al jugador
        if (this.companion && moving) {
            this.physics.moveToObject(this.companion, this.player, 100);
            
            // Mantener distancia del jugador
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                this.companion.x, this.companion.y
            );
            
            if (distance < 50) {
                this.companion.setVelocity(0);
            }
        }
    }
    
    moveNPCRandomly(npc) {
        if (npc.defeated) return;
        
        const directions = [
            { x: 0, y: -50 },
            { x: 0, y: 50 },
            { x: -50, y: 0 },
            { x: 50, y: 0 }
        ];
        
        const randomDirection = Phaser.Utils.Array.GetRandom(directions);
        
        this.tweens.add({
            targets: npc,
            x: npc.x + randomDirection.x,
            y: npc.y + randomDirection.y,
            duration: 1000,
            ease: 'Power2'
        });
    }
    
    startBattle(player, npc) {
        if (this.isInBattle || npc.defeated) return;
        
        this.isInBattle = true;
        npc.defeated = true;
        
        // Detener movimiento
        this.player.setVelocity(0);
        if (this.companion) this.companion.setVelocity(0);
        
        // Efecto visual de batalla
        this.cameras.main.shake(200, 0.02);
        
        // Simular batalla simple
        this.showBattleSequence(npc);
    }
    
    showBattleSequence(npc) {
        const monster = window.monymonData.selectedMonster;
        
        // Crear overlay de batalla
        const battleOverlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.8
        ).setScrollFactor(0);
        
        // Texto de batalla
        const battleText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            `¡${monster.name} vs Monymon Salvaje!`,
            {
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'monospace'
            }
        ).setOrigin(0.5).setScrollFactor(0);
        
        // Secuencia de batalla
        this.time.delayedCall(1500, () => {
            battleText.setText(`${monster.name} usa Ataque!`);
        });
        
        this.time.delayedCall(3000, () => {
            battleText.setText('¡Victoria!');
            window.monymonData.score += 100;
            this.scoreText.setText(`Puntuación: ${window.monymonData.score}`);
        });
        
        this.time.delayedCall(4500, () => {
            battleOverlay.destroy();
            battleText.destroy();
            this.isInBattle = false;
            
            // Hacer que el NPC desaparezca
            npc.setTint(0x666666);
            npc.setAlpha(0.5);
        });
    }
    
    showMessage(text) {
        const messageBox = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.height - 80,
            this.cameras.main.width - 40,
            60,
            0x2c3e50,
            0.9
        ).setScrollFactor(0);
        
        const messageText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height - 80,
            text,
            {
                fontSize: '16px',
                fill: '#ecf0f1',
                fontFamily: 'monospace',
                wordWrap: { width: this.cameras.main.width - 80 }
            }
        ).setOrigin(0.5).setScrollFactor(0);
        
        this.time.delayedCall(4000, () => {
            messageBox.destroy();
            messageText.destroy();
        });
    }
}

