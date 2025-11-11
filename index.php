<?php
session_start();
if(!isset($_SESSION['logged_in'])) {
    header('Location: login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>FPS - Gestion des équipements</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
</head>
<body>
    <div class="container">
        <h2>Formulaire d'enregistrement des équipements</h2>
        <form id="equipmentForm" method="POST" action="php/save.php">
            <div class="form-group">
                <label>FPS Asset Inv ID :</label>
                <input type="text" name="asset_id" required readonly>
            </div>
            <div class="form-group">
                <label>Description :</label>
                <input type="text" name="description" required>
            </div>
            <div class="form-group">
                <label>Catégorie :</label>
                <input type="text" name="category" required>
            </div>
            <div class="form-group">
                <label>Emplacement ou bureau :</label>
                <input type="text" name="location" required>
            </div>
            <div class="form-group">
                <label>Personne responsable :</label>
                <input type="text" name="responsible" required>
            </div>
            <div class="form-group">
                <label>Date d'achat :</label>
                <input type="date" name="purchase_date" required>
            </div>
            <div class="form-group">
                <label>Prix d'achat :</label>
                <input type="number" step="0.01" name="purchase_price" required>
                <select name="currency">
                    <option value="USD">USD</option>
                    <option value="CDF">CDF</option>
                </select>
            </div>
            <div class="form-group">
                <label>Durée de vie utile (années) :</label>
                <input type="number" name="useful_life" required>
            </div>
            <div class="form-group">
                <label>Méthode d'amortissement :</label>
                <input type="text" name="depreciation_method" required>
            </div>
            <div class="form-group">
                <label>Taux de dépréciation :</label>
                <input type="number" step="0.01" name="depreciation_rate" required>
            </div>
            <div class="form-group">
                <label>Amortissement cumulé :</label>
                <input type="number" step="0.01" name="accumulated_depreciation" required>
            </div>
            <div class="form-group">
                <label>Valeur comptable nette :</label>
                <input type="number" step="0.01" name="net_book_value" required>
            </div>
            <div class="form-group">
                <label>Condition :</label>
                <input type="text" name="condition" required>
            </div>
            <div class="form-group">
                <label>Alerte :</label>
                <input type="text" name="alert">
            </div>
            <div class="form-group">
                <label>Remarques :</label>
                <input type="text" name="remarks">
            </div>
            
            <button type="submit" id="submitBtn">Valider</button>
            <button type="button" id="printBtn" disabled>Imprimer QR Code</button>
        </form>

        <div class="qr-label" id="qrLabel" style="display: none;">
            <div id="qrcode" class="qr-code"></div>
            <img src="assets/fps-logo.png" alt="FPS Logo" class="logo">
            <div class="asset-id"></div>
        </div>
    </div>

    <script src="js/main.js"></script>
</body>
</html>