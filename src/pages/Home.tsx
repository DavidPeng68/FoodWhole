import React from 'react';
import { Link } from 'react-router-dom';
import { Apple, Utensils, BarChart3, Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Apple className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold text-neutral-900">Foodwhole</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-neutral-600 hover:text-neutral-900 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            Eat Healthy Without
            <span className="text-primary-500 block">Changing Your Food</span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
            Foodwhole analyzes your current diet and suggests personalized supplements to fill nutritional gaps. 
            Optimize your health while keeping your favorite foods.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="btn-outline text-lg px-8 py-3"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            How Foodwhole Works
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Our intelligent system helps you understand your nutrition and provides personalized recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Utensils className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              Log Your Meals
            </h3>
            <p className="text-neutral-600">
              Simply describe what you ate in natural language. Our AI extracts nutritional information automatically.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-8 w-8 text-secondary-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              Analyze Nutrients
            </h3>
            <p className="text-neutral-600">
              Compare your intake to daily recommended values and identify nutritional gaps in your diet.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="h-8 w-8 text-accent-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              Get Recommendations
            </h3>
            <p className="text-neutral-600">
              Receive personalized supplement suggestions with affiliate links to fill nutritional gaps.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose Foodwhole?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We make healthy eating simple and personalized to your lifestyle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-neutral-900 mb-6">
                Personalized Nutrition Analysis
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-secondary-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-neutral-900">Smart Food Recognition</h4>
                    <p className="text-neutral-600">Our AI understands natural language descriptions of your meals.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-secondary-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-neutral-900">Comprehensive Analysis</h4>
                    <p className="text-neutral-600">Track 20+ essential nutrients and compare to daily recommendations.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-secondary-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-neutral-900">Progress Tracking</h4>
                    <p className="text-neutral-600">Monitor your nutritional improvements over time with detailed insights.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-neutral-900 mb-6">
                Smart Supplement Recommendations
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-secondary-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-neutral-900">Personalized Suggestions</h4>
                    <p className="text-neutral-600">Get supplement recommendations based on your specific nutritional gaps.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-secondary-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-neutral-900">Quality Products</h4>
                    <p className="text-neutral-600">Curated supplement recommendations with trusted affiliate partners.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-secondary-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-neutral-900">Educational Content</h4>
                    <p className="text-neutral-600">Learn why each nutrient is important and how supplements can help.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-500 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Optimize Your Health?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of users who are eating healthier without changing their favorite foods.
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 hover:bg-neutral-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <span>Start Free Today</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Apple className="h-6 w-6 text-primary-400" />
              <span className="text-xl font-bold">Foodwhole</span>
            </div>
            <p className="text-neutral-400 mb-6">
              Eat healthy without changing your preferred foods.
            </p>
            <div className="text-sm text-neutral-500">
              <p>© 2024 Foodwhole. All rights reserved.</p>
              <p className="mt-2">
                This application provides nutritional information for educational purposes only. 
                Always consult with a healthcare professional before starting any supplement regimen.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
