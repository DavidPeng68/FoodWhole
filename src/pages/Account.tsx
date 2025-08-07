import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Settings, 
  BarChart3, 
  Clock, 
  Trash2, 
  Save,
  AlertTriangle,
  Shield,
  Bell
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface UserStats {
  totalMeals: number;
  daysTracked: number;
  totalDeficiencies: number;
  totalRecommendations: number;
}

interface UserPreferences {
  dietaryRestrictions?: string[];
  allergies?: string[];
  goals?: string[];
  notifications?: {
    mealReminders: boolean;
    weeklyReports: boolean;
    deficiencyAlerts: boolean;
  };
}

const Account: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const [statsResponse, preferencesResponse] = await Promise.all([
        axios.get('/api/user/stats'),
        axios.get('/api/user/preferences')
      ]);

      setStats(statsResponse.data.stats);
      setPreferences(preferencesResponse.data.preferences);
    } catch (error) {
      console.error('Failed to fetch account data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async () => {
    setSaving(true);
    try {
      await axios.put('/api/user/preferences', { preferences });
      toast.success('Preferences updated successfully');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    try {
      await axios.delete('/api/user/account');
      toast.success('Account deleted successfully');
      // Redirect to home page (handled by auth context)
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  const dietaryRestrictions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Mediterranean'
  ];

  const commonAllergies = [
    'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Shellfish'
  ];

  const healthGoals = [
    'Weight Loss', 'Muscle Gain', 'Better Sleep', 'More Energy', 'Immune Support', 'Heart Health'
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Account Settings</h1>
        <p className="text-neutral-600">
          Manage your profile, preferences, and account settings.
        </p>
      </div>

      {/* Profile Section */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Profile Information</h2>
            <p className="text-neutral-600">Your basic account details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              className="input-field bg-neutral-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="input-field bg-neutral-50"
            />
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      {stats && (
        <div className="card">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-secondary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Your Statistics</h2>
              <p className="text-neutral-600">Overview of your Foodwhole journey</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-900">{stats.totalMeals}</p>
              <p className="text-sm text-neutral-600">Total Meals</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-900">{stats.daysTracked}</p>
              <p className="text-sm text-neutral-600">Days Tracked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-900">{stats.totalDeficiencies}</p>
              <p className="text-sm text-neutral-600">Deficiencies Found</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-900">{stats.totalRecommendations}</p>
              <p className="text-sm text-neutral-600">Recommendations</p>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Section */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
            <Settings className="h-6 w-6 text-accent-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Preferences</h2>
            <p className="text-neutral-600">Customize your experience</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Dietary Restrictions */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Dietary Restrictions
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {dietaryRestrictions.map((restriction) => (
                <label key={restriction} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.dietaryRestrictions?.includes(restriction) || false}
                    onChange={(e) => {
                      const current = preferences.dietaryRestrictions || [];
                      if (e.target.checked) {
                        setPreferences({
                          ...preferences,
                          dietaryRestrictions: [...current, restriction]
                        });
                      } else {
                        setPreferences({
                          ...preferences,
                          dietaryRestrictions: current.filter(r => r !== restriction)
                        });
                      }
                    }}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-700">{restriction}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Food Allergies
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {commonAllergies.map((allergy) => (
                <label key={allergy} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.allergies?.includes(allergy) || false}
                    onChange={(e) => {
                      const current = preferences.allergies || [];
                      if (e.target.checked) {
                        setPreferences({
                          ...preferences,
                          allergies: [...current, allergy]
                        });
                      } else {
                        setPreferences({
                          ...preferences,
                          allergies: current.filter(a => a !== allergy)
                        });
                      }
                    }}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-700">{allergy}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Health Goals */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Health Goals
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {healthGoals.map((goal) => (
                <label key={goal} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.goals?.includes(goal) || false}
                    onChange={(e) => {
                      const current = preferences.goals || [];
                      if (e.target.checked) {
                        setPreferences({
                          ...preferences,
                          goals: [...current, goal]
                        });
                      } else {
                        setPreferences({
                          ...preferences,
                          goals: current.filter(g => g !== goal)
                        });
                      }
                    }}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-700">{goal}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Notification Preferences
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.notifications?.mealReminders || false}
                  onChange={(e) => {
                    setPreferences({
                      ...preferences,
                      notifications: {
                        ...preferences.notifications,
                        mealReminders: e.target.checked
                      }
                    });
                  }}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="text-sm font-medium text-neutral-700">Meal Reminders</span>
                  <p className="text-xs text-neutral-500">Get reminded to log your meals</p>
                </div>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.notifications?.weeklyReports || false}
                  onChange={(e) => {
                    setPreferences({
                      ...preferences,
                      notifications: {
                        ...preferences.notifications,
                        weeklyReports: e.target.checked
                      }
                    });
                  }}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="text-sm font-medium text-neutral-700">Weekly Reports</span>
                  <p className="text-xs text-neutral-500">Receive weekly nutrition summaries</p>
                </div>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.notifications?.deficiencyAlerts || false}
                  onChange={(e) => {
                    setPreferences({
                      ...preferences,
                      notifications: {
                        ...preferences.notifications,
                        deficiencyAlerts: e.target.checked
                      }
                    });
                  }}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="text-sm font-medium text-neutral-700">Deficiency Alerts</span>
                  <p className="text-xs text-neutral-500">Get notified about nutritional gaps</p>
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={updatePreferences}
            disabled={saving}
            className="btn-primary flex items-center space-x-2"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-200 bg-red-50">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
            <p className="text-red-700">Irreversible actions</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
            <p className="text-red-700 text-sm mb-4">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
            
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-red-700 text-sm font-medium">
                  Are you sure? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={deleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Yes, Delete My Account
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-neutral-600 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
