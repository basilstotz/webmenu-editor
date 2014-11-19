
///////////////////////////////////////////////////////////////////7
///////////////////////////////////////////////////////////////////
// private items 
////////////////////////////////////////////////////////////////////

// if false, there is no edit icon!

var root=false;
if(process.env.TAGS)root=true;


var fs = require('fs');
var spawn=require('child_process').spawn;

function loadJSONFilter(path) {
  if(fs.existsSync(path)){
     var data=fs.readFileSync(path,'utf-8');
     if(data.length>0)return JSON.parse(data);
  }
  return filterNeu;
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
          "maxMenuContent": 20
        },
       "keys": [],
       "stars": [],
       "results": []
     };


var menuNeu={
    "type" : "menu",
    "name" : "Anwendungen",
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
                       return this.items[ this.items.push(item)-1 ];
                     }
                     return null;
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
                  var dsc="";
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
                        t+="<span style='fond-weight:bold;font-size:10px;'>";
                        for(var k=0;k<this.keywords.length;k++){
                           if(this.keywords[k]=="|"){
                              t+="<br/>";
                           }else{
                              t+=this.keywords[k]+" ";
                           }
                        }
                        t+="</span>";
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

/////////////////////////////////////////////////////////////////////////////////////////////7

   this.groups=[];
   this.groupsInit = function(){

               var s=process.env.GROUPS;
               this.filterGroup="";
               this.groups=[];
               //s="lehrer";               
               if((s.search("lehrer")!=-1)||(s.search("maint")!=-1)){
                 var sa=s.split(':');
                 for(var i=0;i<sa.length;i++){
                    switch(sa[i]){
                        case '2010a': this.groups.push('2010a');
                                      break;
                        case '2010b': this.groups.push('2010b');
                                      break;
                        case '2011a': this.groups.push('2011a');
                                      break;
                        case '2011b': this.groups.push('2011b');
                                      break;
                        case '2012a': this.groups.push('2012a');
                                      break;
                        case '2012b': this.groups.push('2012b');
                                      break;
                        case '2013a': this.groups.push('2013a');
                                      break;
                        case '2013b': this.groups.push('2013b');
                                      break;
                        case '2014a': this.groups.push('2014a');
                                      break;
                        case '2014b': this.groups.push('2014b');
                                      break;
                        case 'maint': this.groups.push('maint');
                                      break;
                        case 'lehrer': this.groups.push('lehrer');
                                      break;
               
                        default: break;

                    }
                 }   
                 
               }else{
                 process.exit();
               }
            };

            this.groupsHtml = function(){
                     var t="<label for='groups'></label>";
                         t+="<select style='font-size:18px;' name='group' id='group'>";
                         for(var i=0;i<this.groups.length;i++){
                            var n=this.groups[i];
                            switch(n){
                              case 'lehrer':
                                      t+="<option value='' selected='selected'>Mein Menu</option>"; 
                                    break;
                              case 'maint':
                                      t+="<option value='' selected='selected'>System Menu</option>"; 
                                    break;
                              default:
                                      t+="<option value='"+n+"'>Klasse: "+n+"</option>";
                                    break;
                            }
                         }
                         t+="</select>";
                         return t;
                   };

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



////////////////////////////////////////////////////////////////////////////////////////////77
//          function:     initMenu();
//          function:     loadMenu();
///////////////////////////////////////////////////////////////////////////////////////////////7

   this.initMenuSync = function() {
                  this.groupsInit();
                  this.loadMenuSync();
                  this.findFilterSync();
                  if(this.filter.stars.length===0)this.autoStar("n0 n1");
   };

   this.initMenu = function(callback) {
                       this.loadMenu(function(err){
                                       this.findFilter(callback);
                                       }
                                    );
                   };

//////////////////////////////////////////////////////////////////////////////////////////////////7
////////////////////////////////////////////////////////////////////////////////////////////////////

   this.rearangeMenu = function(){
  
                  //this is the config for the keeps and removes
                  var other="Andere";
                  var drop= [ ];
                  var keep= [ "Bildung","Büro","Grafik","Internet","Multimedia","Software-Entwicklung","Spiele","Wissenschaft" ];


                  //template for new folder
                  var neuer= {
                    "name": "Other",
                    "osIconPath": "/usr/share/icons/Faenza/categories/48/applications-other.png",
                    "type": "menu",
                    "items": []
                    };
                  neuer.name=other;

                  //////////////////////////////////////////////////////////////////////////
                 

                  var src;
                  var dst;

                  // 1. remove all "not folders"
                  for(var i=0;i<this.menuIn.items.length;i++){
                     item = this.menuIn.items[i];
                     if(item.type!="menu")this.menuIn.removeItem(item);
                  }

                  // 2. remove all drop's
                  for(var i=0;i<drop.length;i++){
                      dst= this.getItemByName(drop[i]);
                      if(dst)this.menuIn.removeItem(dst);
                  }


                  // 3. move all, which are not in "keep-members", to "other-folder"
                  dst= new Itemm(this.menuIn.addItem(neuer));

                  if(dst){
                     for(var i=0;i<this.menuIn.items.length;i++){
                         var item=this.menuIn.items[i];
                         var n=item.name;

                         //look wether n is in keep-list
                         var found=false;
                         for(var j=0;j<keep.length;j++){
                             var k=keep[j];
                             if(n==k)found=true;
                         }

                         //if not in keep:
                         if(!found){   
                             //move dirs..
                             src=this.getItemByName(n);                 
                             if(src){
                                dst.addItem(src);
                                this.menuIn.removeItem(src);
                             }
                         }   
                      }     
                  }        // if(dst)
      }; //rearange 

  
   this.loadMenuSync = function() {
      this.menuIn= new Itemm(loadJSON('/opt/webmenu/menu-xdg.json'));
                  //this.rearangeMenu();
                  this.dirPath.init();
                  this.dirPath.down(this.getIdName(this.menuIn));

               };

    this.saveMenuSync = function(){
                      if(this.filterGroup==""){
                           saveJSON(process.env.HOME+'/.config/webmenu/menu.json',this.menuOut);
                      }else{
                           if(this.filterGroup=="maint"){
                              saveJSON(process.env.HOME+'/.config/webmenu/menu-maint.json',this.menuOut);
                           }else{
                              saveJSON("/home/share/share/bubendorf/"+this.filterGroup+'/.config/webmenu/menu.json',this.menuOut);
                           }
                      }
                };

 
