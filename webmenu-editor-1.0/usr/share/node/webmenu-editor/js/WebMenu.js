
///////////////////////////////////////////////////////////////////7
///////////////////////////////////////////////////////////////////
// private items 
////////////////////////////////////////////////////////////////////

// if false, there is no edit icon!
var root=false;


var fs = require('fs');
var spawn=require('child_process').spawn;

function loadJSONFilter(path) {
  var data=fs.readFileSync(path,'utf-8');
  if(data.length>0){
     return JSON.parse(data);
  }else{
     return filterNeu;
  }
}
    
function loadJSON(path) {
  var data=fs.readFileSync(path,'utf-8');
  return JSON.parse(data);
}
    
function saveJSON(path,json) {
  fs.writeFileSync( path, JSON.stringify( json, null, 2) );
}

/*
var hiddenItems = [ "sonstige", 
                     "system settings", 
                     "systemwerkzeuge",
                     "verschiedenes",
                     "ubuntu software-center"
                  ];       
*/

var filterNeu={
       "options": {
          "onlyStarred": false,
          "useNames": true,
          "useDescriptions": true,
          "useKeywords": true,
          "maxMenuContent": 20,
        },
       "keys": [],
       "stars": [],
       "results": []
     };


var menuNeu={
    "type" : "menu",
    "name" : "menuNeu",
    "items": []
   };


var newCat;
var res_html="";

///////////////////////////////////////////////////////////////////7
///////////////////////////////////////////////////////////////////
//  class dirPath /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////777


var DirPath = function(){

    this.level=-1;
    this.path=[];


    this.down=function(dirName){

       this.level++;
       this.path[this.level]=dirName;
    };


   this.init=function(){

        this.level=-1;
        this.path=[];
   };


   this.backTo=function(l){
             
             this.level=l*1; //type consevsion          
           };
            

   this.html = function(){

                   var t="";
                   var p;

                   for(var i=0;i<this.level+1;i++){
                      p=this.path[i];                    
                      t+="&nbsp;&nbsp;<span class='dir' id='"+p+"' level='"+i+"'>"+p+"</span>";
                   }
                   return t;
                };

};



///////////////////////////////////////////////////////////////////7
///////////////////////////////////////////////////////////////////
// public items 
////////////////////////////////////////////////////////////////////


var exports = module.exports = {};

///////////////////////////////////////////////////////////////////7
///////////////////////////////////////////////////////////////////
// class item  ////////////////////0///////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////7



