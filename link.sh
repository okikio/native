#!/bin/bash     
for folder in "manager" "emitter" "animate" "native"
do    
    cd ../$folder 
    # ln -fs ../../docs/$folder/index.md README.md
    # ls -l README.md
    ln -fsr ../../LICENSE LICENSE
    ls -l LICENSE
done
exit 0