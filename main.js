/**
 * Keep A Live Free Host
 * Copyright (c) 2024 Keep A Live Free Host
 * MIT License
 */

const { app, BrowserWindow, Tray, Menu } = require("electron");
const fetch = require("node-fetch");
const path = require("path");

// Constants
const CONFIG = {
  API_URL: "https://cleaning-schedule-extension.onrender.com/getMembers",
  INTERVAL: {
    MIN: 10 * 60 * 1000, // 10 minutes
    MAX: 15 * 60 * 1000, // 15 minutes
  },
  WINDOW: {
    WIDTH: 300,
    HEIGHT: 200,
  },
};

// Global variables
let mainWindow;
let tray = null;

// Window management
function createWindow() {
  mainWindow = new BrowserWindow({
    width: CONFIG.WINDOW.WIDTH,
    height: CONFIG.WINDOW.HEIGHT,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("close", (e) => {
    e.preventDefault();
    mainWindow.hide();
  });
}

// API handling
async function fetchAPI() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Making API request...`);

  try {
    const response = await fetch(CONFIG.API_URL);
    const data = await response.json();
    console.log(`[${timestamp}] API Response:`);
    console.log(data);
    return true;
  } catch (error) {
    console.error(`[${timestamp}] Error fetching API:`, error);
    return false;
  }
}

function setupAPIPolling() {
  function getRandomInterval() {
    return (
      Math.floor(
        Math.random() * (CONFIG.INTERVAL.MAX - CONFIG.INTERVAL.MIN + 1)
      ) + CONFIG.INTERVAL.MIN
    );
  }

  async function makeCall() {
    await fetchAPI();
    setTimeout(makeCall, getRandomInterval());
  }

  setTimeout(makeCall, getRandomInterval());
}

// Tray setup
function getTrayIconPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "tray-icon.ico");
  }
  return path.join(__dirname, "tray-icon.ico");
}

function setupTray() {
  try {
    const iconPath = getTrayIconPath();
    // console.log("Loading tray icon from:", iconPath);

    tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
      { label: "Show App", click: () => mainWindow.show() },
      { label: "Quit", click: () => app.quit() },
    ]);

    tray.setToolTip("Keep A Live Free Host");
    tray.setContextMenu(contextMenu);

    // Add click handler for the tray icon
    tray.on("click", () => {
      mainWindow.show();
    });
  } catch (error) {
    console.error(
      "Failed to create tray:",
      error,
      "Icon path:",
      getTrayIconPath()
    );
  }
}

// App initialization
app.whenReady().then(() => {
  createWindow();
  setupTray();
  setupAPIPolling();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // Keep app running in background on non-macOS platforms
  }
});
