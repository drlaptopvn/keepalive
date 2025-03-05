const { app, BrowserWindow } = require("electron");
const fetch = require("node-fetch");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false, // Ẩn cửa sổ để chạy nền
  });

  mainWindow.loadFile("index.html");

  // Khi cửa sổ được đóng, ẩn nó thay vì thoát hoàn toàn
  mainWindow.on("close", (e) => {
    e.preventDefault();
    mainWindow.hide();
  });
}

// Hàm gọi API ngẫu nhiên
function callRandomAPI() {
  const minTime = 10 * 60 * 1000; // 10 phút
  const maxTime = 15 * 60 * 1000; // 15 phút

  function getRandomInterval() {
    return Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  }

  async function fetchAPI() {
    try {
      const response = await fetch(
        "https://cleaning-schedule-extension.onrender.com/getMembers"
      ); // Thay bằng API của bạn
      const data = await response.json();
      console.log("API Response:", data);
    } catch (error) {
      console.error("Error fetching API:", error);
    }

    // Đặt lại interval ngẫu nhiên sau mỗi lần gọi
    setTimeout(fetchAPI, getRandomInterval());
  }

  // Bắt đầu lần gọi đầu tiên
  setTimeout(fetchAPI, getRandomInterval());
}

app.whenReady().then(() => {
  createWindow();
  callRandomAPI();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Cho phép ứng dụng chạy nền ngay cả khi tất cả cửa sổ bị đóng
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // Không thoát ứng dụng trên macOS theo convention
  }
});

// Thêm system tray (khay hệ thống)
const { Tray, Menu } = require("electron");
let tray = null;

app.whenReady().then(() => {
  tray = new Tray("icon.png"); // Thay bằng đường dẫn đến icon của bạn

  const contextMenu = Menu.buildFromTemplate([
    { label: "Show App", click: () => mainWindow.show() },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Keep A Live Free Host");
  tray.setContextMenu(contextMenu);
});
