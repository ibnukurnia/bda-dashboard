import { get, post, put, del } from '@/common/api';
import { ApiResponse } from '@/common/api/type';

const GetUsersList = async () => {
    const response: ApiResponse<any> = await get('users-management', {
        withAuth: true,
    });
    return response;
};

const CreateUser = async (params: { personal_number: string; role: string }) => {
    const response: ApiResponse<any> = await post('users-management', {
        data: params,  // Send `personal_number` and `role` in the body
        withAuth: true, // Indicate that the request requires authorization
    });
    return response;
};

const UpdateUser = async (params: { personal_number: string; roles: string }) => {
    const response: ApiResponse<any> = await put('users-management', {
        data: params,  // Send params in the request body
        withAuth: true,
    });
    return response;
};

const DeleteUser = async (personal_number: string): Promise<ApiResponse<any>> => {
    const response: ApiResponse<any> = await del(`users-management/${personal_number}`, {
        withAuth: true, // Include Authorization header
    });
    return response;
};


export {
    GetUsersList,
    CreateUser,
    UpdateUser,
    DeleteUser
};
