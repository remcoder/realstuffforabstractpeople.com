#!/bin/bash

# Compile LESS to CSS automatically whenever a file is modified

# requirements
#
# 1 the LESS compiler (lessc)
#   - first you need Node.js, download it at http://nodejs.org/
#   - then install npm from http://npmjs.org/
#   - then install LESS:
#
#     $ npm install less
#
# 2 Watchdog
#   - requires Python
#   - install via easy_install:
#
#     $ sudo easy_install Watchdog
#
#   NOTE: we'll be using the 'watchmedo' script included with Watchdog
#
# 3 make sure both 'watchmedo' and 'lessc' are in your PATH
#
# 4 from the directory containing your LESS file, run this command:
#
#   $ ./watch_less.sh
#

echo "Watching folder `pwd`"

watchmedo shell-command --patterns="*.less" --command='./build_less.py ${watch_src_path} ' .
