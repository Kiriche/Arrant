import NameGenWfrp from "../apps/name-gen.js";
import TravelDistanceArrant from "../apps/travel-distance-arrant.js";
import HomebrewSettings from "../apps/homebrew-settings.js";
import TableSettings from "../apps/table-settings.js";

const debouncedReload = foundry.utils.debounce(() => {
  window.location.reload();
}, 100);

export default function() {
  /**
   * Init function loads tables, registers settings, and loads templates
   */
  Hooks.once("init", () => {

    TravelDistanceArrant.loadTravelData();

    game.settings.register("arrant", "systemMigrationVersion", {
      name: "System Migration Version",
      scope: "world",
      config: false,
      type: String,
      default: 0
    });

    game.settings.registerMenu("arrant", "homebrew", {
      name: "arrant House Rules",
      label: "arrant Homebrew",
      hint: "Settings for common homebrew/house rules",
      type: HomebrewSettings,
      restricted: true
  })

  game.settings.registerMenu("arrant", "tableSettings", {
    name: "arrant Table Settings",
    label: "arrant Table Settings",
    hint: "Configure which tables to roll on when multiple of the same key exist.",
    type: TableSettings,
    restricted: true
})

    // Register initiative rule
    game.settings.register("arrant", "initiativeRule", {
      name: "SETTINGS.InitRule",
      hint: "SETTINGS.InitHint",
      scope: "world",
      config: true,
      default: "default",
      type: String,
      choices: {
        "default": "SETTINGS.InitDefault",
        "sl": "SETTINGS.InitSL",
        "d10Init": "SETTINGS.InitD10",
        "d10InitAgi": "SETTINGS.InitD10Agi"
      },
      onChange: rule => _setArrantInitiative(rule)
    });
    _setArrantInitiative(game.settings.get("arrant", "initiativeRule"));


    function _setArrantInitiative(initMethod) {
      let formula;
      switch (initMethod) {
        case "default":
          formula = "@characteristics.i.value + @characteristics.ag.value/100";
          break;

        case "sl":
          formula = "(floor(@characteristics.i.value / 10) - floor(1d100/10))"
          break;

        case "d10Init":
          formula = "1d10 + @characteristics.i.value"
          break;

        case "d10InitAgi":
          formula = "1d10 + @characteristics.i.bonus + @characteristics.ag.bonus"
          break;
      }

      let decimals = (initMethod == "default") ? 2 : 0;
      CONFIG.Combat.initiative = {
        formula: formula,
        decimals: decimals
      }
    }


    // Register Advantage cap
    game.settings.register("arrant", "capAdvantageIB", {
      name: "SETTINGS.CapAdvIB",
      hint: "SETTINGS.CapAdvIBHint",
      scope: "world",
      config: true,
      default: false,
      type: Boolean
    });

    // Register Automatic Success threshold
    game.settings.register("arrant", "automaticSuccess", {
      name: "SETTINGS.AutomaticSuccess",
      hint: "SETTINGS.AutomaticSuccessHint",
      scope: "world",
      config: true,
      default: 5,
      type: Number
    });

    // Register Automatic Success threshold
    game.settings.register("arrant", "automaticFailure", {
      name: "SETTINGS.AutomaticFailure",
      hint: "SETTINGS.AutomaticFailureHint",
      scope: "world",
      config: true,
      default: 96,
      type: Number
    });

    // Register Fast SL rule
    game.settings.register("arrant", "fastSL", {
      name: "SETTINGS.FastSL",
      hint: "SETTINGS.FastSLHint",
      scope: "world",
      config: true,
      default: false,
      type: Boolean
    });

    // Register Tests above 100% Rule
    game.settings.register("arrant", "testAbove100", {
      name: "SETTINGS.TestsAbove100",
      hint: "SETTINGS.TestsAbove100Hint",
      scope: "world",
      config: true,
      default: false,
      type: Boolean
    });

    // Register Criticals/Fumbles on all tests
    game.settings.register("arrant", "criticalsFumblesOnAllTests", {
      name: "SETTINGS.CriticalsFumblesAllTests",
      hint: "SETTINGS.CriticalsFumblesAllTestsHint",
      scope: "world",
      config: true,
      default: false,
      type: Boolean
    });


    // Register Extended Tests
    game.settings.register("arrant", "extendedTests", {
      name: "SETTINGS.ExtendedTests",
      hint: "SETTINGS.ExtendedTestsHint",
      scope: "world",
      config: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "channelingNegativeSLTests", {
      name: "SETTINGS.ChannelingNegativeSL",
      hint: "SETTINGS.ChannelingNegativeSLHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });

    // Limit Equipped Items
    game.settings.register("arrant", "limitEquippedWeapons", {
      name: "SETTINGS.LimitEquippedWeapons",
      hint: "SETTINGS.LimitEquippedWeaponsHint",
      scope: "world",
      config: true,
      default: true,
      type: Boolean
    });

    // Register Test auto-fill
    game.settings.register("arrant", "autoFillAdvantage", {
      name: "SETTINGS.AutoFillAdv",
      hint: "SETTINGS.AutoFillAdvHint",
      scope: "world",
      config: true,
      default: true,
      type: Boolean
    });

    // Register default test difficulty
    game.settings.register("arrant", "testDefaultDifficulty", {
      name: "SETTINGS.TestDialogDefaultDifficulty",
      hint: "SETTINGS.TestDialogDefaultDifficultyHint",
      scope: "world",
      config: true,
      default: false,
      type: Boolean
    });

    // Register Round Summary
    game.settings.register("arrant", "displayRoundSummary", {
      name: "SETTINGS.RoundSummary",
      hint: "SETTINGS.RoundSummaryHint",
      scope: "world",
      config: true,
      default: true,
      type: Boolean
    });

    // Register Status on Turn Start
    game.settings.register("arrant", "statusOnTurnStart", {
      name: "SETTINGS.StatusTurnStart",
      hint: "SETTINGS.StatusTurnStartHint",
      scope: "world",
      config: true,
      default: true,
      type: Boolean
    });


    // Register Focus on Turn Start
    game.settings.register("arrant", "focusOnTurnStart", {
      name: "SETTINGS.FocusTurnStart",
      hint: "SETTINGS.FocusTurnStartHint",
      scope: "world",
      config: true,
      default: true,
      type: Boolean
    });

    // Register Hiding Test Data
    game.settings.register("arrant", "hideTestData", {
      name: "SETTINGS.HideTestData",
      hint: "SETTINGS.HideTestDataHint",
      scope: "world",
      config: true,
      default: true,
      type: Boolean
    });

    // Register Manual Chat Cards
    game.settings.register("arrant", "manualChatCards", {
      name: "SETTINGS.ManualChatCards",
      hint: "SETTINGS.ManualChatCardsHint",
      scope: "client",
      config: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "weaponLength", {
      name: "SETTINGS.WeaponLength",
      hint: "SETTINGS.WeaponLengthHint",
      scope: "world",
      config: true,
      default: true,
      type: Boolean
    });

    game.settings.register("arrant", "rangeAutoCalculation", {
      name: "SETTINGS.RangeAutoCalculation",
      hint: "SETTINGS.RangeAutoCalculationHint",
      scope: "world",
      config: true,
      default: true,
      type: Boolean
    });


    game.settings.register("arrant", "playerBrowser", {
      name: "SETTINGS.PlayerBrowser",
      hint: "SETTINGS.PlayerBrowserHint",
      scope: "world",
      config: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "playerExperienceEditing", {
      name: "SETTINGS.PlayerExperienceEditing",
      hint: "SETTINGS.PlayerExperienceEditingHint",
      scope: "world",
      config: true,
      default: true,
      type: Boolean
    });


    // Register Advantage cap
    game.settings.register("arrant", "soundPath", {
      name: "SETTINGS.SoundEffects",
      hint: "SETTINGS.SoundEffectsHint",
      scope: "world",
      config: true,
      default: "systems/arrant/sounds/",
      type: String
    });

    game.settings.register("arrant", "customCursor", {
      name: "SETTINGS.CustomCursor",
      hint: "SETTINGS.CustomCursorHint",
      scope: "world",
      config: true,
      default: true,
      type: Boolean
    });


    game.settings.register("arrant", "throwMoney", {
      name: "SETTINGS.ThrowMoney",
      hint: "SETTINGS.ThrowMoneyHint",
      scope: "world",
      config: true,
      default: true,
      type: Boolean
    });

    game.settings.register("arrant", "advantageBonus", {
      name: "SETTINGS.AdvantageBonus",
      hint: "SETTINGS.AdvantageBonusHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: 10,
      type: Number
    });

    game.settings.register("arrant", "uiaCrits", {
      name: "SETTINGS.UIACrits",
      hint: "SETTINGS.UIACritsHint",
      scope: "world",
      config: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "uiaCritsMod", {
      name: "SETTINGS.UIACritsMod",
      hint: "SETTINGS.UIACritsModHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: 10,
      type: Number
    });

    game.settings.register("arrant", "uiaShields", {
      name: "SETTINGS.UIAShields",
      hint: "SETTINGS.UIAShieldsHint",
      scope: "world",
      config: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "tables", {
      scope: "world",
      config: false,
      default: {},
      type: Object
    });

    game.settings.register("arrant", "bugReportName", {
      scope: "world",
      config: false,
      default: "",
      type: String
    });

    game.settings.register("arrant", "tableVisibility", {
      scope: "world",
      config: false,
      default: {},
      type: Object
    });

    
    game.settings.register("arrant", "tableRollMode", {
      scope: "client",
      config: false,
      default: {},
      type: Object
    });

    game.settings.register("arrant", "useGroupAdvantage", {
      name: "SETTINGS.UseGroupAdvantage",
      hint: "SETTINGS.UseGroupAdvantageHint",
      scope: "world",
      config: true,
      default: false,
      type: Boolean, 
      onChange: debouncedReload,
    });

    game.settings.register("arrant", "groupAdvantageValues", {
      scope: "world",
      config: false,
      default: {players: 0, enemies : 0},
      type: Object
    });

    game.settings.register("arrant", "mooAdvantage", {
      name: "SETTINGS.MooAdvantage",
      hint: "SETTINGS.MooAdvantageHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });



    game.settings.register("arrant", "mooDifficulty", {
      name: "SETTINGS.MooDifficulty",
      hint: "SETTINGS.MooDifficultyHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });


    
    // game.settings.register("arrant", "mooCritsFumbles", {
    //   name: "SETTINGS.MooCritsFumbles",
    //   hint: "SETTINGS.MooCritsFumblesHint",
    //   scope: "world",
    //   config: false,
    //   homebrew: true,
    //   default: false,
    //   type: Boolean
    // });


    game.settings.register("arrant", "mooConditions", {
      name: "SETTINGS.MooConditions",
      hint: "SETTINGS.MooConditionsHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "mooConditionTriggers", {
      name: "SETTINGS.MooConditionTriggers",
      hint: "SETTINGS.MooConditionTriggersHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "mooCritModifiers", {
      name: "SETTINGS.MooCritModifiers",
      hint: "SETTINGS.MooCritMOdifiersHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });


    game.settings.register("arrant", "mooSLDamage", {
      name: "SETTINGS.MooSLDamage",
      hint: "SETTINGS.MooSLDamageHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "mooRangedDamage", {
      name: "SETTINGS.MooRangedDamage",
      hint: "SETTINGS.MooRangedDamageHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });


    game.settings.register("arrant", "mooMagicAdvantage", {
      name: "SETTINGS.MooMagicAdvantage",
      hint: "SETTINGS.MooMagicAdvantageHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "mooOvercasting", {
      name: "SETTINGS.MooOvercasting",
      hint: "SETTINGS.MooOvercastingHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "mooCatastrophicMiscasts", {
      name: "SETTINGS.MooCatastrophicMiscasts",
      hint: "SETTINGS.MooCatastrophicMiscastsHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });

      
    game.settings.register("arrant", "partialChannelling", {
      name: "SETTINGS.PartialChannelling",
      hint: "SETTINGS.PartialChannellingHint",
      scope: "world",
      homebrew: true,
      config: false,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "channellingIngredients", {
      name: "SETTINGS.ChannellingIngredients",
      hint: "SETTINGS.ChannellingIngredientsHint",
      scope: "world",
      homebrew: true,
      config: false,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "mooCriticalChannelling", {
      name: "SETTINGS.MooCriticalChannelling",
      hint: "SETTINGS.MooCriticalChannellingHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "mooCastAfterChannelling", {
      name: "SETTINGS.MooCastAfterChannelling",
      hint: "SETTINGS.MooCastAfterChannellingHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "mooPenetrating", {
      name: "SETTINGS.MooPenetrating",
      hint: "SETTINGS.MooPenetratingHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "mooQualities", {
      name: "SETTINGS.MooQualities",
      hint: "SETTINGS.MooQualitiesHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "mooShieldAP", {
      name: "SETTINGS.MooShieldAP",
      hint: "SETTINGS.MooShieldAPHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "mooCriticalMitigation", {
      name: "SETTINGS.MooCriticalMitigation",
      hint: "SETTINGS.MooCriticalMitigationHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });


    game.settings.register("arrant", "mooRangeBands", {
      name: "SETTINGS.MooRangeBands",
      hint: "SETTINGS.MooRangeBandsHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "mooSizeDamage", {
      name: "SETTINGS.MooSizeDamage",
      hint: "SETTINGS.MooSizeDamageHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });

    
    game.settings.register("arrant", "mooHomebrewItemChanges", {
      name: "SETTINGS.MooHomebrewItems",
      hint: "SETTINGS.MooHomebrewItemHint",
      scope: "world",
      config: false,
      homebrew: true,
      default: false,
      type: Boolean
    });
    
    // Register Unofficial Grimoire
    game.settings.register("arrant", "unofficialgrimoire", {
      name: "SETTINGS.UnofficialGrimoire",
      hint: "SETTINGS.UnofficialGrimoireHint",
      scope: "world",
      homebrew: true,
      config: false,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "useWoMOvercast", {
      name: "SETTINGS.useWoMOvercast",
      hint: "SETTINGS.useWoMOvercastHint",
      scope: "world",
      config: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "useWoMChannelling", {
      name: "SETTINGS.useWoMChannelling",
      hint: "SETTINGS.useWoMChannellingHint",
      scope: "world",
      config: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "useWoMInfluences", {
      name: "SETTINGS.useWoMInfluences",
      hint: "SETTINGS.useWoMInfluencesHint",
      scope: "world",
      config: true,
      default: false,
      type: Boolean
    });

    game.settings.register("arrant", "grudges", {
      name: "Grudges",
      scope: "world",
      config: false,
      default: [],
      type: Array
    });

    game.settings.register("arrant", "tableSettings", {
      name: "SETTINGS.TableSettings",
      hint: "SETTINGS.TableSettings",
      scope: "world",
      config: false,
      default: {
        species : "FM6ASUoNX21MHuWa",
        minormis : "iPVwX0ul6lHVbKSX",
        majormis : "we8Vo5GC3ZsDI7aA",
        mutatephys : "YQ5XdjikeSiwo8fn",
        mutatemental : "5HKnpyOk4XDPdZ7V",
        oops : "MWkeER1iuwAJASNo",
        wrath : "CcKYnmbQyRzGkrFy",
        doom : "led1vSPKcqMpS6jp",
        critarm : "JYX8E8WgNb2em8g3",
        critleg : "j2joGAVBNJgS1G1g",
        crithead : "7KReueNRjaI6dVLk",
        critbody : "CUIX4e2hiHdSoJ64",
      },
      type: Object
    });




    // Pre-load templates
    loadTemplates([
      "systems/arrant/templates/actors/character/character-main.hbs",
      "systems/arrant/templates/actors/actor-combat.hbs",
      "systems/arrant/templates/actors/actor-effects.hbs",
      "systems/arrant/templates/actors/actor-biography.hbs",
      "systems/arrant/templates/actors/actor-inventory.hbs",
      "systems/arrant/templates/actors/actor-skills.hbs",
      "systems/arrant/templates/actors/actor-magic.hbs",
      "systems/arrant/templates/actors/actor-religion.hbs",
      "systems/arrant/templates/actors/actor-talents.hbs",
      "systems/arrant/templates/actors/actor-notes.hbs",
      "systems/arrant/templates/actors/npc/npc-careers.hbs",
      "systems/arrant/templates/actors/creature/creature-main.hbs",
      "systems/arrant/templates/actors/creature/creature-notes.hbs",
      "systems/arrant/templates/actors/creature/creature-main.hbs",
      "systems/arrant/templates/actors/vehicle/vehicle-main.hbs",
      "systems/arrant/templates/actors/vehicle/vehicle-cargo.hbs",
      "systems/arrant/templates/actors/vehicle/vehicle-description.hbs",
      "systems/arrant/templates/actors/vehicle/vehicle-effects.hbs",
      "systems/arrant/templates/partials/armour-location.hbs",
      "systems/arrant/templates/partials/item-container.hbs",
      "systems/arrant/templates/partials/qualities-flaws.hbs",
      "systems/arrant/templates/partials/overcasts.hbs",
      "systems/arrant/templates/partials/wom-overcasts.hbs",
      "systems/arrant/templates/dialog/dialog-constant.hbs",
      "systems/arrant/templates/chat/roll/test-card.hbs",
      "systems/arrant/templates/chat/help/chat-command-display-info.hbs",
      "systems/arrant/templates/items/item-header.hbs",
      "systems/arrant/templates/items/item-description.hbs",
      "systems/arrant/templates/items/item-effects.hbs"
    ]);

    // Load name construction from files
    NameGenWfrp._loadNames();

      CONFIG.Morrslieb = new PIXI.filters.AdjustmentFilter({ green: 0.5, red: 0.25, blue: 0.25, morrslieb: true })
      CONFIG.MorrsliebObject = {
        color: { value:"#4cb53a", apply: true },
        gamma: 1.0,
        contrast: 1.0,
        brightness: 1.0,
        saturation: 0.2
    }

    CONFIG.fontDefinitions.CaslonAntique = {editor : true, fonts : []}

    CONFIG.canvasTextStyle = new PIXI.TextStyle({
      fontFamily: "CaslonAntique",
      fontSize: 36,
      fill: "#FFFFFF",
      stroke: '#111111',
      strokeThickness: 1,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 4,
      dropShadowAngle: 0,
      dropShadowDistance: 0,
      align: "center",
      wordWrap: false
    })

    // Keep a list of actors that need to prepareData after 'ready' (generally those that rely on other actor data - passengers/mounts)
    game.arrant.postReadyPrepare = [];
  });
}