interface User {
    id: number;
    username: string;
    followers: {
        id: number;
    }[];
    followers_count: number;
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
        followers_count: number;
        profile_image?: string | undefined;
        bio?: string | undefined;
    } | null, User | {
        id: number;
        username: string;
        followers: {
            id: number;
        }[];
        followers_count: number;
        profile_image?: string | undefined;
        bio?: string | undefined;
    } | null>;
    token: import("vue").Ref<string, string>;
    isAuthenticated: import("vue").ComputedRef<boolean>;
    isLoading: import("vue").Ref<boolean, boolean>;
    errorMessage: import("vue").Ref<string, string>;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    fetchUserData: () => Promise<void>;
}, "token" | "user" | "isLoading" | "errorMessage">, Pick<{
    user: import("vue").Ref<{
        id: number;
        username: string;
        followers: {
            id: number;
        }[];
        followers_count: number;
        profile_image?: string | undefined;
        bio?: string | undefined;
    } | null, User | {
        id: number;
        username: string;
        followers: {
            id: number;
        }[];
        followers_count: number;
        profile_image?: string | undefined;
        bio?: string | undefined;
    } | null>;
    token: import("vue").Ref<string, string>;
    isAuthenticated: import("vue").ComputedRef<boolean>;
    isLoading: import("vue").Ref<boolean, boolean>;
    errorMessage: import("vue").Ref<string, string>;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    fetchUserData: () => Promise<void>;
}, "isAuthenticated">, Pick<{
    user: import("vue").Ref<{
        id: number;
        username: string;
        followers: {
            id: number;
        }[];
        followers_count: number;
        profile_image?: string | undefined;
        bio?: string | undefined;
    } | null, User | {
        id: number;
        username: string;
        followers: {
            id: number;
        }[];
        followers_count: number;
        profile_image?: string | undefined;
        bio?: string | undefined;
    } | null>;
    token: import("vue").Ref<string, string>;
    isAuthenticated: import("vue").ComputedRef<boolean>;
    isLoading: import("vue").Ref<boolean, boolean>;
    errorMessage: import("vue").Ref<string, string>;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    fetchUserData: () => Promise<void>;
}, "login" | "logout" | "refreshToken" | "fetchUserData">>;
export {};
