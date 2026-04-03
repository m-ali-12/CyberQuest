import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-cyber-green/30 border-t-cyber-green rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
