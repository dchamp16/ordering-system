import connectDB from "./src/config/db";
import mongoose, { Document, Model } from "mongoose";

function testBluePrint<T>(data: T): T {
  return data;
}

interface Animal {
  name: string;
  gender: string;
}

interface Dog extends Animal {
  kindOfDog: string;
}

const test = testBluePrint<Dog>({
  name: "hello",
  gender: "Male",
  kindOfDog: "nice dog",
});

console.log(test);

function animalInfo(info: Dog) {
  console.log(`
    Name: ${info.name}
    Gender: ${info.gender}
    kindOfDog: ${info.kindOfDog}
    `);
}

animalInfo({
  name: "Pute",
  gender: "Male",
  kindOfDog: "Shiba-Inu",
});

const testPet: Dog = {
  name: "Test Pet",
  gender: "Male",
  kindOfDog: "doggo",
};

console.log(testPet);

// connectDB();
