//app/login/page.tsx
import { Metadata } from 'next';
import { LoginForm } from '../ui/forms/LoginForm';

export const metadata: Metadata = {
  title: 'Log in',
};

export default async function Login() {

  return (
    <div className="bg-cover bg-center bg-fixed flex items-center justify-center py-8 px-4">
      Pagina de Login 🔐
      {/*<LoginForm />*/}
    </div>
  );
}