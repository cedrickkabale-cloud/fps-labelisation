# Guide de déploiement - FPS Labelisation

## Étape 1 : Créer le dépôt GitHub

1. Va sur https://github.com/new
2. Nom du dépôt : **fps-labelisation**
3. Description : FPS Equipment Management System
4. Choisis Public ou Private
5. **NE coche RIEN** (pas de README, etc.)
6. Clique "Create repository"

## Étape 2 : Pousser le code (exécute ces commandes dans PowerShell)

```powershell
cd "d:\Projet Web\labelisation"
git remote set-url origin https://github.com/cedrickkabale-cloud/fps-labelisation.git
git push -u origin main
```

Si demandé, entre tes identifiants GitHub.

## Étape 3 : Déployer sur Render

1. Va sur https://render.com et inscris-toi (avec GitHub)
2. Clique "New +" → "Web Service"
3. Connecte ton compte GitHub
4. Sélectionne le dépôt **fps-labelisation**
5. Configure :
   - **Name** : fps-labelisation
   - **Environment** : Node
   - **Build Command** : `cd server && npm install`
   - **Start Command** : `cd server && npm start`
   - **Instance Type** : Free
6. Clique "Create Web Service"

## Étape 4 : Attendre le déploiement

Render va automatiquement :
- Installer les dépendances
- Démarrer le serveur
- Te donner une URL publique (ex: https://fps-labelisation.onrender.com)

## En cas de problème

Si le push ne fonctionne pas, il faut peut-être authentifier Git avec GitHub :
```powershell
git config --global credential.helper wincred
```

Puis refais le push. GitHub demandera tes identifiants.
