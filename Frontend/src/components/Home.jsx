import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import auth from '../config/configFirebase'
import { AuthContext } from '../App'

function Home() {
    const { user, setUser } = useContext(AuthContext);

    const URL = 'https://blog-starter-app-717g.onrender.com/'
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [posts, setPosts] = useState([])
    const [currentLikes, setCurrentLikes] = useState(0);
    const navigate = useNavigate()

    const { role } = useContext(AuthContext);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await axios.get(`${URL}posts`);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        }
        fetchPosts();
    }, []);

    async function addPost(event) {
        event.preventDefault();

        if (!title.trim() || !content.trim()) return;

        try {
            await axios.post(`${URL}posts`, {
                id: posts.length + 1,
                title: title.trim(),
                content: content.trim()
            });

            setTitle('');
            setContent('');

            // Re-fetch posts so the new story shows up immediately
            const response = await axios.get(`${URL}posts`);
            setPosts(response.data.reverse()); // Reverse the order to show the newest post first   

        } catch (error) {
            console.error('Error adding post:', error);
        }
    }

    async function handleLike(id) {
        console.log(`Liked post with id: ${id}`);
        try {
            const response = await axios.patch(`${URL}like/${id}`);

            if (response.status === 200) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        (post.id === id || post._id === id)
                            ? { ...post, likes: post.likes + 1 }
                            : post
                    )
                );
            }
        } catch (error) {
            console.log("Something went wrong while liking the post:", error);
        }
    }

    // Smooth scroll handler to fix the "too fast" anchor jump
    const handleNavClick = (e, targetId) => {
        e.preventDefault()
        const target = document.getElementById(targetId)
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div id="home" className="min-h-screen min-w-[320px] bg-[radial-gradient(ellipse_at_8%_14%,rgba(214,231,210,0.78),transparent_34rem),radial-gradient(ellipse_at_94%_44%,rgba(246,221,193,0.58),transparent_30rem),linear-gradient(145deg,#f5f6f0_0%,#edf2ec_54%,#f6f0e7_100%)] font-sans text-[#243b36] antialiased">
            <header className="sticky top-0 z-50 border-b border-[#375348]/15 bg-[#f4f6f0]/85 backdrop-blur-xl">
                <div className="mx-auto flex h-[70px] w-[calc(100%-28px)] max-w-[1080px] items-center justify-between sm:h-[86px] sm:w-[calc(100%-64px)]">
                    <a className="inline-flex items-center gap-2.5 text-[13px] font-bold sm:text-[15px]" href="#home" onClick={(e) => handleNavClick(e, 'home')} aria-label="Broadleaf home">
                        <span className="grid size-7 place-items-center rounded-[10px] bg-[#315c4f] font-serif text-[19px] text-[#f5f4e9] sm:size-[31px]">b.</span>
                        <span>Broadleaf</span>
                    </a>
                    <nav className="flex items-center gap-2 text-[11px] text-[#5c6c65] sm:gap-[34px] sm:text-[13px]" aria-label="Main navigation">
                        <a className="transition-colors hover:text-[#315c4f]" href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
                        <a className="transition-colors hover:text-[#315c4f]" href="#blog" onClick={(e) => handleNavClick(e, 'blog')}>Blog</a>
                        <a className="transition-colors hover:text-[#315c4f]" href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a>
                        <button className="inline-flex min-h-[35px] items-center gap-[7px] rounded-md border border-[#315c4f]/30 bg-white/40 px-[11px] text-[11px] text-[#243b36] transition hover:-translate-y-px hover:bg-white/80 sm:min-h-[39px] sm:gap-3 sm:px-4 sm:text-[13px]" type="button"
                            onClick={() => {
                                if (user) {
                                    auth.signOut().then(() => {
                                        console.log('User signed out successfully');
                                        setUser(false);
                                        navigate('/');
                                    }).catch((error) => {
                                        console.error('Error signing out:', error);
                                    });
                                } else {
                                    navigate('/login');
                                }
                            }}
                        >{user ? 'Log out' : 'Log in'}<span aria-hidden="true">↗</span></button>
                    </nav>
                </div>
            </header>

            <main className="mx-auto w-[calc(100%-28px)] max-w-[1080px] sm:w-[calc(100%-64px)]">
                <section className="grid grid-cols-1 items-center gap-6 py-10 sm:grid-cols-[1fr_0.83fr] sm:gap-14 sm:py-[55px] sm:pb-[60px]" aria-labelledby="intro-title">
                    <div>
                        <p className="flex items-center gap-[9px] text-[10px] font-bold tracking-[1.1px] text-[#728179]"><span className="size-[7px] rounded-full bg-[#bf7656] shadow-[0_0_0_4px_rgba(191,118,86,0.12)]" /> A little space for big thoughts</p>
                        <h1 id="intro-title" className="my-[19px] font-serif text-[51px] font-medium leading-[0.99] sm:text-[70px]">Ideas worth<br /><span className="text-[#708b65] italic">keeping.</span></h1>
                        <p className="mb-[21px] max-w-[375px] text-[14px] leading-[1.75] text-[#6c7b73]">A quiet corner of the internet to collect your thoughts, share what you love, and come back to it all later.</p>
                        <a className="inline-flex items-center gap-2.5 text-xs font-bold text-[#315c4f]" href="#blog" onClick={(e) => handleNavClick(e, 'blog')}>Start reading <span className="grid size-[23px] place-items-center rounded-full border border-[#315c4f]/30" aria-hidden="true">↓</span></a>
                    </div>
                    <div className="relative flex min-h-[200px] items-end overflow-hidden rounded-lg border border-white/70 p-6 shadow-[0_18px_48px_rgba(57,76,59,0.12)] sm:min-h-[260px]" role="img" aria-label="A notebook and pen on a writing desk">
                        <img className="absolute inset-0 size-full object-cover object-[center_48%]" src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1100&q=85" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1b3026]/5 to-[#1b3026]/70" />
                        <div className="relative z-10 text-white"><span className="mb-[9px] block text-[9px] font-bold tracking-[1.1px] text-white/80">01 / YOUR JOURNAL</span><strong className="font-serif text-[25px] font-medium leading-[1.15]">Make room<br />for a thought.</strong></div>
                        <span className="absolute right-5 top-[18px] text-[25px] text-white" aria-hidden="true">✳</span>
                    </div>
                </section>

                <section className="scroll-mt-24 border-t border-[#375348]/15 py-[27px] sm:py-[33px] sm:pb-16" id="blog" aria-labelledby="blog-title">
                    <div className="mb-5 flex items-end justify-between">
                        <div>
                            <p className="mb-2 text-[10px] font-bold tracking-[1.1px] text-[#728179]">YOUR PERSONAL EDITION</p>
                            <h2 id="blog-title" className="font-serif text-[31px] font-medium">The blog</h2>
                        </div>
                        <p className="mb-1 text-xs text-[#738078]"><span className="text-base font-bold text-[#315c4f]">{posts.length.toString().padStart(2, '0')}</span> {posts.length === 1 ? 'story' : 'stories'}</p>
                    </div>

                    {
                        role === 'writer' &&
                        (
                            <form className="rounded-lg border border-white/80 bg-white/55 p-4 shadow-[0_12px_38px_rgba(55,77,62,0.075)] backdrop-blur-lg sm:p-6" onSubmit={addPost}>
                                <div className="mb-[19px] flex items-center gap-3">
                                    <span className="grid size-9 place-items-center rounded-md border border-[#315c4f]/15 bg-[#dde9d9]/70 text-lg text-[#315c4f]" aria-hidden="true">✎</span>
                                    <div><h3 className="mb-[3px] text-sm font-bold">Write something</h3><p className="mb-0 text-[11px] text-[#71817a]">Every good story starts somewhere.</p></div>
                                </div>
                                <label className="mb-[7px] block text-[11px] font-bold text-[#52635a]" htmlFor="post-title">Title</label>
                                <input
                                    id="post-title"
                                    className="h-[43px] w-full rounded-[5px] border border-[#375348]/15 bg-white/60 px-3 text-[13px] text-[#243b36] placeholder:text-[#9aa69f] focus:border-[#315c4f]/60 focus:bg-white focus:outline-none"
                                    type="text"
                                    placeholder="Give your story a title..."
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    required
                                />
                                <label className="mb-[7px] mt-4 block text-[11px] font-bold text-[#52635a]" htmlFor="post-content">Your story</label>
                                <textarea
                                    className="block min-h-[118px] w-full resize-y rounded-[5px] border border-[#375348]/15 bg-white/60 p-3 text-[13px] leading-[1.6] text-[#243b36] placeholder:text-[#9aa69f] focus:border-[#315c4f]/60 focus:bg-white focus:outline-none"
                                    id="post-content"
                                    placeholder="What's on your mind?"
                                    value={content}
                                    onChange={(event) => setContent(event.target.value)}
                                    rows="5"
                                    required
                                />
                                <div className="mt-[15px] flex flex-col items-start justify-between gap-3 min-[421px]:flex-row min-[421px]:items-center">
                                    <span className="text-[11px] text-[#829087]"><span className="mr-1 text-[#748c68]" aria-hidden="true">◌</span> A space to think out loud</span>
                                    <button className="inline-flex min-h-[39px] items-center gap-[17px] self-end rounded-[5px] bg-[#315c4f] px-[15px] text-xs font-semibold text-white transition hover:-translate-y-px hover:bg-[#24483d]" type="submit">Add story <span aria-hidden="true"></span></button>
                                </div>
                            </form>
                        )
                    }
                    <div className="mt-4 grid gap-3" aria-live="polite">
                        {posts.length === 0 ? (
                            <div className="flex min-h-[74px] items-center gap-3 rounded-md border border-dashed border-[#375348]/20 px-5 py-[17px] text-[#78867e]">
                                <span className="text-[17px] text-[#a0ae91]" aria-hidden="true">✳</span>
                                <p className="mb-0 text-xs">Your first story is waiting to be written.</p>
                            </div>
                        ) : (
                            posts.map((post, index) => {
                                const currentLikes = typeof post.likes === 'number' ? post.likes : 0;
                                return (
                                    <article className="animate-slide-up grid grid-cols-[39px_minmax(0,1fr)_auto] items-start gap-3 rounded-md border border-white/75 bg-white/50 px-[14px] py-4 shadow-[0_8px_25px_rgba(55,77,62,0.045)] backdrop-blur-md min-[421px]:gap-[17px] min-[421px]:px-[22px] min-[421px]:py-5" key={post._id || post.id}>
                                        <div className="grid size-[34px] place-items-center rounded-md bg-[#dde9d9]/70 text-xs font-bold text-[#315c4f] min-[421px]:size-[39px]">{(posts.length - index).toString().padStart(2, '0')}</div>
                                        <div className="min-w-0">
                                            <p className="mb-2 mt-0 text-[9px] font-bold tracking-[0.8px] text-[#819087]">JUST ADDED <span className="px-1 text-[#bf7656]">·</span> YOUR JOURNAL</p>
                                            <h3 className="mb-2 font-serif text-[21px] font-medium">{post.title}</h3>
                                            <p className="mb-0 whitespace-pre-wrap break-words text-[13px] leading-[1.7] text-[#65756c]">{post.content}</p>

                                            {/* Like Button */}
                                            <div className="mt-4 flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${post.liked
                                                        ? 'bg-[#bf7656]/10 border-[#bf7656]/30 text-[#bf7656]'
                                                        : 'bg-white/60 border-[#375348]/15 text-[#52635a] hover:bg-white'
                                                        }`}
                                                    onClick={() => handleLike(post.id)}
                                                >
                                                    <span>❤️</span>
                                                    <span>{currentLikes}</span>
                                                    <span className="text-[10px] text-[#71817a] ml-0.5">{currentLikes === 1 ? 'like' : 'likes'}</span>
                                                </button>
                                            </div>
                                        </div>
                                        <span className="text-lg text-[#a4b392] max-[420px]:hidden" aria-hidden="true">✳</span>
                                    </article>
                                );
                            })
                        )}
                    </div>
                </section>

                <section className="about-section py-12 border-t border-[#375348]/15" id="about">
                    <span className="about-mark block font-serif text-3xl text-[#315c4f] mb-3" aria-hidden="true">b.</span>
                    <div>
                        <p className="eyebrow text-xs font-bold tracking-widest text-[#728179] mb-1">A NOTE ABOUT THIS SPACE</p>
                        <h2 className="font-serif text-2xl font-medium">Made for the things<br />you don't want to forget.</h2>
                    </div>
                    <p className="about-copy text-sm text-[#6c7b73] mt-3">No noise, no pressure. Just a place to put your words and let them be yours.</p>
                </section>
            </main>

            <footer className="footer border-t border-[#375348]/15 py-6 px-4 flex justify-between items-center text-xs text-[#738078] max-w-[1080px] mx-auto">
                <a className="brand footer-brand flex items-center gap-2 font-bold text-[#243b36]" href="#home" onClick={(e) => handleNavClick(e, 'home')}>
                    <span className="brand-mark grid size-5 place-items-center rounded bg-[#315c4f] text-white text-[10px]">b.</span>
                    <span>Broadleaf</span>
                </a>
                <span>Made for your thoughts. © 2026</span>
            </footer>
        </div>
    )
}

export default Home