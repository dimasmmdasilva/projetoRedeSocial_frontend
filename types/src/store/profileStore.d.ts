export declare const useProfileStore: import('pinia').StoreDefinition<
    'profile',
    Pick<
        {
            isLoading: import('vue').Ref<boolean, boolean>
            errorMessage: import('vue').Ref<string, string>
            successMessage: import('vue').Ref<string, string>
            updateProfileImage: (imageFile: File) => Promise<boolean>
            updateBio: (newBio: string) => Promise<boolean>
        },
        'isLoading' | 'errorMessage' | 'successMessage'
    >,
    Pick<
        {
            isLoading: import('vue').Ref<boolean, boolean>
            errorMessage: import('vue').Ref<string, string>
            successMessage: import('vue').Ref<string, string>
            updateProfileImage: (imageFile: File) => Promise<boolean>
            updateBio: (newBio: string) => Promise<boolean>
        },
        never
    >,
    Pick<
        {
            isLoading: import('vue').Ref<boolean, boolean>
            errorMessage: import('vue').Ref<string, string>
            successMessage: import('vue').Ref<string, string>
            updateProfileImage: (imageFile: File) => Promise<boolean>
            updateBio: (newBio: string) => Promise<boolean>
        },
        'updateProfileImage' | 'updateBio'
    >
>
