import { Eye, EyeOff, Lock, User2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import { loginUser } from '../../redux/actions/authActions';
import { loginSchema } from '../../validation/authSchema';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const { token, loading } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: '', password: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  if (token) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values) => {
    const result = await dispatch(loginUser(values));

    if (!result.error) {
      navigate('/');
    }
  };

  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[36px] bg-gradient-to-br from-primary via-primary-container to-secondary p-10 text-white shadow-primary-glow lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">School Management System</p>
          <h1 className="mt-8 max-w-lg text-5xl font-black leading-tight">
            Stay on top of classes, people, and school operations in one calm workspace.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
            This portal is built for admin oversight, teacher execution, and student visibility across attendance, syllabus, tests, notices, and events.
          </p>
        </section>

        <section className="glass-panel mx-auto w-full max-w-xl p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Welcome Back</p>
          <h2 className="mt-4 text-3xl font-extrabold text-on-surface">Sign in to continue</h2>
          <p className="mt-2 text-sm text-on-surface-variant">Use your school-issued credentials to enter the portal.</p>

          <form className="mt-10 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Username</label>
              <div className="relative">
                <User2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                <input
                  {...register('username')}
                  ref={(element) => {
                    register('username').ref(element);
                    usernameRef.current = element;
                  }}
                  className="input-field pl-11"
                  placeholder="Enter your username"
                />
              </div>
              {errors.username ? <p className="text-xs font-medium text-error">{errors.username.message}</p> : null}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-11 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password ? <p className="text-xs font-medium text-error">{errors.password.message}</p> : null}
            </div>

            <div className="flex justify-end pt-2">
              <PrimaryButton type="submit" disabled={!isValid || loading} className="min-w-40">
                {loading ? 'Signing in...' : 'Sign In'}
              </PrimaryButton>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;
