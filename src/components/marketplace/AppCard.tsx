import React from 'react';
import { Star, ShoppingCart, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

interface App {
  id: number;
  name: string;
  description: string;
  price: string;
  freeTrialDays: string;
  rating: number;
  reviewCount: number;
  badge: string;
  badgeColor: string;
  icon: string;
  backgroundGradient: string;
  agentUrl?: string;
  isComingSoon?: boolean;
}

interface AppCardProps {
  app: App;
  userRating: number;
  onAddToCart: (app: App) => void;
  onRate: (appId: number, rating: number) => void;
}

const AppCard = ({ app, userRating, onAddToCart, onRate }: AppCardProps) => {
  const { user } = useAuth();
  const { hasPurchased, isLoading, checkSubscription } = useSubscription();
  
  const hasAccessToApp = hasPurchased(app.name);
  
  const renderStars = (interactive: boolean = false) => {
  const stars = [];

  if (!interactive) {
    // Always show 4.5 stars for display
    for (let i = 1; i <= 5; i++) {
      if (i <= 4) {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 fill-yellow-400 text-yellow-400"
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 text-yellow-400"
            style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0% 100%)", fill: "#facc15" }}
          />
        );
      }
    }
  } else {
    // Allow interactive user rating
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= userRating;

      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 transition-colors ${
            isFilled
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300 hover:text-yellow-400 cursor-pointer'
          }`}
          onClick={() => onRate(app.id, i)}
        />
      );
    }
  }

  return stars;
};


  const handleAgentClick = async () => {
    if (app.isComingSoon) {
      alert('This app is coming soon!');
      return;
    }

    if (!user) {
      alert('Please sign in to access the agent');
      return;
    }
    
    try {
      await checkSubscription();
      
      if (!hasPurchased(app.name)) {
        alert(`You need to purchase ${app.name} to access this agent.`);
        return;
      }
      
      if (app.agentUrl) {
        window.open(app.agentUrl, '_blank');
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      alert('Error verifying your access. Please try again.');
    }
  };

  const getActionButton = () => {
    if (isLoading) {
      return (
        <button 
          disabled
          className="w-full bg-gray-300 text-white py-3 px-4 rounded-lg cursor-not-allowed font-medium flex items-center justify-center space-x-2"
        >
          <span>Loading...</span>
        </button>
      );
    }

    if (app.isComingSoon) {
      return (
        <button 
          disabled
          className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg cursor-not-allowed font-medium flex items-center justify-center space-x-2"
        >
          <span>Coming Soon</span>
        </button>
      );
    }

    if (!user) {
      return (
        <button 
          onClick={() => onAddToCart(app)}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      );
    }

    if (hasAccessToApp) {
      return (
        <button 
          onClick={handleAgentClick}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-2"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Access App</span>
        </button>
      );
    }

    return (
      <button 
        onClick={() => onAddToCart(app)}
        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-2"
      >
        <ShoppingCart className="w-4 h-4" />
        <span>Purchase

</span>
      </button>
    );
  };

  const displayReviewCount = userRating > 0 ? app.reviewCount + 1 : app.reviewCount;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className={`relative h-64 ${app.backgroundGradient} flex items-center justify-center`}>
        <div className={`absolute top-4 right-4 ${app.badgeColor} text-white text-xs font-bold px-2 py-1 rounded z-10`}>
          {app.badge}
        </div>
        {user && hasAccessToApp && !app.isComingSoon && (
          <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
            Owned
          </div>
        )}
        <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 
            className={`font-bold text-xl transition-colors ${
              app.agentUrl && !app.isComingSoon && hasAccessToApp
                ? 'text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1' 
                : 'text-gray-900'
            }`}
            onClick={app.agentUrl && !app.isComingSoon && hasAccessToApp ? handleAgentClick : undefined}
          >
            {app.name}
            {app.agentUrl && !app.isComingSoon && hasAccessToApp && <ExternalLink className="w-4 h-4" />}
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{app.price}</div>
            <div className="text-sm text-green-600">{app.freeTrialDays}</div>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{app.description}</p>
        
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex">
            {renderStars(false)}
          </div>
          <span className="text-sm text-gray-600">({displayReviewCount})</span>
        </div>
        
        {getActionButton()}
      </div>
    </div>
  );
};

export default AppCard;