

export default class WFRPTableConfig extends RollTableConfig {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {width: 725})
    }

    activateListeners(html) 
    {
        super.activateListeners(html);

        html.prepend($(`<div class="form-group">
            <label>${game.i18n.localize("TABLE.Key")}</label>
            <input type="text" name="flags.arrant.key" value="${this.object.flags.arrant?.key || ""}"/>
            <label>${game.i18n.localize("TABLE.Column")}</label>
            <input type="text" name="flags.arrant.column" value="${this.object.flags.arrant?.column || ""}"/>
        </div>`))
    }
}