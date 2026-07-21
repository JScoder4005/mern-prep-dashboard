// Declarative pipeline. Assumes the agent has Node 22 + pnpm available
// (see docs/JENKINS.md for the guided Jenkins-in-Docker setup).
pipeline {
  agent any

  environment {
    NEXT_TELEMETRY_DISABLED = '1'
  }

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  stages {
    stage('Install') {
      steps {
        sh 'corepack enable && corepack prepare pnpm@10.20.0 --activate'
        sh 'pnpm install --frozen-lockfile'
      }
    }
    stage('Lint') {
      steps { sh 'pnpm lint' }
    }
    stage('Typecheck') {
      steps { sh 'pnpm typecheck' }
    }
    stage('Test') {
      steps { sh 'pnpm test' }
    }
    stage('Build') {
      steps { sh 'pnpm build' }
    }
    // Optional: requires the Docker CLI + daemon socket available to the agent.
    stage('Docker build') {
      steps { sh 'docker build -t prepdeck:latest .' }
    }
  }

  post {
    success { echo '✅ Pipeline succeeded' }
    failure { echo '❌ Pipeline failed' }
  }
}
