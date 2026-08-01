import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContainer } from '@/components/app-container';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { parseScreenshotUrls } from '../shared/http';
import { useSubmit } from './use-submit';

export function SubmissionForm() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [teamName, setTeamName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [deployUrl, setDeployUrl] = useState('');
  const [screenshots, setScreenshots] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => navigate('/leaderboard'), 2000);
    return () => clearTimeout(timer);
  }, [showSuccess, navigate]);

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
        onSuccess: () => setShowSuccess(true),
      },
    );
  };

  if (showSuccess) {
    return (
      <Card className="border-0 shadow-elevated">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <CheckCircle2 className="size-12 text-primary" aria-hidden />
          <p className="font-display text-xl font-bold text-primary">Submission received</p>
          <p className="text-muted-foreground">Redirecting to leaderboard…</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div className="flex flex-col gap-6">
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
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="deploy">Deployed URL</Label>
          <Input
            id="deploy"
            type="url"
            value={deployUrl}
            onChange={(e) => setDeployUrl(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="screenshots">Screenshot URLs (one per line)</Label>
          <Textarea
            id="screenshots"
            value={screenshots}
            onChange={(e) => setScreenshots(e.target.value)}
            required
          />
        </div>
        {submit.error && <p className="text-destructive text-lg">{submit.error.message}</p>}
        <Button type="submit" disabled={submit.isPending} size="pill-lg" className="w-fit">
          {submit.isPending ? 'Submitting…' : 'Submit'}
        </Button>
      </div>

      <Card className="h-fit bg-muted/50">
        <CardContent className="flex flex-col gap-4 p-6">
          <p className="font-display font-bold">Before you submit</p>
          <ul className="flex flex-col gap-2 text-base text-muted-foreground">
            <li>Repo root must include PRD.md and RFC.md on main.</li>
            <li>Deploy URL should be publicly reachable.</li>
            <li>Screenshots help judges preview your project.</li>
            <li>One submission per team — double-check URLs.</li>
          </ul>
        </CardContent>
      </Card>
    </form>
  );
}

export function SubmitPage() {
  return (
    <AppContainer as="main" className="py-10">
      <div className="flex flex-col gap-8">
        <PageHeader
          eyebrow="Participants"
          title="Submit project"
          description="One submission per team. Double-check your URLs before submitting."
        />
        <SubmissionForm />
      </div>
    </AppContainer>
  );
}
