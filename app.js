var express = require('express');
var app = express();
var http = require('http').createServer(app);

var path = require('path');

// var io = require('socket.io').listen(httpServer);

const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');

var client = null;
var port = 5334;

var httpServer = http.listen(port, function () {
    MongoClient.connect('mongodb://localhost:27017', function (err, client) {
        this.client = client;
    });
    console.log("http server running on " + port);
});


app.use(express.static(path.join(__dirname, '/public')));

app.get('/demo', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/test', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/main.html'));
});

app.post('/upload', function (req, res) {
    var form = new formidable.IncomingForm();
    console.log(form.multiples);
    form.multiples = true;
    form.maxFileSize = 1024 * 1024 * 1024;
    form.maxFieldsSize = 1024 * 1024 * 1024;
    form.hash = 'md5';
    form.parse(req, function (err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
    });

    form.on('end', function (fields, files) {
        // console.log(this.openedFiles);
        console.log(" 총 업로드 파일 갯수 == ", this.openedFiles.length);
        for (var i = 0; i < this.openedFiles.length; i++) {
            /* Temporary location of our uploaded file */
            var temp_path = this.openedFiles[i].path;
            console.log(this.openedFiles[i])
            /* The file name of the uploaded file */
            var file_name = this.openedFiles[i].name;
            var split_file = file_name.split('.mp4')
            var hash = this.openedFiles[i].hash

            /* Location where we want to copy the uploaded file */
            var new_location = './files/';

            console.log("temp_path == ", temp_path);
            console.log("file_name == ", file_name);
            //console.log(this.openedFiles[i]);
            MongoClient.connect('mongodb://localhost:27017', function (err, client) {
                assert.equal(null, err);
                const db = client.db("virtualspace");
                const collection = db.collection('concert');
                console.log(temp_path);

                var final_location = new_location + split_file[0] + '/';
                console.log(final_location + split_file[0] + ".mp4");
                //filename directory generate
                fs.move(temp_path, final_location + split_file[0] + ".mp4", function (err) {
                    if (err) {
                        console.error(err);
                    } else {
                        //file metadata get function
                        fs.readFile(final_location + split_file[0] + ".mp4", function (err, data) {
                            if (err)
                                throw err;
                            else {
                                exif.metadata(data, function (err, metadata) {
                                    console.log("memory" + JSON.stringify(process.memoryUsage()))
                                    if (err)
                                        throw err;
                                    else {
                                        var metadataObj = {}
                                        for (var index in metadata) {
                                            metadataObj[index] = metadata[index]
                                        }
                                        var preparedJSON = {
                                            "filename": file_name,
                                            "location": final_location,
                                            "metadata": metadataObj
                                        }
                                        console.log(preparedJSON);
                                        collection.insertOne(preparedJSON, function (error, response) {
                                            console.log(response);
                                        })
                                    }
                                });
                            }
                            ;
                        });
                        //mpd auto generator (powershell script execute)
                        var spawn = require("child_process").spawn, child;
                        child = spawn("powershell.exe", ["./files/auto.ps1", split_file[0]]);
                        child.stdout.on("data", function (data) {
                            console.log("Powershell Data: " + data);
                        });
                        child.stderr.on("data", function (data) {
                            console.log("Powershell Script: " + data);
                        });
                        child.on("exit", function () {
                            console.log("Powershell Script finished");

                        });
                        child.stdin.end();
                    }
                })
            });
        }
    });
});

app.post('/transfer', function(req, res, next) {
    const db = client.db("virtualspace");
    const collection = db.collection('concert');
    let data = collection.find();
    // let json = JSON.parse(collection);
    //json 형식으로 보내 준다.
    console.log(data);
    res.send(data);
});