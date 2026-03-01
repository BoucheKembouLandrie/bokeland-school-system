@echo off
echo ========================================
echo  RESET COMPLET + SUPPRESSION LICENSE DB
echo ========================================
echo.

echo [1/5] Arret de TOUS les serveurs Node.js...
taskkill /F /IM node.exe 2>nul
if %errorlevel% == 0 (
    echo    ✓ Serveurs arretes
) else (
    echo    ℹ Aucun serveur en cours d'execution
)
timeout /t 3 /nobreak >nul
echo.

echo [2/5] Suppression de license.sqlite...
cd /d "c:\Users\bokel\OneDrive\Documents\LEUANA_SCHOOL\license-server"
if exist "license.sqlite" (
    del /F /Q "license.sqlite"
    if %errorlevel% == 0 (
        echo    ✓ license.sqlite supprime
    ) else (
        echo    ✗ Erreur lors de la suppression
    )
) else (
    echo    ℹ license.sqlite n'existe pas
)
echo.

echo [3/5] Reset de la base MySQL (leuana-school)...
cd /d "c:\Users\bokel\OneDrive\Documents\LEUANA_SCHOOL\leuana-school\backend"
node reset_database.js
echo.

echo [4/5] Verification...
cd /d "c:\Users\bokel\OneDrive\Documents\LEUANA_SCHOOL\license-server"
if exist "license.sqlite" (
    echo    ✗ ATTENTION: license.sqlite existe encore!
) else (
    echo    ✓ license.sqlite bien supprime
)
echo.

echo [5/5] Redemarrage des serveurs...
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
echo ✓ Base MySQL: Toutes les tables supprimees
echo ✓ Base License: license.sqlite supprime
echo ✓ Serveurs: Redemarres dans de nouvelles fenetres
echo.
echo Attendez 15-20 secondes que tout soit pret.
echo.
echo Ensuite:
echo 1. Ouvrez http://localhost:5174 pour l'onboarding
echo 2. Selectionnez "English" comme langue
echo 3. Remplissez le formulaire
echo.
echo Pour verifier le License Admin Dashboard:
echo - Ouvrez http://localhost:5173
echo - Login: admin / admin123
echo - Vous devriez voir 0 clients
echo.
pause
