# WhatsApp Bot Website

Eine professionelle Website mit Live-Status-Dashboard für den WhatsApp Bot.

## Features

- 🟢 **Live Bot Status** - Zeigt an, ob der Bot online oder offline ist
- 📊 **Echtzeit-Statistiken** - Benutzer, Gruppen und Pets werden live angezeigt
- 📱 **WhatsApp Integration** - Direkter Link zum Bot (+1 636 228-9238)
- 🎨 **Responsive Design** - Funktioniert auf Desktop und Mobile
- ⚡ **Auto-Refresh** - Status wird alle 30 Sekunden aktualisiert
- 🌟 **Feature-Showcase** - Übersicht aller Bot-Features
- 📋 **Command-Dokumentation** - Beliebte Befehle mit Beispielen

## Verwendung

### Server starten

```bash
# Nur Website Server
node api/server.js

# Oder beide Server (Bot + Website)
start_all.bat
```

### Website öffnen

Öffne http://localhost:3001 in deinem Browser

## API Endpoints

- `GET /api/status` - Bot Status abrufen
- `POST /api/status` - Bot Status aktualisieren (vom Bot verwendet)

## Dateien

- `index.html` - Haupt-Website
- `style.css` - Styling und Animationen
- `script.js` - JavaScript für Live-Updates
- `../api/server.js` - Express API Server

## Integration

Der Bot sendet automatisch alle 30 Sekunden seinen Status an die API:
- Online/Offline Status
- Anzahl registrierte Benutzer
- Anzahl Gruppen
- Anzahl Pets
- Uptime

Die Website aktualisiert diese Daten automatisch und zeigt sie in Echtzeit an.