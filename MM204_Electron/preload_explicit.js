var ipcRenderer = require("electron").ipcRenderer;
const { remote } = require("electron");
const { BrowserWindow } = remote;
const axios = require("axios");
const dialog = remote.dialog;

function alerting(message) {
  let options = {};

  options.message = message;

  dialog.showMessageBox(BrowserWindow.getFocusedWindow(), options, (res, _) => {
    if (res === 0) WIN.destroy();
  });
}

ipcRenderer.on("input-data", function (_, store) {
  axios
    .post("https://mm204.herokuapp.com/", {
      air_jet_temp: store[0],
      salb_temp: store[1],
      exposure_time: store[2],
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

        document.getElementById("plot1").style.display = "block";
        document.getElementById("plot2").style.display = "block";

        document
          .getElementById("myscript")
          .setAttribute("xvalue", response.data.time);
        document
          .getElementById("myscript")
          .setAttribute("yvalue", response.data.top);

        // });
      }
    })
    .catch((e) => {
      console.log(e);
      alerting(e.toString());
    });
});
