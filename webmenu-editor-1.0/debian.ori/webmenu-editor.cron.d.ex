#
# Regular cron jobs for the webmenu-editor package
#
0 4	* * *	root	[ -x /usr/bin/webmenu-editor_maintenance ] && /usr/bin/webmenu-editor_maintenance
