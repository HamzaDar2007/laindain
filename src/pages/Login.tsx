import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { loginAsync } from '../store/auth/authSlice';
import { selectAuthLoading, selectAuthError } from '../store/auth/authSelector';
import Input from '../components/common/Input';

const Login: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(loginAsync(formData) as any);
        if (result.meta.requestStatus === 'fulfilled') {
            navigate('/');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
                ease: [0.25, 0.1, 0.25, 1] as any,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
            {/* Cinematic Background Atmosphere */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ x: [0, 50, -20, 0], y: [0, -30, 40, 0], scale: [1, 1.1, 0.9, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: [0, -40, 30, 0], y: [0, 50, -20, 0], scale: [1, 0.9, 1.2, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-secondary-500/10 rounded-full blur-[150px]"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-md w-full glass p-8 md:p-12 rounded-[2rem] relative z-10 border border-white/40 dark:border-white/5 shadow-2xl backdrop-blur-3xl"
            >
                <div className="text-center mb-10">
                    <motion.div variants={itemVariants} className="inline-block p-4 rounded-2xl bg-primary-600/10 mb-4 ring-1 ring-primary-500/20">
                        <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </motion.div>
                    <motion.h2 variants={itemVariants} className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {t('app.title')}
                    </motion.h2>
                    <motion.p variants={itemVariants} className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {t('app.subtitle')}
                    </motion.p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, height: 0 }}
                                animate={{ opacity: 1, scale: 1, height: 'auto' }}
                                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                                className="bg-danger-50 dark:bg-danger-950/30 border border-danger-200 dark:border-danger-900/50 text-danger-700 dark:text-danger-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-shake"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div variants={itemVariants} className="space-y-5">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label={t('auth.email')}
                            required
                            fullWidth
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="name@company.com"
                            className="bg-gray-50/50 dark:bg-gray-900/50"
                        />

                        <div className="space-y-1">
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                label={t('auth.password')}
                                required
                                fullWidth
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="bg-gray-50/50 dark:bg-gray-900/50"
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full py-4 text-base font-bold shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 relative overflow-hidden group rounded-xl transition-all duration-300"
                        >
                            <span className="relative z-10">{isLoading ? t('auth.loggingIn') : t('auth.loginButton')}</span>
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-primary-600">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            )}
                        </button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-center pt-2">
                        <Link to="/register" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block group">
                            {t('auth.noAccount')}{' '}
                            <span className="font-bold text-primary-600 dark:text-primary-400 group-hover:underline underline-offset-4">
                                {t('auth.register')}
                            </span>
                        </Link>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
