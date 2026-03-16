# 🎥 YouTube Video Recommendation with AI

## 📌 Project Overview
The **YouTube Video Recommendation with AI** project is a machine learning-based system that recommends similar YouTube videos based on their content. The system analyzes video titles and descriptions to identify patterns and similarities between videos.

Using these similarities, the system suggests videos that users are most likely interested in watching. Recommendation systems are widely used in platforms like YouTube, Netflix, and Amazon to improve user experience by suggesting relevant content.

---

## 🎯 Objective
The objective of this project is to build a **content-based video recommendation system** that recommends videos based on similarity between video titles and descriptions.

---

## 🧠 Technologies Used
- Python
- Pandas
- NumPy
- Scikit-learn
- Natural Language Processing (NLP)
- TF-IDF Vectorization
- Cosine Similarity

---

## 📊 Dataset
The dataset contains information about videos such as:

- Video Title
- Video Description

These features help the system understand the content of each video and calculate similarity between them.

---

## ⚙️ How the System Works

### 1. Data Collection
Video metadata such as titles and descriptions are collected and stored in a dataset.

### 2. Data Preprocessing
Text data is cleaned and prepared for analysis.

### 3. Feature Extraction
Text is converted into numerical form using **TF-IDF Vectorization**.

### 4. Similarity Calculation
The similarity between videos is calculated using **Cosine Similarity**.

### 5. Recommendation System
When a user selects a video, the system recommends other videos with the highest similarity score.

---

## 📌 Example

### Input Video
Machine Learning Tutorial

### Recommended Videos
- Deep Learning Basics
- Neural Networks Explained
- Artificial Intelligence Introduction
- Data Science Full Course
- Python for Data Science

---

## 📂 Project Structure

```
youtube-video-recommendation-ai
│
├── dataset.csv
├── recommendation.py
├── notebook.ipynb
├── README.md
```

---

## 🚀 Future Improvements
- Implement collaborative filtering
- Use deep learning recommendation models
- Connect with YouTube API
- Deploy as a web application

---

## 👨‍💻 Author
Yogesh Dhote  
Data Analyst | Machine Learning Enthusiast
