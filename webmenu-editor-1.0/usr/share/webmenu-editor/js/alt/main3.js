



var fs = require('fs');
var spawn=require('child_process').spawn;

var allKeys="";
var akc=0;

var mode=true;

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

var catInvisible={
  "type": "menu",
  "name": {
    "en": "Invisible",
    "fi": "Invisible",
    "sv": "Invisible",
    "de": "         "
  },
  "items": []
};

var filter={
  "denyCat" : [ "Interactive whiteboards" ],
  "denyApp" : [ "eleet", "Google Earth - Legacy" ],
  "allowKey": [ "n0","n1","z1","z2" ],
  "allowApp": []
};


function loadJSON(path) {
  return $.parseJSON(fs.readFileSync(path,'utf-8'));
}
    
function saveJSON(path,json) {
  var jstring= JSON.stringify( json, null, 2);
//  fs.writeFile( path, jstring, function(error){ } );
  fs.writeFileSync( path, jstring);
}

function loadFilter(){

  var f;
  var n=process.env.HOME+"/.config/webmenu/filter.json";
  if(fs.existsSync(n)){
     f=loadJSON(n);
     filter.allowApp=f.allowApp;    
  }
}

function saveFilter(){

  var n=process.env.HOME+"/.config/webmenu/filter.json";
   saveJSON(n,filter);
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

//-1: no match
//0; if all keyword match (from filter)
//1: if 0 and it is in applist

  var n=getDisplayName(app); 
  var is_starred=false;

  for(var i=0;i<filter.allowApp.length;i++){
     if(filter.allowApp[i].search(n)!=-1)is_starred=true; 
  }
 
  for(var i=0;i<filter.denyApp.length;i++){
     if(filter.denyApp[i]==n)return -1; 
  }

  var num_found=0;
  var num_search=filter.allowKey.length;

  if(app.keywords){


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
  }

  var result=false;
  if(and){
      if(num_search==num_found)result=true;
  }else{
    if(num_found>0)result=true;
  }
  if(result){
     if(is_starred){return 1;}else{return 0;}
  }else{
     return -1;
  }
}

/*
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
              if(is_ok_app(app,false))res++;
           }
         }
      }else{
         //res++;
      }
   }
  return res;
}
*/



function is_member(name){

 for(var i=0;i<filter.allowApp.length;i++){
   if(filter.allowApp[i]==name)return true;
 }
 return false;
}

function add_member(name){
  filter.allowApp[filter.allowApp.length]=name;
}

function remove_member(name){
//  var n=filter.allowApp;
  var tmp= [];
  var c=0;
  for(var i=0;i<filter.allowApp.length;i++){
     if(filter.allowApp[i]!=name)tmp.push(filter.allowApp[i]);
  }
  filter.allowApp= [];
  filter.allowApp=tmp;
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
             


              switch(is_ok_app(app,mode)){

                 case 0:
              var h="";
              if(app.osIconPath){var h="<br/><img style='width:60px;height:60px;opacity:0.3;' src='"+app.osIconPath+"'></img>";}

                    t="<div style='width:120px;text-align:center;display:inline-block;margin:10px;'>"+h+"<br/><span style='font-size:10px;font-weight:bold;' class='aus' >"+getDisplayName(app)+"</span></div>";
                    $("#ausgabe").append(t);
                    break;
                 case 1:
              var h="";
              if(app.osIconPath){var h="<br/><img width='60px' height='60px' src='"+app.osIconPath+"'></img>";}

                    t="<div style='border-width:10px;border-color:#444;width:120px;background:#eee;text-align:center;display:inline-block;margin:10px;'>"+h+"<br/><span class='aus' style='font-weight:bold;font-size:10px;'>"+getDisplayName(app)+"</span></div> ";
                    $("#ausgabe").append(t);
                    break;
                 default:
                    break;
    
              }       
              
           }
         }
      }else{
         //res++;
      }
      $(".aus").click(function(){
                           var n=$(this).html();
                           if(is_member(n)){
                              //remove it
                              remove_member(n);
                           }else{
                             //add it
                             add_member(n);
                           }
                           displayMenu();
                           saveFilter();
                           loadFilter();
                        }
                         
                      );

   }
}


function getDisplayName(app){

  if(app.source)return app.source;
  if(app.name){
    if(app.name.de){
        return app.name.de;
    }else{
        if(app.name.en){
           return app.name.en;
        }else{
           if(app.name.fi){
              return app.name.fi;
           }else{
              return app.name;
           }
       }
    }
  }else{
    return "*********************";
  }
}


function compileMenu(){

//var napps=countApps();
var napps=40;
var flat= (napps<=20);

allKeys="";
//akc=0;
var ic=0;
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
             if(is_ok_app(app,mode)>=0){
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
             if(is_ok_app(app,mode)>=1){
               menuOut.items[co].items[ao++]=app;
             }else{
               catInvisible.items[ic++]=app;
             }
           }
           co++;
         } // if flat

    } // if(is_ok_cat(cat))

  }else{  //cat.type!="menu"
      menuOut.items[co++]=catInvisible;
  }
    
} //for menuIn.items

}



function doit(){
  var q=$("#query").val();
  var qa=q.split(" ");
  filter.allowKey= [];
  var c=0;
  for(var i=0;i<qa.length;i++){
     if(qa[i].length>1)filter.allowKey[c++]=qa[i];
  }

  console.log("******"+q+" "+c);


  compileMenu();

    $("#allKeys").html(allKeys);

  displayMenu();
}




loadFilter();
menuIn=loadJSON(process.env.HOME+'/alle.json');
compileMenu();

//applayMenu();
//function applyMenu(){
saveJSON(process.env.HOME+'/.config/webmenu/menu.json',menuOut);
//spawn("webmenu-spawn" , [ '--webmenu-exit' ] );
//}  


$("#query").keyup(function(){doit();});


