import yt_dlp
import pandas as pd

# ✅ Define 50 computer science topics
topics = [
    "Machine Learning", "Deep Learning", "Artificial Intelligence", "Data Science",
    "Computer Vision", "Natural Language Processing", "Big Data", "Cybersecurity",
    "Cloud Computing", "Software Engineering", "Python Programming", "JavaScript Development",
    "Blockchain Technology", "Data Structures and Algorithms", "Computer Networks",
    "Internet of Things (IoT)", "Edge Computing", "Quantum Computing",
    "Cryptography", "Computer Architecture", "Operating Systems",
    "Database Management Systems", "Web Development", "API Development",
    "Microservices Architecture", "Software Testing", "DevOps",
    "Computer Graphics", "Embedded Systems", "Parallel Computing",
    "Computer Vision in Healthcare", "AI in Finance", "Autonomous Vehicles",
    "Robotics and Automation", "Natural Language Understanding", "AI Ethics",
    "Big Data Analytics", "Augmented Reality", "Virtual Reality",
    "Cloud Security", "Cyber Threat Intelligence", "Neural Networks",
    "AI in Gaming", "Computer Simulation", "Speech Recognition",
    "AI in Healthcare", "Digital Signal Processing", "Explainable AI",
    "Predictive Analytics", "Software Project Management", "Compiler Design"
]

# ✅ Number of videos per topic
videos_per_topic = 10
video_data = []

# ✅ Extract video details using yt-dlp
def extract_video_details(query):
    ydl_opts = {
        'quiet': True,
        'extract_flat': False,  # Fetch full metadata, not just links
        'skip_download': True,
        'noplaylist': True,
        'force_generic_extractor': False,  # Ensures metadata extraction
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        search_results = ydl.extract_info(f"ytsearch{videos_per_topic}:{query}", download=False)
        
        if 'entries' in search_results:
            for video in search_results['entries']:
                video_data.append({
                    "Title": video.get("title", "N/A"),
                    "Uploader": video.get("uploader", "N/A"),
                    "Views": video.get("view_count", 0),
                    "Likes": video.get("like_count", 0),
                    "Comments": video.get("comment_count", 0),
                    "Upload Date": video.get("upload_date", "N/A"),
                    "Duration (Seconds)": video.get("duration", 0),
                    "Duration (Minutes)": round(video.get("duration", 0) / 60, 2),
                    "Tags": ", ".join(video.get("tags", [])),
                    "URL": video.get("webpage_url", "N/A")
                })

# ✅ Scrape videos for each topic
for topic in topics:
    extract_video_details(topic)

# ✅ Convert to DataFrame and Save as CSV
df = pd.DataFrame(video_data)

# ✅ Save to CSV file
csv_filename = "youtube_computer_science_500_entries.csv"
df.to_csv(csv_filename, index=False)

print(f"✅ Data scraping complete! File saved as {csv_filename}")
