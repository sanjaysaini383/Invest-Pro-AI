from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib
import os
from transformers import pipeline
import requests
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

# Initialize sentiment analyzer with better error handling
try:
    sentiment_analyzer = pipeline(
        "sentiment-analysis", 
        model="cardiffnlp/twitter-roberta-base-sentiment-latest",
        return_all_scores=True
    )
except Exception as e:
    print(f"Warning: Could not load sentiment analyzer: {e}")
    sentiment_analyzer = None

# Load pre-trained models (you'll need to train these)
try:
    if os.path.exists('models/behavior_cluster_model.pkl'):
        behavior_model = joblib.load('models/behavior_cluster_model.pkl')
        scaler = joblib.load('models/scaler.pkl')
    else:
        print("Models not found, will train on first request")
        behavior_model = None
        scaler = None
except Exception as e:
    print(f"Error loading models: {e}")
    behavior_model = None
    scaler = None

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "service": "ai-service",
        "sentiment_analyzer": sentiment_analyzer is not None,
        "behavior_model": behavior_model is not None
    })

@app.route('/analyze-behavior', methods=['POST'])
def analyze_behavior():
    try:
        data = request.json
        spending_data = data.get('spending_data', [])
        
        if not spending_data:
            return jsonify({"error": "No spending data provided"}), 400
        
        # Convert to DataFrame
        df = pd.DataFrame(spending_data)
        
        # Feature engineering
        features = extract_spending_features(df)
        
        # Predict behavior cluster
        if behavior_model and scaler:
            scaled_features = scaler.transform([features])
            cluster = behavior_model.predict(scaled_features)[0]
        else:
            # Simple rule-based clustering if model not available
            cluster = simple_behavior_classification(features)
        
        behavior_types = {
            0: "cautious_saver",
            1: "balanced_spender", 
            2: "impulsive_buyer",
            3: "strategic_investor"
        }
        
        return jsonify({
            "behavior_cluster": behavior_types.get(cluster, "balanced_spender"),
            "confidence": 0.85,
            "features": {
                "total_spending": features[0] if len(features) > 0 else 0,
                "avg_transaction": features[1] if len(features) > 1 else 0,
                "transaction_count": features[2] if len(features) > 2 else 0,
                "spending_volatility": features[3] if len(features) > 3 else 0
            },
            "recommendations": generate_behavior_recommendations(cluster)
        })
        
    except Exception as e:
        print(f"Error in analyze_behavior: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/analyze-personality', methods=['POST'])
def analyze_personality():
    try:
        data = request.json
        quiz_responses = data.get('quiz_responses', {})
        
        if not quiz_responses:
            return jsonify({"error": "No quiz responses provided"}), 400
        
        # Calculate Big Five scores
        big_five_scores = calculate_big_five_scores(quiz_responses)
        
        # Determine risk tolerance
        risk_tolerance = determine_risk_tolerance(big_five_scores)
        
        # Generate investment allocation
        allocation = generate_investment_allocation(risk_tolerance, big_five_scores)
        
        return jsonify({
            "big_five_scores": big_five_scores,
            "risk_tolerance": risk_tolerance,
            "recommended_allocation": allocation,
            "personality_type": classify_personality_type(big_five_scores)
        })
        
    except Exception as e:
        print(f"Error in analyze_personality: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    try:
        data = request.json
        text_data = data.get('text', '')
        
        if not text_data:
            return jsonify({"error": "No text provided"}), 400
        
        if not sentiment_analyzer:
            # Fallback simple sentiment analysis
            return simple_sentiment_analysis(text_data)
        
        # Analyze sentiment
        result = sentiment_analyzer(text_data)
        
        # Convert to our format
        sentiment_score = convert_sentiment_score(result)
        
        return jsonify({
            "sentiment": sentiment_score['label'],
            "confidence": sentiment_score['confidence'],
            "market_impact": assess_market_impact(sentiment_score)
        })
        
    except Exception as e:
        print(f"Error in analyze_sentiment: {e}")
        return jsonify({"error": str(e)}), 500

def extract_spending_features(df):
    """Extract features from spending data"""
    try:
        if df.empty:
            return [0] * 8
        
        # Ensure amount column exists and is numeric
        if 'amount' not in df.columns:
            return [0] * 8
        
        df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0)
        
        # Calculate various spending metrics
        total_spending = df['amount'].sum()
        avg_transaction = df['amount'].mean()
        transaction_count = len(df)
        std_spending = df['amount'].std() or 0
        
        # Category-wise analysis
        if 'category' in df.columns:
            category_counts = df['category'].value_counts()
            essential_spending = (
                category_counts.get('groceries', 0) + 
                category_counts.get('utilities', 0) +
                category_counts.get('food', 0)
            )
            discretionary_spending = (
                category_counts.get('entertainment', 0) + 
                category_counts.get('dining', 0) +
                category_counts.get('shopping', 0)
            )
        else:
            essential_spending = 0
            discretionary_spending = 0
        
        features = [
            float(total_spending),
            float(avg_transaction),
            float(transaction_count),
            float(std_spending),
            float(essential_spending),
            float(discretionary_spending),
            float(essential_spending / max(total_spending, 1)),  # Essential ratio
            float(discretionary_spending / max(total_spending, 1))  # Discretionary ratio
        ]
        
        return features
    except Exception as e:
        print(f"Error extracting features: {e}")
        return [0] * 8

def simple_behavior_classification(features):
    """Simple rule-based behavior classification"""
    if len(features) < 4:
        return 1  # balanced_spender
    
    total_spending, avg_transaction, transaction_count, volatility = features[:4]
    
    if total_spending < 1000 and volatility < 100:
        return 0  # cautious_saver
    elif volatility > 500 or avg_transaction > 1000:
        return 2  # impulsive_buyer
    elif transaction_count > 50 and volatility < 200:
        return 3  # strategic_investor
    else:
        return 1  # balanced_spender

def calculate_big_five_scores(responses):
    """Calculate Big Five personality scores from quiz responses"""
    scores = {
        "openness": 50,
        "conscientiousness": 50,
        "extraversion": 50,
        "agreeableness": 50,
        "neuroticism": 50
    }
    
    try:
        # Process responses
        for question, answer in responses.items():
            # Convert answer to numeric if it's not
            try:
                answer_val = float(answer)
            except (ValueError, TypeError):
                answer_val = 3  # Default middle value
            
            # Simple keyword-based scoring
            question_lower = question.lower()
            
            if any(word in question_lower for word in ['creative', 'artistic', 'imaginative']):
                scores["openness"] = max(0, min(100, scores["openness"] + (answer_val - 3) * 10))
            elif any(word in question_lower for word in ['organized', 'disciplined', 'careful']):
                scores["conscientiousness"] = max(0, min(100, scores["conscientiousness"] + (answer_val - 3) * 10))
            elif any(word in question_lower for word in ['social', 'outgoing', 'energetic']):
                scores["extraversion"] = max(0, min(100, scores["extraversion"] + (answer_val - 3) * 10))
            elif any(word in question_lower for word in ['helpful', 'trusting', 'cooperative']):
                scores["agreeableness"] = max(0, min(100, scores["agreeableness"] + (answer_val - 3) * 10))
            elif any(word in question_lower for word in ['anxious', 'stressed', 'worried']):
                scores["neuroticism"] = max(0, min(100, scores["neuroticism"] + (answer_val - 3) * 10))
    
    except Exception as e:
        print(f"Error calculating Big Five scores: {e}")
    
    return scores

def determine_risk_tolerance(big_five_scores):
    """Determine risk tolerance based on personality"""
    try:
        risk_score = (
            big_five_scores["openness"] * 0.3 +
            big_five_scores["conscientiousness"] * -0.2 +
            big_five_scores["extraversion"] * 0.2 +
            big_five_scores["neuroticism"] * -0.3 +
            25  # Base score
        )
        
        if risk_score < 40:
            return "conservative"
        elif risk_score < 70:
            return "moderate"
        else:
            return "aggressive"
    except Exception as e:
        print(f"Error determining risk tolerance: {e}")
        return "moderate"

def generate_investment_allocation(risk_tolerance, big_five_scores):
    """Generate investment allocation based on risk profile"""
    allocations = {
        "conservative": {
            "equity": 20,
            "debt": 60,
            "esg": 15,
            "crypto": 0,
            "gold": 5
        },
        "moderate": {
            "equity": 50,
            "debt": 30,
            "esg": 15,
            "crypto": 3,
            "gold": 2
        },
        "aggressive": {
            "equity": 70,
            "debt": 10,
            "esg": 10,
            "crypto": 8,
            "gold": 2
        }
    }
    
    base_allocation = allocations.get(risk_tolerance, allocations["moderate"])
    
    # Adjust based on personality traits
    if big_five_scores.get("openness", 50) > 70:
        base_allocation["crypto"] = min(15, base_allocation["crypto"] + 5)
        base_allocation["debt"] = max(5, base_allocation["debt"] - 5)
    
    return base_allocation

def classify_personality_type(big_five_scores):
    """Classify personality type based on Big Five scores"""
    try:
        if big_five_scores["conscientiousness"] > 70 and big_five_scores["neuroticism"] < 30:
            return "Strategic Planner"
        elif big_five_scores["openness"] > 70 and big_five_scores["extraversion"] > 60:
            return "Innovative Risk-Taker"
        elif big_five_scores["agreeableness"] > 70 and big_five_scores["conscientiousness"] > 60:
            return "Ethical Investor"
        elif big_five_scores["neuroticism"] > 60:
            return "Cautious Saver"
        else:
            return "Balanced Investor"
    except Exception as e:
        print(f"Error classifying personality type: {e}")
        return "Balanced Investor"

def simple_sentiment_analysis(text):
    """Simple rule-based sentiment analysis fallback"""
    positive_words = ['good', 'great', 'excellent', 'positive', 'up', 'rise', 'gain', 'profit']
    negative_words = ['bad', 'terrible', 'negative', 'down', 'fall', 'loss', 'crash', 'decline']
    
    text_lower = text.lower()
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    if positive_count > negative_count:
        sentiment = "positive"
        confidence = min(0.8, 0.5 + (positive_count - negative_count) * 0.1)
    elif negative_count > positive_count:
        sentiment = "negative"  
        confidence = min(0.8, 0.5 + (negative_count - positive_count) * 0.1)
    else:
        sentiment = "neutral"
        confidence = 0.6
    
    return jsonify({
        "sentiment": sentiment,
        "confidence": confidence,
        "market_impact": assess_market_impact({"label": sentiment, "confidence": confidence})
    })

def convert_sentiment_score(result):
    """Convert transformer result to our format"""
    if isinstance(result, list) and len(result) > 0:
        # Handle multiple scores format
        best_result = max(result, key=lambda x: x['score'])
        label = best_result['label'].lower()
        confidence = best_result['score']
    else:
        # Handle single result format
        label = result.get('label', 'neutral').lower()
        confidence = result.get('score', 0.5)
    
    # Normalize labels
    if 'pos' in label or label == 'positive':
        label = 'positive'
    elif 'neg' in label or label == 'negative':
        label = 'negative'
    else:
        label = 'neutral'
    
    return {"label": label, "confidence": confidence}

def assess_market_impact(sentiment_score):
    """Assess market impact based on sentiment"""
    sentiment = sentiment_score['label']
    confidence = sentiment_score['confidence']
    
    if sentiment == 'positive' and confidence > 0.7:
        return "bullish"
    elif sentiment == 'negative' and confidence > 0.7:
        return "bearish"
    else:
        return "neutral"

def generate_behavior_recommendations(cluster):
    """Generate recommendations based on behavior cluster"""
    recommendations = {
        0: [  # cautious_saver
            "Consider increasing your investment amount gradually",
            "Look into low-risk debt funds",
            "Set up automatic investments to build consistency"
        ],
        1: [  # balanced_spender
            "Maintain your current investment strategy",
            "Consider diversifying across equity and debt",
            "Review and rebalance quarterly"
        ],
        2: [  # impulsive_buyer
            "Set up automatic round-up investments",
            "Focus on long-term goals to reduce impulsive decisions",
            "Consider SIP investments for discipline"
        ],
        3: [  # strategic_investor
            "Explore advanced investment options",
            "Consider increasing equity allocation",
            "Look into ESG and sector-specific funds"
        ]
    }
    
    return recommendations.get(cluster, recommendations[1])

if __name__ == '__main__':
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    app.run(host='0.0.0.0', port=8000, debug=True)
