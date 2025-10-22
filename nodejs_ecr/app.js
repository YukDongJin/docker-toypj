// Import Modules
const express = require("express");
const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const expressErrorHandler = require("express-error-handler");
const http = require("http");
const socketIo = require("socket.io");

// Make Express Servers 
const app = express(); // 3000: Todo, Weather
const server = http.createServer(app);
const io = socketIo(server);
module.exports = io;
//const chatApp = express(); // 3001: Chat

// Chat Server Setting - View, Static Files
//const http = require("http").createServer(chatApp);
//const io = require("socket.io")(http);
//module.exports = io; // to Controller

//chatApp.set("view engine", "ejs");
//chatApp.engine("html", require("ejs").renderFile);
//chatApp.set("views", path.join(__dirname, 'views'));

//chatApp.use("/public", express.static(__dirname + '/public'));


// Server Setting - View, Static Files, Body Parser
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));
app.engine("html",require("ejs").renderFile);

app.use("/public", express.static(path.join(__dirname + '/public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Router Setting
const router = require("./routes/index");
//chatApp.use(router);
app.use(router);


// 과부하 코드 추가
const influx = new InfluxDB({
  url: "http://influxdb.local:8086",
  token: "" // 인증 안 쓰면 빈 문자열 유지
});
const writeApi = influx.getWriteApi("", "vm_metrics");

app.get("/cpu-load", (req, res) => {
  const totalDuration = 10 * 60 * 1000;
  const spikeDuration = 30 * 1000;
  const interval = 2 * 60 * 1000;
  const endTime = Date.now() + totalDuration;

  res.send("⏱ CPU load test started: 2min interval spikes for 10 minutes (~80-90%)");

  const createLoadSpike = (durationMs) => {
    const start = Date.now();
    const loop = () => {
      const cycleStart = Date.now();
      while (Date.now() - cycleStart < 80) {} // 80ms busy
      setTimeout(() => {
        if (Date.now() - start < durationMs) loop();
      }, 20); // 20ms idle
    };
    loop();
  };

  let count = 0;
  const loadInterval = setInterval(() => {
    if (Date.now() >= endTime) {
      clearInterval(loadInterval);
      console.log("CPU load test finished after 10 minutes.");
    } else {
      count++;
      console.log(`CPU spike #${count} started at ${new Date().toISOString()}`);
      createLoadSpike(spikeDuration);

      // influxdb에 이벤트 기록
      const spikeTag = `CPU spike #${count}`;
      const point = new Point("event")
        .tag("type", "cpu_spike")
        .stringField("description", spikeTag)
        .timestamp(new Date());
      writeApi.writePoint(point);
      writeApi.flush();
    }
  }, interval);
});
// 여기까지 삽입 코드


// Error Handling
const errorHandler = expressErrorHandler({
 static: {
   '404': './views/404.html'
 }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);
//chatApp.use(expressErrorHandler.httpError(404));
//chatApp.use(errorHandler);

// Chat Server Open
//http.listen(3001, () => {
//    console.log("Chat Server listening on port 3001!");
//})

// Connect to DB
mongoose.connect("mongodb://mongodb.local:27017/node", function(err){
    if(err){
        console.error("mongoDB Connection Error!", err);
    }
    console.log("mongoDB Connected!");
    
    // Server Open
    app.listen(3000, function(){
        console.log("Server listening on port 3000!");
    });
});
