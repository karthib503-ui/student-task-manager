pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timeout(time: 1, unit: 'HOURS')
    }

    stages {
        stage('Trigger External Ansible Pipeline') {
            steps {
                echo '========================================='
                echo '🚀 Activating Separate Semaphore Worker via API Webhook'
                echo '========================================='
                
                // Triggers the playbook run over the network via Semaphore's REST API
                // 1. Replace PASTE_YOUR_ACTUAL_TOKEN with the token string from Step 1
                // 2. Ensure project/1/templates/1 matches your real IDs from Step 2
                sh '''
                curl -X POST \
                  -H "Authorization: Bearer oducykhrp-2hthf1nhjk4kayzflebdz-a3wdqqfkqsw=" \
                  -H "Content-Type: application/json" \
                  http://ansible-semaphore:3000/api/project/1/templates/1/execute
                '''
            }
        }
    }

    post {
        success {
            echo '🎉 Webhook delivered successfully! Tracking execution inside Semaphore GUI.'
        }
        failure {
            echo '❌ Pipeline connectivity failed. Verify internal network route or token authorization.'
        }
    }
}