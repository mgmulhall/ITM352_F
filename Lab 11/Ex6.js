function convertTemperature(tempIn, units) {
// Function to convert temperatures from C to F and F to C
// tempIn is the Temp you want to convert
// units is either "C" or "F"
    if (units =="F") {
        return (tempIn -32) * 5/9;
    } else if (units=="C")
    {
        return (tempIn * 9/5) + 32; 
    } else {
            return NaN;
        }
}
console.log("100 C=",convertTemperature(100, "C"));

var attributes= "5;-3;0;xxx;7.5;13"
var pieces = attributes.split(";");

// inputs a string to the function and this functions will return weather this string is also a number or integer
function isNonNegativeInteger (inString, returnErrors = false) {
    errors = []; // assume no errors at first
if(Number(inString) != inString) errors.push('Not a number!'); // Check if string is a number value
if(inString < 0) errors.push('Negative value!'); // Check if it is non-negative
if(parseInt(inString) != inString) errors.push('Not an integer!'); // Check that it is an integer
return returnErrors ? errors : (errors.length == 0)// if true, return errors, if false, return errors.length (if, than, else)

}

/*for (testVal in pieces) {
    console.log(testVal + ": "+ pieces[testVal]+ " " + isNonNegativeInteger(pieces[testVal],true));
}*/
//call fucntion to check if elements are non-negative integers
function checkIt(elem, index) {
    console.log(`${index}: ${elem} ${(isNonNegativeInteger(elem) ? 'a' : 'not a')} valid quantity`);
}
//apply check it to peices array
pieces.forEach( (elem, index) => {console.log(`${index}: ${elem} ${(isNonNegativeInteger(elem) ? 'a' : 'not a')} valid quantity`)});