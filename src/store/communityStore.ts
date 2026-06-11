import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Post {
  id: string;
  author: string;
  authorId: string;
  title: string;
  content: string;
  type: 'note' | 'question' | 'share';
  likes: number;
  comments: number;
  createdAt: string;
  isPinned: boolean;
}

interface CommunityState {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>) => void;
  likePost: (postId: string) => void;
  deletePost: (postId: string) => void;
}

const defaultPosts: Post[] = [
  {
    id: '1',
    author: '安全导师李老师',
    authorId: 'admin',
    title: 'CISP考试通关经验分享',
    content: '作为已经通过CISP认证的老学员，今天来分享一下我的备考经验。首先，建议大家按照90天学习计划严格执行，不要跳着学习。其次，每天的代码实验一定要动手做，只有实践才能真正理解知识点。最后，模拟考试一定要做3遍以上，确保知识点都掌握了。',
    type: 'share',
    likes: 156,
    comments: 42,
    createdAt: '2024-01-15T10:30:00Z',
    isPinned: true,
  },
  {
    id: '2',
    author: '学习达人小王',
    authorId: 'user2',
    title: 'Day 30打卡纪念',
    content: '终于完成了一个月的学习！感觉对信息安全的理解深入了很多。特别是访问控制那一块，之前工作中遇到的很多问题现在都有了解答。继续加油！',
    type: 'note',
    likes: 89,
    comments: 23,
    createdAt: '2024-01-20T15:45:00Z',
    isPinned: false,
  },
  {
    id: '3',
    author: '新手小白',
    authorId: 'user3',
    title: '关于加密算法的问题',
    content: '请问对称加密和非对称加密各自的优势是什么？在实际工作中应该如何选择？有没有大神可以解释一下？',
    type: 'question',
    likes: 34,
    comments: 15,
    createdAt: '2024-01-22T09:20:00Z',
    isPinned: false,
  },
];

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      posts: defaultPosts,

      addPost: (post) =>
        set((s) => ({
          posts: [
            {
              ...post,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              likes: 0,
              comments: 0,
            },
            ...s.posts,
          ],
        })),

      likePost: (postId) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId ? { ...p, likes: p.likes + 1 } : p
          ),
        })),

      deletePost: (postId) =>
        set((s) => ({
          posts: s.posts.filter((p) => p.id !== postId),
        })),
    }),
    {
      name: 'cisp_community',
    }
  )
);
