# Monymon - Mini Juego RPG para Telegram

![Monymon Logo](https://img.shields.io/badge/Monymon-RPG%20Game-red?style=for-the-badge)
![Phaser](https://img.shields.io/badge/Phaser-3.70.0-blue?style=flat-square)
![Telegram](https://img.shields.io/badge/Telegram-WebApp-26A5E4?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 🎮 Descripción

Monymon es un emocionante mini juego RPG desarrollado específicamente para la plataforma de Telegram utilizando Phaser 3. Los jugadores pueden elegir entre tres criaturas mágicas (Firemon, Watermon, Leafmon), explorar mapas, luchar contra NPCs y competir en tablas de clasificación.

## ✨ Características

- **🎯 Selección de Monstruos**: Elige entre 3 criaturas únicas con diferentes estadísticas
- **🗺️ Exploración**: Navega por mapas con obstáculos y NPCs
- **⚔️ Sistema de Combate**: Batallas por turnos contra monstruos salvajes
- **🏆 Sistema de Puntuación**: Compite por las mejores puntuaciones
- **📱 Optimizado para Móviles**: Controles táctiles y diseño responsive
- **🔗 Integración con Telegram**: Envío automático de puntuaciones y compartir resultados
- **⏱️ Modo Tiempo Limitado**: Desafío de 2 minutos para máxima emoción

## 🚀 Inicio Rápido

### Opción 1: Jugar Directamente
Abre el archivo `monymon-complete.html` en tu navegador para jugar inmediatamente.

### Opción 2: Servidor Local
```bash
# Usando Python
python -m http.server 8000

# Usando Node.js
npx serve .

# Luego visita http://localhost:8000
```

## 📁 Estructura del Proyecto

```
monymon-game/
├── monymon-complete.html          # Juego completo listo para usar
├── monymon.html                   # Versión básica del juego
├── test.html                      # Archivo de prueba de Phaser
├── index.html                     # Versión modular (requiere archivos JS)
├── js/                           # Archivos JavaScript modulares
│   ├── main.js                   # Configuración principal
│   └── scenes/                   # Escenas del juego
│       ├── WelcomeScene.js       # Pantalla de bienvenida
│       ├── MonsterSelectScene.js # Selección de monstruo
│       └── GameScene.js          # Escena principal del juego
├── telegram-integration-guide.md # Guía de integración con Telegram
├── deployment-guide.md           # Guía de deployment
├── todo.md                       # Lista de tareas completadas
└── README.md                     # Este archivo
```

## 🎯 Cómo Jugar

1. **Inicio**: Haz clic en "COMENZAR" en la pantalla de bienvenida
2. **Selección**: Elige tu Monymon inicial entre Firemon, Watermon o Leafmon
3. **Exploración**: Usa las flechas del teclado o controles táctiles para moverte
4. **Combate**: Acércate a los NPCs (marcados con "!") para iniciar batallas
5. **Objetivo**: Derrota a todos los Monymon salvajes antes de que se acabe el tiempo
6. **Puntuación**: Gana puntos por victorias y bonificaciones por tiempo restante

## 🔧 Tecnologías Utilizadas

- **Phaser 3.70.0**: Motor de juego HTML5
- **JavaScript ES6+**: Lógica del juego
- **SVG**: Gráficos vectoriales para sprites
- **Telegram WebApp API**: Integración con Telegram
- **CSS3**: Estilos y responsive design

## 📱 Integración con Telegram

El juego está diseñado para funcionar perfectamente dentro de Telegram como WebApp. Incluye:

- Inicialización automática de Telegram WebApp
- Envío de puntuaciones a Telegram
- Adaptación al tema de Telegram (claro/oscuro)
- Funcionalidad de compartir resultados
- Manejo de datos de usuario de Telegram

Para configurar la integración completa, consulta la [Guía de Integración con Telegram](telegram-integration-guide.md).

## 🚀 Deployment

El juego puede desplegarse en múltiples plataformas gratuitas:

### Netlify (Recomendado)
1. Sube los archivos a un repositorio Git
2. Conecta el repositorio con Netlify
3. El deployment es automático con HTTPS incluido

### Vercel
1. Importa el proyecto desde Git
2. Vercel detecta automáticamente la configuración
3. Deployment instantáneo con CDN global

### GitHub Pages
1. Sube los archivos a un repositorio GitHub
2. Habilita GitHub Pages en la configuración
3. Accede via `https://usuario.github.io/repositorio`

Para instrucciones detalladas, consulta la [Guía de Deployment](deployment-guide.md).

## 🎮 Mecánicas del Juego

### Monstruos Disponibles

| Monstruo | Tipo | HP | Ataque | Defensa | Descripción |
|----------|------|----|---------|---------| ------------|
| Firemon | Fuego | 100 | 25 | 15 | Monstruo ardiente con gran poder de ataque |
| Watermon | Agua | 120 | 20 | 20 | Monstruo acuático con buena defensa |
| Leafmon | Planta | 110 | 22 | 18 | Monstruo natural con estadísticas balanceadas |

### Sistema de Puntuación

- **Victoria contra NPC**: +100 puntos
- **Bonus de tiempo**: +10 puntos por segundo restante
- **Completar todos los NPCs**: Bonus adicional
- **Puntuación máxima teórica**: ~2,500 puntos

## 🛠️ Desarrollo

### Requisitos
- Navegador web moderno
- Servidor HTTP local (para desarrollo)
- Editor de código

### Estructura de Escenas
1. **WelcomeScene**: Pantalla de inicio con logo y botón de comenzar
2. **MonsterSelectScene**: Selección de monstruo inicial con estadísticas
3. **GameScene**: Juego principal con mapa, movimiento y combate
4. **GameOverScene**: Pantalla final con estadísticas y opciones

### Personalización
El juego está diseñado para ser fácilmente personalizable:

- **Nuevos Monstruos**: Añade entradas al array `monsters` en `MonsterSelectScene`
- **Mapas**: Modifica la función `createMap()` en `GameScene`
- **Gráficos**: Reemplaza los SVG generados con imágenes personalizadas
- **Mecánicas**: Extiende el sistema de combate en `showBattleSequence()`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la documentación incluida
2. Consulta las guías de integración y deployment
3. Abre un issue en el repositorio

## 🎯 Roadmap Futuro

- [ ] Más tipos de monstruos
- [ ] Sistema de evolución
- [ ] Mapas más grandes con múltiples niveles
- [ ] Modo multijugador
- [ ] Sistema de logros
- [ ] Tienda de objetos
- [ ] Efectos de sonido y música

## 📊 Estadísticas del Proyecto

- **Líneas de código**: ~1,500
- **Archivos**: 8 archivos principales
- **Tamaño total**: ~150KB
- **Tiempo de desarrollo**: Completado según especificaciones
- **Compatibilidad**: Todos los navegadores modernos

---

**¡Disfruta jugando Monymon y conviértete en el mejor entrenador!** 🏆

