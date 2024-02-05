// Terrestrial Assemblages | Prototype Waterways Diagram
// Sammy Jenas | February 2024

let button1, button2, button3, button4, button5, button6, button7, button8; 
let input, greeting, question, response;
let textStrings = []; // array to store text from different files
let maxLines = 20; // maximum lines to display in the lower 'terminal' section
let lineSpacing = 20; // spacing between lines of text in terminal
let textX = 50, textY; // x and y positions for terminal text
let lineWidth = 650; // width of lines in terminal
let finalLineSpace = 0; // used for making text appear on a new line in terminal
let finalLineString = ''; // used for making text appear on a new line in terminal
let freshwaterPoll, freshwaterBio, marineCoastal, metals, plastics, recFishing, comFishing, landfill;

function preload(){
  freshwaterPoll = loadStrings('texts/freshwater_pollution.txt');
  freshwaterBio = loadStrings('texts/freshwater_biodiversity.txt');
  marineCoastal = loadStrings('texts/marine_and_coastal_ecosystems_biodiversity.txt');
  metals = loadStrings('texts/heavy_metals.txt');
  plastics = loadStrings('texts/plastics.txt');
  recFishing = loadStrings('texts/rec_fishing.txt');
  comFishing = loadStrings('texts/com_fishing.txt');
  landfill = loadStrings('texts/landfill.txt');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textY = height / 2 + 50; // set y position of the text in the lower 'terminal' section
  // buttons
  button1 = createButton('Freshwater pollution');
  makeButton(button1, 50, 50, 137, 20, freshwaterPoll);
  button2 = createButton('Freshwater biodiversity');
  makeButton(button2, 20, 250, 155, 20, freshwaterBio);
  button3 = createButton('Marine & coastal ecosystems / biodiversity');
  makeButton(button3, 180, 370, 186, 38, marineCoastal);
  button4 = createButton('Heavy metals');
  makeButton(button4, 420, 200, 98, 20, metals);
  button5 = createButton('Plastics');
  makeButton(button5, 420, 240, 98, 20, plastics);
  button6 = createButton('Fishing (recreation)');
  makeButton(button6, 480, 320, 90, 38, recFishing);
  button7 = createButton('Fishing (commercial)');
  makeButton(button7, 700, 370, 110, 38, comFishing);
  button8 = createButton('Landfill');
  makeButton(button8, 540, 120, 120, 20, landfill);
  // input box
  input = createInput();
  input.position(600, 40);
  // submit button for input box
  submitButton = createButton('submit');
  submitButton.position(input.x + input.width, input.y);
  submitButton.mousePressed(askSomething);
  // question text prompt above input box
  greeting = createElement('h2', 'Questions?');
  greeting.style('color', 'white');
  greeting.style('font-family: Consolas');
  greeting.position(input.x, input.y - 50);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  textY = height / 2 + 50; // reset y position of the 'terminal' text in lower section
}

function lowerBackground(){
  noStroke(); fill(0);
  rect(0, windowHeight/2, windowWidth, windowHeight);
}
 
function askSomething(){
  question = input.value();
  input.value('');
  if (textStrings.length > 0) {
    textStrings.push(finalLineString); // blank line to separate text in 'terminal'
  }
  textStrings.push(question);
  setTimeout(AIresponse, 1000);
}

function AIresponse(){
  if (textStrings.length > 0) {
    textStrings.push(finalLineString); // blank line to separate question and response
  }
  response = 'AI responds to the question "'// placeholder response (replace with API call to LLM)
  response += question; 
  response += '"';
  textStrings.push(response);
}

function makeButton(buttonName, x, y, w, h, output){
  buttonName.position(x, y);
  buttonName.size(w, h);
  buttonName.mousePressed(() => {
    // print output to the terminal
    if (textStrings.length > 0) {
      textStrings.push(finalLineString); // blank line to separate text in 'terminal'
    }
    textStrings.push(output);
  });
}

