

var spawn=require('child_process').spawn;
var WebMenu = require('./../js/WebMenu.js');

var menu = new WebMenu.Menu();


var tags= { "zyklen"   : [ "1.Zyklus","2.Zyklus","3.Zyklus" ],
            "bereiche" : [ "Sprachen","Mathematik","NMG","Gestalten","Musik","Medien","Beruf" ],
            "fächer"   : [  "Deutsch", "Französisch", "English", "Arithmetik", "Algebra", "Geometrie",
                            "Statistik", "Biologie", "Psychologie", "Chemie", "Physik", "Geologie",
                            "Geologie", "Wirtschaft", "Ökologie", "Ökonomie", "Geografie", "Astronomie",
                            "Geschichte", "Soziologie", "Ethik", "Philosofie", "Zeichnen",
                            "Werken" ],
            "nomen"   : [  "Sprache", "Literatur", "Kultur", "Zahl",
                            "Variable", "Form", "Raum", "Grössen", "Funktion","Zufall",
                            "Idenität", "Körper", "Gesundheit", "Tiere","Pflanzen","Stoff",
                            "Energie", "Bewegung", "Natur", "Technik", "Konsum", "Leben",
                            "Lebensweise", "Lebensraum", "Räume", "Zeit", "Dauer", "Wandel",
                            "Gemeinschaft", "Gesellschaft", "Grunderfahrungen", 
                            "Werte", "Normen", "Religionen",
                            "Weltansichten","Musik"  ],
            "verben"  : [  "hören", "lesen", "sprechen", "schreiben", "singen", "bewegen",
                            "tanzen", "musizieren", "gestalten", "operieren", "benennen", "erforschen",
                            "argumentieren", "mathematisieren", "darstellen", 
                            "erklären", "herstellen", "üben", "suchen", "spielen",
                            "prüfen", "lernen"  ]
          };


function stringToTag(tag_string){

   var etag ={ "zyklen"   : [ ],
            "bereiche" : [ ],
            "fächer"   : [],
            "nomen"    : [ ],
            "verben"   : [ ]
             };


   tsa=tag_string.split("|");
   for(var i=0;i<tsa.length;i++){
      var u=tsa[i];
      ua=u.split(" ");
      for(var j=0;j<ua.length;j++){
        if(ua[j].length>=2){
          switch(i){
            case 0:
               etag.zyklen.push(ua[j]);
               break;
            case 1:
               etag.bereiche.push(ua[j]);
               break;
            case 2:
               etag.nomen.push(ua[j]);
               break;
            case 3:
               etag.verben.push(ua[j]);
               break;
          }
       }
  
     }        
   }
   return etag;
}


   

function tagsHtml(tag_string){
    var i,j;
    var n;
    var cl;
    var found;
    var tag=stringToTag(tag_string);
    var s="";
    // Zyklus ////////////////////////////////////////////////////////////77
    s+="<p  id='zyklus'>";
    s="<b>Zyklen:</b> ";
    for(i=0;i<tags.zyklen.length;i++){
       n=tags.zyklen[i];
       found=false;
       for(j=0;j<tag.zyklen.length;j++){
         if(n==tag.zyklen[j])found=true;
       }
       if(found){cl="class='on zykeln'";}else{cl="class='zykeln'";}
       s+="<span name='"+n+"' "+cl+" >"+n+"</span> ";
    }
    s+="</p>";
    s+="";

    // Bereich ////////////////////////////////////////////////////////////77
    s+="<p id='bereiche'>";
    s+="<b>Bereich:</b> ";
    for(i=0;i<tags.bereiche.length;i++){
       n=tags.bereiche[i];
       found=false;
       for(j=0;j<tag.bereiche.length;j++){
         if(n==tag.bereiche[j])found=true;
       }
       if(found){cl="class='on bereiche'";}else{cl="class='bereiche'";}
       s+="<span name='"+n+"' "+cl+" >"+n+"</span> ";
    }
    s+="</p>";
    s+="";

    // Fächer ////////////////////////////////////////////////////////////77
    s+="<p style='margin-bottom:0px;' id='fächer'>";
    s+="<b>Facher:</b> ";
    for(i=0;i<tags.fächer.length;i++){
       n=tags.fächer[i];
       found=false;
       for(j=0;j<tag.fächer.length;j++){
         if(n==tag.fächer[j])found=true;
       }
       if(found){cl="class='on fächer'";}else{cl="class='fächer'";}
       s+="<span name='"+n+"' "+cl+" >"+n+"</span> ";
    }
    s+="</p>";
    s+="";

    // Nomen ////////////////////////////////////////////////////////////77
    s+="<p  style='margin-bottom:0px;' id='nomen'>";
    s+="<b>Nomen:</b> ";
    for(i=0;i<tags.nomen.length;i++){
       n=tags.nomen[i];
       found=false;
       for(j=0;j<tag.nomen.length;j++){
         if(n==tag.nomen[j])found=true;
       }
       if(found){cl="class='on nomen'";}else{cl="class='nomen'";}
       s+="<span name='"+n+"' "+cl+" >"+n+"</span> ";
    }
    s+="</p>";
    s+="";

    // Verben ////////////////////////////////////////////////////////////77
    s+="<p  style='margin-bottom:0px;' id='verben'>";
    s+="<b>Verben:</b> ";
    for(i=0;i<tags.verben.length;i++){
       n=tags.verben[i];
       found=false;
       for(j=0;j<tag.verben.length;j++){
         if(n==tag.verben[j])found=true;
       }
       if(found){cl="class='on verben'";}else{cl="class='verben'";}
       s+="<span name='"+n+"' "+cl+" >"+n+"</span> ";
    }
    s+="</p>";
    s+="";


    return s;
}


                            
//any arg sets tag mode true!
if(process.argv[2])menu.setTagMode(true);
menu.setTagMode(true);


