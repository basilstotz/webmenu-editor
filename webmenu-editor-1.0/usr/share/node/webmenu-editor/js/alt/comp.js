// Hello.
//
// This is JSHint, a tool that helps to detect errors and potential
// problems in your JavaScript code.
//

var menu= new Menu(); 


//var spawn=require('child_process').spawn;
//var WebMenu = require('./../js/WebMenu.js');
//var menu = new WebMenu.Menu();







//bs var exports = module.exports = {};

///////////////////////////////////////////////////////////////////7
///////////////////////////////////////////////////////////////////
// private items 
////////////////////////////////////////////////////////////////////


var fs = require('fs');


function loadJSON(path) {
  return JSON.parse(fs.readFileSync(path,'utf-8'));
}
    
function saveJSON(path,json) {
  fs.writeFileSync( path, JSON.stringify( json, null, 2) );
}



function is_starred(app,filter){

  var n=getIdName(app).toLowerCase(); 
  //console.log("filter: *"+n+"*");
  for(var i=0;i<filter.stars.length;i++){
     if(filter.stars[i].toLowerCase().search(n)!=-1){return true;} 
  }
  return false;
}



/*
function is_ok_cat(cat){
  return true;
}
*/

/*
function countApps(){
  console.log("anzahl: "+filter.stars.length);
  return filter.allowApp.length;
 
}
*/
function getDisplayName(app){

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
     if(app.source){
         return app.source;
     }else{
         return "*********************";
     }
  }
}


