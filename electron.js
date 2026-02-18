const { app, BrowserWindow } = require('electron');
const path = require('path');

//esta variable determina si estamos en modo desarrollo o producción
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
    // 1. Crear la ventana del navegador
    const mainWindow = new BrowserWindow({
        width: 1200, //ancho inicial
        height: 800, //alto inicial
        webPreferences: {
            nodeIntegration: true, // Permite usar Node.js dentro de la ventana
            contextIsolation: false
        },
    });

    // 2. Cargar el contenido
    // si estamos programando (dev) carga la url de vite
    // si ya terminamos (Pord), cargará el archivo index.html compilado
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        // Abrir la consola para ver errores
        mainWindow.webContents.openDevTools();
      } else {
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

    }
}

// cuando la app esté lista, crea la ventana
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
      });
    });

    // Cerrar la app cuando todas las ventanas se cierren
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });
