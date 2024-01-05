@echo off

:: Configurar JAVA_HOME si no está definido
if not defined JAVA_HOME (
    set JAVA_HOME=C:\Program Files\Java\jdk-11.0.1  :: Reemplaza con tu ruta de instalación de JDK
)

:: Levantar Prueba Selenium
cd C:\Users\MoisesC\Desktop\ProyFinalDipAutomation\
mvn clean install
mvn clean test

:: Mantener el script en ejecución
:LOOP
timeout /t 60 /nobreak >nul
goto LOOP
