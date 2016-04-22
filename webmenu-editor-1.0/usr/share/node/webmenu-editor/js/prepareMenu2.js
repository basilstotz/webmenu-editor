#!/usr/bin/env node

var WebMenu = require("./WebMenu.js");

var menu= new WebMenu.Menu();


var things="";


process.stdin.on('readable', function() {

  var chunk = process.stdin.read();
  if (chunk !== null)things+=chunk;

});




process.stdin.on('end', function() {


  menu.menuIn=new WebMenu.Itemm(JSON.parse(things));

  //menu.loadKeywords();
  //menu.mergeKeywords();
  menu.rearangeMenu();

  process.stdout.write(JSON.stringify(menu.menuIn,null,2));

});
