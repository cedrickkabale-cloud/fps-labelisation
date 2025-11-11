# Version React + JSON (JS) — Démarrage rapide

But : exécuter l'application sans MySQL, avec backend Node minimal qui stocke en JSON.

Prérequis
- Node.js installé (version 12+)

Démarrage
1. Ouvrez PowerShell dans le dossier `D:\Projet Web\labelisation\server`
2. Installez les dépendances :

```powershell
npm install
```

3. Démarrez le serveur :

```powershell
npm start
```

4. Ouvrez le navigateur : http://localhost:3000

Fonctionnalités
- Login administrateur (simple prompt côté client) : mot de passe par défaut `fps2025`.
- Formulaire vertical avec les 15 rubriques.
- Enregistrement via API POST `/api/equipment` (stockage dans `server/db.json`).
- Génération du QR code et impression d'une étiquette de 6cm x 5cm (impression via CSS `cm` units).

Changer le mot de passe ou améliorer la sécurité
- Cette version est pensée pour un usage local et simple. Le mot de passe est côté client (prompt). Pour production, ajouter système d'authentification côté serveur.

Remplacer le logo
- Placez votre logo `fps-logo.png` dans le dossier `assets` au niveau racine du projet (
`D:\Projet Web\labelisation\assets\fps-logo.png`).

Dépannage
- Si `npm install` échoue, vérifiez que Node.js est correctement installé.
- Si le serveur démarre mais vous avez une erreur réseau lors de l'envoi du formulaire, vérifiez la console du navigateur et le log du serveur.

---
Si vous voulez, je peux :
- Ajouter un bouton d'initialisation DB dans l'interface.
- Remplacer le login prompt par une vraie page login (avec appel serveur).
- Convertir le client pour utiliser un vrai build React (Create React App) si vous préférez travailler avec un projet React classique.
