export declare const useUserStore: import('pinia').StoreDefinition<
    'user',
    Pick<
        {
            users: import('vue').Ref<
                {
                    id: number
                    username: string
                    profile_image?: string | undefined
                    bio?: string | undefined
                }[],
                | {
                      id: number
                      username: string
                      profile_image?: string
                      bio?: string
                  }[]
                | {
                      id: number
                      username: string
                      profile_image?: string | undefined
                      bio?: string | undefined
                  }[]
            >
            isLoading: import('vue').Ref<boolean, boolean>
            errorMessage: import('vue').Ref<string, string>
            successMessage: import('vue').Ref<string, string>
            registerUser: (
                username: string,
                email: string,
                password: string,
                confirmPassword: string
            ) => Promise<{
                success: boolean
                message: string
            }>
            fetchUsers: () => Promise<boolean>
            fetchUserDetails: () => Promise<boolean>
        },
        'isLoading' | 'errorMessage' | 'users' | 'successMessage'
    >,
    Pick<
        {
            users: import('vue').Ref<
                {
                    id: number
                    username: string
                    profile_image?: string | undefined
                    bio?: string | undefined
                }[],
                | {
                      id: number
                      username: string
                      profile_image?: string
                      bio?: string
                  }[]
                | {
                      id: number
                      username: string
                      profile_image?: string | undefined
                      bio?: string | undefined
                  }[]
            >
            isLoading: import('vue').Ref<boolean, boolean>
            errorMessage: import('vue').Ref<string, string>
            successMessage: import('vue').Ref<string, string>
            registerUser: (
                username: string,
                email: string,
                password: string,
                confirmPassword: string
            ) => Promise<{
                success: boolean
                message: string
            }>
            fetchUsers: () => Promise<boolean>
            fetchUserDetails: () => Promise<boolean>
        },
        never
    >,
    Pick<
        {
            users: import('vue').Ref<
                {
                    id: number
                    username: string
                    profile_image?: string | undefined
                    bio?: string | undefined
                }[],
                | {
                      id: number
                      username: string
                      profile_image?: string
                      bio?: string
                  }[]
                | {
                      id: number
                      username: string
                      profile_image?: string | undefined
                      bio?: string | undefined
                  }[]
            >
            isLoading: import('vue').Ref<boolean, boolean>
            errorMessage: import('vue').Ref<string, string>
            successMessage: import('vue').Ref<string, string>
            registerUser: (
                username: string,
                email: string,
                password: string,
                confirmPassword: string
            ) => Promise<{
                success: boolean
                message: string
            }>
            fetchUsers: () => Promise<boolean>
            fetchUserDetails: () => Promise<boolean>
        },
        'registerUser' | 'fetchUsers' | 'fetchUserDetails'
    >
>
