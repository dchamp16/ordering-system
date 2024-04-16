const myObject = [{
    layer1: {
        property1: "Value 1",
        layer2: {
            property2: 10,
            property3: true,
            layer3: {
                property4: "This is the deepest level"
            }
        }
    }
}];

for(let obj of myObject){
    console.log(obj);
}


console.log('Object api',Object.keys(myObject));