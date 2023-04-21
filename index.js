const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
const bodyParser = require('body-parser');


// connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

// create mentor schema
const mentorSchema = new mongoose.Schema({
  name: String,
  email: String,
});

// create mentor model
const Mentor = mongoose.model('Mentor', mentorSchema);

// create student schema
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
});

// create student model
const Student = mongoose.model('Student', studentSchema);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// create mentor endpoint
app.post('/mentors', async (req, res) => {
  try {
    console.log(req.body,"body");
    const mentor = await Mentor.create(req.body);
    res.status(201).json(mentor);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating mentor');
  }
});

// create student endpoint
app.post('/students', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating student');
  }
});

// assign mentor to student endpoint
app.put('/students/:studentId/mentor/:mentorId', async (req, res) => {
  try {
    const { studentId, mentorId } = req.params;
    const student = await Student.findById(studentId);
    const mentor = await Mentor.findById(mentorId);
    student.mentor = mentor;
    await student.save();
    res.status(200).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error assigning mentor to student');
  }
});

app.listen(process.env.PORT, () => {
  console.log('Server listening on port '+ process.env.PORT);
});
