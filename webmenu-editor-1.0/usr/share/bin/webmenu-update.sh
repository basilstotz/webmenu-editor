#!/bin/sh

P="/usr/share/node/webmenu-editor/js"

GPREFIX="/home/share/share/bubendorf"

SRC="${HOME}/.config/webmenu/menu-xdg.json"

GROUPS=$(groups)

KLASSE=""

if echo ${GROUPS} | grep -q "lehrer";  then
      if [ -f ${HOME}/.config/webmenu/filter.json ]; then
         cat ${SRC} | ${P}/updateMenu.js ${HOME}/.config/webmenu/filter.json > ${HOME}/.config/webmenu/menu.json
      fi
else
   for K in ${GROUPS}; do
     case $K in
        2010a) KLASSE=$K
           ;;
        2010b) KLASSE=$K
           ;;
        2011a) KLASSE=$K
           ;;
        2011b) KLASSE=$K
           ;;
        2012a) KLASSE=$K
           ;;
        2012b) KLASSE=$K
           ;;
        2013a) KLASSE=$K
           ;;
        2013b) KLASSE=$K
           ;;
        2014a) KLASSE=$K
           ;;
        2014b) KLASSE=$K
           ;;
            *)
           ;;
     esac
    
     if [ -f ${GPREFIX}/${KLASSE}/.config/webmenu/filter.json ]; then
       cat ${SRC} | ${P}/updateMenu.js ${GPREFIX}/${KLASSE}/.config/webmenu/filter.json > ${HOME}/.config/webmenu/menu.json
     fi

   done       # for
fi            # if lehrer



exit 
