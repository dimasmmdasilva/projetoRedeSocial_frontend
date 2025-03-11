interface Tweet {
    id: number;
    content: string;
    created_at: string;
    likes_count: number;
    is_liked: boolean;
    author: {
        id: number;
        username: string;
        profile_image?: string;
    };
}
export declare const useTweetStore: import("pinia").StoreDefinition<"tweet", Pick<{
    tweets: import("vue").Ref<{
        id: number;
        content: string;
        created_at: string;
        likes_count: number;
        is_liked: boolean;
        author: {
            id: number;
            username: string;
            profile_image?: string | undefined;
        };
    }[], Tweet[] | {
        id: number;
        content: string;
        created_at: string;
        likes_count: number;
        is_liked: boolean;
        author: {
            id: number;
            username: string;
            profile_image?: string | undefined;
        };
    }[]>;
    isLoading: import("vue").Ref<boolean, boolean>;
    errorMessage: import("vue").Ref<string, string>;
    fetchFollowingTweets: () => Promise<boolean>;
    createTweet: (content: string) => Promise<boolean>;
    toggleLike: (tweetId: number) => Promise<boolean>;
}, "isLoading" | "errorMessage" | "tweets">, Pick<{
    tweets: import("vue").Ref<{
        id: number;
        content: string;
        created_at: string;
        likes_count: number;
        is_liked: boolean;
        author: {
            id: number;
            username: string;
            profile_image?: string | undefined;
        };
    }[], Tweet[] | {
        id: number;
        content: string;
        created_at: string;
        likes_count: number;
        is_liked: boolean;
        author: {
            id: number;
            username: string;
            profile_image?: string | undefined;
        };
    }[]>;
    isLoading: import("vue").Ref<boolean, boolean>;
    errorMessage: import("vue").Ref<string, string>;
    fetchFollowingTweets: () => Promise<boolean>;
    createTweet: (content: string) => Promise<boolean>;
    toggleLike: (tweetId: number) => Promise<boolean>;
}, never>, Pick<{
    tweets: import("vue").Ref<{
        id: number;
        content: string;
        created_at: string;
        likes_count: number;
        is_liked: boolean;
        author: {
            id: number;
            username: string;
            profile_image?: string | undefined;
        };
    }[], Tweet[] | {
        id: number;
        content: string;
        created_at: string;
        likes_count: number;
        is_liked: boolean;
        author: {
            id: number;
            username: string;
            profile_image?: string | undefined;
        };
    }[]>;
    isLoading: import("vue").Ref<boolean, boolean>;
    errorMessage: import("vue").Ref<string, string>;
    fetchFollowingTweets: () => Promise<boolean>;
    createTweet: (content: string) => Promise<boolean>;
    toggleLike: (tweetId: number) => Promise<boolean>;
}, "fetchFollowingTweets" | "createTweet" | "toggleLike">>;
export {};
