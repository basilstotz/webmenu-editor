#!/bin/sh

P="/usr/share/node/webmenu-editor/js"

GPREFIX="/home/share/share/bubendorf"

SRC="/opt/webmenu/menu-xdg.json"

GROUPS=$(groups)

KLASSE=""


#default
     if ! [ -f ${HOME}/.config/webmenu/filter.json ]; then
           cp /opt/webmenu/filter-default.json ${HOME}/.config/webmenu/filter.json
     fi

      if [ -f ${HOME}/.config/webmenu/filter.json ]; then
         cat ${SRC} | ${P}/updateMenu.js ${HOME}/.config/webmenu/filter.json > ${HOME}/.config/webmenu/menu.json
      fi


#bubendorf
if echo ${GROUPS} | grep -q "lehrer";  then
      if [ -f ${HOME}/.config/webmenu/filter.json ]; then
         cat ${SRC} | ${P}/updateMenu.js ${HOME}/.config/webmenu/filter.json > ${HOME}/.config/webmenu/menu.json
      fi
else
   for K in ${GROUPS}; do
     case $K in
        2010a) KLASSE="2010A"
           ;;
        2010b) KLASSE="2010B"
           ;;
        2011a) KLASSE="2011A"
           ;;
        2011b) KLASSE="2011B"
           ;;
        2012a) KLASSE="2012A"
           ;;
        2012b) KLASSE="2012B"
           ;;
        2013a) KLASSE="2013A"
           ;;
        2013b) KLASSE="2013B"
           ;;
        2014a) KLASSE="2014A"
           ;;
        2014b) KLASSE="2014B"
           ;;
        2015a) KLASSE="2015A"
           ;;
        2015b) KLASSE="2015B"
           ;;
            *)
           ;;
     esac
   done       # for
    
   if [ -f ${GPREFIX}/${KLASSE}/.config/webmenu/filter.json ]; then
       cat ${SRC} | ${P}/updateMenu.js ${GPREFIX}/${KLASSE}/.config/webmenu/filter.json > ${HOME}/.config/webmenu/menu.json
   fi

fi            # if lehrer



exit 