var Itemm = module.exports.Itemm = function(item) {
//var Itemm;
//var Itemm = function(item) {
// console.log("");


//


   this.type=item.type;

   if(item.description)this.description=item.description;

   if(item.osIconPath)this.osIconPath=item.osIconPath;
   if(item.osIcon)this.osIcon=item.osIcon;

   if(item.cssIcon)this.cssIcon=item.cssIcon;
   if(item.keywords)this.keywords=item.keywords;

   //menu
   if(item.name)this.name=item.name;
   if(item.items)this.items=item.items;

   //custom
   //if(item.name)this.name=item.name;
   if(item.command)this.command=item.command;

   //desktop
   if(item.source)this.source=item.source;

   //webWindow web
   //if(item.name)this.name=item.name;
   if(item.url)this.url=item.url;
   if(item.width)this.width=item.width;
   if(item.height)this.height=item.height;


   //this.inResults=false;
   this.isStarred=false;


   
   this.getDisplayName = function(){
          return this.name;
   
        };


     this.getIdName = function() {
          return this.name;
      };



  this.addMenu= function(menu){
                    // add only non empty dirs
                    if(this.type=="menu"){
                       if(!this.items)this.items=[];
                       if(menu.items.length>0)this.items.push(menu);
                    }
                };


   this.addItem= function(item){
                    // same, but adds all items
                    if(this.type=="menu"){
                       if(!this.items)this.items=[];
                       this.items.push(item);
                     }
                 };

   this.removeItem = function(item){

                   var ita=[];
                   var it;
                   var i;
                   var res=false;

                   for(i=0;i<this.items.length;i++){
                       it=this.items[i];
                       if(it.name==item.name){
                          res=true;
                       }else{
                          ita.push(it);
                       }
                   }
                   if(res)this.items=ita;
                   return res;

                 };


   this.display = function(){
                    console.log(this.type+": "+this.displayName);
                 };


   this.html = function(){
                  var icon;
                  var cl;
                  var st="";
                  var or="";
                  var dsc=" &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;";
                  var dst;

                  if(this.osIconPath){
                      icon=this.osIconPath;
                  }else{
                      icon='/usr/share/pixmaps/notenmax.png';
                  }

                  if(this.type=="menu"){
                     or="<img class='ordner' src='../img/folder-icon-512x512.png'></img>";
                     cl="menu";
                  }else{
                     if(this.isStarred){
                        st="<img class='star' src='../img/star.png'></img>";
                        cl="ein";
                        dst="star.png";
                     }else{
                        cl="aus";
                        dst="star-off.png";
                     }
                  }

                  var t;
 
                t="<div class='"+cl+"' id='"+this.getIdName()+"'>";
                  if(this.type=="menu"){
                        t+=or;
                        t+="<img class='icon' src='"+icon+"'></img>";
                  }else{
                        t+="<img class='icon' src='"+icon+"'></img>";
                        t+=st;
                  }
                  t+="<span class='titel'>"+this.getDisplayName()+"</span>";
                  if(this.description){
                        dsc=this.description;
                  }else{
                        dsc="";
                  }

                  t+="<span class='desc'>";
                    t+="<img item='"+this.name+"' class='desk_star' src='../img/"+dst+"'>";
                    if(root)t+="<img item='"+this.name+"' class='desk_edit' src='../img/edit-list.png'>";
                    t+="<img style='width:40px;heigth:40px;margin-right:70px;' src='"+icon+"'>";
                    t+="<br/><b>"+this.name+"</b><br/>";
                    t+="<p class='launch' command='"+this.command+"'></p>";
                    t+=dsc+"<br/>";
                    if((this.keywords)&&(this.keywords.length>0)){
                        t+="<b>[";
                        for(var k=0;k<this.keywords.length;k++){
                           t+=this.keywords[k]+" ";
                        }
                        t+="]</b>";
                     }
                  t+="</span>";
                  
                 t+="</div>";

  
                  return t;
                
             };   


     this.launch = function(){
                   var str=this.command;
                   var str_arr=str.split(" ");  
                   
                   spawn(str_arr[0],[]);
              };
};

///////////////////////////////////////////////////////////////////7
///////////////////////////////////////////////////////////////////
// class menu //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////



