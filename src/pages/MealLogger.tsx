import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Send, Clock, Trash2, Plus, Utensils } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface MealForm {
  mealText: string;
}

interface Meal {
  mealId: number;
  mealText: string;
  timestamp: string;
  totalCalories: number;
  analysis?: {
    foods: any[];
    nutrients: any;
    totalCalories: number;
  };
}

const MealLogger: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MealForm>();

  // Common food suggestions
  const foodSuggestions = [
    'apple', 'banana', 'chicken breast', 'salmon', 'spinach', 'broccoli',
    'rice', 'pasta', 'bread', 'milk', 'eggs', 'yogurt', 'nuts', 'avocado',
    'tomato', 'carrot', 'potato', 'beef', 'pork', 'fish'
  ];

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await axios.get('/api/meals/history?limit=20');
      setMeals(response.data.meals);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
      toast.error('Failed to load meal history');
    }
  };

  const onSubmit = async (data: MealForm) => {
    setSubmitting(true);
    try {
      const response = await axios.post('/api/meals/log', {
        mealText: data.mealText
      });

      const newMeal = response.data.meal;
      setMeals(prev => [newMeal, ...prev]);
      reset();
      toast.success('Meal logged successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to log meal';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMeal = async (mealId: number) => {
    try {
      await axios.delete(`/api/meals/${mealId}`);
      setMeals(prev => prev.filter(meal => meal.mealId !== mealId));
      toast.success('Meal deleted successfully');
    } catch (error) {
      toast.error('Failed to delete meal');
    }
  };

  const addFoodSuggestion = (food: string) => {
    const currentValue = document.querySelector('textarea[name="mealText"]') as HTMLTextAreaElement;
    if (currentValue) {
      const cursorPos = currentValue.selectionStart;
      const textBefore = currentValue.value.substring(0, cursorPos);
      const textAfter = currentValue.value.substring(cursorPos);
      const newValue = textBefore + (textBefore.endsWith(' ') ? '' : ' ') + food + ' ' + textAfter;
      currentValue.value = newValue;
      currentValue.focus();
      currentValue.setSelectionRange(cursorPos + food.length + 1, cursorPos + food.length + 1);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Meal Logger</h1>
        <p className="text-neutral-600">
          Log your meals in natural language and get instant nutrition analysis.
        </p>
      </div>

      {/* Meal Input Form */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="mealText" className="block text-sm font-medium text-neutral-700 mb-2">
              What did you eat?
            </label>
            <textarea
              id="mealText"
              rows={4}
              {...register('mealText', {
                required: 'Please describe what you ate',
                minLength: {
                  value: 3,
                  message: 'Please provide more details about your meal'
                }
              })}
              className={`input-field resize-none ${errors.mealText ? 'border-red-500' : ''}`}
              placeholder="e.g., I had a grilled chicken breast with steamed broccoli and brown rice for lunch"
            />
            {errors.mealText && (
              <p className="mt-1 text-sm text-red-600">{errors.mealText.message}</p>
            )}
          </div>

          {/* Food Suggestions */}
          <div>
            <p className="text-sm font-medium text-neutral-700 mb-3">Quick add common foods:</p>
            <div className="flex flex-wrap gap-2">
              {foodSuggestions.map((food) => (
                <button
                  key={food}
                  type="button"
                  onClick={() => addFoodSuggestion(food)}
                  className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full text-sm transition-colors"
                >
                  {food}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Log Meal</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Meal History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Recent Meals</h2>
          <div className="flex items-center space-x-2 text-sm text-neutral-500">
            <Clock className="h-4 w-4" />
            <span>Last 20 meals</span>
          </div>
        </div>

        {meals.length === 0 ? (
          <div className="card text-center py-12">
            <Utensils className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No meals logged yet
            </h3>
            <p className="text-neutral-600">
              Start by logging your first meal above to see your nutrition analysis.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {meals.map((meal) => (
              <div key={meal.mealId} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900 mb-2">
                      {meal.mealText}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-neutral-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(meal.timestamp).toLocaleDateString()} at{' '}
                          {new Date(meal.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {meal.totalCalories && (
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-neutral-700">
                            {meal.totalCalories} calories
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Analysis Results */}
                    {meal.analysis && (
                      <div className="mt-3 pt-3 border-t border-neutral-200">
                        <p className="text-sm text-neutral-600 mb-2">
                          <strong>Detected foods:</strong> {meal.analysis.foods.map((f: any) => f.name).join(', ')}
                        </p>
                        {meal.analysis.nutrients && Object.keys(meal.analysis.nutrients).length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(meal.analysis.nutrients).slice(0, 5).map(([nutrient, value]) => (
                              <span
                                key={nutrient}
                                className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs"
                              >
                                {nutrient}: {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => deleteMeal(meal.mealId)}
                    className="ml-4 p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete meal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Plus className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">
              Tips for Better Analysis
            </h3>
            <ul className="text-neutral-600 text-sm space-y-1">
              <li>• Be specific about portion sizes (e.g., "1 cup of rice")</li>
              <li>• Include cooking methods (e.g., "grilled chicken", "steamed broccoli")</li>
              <li>• Mention brands or types when relevant (e.g., "whole wheat bread")</li>
              <li>• Log meals as soon as possible for the most accurate tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealLogger;
