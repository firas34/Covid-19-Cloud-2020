import { User } from "./user.model";

export class News{
    User: User; // or pobably the email
    Date: string;
    Description: string;
    Country: string; // country Slug
    


    constructor(user:User, date: string,description:string,country:string){
        this.User = user;
        this.Date=date;
        this.Description=description;
        this.Country=country;
        
    }
}


