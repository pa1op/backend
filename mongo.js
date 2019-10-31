const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://new-user_31:${password}@cluster0-6n9o6.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name,
  number,
});

if (process.argv.length === 5) {
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook!`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach((foundPerson) => {
      console.log(foundPerson.name, foundPerson.number);
    });
    mongoose.connection.close();
  });
}
