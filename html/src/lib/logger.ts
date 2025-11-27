export async function Log(message: any, type:"log" | "warn" | "error" | "info", log?: boolean):Promise<void>{
    if(!log)
        return;
    
    console[type](message);
    return;
}