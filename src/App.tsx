import './globals.css'
import SignInForm from './_auth/forms/SignInForm';
import SignUp from './_auth/forms/SignUp';
import AuthLayout from './_auth/AuthLayout';
import { Routes, Route } from 'react-router-dom'
import { Home } from './_root/pages';
import RootLayout from './_root/RootLayout';
const App = () => {
    return (
        <main className='flex h-screen'>
            <Routes>
                {/* public routes */}
                <Route element={<AuthLayout />}>
                    <Route path='/sign-in' element={<SignInForm />} />
                    <Route path='/sign-up' element={<SignUp />} />
                </Route>
                {/* private routes */}
                <Route element={<RootLayout />}>
                    <Route index element={<Home />} />
                </Route>
            </Routes>
        </main >
    )
}

export default App