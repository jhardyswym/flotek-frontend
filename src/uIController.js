export default class UIController {

    static _instance = null;
    stopCallbacks = [];
    static getInstance()
    {
        if(UIController._instance == null){
            UIController._instance = new UIController();
        }
        return this._instance;
    }

    addStopStartCallback(cb)
    {
        this.stopCallbacks.push(cb);
    }
    onStopStartPushed(ss)
    {
        for(var i = 0; i < this.stopCallbacks.length; i++)
        {
            this.stopCallbacks[i](ss);
        }
    }
    

}
