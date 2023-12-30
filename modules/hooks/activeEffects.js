
export default function () {

    Hooks.on("createActiveEffect", (effect, options, id) => {_runUpdateEffects(effect, "create", options, id)})
    Hooks.on("updateActiveEffect", (effect, options, id) => {_runUpdateEffects(effect, "update", options, id)})
    Hooks.on("deleteActiveEffect", (effect, options, id) => {
        if (effect.parent.documentName == "Actor")
        {
            let items = effect.parent.items.filter(i => i.getFlag("arrant", "fromEffect") == effect.id);
            if (items.length)
            {
                ui.notifications.notify(game.i18n.format("EFFECT.DeletingItems", {items : items.map(i => i.name).join(", ")}))
                effect.parent.deleteEmbeddedDocuments("Item", items.map(i => i.id));
            }
        }
        _runUpdateEffects(effect, "delete", options, id)
    })

    Hooks.on("preCreateActiveEffect", (effect, data, options, id) => {

        if (getProperty(effect, "flags.arrant.preventDuplicateEffects"))
        {
            if (effect.parent?.documentName == "Actor" && effect.parent.effects.find(e => e.name == effect.name))
            {
                ui.notifications.notify(`${game.i18n.format("EFFECT.Prevent", { name: effect.name })}`)
                return false
            }
        }

        if (effect.parent?.documentName == "Actor" && effect.trigger == "addItems")
        {
            game.arrant.utility.applyOneTimeEffect(effect, effect.parent);
            options.keepId = true;
        }
        

        if (effect.item)
        {
            return
        }

        // Below this only applies to effects that have been dragged from items directly

        if (effect.parent?.documentName == "Actor" && effect.application == "apply")
        {
            effect.updateSource({"flags.arrant.effectApplication" : "actor"})
        }

        if (effect.parent?.documentName == "Actor" && effect.trigger == "oneTime")
        {
            ui.notifications.notify(`${game.i18n.format("EFFECT.Applying", { name: effect.name })}`)
            game.arrant.utility.applyOneTimeEffect(effect, effect.parent);
            return false
        }
    })

}

function _runUpdateEffects(effect, context, options, id)
{
    if (id != game.user.id)
    {
        return;
    }

    if (effect.parent?.documentName == "Actor")
    {
        effect.parent.runEffects("update", {effect, context});
    }
}