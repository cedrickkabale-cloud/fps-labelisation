import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AdminPanel.css';

function AdminPanel() {
  const [message, setMessage] = useState('');
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fetch equipment data
  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/equipment', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEquipment(data);
      } else {
        setMessage('Erreur lors du chargement des équipements');
      }
    } catch (error) {
      setMessage('Erreur réseau: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const initializeDB = async () => {
    try {
      const response = await fetch('/api/admin/init-db', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Base de données initialisée avec succès');
        fetchEquipment(); // Refresh data
      } else {
        setMessage('Erreur: ' + (data.error || 'Échec de l\'initialisation'));
      }
    } catch (error) {
      setMessage('Erreur réseau: ' + error.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Search and filter
  const filteredEquipment = equipment.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  // Sorting
  const sortedEquipment = [...filteredEquipment].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    return aValue > bValue ? direction : -direction;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedEquipment.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEquipment.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Stats calculation
  const stats = {
    total: equipment.length,
    thisMonth: equipment.filter(item => {
      const date = new Date(item.created_at);
      const now = new Date();
      return date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Administration FPS</h2>
        <div>
          <button className="btn btn-primary mr-2" onClick={() => navigate('/')}>
            Retour au formulaire
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <h3>Total équipements</h3>
          <div className="value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <h3>Ajoutés ce mois</h3>
          <div className="value">{stats.thisMonth}</div>
        </div>
      </div>

      <div className="admin-controls">
        <button className="btn btn-primary" onClick={initializeDB}>
          Initialiser/Réinitialiser la base
        </button>
        {message && <div className="alert alert-info">{message}</div>}
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Rechercher un équipement..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div>Chargement...</div>
      ) : (
        <>
          <div className="table-container">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('asset_id')}>
                    ID {sortField === 'asset_id' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('description')}>
                    Description {sortField === 'description' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('location')}>
                    Emplacement {sortField === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('created_at')}>
                    Date d'ajout {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(item => (
                  <tr key={item._id}>
                    <td>{item.asset_id}</td>
                    <td>{item.description}</td>
                    <td>{item.location}</td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
            
            <span className="page-info">
              Page {currentPage} sur {totalPages}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPanel;