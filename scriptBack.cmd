@echo off

:: Levantar Backend
cd C:\Users\MoisesC\Desktop\Adop Masc con graph\backend
npm start

:: Mantener el script en ejecución
:LOOP
timeout /t 60 /nobreak >nul
goto LOOP