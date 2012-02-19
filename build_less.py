#!/usr/bin/env python

# determines filename and extension, then delegates compiling the LESS files to lessc via a shell command

import sys, os.path
from subprocess import call

src = sys.argv[1]

base,ext = os.path.splitext(src)
dest = base + ".css"

cmd = "lessc %s > %s" % (src , dest)
#print cmd
print "%s -> %s" % (os.path.split(src)[1], os.path.split(dest)[1])
call( cmd , shell=True)
