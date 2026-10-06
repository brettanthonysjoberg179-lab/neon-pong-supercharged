/**
 * Neon Pong - Google Chat Bot
 * 
 * Setup instructions:
 * 1. Go to https://script.google.com and create a new project
 * 2. Paste this entire file into Code.gs
 * 3. Create an HTML file named "Card" (File > New > HTML) and paste the Card HTML below
 * 4. Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the web app URL
 * 6. Go to https://console.cloud.google.com
 * 7. Create a new project (or use existing)
 * 8. Enable "Google Chat API"
 * 9. Configure the Chat app:
 *    - Name: Neon Pong
 *    - Bot avatar: upload an image
 *    - Connection settings: Web app URL (from step 5)
 *    - Permissions: Add yourself
 * 10. Save and publish
 * 11. Open Google Chat, find the bot, and message it!
 */

// ============================================
// MAIN ENTRY POINT - Google Chat calls this
// ============================================

function onMessage(event) {
  return createGameCard();
}

function onCardClick(event) {
  const action = event.common.invokedFunction;
  
  if (action === 'playGame') {
    return openGameDialog();
  }
  
  if (action === 'quickMatch') {
    return openGameDialog('quick');
  }
  
  if (action === 'vsAI') {
    return openGameDialog('ai');
  }
  
  if (action === 'vsComputer') {
    return openGameDialog('ai');
  }
  
  return createGameCard();
}

// ============================================
// CARD BUILDERS
// ============================================

function createGameCard() {
  const card = {
    "header": {
      "title": "Neon Pong Supercharged",
      "subtitle": "2-player pong with tricks, targets, and smashes",
      "imageUrl": "https://img.icons8.com/color/96/ping-pong.png",
      "imageStyle": "IMAGE"
    },
    "sections": [
      {
        "widgets": [
          {
            "textParagraph": {
              "text": "<b>🎮 How to play:</b> Drag your paddle. Hit gold targets, build rallies, land edge/spin/smash tricks, and race to 5 goals!"
            }
          }
        ]
      },
      {
        "widgets": [
          {
            "buttons": [
              {
                "textButton": {
                  "text": "⚡ Quick Match",
                  "onClick": {
                    "action": {
                      "function": "quickMatch"
                    }
                  }
                }
              },
              {
                "textButton": {
                  "text": "🤖 vs Computer",
                  "onClick": {
                    "action": {
                      "function": "vsAI"
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      {
        "widgets": [
          {
            "textParagraph": {
              "text": "<b>🌐 Online Multiplayer:</b> Open the web version to play with a friend:<br><a href='https://neon-pong-online.brettanthonysjoberg179.workers.dev'>Play Online</a>"
            }
          }
        ]
      }
    ]
  };
  
  return { "cardsV2": [ { "card": card } ] };
}

function openGameDialog(mode) {
  const gameUrl = 'https://neon-pong-online.brettanthonysjoberg179.workers.dev/client.html';
  
  const dialog = {
    "action": {
      "navigations": [
        {
          "pushCard": {
            "header": {
              "title": "Neon Pong"
            },
            "sections": [
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "Loading game..."
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    }
  };
  
  // Google Chat doesn't support iframes in cards directly
  // So we open the game in a new tab via a link
  const card = {
    "header": {
      "title": "Neon Pong Supercharged",
      "subtitle": "Game starting..."
    },
    "sections": [
      {
        "widgets": [
          {
            "textParagraph": {
              "text": "Click below to play!"
            }
          },
          {
            "buttons": [
              {
                "textButton": {
                  "text": "🎮 Play Neon Pong",
                  "onClick": {
                    "openLink": {
                      "url": gameUrl
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  };
  
  return { "cardsV2": [ { "card": card } ] };
}

// ============================================
// WEB APP ENDPOINT (for testing)
// ============================================

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Card')
    .setTitle('Neon Pong')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ============================================
// CARD HTML (for web app preview)
// ============================================

/*
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <style>
    body { font-family: system-ui, sans-serif; background: #070b1a; color: #e8f0ff; padding: 20px; }
    h1 { background: linear-gradient(90deg, #22d3ee, #f472b6); -webkit-background-clip: text; background-clip: text; color: transparent; }
    button { display: block; width: 100%; margin: 8px 0; padding: 13px; border: 0; border-radius: 12px; background: #111936; color: #e8f0ff; font-size: 16px; font-weight: 700; border: 2px solid #2c3a78; cursor: pointer; }
    button:active { transform: scale(.97); border-color: #22d3ee; }
    a { color: #22d3ee; }
  </style>
</head>
<body>
  <h1>NEON PONG</h1>
  <p>Supercharged 2-player pong. One phone, two thumbs.</p>
  <p><b>How to play:</b> Drag your paddle. Hit gold targets, build rallies (x2 at 5, x3 at 10, x4 at 20), land edge, spin and smash tricks, and race to finish tasks.</p>
  <button onclick="window.open('https://neon-pong-online.brettanthonysjoberg179.workers.dev/client.html')">🎮 Play Online</button>
  <button onclick="window.open('https://neon-pong-online.brettanthonysjoberg179.workers.dev/client.html?mode=ai')">🤖 vs Computer</button>
  <p>Share with friends: <a href="https://neon-pong-online.brettanthonysjoberg179.workers.dev">Open in browser</a></p>
</body>
</html>
*/
