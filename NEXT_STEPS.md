# 🎯 Prochaines étapes pour déployer avec Azure Cosmos DB

## ✅ **Migration terminée !**

Le code a été migré vers Azure Cosmos DB. Les données ne disparaîtront plus !

---

## 📋 **Options de déploiement**

### **Option 1 : Utiliser l'émulateur Cosmos DB (LOCAL - GRATUIT)**

Pour tester localement avec des données persistantes :

1. **Télécharger l'émulateur Windows** :
   ```
   https://aka.ms/cosmosdb-emulator
   ```

2. **Installer et démarrer** (l'émulateur démarre sur https://localhost:8081)

3. **Lancer l'application** :
   ```powershell
   npm start
   ```

4. **Tester** : http://localhost:3000

---

### **Option 2 : Déployer sur Azure Cosmos DB Cloud (GRATUIT)**

#### **A. Créer un compte Cosmos DB gratuit**

1. Aller sur **Azure Portal** : https://portal.azure.com
2. Créer une ressource → **Azure Cosmos DB**
3. Paramètres :
   - API : **NoSQL**
   - **Free Tier** : ✅ **Activé** (1000 RU/s gratuits)
   - Région : choisir la plus proche
4. Créer le compte

#### **B. Récupérer les clés de connexion**

Dans votre compte Cosmos DB :
1. Menu **Keys** (Clés)
2. Copier :
   - **URI** (exemple : `https://fps-db.documents.azure.com:443/`)
   - **PRIMARY KEY** (clé primaire)

#### **C. Configurer Vercel avec Cosmos DB**

1. Aller sur **vercel.com** → votre projet **fps-labelisation**
2. **Settings** → **Environment Variables**
3. Ajouter ces 4 variables :

```
COSMOS_ENDPOINT=https://fps-db.documents.azure.com:443/
COSMOS_KEY=VOTRE_CLE_PRIMAIRE_ICI==
COSMOS_DATABASE_ID=LabelisationDB
COSMOS_CONTAINER_ID=Equipment
```

4. **Save** et **Redeploy**

#### **D. Redéployer l'application**

```powershell
cd "d:\Projet Web\labelisation"
vercel --prod
```

---

### **Option 3 : Héberger ailleurs qu'Azure**

Si vous préférez **Render**, **Railway**, ou **Fly.io** :

1. Créer quand même un compte Cosmos DB gratuit sur Azure (juste pour la base de données)
2. Ajouter les variables d'environnement Cosmos DB dans votre plateforme d'hébergement
3. Déployer l'application

---

## 💰 **Coûts**

| Service | Coût |
|---------|------|
| **Émulateur local** | GRATUIT ✅ |
| **Azure Cosmos DB Free Tier** | GRATUIT ✅ (1000 RU/s + 25 GB) |
| **Vercel** | GRATUIT ✅ (pour ce projet) |

**Total : 0€ / 0$** pour commencer !

---

## 🆘 **Besoin d'aide ?**

Dites-moi quelle option vous souhaitez utiliser :
- **Option 1** : Tester localement avec l'émulateur
- **Option 2** : Déployer sur Azure Cosmos DB + Vercel
- **Option 3** : Utiliser une autre plateforme

Je vous guiderai pas à pas ! 🚀
