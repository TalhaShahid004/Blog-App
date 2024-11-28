// API endpoints (to be replaced with actual backend URLs)
const API_BASE_URL = 'http://localhost:3000/api';

// State management
let currentAuthor = null;
let currentBlog = null;

// DOM Elements
const authorSelect = document.getElementById('authorSelect');
const blogList = document.getElementById('blogList');
const blogModal = document.getElementById('blogModal');
const commentModal = document.getElementById('commentModal');
const blogForm = document.getElementById('blogForm');
const commentForm = document.getElementById('commentForm');
const notification = document.getElementById('notification');

// Event Listeners
document.getElementById('newBlogBtn').addEventListener('click', () => openModal('blogModal'));
authorSelect.addEventListener('change', handleAuthorChange);
blogForm.addEventListener('submit', handleBlogSubmit);
commentForm.addEventListener('submit', handleCommentSubmit);
document.getElementById('searchBtn').addEventListener('click', handleTagSearch);

// Initialize the application
async function initializeApp() {
    try {
        await loadAuthors();
        showNotification('Application initialized successfully', 'success');
    } catch (error) {
        showNotification('Failed to initialize application', 'error');
        console.error('Initialization error:', error);
    }
}

// Load authors into select dropdown
async function loadAuthors() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const authors = await response.json();
        
        authorSelect.innerHTML = '<option value="">Choose an author...</option>';
        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author._id;
            option.textContent = author.name;
            authorSelect.appendChild(option);
        });
    } catch (error) {
        throw new Error('Failed to load authors');
    }
}

// Handle author selection change
async function handleAuthorChange(event) {
    const authorId = event.target.value;
    if (!authorId) {
        blogList.innerHTML = '';
        return;
    }
    
    currentAuthor = authorId;
    await loadAuthorBlogs(authorId);
}

// Load blogs for selected author
async function loadAuthorBlogs(authorId) {
    try {
        const response = await fetch(`${API_BASE_URL}/blogs?author=${authorId}`);
        const blogs = await response.json();
        
        renderBlogs(blogs);
    } catch (error) {
        showNotification('Failed to load blogs', 'error');
    }
}

// Render blogs in the blog list
function renderBlogs(blogs) {
    blogList.innerHTML = '';
    
    blogs.forEach(blog => {
        const blogCard = createBlogCard(blog);
        blogList.appendChild(blogCard);
    });
}

// Create a blog card element
function createBlogCard(blog) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    
    card.innerHTML = `
        <div class="blog-header">
            <h3>${blog.name}</h3>
            <div class="blog-actions">
                <button class="btn secondary" onclick="editBlog('${blog._id}')">Edit</button>
                <button class="btn secondary" onclick="deleteBlog('${blog._id}')">Delete</button>
            </div>
        </div>
        <a href="${blog.URL}" target="_blank">${blog.URL}</a>
        <div class="blog-content">
            ${blog.blogEntry?.[0]?.article || 'No content available'}
        </div>
        <div class="blog-tags">
            ${blog.tags?.map(tag => `<span class="tag">${tag}</span>`).join('') || ''}
        </div>
        <div class="comments-section">
            <h4>Comments</h4>
            ${renderComments(blog.blogEntry?.[0]?.comment || [])}
            <button class="btn primary" onclick="openCommentModal('${blog._id}')">Add Comment</button>
        </div>
    `;
    
    return card;
}

// Render comments for a blog
function renderComments(comments) {
    if (!comments.length) return '<p>No comments yet</p>';
    
    return comments.map(comment => `
        <div class="comment">
            <p>${comment.comment}</p>
            <small>${new Date(comment.commentDate).toLocaleString()}</small>
        </div>
    `).join('');
}

// Modal management
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    if (modalId === 'blogModal') blogForm.reset();
    if (modalId === 'commentModal') commentForm.reset();
}

// Handle blog form submission
async function handleBlogSubmit(event) {
    event.preventDefault();
    
    const blogData = {
        name: document.getElementById('blogName').value,
        URL: document.getElementById('blogUrl').value,
        author: currentAuthor,
        blogEntry: [{
            article: document.getElementById('blogContent').value,
            publishDate: new Date(),
            comment: []
        }],
        tags: document.getElementById('blogTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag)
    };

    try {
        const method = currentBlog ? 'PUT' : 'POST';
        const url = currentBlog 
            ? `${API_BASE_URL}/blogs/${currentBlog}` 
            : `${API_BASE_URL}/blogs`;

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(blogData)
        });

        if (!response.ok) throw new Error('Failed to save blog');

        closeModal('blogModal');
        await loadAuthorBlogs(currentAuthor);
        showNotification('Blog saved successfully', 'success');
    } catch (error) {
        showNotification('Failed to save blog', 'error');
    }
}

// Handle comment form submission
async function handleCommentSubmit(event) {
    event.preventDefault();

    const commentData = {
        comment: document.getElementById('commentText').value,
        commentDate: new Date(),
        commentBy: currentAuthor
    };

    try {
        const response = await fetch(`${API_BASE_URL}/blogs/${currentBlog}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });

        if (!response.ok) throw new Error('Failed to add comment');

        closeModal('commentModal');
        await loadAuthorBlogs(currentAuthor);
        showNotification('Comment added successfully', 'success');
    } catch (error) {
        showNotification('Failed to add comment', 'error');
    }
}

// Edit blog
async function editBlog(blogId) {
    try {
        const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`);
        const blog = await response.json();

        // Populate form
        document.getElementById('blogName').value = blog.name;
        document.getElementById('blogUrl').value = blog.URL;
        document.getElementById('blogContent').value = blog.blogEntry[0]?.article || '';
        document.getElementById('blogTags').value = blog.tags?.join(', ') || '';

        currentBlog = blogId;
        document.getElementById('blogModalTitle').textContent = 'Edit Blog';
        openModal('blogModal');
    } catch (error) {
        showNotification('Failed to load blog for editing', 'error');
    }
}

// Delete blog
async function deleteBlog(blogId) {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete blog');

        await loadAuthorBlogs(currentAuthor);
        showNotification('Blog deleted successfully', 'success');
    } catch (error) {
        showNotification('Failed to delete blog', 'error');
    }
}

// Handle tag search
async function handleTagSearch() {
    const tag = document.getElementById('tagSearch').value.trim();
    if (!tag) return;

    try {
        const response = await fetch(`${API_BASE_URL}/blogs/tags/${tag}`);
        const blogs = await response.json();
        
        renderBlogs(blogs);
        showNotification(`Found ${blogs.length} blogs with tag "${tag}"`, 'success');
    } catch (error) {
        showNotification('Failed to search blogs by tag', 'error');
    }
}

// Open comment modal
function openCommentModal(blogId) {
    currentBlog = blogId;
    openModal('commentModal');
}

// Show notification
function showNotification(message, type) {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target === blogModal) closeModal('blogModal');
    if (event.target === commentModal) closeModal('commentModal');
};