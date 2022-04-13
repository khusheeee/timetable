const students = require('./database/students.json');
const student_classes = require('./database/student_classes.json');
const classes = require('./database/classes.json');
const timeslots = require('./database/timeslots.json');

const express = require('express')
const app = express();
const port = 3000;

app.get('/timetable/student/:student_id', (req, res) => {
    
    let student_id = req.params.student_id;

    let student = {}
    let class_ids = []
    for (let i = 0; i < students.length; i++) {
        if (students[i]["id"] == student_id) {
            student = students[i]
            student["classes"] = []
            break
        }
    }
    if (student == {}) {
        res.send({"status" : 200, "message" : "Student id not found", "clash": false, "data" : []})
    }
    else {
        for (let i = 0; i < student_classes.length; i++) {
            if (student_classes[i]["student_id"] == student["id"]) {
                class_ids.push(student_classes[i]["class_id"])
            }
        }
        for (let i = 0; i < classes.length; i++) {
            if (class_ids.indexOf(classes[i]["id"]) != -1) {
                student["classes"].push(classes[i])
            }
        }
        let clash = {}
        for (let i = 0; i < student["classes"].length; i++) {
            student["classes"][i]["timeslots"] = []
            for (let j = 0; j < timeslots.length; j++) {
                clash[timeslots[i]["slot"]] = 0
                if (student["classes"][i]["slot"] == timeslots[j]["slot"]) {
                    student["classes"][i]["timeslots"].push({"day": timeslots[j]["day"], "time": timeslots[j]["time"]})
                }
            }
        }        
        let clashed = false
        for (let i = 0; i < student["classes"].length; i++) {
            if (clash[student["classes"][i]["slot"]] == 1) {
                clashed = true
                break
            }
        }
        student["clashed"] = clashed
        res.send({"status" : 200, "message" : "Success", "data" : student})
    }
});

app.listen(port, () => {
  console.log(`Timetable app listening on port ${port}!`)
});
