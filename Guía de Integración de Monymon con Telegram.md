# Guía de Integración de Monymon con Telegram

## Introducción

Esta guía técnica proporciona instrucciones detalladas para integrar el juego Monymon con la plataforma de Telegram utilizando la API de Game Bot. La integración permitirá a los usuarios jugar directamente desde Telegram, compartir puntuaciones y competir en tablas de clasificación.

## Tabla de Contenidos

1. [Configuración del Bot en Telegram](#configuración-del-bot-en-telegram)
2. [Registro del Juego con @BotFather](#registro-del-juego-con-botfather)
3. [Configuración del Servidor Backend](#configuración-del-servidor-backend)
4. [Implementación de APIs de Puntuación](#implementación-de-apis-de-puntuación)
5. [Integración del Frontend](#integración-del-frontend)
6. [Ejemplos de Código](#ejemplos-de-código)
7. [Pruebas y Depuración](#pruebas-y-depuración)
8. [Consideraciones de Seguridad](#consideraciones-de-seguridad)




## Configuración del Bot en Telegram

La integración de Monymon con Telegram comienza con la creación y configuración de un bot específicamente diseñado para manejar juegos. Telegram proporciona una plataforma robusta para bots que pueden interactuar con usuarios, manejar comandos y gestionar datos de juegos de manera segura y eficiente.

### Paso 1: Crear un Nuevo Bot

Para crear un bot en Telegram, necesitas interactuar con @BotFather, que es el bot oficial de Telegram para gestionar otros bots. Este proceso es fundamental para establecer la identidad digital de tu juego dentro del ecosistema de Telegram.

1. **Iniciar conversación con @BotFather**: Abre Telegram y busca @BotFather. Inicia una conversación enviando el comando `/start`.

2. **Crear el bot**: Envía el comando `/newbot` para iniciar el proceso de creación. @BotFather te guiará a través de los siguientes pasos:
   - **Nombre del bot**: Elige un nombre descriptivo como "Monymon Game Bot"
   - **Username del bot**: Debe terminar en "bot" y ser único, por ejemplo: "monymon_game_bot"

3. **Obtener el token**: Una vez creado, @BotFather te proporcionará un token único que se ve así: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`. Este token es crucial para todas las interacciones con la API de Telegram.

### Paso 2: Configurar Comandos Básicos

Los comandos básicos permiten a los usuarios interactuar con tu bot de manera intuitiva. Configura estos comandos enviando `/setcommands` a @BotFather:

```
start - Iniciar el bot y mostrar información del juego
play - Jugar Monymon
scores - Ver tabla de puntuaciones
help - Mostrar ayuda y comandos disponibles
```

### Paso 3: Configurar Descripción y Foto

Una descripción clara y una imagen atractiva ayudan a los usuarios a entender qué hace tu bot:

- **Descripción**: Usa `/setdescription` para añadir: "¡Juega Monymon, un emocionante juego RPG donde capturas y entrenas criaturas mágicas! Compite con amigos y sube en la tabla de clasificación."
- **Foto de perfil**: Usa `/setuserpic` para subir una imagen representativa del juego.

## Registro del Juego con @BotFather

El registro del juego es un proceso específico que permite a Telegram reconocer tu aplicación como un juego válido y habilitar funcionalidades especiales como puntuaciones y tablas de clasificación.

### Proceso de Registro del Juego

1. **Iniciar registro**: Envía `/newgame` a @BotFather y selecciona tu bot de la lista.

2. **Configurar información del juego**:
   - **Título**: "Monymon"
   - **Descripción**: "Un juego RPG donde entrenas criaturas mágicas llamadas Monymon. Explora mapas, lucha contra NPCs y conviértete en el mejor entrenador."
   - **Foto**: Sube una imagen de 512x512 píxeles que represente el juego
   - **Animación GIF** (opcional): Un GIF que muestre gameplay

3. **URL del juego**: Proporciona la URL donde está alojado tu juego. Debe ser HTTPS y accesible públicamente.

### Configuración de Puntuaciones

Para habilitar el sistema de puntuaciones, necesitas configurar varios parámetros importantes:

- **Inline mode**: Habilita el modo inline enviando `/setinline` a @BotFather
- **Placeholder**: Configura un texto de ayuda como "Escribe para buscar juegos..."
- **Game short name**: Un identificador corto para tu juego, como "monymon"

## Configuración del Servidor Backend

El backend es esencial para manejar la lógica del juego, almacenar puntuaciones y comunicarse con la API de Telegram de manera segura. Implementaremos un servidor usando Python y Flask que maneje todas las operaciones relacionadas con el juego.

### Estructura del Proyecto Backend

```
monymon-backend/
├── app.py                 # Aplicación principal Flask
├── config.py             # Configuración y variables de entorno
├── models.py             # Modelos de base de datos
├── telegram_api.py       # Funciones para interactuar con Telegram API
├── game_logic.py         # Lógica específica del juego
├── requirements.txt      # Dependencias de Python
└── database.db          # Base de datos SQLite (se crea automáticamente)
```

### Configuración de Variables de Entorno

Crea un archivo `.env` para almacenar información sensible:

```env
TELEGRAM_BOT_TOKEN=tu_token_aqui
GAME_SHORT_NAME=monymon
SECRET_KEY=tu_clave_secreta_para_flask
DATABASE_URL=sqlite:///database.db
WEBHOOK_URL=https://tu-dominio.com/webhook
```

### Dependencias Requeridas

El archivo `requirements.txt` debe incluir:

```
Flask==2.3.3
requests==2.31.0
python-dotenv==1.0.0
SQLAlchemy==2.0.21
Flask-SQLAlchemy==3.0.5
cryptography==41.0.4
```

## Implementación de APIs de Puntuación

Las APIs de puntuación son el corazón de la integración con Telegram. Permiten enviar, actualizar y recuperar puntuaciones de manera segura y eficiente.

### API de Telegram para Juegos

Telegram proporciona varias APIs específicas para juegos:

1. **sendGame**: Envía un mensaje de juego a un chat
2. **setGameScore**: Establece la puntuación de un usuario
3. **getGameHighScores**: Obtiene las mejores puntuaciones

### Implementación de setGameScore

Esta función es crucial para actualizar las puntuaciones de los usuarios:

```python
import requests
import json
from config import TELEGRAM_BOT_TOKEN

def set_game_score(user_id, score, chat_id=None, message_id=None, inline_message_id=None, force=False):
    """
    Establece la puntuación de un usuario en el juego.
    
    Args:
        user_id (int): ID del usuario de Telegram
        score (int): Puntuación a establecer
        chat_id (int, optional): ID del chat
        message_id (int, optional): ID del mensaje
        inline_message_id (str, optional): ID del mensaje inline
        force (bool): Si True, actualiza la puntuación incluso si es menor
    
    Returns:
        dict: Respuesta de la API de Telegram
    """
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/setGameScore"
    
    data = {
        'user_id': user_id,
        'score': score,
        'force': force
    }
    
    if inline_message_id:
        data['inline_message_id'] = inline_message_id
    else:
        data['chat_id'] = chat_id
        data['message_id'] = message_id
    
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error al establecer puntuación: {e}")
        return None
```

### Implementación de getGameHighScores

Esta función recupera las mejores puntuaciones:

```python
def get_game_high_scores(user_id, chat_id=None, message_id=None, inline_message_id=None):
    """
    Obtiene las mejores puntuaciones del juego.
    
    Args:
        user_id (int): ID del usuario de Telegram
        chat_id (int, optional): ID del chat
        message_id (int, optional): ID del mensaje
        inline_message_id (str, optional): ID del mensaje inline
    
    Returns:
        list: Lista de puntuaciones ordenadas
    """
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getGameHighScores"
    
    data = {'user_id': user_id}
    
    if inline_message_id:
        data['inline_message_id'] = inline_message_id
    else:
        data['chat_id'] = chat_id
        data['message_id'] = message_id
    
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
        result = response.json()
        return result.get('result', [])
    except requests.exceptions.RequestException as e:
        print(f"Error al obtener puntuaciones: {e}")
        return []
```

### Base de Datos para Puntuaciones Locales

Además de usar la API de Telegram, es recomendable mantener una base de datos local para análisis y funcionalidades adicionales:

```python
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class GameScore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String(100))
    score = db.Column(db.Integer, nullable=False)
    monster_used = db.Column(db.String(50))
    monsters_defeated = db.Column(db.Integer, default=0)
    game_duration = db.Column(db.Integer)  # en segundos
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'username': self.username,
            'score': self.score,
            'monster_used': self.monster_used,
            'monsters_defeated': self.monsters_defeated,
            'game_duration': self.game_duration,
            'timestamp': self.timestamp.isoformat()
        }
```

## Integración del Frontend

La integración del frontend requiere modificaciones específicas en el código JavaScript del juego para comunicarse con Telegram y manejar los datos del usuario de manera apropiada.

### Inicialización de Telegram WebApp

El primer paso es inicializar la WebApp de Telegram y obtener información del usuario:

```javascript
// Inicializar Telegram WebApp
let tg = window.Telegram?.WebApp;
let user = null;

if (tg) {
    tg.ready();
    tg.expand();
    user = tg.initDataUnsafe?.user;
    
    // Configurar tema según Telegram
    if (tg.colorScheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Configurar botón principal
    tg.MainButton.text = "COMPARTIR PUNTUACIÓN";
    tg.MainButton.color = "#3498db";
}
```

### Envío de Datos a Telegram

Cuando el juego termina, necesitas enviar los datos de puntuación:

```javascript
function sendGameData(gameData) {
    if (tg && tg.sendData) {
        const data = {
            action: 'game_finished',
            score: gameData.score,
            monster_used: gameData.selectedMonster.name,
            monsters_defeated: gameData.monstersDefeated,
            game_duration: Math.floor((Date.now() - gameData.gameStartTime) / 1000),
            user_id: user?.id,
            username: user?.username
        };
        
        tg.sendData(JSON.stringify(data));
    }
}
```

### Manejo de Eventos de Telegram

Configura manejadores para eventos específicos de Telegram:

```javascript
// Manejar cierre de la WebApp
tg.onEvent('mainButtonClicked', function() {
    shareScore();
});

// Manejar cambios de tema
tg.onEvent('themeChanged', function() {
    updateGameTheme();
});

// Manejar eventos del viewport
tg.onEvent('viewportChanged', function() {
    resizeGame();
});
```

## Ejemplos de Código

### Servidor Flask Completo

```python
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import requests
import json
import os
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///monymon.db'
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key')

db = SQLAlchemy(app)

TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
GAME_SHORT_NAME = 'monymon'

class GameScore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String(100))
    score = db.Column(db.Integer, nullable=False)
    monster_used = db.Column(db.String(50))
    monsters_defeated = db.Column(db.Integer, default=0)
    game_duration = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

@app.route('/webhook', methods=['POST'])
def webhook():
    """Maneja webhooks de Telegram"""
    data = request.get_json()
    
    if 'callback_query' in data:
        handle_callback_query(data['callback_query'])
    elif 'message' in data:
        handle_message(data['message'])
    
    return jsonify({'ok': True})

@app.route('/game')
def serve_game():
    """Sirve el juego HTML"""
    return send_from_directory('.', 'monymon-complete.html')

@app.route('/api/score', methods=['POST'])
def submit_score():
    """Recibe y procesa puntuaciones del juego"""
    data = request.get_json()
    
    # Validar datos
    required_fields = ['user_id', 'score', 'monster_used']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Datos incompletos'}), 400
    
    # Guardar en base de datos local
    score_record = GameScore(
        user_id=data['user_id'],
        username=data.get('username'),
        score=data['score'],
        monster_used=data['monster_used'],
        monsters_defeated=data.get('monsters_defeated', 0),
        game_duration=data.get('game_duration', 0)
    )
    
    db.session.add(score_record)
    db.session.commit()
    
    # Enviar a Telegram
    telegram_response = set_game_score(
        user_id=data['user_id'],
        score=data['score'],
        inline_message_id=data.get('inline_message_id')
    )
    
    return jsonify({
        'success': True,
        'telegram_response': telegram_response
    })

def handle_callback_query(callback_query):
    """Maneja queries de callback de botones inline"""
    if callback_query.get('game_short_name') == GAME_SHORT_NAME:
        # Usuario quiere jugar
        answer_callback_query(
            callback_query['id'],
            url=f"https://tu-dominio.com/game"
        )

def answer_callback_query(callback_query_id, text=None, url=None):
    """Responde a un callback query"""
    url_api = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/answerCallbackQuery"
    
    data = {'callback_query_id': callback_query_id}
    if text:
        data['text'] = text
    if url:
        data['url'] = url
    
    requests.post(url_api, json=data)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
```

### Comandos cURL para Pruebas

```bash
# Enviar un juego a un chat
curl -X POST "https://api.telegram.org/bot<TOKEN>/sendGame" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "@tu_canal",
    "game_short_name": "monymon"
  }'

# Establecer puntuación
curl -X POST "https://api.telegram.org/bot<TOKEN>/setGameScore" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 123456789,
    "score": 1500,
    "chat_id": "@tu_canal",
    "message_id": 123
  }'

# Obtener mejores puntuaciones
curl -X POST "https://api.telegram.org/bot<TOKEN>/getGameHighScores" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 123456789,
    "chat_id": "@tu_canal",
    "message_id": 123
  }'
```

## Pruebas y Depuración

### Configuración de Entorno de Desarrollo

Para probar la integración localmente, necesitas configurar un túnel HTTPS ya que Telegram requiere conexiones seguras:

1. **Usar ngrok**: Instala ngrok y ejecuta `ngrok http 5000` para exponer tu servidor local
2. **Configurar webhook**: Usa la URL de ngrok para configurar el webhook en Telegram
3. **Variables de entorno**: Asegúrate de que todas las variables estén configuradas correctamente

### Herramientas de Depuración

```python
import logging

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@app.route('/debug/scores')
def debug_scores():
    """Endpoint para depurar puntuaciones"""
    scores = GameScore.query.order_by(GameScore.score.desc()).limit(10).all()
    return jsonify([score.to_dict() for score in scores])
```

### Validación de Datos de Telegram

```python
import hashlib
import hmac
from urllib.parse import parse_qsl

def validate_telegram_data(init_data, bot_token):
    """Valida que los datos vengan realmente de Telegram"""
    try:
        parsed_data = dict(parse_qsl(init_data))
        hash_value = parsed_data.pop('hash', '')
        
        data_check_string = '\n'.join([f"{k}={v}" for k, v in sorted(parsed_data.items())])
        secret_key = hmac.new(bot_token.encode(), b"WebAppData", hashlib.sha256).digest()
        calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
        
        return calculated_hash == hash_value
    except Exception as e:
        logger.error(f"Error validando datos de Telegram: {e}")
        return False
```

## Consideraciones de Seguridad

### Validación de Datos

Siempre valida los datos que recibes del frontend antes de procesarlos:

```python
def validate_score_data(data):
    """Valida datos de puntuación"""
    if not isinstance(data.get('score'), int) or data['score'] < 0:
        return False, "Puntuación inválida"
    
    if data['score'] > 10000:  # Puntuación máxima teórica
        return False, "Puntuación demasiado alta"
    
    valid_monsters = ['firemon', 'watermon', 'leafmon']
    if data.get('monster_used') not in valid_monsters:
        return False, "Monstruo inválido"
    
    return True, "Válido"
```

### Protección contra Spam

Implementa límites de velocidad para prevenir spam:

```python
from functools import wraps
from time import time

user_last_submission = {}

def rate_limit(max_per_minute=5):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = request.json.get('user_id')
            now = time()
            
            if user_id in user_last_submission:
                time_diff = now - user_last_submission[user_id]
                if time_diff < 60 / max_per_minute:
                    return jsonify({'error': 'Demasiadas solicitudes'}), 429
            
            user_last_submission[user_id] = now
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route('/api/score', methods=['POST'])
@rate_limit(max_per_minute=3)
def submit_score():
    # ... código anterior
```

### Encriptación de Datos Sensibles

Para datos sensibles, considera usar encriptación:

```python
from cryptography.fernet import Fernet
import os

# Generar clave de encriptación
encryption_key = os.getenv('ENCRYPTION_KEY', Fernet.generate_key())
cipher_suite = Fernet(encryption_key)

def encrypt_data(data):
    """Encripta datos sensibles"""
    return cipher_suite.encrypt(json.dumps(data).encode())

def decrypt_data(encrypted_data):
    """Desencripta datos"""
    return json.loads(cipher_suite.decrypt(encrypted_data).decode())
```

Esta guía proporciona una base sólida para integrar Monymon con Telegram. La implementación completa requiere atención cuidadosa a los detalles de seguridad, manejo de errores robusto y pruebas exhaustivas en diferentes escenarios de uso.

