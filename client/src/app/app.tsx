import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/modules/home/home-page';
import { SubmitPage } from '@/modules/submit/submit-page';
import { LeaderboardPage } from '@/modules/leaderboard/leaderboard-page';
import { JudgePage } from '@/modules/judge/judge-page';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/judge" element={<JudgePage />} />
      </Routes>
    </BrowserRouter>
  );
}
