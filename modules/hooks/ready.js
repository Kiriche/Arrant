import WFRP_Utility from "../system/utility-arrant.js";
import FoundryOverrides from "../system/overrides.js";
import SocketHandlers from "../system/socket-handlers.js";
import MooHouseRules from "../system/moo-house.js"
import OpposedWFRP from "../system/opposed-arrant.js";
import OpposedTest from "../system/opposed-test.js";

export default function () {
  Hooks.on("ready", async () => {


    Object.defineProperty(game.user, "isUniqueGM", {
      get: function () { return game.user.id == game.users.find(u => u.active && u.isGM)?.id }
    })

    CONFIG.ChatMessage.documentClass.prototype.getTest = function () {
      if (hasProperty(this, "flags.testData"))
        return game.arrant.rolls.TestWFRP.recreate(this.flags.testData)
    }
    CONFIG.ChatMessage.documentClass.prototype.getOppose = function () {
      if (hasProperty(this, "flags.arrant.opposeData"))
        return new OpposedWFRP(getProperty(this, "flags.arrant.opposeData"))
    }

    CONFIG.ChatMessage.documentClass.prototype.getOpposedTest = function () {
      if (hasProperty(this, "flags.arrant.opposeTestData"))
        return OpposedTest.recreate(getProperty(this, "flags.arrant.opposeTestData"))
    }

    //***** Change cursor styles if the setting is enabled *****

    if (game.settings.get('arrant', 'customCursor')) {
      WFRP_Utility.log('Using custom cursor', true)
      if (await srcExists("systems/arrant/ui/cursors/pointer.png")) {
        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet')
        link.type = 'text/css'
        link.href = '/systems/arrant/css/cursor.css'

        document.head.appendChild(link);
      }
      else {
        WFRP_Utility.log('No custom cursor found', true)
      }
    }

    // Automatically disable Auto Fill Advantage if group advantage is enabled
    if (game.settings.get("arrant", "useGroupAdvantage", true) &&
      game.user.isGM && 
      game.settings.get("arrant", "autoFillAdvantage", true))
    {
      ui.notifications.notify(game.i18n.localize("AutoFillAdvantageDisabled"), {permanent : true})
      game.settings.set("arrant", "autoFillAdvantage", false)
    }

    game.socket.on("system.arrant", data => {
      SocketHandlers[data.type](data)
    })


    const body = $("body");
    body.on("dragstart", "a.condition-chat", WFRP_Utility._onDragConditionLink)

    // if (game.modules.get("about-time") && game.modules.get("about-time").active && game.user.isUniqueGM)
    //   game.Gametime.doEvery(GM{hours:24}, () => {
    //     game.actors.contents.filter(a => a.hasPlayerOwner).forEach(a => {
    //       a.decrementDiseases()
    //       a.decrementInjuries()
    //     })
    //   })




    const MIGRATION_VERSION = 8;
    let needMigration = isNewerVersion(MIGRATION_VERSION, game.settings.get("arrant", "systemMigrationVersion"))
    if (needMigration && game.user.isGM) {
      game.arrant.migration.migrateWorld()
    }
    game.settings.set("arrant", "systemMigrationVersion", MIGRATION_VERSION)




    // Some entities require other entities to be loaded to prepare correctly (vehicles and mounts)
    for (let e of game.arrant.postReadyPrepare)
      e.prepareData();

    game.arrant.config.PrepareSystemItems();
    CONFIG.statusEffects = game.arrant.config.statusEffects;

    FoundryOverrides();
    MooHouseRules();
    canvas.tokens.placeables.forEach(t => t.drawEffects())

    game.arrant.tags.createTags()

  })



}
