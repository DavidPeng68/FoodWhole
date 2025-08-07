import React, { useState, useEffect } from 'react';
import { BarChart3, Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface NutrientAnalysis {
  [key: string]: {
    consumed: number;
    recommended: number;
    percentage: number;
    status: 'met' | 'good' | 'low' | 'deficient';
  };
}

interface NutrientData {
  dailyNutrients: any;
  nutrientAnalysis: NutrientAnalysis;
  totalCalories: number;
  targetCalories: number;
}

const NutrientDashboard: React.FC = () => {
  const [nutrientData, setNutrientData] = useState<NutrientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNutrientData();
  }, []);

  const fetchNutrientData = async () => {
    try {
      const response = await axios.get('/api/analysis/nutrients');
      setNutrientData(response.data);
    } catch (error) {
      console.error('Failed to fetch nutrient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'met':
        return 'text-secondary-600 bg-secondary-100';
      case 'good':
        return 'text-accent-600 bg-accent-100';
      case 'low':
        return 'text-primary-600 bg-primary-100';
      case 'deficient':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'met':
        return <CheckCircle className="h-4 w-4" />;
      case 'good':
        return <TrendingUp className="h-4 w-4" />;
      case 'low':
        return <AlertTriangle className="h-4 w-4" />;
      case 'deficient':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const formatNutrientName = (name: string) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace('Vitamin ', 'Vitamin ')
      .replace('Vitamin B', 'Vitamin B')
      .replace('Vitamin C', 'Vitamin C')
      .replace('Vitamin D', 'Vitamin D')
      .replace('Vitamin E', 'Vitamin E')
      .replace('Vitamin K', 'Vitamin K');
  };

  const getNutrientUnit = (nutrient: string) => {
    const units: { [key: string]: string } = {
      calories: 'cal',
      protein: 'g',
      carbs: 'g',
      fiber: 'g',
      fat: 'g',
      vitaminA: 'mcg',
      vitaminC: 'mg',
      vitaminD: 'mcg',
      vitaminE: 'mg',
      vitaminK: 'mcg',
      thiamin: 'mg',
      riboflavin: 'mg',
      niacin: 'mg',
      vitaminB6: 'mg',
      vitaminB12: 'mcg',
      calcium: 'mg',
      iron: 'mg',
      magnesium: 'mg',
      phosphorus: 'mg',
      potassium: 'mg',
      zinc: 'mg',
      omega3: 'g',
      sodium: 'mg'
    };
    return units[nutrient] || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!nutrientData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          No nutrient data available
        </h3>
        <p className="text-neutral-600">
          Log some meals to see your nutrient analysis.
        </p>
      </div>
    );
  }

  const { nutrientAnalysis, totalCalories, targetCalories } = nutrientData;

  // Group nutrients by category
  const macroNutrients = ['calories', 'protein', 'carbs', 'fiber', 'fat'];
  const vitamins = ['vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK', 'thiamin', 'riboflavin', 'niacin', 'vitaminB6', 'vitaminB12'];
  const minerals = ['calcium', 'iron', 'magnesium', 'phosphorus', 'potassium', 'zinc', 'sodium'];
  const other = ['omega3'];

  const filterNutrients = (nutrients: string[]) => {
    return Object.entries(nutrientAnalysis).filter(([key]) => nutrients.includes(key));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Nutrient Dashboard</h1>
        <p className="text-neutral-600">
          Track your daily nutrient intake and see how you're meeting your nutritional goals.
        </p>
      </div>

      {/* Calories Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Calories</h2>
          <div className="text-right">
            <p className="text-2xl font-bold text-neutral-900">{totalCalories}</p>
            <p className="text-sm text-neutral-500">of {targetCalories} target</p>
          </div>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-3">
          <div
            className="bg-primary-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((totalCalories / targetCalories) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-neutral-600 mt-2">
          {Math.round((totalCalories / targetCalories) * 100)}% of daily calorie goal
        </p>
      </div>

      {/* Macro Nutrients */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Macro Nutrients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterNutrients(macroNutrients).map(([nutrient, data]) => (
            <div key={nutrient} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-neutral-900">
                  {formatNutrientName(nutrient)}
                </h3>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(data.status)}`}>
                  {getStatusIcon(data.status)}
                  <span>{data.percentage}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Consumed</span>
                  <span className="font-medium">
                    {data.consumed} {getNutrientUnit(nutrient)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Target</span>
                  <span className="font-medium">
                    {data.recommended} {getNutrientUnit(nutrient)}
                  </span>
                </div>
                <div className="nutrient-bar">
                  <div
                    className={`nutrient-progress ${data.status}`}
                    style={{ width: `${Math.min(data.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vitamins */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Vitamins</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterNutrients(vitamins).map(([nutrient, data]) => (
            <div key={nutrient} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-neutral-900">
                  {formatNutrientName(nutrient)}
                </h3>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(data.status)}`}>
                  {getStatusIcon(data.status)}
                  <span>{data.percentage}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Consumed</span>
                  <span className="font-medium">
                    {data.consumed} {getNutrientUnit(nutrient)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Target</span>
                  <span className="font-medium">
                    {data.recommended} {getNutrientUnit(nutrient)}
                  </span>
                </div>
                <div className="nutrient-bar">
                  <div
                    className={`nutrient-progress ${data.status}`}
                    style={{ width: `${Math.min(data.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Minerals */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Minerals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterNutrients(minerals).map(([nutrient, data]) => (
            <div key={nutrient} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-neutral-900">
                  {formatNutrientName(nutrient)}
                </h3>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(data.status)}`}>
                  {getStatusIcon(data.status)}
                  <span>{data.percentage}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Consumed</span>
                  <span className="font-medium">
                    {data.consumed} {getNutrientUnit(nutrient)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Target</span>
                  <span className="font-medium">
                    {data.recommended} {getNutrientUnit(nutrient)}
                  </span>
                </div>
                <div className="nutrient-bar">
                  <div
                    className={`nutrient-progress ${data.status}`}
                    style={{ width: `${Math.min(data.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Nutrients */}
      {filterNutrients(other).length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Other Nutrients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterNutrients(other).map(([nutrient, data]) => (
              <div key={nutrient} className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-neutral-900">
                    {formatNutrientName(nutrient)}
                  </h3>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(data.status)}`}>
                    {getStatusIcon(data.status)}
                    <span>{data.percentage}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Consumed</span>
                    <span className="font-medium">
                      {data.consumed} {getNutrientUnit(nutrient)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Target</span>
                    <span className="font-medium">
                      {data.recommended} {getNutrientUnit(nutrient)}
                    </span>
                  </div>
                  <div className="nutrient-bar">
                    <div
                      className={`nutrient-progress ${data.status}`}
                      style={{ width: `${Math.min(data.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="card">
        <h3 className="font-semibold text-neutral-900 mb-4">Status Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
            <span className="text-sm text-neutral-600">Met (100%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
            <span className="text-sm text-neutral-600">Good (80-99%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <span className="text-sm text-neutral-600">Low (50-79%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-neutral-600">Deficient (&lt;50%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutrientDashboard;
