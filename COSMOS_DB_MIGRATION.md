# 🗄️ Migration vers Azure Cosmos DB

## ✅ **Modifications effectuées**

### 1. **Installation des dépendances**
```bash
npm install @azure/cosmos dotenv
```

### 2. **Nouveau module de base de données** : `db.js`
- Connexion à Azure Cosmos DB
- Opérations CRUD (Create, Read, Update, Delete)
- Partition par catégorie d'équipement
- Gestion automatique des dates de création/modification

### 3. **Migration de server.js**
- Routes API migrées vers Cosmos DB
- Suppression de la base en mémoire
- Gestion des erreurs améliorée

---

## 🧪 **Tester localement avec l'émulateur Cosmos DB (GRATUIT)**

### **Option 1 : Émulateur Windows (recommandé)**

1. **Télécharger l'émulateur** :
   - https://aka.ms/cosmosdb-emulator

2. **Installer et démarrer l'émulateur**
   - L'émulateur démarre automatiquement sur `https://localhost:8081`
   - Interface web : https://localhost:8081/_explorer/index.html

3. **Lancer l'application** :
   ```powershell
   npm start
   ```

4. **Vérifier la connexion** :
   - Ouvrir : http://localhost:3000/api/test
   - Devrait afficher : `"database": "Azure Cosmos DB"`

### **Option 2 : Émulateur Docker**

```powershell
docker pull mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator
docker run -p 8081:8081 -p 10251-10254:10251-10254 --name cosmos-emulator mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator
```

---

## ☁️ **Déployer sur Azure Cosmos DB (couche gratuite)**

### **1. Créer un compte Cosmos DB gratuit**

Sur Azure Portal :
1. Créer une ressource → Azure Cosmos DB
2. Choisir **NoSQL API**
3. Activer **Free Tier** (1000 RU/s gratuits à vie)
4. Région : choisir la plus proche
5. Créer

### **2. Récupérer les informations de connexion**

Dans votre compte Cosmos DB :
- Aller dans **Keys** (Clés)
- Copier :
  - **URI** (endpoint)
  - **Primary Key** (clé primaire)

### **3. Configurer les variables d'environnement**

**Pour Vercel** (production) :
1. Aller sur vercel.com → votre projet
2. Settings → Environment Variables
3. Ajouter :
   ```
   COSMOS_ENDPOINT=https://votre-compte.documents.azure.com:443/
   COSMOS_KEY=votre_cle_primaire_ici==
   COSMOS_DATABASE_ID=LabelisationDB
   COSMOS_CONTAINER_ID=Equipment
   ```

**Pour le développement local** :
- Modifier le fichier `.env` avec vos vraies valeurs

### **4. Redéployer sur Vercel**

```powershell
git add .
git commit -m "feat: migrate to Azure Cosmos DB for persistent storage"
git push origin feature/patch/restore-logo-favicon
vercel --prod
```

---

## 📊 **Modèle de données**

### **Structure d'un équipement** :

```json
{
  "id": "EQ-1734432000000-x8j2k9p3q",
  "asset_id": "FPS-2024-001",
  "account_code": "ACC-123",
  "description": "Ordinateur portable Dell",
  "category": "informatique",
  "location": "Bureau principal",
  "status": "En service",
  "created_at": "2024-12-17T10:30:00.000Z",
  "updated_at": "2024-12-17T10:30:00.000Z"
}
```

### **Clé de partition** : `category`
- Permet de distribuer les équipements efficacement
- Optimise les requêtes par catégorie
- Évite les hot partitions

---

## 🔍 **Compatibilité avec le code frontend**

✅ **Aucun changement nécessaire dans `public/index.html`** :
- L'API reste identique (`/api/equipment`)
- Les réponses JSON sont compatibles
- Le champ `_id` est remplacé par `id` (Cosmos DB standard)

⚠️ **Si le frontend utilisait `_id`**, modifier dans `index.html` :
```javascript
// Avant
item._id

// Après
item.id
```

---

## 💰 **Coûts**

### **Émulateur local** : GRATUIT ✅
- Illimité en développement
- Aucun coût

### **Azure Cosmos DB Free Tier** : GRATUIT ✅
- 1000 RU/s (Request Units par seconde)
- 25 GB de stockage
- Suffisant pour des milliers d'équipements
- Gratuit à vie (pas d'essai limité)

### **Au-delà du Free Tier** :
- ~24$/mois pour 400 RU/s supplémentaires
- Vous pouvez rester dans le Free Tier indéfiniment

---

## 🛠️ **Commandes utiles**

```powershell
# Démarrer le serveur local
npm start

# Tester l'API
curl http://localhost:3000/api/test

# Voir les logs Cosmos DB
# Les logs s'affichent dans la console au démarrage
```

---

## 📝 **Notes importantes**

1. **Clé de l'émulateur** : La clé dans `.env` est la clé standard de l'émulateur (publique)
2. **Production** : TOUJOURS utiliser des vraies clés Azure en production
3. **Sécurité** : Ne JAMAIS commiter le fichier `.env` avec de vraies clés
4. **Migration** : Les données de l'émulateur ≠ données Azure (bases séparées)

---

## ✅ **Avantages de Cosmos DB pour votre application**

- ✅ **Données persistantes** - ne disparaissent plus jamais
- ✅ **Latence < 10ms** - accès ultra-rapide aux équipements
- ✅ **Scaling automatique** - s'adapte à votre croissance
- ✅ **Disponibilité 99.999%** - SLA garanti par Microsoft
- ✅ **Backup automatique** - restauration possible à tout moment
- ✅ **Multi-région** - réplication possible dans le monde entier
- ✅ **Gratuit pour commencer** - Free Tier permanent

---

## 🆘 **Support**

En cas de problème :
1. Vérifier que l'émulateur est démarré
2. Vérifier les logs dans la console
3. Tester la route `/api/test`
4. Consulter la documentation : https://learn.microsoft.com/azure/cosmos-db/
