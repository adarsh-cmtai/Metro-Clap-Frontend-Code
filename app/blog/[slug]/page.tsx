"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Calendar, User, Loader2 } from 'lucide-react';
import { BlogPost } from '@/types';
import api from '@/lib/api';
import { format } from 'date-fns';
import  Link  from 'next/link';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const { data } = await api.get(`/blog/posts/${slug}`);
          setPost(data);
        } catch (err) {
          setError('Failed to load the article. It may not exist.');
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-neutral-600 mt-2">{error || 'Post not found.'}</p>
        <Link href="/blog" className="mt-6 inline-block bg-primary text-white px-6 py-2 rounded-lg">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <article>
          <header className="mb-8">
            <p className="text-primary font-semibold">{post.category}</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 my-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-neutral-500 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
              </div>
            </div>
          </header>

          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
          </div>

          <div
            className="prose lg:prose-xl max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </main>
  );
}