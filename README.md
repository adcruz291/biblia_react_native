# Biblia RV1960 — React Native

App móvil **no nativa** hecha con React Native y Expo que consulta la Biblia Reina-Valera 1960 en la API REST de [bolls.life](https://bolls.life). Tiene dos modos de consulta: **capítulo completo** (libro + capítulo) y **versículo único** (libro + capítulo + versículo).

Materia: Tecnologías de desarrollo de software. Laboratorio guiado "App de consulta bíblica con React Native".

## Ejecutar

```bash
npm install
npx expo start
```

Abre la app con Expo Go (escaneando el QR) o en un emulador de Android con la tecla `a`.

## Estructura

```
App.js                          pantalla principal
src/api/biblia.js               acceso a la API (libros, capítulo, versículo)
src/components/                 FormularioConsulta, SelectorLibro, ListaVersiculos, TarjetaVersiculo
src/utils/texto.js              limpia las etiquetas HTML del texto
```

## Capturas por modo

| Capítulo completo (Juan 3) | Versículo único (Juan 3:16) |
|---|---|
| <img src="docs/capturas/03_capitulo_juan3.png" width="260"> | <img src="docs/capturas/04_versiculo_juan3_16.png" width="260"> |

## Pruebas (pasos 17, 19 y 20)

| Prueba | Resultado esperado | Captura |
|---|---|---|
| Abrir la app | Indicador de carga y después el formulario | <img src="docs/capturas/01_inicio.png" width="160"> |
| Abrir el selector de libros | Lista de los 66 libros, de Génesis a Apocalipsis | <img src="docs/capturas/02_selector_libros.png" width="160"> |
| Capítulo completo: Juan 3 | Lista con 36 versículos | <img src="docs/capturas/03_capitulo_juan3.png" width="160"> |
| Capítulo completo: Salmos 23 | 6 versículos sin etiquetas `<br>` | <img src="docs/capturas/10_capitulo_salmos23.png" width="160"> |
| Versículo único: Juan 3:16 | Tarjeta con el texto de Juan 3:16 | <img src="docs/capturas/04_versiculo_juan3_16.png" width="160"> |
| Versículo único: Juan 3:99 | Mensaje rojo: no se encontró el texto | <img src="docs/capturas/06_versiculo_inexistente.png" width="160"> |
| Capítulo inválido: Juan 50 | Mensaje de validación: "Juan tiene 21 capítulos." | <img src="docs/capturas/07_validacion.png" width="160"> |
| Modo avión y consultar | Mensaje rojo de error; la app no se cierra | <img src="docs/capturas/11_modo_avion.png" width="160"> |

En la terminal de Expo no aparecieron mensajes rojos ni amarillos.

## Retos adicionales

| Reto | Captura |
|---|---|
| Botón **Limpiar**: borra el formulario y los resultados | <img src="docs/capturas/08_limpiar.png" width="160"> |
| **Conteo de versículos** debajo del título del capítulo | <img src="docs/capturas/10_capitulo_salmos23.png" width="160"> |
| Botón **Compartir** con el componente `Share` | <img src="docs/capturas/05_compartir.png" width="160"> |
| **Versículo para hoy**: libro al azar y su primer versículo | <img src="docs/capturas/09_versiculo_para_hoy.png" width="160"> |
