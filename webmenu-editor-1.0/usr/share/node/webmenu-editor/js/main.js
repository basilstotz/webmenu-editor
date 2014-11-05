// Hello.
//
// This is JSHint, a tool that helps to detect errors and potential
// problems in your JavaScript code.
//
// To start, simply enter some JavaScript anywhere on this page. Your
// report will appear on the right side.
//Hilfsprogramme
// Additionally, you can toggle specific options in the Configure
// menu.


var spawn=require('child_process').spawn;
var WebMenu = require('./../js/WebMenu.js');

var menu = new WebMenu.Menu();

//any arg sets tag mode true!
if(process.argv[2])menu.setTagMode(true);

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
                               t="<img style='float:right;width:80px;height:80px;' src='"+item.osIconPath+"'>";
                               t+="<h3 class='in_name'>"+item.name+"</h3>";
                               t+="<form>";
                                  t+="Keywords<input size='50' class='in_keys' type='text' value='"+key_str+"'><br/><br/>";
                                  t+="Description<textarea class='in_desc' cols='50' rows='5'>"+item.description+"</textarea>";
                               t+="</form>";
                               $("#dialog").html(t);

                               $("#dialog").dialog("open");
                             }     
                           
                       
                         }
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
width:515,
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
                           var desc=u.find(".in_desc").val();
                           var keys=u.find(".in_keys").val();
                           var id=u.find(".in_name").html();

                           var item=menu.getItemByName(id);
                           if(item){
                             item.description=desc;
                             item.keywords=[];
                             var spl=keys.split(" ");
                             for(var i=0;i<spl.length;i++){
                                   if(spl[i].length>1)item.keywords.push(spl[i]);
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

