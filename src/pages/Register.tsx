import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { registerAsync } from '../store/auth/authSlice';
import { selectAuthLoading, selectAuthError } from '../store/auth/authSelector';

const Register: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        countryCode: 'AE',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert(t('validation.passwordMatch'));
            return;
        }

        const result = await dispatch(registerAsync({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            countryCode: formData.countryCode,
        }) as any);

        if (result.meta.requestStatus === 'fulfilled') {
            navigate('/login');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.08,
                ease: [0.22, 1, 0.36, 1] as any,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 10 },
        visible: { opacity: 1, scale: 1, y: 0 }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
            {/* Cinematic Background Atmosphere */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[160px]"
                />
                <motion.div
                    animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] bg-secondary-500/5 rounded-full blur-[180px]"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-2xl w-full glass p-8 md:p-12 rounded-[2.5rem] relative z-10 border border-white/40 dark:border-white/5 shadow-2xl backdrop-blur-3xl"
            >
                <div className="text-center mb-10">
                    <motion.div variants={itemVariants} className="inline-block p-4 rounded-2xl bg-primary-600/10 mb-4 ring-1 ring-primary-500/20">
                        <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </motion.div>
                    <motion.h2 variants={itemVariants} className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {t('auth.register')}
                    </motion.h2>
                    <motion.p variants={itemVariants} className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {t('app.subtitle')}
                    </motion.p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-danger-50 dark:bg-danger-950/30 border border-danger-200 dark:border-danger-900/50 text-danger-700 dark:text-danger-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-shake overflow-hidden"
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants}>
                            <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                                {t('auth.firstName')}
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                required
                                className="input rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                                {t('auth.lastName')}
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                required
                                className="input rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="md:col-span-2">
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                                {t('auth.email')}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="input rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                                {t('auth.password')}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="input rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                                {t('auth.confirmPassword')}
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="input rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="md:col-span-2">
                            <label htmlFor="countryCode" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                                {t('auth.country')}
                            </label>
                            <select
                                id="countryCode"
                                name="countryCode"
                                className="input rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800"
                                value={formData.countryCode}
                                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                            >
                                <option value="AE">United Arab Emirates</option>
                                <option value="SA">Saudi Arabia</option>
                                <option value="EG">Egypt</option>
                            </select>
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full py-4 text-base font-bold shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 relative overflow-hidden group rounded-xl transition-all duration-300"
                        >
                            <span className="relative z-10">{isLoading ? t('auth.registering') : t('auth.registerButton')}</span>
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

                    <motion.div variants={itemVariants} className="text-center">
                        <Link to="/login" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block group font-medium">
                            {t('auth.haveAccount')}{' '}
                            <span className="font-bold text-primary-600 dark:text-primary-400 group-hover:underline underline-offset-4">
                                {t('auth.login')}
                            </span>
                        </Link>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
