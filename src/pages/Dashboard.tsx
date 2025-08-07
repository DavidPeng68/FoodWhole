import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Utensils, 
  BarChart3, 
  Lightbulb, 
  TrendingUp, 
  Plus,
  Clock,
  Target,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';

interface DashboardStats {
  totalMeals: number;
  daysTracked: number;
  totalDeficiencies: number;
  totalRecommendations: number;
}

interface RecentMeal {
  mealId: number;
  mealText: string;
  timestamp: string;
  totalCalories: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMeals, setRecentMeals] = useState<RecentMeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, mealsResponse] = await Promise.all([
          axios.get('/api/user/stats'),
          axios.get('/api/meals/history?limit=5')
        ]);

        setStats(statsResponse.data.stats);
        setRecentMeals(mealsResponse.data.meals);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Log Meal',
      description: 'Add what you ate',
      icon: Plus,
      href: '/meals',
      color: 'bg-primary-500 hover:bg-primary-600'
    },
    {
      title: 'View Nutrients',
      description: 'Check your intake',
      icon: BarChart3,
      href: '/nutrients',
      color: 'bg-secondary-500 hover:bg-secondary-600'
    },
    {
      title: 'Get Suggestions',
      description: 'See recommendations',
      icon: Lightbulb,
      href: '/suggestions',
      color: 'bg-accent-500 hover:bg-accent-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-neutral-600">
          Let's check your nutrition and get personalized recommendations.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Meals</p>
              <p className="text-2xl font-bold text-neutral-900">
                {stats?.totalMeals || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Utensils className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Days Tracked</p>
              <p className="text-2xl font-bold text-neutral-900">
                {stats?.daysTracked || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Deficiencies</p>
              <p className="text-2xl font-bold text-neutral-900">
                {stats?.totalDeficiencies || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Recommendations</p>
              <p className="text-2xl font-bold text-neutral-900">
                {stats?.totalRecommendations || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-accent-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className={`card ${action.color} text-white transition-colors duration-200`}
            >
              <div className="flex items-center space-x-3">
                <action.icon className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Meals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Recent Meals</h2>
          <Link
            to="/meals"
            className="text-primary-600 hover:text-primary-500 font-medium text-sm"
          >
            View all
          </Link>
        </div>

        {recentMeals.length === 0 ? (
          <div className="card text-center py-12">
            <Utensils className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No meals logged yet
            </h3>
            <p className="text-neutral-600 mb-6">
              Start by logging your first meal to get personalized nutrition insights.
            </p>
            <Link
              to="/meals"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Log Your First Meal</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentMeals.map((meal) => (
              <div key={meal.mealId} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900 mb-1">
                      {meal.mealText}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {new Date(meal.timestamp).toLocaleDateString()} at{' '}
                      {new Date(meal.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900">
                      {meal.totalCalories} cal
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Target className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">
              Pro Tip: Be Consistent
            </h3>
            <p className="text-neutral-600 text-sm">
              Log your meals regularly to get the most accurate nutrition analysis and personalized supplement recommendations. 
              The more data we have, the better we can help you optimize your health!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
