## obiusm

A javascript/typescript animation framework

verry easy to use :)

now for 🙂:
  + html dom
  + threeJs(its Animation System is difficalt to use,so translate to some simple API)

#### example
```js
const app = document.getElementById('app');
obiusm.use(ObiusmDom);
const Animation = obiusm
  .create()
  .moveTo("100vw", "0")
  .moveTo(200, 200, 1000)
  .moveTo({ 
    x: 0, 
    y: 0, 
    duration: 1000, 
    timeFunction: "ease"
  });
const renderer = obiusm.dom(app, Animation);
renderer.render();
```
```js
  const app = document.getElementById('app');
  obiusm.use(ObiusmDom);
  let animation = obiusm
    .create()
    .keyframe('move', [
      {
        process: '0%',
        action: {
          backgroundColor: 'green',
          left: '0px',
        },
      },
      {
        process: '100%',
        action: {
          backgroundColor: 'red',
          left: '300px',
        },
      },
    ], {
      duration: 2000,
      direction: 'alternate',
      iterationCount: 10,
    });
  obiusm.dom(app, animation).render();
```
## How to use

```bash
npm i obiusm
```

```bash
npm i obiusm-dom
```

:bangbang: still in development

docs: https://magic-zhu.github.io/obiusm/
