@echo off
echo ========================================================
echo Pushing Food Donation Platform to GitHub
echo Repository: https://github.com/ekollaakshaya-tech/Food-donation-platform.git
echo ========================================================
echo.

git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Code successfully pushed to GitHub!
) else (
    echo [FAILED] Push failed. If authentication was required, please sign in or use a GitHub Personal Access Token.
)

pause

