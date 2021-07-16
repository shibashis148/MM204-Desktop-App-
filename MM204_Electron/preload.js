const { remote } = require("electron");
const { BrowserWindow } = remote;
const path = require("path");
const url = require("url");
const dialog = remote.dialog;
const axios = require("axios");
function alerting(message) {
  let options = {};

  options.message = message;

  dialog.showMessageBox(BrowserWindow.getFocusedWindow(), options, (res, _) => {
    if (res === 0) WIN.destroy();
  });
}

function createAddWindow(air_jet_temp, salb_temp, exposure_time) {
  addWindow = new BrowserWindow({
    width: 600,
    height: 600,
    title: "Server Output",
    maximizable: false,
    minimizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload_explicit.js"),
      enableRemoteModule: true,
      // devTools: false,
    },
  });

  addWindow.webContents.send("input-data", [
    air_jet_temp,
    salb_temp,
    exposure_time,
  ]);
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "screens/explicit-server.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  addWindow.setMenuBarVisibility(false);
  // Handle garbage collection
  addWindow.on("close", function () {
    addWindow = null;
  });
}

window.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("minimizeWindow")
    .addEventListener("click", function () {
      BrowserWindow.getFocusedWindow().minimize();
    });
  document.getElementById("closeWindow").addEventListener("click", function () {
    BrowserWindow.getFocusedWindow().close();
  });

  document.getElementById("calculate").addEventListener("click", function (e) {
    // e.preventDefault();

    const air_jet_temp = parseInt(
      document.getElementById("air_jet_temp").value
    );
    const salb_temp = parseInt(document.getElementById("salb_temp").value);
    const exposure_time = parseInt(
      document.getElementById("exposure_time").value
    );

    if (salb_temp <= air_jet_temp) {
      alerting(
        "Please Enter Valid Air Jet Temperature with Respect to Slab Temperature"
      );
    } else {
      e.preventDefault();

      axios
        .post("https://mm204.herokuapp.com/", {
          air_jet_temp: air_jet_temp + 273,
          salb_temp: salb_temp + 273,
          exposure_time: exposure_time,
        })
        .then((response) => {
          if (response.data.success) {
            document.getElementById("pre__loader").style.display = "none";

            document.getElementById("top").innerHTML = response.data.top
              .slice(-1)
              .pop();

            document.getElementById("bottom").innerHTML = response.data.bottom
              .slice(-1)
              .pop();
            document.getElementById("result").style.display = "block";

            // document.getElementById("plot1").style.display = "block";
            // document.getElementById("plot2").style.display = "block";

            // });
          }
        })
        .catch((e) => {
          console.log(e);
          alerting(e.toString());
        });
    }
  });
});
