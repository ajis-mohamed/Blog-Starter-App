import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../config/configFirebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { AuthContext } from '../App';
import axios from 'axios';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const URL = 'https://blog-starter-app-717g.onrender.com/'
    const { role, setRole } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            console.log('Firebase User created successfully:', firebaseUser.uid);

            const response = await axios.post(`${URL}users`, {
                name: name,
                email: email,
                role: role,
                uid: firebaseUser.uid
            });
            console.log('User saved to MongoDB successfully:', response.data);
            
            navigate('/login');

        } catch (error) {
            console.error('Error during signup:', error.message);
            alert(error.message);
        } finally {
            setLoading(false);
            setName('');
            setEmail('');
            setPassword('');
            setRole('');
        }

    };

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        navigate('/', { state: { scrollTo: targetId } });
    };

    console.log('Current role:', role);
    return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#2C2C2A] flex flex-col justify-between font-sans selection:bg-[#E5EDE6]">
            {/* Header */}
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
                            onClick={() => navigate('/login')}
                        >Log in <span aria-hidden="true">↗</span></button>
                    </nav>
                </div>
            </header>

            {/* Main Form Section */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-[#EFECE6] shadow-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-serif mb-2">Create an account.</h1>
                        <p className="text-sm text-[#70706B]">Start capturing your thoughts and ideas today.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-[#70706B] mb-2 font-medium">
                                Role
                            </label>
                            <select
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value)
                                    console.log('Selected role:', e.target.value)
                                }}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#EFECE6] focus:outline-none focus:border-[#2C5E43] text-sm text-[#243b36] transition-colors"
                            >
                                <option value="" disabled>Select your role</option>
                                <option value="writer">Writer</option>
                                <option value="reader">Reader</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-[#70706B] mb-2 font-medium">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Jane Doe"
                                className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#EFECE6] focus:outline-none focus:border-[#2C5E43] text-sm transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-[#70706B] mb-2 font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#EFECE6] focus:outline-none focus:border-[#2C5E43] text-sm transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-[#70706B] mb-2 font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#EFECE6] focus:outline-none focus:border-[#2C5E43] text-sm transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-[#2C5E43] text-white rounded-xl text-sm font-medium hover:bg-[#234b35] transition-colors shadow-sm mt-2 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-[#70706B] mt-6">
                        Already have an account?{' '}
                        <a href="/login" className="text-[#2C5E43] font-medium hover:underline">
                            Log in
                        </a>
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full px-8 py-6 border-t border-[#EFECE6]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#70706B]">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                    <span className="w-5 h-5 bg-[#2C5E43] text-white flex items-center justify-center rounded text-[10px]">b.</span>
                    <span className="font-serif text-[#2C5E43] font-medium">Broadleaf</span>
                </div>
                <p>Made for your thoughts. © 2026</p>
            </footer>
        </div>
    );
}