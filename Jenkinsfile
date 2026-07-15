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
                
                // We send a POST request to /tasks and specify the template ID in the JSON body
                sh '''
                curl -X POST \
                  -H "Authorization: Bearer rafx6chp3f3olgfvo-3dkxdypnhmzvusy-znu_bhtd4=" \
                  -H "Content-Type: application/json" \
                  -d '{"template_id": 1}' \
                  http://ansible-semaphore:3000/api/project/1/tasks
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