import { app, BrowserWindow, ipcMain, screen} from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const macDetector = process.platform == 'darwin';
const devDetector = process.env.NODE_ENV !== 'development';
let mainWindow;
let backend;


function startBackend(){
    try{
        backend = spawn('node', [path.join(__dirname, 'server.js')], {
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: false
        })
        console.log("Iniciando servidor...")
    }catch(error){
        console.log(`Something went wrong: ${error}`)
    }
}


function createMainWindow(){
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
    

    mainWindow = new BrowserWindow({
        title: 'Clock-in',
        width: screenWidth,
        height: screenHeight,
        
        icon: path.join(__dirname, '../frontend/src/assets/icon.png'),
        frame: false,
        backgroundColor: '#ffffff',
        roundedCorners: true,
        autoHideMenuBar: true,
        titleBarStyle: macDetector ? 'hiddenInset' : 'default',
        show: false,

        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, './src/utils/preload.js')
        }
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })


    mainWindow.loadURL('http://localhost:5173/');
}

app.whenReady().then(() => {
    startBackend();
        createMainWindow();

    ipcMain.on('window-minimize', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.minimize()
        }
    })

    ipcMain.on('window-maximize', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize()
            } else {
                mainWindow.maximize()
            }
        }
    })

    ipcMain.on('window-close', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.close()
        }
    })

    ipcMain.handle('window-is-maximized', () => {
        return mainWindow && !mainWindow.isDestroyed() ? mainWindow.isMaximized() : false
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0){
            createMainWindow();
        } 
    })
})

app.on('window-all-closed', () => {
    
    if(!macDetector){
        app.quit();
    }
})