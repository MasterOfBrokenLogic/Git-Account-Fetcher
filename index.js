const searchGithub = async () => {
    const username = document.getElementById("searchInput").value;
    const response = await fetch(`https://api.github.com/users/${username}`);
    const detailsContainer = document.querySelector(".details");
    const data = await response.json();

    if (response.ok) {
        detailsContainer.style.display = "flex";

        // Function to convert text URLs to clickable links
        function convertURLsToLinks(text) {
            return text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        }

        const bioWithLinks = convertURLsToLinks(data.bio || 'No bio available');
        const blogWithLinks = convertURLsToLinks(data.blog || 'Not Available');
        const twitterWithLinks = convertURLsToLinks(data.twitter_username || 'Not Available');
        const companyWithLinks = convertURLsToLinks(data.company || 'Not Available');

        document.getElementById("result").innerHTML = `
            <div class="profile">
                <div class="profile-image">
                    <img src="${data.avatar_url}" />
                </div>
                <div class="profile-details">
                    <h2 class="name">${data.name || data.login}</h2>
                    <p class="username">@${data.login}</p>
                    <p class="bio">${bioWithLinks}</p>
                    <div class="stats">
                        <div><div class="stats-name">Public Repos</div><div class="stats-value">${data.public_repos}</div></div>
                        <div><div class="stats-name">Followers</div><div class="stats-value">${data.followers}</div></div>
                        <div><div class="stats-name">Following</div><div class="stats-value">${data.following}</div></div>
                    </div>
                    <div class="media">
                        <p><span class="media-value">${data.location || 'Not Available'}</span></p>
                        <p><span class="media-value">${blogWithLinks}</span></p>
                        <p><span class="media-value">${twitterWithLinks}</span></p>
                        <p><span class="media-value">${companyWithLinks}</span></p>
                    </div>
                </div>
            </div>`;
    } else {
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.textContent = data.message;

        detailsContainer.innerHTML = "";
        detailsContainer.appendChild(errorMessage);

        setTimeout(() => {
            errorMessage.style.opacity = 1;
        }, 500);

        const retryButton = document.createElement("button");
        retryButton.textContent = "Retry";
        retryButton.addEventListener("click", () => {
            detailsContainer.innerHTML = "";
            searchGithub();
        });

        detailsContainer.appendChild(retryButton);
    }
}
