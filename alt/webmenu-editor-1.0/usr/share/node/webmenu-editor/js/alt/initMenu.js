


var WebMenu= require('./WebMenu');

var fs = require('fs');
var spawn=require('child_process').spawn;



function getGroupName(){
  var n=process.env.GRUPPEN;
  //console.log("gruppen: "+n);
  nArray=n.split(":");
  var l=nArray.length;
  //console.log("laenge: "+l);

  for(var i=0;i<l;i++){
    if(nArray[i]=='lehrer')return 'lehrer';
  }

  for(var i=0;i<l;i++){
     //console.log("teste: "+nArray[i]);
     switch(nArray[i]){
        case '2010A': return '2010A';
        case '2010B': return '2010B';
        case '2011A': return '2011A';
        case '2011B': return '2011B';
        case '2012A': return '2012A';
        case '2012B': return '2012B';
        case '2013A': return '2013A';
        case '2013B': return '2013B';
        case '2014A': return '2014A';
        case '2014B': return '2014B';
        default: break;
     }
  }
  return "gibtesnicht";
}




function hosttype(){
 var ht=fs.readFileSync('/etc/puavo/hosttype','utf-8');

 return ht.slice(0,ht.length-1);
}

function smbget(src,dst){
           
          
           var ls=spawn("smbget", ["--nonprompt","--update","--outputfile "+dst, src ]);
           console.log("spawn"); 

/*
           ls.stdout.on('data', function (data) {
               console.log('stdout: ' + data);
           });

           ls.stderr.on('data', function (data) {
               console.log('stderr: ' + data);
           });

           ls.on('close', function (code) {
               console.log('child process exited with code ' + code);
           })
*/
}


function autoFilter(){

  var ownMenuName=process.env.HOME+'/.config/webmenu/filter.json';
  var ownSmbName='smb://bootserver/'+process.env.USER+'/.config/webmenu/filter.json';
  var groupMenuName='/home/share/share/bubendorf/'+getGroupName()+'/.config/webmenu/filter.json';
  var groupSmbName='smb://bootserver/share/share/bubendorf/'+getGroupName()+'/.config/webmenu/filter.json';
  var ownGroupName=process.env.HOME+"/.config/webmenu/group-filter.json"
  var schoolMenuName="/opt/webmenu/filter.json";


  var dateiName;
  var ht=hosttype();


  switch(ht){

     case 'fatclient*':
     case 'thinclient':

          console.log("fat!!");
          //eigenes
          if(fs.existsSync(ownMenuName)){
             return ownMenuName;
          }else{
             //gruppe
             if(fs.existsSync(groupMenuName)){
                 return groupMenuName;
             }else{
                 //schule
                 if(fs.existsSync(schoolMenuName)){
                    return schoolMenuName;
                 }else{
                    return "";
                 }
             }
          }
          break;

     case 'laptop':

          console.log("laptop!!");

          smbget(ownSmbName,ownMenuName);
          smbget(groupSmbName,ownGroupName);

          if(fs.existsSync(ownMenuName)){
             return ownMenuName;
          }else{
             //gruppe
             if(fs.existsSync(ownGroupName)){
                 return ownGroupName;
             }else{
                 //schule
                 if(fs.existsSync(schoolMenuName)){
                    return schoolMenuName;
                 }else{
                    return "";
                 }
             }
          }
          break;

     default: 
             console.log("wrong client type: only for thinclient fatclient and laoptop");
             return null;
          break;

  }
}


var i=2;
//console.log("args:");
while(process.argv[i]){
  switch(process.argv[i]){
    case '-i': //set input file
          console.log("-i "+process.argv[++i]);
        break;
    case '-o': //set outputfile
          console.log("-o "+process.argv[++i]);
        break;
    case '-f': //set filter file
          console.log("-f "+process.argv[++i]);
        break;
    case '-d': //set depth
          console.log("-d "+process.argv[++i]);
        break;
    case '-n': //no other apps allowed
            console.log("-n ");
        break;
    case '-?':
    case '-h': 
    default: 
  console.log("usage: env GRUPPEN=\"$(groups|sed 's/ /:/g')\" node "+process.argv[1]+" [-i infile] [-o outfile] [-f filtefile] [-d output depth] [-n no other app than in filter]");
        return 0;
        break;

  }
  i++;
}

//webmenu.Menu.loadFilter(autoFilter());

var menu= new WebMenu.Menu();

console.log("autofilter: "+autoFilter());

menu.loadMenu();
menu.loadFilter();
menu.filterMenu();
menu.saveMenu();

//main
//menuIn=loadJSON(process.env.HOME+"/alle.json");

/*
menuIn=loadJSON('/opt/webmenu/menu.json');
filter=loadFilter();
if(!filter){
    console.log("fehler: keine filter gefunden");
}else{
    compileMenu();
    saveJSON(process.env.HOME+'/.config/webmenu/menu.json',menuOut);
//spawn("webmenu-spawn" , [ '--webmenu-exit' ] );
}
*/
