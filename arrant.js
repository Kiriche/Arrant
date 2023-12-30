
// Import Modules
import ActorSheetArrant from "./modules/actor/sheet/actor-sheet.js"
import ActorSheetArrantCharacter from "./modules/actor/sheet/character-sheet.js";
import ActorSheetArrantNPC from "./modules/actor/sheet/npc-sheet.js";
import ActorSheetArrantCreature from "./modules/actor/sheet/creature-sheet.js";
import ActorSheetArrantVehicle from "./modules/actor/sheet/vehicle-sheet.js";
import ItemSheetArrant from "./modules/item/item-sheet.js";
import ActorArrantNew from "./modules/actor/actor-arrant.js";
import ItemArrant from "./modules/item/item-arrant.js";
import registerHooks from "./modules/system/hooks.js"
import CharGenArrant from "./modules/apps/chargen/char-gen.js"
import MarketArrant from "./modules/apps/market-arrant.js";
import NameGenWfrp from "./modules/apps/name-gen.js";
import StatBlockParser from "./modules/apps/stat-parser.js";
import BrowserArrant from "./modules/apps/arrant-browser.js";
import WFRP_Audio from "./modules/system/audio-arrant.js";
import arrant from "./modules/system/config-arrant.js"
import ChatWFRP from "./modules/system/chat-arrant.js";
import OpposedWFRP from "./modules/system/opposed-arrant.js";
import WFRP_Tables from "./modules/system/tables-arrant.js";
import WFRP_Utility from "./modules/system/utility-arrant.js";
import AOETemplate from "./modules/system/aoe.js"
import ActorSettings from "./modules/apps/actor-settings.js";
import WFRPActiveEffectConfig from "./modules/apps/active-effect.js";
import Migration from "./modules/system/migrations.js";
import HomebrewSettings from "./modules/apps/homebrew-settings.js"
import CareerSelector from "./modules/apps/career-selector.js"
import CombatHelpers from "./modules/system/combat.js"
import ActiveEffectArrant from "./modules/system/effect-arrant.js"
import TagManager from "./modules/system/tag-manager.js";
import ItemProperties from "./modules/apps/item-properties.js"
import TestWFRP from "./modules/system/rolls/test-arrant.js";
import CharacteristicTest from "./modules/system/rolls/characteristic-test.js";
import SkillTest from "./modules/system/rolls/skill-test.js";
import WeaponTest from "./modules/system/rolls/weapon-test.js";
import CastTest from "./modules/system/rolls/cast-test.js";
import WomCastTest from "./modules/system/rolls/wom-cast-test.js";
import ChannelTest from "./modules/system/rolls/channel-test.js";
import PrayerTest from "./modules/system/rolls/prayer-test.js";
import TraitTest from "./modules/system/rolls/trait-test.js";
import ModuleUpdater from "./modules/apps/module-updater.js"
import ModuleInitializer from "./modules/apps/module-initialization.js";
import WFRPTableConfig from "./modules/apps/table-config.js";
import ItemDialog from "./modules/apps/item-dialog.js";
import { WFRPJournalTextPageSheet } from "./modules/system/journal-sheet.js";
import { ChargenStage } from "./modules/apps/chargen/stage.js";
import ArrantCharacterSheet from "./modules/actor/sheet/arrant-character-sheet";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function () {

  // #if _ENV === "development"
  CONFIG.debug.arrant = true;
  WFRP_Utility.log("Development Mode: Logs on")
  //#endif

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("arrant", ActorSheetArrantCharacter, { types: ["character"], makeDefault: false });
  Actors.registerSheet("arrant", ArrantCharacterSheet, { types: ["character"], makeDefault: true});
  Actors.registerSheet("arrant", ActorSheetArrantNPC, { types: ["npc"], makeDefault: true });
  Actors.registerSheet("arrant", ActorSheetArrantCreature, { types: ["creature"], makeDefault: true });
  Actors.registerSheet("arrant", ActorSheetArrantVehicle, { types: ["vehicle"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("arrant", ItemSheetArrant, { makeDefault: true });
  DocumentSheetConfig.registerSheet(RollTable, "arrant", WFRPTableConfig, {makeDefault: true})
  DocumentSheetConfig.registerSheet(ActiveEffect, "arrant", WFRPActiveEffectConfig, {makeDefault :true})
  // DocumentSheetConfig.registerSheet(JournalEntry, "arrant", WFRPJournalSheet, {makeDefault :true})
  DocumentSheetConfig.registerSheet(JournalEntryPage, "arrant", WFRPJournalTextPageSheet, {types: ["text"], makeDefault: true, label : "WFRP Journal Sheet (ProseMirror)"})

  game.arrant = {
    apps: {
      ActorSheetArrant,
      ActorSheetArrantCharacter,
      ActorSheetArrantCreature,
      ActorSheetArrantNPC,
      ActorSheetArrantVehicle,
      ItemSheetArrant,
      CharGenArrant,
      StatBlockParser,
      BrowserArrant,
      ActorSettings,
      WFRPActiveEffectConfig,
      HomebrewSettings,
      CareerSelector,
      ItemProperties,
      ModuleUpdater,
      ModuleInitializer,
      ItemDialog,
      ChargenStage
    },
    entities: {
      ActorArrant: ActorArrantNew,
      ItemArrant
    },
    rolls : {
      TestWFRP,
      CharacteristicTest,
      SkillTest,
      WeaponTest,
      CastTest,
      WomCastTest,
      ChannelTest,
      PrayerTest,
      TraitTest
    },
    utility: WFRP_Utility,
    tables: WFRP_Tables,
    config: arrant,
    chat: ChatWFRP,
    market: MarketArrant,
    audio: WFRP_Audio,
    opposed: OpposedWFRP,
    names: NameGenWfrp,
    combat: CombatHelpers,
    aoe: AOETemplate,
    migration: Migration,
    tags : new TagManager()
  }

  // Assign the actor class to the CONFIG
  CONFIG.Actor.documentClass = ActorArrantNew;
  CONFIG.Item.documentClass = ItemArrant;
  CONFIG.ActiveEffect.documentClass = ActiveEffectArrant
});

registerHooks()