@echo off
chcp 65001 >nul
title 日程表生成器 - 本地启动

echo ========================================
echo    日程表生成器 - 本地开发服务器
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] 检查依赖...
if not exist "node_modules\" (
    echo 首次运行，正在安装依赖...
    call npm.cmd install
    if errorlevel 1 (
        echo.
        echo 依赖安装失败！请检查网络连接或 Node.js 是否正确安装。
        pause
        exit /b 1
    )
)

echo [2/2] 启动开发服务器...
echo.
echo 服务器启动后将自动打开浏览器
echo 如果没有自动打开，请访问: http://localhost:5173/
echo.
echo 按 Ctrl+C 可停止服务器
echo ========================================
echo.

call npx.cmd vite --open

pause