function redrawMenu(isMenu) {

   var t;  



   if(!menu.recursive){
       $("#pfad").html( menu.dirPath.html() ).show("fade",100,function(){attach_path();});
   }else{
       $("#pfad").html( menu.dirPath.html() ).hide("fade",100,function(){attach_path();});
   }
  

   if(menu.hasChanged){
       t="<img style='width:20px;height:20px;' src='./../img/applay.png'></img>";
   }else{
       t="";
   }

   $("#applay").html(t);

   if(isMenu){
       $("#ausgabe").hide("fade",50,function(){
                                  $(this).html(menu.displayHTML());
                                  $(this).show("fade",100,function(){attach_display();});
                             }
                      );
   }else{
       $("#ausgabe").html(menu.displayHTML()).fadeIn("fade",1000,function(){attach_display();}); 
   }       

}


function attach_path(){
   $(".dir").click(function(){

                           var level=$(this).attr("level");
                           var id=$(this).attr("id");
                           var item=menu.getItemByName(id);

                           if((item)&&(item.type==="menu")){
                              menu.dirPath.backTo(level)
                              menu.setDisplay(item);
                              redrawMenu(true);
                           }
                        }
                     );
}  
   
 
function compileOutString(){
                                                $("#out").html("");

                                                $("#zyklus").find(".on").each(function(){
                                                               $("#out").append($(this).html()+" ");
                                                              });    
                                                $("#out").append("| ");
 
                                                $("#bereiche").find(".on").each(function(){
                                                               $("#out").append($(this).html()+" ");
                                                              });    
                                                $("#out").append("| ");
 
                                                $("#fächer").find(".on").each(function(){
                                                               $("#out").append($(this).html()+" ");
                                                              });    
                                                $("#out").append("| ");
 
                                                $("#nomen").find(".on").each(function(){
                                                               $("#out").append($(this).html()+" ");
                                                              });    
                                                $("#out").append("| ");
 
                                                $("#verben").find(".on").each(function(){
                                                               $("#out").append($(this).html()+" ");
                                                              });    
                                                $("#out").append("");
}


