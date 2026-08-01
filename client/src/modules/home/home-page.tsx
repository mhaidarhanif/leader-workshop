import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Workshop Judge Platform</CardTitle>
          <CardDescription>
            Submit your project, score submissions, and watch the live leaderboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild>
            <Link to="/submit">Submit Project</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/leaderboard">View Leaderboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/judge">Judge Portal</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