/*

   this.loadMenu = function(callback) {

                       fs.read('/opt/webmenu/menu.json','utf-8', function(err,data){             
                                                this.menuIn=JSON.parse(data);
                                                callback();
                                          }
                               );
                   };        
*/

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////  alle i/o-sachen  sind hier  ////////////////////77
//          function:     findFilter();
//          function:     saveFilter();
///////////////////////////////////////////////////////////////////////////////////////////////7



   // load and save filter
   // groups????????????????????????????????????????????????'

   this.filterGroup="";

   this.setFilterGroup = function(group){
                   this.filterGroup=group;
              };

   this.findFilterSync = function() {
                  var p;

                  if(this.filterGroup==""){
                       p=process.env.HOME+'/.config/webmenu/filter.json';                  
                  }else{
                      if(this.filterGroup=="maint"){
                         p=process.env.HOME+'/.config/webmenu/filter-maint.json';
                      }else{                  
                         p="/home/share/share/bubendorf/"+this.filterGroup+"/.config/webmenu/filter.json";
                      }
                  }

                  if(fs.existsSync(p)){
                      this.loadFilterSync(p);
                  }else{
                      this.loadFilterSync('/opt/webmenu/filter.json');
                  }

               };


   
  this.loadFilterSync = function(filterPath){
               this.filter=loadJSONFilter(filterPath);
             };


   this.saveFilterSync = function(){

                  var p;
                  if(this.filterGroup==""){
                       p=process.env.HOME+'/.config/webmenu/filter.json';                  
                       this.hasChanged=true;
                  }else{
                      if(this.filterGroup=="maint"){
                         p=process.env.HOME+'/.config/webmenu/filter-maint.json';
                      }else{                  
                         p="/home/share/share/bubendorf/"+this.filterGroup+"/.config/webmenu/filter.json";
                      }
                  }

                 saveJSON(p,this.filter);
               };

 

/*
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


   this.saveFilter = function(callback){
                 var p=process.env.HOME+'/.config/webmenu/filter.json';
                 fs.writeFile( p, JSON.stringify( this.filter, null, 2), callback );
                 this.hasChanged=true;
               };

*/

/*
    this.saveMenu = function(callback){
                 var p=process.env.HOME+'/.config/webmenu/menu.json';
                 fs.writeFile( p, JSON.stringify( this.menuOut, null, 2), callback );
               };
*/

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////77
//               function: generateMenu();
///////////////////////////////////////////////////////////////////////////////////////////////7


  this.cleanKeywords = function(item){
          var i;
          var kw=[];
          if(item.keywords){
             for(i=0;i<item.keywords.length;i++){
                 if(item.keywords[i].length>2)kw.push(item.keywords[i]);
             }
             item.keywords=kw;
          }
          if(item.isStarred)delete item.isStarred;
  };  

                       
  this.cleanMenu = function(){
           this.cleanTree(this.menuOut);
        };

  this.cleanTree = function(dir){
       for(var i=0;i<dir.items.length;i++){
          var it=dir.items[i];
          if(it.type=="menu"){
              this.cleanTree(it);
          }else{
             this.cleanKeywords(it);
          }
      }      
  };    


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


             newCat = new Itemm(catInvisible);
             this.menuOut = new Itemm(menuNeu);

             var c=this.countMenu(this.menuIn);
             if(c<this.filter.options.maxMenuContent){
                this.flat=[];
                this.filterFlat(this.menuIn);
                for(var i=0;i<this.flat.length;i++){
                   var item=this.flat[i];
                   if(this.isStarred(item))this.menuOut.addItem(item);
                }
             }else{
                this.menuOut=this.filterTree(this.menuIn);
                if(!this.filter.options.onlyStarred)this.menuOut.addMenu(newCat);
             } 
          
             this.cleanMenu();
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
      this.dirPath.level=0;
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
                        this.saveFilterSync();
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

