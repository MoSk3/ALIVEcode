#!/bin/bash

javac -sourcepath ./src/ -d ./out/production/Interpreteur/ ./src/interpreteur/executeur/Executeur.java -classpath "./lib/json-20140107.jar;./lib/snakeyaml-1.28.jar;./lib/annotations-19.0.0.jar"
javac -sourcepath ./ServerAS/src/ -d ./out/production/ServerAS/ ./ServerAS/src/server/Server.java -cp "./lib/json-20140107.jar;./lib/snakeyaml-1.28.jar;./lib/annotations-19.0.0.jar;./lib/javax.websocket-api-1.1.jar;./out/production/Interpreteur/"
if ! -d ./out/production/Interpreteur/interpreteur/regle_et_grammaire 
then mkdir ./out/production/Interpreteur/interpreteur/regle_et_grammaire
fi
cp ./src/interpreteur/regle_et_grammaire/ASGrammaire.yaml ./out/production/Interpreteur/interpreteur/regle_et_grammaire/

