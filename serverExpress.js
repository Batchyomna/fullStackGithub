const express = require('express')
const server = express()
const path = require('path')
server.use(express.static(path.join(__dirname, 'assets')));//to difined the path of the files CSS, Img to the files EJS, when we render them to HTML
let port = 8080

//le module body-parser qui va nous permettre d’analyser les données reçues par l’API
var bodyParser = require("body-parser");//créer un objet de type body-parser et l'intégrer dans l’application 
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

const myMongo = require('mongodb').MongoClient //pour utiliser mongo driver
const url = 'mongodb://localhost:27017'
const fileSystem = require('fs');
const ejs = require('ejs');

async function myWebSite() {
    try {
        let myData = await myMongo.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
        var myDataBase = myData.db("FullStack");

        server.get('/', async (req, res) => {//-----get home page
            var homePage = fileSystem.readFileSync("./index.ejs");
            homePage = ejs.render(homePage.toString())
            res.writeHeader(200, { "content-type": "text/html" });
            res.write(homePage)
            res.end();
        });

        server.get('/students', async (req, res) => {//-------------get first page/student's page
            var studentHTML = fileSystem.readFileSync("./students.ejs")
            var theStudents = await myDataBase.collection("Students").find().toArray()
            let studentpage = ejs.render(studentHTML.toString(), { students: theStudents });
            res.writeHeader(200, { "content-type": "text/html" });
            res.write(studentpage)
            res.end();
        })
        server.get('/groups', async (req, res) => {//---------------get second page/group's page
            var groupHTML = fileSystem.readFileSync("./groups.ejs")
            var theGroups = await myDataBase.collection("Groups").find().toArray()
            let groupPage = ejs.render(groupHTML.toString(), { groups: theGroups });
            res.writeHeader(200, { "content-type": "text/html" });
            res.write(groupPage)
            res.end();
        })
        server.post('/students', async (req, res) => {
            let newStudent = req.body.student// (student) is the name of input in the page students.ejs
            await myDataBase.collection("Students").insertOne({ name: newStudent }) // to insert the new student in the database   
            res.writeHead(302, { 'Location': '/students' }); //to stay at the same page. we can also put the link where we want to go
            res.end();
        })
        server.post('/groups', async (req, res) => {
            let newProject = req.body.project // (project) is the name of input(first input) in the page groups.ejs
            let num = req.body.number // (number) is the name of input(second input) in the page groups.ejs
            var theStudents = await myDataBase.collection("Students").find().toArray()

            let names = [];
            let groups = [];
            if (num != 0) {
                while (theStudents.length >= num) {// it will be reapeted as much as the number of the students is possible to create a new group
                    for (let i = 0; i < num; i++) {//it will reapeted as much as the number of the students in every group
                        let i = Math.floor(Math.random() * theStudents.length);
                        var selectedStudent = theStudents.splice(i, 1)// with splice we are sur that we will not take the same student twice
                        names.push(selectedStudent[0].name)
                    }
                    let x = names.join(' + ')//to change all the elements to one string separates by(+)
                    groups.push(x)
                    names = [];
                }
                await myDataBase.collection("Groups").insertOne({ name: newProject, num: num, studentsNames: groups }) // add the new student to the data base

            } else {
                console.log(" You have to enter a number of students other than zero ")
            }
            res.writeHead(302, { 'Location': '/groups' }); //to stay at the same page. we can also put the link where we want to go
            res.end();
        })
        server.listen(port, () => {// server express va entendre la porte qui on a déterminer au début de notre programme
            console.log("Connected");
        })
    }catch(err) {
        console.log(err);
        myData.close()

    } 
}
myWebSite();//call the function which will open the coction with the database and answer of the requests of the web site