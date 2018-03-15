
let ww = 1280;
let hh = 1280;
let rotangle = 0;
let img;
let rx = 0;
let ry = 0;
let r = 200;
let eqdata;
rows = [];
let zoomZ = -50;

function preload() {

  img = loadImage('earth.jpg');
 //earthquakes = loadStrings("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv");
  earthquakes = loadStrings('all_month.csv');
}

function setup(){
  createCanvas(ww, hh, WEBGL);

  //Make a P5 table to store data
  eqdata = new p5.Table();
  eqdata.addColumn('cX'); //0
  eqdata.addColumn('cY'); //1
  eqdata.addColumn('cZ'); //2
  eqdata.addColumn('mag'); //3
  eqdata.addColumn('raxis'); //4
  eqdata.addColumn('xaxis'); //5
  eqdata.addColumn('angleb');//6

  //Extract data from CSV, calculate and store in the table
  for (var i = 0; i < earthquakes.length; i++) {
      var data = earthquakes[i].split(/,/);
    //console.log(data);
    var lat = data[1];
    var lon = data[2];
    var mag = data[4];

    let thetha = PI/2 +radians(lat);
    let phi = PI/2 - radians(lon);
    let cX = -(r * sin(thetha) * cos(phi));
    let cZ = -(r * sin(phi)* sin(thetha));
    let cY = (r * cos(thetha));
    let posvector = createVector(cX, cY, cZ);
    let xaxis = createVector(1, 0, 0);
    let raxis = p5.Vector.cross(xaxis,posvector);
    let angleb = p5.Vector.angleBetween(xaxis,posvector);
    //console.log(angleb);
    mag = pow(10, mag);
    mag = sqrt(mag);
    var magmax = sqrt(pow(10, 10));
    var d = map(mag, 0, magmax, 0, 180);
    rows[i] = eqdata.addRow();
    rows[i].set('cX', cX);
    rows[i].set('cY', cY);
    rows[i].set('cZ', cZ);
    rows[i].set('mag', d);
    rows[i].set('raxis', raxis);
    rows[i].set('xaxis', xaxis);
    rows[i].set('angleb', angleb);
  }
}

function mouseWheel(event) {
//print(event.delta);
//move the square according to the vertical scroll amount
zoomZ += event.delta;
//uncomment to block page scrolling
//return false;
}



function draw(){

  background(0);

  translate(0,-200,zoomZ);

  //Draw and rotate earth
  rotateY(rotangle);
  texture(img);
  sphere(r);

  pointLight(255,255,255, 0, 0, 0);
  ambientLight(100,200,255);
  pointLight(255,255,255, 1, 1, 0);

  //Apply mouse drag rotations
  rotateY(rx);
  rotateX(ry);

  //Rotate the globe if the mouse is pressed
  if (mouseIsPressed) {
    rx += (mouseX - pmouseX) / 100;
    ry += (mouseY - pmouseY) / -800;
  }
  let dirX = mouseX - width / 2;
  let dirY = mouseY - height / 2;

  //Get table data and draw a box for each earthequake entry
  let r_axis;let d_mag;let angle_b;
  let x; let y; let z; let boxheight;

  for (let i = 1; i< earthquakes.length; i++){
    x = eqdata.get(i,0);
    y = eqdata.get(i,1);
    z = eqdata.get(i,2);
    d_mag = eqdata.get(i,3);
    r_axis = eqdata.get(i,4);
    angle_b = eqdata.get(i,6);
    boxheight = d_mag - r/2;
    push();
     translate(x,y,z);
     rotate(angle_b, [r_axis.x, r_axis.y, -r_axis.z]);

     //Not sure why it doesn't work if you apply rotations seperately like below
      //    rotateZ(angle_b, abs(r_axis.z));
      //   rotateY(angle_b, abs(r_axis.y));
      //   rotateX(angle_b, abs(r_axis.x));
      fill(200,0,255);
      //normalMaterial();
      box(boxheight,1,1);
    pop();

  }

    rotangle = rotangle + 0.05;
}
