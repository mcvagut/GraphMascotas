@echo off

:: Levantar Admin
cd C:\Users\MoisesC\Desktop\Adop Masc con graph\admin
npm start

:: Mantener el script en ejecución
:LOOP
timeout /t 60 /nobreak >nul
goto LOOP
