@echo off

:: Levantar Frontend
cd C:\Users\MoisesC\Desktop\Adop Masc con graph\front
npm start

:: Mantener el script en ejecución
:LOOP
timeout /t 60 /nobreak >nul
goto LOOP