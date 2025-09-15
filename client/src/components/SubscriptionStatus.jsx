import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionAPI } from '../services/api';

const SubscriptionStatus = ({ className = '' }) => {
  const { user, isAuthenticated } = useAuth();
  const [trialDays, setTrialDays] = useState(0);
  const [canAccess, setCanAccess] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      checkSubscriptionStatus();
    }
  }, [isAuthenticated, user]);

  const checkSubscriptionStatus = async () => {
    try {
      setLoading(true);
      
      // Verificar acceso al sistema
      const accessResult = await subscriptionAPI.canAccessSystem();
      setCanAccess(accessResult);
      
      // Si está en trial, obtener días restantes
      if (user.subscription?.status === 'trial') {
        const daysRemaining = await subscriptionAPI.getTrialDaysRemaining();
        setTrialDays(daysRemaining);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user || loading) {
    return null;
  }

  const { subscription, paymentStatus } = user;

  // No mostrar nada si tiene suscripción activa y está al día
  if (subscription?.status === 'active' && paymentStatus?.isPaid && canAccess) {
    return null;
  }

  const getStatusColor = () => {
    if (!canAccess) return 'bg-red-100 border-red-300 text-red-800';
    if (subscription?.status === 'trial' && trialDays <= 3) {
      return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    }
    if (subscription?.status === 'trial') {
      return 'bg-blue-100 border-blue-300 text-blue-800';
    }
    return 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const getStatusMessage = () => {
    if (!canAccess) {
      return {
        title: 'Acceso Suspendido',
        message: 'Tu acceso ha sido suspendido. Contacta al administrador o actualiza tu suscripción.',
        action: 'Renovar Suscripción'
      };
    }

    if (subscription?.status === 'trial') {
      if (trialDays <= 0) {
        return {
          title: 'Prueba Expirada',
          message: 'Tu período de prueba ha expirado. Suscríbete para continuar usando el sistema.',
          action: 'Suscribirse Ahora'
        };
      }
      
      if (trialDays <= 3) {
        return {
          title: 'Prueba por Expirar',
          message: `Te quedan ${trialDays} día${trialDays !== 1 ? 's' : ''} de prueba gratuita.`,
          action: 'Suscribirse'
        };
      }
      
      return {
        title: 'Período de Prueba',
        message: `Tienes ${trialDays} días restantes de prueba gratuita.`,
        action: 'Ver Planes'
      };
    }

    if (subscription?.status === 'suspended') {
      return {
        title: 'Suscripción Suspendida',
        message: 'Tu suscripción está suspendida por falta de pago.',
        action: 'Pagar Ahora'
      };
    }

    return {
      title: 'Estado de Suscripción',
      message: 'Verifica el estado de tu suscripción.',
      action: 'Ver Detalles'
    };
  };

  const statusInfo = getStatusMessage();

  const handleAction = () => {
    // Aquí puedes implementar la lógica para redirigir a la página de suscripción
    // o abrir un modal de pago
    console.log('Acción de suscripción:', statusInfo.action);
    // Por ejemplo: navigate('/subscription') o abrir modal
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">
            {statusInfo.title}
          </h3>
          <p className="text-sm opacity-90">
            {statusInfo.message}
          </p>
          
          {/* Información adicional para trial */}
          {subscription?.status === 'trial' && (
            <div className="mt-2 text-xs opacity-75">
              <p>Plan: Prueba Gratuita (14 días)</p>
              <p>Inicio: {new Date(subscription.startDate).toLocaleDateString()}</p>
              <p>Vence: {new Date(subscription.trialEndDate).toLocaleDateString()}</p>
            </div>
          )}
          
          {/* Información adicional para suscripción activa */}
          {subscription?.status === 'active' && (
            <div className="mt-2 text-xs opacity-75">
              <p>Plan: {subscription.plan === 'mensual' ? 'Mensual' : 'Anual'}</p>
              {paymentStatus?.nextDueDate && (
                <p>Próximo pago: {new Date(paymentStatus.nextDueDate).toLocaleDateString()}</p>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={handleAction}
          className="ml-4 px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-xs font-medium transition-colors"
        >
          {statusInfo.action}
        </button>
      </div>
      
      {/* Barra de progreso para trial */}
      {subscription?.status === 'trial' && trialDays > 0 && (
        <div className="mt-3">
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
            <div 
              className="bg-white bg-opacity-60 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(trialDays / 14) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;