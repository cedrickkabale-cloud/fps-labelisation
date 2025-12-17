# 🎯 Guide complet : MongoDB Atlas (GRATUIT + PERMANENT)

## ✅ **Pourquoi MongoDB Atlas ?**

- ✅ **512 MB gratuits** à vie (≈250,000 équipements)
- ✅ **Aucune carte bancaire** requise
- ✅ **Inscription en 2 minutes** (email suffit)
- ✅ **Interface intuitive** (plus simple qu'Azure)
- ✅ **Très populaire** (millions d'utilisateurs)

---

## 🚀 **Étape 1 : Créer un compte MongoDB Atlas (2 minutes)**

### **A. Inscription**

1. Aller sur **https://www.mongodb.com/cloud/atlas/register**
2. Remplir :
   - **Email**
   - **Mot de passe**
   - Accepter les conditions
3. Cliquer sur **"Create your Atlas account"**
4. **Vérifier votre email** (cliquer sur le lien reçu)

### **B. Créer un cluster gratuit**

1. Après connexion, cliquer sur **"Build a Database"** (ou "Create")
2. Choisir **"M0 FREE"** (le plan gratuit) → **"Create"**
3. Configuration :
   - **Provider** : AWS (ou Google Cloud/Azure)
   - **Region** : Europe (Frankfurt ou Paris)
   - **Cluster Name** : `fps-labelisation` ou laisser par défaut
4. Cliquer sur **"Create Cluster"**
5. ⏳ Attendre 1-3 minutes (création du cluster)

### **C. Configurer la sécurité**

#### **1. Créer un utilisateur de base de données**

Une popup s'affiche automatiquement :
- **Username** : `fps_admin`
- **Password** : Générer un mot de passe sécurisé ou taper le vôtre
- ⚠️ **COPIER LE MOT DE PASSE** (gardez-le en sécurité !)
- Cliquer sur **"Create User"**

#### **2. Autoriser l'accès réseau**

- Cliquer sur **"Add IP Address"**
- Choisir **"Allow access from anywhere"** (0.0.0.0/0)
  - ⚠️ Pour la production, c'est OK car vous avez un mot de passe fort
- Cliquer sur **"Add Entry"**
- Cliquer sur **"Finish and Close"**

---

## 🔗 **Étape 2 : Récupérer l'URI de connexion**

1. Sur la page principale, cliquer sur **"Connect"** (bouton à côté de votre cluster)
2. Choisir **"Drivers"** → **"Node.js"**
3. Copier l'**URI de connexion** qui ressemble à :

```
mongodb+srv://fps_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

4. **Remplacer `<password>`** par votre vrai mot de passe (celui créé à l'étape C.1)

Exemple final :
```
mongodb+srv://fps_admin:MonMotDePasse123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## ⚙️ **Étape 3 : Configurer Vercel**

1. Aller sur **https://vercel.com** → votre projet **fps-labelisation**
2. **Settings** → **Environment Variables**
3. Ajouter **2 variables** :

### **Variable 1 : MONGODB_URI**
```
Name: MONGODB_URI
Value: mongodb+srv://fps_admin:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
Environments: ✅ Production ✅ Preview ✅ Development
```

### **Variable 2 : MONGODB_DATABASE**
```
Name: MONGODB_DATABASE
Value: LabelisationDB
Environments: ✅ Production ✅ Preview ✅ Development
```

4. Cliquer sur **"Save"** pour chaque variable

---

## 🚀 **Étape 4 : Redéployer l'application**

### **Méthode A : Via le terminal (recommandé)**

```powershell
cd "d:\Projet Web\labelisation"
git add .
git commit -m "feat: migrate from Cosmos DB to MongoDB Atlas"
git push origin feature/patch/restore-logo-favicon
vercel --prod
```

### **Méthode B : Via Vercel**

1. Onglet **"Deployments"**
2. Cliquer sur **"···"** → **"Redeploy"**

---

## ✅ **Étape 5 : Vérifier que ça fonctionne**

1. Ouvrir **https://fps-labelisation.vercel.app/api/test**
2. Vous devriez voir :
```json
{
  "status": "OK",
  "message": "FPS Labelisation API working with MongoDB Atlas!",
  "equipmentCount": 0,
  "database": "MongoDB Atlas"
}
```

3. Créer un équipement de test
4. Rafraîchir → l'équipement reste ✅
5. Vérifier dans MongoDB Atlas :
   - Aller sur **"Browse Collections"**
   - Vous verrez votre base `LabelisationDB` et la collection `equipment`

---

## 📊 **Capacité de stockage**

| Critère | MongoDB Atlas Free |
|---------|-------------------|
| **Stockage** | 512 MB gratuit |
| **Équipements possibles** | ~250,000 |
| **RAM** | 512 MB partagé |
| **Connexions simultanées** | 500 |
| **Coût** | 0€ à vie ✅ |

---

## 💡 **Avantages de MongoDB Atlas**

- ✅ **Inscription en 2 minutes** (vs 10 min pour Azure)
- ✅ **Interface plus intuitive**
- ✅ **Aucune carte bancaire**
- ✅ **Très populaire** (meilleur support)
- ✅ **Compatible avec toutes les plateformes d'hébergement**

---

## 🆘 **En cas de problème**

### **Erreur de connexion**

1. Vérifier que l'IP `0.0.0.0/0` est autorisée (Network Access)
2. Vérifier que le mot de passe dans l'URI est correct
3. Vérifier que l'utilisateur `fps_admin` existe (Database Access)

### **Mot de passe oublié**

1. MongoDB Atlas → **Database Access**
2. Cliquer sur **"Edit"** à côté de votre utilisateur
3. **"Edit Password"** → générer un nouveau mot de passe
4. Mettre à jour l'URI sur Vercel

---

## 🎉 **Résumé**

- ✅ **Hébergement** : Vercel (gratuit)
- ✅ **Base de données** : MongoDB Atlas (512 MB gratuit)
- ✅ **Données persistantes** : Stockées à vie
- ✅ **Coût total** : **0€ / 0$ à vie**

**Dites-moi quand vous avez créé le compte MongoDB Atlas !** 🚀
