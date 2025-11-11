document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Simple alert for demonstration; in a real scenario, send to server or email
    alert(`Thank you, ${name}! Your enquiry has been submitted. We will get back to you at ${email}.`);

    // Clear the form
    document.getElementById('contact-form').reset();
});

// Admin login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple hardcoded credentials for demonstration
    if (username === 'Praneeth' && password === 'Praneeth') {
        document.getElementById('login').style.display = 'none';
        document.getElementById('admin').style.display = 'block';
        alert('Login successful!');
    } else {
        alert('Invalid username or password.');
    }

    this.reset();
});

// Function to show login form (call this from a button or link)
function showLogin() {
    document.getElementById('login').style.display = 'block';
}

// Admin forms
document.getElementById('add-photo-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const photoUrl = document.getElementById('photo-url').value;
    const photoAlt = document.getElementById('photo-alt').value;

    const photoGallery = document.querySelector('.photo-gallery');
    const newImg = document.createElement('img');
    newImg.src = photoUrl;
    newImg.alt = photoAlt;
    photoGallery.appendChild(newImg);

    alert('Photo added successfully!');
    this.reset();
});

document.getElementById('add-doc-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const docTitle = document.getElementById('doc-title').value;
    const docUrl = document.getElementById('doc-url').value;

    const docsList = document.querySelector('.docs-list');
    const newLink = document.createElement('a');
    newLink.href = docUrl;
    newLink.className = 'doc-link';
    newLink.textContent = docTitle;
    docsList.appendChild(newLink);

    alert('Document added successfully!');
    this.reset();
});

document.getElementById('add-news-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const newsTitle = document.getElementById('news-title').value;
    const newsContent = document.getElementById('news-content').value;
    const newsDate = document.getElementById('news-date').value;

    const newsList = document.querySelector('.news-list');
    const newArticle = document.createElement('article');
    newArticle.className = 'news-item';
    newArticle.innerHTML = `
        <h3>${newsTitle}</h3>
        <p>${newsContent}</p>
        <time>${newsDate}</time>
    `;
    newsList.insertBefore(newArticle, newsList.firstChild);

    alert('News added successfully!');
    this.reset();
});

// Random Video Selector
document.getElementById('random-video-btn').addEventListener('click', function() {
    const videos = document.querySelectorAll('.video-grid iframe');
    if (videos.length === 0) return;

    // Remove highlight from any previously selected video
    videos.forEach(video => video.classList.remove('highlight'));

    // Select random video
    const randomIndex = Math.floor(Math.random() * videos.length);
    const selectedVideo = videos[randomIndex];

    // Add highlight class
    selectedVideo.classList.add('highlight');

    // Scroll to the selected video
    selectedVideo.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Remove highlight after 3 seconds
    setTimeout(() => {
        selectedVideo.classList.remove('highlight');
    }, 3000);
});

// Pocket Radio Playlist
const audioPlayer = document.getElementById('audio-player');
const playlistItems = document.querySelectorAll('#playlist li');

playlistItems.forEach((item, index) => {
    item.addEventListener('click', function() {
        // Remove active class from all items
        playlistItems.forEach(li => li.classList.remove('active'));

        // Add active class to clicked item
        this.classList.add('active');

        // Set audio source
        const src = this.getAttribute('data-src');
        audioPlayer.src = src;

        // Play the audio
        audioPlayer.play();
    });
});
