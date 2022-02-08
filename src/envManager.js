
export default class EnvManager
{
    static _instance = null;
    envVars = {
        rotate: false
    };
    didLoad = false;

    static getInstance(){
        if(EnvManager._instance == null){
            EnvManager._instance = new EnvManager();
        }

        return this._instance;
    }
    envsLoaded(){
        return this.didLoad;
    }
    loadVariables(){
        fetch("http://localhost:3005/getEnvVars")
        .then(res => res.json())
        .then(
            (result) =>{
                //console.log("ENV RES:",result)
                this.envVars.rotate = result.rotate;
                this.didLoad = true;
            },

            (error)=> {
               
            }
        )
    }

    shouldRotate(){
        //console.log("SHOULD ROTATE:",this.envVars.rotate)
        return this.envVars.rotate;
    }


}