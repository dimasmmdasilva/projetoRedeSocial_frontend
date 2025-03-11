export declare const useUserStore: import("pinia").StoreDefinition<"user", Pick<{
    isLoading: import("vue").Ref<boolean, boolean>;
    errorMessage: import("vue").Ref<string, string>;
    successMessage: import("vue").Ref<string, string>;
    registerUser: (username: string, email: string, password: string, confirmPassword: string) => Promise<{
        success: boolean;
        message: string;
    }>;
}, "isLoading" | "errorMessage" | "successMessage">, Pick<{
    isLoading: import("vue").Ref<boolean, boolean>;
    errorMessage: import("vue").Ref<string, string>;
    successMessage: import("vue").Ref<string, string>;
    registerUser: (username: string, email: string, password: string, confirmPassword: string) => Promise<{
        success: boolean;
        message: string;
    }>;
}, never>, Pick<{
    isLoading: import("vue").Ref<boolean, boolean>;
    errorMessage: import("vue").Ref<string, string>;
    successMessage: import("vue").Ref<string, string>;
    registerUser: (username: string, email: string, password: string, confirmPassword: string) => Promise<{
        success: boolean;
        message: string;
    }>;
}, "registerUser">>;
