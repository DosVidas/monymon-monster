# Guía de Deployment y Publicación de Monymon

## Introducción

Esta guía proporciona instrucciones detalladas para publicar el juego Monymon en plataformas de hosting gratuito con soporte HTTPS, optimización para dispositivos móviles y configuración para integración con Telegram. El deployment correcto es crucial para garantizar que el juego funcione de manera óptima en el entorno de Telegram WebApp.

## Tabla de Contenidos

1. [Preparación para el Deployment](#preparación-para-el-deployment)
2. [Opciones de Hosting Gratuito](#opciones-de-hosting-gratuito)
3. [Deployment en Netlify](#deployment-en-netlify)
4. [Deployment en Vercel](#deployment-en-vercel)
5. [Optimización para Móviles](#optimización-para-móviles)
6. [Configuración HTTPS](#configuración-https)
7. [Testing y Validación](#testing-y-validación)
8. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)

## Preparación para el Deployment

Antes de proceder con el deployment, es esencial preparar todos los archivos y configuraciones necesarias para garantizar un funcionamiento óptimo del juego en producción.

### Estructura de Archivos Final

La estructura de archivos para deployment debe estar organizada de la siguiente manera:

```
monymon-game/
├── index.html                    # Archivo principal del juego
├── monymon-complete.html         # Versión completa con todas las funcionalidades
├── assets/                       # Recursos del juego
│   ├── images/                   # Imágenes y sprites
│   └── sounds/                   # Archivos de audio (opcional)
├── js/                          # Archivos JavaScript (si están separados)
│   ├── scenes/
│   └── main.js
├── css/                         # Estilos adicionales
│   └── styles.css
├── _redirects                   # Configuración de redirects para Netlify
├── netlify.toml                 # Configuración específica de Netlify
├── vercel.json                  # Configuración específica de Vercel
└── README.md                    # Documentación del proyecto
```

### Optimización de Archivos

Para garantizar tiempos de carga rápidos, especialmente importante en dispositivos móviles, es necesario optimizar todos los recursos:

**Minificación de JavaScript**: Aunque el juego está en un solo archivo HTML, puedes extraer el JavaScript y minificarlo usando herramientas como UglifyJS o Terser.

**Optimización de Imágenes**: Las imágenes SVG generadas dinámicamente ya están optimizadas, pero si añades imágenes adicionales, usa formatos WebP para mejor compresión.

**Compresión Gzip**: Las plataformas de hosting modernas habilitan automáticamente la compresión Gzip, pero es importante verificar que esté activa.

### Configuración de Variables de Entorno

Para el deployment en producción, crea archivos de configuración que manejen diferentes entornos:

```javascript
// config.js
const config = {
  development: {
    apiUrl: 'http://localhost:5000',
    telegramBotToken: 'DEV_TOKEN',
    debug: true
  },
  production: {
    apiUrl: 'https://tu-api.herokuapp.com',
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    debug: false
  }
};

const currentConfig = config[process.env.NODE_ENV || 'development'];
```

## Opciones de Hosting Gratuito

Existen múltiples opciones de hosting gratuito que proporcionan HTTPS automático y son ideales para juegos HTML5. Las más recomendadas para Monymon son:

### Netlify

Netlify es una plataforma de deployment que se especializa en sitios estáticos y aplicaciones Jamstack. Ofrece características excepcionales para juegos web:

**Ventajas de Netlify**:
- HTTPS automático con certificados SSL gratuitos
- CDN global para tiempos de carga rápidos
- Deployment automático desde Git
- Funciones serverless para backend simple
- Redirects y rewrites configurables
- Formularios integrados para feedback
- Analytics básicos incluidos

**Limitaciones del Plan Gratuito**:
- 100 GB de ancho de banda por mes
- 300 minutos de build time
- 125,000 funciones serverless por mes

### Vercel

Vercel es otra plataforma líder en deployment de aplicaciones frontend, especialmente optimizada para frameworks modernos:

**Ventajas de Vercel**:
- Deployment instantáneo con Git
- Edge Network global
- HTTPS automático
- Funciones serverless con soporte para múltiples lenguajes
- Preview deployments automáticos
- Analytics avanzados
- Integración excelente con frameworks JavaScript

**Limitaciones del Plan Gratuito**:
- 100 GB de ancho de banda por mes
- 100 GB-hours de función serverless
- 6,000 minutos de build time

### GitHub Pages

GitHub Pages es una opción simple y directa para hosting estático:

**Ventajas**:
- Integración directa con repositorios GitHub
- HTTPS automático
- Completamente gratuito
- Ideal para proyectos open source

**Limitaciones**:
- Solo sitios estáticos
- Sin funciones serverless
- Límite de 1 GB de almacenamiento
- 100 GB de ancho de banda por mes

### Cloudflare Pages

Cloudflare Pages combina hosting estático con la potente red de Cloudflare:

**Ventajas**:
- CDN global de Cloudflare
- HTTPS automático
- Workers para funciones serverless
- Analytics detallados
- Protección DDoS incluida

**Limitaciones del Plan Gratuito**:
- 500 builds por mes
- 20,000 archivos por sitio
- 25 MB por archivo

## Deployment en Netlify

Netlify ofrece múltiples métodos de deployment. El más recomendado para Monymon es el deployment automático desde un repositorio Git.

### Método 1: Deployment desde Git

1. **Preparar el Repositorio**: Sube todos los archivos del juego a un repositorio en GitHub, GitLab o Bitbucket.

2. **Conectar con Netlify**:
   - Regístrate en [netlify.com](https://netlify.com)
   - Haz clic en "New site from Git"
   - Autoriza la conexión con tu proveedor Git
   - Selecciona el repositorio de Monymon

3. **Configurar Build Settings**:
   ```
   Build command: (dejar vacío para sitios estáticos)
   Publish directory: . (directorio raíz)
   ```

4. **Variables de Entorno**: En la configuración del sitio, añade las variables necesarias:
   ```
   TELEGRAM_BOT_TOKEN=tu_token_aqui
   NODE_ENV=production
   ```

### Método 2: Deployment Manual

Para deployment rápido sin Git:

1. **Preparar Archivos**: Comprime todos los archivos en un ZIP
2. **Drag & Drop**: Arrastra el archivo ZIP al área de deployment de Netlify
3. **Configurar Dominio**: Netlify asignará automáticamente un subdominio

### Configuración Avanzada de Netlify

Crea un archivo `netlify.toml` en la raíz del proyecto para configuraciones avanzadas:

```toml
[build]
  publish = "."
  command = ""

[build.environment]
  NODE_ENV = "production"

[[redirects]]
  from = "/api/*"
  to = "https://tu-backend.herokuapp.com/api/:splat"
  status = 200
  force = true

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[context.production.environment]
  TELEGRAM_BOT_TOKEN = "tu_token_de_produccion"

[context.deploy-preview.environment]
  TELEGRAM_BOT_TOKEN = "tu_token_de_testing"
```

### Configuración de Dominio Personalizado

Si tienes un dominio propio:

1. **Añadir Dominio**: En la configuración del sitio, ve a "Domain management"
2. **Configurar DNS**: Apunta tu dominio a Netlify usando:
   - CNAME record: `tu-dominio.com` → `tu-sitio.netlify.app`
   - O A record: `tu-dominio.com` → IP de Netlify
3. **SSL Automático**: Netlify configurará automáticamente HTTPS

## Deployment en Vercel

Vercel ofrece una experiencia de deployment extremadamente fluida, especialmente para aplicaciones JavaScript modernas.

### Deployment desde Git

1. **Preparar Repositorio**: Asegúrate de que tu código esté en GitHub, GitLab o Bitbucket

2. **Importar Proyecto**:
   - Ve a [vercel.com](https://vercel.com) y regístrate
   - Haz clic en "New Project"
   - Importa tu repositorio de Monymon

3. **Configuración Automática**: Vercel detectará automáticamente que es un sitio estático

4. **Variables de Entorno**: Añade las variables necesarias en la configuración del proyecto

### Configuración con vercel.json

Crea un archivo `vercel.json` para configuraciones específicas:

```json
{
  "version": 2,
  "name": "monymon-game",
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://tu-backend.herokuapp.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ],
  "env": {
    "TELEGRAM_BOT_TOKEN": "@telegram_bot_token"
  }
}
```

### Deployment con Vercel CLI

Para desarrolladores que prefieren la línea de comandos:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Inicializar proyecto
vercel

# Configurar variables de entorno
vercel env add TELEGRAM_BOT_TOKEN

# Deployment
vercel --prod
```

### Preview Deployments

Una característica poderosa de Vercel son los preview deployments automáticos:

- Cada push a una rama crea un deployment de preview
- URL única para testing
- Ideal para probar cambios antes de producción
- Comentarios automáticos en pull requests

## Optimización para Móviles

La optimización para dispositivos móviles es crucial para Monymon, ya que la mayoría de usuarios de Telegram acceden desde móviles.

### Responsive Design

El juego ya incluye configuración responsive en Phaser, pero es importante verificar que funcione correctamente:

```javascript
// Configuración responsive mejorada
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 320,
      height: 240
    },
    max: {
      width: 1024,
      height: 768
    }
  },
  // Configuración específica para móviles
  input: {
    touch: {
      capture: false
    }
  }
};
```

### Optimización de Performance

Para dispositivos móviles con recursos limitados:

```javascript
// Detectar dispositivo móvil
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Ajustar configuración según dispositivo
const gameConfig = {
  ...baseConfig,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
      // Reducir precisión en móviles para mejor performance
      fps: isMobile ? 30 : 60
    }
  }
};
```

### Controles Táctiles

Implementar controles táctiles intuitivos:

```javascript
// Controles táctiles mejorados
createTouchControls() {
  if (!this.sys.game.device.input.touch) return;
  
  const buttonSize = 60;
  const buttonSpacing = 80;
  const baseX = this.cameras.main.width - 150;
  const baseY = this.cameras.main.height - 150;
  
  // Crear zona de movimiento virtual
  const joystickZone = this.add.circle(baseX, baseY, 80, 0x000000, 0.3);
  const joystickKnob = this.add.circle(baseX, baseY, 30, 0x3498db, 0.8);
  
  joystickZone.setInteractive();
  joystickKnob.setInteractive({ draggable: true });
  
  // Implementar lógica de joystick virtual
  this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    if (gameObject === joystickKnob) {
      const distance = Phaser.Math.Distance.Between(baseX, baseY, dragX, dragY);
      if (distance <= 80) {
        joystickKnob.x = dragX;
        joystickKnob.y = dragY;
      } else {
        const angle = Phaser.Math.Angle.Between(baseX, baseY, dragX, dragY);
        joystickKnob.x = baseX + Math.cos(angle) * 80;
        joystickKnob.y = baseY + Math.sin(angle) * 80;
      }
      
      // Calcular velocidad basada en posición del joystick
      const velocityX = (joystickKnob.x - baseX) * 2;
      const velocityY = (joystickKnob.y - baseY) * 2;
      
      this.player.setVelocity(velocityX, velocityY);
    }
  });
}
```

### Viewport Meta Tag

Asegúrate de que el HTML incluya el meta tag correcto para móviles:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no">
```

### CSS para Móviles

Añade estilos específicos para dispositivos móviles:

```css
/* Prevenir zoom en inputs */
input, select, textarea {
  font-size: 16px;
}

/* Ocultar scrollbars en móviles */
body {
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
}

/* Optimizar para pantallas táctiles */
button, .interactive {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;
}

/* Media queries para diferentes tamaños */
@media (max-width: 768px) {
  #game-container {
    width: 100vw;
    height: 100vh;
    border: none;
    border-radius: 0;
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  #game-container {
    height: 100vh;
  }
}
```

## Configuración HTTPS

HTTPS es obligatorio para Telegram WebApps. Afortunadamente, tanto Netlify como Vercel proporcionan HTTPS automático.

### Verificación de HTTPS

Después del deployment, verifica que HTTPS esté funcionando correctamente:

1. **Acceder via HTTPS**: Asegúrate de que `https://tu-sitio.netlify.app` funcione
2. **Verificar Certificado**: Haz clic en el candado del navegador para verificar el certificado SSL
3. **Testing de Mixed Content**: Asegúrate de que no haya recursos HTTP en una página HTTPS

### Configuración de Security Headers

Añade headers de seguridad para proteger el juego:

```javascript
// En netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://telegram.org; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.telegram.org;"
```

### Redirección HTTP a HTTPS

Configura redirecciones automáticas:

```toml
# En netlify.toml
[[redirects]]
  from = "http://tu-dominio.com/*"
  to = "https://tu-dominio.com/:splat"
  status = 301
  force = true
```

## Testing y Validación

Antes de lanzar el juego oficialmente, es crucial realizar pruebas exhaustivas en diferentes dispositivos y condiciones.

### Testing en Dispositivos Reales

1. **Dispositivos iOS**: Prueba en iPhone y iPad con diferentes versiones de iOS
2. **Dispositivos Android**: Prueba en diferentes marcas y versiones de Android
3. **Diferentes Navegadores**: Chrome, Safari, Firefox, Samsung Internet

### Testing de Performance

Usa herramientas de desarrollo para medir performance:

```javascript
// Monitoreo de FPS
let fpsCounter = 0;
let lastTime = performance.now();

function updateFPS() {
  const currentTime = performance.now();
  fpsCounter++;
  
  if (currentTime - lastTime >= 1000) {
    console.log(`FPS: ${fpsCounter}`);
    fpsCounter = 0;
    lastTime = currentTime;
  }
  
  requestAnimationFrame(updateFPS);
}

updateFPS();
```

### Testing de Integración con Telegram

1. **WebApp Testing**: Usa el bot de testing de Telegram para probar la integración
2. **Datos de Usuario**: Verifica que los datos del usuario se reciban correctamente
3. **Envío de Puntuaciones**: Confirma que las puntuaciones se envíen a Telegram
4. **Compartir**: Prueba la funcionalidad de compartir puntuaciones

### Herramientas de Testing

- **Lighthouse**: Para auditorías de performance y accesibilidad
- **WebPageTest**: Para testing de velocidad de carga
- **BrowserStack**: Para testing en múltiples dispositivos
- **Telegram Bot API Testing**: Para verificar la integración

## Monitoreo y Mantenimiento

Una vez desplegado, es importante monitorear el rendimiento y mantener el juego actualizado.

### Analytics y Monitoreo

Implementa analytics para entender el uso del juego:

```javascript
// Google Analytics 4
gtag('config', 'GA_MEASUREMENT_ID', {
  custom_map: {
    'custom_parameter_1': 'monster_selected',
    'custom_parameter_2': 'final_score'
  }
});

// Eventos personalizados
function trackGameEvent(eventName, parameters) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, parameters);
  }
}

// Uso en el juego
trackGameEvent('monster_selected', {
  monster_name: selectedMonster.name,
  monster_type: selectedMonster.type
});

trackGameEvent('game_completed', {
  final_score: gameData.score,
  monsters_defeated: gameData.monstersDefeated,
  game_duration: gameDuration
});
```

### Error Tracking

Implementa tracking de errores para identificar problemas:

```javascript
// Error tracking simple
window.addEventListener('error', function(e) {
  console.error('Error del juego:', e.error);
  
  // Enviar error a servicio de tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: e.error.message,
      fatal: false
    });
  }
});

// Error tracking para Phaser
const game = new Phaser.Game(config);

game.events.on('error', function(error) {
  console.error('Error de Phaser:', error);
});
```

### Actualizaciones y Mantenimiento

Establece un proceso para actualizaciones regulares:

1. **Versionado**: Usa semantic versioning para releases
2. **Changelog**: Mantén un registro de cambios
3. **Testing**: Prueba todas las actualizaciones antes del deployment
4. **Rollback**: Ten un plan para revertir cambios si es necesario

### Backup y Recuperación

Aunque el código esté en Git, considera backups adicionales:

- **Configuraciones**: Backup de variables de entorno y configuraciones
- **Analytics**: Exporta datos de analytics regularmente
- **Documentación**: Mantén documentación actualizada

Esta guía proporciona una base sólida para el deployment y mantenimiento de Monymon. La clave del éxito está en la preparación cuidadosa, testing exhaustivo y monitoreo continuo del rendimiento del juego en producción.

