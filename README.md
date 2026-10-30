# La misión del océano: rescate de los animalitos

Juego educativo web para niños de 3 a 4 años. La interfaz usa HTML y CSS; la lógica de validación de elecciones puede ejecutarse en C++ mediante WebAssembly. Si Emscripten no está disponible, la interfaz conserva un modo web funcional de respaldo.

## Archivos

```text
C:\Raquel\
|-- index.html
|-- styles.css
|-- app.js
|-- game.cpp
|-- compile.bat
\-- build\          (se genera al compilar)
```

## Abrir en Visual Studio Code

1. En Visual Studio Code, seleccione **Archivo > Abrir carpeta...**.
2. Abra `C:\Raquel`.
3. Instale las extensiones **C/C++** y, opcionalmente, **Live Server**.

El proyecto no necesita paquetes de Node.js ni Unity.

## Instalar y configurar Emscripten

Desde PowerShell:

```powershell
winget install Git.Git
git clone https://github.com/emscripten-core/emsdk.git C:\emsdk
cd C:\emsdk
.\emsdk install latest
.\emsdk activate latest
.\emsdk_env.bat
```

Para activar Emscripten en cada terminal nueva, ejecutado desde la carpeta de Emscripten:

```cmd
emsdk_env.bat
```

También puede verificar el compilador:

```powershell
emcc --version
```

## Compilar el juego

Desde `C:\Raquel`:

```cmd
compile.bat
```

Este comando genera `build\game.js` y `build\game.wasm`, además de copiar la interfaz a `build`.

## Ejecutar

Prueba local sin WebAssembly:

```powershell
python -m http.server 8080 --directory C:\Raquel
```

Prueba con WebAssembly compilado:

```powershell
python -m http.server 8080 --directory C:\Raquel\build
```

Abra `http://localhost:8080` en el navegador.

También puede ejecutar desde VS Code con la extensión Live Server, usando como carpeta `C:\Raquel\build` después de compilar.

## Verificar la integración C++

1. Compile con `compile.bat`.
2. Abra las herramientas del navegador (`F12`).
3. Seleccione la consola.
4. Debe aparecer: `Motor C++ WebAssembly conectado.`
5. Si el WASM está inaccesible, debe aparecer el aviso de modo web de respaldo.

## Cómo funciona

`game.cpp` exporta funciones C++ para comprobar respuestas, contar aciertos y controlar la puntuación.
`app.js` carga `build/game.js`, envuelve los exports de WebAssembly y usa las mismas funciones desde la interfaz.
HTML y CSS permanecen separados. JavaScript solo se usa para unir la interfaz con C++ y manejar la navegación sencilla.
