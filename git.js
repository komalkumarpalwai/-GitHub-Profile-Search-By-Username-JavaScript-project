const APIURL = "https://api.github.com/users/";
const form = document.getElementById("form");
const main = document.getElementById("main");
const search = document.getElementById("search");

const createUserCard = (user) => {
    const cardHTML = `
    <div class="card">
        <div class="img">
            <img src="${user.avatar_url}" alt="${user.name}">
        </div>
        <div class="user-info">
            <h2>${user.name}</h2>
            <p>${user.bio}</p>
            <ul>
                <li>${user.followers}<strong>Followers</strong></li>
                <li>${user.following}<strong>Following</strong></li>
                <li>${user.public_repos} <strong>repositories</strong></li>
            </ul>
            <div class="repo" id="repos">Loading...</div>
        </div>
    </div>`;
    main.innerHTML = cardHTML;
};

const addReposToCard = (repos) => {
    const reposElement = document.getElementById("repos");
    reposElement.innerHTML = ''; // Clear previous content
    repos.slice(0, 5).forEach((repo) => {
        const repoElement = document.createElement("a");
        repoElement.classList.add("repo");
        repoElement.href = repo.html_url;
        repoElement.innerText = repo.name;
        reposElement.appendChild(repoElement);
    });
};

const getRepos = async (username) => {
    try {
        const { data } = await axios(APIURL + username + "/repos?sort=created");
        addReposToCard(data);
    } catch (error) {
        createErrorCard("Problem fetching repos");
    }
};

const getUser = async (username) => {
    try {
        const { data } = await axios(APIURL + username);
        createUserCard(data);
        getRepos(username);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            createErrorCard("No profile with this username");
        } else {
            createErrorCard("An error occurred");
        }
    }
};

const createErrorCard = (message) => {
    const cardHTML = `
    <div class="card">
        <h2>${message}</h2>
    </div>`;
    main.innerHTML = cardHTML;
};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = search.value.trim(); // Trim whitespace
    if (user) {
        getUser(user);
        search.value = "";
    }
});
