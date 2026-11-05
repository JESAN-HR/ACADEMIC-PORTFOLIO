@echo off
cd /d "%~dp0"
call npm run build
if errorlevel 1 (
  echo.
  echo Build failed. Check the content file and field named above.
) else (
  echo.
  echo Portfolio updated. Open index.html or refresh your browser.
)
pause
