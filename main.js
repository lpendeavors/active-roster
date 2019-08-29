const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const xlsx = require('xlsx');
const dcraw = require('dcraw');
const ocrad = require('ocrad.js');

let win;

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600, icon: path.join(__dirname, 'assets/football_logo.png') });
  win.setMenu(null);
  win.maximize();
  win.setResizable(false);
  win.on('unmaximize', () => win.maximize());

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

const ipc = require('electron').ipcMain;

ipc.on('import-json', (event, arg) => {
  console.log(`Importing json file located at ${arg}`);

  const rawData = fs.readFileSync(arg);
  const teams = JSON.parse(rawData);
  win.webContents.send('import-content', teams);
});

ipc.on('legacy-import', (event, arg) => {
  console.log(`Opening workbook located at ${arg}...`);
  
  const workbook = xlsx.readFile(arg);
  const team = arg.toString().split(/[\\]/)[4].split('.')[0];
  win.webContents.send('import-complete', { team, workbook });
});

ipc.on('export-json', (event, arg) => {
  console.log(`Saving exported teams to ${arg.filename}`);

  fs.writeFileSync(arg.filename, arg.content, (err) => {
    const message = err === null ? 'Saved successfuly' : 'Error saving file';
    win.webContents.send('export-complete', message);
  });
});

ipc.on('attach-images', (event, arg) => {
  const teams = arg.teams;
  const imageLocation = arg.imgLocation;

  fs.readdir(imageLocation, (err, files) => {
    const dirs = [];
    if (err) throw err;

    files.forEach(file => {
      if (file) {
        const possibleDir = `${imageLocation}\\${file}`;
        if (fs.lstatSync(possibleDir).isDirectory()) {
          dirs.push(possibleDir);
        } else {
          
        }
      }
    });

    dirs.forEach(directory => {
      const folder = directory.split('\\').pop();
      let matchingTeam;
      
      teams.forEach(team => {
        const name = team.name.toLowerCase();
        if (name.includes(folder.toLowerCase())) {
          matchingTeam = team.name;
        }
      });

      fs.readdir(directory, (err, files) => {
        files.forEach(file => {
          const fileLocation = `${directory}\\${file}`;
          const imgBuffer = processImage(fileLocation);
          const idFromImage = getId(imgBuffer);
        });
      });
    });

    // return team with images


    function processImage(file) {
      if (path.extname(file) === ".ARW" || path.extname(file) === ".CR2") {
        const buf = fs.readFileSync(file);
        return dcraw(buf, { extractThumbnail: true });
      } else if (path.extname(file) === ".JPG") {
        return fs.readFileSync(file);
      }
    }

    function getId(buffer) {
      
    }

    function attachImage(image, playerId, matchingTeam) {
      if (matchingTeam) {

      } else {

      }
    }
  });
});