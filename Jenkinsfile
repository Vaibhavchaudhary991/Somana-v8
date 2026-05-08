pipeline {
    agent any



    stages {
        stage('Checkout') {
            steps {
                // Checkout the repository
                checkout scm
            }
        }

        stage('Copy Environment Variables') {
            steps {
                // In a real production setup, you would use Jenkins Credentials plugin
                // to inject secrets here instead of relying on a local file.
                // For now, we assume .env.local exists on the Jenkins server or we copy it.
                script {
                    if (isUnix()) {
                        sh 'cp .env.local .env || true'
                    } else {
                        bat 'copy .env.local .env >nul 2>&1 || exit 0'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker Image...'
                script {
                    if (isUnix()) {
                        sh 'docker-compose build'
                    } else {
                        bat 'docker-compose build'
                    }
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                echo 'Deploying Application...'
                script {
                    if (isUnix()) {
                        sh 'docker-compose up -d'
                    } else {
                        bat 'docker-compose up -d'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution complete.'
        }
        success {
            echo 'Deployment finished successfully! App is running.'
        }
        failure {
            echo 'Deployment failed! Check the logs.'
        }
    }
}
