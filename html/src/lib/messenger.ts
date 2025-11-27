export default class Messenger {
    static async send(action: string, message: Object): Promise<any>{
        return new Promise((resolve:any, reject:any) => {
            //@ts-ignore
            fetch(`https://cd_notifications/${action}`, {
                method: "POST",
                body:JSON.stringify(message)
            }).then((e) => {
                resolve(e);
            }).catch((e)=>{
                reject(e);
            });
        });
    }
}