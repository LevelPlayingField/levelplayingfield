#!/bin/bash

npm run build
cd build
git commit -am "Commit $(date +"%x %H:%M:%S")"
git push origin master
