document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });

    // Search form submission
    const searchForm = document.getElementById('search-form');
    const searchQuery = document.getElementById('search-query');
    const videoCount = document.getElementById('video-count');
    const sortBy = document.getElementById('sort-by');
    const resultsContainer = document.getElementById('results-container');
    const videoResults = document.getElementById('video-results');
    const loadingIndicator = document.getElementById('loading-indicator');
    const noResults = document.getElementById('no-results');
    const resultCount = document.getElementById('result-count');
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const query = searchQuery.value.trim();
        const count = videoCount.value;
        const sort = sortBy.value;
        
        if (query === '') return;
        
        // Show loading state
        loadingIndicator.classList.remove('d-none');
        resultsContainer.classList.add('d-none');
        noResults.classList.add('d-none');
        
        // Make API call to Flask backend
        fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                count: count,
                sort: sort
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Hide loading indicator
            loadingIndicator.classList.add('d-none');
            
            if (data.videos && data.videos.length > 0) {
                displayVideoResults(data.videos);
                resultCount.textContent = data.videos.length;
                resultsContainer.classList.remove('d-none');
                noResults.classList.add('d-none');
                
                // Scroll to results
                setTimeout(() => {
                    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            } else {
                noResults.classList.remove('d-none');
                resultsContainer.classList.add('d-none');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            loadingIndicator.classList.add('d-none');
            alert('An error occurred while searching. Please try again.');
        });
    });
    
    // Function to display video results
    function displayVideoResults(videos) {
        videoResults.innerHTML = '';
        
        videos.forEach((video, index) => {
            const videoCard = document.createElement('div');
            videoCard.className = 'col-md-6 col-lg-4';
            videoCard.innerHTML = `
                <div class="card video-card h-100">
                    <div class="video-thumbnail">
                        <img src="${video.thumbnail}" alt="${video.title}" class="card-img-top">
                        <span class="video-duration">${formatDuration(video.duration)}</span>
                        <span class="video-score">${video.score.toFixed(1)}</span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${video.title}</h5>
                        <p class="video-channel mb-1">${video.channel}</p>
                        <div class="video-stats d-flex justify-content-between">
                            <span><i class="fas fa-eye"></i> ${formatNumber(video.views)}</span>
                            <span><i class="fas fa-thumbs-up"></i> ${formatNumber(video.likes)}</span>
                            <span><i class="fas fa-comment"></i> ${formatNumber(video.comments)}</span>
                        </div>
                    </div>
                    <div class="card-footer bg-white border-0">
                        <button class="btn btn-sm btn-outline-danger w-100 view-details" 
                                data-video-id="${video.id}"
                                data-title="${video.title}"
                                data-channel="${video.channel}"
                                data-views="${video.views}"
                                data-likes="${video.likes}"
                                data-comments="${video.comments}"
                                data-score="${video.score.toFixed(1)}"
                                data-description="${video.description || 'No description available'}">
                            View Details
                        </button>
                    </div>
                </div>
            `;
            
            videoResults.appendChild(videoCard);
        });
        
        // Add event listeners to detail buttons
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', function() {
                openVideoModal(
                    this.getAttribute('data-video-id'),
                    this.getAttribute('data-title'),
                    this.getAttribute('data-channel'),
                    this.getAttribute('data-views'),
                    this.getAttribute('data-likes'),
                    this.getAttribute('data-comments'),
                    this.getAttribute('data-score'),
                    this.getAttribute('data-description')
                );
            });
        });
    }
    
    // Function to open video modal
    function openVideoModal(videoId, title, channel, views, likes, comments, score, description) {
        const modal = new bootstrap.Modal(document.getElementById('videoModal'));
        
        document.getElementById('videoModalTitle').textContent = title;
        document.getElementById('videoModalFrame').src = `https://www.youtube.com/embed/${videoId}?autoplay=0`;
        document.getElementById('videoModalViews').textContent = `${formatNumber(views)} views`;
        document.getElementById('videoModalLikes').textContent = `${formatNumber(likes)} likes`;
        document.getElementById('videoModalComments').textContent = `${formatNumber(comments)} comments`;
        document.getElementById('videoModalScore').textContent = `Score: ${score}`;
        document.getElementById('videoModalChannel').textContent = channel;
        document.getElementById('videoModalDescription').textContent = description;
        document.getElementById('videoModalLink').href = `https://youtube.com/watch?v=${videoId}`;
        
        modal.show();
    }
    
    // Helper function to format numbers
    function formatNumber(num) {
        return parseInt(num).toLocaleString();
    }
    
    // Helper function to format duration (seconds to MM:SS)
    function formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Close modal when hidden to stop video playback
    document.getElementById('videoModal').addEventListener('hidden.bs.modal', function () {
        document.getElementById('videoModalFrame').src = '';
    });
    
    // Sample search terms for demo purposes
    const sampleSearchTerms = [
        "Data Structures",
        "Machine Learning",
        "Python Programming",
        "Algorithms",
        "Web Development",
        "Database Systems"
    ];
    
    // Set a random sample search term
    searchQuery.placeholder = `e.g., "${sampleSearchTerms[Math.floor(Math.random() * sampleSearchTerms.length)]}"`;
});