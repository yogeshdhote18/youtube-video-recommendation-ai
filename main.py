from flask import Flask, render_template, request
import pandas as pd
import pickle
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)

# Load dataset and model
data = pd.read_csv("final_dataset.csv")

# Load pre-trained model
with open("best_video_classifier_model.pkl", "rb") as f:
    model = pickle.load(f)

# Add performance column if not present
if 'Performance' not in data.columns:
    def classify_performance(row):
        if row < 1000:
            return 'Low'
        elif 1000 <= row < 5000:
            return 'Medium'
        else:
            return 'High'
    data['Performance'] = data['Views Per Day'].apply(classify_performance)

# Encode performance labels
label_encoder = LabelEncoder()
data['Performance label'] = label_encoder.fit_transform(data['Performance'])

# Define features for model
features = ['Likes', 'Comments', 'Duration (Minutes)', 'Engagement', 'Days Since Upload', 'Views Per Day']

# Predict performance category
predictions = model.predict(data[features])
data['Predicted Performance'] = label_encoder.inverse_transform(predictions)

# Mapping for performance category to numeric score
performance_score_map = {'Low': 1, 'Medium': 2, 'High': 3}

# --------------------------
# Calculate Performance Score
# --------------------------
def calculate_performance_score(row):
    # Normalize views and likes
    views_score = row['Views'] / data['Views'].max()
    likes_score = row['Likes'] / data['Likes'].max()
    
    # Normalize predicted performance (1 to 3 → 0.33 to 1.0)
    perf_label = performance_score_map.get(row['Predicted Performance'], 1)
    performance_score = perf_label / 3
    
    # Weighted scoring
    total_score = (performance_score * 0.7 + views_score * 0.15 + likes_score * 0.15) * 100
    return round(total_score, 2)

# --------------------------
# Home Page Route
# --------------------------
@app.route('/')
def home():
    return render_template('first.html')

# --------------------------
# Recommend Route
# --------------------------
@app.route('/recommend', methods=['POST'])
def recommend():
    keyword = request.form['keyword'].lower()

    # Filter videos matching keyword in title or category
    filtered_data = data[data['Title'].str.lower().str.contains(keyword) |
                         data['Main Category'].str.lower().str.contains(keyword)]

    if filtered_data.empty:
        return render_template('result.html', message="No videos found for the keyword.", keyword=keyword)

    # Map and sort by predicted performance
    perf_rank_map = {'High': 3, 'Medium': 2, 'Low': 1}
    filtered_data['Performance Rank'] = filtered_data['Predicted Performance'].map(perf_rank_map)
    filtered_data = filtered_data.sort_values(by='Performance Rank', ascending=False)

    # Take top 5 results
    top_5 = filtered_data.head(5).copy()

    # Calculate score for top 1 video
    top_1 = top_5.iloc[0]
    top_score = calculate_performance_score(top_1)
    
    # Mark first as top
    top_5.iloc[0, top_5.columns.get_loc('Performance Rank')] = 'Top'

    return render_template('result.html', keyword=keyword,
                           top_video=top_1,
                           top_score=top_score,
                           videos=top_5.iloc[1:])

# --------------------------
# Run the Flask App
# --------------------------
if __name__ == '__main__':
    app.run(debug=True)
