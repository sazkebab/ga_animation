// server.js
// load the things we need
var express = require('express');
var app = express();
    var counter = 0;
const fs = require('fs')
var parse = require('csv-parse')
var async = require('async');
var minNum, maxNum;

var endNum = 1440;
var sessionsData = [];
var deviceData = [];
var revenueData = [];
var stateData = [];
//var obj = csv(); 
var inputFile='public/resources/data.csv';
var materialOptions;

var express = require('express'),
    list = require('request').Request; // see  template

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public')); // exposes index.html, per below


app.get('/getNewData', function(req, res) {
    counter  = parseInt(req.query.counter);
    var jsonObj ;
    if(counter < sessionsData.length){
        jsonObj = {
        "counter": counter,
        "sessions":[counter, sessionsData[counter][1]],
        "devices":deviceData[counter],
        "locations":stateData[counter],
        "max": maxNum,
        "min": minNum,
        "revenue": revenueData[counter]
        };
    }else{
        jsonObj = {
        "counter": counter,
        "sessions":null,
        "max": maxNum,
        "min": minNum,
        "revenue": null
        };
    }
    res.json(jsonObj); 
});

app.get('/getOptions', function(req, res) {
    res.json(materialOptions);
});

fs.readFile(inputFile, function (err, fileData) {
var countNum = 0;
  parse(fileData, {columns: true, trim: true}, function(err, data) {
    for (var i=0; i<data.length; i++) {
        if(i!=0){
            if(parseInt(data[i]['Minute Index'])!= parseInt(data[i-1]['Minute Index'])){
                countNum++;
            }
        }
        if(countNum!=parseInt(data[i]['Minute Index'])){
            minNum=0;
            while(countNum!=parseInt(data[i]['Minute Index']) && countNum != 1440){
                sessionsData.push([countNum,0]);
                revenueData.push(0);
                deviceData.push([['desktop',0],['mobile',0],['tablet',0]]);
                stateData.push([['AU-NSW',0],['AU-VIC',0],['AU-SA',0],['AU-TAS',0],['AU-ACT',0],['AU-QLD',0],['AU-WA',0],,['AU-NT',0]]);
                countNum++;
            }
        }
        
        
        if(deviceData[countNum]==null){
            deviceData.push([['desktop',0],['mobile',0],['tablet',0]]);
        }
        switch(data[i]['Device Category']) {
            case 'desktop':
                deviceData[countNum][0][1] += parseInt(data[i].Sessions);
                break;
            case 'mobile':
                deviceData[countNum][1][1] += parseInt(data[i].Sessions);
                break;
            case 'tablet':
                deviceData[countNum][2][1] += parseInt(data[i].Sessions);
                break;
        }
        if(stateData[countNum]==null){
                stateData.push([['AU-NSW',0],['AU-VIC',0],['AU-SA',0],['AU-TAS',0],['AU-ACT',0],['AU-QLD',0],['AU-WA',0],['AU-NT',0]]);
        }
        switch(data[i].Region) {
            case 'New South Wales':
                stateData[countNum][0][1] += parseInt(data[i].Sessions);
                break;
            case 'Victoria':
                stateData[countNum][1][1] += parseInt(data[i].Sessions);
                break;
            case 'South Australia':
                stateData[countNum][2][1] += parseInt(data[i].Sessions);
                break;
            case 'Tasmania':
                stateData[countNum][3][1] += parseInt(data[i].Sessions);
                break;
            case 'Australian Capital Territory':
                stateData[countNum][4][1] += parseInt(data[i].Sessions);
                break;
            case 'Queensland':
                stateData[countNum][5][1] += parseInt(data[i].Sessions);
                break;
            case 'Western Australia':
                stateData[countNum][6][1] += parseInt(data[i].Sessions);
                break;
            case 'Northern Territory':
                stateData[countNum][7][1] += parseInt(data[i].Sessions);
                break;
        }
        if(sessionsData[countNum]==null){
            sessionsData.push([countNum, parseInt(data[i].Sessions)]);
            revenueData.push(parseInt(data[i].Revenue));
            //countNum++;
        }else{
            sessionsData[countNum][1] +=  parseInt(data[i].Sessions);
            revenueData[countNum]+=parseInt(data[i].Revenue);
        }
        
    }
    for (var i=0; i< sessionsData.length; i++){
        minNum = minNum == null || minNum > sessionsData[1] ? sessionsData[1]: minNum;
        maxNum = maxNum == null || maxNum < sessionsData[1] ? sessionsData[1] : maxNum;  
    }
    console.log("done")
    setupCharts();
  });
});

function setupCharts(){
    sessionOptions = {
        chart: {title: 'Sessions'},
        width: 900,
        height: 500,
        animation: {
          duration: 139,
          easing: 'in'
          },
          
      vAxis: {minValue:minNum, maxValue:maxNum},
      hAxis: {minValue:sessionsData[0][0], maxValue:sessionsData[sessionsData.length-1][0]},
        axes: {
          y: {
            Daylight: {label: 'Sessions'}
          }
        }
    };
    
    locationOptions = {region: 'AU',
    displayMode: 'regions',
      resolution: 'provinces',
    colorAxis:{minValue: 0,  maxValue: maxNum}};
    deviceOptions = {pieHole: 0.4}
    
    materialOptions = [sessionOptions, locationOptions,deviceOptions ]
}

  

  

app.listen(8888);
console.log('8080 is the magic port');