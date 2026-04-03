import { Suspense } from 'react';
import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-cyber-green/30 border-t-cyber-green rounded-full animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
