document.addEventListener('DOMContentLoaded', function() {
    // Générer un ID unique pour l'équipement
    const assetId = generateAssetId();
    document.querySelector('input[name="asset_id"]').value = assetId;

    const form = document.getElementById('equipmentForm');
    const printBtn = document.getElementById('printBtn');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        
        fetch('php/save.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                alert('Enregistrement réussi !');
                printBtn.disabled = false;
                generateQRCode(formData.get('asset_id'));
            } else {
                alert('Erreur lors de l\'enregistrement');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Une erreur est survenue');
        });
    });

    printBtn.addEventListener('click', function() {
        const qrLabel = document.getElementById('qrLabel');
        qrLabel.style.display = 'flex';
        window.print();
    });
});

function generateAssetId() {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `FPS${year}${random}`;
}

function generateQRCode(assetId) {
    const qrcode = new QRCode(document.getElementById("qrcode"), {
        text: assetId,
        width: 128,
        height: 128
    });
    document.querySelector('.asset-id').textContent = assetId;
    document.getElementById('qrLabel').style.display = 'flex';
}