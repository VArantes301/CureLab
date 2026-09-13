import AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './src/context/userContext';

export default function App() {
    return (
        <UserProvider>
            <AppNavigator />
        </UserProvider>
    );
}