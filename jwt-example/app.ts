const axios = require("axios");

require("dotenv").config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

const fetchRepositories = async () => {
  try {
    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    const repositories = response.json();
    console.log("Fetch Repositories:");
    return repositories;
  } catch (err) {
    console.error("Error fetching repositories:", err);
  }
};

const printRepositories = async () => {
  const repositories = await fetchRepositories();
  if (repositories) {
    repositories.map((repo: any, index: number) => {
      console.log(`${index + 1}. ${repo.name}`);
    });
  }
};

printRepositories();
