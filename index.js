const { app, BrowserWindow, Menu, MenuItem } = require("electron");
const path = require("path");
const mm = new Menu();
const env = Object.assign(process.env,require("./env"))
mm.append(new MenuItem ({
            label: 'Home',
            click(a,b,c) { 
               b.loadURL('https://www.google.com')
            }
         }));
mm.append(new MenuItem ({
            label: 'GitHub',
            click(a,b,c) { 
               b.loadURL('https://github.com/KiaWeb/GoodOldBrowse');
            }
         }));
mm.append(new MenuItem ({
            label: 'Flash Test',
            click(a,b,c) { 
               b.loadURL('https://ultrasounds.com');
            }
         }));
mm.append(new MenuItem ({
            label: 'New Window',
            click() { 
               createWindow();
            }
         }));
let pluginName;
switch (process.platform) {
	case "win32": {
		pluginName = "./extensions/pepflashplayer.dll";
		break;
	} case "darwin": {
		pluginName = "./extensions/PepperFlashPlayer.plugin";
		break;
	} case "linux": {
		pluginName = "./extensions/libpepflashplayer.so";
		// i don't know what this does but it makes flash work
		app.commandLine.appendSwitch("no-sandbox");
		break;
	}
}
app.commandLine.appendSwitch("ppapi-flash-path", path.join(__dirname, pluginName));
app.commandLine.appendSwitch("ppapi-flash-version", "32.0.0.371");

let mainWindow;
const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 700,
		title: "GoodOldBrowse",
		webPreferences: {
			plugins: true,
			contextIsolation: true
		}
	});
	Menu.setApplicationMenu(mm);
	env.MAIN_WINDOW_ID = mainWindow.id;
	
	mainWindow.loadURL('https://www.google.com');
	mainWindow.on("closed", () => mainWindow = null);
	if (env.NODE_ENV == "dev") {
		mainWindow.webContents.openDevTools();
	};
};

app.whenReady().then(() => {
	createWindow();
});
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
	if (mainWindow === null) createWindow();
});