function getIdName(app){

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

///////////////////////////////////////////////////////////////////7
///////////////////////////////////////////////////////////////////
// public items 
////////////////////////////////////////////////////////////////////

//var Item = module.exports.Item = function(item) {
var Item = function(item) {

   this.type=item.type;
   this.idName=getIdName(item);
   this.displayName=getDisplayName(item);
   if(item.osIconPath)this.osIconPath=item.osIconPath;
   this.found=false;
   this.starred=false;
   if(item.items)this.items=item.items;
   

   this.addItem= function(item){
                    if(this.type=="menu"){
                       if(!this.items)this.items=[];
                       this.items.push(item);
                    }
                 };

   this.display = function(){
                    console.log(this.type+": "+this.displayName);
                 };

   this.html = function(){
                  var t="";
                  var h="";
                  if(this.osIconPath){h="<br/><img style='width:60px;height:60px;opacity:0.3;' src='"+this.osIconPath+"'></img>";}
                   t="<div style='width:120px;text-align:center;display:inline-block;margin:10px;'>"+h+"<br/><span style='font-size:10px;font-weight:bold;' class='aus' >"+this.displayName+"</span></div>";
                  return t;
                };
                     

};



//bs module.exports.Menu = function() {
var Menu = function() {


  this.menuNeu={
    "type": "menu",
    "name": {
      "en": "Categories",
      "fi": "Kategoriat",
      "sv": "Kategorier",
      "de": "Kategorien"
    },
    " items": []
   };

  this.catInvisible={
    "type": "menu",
    "name": {
    "en": "Invisible",
    "fi": "Invisible",
    "sv": "Invisible",
    "de": "         "
    },
    "items": []
    };

   this.newCat={};
   


   this.menuIn={};
   this.menuOut=new Item(this.menuNeu);

   this.initMenu = function() {
                  this.loadMenu();
                  this.loadFilter();
   };

  
   this.loadMenu = function() {
                  this.menuIn=loadJSON('/opt/webmenu/menu.json');
               };


   this.copyMenu = function() {
                  saveJSON(process.env.HOME+'/.config/webmenu/menu.json',this.menuIn);
               };

    this.saveMenu = function(){
                      saveJSON(process.env.HOME+'/.config/webmenu/menu.json',this.menuOut);
                    };
                       

   this.filterMenu = function(){
                    if(!this.menuIn.type)this.loadMenu();
                    //if(!this.filter.allowApp)this.loadFilter();

                    //reset newCat and recalc menuOut
                    this.newCat = new Item(this.catInvisible);
                    this.menuOut= this.filterTree(this.menuIn);

               };

   this.filterTree = function(menuIn){                 
                     var item= {};
                     var i;


                     for(i=0;i<menuIn.items.length;i++){
                        item= menuIn.items[i];
                        if(item.type=="menu"){
                           this.menuOut.addItem(this.filterTree(item));         
                        }else{
                           if(is_starred(item,this.filter)){
                              this.menuOut.addItem(item);
                           }else{
                              this.newCat.addItem(item);
                           }                        
                        }
                     }
                     return this.menuOut.addItem(this.newCat);
                   };

////Ab hier ja 2 
   this.displayHTML = function(){
       this.displayTree(this.menuIn);           
                     };



    this.displayTree = function(menuIn){ 

//needs boolean: "recursive" (and "and")
                     var res="";

                     var i;
                     for(i=0;i<menuIn.items.length;i++){
                        var item= new Item(menuIn.items[i]);
                        if(item.type=="menu"){
                           if(true){
                                this.displayTree(item);
                           }else{
                                res+=item.html();
                           }         
                        }else{
                            if(this.isFound(item,this.filter,true)){
                                if(is_starred(item,this.filter)){
                                   res+=item.html();
                                }else{
                                   res+=item.html();
                                }
                            }                       
                        }
                     }
                     return res;
                   };


///bis hier



    this.getItemByName = function(name){
                   return this.findTree(name,menuIn);
                   };

                 
    this.findTree = function(name,menuIn){ 

//needs boolean: "recursive" (and "and")
                 

                     var i;
                     for(i=0;i<menuIn.items.length;i++){
                        var item= new Item(menuIn.items[i]);

                        if(item.type=="menu"){
                           this.findTree(name,item);         
                        }else{
                           if(name.toLowerCase().search(menu.items[i].toLowerCase())){
                             return item;
                           }
                        }
                      }
                      return null;
                   };
           this.filter={
       stars: [],
       keys: [],
       results: []          
                };


/////////////////////////////////////////////////7
//////////////////////////////////////////////////////////////////////777

   // load and save filter
   this.loadFilter = function() {
                  if(fs.existsSync(process.env.HOME+'/.config/webmenu/filter.json')){
                     this.filter=loadJSON(process.env.HOME+'/.config/webmenu/filter.json');
                  }else{
                     if(fs.existsSync('/opt/webmenu/filter.json')){
                        this.filter=loadJSON('/opt/webmenu/filter.json');
                     }else{
                      // nichts
                     }
                  }
               };
   this.saveFilter = function(){
                 saveJSON(process.env.HOME+'/.config/webmenu/filter.json',this.filter);
               };

   ///////////////////////////////////////////////////////////////////////////////////////
   // the star business
   this.addStar = function(item){
                     if(!this.isStarred(item)){
                        this.filter.stars.push(item);
                        this.saveFilter();
                        return true;
                     }
                     return false;
                   };


   this.removeStar = function(item){
                       for(var i=0;i<this.filter.stars.length;i++){
                          if(getIdName(item).search(this.filter.stars[i])!=-1){
                             this.filter.stars.slice(i,1);
                             this.saveFilter();
                             return true;              
                          }
                       }
                       return false;                                                   
                     };
   this.isStarred = function(item){
                      for(var i=0;i<this.filter.stars.length;i++){
                         if(getIdName(item).search(this.filter.stars[i])!=-1)return true;
                      }
                      return false;
                    };

   this.toggleStar = function(item){
                             if(this.isStarred(item)){
                                  return this.removeStar(item);
                              }else{
                                  return this.addStar(item);
                             }
                    };




///////////////////////777777
    this.searchTree = function(menuIn){ 

//needs boolean: "recursive" and "and"

                     var item= {};
                     var i;
 
                     
                     this.results=[];

                     for(i=0;i<menuIn.items.length;i++){
                        item= menuIn.items[i];
                        if(item.type=="menu"){
                           this.searchTree(item);      
                        }else{
                           if(this.isFound(item,true))this.results.push(getIdName(item));
                        }
                     }
                  };
                 
   // search business
   this.search = function(search_string){
                     var c=0;
                     var qa=search_string.split(" ");

                     this.filter.keys= [];
                     for(var i=0;i<qa.length;i++){
                        if(qa[i].length>1)this.filter.keys[c++]=qa[i];
                     }

                     this.searchTree(this.menuIn);
                     return this.filter.results.length>0;
                 };



   this.isResult = function(item){
                     for(var i=0;i<this.filter.results.length;i++){
                        if(getIdName(item).search(this.filter.results[i])!=-1){
                           return true;
                        }
                     }
                     return false;
                  };

this.isFound = function(app,and){

                  var num_found=0;
                  var num_search=this.filter.keys.length;

                  if(this.filter.keys.length===0)return true;

                  if(app.keywords){
                      for(var i=0;i<app.keywords.length;i++){
                          var kw=app.keywords[i].toLowerCase();
                          var ff=false;  

                          for(var j=0;j<this.filter.keys.length;j++){
                               var f=this.filter.keys[j].toLowerCase();
        
                               if(kw.search(f)!=-1){
                                 //if(allKeys.search(kw)==-1)allKeys+=kw+" ";
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
                   return result;
};


}; //end export


//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////7
/////////////////////////////////////////////////////////////////////////////////////777

function redrawMenu() {
    $("#ausgabe").html("").append(menu.displayHTML());
    $(".aus").click(function(){
                           var item=menu.getItemByName($(this).html());
                           if(item){
                               menu.toggleStar(item);
                               redrawMenu();                       
                           }
    });
}


function doit(){

  menu.search($("#query").val());
  redrawMenu();
}


//
  

// main init
menu.initMenu();

//events

$("#query").keyup(function(){doit();});
$("#applay").click(function(){
                     spawn("webmenu-spawn" , [ '--webmenu-exit' ] );
                      }  
                  );

redrawMenu();


