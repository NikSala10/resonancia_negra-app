import { RouterProvider } from 'react-router';
import { router } from './routes';
import { GameProvider } from './context/GameContext';
import { GlitchEffect } from './components/GlitchEffect';

export default function App() {
  return (
    <GameProvider>
      <GlitchEffect />
      <RouterProvider router={router} />
    </GameProvider>
  );
}