module.exports.Menu = function() {



///////////////////golbals////////////////////////////////////////////////////

   this.numSearch=0;
   this.recursive=true;
   this.display={};
   this.displaySave={};

   this.hasChanged=false;
   

   this.dirPath= new DirPath();

   this.keywords=[];

   this.menuIn={};
   this.menuOut=new Itemm(menuNeu);

   this.filter=filterNeu;



   this.setTagMode = function(mode){
        root=mode;
   }
////////////////////////////////////////////////////////////////////////////////////////////77
//          function:     loadKeywords();
//          function:     initKeywords();
//          function:     mergeKeywords();
///////////////////////////////////////////////////////////////////////////////////////////////7


  this.initKeywords = function(){
                         if(root){
                            this.loadKeywords();
                            this.mergeKeywords();
                         }
                   };



   this.loadKeywords = function() {

                        var kw=[];
                        var i,j;

                        var p=process.env.HOME+"/.config/webmenu/keywords.json";
                        if(fs.existsSync(p)){
                               this.keywords=loadJSON(p);
                        }else{
                               this.keywords=[];
                        }
                    };

    this.saveKeywords = function() {

                        var p=process.env.HOME+"/.config/webmenu/keywords.json";
                        saveJSON(p,this.keywords);
                    };

    this.updateKeywords = function(item){

                        var i;
                        var ite;
                        var ff=false;

                        for(i=0;i<this.keywords.length;i++){
                           ite=this.keywords[i];
                           if(item.name==ite.name){
                              ite.description=item.description;
                              ite.keywords=item.keywords;
                              ff=true;
                           }
                        }

                        if(!ff){
                           tmp={};
                           //tmp= { "name" : "", "keywords" : [], "description": ""  };
                           tmp.name=item.name;
                           tmp.keywords=item.keywords;
                           tmp.description=item.description;
                           this.keywords.push(tmp);
                        }
                    };


    this.mergeTree = function(menu){
                     var i;
                     var item;
                     var j;

                     for(i=0;i<menu.items.length;i++){
                        item= menu.items[i];

                        if(item.type=="menu"){
                           this.mergeTree(item);
                        }else{
                           for(j=0;j<this.keywords.length;j++){
                             var kw=this.keywords[j];
                             if(kw.name==item.name){
                                item.keywords=kw.keywords;
                                item.description=kw.description;                                
                             }
                           }  
                        }
                     } //for
                 };


    this.mergeKeywords = function(){
                        this.mergeTree(this.menuIn);          
                    };


/*
  this.keyTree = function(menu) {
                     var i;
                     var item;
                     var tmp;
                     var n="";

                     for(i=0;i<menu.items.length;i++){
                        item= new Itemm(menu.items[i]);

                        if(item.type=="menu"){
                           this.keyTree(item);
                        }else{
                           tmp={};
                           tmp= { "name" : "", "keywords" : []  };
                           tmp.name=item.name;
                           this.keywords.push(tmp);
                        }
                     } //for
                 };


  this.initKeywords = function(){
                        this.autoKeywords();
                        this.loadKeywords();
                        this.saveKeywords();
                        this.mergeKeywords();
                   };


  this.autoKeywords = function() {
                   this.keywords=[];
                   this.keyTree(this.menuIn);
                   };




  this.loadKeywords = function() {

                        var kw=[];
                        var i,j;

                        var p=process.env.HOME+"/.config/webmenu/keywords.json";
                        if(fs.existsSync(p)){
                              kw=loadJSON(p);
                              for(i=0;i<kw.length;i++){
                                  for(j=0;j<this.keywords.length;j++){
                                       if(kw[i].name==this.keywords[j].name){
                                            this.keywords[j]=kw[i];
                                       }
                                  }
                              }
                        }
                    };

    this.saveKeywords = function() {

                        var p=process.env.HOME+"/.config/webmenu/keywords.json";
                        saveJSON(p,this.keywords);
                    };


    this.mergeTree = function(menu){
                     var i;
                     var item;
                     var j;

                     for(i=0;i<menu.items.length;i++){
                        item= menu.items[i];

                        if(item.type=="menu"){
                           this.mergeTree(item);
                        }else{
                           for(j=0;j<this.keywords.length;j++){
                             var kw=this.keywords[j];
                             if(kw.name==item.name){
                                item.keywords=kw.keywords;                                
                             }
                           }  
                        }
                     } //for
                 };


    this.mergeKeywords = function(){
                        this.mergeTree(this.menuIn);          

                    };
*/

////////////////////////////////////////////////////////////////////////////////////////////77
//          function:     initMenu();
//          function:     loadMenu();
///////////////////////////////////////////////////////////////////////////////////////////////7

   this.initMenuSync = function() {
                  this.loadMenuSync();
                  this.findFilterSync();
                  if(this.filter.stars.length===0)this.autoStar("n0 n1 lp21");
   };

   this.initMenu = function(callback) {
                       this.loadMenu(function(err){
                                       this.findFilter(callback);
                                       }
                                    );
                   };

   this.rearangeMenu = function(){
                 var src;
                 var dst;

                  var neuer= {
                    "name": "Andere",
                    "osIconPath": "/usr/share/icons/Faenza/categories/48/applications-other.png",
                    "type": "menu",
                    "items": []
                    };

                  //remove Software-Center"
                  dst= this.getItemByName("Ubuntu Software-Center");
                  if(dst)this.menuIn.removeItem(dst);
                  

                  //create new folder
                  this.menuIn.addItem(neuer);

                  //move dirs..
                  dst= new Itemm(this.getItemByName("Andere"));
                  if(dst){

                     src=this.getItemByName("Barrierefreiheit");                 
                     if(src){
                        dst.addItem(src);
                        this.menuIn.removeItem(src);
                     }
                     src=this.getItemByName("Chrome-Apps");                 
                     if(src){
                        dst.addItem(src);
                        this.menuIn.removeItem(src);
                     }

                     src=this.getItemByName("Hilfsprogramme");                 
                     if(src){
                        dst.addItem(src);
                        this.menuIn.removeItem(src);
                     }

                     src=this.getItemByName("Sonstige");                  
                     if(src){
                        dst.addItem(src);
                        this.menuIn.removeItem(src);
                     }


                     src=this.getItemByName("System Settings");  
                     if(src){
                        dst.addItem(src);
                        this.menuIn.removeItem(src);
                     }


                     src=this.getItemByName("Zubehör");                  
                     if(src){
                        dst.addItem(src);
                        this.menuIn.removeItem(src);
                     }

                     src=this.getItemByName("Systemwerkzeuge");                 
                     if(src){
                        dst.addItem(src);
                        this.menuIn.removeItem(src);
                     }

                     src=this.getItemByName("Verschiedenes");                 
                     if(src){
                        dst.addItem(src);
                        this.menuIn.removeItem(src);
                     }
                  } //if dst
      }; //rearange 

  
   this.loadMenuSync = function() {
      this.menuIn= new Itemm(loadJSON('/home/stotz.basil/.config/webmenu/menu-xdg.json'));
                  //this.rearangeMenu();
                  this.dirPath.init();
                  this.dirPath.down(this.getIdName(this.menuIn));

               };

   this.loadMenu = function(callback) {

                       fs.read('/opt/webmenu/menu.json','utf-8', function(err,data){             
                                                this.menuIn=JSON.parse(data);
                                                callback();
                                          }
                               );
                   };        

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////  alle i/o-sachen  sind hier  ////////////////////77
//          function:     findFilter();
//          function:     saveFilter();
///////////////////////////////////////////////////////////////////////////////////////////////7



   // load and save filter
   this.findFilterSync = function() {
                  if(fs.existsSync(process.env.HOME+'/.config/webmenu/filter.json')){
                      this.loadFilterSync(process.env.HOME+'/.config/webmenu/filter.json');
                  }else{
                     if(fs.existsSync('/opt/webmenu/filter.json')){
                        this.loadFilterSync('/opt/webmenu/filter.json');
                     }else{
                      // nichts
                     }
                  }
               };
   
  this.loadFilterSync = function(filterPath){
               this.filter=loadJSONFilter(filterPath);
             };


   this.loadFilter = function(filterPath, callback){
               fs.read(filterPath, 
                       function(err,data){
                            this.filter=JSON.parse(data);
                            callback();
                            }
                       );
               };


   this.findFilter = function(callback) {
              
                var path= process.env.HOME+'/.config/webmenu/filter.json';
                fs.exists(path,
                          function(err,result){
                               if(result){
                                   this.loadFilter(path,callback);
                               }else{
                                   path='/opt/webmenu/filter.json'; 
                                   fs.exists(path,
                                             function(err,result){
                                                  if(result){
                                                      this.loadFilter(path,callback);
                                                  }
                                             }
                                            );
                               }
                           }
                          );
             };        


   this.saveFilterSync = function(){
                 saveJSON(process.env.HOME+'/.config/webmenu/filter.json',this.filter);
                 hasChanged=true;
               };

 
   this.saveFilter = function(callback){
                 var p=process.env.HOME+'/.config/webmenu/filter.json';
                 fs.writeFile( p, JSON.stringify( this.filter, null, 2), callback );
                 this.hasChanged=true;
               };



    this.saveMenuSync = function(){
                      saveJSON(process.env.HOME+'/.config/webmenu/menu.json',this.menuOut);
                    };

 

    this.saveMenu = function(callback){
                 var p=process.env.HOME+'/.config/webmenu/menu.json';
                 fs.writeFile( p, JSON.stringify( this.menuOut, null, 2), callback );
               };

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////77
//               function: generateMenu();
///////////////////////////////////////////////////////////////////////////////////////////////7

                       
   this.generateMenu = function(){

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

//                      "osIconPath": "/home/stotz.basil/app/img/modern-storage-boxes.png",



             newCat = new Itemm(catInvisible);
            
             this.menuOut = new Itemm(menuNeu);

             this.menuOut=this.filterTree(this.menuIn); 
//             this.menuOut.addMenu(newCat);
             if(!this.filter.options.onlyStarred)this.menuOut.addMenu(newCat);
             this.saveMenuSync();


          };



   this.flat = [];
   this.filterFlat = function(menu){

                     for(i=0;i<menu.items.length;i++){
                        item= new Itemm(menu.items[i]);
                        if(item.type=="menu"){
                              this.filterFlat(item);
                        }else{
                              this.flat.push(item);
                        }
                     }
            };
                     


   this.filterTree = function(menu){                 

                     var i;
                     var j;
                     var k;
                     var item;
                     var flat=false;
                     var result= new Itemm(menu);

                     result.items=[];
                     
                     if(!this.filter.options.maxMenuContent)
                                this.filter.options.maxMenuContent=20;

                     flat=(this.countMenu(menu)<=this.filter.options.maxMenuContent);

                     for(i=0;i<menu.items.length;i++){
                        item= new Itemm(menu.items[i]);
                        delete item.isStarred;
                        if(item.type=="menu"){
                           
                           if(!flat){
                                result.addMenu(this.filterTree(item));
                           }else{

                                this.flat=[];
                                this.filterFlat(item);
                                for(k=0;k<this.flat.length;k++){
                                    if(this.isStarred(this.flat[k])){
                                      result.addItem(this.flat[k]);
                                    }else{
                                      newCat.addItem(this.flat[k]);
                                    }                        
                                }

                           }

                        }else{

                           if(this.isStarred(item)){
                              result.addItem(item);
                           }else{
                              newCat.addItem(item);
                           }                        

                        }
                     } //for
                     return result;
                   };


////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////77
//               function: countMenu()
///////////////////////////////////////////////////////////////////////////////////////////////7

   this.count = 0;

   this.countMenu = function(menu){

              this.count=0;          
              this.countTree(menu);
              return this.count; 
          };

   this.countTree = function(menu){                 

                     var i;
                     var item;

                     for(i=0;i<menu.items.length;i++){
                        item= new Itemm(menu.items[i]);

                        if(item.type=="menu"){
                           this.countTree(item);
                        }else{
                           if(this.isStarred(item))this.count++;                      
                        }
                     } //for
                   };


 

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////77
//               function: displayHTML()
///////////////////////////////////////////////////////////////////////////////////////////////7


   this.isInResults = function(item){
                     for(var i=0;i<this.filter.results.length;i++){
                        if(this.getIdName(item).search(this.filter.results[i])!=-1){
                           return true;
                        }
                     }
                     return false;
                  };

/*
   this.isHidden = function(item){
     var i;
     for(i=0;i<hiddenItems.length;i++){
         if(hiddenItems[i].search(getIdName(item)))return true;
     }
     return false;

   }
*/

    this.displayTree = function(menuIn){ 

//needs boolean: "recursive" (and "and")
                     
                     for(i=0;i<menuIn.items.length;i++){
                     var i;
                        var item= new Itemm(menuIn.items[i]);
                        if(item.type=="menu"){
                           if(this.recursive){
                                this.displayTree(item);
                           }else{
                                res_html+=item.html();
                           }         
                        }else{
                            if((this.isInResults(item))||(!this.recursive)){
                                if(this.isStarred(item)){
                                   item.isStarred=true;
                                   res_html+=item.html();
                                }else{
                                   item.isStarred=false;
                                   res_html+=item.html();
                                }
                            }                       
                        }
                     }
                     
                   };



   this.displayHTML = function(){



                        if(this.recursive)this.setDisplay(this.menuIn);
                            
                        if(!this.display.type)this.setDisplay(this.menuIn);

                        res_html="";
                        this.displayTree(this.display);
                        return res_html;           

                     };


   this.setRootDisplay = function(){
      this.setDisplay(this.menuIn);
      this.level=0;
   };

   this.setDisplay = function(item){
      this.display=item;
      //this.catName=this.getIdName(item);
   };

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////77
//          function:     getItemBy(name)
//          function:     getInMame(item);
//          function:     getDipslayName(item);
///////////////////////////////////////////////////////////////////////////////////////////////7


    this.getItemByName = function(name){
                     var id=this.getIdName(this.menuIn);
                     if(id===name){
                          return(this.menuIn);
                     }else{
                          return this.findTree(name,this.menuIn);
                     }
                   };

                 
    this.findTree = function(name,menu){ 

                     var i;
                     var item;
                     var id;
                                      
                     for(i=0;i<menu.items.length;i++){
                         item= menu.items[i];
                         id=item.name;
                         if(item.type=="menu"){
                             if(name===id){
                                return item;
                             }
                             var res = this.findTree(name,item);
                             if(res)return(res);         
                          }else{
                             if(name===id)return item;
                          }
                       }
                       return null;
                   };

     
     this.getDisplayName = function(app){
             return app.name;
    
        };


     this.getIdName = function(app) {
            return app.name;
      };


////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////77
//          function:  addStar(item);
//          function:  removeStar(item);
//          function:  toggleStar(item);
//          function:  isStarred(item);
///////////////////////////////////////////////////////////////////////////////////////////////7



   this.addStar = function(item){
                     if(!this.isStarred(item)){
                        this.filter.stars.push(this.getIdName(item));
                        this.saveFilter();
                        return true;
                     }
                     return false;
                   };


   this.removeStar = function(item){
                       var stars=[];
                       var idName;
                       var res=false;

                       for(var i=0;i<this.filter.stars.length;i++){
                          if(this.getIdName(item)!==this.filter.stars[i]){
                             stars.push(this.filter.stars[i]);              
                          }else{
                             res=true;
                          }
                       }
                       this.filter.stars=stars;
                       if(res)this.saveFilterSync();
                       return res;                                                   
                     };

   this.isStarred = function(item){
                      for(var i=0;i<this.filter.stars.length;i++){
                         if(this.getIdName(item)===this.filter.stars[i])return true;
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


////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////77
//               function: search(string)
///////////////////////////////////////////////////////////////////////////////////////////////7

    this.isFound = function(app,and){

                  var num_found=0;
                  var num_search;
                  var akw=[];
                  var i;
                 
                  //work on copy
                  if(app.keywords){
                      for(i=0;i<app.keywords.length;i++){
                        akw.push(app.keywords[i]);
                      }
                  }

                  if(this.filter.options.useNames){
                      akw.push(this.getIdName(app));
                      if(app.description)akw.push(app.description);                      
                  }

                  num_search= this.filter.keys.length;

                  //if(num_search===0)return true;
                  
                  for(i=0;i<akw.length;i++){
                          var kw=akw[i].toLowerCase();  

                          for(var j=0;j<this.filter.keys.length;j++){
                               var f=this.filter.keys[j].toLowerCase();
        
                               if(kw.search(f)!=-1)num_found++;
                          }
                   }
                   

                   var result=false;
                   if(and){
                       if(num_search<=num_found)result=true;
                   }else{
                       if(num_found>0)result=true;
                   }
                   return result;
    };


    this.searchTree = function(menuIn){ 

//needs boolean: "recursive" and "and"

                     var item= {};
                     var i;
 
                     

                     for(i=0;i<menuIn.items.length;i++){
                        item= menuIn.items[i];
                        if(item.type=="menu"){
                           this.searchTree(item);      
                        }else{
                           if(this.isFound(item,true)){
                              item.isInResults=true;
                              this.filter.results.push(this.getIdName(item));
                           }
                        }
                     }
                  };


   this.search = function(search_string){
                     var c=0;
                     var qa=search_string.split(" ");

                     this.filter.keys= [];
                     for(var i=0;i<qa.length;i++){
                        if(qa[i].length>1)this.filter.keys[c++]=qa[i];
                     }

                     this.numSearch=this.filter.keys.length;

                     var r=(this.numSearch!==0);

                     if(this.recursive!=r){
                         if(r){
                             this.displaySave=this.display;
                         }else{
                             this.display=this.displaySave;
                         }
                         this.recursive=r;
                     }
                      

                     this.filter.results=[];

                     this.searchTree(this.menuIn);

                     return this.filter.results.length>0;
                 };

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////77
//               function: autoStar(string)
///////////////////////////////////////////////////////////////////////////////////////////////7


    this.starTree = function(menuIn){ 

//needs boolean: "recursive" and "and"

                     var item= {};
                     var i;
 
                     

                     for(i=0;i<menuIn.items.length;i++){
                        item= menuIn.items[i];
                        if(item.type=="menu"){
                           this.starTree(item);      
                        }else{
                           if(this.isFound(item,false))this.addStar(item);
                        }
                      }
                     
                  };


   this.autoStar = function(search_string){
                 
                     var c=0;
                     var qa=search_string.split(" ");

                     this.filter.keys= [];
                     for(var i=0;i<qa.length;i++){
                        if(qa[i].length>1)this.filter.keys[c++]=qa[i];
                     }

                     this.starTree(this.menuIn);
                     this.saveFilterSync();

                     return this.filter.stars.length>0;
                  
                };


}; //end export

