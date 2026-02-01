@echo off
echo Starting local web server...
echo Please access the site at: http://localhost:8080
npx -y http-server . -p 8080 -c-1
pause
