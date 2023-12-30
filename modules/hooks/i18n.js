

export default function () {
    Hooks.on("i18nInit", () => {
        // Localize strings in the  game.arrant.config.object
        for (let obj of game.arrant.config.toTranslate) {
                for (let el in game.arrant.config[obj]) {
                    if (typeof game.arrant.config[obj][el] === "string") {
                        game.arrant.config[obj][el] = game.i18n.localize(game.arrant.config[obj][el])
                    }
                }
        }
    })
}