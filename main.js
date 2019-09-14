const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const xlsx = require('xlsx');

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {
  win = new BrowserWindow({ 
    width: 800, 
    height: 600, 
    icon: path.join(__dirname, 'assets/football_logo.png'),
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.setMenu(null);
  win.maximize();
  win.setResizable(false);
  win.on('unmaximize', () => win.maximize());

  // if (serve) {
    // require('electron-reload')(__dirname, {
    //   electron: require(`${__dirname}/node_modules/electron`)
    // });
    // win.loadURL('http://localhost:4200');
  // } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, `/dist/index.html`),
        protocol: "file:",
        slashes: true
      })
    );
  // }

  // if (serve) {
    win.webContents.openDevTools();
  // }

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

    for (let i = 0; i < files.length; i++) {
      if (files[i]) {
        const possibleDir = `${imageLocation}\\${files[i]}`;
        if (fs.lstatSync(possibleDir).isDirectory()) {
          dirs.push(possibleDir);
        } else {
          const fileLocation = `${possibleDir}`;
          const id = getId(fileLocation);
          const imgString = processImage(fileLocation);
          attachImage(imgString, id, null);

          if (i === files.length-1 && dirs.length === 0) {
            win.webContents.send('import-content', teams);
          }
        }
      }
    }

    if (dirs.length > 0) {
      for (let i = 0; i < dirs.length; i++) {
        const folder = dirs[i].split('\\').pop();
        let matchingTeam;
        
        for (let t = 0; t < teams.length; t++) {
          const name = teams[t].name.toLowerCase();
          if (name.includes(folder.toLowerCase())) {
            matchingTeam = teams[t].name;
          }
        }
  
        fs.readdir(dirs[i], (err, files) => {
          for (let f = 0; f < files.length; f++) {
            const fileLocation = `${dirs[i]}\\${files[f]}`;
            const id = getId(fileLocation);
            const imgString = processImage(fileLocation);
            attachImage(imgString, id, matchingTeam);

            if (f === files.length-1 && i === dirs.length-1) {
              win.webContents.send('import-content', teams);
            }
          }
        });
      }
    }

    function processImage(file) {
      if (path.extname(file).toLowerCase() == ".jpg") {
        return Buffer.from(fs.readFileSync(file)).toString('base64');
      }
    }

    function getId(image) {
      return image.split('\\')[6].split('.')[0];
    }

    function attachImage(image, playerId, matchingTeam) {
      if (matchingTeam) {
        const match = teams.filter(team => team.name === matchingTeam)[0];
        const teamIndex = teams.indexOf(match);
        if (match) {
          const levelShort = playerId.split('-')[1];
          const index = playerId.split('-')[2];
          if (levelShort) {
            let player;
            switch (levelShort) {
              case "CHEER":
                player = teams[teamIndex].cheerPlayers[index-1];
                if (player) teams[teamIndex].cheerPlayers[index-1].image = image;
                break;
              case "FLAG":
                player = teams[teamIndex].flagPlayers[index-1];
                if (player) teams[teamIndex].flagPlayers[index-1].image = image;
                break;
              case "FRESH":
                player = teams[teamIndex].freshmanPlayers[index-1];
                if (player) teams[teamIndex].freshmanPlayers[index-1].image = image;
                break;
              case "JV":
                player = teams[teamIndex].jvPlayers[index-1];
                if (player) teams[teamIndex].jvPlayers[index-1].image = image;
                break;
              case "VAR":
                player = teams[teamIndex].varsityPlayers[index-1];
                if (player) teams[teamIndex].varsityPlayers[index-1].image = image;
                break;
              default:
                return;
            }
          }
        }
      }
    }
  });
});