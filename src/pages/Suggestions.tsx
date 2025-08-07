import React, { useState, useEffect } from 'react';
import { Lightbulb, ExternalLink, AlertTriangle, Info, ShoppingCart } from 'lucide-react';
import axios from 'axios';

interface Supplement {
  name: string;
  description: string;
  dosage: string;
  url: string;
  importance: string;
}

interface Recommendation {
  nutrient: string;
  consumed: number;
  recommended: number;
  percentage: number;
  severity: string;
  supplement?: Supplement;
}

const Suggestions: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('/api/analysis/recommendations');
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe':
        return 'text-red-600 bg-red-100';
      case 'moderate':
        return 'text-orange-600 bg-orange-100';
      case 'mild':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-neutral-600 bg-neutral-100';
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Supplement Suggestions</h1>
        <p className="text-neutral-600">
          Personalized supplement recommendations based on your nutritional gaps.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="card bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1">Important Disclaimer</h3>
            <p className="text-yellow-700 text-sm">
              These recommendations are for educational purposes only. Always consult with a healthcare professional 
              before starting any supplement regimen. The information provided is not intended as medical advice.
            </p>
          </div>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="card text-center py-12">
          <Lightbulb className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            No recommendations needed
          </h3>
          <p className="text-neutral-600 mb-6">
            Great job! Your current diet appears to be meeting your nutritional needs. 
            Keep logging your meals to maintain this healthy balance.
          </p>
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <p className="text-secondary-700 text-sm">
              <strong>Tip:</strong> Continue logging your meals regularly to get updated recommendations 
              if your nutritional needs change.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <div key={index} className="card">
              {/* Deficiency Info */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {formatNutrientName(rec.nutrient)}
                  </h3>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${getSeverityColor(rec.severity)}`}>
                    <span className="capitalize">{rec.severity}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-neutral-600">Consumed</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      {rec.consumed} {getNutrientUnit(rec.nutrient)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-neutral-600">Recommended</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      {rec.recommended} {getNutrientUnit(rec.nutrient)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-neutral-600">Percentage</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      {rec.percentage}%
                    </p>
                  </div>
                </div>

                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(rec.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Supplement Recommendation */}
              {rec.supplement && (
                <div className="border-t border-neutral-200 pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="h-6 w-6 text-accent-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-900 mb-2">
                        {rec.supplement.name}
                      </h4>
                      <p className="text-neutral-600 mb-3">
                        {rec.supplement.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Info className="h-4 w-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-neutral-700">Why it's important:</p>
                            <p className="text-sm text-neutral-600">{rec.supplement.importance}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-neutral-700">Dosage:</span>
                          <span className="text-sm text-neutral-600">{rec.supplement.dosage}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <a
                          href={rec.supplement.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex items-center space-x-2"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>View on Amazon</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Educational Content */}
      <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Info className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">
              Understanding Supplement Recommendations
            </h3>
            <div className="space-y-3 text-sm text-neutral-600">
              <p>
                <strong>Severity Levels:</strong> Recommendations are categorized by severity based on how far 
                your intake is from the recommended daily values.
              </p>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Severe:</strong> Less than 50% of recommended intake</li>
                <li>• <strong>Moderate:</strong> 50-70% of recommended intake</li>
                <li>• <strong>Mild:</strong> 70-80% of recommended intake</li>
              </ul>
              <p>
                <strong>Affiliate Links:</strong> Product links are provided for convenience and may earn us 
                a small commission at no extra cost to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
