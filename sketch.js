function setup() {
  let target = document.getElementById('header');
  let width = target.offsetWidth;
  let height = target.offsetHeight;

  let canvas = createCanvas(width, height);
  canvas.parent(target)
}

function draw() {
  background('#262626');
  circle(mouseX, mouseY, 50);
}


function windowResized() {
  let target = document.getElementById('header');
  let width = target.offsetWidth;
  let height = target.offsetHeight;
  resizeCanvas(width, height);  
}