function displayText(){
  // split text into an array of words
  if (textStrings.length === 0) {
    return; // display nothing if textStrings array is empty
    }
  // join array of strings into a single string
  let allText = join(textStrings, ' ');
  // split text into an array of words
  let words = allText.split(' ');
  let lines = [];
  let line = '';
  for (let i = 0; i < words.length; i++) {
  let testLine = line + words[i] + ' ';
  // get width of current line
  let testWidth = textWidth(testLine);
  if (testWidth > lineWidth) {
    // if line exceeds line width, push it to lines array
    lines.push(line);
    // start a new line
    line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  // push last line
  lines.push(line);
   // calculate space remaining on the final line
  let finalLine = lines[lines.length - 1];
  finalLineSpace = Math.floor((lineWidth - textWidth(finalLine)) / textWidth(' ') - 1);
  // make string to add to end of line to start next txt file on new line (messy solution)
  finalLineString = '';
  for (x = 0; x < finalLineSpace; x ++) {
    finalLineString += ' ';
  }
  // one way to add a blank line
  let charsPerLine = Math.floor(lineWidth / textWidth(' '));
  for (x = 0; x < charsPerLine; x ++) {
    finalLineString += ' ';
  }
  // limit number of lines displayed
  let startIndex = max(0, lines.length - maxLines);
  // draw lines to screen
  fill(255);
  textFont('Consolas'); textSize(14);
  for (let j = startIndex; j < lines.length; j++) {
    text(lines[j], textX, textY + (j - startIndex) * lineSpacing);
    }
}

function lineConnect(button1, x1, y1, button2, x2, y2){
  stroke(255); strokeWeight(2);
  // messy solution to hit middle of button, affects calculation when adjusting target
  let lineX1 = x1 + button1.width / 2, lineY1 = y1 + 20, lineX2 = x2 + button2.width / 2, lineY2 = y2;
  line(lineX1, lineY1, lineX2, lineY2);
  let arrowSize = 8;
  // use atan2 function to get angle of the line for arrow
  let angle = atan2(lineY2 - lineY1, lineX2 - lineX1);
  // calculate triangle points
  let x3 = lineX2 - arrowSize * cos(angle - QUARTER_PI);
  let y3 = lineY2 - arrowSize * sin(angle - QUARTER_PI);
  let x4 = lineX2 - arrowSize * cos(angle + QUARTER_PI);
  let y4 = lineY2 - arrowSize * sin(angle + QUARTER_PI);
  noStroke(); fill(255);
  triangle(lineX2, lineY2, x3, y3, x4, y4);
}

function dashLine(x1, y1, x2, y2) {
  let dashLength = 3, gapLength = 3;
  let lineLength = dist(x1, y1, x2, y2);
  let numDashes = floor(lineLength / (dashLength + gapLength));
  // Calculate the x and y increments for each dash
  let dx = (x2 - x1) / numDashes;
  let dy = (y2 - y1) / numDashes;
  // Draw the dashes
  stroke(255); strokeWeight(2);
  for (let i = 0; i < numDashes; i++) {
    let xDashStart = x1 + i * dx;
    let yDashStart = y1 + i * dy;
    let xDashEnd = xDashStart + dx / 2;
    let yDashEnd = yDashStart + dy / 2;
    line(xDashStart, yDashStart, xDashEnd, yDashEnd);
  }
}

function boundingBox(x, y, w, h) {
  fill(0, 0, 0, 0); stroke(255); strokeWeight(2);
  rect(x, y, w, h);
}

function draw() {
  background(57, 130, 55);
  lowerBackground();
  displayText();
  // draw connecting lines
  lineConnect(button1, button1.x, button1.y, button2, button2.x, button2.y);
  lineConnect(button1, button1.x, button1.y, button3, button3.x, button3.y);
  // lines adjusted for targets
  lineConnect(button5, button5.x - 30, button5.y + 10, button3, button3.x + 30, button3.y);
  lineConnect(button4, button5.x - 15, button4.y - 30, button1, button1.x + 70, button1.y + 10);
  lineConnect(button3, button3.x + 85, button3.y - 10, button6, button6.x - 45, button6.y + 20);
  lineConnect(button3, button3.x + 85, button3.y, button7, button7.x - 55, button7.y + 19);
  // draw dashed lines
  dashLine(480, 270, 530, 322);
  dashLine(530, 260, 715, 372);
  dashLine(600, 140, 500, 190);
  // draw bounding box
  boundingBox(410, 190, 118, 80);
}
