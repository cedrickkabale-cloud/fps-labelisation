# Labelisation (FPS) — Démarrage rapide

But : lancer l'application localement sans installer MySQL ni configurer Apache.

Pré-requis
- PHP installé (CLI) ou XAMPP (avec `C:\xampp\php\php.exe`).
- Windows PowerShell (fourni par défaut).

Étapes rapides
1. Ouvrez PowerShell.
2. Placez-vous dans le dossier du projet (si nécessaire) et lancez :

   .\start_app.ps1

   - Le script va :
     - détecter `php` (ou `C:\xampp\php\php.exe`),
     - exécuter `php/sqlite_init.php` pour créer `data/fps_inventory.sqlite` et la table,
     - démarrer le serveur PHP intégré sur `http://localhost:8000`.

3. Ouvrez votre navigateur : `http://localhost:8000/login.php`
   - Login : `admin` / `fps2025`

4. Remplissez le formulaire et cliquez sur "Valider". Le script `php/save.php` utilise SQLite par défaut et enregistrera les données dans `data/fps_inventory.sqlite`.

Tests manuels (sans le script)
- Initialiser la DB manuellement :

```powershell
php "D:\Projet Web\labelisation\php\sqlite_init.php"
```

- Tester la DB :

```powershell
php "D:\Projet Web\labelisation\php\test_db.php"
```

Dépannage rapide
- Message "php introuvable" : installez PHP ou utilisez XAMPP et modifiez votre PATH, ou exécutez le script avec le chemin complet du php.exe (ex : `C:\xampp\php\php.exe`).
- Si le port 8000 est déjà utilisé : éditez `start_app.ps1` et changez la variable `$port`.
- Si `data/fps_inventory.sqlite` n'est pas créé : vérifiez les permissions du dossier et exécutez `php/sqlite_init.php` depuis PowerShell pour voir l'erreur.

Notes
- SQLite est utilisé pour simplifier la configuration. Si vous préférez MySQL, ouvrez `php/save.php` et mettez `$use_sqlite = false;` puis configurez les paramètres MySQL.
- Le serveur intégré est seulement pour le développement.
