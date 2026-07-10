pipeline {
    agent any

    options {
        // Keeps the console clean and limits build history
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timeout(time: 1, unit: 'HOURS')
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo '========================================='
                echo 'PHASE 1: Fetching Latest Code from Git'
                echo '========================================='
                // Jenkins automatically handles checkout if configured, 
                // but this explicitly confirms code availability
                checkout scm
            }
        }

        stage('Environment Staging') {
            steps {
                echo '========================================='
                echo 'PHASE 2: Cleaning Residual Containers'
                echo '========================================='
                sh 'docker compose down --remove-orphans'
            }
        }

        stage('Build Assets') {
            steps {
                echo '========================================='
                echo 'PHASE 3: Compiling Frontend & Backend Layers'
                echo '========================================='
                sh 'docker compose build --no-cache'
            }
        }

        stage('Production Deploy') {
            steps {
                echo '========================================='
                echo 'PHASE 4: Launching Application Stack'
                echo '========================================='
                sh 'docker compose up -d'
            }
        }

        stage('Health Verification') {
            steps {
                echo '========================================='
                echo 'PHASE 5: Verifying Operational Telemetry'
                echo '========================================='
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo '🎉 CI/CD Pipeline Executed Successfully! App is Live.'
        }
        failure {
            echo '❌ Pipeline Failed. Checking operational logs...'
        }
    }
}