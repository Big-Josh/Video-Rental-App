const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const Joi = require('joi')
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const logger = require('./logger');
const authenticator = require('./authenticator');
const app = express();


app.use(express.json());
app.use(helmet())
app.use(express.urlencoded());
app.use(express.static('public'));
//app.use(logger);
//app.use(authenticator);

console.log(`NODE ENV : ${process.env.NODE_ENV}`);
console.log(`app : ${app.get('env')}`)

if (app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('Morgan is enabled')
}

const courses = [
    {id :1, name : 'course1'},
    {id :2, name : 'course2'},
    {id :3, name : 'course3'},
]

app.get('/', (req,res) => {
    res.send('Hello World!!')
});

app.get('/api/courses', (req,res) => {
    res.send(courses);
})


app.get('/api/courses/:id', (req,res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("Course with given id not found")
    res.send(course)    
});

app.post('/api/courses/', (req,res) => {
    
    const {error} = validateCourse(req.body)
    
   if (error) return res.status(400).send(error.details[0].message);
    
   
    const course = {
        id: courses.length + 1,
        name:  req.body.name
    };
    courses.push(course)
    res.send(course)
});

// UPDATE
app.put('/api/courses/:id', (req,res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("Course with given id not found")
    
    const {error} = validateCourse(req.body)
    if (error) return res.status(400).send(error.details[0].message)
       

    course.name = req.body.name
    res.send(course)
    
})

//Delete

app.delete('/api/courses/:id', (req,res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("Course with given id not found")

    const index = courses.indexOf(course);
    courses.splice(index,1);

    res.send(course);
    
})   

function validateCourse(course){
    const schema = Joi.object({
        name : Joi.string().min(3).required()
    });
    return schema.validate(course.body);

}
//PORT 
const port = process.env.PORT || 3000
app.listen(port, () => console.log('Listening on port 3000'))