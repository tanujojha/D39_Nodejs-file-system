import fs from "fs";
import path from "path";
import express from "express"

const app  = express();

// const publishedPostManDocs = "https://documenter.getpostman.com/view/19201756/2s93RMUuyz";

// HELPER DATA TO WORK WITH API
let data = {
    NOTE: "THIS IS A HELPER DATA TO WORK WITH THE API",
    paths: {
        "create-a-file": "/create",
        "get-all-files-in-dir": "/getall"
    },
    queries: {
        "create-file": {
            "file-name": "name of the file which is to be created",
            "file-ext": "ext of the file which is to be created",
            "example": "/create?name=<file-Name>&ext=<file-ext>"
        },
        "get-all-files": {
            "dir-name": "name of the dir to read",
            "file-ext": "type of ext to look for in the dir",
            "example": "/getall?name=<dir-name>&ext=<file-ext>"
        }
    }
}

let folderpath = "./textFiles";     // path of the folder in which files will be created


// GET HELPER DATA  
app.get("/", (req, res)=>{
    res.status(200).send(data);
});

// CREATE A FILE
app.post("/create", (req, res)=>{
    const {name, ext} = req.query;   // get file name and ext from req
    // check if file name and ext exitst
    if (name && ext){
        // create file
        fs.open(`${folderpath}/${name}${ext}`, "w", (err, file)=>{
            if(err){
                console.log(err);
                res.status(500).send("File Creation Error")
            }else{
                // console.log("file created");
                res.status(200).send({
                    message: "File created",
                    fileName: `${name}${ext}`,
                    path: `${folderpath}/${name}${ext}`
                })
            }
        })
    }else{
        res.status(400).send({error: "Check your URL, it should have file name and ext"})
    }
        
});


// GET ALL FILES IN A FOLDER
app.post("/getall", (req, res)=>{
    const {name, ext} = req.query;  // get folder name and ext from req
    let filesToGet = [];    // files neede to retrive, initially empty
    // check if folder name and ext exitst
    if (name && ext){
        // read the dir
        fs.readdir(`./${name}`, (err, files)=>{
            if(err){
                console.log(err);
                res.status(500).send("No Dir found")
            }else{
                // check if dir is empty 
                if(files.length === 0){
                    res.status(200).send("Empty Dir")
                }else{
                    // if dir is not empty traverse over the files
                    for(let file of files){
                        // check file with .txt ext
                        if(path.extname(file) === ".txt"){
                            filesToGet.push(file)   // push file with .txt ext in filesToGet
                        }
                    }
                    res.status(200).send({
                        message: "Found",
                        filesCount: filesToGet.length,
                        path: `./${name}`,
                        files: filesToGet
                    })
                }
            }
        })
    }else{
        res.status(400).send({error: "Check your URL, it should have folder name and ext"})
    }
})



app.listen("5000", ()=>{
    console.log("server started on 5000");
})