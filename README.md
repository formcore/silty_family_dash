# silty_ui
##Full-screen display for use on a Raspberrypi.
##With nginx installed allows for some childrens rewards system based on rules and rewards.

###Displays in full screen application:

Nginx status

Samba status

Mumble-server status

Deluge status

CPU usage

RAM usage

Uptime

Disk usage (Defualted to /mnt/lib for my use case, may set it to default to root if there's no ext hdd setup)

Date and time

Section for notes (requires nginx)

Section for "stars", reward system for children (requires nginx)

#setup
```
sudo apt-get install git samba samba-common-bin deluged deluge-console mumble-server nginx php5 php5-fpm sqlite3 php5-sqlite python3-psutil python3-tk python3-pil.imaging
```

***
##PLANNED UPDATES:

* Find some use for the remaining panel, currently showing an image.  
* Set "stars" pane to show users individually, as opposed to totals shown currently.  
* ~~Add a check for existence of disk directory, if not found default to SD card on pi.~~  
* Move all "main" panels out of root and into a frame, allowing me to remove and replace with other "fullscreen" dialogues.  

###Update HTML section to allow:
* ~~Adding new users~~  
* ~~Changing usernames~~  
* Admin panel to see other users additions  
* Update each page to allow applying to certain users (example, stars given to x instead of falling into a general nameless star pool)
* ~~Change "rewards" to use locally hosted images~~  
* Update each section to only show non-admin users content relative to themselves  
* Add some functionality to add links to sidebar (currently only editable direct through Sqlite3)  
* Remove "icomoon" icons in favour of basic buttons  
* ~~Move "change password" to some sort of controls page~~  
* Figure out a way to set the "rules" to explain which users a particular rules applies to using a single column in the table, and only show rules that apply to the person viewing (unless admin)  
* Create seperate javascript / php code to handle each HTML page individually, allowing for greater customisation of each.  
* Recreate CSS for a newer, simpler layout, dropping mostly bloat formatting and cleaning the code up in general.  

## Known bugs

* Adding stars on website may crash "Silty ui" fullscreen display, checks are in place but testing is required  
* Uptime sometimes shows "garbage" numbers at the end of the string, this is something to do with the admittedly awful method of just cutting up a long string of time  
* img1 doesn't scale proportionately to source image, probably won't fix this as it's merely placeholder  
* New posts on website use double newlines instead of just one.  
* Right now, I think it'd be too easy to SQL inject the site... if the website is public facing, back stuff up and be careful until it's fixed :(
