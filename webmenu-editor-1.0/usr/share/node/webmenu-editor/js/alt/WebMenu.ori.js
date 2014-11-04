

var exports = module.exports = {};

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


/*
function is_starred(app,filter){

  var n=getIdName(app).toLowerCase(); 
  //console.log("filter: *"+n+"*");
  for(var i=0;i<filter.stars.length;i++){
     if(filter.stars[i].toLowerCase().search(n)!=-1){return true;} 
  }
  return false;
}
*/


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

var Item = module.exports.Item = function(item) {

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
                  if(this.osIconPath){var h="<br/><img style='width:60px;height:60px;opacity:0.3;' src='"+this.osIconPath+"'></img>";}
                   t="<div style='width:120px;text-align:center;display:inline-block;margin:10px;'>"+h+"<br/><span style='font-size:10px;font-weight:bold;' class='aus' >"+this.displayName+"</span></div>";
                  return t;
                };
                     

}



module.exports.Menu = function() {

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
   }

  
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
                            if(is_found(item,this.filter,true)){
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
                     var res="";

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
                   
/*

}


/////////////////////////////////////////////////////////////////7
////////////////////////////////////////////////////////////////77


var Filter = module.exports.Filter = function(){
*/
   this.filter={
       stars: [],
       keys: [],
       results: []          
                };

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
                        return true
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
                     var menu_count=0;
                     
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

                  if(this.filter.keys.length==0)return true;

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



/////////////////////////////////////////////////////////////////
//// fertig lustig hier
/////////////////////////////////////////////////////////////////
  
/*
function copyMenu(menuIn){


  var menuOut= new Folder(menuIn);
  var item={};
  var i;

  for(i=0;i<menuIn.items.length;i++){
     item= menuIn.items[i];
     if(item.type=="menu"){
        menuOut.addItem(copyMenu(item));
     }else{
        menuOut.addItem(item);
     }
  }
  return menuOut;
}


function createFolder(item){

          var catEmpty={};

          catEmpty.items=[]; 
          catEmpty.type=item.type;

          if(item.name)catEmpty.name=item.name;
          if(item.descripption)catEmpty.description=item.description;
          if(item.keywords)catEmpty.keywords=item.keywords;
          if(item.id)catEmpty.id=item.id;

          if(item.osIcon){
             catEmpty.osIcon=item.osIcon;
          }else{
             catEmpty.osIconPath=item.osIconPath;
          }

          return catEmpty;
}


//////////////////////////////////////////////////////////////////

function compileMenu(){

var napps=countApps();
var flat= (napps<=20);


//akc=0;
var ic=0;
var ao; 
var co=0; //corresp. to i

for(var i=0;i<menuIn.items.length;i++){
  var cat =  menuIn.items[i];
  if(cat.type=="menu"){
    // if cathegorie is ok, add to menu
    if(true){

       //copy cathegorie
       if(flat){ 
          for(var j=0;j<cat.items.length;j++){
             var app=cat.items[j];
             if(is_ok_app(app)){
               menuOut.items[co++]=app;
             }
           }
        }else{
          catEmpty={};
          catEmpty.items=[]; 
          catEmpty.type=cat.type;
          catEmpty.name=cat.name;
          catEmpty.description=cat.description;

          if(cat.osIcon){
             catEmpty.osIcon=cat.osIcon;
          }else{
             catEmpty.osIconPath=cat.osIconPath;
          }

          if(cat.id){
             catEmpty.id=cat.id;
          }

          // copy content of cathegorie
          ao=0; //corresp. to j    
          for(var j=0;j<cat.items.length;j++){
             var app=cat.items[j];
             // if app is ok, add to menu
             //console.log("app: *"+getDisplayName(app)+"*");
             if(is_ok_app(app)){
               //console.log("is_ok_app");
               catEmpty.items[ao++]=app;
             }else{
               //console.log("is_no_app");
               catInvisible.items[ic++]=app;
             }
           }
           if(ao>0)menuOut.items[co++]=catEmpty;
         } // if flat

       } // if(is_ok_cat(cat))
    }else{  //cat.type!="menu"
      //nichts
    }  
  } //for menuIn.items
  if(ic>0)menuOut.items[co++]=catInvisible;
}


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
*/
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
/*
}


function loadFilter(){

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
             return loadJSON(ownMenuName);
          }else{
             //gruppe
             if(fs.existsSync(groupMenuName)){
                 return loadJSON(groupMenuName);
             }else{
                 //schule
                 if(fs.existsSync(schoolMenuName)){
                    return loadJSON(schoolMenuName);
                 }else{
                    return null;
                 }
             }
          }
          break;

     case 'laptop':

          console.log("laptop!!");
          smbget(ownSmbName,ownMenuName);
          smbget(groupSmbName,ownGroupName);

          if(fs.existsSync(ownMenuName)){
             return loadJSON(ownMenuName);
          }else{
             //gruppe
             if(fs.existsSync(ownGroupName)){
                 return loadJSON(ownGroupName);
             }else{
                 //schule
                 if(fs.existsSync(schoolMenuName)){
                    return loadJSON(schoolMenuName);
                 }else{
                    return null;
                 }
             }
          }
          break;

     default: 
             console.log("default: ????????????????'");
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




//main
menuIn=loadJSON(process.env.HOME+"/alle.json");
//menuIn=loadJSON('/opt/webmenu/menu.json');
filter=loadFilter();
if(!filter){
    console.log("fehler: keine filter gefunden");
}else{
    compileMenu();
    saveJSON(process.env.HOME+'/.config/webmenu/menu.json',menuOut);
//spawn("webmenu-spawn" , [ '--webmenu-exit' ] );
}
*/
