
export type IUser = {
    id: number,
    requestor_firstname: string
    requestor_lastname: string    
    lastname: string,
    firstname: string,
    email: string,
    password: string,
    validation_code: number
    roleId: string,
    serviceId: string,
    service?: {
        id: number,
        label: string
    }
    created_at: Date,
    updated_at: Date
    role?: {
        id: number;
        label: string;
    }
}

export type ICreateUser = {         
    lastname: string,
    firstname: string,
    email: string,
    password: string,
    validation_code: number 
    roleId: string,
    serviceId: string,    
}

export type IAuthUser = Omit<IUser, "password">

export type ILogin = {
    email: string,
    password: string
}

export type IUserIntervention= {
    id: number;
    interventionId: number;
    userId: number;
    user: {
        id: number;
        firstname: string;
        lastname: string;
        email: string;
    };
}

export type IUserPreventive= {
    id: number;
    preventiveId: number;
    userId: number;
    user: {
        id: number;
        firstname: string;
        lastname: string;       
    };
}

export type AddUserPreventiveResponse = {
  message: string;
  relation: IUserPreventive;
};