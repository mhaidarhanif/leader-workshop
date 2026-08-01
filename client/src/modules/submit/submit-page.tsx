import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { parseScreenshotUrls } from '../shared/http';
import { useSubmit } from './use-submit';

export function SubmissionForm() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [teamName, setTeamName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [deployUrl, setDeployUrl] = useState('');
  const [screenshots, setScreenshots] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit.mutate(
      {
        team_name: teamName,
        github_url: githubUrl,
        deploy_url: deployUrl,
        screenshot_urls: parseScreenshotUrls(screenshots),
      },
      {
        onSuccess: () => navigate('/leaderboard'),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="team">Team name</Label>
        <Input id="team" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="github">GitHub repo URL (root)</Label>
        <Input
          id="github"
          type="url"
          placeholder="https://github.com/org/repo"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          required
        />
        <p className="text-muted-foreground text-base">Must include PRD.md and RFC.md at repo root on main.</p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="deploy">Deployed URL</Label>
        <Input id="deploy" type="url" value={deployUrl} onChange={(e) => setDeployUrl(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="screenshots">Screenshot URLs (one per line)</Label>
        <Textarea id="screenshots" value={screenshots} onChange={(e) => setScreenshots(e.target.value)} required />
      </div>
      {submit.error && <p className="text-destructive text-lg">{submit.error.message}</p>}
      <Button type="submit" disabled={submit.isPending}>
        {submit.isPending ? 'Submitting…' : 'Submit'}
      </Button>
    </form>
  );
}

export function SubmitPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <Card>
        <CardHeader>
          <CardTitle>Submit Project</CardTitle>
          <CardDescription>One submission per team. Double-check your URLs before submitting.</CardDescription>
        </CardHeader>
        <CardContent>
          <SubmissionForm />
          <Button asChild variant="outline" className="mt-6">
            <Link to="/">Back home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
