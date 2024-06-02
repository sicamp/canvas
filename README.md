# sicamp canvas

Приложение для генерации обложек для соцсетей.

Для разработки нужен [node.js](https://nodejs.org), можно поставить его через [nvm](https://github.com/nvm-sh/nvm). Как запустить локально:

```shell
nvm install # Установить версию node.js, описанную в файле .nvmrc
nvm use     # Активировать версию node.js, описанную в файле .nvmrc
npm ci      # Установить зависимости
npm run dev # Запустить приложение в режиме разработки
```

## Обзор приложения

Вводите текст в форму, получаете картинку. Картинка генерируется в [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG), при скачивании экспортируется в PNG.

Форма и начальные параметры SVG, например логотип, свёрстаны прямо в [index.html](./index.html).

Шрифты подключаются в [src/fonts.ts](./src/fonts.ts) и вставляются прямо в SVG, чтобы можно было корректно отрисовать или скачать картинку.

В [src/svg.ts](./src/svg.ts) логика по отрисовке данных в SVG: текста, года, полосок и т.д.

## Доступные команды

В папке прилоежния вы можете запустить:

### `npm run dev`

Запускает приложение в режиме разработки. Откройте [http://localhost:5173](http://localhost:5173) чтобы увидеть приложение в браузере.

После ваших изменений страница автоматически перезагрузится.

Сделано на [Vite](https://vitejs.dev/).

### `npm run preview`

Раздаёт приложение в режиме продакшена. Откройте [http://localhost:4173](http://localhost:4173) чтобы увидеть приложение в браузере.

Сделано на [Vite](https://vitejs.dev/).

### `npm run build`

Собирает приложение для продакшена в папку `dist`.

Сделано на [Vite](https://vitejs.dev/).

### `npm run lint`

Запускает проверку кодстайла.

Сделано на [prettier](https://prettier.io/).

### `npm run reformat`

Причёсывает код.

Сделано на [prettier](https://prettier.io/).

## CI

После пуша в ветку `main` приложение будет автоматически опубликовано по адресу [sicamp.github.io/canvas/](https://sicamp.github.io/canvas/).

Также запустятся проверки кода на соответствие правилам, их результаты можно увидеть [на странице Actions](https://github.com/sicamp/canvas/actions).

Сделано на [Github Actions](https://docs.github.com/en/actions).
