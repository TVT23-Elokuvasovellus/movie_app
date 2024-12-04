@echo off
start cmd.exe /k "cd server && npm run devStart"
start /min cmd.exe /k "npm start"