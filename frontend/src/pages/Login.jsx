import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-crm-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-crm-card border border-crm-border rounded-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-crm-brand p-3 rounded-xl text-white mb-4 shadow-lg shadow-crm-brand/20">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Enterprise CRM Access</h1>
          <p className="text-sm text-crm-textMuted mt-1">Provide credentials to enter</p>
        </div>

        {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-sm text-rose-400 mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Email Address" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Account Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full py-3 mt-2" disabled={loading}>
            {loading ? 'Authenticating Gateway...' : 'Secure Authorization Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;