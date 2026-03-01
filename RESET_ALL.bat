@echo off
echo ========================================
echo  RESET COMPLET - LEUANA SCHOOL SYSTEM
echo ========================================
echo.

echo [1/4] Arret des serveurs...
echo.

REM Kill all node processes (will stop all dev servers)
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] Reset de la base de donnees leuana-school...
cd /d "c:\Users\bokel\OneDrive\Documents\LEUANA_SCHOOL\leuana-school\backend"
node reset_database.js
echo.

echo [3/4] Reset de la base de donnees license-server...
cd /d "c:\Users\bokel\OneDrive\Documents\LEUANA_SCHOOL\license-server"
node reset_database.js
echo.

echo [4/4] Redemarrage des serveurs...
echo.

REM Start backend
start "Backend Server" cmd /k "cd /d c:\Users\bokel\OneDrive\Documents\LEUANA_SCHOOL\leuana-school\backend && npm run dev"
timeout /t 3 /nobreak >nul

REM Start frontend
start "Frontend Server" cmd /k "cd /d c:\Users\bokel\OneDrive\Documents\LEUANA_SCHOOL\leuana-school\frontend && npm run dev"
timeout /t 2 /nobreak >nul

REM Start license server
start "License Server" cmd /k "cd /d c:\Users\bokel\OneDrive\Documents\LEUANA_SCHOOL\license-server && npm run dev"
timeout /t 2 /nobreak >nul

REM Start license dashboard
start "License Dashboard" cmd /k "cd /d c:\Users\bokel\OneDrive\Documents\LEUANA_SCHOOL\license-admin-dashboard && npm run dev"

echo.
echo ========================================
echo  RESET TERMINE!
echo ========================================
echo.
echo Les serveurs demarrent dans de nouvelles fenetres...
echo Attendez 10-15 secondes que tout soit pret.
echo.
echo Ensuite, ouvrez http://localhost:5174 pour commencer l'onboarding.
echo.
pause