function attach_display(){

   $(".menu").click(function(){
                           var id=$(this).attr("id");
                           var item=menu.getItemByName(id);
                           if((item)&&(item.type==="menu")){
                              menu.dirPath.down(id);
                              menu.setDisplay(item);
                              redrawMenu(true);
                           }
                        }
                     );

   $(".desk_star").click(function(){
                           var id=$(this).attr("item");
                           var item=menu.getItemByName(id);
                           if(item){
                             if(menu.toggleStar(item)){
                                    hasChanged=true;
                                    redrawMenu(true);
                             }     
                           }
                       
                         }
                  );


   $(".desk_edit").click(function(){
                           var t;
                           var id=$(this).attr("item");
                           var item=menu.getItemByName(id);

                           var key_str="";
                           if((item.keywords)&&(item.keywords.length>0)){
                               for(var i=0;i<item.keywords.length;i++){
                                  key_str+=item.keywords[i]+" ";
                               }
                           }

                           if(item){
                               t="<img style='float:left;margin-right:50px;margin-bottom:40px;position:relative;top:25px;width:80px;height:80px;' src='"+item.osIconPath+"'>";
                               t+="<table style='width:80px;float:right;margin-top:25px;'><tr> <td style='background:#0f0;height:10px;'></td> <td style='background:#00f'></td><td style='background:#f00'></td> <td style='background:#000'></td></tr></table>";
                               t+="<h3 class='in_name'>"+item.name+"</h3>";
                               
                               t+="<span id='beschreibung' contenteditable='true'>"+item.description+"</span><br/>";

                               t+="<span style='font-size:12px;font-weight:bold;' id='out'></span><br/><br/>";

                               //t+="<form id='formular' >";

                                 //t+="Keywords<input size='50' class='in_keys' type='text' value='"+key_str+"'><br/><br/>";
                                  t+="<div style='padding:10px;background:#eee;font-size:12px'>"+tagsHtml(key_str);+"</div>";

                                  //t+="Description<textarea class='in_desc' cols='50' rows='5'>"+item.description+"</textarea>";
                               //t+="</form>";
                               $("#dialog").html("<span style='vertical-align:top;'>"+t+"</span>");

                               ////////////////////////////////////////////////////////////////777
                               $(".zykeln").click(function(){
                                                $(this).toggleClass("on");
                                                compileOutString();
                                             });
                               $(".bereiche").click(function(){
                                                $(this).toggleClass("on");
                                                compileOutString();
                                             });
                               $(".fächer").click(function(){
                                                $(this).toggleClass("on");
                                                compileOutString();
                                             });
                               $(".nomen").click(function(){
                                                $(this).toggleClass("on");
                                                compileOutString();
                                             });
                               $(".verben").click(function(){
                                                $(this).toggleClass("on");
                                                compileOutString();
                                             });
                               ///////////////////////////////////////////////////////////////////7
                               $("#dialog").dialog("open");
                               compileOutString();
                             }//if item     
                       

    
                       
                         } // function
                  );


/////////////////////////////////////////77

   $(".aus").hover(function(){
                         $(this).find(".desc").toggle("fade",450);
                       }
                  );

  $(".ein").hover(function(){
                         $(this).find(".desc").toggle("fade",450);
                      }
                 );
/*
  $(".launch").click(function(){
                           var command=$(this).attr("command"); 
                           var cmd_arr=command.split(" ");
                           var arg_arr=[];
                           for(var i=1;i<cmd_arr.length;i++){
                                arg_arr.push(cmd_arr[i]);
                           }
                           spawn(cmd_arr[0],arg_arr);
                           redrawMenu(true);
                        }
                        
                     );
*/

};
                         
// this schould be non blocking:
//                             if(menu.toggleStar(item)){
//                               menu.saveFilter(function(){redrawMenu();});
//                             }


                     

function doit(query){
  menu.search(query);
  menu.generateMenu();
  redrawMenu(true);
};


function applay(){
   //menu.generateMenu();
   spawn("webmenu-spawn" , [ '--webmenu-exit'] );
   spawn("notify-send", [ "The new menu is ready!" ] );
   menu.hasChanged=false;
   $("#applay").html("");
}

// main ////////////////////////////////////////////////////////////////////////////7777


$("#dialog").dialog({
resizable:false,
height: 500,
width:800,
autoOpen: false,
show: {
effect: "fade",
duration: 200
},
hide: {
effect: "fade",
duration: 200
},
 modal: true,
buttons: {
"Speichern": function() {  
                           var u=$("#dialog");  
                           var desc=u.find("#beschreibung").html();
                           var keys=u.find("#out").html();
                           var id=u.find(".in_name").html();

                           var item=menu.getItemByName(id);
                           if(item){
                             item.description=desc;
                             item.keywords=[];
                             var spl=keys.split(" ");
                             for(var i=0;i<spl.length;i++){
                                   item.keywords.push(spl[i]);
                             }
                             menu.updateKeywords(item);
                             menu.saveKeywords();
                           }
                           $( this ).dialog( "close" );
                           redrawMenu(true);
                      },

"Abbrechen": function() {
                           $( this ).dialog( "close" );
                      }
}// buttons

}); // #dialog



menu.initMenuSync();
menu.initKeywords();

$("#query").keyup(function(){doit($("#query").val());});
$("#applay").click(function(){applay();});  

$("#groups").html(menu.groupsHtml());
$("#group").change(function(){
                        //console.log($(this).val());
                        //menu.saveFilterSync();
                        menu.setFilterGroup($(this).val());
                        menu.findFilterSync();
                        menu.setRootDisplay();
                        menu.generateMenu();
                        doit($("#query").val());
                        //redrawMenu();
                        //menu.setDisplay(menu.menuIn);
                        //menu.dirPath.init();
                     });


//menu.setDisplay(menu.menuIn);
//menu.setRootDisplay();
doit("");

