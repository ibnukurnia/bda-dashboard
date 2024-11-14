import { get, post, put, del } from '@/common/api';
import { ApiResponse } from '@/common/api/type';

const GetUsersList = async () => {
    const response: ApiResponse<any> = await get('users-management', {
        withAuth: true,
    });
    return response;
};

const CreateUser = async (params: { pn: string; roles: string }) => {
    const response: ApiResponse<any> = await post('users-management', {
        data: params,  // Send params in the request body
        withAuth: true,
    });
    return response;
};

const UpdateUser = async (params: { pn: string; roles: string }) => {
    const response: ApiResponse<any> = await put('users-management', {
        data: params,  // Send params in the request body
        withAuth: true,
    });
    return response;
};

const DeleteUser = async (pn: string) => {
    const response: ApiResponse<any> = await del(`users-management/${pn}`, {
        withAuth: true,
    });
    return response;
};

export {
    GetUsersList,
    CreateUser,
    UpdateUser,
    DeleteUser
};
