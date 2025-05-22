interface User {
    id: number;
    username: string;
    followers: {
        id: number;
    }[];
    following: {
        id: number;
    }[];
    followers_count: number;
    following_count: number;
    profile_image?: string;
    bio?: string;
}
export declare const useAuthStore: import("pinia").StoreDefinition<"auth", Pick<{
    user: import("vue").Ref<{
        id: number;
        username: string;
        followers: {
            id: number;
        }[];
        following: {
            id: number;
        }[];
        followers_count: number;
        following_count: number;
        profile_image?: string | undefined;
        bio?: string | undefined;
    }, User | {
        id: number;
        username: string;
        followers: {
            id: number;
        }[];
        following: {
            id: number;
        }[];
        followers_count: number;
        following_count: number;
        profile_image?: string | undefined;
        bio?: string | undefined;
    }>;
    token: import("vue").Ref<string, string>;
    isAuthenticated: import("vue").ComputedRef<boolean>;
    isLoading: import("vue").Ref<boolean, boolean>;
    errorMessage: import("vue").Ref<string, string>;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    fetchUserData: () => Promise<void>;
    updateUserData: (data: User) => void;
}, "token" | "user" | "isLoading" | "errorMessage">, Pick<{
    user: import("vue").Ref<{
        id: number;
        username: string;
        followers: {
            id: number;
        }[];
        following: {
            id: number;
        }[];
        followers_count: number;
        following_count: number;
        profile_image?: string | undefined;
        bio?: string | undefined;
    }, User | {
        id: number;
        username: string;
        followers: {
            id: number;
        }[];
        following: {
            id: number;
        }[];
        followers_count: number;
        following_count: number;
        profile_image?: string | undefined;
        bio?: string | undefined;
    }>;
    token: import("vue").Ref<string, string>;
    isAuthenticated: import("vue").ComputedRef<boolean>;
    isLoading: import("vue").Ref<boolean, boolean>;
    errorMessage: import("vue").Ref<string, string>;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    fetchUserData: () => Promise<void>;
    updateUserData: (data: User) => void;
}, "isAuthenticated">, Pick<{
    user: import("vue").Ref<{
        id: number;
        username: string;
        followers: {
            id: number;
        }[];
        following: {
            id: number;
        }[];
        followers_count: number;
        following_count: number;
        profile_image?: string | undefined;
        bio?: string | undefined;
    }, User | {
        id: number;
        username: string;
        followers: {
            id: number;
        }[];
        following: {
            id: number;
        }[];
        followers_count: number;
        following_count: number;
        profile_image?: string | undefined;
        bio?: string | undefined;
    }>;
    token: import("vue").Ref<string, string>;
    isAuthenticated: import("vue").ComputedRef<boolean>;
    isLoading: import("vue").Ref<boolean, boolean>;
    errorMessage: import("vue").Ref<string, string>;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    fetchUserData: () => Promise<void>;
    updateUserData: (data: User) => void;
}, "login" | "logout" | "fetchUserData" | "updateUserData">>;
export {};
