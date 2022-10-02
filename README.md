# Ludum Dare 51 - 10 Seconds of Math

The theme of [Ludum Dare 51 game jam](https://ldjam.com/events/ludum-dare/51) is: **Every 10 seconds**

I squeezed 5 hours scattered over the weekend, to end with something that I hope is decently fun or peculiar.

[Ludum Dare entry page](https://ldjam.com/events/ludum-dare/51/10-seconds-of-math)

## Design

https://twitter.com/TheJare/status/1576140859430445056

> HTML DOM game where you get a new addition exercise every 10 seconds, score for finishing it earlier, and a max of accumulated exercises. Solve them by typing numbers like Z-type and such games.

As with most other LD entries I've produced, it generates most gameplay with some sort of power curve that leads to rising difficulty. Unfortunately, in this one the difficulty escalates savagely very fast.

## Build

Built with [Typescript](https://www.typescriptlang.org/) and [Parcel](https://parceljs.org/). Audio generated with [Chiptone](https://sfbgames.itch.io/chiptone).

- Install `node` + `npm`
- Run `node install`
- `npm run start` to watch & serve the project in debug mode
- `npm run build` to build a distributable version into the `dist/` folder

Much love to [Visual Studio Code](https://code.visualstudio.com/) and the [Prettier](https://github.com/prettier/prettier-vscode) extension

## License

Copyright © 2022 Javier Arevalo

[The MIT License (MIT)](LICENSE)
