#!/usr/bin/env node

var WebMenu = require("./WebMenu.js");

var menu= new WebMenu.Menu();


var things="";

if(!process.argv[2]){
  process.stderr.write( "error: missing parameter filterFile.json\n"+
                        "usage: cat inMenu.json | "+
                        process.argv[1]+
                        " filterFile.json > outMenu.json\n\n"
                      );
  process.exit();
} 


process.stdin.on('readable', function() {

  var chunk = process.stdin.read();
  if (chunk !== null)things+=chunk;

});




process.stdin.on('end', function() {

  menu.menuIn=new WebMenu.Itemm(JSON.parse(things));

  menu.loadFilterSync(process.argv[2]);
  menu.generateMenu();

  process.stdout.write(JSON.stringify(menu.menuOut,null,2));

});


