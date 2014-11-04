


var fs = require('fs');
var spawn=require('child_process').spawn;

var allKeys="";
var akc=0;

var menuIn={};

var menuOut={
  "type": "menu",
  "name": {
    "en": "Categories",
    "fi": "Kategoriat",
    "sv": "Kategorier",
    "de": "Kategorien"
  },
  "items": []
};



var filter={
  "denyCat" : [ "Interactive whiteboards" ],
  "denyApp" : [ "eleet", "Google Earth - Legacy" ],
  "allowKey": [],
  "allowApp": []
};

function loadJSON(path) {
  return $.parseJSON(fs.readFileSync(path,'utf-8'));
}
    
function saveJSON(path,json) {
  var jstring= JSON.stringify( json, null, 2);
  fs.writeFile( path, jstring, function(error){ } );
}

function is_ok_cat(cat){
// yes, if none of the  cathegie match (from filter)
   for(var i=0;i<filter.denyCat.length;i++){
     var c=filter.denyCat[i];
     if(cat.name.en==c)return false;
   }
   return true;
}
//return ((cat.name.en!="Programming")&&(cat.name.en!="Interactive whiteboards")); 

function is_ok_app(app,and){
//yes, if all keyword match (from filter)

  var n=getDisplayName(app); 

  for(var i=0;i<filter.allowApp.length;i++){
     if(filter.allowApp[i]==n)return true; 
  }
 
  for(var i=0;i<filter.denyApp.length;i++){
     if(filter.denyApp[i]==n)return false; 
  }

  if(!app.keywords)return false;

  var num_found=0;
  var num_search=filter.allowKey.length;

  for(var i=0;i<app.keywords.length;i++){

    var kw=app.keywords[i];
    var ff=false;  

    for(var j=0;j<filter.allowKey.length;j++){

        var f=filter.allowKey[j];
        
        if(kw.search(f)!=-1){
           if(allKeys.search(kw)==-1)allKeys+=kw+" ";
           ff=true;
           break;
        }
    }
    if(ff)num_found++;
  }
 
  if(and){
    if(num_search==num_found)return true;
  }else{
    if(num_found>0)return true;
  }
  return false;
}

function countApps(){

  var res=0;
  for(var i=0;i<menuIn.items.length;i++){
     var cat =  menuIn.items[i];
     if(cat.type=="menu"){
     // if cathegorie is ok, add to menu
        if(is_ok_cat(cat)){
           //copy cathegorie
           // copy content of cathegorie
           for(var j=0;j<cat.items.length;j++){
              var app=cat.items[j];
              // if app is ok, add to menu
              if(is_ok_app(app),false)res++;
           }
         }
      }else{
         //res++;
      }
   }
  return res;
}

function displayMenu(){

  $("#ausgabe").html("");
  for(var i=0;i<menuIn.items.length;i++){
     var cat =  menuIn.items[i];
     if(cat.type=="menu"){
     // if cathegorie is ok, add to menu
        if(is_ok_cat(cat)){
           //copy cathegorie
           // copy content of cathegorie
           for(var j=0;j<cat.items.length;j++){
              var app=cat.items[j];
              // if app is ok, add to menu
              var t;
              if(is_ok_app(app,false)){
                 t=" <span class='aus' style='background:#f99;'>"+getDisplayName(app)+"</span> ";
              }else{
                 t="<span class='aus'>"+getDisplayName(app)+"</span> ";
              }
           
              $("#ausgabe").append(t);
           }
         }
      }else{
         //res++;
      }
   }
}


function getDisplayName(app){
  if(app.name){
    if(app.name.de){
        return app.name.de;
    }else{
        if(app.name.en){
           return app.name.en;
        }else{
           return app.name;
        }
    }
  }else{
    if(app.source)return app.source;
  }
}

function compileMenu(){

var napps=countApps();
var flat= (napps<=20);

allKeys="";
//akc=0;

var ao; 
var co=0; //corresp. to i
for(var i=0;i<menuIn.items.length;i++){
  var cat =  menuIn.items[i];
  if(cat.type=="menu"){
    // if cathegorie is ok, add to menu
    if(is_ok_cat(cat)){
       //copy cathegorie
       if(flat){  
          for(var j=0;j<cat.items.length;j++){
             var app=cat.items[j];
             if(is_ok_app(app,false)){
               menuOut.items[co++]=app;
             }
           }       
        }else{
          menuOut.items[co]={}; 
          menuOut.items[co].type=cat.type;
          menuOut.items[co].name=cat.name;
          menuOut.items[co].description=cat.description;

          if(cat.osIcon){
             menuOut.items[co].osIcon=cat.osIcon;
          }else{
             menuOut.items[co].osIconPath=cat.osIconPath;
          }

          if(cat.id){
             menuOut.items[co].id=cat.id;
          }

          menuOut.items[co].items=[];
          // copy content of cathegorie
          ao=0; //corresp. to j    
          for(var j=0;j<cat.items.length;j++){
             var app=cat.items[j];
             // if app is ok, add to menu
             if(is_ok_app(app,false)){
               menuOut.items[co].items[ao++]=app;
             }
           }
           co++;
         } // if flat
    } // if(is_ok_cat(cat))
  }else{  //cat.type!="menu"
         //menuOut.items[co++]=cat;
  }
    
} //for menuIn.items
}

function doit(){
  var q=$("#query").val();
  var qa=q.split(" ");


  filter.allowKey= new Array();
  var c=0;
  for(var i=0;i<qa.length;i++){
     if(qa[i].length>1)filter.allowKey[c++]=qa[i];
  }

  console.log("******"+q+" "+c);


  compileMenu();

  

  $("#allKeys").html(allKeys);

  displayMenu();
}



menuIn=loadJSON(process.env.HOME+'/app/menu.json');


//applayMenu();
//function applyMenu(){
//  saveJSON(process.env.HOME+'/.0config/webmenu/menu.json',menuOut);
//  spawn("webmenu-spawn" , [ '--webmenu-exit' ] );
//}  


$("#query").keyup(function(){doit();});
$(".aus").onhover(function(){this.css("background","#00f");
