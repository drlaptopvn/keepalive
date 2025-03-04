const fetch = require("node-fetch");

const MIN_INTERVAL = 10 * 60 * 1000; // 10 minutes
const MAX_INTERVAL = 15 * 60 * 1000; // 15 minutes
const URL = "https://cleaning-schedule-extension.onrender.com/getMembers";

async function makeRequest() {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    console.log(data);
    console.log(new Date().toISOString(), "Request successful");
  } catch (error) {
    console.error(new Date().toISOString(), "Request failed:", error.message);
  }
}

function getRandomInterval() {
  return Math.floor(
    Math.random() * (MAX_INTERVAL - MIN_INTERVAL + 1) + MIN_INTERVAL
  );
}

function scheduleNextRequest() {
  const interval = getRandomInterval();
  console.log(
    new Date().toISOString(),
    `Next request in ${interval / 1000} seconds`
  );
  setTimeout(() => {
    makeRequest();
    scheduleNextRequest();
  }, interval);
}

// Start the first request
makeRequest();
scheduleNextRequest();
