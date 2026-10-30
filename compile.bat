@echo off
setlocal
if not exist build mkdir build
where emcc >nul 2>nul
if errorlevel 1 (
  echo Emscripten no fue encontrado.
  echo Ejecuta emsdk_env.bat y vuelve a abrir la terminal.
  exit /b 1
)
emcc game.cpp -O2 -s WASM=1 -s MODULARIZE=1 -s EXPORT_NAME="createGameModule" -s ENVIRONMENT="web" -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap']" -s EXPORTED_FUNCTIONS="['_check_choice','_check_count','_reset_game','_add_star','_get_score','_malloc','_free']" -o build/game.js
if errorlevel 1 exit /b 1
copy /y index.html build\index.html >nul
copy /y styles.css build\styles.css >nul
copy /y app.js build\app.js >nul
echo Compilacion completa: build\
