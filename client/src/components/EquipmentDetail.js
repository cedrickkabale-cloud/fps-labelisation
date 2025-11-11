import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import '../styles/EquipmentDetail.css';

function EquipmentDetail({ equipment, onClose }) {
  const navigate = useNavigate();

  if (!equipment) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const printQR = () => {
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${equipment.asset_id}</title>
          <style>
            .qr-container {
              width: 6cm;
              height: 5cm;
              border: 1px solid #000;
              display: flex;
              align-items: center;
              padding: 10px;
              margin: 20px auto;
            }
            .qr-code { flex: 1; }
            .asset-id {
              font-family: Arial, sans-serif;
              font-weight: bold;
              margin-top: 10px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            ${document.getElementById('qr-code').innerHTML}
            <div class="asset-id">${equipment.asset_id}</div>
          </div>
          <script>window.onload = () => window.print()</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="equipment-detail">
      <div className="detail-header">
        <h2>Détails de l'équipement</h2>
        <button className="btn btn-secondary" onClick={onClose}>Fermer</button>
      </div>

      <div className="detail-content">
        <div className="detail-section">
          <div className="qr-section">
            <div id="qr-code">
              <QRCodeSVG value={equipment.asset_id} size={180} />
            </div>
            <button className="btn btn-primary" onClick={printQR}>
              Imprimer QR Code
            </button>
          </div>

          <div className="info-section">
            <div className="info-group">
              <label>ID de l'équipement</label>
              <div>{equipment.asset_id}</div>
            </div>

            <div className="info-group">
              <label>Description</label>
              <div>{equipment.description}</div>
            </div>

            <div className="info-group">
              <label>Catégorie</label>
              <div>{equipment.category}</div>
            </div>

            <div className="info-group">
              <label>Emplacement</label>
              <div>{equipment.location}</div>
            </div>

            <div className="info-group">
              <label>Responsable</label>
              <div>{equipment.responsible}</div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Informations financières</h3>
          <div className="finance-grid">
            <div className="info-group">
              <label>Prix d'achat</label>
              <div>{formatCurrency(equipment.purchase_price, equipment.currency)}</div>
            </div>

            <div className="info-group">
              <label>Date d'achat</label>
              <div>{formatDate(equipment.purchase_date)}</div>
            </div>

            <div className="info-group">
              <label>Durée de vie utile</label>
              <div>{equipment.useful_life} années</div>
            </div>

            <div className="info-group">
              <label>Taux de dépréciation</label>
              <div>{equipment.depreciation_rate}%</div>
            </div>

            <div className="info-group">
              <label>Valeur comptable nette</label>
              <div>{formatCurrency(equipment.net_book_value, equipment.currency)}</div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>État et remarques</h3>
          <div className="info-group">
            <label>Condition</label>
            <div className={`condition-tag ${equipment.condition.toLowerCase()}`}>
              {equipment.condition}
            </div>
          </div>

          {equipment.alert && (
            <div className="info-group">
              <label>Alerte</label>
              <div className="alert-message">{equipment.alert}</div>
            </div>
          )}

          {equipment.remarks && (
            <div className="info-group">
              <label>Remarques</label>
              <div className="remarks">{equipment.remarks}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EquipmentDetail;