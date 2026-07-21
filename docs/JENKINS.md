# Jenkins-in-Docker — Guided Setup (hands-on)

Goal: run a **Jenkins server locally in Docker**, point it at this repo, and let it run the
[`Jenkinsfile`](../Jenkinsfile) pipeline (install → lint → typecheck → test → build). This teaches the
core CI concepts without a cloud account.

> Prerequisite: **Docker Desktop** installed and running (`brew install --cask docker`, then launch it).

---

## 1. Run Jenkins in a container

```bash
docker run --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

- `-p 8080:8080` → the web UI at http://localhost:8080.
- `-v jenkins_home:/var/jenkins_home` → a named volume so your config/jobs survive restarts.
- `50000` → agent port (not needed for local single-node, harmless to leave).

Leave it running; watch the logs.

## 2. Unlock

First boot prints an admin password in the logs. Grab it:

```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Open http://localhost:8080 → paste it → **Install suggested plugins** → create your admin user.

**Why:** the suggested set includes Git + Pipeline, which is all we need.

## 3. Add the Node tool (the agent needs Node + pnpm)

The base Jenkins image has no Node. Easiest path:

1. **Manage Jenkins → Plugins → Available** → install **NodeJS**. Restart when prompted.
2. **Manage Jenkins → Tools → NodeJS installations → Add NodeJS** → name it `node22`, pick version 22.x.
3. This repo's `Jenkinsfile` enables pnpm via `corepack`, so no separate pnpm tool is required — just Node.

> If you want the `Docker build` stage to work too, the Jenkins container also needs the Docker CLI +
> access to the host Docker socket. That's an advanced add-on; skip it first time (the stage will fail
> only at the end, after the important stages pass). To enable later, run Jenkins with
> `-v /var/run/docker.sock:/var/run/docker.sock` and install the Docker CLI in the container.

## 4. Create the pipeline job

1. **New Item** → name `prepdeck` → **Pipeline** → OK.
2. Under **Pipeline**, choose **Pipeline script from SCM**.
3. **SCM: Git**, Repository URL = your repo URL (for a private repo add credentials:
   **Add → Username + GitHub Personal Access Token**).
4. Branch: `*/main`. Script Path: `Jenkinsfile`.
5. To make Node available, wrap or configure the job to use the `node22` tool — simplest is to add a
   small `tools { nodejs 'node22' }` block to the `Jenkinsfile` `pipeline {}` once the tool exists.
6. **Save → Build Now.**

## 5. Watch it run

Open the build → **Console Output**. You'll see each stage:

```
Install → Lint → Typecheck → Test → Build → (Docker build)
```

Green = pass. Click a stage in **Stage View** to see timing.

---

## What you just learned

- **Agent** — where steps run (here: the Jenkins container itself).
- **Pipeline / stages** — declarative CI steps in `Jenkinsfile`, versioned with the code.
- **SCM polling / build triggers** — Jenkins pulls the repo and runs the pipeline.
- **Tools** — provisioning runtimes (Node) the agent doesn't ship with.
- **Volumes** — persisting Jenkins state across container restarts.

## GitHub Actions (compare)

The same checks run in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) with zero server to
manage — push to GitHub and it runs automatically. Jenkins = self-hosted control; Actions = managed
convenience. Knowing both is the point.

## Cleanup

```bash
docker stop jenkins && docker rm jenkins   # keep the volume (config persists)
docker volume rm jenkins_home              # wipe everything
```
