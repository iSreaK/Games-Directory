import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const RedirectProfile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Tu peux stocker aussi l'id dans ton token ou localStorage selon ta logique
    const userId = 1; // À adapter dynamiquement selon ton système d'authentification
    navigate(`/profile/${userId}`);
  }, [navigate]);

  return null;
};

export default RedirectProfile;
