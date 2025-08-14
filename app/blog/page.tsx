"use client";

import { useEffect, useRef, useState, useCallback } from "react"
import { Calendar, User, ArrowRight, Search, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Button from "../components/Button"
import { BlogPost } from "@/types"
import api from "@/lib/api"
import { format } from "date-fns"

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const heroRef = useRef<HTMLElement>(null);
  const postsRef = useRef<HTMLElement>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory,
        search: debouncedSearchTerm,
      };
      const { data } = await api.get("/blog/posts", { params });
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, debouncedSearchTerm]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, featuredRes] = await Promise.all([
          api.get("/blog/categories"),
          api.get("/blog/posts/featured")
        ]);
        setCategories(catRes.data);
        setFeaturedPost(featuredRes.data);
      } catch (error) {
        console.error("Failed to fetch initial blog data", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    const refs = [heroRef, postsRef];
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <section ref={heroRef} className="py-20 sm:py-28 fade-in-up">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-neutral-900 mb-6">
              MetroClap <span className="text-primary">Blog</span>
            </h1>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
              Expert tips, industry insights, and helpful guides to keep your spaces clean and organized.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-64"
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {featuredPost && selectedCategory === "All" && !searchTerm && (
            <div className="mb-16">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative h-64 lg:h-full">
                    <Image
                      src={featuredPost.imageUrl || "/placeholder.svg"}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">Featured</span>
                      <span className="bg-neutral-100 px-3 py-1 rounded-full">{featuredPost.category}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-900 mb-4">{featuredPost.title}</h2>
                    <p className="text-neutral-700 mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {featuredPost.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(featuredPost.createdAt), 'MMMM d, yyyy')}
                        </div>
                      </div>
                      <Link href={`/blog/${featuredPost.slug}`}>
                        <Button variant="tertiary" className="flex items-center gap-2">
                          Read More <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section ref={postsRef} className="py-20 sm:py-28 bg-neutral-50 fade-in-up">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="w-10 h-10 animate-spin text-primary"/>
              </div>
            ) : posts.length > 0 ? (
                posts.map((post) => (
                <article
                    key={post._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                    <div className="relative h-48">
                    <Image src={post.imageUrl || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                    </div>
                    <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-neutral-100 px-3 py-1 rounded-full text-xs font-medium text-neutral-700">
                        {post.category}
                        </span>
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-neutral-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-neutral-500">
                        <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(post.createdAt), 'MMM d, yyyy')}
                        </div>
                        </div>
                        <Link href={`/blog/${post.slug}`}>
                        <Button variant="tertiary" size="sm">
                            Read More
                        </Button>
                        </Link>
                    </div>
                    </div>
                </article>
                ))
            ) : (
                <div className="col-span-full text-center py-12">
                    <p className="text-neutral-600 text-lg">No articles found matching your criteria.</p>
                </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}