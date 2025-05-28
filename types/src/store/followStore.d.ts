export declare const useFollowStore: import('pinia').StoreDefinition<
    'follow',
    Pick<
        {
            isLoading: import('vue').Ref<boolean, boolean>
            errorMessage: import('vue').Ref<string, string>
            toggleFollow: (userId: number) => Promise<boolean>
            isFollowing: (userId: number) => boolean
        },
        'isLoading' | 'errorMessage'
    >,
    Pick<
        {
            isLoading: import('vue').Ref<boolean, boolean>
            errorMessage: import('vue').Ref<string, string>
            toggleFollow: (userId: number) => Promise<boolean>
            isFollowing: (userId: number) => boolean
        },
        never
    >,
    Pick<
        {
            isLoading: import('vue').Ref<boolean, boolean>
            errorMessage: import('vue').Ref<string, string>
            toggleFollow: (userId: number) => Promise<boolean>
            isFollowing: (userId: number) => boolean
        },
        'toggleFollow' | 'isFollowing'
    >
>
